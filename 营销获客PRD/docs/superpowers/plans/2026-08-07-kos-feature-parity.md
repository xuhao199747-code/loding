# KOS 旅游获客功能对齐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 React + TypeScript + shadcn/ui 项目中逐项补齐旧版 KOS 旅游获客控制台的页面、交互和状态变化。

**Architecture:** 保留现有 AppShell、路由和 shadcn UI primitives；将共享业务状态集中到 App 的本地演示 store，通过明确的回调传递给 overview、monitor、dialog、advisor、content、schedule 和 report 模块。纯过滤、阶段推进、任务状态和指标计算放入 lib，页面组件只负责展示和事件编排。

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Tailwind CSS, Radix/shadcn-style local components, lucide-react.

## Global Constraints

- 旧版单文件 HTML 保持不变，不继续嵌入 base64 iframe。
- 视觉沿用当前 shadcn 风格，不做旧版像素级复制。
- 所有新增行为先写失败测试，再实现最小代码。
- 所有按钮必须有行为、禁用原因或明确的演示反馈。
- 使用本地 `Button`、`Card`、`Badge`、`Dialog`、`Tabs`、`Textarea` 等组件。
- 每个任务完成后运行相关测试，最后运行完整测试和生产构建。

---

### Task 1: 建立共享业务状态和派生逻辑

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/data/tourism.ts`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/lib/tourism-state.ts`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/lib/filtering.ts`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/tourism-state.test.ts`

**Interfaces:**
- `TourismAction = "retain" | "wechat" | "takeover" | "qualify" | "quote" | "payment" | "travel" | "repurchase"`
- `ConversationMessage = { id: string; visitorId: string; sender: "visitor" | "advisor" | "ai"; text: string; time: string }`
- `TimelineEvent = { id: string; label: string; detail: string; time: string }`
- `TourismState = { visitors: Visitor[]; messages: ConversationMessage[]; timeline: Record<string, TimelineEvent[]>; selectedVisitorId?: string; feedback?: string }`
- `advanceVisitor(visitor, action): { visitor: Visitor; event: TimelineEvent }`
- `filterVisitorsByChannel(visitors, channel): Visitor[]`
- `appendMessage(state, visitorId, text): TourismState`

- [ ] **Step 1: Write failing tests** for channel filtering, valid stage actions, invalid action reasons, message append, and timeline append.
- [ ] **Step 2: Run** `npm test -- --run tests/tourism-state.test.ts`; expected failure because the state helpers do not exist.
- [ ] **Step 3: Implement** typed state helpers and add enough visitor data for all five stages and all four channels.
- [ ] **Step 4: Run** the focused test and verify all assertions pass.
- [ ] **Step 5: Commit** with `feat: add shared tourism interaction state`.

---

### Task 2: Refactor App state wiring and navigation

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/app/App.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/app/routes.ts`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/layout/AppShell.tsx`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/smoke.test.tsx`

**Interfaces:**
- `App` owns `TourismState), current `ViewId), report dialog state, selected visitor, feedback toast state, and callbacks passed to pages.
- `AppShell` receives `view`, `onViewChange), `onReport), `feedback), and `children`.
- Every route in `routes.ts` has a stable `ViewId`, label, description, and lucide icon mapping.

- [ ] **Step 1: Add failing smoke assertions** for all five nav destinations and visible feedback after a state action.
- [ ] **Step 2: Run** `npm test -- --run tests/smoke.test.tsx`; expected failure for missing state wiring.
- [ ] **Step 3: Implement** centralized state and route navigation without moving business logic into page markup.
- [ ] **Step 4: Run** smoke tests and existing tests.
- [ ] **Step 5: Commit** with `refactor: centralize KOS app state and navigation`.

---

### Task 3: Complete overview, diagnosis, and report actions

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/overview/OverviewPage.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/report/TodayReportDialog.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/overview/MetricCard.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/overview/OpportunityCard.tsx`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/overview.test.tsx`

**Interfaces:**
- `OverviewPage({ onMonitor, onReport, onOpenVisitor, metrics, opportunities })`
- `OpportunityCard({ opportunity, onOpen, onAction })`
- `TodayReportDialog({ open, onClose, metrics, suggestions, onAction })`

- [ ] **Step 1: Write failing tests** for metric cards, opportunity action buttons, diagnosis summary, and report open/close.
- [ ] **Step 2: Run** `npm test -- --run tests/overview.test.tsx`; expected failure for missing sections/actions.
- [ ] **Step 3: Implement** overview sections with no-op-free actions and report actions wired to shared state.
- [ ] **Step 4: Run** focused and regression tests.
- [ ] **Step 5: Commit** with `feat: restore overview diagnosis and report actions`.

---

