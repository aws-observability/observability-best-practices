---
sidebar_position: 1
---
# 중앙 집중식 패치 준수 보고

## 패치 준수란?

패치 준수는 조직 정책에 따라 모든 컴퓨팅 리소스에 최신 보안 업데이트 및 버그 수정이 설치되었는지 확인하는 프로세스입니다. 패치 기준선에 정의된 모든 필수 패치가 성공적으로 적용되면 시스템은 "패치 준수" 상태로 간주됩니다. 비준수 시스템에는 중요한 보안 업데이트가 누락되어 있을 수 있으며, 이로 인해 악의적인 행위자가 악용할 수 있는 보안 취약성에 조직이 노출될 수 있습니다.

여러 AWS 계정과 리전에 걸친 현대 클라우드 환경에서 분산 패치 관리는 가시성 격차, 일관성 없는 보고, 취약성에 대한 지연된 대응, 복잡한 감사 프로세스, 팀 간 중복 노력 등 상당한 문제를 야기합니다. 이러한 문제는 보안 노출 기간을 연장하고 조직 전체의 리소스 비효율적 사용으로 이어질 수 있습니다.

중앙 집중식 패치 준수 보고는 모든 계정과 리전의 데이터를 단일 위치로 통합하여 보안 상태에 대한 포괄적인 뷰를 제공함으로써 이러한 문제를 해결합니다. 이 접근 방식은 준수 상태에 대한 단일 정보 소스, 취약성에 대한 실시간 인식, 환경 간 일관된 메트릭, 간소화된 감사, 추세 분석 기능, 향상된 리소스 효율성, 자동화된 교정 워크플로우의 기반 등 다양한 이점을 제공합니다.

AWS Systems Manager는 패치 프로세스를 자동화하는 Patch Manager, 준수 데이터를 중앙 S3 버킷으로 집계하는 [리소스 데이터 동기화](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html), 데이터를 변환, 쿼리, 시각화하는 AWS Glue, Amazon Athena, Amazon QuickSight와 같은 분석 서비스를 통해 이 중앙 집중화의 기반을 제공합니다. 이 레시피에서 설명하는 솔루션은 이러한 구성 요소를 활용하여 전체 AWS 조직에서 작동하는 포괄적인 보고 시스템을 구축하여 더 효율적인 운영과 빠른 취약성 교정을 가능하게 합니다.

:::tip
리소스 데이터 동기화는 JSON 파일 형태로 인벤토리 및 패치 준수 메타데이터를 제공합니다. Athena와 QuickSight를 사용하는 대신 S3 버킷에서 데이터를 가져올 수 있는 모든 BI 또는 분석 도구를 사용할 수 있습니다.
:::

## 목적

이 레시피의 목적은 중앙 집중식 패치 준수 보고에 필요한 리소스를 프로비저닝하는 데 사용할 수 있는 샘플 CloudFormation 템플릿을 제공하는 것입니다. 이 레시피에서는 패치 스캔 또는 설치 작업 배포는 다루지 않습니다.

관리형 노드 패치 준비에 대한 자세한 내용은 [AWS Systems Manager 및 태깅을 사용한 관리형 노드 패치](/guides/centralized-operations-management/patch-nodes-using-tags/)를 참조하세요.

## 사전 요구 사항

배포를 시작하기 전에 다음을 확인하세요:

