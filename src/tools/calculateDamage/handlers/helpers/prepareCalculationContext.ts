import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type {
  DamageCalculationContext,
  MoveInfo,
  PokemonInfo,
} from "@/tools/calculateDamage/types/damageCalculation";
import { getTypeEffectiveness } from "./typeEffectiveness";

const prepareMoveInfo = (input: CalculateDamageInput): MoveInfo => {
  if ("name" in input.move) {
    return {
      name: input.move.name,
      type: input.move.type,
      power: input.move.power,
      isPhysical: input.move.isPhysical,
    };
  }

  return {
    type: input.move.type,
    power: input.move.power,
    isPhysical: input.move.isPhysical,
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
  input: CalculateDamageInput,
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
    move: prepareMoveInfo(input),
    attacker: preparePokemonInfo(input.attacker),
    defender: preparePokemonInfo(input.defender),
    typeEffectiveness,
    isStab,
    options: input.options,
  };
};
