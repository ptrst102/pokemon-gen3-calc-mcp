import { describe, expect, it } from "vitest";
import type { ItemName } from "@/data/items";
import type { TypeName } from "@/types";
import { calculateItemEffects } from "./itemEffects";

describe("calculateItemEffects", () => {
  describe("アイテムなしの場合", () => {
    it("デフォルト値を返す", () => {
      const result = calculateItemEffects(
        undefined,
        "フシギダネ",
        "くさ",
        true,
      );
      expect(result).toEqual({
        attackMultiplier: { numerator: 1, denominator: 1 },
        specialAttackMultiplier: { numerator: 1, denominator: 1 },
        defenseMultiplier: { numerator: 1, denominator: 1 },
        specialDefenseMultiplier: { numerator: 1, denominator: 1 },
        moveTypeMultiplier: { numerator: 1, denominator: 1 },
        moveRestricted: false,
      });
    });
  });

  describe("タイプ強化アイテム", () => {
    it("もくたん: ほのおタイプの物理技で攻撃1.1倍", () => {
      const result = calculateItemEffects(
        "もくたん",
        "リザードン",
        "ほのお",
        true,
      );
      expect(result.attackMultiplier).toEqual({
        numerator: 11,
        denominator: 10,
      });
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 1,
        denominator: 1,
      });
    });

    it("もくたん: ほのおタイプの特殊技で特攻1.1倍", () => {
      const result = calculateItemEffects(
        "もくたん",
        "リザードン",
        "ほのお",
        false,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 1, denominator: 1 });
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 11,
        denominator: 10,
      });
    });

    it("しんぴのしずく: みずタイプの技で効果発動", () => {
      const result = calculateItemEffects(
        "しんぴのしずく",
        "カメックス",
        "みず",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 11,
        denominator: 10,
      });
    });

    it("タイプ不一致の場合は効果なし", () => {
      const result = calculateItemEffects(
        "もくたん",
        "フシギダネ",
        "くさ",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 1, denominator: 1 });
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 1,
        denominator: 1,
      });
    });
  });

  describe("特殊効果アイテム", () => {
    it("こだわりハチマキ: 攻撃1.5倍、技固定", () => {
      const result = calculateItemEffects(
        "こだわりハチマキ",
        "リザードン",
        "ドラゴン",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 3, denominator: 2 });
      expect(result.moveRestricted).toBe(true);
    });

    it("でんきだま: ピカチュウの特攻2倍", () => {
      const result = calculateItemEffects(
        "でんきだま",
        "ピカチュウ",
        "でんき",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 2,
        denominator: 1,
      });
    });

    it("でんきだま: ピカチュウ以外には効果なし", () => {
      const result = calculateItemEffects(
        "でんきだま",
        "ライチュウ",
        "でんき",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 1,
        denominator: 1,
      });
    });

    it("ふといホネ: カラカラの攻撃2倍", () => {
      const result = calculateItemEffects(
        "ふといホネ",
        "カラカラ",
        "じめん",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 2, denominator: 1 });
    });

    it("ふといホネ: ガラガラの攻撃2倍", () => {
      const result = calculateItemEffects(
        "ふといホネ",
        "ガラガラ",
        "じめん",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 2, denominator: 1 });
    });

    it("しんかいのキバ: パールルの特攻2倍", () => {
      const result = calculateItemEffects(
        "しんかいのキバ",
        "パールル",
        "みず",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 2,
        denominator: 1,
      });
    });

    it("こころのしずく: ラティオスの特攻1.5倍", () => {
      const result = calculateItemEffects(
        "こころのしずく",
        "ラティオス",
        "エスパー",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
    });

    it("こころのしずく: ラティアスの特攻1.5倍", () => {
      const result = calculateItemEffects(
        "こころのしずく",
        "ラティアス",
        "エスパー",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
    });
  });

  describe("防御系アイテム", () => {
    it("メタルパウダー: メタモンの防御2倍", () => {
      const result = calculateItemEffects(
        "メタルパウダー",
        "メタモン",
        "ノーマル",
        true,
      );
      expect(result.defenseMultiplier).toEqual({
        numerator: 2,
        denominator: 1,
      });
    });

    it("メタルパウダー: メタモン以外には効果なし", () => {
      const result = calculateItemEffects(
        "メタルパウダー",
        "ピカチュウ",
        "でんき",
        true,
      );
      expect(result.defenseMultiplier).toEqual({
        numerator: 1,
        denominator: 1,
      });
    });

    it("しんかいのウロコ: パールルの特防2倍", () => {
      const result = calculateItemEffects(
        "しんかいのウロコ",
        "パールル",
        "みず",
        false,
      );
      expect(result.specialDefenseMultiplier).toEqual({
        numerator: 2,
        denominator: 1,
      });
    });

    it("しんかいのウロコ: パールル以外には効果なし", () => {
      const result = calculateItemEffects(
        "しんかいのウロコ",
        "ハンテール",
        "みず",
        false,
      );
      expect(result.specialDefenseMultiplier).toEqual({
        numerator: 1,
        denominator: 1,
      });
    });

    it("こころのしずく: ラティオスの特攻と特防1.5倍", () => {
      const result = calculateItemEffects(
        "こころのしずく",
        "ラティオス",
        "エスパー",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
      expect(result.specialDefenseMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
    });

    it("こころのしずく: ラティアスの特攻と特防1.5倍", () => {
      const result = calculateItemEffects(
        "こころのしずく",
        "ラティアス",
        "ドラゴン",
        false,
      );
      expect(result.specialAttackMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
      expect(result.specialDefenseMultiplier).toEqual({
        numerator: 3,
        denominator: 2,
      });
    });
  });

  describe("複数のタイプ強化アイテムのテスト", () => {
    const typeItems: Array<{ item: ItemName; type: TypeName }> = [
      { item: "きせきのタネ", type: "くさ" },
      { item: "じしゃく", type: "でんき" },
      { item: "とけないこおり", type: "こおり" },
      { item: "どくバリ", type: "どく" },
      { item: "やわらかいすな", type: "じめん" },
      { item: "かたいいし", type: "いわ" },
      { item: "ぎんのこな", type: "むし" },
      { item: "のろいのおふだ", type: "ゴースト" },
      { item: "りゅうのキバ", type: "ドラゴン" },
      { item: "くろいメガネ", type: "あく" },
      { item: "メタルコート", type: "はがね" },
      { item: "シルクのスカーフ", type: "ノーマル" },
      { item: "くろおび", type: "かくとう" },
      { item: "するどいくちばし", type: "ひこう" },
      { item: "まがったスプーン", type: "エスパー" },
    ];

    typeItems.forEach(({ item, type }) => {
      it(`${item}: ${type}タイプの物理技で攻撃1.1倍`, () => {
        const result = calculateItemEffects(item, undefined, type, true);
        expect(result.attackMultiplier).toEqual({
          numerator: 11,
          denominator: 10,
        });
      });

      it(`${item}: ${type}タイプの特殊技で特攻1.1倍`, () => {
        const result = calculateItemEffects(item, undefined, type, false);
        expect(result.specialAttackMultiplier).toEqual({
          numerator: 11,
          denominator: 10,
        });
      });
    });
  });
});
