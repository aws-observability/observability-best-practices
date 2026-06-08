# Application Signals + Transaction Search 설정

## 상위 수준 설정 프로세스

![설정 개요](/apm-src/assets/images/deep-dive/overview.png)

## 사전 요구사항 및 권한

CloudWatch Application Signals를 활성화하기 전에, 필요한 IAM 권한과 인프라가 준비되어 있는지 확인하세요. 자세한 요구사항은 [Application Signals 권한](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html)을 참조하세요.

## 지원 시스템

Application Signals는 Amazon EKS, 네이티브 Kubernetes, Amazon ECS, Amazon EC2에서 지원되고 테스트되었습니다.

| 언어 | 런타임 버전 |
|---|---|
| **Java** | JVM 버전 8, 11, 17, 21, 23 |
| **Python** | Python 버전 3.9 이상 |
| **.NET** | 릴리스 1.6.0 이하: .NET 6, 8 및 .NET Framework 4.6.2 이상. 릴리스 1.7.0 이상: .NET 8, 9 및 .NET Framework 4.6.2 이상 |
| **Node.js** | Node.js 버전 14, 16, 18, 20, 22 |
| **PHP** | PHP 버전 8.0 이상 |
| **Ruby** | CRuby >= 3.1, JRuby >= 9.3.2.0, 또는 TruffleRuby >= 22.1 |
| **GoLang** | Golang 버전 1.18 이상 |

전체 지원 매트릭스는 [Application Signals 지원 시스템](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html)을 참조하세요.

## 1단계: 계정에서 Application Signals 활성화

[계정에서 Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html) 문서를 참조하세요.

## 2단계: Transaction Search 활성화

[Transaction Search 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) 문서를 참조하세요.

## 3단계: 계측 전략 선택

요구사항에 따라 계측 방법 중 하나를 선택하세요. Application Signals는 SDK와 Collector의 여러 조합을 지원합니다:

