# Interactive Agent Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, bilingual, single-file HTML prototype that presents a fixed Agent architecture map, zoomable module/node focus, a clickable top-right minimap, and a simulated non-linear execution trace.

**Architecture:** Use vanilla ES modules with a pure domain layer (`architecture`, `execution`, `viewport`), a data-only demo graph, and DOM/SVG renderers that subscribe to a single application store. Vite builds the modular source and `vite-plugin-singlefile` inlines all CSS and JavaScript into `dist/index.html`, which must work when opened directly through `file://`.

**Tech Stack:** Node.js 23.3.0, npm 10.9.1, JavaScript ES2022, SVG, CSS, Vite 8.1.5, Vitest 4.1.10, jsdom 29.1.1, vite-plugin-singlefile 2.3.3.

## Global Constraints

- Deliverable is one directly openable `dist/index.html`; no backend and no runtime network calls.
- Use the exact dark palette from the approved spec: `#050B14`, `#081423`, `#0D1B2D`, `#1E3855`, `#38D1FF`, `#54D6AD`, `#A88BFA`, `#FFBD59`, `#FF6978`.
- Chinese is primary copy; English is smaller, lower-contrast supporting copy.
- The architecture layout remains stable while execution trace, focus, and camera state change.
- Support sequential, decision, parallel, join, callback, retry, replan, and whole-module events.
- Guardrails remain a cross-cutting layer and never appear as a normal sequential step.
- Viewing location and live execution location are independent state values.
- Right-top minimap supports global view, module focus, follow-run, and return-to-live.
- Respect `prefers-reduced-motion`; status must not depend on color alone.
- Show decision summaries and evidence only; never expose hidden chain-of-thought.

---

## File Map

- `package.json` — scripts and pinned development dependencies.
- `vite.config.js` — single-file production build and relative asset base.
- `index.html` — semantic application mount point and document metadata.
- `src/main.js` — application composition, store subscription, and event wiring.
- `src/styles.css` — approved dark theme, responsive layout, animation, and focus states.
- `src/domain/architecture.js` — graph validation and graph query helpers.
- `src/domain/execution.js` — non-linear execution state machine and trace history.
- `src/domain/viewport.js` — global/module/node camera state and viewing/live separation.
- `src/data/demo-graph.js` — five-module bilingual architecture and simulated events.
- `src/ui/AppView.js` — application shell and high-level render orchestration.
- `src/ui/GraphView.js` — stable SVG architecture map, focus layers, and trace overlay.
- `src/ui/MiniMap.js` — clickable right-top overview and viewport indicator.
- `src/ui/Inspector.js` — on-demand current-event and node details.
- `src/ui/PlaybackControls.js` — previous/play/next/restart/speed controls.
- `tests/domain/architecture.test.js` — graph validation and query tests.
- `tests/domain/execution.test.js` — state-machine tests for all relationship types.
- `tests/domain/viewport.test.js` — camera and viewing/live state tests.
- `tests/ui/graph-view.test.js` — SVG rendering and trace-class tests.
- `tests/ui/app-view.test.js` — shell, minimap, inspector, and control interaction tests.
- `tests/smoke/single-file.test.js` — build artifact and offline constraints.

---

### Task 1: Project Foundation and Architecture Graph Contract

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`
- Create: `src/domain/architecture.js`
- Create: `src/data/demo-graph.js`
- Create: `tests/domain/architecture.test.js`

**Interfaces:**
- Produces: `validateArchitecture(graph): { valid: true }`
- Produces: `getModule(graph, moduleId): ModuleDefinition`
- Produces: `getNode(graph, nodeId): NodeDefinition`
- Produces: `getEdgesForNode(graph, nodeId): EdgeDefinition[]`
- Produces: `demoGraph` with `modules`, `nodes`, `edges`, `guardrails`, and `events`.

- [ ] **Step 1: Write the failing architecture contract tests**

```js
// tests/domain/architecture.test.js
import { describe, expect, it } from "vitest";
import {
  getEdgesForNode,
  getModule,
  getNode,
  validateArchitecture,
} from "../../src/domain/architecture.js";
import { demoGraph } from "../../src/data/demo-graph.js";

describe("architecture graph", () => {
  it("accepts the bilingual five-module demo graph", () => {
    expect(validateArchitecture(demoGraph)).toEqual({ valid: true });
    expect(demoGraph.modules).toHaveLength(5);
    expect(demoGraph.guardrails.scope).toBe("global");
  });

  it("rejects dangling edges", () => {
    const broken = structuredClone(demoGraph);
    broken.edges.push({ id: "broken", from: "missing", to: "llm", type: "sequence" });
    expect(() => validateArchitecture(broken)).toThrow("Unknown edge source: missing");
  });

  it("queries modules, nodes, and callback edges", () => {
    expect(getModule(demoGraph, "rag").label.zh).toBe("RAG 检索增强");
    expect(getNode(demoGraph, "rag-context").label.en).toBe("Context Assembly");
    expect(getEdgesForNode(demoGraph, "rag-context").some((edge) => edge.type === "callback")).toBe(true);
  });
});
```

- [ ] **Step 2: Add pinned scripts and run the test to verify failure**

```json
{
  "name": "interactive-agent-flow",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "check": "npm run test && npm run build"
  },
  "devDependencies": {
    "jsdom": "29.1.1",
    "vite": "8.1.5",
    "vite-plugin-singlefile": "2.3.3",
    "vitest": "4.1.10"
  }
}
```

Run: `npm install && npm test -- tests/domain/architecture.test.js`

Expected: FAIL because `src/domain/architecture.js` and `src/data/demo-graph.js` do not exist.

- [ ] **Step 3: Implement graph validation and query helpers**

```js
// src/domain/architecture.js
const EDGE_TYPES = new Set([
  "sequence", "decision", "parallel", "join",
  "callback", "retry", "replan", "module",
]);

export function validateArchitecture(graph) {
  const moduleIds = new Set(graph.modules.map((module) => module.id));
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  if (moduleIds.size !== graph.modules.length) throw new Error("Duplicate module id");
  if (nodeIds.size !== graph.nodes.length) throw new Error("Duplicate node id");
  for (const node of graph.nodes) {
    if (!moduleIds.has(node.moduleId)) throw new Error(`Unknown node module: ${node.moduleId}`);
  }
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) throw new Error(`Unknown edge source: ${edge.from}`);
    if (!nodeIds.has(edge.to)) throw new Error(`Unknown edge target: ${edge.to}`);
    if (!EDGE_TYPES.has(edge.type)) throw new Error(`Unknown edge type: ${edge.type}`);
  }
  if (graph.guardrails.scope !== "global") throw new Error("Guardrails must be global");
  return { valid: true };
}

export function getModule(graph, moduleId) {
  const module = graph.modules.find((item) => item.id === moduleId);
  if (!module) throw new Error(`Unknown module: ${moduleId}`);
  return module;
}

export function getNode(graph, nodeId) {
  const node = graph.nodes.find((item) => item.id === nodeId);
  if (!node) throw new Error(`Unknown node: ${nodeId}`);
  return node;
}

export function getEdgesForNode(graph, nodeId) {
  getNode(graph, nodeId);
  return graph.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}
```

- [ ] **Step 4: Create the complete five-module graph fixture**

```js
// src/data/demo-graph.js
const label = (zh, en) => ({ zh, en });

