# GEO 知识库文章标题规范化设计

## 目标

在不改变文章内容、不合并文章的前提下，按每篇 `全文.md` 的核心目标重新命名 Obsidian 文章目录，使标题短、准、可扫描。

## 命名规则

1. 标题采用“一个核心对象 + 一个文档类型”，例如 `RAG架构设计`、`Prompt生成评测标准`。
2. 不使用“A 与 B”“A 和 B”式并列标题。
3. 删除图片编号、日期尾缀、`整体`、`最新版`、`初版`、`思考`、`详解`等不能帮助检索的词。
4. 只有版本本身具有产品识别价值时才保留版本号，例如 `AlphaRank V1.1.0产品优化`。
5. 不使用“关于……”“基于……”“面向……的……”等长句结构。
6. 英文产品名、协议名或模型名可保留，中文文档类型必须清楚。
7. 内容主旨清晰且标题已经简洁的文章保持原名。
8. 近似文章不合并；根据正文侧重点分别命名，确保目录名唯一。

## 同步范围

每次重命名必须同步更新：

- Obsidian 文章目录名。
- `全文.md` 的正文主标题及相关 frontmatter。
- `产品经理版.md` 的正文主标题及 `article_title` 等相关 frontmatter。
- Obsidian WikiLink、Markdown 链接及其他指向旧文章目录或旧文章标题的引用。

`全文.md`、`产品经理版.md`、`资源/` 及资源文件名不改名。

## 重命名映射

未列出的文章保持原名。

