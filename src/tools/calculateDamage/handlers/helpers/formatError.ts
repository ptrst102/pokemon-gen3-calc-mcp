export const formatError = (
  error: unknown,
): {
  structuredContent: {
    error: string;
    move: { type: string; power: number; category: string };
  };
} => {
  const message =
    error instanceof Error ? error.message : "不明なエラーが発生しました";

  return {
    structuredContent: {
      error: message,
      // エラー時でも最小限のmove情報を含める（スキーマ準拠のため）
      move: {
        type: "unknown",
        power: 0,
        category: "unknown",
      },
    },
  };
};
