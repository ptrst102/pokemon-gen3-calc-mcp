import type { StatsObj } from "@/types";
import { calculateHp } from "@/utils/calculateHp";
import { calculateStat } from "@/utils/calculateStat";
import { natureModifier } from "@/utils/natureModifier";
import { formatError } from "./helpers";
import { calculateStatusInputSchema } from "./schemas/statusSchema";

export const calculateStatusHandler = async (args: unknown) => {
  try {
    const parsedData = calculateStatusInputSchema.parse(args);

    const { pokemon, nature, level, ivs, evs } = parsedData;

    // ステータス実数値の計算
    const hp =
      pokemon.name === "ヌケニン"
        ? 1 // ヌケニンのHPは常に1
        : calculateHp({
            baseStat: pokemon.baseStats.hp,
            iv: ivs.hp,
            ev: evs.hp,
            level,
          });

    const atk = calculateStat({
      baseStat: pokemon.baseStats.atk,
      iv: ivs.atk,
      ev: evs.atk,
      level,
      natureModifier: natureModifier(nature, "atk"),
    });

    const def = calculateStat({
      baseStat: pokemon.baseStats.def,
      iv: ivs.def,
      ev: evs.def,
      level,
      natureModifier: natureModifier(nature, "def"),
    });

    const spa = calculateStat({
      baseStat: pokemon.baseStats.spa,
      iv: ivs.spa,
      ev: evs.spa,
      level,
      natureModifier: natureModifier(nature, "spa"),
    });

    const spd = calculateStat({
      baseStat: pokemon.baseStats.spd,
      iv: ivs.spd,
      ev: evs.spd,
      level,
      natureModifier: natureModifier(nature, "spd"),
    });

    const spe = calculateStat({
      baseStat: pokemon.baseStats.spe,
      iv: ivs.spe,
      ev: evs.spe,
      level,
      natureModifier: natureModifier(nature, "spe"),
    });

    const stats: StatsObj = { hp, atk, def, spa, spd, spe };

    return {
      structuredContent: {
        pokemonName: pokemon.name,
        stats,
      },
    };
  } catch (error) {
    return formatError(error);
  }
};
