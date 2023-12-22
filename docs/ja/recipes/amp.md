# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main](AMP) は、コンテナ化されたアプリケーションを大規模に監視するのに適した Prometheus 互換の監視サービスです。AMP を使用すると、Prometheus クエリ言語(PromQL)を使用して、運用メトリクスの取り込み、保存、クエリを管理するために必要な基盤を管理することなく、コンテナ化ワークロードのパフォーマンスを監視できます。

以下のレシピをご覧ください。

- [AMP の概要][amp-gettingstarted]
- [EC2 上の EKS で ADOT を使用して AMP に取り込み、AMG で可視化](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP へのクロスアカウント取り込みの設定][amp-xaccount]
- [AMP を使用した ECS からのメトリクス収集][amp-ecs-metrics]
- [AMP 用 Grafana Cloud エージェントの設定][amp-gcwa]
- [AMP ワークスペースのクロスリージョン メトリクス収集の設定][amp-xregion-metrics]
- [EKS 上のセルフホスティングされた Prometheus から AMP への移行に関するベストプラクティス][amp-migration]
- [AMP の概要ワークショップ][amp-oow]
- [Firehose と AWS Lambda を介した Cloudwatch メトリクス ストリームの Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)
- [Terraform によるインフラストラクチャー アズ コードを使用した Amazon Managed Service for Prometheus およびアラートマネージャーのデプロイ](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus と Amazon Managed Grafana を使用した EKS 上の Istio の監視][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere の監視][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator のご紹介][eks-accelerator]
- [AMP と Amazon Managed Grafana での Prometheus mixin ダッシュボードのインストール](recipes/amp-mixin-dashboards.md)
[amp-main]: https://aws.amazon.com/jp/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/jp/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/jp/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/jp/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/jp/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/jp/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/jp/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://observability.workshop.aws/jp/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/jp/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/jp/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-observability-accelerator.md
- [Amazon Managed Service for Prometheus とアラートマネージャーを使用した Amazon EC2 の自動スケーリング](recipes/as-ec2-using-amp-and-alertmanager.md)
