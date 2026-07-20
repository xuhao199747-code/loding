import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

describe("Cursor-style neutral interface", () => {
  it("uses neutral surfaces with blue reserved for the active accent", () => {
    expect(styles).toMatch(/--bg:\s*#0C0C0C/);
    expect(styles).toMatch(/--panel:\s*#151515/);
    expect(styles).toMatch(/--line:\s*#2A2A2A/);
    expect(styles).toMatch(/--text:\s*#EDEDED/);
    expect(styles).toMatch(/--live:\s*#6E8BFF/);
    expect(styles).not.toContain("#38D1FF");
    expect(styles).not.toContain("#081423");
  });

  it("separates fixed shell regions with neutral borders instead of blue panels", () => {
    expect(styles).toMatch(/\.topbar\s*\{[^}]*background:\s*var\(--surface\);/s);
    expect(styles).toMatch(/\.step-rail\s*\{[^}]*background:\s*var\(--panel\);/s);
    expect(styles).toMatch(/\.controls-host\s*\{[^}]*background:\s*var\(--surface\);/s);
  });

  it("uses restrained current-state treatment without cyan glow", () => {
    expect(styles).toMatch(/\.graph-node\.is-live\s*>\s*rect\s*\{[^}]*stroke:\s*var\(--live\);/s);
    expect(styles).not.toMatch(/\.graph-node\.is-live[^}]*drop-shadow/s);
    expect(styles).not.toMatch(/\.reference-group\.is-live[^}]*drop-shadow/s);
  });
});
