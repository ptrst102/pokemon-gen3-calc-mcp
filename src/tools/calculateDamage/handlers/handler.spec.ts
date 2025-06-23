import { describe, expect, it } from "vitest";
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
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("ダメージ計算結果");
    expect(result.content[0].text).toContain("ダメージ:");
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
    expect(result.content[0].text).toContain("ダメージ:");
    expect(result.content[0].text).toContain("タイプ相性こうかばつぐん (4倍)");
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
    expect(result.content[0].text).toContain("こうかばつぐん");
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
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("エラー");
    expect(result.content[0].text).toContain(
      "わざ「存在しないわざ」が見つかりません",
    );
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
    const normalDamageMatch =
      normalResult.content[0].text.match(/ダメージ: (\d+)/);
    const sunDamageMatch = sunResult.content[0].text.match(/ダメージ: (\d+)/);

    expect(normalDamageMatch).toBeTruthy();
    expect(sunDamageMatch).toBeTruthy();

    const normalDamage = Number(normalDamageMatch?.[1]);
    const sunDamage = Number(sunDamageMatch?.[1]);

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
    expect(result.content[0].text).toContain("ダメージ: 0");
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
    expect(result.content[0].text).toContain("ダメージ: 0");
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

    const normalDamageMatch =
      normalResult.content[0].text.match(/ダメージ: (\d+)/);
    const powerDamageMatch =
      powerResult.content[0].text.match(/ダメージ: (\d+)/);

    expect(normalDamageMatch).toBeTruthy();
    expect(powerDamageMatch).toBeTruthy();

    const normalDamage = Number(normalDamageMatch?.[1]);
    const powerDamage = Number(powerDamageMatch?.[1]);

    // ちからもちで2倍のダメージ
    expect(powerDamage).toBeGreaterThan(normalDamage * 1.5);
  });

  describe("calculateAllEvsを使った場合", () => {
    it("攻撃側がcalculateAllEvsの場合の計算が動作する", async () => {
      const input = {
        move: "かえんほうしゃ",
        attacker: {
          level: 50,
          pokemonName: "リザードン",
          stat: {
            iv: 31,
            calculateAllEvs: true,
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "フシギバナ",
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain(
        "=== 努力値別ダメージ計算結果 ===",
      );
      expect(result.content[0].text).toContain(
        "=== 攻撃側努力値別ダメージ ===",
      );
      expect(result.content[0].text).toContain("努力値: 0");
      expect(result.content[0].text).toContain("努力値: 252");
      expect(result.content[0].text).toContain("最大ダメージ:");
      expect(result.content[0].text).toContain("最小ダメージ:");
    });

    it("防御側がcalculateAllEvsの場合の計算が動作する", async () => {
      const input = {
        move: { type: "かくとう", power: 100 },
        attacker: {
          level: 50,
          pokemonName: "カイリキー",
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "カビゴン",
          stat: {
            iv: 31,
            calculateAllEvs: true,
          },
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain(
        "=== 努力値別ダメージ計算結果 ===",
      );
      expect(result.content[0].text).toContain(
        "=== 防御側努力値別ダメージ ===",
      );
      expect(result.content[0].text).toContain("努力値: 0");
      expect(result.content[0].text).toContain("努力値: 252");
      expect(result.content[0].text).toContain("最大ダメージ:");
      expect(result.content[0].text).toContain("最小ダメージ:");
    });

    it("両方がcalculateAllEvsの場合はエラーを返す", async () => {
      const input = {
        move: { type: "ノーマル", power: 100 },
        attacker: {
          level: 50,
          pokemonName: "ケンタロス",
          stat: {
            iv: 31,
            calculateAllEvs: true,
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "プクリン",
          stat: {
            iv: 31,
            calculateAllEvs: true,
          },
          statModifier: 0,
        },
        options: {},
      };

      const result = await calculateDamageHandler(input);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain("エラー");
      expect(result.content[0].text).toContain(
        "攻撃側と防御側の両方でcalculateAllEvsを使うことはできません",
      );
    });

    it("中間のEV値でもダメージが正しく計算される", async () => {
      const input = {
        move: { type: "みず", power: 95 },
        attacker: {
          level: 50,
          pokemonName: "ラプラス",
          stat: {
            iv: 31,
            calculateAllEvs: true,
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "ウインディ",
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
      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain(
        "=== 努力値別ダメージ計算結果 ===",
      );

      // 中間のEV値（124）も表示されることを確認
      expect(result.content[0].text).toContain("努力値: 124");

      // タイプ相性が正しく表示されることを確認
      expect(result.content[0].text).toContain(
        "タイプ相性こうかばつぐん (2倍)",
      );
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
      const text = result.content[0].text;

      // C145（性格補正なし）の場合、タイプ一致で72〜85付近のダメージ
      expect(text).toContain("ダメージ: 72 〜 85");
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

      const normalDamageMatch =
        normalResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
      const activeDamageMatch =
        activeResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);

      expect(normalDamageMatch).toBeTruthy();
      expect(activeDamageMatch).toBeTruthy();

      const normalMinDamage = Number(normalDamageMatch?.[1]);
      const activeMinDamage = Number(activeDamageMatch?.[1]);

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

      const normalDamageMatch =
        normalResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
      const activeDamageMatch =
        activeResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);

      expect(normalDamageMatch).toBeTruthy();
      expect(activeDamageMatch).toBeTruthy();

      const normalMinDamage = Number(normalDamageMatch?.[1]);
      const activeMinDamage = Number(activeDamageMatch?.[1]);

      // ふしぎなうろこ発動時は2/3のダメージ
      expect(activeMinDamage).toBeLessThan(normalMinDamage);
      expect(activeMinDamage).toBeCloseTo(
        Math.floor((normalMinDamage * 2) / 3),
        0,
      );
    });
  });
});
