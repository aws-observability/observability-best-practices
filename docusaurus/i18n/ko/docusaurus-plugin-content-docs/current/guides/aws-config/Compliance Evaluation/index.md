---
sidebar_position: 3
---
# 규정 준수 평가

AWS Config는 AWS 환경 내에서 리소스 구성을 평가하기 위한 두 가지 주요 규칙 유형을 제공합니다. 첫 번째 유형인 [관리형 규칙](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html)은 AWS에서 제공하는 사전 구축된 규칙으로, 다양한 보안, 운영, 규정 준수 사용 사례를 다룹니다. 관리형 규칙은 모범 사례와 일반적인 규정 준수 표준에 대해 AWS 리소스를 평가하는 사전 구성된 규칙 템플릿입니다. 두 번째 유형인 [사용자 정의 규칙](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)은 조직이 자체 규칙을 만들어 조직별 규정 준수 요구 사항과 검사를 구현할 수 있게 합니다.

사용자 정의 규칙은 AWS Lambda 함수를 통해 만들 수 있으며, 여기서 AWS 리소스가 규정을 준수하는지 여부를 평가하는 로직을 코딩합니다. AWS Config는 [Guard 사용자 정의 정책을 사용하여 사용자 정의 규칙 생성](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/)도 허용합니다. [Guard 사용자 정의 정책](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)은 Lambda 함수를 만들 필요 없이 사용자 정의 규칙 생성을 간소화합니다. Guard 사용자 정의 정책을 사용하면 [Guard 도메인 특화 언어(DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html)를 사용하여 정의된 정책에 대해 리소스를 평가하기 위한 정책 코드를 정의할 수 있습니다.

AWS Config는 수정 작업을 위해 [Systems Manager Automation 문서](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/)와 기본적으로 통합됩니다. AWS Systems Manager Automation 문서를 사용하여 자체 사용자 정의 수정 작업을 만들 수 있으며, AWS Config를 통해 수동 또는 자동 수정을 선택할 수 있습니다.

또한, AWS는 [서비스 연결 규칙](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html)도 제공합니다. 이 규칙은 다른 AWS 서비스에 의해 자동으로 생성 및 관리되며, 해당 서비스에 특화된 리소스 구성을 평가합니다. 예를 들어, AWS Security Hub는 보안 모범 사례와 표준을 평가하기 위해 AWS Config에 서비스 연결 규칙을 만들 수 있습니다. [조직 규칙](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html)도 배포할 수 있으며, 이를 통해 AWS Organizations 구조 내 여러 계정에 걸쳐 규칙을 배포하고 관리하여 전체 AWS 환경에서 일관된 규정 준수를 더 쉽게 유지할 수 있습니다.

### 적합성 팩:

관리형 규칙이나 사용자 정의 규칙을 개별적으로 특정 리전과 계정에 배포하는 대신, [적합성 팩](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)으로 번들링하는 것이 모범 사례입니다. AWS 적합성 팩은 여러 계정과 리전에 걸쳐 수백 개의 규칙을 배포하고 모니터링할 수 있는 단일 제어 지점을 제공하여 대규모로 일관된 보안 및 규정 준수 표준을 보장합니다. [일반적인 프레임워크를 위한 사전 구축된 템플릿](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html)(HIPAA, NIST, PCI-DSS 등)을 제공하고 사용자 정의 규칙 생성을 허용하여, 규정 준수 관리에 필요한 시간과 노력을 크게 줄입니다. 이러한 팩은 Config 규칙의 불변 그룹을 나타내며, 적합성 팩 자체에 대한 공식적인 업데이트를 통해서만 변경할 수 있습니다. 이 접근 방식은 규정 준수 규칙에 대한 더 나은 거버넌스와 제어를 제공합니다.


#### 조직 배포:

AWS를 사용하면 AWS Organization 전체에 자동 배포를 위한 조직 적합성 팩을 활용할 수 있습니다. 이 기능은 적합성 팩과 개별 Config 규칙 모두에 적용됩니다. AWS Config는 위임된 관리자 기능도 지원하여, 조직 전체의 적합성 팩 배포를 관리하기 위한 특정 계정을 지정할 수 있습니다. 불변성 같은 이점을 유지하면서 [위임된 관리자를 사용한 적합성 팩 배포](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/)에 대한 문서를 참조하세요.


### AWS Config Rules Development Kit (RDK)

AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk)(RDK)는 AWS 샘플 GitHub 리포지토리에서 사용할 수 있으며, 사용자 정의 Config 규칙의 생성을 간소화합니다. 리소스 평가 구현에 최소한의 수정만 필요한 보일러플레이트 코드 템플릿을 제공합니다. RDK는 위에서 언급한 중앙 집중식 Lambda 함수 접근 방식을 포함한 다양한 배포 시나리오를 지원합니다.

