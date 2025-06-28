import { describe, expect, it } from "vitest";
import type { Item } from "@/data/items";
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
        { name: "もくたん", description: "" },
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
        { name: "もくたん", description: "" },
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
        { name: "しんぴのしずく", description: "" },
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
        { name: "もくたん", description: "" },
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
        { name: "こだわりハチマキ", description: "" },
        "リザードン",
        "ドラゴン",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 3, denominator: 2 });
      expect(result.moveRestricted).toBe(true);
    });

    it("でんきだま: ピカチュウの特攻2倍", () => {
      const result = calculateItemEffects(
        { name: "でんきだま", description: "" },
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
        { name: "でんきだま", description: "" },
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
        { name: "ふといホネ", description: "" },
        "カラカラ",
        "じめん",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 2, denominator: 1 });
    });

    it("ふといホネ: ガラガラの攻撃2倍", () => {
      const result = calculateItemEffects(
        { name: "ふといホネ", description: "" },
        "ガラガラ",
        "じめん",
        true,
      );
      expect(result.attackMultiplier).toEqual({ numerator: 2, denominator: 1 });
    });

    it("しんかいのキバ: パールルの特攻2倍", () => {
      const result = calculateItemEffects(
        { name: "しんかいのキバ", description: "" },
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
        { name: "こころのしずく", description: "" },
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
        { name: "こころのしずく", description: "" },
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
        { name: "メタルパウダー", description: "" },
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
        { name: "メタルパウダー", description: "" },
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
        { name: "しんかいのウロコ", description: "" },
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
        { name: "しんかいのウロコ", description: "" },
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
        { name: "こころのしずく", description: "" },
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
        { name: "こころのしずく", description: "" },
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
    const typeItems: Array<{ item: Item; type: TypeName }> = [
      { item: { name: "きせきのタネ", description: "" }, type: "くさ" },
      { item: { name: "じしゃく", description: "" }, type: "でんき" },
      { item: { name: "とけないこおり", description: "" }, type: "こおり" },
      { item: { name: "どくバリ", description: "" }, type: "どく" },
      { item: { name: "やわらかいすな", description: "" }, type: "じめん" },
      { item: { name: "かたいいし", description: "" }, type: "いわ" },
      { item: { name: "ぎんのこな", description: "" }, type: "むし" },
      { item: { name: "のろいのおふだ", description: "" }, type: "ゴースト" },
      { item: { name: "りゅうのキバ", description: "" }, type: "ドラゴン" },
      { item: { name: "くろいメガネ", description: "" }, type: "あく" },
      { item: { name: "メタルコート", description: "" }, type: "はがね" },
      { item: { name: "シルクのスカーフ", description: "" }, type: "ノーマル" },
      { item: { name: "くろおび", description: "" }, type: "かくとう" },
      { item: { name: "するどいくちばし", description: "" }, type: "ひこう" },
      { item: { name: "まがったスプーン", description: "" }, type: "エスパー" },
    ];

    typeItems.forEach(({ item, type }) => {
      it(`${item.name}: ${type}タイプの物理技で攻撃1.1倍`, () => {
        const result = calculateItemEffects(item, undefined, type, true);
        expect(result.attackMultiplier).toEqual({
          numerator: 11,
          denominator: 10,
        });
      });

      it(`${item.name}: ${type}タイプの特殊技で特攻1.1倍`, () => {
        const result = calculateItemEffects(item, undefined, type, false);
        expect(result.specialAttackMultiplier).toEqual({
          numerator: 11,
          denominator: 10,
        });
      });
    });
  });
});
