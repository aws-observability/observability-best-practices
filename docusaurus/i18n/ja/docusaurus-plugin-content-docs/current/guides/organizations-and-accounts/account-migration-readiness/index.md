---
sidebar_position: 1
---
# AWS Organizations アカウント移行準備ガイド

> **免責事項：** このガイドは、AWS アカウントを組織間で移管する際に一般的に発生する依存関係と考慮事項に基づいた、ベストエフォートのガイダンスを提供します。移行の成功は、各お客様固有のシナリオ、ワークロード、および依存関係によって異なります。お客様は、実行前に自身の特定の環境を十分に評価し、すべての依存関係を検証し、移行計画をテストする責任を負います。このガイドは、考えられるすべての依存関係やエッジケースを網羅しているわけではありません。

## スコープ

このガイドでは、**AWS Organizations 間のアカウント移行**について説明します。ここで説明するアプローチでは、[Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) と [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) を使用して、レビューおよび評価プロセスを迅速化します。使用するツールやアプローチによって手順は異なる場合がありますが、これは検証済みの方法の一つです。

:::tip
アカウントを AWS Control Tower 環境に移行する際は、このガイドを移行前の依存関係チェックとして使用し、アカウントが対象の組織に移管された後は、補完として[既存の AWS アカウントを登録する](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)ガイドに従ってください。
:::

## 主要なサービスと依存関係の概要

以下の表は、アカウントが組織間で移管される際に影響を受ける可能性のある主要な AWS サービスと機能をまとめたものです。

| カテゴリ | サービス/機能 | 移管時の影響 |
|----------|----------------|-------------------|
| **アクセス制御** | IAM Identity Center | 権限セットの割り当てが削除され、ユーザーはアクセスを失う |
| **認可** | サービスコントロールポリシー (SCP) | 即座に適用が停止される |
| **認可** | リソースコントロールポリシー (RCP) | 即座に適用が停止される |
| **宣言型** | 宣言型ポリシー (EC2) | 即座に適用が停止される |
| **管理** | タグ、バックアップ、AI オプトアウトポリシー | アカウントからデタッチされる |
| **インフラストラクチャ** | AWS CloudFormation StackSets | リソースが削除される可能性がある（保持設定による） |
| **リソース共有** | AWS Resource Access Manager | 組織スコープの共有が取り消される（保持が有効でない限り） |
| **委任** | 委任管理者サービス | 移管前に登録解除が必要。一部のサービスはデータを削除する |
| **ポリシー条件** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | 移行元組織 ID を参照するポリシーはアクセスを拒否する |
| **請求** | Reserved Instances / Savings Plans | 組織全体の共有によるメリットが失われる |
| **請求** | コスト配分タグ | ターゲット組織で再アクティブ化が必要 |
| **オブザーバビリティ** | Amazon EventBridge クロスアカウント | 組織 ID を参照するイベントバスポリシーが機能しなくなる |
| **アカウントアクセス** | ルートユーザー / `OrganizationAccountAccessRole` | 移管前に確認しないとすべてのアクセスを失う可能性がある |

## 概要

このガイドでは、AWS アカウントを AWS Organizations 間で移管する前に、移行準備状況を評価するためのステップバイステップのプロセスを提供します。自動化ツール（[AWS Organizations のアカウント評価](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)）と検証済みの CLI コマンドを組み合わせて、すべての依存関係を網羅します。

**適用対象：** 合併・買収、組織統合、アカウント再編成。

**活用した主な機能：**
- [ダイレクトアカウント転送](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/)（2025 年 11 月）— スタンドアロン期間不要
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/)（2026 年 2 月）— 転送中にリソース共有を保持

