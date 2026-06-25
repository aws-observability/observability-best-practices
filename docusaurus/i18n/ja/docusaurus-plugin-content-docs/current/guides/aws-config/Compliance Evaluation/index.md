---
sidebar_position: 3
---
# コンプライアンス評価

AWS Config は、AWS 環境内のリソース設定を評価するための 2 つの主要なルールタイプを提供しています。1 つ目のタイプである[マネージドルール](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html)は、AWS が提供する事前構築済みのルールであり、さまざまなセキュリティ、運用、およびコンプライアンスのユースケースに対応しています。マネージドルールは、AWS リソースをベストプラクティスおよび一般的なコンプライアンス標準に照らして評価する、事前設定済みのルールテンプレートです。2 つ目のタイプである[カスタムルール](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)は、組織が独自のルールを作成できるようにするもので、組織固有のコンプライアンス要件やチェックを実装することが可能です。

カスタムルールは AWS Lambda 関数を通じて作成でき、AWS リソースが準拠しているかどうかを評価するロジックをコーディングします。AWS Config では、[Guard カスタムポリシーを使用したカスタムルールの作成](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/)も可能です。[Guard カスタムポリシー](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)は、Lambda 関数を作成する必要がないため、カスタムルールの作成プロセスを簡素化します。Guard カスタムポリシーを使用すると、[Guard ドメイン固有言語 (DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html) を使用して定義されたポリシーに対してリソースを評価するポリシーをコードとして定義できます。

AWS Config は、修復アクションのために[Systems Manager Automation ドキュメント](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/)とネイティブに統合されています。AWS Systems Manager Automation ドキュメントを使用して独自のカスタム修復アクションを作成でき、AWS Config を通じて手動または自動修復を選択するオプションがあります。

さらに、AWS は[サービスリンクルール](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html)も提供しています。これらは、特定のサービスに関連するリソース設定を評価するために、他の AWS サービスによって自動的に作成および管理されます。たとえば、AWS Security Hub は AWS Config にサービスリンクルールを作成して、セキュリティのベストプラクティスや標準を評価することができます。また、[組織ルール](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html)をデプロイすることもできます。これにより、AWS Organizations 構造内の複数のアカウントにわたってルールをデプロイおよび管理でき、AWS 環境全体で一貫したコンプライアンスを維持しやすくなります。 

### コンフォーマンスパック

マネージドルールやカスタムルールを特定のリージョンやアカウントに個別にデプロイする代わりに、それらを[コンフォーマンスパック](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)にまとめることがベストプラクティスです。AWS コンフォーマンスパックは、複数のアカウントとリージョンにわたって数百のルールをデプロイおよびモニタリングするための単一の制御ポイントを提供し、大規模で一貫したセキュリティおよびコンプライアンス標準を確保します。[一般的なフレームワーク向けの事前構築済みテンプレート](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html)（HIPAA、NIST、PCI-DSS など）を提供し、カスタムルールの作成も可能で、コンプライアンス管理に必要な時間と労力を大幅に削減します。これらのパックは Config ルールの不変グループを表しており、変更はコンフォーマンスパック自体への正式な更新を通じてのみ行えることが保証されています。このアプローチにより、コンプライアンスルールに対するガバナンスと制御が向上します。


#### 組織的なデプロイ 

AWS では、組織の適合パックを活用して、AWS Organization 全体に自動デプロイすることができます。この機能は、適合パックと個別の Config ルールの両方に適用されます。AWS Config は委任管理者機能もサポートしており、組織全体の適合パックのデプロイを管理する特定のアカウントを指定することができます。不変性などのメリットを維持しながら[委任管理者を使用して適合パックをデプロイする](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/)方法については、このドキュメントに従ってください。 


### AWS Config Rules Development Kit (RDK) 

AWS Config [ルール開発キット](https://github.com/awslabs/aws-config-rdk)（RDK）は、AWS サンプル GitHub リポジトリで利用可能であり、カスタム Config ルールの作成を効率化します。リソース評価を実装するために最小限の変更で済む定型コードテンプレートを提供します。RDK は、前述の集中型 Lambda 関数アプローチを含む、さまざまなデプロイシナリオをサポートしています。

AWS Config RDK を使用して[カスタム AWS Config ルールを大規模に構築および運用する](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/)方法については、このブログを参照してください。

#### Lambda 関数の一元管理

複数のカスタムルールが必要なマルチアカウント環境では、Lambda 関数を単一のアカウント（セキュリティアカウントやコンプライアンスアカウントなど）に集約することをお勧めします。他のアカウントのカスタムルールは、これらの集約された関数を呼び出すことができます。 

### グローバルリソース管理

グローバルリソースを評価するルール（IAM ルールなど）については、重複コストや冗長な API 呼び出しを避けるために、1 つのリージョンにのみデプロイしてください。このプラクティスにより、効果的なコンプライアンスモニタリングを維持しながら、コスト効率とリソース利用率の両方を最適化できます。


### 評価管理

ルール評価を管理する際は、評価結果の削除や再評価のトリガーに関するオプションに注意してください。これらの機能を頻繁に使用すると、リソースの新しい[設定アイテム](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html)が生成され、ストレージおよび処理要件に影響を与える可能性があります。



## クロスアカウントの集約とクエリ

組織が複数のリージョンおよびアカウントにわたって AWS Config を有効にするにつれて、包括的な可視性と管理のためにデータを一元化することが重要になります。[AWS Config Aggregators](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html) は、さまざまなリージョンおよびアカウントから設定関連データを単一の指定されたアグリゲーターアカウントに統合する無料機能を提供します。この一元化により、AWS 環境の統合ビューが提供され、Config ルールの評価、適合パックの評価、および組織全体のコンプライアンスステータスの監視が容易になります。組織全体のアグリゲーターをデプロイするには、[こちらのブログをご参照ください](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/)。

中央アカウントに集約されたこのデータにより、[高度なクエリ](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html)機能が利用可能になります。この機能を使用すると、AWS 環境全体にわたる複雑なクエリを実行でき、リソース設定やコンプライアンス状態に関するインサイトを得ることができます。たとえば、シンプルな SQL ライクな構文を使用して、アカウント全体の未アタッチの EBS ボリュームを簡単に特定できます。これらの高度なクエリは、運用およびコンプライアンス関連のデータを提供し、AWS インフラストラクチャを効果的に管理・最適化する能力を高めます。

S3 の[AWS Config 設定スナップショットデータ](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html)は、[Amazon Athena](https://aws.amazon.com/athena/) を使用してクエリでき、お客様は[Amazon QuickSight](https://aws.amazon.com/quicksight) を使用してカスタムビジュアライゼーションを作成できます。AWS Config データを集約し、高度なクエリを実行し、カスタマイズされたインベントリダッシュボードを作成する方法については、[AWS Config ワークショップによるモニタリングをご参照ください](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config)。また、[AWS Config リソースコンプライアンスダッシュボード](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard)に関するワークショップもご参照ください。このワークショップでは、[AWS Organizations に AWS Config ダッシュボードをデプロイする](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard)方法を説明しています。 