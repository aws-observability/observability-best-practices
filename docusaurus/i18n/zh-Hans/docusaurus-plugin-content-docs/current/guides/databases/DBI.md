# 使用 Amazon CloudWatch Database Insights 监控数据库

## 简介

Amazon CloudWatch Database Insights 是 Amazon RDS 和 Aurora 数据库的统一监控解决方案。它将数据库 metrics、查询分析、logs、事件和应用程序遥测整合到 CloudWatch 控制台中的单一体验中，无需在多个工具之间切换来了解数据库层的运行情况。

本文介绍 Database Insights 提供的功能、如何在两种运行模式之间选择、有效监控数据库的实用指导，以及在采用之前应注意的限制。

---

## 什么是 Database Insights？

Database Insights 构建在 Amazon RDS Performance Insights 之上，并通过全局舰队监控、日志关联、锁分析、执行计划捕获和应用程序级集成对其进行了扩展。它是独立 Performance Insights 控制台体验（即将到达生命周期终点）的继任者。

核心概念是 **DB Load** — 数据库在任何时间点的平均活动会话数。如果 DB Load 超过实例的 vCPU 数量，则数据库过载。Database Insights 可视化此 metric 并允许您按多个维度（SQL、等待事件、用户、主机、应用程序）对其进行切片，以快速识别性能问题的根本原因。

---

## 标准模式与高级模式

Database Insights 以两个层级运行。标准模式默认启用，无需额外费用。高级模式需要启用 Performance Insights 并设置 15 个月的保留期，按 vCPU 小时数（预置）或 ACU 小时数（无服务器/无限制）定价。

| 功能 | 标准 | 高级 |
|---|:---:|:---:|
| 按维度分析顶级 DB Load 贡献者 | ✔ | ✔ |
| 查询、绘图和对 metrics 设置告警（7 天保留） | ✔ | ✔ |
| 对敏感维度的细粒度 IAM 访问控制 | ✔ | ✔ |
| 全局舰队监控视图 | ✘ | ✔ |
| 操作系统进程分析（增强监控） | ✘ | ✔ |
| SQL 锁分析（15 个月保留） | ✘ | ✔ (Aurora PG) |
| SQL 执行计划分析（15 个月保留） | ✘ | ✔ (Aurora PG, Oracle, SQL Server) |
| 每个查询的统计可视化 | ✘ | ✔ |
| 慢 SQL 查询分析 | ✘ | ✔ |
| Application Signals 集成（调用服务） | ✘ | ✔ |
| 整合的遥测 dashboard（metrics、logs、事件） | ✘ | ✔ |
| 自动导入 Performance Insights 计数器 metrics | ✘ | ✔ |
| CloudWatch 中的 RDS 事件 | ✘ | ✔ |
| 按需性能分析报告 | ✘ | ✔ |
| 跨账户跨区域监控 | ✘ | ✔ |

**数据保留：**
- 标准：Performance Insights 数据保留 7 天。
- 高级：Database Insights 收集的所有 metrics 保留 15 个月。

---

## 关键功能详解

### 舰队健康 Dashboard

舰队健康 Dashboard 在一个屏幕中提供所有 RDS 和 Aurora 实例的跨账户和跨区域鸟瞰视图。蜂巢可视化根据 DB Load 相对于 vCPU 容量的比值将实例按健康状态（高、警告、正常、空闲）分类。您可以按标签（环境、服务、团队）进行筛选并保存自定义舰队视图。Top-10 图表一目了然地显示负载最高的实例、其顶级查询和顶级等待事件。

当您负责数百个数据库并需要快速识别哪个需要关注时，这是您的起点。

### DB Load 分析（调查工作台）

实例 Dashboard 的 DB Load 分析选项卡是您花费大部分故障排除时间的地方。它回答五个 W：

- **WHAT** — 按 SQL 切片查看哪些查询正在产生负载。
- **WHO** — 按用户或应用程序切片识别责任方。
- **WHERE** — 按主机切片找到源机器。
- **WHEN** — 时间线精确显示问题何时开始和停止。
- **WHY** — 关联发现并采取行动。

Top SQL 表按负载贡献排名查询，并显示调用/秒、平均延迟、检查的行数和计划数。

### 锁分析

适用于 Aurora PostgreSQL 和 RDS for PostgreSQL。Database Insights 每 15 秒捕获一次锁快照，并将其可视化为锁树 — 父节点是阻塞会话，子节点是等待者。您可以看到阻塞 SQL、持续时间和受影响的下游会话数。DB Load 图表中的"按阻塞 SQL 切片"选项显示哪些语句随时间推移造成锁争用。

### 执行计划分析

