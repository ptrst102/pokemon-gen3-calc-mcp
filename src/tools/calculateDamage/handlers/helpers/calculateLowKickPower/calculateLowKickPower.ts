/**
 * けたぐりの威力を体重から計算する
 * @param weight ポケモンの体重（kg）
 * @returns けたぐりの威力
 */
export const calculateLowKickPower = (weight: number): number => {
  if (weight <= 10.0) {
    return 20;
  }
  if (weight <= 25.0) {
    return 40;
  }
  if (weight <= 50.0) {
    return 60;
  }
  if (weight <= 100.0) {
    return 80;
  }
  if (weight <= 200.0) {
    return 100;
  }
  return 120;
};
