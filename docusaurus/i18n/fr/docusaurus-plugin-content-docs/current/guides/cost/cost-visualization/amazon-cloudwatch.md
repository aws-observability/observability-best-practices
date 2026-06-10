# Amazon CloudWatch

Les visuels de coût et d'utilisation d'Amazon CloudWatch vous permettent d'obtenir des informations sur le coût de chaque compte AWS, des régions AWS, et de toutes les opérations CloudWatch comme GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering et ListMetrics, pour n'en citer que quelques-unes !

Pour visualiser et analyser les données de coût et d'utilisation de CloudWatch, vous devez créer une vue Athena personnalisée. Une [vue][view] Amazon Athena est une table logique qui crée un sous-ensemble de colonnes à partir de la table CUR originale pour simplifier l'interrogation des données.

1.	Avant de continuer, assurez-vous d'avoir créé le CUR (étape 1) et déployé le modèle AWS CloudFormation (étape 2) mentionnés dans la [Vue d'ensemble de l'implémentation][cid-implement].

2.	Maintenant, créez une nouvelle [vue][view] Amazon Athena en utilisant la requête suivante. Cette requête récupère le coût et l'utilisation d'Amazon CloudWatch dans tous les comptes AWS de votre organisation.

        CREATE OR REPLACE VIEW "cloudwatch_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonCloudWatch')
        GROUP BY 1, 2, 3, 4, 5, 6


### Créer un tableau de bord Amazon QuickSight

Maintenant, créons un tableau de bord QuickSight pour visualiser le coût et l'utilisation d'Amazon CloudWatch.

1.	Dans la console de gestion AWS, accédez au service QuickSight puis sélectionnez votre région AWS dans le coin supérieur droit. Notez que le jeu de données QuickSight doit être dans la même région AWS que la table Amazon Athena.
2.	Assurez-vous que QuickSight peut [accéder][access] à Amazon S3 et AWS Athena.
3.	[Créez un jeu de données QuickSight][create-dataset] en sélectionnant comme source de données la vue Amazon Athena que vous avez créée précédemment. Utilisez cette procédure pour [planifier l'actualisation][schedule-refresh] du jeu de données quotidiennement.
4.	Créez une [analyse][analysis] QuickSight.
5.	Créez des [visuels][visuals] QuickSight selon vos besoins.
6.	[Formatez][format] le visuel selon vos besoins.
7.	Maintenant, vous pouvez [publier][publish] votre tableau de bord à partir de l'analyse.
8.	Vous pouvez envoyer le tableau de bord sous forme de [rapport][report] à des individus ou des groupes, de manière ponctuelle ou planifiée.

Le **tableau de bord QuickSight** suivant montre le coût et l'utilisation d'Amazon CloudWatch dans tous les comptes AWS de votre organisation AWS, ainsi que les opérations CloudWatch comme GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering et ListMetrics, pour n'en citer que quelques-unes.

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

Avec le tableau de bord précédent, vous pouvez maintenant identifier le coût d'Amazon CloudWatch dans les comptes AWS de votre organisation. Vous pouvez utiliser d'autres [types de visuels][types] QuickSight pour créer différents tableaux de bord adaptés à vos besoins.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[access]: https://docs.aws.amazon.com/quicksight/latest/user/accessing-data-sources.html
[create-dataset]: https://docs.aws.amazon.com/quicksight/latest/user/create-a-data-set-athena.html
[schedule-refresh]: https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html
[analysis]: https://docs.aws.amazon.com/quicksight/latest/user/creating-an-analysis.html
[visuals]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-visual.html
[format]: https://docs.aws.amazon.com/quicksight/latest/user/formatting-a-visual.html
[publish]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-dashboard.html
[report]: https://docs.aws.amazon.com/quicksight/latest/user/sending-reports.html
[types]: https://docs.aws.amazon.com/quicksight/latest/user/working-with-visual-types.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
