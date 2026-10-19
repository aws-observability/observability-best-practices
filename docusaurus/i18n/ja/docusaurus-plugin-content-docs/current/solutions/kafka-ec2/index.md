---
title: EC2 上の Kafka モニタリング
sidebar_label: EC2 上の Kafka
---

# EC2 上の Kafka モニタリング

## 概要

CloudWatch エージェントの JMX プラグインを使用して、EC2 インスタンス上で実行されるセルフマネージドの Apache Kafka クラスターをモニタリングします。このソリューションは、Prometheus インフラストラクチャを必要とせずに、ブローカーの健全性、パーティションメトリクス、コンシューマーラグ、およびプロデューサーのスループットをキャプチャします。

Apache Kafka は Java Management Extensions（JMX）MBean を通じて内部状態を公開します。CloudWatch エージェントはブローカーの JMX ポートにローカルで接続し、設定した MBean をスクレイプして、CloudWatch カスタムメトリクスとして公開します。これにより、別のメトリクスバックエンドをデプロイすることなく、アラーム、ダッシュボード、および異常検出の機能を利用できます。

収集すべき最も重要なメトリクスカテゴリは以下の通りです：

- **ブローカーの健全性** — `UnderReplicatedPartitions`（ゼロ以外はレプリカが遅延していることを意味します）、`ActiveControllerCount`（クラスター全体で正確に 1 である必要があります）、`OfflinePartitionsCount`（アクティブなリーダーがないパーティション、データが利用不可であることを意味します）、および `IsrShrinksPerSec` / `IsrExpandsPerSec`（頻繁な ISR の変動はディスクまたはネットワークの負荷を示します）。
- **プロデューサーのスループット** — `kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec` と `BytesInPerSec` で取り込みレートを追跡します。`TotalProduceRequestsPerSec` と `FailedProduceRequestsPerSec` は、プロデューサーにカスケードする前にリクエストエラーを表面化します。
- **コンシューマーの健全性** — コンシューマーグループラグは最も重要なコンシューマーメトリクスです。`kafka.consumer:type=consumer-fetch-manager-metrics` MBean は、コンシューマーグループごとの `records-lag-max` と `records-consumed-rate` を公開します。ラグの増加は、コンシューマーが生産レートに追いつけないことを意味し、通常はデータ損失シナリオに先行します。
- **JVM** — 各ブローカープロセスのヒープ使用量、GC 一時停止時間、およびスレッド数。持続的な高い GC 圧力は、リクエストレイテンシの増加と最終的なブローカーの無応答と相関します。

:::caution 更新が必要

このエントリは、CloudWatch エージェントを使用して JMX 経由で Kafka ブローカーメトリクスを収集します。現在の推奨事項より前のものであり、以下をカバーしていません：

- 新しいデプロイメントでエージェントの JMX プラグインを置き換える、JMX レシーバーを含む **OpenTelemetry コレクション**
- セルフマネージド Kafka の代替としての **CloudWatch マネージド Prometheus コレクター**
- オブザーバビリティアクセラレーターアーティファクトからのダッシュボード

以下の手順は引き続き動作します。セルフマネージド Kafka ではなく **Amazon MSK** を実行している場合は、代わりに最新の [Amazon MSK モニタリング](../msk-monitoring/)を使用してください。

:::

## 前提条件

- EC2 上で実行されている Kafka クラスター（v2.8 以降）
- Kafka ブローカーで JMX が有効（ポート 9999）
- CloudWatch エージェント v1.300025 以降
- `CloudWatchAgentServerPolicy` を持つ IAM ロール
- ブローカーインスタンスに Java 11 以降

## アーキテクチャ

