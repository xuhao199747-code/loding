import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.group_geo_documents import build_groups


def write_ocr(folder: Path, filename: str, lines: list[str]) -> None:
    payload = {
        "lines": [
            {"text": text, "x": 0, "y": index * 40, "width": 100, "height": 20, "confidence": 0.9, "tile": 0}
            for index, text in enumerate(lines)
        ]
    }
    (folder / f"{Path(filename).stem}.json").write_text(
        json.dumps(payload, ensure_ascii=False), encoding="utf-8"
    )


class GeoDocumentGroupingTests(unittest.TestCase):
    def test_continuation_merges_and_clear_title_starts_new_group(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            ocr_dir = Path(folder)
            records = [
                {"filename": "Group 1.png", "kind": "Group", "number": 1},
                {"filename": "Group 2.png", "kind": "Group", "number": 2},
                {"filename": "Group 3.png", "kind": "Group", "number": 3},
            ]
            write_ocr(ocr_dir, "Group 1.png", ["召回服务技术方案", "背景", "整体架构"])
            write_ocr(ocr_dir, "Group 2.png", ["4.2 节点详解", "EmbeddingNode", "GraphNode"])
            write_ocr(ocr_dir, "Group 3.png", ["品牌诊断产品设计", "背景", "用户角色"])

            groups = build_groups(records, ocr_dir)

            self.assertEqual(groups[0]["files"], ["Group 1.png", "Group 2.png"])
            self.assertEqual(groups[1]["files"], ["Group 3.png"])
            self.assertEqual(groups[0]["title"], "召回服务技术方案")

    def test_every_input_file_appears_exactly_once(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            ocr_dir = Path(folder)
            records = [
                {"filename": "Group 1.png", "kind": "Group", "number": 1},
                {"filename": "image 9.png", "kind": "image", "number": 9},
            ]
            write_ocr(ocr_dir, "Group 1.png", ["技术架构", "模块说明"])
            write_ocr(ocr_dir, "image 9.png", ["独立流程图"])

            groups = build_groups(records, ocr_dir)
            filenames = [name for group in groups for name in group["files"]]

            self.assertEqual(sorted(filenames), ["Group 1.png", "image 9.png"])
            self.assertEqual(len(filenames), len(set(filenames)))


if __name__ == "__main__":
    unittest.main()
