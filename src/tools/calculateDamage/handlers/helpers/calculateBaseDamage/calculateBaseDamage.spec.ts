import { describe, expect, it } from "vitest";
import { calculateBaseDamage } from "./calculateBaseDamage";

describe("calculateBaseDamage", () => {
  it("物理技の基本ダメージを計算する", () => {
    const damage = calculateBaseDamage({
      level: 50,
      power: 80,
      attack: 150,
      defense: 100,
      isPhysical: true,
    });
    // レベル50、威力80、攻撃150、防御100の場合
    // ((50 × 2 / 5) + 2) × 80 × 150 / 100 / 50 + 2 = 54
    expect(damage).toBe(54);
  });

  it("特殊技の基本ダメージを計算する", () => {
    const damage = calculateBaseDamage({
      level: 50,
      power: 90,
      attack: 120,
      defense: 110,
      isPhysical: false,
    });
    // レベル50、威力90、とくこう120、とくぼう110の場合
    // (50 × 2 / 5 + 2) × 90 × 120 / 110 / 50 + 2 = 45
    expect(damage).toBe(45);
  });

  it("低レベルでの計算", () => {
    const damage = calculateBaseDamage({
      level: 5,
      power: 40,
      attack: 50,
      defense: 50,
      isPhysical: true,
    });
    // レベル5、威力40、攻撃50、防御50の場合
    // ((5 × 2 / 5) + 2) × 40 × 50 / 50 / 50 + 2 = 5
    expect(damage).toBe(5);
  });

  it("高レベルでの計算", () => {
    const damage = calculateBaseDamage({
      level: 100,
      power: 100,
      attack: 200,
      defense: 100,
      isPhysical: true,
    });
    // レベル100、威力100、攻撃200、防御100の場合
    // ((100 × 2 / 5) + 2) × 100 × 200 / 100 / 50 + 2 = 170
    expect(damage).toBe(170);
  });

  it("最小ダメージは1以上になる", () => {
    const damage = calculateBaseDamage({
      level: 1,
      power: 1,
      attack: 1,
      defense: 999,
      isPhysical: true,
    });
    expect(damage).toBeGreaterThanOrEqual(1);
  });
});
