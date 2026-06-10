# DevOps

作为 DevOps 工程师，将强大的 Observability 实践集成到您的工作流程中对于维护高性能、可靠和安全的系统至关重要。本指南提供了针对 DevOps 视角的 Observability 最佳实践，重点关注持续交付生命周期和基础设施管理流程中的实际实施。

## 持续集成和交付流水线（CI/CD）

要通过 Observability 优化您的 CI/CD 流水线：
 
- 实施对[流水线](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html)、[构建](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html)和[部署](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html)的监控，以维护 CI/CD 的可靠性、可用性和性能。

- 为关键 CI/CD 事件创建 [CloudWatch 告警](https://aws-observability.github.io/observability-best-practices/tools/alarms)。设置通过 Amazon SNS 发送通知，以在流水线失败或阶段运行时间过长时提醒您的团队。

     *  配置 [CodeBuild 中的 CloudWatch 告警](https://docs.aws.amazon.com/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html)。
     *  配置 [CodeDeploy 中的 CloudWatch 告警](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html)。
 
- 使用 [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray/) 对您的流水线进行插桩，以跟踪 CI/CD 流水线各阶段的请求。

- 创建整合的 [CloudWatch dashboard](https://aws-observability.github.io/observability-best-practices/tools/dashboards) 来跟踪 [CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-metrics.html)、[CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html) 和 [Pipelines](https://docs.aws.amazon.com/codepipeline/latest/userguide/metrics-dimensions.html) 的关键指标。

## 基础设施即代码（IaC）实践

要在 IaC 工作流中实现有效的 Observability：

- 在 [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html) 模板中嵌入 [CloudWatch 告警](https://aws-observability.github.io/observability-best-practices/tools/alarms)和 [Dashboard](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch-dashboard)。这确保了所有环境中的一致监控。

- 实施集中式日志：使用 Amazon CloudWatch Logs 或 [Amazon OpenSearch Service](https://aws-observability.github.io/observability-best-practices/recipes/aes) 等服务设置[集中式日志解决方案](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount)。将日志保留策略和日志组定义为 IaC 模板的一部分。

- 使用 IaC 配置 [VPC 流日志](https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs)以捕获网络流量信息用于安全和性能分析。

- 在 [IaC 模板](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html#cicd-pipeline-managed-resources)中使用一致的标签策略，以促进更好的资源组织并实现更精细的监控和成本分配。

- 使用 [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/creating-resources-with-cloudformation.html) 并将其与应用程序代码集成以启用分布式追踪。在 IaC 模板中定义 X-Ray 采样规则和组。



## 容器化和 Kubernetes 编排

对于容器化应用程序和 Kubernetes 环境：

- 实施 [Amazon EKS 与 Container Insights](https://aws-observability.github.io/observability-best-practices/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights) 以实现全面的容器和集群监控。

- 使用 [AWS Distro for OpenTelemetry](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) 从容器化应用程序收集和导出遥测数据。

- 在 EKS 上实施 [Prometheus 和 Grafana](https://aws-observability.github.io/observability-best-practices/patterns/eksampamg) 以进行高级指标收集和可视化。使用 AWS Managed Grafana 服务以简化设置和管理。

- 使用 Flux 或 ArgoCD 等工具实施 [GitOps](https://aws-observability.github.io/observability-best-practices/guides/operational/gitops-with-amg/#introduction-to-gitops) 实践进行 Kubernetes 部署。将这些工具与 CloudWatch 集成以监控 GitOps 工作流的同步状态和健康状况。

## CI/CD 流水线中的安全和合规

要增强流水线中的安全 Observability：

- 将 [Amazon Inspector](https://aws.amazon.com/inspector/) 集成到 CI/CD 流程中以进行自动化漏洞评估。

- 实施 [AWS Security Hub](https://aws.amazon.com/security-hub/) 以聚合和优先排序 AWS 账户中的安全告警。

- 使用 [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html) 跟踪资源配置和变更。设置 Config 规则以自动评估与您定义标准的合规性。

- 利用 [Amazon GuardDuty](https://aws.amazon.com/blogs/aws/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/) 进行智能威胁检测，并将其发现与您的事件响应工作流集成。

- 通过使用 CloudFormation 或 Terraform 定义 AWS WAF 规则、Security Hub 控制和 GuardDuty 过滤器来实施安全即代码。这确保安全 Observability 随基础设施一起演进。

## 自动化测试和质量保证策略

要通过 Observability 增强您的测试流程：

- 实施 [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/Welcome.html) 以创建持续测试 API 和用户旅程的金丝雀。

- 使用 AWS CodeBuild 运行测试套件并将测试结果作为 CloudWatch 指标发布以进行趋势分析。

- 在测试环境中实施 [AWS X-Ray 追踪](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-traces.html)以在测试阶段获得性能洞察。

- 利用 Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum)（真实用户监控）收集和分析用户与应用程序真实交互的体验数据。

- 使用 [AWS Fault Injection Simulator](https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/) 实施混沌工程实践。监控模拟故障的影响以[增强系统韧性](https://aws.amazon.com/blogs/aws/monitor-and-improve-your-application-resiliency-with-resilience-hub/)。

## 发布管理和部署最佳实践

要实现 Observability 驱动的发布管理：

- 使用 [AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) 进行托管部署，利用其与 CloudWatch 的集成进行部署监控。

- 执行金丝雀部署，逐步将新版本发布到基础设施的一小部分。使用 CloudWatch 和 X-Ray 密切[监控金丝雀部署](https://aws.amazon.com/blogs/containers/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/)，以在全面部署前捕获任何问题。

- 配置部署在预定义的监控阈值被突破时[自动回滚](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)到之前的稳定版本。

- 使用 Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum)（真实用户监控）收集和分析实际用户会话的性能数据。这提供了关于发布如何影响终端用户体验的洞察。

- 配置 [CloudWatch 告警](https://aws-observability.github.io/observability-best-practices/tools/alarms)以在发布后立即通知团队任何异常或性能问题。将这些告警与 Amazon SNS 集成以实现及时通知。

- 利用 AI 驱动的洞察，使用 [Amazon DevOps Guru](https://aws.amazon.com/blogs/aws/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/) 自动检测运营问题并获取 ML 驱动的建议以改善发布后的应用程序健康状况和性能。

- 使用 AWS Systems Manager Parameter Store 或 Secrets Manager 管理功能标志，并通过自定义 [CloudWatch 指标](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html)监控其使用情况。


## 总结

采用 Observability 实践不仅仅是维护系统——它是迈向实现卓越运营和推动组织持续创新的战略举措。请记住，随着系统的演进，不断完善您的 Observability 策略，利用新的 AWS 功能和服务。
