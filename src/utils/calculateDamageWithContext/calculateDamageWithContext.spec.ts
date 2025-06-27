import { describe, expect, it } from "vitest";
import type { DamageCalculationParams } from "./calculateDamageWithContext";
import { calculateDamageWithContext } from "./calculateDamageWithContext";

describe("calculateDamageWithContext", () => {
  describe("現在の挙動の文書化", () => {
    it("通常の物理技のダメージ計算", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "ノーマル",
          power: 100,
          isPhysical: true,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
          pokemon: {
            types: ["ノーマル"],
          },
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["ノーマル"],
          },
        },
        options: {},
      };

      const result = calculateDamageWithContext(params);
      expect(result).toHaveLength(16);
      // 実際の計算: とくせい→タイプ相性→タイプ一致→天候の順
      expect(result[0]).toBe(58); // 実際の最小ダメージ（タイプ一致適用）
      expect(result[15]).toBe(69); // 実際の最大ダメージ
    });

    it("ひかりのかべ・リフレクター効果の処理方法の違い", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "かくとう",
          power: 100,
          isPhysical: true,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["ノーマル"],
          },
        },
        options: {
          reflect: true,
        },
      };

      const result = calculateDamageWithContext(params);
      // calculateDamageWithContextもcalculateDamageと同じ計算順序に統一
      // ダメージを0.5倍にする（calculateDamageと同じ方式）
      expect(result[0]).toBe(39); // 実際のダメージ
    });

    it("じゅうでん効果の処理タイミングの違い", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "でんき",
          power: 100,
          isPhysical: false,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["みず"],
          },
        },
        options: {
          charge: true,
        },
      };

      const result = calculateDamageWithContext(params);
      // calculateDamageWithContextは威力に適用
      // じゅうでん効果はダメージ計算後に適用
      expect(result[0]).toBe(156); // 実際の値
    });

    it("どろあそび・みずあそび効果の処理タイミング", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "でんき",
          power: 100,
          isPhysical: false,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["ノーマル"],
          },
        },
        options: {
          mudSport: true,
        },
      };

      const result = calculateDamageWithContext(params);
      // calculateDamageWithContextは威力に適用
      // どろあそび効果はダメージ計算後に適用
      expect(result[0]).toBe(19); // 実際のダメージ
    });

    describe("特殊な技の処理", () => {
      it("じばく・だいばくはつの処理が動作する", () => {
        const params: DamageCalculationParams = {
          move: {
            type: "ノーマル",
            power: 200,
            isPhysical: true,
            name: "じばく", // calculateDamageWithContextでは未対応
          },
          attackStat: 100,
          defenseStat: 100,
          attacker: {
            level: 50,
            statModifier: 0,
            pokemon: {
              types: ["ノーマル"],
            },
          },
          defender: {
            statModifier: 0,
            pokemon: {
              types: ["いわ"],
            },
          },
          options: {},
        };

        const result = calculateDamageWithContext(params);
        // 防御半減処理が動作する
        expect(result[0]).toBe(113); // 防御半減の効果（タイプ一致1.5倍×タイプ相性0.5倍）
      });

      it("ウェザーボールの処理が動作する", () => {
        const params: DamageCalculationParams = {
          move: {
            type: "ノーマル", // 天候で変わるはずだが未対応
            power: 50,
            isPhysical: false,
            name: "ウェザーボール",
          },
          attackStat: 100,
          defenseStat: 100,
          attacker: {
            level: 50,
            statModifier: 0,
          },
          defender: {
            statModifier: 0,
            pokemon: {
              types: ["ノーマル"],
            },
          },
          options: {
            weather: "はれ",
          },
        };

        const result = calculateDamageWithContext(params);
        // はれの時はほのおタイプ100威力に変更される
        expect(result[0]).toBe(58); // ほのお100威力×天候1.5倍
      });

      it("けたぐりの処理が動作する", () => {
        const params: DamageCalculationParams = {
          move: {
            type: "かくとう",
            power: 1, // 元の威力は無視される
            isPhysical: true,
            name: "けたぐり",
          },
          attackStat: 100,
          defenseStat: 100,
          attacker: {
            level: 50,
            statModifier: 0,
          },
          defender: {
            statModifier: 0,
            pokemon: {
              types: ["ノーマル"],
              weightkg: 460.0, // カビゴンの体重
            },
          },
          options: {},
        };

        const result = calculateDamageWithContext(params);
        // 460kgの相手には威力120
        expect(result[0]).toBe(91); // かくとう120威力×タイプ相性2倍
      });
    });

    it("計算順序の違い：タイプ一致ボーナスとタイプ相性の順序", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "みず",
          power: 100,
          isPhysical: false,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
          pokemon: {
            types: ["みず"],
          },
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["ほのお"],
          },
        },
        options: {},
      };

      const result = calculateDamageWithContext(params);
      // calculateDamageWithContextはタイプ相性→タイプ一致の順
      // calculateDamageはタイプ一致→タイプ相性の順
      // 最終結果は同じだが、中間値の扱いが異なる
      // とくせい→タイプ相性×タイプ一致×天候を一度に適用
      expect(result[0]).toBe(117); // 実際の値（タイプ一致1.5倍×タイプ相性2倍）
    });

    it("とくせい効果へのtypeEffectiveness引数の違い", () => {
      const params: DamageCalculationParams = {
        move: {
          type: "みず",
          power: 100,
          isPhysical: false,
        },
        attackStat: 100,
        defenseStat: 100,
        attacker: {
          level: 50,
          statModifier: 0,
          ability: { name: "げきりゅう" },
          abilityActive: true,
        },
        defender: {
          statModifier: 0,
          pokemon: {
            types: ["ほのお"],
          },
        },
        options: {},
      };

      const result = calculateDamageWithContext(params);
      // とくせい効果は正しく適用される（引数の違いは内部的）
      // げきりゅう効果適用
      expect(result[0]).toBe(117); // 実際の値（げきりゅう1.5倍×タイプ相性2倍）
    });
  });
});
