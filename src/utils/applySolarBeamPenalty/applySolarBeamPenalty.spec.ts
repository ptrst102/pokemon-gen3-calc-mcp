import { describe, expect, it } from "vitest";
import { applySolarBeamPenalty } from "./applySolarBeamPenalty";

describe("applySolarBeamPenalty", () => {
  it("ソーラービーム以外の技はダメージを変更しない", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];

    expect(applySolarBeamPenalty(damages, "10まんボルト", "あめ")).toEqual(
      damages,
    );
    expect(applySolarBeamPenalty(damages, undefined, "あめ")).toEqual(damages);
    expect(applySolarBeamPenalty(damages, "だいもんじ", "すなあらし")).toEqual(
      damages,
    );
  });

  it("ソーラービームで天候がはれの場合はダメージを変更しない", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];

    expect(applySolarBeamPenalty(damages, "ソーラービーム", "はれ")).toEqual(
      damages,
    );
  });

  it("ソーラービームで天候が指定されていない場合はダメージを変更しない", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];

    expect(applySolarBeamPenalty(damages, "ソーラービーム", undefined)).toEqual(
      damages,
    );
  });

  it("ソーラービームであめの場合、ダメージを1/2にする", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];
    const expected = [
      50, 50, 51, 51, 52, 52, 53, 53, 54, 54, 55, 55, 56, 56, 57, 57,
    ];

    expect(applySolarBeamPenalty(damages, "ソーラービーム", "あめ")).toEqual(
      expected,
    );
  });

  it("ソーラービームですなあらしの場合、ダメージを1/2にする", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];
    const expected = [
      50, 50, 51, 51, 52, 52, 53, 53, 54, 54, 55, 55, 56, 56, 57, 57,
    ];

    expect(
      applySolarBeamPenalty(damages, "ソーラービーム", "すなあらし"),
    ).toEqual(expected);
  });

  it("ソーラービームであられの場合、ダメージを1/2にする", () => {
    const damages = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
      115,
    ];
    const expected = [
      50, 50, 51, 51, 52, 52, 53, 53, 54, 54, 55, 55, 56, 56, 57, 57,
    ];

    expect(applySolarBeamPenalty(damages, "ソーラービーム", "あられ")).toEqual(
      expected,
    );
  });

  it("ダメージが奇数の場合、切り捨てで計算される", () => {
    const damages = [99, 101, 103];
    const expected = [49, 50, 51]; // 99 * 0.5 = 49.5 → 49

    expect(applySolarBeamPenalty(damages, "ソーラービーム", "あめ")).toEqual(
      expected,
    );
  });
});
