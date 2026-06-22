---
sidebar_position: 2
---
# ランディングゾーンの運用

## テストランディングゾーンの作成を検討する

コントロールは本番アカウントに適用する前に、非本番 OU でテストすることができます（そしてすべきです）。ただし、2 つ目のテスト用 Organization が役立つ場合もあります。ランディングゾーンの更新をテストしたり、ランディングゾーン管理の自動化やアカウントカスタマイズプロセスを変更したりする必要がある場合は、本番ワークロードへの意図しない影響を避けるために、完全に独立した Organization を用意することが有効です。

## Landing Zone を最新の状態に保つ

ランディングゾーンの更新には、セキュリティの改善、コスト最適化、機能強化が含まれる場合があります。新しいランディングゾーンのバージョンが利用可能になった場合は、できるだけ早く[更新](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html)することをお勧めします。これは AWS Console から実行できます。このプロセスにより、共有アカウント（ログアーカイブ、監査、バックアップ）を含むランディングゾーンのコンポーネントが更新されます。

2.x から 3.x にアップデートする場合、アカウントレベルから Organization レベルの CloudTrail トレイルへの変更に関する[追加の注意事項](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html)があることに注意してください。 

## Control Tower を使用してアカウントを作成する 

Control Tower の Account Factory を使用して新しいアカウントを作成することで、作成時にアカウントを登録および管理できます。Control Tower が有効な状態で AWS Organizations を通じてアカウントを作成することも可能ですが、Control Tower が管理する OU 配下にある場合でも、それらのアカウントは Control Tower に登録されません。Control Tower を通じて作成されていない組織内のアカウントがある場合は、それらを登録して Control Tower のコントロールとベースラインを適用することができます。

### Control Tower で管理された Identity Center でフェデレーテッドアイデンティティを使用する場合、アカウント作成時に共通の SSO ユーザーを使用する

Identity Center が Control Tower によって管理されている場合、Account Factory はパラメーターとして Identity Center ユーザーを必要とします。このユーザーには作成されたアカウントへの管理者アクセス権が付与されますが、ID フェデレーションが有効になっている間は使用できません。このユーザーはフェデレーション ID を使用する場合には利用できませんが、それでも必須パラメーターです。ユーザーは一意である必要はないため、未使用のローカル Identity Center ユーザーが多数作成されるのを避けるために、複数のアカウントに同じユーザーを使用できます。その後 ID フェデレーションが無効化された場合、パスワードを有効にしてアカウントにアクセスするには、そのユーザーに関連付けられたメールアドレスへのアクセスが必要になります。

## アカウントを最新の状態に保つ

ランディングゾーンの更新が完了したら、アカウントを更新する必要があります。これは、個々のアカウントのコンソールで行うか、OU 全体を再登録することで実行できます（1000 未満のアカウントがある場合に限ります）。また、[プロセスを自動化する](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html)こともできます。

非本番ワークロードを本番ワークロードとは別の OU に保持することがベストプラクティスです。これにより、非本番 OU を最初に再登録することで、更新の影響をテストできます。


## ドリフトの管理

ドリフトは、AWS Control Tower ランディングゾーンのコンポーネント、アカウント、または組織単位 (OU) が定義済みのベースラインおよびコントロールと同期しなくなった場合に発生します。ドリフトを理解して管理することは、AWS 環境におけるガバナンスとコンプライアンスを維持するために不可欠です。 

### ドリフトを防ぐために Control Tower を通じてアカウントと OU に変更を加える

アカウント、OU、または Control Tower が管理する組織ポリシー（SCP、RCP）を Control Tower の外部で変更した場合（通常、AWS Organizations コンソールで直接変更を行った場合に発生します）、ドリフトが発生する可能性があります。 

### ランディングゾーンのドリフトを定期的に確認する

Control Tower はドリフトを自動的に検出します。ランディングゾーンのドリフトを定期的に確認し、必要に応じて修復してください。コンソールで Organization ページに移動し、検査したい OU またはアカウントを選択することで、OU およびアカウントのドリフトステータスを確認できます。ドリフトは、監査アカウントに集約される [SNS 通知](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html) にも表示されます。すべてのドリフト通知を確実に受信するために、aws-controltower-AggregateSecurityNotifications トピックをサブスクライブできます。このトピックは config の非準拠通知やその他の通知も受信するため、通知量が多くなる場合があります。そのため、関心のある通知を処理する Lambda をサブスクライブすることを検討してもよいでしょう。 


### コンプライアンスを確保するためにドリフトを解決する

ランディングゾーンがドリフトしている場合、有効にしたコントロールに対してリソースが準拠しているかどうかを正確に判断することができません。ガバナンス要件が満たされていることを確認するために、ドリフトを検出したら修復してください。[修復可能なドリフト](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources)のいくつかの例については、ドキュメントを参照してください。

* アカウントまたは OU がドリフトしている場合は、コンソールでアカウントを更新するか、OU を再登録することで解決できる場合があります。
* コントロールについては、多くの種類のドリフトは ResetEnabledControl API を呼び出すことで解決できます。
* 多くの種類のドリフトは、Landing Zone のリセットによって自動的に解決できます。これは、Landing zone の設定で「バージョン」セクションの「リセット」ボタンをクリックすることで実行できます。


## 必須の Control Tower OU またはアカウントを削除しないでください

ランディングゾーンの拡張に関する前のセクションで述べたように、Security OU や Control Tower が管理するアカウントを削除または移動したり、Security OU のみが残るように他のすべての OU を削除したりすると、ランディングゾーンのドリフトが発生します。この状態では、ランディングゾーンをリセットするまで Control Tower は機能しません。

