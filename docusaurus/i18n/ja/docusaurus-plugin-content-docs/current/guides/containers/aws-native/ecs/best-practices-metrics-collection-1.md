# Container Insights でシステムメトリクスを収集する
システムメトリクスは、サーバーの物理コンポーネントである CPU、メモリ、ディスク、ネットワークインターフェイスなどの低レベルリソースに関するものです。
[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用して、Amazon ECS にデプロイされたコンテナ化されたアプリケーションからシステムメトリクスを収集、集約、要約します。Container Insights は、コンテナの再起動失敗などの診断情報も提供し、問題を特定して迅速に解決するのに役立ちます。EC2 と Fargate 上で展開された Amazon ECS クラスターで利用できます。

Container Insights は、[埋め込みメトリック形式](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとしてデータを収集します。これらのパフォーマンスログイベントは、高カーディナリティデータを大規模に取り込んで保存できるよう、構造化された JSON スキーマを使用したエントリです。このデータから、CloudWatch はクラスター、ノード、サービス、タスクレベルで CloudWatch メトリクスとして集約メトリクスを作成します。

note
	Container Insights メトリクスを CloudWatch に表示するには、Amazon ECS クラスターで Container Insights を有効にする必要があります。これはアカウントレベルまたは個別のクラスターレベルで行えます。アカウントレベルで有効にするには、次の AWS CLI コマンドを使用します。

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    個別のクラスターレベルで有効にするには、次の AWS CLI コマンドを使用します。

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```


## クラスターレベルとサービスレベルのメトリクスを収集する
デフォルトでは、CloudWatch Container Insights はタスク、サービス、クラスターレベルでメトリクスを収集します。Amazon ECS エージェントは、EC2 コンテナインスタンス (ECS on EC2 と ECS on Fargate の両方) の各タスクに対してこれらのメトリクスを収集し、パフォーマンスログイベントとして CloudWatch に送信します。クラスターにエージェントをデプロイする必要はありません。メトリクスが抽出されるこれらのログイベントは、CloudWatch ロググループ */aws/ecs/containerinsights/$CLUSTER_NAME/performance* の下に収集されます。これらのイベントから抽出されるメトリクスの完全なリストは[こちらに文書化されています](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)。Container Insights が収集するメトリクスは、CloudWatch コンソールのナビゲーションページから *Container Insights* を選択し、ドロップダウンリストから *performance monitoring* を選択することで、事前構築されたダッシュボードで確認できます。また、CloudWatch コンソールの *Metrics* セクションでも確認できます。

![Container Insights メトリクスダッシュボード](../../../../images/ContainerInsightsMetrics.png)

note
    Amazon EC2 インスタンス上で Amazon ECS を使用している場合、Container Insights からネットワークとストレージのメトリクスを収集したい場合は、Amazon ECS エージェントバージョン 1.29 を含む AMI を使用してそのインスタンスを起動してください。


warning
    Container Insights によって収集されたメトリクスはカスタムメトリクスとして課金されます。CloudWatch の価格に関する詳細は、[Amazon CloudWatch 価格](https://aws.amazon.com/jp/cloudwatch/pricing/) をご覧ください。


## インスタンスレベルのメトリクスを収集する
EC2 上でホストされている Amazon ECS クラスターに CloudWatch エージェントをデプロイすると、クラスターからインスタンスレベルのメトリクスを収集できます。エージェントはデーモンサービスとしてデプロイされ、クラスター内の各 EC2 コンテナインスタンスからパフォーマンスログイベントとしてインスタンスレベルのメトリクスを送信します。これらのイベントから抽出されるインスタンスレベルのメトリクスの完全なリストは[こちらのドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)に記載されています。

info
    インスタンスレベルのメトリクスを収集するために Amazon ECS クラスターに CloudWatch エージェントをデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html)に記載されています。この方法は、Fargate 上でホストされている Amazon ECS クラスターでは利用できないことに注意してください。


## Logs Insights を使用したパフォーマンスログイベントの分析
Container Insights は、メトリック形式が埋め込まれたパフォーマンスログイベントを使用してメトリクスを収集します。各ログイベントには、CPU やメモリなどのシステムリソース、またはタスクやサービスなどの ECS リソースで観測されたパフォーマンスデータが含まれる可能性があります。Container Insights が Amazon ECS のクラスター、サービス、タスク、コンテナレベルで収集するパフォーマンスログイベントの例は[こちら](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html)に記載されています。CloudWatch は、これらのログイベントのパフォーマンスデータの一部に基づいてのみメトリクスを生成します。しかし、CloudWatch Logs Insights クエリを使用して、パフォーマンスデータの詳細な分析を行うことができます。

Logs Insights クエリを実行するユーザーインターフェースは、CloudWatch コンソールのナビゲーションページから *Logs Insights* を選択することで利用できます。ロググループを選択すると、CloudWatch Logs Insights はそのロググループのパフォーマンスログイベントのフィールドを自動的に検出し、右ペインの *Discovered* フィールドに表示します。クエリの実行結果は、このロググループの時間経過に伴うログイベントの棒グラフとして表示されます。この棒グラフは、クエリと時間範囲に一致するロググループ内のイベントの分布を示しています。

![Logs Insights ダッシュボード](../../../../images/LogInsights.png)

alert{type="info"}
以下は、CPU とメモリ使用量のコンテナレベルメトリクスを表示する Logs Insights クエリのサンプルです。

```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
