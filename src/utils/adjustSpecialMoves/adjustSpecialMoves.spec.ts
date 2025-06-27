import { describe, expect, it } from "vitest";
import { adjustSpecialMoves } from "./adjustSpecialMoves";

describe("adjustSpecialMoves", () => {
  describe("ウェザーボール", () => {
    it("はれの時はほのおタイプ100威力になる", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "ウェザーボール",
          type: "ノーマル",
          power: 50,
          isPhysical: false,
        },
        weather: "はれ",
      });

      expect(result).toEqual({
        name: "ウェザーボール",
        type: "ほのお",
        power: 100,
        isPhysical: false,
      });
    });

    it("あめの時はみずタイプ100威力になる", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "ウェザーボール",
          type: "ノーマル",
          power: 50,
          isPhysical: false,
        },
        weather: "あめ",
      });

      expect(result).toEqual({
        name: "ウェザーボール",
        type: "みず",
        power: 100,
        isPhysical: false,
      });
    });

    it("あられの時はこおりタイプ100威力になる", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "ウェザーボール",
          type: "ノーマル",
          power: 50,
          isPhysical: false,
        },
        weather: "あられ",
      });

      expect(result).toEqual({
        name: "ウェザーボール",
        type: "こおり",
        power: 100,
        isPhysical: false,
      });
    });

    it("すなあらしの時はいわタイプ100威力物理技になる", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "ウェザーボール",
          type: "ノーマル",
          power: 50,
          isPhysical: false,
        },
        weather: "すなあらし",
      });

      expect(result).toEqual({
        name: "ウェザーボール",
        type: "いわ",
        power: 100,
        isPhysical: true, // すなあらしの時だけ物理技
      });
    });

    it("天候がない時は変更されない", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "ウェザーボール",
          type: "ノーマル",
          power: 50,
          isPhysical: false,
        },
      });

      expect(result).toEqual({
        name: "ウェザーボール",
        type: "ノーマル",
        power: 50,
        isPhysical: false,
      });
    });
  });

  describe("けたぐり", () => {
    it("10kg未満の相手には威力20", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1, // 元の威力は無視される
          isPhysical: true,
        },
        defenderWeight: 9.9,
      });

      expect(result.power).toBe(20);
    });

    it("25kg未満の相手には威力40", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1,
          isPhysical: true,
        },
        defenderWeight: 24.9,
      });

      expect(result.power).toBe(40);
    });

    it("50kg未満の相手には威力60", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1,
          isPhysical: true,
        },
        defenderWeight: 49.9,
      });

      expect(result.power).toBe(60);
    });

    it("100kg未満の相手には威力80", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1,
          isPhysical: true,
        },
        defenderWeight: 99.9,
      });

      expect(result.power).toBe(80);
    });

    it("200kg未満の相手には威力100", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1,
          isPhysical: true,
        },
        defenderWeight: 199.9,
      });

      expect(result.power).toBe(100);
    });

    it("200kgを超える相手には威力120", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 1,
          isPhysical: true,
        },
        defenderWeight: 200.1,
      });

      expect(result.power).toBe(120);
    });

    it("体重が不明な時は変更されない", () => {
      const result = adjustSpecialMoves({
        move: {
          name: "けたぐり",
          type: "かくとう",
          power: 60,
          isPhysical: true,
        },
      });

      expect(result.power).toBe(60);
    });
  });

  describe("通常の技", () => {
    it("特殊処理のない技は変更されない", () => {
      const move = {
        name: "かえんほうしゃ",
        type: "ほのお" as const,
        power: 95,
        isPhysical: false,
      };

      const result = adjustSpecialMoves({
        move,
        weather: "はれ",
        defenderWeight: 100,
      });

      expect(result).toEqual(move);
    });
  });
});
