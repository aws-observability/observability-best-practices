---
title: AWS Config コンプライアンスモニタリング
sidebar_label: AWS Config コンプライアンス
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# AWS Config コンプライアンスモニタリング

## Related Events

<RelatedEvents topics={["security"]} />

## 概要

AWS Config は、リソースインベントリ、設定履歴、変更通知を提供するフルマネージドサービスで、セキュリティとガバナンスに対応します。AWS 環境全体でのコンプライアンス監査、セキュリティ分析、リソース変更追跡、トラブルシューティングを実現します。

このソリューションでは、AWS Config レコーダーの有効化と運用、マネージドルール・カスタムルール・Conformance Pack によるコンプライアンス評価、非準拠リソースの修復、アカウント間での設定データの集約、AWS Config のコスト管理について説明します。

## 前提条件

- `config:*`、`s3:*`（配信バケット用）、`sns:*`（通知用）の IAM 権限を持つ AWS アカウント
- 設定項目の保存用に指定された S3 バケット（できれば集中ロギングアカウント内）
- 複数アカウントへのデプロイの場合、AWS Organizations が有効化されていること
- マルチアカウントデプロイ用の AWS CloudFormation StackSets または AWS Systems Manager Quick Setup

## アーキテクチャ

AWS Config は AWS リソース全体の設定変更を記録し、コンプライアンスを評価して、結果を S3 と CloudWatch に配信します。

![AWS Config リソースタイムラインに表示される設定変更の推移](/img/cloudops/guides/config/resourcetimeline.png)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  AWS Resources  │────▶│  Config Recorder │────▶│  S3 (Config     │
│  (all regions)  │     │                  │     │  Items)         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌──────────────┐          ┌──────────────┐
                        │ Config Rules │          │ Athena /     │
                        │ Conformance  │          │ QuickSight   │
                        │ Packs        │          └──────────────┘
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ CloudWatch       │────▶│ SNS Alerts      │
                        │ Metrics          │     │                 │
                        └──────────────────┘     └─────────────────┘
```

## デプロイ

### 1. すべてのリージョンで AWS Config を有効化

以下のいずれかの方法を使用します：

- **CloudFormation StackSets**：[StackSets テンプレート](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/)を使用して、組織全体に設定レコーダーをデプロイします。
- **Systems Manager Quick Setup**：[合理化されたデプロイ](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/)を使用します。
- **AWS Control Tower**：登録されたアカウント全体で Config を自動的にアクティブ化します。

### 2. レコーダーの設定

```bash
aws configservice put-configuration-recorder \
  --configuration-recorder name=default,roleARN=arn:aws:iam::ACCOUNT_ID:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig \
  --recording-group allSupported=true,includeGlobalResourceTypes=true
```

グローバルリソース（IAM）は、重複と追加コストを避けるために 1 つのリージョンでのみ記録してください。

### 3. 配信チャネルの設定

```bash
aws configservice put-delivery-channel \
  --delivery-channel name=default,s3BucketName=my-config-bucket,snsTopicARN=arn:aws:sns:us-east-1:ACCOUNT_ID:config-notifications
```

### 4. Conformance Pack のデプロイ

ルールを Conformance Pack にバンドルして一元的にデプロイします。AWS は HIPAA、NIST、PCI-DSS 用のプリビルトテンプレートを提供しています：

```bash
aws configservice put-conformance-pack \
  --conformance-pack-name my-security-pack \
  --template-s3-uri s3://my-bucket/conformance-pack-template.yaml
```

組織全体のデプロイには、[委任管理者アカウント](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/)を使用します。

### 5. 修復の設定

非準拠ルールに Systems Manager Automation ドキュメントを関連付けます：

```bash
aws configservice put-remediation-configurations \
  --remediation-configurations '[{
    "ConfigRuleName": "s3-bucket-versioning-enabled",
    "TargetType": "SSM_DOCUMENT",
    "TargetId": "AWS-ConfigureS3BucketVersioning",
    "Automatic": true,
    "MaximumAutomaticAttempts": 3,
    "RetryAttemptSeconds": 60
  }]'
```

### 6. クロスアカウント集約の設定

```bash
aws configservice put-configuration-aggregator \
  --configuration-aggregator-name my-org-aggregator \
  --organization-aggregation-source RoleArn=arn:aws:iam::ACCOUNT_ID:role/ConfigAggregatorRole,AllAwsRegions=true
```

## 検証

1. レコーダーが実行中であることを確認します：

```bash
aws configservice describe-configuration-recorder-status
```

2. コンプライアンスサマリーを確認します：

```bash
aws configservice get-compliance-summary-by-config-rule
```

3. `ConfigurationItemsRecorded` CloudWatch メトリクスをモニタリングして、データフローを検証します。

![Cost Explorer での使用タイプ別 AWS Config コスト内訳](/img/cloudops/guides/config/configcost.png)

4. 高度なクエリで集約データをクエリします：

```sql
SELECT resourceId, resourceType, configuration
WHERE resourceType = 'AWS::EC2::SecurityGroup'
```

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| レコーダーのステータスが `STOPPED` と表示される | レコーダーが手動で停止されたか、IAM ロールに権限がない | `aws configservice start-configuration-recorder` で再起動し、サービスリンクロールが存在することを確認する |
| Conformance Pack が `CREATE_FAILED` と表示される | テンプレートの構文エラーまたはターゲットアカウントでの権限不足 | ターゲットアカウントの CloudFormation イベントを確認し、`AWSConfigRoleForOrganizations` に必要な権限があることを確認する |
| 過剰な設定項目による Config コストの増加 | `AWS::Config::ResourceCompliance` がすべてのルール評価で CI を生成している | `ResourceCompliance` を記録から除外するか、ルールの一括削除前にコンプライアンス記録を停止する |
| 複数リージョンでグローバルリソースを評価するルール | `IncludeGlobalResourceTypes` が複数のリージョンで有効 | `includeGlobalResourceTypes=true` を 1 つのリージョン（ホームリージョン）でのみ設定する |
| 高度なクエリが空の結果を返す | アグリゲーターが設定されていないか、アカウントが登録されていない | `describe-configuration-aggregator-sources-status` でアグリゲーターのソースステータスを確認する |

## 関連ソリューション

- [CloudTrail モニタリング](../cloudtrail-monitoring/)
- [Control Tower ランディングゾーン](../control-tower-landing-zone/)
- [クロスアカウントオブザーバビリティ](../cross-account-observability/)
