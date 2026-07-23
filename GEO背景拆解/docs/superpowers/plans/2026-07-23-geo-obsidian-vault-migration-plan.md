# GEO Obsidian Vault Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把《AlphaRank GEO 全景说明》迁入当前实际打开的 Obsidian 资料库，并以中文标题、主题分类和可显示图片的形式完成入库。

**Architecture:** 目标资料库继续使用既有 `raw / wiki / output` 三桶结构。原始长图与 OCR 进入 `raw/GEO`，可阅读页面、SVG 和表格图进入 `wiki/GEO`，再通过 Vault 相对链接、主题索引、来源登记和自动审计连接起来。

**Tech Stack:** Markdown、YAML frontmatter、Obsidian Wiki Links、SVG、PNG、JSON、Python 3、现有 `.llmwiki` 检查脚本。

## Global Constraints

- 目标 Vault 固定为 `/Users/mac/Documents/Obsidian/大威天龙`。
- 不覆盖任何 `reviewed: true` 页面。
- 主文章文件名固定为 `AlphaRank GEO 全景说明.md`。
- 图片只使用 Vault 相对路径，不使用绝对路径或 `file://`。
- 原始 PNG、4 张纯 SVG、2 张表格图、OCR 数据和质量报告全部保留。
- Git 项目中的处理副本保留，作为可回滚备份。

---

### Task 1: 建立目标 Vault 迁移审计

**Files:**
- Create: `scripts/audit_obsidian_geo_migration.py`
- Test: `tests/test_audit_obsidian_geo_migration.py`

**Interfaces:**
- Consumes: 目标 Vault 根目录路径。
- Produces: `audit(vault: Path) -> list[str]`，空列表表示没有阻断项。

- [ ] **Step 1: 写失败测试**

测试使用临时目录模拟缺少 GEO 主题、主文章和图片的 Vault，断言审计返回明确阻断项；再构造最小完整 Vault，断言返回空列表。

- [ ] **Step 2: 运行测试并确认失败**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_audit_obsidian_geo_migration`

Expected: FAIL，原因是 `audit_obsidian_geo_migration` 尚不存在。

- [ ] **Step 3: 实现最小审计器**

审计器检查以下内容：

```python
REQUIRED_PAGES = (
    "wiki/GEO/index.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明｜忠实还原.md",
    "wiki/GEO/来源/AlphaRank GEO 全景说明｜质量报告.md",
)
```

同时解析主文章的 Markdown 图片链接，确认 4 个 SVG、2 个 PNG 都存在，并确认目标 GEO 路径内不存在 `readable.md`、`faithful.md`、`quality-report.md`。

- [ ] **Step 4: 运行测试并确认通过**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests.test_audit_obsidian_geo_migration`

Expected: PASS。

- [ ] **Step 5: 提交审计器**

```bash
git add scripts/audit_obsidian_geo_migration.py tests/test_audit_obsidian_geo_migration.py
git commit -m "test: audit GEO Obsidian migration"
```

### Task 2: 迁移原始资料与中文知识页面

