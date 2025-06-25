import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const calculateDamageDefinition: Tool = {
  name: "calculate_damage",
  title: "ポケモンダメージ計算",
  description:
    'ポケモンのダメージ計算を行います。タイプ相性、とくせい、もちもの、天候などを考慮した正確なダメージを算出します。\n\n使い方の例:\n1. わざ名を指定: move: "じしん"\n2. タイプと威力を指定: move: { type: "じめん", power: 100 }\n\n重要: moveパラメータは文字列（わざ名）またはオブジェクト（type と power）として指定してください。JSON文字列として渡さないでください。',
  _meta: {},
  inputSchema: {
    type: "object",
    properties: {
      move: {
        description:
          'わざ名（文字列）、またはタイプと威力を含むオブジェクト。例: "じしん" または { type: "じめん", power: 100 }',
        oneOf: [
          {
            type: "string",
            description:
              'わざ名（例: "じしん"、"れいとうビーム"、"10まんボルト"）',
            examples: ["じしん", "れいとうビーム", "10まんボルト"],
          },
          {
            type: "object",
            description: "タイプと威力を指定（わざ名が不明な場合）",
            properties: {
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
                description: "わざのタイプ",
              },
              power: {
                type: "number",
                description: "わざの威力",
                minimum: 1,
                maximum: 250,
              },
            },
            required: ["type", "power"],
            additionalProperties: false,
          },
        ],
      },
      attacker: {
        type: "object",
        description: "攻撃側のポケモン情報",
        properties: {
          level: {
            type: "number",
            description: "レベル（省略時は50）",
            default: 50,
            minimum: 1,
            maximum: 100,
          },
          pokemonName: {
            type: "string",
            description:
              'ポケモン名（例: "メタグロス"、"ボーマンダ"）。省略時はタイプ不一致として計算',
            examples: ["メタグロス", "ボーマンダ", "ラティオス", "ヘラクロス"],
          },
          item: {
            type: "string",
            description: 'もちもの（例: "こだわりハチマキ"、"もくたん"）',
            examples: ["こだわりハチマキ", "もくたん"],
          },
          ability: {
            type: "string",
            description: 'とくせい（例: "ちからもち"、"もうか"）',
            examples: ["ちからもち", "もうか"],
          },
          abilityActive: {
            type: "boolean",
            description:
              "条件付きとくせいが発動しているかどうか（もうか、げきりゅう、しんりょく等）。ちからもち、ヨガパワー等の常時発動するとくせいには影響しません",
          },
          stat: {
            description: "能力値（こうげきまたはとくこう）",
            oneOf: [
              {
                type: "object",
                properties: {
                  value: {
                    type: "number",
                    description: "こうげきまたはとくこうの実数値",
                  },
                },
                required: ["value"],
              },
              {
                type: "object",
                properties: {
                  iv: {
                    type: "number",
                    description: "こうげきまたはとくこうの個体値（0-31）",
                  },
                  ev: {
                    type: "number",
                    description: "こうげきまたはとくこうの努力値（0-252）",
                  },
                  natureModifier: {
                    type: "string",
                    enum: ["up", "down", "neutral"],
                    description:
                      "せいかく補正（up: 1.1倍、down: 0.9倍、neutral: 1.0倍）",
                    default: "neutral",
                  },
                },
                required: ["iv", "ev"],
              },
              {
                type: "object",
                properties: {
                  iv: {
                    type: "number",
                    description: "こうげきまたはとくこうの個体値（0-31）",
                  },
                  calculateAllEvs: {
                    type: "boolean",
                    const: true,
                    description: "努力値全パターンを計算",
                  },
                },
                required: ["iv", "calculateAllEvs"],
              },
            ],
          },
          statModifier: {
            type: "number",
            description:
              "能力ランク補正（-6～+6、省略時は0）。いかく=-1、つるぎのまい=+2など",
            default: 0,
            minimum: -6,
            maximum: 6,
          },
        },
        required: ["stat"],
      },
      defender: {
        type: "object",
        description: "防御側のポケモン情報",
        properties: {
          level: {
            type: "number",
            description: "レベル（省略時は50）",
          },
          pokemonName: {
            type: "string",
            description:
              'ポケモン名（例: "メタグロス"、"ボーマンダ"）。省略時は弱点なし',
            examples: ["メタグロス", "ボーマンダ", "ラティオス", "ヘラクロス"],
          },
          item: {
            type: "string",
            description: 'もちもの（例: "メタルパウダー"）',
            examples: ["メタルパウダー"],
          },
          ability: {
            type: "string",
            description: 'とくせい（例: "ちからもち"、"もうか"）',
            examples: ["ちからもち", "もうか"],
          },
          abilityActive: {
            type: "boolean",
            description:
              "条件付きとくせいが発動しているかどうか（ふしぎなうろこ等）。ちからもち、ヨガパワー等の常時発動するとくせいには影響しません",
          },
          stat: {
            description: "能力値（ぼうぎょまたはとくぼう）",
            oneOf: [
              {
                type: "object",
                properties: {
                  value: {
                    type: "number",
                    description: "ぼうぎょまたはとくぼうの実数値",
                  },
                },
                required: ["value"],
              },
              {
                type: "object",
                properties: {
                  iv: {
                    type: "number",
                    description: "ぼうぎょまたはとくぼうの個体値（0-31）",
                  },
                  ev: {
                    type: "number",
                    description: "ぼうぎょまたはとくぼうの努力値（0-252）",
                  },
                  natureModifier: {
                    type: "string",
                    enum: ["up", "down", "neutral"],
                    description:
                      "ぼうぎょまたはとくぼうのせいかく補正（up: 1.1倍、down: 0.9倍、neutral: 1.0倍）",
                    default: "neutral",
                  },
                },
                required: ["iv", "ev"],
              },
              {
                type: "object",
                properties: {
                  iv: {
                    type: "number",
                    description: "ぼうぎょまたはとくぼうの個体値（0-31）",
                  },
                  calculateAllEvs: {
                    type: "boolean",
                    const: true,
                    description: "努力値全パターンを計算",
                  },
                },
                required: ["iv", "calculateAllEvs"],
              },
            ],
          },
          statModifier: {
            type: "number",
            description:
              "能力ランク補正（-6～+6、省略時は0）。いかく=-1、つるぎのまい=+2など",
            default: 0,
            minimum: -6,
            maximum: 6,
          },
        },
        required: ["stat"],
      },
      options: {
        type: "object",
        description: "その他のオプション",
        properties: {
          weather: {
            type: "string",
            enum: ["はれ", "あめ"],
            description: "てんき",
          },
          charge: {
            type: "boolean",
            description: "じゅうでん",
          },
          reflect: {
            type: "boolean",
            description: "リフレクター",
          },
          lightScreen: {
            type: "boolean",
            description: "ひかりのかべ",
          },
          mudSport: {
            type: "boolean",
            description: "どろあそび",
          },
          waterSport: {
            type: "boolean",
            description: "みずあそび",
          },
        },
      },
    },
    required: ["move", "attacker", "defender"],
  },
  outputSchema: {
    type: "object",
    properties: {
      move: {
        type: "object",
        description: "使用したわざの情報",
        properties: {
          name: { type: "string", description: "わざ名" },
          type: { type: "string", description: "わざのタイプ" },
          power: { type: "number", description: "わざの威力" },
          category: { type: "string", description: "物理/特殊の分類" },
        },
        required: ["type", "power", "category"],
      },
      attacker: {
        type: "object",
        description: "攻撃側の情報",
        properties: {
          pokemonName: { type: "string", description: "ポケモン名" },
          level: { type: "number", description: "レベル" },
          stat: { type: "number", description: "使用したステータス実数値" },
        },
      },
      defender: {
        type: "object",
        description: "防御側の情報",
        properties: {
          pokemonName: { type: "string", description: "ポケモン名" },
          level: { type: "number", description: "レベル" },
          stat: { type: "number", description: "使用したステータス実数値" },
        },
      },
      damage: {
        type: "object",
        description: "ダメージ計算結果",
        properties: {
          min: { type: "number", description: "最小ダメージ" },
          max: { type: "number", description: "最大ダメージ" },
          rolls: {
            type: "array",
            description: "全16通りのダメージ値",
            items: { type: "number" },
          },
        },
        required: ["min", "max", "rolls"],
      },
      evRanges: {
        type: "array",
        description: "努力値別ダメージ範囲（calculateAllEvs使用時のみ）",
        items: {
          type: "object",
          properties: {
            ev: { type: "number", description: "努力値" },
            stat: { type: "number", description: "実数値" },
            damage: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" },
              },
              required: ["min", "max"],
            },
          },
          required: ["ev", "stat", "damage"],
        },
      },
      modifiers: {
        type: "object",
        description: "適用された補正",
        properties: {
          typeEffectiveness: { type: "number", description: "タイプ相性倍率" },
          stab: { type: "boolean", description: "タイプ一致ボーナス適用" },
          weather: { type: "string", description: "天候効果" },
          ability: { type: "string", description: "適用されたとくせい" },
          item: { type: "string", description: "適用されたもちもの" },
        },
      },
    },
    required: ["move", "damage"],
  },
};
