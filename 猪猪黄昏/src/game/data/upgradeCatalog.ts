export const upgradeCatalog = [
  { id: "cleaverTempering", label: "屠刀淬炼", kind: "stat", attackDamageDelta: 6 },
  { id: "openRibTechnique", label: "开膛熟练", kind: "stat", critChanceDelta: 0.08 },
  { id: "coarseSalt", label: "粗盐增量", kind: "skill", saltRadiusDelta: 35 },
  { id: "penReinforcement", label: "猪圈加固", kind: "skill", trapDurationMsDelta: 1200 },
  { id: "perfectHeat", label: "火候正好", kind: "skill", addsBurn: true },
  { id: "bloodRush", label: "血气上涌", kind: "stat", moveSpeedDelta: 25 }
] as const;
