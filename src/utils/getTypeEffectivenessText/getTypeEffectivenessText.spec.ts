import { describe, expect, it } from "vitest";
import { getTypeEffectivenessText } from "./getTypeEffectivenessText";

describe("getTypeEffectivenessText", () => {
  it("効果なしの場合", () => {
    expect(getTypeEffectivenessText(0)).toBe("こうかなし (0倍)");
  });

  it("いまひとつの場合", () => {
    expect(getTypeEffectivenessText(0.25)).toBe("いまひとつ (0.25倍)");
    expect(getTypeEffectivenessText(0.5)).toBe("いまひとつ (0.5倍)");
  });

  it("通常の場合", () => {
    expect(getTypeEffectivenessText(1)).toBe("通常 (1倍)");
  });

  it("こうかばつぐんの場合", () => {
    expect(getTypeEffectivenessText(2)).toBe("こうかばつぐん (2倍)");
    expect(getTypeEffectivenessText(4)).toBe("こうかばつぐん (4倍)");
  });
});
