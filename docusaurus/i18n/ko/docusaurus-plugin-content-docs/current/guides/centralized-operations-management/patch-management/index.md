---
sidebar_position: 5
---
# 패치 관리

Systems Manager의 기능인 [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html)를 사용하면 보안 관련 업데이트로 관리 노드의 패칭 프로세스를 자동화할 수 있습니다. Amazon EC2 인스턴스, 엣지 디바이스, 온프레미스 서버 및 가상 머신(VM)을 패치할 수 있으며, 다른 클라우드 환경의 VM도 포함됩니다.

## 패칭이 어려운 이유

![What makes patching hard?](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "What makes patching hard?")

패칭 전략을 수립하는 것은 조직에게 어려운 과제가 될 수 있습니다. 우선, 패치 관리는 회사 환경 내 각 노드에 설치된 애플리케이션과 운영 체제를 포함하여 패치 가능한 소프트웨어의 최신 전체 인벤토리를 보유하는 것에 의존합니다. 둘째로, 엔터프라이즈 패치 관리는 인력과 인프라 측면에서 일부 리소스에 과부하를 줄 수 있습니다.

다음으로, 패치를 설치하면 부작용이 발생할 수 있습니다. 조직이 신중하게 접근하게 만드는 또 다른 일반적인 과제는 패치 설치로 인해 의도하지 않거나 예상치 못한 문제가 발생하는 것입니다. 노드를 검사하여 특정 패치가 실제로 적용되었는지 여부를 판단하는 것은 놀라울 정도로 어려울 수 있습니다. 이 과제는 단일 노드에서도 직면할 수 있으며, 조직 전체의 노드와 운영 체제 플릿으로 확장하면 그 규모의 도전은 빠르게 매우 압도적이 될 수 있습니다.

## 개선 방안

![Prioritizing patching](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "Prioritizing patching")

일반적인 과제를 해결하기 위해, 먼저 분류를 통해 특정 패치의 우선순위를 정하여 반드시 우선시해야 할 소규모 패치 하위 집합을 식별하는 것부터 시작합니다. 이를 위해 비즈니스에 가장 중요한 워크로드나 애플리케이션이 무엇인지 결정한 다음, 해당 워크로드에 가장 큰 영향을 미치는 패치가 무엇인지 판단합니다. 예를 들어, 이메일 서버, 데이터베이스, 웹 애플리케이션, 고객 대면 디지털 자산 등이 있습니다.

![How it works](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "How it works")

여기서부터 각 워크로드에 대한 [패치 베이스라인](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html)을 생성하여 패치 스캔 작업 수행 시 누락으로 표시할 적용 가능한 패치를 결정할 수 있습니다. 스캔을 통해 설정한 베이스라인에 대한 컴플라이언스 수준을 파악할 수 있습니다.

그런 다음 정기 유지 보수 기간 동안 업데이트를 적용하기 위한 반복 패치 설치 작업을 예약하거나, 긴급 패치 릴리스 시 온디맨드로 업데이트를 설치할 수 있습니다. 패치 설치 후에는 Patch Manager가 제공하는 패치 컴플라이언스 데이터를 사용하여 결과를 확인할 수 있습니다.

## 패칭 중 OS 내부에서 발생하는 작업

고객이 자주 묻는 질문은 Patch Manager가 패치를 스캔하거나 설치하는 방법입니다. 패치 작업이 시작되면, 예약이든 임시이든, 해당 작업은 Systems Manager 엔드포인트에 대기열에 추가됩니다. 그러면 SSM 에이전트가 스캔 또는 설치 명령을 가져옵니다. SSM 에이전트는 패치 베이스라인 승인 규칙을 가져와 로컬 OS 패키지 관리자(예: Windows Update, yum, apt-get)를 사용하여 스캔 또는 설치를 시작합니다. 작업이 완료되면 SSM 에이전트가 패치 컴플라이언스 데이터를 Patch Manager에 다시 보고합니다.

![Patch Management OS Patching](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "Patch Management OS Patching")

### 패치 소스에 대한 연결

