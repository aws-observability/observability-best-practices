# 领导者和管理层

在当今数字优先的经济环境中，业务绩效与技术运营之间的界限已经消融。IT 领导者面临着多方面的压力：数字服务直接影响收入流、客户对可靠性的期望前所未有、竞争优势取决于技术韧性，以及监管要求更高的运营透明度。这种融合要求 IT 领导者通过有效的 Observability 策略展示卓越的运营能力和切实的业务价值创造。

---

鉴于这些挑战，组织必须将 Observability 从技术开销转变为具有可量化回报的战略投资。IT 领导者需要展示其 Observability 计划如何直接影响业务指标，从客户满意度评分到运营成本。以投资回报率为导向的方法确保在 Observability 工具和实践上花费的每一美元都能在事件响应时间、系统可靠性和团队生产力方面产生可衡量的改善，最终保护和增强收入流。

古老的管理原则在此尤为适用："如果无法衡量，就无法管理。"这就是行业领导者加大对 Observability 作为一等功能需求投入的原因。作为领导者，如果您的目标是加速根因分析（RCA）并减少平均恢复时间（MTTR），那么您的 Observability 策略应与组织的核心业务目标和优先事项紧密耦合。这确保生成的洞察直接支持改善组织的关键绩效指标（KPI）。重要的不是投资于市场上最新最好的 AI Observability 工具，而是确保您能够"衡量"与组织目标一致的信号！

## 构建有效的 Observability 策略

如何将 Observability 转化为切实的业务成果？答案在于关注以下关键领域：客户体验、应用程序性能与可靠性，以及运营效率与成本优化。要将 Observability 转化为切实的业务成果，让我们从最关键的方面开始：客户体验。

![COP305_1](../images/cop305_1.png)

#### 衡量客户体验

首先，衡量客户体验需要超越传统的系统指标。我们建议实施服务水平目标（SLO）作为您的主要衡量框架。SLO 基于关键的终端用户旅程（而不仅仅是系统指标）提供商定的服务可用性目标。这种以客户为中心的方法确保您的 Observability 策略直接与最重要的事情保持一致——终端用户体验，这应该是所有技术决策的北极星。现在，让我们熟悉代表您对客户的承诺以及告诉您服务健康程度的可跟踪度量的术语。

- SLI（服务水平指标）是对所提供服务水平某些方面的精心定义的定量度量。
- SLO（服务水平目标）是在一段时间内由 SLI 衡量的服务水平的目标值或值范围。
- SLA（服务水平协议）是与客户的协议，概述您承诺提供的服务水平。SLA 还详细说明了未满足要求时的行动方案，如额外支持或价格折扣。

随着 Amazon CloudWatch [Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) 的推出，您现在可以在 AWS 中原生创建和监控 SLO。Application Signals 在 CloudWatch 中提供了全面的应用程序性能监控解决方案，使您能够将 SLO 连接到 APM 体验。您可以使用 CloudWatch 中可用的任何指标开始使用 SLO。这使得使用当前在 CloudWatch 中可用的指标变得容易上手。如需进一步了解，请参阅博客[通过有效的 SLO 提高应用程序可靠性](https://aws.amazon.com/blogs/mt/improve-application-reliability-with-effective-slos)。虽然客户满意度至关重要，但它与应用程序的性能和可靠性直接相关。让我们探索如何监控和改善这些关键方面。

#### 提升应用程序性能和可靠性
应用程序可靠性构成有效 Observability 的下一个支柱，通过监控关键应用程序的"黄金信号"来实现：可用性、延迟、错误和流量。这些指标提供了应用程序健康状况和性能的全面视图。与 SLO 结合使用时，它们创建了一个强大的框架，用于在优化运营成本的同时保持高可靠性。

![COP305_2](../images/cop305_2.png)

通过 [Amazon Route 53 健康检查](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html)和 [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)，您可以监控和分析应用程序和工作负载的性能和运行时状况。您还可以使用 AWS CloudWatch Synthetics 监控本地应用程序的可用性和健康状况。

借助 [Amazon CloudWatch 网络和互联网监控](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Network-Monitoring-Sections.html)功能的综合优势，包括 [Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html)、[Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) 和 [Network Synthetic Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html)，您可以可视化数据、获取洞察以及对托管在 AWS 上的应用程序的网络和互联网性能及可用性进行运营可视化。

通过 [Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)，您可以收集、聚合和汇总容器化应用程序和微服务的指标和日志。Container Insights 可用于 Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS) 以及 Amazon EC2 上的 Kubernetes 平台。

