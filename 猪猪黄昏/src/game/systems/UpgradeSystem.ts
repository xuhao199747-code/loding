import { upgradeCatalog } from "../data/upgradeCatalog";
import type { PlayerProgressState } from "../types";

export function rollUpgradeChoices(count = 3) {
  return upgradeCatalog.slice(0, count);
}

export function applyUpgrade(state: PlayerProgressState, upgradeId: string): PlayerProgressState {
  switch (upgradeId) {
    case "cleaverTempering":
      return { ...state, attackDamage: state.attackDamage + 6 };
    case "openRibTechnique":
      return { ...state, critChance: state.critChance + 0.08 };
    case "coarseSalt":
      return { ...state, saltRadius: state.saltRadius + 35 };
    case "penReinforcement":
      return { ...state, trapDurationMs: state.trapDurationMs + 1200 };
    case "perfectHeat":
      return { ...state, burnEnabled: true };
    case "bloodRush":
      return { ...state, moveSpeed: state.moveSpeed + 25 };
    default:
      return state;
  }
}
