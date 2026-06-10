# Utiliser Athena dans Amazon Managed Grafana

Dans cette recette, nous vous montrons comment utiliser [Amazon Athena][athena] -- un service de requête interactif et serverless vous permettant d'analyser des données dans Amazon S3 en utilisant du SQL standard -- dans [Amazon Managed Grafana][amg]. Cette intégration est rendue possible par la [source de données Athena pour Grafana][athena-ds], un plugin open source disponible pour toute instance Grafana DIY ainsi que pré-installé dans Amazon Managed Grafana.

:::note
    Ce guide prendra environ 20 minutes à compléter.
:::

## Prérequis

* L'[AWS CLI][aws-cli] est installée et [configurée][aws-cli-conf] dans votre environnement.
* Vous avez accès à Amazon Athena depuis votre compte.

## Infrastructure

Configurons d'abord l'infrastructure nécessaire.

### Configurer Amazon Athena

Nous voulons voir comment utiliser Athena dans deux scénarios différents : un scénario autour des données géographiques avec le plugin Geomap, et un dans un scénario lié à la sécurité autour des journaux de flux VPC.

Tout d'abord, assurons-nous qu'Athena est configuré et que les jeux de données sont chargés.

:::warning
    Vous devez utiliser la console Amazon Athena pour exécuter ces requêtes. Grafana
	a en général un accès en lecture seule aux sources de données, et ne peut donc pas être utilisé
	pour créer ou mettre à jour des données.
:::

#### Charger les données géographiques

Dans ce premier cas d'utilisation, nous utilisons un jeu de données du [Registry of Open Data on AWS][awsod]. Plus précisément, nous utiliserons [OpenStreetMap][osm] (OSM) pour démontrer l'utilisation du plugin Athena pour un cas d'utilisation motivé par des données géographiques.
Pour que cela fonctionne, nous devons d'abord importer les données OSM dans Athena.

Commencez par créer une nouvelle base de données dans Athena. Allez dans la [console Athena][athena-console] et utilisez les trois requêtes SQL suivantes pour importer les données OSM dans la base de données.

Requête 1 :

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

Requête 2 :

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

Requête 3 :

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

#### Charger les données de journaux de flux VPC

Le deuxième cas d'utilisation est motivé par la sécurité : analyser le trafic réseau en utilisant les [VPC Flow Logs][vpcflowlogs].

Tout d'abord, nous devons dire à EC2 de générer des journaux de flux VPC pour nous. Donc, si vous ne l'avez pas encore fait, allez maintenant [créer des journaux de flux VPC][createvpcfl] soit au niveau des interfaces réseau, au niveau du sous-réseau, ou au niveau du VPC.

:::note
    Pour améliorer les performances des requêtes et minimiser l'empreinte de stockage, nous stockons
    les journaux de flux VPC en [Parquet][parquet], un format de stockage en colonnes
    qui prend en charge les données imbriquées.
:::

Pour notre configuration, peu importe l'option que vous choisissez (interfaces réseau, sous-réseau ou VPC), tant que vous les publiez dans un bucket S3 au format Parquet comme indiqué ci-dessous :