* AWS Organizations 설정: 관리 계정과 멤버 계정이 있는 올바르게 구성된 AWS Organization.
* 관리형 노드 구성: Amazon Elastic Compute Cloud(EC2) 인스턴스, AWS Internet of Things(IoT) Greengrass 코어 디바이스, 온프레미스 서버, 엣지 디바이스 및 VM이 패치 작업을 수행하고 패치 준수를 보고하려면 Systems Manager 관리형 노드여야 합니다.
* 패치 작업 구현: 최소한 패치 스캔 작업이 한 번 이상 구성 및 실행되어야 합니다. 이것이 없으면 보고할 준수 데이터가 없습니다. 다양한 패치 유형과 패치 구현 방법에 대한 자세한 내용은 [패치 관리 모범 사례 가이드](/guides/centralized-operations-management/patch-management) 및 [다양한 패치 유형](/guides/centralized-operations-management/patch-management#different-types-of-patching) 섹션을 참조하세요.
* IAM 권한: CloudFormation 템플릿을 배포하고 중앙 보고 계정과 멤버 계정 모두에서 필요한 리소스를 생성할 수 있는 적절한 권한.
* Amazon QuickSight: QuickSight를 사용하여 패치 준수 정보를 시각화하려면 [QuickSight에 가입](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html)해야 합니다.
* Amazon QuickSight의 S3 권한: [Phase 1: 중앙 계정 설정](#phase-1-central-account-setup)에서 생성된 S3 버킷에 대한 QuickSight 권한을 확인해야 합니다. 자세한 내용은 [QuickSight용 CloudFormation 템플릿 배포 전 완료해야 할 사전 요구 사항](#prerequisites-to-complete-before-deploying-the-cloudformation-template-for-quicksight)에서 제공됩니다.

## 고려 사항

### 리소스 데이터 동기화

현재 AWS CloudFormation의 `AWS::SSM::ResourceDataSync` 리소스는 간소화된 S3 버킷 정책을 지원하는 인벤토리 리소스 데이터 동기화를 생성하는 데 필요한 [S3Destination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-ssm-resourcedatasync-s3destination.html) 속성 내의 `DestinationDataSharing` 속성을 지원하지 않습니다.

이로 인해 이 레시피는 [조직 리소스 데이터 동기화용 샘플 CloudFormation 템플릿](#sample-cloudformation-template-for-organization-resource-data-sync) 섹션에서 Lambda 함수를 사용하여 리소스 데이터 동기화를 생성하는 사용자 지정 CloudFormation 리소스를 사용합니다.

사용자 지정 리소스를 사용하여 리소스 데이터 동기화를 생성하는 것의 대안:

1. CloudFormation에서 지원하는 표준 리소스 데이터 동기화를 사용합니다.
    1. 이를 위해서는 AWS 계정 ID를 기반으로 권한을 부여하는 버킷 정책을 생성하고 사용해야 합니다. 자세한 내용과 S3 버킷 정책 예제는 [시작하기 전에](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html#datasync-before-you-begin)를 참조하세요.
    1. [Athena를 사용한 중앙 보고용 샘플 CloudFormation 템플릿](#sample-cloudformation-template-for-central-reporting-using-athena)의 S3 버킷 정책을 AWS 계정 ID를 나열하는 새 정책으로 업데이트합니다.
    1. CloudFormation StackSet을 사용하여 `AWS::SSM::ResourceDataSync` 리소스를 배포합니다. CloudFormation 리소스 스니펫 예제는 [SyncToDestination 리소스 데이터 동기화 생성](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-ssm-resourcedatasync.html#aws-resource-ssm-resourcedatasync--examples--Create_a_SyncToDestination_resource_data_sync)을 참조하세요.
1. 조직 리소스 데이터 동기화를 생성하는 대체 방법을 사용합니다(예: AWS CLI 또는 기타 SDK를 통한 스크립팅).

### 비용 고려 사항

중앙 집중식 패치 준수 보고 구현에는 각각 관련 비용이 있는 여러 AWS 서비스가 포함됩니다:

1. [Amazon S3 요금](https://aws.amazon.com/s3/pricing/):
    * 인벤토리 및 패치 준수 데이터의 표준 스토리지 비용
    * 여러 계정 및 리전에서 데이터 동기화를 위한 데이터 전송 비용
      * 관리형 노드 수 및 스캔 빈도에 따라 비용이 선형적으로 증가
1. [AWS Glue 요금](https://aws.amazon.com/glue/pricing/):
    * 크롤러 비용
    * 기본 구성(일일 크롤러 실행)의 경우
1. [Amazon Athena 요금](https://aws.amazon.com/athena/pricing/):
    * 쿼리 비용
    * 쿼리 복잡성 및 빈도에 따라 비용이 다름
    * 파티셔닝 및 필터링 사용으로 비용을 크게 줄일 수 있음
1. [AWS Lambda 요금](https://aws.amazon.com/lambda/pricing/):
    * 사용자 지정 리소스 Lambda 함수의 최소 비용
    * 대부분의 구현에서 프리 티어로 충분
1. [Amazon QuickSight 요금](https://aws.amazon.com/quicksight/pricing/) (선택 사항):
    * 저자 라이선스 및 독자 라이선스

## 아키텍처 개요

### 중앙 보고 계정

다음 다이어그램에서 **Central Reporting** 계정은 패치 및 인벤토리 메타데이터를 저장하고 쿼리 또는 시각화하기 위한 AWS Organization 내의 전용 AWS 계정입니다.

:::warning
[AWS Organization 관리 계정](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html)을 **Central reporting 계정**으로 사용하는 것은 **권장되지 않습니다**. [관리 계정에 대한 AWS 모범 사례](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html#bp_mgmt-acct_use-mgmt)에서는 해당 계정에서만 수행해야 하는 작업에 대해서만 관리 계정과 그 사용자 및 역할을 사용할 것을 권장합니다. 모든 AWS 리소스를 조직의 다른 AWS 계정에 저장하고 관리 계정에서는 제외하세요.
:::

![중앙 보고 계정 아키텍처](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "중앙 보고 계정 아키텍처")

1. Glue 크롤러가 하루에 한 번 실행되어 리소스 데이터 동기화로 제공된 메타데이터가 호스팅된 S3 버킷을 크롤링합니다.
1. Glue 크롤러가 S3 버킷의 메타데이터를 기반으로 데이터베이스와 테이블을 업데이트합니다.
1. Glue 크롤러 실행이 완료되면 EventBridge로 이벤트가 전송됩니다.
1. EventBridge 규칙이 Lambda 함수를 호출합니다.
1. Lambda 함수가 AWS:InstanceInformation 테이블의 중복 열을 제거합니다.
    :::info
    `AWS:InstanceInformation` 테이블에는 파티션 키이기도 한 `resourcetype`이라는 열이 포함되어 있어 Athena 쿼리가 실패할 수 있습니다. EventBridge 규칙은 Glue 크롤러 실행에 의해 트리거되며, Lambda 함수를 호출하여 해당 열을 삭제합니다.
    :::
1. Athena가 실행하는 쿼리를 기반으로 Glue 데이터베이스와 테이블을 쿼리합니다.
1. (선택 사항) 패치 준수 정보를 시각화하는 QuickSight 대시보드를 생성할 수 있습니다. **참고:** QuickSight는 예제 CloudFormation 템플릿에 포함되어 있지 않습니다.

### 관리형 노드가 있는 멤버 계정/리전

![AWS Organization 리소스 데이터 동기화 아키텍처](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "AWS Organization 리소스 데이터 동기화 아키텍처")

1. 위임된 관리자 계정의 CloudFormation StackSet이 대상 AWS 계정/리전에 스택 인스턴스를 생성하여 필요한 리소스를 생성합니다.
1. 스택 인스턴스가 IAM 서비스 역할, Lambda 함수 및 사용자 지정 CloudFormation 리소스를 생성합니다.
1. Lambda 함수가 AWS Organizations용 Systems Manager 리소스 데이터 동기화를 생성합니다.
1. 리소스 데이터 동기화가 [중앙 보고 계정](#central-reporting-account)에 지정된 S3 버킷으로 인벤토리 및 패치 준수 메타데이터를 전송합니다.

### 프로세스 타임라인

다음 다이어그램은 관리형 노드의 패치 준수를 쿼리하는 프로세스 타임라인을 표시합니다.

![패치 작업 프로세스 타임라인](/img/cloudops/recipes/central-reporting/architecture-diagram-org-patch-reporting-combined.png "패치 작업 프로세스 타임라인")

1. 패치 스캔, 설치 또는 인벤토리 메타데이터 수집 작업 후, 관리형 노드의 SSM 에이전트가 Systems Manager로 데이터를 보고합니다.
1. 수행된 작업을 기반으로 리소스 데이터 동기화가 패치 및 인벤토리 메타데이터 업데이트를 식별합니다.
1. 리소스 데이터 동기화가 중앙 보고 계정에 지정된 S3 버킷으로 메타데이터를 전송합니다.
1. 작업 후 Athena를 사용하여 결과를 쿼리할 수 있습니다.

위 다이어그램에서 언급한 바와 같이, 패치 또는 인벤토리 메타데이터 수집을 위해 하이브리드 관리형 노드를 등록할 수 있으며 데이터는 EC2 인스턴스와 동일한 S3 버킷으로 흐릅니다.

## 배포 단계

### 배포 체크리스트

다음은 이 레시피에 포함된 배포 단계의 체크리스트입니다.

#### 중앙 보고 계정 작업

* [ ] Athena 리소스용 CloudFormation 스택 배포
* [ ] 스택 출력에서 S3 버킷 이름 확인
* [ ] S3 버킷에 대한 QuickSight 권한 구성
* [ ] QuickSight 시각화용 CloudFormation 스택 배포
* [ ] QuickSight 분석 접근 확인

#### 멤버 계정 작업 (StackSet 사용)

* [ ] 조직 리소스 데이터 동기화 CloudFormation StackSet 배포
* [ ] 멤버 계정에서 리소스 데이터 동기화 생성 확인

### Phase 1: 중앙 계정 설정

#### Athena를 사용한 중앙 보고용 샘플 CloudFormation 템플릿

CloudFormation 템플릿으로 생성되는 리소스와 그 용도에 대한 세부 정보는 아래에서 확인할 수 있습니다.

[Athena를 사용한 중앙 보고용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

| 리소스 이름 | 용도 |
| -------- | ------ |
| **KMS 리소스** | |
| ManagedInstanceDataEncryptionKey | 리소스 데이터 동기화 S3 버킷에서 관리형 노드 메타데이터를 암호화하는 고객 관리형 키(CMK). |
| ManagedInstanceDataEncryptionKeyAlias | CMK의 별칭. |
| **S3 리소스** | |
| AthenaQueryResultsBucket | Athena 쿼리 결과를 저장하는 S3 버킷. |
| ResourceSyncBucket | 리소스 데이터 동기화로 제공된 관리형 노드 메타데이터를 저장하는 S3 버킷. |
| ResourceSyncBucketPolicy | 리소스 데이터 동기화 S3 버킷의 S3 버킷 정책. |
| **Glue 리소스** | |
| GlueDatabase | 리소스 데이터 동기화 메타데이터용 Glue 데이터베이스. |
| GlueCrawler | 데이터베이스와 테이블을 생성하는 Glue 크롤러. |
| GlueCrawlerRole | Glue 크롤러가 사용하는 IAM 역할. |
| DeleteGlueTableColumnFunctionRole | DeleteGlueTableColumnFunction Lambda 함수용 IAM 역할. |
| DeleteGlueTableColumnFunction | 중복 `resourcetype` 파티션 키를 제거하는 Lambda 함수. |
| DeleteGlueTableColumnFunctionEventRule | DeleteGlueTableColumnFunction Lambda 함수를 호출하는 Amazon EventBridge 규칙. |
| DeleteGlueTableColumnFunctionCloudWatchPermission | EventBridge에 DeleteGlueTableColumnFunction Lambda 함수를 호출할 권한 부여. |
| **Athena 리소스** | |
| AthenaWorkGroup | 명명된 쿼리용 Athena 워크그룹. |
| AthenaQueryCompliantPatch | 패치 준수 관리형 노드를 나열하는 예제 쿼리. |
| AthenaQueryNonCompliantPatch | 패치 비준수 관리형 노드를 나열하는 예제 쿼리. |
| AthenaQueryComplianceSummaryPatch | 관리형 노드의 패치 준수 요약을 제공하는 예제 쿼리. |
| AthenaQueryPatchSummary | 관리형 노드의 패치 요약을 제공하는 예제 쿼리. |
| AthenaQueryInstanceList | 종료되지 않은 관리형 노드 목록을 반환하는 예제 쿼리. |
| AthenaQueryInstanceApplications | 종료되지 않은 관리형 노드와 설치된 애플리케이션 목록을 반환하는 예제 쿼리. |
| AthenaQuerySSMAgent | 관리형 노드에 설치된 SSM Agent 버전을 나열하는 예제 쿼리. |
| **S3 정리 리소스** | |
| S3CleanupLambdaExecutionRole | S3 버킷을 정리하는 IAM 역할 |
| S3BucketCleanup | S3 버킷을 정리하는 Lambda 함수 |
| S3Cleanup | S3 버킷을 정리하는 사용자 지정 리소스 |

#### 중앙 보고 계정에서 Athena용 CloudFormation 스택 배포

1. [Athena를 사용한 중앙 보고용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)을 로컬 머신에 다운로드합니다.
1. 중앙 보고 계정 및 리전에서 [AWS CloudFormation 콘솔](https://console.aws.amazon.com/cloudformation/home)로 이동합니다.
1. 왼쪽 탐색 창에서 **Stacks**를 선택한 다음 **Create stack**을 선택합니다.
1. 드롭다운 목록에서 **With new resources (standard)**를 선택합니다.
1. **Create stack** 페이지에서 **Upload a template file**을 선택하고, **Choose file**을 선택한 후 `patch-reporting.yaml` 파일을 선택하고 **Next**를 선택합니다.
1. **Specify stack details** 페이지에서 다음 단계를 수행합니다:
    1. **Stack name**에 `patch-reporting`과 같은 설명적인 이름을 입력합니다.
    1. **Organization ID**에 AWS Organization의 AWS Organization ID를 입력합니다. 예: `o-abcde12345`.
    :::tip
    AWS Organization ID를 검색하는 방법에 대한 자세한 내용은 [관리 계정에서 조직 세부 정보 보기](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_view_org.html)를 참조하세요.
    :::
    1. **Enable Glue Crawler Schedule**에서 Glue 크롤러의 예약 실행을 활성화하거나 비활성화합니다.
    1. **Glue Crawler Schedule (cron)**에 Glue 크롤러의 cron 일정 표현식을 입력합니다.
    1. **Enable KMS permissions for QuickSight service role**에서 QuickSight IAM 서비스 역할에 대한 KMS 권한을 활성화하거나 비활성화합니다. **참고**: KMS 권한을 부여하지 않으면 QuickSight를 사용하여 패치 준수 데이터를 시각화할 수 없습니다.
    1. **Next**를 선택합니다.
1. **Configure stack options** 페이지에서 필요한 태그를 추가하고, **I acknowledge that AWS CloudFormation might create IAM resources with custom names**를 선택한 후 **Next**를 선택합니다.
1. **Review and create** 페이지에서 모든 정보를 검토한 후 **Submit**을 선택하여 스택을 생성합니다.

페이지가 새로 고쳐지면 스택 상태가 `CREATE_IN_PROGRESS`여야 합니다. 상태가 `CREATE_COMPLETE`로 변경되면 QuickSight 시각화를 배포할 수 있습니다.

:::tip
CloudFormation 스택의 **Outputs** 탭에서 찾을 수 있는 **AthenaQueryResultsBucket** 및 **ResourceDataSyncBucketName**의 Amazon S3 버킷 이름을 기록하세요. 다음 섹션에서 QuickSight를 배포하려면 이 두 값이 필요합니다.

![리소스 데이터 동기화 S3 버킷 이름을 보여주는 CloudFormation 스택 출력](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "리소스 데이터 동기화 S3 버킷 이름을 보여주는 CloudFormation 스택 출력")
:::

#### Amazon QuickSight 시각화용 샘플 CloudFormation 템플릿

CloudFormation 템플릿으로 생성되는 리소스와 그 용도에 대한 세부 정보는 아래에서 확인할 수 있습니다.

[Amazon QuickSight 시각화용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

| 리소스 이름 | 용도 |
| -------- | ------ |
| SSMDataSyncSource | Athena 워크그룹 patch-workgroup을 가리키는 QuickSight 데이터 소스. |
| ApplicationDataSet | 애플리케이션 메타데이터용 QuickSight 데이터셋 |
| ComplianceItemDataSet | 준수 항목 메타데이터용 QuickSight 데이터셋 |
| ComplianceSummaryDataSet | 준수 요약 메타데이터용 QuickSight 데이터셋 |
| InstanceDetailedInformationDataSet | 인스턴스 상세 정보 메타데이터용 QuickSight 데이터셋 |
| InstanceInformationDataSet | 인스턴스 정보 메타데이터용 QuickSight 데이터셋 |
| TagDataSet | 태그 메타데이터용 QuickSight 데이터셋 |
| JoinedDataSet | aws_instanceinformation, aws_compliancesummary, aws_tag를 조인하는 QuickSight 데이터셋 |
| ManagedNodeAnalysis | QuickSight 분석 대시보드 |

:::tip
샘플 CloudFormation 템플릿은 데이터 소스의 거의 실시간 쿼리를 허용하는 `DIRECT_QUERY` 방법을 사용합니다. 대안으로 SPICE를 사용하여 QuickSight에서 데이터를 캐시할 수 있습니다. SPICE를 사용하는 경우 샘플 템플릿에는 551-647행에 예제 새로 고침 일정도 포함되어 있습니다. 어떤 모드를 사용할지에 대한 자세한 내용은 [Best practices for Amazon QuickSight SPICE and direct query mode](https://aws.amazon.com/blogs/business-intelligence/best-practices-for-amazon-quicksight-spice-and-direct-query-mode/)를 참조하세요.
:::

#### QuickSight용 CloudFormation 템플릿 배포 전 완료해야 할 사전 요구 사항

QuickSight가 패치 준수 및 인벤토리 메타데이터에 접근하려면 [중앙 보고 계정에서 Athena용 CloudFormation 스택 배포](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account)에서 생성된 S3 버킷 `ssm-res-sync-athena-query-results-us-east-1-$AccountId` 및 `ssm-resource-sync-us-east-1-$AccountId`에 대한 QuickSight 접근 권한을 부여해야 합니다.

![S3 버킷에 대한 QuickSight 권한](/img/cloudops/recipes/central-reporting/quicksight-athena-resources.png "S3 버킷에 대한 QuickSight 권한")

접근 권한 부여 방법에 대한 자세한 내용은 [Amazon S3에 연결할 수 없음](https://docs.aws.amazon.com/quicksight/latest/user/troubleshoot-connect-S3.html)을 참조하세요.

#### 중앙 보고 계정에서 QuickSight용 CloudFormation 스택 배포

1. [Amazon QuickSight 시각화용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)을 로컬 머신에 다운로드합니다.
1. 중앙 보고 계정 및 리전에서 [AWS CloudFormation 콘솔](https://console.aws.amazon.com/cloudformation/home)로 이동합니다.
1. 왼쪽 탐색 창에서 **Stacks**를 선택한 다음 **Create stack**을 선택합니다.
1. 드롭다운 목록에서 **With new resources (standard)**를 선택합니다.
1. **Create stack** 페이지에서 **Upload a template file**을 선택하고, **Choose file**을 선택한 후 `quicksight.yaml` 파일을 선택하고 **Next**를 선택합니다.
1. **Specify stack details** 페이지에서 다음 단계를 수행합니다:
    1. **Stack name**에 `quicksight`와 같은 설명적인 이름을 입력합니다.
    1. **QuickSightUser**에 QuickSight 데이터 소스 및 분석 대시보드에 대한 권한을 부여받을 QuickSight 사용자의 이름을 입력합니다.
    1. **Workgroup**은 기본값 `patch-workgroup`을 그대로 둡니다.
    1. **Next**를 선택합니다.
1. **Configure stack options** 페이지에서 필요한 태그를 추가하고 **Next**를 선택합니다.
1. **Review and create** 페이지에서 모든 정보를 검토한 후 **Submit**을 선택하여 스택을 생성합니다.

페이지가 새로 고쳐지면 스택 상태가 `CREATE_IN_PROGRESS`여야 합니다. 상태가 `CREATE_COMPLETE`로 변경되면 멤버 계정/리전에 리소스 데이터 동기화를 배포합니다.

### Phase 2: 멤버 계정 구성

#### 조직 리소스 데이터 동기화용 샘플 CloudFormation 템플릿

CloudFormation 템플릿으로 생성되는 리소스와 그 용도에 대한 세부 정보는 아래에서 확인할 수 있습니다.

[조직 리소스 데이터 동기화용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

| 리소스 이름 | 용도 |
| -------- | ------ |
| **리소스 데이터 동기화 리소스** | |
| ResourceDataSyncLambdaRole | 조직 리소스 데이터 동기화를 생성하기 위한 Lambda용 IAM 서비스 역할 |
| ResourceDataSyncLambdaFunction | 조직 리소스 데이터 동기화를 생성하는 Lambda 함수 |
| ResourceDataSyncCustomResource | Lambda 함수를 호출하는 CFN 사용자 지정 리소스 |

#### CloudFormation StackSet 배포

다음 연습에서는 CloudFormation의 위임된 관리자 계정을 사용하여 AWS Organization 호환 리소스 데이터 동기화를 배포하기 위해 [서비스 관리형 권한](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-associate-stackset-with-org.html)이 있는 StackSet을 배포합니다.

1. [조직 리소스 데이터 동기화용 샘플 CloudFormation 템플릿](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organizational-resource-data-sync.yaml)을 로컬 머신에 다운로드합니다.
1. CloudFormation의 위임된 관리자 계정에서 [AWS CloudFormation 콘솔](https://console.aws.amazon.com/cloudformation/home)로 이동합니다.
1. 왼쪽 탐색 창에서 **StackSets**를 선택한 다음 **Create StackSet**을 선택합니다.
1. **Choose a template** 페이지에서 다음 단계를 수행합니다:
    1. **Permission model**에서 기본 옵션 **Service-managed permissions**를 선택합니다.
    1. **Prerequisite - Prepare template**에서 기본 옵션 **Template is ready**를 선택합니다.
    1. **Specify template**에서 **Upload a template file**을 선택하고, **Choose file**을 선택한 후 `organization-resource-data-sync.yaml` 파일을 선택하고 **Next**를 선택합니다.
1. **Specify StackSet details** 페이지에서 다음 단계를 수행합니다:
    1. **StackSet name**에 `org-resource-data-sync`와 같은 설명적인 이름을 입력합니다.
    1. **Name of the resource data sync S3 bucket**에 이전 섹션에서 생성한 S3 버킷의 이름을 입력합니다.
    :::tip
    중앙 보고 계정에서 프로비저닝된 CloudFormation 스택의 **Outputs**에서 S3 버킷 이름을 찾을 수 있습니다.
    ![리소스 데이터 동기화 S3 버킷 이름을 보여주는 CloudFormation 스택 출력](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "리소스 데이터 동기화 S3 버킷 이름을 보여주는 CloudFormation 스택 출력")
    :::
    1. **Prefix for the resource data sync S3 bucket**에 S3 버킷에 사용할 프리픽스 이름(예: `ResourceDataSync`)을 입력합니다.
    1. **AWS Region for the resource data sync S3 bucket**에 리소스 데이터 동기화 S3 버킷의 리전을 입력합니다.
    1. **Name of the resource data sync**에 리소스 데이터 동기화의 이름을 입력합니다.
    1. **Next**를 선택합니다.
1. **Configure StackSet options** 페이지에서 필요한 태그를 추가하고 **I acknowledge that AWS CloudFormation might create IAM resources**를 선택한 후 **Next**를 선택합니다.
1. **Set deployment options** 페이지에서 다음 단계를 수행합니다:
    1. **Deployment targets**에서 조직 또는 특정 조직 단위(OU)에 배포하도록 선택합니다.
    :::tip
    쿼리, 보고 및 시각화를 위해 사용 가능한 모든 인벤토리 및 패치 메타데이터가 단일 S3 버킷에 집계되도록 AWS Systems Manager가 관리하는 노드가 있는 모든 계정 및 리전에 리소스 데이터 동기화를 배포하는 것이 좋습니다.
    :::
    1. **Specify Regions**에서 리소스 데이터 동기화를 배포할 리전을 선택합니다.
    1. 다른 모든 옵션은 기본값으로 두고 **Next**를 선택합니다.
1. **Review** 페이지에서 모든 정보를 검토한 후 **Submit**을 선택하여 StackSet을 생성합니다.

페이지가 새로 고쳐지면 StackSet을 볼 수 있습니다. 생성이 완료되면 상태가 `SUCCEEDED`로 변경됩니다.

## Phase 3: 검증 및 테스트

### 리소스 데이터 동기화 S3 버킷에서 메타데이터 확인

중앙 보고 계정에서 [Amazon S3 콘솔](https://console.aws.amazon.com/s3/home)로 이동하여 CloudFormation으로 생성된 `ssm-resource-sync-${region}-${account-id}`와 유사한 이름의 S3 버킷을 선택합니다. S3 버킷에서 [CloudFormation StackSet 배포](#deploy-a-cloudformation-stackset) 시 제공한 버킷 프리픽스를 선택합니다.

버킷에서 리소스 데이터 동기화가 자동으로 동기화하는 다양한 데이터 유형을 볼 수 있습니다. 이전에 인벤토리 메타데이터 수집을 구성하고 패치 스캔 작업을 한 번 이상 수행했다면 S3 버킷에 추가 폴더(예: `AWS:Application`, `AWS:AWSComponent`)가 표시됩니다. 각 폴더는 [인벤토리가 수집한 메타데이터](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-schema.html)를 나타냅니다.

![리소스 데이터 동기화 메타데이터용 S3 버킷 폴더](/img/cloudops/recipes/central-reporting/s3-bucket-objects.png "리소스 데이터 동기화 메타데이터용 S3 버킷 폴더")

각 데이터 유형 프리픽스 내에는 이 S3 버킷으로 리소스 데이터 동기화를 사용하는 각 계정의 프리픽스가 있습니다. 그 다음에는 인벤토리를 보고하는 각 리전의 프리픽스가 있고, 그 다음에는 일반적으로 `ManagedInstanceInventory`인 리소스 유형의 프리픽스가 있습니다. 그 프리픽스 내에는 인벤토리 데이터를 보고하는 각 인스턴스에 대한 JSON 파일이 있습니다.

### QuickSight 분석 접근 확인

[QuickSight 콘솔](https://quicksight.aws.amazon.com/sn/start/analyses)로 이동하여 CloudFormation으로 생성된 QuickSight Analysis 대시보드에 접근할 수 있는지 확인합니다.

**Managed Node Analysis CFN**이라는 분석이 보이지 않는 경우, CloudFormation 파라미터 `QuickSightUser`에 지정한 것과 동일한 사용자로 QuickSight에 로그인했는지 확인합니다. 오른쪽 상단의 프로필을 선택하여 로그인한 사용자를 확인할 수 있습니다.

![CloudFormation으로 생성된 QuickSight 분석](/img/cloudops/recipes/central-reporting/quicksight-analysis.png "CloudFormation으로 생성된 QuickSight 분석")

## 패치 준수 쿼리

### Glue 크롤러 확인

리소스 데이터 동기화가 Systems Manager 데이터를 S3 버킷에 동기화했으므로, Glue 크롤러를 사용하여 JSON 파일에서 테이블을 생성할 수 있습니다. Glue 크롤러는 매일 UTC 00:00에 실행되도록 구성되어 있습니다. Glue 크롤러가 실행될 때까지 기다리거나 수동으로 크롤러를 실행하여 Athena에서 쿼리할 테이블을 생성할 수 있습니다.

1. [AWS Glue 콘솔](https://console.aws.amazon.com/glue/home/v2/home)을 열고 탐색 창의 **Data Catalog** 헤더 아래에서 **Crawlers**를 선택합니다.
1. **SSM-GlueCrawler**를 선택하고 **Run**을 선택합니다.

크롤러는 약 2-4분 동안 실행된 후 중지됩니다. 크롤러가 Ready 상태로 돌아오면 탐색 창에서 **Tables**를 선택하여 결과 데이터베이스에 테이블이 추가되었는지 확인합니다.

### Athena를 사용한 쿼리

1. KMS, S3, Glue, Athena 리소스를 배포한 [중앙 보고 AWS 계정](#central-reporting-account)에 로그인합니다.
1. [Amazon Athena 콘솔](https://console.aws.amazon.com/athena/home)을 열고 탐색 창에서 **Query editor**를 선택합니다.
1. 오른쪽 상단에서 **Workgroup**으로 **patch-workgroup**을 선택합니다.
1. **Workgroup patch-workgroup settings**에서 **Acknowledge**를 선택합니다.
1. **Saved queries** 탭을 선택하여 샘플 쿼리를 확인합니다.
1. **QueryNonCompliantPatch**와 같은 저장된 쿼리를 선택하고 **Run**을 선택합니다.
1. 업데이트가 누락되고 비준수인 관리형 노드에 대한 쿼리 결과가 반환되는지 확인합니다.

![QueryNonCompliantPatch에 대한 Athena 쿼리 결과](/img/cloudops/recipes/central-reporting/athena-query-results.png "QueryNonCompliantPatch에 대한 Athena 쿼리 결과")

:::warning
**QuerySSMAgentVersion** 및 **QueryInstanceApplications**라는 **Saved queries**를 사용하려면 [Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html)를 활성화해야 합니다. [Systems Manager 통합 콘솔](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-organizations.html)에 온보딩할 때 Systems Manager Inventory를 빠르게 활성화할 수 있습니다.
:::

### 추가 Athena 샘플 쿼리

#### 비준수 관리형 노드의 업데이트 그룹화

다음 예제 Athena 쿼리는 관리형 노드별로 비준수 업데이트를 그룹화합니다.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
    defaultValue="query"
    values={[
        {label: '쿼리', value: 'query'},
        {label: '결과', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to aggregate non-compliant patch compliance items by resource (limited to 20 results)
SELECT 
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM 
    aws_complianceitem ci
WHERE 
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY 
    ci.resourceid,
    ci.status,
    ci.patchstate
ORDER BY 
    ci.resourceid
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![관리형 노드별 업데이트 그룹화 쿼리 결과 예제](/img/cloudops/recipes/central-reporting/group-updates-per-node.png "관리형 노드별 업데이트 그룹화 쿼리 결과 예제")

</TabItem>
</Tabs>

#### 비활성 관리형 노드 필터링

리소스 데이터 동기화는 S3 버킷으로 인벤토리 및 패치 준수 메타데이터를 전송합니다. 관리형 EC2 인스턴스가 중지되거나 종료되면 `AWS:InstanceInformation` 메타데이터가 새 상태를 반영하도록 업데이트됩니다. 하이브리드 관리형 노드의 경우 SSM 에이전트의 연결 상태에 따라 이 상태가 업데이트됩니다. 이 값은 다음 값을 가질 수 있는 `InstanceStatus` 키에 표시됩니다:

* `Active` - EC2 또는 하이브리드 관리형 노드의 SSM 에이전트가 활발히 실행 중이며 AWS Systems Manager와 통신 중입니다.
* `Stopped` - EC2 인스턴스가 `Stopped` 상태입니다.
* `Terminated` - EC2 인스턴스가 종료(삭제)되었습니다.
* `ConnectionLost` - 하이브리드 관리형 노드의 SSM 에이전트가 AWS Systems Manager와 통신할 수 없습니다.

:::tip
리소스 데이터 동기화는 지정된 S3 버킷에서 JSON 파일을 제거하지 않습니다. 종료된 EC2 인스턴스 또는 등록 해제된 하이브리드 관리형 노드의 관리형 노드 메타데이터 JSON 파일을 자동으로 정리하려면 [S3 수명 주기 정책](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)을 사용하여 자동으로 객체를 삭제할 수 있습니다. 예를 들어, 60일 동안 업데이트되지 않은 오래된 객체를 만료시키는 S3 버킷 정책을 구현할 수 있습니다. [조직 리소스 데이터 동기화용 샘플 CloudFormation 템플릿](#sample-cloudformation-template-for-organization-resource-data-sync) 섹션의 샘플 CloudFormation 템플릿에는 154행부터 시작하는 주석 처리된 `LifecycleConfiguration`이 포함되어 있습니다.
:::

Athena 쿼리에서 중지되거나 종료된 인스턴스 또는 연결이 끊긴 상태의 하이브리드 관리형 노드를 필터링하기 위해 `InstanceStatus`를 사용할 수 있습니다. 예를 들어, 다음 쿼리는 `Active` 관리형 노드에 대해서만 `AWS:InstanceInformation` 메타데이터를 반환합니다.

<Tabs
    defaultValue="query"
    values={[
        {label: '쿼리', value: 'query'},
        {label: '결과', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to return only Active managed nodes
SELECT 
    ii.accountid,
    ii.region,
    ii.resourceid,
    ii.computername,
    ii.ipaddress,
    ii.instancestatus,
    ii.platformtype,
    ii.platformname,
    ii.platformversion,
    ii.agenttype,
    ii.agentversion,
    ii.capturetime
FROM 
    aws_instanceinformation ii
WHERE 
    ii.instancestatus = 'Active'
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![활성 관리형 노드만 반환하는 쿼리 결과 예제](/img/cloudops/recipes/central-reporting/active-instance-query-results.png "활성 관리형 노드만 반환하는 쿼리 결과 예제")

</TabItem>
</Tabs>

## QuickSight를 사용한 패치 준수 시각화

[중앙 보고 계정에서 QuickSight용 CloudFormation 스택 배포](#deploy-a-cloudformation-stack-for-quicksight-in-the-central-reporting-account)에서 배포한 CloudFormation 스택은 패치 준수 및 인벤토리 메타데이터를 시각화할 수 있도록 QuickSight 데이터셋과 빈 분석 대시보드를 생성했습니다.

QuickSight 시각화를 생성하려면 아래 두 항목의 절차를 따르세요:

1. [Part 1: 관리형 노드 메타데이터 기반 QuickSight 시각화 생성](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
1. [Part 2: 패치 준수 정보를 위한 AWS QuickSight 시각화 생성](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

위의 두 항목을 따르면 다음과 유사한 두 개의 시트가 있는 QuickSight 대시보드를 만들 수 있습니다:

<Tabs
    defaultValue="instanceinfo"
    values={[
        {label: '인스턴스 정보', value: 'instanceinfo'},
        {label: '패치 준수', value: 'patchcompliance'},
    ]}>
<TabItem value="instanceinfo">

![인스턴스 정보용 QuickSight 대시보드 예제](/img/cloudops/recipes/central-reporting/example-instance-information-dashboard.png "인스턴스 정보용 QuickSight 대시보드 예제")

</TabItem>

<TabItem value="patchcompliance">

![패치 준수용 QuickSight 대시보드 예제](/img/cloudops/recipes/central-reporting/example-patch-compliance-dashboard.png "패치 준수용 QuickSight 대시보드 예제")

</TabItem>
</Tabs>

## 배포된 리소스 정리

:::warning
이 레시피의 샘플 CloudFormation 템플릿은 중앙 보고 계정의 CloudFormation 스택을 삭제할 때 S3 버킷의 내용을 삭제합니다.
:::

[Phase 2: 멤버 계정 구성](#phase-2-member-account-configuration)에서 생성된 샘플 리소스를 정리하려면 먼저 [StackSet에서 스택 인스턴스를 삭제](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-delete.html)한 다음 [StackSet을 삭제](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-delete.html)해야 합니다.

[Phase 1: 중앙 계정 설정](#phase-1-central-account-setup)에서 생성된 샘플 리소스를 정리하려면 다음 단계를 수행합니다:

1. [중앙 보고 계정에서 QuickSight용 CloudFormation 스택 배포](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account) 섹션에서 배포한 스택 `quicksight`의 리소스를 삭제합니다.
1. [중앙 보고 계정에서 Athena용 CloudFormation 스택 배포](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account) 섹션에서 배포한 스택 `patch-reporting`의 리소스를 삭제합니다.

CloudFormation 스택 삭제 방법에 대한 자세한 내용은 [CloudFormation 콘솔에서 스택 삭제](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html)를 참조하세요.

## 다음 단계

아래에서 패치 운영 및 보고 메커니즘을 개선하기 위한 참조로 사용할 수 있는 관련 AWS 블로그 시리즈를 찾을 수 있습니다.

* [AWS Organization에서 이메일 및 Slack 알림을 통한 Systems Manager 패치 보고 자동화](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
* [Amazon Bedrock의 자동화된 권장 사항으로 AWS Systems Manager 패치 문제 해결 간소화](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
* [Amazon QuickSight를 사용하여 AWS Systems Manager Patch Manager 정보 시각화](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)
* [Amazon Inspector 및 AWS Systems Manager를 사용한 AWS 취약성 관리 및 교정 자동화 – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)

## 기술 용어 사전

| 용어 | 정의 |
|---|---|
| AWS Glue Crawler | 데이터 소스에서 메타데이터를 자동으로 검색하고 카탈로그화하여 AWS Glue Data Catalog에 테이블을 생성하는 서비스. |
| AWS Organizations | 여러 AWS 계정을 단일 조직으로 중앙에서 관리하고 거버넌스하는 서비스. |
| Custom Resource | 템플릿에서 사용자 지정 프로비저닝 로직을 작성할 수 있게 해주는 CloudFormation 리소스 유형. |
| Delegated Administrator | AWS 조직을 대신하여 특정 AWS 서비스를 관리할 수 있는 권한이 부여된 AWS 계정. |
| Managed Node | AWS Systems Manager에 의한 관리를 위해 구성된 모든 서버(EC2 인스턴스 또는 온프레미스/기타 클라우드의 VM). SSM Agent가 설치되고 올바르게 구성되어 있어야 합니다. |
| Patch Baseline | 다양한 심각도 수준에 대한 승인 규칙을 포함하여 관리형 노드에 설치해야 할 패치를 정의하는 규칙 집합. |
| Patch Compliance | 필수 패치에 대한 관리형 노드의 상태. 연결된 패치 기준선에 따라 모든 필수 패치가 설치되면 노드는 준수 상태입니다. |
| Patch Group | 관리형 노드를 특정 패치 기준선과 연결하는 태그 기반 그룹화 메커니즘. |
| Resource Data Sync | 관리형 노드의 인벤토리 데이터를 중앙 S3 버킷으로 자동 집계하여 통합 보고를 가능하게 하는 Systems Manager 기능. |
| Service-Managed Permissions | AWS Organizations를 사용하여 조직의 계정에 스택 인스턴스를 배포하는 StackSet 권한 모델. |
| SSM Agent | Systems Manager가 이러한 리소스를 업데이트, 관리, 구성할 수 있도록 관리형 노드에 설치된 AWS 소프트웨어. |
| StackSet | 단일 작업으로 여러 계정 및 리전에 걸쳐 스택을 생성, 업데이트 또는 삭제할 수 있는 CloudFormation 기능. |
