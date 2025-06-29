import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { Pokemon } from "@/data/pokemon";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { DamageCalculationContext } from "@/tools/calculateDamage/types";
import type { TypeName } from "@/types";
import { getTypeEffectiveness } from "./typeEffectiveness";

/**
 * わざの情報
 */
interface MoveInfo {
  name?: string;
  type: TypeName;
  power: number;
  isPhysical: boolean;
}

/**
 * ポケモンの情報（攻撃側/防御側共通）
 */
interface PokemonInfo {
  level: number;
  pokemon?: Pokemon;
  item?: Item;
  ability?: Ability;
  abilityActive?: boolean;
  statModifier: number;
}

const prepareMoveInfo = (move: MoveInfo): MoveInfo => {
  return {
    name: move.name,
    type: move.type,
    power: move.power,
    isPhysical: move.isPhysical,
  };
};

/**
 * ポケモン情報を準備する
 */
const preparePokemonInfo = (
  pokemon: CalculateDamageInput["attacker"] | CalculateDamageInput["defender"],
): PokemonInfo => {
  return {
    level: pokemon.level,
    pokemon: pokemon.pokemon,
    item: pokemon.item,
    ability: pokemon.ability,
    statModifier: pokemon.statModifier,
  };
};

const checkStab = (
  attackerTypes: string[] | undefined,
  moveType: string,
): boolean => {
  if (!attackerTypes) {
    return false;
  }
  return attackerTypes.some((type) => type === moveType);
};

/**
 * ダメージ計算に必要な共通情報を準備
 */
export const prepareCalculationContext = (
  input: CalculateDamageInput & { move: MoveInfo },
): DamageCalculationContext => {
  const defenderTypes = input.defender.pokemon?.types || [];
  if (defenderTypes.length === 0) {
    throw new Error("防御側のタイプ情報が必要です");
  }

  const typeEffectiveness = getTypeEffectiveness(
    input.move.type,
    defenderTypes,
  );

  const isStab = checkStab(input.attacker.pokemon?.types, input.move.type);

  return {
    move: prepareMoveInfo(input.move),
    attacker: preparePokemonInfo(input.attacker),
    defender: preparePokemonInfo(input.defender),
    typeEffectiveness,
    isStab,
    options: input.options,
  };
};