```
┌────────────────────────────────────────────────────────┐
│                 EC2 Instance (Kafka Broker)             │
│                                                        │
│  ┌──────────────────┐     ┌──────────────────────────┐│
│  │  Kafka Broker    │     │   CloudWatch Agent       ││
│  │                  │◄────│   • JMX Plugin           ││
│  │  JMX Port: 9999 │     │   • Log collection       ││
│  │                  │     │                          ││
│  └──────────────────┘     └────────────┬─────────────┘│
└────────────────────────────────────────┼───────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │     CloudWatch      │
                              │  • Custom/Kafka NS  │
                              │  • Log Groups       │
                              │  • Dashboards       │
                              └─────────────────────┘
```

## デプロイ

### ステップ 1：Kafka ブローカーで JMX を有効にする

Kafka 起動環境（`/etc/kafka/kafka-env.sh`）に追加します：

```bash
export KAFKA_JMX_OPTS="-Dcom.sun.management.jmxremote \
  -Dcom.sun.management.jmxremote.port=9999 \
  -Dcom.sun.management.jmxremote.local.only=true \
  -Dcom.sun.management.jmxremote.authenticate=false \
  -Dcom.sun.management.jmxremote.ssl=false"
```

### ステップ 2：CloudWatch エージェントをインストールする

```bash
sudo yum install -y amazon-cloudwatch-agent
```

### ステップ 3：JMX コレクションを設定する

`/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json` を作成します：

```json
{
  "metrics": {
    "namespace": "Custom/Kafka",
    "metrics_collected": {
      "jmx": [
        {
          "endpoint": "localhost:9999",
          "metrics": [
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec",
              "measurement": ["Count"]
            },
            {
              "object_name": "kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions",
              "measurement": ["Value"]
            },
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec",
              "measurement": ["Count"]
            },
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=BytesOutPerSec",
              "measurement": ["Count"]
            }
          ]
        }
      ]
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/kafka/server.log",
            "log_group_name": "/kafka/broker",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

### ステップ 4：コンシューマーグループラグモニタリングを追加する

コンシューマーの健全性で最も重要なシグナルであるコンシューマーラグを追跡するには、JMX 設定に `kafka.consumer:type=consumer-fetch-manager-metrics` MBean を追加します。この MBean は、コンシューマーグループごとの `records-lag-max`、`records-consumed-rate`、および `fetch-rate` を公開します。これらのメトリクスは、コンシューマープロセスが同じインスタンスで実行されている場合にのみ利用可能です。リモートコンシューマーの場合は、各コンシューマーホストに CloudWatch エージェントをデプロイします。

エージェント設定の `"metrics"` 配列に以下のエントリを追加します：

```json
{
  "object_name": "kafka.consumer:type=consumer-fetch-manager-metrics,client-id=*",
  "measurement": ["records-lag-max", "records-consumed-rate"]
}
```

### ステップ 5：ZooKeeper メトリクスを追加する（該当する場合）

Kafka クラスターが ZooKeeper を使用している場合（KRaft モード以前）、ZooKeeper プロセスで JMX を有効にし、エージェント設定にそのエンドポイントを追加して、ZooKeeper の `AvgRequestLatency`、`OutstandingRequests`、および `NumAliveConnections` MBean を収集します。ZooKeeper のレイテンシスパイクは、ブローカー登録の遅延やリーダー選出の遅延として Kafka に伝播します。

### ステップ 6：エージェントを起動する

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
```

