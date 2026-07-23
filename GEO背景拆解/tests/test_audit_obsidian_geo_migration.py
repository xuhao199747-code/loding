import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.audit_obsidian_geo_migration import audit


ARTICLE_DIR = Path("wiki/GEO/来源")
RESOURCE_DIR = Path("wiki/GEO/资源/AlphaRank GEO 全景说明")


def build_complete_vault(root: Path) -> None:
    article_dir = root / ARTICLE_DIR
    article_dir.mkdir(parents=True)
    (root / "wiki/GEO/index.md").write_text("# GEO\n", encoding="utf-8")
    for filename in (
        "AlphaRank GEO 全景说明｜忠实还原.md",
        "AlphaRank GEO 全景说明｜质量报告.md",
    ):
        (article_dir / filename).write_text(f"# {filename[:-3]}\n", encoding="utf-8")

    image_targets = (
        "../资源/AlphaRank GEO 全景说明/流程图/架构一.svg",
        "../资源/AlphaRank GEO 全景说明/流程图/架构二.svg",
        "../资源/AlphaRank GEO 全景说明/流程图/架构三.svg",
        "../资源/AlphaRank GEO 全景说明/流程图/工作流.svg",
        "../资源/AlphaRank GEO 全景说明/表格图/职责表.png",
        "../资源/AlphaRank GEO 全景说明/表格图/能力表.png",
    )
    (article_dir / "AlphaRank GEO 全景说明.md").write_text(
        "# AlphaRank GEO 全景说明\n\n"
        + "\n".join(f"![图]({target})" for target in image_targets)
        + "\n",
        encoding="utf-8",
    )
    for target in image_targets:
        path = article_dir / target
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(b"asset")

    raw = root / "raw/GEO/AlphaRank GEO 全景说明/Group 123.png"
    raw.parent.mkdir(parents=True)
    raw.write_bytes(b"png")


class ObsidianGeoMigrationAuditTests(unittest.TestCase):
    def test_missing_geo_theme_is_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            blockers = audit(Path(folder))
            self.assertIn("缺少页面:wiki/GEO/index.md", blockers)

    def test_machine_filenames_are_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_vault(root)
            (root / ARTICLE_DIR / "readable.md").write_text("# old\n", encoding="utf-8")
            blockers = audit(root)
            self.assertIn("残留机器文件名:readable.md", blockers)

    def test_broken_image_link_is_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_vault(root)
            missing = root / RESOURCE_DIR / "流程图/架构一.svg"
            missing.unlink()
            blockers = audit(root)
            self.assertTrue(any(item.startswith("图片不存在:") for item in blockers))

    def test_complete_vault_passes(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_vault(root)
            self.assertEqual(audit(root), [])


if __name__ == "__main__":
    unittest.main()
