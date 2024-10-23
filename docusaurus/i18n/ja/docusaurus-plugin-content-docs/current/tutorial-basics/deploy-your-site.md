---
sidebar_position: 5
---



# サイトをデプロイする

Docusaurus は **静的サイトジェネレーター** (または **[Jamstack](https://jamstack.org/)** とも呼ばれます) です。

サイトをシンプルな **静的 HTML、JavaScript、CSS ファイル** としてビルドします。



## サイトをビルドする

サイトを **本番用に** ビルドします：

```bash
npm run build
```

静的ファイルは `build` フォルダに生成されます。



## サイトのデプロイ

ローカルで本番ビルドをテストします：

```bash
npm run serve
```

これで `build` フォルダが [http://localhost:3000/](http://localhost:3000/) で提供されます。

`build` フォルダを**ほぼどこにでも**簡単に、**無料**または非常に低コストでデプロイできるようになりました（**[デプロイメントガイド](https://docusaurus.io/docs/deployment)** をお読みください）。
