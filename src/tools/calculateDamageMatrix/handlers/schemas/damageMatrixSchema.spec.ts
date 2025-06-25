import { describe, it, expect } from "vitest";
import { calculateDamageMatrixInputSchema } from "./damageMatrixSchema";

describe("calculateDamageMatrixInputSchema", () => {
  describe("必須フィールドの検証", () => {
    it("必須フィールドのみで有効", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("moveがオブジェクト形式でも有効", () => {
      const input = {
        move: { type: "じめん", power: 100 },
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("必須フィールドが欠けている場合はエラー", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("デフォルト値の適用", () => {
    it("levelのデフォルト値が50", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.parse(input);
      expect(result.attacker.level).toBe(50);
    });

    it("statModifierのデフォルト値が0", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.parse(input);
      expect(result.attacker.statModifier).toBe(0);
    });

    it("statRangeのデフォルト値が正しく適用される", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "physical",
        options: {
          statRange: {},
        },
      };

      const result = calculateDamageMatrixInputSchema.parse(input);
      expect(result.options?.statRange?.min).toBe(4);
      expect(result.options?.statRange?.max).toBe(504);
    });
  });

  describe("値の範囲検証", () => {
    it("statが範囲外の場合はエラー", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 1000 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("レベルが範囲外の場合はエラー", () => {
      const input = {
        move: "じしん",
        attacker: {
          level: 101,
          stat: { value: 205 },
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("statModifierが範囲外の場合はエラー", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
          statModifier: 7,
        },
        defenderType: "physical",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("defenderType検証", () => {
    it("physical/special以外の値はエラー", () => {
      const input = {
        move: "じしん",
        attacker: {
          stat: { value: 205 },
        },
        defenderType: "invalid",
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("オプションフィールドの検証", () => {
    it("全てのオプションフィールドが含まれていても有効", () => {
      const input = {
        move: "じしん",
        attacker: {
          pokemonName: "メタグロス",
          level: 50,
          stat: { value: 205 },
          item: "こだわりハチマキ",
          ability: "クリアボディ",
          abilityActive: false,
          statModifier: 0,
        },
        defenderType: "physical",
        defender: {
          pokemonName: "ボーマンダ",
          level: 50,
          item: "オボンのみ",
          ability: "いかく",
          abilityActive: false,
          statModifier: 0,
        },
        options: {
          weather: "はれ",
          charge: false,
          reflect: false,
          lightScreen: false,
          mudSport: false,
          waterSport: false,
          statRange: {
            min: 10,
            max: 400,
          },
        },
      };

      const result = calculateDamageMatrixInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});