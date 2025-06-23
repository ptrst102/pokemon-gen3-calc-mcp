import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type {
  CalculatedStats,
  StatValue,
} from "@/tools/calculateDamage/types/damageCalculation";
import { getStatValue } from "./getStatValue";

export const getCalculatedStats = (
  input: CalculateDamageInput,
): CalculatedStats => {
  const attackStat = getStatValue({
    stat: input.attacker.stat,
    level: input.attacker.level,
    statName: input.move.isPhysical ? "atk" : "spa",
    pokemonName: input.attacker.pokemonName,
  });

  const defenseStat = getStatValue({
    stat: input.defender.stat,
    level: input.defender.level,
    statName: input.move.isPhysical ? "def" : "spd",
    pokemonName: input.defender.pokemonName,
  });

  return {
    attackStat,
    defenseStat,
  };
};

export const hasEvCalculation = (stats: CalculatedStats): boolean => {
  return Array.isArray(stats.attackStat) || Array.isArray(stats.defenseStat);
};

export const hasBothEvArrays = (stats: CalculatedStats): boolean => {
  return Array.isArray(stats.attackStat) && Array.isArray(stats.defenseStat);
};

export const isAttackerEvArray = (
  attackStat: StatValue,
): attackStat is number[] => {
  return Array.isArray(attackStat);
};

export const isDefenderEvArray = (
  defenseStat: StatValue,
): defenseStat is number[] => {
  return Array.isArray(defenseStat);
};
