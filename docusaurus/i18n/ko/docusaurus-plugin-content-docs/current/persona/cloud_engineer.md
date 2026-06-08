# 클라우드 엔지니어

복잡한 AWS 인프라를 관리하는 클라우드 엔지니어로서, Observability는 안정적이고 효율적인 운영을 유지하는 데 필수적입니다. 마이크로서비스, 컨테이너, 서버리스 아키텍처의 시대에서 시스템에 대한 명확한 가시성을 갖는 것은 성공을 위한 핵심입니다.

이 가이드는 클라우드 엔지니어를 위한 핵심 Observability 모범 사례를 살펴보며, AWS 환경을 대규모로 모니터링, 문제 해결 및 최적화하기 위한 실용적인 전략에 초점을 맞춥니다.

---

## AWS 비용 관리 💸

**목표:** 지출을 모니터링하고 통제하여 AWS 비용을 최적화합니다.

| 수준 | 카테고리 | 설명 | 팁 & 예시 | 추가 참고사항 |
|-------|---------|------|-----------|-------------|
| **기본** | [지출 추적](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost) | 비즈니스 활동이 비용에 미치는 영향을 모니터링하기 위한 대시보드 설정 | **예시:** 마케팅 캠페인이 서버 비용에 미치는 영향 모니터링 | **프로 팁:** 기본적인 일별 비용 추적부터 시작하세요. **일반적 실수:** 알림 설정 미비 |
| **기본** | [예산 관리](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators) | 프로젝트 비용을 측정하기 위한 지출 한도 설정 | **팁:** 각 부서 또는 서비스별 예산 설정에 집중 | **권장:** 명확한 예산 배치 수립 |
| **중급** | [리소스 태깅](https://aws-observability.github.io/observability-best-practices/recipes/recipes/metrics-explorer-filter-by-tags) | 팀과 프로젝트별 리소스 사용량을 추적하기 위한 리소스 태깅 구현 | **빠른 성과:** 이 3가지 태그부터 시작: 1. Project 2. Environment 3. Owner | **알고 계셨나요?** 태깅 구현 후 20-30% 절감 가능 |
| **중급** | [비용 & 사용량 가시성](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost) | 필요한 비용만 발생하고 불필요한 리소스에 과도한 지출이 없는지 확인 | **예시:** 더 나은 추적을 위한 세분화된 비용 대시보드 설정 | **프로 팁:** AWS가 제공하는 다양한 [비용 최적화 도구](https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-laying-the-foundation/reporting-cost-optimization-tools.html)를 고려하세요 |
| **고급** | [스마트 비용 관리](https://community.aws/content/2muS34cXUidGfdzpd5EkpCcphLc/aws-serverless-how-to-stop-ec2-using-event-bridge-and-lambda) | 불필요한 지출을 제한하는 작업 자동화 | **예시:** 비업무 시간에 비프로덕션 서버 전원 끄기 | **프로 팁:** 비프로덕션 환경부터 시작하세요 |
| **고급** | [전략적 구현](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators) | KPI를 수립하고 FinOps Foundation 원칙 구현 | 비용 최적화 KPI를 만들고 시간에 따라 추적 | **프로 팁:** "단위 경제학" KPI부터 시작 - 비즈니스 산출물당 비용 측정 (예: 트랜잭션당 비용, 고객당 비용, 서비스당 비용) |

### 권장 사항:
- **간단하게 시작**: 기본 모니터링부터 시작하여 AWS 도구에 익숙해지면 더 고급 기술로 확장하세요.
- **태그를 효과적으로 사용**: 태깅은 비용을 추적하고 할당하는 가장 강력한 방법 중 하나입니다. 일찍 구현하면 향후 상당한 시간을 절약할 수 있습니다.

---

## AWS 성능 & 가용성 🚀

**목표:** AWS에서 호스팅되는 애플리케이션의 최적 성능과 가용성을 보장합니다.

| 수준 | 컴포넌트 | 설명 | 팁 & 예시 | 추가 참고사항 |
|-------|---------|------|-----------|-------------|
| **기본** | [앱 모니터링](https://aws-observability.github.io/observability-best-practices/tools/dashboards) | 엄선된 과거 데이터를 집계하고 다른 관련 데이터와 함께 확인 | **예시:** 다른 리전의 사용자가 지연을 경험하는지 확인 | **일반적 실수:** 모니터링 도구의 중앙집중화 부재 |
| **중급** | [연결 지점 추적](https://aws-observability.github.io/observability-best-practices/signals/traces) | 애플리케이션의 다른 부분들이 어떻게 통신하는지 모니터링 | **빠른 성과:** 가장 중요한 서비스의 성능 추적부터 시작 | **알고 계셨나요?** 대부분의 장애는 서비스 간 통신 실패로 발생합니다 |
| **고급** | [성능 테스트](https://aws-observability.github.io/observability-best-practices/tools/synthetics) | 고객 관점에서 애플리케이션을 테스트하고 시뮬레이션하여 경험을 이해 | **예시:** 애플리케이션 엔드포인트에 대한 합성 테스트 실행 | **프로 팁:** 세분화된 [성능 인사이트](https://aws-observability.github.io/observability-best-practices/tools/rum)를 위해 사용자 세션에서 클라이언트 측 데이터 수집 |
| **고급** | [가용성 목표 수립 및 적용](https://aws-observability.github.io/observability-best-practices/tools/slos) | 허용 가능한 상태 및 가용성을 설정하는 애플리케이션 SLO 평가 | 실시간 모니터링 및 빠른 문제 해결에 활용 | **프로 팁:** 조직의 Observability [성숙도](https://aws-observability.github.io/observability-best-practices/guides/observability-maturity-model)를 정기적으로 평가하세요 |

### 권장 사항:
- **사용자 경험 이해**: 서버 측 메트릭만 모니터링하는 것은 충분하지 않습니다. 글로벌하게 실제 사용자 경험을 추적하세요.
- **핵심 서비스 우선순위 지정**: 가장 중요한 애플리케이션 컴포넌트의 모니터링부터 시작하고 거기서부터 확장하세요.

---

## AWS 보안 모니터링 🔒

**목표:** 보안 취약점과 인시던트를 모니터링하여 AWS 인프라를 보호합니다.

| 수준 | 컴포넌트 | 설명 | 팁 & 예시 | 추가 참고사항 |
|-------|---------|------|-----------|-------------|
| **기본** | [중앙 보안 모니터링](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount) | 쉬운 접근과 분석을 위해 모든 보안 로그를 한 곳에 통합 | **예시:** 민감한 데이터와 리소스에 대한 모든 액세스 추적 | **프로 팁:** 로그인 시도와 액세스 패턴에 집중하여 시작 |
| **중급** | [텔레메트리 데이터 수집 확장](https://aws-observability.github.io/observability-best-practices/recipes/telemetry) | 문제 해결 및 감사 세션에 기여하는 추가 [속성](https://aws-observability.github.io/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-1) 포함 | **구현:** 애플리케이션 백엔드 코드에서 텔레메트리 데이터 구현 | **예시:** 사용자가 로그인한 브라우저 이름 전송 |
| **고급** | [변경 모니터링](https://aws-observability.github.io/observability-best-practices/recipes/anomaly-detection) | 내부 및 외부 소스에서의 워크로드 급격한 변화 추적 | **빠른 성과:** 예상치 못한 로그인 패턴이나 사용자 활동에 대한 알림 설정 | **일반적 실수:** 정적 알람 임계값에만 의존 |

### 권장 사항:
- **보안 우선순위화**: 보안은 사후 고려사항이 되어서는 안 됩니다. 기본 모니터링부터 시작하여 더 정교한 구성으로 발전하세요.
- **알림 자동화**: 비정상적 활동에 대한 자동 알림을 설정하면 잠재적 위협이 확대되기 전에 감지할 수 있습니다.

---

## 사용자 경험 모니터링 📈

**목표:** 애플리케이션 사용량, 속도 및 동작을 모니터링하여 사용자 경험을 최적화합니다.

| 수준 | 컴포넌트 | 설명 | 팁 & 예시 | 추가 참고사항 |
|-------|---------|------|-----------|-------------|
| **기본** | [페이지 속도 추적](https://aws-observability.github.io/observability-best-practices/tools/rum) | 실제 사용자에게 페이지가 얼마나 빨리 로딩되는지 모니터링 | **예시:** 피크 시간에 결제 페이지가 느려지는지 확인 | **프로 팁:** 가장 중요한 사용자 여정에 먼저 집중 |
| **중급** | [외부 요인에 의한 사용자 패턴 관찰](https://aws-observability.github.io/observability-best-practices/tools/internet_monitor) | 사용자와 서비스 상호작용에 영향을 줄 수 있는 추가 요소 추적 | **예시:** 인터넷 프로바이더 및 위치. **빠른 성과:** 기본 페이지 로드 시간 모니터링부터 시작 | **알고 계셨나요?** 페이지 로드 시간의 작은 지연도 사용자 유지에 상당한 영향을 미칠 수 있습니다 |
| **고급** | [심층 네트워킹 사용 분석](https://aws-observability.github.io/observability-best-practices/recipes/infra) | 네트워크 플로우 활동과 상태를 깊이 평가하고 분석 | **예시:** [Network Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) 및 [Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html) | 더 깊은 네트워크 상호작용과 사용자 행동 추적 |

### 권장 사항:
- **핵심 액션에 집중**: 수익이나 사용자 만족도에 영향을 미치는 액션의 모니터링을 우선순위화하세요.
- **실제 사용자 상호작용 모니터링**: 합성 테스트에만 의존하지 마세요 — 실제 사용자 데이터가 더 실행 가능한 인사이트를 제공합니다.

---

## 서버리스 워크로드 모니터링 ⚡

**목표:** 신뢰성과 비용 효율성을 보장하기 위해 서버리스 애플리케이션을 효과적으로 모니터링하고 최적화합니다.

| 수준 | 컴포넌트 | 설명 | 팁 & 예시 | 추가 참고사항 |
|-------|---------|------|-----------|-------------|
| **기본** | [Lambda 함수 모범 사례](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability) | 핵심 Lambda 메트릭 및 실행 통계 모니터링 | **예시:** 호출 수, 기간 및 오류율 추적. **빠른 성과:** Lambda 인사이트를 위한 CloudWatch 대시보드 설정 | **프로 팁:** 비용 최적화를 위해 콜드 스타트 및 메모리 사용률 모니터링 |
| **중급** | [이벤트 소스 모니터링](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) | 이벤트 소스 및 통합의 성능 추적 | **예시:** SQS 큐 깊이, API Gateway 지연시간 모니터링. **빠른 성과:** 실패한 이벤트를 위한 데드 레터 큐 설정 | **알고 계셨나요?** 적절한 이벤트 소스 모니터링으로 연쇄 장애를 방지할 수 있습니다 |
| **고급** | [요약된 인사이트 제공](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-lambda.html) | CloudWatch의 특화된 인사이트 도구를 활용하여 워크로드 성능, 리소스 사용률, 운영 패턴에 대한 자동화된 상세 분석을 얻습니다 | **예시:** [Lambda Insights](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability#use-cloudwatch-lambda-insights-to-monitor-system-level-metrics), [Container Insights](https://aws-observability.github.io/observability-best-practices/patterns/adoteksfargate) | AWS CloudFormation을 사용하여 계정 수준에서 Lambda Insights를 활성화하여 모든 새 Lambda 함수에 대한 상세 메트릭을 자동 수집하고, [Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)로 상위 소비 리소스와 잠재적 병목현상을 식별합니다 |

### 권장 사항:
- **구조화된 로깅 구현**: 더 나은 검색 가능성을 위해 일관된 JSON 로깅 형식 사용
- **동시성 한도 모니터링**: 스로틀링을 방지하기 위해 함수 동시성 추적
- **비용 최적화**: 비용 할당 태그를 설정하고 함수별 비용 모니터링

---
