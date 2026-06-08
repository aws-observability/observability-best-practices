---
sidebar_position: 7
---

# 자동화

[AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html)의 기능인 Automation을 사용하면, 로우코드 [비주얼 디자이너](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)로 [커스텀 런북](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html)을 작성하거나, AWS가 제공하는 370개 이상의 사전 정의된 런북을 [여러 계정과 AWS 리전에 걸쳐](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) 선택하여 사용할 수 있습니다. 승인, AWS API 호출, 노드에서 명령 실행 등 다른 [Systems Manager Automation 작업](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html)과 결합하여 런북의 일부로 Python 또는 PowerShell 스크립트를 실행할 수 있습니다.

Automation은 오류를 줄이고 복원력을 향상시켜 비즈니스 성능을 개선할 수 있습니다. Automation은 다양한 방식으로 보안과 운영을 모두 강화할 수 있으며, 다음은 몇 가지 예시입니다:

* **구성 관리**: Automation 도구는 서버, 워크스테이션 및 네트워크 장치 전반에 표준화된 구성을 적용하여 보안 취약점으로 이어질 수 있는 구성 오류의 가능성을 줄일 수 있습니다.
* **패치 관리**: Automation을 사용하여 시스템 전반에 보안 패치 및 업데이트를 배포하여 알려진 익스플로잇에 대한 취약점 노출 기간을 줄일 수 있습니다.
* **인시던트 대응 플레이북**: Automation은 사전 정의된 인시던트 대응 플레이북을 실행하여 보안 팀이 보안 인시던트를 억제, 조사 및 해결하는 데 필요한 단계를 안내할 수 있습니다. 애플리케이션 소유자는 시스템 장애 인시던트에 대응하기 위한 Automation 런북을 만들 수 있습니다. 예를 들어, 네트워크 연결 손실, 물리적 호스트의 소프트웨어 문제, 시스템 전원 손실 등이 있습니다. [Amazon CloudWatch 알람](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)을 사용하여 EC2 인스턴스를 중지, 종료, 재부팅 또는 복구할 수 있습니다.
* **컴플라이언스 관리**: Automation은 감사 프로세스를 자동화하고, 컴플라이언스 보고서를 생성하며, 보안 제어를 일관되게 적용하여 업계 규정 및 내부 정책 준수를 유지하는 데 도움을 줄 수 있습니다.

Systems Manager Automation을 활용하면 이 중요한 프로세스를 간소화하여 애플리케이션 서버가 조직의 보안 정책을 준수하며 최신 상태로 유지되도록 할 수 있습니다. 이는 시간을 절약하고 수동 오류 가능성을 줄일 뿐만 아니라, 이 반복적인 작업에 대해 일관되고 재현 가능한 접근 방식을 제공합니다.

![Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automation")

## 서비스 역할을 사용한 권한 관리

보안 모범 사례로서, automation을 시작하기 위해 SSM 서비스가 위임받을 수 있는 IAM 역할을 생성할 수 있습니다. 서비스 역할을 사용하면 automation이 AWS 리소스에 대해 실행되도록 허용되지만, automation을 실행한 사용자는 해당 리소스에 대한 제한된 접근(또는 접근 권한 없음)을 갖게 됩니다.

향상된 보안 및 제어 - 위임된 관리를 통해 AWS 리소스에 대한 보안과 제어가 강화됩니다. 권한을 수정하려면 여러 IAM 계정 대신 서비스 역할에서 변경하면 됩니다.

향상된 감사 경험 - 여러 IAM 계정 대신 중앙 서비스 역할이 리소스에 대한 작업을 수행하므로 감사 경험이 향상됩니다.

다음 상황에서는 Automation에 대한 서비스 역할을 지정해야 합니다: 1/ 위임된 관리를 사용하고자 할 때. 2/ 런북을 실행하는 Systems Manager State Manager 연결을 생성할 때. 3/ 12시간 이상 실행될 것으로 예상되는 작업이 있을 때. 4/ Amazon이 소유하지 않은 런북에서 aws:executeScript 작업을 사용하여 AWS API 작업을 호출하거나 AWS 리소스에 작업을 수행할 때.

![권한 관리](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "권한 관리")

서비스 역할을 생성한 후에는 해당 계정의 Systems Manager Automation만 역할을 위임받을 수 있도록 신뢰 정책을 편집하는 것이 좋습니다. 역할 정책에는 런북에 정의된 automation 작업을 실행하는 데 필요한 권한만 연결합니다. automation을 시작하는 IAM 엔터티는 필요한 automation 런북을 시작하도록 허용됩니다. 이 엔터티는 automation 서비스 역할을 Systems Manager에 전달하도록 허용됩니다. 이 엔터티에는 AWS 리소스와 직접 상호 작용할 수 있는 권한이 부여되지 않습니다. 이러한 권한은 서비스 역할에 위임됩니다.

* 서비스 역할 신뢰 정책
  * Systems Manager가 위임받을 수 있음
* 서비스 역할 정책 – 최소 접근 정책
  * automation 작업을 실행하는 데 필요한 권한만 부여
* IAM 사용자/그룹/역할 정책
  * 서비스 역할을 automation에 전달하도록 허용
  * Automation 실행을 시작/중지/설명할 수 있는 권한 허용
  * Automation 외부의 리소스를 관리하기 위한 권한은 필요 없음

## Automation 런북 생성

자체 automation 런북을 생성하는 방법에는 여러 가지가 있습니다. 프로그래밍 방식으로 문서를 생성하려면 CreateDocument API를 사용하거나, SSM Documents CDK 라이브러리를 사용할 수 있습니다. CloudFormation을 사용하여 문서를 생성할 수도 있습니다.

AWS Systems Manager Automation은 automation 런북을 생성하는 데 도움이 되는 로우코드 비주얼 디자인 환경을 제공합니다. 비주얼 디자인 환경은 자체 코드를 추가할 수 있는 옵션과 함께 드래그 앤 드롭 인터페이스를 제공하여 런북을 더 쉽게 생성하고 편집할 수 있습니다.

런북을 생성하면서 비주얼 디자인 환경은 작업을 검증하고 코드를 자동 생성합니다. 생성된 코드를 검토하거나 로컬 개발을 위해 내보낼 수 있습니다. 완료되면 런북을 저장하고 실행하며 Systems Manager Automation 콘솔에서 결과를 확인할 수 있습니다.

비주얼 디자인 환경에서 Automation은 Amazon CodeGuru Security와 통합되어 Python 스크립트의 보안 정책 위반 및 취약점을 감지하는 데 도움을 줍니다.

사용 가능한 옵션:

* AWS API 활용 또는 CloudFormation을 사용하여 문서 생성
* [Automation 런북을 위한 비주얼 디자인 환경](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code 툴킷](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [Systems Manager Documents를 위한 CDK](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager는 런북을 AWS 계정 간에 공유할 수 있도록 합니다. 이를 통해 효과적인 협업이 가능하고 모범 사례 채택을 촉진합니다. 예를 들어, 중앙 계정에서 보안 모범 사례를 automation 런북으로 정의하고 조직 내 다른 계정과 공유할 수 있습니다. 이를 통해 전체 AWS 환경에서 보안 조치의 일관된 구현을 보장합니다.

기본적으로 SSM은 AWS Organization Unit(OU)을 사용한 런북 공유를 지원하지 않습니다. 이 제한을 해결하기 위한 솔루션이 있습니다.

![Automation 런북](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Automation 런북")

이 솔루션은 EventBridge Rule, Lambda 함수, Step Function State Machine 및 SNS 토픽을 포함한 여러 AWS 리소스를 사용합니다. 배포되면 CreateAccount 또는 InviteAccountToOrganization API 호출을 통해 AWS Organizations에 새 계정이 추가될 때마다 워크플로가 트리거됩니다. 워크플로는 지정된 AWS Organizations 하위 계정 및 지정된 모든 리전의 새로 추가된 계정 ID에 대해 SSM Document 공유 권한을 추가합니다. [AWS Organizations SSM Document 공유 권한 자동화](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions)에서 자세히 알아보세요.

## Automation 실행

* **단순 Automation** – 현재 리전 및 계정
* **수동 Automation** – 대화형 단계별 실행. 각 단계를 수동으로 실행합니다. 문제 해결 목적에 유용합니다.
* **다중 계정 다중 리전 Automation** – 중앙 계정에서 여러 AWS 리전과 AWS 계정 또는 AWS Organizations 조직 단위(OU)에 걸쳐 automation을 실행합니다.
* **대규모 실행** – 태그, Resource Groups 또는 Parameter 값을 사용한 대상 지정
* **속도 제어** – 동시성 및 오류 임계값. 영향 범위를 제어합니다. 동시성 값은 동시에 automation을 실행할 수 있는 리소스 수를 결정합니다.
* **적응형 동시성** – 최대 500개의 동시 automation. Automation 기본 설정에서 활성화합니다.
* **CloudWatch 알람 통합** – automation을 모니터링하기 위해 CloudWatch 알람을 연결합니다. 알람이 활성화되면 automation이 중지됩니다.
* **보안** – IAM 접근 제어.
  * IAM 정책을 사용하여 관리자는 조직 내 어떤 개별 사용자 또는 그룹이 Automation을 사용할 수 있는지, 어떤 런북에 접근할 수 있는지 제어할 수 있습니다.
  * Automation은 IAM 서비스 역할을 사용한 접근 위임을 허용합니다. 서비스 역할을 사용하면 automation이 AWS 리소스에 대해 실행되도록 허용되지만, automation을 실행한 사용자는 해당 리소스에 대한 제한된 접근(또는 접근 권한 없음)을 갖게 됩니다.

## 여러 계정 및 리전에서 Automation 실행

![Automation 실행](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "Automation 실행")

여러 리전과 계정 또는 OU에서 automation을 실행하는 방법은 다음과 같습니다:

1. automation을 실행하려는 모든 리전과 계정 또는 OU의 모든 리소스가 동일한 태그를 사용하는지 확인합니다. 동일하지 않은 경우 AWS 리소스 그룹에 추가하고 해당 그룹을 대상으로 지정할 수 있습니다. 자세한 내용은 *AWS Resource Groups 및 태그 사용자 가이드*의 [리소스 그룹이란?](https://docs.aws.amazon.com/ARG/latest/userguide/)을 참조하세요.
1. Automation 중앙 계정으로 구성하려는 계정에 로그인합니다.
1. 이 토픽의 [다중 리전 및 다중 계정 automation을 위한 관리 계정 권한 설정](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) 절차를 사용하여 다음 IAM 역할을 생성합니다:
1. **AWS-SystemsManager-AutomationAdministrationRole** - 이 역할은 사용자에게 여러 계정과 OU에서 automation을 실행할 수 있는 권한을 부여합니다.
1. **AWS-SystemsManager-AutomationExecutionRole** - 이 역할은 사용자에게 대상 계정에서 automation을 실행할 수 있는 권한을 부여합니다.
1. automation을 실행할 런북, 리전 및 계정 또는 OU를 선택합니다.

**다중 계정/리전 Automation 고려 사항:**

* Resource Groups를 대상으로 할 때, 리소스 그룹은 각 대상 계정 및 리전에 존재해야 합니다
  * 리소스 그룹 이름은 각 대상 계정 및 리전에서 정확히 동일해야 합니다
* Automation은 OU를 재귀적으로 순회하지 않습니다
  * Automation은 계정을 포함하는 OU만 대상으로 할 수 있습니다
* 다중 계정/리전에 필요한 IAM 역할은 CloudFormation 또는 IaC를 사용하여 생성하는 것을 권장합니다