**参考資料：**
- [アカウントを別の組織に移行する](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — AWS ドキュメント
- [アカウントの移行 - パート 1: ポリシー、AWS RAM、条件キー](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — AWS ブログ
- [アカウントの移行 - パート 2: 委任された管理者](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — AWS ブログ

---

## フェーズ 1: 評価ツールのデプロイ

### 1.1 AWS Organizations のアカウント評価をデプロイする

管理アカウントにデプロイします。提供機能: Policy Explorer、委任管理者スキャン、信頼されたアクセススキャン。

:::note
このガイドでは、簡略化のため、Hub スタックを管理アカウントにデプロイする方法を示しています。本番環境では、管理アカウントにおける最小権限の原則に従うため、AWS は Hub スタックを**別のメンバーアカウント**（例：共有サービスアカウントやセキュリティツールアカウント）にデプロイすることを推奨しています。Org-Management スタックは、いかなる場合でも常に管理アカウントにデプロイされます。
:::

**Hub Stack (管理アカウント):**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Hub \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-hub.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=UserEmail,ParameterValue=<EMAIL> \
    "ParameterKey=AllowListedIPRanges,ParameterValue=0.0.0.0/1\,128.0.0.0/1" \
    ParameterKey=OrganizationID,ParameterValue=<ORG_ID> \
    ParameterKey=ManagementAccountId,ParameterValue=<MGMT_ACCOUNT_ID> \
  --region <REGION>
```

**組織管理スタック (管理アカウント):**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-OrgMgmt \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-org-management.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

**スポークスタック (StackSet 経由で評価する各アカウント):**
```bash
aws cloudformation create-stack-set \
  --stack-set-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --permission-model SERVICE_MANAGED \
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false \
  --region <REGION>

aws cloudformation create-stack-instances \
  --stack-set-name AccountAssessment-Spoke \
  --deployment-targets OrganizationalUnitIds=<ROOT_OR_OU_ID> \
  --regions <REGION> \
  --region <REGION>
```

> **重要:** Spoke スタックを管理アカウントに直接デプロイしてください（SERVICE_MANAGED を使用した StackSets ではこのアカウントが除外されます）。
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

### 1.2 CFAT (Cloud Foundation Assessment Tool) を実行する

管理アカウントの CloudShell から実行します。
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

結果をダウンロードします。 `./cfat/assessment.zip`

---

## フェーズ 2: 自動評価 (Account Assessment ツール)

### 2.1 Web UI からスキャンを実行する

1. Account Assessment ウェブ UI にログインします（Cognito 認証情報はメールで確認してください）
2. **委任管理者**スキャンを実行し、CSV をダウンロードします
3. **信頼されたアクセス**スキャンを実行し、CSV をダウンロードします
4. **ポリシーエクスプローラー**の夜間スキャンを待ちます（または手動でトリガーします）。

```bash
# Trigger Policy Explorer scan manually
aws lambda invoke \
  --function-name <NAMESPACE>-PolicyExplorerStartScan-<ID> \
  --payload '{"source": "manual-trigger"}' \
  --region <REGION> \
  /dev/null
```

### 2.2 組織の依存関係に関する Search Policy Explorer

Web UI の Policy Explorer で以下を実行します。
1. **「Add OrgId」** ボタンをクリックして、ポリシー条件内の組織 ID を検索します。
2. 検索します。 `aws:PrincipalOrgID`, `aws:PrincipalOrgPaths`, `aws:ResourceOrgID`
3. 結果を CSV としてダウンロード

**検出対象:**
- 組織条件を含むリソースベースのポリシー（S3、KMS、SQS、SNS、Lambda など）
- 組織を参照するアイデンティティベースのポリシー
- 組織固有の条件を含む SCP

---

## フェーズ 3: 手動依存関係チェック (CLI コマンド)

以下のチェックは、自動化ツールでは対処されていないギャップをカバーしています。

### 3.1 アカウントを対象とする AWS CloudFormation StackSets

**リスク:** サービスマネージド StackSets は、アカウントが組織から離脱した際にリソースを削除します（ただし `RetainStacksOnAccountRemoval=true`).

:::info
**管理アカウント**または CloudFormation StackSets の委任管理者アカウントからこれらのコマンドを実行します。サービスマネージド StackSets はこれらのアカウントからのみ管理できます。
:::

```bash
# List all active StackSets
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

# For each StackSet, check if the migrating account has instances
aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>

# Check the retention setting
aws cloudformation describe-stack-set \
  --stack-set-name <STACKSET_NAME> \
  --region <REGION> \
  --query "StackSet.AutoDeployment.RetainStacksOnAccountRemoval"
```

**アクション:** 各 StackSet について `RetainStacksOnAccountRemoval=false` 重要なリソースをデプロイする場合は、次のいずれかを実行します。
- 更新する `RetainStacksOnAccountRemoval=true` 移行前
- または、それらのリソースが削除されることを文書化し、ターゲット組織で再作成する計画を立てる

### 3.2 IAM Identity Center の割り当て

**リスク:** 移行するアカウントがすべての権限セットの割り当てを削除されます。ユーザーはそのアカウントへの IAM Identity Center アクセスを失います。

:::info
**管理アカウント**または Identity Center の委任管理者アカウントからこれらのコマンドを実行します。
:::

```bash
# Get Identity Center instance ARN
aws sso-admin list-instances --region <REGION>

# List all permission sets provisioned to the account
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>

# For each permission set, list who has access
aws sso-admin list-account-assignments \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --region <REGION>
```

**アクション:** すべての割り当てを文書化します。移行後、ターゲット組織の Identity Center で、同等のアクセス許可セットと割り当てを再作成します。

### 3.3 AWS Resource Access Manager (AWS RAM) リソース共有

**リスク:** 組織スコープの AWS RAM 共有は、アカウントが離脱すると取り消されます。新機能 (2026 年 2 月) により、保持が可能になりました。

```bash
# Check shares OWNED by the migrating account (run from that account)
aws ram get-resource-shares --resource-owner SELF --region <REGION>

# Check shares consumed by the migrating account
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>

# List actual resources in shares
aws ram list-resources --resource-owner OTHER-ACCOUNTS --region <REGION>
aws ram list-resources --resource-owner SELF --region <REGION>
```

**軽減策 (2026 年 2 月の機能):** 転送前に AWS RAM 共有の保持を有効にします。
```bash
# Run from the share OWNER account
aws ram update-resource-share \
  --resource-share-arn <SHARE_ARN> \
  --retain-sharing-on-account-leave-organization \
  --region <REGION>
```

**SCP を使用して組織全体に適用する:**
```json
{
  "Effect": "Deny",
  "Action": ["ram:CreateResourceShare", "ram:UpdateResourceShare"],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "ram:RetainSharingOnAccountLeaveOrganization": "false"
    }
  }
}
```

### 3.4 組織ポリシー（認可、宣言型、および管理ポリシー）

**リスク:** アカウントが移管されると、すべての組織ポリシーの適用が停止されます。これには、認可ポリシー（SCP、RCP）、宣言型ポリシー（EC2）、および管理ポリシーが含まれます。

:::info
**管理アカウント**または AWS Organizations の委任管理者アカウントからこれらのコマンドを実行します。
:::

> **重要:** Account Assessment の Policy Explorer は **SCP コンテンツ**のみをスキャンします。RCP、宣言型ポリシー、管理ポリシーはカバーされません。これらは手動で確認する必要があります。
>
> **ヒント:** CFAT は有用な初期スナップショットを提供します。組織レベルで SCP、RCP、タグポリシー、バックアップポリシーが有効になっているかどうかを確認できます。以下の CLI コマンドを使用してより詳細な調査が必要なポリシータイプを把握するための出発点として活用してください。

```bash
# First: discover all policy types enabled in the organization
aws organizations list-roots --query "Roots[0].PolicyTypes"

# --- AUTHORIZATION POLICIES ---

# SCPs applied to the account (also covered by Policy Explorer for content)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# RCPs applied to the account (NOT covered by Policy Explorer)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY

# --- DECLARATIVE POLICIES ---

# Declarative Policies (EC2 - e.g., Allowed AMIs, block public snapshots)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter DECLARATIVE_POLICY_EC2

# --- MANAGEMENT POLICIES ---

# Check each management policy type that's enabled:
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter TAG_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BACKUP_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter AISERVICES_OPT_OUT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BEDROCK_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter CHATBOT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter INSPECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter NETWORK_SECURITY_DIRECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter S3_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter SECURITYHUB_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter UPGRADE_ROLLOUT_POLICY

# Get the account's parent OU (policies may be inherited)
aws organizations list-parents --child-id <ACCOUNT_ID>

# List policies at the OU level (repeat for each policy type)
aws organizations list-policies-for-target \
  --target-id <OU_ID> \
  --filter <POLICY_TYPE>

# Get policy content to replicate in target organization
aws organizations describe-policy --policy-id <POLICY_ID>

# Get effective management policies
aws organizations describe-effective-policy \
  --policy-type TAG_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type BACKUP_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type AISERVICES_OPT_OUT_POLICY \
  --target-id <ACCOUNT_ID>
```

**主な区別：**
- **認可ポリシー（SCP、RCP）** — SCP はプリンシパルが実行できる API アクションを制限します。RCP はリソースに対して実行できるアクションを制限します（例：Secrets Manager への暗号化されていないアクセスをブロック）。Policy Explorer は SCP のみをスキャンし、RCP はスキャンしません。
- **宣言型ポリシー（EC2）** — EC2 の望ましい状態の設定を強制します（例：許可された AMI のみ、パブリックスナップショットのブロック）。どちらのツールでもスキャンされません。
- **管理ポリシー** — タグ、バックアップ、AI オプトアウト、Bedrock、ChatBot、Inspector、SecurityHub、S3、ネットワークセキュリティディレクター、アップグレードロールアウト。転送時にデタッチされます。どちらのツールでもスキャンされません。

**アクション:** 組織で有効になっている各ポリシータイプについて、次の手順を実行します。
1. アカウントに適用されているポリシーを一覧表示します（直接適用 + OU/ルートから継承）
2. 以下を使用してポリシーコンテンツを取得します `describe-policy`
3. 転送前にターゲット組織にレプリケートする
4. 宣言型ポリシーの場合: アカウントのリソースがターゲット組織のポリシーにも準拠していることを確認する

### 3.5 委任管理者サービス

**リスク:** 移行前に登録解除が必要です。一部のサービスでは、登録解除時にデータが削除されます（Detective、Firewall Manager）。

:::info
**管理アカウント**からこれらのコマンドを実行します。
:::

```bash
# List all delegated admin accounts
aws organizations list-delegated-administrators

# List services for the migrating account
aws organizations list-delegated-services-for-account \
  --account-id <ACCOUNT_ID>
```

**アクション:** 委任された各サービスについて:
1. 代替の委任管理者を登録します（組織が継続する場合）
2. 移行するアカウントの登録を解除します
3. サービス固有の登録解除コマンドとデータ損失の影響については、Part 2 のブログを参照してください

### 3.6 Amazon EventBridge クロスアカウントイベントバス

**リスク:** 組織を参照するクロスアカウントイベント配信権限が機能しなくなります。

```bash
# Check event bus policy for organization-based permissions
aws events describe-event-bus --region <REGION>

# Check in all regions where EventBridge is used
aws events describe-event-bus --name default --region <REGION>
```

**アクション:** イベントバスリソースポリシーを更新して、組織 ID の代わりにアカウント ID を使用するか、ターゲットの組織 ID を追加してください。

### 3.7 請求とコスト管理

**リスク：** 組織レベルの請求履歴は管理アカウントに残ります。コスト配分タグは再アクティブ化する必要があります。

```bash
# List active cost allocation tags (to recreate in target organization)
aws ce list-cost-allocation-tags --status Active

# Check CUR report configuration
aws cur describe-report-definitions --region us-east-1

# Check organization details (feature set, for target organization compatibility)
aws organizations describe-organization

# List Savings Plans owned by the migrating account (run from that account)
aws savingsplans list-savings-plans --states active

# List Reserved Instances owned by the migrating account (run from that account)
aws ec2 describe-reserved-instances --filters Name=state,Values=active --region <REGION>

# Check Reserved Instance/Savings Plan sharing preferences (run from management account)
# Note: Use the Billing Console → Preferences → RI and Savings Plans discount sharing
# to see sharing mode (Organization-wide, Prioritized Group, or Restricted Group)
```

**アクション:**
- 転送前にすべての請求レポートをエクスポートする
- アクティブなコスト配分タグを記録する
- ターゲット組織でコスト配分タグを再アクティブ化する（最大 24 時間かかる場合があります）
- **Reserved Instances と Savings Plans:**
  - 移行アカウントが**購入した** Reserved Instances/Savings Plans はそのアカウントと共に移動しますが、移行元組織の一括請求には**適用されなくなります**
  - 移行元組織内の**他のアカウントが購入し**、移行アカウントと共有していた Reserved Instances/Savings Plans は、転送後に移行アカウントへの適用が**なくなります**
  - Reserved Instances/Savings Plans は購入した組織にのみ適用され、複数の組織にまたがって使用することはできません
  - 移行アカウントが組織全体の Reserved Instance/Savings Plan 共有から割引を受けていた場合、転送直後にその割引が失われます
  - 移行アカウントが組織全体で共有されていた Reserved Instances/Savings Plans を所有している場合、移行元組織はその割引容量を失います
  - **共有モードを確認してください:** 組織全体、優先グループ、または制限グループの共有モードによって影響範囲が異なります
  - 移行前に Reserved Instances/Savings Plans を別のアカウントに転送する必要がある場合は、AWS Support にお問い合わせください

---

## フェーズ 4: CFAT 基盤の準備状況 (ターゲット組織)

CFAT の結果を使用して、**ターゲット組織**がアカウントを受け取る準備ができていることを確認します。

| CFAT チェック | 移行において重要な理由 |
|------------|------------------------------|
| Control Tower がデプロイ済み | 受け入れるアカウントにガードレールを提供します |
| セキュリティ OU が存在する | アカウントには統制されたランディングゾーンが必要です |
| Log Archive アカウントが存在する | 移行したアカウントの集中ログ記録 |
| IAM Identity Center が設定済み | ユーザーは新しいアカウントへの IAM Identity Center アクセスが必要です |
| SCP が有効 | ガバナンスポリシーが準備されている必要があります |
| Config Recorder が有効 | 新しいアカウントのコンプライアンスモニタリング |

---

## フェーズ 5: 転送前チェックリスト

| # | チェック項目 | ツール | CLI コマンド | ステータス |
|---|-------|------|-------------|--------|
| 1 | リソースベースのポリシー内の組織 ID | Account Assessment（Policy Explorer） | Web UI → Add OrgId | ☐ |
| 2 | アイデンティティベースのポリシー内の組織 ID | Account Assessment（Policy Explorer） | Web UI 検索 | ☐ |
| 3 | 委任管理者サービス | Account Assessment（委任管理者スキャン） | `list-delegated-services-for-account` | ☐ |
| 4 | 信頼されたアクセスサービス | Account Assessment（信頼されたアクセススキャン） | `list-aws-service-access-for-organization` | ☐ |
| 5 | アカウントを対象とする StackSets | 手動 | `list-stack-instances --stack-instance-account` | ☐ |
| 6 | StackSet の保持設定 | 手動 | `describe-stack-set` → AutoDeployment | ☐ |
| 7 | Identity Center の割り当て | 手動 | `list-permission-sets-provisioned-to-account` | ☐ |
| 8 | AWS RAM 共有（所有） | 手動 | `get-resource-shares --resource-owner SELF` | ☐ |
| 9 | AWS RAM 共有（消費） | 手動 | `get-resource-shares --resource-owner OTHER-ACCOUNTS` | ☐ |
| 10 | AWS RAM RetainSharing が有効 | 手動 | `update-resource-share --retain-sharing...` | ☐ |
| 11 | アカウントに適用された SCP（認可） | Account Assessment（Policy Explorer）+ 手動 | `list-policies-for-target` | ☐ |
| 12 | アカウントに適用された RCP（認可） | 手動（Policy Explorer には含まれない） | `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` | ☐ |
| 13 | アカウントに適用された宣言型ポリシー（EC2） | 手動（どちらのツールにも含まれない） | `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` | ☐ |
| 14 | 管理ポリシー（Tag/Backup/AI/Bedrock/ChatBot/Inspector/SecurityHub/S3 など） | 手動 | `describe-effective-policy` + `list-policies-for-target` | ☐ |
| 15 | EventBridge クロスアカウント | 手動 | `describe-event-bus` | ☐ |
| 16 | コスト配分タグの記録 | 手動 | `list-cost-allocation-tags --status Active` | ☐ |
| 17 | CUR レポートのエクスポート | 手動 | `describe-report-definitions` | ☐ |
| 18 | Reserved Instance/Savings Plan の所有権と共有への影響の評価 | 手動 | `list-savings-plans` + `describe-reserved-instances` | ☐ |
| 19 | ターゲット組織の作成から 7 日以上経過 | 手動 | `describe-organization` | ☐ |
| 20 | ターゲット組織のアカウントクォータ | 手動 | Service Quotas を確認 | ☐ |
| 21 | ターゲット組織の SCP/RCP/宣言型ポリシーが準備済み | 手動 | 移行元から複製 | ☐ |
| 22 | ターゲット組織の Identity Center が準備済み | CFAT | ターゲットで CFAT を実行 | ☐ |
| 23 | OrganizationAccountAccessRole が削除済み | 手動 | 移行アカウントの IAM ロールを削除 | ☐ |

---

## フェーズ 5.5: ブレークグラス — アカウント復旧オプションの確認

**シナリオ:** アカウントを Identity Center アクセスやその他のアクセス制御を確認せずに移管した場合、そのアカウントへのすべてのアクセスを失う可能性があります。移管前に、独立してアクセスを回復できることを確認してください。

**これが重要な理由：** アカウントがソース組織を離れると：
- Identity Center の権限セットが削除される → IAM Identity Center へのアクセスが失われる
- `OrganizationAccountAccessRole` 信頼が壊れる可能性がある → クロスアカウントアクセスが失われる
- ルートユーザーの認証情報が存在しない場合（組織で作成されたアカウントに多い）→ アカウントがロックされる

### 転送前: リカバリオプションの確認

```bash
# Verify the account has a valid root user email (can you receive email there?)
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# Verify phone number is set (needed for root user MFA recovery)
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1

# Check alternate contacts are configured
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type SECURITY --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type BILLING --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type OPERATIONS --region us-east-1
```

### 転送前: 必要に応じてリカバリ情報を更新する

```bash
# Update root user email (from management account, requires Account Management trusted access)
aws account start-primary-email-update --account-id <ACCOUNT_ID> --primary-email <NEW_EMAIL> --region us-east-1
aws account accept-primary-email-update --account-id <ACCOUNT_ID> --otp <CODE> --primary-email <NEW_EMAIL> --region us-east-1

# Update account name (Apr 2025 feature — no longer requires root access)
aws account put-account-name --account-id <ACCOUNT_ID> --account-name <NEW_NAME> --region us-east-1

# Update phone number / contact info
aws account put-contact-information --account-id <ACCOUNT_ID> --region us-east-1 \
  --contact-information '{
    "FullName": "<NAME>",
    "PhoneNumber": "<PHONE>",
    "AddressLine1": "<ADDRESS>",
    "City": "<CITY>",
    "StateOrRegion": "<STATE>",
    "PostalCode": "<ZIP>",
    "CountryCode": "<CC>"
  }'
