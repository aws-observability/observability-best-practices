---
sidebar_position: 1
---
# ページを作成する

**Markdown または React** ファイルを追加します `src/pages` **スタンドアロンページ**を作成するには。

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## 最初の React ページを作成する

ファイルを作成します。 `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

新しいページが [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page) で利用可能になりました。

## 最初の Markdown ページを作成する

ファイルを作成します。 `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

新しいページが [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page) で利用可能になりました。
