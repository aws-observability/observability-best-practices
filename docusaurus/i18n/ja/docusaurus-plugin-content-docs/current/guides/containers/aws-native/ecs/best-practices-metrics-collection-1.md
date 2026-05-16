# Container Insights によるシステムメトリクスの収集
システムメトリクスは、CPU、メモリ、ディスク、ネットワークインターフェイスなどのサーバー上の物理コンポーネントを含む低レベルのリソースに関連します。
[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用して、Amazon ECS にデプロイされたコンテナ化されたアプリケーションからシステムメトリクスを収集、集約、要約します。Container Insights は、コンテナの再起動失敗などの診断情報も提供し、問題を迅速に特定して解決するのに役立ちます。これは、EC2 と Fargate にデプロイされた Amazon ECS クラスターで利用できます。

Container Insights は、[埋め込みメトリクス形式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)を使用してパフォーマンスログイベントとしてデータを収集します。これらのパフォーマンスログイベントは、高カーディナリティデータを大規模に取り込んで保存できるようにする構造化 JSON スキーマを使用するエントリです。このデータから、CloudWatch はクラスター、ノード、サービス、タスクレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。 

:::note
	Container Insights メトリクスを CloudWatch に表示するには、Amazon ECS クラスターで Container Insights を有効にする必要があります。これは、アカウントレベルまたは個別のクラスターレベルのいずれかで実行できます。アカウントレベルで有効にするには、次の AWS CLI コマンドを使用します。

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    個別のクラスターレベルで有効にするには、次の AWS CLI コマンドを使用します。

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::

## クラスターレベルおよびサービスレベルのメトリクスの収集
デフォルトでは、CloudWatch Container Insights はタスク、サービス、クラスターレベルでメトリクスを収集します。Amazon ECS エージェントは、EC2 コンテナインスタンス上の各タスク (ECS on EC2 と ECS on Fargate の両方) に対してこれらのメトリクスを収集し、パフォーマンスログイベントとして CloudWatch に送信します。クラスターにエージェントをデプロイする必要はありません。メトリクスが抽出されるこれらのログイベントは、*/aws/ecs/containerinsights/$CLUSTER_NAME/performance* という名前の CloudWatch ロググループの下に収集されます。これらのイベントから抽出されるメトリクスの完全なリストは[こちらに記載されています](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)。Container Insights が収集するメトリクスは、CloudWatch コンソールで利用可能な事前構築されたダッシュボードで簡単に表示できます。ナビゲーションページから *Container Insights* を選択し、ドロップダウンリストから *performance monitoring* を選択します。これらは CloudWatch コンソールの *Metrics* セクションでも表示できます。

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    Amazon EC2 インスタンスで Amazon ECS を使用していて、Container Insights からネットワークおよびストレージメトリクスを収集する場合は、Amazon ECS エージェントバージョン 1.29 を含む AMI を使用してそのインスタンスを起動してください。
:::

:::warning
    Container Insights によって収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金の詳細については、[Amazon CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。
:::

## インスタンスレベルのメトリクスの収集
EC2 上でホストされる Amazon ECS クラスターに CloudWatch エージェントをデプロイすると、クラスターからインスタンスレベルのメトリクスを収集できます。エージェントはデーモンサービスとしてデプロイされ、クラスター内の各 EC2 コンテナインスタンスからパフォーマンスログイベントとしてインスタンスレベルのメトリクスを送信します。これらのイベントから抽出されるインスタンスレベルのメトリクスの完全なリストは[こちらに記載されています](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)。

:::info
    Amazon ECS クラスターに CloudWatch エージェントをデプロイしてインスタンスレベルのメトリクスを収集する手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html)に記載されています。このオプションは、Fargate でホストされている Amazon ECS クラスターでは使用できないことに注意してください。
:::
    
## Logs Insights を使用したパフォーマンスログイベントの分析
Container Insights は、埋め込みメトリクス形式のパフォーマンスログイベントを使用してメトリクスを収集します。各ログイベントには、CPU やメモリなどのシステムリソース、またはタスクやサービスなどの ECS リソースで観測されたパフォーマンスデータが含まれる場合があります。Container Insights が Amazon ECS からクラスター、サービス、タスク、コンテナレベルで収集するパフォーマンスログイベントの例は、[こちらに記載されています](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html)。CloudWatch は、これらのログイベント内のパフォーマンスデータの一部のみに基づいてメトリクスを生成します。ただし、これらのログイベントを使用して、CloudWatch Logs Insights クエリを使用したパフォーマンスデータのより深い分析を実行できます。

Logs Insights クエリを実行するためのユーザーインターフェイスは、CloudWatch コンソールのナビゲーションページから *Logs Insights* を選択することで利用できます。ログループを選択すると、CloudWatch Logs Insights は自動的にログループ内のパフォーマンスログイベントのフィールドを検出し、右側のペインの *Discovered* フィールドに表示します。クエリ実行の結果は、このログループ内のログイベントの時系列の棒グラフとして表示されます。この棒グラフは、クエリと時間範囲に一致するログループ内のイベントの分布を示しています。

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    コンテナレベルのメトリクスを表示する Logs Insights クエリのサンプルを以下に示します。CPU とメモリ使用量を確認できます。
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::