// @vitest-environment node

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("single-file build", () => {
  it("inlines all runtime assets", () => {
    const html = readFileSync(new URL("../../dist/index.html", import.meta.url), "utf8");

    expect(html).toContain("Agent 动态执行流程");
    expect(html).toContain("<style");
    expect(html).toContain("<script");
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet/);
    expect(html).not.toMatch(/(?:src|href)=["']https?:\/\//);
    expect(html).not.toMatch(/\bfetch\s*\(/);
    expect(html).not.toMatch(/\bXMLHttpRequest\b/);
  });
});
