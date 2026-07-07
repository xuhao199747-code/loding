# Agent Capability Breakdown

## 1. Agent Prototypes

| Agent Prototype | Description | Core Value |
|---|---|---|
| 品牌数据分析师 Agent | 读取 GEO 监测数据、AI 回答、引用来源、竞品排名和趋势变化，解释品牌在 AI 搜索中的可见度表现，并给出异常归因和老板可读摘要。 | 把数据变成“发生了什么、为什么”的判断 |
| 品牌策略师 Agent | 基于问题库、关键词、竞品表现、引用源偏好和品牌内容缺口，识别可抢占机会，生成内容策略、信源策略和阶段性优化路线。 | 把诊断变成“应该怎么做”的策略 |
| 内容优化执行 Agent | 将策略拆成具体内容任务，生成官网页面、FAQ、案例、对比页、社媒文案等内容草稿，并提供 GEO 质检、发布建议和复盘任务。 | 把策略变成“能执行、能复盘”的动作 |

These three Agent prototypes are AlphaRank analysis lenses. They do not imply every competitor has these Agents as named product modules.

## 2. Strict Agent Status Labels

| Label | Meaning |
|---|---|
| 明确 Agent | Has a clear Agent / assistant / copilot / workflow entry plus context and tool/task execution evidence |
| Agent-like 工作流 | Has multi-step automated workflow, but no verified Agent entry or task state |
| 相关功能模块 | Has analysis, generation, report, or quality-check functions, but not a workflow Agent |
| 未公开 / 待验证 | Available evidence is insufficient |
| 未在已查资料中发现 | No evidence found in checked sources |

## 3. Product-Level Agent Status

| Product | 品牌数据分析师 Agent | 品牌策略师 Agent | 内容优化执行 Agent | Evidence | Conservative Judgment |
|---|---|---|---|---|---|
| AlphaRank | 相关功能模块 / 待验证 | 相关功能模块 / 待验证 | 相关功能模块 / 待验证 | AR-SRC-001, AR-IMG-001, AR-IMG-002, user-provided product notes | 已验证有 GEO 诊断和记录数据；用户说明中有营销 Agent 与任务体系，但当前截图不足以证明三个独立 Agent 的完整闭环。 |
| AIDSO GEO | 相关功能模块 | Agent-like 工作流 | Agent-like 工作流 | AIDSO-SRC-001, AIDSO-IMG-001 to AIDSO-IMG-005 | 公开页可验证诊断、排行榜、引用来源、知识库、问题拓展、内容创作、发布监控等工作流线索；尚不能证明有独立 Agent 对话入口或任务状态。 |
| ImpetaAI | 相关功能模块 | 相关功能模块 | 未公开 / 待验证 | IMP-SRC-001, IMP-IMG-001 to IMP-IMG-004 | 公开页可验证监测、AI 分析、Prompts 生成、竞品对比、诊断、报告和优化监测；尚不能证明有独立 Agent。 |
| Profound | 相关功能模块 | 明确 Agent | 明确 Agent | PRO-SRC-002, PRO-SRC-003, PRO-SRC-009, PRO-IMG-003 to PRO-IMG-005 | Agents 页面明确展示 custom Agents、Agent Builder、templates、closed-loop optimization 与内容规模化生产，可标为明确 Agent；底层模型和后端工具调用细节仍未公开。 |
| Writesonic | 未在本轮验证 | 未在本轮验证 | 待验证 | Not collected yet | 作为轻扫竞品，需要后续验证其 AI SEO / 内容生成工作流。 |
| Otterly.AI | 未在本轮验证 | 未在本轮验证 | 未在本轮验证 | Not collected yet | 作为轻扫竞品，需要后续验证其 AI 搜索监测能力。 |

## 4. 12-Layer Agent Anatomy

### 4.1 品牌数据分析师 Agent

