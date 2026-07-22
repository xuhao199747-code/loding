# AlphaRank 产品经理证据矩阵

本矩阵只记录 Figma 图片能够直接支持的陈述。允许的状态标签为：**已明确、建设中、规划/todo、候选技术方案、状态未知**。其中“已明确”仅表示材料明确表达了该设计或对象，不等于已经上线；只有图片明确出现“已落地、当前进度、建设中、todo”等字样时才进一步标注状态。

## 1. 产品定义与 GEO 工作流

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| AlphaRank 被抽象为 Data Layer、Knowledge Layer、Agent Layer、Application Layer | 1、20 | 已明确 | 四层能力各自的线上完成度 |
| GEO 的目标由网页排名扩展到 AI 对品牌的认知、推荐、Visibility、Citation、Authority、Conversion | 17、18 | 已明确 | 指标的线上计算公式和目标值 |
| GEO Workflow 包含问题发现、内容诊断、Gap 分析、优化建议、内容生成、发布验证 | 7、8 | 已明确 | 各环节当前负责人、SLA 与自动化比例 |
| AlphaRank 希望形成发现、分析、优化、验证的数据闭环 | 19、20 | 已明确 | 闭环是否已完整上线 |
| Answer Visibility、Content Diagnosis、Content Optimization、Competitive Intelligence、Trend Predictor 被列为能力模块 | 11、12、13 | 已明确 | 目标用户、购买者、使用频次与商业模式 |
| Agent Team 中列出 PromptBuilder、Data Analyst、Strategist、Brand Analyst、Content Expert、Trend Analyst、Distribution Expert | 9 | 建设中 | 各 Agent 的实际上线状态和人工介入点 |
| 材料列出数据、知识、Agent、Evaluation 四类挑战 | 14、15、16 | 已明确 | 挑战的优先级、负责人和解决期限 |

## 2. Prompt 来源与 PromptBuilder

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| PromptBuilder 负责热词发现、Prompt 构建和需求扩展 | 9 | 建设中 | 人工、外部数据和模型生成 Prompt 的占比 |
| 系统关注目标用户的问题、增长 Topic 与 Prompt、GEO 指标和引用差异 | 18 | 已明确 | “目标用户问题”的原始数据是否来自真实用户日志 |
| Prompt Cluster 以当前 Prompt 为核心聚类相近意图，并以族为单位诊断和优化 | 25 | 已明确 | 聚类模型、阈值、人工校正方式 |
| 总体架构列出 Search AutoComplete、People Also Ask、Related Search、Google Ads、DataForSEO、Effective Prompts、Keyword Volumes | 38 | 候选技术方案 | 每个来源是否已接入、更新频率和许可 |
| Prompt 生成通过 `/v1/responses` 进入 Direct Tool 路径，工具为 `promptbuilder_process` | 100、101 | 已明确 | 完整请求体、线上版本和错误码 |
| Direct Tool 流程包含工具名/参数提取、白名单校验、参数校验、内部执行、结构化 JSON 返回和 Session 持久化 | 100、101 | 已明确 | 白名单内容、参数默认值、重试策略 |
| 已注册 Agent 表中存在 `promptbuilder-agent`，职责是提示词发现与推荐、监控查询生成 | 93 | 已明确 | 它与 `promptbuilder_process` 的调用边界和上线状态 |

