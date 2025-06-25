import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const calculateStatusDefinition: Tool = {
  name: "calculate_status",
  title: "ポケモンステータス計算",
  description:
    "ポケモンのステータス実数値を計算します。種族値、個体値、努力値、レベル、せいかくを考慮して正確な実数値を算出します。",
  _meta: {},
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
  outputSchema: {
    type: "object",
    properties: {
      pokemonName: {
        type: "string",
        description: "ポケモン名",
      },
      stats: {
        type: "object",
        description: "計算されたステータス実数値",
        properties: {
          hp: { type: "number", description: "HP実数値" },
          atk: { type: "number", description: "こうげき実数値" },
          def: { type: "number", description: "ぼうぎょ実数値" },
          spa: { type: "number", description: "とくこう実数値" },
          spd: { type: "number", description: "とくぼう実数値" },
          spe: { type: "number", description: "すばやさ実数値" },
        },
        required: ["hp", "atk", "def", "spa", "spd", "spe"],
      },
    },
    required: ["pokemonName", "stats"],
  },
};
