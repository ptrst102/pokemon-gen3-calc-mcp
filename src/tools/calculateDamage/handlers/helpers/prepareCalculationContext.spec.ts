import { describe, expect, it } from "vitest";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import { prepareCalculationContext } from "./prepareCalculationContext";

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
              atk: 65,
              def: 60,
              spa: 110,
              spd: 95,
              spe: 130,
            },
            abilities: ["ちくでん"],
            weightkg: 24.5,
          },
          stat: { value: 150 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ギャラドス",
            types: ["みず", "ひこう"],
            baseStats: {
              hp: 95,
              atk: 125,
              def: 79,
              spa: 60,
              spd: 100,
              spe: 81,
            },
            abilities: ["いかく"],
            weightkg: 235,
          },
          stat: { value: 120 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        options: {
          charge: false,
          reflect: false,
          lightScreen: false,
          mudSport: false,
          waterSport: false,
        },
      };

      const context = prepareCalculationContext(input);

      expect(context.move.type).toBe("こおり");
      expect(context.move.power).toBe(70);
      expect(context.move.isPhysical).toBe(false);
      expect(context.typeEffectiveness).toBe(1); // ギャラドスに対して等倍（みず0.5倍×ひこう2倍＝1倍）
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
              atk: 65,
              def: 60,
              spa: 110,
              spd: 95,
              spe: 130,
            },
            abilities: ["ちくでん"],
            weightkg: 24.5,
          },
          stat: { value: 150 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ギャラドス",
            types: ["みず", "ひこう"],
            baseStats: {
              hp: 95,
              atk: 125,
              def: 79,
              spa: 60,
              spd: 100,
              spe: 81,
            },
            abilities: ["いかく"],
            weightkg: 235,
          },
          stat: { value: 120 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        options: {
          charge: false,
          reflect: false,
          lightScreen: false,
          mudSport: false,
          waterSport: false,
        },
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
              atk: 95,
              def: 57,
              spa: 100,
              spd: 85,
              spe: 93,
            },
            abilities: ["ほのおのからだ"],
            weightkg: 44.5,
          },
          stat: { value: 150 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "フシギバナ",
            types: ["くさ", "どく"],
            baseStats: {
              hp: 80,
              atk: 82,
              def: 83,
              spa: 100,
              spd: 100,
              spe: 80,
            },
            abilities: ["しんりょく"],
            weightkg: 100,
          },
          stat: { value: 120 },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        options: {
          charge: false,
          reflect: false,
          lightScreen: false,
          mudSport: false,
          waterSport: false,
        },
      };

      const context = prepareCalculationContext(input);

      expect(context.move.type).toBe("ほのお");
      expect(context.move.power).toBe(70);
      expect(context.move.isPhysical).toBe(false); // ほのおタイプは特殊
    });
  });
});