![Capture d'écran du panneau "Create flow log" de la console EC2](../images/ec2-vpc-flowlogs-creation.png)

Maintenant, à nouveau via la [console Athena][athena-console], créez la table pour les données de journaux de flux VPC dans la même base de données où vous avez importé les données OSM, ou créez-en une nouvelle si vous préférez.

Utilisez la requête SQL suivante et assurez-vous de remplacer `VPC_FLOW_LOGS_LOCATION_IN_S3` par votre propre bucket/dossier :


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

Par exemple, `VPC_FLOW_LOGS_LOCATION_IN_S3` pourrait ressembler à ceci si vous utilisez le bucket S3 `allmyflowlogs` :

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

Maintenant que les jeux de données sont disponibles dans Athena, passons à Grafana.

### Configurer Grafana

Nous avons besoin d'une instance Grafana, alors créez un nouvel [espace de travail Amazon Managed Grafana][amg-workspace], par exemple en utilisant le guide [Getting Started][amg-getting-started], ou utilisez-en un existant.

:::warning
    Pour utiliser la configuration de source de données AWS, allez d'abord dans la
    console Amazon Managed Grafana pour activer les rôles IAM gérés par le service qui accordent à l'espace de travail les
    politiques IAM nécessaires pour lire les ressources Athena.
    De plus, notez les points suivants :

	1. Le workgroup Athena que vous prévoyez d'utiliser doit être étiqueté avec la clé
	`GrafanaDataSource` et la valeur `true` pour que les permissions gérées par le service
	soient autorisées à utiliser le workgroup.
	1. La politique IAM gérée par le service n'accorde l'accès qu'aux buckets de résultats de requêtes
	qui commencent par `grafana-athena-query-results-`, donc pour tout autre bucket
	vous DEVEZ ajouter les permissions manuellement.
	1. Vous devez ajouter les permissions `s3:Get*` et `s3:List*` pour la source de données sous-jacente
	interrogée manuellement.
:::




Pour configurer la source de données Athena, utilisez la barre d'outils de gauche et choisissez l'icône AWS inférieure puis choisissez "Athena". Sélectionnez votre région par défaut pour que le plugin découvre la source de données Athena à utiliser, puis sélectionnez les comptes que vous souhaitez, et enfin choisissez "Add data source".

Alternativement, vous pouvez ajouter et configurer manuellement la source de données Athena en suivant ces étapes :

1. Cliquez sur l'icône "Configurations" dans la barre d'outils de gauche puis sur "Add data source".
1. Recherchez "Athena".
1. [OPTIONNEL] Configurez le fournisseur d'authentification (recommandé : rôle IAM de l'espace de travail).
1. Sélectionnez votre source de données Athena cible, la base de données et le workgroup.
1. Si votre workgroup n'a pas encore d'emplacement de sortie configuré, spécifiez le bucket S3 et le dossier à utiliser pour les résultats de requêtes. Notez que le bucket doit commencer par `grafana-athena-query-results-` si vous souhaitez bénéficier de la politique gérée par le service.
1. Cliquez sur "Save & test".

Vous devriez voir quelque chose comme ceci :

![Capture d'écran de la configuration de la source de données Athena](../images/amg-plugin-athena-ds.png)




## Utilisation

Voyons maintenant comment utiliser nos jeux de données Athena depuis Grafana.

### Utiliser les données géographiques

Les données [OpenStreetMap][osm] (OSM) dans Athena peuvent répondre à un certain nombre de questions, comme "où se trouvent certaines commodités". Voyons cela en action.

Par exemple, une requête SQL contre le jeu de données OSM pour lister les endroits qui offrent de la nourriture dans la région de Las Vegas est la suivante :

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
    La région de Las Vegas dans la requête ci-dessus est définie comme tout ce qui a une latitude
    entre `36.1` et `36.3` ainsi qu'une longitude entre `-115.5` et `-114.5`.
	Vous pourriez transformer cela en un ensemble de variables (une pour chaque coin) et rendre
	le plugin Geomap adaptable à d'autres régions.
:::
Pour visualiser les données OSM en utilisant la requête ci-dessus, vous pouvez importer un tableau de bord exemple, disponible via [osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) qui ressemble à ceci :

![Capture d'écran du tableau de bord OSM dans AMG](../images/amg-osm-dashboard.png)

:::note
    Dans la capture d'écran ci-dessus, nous utilisons la visualisation Geomap (dans le panneau de gauche) pour
    tracer les points de données.
:::
### Utiliser les données de journaux de flux VPC

Pour analyser les données de journaux de flux VPC, en détectant le trafic SSH et RDP, utilisez les requêtes SQL suivantes.

Obtenir un aperçu tabulaire du trafic SSH/RDP :

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

Obtenir une vue en série temporelle des octets acceptés et rejetés :

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
    Si vous souhaitez limiter la quantité de données interrogées dans Athena, envisagez d'utiliser
	la macro `$__timeFilter`.
:::

Pour visualiser les données de journaux de flux VPC, vous pouvez importer un tableau de bord exemple, disponible via [vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) qui ressemble à ceci :

![Capture d'écran du tableau de bord des journaux de flux VPC dans AMG](../images/amg-vpcfl-dashboard.png)

À partir de là, vous pouvez utiliser les guides suivants pour créer votre propre tableau de bord dans Amazon Managed Grafana :

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Best practices for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

Voilà, félicitations, vous avez appris à utiliser Athena depuis Grafana !

## Nettoyage

Supprimez les données OSM de la base de données Athena que vous avez utilisée puis l'espace de travail Amazon Managed Grafana en le supprimant depuis la console.

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