export const demoGraph = {
  modules: [
    { id: "input", label: label("输入与编排", "Input & Orchestration"), x: 40, y: 210, w: 210, h: 180 },
    { id: "core", label: label("Agent 核心", "Agent Core"), x: 310, y: 90, w: 360, h: 360 },
    { id: "rag", label: label("RAG 检索增强", "RAG Augmentation"), x: 750, y: 70, w: 390, h: 330 },
    { id: "tools", label: label("工具与反馈", "Tools & Feedback"), x: 520, y: 520, w: 440, h: 220 },
    { id: "response", label: label("最终响应", "Final Response"), x: 40, y: 520, w: 230, h: 150 },
  ],
  nodes: [
    { id: "user-task", moduleId: "input", label: label("用户任务", "User Task"), kind: "step", x: 80, y: 270 },
    { id: "orchestrator", moduleId: "core", label: label("智能编排器", "Agent Orchestrator"), kind: "step", x: 425, y: 135 },
    { id: "llm", moduleId: "core", label: label("大语言模型", "LLM"), kind: "step", x: 425, y: 225 },
    { id: "planning", moduleId: "core", label: label("任务规划", "Planning"), kind: "module", x: 345, y: 340, detailSteps: [label("子目标拆解", "Decompose"), label("依赖排序", "Sequence"), label("计划确认", "Validate")] },
    { id: "memory", moduleId: "core", label: label("记忆", "Memory"), kind: "module", x: 515, y: 340, detailSteps: [label("短期记忆", "Short-term"), label("长期检索", "Long-term"), label("上下文写回", "Write Back")] },
    { id: "rag-route", moduleId: "rag", label: label("检索路由", "Retrieval Routing"), kind: "decision", x: 880, y: 115 },
    { id: "vector-search", moduleId: "rag", label: label("向量检索", "Vector Search"), kind: "parallel", x: 790, y: 210 },
    { id: "web-search", moduleId: "rag", label: label("联网搜索", "Web Search"), kind: "parallel", x: 970, y: 210 },
    { id: "rag-merge", moduleId: "rag", label: label("合并与重排序", "Merge & Rerank"), kind: "join", x: 880, y: 295 },
    { id: "rag-context", moduleId: "rag", label: label("上下文组装", "Context Assembly"), kind: "module", x: 880, y: 335, detailSteps: [label("结果去重", "Deduplicate"), label("相关性重排", "Rerank"), label("提示词注入", "Inject Context")] },
    { id: "tool-select", moduleId: "tools", label: label("工具选择", "Tool Selection"), kind: "decision", x: 555, y: 570 },
    { id: "action", moduleId: "tools", label: label("动作执行", "Action"), kind: "module", x: 720, y: 570, detailSteps: [label("参数校验", "Validate Args"), label("隔离执行", "Sandbox Run"), label("结果标准化", "Normalize")] },
    { id: "observation", moduleId: "tools", label: label("观察与评估", "Observation"), kind: "decision", x: 720, y: 660 },
    { id: "final-response", moduleId: "response", label: label("最终响应", "Final Response"), kind: "step", x: 90, y: 575 },
  ],
  edges: [
    { id: "e1", from: "user-task", to: "orchestrator", type: "sequence" },
    { id: "e2", from: "orchestrator", to: "llm", type: "sequence" },
    { id: "e3", from: "llm", to: "planning", type: "module" },
    { id: "e4", from: "planning", to: "llm", type: "callback" },
    { id: "e5", from: "memory", to: "llm", type: "callback" },
    { id: "e6", from: "llm", to: "rag-route", type: "decision" },
    { id: "e7", from: "rag-route", to: "vector-search", type: "parallel", branch: "vector" },
    { id: "e8", from: "rag-route", to: "web-search", type: "parallel", branch: "web" },
    { id: "e9", from: "vector-search", to: "rag-merge", type: "join" },
    { id: "e10", from: "web-search", to: "rag-merge", type: "join" },
    { id: "e11", from: "rag-merge", to: "rag-context", type: "sequence" },
    { id: "e12", from: "rag-context", to: "llm", type: "callback" },
    { id: "e13", from: "llm", to: "tool-select", type: "decision" },
    { id: "e14", from: "tool-select", to: "action", type: "sequence" },
    { id: "e15", from: "action", to: "observation", type: "sequence" },
    { id: "e16", from: "observation", to: "planning", type: "replan" },
    { id: "e17", from: "llm", to: "final-response", type: "sequence" },
    { id: "e18", from: "observation", to: "action", type: "retry" },
    { id: "e19", from: "observation", to: "final-response", type: "decision" },
  ],
  guardrails: { scope: "global", label: label("权限 · 安全 · 评估 · 审计", "Permissions · Safety · Evaluation · Audit") },
  events: [],
};
```

- [ ] **Step 5: Add Vite entry files and verify tests pass**

```js
// vite.config.js
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: { cssCodeSplit: false, assetsInlineLimit: 100_000_000 },
  test: { environment: "jsdom" },
});
```

```html
<!-- index.html -->
<!doctype html>
<html lang="zh-CN">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Agent 动态执行流程</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.js"></script></body>
</html>
```

```js
// src/main.js
import "./styles.css";
document.querySelector("#app").textContent = "Agent Flow";
```

Run: `npm test -- tests/domain/architecture.test.js`

Expected: 3 tests PASS.

- [ ] **Step 6: Commit Task 1**

```bash
git add package.json package-lock.json vite.config.js index.html src tests/domain/architecture.test.js
git commit -m "feat: define agent architecture graph"
```

---

### Task 2: Non-Linear Execution State Machine

**Files:**
- Create: `src/domain/execution.js`
- Modify: `src/data/demo-graph.js`
- Create: `tests/domain/execution.test.js`

**Interfaces:**
- Consumes: `demoGraph.nodes`, `demoGraph.edges`.
- Produces: `createRun(graph): RunState`
- Produces: `transition(run, action): RunState`
- Produces: actions `ADVANCE`, `PREVIOUS`, `CHOOSE_BRANCH`, `COMPLETE_BRANCH`, `RETRY`, `REPLAN`, `CANCEL`, `RESET`.

- [ ] **Step 1: Write failing state-machine tests for sequence, decisions, parallel joins, callbacks, and retries**

```js
// tests/domain/execution.test.js
import { describe, expect, it } from "vitest";
import { createRun, transition } from "../../src/domain/execution.js";
import { demoGraph } from "../../src/data/demo-graph.js";

describe("execution state machine", () => {
  it("blocks a decision until a branch is selected", () => {
    let run = createRun(demoGraph, "rag-route");
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Branch selection required");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    expect(run.activeBranches).toEqual(["vector", "web"]);
  });

  it("waits for both parallel branches before joining", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "vector" });
    expect(run.currentEventId).toBe("rag-retrieval");
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    expect(run.currentEventId).toBe("rag-join");
  });

  it("records callback and replan iterations", () => {
    let run = createRun(demoGraph, "observation-event");
    run = transition(run, { type: "REPLAN", reason: "completion score below threshold" });
    expect(run.iteration).toBe(2);
    expect(run.currentNodeId).toBe("planning");
    expect(run.currentEventId).toBe("planning-event");
    expect(run.trace.at(-1).relation).toBe("replan");
  });

  it("routes observation outcomes to finish, retry, or replan", () => {
    const base = createRun(demoGraph, "observation-event");
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "finish" }).currentEventId).toBe("final-event");
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "retry" })).toMatchObject({ currentEventId: "tool-event", iteration: 2 });
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "replan" })).toMatchObject({ currentEventId: "planning-event", iteration: 2 });
  });

  it("restores the complete previous snapshot instead of only moving the cursor", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "PREVIOUS" });
    expect(run).toMatchObject({ currentEventId: "rag-route", activeBranches: [], completedBranches: [], iteration: 1 });
  });

  it("keeps terminal cancellation immutable", () => {
    let run = createRun(demoGraph);
    run = transition(run, { type: "CANCEL" });
    expect(run.status).toBe("cancelled");
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Run is terminal");
  });
});
```

- [ ] **Step 2: Run the tests to verify failure**

Run: `npm test -- tests/domain/execution.test.js`

Expected: FAIL because `src/domain/execution.js` does not exist.

- [ ] **Step 3: Add explicit event definitions to the demo graph**

```js
// Append inside demoGraph in src/data/demo-graph.js
events: [
  { id: "input-event", nodeId: "user-task", label: label("接收用户任务", "Receive Task"), relation: "sequence", edgeIds: ["e1"], next: "orchestrator-event" },
  { id: "orchestrator-event", nodeId: "orchestrator", label: label("初始化编排", "Initialize Orchestration"), relation: "sequence", edgeIds: ["e2"], next: "planning-event" },
  { id: "planning-event", nodeId: "planning", label: label("生成执行计划", "Build Execution Plan"), relation: "module", edgeIds: ["e3", "e4"], next: "llm-route-event" },
  { id: "llm-route-event", nodeId: "llm", label: label("判断是否需要检索", "Assess Retrieval Need"), relation: "sequence", edgeIds: ["e6"], next: "rag-route" },
  { id: "rag-route", nodeId: "rag-route", label: label("选择检索路径", "Choose Retrieval Route"), relation: "decision", edgeIds: ["e7", "e8"], choices: {
    vector: { label: label("仅向量检索", "Vector Only"), branches: ["vector"], next: "rag-retrieval" },
    web: { label: label("仅联网搜索", "Web Only"), branches: ["web"], next: "rag-retrieval" },
    parallel: { label: label("双路并行", "Run Both"), branches: ["vector", "web"], next: "rag-retrieval" },
  } },
  { id: "rag-retrieval", nodeId: "rag-route", label: label("执行多路检索", "Run Retrieval Branches"), relation: "parallel", edgeIds: ["e7", "e8"], join: "rag-join" },
  { id: "rag-join", nodeId: "rag-merge", label: label("汇合检索结果", "Join Retrieval Results"), relation: "join", edgeIds: ["e9", "e10"], next: "rag-context-event" },
  { id: "rag-context-event", nodeId: "rag-context", label: label("组装增强上下文", "Assemble Context"), relation: "module", edgeIds: ["e11"], next: "rag-callback" },
  { id: "rag-callback", nodeId: "rag-context", label: label("回传增强上下文", "Return Augmented Context"), relation: "callback", edgeIds: ["e12"], targetNodeId: "llm", next: "llm-return-event" },
  { id: "llm-return-event", nodeId: "llm", label: label("继续模型推理", "Resume Inference"), relation: "sequence", edgeIds: ["e13"], next: "tool-select-event" },
  { id: "tool-select-event", nodeId: "tool-select", label: label("选择执行工具", "Select Tool"), relation: "sequence", edgeIds: ["e14"], next: "tool-event" },
  { id: "tool-event", nodeId: "action", label: label("执行工具调用", "Execute Tool Call"), relation: "module", edgeIds: ["e15"], next: "observation-event" },
  { id: "observation-event", nodeId: "observation", label: label("评估执行结果", "Evaluate Result"), relation: "decision", edgeIds: ["e16", "e18", "e19"], choices: {
    finish: { label: label("通过并输出", "Accept & Finish"), next: "final-event", relation: "decision" },
    retry: { label: label("重试工具", "Retry Tool"), next: "tool-event", relation: "retry" },
    replan: { label: label("回到规划", "Replan"), next: "planning-event", relation: "replan" },
  } },
  { id: "final-event", nodeId: "final-response", label: label("生成最终响应", "Generate Final Response"), relation: "sequence", next: null },
],
```

- [ ] **Step 4: Implement the reducer-style execution state machine**

```js
// src/domain/execution.js
const TERMINAL = new Set(["completed", "cancelled", "failed"]);

