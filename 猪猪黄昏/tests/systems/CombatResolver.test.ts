import { describe, expect, it } from "vitest";

import { resolveHit } from "../../src/game/systems/CombatResolver";

describe("combat resolver", () => {
  it("applies armor mitigation before returning remaining health", () => {
    const result = resolveHit({
      attackDamage: 30,
      critMultiplier: 1,
      isCrit: false,
      armor: 6,
      currentHealth: 40
    });

    expect(result.finalDamage).toBe(24);
    expect(result.remainingHealth).toBe(16);
  });
});
