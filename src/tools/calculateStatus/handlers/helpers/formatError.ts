import { formatError as baseFormatError } from "@/utils/error";

// calculateStatus用のデフォルトエラー出力
const DEFAULT_ERROR_OUTPUT = {
  // エラー時でも最小限の情報を含める（スキーマ準拠のため）
  pokemonName: "unknown",
  stats: {
    hp: 0,
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
  },
};

export const formatError = (error: unknown) => {
  return baseFormatError(error, DEFAULT_ERROR_OUTPUT);
};
