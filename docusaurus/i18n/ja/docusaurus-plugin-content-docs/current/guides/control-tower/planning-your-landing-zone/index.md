---
sidebar_position: 1
---
# ランディングゾーンの計画と実装

## ビジネス要件に合わせてリージョンを有効化する

### ホームリージョンとして最もよく使用するリージョンを選択する

Control Tower は複数のリージョンを管理できますが、単一のホームリージョンから有効化する必要があります。ワークロードの大部分を実行する予定のリージョンを特定し、それを Control Tower ホームリージョンとして指定してください。既存の AWS Identity Center インスタンスを使用している場合、ホームリージョンは AWS Identity Center が設定されているリージョンと同じである必要があります。

Control Tower のホームリージョンには、Landing Zone の主要な設定項目が格納されています。AWS Organization はそこで作成され、IAM Identity Center が有効化され、Cloudtrail データストレージ用の S3 バケットも配置されています。Audit アカウントの AWS Config も、ホームリージョンに結果を集約するように設定されています。  


### 未使用のリージョンを拒否し、許可されたすべてのリージョンを管理する

Control Tower は、ほとんどの AWS リージョンの使用を拒否し、ビジネスニーズに合ったサブセットのみを有効にする機能を提供します。これにより、攻撃対象領域が縮小され、ワークロードが不要なコストを発生させる可能性が低減され、ガバナンスとオブザーバビリティの要件が簡素化されます。

[グローバルリージョン拒否コントロール](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)は、ランディングゾーンの作成時または更新時に設定できます。これは Control Tower が管理するリージョンリストと連携して機能します。つまり、リージョンがガバナンスのために有効化されていない場合、そのリージョンは拒否されます。特定の組織単位 (OU) に対してリージョンの使用をさらに制限するには、[OU リージョン拒否コントロール](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html)を実装することもできます。これらのコントロールはいずれも [Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) を使用して実装されます。リージョンが拒否されていない場合、ユーザーは IAM 権限に従ってそのリージョンにリソースをデプロイできます。ワークロードへの影響を避けるため、リージョンを拒否する前に、そのリージョンで使用中のリソースがないことを確認してください。

Control Tower のホームリージョンはデフォルトでガバナンス対象となっており、ガバナンス対象外にすることはできません。

Control Tower のリージョン拒否 SCP には、Control Tower が機能するために必要な例外が含まれています。 

## AWS Identity Center を使用してアクセス制御を簡素化する

IAM ユーザーの使用を避け、代わりに AWS リソースへの人間のアクセス許可には[アイデンティティフェデレーション](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp)を要求することが AWS のベストプラクティスです。これにより、長期間有効な AWS 認証情報を使用する必要がなくなるため、認証情報の漏洩リスクを大幅に軽減できます。一元的なアクセス管理には、[AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html) を使用してアカウントへのアクセスおよびそれらのアカウント内の権限を管理することをお勧めします。

Identity Center は単一のリージョンで有効化でき、グローバルにユーザーが利用できます。Identity Center が組織で有効化されていない場合、Control Tower は Control Tower ホームリージョンで自動的に有効化します。Identity Center がすでに有効化されている場合は、Control Tower ホームリージョンで有効化されている必要があります。そうでない場合、[プリフライトチェック](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)が失敗します。

AWS Identity Center は Permission Sets をサポートしており、これらは AWS Organization 内のアカウントに割り当てることができ、それらのアカウントで IAM ロールを作成するためのテンプレートとして機能します。特定のアカウントの特定の Permission Set に Identity Center のユーザーまたはグループを関連付けると、そのユーザーまたはグループはそのアカウントで Permission Set によって定義されたロールを引き受けることができます。Control Tower が Identity Center を管理することを許可すると、いくつかの[事前設定されたグループと Permission Set](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html) が作成され、ユーザーアクセスの基盤を提供するためにアカウントに割り当てられます。 


### 企業のアイデンティティプロバイダーを統合する

Identity Center を使用してユーザーとグループを管理できますが、既存の企業 ID プロバイダーがある場合は、ID の単一の信頼できる情報源を維持するために、[Identity Center に接続する](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html)ことをお勧めします。

