# CloudWatch エージェント




## CloudWatch エージェントのデプロイ

CloudWatch エージェントは、単一のインストール、分散構成ファイルの使用、複数の構成ファイルの階層化、そして完全な自動化を通じてデプロイできます。どのアプローチが適切かは、あなたのニーズによって異なります。[^1]

:::info
	Windows と Linux ホストへのデプロイメントは、両方とも [Systems Manager パラメータストア](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) に構成を保存および取得する機能があります。この自動化されたメカニズムを通じて CloudWatch エージェントの構成をデプロイすることは、ベストプラクティスです。
:::

:::tip
	あるいは、CloudWatch エージェントの構成ファイルは、選択した自動化ツール（[Ansible](https://www.ansible.com)、[Puppet](https://puppet.com) など）を通じてデプロイすることもできます。Systems Manager パラメータストアの使用は必須ではありませんが、管理を簡素化します。
:::



## AWS 外でのデプロイ

CloudWatch エージェントの使用は AWS 内に*限定されず*、オンプレミスや他のクラウド環境でもサポートされています。ただし、AWS 外で CloudWatch エージェントを使用する場合は、以下の 2 つの追加の考慮事項に注意する必要があります：

1. エージェントが必要な API コールを行えるように IAM 認証情報[^2]を設定すること。EC2 でさえ、CloudWatch API への認証されていないアクセスはありません[^5]。
2. エージェントが要件を満たすルートを使用して、CloudWatch、CloudWatch Logs、および他の AWS エンドポイント[^3]への接続性を確保すること。これは、インターネット経由、[AWS Direct Connect](https://aws.amazon.com/jp/directconnect/) の使用、または [プライベートエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/concepts.html)（通常 *VPC エンドポイント* と呼ばれる）を通じて行うことができます。

:::info
お客様の環境と CloudWatch 間のトランスポートは、ガバナンスとセキュリティの要件に合致する必要があります。一般的に、AWS 外のワークロードにプライベートエンドポイントを使用することで、最も厳しく規制された業界のお客様のニーズも満たすことができます。しかし、大多数のお客様にとっては、パブリックエンドポイントで十分なサービスを提供できます。
:::



## プライベートエンドポイントの使用

メトリクスとログをプッシュするために、CloudWatch エージェントは *CloudWatch* および *CloudWatch Logs* エンドポイントへの接続性を持つ必要があります。エージェントがインストールされている場所に応じて、これを実現するにはいくつかの方法があります。



### VPC から

a. *VPC エンドポイント* (CloudWatch と CloudWatch Logs 用) を使用して、VPC と CloudWatch の間に完全にプライベートで安全な接続を確立し、EC2 上で実行されているエージェントを利用できます。このアプローチでは、エージェントのトラフィックがインターネットを経由することはありません。

b. もう 1 つの選択肢は、パブリックな [NAT ゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html) を使用することです。これにより、プライベートサブネットからインターネットに接続できますが、インターネットから予期しない着信接続を受け取ることはできません。

:::note
このアプローチでは、エージェントのトラフィックは論理的にインターネット経由でルーティングされることに注意してください。
:::

c. 既存の TLS や [Sigv4](https://docs.aws.amazon.com/ja_jp/general/latest/gr/signature-version-4.html) メカニズム以上のプライベートまたは安全な接続を確立する必要がない場合、最も簡単な選択肢は [インターネットゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Internet_Gateway.html) を使用してエンドポイントへの接続を提供することです。




### オンプレミスまたは他のクラウド環境から

a. AWS 外で実行されているエージェントは、インターネット経由（独自のネットワーク設定を介して）または Direct Connect [パブリック VIF](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) を通じて CloudWatch のパブリックエンドポイントに接続できます。

b. エージェントのトラフィックをインターネットを経由させたくない場合は、AWS PrivateLink を利用した [VPC インターフェイスエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpce-interface.html) を活用して、Direct Connect プライベート VIF または VPN を使用してオンプレミスネットワークまでプライベート接続を拡張できます。トラフィックはインターネットに露出されないため、脅威のベクトルを排除できます。

:::success
	[AWS Systems Manager エージェント](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html) から取得した認証情報を使用して、CloudWatch エージェントが使用する [一時的な AWS アクセストークン](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) を追加できます。
:::

[^1]: CloudWatch エージェントの使用とデプロイメントに関するガイダンスを提供するブログについては、[オープンソースの Amazon CloudWatch エージェントの使用開始](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) をご覧ください。

[^2]: [オンプレミスおよび他のクラウド環境で実行されるエージェントの認証情報設定に関するガイダンス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html)

[^3]: [CloudWatch エンドポイントへの接続性を確認する方法](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html)

[^4]: [オンプレミスのプライベート接続に関するブログ](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: オブザーバビリティに関連するすべての AWS API の使用は、通常 [インスタンスプロファイル](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) によって実現されます。これは、AWS で実行されているインスタンスとコンテナに一時的なアクセス認証情報を付与するメカニズムです。
