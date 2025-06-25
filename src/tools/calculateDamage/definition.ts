import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { generateInputSchema } from "@/tools/utils/generateInputSchema";
import { calculateDamageInputSchema } from "./handlers/schemas/damageSchema";

/**
 * ダメージ計算ツールの定義（zod-to-json-schema版）
 *
 * inputSchemaはZodスキーマから自動生成される
 */
export const calculateDamageDefinition: Tool = {
  name: "calculate_damage",
  title: "ポケモンダメージ計算",
  description:
    'ポケモンのダメージ計算を行います。タイプ相性、とくせい、もちもの、天候などを考慮した正確なダメージを算出します。\n\n使い方の例:\n1. わざ名を指定: move: "じしん"\n2. タイプと威力を指定: move: { type: "じめん", power: 100 }',
  _meta: {},
  inputSchema: generateInputSchema(calculateDamageInputSchema),
  outputSchema: {
    type: "object",
    properties: {
      move: {
        type: "object",
        description: "使用したわざの情報",
        properties: {
          name: { type: "string", description: "わざ名" },
          type: { type: "string", description: "わざのタイプ" },
          power: { type: "number", description: "わざの威力" },
          category: { type: "string", description: "物理/特殊の分類" },
        },
        required: ["type", "power", "category"],
      },
      attacker: {
        type: "object",
        description: "攻撃側の情報",
        properties: {
          pokemonName: { type: "string", description: "ポケモン名" },
          level: { type: "number", description: "レベル" },
          stat: { type: "number", description: "使用したステータス実数値" },
        },
      },
      defender: {
        type: "object",
        description: "防御側の情報",
        properties: {
          pokemonName: { type: "string", description: "ポケモン名" },
          level: { type: "number", description: "レベル" },
          stat: { type: "number", description: "使用したステータス実数値" },
        },
      },
      damage: {
        type: "object",
        description: "ダメージ計算結果",
        properties: {
          min: { type: "number", description: "最小ダメージ" },
          max: { type: "number", description: "最大ダメージ" },
          rolls: {
            type: "array",
            description: "全16通りのダメージ値",
            items: { type: "number" },
          },
        },
        required: ["min", "max", "rolls"],
      },
      evRanges: {
        type: "array",
        description: "努力値別ダメージ範囲（calculateAllEvs使用時のみ）",
        items: {
          type: "object",
          properties: {
            ev: { type: "number", description: "努力値" },
            stat: { type: "number", description: "実数値" },
            damage: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" },
              },
              required: ["min", "max"],
            },
          },
          required: ["ev", "stat", "damage"],
        },
      },
      modifiers: {
        type: "object",
        description: "適用された補正",
        properties: {
          typeEffectiveness: { type: "number", description: "タイプ相性倍率" },
          stab: { type: "boolean", description: "タイプ一致ボーナス適用" },
          weather: { type: "string", description: "天候効果" },
          ability: { type: "string", description: "適用されたとくせい" },
          item: { type: "string", description: "適用されたもちもの" },
        },
      },
    },
    required: ["move"],
  },
};
