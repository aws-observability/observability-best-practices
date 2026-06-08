# AWS에서의 빅데이터 Observability

이 다이어그램은 AWS에서 Spark 빅데이터 워크플로에 Observability를 구현하기 위한 모범 사례 패턴을 보여줍니다. 이 패턴은 Spark 작업에서 생성되는 로그와 메트릭을 수집, 처리, 분석하기 위해 다양한 AWS 서비스를 활용합니다.

![Spark Bigdata](./images/spark.png)
*그림 1: Spark 빅데이터 Observability*

## 워크플로

1. **사용자**가 **Amazon EMR** 클러스터에 Spark 작업을 제출합니다.
2. **Amazon EMR** 클러스터가 **Apache Spark**를 사용하여 클러스터 전체에 워크로드를 분산하며 Spark 작업을 실행합니다.
3. Spark 작업 실행 중에 로그와 메트릭이 생성되어 **Amazon CloudWatch**와 **Amazon EMR**에 의해 수집됩니다.

## Observability 구성 요소

### Amazon EMR

Amazon EMR은 AWS에서 Apache Spark와 같은 빅데이터 프레임워크 실행을 간소화하는 관리형 서비스입니다. 대량의 데이터를 처리하기 위한 확장 가능하고 비용 효율적인 플랫폼을 제공합니다.

### Amazon CloudWatch

Amazon CloudWatch는 다양한 AWS 리소스와 애플리케이션에서 메트릭, 로그, 이벤트를 수집하고 추적하는 모니터링 및 Observability 서비스입니다. 이 패턴에서 CloudWatch는 다음과 같이 사용됩니다:

1. Spark 작업을 실행하는 **EMR EC2 인스턴스**에서 로그와 메트릭을 수집합니다.
2. 중앙집중식 로그 관리 및 분석을 위해 수집된 로그를 **Amazon CloudWatch Logs**에 게시합니다.

### EMR EC2 인스턴스

Spark 작업은 EMR 클러스터의 컴퓨팅 노드인 EMR EC2 인스턴스에서 실행됩니다. 이 인스턴스들이 생성하는 로그와 메트릭은 **CloudWatch Agent**에 의해 수집되어 Amazon CloudWatch로 전송됩니다.

## 모범 사례

AWS에서 Spark 빅데이터 워크로드의 효과적인 Observability를 보장하려면 다음 모범 사례를 고려합니다:

1. **중앙집중식 로그 관리**: Amazon CloudWatch Logs를 사용하여 Spark 작업과 EMR 인스턴스에서 생성된 로그의 수집, 저장, 분석을 중앙에서 관리합니다. 이를 통해 Spark 워크플로의 손쉬운 문제 해결과 모니터링이 가능합니다.

2. **메트릭 수집**: CloudWatch Agent를 활용하여 EMR EC2 인스턴스에서 CPU 사용률, 메모리 사용량, 디스크 I/O 등 관련 메트릭을 수집합니다. 이 메트릭은 Spark 작업의 성능과 상태에 대한 인사이트를 제공합니다.

3. **대시보드 및 알람**: 주요 메트릭과 로그를 실시간으로 시각화하기 위한 CloudWatch 대시보드를 생성합니다. 특정 임계값이나 이상이 감지될 때 알림을 받을 수 있도록 CloudWatch 알람을 설정하여 사전 모니터링과 인시던트 대응을 가능하게 합니다.

4. **로그 분석**: Amazon CloudWatch Logs Insights를 활용하거나 다른 로그 분석 도구와 통합하여 임시 쿼리를 수행하고, 문제를 해결하며, 수집된 로그에서 가치 있는 인사이트를 얻습니다.

5. **성능 최적화**: 수집된 메트릭과 로그를 사용하여 Spark 작업의 성능을 지속적으로 모니터링하고 분석합니다. 병목 현상을 식별하고, 리소스 할당을 최적화하며, Spark 구성을 튜닝하여 빅데이터 워크로드의 효율성과 성능을 개선합니다.

이 Observability 패턴을 구현하고 모범 사례를 따르면 조직은 AWS에서의 Spark 빅데이터 워크로드를 효과적으로 모니터링하고, 문제를 해결하며, 최적화하여 대규모 데이터 처리의 안정성과 효율성을 보장할 수 있습니다.
