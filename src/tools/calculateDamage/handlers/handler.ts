import type {
  EvRangeDamageResult,
  NormalDamageResult,
} from "../types/damageCalculation";
import { formatDamageResult } from "./formatters/damageFormatter";
import { formatDamageWithEvRange } from "./formatters/damageWithEvRangeFormatter";
import {
  calculateAttackerEvDamages,
  calculateDefenderEvDamages,
  calculateNormalDamage,
} from "./helpers/calculateEvDamages";
import {
  getCalculatedStats,
  hasBothEvArrays,
  hasEvCalculation,
  isAttackerEvArray,
  isDefenderEvArray,
} from "./helpers/calculateStats";
import { formatError } from "./helpers/formatError";
import { prepareCalculationContext } from "./helpers/prepareCalculationContext";
import {
  type CalculateDamageInput,
  calculateDamageInputSchema,
} from "./schemas/damageSchema";

/**
 * 防御側のステータスを固定し、攻撃側のEV別ダメージを計算
 */
const handleAttackerEvCalculation = (
  input: CalculateDamageInput,
  attackStatArray: number[],
  fixedDefenseStat: number,
): { content: { type: "text"; text: string }[] } => {
  const context = prepareCalculationContext(input);
  const evResults = calculateAttackerEvDamages(
    input,
    attackStatArray,
    fixedDefenseStat,
  );

  const result: EvRangeDamageResult = {
    ...context,
    evResults,
    fixedStat: fixedDefenseStat,
    isAttackerEv: true,
  };

  const formattedResult = formatDamageWithEvRange(result);

  return {
    content: [
      {
        type: "text",
        text: formattedResult,
      },
    ],
  };
};

/**
 * 攻撃側のステータスを固定し、防御側のEV別ダメージを計算
 */
const handleDefenderEvCalculation = (
  input: CalculateDamageInput,
  fixedAttackStat: number,
  defenseStatArray: number[],
): { content: { type: "text"; text: string }[] } => {
  const context = prepareCalculationContext(input);
  const evResults = calculateDefenderEvDamages(
    input,
    fixedAttackStat,
    defenseStatArray,
  );

  const result: EvRangeDamageResult = {
    ...context,
    evResults,
    fixedStat: fixedAttackStat,
    isAttackerEv: false,
  };

  const formattedResult = formatDamageWithEvRange(result);

  return {
    content: [
      {
        type: "text",
        text: formattedResult,
      },
    ],
  };
};

/**
 * 通常のダメージ計算を処理する
 */
const handleNormalCalculation = (
  input: CalculateDamageInput,
  attackStat: number,
  defenseStat: number,
): { content: { type: "text"; text: string }[] } => {
  const context = prepareCalculationContext(input);
  const damages = calculateNormalDamage(input, attackStat, defenseStat);

  const result: NormalDamageResult = {
    ...context,
    damages,
    attackStat,
    defenseStat,
  };

  const formattedResult = formatDamageResult(result);

  return {
    content: [
      {
        type: "text",
        text: formattedResult,
      },
    ],
  };
};

/**
 * EV計算を処理する
 */
const handleEvCalculation = (
  input: CalculateDamageInput,
  stats: ReturnType<typeof getCalculatedStats>,
): { content: { type: "text"; text: string }[] } => {
  const { attackStat, defenseStat } = stats;

  if (isAttackerEvArray(attackStat)) {
    if (!isDefenderEvArray(defenseStat)) {
      return handleAttackerEvCalculation(input, attackStat, defenseStat);
    }
  }

  if (isDefenderEvArray(defenseStat)) {
    if (!isAttackerEvArray(attackStat)) {
      return handleDefenderEvCalculation(input, attackStat, defenseStat);
    }
  }

  throw new Error("内部エラー: 予期しない状態です");
};

/**
 * ダメージ計算ハンドラー
 */
export const calculateDamageHandler = async (
  args: unknown,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const input = calculateDamageInputSchema.parse(args);

    const stats = getCalculatedStats(input);

    if (hasBothEvArrays(stats)) {
      throw new Error(
        "攻撃側と防御側の両方でcalculateAllEvsを使うことはできません",
      );
    }

    if (hasEvCalculation(stats)) {
      return handleEvCalculation(input, stats);
    }

    if (
      !isAttackerEvArray(stats.attackStat) &&
      !isDefenderEvArray(stats.defenseStat)
    ) {
      return handleNormalCalculation(
        input,
        stats.attackStat,
        stats.defenseStat,
      );
    }

    throw new Error("内部エラー: 予期しない状態です");
  } catch (error) {
    return formatError(error);
  }
};