### 사용 가능한 SDK

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Application Signals를 지원하는 AWS OpenTelemetry 배포판. Java, Python, .NET, Node.js에서 사용 가능.
- **[Upstream OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — 표준 벤더 중립 OpenTelemetry SDK. 모든 OTEL 지원 언어에서 동작 (Erlang, Rust, Ruby, Go, PHP 등).
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — 레거시 AWS 추적 SDK. ⚠️ [유지보수 모드](../instrumentation-setups.md#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline))

### 사용 가능한 Collector / Agent

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — Application Signals 지원, Container Insights 통합, 로그 수집이 내장된 관리형 AWS Agent.
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — 표준 Upstream 또는 커스텀 빌드 Collector. 다중 대상 텔레메트리 팬아웃 지원.
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK용 레거시 트레이스 릴레이. ⚠️ [유지보수 모드](../instrumentation-setups.md#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline))

### 의사결정 매트릭스

| 방법 | 적합한 환경 | 주요 이점 |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups.md#adot-sdk--cloudwatch-agent)) | AWS 네이티브 환경, 깊은 서비스 통합 | 긴밀한 AWS 통합, Container Insights 상관관계, 관리형 경험 |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups.md#adot-sdk--custom-otel-collector)) | Application Signals를 지원하는 다중 대상 텔레메트리 | 클라이언트 측 RED 메트릭, App Signals Processor, 다중 대상 유연성 |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups.md#upstream-opentelemetry-sdk--otel-collector)) | 벤더 중립 전략, 비ADOT 언어, 멀티 클라우드 | 완전한 벤더 중립성, 모든 OTEL 지원 언어, AWS SDK 의존성 없음 |
| [**Direct OTLP Endpoint (Collector-less 추적)**](../instrumentation-setups.md#collector-less-tracing-with-otlp-endpoints)) | 리소스 효율적인 애플리케이션, 최소 인프라 | 최소 오버헤드, 단순화된 아키텍처, 인프라 축소 |
| [**X-Ray SDK**](../instrumentation-setups.md#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)) | 레거시 X-Ray 사용자, 점진적 마이그레이션 | 기존 투자 보호, 최소 변경 요구사항. ⚠️ 유지보수 모드 |

### 기능 비교

| 기능 | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | ADOT SDK로 Collector-less 추적 | X-Ray SDK |
|---|---|---|---|---|---|
| **AWS 지원** | ✅ 예 | ⚠️ AWS로 전송되는 데이터만 | ⚠️ AWS로 전송되는 데이터만 | ✅ 예 | ✅ 예 (⚠️ 유지보수 모드) |
| **비표준 언어 지원** | ❌ 아니오 | ❌ 아니오 | ✅ 예 | ❌ 아니오 | ❌ 아니오 |
| **Container Insights 통합** | ✅ 예 | ❌ 아니오 | ❌ 아니오 | ❌ 아니오 | ❌ 아니오 |
| **CloudWatch Logs 기본 로깅** | ✅ 예 | ❌ 아니오 | ❌ 아니오 | ✅ 예 | ❌ 아니오 |
| **기본 런타임 메트릭** | ✅ 예 | ✅ 예 | ✅ 예 | ❌ 아니오 | ❌ 아니오 |
| **100% 트래픽에 대한 RED 메트릭** | ✅ 예 (클라이언트 측) | ✅ 예 (클라이언트 측) | ⚠️ 100% 샘플링 시에만 (서버 측) | ⚠️ 100% 샘플링 시에만 (서버 측) | ⚠️ 100% 샘플링 시에만 (서버 측) |
| **다중 대상 텔레메트리** | ❌ 아니오 | ✅ 예 | ✅ 예 | ❌ 아니오 | ❌ 아니오 |

각 방법의 자세한 구현 내용은 [계측 설정](../instrumentation-setups.md))을 참조하세요.

## 4단계: 샘플링 및 트레이스 인덱싱 이해

Application Signals는 **요청 샘플링**과 **트레이스 인덱싱**을 분리합니다:
- **요청 샘플링**: 샘플링되어 AWS로 전송되는 요청의 비율을 결정
- **선별적 트레이스 인덱싱**: CloudWatch Logs에 저장된 span 중 X-Ray 백엔드로 전송되어 X-Ray 트레이스 요약을 생성하는 비율. 트레이스 요약은 트랜잭션 디버깅에 유용하며 비동기 프로세스에 특히 가치있습니다. span의 작은 비율만 트레이스 요약으로 인덱싱하면 됩니다.

### 요청 샘플링

#### 1. X-Ray 중앙 집중식 샘플링 (기본값 및 권장)

ADOT SDK와 CloudWatch Agent(또는 OpenTelemetry Collector)로 Application Signals를 활성화하면, 다음 설정으로 **X-Ray 중앙 집중식 샘플링이 기본 활성화**됩니다:

| 설정 | 기본값 | 설명 |
|---|---|---|
| **Reservoir** | 초당 1개 요청 | 초당 고정 샘플링 요청 수 |
| **고정 비율** | 5% | Reservoir 초과 추가 요청의 샘플링 비율 |

AWS Distro for OpenTelemetry (ADOT) SDK Agent의 환경 변수는 다음과 같이 설정됩니다:

| 환경 변수 | 값 | 설명 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | X-Ray 샘플링 서비스 사용 |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch Agent 엔드포인트 |

이 기본값은 애플리케이션을 재배포하지 않고도 X-Ray 콘솔을 통해 언제든 수정할 수 있습니다. 예를 들어, 샘플링을 10%로 늘리려면 샘플링 규칙의 고정 비율을 업데이트하세요. 규칙 옵션의 전체 목록, 예제, 서비스별 규칙 생성 방법은 [샘플링 규칙 구성](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html)을 참조하세요.

:::info X-Ray Remote Sampler는 언제 적용되나요?
`xray` sampler는 로컬 프록시를 통해 `http://localhost:2000/GetSamplingRules`와 `http://localhost:2000/SamplingTargets`를 호출하여 동작합니다. 즉, X-Ray Remote Sampling은 **로컬 프록시가 실행 중일 때만 동작**합니다:

- **CloudWatch Agent** — 기본적으로 포트 2000에서 샘플링 프록시 노출
- **OpenTelemetry Collector** — [AWS Proxy 확장](https://aws-otel.github.io/docs/getting-started/remote-sampling)이 구성된 경우

로컬 프록시를 사용할 수 없는 경우(예: [Collector-less 모드](../instrumentation-setups.md#collector-less-tracing-with-otlp-endpoints))), ADOT SDK는 샘플링 엔드포인트에 도달할 수 없으며 **ParentBased(AlwaysOn) 100%**로 자동 폴백합니다.
:::

#### 2. 런타임별 X-Ray Remote Sampler 구성

각 ADOT SDK 언어 런타임은 X-Ray Remote Sampling 규칙을 사용하기 위한 특정 구성이 필요합니다. 해당 언어의 가이드를 참조하세요:

| 런타임 | 구성 가이드 |
|---|---|
| **Java** | [ADOT Java에서 X-Ray Remote Sampling 사용](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [ADOT Python에서 X-Ray Remote Sampling 사용](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [ADOT JavaScript에서 X-Ray Remote Sampling 사용](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [ADOT .NET에서 X-Ray Remote Sampling 사용](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [ADOT Go에서 샘플링 구성](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

모든 런타임에서 핵심 환경 변수는 다음과 같습니다:

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

CloudWatch Agent 또는 Collector 프록시 주소에 맞게 엔드포인트를 조정하세요 (예: EKS에서 `http://cloudwatch-agent.amazon-cloudwatch:2000`).

#### 3. 로컬 샘플링

로컬 프록시를 사용할 수 없거나 X-Ray 서비스에 의존하지 않고 로컬에서 직접 제어하려는 경우, 환경 변수를 사용하여 ADOT SDK에서 직접 샘플링을 구성할 수 있습니다:

| 환경 변수 | 값 | 설명 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | 로컬 비율 기반 샘플링 |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% 샘플링 비율 (필요에 따라 조정) |

이는 X-Ray Remote Sampling을 사용할 수 없는 [Collector-less 모드](../instrumentation-setups.md#collector-less-tracing-with-otlp-endpoints))에서 특히 유용합니다. 이 변수를 설정하지 않으면 SDK는 기본적으로 `parentbased_always_on` (100% 샘플링)을 사용합니다.

추가 sampler 옵션은 [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) 문서를 참조하세요.

#### 4. X-Ray 적응형 샘플링 (비용 최적화 방법)

:::tip 요구사항
- ADOT Java SDK (v2.11.5 이상)
- CloudWatch Agent 또는 OpenTelemetry Collector와 함께 실행해야 함
- Amazon EC2, ECS, EKS 및 자체 호스팅 Kubernetes와 호환

자세한 설정 방법은 [X-Ray 적응형 샘플링](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html) 문서를 참조하세요.
:::

100% 샘플링이 필요하지 않지만 더 나은 이상 현상 커버리지를 원한다면, X-Ray 적응형 샘플링을 고려하세요. 비용 효율적인 기본 비율을 유지하면서 오류 급증과 지연 이상값 발생 시 자동으로 샘플링을 증가시킵니다:

주요 이점:
- **자동 이상 감지**: HTTP 5xx 오류 또는 높은 지연 시 샘플링 증가
- **비용 제어**: 정상 운영 시 낮은 기본 샘플링(예: 5%) 유지
- **구성 가능한 증가 제한**: 최대 샘플링 비율과 쿨다운 기간 설정
- **중요 트레이스 캡처**: 전체 트레이스가 샘플링되지 않더라도 이상 span 캡처 보장
- **중앙 집중식 제어**: 애플리케이션 코드 변경 없이 X-Ray 샘플링 규칙으로 구성

구성 예시:
```json
{
  "RuleName": "AdaptiveProductionRule",
  "Priority": 1,
  "ReservoirSize": 1,
  "FixedRate": 0.05,
  "ServiceName": "*",
  "ServiceType": "*",
  "Host": "*",
  "HTTPMethod": "*",
  "URLPath": "*",
  "SamplingRateBoost": {
    "MaxRate": 0.25,
    "CooldownWindowMinutes": 10
  }
}
```

### 트레이스 인덱싱

**1. 기본 인덱싱 비율:**
- 1% 인덱싱은 추가 요금 없이 포함
- 1% 초과 인덱싱 시 X-Ray 요금 부과
- 현재 요금은 [CloudWatch 요금](https://aws.amazon.com/cloudwatch/pricing/) 문서를 참조하세요

**2. 커스텀 인덱싱 비율:**
```bash
# 더 많은 X-Ray 분석이 필요한 애플리케이션용 높은 인덱싱 (요금 부과)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% 인덱싱 - X-Ray 요금 적용

# 비용 최적화를 위한 낮은 인덱싱 (무료 티어 범위 내)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% 인덱싱 - 추가 요금 없음
```
