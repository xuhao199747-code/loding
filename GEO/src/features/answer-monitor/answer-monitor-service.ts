import { getMockAnswerItems } from "@/services/mock-client"

export async function listAnswerItems() {
  return getMockAnswerItems()
}

export async function getAnswerItem(itemId: string) {
  const items = await getMockAnswerItems()
  return items.find((item) => item.id === itemId) ?? items[0]
}
