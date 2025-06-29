import { describe, expect, it } from "vitest";
import { parseResponse } from "./parseResponse";

describe("parseResponse", () => {
  it("正常なレスポンスをパースする", () => {
    const response = {
      content: [{ type: "text", text: '{"value": 42}' }],
    };
    expect(parseResponse(response)).toEqual({ value: 42 });
  });

  it("不正な形式でエラーを投げる", () => {
    // textタイプでない場合
    expect(() =>
      parseResponse({ content: [{ type: "image", text: "{}" }] }),
    ).toThrowError("Unexpected response format");

    // 空のcontent
    expect(() => parseResponse({ content: [] })).toThrowError(
      "Unexpected response format",
    );

    // 無効なJSON
    expect(() =>
      parseResponse({ content: [{ type: "text", text: "invalid" }] }),
    ).toThrow();
  });
});
