# トレーシング

.NET は OpenTelemetry トレーシングに対する堅牢なサポートを提供し、開発者に分散システム全体のリクエストフローを監視するための強力なツールを提供します。この実装により、アプリケーションの動作とパフォーマンスのボトルネックに対するエンドツーエンドの可視性が実現されます。

.NET エコシステムでは、OpenTelemetry トレーシングは [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) クラスを中心に構築されています。これは、W3C Trace Context 仕様の .NET 実装です。この業界標準との整合性により、他のサービスや可観測性ツールとの相互運用性が保証されます。

## トレースの実装

.NET アプリケーションで OpenTelemetry トレーシングを設定するのは簡単です。

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET の OpenTelemetry 実装の主な強みは、自動インストルメンテーションです。ASP.NET Core、HttpClient、gRPC、Entity Framework Core など、多くの一般的なライブラリとフレームワークは、追加のコードを必要とせずにトレースを出力します。これにより、外部呼び出しとデータベース操作を即座に可視化できます。

## カスタムトレース

アプリケーションコードでカスタムトレースを作成するには、ActivitySource API を使用します。

```c#
// Create a source once and reuse it
private static readonly ActivitySource MyActivitySource = 
    new("MyApplication.Tracing");

// Create spans for important operations
using var activity = MyActivitySource.StartActivity("ProcessOrder");
activity?.SetTag("orderId", orderId);

// Child operations create nested spans
using var childActivity = MyActivitySource.StartActivity("ValidatePayment");
```

.NET アプリケーションで OpenTelemetry トレーシングを使用する場合、ActivitySource を依存性注入に登録することがベストプラクティスと考えられています。

```c#
// During service configuration
services.AddSingleton(sp => new ActivitySource("MyCompany.MyApplication", "1.0.0"));

// Or create a wrapper service if you need more functionality
services.AddSingleton<TracingService>();

// Then inject it where needed
public class OrderProcessor
{
    private readonly ActivitySource _activitySource;
    
    public OrderProcessor(ActivitySource activitySource)
    {
        _activitySource = activitySource;
    }
    
    public void ProcessOrder(Order order)
    {
        using var activity = _activitySource.StartActivity("ProcessOrder");
        activity?.SetTag("orderId", order.Id);
        
        // Processing logic
    }
}
```

## 次のステップ

アプリケーションがインストルメント化されたので、OpenTelemetry Collector、CloudWatch Agent、Fluent Bit などのコレクターエージェントを使用して、選択した可観測性バックエンドにトレースをルーティングします。詳細と実装ガイダンスについては、以下のリンクを参照してください。

- [OpenTelemetry を使用したオブザーバビリティ](/observability-best-practices/ja/patterns/otel) - アプリケーション全体に OpenTelemetry を実装するための包括的なガイドです。AWS サービスを使用してテレメトリデータを収集、処理、可視化し、フルスタックのオブザーバビリティを実現するためのパターンを提供します。

- [AWS Distro for OpenTelemetry (ADOT) Collector の運用](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector) - 本番環境での ADOT Collector のデプロイ、スケーリング、管理に関する実践的なガイダンスです。設定のベストプラクティスや AWS オブザーバビリティサービスとの統合について説明しています。

- [CloudWatch エージェントでメトリクス、ログ、トレースを収集する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - アプリケーションとインフラストラクチャからテレメトリデータを収集するための CloudWatch エージェントのインストールと設定に関する手順を説明します。AWS CloudWatch とのシームレスな統合が可能です。

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - 複数の AWS サービスにログ、メトリクス、トレースを収集および転送するための軽量で効率的なソリューションです。コンテナ化された環境と Kubernetes デプロイメント向けに最適化されています。

- [AWS XRay](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - OpenTelemetry と AWS X-Ray を統合して分散トレーシングを行うための詳細なドキュメントです。トレースの可視化と分析ツールを使用して、本番アプリケーションを大規模に分析およびデバッグできます。
