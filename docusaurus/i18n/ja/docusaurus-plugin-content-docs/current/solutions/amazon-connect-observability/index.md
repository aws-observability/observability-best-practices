---
title: Amazon Connect オブザーバビリティ
sidebar_label: Amazon Connect
---
# Amazon Connect オブザーバビリティ

[Amazon Connect](https://aws.amazon.com/connect/) は、数千の企業が毎日数百万の顧客に音声、チャット、デジタルチャネルでサービスを提供するために使用する AI ネイティブのコンタクトセンターソリューションです。サービス品質の維持、エージェントパフォーマンスの最適化、SLA 目標の達成、コスト効率の確保には、効果的なオブザーバビリティが不可欠です。

このガイドでは、AWS ネイティブのオブザーバビリティツール（Amazon CloudWatch、AWS CloudTrail、Amazon EventBridge、Contact Lens、Contact Trace Records（CTR））を使用した Amazon Connect のモニタリングのベストプラクティスを説明します。

---

## 概要

コンタクトセンターは、パフォーマンスの低下が顧客体験、エージェントの生産性、ビジネス成果に直接影響するリアルタイムの顧客対応システムです。一般的な Web アプリケーションとは異なり、コンタクトセンターは複数のディメンションにわたってモニタリングする必要があります：

| ディメンション | モニタリング対象 | ビジネスへの影響 |
|-----------|----------------|-----------------|
| **顧客体験** | 待ち時間、放棄率、通話品質 | 顧客満足度、リテンション |
| **エージェントパフォーマンス** | 処理時間、稼働率、後処理作業 | 業務効率、コスト |
| **システムヘルス** | 同時通話数、スロットリング、エラー | サービス可用性 |
| **品質** | センチメント、コンプライアンス、スクリプト遵守 | ブランド評判、規制リスク |
| **キャパシティ** | クォータ使用率、キューサイズ | 需要スパイクへの対応能力 |

### オブザーバビリティの柱

```
┌──────────────────────────────────────────────────────────────────┐
│                  Amazon Connect Observability                     │
├────────────┬────────────┬────────────┬────────────┬──────────────┤
│  Metrics   │    Logs    │   Events   │  Analytics │   Traces     │
│            │            │            │            │              │
│ CloudWatch │ CloudWatch │ EventBridge│ Contact    │ Contact      │
│ Metrics    │ Logs       │            │ Lens       │ Flow Logs    │
│            │            │            │            │              │
│ Real-time  │ Flow Logs  │ Contact    │ CTRs       │ CloudTrail   │
│ Metrics API│            │ Events     │            │              │
│            │ CloudTrail │ Rule       │ Historical │ X-Ray (for   │
│ Historical │            │ Events     │ Metrics    │ integrations)│
│ Metrics API│            │            │            │              │
└────────────┴────────────┴────────────┴────────────┴──────────────┘
```

### 主要メトリクスと KPI

#### 顧客向け KPI

| KPI | 定義 | 目標（例） | データソース |
|-----|-----------|-------------------|-------------|
| **平均応答速度（ASA）** | エージェントが応答するまでの平均時間 | 30 秒未満 | Historical Metrics API |
| **放棄率** | エージェント接続前に切断されたコンタクトの割合 | 5% 未満 | CTR、Historical Metrics |
| **初回解決率（FCR）** | コールバック/転送なしで解決された割合 | 80% 超 | CTR + カスタム属性 |
| **顧客センチメント** | ポジティブ/ネガティブ/ニュートラルのセンチメントスコア | ポジティブ傾向 | Contact Lens |
| **サービスレベル** | しきい値内に応答されたコンタクトの割合 | 20 秒以内に 80% | Real-time Metrics |

#### 運用 KPI

| KPI | 定義 | 目標（例） | データソース |
|-----|-----------|-------------------|-------------|
| **平均処理時間（AHT）** | 通話 + 保留 + 後処理作業の時間 | 6 分未満 | CTR |
| **エージェント稼働率** | エージェントがコンタクトを処理している時間の割合 | 70〜85% | Real-time Metrics |
| **キューサイズ** | キュー内で待機しているコンタクト数 | キューあたり 10 未満 | CloudWatch Metrics |
| **同時通話使用率** | 同時通話クォータの使用率 | 80% 未満 | CloudWatch Metrics |
| **コンタクトフローエラー率** | フロー実行あたりのエラー数 | 1% 未満 | CloudWatch Metrics |

---

## 使用するタイミング

このガイドは以下の場合に使用してください：

- **新しい Amazon Connect インスタンスをセットアップする場合** — ガイダンスセクションの初日チェックリストを使用して、すべてのオブザーバビリティコンポーネントが最初から有効になっていることを確認します。
- **顧客体験の低下を診断する場合** — トラブルシューティングプレイブックを使用して、根本原因がクォータの枯渇、ルーティングの障害、音声品質、またはフローの設定ミスのいずれであるかを迅速に特定します。
- **コンタクトセンター移行のモニタリング戦略を構築する場合** — リファレンスアーキテクチャとダッシュボードレイアウトを使用して、運用、エンジニアリング、エグゼクティブのステークホルダー間で調整します。
- **コンプライアンスまたは規制要件を満たす場合** — セキュリティおよびコンプライアンスモニタリングパターン（CloudTrail、録音の完全性、データリダクション）は、コントロールカバレッジの実証に役立ちます。
- **計画されたトラフィックイベントに向けてスケーリングする場合** — クォータモニタリングとアラームの階層化により、マーケティングキャンペーン、季節的なピーク、製品ローンチ前にキャパシティの余裕を特定できます。
- **AI/ML 機能と併せて Amazon Connect を運用する場合** — 音声 AI のオブザーバビリティ（Contact Lens、Amazon Lex、Amazon Bedrock）には、標準の CloudWatch メトリクス以外の追加計装が必要です。

---

## ガイダンス

### CloudWatch メトリクス

Amazon Connect は `AWS/Connect` 名前空間で 1 分ごとに CloudWatch にメトリクスを自動的に発行します。高解像度（1 分）データは 15 日間保持され、その後 63 日間は 5 分解像度に、455 日間は 1 時間解像度に集約されます。

メトリクスは以下のディメンションで整理されます：**Instance**、**Queue**、**Contact Flow**、**Contact**、**Connection**（参加者およびストリームタイプごとの音声品質）。

**重要なメトリクスプラクティス：**

1. **クォータモニタリングにはパーセンテージメトリクスを使用** — `ConcurrentCallsPercentage`、`ConcurrentActiveChatsPercentage`、`ConcurrentTasksPercentage`、`ConcurrentEmailsPercentage` は設定されたクォータに対して正規化され、インスタンス間でアラームしきい値をポータブルにします。
2. **カウントベースのエラーメトリクスには Sum を使用** — `CallsBreachingConcurrencyQuota`、`MissedCalls`、`QueueCapacityExceededError` には、期間内の合計カウントを取得するために常に `Sum` を使用します。
3. **同時接続メトリクスには Maximum を使用** — `ConcurrentCalls`、`ConcurrentActiveChats`、`ConcurrentTasks` には、ピーク使用率をキャッチするために `Maximum` を使用します。
4. **`ToInstancePacketLossRate` を注意深くモニタリング** — 値の範囲は 0.0〜1.0（0.05 = 5% のパケットロス）です。CloudWatch の期間を 60 秒に設定してください。`Participant` ディメンションでフィルタリングして、エージェント側と顧客側の問題を分離します。
5. `ConcurrentTasks`、`ConcurrentTasksPercentage`、`ConcurrentEmails`、`ConcurrentEmailsPercentage` の **5 分の発行間隔に注意**してください。

### ロギング

#### コンタクトフローログ

コンタクトフローログは、フローを通過するすべてのコンタクトの実行パスをキャプチャします。インスタンス設定でフローロギングを有効にします（Data Storage → Contact flow logs）。ログは CloudWatch Logs の `/aws/connect/<instance-alias>` に発行されます。

**有用な CloudWatch Logs Insights クエリ：**

```sql
-- Find all errors in a specific contact flow
fields @timestamp, @message
| filter @message like /Error/
| filter @message like /your-flow-name/
| sort @timestamp desc
| limit 50
```

```sql
-- Track contacts that hit the error branch
fields @timestamp, ContactId, @message
| filter @message like /TookErrorBranch/
| stats count(*) as errorCount by bin(1h)
```

**ベストプラクティス：**
- 本番環境ではフローロギングを有効にしてください — オーバーヘッドは最小限で、トラブルシューティングの価値は高いです
- CloudWatch Logs の保持ポリシーを設定してください（アクティブなトラブルシューティングには 30〜90 日）。アクセス頻度の低いログのコスト最適化には [CloudWatch Logs Intelligent Tiering](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-cloudwatch-intelligent-tiering/) の利用を検討してください。
- `ContactFlowErrors` と `ContactFlowFatalErrors` をモニタリングしてください — これらはフローロジックの破損を示します

#### AWS CloudTrail

CloudTrail はすべての Amazon Connect API 呼び出しをログに記録します。モニタリングすべき主要なアクション：

| アクションカテゴリ | API 呼び出し | モニタリングの理由 |
|-----------------|-----------|-------------|
| **インスタンス変更** | `CreateInstance`、`DeleteInstance`、`UpdateInstanceAttribute` | セキュリティ、変更管理 |
| **ユーザー管理** | `CreateUser`、`DeleteUser`、`UpdateUserSecurityProfiles` | アクセス制御の監査 |
| **コンタクトフロー** | `CreateContactFlow`、`UpdateContactFlow`、`DeleteContactFlow` | 変更管理 |
| **電話番号** | `ClaimPhoneNumber`、`ReleasePhoneNumber` | キャパシティプランニング |
| **キュー/ルーティング** | `CreateQueue`、`UpdateQueueOutboundCallerConfig` | ルーティング変更 |

**CloudWatch Unified Data Store（UDS）** を活用して、CloudTrail データと Connect フローログを一元化し、統一されたクエリと相関分析を行います。

### Contact Trace Records（CTR）

CTR は、すべてのコンタクトのジャーニーの決定的な記録です — キュー情報、エージェント情報、切断の詳細、カスタム属性をキャプチャします。

**CTR データパイプラインアーキテクチャ：**

```
Amazon Connect Instance
         │
         ▼
  Kinesis Data Stream ──► Kinesis Data Firehose ──► S3 (Data Lake)
         │                                              │
         ▼                                              ▼
  Lambda (Real-time)                            Athena / QuickSight
  (Custom Metrics)                             (Historical Analytics)
```

**ベストプラクティス：**
- リアルタイム分析のために CTR を Kinesis Data Stream にストリーミングします
- 長期保持と Athena クエリのために CTR を S3 に保存します
- 完全な会話分析のために CTR と Contact Lens の出力を `ContactId` で相関させます
- 派生メトリクス（FCR、転送率）は CTR データから構築します — ネイティブの CloudWatch メトリクスとしては利用できません

### EventBridge 統合

Amazon Connect はデフォルトの EventBridge バスにイベントを発行します。主要なイベントタイプ：

| イベントタイプ | Detail-Type | ユースケース |
|-----------|-------------|----------|
| **コンタクトイベント** | `Amazon Connect Contact Event` | コンタクトライフサイクルの追跡 |
| **Contact Lens** | `Contact Lens Analysis State Change` | 通話後ワークフローのトリガー |
| **ルール一致** | `Contact Lens Realtime Rules Matched` | リアルタイムのスーパーバイザーアラート |
| **評価失敗** | `Contact Lens Automated Evaluation Submission Failed` | QA 自動化のヘルスモニタリング |

**パターン：顧客センチメントに対するリアルタイムアラート**
```json
{
  "source": ["aws.connect"],
  "detail-type": ["Contact Lens Realtime Rules Matched"],
  "detail": { "actionName": ["ESCALATION_DETECTED"] }
}
```
SNS → スーパーバイザー通知または PagerDuty にルーティングします。

### アラート

#### Tier 1：クリティカル（即座にページング）

| アラーム | メトリクス | しきい値 | 統計 | 理由 |
|-------|--------|-----------|-----------|-----|
| クォータ超過の通話 | `CallsBreachingConcurrencyQuota` | > 0、1 分 | Sum | すべてのカウント = 拒否された実際の顧客 |
| 同時通話が上限に近い | `ConcurrentCallsPercentage` | > 90%、5 分 | Maximum | 100% で新しい通話が拒否される |
| フロー致命的エラー | `ContactFlowFatalErrors` | > 0、1 分 | Sum | 顧客が無音または切断を経験 |
| スロットリングされた通話 | `ThrottledCalls` | > 0、1 分 | Sum | 通話がアクティブに拒否されている |

#### Tier 2：警告（運用チームに通知）

| アラーム | メトリクス | しきい値 | 統計 | 理由 |
|-------|--------|-----------|-----------|-----|
| キャパシティが上限に近い | `ConcurrentCallsPercentage` | > 80%、5 分 | Average | 拒否しきい値に近づいている |
| チャットキャパシティ警告 | `ConcurrentActiveChatsPercentage` | > 80%、5 分 | Average | チャットキューが無制限に増加する |
| キューの増大 | `QueueSize` | > 20 コンタクト、5 分 | Maximum | SLA 違反が差し迫っている |
| 長い待ち時間 | `LongestQueueWaitTime` | > 120 秒、5 分 | Maximum | 最長待機者が最悪の CX を定義する |
| 録音の失敗 | `CallRecordingUploadError` | > 0、5 分 | Sum | コンプライアンスリスク — 録音が失われる可能性 |
| 不在着信の急増 | `MissedCalls` | > 10、5 分 | Sum | 人員配置またはルーティングの問題 |

**複合アラーム**でノイズを削減します：

```
ALARM("HighConcurrentCalls") AND ALARM("LongQueueWaitTime")
  → "Contact Center Under Stress"

ALARM("FlowFatalErrors") AND ALARM("MissedCalls")
  → "Routing Failure Impacting Customers"
```

`CallsPerInterval` と `QueueSize` には**異常検出**を使用してください — トラフィックパターンは周期的であり、静的なしきい値は誤検知を生成します。Tier 1 アラームを SNS 経由でインシデント管理プラットフォーム（PagerDuty、OpsGenie、ServiceNow）と統合し、構造化されたオンコールエスカレーションを行います。

### ダッシュボード

3 つの異なるオーディエンス向けにダッシュボードを設計します：

| ダッシュボード | オーディエンス | 主要メトリクス |
|-----------|----------|-------------|
| **エグゼクティブ** | リーダーシップ、ビジネスオーナー | サービスレベル、放棄率、CSAT プロキシ（Contact Lens センチメント）、FCR |
| **運用** | スーパーバイザー、コンタクトセンターマネージャー | キューサイズ、同時利用率、フローエラー、エージェント遵守、不在着信 |
| **エンジニアリング** | プラットフォーム/DevOps チーム | API スロットリング、Lambda エラー、録音失敗、パケットロス、システムメトリクス |

**CloudWatch ダッシュボード変数**を使用して、キュー名、ルーティングプロファイル、または時間範囲でフィルタリングします。デプロイ、クォータ変更、マーケティングキャンペーンの注釈線を追加します。運用ダッシュボードの自動更新は 1 分に設定します。

### Contact Lens 分析

Contact Lens は、ML を活用した会話分析を提供します：音声テキスト変換、ターンごとのセンチメント分析、問題検出、無音時間検出、機密データリダクション、自動エージェント評価。

**オブザーバビリティでの活用：**

| 機能 | ユースケース | 統合 |
|-----------|----------|-------------|
| センチメントスコアリング | CSAT プロキシの経時追跡 | S3 → Athena → QuickSight |
| カテゴリラベル | 問題頻度の傾向モニタリング | EventBridge ルール → カスタムメトリクス |
| 無音時間 | システムまたはフローの問題検出 | 履歴分析 |
| コンプライアンスルール | 自動 QA スコアリング | EventBridge → アラート |

リアルタイムと通話後の両方の分析を有効にしてください — リアルタイムは通話中の介入を可能にし、通話後は最高の精度を提供します。Contact Lens データを S3 にストリーミングし、`ContactId` で CTR と結合してリッチな分析を行います。

### サービスクォータモニタリング

| クォータ | 推奨アラート | メトリクス |
|-------|------------------|--------|
| 同時アクティブ通話 | > 80% 使用率 | `ConcurrentCallsPercentage` |
| 同時アクティブチャット | > 80% 使用率 | `ConcurrentActiveChatsPercentage` |
| 同時アクティブタスク | > 80% 使用率 | `ConcurrentTasksPercentage` |
| 同時アクティブメール | > 80% 使用率 | `ConcurrentEmailsPercentage` |

70〜80% の持続的な使用率でクォータの引き上げをリクエストしてください — 100% になるまで待たないでください。ホリデー、マーケティングイベント、製品障害時の 2〜3 倍のトラフィックスパイクに対して計画します。CloudTrail 経由で API スロットリング（429 レスポンス）を追跡し、レート制限に達している統合を特定します。

### セキュリティとコンプライアンスモニタリング

**優先度の高い CloudTrail イベント：**

| イベント | リスク | アラートタイプ |
|-------|------|------------|
| `UpdateInstanceAttribute`（ストレージ変更） | データ流出 | クリティカル |
| 管理者セキュリティプロファイルでの `CreateUser` | 権限昇格 | クリティカル |
| `DisassociateInstanceStorageConfig` | 録音/ロギングの無効化 | クリティカル |
| `UpdateUserSecurityProfiles` | 不正なアクセス変更 | 警告 |
| `DeleteContactFlow` | サービス中断 | 警告 |

規制産業では、以下を追跡するコンプライアンスダッシュボードを構築します：録音の完全性（録音が成功したコンタクトの割合）、同意管理、S3 データ保持ライフサイクルのコンプライアンス、Contact Lens 評価カバレッジ。

### 初日オブザーバビリティチェックリスト

- [ ] コンタクトフローロギングの有効化（CloudWatch Logs、`/aws/connect/<instance-alias>`）
- [ ] CTR ストリーミングの有効化（Kinesis Data Stream → Kinesis Firehose → S3）
- [ ] エージェントイベントストリーミングの有効化（Kinesis Data Stream）
- [ ] Tier 1 および Tier 2 アラーム付きの CloudWatch ダッシュボードの設定
- [ ] API 監査用の CloudTrail の有効化、重要なアクション用の EventBridge ルールの作成
- [ ] アラーム通知とオンコールルーティング用の SNS トピックの設定
- [ ] 会話分析を使用する場合は Contact Lens の有効化
- [ ] CloudWatch Logs の保持ポリシーの設定（30〜90 日または Intelligent Tiering）
- [ ] 運用開始前のキューごとのベースラインメトリクスの文書化

### トラブルシューティングプレイブック

| 症状 | 最初の確認 | 次の確認 | 根本原因パターン |
|---------|------------|--------------|-------------------|
| 通話のドロップ | `CallsBreachingConcurrencyQuota` | `ThrottledCalls` | クォータの枯渇 |
| 長い待ち時間 | キューごとの `QueueSize` | エージェントの可用性（Real-time Metrics） | 人員不足 |
| 通話品質の低下 | `ToInstancePacketLossRate` | エージェントネットワーク（Participant ディメンション別） | ネットワークの問題 |
| フローの失敗 | `ContactFlowFatalErrors` | フローログ（CloudWatch Logs Insights） | フローの設定ミス |
| 録音の欠落 | `CallRecordingUploadError` | S3 バケットポリシー | 権限またはストレージの問題 |
| API の失敗 | CloudTrail 4xx/5xx イベント | Service Quotas コンソール | レート制限の超過 |

### リファレンスアーキテクチャ

```
                          Amazon Connect Instance
                                  │
            ┌─────────────────────┬┴────────────────────┐
            │                     │                      │
            ▼                     ▼                      ▼
  CloudWatch Metrics       Contact Flow Logs     CTR / Agent Events
  (AWS/Connect)            (CloudWatch Logs)     (Kinesis Data Stream)
            │                     │                      │
            ▼                     ▼                      ▼
  CloudWatch Alarms        Logs Insights         Kinesis Firehose
            │               Queries                      │
            ▼                                            ▼
  SNS → PagerDuty                              Amazon S3 (Data Lake)
                                                         │
            ┌────────────────────────────────────────────┤
            │                    │                       │
            ▼                    ▼                       ▼
       AWS Glue            Amazon Athena         Amazon QuickSight
     (ETL/Catalog)         (Ad-hoc queries)     (Dashboards/Reports)

  Amazon EventBridge ◄── Amazon Connect Contact Events
            │
  ┌─────────┼──────────┐
  ▼         ▼          ▼
Lambda     SNS    CloudWatch Logs
(Enrich) (Alerts) (Event Archive)
```

| ツール | 役割 |
|------|------|
| **CloudWatch** | メトリクス、アラーム、ダッシュボード、ログ、異常検出 |
| **EventBridge** | イベント駆動型の自動化、ルーティング、統合 |
| **X-Ray** | Connect フローから呼び出された Lambda 関数のトレース |
| **CloudTrail** | API 監査証跡、変更追跡 |
| **Kinesis** | リアルタイム CTR およびエージェントイベントストリーミング |
| **S3 + Athena** | 履歴分析、データレイククエリ |
| **QuickSight** | ビジネスインテリジェンスダッシュボード |
| **Contact Lens** | ML を活用した会話分析と QA |

---

## 関連リソース

- [CloudWatch を使用した Amazon Connect インスタンスのモニタリング](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)
- [Amazon Connect が発行する EventBridge イベント](https://docs.aws.amazon.com/connect/latest/adminguide/connect-eventbridge-events.html)
- [Amazon Connect サービスクォータ](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-service-limits.html)
- [Contact Lens for Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/analyze-conversations.html)
- [Amazon Connect の CloudWatch によるモニタリングとアラートのトリガー](https://aws.amazon.com/blogs/contact-center/monitor-and-trigger-alerts-using-amazon-cloudwatch-for-amazon-connect/)
- [CloudWatch による Amazon Connect インスタンスメトリクスの可視化](https://aws.amazon.com/blogs/contact-center/visualizing-amazon-connect-instance-metrics-with-amazon-cloudwatch/)
- [Amazon Connect 管理者ガイド — ロギングとモニタリング](https://docs.aws.amazon.com/connect/latest/adminguide/logging-and-monitoring.html)
- [CloudWatch Logs Insights クエリ構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
