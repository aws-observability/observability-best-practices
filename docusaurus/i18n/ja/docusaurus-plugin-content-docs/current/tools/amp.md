# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) は、コンピューティングノードやアプリケーション関連のパフォーマンスデータなどのリソースに関する幅広いメトリクス機能と洞察を提供する、人気のあるオープンソース監視ツールです。

Prometheus はデータ収集に*プル*モデルを使用しますが、CloudWatch は*プッシュ*モデルを使用します。Prometheus と CloudWatch は一部の重複するユースケースで使用されますが、それぞれの運用モデルは大きく異なり、料金体系も異なります。

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) は、Kubernetes および [Amazon ECS](https://aws.amazon.com/ecs/) でホストされるコンテナ化されたアプリケーションで広く使用されています。

EC2 インスタンスまたは ECS/EKS クラスターに Prometheus メトリクス機能を追加するには、[CloudWatch エージェント](../tools/cloudwatch_agent/)または [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) を使用します。Prometheus サポートを備えた CloudWatch エージェントは、Prometheus メトリクスを検出して収集し、アプリケーションのパフォーマンス低下や障害をより迅速に監視、トラブルシューティング、アラーム通知できるようにします。これにより、可観測性を向上させるために必要な監視ツールの数も削減されます。

CloudWatch Container Insights の Prometheus 向けモニタリングは、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの検出を自動化します https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html