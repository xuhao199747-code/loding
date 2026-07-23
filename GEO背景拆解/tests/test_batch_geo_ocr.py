import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.batch_geo_ocr import create_contact_sheets, summarize_lines


class BatchGeoOCRTests(unittest.TestCase):
    def test_summarize_lines_sorts_filters_and_limits(self) -> None:
        payload = {
            "lines": [
                {"text": "第三行", "y": 30, "x": 0},
                {"text": "", "y": 5, "x": 0},
                {"text": "第二行右", "y": 20, "x": 40},
                {"text": "第一行", "y": 10, "x": 0},
                {"text": "第二行左", "y": 20, "x": 0},
            ]
        }

        self.assertEqual(summarize_lines(payload, limit=3), ["第一行", "第二行左", "第二行右"])

    def test_create_contact_sheets_paginates_sixteen_items(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            thumbnails = root / "thumbs"
            output = root / "sheets"
            thumbnails.mkdir()
            paths = []
            for index in range(17):
                path = thumbnails / f"Group {index + 1}.png"
                Image.new("RGB", (100, 140), "white").save(path)
                paths.append(path)

            sheets = create_contact_sheets(paths, output, columns=4, rows=4)

            self.assertEqual(len(sheets), 2)
            self.assertTrue(all(path.is_file() for path in sheets))
            with Image.open(sheets[0]) as image:
                self.assertEqual(image.format, "PNG")
                self.assertGreater(image.width, image.height / 2)


if __name__ == "__main__":
    unittest.main()
