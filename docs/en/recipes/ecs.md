# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) is a fully managed container
orchestration service that helps you easily deploy, manage, and scale 
containerized applications, deeply integrating with the rest of AWS.

Check out the following recipes, grouped by compute engine:

## General

- [Deployment patterns for the AWS Distro for OpenTelemetry Collector with ECS][adot-patterns-ecs]
- [Simplifying Amazon ECS monitoring set up with AWS Distro for OpenTelemetry][ecs-adot-integration]

## ECS on EC2

### Logs

- [Under the hood: FireLens for Amazon ECS Tasks][firelens-uth]

### Metrics

- [Using AWS Distro for OpenTelemetry collector for cross-account metrics collection on Amazon ECS][adot-xaccount-metrics]
- [Metrics collection from ECS using Amazon Managed Service for Prometheus][ecs-amp]
- [Sending Envoy metrics from AWS App Mesh to Amazon CloudWatch][ecs-appmesh-cw]

## ECS on Fargate

### Logs

- [Sample logging architectures for FireLens on Amazon ECS and AWS Fargate using Fluent Bit][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/