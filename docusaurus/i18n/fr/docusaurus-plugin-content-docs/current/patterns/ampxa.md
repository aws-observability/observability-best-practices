# Scraping multi-comptes Amazon Managed Prometheus

Amazon Managed Service for Prometheus fournit un scraper, ou collecteur, entièrement géré et sans agent qui découvre et récupère automatiquement les métriques compatibles Prometheus. Vous n'avez pas besoin de gérer, installer, patcher ou maintenir des agents ou des scrapers. Un collecteur Amazon Managed Service for Prometheus offre une collecte de métriques fiable, stable, hautement disponible et automatiquement mise à l'échelle pour votre cluster Amazon EKS. Les collecteurs gérés Amazon Managed Service for Prometheus fonctionnent avec les clusters Amazon EKS, y compris EC2 et Fargate.

Un collecteur Amazon Managed Service for Prometheus crée une Elastic Network Interface (ENI) par sous-réseau spécifié lors de la création du scraper. Le collecteur scrape les métriques via ces ENI et utilise remote_write pour envoyer les données à votre workspace Amazon Managed Service for Prometheus en utilisant un endpoint VPC. Les données scrapées ne transitent jamais sur l'internet public.

Pour créer un scraper dans une configuration multi-comptes lorsque votre cluster Amazon EKS à partir duquel vous souhaitez collecter des métriques se trouve dans un compte différent (compte source) du workspace Amazon Managed Service for Prometheus (compte cible), utilisez la procédure ci-dessous.

## Architecture de haut niveau

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*Figure 1 : Scraping multi-comptes avec le collecteur géré AMP, l'infrastructure du collecteur est entièrement gérée par AWS*

Dans cette architecture, nous créons des scrapers dans le compte où la charge de travail EKS existe. Les scrapers peuvent assumer un rôle dans le compte cible afin d'envoyer les données au workspace AMP dans le compte cible.

1. Dans le compte source, créez un rôle arn:aws:iam::account_id_source:role/Source avec les permissions STS::AssumeRole et ajoutez la politique de confiance suivante.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "scraper.aps.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "ArnEquals": {
                    "aws:SourceArn": "$SCRAPER_ARN"
                },
                "StringEquals": {
                    "AWS:SourceAccount": "$ACCOUNT_ID"
                }
            }
        }
    ]
}
```

Vous avez également besoin d'une politique de permissions assume role :

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "$TARGET_ACCOUNT_ROLE_ARN"
        }
    ]
}
```

:::warning

Nous devons créer les constructions IAM avant de pouvoir réellement créer le scraper. Par conséquent, à ce stade, $SCRAPER_ARN est simplement un champ de substitution. Après avoir créé le scraper, nous reviendrons le mettre à jour. Le $TARGET_ACCOUNT_ROLE_ARN n'existe pas non plus tant que l'étape 2 n'est pas terminée.

:::

2. Pour chaque combinaison de source (cluster Amazon EKS) et cible (workspace Amazon Managed Service for Prometheus), vous devez créer un rôle dans le compte CIBLE de arn:aws:iam::account_id_target:role/Target et ajouter la politique de confiance suivante avec la politique de permissions gérée pour AmazonPrometheusRemoteWriteAccess.

```
{
  "Effect": "Allow",
  "Principal": {
     "AWS": "arn:aws:iam::account_id_source:role/Source"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
     "StringEquals": {
        "sts:ExternalId": "$SCRAPER_ARN"
      }
  }
}
```

:::warning

$SCRAPER_ARN est toujours un simple champ de substitution. Nous mettrons à jour la valeur après la création du scraper.

:::

3. Créez un scraper dans le compte source (où le cluster EKS existe) avec l'option --role-configuration.

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```
:::warning

Assurez-vous de remplacer les $VARIABLES par les valeurs spécifiques à votre environnement.

:::

4. Validez la création du scraper (cela peut prendre environ 20 minutes) et notez l'ARN du scraper.

```
aws amp list-scrapers
{
    "scrapers": [
        {
            "scraperId": "scraper-id",
            "arn": "arn:aws:aps:us-west-2:account_id_source:scraper/scraper-id",
            "roleArn": "arn:aws:iam::account_id_source:role/aws-service-role/scraper.aps.amazonaws.com/AWSServiceRoleForAmazonPrometheusScraperInternal_cc319052-41a3-4",
            "status": {
                "statusCode": "ACTIVE"
            },
            "createdAt": "2024-10-29T16:37:58.789000+00:00",
            "lastModifiedAt": "2024-10-29T16:55:17.085000+00:00",
            "tags": {},
            "source": {
                "eksConfiguration": {
                    "clusterArn": "arn:aws:eks:us-west-2:account_id_source:cluster/xarw",
                    "securityGroupIds": [
                        "sg-security-group-id",
                        "sg-security-group-id"
                    ],
                    "subnetIds": [
                        "subnet-subnet_id"
                    ]
                }
            },
            "destination": {
                "ampConfiguration": {
                    "workspaceArn": "arn:aws:aps:us-west-2:account_id_target:workspace/ws-workspace-id"
                }
            }
        }
```

5. Retournez mettre à jour les politiques de confiance créées aux étapes 1 et 2 avec la valeur de l'ARN du scraper obtenue à partir de la commande de l'étape 4.
