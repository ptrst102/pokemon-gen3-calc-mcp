import type { StatsObj } from "@/types";

export interface CalculateStatusOutput {
  pokemonName: string;
  stats: StatsObj;
}

export interface CalculateStatusErrorOutput {
  error: string;
  pokemonName: string;
  stats: StatsObj;
}
