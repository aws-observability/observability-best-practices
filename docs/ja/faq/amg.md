# Amazon Managed Grafana - FAQ

**Amazon Managed Grafanaを選択する理由は何ですか?**

**[高可用性](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafanaのワークスペースは、マルチAZレプリケーションにより高可用性が実現しています。Amazon Managed Grafanaは、ワークスペースへのアクセスに影響を与えることなく、ワークスペースの正常性を継続的に監視し、不健全なノードを交換します。Amazon Managed Grafanaは、コンピュートおよびデータベースノードの可用性を管理するため、お客様は管理とメンテナンスに必要なインフラストラクチャリソースを管理する必要がありません。

**[データセキュリティ](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafanaは、特別な構成、サードパーティツール、追加コストなしにデータを暗号化します。 [転送中のデータ](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)もTLSを介して暗号化されます。

**どのAWSリージョンがサポートされていますか?**

サポートされているリージョンの最新リストは、[ドキュメントのサポートされているリージョンセクション](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)でご確認いただけます。

**組織には複数のAWSアカウントと複数のリージョンがあります。Amazon Managed Grafanaはこれらのシナリオに対応していますか?**

Amazon Managed Grafanaは、[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)と統合されており、組織単位(OU)内のAWSアカウントとリソースを検出します。AWS Organizationsを使用すると、複数のAWSアカウントにわたってデータソース構成とアクセス許可設定を[集中管理](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)できます。

**Amazon Managed Grafanaでサポートされているデータソースは何ですか?** 

データソースは、Amazon Managed Grafanaでダッシュボードを構築するためにGrafanaでクエリできるストレージバックエンドです。Amazon Managed Grafanaは、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Rayなど、AWSネイティブサービスを含む[30以上の組み込みデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています。 。さらに、Grafana Enterpriseでアップグレードされたワークスペースでは、[約15のその他のデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)も使用できます。

**ワークロードのデータソースはプライベートVPC内にあります。これらをAmazon Managed Grafanaに安全に接続するにはどうすればよいですか?**

VPC内の[プライベートデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLinkを介してAmazon Managed Grafanaに接続でき、トラフィックは安全に保たれます。[VPCエンドポイント](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html)からAmazon Managed Grafanaサービスへのアクセス制御は、[Amazon VPCエンドポイント](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)の[IAMリソースポリシー](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)をアタッチすることでさらに制限できます。

**Amazon Managed Grafanaで利用できるユーザー認証メカニズムは何ですか?**

Amazon Managed Grafanaワークスペースでは、[ユーザーはGrafanaコンソールへの](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) シングルサインオンによって認証されます。これは、Security Assertion Markup Language 2.0 (SAML 2.0) または AWS IAM Identity Center (以前の AWS Single Sign-On) をサポートするIDプロバイダを使用します。

> 関連ブログ: [Grafana Teamsを使用したAmazon Managed Grafanaの細かいアクセス制御](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

**Amazon Managed Grafanaの自動化サポートの詳細は?**

Amazon Managed Grafanaは、[AWS CloudFormationと統合](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html)されており、AWSリソースのモデリングとセットアップを支援します。これにより、お客様はAWSでのリソースとインフラストラクチャの作成と管理に費やす時間を短縮できます。 [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)を使用すると、テンプレートを再利用してAmazon Managed Grafanaリソースを一貫して反復できます。Amazon Managed Grafanaには[API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html)もあり、[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)を介して自動化したり、ソフトウェア/製品と統合したりできます。Amazon Managed Grafanaワークスペースには、自動化と統合をサポートする[HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)があります。

> 関連ブログ: [Amazon Managed GrafanaのプライベートVPCデータソースサポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

**組織ではTerraformを自動化に使用しています。Amazon Managed GrafanaはTerraformをサポートしていますか?**
はい、[Amazon Managed Grafanaは](/observability-best-practices/ja/recipes/recipes/amg-automation-tf/) Terraformによる[自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)をサポートしています

> 例: [Terraformサポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

**現在のGrafanaセットアップで一般的に使用されているダッシュボードを使用しています。これらをAmazon Managed Grafanaで再作成するのではなく使用する方法はありますか?**

Amazon Managed Grafanaは、ダッシュボード、ユーザーなどのデプロイと管理を簡単に自動化できる[HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)をサポートしています。これらのAPIをGitOps/CI/CDプロセスで使用して、これらのリソースの管理を自動化できます。

**Amazon Managed Grafanaはアラートをサポートしていますか?**

[Amazon Managed Grafana アラート](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) は、システムの問題をリアルタイムで学習できるようにし、サービスへの混乱を最小限に抑えることができる信頼できるアラートを提供します。Grafanaには、アラート情報を1か所で検索可能なビューに集約する、更新されたアラートシステムであるGrafanaアラートへのアクセスが含まれています。

**組織ではすべてのアクションを監査のために記録する必要があります。Amazon Managed Grafanaのイベントを記録できますか?**

Amazon Managed Grafanaは、[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)と統合されており、Amazon Managed Grafanaでのユーザー、ロール、AWS サービスによるアクションの記録を提供します。CloudTrailは、[Amazon Managed GrafanaのすべてのAPI呼び出し](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてキャプチャします。キャプチャされる呼び出しには、Amazon Managed Grafanaコンソールからの呼び出しと、Amazon Managed Grafana API操作へのコード呼び出しが含まれます。

**その他の情報は?**

Amazon Managed Grafanaの詳細については、AWSの[ドキュメント](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)をお読みいただくか、AWS Observability ワークショップの[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg)をご覧いただくか、[製品ページ](https://aws.amazon.com/grafana/)をチェックして、機能、価格設定の詳細、最新の[ブログ投稿](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts)、[ビデオ](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)をご確認ください。

**製品FAQ** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
