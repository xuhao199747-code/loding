# AlphaRank / GEO Prompt 设计手册

## 使用边界

本手册区分 Figma 材料事实与通用产品方法。`材料明确`可以追溯到图号；`材料未说明`保持未知；示例 Prompt 标记为`面试/工作模板（非 AlphaRank 原始 Prompt）`，不能描述成 AlphaRank 当前线上配置。

## 一、先区分四种 Prompt 产品

### 1. Discovery Prompt

**材料明确：** PromptBuilder 负责热词发现、Prompt 构建和需求扩展（图 9）；Prompt Cluster 按相近意图组织诊断（图 25）；搜索联想、People Also Ask、Related Search、关键词数据等被列为输入来源（图 38）；Prompt Set 进入 Crawler（图 31）。

**材料未说明：** Prompt 的完整生成模板、聚类算法、各来源占比、真实用户问题接入和人工审核流程。

**面试/工作模板：** 输入品牌、产品、行业、地区、语言、平台和种子词，输出带来源、意图、Cluster、去重关系和优先级的候选问题。它的任务是建立市场观察样本，不是生成最终内容。

**好 Prompt：** 与明确用户意图对应，来源可追溯，地区语言适配，可稳定采集，Cluster 边界可解释。

**坏 Prompt：** 只替换品牌名批量生成、语义重复、混合多个意图、没有来源标签、把合成问题当成真实搜索量。

**验收：** 覆盖、重复、相关性、Cluster 纯度、人工采纳、有效采集和来源完整。

### 2. Agent Instruction Prompt

**材料明确：** Prompt 生成通过 Direct Tool 路径执行，包含工具白名单、参数校验、结构化 JSON 和 Session 持久化（图 100、101）；诊断任务存在 AgentLoop（图 97、99）。

**材料未说明：** System Prompt、工具描述全文、最大步骤、超时、重试和路由优先级。

**面试/工作模板：** 明确 Agent 的目标、可用工具、每个工具的使用条件、禁止行为、终止条件、输出 Schema 和失败返回。工具权限属于产品契约，不让模型自由发现越权能力。

**好 Prompt：** 工具选择边界清晰，参数可验证，终止条件明确，状态可审计，工具失败有降级。

**坏 Prompt：** “自行选择任何工具完成任务”、没有步骤上限、忽略权限、失败后无限重试、输出无法进入业务系统。

**验收：** 工具选择正确、参数有效、任务完成、循环终止、权限拒绝正确、延迟、成本和人工接管。

### 3. Generation Prompt

**材料明确：** 长内容生成拆成 Planner、Generator、Integrator（图 29）；动态 Prompt Manager 向各阶段输出 Prompt，并使用网页、策略、客户补充信息和 cited pages（图 29、33）；REFERENCE 与 KNOWLEDGE_FILE 分桶，前者用于风格，后者用于事实约束（图 80）。

**材料未说明：** 各阶段完整 Prompt、模型、温度、上下文预算、审核和线上效果。

**面试/工作模板：** Planner 只规划范围、Gap、证据和大纲；Generator 按大纲生成或改写；Integrator 检查跨段一致、事实支持、引用和格式。三个阶段使用不同输出 Schema，不用一个超长 Prompt 同时完成所有任务。

**好 Prompt：** 事实来源受控，参考样式与事实分离，输出结构明确，缺失证据时停止补写，每个结论可回溯。

**坏 Prompt：** 把优秀范文和客户知识混在一起、要求“丰富内容”却不限制新增事实、一次生成整篇且没有分阶段检查。

**验收：** 事实支持、引用正确、Schema 通过、结构一致、人工采纳、编辑距离、延迟和成本。

### 4. Judge Prompt

**材料明确：** Rubric 组合统计分析与 LLM-as-Judge，并包含 9 个维度、33 个子项；材料另有分数聚合和引用推断链路（图 25—30、107—113）。

**材料未说明：** Judge Prompt、模型版本、采样次数、聚合公式、人工标注集和阈值。

**面试/工作模板：** 每次只评估清晰定义的维度，输入 Rubric、待评对象和证据；输出分数、理由、evidence_id、置信度和无法判断。规则可算的项目不用 Judge 替代。

**好 Prompt：** Rubric 定义可观察，分档有锚点，要求证据，允许无法判断，版本固定且能与专家比较。

**坏 Prompt：** “请给内容质量打 0—100 分”、没有维度定义、不给证据、强制回答、模型升级后仍直接比较历史分数。

**验收：** 专家一致、重复稳定、证据支持、维度区分、置信度校准和复核率。

## 二、Prompt 的八段产品契约

1. **Goal**：产出要用于哪个业务决策，完成条件是什么。
2. **Input**：字段、类型、必填、版本和最大长度。
3. **Evidence Policy**：事实、参考、用户输入、模型知识各自能做什么。
4. **Task**：步骤和顺序；不要求模型执行系统无法验证的隐藏过程。
5. **Constraints**：禁止编造、权限、语言、范围和成本边界。
6. **Output Schema**：字段、枚举、空值和 evidence_id。
7. **Failure Behavior**：缺失、冲突、无证据、工具失败时返回什么。
8. **Evaluation**：Golden Set、指标、基线、版本和发布门禁。

