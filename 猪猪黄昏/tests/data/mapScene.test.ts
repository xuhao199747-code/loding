import { describe, expect, it } from "vitest";

import { slaughterhouseMap } from "../../src/game/data/mapScene";

describe("slaughterhouse map definition", () => {
  it("points at layered map assets and metadata", () => {
    expect(slaughterhouseMap.baseTextureKey).toBe("map.slaughterhouse.base");
    expect(slaughterhouseMap.props.length).toBeGreaterThan(0);
    expect(slaughterhouseMap.spawnZones.length).toBeGreaterThanOrEqual(4);
    expect(slaughterhouseMap.playerSpawn).toEqual({ x: 800, y: 540 });
  });
});
