---
title: EKS インフラストラクチャモニタリング
sidebar_label: EKS インフラストラクチャ
---

# EKS インフラストラクチャモニタリング

## 概要

Amazon EKS クラスターインフラストラクチャ（ノード、Pod、コントロールプレーン、クラスターネットワーキング）の正常性とパフォーマンスを、CloudWatch、Amazon Managed Service for Prometheus（AMP）、またはその両方にメトリクスを配信する 3 つの収集パスを使用してモニタリングします。

**パスを選択してください：**

| 状況 | パス |
|-----------|------|
| 最小限の設定で最速のデフォルトが必要 | **パス 1 — OpenTelemetry 付き Container Insights** |
| GPU、AWS Neuron（Trainium/Inferentia）、または EFA ワークロードを実行している | **パス 1** — アクセラレーターメトリクスがそのまま収集されます |
| スクレイピングするメトリクスを正確に制御し、CloudWatch で PromQL アクセスが必要 | **パス 2 — CloudWatch マネージド Prometheus コレクター** |
| メトリクスストアとして既に Amazon Managed Service for Prometheus を使用している | **パス 3 — AMP へのセルフマネージドコレクター** |

3 つのパスすべてが OpenTelemetry ベースの収集を使用します。収集されるもの、データの到達先、および設定量が異なります。

## 前提条件

- Amazon EKS クラスター（v1.25 以降）
- 適切な権限で設定された AWS CLI v2
- クラスター用に設定された `kubectl`
- **パス 1：** EKS アドオンをインストールする権限（`eks:CreateAddon`）
- **パス 2：** CloudWatch マネージドコレクターを作成する権限（`cloudwatch:CreateCollector`、`aps:CreateScraper`）
- **パス 3：** AMP ワークスペース、コレクターサービスアカウント用の `aps:RemoteWrite` を持つ IAM ロール、および AMP データソースが設定された Amazon Managed Grafana ワークスペース

## アーキテクチャ

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              EKS Cluster                                      │
│                                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ kubelet/cAdvisor│  │kube-state-     │  │ Node Exporter  │  │ API Server│  │
│  │                │  │metrics         │  │ (DaemonSet)    │  │ /metrics  │  │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘  └─────┬─────┘  │
│          │                    │                    │                  │        │
│          └────────────────────┼────────────────────┼──────────────────┘        │
│                               │                    │                           │
│  ┌─ Path 1 ──────────────────┐│┌─ Path 2 ────────┐│┌─ Path 3 ──────────────┐ │
│  │ CloudWatch Agent          │││ CW Managed       │││ ADOT Collector        │ │
│  │ (amazon-cloudwatch-       │││ Prometheus       │││ (DaemonSet)           │ │
│  │  observability add-on)    │││ Collector        │││                       │ │
│  └───────────┬───────────────┘│└────────┬─────────┘│└───────────┬───────────┘ │
│              │                │         │          │            │             │
└──────────────┼────────────────┼─────────┼──────────┼────────────┼─────────────┘
               │                │         │          │            │
               ▼                │         ▼          │            ▼
    ┌───────────────────┐       │  ┌────────────────┐│  ┌──────────────────────┐
    │  CloudWatch       │       │  │  CloudWatch    ││  │  Amazon Managed      │
    │  Container        │       │  │  (PromQL API)  ││  │  Prometheus (AMP)    │
    │  Insights         │       │  └───────┬────────┘│  └──────────┬───────────┘
    └───────────────────┘       │          │         │             │
                                │          ▼         │             ▼
                                │  ┌────────────────┐│  ┌──────────────────────┐
                                │  │  Grafana /     ││  │  Amazon Managed      │
                                │  │  CW Console    ││  │  Grafana (AMG)       │
                                │  └────────────────┘│  └──────────────────────┘
                                │                    │
```

## デプロイ

### パス 1 — OpenTelemetry 付き Container Insights（推奨デフォルト）

拡張オブザーバビリティ付きの Container Insights は、ノード、Pod、コンテナ、およびコントロールプレーンのメトリクスをそのまま提供します。クラスター全体の可視性を最速で実現するパスであり、カスタムスクレイプ設定は不要です。

**amazon-cloudwatch-observability** EKS アドオンをインストールします。これにより、OpenTelemetry ベースの収集を備えた CloudWatch エージェントがデプロイされます：

```bash
aws eks create-addon \
  --cluster-name <CLUSTER_NAME> \
  --addon-name amazon-cloudwatch-observability \
  --region <REGION>
