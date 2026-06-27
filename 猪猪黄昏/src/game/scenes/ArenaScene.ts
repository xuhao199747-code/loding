import Phaser from "phaser";

import { slaughterhouseMap } from "../data/mapScene";

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super("arena");
  }

  create(): void {
    this.add.image(800, 450, slaughterhouseMap.baseTextureKey).setDisplaySize(1600, 900);

    for (const prop of slaughterhouseMap.props) {
      this.add.image(prop.x, prop.y, prop.textureKey).setDepth(prop.depth);
    }

    this.scene.launch("hud");
  }
}
