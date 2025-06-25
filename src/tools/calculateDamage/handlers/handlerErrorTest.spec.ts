import { describe, expect, it } from "vitest";
import { parseResponse } from "@/tools/test-helpers/parseResponse";
import { calculateDamageHandler } from "./handler";

describe("calculateDamageHandler エラーハンドリング", () => {
  it("必須フィールドが欠けている場合、分かりやすいエラーメッセージを返す", async () => {
    // moveフィールドがない
    const input = {
      attacker: {
        stat: { value: 194 },
        level: 50,
        pokemonName: "サンダー",
      },
      defender: {
        stat: { value: 131 },
        level: 50,
        pokemonName: "メタグロス",
      },
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output && output.error).toContain(
      '「move」は文字列（わざ名）または { type: "タイプ名", power: 威力 } の形式で指定してください',
    );
  });

  it("不正なJSONフォーマットの場合でも適切に処理する", async () => {
    const input = undefined;
    const result = await calculateDamageHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output && output.error).toBeTruthy();
    if ("error" in output) {
      expect(output.error).toContain("入力エラー");
    }
  });

  it("存在しないポケモン名の場合、具体的なエラーメッセージを返す", async () => {
    const input = {
      move: "10まんボルト",
      attacker: {
        stat: { value: 194 },
        level: 50,
        pokemonName: "存在しないポケモン",
      },
      defender: {
        stat: { value: 131 },
        level: 50,
        pokemonName: "メタグロス",
      },
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output && output.error).toContain(
      "ポケモン「存在しないポケモン」が見つかりません",
    );
  });

  it("存在しないわざ名の場合、具体的なエラーメッセージを返す", async () => {
    const input = {
      move: "存在しないわざ",
      attacker: {
        stat: { value: 194 },
        level: 50,
        pokemonName: "サンダー",
      },
      defender: {
        stat: { value: 131 },
        level: 50,
        pokemonName: "メタグロス",
      },
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output && output.error).toContain(
      "わざ「存在しないわざ」が見つかりません",
    );
  });

  it("レベルが範囲外の場合、分かりやすいエラーメッセージを返す", async () => {
    const input = {
      move: "10まんボルト",
      attacker: {
        stat: { value: 194 },
        level: 0,
        pokemonName: "サンダー",
      },
      defender: {
        stat: { value: 131 },
        level: 50,
        pokemonName: "メタグロス",
      },
    };

    const result = await calculateDamageHandler(input);
    const output = parseResponse<{ error: string }>(result);
    expect("error" in output && output.error).toContain(
      "「attacker.level」は1以上である必要があります",
    );
  });
});
