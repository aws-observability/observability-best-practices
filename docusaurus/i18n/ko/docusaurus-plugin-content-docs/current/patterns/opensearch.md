# AWS에서의 Opensearch 로깅

## 소개
Opensearch는 로그 집계, 분석, 시각화를 가능하게 하는 인기 있는 오픈소스 검색 및 분석 엔진입니다. AWS는 로그를 생성하는 애플리케이션을 배포하고 실행하는 데 사용할 수 있는 ECS(Elastic Container Service), EKS(Elastic Kubernetes Service), EC2(Elastic Compute Cloud)와 같은 여러 컴퓨팅 서비스를 제공합니다. 이러한 컴퓨팅 서비스와 Opensearch를 통합하면 애플리케이션과 인프라를 효과적으로 모니터링하기 위한 중앙집중식 로깅이 가능합니다.

![Opensearch pipeline](./images/os.png)
*그림 1: Opensearch 파이프라인*

## 아키텍처 개요
다음은 ECS, EKS, EC2를 활용한 AWS에서의 Opensearch 로깅 고수준 아키텍처입니다:

1. ECS, EKS 또는 EC2에서 실행되는 애플리케이션이 로그를 생성합니다.
2. 로그 에이전트(예: Fluentd, Fluent Bit, Logstash 등)가 컴퓨팅 서비스에서 로그를 수집합니다.
3. 로그 에이전트가 관리형 Opensearch 클러스터인 Amazon Opensearch Service로 로그를 전송합니다.
4. Opensearch가 로그 데이터를 인덱싱하고 저장합니다.
5. Opensearch와 통합된 Kibana를 사용하여 로그 데이터를 검색, 분석, 시각화합니다.

주요 구성 요소:
- Amazon Opensearch Service: 로그 집계 및 분석을 위한 관리형 Opensearch 클러스터
- 컴퓨팅 서비스(ECS, EKS, EC2): 로그를 생성하는 애플리케이션이 배포되는 곳
- 로그 에이전트: 컴퓨팅에서 로그를 수집하여 Opensearch로 전송
- Opensearch 인덱스: 로그 데이터를 저장
- Kibana: 로그 데이터의 시각화 및 분석

## 장점
1. **중앙집중식 로깅**: 모든 컴퓨팅 서비스의 로그를 Opensearch로 집계하여 로그 분석을 위한 단일 대시보드를 제공합니다.
2. **확장성**: Amazon Opensearch Service는 대량의 로그 데이터를 수집하고 분석할 수 있도록 확장됩니다.
3. **완전 관리형**: Opensearch Service는 Opensearch 관리의 운영 오버헤드를 제거합니다.
4. **실시간 모니터링**: 사전 모니터링을 위해 거의 실시간으로 로그를 수집하고 시각화합니다.
5. **풍부한 분석**: Kibana는 로그를 검색, 필터링, 분석, 시각화하기 위한 강력한 도구를 제공합니다.
6. **확장 가능성**: 다양한 로그 에이전트 및 AWS 서비스와 유연하게 통합됩니다.

## 단점
1. **비용**: 대규모로 Opensearch에 로그를 집계하면 상당한 데이터 전송 및 저장 비용이 발생할 수 있습니다.
2. **복잡한 설정**: 컴퓨팅 서비스에서 Opensearch로 로그를 스트리밍하는 초기 설정이 복잡할 수 있습니다.
3. **학습 곡선**: 효율적으로 활용하려면 Opensearch와 Kibana에 대한 지식이 필요합니다.
4. **대규모 제한 사항**: 매우 큰 로그 볼륨의 경우 Opensearch의 확장성과 성능에 한계가 있을 수 있습니다.
5. **보안 오버헤드**: 안전한 로그 전송과 Opensearch 접근을 보장하려면 신중한 구성이 필요합니다.

## 결론
ECS, EKS, EC2와 같은 AWS 컴퓨팅 서비스와 Opensearch를 통합하면 강력한 로그 집계 및 분석 기능을 제공합니다. 확장 가능하고 중앙집중적이며 거의 실시간인 로깅 솔루션을 제공하지만, 비용, 보안, 확장성, 성능을 고려하여 아키텍처를 신중하게 설계하는 것이 중요합니다. 올바른 구현을 통해 AWS에서의 Opensearch 로깅은 애플리케이션과 인프라에 대한 Observability를 크게 향상시킬 수 있습니다.
