---
sidebar_position: 1
---

# ドキュメントのバージョン管理

Docusaurus はドキュメントの複数バージョンを管理できます。

## ドキュメントのバージョンを作成する

プロジェクトのバージョン 1.0 をリリースします:

```bash
npm run docusaurus docs:version 1.0
```

`docs` フォルダが `versioned_docs/version-1.0` にコピーされ、`versions.json` が作成されます。

ドキュメントには 2 つのバージョンがあります:

- バージョン 1.0 のドキュメントは `http://localhost:3000/docs/` にあります
- 次のリリース予定のドキュメントは `http://localhost:3000/docs/next/` にあります

## バージョンドロップダウンを追加する

バージョン間をシームレスに移動できるように、バージョンドロップダウンを追加します。

`docusaurus.config.js` ファイルを変更します。

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

ドキュメントのバージョンドロップダウンがナビゲーションバーに表示されます。

![Docs Version Dropdown](./img/docsVersionDropdown.png)

## 既存のバージョンを更新する

それぞれのフォルダ内でバージョン管理されたドキュメントを編集することができます。

- `versioned_docs/version-1.0/hello.md` は `http://localhost:3000/docs/hello` を更新します
- `docs/hello.md` は `http://localhost:3000/docs/next/hello` を更新します
