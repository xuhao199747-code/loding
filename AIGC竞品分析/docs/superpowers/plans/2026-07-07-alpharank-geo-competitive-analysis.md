# AlphaRank GEO Competitive Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a verified Feishu competitive analysis report for AlphaRank's GEO, AI Search Visibility, AIGC text optimization, and Agent direction.

**Architecture:** The work is organized as evidence-first research, screenshot capture, horizontal comparison matrices, Agent capability analysis, and Feishu document writing. Every module must be verified before being written, and unsupported claims must be marked as "待验证", "未公开", or "未在已查资料中发现".

**Tech Stack:** Feishu Docs via `lark-cli docs`, browser screenshots via in-app browser, web search for public sources, local Markdown for plans/specs, Mermaid for operation logic diagrams.

## Global Constraints

- Final artifact target: `https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e`
- Write final report in Chinese.
- Use conclusion-first structure.
- Prefer horizontal tables for multi-competitor comparison.
- Deep-dive products: AlphaRank, AIDSO GEO, ImpetaAI, Profound.
- Light-scan products: Writesonic, Otterly.AI, 透镜 GEO / TIMUS.AI, 搜极星 / Sougeo.
- Do not claim a product has an Agent unless evidence shows Agent entry, context, tool calling, task state, or closed-loop execution.
- Separate "monitored AI platforms" from "underlying model used by the product".
- Every factual claim about function, pricing, financing, company background, model, or Agent capability must have a source link, screenshot ID, or verification status.
- Screenshot evidence IDs must use prefixes: `AR-IMG`, `AIDSO-IMG`, `IMP-IMG`, `PRO-IMG`.

---

### Task 1: Evidence Workspace and Source Ledger

**Files:**
- Create: `evidence/source-ledger.md`
- Create: `evidence/claim-ledger.md`
- Create: `evidence/screenshots/README.md`

**Interfaces:**
- Produces: a source ledger table with IDs used by all later tasks.
- Produces: a claim ledger table used to prevent unsupported conclusions.

- [ ] **Step 1: Create evidence directories**

Run:

```bash
mkdir -p evidence/screenshots
```

Expected: `evidence/screenshots` exists.

- [ ] **Step 2: Create `evidence/source-ledger.md`**

Content:

```markdown
# Source Ledger

| Source ID | Product | Module | Source Type | Source URL / Location | Access Date | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| AR-SRC-001 | AlphaRank | Product baseline | Logged-in product page | https://alpharankai.com/alpha_ranker/geo/diagnose | 2026-07-07 | A | User provided access in in-app browser |
| AIDSO-SRC-001 | AIDSO GEO | Public product page | Official website | https://geo.aidso.com/ | 2026-07-07 | A | Public SPA page inspected in browser |
```

- [ ] **Step 3: Create `evidence/claim-ledger.md`**

Content:

```markdown
# Claim Ledger

| Module | Product | Claim | Evidence | Status | Risk / Caveat | Report Wording |
|---|---|---|---|---|---|---|
| Product baseline | AlphaRank | AlphaRank has a GEO diagnosis page with brand diagnosis and webpage diagnosis tabs | AR-SRC-001, AR-IMG-001 | Verified | Need additional result-page screenshots for deeper analysis | AlphaRank 已验证具备 GEO 诊断入口，包含品牌诊断与网页诊断。 |
| Product page | AIDSO GEO | AIDSO public page shows real-time search, brand diagnosis/report, brand monitoring/article creation, toolbox, and API service navigation | AIDSO-SRC-001, AIDSO-IMG-001 | Verified | Public page only; logged-in depth requires validation | AIDSO 官网已验证其将实时搜索、品牌诊断、品牌监测、文章创作、工具箱与 API 服务作为核心入口。 |
```

- [ ] **Step 4: Create screenshot README**

Content:

