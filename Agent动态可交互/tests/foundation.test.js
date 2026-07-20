import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const approvedPalette = new Set([
  "#050B14", "#081423", "#0D1B2D", "#1E3855", "#38D1FF",
  "#54D6AD", "#A88BFA", "#FFBD59", "#FF6978", "#EAF4FF",
]);

describe("foundation shell", () => {
  it("uses only approved palette colors", () => {
    const styles = readFileSync("src/styles.css", "utf8");
    const colors = [...styles.matchAll(/#[0-9A-Fa-f]{6}/g)].map(([color]) => color.toUpperCase());

    expect(colors.length).toBeGreaterThan(0);
    expect(colors.every((color) => approvedPalette.has(color))).toBe(true);
  });

  it("renders Chinese as primary copy with English support", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("../src/main.js?foundation-shell-test");
    const styles = readFileSync("src/styles.css", "utf8");

    const primary = document.querySelector('[data-lang="zh"]');
    const support = document.querySelector('[data-lang="en"]');

    expect(primary).not.toBeNull();
    expect(primary.textContent).toContain("智能代理执行流程");
    expect(support).not.toBeNull();
    expect(support.textContent).toContain("Interactive Agent Flow");
    expect(support.classList.contains("foundation-screen__support")).toBe(true);
    expect(styles).toMatch(/\.foundation-screen__support\s*{[^}]*color:\s*#A88BFA;/);
  });

  it("declares the pinned tooling Node support range", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

    expect(packageJson.engines).toEqual({ node: "^22.13.0 || >=24.0.0" });
  });

  it("builds the standalone artifact before running its smoke test", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

    expect(packageJson.scripts.check).toBe("npm run build && npm run test");
  });
});
