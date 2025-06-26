import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { calculateDamageInputSchema } from "./generated/inputSchema";

/**
 * ダメージ計算ツールの定義
 *
 * inputSchemaは事前生成されたスキーマファイルから読み込まれる
 */
export const calculateDamageDefinition: Tool = {
  name: "calculate_damage",
  title: "ポケモンダメージ計算",
  description:
    'ポケモンのダメージ計算を行います。タイプ相性、とくせい、もちもの、天候などを考慮した正確なダメージを算出します。\n\n使い方の例:\n1. わざ名を指定: move: "じしん"\n2. タイプと威力を指定: move: { type: "じめん", power: 100 }',
  _meta: {},
  inputSchema: calculateDamageInputSchema,
};
