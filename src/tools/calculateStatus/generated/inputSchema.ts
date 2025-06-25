/**
 * 自動生成されたスキーマファイル
 * このファイルは直接編集しないでください
 * 編集する場合は、対応するZodスキーマを編集してから npm run schemagen を実行してください
 */

export const calculateStatusInputSchema = {
  type: "object",
  properties: {
    pokemonName: {
      type: "string",
      description: 'ポケモン名（例: "フシギダネ"、"メタグロス"）',
    },
    level: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      description: "レベル（1-100）",
    },
    nature: {
      type: "string",
      description: 'せいかく（例: "いじっぱり"、"ひかえめ"）',
    },
    ivs: {
      type: "object",
      properties: {
        hp: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "HP個体値（0-31）",
        },
        atk: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "こうげき個体値（0-31）",
        },
        def: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "ぼうぎょ個体値（0-31）",
        },
        spa: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "とくこう個体値（0-31）",
        },
        spd: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "とくぼう個体値（0-31）",
        },
        spe: {
          type: "integer",
          minimum: 0,
          maximum: 31,
          description: "すばやさ個体値（0-31）",
        },
      },
      required: ["hp", "atk", "def", "spa", "spd", "spe"],
      additionalProperties: false,
      description: "個体値（0-31）",
    },
    evs: {
      type: "object",
      properties: {
        hp: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "HP努力値（0-252）",
        },
        atk: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "こうげき努力値（0-252）",
        },
        def: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "ぼうぎょ努力値（0-252）",
        },
        spa: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "とくこう努力値（0-252）",
        },
        spd: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "とくぼう努力値（0-252）",
        },
        spe: {
          type: "integer",
          minimum: 0,
          maximum: 252,
          description: "すばやさ努力値（0-252）",
        },
      },
      required: ["hp", "atk", "def", "spa", "spd", "spe"],
      additionalProperties: false,
      description: "努力値（0-252、合計510まで）",
    },
  },
  required: ["pokemonName", "level", "nature", "ivs", "evs"],
  additionalProperties: false,
} satisfies {
  [x: string]: unknown;
  type: "object";
  properties?: { [x: string]: unknown } | undefined;
  required?: string[] | undefined;
};
