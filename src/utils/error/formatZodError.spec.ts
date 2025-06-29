import { describe, expect, it } from "vitest";
import { z, ZodError } from "zod";
import { formatZodError } from "./formatZodError";

describe("formatZodError", () => {
  it("主要なエラータイプを適切にフォーマットする", () => {
    // 必須フィールド
    try {
      z.object({ name: z.string() }).parse({});
    } catch (error) {
      if (error instanceof ZodError) {
        expect(formatZodError(error)).toBe("入力エラー:\n「name」フィールドが必須です");
      }
    }

    // 型エラー
    try {
      z.object({ age: z.number() }).parse({ age: "20" });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(formatZodError(error)).toBe("入力エラー:\n「age」はnumber型である必要があります（現在: string型）");
      }
    }

    // 数値範囲
    try {
      z.object({ level: z.number().min(1) }).parse({ level: 0 });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(formatZodError(error)).toBe("入力エラー:\n「level」は1以上である必要があります");
      }
    }
  });

  it("union型のmoveフィールドで特別なメッセージを表示する", () => {
    const schema = z.object({
      move: z.union([z.string(), z.object({ type: z.string(), power: z.number() })]),
    });
    
    try {
      schema.parse({ move: true });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(formatZodError(error)).toBe(
          '入力エラー:\n「move」は文字列（わざ名）または { type: "タイプ名", power: 威力 } の形式で指定してください'
        );
      }
    }
  });

  it("union型でundefinedの場合は必須フィールドエラーを表示する", () => {
    try {
      z.object({ value: z.union([z.string(), z.number()]) }).parse({});
    } catch (error) {
      if (error instanceof ZodError) {
        expect(formatZodError(error)).toBe("入力エラー:\n「value」フィールドが必須です");
      }
    }
  });
});