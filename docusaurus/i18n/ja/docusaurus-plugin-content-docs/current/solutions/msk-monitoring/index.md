---
title: Amazon MSK モニタリング
sidebar_label: MSK モニタリング
---

# Amazon MSK モニタリング

## 概要

Amazon Managed Streaming for Apache Kafka（MSK）は、複数のモニタリングレベルを提供します。基本レベルでは、CloudWatch がブローカー、トピック、コンシューマーグループのメトリクスを自動的に受信します。より深い可視性を得るために、**Open Monitoring** は各ブローカーで JMX Exporter（ポート 11001）と Node Exporter（ポート 11002）を公開し、Prometheus 互換のスクレイピングを可能にします。

**AWS Managed Collector** は、完全マネージドでエージェントレスなパスを提供し、これらのエンドポイントをスクレイプして Amazon Managed Service for Prometheus（AMP）または CloudWatch の PromQL 互換ストアにメトリクスを配信します。これにより、VPC 内で Prometheus サーバーを自己管理する必要がなくなります。

このエントリでは、Open Monitoring の有効化、AWS Managed Collector のデプロイ、およびエンドツーエンドのメトリクスフローの検証について説明します。MSK モニタリングの完全なリファレンスについては、[Amazon MSK のモニタリング](https://docs.aws.amazon.com/msk/latest/developerguide/monitoring.html)を参照してください。

:::note
このガイドは **MSK Provisioned** クラスターにのみ適用されます。MSK Serverless および MSK Express は Open Monitoring をサポートしていません。
:::

## 前提条件

- Amazon MSK Provisioned クラスター
- Open Monitoring が有効化されていること（JMX Exporter がポート 11001、Node Exporter がポート 11002）
- DNS が有効な VPC
- 異なる AZ にある少なくとも 2 つのサブネット（MSK と同じ VPC）
- コレクターがブローカーのポート 11001 および 11002 に到達できるセキュリティグループ
- IAM 権限：`aps:CreateScraper`、`kafka:DescribeCluster`、`kafka:GetBootstrapBrokers`
- （オプション）長期メトリクスストレージ用の AMP ワークスペース
- （オプション）AMP または CloudWatch データソースを持つ AMG ワークスペース

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                   MSK Cluster (VPC)                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Broker 1   │  │  Broker 2   │  │  Broker 3   │        │
│  │ :11001 JMX  │  │ :11001 JMX  │  │ :11001 JMX  │        │
│  │ :11002 Node │  │ :11002 Node │  │ :11002 Node │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ Pull (private VPC)
                           ▼
              ┌──────────────────────────┐
              │  AWS Managed Collector   │
              │  (fully managed)         │
              └─────────────┬────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│ Amazon Managed       │    │ Amazon CloudWatch    │
│ Prometheus (AMP)     │    │ (PromQL store)       │
└──────────┬───────────┘    └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Amazon Managed       │
│ Grafana (AMG)        │
└──────────────────────┘
```

## デプロイ

### ステップ 1：Open Monitoring を有効化する

```bash
aws kafka update-monitoring \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc-uuid" \
  --current-version "K1V2E3N4" \
  --open-monitoring '{
    "prometheus": {
      "jmxExporter": {"enabledInBroker": true},
      "nodeExporter": {"enabledInBroker": true}
    }
  }'
```

:::warning
既存のクラスターで Open Monitoring を有効化すると、ローリング再起動がトリガーされます。メンテナンスウィンドウ中に計画してください。
:::

### ステップ 2：セキュリティグループを設定する

MSK クラスターのセキュリティグループにインバウンドルールを追加します：

| プロトコル | ポート | ソース | 目的 |
|----------|------|--------|---------|
| TCP | 11001 | Scraper SG | JMX Exporter |
| TCP | 11002 | Scraper SG | Node Exporter |

### ステップ 3：スクレイプ設定を作成する

クラスターの DNS 名を取得します：

```bash
aws kafka get-bootstrap-brokers \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc-uuid"
```

`msk-scrape-config.yaml` を作成します：

```yaml
global:
  scrape_interval: 60s
  external_labels:
    cluster_name: my-msk-cluster

