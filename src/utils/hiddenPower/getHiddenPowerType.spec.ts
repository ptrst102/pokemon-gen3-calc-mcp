import { describe, expect, it } from "vitest";
import { getHiddenPowerType } from "./getHiddenPowerType";

describe("getHiddenPowerType", () => {
  it("個体値ALL31であくタイプになる", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31,
    };
    expect(getHiddenPowerType(ivs)).toBe("あく");
  });

  it("個体値ALL30でかくとうタイプになる", () => {
    const ivs = {
      hp: 30,
      attack: 30,
      defense: 30,
      specialAttack: 30,
      specialDefense: 30,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("かくとう");
  });

  it("こおりタイプ（HP:31, 攻撃:30, 防御:30, 特攻:31, 特防:31, 素早さ:31）", () => {
    const ivs = {
      hp: 31,
      attack: 30,
      defense: 30,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31,
    };
    expect(getHiddenPowerType(ivs)).toBe("こおり");
  });

  it("ほのおタイプ（HP:31, 攻撃:30, 防御:31, 特攻:30, 特防:31, 素早さ:30）", () => {
    const ivs = {
      hp: 31,
      attack: 30,
      defense: 31,
      specialAttack: 30,
      specialDefense: 31,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("ほのお");
  });

  it("じめんタイプ（HP:31, 攻撃:31, 防御:31, 特攻:30, 特防:30, 素早さ:31）", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 30,
      specialDefense: 30,
      speed: 31,
    };
    expect(getHiddenPowerType(ivs)).toBe("じめん");
  });

  it("エスパータイプ（HP:31, 攻撃:31, 防御:30, 特攻:31, 特防:31, 素早さ:30）", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 30,
      specialAttack: 31,
      specialDefense: 31,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("エスパー");
  });

  it("かくとうタイプ（HP:31, 攻撃:31, 防御:30, 特攻:30, 特防:30, 素早さ:30）", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 30,
      specialAttack: 30,
      specialDefense: 30,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("かくとう");
  });

  it("みずタイプ（HP:31, 攻撃:31, 防御:31, 特攻:30, 特防:31, 素早さ:30）", () => {
    const ivs = {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 30,
      specialDefense: 31,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("みず");
  });

  it("エスパータイプ2（HP:31, 攻撃:30, 防御:31, 特攻:31, 特防:31, 素早さ:30）", () => {
    const ivs = {
      hp: 31,
      attack: 30,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 30,
    };
    expect(getHiddenPowerType(ivs)).toBe("エスパー");
  });

  it("くさタイプ（HP:31, 攻撃:30, 防御:31, 特攻:30, 特防:31, 素早さ:31）", () => {
    const ivs = {
      hp: 31,
      attack: 30,
      defense: 31,
      specialAttack: 30,
      specialDefense: 31,
      speed: 31,
    };
    expect(getHiddenPowerType(ivs)).toBe("くさ");
  });

  it("個体値0の場合も正しく計算される", () => {
    const ivs = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    expect(getHiddenPowerType(ivs)).toBe("かくとう");
  });

  it("個体値が混在する場合も正しく計算される", () => {
    const ivs = {
      hp: 15,
      attack: 20,
      defense: 14,
      specialAttack: 26,
      specialDefense: 30,
      speed: 31,
    };
    expect(getHiddenPowerType(ivs)).toBe("どく");
  });
});
