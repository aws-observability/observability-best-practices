---
sidebar_position: 1
---
# 랜딩 존 계획 및 구현

## 비즈니스 요구사항에 맞는 리전 활성화

### 가장 많이 사용하는 리전을 홈 리전으로 선택

Control Tower는 여러 리전을 관리할 수 있지만, 단일 홈 리전에서 활성화해야 합니다. 대부분의 워크로드를 실행할 것으로 예상되는 리전을 식별하고 이를 Control Tower 홈 리전으로 지정하세요. 기존 AWS Identity Center 인스턴스를 사용하는 경우, 홈 리전은 AWS Identity Center가 구성된 리전과 동일해야 합니다.

Control Tower 홈 리전에는 랜딩 존의 주요 구성 항목이 있습니다. AWS Organization이 그곳에 생성되고, IAM Identity Center가 그곳에서 활성화되며, CloudTrail 데이터 저장을 위한 S3 버킷도 마련됩니다. 감사 계정의 AWS Config도 홈 리전으로 결과를 집계하도록 구성됩니다.


### 사용하지 않는 리전 거부, 허용된 모든 리전 관리

Control Tower는 대부분의 AWS 리전 사용을 거부하고 비즈니스 요구에 필요한 하위 집합만 활성화하는 기능을 제공합니다. 이를 통해 공격 표면을 줄이고, 워크로드가 불필요한 비용을 생성할 가능성을 줄이며, 거버넌스 및 Observability 요구사항을 간소화합니다.

[글로벌 리전 거부 컨트롤](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)은 랜딩 존을 생성하거나 업데이트할 때 설정할 수 있습니다. 이는 Control Tower 관리 리전 목록과 함께 작동합니다. 즉, 리전이 거버넌스에 대해 활성화되지 않으면 거부됩니다. 특정 조직 단위(OU)에 대해 리전 사용을 추가로 제한하려면 [OU 리전 거부 컨트롤](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html)을 구현할 수도 있습니다. 이 두 컨트롤은 모두 [Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)를 사용하여 구현됩니다. 리전이 거부되지 않으면 사용자는 IAM 권한에 따라 해당 리전에 리소스를 배포할 수 있습니다. 워크로드에 영향을 주지 않도록 리전을 거부하기 전에 해당 리전에서 사용 중인 리소스가 없는지 확인하세요.

Control Tower 홈 리전은 기본적으로 관리되며 관리를 해제할 수 없습니다.

Control Tower 리전 거부 SCP에는 Control Tower가 작동하는 데 필요한 예외가 포함됩니다.

## AWS Identity Center를 사용하여 액세스 제어 간소화

IAM 사용자의 사용을 피하고 AWS 리소스에 대한 인간 액세스를 위해 [ID 페더레이션](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp)을 요구하는 것이 AWS 모범 사례입니다. 이를 통해 장기 AWS 자격 증명을 사용할 필요가 없어지므로 자격 증명 손상의 위험을 상당 부분 완화할 수 있습니다. 중앙 집중식 액세스 관리를 위해 [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html)를 사용하여 계정에 대한 액세스와 해당 계정 내 권한을 관리하는 것을 권장합니다.

Identity Center는 단일 리전에서 활성화하여 전 세계 사용자가 사용할 수 있습니다. Organization에 대해 Identity Center가 활성화되지 않은 경우, Control Tower가 Control Tower 홈 리전에서 이를 활성화합니다. Identity Center가 이미 활성화된 경우, Control Tower 홈 리전에서 활성화되어야 하며 그렇지 않으면 [사전 검사](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)에 실패합니다.

AWS Identity Center는 AWS Organization의 계정에 할당하고 해당 계정에서 IAM 역할을 생성하는 템플릿으로 사용되는 Permission Sets를 지원합니다. Identity Center 사용자 또는 그룹을 특정 계정의 특정 권한 세트와 연결하면, 해당 사용자 또는 그룹이 해당 계정에서 Permission Set으로 정의된 역할을 맡을 수 있습니다. Control Tower가 Identity Center를 관리하도록 허용하면, 사용자 액세스를 위한 기반을 제공하기 위해 일부 [사전 구성된 그룹과 권한 세트](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html)를 생성하고 이를 계정에 할당합니다.


### 기업 ID 공급자 통합

Identity Center를 사용하여 사용자와 그룹을 관리할 수 있지만, 기존 기업 ID 공급자가 있다면 ID에 대한 단일 진실 소스를 유지하기 위해 [Identity Center에 연결](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html)해야 합니다.

페더레이션 사용자를 사용하고 있으며 Control Tower가 Identity Center에 설정하는 기본 그룹 및 권한 세트 구성을 활용하려면, 업스트림 공급자에서 동일한 이름의 그룹을 생성하고 Identity Center에 동기화할 수 있습니다. 그런 다음 ID 공급자에서 이러한 그룹에 사용자를 할당하여 등록된 계정에 대한 액세스를 부여할 수 있습니다.

