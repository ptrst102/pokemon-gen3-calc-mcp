import {
  createEvRangeDamageOutput,
  createNormalDamageOutput,
} from "./formatters/structuredOutputFormatter";
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
): {
  content: Array<{ type: "text"; text: string }>;
} => {
  const context = prepareCalculationContext(input);
  const evResults = calculateAttackerEvDamages(
    input,
    attackStatArray,
    fixedDefenseStat,
  );

  const structuredOutput = createEvRangeDamageOutput({
    ...context,
    evResults,
    fixedStat: fixedDefenseStat,
    isAttackerEv: true,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredOutput, null, 2),
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
): {
  content: Array<{ type: "text"; text: string }>;
} => {
  const context = prepareCalculationContext(input);
  const evResults = calculateDefenderEvDamages(
    input,
    fixedAttackStat,
    defenseStatArray,
  );

  const structuredOutput = createEvRangeDamageOutput({
    ...context,
    evResults,
    fixedStat: fixedAttackStat,
    isAttackerEv: false,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredOutput, null, 2),
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
): {
  content: Array<{ type: "text"; text: string }>;
} => {
  const context = prepareCalculationContext(input);
  const damages = calculateNormalDamage(input, attackStat, defenseStat);

  const structuredOutput = createNormalDamageOutput({
    ...context,
    damages,
    attackStat,
    defenseStat,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredOutput, null, 2),
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
): {
  content: Array<{ type: "text"; text: string }>;
} => {
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
): Promise<
  | {
      content: Array<{ type: "text"; text: string }>;
    }
  | {
      isError: true;
      content: Array<{ type: "text"; text: string }>;
    }
> => {
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
