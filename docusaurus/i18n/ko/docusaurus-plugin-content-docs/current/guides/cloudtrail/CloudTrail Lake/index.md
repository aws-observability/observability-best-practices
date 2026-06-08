---
sidebar_position: 3
---
# CloudTrail Lake

CloudTrail Lake는 수집된 이벤트를 집계하고, 불변적으로 저장하며, 쿼리할 수 있는 기능을 제공하여 조직을 위한 관리형 데이터 레이크를 제공합니다. 조직은 이러한 이벤트를 감사, 보안 조사 및 운영 조사에 사용할 수 있습니다. CloudTrail Lake는 수집, 저장, 준비, 분석 및 쿼리를 위한 최적화를 CloudTrail 내에서 통합하여 분석 워크플로를 단순화합니다. 다음은 CloudTrail Lake에 대한 몇 가지 모범 사례를 설명합니다.

### 적절한 요금 옵션 선택
이벤트 데이터 스토어를 생성할 때, 월별로 수집할 것으로 예상되는 이벤트의 유형과 양에 맞는 요금 옵션을 선택해야 합니다. 대부분의 경우 1년 연장 가능 보존 요금 옵션이 가장 비용 효율적인 접근 방식입니다. 그러나 월 25TB 이상의 데이터를 수집할 경우 7년 보존 요금 옵션이 더 나은 선택일 수 있습니다.

![CloudTrail Lake 요금 옵션](/img/cloudops/guides/cloudtrail-lake/price-option-eds.png "CloudTrail Lake 요금 옵션")

