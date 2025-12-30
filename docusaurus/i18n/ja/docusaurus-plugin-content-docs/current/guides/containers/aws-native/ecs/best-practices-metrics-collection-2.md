# Container Insights を使用したサービスメトリクスの収集
サービスメトリクスは、コードにインストルメンテーションを追加することでキャプチャされるアプリケーションレベルのメトリクスです。これらのメトリクスは、2 つの異なるアプローチを使用してアプリケーションからキャプチャできます。

1. プッシュアプローチ: アプリケーションがメトリクスデータを直接送信先に送信します。たとえば、CloudWatch PutMetricData API を使用して、アプリケーションはメトリクスデータポイントを CloudWatch に発行できます。また、アプリケーションは OpenTelemetry Protocol (OTLP) を使用して gRPC または HTTP 経由で OpenTelemetry Collector などのエージェントにデータを送信することもできます。後者は、メトリクスデータを最終的な送信先に送信します。
2. プルアプローチ: アプリケーションが事前定義された形式でメトリクスデータを HTTP エンドポイントで公開します。その後、このエンドポイントにアクセスできるエージェントによってデータがスクレイピングされ、送信先に送信されます。

![Push approach for metric collection](../../../../images/PushPullApproach.png)

## Prometheus 用の CloudWatch Container Insights モニタリング
[Prometheus](https://prometheus.io/docs/introduction/overview/) は、人気のあるオープンソースのシステム監視およびアラートツールキットです。コンテナ化されたアプリケーションからプルアプローチを使用してメトリクスを収集するための事実上の標準として登場しました。Prometheus を使用してメトリクスをキャプチャするには、まず主要なプログラミング言語すべてで利用可能な Prometheus [クライアントライブラリ](https://prometheus.io/docs/instrumenting/clientlibs/)を使用してアプリケーションコードをインストルメント化する必要があります。メトリクスは通常、Prometheus サーバーによって読み取られるために、HTTP 経由でアプリケーションによって公開されます。
Prometheus サーバーがアプリケーションの HTTP エンドポイントをスクレイピングすると、クライアントライブラリは追跡されているすべてのメトリクスの現在の状態をサーバーに送信します。サーバーは、管理するローカルストレージにメトリクスを保存するか、CloudWatch などのリモート宛先にメトリクスデータを送信できます。

[CloudWatch Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) を使用すると、Amazon ECS クラスターで Prometheus の機能を活用できます。EC2 と Fargate にデプロイされた Amazon ECS クラスターで利用可能です。CloudWatch エージェントは Prometheus サーバーのドロップイン代替として使用でき、オブザーバビリティを向上させるために必要な監視ツールの数を削減します。Amazon ECS にデプロイされたコンテナ化されたアプリケーションから Prometheus メトリクスを自動的に検出し、メトリクスデータをパフォーマンスログイベントとして CloudWatch に送信します。 

:::info
    Amazon ECS クラスターに Prometheus メトリクス収集を使用した CloudWatch エージェントをデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)に記載されています。
:::
:::warning
    Container Insights monitoring for Prometheus によって収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金の詳細については、[Amazon CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。
:::
### Amazon ECS クラスターでのターゲットの自動検出
CloudWatch エージェントは、Prometheus ドキュメントの [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) セクションにある標準的な Prometheus スクレイプ設定をサポートしています。Prometheus は、数十種類のサポートされている[サービスディスカバリーメカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)のいずれかを使用して、スクレイピングターゲットの静的および動的ディスカバリーの両方をサポートしています。Amazon ECS には組み込みのサービスディスカバリーメカニズムがないため、エージェントはターゲットのファイルベースディスカバリーに対する Prometheus のサポートに依存しています。ターゲットのファイルベースディスカバリー用にエージェントをセットアップするには、エージェントに 2 つの[設定パラメータ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html)が必要です。これらはどちらも、エージェントの起動に使用されるタスク定義で定義されます。これらのパラメータをカスタマイズして、エージェントによって収集されるメトリクスをきめ細かく制御できます。

最初のパラメータには、次のサンプルのような Prometheus グローバル設定が含まれています。

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

2 番目のパラメータには、エージェントがスクレイピングターゲットを検出するのに役立つ設定が含まれています。エージェントは定期的に Amazon ECS への API 呼び出しを行い、この設定の *ecs_service_discovery* セクションで定義されたタスク定義パターンに一致する実行中の ECS タスクのメタデータを取得します。検出されたすべてのターゲットは、CloudWatch エージェントコンテナにマウントされたファイルシステム上にある結果ファイル */tmp/cwagent_ecs_auto_sd.yaml* に書き込まれます。以下のサンプル設定では、エージェントはプレフィックス *BackendTask* で名前が付けられたすべてのタスクからメトリクスをスクレイピングします。Amazon ECS クラスターでのターゲットの自動検出については、[詳細ガイド](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html)を参照してください。

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
エージェントによって収集されたメトリクスは、設定の *metric_declaration* セクションで指定されたフィルタリングルールに基づいて、パフォーマンスログイベントとして CloudWatch に送信されます。このセクションは、生成される埋め込みメトリクス形式のログの配列を指定するためにも使用されます。上記のサンプル設定では、ラベル *job:backends* を持つ *http_requests_total* という名前のメトリクスに対してのみ、以下に示すようなログイベントが生成されます。このデータを使用して、CloudWatch は CloudWatch 名前空間 *ECS/ContainerInsights/Prometheus* の下に、ディメンション *ClusterName* と *TaskGroup* を持つメトリクス *http_requests_total* を作成します。
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