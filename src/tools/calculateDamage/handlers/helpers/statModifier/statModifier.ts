export type StatModifierRatio = {
  numerator: number;
  denominator: number;
};

/**
 * 第三世代の正確な倍率表に基づく能力ランク補正
 */
export const getStatModifierRatio = (modifier: number): StatModifierRatio => {
  const ratioTable: Record<number, [number, number]> = {
    6: [8, 2],
    5: [7, 2],
    4: [6, 2],
    3: [5, 2],
    2: [4, 2],
    1: [3, 2],
    0: [2, 2],
    "-1": [2, 3],
    "-2": [2, 4],
    "-3": [2, 5],
    "-4": [2, 6],
    "-5": [2, 7],
    "-6": [2, 8],
  };

  const [numerator, denominator] = ratioTable[modifier] || [2, 2];
  return { numerator, denominator };
};
