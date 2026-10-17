---
title: ジャストインタイムノードアクセス
sidebar_label: ジャストインタイムノードアクセス
---

# ジャストインタイムノードアクセス

## 概要

ジャストインタイムノードアクセス（JITNA）は、AWS Systems Manager の機能であり、承認ベースのマネージドノードへの一時的なアクセスを提供します。永続的なセッションアクセスを付与する代わりに、JITNA ではユーザーが正当な理由とともにアクセスをリクエストする必要があり、Cedar ポリシーによって自動承認されるか、手動承認ワークフローにルーティングされます。アクセスは時間制限があり、OpsItems および EventBridge イベントを通じて完全に監査可能です。

このソリューションでは、Infrastructure-as-Code を使用した JITNA の有効化、Cedar を使用した自動承認および手動承認ポリシーの設定、イベント駆動型通知のための EventBridge との統合、および CloudWatch Logs を通じたアクセスリクエストアクティビティのモニタリングを説明します。

## 前提条件

- Systems Manager の委任管理者アカウントを持つ AWS Organizations
- ターゲットアカウントとリージョン全体で Systems Manager 統合コンソールが有効
- ターゲットマネージドノードに SSM Agent がインストールされ実行中
- リクエスター/承認者の ID 用に IAM Identity Center（SSO）または IAM が設定済み
- マネージドノードから Systems Manager エンドポイントへのネットワーク接続

## アーキテクチャ

JITNA は Quick Setup 設定マネージャーを通じてデプロイされます。以下の図は、組織レベルのデプロイメントを示しています：

![AWS Organizations 向け JITNA アーキテクチャ](/img/cloudops/recipes/centralized-operations-management/just-in-time-node-access/jitna-organization.png "Quick Setup 設定マネージャーによるジャストインタイムノードアクセスのデプロイ")

1. 委任管理者アカウント内の CloudFormation スタックが Quick Setup 設定マネージャーを作成します。
2. 統合コンソール設定マネージャーがすべての OU にデプロイされます。
3. JITNA 設定マネージャーが選択された OU にデプロイされます。
4. 承認ポリシー、セッション設定、および通知設定は個別にデプロイされます。

### 承認ポリシーとセッション設定

![JITNA 承認ポリシーとセッション設定](/img/cloudops/recipes/centralized-operations-management/just-in-time-node-access/jitna-resources.png "JITNA 承認ポリシーとセッション設定のアーキテクチャ")

1. CloudFormation StackSet が自動承認ポリシー、手動承認ポリシー、およびセッション設定を SSM ドキュメントとしてデプロイします。
2. 各ターゲットアカウント/リージョンが CloudFormation スタックとして必要なリソースを受け取ります。
3. 拒否アクセスポリシーが委任管理者アカウントに一元的にデプロイされます。

## デプロイ

### ステップ 1：CloudFormation を使用して JITNA を有効にする

委任管理者アカウントで Quick Setup 設定マネージャーをデプロイします。CloudFormation テンプレートは以下を作成します：

- Quick Setup 用の IAM サービスロール
- Systems Manager 統合コンソール用の設定マネージャー
- ジャストインタイムノードアクセス用の設定マネージャー

主要パラメータ：

| パラメータ | 説明 | 例 |
|-----------|-------------|---------|
| `DelegatedAdminAccountId` | SSM 委任管理者アカウント ID | `123456789012` |
| `HomeRegion` | 統合コンソールのリージョン | `us-east-1` |
| `JITNATargetOrganizationalUnits` | JITNA が有効になる OU | `ou-a1b2-abcd1234,ou-a1b2-efgh1234` |
| `JITNATargetRegions` | JITNA のリージョン（統合コンソールリージョンのサブセット） | `us-east-1,us-east-2,us-west-2` |
| `IdentityProviderSetting` | `IAM` または `SSO` | `IAM` |

サンプルテンプレート：[just-in-time-quick-setup-cfn-template.yaml](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/just-in-time-node-access/just-in-time-quick-setup-cfn-template.yaml)

### ステップ 2：承認ポリシーをデプロイする

CloudFormation StackSets を使用して承認ポリシーをデプロイします。テンプレートは以下を作成します：

