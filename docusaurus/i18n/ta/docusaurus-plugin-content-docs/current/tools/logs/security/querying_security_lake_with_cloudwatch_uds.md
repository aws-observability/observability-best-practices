---
sidebar_position: 1
---

# Athena ஐ பயன்படுத்தி Amazon CloudWatch Logs உடன் வரலாற்று Security Lake தரவை வினவுதல்

## மேலோட்டம்

நீங்கள் உங்கள் பாதுகாப்பு லாக் மேலாண்மையை [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) க்கு இடம்பெயர்க்கும்போது, முன்னோக்கிச் செல்ல செயல்பாட்டு மற்றும் பாதுகாப்பு டெலிமெட்ரிக்கான நவீன, ஒருங்கிணைந்த இலக்கை பெறுவீர்கள். ஆனால் உங்கள் வரலாற்று பாதுகாப்பு தரவு - இடம்பெயர்வுக்கு முன்பு [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) இல் நீங்கள் குவித்த AWS CloudTrail நிகழ்வுகள், Amazon VPC Flow Logs, AWS Security Hub findings மற்றும் பிற பதிவுகள் - மறைவதில்லை. அது Security Lake இன் Amazon S3 ஆதாரிக்கப்பட்ட கட்டமைப்பில் சரியாக இருக்கும் இடத்தில் இருக்கிறது.

இந்த வழிகாட்டி **Amazon Athena** ஐ உங்கள் வரலாற்று Security Lake தரவு மற்றும் உங்கள் புதிய CloudWatch unified data store லாக்குகள் இரண்டிற்கும் ஒரே வினவல் கன்சோலாக எவ்வாறு பயன்படுத்துவது என்பதைக் காட்டுகிறது - எந்த தரவையும் ஏற்றுமதி செய்யாமல், நகலெடுக்காமல் அல்லது நகலாக்காமல்.

> **புதிய** லாக் நிகழ்வுகள் உங்கள் முதன்மை தளமாக CloudWatch unified data store க்கு பாய்கின்றன.
> **வரலாற்று** நிகழ்வுகள் Security Lake இல் இருக்கின்றன.
> **Athena** இரண்டையும் ஒரே கன்சோலிலிருந்து வினவுகிறது.

