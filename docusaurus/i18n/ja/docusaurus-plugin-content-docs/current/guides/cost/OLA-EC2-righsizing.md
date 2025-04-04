# 既存の EC2 ワークロードのための OLA




## AWS OLA プログラム

[AWS Optimization and Licensing Assessment (AWS OLA)](https://aws.amazon.com/jp/optimization-and-licensing-assessment/) は、お客様がワークロードをクラウドに移行し、リソースのコストを最適化するための最適なアプローチを提供します。これは無償のプログラムで、新規および既存のワークロードを分析し、オンプレミスおよびクラウド環境を評価して、リソースの割り当て、サードパーティライセンス、アプリケーションの依存関係を最適化し、リソース効率を向上させ、コンピューティングコストの削減を支援することを目的としています。

このプロセスで収集されたデータを通じて、AWS OLA プログラムは包括的なレポートを提供し、お客様はクラウドジャーニーと移行に関する十分な情報に基づいた意思決定を行うことができます。このレポートは、実際のリソース使用状況、既存のライセンス権利に基づいてデプロイメントオプションをモデル化し、柔軟なライセンスオプションを通じて潜在的なコスト削減を発見するのに役立ちます。

AWS OLA プログラムを利用する利点には以下が含まれます：

- ツールベースの調査アプローチによる **リソース割り当ての適正化** を行い、コンピューティングリソースに関する洞察を提供し、各ワークロードに最適な Amazon Elastic Compute Cloud (Amazon EC2)、Amazon Relational Database Service (Amazon RDS)、または VMware Cloud on AWS インスタンスのサイズとタイプを特定するのに役立ちます。
- クラウドインフラストラクチャを最適化することで、重要な側面の 1 つである **コストの削減** を実現します。
- ライセンス込みインスタンスや BYOL インスタンスを含むライセンスシナリオをモデル化し、季節的なワークロードとアジャイルな実験の柔軟性を確保し、**最適化されたライセンスオプションを検討** して、不要なライセンスコストを削減します。

![OLA](../../images/OLA.png)




## EC2 ワークロード向け AWS OLA

AWS OLA (最適化とライセンス評価) は、**既存の EC2 ワークロード** の評価である「**EC2 向け AWS OLA**」- **既存の EC2 ワークロード** 向け AWS OLA (最適化とライセンス評価) に焦点を当てています。

EC2 向け AWS OLA は、[AWS Enterprise Support](https://aws.amazon.com/jp/premiumsupport/plans/enterprise/) プランに加入しているお客様に Amazon EC2 のライトサイジングの推奨事項を提供するために [AWS Compute Optimizer](https://aws.amazon.com/jp/compute-optimizer/) を活用します。
EC2 向け AWS OLA は、合理化されたプロセスを通じたセルフサービス型のエンゲージメントです。
AWS OLA チームが評価レポートとして推奨事項を準備し、AWS アカウントチームがそれらの結果を Amazon EC2 のライトサイジングとコスト最適化のためにお客様に提示します。
Amazon EC2 のライトサイジング推奨事項に加えて、AWS OLA は BYOL (Bring Your Own License) および License Included の Microsoft SQL Server インスタンスに対する Microsoft SQL Server の最適化戦略も提供します。
EC2 向け AWS OLA は、1) CPU 使用率が低い推奨事項を持つ EC2 インスタンス上の Microsoft SQL Server の CPU 構成を最適化し、2) ライセンスが必要な SQL エディション (Enterprise/Standard) で実行されている非本番サーバーを無料の SQL Developer エディションにダウングレードすることで、Microsoft SQL Server の支出を削減する Amazon EC2 ライトサイジングの補完的な戦略を提示します。

評価を実行するために、EC2 向け AWS OLA プロセスは、メモリと CPU 使用率 (Amazon CloudWatch と CloudWatch エージェントを通じて) などのメトリクスを含む、お客様の AWS アカウントから環境パラメータを収集します。
必要なパラメータが収集されると、AWS OLA チームは集計されたデータを使用して推奨事項を準備し、後でお客様に提示できる PowerPoint デッキと Excel レポートを AWS TAM とアカウントチームに提示します。
レポートによって提供されるインサイトは、お客様が既存の Amazon EC2 の支出を最適化し、ワークロードのライセンス最適化戦略を検討するのに役立ちます。



## AWS OLA による既存 EC2 評価

エンタープライズサポートをご利用の AWS のお客様は、既存の Amazon EC2 インスタンス (Linux および Windows) のコストを、既存の EC2 ワークロードに対する最適化およびライセンス評価 (OLA) を無料で受けることで最適化できます。
ワークロードに対する AWS OLA による EC2 評価を無料で実施するには、AWS のアカウントチームにお問い合わせください。




