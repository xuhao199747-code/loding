import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create(): void {
    const title = this.add.text(800, 310, "猪猪黄昏", {
      color: "#f0b154",
      fontFamily: "serif",
      fontSize: "92px",
      stroke: "#24120c",
      strokeThickness: 10
    });
    title.setOrigin(0.5);

    const subtitle = this.add.text(800, 430, "屠夫黄昏守场，砍翻整座猪圈。", {
      color: "#f8dfb0",
      fontSize: "28px"
    });
    subtitle.setOrigin(0.5);

    const hint = this.add.text(800, 560, "按空格开始", {
      color: "#d98b4b",
      fontSize: "30px"
    });
    hint.setOrigin(0.5);

    this.tweens.add({
      targets: hint,
      alpha: 0.35,
      yoyo: true,
      repeat: -1,
      duration: 700
    });

    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start("arena"));
  }
}
