export interface Item {
  name: string;
  description: string;
}

export const ITEMS = [
  {
    name: "もくたん",
    description:
      "ポケモンに　もたせると　ほのおタイプの　わざのいりょくが　あがる",
  },
  {
    name: "しんぴのしずく",
    description:
      "ポケモンに　もたせると　みずタイプの　わざのいりょくが　あがる",
  },
  {
    name: "きせきのタネ",
    description:
      "ポケモンに　もたせると　くさタイプの　わざのいりょくが　あがる",
  },
  {
    name: "じしゃく",
    description:
      "ポケモンに　もたせると　でんきタイプの　わざのいりょくが　あがる",
  },
  {
    name: "とけないこおり",
    description:
      "ポケモンに　もたせると　こおりタイプの　わざのいりょくが　あがる",
  },
  {
    name: "どくバリ",
    description:
      "ポケモンに　もたせると　どくタイプの　わざのいりょくが　あがる",
  },
  {
    name: "やわらかいすな",
    description:
      "ポケモンに　もたせると　じめんタイプの　わざのいりょくが　あがる",
  },
  {
    name: "かたいいし",
    description:
      "ポケモンに　もたせると　いわタイプの　わざのいりょくが　あがる",
  },
  {
    name: "ぎんのこな",
    description:
      "ポケモンに　もたせると　むしタイプの　わざのいりょくが　あがる",
  },
  {
    name: "のろいのおふだ",
    description:
      "ポケモンに　もたせると　ゴーストタイプの　わざのいりょくが　あがる",
  },
  {
    name: "りゅうのキバ",
    description:
      "ポケモンに　もたせると　ドラゴンタイプの　わざのいりょくが　あがる",
  },
  {
    name: "くろいメガネ",
    description:
      "ポケモンに　もたせると　あくタイプの　わざのいりょくが　あがる",
  },
  {
    name: "メタルコート",
    description:
      "ポケモンに　もたせると　はがねタイプの　わざのいりょくが　あがる",
  },
  {
    name: "シルクのスカーフ",
    description:
      "ポケモンに　もたせると　ノーマルタイプの　わざのいりょくが　あがる",
  },
  {
    name: "くろおび",
    description:
      "ポケモンに　もたせると　かくとうタイプの　わざのいりょくが　あがる",
  },
  {
    name: "するどいくちばし",
    description:
      "ポケモンに　もたせると　ひこうタイプの　わざのいりょくが　あがる",
  },
  {
    name: "まがったスプーン",
    description:
      "ポケモンに　もたせると　エスパータイプの　わざのいりょくが　あがる",
  },
  {
    name: "こだわりハチマキ",
    description:
      "こうげきの　いりょくが　あがるが　おなじ　わざしか　だせなくなる",
  },
  {
    name: "でんきだま",
    description:
      "ビリビリしている　たま　ピカチュウに　もたせると　とくこうが　あがる",
  },
  {
    name: "メタルパウダー",
    description: "メタモンに　もたせると　ぼうぎょりょくが　あがる",
  },
  {
    name: "ふといホネ",
    description: "なにかの　ホネ　やすく　うれる",
  },
  {
    name: "しんかいのキバ",
    description:
      "するどく　ひかる　キバ　パールルに　もたせると　とくこうが　あがる",
  },
  {
    name: "しんかいのウロコ",
    description:
      "にぶく　ひかる　キバ　パールルに　もたせると　とくぼうが　あがる",
  }, // todo: キバ表記はポケモンwikiの誤植と思われる。正式表示はあとで調べる
  {
    name: "こころのしずく",
    description:
      "ラティオス　ラティアスに　もたせると　とくこうと　とくぼうが　あがる",
  },
] as const satisfies Item[];

export type ItemName = (typeof ITEMS)[number]["name"];
