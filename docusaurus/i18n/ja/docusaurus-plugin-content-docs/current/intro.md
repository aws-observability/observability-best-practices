---
sidebar_position: 1
---




# チュートリアルの概要

**5 分以内で Docusaurus** について学んでいきましょう。



## はじめに

**新しいサイトを作成** して始めましょう。

または **[docusaurus.new](https://docusaurus.new)** で **Docusaurus をすぐに試す** ことができます。




### 必要なもの

- [Node.js](https://nodejs.org/en/download/) バージョン 18.0 以上:
  - Node.js をインストールする際は、依存関係に関連するすべてのチェックボックスにチェックを入れることをお勧めします。




## 新しいサイトの生成

**クラシックテンプレート** を使用して、新しい Docusaurus サイトを生成します。

以下のコマンドを実行すると、クラシックテンプレートが自動的にプロジェクトに追加されます：

```bash
npm init docusaurus@latest my-website classic
```

このコマンドは、コマンドプロンプト、PowerShell、ターミナル、またはコードエディタの統合ターミナルで実行できます。

このコマンドは、Docusaurus の実行に必要なすべての依存関係もインストールします。




## サイトを起動する

開発サーバーを起動します:

```bash
cd my-website
npm run start
```

`cd` コマンドは作業するディレクトリを変更します。新しく作成した Docusaurus サイトを操作するには、ターミナルでそのディレクトリに移動する必要があります。

`npm run start` コマンドはローカルでウェブサイトをビルドし、開発サーバーを通じて提供します。http://localhost:3000/ でサイトを確認できます。

`docs/intro.md`（このページ）を開いて数行を編集してみましょう。サイトは**自動的にリロード**され、変更が表示されます。
