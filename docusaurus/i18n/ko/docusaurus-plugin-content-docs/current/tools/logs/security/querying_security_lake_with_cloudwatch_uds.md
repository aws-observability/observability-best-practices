---
sidebar_position: 1
---

# Athena를 사용하여 Amazon CloudWatch Logs에서 과거 Security Lake 데이터 쿼리하기

## 개요

보안 로그 관리를 [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)로 마이그레이션하면, 향후 운영 및 보안 텔레메트리를 위한 현대적이고 통합된 수신 대상을 확보할 수 있습니다. 하지만 마이그레이션 이전에 [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html)에 축적한 과거 보안 데이터 — AWS CloudTrail 이벤트, Amazon Virtual Private Cloud (Amazon VPC) Flow Logs, AWS Security Hub findings 및 기타 레코드 — 는 사라지지 않습니다. 데이터는 Security Lake의 Amazon S3 기반 구조에 이미 저장되고 파티셔닝된 상태 그대로 유지됩니다.

이 가이드에서는 **Amazon Athena**를 단일 쿼리 콘솔로 사용하여 과거 Security Lake 데이터와 새로운 CloudWatch unified data store 로그를 모두 조회하는 방법을 설명합니다 — 데이터를 내보내거나 복사하거나 중복 저장할 필요 없이 가능합니다. 각 데이터 스토어를 독립적으로 쿼리하거나, `UNION ALL`을 사용하여 양쪽 결과를 결합해 크로스 플랫폼 가시성을 확보할 수 있습니다.

> **신규** 로그 이벤트는 기본 플랫폼인 CloudWatch unified data store로 유입됩니다.
> **과거** 이벤트는 Security Lake에 그대로 남아 있습니다.
> **Athena**는 단일 콘솔에서 양쪽을 모두 쿼리합니다.