**Files:**
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/AlphaRank GEO 全景说明/Group 123.png`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/AlphaRank GEO 全景说明/OCR识别结果.json`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/AlphaRank GEO 全景说明/OCR复核记录.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/index.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/来源/AlphaRank GEO 全景说明.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/来源/AlphaRank GEO 全景说明｜忠实还原.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/来源/AlphaRank GEO 全景说明｜质量报告.md`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/资源/AlphaRank GEO 全景说明/流程图/*`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/资源/AlphaRank GEO 全景说明/表格图/*`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/资源/AlphaRank GEO 全景说明/原始截图/*`
- Create: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/资源/AlphaRank GEO 全景说明/元数据.yaml`

**Interfaces:**
- Consumes: `/Users/mac/Documents/vibcoding/Obsidain/GEO知识库/03-已入库/group-123/`。
- Produces: 中文命名、图片可解析的 GEO 主题空间。

- [ ] **Step 1: 运行迁移审计并确认目标尚未完成**

Run: `python3 scripts/audit_obsidian_geo_migration.py /Users/mac/Documents/Obsidian/大威天龙`

Expected: FAIL，并报告缺少 `wiki/GEO` 页面。

- [ ] **Step 2: 复制二进制与结构化原始资料**

仅向不存在的目标目录复制原图、OCR、SVG、PNG 和元数据；不修改原始长图内容。

- [ ] **Step 3: 创建中文主文章与辅助页面**

主文章使用合法 frontmatter：

```yaml
---
type: source-note
title: AlphaRank GEO 全景说明
summary: AlphaRank 对 GEO 背景、四层架构、Agentic 工作流、产品能力和评估挑战的全景梳理。
aliases:
  - Group 123
sources:
  - raw/GEO/AlphaRank GEO 全景说明/Group 123.png
created: 2026-07-23
updated: 2026-07-23
reviewed: false
confidence: high
tags:
  - GEO
  - AI-Search
  - AlphaRank
---
```

将原 `readable.md`、`faithful.md`、`quality-report.md` 分别转换为三个中文文件名，并把所有图片改为从 `wiki/GEO/来源/` 出发的 Vault 相对路径。

- [ ] **Step 4: 创建 GEO 主题索引**

`wiki/GEO/index.md` 链接主文章、忠实还原、质量报告和原始资料，并说明后续按 `来源 / 概念 / 方法 / 案例 / 资源` 扩展。

- [ ] **Step 5: 运行迁移审计**

Run: `python3 scripts/audit_obsidian_geo_migration.py /Users/mac/Documents/Obsidian/大威天龙`

Expected: PASS，0 个阻断项。

### Task 3: 接入现有 Wiki 索引和登记系统

**Files:**
- Modify: `/Users/mac/Documents/Obsidian/大威天龙/wiki/index.md`
- Modify: `/Users/mac/Documents/Obsidian/大威天龙/.manifest.json`
- Modify: `/Users/mac/Documents/Obsidian/大威天龙/.llmwiki/log.md`

**Interfaces:**
- Consumes: Task 2 生成的 Vault 相对路径。
- Produces: 可从总索引进入、可追踪来源的 GEO 主题。

- [ ] **Step 1: 在总索引增加 GEO 主题入口**

加入：

```markdown
- [[wiki/GEO/index|GEO]]：生成式引擎优化、AI Search、引用监测、内容优化、Agentic 工作流和评估体系。
```

- [ ] **Step 2: 在 `.manifest.json` 登记来源**

新增 key `raw/GEO/AlphaRank GEO 全景说明/Group 123.png`，状态为 `ingested`，并登记三个中文生成页面；同时把顶层 `updated` 更新为 `2026-07-23`。

- [ ] **Step 3: 记录维护日志**

在 `.llmwiki/log.md` 的 `2026-07-23` 小节记录来源迁入、中文标题、4 张 SVG 重绘、2 张表格图和验证结果。

- [ ] **Step 4: 验证 JSON 与双链**

Run: `python3 -m json.tool /Users/mac/Documents/Obsidian/大威天龙/.manifest.json >/dev/null`

Expected: exit 0。

### Task 4: 完整验证和视觉复核

**Files:**
- Verify: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/`
- Verify: `/Users/mac/Documents/Obsidian/大威天龙/raw/GEO/`

**Interfaces:**
- Consumes: Tasks 1–3 的完整迁移结果。
- Produces: 可交付的 Obsidian GEO 知识库。

- [ ] **Step 1: 运行全部项目测试**

Run: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'`

Expected: 全部 PASS。

- [ ] **Step 2: 运行 Obsidian Wiki 检查**

```bash
python3 .llmwiki/scripts/wiki_status.py
python3 .llmwiki/scripts/wiki_lint.py
```

Expected: 两个命令成功；若有既有问题，输出必须能证明与 GEO 迁移无关。

- [ ] **Step 3: 验证源文件与矢量图**

确认原始长图 SHA-256 一致、SVG 数量为 4、SVG 内没有 `<image>` 位图嵌入、6 个正文图片链接全部存在。

- [ ] **Step 4: 按原始比例渲染并目视检查 SVG**

使用 macOS `sips` 渲染 4 张 SVG，确认无裁切、文字溢出和连线错位。

- [ ] **Step 5: 提交源项目内的审计与计划变更**

目标 Vault 本身不是 Git 仓库；只提交源项目内新增的审计脚本、测试和实施计划，不把用户 Vault 初始化为 Git 仓库。
