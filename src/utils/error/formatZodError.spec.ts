import { describe, expect, it } from "vitest";
import { z, ZodError } from "zod";
import { formatZodError } from "./formatZodError";

describe("formatZodError", () => {
  describe("invalid_type エラー", () => {
    it("undefinedの場合、必須フィールドエラーとして表示する", () => {
      const schema = z.object({
        name: z.string(),
      });
      
      try {
        schema.parse({});
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「name」フィールドが必須です");
        }
      }
    });

    it("型が異なる場合、型エラーとして表示する", () => {
      const schema = z.object({
        age: z.number(),
      });
      
      try {
        schema.parse({ age: "20" });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「age」はnumber型である必要があります（現在: string型）");
        }
      }
    });

    it("ネストしたフィールドのエラーも正しくパス表示する", () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string(),
          }),
        }),
      });
      
      try {
        schema.parse({ user: { profile: {} } });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「user.profile.name」フィールドが必須です");
        }
      }
    });
  });

  describe("invalid_union エラー", () => {
    it("moveフィールドの場合、特別なメッセージを表示する", () => {
      const schema = z.object({
        move: z.union([
          z.string(),
          z.object({ type: z.string(), power: z.number() }),
        ]),
      });
      
      try {
        // boolean型を渡すことで、どちらのunion型にもマッチしない
        schema.parse({ move: true });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe('入力エラー:\n「move」は文字列（わざ名）または { type: "タイプ名", power: 威力 } の形式で指定してください');
        }
      }
    });

    it("move以外のunionエラーの場合、一般的なメッセージを表示する", () => {
      const schema = z.object({
        data: z.union([z.string(), z.number()]),
      });
      
      try {
        schema.parse({ data: [] }); // 配列は許可されていない
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「data」の形式が正しくありません");
        }
      }
    });

    it("unionでundefinedの場合、必須フィールドエラーとして表示する", () => {
      const schema = z.object({
        value: z.union([z.string(), z.number()]),
      });
      
      try {
        schema.parse({}); // valueが未定義
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「value」フィールドが必須です");
        }
      }
    });
  });

  describe("数値範囲エラー", () => {
    it("too_smallエラーの場合、最小値を表示する", () => {
      const schema = z.object({
        level: z.number().min(1),
      });
      
      try {
        schema.parse({ level: 0 });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「level」は1以上である必要があります");
        }
      }
    });

    it("too_bigエラーの場合、最大値を表示する", () => {
      const schema = z.object({
        level: z.number().max(100),
      });
      
      try {
        schema.parse({ level: 101 });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「level」は100以下である必要があります");
        }
      }
    });
  });

  describe("enum エラー", () => {
    it("invalid_enum_valueエラーの場合、許可された値を表示する", () => {
      const schema = z.object({
        weather: z.enum(["sunny", "rainy", "cloudy"]),
      });
      
      try {
        schema.parse({ weather: "foggy" });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toBe("入力エラー:\n「weather」は次のいずれかの値である必要があります: sunny, rainy, cloudy");
        }
      }
    });
  });

  describe("デフォルト処理", () => {
    it("未対応のエラーコードの場合、デフォルトメッセージを表示する", () => {
      // カスタムエラーを作成
      const customError = new ZodError([
        {
          code: "custom" as any,
          path: ["field"],
          message: "カスタムエラーメッセージ",
        },
      ]);
      
      const result = formatZodError(customError);
      expect(result).toBe("入力エラー:\n「field」: カスタムエラーメッセージ");
    });
  });

  describe("複数エラー", () => {
    it("複数のエラーがある場合、すべて表示する", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().min(0).max(150),
        email: z.string().email(),
      });
      
      try {
        schema.parse({
          age: -1,
          email: "invalid",
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const result = formatZodError(error);
          expect(result).toContain("「name」フィールドが必須です");
          expect(result).toContain("「age」は0以上である必要があります");
          expect(result).toContain("「email」:");
        }
      }
    });
  });
});