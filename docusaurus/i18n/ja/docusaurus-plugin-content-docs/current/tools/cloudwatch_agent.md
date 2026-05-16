# CloudWatch Agent


## CloudWatch エージェントのデプロイ

CloudWatch エージェントは、単一のインストールとして、分散構成ファイルを使用して、複数の構成ファイルをレイヤー化して、または完全に自動化を通じてデプロイできます。どのアプローチが適切かは、ニーズによって異なります。[^1]

:::info
	Windows および Linux ホストへのデプロイメントは、どちらも [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) に設定を保存および取得する機能を備えています。この自動化されたメカニズムを通じて CloudWatch エージェント設定のデプロイメントを処理することがベストプラクティスです。 
:::

:::tip
	あるいは、CloudWatch エージェントの設定ファイルは、お好みの自動化ツール（[Ansible](https://www.ansible.com)、[Puppet](https://puppet.com) など）を使用してデプロイすることもできます。Systems Manager Parameter Store の使用は必須ではありませんが、管理を簡素化できます。
:::
## AWS 外部へのデプロイ

CloudWatch エージェントの使用は AWS 内に*限定されず*、オンプレミスおよび他のクラウド環境の両方でサポートされています。ただし、AWS 外で CloudWatch エージェントを使用する場合は、留意すべき 2 つの追加の考慮事項があります。

1. エージェントが必要な API 呼び出しを行えるように IAM 認証情報[^2]を設定します。EC2 内であっても、CloudWatch API[^5]への認証されていないアクセスはありません。
1. エージェントが要件を満たすルートを使用して CloudWatch、CloudWatch Logs、およびその他の AWS エンドポイント[^3]への接続を確保します。これは、インターネット経由、[AWS Direct Connect](https://aws.amazon.com/directconnect/) の使用、または[プライベートエンドポイント](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html)(通常は *VPC エンドポイント*と呼ばれます)を介して行うことができます。

:::info
	環境と CloudWatch 間のトランスポートは、ガバナンスとセキュリティの要件に一致する必要があります。大まかに言えば、AWS 外部のワークロードにプライベートエンドポイントを使用することで、最も厳しく規制された業界の顧客のニーズにも対応できます。ただし、大多数の顧客は、パブリックエンドポイントを使用することで十分に対応できます。
:::
## プライベートエンドポイントの使用

メトリクスとログをプッシュするには、CloudWatch エージェントが *CloudWatch* および *CloudWatch Logs* エンドポイントに接続できる必要があります。これを実現する方法は、エージェントがインストールされている場所に応じていくつかあります。

### VPC から

a. EC2 で実行されるエージェントの VPC と CloudWatch 間で完全にプライベートで安全な接続を確立するために、*VPC Endpoints*（CloudWatch および CloudWatch Logs 用）を利用できます。このアプローチでは、エージェントのトラフィックがインターネットを経由することはありません。

b. もう 1 つの方法は、パブリック [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) を使用することです。これにより、プライベートサブネットはインターネットに接続できますが、インターネットから未承諾のインバウンド接続を受信することはできません。 

:::note
	このアプローチでは、エージェントのトラフィックは論理的にインターネット経由でルーティングされることに注意してください。
:::
c. 既存の TLS および [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) メカニズムを超えてプライベートまたはセキュアな接続を確立する必要がない場合、最も簡単なオプションは [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) を使用してエンドポイントへの接続を提供することです。

### オンプレミスまたは他のクラウド環境から

a. AWS 外で実行されているエージェントは、インターネット経由（独自のネットワーク設定を使用）または Direct Connect [パブリック VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) を介して CloudWatch パブリックエンドポイントへの接続を確立できます。

b. エージェントトラフィックがインターネットを経由しないようにする必要がある場合は、AWS PrivateLink を利用した [VPC インターフェイスエンドポイント](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html)を活用して、Direct Connect プライベート VIF または VPN を使用してオンプレミスネットワークまでプライベート接続を拡張できます。トラフィックはインターネットに公開されないため、脅威ベクトルが排除されます。

:::success
	[AWS Systems Manager エージェント](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)から取得した認証情報を使用することで、CloudWatch エージェントが使用する[一時的な AWS アクセストークン](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/)を追加できます。
:::
:::

[^1]: See [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) for a blog that gives guidance for CloudWatch agent use and deployment.


[^2]: [Guidance on setting credentials for agents running on-premises and in other cloud environments](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [How to verify connectivity to the CloudWatch endpoints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [A blog for on-premises, private connectivity](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Use of all AWS APIs related to observability is typically accomplished by an [instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) - a mechanism to grant temporary access credentials to instances and containers running in AWS.
