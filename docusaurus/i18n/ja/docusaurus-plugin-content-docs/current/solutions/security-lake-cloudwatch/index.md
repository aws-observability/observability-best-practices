---
title: CloudWatch による Security Lake のクエリ
sidebar_label: Security Lake + CloudWatch
---

import RelatedEvents from '@site/src/components/RelatedEvents';


# Amazon Athena を使用した Amazon CloudWatch Logs での Security Lake 履歴データのクエリ

## 概要

セキュリティログ管理を [Amazon CloudWatch 統合データストア（unified data store）](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)に移行すると、今後の運用およびセキュリティテレメトリのための最新の統合された宛先が得られます。しかし、移行前に [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) に蓄積した履歴セキュリティデータ — AWS CloudTrail イベント、Amazon Virtual Private Cloud（Amazon VPC）フローログ、AWS Security Hub の検出結果、およびその他のレコード — は消えません。そのデータは、Security Lake の Amazon S3 バックエンド構造にすでに保存およびパーティショニングされた状態のままです。

このガイドでは、**Amazon Athena** を使用して、データのエクスポート、コピー、複製を行うことなく、履歴 Security Lake データと新しい CloudWatch 統合データストアログの両方をクエリする単一のクエリコンソールとして活用する方法を示します。各データストアを個別にクエリするか、`UNION ALL` を使用して両方の結果を組み合わせてクロスプラットフォームの可視性を得ることができます。

> **新しい**ログイベントは、プライマリプラットフォームとして CloudWatch 統合データストアに流入します。
> **履歴**イベントは Security Lake に残ります。
> **Athena** が単一のコンソールから両方をクエリします。