## 正確なリソースサイジングのための Amazon CloudWatch メモリメトリクス

AWS OLA for EEC2 は Amazon EC2 のリソースサイジングのための評価レポートを提供しますが、[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) が提供するインサイトは、より正確なリソースサイジングのためにメモリ使用率メトリクスを組み込む価値を理解しています。

そのため、AWS OLA for EEC2 プログラムと共に Amazon CloudWatch メモリメトリクスのモニタリングを推奨・促進することで、お客様は AWS 環境により効果的なリソース最適化の推奨事項を得ることができ、ワークロードのリソース消費についてより広い視点を得ることができます。

これにより、ワークロードのコスト削減とパフォーマンスの向上を実現できます。

Amazon EC2 インスタンスは、デフォルトで複数のメトリクスを Amazon CloudWatch に送信します。
しかし、メモリメトリクスは Amazon EC2 が提供するデフォルトのメトリクスには含まれていません。
Amazon EC2 のメモリメトリクスを把握することで、EC2 インスタンスの現在のメモリ使用率を理解し、インスタンスのプロビジョニング不足や過剰プロビジョニングを防ぐことができます。
Amazon EC2 インスタンスのプロビジョニング不足は、システムやアプリケーションのパフォーマンスを低下させる一方、過剰プロビジョニングは無駄な支出を生みます。
ビッグデータ分析、インメモリデータベース、リアルタイムストリーミングなどのメモリを大量に使用するアプリケーションでは、運用の可視性を確保するためにインスタンスのメモリ使用率を監視する必要があります。

![CloudWatch Agent](../../images/cw-agent.png)



### Amazon EC2 インスタンスからのメモリメトリクスの収集

