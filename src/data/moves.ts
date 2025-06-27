/**
 * なつき度依存のわざについて：
 * - おんがえし: 威力 = なつき度÷2.5
 * - やつあたり: 威力 = (255-なつき度)÷2.5
 *
 * 現在は最大威力（なつき度255/0相当）の102で固定実装
 */
interface Move {
  name: string;
  type: string;
  power: number;
}

export const MOVES = [
  {
    name: "１０まんボルト",
    type: "でんき",
    power: 95,
  },
  {
    name: "10まんボルト",
    type: "でんき",
    power: 95,
  }, // 利便性のために全角半角ともに登録
  {
    name: "アイアンテール",
    type: "はがね",
    power: 100,
  },
  {
    name: "あてみなげ",
    type: "かくとう",
    power: 70,
  },
  {
    name: "あなをほる",
    type: "じめん",
    power: 60,
  },
  {
    name: "あばれる",
    type: "ノーマル",
    power: 90,
  },
  {
    name: "あわ",
    type: "みず",
    power: 40,
  },
  {
    name: "いあいぎり",
    type: "ノーマル",
    power: 50,
  },
  {
    name: "いびき",
    type: "ノーマル",
    power: 50,
  },
  {
    name: "いわおとし",
    type: "いわ",
    power: 50,
  },
  {
    name: "いわくだき",
    type: "かくとう",
    power: 40,
  },
  {
    name: "いわなだれ",
    type: "いわ",
    power: 75,
  },
  {
    name: "ウェザーボール",
    type: "ノーマル",
    power: 50,
  },
  {
    name: "うずしお",
    type: "みず",
    power: 15,
  },
  {
    name: "エアカッター",
    type: "ひこう",
    power: 55,
  },
  {
    name: "エアロブラスト",
    type: "ひこう",
    power: 100,
  },
  {
    name: "おいうち",
    type: "あく",
    power: 40,
  },
  {
    name: "おうふくビンタ",
    type: "ノーマル",
    power: 15,
  },
  {
    name: "おんがえし",
    type: "ノーマル",
    power: 102,
  },
  {
    name: "オーバーヒート",
    type: "ほのお",
    power: 140,
  },
  {
    name: "オーロラビーム",
    type: "こおり",
    power: 65,
  },
  {
    name: "オクタンほう",
    type: "みず",
    power: 65,
  },
  {
    name: "おどろかす",
    type: "ゴースト",
    power: 30,
  },
  {
    name: "かいりき",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "かえんぐるま",
    type: "ほのお",
    power: 60,
  },
  {
    name: "かえんほうしゃ",
    type: "ほのお",
    power: 95,
  },
  {
    name: "かぜおこし",
    type: "ひこう",
    power: 40,
  },
  {
    name: "かまいたち",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "かみくだく",
    type: "あく",
    power: 80,
  },
  {
    name: "かみつく",
    type: "あく",
    power: 60,
  },
  {
    name: "かみなり",
    type: "でんき",
    power: 120,
  },
  {
    name: "かみなりパンチ",
    type: "でんき",
    power: 75,
  },
  {
    name: "からげんき",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "からてチョップ",
    type: "かくとう",
    power: 50,
  },
  {
    name: "からではさむ",
    type: "みず",
    power: 35,
  },
  {
    name: "からみつく",
    type: "ノーマル",
    power: 10,
  },
  {
    name: "かわらわり",
    type: "かくとう",
    power: 75,
  },
  {
    name: "がんせきふうじ",
    type: "いわ",
    power: 60,
  },
  {
    name: "きあいパンチ",
    type: "かくとう",
    power: 150,
  },
  {
    name: "ギガドレイン",
    type: "くさ",
    power: 60,
  },
  {
    name: "きつけ",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "きゅうけつ",
    type: "むし",
    power: 20,
  },
  {
    name: "きりさく",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "けたぐり",
    type: "かくとう",
    power: 60,
  },
  {
    name: "ぎんいろのかぜ",
    type: "むし",
    power: 60,
  },
  {
    name: "クラブハンマー",
    type: "みず",
    power: 100,
  },
  {
    name: "クロスチョップ",
    type: "かくとう",
    power: 100,
  },
  {
    name: "げきりん",
    type: "ドラゴン",
    power: 90,
  },
  {
    name: "げんしのちから",
    type: "いわ",
    power: 60,
  },
  {
    name: "こうそくスピン",
    type: "ノーマル",
    power: 50,
  },
  {
    name: "こごえるかぜ",
    type: "こおり",
    power: 55,
  },
  {
    name: "ゴッドバード",
    type: "ひこう",
    power: 140,
  },
  {
    name: "こなゆき",
    type: "こおり",
    power: 40,
  },
  {
    name: "コメットパンチ",
    type: "はがね",
    power: 100,
  },
  {
    name: "サイケこうせん",
    type: "エスパー",
    power: 65,
  },
  {
    name: "サイコキネシス",
    type: "エスパー",
    power: 90,
  },
  {
    name: "サイコブースト",
    type: "エスパー",
    power: 140,
  },
  {
    name: "さわぐ",
    type: "ノーマル",
    power: 90,
  },
  {
    name: "シグナルビーム",
    type: "むし",
    power: 75,
  },
  {
    name: "じごくぐるま",
    type: "かくとう",
    power: 80,
  },
  {
    name: "じしん",
    type: "じめん",
    power: 100,
  },
  {
    name: "したでなめる",
    type: "ゴースト",
    power: 30,
  },
  {
    name: "じばく",
    type: "ノーマル",
    power: 200,
  },
  {
    name: "しめつける",
    type: "ノーマル",
    power: 15,
  },
  {
    name: "シャドーパンチ",
    type: "ゴースト",
    power: 60,
  },
  {
    name: "シャドーボール",
    type: "ゴースト",
    power: 80,
  },
  {
    name: "しんそく",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "じんつうりき",
    type: "エスパー",
    power: 80,
  },
  {
    name: "すいとる",
    type: "くさ",
    power: 20,
  },
  {
    name: "スカイアッパー",
    type: "かくとう",
    power: 85,
  },
  {
    name: "ずつき",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "すてみタックル",
    type: "ノーマル",
    power: 120,
  },
  {
    name: "すなじごく",
    type: "じめん",
    power: 15,
  },
  {
    name: "スパーク",
    type: "でんき",
    power: 65,
  },
  {
    name: "スピードスター",
    type: "ノーマル",
    power: 60,
  },
  {
    name: "スモッグ",
    type: "どく",
    power: 30,
  },
  {
    name: "せいなるほのお",
    type: "ほのお",
    power: 100,
  },
  {
    name: "ソーラービーム",
    type: "くさ",
    power: 120,
  },
  {
    name: "そらをとぶ",
    type: "ひこう",
    power: 90,
  },
  {
    name: "たいあたり",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "だいばくはつ",
    type: "ノーマル",
    power: 250,
  },
  {
    name: "ダイビング",
    type: "みず",
    power: 60,
  },
  {
    name: "だいもんじ",
    type: "ほのお",
    power: 120,
  },
  {
    name: "たきのぼり",
    type: "みず",
    power: 80,
  },
  {
    name: "だくりゅう",
    type: "みず",
    power: 90,
  },
  {
    name: "たたきつける",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "たつまき",
    type: "ドラゴン",
    power: 40,
  },
  {
    name: "タネマシンガン",
    type: "くさ",
    power: 10,
  },
  {
    name: "ダブルニードル",
    type: "むし",
    power: 25,
  },
  {
    name: "タマゴばくだん",
    type: "ノーマル",
    power: 100,
  },
  {
    name: "だましうち",
    type: "あく",
    power: 60,
  },
  {
    name: "たまなげ",
    type: "ノーマル",
    power: 15,
  },
  {
    name: "つつく",
    type: "ひこう",
    power: 35,
  },
  {
    name: "つっぱり",
    type: "かくとう",
    power: 15,
  },
  {
    name: "つのでつく",
    type: "ノーマル",
    power: 65,
  },
  {
    name: "つばさでうつ",
    type: "ひこう",
    power: 60,
  },
  {
    name: "つばめがえし",
    type: "ひこう",
    power: 60,
  },
  {
    name: "つららばり",
    type: "こおり",
    power: 10,
  },
  {
    name: "つるのムチ",
    type: "くさ",
    power: 45,
  },
  {
    name: "でんきショック",
    type: "でんき",
    power: 40,
  },
  {
    name: "でんげきは",
    type: "でんき",
    power: 60,
  },
  {
    name: "でんこうせっか",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "でんじほう",
    type: "でんき",
    power: 120,
  },
  {
    name: "どくどくのキバ",
    type: "どく",
    power: 50,
  },
  {
    name: "どくばり",
    type: "どく",
    power: 15,
  },
  {
    name: "とげキャノン",
    type: "ノーマル",
    power: 20,
  },
  {
    name: "とっしん",
    type: "ノーマル",
    power: 90,
  },
  {
    name: "とびげり",
    type: "かくとう",
    power: 85,
  },
  {
    name: "とびはねる",
    type: "ひこう",
    power: 85,
  },
  {
    name: "とびひざげり",
    type: "かくとう",
    power: 100,
  },
  {
    name: "トライアタック",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "ドラゴンクロー",
    type: "ドラゴン",
    power: 80,
  },
  {
    name: "ドリルくちばし",
    type: "ひこう",
    power: 80,
  },
  {
    name: "どろかけ",
    type: "じめん",
    power: 20,
  },
  {
    name: "どろぼう",
    type: "あく",
    power: 60,
  },
  {
    name: "なみのり",
    type: "みず",
    power: 95,
  },
  {
    name: "ニードルアーム",
    type: "くさ",
    power: 60,
  },
  {
    name: "にどげり",
    type: "かくとう",
    power: 30,
  },
  {
    name: "ねこだまし",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "ネコにこばん",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "ねっぷう",
    type: "ほのお",
    power: 100,
  },
  {
    name: "ねんりき",
    type: "エスパー",
    power: 50,
  },
  {
    name: "のしかかり",
    type: "ノーマル",
    power: 85,
  },
  {
    name: "ハードプラント",
    type: "くさ",
    power: 150,
  },
  {
    name: "ハイドロカノン",
    type: "みず",
    power: 150,
  },
  {
    name: "ハイドロポンプ",
    type: "みず",
    power: 120,
  },
  {
    name: "ハイパーボイス",
    type: "ノーマル",
    power: 90,
  },
  {
    name: "はかいこうせん",
    type: "ノーマル",
    power: 150,
  },
  {
    name: "ばかぢから",
    type: "かくとう",
    power: 120,
  },
  {
    name: "はがねのつばさ",
    type: "はがね",
    power: 70,
  },
  {
    name: "ばくれつパンチ",
    type: "かくとう",
    power: 100,
  },
  {
    name: "はさむ",
    type: "ノーマル",
    power: 55,
  },
  {
    name: "はたきおとす",
    type: "あく",
    power: 20,
  },
  {
    name: "はたく",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "はっぱカッター",
    type: "くさ",
    power: 55,
  },
  {
    name: "はなびらのまい",
    type: "くさ",
    power: 70,
  },
  {
    name: "バブルこうせん",
    type: "みず",
    power: 65,
  },
  {
    name: "ひっかく",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "ひっさつまえば",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "ひのこ",
    type: "ほのお",
    power: 40,
  },
  {
    name: "ひみつのちから",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "ピヨピヨパンチ",
    type: "ノーマル",
    power: 70,
  },
  {
    name: "ふぶき",
    type: "こおり",
    power: 120,
  },
  {
    name: "ふみつけ",
    type: "ノーマル",
    power: 65,
  },
  {
    name: "ブラストバーン",
    type: "ほのお",
    power: 150,
  },
  {
    name: "ブレイククロー",
    type: "ノーマル",
    power: 75,
  },
  {
    name: "ブレイズキック",
    type: "ほのお",
    power: 85,
  },
  {
    name: "ヘドロこうげき",
    type: "どく",
    power: 65,
  },
  {
    name: "ヘドロばくだん",
    type: "どく",
    power: 90,
  },
  {
    name: "ポイズンテール",
    type: "どく",
    power: 50,
  },
  {
    name: "ボーンラッシュ",
    type: "じめん",
    power: 10,
  },
  {
    name: "ほしがる",
    type: "ノーマル",
    power: 60,
  },
  {
    name: "ホネこんぼう",
    type: "じめん",
    power: 65,
  },
  {
    name: "ホネブーメラン",
    type: "じめん",
    power: 50,
  },
  {
    name: "ほのおのうず",
    type: "ほのお",
    power: 15,
  },
  {
    name: "ほのおのパンチ",
    type: "ほのお",
    power: 75,
  },
  {
    name: "ボルテッカー",
    type: "でんき",
    power: 120,
  },
  {
    name: "まきつく",
    type: "ノーマル",
    power: 15,
  },
  {
    name: "マジカルリーフ",
    type: "くさ",
    power: 60,
  },
  {
    name: "マッドショット",
    type: "じめん",
    power: 55,
  },
  {
    name: "マッハパンチ",
    type: "かくとう",
    power: 40,
  },
  {
    name: "まわしげり",
    type: "かくとう",
    power: 60,
  },
  {
    name: "ミサイルばり",
    type: "むし",
    power: 14,
  },
  {
    name: "みずでっぽう",
    type: "みず",
    power: 40,
  },
  {
    name: "ミストボール",
    type: "エスパー",
    power: 70,
  },
  {
    name: "みずのはどう",
    type: "みず",
    power: 60,
  },
  {
    name: "みだれづき",
    type: "ノーマル",
    power: 15,
  },
  {
    name: "みだれひっかき",
    type: "ノーマル",
    power: 18,
  },
  {
    name: "みねうち",
    type: "ノーマル",
    power: 40,
  },
  {
    name: "メガドレイン",
    type: "くさ",
    power: 40,
  },
  {
    name: "メガトンキック",
    type: "ノーマル",
    power: 120,
  },
  {
    name: "メガトンパンチ",
    type: "ノーマル",
    power: 80,
  },
  {
    name: "メガホーン",
    type: "むし",
    power: 120,
  },
  {
    name: "やつあたり",
    type: "ノーマル",
    power: 102,
  },
  {
    name: "メタルクロー",
    type: "はがね",
    power: 50,
  },
  {
    name: "ゆめくい",
    type: "エスパー",
    power: 100,
  },
  {
    name: "ようかいえき",
    type: "どく",
    power: 40,
  },
  {
    name: "ラスターパージ",
    type: "エスパー",
    power: 70,
  },
  {
    name: "リーフブレード",
    type: "くさ",
    power: 90,
  },
  {
    name: "リベンジ",
    type: "かくとう",
    power: 60,
  },
  {
    name: "りゅうのいぶき",
    type: "ドラゴン",
    power: 60,
  },
  {
    name: "れいとうパンチ",
    type: "こおり",
    power: 75,
  },
  {
    name: "れいとうビーム",
    type: "こおり",
    power: 95,
  },
  {
    name: "れんぞくパンチ",
    type: "ノーマル",
    power: 18,
  },
  {
    name: "ロケットずつき",
    type: "ノーマル",
    power: 130,
  },
  {
    name: "ロックブラスト",
    type: "いわ",
    power: 10,
  },
  {
    name: "わるあがき",
    type: "ノーマル",
    power: 50,
  },
] as const satisfies Move[];

export type MoveName = (typeof MOVES)[number]["name"];
export type MoveType = (typeof MOVES)[number]["type"];
