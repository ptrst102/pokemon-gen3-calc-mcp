import { describe, expect, it } from "vitest";
import { parseResponse } from "./parseResponse";

describe("parseResponse", () => {
  describe("正常系", () => {
    it("通常のレスポンスからJSONを抽出できる", () => {
      const response = {
        content: [
          {
            type: "text",
            text: '{"result": "success", "value": 42}',
          },
        ],
      };

      const result = parseResponse<{ result: string; value: number }>(response);
      expect(result).toEqual({ result: "success", value: 42 });
    });

    it("エラーレスポンスからJSONを抽出できる", () => {
      const response = {
        isError: true,
        content: [
          {
            type: "text",
            text: '{"error": "Something went wrong"}',
          },
        ],
      };

      const result = parseResponse<{ error: string }>(response);
      expect(result).toEqual({ error: "Something went wrong" });
    });

    it("複雑なオブジェクト構造を正しくパースできる", () => {
      const response = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              stats: {
                hp: 100,
                attack: 110,
                defense: 90,
              },
              types: ["ほのお", "ひこう"],
              abilities: [{ name: "もうか", active: true }],
            }),
          },
        ],
      };

      const result = parseResponse<{
        stats: { hp: number; attack: number; defense: number };
        types: string[];
        abilities: Array<{ name: string; active: boolean }>;
      }>(response);

      expect(result).toEqual({
        stats: {
          hp: 100,
          attack: 110,
          defense: 90,
        },
        types: ["ほのお", "ひこう"],
        abilities: [{ name: "もうか", active: true }],
      });
    });
  });

  describe("異常系", () => {
    it("contentが空の場合、エラーを投げる", () => {
      const response = {
        content: [],
      };

      expect(() => parseResponse(response)).toThrowError(
        "Unexpected response format",
      );
    });

    it("contentの最初の要素がtextタイプでない場合、エラーを投げる", () => {
      const response = {
        content: [
          {
            type: "image",
            text: '{"result": "success"}',
          },
        ],
      };

      expect(() => parseResponse(response)).toThrowError(
        "Unexpected response format",
      );
    });

    it("textが無効なJSONの場合、JSONパースエラーを投げる", () => {
      const response = {
        content: [
          {
            type: "text",
            text: "invalid json {",
          },
        ],
      };

      expect(() => parseResponse(response)).toThrow();
    });

    it("contentの最初の要素がundefinedの場合、エラーを投げる", () => {
      const response = {
        content: [undefined as any],
      };

      expect(() => parseResponse(response)).toThrowError(
        "Unexpected response format",
      );
    });
  });

  describe("型推論", () => {
    it("ジェネリック型パラメータで指定した型として返される", () => {
      interface ExpectedType {
        id: number;
        name: string;
      }

      const response = {
        content: [
          {
            type: "text",
            text: '{"id": 1, "name": "test"}',
          },
        ],
      };

      const result = parseResponse<ExpectedType>(response);
      
      // TypeScriptの型チェックが通ることを確認
      const id: number = result.id;
      const name: string = result.name;
      
      expect(id).toBe(1);
      expect(name).toBe("test");
    });
  });
});