# Reference-Topology Agent Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Rebuild the single-screen dark Agent flow so its hierarchy, node inventory, relative layout, and connections closely match the supplied reference diagram.

**Architecture:** Keep the existing execution reducer and manual controls, but replace the presentation graph with a larger reference-faithful topology. Separate executable nodes from explanatory subnodes/groups; both render in the same fixed SVG, while execution state projects onto the relevant detailed paths.

**Tech Stack:** Vanilla JavaScript ES modules, SVG, CSS Grid, Vitest/JSDOM, Vite single-file build.

## Global Constraints

- Dark theme and bilingual labels remain.
- Entire diagram, step rail, and controls fit without page scrolling at 1366×768, 1440×900, and 1920×1080.
- Layout mirrors the reference: User Task top, Final Response left, Agent System outer boundary, Core center-left, RAG upper-right, Tools bottom, Action and Observation right, Guardrails full-width bottom.
- Planning, Memory, RAG, and Tools show their internal explanatory nodes directly in the overview.
- All reference relationships remain visible, including feedback/callback routes.
- Current path has arrow and moving pulse; inactive paths stay legible.
- `dist/index.html` remains a standalone offline artifact.

---

### Task 1: Define and test the reference topology

**Files:**
- Modify: `src/data/demo-graph.js`
- Modify: `tests/foundation.test.js`
- Create: `tests/reference-topology.test.js`

**Interfaces:**
- Extend `demoGraph` with `systemBoundary`, `groups`, and `detailNodes` presentation collections.
- Keep executable `nodes`, `edges`, `events`, `scenarios`, and guardrails consumable by the existing reducer.

- [ ] Write failing tests that assert exact inventory and labels for User Task, Final Response, Core, Planning details, Memory details, RAG Query/Route/three retrieval chains/TOP K/Merge/Rerank/TOP N/Context, Tools descriptions, Action, Observation, and Guardrails.
- [ ] Assert reference relationships: User Task→Orchestrator→LLM; LLM→Final; LLM↔Planning/Memory; LLM→Query→Route; Route fan-out and branch fan-in; Context→LLM; LLM→Tools→Action→Observation; Observation→LLM/Planning; Memory→Action.
- [ ] Implement the minimal graph data to pass without changing UI rendering.
- [ ] Run focused tests RED then GREEN and full suite.
- [ ] Commit.

---

### Task 2: Render the reference hierarchy in the fixed SVG

**Files:**
- Modify: `src/ui/GraphView.js`
- Modify: `src/ui/traceEdges.js`
- Modify: `src/styles.css`
- Modify: `tests/ui/graph-view.test.js`
- Create: `tests/ui/reference-layout.test.js`

**Interfaces:**
- `renderGraph` renders layers in this order: system boundary → module/group panels → all edges → executable/detail nodes → guardrails → live pulses.
- Detail nodes are noninteractive informative SVG groups with explicit bilingual labels.

- [x] Write failing rendering tests for all groups/detail nodes and their nesting classes.
- [x] Write failing tests for reference-relative positions and all relationship paths.
- [x] Render the outer Agent System boundary and reference module/group panels.
- [x] Render Planning/Memory/RAG/Tools details and map branch state to the detailed RAG chains.
- [x] Route feedback edges with orthogonal/curved paths that avoid primary nodes; retain arrows and pulses.
- [x] Adjust SVG viewBox and typography so all content is legible in the fixed stage.
- [x] Run focused tests RED/GREEN and full suite.
- [x] Commit.

---

### Task 3: Align interaction events and deliver the standalone reference version

**Files:**
- Modify: `src/data/demo-graph.js`
- Modify: `src/domain/execution.js` only if event projection requires it.
- Modify: `src/ui/AppView.js`
- Modify: `src/ui/PlaybackControls.js`
- Modify: `tests/domain/execution.test.js`
- Modify: `tests/ui/app-view.test.js`
- Modify: `tests/smoke/single-file.test.js`
- Modify: `dist/index.html`

**Interfaces:**
- Manual Previous/Next/Restart and decision/recovery controls drive the reference-faithful node paths.
- Vector/Data retrieval highlights embedding, vector search, keyword/database search, and their TOP K outputs; Web retrieval highlights web search and TOP K; Run Both highlights all selected paths before merge.
- The LLM dispatches three valid modes: RAG only, Tools only, or RAG + Tools in parallel. In parallel mode, retrieval and tool preparation fan out independently, then Context and Observation fan in to the LLM.
- A small Context Gate blocks Action only when its arguments depend on retrieved context; independent actions proceed without waiting for RAG.

- [x] Add failing tests for the detailed RAG branch projection and reference callback/tool flow.
- [x] Add failing tests for top-level RAG/Tools fan-out, independent lane completion, the conditional Context Gate, and LLM fan-in.
- [x] Align event labels/current-step rail with the reference topology while preserving reducer snapshot behavior.
- [x] Verify decisions, parallel joins, callback, retry, replan, recovery, and focus restoration.
- [x] Build before testing, run Node 24 full check, and audit standalone output.
- [x] Browser-verify no scrolling and full visibility at 1366×768, 1440×900, and 1920×1080.
- [x] Browser-verify representative normal, parallel fan-out, RAG callback/context gate release, Observation callback, and LLM fan-in states.
- [x] Commit rebuilt artifact.
