# Estimation des couts : Migration des trails CloudTrail vers l'ingestion CloudWatch Logs

## Introduction

Les organisations utilisant [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) disposent de trois approches principales pour stocker et surveiller leurs journaux CloudTrail :

1. **Trails CloudTrail** : Stocker les journaux dans des compartiments Amazon S3 (avec integration optionnelle de CloudWatch Logs)
2. **CloudTrail Lake** : Stocker les evenements dans un lac de donnees gere pour les requetes avancees et l'analytique
3. **Ingestion directe dans CloudWatch Logs** : Envoyer les evenements CloudTrail directement a CloudWatch Logs sans avoir besoin de creer un trail pour CloudTrail

Ce guide se concentre sur la fourniture d'une estimation des couts lors de la migration des trails CloudTrail vers l'ingestion directe dans CloudWatch Logs. Avec l'introduction des [sources de donnees CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html), les evenements CloudTrail peuvent etre automatiquement ingeres dans le magasin de donnees unifie de CloudWatch Logs. Cela fournit une gestion amelioree des journaux, une decouverte automatique du schema et des capacites de requete simplifiees pour vos evenements CloudTrail. Pour en savoir plus sur le magasin de donnees unifie CloudWatch, consultez l'article de blog [Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/).

Comprendre les implications en termes de couts de la migration des trails CloudTrail vers l'ingestion directe dans CloudWatch Logs est essentiel pour la planification budgetaire et l'optimisation des couts. Ce guide montre comment utiliser les donnees du [rapport de couts et d'utilisation AWS (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) pour estimer les couts associes a cette migration.

:::note
**Note** : Ce guide fournit uniquement une estimation de votre cout pour l'ingestion des evenements CloudTrail dans CloudWatch Logs et n'inclut aucun cout supplementaire associe a CloudWatch Logs tel que le stockage et les requetes.
:::

## CloudTrail comme source de donnees avec le magasin de donnees unifie CloudWatch

CloudTrail est une source de donnees au sein du magasin de donnees unifie CloudWatch, fournissant des donnees pour l'analyse de securite et operationnelle. Le magasin de donnees unifie pour CloudWatch Logs vous permet de correler les donnees CloudTrail avec d'autres journaux AWS et non-AWS en utilisant CloudWatch Log Insights, offrant une visibilite sur votre infrastructure cloud et votre posture de securite.

## Analyse des couts : Migration des trails vers le magasin de donnees unifie CloudWatch

Le [rapport de couts et d'utilisation AWS (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) contient des informations detaillees sur l'utilisation de vos services AWS, y compris les [volumes d'evenements CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html). En analysant les evenements CloudTrail enregistres dans vos donnees CUR, vous pouvez estimer le cout potentiel de la migration vers l'ingestion directe dans CloudWatch Logs. Cette approche fournit une estimation de base car :

- **Correlation des evenements** : Chaque evenement CloudTrail enregistre dans le CUR represente un evenement qui entrainerait des frais d'ingestion CloudWatch Logs
- **Analyse historique** : Les donnees CUR fournissent des modeles d'utilisation historiques de CloudTrail pour projeter les couts futurs de CloudWatch Logs
- **Visibilite granulaire** : Vous pouvez analyser les couts par compte, type d'evenement et periode
- **Calcul des couts** : L'ingestion CloudWatch Logs est facturee a 0,75 $ par Go (0,25 $ livraison CloudTrail + 0,50 $ ingestion CloudWatch Logs)

:::note
**Important** : Cette methode fournit une estimation basee sur les volumes reels d'evenements CloudTrail enregistres dans le CUR, vous aidant a comprendre l'impact financier de l'envoi de ces evenements vers CloudWatch Logs au lieu d'utiliser des trails pour livrer vers un compartiment S3. L'estimation n'inclut pas le cout de stockage associe a CloudWatch Logs.
:::

La requete suivante analyse vos evenements CloudTrail a partir des donnees du rapport de couts et d'utilisation AWS (CUR) pour estimer les couts d'ingestion CloudWatch Logs.

### Comprendre la requete

La requete calcule les couts en se basant sur :

1. **Nombre d'evenements** : Total des evenements CloudTrail du mois precedent en utilisant les donnees CUR
2. **Taille estimee des donnees** : Suppose 1 500 octets par evenement (taille moyenne d'un evenement CloudTrail)
3. **Composantes du cout** :
   - Livraison CloudTrail vers CloudWatch Logs : 0,25 $ par Go
   - Ingestion CloudWatch Logs : 0,50 $ par Go
   - Cout total d'ingestion : 0,75 $ par Go

### Formule de calcul des couts

```
Total des evenements x 1 500 octets / 1 000 000 000 = Go de donnees
Go de donnees x 0,25 $ = Cout de livraison CloudTrail
Go de donnees x 0,50 $ = Cout d'ingestion CloudWatch Logs
Go de donnees x 0,75 $ = Cout total d'ingestion
```

### Requete CUR utilisant les donnees d'utilisation CloudTrail du mois precedent

Remplacez `<CUR_TABLE>` par le nom reel de votre table CUR :

```sql
SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-FreeEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Data Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-DataEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name,
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events, 
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Additional copies of Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-PaidEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name
ORDER BY month, account_id, event_type
```
:::note
**Note** : Cette requete d'exemple fournit une estimation de votre cout mensuel pour l'ingestion des evenements CloudTrail dans CloudWatch Logs. Veuillez noter que cette estimation n'inclut pas les couts supplementaires de CloudWatch Logs tels que le stockage, les requetes ou les augmentations potentielles futures du volume de vos evenements CloudTrail. Ce calcul sert d'estimation de base de vos couts basee sur les donnees historiques du rapport de couts et d'utilisation (CUR).
:::

L'image ci-dessous montre la sortie de la requete CUR. Les resultats sont organises par type d'evenement (evenements de gestion, evenements de donnees et copies supplementaires d'evenements de gestion) et fournissent le total des evenements CloudTrail enregistres pour le mois precedent, les couts actuels des trails pour cette periode et les couts estimes d'ingestion CloudWatch Logs. Cette ventilation vous aide a comprendre l'impact financier de la migration de chaque type d'utilisation des trails vers l'ingestion directe dans CloudWatch Logs.

![Estimation du cout des evenements de donnees CloudTrail pour S3](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## Conclusion

L'ingestion CloudWatch Logs fournit une surveillance en temps reel, une analytique plus rapide et une gestion simplifiee des evenements CloudTrail. La requete CUR vous aidera a estimer vos couts lors de la migration depuis les trails et a tirer parti des capacites du magasin de donnees unifie que CloudWatch Logs fournit, notamment les alertes immediates, la correlation inter-services et la reduction de la complexite de l'infrastructure pour les exigences de securite et de conformite de votre organisation.

:::note
Pour les details tarifaires actuels, consultez [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/) et [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/).
:::
