# AWS X-Ray - 常见问题

## AWS Distro for Open Telemetry (ADOT) 是否支持跨 AWS 服务（如 Event Bridge 或 SQS）的 trace 传播？

严格来说，这不是 ADOT 的功能而是 AWS X-Ray 的。我们正在努力扩展传播和/或生成 spans 的 AWS 服务的数量和类型。如果您有依赖于此的使用场景，请联系我们。

## 我可以使用 W3C trace header 通过 ADOT 将 spans 摄取到 AWS X-Ray 吗？

是的。[W3C trace header](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) 于 2023 年 10 月 27 日发布。

## 当中间涉及 SQS 时，我可以跨 Lambda 函数追踪请求吗？

是的。X-Ray 现在支持在中间涉及 SQS 时跨 Lambda 函数进行追踪。上游消息生产者的 traces 会[自动链接到](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html)下游 Lambda 消费者节点的 traces，从而创建应用程序的端到端视图。

## 我应该使用 X-Ray SDK 还是 OTel SDK 来检测我的应用程序？

OTel 比 X-Ray SDK 提供更多功能，但要选择哪个更适合您的使用场景，请参阅[在 ADOT 和 X-Ray SDK 之间选择](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)

## AWS X-Ray 是否支持 [span events](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events)？

Span events 不适合 X-Ray 模型，因此会被丢弃。

## 如何从 AWS X-Ray 中提取数据？

您可以[使用 X-Ray API](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html) 检索 Service Graph、Traces 和根因分析数据。

## 我可以实现 100% 的采样率吗？也就是说，我想记录所有 traces 而不进行任何采样。

您可以调整采样规则以捕获显著增加的 trace 数据量。只要发送的总 segments 不超过[此处提到的服务配额限制](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray)，X-Ray 将尽力按照配置收集数据。但这并不能保证实现 100% 的 trace 数据捕获。

## 我可以通过 API 动态增加或减少采样规则吗？

是的，您可以使用 [X-Ray 采样 API](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) 根据需要进行动态调整。请参阅此[博客了解基于使用场景的说明](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)。

**产品常见问题：** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)
