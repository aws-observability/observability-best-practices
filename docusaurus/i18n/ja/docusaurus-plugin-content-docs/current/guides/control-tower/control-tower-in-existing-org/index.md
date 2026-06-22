---
sidebar_position: 4
---
# 既存の AWS Organization で Control Tower を有効化する際の追加の考慮事項

## Control Tower アカウント

Control Tower は、AWS Organization の管理アカウントで有効化されている必要があります。単一の AWS Organization 内に複数のランディングゾーンを持つことはできません。

Control Tower を最初に有効にすると、組織内の既存のアカウントは自動的に登録されませんが、2 つの OU、[共有アカウント](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts)と[それらの中のリソース](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html)が作成されます。組織には、これを許可するための十分なクォータが必要です。

Control Tower のセットアップ時にログアーカイブまたは監査アカウントに[既存のアカウントを使用する](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/)必要がある場合は、そうすることができますが、[config レコーダーを削除する](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html)および[config デリバリーチャネル](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html)を削除する必要があります。一般的には、Control Tower にこれらのアカウントを作成させ、必要に応じて過去のログをコピーする方が簡単ですが、非 AWS サービスとの既存のログ統合がある場合など、既存のアカウントを再利用する必要がある場合もあります。 

## Identity Center

ユーザーの認証に Control Tower と AWS Identity Center を使用することを強くお勧めします。Control Tower に Identity Center を管理させないことを選択し、Identity Center がまだ有効になっていない場合、Control Tower はそれを有効にしないため、Organization の代替 ID ソリューションを実装する必要があります。

既存の Identity Center が設定されておらず、Identity Center 管理をオプトインする場合、Control Tower はサービスを有効化し、[選択したアイデンティティソースに応じて](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations)グループとアクセス許可セットをプロビジョニングする場合としない場合があります。

Identity Center がすでに設定されている場合、Control Tower のホームリージョンと同じリージョンに存在する必要があります。Control Tower の管理をオプトインし、ローカルの IAM Identity Center ディレクトリを使用している場合、Control Tower はユーザー、グループ、および権限セットを作成します。他のディレクトリを使用している場合、[Control Tower は変更を加えません](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs)。

既存の IAM ユーザーまたは IAM フェデレーションを使用するアイデンティティソリューションをお持ちの場合は、Identity Center を採用することをお勧めします。Control Tower と Identity Center を有効にしても、既存の IAM ユーザー、ロール、ポリシーには影響せず、既存の IAM SAML 設定にも影響しません。これにより、古い IAM ユーザー / IAM フェデレーションを削除する準備が整うまでの移行期間中、両方のシステムを並行して実行することができます。 



## CloudTrail

既存の Organization で CloudTrail の Control Tower 管理を有効にする場合は、AWS Control Tower の[事前チェック](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)を通過するために、CloudTrail の[信頼されたアクセスを無効化](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)する必要があります。

Control Tower による CloudTrail の管理をオプトアウトした場合、トレイルのデプロイ、ログの一元化、およびトレイルを保護するためのセキュリティ対策の実装はお客様の責任となります。Control Tower は[組織トレイルを作成](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html)しますが、オプトアウトするとそのステータスはオフに設定されます。Control Tower に CloudTrail の管理を任せることをお勧めします。

**既存の組織にアカウントレベルのトレイルがある**状態で Control Tower の CloudTrail 管理を有効にすると、ログアーカイブアカウントのバケットにログを記録するよう設定された新しい Organizations 管理トレイルが作成されます。既存のトレイルには影響を与えないため、それらが記録中の場合、組織全体の CloudTrail コストが大幅に増加することが予想されます。これは、アカウントの各リージョンにおける管理イベントの最初のコピーのみが無料であるためです。アカウントレベルのトレイルの記録を停止することで、追加コストを防ぐことができます。

**既存の組織トレイルを持つ Organization** があり、Control Tower 管理にオプトインする場合は、[信頼されたアクセスを無効化](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)する必要があります。これを行うと、アカウント内のすべての組織トレイルはいずれにせよ機能しなくなるため、再びアクティブになったときに記録に対して課金されないよう、既存のトレイルの[ログ記録を停止](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html)する必要があります。その後、信頼されたアクセスを無効化し、Control Tower を有効化してください。これにより、組織の CloudTrail データが存在しない短い期間が発生するため、メンテナンス期間中に計画する必要があります。 


