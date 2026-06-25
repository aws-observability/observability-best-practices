---
sidebar_position: 5
---
# AWS Control Tower Landing Zone 4.0 へのアップグレード

## はじめに

AWS Control Tower Landing Zone 3.x を使用している場合、バージョン 4.0 にアップグレードすることで、AWS 組織全体にガバナンスコントロールを適用する方法においてより高い柔軟性を得ることができます。この記事では、主要なアーキテクチャの変更点を説明し、移行の影響を理解するための情報を提供するとともに、アップグレードを成功させるためのステップバイステップのガイダンスを提供します。

以前のバージョンの AWS Control Tower（3.x 以前）では、ランディングゾーンを有効にするために、必須のサービス統合を含む事前定義された組織構造を受け入れる必要がありました。Landing Zone 4.0 ではこれらの制約が取り除かれ、以下のことが可能になります。

- 既存の組織を再構築することなく、[AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html) から 1,200 以上のコントロールにアクセスできます
- 特定の要件に基づいて有効にする AWS サービスを自由に選択できるようになりました。サービス統合は必須ではなくなり、以下のことが可能になります。
  - 必要な場合にのみ、検出コントロール用に [AWS Config](https://aws.amazon.com/config/) を有効にする
  - 既存の監査ログソリューションがある場合は、[AWS CloudTrail](https://aws.amazon.com/cloudtrail/) を独立して管理する
  - ID 管理戦略に基づいて [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/) を選択する
  - バックアップ要件に応じて [AWS Backup](https://aws.amazon.com/backup/) 統合を制御する
- AWS Control Tower ガバナンスを適用しながら、独自の組織単位 (OU) 階層を定義できます
- 専用のサービス統合アカウントを必要とせず、[AWS Organizations](https://aws.amazon.com/organizations/) 統合とコントロールのみで最小限のランディングゾーンをデプロイできます

このコントロール専用モデルは、既存のランディングゾーンを持つ企業にとって特に価値があります。AWS Control Tower のガバナンスを段階的に採用できるためです。以前のバージョンで必要とされていた大規模な再構築を行うことなく、コントロールとコンプライアンスモニタリングを適用できます。

AWS Control Catalog から最大限の価値を引き出すための追加ガイダンスについては、AWS ドキュメントを参照してください: [AWS Control Tower の Control Catalog でガバナンスコントロールを検索および発見する](https://aws.amazon.com/blogs/mt/search-and-discover-governance-controls-with-control-catalog-in-aws-control-tower/)。

## メリットとアーキテクチャの変更

Landing Zone 4.0 では、柔軟性と運用効率を高める大幅な改善が導入されています。以下の比較では、バージョン 3.x と 4.0 の主な違いを示しています。

| 機能 | バージョン 3.x | バージョン 4.0 |
|---------|-------------|-------------|
| サービス統合 | 必須 | オプション |
| [AWS Config](https://aws.amazon.com/config/) S3 バケット | [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) と共有 | 専用バケット |
| AWS Config アグリゲーター | 組織 + アカウントアグリゲーター | サービスリンク型アグリゲーター |
| 委任された管理者 | なし | AWS Config 用の監査アカウント |
| OU 構造 | 必須の Security OU | 柔軟、顧客定義 |
| Manifest フィールド | 必須 | オプション |
| Config ベースライン | AWSControlTowerBaseline の一部 | スタンドアロンの ConfigBaseline |
| ドリフト通知 | [Amazon SNS](https://aws.amazon.com/sns/) | [Amazon EventBridge](https://aws.amazon.com/eventbridge/) |



## 前提条件

AWS Control Tower Landing Zone 4.0 にアップグレードする前に、以下の要件を満たしていることを確認してください。

> **重要**: このアップグレードは元に戻すことができません。AWS Control Tower は以前のランディングゾーンバージョンへのダウングレードをサポートしていません。Landing Zone 4.0 にアップグレードすると、バージョン 3.x にロールバックすることはできません。まず非本番環境でアップグレードをテストし、作業を進める前に包括的なバックアップを取得することを強くお勧めします。

#### 一般的な前提条件

1. **組織のドリフトを解消する**: Landing Zone 4.0 にアップグレードする前に、すべての組織のドリフトを解消することを強くお勧めします。ドリフトは AWS Control Tower コンソールで確認できます。アップグレード前に未解消のドリフトが残っている場合、アップグレード後および OU の再登録後も残存し、解消するために AWS Support ケースの作成が必要になる可能性があります。

2. **AWS Control Tower の前提条件を確認する**: 環境がすべての標準的な[AWS Control Tower の前提条件](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)を満たしていることを確認してください。

3. **サービス統合の依存関係を確認する**: ベースライン間の依存関係を理解してください。将来的に AWS Config 統合を無効にする予定がある場合は、サービスの依存関係により、Security Roles、AWS IAM Identity Center、および AWS Backup の統合も無効にする必要があります。

4. **包括的なバックアップを取得する**: アップグレードの前に、現在の設定をドキュメント化してバックアップします。
   - 組織構造（OU、アカウント、アカウントと OU のマッピング）をエクスポートする
   - 現在の Landing Zone 設定、Config アグリゲータービュー、SNS トピック設定をスクリーンショットまたはエクスポートする
   - Config ルールとアグリゲーター設定をエクスポートする
   - CloudFormation StackSet テンプレートとパラメータをエクスポートする
   - OU ごとの現在のベースラインバージョンと OU ごとのコントロール有効化ステータスをドキュメント化する
   - 該当する場合は CfCT CloudFormation テンプレートを保存する

```bash
# Export organizational units
aws organizations list-organizational-units-for-parent \
  --parent-id <ROOT_ID> > org_units_backup.json

# Export all accounts
aws organizations list-accounts > accounts_backup.json

# Export Config rules
aws configservice describe-config-rules > config_rules_backup.json

# Export Config aggregators
aws configservice describe-configuration-aggregators > aggregators_backup.json

# Export Control Tower IAM roles
aws iam get-role --role-name AWSControlTowerExecution > ct_exec_role_backup.json
aws iam get-role --role-name AWSControlTowerCloudTrailRole > ct_cloudtrail_role_backup.json
```

### AWS CloudFormation StackSet の前提条件

#### クローズ済み/停止済みアカウントのスタックインスタンスを削除する

AWS アカウントが閉鎖されると、管理アカウントの `AWSControlTowerBP-*` StackSets 内の AWS CloudFormation スタックインスタンスは**自動的に削除されません**。アップグレード中、AWS Control Tower はこれらの StackSets を更新しようとしますが、クローズされたアカウントで `AWSControlTowerExecution` を引き受けることができないため失敗します。これは[ドキュメント化された制限事項](https://docs.aws.amazon.com/controltower/latest/userguide/troubleshooting.html#unable-to-update-landing-zone)です。

時間をかけてアカウントを閉鎖してきた組織では、各 StackSet オペレーションが順番にタイムアウトする間、アップグレードが停止する可能性があります。これを防ぐには、アップグレードの前に以下のプリフライトチェックと修復を実行してください。

**事前確認：**

```bash
# Identify closed/suspended accounts
CLOSED=$(aws organizations list-accounts \
  --query "Accounts[?Status!='ACTIVE'].Id" --output text)

# Check for orphaned stack instances in AWS Control Tower StackSets
for SS in $(aws cloudformation list-stack-sets --status ACTIVE \
  --query "Summaries[?starts_with(StackSetName,'AWSControlTowerBP-')].StackSetName" \
  --output text); do
  for ACCT in $CLOSED; do
    COUNT=$(aws cloudformation list-stack-instances --stack-set-name "$SS" \
      --query "length(Summaries[?Account=='${ACCT}'])" --output text)
    [ "$COUNT" -gt 0 ] && echo "BLOCKER: $SS has $COUNT instances for closed account $ACCT"
  done
done
```

**推奨される修正方法：**

```bash
# For each StackSet flagged as BLOCKER in the pre-flight check above,
# remove the orphaned instances for the closed account
aws cloudformation delete-stack-instances \
  --stack-set-name "<stackset-name>" \
  --accounts '["<closed-account-id>"]' \
  --regions '["us-east-1","us-west-2"]' \
  --retain-stacks \
  --no-cli-pager
```

> **重要**: [`--retain-stacks`](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/delete-stack-instances.html) フラグが必要です。これがない場合、AWS CloudFormation はスタックを削除するためにクローズされたアカウントで `AWSControlTowerExecution` を引き受けようとしますが、これは失敗します。

#### AWS Control Tower ベースラインスタックに終了保護がないことを確認する

v4.0 へのアップグレードでは、メンバーアカウント内の特定の AWS CloudFormation スタック（特に AWS Config 関連のベースライン）が削除または置き換えられます。これらのスタックで終了保護が有効になっている場合、StackSet の操作が失敗し、アップグレードが停止します。

AWS Control Tower は、ベースラインスタックで終了保護を有効に**しません** — 代わりに [SCP（必須の予防的コントロール）](https://docs.aws.amazon.com/prescriptive-guidance/latest/designing-control-tower-landing-zone/mandatory.html) を使用します。ただし、終了保護は次のように AWS Control Tower の外部で有効になっている場合があります。

- **AWS Security Hub CSPM 自動修復** — [CloudFormation.3](https://docs.aws.amazon.com/securityhub/latest/userguide/cloudformation-controls.html) は、すべてのスタックに対して終了保護を推奨しています。自動修復により、AWS Control Tower が管理するスタックを含む、すべてのスタックで終了保護が有効になります。
- **[AWS Landing Zone Accelerator](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/problem-validationerror.html)** は、プロビジョニングされたスタックに対してデフォルトで終了保護を有効にします。

**事前確認（管理アカウントから実行）：**

```bash
# Assume role into a member account
CREDS=$(aws sts assume-role \
  --role-arn "arn:aws:iam::<member-account-id>:role/AWSControlTowerExecution" \
  --role-session-name "tp-check" --query Credentials --output json)

export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r .SessionToken)

# Check AWS Control Tower baseline stacks for termination protection
aws cloudformation describe-stacks --region <region> \
  --query "Stacks[?starts_with(StackName,'StackSet-AWSControlTowerBP-')].\
  [StackName,EnableTerminationProtection]" --output table
```

**推奨される修正方法：**

```bash
aws cloudformation update-termination-protection \
  --no-enable-termination-protection \
  --stack-name "<stack-name>" --region <region>
```

### AWS CloudTrail の前提条件

API 経由でアップグレードしており、AWS CloudTrail 統合が有効になっている場合:

1. **IAM ロールポリシーの更新**: `AWSControlTowerCloudTrailRole` から既存のインラインポリシーをデタッチし、新しいマネージドポリシー `AWSControlTowerCloudTrailRolePolicy` をアタッチします。

```bash
# Detach inline policy
aws iam delete-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-name <inline-policy-name>

# Attach new managed policy
aws iam attach-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSControlTowerCloudTrailRolePolicy
```

2. **S3 バケットの S3 レプリケーション設定を理解する**: CloudTrail 用の Control Tower マネージド S3 バケットを保護するための必須 SCP (CTS3PV8) が、*s3:PutReplicationConfiguration* アクションをブロックするようになりました。LZ 4.0 では既存の CloudTrail バケットを引き続き使用するため、現在のレプリケーション設定は引き続き正常に機能します。ただし、アップグレード後にレプリケーションルールを変更または再作成することはできなくなります。アップグレード後にレプリケーション設定を変更する必要がある場合の回避策は、AWSControlTowerExecution ロール (SCP から除外されています) を引き受けてレプリケーションルールを更新することですが、これは Control Tower の保護ガードレールをバイパスするため、慎重に使用する必要があります。

### AWS Config の前提条件

1. **データストレージの変更を理解する**: アップグレード後、AWS Config データは新しい専用の S3 バケットに保存されることに注意してください。履歴データは元の共有バケットに残り、自動的には移行されません。アップグレード完了後、新しいバケットに新しい Config データが表示されるまで最大 24 時間かかる場合があります。

2. **依存するワークフローを特定する**: S3 バケットから直接 AWS Config データにアクセスするすべてのワークフロー、スクリプト、ツールを文書化します。以下を含みます。
   - ログ集約ツール (Splunk、Datadog など)
   - SIEM 統合
   - カスタムダッシュボード (タグコンプライアンス、パッチコンプライアンスなど)
   - 自動コンプライアンスレポートツール

各依存関係の所有者を特定し、アップグレード前にカットオーバーのタイミングを調整してください。

3. **S3 バケットの S3 レプリケーション設定を理解する**: Control Tower が管理する Config 用 S3 バケットを保護するための必須 SCP (CTS3PV7) が、**s3:PutReplicationConfiguration アクション**をブロックするようになりました。その結果、アップグレード後はこのバケットに S3 レプリケーションを設定できなくなります。新しい Config バケットにレプリケーションが必要な場合の回避策は、**AWSControlTowerExecution** ロール (SCP の適用除外対象) を引き受けてレプリケーションルールを作成することですが、これは Control Tower の保護ガードレールをバイパスするため、慎重に使用する必要があります。

4. **カスタム AWS Config 高度なクエリのインベントリ**: 管理アカウントで組織レベルのアグリゲーターに対して作成されたカスタム AWS Config 高度なクエリがある場合、アップグレード後に監査アカウントで再作成する必要があります。Config アグリゲーターは管理アカウントから監査アカウントに移動するため、管理アカウントからのクロスアカウントクエリは機能しなくなります。アップグレード前にすべてのカスタムクエリをドキュメント化してください。

5. **SNS トピックのサブスクリプションを確認する**: AWS Control Tower SNS トピックのすべてのサブスクリプション、特にサードパーティ統合 (ServiceNow、PagerDuty など) の HTTPS エンドポイントを確認してください。これらのサブスクリプションがアップグレード後も引き続き通知を受信できることを確認してください。

6. **既存の Config リソースを持つアカウントの特定**: Control Tower によって作成されていない既存の AWS Config デリバリーチャネルを持つ登録済みアカウントがある場合、これらのデリバリーチャネルは新しい Config S3 バケットを指すように自動的に更新されません。アップグレードの前にこれらのアカウントを特定してください。[既存の AWS Config リソースを持つアカウントの登録](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)に関する AWS ドキュメントを参照してください。


## アップグレードプロセス

このセクションでは、AWS Control Tower ランディングゾーンをバージョン 3.x からバージョン 4.0 にアップグレードするためのステップバイステップのガイダンスを提供します。

### ステップ 1: アップグレードの準備

1. **ホームリージョンの管理アカウントで AWS Control Tower コンソールにアクセス**します。

2. **ランディングゾーンのバージョンを確認する**: ランディングゾーンの設定ページに移動し、現在のバージョンを確認します。

![Review the landing zone version](/img/cloudops/guides/control-tower/upgrade/image.png)

3. **ドリフトの確認**: Landing Zone の設定ページで、ランディングゾーンに「ドリフトは検出されませんでした」と表示されていることを確認します。ドリフトが検出された場合は、続行する前に解決してください。アップグレード前にすでにドリフト状態にあるアカウントは、アップグレード後および OU の再登録後もドリフト状態のままになる可能性があり、解決するために AWS Support ケースが必要になる場合があります。

4. **有効なサービス統合を確認する**: 現在有効になっているサービス統合 (AWS Config、AWS CloudTrail、AWS IAM Identity Center、AWS Backup) を確認します。

### ステップ 2: アップグレードを開始する

AWS Control Tower コンソールまたは AWS CLI/API を使用して、Landing Zone 4.0 にアップグレードできます。

#### コンソールからアップグレード

1. **AWS Control Tower コンソールで Landing Zone の設定に移動します**。

2. Landing Zone バージョン 4.0 を選択し、**「Update」ボタンをクリック**してアップグレードプロセスを開始します。
![Upgrade via console](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219204716.png)

3. 次のページで、Landing zone バージョン 4.0 が選択されていることを確認し、オプションで自動アカウント登録を設定します。アップグレード後は以前のバージョンに戻すことができないことにご注意ください。「次へ」をクリックします。
![Landing zone version selection](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205257.png)

4. 管理対象リージョンとリージョン拒否コントロールの設定を確認し、[次へ] をクリックします。

![Governed Regions ](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205556.png)
5. ここは「Service Integrations」を更新できるページです。Next をクリックします。
![Service Integrations 1](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205749.png)
![Service Integrations 2](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205825.png)

![Service Integrations 3](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205843.png)
5. ランディングゾーンの設定を確認し、**アップグレードを確定します**。「Update landing zone」をクリックしてアップグレードプロセスを開始します。

   ![Review and update](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210023.png)
![Review Integration settings](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210107.png)

![Review Integration Settings](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210132.png)
6. **アップグレードの進行状況を監視する**: アップグレードプロセスは通常 30〜60 分かかります。AWS Control Tower コンソールで進行状況を監視できます。


### ステップ 3: アップグレードの完了を確認する

1. **ランディングゾーンのステータスを確認する**: AWS Control Tower コンソールで、ランディングゾーンのステータスが「Active」と表示され、バージョンが「4.0」と表示されていることを確認します。

   ![Verify the upgrade completion](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210908.png)

2. **サービス統合の確認**: 以前に有効化されたすべてのサービス統合が引き続き有効で機能していることを確認します。

3. **アップグレードエラーの確認**: AWS Control Tower コンソールでエラーメッセージや警告がないか確認します。

### ステップ 4: 新しい設定ベースラインを確認する

- **新しい `ConfigBaseline` ベースライン:** 包括的な `AWSControlTowerBaseline` を必要とせずに検出コントロールをサポートするための、別個の `ConfigBaseline` が OU レベルに用意されました。詳細については、[OU レベルのベースラインタイプの一覧](https://docs.aws.amazon.com//controltower/latest/userguide/types-of-baselines.html#ou-baseline-types)を参照してください。デフォルトのランディングゾーンを使用している既存のお客様については、[主な変更点](https://docs.aws.amazon.com/controltower/latest/userguide/key-changes-lz-v4.html)に記載されている依存関係の要件を除き、すべてのサービス統合がオプションになりました。

![Verify base line](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219222252.png)

### ステップ 5: AWS Config の変更を確認する

Landing Zone 4.0 へのアップグレード後、AWS Config は重要なアーキテクチャ変更が行われます。以下の確認手順に従ってください。

#### 委任された管理者の登録を確認する

Audit アカウントが AWS Config の委任管理者として登録されていることを確認します。

```bash
# Check delegated administrator for AWS Config
aws organizations list-delegated-administrators \
  --service-principal config.amazonaws.com \
  --region <your-home-region>
```

予想される出力には、Audit アカウント ID が表示されます。

#### サービスにリンクされた Config アグリゲーターの確認

サービスリンク型 Config アグリゲーター (SLCA) が Audit アカウントに存在することを確認してください。新しいアグリゲーターは `aws-controltower-ConfigAggregatorForOrganizations` という名前で、監査アカウントにデプロイされています（管理アカウントに存在していた同名のレガシーアグリゲーターとは異なります）。

```bash
# Describe configuration aggregators in Audit account
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

監査アカウントに `aws-controltower-ConfigAggregatorForOrganizations` アグリゲーターが表示されるはずです。これはマネジメントアカウントにあったレガシーアグリゲーターと同じ名前を共有していますが、別のアカウントにデプロイされた異なるリソースであることに注意してください。

![Verify aggregator](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

#### 古いアグリゲーターが削除されていることを確認する
レガシーアグリゲーターが削除されていることを確認します。

1. **管理アカウント**で、`aws-controltower-ConfigAggregatorForOrganizations` が存在しなくなったことを確認します
2. **監査アカウント**で、`aws-controltower-GuardRailsComplianceAggregator` が存在しなくなったことを確認します

```bash
# In the management account - check for old aggregator (should return empty or not found)
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

**カスタム Config アグリゲーターの確認**
AWS Control Tower の命名規則外にカスタム AWS Config アグリゲーターがある場合は、それらが引き続き機能することを確認してください。AWS Control Tower は特定の命名パターンを持つアグリゲーターのみを管理します。カスタムアグリゲーターは影響を受けず、新しい SLCA と並行して実行できます。

#### カスタム Config クエリの移行を確認する

管理アカウントに古い組織レベルのアグリゲーターに対して実行されていたカスタム AWS Config 高度なクエリがあった場合、これらのクエリは管理アカウント内でのみローカルに実行できるようになりました（クロスアカウントは不可）。クロスアカウントクエリを実行するには、新しい `aws-controltower-ConfigAggregatorForOrganizations` アグリゲーターが存在する監査アカウントでそれらを再作成してください。

```bash
# In the Audit account - verify the new aggregator shows all member accounts
aws configservice describe-configuration-aggregator-sources-status \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --region <your-home-region>
```

#### 新しい S3 バケットの作成を確認する

新しい専用の AWS Config S3 バケットが Audit アカウントに存在することを確認します。

```bash
# List S3 buckets in Audit account
aws s3 ls | grep aws-controltower-config-logs
```

期待されるバケット命名パターン： `aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION_STRING>-<SUFFIX_STRING>`

![Verify AWS Config S3 bucket](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215231.png)

> **注意**: メンバーアカウントからの Config データがアップグレード後に新しい S3 バケットに表示されるまで、最大 24 時間かかる場合があります。S3 から読み取るダッシュボードおよびコンプライアンスツールは、この期間中に古いデータを表示します。ほぼリアルタイムのデータアクセスには、Config Aggregator API を使用してください。

#### CloudTrail バケットが変更されていないことを確認する

AWS CloudTrail が Log Archive アカウントの既存のバケットを引き続き使用していることを確認します。

```bash
# List S3 buckets in Log Archive account
aws s3 ls | grep aws-controltower-logs
```

期待されるバケット命名パターン： `aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>`

最近のタイムスタンプを確認してデータフローをテストします。

```bash
# Check recent CloudTrail logs
aws s3 ls s3://aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>/ --recursive | tail -20
```

#### Config デリバリーチャネルの確認

すべての登録済みアカウントの AWS Config デリバリーチャネルが新しい S3 バケットを指していることを確認します。

```bash
# Describe delivery channels
aws configservice describe-delivery-channels \
  --region <your-home-region>
```

`s3BucketName` は新しい `aws-controltower-config-logs-*` バケットを参照する必要があります。

![Verify AWS Config S3 bucket](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215431.png)

Control Tower によって作成されたものではない既存の Config 配信チャネルを持つ登録済みアカウントがある場合は、新しいバケットを指すように手動で更新する必要があります。

```bash
# Update pre-existing delivery channels to new bucket
aws configservice put-delivery-channel \
  --delivery-channel name=<CHANNEL_NAME>,s3BucketName=aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION>-<SUFFIX>
```

#### SLCA データ集計の確認

アップグレードが完了してから、完全なデータ集約が行われるまで 24〜48 時間お待ちください。その後、新しい Service-Linked Config Aggregator が、AWS Control Tower で管理されていないアカウントを含む、組織内のすべての AWS Config レコーダーからデータを集約できることを確認します。

```bash
# Get aggregated compliance summary
aws configservice get-aggregate-compliance-details-by-config-rule \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --config-rule-name <any-config-rule-name> \
  --account-id <test-account-id> \
  --aws-region <region> \
  --region <your-home-region>
```

#### ダウンストリームのダッシュボードとツールを確認する

Config データが新しいバケットへの流入を開始した後（最大 24 時間）、依存するすべてのダッシュボードとツールが最新のデータを受信していることを確認します。

- タグコンプライアンスダッシュボード
- パッチコンプライアンスダッシュボード
- SIEM 統合
- カスタムコンプライアンスレポートツール

古い `aws-controltower-logs-*` バケットを依然として参照しているダッシュボードには、アップグレード前の古いデータが表示されます。新しい `aws-controltower-config-logs-*` バケットを指すように更新するか、できれば Config Aggregator API を使用するようにリファクタリングしてください。


### ステップ 6: AWS CloudTrail の変更を確認する

AWS CloudTrail は Landing Zone 4.0 においてほとんど変更はありませんが、以下の点を確認してください。

#### IAM ロールポリシーの更新を確認する

API 経由でアップグレードした場合は、`AWSControlTowerCloudTrailRole` が新しいマネージドポリシーを使用していることを確認してください。

```bash
# List attached policies for CloudTrail role
aws iam list-attached-role-policies \
  --role-name AWSControlTowerCloudTrailRole
```

期待される出力には `AWSControlTowerCloudTrailRolePolicy` が含まれているはずです。

#### CloudTrail ログが継続していることを確認する

組織のトレイルがログ記録を継続していることを確認します。

```bash
# Describe trails
aws cloudtrail describe-trails \
  --region <your-home-region>
```

トレイルのステータスがアクティブであり、期待される S3 バケットにログが記録されていることを確認します。

### ステップ 7: SNS トピックの変更を確認する

Landing Zone 4.0 では、各サービス統合に専用の SNS トピックが導入されています。Audit アカウントで SNS トピックを確認します。

```bash
# List SNS topics in Audit account
aws sns list-topics --region <your-home-region>
```

Audit アカウントで想定される SNS トピック：
- `aws-controltower-AllConfigNotifications` - 引き続き AWS Config イベントを受信します
- `aws-controltower-AggregateSecurityNotifications` - ドリフト通知以外の通知にのみ引き続き存在します
- `aws-controltower-AggregateConfigurationNotifications` - コンプライアンス通知に引き続き対応します

![Verify SNS Topics](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219211445.png)

`AWSControlTowerBaseline` を有効にしてアップグレードするお客様の場合、監査アカウント内の既存の SNS トピックとそのサブスクリプションは保持され、変更なく引き続き機能します。主な変更点は、後で `AWSControlTowerBaseline` を無効にするお客様に対するものです — その場合、ドリフト通知は管理アカウントの Amazon SNS から Amazon EventBridge に移行します。

> **注意**: 一部の既存の SNS トピック（例えば `aws-controltower-AggregateSecurityNotifications`) にはアクティブなサブスクライバーが存在しない場合があります。これは想定された動作であり、アップグレード前の動作を反映しています。これらのトピックはプレースホルダーとして機能するものであり、問題を示すものではありません。

すべての SNS トピックサブスクリプション、特にサードパーティ統合（ServiceNow、PagerDuty など）の HTTPS エンドポイントを確認し、アップグレード後も引き続き通知を受信できることを確認してください。

### ステップ 8: コントロールの変更を確認する

AWS Control Tower Landing Zone 4.0 では、必須コントロールにいくつかの変更が加えられました。変更内容を確認するには、ドキュメント[Landing Zone 4.0 コントロールの変更点](https://docs.aws.amazon.com/controltower/latest/controlreference/mandatory-controls.html#changes-in-landing-zone-40)を参照してください。


## 組織単位の再登録

Landing Zone 4.0 にアップグレードした後、新しいベースラインバージョンをメンバーアカウントに適用するために、OU を再登録する必要があります。これは段階的に実施できる増分プロセスです。

#### OU の再登録について

AWS Control Tower がバージョン 4.0 に更新されると、新しいベースライン依存関係の構造により、OU の再登録が必要になります。[[AWS Control Tower ランディングゾーンバージョンとのベースラインの互換性に関するドキュメント]] を参照してください。

OU を再登録すると、次のことが行われます。
- AWS Control Tower は、その OU 内のすべてのメンバーアカウントを新しいベースラインバージョンに更新します
- Control Tower が管理する SCP は、更新中に一時的に非アクティブになります（通常は数分間）
- カスタム SCP は引き続き適用され、影響を受けません
- ワークロードは中断なく実行され続けます
- 1 回のバッチで OU あたり最大 1,000 アカウントを処理できます

> **重要**: 親 OU を再登録しても、子 OU にはカスケードされません。階層内の各 OU は個別に再登録する必要があります。トップレベルの OU から順に下に向かって、各子 OU を個別に再登録する計画を立ててください。OU 階層が深い場合、ロールアウトに大幅な時間が追加される可能性があります。


#### 段階的なロールアウト戦略

**推奨アプローチ**：

1. **階層的な有効化**: 子 OU に進む前に、上位レベルの OU から開始してください。各子 OU は個別に再登録する必要があり、カスケードされないことに注意してください。
2. **混在するベースラインバージョン**: 移行期間中は許容されます（3.x と 4.0 のハイブリッド）
3. **バッチ処理**: 「OU の再登録」を使用して、OU 内のすべてのアカウントを更新します（バッチあたり最大 1,000 アカウント）
4. **各 OU の監視**: 次の OU に進む前に、再登録が正常に完了したことを確認してください

#### コンソールから OU を再登録する

1. AWS Control Tower コンソールで **OU** ページに移動します
2. 再登録する OU を選択します
3. **Re-register OU** をクリックします
4. 更新されるアカウントを確認します
5. **Re-register OU** をクリックして確認します
6. コンソールで再登録の進行状況を監視します

**注意**: 移行後、新しいベースラインバージョンをデプロイするために、特定の OU を手動で再登録する必要がある場合があります。これは想定された動作であり、ベースラインの更新をいつ適用するかを制御できるようにするためのものです。

> **トラブルシューティング**: アカウントがアップグレード前にすでにドリフト状態にあった場合、再登録後もドリフト状態が続く可能性があります。この場合、影響を受けているアカウントで AWS Support にサポートケースを開き、継続的なドリフトを調査して解決してください。

## 追加リソース

- [AWS Control Tower ユーザーガイド](https://docs.aws.amazon.com/controltower/latest/userguide/)
- [AWS Control Tower API リファレンス](https://docs.aws.amazon.com/controltower/latest/APIReference/)
- [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html)
- [AWS Config ユーザーガイド](https://docs.aws.amazon.com/config/latest/developerguide/)
- [AWS CloudTrail ユーザーガイド](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/)
- [AWS Organizations ユーザーガイド](https://docs.aws.amazon.com/organizations/latest/userguide/)
