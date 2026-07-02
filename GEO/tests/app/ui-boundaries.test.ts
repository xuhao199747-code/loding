import { describe, expect, it } from "vitest"

const adminModules = import.meta.glob("../../src/features/**/**.{tsx,ts}", {
  query: "?raw",
  import: "default",
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
