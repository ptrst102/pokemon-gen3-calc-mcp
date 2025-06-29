import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingDefenseHandler } from "./handler";

describe("calculateDamageMatrixVaryingDefenseHandler エラーハンドリング", () => {
  it("ツール固有のバリデーションエラーを適切に処理する", async () => {
    // 存在しないわざ
    const response = await calculateDamageMatrixVaryingDefenseHandler({
      move: "存在しないわざ",
      attacker: {
        pokemonName: "ピカチュウ",
        stat: { iv: 31, ev: 252 },
      },
      defender: {
        pokemonName: "メタグロス",
        isPhysicalDefense: true,
        stat: { iv: 31 },
      },
    });
    const parsed = JSON.parse(response.content[0].text);
    expect(parsed.error).toBeDefined();
    expect(parsed.error).toContain("わざ「存在しないわざ」が見つかりません");
  });
});
