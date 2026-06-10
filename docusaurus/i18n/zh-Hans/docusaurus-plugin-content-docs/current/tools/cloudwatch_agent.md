# CloudWatch Agent


## 部署 CloudWatch agent

CloudWatch agent 可以作为单次安装进行部署，使用分布式配置文件、分层多个配置文件或完全通过自动化来完成。哪种方法适合您取决于您的需求。[^1]

:::info
	Windows 和 Linux 主机的部署都能够将配置存储和检索到 [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html)。通过这种自动化机制来处理 CloudWatch agent 配置的部署是最佳实践。
:::

:::tip
	或者，CloudWatch agent 的配置文件可以通过您选择的自动化工具（[Ansible](https://www.ansible.com)、[Puppet](https://puppet.com) 等）进行部署。不要求必须使用 Systems Manager Parameter Store，但它确实简化了管理。
:::
## 在 AWS 之外部署

CloudWatch agent 的使用*不*限于 AWS 内部，它在本地环境和其他云环境中也受支持。在 AWS 之外使用 CloudWatch agent 时需要注意两个额外事项：

1. 设置 IAM 凭证[^2]以允许 agent 进行所需的 API 调用。即使在 EC2 中，对 CloudWatch API 也没有未经身份验证的访问[^5]。
1. 确保 agent 能够连接到 CloudWatch、CloudWatch Logs 和其他 AWS 端点[^3]，使用满足您要求的路由。这可以通过互联网、使用 [AWS Direct Connect](https://aws.amazon.com/directconnect/) 或通过[私有端点](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html)（通常称为 *VPC endpoint*）实现。

:::info
	您的环境与 CloudWatch 之间的传输需要符合您的治理和安全要求。广义而言，对于 AWS 之外的工作负载使用私有端点甚至能满足监管最严格行业客户的需求。然而，大多数客户通过我们的公共端点即可得到良好服务。
:::
## 使用私有端点

为了推送 metrics 和 logs，CloudWatch agent 必须能够连接到 *CloudWatch* 和 *CloudWatch Logs* 端点。根据 agent 的安装位置，有几种方法可以实现。

### 从 VPC

a. 您可以利用 *VPC Endpoints*（用于 CloudWatch 和 CloudWatch Logs）在您的 VPC 和 CloudWatch 之间建立完全私有和安全的连接，使运行在 EC2 上的 agent 的流量永远不经过互联网。

b. 另一种替代方案是拥有一个公共 [NAT 网关](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)，私有子网可以通过它连接到互联网，但不能接收来自互联网的主动入站连接。

:::note
	请注意，使用这种方法 agent 流量将逻辑上通过互联网路由。
:::
c. 如果您没有在现有 TLS 和 [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) 机制之外建立私有或安全连接的要求，最简单的选择是使用 [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) 来提供到我们端点的连接。

### 从本地或其他云环境

a. 在 AWS 之外运行的 agent 可以通过互联网（通过其自身的网络设置）或 Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) 建立到 CloudWatch 公共端点的连接。

b. 如果您要求 agent 流量不通过互联网路由，您可以利用由 AWS PrivateLink 支持的 [VPC Interface endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html)，通过 Direct Connect Private VIF 或 VPN 将私有连接扩展到您的本地网络。您的流量不会暴露在互联网上，从而消除了威胁向量。

:::success
	您可以使用从 [AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) 获取的凭证，为 CloudWatch agent 添加[临时 AWS 访问令牌](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/)。
:::

[^1]: 参见 [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) 获取 CloudWatch agent 使用和部署指导的博客。


[^2]: [为在本地和其他云环境中运行的 agent 设置凭证的指南](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [如何验证到 CloudWatch 端点的连接](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [本地私有连接博客](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: 所有与 observability 相关的 AWS API 的使用通常通过[实例配置文件](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)来完成——这是一种向在 AWS 中运行的实例和容器授予临时访问凭证的机制。