export function createRun(graph, startEventId = graph.events[0].id) {
  const event = graph.events.find((item) => item.id === startEventId);
  if (!event) throw new Error(`Unknown start event: ${startEventId}`);
  return {
    graph,
    status: "paused",
    currentEventId: event.id,
    currentNodeId: event.nodeId,
    activeBranches: [],
    completedBranches: [],
    iteration: 1,
    trace: [],
    history: [],
  };
}

function snapshot(run) {
  return {
    status: run.status,
    currentEventId: run.currentEventId,
    currentNodeId: run.currentNodeId,
    activeBranches: [...run.activeBranches],
    completedBranches: [...run.completedBranches],
    iteration: run.iteration,
    trace: [...run.trace],
  };
}

function eventFor(run) {
  return run.graph.events.find((event) => event.id === run.currentEventId);
}

function move(run, eventId, relation, detail = {}) {
  const target = run.graph.events.find((event) => event.id === eventId);
  if (!target) throw new Error(`Unknown target event: ${eventId}`);
  return {
    ...run,
    status: "paused",
    currentEventId: target.id,
    currentNodeId: target.nodeId,
    trace: [...run.trace, { from: run.currentEventId, to: target.id, relation, iteration: run.iteration, ...detail }],
    history: [...run.history, snapshot(run)],
  };
}

export function transition(run, action) {
  if (action.type === "PREVIOUS") {
    const previous = run.history.at(-1);
    return previous ? { ...run, ...previous, history: run.history.slice(0, -1) } : run;
  }
  if (action.type === "RESET") return createRun(run.graph);
  if (TERMINAL.has(run.status)) throw new Error("Run is terminal");
  const event = eventFor(run);
  if (action.type === "CANCEL") return { ...run, status: "cancelled" };
  if (action.type === "CHOOSE_BRANCH") {
    const choice = event.choices?.[action.choice];
    if (!choice) throw new Error(`Unknown branch choice: ${action.choice}`);
    const next = move(run, choice.next, choice.relation ?? "decision", { choice: action.choice });
    return {
      ...next,
      activeBranches: choice.branches ?? [],
      completedBranches: [],
      iteration: ["retry", "replan"].includes(choice.relation) ? run.iteration + 1 : run.iteration,
    };
  }
  if (action.type === "COMPLETE_BRANCH") {
    if (!run.activeBranches.includes(action.branch)) throw new Error(`Inactive branch: ${action.branch}`);
    const completedBranches = [...new Set([...run.completedBranches, action.branch])];
    if (completedBranches.length < run.activeBranches.length) return { ...run, completedBranches, history: [...run.history, snapshot(run)] };
    return { ...move(run, event.join, "join"), activeBranches: [], completedBranches };
  }
  if (action.type === "REPLAN") {
    const planningEvent = run.graph.events.find((item) => item.id === "planning-event");
    if (!planningEvent) throw new Error("Planning event is required for replan");
    return {
      ...run,
      currentEventId: planningEvent.id,
      currentNodeId: "planning",
      iteration: run.iteration + 1,
      trace: [...run.trace, { from: event.id, to: planningEvent.id, relation: "replan", reason: action.reason, iteration: run.iteration + 1 }],
      history: [...run.history, snapshot(run)],
    };
  }
  if (action.type === "RETRY") return { ...run, iteration: run.iteration + 1, trace: [...run.trace, { from: event.id, to: event.id, relation: "retry", iteration: run.iteration + 1 }], history: [...run.history, snapshot(run)] };
  if (action.type === "ADVANCE") {
    if (event.relation === "decision") throw new Error("Branch selection required");
    if (!event.next) return { ...run, status: "completed", trace: [...run.trace, { from: event.id, to: null, relation: "complete", iteration: run.iteration }], history: [...run.history, snapshot(run)] };
    return move(run, event.next, event.relation);
  }
  throw new Error(`Unknown action: ${action.type}`);
}
```

- [ ] **Step 5: Run state-machine tests**

Run: `npm test -- tests/domain/execution.test.js`

Expected: 6 tests PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/domain/execution.js src/data/demo-graph.js tests/domain/execution.test.js
git commit -m "feat: model non-linear agent execution"
```

---

### Task 3: Viewport, Focus, and Viewing/Live Separation

**Files:**
- Create: `src/domain/viewport.js`
- Create: `tests/domain/viewport.test.js`

**Interfaces:**
- Produces: `createViewport(liveNodeId?, moduleId?): ViewportState`
- Produces: `reduceViewport(state, action): ViewportState`
- Actions: `FOCUS_MODULE`, `FOCUS_NODE`, `SHOW_OVERVIEW`, `SET_LIVE_NODE`, `RETURN_TO_LIVE`, `TOGGLE_FOLLOW`, `LOCK_VIEW`.

- [ ] **Step 1: Write failing viewport tests**

```js
// tests/domain/viewport.test.js
import { describe, expect, it } from "vitest";
import { createViewport, reduceViewport } from "../../src/domain/viewport.js";

describe("viewport state", () => {
  it("changes viewing focus without moving live execution", () => {
    let state = createViewport("llm", "core");
    state = reduceViewport(state, { type: "FOCUS_MODULE", moduleId: "rag" });
    expect(state.viewing).toEqual({ level: "module", moduleId: "rag", nodeId: null });
    expect(state.liveNodeId).toBe("llm");
    expect(state.isViewingLive).toBe(false);
  });

  it("returns to live and restores follow mode", () => {
    let state = reduceViewport(createViewport("llm", "core"), { type: "FOCUS_NODE", moduleId: "rag", nodeId: "rag-route" });
    state = reduceViewport(state, { type: "RETURN_TO_LIVE", moduleId: "core" });
    expect(state.viewing.nodeId).toBe("llm");
    expect(state.followRun).toBe(true);
  });

  it("does not steal a locked view when live node changes", () => {
    let state = reduceViewport(createViewport("llm", "core"), { type: "LOCK_VIEW" });
    state = reduceViewport(state, { type: "SET_LIVE_NODE", moduleId: "rag", nodeId: "rag-route" });
    expect(state.viewing.nodeId).toBe("llm");
    expect(state.liveNodeId).toBe("rag-route");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/domain/viewport.test.js`