```

### 緊急時の復旧オプション（転送後にアクセスが失われた場合）

> ⚠️ **プリフライトチェックは非常に重要です。** AWS Support への連絡は最終手段にすべきです。複数の本人確認手順が必要で、数日かかる場合があり、アクセスの回復を保証するものではありません。転送前にすべての回復オプションを確認してください。

| 優先度 | 方法 | 使用する状況 | 手順 |
|----------|--------|-------------|-----|
| 1st | **ルートユーザーのパスワードリセット** | ルートメールにアクセスできる場合 | AWS サインイン → 「Forgot password」 → メール経由でリセット |
| 2nd | **ルートユーザーの MFA リセット** | MFA デバイスを紛失したが電話番号がある場合 | サインイン時に電話による確認フローを使用 |
| 3rd | **管理アカウント（ターゲット組織）** | アカウントがターゲット組織に移行済みの場合 | `OrganizationAccountAccessRole` が存在する場合はそれを使用するか、Account Management API を使用 |
| **最終手段** | **AWS Support** | メール/電話にアクセスできず、他のすべてのオプションを使い果たした場合 | 別のアカウントからサポートケースを開きます。複数の確認手順（アカウント ID、連絡先情報、請求の詳細）が必要です。**成功は保証されず、長時間かかる場合があります。** |

### 復旧のための転送前チェックリスト

| # | チェック項目 | ステータス |
|---|-------|--------|
| 1 | ルートユーザーのメールにアクセス可能（メールを受信できる） | ☐ |
| 2 | ルートユーザーのパスワードが判明している、またはメール経由でリセット可能 | ☐ |
| 3 | アカウントの電話番号が最新でアクセス可能 | ☐ |
| 4 | ルートユーザーの MFA デバイスが文書化済み/アクセス可能 | ☐ |
| 5 | 管理者アクセス権を持つ IAM ユーザー/ロールが少なくとも 1 つアカウントに存在する（組織から独立している） | ☐ |
| 6 | 代替連絡先（セキュリティ、請求、運用）が設定済み | ☐ |

> **重要:** アカウントが以下の方法で作成された場合 `CreateAccount` Organizations では、ルートユーザーの認証情報が設定されていない場合があります。アカウントを移管する前に、アカウントに独立してアクセスできることを確認するため、（ルートメールアドレス経由で）ルートユーザーのパスワードリセットを必ず実行してください。

---

## フェーズ 6: 転送の実行 (直接転送)

直接転送機能（2025年11月）を使用する場合、スタンドアロンのピリオドは不要です。

```bash
# Step 1: From TARGET organization management account - send invitation
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# Step 2: From the MIGRATING account - accept invitation
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## フェーズ 7: 転送後の検証

