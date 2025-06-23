import { describe, expect, it } from "vitest";
import { calculateStat } from "./calculateStat";

describe("calculateStat", () => {
  it("レベル50、種族値65、個体値31、努力値0、性格補正なしの場合", () => {
    const result = calculateStat({
      baseStat: 65,
      iv: 31,
      ev: 0,
      level: 50,
      natureModifier: 1.0,
    });
    expect(result).toBe(85);
  });

  it("性格補正+10%の場合", () => {
    const result = calculateStat({
      baseStat: 49,
      iv: 31,
      ev: 252,
      level: 50,
      natureModifier: 1.1,
    });
    expect(result).toBe(111); // (69 + 31) * 1.1 = 110
  });

  it("性格補正-10%の場合", () => {
    const result = calculateStat({
      baseStat: 65,
      iv: 31,
      ev: 0,
      level: 50,
      natureModifier: 0.9,
    });
    expect(result).toBe(76); // 85 * 0.9 = 76.5 → 76
  });

  it("レベル100、性格補正ありの場合", () => {
    const result = calculateStat({
      baseStat: 49,
      iv: 31,
      ev: 0,
      level: 100,
      natureModifier: 1.1,
    });
    expect(result).toBe(147); // ((49*2 + 31) * 100 / 100 + 5) * 1.1 = 147.4 → 147
  });
});
