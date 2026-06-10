---
sidebar_position: 1
---

# AWS Organizations கணக்கு migration தயார்நிலை வழிகாட்டி

> **பொறுப்புத்துறப்பு:** இந்த வழிகாட்டி AWS கணக்குகளை organizations களுக்கு இடையில் மாற்றும் போது பொதுவாக எதிர்கொள்ளும் dependencies மற்றும் பரிசீலனைகளின் அடிப்படையில் சிறந்த-முயற்சி வழிகாட்டுதலை வழங்குகிறது. எந்த migration ன் வெற்றிகரமான நிறைவும் ஒவ்வொரு வாடிக்கையாளரின் தனிப்பட்ட சூழ்நிலை, workloads மற்றும் dependencies ஐப் பொறுத்தது. வாடிக்கையாளர்கள் தங்கள் குறிப்பிட்ட சூழலை முழுமையாக மதிப்பீடு செய்வதற்கும், அனைத்து dependencies களை சரிபார்ப்பதற்கும், செயல்படுத்துவதற்கு முன் migration திட்டத்தை சோதிப்பதற்கும் பொறுப்பானவர்கள். இந்த வழிகாட்டி ஒவ்வொரு சாத்தியமான dependency அல்லது edge case ஐயும் உள்ளடக்காது.

## நோக்கம்

இந்த வழிகாட்டி **AWS Organizations களுக்கு இடையில் கணக்கு migration** ஐ உள்ளடக்குகிறது. இங்கு விவரிக்கப்பட்ட அணுகுமுறை மதிப்பாய்வு மற்றும் மதிப்பீட்டு செயல்முறையை விரைவுபடுத்த [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) மற்றும் [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) ஐப் பயன்படுத்துகிறது. நீங்கள் பயன்படுத்த முடிவு செய்யும் கருவிகள் அல்லது அணுகுமுறையைப் பொறுத்து படிகள் மாறலாம், ஆனால் இது ஒரு சரிபார்க்கப்பட்ட வழியை வழங்குகிறது.

:::tip
When moving accounts into an AWS Control Tower environment, use this guide as a pre-migration dependency check, then follow the [Enroll an existing AWS account](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) guide as a complement after the account has been transferred to the target organization.
:::

## Key services and dependencies at a glance

The following table summarizes the key AWS services and features that may be impacted when an account is transferred between organizations:

| Category | Service/feature | Impact on transfer |
|----------|----------------|-------------------|
| **Access control** | IAM Identity Center | Permission set assignments removed; users lose access |
| **Authorization** | Service control policies (SCPs) | Stop applying immediately |
| **Authorization** | Resource control policies (RCPs) | Stop applying immediately |
| **Declarative** | Declarative policies (EC2) | Stop applying immediately |
| **Management** | Tag, Backup, AI opt-out policies | Detached from account |
| **Infrastructure** | AWS CloudFormation StackSets | Resources may be deleted (depends on retention setting) |
| **Resource sharing** | AWS Resource Access Manager | Organization-scoped shares revoked (unless retention enabled) |
| **Delegation** | Delegated administrator services | Must deregister before transfer; some services delete data |
| **Policy conditions** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | Policies referencing source organization ID will deny access |
| **Billing** | Reserved Instances / Savings Plans | Organization-wide sharing benefits lost |
| **Billing** | Cost allocation tags | Must re-activate in target organization |
| **Observability** | Amazon EventBridge cross-account | Event bus policies referencing organization ID will break |
| **Account access** | Root user / `OrganizationAccountAccessRole` | May lose all access if not verified before transfer |

## Overview

This guide provides a step-by-step process for assessing migration readiness before transferring an AWS account between AWS Organizations. It combines automated tooling ([Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)) with validated CLI commands to cover all dependencies.

**Applicable for:** Mergers & acquisitions, organization consolidation, account restructuring.

**Key features leveraged:**
- [Direct Account Transfers](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/) (Nov 2025) — no standalone period required
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/) (Feb 2026) — preserve resource shares during transfer

