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
 * 計算結果をMCPレスポンス形式に変換する共通関数
 */
const createCalculationResponse = (
  structuredOutput: unknown,
): {
  content: Array<{ type: "text"; text: string }>;
} => {
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
 * 計算処理の共通インターフェース
 */
type CalculationParams =
  | {
      type: "attackerEv";
      attackStatArray: number[];
      fixedDefenseStat: number;
    }
  | {
      type: "defenderEv";
      fixedAttackStat: number;
      defenseStatArray: number[];
    }
  | {
      type: "normal";
      attackStat: number;
      defenseStat: number;
    };

/**
 * 計算処理を統一的に扱う
 */
const performCalculation = (
  input: CalculateDamageInput,
  params: CalculationParams,
) => {
  const context = prepareCalculationContext(input);

  const structuredOutput = (() => {
    switch (params.type) {
      case "attackerEv": {
        const evResults = calculateAttackerEvDamages(
          input,
          params.attackStatArray,
          params.fixedDefenseStat,
        );
        return createEvRangeDamageOutput({
          ...context,
          evResults,
          fixedStat: params.fixedDefenseStat,
          isAttackerEv: true,
        });
      }
      case "defenderEv": {
        const evResults = calculateDefenderEvDamages(
          input,
          params.fixedAttackStat,
          params.defenseStatArray,
        );
        return createEvRangeDamageOutput({
          ...context,
          evResults,
          fixedStat: params.fixedAttackStat,
          isAttackerEv: false,
        });
      }
      case "normal": {
        const damages = calculateNormalDamage(
          input,
          params.attackStat,
          params.defenseStat,
        );
        return createNormalDamageOutput({
          ...context,
          damages,
          attackStat: params.attackStat,
          defenseStat: params.defenseStat,
        });
      }
    }
  })();

  return createCalculationResponse(structuredOutput);
};

/**
 * EV計算を処理する
 */
const handleEvCalculation = (
  input: CalculateDamageInput,
  stats: ReturnType<typeof getCalculatedStats>,
) => {
  const { attackStat, defenseStat } = stats;

  if (isAttackerEvArray(attackStat)) {
    if (!isDefenderEvArray(defenseStat)) {
      return performCalculation(input, {
        type: "attackerEv",
        attackStatArray: attackStat,
        fixedDefenseStat: defenseStat,
      });
    }
  }

  if (isDefenderEvArray(defenseStat)) {
    if (!isAttackerEvArray(attackStat)) {
      return performCalculation(input, {
        type: "defenderEv",
        fixedAttackStat: attackStat,
        defenseStatArray: defenseStat,
      });
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
      return performCalculation(input, {
        type: "normal",
        attackStat: stats.attackStat,
        defenseStat: stats.defenseStat,
      });
    }

    throw new Error("内部エラー: 予期しない状態です");
  } catch (error) {
    return formatError(error);
  }
};
