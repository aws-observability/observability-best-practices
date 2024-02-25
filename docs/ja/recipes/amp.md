# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main](AMP) は、コンテナ化されたアプリケーションを大規模にモニタリングするのに役立つ Prometheus 互換のモニタリングサービスです。
AMP を使用すると、オペレーショナルメトリクスのインジェスト、ストレージ、クエリを管理するために必要な基盤を管理することなく、Prometheus クエリ言語 (PromQL) を使用してコンテナ化ワークロードのパフォーマンスをモニタリングできます。

以下のレシピをご確認ください。

- [AMP の概要][amp-gettingstarted]
- [ADOT を使用して EKS on EC2 から AMP にインジェストし、AMG で可視化](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP へのクロスアカウントインジェストの設定][amp-xaccount]
- [AMP を使用した ECS からのメトリクス収集][amp-ecs-metrics]
- [AMP 用 Grafana Cloud エージェントの構成][amp-gcwa]
- [AMP ワークスペースのクロスリージョンメトリクス収集の設定][amp-xregion-metrics]
- [EKS 上のセルフホストされた Prometheus から AMP への移行に関するベストプラクティス][amp-migration]
- [AMP の概要ワークショップ][amp-oow]
- [Firehose と AWS Lambda を使用した Cloudwatch メトリクスストリームの Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)
- [Terraform による Infrastructure as Code を使用した Amazon Managed Service for Prometheus および Alert Manager のデプロイ](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus と Amazon Managed Grafana を使用した EKS 上の Istio のモニタリング][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere のモニタリング][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator のご紹介][eks-accelerator]
- [AMP と Amazon Managed Grafana での Prometheus mixin ダッシュボードのインストール](recipes/amp-mixin-dashboards.md)
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
