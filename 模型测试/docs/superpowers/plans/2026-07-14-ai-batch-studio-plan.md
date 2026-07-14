# AI Batch Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-first AI image/video batch-generation workbench with offline simulation by default and an optional APImart API adapter.

**Architecture:** Use a Vite + React + TypeScript single-page app. Keep product state in `App.tsx`, persistence in a small storage module, and task creation/polling behind a task-engine adapter so offline and API modes share the same UI. Use focused components for the prompt panel, model picker, queue, dialogs, and toast feedback.

**Tech Stack:** Vite, React, TypeScript, plain CSS, browser localStorage, native dialogs where useful, Vitest + Testing Library for unit/component tests.

## Global Constraints

- 仅优化桌面端，目标宽度为 1280–1920px。
- 不实现账号系统、云端数据库或独立上传服务。
- 配置、任务和自定义模型使用浏览器本地存储。
- 离线模式无需 API Key，可创建模拟任务并展示模拟结果。
- 真实 API 模式沿用同一套任务状态和结果展示组件。
- 提示词按非空行拆分；Ctrl/Cmd + Enter 开始生成。
- 所有危险操作需要确认。

---

### Task 1: Scaffold the React desktop app shell

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/types.ts`
- Test: `tests/app-shell.test.tsx`

**Interfaces:**
- Produces `App` rendering the two-column workbench shell with the top bar, prompt panel placeholder, and task workspace placeholder.
- Produces shared types `Mode`, `TaskStatus`, `Task`, `Draft`, `Settings`, and `ModelDefinition`.

- [ ] **Step 1: Write the failing shell test**

```tsx
it('renders the desktop workbench shell', () => {
  render(<App />)
  expect(screen.getByText('AI 批量生成工作台')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /生图/ })).toBeInTheDocument()
  expect(screen.getByText('任务队列')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- --run tests/app-shell.test.tsx`
Expected: FAIL because the app and test setup do not exist.

- [ ] **Step 3: Scaffold the Vite app and implement the minimal shell**

Create the Vite scripts and render a semantic shell with fixed desktop regions: a 64px top bar, a 392px configuration column, and a flexible queue column. Add only the shell styling needed for the test and the later components.

- [ ] **Step 4: Run the shell test and build**

Run: `npm test -- --run tests/app-shell.test.tsx && npm run build`
Expected: PASS and a successful Vite production build.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src tests
git commit -m "feat: scaffold desktop batch studio shell"
```

### Task 2: Add model catalog, draft state, and local persistence

**Files:**
- Create: `src/data/models.ts`
- Create: `src/lib/storage.ts`
- Create: `src/lib/format.ts`
- Modify: `src/types.ts`
- Test: `tests/lib/storage.test.ts`, `tests/data/models.test.ts`

**Interfaces:**
- `getModels(mode: Mode): ModelDefinition[]` returns grouped image/video models with capabilities.
- `loadState(): PersistedState` and `saveState(state: PersistedState): void` use the key `ai-batch-studio:v1`.
- `countPrompts(value: string): number` trims and counts non-empty lines.

- [ ] **Step 1: Write failing tests for prompt parsing and persistence**

```ts
it('counts only non-empty prompt lines', () => {
  expect(countPrompts('猫\n\n城市夜景\n  ')).toBe(2)
})

it('round-trips persisted settings and tasks', () => {
  const state = createDefaultPersistedState()
  saveState({ ...state, settings: { ...state.settings, mode: 'api' } })
  expect(loadState().settings.mode).toBe('api')
})
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- --run tests/lib/storage.test.ts tests/data/models.test.ts`
Expected: FAIL because the helpers and catalog do not exist.

- [ ] **Step 3: Implement the typed model catalog and storage helpers**

Include representative models from the reference site: Nano Banana 2, GPT-Image 2, Seedream 5.0 Pro, Qwen Image 2.0, Sora 2, Veo 3.1, 可灵 V3, Seedance 2.0, Wan 2.6, and Pixverse V6. Each definition must expose `id`, `name`, `vendor`, `mode`, `badges`, `supportsReference`, and `maxReferences`.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- --run tests/lib/storage.test.ts tests/data/models.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/data/models.ts src/lib/storage.ts src/lib/format.ts tests
git commit -m "feat: add model catalog and persisted state"
```

### Task 3: Implement offline task engine and optional APImart adapter

**Files:**
- Create: `src/lib/task-engine.ts`
- Test: `tests/lib/task-engine.test.ts`

**Interfaces:**
- `createOfflineTasks(input: CreateTaskInput): Task[]` creates queued tasks for every prompt/model/count combination.
- `runOfflineTask(taskId: string, onUpdate: (task: Task) => void): () => void` transitions queued → running → success/error and returns a cleanup function.
- `createApiClient(settings: ApiSettings): ApiClient` exposes `createTask(input)` and `getTask(taskId)` with normalized results.
- `normalizeApiError(response: Response): Error` maps 401/402/other errors to user-facing Chinese messages.

- [ ] **Step 1: Write failing engine tests**

```ts
it('expands prompts, models, and count into independent tasks', () => {
  const tasks = createOfflineTasks({ prompts: ['猫', '城市'], models: [models[0], models[1]], count: 2, mode: 'image' })
  expect(tasks).toHaveLength(8)
  expect(tasks.every(task => task.status === 'queued')).toBe(true)
})

it('normalizes API auth and balance errors', () => {
  expect(normalizeApiError(new Response('', { status: 401 })).message).toMatch(/API Key/)
  expect(normalizeApiError(new Response('', { status: 402 })).message).toMatch(/余额/)
})
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- --run tests/lib/task-engine.test.ts`
Expected: FAIL because the engine is not implemented.

- [ ] **Step 3: Implement offline simulation and API normalization**

Use deterministic timers in offline mode: 450ms queued, 900ms running, then success for most tasks and error for prompts containing `失败演示`. Generate local SVG data URLs for image previews and a poster-like placeholder for videos so the UI has real media to display without network access. The API adapter must use `POST /v1/images/generations` or `POST /v1/videos/generations` and normalize `task_id`, status, and result URLs.

- [ ] **Step 4: Run the engine tests**

Run: `npm test -- --run tests/lib/task-engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/task-engine.ts tests/lib/task-engine.test.ts
git commit -m "feat: add offline task simulator and API adapter"
```

### Task 4: Build the prompt/configuration panel

**Files:**
- Create: `src/components/PromptPanel.tsx`, `src/components/ModelPicker.tsx`
- Modify: `src/App.tsx`, `src/index.css`
- Test: `tests/components/prompt-panel.test.tsx`

**Interfaces:**
- `PromptPanel` receives `mode`, `draft`, `models`, `onDraftChange`, `onGenerate`, and `onOpenSettings`.
- `ModelPicker` receives `mode`, `models`, `selectedIds`, `onChange`, and `referencesCount`.

- [ ] **Step 1: Write failing interaction tests**

```tsx
it('updates prompt count and creates one line per prompt', async () => {
  const onGenerate = vi.fn()
  render(<PromptPanel {...defaultProps} onGenerate={onGenerate} />)
  await userEvent.type(screen.getByLabelText('提示词'), '猫{enter}城市')
  expect(screen.getByText('2 条')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /开始生成/ }))
  expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({ prompts: ['猫', '城市'] }))
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- --run tests/components/prompt-panel.test.tsx`
Expected: FAIL because the panel is not implemented.

- [ ] **Step 3: Implement configuration controls**

Add labeled textarea fields, reference image tiles with URL input and file picker, ratio/resolution/duration chips, audio switch, count select, vendor model groups, selected-model count, estimated task count, and a primary generate button. Disable models when the current reference count exceeds `maxReferences`.

- [ ] **Step 4: Run component tests and build**

Run: `npm test -- --run tests/components/prompt-panel.test.tsx && npm run build`
Expected: PASS and successful build.

- [ ] **Step 5: Commit**

```bash
git add src/components src/App.tsx src/index.css tests/components
git commit -m "feat: add batch prompt and model configuration panel"
```

### Task 5: Build the queue, dialogs, settings, and full interaction wiring

**Files:**
- Create: `src/components/TaskWorkspace.tsx`, `src/components/TaskCard.tsx`, `src/components/TaskDetailDialog.tsx`, `src/components/SettingsDialog.tsx`, `src/components/ToastStack.tsx`
- Modify: `src/App.tsx`, `src/index.css`, `src/lib/storage.ts`
- Test: `tests/components/task-workspace.test.tsx`, `tests/components/settings-dialog.test.tsx`

**Interfaces:**
- `TaskWorkspace` receives `tasks`, `filter`, `onFilterChange`, `onRetry`, `onClear`, `onDownloadAll`, `onOpenTask`, and `onUseAsReference`.
- `SettingsDialog` receives `settings`, `customModels`, `onSave`, and `onClose`.

- [ ] **Step 1: Write failing queue and settings tests**

```tsx
it('filters failed tasks and retries them', async () => {
  const onRetry = vi.fn()
  render(<TaskWorkspace tasks={fixtures} {...callbacks} onRetry={onRetry} />)
  await userEvent.click(screen.getByRole('button', { name: /失败/ }))
  expect(screen.getAllByText('失败')).toHaveLength(1)
  await userEvent.click(screen.getByRole('button', { name: /重试/ }))
  expect(onRetry).toHaveBeenCalledWith('failed-task')
})

