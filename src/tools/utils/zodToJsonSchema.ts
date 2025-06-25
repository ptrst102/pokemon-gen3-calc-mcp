import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * ZodスキーマをMCP互換のJSON Schemaに変換する
 *
 * @example
 * const zodSchema = z.object({
 *   name: z.string(),
 *   age: z.number().min(0).max(120),
 * });
 *
 * const jsonSchema = convertToMcpSchema(zodSchema);
 * // MCPツール定義のinputSchemaに使用できる
 */
export const convertToMcpSchema = (zodSchema: z.ZodType) => {
  const jsonSchema = zodToJsonSchema(zodSchema, {
    // MCP仕様に合わせて$refを使わない設定
    $refStrategy: "none",
    // 不要なプロパティを削除
    removeAdditionalStrategy: "strict",
  });

  // $schemaプロパティを削除（MCPでは不要）
  if ("$schema" in jsonSchema) {
    delete jsonSchema.$schema;
  }

  return jsonSchema;
};

/**
 * 開発時にスキーマの差分を検証する
 */
export const validateSchemaCompatibility = (
  mcpSchema: unknown,
  zodSchema: z.ZodType,
): { isValid: boolean; differences?: string[] } => {
  const generatedSchema = convertToMcpSchema(zodSchema);

  const differences: string[] = [];

  // 簡易的な比較（実際はもっと詳細な比較が必要）
  const compareObjects = (obj1: any, obj2: any, path = ""): void => {
    for (const key in obj1) {
      const newPath = path ? `${path}.${key}` : key;

      if (!(key in obj2)) {
        differences.push(`Missing in generated schema: ${newPath}`);
        continue;
      }

      if (typeof obj1[key] === "object" && obj1[key] !== null) {
        compareObjects(obj1[key], obj2[key], newPath);
      } else if (obj1[key] !== obj2[key]) {
        differences.push(
          `Difference at ${newPath}: ${obj1[key]} !== ${obj2[key]}`,
        );
      }
    }

    for (const key in obj2) {
      if (!(key in obj1)) {
        differences.push(
          `Extra in generated schema: ${path ? `${path}.${key}` : key}`,
        );
      }
    }
  };

  compareObjects(mcpSchema, generatedSchema);

  return {
    isValid: differences.length === 0,
    differences: differences.length > 0 ? differences : undefined,
  };
};
