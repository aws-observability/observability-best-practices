# CloudWatch Embedded Metric Format

## はじめに

CloudWatch Embedded Metric Format (EMF) を使用すると、複雑で高カーディナリティのアプリケーションデータをログの形式で Amazon CloudWatch に取り込み、実用的なメトリクスを生成できます。Embedded Metric Format を使用することで、環境に関する洞察を得るために複雑なアーキテクチャに依存したり、サードパーティツールを使用したりする必要がなくなります。この機能はすべての環境で使用できますが、AWS Lambda 関数や Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、または EC2 上の Kubernetes のコンテナなど、エフェメラルリソースを持つワークロードで特に有用です。Embedded Metric Format を使用すると、個別のコードを実装または保守することなく、カスタムメトリクスを簡単に作成でき、同時にログデータに対する強力な分析機能を獲得できます。

## Embedded Metric Format (EMF) ログの仕組み

Amazon EC2、オンプレミスサーバー、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、または EC2 上の Kubernetes のコンテナなどのコンピューティング環境は、CloudWatch Agent を通じて Embedded Metric Format (EMF) ログを生成し、Amazon CloudWatch に送信できます。

AWS Lambda を使用すると、カスタムコードを必要とせず、ネットワーク呼び出しをブロックしたり、サードパーティソフトウェアに依存したりすることなく、Embedded Metric Format (EMF) ログを生成して Amazon CloudWatch に取り込むことで、カスタムメトリクスを簡単に生成できます。

お客様は、[EMF 仕様](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)に準拠した構造化ログを発行する際に、特別なヘッダー宣言を提供することなく、詳細なログイベントデータと共にカスタムメトリクスを非同期で埋め込むことができます。CloudWatch は自動的にカスタムメトリクスを抽出するため、お客様はリアルタイムのインシデント検出のために視覚化とアラームを設定できます。抽出されたメトリクスに関連する詳細なログイベントと高カーディナリティコンテキストは、CloudWatch Logs Insights を使用してクエリできるため、運用イベントの根本原因に関する深い洞察を提供します。

