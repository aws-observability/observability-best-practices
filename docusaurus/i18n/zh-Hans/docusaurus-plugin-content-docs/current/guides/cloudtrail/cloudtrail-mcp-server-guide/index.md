# 使用 CloudTrail MCP Server 进行安全、审计和运营

## 简介

[CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) server 使 [Kiro](https://kiro.dev/cli/) 等代理能够通过自然语言直接查询和分析 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 事件。通过将您的代理连接到 [CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) 或 [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) 中的 CloudTrail 事件，您可以调查安全事件、审计账户活动、排除运营问题并生成合规报告——所有这些都通过对话式提示完成，而非编写复杂的 SQL 查询或手动解析 JSON 日志。

## 为什么这很重要

安全、合规和运营团队花费大量时间分析 CloudTrail 日志以了解 AWS 账户活动：

- **安全团队**需要快速调查可疑活动、追踪未授权的访问尝试，并识别跨多个账户的潜在安全事件范围
- **合规团队**必须生成审计报告，显示谁访问了什么资源、何时进行了更改，以及活动是否符合组织策略
- **运营团队**通过追踪 API 调用、识别配置更改以及了解导致问题的事件序列来排除服务中断问题
- **所有团队**都在与 CloudWatch Logs Insights 查询语法、JSON 解析以及跨时间段和账户的事件关联方面苦苦挣扎

没有 CloudTrail MCP server，团队只能编写复杂的查询、手动解析 JSON 日志或构建自定义 dashboard——这为关键的安全和运营工作流增加了时间、复杂性和人为错误的可能性。

## 工作原理

CloudTrail MCP server 将自然语言问题转换为针对您的 CloudTrail 数据的查询，执行这些查询，并返回带有上下文和洞察的可读结果。

**支持的数据源：**

- **CloudWatch Logs**：使用 [CloudWatch Logs Insights 查询语法](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) - MCP server 自动发现可用的日志组
- **CloudTrail Lake**：使用 [SQL 查询](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html) - MCP server 自动发现 CloudTrail Lake 可用的事件数据存储

**核心能力：**

- 自然语言查询，无需编写查询语法
- 多账户支持
- 基于时间的分析和事件关联
- 安全调查、合规报告和运营故障排除

## 设置要求

要使用 CloudTrail MCP server，您需要：

**对于 CloudWatch Logs：**
- [AWS CloudTrail 配置为将事件发送到 CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- IAM 权限：`logs:StartQuery`、`logs:GetQueryResults`、`logs:DescribeLogGroups`
- MCP server 将自动发现可用的 CloudTrail 日志组

**对于 CloudTrail Lake：**
- 已创建和配置 [CloudTrail Lake 事件数据存储](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html)
- IAM 权限：`cloudtrail:StartQuery`、`cloudtrail:GetQueryResults`、`cloudtrail:DescribeEventDataStores`、`cloudtrail:ListEventDataStores`（请参阅 [CloudTrail Lake 权限](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html)）
- MCP server 将自动发现可用的 CloudTrail Lake 事件数据存储

**两者都需要：**
- 在您的代理中配置 MCP server
- 具有适当权限的 AWS 凭证

## 配置

要在您的代理中配置 CloudTrail MCP server，请按照 [AWS MCP Servers 文档](https://awslabs.github.io/mcp/)中的设置说明操作。MCP server 会自动发现您 AWS 账户中可用的 CloudTrail 数据源（CloudWatch Logs 和 CloudTrail Lake）。

**在您的提示中**，您可以选择性地指定要查询的数据源：

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## 真实场景的示例提示

### 安全调查提示

#### 1. 调查失败的登录尝试

**提示：**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**功能：** 通过分析 [CloudTrail 事件记录](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)来识别潜在的暴力破解攻击或凭证泄露

**用例：** 安全团队收到关于多次登录失败的警报，需要评估威胁级别

---

#### 2. 识别权限提升

**提示：**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**功能：** 检测潜在的权限提升尝试

**用例：** 安全团队调查某个行为者是否获得了提升的权限

---

### 合规和审计提示

#### 3. 生成用户活动报告

**提示：**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**功能：** 创建全面的用户活动审计跟踪

**用例：** 需要提供特定时期的活动时间线

---

#### 4. 跟踪 MFA 使用情况

**提示：**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**功能：** 验证组织范围内的 MFA 合规性

**用例：** 安全策略要求所有用户使用 MFA；识别不合规的账户

---

### 运营故障排除提示

#### 5. 调查服务中断

**提示：**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**功能：** 识别导致服务中断的配置更改

**用例：** 运营团队需要快速识别中断的根本原因

---

#### 6. 调试 IAM 权限问题

**提示：**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**功能：** 诊断 IAM 权限问题

**用例：** 用户无法执行所需的任务；识别缺失的权限

---

### 高级多账户提示

#### 7. 跨账户安全审查

**提示：**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**功能：** 识别整个 AWS 组织中的安全风险

**用例：** 安全团队进行组织范围的安全态势审查

**注意：** 需要 CloudTrail Lake 配置[组织事件数据存储](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html)用于多账户查询，或者需要将组织跟踪传送到 CloudWatch Logs。

---

#### 8. 跨账户合规性

**提示：**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**功能：** 验证组织范围内的审计日志记录合规性

**用例：** 合规审计要求证明持续的日志记录

---

### 结合 CloudTrail 与 VPC Flow Logs

当 CloudTrail 和 [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) 都发送到 CloudWatch Logs 时，您可以将 API 操作与网络流量关联起来进行全面的安全调查。

#### 9. 排除连接问题

**提示：**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**功能：** 识别连接问题是源于配置更改还是网络问题

**用例：** 运营团队需要快速解决应用程序中断

---

#### 10. 检测横向移动

**提示：**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**功能：** 识别权限提升后的潜在横向移动

**用例：** 安全团队调查被盗凭证是否被用于访问其他资源

---

## 最佳实践

**有效的提示：**
- 明确时间范围并包含上下文（账户 ID、资源名称、用户身份）
- 提出后续问题以细化结果
- 请求可操作的洞察："我应该怎么做？"或"这正常吗？"

**查询优化：**
- 从广泛开始，然后缩小范围
- 使用资源标识符获取更快的结果
- 在一个提示中合并相关问题

**安全：**
- 保护查询结果中的敏感数据
- 通过多个数据点验证发现
- 限制 MCP server 访问仅授权用户


## 结论

CloudTrail MCP server 将 CloudTrail 事件分析从技术性的查询编写任务转变为与代理的自然对话。安全团队可以更快地调查事件，合规团队可以轻松生成审计报告，运营团队可以在不学习复杂查询语法的情况下排除问题。

从最常见任务的基本提示开始——调查失败的登录、跟踪 IAM 更改或排除中断问题——然后根据您的特定环境进行调整。MCP server 的对话性质意味着您可以迭代地细化问题，在探索 CloudTrail 数据时获得更精确的答案。

有关更多信息，请参阅 [AWS MCP Servers 文档](https://awslabs.github.io/mcp/)和 [Kiro 的 MCP](https://kiro.dev/docs/mcp/)。
