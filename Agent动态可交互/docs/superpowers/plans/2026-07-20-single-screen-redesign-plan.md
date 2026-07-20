# Single-Screen Agent Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the obstructed map-and-camera interface with a fixed, fully visible, high-contrast Agent flow that fits in one 1366×768 viewport.

**Architecture:** Preserve `demoGraph` and the execution state machine, but simplify the presentation to one fixed SVG overview plus a non-overlapping detail rail and footer controls. Remove minimap, camera, follow-mode, autoplay, and floating inspector rendering from the application shell. Build the SVG in module → edges → nodes order and derive edge endpoints at node boundaries.

**Tech Stack:** Vanilla JavaScript ES modules, SVG, CSS Grid, Vitest/JSDOM, Vite single-file build.

## Global Constraints

- The page must fit inside 100vw × 100vh with no page-level scrolling at 1366×768 or larger.
- The full architecture and all primary edges remain visible at every step.
- SVG primary text uses an explicit light `fill`; it must never inherit black.
- The minimap, camera navigation, follow mode, autoplay, speed selector, and floating inspector are removed from the rendered interface.
- `dist/index.html` remains a standalone offline file with no external assets or network calls.

---

### Task 1: Lock the single-screen contract with failing tests

**Files:**
- Modify: `tests/ui/app-view.test.js`
- Modify: `tests/ui/graph-view.test.js`
- Create: `tests/ui/single-screen.test.js`

**Interfaces:**
- Consumes: `createAppView(root, handlers)`, `renderGraph(container, state)`.
- Produces: regression assertions for shell structure, SVG layer order, explicit text fill, and overflow policy.

- [ ] **Step 1: Write failing shell tests**

Add assertions that rendered HTML has no `.minimap`, `.return-live`, speed selector, or play button; it contains `.flow-stage`, `.step-rail`, and only Previous/Next/Restart plus contextual decision/recovery buttons.

- [ ] **Step 2: Write failing graph tests**

Assert `[data-layer="modules"]` precedes `[data-layer="edges"]`, which precedes `[data-layer="nodes"]`; every edge has `marker-end`; primary module/node text has a dedicated `primary-label` class.

- [ ] **Step 3: Write failing style tests**

Read `src/styles.css` and assert `html, body, #app` use fixed viewport sizing with overflow hidden, `.primary-label` has an explicit light `fill`, and the 1366×768 media rule does not create page scrolling.

- [ ] **Step 4: Verify RED**

Run:

```bash
PATH=/Users/mac/.npm/_npx/387698761821791d/node_modules/node/bin:/usr/local/bin:/usr/bin:/bin npm test -- tests/ui/single-screen.test.js tests/ui/app-view.test.js tests/ui/graph-view.test.js
```

Expected: failures for current minimap/camera shell, missing layer groups, and missing explicit primary-label fill.

---

### Task 2: Replace the presentation with a fixed overview

**Files:**
- Modify: `src/ui/AppView.js`
- Modify: `src/ui/GraphView.js`
- Modify: `src/ui/PlaybackControls.js`
- Modify: `src/ui/Inspector.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Delete or leave unreferenced: `src/ui/MiniMap.js`

**Interfaces:**
- Consumes: existing `run`, `graph`, scenario and transition handlers.
- Produces: `createAppView` rendering a fixed `flow-stage`, `renderGraph` rendering one complete overview, and a static `.step-rail` populated from the current event/snapshot.

- [ ] **Step 1: Implement the minimal fixed shell**

Render header, main content with `.graph-host` and `.step-rail`, and footer controls. Remove all minimap, return-live, follow, camera and autoplay event bindings.

- [ ] **Step 2: Implement explicit graph layers**

Create SVG groups in this order:

```js
const modulesLayer = svg("g", { "data-layer": "modules" });
const edgesLayer = svg("g", { "data-layer": "edges" });
const nodesLayer = svg("g", { "data-layer": "nodes" });
root.append(modulesLayer, edgesLayer, nodesLayer);
```

Assign `primary-label` to Chinese module/node labels. Compute straight-edge start/end points from node rectangle boundaries instead of node centers. Retain arrow markers and current relation styling.

- [ ] **Step 3: Implement compact fixed controls**

Keep Previous, Next, Restart, decision choices and recovery choices. Remove Play/Pause and speed. Disable Next at unresolved decisions/issues.

- [ ] **Step 4: Implement 100vh high-contrast CSS**

Use rows `64px minmax(0, 1fr) 64px`, body overflow hidden, a `minmax(0, 1fr) 260px` main grid, a non-overlapping rail, and SVG `width/height:100%`. Set `.primary-label { fill: #EAF4FF; }` and supporting labels to light blue-gray.

- [ ] **Step 5: Verify GREEN**

Run the focused tests from Task 1. Expected: all focused tests pass.

- [ ] **Step 6: Run full tests**

Run `npm test`. Expected: all tests pass after obsolete minimap/camera assertions are removed or rewritten to match the approved interface.

---

### Task 3: Build and visually verify the standalone artifact

**Files:**
- Modify: `dist/index.html`
- Modify: `README.md` if its controls describe removed behavior.
- Test: `tests/smoke/single-file.test.js`

**Interfaces:**
- Consumes: Vite application entry and single-file plugin.
- Produces: a standalone `dist/index.html` matching the simplified source interface.

- [ ] **Step 1: Build before smoke testing**

Run `npm run check` with Node 24.18.0. Expected: build succeeds and every unit/smoke test passes.

- [ ] **Step 2: Verify three viewport sizes**

At 1366×768, 1440×900, and 1920×1080 assert:

```js
document.documentElement.scrollWidth === innerWidth
document.documentElement.scrollHeight === innerHeight
```

Also verify all five module labels, user task, final response, footer controls, and step rail are visible without scrolling.

- [ ] **Step 3: Verify flow direction and contrast**

Advance through sequence, decision, parallel, callback, retry/replan paths. Confirm the active edge has a visible arrow and moving indicator; completed edges stop moving. Check computed `fill` for primary labels is light and not `rgb(0, 0, 0)`.

- [ ] **Step 4: Verify offline artifact**

Open `dist/index.html` directly and confirm no external scripts, styles, fonts, local asset references, fetch, or XMLHttpRequest.

- [ ] **Step 5: Commit**

Commit the deleted design spec, plan, source, tests, README if changed, and rebuilt artifact in a scoped commit.
