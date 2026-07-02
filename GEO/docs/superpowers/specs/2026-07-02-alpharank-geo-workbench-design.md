# AlphaRank GEO Workbench Design

## Goal

Build the first frontend-only AlphaRank workbench for GEO content optimization. The product helps teams diagnose how a brand, domain, and content set appears in AI answers, understand why performance changes, and turn findings into concrete content opportunities.

## Product Positioning

AlphaRank is a GEO content optimization workbench, not a traditional SEO dashboard. Its core job is to improve brand visibility, citation likelihood, sentiment, and authority signals inside AI search and AI-generated answers.

The main workflow is:

```txt
Create project
-> Configure brand, domain, competitors, and prompts
-> Run GEO diagnosis
-> Review AI answer performance
-> Analyze sentiment and topics
-> Find content opportunities
-> Draft or optimize content
-> Assign tasks
-> Retest and report
```

## Design Source And Restoration Strategy

The Figma file is the visual and workflow baseline. The implementation should restore the product logic and visual language from the provided AlphaRank UI, while normalizing copied or inconsistent sections into one coherent workbench.

Restore these Figma patterns closely:

- Left navigation, page title area, and dense workbench content layout.
- GEO diagnosis domain input, date/filter controls, diagnosis history table, download action, and view-result action.
- Core score system: GEO score, AI citability, brand authority, and E-E-A-T signals.
- Diagnosis detail sections with score summaries, priority labels, progress indicators, trend cards, and recommendation lists.
- Sentiment/topic table with expandable rows, positive and negative badges, occurrence count, percentage change, and full-answer evidence.
- Report-style cards, compact tables, and trend charts.

Normalize copied or inconsistent areas:

- Generic tables become an AlphaRank `DataTable + FilterBar + DetailDrawer` pattern.
- Generic charts become GEO-bound metrics such as brand mention rate, citation rate, answer sentiment, competitor share, or score trend.
- Inconsistent copy becomes GEO content optimization terminology.
- Isolated screens must connect to the product workflow instead of existing as standalone decoration.

## Technology Constraints

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

## MVP Scope

The first implementation should focus on a complete product loop rather than all possible settings.

MVP pages:

1. Workbench dashboard.
2. Project list.
3. Project detail.
4. GEO diagnosis list.
5. GEO diagnosis detail.
6. AI answer monitor.
7. Sentiment and topic analysis.
8. Competitor analysis.
9. Content opportunity library.
10. Content studio.
11. Task plan.
12. Report center.
13. Settings.

Highest priority modules:

1. GEO diagnosis.
2. AI answer monitor.
3. Sentiment and topic analysis.
4. Content opportunity library.

These four modules create the core loop: measure performance, inspect AI answers, explain issues, and decide what to optimize.

## Page Design

### Workbench Dashboard

Purpose: daily overview for operators and stakeholders.

Key content:

- Current project selector.
- KPI cards for GEO score, AI citability, brand mention rate, citation rate, positive sentiment share, and open opportunities.
- Trend chart for score or mention movement.
- Priority opportunity list.
- Recent diagnosis runs.
- Recent AI answer changes.

Main components:

- shadcn `Card`, `Badge`, `Button`, `Select`, `Tabs`.
- shadcn/Recharts line, area, and bar charts.
- lucide icons for trend, alert, download, refresh, and external-view actions.

### Project List

Purpose: choose and manage monitored brands/domains.

Key content:

- Project table with name, domain, market, competitors, prompt count, last run, GEO score, and status.
- Search and filter controls.
- Create project action.

Main components:

- shadcn `Table`, `Input`, `Select`, `DropdownMenu`, `Dialog`, `Badge`.

### Project Detail

Purpose: configure the monitored entity.

Key content:

- Brand profile.
- Primary domain.
- Competitor domains.
- Target markets/languages.
- Prompt groups.
- Connected content sources as mock-only placeholders.
- Recent diagnosis and monitoring summaries.

Main components:

- shadcn `Tabs`, `Card`, `Input`, `Textarea`, `Button`, `Table`, `Badge`.

### GEO Diagnosis List

Purpose: restore the Figma diagnosis history and search flow.

Key content:

- Title and subtitle.
- Tabs for diagnosis type, starting with web page diagnosis.
- Domain input.
- Date picker/filter area.
- Diagnosis history table.
- Row metrics: GEO score, AI citability, brand authority, E-E-A-T signal, diagnosis time.
- Download and view-result actions.

Main components:

- shadcn `Tabs`, `Input`, `Button`, `Table`, `Badge`, `Tooltip`.
- lucide `Search`, `Calendar`, `Download`, `Eye`, `Info`.

