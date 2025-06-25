# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要な参照ドキュメント

MCP プロトコルの詳細については、`docs/what-is-MCP.md`を参照してください。このファイルには MCP の包括的なドキュメントが含まれており、MCP サーバーやクライアントの実装時に必要な情報が記載されています。

## プロジェクト概要

このプロジェクトは、ポケモン第三世代（ルビー・サファイア・エメラルド・ファイアレッド・リーフグリーン）のステータスとダメージ計算を行う MCP（Model Context Protocol）サーバーです。LLM がポケモンの計算を正確に行うための外部ツールとして機能します。

### 主要な機能

1. **ステータス計算** (`calculate_status`)

   - 種族値、個体値、努力値、レベル、せいかくを考慮した実数値計算
   - HP、こうげき、ぼうぎょ、とくこう、とくぼう、すばやさの 6 つのステータスに対応

2. **ダメージ計算** (`calculate_damage`)
   - タイプ相性、タイプ一致ボーナス、急所を考慮
   - とくせい効果（もうか、げきりゅう、しんりょく等）
   - もちもの効果（こだわりハチマキ等）
   - 天候効果（はれ、あめ）
   - 場の状態（リフレクター、ひかりのかべ、どろあそび、みずあそび）
   - 能力ランク補正（-6〜+6）
   - **努力値別ダメージ計算**（`calculateAllEvs`オプション）

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 型チェック
npm run typecheck

# テスト実行
npm run test        # 全テスト実行
npm run test -- src/tools/calculateDamage  # 特定ディレクトリのテスト
npm run test -- --watch  # ウォッチモード

# リント・フォーマット
npm run lint        # リントのみ
npm run format      # フォーマット実行

# すべてのチェック（型チェック + リント + テスト）
npm run check

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## コーディング規約

### 厳格なルール

- **MUST**: `any`型の使用禁止
- **MUST**: `as`による型アサーション禁止。`as`を使いたくなったら切腹する
- **MUST**: if 文は必ず中括弧を使用する（一行でも省略しない）
- **MUST**: `let`の使用を避け、`const`を優先する。変数の再代入が必要な場合は即時実行関数などを使用する
- **MUST**: 早期returnを活用し、不要な`else`を避ける

```typescript
// ❌ 悪い例
if (condition) return value;

// ⭕ 良い例
if (condition) {
  return value;
}

// ❌ 悪い例（let使用）
let message: string;
if (error instanceof ZodError) {
  message = formatZodError(error);
} else if (error instanceof Error) {
  message = error.message;
} else {
  message = "不明なエラー";
}

// ⭕ 良い例（即時実行関数）
const message = (() => {
  if (error instanceof ZodError) {
    return formatZodError(error);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "不明なエラー";
})();

// ❌ 悪い例（不要なelse）
if (value === 0) {
  return "ゼロ";
} else if (value > 0) {
  return "正の数";
} else {
  return "負の数";
}

// ⭕ 良い例（早期return）
if (value === 0) {
  return "ゼロ";
}
if (value > 0) {
  return "正の数";
}
return "負の数";
```

### コーディングスタイル

- 関数定義: `const fn = () => {}`形式を使用
- 変数定義: `const`を使用（`let`は原則禁止、ループ変数を除く）
- インポート: `@/`エイリアスを使用（tsconfig.json で設定済み）
- エクスポート: index.ts での再エクスポートパターンを使用

### 開発手法

- テスト駆動開発（TDD）を基本とする
  - t-wada の TDD のやり方をベストプラクティスとする
- ファイル構成: 機能ごとにディレクトリを作成し、`index.ts`で再エクスポート
- テストファイル: `*.spec.ts`形式で同じディレクトリに配置

## ポケモン用語の表記ガイドライン

公式の書き方に準拠する。

### ゲーム内用語

- **もちもの**（持ち物ではない）
- **わざ**（技ではない）
- **とくせい**（特性ではない）
- **せいかく**（性格ではない）
- **てんき**（天気ではない）
- **きのみ**（木の実ではない）
- **どうぐ**（道具ではない）
- **タイプ**（型ではない）

### ステータス名

- **HP**（エイチピー）
- **こうげき**（攻撃ではない）
- **ぼうぎょ**（防御ではない）
- **とくこう**（特攻/特殊攻撃ではない）
- **とくぼう**（特防/特殊防御ではない）
- **すばやさ**（素早さではない）

※ 一般的な文脈での「攻撃」「防御」などは漢字で記述可能

### コミュニティ用語

公式用語でないが、ユーザーコミュニティで一般的に使われる用語も使用可：

- 努力値（EV）
- 個体値（IV）
- 種族値
- 実数値
- 物理/特殊
- タイプ一致

## アーキテクチャ

### MCP サーバー構造

このプロジェクトは Model Context Protocol (MCP) サーバーとして実装されており、以下の 2 つの主要ツールを提供：

