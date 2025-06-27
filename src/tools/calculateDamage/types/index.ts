import type { Ability } from "@/data/abilities";
import type { Item } from "@/data/items";
import type { Pokemon } from "@/data/pokemon";
import type { TypeName } from "@/types";

/**
 * ステータス計算結果の型
 */
export type StatValue = number;

/**
 * 計算済みのステータス値
 */
export interface CalculatedStats {
  attackStat: number;
  defenseStat: number;
}

/**
 * ダメージ計算のオプション
 */
export interface DamageOptions {
  weather?: "はれ" | "あめ" | "あられ" | "すなあらし";
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
