import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { CalculatedStats } from "@/tools/calculateDamage/types";
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
