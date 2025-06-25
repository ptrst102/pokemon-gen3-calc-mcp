import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const calculateDamageMatrixDefinition: Tool = {
  name: "calculate_damage_matrix",
  title: "ポケモンダメージマトリックス計算",
  description:
    "防御側のステータス範囲（4〜504）に対するダメージを一括計算します。努力値の最適配分分析に最適化されたツールです。",
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
          pokemonName: {
            type: "string",
            description:
              'ポケモン名（例: "メタグロス"、"ボーマンダ"）。省略時はタイプ不一致として計算',
            examples: ["メタグロス", "ボーマンダ", "ラティオス", "ヘラクロス"],
          },
          level: {
            type: "number",
            description: "レベル（省略時は50）",
            default: 50,
            minimum: 1,
            maximum: 100,
          },
          stat: {
            type: "object",
            description: "能力値（こうげきまたはとくこう）",
            properties: {
              value: {
                type: "number",
                description: "こうげきまたはとくこうの実数値",
                minimum: 1,
                maximum: 999,
              },
            },
            required: ["value"],
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
              "条件付きとくせいが発動しているかどうか（もうか、げきりゅう、しんりょく等）",
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
      defenderType: {
        type: "string",
        enum: ["physical", "special"],
        description: "計算する防御側のステータスタイプ（物理または特殊）",
      },
      defender: {
        type: "object",
        description: "防御側のポケモン情報（省略可能）",
        properties: {
          pokemonName: {
            type: "string",
            description:
              'ポケモン名（例: "メタグロス"、"ボーマンダ"）。タイプ相性計算に使用',
            examples: ["メタグロス", "ボーマンダ", "ラティオス", "ヘラクロス"],
          },
          level: {
            type: "number",
            description: "レベル（省略時は50）",
            default: 50,
            minimum: 1,
            maximum: 100,
          },
          item: {
            type: "string",
            description: 'もちもの（例: "メタルパウダー"）',
            examples: ["メタルパウダー"],
          },
          ability: {
            type: "string",
            description: 'とくせい（例: "ふしぎなうろこ"）',
            examples: ["ふしぎなうろこ"],
          },
          abilityActive: {
            type: "boolean",
            description:
              "条件付きとくせいが発動しているかどうか（ふしぎなうろこ等）",
          },
          statModifier: {
            type: "number",
            description:
              "能力ランク補正（-6～+6、省略時は0）。いかく=-1など",
            default: 0,
            minimum: -6,
            maximum: 6,
          },
        },
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
          statRange: {
            type: "object",
            description: "計算する防御ステータスの範囲（省略時は4〜504）",
            properties: {
              min: {
                type: "number",
                description: "最小防御ステータス",
                minimum: 1,
                default: 4,
              },
              max: {
                type: "number",
                description: "最大防御ステータス",
                maximum: 999,
                default: 504,
              },
            },
          },
        },
      },
    },
    required: ["move", "attacker", "defenderType"],
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
          category: { 
            type: "string", 
            enum: ["physical", "special"],
            description: "物理/特殊の分類" 
          },
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
        required: ["level", "stat"],
      },
      damageMatrix: {
        type: "array",
        description: "防御ステータスごとのダメージ計算結果",
        items: {
          type: "object",
          properties: {
            defenseStat: { type: "number", description: "防御側ステータス" },
            damage: {
              type: "object",
              properties: {
                min: { type: "number", description: "最小ダメージ" },
                max: { type: "number", description: "最大ダメージ" },
                rolls: {
                  type: "array",
                  description: "全16通りのダメージ値（0.85〜1.0）",
                  items: { type: "number" },
                  minItems: 16,
                  maxItems: 16,
                },
              },
              required: ["min", "max", "rolls"],
            },
          },
          required: ["defenseStat", "damage"],
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
    required: ["move", "attacker", "damageMatrix"],
  },
};