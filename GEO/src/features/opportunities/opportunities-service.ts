import { getMockOpportunities } from "@/services/mock-client"

export async function listOpportunities() {
  return getMockOpportunities()
}

export async function getOpportunity(opportunityId: string) {
  const opportunities = await getMockOpportunities()
  return opportunities.find((opportunity) => opportunity.id === opportunityId) ?? opportunities[0]
}
