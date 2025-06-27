import { describe, expect, it } from "vitest";
import {
  isNormalDamageOutput,
  type StructuredOutput,
} from "@/tools/calculateDamage/handlers/formatters/structuredOutputFormatter";
import { calculateDamageHandler } from "@/tools/calculateDamage/handlers/handler";
import { parseResponse } from "@/utils/parseResponse";

describe("けたぐりの威力計算", () => {
  // 基本のダメージ計算テストのヘルパー関数
  const calculateLowKickDamage = async (
    defenderName: string,
    expectedMinDamage: number,
    expectedMaxDamage: number,
  ) => {
    const result = await calculateDamageHandler({
      move: "けたぐり",
      attacker: {
        level: 50,
        pokemonName: "ワンリキー",
        stat: {
          iv: 31,
          ev: 252,
          natureModifier: "neutral",
        },
        statModifier: 0,
      },
      defender: {
        level: 50,
        pokemonName: defenderName,
        stat: {
          iv: 31,
          ev: 4,
          natureModifier: "neutral",
        },
        statModifier: 0,
      },
      options: {},
    });

    const output = parseResponse<StructuredOutput>(result);
    if (isNormalDamageOutput(output)) {
      expect(output.damage.min).toBe(expectedMinDamage);
      expect(output.damage.max).toBe(expectedMaxDamage);
    } else {
      throw new Error("Expected normal damage output");
    }
  };

  describe("威力20（10kg以下）", () => {
    it("ピカチュウ（6.0kg）の場合", async () => {
      // 威力20 × タイプ一致1.5 × タイプ相性1.0 = 30相当
      await calculateLowKickDamage("ピカチュウ", 26, 31);
    });

    it("キャタピー（2.9kg）の場合", async () => {
      // 威力20 × タイプ一致1.5 × タイプ相性1.0 = 30相当
      await calculateLowKickDamage("キャタピー", 13, 16);
    });
  });

  describe("威力40（10.1kg〜25kg）", () => {
    it("フシギソウ（13.0kg）の場合", async () => {
      // 威力40 × タイプ一致1.5 × タイプ相性0.5（くさ） = 30相当
      await calculateLowKickDamage("フシギソウ", 17, 21);
    });

    it("リザード（19.0kg）の場合", async () => {
      // 威力40 × タイプ一致1.5 × タイプ相性1.0 = 60相当
      await calculateLowKickDamage("リザード", 39, 46);
    });
  });

  describe("威力60（25.1kg〜50kg）", () => {
    it("ピジョン（30.0kg）の場合", async () => {
      // 威力60 × タイプ一致1.5 × タイプ相性1.0 = 90相当
      await calculateLowKickDamage("ピジョン", 59, 70);
    });

    it("アブソル（47.0kg）の場合", async () => {
      // 威力60 × タイプ一致1.5 × タイプ相性2.0（あく） = 180相当
      await calculateLowKickDamage("アブソル", 113, 134);
    });
  });

  describe("威力80（50.1kg〜100kg）", () => {
    it("ゴルダック（76.6kg）の場合", async () => {
      // 威力80 × タイプ一致1.5 × タイプ相性1.0 = 120相当
      await calculateLowKickDamage("ゴルダック", 61, 72);
    });

    it("リザードン（90.5kg）の場合", async () => {
      // 威力80 × タイプ一致1.5 × タイプ相性0.5（リザードンはひこうタイプ） = 60相当
      await calculateLowKickDamage("リザードン", 30, 36);
    });
  });

  describe("威力100（100.1kg〜200kg）", () => {
    it("ゴローン（105.0kg）の場合", async () => {
      // 威力100 × タイプ一致1.5 × タイプ相性2.0（いわ/じめんタイプ） = 300相当
      await calculateLowKickDamage("ゴローン", 112, 132);
    });

    it("カイリキー（130.0kg）の場合", async () => {
      // 威力100 × タイプ一致1.5 × タイプ相性1.0 = 150相当
      await calculateLowKickDamage("カイリキー", 74, 88);
    });
  });

  describe("威力120（200.1kg以上）", () => {
    it("バンギラス（202.0kg）の場合", async () => {
      // 威力120 × タイプ一致1.5 × タイプ相性4.0（いわ/あくタイプ） = 720相当
      await calculateLowKickDamage("バンギラス", 278, 328);
    });

    it("カビゴン（460.0kg）の場合", async () => {
      // 威力120 × タイプ一致1.5 × タイプ相性2.0（ノーマル） = 360相当
      await calculateLowKickDamage("カビゴン", 210, 248);
    });
  });
});
