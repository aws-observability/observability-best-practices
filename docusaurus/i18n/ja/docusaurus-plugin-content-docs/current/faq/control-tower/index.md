---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower はどのような問題を解決しますか？

AWS Control Tower は、複数の AWS アカウントとチームを持つ組織が、確立されたポリシーへのコンプライアンスを確保しながら、スケールで[マルチアカウント AWS 環境](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)をセットアップおよびガバナンスするための簡単な方法を必要としている場合に役立ちます。


### AWS Control Tower の使用に追加コストはかかりますか？

AWS Control Tower の使用に追加料金や前払いのコミットメントはありません。AWS Control Tower によって有効化された AWS サービス、ランディングゾーンで使用するサービス、および選択したコントロールの実装に対してのみ料金が発生します。例えば、以下に対して料金が発生します。- AWS Config を使用して実装される Account Factory でのアカウントのプロビジョニングおよび必須コントロールのための Service Catalog。  


### AWS Control Tower のコントロール (ガードレール) とは何ですか？

[コントロール](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html)は、以前はガードレールと呼ばれていましたが、セキュリティ、オペレーション、およびコンプライアンスのために明確に定義されたルールであり、非準拠リソースのデプロイを防止し、デプロイされたリソースのコンプライアンスを継続的に監視するのに役立ちます。


### AWS Control Tower はどのような種類のコントロールを提供していますか？

AWS Control Tower には、主に 3 種類のコントロールがあります。

1. [予防的コントロール](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): アクションの発生を防止します。AWS Organizations のサービスコントロールポリシー (SCP) を使用して実装されます。
2. [検出的コントロール](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): 発生後に特定のイベントやリソースのコンプライアンス違反を検出し、ダッシュボードを通じてアラートを提供します。AWS Config ルールを使用して実装されます。
3. [プロアクティブコントロール](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): リソースがアカウントにプロビジョニングされる前に、会社のポリシーと目標に準拠しているかどうかを確認します。リソースがコンプライアンスに違反している場合、プロビジョニングされません。プロアクティブコントロールは AWS CloudFormation フックを使用して実装されます。

AWS Control Tower でこれら 3 種類のコントロールを組み合わせることで、マルチアカウント AWS 環境がベストプラクティスに従ってセキュアに管理されているかどうかを監視できます。


### Control Tower はどの AWS サービスをオーケストレートしますか？

AWS Control Tower は[複数の AWS サービス](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html)を調整して、マルチアカウント AWS 環境のセットアップとガバナンスを行います。AWS Control Tower が調整する主なサービスは以下のとおりです。
1. AWS Organizations - マルチアカウント環境全体で一貫したコンプライアンスとガバナンスのフレームワークを設定するために使用されます
2. AWS Service Catalog - アカウントのデプロイと登録を自動化する Account Factory 機能に使用されます
3. AWS IAM Identity Center（旧 AWS SSO）- ユーザー ID とフェデレーテッドアクセスの管理に使用されます。また、AWS Control Tower は以下とも統合されています。
4. AWS CloudTrail - 集中ログアーカイブの作成の一部として使用されます
5. AWS Config - デプロイされたリソースの監視およびベストプラクティスからのドリフトを防ぐために使用されます。



### 既存の ID プロバイダーを AWS Control Tower で使用できますか？

AWS Control Tower は、アイデンティティプロバイダー統合に関して 3 つのオプションを提供しています。
1. IAM Identity Center ユーザーストア: これはデフォルトのオプションで、AWS Control Tower が IAM Identity Center をセットアップして管理します。IAM Identity Center ディレクトリにグループを作成し、メンバーアカウント内の選択されたユーザーに対してこれらのグループへのアクセスをプロビジョニングします。
2. Active Directory: AWS Control Tower が Active Directory でセットアップされている場合、AWS Control Tower は IAM Identity Center ディレクトリを管理せず、新しい AWS アカウントにユーザーやグループを割り当てません。
3. 外部アイデンティティプロバイダー (IdP): このオプションでは、AWS Control Tower が IAM Identity Center ディレクトリにグループを作成し、メンバーアカウント内の選択されたユーザーに対してこれらのグループへのアクセスをプロビジョニングします。アカウント作成時に Microsoft Entra ID、Google Workspace、Okta などの外部 IdP から既存のユーザーを指定でき、AWS Control Tower が IAM Identity Center と外部 IdP 間でユーザーを同期する際に、新しく作成されたアカウントへのアクセスをこれらのユーザーに付与します。
AWS Control Tower にセットアップを任せるのではなく、AWS IAM Identity Center を[自己管理](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html)するオプションもあることにご注意ください。


