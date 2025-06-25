import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * ZodスキーマからMCP用のinputSchemaを生成する
 *
 * @param zodSchema - 変換元のZodスキーマ
 * @returns MCP仕様に準拠したJSON Schema
 */
export const generateInputSchema = (
  zodSchema: z.ZodType,
): {
  [x: string]: unknown;
  type: "object";
  properties?: { [x: string]: unknown } | undefined;
  required?: string[] | undefined;
} => {
  const schema = zodToJsonSchema(zodSchema, {
    // MCPではrefを使わない
    $refStrategy: "none",
    // 追加プロパティの処理
    removeAdditionalStrategy: "passthrough",
  });

  // $schemaプロパティを削除（MCPでは不要）
  if (typeof schema === "object" && schema !== null && "$schema" in schema) {
    delete schema.$schema;
  }

  return schema as {
    [x: string]: unknown;
    type: "object";
    properties?: { [x: string]: unknown } | undefined;
    required?: string[] | undefined;
  };
};
