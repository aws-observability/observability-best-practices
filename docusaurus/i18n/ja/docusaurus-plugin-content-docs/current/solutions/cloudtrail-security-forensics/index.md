---
title: CloudTrail セキュリティフォレンジクス
sidebar_label: セキュリティフォレンジクス
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# CloudTrail セキュリティフォレンジクス

## Related Events

<RelatedEvents topics={["security"]} />

## 概要

AWS CloudTrail は、セキュリティフォレンジクス、インシデント対応、コンプライアンス監査に不可欠な API 呼び出し、ユーザーアクション、サービスイベントの詳細な記録を提供します。セキュリティインシデント発生時、CloudTrail ログは何が起こったか、誰が行ったか、何が影響を受けたかを理解するための主要な情報源です。

このガイドでは、フォレンジック分析のための重要なイベントフィールド、CloudTrail Lake と CloudWatch Logs Insights を使用した調査パターン、準リアルタイムの脅威検出のためのセキュリティ可視化ダッシュボードのデプロイについて説明します。CloudTrail トレイルまたはイベントデータストアが既に設定されていることを前提としています — セットアップガイダンスについては [CloudTrail モニタリング](../cloudtrail-monitoring/) を参照してください。

## 使用するタイミング

- IAM 認証情報の侵害が疑われる場合の調査
- クロスアカウントアクティビティまたはロールチェーン攻撃のトレース
- 攻撃者がアクセスまたは変更したリソースの特定
- 高リスク API アクティビティ（ルートログイン、権限昇格）に対する CloudWatch アラームの構築
- CloudTrail と VPC Flow Logs を相関させる一元化されたセキュリティダッシュボードの構築
- API アクティビティモニタリングの証拠を必要とするコンプライアンス監査への準備

## ガイダンス

### 調査のための重要なイベントフィールド

どの CloudTrail イベントフィールドを調べるかを理解することで、インシデント対応が加速します。フォレンジック分析で最も重要なフィールドは以下のとおりです：

| フィールド | セキュリティ上の重要性 |
|-------|----------------------|
| `userIdentity.type` | アクタータイプ（Root、IAMUser、AssumedRole）を識別します。Root の使用は即座にエスカレーションが必要です。 |
| `userIdentity.accessKeyId` | 複数のイベントにわたって侵害された認証情報を追跡します。 |
| `userIdentity.sessionContext` | ロールチェーン攻撃とクロスアカウントアクセスの理解に不可欠です。 |
| `eventName` | 攻撃者のテクニックを明らかにします — 偵察（`ListUsers`）、昇格（`CreateAccessKey`）、破壊（`DeleteBucket`）。 |
| `sourceIPAddress` | 地理的な発信元を特定します。脅威インテリジェンスフィードとクロスリファレンスしてください。 |
| `errorCode` / `errorMessage` | 失敗した攻撃の試みと権限境界を明らかにします。複数の `AccessDenied` エラーは認証情報のテストを示す可能性があります。 |
| `responseElements` | 修復中に取り消す必要のある新しく作成されたリソース（アクセスキー、ロール）を含みます。 |
| `readOnly` | 偵察（true）と変更アクション（false）を区別します。 |

完全なフィールドリファレンスについては、[CloudTrail イベントレコードの内容](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)を参照してください。

### 侵害されたアクセスキーの調査ワークフロー

1. **アクターの特定**：`userIdentity` フィールド（`type`、`userName`、`arn`、`accountId`）を使用して、侵害されたアイデンティティを特定します。`type` が `Root` の場合は即座にエスカレーションします。
2. **タイムラインの確立**：`eventTime` を使用してイベントを時系列で並べ、攻撃者がアクセスしていた期間を特定します。
3. **アクションの分析**：`eventName` と `readOnly` を確認してテクニックを理解します — `CreateAccessKey`、`AttachRolePolicy`、`PutUserPolicy`（永続化）、または `DeleteTrail`（検出回避）を探します。
4. **影響を受けたリソースの追跡**：`resources`、`requestParameters`、`responseElements` を使用して、ターゲットまたは変更された資産を特定します。
5. **アクセスパスの調査**：`sourceIPAddress`、`userAgent`、`sessionContext` をクロスリファレンスして、不正アクセスまたはロールチェーンを検出します。
6. **エラーの確認**：`errorCode` を分析して、IAM ポリシーによってブロックされたアクションを特定します — これにより攻撃者の完全な意図が明らかになります。

