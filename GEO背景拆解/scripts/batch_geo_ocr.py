#!/usr/bin/env python3
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def summarize_lines(payload: dict, limit: int = 20) -> list[str]:
    lines = sorted(payload.get("lines", []), key=lambda item: (item.get("y", 0), item.get("x", 0)))
    return [item["text"].strip() for item in lines if item.get("text", "").strip()][:limit]


def make_thumbnail(preview_path: Path, output_path: Path, label: str) -> None:
    with Image.open(preview_path) as source:
        image = source.convert("RGB")
    target_width = 420
    target_height = max(1, round(image.height * target_width / image.width))
    image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
    image = image.crop((0, 0, target_width, min(500, image.height)))
    canvas = Image.new("RGB", (target_width, image.height + 40), "white")
    canvas.paste(image, (0, 40))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 12), label, fill="#111827", font=ImageFont.load_default())
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, format="PNG")


def create_contact_sheets(
    thumbnail_paths: list[Path], output_dir: Path, columns: int = 4, rows: int = 4
) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    page_size = columns * rows
    slot_width = 440
    slot_height = 560
    sheets: list[Path] = []
    for page_index, start in enumerate(range(0, len(thumbnail_paths), page_size), start=1):
        page_items = thumbnail_paths[start : start + page_size]
        sheet = Image.new("RGB", (columns * slot_width, rows * slot_height), "#e5e7eb")
        for item_index, path in enumerate(page_items):
            with Image.open(path) as thumb:
                image = thumb.convert("RGB")
            if image.width > slot_width - 20 or image.height > slot_height - 20:
                image.thumbnail((slot_width - 20, slot_height - 20), Image.Resampling.LANCZOS)
            column = item_index % columns
            row = item_index // columns
            x = column * slot_width + (slot_width - image.width) // 2
            y = row * slot_height + 10
            sheet.paste(image, (x, y))
        output_path = output_dir / f"contact-sheet-{page_index:02d}.png"
        sheet.save(output_path, format="PNG")
        sheets.append(output_path)
    return sheets


def crop_top_preview(record: dict, output_path: Path, top_pixels: int) -> None:
    crop_height = min(top_pixels, record["height"])
    target_width = min(2000, record["width"])
    subprocess.run(
        [
            "sips",
            "-c",
            str(crop_height),
            str(record["width"]),
            "--cropOffset",
            "0",
            "0",
            "--resampleWidth",
            str(target_width),
            record["absolute_path"],
            "--out",
            str(output_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )


def run_batch(inventory_path: Path, output_dir: Path, ocr_binary: Path, top_pixels: int) -> dict:
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    records = inventory["images"]
    ocr_dir = output_dir / "ocr"
    thumbnail_dir = output_dir / "thumbnails"
    contact_dir = output_dir / "contact-sheets"
    ocr_dir.mkdir(parents=True, exist_ok=True)
    thumbnail_dir.mkdir(parents=True, exist_ok=True)
    errors: list[dict] = []
    summaries: list[dict] = []

    for index, record in enumerate(records, start=1):
        stem = Path(record["filename"]).stem
        ocr_path = ocr_dir / f"{stem}.json"
        thumbnail_path = thumbnail_dir / record["filename"]
        try:
            if not ocr_path.is_file() or not thumbnail_path.is_file():
                with tempfile.TemporaryDirectory(prefix="geo-top-preview-") as folder:
                    preview_path = Path(folder) / "top.png"
                    raw_ocr_path = Path(folder) / "ocr.json"
                    crop_top_preview(record, preview_path, top_pixels)
                    if not ocr_path.is_file():
                        subprocess.run(
                            [str(ocr_binary), str(preview_path), str(raw_ocr_path), "2400"],
                            check=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.PIPE,
                            text=True,
                        )
                        payload = json.loads(raw_ocr_path.read_text(encoding="utf-8"))
                        payload["source_image"] = record["absolute_path"]
                        payload["source_width"] = record["width"]
                        payload["source_height"] = record["height"]
                        payload["crop_top_pixels"] = min(top_pixels, record["height"])
                        ocr_path.write_text(
                            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
                        )
                    if not thumbnail_path.is_file():
                        make_thumbnail(preview_path, thumbnail_path, record["filename"])
            payload = json.loads(ocr_path.read_text(encoding="utf-8"))
            summaries.append(
                {"filename": record["filename"], "lines": summarize_lines(payload), "line_count": len(payload.get("lines", []))}
            )
            print(f"[{index}/{len(records)}] {record['filename']}", flush=True)
        except Exception as error:
            errors.append({"filename": record["filename"], "error": str(error)})
            print(f"[{index}/{len(records)}] ERROR {record['filename']}: {error}", flush=True)

    thumbnail_paths = [thumbnail_dir / record["filename"] for record in records if (thumbnail_dir / record["filename"]).is_file()]
    sheets = create_contact_sheets(thumbnail_paths, contact_dir)
    lines = ["# GEO 图片标题 OCR 摘要", "", f"- 图片：{len(records)} 张", f"- 成功：{len(summaries)} 张", f"- 失败：{len(errors)} 张", ""]
    for item in summaries:
        lines.extend([f"## {item['filename']}", "", " / ".join(item["lines"]) or "（未识别到文字）", ""])
    (output_dir / "ocr-summary.md").write_text("\n".join(lines), encoding="utf-8")
    result = {"image_count": len(records), "success_count": len(summaries), "errors": errors, "contact_sheet_count": len(sheets)}
    (output_dir / "ocr-run.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    if errors:
        raise RuntimeError(f"OCR batch failed for {len(errors)} image(s)")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract title OCR and contact sheets for GEO images.")
    parser.add_argument("inventory", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--ocr-binary", type=Path, required=True)
    parser.add_argument("--top-pixels", type=int, default=4800)
    args = parser.parse_args()
    result = run_batch(args.inventory, args.output_dir, args.ocr_binary, args.top_pixels)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
