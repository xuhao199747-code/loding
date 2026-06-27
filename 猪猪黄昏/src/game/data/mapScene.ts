export type SceneMapDefinition = {
  baseTextureKey: string;
  baseTexturePath: string;
  playerSpawn: { x: number; y: number };
  spawnZones: Array<{ id: string; x: number; y: number; radius: number }>;
  props: Array<{ textureKey: string; texturePath: string; x: number; y: number; depth: number }>;
  blockers: Array<{ x: number; y: number; width: number; height: number }>;
};

export const slaughterhouseMap: SceneMapDefinition = {
  baseTextureKey: "map.slaughterhouse.base",
  baseTexturePath: "assets/map/slaughterhouse-base.png",
  playerSpawn: { x: 800, y: 540 },
  spawnZones: [
    { id: "north-gate", x: 790, y: 130, radius: 120 },
    { id: "west-pen", x: 180, y: 460, radius: 110 },
    { id: "east-yard", x: 1430, y: 470, radius: 120 },
    { id: "south-mud", x: 790, y: 820, radius: 120 }
  ],
  props: [
    {
      textureKey: "prop.hook-rack",
      texturePath: "assets/sprites/props/hook-rack.png",
      x: 170,
      y: 360,
      depth: 360
    },
    {
      textureKey: "prop.feed-barrel",
      texturePath: "assets/sprites/props/feed-barrel.png",
      x: 210,
      y: 745,
      depth: 745
    },
    {
      textureKey: "prop.warning-board",
      texturePath: "assets/sprites/props/warning-board.png",
      x: 305,
      y: 520,
      depth: 520
    },
    {
      textureKey: "prop.neon-sign",
      texturePath: "assets/sprites/props/neon-sign.png",
      x: 1170,
      y: 300,
      depth: 300
    },
    {
      textureKey: "prop.rust-barrel",
      texturePath: "assets/sprites/props/rust-barrel.png",
      x: 1250,
      y: 640,
      depth: 640
    }
  ],
  blockers: [
    { x: 130, y: 320, width: 170, height: 180 },
    { x: 215, y: 665, width: 130, height: 100 },
    { x: 1090, y: 240, width: 250, height: 180 },
    { x: 1200, y: 585, width: 120, height: 110 }
  ]
};
