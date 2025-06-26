import { applyAbilityEffects } from "@/tools/calculateDamage/handlers/helpers/abilityEffects";
import { calculateBaseDamage } from "@/tools/calculateDamage/handlers/helpers/calculateBaseDamage";
import { getDamageRanges } from "@/tools/calculateDamage/handlers/helpers/damageRanges";
import { calculateItemEffects } from "@/tools/calculateDamage/handlers/helpers/itemEffects";
import { getStatModifierRatio } from "@/tools/calculateDamage/handlers/helpers/statModifier";
import { getTypeEffectiveness } from "@/tools/calculateDamage/handlers/helpers/typeEffectiveness";
import type { TypeName } from "@/types";

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
    pokemon?: { types?: TypeName[] };
    ability?: { name?: string };
    abilityActive?: boolean;
    item?: { name?: string };
    pokemonName?: string;
  };
  options: {
    weather?: "はれ" | "あめ";
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
  const { move, attackStat, defenseStat, attacker, defender, options } = params;

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

  // 場の状態による防御補正
  const finalDefenseStat = (() => {
    if (move.isPhysical && options.reflect) {
      return itemAdjustedDefenseStat * 2;
    }
    if (!move.isPhysical && options.lightScreen) {
      return itemAdjustedDefenseStat * 2;
    }
    return itemAdjustedDefenseStat;
  })();

  // 技の威力を計算（じゅうでん、どろあそび、みずあそびを考慮）
  const finalPower = (() => {
    let power = move.power;

    // じゅうでん
    if (options.charge && move.type === "でんき") {
      power = Math.floor(power * 2);
    }

    // どろあそび
    if (options.mudSport && move.type === "でんき") {
      power = Math.floor(power * 0.5);
    }

    // みずあそび
    if (options.waterSport && move.type === "ほのお") {
      power = Math.floor(power * 0.5);
    }

    return power;
  })();

  // 基本ダメージを計算
  const baseDamage = calculateBaseDamage({
    level: attacker.level,
    power: finalPower,
    attack: finalAttackStat,
    defense: finalDefenseStat,
    isPhysical: move.isPhysical,
  });

  // とくせい効果を適用
  const abilityAdjustedDamage = applyAbilityEffects({
    damage: baseDamage,
    moveType: move.type,
    isPhysical: move.isPhysical,
    attackerAbility: attacker.ability?.name,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbility: defender.ability?.name,
    defenderAbilityActive: defender.abilityActive,
  });

  // タイプ相性を計算
  const effectiveness = getTypeEffectiveness(
    move.type,
    defender.pokemon?.types || [],
  );

  // タイプ一致ボーナス
  const hasStab = attacker.pokemon?.types?.includes(move.type) ?? false;
  const stabMultiplier = hasStab ? 1.5 : 1;

  // 天候効果
  const weatherMultiplier = (() => {
    if (options.weather === "はれ") {
      if (move.type === "ほのお") return 1.5;
      if (move.type === "みず") return 0.5;
    }
    if (options.weather === "あめ") {
      if (move.type === "みず") return 1.5;
      if (move.type === "ほのお") return 0.5;
    }
    return 1;
  })();

  // 最終的なダメージを計算
  const finalDamage = Math.floor(
    abilityAdjustedDamage * effectiveness * stabMultiplier * weatherMultiplier,
  );

  // ダメージ乱数（16通り）を計算
  return getDamageRanges(finalDamage);
};
