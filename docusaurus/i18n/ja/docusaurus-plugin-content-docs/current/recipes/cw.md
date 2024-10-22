# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) は、DevOps エンジニア、開発者、サイト信頼性エンジニア (SRE)、IT マネージャー向けに構築された監視とオブザーバビリティのサービスです。
CloudWatch は、ログ、メトリクス、イベントの形式で監視とオペレーショナルデータを収集し、AWS 上とオンプレミスサーバー上で実行される AWS リソース、アプリケーション、サービスの統合ビューを提供します。

以下のレシピをご覧ください:

- [CW Logs、Lambda、SNS を使用した RDS の予防的データベース監視の構築][rds-cw]
- [EKS での Kubernetes ネイティブ開発者向け CloudWatch 中心のオブザーバビリティの実装][swa-eks-cw]
- [CW Synthetics を使った Canary の作成][cw-synths]
- [ログクエリのための CloudWatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch による異常検知][cw-am]
- [CloudWatch によるメトリクスアラーム][cw-alarms]
- [バックプレッシャを回避するためのコンテナログ記録オプションの選択][cw-fluentbit]
- [ECS と EKS での AWS Distro for OpenTelemetry を使った CloudWatch Container Insights の Prometheus サポート導入][cwci-adot]
- [CW Container Insights を使ったコンテナ化された ECS アプリケーションとマイクロサービスの監視][cwci-ecs]
- [CW Container Insights を使ったコンテナ化された EKS アプリケーションとマイクロサービスの監視][cwci-eks]
- [Firehose と AWS Lambda を使った Amazon Managed Service for Prometheus への CloudWatch メトリクスストリームのエクスポート](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA と Amazon CloudWatch を使った Kubernetes ワークロードの予防的オートスケーリング][cw-keda-eks-scaling]
- [リソースタグでフィルタリングしたメトリクスの集約と可視化のための Amazon CloudWatch Metrics エクスプローラーの使用][metrics-explorer-filter-by-tags]

[cw-main]: https://aws.amazon.com/jp/cloudwatch/
[rds-cw]: https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/
[swa-eks-cw]: https://aws.amazon.com/jp/blogs/news/implementing-cloudwatch-centric-observability-for-kubernetes-native-developers-in-amazon-elastic-kubernetes-service/
[cw-synths]: https://observability.workshop.aws/en/synthetics.html
[cw-logsi]: https://observability.workshop.aws/en/logsinsights.html
[cw-lambda]: https://observability.workshop.aws/en/logsinsights.html
[cw-am]: https://observability.workshop.aws/en/anomalydetection.html
[cw-alarms]: https://observability.workshop.aws/en/alarms/_mericalarm.html
[cw-fluentbit]: https://aws.amazon.com/blogs/containers/choosing-container-logging-options-to-avoid-backpressure/
[cwci-adot]: https://aws.amazon.com/jp/blogs/news/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/
[cwci-ecs]: https://observability.workshop.aws/en/containerinsights/ecs.html
[cwci-eks]: https://observability.workshop.aws/en/containerinsights/eks.html
[cw-keda-eks-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[metrics-explorer-filter-by-tags]: recipes/metrics-explorer-filter-by-tags.md