| Layer | AlphaRank | AIDSO GEO | ImpetaAI | Profound |
|---|---|---|---|---|
| Agent positioning | 待验证；当前更像数据诊断入口和记录页 | 相关功能模块：排行榜、引用来源、品牌诊断 | 相关功能模块：品牌可见性、认知度、影响力、AI 智能分析 | 相关功能模块：Answer Engine Insights |
| Trigger entry | GEO 诊断页、诊断记录 | 实时搜索、品牌诊断 | 立即开始、登录/注册、监测平台入口 | Answer Engine Insights、dashboard/reporting entry |
| Input data | 品牌名、品牌介绍、官网、关键词、竞品等来自用户说明；当前页可见品牌名 | 用户问题、品牌、AI 平台、引用来源、排行榜数据 | 品牌、Prompts、竞品、AI 模型、行业场景 | Prompts/topics, brand, competitors, citations, sentiment |
| Context memory | 项目知识/个人知识来自用户说明；当前截图未验证 | 品牌知识库文案已验证，但记忆机制未验证 | 未在公开页验证 | 未在公开页验证 |
| Tool calling | 待验证 | 未验证；公开页仅显示流程和入口 | 未验证 | 未公开后端细节 |
| Reasoning path | 应为看指标、平台、竞品、引用、趋势再归因；当前待验证 | 排行榜和引用来源可支撑分析，但未验证自动归因 | AI 智能分析、认知维度、情感倾向可支撑分析 | Visibility, Share of Voice, sentiment, keyword, citation analysis |
| Output | GEO 得分、提及率、平均排名、引用率、引用来源数 | 排行榜、引用来源、诊断报告入口 | 深度分析报告、诊断、优化建议 | Visibility scores, sentiment insights, citations, reports |
| Editability | 未验证 | 未验证 | 未验证 | 未验证 |
| Collaboration | 未验证 | 未验证 | 未验证 | Enterprise packaging suggests team use, but exact collaboration flow not verified |
| Automation | 诊断/监测能力待验证 | 发布与监控流程文案已验证，自动化程度待验证 | 数据每日更新出现在资费页，自动化分析深度待验证 | Agent Analytics and reporting show monitoring; exact schedule controls not verified |
| Evidence chain | 诊断记录可回到具体指标；详情页待验证 | 引用来源倾向可作为证据链线索 | 信源诊断、引用来源分析文案可作为线索 | Citations and AI response analysis verified |
| Closed-loop metric | 提及率、排名、引用率 | 提及率、排名、引用率、内容创作和监控 | 品牌可见性、排名、引用来源、优化效果 | Visibility, Share of Voice, citations, traffic attribution |

### 4.2 品牌策略师 Agent

| Layer | AlphaRank | AIDSO GEO | ImpetaAI | Profound |
|---|---|---|---|---|
| Agent positioning | 待验证；用户说明中有品牌策略师、品牌诊断等营销 Agent | Agent-like 工作流：用户意图分析、AI 问题拓展、品牌知识库 | 相关功能模块：智能 Prompts 生成、竞品对比、优化建议 | 明确 Agent：Agents 页面展示自定义 Agents 与模板 |
| Trigger entry | 营销 Agent/任务体系来自用户说明，截图待补 | GEO 优化流程、GEO 内容生成入口 | 立即开始、诊断/优化监测 | Agents page, Try Agents, templates |
| Input data | 品牌项目、问题库、竞品、知识库，来自用户说明 | 品牌知识库、用户意图、AI 问题、引用源、内容 | 行业知识、用户搜索行为、竞品信息、搜索意图 | Topic demand, cited pages, brand content, workflows |
| Context memory | 项目知识、个人知识来自用户说明 | 品牌知识库已公开提及，持久上下文待验证 | 未验证 | Agent workflow context likely, but internal memory model not disclosed |
| Tool calling | 待验证 | 未验证 | 未验证 | Public page shows web page scrape, query determination, Perplexity FAQ research, publish workflow examples |
| Reasoning path | 应从诊断到机会再到路线图，待验证 | 诊断 -> 知识库 -> 情报 -> 意图 -> 问题 -> 内容 -> 发布监控 | Prompts 生成 -> 竞品对比 -> 智能诊断 -> 优化建议 | Templates -> research -> format recommendation -> closed-loop optimization |
| Output | 竞品差距报告、90 天路线图、内容机会矩阵来自用户说明 | 优化流程、内容生成、推荐网站/建议/质检报告文案 | 诊断报告、优化建议、分析报告 | Agent workflows, recommendations, content formats, optimization loop |
| Editability | 未验证 | 未验证 | 未验证 | Agent Builder drag-and-drop verified on public page |
| Collaboration | 未验证 | 未验证 | 运营服务和企业版联系销售 | Enterprise/team use suggested, detailed handoff not verified |
| Automation | 定时任务来自用户说明，截图待验证 | 发布与监控文案已验证，自动化待验证 | 每日更新和报告数量限制已验证，自动策略待验证 | Agents run workflows; exact scheduling controls not verified |
| Evidence chain | 待补截图 | 引用来源和流程图 | 竞品对比、信源诊断、优化监测 | Top-cited pages, recommendation, closed-loop optimization |
| Closed-loop metric | 提及率、推荐位、引用源变化 | 发布与监控、品牌得分、排名 | 可见性、排名变化、引用来源、效果追踪 | AI citation rates, visibility, content formats that earn citations |

