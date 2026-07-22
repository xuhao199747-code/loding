# AlphaRank / GEO AI 产品经理面试题库

使用规则：先讲材料事实，再讲材料未知；只有在明确说“如果由我设计”后，才进入个人方案。不要把个人方案包装成 AlphaRank 现状。

## 1. AlphaRank 的 Prompt 从哪里来？

**材料事实：** 图 9 显示 PromptBuilder 负责热词发现、Prompt 构建和需求扩展；图 38 列出 Search AutoComplete、People Also Ask、Related Search、Google Ads、DataForSEO、Effective Prompts 和 Keyword Volumes；图 31 显示 Prompt Set 进入 Crawler。

**材料未知：** 没有证据证明接入 CRM、客服、站内搜索或真实终端用户日志，也没有说明各来源占比。

**如果由我设计：** 我会把观察数据、客户提供数据和模型扩展数据分别保存来源标签，不把合成问题当成真实需求频次。

**验收方法：** 检查来源可追溯、重复、意图覆盖、人工相关性和有效采集，不编造材料没有提供的目标值。

## 2. API 输入了什么，PromptBuilder 生成了什么？

**材料事实：** 图 100、101 展示客户端通过 `/v1/responses` 进入 Direct Tool，系统提取工具名和参数，校验白名单与参数后调用 `promptbuilder_process`，可见参数包括 `keywords`、`brand_name`、`brand_info`、`top_k`，结果为结构化 JSON。

**材料未知：** 完整请求体、全部参数、默认值、错误码和生产版本没有展示。

**如果由我设计：** API 只接受明确业务输入，生成结果返回 Prompt、来源解释、Cluster、置信度和版本；非法参数、空输入和重复请求有稳定错误结构。

**验收方法：** 看参数校验通过率、Schema 通过率、生成相关性、重复率、延迟和成本。

## 3. AI Answer 和 Citation 怎样采集？

**材料事实：** 图 31 显示 Prompt Set 进入 Crawler，并产生 platform、search query、cite/not-cite pages、AIO Response 和 country/region；图 38 列出多个 AI Search/Answer 平台、Crawler 与 External Service/MCP。

**材料未知：** 每个平台究竟使用官方 API、浏览器还是第三方服务没有说明。

**如果由我设计：** 我会按授权、稳定、完整、成本、地域覆盖和维护负担评审每种接入，不在未确认时指定实现。

**验收方法：** 原始响应可回放，平台、时间、地区和 Prompt 版本完整，Citation 能回到原始页面。

## 4. Dataset Builder 为什么按五个维度筛选？

**材料事实：** 图 32 明确列出 Platform、Country/Region、Language、Industry、Sources 五个维度，并展示网页内容过滤规则。

**材料未知：** 五维组合的采样权重、覆盖目标和数据量没有说明。

**如果由我设计：** 五维组合用于控制样本偏差和定位差异，但需要成本预算和优先级，不追求无边界笛卡尔积。

**验收方法：** 查看组合覆盖、空桶、重复、清洗丢失、来源平衡和版本可复现。

## 5. 为什么同时需要向量、图和 KV 存储？

**材料事实：** 图 58—62 将图、向量、KV、Community 等存储分工并建立关联；图 52—57 展示实体关系与 Embedding 的加工链路。

**材料未知：** 生产数据库、容量、访问 SLA 和最终上线范围没有说明。

**如果由我设计：** 向量支持语义相似，图支持关系遍历，KV 支持状态和快速键访问；业务通过 Facade 使用，不直接绑定具体数据库。

**验收方法：** 检查统一主键、跨库追溯、部分失败补偿、删除传播和租户隔离。

## 6. local、global、hybrid、mix、community 如何选择？

**材料事实：** 图 63、64 列出这些 QueryAPI 模式，图 65、66 展示测试记录。

**材料未知：** 默认路由、融合公式、测试集结论和线上效果没有说明。

**如果由我设计：** 局部实体问题偏 local，宏观主题问题偏 global/community，关键词与语义并重时使用 hybrid/mix；实际选择由离线测试和成本延迟约束决定。

