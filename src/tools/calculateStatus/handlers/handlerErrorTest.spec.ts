import { describe, expect, it } from "vitest";
import { parseResponse } from "@/tests/parseResponse";
import { calculateStatusHandler } from "./handler";

describe("calculateStatusHandler エラーハンドリング", () => {
  it("必須フィールドが欠けている場合、分かりやすいエラーメッセージを返す", async () => {
    // pokemonNameフィールドがない
    const input = {
      level: 50,
      nature: "おくびょう",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    };

    const result = await calculateStatusHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain("「pokemonName」フィールドが必須です");
    }
  });

  it("存在しないポケモン名の場合、具体的なエラーメッセージを返す", async () => {
    const input = {
      pokemonName: "存在しないポケモン",
      level: 50,
      nature: "おくびょう",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    };

    const result = await calculateStatusHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain(
        "ポケモン「存在しないポケモン」が見つかりません",
      );
    }
  });

  it("無効なせいかくの場合、エラーメッセージを返す", async () => {
    const input = {
      pokemonName: "サンダー",
      level: 50,
      nature: "無効なせいかく",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    };

    const result = await calculateStatusHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain(
        "せいかく「無効なせいかく」が見つかりません",
      );
    }
  });

  it("努力値が範囲外の場合、分かりやすいエラーメッセージを返す", async () => {
    const input = {
      pokemonName: "サンダー",
      level: 50,
      nature: "おくびょう",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 300, spd: 4, spe: 252 }, // spaが252を超えている
    };

    const result = await calculateStatusHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain(
        "「evs.spa」は252以下である必要があります",
      );
    }
  });
});
