---
sidebar_position: 1
---
# CloudTrail 운영

AWS CloudTrail은 AWS 인프라 전반에서 계정 활동을 로깅하고 지속적으로 모니터링하며 보관할 수 있습니다. 또한 AWS Management Console, AWS SDK, 명령줄 도구를 통해 수행된 API 호출을 포함하여 계정에 대한 AWS 호출 기록을 제공합니다. 결과적으로 다음을 식별할 수 있습니다:

*   CloudTrail을 지원하는 서비스에 대해 어떤 사용자와 계정이 AWS API를 호출했는지.
*   호출이 이루어진 소스 IP 주소.
*   호출이 발생한 시점.

CloudTrail은 AWS 계정을 생성할 때 활성화되며 지난 90일간의 모든 관리 이벤트 활동의 이벤트 기록을 제공합니다. AWS는 AWS 환경 내에서 90일 이상의 이벤트를 보관하기 위해 trail 또는 Lake용 이벤트 데이터 스토어를 생성할 것을 권장합니다. 다음에서는 CloudTrail에 대한 전반적인 모범 사례를 설명하고, 이후 섹션에서 CloudTrail Trails 및 CloudTrail Lake와 같은 특정 영역에 대한 모범 사례를 제공합니다.

### 보안 또는 로깅 계정을 CloudTrail의 위임 관리자로 등록

CloudTrail은 조직의 trail 및 Lake 이벤트 데이터 스토어를 관리하기 위해 최대 3명의 위임 관리자를 구성할 수 있습니다. 위임 관리자는 조직을 대신하여 리소스를 관리할 수 있는 권한을 갖습니다. 위임 관리자 지원을 통해 관리 계정이 CloudTrail 관리 작업을 보안 또는 로깅 계정과 같은 조직 멤버 계정에 위임할 수 있어 고객에게 유연성을 제공합니다.

이 기능을 사용하면 조직 trail 또는 CloudTrail Lake 이벤트 데이터 스토어 리소스가 위임 관리자 계정을 통해 생성 및 관리되더라도, 조직의 관리 계정이 모든 CloudTrail 조직 리소스의 소유자로 유지됩니다. 이를 통해 AWS Organizations에서 조직에 변경 사항이 있을 때 중단 없이 조직 전체의 CloudTrail 감사 로그의 연속성을 유지할 수 있습니다. CloudTrail에 위임 관리자를 활용하면 CloudTrail 관련 관리 작업에 관리 계정을 사용하는 사용자를 최소화하여 보안 및 컴플라이언스 태세를 개선하는 데 도움이 됩니다.

### CloudTrail Insights를 사용한 비정상적 API 활동 모니터링

AWS CloudTrail Insights는 CloudTrail 관리 이벤트를 지속적으로 분석하여 AWS 사용자가 API 호출과 관련된 비정상적인 활동을 식별하고 대응하는 데 도움을 줍니다. CloudTrail Insights가 활성화되어 있고 CloudTrail이 비정상적인 활동을 감지하면, Insights 이벤트가 trail의 대상 S3 버킷 또는 CloudTrail Lake의 이벤트 데이터 스토어로 전달됩니다. trail에서 캡처되는 다른 유형의 이벤트와 달리, Insights 이벤트는 CloudTrail이 계정의 일반적인 사용 패턴과 크게 다른 API 사용 변경을 감지할 때만 로깅됩니다. CloudTrail Insights는 EventBridge와 통합되어 이메일 알림 전송이나 Lambda 함수 트리거와 같은 기준에 따라 특정 작업을 트리거하는 규칙을 생성할 수 있습니다. 결과적으로 팀이 비정상적인 API 활동에 대해 즉시 알림을 받을 수 있도록 할 수 있습니다.

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### CloudTrail 비용 관리
CloudTrail을 사용할 때 CloudTrail 지출을 관리하는 데 도움이 되는 영역을 고려해야 합니다. 다음은 CloudTrail 비용을 제어하는 데 도움이 되는 몇 가지 모범 사례입니다.

