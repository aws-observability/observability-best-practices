# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) は、フルマネージド型のコンテナオーケストレーションサービスです。コンテナ化されたアプリケーションの簡単なデプロイ、管理、スケーリングを可能にし、AWS の他のサービスと深く統合されています。

以下のレシピを、コンピュートエンジン別にご確認ください：




## 一般

- [AWS Distro for OpenTelemetry Collector と ECS を使用したデプロイパターン][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry による Amazon ECS モニタリングのセットアップの簡素化][ecs-adot-integration]




## ECS on EC2




### ログ

- [内部構造: Amazon ECS タスク向け FireLens][firelens-uth]




### メトリクス

- [Amazon ECS でのクロスアカウントメトリクス収集のための AWS Distro for OpenTelemetry コレクターの使用][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus を使用した ECS からのメトリクス収集][ecs-amp]
- [AWS App Mesh から Amazon CloudWatch への Envoy メトリクスの送信][ecs-appmesh-cw]




## ECS on Fargate




### ログ

- [Amazon ECS と AWS Fargate で Fluent Bit を使用した FireLens のサンプルログアーキテクチャ][firelens-fb]


[ecs-main]: https://aws.amazon.com/jp/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/jp/blogs/news/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/jp/blogs/news/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/jp/blogs/news/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
