import { describe, expect, it } from "vitest";
import { calculateDamageMatrixVaryingAttackHandler } from "./handler";

describe("calculateDamageMatrixVaryingAttackHandler エラーハンドリング", () => {
  it("無効な入力に対して適切なエラーメッセージを返す", async () => {
    const invalidInput = {
      move: "存在しないわざ",
      attacker: {
        pokemonName: "ピカチュウ",
        isPhysicalAttack: false,
        stat: {
          iv: 31,
        },
      },
      defender: {
        stat: {
          iv: 31,
          ev: 252,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingAttackHandler(invalidInput);
    expect(response.content[0].type).toBe("text");
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBeDefined();
  });

  it("存在しないポケモン名でエラーを返す", async () => {
    const invalidInput = {
      move: "10まんボルト",
      attacker: {
        pokemonName: "ピカチュウ",
        isPhysicalAttack: false,
        stat: {
          iv: 31,
        },
      },
      defender: {
        pokemonName: "存在しないポケモン",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingAttackHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toContain(
      "ポケモン「存在しないポケモン」が見つかりません",
    );
  });

  it("存在しないとくせいでエラーを返す", async () => {
    const invalidInput = {
      move: "かえんほうしゃ",
      attacker: {
        pokemonName: "リザードン",
        ability: "存在しないとくせい",
        isPhysicalAttack: false,
        stat: {
          iv: 31,
        },
      },
      defender: {
        pokemonName: "フシギダネ",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingAttackHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toContain(
      "とくせい「存在しないとくせい」が見つかりません",
    );
  });

  it("必須フィールドが欠けている場合にバリデーションエラーを返す", async () => {
    const invalidInput = {
      move: "サイコキネシス",
      // attackerが欠けている
      defender: {
        pokemonName: "ハピナス",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingAttackHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBe("入力値が不正です");
    expect(parsed.details).toBeDefined();
    expect(Array.isArray(parsed.details)).toBe(true);
  });

  it("個体値が範囲外の場合にエラーを返す", async () => {
    const invalidInput = {
      move: "なみのり",
      attacker: {
        pokemonName: "ラプラス",
        isPhysicalAttack: false,
        stat: {
          iv: 35, // 31を超えている
        },
      },
      defender: {
        pokemonName: "リザードン",
        stat: {
          iv: 31,
          ev: 252,
        },
      },
    };

    const response =
      await calculateDamageMatrixVaryingAttackHandler(invalidInput);
    const text = response.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.error).toBe("入力値が不正です");
    expect(parsed.details).toBeDefined();
    expect(
      parsed.details.some((d: { message: string }) => d.message.includes("31")),
    ).toBe(true);
  });
});
