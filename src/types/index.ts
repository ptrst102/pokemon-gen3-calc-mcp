export type StatKeyExceptHP = "atk" | "def" | "spa" | "spd" | "spe";
export type StatKey = "hp" | StatKeyExceptHP;

export type StatsExceptHPObj = { [stat in StatKeyExceptHP]: number };
export type StatsObj = { [stat in StatKey]: number };

// ポケモンのタイプ
export type TypeName =
  | "ノーマル"
  | "ほのお"
  | "みず"
  | "でんき"
  | "くさ"
  | "こおり"
  | "かくとう"
  | "どく"
  | "じめん"
  | "ひこう"
  | "エスパー"
  | "むし"
  | "いわ"
  | "ゴースト"
  | "ドラゴン"
  | "あく"
  | "はがね";
