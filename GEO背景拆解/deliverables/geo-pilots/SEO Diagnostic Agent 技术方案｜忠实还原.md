---
type: source-transcript
title: SEO Diagnostic Agent 技术方案｜忠实还原
summary: 对系统架构图全部可辨识节点、连线与工程标注的结构化还原。
created: 2026-07-23
updated: 2026-07-23
reviewed: false
confidence: high
tags: [GEO, SEO, Agent, 忠实还原]
sources:
  - raw/GEO/首批样板/SEO Diagnostic Agent 技术方案/image 120.png
---

# SEO Diagnostic Agent 技术方案｜忠实还原

![[raw/GEO/首批样板/SEO Diagnostic Agent 技术方案/image 120.png]]

## 原图标题

- 页面标题：SEO 诊断 Agent — 技术方案评审文档
- 章节标题：三、系统架构图
- 图内标题：SEO Diagnostic Agent

## 节点与标签

1. `User Request`
   - 输入气泡：`URL + Keywords`
2. `① Route`
   - `RuntimeRouter`
   - `description matching`
3. `② Fetch`
   - `seo-diagnostic-agent`
   - Skills：`seo-diagnostic`、`seo-tech-infra`、`seo-on-page`、`seo-structured-data`
   - Tools：`web_crawler`、`seo_diagnose`
4. `③ Analyze`
   - `seo_diagnose Tool`
   - `technical_analyzer`
   - `on_page_analyzer`
   - `schema_analyzer`
   - `content_analyzer`
5. `④ Score`
   - `Scorer`
6. `⑤ Report`
   - `Reporter`
   - 输出：`DiagnosticReport JSON (0-100)`

## 连线关系

- User Request → RuntimeRouter。
- RuntimeRouter → seo-diagnostic-agent。
- seo-diagnostic-agent → 分析区。
- seo_diagnose Tool 向四个 analyzer 分发输入。
- 四个 analyzer 的输出汇入 Scorer。
- Scorer → Reporter。
- Reporter → DiagnosticReport JSON (0-100)。

## 工程标注

- `Phase 1: sequential inside tool`：指向工具内部顺序执行区域。
- `Phase 2: spawn parallel`：以虚线标出后续并行派发方式。
- `Engineering callout`：指向分析、评分、报告所在的工程实现边界。

## 重绘图

- [[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜完整技术版.svg|完整技术版]]
- [[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜PM简易版.svg|PM 简易版]]

## 还原说明

- 原图是一张嵌入文档的架构图，全部主体节点均清晰可读。
- 颜色背景只用于区分 Agent、分析器和评分报告区域，不引入额外业务含义。
- 完整技术版使用直线和箭头重新排版，节点、步骤编号、Phase 标注与原图一致；像素位置不是逐像素复制。

