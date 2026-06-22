---
sidebar_position: 3
---
# ランディングゾーンのカスタマイズ


Control Tower は、適切に管理されたランディングゾーンの出発点を定義しますが、ほとんどのお客様はワークロードに対して追加のプラットフォームサービスを実装する必要があります。これには、集中型ネットワーキング、セキュリティサービス、集中型オブザーバビリティサービスなどが含まれます。 

## インフラストラクチャをコードとして使用する

追加のプラットフォームサービスは、Infrastructure as Code (IaC) を使用して定義およびデプロイする必要があります。これにより、以下が実現されます。

* すべてのアカウントとリージョンにわたって同一の設定を確保する
* バージョン管理と変更管理を有効にし、ピアレビューとロールバックをサポートするとともに、すべての変更が記録され監査可能であることを保証する
* Control Tower ライフサイクルイベントに応じてデプロイをトリガーできる、迅速かつ自動化されたアカウントプロビジョニングをサポートする 

## 適切なカスタマイズオプションを選択する 

最初に適切なカスタマイズアプローチを選択することは、今後の運用モデルと柔軟性に大きな影響を与えるため、非常に重要です。選択は、組織のインフラストラクチャーアズコードの好み、運用要件、および希望するカスタマイズの柔軟性レベルなどの要因によって異なります。ランディングゾーンには、1 つのカスタマイズオプションのみを実装することをお勧めします。

コードで Control Tower をカスタマイズするための主なオプションは 4 つあります。

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT)
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

CloudFormation でインフラリソースを定義し、ネイティブの [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) 機能を使用して特定のアカウントにデプロイすることができます。StackSet を使用すると、単一のテンプレートを使ってリージョンをまたいでスタックを作成できます。CloudFormation は、ターゲットの組織または組織単位 (OU) に新しいアカウントが追加された際に、[新しい AWS Organizations アカウントへ追加のスタックを自動的にデプロイ](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html)することができます。ただし、[いくつかの注意事項](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations)があります。

StackSets は、依存関係が最小限のシンプルなテンプレートのデプロイに役立ちます（Control Tower 自体もベースライン IAM ロールなどのデプロイに使用しています）が、CI/CD の欠如や Control Tower のアカウントプロビジョニングプロセスとの統合・連携の欠如は、より複雑なカスタマイズにとって課題となります。

CloudFormation でシンプルなカスタマイズをデプロイするためのマネージドサービスをお探しの場合は、AFC をご検討ください。CI/CD をサポートする CloudFormation ベースのソリューションをお探しの場合は、CfCT をご検討ください。


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) は Control Tower のネイティブ機能であり、AWS Control Tower のアカウントプロビジョニングワークフローと直接統合されます。これにより、アカウントのプロビジョニング時にリソースと設定でアカウントをベースライン化するために使用されるブループリント（アカウントプロビジョニングに使用しているものに応じて、CloudFormation または Terraform で）を定義できます。

Blueprints は Service Catalog で更新およびバージョン管理できます。Control Tower のアカウント更新プロセスを使用して、更新されたベースラインを適用できます。AFC で複数の Blueprints を定義することはできますが、現時点では 1 つのアカウントに複数の Blueprint を適用してベースライン化することはできません。そのため、より複雑なカスタマイズに AFC を使用することが難しくなっています。

カスタマイズにシンプルな方法が必要で、アカウントごとに単一のベースラインで十分であり、カスタマイズプロセスのためにリソースを管理したくない場合は、AFC を使用してください。


### AWS Control Tower のカスタマイズ (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) は、Control Tower のホームリージョンにある Control Tower 管理アカウントに AWS Code Pipeline パイプラインを実装する AWS ソリューションです。これは S3 または Github の CloudFormation テンプレートのリポジトリによってサポートされています。組織内のターゲットアカウントおよび OU への CloudFormation テンプレート、SCP、RCP のデプロイをサポートしています。CfCT はアカウント作成の自動化をサポートしていません。代わりに、Control Tower のライフサイクルイベントと統合されており、Control Tower の Account Factory を通じて作成された新しいアカウントに対してカスタマイズを自動的にトリガーできます。

社内に CloudFormation のスキルがあり、管理アカウントでソリューションを維持および[更新](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html)する意欲がある場合は、CfCT を使用してください。



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) は Terraform を使用し、直接 AWS API を呼び出すことで、アカウントの作成とカスタマイズのプロセス全体を管理します。カスタマイズに対して非常に柔軟なソリューションですが、その分、管理オーバーヘッドが増加します。CfCT とは異なり、AFT はアカウントの作成からアカウントのカスタマイズまでのプロセス全体を自動化できます。また、アカウントカスタマイズの Terraform ステートファイルを管理するように設計されています。

また、Control Tower のプロアクティブコントロール（CloudFormation Guard ルールとして実装）は、CloudFormation を使用してリソースがデプロイされていないため、適用されないことに注意してください。

社内に Terraform のスキルがあり、Terraform の状態とプロセスのセットアップおよびメンテナンス、複数のリポジトリの管理、アカウントの作成とカスタマイズを行う可能性のある異なるチーム間の調整に経験がある場合は、AFT を使用してください。 


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) は、AWS のベストプラクティスとセキュリティフレームワークに基づいた、安全なマルチアカウント環境を実装するための AWS ソリューションです。LZA は AWS Control Tower を必須としていませんが、Control Tower を基盤となるランディングゾーンとして使用し、その上に LZA を実装することが[推奨されています](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html)。LZA は、セキュリティツールや共有ネットワークサービスなど、一般的なランディングゾーン機能のオピニオネイテッドなデプロイを提供しており、設定ファイルを通じて限定的なカスタマイズが可能です。これにより、厳格なセキュリティおよびコンプライアンス要件を持つ AWS のお客様は、クラウドの基盤を迅速に設定できます。

高度に規制された分野にいる場合、安全でコンプライアンスに準拠したランディングゾーンを迅速にデプロイする必要がある場合、インフラストラクチャデプロイメントに対してより意見の強いアプローチに慣れている場合、ソリューションを維持する意欲がある場合、および問題が発生した場合に基盤となる CDK コードを理解して管理する準備ができている場合は、LZA を使用してください。  


| 機能 | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| サービスによる管理 | Yes | No | No | No |
| IaC エンジン | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| SCP のデプロイ | No | Yes | Yes | Yes |
| 複数の設定パッケージのサポート | No | Yes | Yes | Yes |
| 学習曲線 | Low | Medium | High | Low |
| 運用オーバーヘッド | Low | Medium | High | Medium |
| API サポート | No | Yes | Yes | Yes |
| バージョン管理の統合 | No | Yes | Yes | Yes |
| 委任管理 | No | No | Yes | Yes |
| アカウントのプロビジョニング | Direct | ライフサイクルイベント経由のみ | Direct | Direct |
| コンソール管理 | Yes | 限定的 | 限定的 | 限定的 |
| デプロイの複雑さ | Low | Medium | High | Medium |
| カスタマイズの柔軟性 | 限定的 | High | Highest | High |
| プロアクティブコントロールの適用 | Yes | Yes | No | Yes |

