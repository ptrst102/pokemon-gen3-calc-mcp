interface CalculateBaseDamageParams {
  level: number;
  power: number;
  attack: number;
  defense: number;
  isPhysical: boolean;
}

/**
 * 基本ダメージを計算する（第三世代の計算式）
 * 計算式: ((レベル × 2 / 5 + 2) × 威力 × 攻撃側ステータス / 防御側ステータス / 50 + 2)
 */
export const calculateBaseDamage = ({
  level,
  power,
  attack,
  defense,
}: CalculateBaseDamageParams): number => {
  const levelCalc = Math.floor(Math.floor((level * 2) / 5) + 2);
  const attackCalc = Math.floor((levelCalc * power * attack) / defense);
  const damage = Math.floor(Math.floor(attackCalc / 50) + 2);

  return Math.max(1, damage);
};
