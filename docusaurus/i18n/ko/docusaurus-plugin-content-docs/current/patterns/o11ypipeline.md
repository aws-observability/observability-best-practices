# ADOT Observability 파이프라인

Observability 파이프라인은 다양한 소스에서 Observability 데이터를 수집, 관리, 분석하기 위해 함께 동작하는 여러 구성 요소로 이루어져 있습니다.

## EKS 클러스터

EKS(Elastic Kubernetes Service) 클러스터는 Observability 파이프라인의 주요 구성 요소를 호스팅합니다.

### ADOT Operator Helm Chart 설치

ADOT(AWS Distro for OpenTelemetry) Operator는 Helm chart를 사용하여 설치됩니다. Observability 파이프라인 구성 요소의 배포와 구성을 관리합니다.

### 사용자 구성 Collector

사용자 구성 Collector는 Operator에 의해 관리되며 다음 구성 요소로 이루어져 있습니다:

- Deployment로서의 Collector: Collector는 Kubernetes deployment로 배포되어 고가용성과 확장성을 보장합니다.
- Collector-0, Collector-1, Collector-2: 여러 Collector 인스턴스가 배포되어 들어오는 Observability 데이터를 처리합니다. 이들은 워크로드를 분산하고 안정적인 데이터 수집을 보장하기 위해 함께 동작합니다.

![OTEL pipeline](./images/otelpipeline.png)
*그림 1: OpenTelemetry 파이프라인*

### Persistent Volume

Persistent Volume은 수집된 Observability 데이터를 저장하는 데 사용됩니다. 데이터 내구성을 보장하고 장기 저장 및 분석을 가능하게 합니다.

### Kubernetes 노드

Kubernetes 노드는 애플리케이션 Pod과 사이드카로서의 Collector를 호스팅합니다.

- Application Container: 애플리케이션 컨테이너는 실제 애플리케이션 코드를 실행하고 Observability 데이터를 생성합니다.
- 사이드카로서의 Collector: Collector는 애플리케이션 컨테이너와 함께 사이드카 컨테이너로 실행됩니다. 애플리케이션이 생성하는 Observability 데이터를 수집합니다.

## 스크래핑 대상

Observability 파이프라인은 다음과 같은 다양한 스크래핑 대상에서 데이터를 수집합니다:

- 트레이스/메트릭 스크래핑: 파이프라인이 애플리케이션 및 인프라 구성 요소에서 트레이스와 메트릭을 스크래핑합니다.

## AWS Prometheus Remote Write Exporter

AWS Prometheus Remote Write Exporter는 수집된 Observability 데이터를 AWS 서비스로 내보내는 데 사용됩니다.

## AWS CloudWatch EMF Exporter

AWS CloudWatch EMF(Embedded Metric Format) Exporter는 메트릭을 AWS CloudWatch로 내보내는 데 사용됩니다.

## AWS X-Ray Tracing Exporter

AWS X-Ray Tracing Exporter는 분산 트레이싱 및 성능 분석을 위해 트레이싱 데이터를 AWS X-Ray로 내보내는 데 사용됩니다.

Observability 파이프라인은 스크래핑 대상에서 데이터를 수집하고, Collector를 통해 처리한 후, 추가 분석 및 시각화를 위해 다양한 AWS 서비스로 내보냅니다.


## ADOT을 활용한 메트릭 및 인사이트 수집

1. **계측**: OpenTelemetry와 유사하게, ADOT은 애플리케이션과 서비스를 계측하기 위한 라이브러리와 SDK를 제공하여 메트릭, 트레이스, 로그와 같은 텔레메트리 데이터를 캡처합니다.

2. **메트릭 수집**: ADOT은 AWS 서비스 메트릭을 포함한 시스템 및 애플리케이션 수준 메트릭의 수집과 내보내기를 지원하여 리소스 활용도와 애플리케이션 성능에 대한 인사이트를 제공합니다.

