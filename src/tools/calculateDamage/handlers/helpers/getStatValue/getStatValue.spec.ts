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

  it("calculateAllEvsが指定された場合、EVの配列を返す", () => {
    const result = getStatValue({
      stat: {
        iv: 31,
        calculateAllEvs: true,
      },
      level: 50,
      statName: "atk",
      pokemonName: "ピカチュウ",
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(64); // 0〜252の4の倍数（64パターン）

    // 結果が昇順で並んでいることを確認
    const resultArray = result as number[];
    for (let i = 1; i < resultArray.length; i++) {
      expect(resultArray[i]).toBeGreaterThanOrEqual(resultArray[i - 1]);
    }

    // 最初と最後の値を確認（ピカチュウの攻撃種族値55、IV31、レベル50、性格補正なし）
    expect(resultArray[0]).toBe(75); // EV0の場合: ((55*2+31+0)*50/100)+5 = 75
    expect(resultArray[63]).toBe(107); // EV252の場合: ((55*2+31+63)*50/100)+5 = 107
  });
});
