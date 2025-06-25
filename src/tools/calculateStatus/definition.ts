import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { generateInputSchema } from "@/tools/utils/generateInputSchema";
import { calculateStatusInputSchema } from "./handlers/schemas/statusSchema";

/**
 * ステータス計算ツールの定義（zod-to-json-schema版）
 *
 * inputSchemaはZodスキーマから自動生成される
 */
export const calculateStatusDefinition: Tool = {
  name: "calculate_status",
  title: "ポケモンステータス計算",
  description:
    "ポケモンのステータス実数値を計算します。種族値、個体値、努力値、レベル、せいかくを考慮した正確な数値を算出します。",
  _meta: {},
  inputSchema: generateInputSchema(calculateStatusInputSchema),
  outputSchema: {
    type: "object",
    properties: {
      pokemonName: {
        type: "string",
        description: "ポケモン名",
      },
      stats: {
        type: "object",
        description: "計算されたステータス実数値",
        properties: {
          hp: { type: "number", description: "HP実数値" },
          atk: { type: "number", description: "こうげき実数値" },
          def: { type: "number", description: "ぼうぎょ実数値" },
          spa: { type: "number", description: "とくこう実数値" },
          spd: { type: "number", description: "とくぼう実数値" },
          spe: { type: "number", description: "すばやさ実数値" },
        },
        required: ["hp", "atk", "def", "spa", "spd", "spe"],
      },
    },
    required: ["pokemonName", "stats"],
  },
};
