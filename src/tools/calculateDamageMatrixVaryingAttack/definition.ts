import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { calculateDamageMatrixVaryingAttackInputSchema } from "./generated/inputSchema";

export const calculateDamageMatrixVaryingAttackDefinition: Tool = {
  name: "calculate_damage_matrix_varying_attack",
  description:
    "防御側の努力値を固定し、攻撃側の努力値を総当たりしてダメージ計算を行います。攻撃側のありえる全ての努力値振りでのダメージを一度に計算できます。",
  inputSchema: calculateDamageMatrixVaryingAttackInputSchema,
};
