import type { StatKeyExceptHP } from "@/types";

export interface Nature {
  name: string;
  plus?: StatKeyExceptHP;
  minus?: StatKeyExceptHP;
}

export const NATURES = [
  // 攻撃UP
  {
    name: "さみしがり",
    plus: "atk",
    minus: "def",
  },
  {
    name: "いじっぱり",
    plus: "atk",
    minus: "spa",
  },
  {
    name: "やんちゃ",
    plus: "atk",
    minus: "spd",
  },
  {
    name: "ゆうかん",
    plus: "atk",
    minus: "spe",
  },
  // 防御UP
  {
    name: "ずぶとい",
    plus: "def",
    minus: "atk",
  },
  {
    name: "わんぱく",
    plus: "def",
    minus: "spa",
  },
  {
    name: "のうてんき",
    plus: "def",
    minus: "spd",
  },
  {
    name: "のんき",
    plus: "def",
    minus: "spe",
  },
  // 特攻UP
  {
    name: "ひかえめ",
    plus: "spa",
    minus: "atk",
  },
  {
    name: "おっとり",
    plus: "spa",
    minus: "def",
  },
  {
    name: "うっかりや",
    plus: "spa",
    minus: "spd",
  },
  {
    name: "れいせい",
    plus: "spa",
    minus: "spe",
  },
  // 特防UP
  {
    name: "おだやか",
    plus: "spd",
    minus: "atk",
  },
  {
    name: "おとなしい",
    plus: "spd",
    minus: "def",
  },
  {
    name: "しんちょう",
    plus: "spd",
    minus: "spa",
  },
  {
    name: "なまいき",
    plus: "spd",
    minus: "spe",
  },
  // 素早さUP
  {
    name: "おくびょう",
    plus: "spe",
    minus: "atk",
  },
  {
    name: "せっかち",
    plus: "spe",
    minus: "def",
  },
  {
    name: "ようき",
    plus: "spe",
    minus: "spa",
  },
  {
    name: "むじゃき",
    plus: "spe",
    minus: "spd",
  },
  // 無補正
  {
    name: "てれや",
  },
  {
    name: "がんばりや",
  },
  {
    name: "すなお",
  },
  {
    name: "きまぐれ",
  },
  {
    name: "まじめ",
  },
] as const satisfies Nature[];

export type NatureName = (typeof NATURES)[number]["name"];
