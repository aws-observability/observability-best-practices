---
sidebar_position: 6
---
# 远程和会话管理

远程和会话管理包括 Run Command、Fleet Manager 和 Session Manager 等功能。

## 远程管理

使用 Run Command（AWS Systems Manager 中的一个工具），您可以远程安全地管理托管节点的配置。Run Command 允许您自动化常见的管理任务，并大规模执行一次性配置更改。您可以从 AWS Management Console、AWS Command Line Interface (AWS CLI)、AWS Tools for Windows PowerShell 或 AWS SDK 使用 Run Command。

![远程管理](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "远程管理")

Run Command 的常见用例包括：

* **引导节点：** 您可以在所有或特定节点上安装或引导应用程序。
* **配置管理：** Systems Manager 支持多种领域特定语言（DSL），包括 [Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/)、[Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/) 和 [PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/)。
* **加入域：** 将节点加入 Windows 域
* **部署其他 Amazon 代理：** 在 Parameter Store 中存储代理配置

### 复合命令文档

这些 Systems Manager 文档定义了您希望在托管节点上执行的操作。Systems Manager 提供了多种预定义的公共文档，并支持自定义文档。您可以在配置过程中[执行复合文档](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/)。复合文档执行一个或多个辅助文档的任务。

使用复合命令文档时需要注意的是，它只支持顺序操作，不支持分支。您可以通过 AWS-RunDocument 来执行存储在 Systems Manager、私有或公共 GitHub 或 Amazon S3 中的文档。这是通过使用 [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) 和 [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument) 插件实现的。aws:runDocument 插件执行位于 Systems Manager 或本地路径中的文档。一个示例是 AWS-RunPatchBaselineWithHooks。

### 限制 Run Command

您可以通过 IAM 用户/角色来限制用户在会话中可以运行的命令。在文档中，您定义用户启动会话时运行的命令以及用户可以提供的参数。您可以基于以下条件限制访问：ssm:SendCommand、文档名称或前缀、资源标签和资源 ID。您还可以使用 SAML 会话标签强制执行 ABAC 策略。

![限制 Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "限制 Run Command")

