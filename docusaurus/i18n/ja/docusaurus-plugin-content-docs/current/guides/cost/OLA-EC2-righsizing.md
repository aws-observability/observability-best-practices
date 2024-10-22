# 既存の EC2 ワークロードのための OLA

## AWS OLA プログラム

[AWS Optimization and Licensing Assessment (AWS OLA)](https://aws.amazon.com/jp/optimization-and-licensing-assessment/) は、ワークロードをクラウドに移行し、リソースのコスト最適化を行うための最適なアプローチをお客様に提供します。
このプログラムは無料で提供されており、お客様の新規および既存のワークロードを分析し、オンプレミスおよびクラウド環境を評価して、リソース割り当て、サードパーティのライセンス、アプリケーションの依存関係を最適化し、リソース効率を高め、コンピューティング費用を節約できる可能性があります。

このプロセスで収集されたデータを基に、AWS OLA プログラムは、お客様がクラウドジャーニーおよび移行の意思決定に役立つ包括的なレポートを提供します。
このレポートでは、実際のリソース使用状況、既存のライセンス資格に基づいてデプロイオプションをモデル化し、柔軟なライセンスオプションを活用することで、潜在的なコスト削減を明らかにします。

AWS OLA プログラムを受けることのメリットは以下の通りです。

- ツールベースの発見アプローチにより、コンピューティングリソースの洞察を得て、各ワークロードに最適な Amazon Elastic Compute Cloud (Amazon EC2)、Amazon Relational Database Service (Amazon RDS)、または VMware Cloud on AWS インスタンスのサイズとタイプを特定し、**ワークロードのリソース割り当てを適正化**できます。
- クラウドインフラストラクチャを最適化することで、**コストを削減**できます。これは主要な側面の 1 つです。
- ライセンス付きインスタンスまたは BYOL インスタンスなど、ライセンスシナリオをモデル化することで、シーズナルワークロードの柔軟な管理やアジャイル実験を行い、**最適なライセンスオプションを検討**できるため、不要なライセンスコストを排除できます。

![OLA](../../images/OLA.png)

## AWS OLA for EEC2 ワークロード

AWS OLA (Optimization and Licensing Assessment) は、既存の EC2 ワークロードのコスト最適化に焦点を当てており、「**AWS OLA for EEC2**」と呼ばれています。これは、**Existing EC2 Workloads** 評価のための AWS OLA (Optimization and Licensing Assessment) です。

AWS OLA for EEC2 は、[AWS Compute Optimizer](https://aws.amazon.com/jp/compute-optimizer/) を活用し、[AWS Enterprise Support](https://aws.amazon.com/jp/premiumsupport/plans/enterprise/) プランに加入しているお客様に Amazon EC2 の適正化に関する推奨事項を提供します。OLA for EEC2 は、ストリームライン化されたプロセスを通じたセルフサービスのエンゲージメントで、AWS OLA チームが評価レポートとしての推奨事項を作成し、それぞれの AWS アカウントチームがお客様に Amazon EC2 の適正化とコスト最適化に関する調査結果を提示します。Amazon EC2 の適正化に関する推奨事項に加えて、AWS OLA は BYOL (Bring Your Own License) および License Included の Microsoft SQL Server インスタンスに対する Microsoft SQL Server の最適化戦略も提供します。OLA for EEC2 は、Amazon EC2 の適正化に加えて、1) Microsoft SQL Server on EC2 インスタンスの CPU 構成を最適化し、CPU の推奨値を下げること、2) 非運用サーバーで実行されているライセンス対象の SQL エディション (Enterprise/Standard) を無料の SQL Developer エディションにダウングレードすることで、Microsoft SQL Server の支出を削減する補足的な戦略を提示します。

評価を実行するために、AWS OLA for EEC2 プロセスではお客様の AWS アカウントから環境パラメータ (Amazon CloudWatch と CloudWatch エージェントを通じたメモリおよび CPU 使用率のメトリクスなど) を収集します。必要なパラメータが収集されると、AWS OLA チームは集約されたデータを使用して推奨事項を作成し、PowerPoint デッキと Excel レポートを AWS TAM およびアカウントチームに提示します。その後、このレポートはお客様に提示されます。このレポートで提供される洞察は、お客様が既存の Amazon EC2 の支出を最適化し、ワークロードのライセンス最適化戦略を検討するのに役立ちます。

## AWS OLA for EEC2 評価

エンタープライズサポートを契約している AWS 顧客は、既存の Amazon EC2 インスタンス (Linux と Windows) のコストを無料の最適化とライセンス評価 (OLA) で最適化できます。自分のワークロードに対して無料で AWS OLA for EEC2 評価を実施してもらうには、AWS アカウントチームにご連絡ください。

## Amazon CloudWatch のメモリメトリクスによる適切なサイジング

AWS OLA for EEC2 は Amazon EC2 のサイジング評価レポートを提供しますが、[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) の洞察により、お客様のリソースをより正確にサイジングするためにメモリ使用率メトリクスを組み込む価値が理解できます。そのため、AWS OLA for EEC2 プログラムと併せて Amazon CloudWatch のメモリメトリクスの監視を推奨・促進することで、お客様は AWS 環境のリソース最適化に関するより効果的な推奨を受け、ワークロードのリソース消費についてより広範な視点を得ることができます。これにより、ワークロードのコストを削減しパフォーマンスを向上させることができます。

Amazon EC2 インスタンスは、デフォルトで Amazon CloudWatch にいくつかのメトリクスを送信します。しかし、メモリメトリクスは Amazon EC2 が提供するデフォルトメトリクスには含まれていません。Amazon EC2 のメモリメトリクスを把握することで、EC2 インスタンスの現在のメモリ使用率を理解し、インスタンスが過小プロビジョニングまたは過剰プロビジョニングされていないことを確認できます。Amazon EC2 インスタンスの過小プロビジョニングは通常、システムまたはアプリケーションのパフォーマンスを低下させます。一方、過剰プロビジョニングは無駄な支出につながります。ビッグデータ分析、インメモリデータベース、リアルタイムストリーミングなどのメモリ負荷の高いアプリケーションでは、運用の可視性を得るためにインスタンスのメモリ使用率を監視する必要があります。

![CloudWatch Agent](../../images/cw-agent.png)

### Amazon EC2 インスタンスからのメモリメトリクスの収集

[Amazon EC2 インスタンス](https://aws.amazon.com/jp/ec2/)からメモリメトリクスを収集するには、以下の手順を実行します。

- AWS Identity and Access Management (IAM) で以下の権限を持つロールを作成します。
  - [Amazon Systems Manager](https://aws.amazon.com/jp/systems-manager/) で Amazon EC2 インスタンスを管理する権限。Amazon EC2 インスタンスが Systems Manager で管理されている場合に必要です。[AWS Systems Manager エージェント (SSM エージェント)](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html) は、インスタンスが AWS Systems Manager と通信し、Systems Manager Run Command を使ってインスタンスに対してリモートコマンドやスクリプトを実行できるようにするために、Amazon EC2 インスタンス上に必要です。AWS Systems Manager エージェント (SSM エージェント) は、Amazon Systems Manager サービスが EC2 インスタンスを管理インスタンスとして更新、管理、設定できるようにするために、Amazon EC2 インスタンス上にインストールされ実行される Amazon のソフトウェアです。SSM エージェントは Systems Manager サービスからリクエストを受け取り、それを処理し、ステータスと実行情報を Systems Manager サービスに送り返します。AWS Systems Manager エージェント (SSM エージェント) は、AWS が提供するいくつかの Amazon Machine Images (AMIs) にデフォルトでプリインストールされていることに注意してください。
  - CloudWatch エージェントウィザードを使用して CloudWatch エージェント設定ファイルを生成する場合は、オプションで Systems Manager Parameter Store を設定ファイルの安全な共通の保存場所として使用できます。その場合、CloudWatch エージェントには設定ファイルを書き込むための [Systems Manager Parameter Store](https://aws.amazon.com/jp/systems-manager/features/) への書き込み権限と、設定ファイルを読み込むための読み取り権限が必要です。
  - [CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)で Amazon CloudWatch にデータ (メトリクスとログ) を書き込む権限。
- 前の手順で作成した IAM ロールを割り当てて Amazon EC2 インスタンスを起動します。このIAMロールのトラストポリシーについては、付録 [1] を、AmazonSSMManagedInstanceCore、CloudWatchAgentAdminPolicy、CloudWatchAgentServerPolicy (JSON 形式の権限を含む) の Amazon 管理ポリシーについては、付録 [2] を参照してください。
- 必要な EC2 インスタンス (Windows または Linux) に [手動で](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)または [Systems Manager Run Command](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) を使用して CloudWatch エージェントをインストールします。
- CloudWatch エージェントを設定して、メモリメトリクスを収集し、Amazon CloudWatch に書き込みます。

![CloudWatch Metrics](../../images/cw-metrics.png)

- CloudWatch コンソールで収集した[メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)と[ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)を確認します。
- CloudWatch Logs Insights を使用してログデータを分析します。

![CloudWatch Metrics](../../images/ec2-cloudwatch-metrics.png)

### Amazon EC2 インスタンスからのメモリメトリクスの大規模な収集

以下の手順に従って、CloudWatch エージェントをインストールおよび構成し、1 つ以上の Amazon EC2 インスタンスから Amazon CloudWatch にシグナル (メトリクスとログ) を収集できます。

- Remote Desktop または SSH を使用して Amazon EC2 インスタンス (Windows または Linux) に接続します。CloudWatch エージェントの構成ファイルを準備するために 1 回のみ必要です。
- CloudWatch エージェント構成ウィザードを実行して、メトリクスとログの収集を設定します。
  - CPU、メモリ、ディスクなどのホストメトリクスを構成します。
  - オプションで監視するカスタムログファイル (IIS ログ、Apache ログなど) を追加します。
  - オプションで Windows イベントログを監視します。
  - 同じ構成を複数の Amazon EC2 インスタンスに適用できる場合は、Systems Manager Parameter Store に構成を保存します。
- Systems Manager Run Command を使用して、CloudWatch エージェント構成を他の EC2 インスタンスに適用します。[AmazonCloudWatch-ManageAgent](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html) Systems Manager コマンドドキュメントを使用すると、1 回の実行で複数の EC2 インスタンスの CloudWatch 構成を更新できます。

### Amazon EC2 インスタンスからのメモリメトリクス収集の自動化

以下の手順に従って、Amazon CloudWatch へのシグナル収集 (メトリクスとログ) を自動化、オーケストレーション、大規模に管理できます。[AWS CloudFormation](https://aws.amazon.com/jp/cloudformation/) テンプレートを使用して、以下のアクションを実行できます。

- Amazon EC2 インスタンスで代わりにランブックを実行できるように、Systems Manager 自動化に許可する IAM 実行ロールを作成します。
- CloudWatch エージェントが Amazon CloudWatch にデータ (メトリクスとログ) を書き込むための権限を持つ IAM ロールを設定します。
- Amazon EC2 インスタンスで CloudWatch エージェントをインストールして構成するための[カスタムランブック](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/automation-documents.html)を作成します。付録 [3] を参照してください。これは、CloudWatch エージェントをインストールし、デフォルトのメトリクスまたは Amazon Systems Manager Parameter Store のパラメータを使用して CloudWatch エージェントを構成するためのカスタムランブックドキュメントの例です。
- CloudWatch エージェント構成ファイルをシステムマネージャーパラメータストアにアップロードします。

### 参考資料

- [CloudWatch エージェントを使用して Amazon EC2 インスタンスからメトリクスとログを収集する](https://www.youtube.com/watch?v=vAnIhIwE5hY)
- [AWS Systems Manager を使用して Amazon EC2 インスタンスのメモリメトリクスを設定する](https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/)

### 付録

[1] **トラストポリシー** - Amazon EC2 がロールを引き受けるため

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

[2] [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) - AWS Systems Manager サービスのコア機能を有効にするための Amazon EC2 ロールの AWS 管理ポリシー。

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

[CloudWatchAgentAdminPolicy](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html) - AmazonCloudWatchAgent を使用するために必要な完全な権限を持つ Amazon 管理ポリシー

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

[CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/ja_jp/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) - サーバーで AmazonCloudWatchAgent を使用するために必要な完全な権限を持つ Amazon 管理ポリシー

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

[3] CloudWatch エージェントをインストールし、デフォルトのメトリクスまたは Amazon Systems Manager Parameter Store のパラメータを使用して CloudWatch エージェントを構成するために使用できるカスタムランブックドキュメントの例

```
#-------------------------------------------------
# Composite document and State Manager association to install and configure the Amazon CloudWatch agent
#-------------------------------------------------
InstallAndConfigureCloudWatchAgent:
Type: AWS::SSM::Document
Properties:
    Content:
    schemaVersion: '2.2'
    description: The InstallAndManageCloudWatch command document installs the Amazon CloudWatch agent and manages the configuration of the agent for Amazon EC2 instances.
    parameters:
        action:
        description: The action CloudWatch Agent should take.
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
        description: Controls platform-specific default behavior such as whether to include
            EC2 Metadata in metrics.
        type: String
        default: ec2
        allowedValues:
        - ec2
        - onPremise
        - auto
        optionalConfigurationSource:
        description: Only for 'configure' related actions. Use 'ssm' to apply a ssm parameter
            as config. Use 'default' to apply default config for amazon-cloudwatch-agent.
            Use 'all' with 'configure (remove)' to clean all configs for amazon-cloudwatch-agent.
        type: String
        allowedValues:
        - ssm
        - default
        - all
        default: ssm
        optionalConfigurationLocation:
        description: Only for 'configure' related actions. Only needed when Optional Configuration
            Source is set to 'ssm'. The value should be a ssm parameter name.
        type: String
        default: ''
        allowedPattern: '[a-zA-Z0-9-"~:_@./^(*)!<>?=+]*$'
        optionalRestart:
        description: Only for 'configure' related actions. If 'yes', restarts the agent
            to use the new configuration. Otherwise the new config will only apply on the
            next agent restart.
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
