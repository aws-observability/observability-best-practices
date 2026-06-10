---
sidebar_position: 2
title: 使用 CloudWatch Unified Data Store 的安全可视性 Dashboard
---

# 使用 CloudWatch Unified Data Store 的安全可视性 Dashboard

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) 提供了一种集中方式来发现、组织和查询跨 AWS 服务的日志数据，无需知道各个日志组名称。为实现这一点，CloudWatch Unified Data Store 使用 [facets](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) — 日志数据中的字段，CloudWatch 将其呈现用于交互式过滤、分组和分析。默认 facets（如 `@data_source_name`、`@data_source_type` 和 `@data_format`）在所有 Standard 日志类别的日志组上自动可用，无需任何配置。在 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 控制台中，您可以选择 facet 值来直观地探索数据，或在查询中引用它们以高效地将搜索范围缩小到仅匹配的日志组和事件。

通过这些 facets，CloudWatch 自动按源[数据源](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html)对日志进行分类 — 如 AWS CloudTrail 和 Amazon VPC Flow Logs — 这样您就可以使用 `@data_source_name` facet 跨日志组查询所有 CloudTrail 或 VPC Flow Log 日志数据，无论存在多少日志组或它们的名称是什么。

借助 [CloudWatch Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)，您可以在此基础上构建安全分析。本指南介绍了如何通过 AWS CloudFormation 部署预构建的 [CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) 示例，该示例利用 CloudWatch 数据源提供对 CloudTrail 和 VPC Flow Logs 活动的近实时可见性。它解释了每个 widget 提供的内容，并描述了如何使用 dashboard 进行安全监控、事件调查和合规可见性。

## 为什么这个 Dashboard 很重要

安全团队需要集中的、近实时的 API 活动和网络流量可见性，覆盖所有 AWS 账户。如果没有集中的 dashboard，团队必须手动在多个日志组中运行查询、关联 CloudTrail 和 VPC Flow Logs 之间的数据，并从不同来源拼凑安全上下文。

此 dashboard 解决了几个关键挑战：

- **不依赖日志组名称**：使用 [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) 通过 CloudWatch Unified Data Store 默认 facets 动态发现 CloudTrail 和 VPC Flow Logs，无论日志组在您的账户中叫什么名字。
- **双格式支持**：根据您的日志格式偏好部署 Standard（原生 AWS 字段名）或 OCSF（Open Cybersecurity Schema Framework）版本的 dashboard。
- **跨服务关联**：将 CloudTrail API 活动和 VPC Flow Log 网络数据并排放置，以便对安全事件进行可视化关联。
- **跨账户可移植**：相同的 CloudFormation 模板可在任何将 CloudTrail 和 VPC Flow Logs 流入 CloudWatch Logs 的账户中工作，无需更改日志组名称参数。

## 先决条件

在部署之前，验证您的账户是否具有所需的数据源：

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

您应该在输出中看到 `aws_cloudtrail` 和 `amazon_vpc` 的条目。如果缺失，请确保：

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** 已配置为将日志传送到 CloudWatch Logs。
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** 已配置为至少为一个 VPC 传送到 CloudWatch Logs。

## 部署 Dashboard

1. 下载 **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** 模板。
1. 导航到 **CloudFormation** → **Create stack** → **With new resources**。
1. 上传 `CloudWatch_Dashboard_CloudTrail_VPC.yaml` 模板。
1. 配置参数：
   - **DashboardName**：您的 dashboard 名称（默认：`CloudTrail-VPC-Dashboard`）。
   - **LogFormat**：选择 `Standard` 使用原生 AWS CloudTrail/VPC Flow Log 字段名，或选择 `OCSF` 使用 Open Cybersecurity Schema Framework 规范化字段。
1. 审查并创建堆栈。

### CloudFormation 参数

| 参数                          | 默认值                    | 描述                                                                                      |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | CloudWatch dashboard 的名称                                                                |
| `LogFormat`                        | `Standard`                 | `Standard`（原生 AWS 字段）或 `OCSF`（规范化 schema）                                    |

## 查询工作原理

此 dashboard 中的每个 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) 查询都使用相同的模式：

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) 告诉 CloudWatch 在账户中的所有日志组中搜索。
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) 使用 `@data_source_name` 默认 facet 将搜索范围缩小到仅包含指定数据源的日志组。CloudWatch 自动将此作为所有 Standard 日志类别日志组的默认 facet 提供 — 无需自定义配置。
- 对于 CloudTrail 查询，数据源名称为 `aws_cloudtrail`。
- 对于 VPC Flow Log 查询，数据源名称为 `amazon_vpc`。