适用于 Aurora PostgreSQL（v14.10+、v15.5+）、RDS for Oracle 和 RDS for SQL Server。Top SQL 表中的计划数列显示每个查询存在多少个不同的执行计划。您可以并排比较计划以识别计划变更何时导致性能回退。高计划数表示优化器不稳定。

### 数据库遥测

包含以下内容的整合选项卡：
- **Metrics** — 可自定义的 CloudWatch、操作系统和引擎计数器 metrics dashboard。
- **Logs** — 导出到 CloudWatch Logs 的数据库日志，可内联查看。
- **操作系统进程** — 来自增强监控的每个进程的 CPU/内存。
- **慢 SQL 查询** — 按模式分组的慢查询，按频率排名。
- **事件** — RDS 运维事件（故障转移、维护、配置更改）。

### 调用服务（CloudWatch Application Signals 集成）

此应用程序性能监控集成显示哪些上游微服务正在调用您的数据库，以及它们的可用性、延迟、错误率和请求量。这弥合了"数据库很慢"和"这个特定服务和功能正在导致它变慢"之间的差距。

### 按需性能分析

选择任意时间窗口，通过从数据库负载图表中选择"分析性能"来触发自动化的 ML 驱动分析。Database Insights 利用机器学习模型将选定时段与数据库的正常基线行为进行比较，跨维度（SQL 语句、等待事件、主机、用户等）扫描以发现异常和根本原因（例如，"由于等待事件从 CPU 转移到 I/O，DB load 增加了 4 倍"）。每份报告包含优先级排序的发现和具体的修复指导，将平均诊断时间从数小时缩短到数分钟。报告与您的 15 个月 metric 历史记录一起保留，便于在事后回顾时检索。

---

## 限制

在采用 Database Insights 之前，请注意以下约束：

### 引擎和功能可用性

- **锁分析**仅适用于 Aurora PostgreSQL 和 RDS for PostgreSQL。
- **执行计划分析**仅适用于 Aurora PostgreSQL（v14.10+/v15.5+）、RDS for Oracle 和 RDS for SQL Server。
- 并非所有高级模式功能都在所有 AWS 区域可用。
- Aurora PostgreSQL Limitless Database 支持存在，但功能集有所减少（在分片组级别没有锁分析或执行计划分析）。

### 数据和配置要求

- **慢 SQL 分析**需要启用数据库日志导出到 CloudWatch Logs 并配置适当的数据库参数（例如 PostgreSQL 的 `log_min_duration_statement`、MySQL 的 `slow_query_log`）。
- **操作系统进程数据**需要启用增强监控（额外费用）。
- Aurora PostgreSQL 上的**执行计划**需要将 `aurora_compute_plan_id` 参数设置为 `on`。实际计划（与估计计划相对）还需要 `aurora_stat_plans.with_analyze`。
- **调用服务**需要您的应用程序使用 CloudWatch Application Signals 进行检测。
- `pg_stat_statements` 在 Aurora PostgreSQL 10+ 上默认加载，但 SQL 文本在 `track_activity_query_size`（默认 1,024 字节）处被截断。长查询可能显示不完整。

### 运维限制

- 锁分析快照每 15 秒拍摄一次 — 非常短暂的锁可能不会被捕获。
- 舰队健康 Dashboard 需要高级模式才能保存舰队视图。
- 跨账户监控需要在监控账户和源账户中设置 CloudWatch Observability Access Manager (OAM)。
- 当性能分析报告的开始时间超出保留期时，报告将被删除。
- 数据库遥测选项卡中的 dashboard 自定义按引擎类型、区域和账户应用 — 而非按实例。

### 成本考虑

- 高级模式按 vCPU 小时（预置）或 ACU 小时（无服务器/无限制）定价。对于大型舰队，成本可能很显著。
- 增强监控会产生单独的费用。
- 启用日志导出时会产生 CloudWatch Logs 摄取和存储成本。
- 无法为集群中的单个实例启用高级模式 — 它适用于整个数据库集群。

---

## 最佳实践

### 从标准模式开始，策略性升级

标准模式免费，提供 7 天保留的 DB Load 分析。在需要 15 个月保留、舰队视图、锁分析或执行计划捕获的生产关键数据库上启用高级模式。并非每个开发/测试实例都需要高级模式。

### 一致地标记您的实例

Database Insights 舰队视图按标签筛选。采用一致的标记策略（例如 `environment`、`service`、`team`），这样您就可以创建有意义的舰队视图，如"支付服务的所有生产数据库"。

### 尽早启用日志导出

慢 SQL 分析和数据库遥测的日志部分仅在您启用了日志导出到 CloudWatch Logs 时才有效。在创建实例时执行此操作，而不是事后 — 您无法分析启用导出之前的历史慢查询。

