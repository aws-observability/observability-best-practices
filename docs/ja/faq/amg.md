# Amazon Managed Grafana - よくある質問

1. **Amazon Managed Grafanaを選択する理由は何ですか?**
**[高可用性](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana のワークスペースは、マルチAZレプリケーションにより高可用性が実現しています。Amazon Managed Grafana は、ワークスペースへのアクセスに影響を与えることなく、ワークスペースの正常性を継続的に監視し、不健全なノードを交換します。Amazon Managed Grafana は、コンピュートおよびデータベース ノードの可用性を管理するため、お客様は管理とメンテナンスに必要なインフラストラクチャ リソースを管理する必要がありません。
**[データセキュリティ](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な構成、サードパーティのツール、追加コストなしでデータを暗号化します。 [転送中のデータ](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)も TLS 経由で暗号化されます。

2. **どの AWS リージョンがサポートされていますか?**
現在サポートされているリージョンのリストは、[ドキュメントのサポートされているリージョンセクション](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)で確認できます。

3. **Organization 内の複数の AWS アカウントと複数のリージョンがあります。Amazon Managed Grafana はこれらのシナリオに対応していますか?**
Amazon Managed Grafana は [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) と統合されており、Organization Unit (OU) 内の AWS アカウントとリソースを検出できます。AWS Organizations を使用することで、複数の AWS アカウントに対して[データソース構成とアクセス許可の設定を集中管理](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)できます。

4. **Amazon Managed Grafana でサポートされているデータソースは何ですか?** 
データソースは、お客様が Grafana でクエリを実行して Amazon Managed Grafana のダッシュボードを構築できるストレージ バックエンドです。Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray などの AWS ネイティブ サービスを含む 30 を超える[組み込みデータ ソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています他にも多数。さらに、アップグレードされたワークスペースの Grafana Enterprise では、[約 15 のその他のデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)も利用できます。

5. **ワークロードのデータソースはプライベート VPC 内にあります。これらを Amazon Managed Grafana に安全に接続するにはどうすればよいですか?**
VPC 内の[プライベートデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を介して Amazon Managed Grafana に接続でき、トラフィックを安全に保つことができます。さらに、[VPC エンドポイント](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html)からの Amazon Managed Grafana サービスへのアクセス制御は、[Amazon VPC エンドポイント](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)の[IAM リソースポリシー](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)をアタッチすることで制限できます。

6. **Amazon Managed Grafana で利用できるユーザー認証メカニズムは何ですか?**
Amazon Managed Grafana ワークスペースでは、[ユーザーは Grafana コンソールへの認証](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html)に、Security Assertion Markup Language 2.0 (SAML 2.0) または AWS IAM Identity Center (旧 AWS Single Sign-On) をサポートする ID プロバイダを使用したシングルサインオンによって行います。
> 関連ブログ: [Grafana Teams を使用した Amazon Managed Grafana のきめ細かいアクセス制御](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

7. **Amazon Managed Grafana で利用できる自動化のサポートは何ですか?**
Amazon Managed Grafana は [AWS CloudFormation](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html) と統合されているため、お客様は AWS リソースのモデリングとセットアップを行うことができ、AWS でのリソースとインフラストラクチャの作成と管理に費やす時間を短縮できます。 [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用することで、お客様はテンプレートを再利用して Amazon Managed Grafana リソースを一貫して反復的にセットアップできます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) も利用でき、[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) を介して自動化したり、ソフトウェア/製品と統合したりできます。Amazon Managed Grafana ワークスペースには、自動化と統合をサポートする [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) があります。
> 関連ブログ: [Amazon Managed Grafana のプライベート VPC データソース サポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

8. **Organization で Terraform を自動化に利用しています。Amazon Managed Grafana は Terraform をサポートしていますか?**
はい、[Amazon Managed Grafana は](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform による[自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)をサポートしています。
> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

9. **現在の Grafana セットアップで一般的に使用されているダッシュボードがあります。Amazon Managed Grafana でこれらを再作成するのではなく使用する方法はありますか?**
Amazon Managed Grafana は、ダッシュボード、ユーザーなどのデプロイと管理を簡単に自動化できる [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしています。これらの API を GitOps/CI/CD プロセスで使用して、これらのリソースの管理を自動化できます。

10. **Amazon Managed Grafana はアラートをサポートしていますか?**
[Amazon Managed Grafana アラート](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) は、サービスへの影響を最小限に抑えつつ、システムの問題をリアルタイムで学習できるようにする効果的で実行可能なアラートをお客様に提供します。Grafana には、アラート情報を 1 か所で検索可能なビューに集約する、更新されたアラート システムである Grafana アラートへのアクセスが含まれます。

11. **Organization ではすべてのアクションを監査のために記録する必要があります。Amazon Managed Grafana のイベントを記録できますか?**
Amazon Managed Grafana は、[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、これにより Amazon Managed Grafana でのユーザー、ロール、AWS サービスによるアクションの記録が提供されます。CloudTrail は、[Amazon Managed Grafana のすべての API 呼び出し](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてキャプチャします。キャプチャされる呼び出しには、Amazon Managed Grafana コンソールからの呼び出しと、Amazon Managed Grafana API 操作へのコード呼び出しが含まれます。

12. **その他どのような情報が入手できますか?**
Amazon Managed Grafana の詳細については、AWS の[ドキュメント](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)をお読みいただくか、AWS Observability ワークショップの [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) を確認するか、[製品ページ](https://aws.amazon.com/grafana/)をチェックして、[機能](https://aws.amazon.com/grafana/features/?nc=sn&loc=2)、[価格](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3)の詳細、最新の[ブログ記事](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts)、[動画](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)を確認してください。

13. **製品の FAQ** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
