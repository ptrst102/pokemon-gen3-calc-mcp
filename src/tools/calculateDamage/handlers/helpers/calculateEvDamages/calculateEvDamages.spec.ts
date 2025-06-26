import { describe, expect, it } from "vitest";
import {
  isNormalDamageOutput,
  type StructuredOutput,
} from "@/tools/calculateDamage/handlers/formatters/structuredOutputFormatter";
import { calculateDamageHandler } from "@/tools/calculateDamage/handlers/handler";
import { parseResponse } from "@/utils/parseResponse";

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
    const normalOutput = parseResponse<StructuredOutput>(normalResult);
    const normalMinDamage = isNormalDamageOutput(normalOutput)
      ? normalOutput.damage.min
      : 0;

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
    const selfDestructOutput =
      parseResponse<StructuredOutput>(selfDestructResult);
    const selfDestructMinDamage = isNormalDamageOutput(selfDestructOutput)
      ? selfDestructOutput.damage.min
      : 0;

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
    const explosionOutput = parseResponse<StructuredOutput>(explosionResult);
    const explosionMinDamage = isNormalDamageOutput(explosionOutput)
      ? explosionOutput.damage.min
      : 0;

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
    const hyperBeamOutput = parseResponse<StructuredOutput>(hyperBeamResult);
    const hyperBeamMaxDamage = isNormalDamageOutput(hyperBeamOutput)
      ? hyperBeamOutput.damage.max
      : 0;

    // 防御が高いため、ダメージは少なめになるはず
    expect(hyperBeamMaxDamage).toBeLessThan(50);
  });
});