**References:**
- [Migrate an account to another organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — AWS documentation
- [Moving an account - Part 1: Policies, AWS RAM, condition keys](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — AWS blog
- [Moving an account - Part 2: Delegated administrators](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — AWS blog

---

## Phase 1: Deploy assessment tools

### 1.1 Deploy Account Assessment for AWS Organizations

Deploy in the management account. Provides: Policy Explorer, Delegated Admin scan, Trusted Access scan.

:::note
For simplicity, this guide shows deploying the Hub stack in the management account. For production environments, AWS recommends deploying the Hub stack in a **separate member account** (e.g., a shared services or security tooling account) to follow the principle of least privilege in the management account. The Org-Management stack is always deployed in the management account regardless.
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

**Org-Management Stack (management account):**
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

**Spoke Stack (each account to assess, via StackSet):**
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

> **Important:** Also deploy the Spoke stack directly in the management account (StackSets with SERVICE_MANAGED exclude it):
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

### 1.2 Run CFAT (Cloud Foundation Assessment Tool)

Run from CloudShell in the management account:
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

Download results: `./cfat/assessment.zip`

---

## Phase 2: Automated assessment (Account Assessment tool)

### 2.1 Run Scans from Web UI

1. Log in to the Account Assessment web UI (check email for Cognito credentials)
2. Run **Delegated Admin** scan → Download CSV
3. Run **Trusted Access** scan → Download CSV
4. Wait for **Policy Explorer** nightly scan (or trigger manually):

```bash
# Trigger Policy Explorer scan manually
aws lambda invoke \
  --function-name <NAMESPACE>-PolicyExplorerStartScan-<ID> \
  --payload '{"source": "manual-trigger"}' \
  --region <REGION> \
  /dev/null
```

### 2.2 Search Policy Explorer for organization dependencies

In the web UI Policy Explorer:
1. Click **"Add OrgId"** button to search for your Organization ID in policy conditions
2. Search for `aws:PrincipalOrgID`, `aws:PrincipalOrgPaths`, `aws:ResourceOrgID`
3. Download results as CSV

**What this finds:**
- Resource-based policies with organization conditions (S3, KMS, SQS, SNS, Lambda, etc.)
- Identity-based policies referencing the organization
- SCPs with organization-specific conditions

---

## Phase 3: Manual dependency checks (CLI commands)

The following checks cover gaps not addressed by the automated tools.

### 3.1 AWS CloudFormation StackSets targeting the account

**Risk:** Service-managed StackSets will DELETE resources from the account when it leaves the organization (unless `RetainStacksOnAccountRemoval=true`).

:::info
Run these commands from the **management account** or a delegated administrator account for CloudFormation StackSets. Service-managed StackSets can only be managed from these accounts.
:::

```bash
# List all active StackSets
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

# For each StackSet, check if the migrating account has instances
aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>

# Check the retention setting
aws cloudformation describe-stack-set \
  --stack-set-name <STACKSET_NAME> \
  --region <REGION> \
  --query "StackSet.AutoDeployment.RetainStacksOnAccountRemoval"
```

**Action:** For each StackSet with `RetainStacksOnAccountRemoval=false` that deploys critical resources, either:
- Update to `RetainStacksOnAccountRemoval=true` before migration
- Or document that those resources will be deleted and plan to recreate in target organization

### 3.2 IAM Identity Center assignments

**Risk:** All permission set assignments for the migrating account are removed when it leaves. Users lose IAM Identity Center access to that account.

:::info
Run these commands from the **management account** or the Identity Center delegated administrator account.
:::

```bash
# Get Identity Center instance ARN
aws sso-admin list-instances --region <REGION>

# List all permission sets provisioned to the account
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>

# For each permission set, list who has access
aws sso-admin list-account-assignments \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --region <REGION>
```

**Action:** Document all assignments. In the target organization's Identity Center, recreate equivalent permission sets and assignments after migration.

### 3.3 AWS Resource Access Manager (AWS RAM) resource shares

**Risk:** Organization-scoped AWS RAM shares are revoked when account leaves. New feature (Feb 2026) allows retention.

```bash
# Check shares OWNED by the migrating account (run from that account)
aws ram get-resource-shares --resource-owner SELF --region <REGION>

# Check shares consumed by the migrating account
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>

# List actual resources in shares
aws ram list-resources --resource-owner OTHER-ACCOUNTS --region <REGION>
aws ram list-resources --resource-owner SELF --region <REGION>
```

**Mitigation (Feb 2026 feature):** Enable retention on AWS RAM shares before transfer:
```bash
# Run from the share OWNER account
aws ram update-resource-share \
  --resource-share-arn <SHARE_ARN> \
  --retain-sharing-on-account-leave-organization \
  --region <REGION>
```

**Enforce organization-wide via SCP:**
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

### 3.4 Organization Policies (Authorization, Declarative, and Management Policies)

**Risk:** ALL organization policies stop applying when the account transfers. This includes authorization policies (SCPs, RCPs), declarative policies (EC2), and management policies.

:::info
Run these commands from the **management account** or a delegated administrator account for AWS Organizations.
:::

> **Important:** Policy Explorer in Account Assessment only scans **SCP content**. It does NOT cover RCPs, declarative policies, or management policies. These must be checked manually.
>
> **Tip:** CFAT provides a useful initial snapshot — it confirms whether SCPs, RCPs, Tag Policies, and Backup Policies are enabled at the organization level. Use this as a starting point to know which policy types require deeper investigation with the CLI commands below.

```bash
# First: discover all policy types enabled in the organization
aws organizations list-roots --query "Roots[0].PolicyTypes"

# --- AUTHORIZATION POLICIES ---

# SCPs applied to the account (also covered by Policy Explorer for content)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# RCPs applied to the account (NOT covered by Policy Explorer)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY

# --- DECLARATIVE POLICIES ---

# Declarative Policies (EC2 - e.g., Allowed AMIs, block public snapshots)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter DECLARATIVE_POLICY_EC2

# --- MANAGEMENT POLICIES ---

# Check each management policy type that's enabled:
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

# Get the account's parent OU (policies may be inherited)
aws organizations list-parents --child-id <ACCOUNT_ID>

# List policies at the OU level (repeat for each policy type)
aws organizations list-policies-for-target \
  --target-id <OU_ID> \
  --filter <POLICY_TYPE>

# Get policy content to replicate in target organization
aws organizations describe-policy --policy-id <POLICY_ID>

# Get effective management policies
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

**Key distinction:**
- **Authorization Policies (SCPs, RCPs)** — SCPs restrict what API actions principals can perform. RCPs restrict what actions can be performed ON resources (e.g., block unencrypted access to Secrets Manager). Policy Explorer scans SCPs only, not RCPs.
- **Declarative Policies (EC2)** — Enforce desired-state configurations for EC2 (e.g., only allowed AMIs, block public snapshots). NOT scanned by either tool.
- **Management Policies** — Tag, Backup, AI opt-out, Bedrock, ChatBot, Inspector, SecurityHub, S3, Network Security Director, Upgrade Rollout. Detached on transfer. NOT scanned by either tool.

**Action:** For each policy type enabled in your organization:
1. List policies applied to the account (direct + inherited from OU/root)
2. Get policy content with `describe-policy`
3. Replicate in target organization BEFORE transfer
4. For declarative policies: verify the account's resources comply with target organization policies too

### 3.5 Delegated administrator services

**Risk:** Must deregister before migration. Some services DELETE data on deregistration (Detective, Firewall Manager).

:::info
Run these commands from the **management account**.
:::

```bash
# List all delegated admin accounts
aws organizations list-delegated-administrators

# List services for the migrating account
aws organizations list-delegated-services-for-account \
  --account-id <ACCOUNT_ID>
```

**Action:** For each delegated service:
1. Register a replacement delegated admin (if organization continues)
2. Deregister the migrating account
3. See Part 2 blog for service-specific deregistration commands and data loss implications

### 3.6 Amazon EventBridge cross-account event bus

**Risk:** Cross-account event delivery permissions referencing the organizationanization will break.

```bash
# Check event bus policy for organization-based permissions
aws events describe-event-bus --region <REGION>

# Check in all regions where EventBridge is used
aws events describe-event-bus --name default --region <REGION>
```

**Action:** Update event bus resource policies to use account IDs instead of organization IDs, or add the target organization ID.

### 3.7 Billing and cost management

**Risk:** Org-level billing history stays with management account. Cost allocation tags must be re-activated.

```bash
# List active cost allocation tags (to recreate in target organization)
aws ce list-cost-allocation-tags --status Active

# Check CUR report configuration
aws cur describe-report-definitions --region us-east-1

# Check organization details (feature set, for target organization compatibility)
aws organizations describe-organization

# List Savings Plans owned by the migrating account (run from that account)
aws savingsplans list-savings-plans --states active

# List Reserved Instances owned by the migrating account (run from that account)
aws ec2 describe-reserved-instances --filters Name=state,Values=active --region <REGION>

# Check Reserved Instance/Savings Plan sharing preferences (run from management account)
# Note: Use the Billing Console → Preferences → RI and Savings Plans discount sharing
# to see sharing mode (Organization-wide, Prioritized Group, or Restricted Group)
```

**Action:**
- Export all billing reports before transfer
- Document active cost allocation tags
- Re-activate cost allocation tags in target organization (takes up to 24 hours)
- **Reserved Instances and Savings Plans:**
  - Reserved Instances/Savings Plans **purchased by the migrating account** travel with it — but they will NO LONGER apply to the source organization's consolidated bill
  - Reserved Instances/Savings Plans **purchased by OTHER accounts** in the source organization that were shared with the migrating account will NO LONGER benefit the migrating account after transfer
  - Reserved Instances/Savings Plans apply only to the organization where they're purchased — they cannot span multiple organizations
  - If the migrating account was benefiting from organization-wide Reserved Instance/Savings Plan sharing, it loses that discount immediately
  - If the migrating account owns Reserved Instances/Savings Plans that were shared organization-wide, the source organization loses that discount capacity
  - **Check sharing mode:** Organization-wide, Prioritized Group, or Restricted Group sharing affects impact scope
  - Contact AWS Support if Reserved Instances/Savings Plans need to be transferred to a different account before migration

---

## Phase 4: CFAT foundation readiness (target organization)

Use CFAT results to verify the **target organizationanization** is ready to receive the account:

| CFAT Check | Why It Matters for Migration |
|------------|------------------------------|
| Control Tower deployed | Provides guardrails for the incoming account |
| Security OU exists | Account needs a governed landing zone |
| Log Archive account exists | Centralized logging for the migrated account |
| IAM Identity Center configured | Users need IAM Identity Center access to the new account |
| SCPs enabled | Governance policies must be ready |
| Config Recorder enabled | Compliance monitoring for the new account |

---

## Phase 5: Pre-transfer checklist

| # | Check | Tool | CLI Command | Status |
|---|-------|------|-------------|--------|
| 1 | Org ID in resource-based policies | Account Assessment (Policy Explorer) | Web UI → Add OrgId | ☐ |
| 2 | Org ID in identity-based policies | Account Assessment (Policy Explorer) | Web UI search | ☐ |
| 3 | Delegated admin services | Account Assessment (Delegated Admin scan) | `list-delegated-services-for-account` | ☐ |
| 4 | Trusted access services | Account Assessment (Trusted Access scan) | `list-aws-service-access-for-organization` | ☐ |
| 5 | StackSets targeting account | Manual | `list-stack-instances --stack-instance-account` | ☐ |
| 6 | StackSet retention settings | Manual | `describe-stack-set` → AutoDeployment | ☐ |
| 7 | Identity Center assignments | Manual | `list-permission-sets-provisioned-to-account` | ☐ |
| 8 | AWS RAM shares (owned) | Manual | `get-resource-shares --resource-owner SELF` | ☐ |
| 9 | AWS RAM shares (consumed) | Manual | `get-resource-shares --resource-owner OTHER-ACCOUNTS` | ☐ |
| 10 | AWS RAM RetainSharing enabled | Manual | `update-resource-share --retain-sharing...` | ☐ |
| 11 | SCPs applied to account (authorization) | Account Assessment (Policy Explorer) + Manual | `list-policies-for-target` | ☐ |
| 12 | RCPs applied to account (authorization) | Manual (NOT in Policy Explorer) | `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` | ☐ |
| 13 | Declarative Policies (EC2) applied to account | Manual (NOT in either tool) | `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` | ☐ |
| 14 | Management policies (Tag/Backup/AI/Bedrock/ChatBot/Inspector/SecurityHub/S3/etc.) | Manual | `describe-effective-policy` + `list-policies-for-target` | ☐ |
| 15 | EventBridge cross-account | Manual | `describe-event-bus` | ☐ |
| 16 | Cost allocation tags documented | Manual | `list-cost-allocation-tags --status Active` | ☐ |
| 17 | CUR reports exported | Manual | `describe-report-definitions` | ☐ |
| 18 | Reserved Instance/Savings Plan ownership and sharing impact assessed | Manual | `list-savings-plans` + `describe-reserved-instances` | ☐ |
| 19 | Target organization age ≥ 7 days | Manual | `describe-organization` | ☐ |
| 20 | Target organization account quota | Manual | Check Service Quotas | ☐ |
| 21 | Target organization SCPs/RCPs/Declarative policies ready | Manual | Replicate from source | ☐ |
| 22 | Target organization Identity Center ready | CFAT | Run CFAT on target | ☐ |
| 23 | OrganizationAccountAccessRole removed | Manual | Delete IAM role in migrating account | ☐ |

---

## Phase 5.5: Break-glass — Verify Account Recovery Options

**Scenario:** If an account is transferred without verifying Identity Center access or other access controls, you may lose ALL access to the account. Before transfer, ensure you can recover access independently.

**Why this matters:** Once the account leaves the source organization:
- Identity Center permission sets are removed → IAM Identity Center access lost
- `OrganizationAccountAccessRole` trust may break → cross-account access lost
- If no root user credentials exist (common for organization-created accounts) → account is locked

### Pre-transfer: Verify recovery options

```bash
# Verify the account has a valid root user email (can you receive email there?)
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# Verify phone number is set (needed for root user MFA recovery)
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1

# Check alternate contacts are configured
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type SECURITY --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type BILLING --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type OPERATIONS --region us-east-1
```

### Pre-transfer: Update recovery info if needed

```bash
# Update root user email (from management account, requires Account Management trusted access)
aws account start-primary-email-update --account-id <ACCOUNT_ID> --primary-email <NEW_EMAIL> --region us-east-1
aws account accept-primary-email-update --account-id <ACCOUNT_ID> --otp <CODE> --primary-email <NEW_EMAIL> --region us-east-1

# Update account name (Apr 2025 feature — no longer requires root access)
aws account put-account-name --account-id <ACCOUNT_ID> --account-name <NEW_NAME> --region us-east-1

# Update phone number / contact info
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

### Break-glass recovery options (if access is lost post-transfer)

> ⚠️ **Preflight checks are critical.** Reaching out to AWS Support should be the LAST resort — it requires multiple identity verification steps, can take days, and does NOT guarantee recovering access. Ensure all recovery options are verified BEFORE transfer.

| Priority | Method | When to Use | How |
|----------|--------|-------------|-----|
| 1st | **Root user password reset** | You have access to the root email | Go to AWS sign-in → "Forgot password" → reset via email |
| 2nd | **Root user MFA reset** | Lost MFA device, have phone number | Use phone verification flow at sign-in |
| 3rd | **Management account (target organization)** | Account is now in target organization | Use `OrganizationAccountAccessRole` if it exists, or Account Management APIs |
| **Last resort** | **AWS Support** | No email/phone access, all other options exhausted | Open support case from another account. Requires multiple verification steps (account ID, contact info, billing details). **Not guaranteed to succeed and may take extended time.** |

### Pre-transfer checklist for recovery

| # | Check | Status |
|---|-------|--------|
| 1 | Root user email is accessible (can receive email) | ☐ |
| 2 | Root user password is known OR can be reset via email | ☐ |
| 3 | Phone number on account is current and accessible | ☐ |
| 4 | MFA device for root user is documented/accessible | ☐ |
| 5 | At least one IAM user/role with admin access exists in the account (independent of the organization) | ☐ |
| 6 | Alternate contacts (Security, Billing, Operations) are set | ☐ |

> **Critical:** For accounts created via `CreateAccount` in Organizations, root user credentials may never have been set. You MUST perform a root user password reset (via the root email) BEFORE transferring the account to ensure you can access it independently.

---

## Phase 6: Execute transfer (direct transfer)

Using the direct transfer feature (Nov 2025), no standalone period is required:

```bash
# Step 1: From TARGET organization management account - send invitation
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# Step 2: From the MIGRATING account - accept invitation
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## Phase 7: Post-transfer validation

```bash
# Verify account is in new organization
aws organizations describe-organization

# Move account to correct OU
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# Verify SCPs are applied
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# Accept any AWS RAM share invitations
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <INVITATION_ARN> \
  --region <REGION>

# Re-activate cost allocation tags in target organization
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status '[{"TagKey": "<KEY>", "Status": "Active"}]'

# Set up Identity Center assignments in target organization
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

## Appendix: Tool coverage matrix

| Dependency Category | Account Assessment | CFAT | Manual CLI |
|--------------------|-------------------|------|------------|
| Resource-based policies (organization conditions) | ✅ Policy Explorer | ❌ | — |
| Identity-based policies (organization conditions) | ✅ Policy Explorer | ❌ | — |
| SCP content and conditions (authorization) | ✅ Policy Explorer | ❌ | `describe-policy` |
| **RCPs (authorization)** | ❌ | ✅ Checks if enabled only | ✅ `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` |
| **Declarative Policies (EC2)** | ❌ | ❌ | ✅ `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` |
| **Management Policies (Bedrock, ChatBot, Inspector, SecurityHub, S3, etc.)** | ❌ | ❌ | ✅ `list-policies-for-target --filter <TYPE>` |
| Tag/Backup/AI opt-out (management) | ❌ | ✅ Checks if enabled only | ✅ `describe-effective-policy` |
| Delegated administrators | ✅ Scan | ❌ | `list-delegated-services-for-account` |
| Trusted access services | ✅ Scan | ✅ Lists services | `list-aws-service-access-for-organization` |
| StackSets (resources at risk) | ❌ | ❌ | ✅ `list-stack-instances` + `describe-stack-set` |
| Identity Center assignments | ❌ | ✅ Checks if configured | ✅ `list-account-assignments` |
| AWS RAM resource shares | ❌ | ❌ | ✅ `get-resource-shares` |
| Reserved Instance/Savings Plan ownership and sharing impact | ❌ | ❌ | ✅ `list-savings-plans` + `describe-reserved-instances` |
| EventBridge cross-account | ❌ | ❌ | ✅ `describe-event-bus` |
| Cost allocation tags | ❌ | ❌ | ✅ `list-cost-allocation-tags` |
| Control Tower status | ❌ | ✅ | — |
| Foundation best practices | ❌ | ✅ Full assessment | — |
| Org quotas | ❌ | ❌ | ✅ Service Quotas console |

---

## Appendix: Key dates and feature availability

| Feature | Date | Impact on Migration |
|---------|------|---------------------|
| Direct Account Transfers | Nov 2025 | No standalone period, no payment/contact reconfiguration |
| AWS RAM RetainSharingOnAccountLeaveOrganization | Feb 2026 | Resource shares persist through transfer |
| Account Assessment Policy Explorer | v1.1.0+ | Nightly scan for organization-dependent policies |

---

*Generated using Account Assessment for AWS Organizations and CFAT. All CLI commands validated against live AWS APIs.*
