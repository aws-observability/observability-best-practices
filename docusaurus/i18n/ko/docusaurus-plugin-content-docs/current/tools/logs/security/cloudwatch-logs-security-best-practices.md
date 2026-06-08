# CloudWatch Logs 보안 모범 사례

Amazon CloudWatch Logs를 안전하게 보호하는 것은 규정 준수를 유지하고, 민감한 데이터를 보호하며, 적절한 감사 추적을 보장하는 데 필수적입니다. 이 가이드는 로그 그룹에 대한 강력한 권한 제어 및 보안 정책을 구현하기 위한 포괄적인 모범 사례를 제공하며, 중요한 삭제 보호 기능도 포함합니다.

## 소개

Amazon CloudWatch Logs를 사용하면 시스템, 애플리케이션 및 AWS 서비스의 로그를 하나의 확장성 높은 서비스로 중앙 집중화할 수 있습니다 ([What is Amazon CloudWatch Logs?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)). 그러나 적절한 보안 제어가 없으면 로그 데이터는 자산이 아닌 취약점이 될 수 있습니다. 이 가이드에서는 최소 권한 액세스, 암호화, 리소스 기반 정책, 삭제 보호 및 포괄적인 감사를 구현하여 로그 그룹을 안전하고 규정을 준수하는 상태로 유지하는 방법에 중점을 둡니다.


## 이것이 중요한 이유

### 보안 측면의 영향

로그 데이터에는 사용자 활동, 시스템 구성, API 호출, 그리고 잠재적으로 개인 식별 정보(PII)를 포함한 민감한 정보가 자주 포함됩니다. 로그에 대한 무단 액세스는 인프라, 애플리케이션 동작 및 비즈니스 운영에 대한 중요한 보안 세부 정보를 노출할 수 있습니다. 또한 로그 그룹의 우발적 또는 악의적 삭제는 중요한 감사 추적의 손실과 규정 준수 위반을 초래할 수 있습니다.

### 규정 준수 요구 사항

많은 규제 프레임워크에서는 액세스 제한, 저장 및 전송 중 암호화, 보존 정책, 삭제 보호 및 감사 추적을 포함한 로그 데이터에 대한 특정 제어를 요구합니다. 적절한 권한 관리와 삭제 보호는 이러한 요구 사항을 충족하는 데 기본이 됩니다.

### 운영 우수성

잘 구조화된 권한은 팀이 필요한 로그에 액세스하면서도 원치 않는 수정 및 삭제를 방지할 수 있게 합니다. 이러한 균형은 데이터 무결성을 유지하면서 보안과 운영 효율성을 모두 지원합니다.



## 보안 모범 사례

CloudWatch Logs 보안은 로그 데이터를 보호하기 위해 함께 작동하는 여러 계층의 액세스 제어, 삭제 보호 및 암호화 메커니즘을 통해 운영됩니다. 포괄적인 보안을 구현하려면 IAM 정책, 삭제 보호, 암호화, 리소스 정책 및 지속적인 모니터링을 결합하는 다계층 접근 방식이 필요합니다.

### 1. CloudWatch Logs 계층 구조 및 보안 경계

CloudWatch Logs 아키텍처를 이해하는 것은 효과적인 보안 제어를 구현하는 데 기본입니다. 적절한 로그 구성 및 계층 설계는 다른 모든 보안 조치의 기반을 형성합니다.

CloudWatch Logs는 보안 제어에 직접적인 영향을 미치는 2단계 계층 구조를 사용합니다 ([Working with log groups and log streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)):

*   **Log Groups**: 보존 정책, 암호화 설정, 액세스 권한 및 삭제 보호를 정의하는 최상위 컨테이너입니다. 각 로그 그룹은 자체 IAM 정책과 KMS 암호화 키를 가진 보안 경계로 작동합니다
*   **Log Streams**: 로그 그룹 내의 개별 로그 이벤트 시퀀스로, 일반적으로 단일 소스(EC2 인스턴스, Lambda 함수 또는 애플리케이션 프로세스)를 나타냅니다. Log Streams는 상위 로그 그룹의 보안 설정을 상속하지만, 세분화된 액세스 제어를 위해 IAM 정책에서 개별적으로 대상을 지정할 수 있습니다

#### 보안 중심 로그 그룹 설계

보안 요구 사항 및 액세스 패턴에 맞게 로그 그룹 구조를 설계하십시오 ([CloudWatch Logs permissions reference](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)):

