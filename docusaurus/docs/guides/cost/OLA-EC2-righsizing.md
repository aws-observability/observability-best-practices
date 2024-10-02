# OLA for Existing EC2 Workloads

## AWS OLA program

[AWS Optimization and Licensing Assessment (AWS OLA)](https://aws.amazon.com/optimization-and-licensing-assessment/) provides customers the best approach to migrate workloads to cloud and cost optimize resources. This is a complimentary program that is intended to help customers analyze both their new and existing workloads, assess their on-premises & cloud environments to optimize resource allocation, third-party licensing and application dependencies and hence enhance resource efficiency and potentially save on compute spending.

Through the data gathered in this process, the AWS OLA program delivers a comprehensive report that the customers can use to make informed decisions for their cloud journey & migration. The report models deployment options based on actual resource use, existing licensing entitlements and helping customers uncover potential cost savings through our flexible licensing options.

Benefits of undergoing the AWS OLA program includes,

- **Rightsize resources allocation** for your workloads with a tool-based discovery approach which offers insights into compute resources and helps identifying the best Amazon Elastic Compute Cloud (Amazon EC2), Amazon Relational Database Service (Amazon RDS), or VMware Cloud on AWS instance size and type for each workload.
- **Reduce costs** by optimizing your cloud infrastructure which is one of the key aspects.
- Model licensing scenarios, including license-included or BYOL instances, for flexibility in managing seasonal workloads and agile experimentation to **explore optimized licensing options** and hence eliminate unnecessary licensing costs.

![OLA](../../images/OLA.png)

## AWS OLA for EEC2 Workloads

The AWS OLA (Optimization and Licensing Assessment) is focused on optimizing costs for existing EC2 workloads called ‘**AWS OLA for EEC2**’ - AWS OLA (Optimization and Licensing Assessment) for **Existing EC2 Workloads** assessment.

The AWS OLA for EEC2 leverages [AWS Compute Optimizer](https://aws.amazon.com/compute-optimizer/) to provide Amazon EC2 rightsizing recommendations for customers enrolled in [AWS Enterprise Support](https://aws.amazon.com/premiumsupport/plans/enterprise/) plan. The OLA for EEC2 is a self-service engagement through a streamlined process, in which the AWS OLA team prepares the recommendations as an assessment report and the respective AWS account team presents those findings to the customer for Amazon EC2 rightsizing & cost optimization. In addition to the Amazon EC2 rightsizing recommendations, the AWS OLA also delivers Microsoft SQL Server optimization strategies for BYOL (Bring Your Own License) and License Included Microsoft SQL Server instances. The OLA for EEC2 surfaces supplemental strategies to Amazon EC2 rightsizing that reduce Microsoft SQL Server spend by 1) optimizing CPU configurations on Microsoft SQL Server on EC2 instances with lower CPU recommendation and 2) downgrading non-production servers running licensable SQL editions (Enterprise/Standard) to free SQL Developer edition.

To perform an assessment, the AWS OLA for EEC2 process collects environment parameters from the customer’s AWS accounts, including metrics like memory and CPU utilization (through Amazon CloudWatch and CloudWatch agent). Once the required parameters are collected, the AWS OLA team prepares the recommendations using the aggregated data and presents a PPT deck and Excel report to the AWS TAMs and account team which can later be presented to customers. The insights provided by the report help customers optimize their existing Amazon EC2 spend, and explore licensing optimization strategies for their workloads.

## AWS OLA for EEC2 assessment

Any AWS customer carrying Enterprise Support can optimize their existing Amazon EC2 Instances (Linux and Windows) costs with a complimentary Optimization and Licensing Assessment (OLA) for Existing EC2 workloads. To have an AWS OLA for EEC2 assessment performed for your workloads at no cost to you, please contact your AWS account team.

## Amazon CloudWatch memory metrics for accurate rightsizing

While the AWS OLA for EEC2 offers an assessment report for Amazon EC2 rightsizing, the insights provided by [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) comprehends the value of incorporating memory utilization metrics for more accurate rightsizing of resources for customers. Hence by encouraging and facilitating Amazon CloudWatch memory metrics monitoring along with the AWS OLA for EEC2 program, customers get more impactful resource optimization recommendations for their AWS environments and also obtain a broader perspective of their workload resource consumption. This helps you reduce the cost and improve the performance of your workloads.

Amazon EC2 Instances emit several metrics to Amazon CloudWatch by default. However, memory metrics isn’t one of the default metrics provided by Amazon EC2. Getting to know the memory metrics of Amazon EC2 helps understand the current memory utilization of your EC2 instances, so that the instances are neither under-provisioned nor over-provisioned. Under-provisioning of Amazon EC2 instances typically impairs the performance of the system or application, while over provisioning yields in wasteful expenditure. Memory heavy applications like Big Data Analytics, In-memory Databases, Real-time Streaming require you to monitor memory utilization on the instances for operational visibility.

![CloudWatch Agent](../../images/cw-agent.png)

### Memory metrics collection from Amazon EC2 Instances

To collect memory metrics from [Amazon EC2 Instances](https://aws.amazon.com/ec2/), here are the steps at a high level.

- Create a role in AWS Identity and Access Management (IAM) with permissions for
  - [Amazon Systems Manager](https://aws.amazon.com/systems-manager/) to manage Amazon EC2 instances, required if the Amazon EC2 Instance(s) are managed by Systems Manager. The [AWS Systems Manager Agent (SSM Agent)](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) is required on Amazon EC2 instances to allow the instance to communicate with the AWS Systems Manager and enable remote commands and scripts to be executed against the instance, like running Systems Manager Run Command on EC2 Instances on your behalf. AWS Systems Manager Agent (SSM Agent) is an Amazon software that is installed and run on the Amazon EC2 instances, which makes it possible for Amazon Systems Manager service to update, manage, and configure EC2 Instances as managed instances. The SSM agent receives requests from the Systems Manager service, processes them and sends status and execution information back to the Systems Manager service. Please note that, AWS Systems Manager Agent (SSM Agent) is [preinstalled on some Amazon Machine Images (AMIs)](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html) provided by AWS by default.
  - If the CloudWatch agent wizard is used to generate the CloudWatch agent configuration file, optionally the Systems Manager Parameter Store can be used as secure common location to store the configuration file for futher retrieval. Then the CloudWatch Agent need to have to write-access to [Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) to write the configuration file & read-access to read the configuration file.
  - [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) to write data (metrics & logs) to Amazon CloudWatch
- Launch Amazon EC2 Instance(s) and assign the IAM role created in the earlier step. For this IAM role, please refer to the Appendix [1] below for Trust Policy and Appendix [2] for Amazon Managed Policies - AmazonSSMManagedInstanceCore, CloudWatchAgentAdminPolicy and CloudWatchAgentServerPolicy (including permissions in JSON format) that be used.
- Install CloudWatch agent on the required EC2 instance(s) (Windows or Linux) either [manually](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html) or using [Systems Manager Run Command](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html).
- Configure CloudWatch agent to collect memory metrics and write to Amazon CloudWatch.

![CloudWatch Metrics](../../images/cw-metrics.png)

- View collected [metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) and [logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) in the CloudWatch console.
- Use CloudWatch Logs Insights to analyze log data

![CloudWatch Metrics](../../images/ec2-cloudwatch-metrics.png)

### Memory metrics collection from Amazon EC2 Instances at scale

The below steps can be followed to install and configure CloudWatch agent for signal collection (metrics and logs) to Amazon CloudWatch on one or more Amazon EC2 Instances.

- Connect to the Amazon EC2 Instance (Windows or Linux) using Remote Desktop or SSH, required once to prepare the CloudWatch agent configuration file.
- Run through the CloudWatch Agent Configuration Wizard to set up metrics and logs collection
  - Configure host metrics like CPU, memory, disks
  - Optionally add custom log files to monitor (e.g., IIS logs, Apache logs)
  - Optionally monitor Windows Event logs
  - Store the configuration in Systems Manager Parameter Store, if the same configuration can be applied to more Amazon EC2 Instances.
- Apply the CloudWatch Agent configuration to other EC2 Instances using Systems Manager Run Command. [AmazonCloudWatch-ManageAgent](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html#store-cloudwatch-configuration-s3) Systems Manager Command document can be used to update the CloudWatch configuration on multiple EC2 instances in a single run.

### Automation of memory metrics collection from Amazon EC2 Instances

The below steps can be followed to automate, orchestrate and manage at scale the signal collection (metrics and logs) to Amazon CloudWatch. [AWS CloudFormation](https://aws.amazon.com/cloudformation/) template can be used to perform following actions

- Create an IAM execution role that allows Systems Manager automation to execute runbooks on Amazon EC2 Instances on your behalf.
- Setup IAM role with permissions for CloudWatch agent to write data (metrics & logs) to Amazon CloudWatch
- Build a [custom runbook](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html) to install and configure CloudWatch agent on Amazon EC2 Instances. Please refer to Appendix [3] below, an example custom runbook document that can be used to install CloudWatch Agent and configure CloudWatch Agent either with the default metrics or with a parameter in Amazon Systems Manager Parameter Store
- Upload a CloudWatch agent configuration file to systems manager parameter store.

### References

- [Collect Metrics and Logs from Amazon EC2 instances with the CloudWatch Agent](https://www.youtube.com/watch?v=vAnIhIwE5hY)
- [Setup memory metrics for Amazon EC2 instances using AWS Systems Manager](https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/)

### Appendices

[1] **Trust Policy** for Amazon EC2 to assume the role

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

[2] [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) - AWS Managed Policy for Amazon EC2 Role to enable AWS Systems Manager service core functionality.

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

[CloudWatchAgentAdminPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html) - Amazon Managed Policy with full permissions required to use AmazonCloudWatchAgent

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

[CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) - Amazon Managed Policy with full permissions required to use AmazonCloudWatchAgent on servers

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

[3] An example custom runbook document that can be used to install CloudWatch Agent and configure CloudWatch Agent either with the default metrics or with a parameter in Amazon Systems Manager Parameter Store

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
