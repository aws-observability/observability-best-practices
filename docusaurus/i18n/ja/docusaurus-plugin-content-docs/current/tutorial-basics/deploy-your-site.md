---
sidebar_position: 5
---

# サイトをデプロイする

Docusaurus は **静的サイトジェネレーター** (または **[Jamstack](https://jamstack.org/)** と呼ばれています)です。

シンプルな **静的 HTML、JavaScript、CSS ファイル** としてサイトをビルドします。

## サイトをビルドする

**本番用に**サイトをビルドします:

```bash
npm run build
```

静的ファイルは `build` フォルダに生成されます。

## サイトをデプロイする

プロダクションビルドをローカルでテストします:

```bash
npm run serve
```

`build` フォルダが [http://localhost:3000/](http://localhost:3000/) で提供されます。

これで `build` フォルダを **ほぼどこにでも** 簡単に、**無料** または非常に低コストでデプロイできます (**[デプロイガイド](https://docusaurus.io/docs/deployment)** を読んでください)。
