# 选择追踪代理

## 选择合适的代理

AWS 直接支持两种[追踪](../signals/traces.md)收集工具集（以及我们丰富的 [observability 合作伙伴](https://aws.amazon.com/products/management-and-governance/partners/)）：

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)，通常称为 ADOT
* X-Ray [SDKs](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) 和 [daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)

在您发展 observability 解决方案的过程中，选择使用哪种工具或工具组合是您必须做出的关键决策。这些工具并不相互排斥，您可以根据需要混合使用它们。对于做出此选择，有一个最佳实践。但首先，您应该了解 [OpenTelemetry (OTEL)](https://opentelemetry.io/) 的当前状态。

OTEL 是当前行业标准的 observability 信号规范，包含三种核心信号类型的定义：[metrics](../signals/metrics.md)、[traces](../signals/traces.md) 和 [logs](../signals/logs.md)。然而，OTEL 并非一直存在，它是从早期规范（如 [OpenMetrics](https://openmetrics.io) 和 [OpenTracing](https://opentracing.io)）演变而来的。Observability 供应商近年来开始公开支持 OpenTelemetry Line Protocol (OTLP)。

AWS X-Ray 和 CloudWatch 早于 OTEL 规范，其他领先的 observability 解决方案也是如此。然而，AWS X-Ray 服务可以使用 ADOT 轻松接收 OTEL traces。ADOT 已经内置了直接向 X-Ray 以及其他 ISV 解决方案发送遥测数据的集成。

任何事务追踪解决方案都需要一个代理和与底层应用程序的集成来收集信号。这反过来会以库的形式创建技术债务，这些库必须被测试、维护和升级，如果您将来选择更改解决方案，还可能需要重新配置工具。

X-Ray 包含的 SDKs 是 AWS 提供的紧密集成的插桩解决方案的一部分。ADOT 是更广泛行业解决方案的一部分，其中 X-Ray 只是众多追踪解决方案之一。您可以使用任一方法在 X-Ray 中实现端到端追踪，但了解它们的差异对于确定最适合您的方法很重要。

:::info
	如果您需要以下功能，我们建议使用 AWS Distro for OpenTelemetry 来插桩您的应用程序：

    * 能够将 traces 发送到多个不同的追踪后端而无需重新插桩代码。例如，如果您希望从使用 X-Ray 控制台切换到 [Zipkin](https://zipkin.io)，则只需更改 collector 的配置，应用程序代码无需改动。

    * 支持每种语言的大量库插桩，由 OpenTelemetry 社区维护。
:::

:::info
	如果您需要以下功能，我们建议选择 X-Ray SDK 来插桩您的应用程序：

    * 紧密集成的单一供应商解决方案。

    * 与 X-Ray 集中采样规则集成，包括在使用 Node.js、Python、Ruby 或 .NET 时能够从 X-Ray 控制台配置采样规则并自动在多个主机上使用它们。
:::
