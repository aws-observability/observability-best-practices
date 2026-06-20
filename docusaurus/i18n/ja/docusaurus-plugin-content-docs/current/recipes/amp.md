# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) は、Prometheus 互換のモニタリングサービスであり、コンテナ化されたアプリケーションを大規模に簡単に監視できます。AMP を使用すると、Prometheus クエリ言語 (PromQL) を使用してコンテナ化されたワークロードのパフォーマンスを監視できます。運用メトリクスの取り込み、保存、クエリの管理に必要な基盤インフラストラクチャを管理する必要はありません。

以下のレシピを確認してください。

- [AMP の使用開始][amp-gettingstarted]
- [EC2 上の EKS で ADOT を使用して AMP に取り込み、AMG で可視化する](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP へのクロスアカウント取り込みの設定][amp-xaccount]
- [AMP を使用した ECS からのメトリクス収集][amp-ecs-metrics]
- [AMP 用の Grafana Cloud Agent の設定][amp-gcwa]
- [AMP ワークスペースのクロスリージョンメトリクス収集の設定][amp-xregion-metrics]
- [EKS 上のセルフホスト Prometheus から AMP への移行のベストプラクティス][amp-migration]
- [AMP の使用開始ワークショップ][amp-oow]
- [Firehose と AWS Lambda を介した CloudWatch Metric Streams の Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)
- [Amazon Managed Service for Prometheus のデプロイと Alert manager の設定のための Infrastructure as a Code としての Terraform](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus と Amazon Managed Grafana を使用した EKS 上の Istio の監視][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere の監視][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator の紹介][eks-accelerator]
- [AMP と Amazon Managed Grafana を使用した Prometheus mixin ダッシュボードのインストール](recipes/amp-mixin-dashboards.md)
[amp-main]: https://aws.amazon.com/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://observability.workshop.aws/en/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-observability-accelerator.md
- [Amazon Managed Service for Prometheus と Alert Manager を使用した Amazon EC2 の自動スケーリング](recipes/as-ec2-using-amp-and-alertmanager.md)
