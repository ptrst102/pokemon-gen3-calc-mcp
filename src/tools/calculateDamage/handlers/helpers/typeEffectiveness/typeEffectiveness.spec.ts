import { describe, expect, it } from "vitest";
import { getTypeEffectiveness } from "./typeEffectiveness";

describe("getTypeEffectiveness", () => {
  it("通常倍率（1倍）を返す", () => {
    expect(getTypeEffectiveness("ノーマル", ["かくとう"])).toBe(1);
    expect(getTypeEffectiveness("ほのお", ["でんき"])).toBe(1);
  });

  it("効果抜群（2倍）を返す", () => {
    expect(getTypeEffectiveness("ほのお", ["くさ"])).toBe(2);
    expect(getTypeEffectiveness("みず", ["ほのお"])).toBe(2);
    expect(getTypeEffectiveness("でんき", ["みず"])).toBe(2);
    expect(getTypeEffectiveness("くさ", ["みず"])).toBe(2);
  });

  it("効果いまひとつ（0.5倍）を返す", () => {
    expect(getTypeEffectiveness("ほのお", ["ほのお"])).toBe(0.5);
    expect(getTypeEffectiveness("みず", ["みず"])).toBe(0.5);
    expect(getTypeEffectiveness("くさ", ["くさ"])).toBe(0.5);
    expect(getTypeEffectiveness("でんき", ["でんき"])).toBe(0.5);
  });

  it("効果なし（0倍）を返す", () => {
    expect(getTypeEffectiveness("ノーマル", ["ゴースト"])).toBe(0);
    expect(getTypeEffectiveness("かくとう", ["ゴースト"])).toBe(0);
    expect(getTypeEffectiveness("でんき", ["じめん"])).toBe(0);
    expect(getTypeEffectiveness("どく", ["はがね"])).toBe(0);
  });

  it("複合タイプの場合、倍率を掛け合わせる", () => {
    // ほのお→くさ/どく = 2 * 1 = 2
    expect(getTypeEffectiveness("ほのお", ["くさ", "どく"])).toBe(2);

    // みず→ほのお/いわ = 2 * 2 = 4
    expect(getTypeEffectiveness("みず", ["ほのお", "いわ"])).toBe(4);

    // でんき→みず/ひこう = 2 * 2 = 4
    expect(getTypeEffectiveness("でんき", ["みず", "ひこう"])).toBe(4);

    // じめん→でんき/ひこう = 0 * 0 = 0
    expect(getTypeEffectiveness("じめん", ["でんき", "ひこう"])).toBe(0);

    // ほのお→みず/ドラゴン = 0.5 * 0.5 = 0.25
    expect(getTypeEffectiveness("ほのお", ["みず", "ドラゴン"])).toBe(0.25);
  });
});
