# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS) vous offre la flexibilite de
demarrer, executer et mettre a l'echelle des applications Kubernetes dans le cloud AWS
ou sur site.

Consultez les recettes suivantes, regroupees par moteur de calcul :

## EKS sur EC2

### Journaux

- [Integration de Fluent Bit dans CloudWatch Container Insights pour EKS][eks-cw-fb]
- [Journalisation avec la pile EFK][eks-ws-efk]
- [Exemples d'architectures de journalisation pour Fluent Bit et FluentD sur EKS][eks-logging]

### Metriques

- [Premiers pas avec Amazon Managed Service for Prometheus][amp-gettingstarted]
- [Utilisation d'ADOT dans EKS sur EC2 pour ingerer des metriques vers AMP et visualiser dans AMG][ec2-eks-metrics-go-adot-ampamg]
- [Configuration de Grafana Cloud Agent pour Amazon Managed Service for Prometheus][gcwa-amp]
- [Surveillance de cluster avec Prometheus et Grafana][eks-ws-prom-grafana]
- [Surveillance avec Managed Prometheus et Managed Grafana][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [Configurer la collecte de metriques inter-regions pour les espaces de travail AMP][amp-xregion]
- [Surveillance de l'environnement App Mesh sur EKS avec Amazon Managed Service for Prometheus][eks-am-amp-amg]
- [Surveiller Istio sur EKS avec Amazon Managed Prometheus et Amazon Managed Grafana][eks-istio-monitoring]
- [Auto-scaling proactif des charges de travail Kubernetes avec KEDA et Amazon CloudWatch][eks-keda-cloudwatch-scaling]
- [Surveillance d'Amazon EKS Anywhere avec Amazon Managed Service for Prometheus et Amazon Managed Grafana][eks-anywhere-monitoring]

### Traces

- [Migration du tracing X-Ray vers AWS Distro for OpenTelemetry][eks-otel-xray]
- [Tracing avec X-Ray][eks-ws-xray]

## EKS sur Fargate

### Journaux

- [Fluent Bit pour Amazon EKS sur AWS Fargate est disponible][eks-fargate-logging]
- [Exemples d'architectures de journalisation pour Fluent Bit et FluentD sur EKS][eks-fb-example]

### Metriques

- [Utilisation d'ADOT dans EKS sur Fargate pour ingerer des metriques vers AMP et visualiser dans AMG][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [Configurer la collecte de metriques inter-regions pour les espaces de travail AMP][amp-xregion]

### Traces

- [Utilisation d'ADOT dans EKS sur Fargate avec AWS X-Ray][fargate-eks-xray-go-adot-amg]
- [Tracing avec X-Ray][eks-ws-xray]


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
[eks-keda-cloudwatch-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[eks-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
