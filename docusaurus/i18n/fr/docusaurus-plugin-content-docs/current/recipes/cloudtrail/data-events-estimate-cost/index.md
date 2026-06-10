# Estimation des couts des evenements de donnees CloudTrail

## Introduction

Les [evenements de donnees CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) fournissent une journalisation detaillee des operations du plan de donnees sur les ressources AWS telles que les objets S3, les tables DynamoDB, les fonctions Lambda et bien d'autres. Bien que ces evenements offrent des informations precieuses en matiere de securite et de conformite, ils peuvent generer des couts significatifs en raison du volume eleve d'operations dans les environnements de production. Comprendre l'impact potentiel sur les couts avant d'activer les evenements de donnees est essentiel pour la planification budgetaire et l'optimisation des couts.

Ce guide montre comment utiliser une requete Cost and Usage Report (CUR) pour estimer les couts des evenements de donnees CloudTrail pour S3. A l'avenir, le guide sera mis a jour pour inclure d'autres exemples d'estimation des couts pour des types de ressources d'evenements de donnees supplementaires.

:::note
**Note** : Ce guide fournit une methode d'approximation des couts utilisant les donnees CUR, qui peut sous-estimer les couts reels de CloudTrail puisque le CUR ne suit que les operations facturables alors que CloudTrail journalise toutes les operations.
:::

## Apercu de l'estimation des couts pour les evenements de donnees S3 avec le CUR

Le [rapport de couts et d'utilisation AWS (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) contient des informations detaillees sur l'utilisation de vos services AWS, y compris les operations API individuelles. En analysant les operations API S3 dans vos donnees CUR, vous pouvez approximer le cout potentiel de l'activation des evenements de donnees CloudTrail. Cette approche fournit une estimation de base car :

- **Correlation partielle** : Chaque operation API S3 enregistree dans le CUR genererait un evenement de donnees CloudTrail si la journalisation etait activee, mais le CUR ne suit que les operations facturables
- **Analyse historique** : Les donnees CUR fournissent des modeles d'utilisation historiques pour les operations facturables afin de projeter les couts futurs
- **Visibilite granulaire** : Vous pouvez analyser les couts par compte, compartiment, type d'operation et periode pour les operations suivies
- **Calcul des couts** : Les evenements de donnees CloudTrail sont factures a 0,10 $ pour 100 000 evenements

:::note
**Important** : Cette methode fournit une estimation prudente car le CUR ne suit pas les operations du niveau gratuit, les operations echouees ou les operations en dessous des seuils de facturation que CloudTrail journaliserait quand meme.
:::

La requete suivante analyse vos operations API Amazon S3 associees aux [evenements de donnees CloudTrail pour S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events) a partir des donnees CUR pour estimer les couts des evenements de donnees CloudTrail.

## Limitations importantes

**Limitations du suivi CUR** : Le `line_item_operation` du CUR ne suit que les operations qui generent une utilisation ou des couts facturables. Cela signifie :

- **Operations non suivies** : Les operations du niveau gratuit, les operations echouees, les evenements d'acces refuse et les operations en dessous des seuils de facturation ne sont pas inclus dans le CUR
- **CloudTrail journalise tout** : Les evenements de donnees CloudTrail capturent TOUTES les operations independamment du succes, de l'echec ou du statut de facturation
- **Precision de l'estimation des couts** : Les estimations basees sur le CUR peuvent etre **inferieures** aux couts reels de CloudTrail puisque CloudTrail journalise plus d'operations que le CUR ne suit

**Recommandation** : Utilisez cette estimation comme base de reference en sachant que les couts reels des evenements de donnees CloudTrail pourraient etre plus eleves, en particulier dans les environnements avec un volume eleve d'operations echouees ou d'utilisation du niveau gratuit.

```sql
WITH base_data AS (
	SELECT DATE(line_item_usage_start_date) as usage_date,
		bill_payer_account_id as payer_account_id,
		line_item_usage_account_id as usage_account_id,
		line_item_operation,
		line_item_resource_id as bucket_name,
		COUNT(*) as operation_count,
		CONCAT('$', FORMAT('%.6f', (COUNT(*) / 100000.0) * 0.10)) as data_events_estimated_cost
	FROM <CUR TABLE>
	WHERE line_item_product_code = 'AmazonS3'
		AND line_item_operation IN (
			'AbortMultipartUpload',
			'CompleteMultipartUpload',
			'CopyObject',
			'CreateMultipartUpload',
			'DeleteObject',
			'DeleteObjectTagging',
			'DeleteObjects',
			'GetObject',
			'GetObjectAcl',
			'GetObjectAttributes',
			'GetObjectLegalHold',
			'GetObjectRetention',
			'GetObjectTagging',
			'GetObjectTorrent',
			'HeadObject',
			'HeadBucket',
			'ListObjectVersions',
			'ListObjects',
			'ListParts',
			'PutObject',
			'PutObjectAcl',
			'PutObjectLegalHold',
			'PutObjectRetention',
			'PutObjectTagging',
			'RestoreObject',
			'SelectObjectContent',
			'UploadPart',
			'UploadPartCopy'
		)
		AND line_item_usage_start_date >= DATE('2025-09-01')
		AND line_item_usage_start_date < DATE('2025-09-30')
	GROUP BY DATE(line_item_usage_start_date),
		bill_payer_account_id,
		line_item_usage_account_id,
		line_item_operation,
		line_item_resource_id
)
SELECT *
FROM base_data
UNION ALL
SELECT NULL as usage_date,
	payer_account_id,
	usage_account_id,
	'TOTAL' as line_item_operation,
	'ALL BUCKETS' as bucket_name,
	SUM(operation_count) as operation_count,
	CONCAT('$', FORMAT('%.6f', (SUM(operation_count) / 100000.0) * 0.10)) as data_events_estimated_cost
FROM base_data
GROUP BY payer_account_id,
	usage_account_id
ORDER BY CASE WHEN bucket_name = 'ALL BUCKETS' THEN 0 ELSE 1 END,
	operation_count DESC;
```

L'image ci-dessous montre la sortie de la requete CUR. Elle donne d'abord le nombre total d'operations API S3 facturables pour tous les compartiments et le cout approximatif des evenements de donnees. Ensuite, elle donne le nombre d'operations API S3 facturables pour chaque compartiment et le cout approximatif. Ces informations de reference seront utiles lors de la definition de filtres de selecteurs d'evenements avances specifiques pour inclure/exclure des ressources S3 specifiques pour les evenements de donnees, en gardant a l'esprit que les couts reels de CloudTrail peuvent etre plus eleves en raison des operations non suivies dans le CUR.

![Estimation du cout des evenements de donnees CloudTrail pour S3](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
