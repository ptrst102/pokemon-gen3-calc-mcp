import { describe, expect, it } from "vitest";
import type { EvRangeDamageResult } from "@/tools/calculateDamage/types/damageCalculation";
import { formatDamageWithEvRange } from "./damageWithEvRangeFormatter";

describe("formatDamageWithEvRange", () => {
  describe("攻撃側がcalculateAllEvsの場合", () => {
    it("EVごとのダメージ結果をフォーマットできる", () => {
      const result = formatDamageWithEvRange({
        evResults: [
          {
            ev: 0,
            stat: 150,
            damages: [
              100, 100, 100, 100, 100, 100, 105, 105, 105, 105, 105, 105, 105,
              110, 110, 110,
            ],
          },
          {
            ev: 252,
            stat: 200,
            damages: [
              130, 130, 130, 130, 130, 130, 136, 136, 136, 136, 136, 136, 136,
              143, 143, 143,
            ],
          },
        ],
        isAttackerEv: true,
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
            baseStats: {
              hp: 78,
              atk: 84,
              def: 78,
              spa: 109,
              spd: 85,
              spe: 100,
            },
            abilities: ["もらいび"],
            weightkg: 90.5,
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "フシギソウ",
            types: ["くさ", "どく"],
            baseStats: { hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60 },
            abilities: ["しんりょく"],
            weightkg: 13,
          },
          statModifier: 0,
        },
        typeEffectiveness: 2.0,
        isStab: true,
        fixedStat: 100,
      } as EvRangeDamageResult);

      expect(result).toContain("=== 努力値別ダメージ計算結果 ===");
      expect(result).toContain("=== 攻撃側努力値別ダメージ ===");
      expect(result).toContain("努力値: 0 (実数値: 150)");
      expect(result).toContain("ダメージ: 100 〜 110");
      expect(result).toContain(
        "乱数範囲: [100, 100, 100, 100, 100, 100, 105, 105, 105, 105, 105, 105, 105, 110, 110, 110]",
      );
      expect(result).toContain("努力値: 252 (実数値: 200)");
      expect(result).toContain("ダメージ: 130 〜 143");
      expect(result).toContain(
        "乱数範囲: [130, 130, 130, 130, 130, 130, 136, 136, 136, 136, 136, 136, 136, 143, 143, 143]",
      );
      expect(result).toContain("最大ダメージ: 143 (努力値: 252)");
      expect(result).toContain("最小ダメージ: 100 (努力値: 0)");
    });

    it("すべてのEVパターンを表示できる", () => {
      const evResults = Array.from({ length: 64 }, (_, i) => ({
        ev: i * 4,
        stat: 150 + i,
        damages: Array(16).fill(100 + i),
      }));

      const result = formatDamageWithEvRange({
        evResults,
        isAttackerEv: true,
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
            name: "ピクシー",
            types: ["ノーマル"],
            baseStats: { hp: 35, atk: 45, def: 40, spa: 35, spd: 40, spe: 55 },
            abilities: ["にげあし", "ものひろい"],
            weightkg: 4,
          },
          statModifier: 0,
        },
        typeEffectiveness: 1.0,
        isStab: false,
        fixedStat: 100,
      } as EvRangeDamageResult);

      // 最初と最後のEVパターンが含まれていることを確認
      expect(result).toContain("努力値: 0");
      expect(result).toContain("努力値: 252");

      // 中間のEVパターンも含まれていることを確認
      expect(result).toContain("努力値: 124");
    });
  });

  describe("防御側がcalculateAllEvsの場合", () => {
    it("EVごとのダメージ結果をフォーマットできる", () => {
      const result = formatDamageWithEvRange({
        evResults: [
          {
            ev: 0,
            stat: 100,
            damages: [
              150, 150, 150, 150, 150, 150, 157, 157, 157, 157, 157, 157, 157,
              165, 165, 165,
            ],
          },
          {
            ev: 252,
            stat: 150,
            damages: [
              100, 100, 100, 100, 100, 100, 105, 105, 105, 105, 105, 105, 105,
              110, 110, 110,
            ],
          },
        ],
        isAttackerEv: false,
        move: {
          type: "かくとう",
          power: 100,
          isPhysical: true,
        },
        attacker: {
          level: 50,
          pokemon: {
            name: "カイリキー",
            types: ["かくとう"],
            baseStats: { hp: 90, atk: 130, def: 80, spa: 65, spd: 85, spe: 55 },
            abilities: ["こんじょう", "ノーガード"],
            weightkg: 130,
          },
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "カビゴン",
            types: ["ノーマル"],
            baseStats: {
              hp: 143,
              atk: 110,
              def: 65,
              spa: 55,
              spd: 65,
              spe: 55,
            },
            abilities: ["ふみん", "マイペース"],
            weightkg: 460,
          },
          statModifier: 0,
        },
        typeEffectiveness: 2.0,
        isStab: true,
        fixedStat: 150,
      } as EvRangeDamageResult);

      expect(result).toContain("=== 努力値別ダメージ計算結果 ===");
      expect(result).toContain("=== 防御側努力値別ダメージ ===");
      expect(result).toContain("努力値: 0 (実数値: 100)");
      expect(result).toContain("ダメージ: 150 〜 165");
      expect(result).toContain("努力値: 252 (実数値: 150)");
      expect(result).toContain("ダメージ: 100 〜 110");
      expect(result).toContain("最大ダメージ: 165 (努力値: 0)");
      expect(result).toContain("最小ダメージ: 100 (努力値: 252)");
    });
  });

  describe("ダメージの最大値・最小値の計算", () => {
    it("乱数を考慮した最大値・最小値を正しく計算できる", () => {
      const result = formatDamageWithEvRange({
        evResults: [
          {
            ev: 0,
            stat: 100,
            damages: [
              90, 90, 90, 90, 90, 90, 94, 94, 94, 94, 94, 94, 94, 99, 99, 99,
            ],
          },
          {
            ev: 124,
            stat: 125,
            damages: [
              110, 110, 110, 110, 110, 110, 115, 115, 115, 115, 115, 115, 115,
              121, 121, 121,
            ],
          },
          {
            ev: 252,
            stat: 150,
            damages: [
              130, 130, 130, 130, 130, 130, 136, 136, 136, 136, 136, 136, 136,
              143, 143, 143,
            ],
          },
        ],
        isAttackerEv: true,
        move: {
          type: "でんき",
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
            name: "ギャラドス",
            types: ["みず", "ひこう"],
            baseStats: {
              hp: 95,
              atk: 125,
              def: 79,
              spa: 60,
              spd: 100,
              spe: 81,
            },
            abilities: ["いかく"],
            weightkg: 235,
          },
          statModifier: 0,
        },
        typeEffectiveness: 2.0,
        isStab: false,
        fixedStat: 100,
      } as EvRangeDamageResult);

      expect(result).toContain("最大ダメージ: 143 (努力値: 252)");
      expect(result).toContain("最小ダメージ: 90 (努力値: 0)");
    });
  });

  describe("タイプ相性の表示", () => {
    it("効果抜群の場合", () => {
      const result = formatDamageWithEvRange({
        evResults: [
          {
            ev: 0,
            stat: 100,
            damages: Array(16).fill(100),
          },
        ],
        isAttackerEv: true,
        move: {
          type: "ほのお",
          power: 80,
          isPhysical: false,
        },
        attacker: {
          level: 50,
          statModifier: 0,
        },
        defender: {
          level: 50,
          pokemon: {
            name: "ナッシー",
            types: ["くさ", "エスパー"],
            baseStats: { hp: 102, atk: 60, def: 45, spa: 80, spd: 80, spe: 40 },
            abilities: ["ようりょくそ"],
            weightkg: 415.6,
          },
          statModifier: 0,
        },
        typeEffectiveness: 2.0,
        isStab: false,
        fixedStat: 100,
      } as EvRangeDamageResult);

      expect(result).toContain("タイプ相性こうかばつぐん (2倍)");
    });

    it("効果いまひとつの場合", () => {
      const result = formatDamageWithEvRange({
        evResults: [
          {
            ev: 0,
            stat: 100,
            damages: Array(16).fill(50),
          },
        ],
        isAttackerEv: true,
        move: {
          type: "みず",
          power: 80,
          isPhysical: false,
        },
        attacker: {
          level: 50,
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
        typeEffectiveness: 0.5,
        isStab: false,
        fixedStat: 100,
      } as EvRangeDamageResult);

      expect(result).toContain("タイプ相性いまひとつ (0.5倍)");
    });
  });

  it("わざ名とポケモン情報を含む場合", () => {
    const result = formatDamageWithEvRange({
      evResults: [
        {
          ev: 0,
          stat: 100,
          damages: Array(16).fill(50),
        },
      ],
      isAttackerEv: true,
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
      fixedStat: 110,
      options: {
        charge: true,
      },
    } as EvRangeDamageResult);

    expect(result).toContain("10まんボルト（タイプ：でんき いりょく：95）");
    expect(result).toContain(
      "攻撃側（Lv50サンダー とくこう実数値[努力値により変動] じしゃく）",
    );
    expect(result).toContain("防御側（Lv50メタグロス とくぼう実数値110）");
    expect(result).toContain("タイプ一致（1.5倍）");
    expect(result).toContain("じゅうでん（2倍）");
  });
});
