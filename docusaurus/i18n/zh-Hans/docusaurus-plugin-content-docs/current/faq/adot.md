# AWS Distro for Open Telemetry (ADOT) - 常见问题

## 我可以使用 ADOT collector 将 metrics 摄取到 AMP 吗？

是的，此功能在 2022 年 5 月 metrics 支持正式发布时引入，您可以从 EC2、通过我们的 EKS 插件、通过我们的 ECS sidecar 集成和/或通过我们的 Lambda layers 使用 ADOT collector。

## 我可以使用 ADOT collector 收集 logs 并将其摄取到 Amazon CloudWatch 或 Amazon OpenSearch 吗？

是的。[Logs 支持](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/)自 2023 年 11 月 22 日起可用。您可以查看 [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) 页面了解更多详情。

## 在哪里可以找到 ADOT collector 的资源使用情况和性能详情？

我们有一份在线的[性能报告](https://aws-observability.github.io/aws-otel-collector/benchmark/report)，会随着 collector 的发布保持更新。

## ADOT 可以与 Apache Kafka 一起使用吗？

是的，Kafka exporter 和 receiver 的支持已在 ADOT collector v0.28.0 中添加。更多详情请查看 [ADOT collector 文档](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)。
.
## 如何配置 ADOT collector？

ADOT collector 使用本地存储的 YAML 配置文件进行配置。除此之外，还可以使用存储在其他位置的配置，如 S3 buckets。ADOT collector 支持的所有配置机制在 [ADOT collector 文档](https://aws-otel.github.io/docs/components/confmap-providers)中有详细描述。

## 我可以在 ADOT collector 中进行高级采样吗？

是的。[高级采样](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/)于 2023 年 5 月 15 日发布。查看[使用 AWS Distro for OpenTelemetry 开始高级采样](https://aws-otel.github.io/docs/getting-started/advanced-sampling)页面了解更多详情。

## 有关于如何扩展 ADOT collector 的建议吗？

有的！请参阅上游 OpenTelemetry 文档中关于[扩展 Collector](https://opentelemetry.io/docs/collector/scaling/) 的内容。

## 我有一批 ADOT collector，如何管理它们？

这是一个活跃开发的领域，我们预计它将在 2023 年成熟，请参阅上游 OpenTelemetry 文档中关于[管理](https://opentelemetry.io/docs/collector/management/)的更多详情，特别是关于 [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) 的部分。

## 如何监控 ADOT collector 的健康状况和性能？

1. [监控 collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - 默认 metrics 暴露在端口 8080 上，可以被 Prometheus receiver 抓取
2. 使用 [Node Exporter](https://prometheus.io/docs/guides/node-exporter/)，运行 node exporter 还可以提供有关 collector 所运行的节点、pod 和操作系统的多项性能和健康 metrics。
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics)，KSM 还可以生成有关 collector 的有价值的事件。
4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. 一个用于入门的简单 Grafana dashboard：[https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**产品常见问题：** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)
