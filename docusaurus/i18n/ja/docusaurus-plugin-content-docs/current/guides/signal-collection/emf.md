# CloudWatch Embedded Metric Format




## はじめに

CloudWatch Embedded Metric Format (EMF) を使用すると、お客様は複雑な高カーディナリティのアプリケーションデータをログの形式で Amazon CloudWatch に取り込み、実用的なメトリクスを生成できます。

Embedded Metric Format を使用することで、お客様は環境に関する洞察を得るために、複雑なアーキテクチャやサードパーティツールに頼る必要がなくなります。

この機能はすべての環境で使用できますが、AWS Lambda 関数や Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、EC2 上の Kubernetes などの一時的なリソースを持つワークロードで特に有用です。

Embedded Metric Format を使用すると、個別のコードを実装したり保守したりすることなく、カスタムメトリクスを簡単に作成でき、ログデータに対する強力な分析機能を得ることができます。



## Embedded Metric Format (EMF) ログの仕組み

Amazon EC2、オンプレミスサーバー、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、EC2 上の Kubernetes などのコンピューティング環境では、CloudWatch エージェントを通じて Embedded Metric Format (EMF) ログを生成し、Amazon CloudWatch に送信できます。

AWS Lambda では、カスタムコードを必要とせず、ブロッキングネットワーク呼び出しを行わず、サードパーティのソフトウェアに依存することなく、Embedded Metric Format (EMF) ログを Amazon CloudWatch に生成および取り込むことができます。

[EMF 仕様](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) に準拠した構造化ログを公開する際に、特別なヘッダー宣言を必要とせず、詳細なログイベントデータと共にカスタムメトリクスを非同期で埋め込むことができます。CloudWatch は自動的にカスタムメトリクスを抽出するため、リアルタイムのインシデント検出のための可視化とアラームの設定が可能です。抽出されたメトリクスに関連する詳細なログイベントと高カーディナリティのコンテキストは、CloudWatch Logs Insights を使用してクエリを実行し、運用イベントの根本原因に関する深い洞察を得ることができます。

