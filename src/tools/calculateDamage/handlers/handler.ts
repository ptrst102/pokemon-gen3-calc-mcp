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
import {
  createEvRangeDamageOutput,
  createNormalDamageOutput,
  type StructuredOutput,
} from "./helpers/createStructuredOutput";
import { formatError } from "./helpers/formatError";
import { prepareCalculationContext } from "./helpers/prepareCalculationContext";
import {
  type CalculateDamageInput,
  calculateDamageInputSchema,
} from "./schemas/damageSchema";

/**
 * ダメージ計算の共通処理を行う汎用関数
 */
const createDamageResponse = <T extends object>(
  context: ReturnType<typeof prepareCalculationContext>,
  additionalData: T,
  formatter: (
    result: ReturnType<typeof prepareCalculationContext> & T,
  ) => string,
): {
  content: { type: "text"; text: string }[];
  structuredContent?: StructuredOutput;
} => {
  const result = {
    ...context,
    ...additionalData,
  };

  const formattedResult = formatter(result);

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
 * 防御側のステータスを固定し、攻撃側のEV別ダメージを計算
 */
const handleAttackerEvCalculation = (
  input: CalculateDamageInput,
  attackStatArray: number[],
  fixedDefenseStat: number,
): {
  content: { type: "text"; text: string }[];
  structuredContent: StructuredOutput;
} => {
  const context = prepareCalculationContext(input);
  const evResults = calculateAttackerEvDamages(
    input,
    attackStatArray,
    fixedDefenseStat,
  );

  const response = createDamageResponse(
    context,
    {
      evResults,
      fixedStat: fixedDefenseStat,
      isAttackerEv: true,
    },
    formatDamageWithEvRange,
  );

  return {
    ...response,
    structuredContent: createEvRangeDamageOutput({
      ...context,
      evResults,
      fixedStat: fixedDefenseStat,
      isAttackerEv: true,
    }),
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
  content: { type: "text"; text: string }[];
  structuredContent: StructuredOutput;
} => {
  const context = prepareCalculationContext(input);
  const evResults = calculateDefenderEvDamages(
    input,
    fixedAttackStat,
    defenseStatArray,
  );

  const response = createDamageResponse(
    context,
    {
      evResults,
      fixedStat: fixedAttackStat,
      isAttackerEv: false,
    },
    formatDamageWithEvRange,
  );

  return {
    ...response,
    structuredContent: createEvRangeDamageOutput({
      ...context,
      evResults,
      fixedStat: fixedAttackStat,
      isAttackerEv: false,
    }),
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
  content: { type: "text"; text: string }[];
  structuredContent: StructuredOutput;
} => {
  const context = prepareCalculationContext(input);
  const damages = calculateNormalDamage(input, attackStat, defenseStat);

  const response = createDamageResponse(
    context,
    {
      damages,
      attackStat,
      defenseStat,
    },
    formatDamageResult,
  );

  return {
    ...response,
    structuredContent: createNormalDamageOutput({
      ...context,
      damages,
      attackStat,
      defenseStat,
    }),
  };
};

/**
 * EV計算を処理する
 */
const handleEvCalculation = (
  input: CalculateDamageInput,
  stats: ReturnType<typeof getCalculatedStats>,
): {
  content: { type: "text"; text: string }[];
  structuredContent?: StructuredOutput;
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
): Promise<{
  content: { type: "text"; text: string }[];
  structuredContent?: StructuredOutput;
}> => {
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
