import { createNormalDamageOutput } from "./formatters/structuredOutputFormatter";
import { calculateNormalDamage } from "./helpers/calculateDamage";
import { getCalculatedStats } from "./helpers/calculateStats";
import { formatError } from "./helpers/formatError";
import { prepareCalculationContext } from "./helpers/prepareCalculationContext";
import { resolveMove } from "./helpers/resolveMove";
import { calculateDamageInputSchema } from "./schemas/damageSchema";

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

    // 技の解決処理を追加
    const resolvedMove = resolveMove(input.move);
    const inputWithResolvedMove = {
      ...input,
      move: resolvedMove,
    };

    const stats = getCalculatedStats(inputWithResolvedMove);
    const context = prepareCalculationContext(inputWithResolvedMove);

    const damages = calculateNormalDamage(
      inputWithResolvedMove,
      stats.attackStat,
      stats.defenseStat,
    );

    const structuredOutput = createNormalDamageOutput({
      ...context,
      damages,
      attackStat: stats.attackStat,
      defenseStat: stats.defenseStat,
    });

    return createCalculationResponse(structuredOutput);
  } catch (error) {
    return formatError(error);
  }
};
