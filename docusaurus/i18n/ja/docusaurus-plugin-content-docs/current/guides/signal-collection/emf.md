# CloudWatch 組み込みメトリック形式

## はじめに

CloudWatch Embedded Metric Format (EMF) を使うと、お客様はログの形式で複雑な高カーディナリティのアプリケーションデータを Amazon CloudWatch に取り込み、アクションが可能なメトリクスを生成できます。Embedded Metric Format を使えば、お客様は複雑なアーキテクチャに依存したり、環境の洞察を得るために第三者ツールを使う必要がなくなります。この機能はすべての環境で使えますが、AWS Lambda 関数やAmazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、Kubernetes on EC2 のようなコンテナなど、一時的なリソースがあるワークロードで特に便利です。Embedded Metric Format を使えば、お客様は別のコードを用意したり保守する必要なく、カスタムメトリクスを簡単に作成でき、ログデータに対して強力な分析機能を得られます。

## Embedded Metric Format (EMF) ログの仕組み

Amazon EC2、オンプレミスサーバー、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、または EC2 上の Kubernetes などのコンピューティング環境は、CloudWatch エージェントを通じて Embedded Metric Format (EMF) ログを生成し、Amazon CloudWatch に送信できます。

AWS Lambda では、カスタムコードを必要とせず、ブロッキングネットワーク呼び出しを行うことなく、サードパーティのソフトウェアに依存することなく、カスタムメトリクスを簡単に生成し、Embedded Metric Format (EMF) ログを Amazon CloudWatch に取り込むことができます。

お客様は、[EMF 仕様](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)に沿って構造化ログを公開する際、特別なヘッダー宣言を提供する必要なく、非同期でカスタムメトリクスを詳細なログイベントデータと共に埋め込むことができます。CloudWatch は自動的にカスタムメトリクスを抽出するため、お客様はリアルタイムのインシデント検出のためにメトリクスを可視化し、アラームを設定できます。抽出されたメトリクスに関連する詳細なログイベントと高カーディナリティのコンテキストは、CloudWatch Logs Insights を使用してクエリでき、運用イベントの根本原因に関する深い洞察を得ることができます。

