---
title: CloudTrail モニタリング
sidebar_label: CloudTrail モニタリング
---

# CloudTrail モニタリング

## 概要

AWS CloudTrail は、AWS インフラストラクチャ全体のアカウントアクティビティをモニタリングおよび記録し、ストレージ、分析、修復アクションの制御を提供します。AWS マネジメントコンソール、AWS SDK、コマンドラインツールを通じて行われた API 呼び出しをキャプチャし、どのユーザーとアカウントが AWS API を呼び出したか、ソース IP アドレス、呼び出しが行われたタイミングを特定できます。

このソリューションでは、CloudTrail トレイルの設定（マルチリージョン、シングルリージョン、組織）、管理イベントとデータイベントの有効化、詳細な制御のための高度なイベントセレクターの使用、VPC エンドポイントのネットワークアクティビティイベントのモニタリング、準リアルタイムアラート用の Amazon CloudWatch Logs との統合について説明します。完全なリファレンスについては、[AWS CloudTrail ユーザーガイド](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)を参照してください。

## 前提条件

- CloudTrail トレイルの作成と管理の権限を持つ AWS アカウント（`cloudtrail:*`、`s3:CreateBucket`、`s3:PutBucketPolicy`）
- ログ配信用の S3 バケット（または CloudTrail に作成させる）
- CloudWatch Logs 統合の場合：CloudWatch Logs ロググループと、CloudTrail に書き込みアクセスを付与する IAM ロール
- 組織トレイルの場合：すべての機能が有効な AWS Organizations

## アーキテクチャ

```
┌─────────────────────────────────────┐
│         AWS Account(s)              │
│  Management Events ─┐               │
│  Data Events ───────┤               │
│  Network Activity ──┘               │
└──────────┬──────────────────────────┘
           │ CloudTrail Trail
           ▼
┌──────────────────────┐     ┌─────────────────────────┐
│   Amazon S3 Bucket   │     │  Amazon CloudWatch Logs  │
│  (long-term storage) │     │  (near real-time query)  │
└──────────────────────┘     └────────────┬────────────┘
                                          │
                              ┌───────────▼────────────┐
                              │  CloudWatch Alarms /    │
                              │  Logs Insights queries  │
                              └────────────────────────┘
```

![CloudTrail Insights 異常検出ダッシュボード](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "通常と異なる API アクティビティを検出する CloudTrail Insights")

## デプロイ

### 1. マルチリージョントレイルの作成

```bash
aws cloudtrail create-trail \
  --name my-org-trail \
  --s3-bucket-name my-cloudtrail-bucket \
  --is-multi-region-trail \
  --enable-log-file-validation \
  --kms-key-id alias/cloudtrail-key
```

### 2. CloudWatch Logs 統合の有効化

```bash
aws cloudtrail update-trail \
  --name my-org-trail \
  --cloud-watch-logs-log-group-arn arn:aws:logs:us-east-1:123456789012:log-group:CloudTrail/DefaultLogGroup:* \
  --cloud-watch-logs-role-arn arn:aws:iam::123456789012:role/CloudTrail_CloudWatchLogs_Role
```

### 3. ロギングの開始

```bash
aws cloudtrail start-logging --name my-org-trail
```

### 4. 高度なイベントセレクターによるデータイベントの有効化

高度なイベントセレクターを使用して、機密バケットでの重要な S3 書き込みオペレーションのみをログに記録します：

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "eventName",
        "Equals": ["DeleteObject", "PutObject", "RestoreObject"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::sensitive-bucket/", "arn:aws:s3:::compliance-bucket/"]
      }
    ]
  }
]
```

以下のコマンドで適用します：

```bash
aws cloudtrail put-event-selectors \
  --trail-name my-org-trail \
  --advanced-event-selectors file://selectors.json
```

![データイベント用の高度なイベントセレクター設定](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "データイベント用の高度なイベントセレクター")

### 5. CloudTrail Insights の有効化

```bash
aws cloudtrail put-insight-selectors \
  --trail-name my-org-trail \
  --insight-selectors '[{"InsightType": "ApiCallRateInsight"},{"InsightType": "ApiErrorRateInsight"}]'
```

### 6. ネットワークアクティビティイベントの有効化（CloudTrail Lake）

VPC エンドポイントのネットワークアクティビティイベントにはイベントデータストアが必要です。以下のコマンドで作成します：

```bash
aws cloudtrail create-event-data-store \
  --name network-activity-eds \
  --advanced-event-selectors '[{"FieldSelectors":[{"Field":"eventCategory","Equals":["NetworkActivity"]}]}]'
```

## 検証

1. **トレイルのステータスを確認：**

```bash
aws cloudtrail get-trail-status --name my-org-trail
```

`IsLogging` が `true` で、`LatestDeliveryTime` が最近であることを確認します。

2. **CloudWatch Logs Insights で最近のイベントをクエリ：**

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| fields @timestamp, eventName, userIdentity.arn, sourceIPAddress
| sort @timestamp desc
| limit 20
```

3. **データイベントの流入を確認（CloudTrail Lake）：**

```sql
SELECT eventTime, eventName, userIdentity.arn
FROM $EDS_ID
WHERE eventCategory = 'Data'
  AND eventtime >= '2026-08-19 00:00:00'
ORDER BY eventTime DESC
LIMIT 10
```

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| CloudWatch Logs にイベントがない | CloudWatch Logs 統合が設定されていないか、IAM ロールに権限がない | トレイルに `CloudWatchLogsLogGroupArn` が設定されていることを確認し、ロールに `logs:CreateLogStream` と `logs:PutLogEvents` 権限があることを確認する |
| データイベントが表示されない | 高度なイベントセレクターの設定ミスまたはトレイルが開始されていない | `aws cloudtrail get-event-selectors` でセレクターを確認し、`IsLogging` が true であることを確認する |
| Insights イベントが生成されない | Insights が有効化されていないか、ベースラインデータが不十分 | Insights セレクターを有効化し、ベースライン計算のために 36 時間待つ |
| ネットワークアクティビティイベントが空 | イベントデータストアが `NetworkActivity` カテゴリに対して設定されていない | EDS の高度なイベントセレクターに `eventCategory = NetworkActivity` が含まれていることを確認する |

## 関連ソリューション

- [CloudTrail セキュリティフォレンジクス](../cloudtrail-security-forensics/)
- [CloudTrail コスト最適化](../cloudtrail-cost-optimization/)
- [CloudWatch Logs セキュリティ](../cloudwatch-logs-security/)
