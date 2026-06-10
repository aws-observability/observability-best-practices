---
sidebar_position: 1
---

# Athena ఉపయోగించి Amazon CloudWatch Logs తో చారిత్రక Security Lake డేటాను Query చేయడం

## అవలోకనం

మీరు మీ security log management ను [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) కు migrate చేసినప్పుడు, ఇకపై operational మరియు security telemetry కోసం modern, unified destination పొందుతారు. కానీ మీ historical security data — migration ముందు [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) లో accumulate చేసిన AWS CloudTrail events, Amazon Virtual Private Cloud (Amazon VPC) Flow Logs, AWS Security Hub findings, మరియు ఇతర records — అదృశ్యం కాదు. అది Security Lake యొక్క Amazon S3 backed structure లో ఇప్పటికే stored మరియు partitioned గా ఉంది.

ఈ గైడ్ మీ historical Security Lake data మరియు మీ new CloudWatch unified data store logs రెండింటికీ single query console గా **Amazon Athena** ను ఎలా ఉపయోగించాలో చూపిస్తుంది — ఏ data ను export, copy, లేదా duplicate చేయకుండా. మీరు ప్రతి data store ను independently query చేయవచ్చు, లేదా cross-platform visibility కోసం `UNION ALL` ఉపయోగించి రెండింటి results combine చేయవచ్చు.

> **New** log events మీ primary platform గా CloudWatch unified data store లోకి flow అవుతాయి.
> **Historical** events Security Lake లో ఉంటాయి.
> **Athena** single console నుండి రెండింటినీ query చేస్తుంది.