## 設定

Control Tower による Config の管理をオプトアウトすることはできません。

既存の Organization で Control Tower を有効化する場合、Control Tower の[事前起動チェック](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)に合格するために、[Config の信頼されたアクセスが無効化されている](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config)ことを確認する必要があります。Control Tower は有効化プロセス中に信頼されたアクセスを有効にします。

ログアーカイブおよび監査アカウントに既存のアカウントを使用する予定がある場合は、まずそれらのアカウントから[すべての Config リソースを削除する](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)必要があります。 




## バックアップ

Control Tower の[AWS Backup 統合](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html)を使用すると、各メンバーアカウントにボールト、共有アカウントに中央ボールト、および基本的なバックアップポリシーを備えた基本的なバックアップソリューションを設定できます。これは OU レベルで有効化でき、個々のリソースにタグを付けることで、関連するバックアップスケジュールの対象として指定できます。

すでにバックアップソリューションをお持ちの場合は、Backup 統合をオプトアウトできます。

Control Tower の統合では、論理的にエアギャップされた Vault はデプロイされず、クロスリージョンバックアップの設定もすぐには提供されません。


## 既存の OU とアカウントへのガバナンスの拡張

既存の組織で Control Tower を有効にしても、組織内の既存の OU やアカウントに対してガバナンスが自動的に拡張されるわけではありません。Control Tower ガバナンスの管理下に置くには、Control Tower を使用して[既存のアカウントを登録](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)する必要があります。

アカウントを登録するには、いくつかの[前提条件](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html)があります。

* ランディングゾーンがドリフト状態にないこと
* アカウントが組織のメンバーであること
* [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) ロールが存在し、AdministratorAccess 権限を持っていること
* 登録するアカウントに AWSControlTowerExecution ロールが [Control Tower リソースをデプロイ](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment)できるよう、組織で [StackSets の信頼されたアクセスが有効化](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html)されていること
* 既存の AWS Config リソースは[削除](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands)する必要があります。それが選択肢にない場合は、既存の Config リソースの使用を有効にするためにカスタマーサポートと連携する[プロセス](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)があります。なお、これは既存のログアーカイブアカウントおよび監査アカウントには適用されず、それらのアカウントでは Config リソースを削除する必要があります。

既存の AWS アカウントを AWS Control Tower に取り込む最も効率的な方法は、[OU 全体を登録する](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html)ことです。OU を登録すると、そのメンバーアカウントが AWS Control Tower ランディングゾーンに登録されます。AWSControlTowerExecution ロールがアカウントに自動的に追加されます。OU には最大 1000 個のアカウントを含めることができます。  



## 既存のコントロール

既存のアカウントを予防的コントロール（SCP、RCP）が設定された OU に登録する場合は、これらのコントロールが[プロビジョニングや登録アクションを妨げない](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure)ことを確認してください。あるいは、これらのコントロールを維持する必要がある場合は、アカウントを専用の登録 OU に登録してから、最終的な宛先に移動してください。

AWS Organizations には、既存の予防的コントロールを使用してアカウントや OU にガバナンスを拡張する際に超えないよう注意が必要な[サービス制限](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html)があります。

* RCP と SCP の最大ポリシーサイズ: 5120 文字
* OU のネストは最大 5 レベル
* OU またはアカウントに直接アタッチできる RCP と SCP はそれぞれ最大 5 つ

検出コントロールについて、アカウントに既存の Config ルールが定義されている場合、アカウントを登録するために Config レコーダーを削除しても、これらのルールは残ります。アカウントを Control Tower に登録し、新しいレコーダーが作成されると、ルールは評価を再開します。

Control Tower の外部で定義された設定ルールのコンプライアンス状態は、Control Tower ダッシュボードには表示されません。

カスタム Config ルールを使用していて、AWS Organization 全体のコンプライアンスの包括的なビューを取得したい場合は、[Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) フレームワークの [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) の実装を検討してください。  

