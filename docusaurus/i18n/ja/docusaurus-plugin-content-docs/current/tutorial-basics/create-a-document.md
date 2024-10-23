---
sidebar_position: 2
---



# ドキュメントを作成する

ドキュメントは以下の要素によって接続された **ページのグループ** です：

- **サイドバー**
- **前/次のナビゲーション**
- **バージョン管理**



## 最初のドキュメントを作成する

`docs/hello.md` に Markdown ファイルを作成します：

```md title="docs/hello.md"



# こんにちは

これは私の **初めての Docusaurus ドキュメント** です！
```

新しいドキュメントが [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) で利用可能になりました。




## サイドバーの設定

Docusaurus は `docs` フォルダから自動的に**サイドバーを作成**します。

メタデータを追加して、サイドバーのラベルと位置をカスタマイズします：

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---




# こんにちは

これは私の **初めての Docusaurus ドキュメント**です！
```

`sidebars.js` でサイドバーを明示的に作成することも可能です：

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
