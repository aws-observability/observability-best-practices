# OpenTelemetry를 활용한 Observability

OpenTelemetry는 로그, 메트릭, 트레이스를 포함한 텔레메트리 데이터를 수집하고 내보내는 표준화된 방법을 제공하는 오픈소스 벤더 중립적 Observability 프레임워크입니다. OpenTelemetry를 활용함으로써 조직은 벤더 독립성을 보장하고 Observability 전략을 미래에 대비할 수 있는 포괄적인 Observability 파이프라인을 구현할 수 있습니다.

## OpenTelemetry를 활용한 메트릭 및 인사이트 수집

1. **계측**: OpenTelemetry 사용의 첫 번째 단계는 OpenTelemetry 라이브러리나 SDK로 애플리케이션과 서비스를 계측하는 것입니다. 이 라이브러리들은 애플리케이션 코드에서 메트릭, 트레이스, 로그와 같은 텔레메트리 데이터를 자동으로 캡처하고 내보냅니다.

2. **메트릭 수집**: OpenTelemetry는 애플리케이션에서 메트릭을 수집하고 내보내는 표준화된 방법을 제공합니다. 이 메트릭에는 시스템 메트릭(CPU, 메모리, 디스크 사용량), 애플리케이션 수준 메트릭(요청률, 오류율, 지연 시간), 애플리케이션에 특화된 커스텀 비즈니스 메트릭이 포함될 수 있습니다.

3. **분산 트레이싱**: OpenTelemetry는 분산 트레이싱을 지원하여 요청과 작업이 분산 시스템을 통해 전파되는 것을 추적할 수 있습니다. 이를 통해 요청의 엔드투엔드 흐름에 대한 가치 있는 인사이트를 제공하고, 병목 현상을 식별하며, 성능 문제를 해결합니다.

4. **로깅**: OpenTelemetry의 주요 초점은 메트릭과 트레이스이지만, 로그 데이터를 캡처하고 내보내는 데 사용할 수 있는 구조화된 로깅 API도 제공합니다. 이를 통해 로그가 다른 텔레메트리 데이터와 상관 분석되어 시스템 동작에 대한 전체적인 뷰를 제공합니다.

5. **Exporter**: OpenTelemetry는 다양한 백엔드 또는 Observability 플랫폼으로 텔레메트리 데이터를 전송할 수 있는 다양한 exporter를 지원합니다. 인기 있는 exporter로는 Prometheus, Jaeger, Zipkin, AWS CloudWatch, Azure Monitor, Google Cloud Operations와 같은 클라우드 네이티브 Observability 솔루션이 있습니다.

6. **데이터 처리 및 분석**: 텔레메트리 데이터가 내보내지면 Observability 플랫폼, 모니터링 도구 또는 커스텀 데이터 처리 파이프라인을 활용하여 수집된 메트릭, 트레이스, 로그를 분석하고 시각화할 수 있습니다. 이 분석을 통해 시스템 성능에 대한 인사이트를 얻고, 병목 현상을 식별하며, 문제 해결과 근본 원인 분석에 도움을 줍니다.
![Otel](./images/otel.png)
*그림 1: ADOT과 FluentBit을 활용한 EKS 클러스터의 Observability 신호 전송*
<!--Ref: https://aws.amazon.com/blogs/architecture/amazon-cloudwatch-insights-for-amazon-eks-on-ec2-using-aws-distro-for-opentelemetry-helm-charts/-->

## OpenTelemetry 사용의 이점

1. **벤더 중립성**: OpenTelemetry는 오픈소스 벤더 중립적 프로젝트로, Observability 전략이 특정 벤더나 플랫폼에 종속되지 않도록 합니다. 이 유연성을 통해 필요에 따라 Observability 백엔드를 전환하거나 여러 솔루션을 결합할 수 있습니다.

2. **표준화**: OpenTelemetry는 텔레메트리 데이터를 수집하고 내보내는 표준화된 방법을 제공하여 다양한 구성 요소와 시스템에 걸쳐 일관된 데이터 형식과 상호 운용성을 가능하게 합니다.

3. **미래 대비**: OpenTelemetry를 도입하면 Observability 전략을 미래에 대비할 수 있습니다. 프로젝트가 진화하고 새로운 기능과 통합이 추가됨에 따라 기존 계측을 큰 코드 변경 없이 쉽게 업데이트할 수 있습니다.

4. **포괄적인 Observability**: OpenTelemetry는 여러 텔레메트리 신호(메트릭, 트레이스, 로그)를 지원하여 시스템의 동작과 성능에 대한 포괄적인 뷰를 제공합니다.

5. **에코시스템 및 커뮤니티 지원**: OpenTelemetry는 통합, 도구의 성장하는 에코시스템과 활발한 기여자 커뮤니티를 보유하고 있어 지속적인 개발과 지원을 보장합니다.

Observability를 위해 OpenTelemetry를 활용함으로써 조직은 시스템에 대한 깊은 인사이트를 얻어 사전 모니터링, 효율적인 문제 해결, 데이터 기반 의사결정을 가능하게 하면서 Observability 전략에서 유연성과 벤더 독립성을 유지할 수 있습니다.