-   **AWS Budgets**: AWS Budgets는 CloudTrail 지출을 추적하는 데 도움을 줍니다. CloudTrail 서비스를 기반으로 AWS Budgets에서 비용 기반 예산을 설정할 수 있습니다. 또한 이메일 또는 AWS Chatbot을 통해 특정 예산 임계값에 도달했을 때 알림을 받도록 예산 알림을 설정할 수 있습니다.

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**: AWS Cost Anomaly Detection은 조직 전체에서 AWS 지출의 예상치 못한 급증을 식별하고 해결하는 데 도움을 줍니다. AWS CloudTrail 서비스에 대한 모니터를 생성하여 지출을 추적할 수 있습니다. 이 서비스는 머신 러닝을 사용하여 과거 데이터를 분석하여 예상 일일 지출을 계산하고 실제 지출과 비교합니다. CloudTrail 실제 지출이 특정 임계값을 초과하여 예상 금액을 넘으면, 이를 이상치로 식별하고 근본 원인 분석을 수행합니다. 그런 다음 AWS Cost Anomaly Detection이 CloudTrail 지출과 관련된 이상치를 감지하면 신속하게 조치를 취할 수 있습니다.

-   **Amazon S3 Bucket Keys를 사용하여 CloudTrail S3 버킷의 SSE-KMS 관련 비용 절감**: Amazon S3 서버 측 암호화에 AWS KMS(SSE-KMS)를 사용하는 객체 수준 키를 사용할 때, Amazon S3 Bucket Keys로 전환하여 Amazon S3에서 AWS KMS로의 요청 트래픽을 줄여 AWS KMS 요청 비용을 최대 99%까지 절감하는 것을 고려해야 합니다. 이는 또한 CloudTrail에 로깅되는 이벤트 볼륨을 크게 줄여 CloudTrail 비용을 절감하는 데 도움이 됩니다. S3 Bucket Keys 사용의 추가 주요 이점:
    *   **간소화된 관리:** 버킷 수준 키는 개별 객체 수준 키에 비해 관리가 더 쉽습니다.
    *   **성능 향상**: KMS에 대한 API 호출 감소로 암호화된 객체와 관련된 작업의 성능이 향상될 수 있습니다.
    *   **손쉬운 구현:** S3 Bucket Keys는 클라이언트 애플리케이션을 변경할 필요 없이 AWS Management Console에서 몇 번의 클릭으로 활성화할 수 있습니다.

-   **다중 Trail**: 계정에 대한 관리 이벤트의 첫 번째 사본은 AWS 프리 티어에 포함됩니다. 동일한 관리 이벤트를 전달하는 추가 trail을 생성하면 추가 CloudTrail 비용이 발생합니다. 여러 trail이 필요한 경우 다음 권장 사항이 CloudTrail의 추가 trail 비용을 줄이는 데 도움이 될 수 있습니다:

    *   **CloudTrail Lake**: CloudTrail Lake를 활용하여 관리 이벤트의 추가 사본을 수집합니다. CloudTrail Lake를 사용하면 관리 이벤트 추가 사본에 대한 전체 비용을 최대 90%까지 줄일 수 있습니다.
    
    *   **AWS Key Management Service(AWS KMS) 및 Amazon Relational Database Service(Amazon RDS) 데이터 API 이벤트 제외**: 관리 이벤트의 추가 사본의 경우, AWS Key Management Service(AWS KMS) 및 Amazon Relational Database Service(Amazon RDS) 데이터 API 이벤트도 제외하는 것이 좋습니다. 이러한 이벤트의 두 번째 사본이 필요하지 않을 수 있기 때문입니다. 이러한 대량 이벤트는 높은 비용을 발생시킬 수 있으며 trail 또는 이벤트 데이터 스토어 페이지의 관리 필터에서 제외할 수 있습니다.

-   **데이터 이벤트를 위한 Advanced Event Selectors**: 데이터 이벤트를 사용할 때, advanced event selectors는 데이터 이벤트 로깅에 대한 세분화된 제어를 제공할 수 있습니다. Advanced event selectors는 부분 문자열에 대한 패턴 매칭으로 값을 포함하거나 제외하는 것도 지원합니다. 이를 통해 로깅하고 비용을 지불할 CloudTrail 데이터 이벤트에 대한 향상된 제어를 제공합니다. 예를 들어, Amazon S3 DeleteObject API를 로깅하여 수신하는 CloudTrail 이벤트를 파괴적 작업에만 좁힐 수 있습니다. 이를 통해 비용을 제어하면서 보안 문제를 식별하는 데 도움이 됩니다.