这种方式意味着您永远不需要知道或配置实际的日志组名称。无论您的 CloudTrail 日志组名为 `aws-cloudtrail-logs`、`aws/cloudtrail/managementevents` 还是任何自定义名称，dashboard 的工作方式完全相同。

## 安全最佳实践

### 使用 IAM 限制 Dashboard 访问

作为最佳实践，对任何展示安全数据的 CloudWatch dashboard 应用最小权限访问控制。

以下是一个示例 IAM 策略，授予对 dashboard 的只读访问权限并拒绝修改。将其附加到应具有只读访问权限的 IAM 角色或组：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardReadOnly",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    },
    {
      "Sid": "DenyDashboardModification",
      "Effect": "Deny",
      "Action": [
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

将 `ACCOUNT_ID` 替换为您的 AWS 账户 ID，如果您自定义了 dashboard 名称，则将 `CloudTrail-VPC-Dashboard` 替换为实际的 dashboard 名称。

对于需要维护 dashboard 的安全运维团队，使用允许读写的单独策略：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardFullAccess",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards",
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

Dashboard 查询还需要对相关日志组的 `logs:StartQuery`、`logs:GetQueryResults` 和 `logs:FilterLogEvents` 权限。确保 IAM 角色具有针对 CloudTrail 和 VPC Flow Log 日志组的这些权限。

### 使用 CloudWatch Alarms 补充 Dashboard

Dashboard 显示正在发生的事情，但不会在出问题时通知您。要在关键安全事件上获得告警，请设置由 [CloudWatch Logs metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) 支持的 [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)。以下是一些值得考虑的：

| 事件 | Metric Filter Pattern |
|---|---|
| Root 账户使用 | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` | 
| 权限提升 | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` | 
| 控制台登录失败 | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` | 

使用 [CloudWatch Logs Insights query-based alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Metrics_Insights_Alarm.html) 对滚动窗口内的 REJECT 计数进行告警。| 检测端口扫描或主动网络攻击。|

将告警操作路由到 [SNS topic](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)，通过电子邮件、Slack 或您的事件管理平台通知您的安全运维团队。

### 日志组加密和保留

CloudWatch Logs 默认使用 AWS 托管密钥对所有静态日志数据进行加密 — 无需配置。但是，如果您的组织出于合规要求需要客户管理的加密密钥，您可以将 [KMS 密钥与每个日志组关联](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)。这使您可以完全控制密钥轮换、访问策略和通过 CloudTrail 的审计跟踪。

此模板仅创建 dashboard — 它不会创建或管理底层日志组，因此无法在其上强制执行加密或保留设置。确保 dashboard 使用的 CloudTrail 和 VPC Flow Log 日志组已应用适当的设置：

- **KMS 加密**：如果需要，使用 `aws logs associate-kms-key` 或在创建日志组时通过 CloudFormation 将 KMS 密钥与日志组关联。
- **保留策略**：默认情况下，CloudWatch Logs 无限期保留日志数据。设置一个[保留策略](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)以平衡您的合规要求和成本。

### 其他建议

- 部署后**启用 CloudFormation 堆栈终止保护**以防止意外删除。
- 在 AWS Organizations 中使用 **[Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)** 来限制所有账户中特定管理员角色对 `cloudwatch:PutDashboard` 和 `cloudwatch:DeleteDashboards` 的使用。
- **启用 CloudTrail 对 CloudWatch API 调用的日志记录**，以便通过 CloudTrail 中的 `PutDashboard` 事件审计任何 dashboard 修改。

## Dashboard 各节和 Widget 参考

Dashboard 分为六个部分。以下是 Standard 格式版本 — OCSF 版本具有使用 OCSF 字段名（`api.operation`、`src_endpoint.ip`、`actor.user.name` 等）的等效 widget。

---

### 第 1 节：安全概览

本节提供 AWS 环境安全态势的一览式视图。

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Error Rate Trend Over Time                                | 时间序列               | CloudTrail        | 按 5 分钟时段聚合的 API 错误计数随时间变化。                                                             | 错误的突然飙升可能表明暴力攻击、配置错误的自动化或凭证泄露。将此作为异常情况发生的第一个指标。           |
| Top Error Codes (Unauthorized / Access Denied)            | 表格                     | CloudTrail        | 最频繁的访问被拒绝和未授权错误代码，按错误代码、API 事件名称、账户和区域分类。 | 识别哪些特定 API 调用被拒绝以及在哪些账户中。此处的模式可以揭示凭证填充、权限配置错误或横向移动尝试。            |
| User Identity Types                                       | 饼图                 | CloudTrail        | 按身份类型（IAMUser、AssumedRole、Root、FederatedUser、AWSService 等）的 API 调用分布。              | 健康的环境应该主要显示 AssumedRole 和 AWSService 调用。显著的 Root 或 IAMUser 活动可能需要调查。                                                      |
| VPC Flow Actions                                          | 饼图                 | VPC Flow Logs     | 所有 VPC Flow Log 记录中 ACCEPT 与 REJECT 操作的比率。                                                     | 高 REJECT 比率可能表明端口扫描、安全组配置错误或针对您网络边界的主动攻击尝试。                                                        |
| Root Account Activity                                     | 表格                     | CloudTrail        | 使用 root 账户进行的最近 API 调用，包括事件名称、源 IP、账户和区域。                    | Root 账户使用应该是罕见且有充分理由的。任何意外的 root 活动都是应立即调查的高优先级安全事件。                                    |

---

### 第 2 节：关联安全洞察 — CloudTrail + VPC Flow Logs

本节将 API 层和网络层安全数据并排放置以进行可视化关联。

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Suspicious IPs: API Errors                                | 表格                     | CloudTrail        | 产生最多 API 错误的外部（非 RFC1918）IP 地址，按账户和区域分组。                     | 具有高错误计数的外部 IP 可能正在尝试未授权访问。将这些与网络 REJECT widget 交叉引用，查看相同 IP 是否也在网络层被阻止。 |
| IPs with Network REJECT                                   | 表格                     | VPC Flow Logs     | 具有最多 REJECT 操作的外部 IP 地址，按目标端口分类。                                   | 显示哪些外部 IP 正被安全组或 NACL 阻止。当相同 IP 同时出现在此 widget 和 API Errors widget 中时，强烈表明存在恶意活动。         |
| Cross-Reference: External IPs in CloudTrail Logs                 | 表格（全宽）        | CloudTrail        | 进行 API 调用的所有外部 IP，包含每个 IP、账户和区域的总 API 调用次数和错误次数。              | 提供外部 IP 活动的综合视图。API 次数高但错误次数低的 IP 可能是合法服务；错误比率高的 IP 需要调查。               |
| API Activity Timeline                                     | 时间序列               | CloudTrail        | 按 10 分钟时段的总 API 调用量随时间变化。                                                                     | 建立正常 API 活动的基线。偏离基线可能表明自动化攻击、服务中断或凭证泄露运行脚本。                     |
| Network Traffic Timeline                                  | 时间序列（堆叠）     | VPC Flow Logs     | 网络流量计数随时间变化，按 ACCEPT/REJECT 操作堆叠。                                                        | 可视化网络流量模式和被阻止流量的比例。不断增长的 REJECT 趋势可能表明正在进行的攻击。                                                     |

---

### 第 3 节：网络安全 — 网络活动分析

深入了解 VPC Flow Log 数据以获得网络层安全可见性。

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Top Blocked Network Connections                           | 表格                     | VPC Flow Logs     | 具有最多 REJECT 操作的源/目标 IP 对及传输的总字节数。                                   | 识别最持续的被阻止连接尝试。来自单个源 IP 的大量被阻止连接可能表明定向攻击或配置错误的应用程序。                 |
| Top Destination Ports                                     | 条形图                 | VPC Flow Logs     | 所有 Flow Log 记录中最常被目标的端口。                                                | 常见端口如 443 (HTTPS) 和 80 (HTTP) 是预期的。接收高流量的异常端口（如 22、3389、445）可能表明扫描或漏洞利用尝试。                            |
| Network Traffic Bytes Over Time                           | 时间序列（堆叠）     | VPC Flow Logs     | 按 ACCEPT/REJECT 堆叠的总传输字节数随时间变化。                                                           | 跟踪数据传输量趋势。接受字节数的突然增加可能表明数据外泄；拒绝字节数的增加表明正在主动阻止恶意流量。               |
| Top External Source IPs                                   | 表格                     | VPC Flow Logs     | 具有最多连接和总字节数的外部 IP，按操作（ACCEPT/REJECT）分组。                             | 识别与您的 VPC 通信最活跃的外部 IP。有助于识别合法合作伙伴、CDN 或潜在威胁行为者。                                              |

---

### 第 4 节：身份和访问管理

专注于来自 CloudTrail 的 IAM 活动和认证事件。

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IAM Privilege Escalation Indicators                       | 表格                     | CloudTrail        | 高风险 IAM API 调用（CreateUser、AttachUserPolicy、AttachRolePolicy、PutUserPolicy、PutRolePolicy、CreateAccessKey、CreateLoginProfile），按事件名称、用户 ARN、账户和区域分组。 | 这些 API 调用可以授予提升的权限。意外出现可能表明攻击者在初始入侵后建立持久性或提升权限。                      |
| Top API Calls                                             | 条形图                 | CloudTrail        | 所有 CloudTrail 事件中最常调用的 10 个 API。                                                       | 建立"正常" API 活动的样子。出现在前 10 中的异常 API 可能表明新的自动化、配置错误或恶意活动。                                    |
| Authentication Events                                    | 表格                     | CloudTrail        | AWS Console 登录尝试，按成功/失败（errorCode）、用户 ARN、账户和区域分组。                     | 失败的控制台登录可能表明凭证填充或暴力攻击。来自意外用户或区域的成功登录应被调查。                                        |
| Authentication Attempts Over Time                         | 时间序列（堆叠）     | CloudTrail        | 按 30 分钟时段的控制台登录尝试，按成功/失败堆叠。                                        | 可视化认证模式。一系列失败登录后跟一次成功可能表明账户已被入侵。                                                                          |

---

### 第 5 节：活动分布与分析

更广泛地分析 API 活动模式以提高运维和安全意识。

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Top Source IPs by Activity Volume                         | 表格                     | CloudTrail        | 产生最多 API 活动的外部 IP，按账户和区域分组。                                          | 识别最活跃的外部调用者。具有高活动量的意外 IP 可能表明凭证泄露正被从外部基础设施使用。                             |
| Events by Event Type                                      | 饼图                 | CloudTrail        | CloudTrail 事件类型分布（AwsApiCall、AwsConsoleSignIn、AwsServiceEvent 等）。                          | 提供活动性质的上下文。AwsConsoleSignIn 事件的突然增加或新事件类型的出现可能需要关注。                                                   |
| Activity Trend by Event Source                            | 时间序列（堆叠）     | CloudTrail        | 按 AWS 服务（eventSource）分类的 API 调用量随时间变化。                                                   | 显示哪些服务最活跃以及活动模式如何随时间变化。突然变得非常活跃的服务可能表明自动化操作或事件。                      |
| Events by Region                                          | 饼图                 | CloudTrail        | API 调用跨 AWS 区域的分布。                                                                          | 意外区域中的活动可能表明攻击者在您通常没有资源的区域操作。这是常见的入侵指标。                               |
| Top Services                                              | 饼图                 | CloudTrail        | 按事件计数最常被调用的 AWS 服务。                                                                           | 建立您的服务使用基线。新服务的出现或异常比例可能表明未授权的资源创建。                                                              |
| Read vs Write API Calls                                   | 条形图                 | CloudTrail        | 只读与变更（写入）API 调用的比率。                                                      | 健康的环境通常读调用多于写调用。写调用的突然增加可能表明批量资源创建、修改或删除 — 可能是恶意的。    |

---

### 第 6 节：详细安全事件时间线

| Widget                                                       | 类型                      | 数据源       | 显示内容                                                                                                          | 重要性                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Security Events Timeline — Errors & Access Denied         | 表格（全宽）        | CloudTrail        | 最近 100 个 API 错误的完整上下文：时间戳、事件名称、错误代码、错误消息、用户 ARN、源 IP、账户和区域。 | 这是您调查的起点。当告警触发或您在上面的 widget 中注意到异常时，来此查看具有完整上下文的原始事件以进行事件响应。            |

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## 清理

要删除 dashboard 和所有关联的资源：

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
将 **CloudTrail-VPC-Dashboard** 替换为在部署部分使用的 CloudFormation 堆栈名称
:::

## 总结

此 CloudWatch Dashboard 使用 CloudWatch Unified Data Store 数据源，提供跨 CloudTrail API 活动和 VPC Flow Log 网络数据的集中式近实时安全可见性。通过利用 `@data_source_name` 默认 facet，dashboard 自动发现正确的日志组而无需日志组名称配置，使其可在任何 AWS 账户中移植。通过 CloudFormation 在几分钟内部署它，立即获得用于威胁检测、事件调查和合规监控的安全可见性。