[Amazon EC2 インスタンス](https://aws.amazon.com/jp/ec2/) からメモリメトリクスを収集するための手順の概要は以下の通りです。

- AWS Identity and Access Management (IAM) でロールを作成し、以下の権限を付与します：
  - [Amazon Systems Manager](https://aws.amazon.com/jp/systems-manager/) で Amazon EC2 インスタンスを管理するための権限。これは Amazon EC2 インスタンスが Systems Manager で管理されている場合に必要です。[AWS Systems Manager Agent (SSM Agent)](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html) は、インスタンスが AWS Systems Manager と通信し、Systems Manager Run Command を EC2 インスタンスで実行するなど、リモートコマンドやスクリプトの実行を可能にするために必要です。AWS Systems Manager Agent (SSM Agent) は、Amazon EC2 インスタンスにインストールされて実行される Amazon のソフトウェアで、Amazon Systems Manager サービスが EC2 インスタンスを管理対象インスタンスとして更新、管理、設定することを可能にします。SSM エージェントは Systems Manager サービスからリクエストを受け取り、それを処理し、ステータスと実行情報を Systems Manager サービスに送り返します。なお、AWS Systems Manager Agent (SSM Agent) は、AWS が提供する一部の [Amazon Machine Images (AMIs)](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ami-preinstalled-agent.html) にデフォルトでプリインストールされています。
  - CloudWatch エージェントウィザードを使用して CloudWatch エージェント設定ファイルを生成する場合、オプションとして Systems Manager Parameter Store を設定ファイルを保存する安全な共通の場所として使用できます。その場合、CloudWatch エージェントは設定ファイルを書き込むための書き込みアクセス権と、設定ファイルを読み取るための読み取りアクセス権を [Systems Manager Parameter Store](https://aws.amazon.com/jp/systems-manager/features/) に対して持つ必要があります。
  - [CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) がデータ（メトリクスとログ）を Amazon CloudWatch に書き込むための権限。
- Amazon EC2 インスタンスを起動し、先ほど作成した IAM ロールを割り当てます。この IAM ロールについては、以下の付録 [1] の信頼ポリシーと、付録 [2] の Amazon マネージドポリシー（AmazonSSMManagedInstanceCore、CloudWatchAgentAdminPolicy、CloudWatchAgentServerPolicy）を参照してください（JSON 形式での権限を含む）。
- 必要な EC2 インスタンス（Windows または Linux）に CloudWatch エージェントを [手動で](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html) または [Systems Manager Run Command を使用して](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) インストールします。
- CloudWatch エージェントを設定してメモリメトリクスを収集し、Amazon CloudWatch に書き込みます。

![CloudWatch Metrics](../../images/cw-metrics.png)

- CloudWatch コンソールで収集された [メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) と [ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を表示します。
- CloudWatch Logs Insights を使用してログデータを分析します。

![CloudWatch Metrics](../../images/ec2-cloudwatch-metrics.png)



### Amazon EC2 インスタンスからのメモリメトリクスの大規模な収集

以下の手順に従って、1 つまたは複数の Amazon EC2 インスタンスに CloudWatch エージェントをインストールし、Amazon CloudWatch へのシグナル収集（メトリクスとログ）を設定します。

- リモートデスクトップまたは SSH を使用して Amazon EC2 インスタンス（Windows または Linux）に接続します。これは CloudWatch エージェント設定ファイルを準備するために 1 回必要です。
- CloudWatch エージェント設定ウィザードを実行して、メトリクスとログの収集を設定します
  - CPU、メモリ、ディスクなどのホストメトリクスを設定します
  - 必要に応じて、監視するカスタムログファイル（IIS ログ、Apache ログなど）を追加します
  - 必要に応じて Windows イベントログを監視します
  - 同じ設定を他の Amazon EC2 インスタンスに適用する場合は、Systems Manager パラメータストアに設定を保存します
- Systems Manager Run Command を使用して、他の EC2 インスタンスに CloudWatch エージェント設定を適用します。[AmazonCloudWatch-ManageAgent](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html) Systems Manager コマンドドキュメントを使用すると、1 回の実行で複数の EC2 インスタンスの CloudWatch 設定を更新できます。



### Amazon EC2 インスタンスからのメモリメトリクス収集の自動化

以下の手順に従って、Amazon CloudWatch へのシグナル収集（メトリクスとログ）を自動化、オーケストレーション、大規模に管理することができます。[AWS CloudFormation](https://aws.amazon.com/jp/cloudformation/) テンプレートを使用して、以下のアクションを実行できます。

- Systems Manager オートメーションがお客様に代わって Amazon EC2 インスタンス上でランブックを実行できるようにする IAM 実行ロールを作成します。
- CloudWatch エージェントが Amazon CloudWatch にデータ（メトリクスとログ）を書き込むための権限を持つ IAM ロールを設定します。
- Amazon EC2 インスタンスに CloudWatch エージェントをインストールして設定する[カスタムランブック](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/automation-documents.html)を作成します。下記の付録 [3] を参照してください。これは、デフォルトのメトリクスまたは Amazon Systems Manager パラメータストアのパラメータを使用して CloudWatch エージェントをインストールおよび設定するために使用できるカスタムランブックドキュメントの例です。
- CloudWatch エージェント設定ファイルを Systems Manager パラメータストアにアップロードします。



### 参考資料

- [CloudWatch エージェントを使用して Amazon EC2 インスタンスからメトリクスとログを収集する](https://www.youtube.com/watch?v=vAnIhIwE5hY)
- [AWS Systems Manager を使用して Amazon EC2 インスタンスのメモリメトリクスを設定する](https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/)




### 付録

[1] Amazon EC2 がロールを引き受けるための **信頼ポリシー**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["sts:AssumeRole"],
      "Principal": {
        "Service": ["ec2.amazonaws.com"]
      }
    }
  ]
}
```

[2] [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) - AWS Systems Manager サービスのコア機能を有効にするための Amazon EC2 ロール用の AWS マネージドポリシー。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:DescribeAssociation",
        "ssm:GetDeployablePatchSnapshotForInstance",
        "ssm:GetDocument",
        "ssm:DescribeDocument",
        "ssm:GetManifest",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:ListAssociations",
        "ssm:ListInstanceAssociations",
        "ssm:PutInventory",
        "ssm:PutComplianceItems",
        "ssm:PutConfigurePackageResult",
        "ssm:UpdateAssociationStatus",
        "ssm:UpdateInstanceAssociationStatus",
        "ssm:UpdateInstanceInformation"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2messages:AcknowledgeMessage",
        "ec2messages:DeleteMessage",
        "ec2messages:FailMessage",
        "ec2messages:GetEndpoint",
        "ec2messages:GetMessages",
        "ec2messages:SendReply"
      ],
      "Resource": "*"
    }
  ]
}
```

[CloudWatchAgentAdminPolicy](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html) - AmazonCloudWatchAgent を使用するために必要な完全な権限を持つ Amazon マネージドポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CWACloudWatchPermissions",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "ec2:DescribeTags",
        "logs:PutLogEvents",
        "logs:PutRetentionPolicy",
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups",
        "logs:CreateLogStream",
        "logs:CreateLogGroup",
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords",
        "xray:GetSamplingRules",
        "xray:GetSamplingTargets",
        "xray:GetSamplingStatisticSummaries"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CWASSMPermissions",
      "Effect": "Allow",
      "Action": ["ssm:GetParameter", "ssm:PutParameter"],
      "Resource": "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"
    }
  ]
}
```

[CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) - サーバー上で AmazonCloudWatchAgent を使用するために必要な完全な権限を持つ Amazon マネージドポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CWACloudWatchServerPermissions",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "ec2:DescribeVolumes",
        "ec2:DescribeTags",
        "logs:PutLogEvents",
        "logs:PutRetentionPolicy",
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups",
        "logs:CreateLogStream",
        "logs:CreateLogGroup",
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords",
        "xray:GetSamplingRules",
        "xray:GetSamplingTargets",
        "xray:GetSamplingStatisticSummaries"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CWASSMServerPermissions",
      "Effect": "Allow",
      "Action": ["ssm:GetParameter"],
      "Resource": "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"
    }
  ]
}
```

