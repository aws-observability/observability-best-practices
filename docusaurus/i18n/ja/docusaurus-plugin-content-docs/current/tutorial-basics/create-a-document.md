---
sidebar_position: 2
---




# ドキュメントの作成

ドキュメントは以下の要素で接続された **ページのグループ** です：

- **サイドバー**
- **前へ/次へのナビゲーション**
- **バージョン管理**



## 最初のドキュメントを作成する

`docs/hello.md` に Markdown ファイルを作成します:

```md title="docs/hello.md"



# こんにちは

これは私の **初めての Docusaurus ドキュメント**です！
```

新しいドキュメントが [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) で利用可能になりました。




## サイドバーの設定

Docusaurus は `docs` フォルダから自動的に**サイドバーを作成**します。

メタデータを追加してサイドバーのラベルと位置をカスタマイズします：

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---




# Hello

これは私の **初めての Docusaurus ドキュメント**です！
```

`sidebars.js` で明示的にサイドバーを作成することもできます：

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
