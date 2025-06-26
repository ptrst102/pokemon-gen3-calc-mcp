import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { calculateStatusInputSchema } from "./generated/inputSchema";

/**
 * ステータス計算ツールの定義
 *
 * inputSchemaは事前生成されたスキーマファイルから読み込まれる
 */
export const calculateStatusDefinition: Tool = {
  name: "calculate_status",
  title: "ポケモンステータス計算",
  description:
    "ポケモンのステータス実数値を計算します。種族値、個体値、努力値、レベル、せいかくを考慮した正確な数値を算出します。",
  _meta: {},
  inputSchema: calculateStatusInputSchema,
};
