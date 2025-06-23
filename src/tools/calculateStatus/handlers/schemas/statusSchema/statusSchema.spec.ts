import { describe, expect, it } from "vitest";
import { calculateStatusInputSchema } from "./statusSchema";

describe("calculateStatusInputSchema", () => {
  describe("バリデーション", () => {
    describe("個体値", () => {
      it("正常な個体値を受け入れること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        const result = calculateStatusInputSchema.parse(input);
        expect(result.ivs).toEqual(input.ivs);
      });

      it("個体値が31を超える場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: 32, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow();
      });

      it("個体値が負の場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: -1, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow();
      });
    });

    describe("努力値", () => {
      it("正常な努力値を受け入れること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 252, atk: 0, def: 252, spa: 6, spd: 0, spe: 0 },
        };

        const result = calculateStatusInputSchema.parse(input);
        expect(result.evs).toEqual(input.evs);
      });

      it("努力値の合計が510を超える場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 252, atk: 252, def: 252, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow(
          "努力値の合計は510以下でなければなりません",
        );
      });

      it("個別の努力値が252を超える場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 50,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 253, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow();
      });
    });

    describe("レベル", () => {
      it("レベル1〜100を受け入れること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 1,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        const result = calculateStatusInputSchema.parse(input);
        expect(result.level).toBe(1);

        const input100 = { ...input, level: 100 };
        const result100 = calculateStatusInputSchema.parse(input100);
        expect(result100.level).toBe(100);
      });

      it("レベルが0以下の場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 0,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow();
      });

      it("レベルが100を超える場合エラーになること", () => {
        const input = {
          pokemonName: "フシギダネ",
          level: 101,
          nature: "まじめ",
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        };

        expect(() => calculateStatusInputSchema.parse(input)).toThrow();
      });
    });
  });

  describe("トランスフォーム", () => {
    it("ポケモン名からポケモンオブジェクトに変換されること", () => {
      const input = {
        pokemonName: "フシギダネ",
        level: 50,
        nature: "まじめ",
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      };

      const result = calculateStatusInputSchema.parse(input);
      expect(result.pokemon).toBeDefined();
      expect(result.pokemon.name).toBe("フシギダネ");
      expect(result.pokemon.baseStats).toBeDefined();
    });

    it("存在しないポケモン名でエラーになること", () => {
      const input = {
        pokemonName: "存在しないポケモン",
        level: 50,
        nature: "まじめ",
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      };

      expect(() => calculateStatusInputSchema.parse(input)).toThrow(
        "ポケモン「存在しないポケモン」が見つかりません",
      );
    });

    it("せいかく名からせいかくオブジェクトに変換されること", () => {
      const input = {
        pokemonName: "フシギダネ",
        level: 50,
        nature: "いじっぱり",
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      };

      const result = calculateStatusInputSchema.parse(input);
      expect(result.nature).toBeDefined();
      expect(result.nature.name).toBe("いじっぱり");
    });

    it("存在しないせいかく名でエラーになること", () => {
      const input = {
        pokemonName: "フシギダネ",
        level: 50,
        nature: "存在しないせいかく",
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      };

      expect(() => calculateStatusInputSchema.parse(input)).toThrow(
        "せいかく「存在しないせいかく」が見つかりません",
      );
    });
  });
});
