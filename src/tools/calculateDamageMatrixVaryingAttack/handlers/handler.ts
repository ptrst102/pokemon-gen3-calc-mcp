import { ZodError } from "zod";
import type { TypeName } from "@/types";
import { calculateDamageWithContext } from "@/utils/calculateDamageWithContext";
import { calculateStat } from "@/utils/calculateStat";
import { getHiddenPowerPower, getHiddenPowerType } from "@/utils/hiddenPower";
import { NATURE_MODIFIER_MAP } from "@/utils/natureModifier";
import {
  type CalculateDamageMatrixVaryingAttackInput,
  calculateDamageMatrixVaryingAttackInputSchema,
} from "./schemas/damageMatrixVaryingAttackSchema";

interface DamageMatrixEntry {
  ev: number;
  attackStat: number;
  damages: number[];
}

/**
 * 攻撃側の努力値を総当たりしてダメージ計算を行う
 */
export const calculateDamageMatrixVaryingAttackHandler = async (
  args: unknown,
): Promise<{
  content: Array<{ type: "text"; text: string }>;
}> => {
  try {
    const input = calculateDamageMatrixVaryingAttackInputSchema.parse(args);
    const results = calculateDamageMatrix(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "入力値が不正です",
                details: error.errors.map((e) => ({
                  path: e.path.join("."),
                  message: e.message,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "不明なエラーが発生しました",
            },
            null,
            2,
          ),
        },
      ],
    };
  }
};

/**
 * ダメージマトリックスを計算
 */
const calculateDamageMatrix = (
  input: CalculateDamageMatrixVaryingAttackInput,
): { damageMatrix: DamageMatrixEntry[] } => {
  const { move, attacker, defender, options } = input;

  // めざめるパワーの特別処理
  const finalMove = (() => {
    if ("hiddenPowerIVs" in move && move.hiddenPowerIVs) {
      const type = getHiddenPowerType(move.hiddenPowerIVs) as TypeName;
      const power = getHiddenPowerPower(move.hiddenPowerIVs);
      // わざのタイプから物理技か特殊技かを判定する
      const isPhysical = [
        "ノーマル",
        "かくとう",
        "どく",
        "じめん",
        "ひこう",
        "むし",
        "いわ",
        "ゴースト",
        "はがね",
      ].includes(type);

      return {
        name: move.name || "めざめるパワー",
        type,
        power,
        isPhysical,
      };
    }
    return move;
  })();

  // 防御側のステータスを計算
  const defenseStat = (() => {
    if ("value" in defender.stat) {
      return defender.stat.value;
    }

    const baseStat = finalMove.isPhysical
      ? (defender.pokemon?.baseStats.def ?? 100)
      : (defender.pokemon?.baseStats.spd ?? 100);

    return calculateStat({
      baseStat,
      level: defender.level,
      iv: defender.stat.iv,
      ev: defender.stat.ev,
      natureModifier:
        NATURE_MODIFIER_MAP[defender.stat.natureModifier || "neutral"],
    });
  })();

  // 攻撃側の基礎情報
  const attackerBaseStat = attacker.isPhysicalAttack
    ? attacker.pokemon.baseStats.atk
    : attacker.pokemon.baseStats.spa;

  // 努力値の範囲（0, 4, 12, 20, ..., 252）
  const evValues: number[] = [0];
  for (let ev = 4; ev <= 252; ev += 8) {
    evValues.push(ev);
  }

  // 各努力値でダメージを計算
  const damageMatrix: DamageMatrixEntry[] = evValues.map((ev) => {
    // 攻撃/特攻の実数値を計算
    const attackStat = calculateStat({
      baseStat: attackerBaseStat,
      level: attacker.level,
      iv: attacker.stat.iv,
      ev,
      natureModifier:
        NATURE_MODIFIER_MAP[attacker.stat.natureModifier || "neutral"],
    });

    // ダメージ計算
    const damages = calculateDamageWithContext({
      move: {
        name: finalMove.name,
        type: finalMove.type,
        power: finalMove.power,
        isPhysical: finalMove.isPhysical,
      },
      attackStat,
      defenseStat,
      attacker: {
        level: attacker.level,
        statModifier: attacker.statModifier,
        pokemon: attacker.pokemon,
        ability: attacker.ability ? { name: attacker.ability.name } : undefined,
        abilityActive: attacker.abilityActive,
        item: attacker.item ? { name: attacker.item.name } : undefined,
        pokemonName: attacker.pokemonName,
      },
      defender: {
        statModifier: defender.statModifier,
        pokemon: defender.pokemon,
        ability: defender.ability ? { name: defender.ability.name } : undefined,
        abilityActive: defender.abilityActive,
        item: defender.item ? { name: defender.item.name } : undefined,
        pokemonName: defender.pokemonName,
      },
      options,
    });

    return {
      ev,
      attackStat,
      damages,
    };
  });

  return { damageMatrix };
};