### データは暗号化されていますか？また、独自の AWS Key Management Service キーを使用できますか？

AWS Control Tower は、ランディングゾーンに対して 2 つの主要な暗号化オプションを提供します。1. デフォルトの暗号化: デフォルトでは、AWS Control Tower はランディングゾーン内のリソースに対して Amazon S3 マネージドキー (SSE-S3) を使用して保存データを暗号化します。2. AWS KMS 暗号化: オプションのセキュリティ強化レベルとして、AWS Control Tower が展開するサービス (AWS CloudTrail、AWS Config、および関連する Amazon S3 データを含む) を保護するために AWS Key Management Service (AWS KMS) キーを使用するよう AWS Control Tower を設定できます。AWS Control Tower のセットアップ時に AWS Backup を有効にすることを選択した場合は、既存のマルチリージョン KMS キーのいずれかを選択するか、新しい AWS KMS キーを作成する必要があります。このキーは、クロスアカウントバックアップを暗号化して保護するために使用されます。


### AWS Control Tower を使用して、AWS で利用可能な特定のリージョンへのアクセスを制限できますか？


AWS Control Tower は、登録済みアカウントの特定のリージョンにおける AWS サービスへのアクセスを制限するための[リージョン拒否](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html)機能を提供しています。これにより、特定のリージョンへのアクセスを制限することでコンプライアンス要件への対応とコスト管理が可能になります。この機能は、AWS Control Tower の既存のリージョン選択オプションと連携して動作します。たとえば、ドイツのお客様はフランクフルト以外のサービスへのアクセスを制限できます。利用可能なコントロールレベルは 2 つあります。ランディングゾーンレベル（元のコントロール）と、より細かいガバナンスのための [OU レベル](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)（新しいパラメータ化されたコントロール）です。このカスタマイズにより、ビジネスニーズに合わせたリージョン制限を適用できます。



### 既存の AWS Config リソースを持つ AWS アカウントを登録するにはどうすればよいですか 


AWS Config リソースを持つ既存のアカウントを AWS Control Tower に移行するには、特定の[5 ステップのプロセス](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)に従う必要があります。

1. AWS カスタマーサポートに連絡して、アカウントを AWS Control Tower の許可リストに追加してもらいます。チケットの件名に「Enroll accounts that have existing AWS Config resources into AWS Control Tower」と記載してください。本文には、管理アカウント番号、既存の AWS Config リソースを持つメンバーアカウント番号、および AWS Control Tower セットアップ用に選択したホームリージョンを記載してください。このプロセスには通常 2 営業日かかります。
2. AWS CloudFormation を使用して、メンバーアカウントに新しい IAM ロールを作成します。
3. 既存の AWS Config リソースがある AWS リージョンを特定します。
4. AWS Config リソースがない AWS リージョンを特定します。
5. 各リージョンの既存の AWS Config リソースを AWS Control Tower の設定に合わせて変更し、アカウントを AWS Control Tower に登録します。




### ドリフトとは何か、および Control Tower のドリフトと設定の処理方法

AWS Control Tower におけるドリフトは、AWS Control Tower の外部で設定変更が行われた場合に発生し、リソースがガバナンス要件に準拠しなくなります。一般的なドリフトの種類には以下が含まれます。
 1. コントロールポリシーのドリフト - AWS Control Tower が所有するポリシーが予期せず更新された場合。たとえば、コントロールの SCP が AWS Organizations コンソールで、または AWS CLI を使用してプログラム的に更新された場合。
2. Security Hub コントロールのドリフト。このタイプのドリフトは、AWS Security Hub サービスマネージドスタンダード: AWS Control Tower の一部であるコントロールがドリフト状態を報告した場合に発生します。
3. 必要な組織単位（Security OU など）の削除
4. 必要な IAM ロール（AWSControlTowerAdmin、AWSControlTowerCloudTrailRole、AWSControlTowerStackSetRole）の削除またはアクセス不能
5. メンバーアカウントを登録済みの AWS Control Tower OU から他の OU へ移動すること。

