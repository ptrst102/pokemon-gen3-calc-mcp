import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingAttackHandler } from "./handler";

describe("calculateDamageMatrixVaryingAttackHandler エラーハンドリング", () => {
  it("ツール固有のバリデーションエラーを適切に処理する", async () => {
    // 存在しないわざ
    const response = await calculateDamageMatrixVaryingAttackHandler({
      move: "存在しないわざ",
      attacker: {
        pokemonName: "ピカチュウ",
        isPhysicalAttack: false,
        stat: { iv: 31 },
      },
      defender: {
        pokemonName: "メタグロス",
        stat: { iv: 31, ev: 252 },
      },
    });
    const parsed = JSON.parse(response.content[0].text);
    expect(parsed.error).toBeDefined();
    expect(parsed.error).toContain("わざ「存在しないわざ」が見つかりません");
  });
});
