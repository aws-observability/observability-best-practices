---
sidebar_position: 5
---
# AWS Control Tower Landing Zone 4.0으로 업그레이드

## 소개

AWS Control Tower Landing Zone 3.x를 사용하고 있다면, 이제 버전 4.0으로 업그레이드하여 AWS 조직 전체에 거버넌스 컨트롤을 적용하는 방식에서 더 많은 유연성을 확보할 수 있습니다. 이 문서에서는 주요 아키텍처 변경 사항을 안내하고, 마이그레이션 영향을 이해하는 데 도움을 주며, 성공적인 업그레이드를 위한 단계별 가이드를 제공합니다.

이전 버전의 AWS Control Tower(3.x 이하)에서는 랜딩 존을 활성화하려면 사전 정의된 조직 구조와 필수 서비스 통합을 수락해야 했습니다. Landing Zone 4.0은 이러한 제약을 제거하여 다음을 가능하게 합니다:

- 기존 조직을 재구성하지 않고도 [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html)에서 1,200개 이상의 컨트롤에 접근
- 특정 요구사항에 따라 활성화할 AWS 서비스를 자유롭게 선택할 수 있습니다. 서비스 통합이 더 이상 필수가 아니므로 다음이 가능합니다:
  - 필요할 때만 탐지적 컨트롤을 위해 [AWS Config](https://aws.amazon.com/config/)를 활성화
  - 기존 감사 로깅 솔루션이 있는 경우 독립적으로 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/)을 관리
  - ID 관리 전략에 따라 [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/)에 선택적으로 참여
  - 백업 요구사항에 따라 [AWS Backup](https://aws.amazon.com/backup/) 통합을 제어
- [AWS Organizations](https://aws.amazon.com/organizations/) 통합과 컨트롤만으로 최소한의 랜딩 존을 배포하며, 전용 서비스 통합 계정이 필요하지 않음
- 자체 조직 단위(OU) 계층 구조를 정의하면서 AWS Control Tower 거버넌스를 적용

이 컨트롤 전용 모델은 기존 랜딩 존을 가진 기업에 특히 유용합니다. 이전 버전에서 요구되었던 광범위한 재구성 없이 점진적으로 AWS Control Tower 거버넌스를 도입할 수 있습니다.

AWS Control Catalog에서 최대한의 가치를 얻기 위한 추가 가이드는 AWS 문서를 참조하세요: [Search and discover governance controls with Control Catalog in AWS Control Tower](https://aws.amazon.com/blogs/mt/search-and-discover-governance-controls-with-control-catalog-in-aws-control-tower/).

## 이점 및 아키텍처 변경 사항

Landing Zone 4.0은 더 큰 유연성과 운영 효율성을 제공하는 중요한 개선 사항을 도입합니다. 다음 비교표는 버전 3.x와 4.0의 주요 차이점을 보여줍니다:

| 기능 | 버전 3.x | 버전 4.0 |
|---------|-------------|-------------|
| 서비스 통합 | 필수 | 선택 |
| [AWS Config](https://aws.amazon.com/config/) S3 버킷 | [AWS CloudTrail](https://aws.amazon.com/cloudtrail/)과 공유 | 전용 버킷 |
| AWS Config 집계기 | Organization + 계정 집계기 | 서비스 연결 집계기 |
| 위임된 관리자 | 없음 | AWS Config용 감사 계정 |
| OU 구조 | 필수 Security OU | 유연한 고객 정의 구조 |
| Manifest 필드 | 필수 | 선택 |
| Config 기준 | AWSControlTowerBaseline의 일부 | 독립형 ConfigBaseline |
| 드리프트 알림 | [Amazon SNS](https://aws.amazon.com/sns/) | [Amazon EventBridge](https://aws.amazon.com/eventbridge/) |



## 사전 요구사항

AWS Control Tower Landing Zone 4.0으로 업그레이드하기 전에 다음 요구사항을 충족하는지 확인하세요:

> **중요**: 이 업그레이드는 되돌릴 수 없습니다. AWS Control Tower는 이전 랜딩 존 버전으로의 다운그레이드를 지원하지 않습니다. Landing Zone 4.0으로 업그레이드하면 버전 3.x로 롤백할 수 없습니다. 먼저 비프로덕션 환경에서 업그레이드를 테스트하고, 진행하기 전에 포괄적인 백업을 수행하는 것을 강력히 권장합니다.

#### 일반 사전 요구사항

1. **조직 드리프트 해결**: Landing Zone 4.0으로 업그레이드하기 전에 모든 조직 드리프트를 해결하는 것을 강력히 권장합니다. AWS Control Tower 콘솔에서 드리프트를 확인할 수 있습니다. 업그레이드 전에 해결되지 않은 드리프트는 업그레이드 후와 OU 재등록 후에도 지속될 수 있으며, 해결을 위해 AWS Support 케이스가 필요할 수 있습니다.

2. **AWS Control Tower 사전 요구사항 검토**: 환경이 모든 표준 [AWS Control Tower 사전 요구사항](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)을 충족하는지 확인하세요.

3. **서비스 통합 종속성 검토**: 기준 간의 종속성을 이해하세요. 향후 AWS Config 통합을 비활성화할 계획이라면, 서비스 종속성으로 인해 Security Roles, AWS IAM Identity Center 및 AWS Backup 통합도 비활성화해야 합니다.

4. **포괄적인 백업 수행**: 업그레이드 전에 현재 구성을 문서화하고 백업하세요:
   - 조직 구조 내보내기(OU, 계정, 계정-OU 매핑)
   - 현재 Landing Zone 설정, Config 집계기 보기, SNS 토픽 구성 스크린샷 또는 내보내기
   - Config 규칙 및 집계기 구성 내보내기
   - CloudFormation StackSet 템플릿 및 파라미터 내보내기
   - OU별 현재 기준 버전 및 OU별 컨트롤 활성화 상태 문서화
   - 해당되는 경우 CfCT CloudFormation 템플릿 저장

```bash
# 조직 단위 내보내기
aws organizations list-organizational-units-for-parent \
  --parent-id <ROOT_ID> > org_units_backup.json

# 모든 계정 내보내기
aws organizations list-accounts > accounts_backup.json

# Config 규칙 내보내기
aws configservice describe-config-rules > config_rules_backup.json

# Config 집계기 내보내기
aws configservice describe-configuration-aggregators > aggregators_backup.json

# Control Tower IAM 역할 내보내기
aws iam get-role --role-name AWSControlTowerExecution > ct_exec_role_backup.json
aws iam get-role --role-name AWSControlTowerCloudTrailRole > ct_cloudtrail_role_backup.json
```

### AWS CloudFormation StackSet 사전 요구사항

#### 닫힌/중지된 계정의 스택 인스턴스 제거

AWS 계정이 닫힐 때, 관리 계정의 `AWSControlTowerBP-*` StackSets에 있는 해당 AWS CloudFormation 스택 인스턴스는 **자동으로 제거되지 않습니다**. 업그레이드 중 AWS Control Tower가 이러한 StackSets를 업데이트하려고 하면 닫힌 계정에서 `AWSControlTowerExecution`을 맡을 수 없어 실패합니다. 이는 [문서화된 제한 사항](https://docs.aws.amazon.com/controltower/latest/userguide/troubleshooting.html#unable-to-update-landing-zone)입니다.

시간이 지남에 따라 계정을 닫은 조직에서는 각 StackSet 작업이 순차적으로 시간 초과되면서 업그레이드가 중단될 수 있습니다. 이를 방지하려면 업그레이드 전에 다음 사전 검사 및 수정을 실행하세요:

**사전 검사:**

```bash
# 닫힌/중지된 계정 식별
CLOSED=$(aws organizations list-accounts \
  --query "Accounts[?Status!='ACTIVE'].Id" --output text)

# AWS Control Tower StackSets에서 고아 스택 인스턴스 확인
for SS in $(aws cloudformation list-stack-sets --status ACTIVE \
  --query "Summaries[?starts_with(StackSetName,'AWSControlTowerBP-')].StackSetName" \
  --output text); do
  for ACCT in $CLOSED; do
    COUNT=$(aws cloudformation list-stack-instances --stack-set-name "$SS" \
      --query "length(Summaries[?Account=='${ACCT}'])" --output text)
    [ "$COUNT" -gt 0 ] && echo "BLOCKER: $SS has $COUNT instances for closed account $ACCT"
  done
done
```

**권장 수정 방법:**

```bash
# 위 사전 검사에서 BLOCKER로 표시된 각 StackSet에 대해,
# 닫힌 계정의 고아 인스턴스를 제거
aws cloudformation delete-stack-instances \
  --stack-set-name "<stackset-name>" \
  --accounts '["<closed-account-id>"]' \
  --regions '["us-east-1","us-west-2"]' \
  --retain-stacks \
  --no-cli-pager
```

> **중요**: [`--retain-stacks`](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/delete-stack-instances.html) 플래그가 필수입니다. 이 플래그 없이는 AWS CloudFormation이 닫힌 계정에서 `AWSControlTowerExecution`을 맡아 스택을 삭제하려고 시도하며, 이는 실패합니다.

#### AWS Control Tower 기준 스택에 종료 보호가 없는지 확인

v4.0 업그레이드는 멤버 계정의 특정 AWS CloudFormation 스택(특히 AWS Config 관련 기준)을 삭제하거나 교체합니다. 해당 스택에 종료 보호가 활성화되어 있으면 StackSet 작업이 실패하고 업그레이드가 중단됩니다.

AWS Control Tower는 기준 스택에 종료 보호를 활성화하지 **않습니다** — 대신 [SCP(필수 예방적 컨트롤)](https://docs.aws.amazon.com/prescriptive-guidance/latest/designing-control-tower-landing-zone/mandatory.html)를 사용합니다. 그러나 다음과 같이 AWS Control Tower 외부에서 종료 보호가 활성화되었을 수 있습니다:

- **AWS Security Hub CSPM 자동 수정** — [CloudFormation.3](https://docs.aws.amazon.com/securityhub/latest/userguide/cloudformation-controls.html)은 모든 스택에 종료 보호를 권장합니다. 자동 수정은 AWS Control Tower가 관리하는 스택을 포함하여 모든 스택에 이를 활성화합니다.
- **[AWS Landing Zone Accelerator](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/problem-validationerror.html)** — 기본적으로 프로비저닝된 스택에 종료 보호를 활성화합니다.

**사전 검사 (관리 계정에서 실행):**

```bash
# 멤버 계정으로 역할 전환
CREDS=$(aws sts assume-role \
  --role-arn "arn:aws:iam::<member-account-id>:role/AWSControlTowerExecution" \
  --role-session-name "tp-check" --query Credentials --output json)

export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r .SessionToken)

# AWS Control Tower 기준 스택의 종료 보호 확인
aws cloudformation describe-stacks --region <region> \
  --query "Stacks[?starts_with(StackName,'StackSet-AWSControlTowerBP-')].\
  [StackName,EnableTerminationProtection]" --output table
```

**권장 수정 방법:**

```bash
aws cloudformation update-termination-protection \
  --no-enable-termination-protection \
  --stack-name "<stack-name>" --region <region>
```

### AWS CloudTrail 사전 요구사항

API를 통해 업그레이드하고 AWS CloudTrail 통합이 활성화된 경우:

1. **IAM 역할 정책 업데이트**: `AWSControlTowerCloudTrailRole`에서 기존 인라인 정책을 분리하고 새 관리형 정책 `AWSControlTowerCloudTrailRolePolicy`를 연결합니다.

```bash
# 인라인 정책 분리
aws iam delete-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-name <inline-policy-name>

# 새 관리형 정책 연결
aws iam attach-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSControlTowerCloudTrailRolePolicy
```

2. **S3 버킷의 S3 복제 구성 이해**: CloudTrail용 Control Tower 관리 S3 버킷을 보호하는 필수 SCP(CTS3PV8)가 이제 *s3:PutReplicationConfiguration* 작업을 차단합니다. LZ 4.0은 기존 CloudTrail 버킷을 계속 사용하므로 현재 복제 구성은 정상적으로 계속 작동합니다. 그러나 업그레이드 후에는 복제 규칙을 수정하거나 다시 생성할 수 없습니다. 업그레이드 후 복제 설정을 수정해야 하는 경우, SCP에서 면제되는 AWSControlTowerExecution 역할을 맡아 복제 규칙을 업데이트하는 것이 해결 방법이지만, Control Tower의 보호 가드레일을 우회하므로 신중하게 사용해야 합니다.

### AWS Config 사전 요구사항

1. **데이터 저장소 변경 이해**: 업그레이드 후 AWS Config 데이터는 새 전용 S3 버킷에 저장됩니다. 기존 데이터는 원래 공유 버킷에 남아 있으며 자동으로 마이그레이션되지 않습니다. 새 버킷에 새 Config 데이터가 나타나기까지 업그레이드 완료 후 최대 24시간이 걸릴 수 있습니다.

2. **종속 워크플로 식별**: S3 버킷에서 직접 AWS Config 데이터에 접근하는 모든 워크플로, 스크립트 및 도구를 문서화하세요:
   - 로그 집계 도구(Splunk, Datadog 등)
   - SIEM 통합
   - 사용자 지정 대시보드(태그 규정 준수, 패치 규정 준수 등)
   - 자동화된 규정 준수 보고 도구
   
   각 종속성의 소유자를 식별하고 업그레이드 전에 전환 시기를 조율하세요.

3. **S3 버킷의 S3 복제 구성 이해**: Config용 Control Tower 관리 S3 버킷을 보호하는 필수 SCP(CTS3PV7)가 이제 **s3:PutReplicationConfiguration 작업**을 차단합니다. 따라서 업그레이드 후 이 버킷에 S3 복제를 구성할 수 없습니다. 새 Config 버킷에 복제가 필요한 경우, SCP에서 면제되는 **AWSControlTowerExecution** 역할을 맡아 복제 규칙을 생성하는 것이 해결 방법이지만, Control Tower의 보호 가드레일을 우회하므로 신중하게 사용해야 합니다.

4. **사용자 지정 AWS Config 고급 쿼리 목록화**: 관리 계정에서 조직 수준 집계기에 대해 생성한 사용자 지정 AWS Config 고급 쿼리가 있다면, 업그레이드 후 감사 계정에서 다시 생성해야 합니다. Config 집계기가 관리 계정에서 감사 계정으로 이동하므로, 관리 계정에서의 교차 계정 쿼리는 더 이상 작동하지 않습니다. 업그레이드 전에 모든 사용자 지정 쿼리를 문서화하세요.

5. **SNS 토픽 구독 검토**: AWS Control Tower SNS 토픽의 모든 구독, 특히 서드파티 통합(ServiceNow, PagerDuty 등)에 대한 HTTPS 엔드포인트를 검토하세요. 업그레이드 후에도 이러한 구독이 계속 알림을 수신하는지 확인하세요.

6. **기존 Config 리소스가 있는 계정 식별**: Control Tower에 의해 생성되지 않은 기존 AWS Config 전송 채널이 있는 등록된 계정이 있다면, 이러한 전송 채널은 새 Config S3 버킷을 가리키도록 자동 업데이트되지 않습니다. 업그레이드 전에 이러한 계정을 식별하세요. [기존 AWS Config 리소스가 있는 계정 등록](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)에 대한 AWS 문서를 참조하세요.


## 업그레이드 프로세스

이 섹션에서는 AWS Control Tower 랜딩 존을 버전 3.x에서 버전 4.0으로 업그레이드하는 단계별 가이드를 제공합니다.

### 1단계: 업그레이드 준비

1. **AWS Control Tower 콘솔에 접근**: 홈 리전의 관리 계정에서 접근합니다.

2. **랜딩 존 버전 확인**: Landing Zone 설정 페이지로 이동하여 현재 버전을 확인합니다.

![랜딩 존 버전 확인](/img/cloudops/guides/control-tower/upgrade/image.png)

3. **드리프트 확인**: Landing Zone 설정 페이지에서 랜딩 존이 "No drift detected"로 표시되는지 확인합니다. 드리프트가 감지되면 진행하기 전에 해결하세요. 업그레이드 전에 이미 드리프트 상태인 계정은 업그레이드 후와 OU 재등록 후에도 드리프트 상태가 유지될 수 있으며, 해결을 위해 AWS Support 케이스가 필요할 수 있습니다.

4. **활성화된 서비스 통합 검토**: 현재 활성화된 서비스 통합(AWS Config, AWS CloudTrail, AWS IAM Identity Center, AWS Backup)을 기록합니다.

### 2단계: 업그레이드 시작

AWS Control Tower 콘솔 또는 AWS CLI/API를 사용하여 Landing Zone 4.0으로 업그레이드할 수 있습니다.

#### 콘솔을 통한 업그레이드

1. AWS Control Tower 콘솔에서 **Landing Zone 설정으로 이동**합니다.

2. Landing Zone 버전 4.0을 선택하고 **"Update"** 버튼을 클릭하여 업그레이드 프로세스를 시작합니다.
![콘솔을 통한 업그레이드](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219204716.png)

3. 다음 페이지에서 Landing zone 버전 4.0이 선택되었는지 확인하고, 선택적으로 자동 계정 등록을 구성합니다. 업그레이드 후에는 이전 버전으로 돌아갈 수 없다는 점에 유의하세요. Next를 클릭합니다.
![랜딩 존 버전 선택](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205257.png)

4. Governed Regions 및 Region deny 컨트롤 설정을 검토한 후 Next를 클릭합니다.

![Governed Regions](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205556.png)
5. "Service Integrations"를 업데이트할 수 있는 페이지입니다. Next를 클릭합니다.
![Service Integrations 1](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205749.png)
![Service Integrations 2](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205825.png)

![Service Integrations 3](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205843.png)
5. Landing Zone 설정을 검토한 후 **업그레이드 확인**: "Update landing zone"을 클릭하여 업그레이드 프로세스를 시작합니다.

   ![검토 및 업데이트](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210023.png)
![통합 설정 검토](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210107.png)

![통합 설정 검토](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210132.png)
6. **업그레이드 진행 상황 모니터링**: 업그레이드 프로세스는 일반적으로 30-60분이 소요됩니다. AWS Control Tower 콘솔에서 진행 상황을 모니터링할 수 있습니다.


### 3단계: 업그레이드 완료 확인

1. **랜딩 존 상태 확인**: AWS Control Tower 콘솔에서 랜딩 존 상태가 "Active"로 표시되고 버전이 "4.0"으로 표시되는지 확인합니다.

   ![업그레이드 완료 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210908.png)

2. **서비스 통합 검토**: 이전에 활성화된 모든 서비스 통합이 활성화되고 정상적으로 작동하는지 확인합니다.

3. **업그레이드 오류 확인**: AWS Control Tower 콘솔에서 오류 메시지나 경고를 검토합니다.

### 4단계: 새 Config 기준 확인

- **새 `ConfigBaseline` 기준:** 이제 포괄적인 `AWSControlTowerBaseline` 없이도 탐지적 컨트롤을 지원하기 위한 별도의 OU 수준 `ConfigBaseline`이 있습니다. 자세한 내용은 [OU 수준의 기준 유형 목록](https://docs.aws.amazon.com//controltower/latest/userguide/types-of-baselines.html#ou-baseline-types)을 참조하세요. 기본 랜딩 존을 사용하는 기존 고객의 경우, [주요 변경 사항](https://docs.aws.amazon.com/controltower/latest/userguide/key-changes-lz-v4.html)에 설명된 종속성 요구사항의 주의사항과 함께 모든 서비스 통합이 선택 사항이 되었습니다.

![기준 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219222252.png)

### 5단계: AWS Config 변경 사항 확인

Landing Zone 4.0으로 업그레이드한 후 AWS Config는 상당한 아키텍처 변경을 겪습니다. 다음 확인 단계를 따르세요:

#### 위임된 관리자 등록 확인

감사 계정이 AWS Config 위임된 관리자로 등록되었는지 확인합니다:

```bash
# AWS Config에 대한 위임된 관리자 확인
aws organizations list-delegated-administrators \
  --service-principal config.amazonaws.com \
  --region <your-home-region>
```

예상 출력에 감사 계정 ID가 표시되어야 합니다.

#### 서비스 연결 Config 집계기 확인

감사 계정에 서비스 연결 Config 집계기(SLCA)가 존재하는지 확인합니다. 새 집계기의 이름은 `aws-controltower-ConfigAggregatorForOrganizations`이며 감사 계정에 배포됩니다(관리 계정에 있던 레거시 집계기와 대조):

```bash
# 감사 계정에서 구성 집계기 설명
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

감사 계정에서 `aws-controltower-ConfigAggregatorForOrganizations` 집계기를 확인할 수 있어야 합니다. 이는 관리 계정에 있던 레거시 집계기와 같은 이름을 공유하지만, 다른 계정에 배포된 다른 리소스입니다.

![집계기 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

#### 이전 집계기 제거 확인
레거시 집계기가 제거되었는지 확인합니다:

1. **관리 계정**에서 `aws-controltower-ConfigAggregatorForOrganizations`가 더 이상 존재하지 않는지 확인
2. **감사 계정**에서 `aws-controltower-GuardRailsComplianceAggregator`가 더 이상 존재하지 않는지 확인

```bash
# 관리 계정에서 - 이전 집계기 확인 (비어 있거나 찾을 수 없어야 함)
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

**사용자 지정 Config 집계기 검토**
AWS Control Tower 명명 규칙 외의 사용자 지정 AWS Config 집계기가 있다면, 계속 작동하는지 확인하세요. AWS Control Tower는 특정 명명 패턴의 집계기만 관리합니다. 사용자 지정 집계기는 영향을 받지 않으며 새 SLCA와 병렬로 실행할 수 있습니다.

#### 사용자 지정 Config 쿼리 마이그레이션 확인

관리 계정에서 이전 조직 수준 집계기에 대해 실행했던 사용자 지정 AWS Config 고급 쿼리는 이제 관리 계정에서 로컬로만 실행할 수 있습니다(교차 계정 불가). 교차 계정 쿼리를 실행하려면 새 `aws-controltower-ConfigAggregatorForOrganizations` 집계기가 있는 감사 계정에서 다시 생성하세요.

```bash
# 감사 계정에서 - 새 집계기가 모든 멤버 계정을 표시하는지 확인
aws configservice describe-configuration-aggregator-sources-status \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --region <your-home-region>
```

#### 새 S3 버킷 생성 확인

감사 계정에 새 전용 AWS Config S3 버킷이 존재하는지 확인합니다:

```bash
# 감사 계정의 S3 버킷 나열
aws s3 ls | grep aws-controltower-config-logs
```

예상 버킷 이름 패턴: `aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION_STRING>-<SUFFIX_STRING>`

![AWS Config S3 버킷 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215231.png)

> **참고**: 업그레이드 후 멤버 계정의 Config 데이터가 새 S3 버킷에 나타나기까지 최대 24시간이 걸릴 수 있습니다. S3에서 읽는 대시보드와 규정 준수 도구는 이 기간 동안 오래된 데이터를 표시합니다. 거의 실시간 데이터 접근을 위해서는 Config Aggregator API를 사용하세요.

#### CloudTrail 버킷 변경 없음 확인

AWS CloudTrail이 로그 아카이브 계정의 기존 버킷을 계속 사용하는지 확인합니다:

```bash
# 로그 아카이브 계정의 S3 버킷 나열
aws s3 ls | grep aws-controltower-logs
```

예상 버킷 이름 패턴: `aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>`

최근 타임스탬프를 확인하여 데이터 흐름을 테스트합니다:

```bash
# 최근 CloudTrail 로그 확인
aws s3 ls s3://aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>/ --recursive | tail -20
```

#### Config 전송 채널 확인

모든 등록된 계정의 AWS Config 전송 채널이 새 S3 버킷을 가리키는지 확인합니다:

```bash
# 전송 채널 설명
aws configservice describe-delivery-channels \
  --region <your-home-region>
```

`s3BucketName`이 새 `aws-controltower-config-logs-*` 버킷을 참조해야 합니다.

![AWS Config S3 버킷 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215431.png)

Control Tower에 의해 생성되지 않은 기존 Config 전송 채널이 있는 등록된 계정이 있다면, 수동으로 새 버킷을 가리키도록 업데이트해야 합니다:

```bash
# 기존 전송 채널을 새 버킷으로 업데이트
aws configservice put-delivery-channel \
  --delivery-channel name=<CHANNEL_NAME>,s3BucketName=aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION>-<SUFFIX>
```

#### SLCA 데이터 집계 확인

업그레이드 완료 후 전체 데이터 집계까지 24-48시간을 허용하세요. 그런 다음 새 서비스 연결 Config 집계기가 조직의 모든 AWS Config 레코더에서 데이터를 집계할 수 있는지 확인합니다(AWS Control Tower가 관리하지 않는 계정 포함):

```bash
# 집계된 규정 준수 요약 가져오기
aws configservice get-aggregate-compliance-details-by-config-rule \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --config-rule-name <any-config-rule-name> \
  --account-id <test-account-id> \
  --aws-region <region> \
  --region <your-home-region>
```

#### 다운스트림 대시보드 및 도구 확인

Config 데이터가 새 버킷으로 흐르기 시작한 후(최대 24시간), 모든 종속 대시보드와 도구가 최신 데이터를 수신하는지 확인합니다:

- 태그 규정 준수 대시보드
- 패치 규정 준수 대시보드
- SIEM 통합
- 사용자 지정 규정 준수 보고 도구

여전히 이전 `aws-controltower-logs-*` 버킷을 참조하는 대시보드는 업그레이드 이전의 오래된 데이터를 표시합니다. 새 `aws-controltower-config-logs-*` 버킷을 가리키도록 업데이트하거나, 가능하면 Config Aggregator API를 사용하도록 리팩터링하세요.


### 6단계: AWS CloudTrail 변경 사항 확인

AWS CloudTrail은 Landing Zone 4.0에서 최소한의 변경만 겪지만, 다음을 확인해야 합니다:

#### IAM 역할 정책 업데이트 확인

API를 통해 업그레이드한 경우, `AWSControlTowerCloudTrailRole`이 새 관리형 정책을 사용하는지 확인합니다:

```bash
# CloudTrail 역할에 연결된 정책 나열
aws iam list-attached-role-policies \
  --role-name AWSControlTowerCloudTrailRole
```

예상 출력에 `AWSControlTowerCloudTrailRolePolicy`가 포함되어야 합니다.

#### CloudTrail 로깅 지속 확인

조직 추적이 계속 로깅하는지 확인합니다:

```bash
# 추적 설명
aws cloudtrail describe-trails \
  --region <your-home-region>
```

추적 상태가 활성이고 예상 S3 버킷에 로깅하는지 확인합니다.

### 7단계: SNS 토픽 변경 사항 확인

Landing Zone 4.0은 각 서비스 통합에 대한 전용 SNS 토픽을 도입합니다. 감사 계정의 SNS 토픽을 확인합니다:

```bash
# 감사 계정의 SNS 토픽 나열
aws sns list-topics --region <your-home-region>
```

감사 계정에서 예상되는 SNS 토픽:
- `aws-controltower-AllConfigNotifications` - 여전히 AWS Config 이벤트를 수신
- `aws-controltower-AggregateSecurityNotifications` - 여전히 존재하지만 비드리프트 알림에만 사용
- `aws-controltower-AggregateConfigurationNotifications` - 규정 준수 알림에 계속 작동

![SNS 토픽 확인](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219211445.png)

`AWSControlTowerBaseline`이 활성화된 상태로 업그레이드하는 고객의 경우, 감사 계정의 기존 SNS 토픽과 구독은 보존되며 변경 없이 계속 작동합니다. 주요 변경 사항은 나중에 `AWSControlTowerBaseline`을 비활성화하는 고객의 경우입니다 — 이 경우 드리프트 알림이 Amazon SNS에서 관리 계정의 Amazon EventBridge로 이동합니다.

> **참고**: 일부 기존 SNS 토픽(예: `aws-controltower-AggregateSecurityNotifications`)에 활성 구독자가 없을 수 있습니다. 이는 예상된 동작이며 업그레이드 전 동작을 반영합니다 — 이러한 토픽은 플레이스홀더 역할을 하며 문제를 나타내지 않습니다.

모든 SNS 토픽 구독, 특히 서드파티 통합(ServiceNow, PagerDuty 등)에 대한 HTTPS 엔드포인트를 검토하여 업그레이드 후에도 계속 알림을 수신하는지 확인합니다.

### 8단계: 컨트롤 변경 사항 확인

AWS Control Tower Landing Zone 4.0에서는 필수 컨트롤에 대한 여러 변경 사항이 있었습니다. 변경 사항을 확인하려면 문서 [Landing Zone 4.0 컨트롤의 변경 사항](https://docs.aws.amazon.com/controltower/latest/controlreference/mandatory-controls.html#changes-in-landing-zone-40)을 따르세요.


## 조직 단위 재등록

Landing Zone 4.0으로 업그레이드한 후, 새 기준 버전을 멤버 계정에 적용하기 위해 OU를 재등록해야 합니다. 이는 단계적으로 수행할 수 있는 점진적 프로세스입니다.

#### OU 재등록 이해

AWS Control Tower가 버전 4.0으로 업데이트되면, 새 기준 종속성 구조로 인해 OU 재등록이 필요합니다. [기준과 AWS Control Tower 랜딩 존 버전의 호환성]에 대한 문서를 참조하세요.

OU를 재등록하면:
- AWS Control Tower가 해당 OU 내 모든 멤버 계정을 새 기준 버전으로 업데이트
- Control Tower가 관리하는 SCP가 새로 고쳐지는 동안 일시적으로 비활성(일반적으로 몇 분)
- 사용자 지정 SCP는 계속 적용되며 영향을 받지 않음
- 워크로드는 중단 없이 계속 실행
- 단일 배치로 OU당 최대 1,000개의 계정을 처리할 수 있음

> **중요**: 상위 OU를 재등록해도 하위 OU로 연쇄되지 않습니다. 계층 구조의 각 OU를 개별적으로 재등록해야 합니다. 최상위 OU부터 시작하여 하위로 진행하도록 계획하세요. 깊은 OU 계층 구조가 있는 경우 롤아웃에 상당한 시간이 추가될 수 있습니다.


#### 단계적 롤아웃 전략

**권장 접근 방식**:

1. **계층적 활성화**: 하위 OU로 진행하기 전에 최상위 OU부터 시작합니다. 각 하위 OU는 별도로 재등록해야 하며 연쇄되지 않습니다.
2. **혼합 기준 버전**: 전환 기간 동안 허용(하이브리드 3.x 및 4.0)
3. **배치 처리**: "Re-register OU"를 사용하여 OU 내 모든 계정을 업데이트(배치당 최대 1,000개 계정)
4. **각 OU 모니터링**: 다음 OU로 진행하기 전에 재등록 성공을 확인

#### 콘솔을 통한 OU 재등록

1. AWS Control Tower 콘솔에서 **OU** 페이지로 이동
2. 재등록할 OU 선택
3. **Re-register OU** 클릭
4. 업데이트될 계정 검토
5. **Re-register OU**를 클릭하여 확인
6. 콘솔에서 재등록 진행 상황 모니터링

**참고**: 마이그레이션 후 새 기준 버전을 배포하기 위해 특정 OU를 수동으로 재등록해야 할 수 있습니다. 이는 예상된 동작이며 기준 업데이트가 적용되는 시점을 제어할 수 있도록 합니다.

> **문제 해결**: 업그레이드 전에 이미 드리프트 상태였던 계정은 재등록 후에도 드리프트 상태가 유지될 수 있습니다. 이 경우 영향을 받는 계정에서 AWS Support에 지원 케이스를 열어 지속적인 드리프트를 조사하고 해결하세요.

## 추가 리소스

- [AWS Control Tower 사용 가이드](https://docs.aws.amazon.com/controltower/latest/userguide/)
- [AWS Control Tower API 참조](https://docs.aws.amazon.com/controltower/latest/APIReference/)
- [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html)
- [AWS Config 사용 가이드](https://docs.aws.amazon.com/config/latest/developerguide/)
- [AWS CloudTrail 사용 가이드](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/)
- [AWS Organizations 사용 가이드](https://docs.aws.amazon.com/organizations/latest/userguide/)