[Fluent Bit](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) の Amazon CloudWatch 出力プラグインにより、お客様は [Embedded Metric Format](https://github.com/aws/aws-for-fluent-bit) (EMF) のサポートを含む Amazon CloudWatch サービスにメトリクスとログデータを取り込むことができます。

![CloudWatch EMF Architecture](../../images/EMF-Arch.png)

## Embedded Metric Format (EMF) ログを使用する場合

従来、モニタリングは 3 つのカテゴリに分類されていました。1 つ目は、アプリケーションの健全性をチェックする従来の方法です。2 つ目は「メトリクス」で、カウンター、タイマー、ゲージなどのモデルを使ってアプリケーションを計装します。3 つ目は「ログ」で、アプリケーションの全体的なオブザーバビリティに不可欠です。ログはアプリケーションの動作状況について継続的な情報を提供します。今では、Embedded Metric Format (EMF) ログを使うことで、データの粒度や豊富さを犠牲にすることなく、アプリケーションの計装を統一・簡素化し、驚くべき分析機能を得ることができます。

[Embedded Metric Format (EMF) ログ](https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/)は、メトリクスディメンションを増やすことなく、EMF ログの一部としてハイカーディナリティのアプリケーションデータを生成する環境に最適です。これにより、CloudWatch Logs Insights と CloudWatch Metrics Insights を使って EMF ログを照会することで、すべての属性をメトリクスディメンションとして設定する必要なく、アプリケーションデータをスライスアンドダイスできます。

[数百万の通信会社やIoTデバイスからテレメトリデータを集約する](https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/)お客様は、デバイスのパフォーマンスに関する洞察と、デバイスが報告する一意のテレメトリを素早く深く掘り下げる機能が必要です。また、品質の高いサービスを提供するために、膨大なデータを掘り下げることなく、問題を簡単かつ迅速にトラブルシューティングできる必要があります。Embedded Metric Format (EMF) ログを使えば、メトリクスとログを単一のエンティティに統合し、コスト効率と優れたパフォーマンスで大規模なオブザーバビリティを実現し、トラブルシューティングを改善できます。

## Embedded Metric Format (EMF) ログの生成

EMF ログを生成する方法は次のとおりです。

1. オープンソースのクライアントライブラリを使用して、エージェント ([CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) や Fluent-Bit、Firelens など) を通じて EMF ログを生成し送信します。

   - EMF ログを作成するために使用できるオープンソースのクライアントライブラリは次の言語で提供されています。
     - [Node.Js](https://github.com/awslabs/aws-embedded-metrics-node)
     - [Python](https://github.com/awslabs/aws-embedded-metrics-python)
     - [Java](https://github.com/awslabs/aws-embedded-metrics-java)
     - [C#](https://github.com/awslabs/aws-embedded-metrics-dotnet)
   - AWS Distro for OpenTelemetry (ADOT) を使用して EMF ログを生成できます。ADOT は、Cloud Native Computing Foundation (CNCF) のプロジェクトである OpenTelemetry の安全で本番環境向けの AWS サポート付きディストリビューションです。OpenTelemetry は、アプリケーションモニタリング用の分散トレース、ログ、メトリクスを収集するための API、ライブラリ、エージェントを提供するオープンソースのイニシアチブで、ベンダー固有の形式間の境界と制限を取り除きます。これには、OpenTelemetry 準拠のデータソースと、[CloudWatch EMF](https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf) ログ用に有効化された [ADOT Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) の 2 つのコンポーネントが必要です。

2. [定義された JSON 形式の仕様](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) に準拠して手動で構築したログを、[CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) または [PutLogEvents API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を通じて CloudWatch に送信できます。

## CloudWatch コンソールでの Embedded Metric Format ログの表示

Embedded Metric Format (EMF) ログを生成してメトリクスを抽出した後、顧客は [CloudWatch コンソールのメトリクス] (https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html) で表示できます。Embedded メトリクスには、ログ生成時に指定されたディメンションがあります。クライアントライブラリを使用して生成された Embedded メトリクスには、ServiceType、ServiceName、LogGroup がデフォルトのディメンションとなります。

- **ServiceName**: サービス名は上書きされますが、名前を推測できないサービス (EC2 上で実行される Java プロセスなど) の場合、明示的に設定されていなければデフォルト値の Unknown が使用されます。
- **ServiceType**: サービスタイプは上書きされますが、タイプを推測できないサービス (EC2 上で実行される Java プロセスなど) の場合、明示的に設定されていなければデフォルト値の Unknown が使用されます。
- **LogGroupName**: エージェントベースのプラットフォームでは、顧客はオプションでメトリクスの配信先のロググループを設定できます。この値はライブラリからエージェントに Embedded Metric ペイロードで渡されます。LogGroup が提供されない場合、デフォルト値はサービス名から導出されます: -metrics
- **LogStreamName**: エージェントベースのプラットフォームでは、顧客はオプションでメトリクスの配信先のログストリームを設定できます。この値はライブラリからエージェントに Embedded Metric ペイロードで渡されます。LogStreamName が提供されない場合、デフォルト値はエージェントによって導出されます (おそらくホスト名になります)。
- **NameSpace**: CloudWatch 名前空間を上書きします。設定されていない場合、デフォルト値の aws-embedded-metrics が使用されます。

CloudWatch コンソールのログで、サンプル EMF ログは次のように表示されます。

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

同じ EMF ログから抽出されたメトリクスは、**CloudWatch Metrics** で次のように表示され、クエリできます。

![CloudWatch EMF Metrics](../../images/emf_extracted_metrics.png)

顧客は **CloudWatch Logs Insights** を使用して、抽出されたメトリクスに関連する詳細なログイベントをクエリし、運用イベントの根本原因を深く洞察できます。EMF ログからメトリクスを抽出する利点の 1 つは、顧客が一意のメトリクス (メトリクス名と一意のディメンションセット) とメトリクス値でログをフィルタリングし、集約されたメトリクス値に寄与したイベントのコンテキストを取得できることです。

上記で説明した同じ EMF ログについて、CloudWatch Logs Insights でのサンプルクエリを次に示します。このクエリでは、ProcessingLatency をメトリクスとし、Service をディメンションとして、影響を受けたリクエスト ID またはデバイス ID を取得しています。

```json
filter ProcessingLatency < 200 and Service = "Aggregator"
| fields @requestId, @ingestionTime, @DeviceId
```

![CloudWatch EMF Logs](../../images/emf_extracted_CWLogs.png)

## EMF ログから生成されたメトリクスに対するアラーム

[EMF によって生成されたメトリクスに対するアラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html)の作成は、他のメトリクスに対するアラーム作成と同じパターンに従います。ここで重要なのは、EMF メトリクスの生成は、CloudWatch Logs が EMF ログを処理してメトリクスに変換するため、ログ公開フローに依存することです。そのため、アラームが評価される期間内にメトリクスデータポイントが作成されるように、適時にログを公開することが重要です。

上記で説明した同じ EMF ログについて、ProcessingLatency メトリクスをデータポイントとしてしきい値を設定した例を次に示します。

![CloudWatch EMF Alarm](../../images/EMF-Alarm.png)

## EMF ログの最新機能

お客様は [PutLogEvents API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を使用して EMF ログを CloudWatch Logs に送信でき、メトリクスを抽出するよう CloudWatch Logs に指示する HTTP ヘッダー `x-amzn-logs-format: json/emf` を任意で含めることができます。これは必須ではなくなりました。

Amazon CloudWatch は、Embedded Metric Format (EMF) を使用して構造化ログから最大 1 秒の粒度で [高解像度メトリクス抽出](https://aws.amazon.com/jp/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/) をサポートしています。お客様は EMF 仕様ログ内で [StorageResolution](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) パラメータを 1 または 60 (デフォルト) の値で任意に指定し、メトリクスの希望する解像度 (秒単位) を示すことができます。お客様は EMF を介して標準解像度 (60 秒) と高解像度 (1 秒) の両方のメトリクスを公開でき、アプリケーションの正常性とパフォーマンスを詳細に把握できます。

Amazon CloudWatch は、Embedded Metric Format (EMF) でエラーの可視性を高める 2 つのエラーメトリクス ([EMFValidationErrors & EMFParsingErrors](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)) を提供しています。この可視性の向上により、お客様は EMF を活用する際のエラーを迅速に特定して対処でき、インストルメンテーションプロセスが簡素化されます。

近代的なアプリケーションの管理が複雑化する中、お客様はカスタムメトリクスの定義と分析においてより柔軟性を必要としています。そのため、メトリクスディメンションの最大数が 10 から 30 に増やされました。お客様は [最大 30 のディメンションを持つ EMF ログ](https://aws.amazon.com/jp/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/) を使用してカスタムメトリクスを作成できます。

## 追加の参考資料:

- [AWS Lambda 関数を使用した Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary) のサンプルについて説明する Observability ワークショップ (Node.js ライブラリを使用)。
- [Embedded Metrics Format (EMF) を使用した非同期メトリクス](https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html) について説明する Serverless Observability ワークショップ。
- CloudWatch Logs に EMF ログを送信するための [PutLogEvents API を使用した Java コードサンプル](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents)。
- ブログ記事: [Amazon CloudWatch 組み込みカスタムメトリクスを使用したコスト削減と顧客重視](https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/)。
