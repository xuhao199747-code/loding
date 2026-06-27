import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("asset manifest", () => {
  it("has generated player, enemy, boss, and fx sprite outputs", () => {
    expect(existsSync("assets/sprites/player")).toBe(true);
    expect(existsSync("assets/sprites/enemies")).toBe(true);
    expect(existsSync("assets/sprites/boss")).toBe(true);
    expect(existsSync("assets/sprites/fx")).toBe(true);
  });
});