- 開発ノード用の**自動承認ポリシー**（タグ `ENV:DEV`）
- 本番ワークロード用の**手動承認ポリシー**（例：`Workload:Ecommerce`、`Workload:Finance`）
- JITNA セッション用の**セッション設定**

サンプルテンプレート：[just-in-time-cfn-approval-policies.yaml](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/just-in-time-node-access/just-in-time-cfn-approval-policies.yaml)

### ステップ 3：Cedar ポリシーを設定する

Cedar ポリシーは自動承認ロジックを制御します。以下は主要な例です。

#### すべての ID に対する開発ノードへの自動アクセスの許可

```cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };
```

#### オンコール IDC グループに対する本番ノードへの自動アクセスの許可

```cedar
// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

完全なスキーマと組み込みオペレーターについては、[自動承認および拒否アクセスポリシーのステートメント構造](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html)を参照してください。Cedar の構文と組み込みオペレーター全般については、[Cedar ポリシー言語リファレンス](https://docs.cedarpolicy.com/)を参照してください。

### ステップ 4：通知用の EventBridge ルールを設定する

JITNA は手動承認リクエストに対して 3 つのイベントタイプを EventBridge に発行します：

| イベントタイプ | 説明 |
|-----------|-------------|
| `Requester Access Request Status Update` | ステータス変更（PendingApproval、Approved）をリクエスターに通知 |
| `Approver Access Request Status Update` | 保留中のリクエストを承認者に通知 |
| `JITNA Access Request Failed` | 複数のポリシーがノード上で競合した場合に発行 |

承認者通知用の EventBridge ルールパターン：

```json
{
  "source": ["aws.ssm"],
  "detail-type": ["Approver Access Request Status Update"],
  "detail": {
    "Approvers": ["AccessApprover1"]
  }
}
```

失敗したリクエスト用の EventBridge ルールパターン：

```json
{
  "source": ["aws.ssm"],
  "detail-type": ["JITNA Access Request Failed"]
}
```

これらのイベントを SNS トピック、Lambda 関数、またはサードパーティのインシデント管理ツールにルーティングします。

## 検証

1. **DEV ノードへのアクセスをリクエスト**：リクエストが自動承認され、セッションが即座に開始されることを確認します
2. **PROD ノードへのアクセスをリクエスト**：リクエストが `PendingApproval` 状態になり、承認者が EventBridge 通知を受け取ることを確認します
3. **保留中のリクエストを承認**：リクエスターが `Approved` イベントを受け取り、セッションを開始できることを確認します
4. **OpsItems を確認**：アクセスリクエストがタイプ `/aws/accessrequest` の OpsItems として保存されていることを確認します
5. **競合シナリオ**：ノードに複数の手動承認ポリシータグを付けて、`JITNA Access Request Failed` イベントが発行されることを確認します

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| ポリシーの競合でアクセスリクエストが失敗する | 同じノードに複数の手動承認ポリシーが適用されている | 各ノードが異なるタグを介して正確に 1 つの手動承認ポリシーに一致するようにします |
| 自動承認が機能しない | Cedar ポリシーの構文エラーまたはタグの不一致 | Cedar プレイグラウンドでポリシーを検証します。ノードタグがポリシー条件と正確に一致することを確認します |
| 承認者が通知を受け取らない | EventBridge ルールの欠落または不正な承認者 ID | EventBridge ルールパターンに正しい承認者プリンシパル ID が含まれていることを確認します |
| 承認前にセッションがタイムアウトする | アクセス期間が短すぎるか承認レイテンシが大きい | 承認ポリシーでアクセス期間を延長します。より迅速な対応のために承認者を追加します |
| リージョンで JITNA が有効になっていない | Quick Setup のターゲットリージョンにリージョンが含まれていない | `JITNATargetRegions` パラメータを更新します。リージョンは統合コンソールのターゲットリージョンに含まれている必要があります |

## 関連ソリューション

- [パッチおよびノード管理](../patch-and-node-management/) — Systems Manager による包括的なフリート管理
- [CloudTrail セキュリティフォレンジクス](../cloudtrail-security-forensics/) — セキュリティ調査と監査証跡分析
