# 다양한 계측 및 Collector 설정 방법

빠른 탐색:

- [계측 방법](#계측-방법)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + Custom OTEL Collector](#adot-sdk--custom-otel-collector)
- [Upstream OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [OTLP Endpoint를 통한 Collector-less 추적](#collector-less-tracing-with-otlp-endpoints)
- [기존 X-Ray SDK + X-Ray Daemon (지원 종료)](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [RED 메트릭 계산 요약](#red-메트릭-계산-요약)

---

## 계측 방법

### 자동 계측

**사용 시기:** 빠르게 시작하기, 최소한의 코드 변경, 프로덕션 롤아웃

**적합한 대상:** DevOps 팀, 플랫폼 엔지니어, 속도를 우선시하는 조직

**장점:**
- 코드 변경 불필요
- 빠른 가치 실현
- 일반적인 프레임워크를 자동으로 커버
- 필요 시 쉽게 롤백 가능

**한계:**
- 계측 대상에 대한 제어력 감소
- 필요 이상의 데이터를 캡처할 수 있음
- 커스텀 비즈니스 로직은 추가 수동 계측 필요

### 수동 OpenTelemetry 계측

**사용 시기:** 커스텀 비즈니스 메트릭, 벤더 이식성, 세밀한 제어

**적합한 대상:** 애플리케이션 개발자, Observability 전문성을 갖춘 팀

**장점:**
- 텔레메트리 데이터에 대한 완전한 제어
- 비즈니스 로직을 위한 커스텀 span 및 속성
- 벤더 중립 (다른 APM 도구와 호환)
- 성능 영향에 대한 정밀한 제어

**트레이드오프:**
- 코드 변경 필요
- 구현이 더 복잡
- 코드 변경에 따른 지속적인 유지보수

---

## 계측 + Collector 설정 옵션

## ADOT SDK + CloudWatch Agent

이 방법은 깊은 서비스 통합과 AWS 인프라 메트릭과의 자동 상관관계를 통해 가장 통합된 AWS 경험을 제공합니다.

### 주요 이점
- **호출량, 가용성, 지연시간, 장애, 오류 등의 메트릭**이 샘플링 결정 전에 클라이언트 측에서 100% 요청에 대해 계산됨
- **X-Ray 샘플링 통합**으로 기본적으로 X-Ray 샘플링 규칙 사용 (필요 시 100%로 구성)
- **기본 제공 CloudWatch Logs 통합**으로 원활한 로그 상관관계
- **전체 AWS 지원**으로 전체 Observability 스택 지원
- **자동 서비스 탐색** 및 골든 시그널

### 아키텍처

![ADOT SDK + CloudWatch Agent 아키텍처](/apm-src/assets/images/deep-dive/adotcw.png)

### ADOT SDK + CloudWatch Agent 동작 방식

**1단계: 애플리케이션 계측**

ADOT SDK를 배포하면 코드 변경 없이 자동으로 애플리케이션을 계측합니다. ADOT SDK는 런타임에 애플리케이션에 동적으로 코드를 주입하며, 수동 코드 변경이 필요하지 않습니다. 주입된 코드는 지원되는 프레임워크에 대한 호출을 자동으로 감지하고, 각 작업에 대해 span을 생성하며, 서비스 간 컨텍스트를 전파하여 완전한 트레이스를 구축합니다.

**2단계: 샘플링 결정**

각 요청에 대해 ADOT SDK는 X-Ray 샘플링 규칙을 확인하여 전체 트레이스 데이터를 전송할지 결정합니다. 비용 절감을 위해 5%부터 완전한 가시성을 위한 100%까지 구성할 수 있습니다.

**3단계: 클라이언트 측 메트릭 계산**

핵심 장점은 다음과 같습니다: 샘플링이 일어나기 전에 `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`일 때 SDK가 100% 요청에 대해 RED (Requests, Errors, Duration) 메트릭을 계산합니다. 이는 낮은 샘플링 비율에서도 완전한 골든 시그널을 얻을 수 있음을 의미합니다:
- **Rate**: 시간 창당 요청 수
- **Errors**: 오류 상태 코드(4xx/5xx)가 있는 요청 수
- **Duration**: 요청 시작/종료 시간으로부터의 지연 측정

**4단계: CloudWatch Agent 처리**

ADOT SDK는 샘플링된 span과 사전 계산된 메트릭을 모두 CloudWatch Agent로 전송하며, 파이프라인을 통해 처리됩니다:

![ADOT SDK CloudWatch Agent 상세 파이프라인](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver**: 애플리케이션에서 트레이스와 메트릭을 수신
- **Resource Detector**: AWS 리소스 정보 추가 (인스턴스 ID, 컨테이너 세부정보)
- **APM Processor**: 플랫폼별 메타데이터로 span 보강
- **Exporters**: X-Ray(span)와 CloudWatch(메트릭)로 데이터 라우팅

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**5단계: 데이터 배포**

데이터가 세 가지 경로로 분할됩니다:
- **메트릭** → Application Map을 위한 `/aws/application-signals/data` 로그 그룹
- **Span** → Transaction Search를 위한 `aws/spans` 로그 그룹
- **인덱싱된 span** → 기존 트레이스 분석을 위한 X-Ray 백엔드

**6단계: 분석 옵션**

세 가지 방법으로 데이터를 분석할 수 있습니다:
- **Application Signals**: 동적 그룹화와 완전한 메트릭에서의 골든 시그널이 포함된 Application Map
- **Transaction Search**: 고급 필터로 모든 span 데이터 쿼리
- **X-Ray Analytics**: 인덱싱된 span에 대한 기존 트레이스 분석

### 구현 가이드

플랫폼별 설정 가이드를 따르세요:
- [Amazon EKS에서 Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [Amazon ECS에서 Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [Amazon EC2에서 Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [자체 호스팅 Kubernetes에서 Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals 데모 리포지토리](https://github.com/aws-observability/application-signals-demo)

완료 후 Application Signals 콘솔에서 서비스 탐색 및 골든 시그널을 확인하세요.


## ADOT SDK + Custom OTEL Collector

이 방법은 ADOT SDK의 클라이언트 측 RED 메트릭 계산과 AWS Application Signals Processor를 포함하는 커스텀 빌드 OpenTelemetry Collector의 유연성을 결합합니다. CloudWatch Agent 방식과 동일한 정확한 100% 트래픽 메트릭을 얻으면서도, 텔레메트리를 여러 대상으로 팬아웃할 수 있습니다.

### 주요 이점
- **ADOT SDK를 통한 100% 요청에 대한 클라이언트 측 RED 메트릭** (CW Agent 방식과 동일) — 메트릭은 샘플링 전에 계산됨
- **다중 대상 텔레메트리** — AWS, Datadog, Prometheus 등으로 동시 팬아웃
- **App Signals Processor**가 `aws.local.*` / `aws.remote.*` 속성을 정규화하고, 플랫폼 컨텍스트를 해석하며, 카디널리티를 제어
- **Collector 파이프라인에 대한 완전한 제어** — 커스텀 프로세서, 필터, 익스포터 추가 가능

### 아키텍처

![ADOT SDK + Custom OTEL Collector 아키텍처](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### ADOT SDK + Custom OTEL Collector 동작 방식

**1단계: 애플리케이션 계측**

ADOT SDK로 애플리케이션을 계측하면 OpenTelemetry 형식으로 런타임 메트릭, 로그, 트레이스를 캡처합니다. ADOT SDK는 App Signals Processor가 의존하는 AWS 관련 span 속성(`aws.local.service`, `aws.local.operation`, `aws.remote.service`, `aws.remote.operation` 등)을 주입합니다.

**2단계: 클라이언트 측 RED 메트릭 계산**

`OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`일 때 ADOT SDK는 샘플링 결정 **이전에** 100% 요청에 대해 RED 메트릭을 계산합니다:
- **Rate**: 시간 창당 요청 수
- **Errors**: 오류 상태 코드(4xx/5xx)가 있는 요청 수
- **Duration**: 요청 시작/종료 시간으로부터의 지연 측정

**3단계: 샘플링 결정**

ADOT SDK가 구성된 샘플링 전략(X-Ray 샘플링 규칙 또는 로컬 샘플링)을 적용합니다. 샘플링된 트레이스만 Collector로 전송되지만, RED 메트릭은 이미 100% 트래픽에 대해 계산되었습니다.


**4단계: Custom OpenTelemetry Collector 처리 파이프라인**

**OTLP Receiver (데이터 수집)**
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

**Resource Detection Processor**
```yaml
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
```

**Application Signals Processor**
```yaml
processors:
  awsapplicationsignals:
    resolvers:
      - platform: ecs
```

이 프로세서는 ADOT SDK가 주입하는 `aws.local.*` / `aws.remote.*` span 속성과 연동됩니다. 수행하는 작업:
1. **속성 해석**: 플랫폼별 리졸버를 사용하여 플랫폼 컨텍스트로 텔레메트리 보강
2. **속성 정규화**: ADOT SDK 속성을 CloudWatch 메트릭 차원 이름으로 변환
3. **카디널리티 제어**: 사용자 설정 `keep`/`drop`/`replace` 규칙 적용
4. **Application Map 생성**: 동적 그룹화로 토폴로지 데이터 생성

**5단계: 내보내기 처리**

Exporter가 SigV4 인증을 통해 AWS EMF(메트릭), OTLP HTTP(로그), OTLP HTTP(트레이스) 엔드포인트로 데이터를 라우팅합니다.

**6단계: 백엔드 처리**
1. CloudWatch Logs: EMF 로그에서 메트릭 추출, `aws/spans`에 span 데이터 저장
2. X-Ray 백엔드: 구성 가능한 비율의 span을 트레이스 분석용으로 인덱싱

**7단계: 분석 및 시각화**
- **Application Signals**: 클라이언트 측 계산된 RED 메트릭 사용 — 샘플링에 관계없이 100% 트래픽에서 정확
- **Transaction Search**: CloudWatch Logs에서 span 데이터 쿼리
- **X-Ray Analytics**: 인덱싱된 span에 대한 기존 트레이스 분석


### awsapplicationsignalsprocessor를 포함한 Custom OTEL Collector 빌드

**사전 요구사항**: Go (버전 1.21 이상) 설치.

**1단계: OpenTelemetry Collector Builder (ocb) 설치**

최신 바이너리는 [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases)를 참조하세요.

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**2단계: Builder 매니페스트 파일 생성**

`builder-config.yaml` 생성:
```yaml
dist:
  name: otelcol-appsignals
  description: OTel Collector for Application Signals
  output_path: ./otelcol-appsignals
exporters:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - gomod: go.opentelemetry.io/collector/exporter/otlphttpexporter v0.113.0
processors:
  - gomod: github.com/amazon-contributing/opentelemetry-collector-contrib/processor/awsapplicationsignalsprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/resourcedetectionprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricstransformprocessor v0.113.0
receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.113.0
extensions:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/awsproxy v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/sigv4authextension v0.113.0
replaces:
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - github.com/openshift/api v3.9.0+incompatible => github.com/openshift/api v0.0.0-20180801171038-322a19404e37
```


**3단계: Collector 구성 예시**

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  awsapplicationsignals:
    resolvers:
      - platform: eks
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, awsapplicationsignals]
      exporters: [otlphttp/traces]
```

**4단계: Docker 이미지 빌드**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## Upstream OpenTelemetry SDK + OTEL Collector

이 방법은 ADOT이 아닌 표준 Upstream OpenTelemetry SDK와 OpenTelemetry Collector를 사용합니다. 최대한의 벤더 중립성을 제공하며, ADOT이 지원하지 않는 언어(Erlang, Rust, Ruby 등)를 포함한 OpenTelemetry SDK가 있는 모든 언어를 지원합니다. RED 메트릭은 샘플링된 트레이스 데이터에서 X-Ray 백엔드에 의해 서버 측에서 계산됩니다.

### 주요 이점
- **완전한 벤더 중립성** — 클라이언트 측에 AWS 특정 SDK 의존성 없음
- **모든 OTEL 지원 언어** — Erlang, Rust, Ruby, PHP 및 기타 모든 Upstream OTEL SDK와 호환
- **멀티 클라우드 및 하이브리드 환경** — AWS, GCP, Azure, 온프레미스에서 동일한 SDK 사용
- **표준 Upstream OTEL Collector** — 표준 프로세서 및 익스포터 사용
- **기존 OpenTelemetry 투자 보존** — ADOT으로 마이그레이션 불필요
- **다중 대상 텔레메트리** — 모든 백엔드로 동시 팬아웃

### 아키텍처

![Upstream OpenTelemetry SDK + OTEL Collector 아키텍처](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### Upstream OTEL SDK + Collector 동작 방식

**1단계: 애플리케이션 계측**

표준 Upstream OpenTelemetry SDK로 애플리케이션을 계측합니다. 시맨틱 규칙을 따르는 표준 OTEL span이 생성됩니다 (`http.method`, `http.route`, `http.status_code` 등).

**2단계: 클라이언트 측 샘플링**

OTEL SDK가 구성된 샘플링 전략을 적용합니다. 정확한 RED 메트릭을 위해서는 `always_on` 샘플링(100%)이 필요한데, 메트릭이 샘플링된 트레이스에서만 서버 측에서 계산되기 때문입니다. 부분 샘플링의 경우 RED 메트릭은 샘플링된 부분집합만 반영합니다.

**3단계: 표준 OTEL Collector 처리 파이프라인**

Collector는 표준 Upstream 프로세서를 사용합니다:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
```


**4단계: 서버 측 RED 메트릭 계산**

Upstream OTEL SDK는 클라이언트 측에서 RED 메트릭을 계산하지 않으므로, X-Ray 프론트엔드가 수신된 샘플링된 트레이스에서 서버 측으로 계산합니다:
1. **Rate**: 샘플링된 span 데이터에서 추출된 요청 수
2. **Errors**: 샘플링된 span 상태 코드에서 식별된 오류 수
3. **Duration**: 샘플링된 span 시작/종료 시간에서 계산된 지연

:::warning
RED 메트릭의 정확도는 전적으로 샘플링 비율에 의존합니다. 5% 샘플링에서는 5% 트래픽에 대한 메트릭만 얻을 수 있습니다. 이 방법으로 정확한 RED 메트릭을 얻으려면 100% 샘플링을 구성하세요.
:::

**5단계: 분석 및 시각화**
- **Application Signals**: 서버 측 계산된 RED 메트릭의 골든 시그널이 포함된 Application Map (정확도는 샘플링 비율에 따라 달라짐)
- **Transaction Search**: CloudWatch Logs(`aws/spans`)에서 span 데이터 쿼리
- **X-Ray Analytics**: 인덱싱된 span에 대한 기존 트레이스 분석

### ADOT SDK 방식과의 주요 차이점

| 측면 | ADOT SDK + Custom Collector | Upstream OTEL SDK + Collector |
|---|---|---|
| **RED 메트릭** | 클라이언트 측, 100% 트래픽 | 서버 측, 샘플링된 트래픽만 |
| **`aws.*` span 속성** | ADOT SDK가 주입 | 없음 |
| **언어 지원** | Java, Python, .NET, Node.js | 모든 OTEL 지원 언어 |
| **Collector 빌드** | App Signals Processor가 포함된 커스텀 빌드 | 표준 Upstream Collector 빌드 |
| **정확한 메트릭을 위한 100% 샘플링 필요** | 아니오 | 예 |

### Collector 구성 예시

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/traces]
```


## Collector-less Tracing with OTLP Endpoints

이 방법은 로그와 트레이스를 CloudWatch OTLP 엔드포인트로 직접 전송하여 최소한의 인프라 복잡성과 리소스 오버헤드를 제공합니다.

### Collector-less 추적을 선택해야 하는 이유

Collector-less 추적은 최대한의 리소스 활용으로 가장 단순한 아키텍처를 원할 때 적합합니다. AWS 엔드포인트로 직접 데이터를 전송함으로써 추가 인프라 구성요소와 관련 관리 오버헤드를 제거합니다.

### 아키텍처

![Collector-less 아키텍처](/apm-src/assets/images/deep-dive/collectorless.png)

### Collector-less 추적 동작 방식

**1단계: 애플리케이션 계측**

ADOT SDK로 애플리케이션을 자동 계측합니다. 코드 변경 없이 OpenTelemetry 형식으로 로그와 트레이스를 캡처합니다.

**2단계: 로컬 SDK 샘플링 (기본값 ParentBased/AlwaysOn 100%)**

X-Ray Remote Sampler는 샘플링 규칙을 가져오기 위해 로컬 프록시(CloudWatch Agent 또는 [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling))가 필요합니다. `http://localhost:2000/GetSamplingRules`와 `http://localhost:2000/SamplingTargets`를 호출하여 구성된 규칙을 가져옵니다. Collector-less 모드에서는 로컬 프록시가 실행되지 않으므로 ADOT SDK가 이 엔드포인트에 도달할 수 없습니다. 결과적으로 SDK는 기본 샘플링 전략인 **ParentBased(AlwaysOn) 100%**로 자동 폴백합니다.

:::tip 비용 관리를 위한 샘플링 비율 제어
Collector-less 모드에서는 X-Ray Remote Sampling을 사용할 수 없으므로, 환경 변수를 사용하여 로컬 샘플링 전략을 구성하여 트레이스 볼륨과 비용을 줄일 수 있습니다:

```bash
# TraceIdRatioBased sampler를 5%로 사용 (필요에 따라 비율 조정)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# 또는 수신 트레이스 컨텍스트를 존중하는 parentbased_traceidratio 사용
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

이 변수 없이는 SDK가 기본적으로 `parentbased_always_on`(100% 샘플링)을 사용하며, 높은 처리량 애플리케이션에서 CloudWatch 및 X-Ray 비용이 증가할 수 있습니다.
:::

**3단계: AWS 직접 통신**

Collector를 거치지 않고 SigV4 인증을 통해 AWS 서비스로 직접 데이터가 전송됩니다:
- **로그** → OTLP HTTP를 통해 `https://logs.<region>.amazonaws.com/v1/logs`
- **트레이스** → OTLP HTTP를 통해 `https://xray.<region>.amazonaws.com/v1/traces`

**4단계: 서버 측 RED 메트릭 계산**

X-Ray 프론트엔드가 수신된 트레이스를 분석하여 AWS 백엔드에서 RED 메트릭을 계산합니다. Collector-less 모드에서 SDK가 기본적으로 100% 샘플링을 사용하므로, 서버 측 RED 메트릭은 모든 트래픽에 대해 계산됩니다.

**5단계: 분석 옵션**
- **Application Signals**: 서버 측 계산된 RED 메트릭의 골든 시그널과 동적 그룹화가 포함된 Application Map
- **Transaction Search**: CloudWatch Logs(`aws/spans`)에서 완전한 span 데이터 쿼리
- **X-Ray Analytics**: 인덱싱된 span에 대한 기존 트레이스 분석

### 중요 고려사항
- **Transaction Search가 필수** — OTLP 엔드포인트 사용 시 반드시 활성화해야 함
- **ADOT SDK가 필수** — 일반 OpenTelemetry SDK로는 이 방법을 사용할 수 없음
- **인증은 자동** — ADOT SDK가 AWS SigV4 인증을 처리
- **X-Ray Remote Sampling 불가** — 로컬 프록시 없이 SDK가 X-Ray 샘플링 규칙을 가져올 수 없으며 기본 100% 샘플링(ParentBased/AlwaysOn) 사용
- **비용 영향** — 모든 트레이스가 전송(100% 샘플링)되므로 높은 처리량 서비스에서 CloudWatch 및 X-Ray 비용 모니터링 필요


## Existing X-Ray SDK + X-Ray Daemon (End of Support Timeline)

:::danger X-Ray SDK 및 Daemon 지원 종료 안내
**AWS X-Ray SDK 및 Daemon의 GA가 2026년 2월 25일에 종료되었으며 현재 유지보수 모드입니다.**

| SDK 및 Daemon 단계 | 시작일 | 종료일 | 제공되는 지원 |
|---|---|---|---|
| **일반 가용성** | 해당 없음 | 2026년 2월 25일 | X-Ray SDK 및 Daemon이 완전히 지원됩니다. AWS는 버그 및 보안 수정을 포함한 정기 SDK 및 Daemon 릴리스를 제공합니다. |
| **유지보수 모드** | 2026년 2월 25일 | 해당 없음 | AWS는 보안 이슈 해결을 위한 X-Ray SDK 및 Daemon 릴리스만 제공합니다. SDK/Daemon에는 새로운 기능이 추가되지 않습니다. |

자세한 내용은 [X-Ray 지원 종료 타임라인](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) 및 [X-Ray에서 OpenTelemetry 마이그레이션 가이드](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html)를 참조하세요.
:::

![X-Ray 아키텍처](/apm-src/assets/images/deep-dive/X-ray.png)

이 방법은 기존 X-Ray 투자가 있으며 OpenTelemetry로의 마이그레이션을 계획하면서 Application Signals 기능을 점진적으로 도입하려는 조직에 적합합니다.

### 시작 방법

1. 기존 X-Ray 데이터에 대해 **Transaction Search 활성화**
2. 비용 효율적인 이상 감지를 위해 **100% 샘플링 구성** 또는 적응형 샘플링 사용
3. **마이그레이션 계획** — 서비스를 ADOT 계측으로 점진적으로 마이그레이션 시작

## RED 메트릭 계산 요약

다양한 계측 설정에서 RED (Rate, Errors, Duration) 메트릭이 어떻게 계산되는지 이해하는 것은 올바른 방법을 선택하는 데 중요합니다:

| 계측 설정 | 계산 방법 | 환경 변수 | 요구사항 |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | 클라이언트 측 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | 없음 - 모든 샘플링에서 동작 |
| **ADOT SDK + Custom OTEL Collector** | 클라이언트 측 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | App Signals Processor가 포함된 Custom Collector |
| **Upstream OTEL SDK + OTEL Collector** | 서버 측 | 해당 없음 (ADOT SDK 미사용) | Transaction Search + 정확도를 위한 100% 샘플링 |
| **Collector-less (ADOT SDK)** | 서버 측 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false` (기본값) | Transaction Search. 기본 100% 샘플링 (로컬 프록시 없이 X-Ray Remote Sampling 불가) |
| **X-Ray SDK + X-Ray Daemon** | 서버 측 (추정) | 해당 없음 | 샘플링된 데이터 기반 |

### 클라이언트 측 RED 메트릭 (ADOT SDK — CW Agent 및 Custom Collector 모두)

```
Application → ADOT SDK → 메트릭 계산 → CW Agent 또는 Custom Collector → AWS
                ↓
            (100% 요청)
```

- **계산이 애플리케이션 내에서** 샘플링 결정 전에 수행
- 트레이스 샘플링 구성에 관계없이 **항상 정확**
- `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`일 때 **기본 동작**
- 메트릭 계산에 **Transaction Search 의존성 없음**

### 서버 측 RED 메트릭 (Upstream OTEL SDK, Collector-less, X-Ray)

```
Application → Upstream OTEL SDK/Collector → AWS 백엔드 → 메트릭 계산
                ↓
        (정확도를 위해 100% 샘플링 필요)
```

- **계산이 AWS 백엔드** (X-Ray 프론트엔드)에서 수신된 span 데이터로 수행
- **OTLP 기반 설정은 Transaction Search**를 활성화해야 함
- 정확한 메트릭을 위해 **100% 샘플링 필요** (추정하는 X-Ray 제외)
