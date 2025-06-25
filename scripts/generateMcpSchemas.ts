#!/usr/bin/env tsx

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { calculateDamageInputSchema } from "../src/tools/calculateDamage/handlers/schemas/damageSchema";
import { calculateStatusInputSchema } from "../src/tools/calculateStatus/handlers/schemas/statusSchema";

/**
 * ZodスキーマからMCP用のJSON Schemaを自動生成するスクリプト
 *
 * 使用方法:
 * npm run generate:schemas
 */

const schemas = [
  {
    name: "calculateDamage",
    zodSchema: calculateDamageInputSchema,
    outputPath: "src/tools/calculateDamage/schemas/generated/inputSchema.json",
  },
  {
    name: "calculateStatus",
    zodSchema: calculateStatusInputSchema,
    outputPath: "src/tools/calculateStatus/schemas/generated/inputSchema.json",
  },
];

for (const { name, zodSchema, outputPath } of schemas) {
  const jsonSchema = zodToJsonSchema(zodSchema, {
    name: `${name}Input`,
    $refStrategy: "none",
  });

  // $schemaを削除
  if ("$schema" in jsonSchema) {
    delete jsonSchema.$schema;
  }

  const fullPath = join(process.cwd(), outputPath);
  writeFileSync(fullPath, JSON.stringify(jsonSchema, null, 2));

  console.log(`✅ Generated ${name} schema → ${outputPath}`);
}

console.log("\n🎉 All schemas generated successfully!");
console.log("\nNext steps:");
console.log("1. Import the generated schemas in your tool definitions");
console.log("2. Use them as inputSchema in MCP tool definitions");
console.log("3. Run this script in CI to ensure schemas stay in sync");
