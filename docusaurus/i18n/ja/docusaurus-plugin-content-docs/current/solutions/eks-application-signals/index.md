---
title: EKS Java アプリケーションモニタリング
sidebar_label: EKS Java/JVM
---

# EKS Java アプリケーションモニタリング

## 概要

Amazon EKS 上で動作する Java/JVM アプリケーションを CloudWatch Application Signals で計装し、コード変更なしで自動サービスマップ生成、レイテンシ追跡、およびエラーレートモニタリングを実現します。

Application Signals は OpenTelemetry Java エージェントの自動計装を使用して以下をキャプチャします：
- HTTP リクエスト/レスポンスメトリクス（レイテンシ、エラーレート、スループット）
- ダウンストリーム依存関係の呼び出し（データベース、他のサービス、AWS SDK）
- メトリクスと相関付けられた分散トレース
- JVM ランタイムメトリクス（ヒープ、GC、スレッド）

Application Signals は、メトリクス、トレース、ログ、リアルユーザーモニタリング、およびシンセティックモニタリング全体でテレメトリを相関付け、カスタムダッシュボードの作業なしに、計装された各サービスの最も重要なメトリクス（ボリューム、可用性、レイテンシ、フォールト、エラー）の標準化されたダッシュボードを提供します。

重要な機能は**サービスレベル目標（SLO）管理**です。計装後、CloudWatch コンソールで可用性とレイテンシの SLO を直接定義できます。Application Signals はこれらの目標に対するパフォーマンスを追跡し、SLO にリスクがある場合にアラームを発生させ、サービスがビジネスレベルのコミットメントを満たしているかどうかの明確なビューを提供します。

自動計装は、OpenTelemetry Operator の `Instrumentation` カスタムリソースを介して、起動時にアプリケーション Pod に OpenTelemetry エージェントを注入します。コード変更、リビルド、アプリケーションイメージの再デプロイは不要です。このガイドは Java/JVM ワークロード（Kotlin およびその他の JVM 言語を含む）に焦点を当てていますが、Application Signals は **Python、.NET、および Node.js** もサポートしており、それぞれ対応する言語アノテーションがあります。

コンテナ化された環境では、Application Signals は **Container Insights** と統合して、アプリケーションレベルのメトリクスと Pod の CPU、メモリプレッシャー、ノードキャパシティなどのインフラストラクチャシグナルを相関付け、レイテンシスパイクの原因がアプリケーションロジックにあるのかインフラストラクチャのリソース競合にあるのかを判断できます。

## 前提条件

- Kubernetes v1.27 以降を実行する **Amazon EKS クラスター**。以前のバージョンには ADOT Operator が必要とする Webhook 設定がありません。
- クラスターに関連付けられた **IAM OIDC プロバイダー**。CloudWatch エージェントおよび ADOT Collector が正しい権限を引き受けるために、IAM Roles for Service Accounts（IRSA）に必要です。[IAM OIDC プロバイダーの作成](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)を参照してください。
- **CloudWatch Observability EKS アドオン**（`amazon-cloudwatch-observability`）。CloudWatch エージェントを DaemonSet としてデプロイし、Application Signals の収集を設定します。
- クラスターにインストールされた **ADOT EKS アドオン**または **OpenTelemetry Operator**。自動計装の注入をトリガーする `Instrumentation` カスタムリソースを管理します。
- ノードロールまたは IRSA サービスアカウントにアタッチされた **IAM ポリシー**：
  - `CloudWatchAgentServerPolicy` — メトリクスおよびログの公開
  - `AWSXRayDaemonWriteAccess` — トレースの送信
  - `CloudWatchApplicationSignalsFullAccess` — サービスマップおよび SLO データ
- Kubernetes **Deployment** としてデプロイされた Java アプリケーション（DaemonSet およびベア Pod は自動計装 Webhook でサポートされていません）。
- 名前空間、デプロイメント、およびアノテーションを作成する権限を持つ `kubectl` アクセス。

## アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│                    EKS Cluster                       │
│  ┌───────────────────────────────────────────────┐  │
│  │           Application Pod                     │  │
│  │  ┌─────────────┐    ┌────────────────────┐   │  │
│  │  │ Java App    │    │ OTel Java Agent     │   │  │
│  │  │             │◄───│ (auto-instrument)   │   │  │
│  │  └─────────────┘    └─────────┬──────────┘   │  │
│  └───────────────────────────────┼───────────────┘  │
│                                  │                   │
│  ┌───────────────────────────────▼───────────────┐  │
│  │         CloudWatch Agent (DaemonSet)          │  │
│  └───────────────────────────────┬───────────────┘  │
└──────────────────────────────────┼───────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
           ┌──────────────┐ ┌──────────┐ ┌────────────┐
           │ CloudWatch   │ │  X-Ray   │ │ Application│
           │ Metrics      │ │  Traces  │ │ Signals    │
           └──────────────┘ └──────────┘ └────────────┘
```

## デプロイ

### ステップ 1：ADOT アドオンを有効にする

```bash
aws eks create-addon \
  --cluster-name my-cluster \
  --addon-name adot \
  --addon-version v0.92.1-eksbuild.1