3. **분산 트레이싱**: ADOT은 AWS 서비스, 컨테이너, 온프레미스 환경에 걸쳐 분산 트레이싱을 가능하게 하여 요청과 작업을 엔드투엔드로 추적할 수 있습니다.

4. **로깅**: ADOT은 구조화된 로깅을 지원하며, 로그 데이터를 다른 텔레메트리 신호와 상관 분석하여 포괄적인 Observability를 제공합니다.

5. **AWS 서비스 통합**: ADOT은 AWS X-Ray, AWS CloudWatch, Amazon Managed Service for Prometheus, AWS Distro for OpenTelemetry Operator 등 AWS 서비스와 긴밀한 통합을 제공하여 AWS 에코시스템 내에서 원활한 텔레메트리 수집과 분석을 가능하게 합니다.

6. **자동 계측**: ADOT은 인기 있는 프레임워크와 라이브러리에 대한 자동 계측 기능을 제공하여 기존 애플리케이션을 계측하는 프로세스를 간소화합니다.

7. **데이터 처리 및 분석**: ADOT이 수집한 텔레메트리 데이터는 AWS X-Ray, Amazon Managed Service for Prometheus, AWS CloudWatch와 같은 AWS Observability 서비스로 내보낼 수 있으며, AWS 네이티브 분석 및 시각화 도구를 활용합니다.

## ADOT 사용의 이점

1. **AWS 네이티브 통합**: ADOT은 AWS 서비스 및 인프라와 원활하게 통합되도록 설계되어 AWS 에코시스템 내에서 일관된 Observability 경험을 제공합니다.

2. **성능 및 확장성**: ADOT은 대규모 AWS 환경에서 효율적인 텔레메트리 수집과 분석을 가능하게 하는 성능과 확장성에 최적화되어 있습니다.

3. **보안 및 규정 준수**: ADOT은 AWS 보안 모범 사례를 준수하며 다양한 산업 표준을 준수하여 안전하고 규정을 준수하는 Observability 관행을 보장합니다.

4. **AWS 지원**: AWS 지원 배포판으로서 ADOT은 AWS의 광범위한 문서, 지원 채널, OpenTelemetry 프로젝트에 대한 장기적인 헌신의 이점을 누립니다.

## OpenTelemetry와 ADOT의 차이점

ADOT과 OpenTelemetry는 많은 핵심 기능을 공유하지만 몇 가지 주요 차이점이 있습니다:

1. **AWS 통합**: ADOT은 AWS 환경에 특화되어 설계되고 AWS 서비스와 긴밀한 통합을 제공하는 반면, OpenTelemetry는 벤더 중립적인 프로젝트입니다.

2. **AWS 최적화**: ADOT은 AWS 환경 내에서 성능, 확장성, 보안에 최적화되어 AWS 네이티브 서비스와 모범 사례를 활용합니다.

3. **AWS 지원**: ADOT은 공식 AWS 지원, 문서, 장기적 헌신의 이점을 누리는 반면, OpenTelemetry는 커뮤니티 지원에 의존합니다.

4. **AWS 고유 기능**: ADOT은 AWS 서비스에 대한 AWS 고유 기능과 자동 계측을 포함하는 반면, OpenTelemetry는 범용 Observability에 초점을 맞춥니다.

5. **벤더 중립성**: OpenTelemetry는 다양한 Observability 플랫폼과의 통합을 허용하는 벤더 중립적 프로젝트인 반면, ADOT은 주로 AWS Observability 서비스에 초점을 맞춥니다.

ADOT을 활용함으로써 조직은 AWS 에코시스템 내에서 포괄적인 Observability를 달성할 수 있으며, AWS 네이티브 통합, 최적화된 성능, AWS 지원의 이점을 누리면서 OpenTelemetry 기능과 커뮤니티 기여를 활용할 수 있는 유연성을 유지합니다.