```

アドオンはインフラストラクチャメトリクスを収集し、自動的に CloudWatch Container Insights に送信します。ダッシュボードは CloudWatch コンソールの **Container Insights** に表示されます。

**アクセラレーテッドコンピューティング。** このパスは、アクセラレーターハードウェアのそのままのサポートを提供する唯一のパスです。EKS でトレーニングまたは推論を実行する場合に重要です：

- **NVIDIA GPU** メトリクス — GPU ごとの使用率、メモリ、温度、および電力
- **AWS Neuron** メトリクス（Trainium および Inferentia 用）。`neuron-monitor` を介して収集され、NeuronCore の使用率およびデバイスメモリを含みます
- **Elastic Fabric Adapter（EFA）** メトリクス — 分散トレーニングで使用される高スループットインターコネクト用

アドオンは、関連するデバイスプラグインが存在する場合、スクレイプ設定なしでこれらを自動的に検出して収集します。パス 2 および 3 では、DCGM および Neuron エクスポーターから同等のものを自分で構築する必要があります。[Container Insights アクセラレーテッドコンピュートモニタリング](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/container-insights-detailed-metrics.html)を参照してください。

IAM ロール設定および Fargate サポートを含む完全なセットアップの詳細については、以下を参照してください：

- [Container Insights EKS クイックスタート](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html)
- [EKS の拡張オブザーバビリティ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-Enhanced-EKS.html)

### パス 2 — CloudWatch マネージド Prometheus コレクター

Container Insights のデフォルトセットを受け入れるのではなく、スクレイピングする Prometheus メトリクスを選択したい場合にこのパスを使用します。メトリクスは CloudWatch に到達し、PromQL でクエリ可能です。

クラスター内の Prometheus エンドポイントを検出してスクレイピングするマネージドスクレイパーを作成します。スクレイパーは AWS サービスアカウントで実行され、メトリクスを CloudWatch に配信します：

```bash
aws amp create-scraper \
  --source eksConfiguration="{clusterArn=arn:aws:eks:<REGION>:<ACCOUNT>:cluster/<CLUSTER>,securityGroupIds=[<SG_ID>],subnetIds=[<SUBNET_1>,<SUBNET_2>]}" \
  --destination cloudWatchConfiguration="{}" \
  --scrape-configuration configurationBlob="<BASE64_SCRAPE_CONFIG>"
```

スクレイプ設定は標準の Prometheus フォーマットを使用します。インフラストラクチャ全体をカバーするために、`kubernetes-apiservers`、`kube-state-metrics`、`node-exporter`、および `kubelet` cAdvisor エンドポイントのジョブを含めてください。

完全な設定リファレンスについては、[マネージドスクレイパーのドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-collector-how-to.html)を参照してください。

**可視化 — オプション A：アーティファクトリポジトリからの Grafana ダッシュボード**

EKS インフラストラクチャ用のビルド済み Grafana ダッシュボードをダウンロードします：

```bash
curl -o eks-cluster-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/cluster.json

curl -o eks-namespace-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/namespace.json

curl -o eks-node-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/node.json
```

Grafana で、SigV4 認証を使用し **Service** を `monitoring` に設定した CloudWatch PromQL エンドポイントを指す **Prometheus** データソースを追加します。これには Amazon Managed Service for Prometheus は不要です。PromQL API は OTLP で取り込まれたメトリクスに対する CloudWatch のクエリサーフェスです。インポート時にダッシュボードの `datasource` 変数でそのデータソースを選択します。

**可視化 — オプション B：CloudWatch コンソール**

**CloudWatch → メトリクス → すべてのメトリクス**に移動し、PromQL 構文を使用して直接クエリします。デフォルトの EKS インフラストラクチャダッシュボードは **CloudWatch → ダッシュボード → 自動ダッシュボード → EKS** で利用可能です。

### パス 3 — Amazon Managed Service for Prometheus へのセルフマネージドコレクター

組織が既にメトリクスストアとして AMP を使用している場合にこのパスを使用します。収集と保持の柔軟性が最も高く、可視化のために Amazon Managed Grafana と統合できます。

このパスでは、AWS Distro for OpenTelemetry（ADOT）Collector を DaemonSet としてデプロイし、Prometheus フォーマットのメトリクスソースをスクレイピングして AMP にリモートライトします。

**スクレイピングするメトリクスソース：**

| レイヤー | ソース | エンドポイント |
|-------|--------|----------|
| コントロールプレーン | API Server | `<api-server>/metrics`（ネイティブに Prometheus フォーマット） |
| クラスターステート | kube-state-metrics | `kube-state-metrics:8080/metrics` |
| VPC CNI | cni-metrics-helper | `cni-metrics-helper/metrics` |
| CoreDNS | CoreDNS | `core-dns:9153/metrics` |
| ノード | Prometheus node-exporter | `node-exporter:9100/metrics` |
| Pod/コンテナ | kubelet cAdvisor | `kubelet/metrics/cadvisor` |

**ADOT EKS アドオンのインストール：**

```bash
aws eks create-addon \
  --cluster-name <CLUSTER_NAME> \
  --addon-name adot \
  --region <REGION>
```

**コレクターパイプラインの設定。** ADOT Collector は OpenTelemetry Collector の設定フォーマットを使用します。主要な要素は、上記の各ソースのスクレイプジョブを持つ Prometheus レシーバーと、AMP ワークスペースを指す Prometheus Remote Write エクスポーターです：

```yaml
exporters:
  prometheusremotewrite:
    endpoint: <YOUR_AMP_REMOTE_WRITE_ENDPOINT>
    auth:
      authenticator: sigv4auth

extensions:
  sigv4auth:
    region: <REGION>
    service: "aps"