Expected: FAIL because `src/domain/viewport.js` does not exist.

- [ ] **Step 3: Implement viewport reducer**

```js
// src/domain/viewport.js
export function createViewport(liveNodeId = "user-task", moduleId = "input") {
  return {
    viewing: { level: "node", moduleId, nodeId: liveNodeId },
    liveNodeId,
    followRun: true,
    locked: false,
    isViewingLive: true,
  };
}

export function reduceViewport(state, action) {
  if (action.type === "SHOW_OVERVIEW") return { ...state, viewing: { level: "overview", moduleId: null, nodeId: null }, followRun: false, isViewingLive: false };
  if (action.type === "FOCUS_MODULE") return { ...state, viewing: { level: "module", moduleId: action.moduleId, nodeId: null }, followRun: false, isViewingLive: false };
  if (action.type === "FOCUS_NODE") return { ...state, viewing: { level: "node", moduleId: action.moduleId, nodeId: action.nodeId }, followRun: false, isViewingLive: action.nodeId === state.liveNodeId };
  if (action.type === "TOGGLE_FOLLOW") return { ...state, followRun: !state.followRun, locked: state.followRun };
  if (action.type === "LOCK_VIEW") return { ...state, followRun: false, locked: true };
  if (action.type === "SET_LIVE_NODE") {
    const next = { ...state, liveNodeId: action.nodeId };
    if (state.followRun && !state.locked) return { ...next, viewing: { level: "node", moduleId: action.moduleId, nodeId: action.nodeId }, isViewingLive: true };
    return { ...next, isViewingLive: state.viewing.nodeId === action.nodeId };
  }
  if (action.type === "RETURN_TO_LIVE") return { ...state, viewing: { level: "node", moduleId: action.moduleId, nodeId: state.liveNodeId }, followRun: true, locked: false, isViewingLive: true };
  throw new Error(`Unknown viewport action: ${action.type}`);
}
```

- [ ] **Step 4: Run viewport tests**

Run: `npm test -- tests/domain/viewport.test.js`

Expected: 3 tests PASS.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/domain/viewport.js tests/domain/viewport.test.js
git commit -m "feat: separate viewing and live agent state"
```

---

### Task 4: Stable SVG Architecture Renderer

**Files:**
- Create: `src/ui/GraphView.js`
- Create: `tests/ui/graph-view.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `demoGraph`, `RunState`, `ViewportState`.
- Produces: `renderGraph(container, { graph, run, viewport, onNodeSelect }): void`
- DOM contract: `[data-module-id]`, `[data-node-id]`, `[data-edge-id]`, classes `is-live`, `is-complete`, `is-skipped`, `is-callback`, `is-dimmed`.

- [ ] **Step 1: Write failing SVG rendering tests**

```js
// tests/ui/graph-view.test.js
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderGraph } from "../../src/ui/GraphView.js";
import { demoGraph } from "../../src/data/demo-graph.js";
import { createRun, transition } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";

describe("GraphView", () => {
  beforeEach(() => { document.body.innerHTML = '<div id="graph"></div>'; });

  it("keeps all modules mounted while dimming non-focused modules", () => {
    const viewport = { ...createViewport("rag-route", "rag"), viewing: { level: "module", moduleId: "rag", nodeId: null } };
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport, onNodeSelect: vi.fn() });
    expect(document.querySelectorAll("[data-module-id]")).toHaveLength(5);
    expect(document.querySelector('[data-layer="guardrails"]').textContent).toContain("权限");
    expect(document.querySelector('[data-module-id="core"]').classList.contains("is-dimmed")).toBe(true);
    expect(document.querySelector('[data-module-id="rag"]').classList.contains("is-dimmed")).toBe(false);
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).not.toBe("translate(0 0) scale(1)");
  });

  it("marks callback edges and live nodes", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "rag-callback"), viewport: createViewport("rag-context", "rag"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-node-id="rag-context"]').classList.contains("is-live")).toBe(true);
    expect(document.querySelector('[data-edge-id="e12"]').classList.contains("is-callback")).toBe(true);
  });

  it("reveals internal substeps only at node focus", () => {
    const viewport = { ...createViewport("planning", "core"), viewing: { level: "node", moduleId: "core", nodeId: "planning" } };
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "planning-event"), viewport, onNodeSelect: vi.fn() });
    expect(document.querySelectorAll("[data-detail-step]")).toHaveLength(3);
    expect(document.querySelector("[data-detail-step]").textContent).toContain("子目标拆解");
  });

  it("keeps the chosen execution trace while marking unselected branches", () => {
    const run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "web" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("rag-route", "rag"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-edge-id="e7"]').classList.contains("is-skipped")).toBe(true);
    expect(document.querySelector('[data-edge-id="e8"]').classList.contains("is-live")).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/ui/graph-view.test.js`

Expected: FAIL because `src/ui/GraphView.js` does not exist.

- [ ] **Step 3: Implement stable SVG rendering**

```js
// src/ui/GraphView.js
const SVG_NS = "http://www.w3.org/2000/svg";
const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

const nodeCenter = (node) => ({ x: node.x + 65, y: node.y + 29 });

function edgePath(edge, nodes) {
  const from = nodeCenter(nodes.get(edge.from));
  const to = nodeCenter(nodes.get(edge.to));
  if (["callback", "replan", "retry"].includes(edge.type)) {
    const bend = Math.max(54, Math.abs(to.x - from.x) * .28);
    return `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - bend} ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

function cameraFor(graph, viewing) {
  if (viewing.level === "overview") return { x: 0, y: 0, scale: 1 };
  if (viewing.level === "module") {
    const module = graph.modules.find((item) => item.id === viewing.moduleId);
    const scale = Math.min(1040 / module.w, 690 / module.h, 1.65);
    return { x: 540 - (module.x + module.w / 2) * scale, y: 390 - (module.y + module.h / 2) * scale, scale };
  }
  const node = graph.nodes.find((item) => item.id === viewing.nodeId);
  const scale = 1.55;
  return { x: 500 - (node.x + 65) * scale, y: 360 - (node.y + 29) * scale, scale };
}

function renderDetailFlow(root, node) {
  if (!node?.detailSteps?.length) return;
  const panel = svg("g", { class: "detail-flow", "aria-label": `${node.label.zh} 内部步骤` });
  node.detailSteps.forEach((step, index) => {
    const group = svg("g", { "data-detail-step": index + 1, transform: `translate(${720 + index * 145} 650)` });
    group.append(svg("rect", { width: 130, height: 58, rx: 9 }));
    const zh = svg("text", { x: 65, y: 24, "text-anchor": "middle" }); zh.textContent = step.zh;
    const en = svg("text", { x: 65, y: 42, "text-anchor": "middle", class: "node-en" }); en.textContent = step.en;
    group.append(zh, en); panel.append(group);
  });
  root.append(panel);
}