it('saves API settings and supports custom models', async () => {
  const onSave = vi.fn()
  render(<SettingsDialog {...defaultSettingsProps} onSave={onSave} />)
  await userEvent.type(screen.getByLabelText('API Key'), 'sk-demo')
  await userEvent.click(screen.getByRole('button', { name: '保存设置' }))
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'sk-demo' }))
})
```

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run tests/components/task-workspace.test.tsx tests/components/settings-dialog.test.tsx`
Expected: FAIL because queue and settings components are not implemented.

- [ ] **Step 3: Implement task cards and task workspace actions**

Support all/success/running/error filters, retry one, retry all failures, clear with confirmation, download successful results, copy prompt, open detail, and use result as reference. Show empty state when there are no matching tasks.

- [ ] **Step 4: Implement settings, details, and toast feedback**

Use native `<dialog>` elements for API settings, task detail, and confirmation. Persist API mode, Base URL, API Key, auto-download, and custom models. Keep keys masked by default and provide a show/hide control.

- [ ] **Step 5: Run focused tests and build**

Run: `npm test -- --run tests/components/task-workspace.test.tsx tests/components/settings-dialog.test.tsx && npm run build`
Expected: PASS and successful build.

- [ ] **Step 6: Commit**

```bash
git add src tests/components
git commit -m "feat: add task queue settings and result dialogs"
```

### Task 6: Visual polish and end-to-end verification

**Files:**
- Modify: `src/index.css`, `src/App.tsx`, `index.html`
- Test: `tests/smoke/desktop-workbench.test.tsx`

- [ ] **Step 1: Add a smoke test for the main path**

Cover mode switching, entering two prompts, selecting a model, starting offline generation, waiting for a success card, opening details, and using the result as a reference.

- [ ] **Step 2: Implement final desktop polish**

Use the approved dark blue-black palette, gradient accent, glassy panels, compact controls, hover/focus states, visible keyboard focus, 1280px no-horizontal-scroll layout, and 3–4 column result grid at wide desktop widths.

- [ ] **Step 3: Run verification**

Run: `npm test -- --run && npm run build`
Expected: all tests PASS and production build succeeds.

- [ ] **Step 4: Run the local preview and inspect the desktop viewport**

Run: `npm run dev -- --host 127.0.0.1`, then inspect the app at 1280×900 and 1920×1080. Verify no horizontal scroll, readable card density, working dialogs, and successful offline generation.

- [ ] **Step 5: Commit**

```bash
git add src index.html tests
git commit -m "feat: polish and verify desktop AI batch studio"
```
