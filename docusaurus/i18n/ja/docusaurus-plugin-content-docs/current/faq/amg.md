# Amazon Managed Grafana - よくある質問

**Amazon Managed Grafana を選ぶべき理由は何ですか？**

**[高可用性](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana のワークスペースは、マルチ AZ レプリケーションにより高可用性を実現しています。Amazon Managed Grafana は、ワークスペースの健全性を継続的に監視し、ワークスペースへのアクセスに影響を与えることなく、不健全なノードを置き換えます。Amazon Managed Grafana は、コンピュートとデータベースノードの可用性を管理するため、お客様は管理や保守に必要なインフラストラクチャリソースを管理する必要がありません。

**[データセキュリティ](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な設定や第三者のツール、追加コストなしで、保存時のデータを暗号化します。[転送中のデータ](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/infrastructure-security.html)も TLS を介して暗号化されます。

**どの AWS リージョンがサポートされていますか？**

現在サポートされているリージョンのリストは、[ドキュメントのサポートされているリージョンのセクション](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)で確認できます。

**組織内に複数のリージョンにまたがる複数の AWS アカウントがありますが、Amazon Managed Grafana はこのようなシナリオに対応していますか？**

Amazon Managed Grafana は [AWS Organizations](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_introduction.html) と統合して、組織単位（OU）内の AWS アカウントとリソースを検出します。AWS Organizations を使用することで、お客様は複数の AWS アカウントの[データソース設定と権限設定を一元管理](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-and-Organizations.html)できます。

**Amazon Managed Grafana ではどのようなデータソースがサポートされていますか？**

データソースは、お客様が Amazon Managed Grafana でダッシュボードを構築するためにクエリを実行できるストレージバックエンドです。Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray など、AWS ネイティブサービスを含む[30 以上の組み込みデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-builtin.html)をサポートしています。さらに、Grafana Enterprise のアップグレードされたワークスペースでは、[約 15 以上の他のデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-enterprise.html)も利用可能です。

**ワークロードのデータソースがプライベート VPC にあります。Amazon Managed Grafana に安全に接続するにはどうすればよいですか？**

[VPC 内のプライベートデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を通じて Amazon Managed Grafana に接続し、トラフィックを安全に保つことができます。さらに、[VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-nac.html)から Amazon Managed Grafana サービスへのアクセス制御は、[Amazon VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)に [IAM リソースポリシー](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/VPC-endpoints.html)をアタッチすることで制限できます。

**Amazon Managed Grafana ではどのようなユーザー認証メカニズムが利用可能ですか？**

Amazon Managed Grafana ワークスペースでは、Security Assertion Markup Language 2.0（SAML 2.0）をサポートする任意の IDP または AWS IAM Identity Center（AWS Single Sign-On の後継）を使用したシングルサインオンにより、[ユーザーは Grafana コンソールに認証](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/authentication-in-AMG.html)されます。

> 関連ブログ: [Grafana Teams を使用した Amazon Managed Grafana の細粒度アクセス制御](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

**Amazon Managed Grafana にはどのような自動化サポートがありますか？**

Amazon Managed Grafana は [AWS CloudFormation と統合](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/creating-resources-with-cloudformation.html)されており、お客様が AWS リソースのモデリングとセットアップを行うのに役立ちます。これにより、お客様は AWS でのリソースとインフラストラクチャの作成と管理に費やす時間を削減できます。[AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用することで、お客様は Amazon Managed Grafana リソースを一貫性を持って繰り返しセットアップするためにテンプレートを再利用できます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/ja_jp/grafana/latest/APIReference/Welcome.html) も用意されており、[AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-welcome.html) を通じた自動化やソフトウェア/製品との統合をサポートしています。Amazon Managed Grafana ワークスペースには、自動化と統合をサポートする [HTTP API](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) があります。

> 関連ブログ: [Amazon Managed Grafana のプライベート VPC データソースサポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

**私の組織は自動化に Terraform を使用しています。Amazon Managed Grafana は Terraform をサポートしていますか？**
はい、[Amazon Managed Grafana は](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform による[自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)をサポートしています。

> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

**現在の Grafana セットアップで一般的に使用されているダッシュボードを使用しています。これらを再作成せずに Amazon Managed Grafana で使用する方法はありますか？**

Amazon Managed Grafana は、ダッシュボード、ユーザー、その他多くのリソースのデプロイと管理を簡単に自動化できる [HTTP API](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしています。これらの API を GitOps/CICD プロセスで使用して、これらのリソースの管理を自動化できます。

**Amazon Managed Grafana はアラートをサポートしていますか？**

[Amazon Managed Grafana のアラート機能](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/alerts-overview.html)は、お客様にシステムの問題をほぼリアルタイムで学習できる堅牢で実用的なアラートを提供し、サービスの中断を最小限に抑えます。Grafana には、アラート情報を単一の検索可能なビューに集中させる更新されたアラートシステム、Grafana アラートへのアクセスが含まれています。

**私の組織では、監査のためにすべてのアクションを記録する必要があります。Amazon Managed Grafana のイベントを記録できますか？**

Amazon Managed Grafana は [AWS CloudTrail](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、ユーザー、ロール、または AWS サービスが Amazon Managed Grafana で実行したアクションの記録を提供します。CloudTrail は、Amazon Managed Grafana の[すべての API 呼び出し](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてキャプチャします。キャプチャされる呼び出しには、Amazon Managed Grafana コンソールからの呼び出しと、Amazon Managed Grafana API オペレーションへのコード呼び出しが含まれます。

**さらに詳しい情報はどこで入手できますか？**

Amazon Managed Grafana に関する追加情報については、AWS の[ドキュメント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)を読んだり、[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) に関する AWS Observability ワークショップを受講したり、[製品ページ](https://aws.amazon.com/jp/grafana/)で[機能](https://aws.amazon.com/jp/grafana/features/)、[価格](https://aws.amazon.com/jp/grafana/pricing/)の詳細、最新の[ブログ投稿](https://aws.amazon.com/jp/grafana/resources/)や[動画](https://aws.amazon.com/jp/grafana/resources/)を確認することができます。

**製品 FAQ** [https://aws.amazon.com/jp/grafana/faqs/](https://aws.amazon.com/jp/grafana/faqs/)
