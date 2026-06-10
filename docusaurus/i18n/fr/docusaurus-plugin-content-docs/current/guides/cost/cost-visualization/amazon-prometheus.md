# Amazon Managed Service for Prometheus

Les visuels de coût et d'utilisation d'Amazon Managed Service for Prometheus vous permettent d'obtenir des informations sur le coût de chaque compte AWS, des régions AWS, des instances spécifiques d'espaces de travail Prometheus ainsi que des opérations comme RemoteWrite, Query et HourlyStorageMetering !

Pour visualiser et analyser les données de coût et d'utilisation, vous devez créer une vue Athena personnalisée.

1.	Avant de continuer, assurez-vous d'avoir créé le CUR (étape 1) et déployé le modèle AWS CloudFormation (étape 2) mentionnés dans la [Vue d'ensemble de l'implémentation][cid-implement].

2.	Maintenant, créez une nouvelle [vue][view] Amazon Athena en utilisant la requête suivante. Cette requête récupère le coût et l'utilisation d'Amazon Managed Service for Prometheus dans tous les comptes AWS de votre organisation.

        CREATE OR REPLACE VIEW "prometheus_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_operation
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name
        WHERE ("line_item_product_code" = 'AmazonPrometheus')
        GROUP BY 1, 2, 3, 4, 5, 6

## Créer un tableau de bord Amazon Managed Grafana

Avec Amazon Managed Grafana, vous pouvez ajouter Athena comme source de données en utilisant l'option de configuration des sources de données AWS dans la console de l'espace de travail Grafana. Cette fonctionnalité simplifie l'ajout d'Athena comme source de données en découvrant vos comptes Athena existants et gère la configuration des identifiants d'authentification nécessaires pour accéder à Athena. Pour les prérequis associés à l'utilisation de la source de données Athena, consultez les [Prérequis][Prerequisites].


Le **tableau de bord Grafana** suivant montre le coût et l'utilisation d'Amazon Managed Service for Prometheus dans tous les comptes AWS de votre organisation AWS, ainsi que le coût des instances individuelles d'espaces de travail Prometheus et les opérations comme RemoteWrite, Query et HourlyStorageMetering !

![prometheus-cost](../../../images/prometheus-cost.png)

Un tableau de bord dans Grafana est représenté par un objet JSON qui stocke les métadonnées du tableau de bord. Les métadonnées incluent les propriétés du tableau de bord, les métadonnées des panneaux, les variables de modèle, les requêtes de panneau, etc. Accédez au modèle JSON du tableau de bord ci-dessus [ici](AmazonPrometheus.json).

Avec le tableau de bord précédent, vous pouvez maintenant identifier le coût et l'utilisation d'Amazon Managed Service for Prometheus dans les comptes AWS de votre organisation. Vous pouvez utiliser d'autres [panneaux de tableau de bord][panels] Grafana pour créer des visuels adaptés à vos besoins.

[Prerequisites]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
