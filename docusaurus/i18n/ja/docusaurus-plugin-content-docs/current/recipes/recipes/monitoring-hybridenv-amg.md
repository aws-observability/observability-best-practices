# Amazon Managed Service for Grafana を使用したハイブリッド環境の監視

このレシピでは、Azure Cloud 環境からのメトリクスを [Amazon Managed Service for Grafana](https://aws.amazon.com/grafana/) (AMG) で可視化し、AMG でアラート通知を作成して [Amazon Simple Notification Service](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) と Slack に送信する方法を説明します。

実装の一環として、AMG ワークスペースを作成し、AMG のデータソースとして Azure Monitor プラグインを設定し、Grafana ダッシュボードを設定します。Amazon SNS 用と Slack 用の 2 つの通知チャネルを作成します。また、AMG ダッシュボードでアラートを設定し、通知チャネルに送信するように構成します。

:::note
    このガイドは完了までに約 30 分かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。 

### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS-SSO](https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html) を有効にする必要があります。

### アーキテクチャ


まず、Azure Monitor からのメトリクスを可視化するための AMG ワークスペースを作成します。[Getting Started with Amazon Managed Service for Grafana](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ブログ記事の手順に従ってください。ワークスペースを作成した後、個々のユーザーまたはユーザーグループに Grafana ワークスペースへのアクセスを割り当てることができます。デフォルトでは、ユーザーのユーザータイプは viewer です。ユーザーロールに基づいてユーザータイプを変更してください。

:::note 
    ワークスペースの少なくとも 1 人のユーザーに Admin ロールを割り当てる必要があります。
:::
図 1 では、ユーザー名は grafana-admin です。ユーザータイプは Admin です。Data sources タブで、必要なデータソースを選択します。設定を確認してから、Create workspace を選択します。
![azure-monitor-grafana-demo](../images/azure-monitor-grafana.png)



### データソースとカスタムダッシュボードを設定する

次に、データソースで Azure Monitor プラグインを設定し、Azure 環境からメトリクスのクエリと可視化を開始します。データソースを選択してデータソースを追加します。
![datasources](../images/datasource.png)

データソースの追加で、Azure Monitor を検索し、Azure 環境のアプリ登録コンソールからパラメータを設定します。
![Add data source](../images/datasource-addition.png)

Azure Monitor プラグインを設定するには、ディレクトリ (テナント) ID とアプリケーション (クライアント) ID が必要です。手順については、Azure AD アプリケーションとサービスプリンシパルの作成に関する[記事](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)を参照してください。この記事では、アプリを登録し、Grafana がデータをクエリするためのアクセス権を付与する方法について説明しています。

![Azure-Monitor-metrics](../images/azure-monitor-metrics.png)

データソースの設定後、カスタムダッシュボードをインポートして Azure メトリクスを分析します。左側のペインで + アイコンを選択し、Import を選択します。

grafana.com 経由でインポートで、ダッシュボード ID として 10532 を入力します。

![Importing-dashboard](../images/import-dashboard.png)

これにより、Azure Virtual Machine ダッシュボードがインポートされ、Azure Monitor メトリクスの分析を開始できます。私のセットアップでは、Azure 環境で仮想マシンが実行されています。

![Azure-Monitor-Dashbaord](../images/azure-dashboard.png)


### AMG で通知チャネルを設定する

このセクションでは、2 つの通知チャネルを設定してからアラートを送信します。

以下のコマンドを使用して、grafana-notification という名前の SNS トピックを作成し、メールアドレスをサブスクライブします。

```
aws sns create-topic --name grafana-notification
aws sns subscribe --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification --protocol email --notification-endpoint <email-id>

```
左側のペインで、ベルアイコンを選択して新しい通知チャネルを追加します。
次に、grafana-notification 通知チャネルを設定します。Edit notification channel で、Type に AWS SNS を選択します。Topic には、先ほど作成した SNS トピックの ARN を使用します。Auth Provider には、ワークスペース IAM ロールを選択します。

![Notification Channels](../images/notification-channels.png)

### Slack 通知チャネル 
Slack 通知チャネルを設定するには、Slack ワークスペースを作成するか、既存のワークスペースを使用します。[Incoming Webhook を使用したメッセージの送信](https://api.slack.com/messaging/webhooks)の説明に従って、Incoming Webhook を有効にします。

ワークスペースを設定すると、Grafana ダッシュボードで使用される Webhook URL を取得できるようになります。

![Slack notification Channel](../images/slack-notification.png)





### AMG でアラートを設定する

メトリクスがしきい値を超えて増加した場合に Grafana アラートを設定できます。AMG を使用すると、ダッシュボードでアラートを評価する頻度を設定し、通知を送信できます。この例では、Azure 仮想マシンの CPU 使用率に対するアラートを設定します。使用率がしきい値を超えた場合、AMG が両方のチャネルに通知を送信するように設定します。

ダッシュボードで、ドロップダウンから CPU 使用率を選択し、Edit を選択します。グラフパネルの Alert タブで、アラートルールを評価する頻度と、アラートが状態を変更して通知を開始するために満たす必要がある条件を設定します。

次の設定では、CPU 使用率が 50% を超えた場合にアラートが作成されます。通知は grafana-alert-notification チャネルと slack-alert-notification チャネルに送信されます。

![Azure VM Edit panel](../images/alert-config.png)

これで、Azure 仮想マシンにサインインし、stress などのツールを使用してストレステストを開始できます。CPU 使用率がしきい値を超えると、両方のチャネルで通知を受け取ります。

次に、CPU 使用率のアラートを適切なしきい値で設定し、Slack チャネルに送信されるアラートをシミュレートします。

## まとめ

このレシピでは、AMG ワークスペースのデプロイ、通知チャネルの設定、Azure Cloud からのメトリクスの収集、AMG ダッシュボードでのアラートの設定方法を紹介しました。AMG は完全マネージド型のサーバーレスソリューションであるため、ビジネスを変革するアプリケーションに時間を費やすことができ、Grafana の管理という重労働は AWS に任せることができます。
