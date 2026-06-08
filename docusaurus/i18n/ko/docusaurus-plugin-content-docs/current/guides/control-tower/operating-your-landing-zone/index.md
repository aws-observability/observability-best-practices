---
sidebar_position: 2
---
# 랜딩 존 운영

## 테스트 랜딩 존 생성 고려

컨트롤은 프로덕션 계정에 적용하기 전에 비프로덕션 OU에서 테스트할 수 있고(그래야 하지만), 두 번째 테스트 Organization이 도움이 되는 경우도 있습니다. 랜딩 존 업데이트를 테스트하거나, 랜딩 존 관리 자동화 또는 계정 사용자 지정 프로세스를 수정해야 하는 경우, 프로덕션 워크로드에 대한 의도치 않은 영향을 피하기 위해 완전히 별도의 Organization을 갖는 것이 유용할 수 있습니다.

## 랜딩 존을 최신 상태로 유지

랜딩 존 업데이트에는 보안 개선, 비용 최적화, 기능 향상이 포함될 수 있습니다. 새 랜딩 존 버전이 출시되면 가능한 빨리 [업데이트](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html)해야 합니다. AWS 콘솔에서 수행할 수 있습니다. 이 프로세스는 공유 계정(로그 아카이브, 감사, 백업)을 포함한 랜딩 존 구성 요소를 업데이트합니다.

2.x에서 3.x로 업데이트하는 경우, 계정 수준에서 Organization 수준 CloudTrail 추적으로의 변경과 관련하여 [추가 주의사항](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html)이 있다는 점에 유의하세요.

## Control Tower를 통해 계정 생성

Control Tower의 Account Factory를 통해 새 계정을 생성하면 생성 시 등록되고 관리됩니다. Control Tower가 활성화된 상태에서 AWS Organizations를 통해 계정을 생성하는 것이 가능하지만, Control Tower가 관리하는 OU 아래에 있더라도 Control Tower에 등록되지 않습니다. Organization에 Control Tower를 통해 생성되지 않은 계정이 있는 경우, Control Tower 컨트롤과 기준을 적용하기 위해 해당 계정을 등록할 수 있습니다.

### Control Tower 관리 Identity Center에서 페더레이션 ID 사용 시 계정 생성 중 공통 SSO 사용자 사용

Identity Center가 Control Tower에 의해 관리되는 경우, Account Factory는 Identity Center 사용자를 매개변수로 요구합니다. 이 사용자에게는 생성된 계정에 대한 관리자 액세스 권한이 부여되지만, ID 페더레이션이 활성화된 동안에는 사용할 수 없습니다. 페더레이션 ID를 사용할 때 이 사용자는 사용할 수 없지만 여전히 필수 매개변수입니다. 사용자가 고유할 필요는 없으므로, 사용하지 않는 로컬 Identity Center 사용자를 많이 생성하는 것을 피하기 위해 여러 계정에 동일한 사용자를 사용할 수 있습니다. 나중에 ID 페더레이션이 비활성화되면, 비밀번호를 활성화하고 계정에 액세스하기 위해 해당 사용자와 연결된 이메일 주소에 대한 접근이 필요합니다.

## 계정을 최신 상태로 유지

랜딩 존 업데이트가 완료되면 계정을 업데이트해야 합니다. 콘솔에서 개별 계정에 대해 수행하거나, 전체 OU를 재등록(1000개 미만의 계정이 있는 경우)하여 수행할 수 있습니다. [프로세스를 자동화](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html)하는 것도 가능합니다.

비프로덕션 워크로드를 프로덕션 워크로드와 다른 OU에 유지하여, 비프로덕션 OU를 먼저 재등록함으로써 업데이트의 영향을 테스트할 수 있도록 하는 것이 모범 사례입니다.


## 드리프트 관리

드리프트는 AWS Control Tower 랜딩 존 구성 요소, 계정 또는 조직 단위(OU)가 정의된 기준 및 컨트롤과 동기화되지 않을 때 발생합니다. 드리프트를 이해하고 관리하는 것은 AWS 환경에서 거버넌스와 규정 준수를 유지하는 데 매우 중요합니다.

### Control Tower를 통해 계정과 OU를 변경하여 드리프트 방지

Control Tower 외부에서(일반적으로 AWS Organizations 콘솔에서 직접 변경하는 경우) 계정, OU 또는 Control Tower가 관리하는 Organization 정책(SCP, RCP)을 변경하면 드리프트가 발생할 수 있습니다.

