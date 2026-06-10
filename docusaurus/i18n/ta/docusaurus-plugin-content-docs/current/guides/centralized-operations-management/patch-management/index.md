---
sidebar_position: 5
---
# Patch Management

Systems Manager-ன் திறனான [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html), பாதுகாப்பு தொடர்பான updates-உடன் managed nodes-ஐ patch செய்யும் செயல்முறையை automate செய்ய அனுமதிக்கிறது. Amazon EC2 instances, edge devices, மற்றும் on-premises servers மற்றும் virtual machines (VMs), மற்ற cloud environments-ல் உள்ள VMs உட்பட patch செய்யலாம்.

## Patching-ஐ கடினமாக்குவது என்ன?

![What makes patching hard?](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "What makes patching hard?")

Creating a patching strategy can be challenging for organizations. To start, patch management is dependent on having a current and complete inventory of the patchable software, including applications and operating systems that's installed on each node within the company's environment. Secondly, enterprise patch management can cause some resources to be overloaded in terms of both people and infrastructure.

Next, installing patches can cause side effects to occur. Another common challenge which often cause organizations to err on the side of caution, is unintended or unexpected problems that are caused by installing patches. It can be surprisingly difficult to examine a node and determine whether or not a particular patch has actually taken effect. This challenge could be faced on a single node, or if you extrapolate that out across an entire organization fleet of node and operating systems, the scale of that challenge can quickly become very overwhelming.

## Making things better

![Prioritizing patching](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "Prioritizing patching")

To help address some of the common challenges, start by prioritizing specific patches through classifications to identify a small subset of patches you must prioritize. To do this, determine what workloads or applications are most critical for your business and then determine which patches make the most difference to those workloads. For example, email servers, databases, web applications, customer facing digital properties, etc.

![How it works](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "How it works")

From there you can create [patch baselines](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html) for each workload which helps determine applicable patches to be marked missing when performing patch scan operations. Scanning helps you determine the level of compliance against the baselines that you've established.

You can then begin to schedule recurring patch install operations to apply updates during routine maintenance periods or install updates on-demand during emergent patch releases. Following patch installation, you can confirm the result using patch compliance data provided by Patch Manager.

## What occurs within the OS during patching?

A common question from customers is how does Patch Manager scan or install patches? When a patch operation is initiated, whether scheduled or ad-hoc, the operation is queued in Systems Manager endpoints. The SSM agent then retrieves the command to either scan or install. SSM agent retrieves patch baseline approval rules and initiates a scan or install using the local OS package manager, i.e. Windows Update, yum, apt-get. Once the operation is complete, SSM agent reports back patch compliance data to Patch Manager.

![Patch Management OS Patching](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "Patch Management OS Patching")

### Connectivity to the patch source

If your managed nodes don't have a direct connection to the Internet and you're using an Amazon Virtual Private Cloud (Amazon VPC) with a VPC endpoint, you must ensure that the nodes have access to the source patch repositories (repos).

On Linux nodes, patch updates are typically downloaded from the remote repos configured on the node. Therefore, the node must be able to connect to the repos so the patching can be performed. Windows Server managed nodes must be able to connect to the Windows Update Catalog or Windows Server Update Services (WSUS). For more information, see [Patch Manager prerequisites](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html).

## Defining patch criteria

