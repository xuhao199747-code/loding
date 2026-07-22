# AlphaRank PM Interview Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the existing AlphaRank / GEO Feishu document into an evidence-backed AI product manager guide that supports interview answers and day-to-day product work without presenting unverified assumptions as AlphaRank facts.

**Architecture:** Build a local evidence matrix from the 119 Figma images, use it to write product-manager work modules and interview answers, create eight independently editable Mermaid diagrams, then insert the expansion into the existing Feishu document through precise block updates. Every topic separates `材料明确`, `材料未说明`, `面试/工作模板`, and `产品验收`.

**Tech Stack:** Local Markdown and JSON evidence files, Mermaid, Feishu Docx XML, `lark-cli docs`, `lark-cli whiteboard`, Python standard-library verification, Git.

## Global Constraints

- AlphaRank facts must be traceable to one or more Figma image numbers.
- Unknown target users, commercial model, MVP scope, online status, access protocol, and target values remain explicitly unknown.
- Industry practices appear only under `面试/工作模板` or `如果由我设计`; they are never written as AlphaRank facts.
- No Figma source image is inserted into Feishu.
- All new diagrams are editable Feishu whiteboards and use newly organized information rather than copied layouts.
- The existing 119-row appendix and six editable whiteboards remain intact.
- Each core topic must answer: what a PM decides, what the PRD specifies, what reviewers ask, and what metrics verify.

---

### Task 1: Build the Evidence and Unknowns Matrix

**Files:**
- Read: `evidence/figma/analysis.json`
- Read: `evidence/figma/manifest.json`
- Read: `reports/image-analysis.md`
- Create: `reports/alpharank-pm-evidence-matrix.md`

**Interfaces:**
- Consumes: 119 image records containing image index, Figma node ID, type, topic, PM takeaway, section, and redraw status.
- Produces: Eight topic groups with four fields per claim: `材料明确`, `图号`, `材料未说明`, and `状态标签`.

- [ ] **Step 1: Create the matrix headings and allowed labels**

Create `reports/alpharank-pm-evidence-matrix.md` with these exact topic headings:

```markdown
# AlphaRank 产品经理证据矩阵

允许的状态标签：已明确、建设中、规划/todo、候选技术方案、状态未知。

## 1. 产品定义与 GEO 工作流
## 2. Prompt 来源与 PromptBuilder
## 3. AI Answer、Citation 与 Dataset Builder
## 4. Knowledge Layer、LightRAG 与数据隔离
## 5. Recall、索引与双路 Grounding
## 6. Agent Runtime、Direct Tool 与 AgentLoop
## 7. Diagnosis、LLM-as-Judge 与引用推断
## 8. Content Generation、Experiment 与反馈
```

- [ ] **Step 2: Populate only material-backed claims**

For each topic, add a table using this schema:

```markdown
| 材料明确 | 图号 | 状态标签 | 材料未说明 |
|---|---|---|---|
| PromptBuilder 负责热词发现、Prompt 构建和需求扩展 | 9 | 建设中 | Prompt 的人工、外部数据和模型生成占比 |
```

At minimum, include every architecture, sequence, data-source, API, dataset, storage, retrieval, evaluation, and brand-scoring image from the 119-row index.

- [ ] **Step 3: Verify evidence coverage**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
text = Path('reports/alpharank-pm-evidence-matrix.md').read_text()
for heading in [
    '产品定义与 GEO 工作流', 'Prompt 来源与 PromptBuilder',
    'AI Answer、Citation 与 Dataset Builder',
    'Knowledge Layer、LightRAG 与数据隔离',
    'Recall、索引与双路 Grounding',
    'Agent Runtime、Direct Tool 与 AgentLoop',
    'Diagnosis、LLM-as-Judge 与引用推断',
    'Content Generation、Experiment 与反馈',
]:
    assert heading in text, heading
