# Amazon Managed Grafana で Redshift を使用する

このレシピでは、[Amazon Redshift][redshift]（標準 SQL を使用したペタバイト規模のデータウェアハウスサービス）を [Amazon Managed Grafana][amg] で使用する方法を説明します。この統合は、[Redshift data source for Grafana][redshift-ds] によって実現されています。これは、DIY Grafana インスタンスで使用できるオープンソースプラグインであり、Amazon Managed Grafana にはプリインストールされています。

:::note
    このガイドは完了まで約 10 分かかります。
:::
## 前提条件

1. アカウントから Amazon Redshift への管理者アクセス権があること。
1. Amazon Redshift クラスタに次のタグを付けます `GrafanaDataSource: true`1. サービスマネージド型ポリシーのメリットを活用するには、次のいずれかの方法でデータベース認証情報を作成します。
    1. デフォルトのメカニズム、つまり一時的な認証情報オプションを使用して Redshift データベースに対して認証する場合は、次の名前のデータベースユーザーを作成する必要があります `redshift_data_api_user`1. Secrets Manager の認証情報を使用する場合は、シークレットに次のタグを付ける必要があります `RedshiftQueryOwner: true`.

:::tip
    サービスマネージド型またはカスタムポリシーの使用方法の詳細については、[Amazon Managed Grafana ドキュメントの例][svpolicies]を参照してください。
:::

## インフラストラクチャ
Grafana インスタンスが必要なので、新しい [Amazon Managed Grafana ワークスペース][amg-workspace]をセットアップしてください。たとえば、[Getting Started][amg-getting-started] ガイドを使用するか、既存のものを使用します。

:::note
    AWS データソースの設定を使用するには、まず Amazon Managed Grafana コンソールに移動して、ワークスペースに Athena リソースを読み取るために必要な IAM ポリシーを付与するサービスマネージド IAM ロールを有効にします。
:::

Athena データソースを設定するには、左側のツールバーを使用して下部の AWS アイコンを選択し、「Redshift」を選択します。プラグインが使用する Redshift データソースを検出するデフォルトのリージョンを選択し、必要なアカウントを選択して、最後に「Add data source」を選択します。

あるいは、次の手順に従って、Redshift データソースを手動で追加および設定できます。

1. 左側のツールバーにある「Configurations」アイコンをクリックし、次に「Add data source」をクリックします。
1. 「Redshift」を検索します。
1. [オプション] 認証プロバイダーを設定します (推奨: workspace IAM role)。
1. 「Cluster Identifier」、「Database」、および「Database User」の値を入力します。
1. 「Save & test」をクリックします。

次のような内容が表示されます。

![Screen shot of the Redshift data source config](../images/amg-plugin-redshift-ds.png)

## 使用方法
[Redshift Advance Monitoring][redshift-mon] セットアップを使用します。
すべてがすぐに利用可能であるため、この時点で設定する必要はありません。

Redshift プラグインに含まれている Redshift モニタリングダッシュボードをインポートできます。インポートすると、次のように表示されます。

![Screen shot of the Redshift dashboard in AMG](../images/amg-redshift-mon-dashboard.png)

ここから、以下のガイドを使用して Amazon Managed Grafana で独自のダッシュボードを作成できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上です。おめでとうございます。Grafana から Redshift を使用する方法を学習しました。

## クリーンアップ

使用していた Redshift データベースを削除し、その後コンソールから削除することで Amazon Managed Grafana ワークスペースを削除します。

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