```markdown
# Screenshot Evidence

Screenshots are stored with these prefixes:

| Prefix | Product |
|---|---|
| AR-IMG | AlphaRank |
| AIDSO-IMG | AIDSO GEO |
| IMP-IMG | ImpetaAI |
| PRO-IMG | Profound |

Every screenshot must include:

- Screenshot ID.
- Product.
- Page/module.
- What it proves.
- Source URL.
- Capture date.
```

- [ ] **Step 5: Verify files exist**

Run:

```bash
test -f evidence/source-ledger.md && test -f evidence/claim-ledger.md && test -f evidence/screenshots/README.md
```

Expected: command exits with status `0`.

### Task 2: Capture Product Screenshots and Public Evidence

**Files:**
- Modify: `evidence/source-ledger.md`
- Modify: `evidence/claim-ledger.md`
- Add screenshots under: `evidence/screenshots/`

**Interfaces:**
- Consumes: source ID and screenshot ID naming from Task 1.
- Produces: screenshot and source evidence for AlphaRank, AIDSO, ImpetaAI, Profound.

- [ ] **Step 1: Capture AlphaRank core screenshots**

Use in-app browser on `https://alpharankai.com/alpha_ranker/geo/diagnose`.

Required screenshots:

| Screenshot ID | Page / Module | Proves |
|---|---|---|
| AR-IMG-001 | GEO 诊断页 | Brand diagnosis and webpage diagnosis entry |
| AR-IMG-002 | 诊断记录 / 示例结果 | GEO score, mention rate, average rank, site citation rate |

- [ ] **Step 2: Capture AIDSO public screenshots**

Use in-app browser on `https://geo.aidso.com/`.

Required screenshots:

| Screenshot ID | Page / Module | Proves |
|---|---|---|
| AIDSO-IMG-001 | 首页首屏 | Real-time search and brand diagnosis entry |
| AIDSO-IMG-002 | GEO 行业品牌排行榜 | Brand mention rate, mention count, average rank, sentiment, brand score |
| AIDSO-IMG-003 | GEO 引用来源倾向 | Citation source analysis |
| AIDSO-IMG-004 | 爱搜 GEO 优化流程 | Diagnosis to knowledge base, intelligence, question expansion, content creation, publishing and monitoring workflow |
| AIDSO-IMG-005 | GEO 内容生成 / 品牌知识库相关入口 | Content execution capabilities, not necessarily Agent |

- [ ] **Step 3: Capture ImpetaAI public screenshots**

Search and open the official ImpetaAI product page.

Required screenshots:

| Screenshot ID | Page / Module | Proves |
|---|---|---|
| IMP-IMG-001 | Official positioning page | Domestic GEO / brand visibility positioning |
| IMP-IMG-002 | Product capability section | Brand monitoring, competitor comparison, source tracing, sentiment if present |
| IMP-IMG-003 | Report / analysis / dashboard evidence | ToB analysis or reporting capability if present |

- [ ] **Step 4: Capture Profound public screenshots**

Search and open official Profound pages.

Required screenshots:

| Screenshot ID | Page / Module | Proves |
|---|---|---|
| PRO-IMG-001 | Homepage / positioning | Enterprise AI visibility positioning |
| PRO-IMG-002 | Platform / product page | Monitoring, prompts/topics, competitors, citations or similar capabilities |
| PRO-IMG-003 | Reporting / enterprise / workflow page | Enterprise reporting or team workflow capability |
| PRO-IMG-004 | Pricing / demo / sales entry | Commercial packaging if public |

- [ ] **Step 5: Update ledgers**

For every screenshot, add rows to:

- `evidence/source-ledger.md`
- `evidence/claim-ledger.md`

Expected: every screenshot used later has an evidence row and a claim row.

### Task 3: Company, Financing, Pricing, and Model Transparency Research

**Files:**
- Create: `evidence/company-commercial-research.md`
- Modify: `evidence/source-ledger.md`
- Modify: `evidence/claim-ledger.md`