### 최소 권한 액세스를 향해 노력

Control Tower가 생성하는 기본 Permission Sets는 **AdministratorAccess** 및 **DeveloperAccess**와 같은 일반적인 사용 사례를 위해 설계되었습니다. 민감한 데이터가 관련되거나 보안 및 규정 준수가 중요한 문제인 프로덕션 워크로드의 경우, 모범 사례에 따라 필요한 최소 액세스로 권한을 줄여야 합니다. 사용자 지정 권한 세트를 사용하여 필요한 권한을 구체적으로 부여하고/하거나 불필요한 액세스를 거부하기 위해 서비스 제어 정책을 적용하여 달성할 수 있습니다. [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)를 사용하면 필요한 권한을 식별하고, 사용하지 않는 권한을 제거하며, 최소 권한 정책을 작성하는 데 도움을 받을 수 있습니다.


### 위임된 관리자 계정 활성화

Control Tower는 Organization 관리 계정에서 Identity Center를 활성화합니다. 관리 계정에 대한 접근 필요성을 최소화하는 것이 모범 사례입니다. 관리 계정은 나머지 AWS Organization을 제어하며 멤버 계정과 동일한 수준으로 예방적 컨트롤(SCP)로 제한할 수 없기 때문입니다. 이러한 이유로 [Identity Center에 대한 위임된 관리자 계정을 활성화](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html)해야 합니다.

관리 계정에 배포된 권한 세트는 위임된 관리자 계정에서 관리할 수 없습니다. 관리 계정을 위한 전용 권한 세트(예: MA_Administrator)를 생성하고 매우 제한된 사용자 집합만 맡을 수 있도록 하는 것을 권장합니다.

### Control Tower 관리 역할에 대한 추가 제약 적용

Control Tower는 AWS 서비스가 맡을 수 있는 멤버 계정에 [다양한 역할](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)을 생성합니다.

[교차 서비스 혼동된 대리자(confused deputy)](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html) 문제를 방지하기 위해, AWS Organization 외부의 ID가 서비스를 속여 대신 역할을 맡도록 하는 것을 방지하는 [Resource Control Policy (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html)를 정의할 수 있습니다.

또한 Control Tower 역할에 조건을 추가하여 [액세스를 추가로 제한](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html)할 수 있지만, 이러한 역할에 대한 변경 사항은 랜딩 존 업데이트 시 덮어쓸 수 있다는 점에 유의하세요.


## AWS Backup으로 데이터 보호

Control Tower [AWS Backup 통합](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/)은 각 멤버 계정에 백업 볼트, 공유 계정에 중앙 볼트, 표준 백업 정책(시간별, 주별, 일별, 월별)을 포함하는 모범 사례 백업 솔루션을 구성하는 데 도움이 됩니다. 백업은 OU 수준에서 활성화할 수 있으며 개별 리소스에 태그를 지정하여 해당 백업 일정의 대상으로 설정할 수 있습니다.

선택한 Control Tower 사용자 지정 방법([AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html), [CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html), [AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html), [StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html))을 사용하여 필요에 따라 계정에 추가 백업 계획을 배포할 수 있습니다. 이러한 계획은 [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) 역할을 재사용하거나 필요에 따라 새 역할을 생성할 수 있습니다.

기존 백업 솔루션이 있다면 이 통합을 선택 해제할 수 있습니다.


## 비즈니스 요구사항에 맞게 AWS Organization 구조 확장

### AWS Organizations 멀티 계정 모범 사례 준수

일반적으로 Control Tower를 사용할 때 [멀티 계정 전략](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) 및 조직 단위(OU) 설계와 관련된 AWS Organizations 모범 사례를 따르세요. 간단하게 유지하세요 - 차별화된 거버넌스, 보안 및 정책 요구사항을 지원하는 데 필요한 OU부터 시작하고, 깊은 중첩을 피하세요. Control Tower는 최대 5단계의 중첩을 지원합니다.


### Control Tower Security OU를 수정하거나 삭제하지 마세요

Control Tower가 Organization에 적용하는 몇 안 되는 제한 중 하나는 Security OU 아래에 추가 계정이나 OU를 생성할 수 없으며, Control Tower가 생성한 계정(로그 아카이브, 감사)을 이동하거나 삭제하면 Control Tower 환경이 손상된다는 것입니다.


### Security OU만 남기고 모든 OU를 삭제하지 마세요

Control Tower는 최소 두 개의 OU가 있어야 하며, 그 중 하나는 Security OU여야 합니다. Control Tower 활성화 시 생성된 Sandbox OU를 삭제할 수 있지만, Organization에 최소 하나의 다른 OU가 있는 경우에만 가능합니다.