export function renderGraph(container, { graph, run, viewport, onNodeSelect }) {
  const root = svg("svg", { viewBox: "0 0 1200 800", role: "img", "aria-label": "Agent 架构与执行路径" });
  root.classList.add("architecture-graph");
  const focusedModule = viewport.viewing.moduleId;
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const completedEvents = run.trace.map((entry) => graph.events.find((event) => event.id === entry.from)).filter(Boolean);
  const completedEdgeIds = new Set(completedEvents.flatMap((event) => event.edgeIds ?? []));
  const completedNodeIds = new Set(completedEvents.map((event) => event.nodeId));
  const camera = cameraFor(graph, viewport.viewing);
  const scene = svg("g", { "data-layer": "scene", transform: `translate(${camera.x} ${camera.y}) scale(${camera.scale})` });

  for (const module of graph.modules) {
    const group = svg("g", { "data-module-id": module.id, transform: `translate(${module.x} ${module.y})` });
    group.classList.add("graph-module");
    if (focusedModule && focusedModule !== module.id) group.classList.add("is-dimmed");
    group.append(svg("rect", { width: module.w, height: module.h, rx: 18 }));
    const title = svg("text", { x: 16, y: 28 }); title.textContent = module.label.zh; group.append(title);
    scene.append(group);
  }

  for (const edge of graph.edges) {
    const path = svg("path", { d: edgePath(edge, nodes), "data-edge-id": edge.id });
    path.classList.add("graph-edge", `edge-${edge.type}`);
    if (["callback", "replan", "retry"].includes(edge.type)) path.classList.add("is-callback");
    const selectedParallelEdge = currentEvent?.relation !== "parallel" || !edge.branch || run.activeBranches.includes(edge.branch);
    if (currentEvent?.edgeIds?.includes(edge.id) && selectedParallelEdge) path.classList.add("is-live");
    if (completedEdgeIds.has(edge.id)) path.classList.add("is-complete");
    if (currentEvent?.relation === "parallel" && edge.branch && !run.activeBranches.includes(edge.branch)) path.classList.add("is-skipped");
    scene.append(path);
  }

  for (const node of graph.nodes) {
    const group = svg("g", { "data-node-id": node.id, transform: `translate(${node.x} ${node.y})`, tabindex: 0, role: "button", "aria-label": `${node.label.zh} ${node.label.en}` });
    group.classList.add("graph-node", `node-${node.kind}`);
    if (focusedModule && focusedModule !== node.moduleId) group.classList.add("is-dimmed");
    if (node.id === run.currentNodeId) group.classList.add("is-live");
    if (completedNodeIds.has(node.id)) group.classList.add("is-complete");
    const rect = svg("rect", { width: 130, height: 58, rx: 10 });
    const zh = svg("text", { x: 65, y: 25, "text-anchor": "middle" }); zh.textContent = node.label.zh;
    const en = svg("text", { x: 65, y: 42, "text-anchor": "middle", class: "node-en" }); en.textContent = node.label.en;
    group.append(rect, zh, en);
    group.addEventListener("click", () => onNodeSelect(node));
    group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") onNodeSelect(node); });
    scene.append(group);
  }
  root.append(scene);
  renderDetailFlow(root, viewport.viewing.level === "node" ? nodes.get(viewport.viewing.nodeId) : null);
  const guardrails = svg("g", { "data-layer": "guardrails", transform: "translate(30 752)" });
  guardrails.append(svg("rect", { width: 1140, height: 34, rx: 9 }));
  const guardrailLabel = svg("text", { x: 570, y: 22, "text-anchor": "middle" });
  guardrailLabel.textContent = `${graph.guardrails.label.zh} · ${graph.guardrails.label.en}`;
  guardrails.append(guardrailLabel); root.append(guardrails);
  container.replaceChildren(root);
}
```

- [ ] **Step 4: Add initial SVG state styles**

```css
/* src/styles.css */
:root{color-scheme:dark;--bg:#050B14;--canvas:#081423;--panel:#0D1B2D;--line:#1E3855;--live:#38D1FF;--done:#54D6AD;--branch:#A88BFA;--warn:#FFBD59;--error:#FF6978;--text:#E8F2FF;--muted:#7890AD}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"PingFang SC",sans-serif}.architecture-graph{width:100%;height:100%;background:var(--canvas)}[data-layer="scene"]{transition:transform .45s cubic-bezier(.2,.8,.2,1)}.graph-module rect{fill:var(--panel);stroke:var(--line)}.graph-module.is-dimmed,.graph-node.is-dimmed{opacity:.2}.graph-node rect{fill:#10243A;stroke:#315575}.graph-node.is-live rect{stroke:var(--live);filter:drop-shadow(0 0 8px #38D1FF66)}.graph-node.is-complete rect{stroke:var(--done)}.node-en{fill:var(--muted);font-size:10px}.graph-edge{fill:none;stroke:#31516E;stroke-width:2;vector-effect:non-scaling-stroke}.graph-edge.is-live{stroke:var(--live);stroke-width:3}.graph-edge.is-complete{stroke:var(--done)}.graph-edge.is-skipped{opacity:.14}.graph-edge.is-callback{stroke:var(--warn);stroke-dasharray:8 6}.detail-flow rect{fill:#132A42;stroke:var(--branch)}[data-layer="guardrails"] rect{fill:#0B1725;stroke:var(--warn);stroke-dasharray:4 4}[data-layer="guardrails"] text{fill:var(--text);font-size:12px}
```

- [ ] **Step 5: Run graph tests**

Run: `npm test -- tests/ui/graph-view.test.js`

Expected: 4 tests PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add src/ui/GraphView.js src/styles.css tests/ui/graph-view.test.js
git commit -m "feat: render stable agent architecture map"
```

---

### Task 5: Application Shell, Right-Top Minimap, Breadcrumbs, and Inspector

**Files:**
- Create: `src/ui/AppView.js`
- Create: `src/ui/MiniMap.js`
- Create: `src/ui/Inspector.js`
- Create: `tests/ui/app-view.test.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `renderGraph`, `demoGraph`, `RunState`, `ViewportState`.
- Produces: `createAppView(root, handlers): AppView` with `render(state)`.
- Produces: minimap callbacks `onOverview`, `onModuleFocus`, `onToggleFollow`, `onReturnLive`.

- [ ] **Step 1: Write failing shell/minimap tests**

```js
// tests/ui/app-view.test.js
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppView } from "../../src/ui/AppView.js";
import { createRun } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";
import { demoGraph } from "../../src/data/demo-graph.js";

describe("AppView", () => {
  beforeEach(() => { document.body.innerHTML = '<main id="app"></main>'; });

  it("renders breadcrumb and right-top minimap", () => {
    const handlers = { onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn() };
    const view = createAppView(document.querySelector("#app"), handlers);
    view.render({ graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport: { ...createViewport("rag-route", "rag"), viewing: { level: "module", moduleId: "rag", nodeId: null } } });
    expect(document.querySelector("[data-testid=minimap]")).toBeTruthy();
    expect(document.querySelectorAll("[data-minimap-module]")).toHaveLength(5);
    expect(document.querySelector('[data-testid="minimap-viewport"]').getAttribute("x")).toBe("750");
    expect(document.querySelector('[data-testid="minimap-live"]')).toBeTruthy();
    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toContain("RAG 检索增强");
  });

  it("shows return-to-live only when viewing differs from execution", () => {
    const view = createAppView(document.querySelector("#app"), { onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn() });
    const viewport = { ...createViewport("llm", "core"), viewing: { level: "module", moduleId: "rag", nodeId: null }, isViewingLive: false };
    view.render({ graph: demoGraph, run: createRun(demoGraph), viewport });
    expect(document.querySelector("[data-action=return-live]").hidden).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/ui/app-view.test.js`

Expected: FAIL because UI shell modules do not exist.

- [ ] **Step 3: Implement minimap and inspector renderers**

```js
// src/ui/MiniMap.js
const SVG_NS = "http://www.w3.org/2000/svg";
const svg = (tag, attrs) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};

export function renderMiniMap(container, { graph, run, viewport, handlers }) {
  container.innerHTML = `<div class="minimap-head"><span>全局定位 <small>OVERVIEW</small></span><button data-action="overview">全局视图 <small>Overview</small></button></div><div class="minimap-map-host"></div><div class="minimap-actions"><button data-action="follow">${viewport.followRun ? "跟随中 · Following" : "跟随执行 · Follow Run"}</button><button data-action="minimap-return-live" ${viewport.isViewingLive ? "hidden" : ""}>回到当前节点 · Return Live</button></div>`;
  const map = svg("svg", { viewBox: "0 0 1200 800", class: "minimap-map", role: "navigation", "aria-label": "架构小地图 Architecture minimap" });
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const completedEdgeIds = new Set(run.trace.flatMap((entry) => graph.events.find((event) => event.id === entry.from)?.edgeIds ?? []));
  for (const edge of graph.edges) {
    const from = nodes.get(edge.from); const to = nodes.get(edge.to);
    const path = svg("path", { d: `M ${from.x + 65} ${from.y + 29} L ${to.x + 65} ${to.y + 29}`, class: "minimap-edge", "data-edge-type": edge.type });
    if (completedEdgeIds.has(edge.id)) path.classList.add("is-complete");
    if (currentEvent?.edgeIds?.includes(edge.id)) path.classList.add("is-live");
    map.append(path);
  }
  for (const module of graph.modules) {
    const region = svg("g", { "data-minimap-module": module.id, role: "button", tabindex: "0", "aria-label": `${module.label.zh} ${module.label.en}` });
    region.append(svg("rect", { x: module.x, y: module.y, width: module.w, height: module.h, rx: 14 }));
    const title = svg("text", { x: module.x + module.w / 2, y: module.y + module.h / 2, "text-anchor": "middle" }); title.textContent = module.label.zh;
    region.append(title);
    const select = () => handlers.onModuleFocus(module.id);
    region.addEventListener("click", select);
    region.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) select(); });
    map.append(region);
  }
  const viewedModule = graph.modules.find((module) => module.id === viewport.viewing.moduleId);
  const viewedNode = graph.nodes.find((node) => node.id === viewport.viewing.nodeId);
  const box = viewport.viewing.level === "overview" ? { x: 0, y: 0, w: 1200, h: 800 } : viewport.viewing.level === "module" ? viewedModule : { x: viewedNode.x - 80, y: viewedNode.y - 70, w: 290, h: 200 };
  map.append(svg("rect", { "data-testid": "minimap-viewport", class: "minimap-viewport", x: box.x, y: box.y, width: box.w, height: box.h }));
  const liveNode = graph.nodes.find((node) => node.id === run.currentNodeId);
  map.append(svg("circle", { "data-testid": "minimap-live", class: "minimap-live", cx: liveNode.x + 65, cy: liveNode.y + 29, r: 16 }));
  container.querySelector(".minimap-map-host").append(map);
  container.querySelector('[data-action="overview"]').addEventListener("click", handlers.onOverview);
  container.querySelector('[data-action="follow"]').addEventListener("click", handlers.onToggleFollow);
  container.querySelector('[data-action="minimap-return-live"]').addEventListener("click", handlers.onReturnLive);
}
```

```js
// src/ui/Inspector.js
export function renderInspector(container, { node, event, open, onClose = () => {} }) {
  container.hidden = !open;
  if (!open) return;
  container.innerHTML = `<header><h2>${node.label.zh}<small>${node.label.en}</small></h2><button data-action="close-inspector" aria-label="关闭详情 Close details">×</button></header><dl><dt>状态 <small>Status</small></dt><dd>${event?.status ?? "等待 · Waiting"}</dd><dt>输入 <small>Input</small></dt><dd>${event?.input ?? "—"}</dd><dt>输出 <small>Output</small></dt><dd>${event?.output ?? "—"}</dd><dt>决策摘要 <small>Decision Summary</small></dt><dd>${event?.summary ?? "当前节点尚未执行 · Not executed"}</dd></dl>`;
  container.querySelector('[data-action="close-inspector"]').addEventListener("click", onClose);
}
```

- [ ] **Step 4: Implement the application shell**

```js
// src/ui/AppView.js
import { renderGraph } from "./GraphView.js";
import { renderMiniMap } from "./MiniMap.js";
import { renderInspector } from "./Inspector.js";

