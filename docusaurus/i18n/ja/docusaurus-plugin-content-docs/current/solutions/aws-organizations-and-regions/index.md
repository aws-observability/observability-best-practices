---
title: AWS Organizations とリージョン
sidebar_label: AWS Organizations とリージョン
---

# AWS Organizations とリージョン

## 概要

マルチアカウント AWS 環境の管理には、組織構造、アカウントライフサイクル、リージョン拡張、リソースタグ付けに関する計画的な検討が必要です。このガイドでは、アカウント移行の準備評価、新しい AWS リージョンの有効化（オプトインリージョンを含む）、追加リージョンへのランディングゾーンの拡張、アプリケーション中心のオペレーション向けタグ付け戦略の実装に関する運用ガイダンスを統合しています。

これらのトピックはクラウドオペレーションのスケールにおける基盤です。誤った対応はガバナンスのギャップ、コンプライアンスのドリフト、運用上の盲点を生み出し、時間の経過とともに悪化します。

## 使用するタイミング

- AWS アカウントを組織間で転送する場合（M&A、統合、再編）に、依存関係の評価チェックリストが必要
- 新しい AWS リージョンに拡張する場合に、明示的な有効化が必要なサービスと自動的にカバーされるサービスを理解する必要がある
- AWS Control Tower を運用していて、新しく有効化されたリージョンにガードレールとガバナンスコントロールを拡張する必要がある
- コスト配分、セキュリティ、コンプライアンス、運用の自動化のためのタグ付け戦略を確立または改善する
- ランディングゾーンのホームリージョン選択の影響を理解する必要がある

## ガイダンス

### アカウント移行の準備

AWS Organizations 間でアカウントを転送する際、複数のサービス依存関係が転送直後に影響を受けます。主な影響は以下のとおりです：

| カテゴリ | サービス/機能 | 影響 |
|----------|----------------|--------|
| アクセス制御 | IAM Identity Center | 権限セットの割り当てが削除される |
| 認可 | SCP / RCP | 即座に適用されなくなる |
| インフラストラクチャ | CloudFormation StackSets | リソースが削除される可能性がある（保持設定に依存） |
| リソース共有 | AWS RAM | 組織スコープの共有が取り消される |
| 請求 | Reserved Instances / Savings Plans | 組織全体の共有メリットが失われる |
| オブザーバビリティ | EventBridge クロスアカウント | `aws:PrincipalOrgID` を参照するポリシーが機能しなくなる |

**評価アプローチ：**

1. 管理アカウントに [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) をデプロイして、リソースベースのポリシー、委任管理者、信頼されたアクセスサービスをスキャンします
2. CloudShell から [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) を実行して、ターゲット組織の基盤準備状況のスナップショットを取得します
3. StackSets の保持設定、Identity Center の割り当て、RAM の共有、すべてのポリシータイプ（SCP、RCP、宣言型、管理）について手動 CLI チェックを実行します

**重要な転送前の手順** — アカウント回復オプションを確認します：

```bash
# Verify root user email is accessible
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# Verify contact information
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1
```

Organizations で `CreateAccount` を使用して作成されたアカウントの場合、ルートユーザーの認証情報が設定されていない可能性があります。転送前にルートユーザーのパスワードリセットを実行してください。

### 新しい AWS リージョンの有効化

2019 年 3 月以降に導入された AWS リージョンは、明示的な有効化が必要なオプトインリージョンです。組織全体でリージョンを有効化する前に：

1. 新しいリージョンへのアクセスが必要な OU を特定する
2. 既存の SCP と権限境界への影響を評価する
3. タグ付け戦略とコスト配分タグへの変更を計画する
4. コンプライアンスとセキュリティポリシーの変更の必要性を確認する

**単一アカウントの場合：** Account Settings → Regions に移動し、ターゲットリージョンを有効化します。

**AWS Organizations の場合：** まず管理アカウントで有効化し、次にメンバーアカウントで体系的に有効化します。数十〜数百のアカウントにわたる自動化には、CloudFormation StackSets または AWS CLI スクリプトを使用します。

**Control Tower 環境の場合：**
1. Organizations レベルでリージョンを有効化する
2. Control Tower コンソール → Landing Zone settings → Modify settings → Update Region Settings にアクセスする
3. 既存の OU を再登録するか、Account Factory を通じてアカウントを更新する
4. ガードレール、CloudWatch アラーム、AWS Config ルールが機能していることを確認する

### 新しいリージョンへのランディングゾーンの拡張

リージョンを有効化した後、ガバナンスフレームワークを拡張します：

**自動的に拡張されるサービス：**
- CloudTrail（すべてのリージョンに対して設定されている場合）
- AWS Billing と Cost Explorer
- IAM（グローバルサービス）
- Control Tower 組み込みガードレール（Landing Zone 更新後）

**明示的な有効化が必要なサービス：**
- GuardDuty、Security Hub、Macie、Detective
- AWS Config レコーダーとルール
- リージョン許可リスト付きのカスタム SCP
- Resource Explorer アグリゲーター
- CloudWatch Logs クロスリージョンオブザーバビリティシンク
- IAM Access Analyzer

新しいリージョンを許可する SCP の更新例：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowedRegions",
            "Effect": "Deny",
            "NotAction": [
                "cloudfront:*",
                "iam:*",
                "route53:*",
                "support:*"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotLike": {
                    "aws:RequestedRegion": [
                        "ap-southeast-2",
                        "ap-southeast-4"
                    ]
                }
            }
        }
    ]
}
```

**ホームリージョンの考慮事項：** ランディングゾーンのホームリージョンは、Control Tower 管理コンポーネント、監査ログアーカイブ、デプロイパイプラインをホストします。ホームリージョンの移動は大規模な作業（コアサービスの廃止と再デプロイ）です。拡張前に長期的な地理戦略に合致したホームリージョンを選択してください。

### アプリケーションオペレーション向けタグ付け戦略

効果的なタグ付けは、コスト配分、セキュリティ制御、コンプライアンスモニタリング、運用の自動化を可能にします。階層的なアプローチを実装してください：

**コアタグカテゴリ：**

| カテゴリ | キーの例 | 目的 |
|----------|-------------|---------|
| ビジネス | `CostCenter`、`Project`、`Owner` | コスト配分と説明責任 |
| 技術 | `Environment`、`Application` | リソースのグループ化と自動化 |
| セキュリティ | `SecurityLevel`、`DataClassification` | アクセス制御とコンプライアンス |
| オペレーション | `BackupSchedule`、`maintenance:patching` | 自動化された運用タスク |

**適用メカニズム：**

1. **タグポリシー**（AWS Organizations）— アカウント全体で必須のタグキー、許可される値、大文字小文字の扱いを定義
2. **AWS Config ルール** — 非準拠リソースを検出し、自動修復をトリガー
3. **Service Control Policies** — 必須タグなしのリソース作成を防止
4. **リソースグループ** — 集合管理のためにアプリケーションごとにリソースを整理

**アプリケーション中心のオペレーション：** AWS Service Catalog AppRegistry で `awsApplication` タグを使用して、正式なアプリケーションを定義します。myApplications ダッシュボードが、アプリケーションごとの統一されたコスト、セキュリティ、コンプライアンス、パフォーマンスビューを提供します。

## 関連リソース

- [Control Tower ランディングゾーン](../control-tower-landing-zone/) — マルチアカウント環境のガバナンスとガードレール
- [クロスアカウントオブザーバビリティ](../cross-account-observability/) — アカウントとリージョン全体の集中モニタリング
- [AWS Config コンプライアンスモニタリング](../aws-config-compliance/) — 設定のコンプライアンスとドリフト検出
