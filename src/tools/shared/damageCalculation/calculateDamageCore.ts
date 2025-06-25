import type { AbilityName } from "@/data/abilities";
import type { ItemName } from "@/data/items";
import type { InternalDamageParams } from "@/tools/calculateDamage/types/damageCalculation";
import { applyAbilityEffects } from "@/tools/calculateDamage/handlers/helpers/abilityEffects";
import { calculateBaseDamage } from "@/tools/calculateDamage/handlers/helpers/calculateBaseDamage";
import { getDamageRanges } from "@/tools/calculateDamage/handlers/helpers/damageRanges";
import { calculateItemEffects } from "@/tools/calculateDamage/handlers/helpers/itemEffects";
import { getStatModifierRatio } from "@/tools/calculateDamage/handlers/helpers/statModifier";
import { getTypeEffectiveness } from "@/tools/calculateDamage/handlers/helpers/typeEffectiveness";

/**
 * ダメージ計算の主処理（共通化）
 * 補正値、タイプ相性、とくせい効果を全て適用
 */
export const calculateDamageCore = (params: InternalDamageParams): number[] => {
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