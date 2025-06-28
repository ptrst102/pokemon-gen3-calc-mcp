/**
 * ソーラービームの天候補正を適用する
 * あめ、すなあらし、あられの場合、ダメージを1/2にする
 */
export const applySolarBeamPenalty = (
  damages: number[],
  moveName?: string,
  weather?: "はれ" | "あめ" | "あられ" | "すなあらし",
): number[] => {
  if (moveName !== "ソーラービーム") {
    return damages;
  }

  if (weather === "あめ" || weather === "すなあらし" || weather === "あられ") {
    return damages.map((damage) => Math.floor(damage * 0.5));
  }

  return damages;
};
