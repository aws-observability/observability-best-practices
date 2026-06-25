---
sidebar_position: 1
---

# AWS Organizations ఖాతా migration readiness గైడ్

> **Disclaimer:** ఈ గైడ్ AWS organizations మధ్య AWS accounts transfer చేసేటప్పుడు సాధారణంగా ఎదురయ్యే dependencies మరియు considerations ఆధారంగా best-effort guidance అందిస్తుంది. ఏ migration యొక్క విజయవంతమైన completion ప్రతి customer యొక్క unique scenario, workloads, మరియు dependencies పై ఆధారపడుతుంది. Customers తమ specific environment thoroughly assess చేయడం, అన్ని dependencies validate చేయడం, మరియు execution ముందు తమ migration plan test చేయడం బాధ్యత వహిస్తారు.

## పరిధి

ఈ గైడ్ **AWS Organizations మధ్య account migration** ను cover చేస్తుంది. ఇక్కడ వివరించబడిన approach review మరియు assessment process ను expedite చేయడానికి [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) మరియు [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) ఉపయోగిస్తుంది.

:::tip
AWS Control Tower environment లోకి accounts move చేసేటప్పుడు, ఈ guide ను pre-migration dependency check గా ఉపయోగించండి, ఆపై account target organization కు transfer అయిన తర్వాత complement గా [Enroll an existing AWS account](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) guide అనుసరించండి.
:::

## ముఖ్య services మరియు dependencies ఒక చూపులో

ఈ క్రింది table organizations మధ్య account transfer అయినప్పుడు impact అయ్యే key AWS services మరియు features summarize చేస్తుంది:

| Category | Service/feature | Transfer పై Impact |
|----------|----------------|-------------------|
| **Access control** | IAM Identity Center | Permission set assignments removed; users lose access |
| **Authorization** | Service control policies (SCPs) | వెంటనే apply అవ్వడం ఆగిపోతుంది |
| **Authorization** | Resource control policies (RCPs) | వెంటనే apply అవ్వడం ఆగిపోతుంది |
| **Declarative** | Declarative policies (EC2) | వెంటనే apply అవ్వడం ఆగిపోతుంది |
| **Management** | Tag, Backup, AI opt-out policies | Account నుండి detach అవుతాయి |
| **Infrastructure** | AWS CloudFormation StackSets | Resources delete అవ్వవచ్చు (retention setting పై ఆధారపడి) |
| **Resource sharing** | AWS Resource Access Manager | Organization-scoped shares revoked (retention enable చేయకపోతే) |
| **Delegation** | Delegated administrator services | Transfer ముందు deregister చేయాలి |
| **Policy conditions** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | Source organization ID reference చేసే policies access deny చేస్తాయి |
| **Billing** | Reserved Instances / Savings Plans | Organization-wide sharing benefits lost |
| **Observability** | Amazon EventBridge cross-account | Organization ID reference చేసే event bus policies break అవుతాయి |
| **Account access** | Root user / `OrganizationAccountAccessRole` | Transfer ముందు verify చేయకపోతే అన్ని access కోల్పోవచ్చు |

## అవలోకనం

ఈ గైడ్ AWS Organizations మధ్య AWS account transfer చేయడానికి ముందు migration readiness assess చేయడానికి step-by-step process అందిస్తుంది.

**వర్తించేవి:** Mergers & acquisitions, organization consolidation, account restructuring.

**References:**
- [Migrate an account to another organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html)
- [Moving an account - Part 1: Policies, AWS RAM, condition keys](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/)
- [Moving an account - Part 2: Delegated administrators](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/)

---

## Phase 1: Assessment tools deploy చేయడం

### 1.1 Account Assessment for AWS Organizations Deploy చేయడం

Management account లో deploy చేయండి. అందిస్తుంది: Policy Explorer, Delegated Admin scan, Trusted Access scan.

:::note
Simplicity కోసం, ఈ guide Hub stack ను management account లో deploy చేయడం చూపిస్తుంది. Production environments కోసం, management account లో least privilege principle follow చేయడానికి Hub stack ను **separate member account** లో deploy చేయడం AWS recommend చేస్తుంది.
:::

**Hub Stack (management account):**
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

### 1.2 CFAT (Cloud Foundation Assessment Tool) Run చేయడం

Management account లో CloudShell నుండి run చేయండి:
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

---

## Phase 2: Automated assessment

### 2.1 Web UI నుండి Scans Run చేయడం

1. Account Assessment web UI లో login అవ్వండి
2. **Delegated Admin** scan run చేయండి
3. **Trusted Access** scan run చేయండి
4. **Policy Explorer** nightly scan wait చేయండి

---

## Phase 3: Manual dependency checks (CLI commands)

### 3.1 Account target చేసే AWS CloudFormation StackSets

**Risk:** Service-managed StackSets account organization leave చేసినప్పుడు resources DELETE చేస్తాయి (`RetainStacksOnAccountRemoval=true` కాకపోతే).

```bash
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>
```

### 3.2 IAM Identity Center assignments

**Risk:** Migrating account కోసం అన్ని permission set assignments leave చేసినప్పుడు remove అవుతాయి.

```bash
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>
```

### 3.3 AWS Resource Access Manager (AWS RAM) resource shares

**Risk:** Organization-scoped AWS RAM shares account leave చేసినప్పుడు revoke అవుతాయి.

```bash
aws ram get-resource-shares --resource-owner SELF --region <REGION>
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>
```

### 3.4 Organization Policies

**Risk:** Account transfer అయినప్పుడు అన్ని organization policies apply అవ్వడం ఆగిపోతుంది.

```bash
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY
```

---

## Phase 6: Transfer execute చేయడం (direct transfer)

Direct transfer feature (Nov 2025) ఉపయోగించి, standalone period అవసరం లేదు:

```bash
# Step 1: TARGET organization management account నుండి - invitation పంపండి
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# Step 2: MIGRATING account నుండి - invitation accept చేయండి
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## Phase 7: Post-transfer validation

```bash
# Account new organization లో ఉందో verify చేయండి
aws organizations describe-organization

# Account ను correct OU కు move చేయండి
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# SCPs applied అయ్యాయో verify చేయండి
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY
```