### CloudTrail Lake を使用したクエリ

スキャンコストを最小化するために、`eventTime` でクエリを制約します：

```sql
SELECT eventTime, userIdentity.arn, eventName, sourceIPAddress, errorCode
FROM $EDS_ID
WHERE eventName = 'CreateAccessKey'
  AND eventtime >= '2026-08-18 00:00:00'
  AND eventtime <= '2026-08-20 23:59:59'
ORDER BY eventTime DESC
```

VPC エンドポイントのアクセス拒否を検出します（ネットワークアクティビティイベント）：

```sql
SELECT count(*) as VPCAccessDenied, userIdentity.arn,
    userIdentity.accountid, eventName, errorMessage,
    vpcEndpointId, sourceIPAddress
FROM $EDS_ID
WHERE eventCategory = 'NetworkActivity'
    AND errorCode = 'VpceAccessDenied'
    AND eventtime >= '2026-08-18 00:00:00'
    AND eventtime <= '2026-08-20 23:59:59'
GROUP BY userIdentity.arn, userIdentity.accountid,
    eventName, errorMessage, vpcEndpointId, sourceIPAddress
ORDER BY eventName DESC
```

### リアルタイムアラート用の CloudWatch Logs メトリクスフィルター

高優先度イベントに対して CloudTrail ロググループにメトリクスフィルターを作成します：

| イベント | メトリクスフィルターパターン |
|-------|----------------------|
| ルートアカウントの使用 | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| 権限昇格 | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| コンソールログイン失敗 | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

アラームアクションをセキュリティオペレーションチームに通知する SNS トピックにルーティングします。

### セキュリティ可視化ダッシュボード

CloudWatch Unified Data Store を活用して CloudTrail と VPC Flow Logs アクティビティの準リアルタイムの可視性を提供する、プリビルトの CloudWatch ダッシュボードを CloudFormation を使用してデプロイします：

1. [CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml) テンプレートをダウンロードします。
2. パラメータ `DashboardName` と `LogFormat`（Standard または OCSF）を使用して CloudFormation 経由でデプロイします。
3. ダッシュボードは `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` を使用して CloudTrail データを自動的に検出します — ロググループ名の設定は不要です。

ダッシュボードは 6 つのセクションを提供します：セキュリティ概要、相関セキュリティインサイト、ネットワークセキュリティ、アイデンティティとアクセス管理、アクティビティ分布、詳細セキュリティイベントタイムライン。

![API エラー、アイデンティティタイプ、認証イベントを表示する CloudTrail セキュリティ可視化ダッシュボード](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png "CloudTrail セキュリティダッシュボード — 概要セクション")

![ネットワーク分析と詳細イベントタイムラインを表示する CloudTrail セキュリティダッシュボード](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png "CloudTrail セキュリティダッシュボード — ネットワークとイベントセクション")

### AI 支援調査のための CloudTrail MCP Server の使用

[CloudTrail MCP server](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) は、AI エージェントが自然言語で CloudTrail イベントをクエリできるようにし、複雑な SQL や CloudWatch Logs Insights クエリを手動で記述する必要を排除します。サンプルプロンプト：

- 「過去 24 時間のすべての失敗したコンソールログイン試行をユーザー名とソース IP とともに表示してください。」
- 「CloudTrail Lake を使用して、過去 90 日間のすべての IAM ポリシー変更を表示してください。」
- 「先週作成されたアクセスキーと作成者を表示してください。」

MCP server は、アカウント内で利用可能な CloudTrail データソース（CloudWatch Logs と CloudTrail Lake）を自動的に検出します。

## 関連リソース

- [CloudTrail モニタリング](../cloudtrail-monitoring/) — トレイルとイベントデータストアのセットアップと設定
- [Security Lake と CloudWatch](../security-lake-cloudwatch/) — 一元化されたセキュリティデータレイク
- [CloudWatch Logs セキュリティ](../cloudwatch-logs-security/) — CloudWatch Logs のセキュリティ保護と分析
- [AWS CloudTrail イベントリファレンス](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html) — 完全なイベントフィールドドキュメント