| 来源目录 | 原标题 | 新标题 |
|---|---|---|
| 产品功能 | 2026-03-09需求拆分与排期 | GEO需求排期 |
| GEO 产品 Agent 方案 | AB方案 | GEO A-B实验方案 |
| GEO 产品 Agent 方案 | AEO-GEO Gateway交互协议 | Agent Gateway协议 |
| GEO 产品 Agent 方案 | AI Answer 归因引擎设计输入 | AI Answer归因指标 |
| 产品功能 | AI Search仿真环境 | AI Search仿真方案 |
| 工程与运维 | AI引用判断数据构造Prompt | AI引用判断Prompt |
| GEO 产品 Agent 方案 | AI引用诊断与内容优化算法 | AI引用优化算法 |
| 工程与运维 | AI站点扩容与监控 | AI站点运维方案 |
| GEO 产品 Agent 方案 | AlphaRanker技术架构 | AlphaRank技术架构 |
| GEO 产品 Agent 方案 | AlphaRanker整体系统架构-850 | AlphaRank系统架构 |
| GEO 产品 Agent 方案 | AlphaRanker系统架构演进 | AlphaRank架构演进 |
| GEO 产品 Agent 方案 | AlphaRank产品整体方案 | AlphaRank产品架构 |
| GEO 产品 Agent 方案 | AlphaRank品牌营销能力图 | AlphaRank营销能力地图 |
| GEO 产品 Agent 方案 | AlphaRank：归因引擎设计 | AlphaRank归因引擎 |
| GEO 产品 Agent 方案 | AlphaRank：面向 AI Search 时代的 Agentic 营销平台 | AlphaRank Agentic营销平台 |
| 产品功能 | Alpharanker产品模块与能力进展 | AlphaRank产品能力进展 |
| 产品功能 | Alpharanker工作原理 | AlphaRank产品原理 |
| GEO 产品 Agent 方案 | Benchmark 参照系设计 | GEO Benchmark设计 |
| 产品功能 | Citation引用分析 | Citation分析PRD |
| GEO 产品 Agent 方案 | Claim 定义、使用与计算方式 | Claim数据模型 |
| GEO 产品 Agent 方案 | DataAgent单点能力评测标准 | DataAgent评测标准 |
| GEO 产品 Agent 方案 | FY26S2-SearchQueryValidation规划 | 搜索查询验证算法 |
| GEO 产品 Agent 方案 | FY26S2-优化算法规划 | GEO内容优化算法 |
| 产品功能 | FY26S2-诊断指标优化 | 诊断指标决策树 |
| 产品功能 | FY26S2-诊断模型设计 | 引用偏好诊断模型 |
| GEO 产品 Agent 方案 | FY27 S1 OKR | FY27 S1 Agentic产品OKR |
| 产品功能 | GAIO国内搜索替代方案 | GAIO国内搜索方案 |
| 产品功能 | GEO API需求 | GEO API PRD |
| GEO 产品 Agent 方案 | GEO Agent架构方案 | GEO Agent架构 |
| GEO 产品 Agent 方案 | GEO-AEO思考 | GEO-AEO产品架构 |
| GEO 产品 Agent 方案 | GEO-AEO整体技术演进 | GEO-AEO技术架构 |
| GEO 产品 Agent 方案 | GEO产品Agent方案总PRD | GEO Agent产品PRD |
| 产品功能 | GEO内容准出结构 | GEO内容准出标准 |
| GEO 产品 Agent 方案 | GEO内部Agent交互协议 | GEO Agent交互协议 |
| GEO 产品 Agent 方案 | GEO图谱构建方案设计 | GEO知识图谱架构 |
| 产品功能 | GEO安全研究-对抗性AI搜索 | 对抗性AI搜索研究 |
| GEO 产品 Agent 方案 | GEO知识图谱构建方案 | LightRAG图谱构建方案 |
| 产品功能 | Google Search Console可获取数据说明 | Google Search Console数据说明 |
| 产品功能 | Lazada平台型观测实验初版 | Lazada观测实验方案 |
| 产品功能 | Prompt声量预测 | Prompt声量预测模型 |
| 产品功能 | Prompt构建与优化业务需求 | Prompt产品需求 |
| 产品功能 | Prompt生成优化方案-一阶段 | Prompt生成算法 |
| GEO 产品 Agent 方案 | Prompt生成能力评测 | Prompt生成评测标准 |
| GEO 产品 Agent 方案 | RAG检索方案-22 | RAG架构设计 |
| 产品功能 | Reverse Reasoning-综合分析 | AI引用行为分析 |
| 产品功能 | SEO指标项整理 | SEO指标体系 |
| GEO 产品 Agent 方案 | SEO诊断Agent技术方案评审 | SEO诊断Agent方案 |
| 产品功能 | SEO诊断链路指标实现详解 | SEO诊断指标实现 |
| GEO 产品 Agent 方案 | StrategyAgent评测任务集 | StrategyAgent评测集 |
| 产品功能 | V1.1.0功能整体优化 | AlphaRank V1.1.0产品优化 |
| 产品功能 | WebPage 因子第一版设计 | WebPage因子模型 |
| GEO 产品 Agent 方案 | industry-research-agent整体方案 | 行业调研Agent方案 |
| GEO 产品 Agent 方案 | 业务数据回流与Agent应用 | Agent数据回流方案 |
| 产品功能 | 代表性行业品牌库 | 行业品牌库 |
| 产品功能 | 企业知识库维护 | 企业知识库管理 |
| 产品功能 | 优化版本1-协议【20251124】 | 内容优化接口协议 |
| 产品功能 | 关键词挖掘-图谱构建 | 关键词图谱设计 |
| 产品功能 | 内容生成优化迭代-图文Blog | 图文Blog生成方案 |
| 产品功能 | 内容诊断-基于因子的模型方案 | 内容诊断因子模型 |
| GEO 产品 Agent 方案 | 各版本Prompt调试迭代 | 内容生成Prompt设计 |
| 产品功能 | 向量检索召回方案 | 向量召回产品架构 |
| GEO 产品 Agent 方案 | 向量检索召回方案 | 向量检索技术架构 |
| GEO 产品 Agent 方案 | 品牌内容资产设计 | 品牌内容资产模型 |
| GEO 产品 Agent 方案 | 品牌库功能设计方案 | 品牌库产品设计 |
| GEO 产品 Agent 方案 | 品牌库驱动内容创作 | 品牌内容创作方案 |
| GEO 产品 Agent 方案 | 品牌识别与归一链路 | 品牌归一流程 |
| 产品功能 | 品牌诊断 | 品牌诊断Prompt方案 |
| 产品功能 | 品牌诊断-协议 | 品牌诊断接口协议 |
| GEO 产品 Agent 方案 | 品牌诊断技术流程 | 品牌诊断任务流程 |
| GEO 产品 Agent 方案 | 品牌诊断方案-122 | 品牌诊断产品链路 |
| GEO 产品 Agent 方案 | 品牌诊断方案-21 | 品牌诊断信息链路 |
| 工程与运维 | 国内AI回答渠道现状 | 国内AI回答渠道 |
| 产品功能 | 国内数据渠道拓展 | 国内GEO数据渠道 |
| 产品功能 | 图文Blog内容生成优化 | 图文Blog生成流程 |
| GEO 产品 Agent 方案 | 平台侧品牌库功能设计 | 品牌库运营设计 |
| GEO 产品 Agent 方案 | 平台品牌库建设方案 | 品牌库平台架构 |
| GEO 产品 Agent 方案 | 归因结果的Agent消费与评估闭环 | Agent归因闭环 |
| 产品功能 | 技术SEO诊断 | 技术SEO诊断方案 |
| 产品功能 | 数据建设 | 引用偏好数据工程 |
| 产品功能 | 数据构造-20260115 | AI引用推理数据 |
| 产品功能 | 数据集构建 | AI引用数据集 |
| GEO 产品 Agent 方案 | 架构设计 | GEO评测Agent架构 |
| 产品功能 | 电商业务关键词搜索意图聚类 | 电商搜索意图聚类 |
| GEO 产品 Agent 方案 | 离在线诊断链路 | GEO诊断算法链路 |
| GEO 产品 Agent 方案 | 站内文本内容页面优化 | 站内内容生成方案 |
| 产品功能 | 算法链路数据分类 | GEO诊断数据模型 |
| GEO 产品 Agent 方案 | 统一入口四路分流Agent架构 | GEO Agent路由架构 |
| GEO 产品 Agent 方案 | 网页诊断-技术方案 | 网页诊断技术方案 |
| GEO 产品 Agent 方案 | 营销Agent Team产品V2 | 营销Agent Team PRD |
| GEO 产品 Agent 方案 | 营销Agent主要场景与技术依赖 | 营销Agent场景地图 |
| GEO 产品 Agent 方案 | 行业与知识个性化 | Agent个性化方案 |
| GEO 产品 Agent 方案 | 行业知识采集Agent方案 | 行业知识Agent方案 |
| 产品功能 | 行业细分字典 | 行业分类字典 |
| 产品功能 | 订阅技术方案 | 订阅系统设计 |
| GEO 产品 Agent 方案 | 诊断优化与Judge模型方案 | Judge诊断模型 |
| GEO 产品 Agent 方案 | 诊断优化算法链路-20251214 | GEO诊断优化算法 |
| 产品功能 | 诊断指标最新版 | GEO诊断指标体系 |
| 工程与运维 | 诊断模型调用情况 | 诊断模型调用链路 |
| 产品功能 | 诊断链路梳理 | GEO诊断数据链路 |

