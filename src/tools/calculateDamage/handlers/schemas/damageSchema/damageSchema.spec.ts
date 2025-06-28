import { describe, expect, it } from "vitest";
import { calculateDamageInputSchema } from "./damageSchema";

describe("calculateDamageInputSchema", () => {
  describe("わざの入力", () => {
    it("技名から変換できる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.move).toEqual({
        name: "１０まんボルト",
        type: "でんき",
        power: 95,
        isPhysical: false,
      });
    });

    it("タイプと威力を直接指定できる", () => {
      const input = {
        move: {
          type: "ほのお",
          power: 80,
        },
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.move).toEqual({
        type: "ほのお",
        power: 80,
        isPhysical: false,
      });
    });

    it("存在しない技名はエラーになる", () => {
      const input = {
        move: "存在しない技",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      expect(() => calculateDamageInputSchema.parse(input)).toThrow(
        "わざ「存在しない技」が見つかりません",
      );
    });

    it("未対応の威力不定技はエラーになる", () => {
      const unsupportedMoves = [
        "ころがる",
        "れんぞくぎり",
        "アイスボール",
        "いかり",
        "しおふき",
        "ふんか",
        "マグニチュード",
        "プレゼント",
        "トリプルキック",
        "めざめるパワー",
        "はきだす",
        "サイコウェーブ",
        "ふくろだたき",
        "みらいよち",
        "はめつのねがい",
      ];

      for (const moveName of unsupportedMoves) {
        const input = {
          move: moveName,
          attacker: {
            stat: { value: 100 },
          },
          defender: {
            stat: { value: 100 },
          },
        };

        expect(() => calculateDamageInputSchema.parse(input)).toThrow(
          `${moveName}には対応していません`,
        );
      }
    });

    it("物理技と特殊技を正しく判定する", () => {
      // 物理技
      const physicalInput = {
        move: "アイアンテール",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const physicalResult = calculateDamageInputSchema.parse(physicalInput);
      expect(physicalResult.move.isPhysical).toBe(true);

      // 特殊技
      const specialInput = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const specialResult = calculateDamageInputSchema.parse(specialInput);
      expect(specialResult.move.isPhysical).toBe(false);
    });
  });

  describe("攻撃側の入力", () => {
    it("レベルのデフォルト値は50", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.level).toBe(50);
    });

    it("実数値を直接指定できる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 150 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.stat).toEqual({ value: 150 });
    });

    it("ポケモン名と個体値・努力値を指定できる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          pokemonName: "ピカチュウ",
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.pokemon?.name).toBe("ピカチュウ");
      expect(result.attacker.stat).toMatchObject({
        iv: 31,
        ev: 252,
        natureModifier: "up",
      });
    });

    it("能力補正のデフォルト値は0", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.statModifier).toBe(0);
    });

    it("存在しないポケモン名はエラーになる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          pokemonName: "存在しないポケモン",
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      expect(() => calculateDamageInputSchema.parse(input)).toThrow(
        "ポケモン「存在しないポケモン」が見つかりません",
      );
    });

    it("存在しないもちものはエラーになる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          item: "存在しないもちもの",
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      expect(() => calculateDamageInputSchema.parse(input)).toThrow(
        "もちもの「存在しないもちもの」が見つかりません",
      );
    });

    it("存在しないとくせいはエラーになる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          ability: "存在しないとくせい",
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      expect(() => calculateDamageInputSchema.parse(input)).toThrow(
        "とくせい「存在しないとくせい」が見つかりません",
      );
    });

    it("とくせいの発動状態を指定できる", () => {
      const input = {
        move: "かえんほうしゃ",
        attacker: {
          ability: "もうか",
          abilityActive: true,
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.ability?.name).toBe("もうか");
      expect(result.attacker.abilityActive).toBe(true);
    });

    it("とくせいの発動状態のデフォルトはfalse", () => {
      const input = {
        move: "かえんほうしゃ",
        attacker: {
          ability: "もうか",
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.attacker.abilityActive).toBe(false);
    });
  });

  describe("防御側の入力", () => {
    it("基本的な入力が正しく処理される", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          level: 75,
          pokemonName: "フシギダネ",
          item: "もくたん",
          ability: "しんりょく",
          stat: { value: 120 },
          statModifier: -1,
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.defender.level).toBe(75);
      expect(result.defender.pokemon?.name).toBe("フシギダネ");
      expect(result.defender.item?.name).toBe("もくたん");
      expect(result.defender.ability?.name).toBe("しんりょく");
      expect(result.defender.statModifier).toBe(-1);
    });

    it("とくせいの発動状態を指定できる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          ability: "ふしぎなうろこ",
          abilityActive: true,
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.defender.ability?.name).toBe("ふしぎなうろこ");
      expect(result.defender.abilityActive).toBe(true);
    });
  });

  describe("オプション", () => {
    it("オプションのデフォルト値が設定される", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.options).toEqual({
        charge: false,
        reflect: false,
        lightScreen: false,
        mudSport: false,
        waterSport: false,
      });
    });

    it("オプションを指定できる", () => {
      const input = {
        move: "１０まんボルト",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
        options: {
          weather: "はれ",
          charge: true,
          lightScreen: true,
        },
      };

      const result = calculateDamageInputSchema.parse(input);
      expect(result.options).toEqual({
        weather: "はれ",
        charge: true,
        reflect: false,
        lightScreen: true,
        mudSport: false,
        waterSport: false,
      });
    });

    it("「あられ」と「すなあらし」の天候を指定できる", () => {
      // あられ
      const hailInput = {
        move: "ふぶき",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
        options: {
          weather: "あられ",
        },
      };

      const hailResult = calculateDamageInputSchema.parse(hailInput);
      expect(hailResult.options.weather).toBe("あられ");

      // すなあらし
      const sandstormInput = {
        move: "いわなだれ",
        attacker: {
          stat: { value: 100 },
        },
        defender: {
          stat: { value: 100 },
        },
        options: {
          weather: "すなあらし",
        },
      };

      const sandstormResult = calculateDamageInputSchema.parse(sandstormInput);
      expect(sandstormResult.options.weather).toBe("すなあらし");
    });
  });
});
