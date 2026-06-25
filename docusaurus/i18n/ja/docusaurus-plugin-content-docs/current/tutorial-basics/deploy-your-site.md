---
sidebar_position: 5
---
# サイトをデプロイする

Docusaurus は **静的サイトジェネレーター** です（**[Jamstack](https://jamstack.org/)** とも呼ばれます）。

サイトをシンプルな**静的 HTML、JavaScript、CSS ファイル**としてビルドします。

## サイトをビルドする

サイトを**本番環境用に**ビルドします。

```bash
npm run build
```

静的ファイルは次の場所に生成されます `build` フォルダー。

## サイトをデプロイする

本番ビルドをローカルでテストします。

```bash
npm run serve
```

The `build` フォルダーが [http://localhost:3000/](http://localhost:3000/) で提供されるようになりました。

これで、デプロイできるようになりました `build` フォルダを**ほぼどこにでも**簡単に、**無料**または非常に低コストでデプロイできます（**[デプロイメントガイド](https://docusaurus.io/docs/deployment)**を参照してください）。
