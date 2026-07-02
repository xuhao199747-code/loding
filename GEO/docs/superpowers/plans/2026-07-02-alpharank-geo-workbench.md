# AlphaRank GEO Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only AlphaRank GEO content optimization workbench that restores the approved Figma direction and completes the first product loop with mock data.

**Architecture:** Use a Vite React TypeScript SPA with feature-based modules. Pages consume typed feature services, services return mock data, and future backend integration is isolated behind service adapters. shadcn/ui owns normal workbench UI; ai-elements is restricted to AI assistant and prompt/generation surfaces.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, ai-elements, lucide-react, Recharts through shadcn/ui Charts, Vitest, Testing Library, Playwright.

## Global Constraints

- The UI must use Tailwind CSS, shadcn/ui, and ai-elements.
- shadcn/ui is the default component source for app UI: layout panels, cards, tables, tabs, forms, filters, dialogs, drawers, badges, buttons, inputs, selects, dropdowns, tooltips, sheets, and settings.
- ai-elements is only for AI surfaces: chat messages, prompt input, streaming/generation states, AI suggestions, and the content assistant.
- Icons should come from lucide.
- Colors, spacing, borders, radius, and state styling should use Figma patterns and shadcn/Tailwind semantic tokens first.
- When a Figma variable is missing, choose the closest shadcn/ui token or component state.
- Custom components are allowed only when shadcn/ui and ai-elements do not provide a suitable primitive.
- Charts default to shadcn/ui Charts with Recharts.
- Apache ECharts may be introduced only when shadcn/Recharts cannot cleanly support a required chart such as heatmaps, complex matrices, relationship graphs, Sankey charts, high-density trend exploration, or advanced interactions.
- The first version is frontend-only. No backend should be implemented.
- The first implementation should create the full MVP navigation shell and route structure, with deeper functional mockups for the four highest priority modules: GEO diagnosis, AI answer monitor, sentiment and topic analysis, and content opportunity library.
- Chinese labels should be the default UI language for the first version.
- The first content studio should use a simple layout: opportunity context on the left, structured editing fields in the center, and an ai-elements assistant on the right.

---

## File Structure

Create this structure inside `/Users/mac/Documents/vibcoding/GEO`:

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    layout/
      AppShell.tsx
      SidebarNav.tsx
      Topbar.tsx
    common/
      DataTable.tsx
      EmptyState.tsx
      FilterBar.tsx
      MetricCard.tsx
      PageHeader.tsx
      ScoreCard.tsx
      StatusBadge.tsx
    ui/
      shadcn components
  features/
    answer-monitor/
      AnswerMonitorPage.tsx
      AnswerDetailSheet.tsx
      answer-monitor-service.ts
    competitors/
      CompetitorsPage.tsx
    content-studio/
      ContentStudioPage.tsx
      ContentAssistant.tsx
    dashboard/
      DashboardPage.tsx
    geo-diagnosis/
      GeoDiagnosisPage.tsx
      GeoDiagnosisDetailPage.tsx
      diagnosis-service.ts
    opportunities/
      OpportunitiesPage.tsx
      OpportunityDetailSheet.tsx
      opportunities-service.ts
    projects/
      ProjectsPage.tsx
      ProjectDetailPage.tsx
      project-service.ts
    reports/
      ReportsPage.tsx
    sentiment-analysis/
      SentimentAnalysisPage.tsx
      sentiment-service.ts
    settings/
      SettingsPage.tsx
    tasks/
      TasksPage.tsx
  lib/
    constants.ts
    format.ts
    mock-data.ts
    types.ts
    utils.ts
  services/
    mock-client.ts
  stores/
    ui-store.ts
    workspace-store.ts
  test/
    setup.ts
tests/
  app/
    routing.test.tsx
  features/
    answer-monitor.test.tsx
    geo-diagnosis.test.tsx
    opportunities.test.tsx
    sentiment-analysis.test.tsx
  services/
    mock-services.test.ts
  smoke/
    app-shell.spec.ts
```

---

### Task 1: Scaffold Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/test/setup.ts`
- Test: `tests/app/routing.test.tsx`

**Interfaces:**
- Produces: a runnable Vite React app at `http://localhost:5173`.
- Produces: scripts `dev`, `build`, `test`, `test:run`, `lint`, and `preview`.

- [ ] **Step 1: Create the app scaffold**

Run:

```bash
npm create vite@latest . -- --template react-ts
```

Expected: Vite creates React TypeScript project files in `/Users/mac/Documents/vibcoding/GEO`.