scrape_configs:
  - job_name: 'msk-jmx'
    dns_sd_configs:
      - names:
          - my-cluster.abc123.c4.kafka.us-west-2.amazonaws.com
        type: A
        port: 11001
    metric_relabel_configs:
      - source_labels: [topic]
        regex: '__consumer_offsets|__amazon_msk_.*|__transaction_state'
        action: drop

  - job_name: 'msk-node'
    dns_sd_configs:
      - names:
          - my-cluster.abc123.c4.kafka.us-west-2.amazonaws.com
        type: A
        port: 11002
```

### ステップ 4：マネージドコレクタースクレイパーを作成する

```bash
aws amp create-scraper \
  --alias "msk-metrics-scraper" \
  --source '{
    "vpcConfiguration": {
      "subnetIds": ["subnet-abc123", "subnet-def456"],
      "securityGroupIds": ["sg-0123456789abcdef0"]
    }
  }' \
  --scrape-configuration configurationBlob=$(base64 -w 0 msk-scrape-config.yaml) \
  --destination '{
    "ampConfiguration": {
      "workspaceArn": "arn:aws:aps:us-west-2:123456789012:workspace/ws-abc123"
    }
  }'
```

メトリクスを CloudWatch PromQL ストアに送信するには、`ampConfiguration` を `cloudWatchConfiguration` に置き換えてください。

## 検証

1. **スクレイパーのステータスを確認します：**
   ```bash
   aws amp describe-scraper --scraper-id s-1234abcd-5678-90ef
   ```
   `ACTIVE` ステータスになるまで待ちます。

2. **JMX メトリクスをクエリします**（CloudWatch Query Studio または AMP）：
   ```promql
   kafka_server_BrokerTopicMetrics_MeanRate
   ```

3. **Node メトリクスをクエリします：**
   ```promql
   100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
   ```

4. **提供済みダッシュボードを確認します：** CloudWatch → ダッシュボード → テンプレート → **MSK OTel**。

### 監視すべき主要メトリクス

| メトリクス | 意味 | アラートしきい値 |
|--------|---------|-----------------|
| `kafka_server_ReplicaManager_Value{name="UnderReplicatedPartitions"}` | レプリカが不足しているパーティション | > 0 |
| `kafka_controller_KafkaController_Value{name="ActiveControllerCount"}` | クラスターコントローラー | ≠ 1 |
| `kafka_server_BrokerTopicMetrics_OneMinuteRate{name="BytesInPerSec"}` | 受信スループット | ベースライン + 50% |
| `java_lang_Memory_HeapMemoryUsage_used` / `max` | JVM ヒープ使用率 | > 80% |

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| スクレイパーが `CREATING` のまま停止する | セキュリティグループがコレクターからブローカーへの通信をブロックしている | スクレイパー SG からポート 11001/11002 のインバウンドルールを追加する |
| JMX メトリクスが返されない | Open Monitoring が有効化されていない | `update-monitoring` を実行して JMX Exporter を有効化する |
| ブローカーカバレッジが部分的 | DNS 解決がサブセットを返している | すべてのブローカー IP がスクレイパーサブネットから解決されることを確認する。DNS SD 設定名を確認する |
| `UnderReplicatedPartitions` が急増している | ブローカーに負荷がかかっているか再起動中 | ブローカーの CPU/メモリを確認する。ディスク IOPS が飽和していないことを確認する |
| コンシューマーラグが表示されない | JMX Exporter はコンシューマーラグを公開しない | [kafka_exporter](https://github.com/danielqsj/kafka_exporter) をサイドカーとしてデプロイし、静的ターゲットとして追加する |

## 関連ソリューション

- [EC2 上の Kafka](../kafka-ec2/) — EC2 上の Prometheus による自己管理型 Kafka モニタリング
- [Amazon OpenSearch Service モニタリング](../opensearch-monitoring/) — MSK データを消費する OpenSearch ドメインの監視