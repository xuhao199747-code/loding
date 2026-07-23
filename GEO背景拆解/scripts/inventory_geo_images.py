#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import struct
from collections import Counter
from pathlib import Path


NUMBERED_PNG = re.compile(r"^(Group|image)\s+(\d+)\.png$", re.IGNORECASE)
KIND_ORDER = {"Group": 0, "image": 1, "other": 2}
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def file_identity(path: Path) -> tuple[str, int | None]:
    match = NUMBERED_PNG.match(path.name)
    if not match:
        return "other", None
    raw_kind = match.group(1)
    kind = "Group" if raw_kind.lower() == "group" else "image"
    return kind, int(match.group(2))


def read_png_dimensions(path: Path) -> tuple[int, int]:
    with path.open("rb") as handle:
        header = handle.read(24)
    if len(header) != 24 or header[:8] != PNG_SIGNATURE or header[12:16] != b"IHDR":
        raise ValueError(f"invalid PNG header: {path}")
    return struct.unpack(">II", header[16:24])


def scan_images(source_dir: Path, excluded_names: set[str]) -> list[dict]:
    source_dir = Path(source_dir)
    if not source_dir.is_dir():
        raise FileNotFoundError(source_dir)

    records: list[dict] = []
    for path in source_dir.iterdir():
        if not path.is_file() or path.suffix.lower() != ".png" or path.name in excluded_names:
            continue
        kind, number = file_identity(path)
        width, height = read_png_dimensions(path)
        records.append(
            {
                "filename": path.name,
                "absolute_path": str(path.resolve()),
                "kind": kind,
                "number": number,
                "width": width,
                "height": height,
                "sha256": sha256_file(path),
                "bytes": path.stat().st_size,
            }
        )

    return sorted(
        records,
        key=lambda item: (
            KIND_ORDER[item["kind"]],
            item["number"] if item["number"] is not None else 10**12,
            item["filename"],
        ),
    )


def write_inventory(records: list[dict], source_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "source_dir": str(source_dir.resolve()),
        "image_count": len(records),
        "total_bytes": sum(item["bytes"] for item in records),
        "images": records,
    }
    (output_dir / "inventory.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    dimension_counts = Counter(f'{item["width"]}×{item["height"]}' for item in records)
    lines = [
        "# GEO 图片资产清单",
        "",
        f"- 来源目录：`{source_dir.resolve()}`",
        f"- 待处理图片：{len(records)} 张",
        f"- 总大小：{payload['total_bytes'] / 1024 / 1024:.2f} MiB",
        f"- 尺寸规格：{len(dimension_counts)} 种",
        "",
        "## 尺寸分布",
        "",
    ]
    lines.extend(f"- {dimension}：{count} 张" for dimension, count in dimension_counts.most_common())
    lines.extend(
        [
            "",
            "## 逐文件记录",
            "",
            "| 序号 | 文件 | 尺寸 | 大小（MiB） | SHA-256 |",
            "|---:|---|---:|---:|---|",
        ]
    )
    for index, item in enumerate(records, start=1):
        lines.append(
            f"| {index} | {item['filename']} | {item['width']}×{item['height']} | "
            f"{item['bytes'] / 1024 / 1024:.2f} | `{item['sha256']}` |"
        )
    (output_dir / "inventory.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Inventory GEO PNG source files without modifying them.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--exclude", action="append", default=[])
    args = parser.parse_args()

    records = scan_images(args.source_dir, set(args.exclude))
    write_inventory(records, args.source_dir, args.output_dir)
    print(json.dumps({"image_count": len(records), "output_dir": str(args.output_dir)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
