import type { AbilityName } from "@/data/abilities";
import type { TypeName } from "@/types";

interface ApplyAbilityEffectsParams {
  damage: number;
  moveType: TypeName;
  attackerAbility?: AbilityName;
  defenderAbility?: AbilityName;
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

  let modifiedDamage = damage;

  if (attackerAbility) {
    // 常時発動とくせい
    if (
      (attackerAbility === "ちからもち" || attackerAbility === "ヨガパワー") &&
      isPhysical
    ) {
      modifiedDamage = Math.floor(modifiedDamage * 2);
    }

    if (attackerAbility === "はりきり" && isPhysical) {
      modifiedDamage = Math.floor(modifiedDamage * 1.5);
    }

    // 条件付きとくせい（発動時のみ）
    if (attackerAbilityActive) {
      // HP1/3以下で発動するタイプ強化とくせい
      if (attackerAbility === "もうか" && moveType === "ほのお") {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }
      if (attackerAbility === "げきりゅう" && moveType === "みず") {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }
      if (attackerAbility === "しんりょく" && moveType === "くさ") {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }
      if (attackerAbility === "むしのしらせ" && moveType === "むし") {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }

      // こんじょう（状態異常時、物理攻撃1.5倍）
      if (attackerAbility === "こんじょう" && isPhysical) {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }

      // プラス/マイナス（ダブルバトルで相手がプラス/マイナス持ちの時、特殊攻撃1.5倍）
      if (
        (attackerAbility === "プラス" || attackerAbility === "マイナス") &&
        !isPhysical
      ) {
        modifiedDamage = Math.floor(modifiedDamage * 1.5);
      }
    }
  }

  if (defenderAbility) {
    // 常時発動とくせい
    if (defenderAbility === "ふゆう" && moveType === "じめん") {
      return 0;
    }

    if (
      defenderAbility === "ふしぎなまもり" &&
      typeEffectiveness !== undefined
    ) {
      if (typeEffectiveness <= 1) {
        return 0;
      }
    }

    // 条件付きとくせい（発動時のみ）
    if (defenderAbilityActive) {
      // ふしぎなうろこ（状態異常時、防御1.5倍 = 物理ダメージを2/3に軽減）
      if (defenderAbility === "ふしぎなうろこ" && isPhysical) {
        modifiedDamage = Math.floor((modifiedDamage * 2) / 3);
      }
    }
  }

  return modifiedDamage;
};
