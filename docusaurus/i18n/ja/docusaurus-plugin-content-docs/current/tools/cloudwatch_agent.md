# CloudWatch Agent




## CloudWatch エージェントのデプロイ

CloudWatch エージェントは、単一インストール、分散設定ファイルの使用、複数の設定ファイルのレイヤリング、完全な自動化など、様々な方法でデプロイできます。どのアプローチが適切かは、ニーズによって異なります。[^1]

:::info
Windows と Linux ホストへのデプロイでは、両方とも [Systems Manager Parameter Store](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) に設定を保存および取得する機能があります。この自動化メカニズムを通じて CloudWatch エージェントの設定をデプロイすることは、ベストプラクティスとされています。
:::

:::tip
また、CloudWatch エージェントの設定ファイルは、選択した自動化ツール（[Ansible](https://www.ansible.com)、[Puppet](https://puppet.com) など）を通じてデプロイすることもできます。Systems Manager Parameter Store の使用は必須ではありませんが、管理を簡素化できます。
:::



## AWS 外でのデプロイ

CloudWatch エージェントの使用は AWS 内に _限定されず_、オンプレミスや他のクラウド環境でもサポートされています。ただし、AWS 外で CloudWatch エージェントを使用する場合は、以下の 2 つの追加の考慮事項に注意する必要があります。

1. エージェントが必要な API コールを行えるように IAM 認証情報[^2]を設定します。EC2 でも、CloudWatch API への認証なしのアクセス[^5]はできません。
1. 要件を満たすルートを使用して、CloudWatch、CloudWatch Logs、その他の AWS エンドポイント[^3]への接続を確保します。これは、インターネット経由、[AWS Direct Connect](https://aws.amazon.com/jp/directconnect/) の使用、または [プライベートエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/concepts.html)（通常 *VPC エンドポイント* と呼ばれる）を通じて行うことができます。

:::info
環境と CloudWatch 間のトランスポートは、ガバナンスとセキュリティの要件に合致する必要があります。一般的に、AWS 外のワークロードにプライベートエンドポイントを使用することで、最も厳格に規制された業界のお客様のニーズにも対応できます。ただし、ほとんどのお客様にとって、パブリックエンドポイントで十分なサービスを提供できます。
:::



## プライベートエンドポイントの使用

メトリクスとログをプッシュするために、CloudWatch エージェントは *CloudWatch* および *CloudWatch Logs* エンドポイントへの接続が必要です。エージェントのインストール場所に応じて、これを実現するための方法がいくつかあります。




### VPC からの接続

a. EC2 で実行されているエージェントの場合、VPC と CloudWatch の間に完全にプライベートで安全な接続を確立するために、*VPC エンドポイント* (CloudWatch および CloudWatch Logs 用) を使用できます。このアプローチでは、エージェントのトラフィックがインターネットを経由することはありません。

b. もう 1 つの選択肢は、パブリック [NAT ゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html) を使用することです。これにより、プライベートサブネットからインターネットに接続できますが、インターネットから予期しない着信接続を受け付けることはありません。

:::note
このアプローチでは、エージェントのトラフィックは論理的にインターネット経由でルーティングされることに注意してください。
:::

c. 既存の TLS および [Sigv4](https://docs.aws.amazon.com/ja_jp/general/latest/gr/signature-version-4.html) メカニズム以外のプライベートまたは安全な接続を確立する必要がない場合、最も簡単な選択肢は [インターネットゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Internet_Gateway.html) を使用してエンドポイントへの接続を提供することです。



### オンプレミスまたは他のクラウド環境から

a. AWS 外で実行されているエージェントは、インターネット経由（独自のネットワーク設定を介して）または Direct Connect [Public VIF](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) を通じて CloudWatch のパブリックエンドポイントに接続できます。

b. エージェントのトラフィックをインターネットを経由させたくない場合は、AWS PrivateLink を利用した [VPC インターフェースエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpce-interface.html) を使用して、Direct Connect Private VIF または VPN を使用してオンプレミスネットワークまでのプライベート接続を拡張できます。トラフィックはインターネットに露出されないため、脅威のベクトルを排除できます。

:::success
CloudWatch エージェントで使用する [一時的な AWS アクセストークン](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) を、[AWS Systems Manager エージェント](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html) から取得した認証情報を使用して追加できます。
:::

[^1]: CloudWatch エージェントの使用とデプロイメントのガイダンスを提供するブログについては、[Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) をご覧ください。

[^2]: [ オンプレミスおよび他のクラウド環境で実行されるエージェントの認証情報設定に関するガイダンス ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [CloudWatch エンドポイントへの接続性を確認する方法](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [ オンプレミスのプライベート接続に関するブログ ](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: オブザーバビリティに関連するすべての AWS API の使用は、通常 [インスタンスプロファイル](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) によって実現されます。これは AWS で実行されているインスタンスとコンテナに一時的なアクセス認証情報を付与するメカニズムです。