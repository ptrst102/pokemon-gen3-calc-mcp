import type {
  DamageCalculationContext,
  NormalDamageResult,
} from "@/tools/calculateDamage/types";

interface BaseStructuredOutput {
  move: {
    name?: string;
    type: string;
    power: number;
    category: string;
  };
  attacker?: {
    pokemonName?: string;
    level: number;
    stat?: number;
  };
  defender?: {
    pokemonName?: string;
    level: number;
    stat?: number;
  };
  modifiers: {
    typeEffectiveness: number;
    stab: boolean;
    weather?: string;
    ability?: string;
    item?: string;
  };
}

interface NormalDamageStructuredOutput extends BaseStructuredOutput {
  damage: {
    min: number;
    max: number;
    rolls: number[];
  };
}


const createBaseOutput = (
  context: DamageCalculationContext,
): BaseStructuredOutput => {
  return {
    move: {
      name: context.move.name,
      type: context.move.type,
      power: context.move.power,
      category: context.move.isPhysical ? "物理" : "特殊",
    },
    attacker: context.attacker.pokemon
      ? {
          pokemonName: context.attacker.pokemon.name,
          level: context.attacker.level,
        }
      : { level: context.attacker.level },
    defender: context.defender.pokemon
      ? {
          pokemonName: context.defender.pokemon.name,
          level: context.defender.level,
        }
      : { level: context.defender.level },
    modifiers: {
      typeEffectiveness: context.typeEffectiveness,
      stab: context.isStab,
      weather: context.options?.weather,
      ability: context.attacker.ability?.name || context.defender.ability?.name,
      item: context.attacker.item?.name || context.defender.item?.name,
    },
  };
};

export const createNormalDamageOutput = (
  result: NormalDamageResult,
): NormalDamageStructuredOutput => {
  const base = createBaseOutput(result);
  const damages = result.damages;

  return {
    ...base,
    attacker: base.attacker
      ? {
          ...base.attacker,
          stat: result.attackStat,
        }
      : { level: result.attacker.level, stat: result.attackStat },
    defender: base.defender
      ? {
          ...base.defender,
          stat: result.defenseStat,
        }
      : { level: result.defender.level, stat: result.defenseStat },
    damage: {
      min: Math.min(...damages),
      max: Math.max(...damages),
      rolls: damages,
    },
  };
};


interface ErrorStructuredOutput {
  error: string;
}

export type StructuredOutput =
  | NormalDamageStructuredOutput
  | ErrorStructuredOutput;

// Type guards
export const isNormalDamageOutput = (
  output: StructuredOutput,
): output is NormalDamageStructuredOutput => {
  return "damage" in output;
};

export const isErrorOutput = (
  output: StructuredOutput,
): output is ErrorStructuredOutput => {
  return "error" in output;
};
