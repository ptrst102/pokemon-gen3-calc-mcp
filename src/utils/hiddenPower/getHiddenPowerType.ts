interface IVs {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export const getHiddenPowerType = (ivs: IVs): string => {
  const hpOdd = ivs.hp % 2 === 1 ? 1 : 0;
  const attackOdd = ivs.attack % 2 === 1 ? 2 : 0;
  const defenseOdd = ivs.defense % 2 === 1 ? 4 : 0;
  const speedOdd = ivs.speed % 2 === 1 ? 8 : 0;
  const specialAttackOdd = ivs.specialAttack % 2 === 1 ? 16 : 0;
  const specialDefenseOdd = ivs.specialDefense % 2 === 1 ? 32 : 0;

  const sum = hpOdd + attackOdd + defenseOdd + speedOdd + specialAttackOdd + specialDefenseOdd;
  const typeIndex = Math.floor(sum * 15 / 63);

  const types = [
    "かくとう",
    "ひこう",
    "どく",
    "じめん",
    "いわ",
    "むし",
    "ゴースト",
    "はがね",
    "ほのお",
    "みず",
    "くさ",
    "でんき",
    "エスパー",
    "こおり",
    "ドラゴン",
    "あく",
  ];

  return types[typeIndex];
};