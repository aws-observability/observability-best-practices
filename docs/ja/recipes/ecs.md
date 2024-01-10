# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main](ECS) は、AWS の他のサービスと深く統合された、コンテナ化されたアプリケーションを簡単にデプロイ、管理、スケーリングできる、完全マネージドなコンテナオーケストレーションサービスです。

以下のレシピを参照してください。コンピュートエンジン別にグループ化されています。

## 全般

- [ECS での AWS Distro for OpenTelemetry Collector のデプロイメントパターン][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry での Amazon ECS モニタリングのセットアップを簡素化][ecs-adot-integration]

## ECS on EC2

### ログ

- [内部構造: Amazon ECS タスクの FireLens][firelens-uth]

### メトリクス

- [Amazon ECS でのクロスアカウント メトリクス収集のための AWS Distro for OpenTelemetry コレクターの使用][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus を使用した ECS からのメトリクス収集][ecs-amp]
- [AWS App Mesh から Amazon CloudWatch への Envoy メトリクスの送信][ecs-appmesh-cw]

## ECS on Fargate

### ログ

- [Fluent Bit を使用した Amazon ECS および AWS Fargate 上の FireLens のサンプルロギングアーキテクチャ][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
