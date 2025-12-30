# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) は、フルマネージド型のコンテナオーケストレーションサービスで、コンテナ化されたアプリケーションのデプロイ、管理、スケーリングを容易にし、AWS の他のサービスと深く統合されています。

コンピューティングエンジン別にグループ化された以下のレシピを確認してください。

## 一般

- [ECS での AWS Distro for OpenTelemetry Collector のデプロイパターン][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry による Amazon ECS モニタリングセットアップの簡素化][ecs-adot-integration]

## EC2 上の ECS

### ログ

- [内部の仕組み: Amazon ECS タスク用 FireLens][firelens-uth]

### メトリクス

- [Amazon ECS でクロスアカウントメトリクス収集に AWS Distro for OpenTelemetry コレクターを使用する][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus を使用した ECS からのメトリクス収集][ecs-amp]
- [AWS App Mesh から Amazon CloudWatch への Envoy メトリクスの送信][ecs-appmesh-cw]

## Fargate 上の ECS

### ログ

- [Fluent Bit を使用した Amazon ECS および AWS Fargate 上の FireLens のサンプルログ記録アーキテクチャ][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/