[Fluent Bit](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) 用の Amazon CloudWatch 出力プラグインを使用すると、[Embedded Metric Format](https://github.com/aws/aws-for-fluent-bit) (EMF) のサポートを含む Amazon CloudWatch サービスにメトリクスとログデータを取り込むことができます。

![CloudWatch EMF Architecture](../../images/EMF-Arch.png)

## Embedded Metric Format (EMF) ログを使用する場合

従来、モニタリングは 3 つのカテゴリに分類されてきました。最初のカテゴリは、アプリケーションの従来型のヘルスチェックです。2 番目のカテゴリは「メトリクス」で、カウンター、タイマー、ゲージなどのモデルを使用してアプリケーションを計装します。3 番目のカテゴリは「ログ」で、アプリケーション全体のオブザーバビリティにとって非常に重要です。ログは、アプリケーションがどのように動作しているかについて、継続的な情報を提供します。現在、Embedded Metric Format (EMF) ログを通じて、データの粒度や豊富さを犠牲にすることなく、アプリケーションのすべての計装を統合および簡素化しながら、優れた分析機能を獲得することで、アプリケーションのオブザーバビリティを大幅に向上させる方法が利用できるようになりました。

[Embedded Metric Format (EMF) ログ](https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/)は、高カーディナリティのアプリケーションデータを生成する環境に最適です。このデータは、メトリクスディメンションを増やすことなく EMF ログの一部として含めることができます。これにより、すべての属性をメトリクスディメンションとして設定することなく、CloudWatch Logs Insights と CloudWatch Metrics Insights を通じて EMF ログをクエリすることで、アプリケーションデータを詳細に分析できます。

[数百万台の通信デバイスや IoT デバイスからのテレメトリデータを集約する](https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/)お客様は、デバイスのパフォーマンスに関する洞察と、デバイスが報告する固有のテレメトリに迅速に深く掘り下げる能力を必要としています。また、質の高いサービスを提供するために、膨大なデータを掘り下げることなく、問題をより簡単かつ迅速にトラブルシューティングする必要があります。Embedded Metric Format (EMF) ログを使用することで、お客様はメトリクスとログを単一のエンティティに結合して大規模なオブザーバビリティを実現し、コスト効率と優れたパフォーマンスでトラブルシューティングを改善できます。

## Embedded Metric Format (EMF) ログの生成

Embedded metric format ログを生成するには、以下の方法を使用できます。

1. オープンソースのクライアントライブラリを使用して、エージェント（[CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) や Fluent-Bit、Firelens など）を通じて EMF ログを生成して送信します。

- EMF ログの作成に使用できるオープンソースのクライアントライブラリが、以下の言語で利用可能です
     - [Node.Js](https://github.com/awslabs/aws-embedded-metrics-node)
     - [Python](https://github.com/awslabs/aws-embedded-metrics-python)
     - [Java](https://github.com/awslabs/aws-embedded-metrics-java)
     - [C#](https://github.com/awslabs/aws-embedded-metrics-dotnet)
   - EMF ログは AWS Distro for OpenTelemetry (ADOT) を使用して生成できます。ADOT は、Cloud Native Computing Foundation (CNCF) の一部である OpenTelemetry プロジェクトの、安全で本番環境対応の AWS サポート付きディストリビューションです。OpenTelemetry は、分散トレース、ログ、メトリクスを収集してアプリケーション監視を行うための API、ライブラリ、エージェントを提供するオープンソースイニシアチブであり、ベンダー固有のフォーマット間の境界と制限を取り除きます。これには 2 つのコンポーネントが必要です。OpenTelemetry 準拠のデータソースと、[CloudWatch EMF](https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf) ログで使用できるように有効化された [ADOT Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) です。

2. [JSON 形式で定義された仕様](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)に準拠して手動で構築されたログは、[CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html)または [PutLogEvents API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を通じて CloudWatch に送信できます。

## CloudWatch コンソールで Embedded Metric Format ログを表示する

メトリクスを抽出する Embedded Metric Format (EMF) ログを生成した後、顧客は CloudWatch コンソールの Metrics で[それらを表示](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html)できます。埋め込みメトリクスには、ログの生成時に指定されたディメンションがあります。クライアントライブラリを使用して生成された埋め込みメトリクスには、ServiceType、ServiceName、LogGroup がデフォルトのディメンションとして含まれます。

- **ServiceName**: サービスの名前がオーバーライドされますが、名前を推測できないサービス (例: EC2 上で実行されている Java プロセス) の場合、明示的に設定されていない場合はデフォルト値の Unknown が使用されます。
- **ServiceType**: サービスのタイプがオーバーライドされますが、タイプを推測できないサービス (例: EC2 上で実行されている Java プロセス) の場合、明示的に設定されていない場合はデフォルト値の Unknown が使用されます。
- **LogGroupName**: エージェントベースのプラットフォームの場合、メトリクスの配信先となるロググループをオプションで設定できます。この値は、Embedded Metric ペイロードでライブラリからエージェントに渡されます。LogGroup が指定されていない場合、デフォルト値はサービス名から派生されます: -metrics
- **LogStreamName**: エージェントベースのプラットフォームの場合、メトリクスの配信先となるログストリームをオプションで設定できます。この値は、Embedded Metric ペイロードでライブラリからエージェントに渡されます。LogStreamName が指定されていない場合、デフォルト値はエージェントによって派生されます (おそらくホスト名になります)。
- **NameSpace**: CloudWatch 名前空間をオーバーライドします。設定されていない場合、デフォルト値の aws-embedded-metrics が使用されます。

CloudWatch コンソールログでの EMF ログのサンプルは以下のようになります

```json
2023-05-19T15:20:39.391Z 238196b6-c8da-4341-a4b7-0c322e0ef5bb INFO
{
    "LogGroup": "emfTestFunction",
    "ServiceName": "emfTestFunction",
    "ServiceType": "AWS::Lambda::Function",
    "Service": "Aggregator",
    "AccountId": "XXXXXXXXXXXX",
    "RequestId": "422b1569-16f6-4a03-b8f0-fe3fd9b100f8",
    "DeviceId": "61270781-c6ac-46f1-baf7-22c808af8162",
    "Payload": {
        "sampleTime": 123456789,
        "temperature": 273,
        "pressure": 101.3
    },
    "executionEnvironment": "AWS_Lambda_nodejs18.x",
    "memorySize": "256",
    "functionVersion": "$LATEST",
    "logStreamId": "2023/05/19/[$LATEST]f3377848231140c185570caa9f97abc8",
    "_aws": {
        "Timestamp": 1684509639390,
        "CloudWatchMetrics": [
            {
                "Dimensions": [
                    [
                        "LogGroup",
                        "ServiceName",
                        "ServiceType",
                        "Service"
                    ]
                ],
                "Metrics": [
                    {
                        "Name": "ProcessingLatency",
                        "Unit": "Milliseconds"
                    }
                ],
                "Namespace": "aws-embedded-metrics"
            }
        ]
    },
    "ProcessingLatency": 100
}
```

同じ EMF ログの場合、抽出されたメトリクスは以下のようになり、**CloudWatch Metrics** でクエリできます。

![CloudWatch EMF Metrics](../../images/emf_extracted_metrics.png)

お客様は、**CloudWatch Logs Insights** を使用して、抽出されたメトリクスに関連する詳細なログイベントをクエリし、運用イベントの根本原因に関する深い洞察を得ることができます。EMF ログからメトリクスを抽出する利点の 1 つは、お客様が一意のメトリクス (メトリクス名と一意のディメンションセット) とメトリクス値でログをフィルタリングし、集計されたメトリクス値に寄与したイベントのコンテキストを取得できることです。

上記で説明した同じ EMF ログについて、ProcessingLatency をメトリクスとし、Service をディメンションとして、影響を受けたリクエスト ID またはデバイス ID を取得するクエリの例を、CloudWatch Logs Insights のサンプルクエリとして以下に示します。

```json
filter ProcessingLatency < 200 and Service = "Aggregator"
| fields @requestId, @ingestionTime, @DeviceId
```

![CloudWatch EMF Logs](../../images/emf_extracted_CWLogs.png)

## EMF ログで作成されたメトリクスに対するアラーム

[EMF によって生成されたメトリクスにアラームを作成する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html)方法は、他のメトリクスにアラームを作成する場合と同じパターンに従います。ここで注意すべき重要な点は、EMF メトリクスの生成はログ発行フローに依存しているということです。これは、CloudWatch Logs が EMF ログを処理してメトリクスに変換するためです。そのため、アラームが評価される期間内にメトリクスデータポイントが作成されるように、タイムリーにログを発行することが重要です。

上記で説明した同じ EMF ログについて、ProcessingLatency メトリクスをしきい値を持つデータポイントとして使用したアラームの例を以下に示します。

![CloudWatch EMF Alarm](../../images/EMF-Alarm.png)

## EMF Logs の最新機能

お客様は、[PutLogEvents API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を使用して EMF ログを CloudWatch Logs に送信でき、オプションで HTTP ヘッダーを含めることができます `x-amzn-logs-format: json/emf` CloudWatch Logs にメトリクスを抽出するように指示する必要はなくなりました。

Amazon CloudWatch は、Embedded Metric Format (EMF) を使用して構造化ログから最大 1 秒の粒度で[高解像度メトリクスの抽出](https://aws.amazon.com/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/)をサポートしています。お客様は、EMF 仕様ログ内にオプションの [StorageResolution](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Resolution_definition) パラメータを指定し、値を 1 または 60 (デフォルト) に設定することで、メトリクスの希望する解像度 (秒単位) を示すことができます。お客様は EMF を介して標準解像度 (60 秒) と高解像度 (1 秒) の両方のメトリクスを発行でき、アプリケーションの健全性とパフォーマンスをきめ細かく可視化できます。

Amazon CloudWatch は、Embedded Metric Format (EMF) における[エラーの可視性を強化](https://aws.amazon.com/about-aws/whats-new/2023/01/amazon-cloudwatch-enhanced-error-visibility-embedded-metric-format-emf/)し、2 つのエラーメトリクス ([EMFValidationErrors & EMFParsingErrors](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)) を提供します。この強化された可視性により、お客様は EMF を活用する際のエラーを迅速に特定して修正できるため、インストルメンテーションプロセスが簡素化されます。

最新のアプリケーション管理の複雑さが増すにつれて、カスタムメトリクスを定義および分析する際に、より柔軟性が必要になっています。そのため、メトリクスディメンションの最大数が 10 から 30 に増加しました。お客様は、[最大 30 個のディメンションを持つ EMF ログを使用してカスタムメトリクスを作成](https://aws.amazon.com/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/)できます。

## その他の参考資料

- One Observability Workshop の [AWS Lambda 関数での Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary) サンプル (NodeJS ライブラリを使用)
- Serverless Observability Workshop の [Embedded Metrics Format を使用した非同期メトリクス](https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html) (EMF)
- [PutLogEvents API を使用した Java コードサンプル](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents) (EMF ログを CloudWatch Logs に送信)
- ブログ記事: [Amazon CloudWatch 埋め込みカスタムメトリクスによるコスト削減とお客様への注力](https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/)