- [ ] **Step 2: Install base runtime and test dependencies**

Run:

```bash
npm install
npm install react-router-dom lucide-react recharts clsx tailwind-merge class-variance-authority
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom playwright @playwright/test
```

Expected: `package.json` contains React, Vite, TypeScript, React Router, lucide-react, Recharts, and test dependencies.

- [ ] **Step 3: Configure Vitest**

Modify `vite.config.ts` to include:

```ts
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
})
```

- [ ] **Step 4: Configure test setup**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 5: Add routing smoke test**

Create `tests/app/routing.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "@/app/App"

describe("App", () => {
  it("renders the AlphaRank shell placeholder", () => {
    render(<App />)
    expect(screen.getByText("AlphaRank")).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Replace the starter app with a placeholder**

Create `src/app/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <h1>AlphaRank</h1>
    </main>
  )
}
```

- [ ] **Step 7: Verify scaffold**

Run:

```bash
npm run test:run
npm run build
```

Expected: tests pass and production build succeeds.

- [ ] **Step 8: Commit**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json src tests
git commit -m "chore: scaffold alpharank frontend"
```

---

### Task 2: Install Tailwind, shadcn/ui, Charts, and ai-elements

**Files:**
- Modify: `package.json`
- Create: `components.json`
- Create: `src/index.css`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/*`
- Test: `tests/app/routing.test.tsx`

**Interfaces:**
- Consumes: Vite app from Task 1.
- Produces: shadcn/ui components under `src/components/ui`.
- Produces: Tailwind semantic tokens used by every page.

- [ ] **Step 1: Install Tailwind and shadcn dependencies**

Run:

```bash
npm install tailwindcss @tailwindcss/vite
npx shadcn@latest init
```

When prompted by shadcn, choose:

```txt
Style: New York
Base color: Neutral
CSS variables: yes
```

Expected: `components.json`, Tailwind setup, and shadcn utility wiring are created.

- [ ] **Step 2: Add required shadcn components**

Run:

```bash
npx shadcn@latest add button card badge table tabs input textarea select dropdown-menu dialog sheet tooltip separator progress accordion skeleton alert switch pagination chart
```

Expected: required UI primitives exist under `src/components/ui`.

- [ ] **Step 3: Install ai-elements**

Run the AI Elements CLI for the first content assistant components:

```bash
npx ai-elements@latest add conversation
npx ai-elements@latest add message
npx ai-elements@latest add prompt-input
npx ai-elements@latest add suggestion
npx ai-elements@latest add sources
```

Expected: AI Elements components are added under `src/components/ai-elements` or the path configured by `components.json`, and are available for `features/content-studio/ContentAssistant.tsx`.

- [ ] **Step 4: Normalize global CSS**

Ensure `src/index.css` contains Tailwind import and shadcn tokens. Keep the neutral token palette generated by shadcn and do not add decorative gradients or non-Figma accent palettes.

- [ ] **Step 5: Verify UI dependencies**

Run:

```bash
npm run build
```

Expected: build succeeds and no missing CSS or module errors appear.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json package-lock.json components.json src/index.css src/lib/utils.ts src/components/ui
git commit -m "chore: install tailwind shadcn and ai elements"
```

---

### Task 3: Define Shared Types, Constants, Formatting, and Mock Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/mock-data.ts`
- Create: `src/services/mock-client.ts`
- Test: `tests/services/mock-services.test.ts`

**Interfaces:**
- Produces: `Project`, `DiagnosisRun`, `AnswerMonitorItem`, `TopicInsight`, `ContentOpportunity`, and `TaskItem` types.
- Produces: read-only mock service helpers used by every feature service.

- [ ] **Step 1: Write service tests first**

Create `tests/services/mock-services.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { getMockProjects, getMockDiagnosisRuns, getMockAnswerItems, getMockTopicInsights, getMockOpportunities } from "@/services/mock-client"

describe("mock client", () => {
  it("returns the default AlphaRank project", async () => {
    const projects = await getMockProjects()
    expect(projects[0].brandName).toBe("Nihao Jewelry")
    expect(projects[0].domain).toBe("www.nihaojewelry.com")
  })

  it("returns connected GEO mock datasets", async () => {
    expect(await getMockDiagnosisRuns()).toHaveLength(3)
    expect(await getMockAnswerItems()).toHaveLength(6)
    expect(await getMockTopicInsights()).toHaveLength(5)
    expect(await getMockOpportunities()).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Create shared types**

Create `src/lib/types.ts` with exported types matching the approved spec. Include `Competitor`, `PromptGroup`, `Recommendation`, `TaskItem`, `ChartPoint`, and union types for status, severity, platform, sentiment, and opportunity type.

- [ ] **Step 3: Create constants**

Create `src/lib/constants.ts`:

```ts
import type { Platform } from "@/lib/types"

export const APP_NAME = "AlphaRank"

export const NAV_ITEMS = [
  { title: "工作台", href: "/", icon: "LayoutDashboard" },
  { title: "项目", href: "/projects", icon: "FolderKanban" },
  { title: "GEO 诊断", href: "/diagnosis", icon: "Activity" },
  { title: "AI 答案监控", href: "/answer-monitor", icon: "Bot" },
  { title: "情感与话题", href: "/sentiment", icon: "MessagesSquare" },
  { title: "竞争分析", href: "/competitors", icon: "Swords" },
  { title: "内容机会", href: "/opportunities", icon: "Lightbulb" },
  { title: "内容编辑器", href: "/content-studio", icon: "PenLine" },
  { title: "任务计划", href: "/tasks", icon: "ListChecks" },
  { title: "报告中心", href: "/reports", icon: "FileBarChart" },
  { title: "设置", href: "/settings", icon: "Settings" },
] as const

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "perplexity", label: "Perplexity" },
  { value: "gemini", label: "Gemini" },
  { value: "claude", label: "Claude" },
]
```

- [ ] **Step 4: Create formatting helpers**

Create `src/lib/format.ts` with functions:

```ts
export function formatScore(score: number): string {
  return `${Math.round(score)}/100`
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
```

- [ ] **Step 5: Create mock data**

Create `src/lib/mock-data.ts` with one default project for `Nihao Jewelry`, three diagnosis runs, six answer monitor rows, five topic insights including the Figma-inspired topics `运输延迟`, `响应迅速的客户服务`, `无最低订单数量`, `实惠的价格`, and `竞争性定价`, plus six content opportunities.

- [ ] **Step 6: Create mock client**

Create `src/services/mock-client.ts` exporting async getters:

```ts
import { answerItems, diagnosisRuns, opportunities, projects, topicInsights } from "@/lib/mock-data"

const delay = (ms = 80) => new Promise((resolve) => window.setTimeout(resolve, ms))

export async function getMockProjects() {
  await delay()
  return projects
}

export async function getMockDiagnosisRuns() {
  await delay()
  return diagnosisRuns
}

export async function getMockAnswerItems() {
  await delay()
  return answerItems
}

export async function getMockTopicInsights() {
  await delay()
  return topicInsights
}

export async function getMockOpportunities() {
  await delay()
  return opportunities
}
```

- [ ] **Step 7: Verify typed mock data**

Run:

```bash
npm run test:run -- tests/services/mock-services.test.ts
npm run build
```

Expected: mock service tests pass and TypeScript build succeeds.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/lib src/services tests/services/mock-services.test.ts
git commit -m "feat: add alpharank mock data model"
```

---

### Task 4: Build App Shell, Navigation, and Routing

**Files:**
- Modify: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/app/providers.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/SidebarNav.tsx`
- Create: `src/components/layout/Topbar.tsx`
- Create: placeholder page files for all MVP routes under `src/features/*`
- Test: `tests/app/routing.test.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS` from `src/lib/constants.ts`.
- Produces: route paths `/`, `/projects`, `/projects/:projectId`, `/diagnosis`, `/diagnosis/:runId`, `/answer-monitor`, `/sentiment`, `/competitors`, `/opportunities`, `/content-studio`, `/tasks`, `/reports`, `/settings`.

- [ ] **Step 1: Replace routing test**

Update `tests/app/routing.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AppRoutes } from "@/app/router"

describe("AppRoutes", () => {
  it("renders the dashboard route inside the workbench shell", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByText("工作台")).toBeInTheDocument()
    expect(screen.getByText("GEO 诊断")).toBeInTheDocument()
  })

  it("renders the answer monitor route", () => {
    render(
      <MemoryRouter initialEntries={["/answer-monitor"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole("heading", { name: "AI 答案监控" })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create route placeholders**

Create each page with a heading matching its Chinese navigation label. For example, `src/features/dashboard/DashboardPage.tsx`:

```tsx
export function DashboardPage() {
  return <h1 className="text-2xl font-semibold tracking-normal">工作台</h1>
}
```

Use the same pattern for the other placeholder pages.

- [ ] **Step 3: Create AppShell**

Create `src/components/layout/AppShell.tsx` with fixed left navigation, topbar, and a scrollable content region. Use `bg-background`, `text-foreground`, `border-border`, and `bg-card`; keep cards and panels at `rounded-lg` or smaller.

- [ ] **Step 4: Create SidebarNav**

Create `src/components/layout/SidebarNav.tsx` using lucide icons mapped from `NAV_ITEMS`. Use shadcn `Button` variants or link styling based on shadcn token classes. Active links should use `bg-muted text-foreground`.

- [ ] **Step 5: Create Topbar**

Create `src/components/layout/Topbar.tsx` with current project display, search input, date label, and a secondary action button. Use lucide `Search`, `CalendarDays`, and `RefreshCw`.

- [ ] **Step 6: Create router**

Create `src/app/router.tsx` with `Routes`, nested in `AppShell`, and export `AppRoutes`.

- [ ] **Step 7: Wire App**

Update `src/app/App.tsx`:

```tsx
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "@/app/router"

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 8: Verify routing**

Run:

```bash
npm run test:run -- tests/app/routing.test.tsx
npm run build
```

Expected: routing tests pass and all placeholder routes build.

- [ ] **Step 9: Commit**

Run:

```bash
git add src/app src/components/layout src/features tests/app/routing.test.tsx
git commit -m "feat: add alpharank app shell and routes"
```

---

### Task 5: Build Shared Workbench Components

**Files:**
- Create: `src/components/common/PageHeader.tsx`
- Create: `src/components/common/MetricCard.tsx`
- Create: `src/components/common/ScoreCard.tsx`
- Create: `src/components/common/StatusBadge.tsx`
- Create: `src/components/common/FilterBar.tsx`
- Create: `src/components/common/DataTable.tsx`
- Create: `src/components/common/EmptyState.tsx`
- Test: `tests/app/common-components.test.tsx`

**Interfaces:**
- Produces: reusable components used by all feature modules.
- Consumes: shadcn `Card`, `Badge`, `Button`, `Input`, `Select`, `Table`, `Skeleton`, and lucide icons.

- [ ] **Step 1: Write common component tests**

Create `tests/app/common-components.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetricCard } from "@/components/common/MetricCard"
import { StatusBadge } from "@/components/common/StatusBadge"

describe("common components", () => {
  it("renders a metric card", () => {
    render(<MetricCard title="GEO 综合" value="72/100" helper="较上周 +8.2%" />)
    expect(screen.getByText("GEO 综合")).toBeInTheDocument()
    expect(screen.getByText("72/100")).toBeInTheDocument()
  })

  it("renders a Chinese severity badge", () => {
    render(<StatusBadge tone="danger">高优先级</StatusBadge>)
    expect(screen.getByText("高优先级")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create PageHeader**

Create `PageHeader` with props `title`, `description`, and `actions`. It renders compact workbench typography, not hero-sized marketing copy.

- [ ] **Step 3: Create MetricCard and ScoreCard**

Create `MetricCard` for dashboard metrics and `ScoreCard` for diagnosis scores. `ScoreCard` includes score, label, helper, and shadcn `Progress`.

- [ ] **Step 4: Create StatusBadge**

Create `StatusBadge` with tones `success`, `warning`, `danger`, `neutral`, and `info`. Map tones to shadcn token classes, not custom color systems.

- [ ] **Step 5: Create FilterBar**

Create `FilterBar` with slots for search, select filters, date display, and action buttons. Use shadcn `Input`, `Select`, and `Button`.

- [ ] **Step 6: Create DataTable**

Create a lightweight wrapper around shadcn `Table` that accepts `children`, `empty`, and `isLoading`. It should render `Skeleton` rows when loading and `EmptyState` when empty.

- [ ] **Step 7: Verify common components**

Run:

```bash
npm run test:run -- tests/app/common-components.test.tsx
npm run build
```

Expected: common component tests pass.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/components/common tests/app/common-components.test.tsx
git commit -m "feat: add shared workbench components"
```

---

### Task 6: Implement Project and Dashboard Pages

**Files:**
- Modify: `src/features/dashboard/DashboardPage.tsx`
- Modify: `src/features/projects/ProjectsPage.tsx`
- Modify: `src/features/projects/ProjectDetailPage.tsx`
- Create: `src/features/projects/project-service.ts`
- Test: `tests/features/projects-dashboard.test.tsx`

**Interfaces:**
- Consumes: `getMockProjects`, `getMockDiagnosisRuns`, `getMockAnswerItems`, and `getMockOpportunities`.
- Produces: dashboard and project overview pages that establish project context for the rest of the app.

- [ ] **Step 1: Write page tests**

Create `tests/features/projects-dashboard.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { DashboardPage } from "@/features/dashboard/DashboardPage"
import { ProjectsPage } from "@/features/projects/ProjectsPage"

describe("dashboard and projects", () => {
  it("renders dashboard KPI labels", async () => {
    render(<DashboardPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("GEO 综合")).toBeInTheDocument())
    expect(screen.getByText("AI 可引用性")).toBeInTheDocument()
    expect(screen.getByText("内容机会")).toBeInTheDocument()
  })

  it("renders the project table", async () => {
    render(<ProjectsPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("Nihao Jewelry")).toBeInTheDocument())
    expect(screen.getByText("www.nihaojewelry.com")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create project service**

Create `project-service.ts` with functions `listProjects()` and `getProject(projectId: string)` that call mock client functions.

- [ ] **Step 3: Implement DashboardPage**

Use `PageHeader`, `MetricCard`, shadcn `Card`, and shadcn/Recharts chart primitives. Show KPI cards for `GEO 综合`, `AI 可引用性`, `品牌提及率`, `官网引用率`, and `内容机会`.

- [ ] **Step 4: Implement ProjectsPage**

Use `FilterBar` and shadcn `Table`. Include columns `项目`, `域名`, `市场`, `竞品`, `Prompt`, `GEO 分`, `状态`, `最后诊断`.

- [ ] **Step 5: Implement ProjectDetailPage**

Use shadcn `Tabs` for `品牌资料`, `竞品`, `Prompt 组`, and `最近诊断`. Use mock data only.

- [ ] **Step 6: Verify**

Run:

```bash
npm run test:run -- tests/features/projects-dashboard.test.tsx
npm run build
```

Expected: dashboard and project tests pass.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/features/dashboard src/features/projects tests/features/projects-dashboard.test.tsx
git commit -m "feat: add dashboard and project pages"
```

---

### Task 7: Implement GEO Diagnosis List and Detail

**Files:**
- Modify: `src/features/geo-diagnosis/GeoDiagnosisPage.tsx`
- Modify: `src/features/geo-diagnosis/GeoDiagnosisDetailPage.tsx`
- Create: `src/features/geo-diagnosis/diagnosis-service.ts`
- Test: `tests/features/geo-diagnosis.test.tsx`

**Interfaces:**
- Consumes: diagnosis mock data and shared score components.
- Produces: Figma-aligned diagnosis history, domain input, score metrics, and diagnosis detail view.

- [ ] **Step 1: Write diagnosis tests**

Create `tests/features/geo-diagnosis.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { GeoDiagnosisPage } from "@/features/geo-diagnosis/GeoDiagnosisPage"
import { GeoDiagnosisDetailPage } from "@/features/geo-diagnosis/GeoDiagnosisDetailPage"

describe("GEO diagnosis", () => {
  it("renders diagnosis list metrics", async () => {
    render(<GeoDiagnosisPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("网页诊断")).toBeInTheDocument())
    expect(screen.getByText("GEO 综合")).toBeInTheDocument()
    expect(screen.getByText("AI 可引用性")).toBeInTheDocument()
    expect(screen.getByText("品牌权威性")).toBeInTheDocument()
    expect(screen.getByText("E-E-A-T 信号")).toBeInTheDocument()
  })

  it("renders diagnosis detail recommendations", async () => {
    render(<GeoDiagnosisDetailPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("诊断详情")).toBeInTheDocument())
    expect(screen.getByText("高优先级")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create diagnosis service**

Create functions `listDiagnosisRuns()`, `getDiagnosisRun(runId: string)`, and `getLatestDiagnosisRun()`.

- [ ] **Step 3: Implement GeoDiagnosisPage**

Use `PageHeader`, shadcn `Tabs`, `FilterBar`, `Input`, `Button`, `Table`, `Tooltip`, and lucide `Search`, `Calendar`, `Download`, `Eye`, `Info`. Restore the Figma diagnosis table with row metrics for `GEO 综合`, `AI 可引用性`, `品牌权威性`, and `E-E-A-T 信号`.

- [ ] **Step 4: Implement GeoDiagnosisDetailPage**

Use `ScoreCard`, shadcn `Progress`, `Accordion`, `Table`, `Tabs`, and a Recharts trend card. Show diagnosis summary, priority badge, score breakdown, recommendations, evidence, and score movement.

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:run -- tests/features/geo-diagnosis.test.tsx
npm run build
```

Expected: GEO diagnosis tests pass and the page uses only shadcn for admin UI.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/geo-diagnosis tests/features/geo-diagnosis.test.tsx
git commit -m "feat: add geo diagnosis workflow"
```

---

### Task 8: Implement AI Answer Monitor

**Files:**
- Modify: `src/features/answer-monitor/AnswerMonitorPage.tsx`
- Create: `src/features/answer-monitor/AnswerDetailSheet.tsx`
- Create: `src/features/answer-monitor/answer-monitor-service.ts`
- Test: `tests/features/answer-monitor.test.tsx`

**Interfaces:**
- Consumes: answer monitor mock data.
- Produces: prompt/platform answer table and detail sheet.

- [ ] **Step 1: Write answer monitor tests**

Create `tests/features/answer-monitor.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AnswerMonitorPage } from "@/features/answer-monitor/AnswerMonitorPage"

describe("AI answer monitor", () => {
  it("renders monitored prompts and platform labels", async () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("AI 答案监控")).toBeInTheDocument())
    expect(screen.getByText("ChatGPT")).toBeInTheDocument()
    expect(screen.getByText("Perplexity")).toBeInTheDocument()
  })

  it("opens answer detail sheet", async () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()
    await user.click(await screen.findByRole("button", { name: /查看答案/ }))
    expect(screen.getByText("完整答案")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create service**

Create `listAnswerItems()` and `getAnswerItem(itemId: string)`.

- [ ] **Step 3: Implement AnswerMonitorPage**

Use shadcn `Table`, `Select`, `Badge`, `Button`, and `Sheet`. Columns: `Prompt`, `平台`, `品牌提及`, `官网引用`, `位置`, `情感`, `竞品`, `最后检查`, `操作`.

- [ ] **Step 4: Implement AnswerDetailSheet**

Use shadcn `Sheet`, `Tabs`, `Badge`, and `Separator`. Show `完整答案`, `引用来源`, `提取主张`, `情感解释`, and `相关机会`. Do not use ai-elements unless adding a follow-up AI assistant in a later task.

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:run -- tests/features/answer-monitor.test.tsx
npm run build
```

Expected: monitor tests pass and answer detail opens.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/answer-monitor tests/features/answer-monitor.test.tsx
git commit -m "feat: add ai answer monitor"
```

---

### Task 9: Implement Sentiment and Topic Analysis

**Files:**
- Modify: `src/features/sentiment-analysis/SentimentAnalysisPage.tsx`
- Create: `src/features/sentiment-analysis/sentiment-service.ts`
- Test: `tests/features/sentiment-analysis.test.tsx`

**Interfaces:**
- Consumes: topic insight mock data.
- Produces: Figma-aligned expandable topic table and sentiment trend summary.

- [ ] **Step 1: Write sentiment tests**

Create `tests/features/sentiment-analysis.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { SentimentAnalysisPage } from "@/features/sentiment-analysis/SentimentAnalysisPage"

describe("sentiment analysis", () => {
  it("renders topic rows from the Figma flow", async () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("运输延迟")).toBeInTheDocument())
    expect(screen.getByText("响应迅速的客户服务")).toBeInTheDocument()
  })

  it("expands a topic answer evidence row", async () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()
    await user.click(await screen.findByRole("button", { name: /展开 运输延迟/ }))
    expect(screen.getByText("查看完整答案")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create service**

Create `listTopicInsights()` and `getTopicInsight(topicId: string)`.

- [ ] **Step 3: Implement SentimentAnalysisPage**

Use shadcn `Table`, `Badge`, `Collapsible`, `Button`, `Pagination`, and Recharts chart. Match Figma structure: topic, sentiment, occurrence count, change badge, expandable evidence block.

- [ ] **Step 4: Verify**

Run:

```bash
npm run test:run -- tests/features/sentiment-analysis.test.tsx
npm run build
```

Expected: sentiment table renders, expands, and builds.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/sentiment-analysis tests/features/sentiment-analysis.test.tsx
git commit -m "feat: add sentiment topic analysis"
```

---

### Task 10: Implement Content Opportunity Library

**Files:**
- Modify: `src/features/opportunities/OpportunitiesPage.tsx`
- Create: `src/features/opportunities/OpportunityDetailSheet.tsx`
- Create: `src/features/opportunities/opportunities-service.ts`
- Test: `tests/features/opportunities.test.tsx`

**Interfaces:**
- Consumes: opportunity mock data.
- Produces: optimization backlog table and opportunity detail sheet.

- [ ] **Step 1: Write opportunity tests**

Create `tests/features/opportunities.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { OpportunitiesPage } from "@/features/opportunities/OpportunitiesPage"

describe("opportunities", () => {
  it("renders opportunity backlog", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByText("内容机会")).toBeInTheDocument())
    expect(screen.getByText("FAQ 缺口")).toBeInTheDocument()
  })

  it("opens opportunity detail", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()
    await user.click(await screen.findByRole("button", { name: /查看机会/ }))
    expect(screen.getByText("建议动作")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create service**

Create `listOpportunities()` and `getOpportunity(opportunityId: string)`.

- [ ] **Step 3: Implement OpportunitiesPage**

Use shadcn `Table`, `Badge`, `Select`, `Sheet`, `Button`, and `DropdownMenu`. Columns: `机会`, `类型`, `严重度`, `影响分`, `影响 Prompt`, `影响页面`, `状态`, `负责人`, `操作`.

- [ ] **Step 4: Implement OpportunityDetailSheet**

Show `原因`, `证据`, `建议动作`, `关联 Prompt`, `关联页面`, and `创建任务` mock action.

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:run -- tests/features/opportunities.test.tsx
npm run build
```

Expected: opportunity page tests pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/opportunities tests/features/opportunities.test.tsx
git commit -m "feat: add content opportunity library"
```

---

### Task 11: Implement Supporting Pages

**Files:**
- Modify: `src/features/competitors/CompetitorsPage.tsx`
- Modify: `src/features/content-studio/ContentStudioPage.tsx`
- Create: `src/features/content-studio/ContentAssistant.tsx`
- Modify: `src/features/tasks/TasksPage.tsx`
- Modify: `src/features/reports/ReportsPage.tsx`
- Modify: `src/features/settings/SettingsPage.tsx`
- Test: `tests/features/supporting-pages.test.tsx`

**Interfaces:**
- Consumes: existing mock datasets from previous tasks.
- Produces: complete MVP navigation shell with non-empty supporting pages.
- Produces: the only ai-elements usage in first implementation through `ContentAssistant`.

- [ ] **Step 1: Write supporting page tests**

Create `tests/features/supporting-pages.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { CompetitorsPage } from "@/features/competitors/CompetitorsPage"
import { ContentStudioPage } from "@/features/content-studio/ContentStudioPage"
import { ReportsPage } from "@/features/reports/ReportsPage"
import { SettingsPage } from "@/features/settings/SettingsPage"
import { TasksPage } from "@/features/tasks/TasksPage"

describe("supporting pages", () => {
  it("renders competitor analysis", () => {
    render(<CompetitorsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "竞争分析" })).toBeInTheDocument()
  })

  it("renders content studio with AI assistant", () => {
    render(<ContentStudioPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "内容编辑器" })).toBeInTheDocument()
    expect(screen.getByText("AI 内容助手")).toBeInTheDocument()
  })

  it("renders tasks, reports, and settings", () => {
    render(<TasksPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "任务计划" })).toBeInTheDocument()
    render(<ReportsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "报告中心" })).toBeInTheDocument()
    render(<SettingsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "设置" })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Implement CompetitorsPage**

Use shadcn cards, table, tabs, and Recharts bars/radar chart. Show competitor mention share, citation share, prompts where competitors outrank the brand, and topic strengths.

- [ ] **Step 3: Implement ContentStudioPage**

Use a three-column desktop layout: left opportunity context, center structured editing fields, right `ContentAssistant`.

- [ ] **Step 4: Implement ContentAssistant**

Use ai-elements components for assistant messages, prompt input, generation/loading state, and suggestions. If ai-elements exported names differ after installation, use the installed package documentation and keep this as the only AI-surface component.

- [ ] **Step 5: Implement TasksPage**

Use shadcn `Tabs`, `Table`, `Badge`, `Dialog`, and `Select`. Show backlog, planned, in progress, review, and done statuses.

- [ ] **Step 6: Implement ReportsPage**

Use shadcn `Card`, `Table`, `Button`, `DropdownMenu`, and Recharts. Include weekly, monthly, diagnosis, and competitor reports with mock export buttons.

- [ ] **Step 7: Implement SettingsPage**

Use shadcn `Tabs`, `Input`, `Textarea`, `Select`, `Switch`, `Button`, and `Table`. Include brand profile, domains, competitors, prompt library, and mock model/provider display settings.

- [ ] **Step 8: Verify**

Run:

```bash
npm run test:run -- tests/features/supporting-pages.test.tsx
npm run build
```

Expected: all supporting pages render and build.

- [ ] **Step 9: Commit**

Run:

```bash
git add src/features/competitors src/features/content-studio src/features/tasks src/features/reports src/features/settings tests/features/supporting-pages.test.tsx
git commit -m "feat: add supporting workbench pages"
```

---

### Task 12: Add Boundary Checks, Browser Smoke Test, and Visual QA

**Files:**
- Create: `tests/smoke/app-shell.spec.ts`
- Create: `tests/app/ui-boundaries.test.ts`
- Modify: `package.json`
- Test: browser smoke tests and build.

**Interfaces:**
- Produces: verification that routes render in browser and ai-elements stays out of admin UI.

- [ ] **Step 1: Add boundary test**

Create `tests/app/ui-boundaries.test.ts`:

```ts
import { describe, expect, it } from "vitest"

const adminModules = import.meta.glob("../../src/features/**/**.{tsx,ts}", {
  as: "raw",
  eager: true,
})

