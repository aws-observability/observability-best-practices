# 什么是 Observability

## 定义

Observability 是一种基于被观测系统发出的信号，持续生成和发现可操作洞察的能力。换句话说，Observability 使用户能够通过系统的外部输出来理解系统状态，并采取（纠正）措施。

## 它解决的问题

计算机系统通过观测底层信号（如 CPU 时间、内存、磁盘空间）以及更高级别的业务信号（包括 API 响应时间、错误率、每秒事务数等）来进行度量。

系统的可观测性对其运营和开发成本有着重大影响。可观测的系统能向运维人员提供有意义的、可操作的数据，使他们能够实现更好的结果（更快的事件响应、更高的开发人员生产力），减少繁琐工作和停机时间。

## 它如何帮助

理解"更多信息并不一定意味着更高的可观测性"这一点至关重要。事实上，有时系统生成的信息量反而会使得从应用程序产生的噪声中识别有价值的健康信号变得更加困难。Observability 需要在正确的时间为正确的消费者（人或软件）提供正确的数据，以做出正确的决策。

## 您将在这里找到什么

本站包含我们的 Observability 最佳实践：应该做什么、*不应该*做什么，以及如何实施的方案集合。这里的大部分内容是厂商无关的，代表了任何优秀的 Observability 解决方案应提供的内容。

重要的是，您应该将 Observability 视为一个*解决方案*而非一个*产品*。Observability 源于您的实践，是强大的开发和 DevOps 领导力不可或缺的一部分。一个具有良好可观测性的应用程序会将 Observability 作为运维的核心原则，类似于安全性必须处于项目组织方式的最前沿。试图在事后"附加" Observability 是一种反模式，成功率较低。

本站分为四个类别：

1. [按解决方案分类的最佳实践，如 dashboard、应用性能监控或容器](https://aws-observability.github.io/observability-best-practices/guides/)
1. [按不同数据类型的最佳实践，如 logs 或 traces](https://aws-observability.github.io/observability-best-practices/signals/logs/)
1. [特定 AWS 工具的最佳实践（这些在很大程度上也适用于其他厂商的产品）](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
1. [精选的 AWS Observability 方案](https://aws-observability.github.io/observability-best-practices/recipes/)

:::info
	本站基于 AWS 和我们的客户实际解决的真实用例。

	Observability 是现代应用程序开发的核心，也是运营分布式系统（如微服务）或具有许多外部集成的复杂应用程序时的关键考量。我们认为它是健康工作负载的领先指标，我们很高兴在此与您分享我们的经验！
:::
