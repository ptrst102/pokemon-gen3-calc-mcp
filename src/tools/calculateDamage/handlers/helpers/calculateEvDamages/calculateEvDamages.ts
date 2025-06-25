import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type {
  EvDamageEntry,
} from "@/tools/calculateDamage/types/damageCalculation";
import { calculateDamageCore } from "@/tools/shared/damageCalculation";

/**
 * 防御側のステータスを固定し、攻撃側のEV別ダメージを計算
 */
export const calculateAttackerEvDamages = (
  input: CalculateDamageInput,
  attackStatArray: number[],
  fixedDefenseStat: number,
): EvDamageEntry[] => {
  const defenderTypes = input.defender.pokemon?.types || [];
  const results: EvDamageEntry[] = [];

  for (let i = 0; i < attackStatArray.length; i++) {
    const ev = i * 4;
    const stat = attackStatArray[i];

    const damages = calculateDamageCore({
      move: {
        name: input.move.name,
        type: input.move.type,
        power: input.move.power,
        isPhysical: input.move.isPhysical,
      },
      attacker: {
        level: input.attacker.level,
        attack: stat,
        attackModifier: input.attacker.statModifier,
        types: input.attacker.pokemon?.types,
        pokemonName: input.attacker.pokemon?.name,
        ability: input.attacker.ability?.name,
        abilityActive: input.attacker.abilityActive,
        item: input.attacker.item?.name,
      },
      defender: {
        defense: fixedDefenseStat,
        defenseModifier: input.defender.statModifier,
        types: defenderTypes,
        pokemonName: input.defender.pokemon?.name,
        ability: input.defender.ability?.name,
        abilityActive: input.defender.abilityActive,
        item: input.defender.item?.name,
      },
      options: input.options || {},
    });

    results.push({ ev, stat, damages });
  }

  return results;
};

/**
 * 攻撃側のステータスを固定し、防御側のEV別ダメージを計算
 */
export const calculateDefenderEvDamages = (
  input: CalculateDamageInput,
  fixedAttackStat: number,
  defenseStatArray: number[],
): EvDamageEntry[] => {
  const defenderTypes = input.defender.pokemon?.types || [];
  const results: EvDamageEntry[] = [];

  for (let i = 0; i < defenseStatArray.length; i++) {
    const ev = i * 4;
    const stat = defenseStatArray[i];

    const damages = calculateDamageCore({
      move: {
        name: input.move.name,
        type: input.move.type,
        power: input.move.power,
        isPhysical: input.move.isPhysical,
      },
      attacker: {
        level: input.attacker.level,
        attack: fixedAttackStat,
        attackModifier: input.attacker.statModifier,
        types: input.attacker.pokemon?.types,
        pokemonName: input.attacker.pokemon?.name,
        ability: input.attacker.ability?.name,
        abilityActive: input.attacker.abilityActive,
        item: input.attacker.item?.name,
      },
      defender: {
        defense: stat,
        defenseModifier: input.defender.statModifier,
        types: defenderTypes,
        pokemonName: input.defender.pokemon?.name,
        ability: input.defender.ability?.name,
        abilityActive: input.defender.abilityActive,
        item: input.defender.item?.name,
      },
      options: input.options || {},
    });

    results.push({ ev, stat, damages });
  }

  return results;
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

  return calculateDamageCore({
    move: {
      name: input.move.name,
      type: input.move.type,
      power: input.move.power,
      isPhysical: input.move.isPhysical,
    },
    attacker: {
      level: input.attacker.level,
      attack: attackStat,
      attackModifier: input.attacker.statModifier,
      types: input.attacker.pokemon?.types,
      pokemonName: input.attacker.pokemon?.name,
      ability: input.attacker.ability?.name,
      abilityActive: input.attacker.abilityActive,
      item: input.attacker.item?.name,
    },
    defender: {
      defense: defenseStat,
      defenseModifier: input.defender.statModifier,
      types: defenderTypes,
      pokemonName: input.defender.pokemon?.name,
      ability: input.defender.ability?.name,
      abilityActive: input.defender.abilityActive,
      item: input.defender.item?.name,
    },
    options: input.options || {},
  });
};
