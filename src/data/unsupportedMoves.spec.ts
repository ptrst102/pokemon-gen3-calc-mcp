import { describe, expect, it } from "vitest";
import { UNSUPPORTED_MOVES } from "./unsupportedMoves";

describe("unsupportedMoves", () => {
  it("未対応技リストに重複がないことを確認", () => {
    const uniqueMoves = new Set(UNSUPPORTED_MOVES);
    expect(uniqueMoves.size).toBe(UNSUPPORTED_MOVES.length);
  });

  it("期待される15個の未対応技がすべて含まれている", () => {
    expect(UNSUPPORTED_MOVES).toHaveLength(15);

    // Issue #51で指定された技がすべて含まれていることを確認
    const expectedMoves = [
      // 連続使用で威力が変化する技
      "ころがる",
      "れんぞくぎり",
      "アイスボール",
      "いかり",
      // HP依存の技
      "しおふき",
      "ふんか",
      // 確率で威力が変化する技
      "マグニチュード",
      "プレゼント",
      // 多段ヒット技
      "トリプルキック",
      // 個体値で威力とタイプが変わる技
      "めざめるパワー",
      // その他
      "はきだす",
      "サイコウェーブ",
      "ふくろだたき",
      "みらいよち",
      "はめつのねがい",
    ];

    for (const move of expectedMoves) {
      expect(UNSUPPORTED_MOVES).toContain(move);
    }
  });
});
