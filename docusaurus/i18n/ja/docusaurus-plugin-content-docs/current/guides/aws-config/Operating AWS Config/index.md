---
sidebar_position: 1
---
# AWS Config の運用

### **すべてのアカウントのすべてのリージョンで AWS Config を有効にする**

複数の AWS アカウントを運用しているお客様には、組織全体に AWS Config を導入することをお勧めします。AWS Config はリージョン固有のサービスであるため、リソース設定の変更とコンプライアンス評価を追跡したい各リージョンで有効化する必要があります。有効化する方法は次の 3 つです。

1. CloudFormation StackSets を使用する方法:
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) は、複数のリージョンおよびアカウントにわたって AWS Config を同時に有効化するための事前構築済みテンプレートを提供し、組織全体に設定レコーダーをデプロイして、すべてのアカウントで一貫した設定を維持します。CloudFormation を使用して組織全体に AWS Config をデプロイするには、[こちらのブログ](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/)をご参照ください。
2. AWS Systems Manager Quick Setup を使用する方法:
    [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) は、組織全体で Config レコーダーを有効化するための効率的な方法を提供します。Systems Manager Quick Setup を使用して組織全体に AWS Config をデプロイするには、[こちらのブログ](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/)をご参照ください。
3. AWS Control Tower を使用する方法:
    [AWS Control Tower](https://aws.amazon.com/controltower/) は、中央の場所から複数の AWS アカウントをセットアップし、安全に管理するのに役立ちます。有効化すると、Control Tower はすべての登録済みアカウントにわたって AWS Config を自動的にアクティブ化します。AWS Control Tower を使い始めるには、[AWS Control Tower 入門パブリックドキュメント](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html)をご参照ください。



### AWS Config レコーダーの設定

AWS Config レコーダーの設定を行う際の重要なベストプラクティスは、[すべてのリソースタイプ](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)のトラッキングを有効にすることです。すべてのリソースを有効にすることの追加的なメリットは、Config トラッキングで利用可能になった新しい AWS サービスのリソースタイプが自動的に追加されることです。これにより、手動での介入なしに設定管理を最新の状態に保つことができます。

[IAM](https://aws.amazon.com/iam/) などの[グローバルリソース](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global)については、1 つのリージョンのみで記録を有効にすることが重要です（AWS Config はお客様のホームリージョンまたはメインリージョンで有効にする必要があります）。この設定には 2 つの目的があります。重複した設定アイテムを防ぐことと、不要なコストを回避することです。複数のリージョンでグローバルリソースの記録を有効にすると、冗長な設定トラッキングが発生し、同じグローバルリソースを複数回モニタリングするための追加費用が発生します。たとえば、IAM ユーザー、ロール、ポリシーをトラッキングする場合は、グローバルリソースの記録にプライマリリージョン（us-east-1 など）を指定し、他のすべてのリージョンではこの機能を無効にする必要があります。


### 配信方法のベストプラクティス

AWS 設定管理を実装する際、設定アイテムの適切な配信方法を確立することが重要です。推奨されるベストプラクティスは、ログアカウントまたは別の専用アカウントなど、中央アカウント内に集中管理された [Amazon S3 バケット](https://aws.amazon.com/pm/serv-s3/) を指定することです。この集中管理により、設定アイテムのログをより適切に整理・管理できます。バケット内の明確な整理を維持するために、各設定アイテムのソースアカウントとリージョンを明確に識別する構造化されたプレフィックスシステムを実装することをお勧めします。また、転送中および保存中の暗号化の有効化、パブリックアクセスの無効化、厳格なアクセス制御の維持など、[S3 バケットのセキュリティベストプラクティス](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.htm) も実装してください。これらのセキュリティ対策により、データ保護基準への準拠が確保され、セキュリティリスクが最小化されます。

AWS Config を設定して、設定の変更とコンプライアンスステータスの更新を指定した SNS トピックに自動的にストリーミングすることもできます。複数の AWS アカウントを持つエンタープライズ環境では、これらの通知を統合するための中央 SNS トピックを確立します。この一元化されたアプローチにより、IT チームおよびセキュリティチームは組織全体の設定変更を効率的に監視し、対応できるようになります。これを行うには、[こちらのドキュメントに従ってください](https://docs.aws.amazon.com/config/latest/developerguide/notifications-for-AWS-Config.html)。 



### AWS Config の委任管理者

AWS Config の委任管理者は、AWS 組織内の指定されたメンバーアカウントであり、組織全体の設定を管理するための権限を受け取ります。この管理者は、AWS Config ルールのデプロイと管理、コンフォーマンスパックの処理、および複数のアカウントからの設定データの集約を行うことができます。組織全体のリソース設定とコンプライアンスステータスを可視化し、一元的な管理とモニタリングを実現します。[AWS Config の操作と集約に委任管理者を使用するには、このブログ](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/)をご参照ください。

AWS Config に委任管理者を使用することは、ベストプラクティスです。これにより、管理アカウントの使用を組織の重要なタスクのみに限定して保護しながら、AWS Config 固有の管理業務を指定されたメンバーアカウントに委任できます。このアプローチは最小権限の原則に従い、セキュリティリスクを軽減し、指定されたアカウントで Config 管理を一元化することで、より優れた運用管理を実現します。