[Fluent Bit](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) 用の Amazon CloudWatch 出力プラグインを使用すると、[Embedded Metric Format](https://github.com/aws/aws-for-fluent-bit) (EMF) のサポートを含む Amazon CloudWatch サービスにメトリクスとログデータを取り込むことができます。

![CloudWatch EMF Architecture](../../images/EMF-Arch.png)



## Embedded Metric Format (EMF) ログを使用するタイミング

従来、モニタリングは 3 つのカテゴリに分類されてきました。
第 1 のカテゴリは、アプリケーションの従来型のヘルスチェックです。
第 2 のカテゴリは「メトリクス」で、カウンター、タイマー、ゲージなどのモデルを使用してアプリケーションを計測します。
第 3 のカテゴリは「ログ」で、アプリケーションの全体的なオブザーバビリティに不可欠です。
ログは、アプリケーションの動作状況に関する継続的な情報を提供します。
現在、お客様は Embedded Metric Format (EMF) ログを通じて、データの粒度や豊富さを犠牲にすることなく、アプリケーションのすべての計測を統合・簡素化しながら、優れた分析機能を獲得することで、アプリケーションの監視方法を大幅に改善できるようになりました。

[Embedded Metric Format (EMF) ログ](https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/) は、カーディナリティの高いアプリケーションデータを生成する環境に最適です。
メトリクスのディメンションを増やすことなく、EMF ログの一部としてデータを含めることができます。
これにより、すべての属性をメトリクスのディメンションとして設定する必要なく、CloudWatch Logs Insights や CloudWatch Metrics Insights を通じて EMF ログをクエリすることで、アプリケーションデータを様々な角度から分析できます。

[数百万台の通信機器や IoT デバイスからテレメトリデータを集約](https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/)するお客様は、デバイスのパフォーマンスに関する洞察と、デバイスが報告する固有のテレメトリを迅速に詳しく調査する能力を必要としています。
また、質の高いサービスを提供するために、膨大なデータを掘り下げることなく、より簡単かつ迅速に問題を解決する必要があります。
Embedded Metric Format (EMF) ログを使用することで、お客様はメトリクスとログを単一のエンティティに結合して大規模なオブザーバビリティを実現し、コスト効率とパフォーマンスを向上させながらトラブルシューティングを改善できます。



## Embedded Metric Format (EMF) ログの生成

EMF ログを生成するには、以下の方法を使用できます。

1. オープンソースのクライアントライブラリを使用して、エージェント ([CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html)、Fluent-Bit、Firelens など) を通じて EMF ログを生成し送信します。

   - EMF ログを作成するために使用できるオープンソースのクライアントライブラリは、以下の言語で利用可能です。
     - [Node.Js](https://github.com/awslabs/aws-embedded-metrics-node)
     - [Python](https://github.com/awslabs/aws-embedded-metrics-python)
     - [Java](https://github.com/awslabs/aws-embedded-metrics-java)
     - [C#](https://github.com/awslabs/aws-embedded-metrics-dotnet)
   - AWS Distro for OpenTelemetry (ADOT) を使用して EMF ログを生成できます。ADOT は、Cloud Native Computing Foundation (CNCF) の一部である OpenTelemetry プロジェクトの、セキュアで本番環境対応の AWS がサポートするディストリビューションです。OpenTelemetry は、アプリケーションモニタリングのための分散トレース、ログ、メトリクスを収集する API、ライブラリ、エージェントを提供し、ベンダー固有のフォーマット間の境界と制限を取り除くオープンソースイニシアチブです。これには、OpenTelemetry 準拠のデータソースと、[CloudWatch EMF](https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf) ログで使用できるように設定された [ADOT Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) の 2 つのコンポーネントが必要です。

2. [定義された JSON 形式の仕様](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) に準拠する手動で構築されたログは、[CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) または [PutLogEvents API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を通じて CloudWatch に送信できます。



## CloudWatch コンソールでの Embedded Metric Format ログの表示

Embedded Metric Format (EMF) ログからメトリクスを抽出した後、お客様は [CloudWatch コンソールでメトリクスを表示](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html) することができます。
組み込みメトリクスには、ログ生成時に指定されたディメンションがあります。
クライアントライブラリを使用して生成された組み込みメトリクスには、デフォルトのディメンションとして ServiceType、ServiceName、LogGroup があります。

- **ServiceName**: サービス名は上書きされますが、サービス名を推測できない場合 (EC2 で実行される Java プロセスなど)、明示的に設定されていない場合はデフォルト値として Unknown が使用されます。
- **ServiceType**: サービスタイプは上書きされますが、タイプを推測できない場合 (EC2 で実行される Java プロセスなど)、明示的に設定されていない場合はデフォルト値として Unknown が使用されます。
- **LogGroupName**: エージェントベースのプラットフォームでは、お客様はメトリクスを配信する先のロググループを任意で設定できます。この値は、ライブラリから Embedded Metric ペイロードでエージェントに渡されます。LogGroup が指定されていない場合、デフォルト値はサービス名から派生した -metrics となります。
- **LogStreamName**: エージェントベースのプラットフォームでは、お客様はメトリクスを配信する先のログストリームを任意で設定できます。この値は、ライブラリから Embedded Metric ペイロードでエージェントに渡されます。LogStreamName が指定されていない場合、デフォルト値はエージェントによって派生されます (通常はホスト名)。
- **NameSpace**: CloudWatch の名前空間を上書きします。設定されていない場合、デフォルト値として aws-embedded-metrics が使用されます。

CloudWatch コンソールログでの EMF ログのサンプルは以下のようになります。

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

同じ EMF ログについて、抽出されたメトリクスは以下のようになり、**CloudWatch Metrics** で照会できます。

![CloudWatch EMF Metrics](../../images/emf_extracted_metrics.png)

お客様は **CloudWatch Logs Insights** を使用して、抽出されたメトリクスに関連する詳細なログイベントを照会し、運用イベントの根本原因について深い洞察を得ることができます。
EMF ログからメトリクスを抽出することの利点の 1 つは、お客様が一意のメトリクス (メトリクス名と一意のディメンションセット) とメトリクス値でログをフィルタリングし、集計されたメトリクス値に寄与したイベントのコンテキストを取得できることです。

上記で説明した EMF ログについて、ProcessingLatency をメトリクスとし、Service をディメンションとして影響を受けたリクエスト ID やデバイス ID を取得する例を、CloudWatch Logs Insights のサンプルクエリとして以下に示します。

```json
filter ProcessingLatency < 200 and Service = "Aggregator"
| fields @requestId, @ingestionTime, @DeviceId
```

![CloudWatch EMF Logs](../../images/emf_extracted_CWLogs.png)



## EMF ログで作成されたメトリクスのアラーム

[EMF で生成されたメトリクスのアラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html) の作成は、他のメトリクスのアラーム作成と同じパターンに従います。
ここで注意すべき重要なポイントは、EMF メトリクスの生成はログの公開フローに依存しているということです。これは、CloudWatch Logs が EMF ログを処理してメトリクスに変換するためです。
そのため、アラームが評価される期間内にメトリクスのデータポイントが作成されるように、タイムリーにログを公開することが重要です。

上記で説明した EMF ログについて、ProcessingLatency メトリクスをデータポイントとして使用し、しきい値を設定したアラームの例を以下に示します。

![CloudWatch EMF Alarm](../../images/EMF-Alarm.png)



## EMF ログの最新機能

お客様は [PutLogEvents API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) を使用して EMF ログを CloudWatch Logs に送信できます。メトリクスを抽出するように CloudWatch Logs に指示するための HTTP ヘッダー `x-amzn-logs-format: json/emf` を含めることもできますが、これは必須ではなくなりました。

Amazon CloudWatch は、Embedded Metric Format (EMF) を使用した構造化ログから、最大 1 秒の粒度での[高解像度メトリクス抽出](https://aws.amazon.com/jp/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/)をサポートしています。お客様は EMF 仕様のログ内でオプションの [StorageResolution](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) パラメータを、1 または 60 (デフォルト) の値で指定することで、メトリクスの希望する解像度 (秒単位) を示すことができます。EMF を通じて標準解像度 (60 秒) と高解像度 (1 秒) の両方のメトリクスを公開でき、アプリケーションの健全性とパフォーマンスをきめ細かく可視化できます。

Amazon CloudWatch は、2 つのエラーメトリクス ([EMFValidationErrors と EMFParsingErrors](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)) を使用して、Embedded Metric Format (EMF) の[エラーの可視性を強化](https://aws.amazon.com/jp/about-aws/whats-new/2023/01/amazon-cloudwatch-enhanced-error-visibility-embedded-metric-format-emf/)しています。この強化された可視性により、お客様は EMF を活用する際のエラーを素早く特定して修正できるため、計装プロセスが簡素化されます。

最新のアプリケーション管理の複雑さが増す中、お客様はカスタムメトリクスの定義と分析においてより柔軟性を必要としています。そのため、メトリクスディメンションの最大数が 10 から 30 に増加されました。お客様は[最大 30 のディメンションを持つ EMF ログ](https://aws.amazon.com/jp/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/)を使用してカスタムメトリクスを作成できます。



## 追加のリファレンス：

- NodeJS ライブラリを使用した [Lambda 関数での Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary) のサンプルを含む One Observability ワークショップ。
- [Embedded Metrics Format (EMF) を使用した非同期メトリクス](https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html) に関するサーバーレスオブザーバビリティワークショップ。
- EMF ログを CloudWatch Logs に送信するための [PutLogEvents API を使用した Java コードサンプル](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents)。
- ブログ記事：[Amazon CloudWatch の埋め込みカスタムメトリクスによるコスト削減とお客様重視のアプローチ](https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/)