**Interfaces:**
- Consumes: product set from design spec.
- Produces: verified company/commercial matrix inputs.

- [ ] **Step 1: Research company ownership**

For AlphaRank, AIDSO, ImpetaAI, Profound, Writesonic, Otterly.AI, 透镜 GEO / TIMUS.AI, 搜极星 / Sougeo, collect:

- Product name.
- Company name.
- Country / region.
- Official website.
- Company background.
- Verification status.

- [ ] **Step 2: Research financing**

For each product, collect:

- Financing round.
- Amount.
- Investors.
- Date.
- Source.
- Status: verified / not publicly disclosed / to verify.

Use only official announcements, credible media, financing databases, listed-company disclosures, or company pages.

- [ ] **Step 3: Research pricing and packaging**

For each product, collect:

- Free tier / free diagnosis.
- Subscription price.
- Sales-led enterprise package.
- API pricing.
- Limits: brands, prompts, platforms, seats, reports, API.
- Status.

- [ ] **Step 4: Research model transparency**

Separate two concepts:

| Product | Monitored AI platforms | Product's own generation / Agent model | Is model selectable? | Status |
|---|---|---|---|---|

Required wording:

- If a product lists monitored platforms, write "监测平台已公开".
- If its own model is not disclosed, write "底层生成 / Agent 模型未公开".
- Do not infer the underlying model from writing style.

- [ ] **Step 5: Save research file**

Create `evidence/company-commercial-research.md` with four sections:

1. Company background matrix.
2. Financing matrix.
3. Pricing matrix.
4. Model transparency matrix.

### Task 4: Agent Capability Deep Dive

**Files:**
- Create: `evidence/agent-breakdown.md`
- Modify: `evidence/claim-ledger.md`

**Interfaces:**
- Consumes: screenshots and source evidence from Tasks 2 and 3.
- Produces: verified Agent analysis inputs for final report.

- [ ] **Step 1: Define the three Agent prototypes**

Use these exact definitions:

| Agent Prototype | Description | Core Value |
|---|---|---|
| 品牌数据分析师 Agent | 读取 GEO 监测数据、AI 回答、引用来源、竞品排名和趋势变化，解释品牌在 AI 搜索中的可见度表现，并给出异常归因和老板可读摘要。 | 把数据变成“发生了什么、为什么”的判断 |
| 品牌策略师 Agent | 基于问题库、关键词、竞品表现、引用源偏好和品牌内容缺口，识别可抢占机会，生成内容策略、信源策略和阶段性优化路线。 | 把诊断变成“应该怎么做”的策略 |
| 内容优化执行 Agent | 将策略拆成具体内容任务，生成官网页面、FAQ、案例、对比页、社媒文案等内容草稿，并提供 GEO 质检、发布建议和复盘任务。 | 把策略变成“能执行、能复盘”的动作 |

- [ ] **Step 2: Apply strict Agent status labels**

Use only these labels:

| Label | Meaning |
|---|---|
| 明确 Agent | Has clear Agent / assistant / copilot / workflow entry plus context and tool/task execution evidence |
| Agent-like 工作流 | Has multi-step automated workflow, but no verified Agent entry or task state |
| 相关功能模块 | Has analysis, generation, report, or quality-check functions, but not a workflow Agent |
| 未公开 / 待验证 | Available evidence is insufficient |
| 未在已查资料中发现 | No evidence found in checked sources |

- [ ] **Step 3: Build 12-layer Agent anatomy table**

For each deep-dive product and each Agent prototype, analyze:

1. Agent positioning.
2. Trigger entry.
3. Input data.
4. Context memory.
5. Tool calling.
6. Reasoning path.
7. Output.
8. Editability.
9. Collaboration.
10. Automation.
11. Evidence chain.
12. Closed-loop metric.

- [ ] **Step 4: Prevent Agent hallucination**

For every product where no Agent entry is visible, write:

`公开资料可验证其具备相关功能或工作流线索，但尚不能证明其具备独立 Agent。`