## 必須ロールを削除しないでください

[Control Tower が必要とするロール](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)が欠落しているかアクセスできない場合、ランディングゾーンをリセットするよう指示するエラーページが表示されます。 

## ガバナンス要件を適用するコントロールを有効にする

[コントロールを適用するためのベストプラクティス](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/)に従ってください。

AWS Controls Catalog で要件に合った Control Tower コントロールを特定します。コントロールは、実装、動作、所有者、サービス、フレームワークなどのメタデータに基づいて、以下の方法で検索できます。

* Control Tower コンソール
* [Control Tower カタログのドキュメント](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)

必要に応じて、基盤となるサービスを使用してカスタムコントロールを定義できますが、これらは Control Tower ダッシュボードやコンプライアンスメトリクスには含まれません。

* AWS Organization の予防的コントロールのための [SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) と [RCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)
* 検出的コントロールのための AWS [Config ルール](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)
* プロアクティブコントロールのための AWS [CloudFormation フック](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html)
* AWS [Security Hub CSPM コントロール](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html)

カスタムポリシー（SCP または RCP）をデプロイする場合は、[Control Tower サービスロール](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html)が拒否されていないことを確認してください。拒否されると、エラーが発生したり、Control Tower が動作不能になる可能性があります。

本番アカウントにデプロイする前に、必ずコントロールをテストしてください。

* 最初に非本番 OU や テスト Organization にデプロイする
* 新しい予防的コントロールを展開する前に、非準拠を特定して解決するための同等の検出コントロールのデプロイを検討する

## コントロールの継承を理解する 

コントロールは AWS Control Tower の基本的な要素であり、ランディングゾーンの運用を成功させるためには、コントロールの仕組みを理解することが必要です。

* 必須コントロールは無効化できず、Control Tower リソースを特別に保護します。ユーザーワークロードには適用されません。
* Control Tower に登録されたアカウントは、親 OU からコントロールを継承します。
    * 予防的な AWS Organizations ポリシーベースのコントロールはネストされた OU に継承されますが、その他は継承されません。
    * 予防的な AWS Organizations ポリシーベースのコントロールは、Control Tower に登録された OU 内の未登録アカウントに適用されますが、その他は適用されません。

## Service Linked Rules を使用するように Config コントロールを更新する

[2025 年 6 月](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/)以降、Control Tower はサービスにリンクされた AWS Config マネージド Config ルールをサポートしています。以前は、ルールは StackSets を通じてデプロイされていました。サービスにリンクされたルールは、サービスによってアカウントに直接デプロイされ、Control Tower を経由する場合を除いてユーザーが編集または削除することはできません。これにより、デプロイ速度が向上し、意図しないドリフトを防ぐことができます。 


## AWS Organizations を使用してアカウントを移動しないでください

AWS Organizations のコンソールまたは API を通じて、OU 間でアカウントを直接移動すると、Control Tower でドリフトが発生します。

OU 間でアカウントを移動する必要がある場合は、[Control Tower コンソールからアカウントを更新する](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console)か、[Service Catalog でアカウントのプロビジョニング済み製品を更新する](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product)ことで対応してください。Organizations でアカウントを移動した場合は、[アカウントを更新する](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved)ことでドリフトが解消されます。 


## コンプライアンス状態を確認する 

アカウントと OU のコンプライアンス状態を定期的に確認し、非準拠の状態を修正するための対策を講じてください。

Control Tower ダッシュボードには、適用された Control Tower コントロールのコンプライアンス状態が表示されます。現時点では、Control Tower 外で適用された設定ルール（Security Hub が所有するものを含む）のコンプライアンス状態は表示されません。

Cloud Intelligence Dashboards プロジェクトの[Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)を実装することで、組織全体の設定コンプライアンスの包括的なビューを取得することを検討してください。

コンプライアンスの変更に関する通知を受け取るには、[監査アカウントの SNS トピック](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html)をサブスクライブしてください。

## 有効なコントロールを定期的に確認する

アカウントおよび OU に適用されているコントロールを定期的に見直し、ビジネス要件を引き続き満たしていることを確認するとともに、新しいコントロールを活用してください。 


## 非準拠への対処

[Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) を定義し、有効化された Config ルールに関連付けることで、[非準拠の修復](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)に使用できるようにする必要があります。修復は[手動](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html)でトリガーするか、[自動的に実行](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html)されるように設定することができます。 



## ランディングゾーンのコストを監視および最適化する

### ランディングゾーンのコストを可視化できるようにします。

* 組織全体の AWS 支出を把握するために、管理アカウントで [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) を使用します
* [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) を設定し、通知をサブスクライブします。
* Cloud Intelligence Dashboards の実装を検討して、[コストと使用状況レポートのデータエクスポート](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html)、Athena 統合、および詳細な QuickSight コストダッシュボードを簡単に有効化します 

### コスト急増の一般的な原因を把握する

* Control Tower と CloudTrail 統合を有効にする際は、CloudTrail の料金が発生しないよう、既存の管理トレイルを事前に削除してください。
* Control Tower はリソースの状態を追跡するために AWS Config を使用します。これはコンプライアンスの維持に重要ですが、頻繁に変更される一時的なワークロードの追跡にはコストがかかる場合があります。現時点では、Control Tower にメンバーアカウントの Config レコーダーを変更する組み込みオプションはありませんが、Config コストが過大でコンプライアンス要件が厳しくないアカウントの Config レコーダーを無効にするには、[この回避策](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)を検討してください。



