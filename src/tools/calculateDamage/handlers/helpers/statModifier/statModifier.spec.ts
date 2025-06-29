import { describe, expect, it } from "vitest";
import { getStatModifierRatio } from "./statModifier";

describe("getStatModifierRatio", () => {
  it("有効な能力ランクで正しい倍率を返す", () => {
    // 代表的な値のみテスト
    expect(getStatModifierRatio(0)).toEqual({ numerator: 2, denominator: 2 });
    expect(getStatModifierRatio(2)).toEqual({ numerator: 4, denominator: 2 });
    expect(getStatModifierRatio(-2)).toEqual({ numerator: 2, denominator: 4 });
    expect(getStatModifierRatio(6)).toEqual({ numerator: 8, denominator: 2 });
    expect(getStatModifierRatio(-6)).toEqual({ numerator: 2, denominator: 8 });
  });

  it("範囲外の値でデフォルト値を返す", () => {
    expect(getStatModifierRatio(7)).toEqual({ numerator: 2, denominator: 2 });
    expect(getStatModifierRatio(-7)).toEqual({ numerator: 2, denominator: 2 });
  });
});