フェデレーテッドユーザーを使用していて、Control Tower が Identity Center に設定するデフォルトのグループおよびアクセス許可セットの設定を活用したい場合は、アップストリームプロバイダーで同じ名前のグループを作成し、それらを Identity Center に同期することができます。その後、ID プロバイダーでユーザーをこれらのグループに割り当てることで、登録済みアカウントへのアクセスを付与できます。

### 最小権限アクセスに向けた取り組み 

デフォルトの Permission Sets Control Tower が作成するものは、**AdministratorAccess** や **DeveloperAccess** などの一般的なユースケース向けに設計されています。本番ワークロード、特に機密データを扱う場合やセキュリティとコンプライアンスが重要な懸念事項となる状況では、ベストプラクティスとして、必要最小限のアクセス権限に絞り込むことが推奨されます。これは、カスタム Permission Sets を使用して必要な権限を明示的に付与したり、サービスコントロールポリシーを適用して不要なアクセスを拒否したりすることで実現できます。[AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) は、必要な権限の特定、未使用の権限の削除、および最小権限ポリシーの作成に役立ちます。


### 委任管理者アカウントを有効にする

Control Tower は、Organization 管理アカウントで Identity Center を有効にします。管理アカウントは AWS Organization の残りの部分を制御し、メンバーアカウントと同程度に予防的コントロール (SCP) によって制約することができないため、誰もが管理アカウントへのアクセス権を持つ必要性を最小限に抑えることがベストプラクティスです。このため、[Identity Center の委任管理者アカウントを有効にする](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html)ことをお勧めします。

管理アカウントにデプロイされたアクセス許可セットは、委任管理者アカウントから管理することができないため、管理アカウント専用のアクセス許可セット（例：MA_Administrator）を作成し、厳しく制限されたユーザーのみが引き受けられるようにすることをお勧めします。

### Control Tower が管理するロールに追加の制約を適用する

Control Tower は、AWS サービスが引き受けることができる[さまざまなロール](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)をメンバーアカウントに作成します。

[クロスサービスの混乱した代理](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)問題から保護するために、AWS Organization 外部の ID がサービスを騙して代わりにロールを引き受けさせることを防ぐ[リソースコントロールポリシー (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html) を定義できます。

Control Tower のロールに[アクセスをさらに制限する](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html)ための条件を追加することもできますが、これらのロールへの変更はランディングゾーンの更新時に上書きされる可能性があることに注意してください。


## AWS Backup でデータを保護する

Control Tower の[AWS Backup 統合](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/)を使用すると、各メンバーアカウントにバックアップボールト、共有アカウントに中央ボールト、および標準的なバックアップポリシー（毎時、毎週、毎日、毎月）を備えたベストプラクティスのバックアップソリューションを設定できます。バックアップは OU レベルで有効化でき、個々のリソースにタグを付けることで、関連するバックアップスケジュールの対象として指定できます。

必要に応じて、お好みの Control Tower カスタマイズ方法（[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html)、[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html)、[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html)、[StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)）を使用して、追加のバックアッププランをアカウントにデプロイできます。これらは [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) ロールを再利用することも、必要に応じて新しいロールを作成することもできます。

既存のバックアップソリューションをお持ちの場合は、この統合をオプトアウトできます。


## ビジネス要件に合わせて AWS Organization 構造を拡張する

### AWS Organizations のマルチアカウントのベストプラクティスに従う

Control Tower を使用する際は、[マルチアカウント戦略](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)および組織単位 (OU) の設計に関する AWS Organizations のベストプラクティスに従ってください。シンプルに保つことが重要です。差別化されたガバナンス、セキュリティ、およびポリシー要件をサポートするために必要な OU から始め、深いネストは避けてください。Control Tower は最大 5 レベルのネストをサポートしています。  


### Control Tower Security OU を変更または削除しないでください

Control Tower が Organization に対して適用する数少ない制限の 1 つとして、Security OU の下に追加のアカウントや OU を作成することができず、Control Tower 環境を壊さずに Control Tower が作成したアカウント（ログアーカイブ、監査）を移動または削除することもできません。  


### Security OU のみを残すためにすべての OU を削除しないでください

Control Tower は少なくとも 2 つの OU を持つことを想定しており、そのうちの 1 つはセキュリティ OU である必要があります。Control Tower を有効にしたときに作成される Sandbox OU は削除できますが、Organization 内に少なくとも 1 つ以上の OU がある場合に限ります。 


