import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import { calculateDamageHandler } from "./handler";

describe("calculateDamageHandler エラーハンドリング", () => {
  it("ツール固有のバリデーションエラーを適切に処理する", async () => {
    // 存在しないわざ
    const result = await calculateDamageHandler({
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
    });
    const output = parseResponse<{ error: string }>(result);
    expect(output.error).toContain("わざ「存在しないわざ」が見つかりません");
  });
});
