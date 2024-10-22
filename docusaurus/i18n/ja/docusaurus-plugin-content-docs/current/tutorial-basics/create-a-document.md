---
sidebar_position: 2
---

# ドキュメントを作成する

ドキュメントとは、以下を通じて接続されたページのグループです。

- サイドバー
- 前/次のナビゲーション
- バージョン管理

## はじめての Doc を作成する

`docs/hello.md` に Markdown ファイルを作成してください。

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

新しいドキュメントが [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) で利用可能になりました。

## サイドバーを設定する

Docusaurus は `docs` フォルダから自動的に **サイドバーを作成** します。

サイドバーのラベルと位置をカスタマイズするには、メタデータを追加します。

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```js title="sidebars.js"
export default {
  tutorialSidebar: [
    'intro',
    // highlight-next-line
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};
