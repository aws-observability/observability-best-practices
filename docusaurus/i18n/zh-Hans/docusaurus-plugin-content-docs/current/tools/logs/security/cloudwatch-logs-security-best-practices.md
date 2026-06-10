# CloudWatch Logs 安全最佳实践

保护 Amazon CloudWatch Logs 的安全对于维护合规性、保护敏感数据和确保适当的审计跟踪至关重要。本指南提供了围绕 log 组实施稳健权限控制和安全策略的全面最佳实践，包括关键的删除保护功能。

## 简介

Amazon CloudWatch Logs 使您能够将来自系统、应用程序和 AWS 服务的 logs 集中到一个高度可扩展的服务中（[什么是 Amazon CloudWatch Logs？](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)）。但是，如果没有适当的安全控制，log 数据可能会成为漏洞而非资产。本指南重点介绍实施最小权限访问、加密、基于资源的策略、删除保护和全面审计，以保持 log 组的安全和合规。


## 为什么这很重要

### 安全影响

Log 数据通常包含敏感信息，包括用户活动、系统配置、API 调用以及可能的个人身份信息（PII）。未经授权访问 logs 可能会暴露有关基础设施、应用行为和业务运营的关键安全细节。此外，log 组的意外或恶意删除可能导致关键审计跟踪的丢失和合规违规。

### 合规要求

许多监管框架要求围绕 log 数据实施特定控制，包括访问限制、静态和传输中加密、保留策略、删除保护和审计跟踪。适当的权限管理和删除保护是满足这些要求的基础。

### 卓越运维

结构良好的权限使团队能够访问所需的 logs，同时防止不需要的修改和删除。这种平衡支持安全和运维效率，同时维护数据完整性。



## 安全最佳实践

CloudWatch Logs 安全通过多层访问控制、删除保护和加密机制协同工作来保护您的 log 数据。实施全面安全需要结合 IAM 策略、删除保护、加密、资源策略和持续监控的多层方法。

### 1. CloudWatch Logs 层次结构和安全边界

了解 CloudWatch Logs 架构是实施有效安全控制的基础。适当的 log 组织和层次结构设计构成所有其他安全措施的基础。

CloudWatch Logs 使用直接影响安全控制的两级层次结构（[使用 log 组和 log 流](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)）：

*   **Log 组**：顶级容器，定义保留策略、加密设置、访问权限和删除保护。每个 log 组充当具有自己的 IAM 策略和 KMS 加密密钥的安全边界
*   **Log 流**：log 组内的单个 log 事件序列，通常代表单个来源（如 EC2 实例、Lambda 函数或应用进程）。Log 流继承其父 log 组的安全设置，但可以在 IAM 策略中单独定位以实现精细访问控制

#### 安全驱动的 Log 组设计

设计您的 log 组结构以匹配安全要求和访问模式（[CloudWatch Logs 权限参考](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)）：

*   **应用隔离**：为不同应用创建独立的 log 组，特别是在处理敏感数据时，以启用精细的 IAM 策略并防止跨应用 log 访问
*   **环境隔离**：为生产、预发布和开发环境使用单独的 log 组，以执行不同的访问控制和保留策略
*   **数据分类**：按敏感级别（公开、内部、机密、受限）对 logs 进行分组，以应用适当的加密、访问控制和保留策略
*   **合规边界**：为需要特殊处理和更长保留期的审计 logs、安全 logs 和合规相关数据创建专用 log 组

#### 使用 Log 流实现精细访问控制

虽然 log 组提供主要安全边界，但 log 流支持细粒度访问模式（[CloudWatch Logs 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html)）：

*   **实例级访问**：在 IAM 策略中使用 log 流名称，仅授予用户访问特定 EC2 实例或容器的 logs
*   **基于时间的访问**：实施基于创建时间或命名模式限制 log 流访问的策略
*   **服务特定流**：允许应用仅写入其指定的 log 流，同时防止访问同一 log 组中的其他流
*   **审计跟踪完整性**：利用 log 流的不可变性（一旦创建，log 事件无法修改）作为审计和合规策略的一部分

### 2. 基于身份的策略（IAM 策略）

