---
title: Patch and Node Management
sidebar_label: Patch and Node Management
---

# Patch and Node Management

## Overview

AWS Systems Manager provides centralized operations management for EC2 instances, on-premises servers, edge devices, and VMs in hybrid environments. This solution covers the end-to-end lifecycle of fleet management: registering nodes with the SSM Agent, patching at scale using tag-based policies, managing remote sessions securely, automating operational tasks, and building centralised patch compliance reporting across an AWS Organization.

By combining Patch Manager, Session Manager, Run Command, and Automation runbooks with CloudWatch metrics and logs, you gain visibility into fleet health, patch compliance posture, and operational command outcomes—all from a single control plane.

![AWS Systems Manager overview](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager overview")

## Prerequisites

- AWS Systems Manager enabled in target accounts/Regions
- SSM Agent installed and running on all managed nodes (pre-installed on many AWS AMIs)
- IAM instance profiles or Default Host Management Configuration (DHMC) granting `AmazonSSMManagedInstanceCore` permissions
- Network connectivity from managed nodes to Systems Manager service endpoints (internet or VPC endpoints for `ssm`, `ssmmessages`, `ec2messages`)
- AWS Organizations configured (for multi-account patching)
- An S3 bucket for resource data sync (for centralised reporting)

## Architecture

The following diagram shows the end-to-end patch management and reporting architecture across an AWS Organization:

![End-to-end patch management reporting](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "End-to-end patch management reporting architecture")

1. Systems Manager resource data syncs are created in each account/Region.
2. Patch compliance and inventory metadata is aggregated into a central S3 bucket.
3. An AWS Glue crawler creates database tables from the JSON metadata.
4. Amazon Athena queries the data for compliance reporting.
5. Amazon QuickSight visualises patch compliance across the organisation.

### Tag-based patching flow

Managed nodes are tagged with a `maintenance:patching` key whose value encodes a schedule (e.g., `2SATX4` for every 4th Saturday at 2 AM). Patch policies in Quick Setup target nodes by this tag value, ensuring each node receives patches according to its assigned window.

![Tag-based patching strategy](/img/cloudops/solutions/centralized-operations-management/patch-nodes-using-tags/PatchTagging.drawio.png "Tag-based patching linking nodes to patch policies")

### Patch policy detailed architecture

![Patch Policy detailed architecture](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Patch Policy detailed architecture showing CloudFormation StackSets deploying State Manager associations")

## Deploy

### Step 1: Register nodes with SSM Agent

Ensure SSM Agent is installed on all nodes. Methods include:

- **Golden AMIs** with SSM Agent pre-installed
- **EC2 user data** scripts at launch:

```bash
#!/bin/bash
yum install -y amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
```

- **Default Host Management Configuration (DHMC)** for organisation-wide automatic IAM permissions
- **Quick Setup Host Management** to attach IAM policies to existing instances

### Step 2: Implement tagging strategy

Apply the `maintenance:patching` tag to all managed nodes:

```yaml
Key: maintenance:patching
Value: 2SATX4    # Runs at 2 AM every 4th Saturday
```

Common patterns:
- `0SUN` — every Sunday at midnight
- `4TUEX2` — every 2nd Tuesday at 4 AM
- `22MONX3` — every 3rd Monday at 10 PM

Enforce tagging compliance using AWS Config rules.

### Step 3: Configure patch policies

Create patch policies in Quick Setup for each approved schedule. Each policy:

1. Uses a custom or AWS-managed patch baseline
2. Targets nodes by `maintenance:patching` tag value
3. Deploys via CloudFormation StackSets across target OUs and Regions
4. Creates State Manager associations for scan and install operations

### Step 4: Configure centralised compliance reporting

Deploy the reporting infrastructure in a central account:

1. Create an S3 bucket with a KMS key for resource data sync storage
2. Deploy a Glue crawler to catalogue the metadata daily
3. Configure Athena workgroups with saved queries for compliance reporting
4. (Optional) Deploy QuickSight datasets and analysis dashboards

Sample Athena query for non-compliant nodes:

```sql
SELECT
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM
    aws_complianceitem ci
WHERE
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY
    ci.resourceid, ci.status, ci.patchstate
ORDER BY ci.resourceid
LIMIT 20;
```

### Step 5: Configure remote and session management

Session Manager provides secure node access without SSH keys or open inbound ports:

- Encrypted sessions (TLS 1.2 + optional KMS)
- IAM-based access control
- Session logging to CloudWatch Logs and/or S3
- Port forwarding for tunnelling to RDS, ElastiCache, etc.

### Step 6: Run PowerShell commands as a custom Windows user

For operations requiring custom credentials, retrieve secrets from AWS Secrets Manager:

```powershell
# Retrieve credentials from Secrets Manager
$SecretContent = Get-SECSecretValue -SecretId <SECRET_ARN> -ErrorAction Stop |
    Select-Object -ExpandProperty 'SecretString' | ConvertFrom-Json -ErrorAction Stop

# Create credentials object
$Username = $SecretContent.username
$UserPassword = ConvertTo-SecureString ($SecretContent.password) -AsPlainText -Force
$Credentials = New-Object -TypeName 'System.Management.Automation.PSCredential' ("$Env:ComputerName\$Username", $UserPassword)

# Run command with custom credentials
$Session = New-PSSession -ComputerName $Env:ComputerName -Credential $Credentials -ErrorAction Stop
Invoke-Command -Session $Session -ScriptBlock { Write-Host "Logged in as: $env:USERNAME" }
```

### Step 6: Automation runbooks

Create automation runbooks for repeatable operational tasks:

- Use the visual design experience or CloudFormation/CDK
- Leverage service roles with least-privilege IAM policies
- Run automations across multiple accounts and Regions with rate control and CloudWatch alarm integration

## Validate

1. **SSM Agent status**: In Fleet Manager or the unified console, verify all nodes show as "Managed"
2. **Patch compliance**: Run a patch scan and check the Patch Manager dashboard for compliant/non-compliant counts
3. **Resource data sync**: Confirm JSON files appear in the central S3 bucket after a scan
4. **Athena queries**: Execute the saved queries in the `patch-workgroup` and verify results return
5. **Session Manager**: Start a session to a managed node and verify commands execute and logs appear in CloudWatch

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Node not appearing as managed | Missing IAM permissions or SSM Agent not running | Verify instance profile includes `AmazonSSMManagedInstanceCore`; check `systemctl status amazon-ssm-agent` |
| Patch scan shows no compliance data | Resource data sync not configured or Glue crawler not run | Create resource data sync in the account/Region; manually run the Glue crawler |
| Session Manager connection fails | Network connectivity to SSM endpoints blocked | Ensure outbound 443 to `ssm.<region>.amazonaws.com` endpoints or configure VPC endpoints |
| Automation fails in target accounts | Missing `AWS-SystemsManager-AutomationExecutionRole` | Deploy the execution role via CloudFormation StackSets in all target accounts |
| Run Command returns exit code 1 | Script error or insufficient OS-level permissions | Review command output in Run Command history; check the managed node's OS logs |

## Related Solutions

- [Just-in-Time Node Access](../just-in-time-node-access/) — approval-based temporary node access with Cedar policies
- [AWS Config Compliance Monitoring](../aws-config-compliance/) — configuration compliance monitoring and drift detection
- [EC2 NGINX Monitoring](../ec2-nginx/) — CloudWatch Agent monitoring for EC2 workloads
