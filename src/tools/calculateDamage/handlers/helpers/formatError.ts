export const formatError = (
  error: unknown,
): { content: { type: "text"; text: string }[] } => {
  const message =
    error instanceof Error ? error.message : "不明なエラーが発生しました";

  return {
    content: [
      {
        type: "text",
        text: `エラー: ${message}`,
      },
    ],
  };
};
