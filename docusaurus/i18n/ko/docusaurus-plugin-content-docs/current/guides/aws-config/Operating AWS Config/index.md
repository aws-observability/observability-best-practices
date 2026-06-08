---
sidebar_position: 1
---
# AWS Config 운영

### **모든 계정의 모든 리전에서 AWS Config 활성화**

여러 AWS 계정을 운영하는 고객의 경우, 전체 조직에 걸쳐 AWS Config를 구현하는 것을 권장합니다. AWS Config는 리전별 서비스이므로, 리소스 구성 변경과 규정 준수 평가를 추적하려는 각 리전에서 활성화해야 합니다. 이를 수행하는 세 가지 방법이 있습니다:


1. CloudFormation StackSets 사용:
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)는 여러 리전과 계정에 동시에 AWS Config를 활성화하고, 조직 전체에 구성 레코더를 배포하며, 모든 계정에서 일관된 설정을 유지하기 위한 사전 구축된 템플릿을 제공합니다. CloudFormation을 사용하여 조직 전체에 AWS Config를 배포하려면 [이 블로그를 참조](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/)하세요.
2. AWS Systems Manager Quick Setup 사용:
     [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html)은 전체 조직에 걸쳐 Config 레코더를 활성화하는 간소화된 방법을 제공합니다. Systems Manager Quick Setup을 사용하여 조직 전체에 AWS Config를 배포하려면 [이 블로그를 참조](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/)하세요.
3. AWS Control Tower:
    [AWS Control Tower](https://aws.amazon.com/controltower/)는 중앙 위치에서 여러 AWS 계정을 안전하게 설정하고 관리하는 데 도움이 됩니다. 활성화하면 Control Tower가 등록된 모든 계정에서 AWS Config를 자동으로 활성화합니다. AWS Control Tower를 시작하려면 [AWS Control Tower 시작하기 공식 문서](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html)를 참조하세요.



### AWS Config 레코더 설정

AWS Config 레코더 설정을 구성할 때, 중요한 모범 사례는 [모든 리소스 유형](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)에 대한 추적을 활성화하는 것입니다. 모든 리소스를 활성화하면 Config 추적에 사용 가능한 새로운 AWS 서비스 리소스 유형이 자동으로 포함되어, 수동 개입 없이 구성 관리가 최신 상태를 유지하는 추가적인 이점이 있습니다.
[글로벌 리소스](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global)의 경우, [IAM](https://aws.amazon.com/iam/) 등은 한 리전에서만 기록을 활성화하는 것이 중요합니다(AWS Config는 고객의 홈 또는 기본 리전에서 활성화해야 합니다). 이 구성은 두 가지 목적을 달성합니다: 중복 구성 항목을 방지하고 불필요한 비용을 피할 수 있습니다. 여러 리전에서 글로벌 리소스 기록을 활성화하면, 중복 구성 추적이 발생하고 동일한 글로벌 리소스를 여러 번 모니터링하는 데 추가 비용이 발생합니다. 예를 들어, IAM 사용자, 역할, 정책을 추적할 때 글로벌 리소스 기록을 위한 기본 리전(예: us-east-1)을 지정하고 다른 모든 리전에서는 이 기능을 비활성화해야 합니다.


### 전달 방법 모범 사례

AWS 구성 관리를 구현할 때 구성 항목에 대한 적절한 전달 방법을 설정하는 것이 매우 중요합니다. 모범 사례는 중앙 계정(로깅 계정 또는 다른 지정된 계정) 내에 중앙 집중식 [Amazon S3 버킷](https://aws.amazon.com/pm/serv-s3/)을 지정하는 것입니다. 이 중앙 집중화를 통해 구성 항목 로그를 더 잘 조직하고 관리할 수 있습니다. 버킷 내 명확한 조직을 유지하기 위해, 각 구성 항목의 소스 계정과 리전을 명확히 식별하는 구조화된 접두사 시스템을 구현하는 것이 좋습니다. 또한 전송 중 및 저장 시 암호화 활성화, 퍼블릭 액세스 비활성화, 엄격한 액세스 제어 유지와 같은 [S3 버킷 보안 모범 사례](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.htm)를 구현하세요. 이러한 보안 조치는 데이터 보호 표준 준수를 보장하고 보안 위험을 최소화합니다.

AWS Config가 구성 변경 및 규정 준수 상태 업데이트를 지정된 SNS 주제로 자동 스트리밍하도록 구성할 수도 있습니다. 여러 AWS 계정이 있는 엔터프라이즈 환경에서는 이러한 알림을 통합하기 위해 중앙 SNS 주제를 설정할 수 있습니다. 이 중앙 집중식 접근 방식을 통해 IT 및 보안 팀은 조직 전체의 구성 변경을 효율적으로 모니터링하고 대응할 수 있습니다. 이를 위해 [이 문서를 참조](https://docs.aws.amazon.com/config/latest/developerguide/notifications-for-AWS-Config.html)하세요.



### AWS Config 위임된 관리자

AWS Config의 위임된 관리자는 전체 조직에 걸쳐 구성 설정을 관리하는 권한을 받는 AWS 조직 내의 지정된 멤버 계정입니다. 이 관리자는 AWS Config 규칙을 배포하고 관리하며, 적합성 팩을 처리하고, 여러 계정의 구성 데이터를 집계할 수 있습니다. 조직 전체의 리소스 구성과 규정 준수 상태에 대한 가시성을 가지며, 중앙 집중식 관리와 모니터링을 가능하게 합니다. [AWS Config 운영 및 집계를 위한 위임된 관리자 사용](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/) 블로그를 참조하세요.

AWS Config에 위임된 관리자를 사용하는 것이 모범 사례인 이유는, 관리 계정의 사용을 필수적인 조직 작업으로만 제한하여 보호하면서 AWS Config 관련 관리 업무를 지정된 멤버 계정에 위임하기 때문입니다. 이 접근 방식은 최소 권한 원칙을 따르고, 보안 위험을 줄이며, 지정된 계정에서 Config 관리를 중앙 집중화하여 더 나은 운영 제어를 제공합니다.
