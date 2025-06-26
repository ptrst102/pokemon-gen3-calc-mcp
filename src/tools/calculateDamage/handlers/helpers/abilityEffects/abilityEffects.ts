import type { TypeName } from "@/types";

interface ApplyAbilityEffectsParams {
  damage: number;
  moveType: TypeName;
  attackerAbility?: string;
  defenderAbility?: string;
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
    if (defenderAbility === "ふゆう" && moveType === "じめん") {
      return 0;
    }

    if (
      defenderAbility === "ふしぎなまもり" &&
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
        (attackerAbility === "ちからもち" ||
          attackerAbility === "ヨガパワー") &&
        isPhysical
      ) {
        return Math.floor(damage * 2);
      }

      if (attackerAbility === "はりきり" && isPhysical) {
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
      (attackerAbility === "もうか" && moveType === "ほのお") ||
      (attackerAbility === "げきりゅう" && moveType === "みず") ||
      (attackerAbility === "しんりょく" && moveType === "くさ") ||
      (attackerAbility === "むしのしらせ" && moveType === "むし")
    ) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    // こんじょう（状態異常時、物理攻撃1.5倍）
    if (attackerAbility === "こんじょう" && isPhysical) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    // プラス/マイナス（ダブルバトルで相手がプラス/マイナス持ちの時、特殊攻撃1.5倍）
    if (
      (attackerAbility === "プラス" || attackerAbility === "マイナス") &&
      !isPhysical
    ) {
      return Math.floor(constantAbilityDamage * 1.5);
    }

    return constantAbilityDamage;
  })();

  // 防御側とくせいによるダメージ軽減
  if (
    defenderAbility === "ふしぎなうろこ" &&
    defenderAbilityActive &&
    isPhysical
  ) {
    return Math.floor((attackerModifiedDamage * 2) / 3);
  }

  return attackerModifiedDamage;
};