AWS Control Tower は、検出されたドリフトの種類に応じてさまざまな[修復オプション](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html)を提供しています。修復アクションの完全なリストについては、Control Tower ユーザーガイドを参照してください。


### AWS Control Tower のアカウントカスタマイズオプションとは何ですか？


AWS Control Tower では、アカウントをカスタマイズするためのいくつかのオプションが提供されています。

1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC) - AWS Control Tower コンソールから直接、新規および既存の AWS アカウントをカスタマイズできます。アカウントの要件を定義し、ブループリント（カスタマイズされたアカウントテンプレート）を使用してワークフローの一部として実装できます。これらのブループリントは、アカウントがプロビジョニングされる際に必要な特定のリソースと設定を記述します。
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT) - CfCT は、AWS Control Tower コンソールで利用可能な範囲を超えて AWS Control Tower ランディングゾーンをカスタマイズするための機能パッケージです。AWS CloudFormation テンプレート、サービスコントロールポリシー (SCP)、およびリソースコントロールポリシー (RCP) を使用してカスタマイズを実装でき、組織内の個々のアカウントや組織単位 (OU) にデプロイできます。CfCT は AWS Control Tower ライフサイクルイベントと統合されており、リソースのデプロイがランディングゾーンと同期された状態を維持します。
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT) は、Terraform を使用して AWS アカウントのプロビジョニングとカスタマイズを可能にするソリューションです。AFT 機能をデプロイするために、専用の AFT 管理アカウント（AWS Control Tower 管理アカウントとは別）を作成します。AFT は、任意の Terraform ディストリビューション（Community Edition、Cloud、Enterprise）をサポートすることで柔軟性を提供します。


### CfCT の設定ソースとして GitHub を使用できますか？


はい、GitHub は AWS Control Tower のカスタマイズ (CfCT) の設定ソースとして使用できます。CfCT をデプロイする際、デフォルトの Amazon S3 オプションの代わりに、AWS CodePipeline のソースとして GitHub (Code Connection 経由) を選択するオプションがあります。


### AFT リポジトリとして GitHub を使用できますか？


はい、AWS Control Tower Account Factory for Terraform (AFT) を AWS CodeCommit から別の VCS プロバイダーに移行することができます。CodeCommit から別の VCS プロバイダーに移行するには、以下の手順に従ってください。1. 選択した VCS プロバイダーに新しいリポジトリをセットアップする 2. これらのリポジトリを git の新しいリモートとして追加する 3. 新しい VCS プロバイダーに git push を実行する 4. AWS Control Tower 管理アカウントで、新しい VCS プロバイダーを指すように Terraform モジュール (bootstrap) を更新する 5. terraform plan を実行して変更をプレビューし、その後 terraform apply を実行する 6. AFT 管理アカウントにサインインし、新しい VCS プロバイダーの保留中の AWS CodeConnections を完了する なお、AFT が目的のコードを適切に実行できるように、リポジトリ構造は AWS CodeCommit と同じ状態を維持する必要があります。

### OpenTofu を AFT で使用できますか？ 

OpenTofu は、Terraform からフォークされた人気のオープンソースのインフラストラクチャ as コード (IaC) ツールです。OpenTofu には、sourcefuse/arc-control-tower-aft というモジュールがあり、いくつかの調整を加えることで AFT の機能をサポートできる可能性がありますが、AWS ではサポートされていません。

### CfCT の VCS として Gitlab を使用できますか？ 

いいえ、CfCT の GitLab サポートはまだ利用できません。v2.8.1 以降から VCS として GitHub を使用できます。

### Landing Zone Accelerator (LZA) がすでにデプロイされている場合でも、AWS Control Tower を使用できますか？


AWS Control Tower と Landing Zone Accelerator (LZA) は、補完的なソリューションとして組み合わせて使用することができます。推奨されるベストプラクティスは、まず AWS Control Tower を基盤となるランディングゾーンとしてデプロイし、その後必要に応じて LZA を使用してその機能を強化することです。LZA は AWS Cloud Development Kit (CDK) を使用して構築されたソリューションであり、AWS のベストプラクティスおよび複数のグローバルコンプライアンスフレームワークに準拠するよう設計された基盤的な機能をデプロイします。これにより、マルチアカウント環境をより効果的に管理・統制することができます。LZA ソリューションは、セキュアなワークロードをホストするのに適したクラウド環境を自動的にセットアップします。運用とガバナンスの一貫性を維持するために、すべての AWS リージョンにデプロイすることができます。AWS Control Tower と LZA を統合することで、ランディングゾーンをカスタマイズしながら、ベストプラクティスおよびコンプライアンス要件との整合性を維持することができます。



