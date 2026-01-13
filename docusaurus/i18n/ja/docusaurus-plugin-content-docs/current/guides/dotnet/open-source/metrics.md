# メトリクス

.NET は、アプリケーションのオブザーバビリティの標準として OpenTelemetry を採用しており、メトリクスはトレースやログと並ぶ重要な柱となっています。この統合により、開発者は最小限のオーバーヘッドでアプリケーションのパフォーマンスを監視できます。

.NET エコシステムでは、OpenTelemetry メトリクスはアプリケーションメトリクスを測定および公開するための標準化されたアプローチを提供します。.NET 6 から開始され、.NET 8 で大幅に強化されたこのフレームワークは、メトリクスデータの収集とエクスポートに対する組み込みサポートを提供します。

このフレームワークは、ASP.NET Core、HTTP クライアント、Entity Framework などの一般的なコンポーネントに対する自動インストルメンテーションを提供し、追加のコードなしで貴重なメトリクスを収集します。

.NET の OpenTelemetry は複数のエクスポート形式をサポートしており、特にメトリクスには Prometheus が人気です。この柔軟性により、チームは一貫した収集アプローチを維持しながら、好みのオブザーバビリティプラットフォームと統合できます。

OpenTelemetry メトリクスを採用することで、.NET アプリケーションは、ベンダーニュートラルで標準化された監視アプローチの恩恵を受けることができます。このアプローチは、開発環境から複雑な本番環境のデプロイメントまでスケールし、アプリケーションの健全性とパフォーマンスに関する重要な可視性を提供します。

## メトリクスの実装

.NET 8 アプリケーションで OpenTelemetry メトリクスを実装することは、非常に簡単になりました。構成プロセスは、最新の .NET アプリケーションの中心となる依存性注入システムを活用します。開発者は、アプリケーションのブートストラッププロセス中に、意図を明確にし、構成オプションを見つけやすくする fluent API を使用して、メトリクス収集を構成できます。

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## カスタムメトリクス

開発者は System.Diagnostics.Metrics 名前空間を使用してカスタムメトリクスを作成できます。

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## 次のステップ

アプリケーションがインストルメント化されたので、OpenTelemetry Collector、CloudWatch Agent、Fluent Bit などのコレクターエージェントを使用して、選択したオブザーバビリティバックエンドにメトリクスをルーティングします。詳細と実装ガイダンスについては、以下のリンクを参照してください。

- [OpenTelemetry によるオブザーバビリティ](/observability-best-practices/ja/patterns/otel) - アプリケーション全体に OpenTelemetry を実装するための包括的なガイドです。AWS サービスを使用してテレメトリデータを収集、処理、可視化するためのパターンを提供し、フルスタックのオブザーバビリティを実現します。

- [AWS Distro for OpenTelemetry (ADOT) Collector の運用](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector) - 本番環境での ADOT Collector のデプロイ、スケーリング、管理に関する実践的なガイダンスです。設定のベストプラクティスや AWS オブザーバビリティサービスとの統合について説明しています。

- [CloudWatch エージェントを使用してメトリクス、ログ、トレースを収集する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - アプリケーションとインフラストラクチャからテレメトリデータを収集するための CloudWatch エージェントのインストールと設定に関する詳細な手順です。AWS CloudWatch へのシームレスな統合が可能です。

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - ログ、メトリクス、トレースを複数の AWS サービスに収集および転送するための軽量で効率的なソリューションで、コンテナ化された環境と Kubernetes デプロイメント向けに最適化されています。

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - ログイベントにメトリクスデータを埋め込むための仕様です。別のメトリクスパイプラインを必要とせずに、アプリケーションログからメトリクスを抽出して可視化できます。サーバーレスアプリケーションやコンテナ化されたアプリケーションに最適です。

- [Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - Amazon Managed Grafana をセットアップしてメトリクスデータの強力な可視化を作成するためのチュートリアルです。データソースの設定、ダッシュボードの作成、アラートの実装に関する手順が段階的に説明されています。