*   **애플리케이션 분리**: 특히 민감한 데이터를 처리할 때 서로 다른 애플리케이션에 대해 별도의 로그 그룹을 생성하여 세분화된 IAM 정책을 활성화하고 교차 애플리케이션 로그 액세스를 방지합니다
*   **환경 격리**: 프로덕션, 스테이징, 개발 환경에 별도의 로그 그룹을 사용하여 다른 액세스 제어 및 보존 정책을 적용합니다
*   **데이터 분류**: 민감도 수준(공개, 내부, 기밀, 제한)별로 로그를 그룹화하여 적절한 암호화, 액세스 제어 및 보존 정책을 적용합니다
*   **규정 준수 경계**: 특별한 처리와 더 긴 보존 기간이 필요한 감사 로그, 보안 로그 및 규정 준수 관련 데이터에 대한 전용 로그 그룹을 생성합니다

#### Log Streams를 활용한 세분화된 액세스 제어

로그 그룹이 기본 보안 경계를 제공하는 반면, Log Streams는 세밀한 액세스 패턴을 가능하게 합니다 ([Actions, resources, and condition keys for CloudWatch Logs](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html)):

*   **인스턴스 수준 액세스**: IAM 정책에서 Log Stream 이름을 사용하여 특정 EC2 인스턴스 또는 컨테이너의 로그에만 사용자 액세스를 부여합니다
*   **시간 기반 액세스**: 생성 시간 또는 명명 패턴을 기반으로 Log Streams에 대한 액세스를 제한하는 정책을 구현합니다
*   **서비스별 Streams**: 애플리케이션이 지정된 Log Streams에만 쓸 수 있도록 허용하면서 동일한 로그 그룹의 다른 스트림에 대한 액세스는 방지합니다
*   **감사 추적 무결성**: Log Stream의 불변성(생성된 후에는 로그 이벤트를 수정할 수 없음)을 감사 및 규정 준수 전략의 일부로 활용합니다

### 2. Identity-Based 정책 (IAM 정책)

*   IAM 정책을 사용하여 로그 그룹 및 Log Streams를 생성, 읽기, 관리할 수 있는 사용자를 제어합니다 ([Using identity-based policies for CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-identity-based-access-control-cwl.html))
    - **최소 권한 원칙 적용**: 조직의 요구에 따라 특정 로그 그룹에 대한 액세스를 제한하는 고객 관리형 정책을 생성합니다
    - **명시적 Resource ARN 사용**: IAM 정책에서 와일드카드(*)를 사용하는 대신 항상 명시적인 로그 그룹 ARN을 지정합니다. 이는 권한 에스컬레이션을 방지하고 사용자가 의도된 로그 그룹에만 액세스할 수 있도록 합니다
    - **관리 권한과 운영 권한 분리**: 다양한 권한 수준에 대해 별도의 정책을 생성합니다. 예를 들어, 분석가에게는 읽기 전용 액세스, 애플리케이션에는 쓰기 권한, 인프라 팀에는 관리 권한을 부여합니다. 이를 하나의 과도하게 허용적인 정책으로 결합해서는 안 됩니다
    - **삭제 작업에 대한 명시적 Deny**: 중요한 로그 그룹의 경우, 삭제 보호를 넘어 추가적인 보호를 제공하기 위해 삭제 작업에 대한 명시적 거부 문을 구현합니다

*   CloudWatch에 로그를 기록하는 Lambda 함수의 경우, IAM 역할에 최소한의 필수 권한인 `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`가 포함되어 있는지 확인합니다 ([Lambda execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html))

*   로그 그룹을 수정하거나 삭제할 수 있는 권한이 있는 계정에 MFA를 구현합니다 ([Overview of managing access permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html))

*   **태그 기반 액세스 제어 구현**: 로그 그룹의 리소스 태그와 IAM 조건 키(`aws:ResourceTag`)를 결합하여 환경(프로덕션/개발), 팀 소유권 또는 데이터 분류 수준과 같은 속성을 기반으로 액세스를 동적으로 제어합니다 ([Actions, resources, and condition keys for CloudWatch Logs](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html))

### 3. 중요 로그 그룹에 대한 삭제 보호

삭제 보호는 Amazon CloudWatch Logs에서 도입된 중요한 보안 기능으로, 로그 그룹과 관련 Log Streams의 우발적 또는 악의적 삭제를 방지합니다. 활성화되면 삭제 보호는 명시적으로 비활성화될 때까지 모든 삭제 작업을 차단하여 중요한 운영 및 규정 준수 데이터를 보호하는 데 도움을 줍니다. 이 기능은 문제 해결, 분석 및 규제 요구 사항을 위해 보존해야 하는 감사 로그, 규정 준수 기록 및 프로덕션 애플리케이션 로그를 보존하는 데 특히 유용합니다. ([Protecting log groups from deletion](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html))

