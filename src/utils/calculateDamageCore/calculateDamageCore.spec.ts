import { describe, expect, it } from "vitest";
import type { DamageCoreParams } from "./calculateDamageCore";
import { calculateDamageCore } from "./calculateDamageCore";

describe("calculateDamageCore", () => {
  it("基本的なダメージ計算", () => {
    const params: DamageCoreParams = {
      move: {
        type: "ノーマル",
        power: 100,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        attackStat: 100,
        types: ["ノーマル"],
      },
      defender: {
        defenseStat: 100,
        types: ["ノーマル"],
      },
      options: {},
    };

    const result = calculateDamageCore(params);
    expect(result).toHaveLength(16);
    expect(result[0]).toBe(58); // タイプ一致1.5倍
    expect(result[15]).toBe(69);
  });

  it("タイプ相性を考慮", () => {
    const params: DamageCoreParams = {
      move: {
        type: "かくとう",
        power: 100,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        attackStat: 100,
      },
      defender: {
        defenseStat: 100,
        types: ["ノーマル"],
      },
      options: {},
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(78); // タイプ相性2倍
  });

  it("天候効果を適用", () => {
    const params: DamageCoreParams = {
      move: {
        type: "ほのお",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        attackStat: 100,
      },
      defender: {
        defenseStat: 100,
        types: ["くさ"],
      },
      options: {
        weather: "はれ",
      },
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(117); // タイプ相性2倍 × 天候1.5倍
  });

  it("じばく・だいばくはつの防御半減処理", () => {
    const params: DamageCoreParams = {
      move: {
        name: "じばく",
        type: "ノーマル",
        power: 200,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        attackStat: 100,
        types: ["ノーマル"],
      },
      defender: {
        defenseStat: 100,
        types: ["いわ"],
      },
      options: {},
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(113); // 防御半減、タイプ一致1.5倍、タイプ相性0.5倍
  });

  it("チャージ効果を適用", () => {
    const params: DamageCoreParams = {
      move: {
        type: "でんき",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        attackStat: 100,
      },
      defender: {
        defenseStat: 100,
        types: ["みず"],
      },
      options: {
        charge: true,
      },
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(156); // タイプ相性2倍 × チャージ2倍
  });

  it("壁効果を適用", () => {
    const params: DamageCoreParams = {
      move: {
        type: "かくとう",
        power: 100,
        isPhysical: true,
      },
      attacker: {
        level: 50,
        attackStat: 100,
      },
      defender: {
        defenseStat: 100,
        types: ["ノーマル"],
      },
      options: {
        reflect: true,
      },
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(39); // タイプ相性2倍 × 壁0.5倍
  });

  it("スポーツ効果を適用", () => {
    const params: DamageCoreParams = {
      move: {
        type: "でんき",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        attackStat: 100,
      },
      defender: {
        defenseStat: 100,
        types: ["ノーマル"],
      },
      options: {
        mudSport: true,
      },
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(19); // スポーツ0.5倍
  });

  it("とくせい効果を適用", () => {
    const params: DamageCoreParams = {
      move: {
        type: "みず",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        attackStat: 100,
        ability: { name: "げきりゅう" },
        abilityActive: true,
      },
      defender: {
        defenseStat: 100,
        types: ["ほのお"],
      },
      options: {},
    };

    const result = calculateDamageCore(params);
    expect(result[0]).toBe(117); // タイプ相性2倍 × げきりゅう1.5倍
  });

  it("すべての効果を組み合わせた計算", () => {
    const params: DamageCoreParams = {
      move: {
        type: "みず",
        power: 100,
        isPhysical: false,
      },
      attacker: {
        level: 50,
        attackStat: 100,
        types: ["みず"],
        ability: { name: "げきりゅう" },
        abilityActive: true,
      },
      defender: {
        defenseStat: 100,
        types: ["ほのお"],
        ability: { name: "あついしぼう" },
        abilityActive: false,
      },
      options: {
        weather: "あめ",
        lightScreen: false,
      },
    };

    const result = calculateDamageCore(params);
    // タイプ一致1.5倍 × タイプ相性2倍 × 天候1.5倍 × げきりゅう1.5倍
    expect(result[0]).toBe(263);
  });
});
