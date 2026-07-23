import hashlib
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.inventory_geo_images import scan_images


class GeoImageInventoryTests(unittest.TestCase):
    def test_scan_images_reads_png_metadata_hashes_and_numeric_order(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            Image.new("RGB", (40, 80), "white").save(root / "Group 10.png")
            Image.new("RGB", (20, 30), "black").save(root / "Group 2.png")
            Image.new("RGB", (10, 10), "red").save(root / "Group 123.png")
            (root / "notes.txt").write_text("ignore", encoding="utf-8")

            records = scan_images(root, {"Group 123.png"})

            self.assertEqual([item["filename"] for item in records], ["Group 2.png", "Group 10.png"])
            self.assertEqual(records[0]["number"], 2)
            self.assertEqual(records[0]["width"], 20)
            self.assertEqual(records[0]["height"], 30)
            expected_hash = hashlib.sha256((root / "Group 2.png").read_bytes()).hexdigest()
            self.assertEqual(records[0]["sha256"], expected_hash)
            self.assertEqual(records[0]["kind"], "Group")
            self.assertEqual(records[0]["absolute_path"], str((root / "Group 2.png").resolve()))

    def test_scan_images_rejects_missing_source_directory(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            missing = Path(folder) / "missing"
            with self.assertRaises(FileNotFoundError):
                scan_images(missing, set())

    def test_scan_images_reads_dimensions_without_decoding_large_png(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            Image.new("RGB", (20, 30), "white").save(root / "Group 1.png")
            original_limit = Image.MAX_IMAGE_PIXELS
            Image.MAX_IMAGE_PIXELS = 1
            try:
                records = scan_images(root, set())
            finally:
                Image.MAX_IMAGE_PIXELS = original_limit

            self.assertEqual((records[0]["width"], records[0]["height"]), (20, 30))


if __name__ == "__main__":
    unittest.main()
