import type { NormalDamageResult } from "@/tools/calculateDamage/types/damageCalculation";
import { getTypeEffectivenessText } from "@/utils/getTypeEffectivenessText";

export const formatDamageResult = (result: NormalDamageResult): string => {
  const {
    damages,
    move,
    attacker,
    defender,
    typeEffectiveness,
    isStab,
    attackStat,
    defenseStat,
    options,
  } = result;

  const minDamage = Math.min(...damages);
  const maxDamage = Math.max(...damages);

  const effectivenessText = getTypeEffectivenessText(typeEffectiveness);

  const damageRange =
    minDamage === maxDamage
      ? minDamage.toString()
      : `${minDamage} 〜 ${maxDamage}`;

  const attackerStatName = move.isPhysical ? "こうげき" : "とくこう";
  const defenderStatName = move.isPhysical ? "ぼうぎょ" : "とくぼう";

  const lines = [
    "=== ダメージ計算結果 ===",
    "",
    `ダメージ: ${damageRange}`,
    `乱数範囲: [${damages.join(", ")}]`,
    "",
    "=== 計算詳細 ===",
  ];

  if (move.name) {
    lines.push(`${move.name}（タイプ：${move.type} いりょく：${move.power}）`);
  } else {
    lines.push(`わざ（タイプ：${move.type} いりょく：${move.power}）`);
  }

  const attackerParts: string[] = [];
  if (attacker.pokemon) {
    attackerParts.push(`Lv${attacker.level}${attacker.pokemon.name}`);
  } else {
    attackerParts.push(`Lv${attacker.level}`);
  }
  attackerParts.push(`${attackerStatName}実数値${attackStat}`);
  if (attacker.item) {
    attackerParts.push(attacker.item.name);
  }
  lines.push(`攻撃側（${attackerParts.join(" ")}）`);

  const defenderParts: string[] = [];
  if (defender.pokemon) {
    defenderParts.push(`Lv${defender.level}${defender.pokemon.name}`);
  } else {
    defenderParts.push(`Lv${defender.level}`);
  }
  defenderParts.push(`${defenderStatName}実数値${defenseStat}`);
  if (defender.item) {
    defenderParts.push(defender.item.name);
  }
  lines.push(`防御側（${defenderParts.join(" ")}）`);

  const otherEffects: string[] = [];

  if (isStab) {
    otherEffects.push("タイプ一致（1.5倍）");
  }

  otherEffects.push(`タイプ相性${effectivenessText}`);

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

  return lines.join("\n");
};
