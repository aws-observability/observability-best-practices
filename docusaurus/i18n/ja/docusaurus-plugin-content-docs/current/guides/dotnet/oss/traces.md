# トレーシング

.NET は OpenTelemetry トレーシングに対する堅牢なサポートを提供し、開発者に分散システム全体のリクエストフローを監視するための強力なツールを提供します。この実装により、アプリケーションの動作とパフォーマンスのボトルネックに対するエンドツーエンドの可視性が実現されます。

.NET エコシステムでは、OpenTelemetry トレーシングは [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) クラスを中心に構築されています。これは、W3C Trace Context 仕様の .NET 実装です。この業界標準との整合性により、他のサービスやオブザーバビリティツールとの相互運用性が確保されます。

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

登録 `ActivitySource` 依存性注入における OpenTelemetry トレーシングは、.NET アプリケーションのベストプラクティスと考えられています。 

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
