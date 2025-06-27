import { describe, expect, it } from "vitest";
import { getHiddenPowerPower } from "./getHiddenPowerPower";

describe("getHiddenPowerPower", () => {
  it("個体値ALL31で威力70（最大威力）になる", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31,
    };
    expect(getHiddenPowerPower(ivs)).toBe(70);
  });

  it("個体値ALL30で威力70になる", () => {
    const ivs = {
      hp: 30,
      attack: 30,
      defense: 30,
      specialAttack: 30,
      specialDefense: 30,
      speed: 30,
    };
    expect(getHiddenPowerPower(ivs)).toBe(70);
  });

  it("個体値ALL0で威力30（最小威力）になる", () => {
    const ivs = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    expect(getHiddenPowerPower(ivs)).toBe(30);
  });

  it("個体値ALL1で威力30になる", () => {
    const ivs = {
      hp: 1,
      attack: 1,
      defense: 1,
      specialAttack: 1,
      specialDefense: 1,
      speed: 1,
    };
    expect(getHiddenPowerPower(ivs)).toBe(30);
  });

  it("個体値が混在する場合の威力計算（15,20,14,26,30,31）で威力68", () => {
    const ivs = {
      hp: 15,
      attack: 20,
      defense: 14,
      specialAttack: 26,
      specialDefense: 30,
      speed: 31,
    };
    expect(getHiddenPowerPower(ivs)).toBe(68);
  });

  it("威力59のケース（31,31,31,0,31,31）", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 0,
      specialDefense: 31,
      speed: 31,
    };
    expect(getHiddenPowerPower(ivs)).toBe(59);
  });

  it("威力34のケース（22,22,22,0,0,0）", () => {
    const ivs = {
      hp: 22,
      attack: 22,
      defense: 22,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    expect(getHiddenPowerPower(ivs)).toBe(34);
  });

  it("威力31のケース（18,18,0,0,0,0）", () => {
    const ivs = {
      hp: 18,
      attack: 18,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    expect(getHiddenPowerPower(ivs)).toBe(31);
  });

  it("威力57のケース（2,2,0,0,2,2）", () => {
    const ivs = {
      hp: 2,
      attack: 2,
      defense: 0,
      specialAttack: 0,
      specialDefense: 2,
      speed: 2,
    };
    expect(getHiddenPowerPower(ivs)).toBe(57);
  });

  it("部分的に高い個体値（31,0,31,0,31,0）で威力53", () => {
    const ivs = {
      hp: 31,
      attack: 0,
      defense: 31,
      specialAttack: 0,
      specialDefense: 31,
      speed: 0,
    };
    expect(getHiddenPowerPower(ivs)).toBe(53);
  });
});