# Group 123 Obsidian Sample Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/Users/mac/Desktop/GEO图/Group 123.png` 制作为一份可在 Obsidian 中阅读、检索、问答和回溯原图的双版本知识库样板。

**Architecture:** 原始 PNG 以不可变证据保存；Apple Vision 分块 OCR 产生带原图坐标的结构化行数据；人工结构化形成忠实还原版和整理阅读版；独立审计脚本检查必需文件、来源坐标、资源链接、待确认项与质量状态。样板只写入本地，不上传飞书。

**Tech Stack:** macOS Vision + Swift、Python 3 标准库、Markdown、YAML、Obsidian 相对链接、SHA-256。

## Global Constraints

- 原始图片不得重采样、压缩覆盖或删除。
- 内容完整性与可追溯性优先于排版美观。
- 流程图和复杂表格必须保留原始高清裁图，不得只剩 OCR 文本。
- 不根据上下文擅自补写不可辨认文字；不能确认的内容必须标记 `待确认`。
- 本地主库是唯一权威来源；本样板不上传飞书。
- 所有来源区域使用原始图片像素坐标。

---

### Task 1: 建立带坐标的长图 OCR 工具

**Files:**
- Create: `scripts/long_image_ocr.swift`
- Create: `tests/test_long_image_ocr.sh`

**Interfaces:**
- Consumes: PNG 路径、输出 JSON 路径、可选分块高度。
- Produces: JSON 对象 `{image, width, height, lines}`；每个 line 为 `{text, confidence, x, y, width, height, tile}`，坐标为原图像素坐标。

- [ ] **Step 1: 写失败测试**

测试脚本先检查 OCR 工具是否能从 `Group 123.png` 顶部区域识别标题关键词，并验证所有坐标均位于 7370 × 32768 范围内：