1. 例如，您可以根据 [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) 用户所属的部门授予对特定托管节点的访问权限。
1. Alice 和 Bob 使用其外部身份提供商（IdP）联合登录到 [AWS Management Console](http://aws.amazon.com/console)。两个联合用户必须根据各自的"部门"成员身份（分别为 Amber 和 Blue）使用 Session Manager 访问特定的 EC2 实例。

### 多账户和多区域 Run Command

* Run Command 本身是按账户/区域运行的
* 利用 Automation 跨账户/区域调用

Automation 是 AWS Systems Manager 中的一个工具，它简化了常见的维护、部署和修复任务。您可以利用它来定位多个账户/区域。对于多账户/多区域自动化，当定位子账户时，命令文档需要存在于目标账户/区域中。您可以使用 CloudFormation 或 Terraform 来部署命令文档。必须为 Systems Manager 服务设置适当的权限才能执行自动化操作。有关更多信息，请参阅 Automation 部分。

![多账户和多区域 Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "多账户和多区域 Run Command")

### 通过 AWS Systems Manager State Manager 关联调度 Run Command

State Manager 帮助您自动化保持托管节点（来自 AWS、本地或多云环境）处于所需状态的过程。在 State Manager 中，关联是文档中表达的配置、一组目标和特定计划之间的绑定，以确保一致的状态。您可以通过创建带有 Runbook 的 State Manager 关联来启动自动化。与配置关联的命令文档需要存在于每个目标账户/区域中。

![调度 Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "调度 Run Command")

### 处理错误、退出和重启代码

默认情况下，脚本中最后运行的命令的退出代码将作为整个脚本的退出代码报告。

* `Exit 0` 结果状态为：`Success`
* `Exit 1` 或其他*，结果状态为：`Failed`
* 您可以包含特定的退出代码以更快地识别错误。
* 重启代码：
  * Windows：`exit 3010`
  * Linux：`exit 194`

![调度 Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "调度 Run Command")

### 使用 Amazon CloudWatch 监控 Run Command

AWS Systems Manager 将有关 Run Command 命令状态的 metrics 发布到 CloudWatch，使您能够基于这些 metrics 设置告警。Systems Manager 推送到 CloudWatch 的特定 metrics 包括命令的 ```Delivery Time Out```、```Failed``` 数量和 ```Successful``` 数量。

要了解有关监控 Run Command 的更多信息，请访问[使用 Amazon CloudWatch 监控 Run Command metrics](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html)。

## 会话管理

AWS Session Manager 是完全托管的 AWS Systems Manager 工具。您可以使用交互式一键浏览器 shell 或 AWS Command Line Interface (AWS CLI) 与托管节点进行交互。Session Manager 提供安全的节点管理，无需打开入站端口、维护堡垒主机或管理 SSH 密钥。您能够遵守要求控制对托管节点的访问、严格安全实践以及包含节点访问详细信息的日志的企业策略，同时为最终用户提供简单的一键跨平台访问您的托管节点。

### 治理

![治理](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "治理")

* ***将用户与数据分离***: 云运维的一个关键原则是尽可能将用户与数据分离。Session Manager 关闭了允许任何拥有凭证的人访问并可能更改服务器配置的入站网络端口。Session Manager 可以进一步限制用户只能运行单个命令并查看结果，而无需进行交互式会话。

* ***集中管理访问***: 云运维可能导致环境中弹性且持续变化的流。与其在每台服务器上维护谁可以访问每台服务器，Session Manager 与 Identity Access Management 集成，允许集中定义谁可以访问哪些节点。

* ***控制对工作负载和组件的访问***: 组织可以使用 IAM 根据工作负载或角色控制对节点的访问。例如，数据库管理员可能能够远程访问任何标记为"Component: Database"的实例，或者应用程序开发人员可以远程访问任何标记为"Environment: Development"的实例。这种基于属性的访问控制允许项目团队按需快速交付业务价值，同时组织可以确信他们在定义的护栏内运行。

* ***将命令限制为特定角色：*** 如我们在"将用户与数据分离"中提到的，可以允许某个角色仅执行该角色所需的特定命令集。例如，应用程序开发人员可以在生产环境中"tail"其应用程序的日志文件，而无需对生产环境进行交互式访问。

* ***基于业务原因授予临时访问权限***: 借助开源和商业临时权限提升解决方案提供的额外功能，甚至可以拒绝所有操作员的远程访问，除非他们有正当的业务理由访问服务器。例如，生产应用服务器将没有任何远程访问方式。但是，在事件期间，操作员可以请求并获得对服务器的临时访问权限以调查事件。此访问权限将与记录的原因相关联，由第二位操作员批准，并且仅在完成工作所需的时间内有效。

### Observability 与合规性

* **记录虚拟机和容器会话活动以及监控托管节点的访问和活动：** 当从 AWS 控制台使用 Session Manager 启动终端会话时，会话的所有命令及其结果都可以记录到 S3 和 CloudWatch Log Groups。这可以提供交互式会话期间所有更改的审计跟踪。您还可以使用 CloudTrail 事件来监控（如有必要，对其发出告警）成功和失败的远程会话到节点的连接。例如，在定义的变更窗口之外进行的远程会话可以向相关人员及其经理发出告警。

### 简化运维

* **从控制台一键访问：** Session Manager 与 AWS 控制台深度集成，从 EC2 控制台、Session Manager 控制台和 Fleet Manager 控制台提供"连接"选项。
* **无需管理 SSH：** 使用 Session Manager，无需管理 PKI 基础设施的创建、分发和刷新以实现对弹性节点群的 SSH 访问。通过 IAM 的集中授权取代了在整个集群中存储、保护和监控私钥的需求。
* **允许访问而无需打开安全组：** 使用 Session Manager 的"端口转发"功能，您可以允许授权访问您的节点，而无需打开或扩大对实例远程会话端口的网络访问。例如，开发人员可以通过从其家用开发机器通过 Session Manager 服务端口转发到相关实例的方式，通过完全加密和经过身份验证的管道安全访问测试环境的数据库实例。
* **集中访问：** 与控制台和 IAM 的集成允许操作员从任何需要的地方获得所需（并获得授权的）远程访问。
* **降低"爆炸半径"：** 锁定入站网络端口并将远程访问集中限制为仅用户角色所需的节点，我们降低了任何潜在安全漏洞可能造成的"爆炸半径"。

### 优化 IT 成本

* **无需堡垒主机或跳板机：** Session Manager 可以消除在您的环境中使用堡垒主机或跳板机的需求——消除全天候运行的实例成本。这意味着替换那些开放 SSH 和 RDP 入站网络端口以及通过 SSH 和 RDP 出站访问环境中其他节点的主机。相反，访问通过与云环境其余部分相同的机制——IAM——来保护，提供细粒度的授权和对目标节点的临时凭证访问。
* **访问 EC2 实例无需额外费用**：除了 EC2 现有的实例费用外，使用 Session Manager 允许远程访问您的 EC2 节点和容器不需要额外费用。

### Session Manager 如何工作？

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. SSM 代理必须安装在节点上，并且端口 443 出站必须能够连接到 Systems Manager 服务。
2. 此连接可以连接到公共服务端点（即通过互联网）或可以通过 VPC 中的私有端点连接。
3. 节点需要具有正确权限的配置文件，以通过网络连接到服务并建立持久连接。

**注意：** 默认本地用户：`ssm-user.` Linux：/etc/sudoers，Windows：Administrators 组。

### 使用 Session Manager 建立连接

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. 用户想要远程连接到该节点，则用户必须尝试与该节点"启动会话"。
2. Session Manager 将检查用户是否被允许在该特定 EC2 实例上"启动会话"。
3. IAM 将检查用户/主体的权限。
4. 节点通过其与 AWS Systems Manager 的持久连接获知授权的连接请求。
5. 然后节点通过 AWS Session Manager 服务向请求用户建立加密隧道。

### Session Manager 首选项

Session Manager 首选项提供了在该账户的区域级别配置 Session Manager 首选项的位置。任何更改将应用于该账户/区域中的所有会话，除非设置被覆盖（例如，通过从命令行传入特定设置）。

* **会话持续时间/超时**：AWS Session Manager 会话的最短持续时间为 1 分钟，最长为 1,440 分钟（24 小时）。除了最大持续时间外，您还可以配置空闲会话超时，在至少 1 分钟到最多 60 分钟的非活动期后结束会话。
* **会话加密设置**：AWS KMS 密钥加密为客户端机器和托管节点之间传输的数据提供额外保护。某些 Systems Manager 功能（例如重置节点用户密码）需要启用 AWS KMS 加密。
* **Linux/MacOS 的 Run As 支持：** Run As 功能使得可以使用指定操作系统用户的凭证启动会话，而不是使用 AWS Systems Manager Session Manager 可以在托管节点上创建的系统生成的 ssm-user 账户的凭证（尽管 RunAs 仅适用于 Linux 和 MacOS 节点）。
* **用于审计和报告的会话日志记录**：配置 Session Manager 将会话历史日志创建并发送到 Amazon Simple Storage Service (Amazon S3) 存储桶或 Amazon CloudWatch Logs 日志组。存储的日志数据随后可用于审计或报告对托管节点的会话连接以及会话期间在其上运行的命令。
* **Shell 配置文件/首选项**：可自定义的配置文件允许您在会话中定义首选项，如 shell 首选项、环境变量、工作目录以及在会话启动时运行多个命令。

### 会话加密

* 会话默认使用 TLS 1.2 加密
  * 您可以使用 KMS 密钥启用额外的加密层
* 某些 Fleet Manager 操作（如密码重置）需要启用 KMS 加密
* 使用 KMS 加密的会话在会话启动后将显示一条消息

**注意：** 要使用 KMS 添加额外的加密层，您需要将 KMS 加密密钥添加到首选项设置中。托管节点和用户都需要 IAM 权限才能使用 Session Manager。添加 KMS 加密将增加您必须分配给节点和用户的权限。

### 会话日志记录

在首选项设置中，您可以启用会话日志记录。会话日志是终端会话期间发出的所有命令和显示结果的记录。您可以将它们发送到 CloudWatch 或 S3 或两者。

这允许您使用加密的日志组和 S3 存储桶。这些资源的实际加密设置将在 CloudWatch 和 S3 中进行。需要向 EC2 实例配置文件授予对 S3 存储桶和 CW 日志组的访问权限以及"s3:GetEncryptionConfiguration"等权限。对于 CloudWatch 日志记录，您可以在输入时流式传输日志（这是推荐选项）或在会话结束时发送日志。

**注意：** 如果您在 Windows Server 托管节点上配置了 **PowerShell Transcription** 策略设置，您将***无法***将会话数据流式传输到 CloudWatch 或 S3。如果您使用 Linux 或 macOS 托管节点，请确保已安装 screen 实用程序。如果未安装，您的日志数据可能会被截断。

* CloudWatch 日志记录将允许 Session Manager 记录发出的每个命令及其在 CloudWatch 中向用户显示的结果以供审计。使用此信息（以及记录到 CloudTrail 的 Session Manager 事件），客户可以将 IAM 身份与使用服务器上 ssm-user 本地用户运行的命令关联起来。
  * 流式日志以 json 格式存储
* AWS Systems Manager Session Manager 的"会话历史记录"选项卡提供了从单个 Session Manager 会话到该会话的 CloudWatch 日志或 S3 记录的直接链接。
* 您需要确保具有 SSM、CloudWatch 和 S3 所需权限的必要 IAM 角色已就位以记录会话日志。

有关更多信息，请访问[开始创建具有 Session Manager 和 Amazon S3 及 CloudWatch Logs 权限的 IAM 角色](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging)。

### 如何应用会话首选项

* SSM-SessionManagerRunShell 文档使用提供的设置创建并应用于该区域中的账户
* 可以使用 SessionManagerRunShell.json 配置自定义首选项，然后创建传递 json 文件的 SSM-SessionManagerRunShell 文档
* 通过更新 SessionManagerRunShell.json 文件并运行 Update-document API 更新 SSM-SessionManagerRunShell 文档来更新首选项

有关会话首选项的更多信息，请访问[开始配置首选项](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html)。

### 使用 Session Manager 连接到实例有哪些不同方式？

1. **标准会话：** 从 EC2 控制台（连接到实例）或 Fleet Manager（启动终端会话）连接，或者您可以在两个控制台中为 Windows 选择通过 RDP 连接。
    1. 标准会话打开终端命令行会话。对于 Linux，它打开 shell；对于 Windows，它打开 PowerShell 会话。
    2. ssm-user 在实例上第一次启动会话时创建。并自动添加到 Windows 的 Admin 组和 Linux 的 sudoers。

**注意：** 如果用户被删除，SSM 代理不会重新创建它，这将导致 Session Manager 无法连接。

1. **SSH：** SSH 隧道允许您通过安全通道将对本地端口的连接转发到远程机器。
    1. 仅通过 AWS CLI
    1. 需要 SSH 密钥
        1. 允许通过 SCP 复制文件
    1. 修改 SSH 配置文件
    1. 日志记录
        1. 无会话命令日志记录
        1. 仅限于：会话历史记录、CloudTrail

限制：会话命令不会被记录。这是因为 SSH 加密所有会话数据，而 Session Manager 仅作为 SSH 连接的隧道。您可以使用会话历史记录和 CloudTrail 来查看会话。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **端口转发：**
    1. 仅通过 AWS CLI 和 Session Manager 插件
        1. 包括 CloudShell！
    1. 启用隧道用例
        1. 隧道到 EC2、RDS、Fargate、ElastiCache
    1. 通过 Fleet Manager 启用 RDP
        1. 日志记录
        1. 无会话命令日志记录
        1. 仅限于：会话历史记录和 CloudTrail

**注意：** 通过端口转发或 SSH 连接的 Session Manager 会话不支持日志记录。这是因为 SSH 加密所有会话数据，而 Session Manager 仅作为 SSH 连接的隧道。

您为 portNumber 指定的值表示流量应重定向到的托管节点上的远程端口，例如 80。如果未指定此参数，Session Manager 将假定 80 为默认远程端口。

您为 localPortNumber 指定的值表示流量应重定向到的客户端上的本地端口，例如 56789。这是您连接到托管节点时使用客户端输入的值。例如，localhost:56789。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### 限制标准会话的访问

您可以使用 IAM 提供的最小权限原则来控制对节点的访问，有两个要素。
您可以限制 Session Manager 使用的用户账户在实例上允许执行的操作，也可以限制 IAM 主体被允许与哪些实例启动会话。

对于 Windows 托管节点，用户可以使用任何可用的 Windows 用户（例如，如果节点加入域则使用 AD 用户）通过 RDP 会话连接。但是，如果用户使用终端会话连接，则唯一的选项是 ssm-user。要限制 ssm-user 在 Windows 节点上可以执行的操作，管理员/用户可以更改 ssm-user 所属的组（默认情况下它是 Administrators 组的成员）。

对于 Linux 托管节点，用户可以配置"Run As"首选项来更改终端会话连接时使用的用户。默认情况下是具有 sudo 权限的 ssm-user。使用"Run As"，用户可以将 ssm-user 更改为不同的默认用户。

或者，您可以指定一个标签，用于根据 IAM 用户角色上该标签的值来确定用户可以以什么身份连接。

**注意：** 如果您使用 IAM Identity Center 和权限集来控制用户访问，而 IAM Identity Centre 用户无法设置标签，这会使 Run As 对这些用户的灵活性降低。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### EC2 Instance Connect 如何？

Session Manager 是关于通过出站认证和授权的链接到 AWS Session Manager 来保护和简化到节点的远程连接，而"EC2 Instance Connect"是关于简化到 EC2 Linux 主机的入站 SSH 连接。

EC2 Instance Connect 通过生成和使用通过 EC2 元数据服务与实例共享的短期 SSH 密钥来简化 SSH 管理。它要求尝试远程连接的用户在端口 22 上具有入站网络访问权限，最后 EC2 Instance Connect 仅适用于在 EC2 中运行的 Linux 主机，而 Session Manager 可跨平台和跨云工作。

## Fleet Manager

Fleet Manager 为一个账户中一个区域内的所有节点提供统一控制台（您可以更改区域以在其他区域中获得类似视图）。您可以查看元数据，例如它们是否连接到 Systems Manager、代理版本等。允许操作员在统一控制台中跨平台执行常见管理任务可以提高系统管理员的效率。

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Fleet Manager 的用例

* 执行各种常见系统管理任务，无需手动连接到托管节点。
* 集中式 UI 远程管理服务器：您可以查看不同平台实例及其状态、SSM 代理状态、平台信息。可以从 UI 下载报告用于管理目的。
  * 从单个统一控制台管理在多个平台上运行的节点。
  * 从单个统一控制台管理运行不同操作系统的节点。
* 提高系统管理效率。

### Fleet Manager 如何与节点交互？

Fleet Manager 调用以 ```AWSFleetManager-*``` 为前缀的文档。文档使用 Run Command 或 Session Manager 来获取结果并在 Fleet Manager 控制台中显示。
