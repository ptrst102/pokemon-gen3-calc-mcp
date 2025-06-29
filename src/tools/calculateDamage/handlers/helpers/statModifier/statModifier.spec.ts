import { describe, expect, it } from "vitest";
import { getStatModifierRatio } from "./statModifier";

describe("getStatModifierRatio", () => {
  describe("正常系: 有効な能力ランク", () => {
    it("能力ランク0の場合、分子2・分母2を返す", () => {
      expect(getStatModifierRatio(0)).toEqual({ numerator: 2, denominator: 2 });
    });

    it("能力ランク+1〜+6の場合、正しい分子・分母を返す", () => {
      expect(getStatModifierRatio(1)).toEqual({ numerator: 3, denominator: 2 });
      expect(getStatModifierRatio(2)).toEqual({ numerator: 4, denominator: 2 });
      expect(getStatModifierRatio(3)).toEqual({ numerator: 5, denominator: 2 });
      expect(getStatModifierRatio(4)).toEqual({ numerator: 6, denominator: 2 });
      expect(getStatModifierRatio(5)).toEqual({ numerator: 7, denominator: 2 });
      expect(getStatModifierRatio(6)).toEqual({ numerator: 8, denominator: 2 });
    });

    it("能力ランク-1〜-6の場合、正しい分子・分母を返す", () => {
      expect(getStatModifierRatio(-1)).toEqual({ numerator: 2, denominator: 3 });
      expect(getStatModifierRatio(-2)).toEqual({ numerator: 2, denominator: 4 });
      expect(getStatModifierRatio(-3)).toEqual({ numerator: 2, denominator: 5 });
      expect(getStatModifierRatio(-4)).toEqual({ numerator: 2, denominator: 6 });
      expect(getStatModifierRatio(-5)).toEqual({ numerator: 2, denominator: 7 });
      expect(getStatModifierRatio(-6)).toEqual({ numerator: 2, denominator: 8 });
    });
  });

  describe("境界値: 無効な能力ランク", () => {
    it("能力ランクの範囲外（+7）の場合、デフォルト値（分子2・分母2）を返す", () => {
      expect(getStatModifierRatio(7)).toEqual({ numerator: 2, denominator: 2 });
    });

    it("能力ランクの範囲外（-7）の場合、デフォルト値（分子2・分母2）を返す", () => {
      expect(getStatModifierRatio(-7)).toEqual({ numerator: 2, denominator: 2 });
    });

    it("数値以外が渡された場合でも、デフォルト値（分子2・分母2）を返す", () => {
      expect(getStatModifierRatio(999)).toEqual({ numerator: 2, denominator: 2 });
      expect(getStatModifierRatio(-999)).toEqual({ numerator: 2, denominator: 2 });
    });
  });
});
