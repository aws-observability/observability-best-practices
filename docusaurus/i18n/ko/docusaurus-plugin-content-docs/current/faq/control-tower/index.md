---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower는 어떤 문제를 해결하나요?

AWS Control Tower는 여러 AWS 계정과 팀을 보유한 조직이 규정 준수 정책을 준수하면서 [다중 계정 AWS 환경](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)을 대규모로 간단하게 설정하고 관리할 수 있도록 도와줍니다.


### AWS Control Tower를 사용하는 데 추가 비용이 있나요?

AWS Control Tower를 사용하는 데 추가 요금이나 선불 약정은 없습니다. AWS Control Tower에 의해 활성화된 AWS 서비스와 랜딩 존에서 사용하는 서비스 및 선택한 컨트롤을 구현하는 데 대해서만 비용을 지불합니다. 예를 들어: - Account Factory를 사용한 계정 프로비저닝을 위한 Service Catalog와 AWS Config를 사용하여 구현되는 필수 컨트롤에 대해 비용을 지불합니다.


### AWS Control Tower의 컨트롤(가드레일)이란 무엇인가요?

[컨트롤](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html)(이전에는 가드레일이라고 불림)은 보안, 운영, 규정 준수를 위해 명확하게 정의된 규칙으로, 비준수 리소스의 배포를 방지하고 배포된 리소스의 규정 준수를 지속적으로 모니터링하는 데 도움을 줍니다.


### AWS Control Tower는 어떤 유형의 컨트롤을 제공하나요?

AWS Control Tower는 세 가지 주요 유형의 컨트롤을 제공합니다:

1. [예방적 컨트롤](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): 작업이 발생하는 것을 방지합니다. AWS Organizations의 서비스 제어 정책(SCP)을 사용하여 구현됩니다.
2. [탐지적 컨트롤](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): 특정 이벤트 또는 리소스의 비준수를 사후에 감지하고 대시보드를 통해 알림을 제공합니다. AWS Config 규칙을 사용하여 구현됩니다.
3. [사전 예방적 컨트롤](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): 리소스가 계정에 프로비저닝되기 전에 회사 정책 및 목표를 준수하는지 확인합니다. 리소스가 규정을 준수하지 않으면 프로비저닝되지 않습니다. 사전 예방적 컨트롤은 AWS CloudFormation 후크를 사용하여 구현됩니다.

 AWS Control Tower에서 이 세 가지 유형의 컨트롤을 결합하면 다중 계정 AWS 환경이 안전하고 모범 사례에 따라 관리되고 있는지 모니터링할 수 있습니다.


### Control Tower는 어떤 AWS 서비스를 오케스트레이션하나요?

AWS Control Tower는 다중 계정 AWS 환경을 설정하고 관리하기 위해 [여러 AWS 서비스](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html)를 오케스트레이션합니다. AWS Control Tower가 오케스트레이션하는 주요 서비스는 다음과 같습니다:
1. AWS Organizations - 다중 계정 환경 전반에 걸쳐 일관된 규정 준수 및 거버넌스를 위한 프레임워크를 설정하는 데 사용됩니다.
2. AWS Service Catalog - 계정 배포 및 등록을 자동화하는 Account Factory 기능에 사용됩니다.
3. AWS IAM Identity Center(이전 AWS SSO) - 사용자 ID 및 연합 접근을 관리하는 데 사용됩니다. 추가로 AWS Control Tower는 다음과 통합됩니다:
4. AWS CloudTrail - 중앙 집중식 로그 아카이브 생성의 일부로 사용됩니다.
5. AWS Config - 배포된 리소스를 모니터링하고 모범 사례로부터의 이탈을 방지하는 데 사용됩니다.



### 기존 ID 제공자를 AWS Control Tower와 함께 사용할 수 있나요?

