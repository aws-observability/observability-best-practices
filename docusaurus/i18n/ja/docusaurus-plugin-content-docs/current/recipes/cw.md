# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) は、DevOps エンジニア、開発者、サイト信頼性エンジニア (SRE)、IT マネージャー向けに構築された監視およびオブザーバビリティサービスです。CloudWatch は、ログ、メトリクス、イベントの形式で監視および運用データを収集し、AWS リソース、アプリケーション、AWS およびオンプレミスサーバーで実行されるサービスの統合ビューを提供します。

以下のレシピを確認してください。

- [CW Logs、Lambda、SNS を使用した RDS のプロアクティブなデータベースモニタリングの構築][rds-cw]
- [EKS における Kubernetes ネイティブ開発者向けの CloudWatch 中心のオブザーバビリティの実装][swa-eks-cw]
- [CW Synthetics を使用した Canary の作成][cw-synths]
- [ログのクエリのための CloudWatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch による異常検知][cw-am]
- [CloudWatch によるメトリクスアラーム][cw-alarms]
- [バックプレッシャーを回避するためのコンテナログオプションの選択][cw-fluentbit]
- [ECS および EKS 上の AWS Distro for OpenTelemetry を使用した CloudWatch Container Insights Prometheus サポートの紹介][cwci-adot]
- [CW Container Insights を使用した ECS コンテナ化アプリケーションとマイクロサービスのモニタリング][cwci-ecs]
- [CW Container Insights を使用した EKS コンテナ化アプリケーションとマイクロサービスのモニタリング][cwci-eks]
- [Firehose と AWS Lambda を使用した CloudWatch メトリクスストリームの Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA と Amazon CloudWatch を使用した Kubernetes ワークロードのプロアクティブなオートスケーリング][cw-keda-eks-scaling]
- [Amazon CloudWatch メトリクスエクスプローラーを使用したリソースタグでフィルタリングされたメトリクスの集約と可視化][metrics-explorer-filter-by-tags]


[cw-main]: https://aws.amazon.com/cloudwatch/
[rds-cw]: https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/
[swa-eks-cw]: https://aws.amazon.com/blogs/opensource/implementing-cloudwatch-centric-observability-for-kubernetes-native-developers-in-amazon-elastic-kubernetes-service/
[cw-synths]: https://observability.workshop.aws/en/synthetics.html
[cw-logsi]: https://observability.workshop.aws/en/logsinsights.html
[cw-lambda]: https://observability.workshop.aws/en/logsinsights.html
[cw-am]: https://observability.workshop.aws/en/anomalydetection.html
[cw-alarms]: https://observability.workshop.aws/en/alarms/_mericalarm.html
[cw-fluentbit]: https://aws.amazon.com/blogs/containers/choosing-container-logging-options-to-avoid-backpressure/
[cwci-adot]: https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/
[cwci-ecs]: https://observability.workshop.aws/en/containerinsights/ecs.html
[cwci-eks]: https://observability.workshop.aws/en/containerinsights/eks.html
[cw-keda-eks-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[metrics-explorer-filter-by-tags]: recipes/metrics-explorer-filter-by-tags.md
