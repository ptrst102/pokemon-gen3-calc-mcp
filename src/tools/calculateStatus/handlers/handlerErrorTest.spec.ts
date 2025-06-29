import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import { calculateStatusHandler } from "./handler";

describe("calculateStatusHandler エラーハンドリング", () => {
  it("ツール固有のバリデーションエラーを適切に処理する", async () => {
    // 存在しないポケモン
    const result1 = await calculateStatusHandler({
      pokemonName: "存在しないポケモン",
      level: 50,
      nature: "おくびょう",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    });
    const output1 = parseResponse<{ error: string }>(result1);
    expect(output1.error).toContain("ポケモン「存在しないポケモン」が見つかりません");

    // 無効なせいかく
    const result2 = await calculateStatusHandler({
      pokemonName: "サンダー",
      level: 50,
      nature: "無効なせいかく",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    });
    const output2 = parseResponse<{ error: string }>(result2);
    expect(output2.error).toContain("無効なせいかくです");
  });
});
