import { describe, expect, it } from "vitest";
import type { Nature } from "@/data/natures";
import { natureModifier } from "./natureModifier";

describe("natureModifier", () => {
  it("せいかくによる補正を正しく適用する", () => {
    const neutral: Nature = { name: "まじめ" };
    const adamant: Nature = { name: "いじっぱり", plus: "atk", minus: "spa" };

    // 補正なし
    expect(natureModifier(neutral, "atk")).toBe(1.0);

    // 上昇補正
    expect(natureModifier(adamant, "atk")).toBe(1.1);

    // 下降補正
    expect(natureModifier(adamant, "spa")).toBe(0.9);

    // 補正対象外
    expect(natureModifier(adamant, "def")).toBe(1.0);
  });
});
