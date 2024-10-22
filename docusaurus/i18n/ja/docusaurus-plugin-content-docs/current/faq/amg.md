# Amazon Managed Grafana - FAQ

**なぜ Amazon Managed Grafana を選ぶべきですか?**

**[高可用性](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana ワークスペースは、マルチ AZ レプリケーションにより高可用性です。Amazon Managed Grafana は、ワークスペースの正常性を継続的に監視し、ワークスペースへのアクセスに影響を与えることなく、正常でないノードを交換します。Amazon Managed Grafana は、管理とメンテナンスに必要なインフラストラクチャリソースを管理する必要がないため、コンピューティングとデータベースノードの可用性を管理します。

**[データセキュリティ](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な設定、サードパーティツール、または追加コストなしで、データを静的に暗号化します。[データ転送中](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/infrastructure-security.html)も TLS で暗号化されています。

**どの AWS リージョンがサポートされていますか?**

サポートされているリージョンの現在のリストは、[ドキュメントのサポートされているリージョンのセクション](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)で確認できます。

**組織内に複数の AWS アカウントと複数のリージョンがあります。Amazon Managed Grafana はこのようなシナリオで機能しますか?**

Amazon Managed Grafana は [AWS Organizations](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_introduction.html) と統合されており、組織ユニット (OU) 内の AWS アカウントとリソースを検出できます。AWS Organizations を使用すると、[データソースの構成と権限設定を複数の AWS アカウントで一元管理](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-and-Organizations.html)できます。

**Amazon Managed Grafana でサポートされているデータソースは何ですか?**

データソースは、Amazon Managed Grafana でダッシュボードを構築するためにクエリできるストレージバックエンドです。Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray などの AWS ネイティブサービスを含む [30 以上の組み込みデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています。さらに、[約 15 以上の他のデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-enterprise.html)も、Grafana Enterprise のアップグレードワークスペースで利用できます。

**ワークロードのデータソースはプライベート VPC 内にあります。Amazon Managed Grafana に安全に接続するにはどうすればよいですか?**

VPC 内の[プライベートデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を介して Amazon Managed Grafana に接続し、トラフィックを安全に保つことができます。さらに、[VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-nac.html)から Amazon Managed Grafana サービスへのアクセス制御を、[IAM リソースポリシー](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/VPC-endpoints.html)を [Amazon VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)に割り当てることで制限できます。

**Amazon Managed Grafana ではどのようなユーザー認証メカニズムが利用できますか?**

Amazon Managed Grafana ワークスペースでは、[ユーザーは Security Assertion Markup Language 2.0 (SAML 2.0) をサポートする任意の IdP または AWS IAM Identity Center (AWS Single Sign-On の後継) を使用した単一サインオンによって Grafana コンソールに認証されます](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/authentication-in-AMG.html)。

> 関連ブログ: [Fine-grained access control in Amazon Managed Grafana using Grafana Teams](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

**Amazon Managed Grafana では自動化がサポートされていますか?**

Amazon Managed Grafana は [AWS CloudFormation と統合されています](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/creating-resources-with-cloudformation.html)。これにより、お客様は AWS リソースのモデル化と設定を行い、AWS でのリソースとインフラストラクチャの作成と管理に費やす時間を減らすことができます。[AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用すると、お客様は Amazon Managed Grafana リソースを一貫して繰り返し設定するためのテンプレートを再利用できます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/ja_jp/grafana/latest/APIReference/Welcome.html) も用意されており、[AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-welcome.html) による自動化やソフトウェア/製品との統合をサポートしています。Amazon Managed Grafana ワークスペースには、自動化と統合のサポートのための [HTTP API](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) があります。

> 関連ブログ: [Announcing Private VPC data source support for Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

**私の組織では Terraform を使って自動化しています。Amazon Managed Grafana は Terraform をサポートしていますか?**
はい、[Amazon Managed Grafana は Terraform による自動化をサポートしています](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/)。[Terraform モジュール](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)があります。

> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

**現在の Grafana 設定で一般的に使用されているダッシュボードがあります。再作成せずに Amazon Managed Grafana で使用する方法はありますか?**

Amazon Managed Grafana は、ダッシュボード、ユーザーなどの展開と管理を簡単に自動化できる [HTTP API](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしています。これらの API を GitOps/CICD プロセスで使用して、これらのリソースの管理を自動化できます。

**Amazon Managed Grafana はアラートをサポートしていますか?**

[Amazon Managed Grafana のアラート機能](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/alerts-overview.html)は、システムの問題をほぼリアルタイムで把握できるため、サービスの中断を最小限に抑えることができる堅牢で実行可能なアラートを提供します。Grafana には、アラート情報を単一の検索可能なビューに集中させる、更新されたアラートシステム Grafana アラートへのアクセスが含まれています。

**私の組織では、すべてのアクションを監査のために記録する必要があります。Amazon Managed Grafana のイベントを記録できますか?**

Amazon Managed Grafana は [AWS CloudTrail](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、Amazon Managed Grafana でユーザー、ロール、または AWS サービスによって実行されたアクションの記録を提供します。CloudTrail は、Amazon Managed Grafana の [すべての API 呼び出しをイベントとしてキャプチャします](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/logging-using-cloudtrail.html)。キャプチャされる呼び出しには、Amazon Managed Grafana コンソールからの呼び出しと、Amazon Managed Grafana API 操作へのコード呼び出しが含まれます。

**その他の情報はありますか?**

Amazon Managed Grafana の詳細については、AWS [ドキュメント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)を読むか、[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) の AWS Observability ワークショップを参照するか、[製品ページ](https://aws.amazon.com/jp/grafana/)で[機能](https://aws.amazon.com/jp/grafana/features/)、[価格](https://aws.amazon.com/jp/grafana/pricing/)の詳細、最新の[ブログ記事](https://aws.amazon.com/jp/grafana/resources/)、[ビデオ](https://aws.amazon.com/jp/grafana/resources/)を確認してください。

**製品 FAQ** [https://aws.amazon.com/jp/grafana/faqs/](https://aws.amazon.com/jp/grafana/faqs/)
