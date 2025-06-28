import { describe, expect, it } from "vitest";
import type { TypeName } from "@/types";
import { resolveMove } from "./resolveMove";

describe("resolveMove", () => {
  describe("技名から変換", () => {
    it("存在する技名を正しく解決できる", () => {
      const result = resolveMove("１０まんボルト");
      expect(result).toEqual({
        name: "１０まんボルト",
        type: "でんき",
        power: 95,
        isPhysical: false,
      });
    });

    it("物理技を正しく判定する", () => {
      const result = resolveMove("アイアンテール");
      expect(result).toEqual({
        name: "アイアンテール",
        type: "はがね",
        power: 100,
        isPhysical: true,
      });
    });

    it("存在しない技名はエラーになる", () => {
      expect(() => resolveMove("存在しない技")).toThrow(
        "わざ「存在しない技」が見つかりません",
      );
    });

    it("未対応の威力不定技はエラーになる", () => {
      const unsupportedMoves = [
        "ころがる",
        "れんぞくぎり",
        "アイスボール",
        "いかり",
        "しおふき",
        "ふんか",
        "マグニチュード",
        "プレゼント",
        "トリプルキック",
        "めざめるパワー",
        "はきだす",
        "サイコウェーブ",
        "ふくろだたき",
        "みらいよち",
        "はめつのねがい",
      ];

      for (const moveName of unsupportedMoves) {
        expect(() => resolveMove(moveName)).toThrow(
          `${moveName}には対応していません`,
        );
      }
    });
  });

  describe("カスタム技", () => {
    it("タイプと威力から技を作成できる", () => {
      const result = resolveMove({
        type: "ほのお",
        power: 80,
      });
      expect(result).toEqual({
        type: "ほのお",
        power: 80,
        isPhysical: false, // ほのおタイプなので特殊
      });
    });

    it("isPhysicalを明示的に指定できる", () => {
      const result = resolveMove({
        type: "ほのお",
        power: 80,
        isPhysical: true,
      });
      expect(result).toEqual({
        type: "ほのお",
        power: 80,
        isPhysical: true,
      });
    });

    it("名前を指定できる", () => {
      const result = resolveMove({
        name: "カスタム技",
        type: "みず",
        power: 100,
      });
      expect(result).toEqual({
        name: "カスタム技",
        type: "みず",
        power: 100,
        isPhysical: false,
      });
    });

    it("物理タイプの技を正しく判定する", () => {
      const physicalTypes = [
        "ノーマル",
        "かくとう",
        "どく",
        "じめん",
        "ひこう",
        "むし",
        "いわ",
        "ゴースト",
        "はがね",
      ];

      for (const type of physicalTypes) {
        const result = resolveMove({
          type: type as TypeName,
          power: 80,
        });
        expect(result.isPhysical).toBe(true);
      }
    });

    it("特殊タイプの技を正しく判定する", () => {
      const specialTypes = [
        "ほのお",
        "みず",
        "でんき",
        "くさ",
        "こおり",
        "エスパー",
        "ドラゴン",
        "あく",
      ];

      for (const type of specialTypes) {
        const result = resolveMove({
          type: type as TypeName,
          power: 80,
        });
        expect(result.isPhysical).toBe(false);
      }
    });
  });
});
