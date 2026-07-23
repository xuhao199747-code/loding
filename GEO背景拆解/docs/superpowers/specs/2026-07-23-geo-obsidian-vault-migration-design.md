# GEO 资料迁入现有 Obsidian Wiki 设计

## 目标

把已经重建的《AlphaRank GEO 全景说明》迁入用户当前实际打开的 Obsidian 资料库 `/Users/mac/Documents/Obsidian/大威天龙`，确保正文、图片和流程图可直接浏览，并建立可承载大量 GEO 资料的中文分类规范。

## 约束

- 遵守目标资料库的 `raw / wiki / output` 三桶结构。
- 原始资料只进入 `raw`，不覆盖、不改写。
- 可阅读知识进入 `wiki`，使用中文标题、Vault 相对路径和 Obsidian 双链。
- 当前没有生成文章或课件的需求，不写入 `output`。
- 原始 PNG、4 张纯 SVG 重绘图、2 张表格图、OCR 数据和质量记录全部保留。
- 不覆盖目标资料库中任何 `reviewed: true` 页面。

## 目录设计

```text
大威天龙/
├── raw/
│   └── GEO/
│       └── AlphaRank GEO 全景说明/
│           ├── Group 123.png
│           ├── OCR识别结果.json
│           └── OCR复核记录.md
└── wiki/
    └── GEO/
        ├── index.md
        ├── 来源/
        │   ├── AlphaRank GEO 全景说明.md
        │   ├── AlphaRank GEO 全景说明｜忠实还原.md
        │   └── AlphaRank GEO 全景说明｜质量报告.md
        └── 资源/
            └── AlphaRank GEO 全景说明/
                ├── 流程图/
                ├── 表格图/
                └── 元数据.yaml
```

## 中文显示与分类规则

- 用户日常打开的主文件直接命名为 `AlphaRank GEO 全景说明.md`，不再显示 `readable.md`。
- GEO 是一级主题空间；后续文章优先归入 `来源`、`概念`、`方法`、`案例`、`资源`。
- 主文件的 H1 与文件名保持一致。
- 页面 frontmatter 至少包含 `type`、`title`、`summary`、`aliases`、`sources`、`created`、`updated`、`reviewed`、`confidence`、`tags`。
- 一篇资料只放在一个主题空间，用标签和双链实现跨主题检索。

## 图片策略

- Markdown 正文使用 Vault 相对路径嵌入 SVG/PNG。
- 4 张流程图默认展示纯 SVG 重绘版；每张图保留原始 PNG 截图证据链接。
- 2 张表格图直接嵌入 PNG，同时保留 Markdown 可检索表格。
- 所有图片必须在目标 Vault 中真实存在，迁移后逐项验证相对路径。

## 索引与登记

- 新建 `wiki/GEO/index.md`，作为 GEO 主题入口。
- 更新 `wiki/index.md`，加入 GEO 主题链接。
- 更新 `.manifest.json`，登记原始长图及生成页面。
- 更新 `.llmwiki/log.md`，记录迁移、重绘图和验证结果。

## 迁移策略

先复制到目标 Vault，再完成链接改写和验证。确认目标文件、图片、索引与检查脚本全部通过后，保留 Git 项目中的处理副本作为可回滚备份；Obsidian 中的 `大威天龙` 作为日常浏览和维护的正式知识库。

## 验收标准

1. Obsidian 左侧可见 `wiki/GEO` 和中文文章标题。
2. 主文章中 4 张 SVG 与 2 张 PNG 全部显示，链接无缺失。
3. 原始长图 SHA-256 与来源一致。
4. `.manifest.json` 可以被 JSON 解析。
5. `wiki_status.py` 与 `wiki_lint.py` 执行通过，或仅报告与本次迁移无关的既有问题。
6. 目标资料库中没有英文机器文件名 `readable.md`、`faithful.md`、`quality-report.md`。
