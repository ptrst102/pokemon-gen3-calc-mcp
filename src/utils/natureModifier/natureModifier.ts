import type { Nature } from "@/data/natures";
import type { StatKeyExceptHP } from "@/types";

export const natureModifier = (
  nature: Nature,
  statKey: StatKeyExceptHP,
): number => {
  if ("plus" in nature && nature.plus === statKey) {
    return 1.1;
  }
  if ("minus" in nature && nature.minus === statKey) {
    return 0.9;
  }
  return 1.0;
};

// 文字列ベースの簡易版（calculateDamageで使用）
export const NATURE_MODIFIER_MAP = {
  up: 1.1,
  down: 0.9,
  neutral: 1.0,
} as const;
