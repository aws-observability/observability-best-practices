---
sidebar_position: 1
---
# ドキュメントバージョンの管理

Docusaurus はドキュメントの複数のバージョンを管理できます。

## ドキュメントバージョンを作成する

プロジェクトのバージョン 1.0 をリリースします。

```bash
npm run docusaurus docs:version 1.0
```

The `docs` フォルダーがコピーされます `versioned_docs/version-1.0` および `versions.json` が作成されます。

ドキュメントに 2 つのバージョンが作成されました。

- `1.0` で `http://localhost:3000/docs/` バージョン 1.0 のドキュメント用
- `current` で `http://localhost:3000/docs/next/` **今後リリース予定のドキュメント**

## バージョンドロップダウンを追加する

バージョン間をシームレスに移動するには、バージョンドロップダウンを追加します。

を変更します。 `docusaurus.config.js` ファイル:

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

ドキュメントバージョンのドロップダウンがナビゲーションバーに表示されます。

![Docs Version Dropdown](./img/docsVersionDropdown.png)

## 既存のバージョンを更新する

バージョン管理されたドキュメントは、それぞれのフォルダで編集できます。

- `versioned_docs/version-1.0/hello.md` 更新 `http://localhost:3000/docs/hello`
- `docs/hello.md` 更新 `http://localhost:3000/docs/next/hello`
