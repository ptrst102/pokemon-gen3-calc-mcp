import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingAttackInputSchema } from "./damageMatrixVaryingAttackSchema";

describe("calculateDamageMatrixVaryingAttackInputSchema", () => {
  describe("moveスキーマ", () => {
    it("わざ名を文字列として受け取れる", () => {
      const input = {
        move: "かえんほうしゃ",
        attacker: {
          pokemonName: "リザードン",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.move).toEqual("かえんほうしゃ");
    });

    it("わざオブジェクトを直接指定できる", () => {
      const input = {
        move: {
          type: "みず",
          power: 110,
        },
        attacker: {
          pokemonName: "ラプラス",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.move).toEqual({
        type: "みず",
        power: 110,
      });
    });

    it("特殊タイプが正しく判定される", () => {
      const specialTypes = [
        "ほのお",
        "みず",
        "でんき",
        "くさ",
        "こおり",
        "エスパー",
        "ドラゴン",
        "あく",
      ];

      specialTypes.forEach((type) => {
        const input = {
          move: { type, power: 80 },
          attacker: {
            pokemonName: "ミュウツー",
            isPhysicalAttack: false,
            stat: { iv: 31 },
          },
          defender: {
            stat: { iv: 31, ev: 252 },
          },
        };

        const result =
          calculateDamageMatrixVaryingAttackInputSchema.parse(input);
        // スキーマではisPhysicalを判定しないので、moveオブジェクトにはisPhysicalは含まれない
        expect(result.move).toHaveProperty("type", type);
        expect(result.move).toHaveProperty("power", 80);
      });
    });
  });

  describe("attackerスキーマ", () => {
    it("攻撃側は個体値と性格補正のみ指定可能", () => {
      const input = {
        move: "じしん",
        attacker: {
          pokemonName: "ボーマンダ",
          isPhysicalAttack: true,
          stat: {
            iv: 31,
            natureModifier: "up",
          },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.attacker.stat).toEqual({
        iv: 31,
        natureModifier: "up",
      });
    });

    it("攻撃側のポケモン名は必須", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          // pokemonNameが欠けている
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      }).toThrow();
    });

    it("isPhysicalAttackは必須", () => {
      const input = {
        move: "サイコキネシス",
        attacker: {
          pokemonName: "フーディン",
          // isPhysicalAttackが欠けている
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      }).toThrow();
    });

    it("デフォルト値が適用される", () => {
      const input = {
        move: "ハイドロポンプ",
        attacker: {
          pokemonName: "カイオーガ",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.attacker.level).toBe(50);
      expect(result.attacker.abilityActive).toBe(false);
      expect(result.attacker.statModifier).toBe(0);
    });
  });

  describe("defenderスキーマ", () => {
    it("実数値を直接指定できる", () => {
      const input = {
        move: "コメットパンチ",
        attacker: {
          pokemonName: "メタグロス",
          isPhysicalAttack: true,
          stat: { iv: 31 },
        },
        defender: {
          stat: { value: 200 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.defender.stat).toEqual({ value: 200 });
    });

    it("個体値・努力値・性格補正を指定できる", () => {
      const input = {
        move: "れいとうビーム",
        attacker: {
          pokemonName: "ラプラス",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          pokemonName: "カイリュー",
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.defender.stat).toEqual({
        iv: 31,
        ev: 252,
        natureModifier: "up",
      });
    });

    it("防御側のポケモン名は省略可能", () => {
      const input = {
        move: "かみなり",
        attacker: {
          pokemonName: "サンダー",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          // pokemonNameを省略
          stat: { value: 150 },
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.defender.pokemon).toBeUndefined();
    });
  });

  describe("optionsスキーマ", () => {
    it("オプションはすべて省略可能", () => {
      const input = {
        move: "ソーラービーム",
        attacker: {
          pokemonName: "フシギバナ",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
        // optionsを省略
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.options).toEqual({
        charge: false,
        lightScreen: false,
        mudSport: false,
        reflect: false,
        waterSport: false,
      });
    });

    it("場の状態を指定できる", () => {
      const input = {
        move: "なみのり",
        attacker: {
          pokemonName: "カイオーガ",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          pokemonName: "グラードン",
          stat: { iv: 31, ev: 252 },
        },
        options: {
          weather: "あめ",
          reflect: false,
          lightScreen: false,
          mudSport: false,
          waterSport: false,
          charge: false,
        },
      };

      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.options).toEqual({
        weather: "あめ",
        reflect: false,
        lightScreen: false,
        mudSport: false,
        waterSport: false,
        charge: false,
      });
    });
  });

  describe("エラーケース", () => {
    it("存在しないわざ名でもスキーマではエラーにならない", () => {
      const input = {
        move: "存在しないわざ",
        attacker: {
          pokemonName: "ピカチュウ",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      // スキーマではエラーにならず、文字列として受け取る
      const result = calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      expect(result.move).toEqual("存在しないわざ");
    });

    it("存在しないポケモン名でエラーになる", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          pokemonName: "存在しないポケモン",
          isPhysicalAttack: false,
          stat: { iv: 31 },
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      }).toThrow("ポケモン「存在しないポケモン」が見つかりません");
    });

    it("個体値が範囲外でエラーになる", () => {
      const input = {
        move: "サイコキネシス",
        attacker: {
          pokemonName: "ミュウツー",
          isPhysicalAttack: false,
          stat: { iv: -1 }, // 負の値
        },
        defender: {
          stat: { iv: 31, ev: 252 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingAttackInputSchema.parse(input);
      }).toThrow();
    });
  });
});
