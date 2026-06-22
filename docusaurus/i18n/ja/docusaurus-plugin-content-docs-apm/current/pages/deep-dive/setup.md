# Application Signals + Transaction Search のセットアップ

## 高レベルのセットアップ手順

![Setup Overview](/apm-src/assets/images/deep-dive/overview.png)

## 前提条件と権限

CloudWatch Application Signals を有効にする前に、必要な IAM 権限とインフラストラクチャが整っていることを確認してください。詳細な要件については、[Application Signals の権限](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html)を参照してください。

## サポートされているシステム

Application Signals は、Amazon EKS、ネイティブ Kubernetes、Amazon ECS、および Amazon EC2 でサポートおよびテストされています。

| 言語 | ランタイムバージョン |
|---|---|
| **Java** | JVM バージョン 8、11、17、21、23 |
| **Python** | Python バージョン 3.9 以降 |
| **.NET** | リリース 1.6.0 以前: .NET 6、8、および .NET Framework 4.6.2 以降。リリース 1.7.0 以降: .NET 8、9、および .NET Framework 4.6.2 以降 |
| **Node.js** | Node.js バージョン 14、16、18、20、22 |
| **PHP** | PHP バージョン 8.0 以降 |
| **Ruby** | CRuby >= 3.1、JRuby >= 9.3.2.0、または TruffleRuby >= 22.1 |
| **GoLang** | Golang バージョン 1.18 以降 |

完全なサポートマトリックスについては、[Application Signals のサポート対象システム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html)を参照してください。

## ステップ 1: アカウントで Application Signals を有効にする

[アカウントで Application Signals を有効にする](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html)ドキュメントを参照してください。

## ステップ 2: トランザクション検索を有効にする

[トランザクション検索の有効化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html)のドキュメントを参照してください。

## ステップ 3: インストルメンテーション戦略を選択する

要件に基づいて、いずれかのインストルメンテーションアプローチを選択してください。Application Signals は、SDK とコレクターの複数の組み合わせをサポートしています。

