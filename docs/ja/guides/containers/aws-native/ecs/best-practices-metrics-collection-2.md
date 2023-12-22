# Container Insights でのサービスメトリクスの収集

サービスメトリクスは、コードに計測を追加することでキャプチャされるアプリケーションレベルのメトリクスです。これらのメトリクスは、2つの異なるアプローチでアプリケーションからキャプチャできます。

1. プッシュアプローチ: ここでは、アプリケーションがメトリクスデータを直接送信先に送信します。たとえば、CloudWatch PutMetricData API を使用すると、アプリケーションは CloudWatch にメトリクスデータポイントを発行できます。アプリケーションは、OpenTelemetry Collector などのエージェントに対して gRPC または HTTP を使用して OTLP(OpenTelemetry Protocol)経由でデータを送信することもできます。後者はその後、メトリクスデータを最終送信先に送信します。

2. プルアプローチ: ここでは、アプリケーションが事前定義された形式で HTTP エンドポイントにメトリクスデータを公開します。その後、そのエンドポイントにアクセスできるエージェントによってデータがスクレイプされ、送信先に送信されます。

![メトリクス収集のプッシュアプローチ](../../../../images/PushPullApproach.png)

## CloudWatch Container Insights による Prometheus のモニタリング
[Prometheus](https://prometheus.io/docs/introduction/overview/) は、コンテナ化されたアプリケーションからプル アプローチを使用してメトリクスを収集するためのデファクトスタンダードとして浮上した一般的なオープンソースのシステムモニタリングおよびアラート ツールキットです。Prometheus を使用してメトリクスをキャプチャするには、まずメジャーなすべてのプログラミング言語で利用できる Prometheus の[クライアント ライブラリ](https://prometheus.io/docs/instrumenting/clientlibs/)を使用してアプリケーション コードにインスツルメンテーションする必要があります。メトリクスは通常、Prometheus サーバーで読み取るために、アプリケーションから HTTP 経由で公開されます。 

Prometheus サーバーがアプリケーションの HTTP エンドポイントをスクレイプすると、クライアントライブラリは、追跡されているすべてのメトリクスの現在の状態をサーバーに送信します。サーバーはメトリクスを管理するローカル ストレージにメトリクスを保存したり、CloudWatch などのリモート宛先にメトリクス データを送信したりできます。

[CloudWatch Container Insights による Prometheus のモニタリング](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) を使用すると、Amazon ECS クラスターで Prometheus の機能を活用できます。これは、EC2 および Fargate 上にデプロイされた Amazon ECS クラスターで利用できます。CloudWatch エージェントは Prometheus サーバーのドロップイン置換として使用できるため、可観測性を向上させるために必要なモニタリング ツールの数を減らすことができます。これにより、Amazon ECS にデプロイされたコンテナ化されたアプリケーションからの Prometheus メトリクスの自動検出が可能になり、パフォーマンス ログ イベントとしてメトリクス データを CloudWatch に送信します。

!!! info
    Amazon ECS クラスターで Prometheus メトリクス収集用に CloudWatch エージェントをデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)に記載されています。
    
!!! warning
    Container Insights による Prometheus のモニタリングによって収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch 料金](https://aws.amazon.com/cloudwatch/pricing/) を参照してください。

### Amazon ECS クラスター上のターゲットの自動検出

CloudWatch エージェントは、Prometheus ドキュメントの [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) セクションで定義されている標準の Prometheus スクレイプ設定をサポートしています。Prometheus は、サポートされている数十種類の [サービス検出メカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) のいずれかを使用して、スクレイプターゲットの静的および動的検出の両方をサポートしています。Amazon ECS には組み込みのサービス検出メカニズムがないため、エージェントは Prometheus のファイルベースのターゲット検出のサポートに依存しています。エージェントをファイルベースのターゲット検出のために設定するには、エージェントを起動するために使用されるタスク定義で定義されている 2 つの [設定パラメータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html) が必要です。これらのパラメータをカスタマイズして、エージェントによって収集されるメトリクスを細かく制御できます。

最初のパラメータには、次のサンプルのような Prometheus グローバル設定が含まれます。

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

2番目のパラメータには、エージェントがスクレイピングターゲットを検出するのに役立つ設定が含まれています。エージェントは定期的に Amazon ECS API を呼び出して、この設定の *ecs_service_discovery* セクションで定義されたタスク定義パターンに一致する実行中の ECS タスクのメタデータを取得します。検出されたすべてのターゲットは、CloudWatch エージェントコンテナにマウントされたファイルシステム上の結果ファイル */tmp/cwagent_ecs_auto_sd.yaml* に書き込まれます。次のサンプル設定は、プレフィックスが *BackendTask* で始まる名前のタスクからのメトリクスのスクレイプをエージェントが行うことになります。Amazon ECS クラスター内のターゲットの自動検出の詳細なガイドは[こちら](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html)を参照してください。

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

### CloudWatch への Prometheus メトリクスのインポート

エージェントによって収集されたメトリクスは、構成の *metric_declaration* セクションで指定されたフィルタリングルールに基づいて、パフォーマンスログイベントとして CloudWatch に送信されます。このセクションは、生成する必要がある埋め込みメトリック形式のログ配列を指定するためにも使用されます。上記のサンプル構成は、*job:backends* というラベルが付いた *http_requests_total* というメトリクスに対してのみ、次のようなログイベントを生成します。このデータを使用することで、CloudWatch は *ClusterName* と *TaskGroup* のディメンションを使用して、*ECS/ContainerInsights/Prometheus* という CloudWatch ネームスペースの下に *http_requests_total* メトリクスを作成します。

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
