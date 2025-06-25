import { ZodError } from "zod";

/**
 * ZodErrorを分かりやすいメッセージに変換する
 */
const formatZodError = (error: ZodError): string => {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join(".");

    switch (issue.code) {
      case "invalid_type":
        if (issue.received === "undefined") {
          return `「${path}」フィールドが必須です`;
        }
        return `「${path}」は${issue.expected}型である必要があります（現在: ${issue.received}型）`;

      case "invalid_union":
        return `「${path}」の形式が正しくありません`;

      case "too_small":
        return `「${path}」は${issue.minimum}以上である必要があります`;

      case "too_big":
        return `「${path}」は${issue.maximum}以下である必要があります`;

      case "invalid_enum_value":
        return `「${path}」は次のいずれかの値である必要があります: ${issue.options.join(", ")}`;

      default:
        return `「${path}」: ${issue.message}`;
    }
  });

  return `入力エラー:\n${issues.join("\n")}`;
};

export const formatError = (
  error: unknown,
): {
  structuredContent: {
    error: string;
    pokemonName: string;
    stats: {
      hp: number;
      atk: number;
      def: number;
      spa: number;
      spd: number;
      spe: number;
    };
  };
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

  return {
    structuredContent: {
      error: message,
      // エラー時でも最小限の情報を含める（スキーマ準拠のため）
      pokemonName: "unknown",
      stats: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      },
    },
  };
};