```bash
# Verify account is in new organization
aws organizations describe-organization

# Move account to correct OU
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# Verify SCPs are applied
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# Accept any AWS RAM share invitations
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <INVITATION_ARN> \
  --region <REGION>

# Re-activate cost allocation tags in target organization
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status '[{"TagKey": "<KEY>", "Status": "Active"}]'

# Set up Identity Center assignments in target organization
aws sso-admin create-account-assignment \
  --instance-arn <TARGET_INSTANCE_ARN> \
  --target-id <ACCOUNT_ID> \
  --target-type AWS_ACCOUNT \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --principal-type <USER|GROUP> \
  --principal-id <PRINCIPAL_ID> \
  --region <REGION>
```

---

## 付録: ツールカバレッジマトリックス

| 依存関係のカテゴリ | Account Assessment | CFAT | 手動 CLI |
|--------------------|-------------------|------|------------|
| リソースベースのポリシー（組織条件） | ✅ Policy Explorer | ❌ | — |
| アイデンティティベースのポリシー（組織条件） | ✅ Policy Explorer | ❌ | — |
| SCP のコンテンツと条件（認可） | ✅ Policy Explorer | ❌ | `describe-policy` |
| **RCP（認可）** | ❌ | ✅ 有効かどうかのみ確認 | ✅ `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` |
| **宣言型ポリシー（EC2）** | ❌ | ❌ | ✅ `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` |
| **管理ポリシー（Bedrock、ChatBot、Inspector、SecurityHub、S3 など）** | ❌ | ❌ | ✅ `list-policies-for-target --filter <TYPE>` |
| Tag/Backup/AI オプトアウト（管理） | ❌ | ✅ 有効かどうかのみ確認 | ✅ `describe-effective-policy` |
| 委任管理者 | ✅ スキャン | ❌ | `list-delegated-services-for-account` |
| 信頼されたアクセスサービス | ✅ スキャン | ✅ サービスを一覧表示 | `list-aws-service-access-for-organization` |
| StackSets（リスクのあるリソース） | ❌ | ❌ | ✅ `list-stack-instances` + `describe-stack-set` |
| Identity Center の割り当て | ❌ | ✅ 設定済みかどうか確認 | ✅ `list-account-assignments` |
| AWS RAM リソース共有 | ❌ | ❌ | ✅ `get-resource-shares` |
| Reserved Instance/Savings Plan の所有権と共有への影響 | ❌ | ❌ | ✅ `list-savings-plans` + `describe-reserved-instances` |
| EventBridge クロスアカウント | ❌ | ❌ | ✅ `describe-event-bus` |
| コスト配分タグ | ❌ | ❌ | ✅ `list-cost-allocation-tags` |
| Control Tower のステータス | ❌ | ✅ | — |
| 基盤のベストプラクティス | ❌ | ✅ フル評価 | — |
| 組織のクォータ | ❌ | ❌ | ✅ Service Quotas コンソール |

---

## 付録: 主要な日付と機能の可用性

| 機能 | 日付 | 移行への影響 |
|---------|------|---------------------|
| Direct Account Transfers | 2025 年 11 月 | スタンドアロン期間不要、支払い/連絡先の再設定不要 |
| AWS RAM RetainSharingOnAccountLeaveOrganization | 2026 年 2 月 | 転送を通じてリソース共有が保持される |
| Account Assessment Policy Explorer | v1.1.0+ | 組織依存ポリシーの夜間スキャン |

---

*AWS Organizations および CFAT の Account Assessment を使用して生成されました。すべての CLI コマンドはライブ AWS API に対して検証済みです。*
