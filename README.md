# pokemon-gen3-calc-mcp

ポケモン第三世代（ルビー・サファイア・エメラルド・ファイアレッド・リーフグリーン）のステータスとダメージ計算を行う MCP（Model Context Protocol）サーバーです。

## 概要

このプロジェクトは、LLM がポケモンの計算を正確に行うための外部ツールとして機能します。MCP サーバーとして実装されており、Claude Desktop などの MCP クライアントから利用できます。

### 主な機能

- **ステータス計算**: 種族値、個体値、努力値、せいかくを考慮した正確な実数値計算
- **ダメージ計算**: タイプ相性、とくせい、もちもの、天候などを考慮した総合的なダメージ計算
- **努力値別ダメージ計算**: 努力値を 0〜252 の全パターンでダメージを計算

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

1. ビルドを実行してdistディレクトリにファイルを生成：

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

## 開発者向け

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
- 努力値別ダメージ計算機能
- エラーハンドリング

### 推奨開発環境

このプロジェクトの開発には以下のツールの利用を推奨します：

#### GitHub CLI (gh)

GitHub との連携を効率化するため、GitHub CLI の導入を強く推奨します。

[公式のインストール手順](https://github.com/cli/cli#installation)を参考にしてください。

#### Claude Code

AI 支援開発ツール [Claude Code](https://claude.ai/code) の活用を推奨します。このプロジェクトは CLAUDE.md による開発ガイドラインが整備されているため、Claude Code を使用することでコード生成が容易になります。

### コマンド

```bash
# 型チェック
npm run typecheck

# テスト実行
npm run test

# リント・フォーマット
npm run lint    # チェックのみ
npm run format  # 自動修正

# 全チェック（型チェック + リント + テスト）
npm run check

# 結合テスト（MCPサーバーへの実際のリクエストをテスト）
npm run test:integration

# スキーマ生成（ZodスキーマからMCP用JSONスキーマを生成）
npm run schemagen
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
