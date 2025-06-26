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

// 性格補正の値も総当たりで計算する場合の補正値
const NATURE_MODIFIERS = [0.9, 1.0, 1.1]; // マイナス補正、補正なし、プラス補正

// 0から252まで4刻みの努力値配列を明示的に生成
const EV_VALUES = Array.from({ length: 64 }, (_, i) => i * 4); // [0, 4, 8, ..., 252]

export const getStatValue = (params: GetStatValueParams): number | number[] => {
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

    if ("calculateAllEvs" in stat && stat.calculateAllEvs) {
      // 性格補正の総当たりも行うかどうか
      const calculateAllNatures =
        "calculateAllNatures" in stat && stat.calculateAllNatures;

      if (calculateAllNatures) {
        // 性格補正も含めた総当たり
        const allStats: number[] = [];
        const seenStats = new Set<number>();

        for (const natureModifier of NATURE_MODIFIERS) {
          for (const ev of EV_VALUES) {
            const statValue = calculateStat({
              baseStat,
              iv: stat.iv,
              ev,
              level,
              natureModifier,
            });

            // 重複するステータス値を除去
            if (!seenStats.has(statValue)) {
              seenStats.add(statValue);
              allStats.push(statValue);
            }
          }
        }

        // ステータス値でソート
        return allStats.sort((a, b) => a - b);
      } else {
        // 努力値のみの全パターンを計算（重複を除去しない）
        const stats = EV_VALUES.map((ev) =>
          calculateStat({
            baseStat,
            iv: stat.iv,
            ev,
            level,
            natureModifier: 1.0,
          }),
        );

        return stats;
      }
    }

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
