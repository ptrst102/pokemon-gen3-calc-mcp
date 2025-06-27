import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { Pokemon } from "@/data/pokemon";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { DamageCalculationContext } from "@/tools/calculateDamage/types";
import type { TypeName } from "@/types";
import { getHiddenPowerPower, getHiddenPowerType } from "@/utils/hiddenPower";
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

const prepareMoveInfo = (input: CalculateDamageInput): MoveInfo => {
  const baseMove = {
    name: "name" in input.move ? input.move.name : undefined,
    type: input.move.type,
    power: input.move.power,
    isPhysical: input.move.isPhysical,
  };

  // めざめるパワーの処理
  if (baseMove.name === "めざめるパワー") {
    // 実数値のみ指定の場合はエラー
    if ("value" in input.attacker.stat) {
      throw new Error(
        "めざめるパワーを使用する場合は、攻撃側ポケモンの個体値を指定する必要があります",
      );
    }

    // allIVsが指定されていない場合、全て31として扱う
    const ivs = input.attacker.allIVs || {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31,
    };

    const hiddenPowerType = getHiddenPowerType(ivs);
    const hiddenPowerPower = getHiddenPowerPower(ivs);

    return {
      ...baseMove,
      type: hiddenPowerType as TypeName,
      power: hiddenPowerPower,
    };
  }

  return baseMove;
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

  const move = prepareMoveInfo(input);

  const typeEffectiveness = getTypeEffectiveness(move.type, defenderTypes);

  const isStab = checkStab(input.attacker.pokemon?.types, move.type);

  return {
    move,
    attacker: preparePokemonInfo(input.attacker),
    defender: preparePokemonInfo(input.defender),
    typeEffectiveness,
    isStab,
    options: input.options,
  };
};
