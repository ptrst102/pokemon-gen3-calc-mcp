import { MOVES } from "@/data/moves";
import type { TypeName } from "@/types";

export interface ResolvedMove {
  name?: string;
  type: TypeName;
  power: number;
  category: "physical" | "special";
  isPhysical: boolean;
}

/**
 * 第三世代のルールに基づいて物理技か特殊技かを判定
 */
const isPhysicalType = (type: TypeName): boolean => {
  return [
    "ノーマル",
    "かくとう",
    "ひこう",
    "どく",
    "じめん",
    "いわ",
    "むし",
    "ゴースト",
    "はがね",
  ].includes(type);
};

/**
 * わざ名または{type, power}オブジェクトからわざ情報を解決する
 */
export const resolveMove = (
  moveInput: string | { type: TypeName; power: number }
): ResolvedMove => {
  if (typeof moveInput === "string") {
    const moveData = MOVES.find((m) => m.name === moveInput);
    if (!moveData) {
      throw new Error(`技「${moveInput}」が見つかりません`);
    }
    const moveType = moveData.type as TypeName;
    const isPhysical = isPhysicalType(moveType);
    return {
      name: moveInput,
      type: moveType,
      power: moveData.power,
      category: isPhysical ? "physical" : "special",
      isPhysical,
    };
  }

  // オブジェクト形式の場合、第三世代のルールに基づいてカテゴリを判定
  const isPhysical = isPhysicalType(moveInput.type);

  return {
    type: moveInput.type,
    power: moveInput.power,
    category: isPhysical ? "physical" : "special",
    isPhysical,
  };
};