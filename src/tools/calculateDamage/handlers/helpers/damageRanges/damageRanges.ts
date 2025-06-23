/**
 * 乱数は0.85〜1.00の範囲で16段階
 */
export const getDamageRanges = (baseDamage: number): number[] => {
  const ranges: number[] = [];

  if (baseDamage === 0) {
    return new Array(16).fill(0);
  }

  for (let i = 0; i < 16; i++) {
    const randomMultiplier = (85 + i) / 100;
    const damage = Math.floor(baseDamage * randomMultiplier);
    ranges.push(Math.max(1, damage));
  }

  return ranges;
};
