import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import { calculateDamageMatrixVaryingAttackHandler } from "./handler";

describe("calculateDamageMatrixVaryingAttackHandler", () => {
  it("攻撃側の努力値を総当たりしてダメージを計算する", async () => {
    const input = {
      move: "コメットパンチ",
      attacker: {
        pokemonName: "メタグロス",
        level: 50,
        isPhysicalAttack: true,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "ハピナス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingAttackHandler(input);
    const result = parseResponse<{
      damageMatrix: Array<{
        ev: number;
        attackStat: number;
        damages: number[];
      }>;
    }>(response);

    // 努力値のパターン数を確認（0, 4, 12, ..., 252 = 33パターン）
    expect(result.damageMatrix).toHaveLength(33);

    // 最初のエントリ（努力値0）を確認
    const firstEntry = result.damageMatrix[0];
    expect(firstEntry.ev).toBe(0);
    expect(firstEntry.attackStat).toBeGreaterThan(0);
    expect(firstEntry.damages).toHaveLength(16);
    expect(firstEntry.damages.every((d) => d > 0)).toBe(true);

    // 最後のエントリ（努力値252）を確認
    const lastEntry = result.damageMatrix[32];
    expect(lastEntry.ev).toBe(252);
    expect(lastEntry.attackStat).toBeGreaterThan(firstEntry.attackStat);

    // ダメージが努力値の増加と共に増加していることを確認
    const firstDamageMax = Math.max(...firstEntry.damages);
    const lastDamageMin = Math.min(...lastEntry.damages);
    expect(lastDamageMin).toBeGreaterThanOrEqual(firstDamageMax);
  });

  it("特殊攻撃の計算も正しく行われる", async () => {
    const input = {
      move: "サイコキネシス",
      attacker: {
        pokemonName: "ラティオス",
        level: 50,
        isPhysicalAttack: false,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "ハピナス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
    };

    const response = await calculateDamageMatrixVaryingAttackHandler(input);
    const result = parseResponse<{
      damageMatrix: Array<{
        ev: number;
        attackStat: number;
        damages: number[];
      }>;
    }>(response);

    // ラティオスの特攻実数値が正しく計算されていることを確認
    const maxAttackEntry = result.damageMatrix.find((e) => e.ev === 252);
    expect(maxAttackEntry).toBeDefined();
    if (maxAttackEntry) {
      expect(maxAttackEntry.attackStat).toBeGreaterThan(170); // ラティオスの特攻は高い
    }
  });

  it("防御側の実数値を直接指定できる", async () => {
    const input = {
      move: {
        type: "でんき" as const,
        power: 95,
      },
      attacker: {
        pokemonName: "サンダース",
        level: 50,
        isPhysicalAttack: false,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
      defender: {
        level: 50,
        stat: {
          value: 150,
        },
      },
    };

    const response = await calculateDamageMatrixVaryingAttackHandler(input);
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
      move: "ハイドロポンプ",
      attacker: {
        pokemonName: "カイオーガ",
        level: 50,
        isPhysicalAttack: false,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "グラードン",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
      },
    };

    // あめなしの場合
    const responseWithoutRain =
      await calculateDamageMatrixVaryingAttackHandler(baseInput);
    const resultWithoutRain = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithoutRain);

    // あめありの場合
    const responseWithRain = await calculateDamageMatrixVaryingAttackHandler({
      ...baseInput,
      options: { weather: "あめ" },
    });
    const resultWithRain = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithRain);

    // あめありの方がダメージが多いことを確認
    const damageWithoutRain = resultWithoutRain.damageMatrix[32].damages[0];
    const damageWithRain = resultWithRain.damageMatrix[32].damages[0];
    expect(damageWithRain).toBeGreaterThan(damageWithoutRain);
  });

  it("もちものの効果が適用される", async () => {
    const baseInput = {
      move: "じしん",
      attacker: {
        pokemonName: "ボーマンダ",
        level: 50,
        isPhysicalAttack: true,
        stat: {
          iv: 31,
          natureModifier: "up",
        },
      },
      defender: {
        pokemonName: "メタグロス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "neutral",
        },
      },
    };

    // こだわりハチマキなしの場合
    const responseWithoutItem =
      await calculateDamageMatrixVaryingAttackHandler(baseInput);
    const resultWithoutItem = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithoutItem);

    // こだわりハチマキありの場合
    const responseWithItem = await calculateDamageMatrixVaryingAttackHandler({
      ...baseInput,
      attacker: {
        ...baseInput.attacker,
        item: "こだわりハチマキ",
      },
    });
    const resultWithItem = parseResponse<{
      damageMatrix: Array<{ damages: number[] }>;
    }>(responseWithItem);

    // こだわりハチマキありの方がダメージが多いことを確認
    const damageWithoutItem = resultWithoutItem.damageMatrix[32].damages[0];
    const damageWithItem = resultWithItem.damageMatrix[32].damages[0];
    expect(damageWithItem).toBeGreaterThan(damageWithoutItem);
  });
});
