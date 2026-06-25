# Amazon Managed Grafana-வில் Athena பயன்படுத்துதல்

இந்த ரெசிபியில் [Amazon Athena][athena]--Amazon S3-ல் உள்ள தரவை standard SQL பயன்படுத்தி பகுப்பாய்வு செய்ய உதவும் serverless, interactive query service--ஐ [Amazon Managed Grafana][amg]-வில் எவ்வாறு பயன்படுத்துவது என்பதைக் காட்டுகிறோம். இந்த ஒருங்கிணைப்பு [Athena data source for Grafana][athena-ds] மூலம் இயக்கப்படுகிறது, இது எந்த DIY Grafana instance-லும் பயன்படுத்தக் கிடைக்கும் open source plugin ஆகும், மேலும் Amazon Managed Grafana-வில் முன்-நிறுவப்பட்டுள்ளது.

:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 20 நிமிடங்கள் ஆகும்.
:::

## முன்நிபந்தனைகள்

* [AWS CLI][aws-cli] நிறுவப்பட்டு உங்கள் சூழலில் [கட்டமைக்கப்பட்டிருக்க][aws-cli-conf] வேண்டும்.
* உங்கள் கணக்கிலிருந்து Amazon Athena-க்கு அணுகல் இருக்க வேண்டும்.

## உள்கட்டமைப்பு

முதலில் தேவையான உள்கட்டமைப்பை அமைப்போம்.

### Amazon Athena அமைத்தல்

Athena-ஐ இரண்டு வெவ்வேறு சூழ்நிலைகளில் எவ்வாறு பயன்படுத்துவது என்பதைப் பார்க்க விரும்புகிறோம்: Geomap plugin-உடன் புவியியல் தரவு தொடர்பான ஒரு சூழ்நிலை, மற்றும் VPC flow logs சுற்றிய பாதுகாப்பு தொடர்பான ஒரு சூழ்நிலை.

முதலில், Athena அமைக்கப்பட்டு datasets ஏற்றப்பட்டுள்ளன என்பதை உறுதி செய்வோம்.

:::warning
    இந்த queries-ஐ இயக்க Amazon Athena console-ஐ பயன்படுத்த வேண்டும். Grafana பொதுவாக data sources-க்கு read-only அணுகலைக் கொண்டுள்ளது, எனவே தரவை உருவாக்க அல்லது புதுப்பிக்கப் பயன்படுத்த முடியாது.
:::

#### புவியியல் தரவை ஏற்றுதல்

இந்த முதல் use case-ல் [Registry of Open Data on AWS][awsod]-இலிருந்து ஒரு dataset பயன்படுத்துகிறோம். குறிப்பாக, புவியியல் தரவு motivated use case-க்கு Athena plugin-இன் பயன்பாட்டை நிரூபிக்க [OpenStreetMap][osm] (OSM)-ஐ பயன்படுத்துவோம். இது வேலை செய்ய, முதலில் OSM தரவை Athena-க்கு கொண்டு வர வேண்டும்.

முதலில், Athena-வில் புதிய database உருவாக்கவும். [Athena console][athena-console]-க்குச் சென்று OSM தரவை database-க்கு இறக்குமதி செய்ய பின்வரும் மூன்று SQL queries-ஐ பயன்படுத்தவும்.

Query 1:

```sql
CREATE EXTERNAL TABLE planet (
  id BIGINT,
  type STRING,
  tags MAP<STRING,STRING>,
  lat DECIMAL(9,7),
  lon DECIMAL(10,7),
  nds ARRAY<STRUCT<ref: BIGINT>>,
  members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
  changeset BIGINT,
  timestamp TIMESTAMP,
  uid BIGINT,
  user STRING,
  version BIGINT
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet/';
```

Query 2:

```sql
CREATE EXTERNAL TABLE planet_history (
    id BIGINT,
    type STRING,
    tags MAP<STRING,STRING>,
    lat DECIMAL(9,7),
    lon DECIMAL(10,7),
    nds ARRAY<STRUCT<ref: BIGINT>>,
    members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
    changeset BIGINT,
    timestamp TIMESTAMP,
    uid BIGINT,
    user STRING,
    version BIGINT,
    visible BOOLEAN
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet-history/';
```

