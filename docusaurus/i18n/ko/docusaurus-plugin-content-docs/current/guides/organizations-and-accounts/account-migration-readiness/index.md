---
sidebar_position: 1
---

# AWS Organizations 계정 마이그레이션 준비 가이드

> **면책 조항:** 이 가이드는 AWS 계정을 조직 간에 이전할 때 일반적으로 발생하는 종속성과 고려 사항을 기반으로 최선의 안내를 제공합니다. 마이그레이션의 성공적인 완료는 각 고객의 고유한 시나리오, 워크로드 및 종속성에 따라 달라집니다. 고객은 자신의 특정 환경을 철저히 평가하고, 모든 종속성을 검증하며, 실행 전에 마이그레이션 계획을 테스트할 책임이 있습니다. 이 가이드는 모든 가능한 종속성이나 엣지 케이스를 다루지는 않습니다.

## 범위

이 가이드는 **AWS Organizations 간의 계정 마이그레이션**을 다룹니다. 여기서 설명하는 접근 방식은 [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/)와 [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)를 활용하여 검토 및 평가 프로세스를 신속하게 진행합니다. 사용하는 도구나 접근 방식에 따라 단계가 다를 수 있지만, 이 가이드는 검증된 하나의 방법을 제공합니다.

:::tip
AWS Control Tower 환경으로 계정을 이전하는 경우, 이 가이드를 마이그레이션 전 종속성 점검으로 활용한 후, 계정이 대상 조직으로 이전된 다음 [Enroll an existing AWS account](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) 가이드를 보완적으로 따르시기 바랍니다.
:::

## 주요 서비스 및 종속성 개요

다음 표는 계정을 조직 간에 이전할 때 영향을 받을 수 있는 주요 AWS 서비스 및 기능을 요약합니다:

| 카테고리 | 서비스/기능 | 이전 시 영향 |
|----------|----------------|-------------------:|
| **접근 제어** | IAM Identity Center | 권한 세트 할당이 제거되어 사용자가 접근 권한을 잃음 |
| **인가** | Service control policies (SCPs) | 즉시 적용이 중단됨 |
| **인가** | Resource control policies (RCPs) | 즉시 적용이 중단됨 |
| **선언적** | Declarative policies (EC2) | 즉시 적용이 중단됨 |
| **관리** | Tag, Backup, AI opt-out 정책 | 계정에서 분리됨 |
| **인프라** | AWS CloudFormation StackSets | 리소스가 삭제될 수 있음 (보존 설정에 따라 다름) |
| **리소스 공유** | AWS Resource Access Manager | 조직 범위 공유가 취소됨 (보존 기능을 활성화하지 않은 경우) |
| **위임** | Delegated administrator 서비스 | 이전 전에 등록 해제해야 하며, 일부 서비스는 데이터를 삭제함 |
| **정책 조건** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | 원본 조직 ID를 참조하는 정책이 접근을 거부함 |
| **결제** | Reserved Instances / Savings Plans | 조직 전체 공유 혜택이 사라짐 |
| **결제** | Cost allocation tags | 대상 조직에서 재활성화해야 함 |
| **Observability** | Amazon EventBridge 교차 계정 | 조직 ID를 참조하는 이벤트 버스 정책이 작동하지 않게 됨 |
| **계정 접근** | Root user / `OrganizationAccountAccessRole` | 이전 전에 확인하지 않으면 모든 접근 권한을 잃을 수 있음 |

## 개요

이 가이드는 AWS 계정을 AWS Organizations 간에 이전하기 전에 마이그레이션 준비 상태를 평가하는 단계별 프로세스를 제공합니다. 자동화된 도구([Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md))와 검증된 CLI 명령을 결합하여 모든 종속성을 포괄합니다.

**적용 대상:** 인수합병, 조직 통합, 계정 재구성

**활용하는 주요 기능:**
- [Direct Account Transfers](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/) (2025년 11월) — 독립 기간(standalone period) 불필요
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/) (2026년 2월) — 이전 중 리소스 공유 보존

