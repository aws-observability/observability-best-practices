# ログ

.NET は OpenTelemetry ログに対する包括的なサポートを提供し、メトリクスとトレースと並んでオブザーバビリティの三本柱を完成させます。この統合により、構造化されたコンテキスト化されたログが実現され、最新のオブザーバビリティプラットフォームにシームレスに流れ込みます。

.NET における OpenTelemetry ログ実装は、確立された Microsoft.Extensions.Logging 抽象化の上に構築されており、開発者は既存のログコードを変更することなく OpenTelemetry を採用できます。この下位互換性により、新規アプリケーションと既存アプリケーションの両方で導入が容易になります。

## ロギングの実装

.NET アプリケーションで OpenTelemetry ログを設定するには、最小限の構成が必要です。

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

.NET における OpenTelemetry ログの最も強力な機能の 1 つは、自動コンテキスト伝播です。アクティブなトレース内でログ記録が発生すると、ログエントリは自動的にトレース ID とスパン ID で強化され、ログと関連する分散トレース間の接続が作成されます

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

.NET アプリケーションに OpenTelemetry ログを実装することで、開発チームは、より広範なオブザーバビリティエコシステムとスムーズに統合される標準化されたログ記録アプローチを獲得できます。この統合により、トラブルシューティングに不可欠なコンテキストが提供され、サービス間で関連するシグナルが接続され、分散環境でのより効果的な監視とデバッグが可能になります。
