import { describe, expect, it } from "vitest";
import { MOVES } from "../moves";
import { UNSUPPORTED_MOVES } from "./unsupportedMoves";

describe("unsupportedMoves", () => {
  it("MOVES と UNSUPPORTED_MOVES に重複がないこと", () => {
    const allNames = [...MOVES.map((move) => move.name), ...UNSUPPORTED_MOVES];

    // Set のサイズと配列の長さが同じなら重複なし
    expect(new Set(allNames).size).toBe(allNames.length);
  });
});
