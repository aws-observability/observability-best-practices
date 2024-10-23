# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) は、コンテナ化されたアプリケーションの簡単なデプロイ、管理、スケーリングを支援する、フルマネージドのコンテナオーケストレーションサービスです。AWS の他のサービスと深く統合されています。

以下のレシピをコンピューティングエンジン別にグループ化して確認してください：




## 一般

- [ECS における AWS Distro for OpenTelemetry Collector のデプロイパターン][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry を使用した Amazon ECS モニタリングのセットアップの簡素化][ecs-adot-integration]




## EC2 上の ECS




### ログ

- [内部構造: Amazon ECS タスク用の FireLens][firelens-uth]




### メトリクス

- [Amazon ECS でのクロスアカウントメトリクス収集に AWS Distro for OpenTelemetry コレクターを使用する][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus を使用した ECS からのメトリクス収集][ecs-amp]
- [AWS App Mesh から Amazon CloudWatch への Envoy メトリクスの送信][ecs-appmesh-cw]




## ECS on Fargate




### ログ

- [Amazon ECS と AWS Fargate 上の FireLens 用のサンプルロギングアーキテクチャ（Fluent Bit 使用）][firelens-fb]


[ecs-main]: https://aws.amazon.com/jp/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/jp/blogs/news/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/jp/blogs/news/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/jp/blogs/news/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
