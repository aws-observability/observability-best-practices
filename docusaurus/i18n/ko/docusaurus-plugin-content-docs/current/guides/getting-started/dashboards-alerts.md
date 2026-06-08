---
sidebar_position: 4
---

# 대시보드 및 알림

텔레메트리가 흐르기 시작하면, 사용 사례에 맞는 대시보드와 알림을 설정할 수 있습니다.

## 큐레이션된 대시보드

CloudWatch 콘솔의 다양한 부분에서 찾을 수 있는 큐레이션된 대시보드를 활용하세요.

예를 들어, Dashboards에서 많은 서비스(Lambda, EC2, API Gateway 등)에 대한 자동화된 대시보드를 찾을 수 있습니다.

Application Signals를 활용하는 경우, Application Signals(APM)에서 애플리케이션 맵과 대시보드를 찾을 수 있습니다. 또한, Observability에 격차가 있는 서비스를 강조하는 계측되지 않은 서비스도 확인할 수 있습니다.

## 맞춤형 대시보드

비즈니스에 특화된 자체 대시보드도 설계해야 합니다. 운영 우수성을 위한 대시보드 설계 방법은 이 가이드를 참조하세요: [운영 가시성을 위한 대시보드 구축](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch Alarms

서비스와 인프라의 문제를 신호하는 알림(CloudWatch에서는 Alarms)도 생성합니다. 중앙 집중식 알람 가시성을 위해 모니터링 계정에서 알람을 생성하거나 개별 로컬 계정에서 알람을 생성할 수 있습니다.

### 알람 권장 사항

시작 방법을 모르겠다면, 알람 권장 사항이 도움이 됩니다. 알람 권장 사항은 모니터링 모범 사례를 기반으로 합니다. 알람을 생성하기 전에 권장되는 알람 구성을 검토하세요.

자세한 내용은 [AWS 서비스에 대한 알람 권장 사항](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html)을 참조하세요.

## 서비스 수준 목표(SLO)

중요한 KPI를 추적하는 데 도움이 되는 SLO와 관련 알람도 생성할 수 있습니다.

자세한 내용은 [CloudWatch SLO](../../tools/slos.md)를 참조하세요.

## 요약

이것으로 CloudWatch 시작하기 가이드를 마칩니다. 다루었던 단계는 다음과 같습니다:

1. **모니터링 및 소스 계정 설정** – 여러 AWS 계정과 리전의 텔레메트리 데이터를 중앙 집중화하기 위한 교차 계정 Observability 구성
2. **통합 데이터 스토어 설정** – 통합 쿼리와 분석을 위해 단일 계정과 리전으로 로그 데이터 중앙 집중화
3. **에이전트/컬렉터 구성** – 애플리케이션과 인프라에서 텔레메트리를 전송하기 위한 CloudWatch 에이전트 및/또는 OpenTelemetry 컬렉터 배포
4. **대시보드 및 알림** – 가시성을 위한 대시보드와 서비스 상태를 모니터링하기 위한 알람 생성

## 다음 단계

특정 주제에 대한 더 심층적인 지침은 이 모범 사례 가이드의 상세 섹션을 참조하세요:

- [컨테이너(ECS/EKS)](/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights)
- [서버리스](/guides/serverless/aws-native/lambda-based-observability)
- [운영 가이드](/guides/operational/observability-driven-dev)
- [비용 최적화](/guides/cost/cost-visualization/cost)
- [신호 수집](/guides/signal-collection/emf)
