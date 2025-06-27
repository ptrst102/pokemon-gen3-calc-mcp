interface IVs {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export const getHiddenPowerPower = (ivs: IVs): number => {
  const hpValue = ivs.hp % 4 >= 2 ? 1 : 0;
  const attackValue = ivs.attack % 4 >= 2 ? 2 : 0;
  const defenseValue = ivs.defense % 4 >= 2 ? 4 : 0;
  const speedValue = ivs.speed % 4 >= 2 ? 8 : 0;
  const specialAttackValue = ivs.specialAttack % 4 >= 2 ? 16 : 0;
  const specialDefenseValue = ivs.specialDefense % 4 >= 2 ? 32 : 0;

  const sum = hpValue + attackValue + defenseValue + speedValue + specialAttackValue + specialDefenseValue;
  const power = Math.floor(sum * 40 / 63) + 30;

  return power;
};