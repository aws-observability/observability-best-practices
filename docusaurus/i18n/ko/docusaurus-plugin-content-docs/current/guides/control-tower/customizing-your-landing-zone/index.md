---
sidebar_position: 3
---
# 랜딩 존 사용자 지정


Control Tower는 잘 거버넌스된 랜딩 존의 출발점을 정의하지만, 대부분의 고객은 워크로드를 위한 추가 플랫폼 서비스를 구현해야 합니다. 여기에는 중앙 집중식 네트워킹, 보안 서비스, 중앙 집중식 Observability 서비스 등이 포함될 수 있습니다.

## Infrastructure as Code 사용

추가 플랫폼 서비스는 Infrastructure as Code(IaC)를 사용하여 정의하고 배포해야 합니다. IaC는 다음을 가능하게 합니다:

* 모든 계정과 리전에 걸쳐 동일한 구성 보장
* 버전 제어 및 변경 관리 지원, 피어 리뷰와 롤백을 지원하며 모든 변경 사항이 기록되고 감사 가능하도록 보장
* Control Tower 수명 주기 이벤트에 대응하여 배포가 트리거될 수 있는 신속한 자동화된 계정 프로비저닝 지원

## 올바른 사용자 지정 옵션 선택

시작 단계에서 올바른 사용자 지정 접근 방식을 선택하는 것이 매우 중요합니다. 이는 향후 운영 모델과 유연성에 큰 영향을 미칩니다. 선택은 조직의 Infrastructure as Code 선호도, 운영 요구사항, 원하는 사용자 지정 유연성 수준 등의 요소에 따라 달라집니다. 랜딩 존에 대해 하나의 사용자 지정 옵션만 구현하는 것을 권장합니다.

Control Tower를 코드로 사용자 지정하는 네 가지 주요 옵션이 있습니다:

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT)
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

CloudFormation에서 인프라 리소스를 정의하고 기본 [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) 기능을 사용하여 특정 계정에 배포할 수 있습니다. StackSet을 사용하면 단일 템플릿을 사용하여 여러 리전에 걸쳐 스택을 생성할 수 있습니다. CloudFormation은 새 AWS Organizations 계정이 대상 조직 또는 조직 단위(OU)에 추가될 때 [자동으로 추가 스택을 배포](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html)할 수 있으며, [일부 주의사항](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations)이 있습니다.

StackSets는 최소한의 종속성을 가진 간단한 템플릿을 배포하는 데 유용하며(Control Tower 자체가 기본 IAM 역할 같은 것을 배포하는 데 사용합니다), 하지만 CI/CD가 없고 Control Tower의 계정 프로비저닝 프로세스와의 통합 또는 인식이 부족하여 더 복잡한 사용자 지정에는 어려움이 있습니다.

CloudFormation으로 간단한 사용자 지정을 배포하기 위한 관리형 서비스를 원한다면 AFC를 고려하세요. CI/CD를 지원하는 CloudFormation 기반 솔루션을 원한다면 CfCT를 고려하세요.


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html)는 기본 Control Tower 기능으로 AWS Control Tower의 계정 프로비저닝 워크플로와 직접 통합됩니다. 계정이 프로비저닝될 때 리소스와 구성으로 계정을 기준화하는 데 사용되는 블루프린트를 정의할 수 있습니다(계정 프로비저닝에 사용하는 것에 따라 CloudFormation 또는 Terraform으로).

블루프린트는 Service Catalog에서 업데이트하고 버전을 관리할 수 있습니다. Control Tower 계정 업데이트 프로세스를 사용하여 업데이트된 기준을 적용할 수 있습니다. AFC에서 여러 블루프린트를 정의할 수 있지만, 아직 단일 블루프린트 이상으로 계정을 기준화하는 것은 불가능합니다. 이로 인해 AFC를 더 복잡한 사용자 지정에 사용하기 어렵습니다.