AWS Config RDK를 사용하여 [대규모 사용자 정의 AWS Config 규칙 구축 및 운영](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/) 블로그를 참조하세요.

#### Lambda 함수 중앙 집중화

여러 사용자 정의 규칙이 필요한 다중 계정 환경에서는 Lambda 함수를 단일 계정(보안 또는 규정 준수 계정 등)에 중앙 집중화하는 것이 권장됩니다. 다른 계정의 사용자 정의 규칙이 이러한 중앙 집중화된 함수를 호출할 수 있습니다.

### 글로벌 리소스 관리

글로벌 리소스(예: IAM 규칙)를 평가하는 규칙의 경우, 중복 비용과 불필요한 API 호출을 방지하기 위해 한 리전에서만 배포하세요. 이 관행은 효과적인 규정 준수 모니터링을 유지하면서 비용 효율성과 리소스 활용도를 모두 최적화합니다.


### 평가 관리

규칙 평가를 관리할 때 평가 결과 삭제나 재평가 트리거 옵션에 주의하세요. 이러한 기능을 자주 사용하면 리소스에 대한 새로운 [구성 항목](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html)이 생성되어 스토리지 및 처리 요구 사항에 잠재적으로 영향을 미칠 수 있습니다.



## 교차 계정 집계 및 쿼리

조직이 여러 리전과 계정에서 AWS Config를 활성화하면, 포괄적인 가시성과 관리를 위해 데이터를 중앙 집중화하는 것이 매우 중요해집니다. [AWS Config 집계자](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html)는 다양한 리전과 계정의 구성 관련 데이터를 단일 지정된 집계자 계정으로 통합하는 무료 기능을 제공합니다. 이 중앙 집중화는 AWS 환경에 대한 통합된 뷰를 제공하여, 조직 전체에서 Config 규칙 평가, 적합성 팩 평가, 전반적인 규정 준수 상태를 더 쉽게 모니터링할 수 있게 합니다. 조직 전체 집계자를 배포하려면 [이 블로그를 참조](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/)하세요.

중앙 계정의 집계된 데이터는 [고급 쿼리](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html) 기능을 열어줍니다. 이 기능을 사용하면 AWS 환경 전체에서 복잡한 쿼리를 수행하여 리소스 구성과 규정 준수 상태에 대한 인사이트를 제공할 수 있습니다. 예를 들어, 간단한 SQL과 유사한 구문을 사용하여 계정 전체에서 연결되지 않은 모든 EBS 볼륨을 쉽게 식별할 수 있습니다. 이러한 고급 쿼리는 운영 및 규정 준수 관련 데이터를 모두 제공하여 AWS 인프라를 효과적으로 관리하고 최적화하는 능력을 향상시킵니다.

S3의 [AWS Config 구성 스냅샷 데이터](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html)는 [Amazon Athena](https://aws.amazon.com/athena/)를 사용하여 쿼리할 수 있으며, 고객은 [Amazon QuickSight](https://aws.amazon.com/quicksight)를 사용하여 맞춤형 시각화를 생성할 수 있습니다. AWS Config 데이터를 집계하고, 고급 쿼리를 수행하며, 맞춤형 인벤토리 대시보드를 만드는 방법을 알아보려면 [AWS Config를 사용한 모니터링 워크숍](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config)을 참조하세요. [AWS Config 리소스 규정 준수 대시보드](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) 워크숍도 참조하세요. 이 워크숍은 [AWS Organizations에서 AWS Config 대시보드를 배포](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard)하는 방법을 보여줍니다.
