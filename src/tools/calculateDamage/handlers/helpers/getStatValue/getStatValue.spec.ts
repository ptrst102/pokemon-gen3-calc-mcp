import { describe, expect, it } from "vitest";
import { getStatValue } from "./getStatValue";

describe("getStatValue", () => {
  it("実数値が直接指定された場合、その値を返す", () => {
    const result = getStatValue({
      stat: { value: 150 },
      level: 50,
      statName: "atk",
    });
    expect(result).toBe(150);
  });

  it("ポケモン名とIV/EVが指定された場合、ステータスを計算する", () => {
    const result = getStatValue({
      stat: {
        iv: 31,
        ev: 252,
        natureModifier: "neutral",
      },
      level: 50,
      statName: "atk",
      pokemonName: "ピカチュウ",
    });
    // ピカチュウの攻撃種族値55、IV31、EV252、レベル50、性格補正なしの場合
    // ((55 * 2 + 31 + 63) * 50 / 100) + 5 = 107
    expect(result).toBe(107);
  });

  it("性格補正が適用される", () => {
    const result = getStatValue({
      stat: {
        iv: 31,
        ev: 252,
        natureModifier: "up",
      },
      level: 50,
      statName: "atk",
      pokemonName: "ピカチュウ",
    });
    // 107 * 1.1 = 117.7 → 117
    expect(result).toBe(117);
  });

});