### AWS Control Tower のセットアップを操作するために API を使用できますか？ 


AWS Control Tower は、さまざまなタスクを自動化できる[複数の API](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) を提供しています。1. Control API: - EnableControl: コントロールを有効化し、指定した組織単位とそのアカウントに AWS リソースを作成します - DisableControl: コントロールを無効化し、指定した組織単位とそのアカウントの AWS リソースを削除します - GetControlOperation: コントロール操作に関する情報を取得します これらの API を使用すると、コントロール（ガードレールとも呼ばれます）をプログラムで管理し、適用状況を確認し、サポートされているリージョン、識別子（ARN）、ドリフトステータス、ステータスサマリーなど、有効化されたコントロールに関する情報を取得できます。2. Landing Zone API: ランディングゾーンに関連するタスクの自動化を支援します 3. Baseline API: 組織単位（OU）の登録などの特定のタスクの自動化を支援します。API リファレンスドキュメントを参照してください。


### Control Tower によって作成されたアカウントのメールアドレスを変更するにはどうすればよいですか？


AWS Control Tower に登録されたメンバーアカウントのメールアドレスを変更するには、以下の手順に従う必要があります。1. アカウントのルートユーザーパスワードを回復します。2. ルートユーザーパスワードでアカウントにサインインします。3. 他の AWS アカウントと同様にメールアドレスを変更し、変更が AWS Organizations に反映されるまで待ちます。メールアドレスの変更が完了するまで、遅延が生じる場合があります。4. 以前そのアカウントに属していたメールアドレスを使用して、Service Catalog のプロビジョニング済み製品を更新します。このプロセスにより、新しいメールアドレスがプロビジョニング済み製品に関連付けられ、メールアドレスの変更が AWS Control Tower に反映されます。ただし、この手順では管理アカウント、ログアーカイブアカウント、または監査アカウントのメールアドレスは変更できない点に注意することが重要です。 



### ネットワーク間接続の考慮事項


AWS Control Tower はデフォルトで、組織単位 (OU) 内で作成されたすべてのアカウントのすべての VPC に同じ CIDR 範囲 (172.31.0.0/16) を割り当てます。このデフォルト設定では、IP アドレスが重複しているため、AWS Control Tower の VPC 間のピアリングは初期状態では許可されません。AWS Control Tower で VPC ピアリングをサポートするには、Account Factory の設定で CIDR 範囲を変更して、VPC 間で IP アドレスが重複しないようにする必要があります。Account Factory の設定で CIDR 範囲を変更すると、その後に作成されるすべての新しいアカウントには新しい CIDR 範囲が割り当てられますが、既存のアカウントは元の CIDR 範囲を保持します。このアプローチにより、異なる IP アドレス範囲を持つ VPC 間のピアリングが可能になります。  


### 既存のセキュリティアカウントとロギングアカウントがありますが、既存のアカウントを AWS Control Tower の監査アカウントおよびロギングアカウントとして使用できますか？


はい、AWS Control Tower では、初期ランディングゾーンのセットアップ時に、既存の AWS アカウントを監査（セキュリティ）アカウントおよびログアーカイブ（ロギング）アカウントとして指定するオプションが提供されています。この機能により、AWS Control Tower が新しい共有アカウントを作成する必要がなくなります。ランディングゾーンのセットアップ時に、次のいずれかを選択できます。1. AWS Control Tower に新しい共有アカウントを作成させる、または 2. 監査およびロギング目的で既存のアカウントを持ち込む。既存のアカウントを使用する場合は、セットアップ時にこれらのアカウントに関連付けられた固有のメールアドレスを入力する必要があります。このオプションは、初期ランディングゾーンのセットアップ時にのみ使用できます。既存のアカウントを使用することで、AWS Control Tower ガバナンスを既存の組織に拡張したり、別のランディングゾーンから AWS Control Tower に移行したりすることが容易になります。 


### 既存の外部 IDP がある場合、Control Tower を有効にすると AWS Control Tower は既存の設定にどのような変更を加えますか？


