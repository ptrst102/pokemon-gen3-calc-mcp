import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { Pokemon } from "@/data/pokemon";
import type { TypeName } from "@/types";

/**
 * ステータス計算結果の型
 * 単一の値または努力値別の配列
 */
export type StatValue = number | number[];

/**
 * 計算済みのステータス値
 */
export interface CalculatedStats {
  attackStat: StatValue;
  defenseStat: StatValue;
}

/**
 * ダメージ計算のオプション
 */
export interface DamageOptions {
  weather?: "はれ" | "あめ";
  charge?: boolean;
  reflect?: boolean;
  lightScreen?: boolean;
  mudSport?: boolean;
  waterSport?: boolean;
}

/**
 * わざの情報
 */
interface MoveInfo {
  name?: string;
  type: TypeName;
  power: number;
  isPhysical: boolean;
}

/**
 * ポケモンの情報（攻撃側/防御側共通）
 */
interface PokemonInfo {
  level: number;
  pokemon?: Pokemon;
  item?: Item;
  ability?: Ability;
  abilityActive?: boolean;
  statModifier: number;
}

/**
 * ダメージ計算のコンテキスト情報
 * フォーマッターに渡される共通の情報
 */
export interface DamageCalculationContext {
  move: MoveInfo;
  attacker: PokemonInfo;
  defender: PokemonInfo;
  typeEffectiveness: number;
  isStab: boolean;
  options?: DamageOptions;
}

/**
 * 通常のダメージ計算結果
 */
export interface NormalDamageResult extends DamageCalculationContext {
  damages: number[];
  attackStat: number;
  defenseStat: number;
}

/**
 * EV別ダメージ計算結果
 */
export interface EvRangeDamageResult extends DamageCalculationContext {
  evResults: Array<{
    ev: number;
    stat: number;
    damages: number[];
  }>;
  fixedStat: number;
  isAttackerEv: boolean;
}
