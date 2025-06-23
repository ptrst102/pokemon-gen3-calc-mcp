import { describe, expect, it } from "vitest";
import type { NormalDamageResult } from "@/tools/calculateDamage/types/damageCalculation";
import { formatDamageResult } from "./damageFormatter";

describe("formatDamageResult", () => {
  it("ダメージ結果を適切にフォーマットする", () => {
    const result = formatDamageResult({
      damages: [
        85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      ],
      move: {
        type: "ほのお",
        power: 80,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        pokemon: {
          name: "リザードン",
          types: ["ほのお", "ひこう"],
          baseStats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 },
          abilities: ["もらいび"],
          weightkg: 90.5,
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: {
          name: "フシギダネ",
          types: ["くさ", "どく"],
          baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
          abilities: ["しんりょく"],
          weightkg: 6.9,
        },
        statModifier: 0,
      },
      typeEffectiveness: 2,
      isStab: true,
      attackStat: 100,
      defenseStat: 100,
    } as NormalDamageResult);

    expect(result).toContain("ダメージ: 85 〜 100");
    expect(result).toContain("タイプ相性こうかばつぐん (2倍)");
    expect(result).toContain("わざ（タイプ：ほのお いりょく：80）");
    expect(result).toContain("攻撃側（Lv50リザードン とくこう実数値100）");
    expect(result).toContain("防御側（Lv50フシギダネ とくぼう実数値100）");
    expect(result).toContain("タイプ一致（1.5倍）");
  });

  it("効果いまひとつの場合のフォーマット", () => {
    const result = formatDamageResult({
      damages: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
      move: {
        type: "みず",
        power: 90,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: {
          name: "カメックス",
          types: ["みず"],
          baseStats: { hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78 },
          abilities: ["げきりゅう"],
          weightkg: 85.5,
        },
        statModifier: 0,
      },
      typeEffectiveness: 0.5,
      isStab: false,
      attackStat: 100,
      defenseStat: 100,
    } as NormalDamageResult);

    expect(result).toContain("タイプ相性いまひとつ (0.5倍)");
  });

  it("効果なしの場合のフォーマット", () => {
    const result = formatDamageResult({
      damages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      move: {
        type: "ノーマル",
        power: 100,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: {
          name: "ゲンガー",
          types: ["ゴースト", "どく"],
          baseStats: { hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110 },
          abilities: ["ふゆう"],
          weightkg: 40.5,
        },
        statModifier: 0,
      },
      typeEffectiveness: 0,
      isStab: false,
      attackStat: 100,
      defenseStat: 100,
    } as NormalDamageResult);

    expect(result).toContain("タイプ相性こうかなし (0倍)");
    expect(result).toContain("ダメージ: 0");
  });

  it("複合タイプの場合のフォーマット", () => {
    const result = formatDamageResult({
      damages: [
        170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183,
        184, 185,
      ],
      move: {
        type: "みず",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: {
          name: "バクーダ",
          types: ["ほのお", "じめん"],
          baseStats: { hp: 70, atk: 100, def: 70, spa: 105, spd: 75, spe: 40 },
          abilities: ["マグマのよろい", "どんかん"],
          weightkg: 220,
        },
        statModifier: 0,
      },
      typeEffectiveness: 4,
      isStab: false,
      attackStat: 100,
      defenseStat: 100,
    } as NormalDamageResult);

    expect(result).toContain("バクーダ");
    expect(result).toContain("タイプ相性こうかばつぐん (4倍)");
  });

  it("わざ名がある場合のフォーマット", () => {
    const result = formatDamageResult({
      damages: [
        85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      ],
      move: {
        name: "10まんボルト",
        type: "でんき",
        power: 95,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        pokemon: {
          name: "サンダー",
          types: ["でんき", "ひこう"],
          baseStats: { hp: 90, atk: 85, def: 85, spa: 125, spd: 90, spe: 100 },
          abilities: ["プレッシャー"],
          weightkg: 52.6,
        },
        item: {
          name: "じしゃく",
          description:
            "ポケモンに　もたせると　でんきタイプの　わざのいりょくが　あがる",
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemon: {
          name: "メタグロス",
          types: ["はがね", "エスパー"],
          baseStats: { hp: 80, atk: 135, def: 130, spa: 95, spd: 90, spe: 70 },
          abilities: ["クリアボディ"],
          weightkg: 550,
        },
        statModifier: 0,
      },
      typeEffectiveness: 1,
      isStab: true,
      attackStat: 145,
      defenseStat: 110,
      options: {
        charge: true,
      },
    } as NormalDamageResult);

    expect(result).toBe(`=== ダメージ計算結果 ===

ダメージ: 85 〜 100
乱数範囲: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]

=== 計算詳細 ===
10まんボルト（タイプ：でんき いりょく：95）
攻撃側（Lv50サンダー とくこう実数値145 じしゃく）
防御側（Lv50メタグロス とくぼう実数値110）
その他：タイプ一致（1.5倍） タイプ相性通常 (1倍) じゅうでん（2倍）`);
  });
});
