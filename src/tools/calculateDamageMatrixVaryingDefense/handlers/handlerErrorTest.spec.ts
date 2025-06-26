import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingDefenseHandler } from "./handler";

describe("calculateDamageMatrixVaryingDefenseHandler エラーハンドリング", () => {
  it("無効な入力に対して適切なエラーメッセージを返す", async () => {
    const invalidInput = {
      move: "存在しないわざ",
      attacker: {
        stat: {
          iv: 31,
          ev: 252,
        },
      },
      defender: {
        pokemonName: "ピカチュウ",
        isPhysicalDefense: true,
        stat: {
          iv: 31,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingDefenseHandler(invalidInput);
    expect(response.content[0].type).toBe("text");
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBeDefined();
  });

  it("存在しないポケモン名でエラーを返す", async () => {
    const invalidInput = {
      move: "10まんボルト",
      attacker: {
        pokemonName: "存在しないポケモン",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
      defender: {
        pokemonName: "ピカチュウ",
        isPhysicalDefense: false,
        stat: {
          iv: 31,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingDefenseHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toContain(
      "ポケモン「存在しないポケモン」が見つかりません",
    );
  });

  it("存在しないもちものでエラーを返す", async () => {
    const invalidInput = {
      move: "サイコキネシス",
      attacker: {
        pokemonName: "フーディン",
        item: "存在しないもちもの",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
      defender: {
        pokemonName: "ハピナス",
        isPhysicalDefense: false,
        stat: {
          iv: 31,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingDefenseHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toContain(
      "もちもの「存在しないもちもの」が見つかりません",
    );
  });

  it("必須フィールドが欠けている場合にバリデーションエラーを返す", async () => {
    const invalidInput = {
      move: "はかいこうせん",
      attacker: {
        stat: {
          iv: 31,
          ev: 252,
        },
      },
      // defenderが欠けている
    };

    const response =
      await calculateDamageMatrixVaryingDefenseHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBe("入力値が不正です");
    expect(parsed.details).toBeDefined();
    expect(Array.isArray(parsed.details)).toBe(true);
  });

  it("努力値が範囲外の場合にエラーを返す", async () => {
    const invalidInput = {
      move: "かえんほうしゃ",
      attacker: {
        pokemonName: "リザードン",
        stat: {
          iv: 31,
          ev: 300, // 252を超えている
        },
      },
      defender: {
        pokemonName: "フシギダネ",
        isPhysicalDefense: false,
        stat: {
          iv: 31,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingDefenseHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBe("入力値が不正です");
    expect(parsed.details).toBeDefined();
    expect(
      parsed.details.some((d: { message: string }) =>
        d.message.includes("252"),
      ),
    ).toBe(true);
  });
});
