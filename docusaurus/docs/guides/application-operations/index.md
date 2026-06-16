---
sidebar_position: 5
---
# Application Operations

AWS customers often operate hundreds of applications and have to monitor and manage individual resources to make sure their applications are available, secure, cost-optimized, and performing optimally. Applications are essential for customer businesses. They are groups of resources that work together to provide specific features or services that the end user needs. In today's fast evolving digital landscape, organizing your AWS resources into well-defined applications has become crucial for efficient Cloud Operations. This application-centric approach is needed to solve common challenges such as resource spread, operational inefficiencies, and the complexity of managing resources across multiple AWS accounts.

AWS provides a comprehensive suite of services designed to support an application-centric cloud operations strategy, enabling you to streamline resource management, improve visibility, and enhance overall operational efficiency.

Application operations is a set of capabilities across AWS that provides a consistent approach to monitor metrics like cost, health, security posture, and performance of your applications with less effort and at scale. These capabilities weave an application-centric view across multiple AWS consoles. 

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-1.png "Application Operations")

In complex cloud environments, managing applications can be challenging and time-consuming for many organizations. The challenge lies not only in managing individual resources, but also in performing application tasks throughout different stages of the application lifecycle. This fragmented approach makes it difficult to identify which resources are associated with specific applications, leading to increased response times during critical events and complications in accessing relevant operational data.

To address these challenges, establishing a solid foundation for resource management is essential. This foundation begins with developing a comprehensive understanding of the resource landscape and implementing a robust tagging strategy centered around applications. By doing so, organizations can transition toward an application-centric view within AWS. 

This approach enables customers to quickly identify resources related to specific applications, understand their interdependencies, and take appropriate actions when needed. It also streamlines monitoring, troubleshooting, and cost optimization efforts by providing a clearer picture of how resources are utilized within each application context.

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-2.png "Application Operations")


### **Establishing the Foundation** 

AWS customers often deal with numerous resources within a single account, and the lack of a unified view into their applications can significantly hinder efficient action and decision-making. To help customers scale their operations while achieving business objectives, resource management services offer core primitives, concepts, and technologies for exploring, organizing, and managing AWS resources effectively. These services provide the essential building blocks that customers can leverage to handle resources at scale in alignment with their business goals. The foundation of this approach consists of following components: Tagging, Tagging Policies, Resource Groups, and Resources Explorer. 

AWS Resource Explorer aggregates detailed information about AWS resources and a centralized location to act on them. You can view details about your resource footprint, assess governance such as how many untagged resources and explore detailed resource metadata and relationship graphs for resources. By identifying resources within your account is the first step to understanding your resource landscape. 

Tagging is a crucial step in organizing resources and simplifying resource management. It allows customers to track various resources efficiently. While many organizations already use tags for departments, environments, and cost centers, adding an application tag is particularly valuable. This tag helps identify which application each resource is associated with, providing a clear link between individual resources and the applications they support. To implement application tagging, start by identifying all resources that operate within each application. Develop a consistent tagging strategy that includes the application name, and apply these tags systematically across all relevant resources. 

Ensure that tagging is part of your resource provisioning process to maintain consistency. An example, a retail customer with hundreds of applications running on AWS. This means managing thousands of AWS resources like, Amazon EC2 instances, Amazon S3 buckets, Amazon Relational Database Service (RDS) databases, and AWS Lambda functions. These resources can have part of various applications such as inventory management, point-of-sale systems (POS), customer loyalty programs, and e-commerce platforms. 


```json
Example for tagging schema for POS system and inventory manager can be as:
Application name ("pos-system", "inventory-manager")
Environment (e.g., "production", "development", "testing")
Business unit (e.g., "north-america", "europe", "e-commerce")
Cost center (e.g., "it-ops", "marketing", "sales")
```


By applying this tagging schema, as a retail customer you can during critical events like Cyberweek sales, find and respond promptly to performance issues related to POS-Systems. As you will be able to pinpoint the relevant resources from application centric view.

