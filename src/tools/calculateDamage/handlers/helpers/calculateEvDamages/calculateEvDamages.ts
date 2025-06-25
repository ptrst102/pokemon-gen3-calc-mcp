import type { AbilityName } from "@/data/abilities";
import type { ItemName } from "@/data/items";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type {
  EvDamageEntry,
  InternalDamageParams,
} from "@/tools/calculateDamage/types/damageCalculation";
import { applyAbilityEffects } from "../abilityEffects";
import { calculateBaseDamage } from "../calculateBaseDamage";
import { getDamageRanges } from "../damageRanges";
import { calculateItemEffects } from "../itemEffects";
import { getStatModifierRatio } from "../statModifier";
import { getTypeEffectiveness } from "../typeEffectiveness";

/**
 * ダメージ計算の主処理
 * 補正値、タイプ相性、とくせい効果を全て適用
 */
const calculateDamageInternal = (params: InternalDamageParams): number[] => {
  const { move, attacker, defender, options } = params;

  const attackerItemEffects = calculateItemEffects(
    attacker.item as ItemName | undefined,
    attacker.pokemonName,
    move.type,
    move.isPhysical,
  );

  const defenderItemEffects = calculateItemEffects(
    defender.item as ItemName | undefined,
    defender.pokemonName,
    move.type,
    move.isPhysical,
  );

  const attackRatio = getStatModifierRatio(attacker.attackModifier);
  let attackStat = Math.floor(
    (attacker.attack * attackRatio.numerator) / attackRatio.denominator,
  );

  if (move.isPhysical) {
    attackStat = Math.floor(
      (attackStat * attackerItemEffects.attackMultiplier.numerator) /
        attackerItemEffects.attackMultiplier.denominator,
    );
  } else {
    attackStat = Math.floor(
      (attackStat * attackerItemEffects.specialAttackMultiplier.numerator) /
        attackerItemEffects.specialAttackMultiplier.denominator,
    );
  }

  const defenseRatio = getStatModifierRatio(defender.defenseModifier);
  let defenseStat = Math.floor(
    (defender.defense * defenseRatio.numerator) / defenseRatio.denominator,
  );

  if (move.isPhysical) {
    defenseStat = Math.floor(
      (defenseStat * defenderItemEffects.defenseMultiplier.numerator) /
        defenderItemEffects.defenseMultiplier.denominator,
    );
  } else {
    defenseStat = Math.floor(
      (defenseStat * defenderItemEffects.specialDefenseMultiplier.numerator) /
        defenderItemEffects.specialDefenseMultiplier.denominator,
    );
  }

  // じばく・だいばくはつの処理: 防御を半分にする
  if (
    "name" in move &&
    (move.name === "じばく" || move.name === "だいばくはつ")
  ) {
    defenseStat = Math.floor(defenseStat / 2);
  }

  let damage = calculateBaseDamage({
    level: attacker.level,
    power: move.power,
    attack: attackStat,
    defense: defenseStat,
    isPhysical: move.isPhysical,
  });

  if (attacker.types?.some((type) => type === move.type)) {
    damage = Math.floor(damage * 1.5);
  }

  const typeEffectiveness = getTypeEffectiveness(move.type, defender.types);
  damage = Math.floor(damage * typeEffectiveness);

  if (options.weather === "はれ") {
    if (move.type === "ほのお") {
      damage = Math.floor(damage * 1.5);
    } else if (move.type === "みず") {
      damage = Math.floor(damage * 0.5);
    }
  } else if (options.weather === "あめ") {
    if (move.type === "みず") {
      damage = Math.floor(damage * 1.5);
    } else if (move.type === "ほのお") {
      damage = Math.floor(damage * 0.5);
    }
  }

  if (options.charge && move.type === "でんき") {
    damage = Math.floor(damage * 2);
  }

  if (move.isPhysical && options.reflect) {
    damage = Math.floor(damage * 0.5);
  } else if (!move.isPhysical && options.lightScreen) {
    damage = Math.floor(damage * 0.5);
  }

  if (options.mudSport && move.type === "でんき") {
    damage = Math.floor(damage * 0.5);
  }
  if (options.waterSport && move.type === "ほのお") {
    damage = Math.floor(damage * 0.5);
  }

  damage = applyAbilityEffects({
    damage,
    moveType: move.type,
    attackerAbility: attacker.ability as AbilityName | undefined,
    defenderAbility: defender.ability as AbilityName | undefined,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbilityActive: defender.abilityActive,
    typeEffectiveness,
    isPhysical: move.isPhysical,
  });

  if (damage > 0) {
    damage = Math.max(1, damage);
  }

  return getDamageRanges(damage);
};

