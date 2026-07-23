# GEO Image Inventory and Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 115 张尚未处理的 GEO 技术截图生成完整资产清单、标题 OCR、可视化联系表、自动文档分组和首批三个文档组选择结果。

**Architecture:** 使用无损 PNG 元数据扫描建立基础清单，再调用现有 Apple Vision OCR 提取每张图顶部标题信息。分组器根据连续编号、标题、章节编号、语义词和版式生成候选边界，最终结合顶部截图联系表完成一次视觉复核；结果同时写入项目处理目录和正式 Obsidian Vault 的批处理登记目录。

**Tech Stack:** Python 3、Pillow、Apple Vision、Swift、JSON、Markdown、PNG、Obsidian。

## Global Constraints

- 输入目录固定为 `/Users/mac/Desktop/GEO图/`。
- 排除已入库的 `Group 123.png` 和非 PNG 文件，预期待处理图片数为 115。
- 不修改、覆盖或删除任何输入图片。
- 所有清单必须包含 SHA-256、尺寸、文件名、数字序号和来源绝对路径。
- 低置信度分组必须标为 `待确认`，不能强行合并。
- 首批必须分别覆盖纯文字型、表格型、复杂流程图型文档组。
- 正式登记位置为 `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/_批处理/`。

---

### Task 1: 生成无损图片资产清单

**Files:**
- Create: `scripts/inventory_geo_images.py`
- Create: `tests/test_inventory_geo_images.py`
- Generate: `processing/geo-images/inventory.json`
- Generate: `processing/geo-images/inventory.md`

**Interfaces:**
- Consumes: `scan_images(source_dir: Path, excluded_names: set[str])`。
- Produces: `list[dict]`，每项包含 `filename`、`absolute_path`、`kind`、`number`、`width`、`height`、`sha256`、`bytes`。

- [ ] **Step 1: 写失败测试**

使用 Pillow 在临时目录生成两个 PNG 和一个非 PNG 文件，断言扫描器只返回 PNG、按数字序号排序、正确读取宽高与 SHA-256，并能排除 `Group 123.png`。

- [ ] **Step 2: 运行测试确认失败**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_inventory_geo_images`

Expected: FAIL，原因是 `inventory_geo_images` 尚不存在。

- [ ] **Step 3: 实现扫描器和 CLI**

CLI：

```text
python3 scripts/inventory_geo_images.py SOURCE_DIR OUTPUT_DIR --exclude "Group 123.png"
```

脚本使用 Pillow 只读取图像元数据，使用 `hashlib.sha256` 分块计算哈希，不重编码输入文件。JSON 保存完整数据，Markdown 输出总数、总字节数、尺寸分布和逐文件表格。

- [ ] **Step 4: 运行单测和真实清单生成**

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_inventory_geo_images
python3 scripts/inventory_geo_images.py /Users/mac/Desktop/GEO图 processing/geo-images --exclude "Group 123.png"
```

Expected: 测试通过，清单记录数为 115，缺失文件为 0。

- [ ] **Step 5: 提交清单工具**

```bash
git add scripts/inventory_geo_images.py tests/test_inventory_geo_images.py processing/geo-images/inventory.json processing/geo-images/inventory.md
git commit -m "feat: inventory GEO source images"
```

### Task 2: 批量提取标题 OCR 与顶部预览

**Files:**
- Create: `scripts/batch_geo_ocr.py`
- Create: `tests/test_batch_geo_ocr.py`
- Generate: `processing/geo-images/ocr/*.json`
- Generate: `processing/geo-images/ocr-summary.md`
- Generate: `processing/geo-images/thumbnails/*.png`
- Generate: `processing/geo-images/contact-sheets/*.png`

**Interfaces:**
- Consumes: Task 1 的 `inventory.json` 和编译后的 `long_image_ocr` 可执行文件。
- Produces: 每张图顶部最多 4800 像素的 OCR JSON、前 20 行标题摘要、带文件名标签的顶部缩略图和 4 × 4 联系表。

- [ ] **Step 1: 写失败测试**

测试 OCR 结果摘要函数能按 `y/x` 排序、限制 20 行并过滤空文本；测试联系表生成器输出 PNG 且包含 4 × 4 最大 16 个条目。

