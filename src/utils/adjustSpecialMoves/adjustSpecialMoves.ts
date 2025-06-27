import { calculateLowKickPower } from "@/tools/calculateDamage/handlers/helpers/calculateLowKickPower";
import type { TypeName } from "@/types";

export interface MoveData {
  name?: string;
  type: TypeName;
  power: number;
  isPhysical: boolean;
}

export interface AdjustSpecialMovesParams {
  move: MoveData;
  weather?: "はれ" | "あめ" | "あられ" | "すなあらし";
  defenderWeight?: number;
}

/**
 * 特殊な技の処理を行う共通関数
 * ウェザーボール、けたぐりなどの技の威力やタイプを調整する
 */
export const adjustSpecialMoves = (
  params: AdjustSpecialMovesParams,
): MoveData => {
  const { move, weather, defenderWeight } = params;

  // ウェザーボールの処理
  if (move.name === "ウェザーボール") {
    if (weather === "はれ") {
      return {
        ...move,
        type: "ほのお",
        power: 100,
        isPhysical: false,
      };
    }
    if (weather === "あめ") {
      return {
        ...move,
        type: "みず",
        power: 100,
        isPhysical: false,
      };
    }
    if (weather === "あられ") {
      return {
        ...move,
        type: "こおり",
        power: 100,
        isPhysical: false,
      };
    }
    if (weather === "すなあらし") {
      return {
        ...move,
        type: "いわ",
        power: 100,
        isPhysical: true,
      };
    }
  }

  // けたぐりの処理
  if (move.name === "けたぐり" && defenderWeight !== undefined) {
    return {
      ...move,
      power: calculateLowKickPower(defenderWeight),
    };
  }

  // ソーラービームの処理
  if (move.name === "ソーラービーム") {
    // あめ、すなあらし、あられの場合、威力が半分になる
    if (
      weather === "あめ" ||
      weather === "すなあらし" ||
      weather === "あられ"
    ) {
      return {
        ...move,
        power: 60, // 120 / 2
      };
    }
  }

  return move;
};