- `calculate_status`: ポケモンのステータス計算
- `calculate_damage`: ダメージ計算

### ディレクトリ構成

```
src/
├── index.ts                 # MCPサーバーのエントリーポイント
├── data/                    # ポケモンデータ（種族値、わざ、もちもの等）
│   ├── pokemon.ts          # ポケモンの種族値データ
│   ├── moves.ts            # わざデータ
│   ├── items.ts            # もちものデータ
│   ├── abilities.ts        # とくせいデータ
│   └── natures.ts          # せいかくデータ
├── tools/                   # MCPツール定義とハンドラ
│   ├── calculateStatus/
│   │   ├── definition.ts   # ツール定義
│   │   ├── handlers/       # ハンドラとロジック
│   │   └── index.ts        # エクスポート
│   └── calculateDamage/
│       ├── definition.ts   # ツール定義
│       ├── handlers/       # リクエストハンドラ
│       │   ├── handler.ts
│       │   ├── schemas/    # Zodスキーマ
│       │   ├── helpers/    # 計算ロジック
│       │   │   ├── calculateEvDamages.ts  # 努力値別計算
│       │   │   ├── abilityEffects/        # とくせい効果
│       │   │   ├── itemEffects/           # もちもの効果
│       │   │   └── typeEffectiveness/     # タイプ相性
│       │   └── formatters/ # レスポンス整形
│       ├── types/          # 型定義
│       └── index.ts
├── types/                   # 共通型定義
└── utils/                   # 共通ユーティリティ
    ├── calculateHp/        # HP計算
    ├── calculateStat/      # ステータス計算
    └── natureModifier/     # せいかく補正
```

### 開発パターン

1. **ツール実装フロー**:

   - `definition.ts`でツール定義
   - `schemas/`で Zod スキーマ定義
   - `handler.ts`でリクエスト処理
   - `helpers/`で計算ロジック実装
   - `formatters/`でレスポンス整形

2. **スキーマファースト**:

   - Zod による API 入出力の厳密な型定義
   - ランタイムバリデーション

3. **テストファースト**:

   - 各モジュールに対応する`.spec.ts`ファイル
   - Vitest による高速なユニットテスト

4. **モジュール設計**:
   - 単一責任の原則に従った小さなモジュール
   - index.ts による明確なパブリック API

## 開発フロー

1. **機能追加時**:

   - テストを先に書く（Red）
   - 最小限の実装でテストを通す（Green）
   - リファクタリング（Refactor）

2. **コード変更時**:

   - `npm run check`でエラーがないことを確認
   - 特に型エラーとリントエラーに注意

3. **コミット前**:

   - `npm run format`でコード整形
   - `npm run check`で全チェック実行

4. **CI/CD**:
   - GitHub Actions で PR 時と main ブランチへの push 時に自動テスト実行
   - CI は`npm run check`（型チェック、リント、テスト）を実行

## 開発時のルール

- **ブランチ管理**:
  - 適宜ブランチを切り、gh コマンドを用いてプルリクを出すこと
  - main ブランチは保護されている: 直接プッシュ不可、PR 必須、CI 通過必須
  - ブランチ作成前に必ず `git fetch -p` を実行してリモートの最新状態を取得すること
  - ブランチは原則として origin/main から生やす: `git checkout -b feature-branch origin/main`を使用してコンフリクトを防ぐ
  - コンフリクトが発生した場合は、リベースを使用して解決すること: `git rebase origin/main`

## 技術スタック

- **言語**: TypeScript (ESNext, ESM)
- **MCP フレームワーク**: @modelcontextprotocol/sdk
- **バリデーション**: Zod
- **テスト**: Vitest + @vitest/coverage-v8
- **リンター/フォーマッター**: Biome
- **ビルド**: esbuild (via tsx)
- **パッケージマネージャー**: npm
- **Node.js バージョン管理**: Volta 推奨

## TypeScript MCP（.mcp.json）

TypeScript 言語サーバー機能が利用可能：

```json
{
  "mcpServers": {
    "typescript": {
      "command": "npx",
      "args": ["typescript-mcp"]
    }
  }
}
```

これにより、Claude Code は以下の高度な TypeScript 操作が可能：

- シンボルのリネーム
- 定義へのジャンプ
- 参照の検索
- 型情報の取得
- ファイル/ディレクトリの移動（インポートの自動更新付き）

## 新しいルールの追加プロセス

ユーザーから今回限りではなく常に対応が必要だと思われる指示を受けた場合、あるいはディレクトリ構造が変更されたなどで CLAUDE.md の修正が必要な場合：

1. 「CLAUDE.md を更新しますか？」と質問する
2. yes の場合、CLAUDE.md の適切なセクションに追加する
3. 以降は標準ルールとして常に適用する

このプロセスにより、プロジェクトのルールを継続的に改善する。