**验收方法：** 在带标准答案和证据的测试集上比较 Recall@K、nDCG、支持率、延迟和成本。

## 7. Direct Tool、AgentLoop 和 Raw LLM 为什么分路？

**材料事实：** 图 89—105 展示四路运行时；Prompt 生成和声量计算使用 Direct Tool，诊断使用 AgentLoop，普通模型调用保留 Raw LLM。

**材料未知：** 路由优先级、循环上限、超时、预算和 fallback 没有说明。

**如果由我设计：** 确定性计算与参数明确的任务走工具；多步工具协作走 AgentLoop；简单生成走 Raw LLM；跨系统再评估 Remote Agent。

**验收方法：** 比较任务完成、工具错误、平均步骤、延迟、成本、人工接管和循环终止。

## 8. LLM-as-Judge 如何避免评分漂移？

**材料事实：** 图 25—30 展示 9 个维度、33 个子项、统计分析、LLM-as-Judge 和分数聚合。

**材料未知：** Judge Prompt、模型版本、采样次数、聚合公式和人工校准集没有说明。

**如果由我设计：** 固定 Rubric、Prompt 和模型版本，强制 evidence_id，建立专家标注集，升级前重跑并做分层误差分析。

**验收方法：** 看专家一致性、重复稳定性、证据支持、校准误差和无法判断的正确使用。

## 9. 引用推断怎样表达证据与置信度？

**材料事实：** 图 107—113 给出 Inference Initialization、评估维度、工作流、Refinement、案例和建议。

**材料未知：** 推断模型、置信度公式和人工复核机制没有说明。

**如果由我设计：** 每个结论输出假设、支持证据、反对证据、置信度、替代解释和下一步验证，不把相关性写成因果。

**验收方法：** 抽检证据覆盖、矛盾处理、置信度校准和复核后结论变化。

## 10. 如何验证一次内容优化真的有效？

**材料事实：** 图 7、8、19、24 展示诊断、优化、生成、发布验证和反馈闭环。

**材料未知：** 实验窗口、对照组、显著性、外部事件处理和归因公式没有说明。

**如果由我设计：** 固定 Prompt Set、页面版本、平台和观察窗口，保存发布前后样本，记录平台模型变化和外部事件，报告置信度与替代解释。

**验收方法：** 比较 Visibility、Citation、SOV、内容质量和持续时间，同时检查采集健康和样本一致性。

## 11. AlphaRank 材料展示了哪些 Prompt 类型？

**材料事实：** 图 25 展示用于诊断的 Prompt Cluster；图 29、33 展示动态 Prompt Manager 对 Planner、Generator、Integrator 的生成指令；图 100、101 展示 PromptBuilder 的工具调用；图 30 体现 Judge 场景。

**材料未知：** 材料没有给出四类 Prompt 的完整文本、版本、默认参数和线上效果。

**如果由我设计：** 我会分成 Discovery Prompt、Agent Instruction Prompt、Generation Prompt 和 Judge Prompt，分别建立输入、输出、测试集和发布流程。

**验收方法：** 不用同一总分比较四类 Prompt，而按覆盖、工具正确、事实支持、评分一致性分别验收。

## 12. 你怎样设计 Prompt，什么是好 Prompt、坏 Prompt？

**材料事实：** 图 80 要求 REFERENCE 与 KNOWLEDGE_FILE 分桶，前者只用于风格，后者用于事实约束，并要求回写 source_id；图 100、101展示参数校验和结构化结果。材料没有给出统一的好坏定义。

**材料未知：** AlphaRank 原始 Prompt、Prompt 版本系统、Golden Set 和线上 A/B 结果没有展示。

**如果由我设计：** Prompt 包含目标、输入、证据政策、任务步骤、约束、输出 Schema、失败行为和评测。好 Prompt 可验证、可追溯、无冲突；坏 Prompt 目标模糊、事实与范例混用、只有形容词、没有 Schema 和失败路径。

**验收方法：** 使用固定 Golden Set 比较 Schema 通过、任务完成、事实支持、引用追溯、重复一致、延迟和成本。
