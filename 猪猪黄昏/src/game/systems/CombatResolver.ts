import type { DamageResult } from "../types";

export function resolveHit(input: {
  attackDamage: number;
  critMultiplier: number;
  isCrit: boolean;
  armor: number;
  currentHealth: number;
}): DamageResult {
  const scaled = input.isCrit ? input.attackDamage * input.critMultiplier : input.attackDamage;
  const finalDamage = Math.max(1, Math.round(scaled - input.armor));
  const remainingHealth = Math.max(0, input.currentHealth - finalDamage);

  return { finalDamage, remainingHealth, didDie: remainingHealth === 0 };
}