```bash
#!/usr/bin/env bash
set -euo pipefail
swift scripts/long_image_ocr.swift \
  '/Users/mac/Desktop/GEO图/Group 123.png' \
  /tmp/group123-ocr-test.json 2400 0 4200
python3 - <<'PY'
import json
p = json.load(open('/tmp/group123-ocr-test.json', encoding='utf-8'))
assert p['width'] == 7370 and p['height'] == 32768
assert p['lines']
assert all(0 <= x['x'] < 7370 and 0 <= x['y'] < 32768 for x in p['lines'])
text = '\n'.join(x['text'] for x in p['lines'])
assert 'GEO' in text and 'AlphaRank' in text
PY
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `bash tests/test_long_image_ocr.sh`

Expected: FAIL，提示 `scripts/long_image_ocr.swift` 不存在。

- [ ] **Step 3: 实现最小 OCR 工具**

实现参数解析、CGImage 分块裁切、`VNRecognizeTextRequest`、中文与英文识别、坐标换算、置信度输出和 JSON 写入。识别请求使用：

```swift
let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.recognitionLanguages = ["zh-Hans", "en-US"]
request.usesLanguageCorrection = true
```

CLI 必须支持：

```text
swift scripts/long_image_ocr.swift INPUT OUTPUT [tile_height] [start_y] [end_y]
```

- [ ] **Step 4: 运行测试并确认通过**

Run: `bash tests/test_long_image_ocr.sh`

Expected: PASS，退出码为 0，生成合法 JSON，标题关键词与坐标断言通过。

- [ ] **Step 5: 提交**

```bash
git add scripts/long_image_ocr.swift tests/test_long_image_ocr.sh
git commit -m "feat: add coordinate-aware long image OCR"
```

### Task 2: 建立知识库样板审计器

**Files:**
- Create: `scripts/audit_knowledge_sample.py`
- Create: `tests/test_audit_knowledge_sample.py`

**Interfaces:**
- Consumes: 一个样板目录路径。
- Produces: JSON 审计结果 `{status, checks, blockers}`，失败时退出码为 1。

- [ ] **Step 1: 写失败测试**

使用 `unittest.TestCase` 与 `tempfile.TemporaryDirectory()` 创建缺失资源和完整资源两种目录。测试必须断言：缺少原图、正文、元数据、质量报告或存在断链时返回失败；文件齐全、Markdown 图片链接存在且质量状态为 `允许入库` 时返回成功。

```python
class AuditSampleTests(unittest.TestCase):
    def test_missing_source_is_blocker(self):
        with tempfile.TemporaryDirectory() as folder:
            result = audit_sample(Path(folder))
            self.assertEqual(result["status"], "blocked")
            self.assertIn("missing_source", result["blockers"])

    def test_complete_sample_passes(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            build_complete_fixture(root)
            result = audit_sample(root)
            self.assertEqual(result["status"], "passed")
            self.assertEqual(result["blockers"], [])
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `python3 tests/test_audit_knowledge_sample.py -v`

Expected: FAIL，提示无法导入 `scripts.audit_knowledge_sample`。

- [ ] **Step 3: 实现最小审计器**

实现 `audit_sample(sample_dir: Path) -> dict`，检查：

```python
REQUIRED = [
    "faithful.md",
    "readable.md",
    "metadata.yaml",
    "quality-report.md",
]
```

同时验证 `source/` 下存在 PNG、Markdown 本地图片链接均存在、`source_region` 字段存在、质量报告没有未处理阻断项且最终状态为 `允许入库`。

- [ ] **Step 4: 运行测试并确认通过**

Run: `python3 tests/test_audit_knowledge_sample.py -v`

Expected: PASS，全部测试通过。

- [ ] **Step 5: 提交**

```bash
git add scripts/audit_knowledge_sample.py tests/test_audit_knowledge_sample.py
git commit -m "feat: audit knowledge base sample integrity"
```

### Task 3: 生成 Group 123 原始证据与结构化中间数据

**Files:**
- Create: `knowledge-base/03-已入库/group-123/source/Group 123.png`
- Create: `knowledge-base/03-已入库/group-123/metadata.yaml`
- Create: `knowledge-base/03-已入库/group-123/ocr/lines.json`
- Create: `knowledge-base/03-已入库/group-123/ocr/review-queue.md`

**Interfaces:**
- Consumes: `scripts/long_image_ocr.swift` 和原始 PNG。
- Produces: 不可变原图副本、SHA-256、原图尺寸、逐行 OCR 坐标、低置信度复核队列。

- [ ] **Step 1: 写失败验收检查**

Run:

```bash
test -f 'knowledge-base/03-已入库/group-123/source/Group 123.png'
test -f 'knowledge-base/03-已入库/group-123/ocr/lines.json'
```

Expected: FAIL，因为样板尚未生成。

- [ ] **Step 2: 保存原图并运行全图 OCR**

复制原始 PNG，不做格式转换；运行：

```bash
swift scripts/long_image_ocr.swift \
  'knowledge-base/03-已入库/group-123/source/Group 123.png' \
  'knowledge-base/03-已入库/group-123/ocr/lines.json' 2400
```

- [ ] **Step 3: 写入元数据与复核队列**

`metadata.yaml` 必须记录 `document_id`、标题、原始文件名、7370 × 32768、SHA-256、处理时间、OCR 语言、双版本路径和状态。`review-queue.md` 按坐标列出低置信度、疑似重复和无法归类内容块；已确认无问题时明确写“无未处理阻断项”。

- [ ] **Step 4: 验证证据一致性**

Run:

```bash
shasum -a 256 '/Users/mac/Desktop/GEO图/Group 123.png' \
  'knowledge-base/03-已入库/group-123/source/Group 123.png'
```

Expected: 两行 SHA-256 完全一致。

- [ ] **Step 5: 提交**

```bash
git add knowledge-base/03-已入库/group-123/source \
  knowledge-base/03-已入库/group-123/metadata.yaml \
  knowledge-base/03-已入库/group-123/ocr
git commit -m "data: preserve Group 123 source evidence"
```

### Task 4: 重建忠实版、阅读版与图表资源

**Files:**
- Create: `knowledge-base/03-已入库/group-123/faithful.md`
- Create: `knowledge-base/03-已入库/group-123/readable.md`
- Create: `knowledge-base/03-已入库/group-123/assets/figures/*.png`
- Create: `knowledge-base/03-已入库/group-123/assets/tables/*.png`

**Interfaces:**
- Consumes: 原图、OCR 行数据、复核队列和项目内已存在的 AlphaRank 文字材料与图示源文件。
- Produces: 逐章可回溯忠实版、便于阅读的整理版、原始高清图表裁图。

- [ ] **Step 1: 写失败内容检查**

Run:

```bash
test -s knowledge-base/03-已入库/group-123/faithful.md
test -s knowledge-base/03-已入库/group-123/readable.md
find knowledge-base/03-已入库/group-123/assets -type f -name '*.png' | grep -q .
```

Expected: FAIL，因为双版本和图表资源尚不存在。

- [ ] **Step 2: 提取原始图表区域**

依据原图坐标裁切所有流程图与复杂表格，不缩放、不重绘；文件名使用 `figure-01-*`、`table-01-*` 的稳定编号。每个资源在忠实版中紧邻对应章节，并附来源坐标。

- [ ] **Step 3: 编写忠实还原版**

按原图顺序恢复标题、正文、列表和表格。每个一级内容块使用 HTML 注释记录来源：

```markdown
<!-- source_region: x=2210,y=6840,width=2740,height=1910; review=passed -->
```

所有不能确认的字词使用 `〔待确认：原图坐标〕`，不得猜测补全。

- [ ] **Step 4: 编写整理阅读版**

保留全部知识内容，清除黑色空白与软件界面，增加开篇摘要、主题标签、目录、关键结论和到忠实版的链接。不得用摘要替代正文，不得删除流程图或表格。

- [ ] **Step 5: 验证资源链接与章节覆盖**

Run:

```bash
python3 scripts/audit_knowledge_sample.py knowledge-base/03-已入库/group-123
```

Expected: 此时仅允许因质量报告尚未生成而失败；不得出现原图、双版本、坐标或资源断链错误。

- [ ] **Step 6: 提交**

```bash
git add knowledge-base/03-已入库/group-123/faithful.md \
  knowledge-base/03-已入库/group-123/readable.md \
  knowledge-base/03-已入库/group-123/assets
git commit -m "docs: reconstruct Group 123 knowledge sample"
```

### Task 5: 完成质量报告与 Obsidian 总目录

**Files:**
- Create: `knowledge-base/03-已入库/group-123/quality-report.md`
- Create: `knowledge-base/00-总目录.md`

**Interfaces:**
- Consumes: 样板全部产物和审计器。
- Produces: 可审核的质量结论与 Obsidian 入口。

- [ ] **Step 1: 写质量报告**

报告必须列出原图一致性、有效内容块覆盖、正文核对、流程图数量、表格数量、低置信度项、资源链接和最终状态。只有所有阻断项清零时才能写 `最终状态：允许入库`。

- [ ] **Step 2: 写 Obsidian 总目录**

总目录链接到 Group 123 的整理阅读版、忠实还原版、质量报告和原始证据，并标记飞书状态为“未发布”。

- [ ] **Step 3: 运行全量自动审计**

Run:

```bash
python3 scripts/audit_knowledge_sample.py knowledge-base/03-已入库/group-123
python3 -m unittest discover -s tests -p 'test_*.py' -v
bash tests/test_long_image_ocr.sh
```

Expected: 审计状态为 `passed`，全部测试通过。

- [ ] **Step 4: 人工逐屏检查**

按原图从顶部到底部逐块核对忠实版，检查章节顺序、正文、图表、表格与所有待确认标记。发现问题时修复并重新运行 Step 3。

- [ ] **Step 5: 提交**

```bash
git add knowledge-base/00-总目录.md \
  knowledge-base/03-已入库/group-123/quality-report.md
git commit -m "docs: complete Group 123 Obsidian sample"
```