Tagging and Resource Groups work together with how customers conceptualize their environments. Resource Groups allow you to organize AWS resources into components that reflect applications, projects, or workloads. This approach provides a intuitive way to manage and monitor resources collectively. To effectively use resource groups, create them based on your application tags. Include all relevant resources for each application in its corresponding group. These groups can then be used for collective management tasks, such as monitoring, permissions, and cost tracking. 

Following our example of a retail customer using tagging schema, all resources tagged with "Application: pos-system" and "Environment: production" were grouped together. Providing one single view on all AWS resources that are part of pos-system for the production environment.

### **Defining an Application** 

Building on tags and Resource Groups, defining applications as cohesive units within AWS allows for a truly application-centric approach to Cloud Operations. This step involves creating a formal application definition that encompasses all related resources and their interdependencies. To establish applications, use AWS services like AWS Service Catalog AppRegistry to define and manage applications. Include all relevant resource groups and individual resources in the application definition, and define the application's lifecycle stages and associated management processes.

In our retail customer example, will be using AWS Service Catalog AppRegistry to formalize the application definition, including all resource groups and individual resources like web servers, databases, and load balancers. Establishing lifecycle stages (Development, Staging, Production) and associate management processes.

By using this approach, you can create a solid foundation for application-centric resource management in AWS. This approach enables efficient operations, better visibility into application health and performance, and improved alignment between IT resources and business objectives. It sets the stage for advanced management capabilities, such as automated scaling, simplified disaster recovery, and accurate cost allocation. As you progress through these steps, you'll find that your AWS environment becomes organized, manageable, and aligned with your business needs, ultimately leading to improved operational efficiency and better resource utilization. Building the mental model focusing on applications.

### **Application-centric views** 

Application operations requires a consistent application model; [AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/intro-app-registry.html) stores application metadata, [AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html) logically groups application resources, and resource tagging organizes the application’s resources into searchable resource groups.

When an AppRegistry application is created, AppRegistry associates the AWS resources as a resource group using a vended application tag. The tag key is **awsApplication** and the value is a unique identifier for the application. The tag key and value are both case sensitive. Any AWS resources tagged with this key-value pair become part of the application. This application tag allows AWS services to support application operations by referencing that application tag within their consoles and APIs.

By using this approach, you can create a solid foundation for application-centric resource management in AWS. This approach enables efficient operations, better visibility into application health and performance, and improved alignment between IT resources and business objectives. It sets the stage for advanced management capabilities, such as automated scaling, simplified disaster recovery, and accurate cost allocation. As you progress through these steps, you'll find that your AWS environment becomes organized, manageable, and aligned with your business needs, ultimately leading to improved operational efficiency and better resource utilization. Building the mental model focusing on applications.

The myApplications dashboard uses the application tag to provides a combined view of metrics for your chosen application, including cost and usage, security, and operations metrics and insights from multiple AWS services. myApplications supports automatically adding resources using existing tags. You can use your existing tags to automatically add resources and to update your application as you add and remove the selected tag from resources over time.