for label in ['已明确', '建设中', '规划/todo', '候选技术方案', '状态未知']:
    assert label in text, label
print('evidence-matrix-ok')
PY
```

Expected: `evidence-matrix-ok`.

- [ ] **Step 4: Commit the evidence matrix**

```bash
git add reports/alpharank-pm-evidence-matrix.md
git commit -m "docs: add alpharank product evidence matrix"
```

### Task 2: Write the Product-Manager Work Guide

**Files:**
- Read: `reports/alpharank-pm-evidence-matrix.md`
- Modify: `reports/alpharank-geo-ai-pm-guide.md`
- Create: `reports/alpharank-pm-interview-question-bank.md`
- Create: `reports/alpharank-prompt-design-playbook.md`

**Interfaces:**
- Consumes: Material-backed claims and explicit unknowns from Task 1.
- Produces: Eight PM work modules, a question bank, and a Prompt design playbook; every module contains seven labeled blocks.

- [ ] **Step 1: Add the seven-block structure to every core topic**

For each of the eight topics, write these exact labels in this order:

```markdown
### 产品经理为什么需要关心
### 两分钟面试回答
### 材料明确
### 材料未说明
### 面试/工作模板：产品决策与 PRD
### 面试/工作模板：指标、异常与验收
### 技术评审问题
```

The `材料明确` section includes image numbers. The two template sections use conditional language and contain no AlphaRank status claims.

- [ ] **Step 2: Add PM deliverables, not only technical explanations**

Each topic must contain:

```text
产品决策：范围、策略、成本/质量/延迟取舍
PRD：输入、处理、输出、状态、权限、异常
指标：数据健康、模型质量、用户行为、业务结果、系统性能
评审：向算法、后端、数据、安全团队提出的问题
```

Do not invent target metric values. If the image does not define a baseline or threshold, write `材料未提供目标值，需要通过基线样本和业务目标校准`.

- [ ] **Step 3: Write the interview question bank**

Create `reports/alpharank-pm-interview-question-bank.md` with at least these questions:

```markdown
1. AlphaRank 的 Prompt 从哪里来？
2. API 输入了什么，PromptBuilder 生成了什么？
3. AI Answer 和 Citation 怎样采集？
4. Dataset Builder 为什么要按五个维度筛选？
5. 为什么同时需要向量、图和 KV 存储？
6. local/global/hybrid/mix/community 查询模式如何选择？
7. Direct Tool、AgentLoop 和 Raw LLM 为什么要分路？
8. LLM-as-Judge 如何避免评分漂移？
9. 引用推断如何表达证据和置信度？
10. 如何验证一次内容优化真的有效？
11. AlphaRank 材料展示了哪些类型的 Prompt？
12. 你会怎样设计 Prompt，什么是好 Prompt、什么是坏 Prompt？
```

Every answer follows: `材料事实 → 材料未知 → 如果由我设计 → 验收方法`.

- [ ] **Step 4: Write the Prompt design playbook**

Create `reports/alpharank-prompt-design-playbook.md` and separate four Prompt products:

```text
Discovery Prompt：用于构建 Prompt Set 并采集 AI Search/Answer
Agent Instruction Prompt：用于路由、工具调用和任务执行
Generation Prompt：用于 Planner、Generator、Integrator 和多模态生成
Judge Prompt：用于 Rubric 评分、证据输出和引用推断
```

For each type, include:

```text
材料明确：referenced image numbers and confirmed flow
材料未说明：missing full prompt text, versions, default parameters, or online status
面试/工作模板：goal, input, evidence policy, task, constraints, output schema, failure behavior
好 Prompt：measurable, source-bounded, unambiguous, schema-valid, traceable, testable
坏 Prompt：vague goal, mixed evidence roles, conflicting instructions, no schema, no failure path, untestable adjectives
验收：golden set, schema pass rate, factual support, citation traceability, consistency, latency, and cost
```

Add one complete candidate Prompt for a GEO content-diagnosis task. Label it exactly `面试/工作模板（非 AlphaRank 原始 Prompt）`. The template must separate `REFERENCE` examples from `KNOWLEDGE_FILE` facts as shown in image 80 and must require evidence IDs in the output.

- [ ] **Step 5: Verify guide structure and forbidden ambiguity**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
guide = Path('reports/alpharank-geo-ai-pm-guide.md').read_text()
required = [
    '产品经理为什么需要关心', '两分钟面试回答', '材料明确',
    '材料未说明', '面试/工作模板：产品决策与 PRD',
    '面试/工作模板：指标、异常与验收', '技术评审问题'
]
for label in required:
    assert guide.count(label) >= 8, (label, guide.count(label))
for phrase in ['大概率已经', '应该已经接入', '可以确定使用官方 API']:
    assert phrase not in guide, phrase
bank = Path('reports/alpharank-pm-interview-question-bank.md').read_text()
assert bank.count('材料事实') >= 12
assert bank.count('材料未知') >= 12
playbook = Path('reports/alpharank-prompt-design-playbook.md').read_text()
for prompt_type in ['Discovery Prompt', 'Agent Instruction Prompt', 'Generation Prompt', 'Judge Prompt']:
    assert prompt_type in playbook, prompt_type
for label in ['材料明确', '材料未说明', '面试/工作模板（非 AlphaRank 原始 Prompt）', '好 Prompt', '坏 Prompt', '验收']:
    assert label in playbook, label
print('pm-guide-ok')
PY
```

