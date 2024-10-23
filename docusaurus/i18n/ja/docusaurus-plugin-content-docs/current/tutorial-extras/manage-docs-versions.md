---
sidebar_position: 1
---




# ドキュメントのバージョン管理

Docusaurus は、ドキュメントの複数のバージョンを管理できます。



## ドキュメントのバージョンを作成する

プロジェクトのバージョン 1.0 をリリースします：

```bash
npm run docusaurus docs:version 1.0
```

`docs` フォルダが `versioned_docs/version-1.0` にコピーされ、`versions.json` が作成されます。

これで、ドキュメントには 2 つのバージョンがあります：

- `1.0` は `http://localhost:3000/docs/` にあり、バージョン 1.0 のドキュメントです
- `current` は `http://localhost:3000/docs/next/` にあり、**今後リリース予定の未公開ドキュメント**です




## バージョンドロップダウンの追加

バージョン間をシームレスに移動するために、バージョンドロップダウンを追加します。

`docusaurus.config.js` ファイルを以下のように修正します：

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

ドキュメントのバージョンドロップダウンがナビゲーションバーに表示されます：

![Docs Version Dropdown](./img/docsVersionDropdown.png)



## 既存のバージョンを更新する

バージョン管理されたドキュメントは、それぞれのフォルダ内で編集することができます：

- `versioned_docs/version-1.0/hello.md` は `http://localhost:3000/docs/hello` を更新します
- `docs/hello.md` は `http://localhost:3000/docs/next/hello` を更新します
