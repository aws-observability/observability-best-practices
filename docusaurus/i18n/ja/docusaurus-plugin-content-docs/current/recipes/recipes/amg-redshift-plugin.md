# Amazon Managed Grafana で Redshift を使用する

このレシピでは、[Amazon Redshift][redshift] (標準 SQL を使用するペタバイトスケールのデータウェアハウスサービス) を [Amazon Managed Grafana][amg] で使用する方法を示します。この統合は、オープンソースの [Grafana 用 Redshift データソース][redshift-ds] によって可能になっており、自分で構築した Grafana インスタンスでも、Amazon Managed Grafana にも事前にインストールされています。

note
    このガイドの完了には約 10 分かかります。


## 前提条件

1. アカウントから Amazon Redshift への管理者アクセス権があります。
2. Amazon Redshift クラスターに `GrafanaDataSource: true` のタグを付けます。
3. サービス管理ポリシーの恩恵を受けるには、以下のいずれかの方法でデータベース資格情報を作成します。
    1. 一時的な資格情報オプションを使用して Redshift データベースに対して認証する場合は、`redshift_data_api_user` という名前のデータベースユーザーを作成する必要があります。
    2. Secrets Manager の資格情報を使用する場合は、シークレットに `RedshiftQueryOwner: true` のタグを付ける必要があります。

tip
    サービス管理ポリシーまたはカスタムポリシーを使用する方法の詳細については、[Amazon Managed Grafana ドキュメントの例][svpolicies]を参照してください。


## インフラストラクチャ

Grafana インスタンスが必要なので、[Amazon Managed Grafana ワークスペース][amg-workspace] を新規に設定してください。たとえば、[Getting Started][amg-getting-started] ガイドを使用するか、既存のものを使用します。

note
    AWS データソースの設定を使用するには、まず Amazon Managed Grafana コンソールに移動して、ワークスペースに Athena リソースを読み取るために必要な IAM ポリシーを付与するサービス管理の IAM ロールを有効にします。


Athena データソースを設定するには、左側のツールバーを使用して下部の AWS アイコンを選択し、次に「Redshift」を選択します。
プラグインが使用する Redshift データソースを検出するデフォルトのリージョンを選択し、次に使用するアカウントを選択し、最後に「データソースの追加」を選択します。

または、次の手順に従って Redshift データソースを手動で追加して設定することもできます。

1. 左側のツールバーの「設定」アイコンをクリックし、次に「データソースの追加」をクリックします。
2. 「Redshift」を検索します。
3. [オプション] 認証プロバイダーを設定します (推奨: ワークスペース IAM ロール)。
4. 「クラスター識別子」、「データベース」、「データベースユーザー」の値を入力します。
5. 「保存してテスト」をクリックします。

次のような画面が表示されるはずです。

![Redshift データソース設定のスクリーンショット](../images/amg-plugin-redshift-ds.png)

## 使用方法
[Redshift 高度なモニタリング][redshift-mon] のセットアップを使用します。
すべてがすぐに利用可能なので、この時点で設定する必要はありません。

Redshift プラグインに含まれている Redshift モニタリングダッシュボードをインポートできます。
インポートすると、次のような画面が表示されるはずです。

![Amazon Managed Grafana の Redshift ダッシュボードのスクリーンショット](../images/amg-redshift-mon-dashboard.png)

ここから、Amazon Managed Grafana で独自のダッシュボードを作成するために、次のガイドを使用できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上です。おめでとうございます。Grafana から Redshift を使用する方法を学びました!

## クリーンアップ

使用していた Redshift データベースと、コンソールから削除することで Amazon Managed Grafana ワークスペースを削除してください。