describe("UI library boundaries", () => {
  it("keeps ai-elements out of non-AI admin modules", () => {
    const violations = Object.entries(adminModules)
      .filter(([path]) => !path.includes("content-studio/ContentAssistant"))
      .filter(([, source]) => String(source).includes("ai-elements"))
      .map(([path]) => path)

    expect(violations).toEqual([])
  })
})
```

- [ ] **Step 2: Add Playwright smoke test**

Create `tests/smoke/app-shell.spec.ts`:

```ts
import { expect, test } from "@playwright/test"

const routes = [
  "/",
  "/projects",
  "/diagnosis",
  "/answer-monitor",
  "/sentiment",
  "/competitors",
  "/opportunities",
  "/content-studio",
  "/tasks",
  "/reports",
  "/settings",
]

for (const route of routes) {
  test(`renders ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.getByText("AlphaRank")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
  })
}
```

- [ ] **Step 3: Add package scripts**

Update `package.json` scripts:

```json
{
  "test:e2e": "playwright test",
  "check": "npm run test:run && npm run build && npm run test:e2e"
}
```

- [ ] **Step 4: Run full verification**

Start dev server:

```bash
npm run dev -- --host 127.0.0.1
```

In another shell, run:

```bash
npm run test:run
npm run build
npm run test:e2e
```

Expected: unit tests, production build, and browser smoke tests pass.

- [ ] **Step 5: Manual visual QA**

Open:

```txt
http://127.0.0.1:5173/
```

Check:

- Desktop layout at 1440px wide has no overlapping text.
- Mobile width around 390px keeps navigation usable and tables horizontally scrollable or stacked.
- GEO diagnosis and sentiment pages visually resemble the Figma workbench structure.
- AI assistant appears only in Content Studio.
- Buttons use lucide icons where the action is icon-friendly.
- Tables, cards, filters, and badges use shadcn token styling.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json tests/smoke tests/app/ui-boundaries.test.ts
git commit -m "test: add workbench verification checks"
```

---

## Reference Docs

- Vite React template: https://vite.dev/guide/
- shadcn/ui Vite installation and CLI: https://ui.shadcn.com/docs/installation/vite
- shadcn/ui Charts, built using Recharts: https://ui.shadcn.com/docs/components/chart
- AI Elements setup and component installation: https://elements.ai-sdk.dev/docs/setup
- AI Elements conversation component: https://elements.ai-sdk.dev/components/conversation
- AI Elements prompt input component: https://elements.ai-sdk.dev/components/prompt-input
- AI Elements message component: https://elements.ai-sdk.dev/components/message
- AI Elements suggestion component: https://elements.ai-sdk.dev/components/suggestion
- AI Elements sources component: https://elements.ai-sdk.dev/components/sources
- lucide icons: https://lucide.dev/icons/
- Recharts: https://recharts.org/

## Self-Review

Spec coverage:

- The plan covers the full navigation shell and all MVP pages from the design spec.
- The four highest priority modules each have dedicated tasks and tests: GEO diagnosis, AI answer monitor, sentiment and topic analysis, and content opportunity library.
- The shadcn/ui and ai-elements boundary is implemented as a testable rule.
- The chart strategy is covered through shadcn/Recharts, with no ECharts dependency added in MVP.
- The frontend-only requirement is covered through mock services and no backend tasks.

Placeholder scan:

- No task uses unresolved placeholder markers or unspecified implementation placeholders.
- The plan uses exact route paths, exact feature paths, exact test paths, and concrete verification commands.

Type consistency:

- Shared types are created before feature services.
- Feature services consume the mock client only.
- Page tests reference the same Chinese labels specified in the design spec.
