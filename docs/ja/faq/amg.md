# Amazon Managed Grafana - よくある質問

**Amazon Managed Grafana を選ぶ理由は何ですか?**

**[高可用性](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana のワークスペースは、マルチ AZ レプリケーションによって高可用性が実現しています。Amazon Managed Grafana はワークスペースの正常性も継続的に監視し、ワークスペースへのアクセスに影響を与えることなく、不健全なノードを置き換えます。Amazon Managed Grafana は、管理とメンテナンスに必要なインフラストラクチャリソースを管理するため、お客様はコンピューティングおよびデータベースノードの可用性を管理する必要がありません。

**[データセキュリティ](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な構成、サードパーティツール、追加コストなしに、保存データの暗号化を行います。[転送中のデータ](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)も TLS によって暗号化されます。

**どの AWS リージョンがサポートされていますか?**

サポートされているリージョンの最新のリストは、[ドキュメントのサポートされているリージョンのセクション](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)でご確認いただけます。

**組織には複数の AWS アカウントとリージョンがあります。Amazon Managed Grafana はこれらのシナリオに対応していますか**

Amazon Managed Grafana は [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) と統合されており、組織単位 (OU) の AWS アカウントとリソースを検出できます。AWS Organizations を使用することで、お客様は[複数の AWS アカウントにわたってデータソースの構成とアクセス許可の設定を集中管理](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)できます。

**Amazon Managed Grafana でサポートされているデータソースは何ですか?**

データソースは、Amazon Managed Grafana でダッシュボードを構築するために Grafana でクエリできるストレージバックエンドです。Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray など、AWS ネイティブサービスを含む[30を超える組み込みデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています。 。さらに、アップグレードされた Grafana Enterprise のワークスペースでは、[約 15 のその他のデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)も使用できます。

**ワークロードのデータソースはプライベート VPC 内にあります。これらを Amazon Managed Grafana に安全に接続するにはどうすればよいですか?**

VPC 内のプライベートな[データソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を介して Amazon Managed Grafana に接続でき、トラフィックは安全に保たれます。さらに、[VPC エンドポイント](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html)から Amazon Managed Grafana サービスへのアクセス制御は、[IAM リソースポリシー](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)を添付することで制限できます。 

**Amazon Managed Grafana で利用できるユーザー認証メカニズムは何ですか?**

Amazon Managed Grafana ワークスペースでは、[ユーザーは Grafana コンソールに](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) 、Security Assertion Markup Language 2.0 (SAML 2.0) または AWS IAM Identity Center (AWS Single Sign-On の後継) をサポートする ID プロバイダを使用したシングルサインオンによって認証されます。

> 関連ブログ: [Grafana Teams を使用した Amazon Managed Grafana でのきめ細かいアクセス制御](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

**Amazon Managed Grafana で利用できる自動化のサポートは何ですか?**

Amazon Managed Grafana は [AWS CloudFormation](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html) と統合されているため、お客様は AWS リソースのモデリングと設定を行うことができ、AWS でのリソースとインフラストラクチャの作成と管理に費やす時間を短縮できます。 [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用することで、お客様はテンプレートを再利用して、Amazon Managed Grafana リソースを一貫して反復的に設定できます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) も用意されており、[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) を介して自動化したり、ソフトウェア/製品と統合したりすることをサポートしています。Amazon Managed Grafana ワークスペースには、自動化と統合のサポートのための [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) があります。

> 関連ブログ: [Amazon Managed Grafana のプライベート VPC データソース サポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

**組織では Terraform を自動化に使用しています。Amazon Managed Grafana は Terraform をサポートしていますか?**
はい、[Amazon Managed Grafana は](/observability-best-practices/ja/recipes/recipes/amg-automation-tf/) Terraform による[自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)をサポートしています

> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

**現在の Grafana セットアップで一般的に使用されているダッシュボードがあります。Amazon Managed Grafana で再作成するのではなく、それらを使用する方法はありますか?**

Amazon Managed Grafana は、ダッシュボード、ユーザーなどのデプロイと管理を簡単に自動化できる [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしています。 これらの API を GitOps/CI/CD プロセスで使用して、これらのリソースの管理を自動化できます。

**Amazon Managed Grafana はアラートをサポートしていますか?**

[Amazon Managed Grafana アラート](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) は、システムの問題をリアルタイムで学習できるようにし、サービスへの混乱を最小限に抑えることができる、効果的で実行可能なアラートを提供します。 Grafana には、アラート情報を 1 か所で検索可能なビューに集約する、アップデートされたアラートシステムである Grafana アラートへのアクセスが含まれています。

**組織では監査のためにすべてのアクションを記録する必要があります。Amazon Managed Grafana のイベントを記録できますか?**

Amazon Managed Grafana は、[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、Amazon Managed Grafana でのユーザー、ロール、AWS サービスによるアクションの記録を提供します。CloudTrail は、[Amazon Managed Grafana のすべての API 呼び出し](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてキャプチャします。キャプチャされる呼び出しには、Amazon Managed Grafana コンソールからの呼び出しと、Amazon Managed Grafana API 操作へのコード呼び出しが含まれます。

**その他どのような情報が入手できますか?**

Amazon Managed Grafana の詳細については、AWS の[ドキュメント](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)をお読みいただくか、[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) に関する AWS Observability ワークショップを確認するか、[機能](https://aws.amazon.com/grafana/features/?nc=sn&loc=2)、[価格](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3)の詳細、最新の[ブログ記事](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts)、[動画](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)を[製品ページ](https://aws.amazon.com/grafana/)でご確認ください。

**製品 FAQ** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
