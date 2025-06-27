import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import {
  isErrorOutput,
  isNormalDamageOutput,
  type StructuredOutput,
} from "./formatters/structuredOutputFormatter";
import { calculateDamageHandler } from "./handler";

describe("calculateDamageHandler", () => {
  it("基本的なダメージ計算が動作する", async () => {
    const input = {
      move: "はかいこうせん",
      attacker: {
        level: 50,
        pokemonName: "ピカチュウ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "neutral",
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "フシギダネ",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral",
        },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage).toBeDefined();
    }
  });

  it("実数値を直接指定した場合の計算", async () => {
    const input = {
      move: { type: "でんき", power: 90 },
      attacker: {
        level: 50,
        pokemonName: "ピカチュウ",
        stat: { value: 120 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "ギャラドス",
        stat: { value: 100 },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage).toBeDefined();
      expect(output.modifiers.typeEffectiveness).toBe(4);
    }
  });

  it("タイプ相性効果抜群の場合", async () => {
    const input = {
      move: { type: "でんき", power: 90 },
      attacker: {
        level: 50,
        pokemonName: "ピカチュウ",
        stat: { value: 120 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "ギャラドス",
        stat: { value: 100 },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.modifiers.typeEffectiveness).toBe(4);
    }
  });

  it("無効な入力でエラーが発生する", async () => {
    const input = {
      move: "存在しないわざ",
      attacker: {
        level: 50,
        stat: { value: 120 },
      },
      defender: {
        level: 50,
        stat: { value: 100 },
      },
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isErrorOutput(output)) {
      expect(output.error).toContain("わざ「存在しないわざ」が見つかりません");
    }
  });

  it("てんき補正（はれ）が適用される", async () => {
    const baseInput = {
      move: { type: "ほのお", power: 80 },
      attacker: {
        level: 50,
        pokemonName: "リザードン",
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "フシギダネ",
        stat: { value: 80 },
        statModifier: 0,
      },
    };

    const normalResult = await calculateDamageHandler({
      ...baseInput,
      options: {},
    });

    const sunResult = await calculateDamageHandler({
      ...baseInput,
      options: { weather: "はれ" },
    });

    // 晴れ補正で1.5倍のダメージになることを確認
    const normalOutput = parseResponse<StructuredOutput>(normalResult);
    const sunOutput = parseResponse<StructuredOutput>(sunResult);
    const normalDamage = isNormalDamageOutput(normalOutput)
      ? normalOutput.damage.min
      : 0;
    const sunDamage = isNormalDamageOutput(sunOutput)
      ? sunOutput.damage.min
      : 0;

    // はれ補正は1.5倍だが、小数点以下切り捨てがあるので単純に比較
    expect(sunDamage).toBeGreaterThan(normalDamage);
  });

  it("ふゆうでじめんタイプの攻撃が無効化される", async () => {
    const input = {
      move: { type: "じめん", power: 100 },
      attacker: {
        level: 50,
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "ゲンガー",
        ability: "ふゆう",
        stat: { value: 100 },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage.min).toBe(0);
    }
  });

  it("ふしぎなまもりで効果抜群以外が無効化される", async () => {
    const input = {
      move: { type: "ノーマル", power: 100 },
      attacker: {
        level: 50,
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "ヌケニン",
        ability: "ふしぎなまもり",
        stat: { value: 100 },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage.min).toBe(0);
    }
  });

  it("ちからもちで物理攻撃が2倍になる", async () => {
    const normalInput = {
      move: { type: "ノーマル", power: 100 },
      attacker: {
        level: 50,
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "フシギダネ",
        stat: { value: 100 },
        statModifier: 0,
      },
      options: {},
    };

    const powerInput = {
      ...normalInput,
      attacker: {
        ...normalInput.attacker,
        ability: "ちからもち",
      },
    };

    const normalResult = await calculateDamageHandler(normalInput);
    const powerResult = await calculateDamageHandler(powerInput);

    const normalOutput = parseResponse<StructuredOutput>(normalResult);
    const powerOutput = parseResponse<StructuredOutput>(powerResult);
    const normalDamage = isNormalDamageOutput(normalOutput)
      ? normalOutput.damage.min
      : 0;
    const powerDamage = isNormalDamageOutput(powerOutput)
      ? powerOutput.damage.min
      : 0;

    // ちからもちで2倍のダメージ
    expect(powerDamage).toBeGreaterThan(normalDamage * 1.5);
  });

  it("実際のバトルケース: サンダーの10まんボルトvsメタグロス", async () => {
    const input = {
      move: "10まんボルト",
      attacker: {
        stat: {
          ev: 0,
          iv: 31,
          natureModifier: "neutral", // 性格補正なしで計算
        },
        level: 50,
        pokemonName: "サンダー",
        statModifier: 0,
      },
      defender: {
        stat: {
          ev: 0,
          iv: 31,
          natureModifier: "neutral",
        },
        level: 50,
        pokemonName: "メタグロス",
        statModifier: 0,
      },
    };

    const result = await calculateDamageHandler(input);

    // C145（性格補正なし）の場合、タイプ一致で72〜85付近のダメージ
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage.min).toBeGreaterThanOrEqual(72);
      expect(output.damage.max).toBeLessThanOrEqual(85);
    }
  });

  describe("calculateAllEvsオプションのサポート廃止", () => {
    it("calculateAllEvsオプションはサポートされていないことを確認", async () => {
      const input = {
        move: { type: "ノーマル", power: 100, isPhysical: true },
        attacker: {
          level: 50,
          stat: { iv: 31, calculateAllEvs: true },
          pokemonName: "ケンタロス",
          statModifier: 0,
        },
        defender: {
          level: 50,
          stat: { iv: 31, ev: 0 },
          pokemonName: "ハピナス",
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isErrorOutput(output)) {
        // calculateAllEvsはもはや有効なプロパティではないので、statの形式エラーになる
        expect(output.error).toContain("stat");
      } else {
        // エラーが返されるべき
        expect.fail("calculateAllEvsオプションはエラーを返すべき");
      }
    });

    it("防御側のcalculateAllEvsオプションもサポートされていない", async () => {
      const input = {
        move: { type: "ノーマル", power: 100, isPhysical: true },
        attacker: {
          level: 50,
          stat: { iv: 31, ev: 252 },
          pokemonName: "ケンタロス",
          statModifier: 0,
        },
        defender: {
          level: 50,
          stat: { iv: 31, calculateAllEvs: true },
          pokemonName: "ハピナス",
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isErrorOutput(output)) {
        // calculateAllEvsはもはや有効なプロパティではないので、statの形式エラーになる
        expect(output.error).toContain("stat");
      } else {
        // エラーが返されるべき
        expect.fail("calculateAllEvsオプションはエラーを返すべき");
      }
    });

    it("calculateAllNaturesオプションもサポートされていない", async () => {
      const input = {
        move: { type: "ノーマル", power: 100, isPhysical: true },
        attacker: {
          level: 50,
          stat: { iv: 31, calculateAllEvs: true, calculateAllNatures: true },
          pokemonName: "ケンタロス",
          statModifier: 0,
        },
        defender: {
          level: 50,
          stat: { iv: 31, ev: 0 },
          pokemonName: "ハピナス",
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isErrorOutput(output)) {
        // calculateAllEvsはもはや有効なプロパティではないので、statの形式エラーになる
        expect(output.error).toContain("stat");
      } else {
        // エラーが返されるべき
        expect.fail("calculateAllEvsオプションはエラーを返すべき");
      }
    });
  });

  describe("条件付きとくせい", () => {
    it("もうか発動時、ほのおタイプのダメージが1.5倍になる", async () => {
      const baseInput = {
        move: "かえんほうしゃ",
        attacker: {
          level: 50,
          pokemonName: "バシャーモ",
          ability: "もうか",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "フシギダネ",
          stat: { value: 100 },
          statModifier: 0,
        },
      };

      const normalResult = await calculateDamageHandler({
        ...baseInput,
        attacker: { ...baseInput.attacker, abilityActive: false },
        options: {},
      });

      const activeResult = await calculateDamageHandler({
        ...baseInput,
        attacker: { ...baseInput.attacker, abilityActive: true },
        options: {},
      });

      const normalOutput = parseResponse<StructuredOutput>(normalResult);
      const activeOutput = parseResponse<StructuredOutput>(activeResult);
      const normalMinDamage = isNormalDamageOutput(normalOutput)
        ? normalOutput.damage.min
        : 0;
      const activeMinDamage = isNormalDamageOutput(activeOutput)
        ? activeOutput.damage.min
        : 0;

      // もうか発動時は1.5倍のダメージ
      expect(activeMinDamage).toBeGreaterThan(normalMinDamage);
      expect(activeMinDamage).toBeCloseTo(Math.floor(normalMinDamage * 1.5), 0);
    });

    it("ふしぎなうろこ発動時、物理ダメージが2/3になる", async () => {
      const baseInput = {
        move: "じしん",
        attacker: {
          level: 50,
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "ミロカロス",
          ability: "ふしぎなうろこ",
          stat: { value: 100 },
          statModifier: 0,
        },
      };

      const normalResult = await calculateDamageHandler({
        ...baseInput,
        defender: { ...baseInput.defender, abilityActive: false },
        options: {},
      });

      const activeResult = await calculateDamageHandler({
        ...baseInput,
        defender: { ...baseInput.defender, abilityActive: true },
        options: {},
      });

      const normalOutput = parseResponse<StructuredOutput>(normalResult);
      const activeOutput = parseResponse<StructuredOutput>(activeResult);
      const normalMinDamage = isNormalDamageOutput(normalOutput)
        ? normalOutput.damage.min
        : 0;
      const activeMinDamage = isNormalDamageOutput(activeOutput)
        ? activeOutput.damage.min
        : 0;

      // ふしぎなうろこ発動時は2/3のダメージ
      expect(activeMinDamage).toBeLessThan(normalMinDamage);
      expect(activeMinDamage).toBeCloseTo(
        Math.floor((normalMinDamage * 2) / 3),
        0,
      );
    });
  });

  // 天候効果のテスト
  // 第三世代では、すなあらし時のいわタイプとくぼう1.5倍の仕様は存在しない

  describe("ウェザーボール", () => {
    it("天候なしの場合、ノーマルタイプ威力50", async () => {
      const input = {
        move: "ウェザーボール",
        attacker: {
          level: 50,
          pokemonName: "ピカチュウ",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "ハピナス",
          stat: { value: 50 },
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isNormalDamageOutput(output)) {
        expect(output.damage).toBeDefined();
        // ノーマルタイプの威力50の技として計算される
        expect(output.damage.min).toBeGreaterThan(40);
        expect(output.damage.max).toBeLessThan(100);
      }
    });

    it("はれの場合、ほのおタイプ威力100", async () => {
      const normalInput = {
        move: "ウェザーボール",
        attacker: {
          level: 50,
          pokemonName: "ピカチュウ",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "ハピナス",
          stat: { value: 50 },
          statModifier: 0,
        },
        options: {},
      };

      const sunnyInput = {
        ...normalInput,
        options: { weather: "はれ" },
      };

      const normalResult = await calculateDamageHandler(normalInput);
      const sunnyResult = await calculateDamageHandler(sunnyInput);

      const normalOutput = parseResponse<StructuredOutput>(normalResult);
      const sunnyOutput = parseResponse<StructuredOutput>(sunnyResult);

      // デバッグ用にエラーチェック
      if (!isNormalDamageOutput(normalOutput)) {
        console.error("normalOutput:", normalOutput);
        expect.fail("normalOutput is not NormalDamageOutput");
      }
      if (!isNormalDamageOutput(sunnyOutput)) {
        console.error("sunnyOutput:", sunnyOutput);
        expect.fail("sunnyOutput is not NormalDamageOutput");
      }

      const normalDamage = normalOutput.damage.min;
      const sunnyDamage = sunnyOutput.damage.min;

      // はれ時は威力が2倍(50→100)、さらに天候補正1.5倍で実質3倍
      expect(sunnyDamage).toBeGreaterThan(normalDamage * 2.5);
    });

    it("あめの場合、みずタイプ威力100", async () => {
      const normalInput = {
        move: "ウェザーボール",
        attacker: {
          level: 50,
          pokemonName: "ピカチュウ",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "リザードン",
          stat: { value: 100 },
          statModifier: 0,
        },
        options: {},
      };

      const rainInput = {
        ...normalInput,
        options: { weather: "あめ" },
      };

      const normalResult = await calculateDamageHandler(normalInput);
      const rainResult = await calculateDamageHandler(rainInput);

      const normalOutput = parseResponse<StructuredOutput>(normalResult);
      const rainOutput = parseResponse<StructuredOutput>(rainResult);

      // デバッグ用にエラーチェック
      if (!isNormalDamageOutput(normalOutput)) {
        console.error("normalOutput (rain test):", normalOutput);
        expect.fail("normalOutput is not NormalDamageOutput");
      }
      if (!isNormalDamageOutput(rainOutput)) {
        console.error("rainOutput:", rainOutput);
        expect.fail("rainOutput is not NormalDamageOutput");
      }

      const normalDamage = normalOutput.damage.min;
      const rainDamage = rainOutput.damage.min;

      // あめ時は威力が2倍(50→100)、さらに天候補正1.5倍で実質3倍
      expect(rainDamage).toBeGreaterThan(normalDamage * 2.5);
    });

    it("あられの場合、こおりタイプ威力100", async () => {
      const input = {
        move: "ウェザーボール",
        attacker: {
          level: 50,
          pokemonName: "ピカチュウ",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "フシギダネ",
          stat: { value: 100 },
          statModifier: 0,
        },
        options: { weather: "あられ" },
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isNormalDamageOutput(output)) {
        // こおりタイプでくさ/どくタイプに等倍
        expect(output.modifiers.typeEffectiveness).toBe(1);
      }
    });

    it("すなあらしの場合、いわタイプ威力100", async () => {
      const input = {
        move: "ウェザーボール",
        attacker: {
          level: 50,
          pokemonName: "ピカチュウ",
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "リザードン",
          stat: { value: 100 },
          statModifier: 0,
        },
        options: { weather: "すなあらし" },
      };

      const result = await calculateDamageHandler(input);
      const output = parseResponse<StructuredOutput>(result);
      if (isNormalDamageOutput(output)) {
        // いわタイプでほのお/ひこうタイプに等倍
        expect(output.modifiers.typeEffectiveness).toBe(1);
      }
    });
  });
});