receivers:
  prometheus:
    config:
      global:
        scrape_interval: 60s
        scrape_timeout: 10s
      scrape_configs:
        - job_name: kubernetes-apiservers
          # Discovers API server endpoint via kubernetes_sd_configs
        - job_name: kube-state-metrics
        - job_name: node-exporter
        - job_name: kubelet-cadvisor
        - job_name: coredns
        - job_name: vpc-cni

processors:
  batch/metrics:
    timeout: 30s
    send_batch_size: 500

service:
  extensions: [sigv4auth]
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [batch/metrics]
      exporters: [prometheusremotewrite]
```

デプロイメントモードおよび複数コレクターインスタンスを含む高度なコレクター設定については、[ADOT EKS アドオンのドキュメント](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html)を参照してください。

**IAM：** コレクターのサービスアカウントは、AMP ワークスペースへの `aps:RemoteWrite` 権限を持つ IAM ロールでアノテーションされている必要があります。IAM Roles for Service Accounts（IRSA）または EKS Pod Identity を使用してください。

**Terraform オプション：** [terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator) は、このパス全体（ADOT、AMP ワークスペース、AMG ダッシュボード、アラートルール）をプロビジョニングできます。ただし、このリポジトリは**現在アクティブにメンテナンスされていません**。採用前に既存のモジュールがニーズを満たすかどうかを評価し、フォークのメンテナンスに備えてください。

## 検証

### パス 1 — Container Insights

1. アドオンがアクティブであることを確認：
   ```bash
   aws eks describe-addon --cluster-name <CLUSTER_NAME> \
     --addon-name amazon-cloudwatch-observability --region <REGION> \
     --query "addon.status"
   ```
   期待値：`"ACTIVE"`

2. CloudWatch コンソールでメトリクスを確認：**Container Insights → パフォーマンスモニタリング**に移動し、クラスターを選択します。

### パス 2 — CloudWatch マネージドコレクター

1. スクレイパーがアクティブであることを確認：
   ```bash
   aws amp list-scrapers --region <REGION> \
     --query "scrapers[?alias=='<SCRAPER_NAME>'].status"
   ```

2. CloudWatch コンソールで PromQL を使用してメトリクスをクエリ：
   ```
   up{job="kube-state-metrics"}
   ```

### パス 3 — AMP へのセルフマネージドコレクター

1. ADOT Collector の Pod が実行中であることを確認：
   ```bash
   kubectl get pods -n opentelemetry-operator-system
   ```

2. `awscurl` を使用して AMP のメトリクスを確認：
   ```bash
   awscurl --service aps --region <REGION> \
     "https://aps-workspaces.<REGION>.amazonaws.com/workspaces/{workspace_id}/api/v1/query?query=up"
   ```
   `{workspace_id}` を AMP ワークスペース ID に置き換えてください（フォーマット：`ws-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）。`aws amp list-workspaces --region <REGION>` で取得できます。

3. Grafana ダッシュボードを確認：AMG ワークスペースに移動し、インポートされた EKS インフラストラクチャダッシュボードにデータが表示されていることを確認します。

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| Container Insights アドオンのステータスが `DEGRADED` | CloudWatch エージェントサービスアカウントの IAM 権限が欠落している | `CloudWatchAgentServerPolicy` マネージドポリシーをノードロールにアタッチするか IRSA を設定します。[クイックスタートの前提条件](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html)を参照してください |
| マネージドスクレイパーが `CREATION_FAILED` を表示する | セキュリティグループまたはサブネットがクラスター API への送信接続を許可していない | スクレイパーのセキュリティグループがクラスターエンドポイントへの HTTPS 送信を許可し、サブネットに CloudWatch 用の NAT または VPC エンドポイントがあることを確認します |
| ADOT デプロイ後に AMP にメトリクスがない | IRSA が設定されていないか、サービスアカウントのアノテーションが欠落している | サービスアカウントのアノテーションが `aps:RemoteWrite` 権限を持つ IAM ロール ARN と一致することを確認します |
| ADOT Collector の Pod が CrashLoopBackOff 状態 | 無効なコレクター YAML または到達不能なスクレイプターゲット | `kubectl logs -n opentelemetry-operator-system <pod>` でログを確認し、設定を検証します |
| CloudWatch PromQL ダッシュボードで Grafana が「No Data」を表示する | データソースが正しいエンドポイントを指していないか、SigV4 設定が欠落している | Prometheus データソース URL を `https://monitoring.<REGION>.amazonaws.com` に設定し、SigV4 サービスを `monitoring` にします |
| 部分的なメトリクス — コントロールプレーンメトリクスが欠落 | API Server のスクレイプターゲットが検出されていない | スクレイプ設定に `kubernetes-apiservers` ジョブと `kubernetes_sd_configs` ロール `endpoints` および正しい TLS 設定が含まれていることを確認します |

## 関連ソリューション

- [EKS Application Signals](../eks-application-signals/) — ゼロコード計装でアプリケーションレベルのトレーシングとメトリクスを追加
- [ECS モニタリング](../ecs-monitoring/) — Amazon ECS クラスターのインフラストラクチャおよびタスクレベルのモニタリング
