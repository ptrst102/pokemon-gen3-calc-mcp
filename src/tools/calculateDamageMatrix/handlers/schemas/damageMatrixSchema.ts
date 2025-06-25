import { z } from "zod";

const moveInputSchema = z.union([
  z.string().describe("わざ名"),
  z.object({
    type: z.enum([
      "ノーマル",
      "ほのお",
      "みず",
      "でんき",
      "くさ",
      "こおり",
      "かくとう",
      "どく",
      "じめん",
      "ひこう",
      "エスパー",
      "むし",
      "いわ",
      "ゴースト",
      "ドラゴン",
      "あく",
      "はがね",
    ]).describe("わざのタイプ"),
    power: z.number().min(1).max(250).describe("わざの威力"),
  }).describe("タイプと威力を指定"),
]);

const attackerStatSchema = z.object({
  value: z.number().min(1).max(999).describe("こうげきまたはとくこうの実数値"),
});

const statRangeSchema = z.object({
  min: z.number().min(1).default(4).describe("最小防御ステータス"),
  max: z.number().max(999).default(504).describe("最大防御ステータス"),
});

export const calculateDamageMatrixInputSchema = z.object({
  move: moveInputSchema,
  attacker: z.object({
    pokemonName: z.string().optional().describe("ポケモン名"),
    level: z.number().min(1).max(100).default(50).describe("レベル"),
    stat: attackerStatSchema.describe("能力値"),
    item: z.string().optional().describe("もちもの"),
    ability: z.string().optional().describe("とくせい"),
    abilityActive: z.boolean().optional().describe("条件付きとくせいが発動しているか"),
    statModifier: z.number().min(-6).max(6).default(0).describe("能力ランク補正"),
  }),
  defenderType: z.enum(["physical", "special"]).describe("防御側のステータスタイプ"),
  defender: z.object({
    pokemonName: z.string().optional().describe("ポケモン名"),
    level: z.number().min(1).max(100).default(50).describe("レベル"),
    item: z.string().optional().describe("もちもの"),
    ability: z.string().optional().describe("とくせい"),
    abilityActive: z.boolean().optional().describe("条件付きとくせいが発動しているか"),
    statModifier: z.number().min(-6).max(6).default(0).describe("能力ランク補正"),
  }).optional(),
  options: z.object({
    weather: z.enum(["はれ", "あめ"]).optional().describe("てんき"),
    charge: z.boolean().optional().describe("じゅうでん"),
    reflect: z.boolean().optional().describe("リフレクター"),
    lightScreen: z.boolean().optional().describe("ひかりのかべ"),
    mudSport: z.boolean().optional().describe("どろあそび"),
    waterSport: z.boolean().optional().describe("みずあそび"),
    statRange: statRangeSchema.optional().describe("計算する防御ステータスの範囲"),
  }).optional(),
});

export type CalculateDamageMatrixInput = z.infer<typeof calculateDamageMatrixInputSchema>;