## 3. AI Answer、Citation 与 Dataset Builder

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| Dataset Builder 分为原始数据获取、数据清洗、数据集构建三部分 | 31、32 | 已明确 | 调度频率、任务规模和存储位置 |
| Prompt Set 进入 Crawler，输出 `prompt_id`、platform、search query、cite pages/urls、not-cite pages/urls、AIO Response、country/region | 31 | 已明确 | Prompt Set 最初由谁创建；Crawler 使用官方 API、浏览器还是第三方服务 |
| 数据按 Platform、Country/Region、Language、Industry、Sources 五个维度筛选 | 32 | 已明确 | 维度组合的覆盖目标与采样权重 |
| Sources 示例包含视频平台、社交媒体、新闻与博客等文本内容 | 32 | 已明确 | 各来源的抓取授权与数据许可 |
| 网页清洗示例包含域名筛选、长度限制、无效字符与元素过滤、图片视频链接处理、内外链文本替换、CTA 过滤 | 32 | 已明确 | 清洗规则版本、异常页面处理和人工抽检比例 |
| 总体架构列出 OpenAI、Perplexity、Grok、Meta AI 等 AI Search/Answer 来源以及 Crawler、External Service/MCP | 38 | 候选技术方案 | 各平台具体接入协议、账号体系与可用性 |
| AI Answer 到洞察通过 ETAL/ETLA Pipeline 处理，涉及 Visibility、Sentiment、Citation、Competitor 和深度分析 | 43、44、45 | 已明确 | 每个节点的完成状态、模型版本和 SLA |
| Pipeline 清单用于登记已落地数据管道 | 46 | 已明确 | 清单中每条 Pipeline 的完整输入输出与运行状态 |

## 4. Knowledge Layer、LightRAG 与数据隔离

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| 知识层包含 Knowledge Graph、GraphRAG、因果图等不同层级能力 | 4、5 | 候选技术方案 | 哪些层级已上线以及因果关系如何验证 |
| 离线知识库通过分层和服务契约向 Agent 提供能力 | 39、40、41 | 候选技术方案 | 最终技术选型和生产拓扑 |
| 数据流与 Pipeline 节点需要把来源上下文贯穿写入和查询 | 42、43、44、45 | 已明确 | 实际调度器、失败补偿和数据保留周期 |
| LightRAG 材料区分写入与查询主流程，并通过 Facade 隔离业务与库内部对象 | 47、48、51 | 候选技术方案 | 是否直接采用原生 LightRAG、二次开发范围 |
| 知识图谱构建包括 EmbeddingNode、KGExtractNode、KGMergeNode、实体与关系合并 | 52、53、54、55、56、57 | 候选技术方案 | 实体本体、消歧阈值、关系质量标准 |
| 材料列出图、向量、KV、Community 等存储及其关联关系 | 58、59、60、61、62 | 候选技术方案 | 每类存储的生产品牌、容量和备份方案 |
| QueryAPI Facade 提供 local、global、hybrid、mix、naive、community 等查询模式 | 63、64 | 候选技术方案 | 模式路由规则、默认值和线上质量 |
| workspace/project 维度用于隔离数据，材料区分三类隔离级别并扩展 metadata | 67、68、69 | 候选技术方案 | 租户权限模型、共享缓存边界和审计流程 |

## 5. Recall、索引与双路 Grounding

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| 向量召回被设计为服务能力，并按数据、服务、业务层分工 | 70、71 | 候选技术方案 | 服务的生产 SLA 和权威数据源 |
| 召回能力具有版本规则与路线图，材料要求区分可用与未完成能力 | 72、87、88 | 规划/todo | 各版本的实际发布日期和完成度 |
| 召回数据区分来源维度和 FULL/CHUNK 粒度 | 73、74 | 候选技术方案 | 切分长度、重叠策略和粒度默认值 |
| OpenSearch 索引材料列出主字段与辅助字段 | 75、76 | 候选技术方案 | 最终 Schema、分片、迁移与索引规模 |
| 知识问答主召回需要返回分数、来源和原文定位 | 77 | 已明确 | 返回字段的正式接口契约 |
| Hybrid Recall 并行组合关键词与向量能力，并涉及归一化、去重、融合 | 78 | 候选技术方案 | 融合公式、候选数和 Rerank 是否启用 |
| 文本生成使用参考范例与事实基础两路召回 | 79、80 | 候选技术方案 | 两路预算、冲突处理和生产效果 |
| `REFERENCE` 使用纯向量 topK=10；`KNOWLEDGE_FILE` 的 CHUNK 召回使用 Hybrid（BM25+Vector）topK=100 后融合到 top5/top10 | 80 | 候选技术方案 | 参数是否为生产默认值、是否随场景变化 |
| 两路结果应分别进入 Prompt；REFERENCE 用于风格，KNOWLEDGE_FILE 用于内容约束，并记录 source_id | 80 | 已明确 | Prompt 的完整模板和引用校验实现 |
| RecallRequest、二次访问、写入质量门禁、索引构建和 QueryResult 质量控制分别有设计 | 81、82、83、84、85、86 | 候选技术方案 | API 正式版本、拒绝码和线上监控数据 |

