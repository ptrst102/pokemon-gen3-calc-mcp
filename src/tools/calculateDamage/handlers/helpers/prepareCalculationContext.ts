import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { Pokemon } from "@/data/pokemon";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { DamageCalculationContext } from "@/tools/calculateDamage/types";
import type { TypeName } from "@/types";
import { getHiddenPowerPower, getHiddenPowerType } from "@/utils/hiddenPower";
import { getTypeEffectiveness } from "./typeEffectiveness";

// わざのタイプから物理技か特殊技かを判定する
const isPhysicalType = (type: TypeName): boolean =>
  [
    "ノーマル",
    "かくとう",
    "どく",
    "じめん",
    "ひこう",
    "むし",
    "いわ",
    "ゴースト",
    "はがね",
  ].includes(type);

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
  if ("name" in input.move) {
    // めざめるパワーの特別処理
    if (
      input.move.name === "めざめるパワー" &&
      "hiddenPowerIVs" in input.move &&
      input.move.hiddenPowerIVs
    ) {
      const type = getHiddenPowerType(input.move.hiddenPowerIVs) as TypeName;
      const power = getHiddenPowerPower(input.move.hiddenPowerIVs);
      const isPhysical = isPhysicalType(type);

      return {
        name: input.move.name,
        type,
        power,
        isPhysical,
      };
    }

    return {
      name: input.move.name,
      type: input.move.type,
      power: input.move.power,
      isPhysical: input.move.isPhysical,
    };
  }

  // タイプと威力を直接指定した場合でも、めざめるパワーの個体値が指定されていれば計算
  if ("hiddenPowerIVs" in input.move && input.move.hiddenPowerIVs) {
    const type = getHiddenPowerType(input.move.hiddenPowerIVs) as TypeName;
    const power = getHiddenPowerPower(input.move.hiddenPowerIVs);
    const isPhysical = isPhysicalType(type);

    return {
      type,
      power,
      isPhysical,
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

  const moveType =
    "hiddenPowerIVs" in input.move && input.move.hiddenPowerIVs
      ? (getHiddenPowerType(input.move.hiddenPowerIVs) as TypeName)
      : input.move.type;

  const typeEffectiveness = getTypeEffectiveness(moveType, defenderTypes);

  const isStab = checkStab(input.attacker.pokemon?.types, moveType);

  return {
    move: prepareMoveInfo(input),
    attacker: preparePokemonInfo(input.attacker),
    defender: preparePokemonInfo(input.defender),
    typeEffectiveness,
    isStab,
    options: input.options,
  };
};