#### 주요 특성:
- **예방적 제어**: 삭제 시도가 발생하기 전에 이를 중지하는 예방적 보안 제어 역할을 합니다
- **명시적 비활성화 필요**: 삭제 작업을 진행하려면 먼저 명시적으로 비활성화해야 합니다
- **Log Streams에 적용**: 로그 그룹과 그 안의 모든 Log Streams를 보호합니다
- **성능 영향 없음**: 로그 수집, 쿼리 또는 기타 작업에 영향을 미치지 않습니다
- **감사 추적**: 삭제 보호 상태의 모든 변경 사항은 CloudTrail에 기록됩니다

#### 중요 사용 사례 - 삭제 보호를 활성화해야 하는 경우:
- **감사 로그**: 모든 감사 로그는 규정 준수를 유지하고 감사 추적의 변조를 방지하기 위해 삭제 보호를 활성화해야 합니다
- **보안 로그**: AWS CloudTrail, VPC Flow Logs 및 애플리케이션 보안 로그를 포함한 보안 관련 로그
- **규정 준수 로그**: 규정 준수에 필요한 모든 로그
- **프로덕션 애플리케이션 로그**: 문제 해결 및 인시던트 대응에 필요한 프로덕션 로그
- **장기 보존 로그**: 1년을 초과하는 보존 요구 사항이 있는 모든 로그

#### 구현 모범 사례:
-   **중요 로그 그룹에 활성화**: 모든 중요 로그에 대해 로그 그룹 생성 시 또는 기존 로그 그룹에 삭제 보호를 활성화합니다. 이것이 우발적 또는 악의적 삭제에 대한 첫 번째 방어선입니다
-   **배포 자동화**: AWS CloudFormation, AWS CDK 또는 Terraform과 같은 Infrastructure as Code(IaC) 도구를 사용하여 새 로그 그룹 생성 시 삭제 보호를 자동으로 활성화합니다. 이를 통해 환경 전체에서 일관된 보안 태세를 유지할 수 있습니다
-   **절차 문서화**: 삭제 보호를 비활성화해야 하는 시점과 방법에 대한 명확한 문서와 런북을 작성합니다. 승인 워크플로, 정당화 요구 사항, 재활성화 절차를 포함하여 보호가 절대적으로 필요한 경우에만 일시적으로 비활성화되도록 합니다
-   **변경 사항 모니터링**: CloudWatch 알람과 메트릭 필터를 생성하여 중요 로그 그룹에서 삭제 보호가 비활성화되는 것을 감지합니다. 이 경우 즉시 보안 팀에 알려 변경이 승인되었는지 조사합니다
-   **심층 방어**: 삭제 작업을 명시적으로 거부하는 IAM 정책과 함께 삭제 보호를 사용합니다. 이는 심층 방어를 제공합니다 - 삭제 보호가 비활성화되더라도 IAM 정책이 무단 삭제를 방지할 수 있습니다

