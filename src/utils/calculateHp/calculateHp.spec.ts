import { describe, expect, it } from "vitest";
import { calculateHp } from "./calculateHp";

describe("calculateHp", () => {
  it("レベル50、種族値45、個体値31、努力値0の場合", () => {
    const result = calculateHp({
      baseStat: 45,
      iv: 31,
      ev: 0,
      level: 50,
    });
    expect(result).toBe(120);
  });

  it("レベル100、種族値45、個体値31、努力値252の場合", () => {
    const result = calculateHp({
      baseStat: 45,
      iv: 31,
      ev: 252,
      level: 100,
    });
    expect(result).toBe(294);
  });

  it("個体値0の場合", () => {
    const result = calculateHp({
      baseStat: 45,
      iv: 0,
      ev: 0,
      level: 50,
    });
    expect(result).toBe(105);
  });
});
