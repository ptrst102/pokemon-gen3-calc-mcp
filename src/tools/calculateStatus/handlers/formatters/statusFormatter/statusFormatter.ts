import type { Pokemon } from "@/data/pokemon";
import type { StatsObj } from "@/types";

interface FormatStatusResultInput {
  pokemon: Pokemon;
  stats: StatsObj;
}

export const statusFormatter = ({
  pokemon,
  stats,
}: FormatStatusResultInput): string => {
  return `【${pokemon.name}】

ステータス実数値:
HP: ${stats.hp}
こうげき: ${stats.atk}
ぼうぎょ: ${stats.def}
とくこう: ${stats.spa}
とくぼう: ${stats.spd}
すばやさ: ${stats.spe}`;
};
