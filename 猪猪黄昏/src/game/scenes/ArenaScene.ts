import Phaser from "phaser";

import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { playerConfig } from "../data/playerConfig";
import { wavePlan } from "../data/wavePlan";
import { enemyCatalog } from "../data/enemyCatalog";
import { slaughterhouseMap } from "../data/mapScene";
import { resolveHit } from "../systems/CombatResolver";
import { expNeededForLevel } from "../systems/DropSystem";
import { WaveDirector } from "../systems/WaveDirector";
import { applyUpgrade, rollUpgradeChoices } from "../systems/UpgradeSystem";
import type { ActiveSkillId } from "../types";

export class ArenaScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<"W" | "A" | "S" | "D" | "Q" | "E" | "R", Phaser.Input.Keyboard.Key>;
  private enemies!: Phaser.Physics.Arcade.Group;
  private traps!: Phaser.GameObjects.Zone[];
  private waveDirector = new WaveDirector(wavePlan);
  private level = 1;
  private exp = 0;
  private coins = 0;
  private elapsedMs = 0;
  private gameEnded = false;
  private isLeveling = false;
  private lastChoices: Array<{ id: string; label: string }> = [];

  constructor() {
    super("arena");
  }

  create(): void {
    this.add.image(800, 450, slaughterhouseMap.baseTextureKey).setDisplaySize(1600, 900);

    for (const prop of slaughterhouseMap.props) {
      this.add.image(prop.x, prop.y, prop.textureKey).setDepth(prop.depth);
    }

    this.physics.world.setBounds(0, 0, 1600, 900);
    this.player = new Player(this, slaughterhouseMap.playerSpawn.x, slaughterhouseMap.playerSpawn.y);
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: false });
    this.traps = [];

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,S,D,Q,E,R") as Record<
      "W" | "A" | "S" | "D" | "Q" | "E" | "R",
      Phaser.Input.Keyboard.Key
    >;

    for (const blocker of slaughterhouseMap.blockers) {
      const zone = this.add.zone(blocker.x + blocker.width / 2, blocker.y + blocker.height / 2, blocker.width, blocker.height);
      this.physics.add.existing(zone, true);
      this.physics.add.collider(this.player, zone);
      this.physics.add.collider(this.enemies, zone);
    }

    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      const pig = enemy as Enemy;
      if (!pig.canDealContactDamage() || this.gameEnded || this.isLeveling) return;
      pig.consumeContactDamage();
      this.damagePlayer(pig.definition.damage);
    });

    this.events.on("upgrade:selected", this.onUpgradeSelected, this);
    this.scene.launch("hud");
    this.emitHudUpdate();
  }

  update(_: number, delta: number): void {
    if (this.gameEnded || this.isLeveling) {
      this.player.setMovement(0, 0);
      return;
    }

    this.elapsedMs += delta;
    this.handleMovement();
    this.player.update(delta);
    this.updateEnemies(delta);
    this.updateTraps(delta);
    this.runWaveSpawns(delta);
    this.tryAutoAttack();
    this.handleSkills();
    this.checkWaveAdvance();
    this.emitHudUpdate();
  }

  private handleMovement(): void {
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) dy += 1;

    const movement = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.player.progress.moveSpeed);
    this.player.setMovement(movement.x || 0, movement.y || 0);
  }

  private updateEnemies(delta: number): void {
    const target = new Phaser.Math.Vector2(this.player.x, this.player.y);
    for (const child of this.enemies.getChildren()) {
      (child as Enemy).update(delta, target);
    }
  }

  private runWaveSpawns(delta: number): void {
    const instructions = this.waveDirector.update(delta, this.enemies.countActive(true));

    for (const instruction of instructions) {
      const zone = Phaser.Utils.Array.GetRandom(slaughterhouseMap.spawnZones);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const x = zone.x + Math.cos(angle) * Phaser.Math.Between(0, zone.radius);
      const y = zone.y + Math.sin(angle) * Phaser.Math.Between(0, zone.radius);
      const def = enemyCatalog[instruction.enemyId];
      const enemy = new Enemy(this, x, y, def);
      this.enemies.add(enemy);
      if (instruction.isBoss) {
        enemy.setScale(def.scale);
      }
    }
  }

  private tryAutoAttack(): void {
    if (!this.player.canAutoAttack()) return;

    const nearest = this.findNearestEnemy(playerConfig.autoWeapon.range);
    if (!nearest) return;

    this.player.consumeAutoAttack();
    this.hitEnemy(nearest, this.player.progress.attackDamage);
  }

  private handleSkills(): void {
    if (Phaser.Input.Keyboard.JustDown(this.wasd.Q)) this.castSkill("spin");
    if (Phaser.Input.Keyboard.JustDown(this.wasd.E)) this.castSkill("saltBurst");
    if (Phaser.Input.Keyboard.JustDown(this.wasd.R)) this.castSkill("pigPenTrap");
  }

  private castSkill(skillId: ActiveSkillId): void {
    if (!this.player.tryCast(skillId)) return;

    if (skillId === "spin") {
      this.add.image(this.player.x, this.player.y, "skill.spin").setScale(1.1).setAlpha(0.65);
      this.damageEnemiesInRadius(125, 55);
    }

    if (skillId === "saltBurst") {
      this.add.image(this.player.x, this.player.y, "skill.saltBurst").setScale(1.15).setAlpha(0.7);
      this.damageEnemiesInRadius(this.player.progress.saltRadius, 40);
    }

    if (skillId === "pigPenTrap") {
      const trap = this.add.zone(this.player.x, this.player.y, 112, 112);
      trap.setData("radius", 56);
      const trapSprite = this.add.image(this.player.x, this.player.y, "skill.trap").setAlpha(0.5).setDepth(this.player.y - 1);
      this.traps.push(trap);
      this.time.delayedCall(this.player.progress.trapDurationMs, () => {
        trap.destroy();
        trapSprite.destroy();
        this.traps = this.traps.filter((entry) => entry !== trap);
      });
    }
  }

  private updateTraps(delta: number): void {
    void delta;
    for (const trap of this.traps) {
      const trapRadius = (trap.getData("radius") as number | undefined) ?? 56;
      for (const child of this.enemies.getChildren()) {
        const enemy = child as Enemy;
        if (Phaser.Math.Distance.Between(trap.x, trap.y, enemy.x, enemy.y) <= trapRadius) {
          const body = enemy.body as Phaser.Physics.Arcade.Body;
          body.velocity.scale(0.92);
          this.hitEnemy(enemy, 0.2);
        }
      }
    }
  }

  private findNearestEnemy(maxRange: number): Enemy | null {
    let nearest: Enemy | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const child of this.enemies.getChildren()) {
      const enemy = child as Enemy;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (distance < bestDistance && distance <= maxRange) {
        bestDistance = distance;
        nearest = enemy;
      }
    }

    return nearest;
  }

  private damageEnemiesInRadius(radius: number, damage: number): void {
    for (const child of this.enemies.getChildren()) {
      const enemy = child as Enemy;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) <= radius) {
        this.hitEnemy(enemy, damage);
      }
    }
  }

  private hitEnemy(enemy: Enemy, attackDamage: number): void {
    const isCrit = Math.random() < this.player.progress.critChance;
    const result = resolveHit({
      attackDamage,
      critMultiplier: 1.65,
      isCrit,
      armor: enemy.definition.armor,
      currentHealth: enemy.currentHealth
    });
    enemy.currentHealth = result.remainingHealth;
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(90, () => enemy.active && enemy.setTint(enemy.definition.tint));

    if (result.didDie) {
      this.onEnemyKilled(enemy);
    }
  }

  private onEnemyKilled(enemy: Enemy): void {
    this.exp += enemy.definition.expDrop;
    this.coins += enemy.definition.coinDrop;
    enemy.destroy();
    this.maybeLevelUp();
  }

  private maybeLevelUp(): void {
    const needed = expNeededForLevel(this.level);
    if (this.exp < needed) return;

    this.exp -= needed;
    this.level += 1;
    this.isLeveling = true;
    this.lastChoices = rollUpgradeChoices(3).map((choice) => ({ id: choice.id, label: choice.label }));
    this.events.emit("hud:levelup", { level: this.level, choices: this.lastChoices });
  }

  private onUpgradeSelected(choiceId: string): void {
    this.player.progress = applyUpgrade(this.player.progress, choiceId);
    this.isLeveling = false;
    this.emitHudUpdate();
  }

  private checkWaveAdvance(): void {
    const livingCount = this.enemies.countActive(true);

    if (this.waveDirector.isFinalWaveComplete(livingCount)) {
      this.endRun(true);
      return;
    }

    if (this.waveDirector.canAdvance(livingCount)) {
      const nextWave = this.waveDirector.advanceWave();
      if (nextWave) {
        this.emitHudUpdate();
      }
    }
  }

  private damagePlayer(amount: number): void {
    this.player.currentHealth = Math.max(0, this.player.currentHealth - amount);
    if (this.player.currentHealth <= 0) {
      this.endRun(false);
    }
  }

  private endRun(victory: boolean): void {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.player.setMovement(0, 0);
    this.events.emit("hud:result", {
      victory,
      wave: this.waveDirector.getWaveNumber(),
      coins: this.coins,
      level: this.level
    });
  }

  private emitHudUpdate(): void {
    this.events.emit("hud:update", {
      hp: this.player.currentHealth,
      maxHp: this.player.maxHealth,
      wave: this.waveDirector.getWaveNumber(),
      timeMs: this.elapsedMs,
      coins: this.coins,
      level: this.level,
      exp: this.exp,
      expNeeded: expNeededForLevel(this.level),
      cooldowns: {
        spin: this.player.getCooldownRemaining("spin"),
        saltBurst: this.player.getCooldownRemaining("saltBurst"),
        pigPenTrap: this.player.getCooldownRemaining("pigPenTrap")
      }
    });
  }
}