### GEO Diagnosis Detail

Purpose: explain one diagnosis run and turn scores into recommendations.

Key content:

- Top summary with score, priority, domain, timestamp, and export actions.
- Score cards for AI citability, brand authority, E-E-A-T, content structure, page clarity, source evidence, and technical crawlability.
- Recommendation groups with severity, reason, affected prompts/pages, and action.
- Evidence section showing representative AI answers or excerpts.
- Trend section showing score movement across runs.

Main components:

- shadcn `Card`, `Progress`, `Badge`, `Accordion`, `Table`, `Tabs`, `Button`.
- shadcn/Recharts trend charts.

### AI Answer Monitor

Purpose: monitor how AI systems answer target prompts and whether the brand appears.

Key content:

- Prompt group filters.
- AI platform filters such as ChatGPT, Perplexity, Gemini, and Claude as display data only.
- Table columns: prompt, platform, brand mention, citation, answer rank/position, sentiment, competitors mentioned, last checked, and view answer.
- Answer detail drawer with full answer, cited sources, extracted claims, sentiment explanation, and related opportunities.

Main components:

- shadcn `Table`, `Select`, `Badge`, `Sheet`, `Tabs`, `Button`.
- ai-elements only if the answer detail includes an AI assistant for follow-up analysis.

### Sentiment And Topic Analysis

Purpose: restore and extend the Figma sentiment mode table.

Key content:

- Topic table with expandable rows.
- Topic name, sentiment badge, occurrence count, percentage change.
- Expanded state showing summary, full-answer evidence, positive/negative claims, and source answers.
- Topic trend chart.
- Filters by sentiment, platform, competitor, and date range.

Main components:

- shadcn `Table`, `Badge`, `Collapsible`, `Button`, `Pagination`.
- shadcn/Recharts line or bar charts.

### Competitor Analysis

Purpose: show the competitive answer landscape.

Key content:

- Competitor mention share.
- Competitor citation share.
- Topic strengths by competitor.
- Prompts where competitors outrank the brand.
- Content gaps where competitors have stronger evidence.

Main components:

- shadcn `Card`, `Table`, `Tabs`, `Badge`.
- shadcn/Recharts bar, stacked bar, radar, and line charts.
- ECharts only if a relationship graph or dense matrix becomes necessary.

### Content Opportunity Library

Purpose: convert diagnosis and monitoring findings into an optimization backlog.

Key content:

- Opportunity table with title, type, severity, affected prompts, affected pages, estimated impact, status, owner, and due date.
- Types include FAQ gap, missing source evidence, weak comparison content, unclear product claim, negative sentiment response, E-E-A-T gap, and schema/structure issue.
- Detail drawer with reason, evidence, suggested content action, and linked task.

Main components:

- shadcn `Table`, `Badge`, `Select`, `Sheet`, `Button`, `DropdownMenu`.

### Content Studio

Purpose: draft or optimize content using AI while staying connected to GEO opportunities.

Key content:

- Left panel: selected opportunity, target prompt, target page, and scoring factors.
- Center editor: outline, draft sections, FAQ blocks, citation-friendly paragraphs, and schema suggestions.
- Right AI assistant: prompt input, generated suggestions, and revision actions.

Main components:

- shadcn `Textarea`, `Tabs`, `Card`, `Button`, `Separator`.
- ai-elements for assistant messages, prompt input, generation/loading states, and suggestions.

### Task Plan

Purpose: manage implementation work created from opportunities.

Key content:

- Board or table view with status: backlog, planned, in progress, review, done.
- Task fields: title, owner, priority, due date, linked opportunity, linked page, and retest action.

Main components:

- shadcn `Tabs`, `Table`, `Card`, `Badge`, `Dialog`, `Select`.

### Report Center

Purpose: produce stakeholder-facing reports.

Key content:

- Weekly report.
- Monthly report.
- Diagnosis report.
- Competitor report.
- Export actions for mock PDF/CSV.

Main components:

- shadcn `Card`, `Table`, `Button`, `DropdownMenu`.
- shadcn/Recharts charts.

### Settings

Purpose: keep configuration out of the main workflow.

Key content:

- Brand profile.
- Domain settings.
- Competitor settings.
- Prompt library.
- Model/provider display settings as mock-only controls.
- Team/preferences placeholders.

Main components:

- shadcn `Tabs`, `Input`, `Textarea`, `Select`, `Switch`, `Button`, `Table`.

## Information Architecture

Suggested primary navigation:

```txt
Overview
Projects
GEO Diagnosis
AI Answer Monitor
Sentiment & Topics
Competitors
Opportunities
Content Studio
Tasks
Reports
Settings
```

Chinese display labels can be:

```txt
工作台
项目
GEO 诊断
AI 答案监控
情感与话题
竞争分析
内容机会
内容编辑器
任务计划
报告中心
设置
```

## Frontend Architecture

Use a modular feature structure:

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
      PageHeader.tsx
      MetricCard.tsx
      FilterBar.tsx
      DataTable.tsx
      StatusBadge.tsx
      ScoreCard.tsx
    ui/
      shadcn components

  features/
    dashboard/
    projects/
    geo-diagnosis/
    answer-monitor/
    sentiment-analysis/
    competitors/
    opportunities/
    content-studio/
    tasks/
    reports/
    settings/

  services/
    mock-client.ts
    project-service.ts
    diagnosis-service.ts
    monitor-service.ts
    content-service.ts

  stores/
    workspace-store.ts
    ui-store.ts

  lib/
    utils.ts
    format.ts
    constants.ts
```

## Data Flow

The app should be frontend-only but avoid hardcoding data inside page components.

```txt
Page
-> feature hook
-> service adapter
-> mock data
```

This keeps the app ready for future backend integration. Replacing mock services with API services should not require rewriting pages.

## Core Data Models

### Project

```ts
type Project = {
  id: string
  name: string
  brandName: string
  domain: string
  market: string
  language: string
  competitors: Competitor[]
  promptGroups: PromptGroup[]
  status: "active" | "paused" | "draft"
  lastRunAt: string
}
```

### DiagnosisRun

```ts
type DiagnosisRun = {
  id: string
  projectId: string
  domain: string
  createdAt: string
  geoScore: number
  aiCitability: number
  brandAuthority: number
  eeatSignal: number
  priority: "high" | "medium" | "low"
  summary: string
  recommendations: Recommendation[]
}
```

### AnswerMonitorItem

```ts
type AnswerMonitorItem = {
  id: string
  projectId: string
  prompt: string
  platform: "chatgpt" | "perplexity" | "gemini" | "claude"
  brandMentioned: boolean
  citedOfficialDomain: boolean
  answerPosition: number | null
  sentiment: "positive" | "neutral" | "negative"
  competitorsMentioned: string[]
  checkedAt: string
  answerExcerpt: string
  fullAnswer: string
}
```

### TopicInsight

```ts
type TopicInsight = {
  id: string
  projectId: string
  topic: string
  sentiment: "positive" | "neutral" | "negative"
  occurrences: number
  changePercent: number
  summary: string
  evidence: string[]
}
```

### ContentOpportunity

```ts
type ContentOpportunity = {
  id: string
  projectId: string
  title: string
  type:
    | "faq_gap"
    | "source_evidence_gap"
    | "comparison_gap"
    | "claim_clarity"
    | "negative_sentiment_response"
    | "eeat_gap"
    | "structure_schema"
  severity: "high" | "medium" | "low"
  impactScore: number
  status: "open" | "planned" | "in_progress" | "done"
  affectedPrompts: string[]
  affectedUrls: string[]
  evidence: string
  suggestedAction: string
}
```

## Error, Empty, And Loading States

Every major page should include:

- Empty state for no project or no data.
- Loading skeletons for tables and cards.
- Error alert for failed mock/service calls.
- Disabled states for actions that require a selected project.
- Clear no-results state after filtering.

Use shadcn `Skeleton`, `Alert`, `Button`, and `EmptyState` built from shadcn primitives.

## Testing And Verification Expectations

Implementation should verify:

- The app builds successfully.
- Navigation routes render without runtime errors.
- Core mock services return typed data.
- Tables and expandable rows render expected mock values.
- The shadcn/ai-elements boundary is maintained: ai-elements should not be used for normal admin UI.
- Desktop and mobile screenshots show no overlapping text, broken cards, or unreadable filters.

## Out Of Scope For MVP

- Backend APIs.
- Authentication and permissions.
- Real AI provider calls.
- Real PDF generation.
- Real scheduled monitoring.
- Billing.
- Team collaboration beyond placeholders.
- Heavy custom visualization unless Recharts cannot support a required MVP chart.

## Initial Implementation Decisions

- The first implementation should create the full MVP navigation shell and route structure, with deeper functional mockups for the four highest priority modules: GEO diagnosis, AI answer monitor, sentiment and topic analysis, and content opportunity library.
- Chinese labels should be the default UI language for the first version.
- The first content studio should use a simple layout: opportunity context on the left, structured editing fields in the center, and an ai-elements assistant on the right.