### 对 DB Load 设置告警

创建 CloudWatch Alarms 对 `DBLoad` metric 相对于实例的 vCPU 数量进行监控。持续的 DB Load 超过 vCPU 数量意味着会话正在排队。在客户注意到之前发出告警。

### 使用 Who/What/Where/When 框架

调查性能问题时，系统地使用"按...切片"下拉菜单：
1. **SQL** — 识别问题查询。
2. **应用程序**或**用户** — 识别谁在运行它。
3. **主机** — 识别来源。
4. **时间线** — 识别何时开始。

这种结构化方法可以防止您陷入无关的细节中。

### 为 Aurora PostgreSQL 启用执行计划捕获

在集群参数组中设置 `aurora_compute_plan_id = on`。计划回退是导致突然性能下降的最常见原因之一，如果没有计划捕获，您将无从得知。开销很小。

### 使用按需分析进行事后回顾

在任何性能事件之后，为受影响的时间窗口生成性能分析报告。它提供了一个自动化的摘要，您可以附加到 COE 或事后分析中，并保留 15 个月。

### 利用跨账户监控用于多账户架构

如果您的组织对不同服务或环境使用单独的 AWS 账户，请使用 OAM 设置 CloudWatch 跨账户 observability。这使中央监控账户能够跨所有账户和区域看到舰队健康 Dashboard — 对于管理共享数据库基础设施的平台团队至关重要。

### 限制对 SQL 文本的访问

使用 IAM 策略限制对 SQL 文本维度的访问。数据库查询可能包含敏感数据（WHERE 子句中的客户 ID、电子邮件地址）。仅向 DBA 授予完整的 SQL 可见性，并将其他角色限制为聚合的 metrics。

---

## 规范性指导：您今天应该做什么

### 如果您刚开始：

1. **验证标准模式是否已激活** — 它应该是默认启用的。导航到 CloudWatch → Insights → Database Insights 并确认您可以看到您的实例。
2. **为您的生产数据库启用日志导出**到 CloudWatch Logs。
3. **设置 CloudWatch Alarms** 对 `CPUUtilization`、`DatabaseConnections` 和 `DBLoad` 进行监控。
4. **标记您的实例**，使用环境、服务和团队标签。

### 如果您运行生产工作负载：

1. **在生产集群上启用高级模式** — 15 个月的保留和舰队视图对于生产环境物有所值。
2. **启用增强监控**以获得操作系统级可见性。
3. **设置 `aurora_compute_plan_id = on`**（Aurora PostgreSQL）以进行执行计划捕获。
4. **创建舰队健康视图**按您的生产标签筛选。
5. **使用 CloudWatch Application Signals 检测您的应用程序**以启用调用服务视图。

### 如果您管理大型舰队：

1. **使用 OAM 设置跨账户跨区域监控**。

   OAM 工作原理：
   - **监控账户** — 您的团队查看 dashboard 的中央账户。您在此创建一个"接收器"来接受来自其他账户的数据。
   - **源账户** — 实际运行数据库的账户。您从每个源账户创建"链接"到监控账户的接收器，授予其读取 CloudWatch 数据的权限。

   链接后，监控账户可以看到来自所有源账户的 metrics、logs 和 traces，就像它们是本地的一样 — 包括 Database Insights 舰队健康 Dashboard，在单个视图中显示所有链接账户和区域的实例。
2. **创建多个舰队视图**按团队、服务或环境分段。
3. **建立分诊工作流程**：舰队健康 → 识别热点实例 → DB Load 分析 → who/what/where/when → 采取行动。
4. **对您流量最高的实例定期运行按需分析**，以在慢回退成为事件之前发现它们。

---

## 总结

CloudWatch Database Insights 将过去需要多个工具的功能 — Performance Insights、CloudWatch Metrics、CloudWatch Logs、RDS 控制台 — 整合到单一的引导式体验中。标准模式无需付费即可为您提供即时可见性。高级模式增加了严肃的生产监控所需的深度：舰队视图、锁树、执行计划、慢查询分析和 15 个月的保留。

思维方式的关键转变是从被动（"数据库很慢，让我 SSH 进去对 pg_stat_activity 运行查询"）转变为主动（"我可以看到整个舰队的健康状况，深入到任何实例，并在两分钟内从单个控制台回答 who/what/where/when"）。Database Insights 使该工作流程无需自定义工具或第三方解决方案即可实现。

---

## 参考资料

- [CloudWatch Database Insights 文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [开始使用 Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [锁分析](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Lock-Analysis.html)
- [执行计划分析](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Execution-Plans.html)
- [Amazon CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)
