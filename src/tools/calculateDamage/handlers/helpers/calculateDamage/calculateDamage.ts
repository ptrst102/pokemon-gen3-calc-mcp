import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { DamageOptions } from "@/tools/calculateDamage/types";
import type { TypeName } from "@/types";
import { adjustSpecialMoves } from "@/utils/adjustSpecialMoves";
import { calculateDamageCore } from "@/utils/calculateDamageCore";
import { calculateItemEffects } from "../itemEffects";
import { getStatModifierRatio } from "../statModifier";

/**
 * 内部的なダメージ計算パラメータ
 */
interface InternalDamageParams {
  move: {
    name?: string;
    type: TypeName;
    power: number;
    isPhysical: boolean;
  };
  attacker: {
    level: number;
    attack: number;
    attackModifier: number;
    types?: TypeName[];
    pokemonName?: string;
    ability?: Ability;
    abilityActive?: boolean;
    item?: Item;
  };
  defender: {
    defense: number;
    defenseModifier: number;
    types: TypeName[];
    pokemonName?: string;
    ability?: Ability;
    abilityActive?: boolean;
    item?: Item;
  };
  options: DamageOptions;
}

/**
 * ダメージ計算の主処理
 * 補正値、タイプ相性、とくせい効果を全て適用
 */
const calculateDamageInternal = (params: InternalDamageParams): number[] => {
  const { move, attacker, defender, options } = params;

  const attackerItemEffects = calculateItemEffects(
    attacker.item,
    attacker.pokemonName,
    move.type,
    move.isPhysical,
  );

  const defenderItemEffects = calculateItemEffects(
    defender.item,
    defender.pokemonName,
    move.type,
    move.isPhysical,
  );

  const attackRatio = getStatModifierRatio(attacker.attackModifier);
  const baseAttackStat = Math.floor(
    (attacker.attack * attackRatio.numerator) / attackRatio.denominator,
  );

  const attackStat = move.isPhysical
    ? Math.floor(
        (baseAttackStat * attackerItemEffects.attackMultiplier.numerator) /
          attackerItemEffects.attackMultiplier.denominator,
      )
    : Math.floor(
        (baseAttackStat *
          attackerItemEffects.specialAttackMultiplier.numerator) /
          attackerItemEffects.specialAttackMultiplier.denominator,
      );

  const defenseRatio = getStatModifierRatio(defender.defenseModifier);
  const baseDefenseStat = Math.floor(
    (defender.defense * defenseRatio.numerator) / defenseRatio.denominator,
  );

  const defenseStat = move.isPhysical
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
      attackStat,
      types: attacker.types,
      ability: attacker.ability,
      abilityActive: attacker.abilityActive,
    },
    defender: {
      defenseStat,
      types: defender.types,
      ability: defender.ability,
      abilityActive: defender.abilityActive,
    },
    options,
  });
};

/**
 * 通常のダメージを計算
 */
export const calculateNormalDamage = (
  input: CalculateDamageInput,
  attackStat: number,
  defenseStat: number,
): number[] => {
  const defenderTypes = input.defender.pokemon?.types || [];

  // 特殊な技の処理
  const adjustedMove = adjustSpecialMoves({
    move: input.move,
    weather: input.options?.weather,
    defenderWeight: input.defender.pokemon?.weightkg,
  });

  return calculateDamageInternal({
    move: {
      name: adjustedMove.name,
      type: adjustedMove.type,
      power: adjustedMove.power,
      isPhysical: adjustedMove.isPhysical,
    },
    attacker: {
      level: input.attacker.level,
      attack: attackStat,
      attackModifier: input.attacker.statModifier,
      types: input.attacker.pokemon?.types,
      pokemonName: input.attacker.pokemon?.name,
      ability: input.attacker.ability,
      abilityActive: input.attacker.abilityActive,
      item: input.attacker.item,
    },
    defender: {
      defense: defenseStat,
      defenseModifier: input.defender.statModifier,
      types: defenderTypes,
      pokemonName: input.defender.pokemon?.name,
      ability: input.defender.ability,
      abilityActive: input.defender.abilityActive,
      item: input.defender.item,
    },
    options: input.options || {},
  });
};
