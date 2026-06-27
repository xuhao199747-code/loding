import Phaser from "phaser";

import { playerConfig } from "../data/playerConfig";
import type { ActiveSkillId, PlayerProgressState } from "../types";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private autoAttackElapsed = 0;
  private readonly cooldowns = new Map<ActiveSkillId, number>();
  progress: PlayerProgressState = {
    attackDamage: playerConfig.autoWeapon.baseDamage,
    critChance: playerConfig.critChance,
    moveSpeed: playerConfig.moveSpeed,
    saltRadius: 150,
    trapDurationMs: 3000
  };
  currentHealth = playerConfig.maxHealth;
  maxHealth = playerConfig.maxHealth;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player.butcher.idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(y);
  }

  update(deltaMs: number): void {
    this.autoAttackElapsed += deltaMs;
    for (const [skill, remaining] of this.cooldowns.entries()) {
      this.cooldowns.set(skill, Math.max(0, remaining - deltaMs));
    }
    this.setDepth(this.y + 8);
  }

  setMovement(velocityX: number, velocityY: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(velocityX, velocityY);
  }

  canAutoAttack(): boolean {
    return this.autoAttackElapsed >= playerConfig.autoWeapon.attackRateMs;
  }

  consumeAutoAttack(): void {
    this.autoAttackElapsed = 0;
  }

  tryCast(skillId: ActiveSkillId): boolean {
    const remaining = this.cooldowns.get(skillId) ?? 0;
    if (remaining > 0) return false;
    const skill = playerConfig.activeSkills.find((entry) => entry.id === skillId);
    if (!skill) return false;
    this.cooldowns.set(skillId, skill.cooldownMs);
    return true;
  }

  getCooldownRemaining(skillId: ActiveSkillId): number {
    return this.cooldowns.get(skillId) ?? 0;
  }
}
