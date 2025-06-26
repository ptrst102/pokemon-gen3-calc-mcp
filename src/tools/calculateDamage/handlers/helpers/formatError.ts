import { formatError as baseFormatError } from "@/utils/error";

// calculateDamage用のデフォルトエラー出力
const DEFAULT_ERROR_OUTPUT = {
  // エラー時でも最小限のmove情報を含める（スキーマ準拠のため）
  move: {
    type: "unknown",
    power: 0,
    category: "unknown",
  },
};

export const formatError = (error: unknown) => {
  return baseFormatError(error, DEFAULT_ERROR_OUTPUT);
};