```

### ステップ 2：アプリケーション名前空間にアノテーションを付ける

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    aws-observability: enabled
```

### ステップ 3：Deployment に計装アノテーションを追加する

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-java-app
spec:
  template:
    metadata:
      annotations:
        instrumentation.opentelemetry.io/inject-java: "true"
    spec:
      containers:
        - name: app
          image: my-java-app:latest
```

**Kotlin** またはその他の JVM 言語サービスの場合、同じ `inject-java` アノテーションが適用されます。OTel Java エージェントはバイトコードレベルで計装するため、JVM バイトコードにコンパイルされる任意の言語がサポートされます。非 JVM 言語の場合はアノテーションを置き換えてください：Python の場合 `inject-python`、.NET の場合 `inject-dotnet`、Node.js の場合 `inject-nodejs`。

### ステップ 4：CloudWatch エージェントをデプロイする

```bash
aws eks create-addon \
  --cluster-name my-cluster \
  --addon-name amazon-cloudwatch-observability
```

### ステップ 5：サービスレベル目標を定義する

テレメトリが流れ始めたら、**CloudWatch → Application Signals → サービスレベル目標**に移動し、重要なサービスの SLO を作成します。以下のターゲットを設定できます：
- **可用性** — 成功レスポンスの割合（例：99.9%）
- **レイテンシ** — p99 レスポンスタイムのしきい値（例：p99 < 500 ms）

Application Signals はこれらのターゲットに対するバーンレートを追跡し、コンプライアンスウィンドウ内で SLO が違反するリスクがある場合に CloudWatch アラームを発生させます。

### Infrastructure as Code

このソリューションは **AWS CDK** または **Terraform** を使用してデプロイできます。CDK の場合、[`aws-eks`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_eks-readme.html) モジュールが `eks.Addon` コンストラクトを介したアドオンのインストールをサポートしています。Terraform の場合、[`aws_eks_addon`](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_addon) リソースを使用して `adot` と `amazon-cloudwatch-observability` の両方のアドオンを宣言的に管理します。

## 検証

1. **自動計装が注入されていることを確認：**
   ```bash
   kubectl get pods -n my-app -o jsonpath='{.items[*].spec.initContainers[*].name}'
   # Should show: opentelemetry-auto-instrumentation
   ```

2. **トラフィックを生成して Application Signals を確認：**
   CloudWatch → Application Signals → サービスに移動します。

3. **X-Ray でトレースを確認：**
   CloudWatch → X-Ray traces → トレースマップに移動します。

4. **サービスマップを検査：**
   **CloudWatch → Application Signals → サービスマップ**を開きます。計装されたサービスがダウンストリーム依存関係（データベース、他のサービス、AWS API）へのエッジを持つノードとして表示されるはずです。各エッジで呼び出しボリューム、レイテンシ、およびフォールトメトリクスが表示されることを確認します。ノードが欠落している場合は、対応する Pod に自動計装 init コンテナがあることを確認します。

5. **SLO ステータスを確認：**
   **CloudWatch → Application Signals → サービスレベル目標**に移動します。各 SLO に現在の達成率とバーンレートが表示されるはずです。正常な SLO は緑色のステータスを表示し、リスクのある SLO は予測違反時間とともにアンバーを表示します。

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| init コンテナが注入されない | Instrumentation CR が欠落している | `kubectl get instrumentation -A` を確認します |
| 計装後にアプリがクラッシュする | エージェントの互換性 | Java バージョンが 8 以上であることを確認し、エージェントバージョンの固定を試みます |
| トレースはあるが Application Signals がない | CloudWatch エージェントがフォワーディングしていない | CloudWatch エージェントの設定と IAM ロールを確認します |
| 計装後に高レイテンシ | サンプリングが過度に積極的 | コレクター設定でサンプリングレートを調整します |
| サービス間でトレースコンテキストが伝搬されない | W3C TraceContext ヘッダーが中間プロキシまたはロードバランサーでドロップされている | ALB/NLB またはサービスメッシュが `traceparent` および `tracestate` ヘッダーを保持していることを確認します。`OTEL_PROPAGATORS` 環境変数が `xray,tracecontext` に設定されていることを確認します |
| ADOT アドオンのインストールに失敗するか Pod がクラッシュループする | ADOT Operator のバージョンがクラスターの Kubernetes バージョンと互換性がない | [EKS アドオンバージョン一覧](https://docs.aws.amazon.com/eks/latest/userguide/managing-add-ons.html)でアドオンバージョンの互換性を確認します。`aws eks update-addon` でアップグレードします |

## 関連ソリューション

- [EKS インフラストラクチャモニタリング](../eks-infrastructure/) — Container Insights によるノードおよび Pod のリソースメトリクスをカバーする、アプリケーションレベルシグナルのインフラストラクチャ補完
- [.NET アプリケーションモニタリング](../dotnet-application-monitoring/) — .NET ワークロードに適用された同じ Application Signals パターン
- [ADOT at Scale](../adot-at-scale/) — 高スループットクラスターの Application Signals を支える ADOT Collector のスケーリング
- [分散トレーシング](../distributed-tracing/) — トレーシングの概念、X-Ray ガイダンス、およびクロスサービス相関