### 정기적으로 랜딩 존의 드리프트 검토

Control Tower는 드리프트를 자동으로 감지합니다. 정기적으로 랜딩 존의 드리프트를 검토하고 필요에 따라 수정하세요. 콘솔에서 Organization 페이지로 이동한 다음 검사하려는 OU 또는 계정을 선택하여 OU 및 계정 드리프트 상태를 확인할 수 있습니다. 드리프트는 감사 계정에 집계되는 [SNS 알림](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html)에서도 표시됩니다. aws-controltower-AggregateSecurityNotifications 토픽을 구독하여 모든 드리프트 알림을 받을 수 있습니다. 이 토픽은 Config 비준수 및 기타 알림도 수신하므로 노이즈가 있을 수 있으므로, 관심 있는 알림을 처리하기 위해 Lambda를 구독하는 것이 좋습니다.


### 규정 준수를 보장하기 위해 드리프트 해결

랜딩 존이 드리프트된 상태라면, 활성화한 컨트롤에 대해 리소스가 규정을 준수하는지 정확하게 판단할 수 없습니다. 거버넌스 요구사항이 충족되도록 드리프트를 감지하면 수정하세요. 문서에서 [수리 가능한 드리프트](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources)의 몇 가지 예를 참조하세요.

* 계정이나 OU가 드리프트된 경우 콘솔에서 계정을 업데이트하거나 OU를 재등록하여 해결할 수 있습니다.
* 컨트롤의 경우, 많은 유형의 드리프트를 ResetEnabledControl API를 호출하여 해결할 수 있습니다.
* 많은 유형의 드리프트를 랜딩 존 리셋으로 자동 해결할 수 있습니다. 랜딩 존 설정에서 Versions 섹션의 Reset 버튼을 클릭하여 수행할 수 있습니다.


## 필수 Control Tower OU 또는 계정을 삭제하지 마세요

랜딩 존 확장에 대한 이전 섹션에서 언급했듯이, Security OU를 삭제하거나 이동하거나 Control Tower가 관리하는 계정을 삭제하거나, 다른 모든 OU를 삭제하여 Security OU만 남기면 랜딩 존 드리프트가 발생합니다. 이 상태에서는 랜딩 존을 리셋할 때까지 Control Tower가 작동하지 않습니다.

## 필수 역할을 삭제하지 마세요

[Control Tower가 필요로 하는 역할](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)이 누락되거나 접근할 수 없는 경우, 랜딩 존을 리셋하라는 오류 페이지가 표시됩니다.

## 거버넌스 요구사항을 충족하기 위해 컨트롤 활성화

[컨트롤 적용 모범 사례](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/)를 따르세요.

AWS Controls Catalog에서 요구사항에 맞는 Control Tower 컨트롤을 식별하세요. 구현, 동작, 소유자, 서비스 및 프레임워크를 포함한 메타데이터를 기반으로 컨트롤을 검색할 수 있습니다:

* Control Tower 콘솔
* [Control Tower Catalog 문서](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


필요한 경우 기본 서비스를 사용하여 사용자 지정 컨트롤을 정의할 수 있지만, 이러한 컨트롤은 Control Tower 대시보드나 규정 준수 메트릭에 포함되지 않습니다:

* 예방적 컨트롤을 위한 AWS Organization [SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) 및 [RCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)
* 탐지적 컨트롤을 위한 AWS [Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)
* 사전 대응적 컨트롤을 위한 AWS [CloudFormation hooks](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html)
* AWS [Security Hub CSPM Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html)

사용자 지정 정책(SCP 또는 RCP)을 배포하는 경우, [Control Tower 서비스 역할](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html)이 거부되지 않도록 해야 합니다. 그렇지 않으면 오류가 발생하거나 Control Tower가 작동하지 않을 수 있습니다.


프로덕션 계정에 배포하기 전에 항상 컨트롤을 테스트하세요.

* 먼저 비프로덕션 OU 및/또는 테스트 Organization에 배포하세요
* 새 예방적 컨트롤을 배포하기 전에 비준수를 식별하고 해결하기 위해 동등한 탐지적 컨트롤을 먼저 배포하는 것을 고려하세요

## 컨트롤 상속 이해

컨트롤은 AWS Control Tower의 기본 요소이며, 작동 방식을 이해하는 것이 랜딩 존 운영에 필수적입니다.

* 필수 컨트롤은 비활성화할 수 없으며 특히 Control Tower 리소스를 보호합니다. 사용자 워크로드에는 적용되지 않습니다.
* Control Tower에 등록된 계정은 상위 OU의 컨트롤을 상속합니다
    * 예방적, AWS Organizations 정책 기반 컨트롤은 중첩된 OU에서 상속되며, 다른 컨트롤은 그렇지 않습니다.
    * 예방적, AWS Organizations 정책 기반 컨트롤은 Control Tower가 등록한 OU의 미등록 계정에 적용되며, 다른 컨트롤은 적용되지 않습니다.

## Config 컨트롤을 서비스 연결 규칙 사용으로 업데이트

[2025년 6월](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/) 이후 Control Tower는 서비스 연결 AWS Config 관리형 규칙을 지원합니다. 이전에는 규칙이 StackSets를 통해 배포되었습니다. 서비스 연결 규칙은 서비스에 의해 직접 계정에 배포되며 Control Tower를 통해서만 편집하거나 삭제할 수 있습니다. 이를 통해 배포 속도가 향상되고 의도치 않은 드리프트를 방지합니다.


## AWS Organizations를 통해 계정을 이동하지 마세요

콘솔이나 API를 통해 AWS Organizations에서 직접 OU 간 계정을 이동하면 Control Tower에서 드리프트가 발생합니다.

OU 간 계정을 이동해야 하는 경우 [Control Tower 콘솔에서 계정을 업데이트](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console)하거나 [Service Catalog에서 계정의 프로비저닝된 제품을 업데이트](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product)하여 수행하세요. Organizations에서 계정을 이동한 경우, [계정을 업데이트](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved)하면 드리프트를 해결할 수 있습니다.


## 규정 준수 상태 검토

정기적으로 계정과 OU의 규정 준수 상태를 검토하고 비준수를 수정하기 위한 조치를 취하세요.

Control Tower 대시보드는 적용된 Control Tower 컨트롤의 규정 준수 상태를 보여줍니다. 현재 Control Tower 외부에서 적용된 Config 규칙(Security Hub가 소유한 규칙 포함)의 규정 준수 상태는 표시되지 않습니다.

Organization 전체의 Config 규정 준수에 대한 포괄적인 보기를 얻으려면 Cloud Intelligence Dashboards 프로젝트의 [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) 구현을 고려하세요.

규정 준수 변경에 대한 알림을 받으려면 [감사 계정의 SNS 토픽](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html)을 구독하세요.

## 활성화된 컨트롤을 정기적으로 검토

계정과 OU에 적용된 컨트롤이 비즈니스 요구사항을 계속 충족하는지, 새로운 컨트롤을 활용하고 있는지 정기적으로 검토하세요.


## 비준수에 대한 조치

[Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html)를 정의하고 활성화된 Config 규칙과 연결하여 [비준수를 수정](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)하는 데 사용할 수 있도록 해야 합니다. 수정은 [수동으로](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html) 트리거하거나 [자동으로 실행](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html)되도록 구성할 수 있습니다.



## 랜딩 존 비용 모니터링 및 최적화

### 랜딩 존 비용에 대한 가시성 확보

* 관리 계정에서 [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)를 사용하여 Organization 전체 AWS 지출에 대한 가시성 확보
* [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html)을 구성하고 알림을 구독하세요
* [Cost & Usage Report 데이터 내보내기](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html), Athena 통합 및 상세한 QuickSight 비용 대시보드를 쉽게 활성화하기 위해 Cloud Intelligence Dashboards 구현을 고려하세요

### 비용 급등의 일반적인 원인 파악

* CloudTrail 통합으로 Control Tower를 활성화할 때, 기존의 관리 추적을 삭제하여 CloudTrail 과금을 방지하세요
* Control Tower는 AWS Config를 사용하여 리소스 상태를 추적합니다. 이는 규정 준수 유지에 중요하지만, 자주 변경되는 임시 워크로드를 추적하는 데는 비용이 많이 들 수 있습니다. 현재 Control Tower에서 멤버 계정의 Config 레코더를 수정하는 기본 제공 옵션은 없지만, Config 비용이 과도하고 규정 준수 요구사항이 덜 엄격한 계정에 대해 Config 레코더를 비활성화하려면 [이 해결 방법](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)을 고려하세요.
