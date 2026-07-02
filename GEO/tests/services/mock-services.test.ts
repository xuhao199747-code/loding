import { describe, expect, it } from "vitest"
import {
  getMockAnswerItems,
  getMockDiagnosisRuns,
  getMockOpportunities,
  getMockProjects,
  getMockTopicInsights,
} from "@/services/mock-client"

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