### Lake 쿼리 페더레이션
Lake 쿼리 페더레이션을 활성화하는 것을 권장합니다. 이를 통해 Athena에서 제로 ETL 분석을 위해 이벤트 데이터 스토어를 구성할 수 있습니다. 이는 활동 로그를 애플리케이션 로그 또는 S3에 저장된 비용 및 사용량 데이터와 상관시키기 위해 데이터 처리 파이프라인을 구축하는 운영 복잡성을 제거합니다. 또한 Athena 내에서 다른 데이터셋에 대해 크로스 조인 쿼리를 실행할 수 있습니다. 이 기능을 활성화하면 LakeFormation을 사용하여 이벤트 데이터 스토어에 대한 페더레이트 링크를 제공하므로 CloudTrail 데이터를 복제하거나 이동할 필요가 없습니다. 이 기능을 통해 LakeFormation을 사용하여 데이터 필터를 생성하고 이벤트 데이터 스토어 내 데이터의 하위 집합을 조직 내 다른 계정과 공유할 수도 있습니다. 자세한 내용은 블로그: [데이터를 복제하지 않고 계정 간에 AWS CloudTrail Lake 로그를 안전하게 공유](https://aws.amazon.com/blogs/mt/securely-share-aws-cloudtrail-lake-logs-across-accounts-without-replicating-data/)를 참조하세요.

### 리소스 기반 정책 구성
다른 IAM 주체에 권한을 부여하는 리소스 기반 정책을 구성할 수 있습니다. 이를 통해 다른 멤버 계정에 EDS를 공유하여 CloudTrail 데이터를 쿼리할 수 있습니다. 특정 IAM 주체에게 이벤트 데이터 스토어를 쿼리할 수 있는 접근 권한을 부여할 수 있으므로 이벤트를 다른 계정으로 복제하거나 복사할 필요가 없습니다.

### 이벤트 데이터 스토어에 태그 구성
이벤트 데이터 스토어에 태그를 추가하면 이러한 태그를 사용자 정의 비용 할당 태그로 추가하여 CloudTrail Lake 이벤트 데이터의 쿼리 및 수집 비용을 추적할 수 있습니다. 이벤트 데이터 스토어에 대한 태그의 또 다른 사용 사례는 이벤트 데이터 스토어를 관리하거나 쿼리할 수 있는 사람을 정의하는 리소스 기반 IAM 정책을 추가하는 것입니다.

### 이벤트 데이터 스토어에 데이터 이벤트 수집
데이터 이벤트는 리소스에서 또는 리소스 내에서 수행되는 리소스 작업에 대한 가시성을 제공합니다. CloudTrail 데이터 이벤트는 다양한 리소스 유형을 지원합니다. 지원되는 리소스 유형의 전체 목록은 문서 [CloudTrail 데이터 이벤트](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html#logging-data-events)를 참조하세요. 이러한 이벤트는 데이터 플레인 작업이라고도 합니다. 데이터 이벤트는 특히 S3에 민감한 데이터를 저장하거나 Lambda 함수를 통해 핵심 비즈니스 작업이 수행되는 경우 대량의 활동이 발생하는 경우가 많습니다. 민감한 데이터에 대한 예상치 못한 접근에 대한 가시성을 통해 데이터를 보호하기 위한 시정 조치를 취할 수 있습니다. 일부 컴플라이언스 보고서(예: FedRAMP 및 PCI-DSS)는 데이터 이벤트를 활성화해야 하므로, AWS는 모든 S3 버킷에 대해 최소 하나의 trail이 S3 데이터 이벤트를 로깅하고 있는지 확인하기 위해 AWS Config 관리형 규칙 또는 적절한 Conformance Pack 샘플 템플릿을 사용할 것을 권장합니다.

### 이전 CloudTrail Trail 이벤트 가져오기
CloudTrail Trails에서 CloudTrail Lake로 마이그레이션할 때, Copy Trail event 기능을 사용하여 이벤트 데이터 스토어 생성 이전에 기록된 기존 trail 이벤트를 CloudTrail Lake 이벤트 데이터 스토어로 복사합니다. 이를 통해 CloudTrail trail에 해당하는 Amazon Simple Storage Service(Amazon S3) 버킷에서 CloudTrail Lake EDS로 이벤트를 가져올 수 있습니다. 그러나 이 기능을 사용할 때는 Lake에서 장기 저장 및 분석에 필요한 로그의 하위 집합만 가져오도록 가져오기 날짜 범위를 지정하는 것이 좋습니다. 이를 통해 지정된 날짜 범위 외의 로그 가져오기와 관련된 추가 비용을 방지할 수 있습니다.

![CloudTrail Lake Copy trail events](/img/cloudops/guides/cloudtrail-lake/copy-trail-eds.png "CloudTrail Lake Copy trail events")

### 이벤트 데이터 스토어에 수집되는 CloudTrail 이벤트에 대한 향상된 필터링 옵션
향상된 이벤트 필터링 기능은 이벤트 데이터 스토어에 수집되는 CloudTrail 이벤트에 대한 더 큰 제어를 제공합니다. 이러한 향상된 필터링 옵션은 AWS 활동 데이터에 대한 더 강력한 제어를 제공하여 보안, 컴플라이언스 및 운영 조사의 효율성과 정밀도를 향상시킵니다. 또한 새로운 필터링 옵션은 가장 관련성 높은 이벤트 데이터만 CloudTrail Lake 이벤트 데이터 스토어에 수집하여 분석 워크플로 비용을 줄이는 데 도움이 됩니다.

Advanced Event Collection을 사용하여 관리 이벤트를 필터링하고 eventSource, eventType, eventName, userIdentity.arn, sessionCredentialFromConsole과 같은 속성을 기반으로 이벤트를 포함하거나 제외할 수 있습니다.

데이터 이벤트를 사용할 때는 이벤트 데이터 스토어에 수집되는 CloudTrail 이벤트에 대한 더 큰 제어를 제공하는 advanced event selectors를 사용하는 것을 권장합니다. Advanced event selectors를 사용하면 EventSource, EventName, userIdentity.arn 및 ResourceARN과 같은 필드에서 값을 포함하거나 제외할 수 있습니다. Advanced event selectors는 부분 문자열에 대한 패턴 매칭으로 값을 포함하거나 제외하는 것도 지원합니다.

CloudTrail에 향상된 필터를 사용하면 비용을 절감하면서 보안, 컴플라이언스 및 운영 조사의 효율성과 정밀도를 높이는 데 도움이 됩니다. 예를 들어, userIdentity.arn 속성을 기반으로 CloudTrail 이벤트를 필터링하여 특정 IAM 역할이나 사용자가 생성한 이벤트를 제외할 수 있습니다. 모니터링 목적으로 빈번한 API 호출을 수행하는 서비스가 사용하는 전용 IAM 역할을 제외할 수 있습니다. 이를 통해 CloudTrail Lake에 수집되는 CloudTrail 이벤트의 볼륨을 크게 줄여 관련 사용자 및 시스템 활동에 대한 가시성을 유지하면서 비용을 절감할 수 있습니다.

![CloudTrail Lake 데이터 이벤트](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "데이터 이벤트를 위한 Advanced Event Selectors")

### SQL 쿼리
SQL 쿼리를 실행할 때, 쿼리에 시작 및 종료 eventTime 타임스탬프를 추가하여 쿼리를 제한하는 것을 권장합니다. 이를 통해 쿼리를 위해 데이터가 스캔될 때 비용을 최소화할 수 있습니다. where 절에 eventtime 필드를 추가하고 사용하려는 시간 범위로 검색될 시간 범위를 추가하면 됩니다. eventTime > 뒤에 지정된 날짜 문자열은 포함될 가장 이른 이벤트 타임스탬프이고, eventTime < 뒤에 지정된 날짜 문자열은 포함될 가장 최근 이벤트 타임스탬프입니다. 다음 쿼리는 eventtime 필드 사용의 샘플입니다.

```sql
SELECT eventTime, useridentity.arn, awsRegion FROM $EDS_ID WHERE eventTime > '2024-07-20 00:00:00' AND eventTime < '2024-07-23 00:00:00' AND awsRegion in ('us-east-1') AND eventName = 'ConsoleLogin'
```

### 자연어 프롬프트
자연어 쿼리 프로세서를 사용하여 SQL 쿼리를 작성하거나 활동 이벤트를 쿼리하는 데 필요한 SQL 구문을 이해하는 데 시간을 들이지 않고도 CloudTrail Lake에 저장된 활동 로그(관리 및 데이터 이벤트) 분석을 시작하세요. NLQ는 쿼리하고 싶은 내용을 물어보고 사용할 SQL 쿼리를 제공하여 데이터에 대한 더 빠른 인사이트를 얻는 데도 도움이 됩니다.

### CloudTrail 쿼리 결과 무결성 검증
CloudTrail Lake 쿼리 결과 무결성 검증을 사용하면 결과가 내보내질 때 쿼리 결과가 수정, 삭제 또는 변경되었는지 알 수 있습니다. 쿼리 결과를 검증하면 CloudTrail이 전달한 내보내기 결과 파일에 변경 사항이 없었음을 보장할 수 있습니다. 결과를 검증하려면 **verify-query-results** AWS CLI 명령을 사용하여 각 쿼리 결과 파일의 해시 값을 서명된 파일의 해시 값과 비교할 수 있습니다.

### CloudTrail Lake 사용량을 모니터링하기 위한 CloudWatch 알림 설정
CloudTrail Lake에 지원되는 CloudWatch 메트릭에 대한 알람 및 알림을 생성하여 일정 기간 동안 이벤트 데이터 스토어 사용량을 추적할 수 있습니다. 그런 다음 특정 임계값을 초과했을 때 알림을 받도록 알림을 설정할 수 있습니다. CloudWatch를 사용하면 HourlyDataIngested, TotalDataRetained, TotalStorageBytes 및 TotalPaidStorageBytes와 같은 메트릭을 모니터링하여 CloudTrail Lake의 전체 데이터 사용량에 대한 추가 가시성을 확보할 수 있습니다. 예를 들어, CloudTrail Lake Event Data Store 크기를 보여주는 CloudWatch 대시보드를 만들 수 있습니다.

```sql
SORT(SEARCH('{AWS/CloudTrail,"Event data store ID","Lake Metrics"} MetricName="TotalPaidStorageBytes" NOT "Lake Metrics"="IngestionMetrics"',"Sum"),SUM, DESC)
```
![CloudTrail Lake Event Data Store Size](/img/cloudops/guides/cloudtrail-lake/cloudtrail-lake-storage-size.png "CloudTrail Lake Event Data Store Size")

### CloudTrail Lake 대시보드
CloudTrail Lake 대시보드를 활성화하여 CloudTrail Lake의 이벤트 데이터 스토어에 저장된 데이터의 이벤트 추세를 시각화하는 것을 권장합니다. 하이라이트 대시보드는 CloudTrail Lake에서 캡처된 데이터의 전반적인 요약을 보기 쉽게 제공합니다. 이를 통해 가장 많이 실패한 API 호출, 실패한 로그인 시도의 추세, 리소스 생성의 급증과 같은 이벤트 데이터 스토어 내의 중요한 인사이트를 빠르게 식별하고 이해할 수 있는 대시보드를 제공합니다. CloudTrail Lake 대시보드는 또한 AWS 서비스에 특화된 다른 관리형 대시보드를 제공하여 해당 서비스에 대한 추가 인사이트를 제공합니다. 자체 위젯이나 관리형 대시보드의 특정 위젯을 보여주는 사용자 지정 대시보드를 만들 수도 있습니다.
