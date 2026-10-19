---
title: EC2 NGINX モニタリング
sidebar_label: EC2 NGINX
---

# EC2 NGINX モニタリング

## 概要

CloudWatch エージェントを使用して、EC2 インスタンスから NGINX のアクセス/エラーログおよびパフォーマンスメトリクスを収集します。このソリューションは、リクエストレート、レスポンスコード、接続状態、およびアップストリームレイテンシの可視性を提供します。

**注意：** このソリューションは CloudWatch エージェントのメトリクスパイプラインを使用します。新しいデプロイメントでは、より広いエコシステム互換性のために OpenTelemetry ベースのアプローチを検討してください。

キャプチャされる主要なメトリクス：
- アクティブ接続数、受付数、処理済みリクエスト数
- リクエストレートおよびレスポンスステータスコード（2xx、4xx、5xx）
- レスポンスタイムのパーセンタイル
- アップストリームの接続/レスポンスタイム

:::caution 要更新

このエントリは現在の推奨事項より前のものです。CloudWatch エージェントを直接設定しており、以下をカバーしていません：

- **CloudWatch への OpenTelemetry コレクション**（現在、EC2 上のアプリケーションメトリクスの推奨パス）
- **出荷に値するダッシュボード** — 参照されているアクセラレーターアーティファクトがありません
- 正常に動作する NGINX モニタリングセットアップがどのようなものかを示す検証

以下の手順は引き続き機能します。新規に開始する場合は [AWS ドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)を優先し、現在のエージェントガイダンスについては [CloudWatch エージェント設定](../cloudwatch-agent-configuration/)を参照してください。

:::

## 前提条件

- **NGINX 1.18 以降**（または `--with-http_stub_status_module` でコンパイルされた任意のバージョン）。モジュールが存在することを確認します：
  ```bash
  nginx -V 2>&1 | grep -o with-http_stub_status_module
  ```
- Amazon Linux 2/2023、Ubuntu 20.04 以降、または RHEL 8 以降を実行する **EC2 インスタンス**。
- [`CloudWatchAgentServerPolicy`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html) がアタッチされた **IAM インスタンスプロファイル** — エージェントにメトリクスおよびログの公開権限を付与します。
- Web トラフィック用のポート 80/443 のインバウンドを許可する**セキュリティグループ**。`stub_status` ポート（8080）は外部に公開**しないでください**。
- **SSM Agent**（オプション）— Amazon Linux AMI にプリインストールされています。Parameter Store 経由のリモート設定を可能にします。

## アーキテクチャ

```
┌─────────────────────────────────────────┐
│              EC2 Instance                │
│                                         │
│  ┌───────────┐     ┌─────────────────┐  │
│  │   NGINX   │────▶│ /var/log/nginx/ │  │
│  │           │     │ access.log      │  │
│  │ stub_status     │ error.log       │  │
│  └─────┬─────┘     └────────┬────────┘  │
│        │                     │           │
│  ┌─────▼─────────────────────▼────────┐  │
│  │        CloudWatch Agent            │  │
│  │  • procstat (NGINX process)        │  │
│  │  • logs (access + error)           │  │
│  │  • StatsD (custom metrics)         │  │
│  └─────────────────┬──────────────────┘  │
└────────────────────┼─────────────────────┘
                     │
                     ▼
          ┌────────────────────┐
          │    CloudWatch      │
          │  • Metrics         │
          │  • Logs            │
          │  • Dashboards      │
          └────────────────────┘
```

CloudWatch エージェントは同一インスタンス上でデーモンとして実行されます。`procstat` によるプロセスレベルのメトリクス（CPU、メモリ、ワーカー数）、`stub_status` からの **NGINX パフォーマンスカウンター**、および**ログファイル**（アクセスおよびエラー）を収集し、すべてをカスタム名前空間および専用ロググループ配下の CloudWatch にプッシュします。

