# Container Insights でサービスメトリクスを収集する
サービスメトリクスは、コードにインストルメンテーションを追加することで取得されるアプリケーションレベルのメトリクスです。これらのメトリクスは、2 つの異なるアプローチでアプリケーションから取得できます。

1. プッシュアプローチ: アプリケーションがメトリクスデータを直接宛先に送信します。たとえば、CloudWatch PutMetricData API を使用すると、アプリケーションは CloudWatch にメトリクスデータポイントを公開できます。また、アプリケーションは OpenTelemetry プロトコル (OTLP) を使用して gRPC または HTTP 経由でデータを送信し、OpenTelemetry Collector などのエージェントに送信することもできます。その後、エージェントが最終的な宛先にメトリクスデータを送信します。
2. プルアプローチ: アプリケーションがメトリクスデータを事前に定義された形式で HTTP エンドポイントに公開します。そのデータは、そのエンドポイントにアクセスできるエージェントによってスクレイピングされ、宛先に送信されます。

![メトリクス収集のプッシュアプローチ](../../../../images/PushPullApproach.png)

## Prometheus 用の CloudWatch Container Insights モニタリング
[Prometheus](https://prometheus.io/docs/introduction/overview/) は、人気のあるオープンソースのシステムモニタリングおよびアラートツールキットです。プル方式を使用してコンテナ化されたアプリケーションからメトリクスを収集するデファクトスタンダードとして浮上しています。Prometheus を使用してメトリクスをキャプチャするには、主要なプログラミング言語で利用可能な Prometheus [クライアントライブラリ](https://prometheus.io/docs/instrumenting/clientlibs/) を使用してアプリケーションコードに計装する必要があります。通常、メトリクスはアプリケーションによって HTTP 経由で公開され、Prometheus サーバーによって読み取られます。
Prometheus サーバーがアプリケーションの HTTP エンドポイントをスクレイピングすると、クライアントライブラリは追跡されているすべてのメトリクスの現在の状態をサーバーに送信します。サーバーは、メトリクスデータを自身が管理するローカルストレージに保存するか、CloudWatch などのリモート宛先にメトリクスデータを送信できます。

[Prometheus 用の CloudWatch Container Insights モニタリング](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) により、Amazon ECS クラスターで Prometheus の機能を活用できます。EC2 と Fargate 上で展開された Amazon ECS クラスターで利用可能です。CloudWatch エージェントは Prometheus サーバーの代替として使用でき、オブザーバビリティを向上させるために必要なモニタリングツールの数を減らすことができます。Amazon ECS にデプロイされたコンテナ化されたアプリケーションから Prometheus メトリクスを自動検出し、メトリクスデータを CloudWatch にパフォーマンスログイベントとして送信します。

info
    Prometheus メトリクス収集を伴う CloudWatch エージェントを Amazon ECS クラスターにデプロイする手順は、[Amazon CloudWatch ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html) に記載されています。

warning
    Prometheus 用の Container Insights モニタリングで収集されたメトリクスはカスタムメトリクスとして課金されます。CloudWatch の価格に関する詳細は、[Amazon CloudWatch 価格](https://aws.amazon.com/jp/cloudwatch/pricing/) をご覧ください。


### Amazon ECS クラスターでのターゲットの自動検出
CloudWatch エージェントは、Prometheus ドキュメントの [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) セクションにある標準の Prometheus スクレイプ構成をサポートしています。Prometheus は、数十種類のサポートされている [サービス検出メカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) のいずれかを使用して、スクレイプターゲットの静的および動的な検出をサポートしています。Amazon ECS には組み込みのサービス検出メカニズムがないため、エージェントはファイルベースのターゲット検出に Prometheus のサポートを利用しています。エージェントをファイルベースのターゲット検出に設定するには、エージェントの起動に使用されるタスク定義で定義される [2 つの構成パラメータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html) が必要です。これらのパラメータをカスタマイズすることで、エージェントが収集するメトリクスを細かく制御できます。

最初のパラメータには、次のようなサンプルの Prometheus グローバル構成が含まれています。

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

2 番目のパラメータには、エージェントがスクレイプターゲットを検出するための構成が含まれています。エージェントは定期的に Amazon ECS API を呼び出して、*ecs_service_discovery* セクションで定義されたタスク定義パターンに一致する実行中の ECS タスクのメタデータを取得します。検出されたすべてのターゲットは、CloudWatch エージェントコンテナにマウントされたファイルシステム上の結果ファイル */tmp/cwagent_ecs_auto_sd.yaml* に書き込まれます。以下のサンプル構成では、エージェントが *BackendTask* で始まるすべてのタスクからメトリクスをスクレイプするようになります。Amazon ECS クラスターでのターゲットの自動検出の詳細については、[詳細ガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html) を参照してください。

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
エージェントによって収集されたメトリクスは、構成の *metric_declaration* セクションで指定されたフィルタリングルールに基づいて、パフォーマンスログイベントとして CloudWatch に送信されます。このセクションは、生成される埋め込みメトリクス形式のログの配列を指定するためにも使用されます。上記のサンプル構成では、ラベル *job:backends* を持つメトリクス *http_requests_total* に対してのみ、以下のようなログイベントが生成されます。この情報を使って、CloudWatch は CloudWatch 名前空間 *ECS/ContainerInsights/Prometheus* の下にメトリクス *http_requests_total* を、ディメンション *ClusterName* と *TaskGroup* とともに作成します。

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
