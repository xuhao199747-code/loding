#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote


REQUIRED_FILES = (
    "faithful.md",
    "readable.md",
    "metadata.yaml",
    "quality-report.md",
)

MARKDOWN_IMAGE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")
OBSIDIAN_IMAGE = re.compile(r"!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
SOURCE_REGION = re.compile(
    r"source_region:\s*x=\d+,y=\d+,width=\d+,height=\d+;\s*review=(?:passed|待确认)"
)


def local_image_targets(markdown: str) -> list[str]:
    targets = MARKDOWN_IMAGE.findall(markdown) + OBSIDIAN_IMAGE.findall(markdown)
    return [
        unquote(target.strip().strip("<>"))
        for target in targets
        if not target.startswith(("http://", "https://", "data:", "#"))
    ]


def audit_sample(sample_dir: Path) -> dict:
    sample_dir = Path(sample_dir)
    blockers: list[str] = []
    checks: dict[str, object] = {}

    missing_required = [name for name in REQUIRED_FILES if not (sample_dir / name).is_file()]
    checks["required_files"] = {
        "expected": list(REQUIRED_FILES),
        "missing": missing_required,
    }
    blockers.extend(f"missing_required:{name}" for name in missing_required)

    source_files = sorted((sample_dir / "source").glob("*.png"))
    checks["source_png_count"] = len(source_files)
    if not source_files:
        blockers.append("missing_source")

    faithful_path = sample_dir / "faithful.md"
    if faithful_path.is_file():
        faithful = faithful_path.read_text(encoding="utf-8")
        region_count = len(SOURCE_REGION.findall(faithful))
        checks["source_region_count"] = region_count
        if region_count == 0:
            blockers.append("missing_source_region")

    checked_assets: list[str] = []
    for markdown_name in ("faithful.md", "readable.md"):
        markdown_path = sample_dir / markdown_name
        if not markdown_path.is_file():
            continue
        markdown = markdown_path.read_text(encoding="utf-8")
        for target in local_image_targets(markdown):
            resolved = (markdown_path.parent / target).resolve()
            checked_assets.append(target)
            if not resolved.is_file():
                blockers.append(f"missing_asset:{markdown_name}:{target}")
    checks["linked_assets"] = checked_assets

    quality_path = sample_dir / "quality-report.md"
    if quality_path.is_file():
        quality = quality_path.read_text(encoding="utf-8")
        checks["quality_allows_ingest"] = "最终状态：允许入库" in quality
        checks["quality_blockers_zero"] = "未处理阻断项：0" in quality
        if not checks["quality_allows_ingest"]:
            blockers.append("quality_not_approved")
        if not checks["quality_blockers_zero"]:
            blockers.append("quality_has_unresolved_blockers")

    blockers = sorted(set(blockers))
    return {
        "status": "passed" if not blockers else "blocked",
        "checks": checks,
        "blockers": blockers,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python3 scripts/audit_knowledge_sample.py SAMPLE_DIR", file=sys.stderr)
        return 2
    result = audit_sample(Path(argv[1]))
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 0 if result["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
