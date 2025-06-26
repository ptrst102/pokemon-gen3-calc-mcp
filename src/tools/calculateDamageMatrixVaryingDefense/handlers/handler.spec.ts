import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import { calculateDamageMatrixVaryingDefenseHandler } from "./handler";

describe("calculateDamageMatrixVaryingDefenseHandler", () => {
  it("防御側の努力値を総当たりしてダメージを計算する", async () => {
    const input = {
      move: "サイコキネシス",
      attacker: {
        pokemonName: "ラティオス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "キノガッサ",
        level: 50,
        isPhysicalDefense: false,
        stat: {
          iv: 31,
          natureModifier: "neutral",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingDefenseHandler(input);

    // レスポンスのチェック
    expect(response).toBeDefined();
    expect(response.content).toBeDefined();
    expect(response.content.length).toBeGreaterThan(0);
    expect(response.content[0].type).toBe("text");

    const result = parseResponse<{
      damageMatrix: Array<{
        ev: number;
        defenseStat: number;
        hpStat: number;
        damages: number[];
      }>;
    }>(response);

    // 努力値のパターン数を確認（0, 4, 12, ..., 252 = 33パターン）
    expect(result.damageMatrix).toHaveLength(33);

    // 最初のエントリ（努力値0）を確認
    const firstEntry = result.damageMatrix[0];
    expect(firstEntry.ev).toBe(0);
    expect(firstEntry.defenseStat).toBeGreaterThan(0);
    expect(firstEntry.hpStat).toBeGreaterThan(0);
    expect(firstEntry.damages).toHaveLength(16);
    expect(firstEntry.damages.every((d) => d > 0)).toBe(true);

    // 最後のエントリ（努力値252）を確認
    const lastEntry = result.damageMatrix[32];
    expect(lastEntry.ev).toBe(252);
    expect(lastEntry.defenseStat).toBeGreaterThan(firstEntry.defenseStat);

    // ダメージが努力値の増加と共に減少していることを確認
    const firstDamageMin = Math.min(...firstEntry.damages);
    const lastDamageMax = Math.max(...lastEntry.damages);
    expect(lastDamageMax).toBeLessThanOrEqual(firstDamageMin);
  });

  it("物理防御の計算も正しく行われる", async () => {
    const input = {
      move: "コメットパンチ",
      attacker: {
        pokemonName: "メタグロス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "エアームド",
        level: 50,
        isPhysicalDefense: true,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingDefenseHandler(input);
    const result = parseResponse<{
      damageMatrix: Array<{
        ev: number;
        defenseStat: number;
        damages: number[];
      }>;
    }>(response);

    // エアームドの防御実数値が正しく計算されていることを確認
    const maxDefenseEntry = result.damageMatrix.find((e) => e.ev === 252);
    expect(maxDefenseEntry).toBeDefined();
    if (maxDefenseEntry) {
      expect(maxDefenseEntry.defenseStat).toBeGreaterThan(200); // エアームドの防御は高い
    }
  });

  it("攻撃側の実数値を直接指定できる", async () => {
    const input = {
      move: {
        type: "みず" as const,
        power: 95,
      },
      attacker: {
        level: 50,
        stat: {
          value: 200,
        },
      },
      defender: {
        pokemonName: "リザードン",
        level: 50,
        isPhysicalDefense: false,
        stat: {
          iv: 31,
          natureModifier: "neutral",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingDefenseHandler(input);
    const result = parseResponse<{
      damageMatrix: Array<{
        ev: number;
        damages: number[];
      }>;
    }>(response);

    expect(result.damageMatrix).toHaveLength(33);
    expect(result.damageMatrix[0].damages.every((d) => d > 0)).toBe(true);
  });

  it("場の状態を考慮したダメージ計算ができる", async () => {
    const baseInput = {
      move: "サイコキネシス",
      attacker: {
        pokemonName: "フーディン",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "ハピナス",
        level: 50,
        isPhysicalDefense: false,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
    };

    // ひかりのかべなしの場合
    const responseWithoutScreen =
      await calculateDamageMatrixVaryingDefenseHandler(baseInput);
    const resultWithoutScreen = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithoutScreen);

    // ひかりのかべありの場合
    const responseWithScreen = await calculateDamageMatrixVaryingDefenseHandler(
      {
        ...baseInput,
        options: { lightScreen: true },
      },
    );
    const resultWithScreen = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithScreen);

    // ひかりのかべありの方がダメージが少ないことを確認
    const damageWithoutScreen = resultWithoutScreen.damageMatrix[0].damages[0];
    const damageWithScreen = resultWithScreen.damageMatrix[0].damages[0];
    expect(damageWithScreen).toBeLessThan(damageWithoutScreen);
  });

  it("努力値の刻み幅が正しい", async () => {
    const input = {
      move: "10まんボルト",
      attacker: {
        pokemonName: "サンダース",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "ギャラドス",
        level: 50,
        isPhysicalDefense: false,
        stat: {
          iv: 31,
          natureModifier: "neutral",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingDefenseHandler(input);
    const result = parseResponse<{
      damageMatrix: Array<{ ev: number }>;
    }>(response);

    // 努力値のパターンを確認
    const evValues = result.damageMatrix.map((e) => e.ev);
    expect(evValues[0]).toBe(0);
    expect(evValues[1]).toBe(4);
    expect(evValues[2]).toBe(12);
    expect(evValues[3]).toBe(20);
    expect(evValues[32]).toBe(252);

    // 努力値の増分を確認（最初以外は8ずつ増える）
    for (let i = 2; i < evValues.length; i++) {
      expect(evValues[i] - evValues[i - 1]).toBe(8);
    }
  });
});
