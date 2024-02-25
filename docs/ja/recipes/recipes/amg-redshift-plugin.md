# Amazon Managed Grafana での Redshift の使用

このレシピでは、[Amazon Redshift][redshift](標準 SQL を使用したペタバイトスケールのデータウェアハウスサービス) を [Amazon Managed Grafana][amg] で使用する方法を示します。この統合は、[Grafana 用 Redshift データソース][redshift-ds](DIY Grafana インスタンスで使用できるオープンソースプラグインで、Amazon Managed Grafana にプリインストールされています) によって可能になります。 

!!! note
    このガイドの完了には約 10 分かかります。

## 前提条件

1. アカウントからAmazon Redshiftへの管理者アクセス権を持っている
1. Amazon Redshiftクラスターに`GrafanaDataSource: true`タグを付ける
1. サービス管理ポリシーのメリットを活用するために、以下のいずれかの方法でデータベース資格情報を作成します
    1. デフォルトのメカニズム、つまりRedshiftデータベースに対して一時的な資格情報オプションを使用して認証する場合は、`redshift_data_api_user`という名前のデータベースユーザーを作成する必要があります
    1. Secrets Managerの資格情報を使用する場合は、シークレットに`RedshiftQueryOwner: true`タグを付ける必要があります

!!! tip
    サービス管理ポリシーまたはカスタムポリシーの使用方法の詳細は、
    [Amazon Managed Grafanaドキュメントの例][svpolicies]を参照してください。

## インフラストラクチャ
Grafana インスタンスが必要なので、[Amazon Managed Grafana ワークスペース][amg-workspace] を新規にセットアップするか、[Getting Started][amg-getting-started] ガイドを使用するなどしてセットアップしてください。または、既存のワークスペースを使用しても構いません。

!!! note
    AWS データソースの構成を使用するには、まず Amazon Managed Grafana コンソールに移動し、Athena リソースを読み取るために必要な IAM ポリシーをワークスペースに付与する、サービスマネージドの IAM ロールを有効にしてください。


Athena データソースを設定するには、左側のツールバーを使用し、下の AWS アイコンを選択してから「Redshift」を選択します。プラグインが Redshift データソースを検出するために使用するデフォルトリージョンを選択し、使用したいアカウントを選択して、最後に「Add data source」を選択します。

あるいは、次の手順に従って Redshift データソースを手動で追加および構成することもできます。

1. 左側のツールバーの「Configurations」アイコンをクリックし、次に「Add data source」をクリックします。  
2. 「Redshift」と入力します。
3. [オプション] 認証プロバイダーを構成します(推奨: ワークスペースの IAM ロール)。
4. 「Cluster Identifier」、「Database」、「Database User」の値を入力します。 
5. 「Save & test」をクリックします。

次のような画面が表示されるはずです。

![Redshift データソース設定のスクリーンショット](../images/amg-plugin-redshift-ds.png)

## 使い方
[Redshift アドバンスドモニタリング][redshift-mon] の設定を使用します。
すべてがすぐに利用できる状態なので、この時点では構成する必要はありません。

Redshift プラグインに含まれている Redshift モニタリングダッシュボードをインポートできます。インポートすると、次のような画面が表示されます。

![AMG の Redshift ダッシュボードのスクリーンショット](../images/amg-redshift-mon-dashboard.png)

ここから、Amazon Managed Grafana で独自のダッシュボードを作成するために、次のガイドを使用できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上です。おめでとうございます。Grafana から Redshift の使い方を学ぶことができました!

## クリーンアップ

使用していた Redshift データベースと Amazon Managed Grafana ワークスペースをコンソールから削除してください。

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
