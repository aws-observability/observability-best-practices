# Amazon Managed Grafana

Les visuels de coût et d'utilisation d'Amazon Managed Grafana vous permettent d'obtenir des informations sur le coût de chaque compte AWS, des régions AWS, des instances spécifiques d'espaces de travail Grafana et le coût de licence des utilisateurs Admin, Editor et Viewer !

Pour visualiser et analyser les données de coût et d'utilisation, vous devez créer une vue Athena personnalisée.

1.	Avant de continuer, assurez-vous d'avoir créé le CUR (étape 1) et déployé le modèle AWS CloudFormation (étape 2) mentionnés dans la [Vue d'ensemble de l'implémentation][cid-implement].

2.	Maintenant, créez une nouvelle [vue][view] Amazon Athena en utilisant la requête suivante. Cette requête récupère le coût et l'utilisation d'Amazon Managed Grafana dans tous les comptes AWS de votre organisation.

        CREATE OR REPLACE VIEW "grafana_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonGrafana')
        GROUP BY 1, 2, 3, 4, 5, 6

En utilisant Athena comme source de données, vous pouvez créer des tableaux de bord dans Amazon Managed Grafana ou Amazon QuickSight pour répondre à vos besoins métier. Vous pouvez également exécuter directement des [requêtes SQL][sql-query] sur la vue Athena que vous avez créée.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
