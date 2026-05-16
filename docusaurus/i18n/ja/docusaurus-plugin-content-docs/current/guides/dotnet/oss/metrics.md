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
