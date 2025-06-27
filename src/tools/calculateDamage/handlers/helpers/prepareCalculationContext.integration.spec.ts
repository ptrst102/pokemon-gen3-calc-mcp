import { describe, expect, it } from "vitest";
import { calculateDamageHandler } from "@/tools/calculateDamage";

describe("めざめるパワー統合テスト", () => {
  it("めざめるパワーのタイプと威力が個体値から正しく計算される", async () => {
    const args = {
      move: {
        name: "めざめるパワー",
        type: "ノーマル",
        power: 70,
        hiddenPowerIVs: {
          hp: 31,
          attack: 30,
          defense: 30,
          specialAttack: 31,
          specialDefense: 31,
          speed: 31,
        },
      },
      attacker: {
        pokemonName: "サンダース",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
        statModifier: 0,
      },
      defender: {
        pokemonName: "ギャラドス",
        level: 50,
        stat: {
          iv: 31,
          ev: 0,
          natureModifier: "neutral",
        },
        statModifier: 0,
      },
      options: {},
    };

    const response = await calculateDamageHandler(args);

    expect(response).toBeDefined();
    expect(response.content).toBeDefined();
    expect(response.content[0]).toBeDefined();
    expect(response.content[0].type).toBe("text");

    const result = JSON.parse(response.content[0].text);

    // こおりタイプで威力70になることを確認
    expect(result.move.type).toBe("こおり");
    expect(result.move.power).toBe(70);
    // こおりタイプで特殊技として扱われる
    expect(result.move.category).toBe("特殊");
    // ギャラドスに対して等倍（みず0.5倍×ひこう2倍＝1倍）
    expect(result.modifiers.typeEffectiveness).toBe(1);
  });

  it("威力が正しく計算される", async () => {
    const args = {
      move: {
        name: "めざめるパワー",
        type: "ノーマル",
        power: 70,
        hiddenPowerIVs: {
          hp: 31,
          attack: 31,
          defense: 31,
          specialAttack: 0,
          specialDefense: 31,
          speed: 31,
        },
      },
      attacker: {
        pokemonName: "フーディン",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
        statModifier: 0,
      },
      defender: {
        pokemonName: "ハピナス",
        level: 50,
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "up",
        },
        statModifier: 0,
      },
      options: {},
    };

    const response = await calculateDamageHandler(args);
    const result = JSON.parse(response.content[0].text);

    // 威力59ででんきタイプになることを確認
    expect(result.move.power).toBe(59);
    expect(result.move.type).toBe("でんき");
    // でんきタイプは特殊技
    expect(result.move.category).toBe("特殊");
    // ハピナスに対して等倍
    expect(result.modifiers.typeEffectiveness).toBe(1);
  });
});
