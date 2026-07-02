import {
  answerItems,
  diagnosisRuns,
  opportunities,
  projects,
  scoreTrend,
  tasks,
  topicInsights,
} from "@/lib/mock-data"

const delay = (ms = 20) => new Promise((resolve) => globalThis.setTimeout(resolve, ms))

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

export async function getMockTasks() {
  await delay()
  return tasks
}

export async function getMockScoreTrend() {
  await delay()
  return scoreTrend
}
