import type { Ability, AbilityName } from "@/data/abilities";
import type { Item, ItemName } from "@/data/items";
import type { CalculateDamageInput } from "@/tools/calculateDamage/handlers/schemas/damageSchema";
import type { DamageOptions } from "@/tools/calculateDamage/types";
import type { TypeName } from "@/types";
import { applyAbilityEffects } from "../abilityEffects";
import { calculateBaseDamage } from "../calculateBaseDamage";
import { getDamageRanges } from "../damageRanges";
import { calculateItemEffects } from "../itemEffects";
import { getStatModifierRatio } from "../statModifier";
import { getTypeEffectiveness } from "../typeEffectiveness";

/**
 * 内部的なダメージ計算パラメータ
 */
interface InternalDamageParams {
  move: {
    name?: string;
    type: TypeName;
    power: number;
    isPhysical: boolean;
  };
  attacker: {
    level: number;
    attack: number;
    attackModifier: number;
    types?: TypeName[];
    pokemonName?: string;
    ability?: Ability;
    abilityActive?: boolean;
    item?: Item;
  };
  defender: {
    defense: number;
    defenseModifier: number;
    types: TypeName[];
    pokemonName?: string;
    ability?: Ability;
    abilityActive?: boolean;
    item?: Item;
  };
  options: DamageOptions;
}

/**
 * ダメージ計算の主処理
 * 補正値、タイプ相性、とくせい効果を全て適用
 */
const calculateDamageInternal = (params: InternalDamageParams): number[] => {
  const { move, attacker, defender, options } = params;

  const attackerItemEffects = calculateItemEffects(
    attacker.item?.name as ItemName | undefined,
    attacker.pokemonName,
    move.type,
    move.isPhysical,
  );

  const defenderItemEffects = calculateItemEffects(
    defender.item?.name as ItemName | undefined,
    defender.pokemonName,
    move.type,
    move.isPhysical,
  );

  const attackRatio = getStatModifierRatio(attacker.attackModifier);
  const baseAttackStat = Math.floor(
    (attacker.attack * attackRatio.numerator) / attackRatio.denominator,
  );

  const attackStat = move.isPhysical
    ? Math.floor(
        (baseAttackStat * attackerItemEffects.attackMultiplier.numerator) /
          attackerItemEffects.attackMultiplier.denominator,
      )
    : Math.floor(
        (baseAttackStat *
          attackerItemEffects.specialAttackMultiplier.numerator) /
          attackerItemEffects.specialAttackMultiplier.denominator,
      );

  const defenseRatio = getStatModifierRatio(defender.defenseModifier);
  const baseDefenseStat = Math.floor(
    (defender.defense * defenseRatio.numerator) / defenseRatio.denominator,
  );

  const itemAdjustedDefenseStat = move.isPhysical
    ? Math.floor(
        (baseDefenseStat * defenderItemEffects.defenseMultiplier.numerator) /
          defenderItemEffects.defenseMultiplier.denominator,
      )
    : Math.floor(
        (baseDefenseStat *
          defenderItemEffects.specialDefenseMultiplier.numerator) /
          defenderItemEffects.specialDefenseMultiplier.denominator,
      );

  // じばく・だいばくはつの処理: 防御を半分にする
  const defenseStat =
    "name" in move && (move.name === "じばく" || move.name === "だいばくはつ")
      ? Math.floor(itemAdjustedDefenseStat / 2)
      : itemAdjustedDefenseStat;

  const baseDamage = calculateBaseDamage({
    level: attacker.level,
    power: move.power,
    attack: attackStat,
    defense: defenseStat,
    isPhysical: move.isPhysical,
  });

  // タイプ一致ボーナス
  const stabDamage = attacker.types?.some((type) => type === move.type)
    ? Math.floor(baseDamage * 1.5)
    : baseDamage;

  // タイプ相性
  const typeEffectiveness = getTypeEffectiveness(move.type, defender.types);
  const typeAdjustedDamage = Math.floor(stabDamage * typeEffectiveness);

  // 天候効果
  const weatherAdjustedDamage = (() => {
    if (options.weather === "はれ") {
      if (move.type === "ほのお") {
        return Math.floor(typeAdjustedDamage * 1.5);
      }
      if (move.type === "みず") {
        return Math.floor(typeAdjustedDamage * 0.5);
      }
    }
    if (options.weather === "あめ") {
      if (move.type === "みず") {
        return Math.floor(typeAdjustedDamage * 1.5);
      }
      if (move.type === "ほのお") {
        return Math.floor(typeAdjustedDamage * 0.5);
      }
    }
    return typeAdjustedDamage;
  })();

  // チャージ効果
  const chargeAdjustedDamage =
    options.charge && move.type === "でんき"
      ? Math.floor(weatherAdjustedDamage * 2)
      : weatherAdjustedDamage;

  // 壁効果
  const screenAdjustedDamage = (() => {
    if (move.isPhysical && options.reflect) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    if (!move.isPhysical && options.lightScreen) {
      return Math.floor(chargeAdjustedDamage * 0.5);
    }
    return chargeAdjustedDamage;
  })();

  // スポーツ効果
  const sportAdjustedDamage = (() => {
    if (options.mudSport && move.type === "でんき") {
      return Math.floor(screenAdjustedDamage * 0.5);
    }
    if (options.waterSport && move.type === "ほのお") {
      return Math.floor(screenAdjustedDamage * 0.5);
    }
    return screenAdjustedDamage;
  })();

  // とくせい効果
  const abilityAdjustedDamage = applyAbilityEffects({
    damage: sportAdjustedDamage,
    moveType: move.type,
    attackerAbility: attacker.ability?.name as AbilityName | undefined,
    defenderAbility: defender.ability?.name as AbilityName | undefined,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbilityActive: defender.abilityActive,
    typeEffectiveness,
    isPhysical: move.isPhysical,
  });

  // 最小ダメージ保証
  const finalDamage =
    abilityAdjustedDamage > 0
      ? Math.max(1, abilityAdjustedDamage)
      : abilityAdjustedDamage;

  return getDamageRanges(finalDamage);
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
      ability: input.attacker.ability,
      abilityActive: input.attacker.abilityActive,
      item: input.attacker.item,
    },
    defender: {
      defense: defenseStat,
      defenseModifier: input.defender.statModifier,
      types: defenderTypes,
      pokemonName: input.defender.pokemon?.name,
      ability: input.defender.ability,
      abilityActive: input.defender.abilityActive,
      item: input.defender.item,
    },
    options: input.options || {},
  });
};
