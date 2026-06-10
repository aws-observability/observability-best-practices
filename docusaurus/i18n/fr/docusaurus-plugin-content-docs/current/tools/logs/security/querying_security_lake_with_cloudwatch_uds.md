---
sidebar_position: 1
---

# Interroger les donnees historiques de Security Lake avec Amazon CloudWatch Logs via Athena

## Apercu

Lorsque vous migrez votre gestion des journaux de securite vers [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/), vous obtenez une destination moderne et unifiee pour la telemetrie operationnelle et de securite a partir de ce moment. Mais vos donnees de securite historiques — les evenements AWS CloudTrail, les journaux de flux Amazon Virtual Private Cloud (Amazon VPC), les resultats AWS Security Hub et autres enregistrements accumules dans [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) avant la migration — ne disparaissent pas. Elles restent exactement la ou elles sont, deja stockees et partitionnees dans la structure Amazon S3 de Security Lake.

Ce guide montre comment utiliser **Amazon Athena** comme console de requete unique pour vos donnees historiques de Security Lake et vos nouveaux journaux CloudWatch unified data store — sans exporter, copier ou dupliquer de donnees. Vous pouvez interroger chaque magasin de donnees independamment, ou combiner les resultats des deux en utilisant `UNION ALL` pour une visibilite inter-plateformes.

> Les **nouveaux** evenements de journalisation sont achemines vers CloudWatch unified data store comme plateforme principale.
> Les evenements **historiques** restent dans Security Lake.
> **Athena** interroge les deux depuis une console unique.