Query 3:

```sql
CREATE EXTERNAL TABLE changesets (
    id BIGINT,
    tags MAP<STRING,STRING>,
    created_at TIMESTAMP,
    open BOOLEAN,
    closed_at TIMESTAMP,
    comments_count BIGINT,
    min_lat DECIMAL(9,7),
    max_lat DECIMAL(9,7),
    min_lon DECIMAL(10,7),
    max_lon DECIMAL(10,7),
    num_changes BIGINT,
    uid BIGINT,
    user STRING
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/changesets/';
```

#### VPC flow logs தரவை ஏற்றுதல்

இரண்டாவது use case பாதுகாப்பு தொடர்பானது: [VPC Flow Logs][vpcflowlogs] பயன்படுத்தி நெட்வொர்க் டிராஃபிக்கை பகுப்பாய்வு செய்தல்.

முதலில், EC2-க்கு VPC Flow Logs உருவாக்கச் சொல்ல வேண்டும். நீங்கள் ஏற்கனவே செய்யவில்லை என்றால், network interfaces level, subnet level அல்லது VPC level-ல் [VPC flow logs உருவாக்கவும்][createvpcfl].

:::note
    Query செயல்திறனை மேம்படுத்தவும் storage footprint-ஐ குறைக்கவும், VPC flow logs-ஐ [Parquet][parquet]-ல் சேமிக்கிறோம், இது nested data-ஐ ஆதரிக்கும் columnar storage format ஆகும்.
:::

நமது அமைப்பிற்கு நீங்கள் எந்த விருப்பத்தைத் தேர்ந்தெடுத்தாலும் (network interfaces, subnet அல்லது VPC), கீழே காட்டப்பட்டுள்ளது போல் Parquet format-ல் S3 bucket-க்கு publish செய்யும் வரை முக்கியமல்ல:

![EC2 console "Create flow log" panel-இன் screenshot](../images/ec2-vpc-flowlogs-creation.png)

இப்போது, [Athena console][athena-console] வழியாக, OSM தரவை இறக்குமதி செய்த அதே database-ல் VPC flow logs தரவுக்கான table-ஐ உருவாக்கவும், அல்லது விரும்பினால் புதிய ஒன்றை உருவாக்கவும்.

பின்வரும் SQL query-ஐ பயன்படுத்தவும், `VPC_FLOW_LOGS_LOCATION_IN_S3`-ஐ உங்கள் சொந்த bucket/folder-உடன் மாற்றவும்:


```sql
CREATE EXTERNAL TABLE vpclogs (
  `version` int, 
  `account_id` string, 
  `interface_id` string, 
  `srcaddr` string, 
  `dstaddr` string, 
  `srcport` int, 
  `dstport` int, 
  `protocol` bigint, 
  `packets` bigint, 
  `bytes` bigint, 
  `start` bigint, 
  `end` bigint, 
  `action` string, 
  `log_status` string, 
  `vpc_id` string, 
  `subnet_id` string, 
  `instance_id` string, 
  `tcp_flags` int, 
  `type` string, 
  `pkt_srcaddr` string, 
  `pkt_dstaddr` string, 
  `region` string, 
  `az_id` string, 
  `sublocation_type` string, 
  `sublocation_id` string, 
  `pkt_src_aws_service` string, 
  `pkt_dst_aws_service` string, 
  `flow_direction` string, 
  `traffic_path` int
)
STORED AS PARQUET
LOCATION 'VPC_FLOW_LOGS_LOCATION_IN_S3'
```

உதாரணமாக, `allmyflowlogs` என்ற S3 bucket பயன்படுத்தினால் `VPC_FLOW_LOGS_LOCATION_IN_S3` பின்வருமாறு இருக்கலாம்:

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

இப்போது datasets Athena-வில் கிடைக்கின்றன, Grafana-க்குச் செல்வோம்.

### Grafana அமைத்தல்

எமக்கு ஒரு Grafana instance தேவை, எனவே புதிய [Amazon Managed Grafana workspace][amg-workspace] அமைக்கவும், உதாரணமாக [தொடங்குதல்][amg-getting-started] வழிகாட்டியைப் பயன்படுத்தி, அல்லது ஏற்கனவே உள்ள ஒன்றைப் பயன்படுத்தவும்.