AWS Control Tower는 ID 제공자 통합을 위해 세 가지 옵션을 제공합니다:
1. IAM Identity Center 사용자 저장소: AWS Control Tower가 IAM Identity Center를 설정하고 관리하는 기본 옵션입니다. IAM Identity Center 디렉터리에 그룹을 생성하고 멤버 계정에서 선택한 사용자에게 이러한 그룹에 대한 접근을 프로비저닝합니다.
2. Active Directory: AWS Control Tower가 Active Directory로 설정된 경우, AWS Control Tower는 IAM Identity Center 디렉터리를 관리하지 않으며 새 AWS 계정에 사용자나 그룹을 할당하지 않습니다.
3. 외부 ID 제공자(IdP): 이 옵션을 사용하면 AWS Control Tower가 IAM Identity Center 디렉터리에 그룹을 생성하고 선택한 사용자에게 이러한 그룹에 대한 접근을 프로비저닝합니다. 계정 생성 시 Microsoft Entra ID, Google Workspace 또는 Okta와 같은 외부 IdP의 기존 사용자를 지정할 수 있으며, IAM Identity Center와 외부 IdP 간에 사용자를 동기화할 때 AWS Control Tower가 이러한 사용자에게 새로 생성된 계정에 대한 접근을 제공합니다.
AWS Control Tower가 자동으로 설정하도록 허용하는 대신 AWS IAM Identity Center를 [자체 관리](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html)하는 옵션도 있습니다.


### 데이터가 암호화되며 자체 AWS Key Management Service 키를 사용할 수 있나요?

AWS Control Tower는 랜딩 존에 대해 두 가지 주요 암호화 옵션을 제공합니다: 1. 기본 암호화: 기본적으로 AWS Control Tower는 랜딩 존의 리소스에 대해 Amazon S3 관리형 키(SSE-S3)를 사용하여 저장 데이터를 암호화합니다. 2. AWS KMS 암호화: 선택적으로 강화된 보안 수준으로, AWS CloudTrail, AWS Config 및 관련 Amazon S3 데이터를 포함하여 AWS Control Tower가 배포하는 서비스를 보호하기 위해 AWS Key Management Service(AWS KMS) 키를 사용하도록 AWS Control Tower를 구성할 수 있습니다. AWS Control Tower 설정 시 AWS Backup을 활성화하기로 선택한 경우, 기존 다중 리전 KMS 키 중 하나를 선택하거나 새 AWS KMS 키를 생성해야 합니다. 이 키는 암호화를 통해 크로스 계정 백업을 보호하는 데 사용됩니다.


### AWS Control Tower를 사용하여 AWS에서 사용 가능한 특정 리전에 대한 접근을 제한할 수 있나요?


AWS Control Tower는 등록된 계정에 대해 특정 리전의 AWS 서비스 접근을 제한하는 [리전 거부](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) 기능을 제공합니다. 이는 특정 리전에 대한 접근을 제한하여 규정 준수 요구 사항을 충족하고 비용을 관리하는 데 도움을 줍니다. 이 기능은 AWS Control Tower의 기존 리전 선택 옵션과 함께 작동합니다. 예를 들어, 독일 고객은 프랑크푸르트 외부의 서비스 접근을 제한할 수 있습니다. 두 가지 컨트롤 수준을 사용할 수 있습니다: 랜딩 존 수준(원래 컨트롤)과 더 세분화된 거버넌스를 위한 [OU 수준](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)(최신 매개변수화된 컨트롤). 이 커스터마이즈를 통해 비즈니스 요구 사항에 맞는 리전 제한을 적용할 수 있습니다.



### 이미 AWS Config 리소스가 있는 기존 AWS 계정을 어떻게 등록하나요?


기존 AWS Config 리소스가 있는 기존 계정을 AWS Control Tower로 마이그레이션하려면 특정 [5단계 프로세스](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)를 따라야 합니다:

1. AWS 고객 지원에 연락하여 계정을 AWS Control Tower 허용 목록에 추가합니다. 티켓 제목에 "Enroll accounts that have existing AWS Config resources into AWS Control Tower"를 포함하세요. 본문에는 관리 계정 번호, 기존 AWS Config 리소스가 있는 멤버 계정 번호, AWS Control Tower 설정을 위해 선택한 홈 리전을 제공하세요. 이 프로세스는 일반적으로 영업일 기준 2일이 소요됩니다.
2. AWS CloudFormation을 사용하여 멤버 계정에 새 IAM 역할을 생성합니다.
3. 기존 AWS Config 리소스가 있는 AWS 리전을 식별합니다.
4. AWS Config 리소스가 없는 AWS 리전을 식별합니다.
5. 각 리전의 기존 AWS Config 리소스를 AWS Control Tower 설정에 맞게 수정한 다음, AWS Control Tower에 계정을 등록합니다.