### 利用可能な SDK

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Application Signals をサポートする OpenTelemetry の AWS ディストリビューション。Java、Python、.NET、Node.js で利用可能です。
- **[アップストリーム OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — 標準のベンダー中立な OpenTelemetry SDK。OTEL がサポートする任意の言語（Erlang、Rust、Ruby、Go、PHP など）で動作します。
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — レガシーの AWS トレーシング SDK。⚠️ [メンテナンスモード](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### 利用可能な Collector / Agent

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — 組み込みの Application Signals サポート、Container Insights 統合、およびログ収集を備えたマネージド AWS エージェント。
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — 標準のアップストリームまたはカスタムビルドのコレクター。マルチデスティネーションのテレメトリファンアウトをサポート。
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK 向けのレガシートレースリレー。⚠️ [メンテナンスモード](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### 意思決定マトリクス

| アプローチ | 最適な用途 | 主なメリット |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | AWS ネイティブ環境、深いサービス統合 | 緊密な AWS 統合、Container Insights との相関、マネージドな体験 |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | 完全な Application Signals サポートを備えたマルチデスティネーションテレメトリ | クライアント側の RED メトリクス、App Signals プロセッサ、マルチデスティネーションの柔軟性 |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | ベンダー中立戦略、ADOT 非対応言語、マルチクラウド | 完全なベンダー中立性、OTEL がサポートする任意の言語、AWS SDK 依存なし |
| [**Direct OTLP Endpoint (Collector-less tracing)**](../instrumentation-setups#otlp-エンドポイントを使用した-collector-レスのトレーシング) | リソース効率の高いアプリケーション、最小限のインフラストラクチャ | 最小限のオーバーヘッド、シンプルなアーキテクチャ、インフラストラクチャの削減 |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | レガシーの X-Ray ユーザー、段階的な移行 | 既存投資の保護、変更要件の最小化。⚠️ メンテナンスモード |

### 機能比較

| 機能 | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | Collector-less tracing with ADOT SDK | X-Ray SDKs |
|---|---|---|---|---|---|
| **AWS サポート** | ✅ Yes | ⚠️ AWS に送信されるデータのみ | ⚠️ AWS に送信されるデータのみ | ✅ Yes | ✅ Yes（⚠️ メンテナンスモード） |
| **非標準言語のサポート** | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Container Insights 統合** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **CloudWatch Logs によるすぐに使えるロギング** | ✅ Yes | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **すぐに使えるランタイムメトリクス** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **常にトラフィックの 100% で RED メトリクスを取得** | ✅ Yes（クライアント側） | ✅ Yes（クライアント側） | ⚠️ 100% サンプリング時のみ（サーバー側） | ⚠️ 100% サンプリング時のみ（サーバー側） | ⚠️ 100% サンプリング時のみ（サーバー側） |
| **マルチデスティネーションテレメトリ** | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

各アプローチの詳細な実装については、[インストルメンテーションのセットアップ](../instrumentation-setups)を参照してください。

## ステップ 4: サンプリングとトレースインデックスの理解

Application Signals は**リクエストサンプリング**と**トレースインデックス作成**を分離しています。
- **リクエストサンプリング**: リクエストのうち何パーセントをサンプリングして AWS に送信するかを決定します
- **選択的トレースインデックス作成**: X-Ray トレースサマリー用に X-Ray バックエンドに送信される、CloudWatch Logs に保存されたスパンの割合です。トレースサマリーはトランザクションのデバッグに役立ち、非同期プロセスにも有用です。トレースサマリーとしてインデックスを作成する必要があるのは、スパンのごく一部のみです。

### リクエストサンプリング

#### 1. X-Ray 集中サンプリング（デフォルトおよび推奨）

ADOT SDK と CloudWatch Agent（または OpenTelemetry Collector）で Application Signals を有効にすると、**X-Ray の集中サンプリングがデフォルトで有効になります**。設定は以下のとおりです。

| 設定 | デフォルト値 | 説明 |
|---|---|---|
| **Reservoir** | 1 request/second | 1 秒あたりにサンプリングされる固定リクエスト数 |
| **Fixed Rate** | 5% | リザーバを超える追加リクエストの割合 |

AWS Distro for OpenTelemetry (ADOT) SDK エージェントの環境変数は次のように設定されます。

| 環境変数 | 値 | 説明 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | X-Ray サンプリングサービスを使用します |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch エージェントのエンドポイント |

アプリケーションを再デプロイすることなく、X-Ray コンソールからいつでもこれらのデフォルト設定を変更できます。たとえば、サンプリングを 10% に増やすには、サンプリングルールの固定レートを更新します。ルールオプションの完全なリスト、例、およびサービス固有のルールの作成方法については、[サンプリングルールの設定](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html)を参照してください。

:::info X-Ray リモートサンプラーはいつ適用されますか？
The `xray` サンプラーは呼び出しによって動作します `http://localhost:2000/GetSamplingRules` および `http://localhost:2000/SamplingTargets` ローカルプロキシを経由します。つまり、X-Ray リモートサンプリングは**ローカルプロキシが実行されている場合にのみ機能します**。

- **CloudWatch Agent** — デフォルトでポート 2000 にサンプリングプロキシを公開します
- **OpenTelemetry Collector** — [AWS Proxy 拡張機能](https://aws-otel.github.io/docs/getting-started/remote-sampling)を設定した状態で使用します

ローカルプロキシが利用できない場合（例：[コレクターレスモード](../instrumentation-setups#otlp-エンドポイントを使用した-collector-レスのトレーシング)）、ADOT SDK はサンプリングエンドポイントに到達できず、暗黙的に **ParentBased(AlwaysOn) の 100%** にフォールバックします。
:::

#### 2. ランタイムごとの X-Ray リモートサンプラーの設定

各 ADOT SDK 言語ランタイムは、X-Ray リモートサンプリングルールを使用するために特定の設定が必要です。使用する言語のガイドを参照してください。

| ランタイム | 設定ガイド |
|---|---|
| **Java** | [ADOT Java で X-Ray リモートサンプリングを使用する](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [ADOT Python で X-Ray リモートサンプリングを使用する](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [ADOT JavaScript で X-Ray リモートサンプリングを使用する](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [ADOT .NET で X-Ray リモートサンプリングを使用する](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [ADOT Go でサンプリングを設定する](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

すべてのランタイムにおいて、主要な環境変数は次のとおりです。

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

エンドポイントを CloudWatch Agent またはコレクタープロキシのアドレスに合わせて調整します（例： `http://cloudwatch-agent.amazon-cloudwatch:2000` EKS 上で)。

#### 3. ローカルサンプリング

ローカルプロキシが利用できない場合、または X-Ray サービスに依存せずにローカルで制御したい場合は、環境変数を使用して ADOT SDK でサンプリングを直接設定できます。

| 環境変数 | 値 | 説明 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | ローカルの比率ベースサンプリング |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% サンプリングレート（必要に応じて調整） |

これは、X-Ray リモートサンプリングが利用できない[コレクターレスモード](../instrumentation-setups#otlp-エンドポイントを使用した-collector-レスのトレーシング)で特に役立ちます。これらの変数がない場合、SDK はデフォルトで `parentbased_always_on` （100% サンプリング）。

その他のサンプラーオプションについては、[OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) のドキュメントを参照してください。

#### 4. X-Ray アダプティブサンプリング（コスト最適化アプローチ）

:::tip 要件
- ADOT Java SDK (v2.11.5 以降)
- CloudWatch Agent または OpenTelemetry Collector と共に実行する必要があります
- Amazon EC2、ECS、EKS、およびセルフホスト型 Kubernetes と互換性があります
:::

詳細なセットアップ手順については、[X-Ray Adaptive Sampling](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html) のドキュメントを参照してください。
:::

100% のサンプリングは必要ないが、より優れた異常検出カバレッジを求める場合は、X-Ray アダプティブサンプリングの使用を検討してください。これにより、コスト効率の高いベースラインレートを維持しながら、エラースパイクやレイテンシの外れ値が発生した際にサンプリングを自動的に増加させます。

主なメリット:
- **自動異常検出**: HTTP 5xx エラーや高レイテンシ発生時にサンプリングを強化します
- **コスト管理**: 通常運用時は低いベースラインサンプリング（例: 5%）を維持します
- **設定可能なブースト制限**: 最大サンプリングレートとクールダウン期間を設定できます
- **重要なトレースのキャプチャ**: 完全なトレースがサンプリングされない場合でも、異常スパンを確実にキャプチャします
- **一元管理**: アプリケーションコードを変更せずに、X-Ray サンプリングルールを通じて設定できます

設定例：
```json
{
  "RuleName": "AdaptiveProductionRule",
  "Priority": 1,
  "ReservoirSize": 1,
  "FixedRate": 0.05,
  "ServiceName": "*",
  "ServiceType": "*",
  "Host": "*",
  "HTTPMethod": "*",
  "URLPath": "*",
  "SamplingRateBoost": {
    "MaxRate": 0.25,
    "CooldownWindowMinutes": 10
  }
}
```

### トレースインデックス作成

**1. デフォルトのインデックス作成レート:**
- 1% のインデックス作成は追加料金なしで含まれています
- 1% を超えるインデックス作成には X-Ray の料金が発生します
- 現在の料金については、[CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/)ドキュメントを参照してください

**2. カスタムインデックス作成レート:**
```bash
# Higher indexing for applications requiring more X-Ray analytics (incurs charges)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% indexing - X-Ray charges apply

# Lower indexing for cost optimization (still within free tier)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% indexing - no additional charges
```