관리 노드가 인터넷에 직접 연결되어 있지 않고 VPC 엔드포인트가 있는 Amazon Virtual Private Cloud(Amazon VPC)를 사용하는 경우, 노드가 소스 패치 리포지토리(repos)에 액세스할 수 있는지 확인해야 합니다.

Linux 노드에서는 패치 업데이트가 일반적으로 노드에 구성된 원격 리포지토리에서 다운로드됩니다. 따라서 패칭을 수행하려면 노드가 리포지토리에 연결할 수 있어야 합니다. Windows Server 관리 노드는 Windows Update Catalog 또는 Windows Server Update Services(WSUS)에 연결할 수 있어야 합니다. 자세한 내용은 [Patch Manager 사전 요구 사항](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html)을 참조하세요.

## 패치 기준 정의

Patch Manager는 지원하는 각 운영 체제에 대해 [사전 정의된 패치 베이스라인](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html)을 제공합니다. 이러한 베이스라인을 현재 구성된 대로 사용하거나(사용자 지정은 불가) 자체 사용자 지정 패치 베이스라인을 생성할 수 있습니다. 사용자 지정 패치 베이스라인을 사용하면 환경에서 승인하거나 거부할 패치에 대해 더 세밀한 제어가 가능합니다.

사용자 지정 패치 베이스라인 내에서 다음을 수행할 수 있습니다:

* 승인할 패치 정의
* 자동 승인 지연을 사용한 마감 설정
* 패치 예외 정의
* Linux용 사용자 지정 패치 리포지토리 정의
* 여러 운영 체제 버전에 대한 패치 기준 정의

## 다양한 패칭 유형

패칭 솔루션에 적용할 수 있는 두 가지 일반적인 접근 방식이 있습니다: 중앙 집중식 또는 분산식입니다.

| 중앙 집중식 패칭 | 분산식 패칭 |
| -------------------- | ---------------------- |
| 중앙 팀이 패치 스캔 작업 배포 | 애플리케이션/계정 소유자에게 더 많은 책임 부여 |
| 중앙 팀이 패치 설치 작업 배포 | 중앙 팀이 패치 스캔 작업을 배포하고 컴플라이언스 보고는 여전히 중앙에서 관리 |
| 일정 및 수행 작업에 대한 유연성 제한적 | 소유자가 패치 설치 작업을 담당하며, 중앙 팀은 AWS Service Catalog 등을 통해 구성 요소 제공 가능 |
| 중앙 팀이 일반적으로 문제 해결 담당 | 소유자가 설치 일정 정의 가능 |
| 규제가 엄격하거나 보안이 강화된 환경에서 더 일반적 | 중앙 팀이 온디맨드 패치 설치 오버라이드 보유 필요 |

### 다중 계정 조직을 위한 중앙 집중식 패칭 솔루션 예시

**옵션 1:** [Quick Setup Patch Policy 구성](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html)을 사용하여 중앙 집중식 패칭 솔루션을 구축할 수 있습니다. Patch Policy를 통해 고객은 여러 AWS 계정과 AWS 리전에 걸쳐 여러 패치 베이스라인에 대한 스캔 및 패치 설치를 예약할 수 있습니다. 자세한 내용은 [AWS Organization 전반의 패칭 - Patch Policies](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies)를 참조하세요.

![Patch Management Centralized Patching Option 1](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "Patch Management Centralized Patching Option 1")