**참고 자료:**
- [Migrate an account to another organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — AWS 문서
- [Moving an account - Part 1: Policies, AWS RAM, condition keys](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — AWS 블로그
- [Moving an account - Part 2: Delegated administrators](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — AWS 블로그

---

## 1단계: 평가 도구 배포

### 1.1 Account Assessment for AWS Organizations 배포

관리 계정에 배포합니다. 제공 기능: Policy Explorer, Delegated Admin 스캔, Trusted Access 스캔

:::note
이 가이드에서는 간단하게 Hub 스택을 관리 계정에 배포하는 방식을 보여줍니다. 프로덕션 환경에서는 관리 계정에서 최소 권한 원칙을 준수하기 위해, Hub 스택을 **별도의 멤버 계정**(예: 공유 서비스 또는 보안 도구 계정)에 배포하는 것이 권장됩니다. Org-Management 스택은 어떤 경우든 항상 관리 계정에 배포해야 합니다.
:::

**Hub Stack (관리 계정):**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Hub \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-hub.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=UserEmail,ParameterValue=<EMAIL> \
    "ParameterKey=AllowListedIPRanges,ParameterValue=0.0.0.0/1\,128.0.0.0/1" \
    ParameterKey=OrganizationID,ParameterValue=<ORG_ID> \
    ParameterKey=ManagementAccountId,ParameterValue=<MGMT_ACCOUNT_ID> \
  --region <REGION>
```

**Org-Management Stack (관리 계정):**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-OrgMgmt \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-org-management.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

**Spoke Stack (평가 대상 각 계정, StackSet을 통해 배포):**
```bash
aws cloudformation create-stack-set \
  --stack-set-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --permission-model SERVICE_MANAGED \
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false \
  --region <REGION>

aws cloudformation create-stack-instances \
  --stack-set-name AccountAssessment-Spoke \
  --deployment-targets OrganizationalUnitIds=<ROOT_OR_OU_ID> \
  --regions <REGION> \
  --region <REGION>
```

> **중요:** 관리 계정에도 Spoke 스택을 직접 배포해야 합니다 (SERVICE_MANAGED 권한 모델의 StackSets는 관리 계정을 제외함):
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

### 1.2 CFAT (Cloud Foundation Assessment Tool) 실행

관리 계정의 CloudShell에서 실행합니다:
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

결과 다운로드: `./cfat/assessment.zip`

---

## 2단계: 자동화된 평가 (Account Assessment 도구)

### 2.1 웹 UI에서 스캔 실행

1. Account Assessment 웹 UI에 로그인합니다 (Cognito 자격 증명은 이메일로 확인)
2. **Delegated Admin** 스캔 실행 → CSV 다운로드
3. **Trusted Access** 스캔 실행 → CSV 다운로드
4. **Policy Explorer** 야간 스캔 완료를 대기합니다 (또는 수동으로 트리거):

```bash
# Policy Explorer 스캔을 수동으로 트리거
aws lambda invoke \
  --function-name <NAMESPACE>-PolicyExplorerStartScan-<ID> \
  --payload '{"source": "manual-trigger"}' \
  --region <REGION> \
  /dev/null
```

### 2.2 Policy Explorer에서 조직 종속성 검색

웹 UI의 Policy Explorer에서:
1. **"Add OrgId"** 버튼을 클릭하여 정책 조건에서 Organization ID를 검색합니다
2. `aws:PrincipalOrgID`, `aws:PrincipalOrgPaths`, `aws:ResourceOrgID`를 검색합니다
3. 결과를 CSV로 다운로드합니다

**검색 결과로 확인할 수 있는 항목:**
- 조직 조건이 포함된 리소스 기반 정책 (S3, KMS, SQS, SNS, Lambda 등)
- 조직을 참조하는 자격 증명 기반 정책
- 조직 관련 조건이 포함된 SCPs

---

## 3단계: 수동 종속성 확인 (CLI 명령)

다음 점검 항목은 자동화된 도구에서 다루지 않는 부분을 보완합니다.

### 3.1 계정을 대상으로 하는 AWS CloudFormation StackSets

**위험:** 서비스 관리형 StackSets는 계정이 조직을 떠날 때 해당 계정의 리소스를 삭제합니다 (`RetainStacksOnAccountRemoval=true`로 설정하지 않은 경우).

:::info
다음 명령은 **관리 계정** 또는 CloudFormation StackSets의 위임된 관리자 계정에서 실행합니다. 서비스 관리형 StackSets는 이러한 계정에서만 관리할 수 있습니다.
:::

```bash
# 모든 활성 StackSets 목록 조회
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

# 각 StackSet에 대해, 마이그레이션 대상 계정에 인스턴스가 있는지 확인
aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>

# 보존 설정 확인
aws cloudformation describe-stack-set \
  --stack-set-name <STACKSET_NAME> \
  --region <REGION> \
  --query "StackSet.AutoDeployment.RetainStacksOnAccountRemoval"
```

**조치:** `RetainStacksOnAccountRemoval=false`로 설정된 각 StackSet 중 중요한 리소스를 배포하는 경우, 다음 중 하나를 수행합니다:
- 마이그레이션 전에 `RetainStacksOnAccountRemoval=true`로 업데이트
- 또는 해당 리소스가 삭제될 것임을 문서화하고 대상 조직에서 재생성 계획 수립

### 3.2 IAM Identity Center 할당

**위험:** 마이그레이션 대상 계정의 모든 권한 세트 할당이 계정이 떠날 때 제거됩니다. 사용자는 해당 계정에 대한 IAM Identity Center 접근 권한을 잃게 됩니다.

:::info
다음 명령은 **관리 계정** 또는 Identity Center 위임된 관리자 계정에서 실행합니다.
:::

```bash
# Identity Center 인스턴스 ARN 조회
aws sso-admin list-instances --region <REGION>

# 해당 계정에 프로비저닝된 모든 권한 세트 목록 조회
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>

# 각 권한 세트에 대해 접근 권한이 있는 사용자 목록 조회
aws sso-admin list-account-assignments \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --region <REGION>
```

**조치:** 모든 할당을 문서화합니다. 대상 조직의 Identity Center에서 마이그레이션 후 동등한 권한 세트와 할당을 재생성합니다.

### 3.3 AWS Resource Access Manager (AWS RAM) 리소스 공유

**위험:** 조직 범위의 AWS RAM 공유는 계정이 떠날 때 취소됩니다. 2026년 2월에 출시된 새 기능을 통해 보존이 가능합니다.

```bash
# 마이그레이션 대상 계정이 소유한 공유 확인 (해당 계정에서 실행)
aws ram get-resource-shares --resource-owner SELF --region <REGION>

# 마이그레이션 대상 계정이 사용 중인 공유 확인
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>

# 공유에 포함된 실제 리소스 목록 조회
aws ram list-resources --resource-owner OTHER-ACCOUNTS --region <REGION>
aws ram list-resources --resource-owner SELF --region <REGION>
```

**완화 조치 (2026년 2월 기능):** 이전 전에 AWS RAM 공유에 보존 기능을 활성화합니다:
```bash
# 공유 소유자 계정에서 실행
aws ram update-resource-share \
  --resource-share-arn <SHARE_ARN> \
  --retain-sharing-on-account-leave-organization \
  --region <REGION>
```

**SCP를 통한 조직 전체 적용:**
```json
{
  "Effect": "Deny",
  "Action": ["ram:CreateResourceShare", "ram:UpdateResourceShare"],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "ram:RetainSharingOnAccountLeaveOrganization": "false"
    }
  }
}
```

### 3.4 조직 정책 (인가, 선언적, 관리 정책)

**위험:** 계정이 이전되면 모든 조직 정책의 적용이 중단됩니다. 여기에는 인가 정책(SCPs, RCPs), 선언적 정책(EC2), 관리 정책이 포함됩니다.

:::info
다음 명령은 **관리 계정** 또는 AWS Organizations의 위임된 관리자 계정에서 실행합니다.
:::

> **중요:** Account Assessment의 Policy Explorer는 **SCP 내용**만 스캔합니다. RCPs, 선언적 정책, 관리 정책은 다루지 않으므로 수동으로 확인해야 합니다.
>
> **팁:** CFAT는 유용한 초기 스냅샷을 제공합니다 — SCPs, RCPs, Tag Policies, Backup Policies가 조직 수준에서 활성화되어 있는지 확인할 수 있습니다. 이를 출발점으로 삼아 아래 CLI 명령으로 더 깊이 조사해야 할 정책 유형을 파악하세요.

```bash
# 먼저: 조직에서 활성화된 모든 정책 유형 확인
aws organizations list-roots --query "Roots[0].PolicyTypes"

# --- 인가 정책 ---

# 계정에 적용된 SCPs (Policy Explorer에서도 내용 확인 가능)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# 계정에 적용된 RCPs (Policy Explorer에서 다루지 않음)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY

# --- 선언적 정책 ---

# Declarative Policies (EC2 - 예: 허용된 AMI, 퍼블릭 스냅샷 차단)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter DECLARATIVE_POLICY_EC2

# --- 관리 정책 ---

# 활성화된 각 관리 정책 유형 확인:
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter TAG_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BACKUP_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter AISERVICES_OPT_OUT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BEDROCK_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter CHATBOT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter INSPECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter NETWORK_SECURITY_DIRECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter S3_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter SECURITYHUB_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter UPGRADE_ROLLOUT_POLICY

# 계정의 상위 OU 조회 (정책이 상속될 수 있음)
aws organizations list-parents --child-id <ACCOUNT_ID>

# OU 수준의 정책 목록 조회 (각 정책 유형에 대해 반복)
aws organizations list-policies-for-target \
  --target-id <OU_ID> \
  --filter <POLICY_TYPE>

# 대상 조직에서 복제할 정책 내용 조회
aws organizations describe-policy --policy-id <POLICY_ID>

# 유효한 관리 정책 조회
aws organizations describe-effective-policy \
  --policy-type TAG_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type BACKUP_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type AISERVICES_OPT_OUT_POLICY \
  --target-id <ACCOUNT_ID>
```

**주요 구분:**
- **인가 정책 (SCPs, RCPs)** — SCPs는 보안 주체가 수행할 수 있는 API 작업을 제한합니다. RCPs는 리소스에 대해 수행할 수 있는 작업을 제한합니다 (예: Secrets Manager에 대한 비암호화 접근 차단). Policy Explorer는 SCPs만 스캔하며 RCPs는 스캔하지 않습니다.
- **선언적 정책 (EC2)** — EC2에 대한 원하는 상태 구성을 강제합니다 (예: 허용된 AMI만 사용, 퍼블릭 스냅샷 차단). 어떤 도구에서도 스캔되지 않습니다.
- **관리 정책** — Tag, Backup, AI opt-out, Bedrock, ChatBot, Inspector, SecurityHub, S3, Network Security Director, Upgrade Rollout. 이전 시 분리됩니다. 어떤 도구에서도 스캔되지 않습니다.

**조치:** 조직에서 활성화된 각 정책 유형에 대해:
1. 계정에 적용된 정책 목록 조회 (직접 적용 + OU/루트에서 상속된 정책)
2. `describe-policy`로 정책 내용 확인
3. 이전 전에 대상 조직에서 복제
4. 선언적 정책의 경우: 계정의 리소스가 대상 조직 정책도 준수하는지 확인

### 3.5 Delegated administrator 서비스

**위험:** 마이그레이션 전에 등록을 해제해야 합니다. 일부 서비스는 등록 해제 시 데이터를 삭제합니다 (Detective, Firewall Manager).

:::info
다음 명령은 **관리 계정**에서 실행합니다.
:::

```bash
# 모든 위임된 관리자 계정 목록 조회
aws organizations list-delegated-administrators

# 마이그레이션 대상 계정의 서비스 목록 조회
aws organizations list-delegated-services-for-account \
  --account-id <ACCOUNT_ID>
```

**조치:** 각 위임된 서비스에 대해:
1. 대체 위임 관리자를 등록합니다 (조직이 계속 운영되는 경우)
2. 마이그레이션 대상 계정의 등록을 해제합니다
3. 서비스별 등록 해제 명령 및 데이터 손실 영향은 Part 2 블로그를 참고하세요

### 3.6 Amazon EventBridge 교차 계정 이벤트 버스

**위험:** 조직을 참조하는 교차 계정 이벤트 전달 권한이 작동하지 않게 됩니다.

```bash
# 이벤트 버스 정책에서 조직 기반 권한 확인
aws events describe-event-bus --region <REGION>

# EventBridge를 사용하는 모든 리전에서 확인
aws events describe-event-bus --name default --region <REGION>
```

**조치:** 이벤트 버스 리소스 정책을 조직 ID 대신 계정 ID를 사용하도록 업데이트하거나, 대상 조직 ID를 추가합니다.

### 3.7 결제 및 비용 관리

**위험:** 조직 수준의 결제 내역은 관리 계정에 남습니다. Cost allocation tags는 재활성화해야 합니다.

```bash
# 활성 cost allocation tags 목록 조회 (대상 조직에서 재생성하기 위해)
aws ce list-cost-allocation-tags --status Active

# CUR 보고서 설정 확인
aws cur describe-report-definitions --region us-east-1

# 조직 정보 확인 (기능 세트, 대상 조직 호환성용)
aws organizations describe-organization

# 마이그레이션 대상 계정이 소유한 Savings Plans 목록 조회 (해당 계정에서 실행)
aws savingsplans list-savings-plans --states active

# 마이그레이션 대상 계정이 소유한 Reserved Instances 목록 조회 (해당 계정에서 실행)
aws ec2 describe-reserved-instances --filters Name=state,Values=active --region <REGION>

# Reserved Instance/Savings Plan 공유 기본 설정 확인 (관리 계정에서 실행)
# 참고: Billing Console → Preferences → RI and Savings Plans discount sharing에서
# 공유 모드 (Organization-wide, Prioritized Group, Restricted Group) 확인
```

**조치:**
- 이전 전에 모든 결제 보고서를 내보냅니다
- 활성 cost allocation tags를 문서화합니다
- 대상 조직에서 cost allocation tags를 재활성화합니다 (최대 24시간 소요)
- **Reserved Instances 및 Savings Plans:**
  - 마이그레이션 대상 계정이 **구매한** Reserved Instances/Savings Plans는 계정과 함께 이동합니다 — 그러나 원본 조직의 통합 청구서에는 더 이상 적용되지 않습니다
  - 원본 조직의 **다른 계정**이 구매하여 마이그레이션 대상 계정과 공유하던 Reserved Instances/Savings Plans는 이전 후 더 이상 마이그레이션 계정에 혜택을 제공하지 않습니다
  - Reserved Instances/Savings Plans는 구매된 조직에서만 적용됩니다 — 여러 조직에 걸쳐 적용될 수 없습니다
  - 마이그레이션 대상 계정이 조직 전체 Reserved Instance/Savings Plan 공유 혜택을 받고 있었다면, 이전 즉시 해당 할인을 잃게 됩니다
  - 마이그레이션 대상 계정이 조직 전체로 공유되던 Reserved Instances/Savings Plans를 소유하고 있었다면, 원본 조직은 해당 할인 용량을 잃게 됩니다
  - **공유 모드 확인:** Organization-wide, Prioritized Group, Restricted Group 공유에 따라 영향 범위가 달라집니다
  - 마이그레이션 전에 Reserved Instances/Savings Plans를 다른 계정으로 이전해야 하는 경우 AWS Support에 문의하세요

---

## 4단계: CFAT 기반 준비 상태 (대상 조직)

CFAT 결과를 사용하여 **대상 조직**이 계정을 수용할 준비가 되었는지 확인합니다:

| CFAT 점검 항목 | 마이그레이션에서 중요한 이유 |
|------------|------------------------------|
| Control Tower 배포됨 | 이전되는 계정에 가드레일을 제공 |
| Security OU 존재 | 계정에 관리된 랜딩 존이 필요 |
| Log Archive 계정 존재 | 마이그레이션된 계정의 중앙 집중식 로깅 |
| IAM Identity Center 구성됨 | 사용자가 새 계정에 IAM Identity Center 접근이 필요 |
| SCPs 활성화됨 | 거버넌스 정책이 준비되어야 함 |
| Config Recorder 활성화됨 | 새 계정의 규정 준수 모니터링 |

---

## 5단계: 이전 전 체크리스트

| # | 점검 항목 | 도구 | CLI 명령 | 상태 |
|---|-------|------|-------------|--------|
| 1 | 리소스 기반 정책의 Org ID | Account Assessment (Policy Explorer) | Web UI → Add OrgId | ☐ |
| 2 | 자격 증명 기반 정책의 Org ID | Account Assessment (Policy Explorer) | Web UI 검색 | ☐ |
| 3 | Delegated admin 서비스 | Account Assessment (Delegated Admin 스캔) | `list-delegated-services-for-account` | ☐ |
| 4 | Trusted access 서비스 | Account Assessment (Trusted Access 스캔) | `list-aws-service-access-for-organization` | ☐ |
| 5 | 계정을 대상으로 하는 StackSets | 수동 | `list-stack-instances --stack-instance-account` | ☐ |
| 6 | StackSet 보존 설정 | 수동 | `describe-stack-set` → AutoDeployment | ☐ |
| 7 | Identity Center 할당 | 수동 | `list-permission-sets-provisioned-to-account` | ☐ |
| 8 | AWS RAM 공유 (소유) | 수동 | `get-resource-shares --resource-owner SELF` | ☐ |
| 9 | AWS RAM 공유 (사용 중) | 수동 | `get-resource-shares --resource-owner OTHER-ACCOUNTS` | ☐ |
| 10 | AWS RAM RetainSharing 활성화 | 수동 | `update-resource-share --retain-sharing...` | ☐ |
| 11 | 계정에 적용된 SCPs (인가) | Account Assessment (Policy Explorer) + 수동 | `list-policies-for-target` | ☐ |
| 12 | 계정에 적용된 RCPs (인가) | 수동 (Policy Explorer에 포함되지 않음) | `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` | ☐ |
| 13 | 계정에 적용된 Declarative Policies (EC2) | 수동 (어떤 도구에도 포함되지 않음) | `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` | ☐ |
| 14 | 관리 정책 (Tag/Backup/AI/Bedrock/ChatBot/Inspector/SecurityHub/S3 등) | 수동 | `describe-effective-policy` + `list-policies-for-target` | ☐ |
| 15 | EventBridge 교차 계정 | 수동 | `describe-event-bus` | ☐ |
| 16 | Cost allocation tags 문서화 | 수동 | `list-cost-allocation-tags --status Active` | ☐ |
| 17 | CUR 보고서 내보내기 | 수동 | `describe-report-definitions` | ☐ |
| 18 | Reserved Instance/Savings Plan 소유 및 공유 영향 평가 | 수동 | `list-savings-plans` + `describe-reserved-instances` | ☐ |
| 19 | 대상 조직 생성 후 7일 이상 경과 | 수동 | `describe-organization` | ☐ |
| 20 | 대상 조직 계정 할당량 | 수동 | Service Quotas 확인 | ☐ |
| 21 | 대상 조직 SCPs/RCPs/Declarative policies 준비 완료 | 수동 | 원본에서 복제 | ☐ |
| 22 | 대상 조직 Identity Center 준비 완료 | CFAT | 대상에서 CFAT 실행 | ☐ |
| 23 | OrganizationAccountAccessRole 제거 | 수동 | 마이그레이션 계정에서 IAM 역할 삭제 | ☐ |

---

## 5.5단계: 비상 접근 — 계정 복구 옵션 확인

**시나리오:** Identity Center 접근이나 기타 접근 제어를 확인하지 않고 계정을 이전하면, 계정에 대한 모든 접근 권한을 잃을 수 있습니다. 이전 전에 독립적으로 접근을 복구할 수 있는지 확인하세요.

**이것이 중요한 이유:** 계정이 원본 조직을 떠나면:
- Identity Center 권한 세트가 제거됨 → IAM Identity Center 접근 불가
- `OrganizationAccountAccessRole` 신뢰 관계가 깨질 수 있음 → 교차 계정 접근 불가
- Root user 자격 증명이 없는 경우 (조직에서 생성된 계정에서 흔함) → 계정 잠김

### 이전 전: 복구 옵션 확인

```bash
# 계정에 유효한 root user 이메일이 있는지 확인 (해당 이메일을 수신할 수 있나요?)
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# 전화번호가 설정되어 있는지 확인 (root user MFA 복구에 필요)
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1

# 대체 연락처가 구성되어 있는지 확인
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type SECURITY --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type BILLING --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type OPERATIONS --region us-east-1
```

### 이전 전: 필요한 경우 복구 정보 업데이트

```bash
# Root user 이메일 업데이트 (관리 계정에서, Account Management trusted access 필요)
aws account start-primary-email-update --account-id <ACCOUNT_ID> --primary-email <NEW_EMAIL> --region us-east-1
aws account accept-primary-email-update --account-id <ACCOUNT_ID> --otp <CODE> --primary-email <NEW_EMAIL> --region us-east-1

# 계정 이름 업데이트 (2025년 4월 기능 — 더 이상 root 접근 불필요)
aws account put-account-name --account-id <ACCOUNT_ID> --account-name <NEW_NAME> --region us-east-1

# 전화번호 / 연락처 정보 업데이트
aws account put-contact-information --account-id <ACCOUNT_ID> --region us-east-1 \
  --contact-information '{
    "FullName": "<NAME>",
    "PhoneNumber": "<PHONE>",
    "AddressLine1": "<ADDRESS>",
    "City": "<CITY>",
    "StateOrRegion": "<STATE>",
    "PostalCode": "<ZIP>",
    "CountryCode": "<CC>"
  }'
