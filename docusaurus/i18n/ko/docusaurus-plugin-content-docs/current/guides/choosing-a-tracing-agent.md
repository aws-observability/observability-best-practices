# 트레이싱 에이전트 선택하기

## 올바른 에이전트를 선택하세요

AWS는 [트레이스](../signals/traces.md) 수집을 위해 두 가지 도구 세트를 직접 지원합니다(풍부한 [Observability 파트너](https://aws.amazon.com/products/management-and-governance/partners/) 생태계 외에도):

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/), 일반적으로 ADOT라고 불립니다
* X-Ray [SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) 및 [데몬](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)

Observability 솔루션을 발전시켜 나갈 때, 어떤 도구를 사용할지 선택하는 것은 가장 중요한 결정 중 하나입니다. 이 도구들은 상호 배타적이지 않으며, 필요에 따라 함께 조합하여 사용할 수 있습니다. 이 선택에 대한 모범 사례가 있지만, 먼저 [OpenTelemetry (OTEL)](https://opentelemetry.io/)의 현재 상태를 이해하는 것이 중요합니다.

OTEL은 현재 Observability 신호 전송에 대한 업계 표준 사양으로, 세 가지 핵심 신호 유형인 [metrics](../signals/metrics.md), [traces](../signals/traces.md), [logs](../signals/logs.md) 각각에 대한 정의를 포함하고 있습니다. 하지만 OTEL이 처음부터 존재했던 것은 아닙니다. [OpenMetrics](https://openmetrics.io)와 [OpenTracing](https://opentracing.io) 같은 이전 사양에서 발전해 왔습니다. Observability 벤더들은 최근 몇 년간 OpenTelemetry Line Protocol (OTLP)을 공개적으로 지원하기 시작했습니다.

AWS X-Ray와 CloudWatch는 다른 주요 Observability 솔루션들과 마찬가지로 OTEL 사양보다 먼저 등장했습니다. 그러나 AWS X-Ray 서비스는 ADOT를 통해 OTEL 트레이스를 원활하게 수신합니다. ADOT에는 X-Ray뿐만 아니라 다른 ISV 솔루션으로 직접 텔레메트리를 전송하기 위한 통합 기능이 이미 내장되어 있습니다.

모든 트랜잭션 트레이싱 솔루션은 신호를 수집하기 위해 에이전트와 기본 애플리케이션과의 통합이 필요합니다. 이는 테스트, 유지보수, 업그레이드가 필요한 라이브러리 형태의 기술 부채를 생성하며, 향후 솔루션을 변경할 경우 재구성이 필요할 수도 있습니다.

X-Ray에 포함된 SDK는 AWS가 제공하는 긴밀하게 통합된 계측 솔루션의 일부입니다. ADOT는 X-Ray가 여러 트레이싱 솔루션 중 하나일 뿐인 더 광범위한 업계 솔루션의 일부입니다. 두 접근 방식 모두 X-Ray에서 엔드투엔드 트레이싱을 구현할 수 있지만, 가장 유용한 접근 방식을 결정하려면 그 차이를 이해하는 것이 중요합니다.

:::info
	다음과 같은 요구사항이 있다면 AWS Distro for OpenTelemetry로 애플리케이션을 계측하는 것을 권장합니다:

    * 코드를 다시 계측하지 않고도 여러 트레이싱 백엔드로 트레이스를 전송할 수 있는 유연성이 필요한 경우. 예를 들어, X-Ray 콘솔에서 [Zipkin](https://zipkin.io)으로 전환하려는 경우 컬렉터의 설정만 변경하면 되며, 애플리케이션 코드는 변경할 필요가 없습니다.

    * OpenTelemetry 커뮤니티에서 유지보수하는 각 언어별 다양한 라이브러리 계측을 지원받고자 하는 경우.
:::

:::info
	다음과 같은 요구사항이 있다면 애플리케이션 계측에 X-Ray SDK를 선택하는 것을 권장합니다:

    * 단일 벤더로 긴밀하게 통합된 솔루션이 필요한 경우.

    * Node.js, Python, Ruby 또는 .NET을 사용할 때 X-Ray 중앙 집중식 샘플링 규칙과의 통합이 필요한 경우. 여기에는 X-Ray 콘솔에서 샘플링 규칙을 구성하고 여러 호스트에서 자동으로 사용하는 기능이 포함됩니다.
:::
