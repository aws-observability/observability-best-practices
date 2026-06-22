# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) は、コンピュートノードやアプリケーション関連のパフォーマンスデータなどのリソースに関する幅広いメトリクス機能とインサイトを提供する、人気のオープンソース監視ツールです。

Prometheus は*プル*モデルを使用してデータを収集しますが、CloudWatch は*プッシュ*モデルを使用します。Prometheus と CloudWatch は一部の重複するユースケースで使用されますが、その運用モデルは大きく異なり、価格設定も異なります。

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) は、Kubernetes および [Amazon ECS](https://aws.amazon.com/ecs/) でホストされているコンテナ化されたアプリケーションで広く使用されています。

[CloudWatch エージェント](./cloudwatch_agent.md)または [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) を使用して、EC2 インスタンスまたは ECS/EKS クラスターに Prometheus メトリクス機能を追加できます。Prometheus サポートを備えた CloudWatch エージェントは、Prometheus メトリクスを検出して収集し、アプリケーションのパフォーマンス低下や障害をより迅速に監視、トラブルシューティング、およびアラームできるようにします。また、オブザーバビリティを向上させるために必要な監視ツールの数を削減します。

CloudWatch Container Insights の Prometheus モニタリングは、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの検出を自動化します。https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html