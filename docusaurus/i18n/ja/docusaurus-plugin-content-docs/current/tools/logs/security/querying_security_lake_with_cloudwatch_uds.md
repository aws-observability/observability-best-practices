---
sidebar_position: 1
---
# Athena を使用した Amazon CloudWatch Logs による Security Lake 履歴データのクエリ

## 概要

セキュリティログ管理を [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) に移行すると、今後の運用およびセキュリティテレメトリのための最新の統合された送信先を得ることができます。しかし、移行前に [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) に蓄積された過去のセキュリティデータ (AWS CloudTrail イベント、Amazon Virtual Private Cloud (Amazon VPC) Flow Logs、AWS Security Hub の検出結果、その他のレコード) は消えません。Security Lake の Amazon S3 ベースの構造にすでに保存およびパーティション化されているため、そのまま残ります。

このガイドでは、**Amazon Athena** を単一のクエリコンソールとして使用し、履歴の Security Lake データと新しい CloudWatch 統合データストアログの両方にアクセスする方法を説明します。データのエクスポート、コピー、複製は一切不要です。各データストアに個別にクエリを実行することも、両方の結果を組み合わせることもできます。 `UNION ALL` クロスプラットフォームの可視性を実現します。

> **新規**のログイベントは、プライマリプラットフォームとして CloudWatch 統合データストアに流入します。
> **履歴**イベントは Security Lake に残ります。
> **Athena** は単一のコンソールから両方をクエリします。

