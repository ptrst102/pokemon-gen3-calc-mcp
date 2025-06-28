# pokemon-gen3-calc-mcp

ポケモン第三世代（ルビー・サファイア・エメラルド・ファイアレッド・リーフグリーン）のステータスとダメージ計算を行う MCP（Model Context Protocol）サーバーです。

## 概要

このプロジェクトは、LLM がポケモンの計算を正確に行うための外部ツールとして機能します。MCP サーバーとして実装されており、Claude Desktop などの MCP クライアントから利用できます。

### 主な機能

- **ステータス計算** (`calculate_status`): 種族値、個体値、努力値、せいかくを考慮した正確な実数値計算

- **ダメージ計算** (`calculate_damage`): 以下の要素を考慮した総合的なダメージ計算

  - タイプ相性
  - タイプ一致補正
  - とくせい効果（もうか、げきりゅう、しんりょくなど）
  - もちもの効果（こだわりハチマキ、タイプ強化アイテムなど）
  - 天候効果（はれ、あめ、すなあらし、あられ）
  - 場の状態（リフレクター、ひかりのかべ、どろあそび、みずあそび）
  - 能力ランク補正（-6〜+6）
  - 急所判定
  - 特殊な技の処理（ウェザーボール、けたぐり、ソーラービーム、じばく・だいばくはつ）

- **攻撃側努力値総当たり計算** (`calculate_damage_matrix_varying_attack`):

  - 防御側の努力値を固定し、攻撃側の努力値を総当たりしてダメージ行列を計算
  - 相手を確実に倒すための最小限の攻撃努力値を見つける際に有用

- **防御側努力値総当たり計算** (`calculate_damage_matrix_varying_defense`):
  - 攻撃側の努力値を固定し、防御側の努力値を総当たりしてダメージ行列を計算
  - 特定の攻撃を耐えるために必要な防御努力値配分を検討する際に有用

## 必要な環境

- Node.js（Volta 経由でのインストールを推奨）
- npm

## インストール

```bash
# リポジトリのクローン
git clone https://github.com/ptrst102/pokemon-gen3-calc-mcp.git
cd pokemon-gen3-calc-mcp

# 依存関係のインストール
npm install
```

## 使い方

### MCP クライアントとの連携

1. ビルドを実行して dist ディレクトリにファイルを生成：

```bash
npm run build
```

2. MCP クライアント（Claude Desktop など）の設定ファイルに以下を追加：

```json
{
  "mcpServers": {
    "pokemon-gen3-calc": {
      "command": "node",
      "args": ["path/to/pokemon-gen3-calc-mcp/dist/index.js"]
    }
  }
}
```

## 特殊な技の処理

この MCP サーバーは以下の特殊な技の処理に対応しています：

### ウェザーボール

- 天候によってタイプと威力が変化
- はれ: ほのおタイプ、威力 100
- あめ: みずタイプ、威力 100
- あられ: こおりタイプ、威力 100
- すなあらし: いわタイプ、威力 100

### けたぐり

- 相手のポケモンの体重によって威力が変化
- 体重に応じて 20〜120 の威力

### ソーラービーム

- あめ、すなあらし、あられの場合、ダメージが半減

### じばく・だいばくはつ

- 相手の防御を半分として計算

## 開発者向け

### スキーマの生成

```bash
npm run schemagen
```

このプロジェクトでは、Zod スキーマから MCP（Model Context Protocol）用の JSON スキーマを自動生成する仕組みを採用しています。

`src/tools/*/handlers/schemas/` 内の Zod スキーマを変更したのち、
`npm run schemagen` を実行すると
`src/tools/*/generated/inputSchema.ts` が自動生成されます。

### 開発サーバーの起動

```bash
npm run dev
```

### 結合テスト

開発サーバーが正しく動作しているか確認するために、結合テストスクリプトを用意しています：

```bash
# MCPサーバーへの実際のリクエストをテスト
npm run test:integration
```

結合テストでは以下を検証します：

- サーバーへの接続
- `calculate_status` ツールによるステータス計算
- `calculate_damage` ツールによるダメージ計算
- `calculate_damage_matrix_varying_attack` ツールによる攻撃側努力値総当たり計算
- `calculate_damage_matrix_varying_defense` ツールによる防御側努力値総当たり計算
- エラーハンドリング

### 推奨開発環境

このプロジェクトの開発には以下のツールの利用を推奨します：

#### GitHub CLI (gh)

GitHub との連携を効率化するため、GitHub CLI の導入を強く推奨します。

[公式のインストール手順](https://github.com/cli/cli#installation)を参考にしてください。

#### Claude Code

AI 支援開発ツール [Claude Code](https://claude.ai/code) の活用を推奨します。このプロジェクトは CLAUDE.md による開発ガイドラインが整備されているため、Claude Code を使用することでコード生成が容易になります。

### 開発コマンド

```bash
# 型チェック
npm run typecheck

# テスト実行
npm run test                    # 全テスト実行
npm run test -- --watch         # ウォッチモードでテスト実行
npm run test -- src/tools/calculateDamage  # 特定ディレクトリのテスト
npm run test -- src/utils/adjustSpecialMoves/adjustSpecialMoves.spec.ts  # 特定ファイルのテスト

# テストカバレッジ測定
npm run test:coverage           # カバレッジ付きでテスト実行
# カバレッジレポート：
# - コンソールに概要が表示されます
# - HTMLレポートは coverage/index.html で確認できます
# - 現在のカバレッジ率: 98.75%

# リント・フォーマット
npm run lint    # チェックのみ
npm run format  # 自動修正

# 全チェック（型チェック + リント + テスト）
npm run check

# 結合テスト（MCPサーバーへの実際のリクエストをテスト）
npm run test:integration

# スキーマ生成（ZodスキーマからMCP用JSONスキーマを生成）
# src/tools/*/handlers/schemas/ 内のZodスキーマを変更した後に実行
npm run schemagen

# ビルド（dist/ディレクトリに出力）
npm run build
```

### プロジェクト構造

主要なディレクトリ構成：

```
src/
├── data/          # ポケモンデータ（種族値、わざ、もちもの等）
├── tools/         # MCPツール定義とハンドラ
│   ├── calculateStatus/
│   ├── calculateDamage/
│   ├── calculateDamageMatrixVaryingAttack/
│   └── calculateDamageMatrixVaryingDefense/
├── types/         # 共通型定義
└── utils/         # 共通ユーティリティ
    ├── adjustSpecialMoves/     # 特殊な技の処理
    ├── calculateDamageCore/    # ダメージ計算コアロジック
    └── error/                  # エラーハンドリング
```

### 技術スタック

- TypeScript (ESNext, ESM)
- Model Context Protocol SDK
- Zod (バリデーション)
- Vitest (テスト)
- Biome (リンター/フォーマッター)
- esbuild (ビルド)

## ライセンス

MIT
