import type { TypeName } from "@/types";

export interface DamageMatrixEntry {
  defenseStat: number;
  damage: {
    min: number;
    max: number;
    rolls: number[];
  };
}

export interface DamageMatrixResult {
  move: {
    name?: string;
    type: TypeName;
    power: number;
    category: "physical" | "special";
  };
  attacker: {
    pokemonName?: string;
    level: number;
    stat: number;
  };
  damageMatrix: DamageMatrixEntry[];
  modifiers?: {
    typeEffectiveness?: number;
    stab?: boolean;
    weather?: string;
    ability?: string;
    item?: string;
  };
}