import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { formatError } from "./formatError";

describe("formatError", () => {
  it("Errorインスタンスのメッセージを返す", () => {
    const error = new Error("テストエラー");
    const result = formatError(error);

    expect(result.isError).toBe(true);
    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("テストエラー");
    expect(parsed.move).toEqual({
      type: "unknown",
      power: 0,
      category: "unknown",
    });
  });

  it("Error以外のオブジェクトの場合はデフォルトメッセージを返す", () => {
    const error = "文字列エラー";
    const result = formatError(error);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("不明なエラーが発生しました");
  });

  it("ZodErrorの場合は分かりやすいメッセージに変換する", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "object",
        received: "undefined",
        path: ["move"],
        message: "Required",
      },
    ]);

    const result = formatError(zodError);
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("入力エラー:\n「move」フィールドが必須です");
  });

  it("複数のZodErrorを適切にフォーマットする", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "object",
        received: "undefined",
        path: ["attacker"],
        message: "Required",
      },
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["defender", "level"],
        message: "Expected number, received string",
      },
    ]);

    const result = formatError(zodError);
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(
      "入力エラー:\n「attacker」フィールドが必須です\n「defender.level」はnumber型である必要があります（現在: string型）",
    );
  });

  it("数値範囲エラーを適切にフォーマットする", () => {
    const zodError = new ZodError([
      {
        code: "too_small",
        minimum: 1,
        type: "number",
        inclusive: true,
        exact: false,
        path: ["attacker", "level"],
        message: "Number must be greater than or equal to 1",
      },
    ]);

    const result = formatError(zodError);
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(
      "入力エラー:\n「attacker.level」は1以上である必要があります",
    );
  });
});