간단한 사용자 지정이 필요하고, 계정당 단일 기준이면 충분하며, 사용자 지정 프로세스를 위한 리소스를 관리하고 싶지 않은 경우 AFC를 사용하세요.


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html)는 Control Tower 관리 계정의 Control Tower 홈 리전에 AWS Code Pipeline 파이프라인을 구현하는 AWS 솔루션입니다. 이는 S3 또는 Github의 CloudFormation 템플릿 리포지토리로 지원됩니다. Organization의 대상 계정과 OU에 CloudFormation 템플릿, SCP, RCP 배포를 지원합니다. CfCT는 계정 생성 자동화를 지원하지 않습니다. 대신 Control Tower의 수명 주기 이벤트와 통합되어 Control Tower의 Account Factory를 통해 생성된 새 계정에 대해 사용자 지정이 자동으로 트리거될 수 있습니다.

사내에 CloudFormation 스킬이 있고 관리 계정에서 솔루션을 유지 관리하고 [업데이트](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html)할 의향이 있는 경우 CfCT를 사용하세요.



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html)는 Terraform을 사용하며, 따라서 직접 AWS API 호출을 통해 계정 생성 및 사용자 지정의 전체 프로세스를 관리합니다. 사용자 지정에 매우 유연한 솔루션이지만, 관리 오버헤드가 증가하는 대가가 있습니다. CfCT와 달리 AFT는 계정 생성부터 계정 사용자 지정까지 전체 프로세스를 자동화할 수 있습니다. 또한 계정 사용자 지정의 Terraform 상태 파일을 관리하도록 설계되었습니다.

Control Tower 사전 대응적 컨트롤(CloudFormation Guard 규칙으로 구현)은 리소스가 CloudFormation을 사용하여 배포되지 않기 때문에 적용되지 않는다는 점도 유의하세요.

사내에 Terraform 스킬이 있고, Terraform 상태 및 프로세스 설정과 유지 관리에 경험이 있으며, 여러 리포지토리를 관리하고 계정을 생성하고 사용자 지정하는 여러 팀 간의 조정이 필요한 경우 AFT를 사용하세요.


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/)는 AWS 모범 사례와 보안 프레임워크를 기반으로 안전한 멀티 계정 환경을 구현하기 위한 AWS 솔루션입니다. LZA는 AWS Control Tower를 필요로 하지 않지만, Control Tower를 기반 랜딩 존으로 사용하고 그 위에 LZA를 구현하는 것이 [권장됩니다](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html). LZA는 보안 도구 및 공유 네트워킹 서비스를 포함한 일반적인 랜딩 존 기능의 의견이 반영된(opinionated) 배포를 제공하며, 구성 파일을 통해 제한된 사용자 지정이 가능합니다. 이를 통해 엄격한 보안 및 규정 준수 요구사항을 가진 AWS 고객이 클라우드 기반을 신속하게 구성할 수 있습니다.

고도로 규제되는 분야에 있거나, 안전하고 규정을 준수하는 랜딩 존을 빠르게 배포해야 하거나, 인프라 배포에 대한 더 의견이 반영된 접근 방식에 만족하거나, 솔루션을 유지 관리할 의향이 있으며, 문제가 발생할 경우 기본 CDK 코드를 이해하고 관리할 준비가 된 경우 LZA를 사용하세요.


| 기능 | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| 서비스 관리형 | 예 | 아니오 | 아니오 | 아니오 |
| IaC 엔진 | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| SCP 배포 | 아니오 | 예 | 예 | 예 |
| 다중 구성 패키지 지원 | 아니오 | 예 | 예 | 예 |
| 학습 곡선 | 낮음 | 중간 | 높음 | 낮음 |
| 운영 오버헤드 | 낮음 | 중간 | 높음 | 중간 |
| API 지원 | 아니오 | 예 | 예 | 예 |
| 버전 제어 통합 | 아니오 | 예 | 예 | 예 |
| 위임된 관리 | 아니오 | 아니오 | 예 | 예 |
| 계정 프로비저닝 | 직접 | 수명 주기 이벤트를 통해서만 | 직접 | 직접 |
| 콘솔 관리 | 예 | 제한적 | 제한적 | 제한적 |
| 배포 복잡성 | 낮음 | 중간 | 높음 | 중간 |
| 사용자 지정 유연성 | 제한적 | 높음 | 매우 높음 | 높음 |
| 사전 대응적 컨트롤 적용 | 예 | 예 | 아니오 | 예 |
