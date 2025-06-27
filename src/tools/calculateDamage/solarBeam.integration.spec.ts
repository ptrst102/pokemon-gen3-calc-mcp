import { describe, expect, it } from "vitest";
import { parseResponse } from "@/utils/parseResponse";
import {
  isNormalDamageOutput,
  type StructuredOutput,
} from "./handlers/formatters/structuredOutputFormatter";
import { calculateDamageHandler } from "./handlers/handler";

describe("ソーラービーム統合テスト", () => {
  it("はれ状態では通常威力でダメージ計算される", async () => {
    const input = {
      move: "ソーラービーム",
      attacker: {
        level: 50,
        pokemonName: "フシギバナ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "positive" as const,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral" as const,
        },
        statModifier: 0,
      },
      options: {
        weather: "はれ" as const,
      },
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.move.power).toBe(120);
      expect(output.move.type).toBe("くさ");
    }
  });

  it("あめ状態では威力が半分になる", async () => {
    const input = {
      move: "ソーラービーム",
      attacker: {
        level: 50,
        pokemonName: "フシギバナ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "positive" as const,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral" as const,
        },
        statModifier: 0,
      },
      options: {
        weather: "あめ" as const,
      },
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.move.power).toBe(60);
      expect(output.move.type).toBe("くさ");
    }
  });

  it("すなあらし状態では威力が半分になる", async () => {
    const input = {
      move: "ソーラービーム",
      attacker: {
        level: 50,
        pokemonName: "フシギバナ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "positive" as const,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral" as const,
        },
        statModifier: 0,
      },
      options: {
        weather: "すなあらし" as const,
      },
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.move.power).toBe(60);
      expect(output.move.type).toBe("くさ");
    }
  });

  it("あられ状態では威力が半分になる", async () => {
    const input = {
      move: "ソーラービーム",
      attacker: {
        level: 50,
        pokemonName: "フシギバナ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "positive" as const,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral" as const,
        },
        statModifier: 0,
      },
      options: {
        weather: "あられ" as const,
      },
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.move.power).toBe(60);
      expect(output.move.type).toBe("くさ");
    }
  });

  it("天候なしでは通常威力で計算される", async () => {
    const input = {
      move: "ソーラービーム",
      attacker: {
        level: 50,
        pokemonName: "フシギバナ",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "positive" as const,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral" as const,
        },
        statModifier: 0,
      },
      options: {},
    };

    const result = await calculateDamageHandler(input);
    expect(result.content).toBeDefined();
    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.move.power).toBe(120);
      expect(output.move.type).toBe("くさ");
    }
  });
});