### 드리프트란 무엇이며 Control Tower 드리프트 및 구성을 어떻게 처리하나요?

AWS Control Tower의 드리프트는 AWS Control Tower 외부에서 구성 변경이 이루어져 리소스가 거버넌스 요구 사항을 준수하지 않게 되는 경우 발생합니다. 일반적인 드리프트 유형은 다음과 같습니다:
 1. 컨트롤 정책 드리프트 - AWS Control Tower가 소유한 정책이 예기치 않게 업데이트되는 경우. 예를 들어, 컨트롤에 대한 SCP가 AWS Organizations 콘솔이나 AWS CLI를 사용하여 프로그래밍 방식으로 업데이트되는 경우.
2. Security Hub 컨트롤 드리프트. 이 유형의 드리프트는 AWS Security Hub Service-Managed Standard: AWS Control Tower의 일부인 컨트롤이 드리프트 상태를 보고할 때 발생합니다.
3. 필수 조직 단위(예: Security OU) 삭제
4. 필수 IAM 역할(AWSControlTowerAdmin, AWSControlTowerCloudTrailRole, AWSControlTowerStackSetRole) 삭제 또는 접근 불가
5. 등록된 AWS Control Tower OU에서 다른 OU로 멤버 계정을 이동하는 경우.

AWS Control Tower는 감지된 드리프트 유형에 따라 다양한 [수정 옵션](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html)을 제공합니다. 수정 조치의 전체 목록은 Control Tower 사용자 가이드를 참조하세요.


### AWS Control Tower 계정 커스터마이즈 옵션은 무엇인가요?


AWS Control Tower는 계정을 커스터마이즈하기 위한 여러 옵션을 제공합니다:
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html)(AFC) - AWS Control Tower 콘솔에서 직접 신규 및 기존 AWS 계정을 커스터마이즈할 수 있습니다. 계정 요구 사항을 정의하고 블루프린트(커스터마이즈된 계정 템플릿)를 사용하여 워크플로의 일부로 구현할 수 있습니다. 이러한 블루프린트는 계정 프로비저닝 시 필요한 특정 리소스와 구성을 설명합니다.
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html)(CfCT) - CfCT는 AWS Control Tower 콘솔을 통해 제공되는 것 이상으로 AWS Control Tower 랜딩 존을 커스터마이즈하는 데 도움이 되는 기능 패키지입니다. AWS CloudFormation 템플릿, 서비스 제어 정책(SCP) 및 리소스 제어 정책(RCP)을 사용하여 조직 내의 개별 계정과 조직 단위(OU)에 배포할 수 있는 커스터마이즈를 구현할 수 있습니다. CfCT는 AWS Control Tower 라이프사이클 이벤트와 통합되어 리소스 배포가 랜딩 존과 동기화된 상태를 유지하도록 보장합니다.
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html)(AFT)은 Terraform을 사용하여 AWS 계정을 프로비저닝하고 커스터마이즈할 수 있는 솔루션입니다. AFT 기능을 배포하기 위해 별도의 AFT 관리 계정(AWS Control Tower 관리 계정과 다름)을 생성합니다. AFT는 모든 Terraform Distribution(Community Edition, Cloud, Enterprise)을 지원하여 유연성을 제공합니다.


### CfCT의 설정 소스로 GitHub를 사용할 수 있나요?


네, GitHub를 Customizations for AWS Control Tower(CfCT)의 설정 소스로 사용할 수 있습니다. CfCT를 배포할 때 기본 Amazon S3 옵션 대신 AWS CodePipeline 소스로 GitHub(Code Connection을 통해)를 선택하는 옵션이 있습니다.


### AFT 리포지토리로 GitHub를 사용할 수 있나요?


