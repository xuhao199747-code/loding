import type { SpawnInstruction, WaveDefinition } from "../types";

export class WaveDirector {
  private currentIndex = 0;
  private spawnedInWave = 0;
  private spawnElapsed = 0;
  private bossSpawned = false;

  constructor(private readonly waves: readonly WaveDefinition[]) {}

  getCurrentWave(): WaveDefinition {
    return this.waves[this.currentIndex];
  }

  getWaveNumber(): number {
    return this.getCurrentWave().index;
  }

  update(deltaMs: number, livingEnemyCount: number): SpawnInstruction[] {
    const current = this.getCurrentWave();

    if (current.bossId) {
      if (!this.bossSpawned && livingEnemyCount === 0) {
        this.bossSpawned = true;
        return [{ enemyId: current.bossId, bossId: current.bossId, isBoss: true }];
      }
      return [];
    }

    this.spawnElapsed += deltaMs;
    const spawns: SpawnInstruction[] = [];

    while (this.spawnedInWave < current.spawnBudget && this.spawnElapsed >= current.spawnIntervalMs) {
      this.spawnElapsed -= current.spawnIntervalMs;
      this.spawnedInWave += 1;
      const enemyId = current.enemies[(this.spawnedInWave - 1) % current.enemies.length];
      spawns.push({ enemyId, isBoss: false });
    }

    return spawns;
  }

  canAdvance(livingEnemyCount: number): boolean {
    const current = this.getCurrentWave();
    if (current.bossId) {
      return this.bossSpawned && livingEnemyCount === 0;
    }

    return this.spawnedInWave >= current.spawnBudget && livingEnemyCount === 0;
  }

  advanceWave(): WaveDefinition | null {
    this.currentIndex += 1;
    this.spawnedInWave = 0;
    this.spawnElapsed = 0;
    this.bossSpawned = false;
    return this.waves[this.currentIndex] ?? null;
  }

  isFinalWaveComplete(livingEnemyCount: number): boolean {
    return this.currentIndex >= this.waves.length - 1 && this.bossSpawned && livingEnemyCount === 0;
  }
}