:::warning
    AWS data source configuration பயன்படுத்த, முதலில் Amazon Managed Grafana console-க்குச் சென்று Athena resources-ஐ படிக்க workspace-க்கு IAM policies வழங்கும் service-managed IAM roles-ஐ இயக்கவும்.
    மேலும், பின்வருவனவற்றைக் கவனிக்கவும்:

	1. நீங்கள் பயன்படுத்த திட்டமிடும் Athena workgroup-க்கு service managed permissions அனுமதிக்கப்பட `GrafanaDataSource` key மற்றும் `true` value-உடன் tag செய்யப்பட்டிருக்க வேண்டும்.
	1. Service-managed IAM policy `grafana-athena-query-results-` என்று தொடங்கும் query result buckets-க்கு மட்டுமே அணுகல் வழங்குகிறது, எனவே வேறு எந்த bucket-க்கும் அனுமதிகளை கைமுறையாக சேர்க்க வேண்டும்.
	1. Query செய்யப்படும் underlying data source-க்கு `s3:Get*` மற்றும் `s3:List*` அனுமதிகளை கைமுறையாக சேர்க்க வேண்டும்.
:::




Athena data source அமைக்க, இடது பக்க toolbar-ஐ பயன்படுத்தி கீழே உள்ள AWS icon-ஐ தேர்ந்தெடுத்து "Athena"-ஐ தேர்வு செய்யவும். Athena data source-ஐ கண்டறிய plugin-க்கு உங்கள் default region-ஐ தேர்ந்தெடுத்து, நீங்கள் விரும்பும் accounts-ஐ தேர்ந்தெடுத்து, இறுதியாக "Add data source"-ஐ தேர்வு செய்யவும்.

மாற்றாக, பின்வரும் படிகளைப் பின்பற்றி Athena data source-ஐ கைமுறையாக சேர்த்து கட்டமைக்கலாம்:

1. இடது பக்க toolbar-ல் "Configurations" icon-ஐ கிளிக் செய்து "Add data source"-ஐ கிளிக் செய்யவும்.
1. "Athena"-ஐ தேடவும்.
1. [OPTIONAL] Authentication provider-ஐ கட்டமைக்கவும் (பரிந்துரை: workspace IAM role).
1. உங்கள் target Athena data source, database மற்றும் workgroup-ஐ தேர்ந்தெடுக்கவும்.
1. உங்கள் workgroup-க்கு output location கட்டமைக்கப்படவில்லை என்றால், query results-க்கு பயன்படுத்த S3 bucket மற்றும் folder-ஐ குறிப்பிடவும். Service-managed policy-யின் பலனைப் பெற bucket `grafana-athena-query-results-` என்று தொடங்க வேண்டும்.
1. "Save & test"-ஐ கிளிக் செய்யவும்.

பின்வருவது போன்ற ஒன்றைக் காண வேண்டும்:

![Athena data source config-இன் screenshot](../images/amg-plugin-athena-ds.png)




## பயன்பாடு

இப்போது Grafana-விலிருந்து நமது Athena datasets-ஐ எவ்வாறு பயன்படுத்துவது என்பதைப் பார்ப்போம்.

### புவியியல் தரவைப் பயன்படுத்துதல்

Athena-வில் உள்ள [OpenStreetMap][osm] (OSM) தரவு பல கேள்விகளுக்கு பதிலளிக்கும், உதாரணமாக "குறிப்பிட்ட வசதிகள் எங்கே உள்ளன". இதை செயலில் பார்ப்போம்.

உதாரணமாக, Las Vegas பகுதியில் உணவு வழங்கும் இடங்களை பட்டியலிட OSM dataset-க்கு எதிரான SQL query பின்வருமாறு:

```sql
SELECT 
tags['amenity'] AS amenity,
tags['name'] AS name,
tags['website'] AS website,
lat, lon
FROM planet
WHERE type = 'node'
  AND tags['amenity'] IN ('bar', 'pub', 'fast_food', 'restaurant')
  AND lon BETWEEN -115.5 AND -114.5
  AND lat BETWEEN 36.1 AND 36.3
LIMIT 500;
```

