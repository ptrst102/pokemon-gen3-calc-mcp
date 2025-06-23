import { describe, expect, it } from "vitest";
import type { Pokemon } from "@/data/pokemon";
import type { StatsObj } from "@/types";
import { statusFormatter } from "./statusFormatter";

describe("statusFormatter", () => {
  const mockPokemon: Pokemon = {
    name: "フシギダネ",
    types: ["くさ", "どく"],
    baseStats: {
      hp: 45,
      atk: 49,
      def: 49,
      spa: 65,
      spd: 65,
      spe: 45,
    },
    abilities: ["しんりょく"],
    weightkg: 6.9,
  };

  const mockStats: StatsObj = {
    hp: 200,
    atk: 100,
    def: 101,
    spa: 102,
    spd: 103,
    spe: 104,
  };

  it("正しいフォーマットで文字列を返すこと", () => {
    const result = statusFormatter({
      pokemon: mockPokemon,
      stats: mockStats,
    });

    expect(result).toContain("【フシギダネ】");
    expect(result).toContain("HP: 200");
    expect(result).toContain("こうげき: 100");
    expect(result).toContain("ぼうぎょ: 101");
    expect(result).toContain("とくこう: 102");
    expect(result).toContain("とくぼう: 103");
    expect(result).toContain("すばやさ: 104");
  });
});
