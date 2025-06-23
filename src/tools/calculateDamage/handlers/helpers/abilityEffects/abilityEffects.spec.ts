import { describe, expect, it } from "vitest";
import { applyAbilityEffects } from "./abilityEffects";

describe("applyAbilityEffects", () => {
  it("ふゆうでじめんタイプの攻撃が無効化される", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "じめん",
      attackerAbility: undefined,
      defenderAbility: "ふゆう",
    });
    expect(result).toBe(0);
  });

  it("ちからもちで物理攻撃が2倍になる", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "ノーマル",
      attackerAbility: "ちからもち",
      defenderAbility: undefined,
      isPhysical: true,
    });
    expect(result).toBe(200);
  });

  it("ヨガパワーで物理攻撃が2倍になる", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "ノーマル",
      attackerAbility: "ヨガパワー",
      defenderAbility: undefined,
      isPhysical: true,
    });
    expect(result).toBe(200);
  });

  it("はりきりで物理攻撃が1.5倍になる", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "ノーマル",
      attackerAbility: "はりきり",
      defenderAbility: undefined,
      isPhysical: true,
    });
    expect(result).toBe(150);
  });

  it("攻撃側とくせいが特殊攻撃には影響しない", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "エスパー",
      attackerAbility: "ちからもち",
      defenderAbility: undefined,
      isPhysical: false,
    });
    expect(result).toBe(100);
  });

  it("ふゆうでじめんタイプ以外の攻撃は通常通り", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "でんき",
      attackerAbility: undefined,
      defenderAbility: "ふゆう",
    });
    expect(result).toBe(100);
  });

  it("ふしぎなまもりで効果抜群以外が無効化される", () => {
    const result = applyAbilityEffects({
      damage: 50,
      moveType: "ノーマル",
      attackerAbility: undefined,
      defenderAbility: "ふしぎなまもり",
      typeEffectiveness: 1,
    });
    expect(result).toBe(0);
  });

  it("ふしぎなまもりで効果抜群は通る", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "いわ",
      attackerAbility: undefined,
      defenderAbility: "ふしぎなまもり",
      typeEffectiveness: 2,
    });
    expect(result).toBe(100);
  });

  it("とくせいがない場合はそのまま", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "ノーマル",
      attackerAbility: undefined,
      defenderAbility: undefined,
    });
    expect(result).toBe(100);
  });

  it("とくせいが未定義の場合はそのまま", () => {
    const result = applyAbilityEffects({
      damage: 100,
      moveType: "ノーマル",
      attackerAbility: undefined,
      defenderAbility: undefined,
    });
    expect(result).toBe(100);
  });

  describe("条件付きとくせい", () => {
    describe("もうか（発動時）", () => {
      it("発動時、ほのおタイプの攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "ほのお",
          attackerAbility: "もうか",
          attackerAbilityActive: true,
          defenderAbility: undefined,
        });
        expect(result).toBe(150);
      });

      it("発動時でも、ほのおタイプ以外は影響しない", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "みず",
          attackerAbility: "もうか",
          attackerAbilityActive: true,
          defenderAbility: undefined,
        });
        expect(result).toBe(100);
      });

      it("非発動時、ほのおタイプでも影響しない", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "ほのお",
          attackerAbility: "もうか",
          attackerAbilityActive: false,
          defenderAbility: undefined,
        });
        expect(result).toBe(100);
      });
    });

    describe("げきりゅう（発動時）", () => {
      it("発動時、みずタイプの攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "みず",
          attackerAbility: "げきりゅう",
          attackerAbilityActive: true,
          defenderAbility: undefined,
        });
        expect(result).toBe(150);
      });
    });

    describe("しんりょく（発動時）", () => {
      it("発動時、くさタイプの攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "くさ",
          attackerAbility: "しんりょく",
          attackerAbilityActive: true,
          defenderAbility: undefined,
        });
        expect(result).toBe(150);
      });
    });

    describe("むしのしらせ（発動時）", () => {
      it("発動時、むしタイプの攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "むし",
          attackerAbility: "むしのしらせ",
          attackerAbilityActive: true,
          defenderAbility: undefined,
        });
        expect(result).toBe(150);
      });
    });

    describe("こんじょう（発動時）", () => {
      it("発動時、物理攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "ノーマル",
          attackerAbility: "こんじょう",
          attackerAbilityActive: true,
          defenderAbility: undefined,
          isPhysical: true,
        });
        expect(result).toBe(150);
      });

      it("発動時でも、特殊攻撃は影響しない", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "エスパー",
          attackerAbility: "こんじょう",
          attackerAbilityActive: true,
          defenderAbility: undefined,
          isPhysical: false,
        });
        expect(result).toBe(100);
      });
    });

    describe("ふしぎなうろこ（発動時）", () => {
      it("発動時、受ける物理ダメージが0.666倍（2/3）になる", () => {
        const result = applyAbilityEffects({
          damage: 150,
          moveType: "ノーマル",
          attackerAbility: undefined,
          defenderAbility: "ふしぎなうろこ",
          defenderAbilityActive: true,
          isPhysical: true,
        });
        expect(result).toBe(100); // 150 * 2/3 = 100
      });

      it("発動時でも、特殊ダメージは影響しない", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "エスパー",
          attackerAbility: undefined,
          defenderAbility: "ふしぎなうろこ",
          defenderAbilityActive: true,
          isPhysical: false,
        });
        expect(result).toBe(100);
      });
    });

    describe("プラス/マイナス（発動時）", () => {
      it("プラス発動時、特殊攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "でんき",
          attackerAbility: "プラス",
          attackerAbilityActive: true,
          defenderAbility: undefined,
          isPhysical: false,
        });
        expect(result).toBe(150);
      });

      it("マイナス発動時、特殊攻撃が1.5倍になる", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "でんき",
          attackerAbility: "マイナス",
          attackerAbilityActive: true,
          defenderAbility: undefined,
          isPhysical: false,
        });
        expect(result).toBe(150);
      });

      it("発動時でも、物理攻撃は影響しない", () => {
        const result = applyAbilityEffects({
          damage: 100,
          moveType: "ノーマル",
          attackerAbility: "プラス",
          attackerAbilityActive: true,
          defenderAbility: undefined,
          isPhysical: true,
        });
        expect(result).toBe(100);
      });
    });
  });
});