**옵션 2:** 중앙 집중식 솔루션의 또 다른 옵션은 [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda](https://aws.amazon.com/lambda/), [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html)의 조합을 사용하여 다중 계정 및 다중 리전 패칭 작업을 예약하는 것입니다. 자세한 내용은 [AWS Systems Manager Automation을 사용한 중앙 집중식 다중 계정 및 다중 리전 패칭 예약](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/)을 참조하세요.

![Patch Management Centralized Patching Option 2](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "Patch Management Centralized Patching Option 2")

### 다중 계정 조직을 위한 분산형 셀프 서비스 패칭 솔루션 예시

애플리케이션 소유자마다 패치 작업, 패치 시점, 패칭 빈도, 하위 환경(DEV 또는 UAT)에서의 패치 테스트 유연성 측면에서 요구 사항이 다를 수 있습니다. [AWS Service Catalog](https://aws.amazon.com/servicecatalog/)를 사용하면 중앙 팀이 셀프 서비스 패칭을 위한 구성 요소 역할을 하는 제품을 생성할 수 있습니다. 애플리케이션/계정 소유자는 이러한 제품을 자신의 환경에 배포하고 일정 등 몇 가지 파라미터만 제공하면 되므로 직접 솔루션을 구축할 필요가 없습니다. 자세한 내용은 [다중 계정 조직을 위한 셀프 서비스 패칭 솔루션](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/)을 참조하세요.

![Self-service patching using Service Catalog](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "Self-service patching using Service Catalog")

## 현장 패치 vs 재수화

재수화(Rehydration, 재포장, 새로 고침)는 최신 패치가 설치된 새 서버를 가동하고 기존 노드를 폐기하는 프로세스입니다. Auto Scaling Group의 EC2 인스턴스, 컨테이너 클러스터(ECS/EKS)의 관리 노드 그룹, 애플리케이션 워크로드 요구 사항으로 사전 구성된 AMI에 일반적으로 사용되는 방식입니다.

| 현장 패치 | 재수화 |
| -------------- | ----------- |
| 일반적으로 재수화보다 높은 빈도로 수행(주간, 격주) | 일반적으로 월간 또는 분기별로 수행. 일부 고객은 2주마다 수행! |
| 쉽게 교체할 수 없는 장기 운영 노드에 적합(변경 가능) | 시작 후 구성이 많이 필요하지 않은 워크로드에 적합(불변) |
| 패치 설치 워크플로에 백업이 필요할 수 있음 | EC2 Image Builder 등의 서비스를 사용하여 Auto Scaling 그룹과 통합 |
| | 현장 패치 메커니즘이 여전히 필요할 수 있음. 예를 들어, 제로데이 취약점 패치가 릴리스되었지만 다음 재수화 주기까지 노드를 교체할 수 없는 경우 |

환경 내 애플리케이션 워크로드에 따라 현장 패치와 재수화 두 가지 방법이 모두 필요할 수 있습니다.

## AWS Organization 전반의 패칭 - Patch Policies

AWS Organization에서 패칭 요구 사항을 표준화하려면 [Quick Setup 내의 Patch Policy](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html)를 사용할 수 있습니다. 여러 운영 체제에 대해 전체 조직에 걸쳐 Patch Policy를 적용할 수 있으며, 여러 계정과 리전에 걸쳐 대상 관리 노드의 리소스 컴플라이언스를 검토할 수 있습니다.

여러 계정에서 Quick Setup을 사용하면 조직이 일관된 구성을 유지할 수 있습니다. 또한 Quick Setup은 주기적으로 구성 드리프트를 확인하고 이를 교정하려고 시도합니다. 구성 드리프트는 사용자가 Quick Setup을 통해 선택한 항목과 충돌하는 서비스 또는 기능을 변경할 때 발생합니다.

![Patch Policy architecture](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Patch Policy architecture")

### 작동 방식

1. Quick Setup을 사용하여 Patch Policy를 생성하면 선택한 파라미터가 CloudFormation으로 전송됩니다.
1. CloudFormation은 정의된 파라미터와 정의된 대상 계정 및 리전으로 스택 세트를 생성합니다. 이는 배포 중 Quick Setup에 의해 생성됩니다.
1. CloudFormation은 각 대상 계정 및 리전에 스택 인스턴스를 생성합니다.
1. 스택 인스턴스는 정의된 패치 스캔을 위한 [State Manager 연결](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html)과 선택한 경우 패치 설치를 위한 연결을 생성합니다. 이러한 연결은 Patch Policy 생성 시 제공된 일정에 따라 적용됩니다.
1. 관리 계정에서 State Manager 연결이 하루에 한 번 Lambda 함수를 호출하는 Automation 런북을 시작합니다.
1. Lambda 함수는 지정된 패치 베이스라인을 JSON 파일로 S3 버킷에 저장합니다. 또한 Lambda 함수는 Quick Setup 내에서 지정된 사용자 지정 패치 베이스라인의 변경 사항을 평가합니다. 사용자 지정 패치 베이스라인이 변경되면 Lambda 함수가 S3 버킷의 JSON 파일을 업데이트합니다.
1. 그러면 관리 노드가 패칭 작업 중 중앙 패치 베이스라인 JSON 파일을 가져와 업데이트를 스캔하거나 설치합니다.

**참고:** 현재 Quick Setup을 통해 Patch Policy를 배포하려면 AWS Organization 내의 관리 계정을 사용해야 합니다. 관리 계정 외부에서 Patch Policy를 배포하려면 [Quick Setup 외부에서 Patch Policy를 배포하는 방법](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US)을 참조하세요.

## 온디맨드 패칭

정기 패칭 주기 외에 긴급 취약점 시나리오 등에서 노드를 패치해야 하는 경우가 있습니다.

**옵션 1:** [Patch now](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html) (*단일 계정/리전*)

* Patch Manager의 **Patch now** 옵션을 사용하면 온디맨드 패칭 작업을 빠르게 실행할 수 있습니다. 그러나 **Patch now**는 한 번에 단일 AWS 계정 및 리전 내에서만 패칭을 허용합니다. 또한 Patch Policy 내에서 정의된 패치 베이스라인을 사용할 수 없습니다. Patch Policy 베이스라인과 다른 승인 규칙에 기반하여 패치 스캔을 수행하거나 적용 가능한 패치를 설치하는 별도의 베이스라인을 생성할 수 있습니다.

**옵션 2:** Automation *(다중 계정/리전)*

* 계정 및 리전에 걸쳐 온디맨드 패칭 작업을 수행하려면 [여러 AWS 리전 및 계정에서 자동화 실행](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)을 지원하는 Automation을 활용할 수 있습니다. 대상 계정에 배포된 IAM 역할을 활용하여 작업을 수행할 수 있습니다. Patch Policy와 통합하거나 독립적인 패칭 요구 사항에 활용할 수 있습니다.

## 취약점 관리 및 해결 통합

[Amazon Inspector](https://aws.amazon.com/inspector)는 Amazon EC2 인스턴스와 Amazon Elastic Container Registry(Amazon ECR)에 저장된 컨테이너 이미지에 대한 지속적인 취약점 스캔을 제공합니다. 이러한 스캔은 소프트웨어 취약점과 의도하지 않은 네트워크 노출을 평가합니다. Amazon Inspector는 Systems Manager(SSM) 에이전트를 사용하여 EC2 인스턴스의 소프트웨어 애플리케이션 인벤토리를 수집합니다. 그런 다음 Inspector는 이 데이터를 스캔하여 소프트웨어 취약점을 식별하며, 이는 취약점 관리의 핵심 단계입니다.

Amazon Inspector가 식별한 취약점을 해결하기 위해 취약점의 심각도에 따라 정기적인 패칭 작업을 수행해야 합니다. AWS Systems Manager Patch Manager를 사용하여 SSM 에이전트를 통해 Systems Manager가 관리하는 노드의 패칭 프로세스를 자동화할 수 있습니다.

패치가 사용 가능한 제로데이 또는 기타 높은/심각 수준의 취약점이 있을 수 있습니다. 그러나 정기 패칭 일정을 기다리지 않고 이를 해결하고 싶을 수 있습니다. 이러한 경우에는 온디맨드 패칭 메커니즘이 존재해야 합니다.

자세한 내용은 다음을 참조하세요:

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Amazon Inspector와 AWS Systems Manager를 사용한 AWS의 취약점 관리 및 해결 자동화 – 1부](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Amazon Inspector와 AWS Systems Manager를 사용한 AWS의 취약점 관리 및 해결 자동화 – 2부](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![Automate vulnerability management and remediation](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "Automate vulnerability management and remediation")

## 패치 컴플라이언스 검토

Patch Manager 대시보드는 현재 AWS 계정 및 리전 내의 패치 컴플라이언스 스냅샷을 제공합니다. 컴플라이언스 보고를 통해 노드의 패치 컴플라이언스를 파악할 수 있습니다. Fleet Manager 콘솔을 사용하여 설치된 패치와 해당 패치의 심각도 및 중요도에 대한 세부 정보도 검토할 수 있습니다.

이러한 뷰는 로컬 AWS 계정 및 리전에 한정되지만, 전체 AWS Organization에 대한 중앙 집중식 패치 컴플라이언스 보고를 생성할 수 있습니다.

## AWS Organization에서 엔드투엔드 패치 관리 및 인벤토리 보고 생성

:::tip
[Amazon Quick Suite](https://aws.amazon.com/quicksuite/)를 사용하면 여러 단계의 수동 프로세스를 몇 가지 간단한 프롬프트로 줄여 인사이트 있는 패칭 컴플라이언스 및 인벤토리 시각화를 빠르게 생성할 수 있다는 것을 알고 계셨나요? AI 기반 기능이 어떻게 동적 대시보드를 생성하여 정확성을 유지하면서 귀중한 시간을 절약하고 조직의 패칭 상태에 대한 실시간 인사이트를 제공하는지 블로그에서 확인하세요: [Amazon Quick Suite를 사용한 엔터프라이즈 패칭 및 인벤토리 대시보드 구축](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/).
:::

AWS Organization 전반의 패치 컴플라이언스에 대한 보고서를 생성하려면 Systems Manager [리소스 데이터 동기화](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html)를 사용하여 모든 관리 노드에서 수집한 인벤토리 데이터를 단일 Amazon S3 버킷으로 전송할 수 있습니다. 리소스 데이터 동기화는 새 인벤토리 데이터가 수집되면 중앙 집중화된 데이터를 자동으로 업데이트합니다.

[AWS Glue 크롤러](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html)를 사용하면 S3의 패치 컴플라이언스 데이터에서 데이터베이스와 테이블을 자동으로 생성한 다음 [Amazon Athena](https://aws.amazon.com/athena/)로 패치 컴플라이언스 데이터를 쿼리할 수 있습니다. 이 솔루션은 인벤토리 및 패치 컴플라이언스 데이터를 시각화하기 위해 [Amazon QuickSight](https://aws.amazon.com/quicksight/)를 활용하지만, S3 버킷에서 데이터를 가져올 수 있는 모든 BI 또는 분석 도구를 사용할 수 있습니다.

**참고:** 노드에서 인벤토리 데이터를 수집하려는 모든 계정 및 리전에 리소스 데이터 동기화를 생성해야 합니다.

![End-to-end patch management reporting](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "End-to-end patch management reporting")

1. 각 계정/리전에 Systems Manager 리소스 데이터 동기화를 생성합니다.
1. 단일 Amazon S3 버킷에 패치 컴플라이언스 데이터를 중앙으로 집계합니다.
1. AWS Glue 크롤러를 사용하여 데이터베이스와 테이블을 자동 생성합니다.
1. Amazon Athena를 사용하여 패치 또는 인벤토리 데이터를 쿼리합니다.
1. Amazon QuickSight를 사용하여 패치 컴플라이언스를 시각화합니다.

## AWS Systems Manager 인벤토리 메타데이터 이해

리소스 데이터 동기화는 온디맨드 작업(인스턴스 등록 또는 종료/패치 스캔 또는 설치 수행), 예약된 작업(소프트웨어 인벤토리 수집, 사용자 지정 인벤토리 메타데이터 수집, 패치 설치 수행, Chef InSpec을 사용한 컴플라이언스 평가)에서 수행된 작업을 기반으로 S3 버킷에 데이터를 푸시합니다.

![Inventory metadata](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "Inventory metadata")

출처: [AWS Systems Manager 인벤토리 메타데이터 이해](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)
