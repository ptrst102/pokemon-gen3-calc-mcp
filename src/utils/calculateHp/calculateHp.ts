/**
 * HP実数値を計算する
 */
interface CalculateHpParams {
  baseStat: number;
  iv: number;
  ev: number;
  level: number;
}

export const calculateHp = (params: CalculateHpParams): number => {
  const { baseStat, iv, ev, level } = params;
  return (
    Math.floor(((baseStat * 2 + iv + Math.floor(ev / 4)) * level) / 100) +
    level +
    10
  );
};
