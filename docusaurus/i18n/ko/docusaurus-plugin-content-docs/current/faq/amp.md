# Amazon Managed Service for Prometheus - FAQ

## 현재 어떤 AWS 리전이 지원되며, 다른 리전에서 메트릭을 수집할 수 있나요?

지원되는 리전의 최신 목록은 [문서](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)를 참조하세요. 기존 제품 기능 요청(PFR)의 우선순위를 더 잘 정할 수 있도록 원하는 리전을 알려주시기 바랍니다. 어떤 리전에서든 데이터를 수집하여 지원되는 특정 리전으로 전송할 수 있습니다. 자세한 내용은 이 블로그를 참조하세요: [Amazon Managed Service for Prometheus를 위한 크로스 리전 메트릭 수집](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/).

## Cost Explorer 또는 [CloudWatch를 통한 AWS 청구 요금](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)에서 미터링 및/또는 청구를 확인하는 데 얼마나 걸리나요?

수집된 메트릭 샘플 블록은 2시간마다 S3에 업로드되는 즉시 미터링됩니다. Amazon Managed Service for Prometheus에 대한 미터링 및 요금이 보고되기까지 최대 3시간이 걸릴 수 있습니다.

## Prometheus 서비스는 클러스터(EKS/ECS)에서만 메트릭을 스크랩할 수 있나요?

다른 컴퓨팅 환경에 대한 문서가 부족한 점에 대해 사과드립니다. Prometheus 서버를 사용하여 [EC2에서 Prometheus 메트릭을 스크랩](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)하고 현재 Prometheus 서버를 설치할 수 있는 모든 다른 컴퓨팅 환경에서도 원격 쓰기를 구성하고 [AWS SigV4 프록시](https://github.com/awslabs/aws-sigv4-proxy)를 설정하면 사용 가능합니다. [EC2 블로그](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) 링크에는 실행 방법을 보여주는 "Running aws-sigv4-proxy" 섹션이 있습니다. 다른 컴퓨팅 환경에서 AWS SigV4를 실행하는 방법을 간소화하는 문서를 추가해야 합니다.

## Amazon Managed Service for Prometheus를 Grafana에 어떻게 연결하나요? 문서가 있나요?

PromQL을 사용하여 Amazon Managed Service for Prometheus를 쿼리하기 위해 [Grafana에서 사용 가능한 기본 Prometheus 데이터 소스](https://grafana.com/docs/grafana/latest/datasources/prometheus/)를 사용합니다. 시작하는 데 도움이 되는 문서와 블로그입니다:
1. [서비스 문서](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2에서 Grafana 설정](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Amazon Managed Service for Prometheus로 전송되는 샘플 수를 줄이기 위한 모범 사례는 무엇인가요?

Amazon Managed Service for Prometheus에 수집되는 샘플 수를 줄이려면 스크랩 간격을 늘리거나(예: 30초에서 1분으로 변경) 스크랩하는 시리즈 수를 줄일 수 있습니다. 스크랩 간격을 변경하면 시리즈 수를 줄이는 것보다 샘플 수에 더 큰 영향을 미치며, 스크랩 간격을 두 배로 늘리면 수집되는 샘플 양이 절반으로 줄어듭니다.

## CloudWatch 메트릭을 Amazon Managed Service for Prometheus로 어떻게 보낼 수 있나요?

[CloudWatch 메트릭 스트림을 사용하여 CloudWatch 메트릭을 Amazon Managed Service for Prometheus로 전송](/recipes/recipes/lambda-cw-metrics-go-amp/)하는 것을 권장합니다. 이 통합의 일부 가능한 단점은 다음과 같습니다:
1. Amazon Managed Service for Prometheus API를 호출하려면 Lambda 함수가 필요합니다.
1. CloudWatch 메트릭을 Amazon Managed Service for Prometheus에 수집하기 전에 메타데이터(예: AWS 태그)로 보강할 수 없습니다.
1. 메트릭은 네임스페이스별로만 필터링할 수 있습니다(충분히 세분화되지 않음). 대안으로, Prometheus Exporter를 사용하여 CloudWatch 메트릭 데이터를 Amazon Managed Service for Prometheus로 전송할 수 있습니다: (1) CloudWatch Exporter: CW ListMetrics 및 GetMetricStatistics (GMS) API를 사용하는 Java 기반 스크랩.

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter)는 CloudWatch에서 Amazon Managed Service for Prometheus로 메트릭을 가져오는 또 다른 옵션입니다. CW ListMetrics, GetMetricData (GMD) 및 GetMetricStatistics (GMS) API를 사용하는 Go 기반 도구입니다. 이를 사용할 때의 일부 단점은 에이전트를 배포하고 라이프사이클을 직접 관리해야 하며, 이를 신중하게 수행해야 한다는 것입니다.

## Amazon Managed Service for Prometheus는 어떤 버전의 Prometheus와 호환되나요?

Amazon Managed Service for Prometheus는 [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md)와 호환됩니다. Amazon Managed Service for Prometheus는 데이터 플레인으로 오픈 소스 [CNCF Cortex 프로젝트](https://cortexmetrics.io/)를 기반으로 합니다. Cortex는 Prometheus와 100% API 호환을 목표로 합니다(/prometheus/* 및 /api/prom/* 하위). Amazon Managed Service for Prometheus는 Prometheus 호환 PromQL 쿼리와 Remote write 메트릭 수집, 그리고 Gauge, Counters, Summary, Histogram을 포함한 기존 메트릭 유형에 대한 Prometheus 데이터 모델을 지원합니다. 현재 [모든 Cortex API](https://cortexmetrics.io/docs/api/)를 노출하지는 않습니다. 지원하는 호환 API 목록은 [여기서 확인](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)할 수 있습니다. Amazon Managed Service for Prometheus에 필요한 기능이 누락된 경우 고객은 계정 팀과 협력하여 새로운 제품 기능 요청(PFR)을 열거나 기존 PFR에 영향을 줄 수 있습니다.

## Amazon Managed Service for Prometheus에 메트릭을 수집하는 데 어떤 컬렉터를 권장하나요? Prometheus를 Agent 모드로 활용해야 하나요?

Agent 모드를 포함한 Prometheus 서버, OpenTelemetry 에이전트, AWS Distro for OpenTelemetry 에이전트의 사용을 지원하며, 고객이 Amazon Managed Service for Prometheus로 메트릭 데이터를 전송하는 데 사용할 수 있는 에이전트입니다. AWS Distro for OpenTelemetry는 AWS에서 패키징하고 보안을 적용한 OpenTelemetry 프로젝트의 다운스트림 배포판입니다. 세 가지 중 어떤 것이든 괜찮으며, 개별 팀의 필요와 선호에 가장 적합한 것을 자유롭게 선택하세요.

## Amazon Managed Service for Prometheus의 성능은 워크스페이스 크기에 따라 어떻게 확장되나요?

현재 Amazon Managed Service for Prometheus는 단일 워크스페이스에서 최대 2억 개의 활성 시계열을 지원합니다. 새로운 최대 한도를 발표할 때, 수집과 쿼리 전반에 걸쳐 서비스의 성능 및 안정성 속성이 계속 유지되도록 보장합니다. 동일한 크기의 데이터셋에 대한 쿼리는 워크스페이스의 활성 시리즈 수에 관계없이 성능 저하를 경험하지 않아야 합니다.

**제품 FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)