### Task 4: Complete monitor, channel tabs, stage cards, and visitor detail

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/monitor/MonitorPage.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/monitor/WorkflowColumn.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/monitor/VisitorCard.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/monitor/ChannelTabs.tsx`
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/dialog/ConversationDialog.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/monitor/StageActionBar.tsx`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/monitor.test.tsx`

**Interfaces:**
- `MonitorPage({ visitors, channelByStage, onChannelChange, onOpenVisitor, onAction })`
- `WorkflowColumn({ column, visitors, channel, onChannelChange, onOpenVisitor })`
- `ConversationDialog({ visitor, timeline, messages, onClose, onSend, onAction, onAdvance })`
- `StageActionBar({ visitor, onAction })`

- [ ] **Step 1: Add failing tests** for all five stage columns, tabs in relevant stage panels, detail timeline, retain/wechat/takeover/qualify actions, next-stage action, empty states, and keyboard activation.
- [ ] **Step 2: Run** `npm test -- --run tests/monitor.test.tsx`; expected failure for missing action controls and timeline.
- [ ] **Step 3: Implement** stage-aware action bars, detail timeline, action feedback, and responsive card layout.
- [ ] **Step 4: Run** focused monitor tests and regression tests.
- [ ] **Step 5: Commit** with `feat: restore monitor workflow interactions`.

---

### Task 5: Complete advisor 1v1 workspace and AI copilot

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/advisor/AdvisorPage.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/advisor/ConversationList.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/advisor/MessageThread.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/advisor/AiCopilot.tsx`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/advisor.test.tsx`

**Interfaces:**
- `AdvisorPage({ visitors, messages, onSelectVisitor, onSendMessage, onAdoptSuggestion, onAction })`
- `MessageThread({ visitor, messages, draft, onDraftChange, onSend })`
- `AiCopilot({ visitor, onAdoptSuggestion })`

- [ ] **Step 1: Write failing tests** for conversation switching, sending a message, adopting AI copy, and showing visitor summary.
- [ ] **Step 2: Run** `npm test -- --run tests/advisor.test.tsx`; expected failure for missing callbacks and state changes.
- [ ] **Step 3: Implement** focused child components and connect them to shared App state.
- [ ] **Step 4: Run** focused advisor tests and regression tests.
- [ ] **Step 5: Commit** with `feat: restore advisor conversation interactions`.

---

### Task 6: Complete content center workflows

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/content/ContentPage.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/content/ContentComposerDialog.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/content/ContentQueue.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/content/DestinationPerformance.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/data/content.ts`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/content.test.tsx`

**Interfaces:**
- `ContentPage({ items, onCreate, onEdit, onPublish })`
- `ContentComposerDialog({ open, item, onClose, onSave })`
- `ContentQueue({ items, onEdit, onPublish })`
- `DestinationPerformance({ destinations })`

- [ ] **Step 1: Write failing tests** for opening new content, saving a draft, editing an item, publishing an item, and displaying queue/metrics.
- [ ] **Step 2: Run** `npm test -- --run tests/content.test.tsx`; expected failure for missing form and state transitions.
- [ ] **Step 3: Implement** controlled composer dialog, content state transitions, and queue actions.
- [ ] **Step 4: Run** focused content tests and regression tests.
- [ ] **Step 5: Commit** with `feat: restore tourism content workflows`.

---

### Task 7: Complete follow-up scheduler workflows

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/schedule/SchedulePage.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/schedule/TaskQueue.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components/schedule/ServiceRhythm.tsx`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/data/schedule.ts`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/schedule.test.tsx`

**Interfaces:**
- `SchedulePage({ tasks, metrics, onRefresh, onContact, onOpenConversation, onService, onRepurchase })`
- `TaskQueue({ tasks, onAction })`
- `ServiceRhythm({ metrics })`

- [ ] **Step 1: Write failing tests** for refresh feedback and all four task actions.
- [ ] **Step 2: Run** `npm test -- --run tests/schedule.test.tsx`; expected failure for missing action handlers.
- [ ] **Step 3: Implement** task status transitions and visible feedback for each action.
- [ ] **Step 4: Run** focused schedule tests and regression tests.
- [ ] **Step 5: Commit** with `feat: restore follow-up scheduler workflows`.

---

### Task 8: Responsive and interaction quality pass

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/styles/globals.css`
- Modify: relevant files under `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/src/components`
- Test: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests/responsive-structure.test.tsx`

**Interfaces:**
- All page components keep semantic headings and no horizontal overflow at narrow widths.
- Interactive controls expose accessible names and keyboard focus states.
- Hover is secondary; selected state uses background/foreground changes without blue border-only decoration.

- [ ] **Step 1: Write failing structural tests** for accessible names, mobile grid classes, no browser-native tooltip text, and selected tab semantics.
- [ ] **Step 2: Run** `npm test -- --run tests/responsive-structure.test.tsx`; expected failure for missing accessibility/structure assertions.
- [ ] **Step 3: Implement** responsive layout corrections and shadcn-consistent hover/focus/selected states.
- [ ] **Step 4: Run** focused and full tests.
- [ ] **Step 5: Commit** with `fix: align responsive interaction states`.

---

### Task 9: Full verification and browser parity checklist

**Files:**
- Modify: `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/README.md`
- Create: `/Users/mac/Documents/vibcoding/营销获客PRD/docs/superpowers/parity-checklists/2026-08-07-kos-feature-parity.md`
- Test: all tests under `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console/tests`

- [ ] **Step 1: Write** the completed parity checklist mapping each specification requirement to a test or browser action.
- [ ] **Step 2: Run** `npm test -- --run`; expected all tests pass.
- [ ] **Step 3: Run** `npm run build`; expected exit code 0.
- [ ] **Step 4: Open** `http://127.0.0.1:5174/` and verify desktop and narrow viewport navigation, tabs, dialogs, stage actions, content actions, scheduler actions, and report actions.
- [ ] **Step 5: Update README** with the restored feature surfaces and verification commands.
- [ ] **Step 6: Commit** with `docs: add KOS parity verification checklist`.

## Final verification

Run from `/Users/mac/Documents/vibcoding/营销获客PRD/kos-console`:

```bash
npm test -- --run
npm run build
```

Expected: all test files pass, build exits with code 0, and the browser smoke checklist has no broken actions.