## 三、面试/工作模板（非 AlphaRank 原始 Prompt）

下面是 GEO 内容诊断 Prompt 的完整候选模板，用于展示产品经理如何把业务要求写成可测试契约。

```text
[ROLE]
你是 GEO 内容诊断器。你的职责是定位页面对目标 Prompt Cluster 的覆盖问题，并输出可验证、可执行的改进建议。

[GOAL]
判断 PAGE_CONTENT 是否完整、准确地回答 TARGET_PROMPTS 的用户意图。每个问题必须提供页面证据；每条新增事实建议必须由 KNOWLEDGE_FILE 支持。

[INPUT]
TARGET_PROMPTS: Array<{prompt_id, prompt_text, intent, language, country}>
PAGE_CONTENT: {page_id, version, title, url, text, headings, metadata}
REFERENCE: Array<{source_id, text}>，只可用于参考结构和表达方式
KNOWLEDGE_FILE: Array<{source_id, chunk_id, text}>，可作为事实依据
RUBRIC: Array<{dimension_id, definition, scoring_anchor}>

[EVIDENCE POLICY]
1. PAGE_CONTENT 用于证明当前页面存在的问题或优点。
2. KNOWLEDGE_FILE 是新增事实的唯一允许来源。
3. REFERENCE 只影响风格和结构，不得把其中事实写入建议。
4. 不得使用无法定位来源的模型记忆补充事实。
5. 每个事实结论必须返回 source_id；页面问题必须返回 page_id 和原始片段。

[TASK]
1. 按 TARGET_PROMPTS 识别用户意图和预期答案范围。
2. 对每个 RUBRIC 维度检查 PAGE_CONTENT。
3. 输出问题、页面证据、受影响 Prompt 和严重程度。
4. 仅在 KNOWLEDGE_FILE 有支持时提出新增事实建议。
5. 输出页面结构或表达建议时说明预期改善的维度。
6. 列出证据不足、输入冲突和无法判断项。

[CONSTRAINTS]
- 不得生成 PAGE_CONTENT 和 KNOWLEDGE_FILE 均未支持的事实。
- 不得把 REFERENCE 的事实当作客户事实。
- 不得只给“提升质量、增强权威”等不可执行建议。
- 不得输出 RUBRIC 之外的总分。
- 保持输入语言；专有名词保留原文。

[OUTPUT SCHEMA]
{
  "summary": {
    "covered_prompt_ids": [""],
    "uncovered_prompt_ids": [""],
    "highest_priority_issue_ids": [""]
  },
  "issues": [
    {
      "issue_id": "",
      "dimension_id": "",
      "affected_prompt_ids": [""],
      "severity": "high|medium|low",
      "problem": "",
      "page_evidence": {"page_id": "", "quote": ""},
      "recommendation": "",
      "fact_sources": [{"source_id": "", "chunk_id": ""}],
      "confidence": "high|medium|low"
    }
  ],
  "unsupported_claims": [
    {"claim": "", "reason": "", "required_information": ""}
  ],
  "missing_information": [""]
}

[FAILURE BEHAVIOR]
- 必填输入缺失：不执行诊断，写入 missing_information。
- PAGE_CONTENT 为空：返回 invalid_page_content。
- KNOWLEDGE_FILE 无相关证据：允许结构建议，但不得建议新增事实。
- 输入证据互相冲突：将冲突写入 unsupported_claims，不自行选择一方。
- 输出无法满足 Schema：返回 schema_error，不用自然语言代替结构。
```

## 四、好 Prompt 与坏 Prompt 的评审卡

| 评审项 | 好 Prompt | 坏 Prompt |
|---|---|---|
| 目标 | 有可观察完成条件 | “全面、专业地分析” |
| 输入 | 字段、用途、版本清楚 | 把所有上下文拼成一段 |
| 证据 | 事实与参考分区并要求 ID | 允许模型自行补充 |
| 任务 | 步骤与范围清楚 | 同时要求诊断、生成、发布 |
| 约束 | 禁止行为可检查 | 只有“不要犯错” |
| 输出 | Schema、枚举、空值明确 | 任意自然语言 |
| 失败 | 缺失和冲突有返回 | 强制给出确定答案 |
| 评测 | 有 Golden Set 与版本 | 只凭主观感觉 |

## 五、Prompt 版本与发布流程

```text
业务失败样本 → 修改假设 → Prompt 版本 → Golden Set 离线评测
→ 人工错误分析 → 小流量灰度 → 在线质量/成本监控 → 扩量或回滚
```

产品经理在版本记录中至少保存 Prompt 类型、版本、目标、模型、Rubric、数据集、变更原因、离线结果、灰度结果和回滚条件。AlphaRank 材料没有展示该版本系统，因此这是面试/工作模板，不是产品现状声明。
