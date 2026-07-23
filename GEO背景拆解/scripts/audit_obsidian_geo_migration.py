#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote


REQUIRED_PAGES = (
    "wiki/GEO/index.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明｜忠实还原.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明｜质量报告.md",
)
RAW_SOURCE = "raw/GEO/AlphaRank GEO 全景说明/Group 123.png"
MACHINE_FILENAMES = ("readable.md", "faithful.md", "quality-report.md")
MARKDOWN_IMAGE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")


def audit(vault: Path) -> list[str]:
    vault = Path(vault)
    blockers: list[str] = []

    for relative in REQUIRED_PAGES:
        if not (vault / relative).is_file():
            blockers.append(f"缺少页面:{relative}")

    if not (vault / RAW_SOURCE).is_file():
        blockers.append(f"缺少原始资料:{RAW_SOURCE}")

    geo_root = vault / "wiki/GEO"
    if geo_root.is_dir():
        for filename in MACHINE_FILENAMES:
            if any(geo_root.rglob(filename)):
                blockers.append(f"残留机器文件名:{filename}")

    article = vault / "wiki/GEO/来源/AlphaRank GEO 全景说明.md"
    if article.is_file():
        markdown = article.read_text(encoding="utf-8")
        targets = [unquote(item.strip().strip("<>")) for item in MARKDOWN_IMAGE.findall(markdown)]
        if len(targets) != 6:
            blockers.append(f"正文图片数量错误:{len(targets)}")
        for target in targets:
            if target.startswith(("http://", "https://", "data:", "file://", "/")):
                blockers.append(f"图片不是Vault相对路径:{target}")
                continue
            if not (article.parent / target).resolve().is_file():
                blockers.append(f"图片不存在:{target}")

    return sorted(set(blockers))


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python3 scripts/audit_obsidian_geo_migration.py VAULT", file=sys.stderr)
        return 2
    blockers = audit(Path(argv[1]))
    result = {"status": "passed" if not blockers else "blocked", "blockers": blockers}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not blockers else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
