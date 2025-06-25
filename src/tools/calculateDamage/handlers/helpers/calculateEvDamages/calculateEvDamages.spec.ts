import { describe, expect, it } from "vitest";
import { calculateDamageHandler } from "@/tools/calculateDamage/handlers/handler";

describe("じばく・だいばくはつの防御半減", () => {
  it("じばくで防御が半減される", async () => {
    // 通常のわざでのダメージ計算
    const normalInput = {
      move: "とっしん",
      attacker: {
        level: 50,
        pokemonName: "マルマイン",
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: { value: 200 },
        statModifier: 0,
      },
      options: {},
    };

    const normalResult = await calculateDamageHandler(normalInput);
    const normalDamageMatch =
      normalResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
    const normalMinDamage = Number(normalDamageMatch?.[1]);

    // じばくでのダメージ計算（防御半減）
    const selfDestructInput = {
      move: "じばく",
      attacker: {
        level: 50,
        pokemonName: "マルマイン",
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: { value: 200 },
        statModifier: 0,
      },
      options: {},
    };

    const selfDestructResult = await calculateDamageHandler(selfDestructInput);
    const selfDestructDamageMatch =
      selfDestructResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
    const selfDestructMinDamage = Number(selfDestructDamageMatch?.[1]);

    // じばくは威力200で防御半減なので、とっしん（威力90）の2倍以上のダメージになるはず
    expect(selfDestructMinDamage).toBeGreaterThan(normalMinDamage * 2);
  });

  it("だいばくはつで防御が半減される", async () => {
    const explosionInput = {
      move: "だいばくはつ",
      attacker: {
        level: 50,
        pokemonName: "マルマイン",
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "カビゴン",
        stat: { value: 200 },
        statModifier: 0,
      },
      options: {},
    };

    const explosionResult = await calculateDamageHandler(explosionInput);
    const explosionDamageMatch =
      explosionResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
    const explosionMinDamage = Number(explosionDamageMatch?.[1]);

    // だいばくはつは威力250で防御半減なので大きなダメージになるはず
    expect(explosionMinDamage).toBeGreaterThan(60);
  });

  it("他のわざでは防御が半減されない", async () => {
    const hyperBeamInput = {
      move: "はかいこうせん",
      attacker: {
        level: 50,
        pokemonName: "カビゴン",
        stat: { value: 150 },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: "ハガネール",
        stat: { value: 400 },
        statModifier: 0,
      },
      options: {},
    };

    const hyperBeamResult = await calculateDamageHandler(hyperBeamInput);
    const hyperBeamDamageMatch =
      hyperBeamResult.content[0].text.match(/ダメージ: (\d+) 〜 (\d+)/);
    const hyperBeamMaxDamage = Number(hyperBeamDamageMatch?.[2]);

    // 防御が高いため、ダメージは少なめになるはず
    expect(hyperBeamMaxDamage).toBeLessThan(50);
  });
});