Expected: `pm-guide-ok`.

- [ ] **Step 6: Commit the PM guide, question bank, and Prompt playbook**

```bash
git add reports/alpharank-geo-ai-pm-guide.md reports/alpharank-pm-interview-question-bank.md \
  reports/alpharank-prompt-design-playbook.md
git commit -m "docs: expand alpharank guide for product managers"
```

### Task 3: Create Eight Editable Diagram Sources

**Files:**
- Create: `diagrams/07-prompt-source-and-set.mmd`
- Create: `diagrams/08-answer-citation-collection.mmd`
- Create: `diagrams/09-dataset-builder.mmd`
- Create: `diagrams/10-lightrag-write-query.mmd`
- Create: `diagrams/11-recall-mode-grounding.mmd`
- Create: `diagrams/12-promptbuilder-direct-tool-sequence.mmd`
- Create: `diagrams/13-runtime-path-comparison.mmd`
- Create: `diagrams/14-judge-inference-calibration.mmd`
- Modify: `diagrams/diagram-specs.md`

**Interfaces:**
- Consumes: Confirmed flows and explicit unknown boundaries from Tasks 1–2.
- Produces: Eight Mermaid sources that Feishu can import as editable whiteboards.

- [ ] **Step 1: Write diagrams 07–10**

Use these scopes:

```text
07: four Prompt product types + API input fields + material-backed search sources → PromptBuilder → Prompt Set → Crawler
08: Prompt Set → AI Search/Answer → AnswerAnalyze → cited/not-cited pages → insight assets
09: raw acquisition → five-dimensional filtering → webpage cleaning → dataset version
10: sources → chunk/embedding/KG extract/KG merge → graph/vector/KV/community → QueryAPI
```

Every unsupported implementation choice appears in a subgraph titled `面试候选方案（非 AlphaRank 事实）` or is omitted.

- [ ] **Step 2: Write diagrams 11–14**

Use these scopes:

```text
11: retrieval mode selection + FULL/CHUNK + reference-vs-fact grounding
12: Client → ResponsesHandler → ToolRegistry → promptbuilder_process → SessionManager
13: Direct Tool vs Remote Agent vs Local AgentLoop vs Raw LLM
14: deterministic statistics + LLM-as-Judge + evidence + aggregation + human calibration
```

- [ ] **Step 3: Validate Mermaid source files**