export function createAppView(root, handlers) {
  root.innerHTML = `<section class="app-shell"><header class="topbar"><div><span class="eyebrow">AGENT EXECUTION MAP</span><h1>Agent 动态执行流程</h1></div><nav data-testid="breadcrumb"></nav></header><div class="canvas-shell"><div class="graph-host"></div><aside class="minimap" data-testid="minimap"></aside><button class="return-live" data-action="return-live">回到当前执行</button></div><aside class="inspector"></aside><footer class="controls-host"></footer></section>`;
  return {
    render(state) {
      const module = state.graph.modules.find((item) => item.id === state.viewport.viewing.moduleId);
      const node = state.graph.nodes.find((item) => item.id === state.viewport.viewing.nodeId);
      root.querySelector('[data-testid="breadcrumb"]').textContent = ["Agent 系统", module?.label.zh, node?.label.zh].filter(Boolean).join(" > ");
      renderGraph(root.querySelector(".graph-host"), { ...state, onNodeSelect: handlers.onNodeSelect });
      renderMiniMap(root.querySelector(".minimap"), { ...state, handlers });
      const returnLive = root.querySelector('[data-action="return-live"]');
      returnLive.hidden = state.viewport.isViewingLive;
      returnLive.onclick = handlers.onReturnLive;
      renderInspector(root.querySelector(".inspector"), { node: node ?? state.graph.nodes.find((item) => item.id === state.run.currentNodeId), event: state.run.trace.at(-1), open: Boolean(node), onClose: handlers.onCloseInspector });
    },
  };
}
```

- [ ] **Step 5: Wire the store in `src/main.js`**

```js
// src/main.js
import "./styles.css";
import { demoGraph } from "./data/demo-graph.js";
import { createRun, transition } from "./domain/execution.js";
import { createViewport, reduceViewport } from "./domain/viewport.js";
import { createAppView } from "./ui/AppView.js";

