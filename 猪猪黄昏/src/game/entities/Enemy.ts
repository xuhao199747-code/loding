import Phaser from "phaser";

import type { EnemyDefinition } from "../types";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly definition: EnemyDefinition;
  currentHealth: number;
  private contactCooldownMs = 600;
  private contactElapsed = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, definition: EnemyDefinition) {
    super(scene, x, y, definition.textureKey);
    this.definition = definition;
    this.currentHealth = definition.maxHealth;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(definition.scale);
    this.setTint(definition.tint);
    this.setDepth(y);
  }

  update(deltaMs: number, target: Phaser.Math.Vector2): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const direction = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).normalize();
    body.setVelocity(direction.x * this.definition.speed, direction.y * this.definition.speed);
    this.contactElapsed += deltaMs;
    this.setDepth(this.y + 4);
  }

  canDealContactDamage(): boolean {
    return this.contactElapsed >= this.contactCooldownMs;
  }

  consumeContactDamage(): void {
    this.contactElapsed = 0;
  }
}