![移行フェーズ](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake から Amazon CloudWatch へ")

| フェーズ | 内容 |
|---|---|
| **フェーズ 1 — Security Lake** | VPC フローログおよびその他のセキュリティデータソースは Security Lake にのみ書き込み、Amazon S3 に保存され AWS Glue Data Catalog 経由でクエリ可能な OCSF フォーマットのレコードの履歴アーカイブを構築します。 |
| **フェーズ 2 — Security Lake と CloudWatch のデュアル取り込み** | Security Lake と CloudWatch の両方が同時にデータを受信します。この検証期間は最低 24 時間推奨され、CloudWatch に完全に移行する前に、両方のプラットフォーム間でログの取り込みと一貫性を検証する時間をチームに与えます。検証にさらに時間が必要な場合は、両方のサービスを並行して実行する潜在的なコストを確認してください。 |
| **フェーズ 3 — CloudWatch のみ** | データソースは CloudWatch にのみ書き込みます。すべての履歴 Security Lake データはそのまま保持され、アクセス可能です — Athena を使用して、個別にまたは `UNION ALL` を使用して両方のデータストアを単一のコンソールからクエリできます。 |

Security Lake と Amazon CloudWatch 統合データストアは、どちらもデータを [Open Cybersecurity Schema Framework（OCSF）](https://schema.ocsf.io/) に正規化します。これにより、`src_endpoint.ip`、`api.operation`、`actor.user.name` などのフィールド名が両方のソース間で一貫しています。この一貫性により、クロスソースクエリが簡単になります — Security Lake の履歴をクエリする場合でも CloudWatch 統合データストアの最新データをクエリする場合でも、同じフィールド参照が機能します。

---

## 使用するタイミング

- セキュリティログ管理を Amazon Security Lake から Amazon CloudWatch 統合データストアに移行中（または移行済み）で、Security Lake に残る履歴データをクエリする必要がある場合
- データのエクスポートや複製を行わずに、履歴 Security Lake データと現在の CloudWatch 統合データストアログの両方にアクセスする単一のクエリコンソール（Amazon Athena）が必要な場合
- 移行前後に収集されたデータにまたがる、脅威ハンティング、コンプライアンス監査、インシデントレスポンスなどのクロスプラットフォーム調査を実行する必要がある場合
- 履歴 Security Lake データを CloudWatch にエクスポートするための ETL パイプラインの構築とメンテナンスを避けたい場合
- `UNION ALL` クエリを使用して移行境界を越えてセキュリティイベント（例：CloudTrail、VPC フローログ、Security Hub の検出結果）を比較する必要がある場合

## ガイダンス

### エクスポートではなくインプレースクエリを行う理由

Athena のクロスカタログクエリにより、データをエクスポートすることなく履歴 Security Lake データに直接アクセスできます。以下は、インプレースクエリがより効率的なアプローチである理由です。

| メリット | 詳細 |
|---|---|
| **ストレージ費用の重複なし** | 履歴データは既に Security Lake の Amazon S3 バックエンドストアにあります。それを CloudWatch Logs にエクスポートすると、同じデータを二重に保存する費用が発生します。インプレースクエリでは、既にあるものに対してのみ支払います。 |
| **構築・メンテナンスする ETL パイプラインが不要** | データのエクスポートにはパイプラインが必要です：Security Lake から読み取り、レコードを変換またはリフォーマットし、CloudWatch Logs に書き込むもの。そのパイプラインは構築、テスト、監視、メンテナンスが必要です。Athena のクロスカタログクエリにより、別途パイプラインが不要になります。 |
| **履歴データの整理が維持される** | Security Lake はデータをアカウント、リージョン、日付でパーティショニングして保存します — 履歴分析に適した構造です。そのデータを CloudWatch Logs に移動すると、その整理が崩れ、再パーティショニングや再インデックスが必要になる場合があります。 |
| **新しいデータは自然に流入** | 移行後、CloudWatch が新しいログイベントの主要な宛先になります。両方のパイプラインを同時に実行したり、複雑なルーティングレイヤーを維持する必要はありません。 |
| **Athena が両方を効率的にブリッジ** | Security Lake はデフォルトの [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)（`AwsDataCatalog`）にテーブルを登録します。CloudWatch は Amazon S3 Tables カタログ（`s3tablescatalog/aws-cloudwatch`）を使用します。Athena は完全修飾カタログパスを使用して、単一の SQL クエリで両方を参照できます — データ移動は不要です。 |

:::tip 結果
履歴 Security Lake データへの完全なアクセスをイベント調査、脅威ハンティング、コンプライアンス監査のために保持しながら、新しい CloudWatch 統合データストアデータが継続的なモニタリングの主要ソースとして流入します。
:::

---

### 仕組み

2 つのデータストアがどのように組み合わさるかを理解すると、クエリについて推論しやすくなります。

#### アーキテクチャ

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch 統合データストア** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena は単一の SQL ステートメントで複数の Glue カタログにまたがるクエリをサポートしています。各ソースを完全修飾カタログパスで参照することで、同じ Athena コンソールから Security Lake と CloudWatch 統合データストアを個別にクエリできます — または統一されたビューが必要な場合は `UNION ALL` で結果を組み合わせることができます。

両方のソースはデータを OCSF に正規化するため、フィールド名、型、構造はどちらのデータストアをターゲットにしても一貫しています — クエリが直感的で信頼性が高くなります。

![アーキテクチャ図](/img/Athena-Arch-ASL-CW.png "アーキテクチャ図")

### 前提条件

クロスカタログクエリを実行する前に、Athena コンソールを使用してカタログパス、データベース、テーブル名を確認してください。このガイドの例では、`us-east-1` デプロイメントに基づく以下の命名規則を使用しています。

#### Security Lake テーブル

| カタログ | データベース | テーブル例 |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

#### CloudWatch 統合データストアテーブル

| カタログ | データベース | テーブル例 |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info リージョン固有の命名
Security Lake のデータベースとテーブル名にはデプロイメントリージョンが含まれます。このガイドの例では `us_east_1`（例：`amazon_security_lake_glue_db_us_east_1`）を使用しています。Security Lake が異なるリージョンで有効になっている場合は、`us_east_1` をお使いのリージョンの識別子に置き換えてください — 例えば、`eu-west-1` の場合は `amazon_security_lake_glue_db_eu_west_1` です。テーブル名についても同様です。
:::

:::tip テーブル名の検出
テーブル名は、リージョン、Security Lake の設定、および有効にした CloudWatch 統合データストアのデータソースによって異なる場合があります。以下を実行してテーブル名を確認してください：

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

### Athena からの両方のデータストアのクエリ

CloudWatch 統合データストアに移行した後、Athena は履歴データと現在のセキュリティデータの両方の単一クエリコンソールになります。Security Lake テーブルは AWS Glue Data Catalog に登録され、CloudWatch 統合データストアテーブルは S3 Tables カタログに登録されます。Athena は両方にアクセスできます — データの移動、エクスポートパイプライン、複製は不要です。

以下のセクションでは、3 つのレベルのクエリを説明します：

1. **Security Lake のクエリ** — 履歴アーカイブに直接アクセス
2. **CloudWatch 統合データストアのクエリ** — S3 Tables 経由で現在のデータにアクセス
3. **UNION ALL での両方の組み合わせ** — 単一の結果セットで履歴データと最新データを並べて表示

#### 構文の概要

特定のカタログからテーブルを参照する一般的なパターン：

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

### 利用可能なテーブルリファレンス

独自のクエリを構築する際のリファレンスとしてこれらのテーブルを使用してください。Security Lake と CloudWatch 統合データストアの両方が OCSF 正規化を使用するため、データソースタイプ間でフィールド名が一貫しています。

#### Security Lake

| テーブル | OCSF クラス | 一般的なクエリフィールド |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`、`src_endpoint.ip`、`actor.user.name`、`time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`、`dst_endpoint.ip`、`dst_endpoint.port`、`time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`、`query.hostname`、`time_dt` |
| `..._sh_findings_2_0` | Vulnerability / Compliance / Detection Finding | `finding.title`、`cloud.account.uid`、`severity`、`severity_id`、`time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`、`actor.user.name`、`time_dt` |
| `..._lambda_execution_2_0` | API Activity | `api.operation`、`cloud.account.uid`、`time_dt` |

:::note Security Hub OCSF v2 クラス名
OCSF v2（1.1.0）では、Security Hub CSPM の検出結果は、検出結果の種類に応じて複数の OCSF クラス名 — Vulnerability Finding、Compliance Finding、または Detection Finding — にマッピングされます。
:::

#### CloudWatch 統合データストア

| テーブル | OCSF クラス | 一般的なクエリフィールド |
|---|---|---|
| `aws_cloudtrail__management` | API Activity | `api.operation`、`src_endpoint.ip`、`actor.user.name`、`time_dt` |
| `aws_cloudtrail__data` | API Activity | `api.operation`、`src_endpoint.ip`、`actor.user.name`、`time_dt` |
| `amazon_vpc__flow` | Network Activity | `src_endpoint.ip`、`dst_endpoint.ip`、`dst_endpoint.port`、`time_dt` |
| `cloudtrail__networkactivityevent` | Network Activity | `src_endpoint.ip`、`dst_endpoint.ip`、`time_dt` |
| `cloudtrailcustom__networkactivityevent` | Network Activity | `src_endpoint.ip`、`dst_endpoint.ip`、`time_dt` |
| `microsoft_entraid__account_change` | Account Change | `actor.user.name`、`time_dt` |
| `aws_security_hub__compliance_finding` | Compliance Finding | `finding_info.title`、`finding_info.uid`、`cloud.account.uid`、`severity`、`status`、`time_dt` |
| `aws_security_hub__vulnerability_finding` | Vulnerability Finding | `finding_info.title`、`finding_info.uid`、`cloud.account.uid`、`severity`、`status`、`time_dt` |
| `aws_security_hub__detection_finding` | Detection Finding | `finding_info.title`、`finding_info.uid`、`cloud.account.uid`、`severity`、`status`、`time_dt` |

:::tip テーブル名の検出
CloudWatch 統合データストアのテーブル名は、関連付けで設定したデータソース名とタイプに基づいて生成されます。利用可能なテーブルを検出するには、Athena で以下を実行してください：

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

### パート 1 — Security Lake（履歴データ）のクエリ

履歴セキュリティデータは Security Lake に残り、Amazon S3 に保存され、AWS Glue Data Catalog に登録されています。これらのクエリは `awsdatacatalog` カタログに対して実行され、移行前に収集された同じ OCSF フォーマットのデータにアクセスします。

#### 例 1a — 履歴 CloudTrail 管理イベント

Security Lake アーカイブから CloudTrail 管理イベントをクエリします。過去のイベントの調査、履歴的な API アクティビティの監査、またはベースラインの確立に役立ちます。

<details>
<summary>SQL クエリを表示</summary>

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

#### 例 1b — 履歴 VPC フローログ

Security Lake アーカイブから VPC フローログをクエリして、履歴的なネットワークアクティビティを調査します。

<details>
<summary>SQL クエリを表示</summary>

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

#### 例 1c — 履歴 Security Hub の検出結果

Security Lake アーカイブから Security Hub の検出結果をクエリして、履歴的なセキュリティ体制を確認します。

<details>
<summary>SQL クエリを表示</summary>

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

### パート 2 — CloudWatch 統合データストア（最新データ）のクエリ

移行後、新しいセキュリティデータは CloudWatch 統合データストアに流入し、Amazon S3 Tables に保存されます。これらのクエリは `s3tablescatalog/aws-cloudwatch` カタログに対して実行され、移行後に収集された OCSF フォーマットのデータにアクセスします。

#### 例 2a — 最新の CloudTrail 管理イベント

CloudWatch 統合データストアから最新の CloudTrail 管理イベントをクエリします。Security Lake クエリで使用したのと同じ OCSF フィールド名がここでも機能します。

<details>
<summary>SQL クエリを表示</summary>

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

#### 例 2b — 最新の VPC フローログ

CloudWatch 統合データストアから最新の VPC フローログをクエリします。

<details>
<summary>SQL クエリを表示</summary>

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

#### 例 2c — 最新の Security Hub の検出結果

CloudWatch 統合データストアから最新の Security Hub コンプライアンス検出結果をクエリします。

<details>
<summary>SQL クエリを表示</summary>

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

:::info CloudWatch 統合データストアでの Security Hub の検出結果タイプ
Security Hub の検出結果は、CloudWatch 統合データストアで複数の OCSF イベントクラスにマッピングされます。検出結果のタイプに応じて、データは以下のテーブルのいずれかにある場合があります：

| CW UDS テーブル | 検出結果タイプ |
|---|---|
| `aws_security_hub__compliance_finding` | コンプライアンスチェック結果 |
| `aws_security_hub__detection_finding` | 脅威検出の検出結果 |
| `aws_security_hub__vulnerability_finding` | 脆弱性の検出結果 |
| `aws_security_hub__data_security_finding` | データセキュリティの検出結果 |

`SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"` を実行して、利用可能なテーブルを検出してください。
:::

---

### パート 3 — UNION ALL での両方のデータストアの組み合わせ

各データストアを個別にクエリすることに慣れたら、`UNION ALL` を使用して単一のクエリで両方の結果を組み合わせることができます。これにより、移行境界を越えた統一ビューが得られます — Security Lake の履歴データと CloudWatch 統合データストアの最新データが並んで表示されます。

`UNION ALL` をうまく機能させるための鍵は、特定のフィルター（例：特定の API 操作、IP アドレス、または検出結果タイトル）を使用して、両側が関連性のある比較可能な結果を返すようにすることです。フィルターがないと、`LIMIT` はどちらかの側が先に行を返すかによって消費され、両方のデータストアからの結果が表示されない場合があります。

:::caution UNION ALL を JOIN の代わりに使用する理由
AWS Glue Data Catalog（Security Lake）と S3 Tables カタログ（CloudWatch 統合データストア）間のクロスカタログ JOIN は、Athena で技術的には可能ですが、パフォーマンスとコストに大きな制限があります。Athena は異なるカタログタイプ間で述語を効率的にプッシュダウンできないため、JOIN が評価される前に両側で大規模なフルテーブルスキャンが発生します。これにより、クエリの実行時間が長くなり、コストが高くなります（Athena はスキャンされた TB あたり $5 を課金します）。`UNION ALL` を使用すると、適切なパーティションプルーニングを使用して各クエリを独自のカタログに対して独立して実行し、結果を組み合わせることで、より高速なパフォーマンスを低コストで実現できます。
:::

:::info 時間ウィンドウのガイダンス
これらの例の WHERE 句は、移行シナリオを反映するために、両方のデータソースにハードコードされた日付範囲を使用しています。Security Lake フィルターは履歴アーカイブ（例：`TIMESTAMP '2025-01-01'` から `TIMESTAMP '2025-06-01'`）をターゲットにし、CloudWatch 統合データストアフィルターは移行後の期間（例：`TIMESTAMP '2025-06-01'` から `TIMESTAMP '2025-07-01'`）をターゲットにしています。実際の移行タイムラインと保持期間に合わせた日付に置き換えてください。
:::

#### UNION ALL クエリテンプレート

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

#### 例 3a — 両方の期間にわたる AssumeRole アクティビティ

移行境界を越えて `AssumeRole` 呼び出しを追跡します。移行前後で同じロールが引き受けられているかどうか、またはアクセスパターンの変化を検出するのに役立ちます。

<details>
<summary>SQL クエリを表示</summary>

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

**このクエリが表示する内容：**

- 両方の期間からの `AssumeRole` イベント。`source` 列でデータストアを識別します
- ユーザー ID とソース IP で、移行境界を越えて誰がどこからロールを引き受けているかを追跡します
- ステータスコードで、両方の期間でロールの引き受けが成功しているか失敗しているかを識別します

**このクエリの適応：**

| 目標 | 変更 |
|---|---|
| 異なる API 呼び出しを検索 | `api.operation = 'AssumeRole'` を `'CreateUser'`、`'PutBucketPolicy'` などの別の操作に変更 |
| エラーイベントでフィルタリング | 両方の SELECT ブロックに `AND status = 'Failure'` を追加 |
| 特定のユーザーに絞り込む | 両方の SELECT ブロックに `AND actor.user.name = '[USERNAME]'` を追加 |

---

#### 例 3b — 両方の期間にわたる拒否された VPC フロー

Security Lake（履歴）と CloudWatch 統合データストア（最新）から拒否されたネットワークフローを比較します。移行前後でセキュリティグループと NACL のルールが一貫した拒否パターンを生成しているかを検証するのに役立ちます。

<details>
<summary>SQL クエリを表示</summary>

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

**このクエリが表示する内容：**

- `source` 列で識別される、両方の期間からの拒否されたネットワークフロー
- ソースと宛先の IP およびポート番号で、どのトラフィックが拒否されているかを識別します
- バイトカウントと方向で、拒否されたトラフィックの量とフローを理解します

**このクエリの適応：**

| 目標 | 変更 |
|---|---|
| 特定の宛先ポートでフィルタリング | 両方の SELECT ブロックに `AND dst_endpoint.port = 443` を追加 |
| 特定のソース IP でフィルタリング | 両方の SELECT ブロックに `AND src_endpoint.ip = '[IP_ADDRESS]'` を追加 |
| 許可されたトラフィックも含める | `AND activity_name = 'Reject'` フィルターを削除するか、`'Accept'` に変更 |

---

#### 例 3c — 両方の期間にわたる高重大度の Security Hub の検出結果

移行境界を越えて高重大度の Security Hub の検出結果を追跡します。移行前に存在した重大な検出結果が修復されたかどうか、または新しい高重大度の検出結果が出現したかどうかを識別するのに役立ちます。

<details>
<summary>SQL クエリを表示</summary>

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

**このクエリが表示する内容：**

- `source` 列でデータストアを識別する、両方の期間からの高重大度の検出結果（HIGH と CRITICAL）
- 移行境界を越えて特定の検出結果を追跡する検出結果タイトルと UID
- 検出結果が修復されたか、まだアクティブかを識別するステータス
- マルチアカウント環境のためのアカウントレベルの詳細

**このクエリの適応：**

| 目標 | 変更 |
|---|---|
| MEDIUM 重大度を含める | 両方の SELECT ブロックで `severity_id >= 4` を `severity_id >= 3` に変更 |
| 検出結果のステータスでフィルタリング | 両方の SELECT ブロックに `AND status = 'New'` を追加して未解決の検出結果を検索 |
| 特定のアカウントに絞り込む | 両方の SELECT ブロックに `AND cloud.account.uid = '[ACCOUNT_ID]'` を追加 |
| 脆弱性の検出結果をクエリ | CW UDS テーブルを `aws_security_hub__vulnerability_finding` に置き換え |

---

## 関連リソース

- [Amazon Security Lake ユーザーガイド](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html)
- [Amazon CloudWatch 統合データストアの発表](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)
- [Open Cybersecurity Schema Framework（OCSF）](https://schema.ocsf.io/)
- [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)

## 関連イベント

<RelatedEvents />
