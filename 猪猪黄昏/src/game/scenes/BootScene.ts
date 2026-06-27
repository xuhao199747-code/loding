import Phaser from "phaser";

import { slaughterhouseMap } from "../data/mapScene";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload(): void {
    this.load.image(slaughterhouseMap.baseTextureKey, slaughterhouseMap.baseTexturePath);

    for (const prop of slaughterhouseMap.props) {
      this.load.image(prop.textureKey, prop.texturePath);
    }
  }

  create(): void {
    this.scene.start("menu");
  }
}
