# AlphaRank / GEO 面试深度扩充设计

## 背景与目标

现有飞书文档已经完成 119 张 Figma 图片的逐图登记，并将重复内容压缩为一套 AI 产品经理知识框架。但技术内容压缩过度，部分数据来源、处理链路、接口调用、评估方法和运行时机制只保留了结论，无法支持面试中的连续追问。

本次扩充的目标不是把文档改成研发实现手册，而是让读者能够基于 Figma 证据回答四类问题：数据从哪里来、数据如何流转、技术如何实现、产品如何验收。回答必须严格区分 AlphaRank 材料事实与候选设计，不能把行业常见做法写成 AlphaRank 已实现能力。

## 事实边界

每个技术主题固定使用四层信息结构：

1. **材料明确**：只陈述图片中可直接读取的对象、字段、流程、状态和技术名词，并标注图号。
2. **材料未说明**：列出图片没有回答的关键问题，例如数据究竟通过官方 API、Crawler 还是第三方服务获取。
3. **面试候选方案**：提供可用于面试作答的行业通用设计，必须使用“如果由我设计”“可选方案是”等条件表达，不能描述成 AlphaRank 事实。
4. **产品验收与追问**：说明产品经理应定义的输入输出、指标、风险、取舍和可继续追问的问题。

禁止使用“合理推断”“大概率”“应该已经”等模糊措辞填补事实空白。无法由图片确认的内容统一进入“材料未说明”或“面试候选方案”。

## 内容范围

在保留现有业务总览的基础上，新增“面试深挖：数据与技术实现”章节，覆盖以下主题：

### 1. Prompt 与用户问题

- PromptBuilder 的职责与当前状态。
- `/v1/responses`、Direct Tool、`promptbuilder_process`、参数校验和结构化返回。
- Search AutoComplete、People Also Ask、Related Search、Google Ads、DataForSEO、Effective Prompts 与 Keyword Volumes 等材料明确的数据源。
- Prompt Set 如何进入 Crawler，并关联 platform、search query、cite/not-cite pages、AIO Response 与 country/region。
- 明确指出材料未证明接入 CRM、客服、站内搜索或真实终端用户日志。
- 面试候选方案说明一方问题、观察问题和合成问题如何分层，但明确其不代表 AlphaRank 已实现。

### 2. AI Answer 与引用数据采集

- 材料中出现的 AI Search Engine、OpenAI、Perplexity、Grok、Meta AI、Crawler、External Service/MCP。
- AI Answer、Citation、Competitor、Sentiment 等输出如何进入 ETAL/ETLA Pipeline。
- 材料未说明各平台具体接入协议、账号体系、反爬策略和采集合法性时，不代替材料作答。
- 面试候选方案比较官方 API、受控浏览器采集与第三方数据服务的产品取舍。

### 3. Dataset Builder 与数据质量

- 原始数据获取、数据清洗、数据集构建三阶段。
- Platform、Country/Region、Language、Industry、Sources 五维筛选。
- 富文本网页筛选、长度限制、无效元素过滤等图中规则。
- 数据集版本、覆盖矩阵、重复率、失败率、来源追溯和人工抽检等面试验收设计。

### 4. 知识库与 LightRAG

- AI Answer、Knowledge File、Reference 的进入路径。
- Embedding、KGExtract、KGMerge、实体和关系合并、Community、Facade、QueryAPI。
- 图、向量、KV、文档状态和 Community 等存储职责。
- 写入链路、查询链路、多租户隔离和主键追溯。
- 对 LightRAG、PolarDB、OpenSearch 等明确标记为材料中的技术方案或选型，不擅自声明上线状态。

### 5. Recall 与内容 Grounding

- FULL/CHUNK、metadata、OpenSearch 索引字段与二次访问。
- naive、local、global、hybrid、mix、community 等查询模式。
- 向量召回、关键词召回、融合、去重和 Rerank。
- 参考范例与用户知识文件的双路召回及 Prompt 分区。
- 用召回率、准确率、来源可追溯、延迟、成本和租户隔离验收。

### 6. Agent 运行时与接口

- Direct Tool、Remote Agent、Local Agent、Raw LLM 四路分流。
- ResponsesHandler、ToolRegistry、SessionManager、白名单、参数校验和 Session 持久化。
- 网页诊断、品牌诊断、Prompt 生成、声量计算和 Raw LLM 的不同执行路径。
- AgentLoop 的工具次数、超时、并行、失败降级、权限和审计作为面试方案，不在缺少证据时声明具体默认值。

### 7. 诊断、LLM-as-Judge 与引用推断

- Prompt Cluster、9 个评分维度、33 个子项、统计分析与 LLM-as-Judge。
- 多次评分、分数聚合、证据输出和人工校准。
- Inference Initialization、Refinement、置信度、矛盾证据与反事实。
- 品牌诊断四类权重、国内外数据源差异和等级阈值均标记为待校准产品假设。

### 8. 内容生成与效果验证

- Planner、Generator、Integrator 的长内容生成链路。
- 内容事实来源与写作范例分区。
- 诊断、优化、生成、发布、重新采集与指标反馈。
- 内容版本、实验窗口、平台/模型版本和替代解释。

## 图表设计

保留现有 6 张总览画板，新增或细化以下可编辑画板：

1. Prompt 来源与 Prompt Set 构建链路。
2. AI Answer、Citation 与页面数据采集链路。
3. Dataset Builder 清洗与五维覆盖链路。
4. LightRAG 写入、存储与查询链路。
5. Recall 模式选择与双路 Grounding 链路。
6. Direct Tool Prompt 生成时序图。
7. AgentLoop、Direct Tool 与 Raw LLM 路径对比。
8. LLM-as-Judge 与引用推断校准闭环。

所有图都重新组织信息，不复制原图布局。图中的实线只表达材料明确链路；候选设计使用独立分区和“面试方案”标签，避免与事实混淆。

## 文档呈现

正文采用“问题—证据—回答”的面试阅读方式。每个主题先给一段可直接用于面试的短回答，再展开材料证据、实现链路、未说明项和产品验收。表格仅用于数据字段、方案对比和验收指标，流程与架构使用飞书可编辑画板。

原有 119 张图片附录继续保留，但增加“证据强度”和“是否属于已实现/建设中/候选方案/状态未知”字段；无法由截图确定状态时标记为“状态未知”。

## 验收标准

- 文档中的 AlphaRank 事实均能追溯到一个或多个图号。
- 所有材料未说明的问题被明确标注，没有用行业经验补成产品事实。
- 每个核心主题至少提供一段面试回答、一组实现链路、一组产品验收指标和追问边界。
- Prompt 来源问题明确回答“API 输入了什么、系统生成了什么、Crawler 采集了什么，以及材料没有证明什么”。
- 技术名词不只给定义，还说明它在 AlphaRank 链路中的输入、处理、输出和产品价值。
- 新增架构图为飞书可编辑画板，不插入 Figma 原始图片。
- 更新后回读飞书全文，检查事实标签、图号、未知项、画板数量和 119 条附录记录。

## 非目标

- 不声称获得 AlphaRank 源代码、线上配置或 Figma 之外的内部信息。
- 不把候选设计包装成 AlphaRank 已上线能力。
- 不提供具体平台的绕过限制、反爬规避或未获授权的数据采集方案。
- 不要求 AI 产品经理掌握数据库部署、类级代码实现或运维命令。
