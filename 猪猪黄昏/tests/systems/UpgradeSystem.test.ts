import { describe, expect, it } from "vitest";

import { applyUpgrade } from "../../src/game/systems/UpgradeSystem";

describe("upgrade system", () => {
  it("applies cleaver tempering as a direct damage increase", () => {
    const next = applyUpgrade(
      { attackDamage: 24, critChance: 0.18, moveSpeed: 220, saltRadius: 150, trapDurationMs: 3000 },
      "cleaverTempering"
    );

    expect(next.attackDamage).toBe(30);
  });
});
