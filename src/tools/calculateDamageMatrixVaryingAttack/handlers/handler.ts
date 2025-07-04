import { ZodError } from "zod";
import { resolveMove } from "@/tools/calculateDamage/handlers/helpers/resolveMove";
import { calculateDamageWithContext } from "@/utils/calculateDamageWithContext";
import { calculateStat } from "@/utils/calculateStat";
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

    // 技の解決処理を追加
    const resolvedMove = resolveMove(input.move);
    const inputWithResolvedMove = {
      ...input,
      move: resolvedMove,
    };

    const results = calculateDamageMatrix(inputWithResolvedMove);

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
  input: CalculateDamageMatrixVaryingAttackInput & {
    move: ReturnType<typeof resolveMove>;
  },
): { damageMatrix: DamageMatrixEntry[] } => {
  const { move, attacker, defender, options } = input;

  // 防御側のステータスを計算
  const defenseStat = (() => {
    if ("value" in defender.stat) {
      return defender.stat.value;
    }

    const baseStat = move.isPhysical
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
        name: move.name,
        type: move.type,
        power: move.power,
        isPhysical: move.isPhysical,
      },
      attackStat,
      defenseStat,
      attacker: {
        level: attacker.level,
        statModifier: attacker.statModifier,
        pokemon: attacker.pokemon,
        ability: attacker.ability,
        abilityActive: attacker.abilityActive,
        item: attacker.item,
      },
      defender: {
        statModifier: defender.statModifier,
        pokemon: defender.pokemon,
        ability: defender.ability,
        abilityActive: defender.abilityActive,
        item: defender.item,
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
