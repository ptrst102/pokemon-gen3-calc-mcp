import { describe, expect, it } from "vitest";
import type { NormalDamageResult } from "@/tools/calculateDamage/types";
import { createNormalDamageOutput } from "./structuredOutputFormatter";

describe("createNormalDamageOutput", () => {
  it("通常のダメージ計算結果を構造化出力に変換する", () => {
    const result: NormalDamageResult = {
      damages: [
        85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      ],
      move: {
        name: "かえんほうしゃ",
        type: "ほのお",
        power: 95,
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
        item: {
          name: "もくたん",
          description:
            "ポケモンに　もたせると　ほのおタイプの　わざのいりょくが　あがる",
        },
        ability: {
          name: "もらいび",
          description:
            "ほのおタイプの　わざを　うけると　ダメージを　うけずに　ほのおタイプの　わざが　つよくなる",
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
      attackStat: 120,
      defenseStat: 80,
      options: {
        weather: "はれ",
      },
    };

    const output = createNormalDamageOutput(result);

    expect(output).toEqual({
      move: {
        name: "かえんほうしゃ",
        type: "ほのお",
        power: 95,
        category: "特殊",
      },
      attacker: {
        pokemonName: "リザードン",
        level: 50,
        stat: 120,
      },
      defender: {
        pokemonName: "フシギダネ",
        level: 50,
        stat: 80,
      },
      modifiers: {
        typeEffectiveness: 2,
        stab: true,
        weather: "はれ",
        ability: "もらいび",
        item: "もくたん",
      },
      damage: {
        min: 85,
        max: 100,
        rolls: [
          85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
        ],
      },
    });
  });

  it("ポケモン情報がない場合の構造化出力", () => {
    const result: NormalDamageResult = {
      damages: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
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
        statModifier: 0,
      },
      typeEffectiveness: 1,
      isStab: false,
      attackStat: 100,
      defenseStat: 100,
    };

    const output = createNormalDamageOutput(result);

    expect(output).toEqual({
      move: {
        type: "ノーマル",
        power: 100,
        category: "物理",
      },
      attacker: {
        level: 50,
        stat: 100,
      },
      defender: {
        level: 50,
        stat: 100,
      },
      modifiers: {
        typeEffectiveness: 1,
        stab: false,
      },
      damage: {
        min: 50,
        max: 60,
        rolls: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
      },
    });
  });
});