네, AWS Control Tower Account Factory for Terraform(AFT)을 AWS CodeCommit에서 다른 VCS 제공자로 이동할 수 있습니다. CodeCommit에서 다른 VCS 제공자로 마이그레이션하려면 다음 단계를 따르세요: 1. 선택한 VCS 제공자에 새 리포지토리를 설정합니다. 2. git에서 이러한 리포지토리를 새 remote로 추가합니다. 3. 새 VCS 제공자로 git push를 실행합니다. 4. AWS Control Tower 관리 계정에서 Terraform 모듈(bootstrap)을 새 VCS 제공자를 가리키도록 업데이트합니다. 5. terraform plan을 수행하여 변경 사항을 미리 확인한 다음 terraform apply를 실행합니다. 6. AFT 관리 계정에 로그인하고 새 VCS 제공자에 대한 대기 중인 AWS CodeConnections을 완료합니다. AFT가 원하는 코드를 올바르게 실행할 수 있도록 리포지토리 구조는 AWS CodeCommit에서와 동일하게 유지해야 합니다.

### AFT와 함께 OpenTofu를 사용할 수 있나요?

OpenTofu는 Terraform에서 포크된 인기 있는 오픈 소스 IaC(Infrastructure as Code) 도구입니다. OpenTofu에는 일부 조정을 통해 AFT 기능을 지원할 수 있는 sourcefuse/arc-control-tower-aft 모듈이 있지만, AWS에서 지원하지는 않습니다.

### CfCT의 VCS로 Gitlab을 사용할 수 있나요?

아니요, CfCT에 대한 Gitlab 지원은 아직 제공되지 않습니다. v2.8.1부터 Github을 VCS로 사용할 수 있습니다.

### 이미 Landing Zone Accelerator(LZA)를 배포했는데, AWS Control Tower를 계속 사용할 수 있나요?


AWS Control Tower와 Landing Zone Accelerator(LZA)는 상호 보완적인 솔루션으로 잘 함께 작동합니다. 권장되는 모범 사례는 먼저 AWS Control Tower를 기본 랜딩 존으로 배포한 다음 필요에 따라 LZA로 기능을 강화하는 것입니다. LZA는 AWS 모범 사례 및 여러 글로벌 규정 준수 프레임워크에 부합하도록 설계된 기본 기능을 배포하는 AWS Cloud Development Kit(CDK)을 사용하여 구축된 솔루션입니다. 다중 계정 환경을 보다 효과적으로 관리하고 거버넌스하는 데 도움을 줍니다. LZA 솔루션은 안전한 워크로드를 호스팅하기에 적합한 클라우드 환경을 자동으로 설정합니다. 운영 및 거버넌스의 일관성을 유지하기 위해 모든 AWS 리전에 배포할 수 있습니다. AWS Control Tower를 LZA와 통합하면 모범 사례 및 규정 준수 요구 사항에 부합하도록 유지하면서 랜딩 존을 커스터마이즈할 수 있습니다.



### API를 사용하여 AWS Control Tower 설정과 상호 작용할 수 있나요?


AWS Control Tower는 다양한 작업을 자동화할 수 있는 [여러 API](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html)를 제공합니다: 1. 컨트롤 API: - EnableControl: 컨트롤을 활성화하여 지정된 조직 단위와 해당 계정에 AWS 리소스를 생성합니다. - DisableControl: 컨트롤을 끄고 지정된 조직 단위와 해당 계정에서 AWS 리소스를 삭제합니다. - GetControlOperation: 컨트롤 작업에 대한 정보를 검색합니다. 이 API를 사용하면 프로그래밍 방식으로 컨트롤(가드레일이라고도 함)을 관리하고, 적용 상태를 확인하며, 지원되는 리전, 식별자(ARN), 드리프트 상태 및 상태 요약을 포함한 활성화된 컨트롤에 대한 정보를 얻을 수 있습니다. 2. 랜딩 존 API: 랜딩 존과 관련된 작업을 자동화하는 데 도움을 줍니다. 3. 베이스라인 API: 조직 단위(OU) 등록과 같은 특정 작업을 자동화하는 데 도움을 줍니다. API Reference 문서를 참조할 수 있습니다.


### Control Tower에서 생성한 계정의 이메일 주소를 어떻게 변경하나요?


