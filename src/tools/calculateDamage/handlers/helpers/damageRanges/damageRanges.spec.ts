import { describe, expect, it } from "vitest";
import { getDamageRanges } from "./damageRanges";

describe("getDamageRanges", () => {
  it("基本ダメージから16段階の乱数を生成する", () => {
    const ranges = getDamageRanges(100);
    expect(ranges).toHaveLength(16);
    expect(ranges[0]).toBe(85); // 100 * 0.85 = 85
    expect(ranges[15]).toBe(100); // 100 * 1.00 = 100
  });

  it("各乱数は昇順になっている", () => {
    const ranges = getDamageRanges(50);
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i]).toBeGreaterThanOrEqual(ranges[i - 1]);
    }
  });

  it("小数点以下は切り捨てられる", () => {
    const ranges = getDamageRanges(10);
    // 10 * 0.85 = 8.5 → 8
    // 10 * 0.86 = 8.6 → 8
    // 10 * 0.87 = 8.7 → 8
    expect(ranges[0]).toBe(8);
    expect(ranges[1]).toBe(8);
    expect(ranges[2]).toBe(8);
  });

  it("最小ダメージは1", () => {
    const ranges = getDamageRanges(1);
    expect(ranges.every((damage) => damage >= 1)).toBe(true);
  });

  it("ダメージが0の場合は全て0を返す", () => {
    const ranges = getDamageRanges(0);
    expect(ranges).toHaveLength(16);
    expect(ranges.every((damage) => damage === 0)).toBe(true);
  });
});
