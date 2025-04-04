# Container Insights を使用したシステムメトリクスの収集
システムメトリクスは、CPU、メモリ、ディスク、ネットワークインターフェイスなど、サーバー上の物理コンポーネントを含む低レベルのリソースに関連しています。

[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用して、Amazon ECS にデプロイされたコンテナ化アプリケーションからシステムメトリクスを収集、集約、要約します。
Container Insights は、コンテナの再起動失敗などの診断情報も提供し、問題の特定と迅速な解決を支援します。
これは EC2 と Fargate にデプロイされた Amazon ECS クラスターで利用できます。

Container Insights は、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとしてデータを収集します。
これらのパフォーマンスログイベントは、高カーディナリティデータをスケールに応じて取り込み、保存できる構造化された JSON スキーマを使用するエントリです。
このデータから、CloudWatch はクラスター、ノード、サービス、タスクレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。

:::note
CloudWatch で Container Insights のメトリクスを表示するには、Amazon ECS クラスターで Container Insights を有効にする必要があります。
これはアカウントレベルまたは個別のクラスターレベルで行うことができます。
アカウントレベルで有効にするには、次の AWS CLI コマンドを使用します：

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

個別のクラスターレベルで有効にするには、次の AWS CLI コマンドを使用します：

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::



## クラスターレベルとサービスレベルのメトリクスの収集
デフォルトでは、CloudWatch Container Insights はタスク、サービス、クラスターレベルでメトリクスを収集します。
Amazon ECS エージェントは、EC2 コンテナインスタンス上の各タスク（ECS on EC2 と ECS on Fargate の両方）のメトリクスを収集し、パフォーマンスログイベントとして CloudWatch に送信します。
クラスターにエージェントをデプロイする必要はありません。
メトリクスの抽出元となるこれらのログイベントは、*/aws/ecs/containerinsights/$CLUSTER_NAME/performance* という名前の CloudWatch ロググループに収集されます。
これらのイベントから抽出されるメトリクスの完全なリストは[こちらに記載](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)されています。
Container Insights が収集するメトリクスは、CloudWatch コンソールのナビゲーションページから *Container Insights* を選択し、ドロップダウンリストから *performance monitoring* を選択することで、事前に構築されたダッシュボードで簡単に確認できます。
また、CloudWatch コンソールの *Metrics* セクションでも確認できます。

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    Amazon EC2 インスタンス上で Amazon ECS を使用していて、Container Insights からネットワークとストレージのメトリクスを収集したい場合は、Amazon ECS エージェントバージョン 1.29 を含む AMI を使用してそのインスタンスを起動してください。
:::

:::warning
    Container Insights で収集されるメトリクスはカスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch の料金](https://aws.amazon.com/jp/cloudwatch/pricing/) をご覧ください。
:::



## インスタンスレベルのメトリクスの収集
EC2 上でホストされている Amazon ECS クラスターに CloudWatch エージェントをデプロイすることで、クラスターからインスタンスレベルのメトリクスを収集できます。エージェントは daemon サービスとしてデプロイされ、クラスター内の各 EC2 コンテナインスタンスからパフォーマンスログイベントとしてインスタンスレベルのメトリクスを送信します。これらのイベントから抽出されるインスタンスレベルのメトリクスの完全なリストは、[こちらに記載されています](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)。

:::info
インスタンスレベルのメトリクスを収集するために CloudWatch エージェントを Amazon ECS クラスターにデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html)に記載されています。なお、このオプションは Fargate でホストされている Amazon ECS クラスターでは利用できません。
:::



## Logs Insights を使用したパフォーマンスログイベントの分析
Container Insights は、埋め込みメトリクス形式のパフォーマンスログイベントを使用してメトリクスを収集します。
各ログイベントには、CPU やメモリなどのシステムリソース、またはタスクやサービスなどの ECS リソースで観測されたパフォーマンスデータが含まれる場合があります。
Container Insights がクラスター、サービス、タスク、コンテナレベルで Amazon ECS から収集するパフォーマンスログイベントの例は、[こちらに記載](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html)されています。
CloudWatch は、これらのログイベント内のパフォーマンスデータの一部に基づいてメトリクスを生成します。
しかし、CloudWatch Logs Insights クエリを使用して、これらのログイベントのパフォーマンスデータをより深く分析することができます。

Logs Insights クエリを実行するためのユーザーインターフェースは、ナビゲーションページから *Logs Insights* を選択することで CloudWatch コンソールで利用できます。
ロググループを選択すると、CloudWatch Logs Insights は自動的にロググループ内のパフォーマンスログイベントのフィールドを検出し、右ペインの *Discovered* フィールドに表示します。
クエリ実行の結果は、時系列でのロググループ内のログイベントの棒グラフとして表示されます。
この棒グラフは、クエリと時間範囲に一致するロググループ内のイベントの分布を示しています。

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    以下は、CPU とメモリ使用量のコンテナレベルのメトリクスを表示する Logs Insights クエリのサンプルです。
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::