Run each file through the Feishu whiteboard validation command available in the installed `lark-cli` whiteboard workflow. Expected result for all eight files: zero syntax errors and zero warnings. Record the exact command and outputs in `reports/final-verification.md`.

- [ ] **Step 4: Update the diagram catalog**

Append each diagram's purpose, confirmed image numbers, unknowns, and Feishu insertion section to `diagrams/diagram-specs.md`.

- [ ] **Step 5: Commit diagram sources**

```bash
git add diagrams/07-prompt-source-and-set.mmd diagrams/08-answer-citation-collection.mmd \
  diagrams/09-dataset-builder.mmd diagrams/10-lightrag-write-query.mmd \
  diagrams/11-recall-mode-grounding.mmd diagrams/12-promptbuilder-direct-tool-sequence.mmd \
  diagrams/13-runtime-path-comparison.mmd diagrams/14-judge-inference-calibration.mmd \
  diagrams/diagram-specs.md
git commit -m "docs: add editable alpharank interview diagrams"
```

### Task 4: Prepare Feishu XML Expansion Sections

**Files:**
- Create: `deliverables/feishu-expansion-01-product.xml`
- Create: `deliverables/feishu-expansion-02-prompt-data.xml`
- Create: `deliverables/feishu-expansion-03-knowledge-recall.xml`
- Create: `deliverables/feishu-expansion-04-agent-evaluation.xml`
- Create: `deliverables/feishu-expansion-05-interview-checklists.xml`

**Interfaces:**
- Consumes: PM guide, interview question bank, evidence matrix, and Mermaid files.
- Produces: Five valid Feishu XML fragments with stable section boundaries.

- [ ] **Step 1: Write the new chapter structure**

Use this exact top-level chapter and subsections:

```xml
<h1>九、AI 产品经理实战与面试深挖</h1>
<h2>9.1 如何阅读：事实、未知与候选方案</h2>
<h2>9.2 产品定义、场景与功能边界</h2>
<h2>9.3 Prompt 来源、设计、API 输入与数据集</h2>
<h2>9.4 AI Answer、Citation 与页面采集</h2>
<h2>9.5 Knowledge Layer、LightRAG 与数据隔离</h2>
<h2>9.6 Recall、索引与内容 Grounding</h2>
<h2>9.7 Agent Runtime 与接口调用</h2>
<h2>9.8 诊断、LLM-as-Judge 与引用推断</h2>
<h2>9.9 内容生成、实验与归因</h2>
<h2>9.10 PRD、技术评审与面试检查表</h2>
```

- [ ] **Step 2: Insert the eight Mermaid blocks in relevant fragments**

Use:

```xml
<whiteboard type="mermaid">
flowchart TB
A["材料明确"] --> B["产品决策"]
B --> C["产品验收"]
</whiteboard>
```

Keep every diagram in the same subsection as its explanatory evidence and PM decisions.

- [ ] **Step 3: Validate XML fragments locally**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
from xml.etree import ElementTree as ET
files = sorted(Path('deliverables').glob('feishu-expansion-*.xml'))
assert len(files) == 5, len(files)
combined = ''
for path in files:
    text = path.read_text()
    ET.fromstring('<root>' + text + '</root>')
    combined += text
assert combined.count('<whiteboard type="mermaid">') == 8
for label in ['材料明确', '材料未说明', '面试/工作模板', '产品验收']:
    assert label in combined, label
