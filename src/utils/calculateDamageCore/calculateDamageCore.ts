import { applyAbilityEffects } from "@/tools/calculateDamage/handlers/helpers/abilityEffects";
import { calculateBaseDamage } from "@/tools/calculateDamage/handlers/helpers/calculateBaseDamage";
import { getDamageRanges } from "@/tools/calculateDamage/handlers/helpers/damageRanges";
import { getTypeEffectiveness } from "@/tools/calculateDamage/handlers/helpers/typeEffectiveness";
import type { TypeName } from "@/types";
import { applySolarBeamPenalty } from "@/utils/applySolarBeamPenalty";

export interface DamageCoreParams {
  move: {
    name?: string;
    type: TypeName;
    power: number;
    isPhysical: boolean;
  };
  attacker: {
    level: number;
    attackStat: number;
    types?: TypeName[];
    ability?: { name?: string };
    abilityActive?: boolean;
  };
  defender: {
    defenseStat: number;
    types: TypeName[];
    ability?: { name?: string };
    abilityActive?: boolean;
  };
  options: {
    weather?: "はれ" | "あめ" | "あられ" | "すなあらし";
    charge?: boolean;
    reflect?: boolean;
    lightScreen?: boolean;
    mudSport?: boolean;
    waterSport?: boolean;
  };
}

/**
 * ダメージ計算の共通コアロジック
 * calculateDamageとcalculateDamageWithContextで共通して使用される
 */
export const calculateDamageCore = (params: DamageCoreParams): number[] => {
  const { move, attacker, defender, options } = params;

  // じばく・だいばくはつの処理: 防御を半分にする
  const finalDefenseStat =
    move.name === "じばく" || move.name === "だいばくはつ"
      ? Math.floor(defender.defenseStat / 2)
      : defender.defenseStat;

  // 基本ダメージを計算
  const baseDamage = calculateBaseDamage({
    level: attacker.level,
    power: move.power,
    attack: attacker.attackStat,
    defense: finalDefenseStat,
    isPhysical: move.isPhysical,
  });

  // タイプ一致ボーナス
  const stabDamage = attacker.types?.some((type) => type === move.type)
    ? Math.floor(baseDamage * 1.5)
    : baseDamage;

  // タイプ相性
  const typeEffectiveness = getTypeEffectiveness(move.type, defender.types);
  const typeAdjustedDamage = Math.floor(stabDamage * typeEffectiveness);

  // 天候効果
  const weatherAdjustedDamage = (() => {
    if (options.weather === "はれ") {
      if (move.type === "ほのお") {
        return Math.floor(typeAdjustedDamage * 1.5);
      }
      if (move.type === "みず") {
        return Math.floor(typeAdjustedDamage * 0.5);
      }
    }
    if (options.weather === "あめ") {
      if (move.type === "みず") {
        return Math.floor(typeAdjustedDamage * 1.5);
      }
      if (move.type === "ほのお") {
        return Math.floor(typeAdjustedDamage * 0.5);
      }
    }
    return typeAdjustedDamage;
  })();

  // じゅうでん効果
  const chargeAdjustedDamage =
    options.charge && move.type === "でんき"
      ? Math.floor(weatherAdjustedDamage * 2)
      : weatherAdjustedDamage;

  // ひかりのかべ・リフレクター効果
  const screenAdjustedDamage = (() => {
    if (move.isPhysical && options.reflect) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    if (!move.isPhysical && options.lightScreen) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    return chargeAdjustedDamage;
  })();

  // どろあそび・みずあそび効果
  const sportAdjustedDamage = (() => {
    if (options.mudSport && move.type === "でんき") {
      return Math.floor(screenAdjustedDamage * 0.5);
    }
    if (options.waterSport && move.type === "ほのお") {
      return Math.floor(screenAdjustedDamage * 0.5);
    }
    return screenAdjustedDamage;
  })();

  // とくせい効果
  const abilityAdjustedDamage = applyAbilityEffects({
    damage: sportAdjustedDamage,
    moveType: move.type,
    attackerAbility: attacker.ability?.name,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbility: defender.ability?.name,
    defenderAbilityActive: defender.abilityActive,
    typeEffectiveness,
    isPhysical: move.isPhysical,
  });

  // 最小ダメージ保証
  const finalDamage =
    abilityAdjustedDamage > 0
      ? Math.max(1, abilityAdjustedDamage)
      : abilityAdjustedDamage;

  // ダメージ乱数（16通り）を計算
  const damageRanges = getDamageRanges(finalDamage);

  // ソーラービームの天候補正を適用
  return applySolarBeamPenalty(damageRanges, move.name, options.weather);
};
