import { applyAbilityEffects } from "@/tools/calculateDamage/handlers/helpers/abilityEffects";
import { calculateBaseDamage } from "@/tools/calculateDamage/handlers/helpers/calculateBaseDamage";
import { getDamageRanges } from "@/tools/calculateDamage/handlers/helpers/damageRanges";
import { calculateItemEffects } from "@/tools/calculateDamage/handlers/helpers/itemEffects";
import { getStatModifierRatio } from "@/tools/calculateDamage/handlers/helpers/statModifier";
import { getTypeEffectiveness } from "@/tools/calculateDamage/handlers/helpers/typeEffectiveness";
import type { TypeName } from "@/types";
import { adjustSpecialMoves } from "@/utils/adjustSpecialMoves";

export interface DamageCalculationParams {
  move: {
    name?: string;
    type: TypeName;
    power: number;
    isPhysical: boolean;
  };
  attackStat: number;
  defenseStat: number;
  attacker: {
    level: number;
    statModifier: number;
    pokemon?: { types?: TypeName[] };
    ability?: { name?: string };
    abilityActive?: boolean;
    item?: { name?: string };
    pokemonName?: string;
  };
  defender: {
    statModifier: number;
    pokemon?: { types?: TypeName[]; weightkg?: number };
    ability?: { name?: string };
    abilityActive?: boolean;
    item?: { name?: string };
    pokemonName?: string;
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
 * コンテキストを含むダメージ計算
 */
export const calculateDamageWithContext = (
  params: DamageCalculationParams,
): number[] => {
  const { attackStat, defenseStat, attacker, defender, options } = params;

  // 特殊な技の処理
  const move = adjustSpecialMoves({
    move: params.move,
    weather: options?.weather,
    defenderWeight: defender.pokemon?.weightkg,
  });

  // もちもの効果を計算
  const attackerItemEffects = calculateItemEffects(
    attacker.item?.name,
    attacker.pokemonName || undefined,
    move.type,
    move.isPhysical,
  );

  const defenderItemEffects = calculateItemEffects(
    defender.item?.name,
    defender.pokemonName || undefined,
    move.type,
    move.isPhysical,
  );

  // ランク補正を適用
  const attackRatio = getStatModifierRatio(attacker.statModifier);
  const baseAttackStat = Math.floor(
    (attackStat * attackRatio.numerator) / attackRatio.denominator,
  );

  const finalAttackStat = move.isPhysical
    ? Math.floor(
        (baseAttackStat * attackerItemEffects.attackMultiplier.numerator) /
          attackerItemEffects.attackMultiplier.denominator,
      )
    : Math.floor(
        (baseAttackStat *
          attackerItemEffects.specialAttackMultiplier.numerator) /
          attackerItemEffects.specialAttackMultiplier.denominator,
      );

  const defenseRatio = getStatModifierRatio(defender.statModifier);
  const baseDefenseStat = Math.floor(
    (defenseStat * defenseRatio.numerator) / defenseRatio.denominator,
  );

  const itemAdjustedDefenseStat = move.isPhysical
    ? Math.floor(
        (baseDefenseStat * defenderItemEffects.defenseMultiplier.numerator) /
          defenderItemEffects.defenseMultiplier.denominator,
      )
    : Math.floor(
        (baseDefenseStat *
          defenderItemEffects.specialDefenseMultiplier.numerator) /
          defenderItemEffects.specialDefenseMultiplier.denominator,
      );

  // じばく・だいばくはつの処理: 防御を半分にする
  const finalDefenseStat =
    move.name === "じばく" || move.name === "だいばくはつ"
      ? Math.floor(itemAdjustedDefenseStat / 2)
      : itemAdjustedDefenseStat;

  // 基本ダメージを計算
  const baseDamage = calculateBaseDamage({
    level: attacker.level,
    power: move.power,
    attack: finalAttackStat,
    defense: finalDefenseStat,
    isPhysical: move.isPhysical,
  });

  // タイプ一致ボーナス
  const stabDamage = attacker.pokemon?.types?.includes(move.type)
    ? Math.floor(baseDamage * 1.5)
    : baseDamage;

  // タイプ相性
  const typeEffectiveness = getTypeEffectiveness(
    move.type,
    defender.pokemon?.types || [],
  );
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

  // チャージ効果
  const chargeAdjustedDamage =
    options.charge && move.type === "でんき"
      ? Math.floor(weatherAdjustedDamage * 2)
      : weatherAdjustedDamage;

  // 壁効果
  const screenAdjustedDamage = (() => {
    if (move.isPhysical && options.reflect) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    if (!move.isPhysical && options.lightScreen) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    return chargeAdjustedDamage;
  })();

  // スポーツ効果
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
    isPhysical: move.isPhysical,
    attackerAbility: attacker.ability?.name,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbility: defender.ability?.name,
    defenderAbilityActive: defender.abilityActive,
    typeEffectiveness,
  });

  // 最小ダメージ保証
  const finalDamage =
    abilityAdjustedDamage > 0
      ? Math.max(1, abilityAdjustedDamage)
      : abilityAdjustedDamage;

  // ダメージ乱数（16通り）を計算
  return getDamageRanges(finalDamage);
};