[3] デフォルトのメトリクスまたは Amazon Systems Manager パラメータストアのパラメータを使用して、CloudWatch エージェントをインストールおよび設定するために使用できるカスタムランブックドキュメントの例

```



#-------------------------------------------------



# Amazon CloudWatch エージェントをインストールおよび設定するための複合ドキュメントと State Manager アソシエーション



#-------------------------------------------------
InstallAndConfigureCloudWatchAgent:
Type: AWS::SSM::Document
Properties:
    Content:
    schemaVersion: '2.2'
    description: InstallAndManageCloudWatch コマンドドキュメントは、Amazon CloudWatch エージェントをインストールし、Amazon EC2 インスタンスのエージェント設定を管理します。
    parameters:
        action:
        description: CloudWatch エージェントが実行すべきアクション。
        type: String
        default: configure
        allowedValues:
        - configure
        - configure (append)
        - configure (remove)
        - start
        - status
        - stop
        mode:
        description: メトリクスに EC2 メタデータを含めるかどうかなど、プラットフォーム固有のデフォルト動作を制御します。
        type: String
        default: ec2
        allowedValues:
        - ec2
        - onPremise
        - auto
        optionalConfigurationSource:
        description: 'configure' 関連のアクションのみに使用します。'ssm' を使用して ssm パラメータを設定として適用します。'default' を使用して amazon-cloudwatch-agent のデフォルト設定を適用します。'configure (remove)' と共に 'all' を使用して、amazon-cloudwatch-agent のすべての設定をクリーンアップします。
        type: String
        allowedValues:
        - ssm
        - default
        - all
        default: ssm
        optionalConfigurationLocation:
        description: 'configure' 関連のアクションのみに使用します。オプション設定ソースが 'ssm' に設定されている場合のみ必要です。値は ssm パラメータ名である必要があります。
        type: String
        default: ''
        allowedPattern: '[a-zA-Z0-9-"~:_@./^(*)!<>?=+]*$'
        optionalRestart:
        description: 'configure' 関連のアクションのみに使用します。'yes' の場合、新しい設定を使用するためにエージェントを再起動します。それ以外の場合、新しい設定は次回のエージェント再起動時にのみ適用されます。
        type: String
        default: 'yes'
        allowedValues:
        - 'yes'
        - 'no'
    mainSteps:
    - inputs:
        documentParameters:
            name: AmazonCloudWatchAgent
            action: Install
        documentType: SSMDocument
        documentPath: AWS-ConfigureAWSPackage
        name: installCWAgent
        action: aws:runDocument
    - inputs:
        documentParameters:
            mode: '{{mode}}'
            optionalRestart: '{{optionalRestart}}'
            optionalConfigurationSource: '{{optionalConfigurationSource}}'
            optionalConfigurationLocation: '{{optionalConfigurationLocation}}'
            action: '{{action}}'
        documentType: SSMDocument
        documentPath: AmazonCloudWatch-ManageAgent
        name: manageCWAgent
        action: aws:runDocument
    DocumentFormat: YAML
    DocumentType: Command
    TargetType: /AWS::EC2::Instance

CloudWatchAgentAssociation:
Type: AWS::SSM::Association
Properties:
    AssociationName: InstallCloudWatchAgent
    Name: !Ref InstallAndConfigureCloudWatchAgent
    ScheduleExpression: rate(7 days)
    Targets:
    - Key: tag:Platform
    Values:
    - Linux
    WaitForSuccessTimeoutSeconds: 300
```
