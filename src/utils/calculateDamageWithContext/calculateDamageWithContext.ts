import type { Ability } from "@/data/abilities";
import { calculateItemEffects } from "@/tools/calculateDamage/handlers/helpers/itemEffects";
import { getStatModifierRatio } from "@/tools/calculateDamage/handlers/helpers/statModifier";
import type { TypeName } from "@/types";
import { adjustSpecialMoves } from "@/utils/adjustSpecialMoves";
import { calculateDamageCore } from "@/utils/calculateDamageCore";

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
    ability?: Ability;
    abilityActive?: boolean;
    item?: { name?: string };
    pokemonName?: string;
  };
  defender: {
    statModifier: number;
    pokemon?: { types?: TypeName[]; weightkg?: number };
    ability?: Ability;
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

  // 共通ロジックを使用
  return calculateDamageCore({
    move: {
      name: move.name,
      type: move.type,
      power: move.power,
      isPhysical: move.isPhysical,
    },
    attacker: {
      level: attacker.level,
      attackStat: finalAttackStat,
      types: attacker.pokemon?.types,
      ability: attacker.ability,
      abilityActive: attacker.abilityActive,
    },
    defender: {
      defenseStat: itemAdjustedDefenseStat,
      types: defender.pokemon?.types || [],
      ability: defender.ability,
      abilityActive: defender.abilityActive,
    },
    options: options || {},
  });
};
