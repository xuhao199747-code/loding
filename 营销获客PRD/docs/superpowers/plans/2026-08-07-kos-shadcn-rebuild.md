# KOS Tourism Console shadcn Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a maintainable React + shadcn/ui tourism operations console that replaces the fragile embedded single-file demo while preserving the requested KOS workflow and channel interactions.

**Architecture:** Create a new Vite React TypeScript app in `kos-console/`; keep page data in typed modules, route views through one app shell, and use shared shadcn primitives for cards, tabs, badges, buttons, dialogs, and tooltips. The old HTML remains untouched as a visual reference and fallback artifact.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Radix primitives, Lucide React, Vitest, Testing Library.

## Global Constraints

- Do not modify or delete `/Users/mac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/xh961407086_49fd/msg/file/2026-08/KOS全流程整合demo_20260426_0808 (3)(2).html`.
- Use shadcn/ui primitives from `src/components/ui/*` for product controls; do not create a parallel button/card/tab system.
- Use tourism terminology consistently: 破冰、意向热聊、行程方案、预订促成、成交跟进.
- Channel tabs must exist on the 破冰 and 意向热聊 columns: 全部、 小红书、抖音、企业微信.
- Selected and hover states use background/shadow changes, never bright blue outer frames.
- All user-facing labels must fit Chinese desktop and narrow responsive layouts.

## Project Structure

- `kos-console/src/app/App.tsx`: shell, view navigation, and top-level state.
- `kos-console/src/app/routes.ts`: typed view identifiers and navigation metadata.
- `kos-console/src/components/layout/AppShell.tsx`: sidebar, top bar, content region.
- `kos-console/src/components/overview/OverviewPage.tsx`: tourism dashboard overview.
- `kos-console/src/components/monitor/MonitorPage.tsx`: five workflow columns and channel tabs.
- `kos-console/src/components/monitor/WorkflowColumn.tsx`: reusable workflow column.
- `kos-console/src/components/monitor/ChannelTabs.tsx`: shared channel filter tabs.
- `kos-console/src/components/monitor/VisitorCard.tsx`: visitor card and action entry points.
- `kos-console/src/components/dialog/ConversationDialog.tsx`: visitor conversation and progression actions.
- `kos-console/src/components/ui/*`: shadcn primitives only.
- `kos-console/src/data/tourism.ts`: typed demo visitors, columns, metrics, and channel metadata.
- `kos-console/src/lib/filtering.ts`: pure channel/stage filtering helpers.
- `kos-console/src/lib/utils.ts`: shadcn `cn` helper.
- `kos-console/src/styles/globals.css`: Tailwind tokens and app-level layout styles.
- `kos-console/tests/filtering.test.ts`: pure filtering tests.
- `kos-console/tests/monitor.test.tsx`: workflow/tab interaction tests.

### Task 1: Scaffold the new application

**Files:**
- Create: `kos-console/package.json`
- Create: `kos-console/index.html`
- Create: `kos-console/vite.config.ts`
- Create: `kos-console/tsconfig.json`
- Create: `kos-console/src/main.tsx`
- Create: `kos-console/src/lib/utils.ts`
- Create: `kos-console/src/styles/globals.css`
- Create: `kos-console/components.json`

- [ ] **Step 1: Create the Vite React TypeScript app and install dependencies.**
- [ ] **Step 2: Configure Tailwind tokens and shadcn component aliases.**
- [ ] **Step 3: Add a smoke test that mounts the app shell.**
- [ ] **Step 4: Run `npm test -- --run` and `npm run build`; both must pass.**

### Task 2: Add typed tourism data and pure filtering

**Files:**
- Create: `kos-console/src/data/tourism.ts`
- Create: `kos-console/src/lib/filtering.ts`
- Create: `kos-console/tests/filtering.test.ts`

- [ ] **Step 1: Write failing tests for all-channel filtering, per-channel filtering, and empty results.**
- [ ] **Step 2: Run `npm test -- --run tests/filtering.test.ts`; confirm the tests fail before implementation.**
- [ ] **Step 3: Implement `Channel`, `WorkflowStage`, `Visitor`, `WorkflowColumn`, and `filterVisitors(visitors, channel)` types/functions.**
- [ ] **Step 4: Run the focused test and confirm all filtering cases pass.**

### Task 3: Build the shared app shell and overview

