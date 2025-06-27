import { z } from "zod";
import { ABILITIES } from "@/data/abilities";
import { ITEMS } from "@/data/items";
import { MOVES } from "@/data/moves";
import { POKEMONS } from "@/data/pokemon";
import { UNSUPPORTED_MOVES } from "@/data/unsupportedMoves";
import type { TypeName } from "@/types";

// わざのタイプから物理技か特殊技かを判定する
const isPhysicalType = (type: TypeName): boolean =>
  [
    "ノーマル",
    "かくとう",
    "どく",
    "じめん",
    "ひこう",
    "むし",
    "いわ",
    "ゴースト",
    "はがね",
  ].includes(type);

// わざの入力スキーマ
const moveInputSchema = z.union([
  // 技名から変換
  z
    .string()
    .transform((moveName) => {
      // 未対応技のチェック
      if (UNSUPPORTED_MOVES.some((m) => m === moveName)) {
        throw new Error(`${moveName}には対応していません`);
      }

      const move = MOVES.find((m) => m.name === moveName);
      if (!move) {
        throw new Error(`わざ「${moveName}」が見つかりません`);
      }
      return {
        name: moveName,
        type: move.type,
        power: move.power,
        isPhysical: isPhysicalType(move.type),
      };
    }),
  // タイプと威力を直接指定
  z
    .object({
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
    })
    .transform((input) => ({
      ...input,
      isPhysical: isPhysicalType(input.type),
    })),
]);

// 攻撃側の能力値の入力スキーマ（個体値のみ）
const attackerStatInputSchema = z.object({
  iv: z.number().int().min(0).max(31),
  natureModifier: z
    .enum(["up", "down", "neutral"])
    .optional()
    .default("neutral"),
});

// 防御側の能力値の入力スキーマ（固定値のみ）
const defenderStatInputSchema = z.union([
  // パターン1: 実数値を直接指定
  z
    .object({
      value: z.number().int().min(1).describe("ぼうぎょまたはとくぼうの実数値"),
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

// 攻撃側のスキーマ
const attackerSchema = z
  .object({
    level: z.number().int().min(1).max(100).optional().default(50),
    pokemonName: z.string(),
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
    isPhysicalAttack: z.boolean(),
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

    return {
      ...input,
      pokemon,
      item,
      ability,
    };
  });

// 防御側のスキーマ
const defenderSchema = z
  .object({
    level: z.number().int().min(1).max(100).optional().default(50),
    pokemonName: z.string().optional(),
    item: z.string().optional(),
    ability: z.string().optional(),
    abilityActive: z
      .boolean()
      .optional()
      .default(false)
      .describe("条件付きとくせいが発動しているかどうか（ハードロック等）"),
    stat: defenderStatInputSchema,
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

    return {
      ...input,
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
export const calculateDamageMatrixVaryingAttackInputSchema = z.object({
  move: moveInputSchema,
  attacker: attackerSchema,
  defender: defenderSchema,
  options: optionsSchema,
});

export type CalculateDamageMatrixVaryingAttackInput = z.infer<
  typeof calculateDamageMatrixVaryingAttackInputSchema
>;