/**
 * 防御側のステータスを固定し、攻撃側のEV別ダメージを計算
 */
export const calculateAttackerEvDamages = (
  input: CalculateDamageInput,
  attackStatArray: number[],
  fixedDefenseStat: number,
): EvDamageEntry[] => {
  const defenderTypes = input.defender.pokemon?.types || [];
  const results: EvDamageEntry[] = [];

  for (let i = 0; i < attackStatArray.length; i++) {
    const ev = i * 4;
    const stat = attackStatArray[i];

    const damages = calculateDamageInternal({
      move: {
        name: input.move.name,
        type: input.move.type,
        power: input.move.power,
        isPhysical: input.move.isPhysical,
      },
      attacker: {
        level: input.attacker.level,
        attack: stat,
        attackModifier: input.attacker.statModifier,
        types: input.attacker.pokemon?.types,
        pokemonName: input.attacker.pokemon?.name,
        ability: input.attacker.ability?.name,
        abilityActive: input.attacker.abilityActive,
        item: input.attacker.item?.name,
      },
      defender: {
        defense: fixedDefenseStat,
        defenseModifier: input.defender.statModifier,
        types: defenderTypes,
        pokemonName: input.defender.pokemon?.name,
        ability: input.defender.ability?.name,
        abilityActive: input.defender.abilityActive,
        item: input.defender.item?.name,
      },
      options: input.options || {},
    });

    results.push({ ev, stat, damages });
  }

  return results;
};

/**
 * 攻撃側のステータスを固定し、防御側のEV別ダメージを計算
 */
export const calculateDefenderEvDamages = (
  input: CalculateDamageInput,
  fixedAttackStat: number,
  defenseStatArray: number[],
): EvDamageEntry[] => {
  const defenderTypes = input.defender.pokemon?.types || [];
  const results: EvDamageEntry[] = [];

  for (let i = 0; i < defenseStatArray.length; i++) {
    const ev = i * 4;
    const stat = defenseStatArray[i];

    const damages = calculateDamageInternal({
      move: {
        name: input.move.name,
        type: input.move.type,
        power: input.move.power,
        isPhysical: input.move.isPhysical,
      },
      attacker: {
        level: input.attacker.level,
        attack: fixedAttackStat,
        attackModifier: input.attacker.statModifier,
        types: input.attacker.pokemon?.types,
        pokemonName: input.attacker.pokemon?.name,
        ability: input.attacker.ability?.name,
        abilityActive: input.attacker.abilityActive,
        item: input.attacker.item?.name,
      },
      defender: {
        defense: stat,
        defenseModifier: input.defender.statModifier,
        types: defenderTypes,
        pokemonName: input.defender.pokemon?.name,
        ability: input.defender.ability?.name,
        abilityActive: input.defender.abilityActive,
        item: input.defender.item?.name,
      },
      options: input.options || {},
    });

    results.push({ ev, stat, damages });
  }

  return results;
};

/**
 * 通常のダメージを計算
 */
export const calculateNormalDamage = (
  input: CalculateDamageInput,
  attackStat: number,
  defenseStat: number,
): number[] => {
  const defenderTypes = input.defender.pokemon?.types || [];

  return calculateDamageInternal({
    move: {
      name: input.move.name,
      type: input.move.type,
      power: input.move.power,
      isPhysical: input.move.isPhysical,
    },
    attacker: {
      level: input.attacker.level,
      attack: attackStat,
      attackModifier: input.attacker.statModifier,
      types: input.attacker.pokemon?.types,
      pokemonName: input.attacker.pokemon?.name,
      ability: input.attacker.ability?.name,
      abilityActive: input.attacker.abilityActive,
      item: input.attacker.item?.name,
    },
    defender: {
      defense: defenseStat,
      defenseModifier: input.defender.statModifier,
      types: defenderTypes,
      pokemonName: input.defender.pokemon?.name,
      ability: input.defender.ability?.name,
      abilityActive: input.defender.abilityActive,
      item: input.defender.item?.name,
    },
    options: input.options || {},
  });
};
