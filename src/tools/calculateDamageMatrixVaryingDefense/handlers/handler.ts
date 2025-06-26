import { ZodError } from "zod";
import type { AbilityName } from "@/data/abilities";
import type { ItemName } from "@/data/items";
import { applyAbilityEffects } from "@/tools/calculateDamage/handlers/helpers/abilityEffects";
import { calculateBaseDamage } from "@/tools/calculateDamage/handlers/helpers/calculateBaseDamage";
import { getDamageRanges } from "@/tools/calculateDamage/handlers/helpers/damageRanges";
import { calculateItemEffects } from "@/tools/calculateDamage/handlers/helpers/itemEffects";
import { getStatModifierRatio } from "@/tools/calculateDamage/handlers/helpers/statModifier";
import { getTypeEffectiveness } from "@/tools/calculateDamage/handlers/helpers/typeEffectiveness";
import type { TypeName } from "@/types";
import { calculateHp } from "@/utils/calculateHp";
import { calculateStat } from "@/utils/calculateStat";
import { NATURE_MODIFIER_MAP } from "@/utils/natureModifier";
import {
  type CalculateDamageMatrixVaryingDefenseInput,
  calculateDamageMatrixVaryingDefenseInputSchema,
} from "./schemas/damageMatrixVaryingDefenseSchema";

interface DamageMatrixEntry {
  ev: number;
  defenseStat: number;
  hpStat: number;
  damages: number[];
}

interface DamageCalculationParams {
  move: {
    name?: string;
    type: string;
    power: number;
    isPhysical: boolean;
  };
  attackStat: number;
  defenseStat: number;
  attacker: {
    level: number;
    statModifier: number;
    pokemon?: { types?: TypeName[] };
    ability?: { name?: AbilityName };
    abilityActive?: boolean;
    item?: { name?: ItemName };
    pokemonName?: string;
  };
  defender: {
    statModifier: number;
    pokemon?: { types?: TypeName[] };
    ability?: { name?: AbilityName };
    abilityActive?: boolean;
    item?: { name?: ItemName };
    pokemonName?: string;
  };
  options: {
    weather?: "はれ" | "あめ";
    charge?: boolean;
    reflect?: boolean;
    lightScreen?: boolean;
    mudSport?: boolean;
    waterSport?: boolean;
  };
}

/**
 * 防御側の努力値を総当たりしてダメージ計算を行う
 */
export const calculateDamageMatrixVaryingDefenseHandler = async (
  args: unknown,
): Promise<{
  content: Array<{ type: "text"; text: string }>;
}> => {
  try {
    const input = calculateDamageMatrixVaryingDefenseInputSchema.parse(args);
    const results = calculateDamageMatrix(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "入力値が不正です",
                details: error.errors.map((e) => ({
                  path: e.path.join("."),
                  message: e.message,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "不明なエラーが発生しました",
            },
            null,
            2,
          ),
        },
      ],
    };
  }
};

/**
 * ダメージマトリックスを計算
 */
const calculateDamageMatrix = (
  input: CalculateDamageMatrixVaryingDefenseInput,
): { damageMatrix: DamageMatrixEntry[] } => {
  const { move, attacker, defender, options } = input;

  // 攻撃側のステータスを計算
  const attackStat = (() => {
    if ("value" in attacker.stat) {
      return attacker.stat.value;
    }

    const baseStat = move.isPhysical
      ? (attacker.pokemon?.baseStats.atk ?? 100)
      : (attacker.pokemon?.baseStats.spa ?? 100);

    return calculateStat({
      baseStat,
      level: attacker.level,
      iv: attacker.stat.iv,
      ev: attacker.stat.ev,
      natureModifier:
        NATURE_MODIFIER_MAP[attacker.stat.natureModifier || "neutral"],
    });
  })();

  // 防御側の基礎情報
  const defenderBaseStat = defender.isPhysicalDefense
    ? defender.pokemon.baseStats.def
    : defender.pokemon.baseStats.spd;

  const defenderHpBaseStat = defender.pokemon.baseStats.hp;

  // 努力値の範囲（0, 4, 12, 20, ..., 252）
  const evValues: number[] = [0];
  for (let ev = 4; ev <= 252; ev += 8) {
    evValues.push(ev);
  }

  // 各努力値でダメージを計算
  const damageMatrix: DamageMatrixEntry[] = evValues.map((ev) => {
    // 防御/特防の実数値を計算
    const defenseStat = calculateStat({
      baseStat: defenderBaseStat,
      level: defender.level,
      iv: defender.stat.iv,
      ev,
      natureModifier:
        NATURE_MODIFIER_MAP[defender.stat.natureModifier || "neutral"],
    });

    // HPの実数値を計算（参考値として）
    const hpStat = calculateHp({
      baseStat: defenderHpBaseStat,
      level: defender.level,
      iv: 31, // HP個体値は31で固定（一般的な仮定）
      ev: 0, // HP努力値は0で固定（防御/特防に振る想定）
    });

    // ダメージ計算
    const damages = calculateDamageWithContext({
      move,
      attackStat,
      defenseStat,
      attacker,
      defender,
      options,
    });

    return {
      ev,
      defenseStat,
      hpStat,
      damages,
    };
  });

  return { damageMatrix };
};

