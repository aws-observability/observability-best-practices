---
sidebar_position: 5
---




# サイトのデプロイ

Docusaurus は **静的サイトジェネレーター** (別名 **[Jamstack](https://jamstack.org/)**)です。

サイトをシンプルな **HTML、JavaScript、CSS ファイル** として構築します。



## サイトのビルド

サイトを **本番環境用に** ビルドします:

```bash
npm run build
```

静的ファイルは `build` フォルダに生成されます。




## サイトのデプロイ

本番用ビルドをローカルでテストします：

```bash
npm run serve
```

`build` フォルダが [http://localhost:3000/](http://localhost:3000/) で提供されるようになりました。

これで `build` フォルダを **ほぼどこにでも**、**無料** または非常に低コストで簡単にデプロイできます（**[デプロイメントガイド](https://docusaurus.io/docs/deployment)** をご覧ください）。
