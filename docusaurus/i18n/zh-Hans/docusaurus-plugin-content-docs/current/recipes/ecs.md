# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) 是一项完全托管的容器编排服务，帮助您轻松部署、管理和扩展容器化应用程序，并与 AWS 的其他服务深度集成。

查看以下按计算引擎分组的实用方案：

## 通用

- [AWS Distro for OpenTelemetry Collector 与 ECS 的部署模式][adot-patterns-ecs]
- [使用 AWS Distro for OpenTelemetry 简化 Amazon ECS 监控设置][ecs-adot-integration]

## ECS on EC2

### Logs

- [深入了解：FireLens for Amazon ECS Tasks][firelens-uth]

### Metrics

- [使用 AWS Distro for OpenTelemetry collector 在 Amazon ECS 上进行跨账户 metrics 收集][adot-xaccount-metrics]
- [使用 Amazon Managed Service for Prometheus 从 ECS 收集 metrics][ecs-amp]
- [将 AWS App Mesh 的 Envoy metrics 发送到 Amazon CloudWatch][ecs-appmesh-cw]

## ECS on Fargate

### Logs

- [Amazon ECS 和 AWS Fargate 上使用 Fluent Bit 的 FireLens 示例日志架构][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