/**
 * コンテキストを含むダメージ計算
 */
const calculateDamageWithContext = (
  params: DamageCalculationParams,
): number[] => {
  const { move, attackStat, defenseStat, attacker, defender, options } = params;

  // もちもの効果を計算
  const attackerItemEffects = calculateItemEffects(
    attacker.item?.name as ItemName | undefined,
    attacker.pokemonName || undefined,
    move.type as TypeName,
    move.isPhysical,
  );

  const defenderItemEffects = calculateItemEffects(
    defender.item?.name as ItemName | undefined,
    defender.pokemonName || undefined,
    move.type as TypeName,
    move.isPhysical,
  );

  // ランク補正を適用
  const attackRatio = getStatModifierRatio(attacker.statModifier);
  const baseAttackStat = Math.floor(
    (attackStat * attackRatio.numerator) / attackRatio.denominator,
  );

  const finalAttackStat = move.isPhysical
    ? Math.floor(
        (baseAttackStat * attackerItemEffects.attackMultiplier.numerator) /
          attackerItemEffects.attackMultiplier.denominator,
      )
    : Math.floor(
        (baseAttackStat *
          attackerItemEffects.specialAttackMultiplier.numerator) /
          attackerItemEffects.specialAttackMultiplier.denominator,
      );

  const defenseRatio = getStatModifierRatio(defender.statModifier);
  const baseDefenseStat = Math.floor(
    (defenseStat * defenseRatio.numerator) / defenseRatio.denominator,
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

  // 場の状態による防御補正
  const finalDefenseStat = (() => {
    if (move.isPhysical && options.reflect) {
      return itemAdjustedDefenseStat * 2;
    }
    if (!move.isPhysical && options.lightScreen) {
      return itemAdjustedDefenseStat * 2;
    }
    return itemAdjustedDefenseStat;
  })();

  // 基本ダメージを計算
  const baseDamage = calculateBaseDamage({
    level: attacker.level,
    power: move.power,
    attack: finalAttackStat,
    defense: finalDefenseStat,
    isPhysical: move.isPhysical,
  });

  // とくせい効果を適用
  const abilityAdjustedDamage = applyAbilityEffects({
    damage: baseDamage,
    moveType: move.type as TypeName,
    isPhysical: move.isPhysical,
    attackerAbility: attacker.ability?.name as AbilityName | undefined,
    attackerAbilityActive: attacker.abilityActive,
    defenderAbility: defender.ability?.name as AbilityName | undefined,
    defenderAbilityActive: defender.abilityActive,
  });

  // タイプ相性を計算
  const effectiveness = getTypeEffectiveness(
    move.type as TypeName,
    (defender.pokemon?.types || []) as TypeName[],
  );

  // タイプ一致ボーナス
  const hasStab =
    attacker.pokemon?.types?.includes(move.type as TypeName) ?? false;
  const stabMultiplier = hasStab ? 1.5 : 1;

  // 最終的なダメージを計算
  const finalDamage = Math.floor(
    abilityAdjustedDamage * effectiveness * stabMultiplier,
  );

  // ダメージ乱数（16通り）を計算
  return getDamageRanges(finalDamage);
};
