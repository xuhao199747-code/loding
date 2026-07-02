import { getMockTopicInsights } from "@/services/mock-client"

export async function listTopicInsights() {
  return getMockTopicInsights()
}

export async function getTopicInsight(topicId: string) {
  const topics = await getMockTopicInsights()
  return topics.find((topic) => topic.id === topicId) ?? topics[0]
}
