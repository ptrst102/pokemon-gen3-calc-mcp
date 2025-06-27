import { describe, expect, it } from "vitest";
import { calculateLowKickPower } from "./calculateLowKickPower";

describe("calculateLowKickPower", () => {
  describe("10kg以下の場合", () => {
    it("0kgの場合、威力20を返す", () => {
      expect(calculateLowKickPower(0)).toBe(20);
    });

    it("10kgの場合、威力20を返す", () => {
      expect(calculateLowKickPower(10.0)).toBe(20);
    });

    it("6.0kg（ピカチュウ）の場合、威力20を返す", () => {
      expect(calculateLowKickPower(6.0)).toBe(20);
    });
  });

  describe("10.1kg～25kgの場合", () => {
    it("10.1kgの場合、威力40を返す", () => {
      expect(calculateLowKickPower(10.1)).toBe(40);
    });

    it("25kgの場合、威力40を返す", () => {
      expect(calculateLowKickPower(25.0)).toBe(40);
    });

    it("13.0kg（フシギソウ）の場合、威力40を返す", () => {
      expect(calculateLowKickPower(13.0)).toBe(40);
    });
  });

  describe("25.1kg～50kgの場合", () => {
    it("25.1kgの場合、威力60を返す", () => {
      expect(calculateLowKickPower(25.1)).toBe(60);
    });

    it("50kgの場合、威力60を返す", () => {
      expect(calculateLowKickPower(50.0)).toBe(60);
    });

    it("30.0kg（ピジョン）の場合、威力60を返す", () => {
      expect(calculateLowKickPower(30.0)).toBe(60);
    });
  });

  describe("50.1kg～100kgの場合", () => {
    it("50.1kgの場合、威力80を返す", () => {
      expect(calculateLowKickPower(50.1)).toBe(80);
    });

    it("100kgの場合、威力80を返す", () => {
      expect(calculateLowKickPower(100.0)).toBe(80);
    });

    it("76.6kg（ゴルダック）の場合、威力80を返す", () => {
      expect(calculateLowKickPower(76.6)).toBe(80);
    });
  });

  describe("100.1kg～200kgの場合", () => {
    it("100.1kgの場合、威力100を返す", () => {
      expect(calculateLowKickPower(100.1)).toBe(100);
    });

    it("200kgの場合、威力100を返す", () => {
      expect(calculateLowKickPower(200.0)).toBe(100);
    });

    it("130.0kg（カイリキー）の場合、威力100を返す", () => {
      expect(calculateLowKickPower(130.0)).toBe(100);
    });
  });

  describe("200.1kg以上の場合", () => {
    it("200.1kgの場合、威力120を返す", () => {
      expect(calculateLowKickPower(200.1)).toBe(120);
    });

    it("500kgの場合、威力120を返す", () => {
      expect(calculateLowKickPower(500.0)).toBe(120);
    });

    it("460.0kg（カビゴン）の場合、威力120を返す", () => {
      expect(calculateLowKickPower(460.0)).toBe(120);
    });
  });
});