With myApplications dashboard, you can dive deeper to act on specific resources in the relevant services, such as [Amazon CloudWatch](https://aws.amazon.com/cloudwatch) for application performance, [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) for cost and usage, and  [AWS Security Hub](https://aws.amazon.com/security-hub/) for security findings, etc.

#### **Cost & Usage Widget**

Customers find it challenging to predict the costs of their application resources and optimize costs. To understand your application resource costs, you can monitor your spend at a glance and learn current and forecasted monthly costs of your applications. You can dive deep into cost trends and click to take action to optimize costs of your applications on AWS.

The Cost & Usage widget visualizes your AWS resources’ costs from AWS Cost Explorer, including the application’s current and forecasted month-end costs, top five billed services, and a monthly application resource cost trend chart. You can monitor spend, look for anomalies, and savings opportunities

Customers who leverage AWS Organizations and enable AWS Cost Explorer at the organization level do not have to explicitly enable it in member accounts. Cost Explorer may already be enabled for customers based on their FinOps strategies; for new customers or those who operate multiple standalone accounts, enabling Cost Explorer is a general best practice and can be enabled through Cost Explorer console. This helps maximize the myApplications experience by providing a way to understand what an application is costing you verse looking at individual resources spend. For more information on, visit [Enabling Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html).

#### **DevOps widget**
As enterprises increasingly adopt cloud-based architectures to power their critical business applications, the need for comprehensive operational insights becomes paramount. These applications often rely on a complex, distributed set of infrastructure resources and services, making it challenging for IT teams to maintain visibility and control over the overall health and compliance of the entire application environment.

The DevOps widget addresses this challenge by providing a centralized view of key operational insights for your application. This widget surfaces critical information about fleet management, compliance and OpsItems management - empowering your teams to quickly assess the overall operational posture of your application and take necessary actions to ensure compliance and reliability.

By monitoring the data in this widget, you can gain valuable insights into the operational health of your application infrastructure, identify any compliance drift, and proactively address them before they impact your users. This helps your teams to be more responsive, efficient, and effective in managing the operational lifecycle of your critical business applications on AWS.

 The information that is provided from Systems Manager provides node management and Config evaluates the compliance status from a resource level to the rules that are deployed.

The node management information identifies if the instances are managed by Systems Manager, the patch compliance state from [patch policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-create-a-patch-policy.html), and any OpsItems that are associated with the resources along with the severity level. For an instance to be managed with Systems Manager there are three prerequisites that must be met. First, the SSM agent must be installed. Second, the [SSM agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) needs the necessary permissions to perform actions on the node on your behalf. You can do this by either using [Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) through [host management](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-host-management.html) or use [Default Host Management (DHMC)](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-default-host-management-configuration.html) or add the necessary IAM role and permissions through IaC when you deploy your resources. And lastly, the SSM agent must have network connectivity to service endpoints over the internet or by using [VPC endpoints.](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html) 

Systems Manager, [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-installing-patches.html) uses patch baselines that allow you to define certain criteria for patching your instances. You can also use Patch Policies to scale patching across your AWS Organization and Regions. You will also see operation data from [Systems Manager OpsCenter](https://docs.aws.amazon.com/systems-manager/latest/userguide/OpsCenter.html). OpsCenters creates OpsItems that are associated to operational issue or interruption that needs investigation and remediation. You can create OpsItems that integrate with other AWS services like Amazon CloudWatch where an EC2 instance might be reaching its CPU Utilization or create an OpsItem for Security Hub findings.

The other component is the Config data that is being collected around the compliance status of your resources against the rules that are deployed within your account. First, the widget presents an aggregated percentage of rule compliance status based on how many rules in the account are compliant and do not have resources that are non-compliant. Second, the widget provides a p compliance status percentage for your application resources, that indicates whether your application resources are compliant with selected rules.

#### **Security widget**

Security teams assessing security findings on AWS resources need time to piece together the application context needed to understand business criticality, prioritize next steps, and identify a path to resolution.To improve security posture of your application, you can gain visibility into the security posture of your AWS-based applications more quickly. Developers, security teams, and application teams can identify security risks and prioritize issues quickly based on the application criticality to them.

 Security widget displays information from AWS Security Hub around the resources that make up that application. AWS Security Hub is a cloud security posture management (CSPM) service that streamlines security operations with automated, continuous, security best practice checks against your AWS resources to help you identify misconfigurations. Security Hub aggregates your security alerts (i.e. findings) in a standardized format and prioritizes them so that you can more easily enrich, investigate, and remediate them.

Security Hub reduces the complexity and effort of managing and improving the security of your AWS accounts, workloads, and resources. You can enable Security Hub across all your accounts and Regions. 

**Compute widget**

Many enterprises operate a large portfolio of complex, distributed applications on AWS to support their critical business operations. These applications rely on a variety of compute resources, including EC2 instances and Lambda functions, to deliver the required performance and scalability. However, without a centralized view of the compute metrics and utilization across all these applications, it becomes extremely challenging for IT teams to effectively monitor the health and capacity of their application infrastructure.

AWS recommends using AWS Compute Optimizer to identify your application rightsizing opportunities. AWS Compute Optimizer analyzes the specifications such as vCPUs, memory, or storage, and the CloudWatch metrics of your running resources from a period over the last 14 days (Default period) up to 93 days.

The Compute widget in the myApplications dashboard addresses this need by providing a consolidated, at-a-glance perspective on the compute resources powering each application. This widget displays key information and metrics about the compute resources you have configured, such as the total number of alarms, the different compute resource types, and performance trends like EC2 instance CPU utilization and Lambda invocations. By monitoring the data in this widget, you can gain valuable insights into the operational health and capacity of your application's compute infrastructure. This empowers IT teams to quickly assess the overall compute capacity, identify performance bottlenecks, and proactively scale resources as needed to ensure their applications remain available and operating at peak efficiency 24/7.

#### **Monitoring and operations widget**

The Monitoring and operations widget shows alarms and canary alarms for resources associated with your application, application service level indicator (SLIs) and metrics, and other available AWS CloudWatch Application Signals metrics.

An alarm refers to the state of a probe, monitor, or change in a value over or under a given threshold. When creating alarms there are few things to consider: 1/ Always work backwards from your objectives (alert on things that are actionable), 2/ If an alarm does not need alert you, or trigger an automated process, then there is no need to have it alert you.

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) instruments your applications on AWS so that you can monitor the health of your application and track performance against your business objectives while providing a view of your applications, services, and dependencies, and helps you monitor and triage application health.

CloudWatch Synthetics monitoring ([canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)) integrates with Application Signals. Canaries are a powerful feature that allow you to monitor endpoints and APIs using scheduled synthetic behavior that follow the same routes and perform the same actions as end users of your applications. They enable you to continually assess customer experience and discover issues before end users do.

If you are new to observability or need guidance to figuring out how to set up metrics, alarms, or develop an observability strategy, the [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/) outlines how you can get started understanding the different components to observability and what metrics, alarms, etc. are beneficial to monitoring.

*Note: For customers who operate in container based applications for you to be able to tag clusters, task, etc you will been to manually tag those resources specifically non-EC2.*

### Strategy to execution 

1. Starting by developing a comprehensive tagging strategy, focusing on application names, environments, business units, and cost centers. [Building your tagging strategy](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html)
2. Systematically apply these tags across all relevant resources, making it part of their provisioning process. Using AWS Resource Groups & Tag Editor to allow you to create, manage, and search for resources based on their tags. Providing a centralized way on account level to manage tags across multiple AWS services. [Resource Groups and Tagging for AWS](https://aws.amazon.com/blogs/aws/resource-groups-and-tagging/)
3. Create Resource Groups based on these tags, such as grouping all production POS system resources together. Using AWS Service Catalog AppRegistry, they would formally define their applications, including all components and interdependencies for systems like the POS and inventory management. [Key concepts of AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/overview-appreg.html#ar-user-tags)
4. Utilize the myApplications dashboard to gain a unified view of their retail applications, monitoring critical metrics during high-stakes events like Cyber Week sales. You can create your applications more easily using the Create application wizard, connecting resources in your AWS account from one view in the console. The created application will automatically display in myApplications, and you can take action on your applications. [myApplications in the AWS Management Console simplifies managing your application resources](https://aws.amazon.com/blogs/aws/new-myapplications-in-the-aws-management-console-simplifies-managing-your-application-resources/)

### **Further reading:** 

* [Defining and publishing a tagging schema](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html) 
* [Best Practices for Tagging AWS Resources](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)
* [Implementing automated and centralized tagging control](https://aws.amazon.com/blogs/mt/implementing-automated-and-centralized-tagging-controls-with-aws-config-and-aws-organizations/)


### Conclusion 

As customers businesses continue to grow and evolve in the cloud, adopting these best practices for resource management is essential. By laying the foundation, organizations can not only meet their current needs and for future growth and innovations. AWS Application Operations and the myApplications takes this approach a step further, offering a consolidated view of application resources and metrics. This empowers teams to make informed decisions quickly, respond to issues proactively, and manage resources more effectively at scale.

