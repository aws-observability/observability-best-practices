# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) は、完全マネージド型のコンテナオーケストレーションサービスで、コンテナ化されたアプリケーションを簡単にデプロイ、管理、スケーリングできます。AWS の他のサービスとも深く統合されています。

以下のレシピは、コンピューティングエンジンごとにグループ化されています。

## 一般

- [ECS での AWS Distro for OpenTelemetry Collector のデプロイパターン][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry を使用した Amazon ECS モニタリングのセットアップの簡素化][ecs-adot-integration]

## EC2 上の ECS

### ログ

- [内部構造: Amazon ECS タスクの FireLens][firelens-uth]

### メトリクス

- [Amazon ECS 上のクロスアカウントメトリクス収集に AWS Distro for OpenTelemetry コレクターを使用する][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus を使用した ECS からのメトリクス収集][ecs-amp]
- [AWS App Mesh から Envoy メトリクスを Amazon CloudWatch に送信する][ecs-appmesh-cw]

## ECS on Fargate

### ログ

- [Fluent Bit を使用した Amazon ECS と AWS Fargate 上の FireLens のサンプルログアーキテクチャ][firelens-fb]
