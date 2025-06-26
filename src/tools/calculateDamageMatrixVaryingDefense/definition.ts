import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { calculateDamageMatrixVaryingDefenseInputSchema } from "./generated/inputSchema";

export const calculateDamageMatrixVaryingDefenseDefinition: Tool = {
  name: "calculate_damage_matrix_varying_defense",
  description:
    "攻撃側の努力値を固定し、防御側の努力値を総当たりしてダメージ計算を行います。防御側のありえる全ての努力値振りでのダメージを一度に計算できます。",
  inputSchema: calculateDamageMatrixVaryingDefenseInputSchema,
};
