import { describe, expect, it } from "vitest";
import { calculateLowKickPower } from "./calculateLowKickPower";

describe("calculateLowKickPower", () => {
  it("体重による威力を正しく計算する", () => {
    // 各重量帯の代表値をテスト
    expect(calculateLowKickPower(6.0)).toBe(20);   // ピカチュウ (10kg以下)
    expect(calculateLowKickPower(13.0)).toBe(40);  // フシギソウ (10.1-25kg)
    expect(calculateLowKickPower(30.0)).toBe(60);  // ピジョン (25.1-50kg)
    expect(calculateLowKickPower(76.6)).toBe(80);  // ゴルダック (50.1-100kg)
    expect(calculateLowKickPower(130.0)).toBe(100); // カイリキー (100.1-200kg)
    expect(calculateLowKickPower(460.0)).toBe(120); // カビゴン (200.1kg以上)
  });

  it("境界値で正しく動作する", () => {
    // 重要な境界値のみテスト
    expect(calculateLowKickPower(10.0)).toBe(20);
    expect(calculateLowKickPower(10.1)).toBe(40);
    expect(calculateLowKickPower(200.0)).toBe(100);
    expect(calculateLowKickPower(200.1)).toBe(120);
  });
});
