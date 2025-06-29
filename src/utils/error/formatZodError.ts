import type { ZodError } from "zod";

/**
 * ZodErrorを分かりやすいメッセージに変換する
 */
export const formatZodError = (error: ZodError): string => {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join(".");

    switch (issue.code) {
      case "invalid_type":
        if (issue.received === "undefined") {
          return `「${path}」フィールドが必須です`;
        }
        return `「${path}」は${issue.expected}型である必要があります（現在: ${issue.received}型）`;

      case "invalid_union": {
        // Unionタイプの検証失敗時は、unionErrorsから必須フィールドエラーを判定
        if ("unionErrors" in issue) {
          const hasUndefinedError = issue.unionErrors.some((unionError) =>
            unionError.issues.some(
              (e) => e.code === "invalid_type" && e.received === "undefined",
            ),
          );
          if (hasUndefinedError) {
            return `「${path}」フィールドが必須です`;
          }
        }

        // moveフィールドの場合は特別なメッセージを返す
        if (path === "move") {
          return '「move」は文字列（わざ名）または { type: "タイプ名", power: 威力 } の形式で指定してください';
        }

        return `「${path}」の形式が正しくありません`;
      }

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
