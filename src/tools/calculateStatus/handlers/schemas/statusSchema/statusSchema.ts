import { z } from "zod";
import { NATURES, type NatureName } from "@/data/natures";
import { POKEMONS } from "@/data/pokemon";

// 個体値のスキーマ
const ivsSchema = z
  .object({
    hp: z.number().int().min(0).max(31).describe("HP個体値（0-31）"),
    atk: z.number().int().min(0).max(31).describe("こうげき個体値（0-31）"),
    def: z.number().int().min(0).max(31).describe("ぼうぎょ個体値（0-31）"),
    spa: z.number().int().min(0).max(31).describe("とくこう個体値（0-31）"),
    spd: z.number().int().min(0).max(31).describe("とくぼう個体値（0-31）"),
    spe: z.number().int().min(0).max(31).describe("すばやさ個体値（0-31）"),
  })
  .describe("個体値（0-31）");

// 努力値のスキーマ
const evsSchema = z
  .object({
    hp: z.number().int().min(0).max(252).describe("HP努力値（0-252）"),
    atk: z.number().int().min(0).max(252).describe("こうげき努力値（0-252）"),
    def: z.number().int().min(0).max(252).describe("ぼうぎょ努力値（0-252）"),
    spa: z.number().int().min(0).max(252).describe("とくこう努力値（0-252）"),
    spd: z.number().int().min(0).max(252).describe("とくぼう努力値（0-252）"),
    spe: z.number().int().min(0).max(252).describe("すばやさ努力値（0-252）"),
  })
  .describe("努力値（0-252、合計510まで）")
  .refine(
    (evs) => {
      const total = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
      return total <= 510;
    },
    {
      message: "努力値の合計は510以下でなければなりません",
    },
  );

// 入力スキーマ
export const calculateStatusInputSchema = z
  .object({
    pokemonName: z
      .string()
      .describe('ポケモン名（例: "フシギダネ"、"メタグロス"）'),
    level: z.number().int().min(1).max(100).describe("レベル（1-100）"),
    nature: z
      .string()
      .refine((val): val is NatureName => NATURES.some((n) => n.name === val), {
        message: "無効なせいかくです",
      })
      .describe('せいかく（例: "いじっぱり"、"ひかえめ"）'),
    ivs: ivsSchema,
    evs: evsSchema,
  })
  .transform((input) => {
    // ポケモン名をオブジェクトに変換
    const pokemon = POKEMONS.find((p) => p.name === input.pokemonName);
    if (!pokemon) {
      throw new Error(`ポケモン「${input.pokemonName}」が見つかりません`);
    }

    // せいかく名をオブジェクトに変換
    const nature = NATURES.find((n) => n.name === input.nature);
    if (!nature) {
      throw new Error(`せいかく「${input.nature}」が見つかりません`);
    }

    return {
      pokemon,
      nature,
      level: input.level,
      ivs: input.ivs,
      evs: input.evs,
    };
  });

export type CalculateStatusInput = z.infer<typeof calculateStatusInputSchema>;
