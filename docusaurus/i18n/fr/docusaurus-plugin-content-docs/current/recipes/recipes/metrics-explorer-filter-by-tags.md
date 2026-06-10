# Utiliser Amazon CloudWatch Metrics Explorer pour agréger et visualiser les métriques filtrées par tags de ressources

Dans cette recette, nous vous montrons comment utiliser Metrics Explorer pour filtrer, agréger et visualiser les métriques par tags de ressources et propriétés de ressources - [Utiliser Metrics Explorer pour surveiller les ressources par leurs tags et propriétés][metrics-explorer].

Il existe plusieurs façons de créer des visualisations avec Metrics Explorer ; dans ce guide, nous utilisons simplement la console AWS.

:::note
    Ce guide prendra environ 5 minutes à compléter.
:::
## Prérequis

* Accès à un compte AWS
* Accès à Amazon CloudWatch Metrics Explorer via la console AWS
* Tags de ressources définis pour les ressources concernées


## Requêtes et visualisations basées sur les tags avec Metrics Explorer

*  Ouvrez la console CloudWatch

*  Sous <b>Metrics</b>, cliquez sur le menu <b>Explorer</b>

![Capture d'écran des métriques filtrées par tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png" alt="Screen shot of the CloudWatch menu" width="271" height="382" style="vertical-align:left"> -->

*  Vous pouvez choisir parmi l'un des <b>Generic templates</b> ou une liste de <b>Service based templates</b> ; dans cet exemple nous utilisons le modèle <b>EC2 Instances by type</b>

![Capture d'écran des métriques filtrées par tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png" alt="Screen shot of Explorer templates" width="250" height="601" style="vertical-align:left"> -->

*  Choisissez les métriques que vous souhaitez explorer ; supprimez celles qui sont obsolètes et ajoutez d'autres métriques que vous souhaitez voir

![Capture d'écran des métriques EC2](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png" alt="Screen shot of EC2 metrics" width="424" height="393" style="vertical-align:left"> -->

*  Sous <b>From</b>, choisissez un tag de ressource ou une propriété de ressource que vous recherchez ; dans l'exemple ci-dessous nous montrons un certain nombre de métriques CPU et réseau pour différentes instances EC2 avec le Tag <b>Name: TeamX</b>

![Capture d'écran de l'exemple de tag Name](../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png)
<!--
<img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png" alt="Screen shot of EC2 metrics" style="vertical-align:left">
// width="386" height="176" -->

*  Veuillez noter que vous pouvez combiner des séries temporelles en utilisant une fonction d'agrégation sous <b>Aggregated by</b> ; dans l'exemple ci-dessous les métriques <b>TeamX</b> sont agrégées par <b>Availability Zone</b>

![Capture d'écran du tableau de bord EC2 filtré par tag Name](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png" alt="Screen shot of EC2 metrics" style="vertical-align:left"> -->

Alternativement, vous pourriez agréger <b>TeamX</b> et <b>TeamY</b> par le Tag <b>Team</b>, ou choisir toute autre configuration qui correspond à vos besoins

![Capture d'écran du tableau de bord EC2 filtré par tag Team](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png" alt="Screen shot of EC2 metrics" style="vertical-align:left"> -->

## Visualisations dynamiques
Vous pouvez facilement personnaliser les visualisations résultantes en utilisant les options <b>From</b>, <b>Aggregated by</b> et <b>Split by</b>. Les visualisations de Metrics Explorer sont dynamiques, donc toute nouvelle ressource taguée apparaît automatiquement dans le widget de l'explorateur.

## Référence

Pour plus d'informations sur Metrics Explorer, veuillez consulter l'article suivant :
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

[metrics-explorer]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html
