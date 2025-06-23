/**
 * HP以外のステータス実数値を計算する
 */
interface CalculateStatParams {
  baseStat: number;
  iv: number;
  ev: number;
  level: number;
  natureModifier: number; // 0.9, 1.0, or 1.1
}

export const calculateStat = (params: CalculateStatParams): number => {
  const { baseStat, iv, ev, level, natureModifier } = params;

  const baseValue =
    Math.floor(((baseStat * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(baseValue * natureModifier);
};
