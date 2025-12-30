---
sidebar_position: 2
---
# サイトを翻訳する

翻訳しましょう `docs/intro.md` フランス語に翻訳します。

## i18n の設定

変更 `docusaurus.config.js` のサポートを追加するために `fr` ロケール：

```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};
```

## ドキュメントを翻訳する

コピーします。 `docs/intro.md` ファイルに `i18n/fr` フォルダー

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

翻訳 `i18n/fr/docusaurus-plugin-content-docs/current/intro.md` フランス語で。

## ローカライズされたサイトを起動する

フランス語ロケールでサイトを起動します。

```bash
npm run start -- --locale fr
```

ローカライズされたサイトは [http://localhost:3000/fr/](http://localhost:3000/fr/) でアクセス可能です。 `Getting Started` ページが翻訳されました。

:::caution

開発環境では、一度に 1 つのロケールのみを使用できます。

:::

## ロケールドロップダウンを追加する

言語間をシームレスに移動するには、ロケールドロップダウンを追加します。

を変更します。 `docusaurus.config.js` ファイル:

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

## ローカライズされたサイトをビルドする

特定のロケール用にサイトをビルドします。

```bash
npm run build -- --locale fr
```

または、すべてのロケールを一度に含めてサイトをビルドします。

```bash
npm run build
```