**Files:**
- Create: `kos-console/src/app/App.tsx`
- Create: `kos-console/src/app/routes.ts`
- Create: `kos-console/src/components/layout/AppShell.tsx`
- Create: `kos-console/src/components/overview/OverviewPage.tsx`
- Add: `kos-console/src/components/ui/button.tsx`
- Add: `kos-console/src/components/ui/card.tsx`
- Add: `kos-console/src/components/ui/badge.tsx`
- Add: `kos-console/src/components/ui/separator.tsx`

- [ ] **Step 1: Add a shell test asserting the three primary navigation items and current-view state.**
- [ ] **Step 2: Implement the shell with shadcn Button, Card, Badge, and Separator primitives.**
- [ ] **Step 3: Implement the tourism overview metrics and opportunity cards without embedding page HTML or Base64.**
- [ ] **Step 4: Verify desktop and narrow layouts with `npm run build` and a local browser preview.**

### Task 4: Build the monitor workflow and shared channel tabs

**Files:**
- Create: `kos-console/src/components/monitor/MonitorPage.tsx`
- Create: `kos-console/src/components/monitor/WorkflowColumn.tsx`
- Create: `kos-console/src/components/monitor/ChannelTabs.tsx`
- Create: `kos-console/src/components/monitor/VisitorCard.tsx`
- Add: `kos-console/src/components/ui/tabs.tsx`
- Add: `kos-console/src/components/ui/scroll-area.tsx`

- [ ] **Step 1: Write failing component tests for five stage labels and four channel tabs on the 破冰 and 意向热聊 columns.**
- [ ] **Step 2: Implement `ChannelTabs` with controlled `value` and `onValueChange` props using shadcn Tabs.**
- [ ] **Step 3: Implement `WorkflowColumn` so it filters cards through `filterVisitors` and shows a neutral empty state.**
- [ ] **Step 4: Use subtle background/shadow selected states and remove all bright blue outer borders.**
- [ ] **Step 5: Run monitor tests and verify responsive behavior.**

### Task 5: Add visitor conversation and progression actions

**Files:**
- Create: `kos-console/src/components/dialog/ConversationDialog.tsx`
- Add: `kos-console/src/components/ui/dialog.tsx`
- Add: `kos-console/src/components/ui/textarea.tsx`
- Add: `kos-console/src/components/ui/tooltip.tsx`
- Modify: `kos-console/src/app/App.tsx`

- [ ] **Step 1: Write failing tests for opening a visitor dialog and advancing a visitor to the next workflow stage.**
- [ ] **Step 2: Implement the dialog with shadcn Dialog, Textarea, Button, and Tooltip components.**
- [ ] **Step 3: Implement actions `确认意向`, `确认成交`, and `立即接手` as typed state transitions.**
- [ ] **Step 4: Update the monitor column counts and overview opportunity state after each transition.**
- [ ] **Step 5: Run the full test suite and build.**

### Task 6: Add the 今日报告 action and polish responsive states

**Files:**
- Modify: `kos-console/src/components/layout/AppShell.tsx`
- Modify: `kos-console/src/components/overview/OverviewPage.tsx`
- Modify: `kos-console/src/styles/globals.css`
- Create: `kos-console/src/components/ui/skeleton.tsx`

- [ ] **Step 1: Add a regression test that the top-right action is labeled `今日报告`, not `查看详情`.**
- [ ] **Step 2: Place the report action in the app shell top-right using a shadcn Button variant.**
- [ ] **Step 3: Add loading/empty/focus states and verify no tooltip overlaps navigation.**
- [ ] **Step 4: Run tests, build, and inspect the rendered page at desktop and mobile widths.**

### Task 7: Final verification and handoff

**Files:**
- Modify: `kos-console/README.md`
- Create: `kos-console/tests/smoke.test.tsx`

- [ ] **Step 1: Run `npm test -- --run` and confirm all tests pass.**
- [ ] **Step 2: Run `npm run build` and confirm the production bundle succeeds.**
- [ ] **Step 3: Start the local preview and inspect overview, monitor, channel tabs, dialog, report button, hover states, and responsive layout.**
- [ ] **Step 4: Document `npm install`, `npm run dev`, `npm test`, and `npm run build` in the README.**
- [ ] **Step 5: Commit the new app as `feat: rebuild KOS console with shadcn`.**
