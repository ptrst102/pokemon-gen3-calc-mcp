import { describe, expect, it } from "vitest";
import { MOVES } from "./moves";
import { UNSUPPORTED_MOVES } from "./unsupportedMoves";

describe("unsupportedMoves", () => {
  it("未対応技リストと対応技リストに重複がない", () => {
    const supportedMoveNames = new Set<string>(MOVES.map((move) => move.name));
    const duplicates = UNSUPPORTED_MOVES.filter((unsupportedMove) =>
      supportedMoveNames.has(unsupportedMove),
    );

    expect(duplicates).toEqual([]);
  });

  it("対応技リストに未対応技が含まれていない", () => {
    const unsupportedSet = new Set<string>(UNSUPPORTED_MOVES);
    const incorrectlySupported = MOVES.filter((move) =>
      unsupportedSet.has(move.name),
    );

    expect(incorrectlySupported).toEqual([]);
  });
});
