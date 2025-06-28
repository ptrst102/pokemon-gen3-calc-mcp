import type { Ability } from "@/data/abilities";
import type { TypeName } from "@/types";

interface ApplyAbilityEffectsParams {
  damage: number;
  moveType: TypeName;
  attackerAbility?: Ability;
  defenderAbility?: Ability;
  attackerAbilityActive?: boolean;
  defenderAbilityActive?: boolean;
  typeEffectiveness?: number;
  isPhysical?: boolean;
}

export const applyAbilityEffects = (
  params: ApplyAbilityEffectsParams,
): number => {
  const {
    damage,
    moveType,
    attackerAbility,
    defenderAbility,
    attackerAbilityActive,
    defenderAbilityActive,
    typeEffectiveness,
    isPhysical,
  } = params;

  // 防御側とくせいによる無効化チェック（早期return）
  if (defenderAbility) {
    if (defenderAbility.name === "ふゆう" && moveType === "じめん") {
      return 0;
    }

    if (
      defenderAbility.name === "ふしぎなまもり" &&
      typeEffectiveness !== undefined &&
      typeEffectiveness <= 1
    ) {
      return 0;
    }
  }

  // 攻撃側とくせいによるダメージ補正を計算
  const attackerModifiedDamage = (() => {
    if (!attackerAbility) {
      return damage;
    }

    // 常時発動とくせい
    const constantAbilityDamage = (() => {
      if (
        (attackerAbility.name === "ちからもち" ||
          attackerAbility.name === "ヨガパワー") &&
        isPhysical
      ) {
        return Math.floor(damage * 2);
      }

      if (attackerAbility.name === "はりきり" && isPhysical) {
        return Math.floor(damage * 1.5);
      }

      return damage;
    })();

    // 条件付きとくせい（発動時のみ）
    if (!attackerAbilityActive) {
      return constantAbilityDamage;
    }

    // HP1/3以下で発動するタイプ強化とくせい
    if (
      (attackerAbility.name === "もうか" && moveType === "ほのお") ||
      (attackerAbility.name === "げきりゅう" && moveType === "みず") ||
      (attackerAbility.name === "しんりょく" && moveType === "くさ") ||
      (attackerAbility.name === "むしのしらせ" && moveType === "むし")
    ) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    // こんじょう（状態異常時、物理攻撃1.5倍）
    if (attackerAbility.name === "こんじょう" && isPhysical) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    // プラス/マイナス（ダブルバトルで相手がプラス/マイナス持ちの時、特殊攻撃1.5倍）
    if (
      (attackerAbility.name === "プラス" ||
        attackerAbility.name === "マイナス") &&
      !isPhysical
    ) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    return constantAbilityDamage;
  })();

  // 防御側とくせいによるダメージ軽減
  if (
    defenderAbility &&
    defenderAbility.name === "ふしぎなうろこ" &&
    defenderAbilityActive &&
    isPhysical
  ) {
    return Math.floor((attackerModifiedDamage * 2) / 3);
  }

  return attackerModifiedDamage;
};