```

### 비상 복구 옵션 (이전 후 접근이 불가능한 경우)

> ⚠️ **사전 점검이 매우 중요합니다.** AWS Support에 연락하는 것은 최후의 수단이어야 합니다 — 여러 신원 확인 단계가 필요하고, 며칠이 걸릴 수 있으며, 접근 복구가 보장되지 않습니다. 이전 전에 모든 복구 옵션을 확인하세요.

| 우선순위 | 방법 | 사용 시기 | 방법 |
|----------|--------|-------------|------|
| 1순위 | **Root user 비밀번호 재설정** | root 이메일에 접근 가능한 경우 | AWS 로그인 → "Forgot password" → 이메일로 재설정 |
| 2순위 | **Root user MFA 재설정** | MFA 디바이스 분실, 전화번호 보유 | 로그인 시 전화 인증 절차 사용 |
| 3순위 | **관리 계정 (대상 조직)** | 계정이 이미 대상 조직에 있는 경우 | `OrganizationAccountAccessRole`이 존재하면 사용, 또는 Account Management API 활용 |
| **최후 수단** | **AWS Support** | 이메일/전화 접근 불가, 다른 모든 옵션 소진 | 다른 계정에서 지원 케이스 오픈. 여러 확인 단계 필요 (계정 ID, 연락처 정보, 결제 세부 정보). **성공이 보장되지 않으며 시간이 오래 걸릴 수 있음.** |

### 이전 전 복구 체크리스트

| # | 점검 항목 | 상태 |
|---|-------|--------|
| 1 | Root user 이메일에 접근 가능 (이메일 수신 가능) | ☐ |
| 2 | Root user 비밀번호를 알고 있거나 이메일로 재설정 가능 | ☐ |
| 3 | 계정의 전화번호가 최신이며 접근 가능 | ☐ |
| 4 | Root user의 MFA 디바이스가 문서화되어 있고 접근 가능 | ☐ |
| 5 | 계정 내에 admin 접근 권한을 가진 IAM 사용자/역할이 최소 하나 존재 (조직과 무관하게 독립적으로) | ☐ |
| 6 | 대체 연락처 (Security, Billing, Operations) 설정 완료 | ☐ |

> **중요:** Organizations에서 `CreateAccount`로 생성된 계정은 root user 자격 증명이 설정된 적이 없을 수 있습니다. 계정을 독립적으로 접근할 수 있도록 이전 전에 반드시 root user 비밀번호 재설정(root 이메일을 통해)을 수행해야 합니다.

---

## 6단계: 이전 실행 (직접 이전)

직접 이전 기능(2025년 11월)을 사용하면 독립 기간이 필요하지 않습니다:

```bash
# 1단계: 대상 조직 관리 계정에서 - 초대장 발송
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# 2단계: 마이그레이션 대상 계정에서 - 초대 수락
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## 7단계: 이전 후 검증

