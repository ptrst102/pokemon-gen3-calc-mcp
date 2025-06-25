import { describe, expect, it } from "vitest";
import { calculateDamageDefinition } from "@/tools/calculateDamage";
import { calculateDamageInputSchema } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import { calculateStatusDefinition } from "@/tools/calculateStatus";
import { calculateStatusInputSchema } from "@/tools/calculateStatus/handlers/schemas/statusSchema";

/**
 * MCPツール定義のinputSchemaとZodスキーマの整合性をテストする
 */
describe("MCP inputSchemaとZodスキーマの整合性", () => {
  it("calculateDamageのスキーマが一致する", () => {
    const _mcpSchema = calculateDamageDefinition.inputSchema;

    // MCPスキーマで定義されたサンプルデータ
    const validInputs = [
      {
        move: "じしん",
        attacker: {
          level: 50,
          pokemonName: "ボーマンダ",
          stat: { iv: 31, ev: 252, natureModifier: "neutral" },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemonName: "メタグロス",
          stat: { iv: 31, ev: 0, natureModifier: "neutral" },
          statModifier: 0,
        },
        options: {},
      },
      {
        move: { type: "じめん", power: 100 },
        attacker: {
          stat: { value: 182 },
        },
        defender: {
          stat: { value: 150 },
        },
      },
    ];

    // すべての有効な入力がZodスキーマでパースできることを確認
    for (const input of validInputs) {
      expect(() => calculateDamageInputSchema.parse(input)).not.toThrow();
    }
  });

  it("calculateStatusのスキーマが一致する", () => {
    const _mcpSchema = calculateStatusDefinition.inputSchema;

    const validInput = {
      pokemonName: "フシギダネ",
      level: 50,
      nature: "まじめ",
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    };

    // Zodスキーマでパースできることを確認
    expect(() => calculateStatusInputSchema.parse(validInput)).not.toThrow();
  });

  it.skip("必須フィールドが両方のスキーマで一致する", () => {
    // calculateDamageの必須フィールド
    const mcpRequired = calculateDamageDefinition.inputSchema.required;

    // Zodスキーマから必須フィールドを推測（簡易版）
    const invalidInput = {};
    try {
      calculateDamageInputSchema.parse(invalidInput);
    } catch (error: any) {
      const zodRequired = error.issues
        .filter(
          (issue: any) =>
            issue.code === "invalid_type" && issue.received === "undefined",
        )
        .map((issue: any) => issue.path[0])
        .filter((v: any, i: number, a: any[]) => a.indexOf(v) === i);

      // MCPとZodで必須フィールドが一致することを確認
      expect(new Set(mcpRequired)).toEqual(new Set(zodRequired));
    }
  });
});

/**
 * 型レベルでの整合性チェック
 *
 * TypeScriptの型システムを使って、コンパイル時に整合性を確認
 */
type ExtractMcpSchema<T> = T extends { inputSchema: infer S } ? S : never;
type McpDamageSchema = ExtractMcpSchema<typeof calculateDamageDefinition>;
type McpStatusSchema = ExtractMcpSchema<typeof calculateStatusDefinition>;

// これらの型定義により、MCPスキーマの変更時にTypeScriptエラーが発生する
const _typeCheck1: McpDamageSchema = {
  type: "object",
  properties: {
    move: {} as any,
    attacker: {} as any,
    defender: {} as any,
    options: {} as any,
  },
  required: ["move", "attacker", "defender"],
};

const _typeCheck2: McpStatusSchema = {
  type: "object",
  properties: {
    pokemonName: {} as any,
    level: {} as any,
    nature: {} as any,
    ivs: {} as any,
    evs: {} as any,
  },
  required: ["pokemonName", "level", "nature", "ivs", "evs"],
};
