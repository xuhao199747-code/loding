---
type: source
title: SEO Diagnostic Agent 技术方案
summary: 面向产品经理解释 SEO 诊断 Agent 的输入、路由、抓取、四类分析、评分和报告链路。
created: 2026-07-23
updated: 2026-07-23
reviewed: false
confidence: high
tags:
  - GEO
  - SEO
  - Agent
  - 技术架构
sources:
  - raw/GEO/首批样板/SEO Diagnostic Agent 技术方案/image 120.png
---

# SEO Diagnostic Agent 技术方案

![[raw/GEO/首批样板/SEO Diagnostic Agent 技术方案/image 120.png]]

- [[wiki/GEO/来源/SEO Diagnostic Agent 技术方案｜忠实还原|忠实还原版]]
- [[wiki/GEO/来源/SEO Diagnostic Agent 技术方案｜质量报告|质量报告]]
- [[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜完整技术版.svg|完整技术版流程图]]
- [[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜PM简易版.svg|PM 简易版流程图]]

## PM 简易版流程

![[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜PM简易版.svg]]

一句话：用户提交 **URL + Keywords**，系统选择 SEO 诊断 Agent，抓取并诊断页面，把结果分成四类分析，统一评分后输出 0–100 分的 JSON 诊断报告。

## 解决什么产品问题

传统 SEO 诊断容易把抓取、技术检查、页面内容、结构化数据和报告生成揉在一起。原图把它拆成可组合的 Agent 链路，使产品可以回答：

- 用户给什么输入？
- 系统为什么选择这个 Agent？
- 页面由哪些能力抓取和诊断？
- 分数来自哪些分析维度？
- 最终报告的格式和范围是什么？

## 核心业务流程

| 步骤 | 原图节点 | 产品含义 | 可验收结果 |
|---|---|---|---|
| 1. Route | RuntimeRouter / description matching | 根据请求描述选择 SEO 诊断能力 | 请求被正确路由，错误 Agent 选择率可衡量 |
| 2. Fetch | seo-diagnostic-agent | 装配所需 Skills 和 Tools | URL 可抓取，关键词随任务传入 |
| 3. Analyze | 四类 analyzer | 从技术、页面、Schema、内容四个角度检查 | 每个维度都有结构化发现与证据 |
| 4. Score | Scorer | 把多维发现汇总成分数 | 分数范围、权重、缺失值处理明确 |
| 5. Report | Reporter | 生成面向下游的诊断结果 | 输出 `DiagnosticReport JSON (0-100)` |

## 四类分析器分别看什么

> [!info] 原图事实
> 原图只给出了分析器名称，没有展开检查规则。以下“可能检查”属于产品解释，需研发确认。

| 分析器 | 原图明确的职责名 | 产品上可能对应的检查（推断） |
|---|---|---|
| technical_analyzer | 技术分析 | 可访问性、状态码、索引控制、性能等 |
| on_page_analyzer | 页面分析 | 标题、描述、标题层级、链接等 |
| schema_analyzer | 结构化数据分析 | Schema 类型、字段完整性和语法 |
| content_analyzer | 内容分析 | 关键词覆盖、主题相关性、可读性等 |

## Skills 与 Tools 的关系

原图中 Agent 内包含两类可组合能力：

- **Skills**：`seo-diagnostic`、`seo-tech-infra`、`seo-on-page`、`seo-structured-data`，更像诊断知识、规则和任务编排能力。
- **Tools**：`web_crawler`、`seo_diagnose`，更像能被调用的抓取与执行工具。

> [!tip] 产品解释
> Skills 决定“按什么方法判断”，Tools 决定“实际调用什么能力拿到数据或执行诊断”。这是基于命名和位置的解释，原图没有给出接口定义。

## 两阶段执行方式

完整图右侧标出了两个工程阶段：

- **Phase 1: sequential inside tool**：在 `seo_diagnose` 工具内部顺序完成分析、评分、报告。
- **Phase 2: spawn parallel**：后续阶段将部分任务并行派发，以降低耗时或增强模块独立性。

这意味着产品验收不能只看报告内容，还应记录总耗时、各分析器耗时、失败隔离和部分结果返回策略。

## 输入与输出契约

### 输入

- `URL`：待诊断页面或站点入口。
- `Keywords`：目标关键词集合。

原图没有说明 URL 数量、关键词上限、登录态、地区、语言和抓取权限，这些都应补为产品约束。

### 输出

原图明确为 `DiagnosticReport JSON (0-100)`。建议 PRD 至少定义：

- 总分与分维度分数；
- 每条问题的证据、严重程度和建议；
- 抓取时间、规则版本、模型版本；
- 无法抓取或部分分析失败时的状态；
- 相同输入能否复现或解释分数变化。

## 产品风险

- 抓取失败却输出正常分数，造成“假诊断”；
- 四类分析权重不透明，分数无法解释；
- 并行任务部分失败时仍生成完整报告假象；
- 关键词与页面语言不一致导致误判；
- 报告 JSON 字段不稳定，影响前端、存储和后续 Agent。

## 验收清单

- [ ] 同一请求能稳定路由到 `seo-diagnostic-agent`。
- [ ] 四类分析器都有独立状态、耗时、发现和证据。
- [ ] 分数范围严格为 0–100，权重和缺失策略可解释。
- [ ] Reporter 能输出符合 schema 的 JSON。
- [ ] 抓取失败、单分析器失败、超时都能被区分。
- [ ] Phase 2 并行后结果与 Phase 1 在允许误差内一致。
- [ ] 报告能回溯 URL、Keywords、规则和版本。

## 完整技术图

![[wiki/GEO/资源/SEO Diagnostic Agent 技术架构｜完整技术版.svg]]

