#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


UI_NOISE = (
    "上次编辑",
    "分享",
    "菜单",
    "插入",
    "ai 创作",
    "编辑",
    "默认",
    "正文",
    "创建",
)
SECTION_HEADING = re.compile(r"^(?:第?[一二三四五六七八九十百]+[章节、.]|\d+(?:\.\d+)*[.、\s])")


def ocr_lines(ocr_dir: Path, filename: str) -> list[str]:
    path = ocr_dir / f"{Path(filename).stem}.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    lines = sorted(payload.get("lines", []), key=lambda item: (item.get("y", 0), item.get("x", 0)))
    return [item.get("text", "").strip() for item in lines if item.get("text", "").strip()]


def is_noise(line: str) -> bool:
    lowered = line.lower().replace(" ", "")
    return len(line) <= 1 or any(token.replace(" ", "") in lowered for token in UI_NOISE)


def is_clear_title(line: str) -> bool:
    compact = line.strip("~女口公℃C<>：:·• ")
    if not 3 <= len(compact) <= 50 or is_noise(compact):
        return False
    if SECTION_HEADING.match(compact) or compact.startswith(("-", "•", "（", "(")):
        return False
    if any(symbol in compact for symbol in ("=", "->", "→", "{", "}")):
        return False
    return True


def extract_title(lines: list[str], fallback: str) -> str | None:
    meaningful = [line for line in lines[:20] if not is_noise(line)]
    if meaningful and SECTION_HEADING.match(meaningful[0]):
        return None
    for line in meaningful[:8]:
        if is_clear_title(line):
            return line.strip("~女口公℃C<>：:·• ")
    return None


def content_type(text: str) -> str:
    lowered = text.lower()
    if any(token in lowered for token in ("架构", "流程", "flowchart", "pipeline", "router", "agent")):
        return "复杂流程图型"
    if any(token in lowered for token in ("字段", "评分表", "数据表", "表格", "枚举值", "类型 |")):
        return "表格型"
    return "纯文字型"


def category_hint(text: str) -> str:
    lowered = text.lower()
    if any(token in lowered for token in ("agent", "架构", "gateway", "rag", "召回", "llm")):
        return "04-Agent与技术架构"
    if any(token in lowered for token in ("指标", "评测", "实验", "benchmark", "诊断")):
        return "06-指标实验与评估"
    if any(token in lowered for token in ("内容", "生成", "分发", "blog")):
        return "05-内容优化与分发"
    if any(token in lowered for token in ("数据", "知识", "图谱", "embedding")):
        return "03-数据与知识工程"
    if any(token in lowered for token in ("竞品", "品牌", "案例")):
        return "07-案例与竞品"
    return "02-产品能力与业务流程"


def make_group(files: list[str], title: str, text: str, confidence: str, reasons: list[str]) -> dict:
    return {
        "group_id": "",
        "title": title,
        "files": files,
        "category_hint": category_hint(text),
        "content_type": content_type(text),
        "confidence": confidence,
        "boundary_reasons": reasons,
        "review_status": "待确认",
    }


def build_groups(records: list[dict], ocr_dir: Path) -> list[dict]:
    groups: list[dict] = []
    previous_record: dict | None = None
    for record in records:
        lines = ocr_lines(ocr_dir, record["filename"])
        title = extract_title(lines, record["filename"])
        text = " ".join(lines[:80])
        is_consecutive_group = (
            previous_record is not None
            and record.get("kind") == previous_record.get("kind") == "Group"
            and record.get("number") == previous_record.get("number", -2) + 1
        )
        if groups and is_consecutive_group and title is None:
            groups[-1]["files"].append(record["filename"])
            groups[-1]["confidence"] = "medium" if groups[-1]["confidence"] == "high" else "low"
            groups[-1]["boundary_reasons"].append(f"{record['filename']} 无明确新标题且编号连续")
        else:
            detected_title = title or f"待确认｜{Path(record['filename']).stem}"
            reasons = ["识别到独立标题" if title else "未识别到可靠标题，保守建立独立组"]
            groups.append(make_group([record["filename"]], detected_title, text, "high" if title else "low", reasons))
        previous_record = record

    for index, group in enumerate(groups, start=1):
        group["group_id"] = f"geo-doc-{index:03d}"
    return groups


def apply_review(groups: list[dict], review_path: Path | None, order: dict[str, int]) -> list[dict]:
    if review_path is None:
        return groups
    review = json.loads(review_path.read_text(encoding="utf-8"))
    specified = {filename for item in review.get("groups", []) for filename in item["files"]}
    output: list[dict] = []
    for group in groups:
        remaining = [filename for filename in group["files"] if filename not in specified]
        for filename in remaining:
            item = dict(group)
            item["files"] = [filename]
            item["confidence"] = "low"
            item["review_status"] = "待确认"
            item["boundary_reasons"] = ["视觉复核未覆盖，保守保持单图分组"]
            output.append(item)
    for reviewed in review.get("groups", []):
        output.append(
            {
                "group_id": "",
                "title": reviewed["title"],
                "files": reviewed["files"],
                "category_hint": reviewed["category_hint"],
                "content_type": reviewed["content_type"],
                "confidence": reviewed["confidence"],
                "boundary_reasons": reviewed["boundary_reasons"],
                "review_status": reviewed["review_status"],
            }
        )
    output.sort(key=lambda group: min(order[name] for name in group["files"]))
    for index, group in enumerate(output, start=1):
        group["group_id"] = f"geo-doc-{index:03d}"
    return output


def validate_coverage(groups: list[dict], records: list[dict]) -> None:
    expected = [record["filename"] for record in records]
    actual = [filename for group in groups for filename in group["files"]]
    if sorted(expected) != sorted(actual) or len(actual) != len(set(actual)):
        raise ValueError("document groups do not cover every input exactly once")


def write_groups(groups: list[dict], output_dir: Path, source_count: int) -> None:
    payload = {"source_image_count": source_count, "group_count": len(groups), "groups": groups}
    (output_dir / "document-groups.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = [
        "# GEO 技术文档分组清单",
        "",
        f"- 来源图片：{source_count} 张",
        f"- 文档组：{len(groups)} 组",
        f"- 已确认：{sum(group['review_status'] == '已确认' for group in groups)} 组",
        f"- 待确认：{sum(group['review_status'] != '已确认' for group in groups)} 组",
        "",
        "| 组 ID | 标题 | 图片 | 类型 | 分类建议 | 置信度 | 状态 |",
        "|---|---|---|---|---|---|---|",
    ]
    for group in groups:
        lines.append(
            f"| {group['group_id']} | {group['title']} | {', '.join(group['files'])} | "
            f"{group['content_type']} | {group['category_hint']} | {group['confidence']} | {group['review_status']} |"
        )
    (output_dir / "document-groups.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Group GEO screenshots into document candidates.")
    parser.add_argument("inventory", type=Path)
    parser.add_argument("ocr_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--review", type=Path)
    args = parser.parse_args()
    inventory = json.loads(args.inventory.read_text(encoding="utf-8"))
    records = inventory["images"]
    groups = build_groups(records, args.ocr_dir)
    order = {record["filename"]: index for index, record in enumerate(records)}
    groups = apply_review(groups, args.review, order)
    validate_coverage(groups, records)
    write_groups(groups, args.output_dir, len(records))
    print(json.dumps({"source_image_count": len(records), "group_count": len(groups)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
