---
title: .NET アプリケーションモニタリング
sidebar_label: .NET モニタリング
---

# .NET アプリケーションモニタリング

## 概要

AWS 上で動作する .NET アプリケーションを、メトリクス、ログ、トレースにわたる完全なオブザーバビリティでモニタリングします。このエントリでは、2 つの補完的なパスを説明します：AWS SDK、CloudWatch エージェント、および X-Ray SDK を使用する **CloudWatch ネイティブ**アプローチと、OTel .NET SDK を使用して CloudWatch および X-Ray に OTLP エクスポートする **OpenTelemetry** アプローチです。

.NET における OpenTelemetry は、フレームワークの既存の計装 API（`System.Diagnostics`、`ILogger`、`Meter`）の上に構築するという点でユニークです。ライブラリ作成者は標準の .NET API を使用して計装し、OTel SDK はそのテレメトリをシームレスに収集します。これにより、ASP.NET Core を既に使用しているチームにとって導入が簡単になります。

ベンダーニュートラルな計装でバックエンドを柔軟に切り替えたい場合は OpenTelemetry を選択してください。AWS サービスとの最もシンプルな統合を求め、CloudWatch エコシステムにコミットしている場合は CloudWatch ネイティブパスを選択してください。

完全なセットアップの詳細については、[CloudWatch Application Signals ドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals.html)を参照してください。

## 前提条件

- .NET 6.0 以降（X-Ray SDK の場合は .NET Framework 4.6.2 以降）
- CloudWatch Logs、CloudWatch メトリクス、および X-Ray の IAM 権限を持つ AWS アカウント
- EC2/オンプレミスの場合：CloudWatch エージェントのインストール
- Lambda の場合：`AWSXRayDaemonWriteAccess` および `CloudWatchLambdaInsightsExecutionRolePolicy` を持つ Lambda 実行ロール
- 必要なパッケージをインストールするための NuGet アクセス

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                     .NET Application                             │
│                                                                 │
│  ┌─────────────────────┐      ┌──────────────────────────────┐  │
│  │  OTel SDK           │      │  AWS SDK / X-Ray SDK         │  │
│  │  (Traces, Metrics,  │      │  (PutMetricData, PutLog,     │  │
│  │   Logs via OTLP)    │      │   X-Ray segments)            │  │
│  └──────────┬──────────┘      └───────────────┬──────────────┘  │
└─────────────┼─────────────────────────────────┼─────────────────┘
              │ OTLP                             │ Direct API / Agent
              ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  CloudWatch Agent /  │          │  CloudWatch / X-Ray      │
│  ADOT Collector      │          │  (Direct ingest)         │
└──────────┬───────────┘          └────────────┬─────────────┘
           │                                   │
           ▼                                   ▼
┌────────────────────────────────────────────────────────────┐
│          Amazon CloudWatch + AWS X-Ray                      │
│  (Metrics, Logs Insights, ServiceMap, Traces)              │
└────────────────────────────────────────────────────────────┘
```

## デプロイ

### パス A：OpenTelemetry（新しいアプリケーションに推奨）

**1. NuGet パッケージのインストール：**

```bash
dotnet add package OpenTelemetry
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.AWS
dotnet add package OpenTelemetry.Resources.AWS
dotnet add package OpenTelemetry.Extensions.AWS
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

**2. `Program.cs` で OTel SDK を設定：**

```csharp
using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(res => res
        .AddService("my-dotnet-app")
        .AddAWSECSDetector()
        .AddAWSEKSDetector()
        .AddAWSEC2Detector())
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddAWSInstrumentation()
        .AddOtlpExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());

builder.Logging.AddOpenTelemetry(logging =>
    logging.AddOtlpExporter());
```

**3. ADOT Collector または CloudWatch エージェントをデプロイ**して、OTLP を受信し CloudWatch/X-Ray にエクスポートします。[ADOT Collector のセットアップ](https://aws-otel.github.io/docs/getting-started/collector)を参照してください。

### パス B：CloudWatch ネイティブ

**1. ログ — ロギングプラグインのインストール：**

```bash
dotnet add package AWS.Logger.SeriLog  # or AWS.Logger.NLog, AWS.Logger.AspNetCore
```

または、CloudWatch エージェントを使用してアプリケーションログファイルをストリーミングします。[CloudWatch エージェントのログ収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)を参照してください。

**2. メトリクス — CloudWatch EMF を使用してゼロレイテンシのカスタムメトリクスを実現：**

```bash
dotnet add package Amazon.CloudWatch.EMF
```

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("MyApp");
    var dim = new DimensionSet();
    dim.AddDimension("Service", "OrderProcessor");
    logger.SetDimensions(dim);
    logger.PutMetric("ProcessingLatency", 42, Unit.MILLISECONDS);
}
```

**3. トレース — X-Ray SDK で計装：**

ASP.NET Core の自動計装と手動セグメント作成については、[X-Ray SDK for .NET デベロッパーガイド](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html)を参照してください。

## 検証

1. **ログ：** CloudWatch Logs コンソールを開き、ロググループに最新のイベントが含まれていることを確認します：
   ```bash
   aws logs filter-log-events --log-group-name /my-dotnet-app --limit 5
   ```

2. **メトリクス：** CloudWatch でカスタムメトリクスをクエリします：
   ```bash
   aws cloudwatch list-metrics --namespace MyApp
   ```

3. **トレース：** X-Ray コンソール → サービスマップを開き、アプリケーションノードが接続された下流サービスとともに表示されることを確認します。

4. **OTel パス：** ADOT Collector がフォワーディングしていることを、コレクターログの `exporterhelper` 成功メッセージで確認します。

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| CloudWatch にログが表示されない | IAM 権限が欠落している | ロールに `logs:CreateLogGroup`、`logs:CreateLogStream`、`logs:PutLogEvents` があることを確認します |
| X-Ray にトレースが表示されない | ADOT Collector が実行されていないか、設定が正しくない | コレクターエンドポイントを確認し、`OTEL_EXPORTER_OTLP_ENDPOINT` 環境変数をチェックします |
| メトリクス名前空間が空 | EMF ログが CloudWatch エージェントに到達していない | エージェントが実行中であり、EMF の TCP/UDP エンドポイントが到達可能であることを確認します（デフォルト `tcp://127.0.0.1:25888`） |
| OTel スパンに AWS 属性が欠落している | リソースディテクターが追加されていない | リソース設定に `.AddAWSEC2Detector()` または適切なディテクターを追加します |
| 高カーディナリティメトリクスが拒否される | ユニークなディメンションの組み合わせが多すぎる | ディメンションを削減します。CloudWatch はメトリクスあたり 30 ディメンションに制限しています |

## 関連ソリューション

- [EKS Application Signals](../eks-application-signals/) — EKS 上のコンテナ化された .NET アプリケーションのアプリケーションレベルモニタリング
- [Lambda モニタリング](../lambda-monitoring/) — .NET Lambda 関数のオブザーバビリティ
