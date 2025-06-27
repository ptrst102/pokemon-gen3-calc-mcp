import { describe, expect, it } from "vitest";
import type { CalculateDamageInput } from "../schemas/damageSchema";
import { prepareCalculationContext } from "./prepareCalculationContext";

describe("prepareCalculationContext", () => {
  describe("めざめるパワーの処理", () => {
    it("めざめるパワーで個体値が指定されている場合、タイプと威力を計算する", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          isPhysical: false,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "スターミー",
            types: ["みず", "エスパー"],
            baseStats: {
              hp: 60,
              atk: 75,
              def: 85,
              spa: 100,
              spd: 85,
              spe: 115,
            },
            abilities: ["はっこう", "しぜんかいふく"],
            weightkg: 80,
          },
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral" as const,
          },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ラグラージ",
            types: ["みず", "じめん"],
            baseStats: {
              hp: 100,
              atk: 110,
              def: 90,
              spa: 85,
              spd: 90,
              spe: 60,
            },
            abilities: ["げきりゅう"],
            weightkg: 81.9,
          },
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral" as const,
          },
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

      // 個体値31の場合、めざめるパワーはあくタイプ、威力70になる
      expect(context.move.type).toBe("あく");
      expect(context.move.power).toBe(70);
    });

    it("めざめるパワーで特定の個体値パターンの場合、正しいタイプと威力を計算する", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          isPhysical: false,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "スターミー",
            types: ["みず", "エスパー"],
            baseStats: {
              hp: 60,
              atk: 75,
              def: 85,
              spa: 100,
              spd: 85,
              spe: 115,
            },
            abilities: ["はっこう", "しぜんかいふく"],
            weightkg: 80,
          },
          stat: {
            // HP: 31, 攻撃: 30, 防御: 30, 特攻: 31, 特防: 31, 素早さ: 31
            // この個体値パターンはこおりタイプ、威力70
            iv: 31, // 特攻のIV
            ev: 252,
            natureModifier: "neutral" as const,
          },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
          // 全ての個体値を指定するために、新しいプロパティが必要
          allIVs: {
            hp: 31,
            attack: 30,
            defense: 30,
            specialAttack: 31,
            specialDefense: 31,
            speed: 31,
          },
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ラグラージ",
            types: ["みず", "じめん"],
            baseStats: {
              hp: 100,
              atk: 110,
              def: 90,
              spa: 85,
              spd: 90,
              spe: 60,
            },
            abilities: ["げきりゅう"],
            weightkg: 81.9,
          },
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral" as const,
          },
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
    });

    it("めざめるパワーで個体値が指定されていない場合（実数値のみ）、エラーを投げる", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          isPhysical: false,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "スターミー",
            types: ["みず", "エスパー"],
            baseStats: {
              hp: 60,
              atk: 75,
              def: 85,
              spa: 100,
              spd: 85,
              spe: 115,
            },
            abilities: ["はっこう", "しぜんかいふく"],
            weightkg: 80,
          },
          stat: {
            value: 135, // 実数値のみ指定
          },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ラグラージ",
            types: ["みず", "じめん"],
            baseStats: {
              hp: 100,
              atk: 110,
              def: 90,
              spa: 85,
              spd: 90,
              spe: 60,
            },
            abilities: ["げきりゅう"],
            weightkg: 81.9,
          },
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral" as const,
          },
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

      expect(() => prepareCalculationContext(input)).toThrow(
        "めざめるパワーを使用する場合は、攻撃側ポケモンの個体値を指定する必要があります",
      );
    });

    it("通常のわざの場合、めざめるパワーの処理をスキップする", () => {
      const input: CalculateDamageInput = {
        move: {
          name: "ハイドロポンプ",
          type: "みず",
          power: 120,
          isPhysical: false,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "スターミー",
            types: ["みず", "エスパー"],
            baseStats: {
              hp: 60,
              atk: 75,
              def: 85,
              spa: 100,
              spd: 85,
              spe: 115,
            },
            abilities: ["はっこう", "しぜんかいふく"],
            weightkg: 80,
          },
          stat: {
            value: 135, // 実数値のみでも問題ない
          },
          statModifier: 0,
          item: undefined,
          ability: undefined,
          abilityActive: false,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ラグラージ",
            types: ["みず", "じめん"],
            baseStats: {
              hp: 100,
              atk: 110,
              def: 90,
              spa: 85,
              spd: 90,
              spe: 60,
            },
            abilities: ["げきりゅう"],
            weightkg: 81.9,
          },
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral" as const,
          },
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

      expect(context.move.type).toBe("みず");
      expect(context.move.power).toBe(120);
    });
  });
});