*   使用 IAM 策略控制谁可以创建、读取和管理 log 组和 log 流（[为 CloudWatch Logs 使用基于身份的策略](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-identity-based-access-control-cwl.html)）
    - **应用最小权限原则**：创建客户管理策略，根据组织需求限制对特定 log 组的访问
    - **使用特定资源 ARN**：始终在 IAM 策略中指定明确的 log 组 ARN，而非使用通配符 (*)。这防止权限提升并确保用户只能访问预期的 log 组
    - **分离管理和运维权限**：为不同权限级别创建不同策略——例如，分析师的只读访问、应用的写入权限和基础设施团队的管理权限。永远不要将这些组合在单个过于宽泛的策略中
    - **显式拒绝删除操作**：对于关键 log 组，实施针对删除操作的显式拒绝语句，以在删除保护之外提供额外保护

*   对于将 logs 记录到 CloudWatch 的 Lambda 函数，确保 IAM 角色包含最低所需权限：`logs:CreateLogGroup`、`logs:CreateLogStream` 和 `logs:PutLogEvents`（[Lambda 执行角色](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)）

*   为可以修改或删除 log 组的特权账户实施 MFA（[管理访问权限概述](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html)）

*   **实施基于标签的访问控制**：在 log 组上使用资源标签，结合 IAM 条件键（`aws:ResourceTag`），根据环境（生产/开发）、团队所有权或数据分类级别等属性动态控制访问（[CloudWatch Logs 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html)）

### 3. 关键 Log 组的删除保护

删除保护是 Amazon CloudWatch Logs 引入的关键安全功能，可防止 log 组及其关联 log 流的意外或恶意删除。启用后，删除保护会阻止所有删除操作，直到显式禁用为止，有助于保护关键运维和合规数据。此功能对于保留必须为故障排除、分析和监管要求而保留的审计 logs、合规记录和生产应用 logs 特别有价值。（[保护 log 组免受删除](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)）

#### 关键特征：
- **预防性控制**：作为预防性安全控制，在删除尝试发生之前阻止它们
- **需要显式禁用**：必须显式禁用才能进行任何删除操作
- **适用于 Log 流**：同时保护 log 组和其中的所有 log 流
- **无性能影响**：不影响 log 摄取、查询或其他操作
- **审计跟踪**：删除保护状态的所有更改都记录在 CloudTrail 中

#### 关键用例 - 何时启用删除保护：
- **审计 Logs**：所有审计 logs 都应启用删除保护，以维护合规性并防止篡改审计跟踪
- **安全 Logs**：安全相关 logs，包括 AWS CloudTrail、VPC Flow Logs 和应用安全 logs
- **合规 Logs**：监管合规所需的任何 logs
- **生产应用 Logs**：故障排除和事件响应所需的生产 logs
- **长期保留 Logs**：保留要求超过 1 年的任何 logs

#### 实施最佳实践：
-   **在关键 Log 组上启用**：在创建 log 组时或对现有 log 组为所有关键 logs 启用删除保护。这是防止意外或恶意删除的第一道防线
-   **自动化部署**：使用基础设施即代码（IaC）工具（如 AWS CloudFormation、AWS CDK 或 Terraform）在创建新 log 组时自动启用删除保护。这确保环境中一致的安全状态
-   **文档化程序**：为何时以及如何禁用删除保护创建清晰的文档和 runbook。这应包括审批工作流、理由要求和重新启用程序，以确保保护仅在绝对必要时临时禁用
-   **监控变更**：创建 CloudWatch alarm 和 metric 过滤器，以检测关键 log 组上的删除保护何时被禁用。当发生这种情况时立即通知安全团队进行调查是否为授权变更
-   **纵深防御**：将删除保护与显式拒绝删除操作的 IAM 策略结合使用。这提供了纵深防御——即使删除保护被禁用，IAM 策略仍然可以防止未授权删除

