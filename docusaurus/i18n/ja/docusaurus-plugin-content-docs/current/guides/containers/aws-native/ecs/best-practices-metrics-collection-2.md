# Container Insights を使用したサービスメトリクスの収集
サービスメトリクスは、コードに計装を追加することで取得されるアプリケーションレベルのメトリクスです。これらのメトリクスは、2 つの異なるアプローチでアプリケーションから収集できます。

1. プッシュアプローチ: アプリケーションがメトリクスデータを直接送信先に送信します。例えば、CloudWatch PutMetricData API を使用して、アプリケーションはメトリクスデータポイントを CloudWatch に公開できます。また、アプリケーションは OpenTelemetry Protocol (OTLP) を使用して、gRPC や HTTP 経由で OpenTelemetry Collector などのエージェントにデータを送信することもできます。後者は、メトリクスデータを最終的な送信先に送信します。
2. プルアプローチ: アプリケーションが事前に定義されたフォーマットで HTTP エンドポイントにメトリクスデータを公開します。このエンドポイントにアクセスできるエージェントがデータをスクレイピングし、送信先に送信します。

![Push approach for metric collection](../../../../images/PushPullApproach.png)



## CloudWatch Container Insights による Prometheus のモニタリング
[Prometheus](https://prometheus.io/docs/introduction/overview/) は、人気のあるオープンソースのシステムモニタリングおよびアラート通知ツールキットです。コンテナ化されたアプリケーションからプル方式でメトリクスを収集するための事実上の標準として台頭しています。Prometheus を使用してメトリクスを取得するには、まず主要なプログラミング言語で利用可能な Prometheus の [クライアントライブラリ](https://prometheus.io/docs/instrumenting/clientlibs/) を使用してアプリケーションコードを計装する必要があります。メトリクスは通常、Prometheus サーバーが読み取れるように、アプリケーションによって HTTP 経由で公開されます。

Prometheus サーバーがアプリケーションの HTTP エンドポイントをスクレイピングすると、クライアントライブラリは追跡されているすべてのメトリクスの現在の状態をサーバーに送信します。サーバーは、管理しているローカルストレージにメトリクスを保存するか、CloudWatch などのリモートの送信先にメトリクスデータを送信することができます。

[CloudWatch Container Insights による Prometheus のモニタリング](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) を使用すると、Amazon ECS クラスターで Prometheus の機能を活用できます。これは EC2 と Fargate にデプロイされた Amazon ECS クラスターで利用可能です。CloudWatch エージェントは Prometheus サーバーの代替として使用でき、オブザーバビリティを向上させるために必要なモニタリングツールの数を削減します。Amazon ECS にデプロイされたコンテナ化アプリケーションからの Prometheus メトリクスの検出を自動化し、メトリクスデータをパフォーマンスログイベントとして CloudWatch に送信します。

:::info
    Amazon ECS クラスターに Prometheus メトリクス収集機能を持つ CloudWatch エージェントをデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html) に記載されています。
:::
:::warning
    Container Insights による Prometheus のモニタリングで収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金の詳細については、[Amazon CloudWatch の料金](https://aws.amazon.com/jp/cloudwatch/pricing/) をご参照ください。
:::



### Amazon ECS クラスターでのターゲットの自動検出
CloudWatch エージェントは、Prometheus ドキュメントの [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) セクションで定義されている標準的な Prometheus スクレイプ設定をサポートしています。Prometheus は、数十種類の[サービスディスカバリメカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)のいずれかを使用して、スクレイピングターゲットの静的および動的な検出をサポートしています。Amazon ECS には組み込みのサービスディスカバリメカニズムがないため、エージェントはファイルベースのターゲット検出に対する Prometheus のサポートに依存しています。ファイルベースのターゲット検出のためにエージェントを設定するには、エージェントの起動に使用されるタスク定義で定義される 2 つの[設定パラメータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html)が必要です。これらのパラメータをカスタマイズすることで、エージェントが収集するメトリクスをきめ細かく制御できます。

最初のパラメータには、以下のようなサンプルの Prometheus グローバル設定が含まれています：

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

2 番目のパラメータには、エージェントがスクレイピングターゲットを検出するのに役立つ設定が含まれています。エージェントは定期的に Amazon ECS に API コールを行い、この設定の *ecs_service_discovery* セクションで定義されたタスク定義パターンに一致する実行中の ECS タスクのメタデータを取得します。検出されたすべてのターゲットは、CloudWatch エージェントコンテナにマウントされたファイルシステム上の */tmp/cwagent_ecs_auto_sd.yaml* という結果ファイルに書き込まれます。以下のサンプル設定では、プレフィックス *BackendTask* で名前付けられたすべてのタスクからメトリクスをスクレイピングするようにエージェントが設定されます。Amazon ECS クラスターでのターゲットの自動検出については、[詳細なガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html)を参照してください。

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



### Prometheus メトリクスの CloudWatch へのインポート
エージェントによって収集されたメトリクスは、設定の *metric_declaration* セクションで指定されたフィルタリングルールに基づいて、パフォーマンスログイベントとして CloudWatch に送信されます。
このセクションは、生成される埋め込みメトリクスフォーマットを持つログの配列を指定するためにも使用されます。
上記のサンプル設定では、ラベル *job:backends* を持つ *http_requests_total* という名前のメトリクスに対してのみ、以下のようなログイベントが生成されます。
このデータを使用して、CloudWatch は CloudWatch 名前空間 *ECS/ContainerInsights/Prometheus* の下に、*ClusterName* と *TaskGroup* のディメンションを持つメトリクス *http_requests_total* を作成します。
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
