# AWS Lambda

[AWS Lambda][lambda-main] 是一项无服务器计算服务，让您无需预置或管理服务器、创建工作负载感知的集群扩展逻辑、维护事件集成或管理运行时即可运行代码。

请查看以下实践方案：

## Logs

- [部署和监控无服务器应用程序][aes-ws]

## Metrics

- [CloudWatch Lambda Insights 简介][lambda-cwi]
- [通过 Firehose 和 AWS Lambda 将 CloudWatch Metric Streams 导出到 Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)

## Traces

- [使用 AWS Distro for OpenTelemetry Lambda 层自动检测 Python 应用程序][lambda-layer-python-xray-adot]
- [使用 OpenTelemetry 在 AWS X-Ray 中追踪 AWS Lambda 函数][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/