#### 여러 보호 계층 결합:
-   로그 그룹에 삭제 보호를 활성화합니다 ([Protecting log groups from deletion](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html))
-   `logs:DeleteLogGroup` 및 `logs:PutLogGroupDeletionProtection`에 대한 명시적 Deny 문이 있는 IAM 정책을 사용합니다 ([CloudWatch Logs permissions reference](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html))
-   조직 수준에서 Service Control Policies(SCPs)를 적용합니다 ([Service control policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html))
-   중요 작업에 MFA 삭제 요구 사항을 활성화합니다 ([AWS Re:Post: Restore or prevent deletion of logs or log groups in CloudWatch](https://repost.aws/knowledge-center/cloudwatch-prevent-logs-deletion))
-   AWS Config를 사용하여 삭제 보호 상태를 모니터링합니다 ([AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html))
-   보호가 비활성화된 경우 자동 수정을 구현하여 보호를 다시 활성화합니다 ([Remediating Noncompliant Resources with AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html))

### 4. Customer-Managed KMS 키를 사용한 암호화

민감한 로그 그룹에 Customer-Managed KMS 키를 구현하여 암호화 키에 대한 완전한 제어를 유지하고, 키 로테이션을 활성화하며, 키 사용에 대한 상세한 감사 추적을 생성합니다.

#### 암호화 아키텍처

*   CloudWatch Logs는 기본적으로 AES-GCM을 사용한 서버 측 암호화로 저장 시 로그 데이터를 암호화합니다 ([Encrypt log data in CloudWatch Logs using AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html))
*   향상된 제어를 위해 AWS KMS Customer-Managed 키를 사용하여 로그 그룹을 암호화하면 암호화 키와 액세스 정책을 관리할 수 있습니다 ([Encrypt log data in CloudWatch Logs using AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html))
*   로그 그룹 생성 시 암호화를 구성하거나 기존 그룹을 KMS 암호화를 사용하도록 업데이트합니다 ([AWS Re:Post: Use AWS KMS to encrypt log data in CloudWatch Logs](https://repost.aws/knowledge-center/cloudwatch-encrypt-log-data))

#### 암호화 모범 사례:
*   **민감한 로그에 KMS 암호화 활성화**: 민감한 데이터가 포함된 로그 그룹의 경우 Customer-Managed KMS 키를 연결합니다. 이를 통해 키 정책을 통한 향상된 제어, 키 로테이션 활성화, 모든 암호화/복호화 작업에 대한 상세한 CloudTrail 로그 생성이 가능합니다
*   **적절한 KMS 키 정책 구성**: KMS 키 정책은 CloudWatch Logs 서비스 주체(`logs.amazonaws.com`)에 암호화 및 복호화를 위해 키를 사용할 수 있는 권한을 부여해야 합니다. 특정 로그 그룹과 AWS 계정으로 사용을 제한하는 조건을 포함합니다
*   **키 로테이션 구현**: CloudWatch Logs에 사용되는 KMS 키에 대해 자동 키 로테이션을 활성화합니다. AWS는 이전 키 버전으로 암호화된 데이터에 대한 액세스를 유지하면서 매년 Customer-Managed 키를 자동으로 로테이션합니다
*   **KMS 키 사용 모니터링**: CloudTrail을 사용하여 로그 암호화 키와 관련된 모든 KMS API 호출을 모니터링합니다. 과도한 복호화 작업이나 무단 키 액세스 시도와 같은 비정상적인 패턴에 대해 CloudWatch 알람을 설정합니다

### 5. 데이터 보호 정책

CloudWatch Logs 데이터 보호는 머신러닝과 패턴 매칭을 사용하여 로그 그룹의 민감한 데이터를 검색, 보호 및 감사하는 데 도움이 되는 기능입니다 ([Protecting sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)). 이 기능은 개인 식별 정보(PII), 자격 증명, 금융 데이터와 같은 민감한 정보에 대해 로그 이벤트를 자동으로 스캔한 다음, 구성에 따라 데이터를 감사하거나 마스킹합니다. 데이터 보호 정책은 로그 이벤트가 수집될 때 실시간으로 작동하여 애플리케이션이나 로그 소스를 변경하지 않고도 즉각적인 보호를 제공합니다.

*   **데이터 보호 정책 구성**: 관리형 데이터 식별자를 사용하여 민감한 정보를 자동으로 감지하고 마스킹하는 CloudWatch Logs 데이터 보호 정책을 구현합니다 ([Personally identifiable information (PII)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html))
*   **보호 작업 선택**: 보안 요구 사항에 따라 감사 작업(민감한 데이터를 모니터링 및 보고) 또는 비식별화 작업(민감한 데이터를 실시간으로 마스킹)을 구성합니다 ([CloudWatch Logs managed data identifiers for sensitive data types](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html))
*   **포괄적인 데이터 적용 범위**: 다음을 포함한 여러 범주의 민감한 데이터를 보호합니다:
    - **자격 증명**: AWS Secret Keys, SSH Private Keys, PGP Private Keys, PKCS Private Keys
    - **금융 정보**: 신용카드 번호, 은행 계좌 번호, 보안 코드
    - **개인 정보**: 이메일 주소, 이름, 주소, IP 주소, 차량 식별 번호
    - **지역별 특정 정보**: 운전면허증, 세금 ID, 우편번호와 같은 국가별 식별자
*   **키워드 근접 탐지**: 오탐을 줄이기 위해 민감한 데이터 패턴의 30자 이내에서 키워드를 스캔하는 고급 탐지를 활용합니다
*   **글로벌 적용 범위**: 데이터 보호 정책은 로그 그룹의 지리적 위치에 관계없이 작동하며, ISO 국가 코드를 사용하는 지역별 데이터 식별자를 지원합니다
*   **Amazon Macie와의 통합**: AWS 환경 전반에서 향상된 민감한 데이터 검색 및 분류를 위해 CloudWatch Logs와 함께 Amazon Macie를 사용합니다 ([AWS Blog: How Amazon CloudWatch Logs Data Protection can help detect and protect sensitive log data](https://aws.amazon.com/blogs/mt/how-amazon-cloudwatch-logs-data-protection-can-help-detect-and-protect-sensitive-log-data/))

### 6. 로그 보존 및 수명 주기 관리

CloudWatch Logs의 로그 보존은 로그 이벤트가 자동으로 삭제되기 전에 저장되는 기간을 제어하여 규정 준수 요구 사항과 스토리지 비용 간의 균형을 맞추는 데 도움을 줍니다 ([Change log data retention in CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)). 기본적으로 CloudWatch Logs는 로그 데이터를 무기한 저장하지만, 로그 그룹 수준에서 1일부터 10년까지의 보존 기간을 구성할 수 있습니다. 적절한 수명 주기 관리는 규제 요구 사항, 운영 필요성 및 비용 최적화 목표에 따라 적절한 기간 동안 민감한 데이터가 보존되도록 하면서, 더 이상 필요하지 않은 데이터는 자동으로 삭제합니다.

*   **보존 기간 구성**: 규정 준수 요구 사항과 운영 요구에 따라 로그 그룹에 적절한 보존 기간을 설정합니다. 기본적으로 로그 데이터는 무기한 저장되지만, 1일부터 10년까지 보존을 구성할 수 있습니다 ([Change log data retention in CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention))
*   **데이터 분류 기반 정책 적용**: 데이터 민감도와 분류에 따라 다른 보존 정책을 구현합니다:
    - **중요/감사 로그**: 규정 준수 요구 사항을 위한 장기 보존(7년 이상)
    - **보안 로그**: 포렌식 분석을 위한 확장 보존(1-3년)
    - **애플리케이션 로그**: 문제 해결을 위한 중기 보존(30-90일)
    - **디버그/개발 로그**: 비용 최적화를 위한 단기 보존(1-7일)
*   **비용 최적화**: 보존 기간을 정기적으로 검토하고 조정하여 규정 준수 요구와 스토리지 비용 간의 균형을 맞춥니다. 오래된 로그 데이터는 보존 기간 만료 시 자동으로 삭제됩니다
*   **수명 주기 관리를 위한 태깅**: 환경, 애플리케이션, 데이터 분류 및 보존 요구 사항별로 로그 그룹을 분류하기 위해 일관된 태깅 전략을 사용하여 정책을 자동으로 적용합니다 ([Tag log groups in Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#log-group-tagging))
*   **중앙화와의 통합**: 로그 중앙화를 사용할 때 규정 준수 요구 사항을 유지하기 위해 소스 및 대상 계정 간에 보존 정책이 일관되게 적용되도록 합니다

### 7. 로그 대상을 위한 Resource-Based 정책

CloudWatch Logs의 Resource-Based 정책은 교차 계정 구독을 활성화하기 위해 **대상** (destinations)에 특별히 사용됩니다 ([Cross-account cross-Region subscriptions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)). Identity-Based IAM 정책을 사용하는 로그 그룹과 달리, 대상은 외부 AWS 계정이 Kinesis Data Streams, Kinesis Data Firehose 또는 Lambda 함수와 같은 대상 리소스에 로그 그룹을 구독할 수 있는 계정을 지정하는 Resource-Based 정책을 지원합니다 ([Overview of managing access permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#resource-based-policies-cwl)).

#### 대상 리소스란 무엇이며 언제 Resource-Based 정책을 사용하는가:

*   **Log Destinations**: 대상은 구독 필터에서 로그 데이터를 수신할 수 있는 AWS 서비스(Kinesis Data Streams, Kinesis Data Firehose, Lambda 함수)를 나타내는 CloudWatch Logs 리소스입니다
*   **교차 계정 로그 스트리밍**: 다른 AWS 계정이 중앙 집중식 처리 인프라로 로그 데이터를 스트리밍할 수 있도록 하려는 경우 대상에 Resource-Based 정책을 사용합니다
*   **중앙 집중식 로그 처리**: 통합 분석, 보안 모니터링 또는 규정 준수 처리를 위해 여러 계정이 중앙 계정의 Kinesis 스트림 또는 Firehose로 로그를 전송하는 시나리오를 활성화합니다
*   **서드 파티 통합**: 엄격한 액세스 제어를 유지하면서 파트너 계정이나 서비스 제공업체가 처리 시스템으로 로그 데이터를 전송할 수 있도록 합니다

#### 대상에 대한 Resource-Based 정책 모범 사례:
*   **정확한 소스 계정 지정**: 대상 정책에서 구독을 생성할 수 있는 AWS 계정 ID를 명시적으로 지정합니다. 계정 ID에 와일드카드(*)를 사용하지 마십시오 ([Step 1: Create a destination](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CreateDestination.html))
*   **최소 권한 액세스 사용**: 특정 대상 ARN에 대해 일반적으로 `logs:PutSubscriptionFilter`만 필요한 최소한의 권한만 부여합니다
*   **Condition Keys 구현**: IAM Condition Keys를 사용하여 소스 IP 제한, 시간 기반 액세스 또는 MFA 요구 사항과 같은 추가 보안 계층을 추가합니다
*   **정기적인 정책 감사**: 대상 정책을 주기적으로 검토하여 현재 요구 사항을 반영하는지 확인합니다. 폐기된 계정에 대한 액세스를 제거하고 과도하게 허용적인 정책을 강화합니다
*   **구독 활동 모니터링**: CloudTrail을 사용하여 `PutSubscriptionFilter` 및 `DeleteSubscriptionFilter` API 호출을 모니터링하여 대상에 대한 구독 생성 또는 제거를 추적합니다

### 8. AWS Organizations를 통한 로그 중앙화

로그 중앙화는 교차 계정 및 교차 리전 중앙화 규칙을 사용하여 여러 멤버 계정과 AWS 리전의 로그 데이터를 중앙 계정으로 자동 복제하는 AWS Organizations 기능입니다 ([Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)). 이 기능은 Resource-Based 정책이나 교차 계정 IAM 역할을 필요로 하지 않으면서 전체 AWS 인프라에 걸쳐 중앙 집중식 모니터링, 분석 및 규정 준수를 위한 로그 통합을 간소화합니다. 이 기능은 백업 리전 구성과 소스 계정에서 복사된 로그 그룹의 암호화 동작에 대한 완전한 제어를 포함하여 운영 및 보안 요구 사항을 충족하기 위한 구성 유연성을 제공합니다.

#### AWS Security Reference Architecture 정렬

AWS Security Reference Architecture(AWS SRA) 모범 사례에 따라, CloudWatch Logs 중앙화는 전체 보안 계정 구조와 정렬되어야 합니다 ([AWS Security Reference Architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/introduction.html)):

*   **Log Archive 계정을 위임 관리자로 지정**: 전용 Log Archive 계정을 AWS Organization의 CloudWatch 위임 관리자로 구성합니다. 이 계정은 모든 보안 관련 로그의 수집 및 보관을 전담하며, 제어된 액세스 메커니즘과 함께 변경 불가능한 스토리지를 제공합니다
*   **Security OU로 중앙화**: 모든 CloudWatch Logs 중앙화 규칙을 Security Organizational Unit(OU) 내의 Log Archive 계정으로 로그를 복제하도록 지정하여 프로덕션 워크로드와의 분리와 일관된 보안 제어를 보장합니다
*   **기존 로그 인프라와 통합**: 중앙 집중화된 로그 그룹의 기본 스토리지로 CloudWatch Logs를 유지하면서, Log Archive 계정의 기존 보안 인프라(Customer-Managed KMS 암호화 키, IAM 액세스 제어 패턴, VPC 엔드포인트, 다른 보안 로그를 위해 이미 구축된 모니터링 프레임워크)를 활용합니다
*   **심층 방어 구현**: 다른 중요 로그에 사용되는 동일한 보안 원칙(최소 권한 액세스, Customer-Managed KMS 키를 사용한 암호화, 불변성을 위한 삭제 보호, 포괄적인 모니터링)을 적용합니다

#### 로그 중앙화 모범 사례:
*   **조직 구조 수립**: Log Archive 계정을 CloudWatch 위임 관리자로 지정하고 조직의 모든 멤버 계정에서 로그를 복제하는 중앙화 규칙을 생성합니다
*   **일관된 보안 제어 적용**: 다음을 포함하여 모든 중앙화된 로그 그룹에 동일한 보안 정책을 구현합니다:
    - **암호화**: 다른 보안 로그를 위해 Log Archive 계정에 이미 구축된 동일한 Customer-Managed KMS 키를 사용합니다
    - **액세스 정책**: 기존 로그 액세스 제어 및 직무 분리와 일치하는 일관된 IAM 정책을 적용합니다
    - **보존**: 규정 준수 요구 사항을 충족하고 기존 로그 수명 주기 관리와 통합되는 보존 정책을 구성합니다
*   **중앙화 상태 모니터링**: CloudWatch 메트릭과 콘솔 모니터링을 사용하여 중앙화 규칙의 상태를 추적하고, 복제 문제를 식별하며, 모든 멤버 계정에서 지속적인 로그 흐름을 보장합니다
*   **기존 로그 소스와 통합**: 통합 로그 관리 및 분석을 위해 Log Archive 계정으로 이미 흐르고 있는 다른 로그 소스(CloudTrail, VPC Flow Logs, GuardDuty findings)와 CloudWatch Logs 중앙화를 조율합니다
*   **데이터 레지던시를 위한 여러 중앙화 규칙 구성**: 데이터 레지던시 및 규정 준수 요구 사항을 충족하기 위해 여러 중앙화 규칙을 사용합니다:
    - **리전별 데이터 레지던시**: GDPR, 데이터 주권법 또는 조직 정책에 의해 요구되는 특정 지리적 경계 내에 로그 데이터가 유지되도록 서로 다른 리전에 대해 별도의 중앙화 규칙을 생성합니다
    - **규정 준수 기반 분리**: 산업별 규정 준수 요구 사항을 충족하기 위해 서로 다른 유형의 민감한 데이터(금융, 의료, 개인 데이터)에 대해 별도의 중앙화 규칙을 구성합니다
    - **다중 리전 백업 전략**: 데이터 레지던시 제약을 준수하면서 재해 복구를 위해 중요 로그를 여러 리전에 복제하는 중앙화 규칙을 구현합니다
    - **선택적 로그 라우팅**: 중앙화 규칙 필터를 사용하여 데이터 분류 및 레지던시 요구 사항에 따라 특정 로그 유형을 적절한 대상 계정과 리전으로 라우팅합니다
*   **중앙화 상태 모니터링**: CloudWatch 메트릭과 콘솔 모니터링을 사용하여 중앙화 규칙의 상태를 추적하고 복제 문제를 식별합니다
*   **중앙 집중식 보안 제어 구현**: 균일한 보안 태세를 유지하기 위해 모든 중앙화된 로그 그룹에 일관된 보안 정책, 암호화 설정 및 액세스 제어를 적용합니다

### 9. CloudWatch Logs용 VPC Endpoints

VPC Endpoints를 사용하여 VPC와 CloudWatch Logs 간에 프라이빗 연결을 설정하여 로그 트래픽을 AWS 네트워크 내에 유지하고 네트워크 격리를 통해 보안을 강화합니다.

*   **프라이빗 연결 활성화**: 인터넷을 거치지 않고 CloudWatch Logs로 로그를 전송하기 위해 인터페이스 VPC Endpoints를 사용합니다 ([Using CloudWatch Logs with interface VPC endpoints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-and-interface-VPC.html))
*   **다중 엔드포인트 지원**: CloudWatch Logs에는 두 개의 VPC Endpoints가 필요합니다:
    - 표준 CloudWatch Logs API용 `com.amazonaws.region.logs`
    - StartLiveTail 및 GetLogObject와 같은 스트리밍 API용 `com.amazonaws.region.stream-logs`
*   **FIPS 엔드포인트 지원**: 규정 준수에 필요한 경우 FIPS 호환 엔드포인트(`logs-fips` 및 `stream-logs-fips`)를 사용합니다
*   **VPC Endpoint 정책 구현**: 엔드포인트 정책을 사용하여 VPC Endpoint를 통한 CloudWatch Logs 작업을 제한합니다. 예를 들어, 관리 작업은 방지하면서 로그 생성 및 수집만 허용합니다
*   **VPC Context Keys 활용**: IAM 정책에서 `aws:SourceVpc` 및 `aws:SourceVpce` Condition Keys를 사용하여 특정 VPC Endpoints를 통해서만 CloudWatch Logs에 액세스할 수 있도록 합니다
*   **네트워크 경계 보안**: 민감한 보안 및 감사 정보가 포함된 로그는 제어된 네트워크 경계 내에 유지되어 공용 엔드포인트를 통한 우발적 데이터 유출을 방지합니다

### 10. 모니터링 및 감사

#### 포괄적인 로깅 활성화:
*   **CloudTrail 로깅 활성화**: 모든 리전에서 CloudTrail이 활성화되고 CloudWatch Logs API 호출을 기록하도록 구성되어 있는지 확인합니다. 모니터링 및 분석을 위해 CloudTrail 이벤트를 CloudWatch Logs 로그 그룹으로 직접 전송하도록 구성합니다 ([Sending events to CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html))
*   무단 액세스 시도 또는 비정상적인 패턴을 감지하기 위해 CloudWatch 알람을 구성합니다 ([Using Amazon CloudWatch alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html))
*   Organizations를 사용하여 여러 계정에 걸친 중앙 집중식 로깅을 구현합니다 ([Cross-account log data sharing in CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html))
*   IAM 정책을 통해 로그 삭제를 방지하여 변경 불가능한 감사 추적을 유지합니다
*   민감도 수준이 다른 애플리케이션에 대해 별도의 로그 그룹을 생성합니다

#### 모니터링 모범 사례:
*   **로그 수집 메트릭 모니터링**: 내장 CloudWatch 메트릭을 사용하여 로그 수집 패턴을 추적하고 이상을 감지합니다 ([CloudWatch Logs metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)):
    - **IncomingLogEvents**: 수집되는 로그 이벤트 수를 모니터링하여 보안 인시던트, 애플리케이션 문제 또는 무단 로그 소스를 나타낼 수 있는 비정상적인 급증 또는 감소를 감지합니다
    - **IncomingBytes**: 잠재적인 데이터 유출 시도 또는 과도한 로깅을 통한 서비스 거부 공격을 식별하기 위해 수집되는 로그 데이터 양을 추적합니다
    - **DeliveryErrors**: 감사 추적에 영향을 미치는 로그 대상의 변조 또는 인프라 문제를 나타낼 수 있는 실패한 로그 전달을 모니터링합니다
    - **기준선 임계값 설정**: 정상적인 수집 패턴을 설정하고 허용 가능한 분산 범위를 초과하는 편차에 대해 CloudWatch 알람을 생성합니다

*   **이상 탐지를 위한 CloudWatch Contributor Insights 활용**: Contributor Insights를 사용하여 로그 데이터 패턴을 분석하고 비정상적인 활동을 식별합니다 ([Using CloudWatch Contributor Insights to Analyze High-Cardinality Data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)):
    - **상위 기여자 분석**: 잠재적인 남용, 봇 활동 또는 보안 위협을 감지하기 위해 가장 많은 양의 로그를 생성하는 기여자(IP 주소, 사용자 에이전트, API 엔드포인트)를 식별합니다
    - **오류 패턴 감지**: 보안 인시던트를 나타낼 수 있는 비정상적인 오류 패턴, 인증 실패 시도 또는 의심스러운 액세스 패턴을 식별하기 위해 오류 로그를 분석합니다
    - **리소스 사용 모니터링**: 잠재적인 오용 또는 무단 활동을 식별하기 위해 가장 많은 로그 데이터를 생성하는 사용자, 애플리케이션 또는 서비스를 추적합니다
    - **시간 기반 분석**: 침해를 나타낼 수 있는 비업무 시간의 비정상적인 활동 패턴이나 예기치 않은 트래픽 급증을 감지하기 위해 시계열 분석을 사용합니다
*   **보안 이벤트 알람 생성**: 무단 로그 그룹 삭제, 삭제 보호 변경, 권한 변경, 암호화 키 연결 해제 또는 비정상적인 쿼리 패턴과 같은 의심스러운 활동을 감지하기 위해 메트릭 필터 및 알람을 설정합니다 ([Creating metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html))
*   보안 메트릭과 액세스 패턴을 시각화하기 위해 CloudWatch 대시보드를 설정합니다 ([Using Amazon CloudWatch dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html))
*   고급 로그 분석 및 이상 탐지를 위해 CloudWatch Logs Insights를 사용합니다 ([Analyzing log data with CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html))
*   CloudWatch Logs 구성 변경을 모니터링하기 위해 AWS Config를 사용합니다 ([Monitoring AWS Config with Amazon EventBridge](https://docs.aws.amazon.com/config/latest/developerguide/monitor-config-with-cloudwatchevents.html))
*   로깅 관련 보안 발견을 집계하고 우선순위를 지정하기 위해 AWS Security Hub를 구현합니다 ([AWS Security Hub User Guide](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html))
*   **실패한 액세스 시도 모니터링**: CloudWatch Logs에 대한 실패한 API 호출(AccessDenied 오류)을 추적하기 위해 메트릭 필터를 생성합니다. 무단 액세스 시도 또는 권한 에스컬레이션 패턴이 감지되면 보안 팀에 알립니다
*   **삭제 보호 모니터링 구현**: 삭제 보호를 비활성화하거나 보호된 로그 그룹을 삭제하려는 시도를 모니터링하기 위해 명시적 거부 문이 있는 IAM 정책과 CloudWatch 알람을 사용합니다. 조직 전체 보호를 위해 AWS Organizations Service Control Policies(SCPs)를 사용하는 것도 고려합니다

## 결론

Amazon CloudWatch Logs를 보호하려면 중요한 로그 데이터를 보호하기 위해 Identity-Based 정책, 삭제 보호, 암호화, 데이터 보호 정책 및 지속적인 모니터링을 결합하는 포괄적인 다계층 접근 방식이 필요합니다. 최소 권한 IAM 정책과 삭제 보호부터 VPC Endpoints 및 자동화된 민감한 데이터 감지에 이르는 이러한 보안 모범 사례를 구현함으로써 로그 인프라에 대한 우발적 및 악의적 위협 모두에 대한 강력한 방어를 구축할 수 있습니다. 이러한 제어는 민감한 운영 및 규정 준수 데이터를 보호할 뿐만 아니라, 효과적인 모니터링과 문제 해결에 필요한 운영 가시성을 유지하면서 조직이 규제 요구 사항을 충족하도록 보장합니다. 적절한 CloudWatch Logs 보안은 로깅 인프라에 대한 신뢰를 유지하고 로그 데이터에 포함된 가치 있는 인사이트를 보호하는 데 필수적입니다.
