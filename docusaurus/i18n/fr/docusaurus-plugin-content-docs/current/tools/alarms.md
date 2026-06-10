# Alarmes

Amazon CloudWatch alarms vous permet de définir des seuils autour des métriques et journaux CloudWatch et de recevoir des notifications basées sur les règles configurées dans CloudWatch.

**Alarmes sur les métriques CloudWatch :**

CloudWatch alarms vous permet de définir des seuils sur les métriques CloudWatch et de recevoir des notifications lorsque les métriques sortent de la plage définie. Chaque métrique peut déclencher plusieurs alarmes, et chaque alarme peut avoir de nombreuses actions associées. Il existe deux façons différentes de configurer des alarmes de métriques basées sur les métriques CloudWatch.

1. **Seuil statique** : Un seuil statique représente une limite fixe que la métrique ne devrait pas violer. Vous devez définir la plage du seuil statique comme la limite supérieure et la limite inférieure pour comprendre le comportement pendant les opérations normales. Si la valeur de la métrique tombe en dessous ou au-dessus du seuil statique, vous pouvez configurer CloudWatch pour générer l'alarme.

2. **Détection d'anomalies** : La détection d'anomalies est généralement identifiée comme des éléments rares, des événements ou des observations qui dévient significativement de la majorité des données et ne se conforment pas à une notion bien définie de comportement normal. La détection d'anomalies CloudWatch analyse les données métriques passées et crée un modèle de valeurs attendues. Les valeurs attendues prennent en compte les modèles horaires, quotidiens et hebdomadaires typiques de la métrique. Vous pouvez appliquer la détection d'anomalies pour chaque métrique selon vos besoins et CloudWatch applique un algorithme d'apprentissage automatique pour définir la limite supérieure et la limite inférieure pour chacune des métriques activées et générer une alarme uniquement lorsque les métriques sortent des valeurs attendues.

:::tip
	Les seuils statiques sont mieux utilisés pour les métriques que vous comprenez bien, comme les points de rupture de performance identifiés dans votre charge de travail, ou les limites absolues des composants d'infrastructure.
:::
:::info
	Utilisez un modèle de détection d'anomalies avec vos alarmes lorsque vous n'avez pas de visibilité sur la performance d'une métrique particulière au fil du temps, ou lorsque la valeur de la métrique n'a pas été observée lors de tests de charge ou de trafic anormal précédemment.
:::
![Types d'alarmes CloudWatch](../images/cwalarm1.png)

Vous pouvez suivre les instructions ci-dessous sur la configuration des alarmes statiques et basées sur la détection d'anomalies dans CloudWatch.

[Alarmes à seuil statique](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm)

[Alarmes basées sur la détection d'anomalies CloudWatch](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm)

:::info
	Pour réduire la fatigue des alarmes ou réduire le bruit provenant du nombre d'alarmes générées, vous disposez de deux méthodes avancées pour configurer les alarmes :

	1. **Alarmes composites** : Une alarme composite inclut une expression de règle qui prend en compte les états d'alarme d'autres alarmes qui ont été créées. L'alarme composite passe à l'état `ALARM` uniquement si toutes les conditions de la règle sont remplies. Les alarmes spécifiées dans l'expression de règle d'une alarme composite peuvent inclure des alarmes de métriques et d'autres alarmes composites. Les alarmes composites aident à [combattre la fatigue des alarmes par l'agrégation](../signals/alarms.md#fight-alarm-fatigue-with-aggregation).

	2. **Alarmes basées sur les expressions mathématiques de métriques** : Les expressions mathématiques de métriques peuvent être utilisées pour construire des KPIs plus significatifs et créer des alarmes dessus. Vous pouvez combiner plusieurs métriques et créer une métrique d'utilisation combinée et déclencher des alarmes dessus.
:::

Ces instructions ci-dessous vous guident sur la configuration des alarmes composites et des alarmes basées sur les expressions mathématiques de métriques.

[Alarmes composites](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm)

[Alarmes avec expressions mathématiques de métriques](https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/)

**Alarmes sur les journaux CloudWatch**

Vous pouvez créer des alarmes basées sur les journaux CloudWatch en utilisant les filtres de métriques CloudWatch. Les filtres de métriques transforment les données de journaux en métriques numériques CloudWatch sur lesquelles vous pouvez créer des graphiques ou définir des alarmes. Une fois les métriques configurées, vous pouvez utiliser soit des alarmes statiques, soit des alarmes basées sur la détection d'anomalies sur les métriques CloudWatch générées à partir des journaux CloudWatch.

Vous pouvez trouver un exemple sur la configuration d'un [filtre de métriques sur les journaux CloudWatch](https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/).