通过 [Amazon CloudWatch Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)，您可以大规模监控和排查 Amazon Aurora MySQL、Amazon Aurora PostgreSQL、Amazon RDS for SQL Server、RDS for MySQL、RDS for PostgreSQL、RDS for Oracle 和 RDS for MariaDB 数据库。

通过 [Amazon CloudWatch 跨账户 Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)，您可以监控和排查跨区域内多个账户的应用程序。您可以在任何关联账户中搜索、可视化和分析指标、日志、traces、Application Signals 服务和服务水平目标（SLO）、Application Insights 应用程序以及互联网监视器，而无需受到账户边界的限制。

通过 [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)，您可以大规模可视化和分析运营数据。通过与 AWS 数据源的无缝集成以及通过统一 dashboard 实现跨团队协作，它允许您将来自多个来源的 Observability 数据（包括应用程序和基础设施的指标、日志和 traces）整合到可定制的可视化中，帮助您快速识别和解决运营问题。

建立了可靠的客户体验和应用程序性能监控之后，我们现在可以将注意力转向优化策略相关的成本。

#### 优化成本
成本优化自然而然地从有效的 Observability 中产生。许多组织陷入了监控一切的陷阱——即"错失恐惧症"（FOMO）综合征——导致复杂、资源密集型系统产生的噪音多于洞察。关键是识别与业务服务成功和增强用户体验直接相关的 KPI。成功在于战略性数据收集，最重要的是，在整个 Observability 旅程中让业务利益相关者参与其中。您的 Observability 策略应明显加速根因分析（RCA）、减少平均恢复时间（MTTR），并最终降低运营成本——同时保持对真正影响业务的核心指标的关注。

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) 提供了一个易于使用的界面，让您可以可视化、了解和管理您的 AWS 成本和随时间变化的使用情况。Cost Explorer 使用与生成 [AWS Cost and Usage Reports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) 和详细账单报告相同的数据集。通过创建 [Amazon CloudWatch 账单告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)，您可以监控预估的 AWS 费用。当您为 AWS 账户启用预估费用监控时，预估费用将每天多次计算并作为指标数据发送到 CloudWatch。当您的账户账单超过您指定的阈值时，告警将触发。

既然我们已经概述了有效 Observability 策略的关键组成部分，让我们来看看实施后您可以期望获得的切实收益和业务影响。

### 可量化的成果和业务影响

一个良好实施的 Observability 策略在整个组织中既能带来可量化的财务回报，也能带来定性收益。让我们分解一些您可以期望的成果：

#### 成本节约
战略性 Observability 通过双重渠道带来财务收益：直接成本降低和收入保护。通过减少 MTTR 和预防措施衡量的运营改善，通过事件成本和解决时间的减少产生直接的成本节约。这些节约通过团队效率提升而被放大，通过减少的劳动工时来量化。即使是客户留存率的适度改善，从客户生命周期价值的角度来看，也可以转化为可观的收入保护。

#### 运营效率
资源优化通常在基础设施支出方面带来超过 40% 的成本降低。例行任务的自动化消除了手动工作，节约通过手动工时减少乘以人力成本来计算。这些效率随时间复合，创造持续的成本收益。

#### 文化转型和卓越运营
Observability 的真正力量在于它能够同时转变文化和运营。虽然自动化告警关联和上下文故障排除驱动了即时效率提升，但更深层的影响来自团队工作和协作方式的根本转变。自助服务能力赋予独立解决问题的能力，而全面的可见性则实现了主动风险管理。这创造了一个良性循环，其中增强的客户满意度、改善的开发者体验和加强的安全态势相互强化。

理解可量化的成果为您组织的 Observability 未来奠定了基础。让我们最后看看这一策略如何转变您的运营并推动长期成功。

### 前进之路
迈向有效 Observability 的旅程不仅仅是实施工具或收集数据——而是转变组织的运营方式、决策方式和价值交付方式。通过关注有意义的指标、将技术能力与业务成果对齐，以及通过自动化和自助服务能力赋能团队，组织可以将 Observability 转变为战略优势。随着我们在日益数字化的世界中前进，掌握这一学科的组织将发现自己能够更好地满足客户期望、推动创新并实现可持续增长。未来属于那些不仅能收集数据，还能将其转化为推动业务成功的可操作洞察的组织。
