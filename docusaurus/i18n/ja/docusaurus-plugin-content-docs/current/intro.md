---
sidebar_position: 1
---
# チュートリアル入門

**5 分以内に Docusaurus を学びましょう**。

## はじめに

**新しいサイトを作成**して始めましょう。

または、[docusaurus.new](https://docusaurus.new) で **Docusaurus をすぐに試す**ことができます。

### 必要なもの

- [Node.js](https://nodejs.org/en/download/) バージョン 18.0 以上
  - Node.js をインストールする際は、依存関係に関連するすべてのチェックボックスにチェックを入れることをお勧めします。

## 新しいサイトを生成する

**クラシックテンプレート**を使用して新しい Docusaurus サイトを生成します。

クラシックテンプレートは、コマンドを実行すると自動的にプロジェクトに追加されます。

```bash
npm init docusaurus@latest my-website classic
```

このコマンドは、コマンドプロンプト、Powershell、ターミナル、またはコードエディタの統合ターミナルに入力できます。

このコマンドは、Docusaurus を実行するために必要なすべての依存関係もインストールします。

## サイトを起動する

開発サーバーを実行します。

```bash
cd my-website
npm run start
```

The `cd` コマンドは、作業中のディレクトリを変更します。新しく作成した Docusaurus サイトで作業するには、ターミナルでそのディレクトリに移動する必要があります。

The `npm run start` コマンドは、Web サイトをローカルでビルドし、開発サーバーを通じて提供します。http://localhost:3000/ で表示できます。

開く `docs/intro.md` (このページ) を編集すると、サイトが**自動的にリロード**され、変更が表示されます。
