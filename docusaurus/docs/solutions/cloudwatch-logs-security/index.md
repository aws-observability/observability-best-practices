---
title: CloudWatch Logs Security Best Practices
sidebar_label: CloudWatch Logs Security
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# CloudWatch Logs Security Best Practices

## Overview

Amazon CloudWatch Logs centralizes logs from systems, applications, and AWS services into a scalable, queryable platform. Without proper security controls, log data can become a vulnerability rather than an asset. This guide covers implementing least-privilege access, encryption, deletion protection, data protection policies, and comprehensive auditing to keep your log groups secure and compliant.

Log data often contains sensitive information — user activities, system configurations, API calls, and potentially PII. Unauthorized access can expose critical security details, and accidental or malicious deletion of log groups can result in loss of audit trails and compliance violations.

## When to use this

- You are designing or reviewing IAM policies for CloudWatch Logs access
- You need to protect critical log groups from accidental or malicious deletion
- You must comply with regulatory frameworks requiring controls around log data (PCI-DSS, HIPAA, SOC 2, FedRAMP)
- You are implementing encryption for sensitive log groups
- You need to detect and mask PII or credentials flowing through logs
- You are centralizing logs across multiple AWS accounts with Organizations

## Guidance

### Log Group Design for Security Boundaries

CloudWatch Logs uses a two-level hierarchy (log groups → log streams) that directly impacts security controls. Design your structure to align with security requirements:

- **Application Separation**: Create distinct log groups for different applications to enable granular IAM policies and prevent cross-application log access
- **Environment Isolation**: Use separate log groups for production, staging, and development to enforce different access controls and retention policies
- **Data Classification**: Group logs by sensitivity level (public, internal, confidential, restricted) to apply appropriate encryption and access controls
- **Compliance Boundaries**: Create dedicated log groups for audit logs, security logs, and compliance-related data that require special handling

Log streams inherit security settings from their parent log group but can be individually targeted in IAM policies for granular access control (e.g., instance-level or service-specific access).

### Identity-Based Policies (IAM)

- **Apply least-privilege**: Create customer-managed policies restricting access to specific log group ARNs — never use wildcards
- **Separate administrative and operational permissions**: Distinct policies for read-only (analysts), write (applications), and administrative (infrastructure teams)
- **Explicitly deny deletion operations** on critical log groups as defense-in-depth
- **For Lambda functions**: IAM roles need only `logs:CreateLogGroup`, `logs:CreateLogStream`, and `logs:PutLogEvents`
- **Require MFA** for privileged accounts that can modify or delete log groups
- **Use tag-based access control**: Combine `aws:ResourceTag` condition keys with resource tags (environment, team, data classification) for dynamic access control

### Deletion Protection

Deletion protection prevents accidental or malicious deletion of log groups and their log streams. When enabled, all deletion operations are blocked until protection is explicitly disabled.

**When to enable:**
- Audit logs (maintain compliance and prevent tampering)
- Security logs (CloudTrail, VPC Flow Logs, application security logs)
- Compliance logs required by regulatory frameworks
- Production application logs needed for incident response
- Any logs with retention requirements exceeding 1 year

**Best practices:**
- Enable during log group creation via IaC (CloudFormation, CDK, Terraform) for consistent posture
- Document procedures for disabling protection (approval workflows, justification, re-enablement)
- Monitor changes with CloudWatch alarms — alert security teams when protection is disabled
- Layer protections: deletion protection + IAM explicit Deny on `logs:DeleteLogGroup` and `logs:PutLogGroupDeletionProtection` + Organization SCPs + AWS Config monitoring

### Encryption with Customer-Managed KMS Keys

- CloudWatch Logs encrypts data at rest by default (AES-GCM). For enhanced control, associate customer-managed KMS keys
- KMS key policy must grant `logs.amazonaws.com` permissions with conditions restricting usage to specific log groups and accounts
- Enable automatic key rotation (AWS rotates annually while maintaining access to data encrypted with previous versions)
- Monitor KMS key usage via CloudTrail — alarm on unusual decrypt patterns or unauthorized access attempts

### Data Protection Policies

CloudWatch Logs data protection automatically detects and masks sensitive information using ML and pattern matching as log events are ingested:

- **Credentials**: AWS Secret Keys, SSH/PGP/PKCS Private Keys
- **Financial**: Credit card numbers, bank account numbers
- **Personal**: Email addresses, names, IP addresses
- **Regional**: Country-specific identifiers (driver's licenses, tax IDs)

Configure audit operations (monitor and report) or de-identify operations (mask in real-time) based on requirements.

### Log Retention and Lifecycle

- Set retention periods based on data classification:
  - Critical/Audit: 7+ years
  - Security: 1–3 years
  - Application: 30–90 days
  - Debug/Development: 1–7 days
- Use consistent tagging for automated lifecycle policy application
- Review and adjust retention periodically to balance compliance with storage costs

### Resource-Based Policies and Centralization

- **Destinations**: Use resource-based policies on CloudWatch Logs destinations for cross-account subscription filters (Kinesis, Firehose, Lambda)
- Specify exact source account IDs — never wildcards
- **Organizations centralization**: Designate the Log Archive account as CloudWatch delegated administrator. Replicate logs from member accounts using centralization rules with consistent encryption, access policies, and retention
- Configure multiple centralization rules for data residency (regional boundaries, compliance segregation, multi-region backup)

### VPC Endpoints

- Use interface VPC endpoints (`com.amazonaws.region.logs` and `com.amazonaws.region.stream-logs`) for private connectivity
- Implement VPC endpoint policies restricting actions through the endpoint
- Use `aws:SourceVpc` and `aws:SourceVpce` condition keys to ensure access only through specific endpoints
- FIPS endpoints available for compliance (`logs-fips`, `stream-logs-fips`)

### Monitoring and Auditing

- Enable CloudTrail in all regions for CloudWatch Logs API calls
- Track ingestion metrics: `IncomingLogEvents`, `IncomingBytes`, `DeliveryErrors` — establish baselines and alarm on deviations
- Use Contributor Insights for top-talker analysis, error pattern detection, and time-based anomaly detection
- Create metric filters and alarms for unauthorized deletions, protection changes, permission changes, encryption key disassociation
- Integrate with AWS Security Hub for aggregated security findings

## Related

- [CloudWatch Logs security documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/security.html)
- [Protecting log groups from deletion](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)
- [Encrypt log data with KMS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)
- [Data protection policies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)
- [WAF Security Analysis with CloudWatch](/solutions/waf-security-analysis/)
- [S3 Access Logs for Security & Compliance](/solutions/s3-access-logs-security/)

## Related Events

<RelatedEvents topics={["security"]} />
