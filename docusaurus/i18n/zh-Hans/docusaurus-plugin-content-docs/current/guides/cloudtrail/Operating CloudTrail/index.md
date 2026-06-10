---
sidebar_position: 1
---
# 操作 CloudTrail

AWS CloudTrail 可以记录、持续监控和保留整个 AWS 基础设施中与操作相关的账户活动。它还将为您提供账户的 AWS 调用历史记录，包括通过 AWS Management Console、AWS SDK 和命令行工具进行的 API 调用。因此，您可以识别：

*   哪些用户和账户为支持 CloudTrail 的服务调用了 AWS API。
*   调用的来源 IP 地址。
*   调用发生的时间。

创建 AWS 账户时即启用 CloudTrail，并提供过去 90 天所有管理事件活动的事件历史记录。AWS 建议您创建跟踪或 Lake 的事件数据存储，以在 AWS 环境中保留超过 90 天的事件。以下将概述 CloudTrail 的一些总体最佳实践，然后在后续章节中提供 CloudTrail 特定领域的最佳实践，如 CloudTrail Trails 和 CloudTrail Lake。

### 将安全或日志记录账户注册为 CloudTrail 的委托管理员
CloudTrail 允许配置最多 3 个委托管理员来管理组织的跟踪和 Lake 事件数据存储。委托管理员有权代表组织管理资源。委托管理员支持通过允许管理账户将 CloudTrail 管理操作委托给组织成员账户（如安全或日志记录账户）为客户提供灵活性。

通过此功能，组织的管理账户仍然是所有 CloudTrail 组织资源的所有者，即使这些组织跟踪或 CloudTrail Lake 事件数据存储资源是通过委托管理员账户创建和管理的。这有助于客户在对 AWS Organizations 中的组织进行更改时保持组织范围 CloudTrail 审计日志的连续性，避免任何中断。通过使用 CloudTrail 的委托管理员，可以最大限度地减少使用管理账户执行 CloudTrail 相关管理任务，有助于改善您的安全和合规态势。

### 使用 CloudTrail Insights 监控异常 API 活动

AWS CloudTrail Insights 通过持续分析 CloudTrail 管理事件，帮助 AWS 用户识别和响应与 API 调用相关的异常活动。如果您启用了 CloudTrail Insights 且 CloudTrail 检测到异常活动，Insights 事件将交付到跟踪的目标 S3 存储桶或 CloudTrail Lake 的事件数据存储。您还可以查看洞察类型和事件时间段。与跟踪中捕获的其他类型事件不同，Insights 事件仅在 CloudTrail 检测到您账户的 API 使用模式与典型使用模式显著不同时才会记录。CloudTrail Insights 与 EventBridge 集成，允许您创建规则以根据条件触发特定操作，例如发送电子邮件通知或触发 Lambda 函数。因此，您可以确保团队随时了解任何异常 API 活动。

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### 管理 CloudTrail 成本
使用 CloudTrail 时，请记得考虑帮助管理 CloudTrail 支出的方面。以下是一些帮助控制 CloudTrail 成本的最佳实践。

-   **AWS Budgets**：AWS Budgets 帮助跟踪您的 CloudTrail 支出。您可以在 AWS Budgets 中基于 CloudTrail 服务设置成本预算。您还可以设置预算警报，在达到某个预算阈值时通过电子邮件或 AWS Chatbot 通知您。

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**：AWS Cost Anomaly Detection 帮助您识别和解决整个组织中意外的 AWS 支出飙升。您可以为 AWS CloudTrail 服务创建监控器来跟踪您的支出。该服务使用机器学习分析历史数据以计算预期的每日支出，并将其与实际支出进行比较。当您的 CloudTrail 实际支出超过预期金额超出某个阈值时，它会将其识别为异常并执行根本原因分析。然后您可以在 AWS Cost Anomaly Detection 检测到与 CloudTrail 支出相关的异常时快速采取行动。

-   **使用 Amazon S3 Bucket Keys 减少 CloudTrail S3 存储桶 SSE-KMS 的相关成本**：当使用 AWS KMS 的 Amazon S3 服务端加密（SSE-KMS）的对象级密钥时，应考虑切换到 Amazon S3 Bucket Keys，通过减少从 Amazon S3 到 AWS KMS 的请求流量来帮助将 AWS KMS 请求成本降低高达 99%。这也显著减少了 CloudTrail 中记录的事件量，有助于降低 CloudTrail 费用。使用 S3 Bucket Keys 的一些额外关键优势：
    *   **简化管理：** 与单个对象级密钥相比，存储桶级密钥更易于管理。
    *   **性能改善：** 减少对 KMS 的 API 调用可以提高涉及加密对象操作的性能。
    *   **易于实施：** S3 Bucket Keys 只需在 AWS Management Console 中点击几下即可启用，无需更改客户端应用程序。

-   **多个跟踪**：账户的第一份管理事件副本包含在 AWS 免费套餐中。如果您创建交付相同管理事件的额外跟踪，这些后续交付将产生额外的 CloudTrail 成本。如果您需要多个跟踪，以下建议可以帮助减少额外跟踪的 CloudTrail 成本：

    *   **CloudTrail Lake**：使用 CloudTrail Lake 摄取管理事件的额外副本。使用 CloudTrail Lake 可以将管理事件额外副本的总体费用降低高达 90%。
    
    *   **排除 AWS Key Management Service (AWS KMS) 和 Amazon Relational Database Service (Amazon RDS) 数据 API 事件**：对于管理事件的任何额外副本，建议同时排除 AWS Key Management Service (AWS KMS) 和 Amazon Relational Database Service (Amazon RDS) 数据 API 事件。因为您可能不需要这些事件的多个副本。这些高流量事件可能产生高昂成本，可以在跟踪或事件数据存储页面的管理筛选器中排除。

-   **数据事件的高级事件选择器**：使用数据事件时，高级事件选择器可以提供数据事件日志记录的精细控制。高级事件选择器还支持使用部分字符串的模式匹配来包含或排除值。这提供了对要记录和付费的 CloudTrail 数据事件的更强控制。例如，您可以记录 Amazon S3 DeleteObject API 以将收到的 CloudTrail 事件缩小到仅破坏性操作。这可以在控制成本的同时帮助识别安全问题。