#### 组合多层保护：
-   在 log 组上启用删除保护（[保护 log 组免受删除](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)）
-   使用带有 `logs:DeleteLogGroup` 和 `logs:PutLogGroupDeletionProtection` 显式 Deny 语句的 IAM 策略（[CloudWatch Logs 权限参考](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)）
-   在组织级别应用服务控制策略（SCP）（[服务控制策略](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)）
-   为关键操作启用 MFA 删除要求（[AWS Re:Post：恢复或防止 CloudWatch 中的 logs 或 log 组被删除](https://repost.aws/knowledge-center/cloudwatch-prevent-logs-deletion)）
-   使用 AWS Config 监控删除保护状态（[AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html)）
-   实施自动修复，如果保护被禁用则重新启用（[使用 AWS Config 修复不合规资源](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)）

### 4. 使用客户管理 KMS 密钥加密

为敏感 log 组实施客户管理的 KMS 密钥，以维护对加密密钥的完全控制、启用密钥轮换，并创建密钥使用的详细审计跟踪。

#### 加密架构

*   CloudWatch Logs 默认使用 AES-GCM 服务器端加密对 log 数据进行静态加密（[使用 AWS Key Management Service 加密 CloudWatch Logs 中的 log 数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)）
*   为增强控制，使用 AWS KMS 客户管理密钥来加密 log 组，允许您管理加密密钥和访问策略（[使用 AWS Key Management Service 加密 CloudWatch Logs 中的 log 数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)）
*   在创建 log 组时配置加密或更新现有组以使用 KMS 加密（[AWS Re:Post：使用 AWS KMS 加密 CloudWatch Logs 中的 log 数据](https://repost.aws/knowledge-center/cloudwatch-encrypt-log-data)）

#### 加密最佳实践：
*   **为敏感 Logs 启用 KMS 加密**：对于包含敏感数据的 log 组，关联客户管理的 KMS 密钥。这通过密钥策略提供增强控制，启用密钥轮换，并创建所有加密/解密操作的详细 CloudTrail logs
*   **配置适当的 KMS 密钥策略**：您的 KMS 密钥策略必须授予 CloudWatch Logs 服务主体（`logs.amazonaws.com`）使用密钥进行加密和解密的权限。包含将使用限制到特定 log 组和 AWS 账户的条件
*   **实施密钥轮换**：为用于 CloudWatch Logs 的 KMS 密钥启用自动密钥轮换。AWS 每年自动轮换客户管理密钥，同时保持对用先前密钥版本加密的数据的访问
*   **监控 KMS 密钥使用**：使用 CloudTrail 监控与 log 加密密钥相关的所有 KMS API 调用。设置 CloudWatch alarm 以警报异常模式，如过多的解密操作或未授权的密钥访问尝试

### 5. 数据保护策略

CloudWatch Logs 数据保护是一项功能，帮助您使用机器学习和模式匹配来发现、保护和审计 log 组中的敏感数据（[使用掩码保护敏感 log 数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)）。此功能自动扫描 log 事件中的敏感信息（如个人身份信息 (PII)、凭证和财务数据），然后根据您的配置审计或掩码数据。数据保护策略在 log 事件摄取时实时工作，无需更改应用或 log 源即可提供即时保护。

*   **配置数据保护策略**：实施 CloudWatch Logs 数据保护策略，使用托管数据标识符自动检测和掩码敏感信息（[个人身份信息 (PII)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html)）
*   **选择保护操作**：根据安全要求配置审计操作（监控和报告敏感数据）或去标识化操作（实时掩码敏感数据）（[CloudWatch Logs 敏感数据类型的托管数据标识符](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html)）
*   **全面数据覆盖**：保护多类敏感数据，包括：
    - **凭证**：AWS Secret Keys、SSH 私钥、PGP 私钥、PKCS 私钥
    - **财务**：信用卡号、银行账号、安全码
    - **个人**：电子邮件地址、姓名、地址、IP 地址、车辆识别号
    - **区域特定**：国家/地区特定标识符，如驾照、税号、邮政编码
*   **关键词邻近检测**：利用高级检测功能扫描敏感数据模式 30 个字符内的关键词，以减少误报
*   **全球覆盖**：数据保护策略无论 log 组的地理位置如何都有效，支持使用 ISO 国家代码的区域特定数据标识符
*   **与 Amazon Macie 集成**：将 Amazon Macie 与 CloudWatch Logs 结合使用，在 AWS 环境中实现增强的敏感数据发现和分类（[AWS 博客：Amazon CloudWatch Logs Data Protection 如何帮助检测和保护敏感 log 数据](https://aws.amazon.com/blogs/mt/how-amazon-cloudwatch-logs-data-protection-can-help-detect-and-protect-sensitive-log-data/)）

### 6. Log 保留和生命周期管理

CloudWatch Logs 中的 log 保留控制 log 事件在自动删除之前存储多长时间，帮助您平衡合规要求与存储成本（[更改 CloudWatch Logs 中的 log 数据保留](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)）。默认情况下，CloudWatch Logs 无限期存储 log 数据，但您可以在 log 组级别配置 1 天到 10 年的保留期。适当的生命周期管理确保根据监管要求、运维需求和成本优化目标将敏感数据保留适当的时长，同时在不再需要时自动清除数据。

*   **配置保留期**：根据合规要求和运维需求为 log 组设置适当的保留期。默认情况下，log 数据无限期存储，但您可以配置 1 天到 10 年的保留（[更改 CloudWatch Logs 中的 log 数据保留](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)）
*   **应用基于数据分类的策略**：根据数据敏感性和分类实施不同的保留策略：
    - **关键/审计 Logs**：长期保留（7 年以上）以满足合规要求
    - **安全 Logs**：扩展保留（1-3 年）用于取证分析
    - **应用 Logs**：中期保留（30-90 天）用于故障排除
    - **调试/开发 Logs**：短期保留（1-7 天）用于成本优化
*   **成本优化**：定期审查和调整保留期，以平衡合规需求与存储成本。较旧的 log 数据在保留期到期时会自动删除
*   **生命周期管理标签**：使用一致的标签策略按环境、应用、数据分类和保留要求对 log 组进行分类，以实现自动化策略应用（[在 Amazon CloudWatch Logs 中标记 log 组](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#log-group-tagging)）
*   **与集中化集成**：使用 log 集中化时，确保在源账户和目标账户间一致应用保留策略以维护合规要求

### 7. Log 目标的基于资源的策略

CloudWatch Logs 中的基于资源的策略专门用于**目标**，以启用跨账户订阅（[跨账户跨区域订阅](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)）。与使用基于身份的 IAM 策略的 log 组不同，目标支持基于资源的策略，指定哪些外部 AWS 账户可以将其 log 组订阅到您的目标资源，如 Kinesis Data Streams、Kinesis Data Firehose 或 Lambda 函数（[管理访问权限概述](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#resource-based-policies-cwl)）。

#### 什么是目标及何时使用基于资源的策略：

*   **Log 目标**：目标是 CloudWatch Logs 资源，代表可以从订阅过滤器接收 log 数据的 AWS 服务（Kinesis Data Streams、Kinesis Data Firehose、Lambda 函数）
*   **跨账户 Log 流式传输**：当您想允许其他 AWS 账户将其 log 数据流式传输到您的集中处理基础设施时，使用目标上的基于资源的策略
*   **集中 Log 处理**：启用多个账户将 logs 发送到中央账户的 Kinesis 流或 Firehose 的场景，用于统一分析、安全监控或合规处理
*   **第三方集成**：允许合作伙伴账户或服务提供商将 log 数据发送到您的处理系统，同时维护严格的访问控制

#### 目标的基于资源的策略最佳实践：
*   **指定确切的源账户**：在目标策略中明确指定允许创建订阅的 AWS 账户 ID。永远不要对账户 ID 使用通配符 (*)（[步骤 1：创建目标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CreateDestination.html)）
*   **使用最小权限访问**：仅授予所需的最低权限——通常只是特定目标 ARN 的 `logs:PutSubscriptionFilter`
*   **实施条件键**：使用 IAM 条件键添加额外的安全层，如源 IP 限制、基于时间的访问或 MFA 要求
*   **定期策略审计**：定期审查目标策略以确保它们仍然反映当前要求。删除已退役账户的访问并收紧过于宽泛的策略
*   **监控订阅活动**：使用 CloudTrail 监控 `PutSubscriptionFilter` 和 `DeleteSubscriptionFilter` API 调用，以跟踪哪些账户正在创建或删除到您目标的订阅

### 8. 使用 AWS Organizations 进行 Log 集中化

Log 集中化是 AWS Organizations 的一项功能，可自动将来自多个成员账户和 AWS 区域的 log 数据复制到集中账户中，使用跨账户和跨区域集中化规则（[跨账户跨区域 log 集中化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)）。此功能简化了 log 整合，以改善集中监控、分析和跨整个 AWS 基础设施的合规性，而无需基于资源的策略或跨账户 IAM 角色。

#### AWS 安全参考架构对齐

遵循 AWS 安全参考架构（AWS SRA）最佳实践，CloudWatch Logs 集中化应与您的整体安全账户结构对齐（[AWS 安全参考架构](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/introduction.html)）：

*   **指定 Log 归档账户为委托管理员**：将专用 Log 归档账户配置为 AWS Organization 的 CloudWatch 委托管理员
*   **集中化到安全 OU**：将所有 CloudWatch Logs 集中化规则引导到安全组织单元 (OU) 内的 Log 归档账户中复制 logs
*   **与现有 Log 基础设施集成**：利用 Log 归档账户的现有安全基础设施
*   **实施纵深防御**：应用与其他关键 logs 相同的安全原则——最小权限访问、使用客户管理 KMS 密钥加密、用于不可变性的删除保护以及全面监控

#### Log 集中化最佳实践：
*   **建立组织结构**：指定 Log 归档账户为 CloudWatch 委托管理员，并创建集中化规则以从组织中所有成员账户复制 logs
*   **应用一致的安全控制**：在所有集中化 log 组中实施统一的安全策略
*   **监控集中化健康**：使用 CloudWatch metrics 和控制台监控来跟踪集中化规则的健康状态
*   **与现有 Log 源集成**：将 CloudWatch Logs 集中化与已流向 Log 归档账户的其他 log 源协调
*   **为数据驻留配置多个集中化规则**：使用多个集中化规则来满足数据驻留和合规要求

### 9. CloudWatch Logs 的 VPC Endpoint

使用 VPC endpoint 在 VPC 和 CloudWatch Logs 之间建立私有连接，将 log 流量保持在 AWS 网络内，并通过网络隔离增强安全性。

*   **启用私有连接**：使用接口 VPC endpoint 将 logs 发送到 CloudWatch Logs 而不经过互联网（[将 CloudWatch Logs 与接口 VPC endpoint 配合使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-and-interface-VPC.html)）
*   **多 Endpoint 支持**：CloudWatch Logs 需要两个 VPC endpoint：
    - `com.amazonaws.region.logs` 用于标准 CloudWatch Logs API
    - `com.amazonaws.region.stream-logs` 用于流式 API，如 StartLiveTail 和 GetLogObject
*   **FIPS Endpoint 支持**：在合规要求时使用 FIPS 兼容 endpoint（`logs-fips` 和 `stream-logs-fips`）
*   **实施 VPC Endpoint 策略**：使用 endpoint 策略限制通过 VPC endpoint 的 CloudWatch Logs 操作
*   **利用 VPC 上下文键**：在 IAM 策略中使用 `aws:SourceVpc` 和 `aws:SourceVpce` 条件键，确保 CloudWatch Logs 仅可通过特定 VPC endpoint 访问

### 10. 监控和审计

#### 启用全面日志记录：
*   **启用 CloudTrail 日志记录**：确保在所有区域启用 CloudTrail 并配置为记录 CloudWatch Logs API 调用（[将事件发送到 CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)）
*   配置 CloudWatch alarm 以检测未授权访问尝试或异常模式（[使用 Amazon CloudWatch alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)）
*   使用 Organizations 跨多个账户实施集中日志记录（[CloudWatch Logs 中的跨账户 log 数据共享](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)）
*   通过 IAM 策略防止 log 删除来维护不可变的审计跟踪

#### 监控最佳实践：
*   **监控 Log 摄取 Metrics**：使用内置 CloudWatch metrics 跟踪 log 摄取模式并检测异常（[CloudWatch Logs metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)）
*   **利用 CloudWatch Contributor Insights 进行异常检测**：使用 Contributor Insights 分析 log 数据模式并识别异常活动（[使用 CloudWatch Contributor Insights 分析高基数数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)）
*   **创建安全事件 Alarm**：设置 metric 过滤器和 alarm 以检测可疑活动（[创建 metric 过滤器](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)）
*   使用 CloudWatch Logs Insights 进行高级 log 分析和异常检测（[使用 CloudWatch Logs Insights 分析 log 数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)）
*   使用 AWS Config 监控 CloudWatch Logs 配置更改（[使用 Amazon EventBridge 监控 AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/monitor-config-with-cloudwatchevents.html)）

## 结论

保护 Amazon CloudWatch Logs 需要全面的多层方法，结合基于身份的策略、删除保护、加密、数据保护策略和持续监控来保护您的关键 log 数据。通过实施这些安全最佳实践，您创建了针对 log 基础设施意外和恶意威胁的稳健防御。适当的 CloudWatch Logs 安全对于维护对日志基础设施的信任和保护 log 数据中包含的宝贵洞察至关重要。
