---
sidebar_position: 3
---
# ブログ記事を作成する

Docusaurus は**各ブログ投稿のページ**、**ブログインデックスページ**、**タグシステム**、**RSS** フィードなどを作成します。

## 最初の投稿を作成する

ファイルを作成します。 `blog/2021-02-28-greetings.md`:

```md title="blog/2021-02-28-greetings.md"
---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
  - name: Sébastien Lorber
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much as you like.
```

新しいブログ投稿が [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings) で利用可能になりました。
