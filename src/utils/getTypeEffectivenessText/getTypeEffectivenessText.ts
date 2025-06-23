/**
 * タイプ相性の説明文を取得
 */
export const getTypeEffectivenessText = (effectiveness: number): string => {
  if (effectiveness === 0) {
    return "こうかなし (0倍)";
  } else if (effectiveness < 1) {
    return `いまひとつ (${effectiveness}倍)`;
  } else if (effectiveness > 1) {
    return `こうかばつぐん (${effectiveness}倍)`;
  } else {
    return "通常 (1倍)";
  }
};
