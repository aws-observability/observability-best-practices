# 既存の EC2 ワークロードの OLA

## AWS OLA プログラム

[AWS Optimization and Licensing Assessment (AWS OLA)](https://aws.amazon.com/optimization-and-licensing-assessment/) は、ワークロードをクラウドに移行し、リソースをコスト最適化するための最適なアプローチをお客様に提供します。これは、お客様が新規および既存のワークロードを分析し、オンプレミスおよびクラウド環境を評価してリソース割り当て、サードパーティライセンス、アプリケーションの依存関係を最適化し、リソース効率を向上させ、コンピューティング支出を削減できる可能性がある無償のプログラムです。

このプロセスで収集されたデータを通じて、AWS OLA プログラムは、お客様がクラウドジャーニーと移行について情報に基づいた意思決定を行うために使用できる包括的なレポートを提供します。このレポートは、実際のリソース使用状況、既存のライセンス権利に基づいてデプロイオプションをモデル化し、お客様が柔軟なライセンスオプションを通じて潜在的なコスト削減を発見できるよう支援します。

AWS OLA プログラムを受けることのメリットは以下のとおりです。

- ツールベースの検出アプローチにより、ワークロードの**リソース割り当てを適正化**します。このアプローチは、コンピューティングリソースに関する洞察を提供し、各ワークロードに最適な Amazon Elastic Compute Cloud (Amazon EC2)、Amazon Relational Database Service (Amazon RDS)、または VMware Cloud on AWS のインスタンスサイズとタイプを特定するのに役立ちます。
- クラウドインフラストラクチャを最適化することで**コストを削減**します。これは重要な側面の 1 つです。
- ライセンス込みインスタンスまたは BYOL インスタンスを含むライセンスシナリオをモデル化し、季節的なワークロードの管理とアジャイルな実験において柔軟性を提供することで、**最適化されたライセンスオプションを検討**し、不要なライセンスコストを削減します。

![OLA](../../images/OLA.png)

## EEC2 ワークロード向け AWS OLA

AWS OLA (Optimization and Licensing Assessment) は、既存の EC2 ワークロードのコスト最適化に焦点を当てており、'**AWS OLA for EEC2**' - AWS OLA (Optimization and Licensing Assessment) for **Existing EC2 Workloads** アセスメントと呼ばれています。

AWS OLA for EEC2 は、[AWS Compute Optimizer](https://aws.amazon.com/compute-optimizer/) を活用して、[AWS Enterprise Support](https://aws.amazon.com/premiumsupport/plans/enterprise/) プランに登録しているお客様に Amazon EC2 のライトサイジング推奨事項を提供します。OLA for EEC2 は、合理化されたプロセスを通じたセルフサービス型のエンゲージメントであり、AWS OLA チームが評価レポートとして推奨事項を準備し、それぞれの AWS アカウントチームがそれらの調査結果をお客様に提示して、Amazon EC2 のライトサイジングとコスト最適化を行います。Amazon EC2 のライトサイジング推奨事項に加えて、AWS OLA は BYOL (Bring Your Own License) およびライセンス込み Microsoft SQL Server インスタンスに対する Microsoft SQL Server 最適化戦略も提供します。OLA for EEC2 は、1) CPU 推奨値が低い EC2 インスタンス上の Microsoft SQL Server で CPU 構成を最適化し、2) ライセンス可能な SQL エディション (Enterprise/Standard) を実行している非本番サーバーを無料の SQL Developer エディションにダウングレードすることで、Microsoft SQL Server の支出を削減する Amazon EC2 ライトサイジングの補足戦略を提示します。

アセスメントを実行するために、AWS OLA for EEC2 プロセスは、お客様の AWS アカウントから環境パラメータを収集します。これには、メモリや CPU 使用率などのメトリクス (Amazon CloudWatch と CloudWatch エージェントを通じて) が含まれます。必要なパラメータが収集されると、AWS OLA チームは集約されたデータを使用して推奨事項を準備し、PPT デッキと Excel レポートを AWS TAM とアカウントチームに提示します。これは後でお客様に提示できます。レポートが提供するインサイトは、お客様が既存の Amazon EC2 支出を最適化し、ワークロードのライセンス最適化戦略を検討するのに役立ちます。

## EEC2 評価のための AWS OLA

Enterprise Support をご利用の AWS のお客様は、既存の Amazon EC2 インスタンス (Linux および Windows) のコストを、既存の EC2 ワークロード向けの無償の最適化およびライセンス評価 (OLA) で最適化できます。お客様のワークロードに対して AWS OLA for EC2 評価を無償で実施するには、AWS アカウントチームにお問い合わせください。

## 正確なライトサイジングのための Amazon CloudWatch メモリメトリクス

AWS OLA for EEC2 は Amazon EC2 のライトサイジングに関する評価レポートを提供しますが、[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) が提供するインサイトは、お客様のリソースをより正確にライトサイジングするためにメモリ使用率メトリクスを組み込むことの価値を理解しています。したがって、AWS OLA for EEC2 プログラムと併せて Amazon CloudWatch メモリメトリクスのモニタリングを推奨および促進することで、お客様は AWS 環境に対してより効果的なリソース最適化の推奨事項を取得でき、ワークロードのリソース消費に関するより広範な視点も得られます。これにより、コストを削減し、ワークロードのパフォーマンスを向上させることができます。

Amazon EC2 インスタンスは、デフォルトでいくつかのメトリクスを Amazon CloudWatch に送信します。ただし、メモリメトリクスは Amazon EC2 が提供するデフォルトのメトリクスには含まれていません。Amazon EC2 のメモリメトリクスを把握することで、EC2 インスタンスの現在のメモリ使用率を理解し、インスタンスのプロビジョニング不足やプロビジョニング過剰を防ぐことができます。Amazon EC2 インスタンスのプロビジョニング不足は、通常、システムやアプリケーションのパフォーマンスを低下させ、プロビジョニング過剰は無駄な支出につながります。ビッグデータ分析、インメモリデータベース、リアルタイムストリーミングなどのメモリ負荷の高いアプリケーションでは、運用の可視性を確保するために、インスタンスのメモリ使用率を監視する必要があります。

![CloudWatch Agent](../../images/cw-agent.png)

### Amazon EC2 インスタンスからのメモリメトリクスの収集

[Amazon EC2 インスタンス](https://aws.amazon.com/ec2/)からメモリメトリクスを収集するには、以下の手順を高レベルで示します。

- AWS Identity and Access Management (IAM) でロールを作成し、以下の権限を付与します。
  - Amazon EC2 インスタンスが Systems Manager によって管理されている場合に必要な、[Amazon Systems Manager](https://aws.amazon.com/systems-manager/) が Amazon EC2 インスタンスを管理するための権限。[AWS Systems Manager Agent (SSM Agent)](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) は、インスタンスが AWS Systems Manager と通信し、EC2 インスタンスに対して Systems Manager Run Command を実行するなど、インスタンスに対してリモートコマンドやスクリプトを実行できるようにするために、Amazon EC2 インスタンスに必要です。AWS Systems Manager Agent (SSM Agent) は、Amazon EC2 インスタンスにインストールされて実行される Amazon のソフトウェアで、Amazon Systems Manager サービスが EC2 インスタンスをマネージドインスタンスとして更新、管理、設定できるようにします。SSM エージェントは Systems Manager サービスからリクエストを受信し、それらを処理して、ステータスと実行情報を Systems Manager サービスに送り返します。なお、AWS Systems Manager Agent (SSM Agent) は、AWS が提供する[一部の Amazon マシンイメージ (AMI) にデフォルトでプリインストール](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html)されています。
  - CloudWatch エージェントウィザードを使用して CloudWatch エージェント設定ファイルを生成する場合、オプションで Systems Manager Parameter Store を安全な共通の場所として使用し、設定ファイルを保存して後で取得できます。その場合、CloudWatch Agent は設定ファイルを書き込むための [Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) への書き込みアクセス権と、設定ファイルを読み取るための読み取りアクセス権が必要です。
  - [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) が Amazon CloudWatch にデータ (メトリクスとログ) を書き込むための権限
- Amazon EC2 インスタンスを起動し、前の手順で作成した IAM ロールを割り当てます。この IAM ロールについては、信頼ポリシーは以下の付録 [1]、使用できる Amazon マネージドポリシー - AmazonSSMManagedInstanceCore、CloudWatchAgentAdminPolicy、CloudWatchAgentServerPolicy (JSON 形式の権限を含む) については付録 [2] を参照してください。
- 必要な EC2 インスタンス (Windows または Linux) に CloudWatch エージェントを[手動で](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、または [Systems Manager Run Command を使用して](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)インストールします。
- CloudWatch エージェントを設定して、メモリメトリクスを収集し、Amazon CloudWatch に書き込むようにします。

![CloudWatch Metrics](../../images/cw-metrics.png)

- CloudWatch コンソールで収集された[メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)と[ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)を表示します。
- CloudWatch Logs Insights を使用してログデータを分析します

![CloudWatch Metrics](../../images/ec2-cloudwatch-metrics.png)

### 大規模な Amazon EC2 インスタンスからのメモリメトリクスの収集

以下の手順に従って、1 つ以上の Amazon EC2 インスタンスに CloudWatch エージェントをインストールし、Amazon CloudWatch へのシグナル収集 (メトリクスとログ) を設定できます。

- Remote Desktop または SSH を使用して Amazon EC2 インスタンス (Windows または Linux) に接続します。CloudWatch エージェント設定ファイルを準備するために一度必要です。
- CloudWatch エージェント設定ウィザードを実行して、メトリクスとログの収集を設定します
  - CPU、メモリ、ディスクなどのホストメトリクスを設定します
  - オプションで監視するカスタムログファイルを追加します (例: IIS ログ、Apache ログ)
  - オプションで Windows イベントログを監視します
  - 同じ設定を他の Amazon EC2 インスタンスに適用できる場合は、設定を Systems Manager Parameter Store に保存します。
- Systems Manager Run Command を使用して、CloudWatch エージェント設定を他の EC2 インスタンスに適用します。[AmazonCloudWatch-ManageAgent](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html#store-cloudwatch-configuration-s3) Systems Manager Command ドキュメントを使用すると、1 回の実行で複数の EC2 インスタンスの CloudWatch 設定を更新できます。

### Amazon EC2 インスタンスからのメモリメトリクス収集の自動化

以下の手順に従って、Amazon CloudWatch へのシグナル収集（メトリクスとログ）の自動化、オーケストレーション、および大規模な管理を行うことができます。[AWS CloudFormation](https://aws.amazon.com/cloudformation/) テンプレートを使用して、以下のアクションを実行できます

- Systems Manager オートメーションがユーザーに代わって Amazon EC2 インスタンスでランブックを実行できるようにする IAM 実行ロールを作成します。
- CloudWatch エージェントが Amazon CloudWatch にデータ (メトリクスとログ) を書き込むための権限を持つ IAM ロールを設定します。
- Amazon EC2 インスタンスに CloudWatch エージェントをインストールして設定するための[カスタムランブック](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html)を構築します。以下の付録 [3] を参照してください。CloudWatch エージェントをインストールし、デフォルトのメトリクスまたは Amazon Systems Manager Parameter Store のパラメータを使用して CloudWatch エージェントを設定するために使用できるカスタムランブックドキュメントの例が記載されています。
- CloudWatch エージェント設定ファイルを Systems Manager パラメータストアにアップロードします。

### 参考資料

- [CloudWatch エージェントを使用して Amazon EC2 インスタンスからメトリクスとログを収集する](https://www.youtube.com/watch?v=vAnIhIwE5hY)
- [AWS Systems Manager を使用して Amazon EC2 インスタンスのメモリメトリクスをセットアップする](https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/)

### 付録

[1] Amazon EC2 がロールを引き受けるための**信頼ポリシー**

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

[2][AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) - AWS Systems Manager サービスのコア機能を有効にするための Amazon EC2 ロール用 AWS マネージドポリシー。

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

[CloudWatchAgentAdminPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html) - AmazonCloudWatchAgent の使用に必要なすべてのアクセス許可を持つ Amazon マネージドポリシー

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

[CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) - サーバーで AmazonCloudWatchAgent を使用するために必要なすべてのアクセス許可を持つ Amazon マネージドポリシー

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

[3] CloudWatch Agent をインストールし、デフォルトのメトリクスまたは Amazon Systems Manager Parameter Store のパラメータを使用して CloudWatch Agent を設定するために使用できるカスタム Runbook ドキュメントの例

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
