import Phaser from "phaser";

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super("arena");
  }

  create(): void {
    this.add.rectangle(800, 450, 1600, 900, 0x2f1812);
    this.add.text(800, 450, "屠宰场施工中", {
      color: "#f6ddae",
      fontSize: "38px"
    }).setOrigin(0.5);

    this.scene.launch("hud");
  }
}
