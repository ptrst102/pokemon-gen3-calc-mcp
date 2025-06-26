import { ZodError } from "zod";
import { formatZodError } from "./formatZodError";

/**
 * エラーをMCPレスポンス形式にフォーマットする
 *
 * @param error - フォーマットするエラー
 * @param defaultErrorOutput - エラー時のデフォルト出力（ツール固有のスキーマ準拠用）
 */
export const formatError = <T extends Record<string, unknown>>(
  error: unknown,
  defaultErrorOutput: T,
): {
  isError: true;
  content: Array<{ type: "text"; text: string }>;
} => {
  const message = (() => {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "不明なエラーが発生しました";
  })();

  const errorOutput = {
    error: message,
    ...defaultErrorOutput,
  };

  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify(errorOutput, null, 2),
      },
    ],
  };
};
