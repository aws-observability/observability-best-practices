# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) は、コンピューティングノードやアプリケーション関連のパフォーマンスデータなど、幅広いメトリクス機能とインサイトを提供する人気のオープンソースモニタリングツールです。

Prometheus はデータ収集に *プル* モデルを使用しますが、CloudWatch は *プッシュ* モデルを使用します。Prometheus と CloudWatch は一部の重複するユースケースで使用されますが、それらの運用モデルは大きく異なり、価格設定も異なります。

[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) は、Kubernetes や [Amazon ECS](https://aws.amazon.com/jp/ecs/) でホストされるコンテナ化されたアプリケーションで広く使用されています。

[CloudWatch エージェント](../tools/cloudwatch_agent/) や [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) を使用して、EC2 インスタンスや ECS/EKS クラスターに Prometheus メトリクス機能を追加できます。Prometheus をサポートする CloudWatch エージェントは、Prometheus メトリクスを発見して収集し、アプリケーションのパフォーマンス低下や障害をより迅速に監視、トラブルシューティング、アラームを発生させることができます。これにより、オブザーバビリティを向上させるために必要なモニタリングツールの数も減少します。

CloudWatch Container Insights の Prometheus モニタリングは、コンテナ化されたシステムやワークロードからの Prometheus メトリクスの発見を自動化します。https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html
