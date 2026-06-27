import Phaser from "phaser";

import { slaughterhouseMap } from "../data/mapScene";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload(): void {
    this.load.image(slaughterhouseMap.baseTextureKey, slaughterhouseMap.baseTexturePath);
    this.load.image("player.butcher.idle", "assets/sprites/player/butcher.png");
    this.load.image("skill.spin", "assets/sprites/fx/spin-slash.png");
    this.load.image("skill.saltBurst", "assets/sprites/fx/salt-burst.png");
    this.load.image("skill.trap", "assets/sprites/fx/trap-ring.png");

    for (const prop of slaughterhouseMap.props) {
      this.load.image(prop.textureKey, prop.texturePath);
    }

    this.load.image("enemy.fatPig", "assets/sprites/enemies/fat-pig.png");
    this.load.image("enemy.leanPig", "assets/sprites/enemies/lean-pig.png");
    this.load.image("enemy.forkPig", "assets/sprites/enemies/fork-pig.png");
    this.load.image("enemy.helmetPig", "assets/sprites/enemies/helmet-pig.png");
    this.load.image("enemy.chargePig", "assets/sprites/enemies/charge-pig.png");
    this.load.image("enemy.feedPig", "assets/sprites/enemies/feed-pig.png");
    this.load.image("enemy.elitePenPig", "assets/sprites/enemies/elite-pen-pig.png");
    this.load.image("enemy.pigKing", "assets/sprites/boss/pig-king.png");
  }

  create(): void {
    this.scene.start("menu");
  }
}
