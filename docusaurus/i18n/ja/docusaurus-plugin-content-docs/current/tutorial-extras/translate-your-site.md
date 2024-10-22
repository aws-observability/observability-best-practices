---
sidebar_position: 2
---

# サイトを翻訳する

`docs/intro.md` をフランス語に翻訳しましょう。

## i18n を設定する

`docusaurus.config.js` を変更して、`fr` ロケールのサポートを追加します。

```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};
```

## ドキュメントを翻訳する

`docs/intro.md` ファイルを `i18n/fr` フォルダにコピーします。

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

`i18n/fr/docusaurus-plugin-content-docs/current/intro.md` をフランス語に翻訳します。

## ローカライズされたサイトを開始する

フランス語のロケールでサイトを開始します:

```bash
npm run start -- --locale fr
```

ローカライズされたサイトは [http://localhost:3000/fr/](http://localhost:3000/fr/) でアクセスでき、「Getting Started」ページが翻訳されています。

caution
開発時には、一度に使用できるロケールは 1 つだけです。


## ロケールドロップダウンを追加する

言語を簡単に切り替えるために、ロケールドロップダウンを追加します。

`docusaurus.config.js` ファイルを変更します。

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

ロケールドロップダウンがナビゲーションバーに表示されます。

![Locale Dropdown](./img/localeDropdown.png)

## ローカライズされたサイトを構築する

特定のロケールのサイトを構築します:

```bash
npm run build -- --locale fr
```

または、一度にすべてのロケールを含むサイトを構築します:

```bash
npm run build
```