![Phases de migration](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake vers Amazon CloudWatch")

| Phase | Ce qui se passe |
|---|---|
| **Phase 1 — Security Lake** | Les journaux de flux VPC et autres sources de donnees de securite ecrivent exclusivement dans Security Lake, constituant une archive historique d'enregistrements au format OCSF stockes dans Amazon S3 et interrogeables via AWS Glue Data Catalog. |
| **Phase 2 — Double ingestion Security Lake et CloudWatch** | Security Lake et CloudWatch recoivent simultanement les donnees. Cette periode de validation est recommandee pour un minimum de 24 heures, donnant aux equipes le temps de verifier l'ingestion et la coherence des journaux sur les deux plateformes avant de migrer completement vers CloudWatch. Si votre validation necessite plus de temps, evaluez les couts potentiels de l'execution des deux services en parallele. |
| **Phase 3 — CloudWatch uniquement** | Les sources de donnees ecrivent exclusivement dans CloudWatch. Toutes les donnees historiques de Security Lake restent preservees et accessibles — et Athena vous permet d'interroger les deux magasins de donnees depuis une seule console, independamment ou en combinant les resultats avec `UNION ALL`. |

Security Lake et Amazon CloudWatch unified data store normalisent leurs donnees selon le [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/), ce qui signifie que les noms de champs comme `src_endpoint.ip`, `api.operation` et `actor.user.name` sont coherents entre les deux sources. Cette coherence rend les requetes inter-sources simples — les memes references de champs fonctionnent que vous interrogiez l'historique de Security Lake ou les donnees recentes de CloudWatch unified data store.

---

## Pourquoi interroger sur place au lieu d'exporter ?

Les requetes inter-catalogues d'Athena vous permettent d'acceder aux donnees historiques de Security Lake directement sans avoir besoin d'exporter les donnees. Voici quelques avantages qui font de l'interrogation sur place l'approche la plus efficace.

| Avantage | Details |
|---|---|
| **Pas de frais de stockage en double** | Vos donnees historiques sont deja dans le stockage Amazon S3 de Security Lake. Les exporter dans CloudWatch Logs signifie payer pour stocker les memes donnees deux fois. Les interroger sur place signifie que vous ne payez que pour ce que vous avez deja. |
| **Pas de pipelines ETL a construire ou maintenir** | L'exportation de donnees necessite un pipeline : quelque chose pour lire depuis Security Lake, transformer ou reformater les enregistrements, et les ecrire dans CloudWatch Logs. Ce pipeline doit etre construit, teste, surveille et maintenu. Les requetes inter-catalogues d'Athena eliminent le besoin d'un pipeline separe. |
| **Les donnees historiques restent organisees** | Security Lake stocke et partitionne les donnees par compte, region et date — une structure bien adaptee a l'analyse historique. Deplacer ces donnees dans CloudWatch Logs perturbe cette organisation et peut necessiter un repartitionnement ou une reindexation. |
| **Les nouvelles donnees circulent naturellement** | Une fois la migration effectuee, CloudWatch devient votre destination principale pour les nouveaux evenements de journalisation. Pas besoin d'executer les deux pipelines simultanement ou de maintenir une couche de routage complexe. |
| **Athena fait le pont entre les deux efficacement** | Security Lake enregistre ses tables dans le [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html) par defaut (`AwsDataCatalog`). CloudWatch utilise un catalogue Amazon S3 Tables (`s3tablescatalog/aws-cloudwatch`). Athena peut referencer les deux dans une seule requete SQL en utilisant des chemins de catalogue complets — aucun deplacement de donnees requis. |

:::tip Resultat
Vous conservez un acces complet a vos donnees historiques de Security Lake pour l'investigation d'evenements, la chasse aux menaces et les audits de conformite — tandis que vos nouvelles donnees CloudWatch unified data store arrivent comme source principale pour la surveillance continue.
:::

---

## Comment ca fonctionne

Comprendre comment les deux magasins de donnees s'articulent rend les requetes plus faciles a raisonner.

### Architecture

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch unified data store** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena prend en charge l'interrogation de plusieurs catalogues Glue dans une seule instruction SQL. En referencant chaque source avec son chemin de catalogue complet, vous pouvez interroger Security Lake et CloudWatch unified data store independamment depuis la meme console Athena — ou combiner les resultats avec `UNION ALL` lorsque vous avez besoin d'une vue unifiee.

Les deux sources normalisent leurs donnees selon OCSF, donc les noms de champs, types et structures sont coherents entre les deux — rendant les requetes intuitives et fiables quel que soit le magasin de donnees cible.

![Diagramme d'architecture](/img/Athena-Arch-ASL-CW.png "Diagramme d'architecture")

## Prerequis

Avant d'executer des requetes inter-catalogues, confirmez vos chemins de catalogue, bases de donnees et noms de tables en utilisant la console Athena. Les exemples de ce guide utilisent les conventions de nommage suivantes basees sur un deploiement en `us-east-1`.

### Tables Security Lake

| Catalogue | Base de donnees | Exemples de tables |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

### Tables CloudWatch Unified Data Store

| Catalogue | Base de donnees | Exemples de tables |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info Nommage specifique a la region
Les noms de base de donnees et de tables de Security Lake incluent votre region de deploiement. Les exemples de ce guide utilisent `us_east_1` (par exemple, `amazon_security_lake_glue_db_us_east_1`). Si Security Lake est active dans une region differente, remplacez `us_east_1` par l'identifiant de votre region — par exemple, `amazon_security_lake_glue_db_eu_west_1` pour `eu-west-1`. La meme regle s'applique aux noms de tables.
:::

:::tip Decouvrir vos noms de tables
Vos noms de tables peuvent varier selon votre region, la configuration de Security Lake et les sources de donnees CloudWatch unified data store que vous avez activees. Verifiez vos noms de tables en executant :

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Interroger les deux magasins de donnees depuis Athena

Apres la migration vers CloudWatch unified data store, Athena devient votre console de requete unique pour les donnees de securite historiques et actuelles. Les tables Security Lake sont enregistrees dans le AWS Glue Data Catalog, et les tables CloudWatch unified data store sont enregistrees dans un catalogue S3 Tables. Athena peut acceder aux deux — pas de deplacement de donnees, pas de pipelines d'exportation, pas de duplication.

Les sections ci-dessous presentent trois niveaux d'interrogation :

1. **Interroger Security Lake** — acceder directement a votre archive historique
2. **Interroger CloudWatch unified data store** — acceder a vos donnees actuelles via S3 Tables
3. **Combiner les deux avec UNION ALL** — visualiser les donnees historiques et recentes cote a cote dans un seul jeu de resultats

### Apercu de la syntaxe

Le modele general pour referencer une table d'un catalogue specifique :

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## Reference des tables disponibles

Utilisez ces tables comme reference lors de la construction de vos propres requetes. Security Lake et CloudWatch unified data store utilisent tous deux la normalisation OCSF, donc les noms de champs sont coherents entre les types de sources de donnees.

### Security Lake

| Table | Classe OCSF | Champs de requete courants |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`, `query.hostname`, `time_dt` |
| `..._sh_findings_2_0` | Vulnerability / Compliance / Detection Finding | `finding.title`, `cloud.account.uid`, `severity`, `severity_id`, `time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`, `actor.user.name`, `time_dt` |
| `..._lambda_execution_2_0` | API Activity | `api.operation`, `cloud.account.uid`, `time_dt` |

:::note Noms de classes OCSF v2 pour Security Hub
Dans OCSF v2 (1.1.0), les resultats CSPM de Security Hub correspondent a plusieurs noms de classes OCSF — Vulnerability Finding, Compliance Finding ou Detection Finding — selon le type de resultat.
:::

### CloudWatch Unified Data Store

| Table | Classe OCSF | Champs de requete courants |
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

:::tip Decouverte des noms de tables
Les noms de tables CloudWatch unified data store sont generes en fonction du nom et du type de source de donnees configures dans votre association. Executez ce qui suit dans Athena pour decouvrir vos tables disponibles :

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Partie 1 — Interroger Security Lake (donnees historiques)

Vos donnees de securite historiques restent dans Security Lake, stockees dans Amazon S3 et enregistrees dans le AWS Glue Data Catalog. Ces requetes s'executent sur le catalogue `awsdatacatalog` et accedent aux memes donnees au format OCSF collectees avant votre migration.

### Exemple 1a — Evenements historiques de gestion CloudTrail

Interrogez les evenements de gestion CloudTrail depuis votre archive Security Lake. Ceci est utile pour enqueter sur des evenements passes, auditer l'activite API historique ou etablir des references.

<details>
<summary>Voir la requete SQL</summary>

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

### Exemple 1b — Journaux de flux VPC historiques

Interrogez les journaux de flux VPC depuis votre archive Security Lake pour enqueter sur l'activite reseau historique.

<details>
<summary>Voir la requete SQL</summary>

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

### Exemple 1c — Resultats historiques de Security Hub

Interrogez les resultats de Security Hub depuis votre archive Security Lake pour examiner votre posture de securite historique.

<details>
<summary>Voir la requete SQL</summary>

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

## Partie 2 — Interroger CloudWatch Unified Data Store (donnees recentes)

Apres la migration, vos nouvelles donnees de securite sont acheminees vers CloudWatch unified data store et stockees dans Amazon S3 Tables. Ces requetes s'executent sur le catalogue `s3tablescatalog/aws-cloudwatch` et accedent aux donnees au format OCSF collectees apres votre migration.

### Exemple 2a — Evenements recents de gestion CloudTrail

Interrogez les evenements recents de gestion CloudTrail depuis CloudWatch unified data store. Les memes noms de champs OCSF utilises dans les requetes Security Lake fonctionnent ici.

<details>
<summary>Voir la requete SQL</summary>

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

### Exemple 2b — Journaux de flux VPC recents

Interrogez les journaux de flux VPC recents depuis CloudWatch unified data store.

<details>
<summary>Voir la requete SQL</summary>

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

### Exemple 2c — Resultats recents de Security Hub

Interrogez les resultats recents de conformite Security Hub depuis CloudWatch unified data store.

<details>
<summary>Voir la requete SQL</summary>

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

:::info Types de resultats Security Hub dans CloudWatch Unified Data Store
Les resultats Security Hub correspondent a plusieurs classes d'evenements OCSF dans CloudWatch unified data store. Selon le type de resultat, vos donnees peuvent se trouver dans l'une de ces tables :

| Table CW UDS | Type de resultat |
|---|---|
| `aws_security_hub__compliance_finding` | Resultats de verification de conformite |
| `aws_security_hub__detection_finding` | Resultats de detection de menaces |
| `aws_security_hub__vulnerability_finding` | Resultats de vulnerabilites |
| `aws_security_hub__data_security_finding` | Resultats de securite des donnees |

Executez `SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"` pour decouvrir vos tables disponibles.
:::

---

## Partie 3 — Combiner les deux magasins de donnees avec UNION ALL

Une fois que vous etes a l'aise pour interroger chaque magasin de donnees independamment, vous pouvez combiner les resultats des deux dans une seule requete en utilisant `UNION ALL`. Cela vous donne une vue unifiee a travers la frontiere de migration — donnees historiques de Security Lake et donnees recentes de CloudWatch unified data store, cote a cote.

La cle pour que `UNION ALL` fonctionne bien est d'utiliser des filtres specifiques (par exemple, une operation API particuliere, une adresse IP ou un titre de resultat) afin que les deux cotes retournent des resultats pertinents et comparables. Sans filtres, le `LIMIT` sera consomme par le cote qui retourne des lignes en premier, et vous risquez de ne pas voir de resultats des deux magasins de donnees.

:::caution Pourquoi UNION ALL au lieu de JOIN ?
Les JOINs inter-catalogues entre le AWS Glue Data Catalog (Security Lake) et le catalogue S3 Tables (CloudWatch unified data store) sont techniquement possibles dans Athena, mais ils ont des limitations significatives de performance et de cout. Athena ne peut pas pousser efficacement les predicats a travers differents types de catalogues, ce qui resulte en de grands scans de tables completes des deux cotes avant que la jointure ne soit evaluee. Cela conduit a des requetes longues et des couts plus eleves (Athena facture 5 $ par To scanne). Utiliser `UNION ALL` evite cela en executant chaque requete independamment sur son propre catalogue avec un elagage de partition approprie, puis en combinant les resultats — offrant de meilleures performances a un cout moindre.
:::

:::info Recommandations sur les fenetres temporelles
Les clauses WHERE de ces exemples utilisent des plages de dates codees en dur pour les deux sources de donnees afin de refleter le scenario de migration. Les filtres Security Lake ciblent votre archive historique (par exemple, `TIMESTAMP '2025-01-01'` a `TIMESTAMP '2025-06-01'`), tandis que les filtres CloudWatch unified data store ciblent la periode apres la migration (par exemple, `TIMESTAMP '2025-06-01'` a `TIMESTAMP '2025-07-01'`). Remplacez-les par les dates reelles correspondant a votre calendrier de migration et vos periodes de retention.
:::

### Modele de requete UNION ALL

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

### Exemple 3a — Activite AssumeRole sur les deux periodes

Suivez les appels `AssumeRole` a travers la frontiere de migration. Ceci est utile pour verifier si les memes roles sont assumes avant et apres la migration, ou pour detecter des changements dans les modeles d'acces.

<details>
<summary>Voir la requete SQL</summary>

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

**Ce que cette requete montre :**

- Les evenements `AssumeRole` des deux periodes, avec la colonne `source` identifiant le magasin de donnees
- L'identite de l'utilisateur et l'IP source pour suivre qui assume des roles et depuis ou, a travers la frontiere de migration
- Les codes de statut pour identifier si les assumptions de roles reussissent ou echouent dans les deux periodes

**Adapter cette requete :**

| Objectif | Modification |
|---|---|
| Rechercher d'autres appels API | Changez `api.operation = 'AssumeRole'` pour une autre operation comme `'CreateUser'`, `'PutBucketPolicy'`, etc. |
| Filtrer par evenements d'erreur | Ajoutez `AND status = 'Failure'` aux deux blocs SELECT |
| Se limiter a un utilisateur specifique | Ajoutez `AND actor.user.name = '[USERNAME]'` aux deux blocs SELECT |

---

### Exemple 3b — Flux VPC rejetes sur les deux periodes

Comparez les flux reseau rejetes de Security Lake (historiques) et CloudWatch unified data store (recents). Ceci est utile pour valider que les regles des groupes de securite et NACL produisent des modeles de refus coherents avant et apres la migration.

<details>
<summary>Voir la requete SQL</summary>

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

**Ce que cette requete montre :**

- Les flux reseau rejetes des deux periodes, identifies par la colonne `source`
- Les IP source et destination avec les numeros de port pour identifier quel trafic est refuse
- Les compteurs d'octets et la direction pour comprendre le volume et le flux du trafic rejete

**Adapter cette requete :**

| Objectif | Modification |
|---|---|
| Filtrer par port de destination specifique | Ajoutez `AND dst_endpoint.port = 443` aux deux blocs SELECT |
| Filtrer par IP source specifique | Ajoutez `AND src_endpoint.ip = '[IP_ADDRESS]'` aux deux blocs SELECT |
| Inclure aussi le trafic accepte | Supprimez le filtre `AND activity_name = 'Reject'`, ou changez pour `'Accept'` |

---

### Exemple 3c — Resultats Security Hub de haute severite sur les deux periodes

Suivez les resultats de haute severite de Security Hub a travers la frontiere de migration. Ceci est utile pour identifier si les resultats critiques qui existaient avant la migration ont ete remedies, ou si de nouveaux resultats de haute severite sont apparus.

<details>
<summary>Voir la requete SQL</summary>

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

**Ce que cette requete montre :**

- Les resultats de haute severite (HIGH et CRITICAL) des deux periodes, avec la colonne `source` identifiant le magasin de donnees
- Les titres et UID des resultats pour suivre des resultats specifiques a travers la frontiere de migration
- Le statut pour identifier si les resultats ont ete remedies ou sont encore actifs
- Le detail au niveau du compte pour les environnements multi-comptes

**Adapter cette requete :**

| Objectif | Modification |
|---|---|
| Inclure la severite MEDIUM | Changez `severity_id >= 4` en `severity_id >= 3` dans les deux blocs SELECT |
| Filtrer par statut de resultat | Ajoutez `AND status = 'New'` aux deux blocs SELECT pour trouver les resultats non resolus |
| Se concentrer sur un compte specifique | Ajoutez `AND cloud.account.uid = '[ACCOUNT_ID]'` aux deux blocs SELECT |
| Interroger les resultats de vulnerabilites | Remplacez la table CW UDS par `aws_security_hub__vulnerability_finding` |

---