AWS Control Tower에 등록된 멤버 계정의 이메일 주소를 변경하려면 다음 단계를 따라야 합니다: 1. 계정의 루트 사용자 비밀번호를 복구합니다. 2. 루트 사용자 비밀번호로 계정에 로그인합니다. 3. 다른 AWS 계정과 마찬가지로 이메일 주소를 변경하고 AWS Organizations에 변경 사항이 반영될 때까지 기다립니다. 이메일 주소 변경이 업데이트를 완료하는 동안 지연이 있을 수 있습니다. 4. 이전에 해당 계정에 속했던 이메일 주소를 사용하여 Service Catalog에서 프로비저닝된 제품을 업데이트합니다. 이 프로세스는 새 이메일 주소를 프로비저닝된 제품과 연결하여 AWS Control Tower에서 이메일 주소 변경이 적용되도록 합니다. 그러나 이 절차는 관리 계정, 로그 아카이브 계정 또는 감사 계정의 이메일 주소를 변경하는 것은 허용하지 않는다는 점에 유의하세요.



### 네트워크 간 연결 고려 사항


AWS Control Tower는 기본적으로 조직 단위(OU) 내에서 생성된 모든 계정의 모든 VPC에 동일한 CIDR 범위(172.31.0.0/16)를 할당합니다. 이 기본 구성은 IP 주소가 겹치므로 AWS Control Tower VPC 간의 피어링을 초기에 허용하지 않습니다. AWS Control Tower에서 VPC 피어링을 지원하려면 Account Factory 설정에서 CIDR 범위를 수정하여 VPC 간에 IP 주소가 겹치지 않도록 해야 합니다. Account Factory 설정에서 CIDR 범위를 변경하면 이후에 생성되는 모든 새 계정에 새 CIDR 범위가 할당되며, 기존 계정은 원래 CIDR 범위를 유지합니다. 이 접근 방식을 통해 서로 다른 IP 주소 범위를 가진 VPC 간의 피어링이 가능합니다.


### 기존 보안 및 로깅 계정이 이미 있는데, 기존 계정을 AWS Control Tower의 감사 및 로깅 계정으로 사용할 수 있나요?


네, AWS Control Tower는 초기 랜딩 존 설정 프로세스 중에 기존 AWS 계정을 감사(보안) 및 로그 아카이브(로깅) 계정으로 지정하는 옵션을 제공합니다. 이 기능을 사용하면 AWS Control Tower가 새 공유 계정을 생성할 필요가 없습니다. 랜딩 존을 설정할 때 다음 중에서 선택할 수 있습니다: 1. AWS Control Tower가 새 공유 계정을 생성하도록 하거나, 2. 감사 및 로깅 목적으로 기존 계정을 가져옵니다. 기존 계정을 사용하기로 선택한 경우 설정 프로세스 중에 이러한 계정과 관련된 고유한 이메일 주소를 제공해야 합니다. 이 옵션은 초기 랜딩 존 설정 중에만 사용 가능합니다. 기존 계정을 사용하면 기존 조직에 AWS Control Tower 거버넌스를 확장하거나 대체 랜딩 존에서 AWS Control Tower로 이전하는 것이 더 쉬워집니다.


### 기존 외부 IDP가 이미 있는데, Control Tower를 활성화하면 AWS Control Tower가 기존 설정에 어떤 변경을 하나요?


기존 ID 제공자로 AWS Control Tower를 설정할 때 선택한 ID 소스에 따라 다른 영향이 있습니다: IAM Identity Center가 조직에서 이미 활성화되어 있고 IAM Identity Center Directory를 사용하는 경우, AWS Control Tower는 기존 구성을 삭제하지 않고 권한 세트 및 그룹과 같은 리소스를 추가합니다. 다른 디렉터리(외부, AD, Managed AD)를 사용하는 경우, AWS Control Tower는 기존 구성을 변경하지 않습니다.


### AWS Control Tower는 중첩된 OU를 지원하나요?


