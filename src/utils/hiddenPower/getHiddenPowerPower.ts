interface IVs {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export const getHiddenPowerPower = (ivs: IVs): number => {
  const hpBit = (ivs.hp & 2) >> 1;
  const attackBit = (ivs.attack & 2) >> 1;
  const defenseBit = (ivs.defense & 2) >> 1;
  const speedBit = (ivs.speed & 2) >> 1;
  const specialAttackBit = (ivs.specialAttack & 2) >> 1;
  const specialDefenseBit = (ivs.specialDefense & 2) >> 1;

  const sum =
    hpBit +
    attackBit * 2 +
    defenseBit * 4 +
    speedBit * 8 +
    specialAttackBit * 16 +
    specialDefenseBit * 32;

  return Math.floor((sum * 40) / 63) + 30;
};
