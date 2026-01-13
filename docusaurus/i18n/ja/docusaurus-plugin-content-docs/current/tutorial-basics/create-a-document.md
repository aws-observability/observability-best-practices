---
sidebar_position: 2
---
# ドキュメントを作成する

ドキュメントは、以下を通じて接続された**ページのグループ**です。

- **サイドバー**
- **前へ/次へナビゲーション**
- **バージョン管理**

## 最初のドキュメントを作成する

Markdown ファイルを作成します。 `docs/hello.md`:

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

新しいドキュメントが [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) で利用可能になりました。

## サイドバーを設定する

Docusaurus は自動的に**サイドバーを作成します**。 `docs` フォルダー。

サイドバーのラベルと位置をカスタマイズするためのメタデータを追加します。

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```

サイドバーを明示的に作成することも可能です `sidebars.js`:

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
```
