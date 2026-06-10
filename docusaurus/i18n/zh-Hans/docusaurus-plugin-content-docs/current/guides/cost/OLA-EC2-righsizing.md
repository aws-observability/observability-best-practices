# 现有 EC2 工作负载的 OLA

## AWS OLA 计划

[AWS Optimization and Licensing Assessment (AWS OLA)](https://aws.amazon.com/optimization-and-licensing-assessment/) 为客户提供迁移工作负载到云端和优化资源成本的最佳方法。这是一项免费计划，旨在帮助客户分析其新的和现有的工作负载，评估其本地和云环境以优化资源分配、第三方许可和应用程序依赖关系，从而提高资源效率并可能节省计算支出。

通过在此过程中收集的数据，AWS OLA 计划提供一份综合报告，客户可以使用该报告为其云旅程和迁移做出明智的决策。该报告根据实际资源使用情况、现有许可权益对部署选项进行建模，帮助客户通过我们灵活的许可选项发现潜在的成本节约。

参与 AWS OLA 计划的好处包括：

- **合理调整资源分配** — 通过基于工具的发现方法为您的工作负载提供计算资源见解，帮助确定每个工作负载的最佳 Amazon Elastic Compute Cloud (Amazon EC2)、Amazon Relational Database Service (Amazon RDS) 或 VMware Cloud on AWS 实例大小和类型。
- **降低成本** — 优化云基础设施是关键方面之一。
- 对许可场景进行建模，包括许可包含或 BYOL 实例，以灵活管理季节性工作负载和敏捷实验，**探索优化的许可选项**，从而消除不必要的许可成本。

![OLA](../../images/OLA.png)

## 现有 EC2 工作负载的 AWS OLA

AWS OLA (Optimization and Licensing Assessment) 专注于优化现有 EC2 工作负载的成本，称为 '**AWS OLA for EEC2**' — 即针对**现有 EC2 工作负载**的 AWS OLA (Optimization and Licensing Assessment) 评估。

AWS OLA for EEC2 利用 [AWS Compute Optimizer](https://aws.amazon.com/compute-optimizer/) 为加入 [AWS Enterprise Support](https://aws.amazon.com/premiumsupport/plans/enterprise/) 计划的客户提供 Amazon EC2 合理调整建议。OLA for EEC2 是通过简化流程的自助服务参与，其中 AWS OLA 团队将建议准备为评估报告，相应的 AWS 账户团队将这些发现呈现给客户以进行 Amazon EC2 合理调整和成本优化。除了 Amazon EC2 合理调整建议外，AWS OLA 还为 BYOL（自带许可）和许可包含的 Microsoft SQL Server 实例提供 Microsoft SQL Server 优化策略。OLA for EEC2 通过以下方式提供补充 Amazon EC2 合理调整的策略以减少 Microsoft SQL Server 支出：1) 优化具有较低 CPU 建议的 Microsoft SQL Server on EC2 实例上的 CPU 配置；2) 将运行可许可 SQL 版本（Enterprise/Standard）的非生产服务器降级为免费的 SQL Developer 版本。

为执行评估，AWS OLA for EEC2 流程从客户的 AWS 账户收集环境参数，包括内存和 CPU 利用率等 metrics（通过 Amazon CloudWatch 和 CloudWatch agent）。收集所需参数后，AWS OLA 团队使用聚合数据准备建议，并向 AWS TAM 和账户团队呈现 PPT 演示文稿和 Excel 报告，随后可以呈现给客户。报告提供的见解帮助客户优化其现有的 Amazon EC2 支出，并探索其工作负载的许可优化策略。

## AWS OLA for EEC2 评估

任何拥有 Enterprise Support 的 AWS 客户都可以通过免费的 Optimization and Licensing Assessment (OLA) for Existing EC2 Workloads 来优化其现有的 Amazon EC2 实例（Linux 和 Windows）成本。要为您的工作负载免费执行 AWS OLA for EEC2 评估，请联系您的 AWS 账户团队。

## Amazon CloudWatch 内存 metrics 实现准确的合理调整

虽然 AWS OLA for EEC2 提供了 Amazon EC2 合理调整的评估报告，但 [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) 提供的见解表明，结合内存利用率 metrics 对于更准确地合理调整客户资源具有重要价值。因此，通过鼓励和促进 Amazon CloudWatch 内存 metrics 监控以及 AWS OLA for EEC2 计划，客户可以为其 AWS 环境获得更有影响力的资源优化建议，同时也获得工作负载资源消耗的更广泛视角。这有助于您降低成本并提高工作负载的性能。

Amazon EC2 实例默认向 Amazon CloudWatch 发送多种 metrics。然而，内存 metrics 不是 Amazon EC2 提供的默认 metrics 之一。了解 Amazon EC2 的内存 metrics 有助于了解 EC2 实例的当前内存利用率，以确保实例既不会配置不足也不会过度配置。Amazon EC2 实例配置不足通常会损害系统或应用程序的性能，而过度配置则会导致浪费性支出。内存密集型应用程序（如大数据分析、内存数据库、实时流处理）要求您监控实例上的内存利用率以获得运维可见性。

![CloudWatch Agent](../../images/cw-agent.png)

### 从 Amazon EC2 实例收集内存 metrics

要从 [Amazon EC2 实例](https://aws.amazon.com/ec2/) 收集内存 metrics，以下是高级步骤。

- 在 AWS Identity and Access Management (IAM) 中创建具有以下权限的角色：
  - [Amazon Systems Manager](https://aws.amazon.com/systems-manager/) 管理 Amazon EC2 实例的权限（如果 Amazon EC2 实例由 Systems Manager 管理）。[AWS Systems Manager Agent (SSM Agent)](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) 需要安装在 Amazon EC2 实例上，以允许实例与 AWS Systems Manager 通信并支持远程命令和脚本执行，如在 EC2 实例上代表您运行 Systems Manager Run Command。AWS Systems Manager Agent (SSM Agent) 是安装并运行在 Amazon EC2 实例上的 Amazon 软件，使 Amazon Systems Manager 服务能够更新、管理和配置 EC2 实例作为托管实例。SSM agent 接收来自 Systems Manager 服务的请求、处理它们并将状态和执行信息发送回 Systems Manager 服务。请注意，AWS Systems Manager Agent (SSM Agent) 默认[预装在 AWS 提供的某些 Amazon Machine Images (AMIs) 上](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html)。
  - 如果使用 CloudWatch agent 向导生成 CloudWatch agent 配置文件，可以选择使用 Systems Manager Parameter Store 作为安全的公共位置来存储配置文件以供后续检索。则 CloudWatch Agent 需要具有对 [Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) 的写访问权限来写入配置文件，以及读取权限来读取配置文件。
  - [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) 向 Amazon CloudWatch 写入数据（metrics 和 logs）的权限
- 启动 Amazon EC2 实例并分配在前面步骤中创建的 IAM 角色。有关此 IAM 角色，请参阅下面的附录 [1] 的信任策略和附录 [2] 的 Amazon 托管策略 - AmazonSSMManagedInstanceCore、CloudWatchAgentAdminPolicy 和 CloudWatchAgentServerPolicy（包括 JSON 格式的权限）。
- 在所需的 EC2 实例（Windows 或 Linux）上[手动](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)或使用 [Systems Manager Run Command](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) 安装 CloudWatch agent。
- 配置 CloudWatch agent 以收集内存 metrics 并写入 Amazon CloudWatch。

![CloudWatch Metrics](../../images/cw-metrics.png)

- 在 CloudWatch 控制台中查看收集的 [metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) 和 [logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)。
- 使用 CloudWatch Logs Insights 分析日志数据

![CloudWatch Metrics](../../images/ec2-cloudwatch-metrics.png)

### 大规模从 Amazon EC2 实例收集内存 metrics

以下步骤可用于在一个或多个 Amazon EC2 实例上安装和配置 CloudWatch agent 以将信号（metrics 和 logs）收集到 Amazon CloudWatch。

- 使用远程桌面或 SSH 连接到 Amazon EC2 实例（Windows 或 Linux），首次需要准备 CloudWatch agent 配置文件。
- 运行 CloudWatch Agent Configuration Wizard 来设置 metrics 和 logs 收集
  - 配置主机 metrics，如 CPU、内存、磁盘
  - 可选择添加要监控的自定义日志文件（例如 IIS 日志、Apache 日志）
  - 可选择监控 Windows Event logs
  - 将配置存储在 Systems Manager Parameter Store 中（如果相同配置可应用于更多 Amazon EC2 实例）。
- 使用 Systems Manager Run Command 将 CloudWatch Agent 配置应用于其他 EC2 实例。[AmazonCloudWatch-ManageAgent](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html#store-cloudwatch-configuration-s3) Systems Manager Command 文档可用于在单次运行中更新多个 EC2 实例上的 CloudWatch 配置。

### 自动化从 Amazon EC2 实例收集内存 metrics

以下步骤可用于自动化、编排和大规模管理到 Amazon CloudWatch 的信号收集（metrics 和 logs）。[AWS CloudFormation](https://aws.amazon.com/cloudformation/) 模板可用于执行以下操作：

- 创建 IAM 执行角色，允许 Systems Manager 自动化代表您在 Amazon EC2 实例上执行运行手册。
- 设置具有 CloudWatch agent 写入数据（metrics 和 logs）到 Amazon CloudWatch 权限的 IAM 角色
- 构建[自定义运行手册](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html)以在 Amazon EC2 实例上安装和配置 CloudWatch agent。请参阅下面的附录 [3]，这是一个可用于安装 CloudWatch Agent 并使用默认 metrics 或 Amazon Systems Manager Parameter Store 中的参数配置 CloudWatch Agent 的自定义运行手册文档示例
- 将 CloudWatch agent 配置文件上传到 Systems Manager Parameter Store。

### 参考资料

- [Collect Metrics and Logs from Amazon EC2 instances with the CloudWatch Agent](https://www.youtube.com/watch?v=vAnIhIwE5hY)
- [Setup memory metrics for Amazon EC2 instances using AWS Systems Manager](https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/)

### 附录

[1] **信任策略** — 用于 Amazon EC2 承担角色

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

[2] [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) - 用于 Amazon EC2 角色启用 AWS Systems Manager 服务核心功能的 AWS 托管策略。

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

[CloudWatchAgentAdminPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html) - 具有使用 AmazonCloudWatchAgent 所需完整权限的 Amazon 托管策略

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

[CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) - 具有在服务器上使用 AmazonCloudWatchAgent 所需完整权限的 Amazon 托管策略

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

[3] 一个自定义运行手册文档示例，可用于安装 CloudWatch Agent 并使用默认 metrics 或 Amazon Systems Manager Parameter Store 中的参数配置 CloudWatch Agent

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
