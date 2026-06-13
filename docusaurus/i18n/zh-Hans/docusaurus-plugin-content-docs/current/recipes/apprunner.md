# AWS App Runner

[AWS App Runner][apprunner-main] 是一项完全托管的服务，使开发人员能够快速大规模部署容器化 Web 应用程序和 API，无需具备基础设施经验。从源代码或容器镜像开始，App Runner 会自动构建和部署 Web 应用程序，加密负载均衡流量，根据您的流量需求进行扩展，并使您的服务能够轻松与其他 AWS 服务和在私有 Amazon VPC 中运行的应用程序通信。使用 App Runner，您无需考虑服务器或扩展问题，可以将更多时间专注于您的应用程序。




请查看以下实践方案：

## 通用
- [Container Day - Docker Con | 开发人员如何轻松实现大规模生产 Web 应用程序](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS 博客 | AWS App Runner 服务的集中式可观测性](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS 博客 | AWS App Runner VPC 网络的可观测性](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS 博客 | 使用 Amazon EventBridge 控制和监控 AWS App Runner 应用程序](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## Logs

- [查看流式传输到 CloudWatch Logs 的 App Runner 日志][apprunner-cwl]

## Metrics

- [查看报告给 CloudWatch 的 App Runner 服务 Metrics][apprunner-cwm]


## Traces
- [使用 AWS Distro for OpenTelemetry 开始 App Runner 的 AWS X-Ray 追踪](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray 集成](https://youtu.be/cVr8N7enCMM)
- [AWS 博客 | 使用 OpenTelemetry 追踪 AWS App Runner 服务](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS 博客 | 使用 AWS Copilot CLI 为 AWS App Runner 服务启用 AWS X-Ray 追踪](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html
