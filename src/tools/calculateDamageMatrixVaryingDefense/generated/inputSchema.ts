/**
 * 自動生成されたスキーマファイル
 * このファイルは直接編集しないでください
 * 編集する場合は、対応するZodスキーマを編集してから npm run schemagen を実行してください
 */

export const calculateDamageMatrixVaryingDefenseInputSchema = {
  type: "object",
  properties: {
    move: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            type: {
              type: "string",
              enum: [
                "ノーマル",
                "ほのお",
                "みず",
                "でんき",
                "くさ",
                "こおり",
                "かくとう",
                "どく",
                "じめん",
                "ひこう",
                "エスパー",
                "むし",
                "いわ",
                "ゴースト",
                "ドラゴン",
                "あく",
                "はがね",
              ],
            },
            power: {
              type: "integer",
              minimum: 0,
            },
            hiddenPowerIVs: {
              type: "object",
              properties: {
                hp: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                attack: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                defense: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                specialAttack: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                specialDefense: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                speed: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
              },
              required: [
                "hp",
                "attack",
                "defense",
                "specialAttack",
                "specialDefense",
                "speed",
              ],
              additionalProperties: false,
            },
          },
          required: ["type", "power"],
          additionalProperties: false,
        },
      ],
    },
    attacker: {
      type: "object",
      properties: {
        level: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 50,
        },
        pokemonName: {
          type: "string",
        },
        item: {
          type: "string",
        },
        ability: {
          type: "string",
        },
        abilityActive: {
          type: "boolean",
          default: false,
          description:
            "条件付きとくせいが発動しているかどうか（もうか、げきりゅう、しんりょく等）。ちからもち、ヨガパワー等の常時発動するとくせいには影響しません",
        },
        stat: {
          anyOf: [
            {
              type: "object",
              properties: {
                value: {
                  type: "integer",
                  minimum: 1,
                  description: "こうげきまたはとくこうの実数値",
                },
              },
              required: ["value"],
              additionalProperties: false,
              description: "能力値を実数値で直接指定",
            },
            {
              type: "object",
              properties: {
                iv: {
                  type: "integer",
                  minimum: 0,
                  maximum: 31,
                },
                ev: {
                  type: "integer",
                  minimum: 0,
                  maximum: 252,
                },
                natureModifier: {
                  type: "string",
                  enum: ["up", "down", "neutral"],
                  default: "neutral",
                },
              },
              required: ["iv", "ev"],
              additionalProperties: false,
            },
          ],
        },
        statModifier: {
          type: "integer",
          minimum: -6,
          maximum: 6,
          default: 0,
        },
      },
      required: ["stat"],
      additionalProperties: false,
    },
    defender: {
      type: "object",
      properties: {
        level: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 50,
        },
        pokemonName: {
          type: "string",
        },
        item: {
          type: "string",
        },
        ability: {
          type: "string",
        },
        abilityActive: {
          type: "boolean",
          default: false,
          description:
            "条件付きとくせいが発動しているかどうか（ハードロック等）",
        },
        stat: {
          type: "object",
          properties: {
            iv: {
              type: "integer",
              minimum: 0,
              maximum: 31,
            },
            natureModifier: {
              type: "string",
              enum: ["up", "down", "neutral"],
              default: "neutral",
            },
          },
          required: ["iv"],
          additionalProperties: false,
        },
        statModifier: {
          type: "integer",
          minimum: -6,
          maximum: 6,
          default: 0,
        },
        isPhysicalDefense: {
          type: "boolean",
        },
      },
      required: ["pokemonName", "stat", "isPhysicalDefense"],
      additionalProperties: false,
    },
    options: {
      type: "object",
      properties: {
        weather: {
          type: "string",
          enum: ["はれ", "あめ", "あられ", "すなあらし"],
        },
        charge: {
          type: "boolean",
          default: false,
        },
        reflect: {
          type: "boolean",
          default: false,
        },
        lightScreen: {
          type: "boolean",
          default: false,
        },
        mudSport: {
          type: "boolean",
          default: false,
        },
        waterSport: {
          type: "boolean",
          default: false,
        },
      },
      additionalProperties: false,
      default: {},
    },
  },
  required: ["move", "attacker", "defender"],
  additionalProperties: false,
} satisfies {
  [x: string]: unknown;
  type: "object";
  properties?: { [x: string]: unknown } | undefined;
  required?: string[] | undefined;
};
