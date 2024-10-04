"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5596],{72533:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>r,toc:()=>l});var s=t(74848),o=t(28453);const a={},i="OLA for Existing EC2 Workloads",r={id:"guides/cost/OLA-EC2-righsizing",title:"OLA for Existing EC2 Workloads",description:"AWS OLA program",source:"@site/docs/guides/cost/OLA-EC2-righsizing.md",sourceDirName:"guides/cost",slug:"/guides/cost/OLA-EC2-righsizing",permalink:"/observability-best-practices/ja/docs/guides/cost/OLA-EC2-righsizing",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/cost/OLA-EC2-righsizing.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Kubecost \u3092\u4f7f\u7528\u3057\u305f\u30b3\u30b9\u30c8\u306e\u53ef\u8996\u5316\u3068\u30ea\u30bd\u30fc\u30b9\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8a2d\u5b9a",permalink:"/observability-best-practices/ja/docs/guides/cost/kubecost"},next:{title:"AWS Observability \u30b5\u30fc\u30d3\u30b9\u3068\u30b3\u30b9\u30c8",permalink:"/observability-best-practices/ja/docs/guides/cost/cost-visualization/cost"}},c={},l=[{value:"AWS OLA program",id:"aws-ola-program",level:2},{value:"AWS OLA for EEC2 Workloads",id:"aws-ola-for-eec2-workloads",level:2},{value:"AWS OLA for EEC2 assessment",id:"aws-ola-for-eec2-assessment",level:2},{value:"Amazon CloudWatch memory metrics for accurate rightsizing",id:"amazon-cloudwatch-memory-metrics-for-accurate-rightsizing",level:2},{value:"Memory metrics collection from Amazon EC2 Instances",id:"memory-metrics-collection-from-amazon-ec2-instances",level:3},{value:"Memory metrics collection from Amazon EC2 Instances at scale",id:"memory-metrics-collection-from-amazon-ec2-instances-at-scale",level:3},{value:"Automation of memory metrics collection from Amazon EC2 Instances",id:"automation-of-memory-metrics-collection-from-amazon-ec2-instances",level:3},{value:"References",id:"references",level:3},{value:"Appendices",id:"appendices",level:3}];function m(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"ola-for-existing-ec2-workloads",children:"OLA for Existing EC2 Workloads"}),"\n",(0,s.jsx)(n.h2,{id:"aws-ola-program",children:"AWS OLA program"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://aws.amazon.com/optimization-and-licensing-assessment/",children:"AWS Optimization and Licensing Assessment (AWS OLA)"})," provides customers the best approach to migrate workloads to cloud and cost optimize resources. This is a complimentary program that is intended to help customers analyze both their new and existing workloads, assess their on-premises & cloud environments to optimize resource allocation, third-party licensing and application dependencies and hence enhance resource efficiency and potentially save on compute spending."]}),"\n",(0,s.jsx)(n.p,{children:"Through the data gathered in this process, the AWS OLA program delivers a comprehensive report that the customers can use to make informed decisions for their cloud journey & migration. The report models deployment options based on actual resource use, existing licensing entitlements and helping customers uncover potential cost savings through our flexible licensing options."}),"\n",(0,s.jsx)(n.p,{children:"Benefits of undergoing the AWS OLA program includes,"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Rightsize resources allocation"})," for your workloads with a tool-based discovery approach which offers insights into compute resources and helps identifying the best Amazon Elastic Compute Cloud (Amazon EC2), Amazon Relational Database Service (Amazon RDS), or VMware Cloud on AWS instance size and type for each workload."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Reduce costs"})," by optimizing your cloud infrastructure which is one of the key aspects."]}),"\n",(0,s.jsxs)(n.li,{children:["Model licensing scenarios, including license-included or BYOL instances, for flexibility in managing seasonal workloads and agile experimentation to ",(0,s.jsx)(n.strong,{children:"explore optimized licensing options"})," and hence eliminate unnecessary licensing costs."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"OLA",src:t(69838).A+"",width:"912",height:"591"})}),"\n",(0,s.jsx)(n.h2,{id:"aws-ola-for-eec2-workloads",children:"AWS OLA for EEC2 Workloads"}),"\n",(0,s.jsxs)(n.p,{children:["The AWS OLA (Optimization and Licensing Assessment) is focused on optimizing costs for existing EC2 workloads called \u2018",(0,s.jsx)(n.strong,{children:"AWS OLA for EEC2"}),"\u2019 - AWS OLA (Optimization and Licensing Assessment) for ",(0,s.jsx)(n.strong,{children:"Existing EC2 Workloads"})," assessment."]}),"\n",(0,s.jsxs)(n.p,{children:["The AWS OLA for EEC2 leverages ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/compute-optimizer/",children:"AWS Compute Optimizer"})," to provide Amazon EC2 rightsizing recommendations for customers enrolled in ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/premiumsupport/plans/enterprise/",children:"AWS Enterprise Support"})," plan. The OLA for EEC2 is a self-service engagement through a streamlined process, in which the AWS OLA team prepares the recommendations as an assessment report and the respective AWS account team presents those findings to the customer for Amazon EC2 rightsizing & cost optimization. In addition to the Amazon EC2 rightsizing recommendations, the AWS OLA also delivers Microsoft SQL Server optimization strategies for BYOL (Bring Your Own License) and License Included Microsoft SQL Server instances. The OLA for EEC2 surfaces supplemental strategies to Amazon EC2 rightsizing that reduce Microsoft SQL Server spend by 1) optimizing CPU configurations on Microsoft SQL Server on EC2 instances with lower CPU recommendation and 2) downgrading non-production servers running licensable SQL editions (Enterprise/Standard) to free SQL Developer edition."]}),"\n",(0,s.jsx)(n.p,{children:"To perform an assessment, the AWS OLA for EEC2 process collects environment parameters from the customer\u2019s AWS accounts, including metrics like memory and CPU utilization (through Amazon CloudWatch and CloudWatch agent). Once the required parameters are collected, the AWS OLA team prepares the recommendations using the aggregated data and presents a PPT deck and Excel report to the AWS TAMs and account team which can later be presented to customers. The insights provided by the report help customers optimize their existing Amazon EC2 spend, and explore licensing optimization strategies for their workloads."}),"\n",(0,s.jsx)(n.h2,{id:"aws-ola-for-eec2-assessment",children:"AWS OLA for EEC2 assessment"}),"\n",(0,s.jsx)(n.p,{children:"Any AWS customer carrying Enterprise Support can optimize their existing Amazon EC2 Instances (Linux and Windows) costs with a complimentary Optimization and Licensing Assessment (OLA) for Existing EC2 workloads. To have an AWS OLA for EEC2 assessment performed for your workloads at no cost to you, please contact your AWS account team."}),"\n",(0,s.jsx)(n.h2,{id:"amazon-cloudwatch-memory-metrics-for-accurate-rightsizing",children:"Amazon CloudWatch memory metrics for accurate rightsizing"}),"\n",(0,s.jsxs)(n.p,{children:["While the AWS OLA for EEC2 offers an assessment report for Amazon EC2 rightsizing, the insights provided by ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/cloudwatch/",children:"Amazon CloudWatch"})," comprehends the value of incorporating memory utilization metrics for more accurate rightsizing of resources for customers. Hence by encouraging and facilitating Amazon CloudWatch memory metrics monitoring along with the AWS OLA for EEC2 program, customers get more impactful resource optimization recommendations for their AWS environments and also obtain a broader perspective of their workload resource consumption. This helps you reduce the cost and improve the performance of your workloads."]}),"\n",(0,s.jsx)(n.p,{children:"Amazon EC2 Instances emit several metrics to Amazon CloudWatch by default. However, memory metrics isn\u2019t one of the default metrics provided by Amazon EC2. Getting to know the memory metrics of Amazon EC2 helps understand the current memory utilization of your EC2 instances, so that the instances are neither under-provisioned nor over-provisioned. Under-provisioning of Amazon EC2 instances typically impairs the performance of the system or application, while over provisioning yields in wasteful expenditure. Memory heavy applications like Big Data Analytics, In-memory Databases, Real-time Streaming require you to monitor memory utilization on the instances for operational visibility."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"CloudWatch Agent",src:t(70676).A+"",width:"1102",height:"587"})}),"\n",(0,s.jsx)(n.h3,{id:"memory-metrics-collection-from-amazon-ec2-instances",children:"Memory metrics collection from Amazon EC2 Instances"}),"\n",(0,s.jsxs)(n.p,{children:["To collect memory metrics from ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/ec2/",children:"Amazon EC2 Instances"}),", here are the steps at a high level."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Create a role in AWS Identity and Access Management (IAM) with permissions for","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://aws.amazon.com/systems-manager/",children:"Amazon Systems Manager"})," to manage Amazon EC2 instances, required if the Amazon EC2 Instance(s) are managed by Systems Manager. The ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html",children:"AWS Systems Manager Agent (SSM Agent)"})," is required on Amazon EC2 instances to allow the instance to communicate with the AWS Systems Manager and enable remote commands and scripts to be executed against the instance, like running Systems Manager Run Command on EC2 Instances on your behalf. AWS Systems Manager Agent (SSM Agent) is an Amazon software that is installed and run on the Amazon EC2 instances, which makes it possible for Amazon Systems Manager service to update, manage, and configure EC2 Instances as managed instances. The SSM agent receives requests from the Systems Manager service, processes them and sends status and execution information back to the Systems Manager service. Please note that, AWS Systems Manager Agent (SSM Agent) is ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html",children:"preinstalled on some Amazon Machine Images (AMIs)"})," provided by AWS by default."]}),"\n",(0,s.jsxs)(n.li,{children:["If the CloudWatch agent wizard is used to generate the CloudWatch agent configuration file, optionally the Systems Manager Parameter Store can be used as secure common location to store the configuration file for futher retrieval. Then the CloudWatch Agent need to have to write-access to ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/systems-manager/features/#Parameter_Store",children:"Systems Manager Parameter Store"})," to write the configuration file & read-access to read the configuration file."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html",children:"CloudWatch agent"})," to write data (metrics & logs) to Amazon CloudWatch"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:"Launch Amazon EC2 Instance(s) and assign the IAM role created in the earlier step. For this IAM role, please refer to the Appendix [1] below for Trust Policy and Appendix [2] for Amazon Managed Policies - AmazonSSMManagedInstanceCore, CloudWatchAgentAdminPolicy and CloudWatchAgentServerPolicy (including permissions in JSON format) that be used."}),"\n",(0,s.jsxs)(n.li,{children:["Install CloudWatch agent on the required EC2 instance(s) (Windows or Linux) either ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html",children:"manually"})," or using ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html",children:"Systems Manager Run Command"}),"."]}),"\n",(0,s.jsx)(n.li,{children:"Configure CloudWatch agent to collect memory metrics and write to Amazon CloudWatch."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"CloudWatch Metrics",src:t(33368).A+"",width:"1165",height:"526"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["View collected ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html",children:"metrics"})," and ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",children:"logs"})," in the CloudWatch console."]}),"\n",(0,s.jsx)(n.li,{children:"Use CloudWatch Logs Insights to analyze log data"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"CloudWatch Metrics",src:t(29369).A+"",width:"1816",height:"392"})}),"\n",(0,s.jsx)(n.h3,{id:"memory-metrics-collection-from-amazon-ec2-instances-at-scale",children:"Memory metrics collection from Amazon EC2 Instances at scale"}),"\n",(0,s.jsx)(n.p,{children:"The below steps can be followed to install and configure CloudWatch agent for signal collection (metrics and logs) to Amazon CloudWatch on one or more Amazon EC2 Instances."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Connect to the Amazon EC2 Instance (Windows or Linux) using Remote Desktop or SSH, required once to prepare the CloudWatch agent configuration file."}),"\n",(0,s.jsxs)(n.li,{children:["Run through the CloudWatch Agent Configuration Wizard to set up metrics and logs collection","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Configure host metrics like CPU, memory, disks"}),"\n",(0,s.jsx)(n.li,{children:"Optionally add custom log files to monitor (e.g., IIS logs, Apache logs)"}),"\n",(0,s.jsx)(n.li,{children:"Optionally monitor Windows Event logs"}),"\n",(0,s.jsx)(n.li,{children:"Store the configuration in Systems Manager Parameter Store, if the same configuration can be applied to more Amazon EC2 Instances."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["Apply the CloudWatch Agent configuration to other EC2 Instances using Systems Manager Run Command. ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/create-store-cloudwatch-configurations.html#store-cloudwatch-configuration-s3",children:"AmazonCloudWatch-ManageAgent"})," Systems Manager Command document can be used to update the CloudWatch configuration on multiple EC2 instances in a single run."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"automation-of-memory-metrics-collection-from-amazon-ec2-instances",children:"Automation of memory metrics collection from Amazon EC2 Instances"}),"\n",(0,s.jsxs)(n.p,{children:["The below steps can be followed to automate, orchestrate and manage at scale the signal collection (metrics and logs) to Amazon CloudWatch. ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/cloudformation/",children:"AWS CloudFormation"})," template can be used to perform following actions"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Create an IAM execution role that allows Systems Manager automation to execute runbooks on Amazon EC2 Instances on your behalf."}),"\n",(0,s.jsx)(n.li,{children:"Setup IAM role with permissions for CloudWatch agent to write data (metrics & logs) to Amazon CloudWatch"}),"\n",(0,s.jsxs)(n.li,{children:["Build a ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html",children:"custom runbook"})," to install and configure CloudWatch agent on Amazon EC2 Instances. Please refer to Appendix [3] below, an example custom runbook document that can be used to install CloudWatch Agent and configure CloudWatch Agent either with the default metrics or with a parameter in Amazon Systems Manager Parameter Store"]}),"\n",(0,s.jsx)(n.li,{children:"Upload a CloudWatch agent configuration file to systems manager parameter store."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"references",children:"References"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.youtube.com/watch?v=vAnIhIwE5hY",children:"Collect Metrics and Logs from Amazon EC2 instances with the CloudWatch Agent"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/",children:"Setup memory metrics for Amazon EC2 instances using AWS Systems Manager"})}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"appendices",children:"Appendices"}),"\n",(0,s.jsxs)(n.p,{children:["[1] ",(0,s.jsx)(n.strong,{children:"Trust Policy"})," for Amazon EC2 to assume the role"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": ["sts:AssumeRole"],\n      "Principal": {\n        "Service": ["ec2.amazonaws.com"]\n      }\n    }\n  ]\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:["[2] ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html",children:"AmazonSSMManagedInstanceCore"})," - AWS Managed Policy for Amazon EC2 Role to enable AWS Systems Manager service core functionality."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": [\n        "ssm:DescribeAssociation",\n        "ssm:GetDeployablePatchSnapshotForInstance",\n        "ssm:GetDocument",\n        "ssm:DescribeDocument",\n        "ssm:GetManifest",\n        "ssm:GetParameter",\n        "ssm:GetParameters",\n        "ssm:ListAssociations",\n        "ssm:ListInstanceAssociations",\n        "ssm:PutInventory",\n        "ssm:PutComplianceItems",\n        "ssm:PutConfigurePackageResult",\n        "ssm:UpdateAssociationStatus",\n        "ssm:UpdateInstanceAssociationStatus",\n        "ssm:UpdateInstanceInformation"\n      ],\n      "Resource": "*"\n    },\n    {\n      "Effect": "Allow",\n      "Action": [\n        "ssmmessages:CreateControlChannel",\n        "ssmmessages:CreateDataChannel",\n        "ssmmessages:OpenControlChannel",\n        "ssmmessages:OpenDataChannel"\n      ],\n      "Resource": "*"\n    },\n    {\n      "Effect": "Allow",\n      "Action": [\n        "ec2messages:AcknowledgeMessage",\n        "ec2messages:DeleteMessage",\n        "ec2messages:FailMessage",\n        "ec2messages:GetEndpoint",\n        "ec2messages:GetMessages",\n        "ec2messages:SendReply"\n      ],\n      "Resource": "*"\n    }\n  ]\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentAdminPolicy.html",children:"CloudWatchAgentAdminPolicy"})," - Amazon Managed Policy with full permissions required to use AmazonCloudWatchAgent"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "CWACloudWatchPermissions",\n      "Effect": "Allow",\n      "Action": [\n        "cloudwatch:PutMetricData",\n        "ec2:DescribeTags",\n        "logs:PutLogEvents",\n        "logs:PutRetentionPolicy",\n        "logs:DescribeLogStreams",\n        "logs:DescribeLogGroups",\n        "logs:CreateLogStream",\n        "logs:CreateLogGroup",\n        "xray:PutTraceSegments",\n        "xray:PutTelemetryRecords",\n        "xray:GetSamplingRules",\n        "xray:GetSamplingTargets",\n        "xray:GetSamplingStatisticSummaries"\n      ],\n      "Resource": "*"\n    },\n    {\n      "Sid": "CWASSMPermissions",\n      "Effect": "Allow",\n      "Action": ["ssm:GetParameter", "ssm:PutParameter"],\n      "Resource": "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"\n    }\n  ]\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html",children:"CloudWatchAgentServerPolicy"})," - Amazon Managed Policy with full permissions required to use AmazonCloudWatchAgent on servers"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "CWACloudWatchServerPermissions",\n      "Effect": "Allow",\n      "Action": [\n        "cloudwatch:PutMetricData",\n        "ec2:DescribeVolumes",\n        "ec2:DescribeTags",\n        "logs:PutLogEvents",\n        "logs:PutRetentionPolicy",\n        "logs:DescribeLogStreams",\n        "logs:DescribeLogGroups",\n        "logs:CreateLogStream",\n        "logs:CreateLogGroup",\n        "xray:PutTraceSegments",\n        "xray:PutTelemetryRecords",\n        "xray:GetSamplingRules",\n        "xray:GetSamplingTargets",\n        "xray:GetSamplingStatisticSummaries"\n      ],\n      "Resource": "*"\n    },\n    {\n      "Sid": "CWASSMServerPermissions",\n      "Effect": "Allow",\n      "Action": ["ssm:GetParameter"],\n      "Resource": "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"\n    }\n  ]\n}\n'})}),"\n",(0,s.jsx)(n.p,{children:"[3] An example custom runbook document that can be used to install CloudWatch Agent and configure CloudWatch Agent either with the default metrics or with a parameter in Amazon Systems Manager Parameter Store"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"#-------------------------------------------------\n# Composite document and State Manager association to install and configure the Amazon CloudWatch agent\n#-------------------------------------------------\nInstallAndConfigureCloudWatchAgent:\nType: AWS::SSM::Document\nProperties:\n    Content:\n    schemaVersion: '2.2'\n    description: The InstallAndManageCloudWatch command document installs the Amazon CloudWatch agent and manages the configuration of the agent for Amazon EC2 instances.\n    parameters:\n        action:\n        description: The action CloudWatch Agent should take.\n        type: String\n        default: configure\n        allowedValues:\n        - configure\n        - configure (append)\n        - configure (remove)\n        - start\n        - status\n        - stop\n        mode:\n        description: Controls platform-specific default behavior such as whether to include\n            EC2 Metadata in metrics.\n        type: String\n        default: ec2\n        allowedValues:\n        - ec2\n        - onPremise\n        - auto\n        optionalConfigurationSource:\n        description: Only for 'configure' related actions. Use 'ssm' to apply a ssm parameter\n            as config. Use 'default' to apply default config for amazon-cloudwatch-agent.\n            Use 'all' with 'configure (remove)' to clean all configs for amazon-cloudwatch-agent.\n        type: String\n        allowedValues:\n        - ssm\n        - default\n        - all\n        default: ssm\n        optionalConfigurationLocation:\n        description: Only for 'configure' related actions. Only needed when Optional Configuration\n            Source is set to 'ssm'. The value should be a ssm parameter name.\n        type: String\n        default: ''\n        allowedPattern: '[a-zA-Z0-9-\"~:_@./^(*)!<>?=+]*$'\n        optionalRestart:\n        description: Only for 'configure' related actions. If 'yes', restarts the agent\n            to use the new configuration. Otherwise the new config will only apply on the\n            next agent restart.\n        type: String\n        default: 'yes'\n        allowedValues:\n        - 'yes'\n        - 'no'\n    mainSteps:\n    - inputs:\n        documentParameters:\n            name: AmazonCloudWatchAgent\n            action: Install\n        documentType: SSMDocument\n        documentPath: AWS-ConfigureAWSPackage\n        name: installCWAgent\n        action: aws:runDocument\n    - inputs:\n        documentParameters:\n            mode: '{{mode}}'\n            optionalRestart: '{{optionalRestart}}'\n            optionalConfigurationSource: '{{optionalConfigurationSource}}'\n            optionalConfigurationLocation: '{{optionalConfigurationLocation}}'\n            action: '{{action}}'\n        documentType: SSMDocument\n        documentPath: AmazonCloudWatch-ManageAgent\n        name: manageCWAgent\n        action: aws:runDocument\n    DocumentFormat: YAML\n    DocumentType: Command\n    TargetType: /AWS::EC2::Instance\n\nCloudWatchAgentAssociation:\nType: AWS::SSM::Association\nProperties:\n    AssociationName: InstallCloudWatchAgent\n    Name: !Ref InstallAndConfigureCloudWatchAgent\n    ScheduleExpression: rate(7 days)\n    Targets:\n    - Key: tag:Platform\n    Values:\n    - Linux\n    WaitForSuccessTimeoutSeconds: 300\n"})})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},69838:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/OLA-571cd4a1507a9202552d22134453b43c.png"},70676:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cw-agent-e2ca653351414a3bcc47f95b249f1d22.png"},33368:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/cw-metrics-bd1afaaf7878aee54c12bee7eef3100a.png"},29369:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/ec2-cloudwatch-metrics-55f01eb27c58e34d66c82e385546aa1a.png"},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>r});var s=t(96540);const o={},a=s.createContext(o);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);