import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const calculateStatusDefinition: Tool = {
  name: "calculate_status",
  description:
    "ポケモンのステータス実数値を計算します。種族値、個体値、努力値、レベル、せいかくを考慮して正確な実数値を算出します。",
  inputSchema: {
    type: "object",
    properties: {
      pokemonName: {
        type: "string",
        description: "ポケモン名",
      },
      level: {
        type: "number",
        description: "レベル（1-100）",
      },
      nature: {
        type: "string",
        description: "せいかく",
      },
      ivs: {
        type: "object",
        description: "個体値（0-31）",
        properties: {
          hp: { type: "number" },
          atk: { type: "number" },
          def: { type: "number" },
          spa: { type: "number" },
          spd: { type: "number" },
          spe: { type: "number" },
        },
        required: ["hp", "atk", "def", "spa", "spd", "spe"],
      },
      evs: {
        type: "object",
        description: "努力値（0-252、合計510まで）",
        properties: {
          hp: { type: "number" },
          atk: { type: "number" },
          def: { type: "number" },
          spa: { type: "number" },
          spd: { type: "number" },
          spe: { type: "number" },
        },
        required: ["hp", "atk", "def", "spa", "spd", "spe"],
      },
    },
    required: ["pokemonName", "level", "nature", "evs"],
  },
};