より深いリクエストレベルのトレーシングには、NGINX の背後にあるアプリケーションに [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 計装を追加してください。X-Ray はエンドツーエンドでリクエストをトレースし、サービスマップを生成し、レイテンシ分布をキャプチャします。

オートスケーリングシナリオでは、CloudWatch アラームまたは [AMP アラートルール](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html)と SNS-to-Lambda パターンを組み合わせて、リクエストレートまたは接続飽和に基づいて Auto Scaling グループのキャパシティを調整します。

## デプロイ

### ステップ 1：NGINX stub_status を有効にする

`stub_status` モジュールは、4 つの主要カウンターを報告する軽量なステータスページを公開します：

| カウンター | 説明 |
|---------|-------------|
| **Active connections** | 待機中を含む現在のオープン接続数 |
| **Accepts** | 最後の再起動以降に受け付けたクライアント接続の合計 |
| **Handled** | 処理された接続の合計（リソース制限に達しない限り accepts と同じ） |
| **Requests** | 処理されたクライアントリクエストの合計 |

*accepts* と *handled* の差は、ワーカーまたはファイルディスクリプタの制限によるドロップされた接続を示します。

NGINX 設定（`/etc/nginx/conf.d/status.conf`）に追加します：

```nginx
server {
    listen 127.0.0.1:8080;
    location /nginx_status {
        stub_status on;
        allow 127.0.0.1;
        deny all;
    }
}
```

リロードして確認します：

```bash
sudo nginx -t && sudo systemctl reload nginx
curl http://127.0.0.1:8080/nginx_status
```

### ステップ 2：構造化アクセスログを設定する

CloudWatch Logs Insights がフィールドを直接クエリできるように、デフォルトの combined ログフォーマットを JSON に置き換えます：

```nginx
log_format json_combined escape=json
  '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request_method":"$request_method",'
    '"request_uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_response_time":"$upstream_response_time",'
    '"http_user_agent":"$http_user_agent"'
  '}';

access_log /var/log/nginx/access.log json_combined;
```

このフォーマットを使用すると、`fields @timestamp, status, request_time | filter status >= 500` のような CloudWatch Logs Insights クエリが直接機能します。

### ステップ 3：CloudWatch エージェントをインストールする

```bash
sudo yum install -y amazon-cloudwatch-agent  # Amazon Linux
# or
sudo apt-get install -y amazon-cloudwatch-agent  # Ubuntu
```

### ステップ 4：エージェントを設定する

`/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json` を作成します：

```json
{
  "agent": {
    "metrics_collection_interval": 60
  },
  "metrics": {
    "namespace": "Custom/NGINX",
    "metrics_collected": {
      "procstat": [{
        "pattern": "nginx",
        "measurement": ["cpu_usage", "memory_rss", "pid_count"]
      }]
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/nginx/access",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/nginx/error",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

`procstat` プラグインは NGINX のマスタープロセスとワーカープロセスを追跡します。`pid_count` がゼロにドロップすると、NGINX がクラッシュしたことを意味します。予期しないほど高い値は、ワーカーの設定ミスを示す場合があります。

キュレートされた NGINX Grafana ダッシュボードについては、[AWS Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator) が NGINX ワークロード用のダッシュボード定義を提供しています。これらは EKS をターゲットとしていますが、同じメトリクス名をエクスポートする場合、メトリクスパターン（接続数、リクエストレート、エラー率）は EC2 にも適用されます。

### ステップ 5：エージェントを起動する

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s
```

## 検証

1. **エージェントのステータスを確認：**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
   ```
   出力に `"status": "running"` が表示されるはずです。停止している場合は、`/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log` を確認してください。

2. **メトリクス名前空間を確認：** **CloudWatch → メトリクス → カスタム名前空間 → Custom/NGINX** に移動します。メトリクスはエージェント起動後 2～3 分以内に表示されます。CLI から確認します：
   ```bash
   aws cloudwatch list-metrics --namespace "Custom/NGINX"
   ```
   メトリクス名 `procstat_cpu_usage`、`procstat_memory_rss`、および `procstat_pid_count` を確認します。

3. **主要なメトリクスを確認：**
   - `procstat_pid_count` は NGINX プロセス数と一致するはずです（`ps aux | grep nginx | grep -v grep | wc -l`）。
   - StatsD またはカスタムスクリプトを介して `stub_status` メトリクスのスクレイピングを設定している場合は、名前空間に `nginx_connections_active` が表示されることを確認します。

4. **ロググループを確認：** `/nginx/access` および `/nginx/error` が **CloudWatch → ロググループ** 配下に存在し、それぞれインスタンス ID にちなんだストリームがあることを確認します：
   ```bash
   aws logs describe-log-groups --log-group-name-prefix "/nginx/"
   ```

5. **テストリクエストを送信してトレースする：**
   ```bash
   curl -s http://localhost/ > /dev/null
   ```
   `/nginx/access` にリクエストが表示されることを確認します。JSON ログフォーマットの場合、Logs Insights を使用します：
   ```
   fields @timestamp, status, request_time
   | sort @timestamp desc
   | limit 5
   ```

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| エージェントが起動しない | 設定の構文エラー | `amazon-cloudwatch-agent-ctl -a verify` を実行して JSON 設定を検証します。詳細は `/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log` を確認してください。 |
| メトリクスが表示されない | IAM ロールが欠落しているか不十分 | インスタンスプロファイルに `CloudWatchAgentServerPolicy` をアタッチします。インスタンスから `aws sts get-caller-identity` で確認します。 |
| ログが流れない | ファイル権限 | `cwagent` ユーザーが `/var/log/nginx/` を読み取れることを確認します。Ubuntu では `sudo usermod -aG adm cwagent` を実行するか、ファイル ACL を調整します。 |
| stub_status が 403 を返す | listen アドレスまたは ACL が正しくない | `listen` ディレクティブが `127.0.0.1:8080` を使用し、`allow 127.0.0.1` が存在することを確認します。`curl http://127.0.0.1:8080/nginx_status` でテストします。 |
| ローテーション後にログが流れなくなる | `logrotate` が NGINX に SIGUSR1 を送信してファイルを再オープンさせますが、CloudWatch エージェントが新しいファイルディスクリプタを追跡できなくなる場合があります | NGINX の logrotate 設定（`/etc/logrotate.d/nginx`）にデフォルトの `create` モードの代わりに `copytruncate` を追加し、エージェントが同じ inode のテーリングを継続できるようにします。 |
| アクセスログからの高カーディナリティメトリクス | 生の URI パス（例：`/users/12345`）をメトリクスディメンションとしてパースすると、カーディナリティが無制限になります | 生の `$request_uri` を CloudWatch ディメンションとして使用しないでください。ログ処理で URI を正規化するか、CloudWatch Logs Insights クエリで `parse` を使用してルートパターンでグループ化します。 |
| t3.micro/small での CloudWatch エージェントのメモリ使用量が高い | テーリングするファイル数とメトリクスバッファの数に応じてエージェントメモリが増加する | `metrics_collection_interval` を削減し、`collect_list` のエントリ数を制限するか、t3.medium にアップグレードします。`amazon-cloudwatch-agent` パターンを対象とした `procstat` でエージェントメモリを監視します。 |
| stub_status が外部に公開されている | `127.0.0.1` の代わりに `0.0.0.0` でリッスンしている | `listen` ディレクティブを `127.0.0.1:8080` に変更します。`ss -tlnp | grep 8080` で localhost のみにバインドされていることを確認します。セキュリティグループのルールを確認してポート 8080 がインバウンドでオープンされていないことを確認します。 |

## 関連ソリューション

- [EC2 上の Kafka](../kafka-ec2/) — データストリーミングワークロードに適用された同じ EC2 + CloudWatch エージェントパターン
- [ハイブリッド環境モニタリング](../hybrid-monitoring/) — EC2 モニタリングのオンプレミスおよびハイブリッド環境への拡張
- [オブザーバビリティコスト管理](../observability-cost-management/) — NGINX フリートのスケーリングに伴う CloudWatch メトリクスおよびログコストの管理
