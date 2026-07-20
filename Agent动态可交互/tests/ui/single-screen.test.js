import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

describe("single-screen style contract", () => {
  it("locks the application to a fixed viewport without page overflow", () => {
    expect(styles).toMatch(/html,\s*body,\s*#app\s*\{(?=[^}]*width:\s*100vw;)(?=[^}]*height:\s*100vh;)(?=[^}]*overflow:\s*hidden;)[^}]*\}/);
  });

  it("gives primary SVG labels an explicit light fill", () => {
    expect(styles).toMatch(/\.primary-label\s*\{(?=[^}]*fill:\s*#EAF4FF;)[^}]*\}/i);
  });

  it("keeps the 1366 by 768 layout from re-enabling page scrolling", () => {
    const compactViewportRule = styles.match(/@media\s*\(\s*max-width:\s*1366px\s*\)\s*and\s*\(\s*max-height:\s*768px\s*\)\s*\{([\s\S]*)\n\}/);

    expect(compactViewportRule).not.toBeNull();
    expect(compactViewportRule[1]).toMatch(/overflow:\s*hidden;/);
    expect(compactViewportRule[1]).not.toMatch(/overflow(?:-x|-y)?:\s*(?:auto|scroll);/);
  });
});