## 近似文章处理

- 两篇原名均为 `向量检索召回方案`：产品功能目录中的正文重点是产品召回场景，命名为 `向量召回产品架构`；原 Agent 目录中的正文重点是统一契约、存储与检索实现，命名为 `向量检索技术架构`。
- `品牌诊断方案-122` 与 `品牌诊断方案-21` 的原图内容高度接近，但仍遵守一图一文、不合并。前者命名为 `品牌诊断产品链路`，后者命名为 `品牌诊断信息链路`。
- `GEO图谱构建方案设计` 强调完整离线架构，命名为 `GEO知识图谱架构`；`GEO知识图谱构建方案` 明确围绕 LightRAG 落地，命名为 `LightRAG图谱构建方案`。
- 两篇图文 Blog 文档分别侧重完整生成方案和具体执行流程，命名为 `图文Blog生成方案`、`图文Blog生成流程`。

## 执行顺序

1. 在分类迁移前读取全部映射，检查旧目录存在且新目录不存在。
2. 使用临时唯一目录名完成可能发生名称交叉的移动，禁止覆盖。
3. 按已确认的分类映射移动并重命名整个文章目录。
4. 同步更新正文主标题、frontmatter 和库内链接。
5. 验证 116 个文章目录仍各自包含两份 Markdown 和一个 `资源/`。
6. 验证所有 WikiLink、Markdown 链接、SVG、表格、代码围栏和来源引用。

## 验收标准

1. 116 篇文章数量不变，且没有同名目录。
2. 所有新标题不含 `与` 或 `和` 的并列结构。
3. 新标题不含原图编号、无意义日期尾缀或空泛状态词。
4. 目录名、正文主标题、`article_title` 和内部链接保持一致。
5. `全文.md`、`产品经理版.md` 和资源文件数量不变。
6. 原图字节不变，资源引用无断链。