:::info
    மேலே உள்ள query-ல் Las Vegas பகுதி latitude `36.1` மற்றும் `36.3` இடையே மற்றும் longitude `-115.5` மற்றும் `-114.5` இடையே உள்ள அனைத்தாகவும் வரையறுக்கப்பட்டுள்ளது.
	ஒவ்வொரு மூலைக்கும் variables set-ஆக மாற்றி Geomap plugin-ஐ மற்ற regions-க்கு பொருந்தும்படி செய்யலாம்.
:::
மேலே உள்ள query பயன்படுத்தி OSM தரவை காட்சிப்படுத்த, [osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) வழியாக கிடைக்கும் எடுத்துக்காட்டு டாஷ்போர்டை இறக்குமதி செய்யலாம், இது பின்வருமாறு தோன்றும்:

![AMG-யில் OSM dashboard-இன் screenshot](../images/amg-osm-dashboard.png)

:::note
    மேலே உள்ள screenshot-ல் data points-ஐ plot செய்ய Geomap visualization-ஐ (இடது panel-ல்) பயன்படுத்துகிறோம்.
:::
### VPC flow logs தரவைப் பயன்படுத்துதல்

VPC flow log தரவை பகுப்பாய்வு செய்ய, SSH மற்றும் RDP traffic-ஐ கண்டறிய, பின்வரும் SQL queries-ஐ பயன்படுத்தவும்.

SSH/RDP traffic-இன் tabular overview பெறுதல்:

```sql
SELECT
srcaddr, dstaddr, account_id, action, protocol, bytes, log_status
FROM vpclogs
WHERE
srcport in (22, 3389)
OR
dstport IN (22, 3389)
ORDER BY start ASC;
```

ஏற்றுக்கொள்ளப்பட்ட மற்றும் நிராகரிக்கப்பட்ட bytes-இன் time series view பெறுதல்:

```sql
SELECT
from_unixtime(start), sum(bytes), action
FROM vpclogs
WHERE
srcport in (22,3389)
OR
dstport IN (22, 3389)
GROUP BY start, action
ORDER BY start ASC;
```

:::tip
    Athena-வில் query செய்யப்படும் தரவின் அளவை கட்டுப்படுத்த விரும்பினால், `$__timeFilter` macro-ஐ பயன்படுத்துவதை பரிசீலிக்கவும்.
:::

VPC flow log தரவை காட்சிப்படுத்த, [vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) வழியாக கிடைக்கும் எடுத்துக்காட்டு டாஷ்போர்டை இறக்குமதி செய்யலாம், இது பின்வருமாறு தோன்றும்:

![AMG-யில் VPC flow logs dashboard-இன் screenshot](../images/amg-vpcfl-dashboard.png)

இங்கிருந்து, Amazon Managed Grafana-வில் உங்கள் சொந்த டாஷ்போர்டை உருவாக்க பின்வரும் வழிகாட்டிகளைப் பயன்படுத்தவும்:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [டாஷ்போர்டுகள் உருவாக்குவதற்கான சிறந்த நடைமுறைகள்](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

அவ்வளவுதான், வாழ்த்துக்கள்! Grafana-விலிருந்து Athena-ஐ எவ்வாறு பயன்படுத்துவது என்பதை கற்றுக்கொண்டீர்கள்!

## சுத்தம் செய்தல்

நீங்கள் பயன்படுத்திய Athena database-இலிருந்து OSM தரவை நீக்கி, பின்னர் Amazon Managed Grafana workspace-ஐ console-இலிருந்து நீக்கவும்.

[athena]: https://aws.amazon.com/athena/
[amg]: https://aws.amazon.com/grafana/
[athena-ds]: https://grafana.com/grafana/plugins/grafana-athena-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[awsod]: https://registry.opendata.aws/
[osm]: https://aws.amazon.com/blogs/big-data/querying-openstreetmap-with-amazon-athena/
[vpcflowlogs]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
[createvpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-create-flow-log
[athena-console]: https://console.aws.amazon.com/athena/
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
[parquet]: https://github.com/apache/parquet-format