### 4.3 内容优化执行 Agent

| Layer | AlphaRank | AIDSO GEO | ImpetaAI | Profound |
|---|---|---|---|---|
| Agent positioning | 待验证；用户说明中有爆款文案、小红书封面海报、任务体系 | Agent-like 工作流：GEO 内容生成、文章创作、发布监控 | 未公开 / 待验证；偏监测和服务 | 明确 Agent：content workflows, AEO FAQ generation, content refresh |
| Trigger entry | 营销 Agent、任务管理、委派给 Agent 来自用户说明 | 品牌监测/文章创作、GEO 内容生成 | 优化建议/运营服务 | Agents, templates |
| Input data | 品牌数据、机会矩阵、知识库、报告 | 品牌、AI 问题、目标模型、品牌知识库、用户意图 | 品牌内容、Prompts、竞品和信源诊断 | Web pages, core search query, Perplexity FAQs, top-cited pages |
| Context memory | 项目知识、个人知识来自用户说明 | 品牌知识库公开提及 | 未验证 | Workflow context visible, memory not disclosed |
| Tool calling | 工具调用来自用户说明，截图待补 | 内容生成、质检报告文案；工具调用机制未验证 | 未验证 | Web page scrape, query determination, FAQ research, publish shown in workflow example |
| Reasoning path | 机会 -> 任务 -> 内容 -> 复盘，待验证 | 问题拓展 -> 内容创作 -> 发布 -> 监控 | 诊断 -> 优化建议，执行链路不明显 | Research -> format recommendation -> content production -> closed-loop optimization |
| Output | 报告、任务、小红书文案等来自用户说明 | 优化文章、推荐网站、基础建议、依据说明、质检报告 | 报告和建议 | AEO FAQ, content refresh, production workflows |
| Editability | 未验证 | 未验证 | 未验证 | Drag-and-drop Agent Builder verified |
| Collaboration | 任务管理来自用户说明 | 未验证 | 运营服务 | Team-oriented workflow language; exact approvals not verified |
| Automation | 定时任务来自用户说明 | 发布与监控文案已验证 | 数据更新频率已验证 | Closed-loop optimization and workflow runs verified at marketing-copy level |
| Evidence chain | 待补 | 质检报告/依据说明文案可作为线索 | 诊断和信源分析线索 | Top-cited pages, citation rates |
| Closed-loop metric | 提及率、引用率提升 | 优化效果监控跟踪 | GEO 效果追踪 | AI citation rates and visibility improvements |

## 5. Key Caution for Report Writing

Do not write that AIDSO or ImpetaAI "has a brand strategist Agent" unless a verified Agent entry, task state, or tool-calling workflow is found. Use:

`公开资料可验证其具备相关功能或工作流线索，但尚不能证明其具备独立 Agent。`

For Profound, it is acceptable to write "明确 Agent" for the strategy/execution Agent dimensions because the official Agents page verifies custom Agents, Agent Builder, templates, closed-loop optimization, and content production at scale. Still, the report must state that backend model selection and exact tool-calling implementation are not publicly disclosed.