const state = { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport() };
const moduleForNode = (nodeId) => demoGraph.nodes.find((node) => node.id === nodeId)?.moduleId;
const render = () => view.render(state);
const view = createAppView(document.querySelector("#app"), {
  onNodeSelect(node) { state.viewport = reduceViewport(state.viewport, { type: "FOCUS_NODE", moduleId: node.moduleId, nodeId: node.id }); render(); },
  onCloseInspector() { state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId: state.viewport.viewing.moduleId }); render(); },
  onOverview() { state.viewport = reduceViewport(state.viewport, { type: "SHOW_OVERVIEW" }); render(); },
  onModuleFocus(moduleId) { state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId }); render(); },
  onToggleFollow() { state.viewport = reduceViewport(state.viewport, { type: "TOGGLE_FOLLOW" }); render(); },
  onReturnLive() { state.viewport = reduceViewport(state.viewport, { type: "RETURN_TO_LIVE", moduleId: moduleForNode(state.run.currentNodeId) }); render(); },
});
render();
```

- [ ] **Step 6: Add shell/minimap styles and run tests**

```css
/* Append to src/styles.css */
.app-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}.topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 24px}.eyebrow{font-size:10px;letter-spacing:.18em;color:var(--live)}.canvas-shell{position:relative;min-height:620px;margin:0 20px 16px;border:1px solid var(--line);border-radius:18px;overflow:hidden}.graph-host{width:100%;height:100%}.minimap{position:absolute;right:18px;top:18px;width:250px;padding:12px;border:1px solid var(--line);border-radius:12px;background:#071321E8;backdrop-filter:blur(12px)}.minimap-map{display:block;width:100%;height:150px;margin:9px 0}.minimap-map [data-minimap-module] rect{fill:#0C1B2C;stroke:var(--line);stroke-width:5}.minimap-map text{fill:var(--muted);font-size:26px}.minimap-edge{fill:none;stroke:#29435E;stroke-width:5}.minimap-edge.is-complete{stroke:var(--done)}.minimap-edge.is-live{stroke:var(--live);stroke-width:8}.minimap-edge[data-edge-type="callback"],.minimap-edge[data-edge-type="replan"]{stroke-dasharray:14 10}.minimap-viewport{fill:#38D1FF12;stroke:var(--live);stroke-width:8;vector-effect:non-scaling-stroke}.minimap-live{fill:var(--done);stroke:#D9FFF2;stroke-width:5}.minimap button{border:1px solid var(--line);background:#0C1B2C;color:var(--muted);border-radius:7px;padding:7px}.return-live{position:absolute;right:18px;top:226px}.inspector{position:absolute;right:18px;bottom:90px;width:300px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px}.inspector h2 small{display:block;color:var(--muted);font-size:12px;font-weight:400}
```

Run: `npm test -- tests/ui/app-view.test.js`

Expected: 2 tests PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add src/main.js src/styles.css src/ui/AppView.js src/ui/MiniMap.js src/ui/Inspector.js tests/ui/app-view.test.js
git commit -m "feat: add minimap and focus navigation"
```

---

### Task 6: Playback Controls, Decisions, Parallel Progress, and Feedback Loops

**Files:**
- Create: `src/ui/PlaybackControls.js`
- Modify: `src/ui/AppView.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `tests/ui/app-view.test.js`

**Interfaces:**
- Produces: `renderPlaybackControls(container, model, handlers): void`
- Handlers: `onPrevious`, `onPlayPause`, `onPrimaryAction`, `onRestart`, `onSpeedChange`, `onBranchChoice`.

- [ ] **Step 1: Add failing playback and decision tests**

```js
// Append to tests/ui/app-view.test.js
it("replaces next with branch choices at a decision", () => {
  const onBranchChoice = vi.fn();
  const view = createAppView(document.querySelector("#app"), { onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn(), onBranchChoice, onPrimaryAction: vi.fn(), onPrevious: vi.fn(), onPlayPause: vi.fn(), onRestart: vi.fn(), onSpeedChange: vi.fn() });
  view.render({ graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport: createViewport("rag-route", "rag") });
  expect(document.querySelectorAll("[data-branch-choice]")).toHaveLength(3);
  expect(document.querySelector('[data-action="primary"]')).toBeDisabled();
});

it("shows branch completion counts for parallel work", () => {
  const run = { ...createRun(demoGraph, "rag-retrieval"), activeBranches: ["vector", "web"], completedBranches: ["vector"] };
  const view = createAppView(document.querySelector("#app"), { onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn() });
  view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });
  expect(document.querySelector("[data-testid=branch-progress]").textContent).toContain("1 / 2");
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/ui/app-view.test.js`

Expected: FAIL because playback controls and decision options are missing.

- [ ] **Step 3: Implement adaptive playback controls**

```js
// src/ui/PlaybackControls.js
export function renderPlaybackControls(container, model, handlers) {
  const { run, event } = model;
  const needsChoice = event.relation === "decision" && run.activeBranches.length === 0;
  const primaryLabel = event.relation === "parallel" ? "完成下一分支 · Complete Branch" : event.relation === "callback" ? "执行回传 · Callback" : "下一事件 · Next Event";
  container.innerHTML = `<div class="playback"><button data-action="previous">← 上一步 <small>Previous</small></button><button data-action="play">${run.status === "running" ? "暂停 · Pause" : "播放 · Play"}</button><div class="decision-options"></div><button data-action="primary" ${needsChoice ? "disabled" : ""}>${primaryLabel}</button><button data-action="restart">重新开始 · Restart</button><select data-action="speed" aria-label="播放速度 Playback speed"><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><span data-testid="branch-progress" aria-label="并行分支进度 Parallel branch progress">${run.completedBranches.length} / ${run.activeBranches.length || 0}</span></div>`;
  const options = container.querySelector(".decision-options");
  for (const [choiceId, choice] of Object.entries(event.choices ?? {})) {
    const button = document.createElement("button"); button.dataset.branchChoice = choiceId; button.innerHTML = `${choice.label.zh}<small>${choice.label.en}</small>`; button.onclick = () => handlers.onBranchChoice(choiceId); options.append(button);
  }
  container.querySelector('[data-action="previous"]').onclick = handlers.onPrevious;
  container.querySelector('[data-action="play"]').onclick = handlers.onPlayPause;
  container.querySelector('[data-action="primary"]').onclick = handlers.onPrimaryAction;
  container.querySelector('[data-action="restart"]').onclick = handlers.onRestart;
  container.querySelector('[data-action="speed"]').onchange = (event) => handlers.onSpeedChange(Number(event.target.value));
}
```

- [ ] **Step 4: Mount controls in `AppView` and wire state transitions**

```js
// In src/ui/AppView.js
import { renderPlaybackControls } from "./PlaybackControls.js";
// At the end of render(state):
const event = state.graph.events.find((item) => item.id === state.run.currentEventId);
renderPlaybackControls(root.querySelector(".controls-host"), { run: state.run, event }, handlers);
```

```js
// Add before handlers in src/main.js
let playbackTimer = null;

function advanceOne() {
  const event = state.graph.events.find((item) => item.id === state.run.currentEventId);
  if (event.relation === "decision") return false;
  if (event.relation === "parallel") {
    const branch = state.run.activeBranches.find((item) => !state.run.completedBranches.includes(item));
    state.run = transition(state.run, { type: "COMPLETE_BRANCH", branch });
  } else {
    state.run = transition(state.run, { type: "ADVANCE" });
  }
  return true;
}

function schedulePlayback() {
  clearTimeout(playbackTimer);
  if (state.run.status !== "running") return;
  playbackTimer = setTimeout(() => {
    const progressed = advanceOne();
    if (!progressed || ["completed", "failed", "cancelled"].includes(state.run.status)) state.run = { ...state.run, status: state.run.status === "completed" ? "completed" : "paused" };
    else state.run = { ...state.run, status: "running" };
    syncLive();
    schedulePlayback();
  }, 900 / (state.playbackSpeed ?? 1));
}

// Add to handlers in src/main.js
onBranchChoice(choice) { state.run = transition(state.run, { type: "CHOOSE_BRANCH", choice }); syncLive(); },
onPrimaryAction() {
  advanceOne();
  syncLive();
},
onRestart() { state.run = transition(state.run, { type: "RESET" }); syncLive(); },
onPlayPause() { state.run = { ...state.run, status: state.run.status === "running" ? "paused" : "running" }; render(); schedulePlayback(); },
onPrevious() {
  state.run = transition(state.run, { type: "PREVIOUS" });
  syncLive();
},
onSpeedChange(speed) { state.playbackSpeed = speed; render(); },
```

```js
// Add near render() in src/main.js
function syncLive() {
  state.viewport = reduceViewport(state.viewport, { type: "SET_LIVE_NODE", moduleId: moduleForNode(state.run.currentNodeId), nodeId: state.run.currentNodeId });
  render();
}
```

- [ ] **Step 5: Add playback and relation-specific styles**

```css
/* Append to src/styles.css */
.controls-host{position:sticky;bottom:0;padding:12px 20px;background:linear-gradient(transparent,#050B14 25%)}.playback{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border:1px solid var(--line);border-radius:12px;background:#081423EE}.playback button,.playback select{border:1px solid var(--line);background:#0D1B2D;color:var(--text);border-radius:8px;padding:9px 12px}.playback button:disabled{opacity:.35}.decision-options{display:flex;gap:6px}.decision-options button{border-color:var(--branch)}.edge-parallel.is-live{stroke:var(--live);animation:flow 1.2s linear infinite}.edge-join.is-live{stroke:var(--done)}.edge-replan.is-live{stroke:var(--error)}@keyframes flow{to{stroke-dashoffset:-24}}
```

- [ ] **Step 6: Run UI and domain tests**

Run: `npm test -- tests/domain/execution.test.js tests/ui/app-view.test.js`

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 6**

```bash
git add src/main.js src/styles.css src/ui/AppView.js src/ui/PlaybackControls.js tests/ui/app-view.test.js
git commit -m "feat: add adaptive agent playback controls"
```

---

### Task 7: Responsive Dark UI, Accessibility, and Failure Simulations

**Files:**
- Modify: `src/styles.css`
- Modify: `src/data/demo-graph.js`
- Modify: `src/ui/GraphView.js`
- Modify: `src/ui/Inspector.js`
- Modify: `src/ui/AppView.js`
- Modify: `src/main.js`
- Modify: `tests/ui/graph-view.test.js`
- Modify: `tests/ui/app-view.test.js`

**Interfaces:**
- Adds event statuses `waiting`, `running`, `success`, `failed`, `skipped`, `blocked`, `retrying`, `cancelled`, `partial`.
- Adds Inspector fields `sideEffect`, `retryable`, `reversible`, `idempotencyKey`.
- Adds five selectable scenarios: normal, no retrieval results, tool timeout, permission denied, and evaluation failure.

- [ ] **Step 1: Add failing accessibility and status tests**

```js
// Append to tests/ui/graph-view.test.js
it("adds textual status labels and keyboard-focusable nodes", () => {
  renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: { ...createRun(demoGraph), status: "failed" }, viewport: createViewport(), onNodeSelect: vi.fn() });
  const live = document.querySelector('[data-node-id="user-task"]');
  expect(live.getAttribute("tabindex")).toBe("0");
  expect(live.getAttribute("aria-label")).toContain("用户任务");
  expect(live.classList.contains("is-failed")).toBe(true);
  expect(live.querySelector(".status-label").textContent).toContain("失败");
});

// Append to tests/ui/app-view.test.js
it("exposes side-effect and retry metadata in the inspector", () => {
  const view = createAppView(document.querySelector("#app"), { onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn() });
  const viewport = { ...createViewport("action", "tools"), viewing: { level: "node", moduleId: "tools", nodeId: "action" } };
  view.render({ graph: demoGraph, run: createRun(demoGraph, "tool-event"), viewport });
  expect(document.querySelector(".inspector").textContent).toContain("可重试");
});

it("offers bilingual failure simulations", () => {
  const onScenarioChange = vi.fn();
  const view = createAppView(document.querySelector("#app"), { onScenarioChange });
  view.render({ graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), scenarioId: "normal" });
  const select = document.querySelector('[data-action="scenario"]');
  expect(select.options).toHaveLength(5);
  select.value = "tool-timeout"; select.dispatchEvent(new Event("change"));
  expect(onScenarioChange).toHaveBeenCalledWith("tool-timeout");
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/ui/graph-view.test.js tests/ui/app-view.test.js`

Expected: inspector metadata assertion FAILS.

- [ ] **Step 3: Add failure and safety metadata**

```js
// Add to the action node in src/data/demo-graph.js
{
  id: "action", moduleId: "tools", label: label("动作执行", "Action"), kind: "module",
  safety: { sideEffect: true, retryable: true, reversible: false, idempotencyKey: "demo-action-001" },
}
```

```js
// Add beside events in src/data/demo-graph.js
scenarios: [
  { id: "normal", label: label("正常运行", "Normal Run") },
  { id: "no-results", label: label("检索无结果", "No Retrieval Results"), trigger: "rag-join", status: "partial" },
  { id: "tool-timeout", label: label("工具超时", "Tool Timeout"), trigger: "tool-event", status: "retrying" },
  { id: "permission-denied", label: label("权限不足", "Permission Denied"), trigger: "tool-event", status: "blocked" },
  { id: "evaluation-failed", label: label("评估不通过", "Evaluation Failed"), trigger: "observation-event", status: "paused" },
],
```

```js
// Add to renderInspector in src/ui/Inspector.js
const safety = node.safety ?? { sideEffect: false, retryable: false, reversible: true, idempotencyKey: "—" };
// Include inside <dl>:
`<dt>外部副作用</dt><dd>${safety.sideEffect ? "有" : "无"}</dd><dt>可重试</dt><dd>${safety.retryable ? "是" : "否"}</dd><dt>可撤销</dt><dd>${safety.reversible ? "是" : "否"}</dd><dt>幂等标识</dt><dd>${safety.idempotencyKey}</dd>`
```

- [ ] **Step 4: Add scenario selection and deterministic trigger behavior**

```js
// Add a scenario select to the topbar in src/ui/AppView.js and populate during render(state)
const scenario = root.querySelector('[data-action="scenario"]');
scenario.replaceChildren(...state.graph.scenarios.map((item) => new Option(`${item.label.zh} · ${item.label.en}`, item.id)));
scenario.value = state.scenarioId;
scenario.onchange = (event) => handlers.onScenarioChange?.(event.target.value);
```

```js
// Add to application state and handlers in src/main.js
state.scenarioId = "normal";
onScenarioChange(scenarioId) { state.scenarioId = scenarioId; state.run = transition(state.run, { type: "RESET" }); syncLive(); },

// Call after each successful advance in advanceOne()
const scenario = state.graph.scenarios.find((item) => item.id === state.scenarioId);
if (scenario?.trigger === state.run.currentEventId) {
  state.run = { ...state.run, status: scenario.status, simulatedIssue: scenario.label };
  return false;
}
```

- [ ] **Step 5: Complete responsive, reduced-motion, focus, and status styles**

```js
// In the live-node branch inside src/ui/GraphView.js
const statusLabels = {
  paused: "暂停 · Paused", running: "执行中 · Running", completed: "完成 · Completed",
  failed: "失败 · Failed", cancelled: "取消 · Cancelled", retrying: "重试中 · Retrying",
};
if (node.id === run.currentNodeId) {
  group.classList.add("is-live", `is-${run.status}`);
  const status = svg("text", { x: 65, y: 54, "text-anchor": "middle", class: "status-label" });
  status.textContent = statusLabels[run.status] ?? run.status;
  group.append(status);
}
```

```css
/* Append to src/styles.css */
:focus-visible{outline:2px solid var(--live);outline-offset:3px}.is-failed rect{stroke:var(--error)!important}.is-blocked rect{stroke:var(--warn)!important;stroke-dasharray:5 4}.is-skipped{opacity:.22}.is-partial rect{stroke:var(--branch)!important}.status-label{font-size:10px;fill:var(--text)}
@media(max-width:900px){.topbar{padding:14px}.canvas-shell{margin:0 10px 10px;min-height:560px}.minimap{width:200px;right:10px;top:10px}.inspector{left:10px;right:10px;bottom:82px;width:auto}.playback{overflow-x:auto;justify-content:flex-start}}
@media(max-width:620px){.minimap{width:164px}.minimap-modules{grid-template-columns:1fr}.topbar h1{font-size:20px}.canvas-shell{min-height:520px}.playback button,.playback select{padding:8px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
```

- [ ] **Step 6: Run the full test suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 7: Run keyboard and narrow-width manual checks**

Run: `npm run dev -- --host 127.0.0.1`

Verify:
- Tab reaches minimap modules, SVG nodes, inspector close, and playback controls in logical order.
- Enter/Space activates focused nodes and controls.
- At 620px width, minimap is usable, controls remain reachable, and Chinese/English labels do not overlap.
- With reduced motion enabled, no continuous line animation remains.

- [ ] **Step 8: Commit Task 7**

```bash
git add src/data/demo-graph.js src/styles.css src/ui/GraphView.js src/ui/Inspector.js tests/ui/graph-view.test.js tests/ui/app-view.test.js
git commit -m "feat: harden responsive and accessible agent UI"
```

---

### Task 8: Single-File Build, Offline Smoke Test, and Final Verification

**Files:**
- Create: `tests/smoke/single-file.test.js`
- Modify: `README.md`
- Generate: `dist/index.html`

**Interfaces:**
- Consumes: production build from `vite.config.js`.
- Produces: standalone `dist/index.html` with no external script, stylesheet, font, image, or network dependency.

- [ ] **Step 1: Write the failing single-file smoke test**

```js
// tests/smoke/single-file.test.js
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("single-file build", () => {
  it("inlines all runtime assets", () => {
    const html = readFileSync(new URL("../../dist/index.html", import.meta.url), "utf8");
    expect(html).toContain("Agent 动态执行流程");
    expect(html).toContain("<style");
    expect(html).toContain("<script");
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet/);
    expect(html).not.toMatch(/(?:src|href)=["']https?:\/\//);
    expect(html).not.toMatch(/\bfetch\s*\(/);
    expect(html).not.toMatch(/\bXMLHttpRequest\b/);
  });
});
```

- [ ] **Step 2: Run build and smoke test to establish artifact behavior**

Run: `npm run build && npm test -- tests/smoke/single-file.test.js`

Expected: PASS after Vite creates `dist/index.html`; if any external URL is present, remove that dependency before proceeding.

- [ ] **Step 3: Add concise usage documentation**

````markdown
<!-- README.md -->
# Agent 动态可交互流程

## 开发

```bash
npm install
npm run dev
```

## 验证

```bash
npm run check
```

## 离线演示

双击 `dist/index.html`。该文件不需要本地服务器或网络连接。
````

- [ ] **Step 4: Run complete automated verification**

Run: `npm run check`

Expected:
- Vitest reports all tests PASS.
- Vite reports a successful build.
- `dist/index.html` is the only required runtime artifact.

- [ ] **Step 5: Run browser acceptance checks on both HTTP and file URLs**

Open `http://127.0.0.1:<vite-port>/` and `file:///absolute/path/to/dist/index.html`.

Verify:
- Opening overview shows the full fixed architecture before focus begins.
- Clicking RAG in the right-top minimap focuses RAG without changing live execution.
- “回到当前节点” restores the live node and follow mode.
- “上一步” restores the full prior snapshot, including branch completion and iteration count.
- RAG supports vector, web, and parallel choices; join waits for selected branches.
- Context assembly returns to LLM through a callback path.
- Tool observation can trigger retry or replan with an incremented iteration.
- Each failure scenario pauses or marks the exact trigger node without changing the architecture layout.
- Guardrails remain visible as a cross-cutting layer.
- Chinese is primary and English remains readable without overlap.
- Browser console contains no uncaught errors.

- [ ] **Step 6: Commit Task 8**

```bash
git add README.md tests/smoke/single-file.test.js dist/index.html
git commit -m "build: deliver standalone agent flow demo"
```

---

## Final Completion Gate

- [ ] Run `npm run check` and record the exact passing test/build summary.
- [ ] Inspect `git status --short` and confirm only intended files remain.
- [ ] Open `dist/index.html` directly and complete every acceptance check from Task 8.
- [ ] Compare the finished UI against `docs/superpowers/specs/2026-07-20-interactive-agent-flow-design.md` section by section.