## 6. Agent Runtime、Direct Tool 与 AgentLoop

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| Agent 核心模块需要解耦入口协议、路由、上下文与模型层 | 36、37、38 | 候选技术方案 | 实际部署边界和服务数量 |
| 统一接口下存在 Direct Tool、Remote Agent、Local Agent、Raw LLM 四路路径 | 89、90、91、92 | 已明确 | 路由优先级、灰度配置和线上占比 |
| 已注册 Agent 清单记录名称、角色、路由方式和核心职责 | 93 | 已明确 | 清单是否等于全部线上 Agent |
| 核心业务路径对比显示不同任务不必共享同一种 AgentLoop | 94 | 已明确 | 各任务选择路径的最终决策表 |
| 网页诊断结构化请求需要 Schema 输出 | 95 | 已明确 | Schema 完整字段、失败修复次数 |
| 网页诊断和品牌诊断存在 AgentLoop 序列 | 97、98、99 | 已明确 | 工具上限、超时、并行度和人工确认点 |
| Prompt 生成和声量计算走 Direct Tool；Raw LLM 保留独立路径 | 100、101、102、103、104、105 | 已明确 | 每条路径的成本、延迟和降级阈值 |
| 诊断包含离线与在线双链路 | 106 | 候选技术方案 | 数据同步延迟和结果一致性策略 |

## 7. Diagnosis、LLM-as-Judge 与引用推断

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| 品牌诊断数据流把品牌理解、搜索采集、多维分析和报告连接起来 | 21 | 候选技术方案 | 数据源许可、模型版本和报告 SLA |
| 诊断优化可分阶段演进，并形成评分、优化、再评估闭环 | 23、24 | 候选技术方案 | 三阶段的上线边界和切换条件 |
| Rubric 由统计分析和 LLM-as-Judge 组成，材料称网页评分拆为 9 个维度、33 个子项 | 25、26、27、28 | 已明确 | 每个子项权重、训练/校准集和线上阈值 |
| LLM-as-Judge 有分数聚合设计 | 30 | 候选技术方案 | 采样次数、聚合公式、模型版本和一致性结果 |
| native/local/global/hybrid/mix/community 等模式有测试记录 | 65、66 | 已明确 | 测试集规模、期望答案和正式结论 |
| Inference Initialization、八类评估维度、工作流、Refinement、案例和建议构成引用推断链路 | 107、108、109、110、111、112、113 | 候选技术方案 | 推断模型、置信度公式和人工复核机制 |
| 品牌诊断总权重将情感、准确性、可信度、口碑等维度组合 | 114、115、116、117、118、119 | 候选技术方案 | 权重是否上线、基准样本、国内外可比性和等级误差 |

## 8. Content Generation、Experiment 与反馈

| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---:|---|---|
| 长内容生成被拆为 Planner、Generator、Integrator | 29 | 候选技术方案 | 每个阶段使用的模型、Prompt 和重试策略 |
| Planner 结合网页、诉求、人工策略和归因算子形成策略/大纲；Generator 改写补充；Integrator 检查一致性 | 29 | 已明确 | 各阶段的输入 Schema 与验收阈值 |
| 内容生成链路使用 Prompt Manager、RAG cited pages 和客户补充信息 | 29、33 | 候选技术方案 | 客户信息的录入方式、权限和事实校验 |
| 多模态生成会规划图片插入位置、上下文一致描述和结构化占位符 | 33、34 | 候选技术方案 | 图像模型、版权来源和上线状态 |
| Adversarial AI Search Engine 被列为研究方向 | 35 | 规划/todo | 使用边界、安全审批和实际目标 |
| 优化后需要发布验证并把结果反馈到下一轮 | 7、8、19、24 | 已明确 | 实验周期、对照设计、归因公式和显著性要求 |
