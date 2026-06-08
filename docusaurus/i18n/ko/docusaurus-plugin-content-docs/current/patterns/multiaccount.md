# AWS 네이티브 서비스를 활용한 크로스 어카운트 모니터링

현대 클라우드 환경의 복잡성이 증가함에 따라 여러 AWS 계정을 관리하고 모니터링하는 것이 효율적인 클라우드 운영의 핵심 요소가 되었습니다. AWS 멀티 어카운트 모니터링은 여러 AWS 계정에 걸쳐 리소스를 모니터링하고 관리하는 중앙집중식 접근 방식을 제공하여 조직이 더 나은 가시성을 확보하고 보안을 강화하며 운영을 간소화할 수 있도록 합니다.

오늘날 빠르게 진화하는 디지털 환경에서 조직은 경쟁 우위를 유지하고 성장을 촉진해야 하는 끊임없는 압박을 받고 있습니다. 클라우드 컴퓨팅은 확장성, 민첩성, 비용 효율성을 제공하는 게임 체인저로 부상했습니다. 그러나 클라우드 도입이 계속 가속화됨에 따라 이러한 환경을 관리하고 모니터링하는 복잡성도 기하급수적으로 증가합니다. 여기서 AWS 멀티 어카운트 모니터링이 중요한 역할을 하며, 여러 AWS 계정에 걸쳐 리소스를 효율적으로 관리하기 위한 강력한 솔루션을 제공합니다.

AWS 멀티 어카운트 모니터링은 조직의 클라우드 운영을 크게 향상시킬 수 있는 다양한 이점을 제공합니다. 주요 장점 중 하나는 중앙집중식 가시성으로, 여러 AWS 계정의 모니터링 데이터를 단일 대시보드로 통합합니다. 클라우드 인프라에 대한 이 종합적인 뷰를 통해 조직은 리소스에 대한 전체적인 이해를 얻어 더 나은 의사결정과 리소스 최적화가 가능합니다. 또한 AWS 멀티 어카운트 모니터링은 보안과 규정 준수 개선에 중요한 역할을 합니다. 모든 계정에 걸쳐 일관된 보안 정책을 시행하고 잠재적 위협을 탐지할 수 있어 조직이 취약점을 사전에 해결하고 리스크를 완화할 수 있습니다. 규정 준수 요구사항도 효과적으로 모니터링하고 준수할 수 있어 조직이 규제 프레임워크와 산업 표준 내에서 운영되도록 합니다.


## 통계:

Gartner에 따르면 2025년까지 새로운 디지털 워크로드의 95% 이상이 클라우드 네이티브 플랫폼에 배포될 것으로 예상되며, 이는 견고한 멀티 어카운트 모니터링 솔루션의 필요성을 강조합니다. Cloud Conformity의 연구에 따르면 25개 이상의 AWS 계정을 보유한 조직은 월평균 223건의 고위험 보안 인시던트를 경험하여 중앙집중식 모니터링과 거버넌스의 중요성을 강조합니다. Forrester Research는 효과적인 클라우드 거버넌스와 모니터링 전략을 갖춘 조직이 운영 비용을 최대 30%까지 절감할 수 있다고 추정합니다.

![Multi account monitoring](./images/crossaccountmonitoring.png)
         *그림 1: AWS CloudWatch를 활용한 크로스 어카운트 모니터링*

## AWS 멀티 어카운트 모니터링의 장점:

1. **중앙집중식 가시성**: 여러 AWS 계정의 모니터링 데이터를 단일 대시보드로 통합하여 클라우드 인프라에 대한 포괄적인 뷰를 제공합니다.
2. **보안 및 규정 준수 개선**: 일관된 보안 정책을 시행하고 잠재적 위협을 탐지하며 모든 계정에서 규정 준수를 보장합니다.
3. **비용 최적화**: 미사용 또는 중복 리소스를 식별하고 제거하여 클라우드 지출을 최적화하고 낭비를 줄입니다.
4. **운영 간소화**: 모니터링 및 알림 프로세스를 자동화하여 수동 작업을 줄이고 운영 효율성을 향상시킵니다.
5. **확장성**: 모니터링 기능을 저하시키지 않고 새로운 AWS 계정과 리소스를 쉽게 온보딩할 수 있습니다.

## AWS 멀티 어카운트 모니터링의 단점:

1. **구현 복잡성**: 대규모 환경에서 멀티 어카운트 모니터링을 설정하고 구성하는 것이 어려울 수 있습니다.
2. **데이터 집계 오버헤드**: 여러 계정에서 데이터를 수집하고 집계하면 성능 오버헤드와 지연이 발생할 수 있습니다.
3. **접근 관리**: 여러 계정에 걸쳐 접근과 권한을 관리하는 것이 복잡하고 오류가 발생하기 쉬울 수 있습니다.
4. **비용 영향**: 올바르게 수행하지 않으면 포괄적인 멀티 어카운트 모니터링 솔루션을 구현하고 유지하는 데 추가 비용이 발생할 수 있습니다.

## 멀티 어카운트 모니터링을 위한 주요 AWS 서비스 및 도구:

1. **AWS Organizations**: 여러 AWS 계정을 중앙에서 관리하고 거버넌스를 수행하여 통합 결제, 정책 기반 관리, 계정 생성/관리를 가능하게 합니다.
2. **AWS Config**: 리소스 구성을 지속적으로 모니터링하고 기록하여 여러 계정에 걸쳐 규정 준수 감사와 변경 추적을 가능하게 합니다.
3. **AWS CloudTrail**: 보안 및 운영 목적으로 여러 AWS 계정에 걸쳐 API 활동 및 사용자 작업을 로깅하고 모니터링합니다.
4. **Amazon CloudWatch**: 여러 계정에 걸쳐 다양한 AWS 리소스의 메트릭, 로그, 이벤트를 모니터링하고 수집하여 중앙집중식 모니터링과 알림을 제공합니다.
5. **AWS Security Hub**: 여러 AWS 계정에 걸쳐 보안 결과를 중앙에서 확인하고 관리하여 포괄적인 보안 모니터링과 규정 준수 추적을 가능하게 합니다.

## 참고 자료:

1. AWS Documentation: "CloudWatch cross-account observability" (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)
2. Cloud Conformity Report: "The State of AWS Security and Compliance in the Cloud" (https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/)
3. Forrester Research: "The Total Economic Impact™ Of AWS Cloud Operations" (https://pages.awscloud.com/rs/112-TZM-766/images/GEN_forrester-tei-cloud-ops_May-2022.pdf)
4. How Audible used Amazon CloudWatch cross-account observability to resolve severity tickets faster (https://aws.amazon.com/blogs/mt/how-audible-used-amazon-cloudwatch-cross-account-observability-to-resolve-severity-tickets-faster/)
