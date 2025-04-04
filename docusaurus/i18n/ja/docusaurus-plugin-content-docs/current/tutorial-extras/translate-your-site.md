---
sidebar_position: 2
---




# サイトを翻訳する

`docs/intro.md` をフランス語に翻訳しましょう。




## i18n の設定

`fr` ロケールをサポートするために `docusaurus.config.js` を変更します:

```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};
```



## ドキュメントを翻訳する

`docs/intro.md` ファイルを `i18n/fr` フォルダにコピーします：

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

`i18n/fr/docusaurus-plugin-content-docs/current/intro.md` をフランス語に翻訳します。



## ローカライズされたサイトを開始する

フランスのロケールでサイトを開始します：

```bash
npm run start -- --locale fr
```

ローカライズされたサイトは [http://localhost:3000/fr/](http://localhost:3000/fr/) でアクセスでき、「はじめに」のページが翻訳されています。

:::caution

開発環境では、一度に 1 つのロケールのみ使用できます。

:::




## ロケールドロップダウンの追加

言語間をシームレスに移動するために、ロケールドロップダウンを追加します。

`docusaurus.config.js` ファイルを以下のように変更します：

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

これで、ナビゲーションバーにロケールドロップダウンが表示されます：

![Locale Dropdown](./img/localeDropdown.png)



## ローカライズされたサイトのビルド

特定のロケールでサイトをビルドします：

```bash
npm run build -- --locale fr
```

または、すべてのロケールを一度にビルドします：

```bash
npm run build
```
