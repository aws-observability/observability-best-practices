# CloudWatch Agent


## Deploying the CloudWatch agent

The CloudWatch agent can be deployed as a single installation, using a distributed configuration file, layering multiple configuration files, and entirely though automation. Which approach is appropriate for you depends on your needs. [^1]

!!! success
	Deployment to Windows and Linux hosts both have the capability to store and retrieve their configurations into [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html). Treating the deployment of CloudWatch agent configuration through this automated mechanism is a best practice. 

!!! tip
	Alternatively, the configuration files for the CloudWatch agent can be deployed through the automation tool of your choice ([Ansible](https://www.ansible.com), [Puppet](https://puppet.com), etc.). The use of Systems Manager Parameter Store is not required, though it does simplify management.

## Deployment outside of AWS

The use of the CloudWatch agent is *not* limited to within AWS, and is supported both on-premises and in other cloud environments. There are two additional considerations that must be heeded when using the CloudWatch agent outside of AWS though:

1. Setting up IAM credentials[^2] to allow agent to make required API calls. Even in EC2 there is no unauthenticated access to the CloudWatch APIs[^5].
1. Ensure agent has connectivity to CloudWatch, CloudWatch Logs, and other AWS endpoints[^3] using a route that meets your requirements. This can be either through the Internet, using [AWS Direct Connect](https://aws.amazon.com/directconnect/), or through a [private endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) (typically called a *VPC endpoint*).

!!! info
	Transport between your environment(s) and CloudWatch needs to match your governance and security requirements. Broadly speaking, using private endpoints for workloads outside of AWS meets the needs of customers in even the most strictly regulated industries. However, the majority of customers will be served well through our public endpoints.

## Use of private endpoints

In order to push metrics and logs, the CloudWatch agent must have connectivity to the *CloudWatch*, and *CloudWatch Logs* endpoints. There are several ways to achieve this based on where the agent is installed.

### From a VPC

a. You can make use of *VPC Endpoints* (for CloudWatch and CloudWatch Logs) in order to establish fully private and secure connection between your VPC and CloudWatch for the agent running on EC2. With this approach, agent traffic never traverses the internet.

b. Another alternative is to have a public [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) through which private subnets can connect to the internet, but cannot receive unsolicited inbound connections from the internet. 

!!! note
	Please note with this approach agent traffic will be logically routed via internet.

c. If you don’t have requirement to establish private or secure connectivity beyond the existing TLS and [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) mechanisms, the easiest option is to have [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) to provide connectivity to our endpoints.

### From on-premises or other cloud environments

a. Agents running outside of AWS can establish connectivity to CloudWatch public endpoints over the internet(via their own network setup) or Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html).

b. If you require that agent traffic not route through the internet you can leverage [VPC Interface endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html), powered by AWS PrivateLink, to extend the private connectivity all the way to your on-premises network using Direct Connect Private VIF or VPN. Your traffic is not exposed to the internet, eliminating threat vectors. 

!!! success
	You can add [ephemeral AWS access tokens](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) for use by the CloudWatch agent by using credentials obtained from the [AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html).


[^1]: See [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) for a blog that gives guidance for CloudWatch agent use and deployment.


[^2]: [Guidance on setting credentials for agents running on-premises and in other cloud environments](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [How to verify connectivity to the CloudWatch endpoints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [A blog for on-premises, private connectivity](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Use of all AWS APIs related to observability is typically accomplished by an [instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) - a mechanism to grant temporary access credentials to instances and containers running in AWS.