- [ ] **Step 2: 运行测试确认失败**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_batch_geo_ocr`

Expected: FAIL，原因是 `batch_geo_ocr` 尚不存在。

- [ ] **Step 3: 实现批处理与联系表**

CLI：

```text
python3 scripts/batch_geo_ocr.py processing/geo-images/inventory.json processing/geo-images --ocr-binary /tmp/geo-long-image-ocr --top-pixels 4800
```

每张缩略图截取顶部 `min(4800, height)` 像素，等比缩放到 420 像素宽；联系表使用 Pillow 白底绘制文件名标签。OCR 已存在时跳过，支持安全续跑。

- [ ] **Step 4: 编译 OCR 工具并运行真实批处理**

```bash
swiftc -O scripts/long_image_ocr.swift -o /tmp/geo-long-image-ocr
python3 scripts/batch_geo_ocr.py processing/geo-images/inventory.json processing/geo-images --ocr-binary /tmp/geo-long-image-ocr --top-pixels 4800
```

Expected: 115 份 OCR JSON、115 张顶部缩略图和 8 张联系表；失败数为 0。

- [ ] **Step 5: 提交 OCR 摘要和联系表生成器**

```bash
git add scripts/batch_geo_ocr.py tests/test_batch_geo_ocr.py processing/geo-images/ocr-summary.md
git commit -m "feat: extract GEO title previews"
```

二进制 OCR JSON、缩略图和联系表作为本地处理产物，不进入 Git；在 `.gitignore` 中精确忽略 `processing/geo-images/ocr/`、`thumbnails/`、`contact-sheets/`。

### Task 3: 生成并视觉复核文档分组

**Files:**
- Create: `scripts/group_geo_documents.py`
- Create: `tests/test_group_geo_documents.py`
- Generate: `processing/geo-images/document-groups.json`
- Generate: `processing/geo-images/document-groups.md`

**Interfaces:**
- Consumes: `inventory.json`、`ocr-summary.md` 对应的 OCR JSON 集合。
- Produces: `groups` 数组，每项包含 `group_id`、`title`、`files`、`category_hint`、`content_type`、`confidence`、`boundary_reasons`、`review_status`。

- [ ] **Step 1: 写失败测试**

构造包含连续章节、明显新标题和无标题页面的 OCR fixture，断言连续章节合并、新标题形成边界、无法判断的边界标为 `待确认`，并保证每个输入文件只出现一次。

- [ ] **Step 2: 运行测试确认失败**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_group_geo_documents`

Expected: FAIL，原因是 `group_geo_documents` 尚不存在。

- [ ] **Step 3: 实现候选分组器**

分组规则按优先级执行：明显一级标题或文档封面形成边界；连续章节编号与共享核心术语支持合并；同系列文件编号仅作为弱信号；证据冲突时输出 `confidence: low` 与 `review_status: 待确认`。

- [ ] **Step 4: 运行真实分组并逐张检查联系表**

```bash
python3 scripts/group_geo_documents.py processing/geo-images/inventory.json processing/geo-images/ocr processing/geo-images
```

使用 8 张联系表逐项核对边界，把人工确认写回 `document-groups.json` 的 `review_status` 和 `boundary_reasons`。确认 115 张图片不重不漏。

- [ ] **Step 5: 提交分组结果**

```bash
git add scripts/group_geo_documents.py tests/test_group_geo_documents.py processing/geo-images/document-groups.json processing/geo-images/document-groups.md .gitignore
git commit -m "data: group GEO technical documents"
```

### Task 4: 选择首批三个文档组并登记到 Obsidian

**Files:**
- Create: `processing/geo-images/pilot-selection.json`
- Create: `processing/geo-images/pilot-selection.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/_批处理/图片资产清单.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/_批处理/文档分组清单.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/_批处理/首批处理清单.md`
- Modify: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/index.md`

**Interfaces:**
- Consumes: 已视觉复核的 `document-groups.json`。
- Produces: 三个不重复的 pilot group，`content_type` 分别为 `纯文字型`、`表格型`、`复杂流程图型`。

- [ ] **Step 1: 按选择规则生成 pilot**

每种内容类型选择 `review_status: 已确认` 且置信度最高的一个组；并列时选择图片数较少者，以缩短首批验证时间。

- [ ] **Step 2: 检查首批覆盖与来源**

断言三个组的 `group_id`、文件集合互不重复，所有文件均存在且 SHA-256 与资产清单一致。

- [ ] **Step 3: 写入正式 Vault 批处理登记**

复制三份 Markdown 清单到 `raw/GEO/_批处理/`，在 `wiki/GEO/index.md` 增加“批处理进度”链接，不复制 OCR 临时文件和缩略图。

- [ ] **Step 4: 运行最终验证**

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'
python3 -m json.tool processing/geo-images/inventory.json >/dev/null
python3 -m json.tool processing/geo-images/document-groups.json >/dev/null
python3 -m json.tool processing/geo-images/pilot-selection.json >/dev/null
```

Expected: 全部测试通过；115 张来源图片不重不漏；三个 pilot 类型完整；Obsidian 三份清单存在。

- [ ] **Step 5: 提交首批选择结果**

```bash
git add processing/geo-images/pilot-selection.json processing/geo-images/pilot-selection.md
git commit -m "data: select GEO pilot document groups"
```

完成本计划后，以三个明确的 pilot group 为输入另写实施计划，逐组生成产品经理解读版、忠实还原版、技术完整版 SVG 和产品简易版 SVG。
