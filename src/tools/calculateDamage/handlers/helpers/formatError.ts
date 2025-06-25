export const formatError = (
  error: unknown,
): { structuredContent: { error: string } } => {
  const message =
    error instanceof Error ? error.message : "不明なエラーが発生しました";

  return {
    structuredContent: {
      error: message,
    },
  };
};
