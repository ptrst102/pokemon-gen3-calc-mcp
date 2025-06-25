import { describe, expect, it } from "vitest";
import { calculateStatusHandler } from "./handler";

describe("calculate-status tool", () => {
  it("正常な入力でステータスを計算できること", async () => {
    const input = {
      pokemonName: "フシギダネ",
      level: 50,
      nature: "まじめ",
      ivs: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };

    const result = await calculateStatusHandler(input);

    expect(result).toBeDefined();
    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent?.pokemonName).toBe("フシギダネ");
    expect(result.structuredContent?.stats?.hp).toBe(112);
    expect(result.structuredContent?.stats?.atk).toBe(61);
  });

  it("存在しないポケモン名でエラーになること", async () => {
    const input = {
      pokemonName: "ミュウツーX",
      level: 50,
      nature: "まじめ",
      ivs: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };

    const result = await calculateStatusHandler(input);
    expect("error" in result.structuredContent).toBe(true);
    if ("error" in result.structuredContent) {
      expect(result.structuredContent.error).toContain(
        "ポケモン「ミュウツーX」が見つかりません",
      );
    }
  });

  it("存在しない性格でエラーになること", async () => {
    const input = {
      pokemonName: "フシギダネ",
      level: 50,
      nature: "つよき",
      ivs: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };

    const result = await calculateStatusHandler(input);
    expect("error" in result.structuredContent).toBe(true);
    if ("error" in result.structuredContent) {
      expect(result.structuredContent.error).toContain(
        "せいかく「つよき」が見つかりません",
      );
    }
  });

  it("努力値の合計が510を超える場合エラーになること", async () => {
    const input = {
      pokemonName: "フシギダネ",
      level: 50,
      nature: "まじめ",
      ivs: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 },
      evs: { hp: 252, atk: 252, def: 252, spa: 0, spd: 0, spe: 0 },
    };

    const result = await calculateStatusHandler(input);
    expect("error" in result.structuredContent).toBe(true);
    if ("error" in result.structuredContent) {
      expect(result.structuredContent.error).toContain(
        "努力値の合計は510以下でなければなりません",
      );
    }
  });

  it("ヌケニンのHPは個体値・努力値に関わらず1になること", async () => {
    const input = {
      pokemonName: "ヌケニン",
      level: 50,
      nature: "まじめ",
      ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };

    const result = await calculateStatusHandler(input);

    expect(result.structuredContent?.pokemonName).toBe("ヌケニン");
    expect(result.structuredContent?.stats?.hp).toBe(1);
  });
});