네, AWS Control Tower는 중첩된 조직 단위(OU)를 지원합니다. AWS Control Tower의 중첩된 OU를 사용하면 계정을 여러 계층 수준으로 구성하고 컨트롤을 계층적으로 적용할 수 있습니다. 중첩된 OU는 다른 OU 내에 포함된 OU로, 하나의 OU에 연결된 정책이 그 아래의 모든 OU와 계정에 적용되는 계층 구조를 만듭니다. AWS Control Tower의 중첩된 OU 계층은 최대 5단계까지 가능합니다. 기존 다단계 OU를 등록하고, 새 중첩된 OU를 생성하며, 계층 구조의 깊이에 관계없이 등록된 모든 OU에서 컨트롤을 활성화할 수 있습니다. 중첩된 OU를 사용하면 AWS Control Tower OU를 AWS 다중 계정 전략에 맞출 수 있으며, 상위 OU 수준에서 컨트롤을 적용하여 여러 OU에서 컨트롤을 활성화하는 데 필요한 시간을 줄일 수 있습니다.


### AWS Control Tower는 AWS GovCloud에서 지원되나요?


네, AWS Control Tower는 [GovCloud에서 지원됩니다](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html). 그러나 AWS GovCloud(US)의 AWS Control Tower는 더 엄격한 규정 준수 및 운영 요구 사항으로 인해 상용 리전과 다릅니다. GovCloud에서는 직접 계정 생성이 불가능하므로 랜딩 존 설정 시 기존 감사 및 로그 아카이브 계정을 사용해야 합니다. GovCloud 계정은 상용 리전의 CreateGovCloudAccount API를 통해 생성되고 청구/지원을 위해 연결되지만, GovCloud 조직에만 참여할 수 있습니다. Account Factory 계정 생성, GDPR 규정 준수, 특정 Security Hub 컨트롤, 리소스 제어 정책(RCP)과 같은 일부 기능은 지원되지 않습니다.



### AWS Control Tower는 리소스 제어 정책(RCP)을 사용하나요?

AWS Control Tower는 이제 리소스 제어 정책(RCP)으로 구현되는 예방적 컨트롤을 지원합니다. 이러한 RCP 기반 컨트롤은 AWS Control Tower 환경 전반에 걸쳐 의도하지 않은 접근으로부터 리소스를 보호하는 데이터 경계를 설정하는 데 도움을 줍니다. RCP를 사용하면 개별 버킷 정책에 부여된 권한에 관계없이 조직의 Amazon S3 리소스가 조직에 속한 IAM 보안 주체 또는 AWS 서비스에 의해서만 접근 가능하도록 하는 등의 요구 사항을 적용할 수 있습니다. RCP 기반 예방적 컨트롤은 AWS Control Tower가 사용 가능한 모든 AWS 리전에서 사용할 수 있습니다. 특정 보안 주체 또는 리소스가 컨트롤에 의해 관리되지 않도록 하려면 이러한 컨트롤에 대한 예외를 구성할 수도 있습니다. 또한 AWS Control Tower는 이제 RCP로 구현된 컨트롤에 대한 컨트롤 정책 드리프트를 보고하고 컨트롤 드리프트를 프로그래밍 방식으로 관리하는 데 도움이 되는 ResetEnabledControl API를 제공하여 컨트롤 드리프트를 복구하고 의도한 구성으로 컨트롤을 재설정할 수 있습니다. AWS Control Tower는 또한 Customizations for AWS Control Tower(CFCT)에 대한 RCP를 지원하여 이러한 정책을 커스터마이즈 워크플로에 통합할 수 있습니다.


### 구현 전에 OU에서 정책을 어떻게 테스트하나요?

정책 스테이징 OU는 프로덕션에 배포하기 전에 AWS 정책, 컨트롤 및 서비스를 테스트하고 검증하기 위한 통제된 환경 역할을 합니다. 조직이 새로운 정책, 가드레일 및 구성이 운영 계정에 영향을 미치지 않으면서 의도대로 작동하는지 확인할 수 있도록 합니다. 이 접근 방식은 의도하지 않은 결과를 방지하고 정책의 효과를 보장하는 데 도움을 줍니다. 스테이징 OU는 일반적으로 프로덕션 환경의 구조를 미러링하는 테스트 계정을 포함하여 프로덕션 OU 또는 계정에 적용하기 전에 정책 변경을 철저히 검증할 수 있습니다. 이 관행은 거버넌스에 대한 AWS 모범 사례에 부합하며 새로운 컨트롤을 구현하면서 운영 안정성을 유지하는 데 도움을 줍니다.