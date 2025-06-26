import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import type {
  CalculateStatusErrorOutput,
  CalculateStatusOutput,
} from "../types";
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
    expect(result.content).toBeDefined();
    const output = parseResponse<CalculateStatusOutput>(result);
    expect(output.pokemonName).toBe("フシギダネ");
    expect(output.stats.hp).toBe(112);
    expect(output.stats.atk).toBe(61);
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
    const output = parseResponse<CalculateStatusErrorOutput>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain("ポケモン「ミュウツーX」が見つかりません");
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
    const output = parseResponse<CalculateStatusErrorOutput>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain("せいかく「つよき」が見つかりません");
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
    const output = parseResponse<CalculateStatusErrorOutput>(result);
    expect("error" in output).toBe(true);
    if ("error" in output) {
      expect(output.error).toContain(
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

    const output = parseResponse<CalculateStatusOutput>(result);
    expect(output.pokemonName).toBe("ヌケニン");
    expect(output.stats.hp).toBe(1);
  });
});
