---
sidebar_position: 3
---




# ブログ投稿の作成

Docusaurus は **各ブログ投稿のページ** を作成するだけでなく、**ブログのインデックスページ**、**タグシステム**、**RSS** フィードなども作成します。




## 最初の投稿を作成する

`blog/2021-02-28-greetings.md` にファイルを作成します：

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

おめでとうございます！最初の投稿を作成しました！

この投稿を自由に編集して、お好きなだけ試してみてください。
```

新しいブログ投稿が [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings) で利用可能になりました。
