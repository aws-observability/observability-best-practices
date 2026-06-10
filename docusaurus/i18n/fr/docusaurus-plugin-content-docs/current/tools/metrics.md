# Métriques

Les métriques sont des données sur la performance de votre système. Disposer de toutes les métriques liées au système ou aux ressources dans un emplacement centralisé vous donne la capacité de comparer les métriques, d'analyser les performances et de prendre de meilleures décisions stratégiques comme l'augmentation ou la réduction des ressources. Les métriques sont également importantes pour connaître la santé des ressources et prendre des mesures proactives.

Les données métriques sont fondamentales et servent à piloter les [alarmes](../signals/alarms.md), la détection d'anomalies, les [événements](../signals/events.md), les [tableaux de bord](./dashboards.md) et bien plus encore.

## Métriques fournies

[CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) collecte des données sur la performance de vos systèmes. Par défaut, la plupart des services AWS fournissent des métriques gratuites pour leurs ressources. Cela inclut les instances [Amazon EC2](https://aws.amazon.com/ec2/), [Amazon RDS](https://aws.amazon.com/rds/), les compartiments [Amazon S3](https://aws.amazon.com/s3/?p=pm&c=s3&z=4), et bien d'autres.

Nous désignons ces métriques comme des *métriques fournies*. Il n'y a aucun frais pour la collecte des métriques fournies dans votre compte AWS.

:::info
	Pour une liste complète des services AWS qui émettent des métriques vers CloudWatch, consultez [cette page](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html).
:::
## Interrogation des métriques

Vous pouvez utiliser la fonctionnalité [metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) dans CloudWatch pour interroger plusieurs métriques et utiliser des expressions mathématiques afin d'analyser les métriques avec plus de granularité. Par exemple, vous pouvez écrire une expression metric math pour déterminer le taux d'erreur Lambda en interrogeant :

	Errors/Requests

Ci-dessous, vous voyez un exemple de la façon dont cela peut apparaître dans la console CloudWatch :

![Exemple de metric math](../images/metrics1.png)

:::info
	Utilisez metric math pour tirer le maximum de valeur de vos données et dériver des valeurs à partir de la performance de sources de données distinctes.
:::
CloudWatch prend également en charge les instructions conditionnelles. Par exemple, pour retourner une valeur de `1` pour chaque série temporelle où la latence dépasse un seuil spécifique, et `0` pour tous les autres points de données, une requête ressemblerait à ceci :

	IF(latency>threshold, 1, 0)

Dans la console CloudWatch, nous pouvons utiliser cette logique pour créer des valeurs booléennes, qui à leur tour peuvent déclencher des [alarmes CloudWatch](./alarms.md) ou d'autres actions. Cela peut permettre des actions automatiques à partir de points de données dérivés. Un exemple de la console CloudWatch est ci-dessous :

![Création d'alarme à partir d'une valeur dérivée](../images/metrics2.png)

:::info
	Utilisez les instructions conditionnelles pour déclencher des alarmes et des notifications lorsque les performances dépassent les seuils pour les valeurs dérivées.
:::
Vous pouvez également utiliser une fonction `SEARCH` pour afficher les `n` premiers pour n'importe quelle métrique. Lors de la visualisation des métriques les meilleures ou les pires sur un grand nombre de séries temporelles (par exemple, des milliers de serveurs), cette approche vous permet de ne voir que les données les plus importantes. Voici un exemple d'une recherche retournant les deux instances EC2 les plus consommatrices de CPU, moyennées sur les cinq dernières minutes :
```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```
Et une vue identique dans la console CloudWatch :

![Requête de recherche dans CloudWatch metrics](../images/metrics3.png)

:::info
	Utilisez l'approche `SEARCH` pour afficher rapidement les ressources les plus performantes ou les moins performantes de votre environnement, puis affichez-les dans des [tableaux de bord](./dashboards.md).
:::
## Collecte des métriques

Si vous souhaitez disposer de métriques supplémentaires comme l'utilisation de la mémoire ou de l'espace disque pour vos instances EC2, vous utilisez l'[agent CloudWatch](./cloudwatch_agent.md) pour envoyer ces données à CloudWatch en votre nom. Ou si vous avez des données de traitement personnalisées qui doivent être visualisées graphiquement, et que vous voulez que ces données soient présentes en tant que métrique CloudWatch, alors vous pouvez utiliser l'API [`PutMetricData`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html) pour publier des métriques personnalisées vers CloudWatch.

:::info
	Utilisez l'un des [SDK AWS](https://aws.amazon.com/developer/tools/) pour envoyer des données métriques à CloudWatch plutôt que l'API brute.
:::
Les appels à l'API `PutMetricData` sont facturés en fonction du nombre de requêtes. La meilleure pratique est d'utiliser l'API `PutMetricData` de manière optimale. En utilisant la méthode Values and Counts dans cette API, vous pouvez publier jusqu'à 150 valeurs par métrique avec une seule requête `PutMetricData`, et elle prend en charge la récupération de statistiques en percentiles sur ces données. Ainsi, au lieu de faire des appels API séparés pour chacun des points de données, vous devriez regrouper tous vos points de données ensemble puis les envoyer à CloudWatch en un seul appel API `PutMetricData`. Cette approche bénéficie à l'utilisateur de deux manières :

1. Tarification CloudWatch
1. La limitation de l'API `PutMetricData` peut être évitée

:::info
	Lors de l'utilisation de `PutMetricData`, la meilleure pratique est de regrouper vos données en opérations `PUT` uniques chaque fois que possible.
:::
:::info
	Si de grands volumes de métriques sont émis dans CloudWatch, envisagez d'utiliser le [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) comme approche alternative. Notez que le Embedded Metric Format n'utilise pas, et ne facture pas, l'utilisation de `PutMetricData`, bien qu'il entraîne une facturation liée à l'utilisation de [CloudWatch Logs](./logs/index.md).
:::
## Détection d'anomalies

CloudWatch dispose d'une fonctionnalité de [détection d'anomalies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) qui renforce votre stratégie d'observabilité en apprenant ce qu'est la *normalité* basée sur les métriques enregistrées. L'utilisation de la détection d'anomalies est une [meilleure pratique](../signals/metrics.md#use-anomaly-detection-algorithms) pour tout système de collecte de signaux métriques.

La détection d'anomalies construit un modèle sur une période de deux semaines.

:::warning
	La détection d'anomalies ne construit son modèle qu'à partir du moment de sa création. Elle ne projette pas dans le passé pour trouver des valeurs aberrantes précédentes.
:::

:::warning
	La détection d'anomalies ne sait pas ce qui est *bon* pour une métrique, seulement ce qui est *normal* basé sur l'écart type.
:::

:::info
	La meilleure pratique est d'entraîner vos modèles de détection d'anomalies pour n'analyser que les périodes de la journée où un comportement normal est attendu. Vous pouvez définir des périodes à exclure de l'entraînement (comme les nuits, les week-ends ou les jours fériés).
:::
Un exemple de bande de détection d'anomalies peut être vu ici, avec la bande en gris.

![Bande de détection d'anomalies](../images/metrics4.png)

La définition de fenêtres d'exclusion pour la détection d'anomalies peut être effectuée avec la console CloudWatch, [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html), ou en utilisant l'un des SDK AWS.
