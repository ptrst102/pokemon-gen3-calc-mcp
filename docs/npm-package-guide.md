# npxで実行可能なMCPサーバーパッケージの作成ガイド

このドキュメントでは、MCPサーバーをnpxで実行可能なnpmパッケージとして公開する方法について説明します。

## 概要

MCPサーバーをnpxで実行可能にすることで、ユーザーは以下のメリットを得られます：

- インストール不要で即座に利用可能
- 常に最新バージョンを使用
- グローバルインストールによる環境汚染を回避
- MCP設定ファイルでの記述がシンプルになる

## 必要な設定

### 1. package.jsonの設定

#### binフィールド

実行可能ファイルを指定します：

```json
{
  "bin": {
    "pokemon-gen3-calc-mcp": "./dist/index.js"
  }
}
```

- キー（`pokemon-gen3-calc-mcp`）: npxで実行する際のコマンド名
- 値（`./dist/index.js`）: 実行されるファイルのパス

#### filesフィールド

npmパッケージに含めるファイルを指定します：

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "package.json"
  ]
}
```

#### mainフィールド（オプション）

パッケージのエントリーポイントを指定します：

```json
{
  "main": "./dist/index.js"
}
```

### 2. ビルドスクリプトの設定

ビルドスクリプト（`scripts/build.ts`）で以下を確認：

1. **shebangの追加**
   ```javascript
   banner: {
     js: "#!/usr/bin/env node",
   }
   ```

2. **実行権限の設定**
   ```javascript
   await chmod("dist/index.js", 0o755);
   ```

### 3. .npmignoreファイル

開発用ファイルを公開から除外します：

```
# Development files
src/
scripts/
tests/
*.spec.ts
*.test.ts

# Configuration files
biome.json
tsconfig.json
vitest.config.ts
renovate.json

# Build artifacts
coverage/
.cache/

# Documentation for development
docs/
CLAUDE.md

# Git
.git/
.gitignore

# Node
node_modules/
npm-debug.log*
```

## npm公開手順

### 1. npmアカウントの準備

```bash
# npmにログイン
npm login
```

### 2. パッケージ名の確認

```bash
# パッケージ名が利用可能か確認
npm view pokemon-gen3-calc-mcp
```

既に使用されている場合は、package.jsonの`name`フィールドを変更する必要があります。

### 3. ビルドとテスト

```bash
# ビルド
npm run build

# テストの実行
npm run check

# ローカルでのテスト（グローバルリンク）
npm link

# 別のディレクトリで実行テスト
npx pokemon-gen3-calc-mcp
```

### 4. バージョン管理

```bash
# パッチバージョンアップ（1.0.0 → 1.0.1）
npm version patch

# マイナーバージョンアップ（1.0.0 → 1.1.0）
npm version minor

# メジャーバージョンアップ（1.0.0 → 2.0.0）
npm version major
```

### 5. 公開

```bash
# 公開（初回）
npm publish

# 公開（更新）
npm publish
```

### 6. 公開後の確認

```bash
# パッケージ情報の確認
npm view pokemon-gen3-calc-mcp

# npxでの実行テスト
npx pokemon-gen3-calc-mcp
```

## スコープ付きパッケージ（オプション）

組織やユーザー名でスコープを付けることも可能です：

```json
{
  "name": "@username/pokemon-gen3-calc-mcp"
}
```

スコープ付きパッケージを公開する場合：

```bash
# パブリック公開
npm publish --access public
```

## MCPクライアントでの使用方法

### Claude Desktopの設定例

```json
{
  "mcpServers": {
    "pokemon-gen3-calc": {
      "command": "npx",
      "args": ["-y", "pokemon-gen3-calc-mcp"]
    }
  }
}
```

- `-y`オプション: 確認プロンプトをスキップして自動的に実行

## トラブルシューティング

### 実行ファイルが見つからない場合

1. `dist/index.js`が存在することを確認
2. shebangが正しく設定されているか確認
3. 実行権限が設定されているか確認

### パッケージが古いバージョンを使用する場合

```bash
# キャッシュをクリア
npx clear-npx-cache
```

### 公開エラーが発生する場合

1. npmにログインしているか確認
2. パッケージ名が重複していないか確認
3. バージョンが既に公開されていないか確認

## ベストプラクティス

1. **セマンティックバージョニング**を遵守
   - 破壊的変更: メジャーバージョン
   - 新機能追加: マイナーバージョン
   - バグ修正: パッチバージョン

2. **CHANGELOGの維持**
   - 各リリースの変更内容を記録

3. **プレリリースのテスト**
   ```bash
   npm publish --tag beta
   ```

4. **GitHub Actionsでの自動公開**
   - タグプッシュ時に自動的にnpm公開

## 参考リンク

- [npm公式ドキュメント](https://docs.npmjs.com/)
- [MCP公式ドキュメント](https://github.com/anthropics/model-context-protocol)
- [セマンティックバージョニング](https://semver.org/)