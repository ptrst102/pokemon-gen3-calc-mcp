import { z } from "zod";
import { NATURES } from "@/data/natures";
import { POKEMONS } from "@/data/pokemon";

// 個体値のスキーマ
const ivsSchema = z.object({
  hp: z.number().int().min(0).max(31),
  atk: z.number().int().min(0).max(31),
  def: z.number().int().min(0).max(31),
  spa: z.number().int().min(0).max(31),
  spd: z.number().int().min(0).max(31),
  spe: z.number().int().min(0).max(31),
});

// 努力値のスキーマ
const evsSchema = z
  .object({
    hp: z.number().int().min(0).max(252),
    atk: z.number().int().min(0).max(252),
    def: z.number().int().min(0).max(252),
    spa: z.number().int().min(0).max(252),
    spd: z.number().int().min(0).max(252),
    spe: z.number().int().min(0).max(252),
  })
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
    pokemonName: z.string(),
    level: z.number().int().min(1).max(100),
    nature: z.string(),
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
