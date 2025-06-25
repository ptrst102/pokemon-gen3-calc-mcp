import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { calculateDamageInputSchema } from "../src/tools/calculateDamage/handlers/schemas/damageSchema";
import { calculateStatusInputSchema } from "../src/tools/calculateStatus/handlers/schemas/statusSchema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * ZodスキーマからMCP用のJSONスキーマを生成する
 */
const generateSchema = (zodSchema: Parameters<typeof zodToJsonSchema>[0]) => {
  const schema = zodToJsonSchema(zodSchema, {
    $refStrategy: "none",
    removeAdditionalStrategy: "passthrough",
  });

  if (typeof schema === "object" && schema !== null && "$schema" in schema) {
    delete schema.$schema;
  }

  return schema;
};

/**
 * スキーマをTypeScriptファイルとして書き出す
 */
const writeSchemaFile = (
  filePath: string,
  schemaName: string,
  schema: unknown,
) => {
  const content = `/**
 * 自動生成されたスキーマファイル
 * このファイルは直接編集しないでください
 * 編集する場合は、対応するZodスキーマを編集してから npm run schemagen を実行してください
 */

export const ${schemaName} = ${JSON.stringify(schema, null, 2)} satisfies {
  [x: string]: unknown;
  type: "object";
  properties?: { [x: string]: unknown } | undefined;
  required?: string[] | undefined;
};
`;

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ Generated: ${filePath}`);
};

/**
 * メイン処理
 */
const main = () => {
  console.log("🚀 スキーマ生成を開始します...");

  // calculateDamageのスキーマ生成
  const damageSchema = generateSchema(calculateDamageInputSchema);
  writeSchemaFile(
    path.join(
      __dirname,
      "../src/tools/calculateDamage/generated/inputSchema.ts",
    ),
    "calculateDamageInputSchema",
    damageSchema,
  );

  // calculateStatusのスキーマ生成
  const statusSchema = generateSchema(calculateStatusInputSchema);
  writeSchemaFile(
    path.join(
      __dirname,
      "../src/tools/calculateStatus/generated/inputSchema.ts",
    ),
    "calculateStatusInputSchema",
    statusSchema,
  );

  console.log("✨ スキーマ生成が完了しました！");
};

main();
