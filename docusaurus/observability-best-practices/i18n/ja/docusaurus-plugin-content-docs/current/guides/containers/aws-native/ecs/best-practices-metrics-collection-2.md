# Container Insights でのサービスメトリクスの収集

サービスメトリクスは、コードに計装を追加することでキャプチャされるアプリケーションレベルのメトリクスです。これらのメトリクスは、2 つの異なるアプローチを使用してアプリケーションからキャプチャできます。

1. プッシュアプローチ: ここでは、アプリケーションがメトリクスデータを直接送信先に送信します。たとえば、CloudWatch PutMetricData API を使用することで、アプリケーションは CloudWatch にメトリクスデータポイントを発行できます。アプリケーションは、OpenTelemetry Collector などのエージェントに対して、OpenTelemetry プロトコル (OTLP) を介して gRPC または HTTP でデータを送信することもできます。後者はその後、メトリクスデータを最終送信先に送信します。

2. プルアプローチ: ここでは、アプリケーションは事前定義されたフォーマットで HTTP エンドポイントにメトリクスデータを公開します。その後、このエンドポイントにアクセスできるエージェントによってデータがスクレイプされ、送信先に送信されます。

![メトリクス収集のプッシュアプローチ](../../../../images/PushPullApproach.png)

## CloudWatch Container Insights による Prometheus のモニタリング
[Prometheus](https://prometheus.io/docs/introduction/overview/) は、人気のオープンソースのシステムモニタリングおよびアラートツールキットです。コンテナ化されたアプリケーションから pull アプローチを使用してメトリクスを収集するためのデファクトスタンダードとして浮上しています。Prometheus を使用してメトリクスをキャプチャするには、まずメジャーなすべてのプログラミング言語で利用できる Prometheus の[クライアントライブラリ](https://prometheus.io/docs/instrumenting/clientlibs/) を使用してアプリケーションコードにインスツルメンテーションする必要があります。メトリクスは通常、Prometheus サーバーが読み取るために HTTP 経由でアプリケーションから公開されます。

Prometheus サーバーがアプリケーションの HTTP エンドポイントをスクレイプすると、クライアントライブラリは追跡されているすべてのメトリクスの現在の状態をサーバーに送信します。サーバーはメトリクスをローカルストレージに保存したり、CloudWatch などのリモート先にメトリクスデータを送信したりできます。

[CloudWatch Container Insights による Prometheus モニタリング](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) を使用すると、Amazon ECS クラスターで Prometheus の機能を活用できます。これは、EC2 と Fargate 上にデプロイされた Amazon ECS クラスターで利用できます。CloudWatch エージェントは、Prometheus サーバーのドロップイン置換として使用でき、可観測性を向上させるために必要なモニタリングツールの数を削減します。これにより、Amazon ECS にデプロイされたコンテナ化されたアプリケーションからの Prometheus メトリクスの自動検出が可能になり、メトリクスデータがパフォーマンスログイベントとして CloudWatch に送信されます。

:::info
    Prometheus メトリクス収集用の CloudWatch エージェントを Amazon ECS クラスターにデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)に記載されています。
    Container Insights による Prometheus モニタリングで収集されるメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch 料金](https://aws.amazon.com/jp/cloudwatch/pricing/) を参照してください。
:::
### Amazon ECS クラスター上のターゲットの自動検出

CloudWatch エージェントは、Prometheus ドキュメントの [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) セクションで定義されている標準の Prometheus スクレイプ構成をサポートしています。Prometheus は、サポートされている数十種類の [サービス検出メカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) のいずれかを使用して、スクレイプ対象の静的および動的検出の両方をサポートしています。Amazon ECS には組み込みのサービス検出メカニズムがないため、エージェントはターゲットのファイルベースの検出をサポートする Prometheus に依存しています。ファイルベースのターゲット検出のためにエージェントを設定するには、エージェントの起動に使用されるタスク定義で定義されている 2 つの [構成パラメータ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html) が必要です。これらのパラメータをカスタマイズすることで、エージェントが収集するメトリクスを細かく制御できます。

最初のパラメータには、次のサンプルのような Prometheus のグローバル構成が含まれています。

```
global:
  scrape_interval: 30s
  scrape_timeout: 10s
scrape_configs:
  - job_name: cwagent_ecs_auto_sd
    sample_limit: 10000
    file_sd_configs:
      - files: [ "/tmp/cwagent_ecs_auto_sd.yaml" ] 
```

2番目のパラメータには、スクレイピング対象の検出を支援する構成が含まれています。エージェントは定期的に Amazon ECS への API 呼び出しを行い、この構成の *ecs_service_discovery* セクションで定義されたタスク定義パターンに一致する実行中の ECS タスクのメタデータを取得します。検出されたすべてのターゲットは、CloudWatch エージェントコンテナにマウントされたファイルシステム上の結果ファイル */tmp/cwagent_ecs_auto_sd.yaml* に書き込まれます。以下のサンプル構成は、エージェントが *BackendTask* というプレフィックスが付いた名前のすべてのタスクからメトリクスをスクレイプすることになります。Amazon ECS クラスター内のターゲットの自動検出の詳細なガイドは[こちら](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html)を参照してください。

```
{
   "logs":{
      "metrics_collected":{
         "prometheus":{
            "log_group_name":"/aws/ecs/containerinsights/{ClusterName}/prometheus"
            "prometheus_config_path":"env:PROMETHEUS_CONFIG_CONTENT",
            "ecs_service_discovery":{
               "sd_frequency":"1m",
               "sd_result_file":"/tmp/cwagent_ecs_auto_sd.yaml",
               "task_definition_list":[
                  {
                     "sd_job_name":"backends",
                     "sd_metrics_ports":"3000",
                     "sd_task_definition_arn_pattern":".*:task-definition/BackendTask:[0-9]+",
                     "sd_metrics_path":"/metrics"
                  }
               ]
            },
            "emf_processor":{
               "metric_declaration":[
                  {
                     "source_labels":[
                        "job"
                     ],
                     "label_matcher":"^backends$",
                     "dimensions":[
                        [
                           "ClusterName",
                           "TaskGroup"
                        ]
                     ],
                     "metric_selectors":[
                        "^http_requests_total$"
                     ]
                  }
               ]
            }
         }
      },
      "force_flush_interval":5
   }
}
```

### Prometheus メトリクスを CloudWatch にインポートする

エージェントによって収集されたメトリクスは、構成の *metric_declaration* セクションで指定されたフィルタリングルールに基づいて、パフォーマンスログイベントとして CloudWatch に送信されます。このセクションは、生成されるべき埋め込みメトリクス形式を持つログ配列を指定するためにも使用されます。上記のサンプル構成は、*job:backends* というラベルを持つ *http_requests_total* というメトリクスに対してのみ、以下のようなログイベントを生成します。このデータを使用することで、CloudWatch は *ClusterName* と *TaskGroup* のディメンションを持つ *ECS/ContainerInsights/Prometheus* という CloudWatch 名前空間の下に、メトリクス *http_requests_total* を作成します。

```
{
   "CloudWatchMetrics":[
      {
         "Metrics":[
            {
               "Name":"http_requests_total"
            }
         ],
         "Dimensions":[
            [
               "ClusterName",
               "TaskGroup"
            ]
         ],
         "Namespace":"ECS/ContainerInsights/Prometheus"
      }
   ],
   "ClusterName":"ecs-sarathy-cluster",
   "LaunchType":"EC2",
   "StartedBy":"ecs-svc/4964126209508453538",
   "TaskDefinitionFamily":"BackendAlarmTask",
   "TaskGroup":"service:BackendService",
   "TaskRevision":"4",
   "Timestamp":"1678226606712",
   "Version":"0",
   "container_name":"go-backend",
   "exported_job":"storebackend",
   "http_requests_total":36,
   "instance":"10.10.100.191:3000",
   "job":"backends",
   "path":"/popular/category",
   "prom_metric_type":"counter"
}
```
