# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main](EKS) は、AWS クラウドまたはオンプレミスで Kubernetes アプリケーションを開始、実行、スケーリングする柔軟性を提供します。

コンピュートエンジン別にグループ化された以下のレシピをご覧ください。

## EKS on EC2

### ログ

- [EKS の CloudWatch Container Insights への Fluent Bit インテグレーション][eks-cw-fb]
- [EFK スタックを使用したロギング][eks-ws-efk]
- [EKS 上の Fluent Bit および FluentD のサンプルロギングアーキテクチャ][eks-logging]

### メトリクス

- [Amazon Managed Service for Prometheus の概要][amp-gettingstarted]
- [EC2 上の EKS で ADOT を使用してメトリクスを AMP に取り込み、AMG で可視化][ec2-eks-metrics-go-adot-ampamg]
- [Grafana Cloud Agent の Amazon Managed Service for Prometheus 用設定][gcwa-amp]
- [Prometheus と Grafana を使用したクラスターのモニタリング][eks-ws-prom-grafana]
- [Managed Prometheus と Managed Grafana によるモニタリング][eks-ws-amp-amg] 
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP ワークスペースのクロスリージョンメトリクス収集の設定][amp-xregion]
- [Amazon Managed Service for Prometheus を使用した EKS 上の App Mesh 環境のモニタリング][eks-am-amp-amg]
- [Amazon Managed Prometheus と Amazon Managed Grafana を使用した EKS 上の Istio のモニタリング][eks-istio-monitoring]
- [KEDA と Amazon CloudWatch による Kubernetes ワークロードのプロアクティブな自動スケーリング][eks-keda-cloudwatch-scaling]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere のモニタリング][eks-anywhere-monitoring]

### トレース

- [X-Ray トレーシングを AWS Distro for OpenTelemetry に移行する][eks-otel-xray]
- [X-Ray を使用したトレーシング][eks-ws-xray]

## EKS on Fargate

### ログ

- [Fluent Bit for Amazon EKS on AWS Fargate が登場][eks-fargate-logging]
- [EKS 上の Fluent Bit と FluentD のサンプルロギングアーキテクチャ][eks-fb-example]

### メトリクス

- [Fargate 上の EKS で ADOT を使用して AMP にメトリクスを取り込み、AMG で可視化][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP ワークスペースのクロスリージョンメトリクス収集の設定][amp-xregion]

### トレース

- [Fargate 上の EKS で ADOT と AWS X-Ray を使用][fargate-eks-xray-go-adot-amg]
- [X-Ray でのトレーシング][eks-ws-xray]


[eks-main]: https://aws.amazon.com/eks/
[eks-cw-fb]: https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/
[eks-ws-efk]: https://www.eksworkshop.com/intermediate/230_logging/
[eks-logging]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[ec2-eks-metrics-go-adot-ampamg]: recipes/ec2-eks-metrics-go-adot-ampamg.md
[gcwa-amp]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[eks-ws-prom-grafana]: https://www.eksworkshop.com/intermediate/240_monitoring/
[eks-ws-amp-amg]: https://www.eksworkshop.com/intermediate/246_monitoring_amp_amg/
[eks-ws-cw-ci]: https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/
[fargate-eks-metrics-go-adot-ampamg]: recipes/fargate-eks-metrics-go-adot-ampamg.md
[amp-xregion]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[eks-otel-xray]: https://aws.amazon.com/blogs/opensource/migrating-x-ray-tracing-to-aws-distro-for-opentelemetry/
[eks-ws-xray]: https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/
[eks-fargate-logging]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/
[eks-fb-example]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[eks-am-amp-amg]: recipes/servicemesh-monitoring-ampamg.md
[fargate-eks-xray-go-adot-amg]: recipes/fargate-eks-xray-go-adot-amg.md
[eks-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[eks-keda-cloudwatch-scaling]: https://aws-blogs-prod.amazon.com/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[eks-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