![Migration Phases](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake to Amazon CloudWatch")

| フェーズ | 内容 |
|---|---|
| **フェーズ 1 — Security Lake** | VPC Flow Logs やその他のセキュリティデータソースは、Security Lake のみに書き込み、Amazon S3 に保存され AWS Glue Data Catalog を介してクエリ可能な OCSF 形式レコードの履歴アーカイブを構築します。 |
| **フェーズ 2 — Security Lake と CloudWatch への二重取り込み** | Security Lake と CloudWatch の両方が同時にデータを受信します。この検証期間は最低 24 時間設けることが推奨され、CloudWatch へ完全に移行する前に、チームが両プラットフォームでのログ取り込みと整合性を検証する時間を確保できます。検証にさらに時間が必要な場合は、両サービスを並行して稼働させる際の潜在的なコストを確認してください。 |
| **フェーズ 3 — CloudWatch のみ** | データソースは CloudWatch のみに書き込みます。過去の Security Lake データはすべて保持され、アクセス可能なまま維持されます。さらに Athena を使用すると、単一のコンソールから両方のデータストアを、個別に、または `UNION ALL` を使用して組み合わせてクエリできます。 |

Security Lake と Amazon CloudWatch 統合データストアはどちらも、データを [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/) に正規化します。これは、次のようなフィールド名を意味します `src_endpoint.ip`, `api.operation`、および `actor.user.name` 両方のソースで一貫しています。この一貫性により、クロスソースクエリが簡単になります。Security Lake の履歴をクエリする場合でも、CloudWatch 統合データストアの最新データをクエリする場合でも、同じフィールド参照が機能します。

---

## エクスポートではなくインプレースでクエリを実行する理由

Athena のクロスカタログクエリを使用すると、データをエクスポートすることなく、Security Lake の履歴データに直接アクセスできます。以下は、インプレースクエリをより効率的なアプローチにするいくつかの利点です。

| メリット | 詳細 |
|---|---|
| **重複ストレージ料金が発生しない** | 過去のデータはすでに Security Lake の Amazon S3 ベースのストアに保存されています。これを CloudWatch Logs にエクスポートすると、同じデータを 2 回保存する料金を支払うことになります。インプレースでクエリを実行すれば、すでに保有しているデータの分だけを支払うことになります。 |
| **構築・保守する ETL パイプラインが不要** | データのエクスポートにはパイプラインが必要です。Security Lake から読み取り、レコードを変換または再フォーマットし、CloudWatch Logs に書き込む処理です。そのパイプラインは構築、テスト、監視、保守が必要になります。Athena のクロスカタログクエリは、別途パイプラインを用意する必要をなくします。 |
| **履歴データが整理された状態を維持** | Security Lake は、アカウント、リージョン、日付ごとにデータを保存およびパーティション化します。これは履歴分析に適した構造です。そのデータを CloudWatch Logs に移動すると、その構成が崩れ、再パーティション化や再インデックス化が必要になる場合があります。 |
| **新しいデータが自然に流入** | 移行後は、CloudWatch が新しいログイベントの主要な送信先になります。両方のパイプラインを同時に実行したり、複雑なルーティング層を維持したりする必要はありません。 |
| **Athena が両方を効率的に橋渡し** | Security Lake は、テーブルをデフォルトの [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html) (`AwsDataCatalog`) に登録します。CloudWatch は Amazon S3 Tables カタログ (`s3tablescatalog/aws-cloudwatch`) を使用します。Athena は、完全修飾カタログパスを使用して、単一の SQL クエリで両方を参照できます。データの移動は不要です。 |

:::tip 結果
イベント調査、脅威ハンティング、コンプライアンス監査のために、過去の Security Lake データへの完全なアクセスを保持できます。一方で、新しい CloudWatch 統合データストアのデータは、継続的な監視の主要なソースとして流入します。
:::
:::

---

## 仕組み

2 つのデータストアがどのように組み合わされているかを理解することで、クエリの推論が容易になります。

### アーキテクチャ

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch 統合データストア** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena は、単一の SQL ステートメント内で複数の Glue カタログにまたがるクエリをサポートしています。完全修飾カタログパスで各ソースを参照することで、同じ Athena コンソールから Security Lake と CloudWatch 統合データストアを個別にクエリできます。また、結果を組み合わせることも可能です。 `UNION ALL` 両方を統合したビューが必要な場合に使用します。

両方のソースはデータを OCSF に正規化するため、フィールド名、型、構造は両方で一貫しています。これにより、どちらのデータストアを対象としているかに関係なく、クエリが直感的で信頼性の高いものになります。

![Architecture Diagram](/img/Athena-Arch-ASL-CW.png "Architecture Diagram")

## 前提条件

クロスカタログクエリを実行する前に、Athena コンソールを使用してカタログパス、データベース、テーブル名を確認してください。このガイドの例では、以下に基づく命名規則を使用しています `us-east-1` デプロイメント。

### Security Lake テーブル

| カタログ | データベース | テーブル例 |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

### CloudWatch 統合データストアテーブル

| カタログ | データベース | テーブル例 |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info リージョン固有の命名
Security Lake データベースとテーブル名には、デプロイメントリージョンが含まれます。このガイドの例では、 `us_east_1` (例: `amazon_security_lake_glue_db_us_east_1`)。Security Lake が別のリージョンで有効になっている場合は、置き換えてください `us_east_1` リージョンの識別子に置き換えます。例： `amazon_security_lake_glue_db_eu_west_1` ~のために `eu-west-1`。テーブル名についても同様です。
:::

:::tip テーブル名の確認
テーブル名は、リージョン、Security Lake の設定、有効にした CloudWatch 統合データストアのデータソースによって異なる場合があります。次のコマンドを実行してテーブル名を確認してください。

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Athena から両方のデータストアをクエリする

CloudWatch 統合データストアに移行した後、Athena は過去および現在のセキュリティデータの両方に対する単一のクエリコンソールになります。Security Lake テーブルは AWS Glue Data Catalog に登録され、CloudWatch 統合データストアテーブルは S3 Tables カタログに登録されます。Athena は両方にアクセスできます。データの移動、エクスポートパイプライン、重複は必要ありません。

以下のセクションでは、3 つのレベルのクエリについて説明します。

1. **Security Lake のクエリ** — 履歴アーカイブに直接アクセスします
2. **CloudWatch 統合データストアのクエリ** — S3 Tables を介して現在のデータにアクセスします
3. **UNION ALL で両方を結合** — 履歴データと最新データを単一の結果セットで並べて表示します

### 構文の概要

特定のカタログからテーブルを参照するための一般的なパターンは次のとおりです。

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## 利用可能なテーブルリファレンス

独自のクエリを構築する際は、これらのテーブルを参照として使用してください。Security Lake と CloudWatch 統合データストアの両方が OCSF 正規化を使用しているため、フィールド名はデータソースタイプ全体で一貫しています。

### Security Lake

| テーブル | OCSF クラス | よく使うクエリフィールド |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`, `query.hostname`, `time_dt` |
| `..._sh_findings_2_0` | Vulnerability / Compliance / Detection Finding | `finding.title`, `cloud.account.uid`, `severity`, `severity_id`, `time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`, `actor.user.name`, `time_dt` |
| `..._lambda_execution_2_0` | API Activity | `api.operation`, `cloud.account.uid`, `time_dt` |

:::note Security Hub OCSF v2 クラス名
OCSF v2 (1.1.0) では、Security Hub CSPM の検出結果は、検出結果のタイプに応じて、複数の OCSF クラス名 (Vulnerability Finding、Compliance Finding、または Detection Finding) にマッピングされます。
:::
:::

### CloudWatch 統合データストア

| テーブル | OCSF クラス | よく使うクエリフィールド |
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

:::tip テーブル名の検出
CloudWatch 統合データストアのテーブル名は、関連付けで設定されたデータソース名とタイプに基づいて生成されます。使用可能なテーブルを検出するには、Athena で次のコマンドを実行します。

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## パート 1 — Security Lake のクエリ (履歴データ)

履歴セキュリティデータは Security Lake に残り、Amazon S3 に保存され、AWS Glue Data Catalog に登録されます。これらのクエリは次に対して実行されます `awsdatacatalog` カタログを作成し、移行前に収集されたものと同じ OCSF 形式のデータにアクセスできます。

### 例 1a — 過去の CloudTrail 管理イベント

Security Lake アーカイブから CloudTrail 管理イベントをクエリします。これは、過去のイベントの調査、履歴 API アクティビティの監査、またはベースラインの確立に役立ちます。

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

### 例 1b — 履歴 VPC Flow Logs

Security Lake アーカイブから VPC Flow Logs をクエリして、過去のネットワークアクティビティを調査します。

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

### 例 1c — 過去の Security Hub 検出結果

Security Lake アーカイブから Security Hub の検出結果をクエリして、過去のセキュリティ体制を確認します。

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

## パート 2 — CloudWatch 統合データストア (最新データ) のクエリ

移行後、新しいセキュリティデータは CloudWatch 統合データストアに流れ込み、Amazon S3 Tables に保存されます。これらのクエリは次に対して実行されます `s3tablescatalog/aws-cloudwatch` 移行後に収集された OCSF 形式のデータをカタログ化してアクセスします。

### 例 2a — 最近の CloudTrail 管理イベント

CloudWatch 統合データストアから最近の CloudTrail 管理イベントをクエリします。Security Lake クエリで使用されているものと同じ OCSF フィールド名がここでも機能します。

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

### 例 2b — 最近の VPC Flow Logs

CloudWatch 統合データストアから最近の VPC Flow Logs をクエリします。

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

### 例 2c — 最近の Security Hub の検出結果

CloudWatch 統合データストアから最近の Security Hub コンプライアンス検出結果をクエリします。

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

:::info CloudWatch 統合データストアにおける Security Hub の検出タイプ
Security Hub の検出は、CloudWatch 統合データストアの複数の OCSF イベントクラスにマッピングされます。検出タイプに応じて、データは次のいずれかのテーブルに格納される場合があります。
:::

| CW UDS テーブル | 検出タイプ |
|---|---|
| `aws_security_hub__compliance_finding` | コンプライアンスチェック結果 |
| `aws_security_hub__detection_finding` | 脅威検出の検出結果 |
| `aws_security_hub__vulnerability_finding` | 脆弱性の検出結果 |
| `aws_security_hub__data_security_finding` | データセキュリティの検出結果 |

実行します。 `SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"` 利用可能なテーブルを検出します。
:::

---

## パート 3 — UNION ALL で両方のデータストアを結合する

各データストアを個別にクエリすることに慣れたら、次を使用して両方の結果を単一のクエリで組み合わせることができます `UNION ALL`これにより、移行境界を越えた統合ビューが得られます。Security Lake からの履歴データと CloudWatch 統合データストアからの最新データが並んで表示されます。

を作成する鍵は `UNION ALL` うまく機能するのは、特定のフィルター (例: 特定の API オペレーション、IP アドレス、または検出結果のタイトル) を使用して、両側が関連性のある比較可能な結果を返すようにすることです。フィルターがない場合、 `LIMIT` 最初に行を返す側で消費されるため、両方のデータストアからの結果が表示されない場合があります。

:::caution UNION ALL を JOIN の代わりに使用する理由
AWS Glue Data Catalog (Security Lake) と S3 Tables カタログ (CloudWatch 統合データストア) 間のクロスカタログ JOIN は、Athena で技術的には可能ですが、パフォーマンスとコストに大きな制限があります。Athena は異なるカタログタイプ間で述語を効率的にプッシュダウンできないため、JOIN が評価される前に両側で大規模なフルテーブルスキャンが発生します。これにより、長時間実行されるクエリとより高いコスト (Athena はスキャンされた TB あたり 5 ドルを請求) が発生します。 `UNION ALL` これを回避するために、各クエリを独自のカタログに対して適切なパーティションプルーニングを使用して独立して実行し、結果を結合することで、より高速なパフォーマンスを低コストで実現します。
:::

:::info 時間ウィンドウのガイダンス
これらの例の WHERE 句は、移行シナリオを反映するために、両方のデータソースに対してハードコードされた日付範囲を使用しています。Security Lake フィルターは、履歴アーカイブを対象とします (例: `TIMESTAMP '2025-01-01'` へ `TIMESTAMP '2025-06-01'`)、一方 CloudWatch 統合データストアフィルターは移行後の期間を対象とします (例: `TIMESTAMP '2025-06-01'` へ `TIMESTAMP '2025-07-01'`)。これらを、移行のタイムラインと保持期間に一致する実際の日付に置き換えてください。
:::

### UNION ALL クエリテンプレート

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

### 例 3a — 両方の期間にわたる AssumeRole アクティビティ

トラック `AssumeRole` マイグレーション境界を越えた呼び出しです。これは、マイグレーションの前後で同じロールが引き受けられているかどうかを調査したり、アクセスパターンの変化を検出したりするのに役立ちます。

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

**このクエリが示す内容:**

- `AssumeRole` 両方の期間のイベントを含み、 `source` データストアを識別する列
- ユーザー ID とソース IP を使用して、移行境界を越えて誰がどこからロールを引き受けているかを追跡します
- ステータスコードを使用して、両方の期間でロールの引き受けが成功しているか失敗しているかを識別します

**このクエリの適応:**

| 目的 | 変更内容 |
|---|---|
| 別の API 呼び出しを調査する | `api.operation = 'AssumeRole'` を `'CreateUser'`、`'PutBucketPolicy'` などの別のオペレーションに変更します。 |
| エラーイベントでフィルタリングする | 両方の SELECT ブロックに `AND status = 'Failure'` を追加します |
| 特定のユーザーに絞り込む | 両方の SELECT ブロックに `AND actor.user.name = '[USERNAME]'` を追加します |

---

### 例 3b — 両方の期間にわたって拒否された VPC フロー

Security Lake (履歴) と CloudWatch 統合データストア (最近) からの拒否されたネットワークフローを比較します。これは、セキュリティグループと NACL ルールが移行前後で一貫した拒否パターンを生成していることを検証するのに役立ちます。

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

**このクエリが示す内容:**

- 両方の期間から拒否されたネットワークフロー。識別方法は `source` カラム
- 拒否されているトラフィックを特定するための、ポート番号を含む送信元および宛先 IP
- 拒否されたトラフィックの量とフローを理解するための、バイト数と方向

**このクエリの適応:**

| 目的 | 変更内容 |
|---|---|
| 特定の宛先ポートでフィルタリングする | 両方の SELECT ブロックに `AND dst_endpoint.port = 443` を追加します |
| 特定の送信元 IP でフィルタリングする | 両方の SELECT ブロックに `AND src_endpoint.ip = '[IP_ADDRESS]'` を追加します |
| 許可されたトラフィックも含める | `AND activity_name = 'Reject'` フィルターを削除するか、`'Accept'` に変更します |

---

### 例 3c — 両方の期間にわたる重要度の高い Security Hub の検出結果

移行境界を越えて重要度の高い Security Hub の検出結果を追跡します。これは、移行前に存在していた重大な検出結果が修復されたかどうか、または新しい重要度の高い検出結果が出現したかどうかを特定するのに役立ちます。

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

**このクエリが示す内容:**

- 両期間からの高重要度の検出結果 (HIGH および CRITICAL) `source` データストアを識別する列
- 移行境界を越えて特定の検出結果を追跡するための検出結果のタイトルと UID
- 検出結果が修正されたか、まだアクティブかを識別するためのステータス
- マルチアカウント環境のアカウントレベルの詳細

**このクエリの適応:**

| 目的 | 変更内容 |
|---|---|
| MEDIUM の重要度を含める | 両方の SELECT ブロックで `severity_id >= 4` を `severity_id >= 3` に変更します |
| 検出結果のステータスでフィルタリングする | 未解決の検出結果を見つけるため、両方の SELECT ブロックに `AND status = 'New'` を追加します |
| 特定のアカウントに絞り込む | 両方の SELECT ブロックに `AND cloud.account.uid = '[ACCOUNT_ID]'` を追加します |
| 脆弱性の検出結果をクエリする | CW UDS テーブルを `aws_security_hub__vulnerability_finding` に置き換えます |

---
