import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("document head", () => {
  it("uses the AlphaRank logo as the site icon", () => {
    const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8")

    expect(html).toContain('<link rel="icon" type="image/png" href="/favicon.png" />')
  })
})
