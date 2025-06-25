import Ajv from "ajv";
import type { z } from "zod";

/**
 * MCPのinputSchemaとZodスキーマの両方で検証を行うラッパー
 *
 * これにより、両方のスキーマが同期していることを実行時に保証できる
 */
export const createDualValidator = <T>(
  mcpSchema: unknown,
  zodSchema: z.ZodType<T>,
) => {
  const ajv = new Ajv({ allErrors: true });
  const validateMcp = ajv.compile(mcpSchema as any);

  return {
    /**
     * 両方のスキーマで検証を行う
     */
    validate: (
      input: unknown,
    ): { success: boolean; data?: T; errors?: string[] } => {
      const errors: string[] = [];

      // MCP JSON Schema検証
      const mcpValid = validateMcp(input);
      if (!mcpValid && validateMcp.errors) {
        errors.push(
          ...validateMcp.errors.map(
            (e) =>
              `MCP: ${(e as any).instancePath || e.dataPath || ""} ${e.message}`,
          ),
        );
      }

      // Zod検証
      const zodResult = zodSchema.safeParse(input);
      if (!zodResult.success) {
        errors.push(
          ...zodResult.error.issues.map(
            (e) => `Zod: ${e.path.join(".")} ${e.message}`,
          ),
        );
      }

      // 両方の検証に成功した場合のみ成功
      if (mcpValid && zodResult.success) {
        return { success: true, data: zodResult.data };
      }

      return { success: false, errors };
    },

    /**
     * 開発時のデバッグ用：不一致を検出
     */
    findDiscrepancies: (testCases: unknown[]): string[] => {
      const discrepancies: string[] = [];

      for (const [index, testCase] of testCases.entries()) {
        const mcpValid = validateMcp(testCase);
        const zodResult = zodSchema.safeParse(testCase);

        if (mcpValid !== zodResult.success) {
          discrepancies.push(
            `Test case ${index}: MCP=${mcpValid}, Zod=${zodResult.success}\n` +
              `Input: ${JSON.stringify(testCase, null, 2)}`,
          );
        }
      }

      return discrepancies;
    },
  };
};
