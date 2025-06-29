import { describe, expect, it } from "vitest";
import { getStatValue } from "./getStatValue";

describe("getStatValue", () => {
  describe("正常系", () => {
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

  describe("異常系", () => {
    it("IV指定時にポケモン名が指定されていない場合、エラーを投げる", () => {
      expect(() =>
        getStatValue({
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          level: 50,
          statName: "atk",
          // pokemonNameを指定しない
        }),
      ).toThrowError("種族値の計算にはポケモン名が必要です");
    });

    it("存在しないポケモン名が指定された場合、エラーを投げる", () => {
      expect(() =>
        getStatValue({
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          level: 50,
          statName: "atk",
          pokemonName: "存在しないポケモン",
        }),
      ).toThrowError("ポケモン「存在しないポケモン」が見つかりません");
    });

    it("無効なステータス入力の場合、エラーを投げる", () => {
      expect(() =>
        getStatValue({
          // biome-ignore lint/suspicious/noExplicitAny: テストのため意図的に無効な型を使用
          stat: {} as any, // 空のオブジェクトは無効
          level: 50,
          statName: "atk",
        }),
      ).toThrowError("無効なステータス入力です");
    });

    it("IVのみ指定してEVが指定されていない場合、エラーを投げる", () => {
      expect(() =>
        getStatValue({
          stat: {
            iv: 31,
            // evが指定されていない
            // biome-ignore lint/suspicious/noExplicitAny: テストのため意図的に不完全な型を使用
          } as any,
          level: 50,
          statName: "atk",
          pokemonName: "ピカチュウ",
        }),
      ).toThrowError("無効なステータス入力です");
    });
  });
});
