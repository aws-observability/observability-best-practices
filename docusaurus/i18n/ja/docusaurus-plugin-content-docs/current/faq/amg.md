# Amazon Managed Grafana - FAQ

## Amazon Managed Grafana を選択する理由

**[高可用性](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana ワークスペースは、マルチ AZ レプリケーションにより高可用性を実現しています。Amazon Managed Grafana はワークスペースの健全性を継続的に監視し、ワークスペースへのアクセスに影響を与えることなく、異常なノードを置き換えます。Amazon Managed Grafana はコンピューティングノードとデータベースノードの可用性を管理するため、お客様は管理とメンテナンスに必要なインフラストラクチャリソースを管理する必要がありません。

**[データセキュリティ](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な設定、サードパーティツール、または追加コストなしで、保管中のデータを暗号化します。[転送中のデータ](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)も TLS 経由で暗号化されます。

## どの AWS リージョンがサポートされていますか？

サポートされているリージョンの最新リストは、[ドキュメントのサポートされているリージョンのセクション](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)で確認できます。

## 組織内の複数のリージョンに複数の AWS アカウントがありますが、Amazon Managed Grafana はこれらのシナリオで機能しますか?

Amazon Managed Grafana は [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) と統合され、組織単位 (OU) 内の AWS アカウントとリソースを検出します。AWS Organizations を使用することで、お客様は複数の AWS アカウントに対する[データソース設定とアクセス許可設定を一元管理](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)できます。

## Amazon Managed Grafana ではどのようなデータソースがサポートされていますか?

データソースは、顧客が Grafana でクエリを実行して Amazon Managed Grafana でダッシュボードを構築できるストレージバックエンドです。Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray などの AWS ネイティブサービスを含む [30 以上の組み込みデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています。さらに、Grafana Enterprise のアップグレードされたワークスペースでは、[約 15 以上の他のデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)も利用できます。

## ワークロードのデータソースがプライベート VPC にあります。Amazon Managed Grafana に安全に接続するにはどうすればよいですか?

VPC 内のプライベート[データソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を通じて Amazon Managed Grafana に接続でき、トラフィックを安全に保つことができます。[VPC エンドポイント](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html)から Amazon Managed Grafana サービスへのさらなるアクセス制御は、[Amazon VPC エンドポイント](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)用の [IAM リソースポリシー](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)をアタッチすることで制限できます。

## Amazon Managed Grafana ではどのようなユーザー認証メカニズムが利用できますか？

Amazon Managed Grafana ワークスペースでは、Security Assertion Markup Language 2.0 (SAML 2.0) または AWS IAM Identity Center (AWS Single Sign-On の後継) をサポートする任意の IDP を使用したシングルサインオンにより、[ユーザーは Grafana コンソールに認証されます](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html)。

> 関連ブログ: [Grafana Teams を使用した Amazon Managed Grafana のきめ細かなアクセス制御](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana ではどのような自動化サポートが利用できますか?

Amazon Managed Grafana は [AWS CloudFormation と統合されており](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html)、AWS リソースのモデリングと設定を支援することで、AWS でのリソースとインフラストラクチャの作成と管理にかかる時間を削減できます。[AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用することで、テンプレートを再利用して Amazon Managed Grafana リソースを一貫して繰り返し設定できます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) も用意されており、[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) を通じた自動化やソフトウェア/製品との統合をサポートします。Amazon Managed Grafana ワークスペースには、自動化と統合をサポートする [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) があります。

> 関連ブログ: [Amazon Managed Grafana のプライベート VPC データソースサポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## 私の組織は自動化に Terraform を使用しています。Amazon Managed Grafana は Terraform をサポートしていますか?
はい、[Amazon Managed Grafana は Terraform をサポートしています](/observability-best-practices/ja/recipes/recipes/amg-automation-tf/)。[自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)に使用できます。

> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## 現在の Grafana セットアップで一般的に使用されているダッシュボードを使用しています。再作成するのではなく、Amazon Managed Grafana でそれらを使用する方法はありますか？

Amazon Managed Grafana は [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしており、ダッシュボード、ユーザーなどのデプロイと管理を簡単に自動化できます。これらの API を GitOps/CICD プロセスで使用して、これらのリソースの管理を自動化できます。

## Amazon Managed Grafana はアラートをサポートしていますか?

[Amazon Managed Grafana アラート](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html)は、システムの問題をほぼリアルタイムで把握し、サービスの中断を最小限に抑えるのに役立つ、堅牢で実用的なアラートをお客様に提供します。Grafana には、アラート情報を単一の検索可能なビューに集約する、更新されたアラートシステムである Grafana アラートへのアクセスが含まれています。

## 組織では、監査のためにすべてのアクションを記録する必要があります。Amazon Managed Grafana のイベントを記録できますか？

Amazon Managed Grafana は [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、Amazon Managed Grafana でユーザー、ロール、または AWS サービスによって実行されたアクションの記録を提供します。CloudTrail は、[Amazon Managed Grafana のすべての API コール](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてキャプチャします。キャプチャされるコールには、Amazon Managed Grafana コンソールからのコールと、Amazon Managed Grafana API オペレーションへのコードコールが含まれます。

## どのような追加情報が利用できますか？

Amazon Managed Grafana の詳細については、AWS [ドキュメント](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)を参照するか、[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) に関する AWS Observability Workshop を実施してください。また、[製品ページ](https://aws.amazon.com/grafana/)で[機能](https://aws.amazon.com/grafana/features/?nc=sn&loc=2)、[料金](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3)の詳細、最新の[ブログ記事](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts)、[動画](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)を確認することもできます。

**製品 FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