![Migration Phases](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake to Amazon CloudWatch")

| Phase | ఏమి జరుగుతుంది |
|---|---|
| **Phase 1 — Security Lake** | VPC Flow Logs మరియు ఇతర security data sources exclusively Security Lake కు write చేస్తాయి, Amazon S3 లో stored మరియు AWS Glue Data Catalog ద్వారా queryable అయిన OCSF-formatted records యొక్క historical archive build చేస్తాయి. |
| **Phase 2 — Security Lake మరియు CloudWatch Dual Ingestion** | Security Lake మరియు CloudWatch రెండూ simultaneously data receive చేస్తాయి. ఈ validation period minimum 24 hours recommend చేయబడుతుంది. |
| **Phase 3 — CloudWatch Only** | Data sources exclusively CloudWatch కు write చేస్తాయి. అన్ని historical Security Lake data preserved మరియు accessible గా ఉంటుంది — మరియు Athena single console నుండి రెండు data stores ను query చేయడానికి అనుమతిస్తుంది. |

Security Lake మరియు Amazon CloudWatch unified data store రెండూ తమ data ను [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/) కు normalize చేస్తాయి, అంటే `src_endpoint.ip`, `api.operation`, మరియు `actor.user.name` వంటి field names రెండు sources అంతటా consistent గా ఉంటాయి.

---

## Export చేయడానికి బదులుగా In-Place Query ఎందుకు?

Athena cross-catalog queries data export చేయాల్సిన అవసరం లేకుండా historical Security Lake data directly access చేయడానికి అనుమతిస్తాయి.

| ప్రయోజనం | వివరాలు |
|---|---|
| **Duplicate storage charges లేవు** | మీ historical data ఇప్పటికే Security Lake యొక్క Amazon S3 backed store లో ఉంది. In-place query చేయడం అంటే మీకు ఇప్పటికే ఉన్న దాని కోసం మాత్రమే pay చేస్తారు. |
| **Build లేదా maintain చేయడానికి ETL pipelines లేవు** | Data export చేయడానికి pipeline అవసరం. Athena cross-catalog queries separate pipeline అవసరాన్ని తొలగిస్తాయి. |
| **Historical data organized గా ఉంటుంది** | Security Lake data ను account, Region, మరియు date ద్వారా store మరియు partition చేస్తుంది. |
| **New data naturally flows** | Migrate చేసిన తర్వాత, CloudWatch new log events కోసం మీ primary destination అవుతుంది. |
| **Athena efficiently bridges** | Security Lake default AWS Glue Data Catalog (`AwsDataCatalog`) లో tables register చేస్తుంది. CloudWatch Amazon S3 Tables catalog (`s3tablescatalog/aws-cloudwatch`) ఉపయోగిస్తుంది. Athena single SQL query లో fully qualified catalog paths ఉపయోగించి రెండింటినీ reference చేయగలదు. |

:::tip Result
మీరు event investigation, threat hunting, మరియు compliance audits కోసం మీ historical Security Lake data కు full access retain చేస్తారు — ongoing monitoring కోసం మీ new CloudWatch unified data store data primary source గా flow అవుతూ.
:::

---

## ఇది ఎలా పనిచేస్తుంది

### ఆర్కిటెక్చర్

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch unified data store** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena single SQL statement లో multiple Glue catalogs అంతటా querying support చేస్తుంది.

![Architecture Diagram](/img/Athena-Arch-ASL-CW.png "Architecture Diagram")

## ముందస్తు అవసరాలు

Cross-catalog queries run చేయడానికి ముందు, Athena console ఉపయోగించి మీ catalog paths, databases, మరియు table names confirm చేయండి.

### Security Lake Tables

| Catalog | Database | Example Tables |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

### CloudWatch Unified Data Store Tables

| Catalog | Database | Example Tables |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info Region-Specific Naming
Security Lake database మరియు table names మీ deployment Region include చేస్తాయి. ఈ guide లోని examples `us_east_1` ఉపయోగిస్తాయి. Security Lake different Region లో enable చేయబడి ఉంటే, `us_east_1` ను మీ Region identifier తో replace చేయండి.
:::

:::tip మీ Table Names Discover చేయడం
మీ table names మీ Region, Security Lake configuration, మరియు ఏ CloudWatch unified data store data sources enable చేశారో బట్టి vary అవ్వవచ్చు. మీ table names verify చేయడానికి run చేయండి:

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Athena నుండి రెండు Data Stores ను Query చేయడం

CloudWatch unified data store కు migrate చేసిన తర్వాత, Athena historical మరియు current security data రెండింటికీ మీ single query console అవుతుంది.

### Syntax Overview

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## Part 1 — Security Lake Query చేయడం (Historical Data)

### Example 1a — Historical CloudTrail Management Events

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

</details>

### Example 1b — Historical VPC Flow Logs

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    activity_name                AS activity,
    time_dt,
    status_code,
    connection_info.direction    AS direction
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_vpc_flow_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND activity_name = 'Reject'
LIMIT 25;
```

</details>

### Example 1c — Historical Security Hub Findings

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_sh_findings_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND severity_id >= 3
LIMIT 25;
```

</details>

---

## Part 2 — CloudWatch Unified Data Store Query చేయడం (Recent Data)

### Example 2a — Recent CloudTrail Management Events

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

</details>

### Example 2b — Recent VPC Flow Logs

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    activity_name                AS activity,
    time_dt,
    status_code,
    connection_info.direction    AS direction
FROM "s3tablescatalog/aws-cloudwatch"."logs"."amazon_vpc__flow"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND activity_name = 'Reject'
LIMIT 25;
```

</details>

### Example 2c — Recent Security Hub Findings

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_security_hub__compliance_finding"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND severity_id >= 3
LIMIT 25;
```

</details>

---

## Part 3 — UNION ALL తో రెండు Data Stores Combine చేయడం

### Example 3a — రెండు Time Periods అంతటా AssumeRole Activity

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    'Security Lake'      AS source,
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'

UNION ALL

SELECT
    'CloudWatch UDS'     AS source,
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'

LIMIT 50;
```

</details>

:::caution UNION ALL ఎందుకు JOIN కాకుండా?
AWS Glue Data Catalog (Security Lake) మరియు S3 Tables catalog (CloudWatch unified data store) మధ్య Cross-catalog JOINs Athena లో technically possible, కానీ significant performance మరియు cost limitations ఉన్నాయి. `UNION ALL` ఉపయోగించడం proper partition pruning తో ప్రతి query ను దాని own catalog against independently run చేయడం ద్వారా దీన్ని avoid చేస్తుంది.
:::

### Example 3b — రెండు Time Periods అంతటా Rejected VPC Flows

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    'Security Lake'              AS source,
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    time_dt,
    connection_info.direction    AS direction
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_vpc_flow_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND activity_name = 'Reject'

UNION ALL

SELECT
    'CloudWatch UDS'             AS source,
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    time_dt,
    connection_info.direction    AS direction
FROM "s3tablescatalog/aws-cloudwatch"."logs"."amazon_vpc__flow"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND activity_name = 'Reject'

LIMIT 50;
```

</details>

### Example 3c — రెండు Time Periods అంతటా High-Severity Security Hub Findings

<details>
<summary>SQL Query చూడండి</summary>

```sql
SELECT
    'Security Lake'          AS source,
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_sh_findings_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND severity_id >= 4

UNION ALL

SELECT
    'CloudWatch UDS'         AS source,
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_security_hub__compliance_finding"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND severity_id >= 4

LIMIT 50;
```

</details>
