import type { ItemName } from "@/data/items";
import type { TypeName } from "@/types";

export interface ItemEffectResult {
  attackMultiplier: { numerator: number; denominator: number };
  specialAttackMultiplier: { numerator: number; denominator: number };
  defenseMultiplier: { numerator: number; denominator: number };
  specialDefenseMultiplier: { numerator: number; denominator: number };
  moveTypeMultiplier: { numerator: number; denominator: number };
  moveRestricted: boolean;
}

export const calculateItemEffects = (
  item: ItemName | undefined,
  pokemonName: string | undefined,
  moveType: TypeName,
  isPhysical: boolean,
): ItemEffectResult => {
  const defaultResult: ItemEffectResult = {
    attackMultiplier: { numerator: 1, denominator: 1 },
    specialAttackMultiplier: { numerator: 1, denominator: 1 },
    defenseMultiplier: { numerator: 1, denominator: 1 },
    specialDefenseMultiplier: { numerator: 1, denominator: 1 },
    moveTypeMultiplier: { numerator: 1, denominator: 1 },
    moveRestricted: false,
  };

  if (!item) {
    return defaultResult;
  }

  const typeEnhancingItems: Partial<Record<ItemName, TypeName>> = {
    もくたん: "ほのお",
    しんぴのしずく: "みず",
    きせきのタネ: "くさ",
    じしゃく: "でんき",
    とけないこおり: "こおり",
    どくバリ: "どく",
    やわらかいすな: "じめん",
    かたいいし: "いわ",
    ぎんのこな: "むし",
    のろいのおふだ: "ゴースト",
    りゅうのキバ: "ドラゴン",
    くろいメガネ: "あく",
    メタルコート: "はがね",
    シルクのスカーフ: "ノーマル",
    くろおび: "かくとう",
    するどいくちばし: "ひこう",
    まがったスプーン: "エスパー",
  };

  const enhancedType = typeEnhancingItems[item];
  if (enhancedType && enhancedType === moveType) {
    if (isPhysical) {
      return {
        ...defaultResult,
        attackMultiplier: { numerator: 11, denominator: 10 },
      };
    } else {
      return {
        ...defaultResult,
        specialAttackMultiplier: { numerator: 11, denominator: 10 },
      };
    }
  }

  switch (item) {
    case "こだわりハチマキ":
      return {
        ...defaultResult,
        attackMultiplier: { numerator: 3, denominator: 2 },
        moveRestricted: true,
      };

    case "でんきだま":
      if (pokemonName === "ピカチュウ") {
        return {
          ...defaultResult,
          specialAttackMultiplier: { numerator: 2, denominator: 1 },
        };
      }
      break;

    case "メタルパウダー":
      if (pokemonName === "メタモン") {
        return {
          ...defaultResult,
          defenseMultiplier: { numerator: 2, denominator: 1 },
        };
      }
      break;

    case "ふといホネ":
      if (pokemonName === "カラカラ" || pokemonName === "ガラガラ") {
        return {
          ...defaultResult,
          attackMultiplier: { numerator: 2, denominator: 1 },
        };
      }
      break;

    case "しんかいのキバ":
      if (pokemonName === "パールル") {
        return {
          ...defaultResult,
          specialAttackMultiplier: { numerator: 2, denominator: 1 },
        };
      }
      break;

    case "しんかいのウロコ":
      if (pokemonName === "パールル") {
        return {
          ...defaultResult,
          specialDefenseMultiplier: { numerator: 2, denominator: 1 },
        };
      }
      break;

    case "こころのしずく":
      if (pokemonName === "ラティオス" || pokemonName === "ラティアス") {
        return {
          ...defaultResult,
          specialAttackMultiplier: { numerator: 3, denominator: 2 },
          specialDefenseMultiplier: { numerator: 3, denominator: 2 },
        };
      }
      break;
  }

  return defaultResult;
};