- [ ] **Step 5: Save Agent breakdown**

Create `evidence/agent-breakdown.md` with:

- Agent prototype definitions.
- Agent status label table.
- Horizontal product matrix.
- 12-layer anatomy tables.
- Evidence and caveats.

### Task 5: Draft Final Feishu Report XML

**Files:**
- Create: `drafts/alpharank-geo-competitive-analysis.xml`
- Modify: `evidence/claim-ledger.md`

**Interfaces:**
- Consumes: evidence files from Tasks 1-4.
- Produces: Feishu-compatible XML report body.

- [ ] **Step 1: Create `drafts` directory**

Run:

```bash
mkdir -p drafts
```

- [ ] **Step 2: Draft the report title and summary**

Use:

```xml
<title>AlphaRank AIGC/GEO 内容优化 Agent 竞品分析</title>
<h1>一、结论摘要</h1>
```

The summary must include:

- AlphaRank positioning.
- Main competitive gap.
- Best references by module.
- Agent conclusion.
- Key caveats.

- [ ] **Step 3: Draft all report sections**

Create sections matching the approved architecture:

1. 结论摘要.
2. 分析目标与范围.
3. 竞品选择理由与分层.
4. 赛道判断.
5. 用户与购买决策链路.
6. 公司与商业背景横向表.
7. 获客入口与转化路径对比.
8. 操作逻辑图 / 用户链路图.
9. 核心功能矩阵.
10. 指标体系与数据可信度对比.
11. 关键页面截图证据.
12. 优劣势与可借鉴矩阵.
13. 定价与商业模式拆解.
14. Agent 能力细拆.
15. Agent 成熟度评估.
16. AlphaRank 差距、机会与风险.
17. AlphaRank 下一阶段产品优先级.
18. 附录.

- [ ] **Step 4: Use horizontal competitor tables**

For every multi-product section, use columns:

`维度 | AlphaRank | AIDSO | ImpetaAI | Profound | 最佳参考 | AlphaRank 建议`

Use `Writesonic / Otterly.AI / 透镜 GEO / 搜极星` only in light-scan or appendices unless directly relevant.

- [ ] **Step 5: Add evidence status in wording**

Use one of:

- 已验证.
- 部分验证.
- 未公开.
- 待验证.
- 未在已查资料中发现.

### Task 6: Write to Feishu and Verify Output

**Files:**
- Modify target Feishu document: `https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e`
- Create: `evidence/final-verification.md`

**Interfaces:**
- Consumes: `drafts/alpharank-geo-competitive-analysis.xml`.
- Produces: final Feishu report and verification record.

- [ ] **Step 1: Fetch current Feishu document**

Run:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 lark-cli docs +fetch --doc "https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e" --format json
```

Expected: existing title is `竞品分析` or previous work is intentionally replaceable.

- [ ] **Step 2: Overwrite document with final XML**

Run:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 lark-cli docs +update --doc "https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e" --command overwrite --content "$(cat drafts/alpharank-geo-competitive-analysis.xml)"
```

Expected: update returns success.

- [ ] **Step 3: Fetch outline after write**

Run:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 lark-cli docs +fetch --doc "https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e" --scope outline --max-depth 3 --format json
```

Expected: outline includes all 18 report sections.

- [ ] **Step 4: Create final verification record**

Create `evidence/final-verification.md` with:

- Feishu document URL.
- Revision ID after write.
- Section checklist.
- Evidence checklist.
- Known limitations.
- Items requiring future login or sales-call verification.

- [ ] **Step 5: Commit artifacts**

Run:

```bash
git add AIGC竞品分析/docs/superpowers/plans/2026-07-07-alpharank-geo-competitive-analysis.md AIGC竞品分析/evidence AIGC竞品分析/drafts
git commit -m "docs: produce alpharank geo competitive analysis report"
```

Expected: commit succeeds with only report artifacts.
