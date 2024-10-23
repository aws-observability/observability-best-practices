# Amazon Managed Service for Grafana を使用したハイブリッド環境のモニタリング

このレシピでは、Azure Cloud 環境からのメトリクスを [Amazon Managed Service for Grafana](https://aws.amazon.com/jp/grafana/) (AMG) で可視化し、AMG でアラート通知を作成して [Amazon Simple Notification Service](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html) と Slack に送信する方法を紹介します。

実装の一環として、AMG ワークスペースを作成し、Azure Monitor プラグインを AMG のデータソースとして設定し、Grafana ダッシュボードを構成します。Amazon SNS 用と Slack 用の 2 つの通知チャンネルを作成します。また、AMG ダッシュボードでアラートを設定し、通知チャンネルに送信するように構成します。

:::note
    このガイドは約 30 分で完了します。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。




### 前提条件

* AWS CLI が環境に [インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html) され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html) されていること。
* [AWS SSO](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/step1.html) を有効にする必要があること。



### アーキテクチャ

まず、Azure Monitor からのメトリクスを可視化するために AMG ワークスペースを作成します。[Amazon Managed Service for Grafana の使用開始](https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/) のブログ記事の手順に従ってください。ワークスペースを作成した後、個々のユーザーまたはユーザーグループに Grafana ワークスペースへのアクセスを割り当てることができます。デフォルトでは、ユーザーのタイプは閲覧者です。ユーザーの役割に基づいてユーザータイプを変更してください。

:::note 
    ワークスペース内で少なくとも 1 人のユーザーに管理者ロールを割り当てる必要があります。
:::

図 1 では、ユーザー名は grafana-admin です。ユーザータイプは管理者です。データソースタブで、必要なデータソースを選択します。設定を確認し、「ワークスペースの作成」を選択します。

![azure-monitor-grafana-demo](../images/azure-monitor-grafana.png)



### データソースとカスタムダッシュボードの設定

次に、データソースの下で Azure Monitor プラグインを設定し、Azure 環境からのメトリクスのクエリと可視化を開始します。データソースを追加するには、「Data sources」を選択します。
![datasources](../images/datasource.png)

「Add data source」で、Azure Monitor を検索し、Azure 環境のアプリ登録コンソールからパラメータを設定します。
![Add data source](../images/datasource-addition.png)

Azure Monitor プラグインを設定するには、ディレクトリ (テナント) ID とアプリケーション (クライアント) ID が必要です。手順については、Azure AD アプリケーションとサービスプリンシパルの作成に関する[記事](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)を参照してください。この記事では、アプリの登録方法と、Grafana にデータのクエリを許可するためのアクセス権の付与方法について説明しています。

![Azure-Monitor-metrics](../images/azure-monitor-metrics.png)

データソースの設定が完了したら、Azure メトリクスを分析するためのカスタムダッシュボードをインポートします。左側のペインで + アイコンを選択し、「Import」を選択します。

「Import via grafana.com」で、ダッシュボード ID 10532 を入力します。

![Importing-dashboard](../images/import-dashboard.png)

これにより、Azure 仮想マシンダッシュボードがインポートされ、Azure Monitor メトリクスの分析を開始できます。私のセットアップでは、Azure 環境で仮想マシンが稼働しています。

![Azure-Monitor-Dashbaord](../images/azure-dashboard.png)



### AMG の通知チャンネルを設定する

このセクションでは、2 つの通知チャンネルを設定し、アラートを送信します。

以下のコマンドを使用して、grafana-notification という名前の SNS トピックを作成し、メールアドレスを登録します。

```
aws sns create-topic --name grafana-notification
aws sns subscribe --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification --protocol email --notification-endpoint <email-id>

```
左側のペインで、ベルアイコンを選択して新しい通知チャンネルを追加します。
次に、grafana-notification 通知チャンネルを設定します。通知チャンネルの編集画面で、タイプに「AWS SNS」を選択します。トピックには、先ほど作成した SNS トピックの ARN を使用します。認証プロバイダーには、ワークスペースの IAM ロールを選択します。

![Notification Channels](../images/notification-channels.png)



### Slack 通知チャンネル

Slack 通知チャンネルを設定するには、Slack ワークスペースを作成するか、既存のものを使用します。[Incoming Webhooks を使用したメッセージの送信](https://api.slack.com/messaging/webhooks) の説明に従って、Incoming Webhooks を有効にします。

ワークスペースを設定したら、Grafana ダッシュボードで使用する webhook URL を取得できるはずです。

![Slack 通知チャンネル](../images/slack-notification.png)



### AMG でアラートを設定する

メトリクスがしきい値を超えた場合に Grafana アラートを設定できます。AMG を使用すると、ダッシュボードでアラートを評価する頻度を設定し、通知を送信できます。この例では、Azure 仮想マシンの CPU 使用率のアラートを設定します。使用率がしきい値を超えた場合、AMG が両方のチャンネルに通知を送信するように設定します。

ダッシュボードで、ドロップダウンから CPU 使用率を選択し、「Edit」を選択します。グラフパネルの「Alert」タブで、アラートルールを評価する頻度と、アラートの状態を変更して通知を開始するために満たす必要がある条件を設定します。

以下の設定では、CPU 使用率が 50% を超えた場合にアラートが作成されます。通知は grafana-alert-notification チャンネルと slack-alert-notification チャンネルの両方に送信されます。

![Azure VM Edit panel](../images/alert-config.png)

これで、Azure 仮想マシンにサインインし、stress などのツールを使用してストレステストを開始できます。CPU 使用率がしきい値を超えると、両方のチャンネルで通知を受け取ります。

次に、適切なしきい値で CPU 使用率のアラートを設定し、Slack チャンネルに送信されるアラートをシミュレートします。



## まとめ

このレシピでは、AMG ワークスペースのデプロイ、通知チャネルの設定、Azure Cloud からのメトリクスの収集、AMG ダッシュボードでのアラートの設定方法を紹介しました。AMG は完全マネージド型のサーバーレスソリューションであるため、Grafana の管理という煩雑な作業は AWS に任せ、ビジネスを変革するアプリケーションに時間を費やすことができます。
