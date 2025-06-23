import type { EvRangeDamageResult } from "@/tools/calculateDamage/types/damageCalculation";
import { getTypeEffectivenessText } from "@/utils/getTypeEffectivenessText";

export const formatDamageWithEvRange = (
  result: EvRangeDamageResult,
): string => {
  const {
    evResults,
    isAttackerEv,
    move,
    attacker,
    defender,
    typeEffectiveness,
    isStab,
    fixedStat,
    options,
  } = result;
  const lines: string[] = [];

  lines.push("=== 努力値別ダメージ計算結果 ===");
  lines.push("");

  lines.push("=== 計算詳細 ===");

  const attackerStatName = move.isPhysical ? "こうげき" : "とくこう";
  const defenderStatName = move.isPhysical ? "ぼうぎょ" : "とくぼう";

  if (move.name) {
    lines.push(`${move.name}（タイプ：${move.type} いりょく：${move.power}）`);
  } else {
    lines.push(`わざ（タイプ：${move.type} いりょく：${move.power}）`);
  }

  if (isAttackerEv) {
    const attackerParts: string[] = [];
    if (attacker.pokemon) {
      attackerParts.push(`Lv${attacker.level}${attacker.pokemon.name}`);
    } else {
      attackerParts.push(`Lv${attacker.level}`);
    }
    attackerParts.push(`${attackerStatName}実数値[努力値により変動]`);
    if (attacker.item) {
      attackerParts.push(attacker.item.name);
    }
    lines.push(`攻撃側（${attackerParts.join(" ")}）`);
  } else {
    const attackerParts: string[] = [];
    if (attacker.pokemon) {
      attackerParts.push(`Lv${attacker.level}${attacker.pokemon.name}`);
    } else {
      attackerParts.push(`Lv${attacker.level}`);
    }
    attackerParts.push(`${attackerStatName}実数値${fixedStat}`);
    if (attacker.item) {
      attackerParts.push(attacker.item.name);
    }
    lines.push(`攻撃側（${attackerParts.join(" ")}）`);
  }

  if (!isAttackerEv) {
    const defenderParts: string[] = [];
    if (defender.pokemon) {
      defenderParts.push(`Lv${defender.level}${defender.pokemon.name}`);
    } else {
      defenderParts.push(`Lv${defender.level}`);
    }
    defenderParts.push(`${defenderStatName}実数値[努力値により変動]`);
    if (defender.item) {
      defenderParts.push(defender.item.name);
    }
    lines.push(`防御側（${defenderParts.join(" ")}）`);
  } else {
    const defenderParts: string[] = [];
    if (defender.pokemon) {
      defenderParts.push(`Lv${defender.level}${defender.pokemon.name}`);
    } else {
      defenderParts.push(`Lv${defender.level}`);
    }
    defenderParts.push(`${defenderStatName}実数値${fixedStat}`);
    if (defender.item) {
      defenderParts.push(defender.item.name);
    }
    lines.push(`防御側（${defenderParts.join(" ")}）`);
  }

  const otherEffects: string[] = [];

  if (isStab) {
    otherEffects.push("タイプ一致（1.5倍）");
  }

  const effectivenessText = getTypeEffectivenessText(typeEffectiveness);
  if (effectivenessText) {
    otherEffects.push(`タイプ相性${effectivenessText}`);
  }

  if (options) {
    if (options.weather === "はれ") {
      if (move.type === "ほのお") {
        otherEffects.push("はれ（1.5倍）");
      } else if (move.type === "みず") {
        otherEffects.push("はれ（0.5倍）");
      }
    } else if (options.weather === "あめ") {
      if (move.type === "みず") {
        otherEffects.push("あめ（1.5倍）");
      } else if (move.type === "ほのお") {
        otherEffects.push("あめ（0.5倍）");
      }
    }

    if (options.charge) {
      otherEffects.push("じゅうでん（2倍）");
    }

    if (options.reflect) {
      otherEffects.push("リフレクター（0.5倍）");
    }

    if (options.lightScreen) {
      otherEffects.push("ひかりのかべ（0.5倍）");
    }

    if (options.mudSport) {
      otherEffects.push("どろあそび（0.5倍）");
    }

    if (options.waterSport) {
      otherEffects.push("みずあそび（0.5倍）");
    }
  }

  if (otherEffects.length > 0) {
    lines.push(`その他：${otherEffects.join(" ")}`);
  }
  lines.push("");

  lines.push(`=== ${isAttackerEv ? "攻撃側" : "防御側"}努力値別ダメージ ===`);
  lines.push("");

  let maxDamage = 0;
  let minDamage = Infinity;
  let maxDamageEv = 0;
  let minDamageEv = 0;

  evResults.forEach(({ ev, stat, damages }) => {
    const minDmg = Math.min(...damages);
    const maxDmg = Math.max(...damages);

    if (maxDmg > maxDamage) {
      maxDamage = maxDmg;
      maxDamageEv = ev;
    }
    if (minDmg < minDamage) {
      minDamage = minDmg;
      minDamageEv = ev;
    }

    const damageRange =
      minDmg === maxDmg ? minDmg.toString() : `${minDmg} 〜 ${maxDmg}`;

    lines.push(`努力値: ${ev} (実数値: ${stat})`);
    lines.push(`ダメージ: ${damageRange}`);
    lines.push(`乱数範囲: [${damages.join(", ")}]`);
    lines.push("");
  });

  lines.push("=== サマリー ===");
  lines.push(`最大ダメージ: ${maxDamage} (努力値: ${maxDamageEv})`);
  lines.push(`最小ダメージ: ${minDamage} (努力値: ${minDamageEv})`);

  return lines.join("\n");
};
