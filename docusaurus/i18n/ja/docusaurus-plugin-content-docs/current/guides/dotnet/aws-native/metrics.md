# メトリクス

メトリクスは、システムのパフォーマンスと動作に関する定量的なデータを提供するため、オブザーバビリティにおいて不可欠です。これにより、トレンド分析が可能になり、ユーザーに影響を与える前に問題を検出するためのプロアクティブな監視をサポートします。

メトリクス全般と、メトリクスの収集と分析のための Amazon CloudWatch の機能については、[**Amazon CloudWatch のメトリクス**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)を参照してください。

[**多くの AWS サービスには、インフラストラクチャメトリクスをすぐに Amazon CloudWatch に発行する機能がありますが**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html)、このセクションでは、.NET アプリケーションからカスタムメトリクスをキャプチャし、分析のために Amazon CloudWatch メトリクス監視システムに転送することに焦点を当てます。

### AWS SDK for .NET を使用した CloudWatch PutMetricData API 呼び出しの使用

コードに Amazon.CloudWatch および Amazon.CloudWatch.Model NuGet パッケージを含めます。

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

名前空間、メトリクス名と値、ディメンションとディメンション値を含む PutMetricDataRequest オブジェクトを構築します。

```csharp
var request = new PutMetricDataRequest
{
    Namespace = namespaceName,
    MetricData = new List<MetricDatum>
    {
        new MetricDatum
        {
            MetricName = metricName,
            Dimensions = new List<Dimension>
            {
                new Dimension
                {
                    Name = dimensionName,
                    Value = dimensionValue
                }
            },
            Value = metricValue
        }
    }
};
```

PutMetricData API 呼び出しを使用して、メトリクスデータを Amazon CloudWatch に送信します。

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch 埋め込みメトリクス形式

[**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用すると、CloudWatch Logs にログを書き込むことで、カスタムメトリクスを非同期に作成できます。このアプローチにより、次のことが可能になります。

* 詳細なログイベントデータと共にカスタムメトリクスを埋め込む
* CloudWatch がこれらのメトリクスを自動的に抽出して可視化とアラーム設定を行う
* リアルタイムのインシデント検出を有効にする
* CloudWatch Logs Insights を使用して関連する詳細なログイベントをクエリする
* 運用イベントの根本原因に関する深い洞察を得る

#### EMF の使用例

* コンピューティング環境全体でカスタムメトリクスを生成

* カスタムバッチ処理コード、ブロッキングネットワークリクエスト、またはサードパーティソフトウェアへの依存を必要とせずに、Lambda 関数からカスタムメトリクスを簡単に生成できます。その他のコンピューティング環境 (EC2、オンプレミス、ECS、EKS、およびその他のコンテナ環境) は、[**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) をインストールすることでサポートされます。

* メトリクスを高カーディナリティコンテキストにリンクする

* Embedded Metric Format を使用すると、カスタムメトリクスを可視化してアラームを設定できるだけでなく、[**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用してクエリ可能な、元の詳細で高カーディナリティのコンテキストも保持できます。たとえば、ライブラリは Lambda Function のバージョン、EC2 インスタンスおよびイメージ ID などの環境メタデータを構造化ログイベントデータに自動的に挿入します。

[**aws-embedded-metrics-dotnet オープンソースリポジトリ**](https://github.com/awslabs/aws-embedded-metrics-dotnet)には、開始するために必要なすべてが含まれています。 

#### インストール

コードに Amazon.CloudWatch.EMF NuGet パッケージを含めます

```csharp
using Amazon.CloudWatch.EMF
```

IDisposable を実装する MetricsLogger をインスタンス化し、以下のように使用できます。ロガーが破棄されると、メトリクスは設定されたシンクにフラッシュされます。

#### 使用方法

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("Canary");
    var dimensionSet = new DimensionSet();
    dimensionSet.AddDimension("Service", "aggregator");
    logger.SetDimensions(dimensionSet);
    logger.PutMetric("ProcessingLatency", 100, Unit.MILLISECONDS,StorageResolution.STANDARD);
    logger.PutMetric("Memory.HeapUsed", "1600424.0", Unit.BYTES, StorageResolution.HIGH);
    logger.PutProperty("RequestId", "422b1569-16f6-4a03-b8f0-fe3fd9b100f8");
    
}
```
#### ASP.NET Core

[**ASP.NET Core アプリケーション**](https://github.com/awslabs/aws-embedded-metrics-dotnet)のオンボーディングを支援し、デフォルトメトリクスを提供するヘルパーパッケージを提供しています。

1. Startup ファイルに設定を追加します。

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. 各リクエストにデフォルトのメトリクスとメタデータを追加するミドルウェアを追加します

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

AWS Lambda 以外の環境では、EMF イベントを収集するためにアウトプロセスエージェント（[**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) または FireLens / Fluent-Bit）を実行することをお勧めします。アウトプロセスエージェントを使用する場合、このパッケージはエージェントとの一時的な通信の問題に対処するために、プロセス内でデータを非同期的にバッファリングします。 