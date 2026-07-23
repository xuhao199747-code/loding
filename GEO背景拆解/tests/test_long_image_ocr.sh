#!/usr/bin/env bash
set -euo pipefail

output_file="$(mktemp -t group123-ocr).json"
trap 'rm -f "$output_file"' EXIT

swift scripts/long_image_ocr.swift \
  '/Users/mac/Desktop/GEO图/Group 123.png' \
  "$output_file" 2400 0 4200

python3 - "$output_file" <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as handle:
    payload = json.load(handle)

assert payload["width"] == 7370
assert payload["height"] == 32768
assert payload["lines"]
assert all(
    0 <= line["x"] < payload["width"]
    and 0 <= line["y"] < payload["height"]
    and line["width"] > 0
    and line["height"] > 0
    for line in payload["lines"]
)

recognized = "\n".join(line["text"] for line in payload["lines"])
assert "GEO" in recognized
assert "AlphaRank" in recognized
PY
