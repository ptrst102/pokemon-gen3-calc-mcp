import { describe, expect, it } from "vitest";
import { prepareCalculationContext } from "./prepareCalculationContext";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";

describe("prepareCalculationContext", () => {
  describe("めざめるパワーの処理", () => {
    it("個体値が指定された場合、タイプと威力が計算される", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル", // デフォルト値（無視される）
          power: 70, // デフォルト値（無視される）
          isPhysical: false,
          hiddenPowerIVs: {
            hp: 31,
            attack: 30,
            defense: 30,
            specialAttack: 31,
            specialDefense: 31,
            speed: 31,
          },
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "サンダース",
            types: ["でんき"],
            baseStats: {
              hp: 65,
              attack: 65,
              defense: 60,
              specialAttack: 110,
              specialDefense: 95,
              speed: 130,
            },
          },
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ギャラドス",
            types: ["みず", "ひこう"],
            baseStats: {
              hp: 95,
              attack: 125,
              defense: 79,
              specialAttack: 60,
              specialDefense: 100,
              speed: 81,
            },
          },
          stat: { value: 120 },
          statModifier: 0,
        },
        options: {},
      };

      const context = prepareCalculationContext(input);

      expect(context.move.type).toBe("こおり");
      expect(context.move.power).toBe(70);
      expect(context.move.isPhysical).toBe(false);
    });

    it("個体値が指定されていない場合、デフォルト値が使用される", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          isPhysical: true,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "サンダース",
            types: ["でんき"],
            baseStats: {
              hp: 65,
              attack: 65,
              defense: 60,
              specialAttack: 110,
              specialDefense: 95,
              speed: 130,
            },
          },
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ギャラドス",
            types: ["みず", "ひこう"],
            baseStats: {
              hp: 95,
              attack: 125,
              defense: 79,
              specialAttack: 60,
              specialDefense: 100,
              speed: 81,
            },
          },
          stat: { value: 120 },
          statModifier: 0,
        },
        options: {},
      };

      const context = prepareCalculationContext(input);

      expect(context.move.type).toBe("ノーマル");
      expect(context.move.power).toBe(70);
      expect(context.move.isPhysical).toBe(true); // ノーマルタイプは物理
    });

    it("タイプによって物理/特殊が正しく判定される", () => {
      const input: CalculateDamageInput = {
        move: {
          type: "ほのお",
          power: 60,
          isPhysical: false,
          hiddenPowerIVs: {
            hp: 31,
            attack: 30,
            defense: 31,
            specialAttack: 30,
            specialDefense: 31,
            speed: 30,
          },
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "ブーバー",
            types: ["ほのお"],
            baseStats: {
              hp: 65,
              attack: 95,
              defense: 57,
              specialAttack: 100,
              specialDefense: 85,
              speed: 93,
            },
          },
          stat: { value: 150 },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "フシギバナ",
            types: ["くさ", "どく"],
            baseStats: {
              hp: 80,
              attack: 82,
              defense: 83,
              specialAttack: 100,
              specialDefense: 100,
              speed: 80,
            },
          },
          stat: { value: 120 },
          statModifier: 0,
        },
        options: {},
      };

      const context = prepareCalculationContext(input);

      expect(context.move.type).toBe("ほのお");
      expect(context.move.power).toBe(70);
      expect(context.move.isPhysical).toBe(false); // ほのおタイプは特殊
    });
  });
});