import { MOVES } from "@/data/moves";
import { UNSUPPORTED_MOVES } from "@/data/unsupportedMoves";
import type { TypeName } from "@/types";

// わざのタイプから物理技か特殊技かを判定する
const isPhysicalType = (type: TypeName): boolean =>
  [
    "ノーマル",
    "かくとう",
    "どく",
    "じめん",
    "ひこう",
    "むし",
    "いわ",
    "ゴースト",
    "はがね",
  ].includes(type);

export interface ResolvedMove {
  name?: string;
  type: TypeName;
  power: number;
  isPhysical: boolean;
}

export type MoveInput =
  | string // 技名
  | {
      name?: string;
      type: TypeName;
      power: number;
      isPhysical?: boolean;
    };

/**
 * 技の入力を解決して統一された形式に変換する
 */
export const resolveMove = (moveInput: MoveInput): ResolvedMove => {
  // 技名で指定された場合
  if (typeof moveInput === "string") {
    const moveName = moveInput;

    // 未対応技のチェック
    if (UNSUPPORTED_MOVES.some((m) => m === moveName)) {
      throw new Error(`${moveName}には対応していません`);
    }

    const move = MOVES.find((m) => m.name === moveName);
    if (!move) {
      throw new Error(`わざ「${moveName}」が見つかりません`);
    }

    return {
      name: moveName,
      type: move.type,
      power: move.power,
      isPhysical: isPhysicalType(move.type),
    };
  }

  // カスタム技として指定された場合
  return {
    name: moveInput.name,
    type: moveInput.type,
    power: moveInput.power,
    isPhysical: moveInput.isPhysical ?? isPhysicalType(moveInput.type),
  };
};
