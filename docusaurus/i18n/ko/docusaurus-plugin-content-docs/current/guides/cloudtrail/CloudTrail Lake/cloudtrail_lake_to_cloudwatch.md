---
sidebar_position: 3
---

# CloudTrail Lake에서 Amazon CloudWatch로 마이그레이션

## 개요

이 가이드는 AWS CloudTrail Lake에서 Amazon CloudWatch로 CloudTrail 이벤트 분석의 주요 대상을 마이그레이션하는 단계별 접근 방식을 제공합니다. 과거 데이터 내보내기, 텔레메트리 활성화 규칙을 통한 새로운 CloudTrail 수집 활성화, 교차 계정/교차 리전 중앙 집중화 설정의 3단계 구조화된 마이그레이션 과정을 안내합니다. 이를 통해 CloudWatch Unified Data Store에서 CloudTrail 활동을 다른 운영 및 보안 텔레메트리와 통합할 수 있습니다. 또한 비용 추정, CloudTrail Lake SQL에서 CloudWatch Logs Insights로의 쿼리 변환, 중앙 집중화 가격 최적화, 로그 그룹에 대한 보안 모범 사례, 그리고 거의 실시간 보안 가시성을 위한 대시보드 구축 방법도 다룹니다.

### 마이그레이션을 하는 이유

현재 CloudTrail Lake를 사용하는 조직은 공통적인 과제에 직면합니다. CloudTrail 데이터가 다른 운영 및 보안 텔레메트리와 분리되어 있어, 인시던트 조사가 느리고 여러 도구와 쿼리 언어에 걸쳐 단편화됩니다. [Amazon CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)는 CloudTrail 활동을 VPC Flow Logs, AWS WAF 로그, 애플리케이션 로그, 서드파티 보안 데이터와 함께 하나의 중앙 저장소에 통합하여 이 문제를 해결합니다. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 및 Apache Iceberg 호환 도구인 [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)와 [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html)를 통해 상관 분석이 가능합니다.

### 마이그레이션의 주요 이점

1. **통합 텔레메트리**: CloudWatch Unified Data Store를 통해 AWS 서비스(CloudTrail, VPC Flow Logs, WAF, Route 53, EKS, NLB 등), 서드파티 소스(CrowdStrike, SentinelOne, Okta, Palo Alto Networks 등), 그리고 사용자 정의 애플리케이션 로그를 단일 쿼리 인터페이스에서 상호 연관시켜 분석할 수 있습니다.
2. **자동 스키마 검색**: CloudWatch는 CloudTrail 필드를 자동으로 검색 및 인덱싱하며, 동적 로그 그룹 탐색을 위한 `@data_source_name`과 같은 기본 패싯을 제공합니다. 자세한 내용은 [Data source discovery and management](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html)를 참조하세요.
3. **로그 그룹 이름에 의존하지 않는 쿼리**: 로그 그룹 이름과 관계없이 `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]`을 사용하여 모든 CloudTrail 데이터를 쿼리할 수 있습니다.
4. **네이티브 보강**: [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html)을 사용하여 사용자 정의 Lambda 함수 없이도 수집 시점에 보안 컨텍스트, 규정 준수 태그, 환경 레이블을 추가할 수 있습니다.
5. **교차 계정/교차 리전 중앙 집중화**: 보안, 규정 준수 및 인시던트 대응을 위해 모든 계정과 리전의 CloudTrail 데이터를 단일 대상으로 통합할 수 있습니다. 자세한 내용은 [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)을 참조하세요.
6. **하나의 플랫폼으로 더 많은 가치 실현**: CloudWatch Unified Data Store는 독립형 쿼리 서비스를 넘어, 내장된 정규화와 교차 소스 상관 분석을 통해 AWS 로그, 서드파티 보안 소스, 사용자 정의 애플리케이션 데이터를 단일 플랫폼에서 통합합니다.

### 3단계 마이그레이션 접근 방식

마이그레이션은 구조화된 3단계 접근 방식을 따릅니다:

![CloudTrail Lake 3단계 마이그레이션 접근 방식](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake 3단계 마이그레이션 접근 방식")

### 마이그레이션 비용 추정

CloudTrail Lake에서 CloudWatch로 마이그레이션하면, 새로운 CloudTrail 이벤트가 지속적으로 CloudWatch Logs에 직접 수집됩니다. 예산 계획 및 비용 최적화를 위해 이 마이그레이션의 비용 영향을 이해하는 것이 중요합니다.

예상 월간 CloudWatch Logs 비용을 산정하려면, **AWS Cost Explorer**에서 CloudTrail 서비스를 필터링하고 사용 유형별로 그룹화하여 현재 CloudTrail Lake 사용량을 확인하세요. 이벤트 데이터 스토어의 CloudTrail Lake 사용 유형(수집 바이트 등)을 파악하려면 [Viewing your CloudTrail cost and usage with AWS Cost Explorer](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)를 참조하세요. Cost Explorer는 수집 값을 GB 단위로 표시하며, 이를 최신 [CloudWatch 가격](https://aws.amazon.com/cloudwatch/pricing/)의 CloudTrail 전달 및 CloudWatch Logs 수집 요금과 비교하여 비용을 산정할 수 있습니다.

:::info
참고: 이 추정치는 수집 및 전달 비용만 포함하며, 스토리지 및 쿼리 등 CloudWatch Logs와 관련된 추가 비용은 포함하지 않습니다.
:::

---

## 1단계 — CloudTrail Lake에서 CloudWatch로 이전 데이터 내보내기

CloudTrail Lake의 과거 데이터를 CloudWatch로 내보내면 감사 추적의 연속성을 보장하고, 과거 이벤트와 새 이벤트를 통합 쿼리할 수 있습니다. 이 단계에서는 기존 이벤트 데이터 스토어(EDS)의 데이터를 CloudWatch Logs로 이동하는 것에 집중합니다.

### CloudTrail Lake 데이터를 CloudWatch로 내보내기 실행

1. [CloudTrail 콘솔](https://console.aws.amazon.com/cloudtrailv2/#/lake)로 이동합니다.
1. 왼쪽 탐색 메뉴에서 **Lake**를 선택합니다.
1. **Event Data Stores**를 선택합니다.
1. CloudTrail 이벤트에 대한 **Event Data Store**를 선택합니다.
1. **Actions** 드롭다운에서 **Export to CloudWatch**를 선택합니다.

    ![CloudTrail Lake 이벤트 데이터 스토어 Actions 메뉴에서 Export to CloudWatch 옵션을 보여주는 화면.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_01.png "CloudTrail Lake 이벤트 데이터 스토어 Actions 메뉴에서 Export to CloudWatch 옵션을 보여주는 화면.")

1. 이벤트 데이터 스토어에서 데이터를 내보낼 **시간 범위**를 선택합니다.
1. 제공된 안내에 따라 **IAM role**을 구성합니다. CloudTrail이 내보내기를 위해 데이터에 접근할 때 사용할 새 IAM 역할을 생성하거나 기존 IAM 역할을 지정할 수 있습니다.
1. **Export**를 선택합니다.

    ![CloudWatch로 내보내기 구성 화면으로, 시간 범위 선택 및 IAM 역할 구성을 보여줍니다.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_02.png "CloudWatch로 내보내기 구성 화면으로, 시간 범위 선택 및 IAM 역할 구성을 보여줍니다.")

:::info
내보낸 데이터는 Infrequent Access 스토리지 클래스를 사용하므로, 로그 정보를 쿼리하려면 CloudWatch Logs Insights를 사용해야 합니다. Infrequent Access 스토리지로 생성된 로그 그룹은 콘솔의 Log Streams에서 내보내기 결과를 직접 표시하지 않습니다. 또한, 2023년 이전 데이터는 CloudTrail Lake에서 Amazon CloudWatch로 마이그레이션할 수 없습니다. 2023년 이전 이벤트에 접근해야 하는 경우, CloudTrail Lake에서 직접 쿼리하거나 S3 버킷으로 데이터를 내보낼 수 있습니다. 자세한 내용은 [Exporting data from CloudTrail Lake Event Data Store to CloudWatch](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-export-cloudwatch.html) 문서와, AWS CloudTrail Lake 이벤트의 하위 집합을 Amazon S3로 내보내는 방법에 대한 [AWS 블로그](https://aws.amazon.com/blogs/mt/exporting-a-subset-of-aws-cloudtrail-lake-events-to-amazon-s3/)를 참조하세요.
:::

---

## 2단계 — 텔레메트리 활성화 규칙을 통한 새 CloudTrail 수집 활성화

CloudTrail Lake의 과거 데이터를 CloudWatch에서 접근할 수 있게 되었으므로, 다음 단계는 새로운 CloudTrail 이벤트를 [CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)로 직접 수집하는 것입니다. 이 단계는 기존 CloudTrail Trail이나 CloudTrail Lake 이벤트 데이터 스토어와 독립적으로 동작합니다. CloudTrail 활동이 CloudWatch로 유입되는 새로운 전용 경로를 구성합니다. CloudWatch의 [텔레메트리 구성](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) 기능을 사용하면 CloudWatch를 통해 CloudTrail 이벤트의 자동 수집을 설정할 수 있습니다. 활성화되면 모든 새 CloudTrail 이벤트가 다른 운영 및 보안 텔레메트리와 함께 전달되어, 통합 쿼리, 알림, 분석이 가능해집니다.

### CloudTrail을 위한 텔레메트리 활성화 규칙 생성 

1. [CloudWatch 콘솔](https://console.aws.amazon.com/cloudwatch/)을 엽니다.
1. 왼쪽 탐색 창에서 **Ingestion**을 클릭합니다.
1. **Enable Resource Discovery** 버튼을 클릭합니다.
1. CloudWatch가 필요한 서비스 연결 역할을 자동으로 생성합니다.
1. **Data Sources** 탭에서 사용 가능한 서비스 목록에서 **AWS CloudTrail**을 찾습니다.
1. **AWS CloudTrail** 옆의 **Configure telemetry**를 선택합니다.
1. **Specify Scope** 페이지에서 기본 **Rule name**을 그대로 두고 **Next**를 선택합니다. (**참고:** 조직 수준 규칙의 경우, 선택 설정에서 소스 계정 범위를 구성할 수 있습니다.)

    ![CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 규칙 추가 마법사를 보여주는 화면.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_03.png "CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 규칙 추가 마법사를 보여주는 화면.")

1. **Specify Destination** 페이지에서 다음 단계를 수행합니다:
    -   **Send to**는 기본값인 CloudWatch Logs를 그대로 둡니다.
    -   **Log group name pattern**은 기본값 `aws/cloudtrail/[event-type]`을 그대로 둡니다.
    -   **Retention period**는 규정 준수 요구 사항에 따라 보존 기간을 선택합니다. (**참고:** CloudWatch에서 CloudTrail로의 통합은 멤버 계정에 직접 로그를 전달합니다. 여기서 구성하는 보존 기간은 각 멤버 계정의 로그 그룹에 적용됩니다. 보존 기간은 소스 로그 그룹과 중앙 집중화된 로그 그룹에서 서로 다를 수 있습니다. 자세한 내용은 [CloudWatch Logs 중앙 집중화를 위한 로그 스토리지 비용 최적화](/guides/cloudtrail/CloudTrail%20Lake/cloudtrail_lake_to_cloudwatch#optimizing-log-storage-costs-for-cloudwatch-logs-centralization) 섹션을 참조하세요.)
1. **Next**를 선택합니다.

    ![CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 대상 지정 섹션을 보여주는 화면.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_04.png "CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 대상 지정 섹션을 보여주는 화면.")

1. **Select Data Options** 페이지에서 **Event type**으로 수집할 이벤트 유형을 선택합니다 — **Management events** 또는 **Data events** 중 선택합니다.

    ![CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 데이터 옵션 선택을 보여주는 화면.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_05.png "CloudWatch 텔레메트리 구성의 활성화 규칙 탭에서 CloudTrail 데이터 옵션 선택을 보여주는 화면.")

1. **Next**를 선택합니다.
1. **Review and Create** 페이지에서 구성 설정을 검토하고 **Configure CloudTrail enablement**를 선택합니다.

텔레메트리 구성 규칙이 생성되어 CloudTrail 이벤트 수집이 시작됩니다. 아래 명명 패턴에 따라 로그 그룹이 생성됩니다.

| 이벤트 유형        | 로그 그룹 이름 패턴              | 설명          |
|-------------------|-------------------------------------|----------------------|
| 관리 이벤트 | `aws/cloudtrail/managementevents`  | 모든 관리 이벤트 |
| 데이터 이벤트       | `aws/cloudtrail/dataevents`        | 모든 데이터 이벤트       |

### CloudTrail 수집 검증

CloudWatch로의 직접 CloudTrail 수집을 활성화한 후, CloudTrail Lake 이벤트 데이터 스토어와 CloudWatch 수집을 일정 기간 병행 운영하는 것을 권장합니다. 최소 하루 동안 CloudWatch 수집을 실행하여 모든 CloudTrail 이벤트가 예상대로 캡처되고 있는지 확인하세요. 검증에 더 많은 시간이 필요한 경우, 두 서비스를 병행 운영할 때 발생하는 잠재적 비용을 검토하고 진행하기 전에 AWS 계정 팀에 문의하여 안내를 받으세요. 검증이 성공적으로 완료되면 CloudTrail Lake 이벤트 데이터 스토어에서 수집을 중지할 수 있습니다.

:::info
자세한 내용은 [Working with telemetry enablement rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) 및 [Simplified enablement of CloudTrail events in CloudWatch](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)를 참조하세요.
:::

---

## 3단계 — 교차 계정/교차 리전 중앙 집중화 설정

CloudTrail Lake의 과거 데이터를 CloudWatch로 마이그레이션하고, 텔레메트리 활성화 규칙으로 CloudTrail 수집을 활성화했으니, 이제 통합 모니터링, 분석, 규정 준수를 위해 중앙 집중화된 계정으로 모든 것을 통합할 차례입니다.

각 개별 계정의 CloudWatch Unified Data Store에 CloudTrail 데이터가 유입되는 것은 첫 번째 단계이며, 모든 CloudTrail 활동을 단일 대상 계정으로 중앙 집중화하면 보안 팀, 규정 준수 팀, 인시던트 대응 담당자에게 전체 AWS 조직의 모든 API 활동에 대한 통합 뷰를 제공할 수 있습니다. 이는 보안 모니터링 및 인시던트 대응을 위한 단일 창이 됩니다.

[CloudWatch Logs 교차 계정 교차 리전 중앙 집중화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)는 [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)와 통합되어 중앙 집중화 규칙을 사용하여 여러 멤버 계정의 로그 데이터를 하나의 중앙 위치로 수집합니다. 여러 계정과 AWS 리전의 로그 데이터를 중앙 집중화된 계정으로 자동으로 복제하는 규칙을 정의할 수 있습니다.

각 멤버 계정은 로컬 접근 및 문제 해결을 위해 자체 로그 사본을 유지하며, 중앙 보안 및 규정 준수 팀은 조직 전체 가시성과 분석을 위한 통합된 사본을 별도로 받습니다.

### 중앙 집중화 아키텍처 이해

![CloudWatch 중앙 집중화 아키텍처](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/LogsCentralization.png "CloudWatch 중앙 집중화 아키텍처")

### 중앙 집중화를 위한 사전 요구 사항

- **[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)**가 설정되어 있고, 모든 소스/대상 계정이 조직에 속해 있어야 합니다.
- AWS Organizations에서 CloudWatch에 대한 **[Trusted access](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html)**가 활성화되어 있어야 합니다.

### 중앙 집중화 규칙 생성

1. 조직의 **Management** 또는 **Delegated Administrator** 계정에서 [**CloudWatch 콘솔**](https://console.aws.amazon.com/cloudwatch/home)로 이동합니다.
2. **Settings**를 선택합니다.
3. **Organization** 탭으로 이동합니다.
4. **Configure rule**을 선택합니다.
5. **Specify Source Details** 페이지에서 소스 세부 정보를 지정한 후 **Next**를 선택합니다:
    - **Centralization rule name**: 중앙 집중화 규칙의 고유 이름을 입력합니다 (예: `cloudtrail-centralization`).
    - **Source accounts**: 텔레메트리 데이터를 중앙 집중화할 계정을 선택하기 위한 소스 선택 기준을 정의합니다. Account ID, Organization Unit (OU) ID, 또는 전체 Organization 단위로 선택할 수 있습니다. **Builder** (클릭 기반) 또는 **Editor** (자유 텍스트) 모드를 사용하여 선택 기준을 제공할 수 있습니다.
        - 지원되는 키: `OrganizationId` | `OrganizationUnitId` | `AccountId` | `*`
        - 지원되는 연산자: `=` | `IN` | `OR`
    - **Source Regions**: 로그를 중앙 집중화할 리전을 선택합니다.

    ![로그 중앙 집중화를 위한 소스 세부 정보 지정](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_06.png "로그 중앙 집중화를 위한 소스 세부 정보 지정")

6. **Specify Destination** 페이지에서 대상 세부 정보를 지정한 후 **Next**를 선택합니다:
    - **Destination account**: 텔레메트리 데이터의 중앙 대상 역할을 하는 조직 내 계정을 선택합니다.
    - **Destination Region**: 중앙 집중화된 텔레메트리 데이터의 사본을 저장할 기본 리전을 선택합니다.
    - **Backup Region** (선택 사항): 기본 리전에 장애가 발생할 경우 데이터 가용성을 보장하기 위해, 대상 계정 내에서 로그의 동기화된 사본을 유지할 백업 리전을 선택합니다.

    ![로그 중앙 집중화를 위한 대상 세부 정보 지정](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_07.png "로그 중앙 집중화를 위한 대상 세부 정보 지정")

7. **Specify Telemetry Data** 페이지에서 다음 필드를 설정하여 텔레메트리 데이터를 지정한 후 **Next**를 선택합니다:
    - **Log groups**: CloudTrail 로그 그룹만 중앙 집중화하려면 **Filter log groups**를 선택합니다. **Builder** (클릭 기반) 또는 **Editor** (자유 텍스트) 모드를 사용하여 선택 기준을 제공할 수 있습니다.
        - **Data source selection criteria**: CloudWatch Logs가 로그에 자동으로 할당하는 데이터 소스 이름 및 유형을 기준으로 필터링합니다. CloudTrail의 경우: `DataSourceName = "aws_cloudtrail"`로 설정합니다. `DataSourceType`으로도 필터링하여 관리 이벤트나 데이터 이벤트 등 특정 이벤트 유형을 대상으로 지정할 수 있습니다.
     
    - **KMS Encrypted Log Groups**: KMS 암호화된 로그 그룹을 처리하기 위해 다음 옵션 중 하나를 선택합니다:
        - **대상 전용 고객 관리 KMS 키를 사용하여 고객 관리 KMS 키로 암호화된 소스 로그 그룹 중앙 집중화**: 제공된 대상 KMS 키 ARN을 사용하여 소스 계정의 암호화된 로그 그룹을 대상으로 중앙 집중화합니다. 이 옵션을 선택하면 대상 암호화 키 ARN을 제공해야 하며, 이전 단계에서 백업 리전을 선택한 경우 백업 대상 암호화 키 ARN도 제공해야 합니다. 지정된 KMS 키는 CloudWatch Logs의 암호화 권한을 가지고 있어야 합니다.
        - **대상 계정에서 AWS 소유 KMS 키로 고객 관리 KMS 키 암호화 로그 그룹 중앙 집중화**: 소스 계정의 KMS 암호화된 로그 그룹을 AWS 소유 KMS 키로 암호화된 대상 로그 그룹으로 중앙 집중화합니다.
        - **고객 관리 KMS 키로 암호화된 로그 그룹은 중앙 집중화하지 않음**: 고객 관리 KMS 키로 암호화된 소스 로그 그룹의 로그 이벤트 중앙 집중화를 건너뜁니다.

    ![로그 중앙 집중화를 위한 텔레메트리 데이터 지정](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_08.png "로그 중앙 집중화를 위한 텔레메트리 데이터 지정")

    :::info
    **Log group selection criteria**를 사용하여 로그 그룹 이름별 추가 필터링도 가능합니다. 자세한 내용은 [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)을 참조하세요.
    :::

8. **Review and Configure** 페이지에서 중앙 집중화 규칙을 검토하고, 필요시 최종 수정을 한 후 **Create Centralization policy**를 선택합니다.

중앙 집중화 규칙이 생성되고 활성화되면, 로그 이벤트가 중앙 계정으로 통합되기 시작합니다. 동일한 이름의 로그 그룹은 로그 관리 간소화를 위해 병합되며, 로그 스트림에는 원본 소스 계정 ID와 소스 리전 식별자가 추가됩니다. 또한, 로그 이벤트에는 새로운 시스템 필드(@aws.account 및 @aws.region)가 추가되어 로그 데이터의 출처를 명확하게 추적할 수 있습니다.

:::info
CloudWatch 로그 중앙 집중화 기능은 중앙 집중화 규칙을 생성한 이후에 소스 계정에 도착하는 새 로그 데이터만 처리합니다. 과거 로그 데이터(규칙 생성 이전에 존재하던 로그)는 중앙 집중화되지 않습니다.
:::

### 중앙 집중화 규칙 검증

**규칙 상태 확인:**

1. **CloudWatch** → **Settings** → **Organization** 탭 → **Manage rules**로 이동합니다.
2. 규칙 상태가 **HEALTHY**인지 확인합니다.

**중앙 집중화 메트릭 모니터링:**

- **IncomingCopiedBytes**: 대상 계정으로 복제된 비압축 로그 데이터 볼륨 (0이 아닌 일관된 값이어야 합니다)
- **IncomingCopiedLogEvents**: 대상 계정으로 복제된 로그 이벤트 수
- **OutgoingCopiedBytes**: 소스 계정에서 대상 계정으로 전송된 비압축 로그 데이터 볼륨
- **OutgoingCopiedLogEvents**: 소스 계정에서 대상 계정으로 전송된 로그 이벤트 수
- **CentralizationError**: 복제 중 발생한 오류 수 — 0이어야 하며, 오류 발생 시 알람을 설정하세요
- **CentralizationThrottled**: 중앙 집중화 처리가 스로틀링된 횟수 — 복제에 영향을 줄 수 있는 스로틀링을 모니터링하세요

### CloudWatch Logs 중앙 집중화를 위한 로그 스토리지 비용 최적화

CloudWatch Logs 중앙 집중화는 여러 계정과 리전의 로그를 관리하기 위한 비용 효율적인 가격 구조를 제공합니다. 첫 번째 중앙 집중화 로그 사본에는 추가 수집 요금이나 교차 리전 데이터 전송 비용이 발생하지 않으며, 표준 CloudWatch 스토리지 비용과 기능 가격만 부과됩니다. 첫 번째 중앙 집중화 이후 추가 사본에는 GB당 추가 요금이 부과됩니다(백업 리전 기능 사용 시에도 추가 사본이 생성됩니다). 현재 가격 세부 정보는 [CloudWatch 가격 페이지](https://aws.amazon.com/cloudwatch/pricing/)를 참조하세요. CloudWatch Logs 중앙 집중화 사용 시 비용을 최적화하기 위해 다음 모범 사례를 구현하는 것을 권장합니다:

1. **계층형 보존 전략 구현**

    이중 계층 보존 정책을 구현하면 스토리지 비용을 크게 절감할 수 있습니다.

    - 소스 계정에는 즉각적인 운영 요구를 처리하기 위해 단기 보존 기간(**7~30일**)을 구성합니다.
    - 중앙 집중화된 계정에는 규정 준수 요구 사항과 과거 분석을 지원하기 위해 더 긴 보존 기간(**90일 이상**)을 설정합니다.

2. **선택적 중앙 집중화 활용**

    로그의 추가 사본을 생성할 때는 전략적으로 접근하세요:

    - **로그 그룹 필터**를 활용하여 특정 애플리케이션이나 서비스만 중앙 집중화합니다.
    - 비즈니스 요구 사항에 부합하는 로그만 식별하여 중앙 집중화합니다.
    - 특정 사용 사례에 해당하지 않는 불필요한 로그 데이터의 중앙 집중화를 피합니다.

3. **백업 전략**

    백업 전략을 계획할 때 다음 사항을 고려하세요:

    - 백업 사본은 추가 사본으로 취급되어 GB당 추가 요금이 부과된다는 점에 유의하세요. 현재 요금은 [CloudWatch 가격 페이지](https://aws.amazon.com/cloudwatch/pricing/)를 참조하세요.
    - 중앙 계정에서 전용 백업이 필요한 특정 요구 사항이 있는 경우에만 백업 중앙 집중화를 활성화합니다.
    - 추가 요금을 없애기 위해 소스 계정을 백업 사본으로 활용하는 것을 고려하세요.

이러한 최적화 전략을 구현하면 효과적인 로그 관리를 유지하면서 비용을 통제할 수 있습니다.


### CloudTrail Lake 수집 중지

CloudWatch로의 CloudTrail 이벤트 수집을 활성화하고 최소 24시간 동안 이벤트가 올바르게 유입되는 것을 확인한 후에는, CloudTrail Lake 이벤트 데이터 스토어에 대한 수집을 비활성화할 차례입니다. 이렇게 하면 두 서비스 간의 중복 수집 요금을 방지할 수 있습니다. 새 수집을 중지한 후에도 CloudTrail Lake의 과거 데이터는 쿼리를 위해 완전히 접근 가능합니다.

1. **CloudTrail 콘솔** → **Lake** → **Event data stores**로 이동합니다.
2. **Event Data Store**를 선택합니다.
3. **Stop ingestion**을 선택합니다 (기존 데이터는 쿼리를 위해 보존됩니다).
4. 작업을 확인합니다.

:::info
수집을 중지해도 기존 데이터는 삭제되지 않습니다. 보존 기간이 만료되거나 EDS를 삭제할 때까지 CloudTrail Lake에서 과거 데이터를 계속 쿼리할 수 있습니다.
:::
---

### CloudWatch Unified Data Store를 사용한 보안 가시성 대시보드

CloudWatch에 중앙 집중화된 CloudTrail 데이터를 활용하면, `@data_source_name`과 같은 CloudWatch Unified Data Store 기본 패싯을 사용하여 로그 그룹 이름에 의존하지 않고 모든 로그 그룹에서 CloudTrail 활동을 동적으로 검색하고 쿼리하는 사전 구축된 CloudWatch 대시보드를 배포할 수 있습니다. 이 대시보드는 API 활동 패턴, 보안 이벤트, 규정 준수 상태에 대한 거의 실시간 가시성을 제공하며, 인시던트 조사 시 교차 서비스 상관 분석을 위해 CloudTrail과 VPC Flow Log 데이터를 나란히 배치합니다.

AWS CloudFormation을 사용한 단계별 배포 가이드, 대시보드 위젯 설명 및 쿼리 설명은 [Security Visibility Dashboard using CloudWatch Unified Data Store](https://aws-samples.github.io/solutions/AWS%20CloudTrail/security-dashboard-uds)를 참조하세요.

---

## 쿼리 변환 가이드 — CloudTrail Lake SQL에서 CloudWatch Logs Insights로

마이그레이션에서 가장 중요한 측면 중 하나는 기존 CloudTrail Lake SQL 쿼리를 CloudWatch Logs Insights에 해당하는 쿼리로 변환하는 것입니다. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)는 **Logs Insights QL**, **OpenSearch PPL**, **OpenSearch SQL**의 세 가지 쿼리 언어를 지원하여 데이터 쿼리 방식에 유연성을 제공합니다.

:::info
CloudWatch Logs Insights는 자연어 쿼리 생성을 지원합니다. 찾고자 하는 내용을 일반 영어로 설명하면 AI 지원 기능이 쿼리를 생성하고 줄별 설명을 제공합니다. 이 기능은 복잡한 CloudTrail Lake SQL 쿼리를 변환할 때 특히 유용합니다.
:::

---

## 마이그레이션된 환경의 보안 모범 사례

CloudWatch에서 CloudTrail 데이터를 보호하려면 IAM 정책, 암호화, 삭제 보호, 리소스 기반 정책, 지속적 모니터링을 결합한 포괄적이고 다층적인 접근 방식이 필요합니다. 적절한 보안 제어를 통해 로그 데이터가 취약점이 아닌 감사 및 규정 준수를 위한 자산으로 유지되도록 보장할 수 있으며, 최소 권한 접근, 데이터 분류 기반 로그 그룹 설계, 중요한 감사 추적의 우발적 또는 악의적 삭제에 대한 보호를 다룹니다.

이러한 제어를 구현하는 방법에 대한 자세한 가이드(로그 그룹 계층 구조 설계, 세분화된 권한 관리, 암호화 모범 사례 포함)는 [Security Best Practices for CloudWatch Logs](/tools/logs/security/cloudwatch-logs-security-best-practices/)를 참조하세요.