既存のアイデンティティプロバイダーで AWS Control Tower を設定する場合、選択するアイデンティティソースによって影響が異なります。IAM Identity Center がすでに組織で有効になっており、IAM Identity Center ディレクトリを使用している場合、AWS Control Tower は既存の設定を削除せずに、アクセス許可セットやグループなどのリソースを追加します。別のディレクトリ（外部、AD、Managed AD）を使用している場合、AWS Control Tower は既存の設定を変更しません。  


### AWS Control Tower はネスト OU をサポートしていますか


はい、AWS Control Tower はネストされた組織単位 (OU) をサポートしています。AWS Control Tower のネストされた OU を使用すると、アカウントを複数の階層レベルに整理し、階層的にコントロールを適用できます。ネストされた OU とは、別の OU の中に含まれる OU のことであり、ある OU にアタッチされたポリシーが下位のすべての OU およびアカウントに継承される階層構造を形成します。AWS Control Tower のネストされた OU 階層は、最大 5 レベルの深さまで対応しています。既存のマルチレベル OU を登録したり、新しいネストされた OU を作成したり、階層内の深さに関係なく登録済みの任意の OU でコントロールを有効化したりすることができます。ネストされた OU を使用することで、AWS Control Tower の OU を AWS マルチアカウント戦略に合わせて整理し、親 OU レベルでコントロールを適用することで複数の OU に対してコントロールを有効化するために必要な時間を短縮できます。


### AWS Control Tower は AWS GovCloud でサポートされていますか？


はい、AWS Control Tower は [GovCloud でサポートされています](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html)。ただし、AWS GovCloud (US) における AWS Control Tower は、より厳格なコンプライアンスおよび運用要件のため、商用リージョンとは異なります。GovCloud では、直接アカウントを作成することができないため、ランディングゾーンのセットアップ時に既存の Audit アカウントおよび Log Archive アカウントを使用する必要があります。GovCloud アカウントは、商用リージョンの CreateGovCloudAccount API を通じて作成され、請求およびサポートのためにリンクされますが、GovCloud 組織にのみ参加できます。Account Factory によるアカウント作成、GDPR コンプライアンス、特定の Security Hub コントロール、Resource Control Policies (RCP) などの一部の機能はサポートされていません。



### AWS Control Tower はリソースコントロールポリシー (RCP) を使用しますか？

AWS Control Tower は、リソースコントロールポリシー（RCP）で実装された予防的コントロールをサポートするようになりました。これらの RCP ベースのコントロールは、AWS Control Tower 環境全体にデータ境界を確立し、意図しないアクセスからリソースを保護するのに役立ちます。RCP を使用すると、個々のバケットポリシーで付与された権限に関係なく、組織の Amazon S3 リソースが組織に属する IAM プリンシパルまたは AWS サービスからのみアクセス可能であることを保証するなどの要件を適用できます。RCP ベースの予防的コントロールは、AWS Control Tower が利用可能なすべての AWS リージョンで利用できます。また、特定のプリンシパルやリソースをこれらのコントロールの対象外にしたい場合は、免除を設定することもできます。さらに、AWS Control Tower は RCP で実装されたコントロールのコントロールポリシードリフトをレポートするようになり、コントロールドリフトをプログラムで管理するための ResetEnabledControl API を提供します。これにより、コントロールドリフトを修復し、コントロールを意図した設定にリセットできます。AWS Control Tower は、Customizations for AWS Control Tower（CFCT）の RCP もサポートしており、これらのポリシーをカスタマイズワークフローに組み込むことができます。


### 実装前に OU のポリシーをテストする方法

Policy Staging OU は、AWS のポリシー、コントロール、およびサービスを本番環境にデプロイする前に、テストおよび検証するための管理された環境として機能します。これにより、組織は運用アカウントに影響を与えることなく、新しいポリシー、ガードレール、および設定が意図したとおりに機能することを確認できます。このアプローチは、意図しない結果を防ぎ、ポリシーの有効性を確保するのに役立ちます。Staging OU には通常、本番環境の構造を反映したテストアカウントが含まれており、本番 OU またはアカウントにポリシーの変更を適用する前に、徹底的な検証を行うことができます。このプラクティスは、ガバナンスに関する AWS のベストプラクティスに沿ったものであり、新しいコントロールを実装しながら運用の安定性を維持するのに役立ちます。
