# AWS Distro for Open Telemetry (ADOT) - FAQ

## ADOT 컬렉터를 사용하여 AMP에 메트릭을 수집할 수 있나요?

네, 이 기능은 2022년 5월 메트릭 지원 GA 출시와 함께 도입되었으며, EC2에서, EKS 애드온을 통해, ECS 사이드카 통합을 통해, 그리고/또는 Lambda 레이어를 통해 ADOT 컬렉터를 사용할 수 있습니다.

## ADOT 컬렉터를 사용하여 로그를 수집하고 Amazon CloudWatch 또는 Amazon OpenSearch에 전송할 수 있나요?

네. [로그 지원](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/)은 2023년 11월 22일부터 제공되고 있습니다. 자세한 내용은 [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) 페이지를 참조하세요.

## ADOT 컬렉터의 리소스 사용량 및 성능 세부 정보는 어디에서 확인할 수 있나요?

컬렉터 릴리스에 맞춰 최신 상태로 유지되는 [성능 보고서](https://aws-observability.github.io/aws-otel-collector/benchmark/report)를 온라인에서 제공하고 있습니다.

## ADOT를 Apache Kafka와 함께 사용할 수 있나요?

네, Kafka exporter 및 receiver 지원은 ADOT 컬렉터 v0.28.0에서 추가되었습니다. 자세한 내용은 [ADOT 컬렉터 문서](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)를 확인하세요.
.
## ADOT 컬렉터를 어떻게 설정하나요?

ADOT 컬렉터는 로컬에 저장된 YAML 설정 파일을 사용하여 구성됩니다. 이 외에도 S3 버킷과 같은 다른 위치에 저장된 설정을 사용할 수도 있습니다. ADOT 컬렉터를 구성하는 모든 지원되는 메커니즘은 [ADOT 컬렉터 문서](https://aws-otel.github.io/docs/components/confmap-providers)에 자세히 설명되어 있습니다.

## ADOT 컬렉터에서 고급 샘플링을 할 수 있나요?

네. [고급 샘플링](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/)은 2023년 5월 15일에 출시되었습니다. 자세한 내용은 [AWS Distro for OpenTelemetry를 사용한 고급 샘플링 시작하기](https://aws-otel.github.io/docs/getting-started/advanced-sampling) 페이지를 참조하세요.

## ADOT 컬렉터를 확장하는 팁이 있나요?

네! 업스트림 OpenTelemetry 문서의 [컬렉터 확장](https://opentelemetry.io/docs/collector/scaling/)을 참조하세요.

## ADOT 컬렉터 플릿을 보유하고 있는데, 어떻게 관리할 수 있나요?

이 분야는 활발히 개발 중이며 2023년에 성숙해질 것으로 예상합니다. 자세한 내용은 업스트림 OpenTelemetry 문서의 [관리](https://opentelemetry.io/docs/collector/management/), 특히 [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp)을 참조하세요.

## ADOT 컬렉터의 상태와 성능을 어떻게 모니터링하나요?

1. [컬렉터 모니터링](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - Prometheus receiver로 스크랩할 수 있는 포트 8080에서 노출되는 기본 메트릭
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) 사용 - Node Exporter를 실행하면 컬렉터가 실행 중인 노드, 파드, 운영 체제에 대한 여러 성능 및 상태 메트릭도 제공됩니다.
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) - KSM은 컬렉터에 대한 흥미로운 이벤트도 생성할 수 있습니다.
4. [Prometheus `up` 메트릭](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. 시작하기 위한 간단한 Grafana 대시보드: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**제품 FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)