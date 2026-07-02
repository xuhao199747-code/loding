export type ProjectStatus = "active" | "paused" | "draft"
export type Severity = "high" | "medium" | "low"
export type Platform = "chatgpt" | "perplexity" | "gemini" | "claude"
export type Sentiment = "positive" | "neutral" | "negative"
export type OpportunityStatus = "open" | "planned" | "in_progress" | "done"
export type TaskStatus = "backlog" | "planned" | "in_progress" | "review" | "done"

export type OpportunityType =
  | "faq_gap"
  | "source_evidence_gap"
  | "comparison_gap"
  | "claim_clarity"
  | "negative_sentiment_response"
  | "eeat_gap"
  | "structure_schema"

export type Competitor = {
  id: string
  name: string
  domain: string
}

export type PromptGroup = {
  id: string
  name: string
  prompts: string[]
}

export type Project = {
  id: string
  name: string
  brandName: string
  domain: string
  market: string
  language: string
  competitors: Competitor[]
  promptGroups: PromptGroup[]
  status: ProjectStatus
  lastRunAt: string
}

export type Recommendation = {
  id: string
  title: string
  severity: Severity
  reason: string
  affectedPrompts: string[]
  affectedUrls: string[]
  action: string
}

export type DiagnosisRun = {
  id: string
  projectId: string
  domain: string
  createdAt: string
  geoScore: number
  aiCitability: number
  brandAuthority: number
  eeatSignal: number
  priority: Severity
  summary: string
  recommendations: Recommendation[]
}

export type AnswerMonitorItem = {
  id: string
  projectId: string
  prompt: string
  platform: Platform
  brandMentioned: boolean
  citedOfficialDomain: boolean
  answerPosition: number | null
  sentiment: Sentiment
  competitorsMentioned: string[]
  checkedAt: string
  answerExcerpt: string
  fullAnswer: string
  citedSources: string[]
  extractedClaims: string[]
}

export type TopicInsight = {
  id: string
  projectId: string
  topic: string
  sentiment: Sentiment
  occurrences: number
  changePercent: number
  summary: string
  evidence: string[]
}

export type ContentOpportunity = {
  id: string
  projectId: string
  title: string
  type: OpportunityType
  severity: Severity
  impactScore: number
  status: OpportunityStatus
  owner: string
  dueDate: string
  affectedPrompts: string[]
  affectedUrls: string[]
  evidence: string
  suggestedAction: string
}

export type TaskItem = {
  id: string
  title: string
  status: TaskStatus
  owner: string
  priority: Severity
  dueDate: string
  opportunityId: string
  linkedUrl: string
}

export type ChartPoint = {
  label: string
  value: number
  comparison?: number
}