:::tip 代替手段：OpenTelemetry JMX レシーバー
新しいデプロイメントでは、CloudWatch エージェントの JMX プラグインの代替として [OpenTelemetry JMX レシーバー](https://github.com/open-telemetry/opentelemetry-java-contrib/tree/main/jmx-metrics)を検討してください。OTel コレクターは [AWS CloudWatch EMF エクスポーター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html)を介して CloudWatch にエクスポートでき、より豊富な属性処理とメトリクス変換をサポートします。このエントリは、将来の更新で OTel ベースの手順に更新される予定です。
:::

## 検証

1. **エージェントステータスを確認する：**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
   ```

2. **JMX 接続を確認する：**
   ```bash
   # Locally test JMX port
   echo "" | nc -w 2 localhost 9999 && echo "JMX reachable" || echo "JMX unreachable"
   ```

3. **CloudWatch 名前空間を確認する：**CloudWatch > メトリクス > カスタム名前空間に移動し、`Custom/Kafka` が表示されることを確認します。エージェント起動後、名前空間が登録されるまで 2〜3 分かかる場合があります。

4. **CLI で主要な MBean ファミリーを確認する：**

   ブローカートピックメトリクスとコントローラーメトリクスが到着していることを確認します：

   ```bash
   aws cloudwatch list-metrics \
     --namespace "Custom/Kafka" \
     --metric-name "kafka.server.BrokerTopicMetrics.MessagesInPerSec.Count" \
     --region us-east-1
   ```

   次に、最近のデータポイントを取得して値がゼロ以外であることを確認します：

   ```bash
   aws cloudwatch get-metric-data \
     --metric-data-queries '[
       {
         "Id": "messagesIn",
         "MetricStat": {
           "Metric": {
             "Namespace": "Custom/Kafka",
             "MetricName": "kafka.server.BrokerTopicMetrics.MessagesInPerSec.Count"
           },
           "Period": 300,
           "Stat": "Average"
         }
       }
     ]' \
     --start-time "$(date -u -d '15 minutes ago' +%Y-%m-%dT%H:%M:%S)" \
     --end-time "$(date -u +%Y-%m-%dT%H:%M:%S)" \
     --region us-east-1
   ```

5. **コントローラーメトリクスを確認する：**クラスター全体で `kafka.controller.KafkaController.ActiveControllerCount.Value` が正確に `1` を報告していることを確認します。複数のアクティブコントローラーはスプリットブレイン状態を示しており、即座の対応が必要です。

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| JMX メトリクスがない | ポートが開いていない | `KAFKA_JMX_OPTS` を確認し、ブローカーを再起動します |
| メトリクスが部分的 | オブジェクト名の不一致 | `jconsole` または `jmxterm` で正確な MBean 名を確認します |
| エージェントの CPU 使用率が高い | MBean が多すぎる | スクレイプターゲットを減らすか、収集間隔を延長します |
| ログが表示されない | ファイルパスが間違っている | `server.properties` で Kafka ログディレクトリの場所を確認します |
| SSL/SASL エラーで JMX 接続が拒否される | JMX リモート認証が有効だが、エージェント設定は非認証アクセスを想定している | ローカルのみの収集には `-Dcom.sun.management.jmxremote.authenticate=false` と `-Dcom.sun.management.jmxremote.ssl=false` を設定するか、一致する資格情報でエージェントを設定します |
| 起動時に JMX ポートが競合する | 別の Java プロセス（例：ZooKeeper、Schema Registry）が同じポートをバインド済み | 各 Java プロセスに一意の JMX ポートを割り当てます。`ss -tlnp | grep 9999` で競合するプロセスを特定します |
| ZooKeeper メトリクスがない | ZooKeeper プロセスで JMX が有効になっていない | `zkEnv.sh` に `JMXPORT=9998` を追加し、ポート 9998 を指す 2 番目の JMX エンドポイントをエージェント設定に追加します |
| 高カーディナリティのトピックメトリクスがコストを増大させる | フィルタリングなしでトピックごとの MBean がスクレイプされている | MBean パターンで `topic=<name>` を使用して `object_name` を特定のトピックに制限するか、`metric_relabel_configs` を使用して内部トピック（`__consumer_offsets`、`__transaction_state`）をドロップします |

## 関連ソリューション

- [MSK モニタリング](../msk-monitoring/) — 組み込みのオープンモニタリングと CloudWatch マネージド Prometheus コレクターを備えたマネージド Kafka の代替
- [EC2 NGINX モニタリング](../ec2-nginx/) — 異なるワークロードに適用された同じ EC2 + CloudWatch エージェントパターン
- [ビッグデータオブザーバビリティ](../big-data-observability/) — EMR、Spark、およびストリーミングパイプラインをカバーするデータ層のオブザーバビリティ
