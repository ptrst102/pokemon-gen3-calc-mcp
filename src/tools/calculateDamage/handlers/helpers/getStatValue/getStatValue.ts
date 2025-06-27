import { POKEMONS } from "@/data/pokemon";
import { calculateStat } from "@/utils/calculateStat";
import { NATURE_MODIFIER_MAP } from "@/utils/natureModifier";
import type { CalculateDamageInput } from "../../schemas/damageSchema";

interface GetStatValueParams {
  stat:
    | CalculateDamageInput["attacker"]["stat"]
    | CalculateDamageInput["defender"]["stat"];
  level: number;
  statName: "atk" | "def" | "spa" | "spd";
  pokemonName?: string;
}

export const getStatValue = (params: GetStatValueParams): number => {
  const { stat, level, statName, pokemonName } = params;

  if ("value" in stat) {
    return stat.value;
  }

  // ivまたはcalculateAllEvsが指定されている場合は種族値が必要
  if ("iv" in stat) {
    if (!pokemonName) {
      throw new Error("種族値の計算にはポケモン名が必要です");
    }

    const pokemon = POKEMONS.find((p) => p.name === pokemonName);
    if (!pokemon) {
      throw new Error(`ポケモン「${pokemonName}」が見つかりません`);
    }

    const baseStat = pokemon.baseStats[statName];

    if ("ev" in stat) {
      const natureModifier =
        NATURE_MODIFIER_MAP[stat.natureModifier || "neutral"];
      return calculateStat({
        baseStat,
        iv: stat.iv,
        ev: stat.ev,
        level,
        natureModifier,
      });
    }
  }

  throw new Error("無効なステータス入力です");
};
