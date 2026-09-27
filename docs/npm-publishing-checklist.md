# npmパッケージ公開前のチェックリスト

## 事前準備

### 1. npmアカウントの作成
- [ ] https://www.npmjs.com/ でアカウント作成
- [ ] メール認証を完了
- [ ] 2要素認証を設定（推奨）

### 2. ローカル環境の準備
```bash
# npmにログイン
npm login

# ログイン確認
npm whoami
```

### 3. パッケージ名の確認
```bash
# パッケージ名が利用可能か確認
npm view pokemon-gen3-calc-mcp

# エラーが出れば利用可能（404 Not Found）
```

## 公開前の最終確認

### 1. package.jsonの確認
- [ ] name: パッケージ名が正しい
- [ ] version: 1.0.0からスタート
- [ ] description: 適切な説明
- [ ] author: 作者情報
- [ ] license: ライセンス（MIT）
- [ ] repository: GitHubリポジトリURL
- [ ] keywords: 検索用キーワード（追加推奨）

### 2. 公開されるファイルの確認
```bash
# 実際に公開されるファイルを確認
npm pack --dry-run

# パッケージサイズの確認
npm pack --dry-run 2>&1 | grep "npm notice"
```

### 3. ローカルテスト
```bash
# パッケージを作成（.tgzファイル）
npm pack

# 別ディレクトリでテスト
cd /tmp
npx ./path/to/pokemon-gen3-calc-mcp-1.0.0.tgz

# または
npm install ./path/to/pokemon-gen3-calc-mcp-1.0.0.tgz -g
pokemon-gen3-calc-mcp
```

## 段階的な公開方法

### オプション1: プライベートスコープで練習
```bash
# スコープ付きパッケージ名に変更（package.json）
"name": "@your-username/pokemon-gen3-calc-mcp"

# プライベートで公開（有料プランが必要）
npm publish

# または無料でパブリック公開
npm publish --access public
```

### オプション2: npmのかわりにGitHub Packagesを使用
GitHub Packagesを使えば、GitHubアカウントで管理でき、より安全に練習できます。

### オプション3: ローカルレジストリで練習
```bash
# Verdaccioをインストール（ローカルnpmレジストリ）
npm install -g verdaccio

# Verdaccioを起動
verdaccio

# ローカルレジストリに公開
npm publish --registry http://localhost:4873
```

## 本番公開時の注意点

### 1. バージョン管理
```bash
# 初回は1.0.0で公開
npm publish

# 更新時はバージョンを上げる
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### 2. 公開後は削除が困難
- 24時間以内なら `npm unpublish` 可能
- それ以降は特別な理由がない限り削除不可
- バージョンは一度使うと再利用不可

### 3. セキュリティ
- [ ] 秘密情報が含まれていないか確認
- [ ] .envファイルが除外されているか
- [ ] APIキーやトークンが含まれていないか

## トラブルシューティング

### よくあるエラー

1. **E403 Forbidden**
   - npmにログインしているか確認
   - パッケージ名が既に使用されていないか

2. **E402 Payment Required**
   - プライベートパッケージは有料
   - `--access public`を付ける

3. **ENEEDAUTH**
   - `npm login`を実行

## 参考リンク

- [npm公式: パッケージの公開](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm公式: package.jsonガイド](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [初めてのnpmパッケージ公開](https://zenn.dev/antez/articles/a9d9d12178b7b2)
- [npmパッケージ公開入門](https://qiita.com/watanabe-yu/items/40f1a5a224100f961ed5)