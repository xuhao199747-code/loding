import Phaser from "phaser";

export class HudScene extends Phaser.Scene {
  private statsText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private upgradePanel?: Phaser.GameObjects.Container;
  private resultPanel?: Phaser.GameObjects.Container;

  constructor() {
    super("hud");
  }

  create(): void {
    this.statsText = this.add.text(18, 16, "", {
      color: "#f7dbac",
      fontSize: "24px",
      stroke: "#1e100b",
      strokeThickness: 4
    }).setScrollFactor(0);

    this.hintText = this.add.text(18, 820, "WASD移动 | Q旋斩 | E撒盐 | R陷阱", {
      color: "#d88e54",
      fontSize: "22px",
      stroke: "#1e100b",
      strokeThickness: 4
    });

    const arena = this.scene.get("arena");
    arena.events.on("hud:update", this.onHudUpdate, this);
    arena.events.on("hud:levelup", this.onLevelUp, this);
    arena.events.on("hud:result", this.onResult, this);
  }

  private onHudUpdate(payload: {
    hp: number;
    maxHp: number;
    wave: number;
    timeMs: number;
    coins: number;
    level: number;
    exp: number;
    expNeeded: number;
    cooldowns: Record<string, number>;
  }): void {
    const time = (payload.timeMs / 1000).toFixed(1);
    this.statsText.setText(
      `生命 ${payload.hp}/${payload.maxHp}\n波次 ${payload.wave}/10\n时间 ${time}s\n金币 ${payload.coins}\n等级 ${payload.level} 经验 ${payload.exp}/${payload.expNeeded}\nQ ${(payload.cooldowns.spin / 1000).toFixed(1)}s  E ${(payload.cooldowns.saltBurst / 1000).toFixed(1)}s  R ${(payload.cooldowns.pigPenTrap / 1000).toFixed(1)}s`
    );
  }

  private onLevelUp(payload: { level: number; choices: Array<{ id: string; label: string }> }): void {
    this.upgradePanel?.destroy();

    const bg = this.add.rectangle(1200, 330, 520, 320, 0x2e180f, 0.95).setStrokeStyle(4, 0xa46835);
    const title = this.add.text(1200, 220, `升级选择 Lv.${payload.level}`, {
      color: "#f4d7a6",
      fontSize: "32px"
    }).setOrigin(0.5);

    const entries = payload.choices.map((choice, index) =>
      this.add.text(980, 280 + index * 70, `${index + 1}. ${choice.label}`, {
        color: "#fff0d0",
        fontSize: "26px"
      })
    );

    const tip = this.add.text(1200, 425, "按数字 1 / 2 / 3 选择", {
      color: "#d58b52",
      fontSize: "22px"
    }).setOrigin(0.5);

    this.upgradePanel = this.add.container(0, 0, [bg, title, ...entries, tip]);

    const keys = ["ONE", "TWO", "THREE"] as const;
    keys.forEach((code, index) => {
      this.input.keyboard?.once(`keydown-${code}`, () => {
        this.scene.get("arena").events.emit("upgrade:selected", payload.choices[index].id);
        this.upgradePanel?.destroy();
        this.upgradePanel = undefined;
      });
    });
  }

  private onResult(payload: { victory: boolean; wave: number; coins: number; level: number }): void {
    this.resultPanel?.destroy();

    const bg = this.add.rectangle(800, 450, 600, 280, 0x1a0d08, 0.95).setStrokeStyle(5, 0xb56f36);
    const title = this.add.text(800, 370, payload.victory ? "猪王已宰" : "屠夫倒下了", {
      color: payload.victory ? "#f1c36c" : "#df7f67",
      fontSize: "44px"
    }).setOrigin(0.5);
    const body = this.add.text(800, 455, `到达波次 ${payload.wave}\n等级 ${payload.level}\n金币 ${payload.coins}`, {
      color: "#f4d7a6",
      fontSize: "28px",
      align: "center"
    }).setOrigin(0.5);
    const tip = this.add.text(800, 545, "刷新页面可重新开始", {
      color: "#d58b52",
      fontSize: "22px"
    }).setOrigin(0.5);

    this.resultPanel = this.add.container(0, 0, [bg, title, body, tip]);
  }
}
