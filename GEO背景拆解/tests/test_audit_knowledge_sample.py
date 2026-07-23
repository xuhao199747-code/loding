import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.audit_knowledge_sample import audit_sample


def build_complete_fixture(root: Path) -> None:
    (root / "source").mkdir(parents=True)
    (root / "assets" / "figures").mkdir(parents=True)
    (root / "source" / "original.png").write_bytes(b"png")
    (root / "assets" / "figures" / "figure-01.png").write_bytes(b"png")
    (root / "faithful.md").write_text(
        "# Faithful\n\n"
        "<!-- source_region: x=10,y=20,width=30,height=40; review=passed -->\n"
        "![figure](assets/figures/figure-01.png)\n",
        encoding="utf-8",
    )
    (root / "readable.md").write_text(
        "# Readable\n\n![figure](assets/figures/figure-01.png)\n",
        encoding="utf-8",
    )
    (root / "metadata.yaml").write_text(
        "document_id: fixture\nstatus: 允许入库\n",
        encoding="utf-8",
    )
    (root / "quality-report.md").write_text(
        "# Quality\n\n未处理阻断项：0\n\n最终状态：允许入库\n",
        encoding="utf-8",
    )


class AuditSampleTests(unittest.TestCase):
    def test_missing_source_is_blocker(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            result = audit_sample(Path(folder))
            self.assertEqual(result["status"], "blocked")
            self.assertIn("missing_source", result["blockers"])

    def test_broken_markdown_image_is_blocker(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_fixture(root)
            (root / "assets" / "figures" / "figure-01.png").unlink()

            result = audit_sample(root)

            self.assertEqual(result["status"], "blocked")
            self.assertTrue(
                any(blocker.startswith("missing_asset:") for blocker in result["blockers"])
            )

    def test_complete_sample_passes(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_fixture(root)

            result = audit_sample(root)

            self.assertEqual(result["status"], "passed")
            self.assertEqual(result["blockers"], [])


if __name__ == "__main__":
    unittest.main()