```bash
# 계정이 새 조직에 있는지 확인
aws organizations describe-organization

# 계정을 올바른 OU로 이동
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# SCPs가 적용되었는지 확인
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# AWS RAM 공유 초대 수락
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <INVITATION_ARN> \
  --region <REGION>

# 대상 조직에서 cost allocation tags 재활성화
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status '[{"TagKey": "<KEY>", "Status": "Active"}]'

# 대상 조직에서 Identity Center 할당 설정
aws sso-admin create-account-assignment \
  --instance-arn <TARGET_INSTANCE_ARN> \
  --target-id <ACCOUNT_ID> \
  --target-type AWS_ACCOUNT \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --principal-type <USER|GROUP> \
  --principal-id <PRINCIPAL_ID> \
  --region <REGION>
```

---

## 부록: 도구 커버리지 매트릭스

| 종속성 카테고리 | Account Assessment | CFAT | 수동 CLI |
|--------------------|-------------------|------|------------|
| 리소스 기반 정책 (조직 조건) | ✅ Policy Explorer | ❌ | — |
| 자격 증명 기반 정책 (조직 조건) | ✅ Policy Explorer | ❌ | — |
| SCP 내용 및 조건 (인가) | ✅ Policy Explorer | ❌ | `describe-policy` |
| **RCPs (인가)** | ❌ | ✅ 활성화 여부만 확인 | ✅ `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` |
| **Declarative Policies (EC2)** | ❌ | ❌ | ✅ `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` |
| **관리 정책 (Bedrock, ChatBot, Inspector, SecurityHub, S3 등)** | ❌ | ❌ | ✅ `list-policies-for-target --filter <TYPE>` |
| Tag/Backup/AI opt-out (관리) | ❌ | ✅ 활성화 여부만 확인 | ✅ `describe-effective-policy` |
| Delegated administrators | ✅ 스캔 | ❌ | `list-delegated-services-for-account` |
| Trusted access 서비스 | ✅ 스캔 | ✅ 서비스 목록 제공 | `list-aws-service-access-for-organization` |
| StackSets (위험에 처한 리소스) | ❌ | ❌ | ✅ `list-stack-instances` + `describe-stack-set` |
| Identity Center 할당 | ❌ | ✅ 구성 여부 확인 | ✅ `list-account-assignments` |
| AWS RAM 리소스 공유 | ❌ | ❌ | ✅ `get-resource-shares` |
| Reserved Instance/Savings Plan 소유 및 공유 영향 | ❌ | ❌ | ✅ `list-savings-plans` + `describe-reserved-instances` |
| EventBridge 교차 계정 | ❌ | ❌ | ✅ `describe-event-bus` |
| Cost allocation tags | ❌ | ❌ | ✅ `list-cost-allocation-tags` |
| Control Tower 상태 | ❌ | ✅ | — |
| 기반 모범 사례 | ❌ | ✅ 전체 평가 | — |
| 조직 할당량 | ❌ | ❌ | ✅ Service Quotas 콘솔 |

---

## 부록: 주요 날짜 및 기능 가용성

| 기능 | 날짜 | 마이그레이션에 미치는 영향 |
|---------|------|---------------------|
| Direct Account Transfers | 2025년 11월 | 독립 기간 불필요, 결제/연락처 재설정 불필요 |
| AWS RAM RetainSharingOnAccountLeaveOrganization | 2026년 2월 | 이전 중에도 리소스 공유가 유지됨 |
| Account Assessment Policy Explorer | v1.1.0+ | 조직 종속 정책에 대한 야간 스캔 |

---

*Account Assessment for AWS Organizations와 CFAT를 사용하여 작성되었습니다. 모든 CLI 명령은 실제 AWS API에서 검증되었습니다.*
