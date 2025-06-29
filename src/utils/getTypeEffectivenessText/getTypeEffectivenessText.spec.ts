import { describe, expect, it } from "vitest";
import { getTypeEffectivenessText } from "./getTypeEffectivenessText";

describe("getTypeEffectivenessText", () => {
  it("タイプ相性に応じた説明文を返す", () => {
    expect(getTypeEffectivenessText(0)).toBe("こうかなし (0倍)");
    expect(getTypeEffectivenessText(0.5)).toBe("いまひとつ (0.5倍)");
    expect(getTypeEffectivenessText(1)).toBe("通常 (1倍)");
    expect(getTypeEffectivenessText(2)).toBe("こうかばつぐん (2倍)");
  });
});