![Migration Phases](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake to Amazon CloudWatch")

| 마이그레이션 단계 | 각 단계별 설명 |
|---|---|
| **Phase 1 — Security Lake 단독** | VPC Flow Logs 및 기타 보안 데이터 소스가 Security Lake에만 기록되며, Amazon S3에 저장되고 AWS Glue Data Catalog를 통해 쿼리 가능한 OCSF 형식 레코드의 과거 아카이브를 구축합니다. |
| **Phase 2 — Security Lake와 CloudWatch 이중 수집** | Security Lake와 CloudWatch가 동시에 데이터를 수신합니다. 이 검증 기간은 최소 24시간을 권장하며, 팀이 CloudWatch로 완전히 전환하기 전에 두 플랫폼 간 로그 수집 및 일관성을 확인할 수 있는 시간을 제공합니다. 더 많은 검증 시간이 필요한 경우, 두 서비스를 병렬로 운영하는 데 드는 잠재적 비용을 검토하세요. |
| **Phase 3 — CloudWatch 전용** | 데이터 소스가 CloudWatch에만 기록됩니다. 모든 과거 Security Lake 데이터는 보존되고 접근 가능한 상태로 유지되며 — Athena를 사용하면 단일 콘솔에서 두 데이터 스토어를 독립적으로 또는 `UNION ALL`을 사용하여 결합 쿼리할 수 있습니다. |

Security Lake와 Amazon CloudWatch unified data store는 모두 [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/)로 데이터를 정규화합니다. 따라서 `src_endpoint.ip`, `api.operation`, `actor.user.name` 같은 필드 이름이 두 소스에서 일관됩니다. 이러한 일관성 덕분에 크로스 소스 쿼리가 간단해집니다 — Security Lake 기록 데이터든 CloudWatch unified data store 최신 데이터든 동일한 필드 참조가 작동합니다.

---

## 데이터를 내보내지 않고 원래 위치에서 쿼리하는 이유

Athena cross-catalog 쿼리를 사용하면 데이터를 내보낼 필요 없이 과거 Security Lake 데이터에 직접 접근할 수 있습니다. 아래는 원래 위치에서 쿼리하는 것이 더 효율적인 접근 방식인 이유를 보여주는 이점들입니다.

| 주요 이점 | 상세 설명 |
|---|---|
| **스토리지 비용 중복 없음** | 과거 데이터는 이미 Security Lake의 Amazon S3 기반 스토어에 존재합니다. 이를 CloudWatch Logs로 내보내면 동일한 데이터를 두 번 저장하는 비용을 지불해야 합니다. 원래 위치에서 쿼리하면 이미 보유한 데이터에 대해서만 비용을 지불합니다. |
| **ETL 파이프라인 구축 및 유지 관리 불필요** | 데이터를 내보내려면 파이프라인이 필요합니다: Security Lake에서 데이터를 읽고, 레코드를 변환하거나 재형식화하고, CloudWatch Logs에 기록하는 과정입니다. 이 파이프라인은 구축, 테스트, 모니터링 및 유지 관리가 필요합니다. Athena cross-catalog 쿼리를 활용하면 별도의 파이프라인이 필요 없습니다. |
| **과거 데이터의 체계적 구조 유지** | Security Lake는 계정, Region, 날짜별로 데이터를 저장하고 파티셔닝합니다 — 이는 과거 분석에 매우 적합한 구조입니다. 해당 데이터를 CloudWatch Logs로 이동하면 이 조직 구조가 깨지고 재파티셔닝이나 재인덱싱이 필요할 수 있습니다. |
| **새 데이터의 자연스러운 흐름** | 마이그레이션이 완료되면 CloudWatch가 새 로그 이벤트의 기본 수신 대상이 됩니다. 두 파이프라인을 동시에 운영하거나 복잡한 라우팅 레이어를 유지할 필요가 없습니다. |
| **Athena가 양쪽을 효율적으로 연결** | Security Lake는 기본 [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html) (`AwsDataCatalog`)에 테이블을 등록합니다. CloudWatch는 Amazon S3 Tables catalog (`s3tablescatalog/aws-cloudwatch`)를 사용합니다. Athena는 완전 정규화된 catalog 경로를 사용하여 단일 SQL 쿼리에서 양쪽을 참조할 수 있습니다 — 데이터 이동이 필요 없습니다. |

:::tip 결과
이벤트 조사, 위협 헌팅, 컴플라이언스 감사를 위해 과거 Security Lake 데이터에 대한 완전한 접근을 유지하면서, 새로운 CloudWatch unified data store 데이터가 지속적인 모니터링의 주요 소스로 유입됩니다.
:::

---

## 작동 방식

두 데이터 스토어가 어떻게 함께 동작하는지 이해하면 쿼리를 더 쉽게 구성할 수 있습니다.

### 아키텍처

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch unified data store** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena는 단일 SQL 문에서 여러 Glue catalog에 걸쳐 쿼리하는 것을 지원합니다. 각 소스를 완전 정규화된 catalog 경로로 참조하면, 동일한 Athena 콘솔에서 Security Lake와 CloudWatch unified data store를 독립적으로 쿼리할 수 있습니다 — 또는 통합 뷰가 필요할 때 `UNION ALL`로 결과를 결합할 수 있습니다.

두 소스 모두 OCSF로 데이터를 정규화하므로, 필드 이름, 유형, 구조가 양쪽에서 일관됩니다 — 어떤 데이터 스토어를 대상으로 하든 쿼리가 직관적이고 신뢰할 수 있습니다.

![Architecture Diagram](/img/Athena-Arch-ASL-CW.png "Architecture Diagram")

## 사전 준비 사항

Cross-catalog 쿼리를 실행하기 전에 Athena 콘솔을 사용하여 catalog 경로, 데이터베이스, 테이블 이름을 확인하세요. 이 가이드의 예제는 `us-east-1` 배포를 기반으로 한 다음 명명 규칙을 사용합니다.

### Security Lake 테이블

| 카탈로그 | 데이터베이스 | 예제 테이블 |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

### CloudWatch Unified Data Store 테이블

| 카탈로그 | 데이터베이스 | 예제 테이블 |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info Region별 명명 규칙
Security Lake 데이터베이스 및 테이블 이름에는 배포 Region이 포함됩니다. 이 가이드의 예제는 `us_east_1`을 사용합니다 (예: `amazon_security_lake_glue_db_us_east_1`). Security Lake가 다른 Region에서 활성화된 경우, `us_east_1`을 해당 Region의 식별자로 교체하세요 — 예를 들어, `eu-west-1`의 경우 `amazon_security_lake_glue_db_eu_west_1`이 됩니다. 테이블 이름도 마찬가지입니다.
:::

:::tip 테이블 이름 확인하기
테이블 이름은 Region, Security Lake 구성, 활성화한 CloudWatch unified data store 데이터 소스에 따라 다를 수 있습니다. 다음을 실행하여 테이블 이름을 확인하세요:

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Athena에서 두 데이터 스토어 쿼리하기

CloudWatch unified data store로 마이그레이션한 후, Athena는 과거 및 현재 보안 데이터를 위한 단일 쿼리 콘솔이 됩니다. Security Lake 테이블은 AWS Glue Data Catalog에 등록되고, CloudWatch unified data store 테이블은 S3 Tables catalog에 등록됩니다. Athena는 양쪽 모두에 접근할 수 있습니다 — 데이터 이동, 내보내기 파이프라인, 데이터 중복이 필요 없습니다.

아래 섹션에서는 세 가지 수준의 쿼리를 안내합니다:

1. **Security Lake 쿼리** — 과거 아카이브에 직접 접근
2. **CloudWatch unified data store 쿼리** — S3 Tables를 통해 현재 데이터 접근
3. **UNION ALL로 양쪽 결합** — 과거 및 최신 데이터를 단일 결과 집합에서 나란히 확인

### 구문 개요

특정 catalog에서 테이블을 참조하는 일반적인 패턴:

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## 사용 가능한 테이블 참조

쿼리를 작성할 때 이 테이블을 참조로 활용하세요. Security Lake와 CloudWatch unified data store 모두 OCSF 정규화를 사용하므로, 데이터 소스 유형 간에 필드 이름이 일관됩니다.

### Security Lake

| 테이블 | OCSF 클래스 | 주요 쿼리 필드 |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`, `query.hostname`, `time_dt` |
| `..._sh_findings_2_0` | Vulnerability / Compliance / Detection Finding | `finding.title`, `cloud.account.uid`, `severity`, `severity_id`, `time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`, `actor.user.name`, `time_dt` |
| `..._lambda_execution_2_0` | API Activity | `api.operation`, `cloud.account.uid`, `time_dt` |

:::note Security Hub OCSF v2 클래스 이름
OCSF v2 (1.1.0)에서 Security Hub CSPM findings는 finding 유형에 따라 여러 OCSF 클래스 이름 — Vulnerability Finding, Compliance Finding, Detection Finding — 으로 매핑됩니다.
:::

### CloudWatch Unified Data Store

| 테이블 | OCSF 클래스 | 주요 쿼리 필드 |
|---|---|---|
| `aws_cloudtrail__management` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `aws_cloudtrail__data` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `amazon_vpc__flow` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `cloudtrail__networkactivityevent` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `time_dt` |
| `cloudtrailcustom__networkactivityevent` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `time_dt` |
| `microsoft_entraid__account_change` | Account Change | `actor.user.name`, `time_dt` |
| `aws_security_hub__compliance_finding` | Compliance Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |
| `aws_security_hub__vulnerability_finding` | Vulnerability Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |
| `aws_security_hub__detection_finding` | Detection Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |

:::tip 테이블 이름 검색
CloudWatch unified data store 테이블 이름은 연결 설정에 구성된 데이터 소스 이름과 유형을 기반으로 자동 생성됩니다. Athena에서 다음 명령을 실행하여 사용 가능한 테이블 목록을 확인할 수 있습니다:

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Part 1 — Security Lake 쿼리 (과거 데이터)

과거 보안 데이터는 Security Lake에 그대로 남아 있으며, Amazon S3에 저장되고 AWS Glue Data Catalog에 등록된 상태입니다. 아래 쿼리들은 `awsdatacatalog` catalog에 대해 실행되며, 마이그레이션 이전에 수집된 동일한 OCSF 형식의 데이터에 접근합니다.

### 예제 1a — 과거 CloudTrail Management 이벤트

Security Lake 아카이브에서 CloudTrail management 이벤트를 쿼리합니다. 과거 이벤트를 조사하거나, 과거 API 활동을 감사하거나, 행동 기준선을 설정하는 데 유용합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

### 예제 1b — 과거 VPC Flow Logs

Security Lake 아카이브에서 VPC Flow Logs를 쿼리하여 과거 네트워크 활동을 조사합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

### 예제 1c — 과거 Security Hub Findings

Security Lake 아카이브에서 Security Hub findings를 쿼리하여 과거 보안 상태를 검토합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

## Part 2 — CloudWatch Unified Data Store 쿼리 (최신 데이터)

마이그레이션 완료 후 새로운 보안 데이터는 CloudWatch unified data store로 유입되어 Amazon S3 Tables에 저장됩니다. 아래 쿼리들은 `s3tablescatalog/aws-cloudwatch` catalog에 대해 실행되며, 마이그레이션 이후에 수집된 OCSF 형식의 데이터에 접근합니다.

### 예제 2a — 최신 CloudTrail Management 이벤트

CloudWatch unified data store에서 최신 CloudTrail management 이벤트를 쿼리합니다. Security Lake 쿼리에서 사용한 동일한 OCSF 필드 이름이 여기서도 작동합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

### 예제 2b — 최신 VPC Flow Logs

CloudWatch unified data store에서 최신 VPC Flow Logs를 쿼리합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

### 예제 2c — 최신 Security Hub Findings

CloudWatch unified data store에서 최신 Security Hub compliance findings를 쿼리합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

:::info CloudWatch Unified Data Store의 Security Hub Finding 유형
Security Hub findings는 CloudWatch unified data store에서 여러 OCSF event class로 매핑됩니다. finding의 유형에 따라 데이터가 아래 테이블 중 하나에 저장될 수 있습니다:

| CW UDS 테이블 | Finding 유형 설명 |
|---|---|
| `aws_security_hub__compliance_finding` | 컴플라이언스 검사 결과 |
| `aws_security_hub__detection_finding` | 위협 탐지 findings |
| `aws_security_hub__vulnerability_finding` | 취약점 findings |
| `aws_security_hub__data_security_finding` | 데이터 보안 findings |

`SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"`를 실행하여 현재 사용 가능한 테이블 전체 목록을 확인하세요.
:::

---

## Part 3 — UNION ALL로 두 데이터 스토어 결합하기

각 데이터 스토어를 독립적으로 쿼리하는 것이 익숙해지면, `UNION ALL`을 사용하여 단일 쿼리에서 양쪽의 결과를 결합할 수 있습니다. 이를 통해 마이그레이션 경계를 넘나드는 통합 뷰를 확보할 수 있습니다 — Security Lake의 과거 데이터와 CloudWatch unified data store의 최신 데이터를 나란히 볼 수 있습니다.

`UNION ALL`이 잘 작동하기 위한 핵심은 특정 필터(예: 특정 API 작업, IP 주소, finding 제목)를 사용하여 양쪽 모두 관련 있고 비교 가능한 결과를 반환하도록 하는 것입니다. 필터 없이는 `LIMIT`이 먼저 행을 반환하는 쪽에 의해 소진되어 양쪽 데이터 스토어의 결과를 모두 볼 수 없을 수 있습니다.

:::caution JOIN 대신 UNION ALL을 사용하는 이유
AWS Glue Data Catalog (Security Lake)와 S3 Tables catalog (CloudWatch unified data store) 간의 cross-catalog JOIN은 Athena에서 기술적으로 가능하지만, 성능 및 비용 면에서 상당한 제약이 있습니다. Athena는 다른 catalog 유형 간에 predicate를 효율적으로 push down할 수 없어, join이 평가되기 전에 양쪽에서 대규모 full-table scan이 발생합니다. 이로 인해 장시간 실행 쿼리와 높은 비용(Athena는 스캔된 TB당 $5 과금)이 발생합니다. `UNION ALL`을 사용하면 각 쿼리가 적절한 partition pruning과 함께 자체 catalog에 대해 독립적으로 실행된 후 결과를 결합하므로 — 더 빠른 성능과 더 낮은 비용을 제공합니다.
:::

:::info 시간 범위 안내
이 예제의 WHERE 절은 마이그레이션 시나리오를 반영하기 위해 두 데이터 소스 모두에 하드코딩된 날짜 범위를 사용합니다. Security Lake 필터는 과거 아카이브를 대상으로 하고(예: `TIMESTAMP '2025-01-01'`에서 `TIMESTAMP '2025-06-01'`), CloudWatch unified data store 필터는 마이그레이션 이후 기간을 대상으로 합니다(예: `TIMESTAMP '2025-06-01'`에서 `TIMESTAMP '2025-07-01'`). 이 값들을 실제 마이그레이션 타임라인과 보존 기간에 맞는 날짜로 교체하세요.
:::

### UNION ALL 쿼리 템플릿

```sql
SELECT
    'Security Lake'   AS source,
    <field_1>         AS <alias>,
    <field_2>         AS <alias>,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."<security_lake_table>"
WHERE time_dt BETWEEN TIMESTAMP '<YYYY-MM-DD>' AND TIMESTAMP '<YYYY-MM-DD>'
    AND <specific_filter>

UNION ALL

SELECT
    'CloudWatch UDS'  AS source,
    <field_1>         AS <alias>,
    <field_2>         AS <alias>,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."<cw_uds_table>"
WHERE time_dt BETWEEN TIMESTAMP '<YYYY-MM-DD>' AND TIMESTAMP '<YYYY-MM-DD>'
    AND <specific_filter>

LIMIT 50;
```

### 예제 3a — 양쪽 기간에 걸친 AssumeRole 활동

마이그레이션 경계를 넘나드는 `AssumeRole` 호출을 추적합니다. 마이그레이션 전후로 동일한 역할이 사용되고 있는지 조사하거나, 접근 패턴의 변화를 탐지하는 데 유용합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

**이 쿼리가 보여주는 것:**

- 양쪽 기간의 `AssumeRole` 이벤트, `source` 컬럼으로 데이터 스토어 식별
- 마이그레이션 경계를 넘어 누가 어디에서 역할을 수임하고 있는지 추적하기 위한 사용자 ID 및 소스 IP
- 양쪽 기간에서 역할 수임이 성공하는지 실패하는지 식별하기 위한 상태 코드

**쿼리 응용:**

| 활용 목표 | 수정 방법 |
|---|---|
| 다른 API 호출 검색 | `api.operation = 'AssumeRole'`을 `'CreateUser'`, `'PutBucketPolicy'` 등 다른 작업으로 변경 |
| 오류 이벤트로 필터링 | 양쪽 SELECT 블록에 `AND status = 'Failure'` 추가 |
| 특정 사용자로 범위 축소 | 양쪽 SELECT 블록에 `AND actor.user.name = '[USERNAME]'` 추가 |

---

### 예제 3b — 양쪽 기간에 걸친 거부된 VPC 플로우

Security Lake (과거)와 CloudWatch unified data store (최신)에서 거부된 네트워크 플로우를 비교합니다. 보안 그룹 및 NACL 규칙이 마이그레이션 전후로 일관된 거부 패턴을 생성하는지 검증하는 데 유용합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

**이 쿼리가 보여주는 것:**

- `source` 컬럼으로 식별되는 양쪽 기간의 거부된 네트워크 플로우
- 어떤 트래픽이 거부되고 있는지 식별하기 위한 소스/대상 IP 및 포트 번호
- 거부된 트래픽의 볼륨과 흐름을 이해하기 위한 바이트 수 및 방향

**쿼리 응용:**

| 활용 목표 | 수정 방법 |
|---|---|
| 특정 대상 포트로 필터링 | 양쪽 SELECT 블록에 `AND dst_endpoint.port = 443` 추가 |
| 특정 소스 IP로 필터링 | 양쪽 SELECT 블록에 `AND src_endpoint.ip = '[IP_ADDRESS]'` 추가 |
| 허용된 트래픽도 포함 | `AND activity_name = 'Reject'` 필터를 제거하거나 `'Accept'`로 변경 |

---

### 예제 3c — 양쪽 기간에 걸친 높은 심각도 Security Hub Findings

마이그레이션 경계를 넘나드는 높은 심각도 Security Hub findings를 추적합니다. 마이그레이션 전에 존재하던 중요 findings가 해결되었는지, 또는 새로운 높은 심각도 findings가 나타났는지 식별하는 데 유용합니다.

<details>
<summary>SQL 쿼리 보기</summary>

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

**이 쿼리가 보여주는 것:**

- 양쪽 기간의 높은 심각도 findings (HIGH 및 CRITICAL), `source` 컬럼으로 데이터 스토어 식별
- 마이그레이션 경계를 넘어 특정 findings를 추적하기 위한 finding 제목 및 UID
- findings가 해결되었는지 또는 여전히 활성 상태인지 식별하기 위한 상태
- 멀티 계정 환경을 위한 계정 수준 상세 정보

**쿼리 응용:**

| 활용 목표 | 수정 방법 |
|---|---|
| MEDIUM 심각도 포함 | 양쪽 SELECT 블록에서 `severity_id >= 4`를 `severity_id >= 3`으로 변경 |
| finding 상태로 필터링 | 양쪽 SELECT 블록에 `AND status = 'New'`를 추가하여 미해결 findings 찾기 |
| 특정 계정에 집중 | 양쪽 SELECT 블록에 `AND cloud.account.uid = '[ACCOUNT_ID]'` 추가 |
| 취약점 findings 쿼리 | CW UDS 테이블을 `aws_security_hub__vulnerability_finding`으로 교체 |

---
