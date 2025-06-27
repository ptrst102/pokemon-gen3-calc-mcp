import { describe, expect, it } from "vitest";
import type { Pokemon } from "@/data/pokemon";
import type { CalculateDamageInput } from "../../schemas/damageSchema";
import { calculateNormalDamage } from "./calculateDamage";

describe("けたぐりの威力計算", () => {
  const createInput = (defenderWeightkg: number): CalculateDamageInput => {
    // テスト用のモックポケモン
    const mockDefenderPokemon: Pokemon = {
      name: "テストポケモン" as "カビゴン",
      types: ["ノーマル"],
      baseStats: {
        hp: 160,
        atk: 110,
        def: 65,
        spa: 65,
        spd: 110,
        spe: 30,
      },
      abilities: ["めんえき", "あついしぼう"],
      weightkg: defenderWeightkg,
    };

    return {
      move: {
        name: "けたぐり",
        type: "かくとう",
        power: 60,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        pokemon: {
          name: "ワンリキー",
          types: ["かくとう"],
          baseStats: {
            hp: 70,
            atk: 80,
            def: 50,
            spa: 35,
            spd: 35,
            spe: 35,
          },
          abilities: ["こんじょう"],
          weightkg: 19.5,
        },
        stat: { value: 100 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: mockDefenderPokemon,
        stat: { value: 85 },
        statModifier: 0,
      },
    };
  };

  it("重さ10kg以下の場合、威力20になる", () => {
    const input = createInput(9.0);
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力20で計算されているかを確認
    // かくとうタイプ vs ノーマルタイプは効果抜群（2倍）
    // タイプ一致ボーナスあり（ワンリキーがかくとうタイプ）
    // 威力20 × 1.5 × 2.0 = 60相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(30);
    expect(Math.max(...damages)).toBe(36);
  });

  it("重さ10.1kg〜25kgの場合、威力40になる", () => {
    const input = createInput(20.0);
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力40 × 1.5 × 2.0 = 120相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(56);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(66);
    expect(Math.max(...damages)).toBeLessThanOrEqual(67);
  });

  it("重さ25.1kg〜50kgの場合、威力60になる", () => {
    const input = createInput(40.0);
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力60 × 1.5 × 2.0 = 180相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(83);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(98);
    expect(Math.max(...damages)).toBeLessThanOrEqual(99);
  });

  it("重さ50.1kg〜100kgの場合、威力80になる", () => {
    const input = createInput(80.0);
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力80 × 1.5 × 2.0 = 240相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(108);
    expect(Math.max(...damages)).toBe(128);
  });

  it("重さ100.1kg〜200kgの場合、威力100になる", () => {
    const input = createInput(150.0);
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力100 × 1.5 × 2.0 = 300相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(134);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(158);
    expect(Math.max(...damages)).toBeLessThanOrEqual(159);
  });

  it("重さ200.1kg以上の場合、威力120になる", () => {
    const input = createInput(460.0); // カビゴンの実際の重さ
    const damages = calculateNormalDamage(input, 100, 85);

    // 威力120 × 1.5 × 2.0 = 360相当
    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(163);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(192);
    expect(Math.max(...damages)).toBeLessThanOrEqual(193);
  });

  it("境界値テスト: 10.0kgちょうどの場合、威力20", () => {
    const input = createInput(10.0);
    const damages = calculateNormalDamage(input, 100, 85);

    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(30);
    expect(Math.max(...damages)).toBe(36);
  });

  it("境界値テスト: 25.0kgちょうどの場合、威力40", () => {
    const input = createInput(25.0);
    const damages = calculateNormalDamage(input, 100, 85);

    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(56);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(66);
    expect(Math.max(...damages)).toBeLessThanOrEqual(67);
  });

  it("境界値テスト: 50.0kgちょうどの場合、威力60", () => {
    const input = createInput(50.0);
    const damages = calculateNormalDamage(input, 100, 85);

    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(83);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(98);
    expect(Math.max(...damages)).toBeLessThanOrEqual(99);
  });

  it("境界値テスト: 100.0kgちょうどの場合、威力80", () => {
    const input = createInput(100.0);
    const damages = calculateNormalDamage(input, 100, 85);

    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(108);
    expect(Math.max(...damages)).toBe(128);
  });

  it("境界値テスト: 200.0kgちょうどの場合、威力100", () => {
    const input = createInput(200.0);
    const damages = calculateNormalDamage(input, 100, 85);

    expect(damages).toHaveLength(16);
    expect(Math.min(...damages)).toBe(134);
    expect(Math.max(...damages)).toBeGreaterThanOrEqual(158);
    expect(Math.max(...damages)).toBeLessThanOrEqual(159);
  });
});
