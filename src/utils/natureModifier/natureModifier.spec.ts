import { describe, expect, it } from "vitest";
import type { Nature } from "@/data/natures";
import { NATURE_MODIFIER_MAP, natureModifier } from "./natureModifier";

describe("natureModifier", () => {
  it("補正なしのせいかくで1.0を返すこと", () => {
    const nature: Nature = { name: "まじめ" };

    expect(natureModifier(nature, "atk")).toBe(1.0);
    expect(natureModifier(nature, "def")).toBe(1.0);
    expect(natureModifier(nature, "spa")).toBe(1.0);
    expect(natureModifier(nature, "spd")).toBe(1.0);
    expect(natureModifier(nature, "spe")).toBe(1.0);
  });

  it("上昇補正のあるステータスで1.1を返すこと", () => {
    const nature: Nature = { name: "いじっぱり", plus: "atk", minus: "spa" };

    expect(natureModifier(nature, "atk")).toBe(1.1);
  });

  it("下降補正のあるステータスで0.9を返すこと", () => {
    const nature: Nature = { name: "いじっぱり", plus: "atk", minus: "spa" };

    expect(natureModifier(nature, "spa")).toBe(0.9);
  });

  it("補正のないステータスで1.0を返すこと", () => {
    const nature: Nature = { name: "いじっぱり", plus: "atk", minus: "spa" };

    expect(natureModifier(nature, "def")).toBe(1.0);
    expect(natureModifier(nature, "spd")).toBe(1.0);
    expect(natureModifier(nature, "spe")).toBe(1.0);
  });
});

describe("NATURE_MODIFIER_MAP", () => {
  it("正しい倍率を返すこと", () => {
    expect(NATURE_MODIFIER_MAP.up).toBe(1.1);
    expect(NATURE_MODIFIER_MAP.down).toBe(0.9);
    expect(NATURE_MODIFIER_MAP.neutral).toBe(1.0);
  });
});
