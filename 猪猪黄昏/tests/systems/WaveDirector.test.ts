import { describe, expect, it } from "vitest";

import { wavePlan } from "../../src/game/data/wavePlan";
import { WaveDirector } from "../../src/game/systems/WaveDirector";

describe("wave director", () => {
  it("starts on wave 1 and schedules a final boss on the last wave", () => {
    const director = new WaveDirector(wavePlan);
    expect(director.getCurrentWave().index).toBe(1);
    expect(wavePlan.at(-1)?.bossId).toBe("pigKing");
  });
});
