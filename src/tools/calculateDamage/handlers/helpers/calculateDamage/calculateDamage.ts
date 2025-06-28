import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import { calculateDamageWithContext } from "@/utils/calculateDamageWithContext";
import type { ResolvedMove } from "../resolveMove";

/**
 * 通常のダメージを計算
 */
export const calculateNormalDamage = (
  input: CalculateDamageInput & { move: ResolvedMove },
  attackStat: number,
  defenseStat: number,
): number[] => {
  return calculateDamageWithContext({
    move: input.move,
    attackStat,
    defenseStat,
    attacker: {
      level: input.attacker.level,
      statModifier: input.attacker.statModifier,
      pokemon: input.attacker.pokemon,
      ability: input.attacker.ability,
      abilityActive: input.attacker.abilityActive,
      item: input.attacker.item,
    },
    defender: {
      statModifier: input.defender.statModifier,
      pokemon: input.defender.pokemon,
      ability: input.defender.ability,
      abilityActive: input.defender.abilityActive,
      item: input.defender.item,
    },
    options: input.options,
  });
};
