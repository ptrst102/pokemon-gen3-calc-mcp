import { z } from "zod";
import { ABILITIES } from "@/data/abilities";
import { ITEMS } from "@/data/items";
import { POKEMONS } from "@/data/pokemon";

// わざの入力スキーマ
const moveInputSchema = z.union([
  // 技名
  z.string(),
  // カスタム技
  z.object({
    name: z.string().optional(),
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
    ]),
    power: z.number().int().min(0),
    isPhysical: z.boolean().optional(),
  }),
]);

// 攻撃側の能力値の入力スキーマ（固定値のみ）
const attackerStatInputSchema = z.union([
  // パターン1: 実数値を直接指定
  z
    .object({
      value: z.number().int().min(1).describe("こうげきまたはとくこうの実数値"),
    })
    .describe("能力値を実数値で直接指定"),
  // パターン2: 個体値＋努力値＋性格補正
  z.object({
    iv: z.number().int().min(0).max(31),
    ev: z.number().int().min(0).max(252),
    natureModifier: z
      .enum(["up", "down", "neutral"])
      .optional()
      .default("neutral"),
  }),
]);

// 防御側の能力値の入力スキーマ（個体値のみ）
const defenderStatInputSchema = z.object({
  iv: z.number().int().min(0).max(31),
  natureModifier: z
    .enum(["up", "down", "neutral"])
    .optional()
    .default("neutral"),
});

// 攻撃側のスキーマ
const attackerSchema = z
  .object({
    level: z.number().int().min(1).max(100).optional().default(50),
    pokemonName: z.string().optional(),
    item: z.string().optional(),
    ability: z.string().optional(),
    abilityActive: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "条件付きとくせいが発動しているかどうか（もうか、げきりゅう、しんりょく等）。ちからもち、ヨガパワー等の常時発動するとくせいには影響しません",
      ),
    stat: attackerStatInputSchema,
    statModifier: z.number().int().min(-6).max(6).optional().default(0),
  })
  .transform((input) => {
    // ポケモンの情報を取得
    const pokemon = input.pokemonName
      ? POKEMONS.find((p) => p.name === input.pokemonName)
      : undefined;

    if (input.pokemonName && !pokemon) {
      throw new Error(`ポケモン「${input.pokemonName}」が見つかりません`);
    }

    // もちものの情報を取得
    const item = input.item
      ? ITEMS.find((i) => i.name === input.item)
      : undefined;

    if (input.item && !item) {
      throw new Error(`もちもの「${input.item}」が見つかりません`);
    }

    // とくせいの情報を取得
    const ability = input.ability
      ? ABILITIES.find((a) => a.name === input.ability)
      : undefined;

    if (input.ability && !ability) {
      throw new Error(`とくせい「${input.ability}」が見つかりません`);
    }

    // pokemonNameを削除し、pokemonオブジェクトのみを使用
    const { pokemonName: _, ...restInput } = input;
    return {
      ...restInput,
      pokemon,
      item,
      ability,
    };
  });

// 防御側のスキーマ
const defenderSchema = z
  .object({
    level: z.number().int().min(1).max(100).optional().default(50),
    pokemonName: z.string(),
    item: z.string().optional(),
    ability: z.string().optional(),
    abilityActive: z
      .boolean()
      .optional()
      .default(false)
      .describe("条件付きとくせいが発動しているかどうか（ハードロック等）"),
    stat: defenderStatInputSchema,
    statModifier: z.number().int().min(-6).max(6).optional().default(0),
    isPhysicalDefense: z.boolean(),
  })
  .transform((input) => {
    // ポケモンの情報を取得
    const pokemon = POKEMONS.find((p) => p.name === input.pokemonName);

    if (!pokemon) {
      throw new Error(`ポケモン「${input.pokemonName}」が見つかりません`);
    }

    // もちものの情報を取得
    const item = input.item
      ? ITEMS.find((i) => i.name === input.item)
      : undefined;

    if (input.item && !item) {
      throw new Error(`もちもの「${input.item}」が見つかりません`);
    }

    // とくせいの情報を取得
    const ability = input.ability
      ? ABILITIES.find((a) => a.name === input.ability)
      : undefined;

    if (input.ability && !ability) {
      throw new Error(`とくせい「${input.ability}」が見つかりません`);
    }

    // pokemonNameを削除し、pokemonオブジェクトのみを使用
    const { pokemonName: _, ...restInput } = input;
    return {
      ...restInput,
      pokemon,
      item,
      ability,
    };
  });

// その他のオプション
const optionsSchema = z
  .object({
    weather: z.enum(["はれ", "あめ", "あられ", "すなあらし"]).optional(),
    charge: z.boolean().optional().default(false), // じゅうでん
    reflect: z.boolean().optional().default(false), // リフレクター
    lightScreen: z.boolean().optional().default(false), // ひかりのかべ
    mudSport: z.boolean().optional().default(false), // どろあそび
    waterSport: z.boolean().optional().default(false), // みずあそび
  })
  .optional()
  .default({});

// 全体のダメージ計算入力スキーマ
export const calculateDamageMatrixVaryingDefenseInputSchema = z.object({
  move: moveInputSchema,
  attacker: attackerSchema,
  defender: defenderSchema,
  options: optionsSchema,
});

export type CalculateDamageMatrixVaryingDefenseInput = z.infer<
  typeof calculateDamageMatrixVaryingDefenseInputSchema
>;
