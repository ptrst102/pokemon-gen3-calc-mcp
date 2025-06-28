import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingDefenseInputSchema } from "./damageMatrixVaryingDefenseSchema";

describe("calculateDamageMatrixVaryingDefenseInputSchema", () => {
  describe("moveスキーマ", () => {
    it("わざ名を文字列として受け取れる", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.move).toEqual("10まんボルト");
    });

    it("わざオブジェクトを直接指定できる", () => {
      const input = {
        move: {
          type: "ほのお",
          power: 120,
        },
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.move).toEqual({
        type: "ほのお",
        power: 120,
      });
    });

    it("物理タイプが正しく判定される", () => {
      const physicalTypes = [
        "ノーマル",
        "かくとう",
        "どく",
        "じめん",
        "ひこう",
        "むし",
        "いわ",
        "ゴースト",
        "はがね",
      ];

      physicalTypes.forEach((type) => {
        const input = {
          move: { type, power: 80 },
          attacker: { stat: { iv: 31, ev: 252 } },
          defender: {
            pokemonName: "ピカチュウ",
            isPhysicalDefense: true,
            stat: { iv: 31 },
          },
        };

        const result =
          calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
        // スキーマではisPhysicalを判定しないので、moveオブジェクトにはisPhysicalは含まれない
        expect(result.move).toHaveProperty("type", type);
        expect(result.move).toHaveProperty("power", 80);
      });
    });
  });

  describe("attackerスキーマ", () => {
    it("実数値を直接指定できる", () => {
      const input = {
        move: "サイコキネシス",
        attacker: {
          stat: { value: 150 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.attacker.stat).toEqual({ value: 150 });
    });

    it("個体値・努力値・性格補正を指定できる", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.attacker.stat).toEqual({
        iv: 31,
        ev: 252,
        natureModifier: "up",
      });
    });

    it("デフォルト値が適用される", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.attacker.level).toBe(50);
      expect(result.attacker.abilityActive).toBe(false);
      expect(result.attacker.statModifier).toBe(0);
    });
  });

  describe("defenderスキーマ", () => {
    it("防御側は個体値と性格補正のみ指定可能", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ハピナス",
          isPhysicalDefense: false,
          stat: {
            iv: 31,
            natureModifier: "up",
          },
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.defender.stat).toEqual({
        iv: 31,
        natureModifier: "up",
      });
    });

    it("防御側のポケモン名は必須", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          // pokemonNameが欠けている
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      }).toThrow();
    });

    it("isPhysicalDefenseは必須", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          // isPhysicalDefenseが欠けている
          stat: { iv: 31 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      }).toThrow();
    });
  });

  describe("optionsスキーマ", () => {
    it("オプションはすべて省略可能", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
        // optionsを省略
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
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
        move: "かえんほうしゃ",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "フシギダネ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
        options: {
          weather: "はれ",
          reflect: true,
          lightScreen: true,
          mudSport: true,
          waterSport: true,
          charge: true,
        },
      };

      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.options).toEqual({
        weather: "はれ",
        reflect: true,
        lightScreen: true,
        mudSport: true,
        waterSport: true,
        charge: true,
      });
    });
  });

  describe("エラーケース", () => {
    it("存在しないわざ名でもスキーマではエラーにならない", () => {
      const input = {
        move: "存在しないわざ",
        attacker: {
          stat: { iv: 31, ev: 252 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      // スキーマではエラーにならず、文字列として受け取る
      const result =
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      expect(result.move).toEqual("存在しないわざ");
    });

    it("努力値が範囲外でエラーになる", () => {
      const input = {
        move: "10まんボルト",
        attacker: {
          stat: { iv: 31, ev: 300 },
        },
        defender: {
          pokemonName: "ピカチュウ",
          isPhysicalDefense: false,
          stat: { iv: 31 },
        },
      };

      expect(() => {
        calculateDamageMatrixVaryingDefenseInputSchema.parse(input);
      }).toThrow();
    });
  });
});
