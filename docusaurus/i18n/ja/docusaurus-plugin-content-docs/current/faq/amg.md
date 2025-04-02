# Amazon Managed Grafana - よくある質問




## Amazon Managed Grafana を選ぶべき理由は？

**[高可用性](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana のワークスペースは、マルチ AZ レプリケーションにより高可用性を実現しています。
Amazon Managed Grafana は、ワークスペースの健全性を継続的に監視し、ワークスペースへのアクセスに影響を与えることなく、不健全なノードを置き換えます。
Amazon Managed Grafana はコンピュートとデータベースノードの可用性を管理するため、お客様は管理・メンテナンスに必要なインフラストラクチャリソースを管理する必要がありません。

**[データセキュリティ](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/security.html)**: Amazon Managed Grafana は、特別な設定、サードパーティツール、追加コストなしで、保管中のデータを暗号化します。
[転送中のデータ](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/infrastructure-security.html) も TLS により暗号化されます。



## どの AWS リージョンがサポートされていますか？

現在サポートされているリージョンのリストは、[ドキュメントのサポート対象リージョンのセクション](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)で確認できます。




## 組織内に複数のリージョンにまたがる複数の AWS アカウントがありますが、Amazon Managed Grafana はこのようなシナリオに対応していますか？

Amazon Managed Grafana は、組織単位 (OU) 内の AWS アカウントとリソースを検出するために [AWS Organizations](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_introduction.html) と統合されています。AWS Organizations を使用することで、お客様は複数の AWS アカウントのデータソース設定とアクセス許可設定を[一元的に管理](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-and-Organizations.html)できます。




## Amazon Managed Grafana ではどのようなデータソースがサポートされていますか？

データソースは、お客様が Amazon Managed Grafana でダッシュボードを構築するために Grafana でクエリを実行できるストレージバックエンドです。
Amazon Managed Grafana は、Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray など、AWS ネイティブサービスを含む [30 以上の組み込みデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-builtin.html) をサポートしています。
さらに、Grafana Enterprise のアップグレードされたワークスペースでは、[約 15 以上の他のデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-data-sources-enterprise.html) も利用可能です。



## プライベート VPC にあるワークロードのデータソースを Amazon Managed Grafana に安全に接続するにはどうすればよいですか？

[VPC 内のプライベートデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-vpc.html)は、AWS PrivateLink を通じて Amazon Managed Grafana に接続でき、トラフィックを安全に保つことができます。
[VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-configure-nac.html)からの Amazon Managed Grafana サービスへのアクセス制御は、[Amazon VPC エンドポイント](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)に [IAM リソースポリシー](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/VPC-endpoints.html)を適用することでさらに制限できます。




## Amazon Managed Grafana ではどのようなユーザー認証メカニズムが利用できますか？

Amazon Managed Grafana ワークスペースでは、[Grafana コンソールへのユーザー認証](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/authentication-in-AMG.html)は、Security Assertion Markup Language 2.0 (SAML 2.0) をサポートする任意の IDP、または AWS IAM Identity Center (AWS Single Sign-On の後継) を使用したシングルサインオンによって行われます。

> 関連ブログ: [Fine-grained access control in Amazon Managed Grafana using Grafana Teams](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)



## Amazon Managed Grafana にはどのような自動化サポートがありますか？

Amazon Managed Grafana は [AWS CloudFormation と統合](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/creating-resources-with-cloudformation.html)されており、お客様が AWS のリソースとインフラストラクチャの作成と管理に費やす時間を削減できるように、AWS リソースのモデリングとセットアップをサポートします。[AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/Welcome.html) を使用することで、お客様は Amazon Managed Grafana リソースを一貫性を持って繰り返しセットアップするためのテンプレートを再利用できます。Amazon Managed Grafana には [API](https://docs.aws.amazon.com/ja_jp/grafana/latest/APIReference/Welcome.html) も用意されており、[AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-welcome.html) を通じた自動化やソフトウェア/製品との統合をサポートしています。Amazon Managed Grafana ワークスペースには、自動化と統合をサポートする [HTTP API](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) があります。

> 関連ブログ: [Amazon Managed Grafana のプライベート VPC データソースサポートの発表](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)



## 私の組織は自動化に Terraform を使用しています。Amazon Managed Grafana は Terraform をサポートしていますか？
はい、Amazon Managed Grafana は [自動化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest) のために [Terraform をサポート](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) しています。

> 例: [Terraform サポートのリファレンス実装](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)



## 現在の Grafana セットアップで一般的に使用されているダッシュボードを使用しています。これらを再作成せずに Amazon Managed Grafana で使用する方法はありますか？

Amazon Managed Grafana は、ダッシュボード、ユーザー、その他多くのリソースのデプロイと管理を簡単に自動化できる [HTTP APIs](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Using-Grafana-APIs.html) をサポートしています。
これらの API を GitOps/CICD プロセスで使用して、これらのリソースの管理を自動化できます。



## Amazon Managed Grafana はアラートをサポートしていますか？

[Amazon Managed Grafana のアラート機能](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/alerts-overview.html) は、システムの問題をほぼリアルタイムで把握できる堅牢で実用的なアラートを提供し、サービスの中断を最小限に抑えることができます。
Grafana には、アラート情報を 1 つの検索可能なビューに集約する、更新されたアラートシステム「Grafana アラート」へのアクセスが含まれています。



## 組織が監査のためにすべてのアクションを記録することを要求しています。Amazon Managed Grafana のイベントを記録できますか？

Amazon Managed Grafana は [AWS CloudTrail](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、ユーザー、ロール、または AWS サービスが Amazon Managed Grafana で実行したアクションの記録を提供します。
CloudTrail は、[Amazon Managed Grafana の API 呼び出し](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/logging-using-cloudtrail.html)をイベントとしてすべてキャプチャします。
キャプチャされる呼び出しには、Amazon Managed Grafana コンソールからの呼び出しと、Amazon Managed Grafana API オペレーションへのコード呼び出しが含まれます。




## 追加情報はどこにありますか？

Amazon Managed Grafana に関する追加情報については、AWS の[ドキュメント](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)を参照するか、[Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) に関する AWS オブザーバビリティワークショップを受講してください。また、[製品ページ](https://aws.amazon.com/jp/grafana/)で[機能](https://aws.amazon.com/jp/grafana/features/)、[料金](https://aws.amazon.com/jp/grafana/pricing/)の詳細、最新の[ブログ投稿](https://aws.amazon.com/jp/grafana/resources/)や[動画](https://aws.amazon.com/jp/grafana/resources/)をご確認ください。

**製品 FAQ:** [https://aws.amazon.com/jp/grafana/faqs/](https://aws.amazon.com/jp/grafana/faqs/)