Patch Manager provides [predefined patch baselines](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html) for each of the operating systems supported by Patch Manager. You can use these baselines as they are currently configured (you can't customize them) or you can create your own custom patch baselines. Custom patch baselines allows you greater control over which patches are approved or rejected for your environment.

Within a custom patch baseline you can:

* Define what patches are approved
* Use auto-approval delays for cutoffs
* Define patch exceptions
* Define custom patch repositories for Linux
* Define patch criteria for multiple operating system versions

## Different types of patching

There are two general approaches that you can take with your patching solution: centralized or decentralized.

| Centralized Patching | Decentralized Patching |
| -------------------- | ---------------------- |
| Central team deploys patch scan operations | Shifts more responsibility to application / account owner |
| Central team deploys patch install operations | Central team deploys patch scan operations & compliance reporting is still centralized |
| Limited flexibility around schedule and operations performed | Owners responsible for patch install operations & central team can provide building blocks, i.e. via AWS Service Catalog |
| Central team typically responsible for troubleshooting | Allows owner to define schedule for install  |
| More common in highly regulated or secured environments | Central team should have an on-demand patch install override |

### Example centralized patching solutions for multi-account organizations

**Option 1:** A centralized patching solution can be established using [Quick Setup Patch Policy configurations](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html). Patch policies enable customers to scan and schedule patch installation for multiple patch baselines across AWS accounts and across AWS Regions. For more information, see [Patching across an AWS Organization - Patch Policies](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies).

![Patch Management Centralized Patching Option 1](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "Patch Management Centralized Patching Option 1")

**Option 2:** Another option for a centralized solution is to schedule a multi-account and multi-Region patching operation using a combination of [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda](https://aws.amazon.com/lambda/), and [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html). For more information, see [Scheduling centralized multi-account and multi-Region patching with AWS Systems Manager Automation](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/).

![Patch Management Centralized Patching Option 2](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "Patch Management Centralized Patching Option 2")

### Example decentralized self-service patching solution for multi-account organizations

Different application owners may have different requirements in terms of patch operations, patch timing, frequency of patching, and flexibility of testing patches in lower environments (DEV or UAT). Using [AWS Service Catalog](https://aws.amazon.com/servicecatalog/), central teams can create products which act as the building blocks for self-service patching. Application/account owners can then deploy these products into their environment and only have to provide a few parameters, such as the schedule, without having to build a solution themselves. For more information, see [A self-service patching solution for multi-account organizations](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/).

![Self-service patching using Service Catalog](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "Self-service patching using Service Catalog")

## Patch in place vs Rehydration

Rehydration (repaving, refreshing) is the process of spinning up new servers with latest patches installed and decommissioning old nodes. A common practice for EC2 instances in an Auto Scaling Group, managed node groups in a container cluster (ECS / EKS), and AMIs that are preconfigured with application workload requirements.

| Patch in place | Rehydration |
| -------------- | ----------- |
| Commonly performed at a higher frequency than rehydration (weekly, bi-weekly) | Commonly performed monthly or quarterly. Some customers perform it every 2 weeks! |
| Ideal for long-standing nodes that cannot be easily replaced (mutable) | Ideal for workloads which do not require much post-launch configuration (immutable) |
| Patch install workflow may require backups to be taken | Use services like EC2 Image Builder to integrate with Auto Scaling groups |
| | May still require a mechanism to patch in place. For example, if a zero-day vulnerability patch is released but nodes cannot be replaced until the next rehydration cycle |

You may require both methods, patch in place and rehydration, within your environment depending on the application workload.

## Patching across an AWS Organization - Patch Policies

To standardize patching requirements in an AWS Organization, you can use [patch policies within Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html). You can apply a patch policy across an entire organization for multiple operating systems, across multiple accounts and Regions, and review resource compliance for the target managed nodes.

Using Quick Setup across multiple accounts helps to ensure that your organization maintains consistent configurations. Additionally, Quick Setup periodically checks for configuration drift and attempts to remediate it. Configuration drift occurs whenever a user makes any change to a service or feature that conflicts with the selections made through Quick Setup.

![Patch Policy architecture](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Patch Policy architecture")

### How it works

1. You create the patch policy using Quick Setup and the parameters selected are sent to CloudFormation.
1. CloudFormation creates a stack set with the defined parameters and defined target accounts and Regions. This is generated by Quick Setup during deployment.
1. CloudFormation creates stack instances in each target account and Region.
1. The stack instances create [State Manager associations](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html) for the defined patch scan and an association for patch installation, if selected. These associations are applied using the schedules provided when you create the patch policy.
1. In the management account, a State Manager association starts an Automation runbook to invoke a Lambda function once a day.
1. The Lambda function stores the patch baselines specified as a JSON file in an S3 bucket. Additionally, the Lambda function evalutes the custom patch baselines specified within Quick Setup for any changes. If changes are made to the custom patch baselines, the Lambda function updates the JSON file in the S3 bucket.
1. Manage nodes then pull the central patch baseline JSON file during patching operations to scan for or install updates.

**Note:** Currently, to deploy Patch Policies through Quick Setup you must use the management account within your AWS Organization. To deploy Patch Policies outside of the management account, visit [How to deploy Patch Policies outside of Quick Setup](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US).

## On-demand patching

There are times where you may need to patch nodes outside of your routine patching cycles such as in emergent vulnerability scenarios.

**Option 1:** [Patch now](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html) (*single-account/Region*)

* Using the **Patch now** option in Patch Manager, you can run on-demand patching operations quickly. However, **Patch now** only allows patching within a single AWS account and Region at a time. It also cannot use patch baselines defined within patch policies. You can create a different baseline that will perform a patch scan or install applicable patches based on approval rules that differs from your patch policy baselines.

**Option 2:** Automation *(multi-account/Region)*

* To perform an on-demand patching operation across accounts and Regions, you can utilize Automation which supports [running automations in multiple AWS Regions and accounts](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html). You can leverage IAM roles deployed into target accounts to perform actions. You can integrate with Patch Policies or stand alone patching requirements.

## Integrating vulnerability management and remediation

[Amazon Inspector](https://aws.amazon.com/inspector) provides continuous vulnerability scans on Amazon EC2 instances and container images stored in Amazon Elastic Container Registry (Amazon ECR). These scans assess software vulnerabilities and unintended network exposure. Amazon Inspector uses the Systems Manager (SSM) agent to collect software application inventory of the EC2 instances. Then, Inspector scans this data and identifies software vulnerabilities, a crucial step in vulnerability management.

You should perform regular patching operations for resolving vulnerabilities identified by Amazon Inspector based on the severity of the vulnerabilities. You can use AWS Systems Manager Patch Manager to automate the process of patching nodes managed by Systems Manager using the SSM agent.

There may be zero-day or other high and critical severity vulnerabilities where patches are available. However, you may not want to wait for the regular patching schedule to remediate them. In these cases, on-demand mechanisms for patching should exist.

To learn more, see:

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 2](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![Automate vulnerability management and remediation](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "Automate vulnerability management and remediation")

## Reviewing patch compliance

The Patch Manager dashboard provides a snapshot of patch compliance within the current AWS account and Region. Compliance reporting allows you to determine patch compliance for nodes. You can also review more details on what patches were installed and what was the severity and criticality of those patches using the Fleet Manager console.

While these views are specific to the local AWS account and Region, you can create centralized patch compliance reporting for the entire AWS Organization.

## Creating end-to-end patch management and inventory reporting in an AWS Organization

:::tip
Did you know you can use [Amazon Quick Suite](https://aws.amazon.com/quicksuite/) to reduce a multi-step manual process into a few simple prompts, enabling you to quickly generate insightful patching compliance and inventory visualizations. Discover how AI-powered capabilities help you create dynamic dashboards, saving valuable time while maintaining accuracy and providing real-time insights into your organization's patching status in the blog: [Building enterprise patching and inventory dashboards using Amazon Quick Suite](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/).
:::

To create a report on patch compliance across your AWS Organization, you can use Systems Manager [resource data syncs](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html) to send inventory data collected from all of your managed nodes to a single Amazon S3 bucket. Resource data sync then automatically updates the centralized data when new inventory data is collected.

Using an [AWS Glue crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html), you can automatically create databases and tables from the patch compliance data in S3 and then query patch compliance data with [Amazon Athena](https://aws.amazon.com/athena/). This solution utilizes [Amazon QuickSight](https://aws.amazon.com/quicksight/) to visualize the inventory and patch compliance data, however, you can use any BI or analytics tool that can pull the data from the S3 bucket.

**Note:** You need to create a resource data sync in every account and Region that you want to collect inventory data from your nodes.

![End-to-end patch management reporting](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "End-to-end patch management reporting")

1. Create Systems Manager resource data syncs in each account/Region.
1. Centrally aggregate patch compliance data in a single Amazon S3 Bucket.
1. Automatically create database and tables using an AWS Glue Crawler.
1. Query patch or inventory data using Amazon Athena.
1. Visualize patch compliance using Amazon QuickSight.

## Understanding AWS Systems Manager Inventory Metadata

Resource data syncs push data to S3 buckets based on actions taken from on-demand actions (Registering or terminating instances /performing a patch scan or install), scheduled actions (Gathering software inventory, gathering custom inventory metadata, performing a patch install, and evaluating compliance using Chef InSpec).

![Inventory metadata](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "Inventory metadata")

Source: [Understanding AWS Systems Manager Inventory Metadata](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)
