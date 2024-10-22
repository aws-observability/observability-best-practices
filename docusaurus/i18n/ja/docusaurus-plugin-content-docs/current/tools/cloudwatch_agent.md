# CloudWatch エージェント

## CloudWatch エージェントのデプロイ

CloudWatch エージェントは、単一のインストール、分散構成ファイルの使用、複数の構成ファイルの階層化、完全な自動化のいずれかの方法でデプロイできます。適切なアプローチは、ニーズによって異なります。[^1]

alert{type="info"}
Windows ホストと Linux ホストの両方で、構成を [Systems Manager Parameter Store](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) に保存して取得する機能があります。この自動化されたメカニズムを通じて CloudWatch エージェントの構成をデプロイすることはベストプラクティスです。


tip
あるいは、CloudWatch エージェントの構成ファイルは、お使いの自動化ツール ([Ansible](https://www.ansible.com)、[Puppet](https://puppet.com) など) を通じてデプロイできます。Systems Manager Parameter Store の使用は必須ではありませんが、管理を簡素化します。


## AWS 外でのデプロイ

CloudWatch エージェントの使用は AWS 内に限定されず、オンプレミスおよび他のクラウド環境でもサポートされています。ただし、AWS 外で CloudWatch エージェントを使用する場合は、次の 2 つの点に注意が必要です。

1. エージェントが必要な API 呼び出しを行えるように、IAM 認証情報[^2]を設定する。EC2 でも CloudWatch API への認証されていないアクセスは許可されていません[^5]。
2. エージェントが CloudWatch、CloudWatch Logs、その他の AWS エンドポイント[^3]に要件を満たすルートで接続できるようにする。これは、インターネット経由、[AWS Direct Connect](https://aws.amazon.com/jp/directconnect/) の使用、または [プライベートエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/concepts.html) (通常は *VPC エンドポイント* と呼ばれる) のいずれかを通じて行えます。

info
環境と CloudWatch 間のトランスポートは、ガバナンスとセキュリティ要件に合わせる必要があります。一般的に、AWS 外のワークロードにプライベートエンドポイントを使用すれば、最も厳しい規制のある業界の顧客のニーズも満たすことができます。ただし、大半の顧客は、パブリックエンドポイントを使用すれば十分です。


## プライベートエンドポイントの使用

メトリクスとログをプッシュするには、CloudWatch エージェントが *CloudWatch* および *CloudWatch Logs* エンドポイントに接続できる必要があります。エージェントがインストールされている場所に基づいて、これを実現する方法はいくつかあります。

### VPC からの接続

a. VPC 内の EC2 上で実行されているエージェントから CloudWatch への完全にプライベートで安全な接続を確立するために、*VPC エンドポイント* (CloudWatch と CloudWatch Logs 用) を利用できます。このアプローチでは、エージェントのトラフィックはインターネットを通過しません。

b. 別の選択肢として、プライベートサブネットからインターネットに接続できるが、インターネットから無作為の着信接続を受け取ることはできない公開 [NAT ゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html) を設置することができます。

note
	このアプローチでは、エージェントのトラフィックが論理的にインターネットを経由してルーティングされることに注意してください。


c. 既存の TLS と [Sigv4](https://docs.aws.amazon.com/ja_jp/general/latest/gr/signature-version-4.html) メカニズムを超えてプライベートまたは安全な接続を確立する必要がない場合、最も簡単な選択肢は [インターネットゲートウェイ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Internet_Gateway.html) を設置して、エンドポイントへの接続を提供することです。

### オンプレミスまたは他のクラウド環境から

a. AWS 外で実行されているエージェントは、インターネット (独自のネットワーク設定経由) または Direct Connect [Public VIF](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) 経由で、CloudWatch のパブリックエンドポイントに接続を確立できます。

b. エージェントトラフィックがインターネットを経由しないことが必要な場合は、AWS PrivateLink によって実現される [VPC インターフェイスエンドポイント](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpce-interface.html) を利用して、Direct Connect Private VIF または VPN を使用してオンプレミスネットワークまでプライベート接続を拡張できます。トラフィックはインターネットに公開されず、脅威ベクトルが排除されます。

success
[AWS Systems Manager エージェント](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html) から取得した資格情報を使用して、CloudWatch エージェントで使用する [一時的な AWS アクセストークン](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) を追加できます。


[^1]: CloudWatch エージェントの使用とデプロイに関するガイダンスを提供するブログ [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) を参照してください。

[^2]: [オンプレミスおよび他のクラウド環境で実行されているエージェントの資格情報を設定するためのガイダンス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html)

[^3]: [CloudWatch エンドポイントへの接続を確認する方法](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html)

[^4]: [オンプレミス、プライベート接続に関するブログ](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: オブザーバビリティに関連するすべての AWS API の使用は、通常、[インスタンスプロファイル](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) によって行われます。これは、AWS 内で実行されているインスタンスやコンテナに一時的なアクセス資格情報を付与するメカニズムです。
