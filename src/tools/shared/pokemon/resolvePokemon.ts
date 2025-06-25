import { ABILITIES, type Ability } from "@/data/abilities";
import { ITEMS, type Item } from "@/data/items";
import { POKEMONS, type Pokemon } from "@/data/pokemon";

/**
 * ポケモン名からポケモンデータを解決
 */
export const resolvePokemon = (
  pokemonName?: string
): Pokemon | undefined => {
  if (!pokemonName) {
    return undefined;
  }
  const pokemon = POKEMONS.find((p) => p.name === pokemonName);
  if (!pokemon) {
    throw new Error(`ポケモン「${pokemonName}」が見つかりません`);
  }
  return pokemon;
};

/**
 * もちもの名からアイテムデータを解決
 */
export const resolveItem = (itemName?: string): Item | undefined => {
  if (!itemName) {
    return undefined;
  }
  const item = ITEMS.find((i) => i.name === itemName);
  if (!item) {
    throw new Error(`もちもの「${itemName}」が見つかりません`);
  }
  return item;
};

/**
 * とくせい名からとくせいデータを解決
 */
export const resolveAbility = (abilityName?: string): Ability | undefined => {
  if (!abilityName) {
    return undefined;
  }
  const ability = ABILITIES.find((a) => a.name === abilityName);
  if (!ability) {
    throw new Error(`とくせい「${abilityName}」が見つかりません`);
  }
  return ability;
};