![இடம்பெயர்வு கட்டங்கள்](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake to Amazon CloudWatch")

| கட்டம் | என்ன நடக்கிறது |
|---|---|
| **கட்டம் 1 — Security Lake** | VPC Flow Logs மற்றும் பிற பாதுகாப்பு தரவு மூலங்கள் Security Lake க்கு மட்டுமே எழுதுகின்றன. |
| **கட்டம் 2 — இரட்டை உள்ளீடு** | Security Lake மற்றும் CloudWatch இரண்டும் ஒரே நேரத்தில் தரவைப் பெறுகின்றன. |
| **கட்டம் 3 — CloudWatch மட்டும்** | தரவு மூலங்கள் CloudWatch க்கு மட்டுமே எழுதுகின்றன. அனைத்து வரலாற்று Security Lake தரவும் பாதுகாக்கப்பட்டு அணுகக்கூடியதாக இருக்கின்றன. |

Security Lake மற்றும் Amazon CloudWatch unified data store இரண்டும் தங்கள் தரவை [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/) க்கு normalize செய்கின்றன, எனவே `src_endpoint.ip`, `api.operation` மற்றும் `actor.user.name` போன்ற புல பெயர்கள் இரு மூலங்களிலும் சீரானவை.

---

## ஏன் ஏற்றுமதி செய்வதற்கு பதிலாக இடத்திலேயே வினவ வேண்டும்?

Athena cross-catalog வினவல்கள் வரலாற்று Security Lake தரவை தரவை ஏற்றுமதி செய்ய வேண்டிய அவசியமின்றி நேரடியாக அணுக அனுமதிக்கின்றன.

| நன்மை | விவரங்கள் |
|---|---|
| **நகல் சேமிப்பு கட்டணங்கள் இல்லை** | உங்கள் வரலாற்று தரவு ஏற்கனவே Security Lake இன் Amazon S3 சேமிப்பில் உள்ளது. |
| **உருவாக்க அல்லது பராமரிக்க ETL pipelines இல்லை** | Athena cross-catalog வினவல்கள் தனி pipeline தேவையை நீக்குகின்றன. |
| **வரலாற்று தரவு ஒழுங்கமைக்கப்பட்டிருக்கிறது** | Security Lake கணக்கு, Region மற்றும் தேதி மூலம் தரவை partition செய்கிறது. |
| **புதிய தரவு இயல்பாக பாய்கிறது** | இடம்பெயர்ந்த பிறகு, CloudWatch புதிய லாக் நிகழ்வுகளுக்கான முதன்மை இலக்காக மாறுகிறது. |
| **Athena இரண்டையும் திறம்பட இணைக்கிறது** | Athena ஒரே SQL வினவலில் இரு catalogs ஐயும் குறிப்பிடலாம். |

:::tip முடிவு
நீங்கள் உங்கள் வரலாற்று Security Lake தரவுக்கான முழு அணுகலை தக்கவைக்கிறீர்கள் - உங்கள் புதிய CloudWatch unified data store தரவு தொடர்ந்து கண்காணிப்புக்கான முதன்மை மூலமாக பாய்கிறது.
:::

---

## எவ்வாறு செயல்படுகிறது

### கட்டமைப்பு

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch unified data store** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

![கட்டமைப்பு வரைபடம்](/img/Athena-Arch-ASL-CW.png "Architecture Diagram")

## முன்நிபந்தனைகள்

Cross-catalog வினவல்களை இயக்குவதற்கு முன், Athena கன்சோலைப் பயன்படுத்தி உங்கள் catalog paths, databases மற்றும் table names ஐ உறுதிப்படுத்தவும்.

### Security Lake Tables

| Catalog | Database | உதாரண Tables |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |

### CloudWatch Unified Data Store Tables

| Catalog | Database | உதாரண Tables |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `amazon_vpc__flow` |

:::info Region-குறிப்பிட்ட பெயரிடல்
Security Lake database மற்றும் table பெயர்கள் உங்கள் deployment Region ஐ உள்ளடக்கியது.
:::

:::tip உங்கள் Table பெயர்களை கண்டறிதல்
```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Athena இலிருந்து இரண்டு Data Store-களையும் வினவுதல்

### தொடரியல் மேலோட்டம்

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## பகுதி 1 — Security Lake ஐ வினவுதல் (வரலாற்று தரவு)

### உதாரணம் 1a — வரலாற்று CloudTrail Management Events

<details>
<summary>SQL வினவலைக் காண்க</summary>

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

### உதாரணம் 1b — வரலாற்று VPC Flow Logs

<details>
<summary>SQL வினவலைக் காண்க</summary>

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

---

## பகுதி 2 — CloudWatch Unified Data Store ஐ வினவுதல் (சமீபத்திய தரவு)

### உதாரணம் 2a — சமீபத்திய CloudTrail Management Events

<details>
<summary>SQL வினவலைக் காண்க</summary>

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

---

## பகுதி 3 — UNION ALL உடன் இரு Data Store-களையும் இணைத்தல்

:::caution ஏன் JOIN க்கு பதிலாக UNION ALL?
Cross-catalog JOIN-கள் குறிப்பிடத்தக்க செயல்திறன் மற்றும் செலவு வரம்புகளைக் கொண்டுள்ளன. `UNION ALL` பயன்படுத்துவது ஒவ்வொரு வினவலையும் சரியான partition pruning உடன் சுயாதீனமாக இயக்குகிறது.
:::

### உதாரணம் 3a — இரு காலகட்டங்களிலும் AssumeRole செயல்பாடு

<details>
<summary>SQL வினவலைக் காண்க</summary>

```sql
SELECT
    'Security Lake'      AS source,
    api.operation        AS event_name,
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
