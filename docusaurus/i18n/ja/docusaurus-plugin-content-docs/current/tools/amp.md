# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) は、コンピュートノードやアプリケーション関連のパフォーマンスデータなど、幅広いメトリクス機能とインサイトを提供する、人気のあるオープンソースのモニタリングツールです。

Prometheus はデータを収集するために *プル* モデルを使用しますが、CloudWatch は *プッシュ* モデルを使用します。Prometheus と CloudWatch は一部の使用事例で重複していますが、運用モデルは大きく異なり、価格設定も異なります。

[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) は、Kubernetes や [Amazon ECS](https://aws.amazon.com/jp/ecs/) でホストされているコンテナ化されたアプリケーションで広く使用されています。

[CloudWatch エージェント](../tools/cloudwatch_agent/) または [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) を使用して、EC2 インスタンスや ECS/EKS クラスターに Prometheus メトリクス機能を追加できます。Prometheus をサポートする CloudWatch エージェントは、Prometheus メトリクスを検出して収集し、アプリケーションのパフォーマンス低下や障害をより迅速にモニタリング、トラブルシューティング、アラーム通知することができます。これにより、オブザーバビリティを向上させるために必要なモニタリングツールの数も削減できます。

CloudWatch Container Insights の Prometheus モニタリングは、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの検出を自動化します https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html
