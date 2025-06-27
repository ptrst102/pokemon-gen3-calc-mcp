import { describe, expect, it } from "vitest";
import { calculateDamageHandler } from "@/tools/calculateDamage";
import { calculateDamageMatrixVaryingAttackHandler } from "@/tools/calculateDamageMatrixVaryingAttack";
import { calculateDamageMatrixVaryingDefenseHandler } from "@/tools/calculateDamageMatrixVaryingDefense";

describe("めざめるパワー統合テスト", () => {
  describe("calculateDamage", () => {
    it("こおりタイプ威力70のめざめるパワー", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
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
          pokemonName: "サンダース",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "ハピナス",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("こおり");
      expect(result.move.power).toBe(70);
      expect(result.move.category).toBe("特殊");
      expect(result.modifiers.typeEffectiveness).toBe(1); // ハピナスに対して等倍
    });

    it("でんきタイプ威力59のめざめるパワー", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          hiddenPowerIVs: {
            hp: 31,
            attack: 31,
            defense: 31,
            specialAttack: 0,
            specialDefense: 31,
            speed: 31,
          },
        },
        attacker: {
          pokemonName: "フーディン",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "ギャラドス",
          level: 50,
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("でんき");
      expect(result.move.power).toBe(59);
      expect(result.move.category).toBe("特殊");
      expect(result.modifiers.typeEffectiveness).toBe(4); // ギャラドスに対して4倍（みず×2＋ひこう×2）
    });

    it("かくとうタイプ威力30のめざめるパワー（すべて30）", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          hiddenPowerIVs: {
            hp: 30,
            attack: 30,
            defense: 30,
            specialAttack: 30,
            specialDefense: 30,
            speed: 30,
          },
        },
        attacker: {
          pokemonName: "ミュウツー",
          level: 100,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "バンギラス",
          level: 100,
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("かくとう");
      expect(result.move.power).toBe(70);
      expect(result.move.category).toBe("物理"); // 第三世代ではかくとうは物理
      expect(result.modifiers.typeEffectiveness).toBe(4); // バンギラスに対して4倍（いわ＋あく）
    });

    it("あくタイプ威力70のめざめるパワー（すべて31）", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          hiddenPowerIVs: {
            hp: 31,
            attack: 31,
            defense: 31,
            specialAttack: 31,
            specialDefense: 31,
            speed: 31,
          },
        },
        attacker: {
          pokemonName: "サンダー",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "エーフィ",
          level: 50,
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("あく");
      expect(result.move.power).toBe(70);
      expect(result.move.category).toBe("特殊"); // 第三世代ではあくは特殊
      expect(result.modifiers.typeEffectiveness).toBe(2); // エーフィに対して2倍（エスパー）
    });
  });

  describe("calculateDamageMatrixVaryingAttack", () => {
    it("めざめるパワーで攻撃側努力値を変動させる", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
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
          pokemonName: "ライコウ",
          level: 50,
          stat: {
            iv: 31,
            evDistribution: {
              hp: 0,
              defense: 0,
              specialDefense: 0,
              speed: 252,
            },
            natureModifier: "up",
          },
          statModifier: 0,
          isPhysicalAttack: false, // こおりタイプは特殊
        },
        defender: {
          pokemonName: "スイクン",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageMatrixVaryingAttackHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.damageMatrix).toBeDefined();
      expect(result.damageMatrix.length).toBeGreaterThan(0);

      // 各エントリにev, attackStat, damagesが含まれることを確認
      expect(result.damageMatrix[0]).toHaveProperty("ev");
      expect(result.damageMatrix[0]).toHaveProperty("attackStat");
      expect(result.damageMatrix[0]).toHaveProperty("damages");

      // ダメージが努力値の増加とともに増えることを確認
      const firstDamage = Math.min(...result.damageMatrix[0].damages);
      const lastDamage = Math.min(
        ...result.damageMatrix[result.damageMatrix.length - 1].damages,
      );
      expect(lastDamage).toBeGreaterThan(firstDamage);
    });
  });

  describe("calculateDamageMatrixVaryingDefense", () => {
    it("めざめるパワーで防御側努力値を変動させる", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          hiddenPowerIVs: {
            hp: 31,
            attack: 31,
            defense: 31,
            specialAttack: 0,
            specialDefense: 31,
            speed: 31,
          },
        },
        attacker: {
          pokemonName: "フリーザー",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "カビゴン",
          level: 50,
          stat: {
            iv: 31,
            evDistribution: {
              attack: 0,
              hp: 252,
              speed: 0,
            },
            natureModifier: "neutral",
          },
          statModifier: 0,
          isPhysicalDefense: false, // でんきタイプは特殊
        },
        options: {},
      };

      const response = await calculateDamageMatrixVaryingDefenseHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.damageMatrix).toBeDefined();
      expect(result.damageMatrix.length).toBeGreaterThan(0);

      // 各エントリにev, defenseStat, damagesが含まれることを確認
      expect(result.damageMatrix[0]).toHaveProperty("ev");
      expect(result.damageMatrix[0]).toHaveProperty("defenseStat");
      expect(result.damageMatrix[0]).toHaveProperty("damages");

      // ダメージが防御努力値の増加とともに減ることを確認
      const firstDamage = Math.min(...result.damageMatrix[0].damages);
      const lastDamage = Math.min(
        ...result.damageMatrix[result.damageMatrix.length - 1].damages,
      );
      expect(lastDamage).toBeLessThan(firstDamage);
    });
  });

  describe("エッジケース", () => {
    it("個体値が指定されていない場合は元のタイプと威力を使用", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ほのお",
          power: 65,
        },
        attacker: {
          pokemonName: "リザードン",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "フシギバナ",
          level: 50,
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("ほのお");
      expect(result.move.power).toBe(65);
      expect(result.move.category).toBe("特殊");
      expect(result.modifiers.typeEffectiveness).toBe(2); // フシギバナに対して2倍（くさ×2、どく×1）
    });

    it("タイプ一致ボーナスの確認", async () => {
      const args = {
        move: {
          name: "めざめるパワー",
          type: "ノーマル",
          power: 70,
          hiddenPowerIVs: {
            hp: 30,
            attack: 31,
            defense: 31,
            specialAttack: 31,
            specialDefense: 31,
            speed: 30,
          },
        },
        attacker: {
          pokemonName: "ファイヤー",
          level: 50,
          stat: {
            iv: 31,
            ev: 252,
            natureModifier: "up",
          },
          statModifier: 0,
        },
        defender: {
          pokemonName: "メタグロス",
          level: 50,
          stat: {
            iv: 31,
            ev: 0,
            natureModifier: "neutral",
          },
          statModifier: 0,
        },
        options: {},
      };

      const response = await calculateDamageHandler(args);
      const result = JSON.parse(response.content[0].text);

      expect(result.move.type).toBe("エスパー");
      expect(result.move.power).toBe(70);
      expect(result.modifiers.stab).toBe(false); // ファイヤーはエスパータイプではないのでタイプ不一致
      expect(result.modifiers.typeEffectiveness).toBe(0.25); // メタグロスに対して0.25倍（はがね×0.5、エスパー×0.5）
    });
  });
});