assert '<img' not in combined
print('feishu-expansion-xml-ok')
PY
```

Expected: `feishu-expansion-xml-ok`.

- [ ] **Step 4: Commit Feishu XML fragments**

```bash
git add deliverables/feishu-expansion-*.xml
git commit -m "docs: prepare feishu product manager expansion"
```

### Task 5: Insert the Expansion into Feishu

**Files:**
- Read: `deliverables/feishu-expansion-01-product.xml`
- Read: `deliverables/feishu-expansion-02-prompt-data.xml`
- Read: `deliverables/feishu-expansion-03-knowledge-recall.xml`
- Read: `deliverables/feishu-expansion-04-agent-evaluation.xml`
- Read: `deliverables/feishu-expansion-05-interview-checklists.xml`
- Modify remotely: Feishu document `XQdOdqvtcoq5bgx6bOxclhYonra`

**Interfaces:**
- Consumes: Five verified XML fragments.
- Produces: A new chapter inserted after section eight, with the former image-coverage chapter renumbered to section ten.

- [ ] **Step 1: Fetch the latest outline and section-eight block IDs**

Run:

```bash
lark-cli docs +fetch --doc XQdOdqvtcoq5bgx6bOxclhYonra --scope outline --max-depth 3 --detail with-ids
lark-cli docs +fetch --doc XQdOdqvtcoq5bgx6bOxclhYonra --scope section --start-block-id doxcnS4mSI0NQrtHkRzPbLhEkAg --detail with-ids
```

Expected: latest revision, section-eight content, and the final block ID before `九、图片覆盖说明`. If the latest outline reports a different section-eight heading ID, use that returned ID in the section fetch instead of the recorded revision-17 ID.

- [ ] **Step 2: Insert fragments sequentially**

Insert `feishu-expansion-01-product.xml` after the final block of section eight. Re-fetch the new chapter after every insertion and use its current final block as the next anchor. Continue through fragment 05. Do not reuse a stale ID after a replacement or deletion.

- [ ] **Step 3: Renumber the old coverage heading**

Run a precise XML `str_replace`:

```bash
lark-cli docs +update --doc XQdOdqvtcoq5bgx6bOxclhYonra \
  --command str_replace \
  --pattern '九、图片覆盖说明' \
  --content '十、图片覆盖说明'
```

Expected: one updated heading and no other content changes.

- [ ] **Step 4: Fetch the inserted chapter with IDs**

Run:

```bash
lark-cli docs +fetch --doc XQdOdqvtcoq5bgx6bOxclhYonra \
  --scope keyword --keyword 'AI 产品经理实战与面试深挖' \
  --context-after 1 --detail with-ids
```

Expected: chapter-nine heading and inserted content are present.

### Task 6: Verify Feishu Content and Editable Whiteboards

**Files:**
- Modify: `reports/final-verification.md`
- Read remotely: Feishu document and all new whiteboard tokens.

**Interfaces:**
- Consumes: Updated Feishu document.
- Produces: A verification report proving content structure, fact labeling, absence of original images, and editable diagram status.

- [ ] **Step 1: Fetch the latest document**

Run:

```bash
lark-cli docs +fetch --doc XQdOdqvtcoq5bgx6bOxclhYonra --detail full
```

Record the revision ID, chapter-nine headings, whiteboard tokens, image count, table count, and appendix row count.

- [ ] **Step 2: Verify the new content constraints**

Confirm:

```text
chapter 9 contains sections 9.1 through 9.10
all eight PM topics contain material facts and explicit unknowns
template content is labeled 面试/工作模板
no new <img> blocks exist
the original 119 appendix rows remain
the original six whiteboards remain
eight new whiteboards exist
```

- [ ] **Step 3: Query every new whiteboard**

For each of the eight new tokens, run `lark-cli whiteboard +query` and verify `syntax_type: mermaid`. Export a preview image and visually inspect that labels, arrows, and candidate-solution boundaries are readable.

- [ ] **Step 4: Run the final evidence audit**

Check every sentence under `材料明确` against the referenced image. Move any unsupported detail to `材料未说明` or `面试/工作模板`; never silently reword it into a fact.

- [ ] **Step 5: Update and commit the verification report**

Append the final revision ID, whiteboard tokens, section checks, evidence-audit result, and zero-original-image result to `reports/final-verification.md`, then run:

```bash
git add reports/final-verification.md
git commit -m "docs: verify alpharank product manager expansion"
```
