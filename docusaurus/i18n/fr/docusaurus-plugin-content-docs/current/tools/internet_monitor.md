# Internet Monitor

:::warning
	Au moment de la rédaction, [Internet Monitor](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) est disponible en **preview** dans la console CloudWatch. L'étendue des fonctionnalités pour la disponibilité générale peut changer par rapport à ce que vous expérimentez aujourd'hui.
:::
[Collecter la télémétrie de tous les niveaux de votre charge de travail](../guides/index.md#collect-telemetry-from-all-tiers-of-your-workload) est une bonne pratique, et une qui peut être un défi. Mais quels sont les niveaux de votre charge de travail ? Pour certains, il peut s'agir de serveurs web, d'application et de base de données. D'autres personnes pourraient voir leur charge de travail comme front end et back end. Et ceux qui exploitent des applications web peuvent utiliser la [surveillance des utilisateurs réels](./rum.md) (RUM) pour observer la santé de ces applications telle qu'elle est vécue par les utilisateurs finaux.

Mais qu'en est-il du trafic entre le client et le datacenter ou le fournisseur de services cloud ? Et pour les applications qui ne sont pas servies sous forme de pages web et qui ne peuvent donc pas utiliser RUM ?

![Télémétrie réseau des applications traversant Internet](../images/internet_monitor.png)

Internet Monitor fonctionne au niveau réseau et évalue la santé du trafic observé, corrélé avec la [connaissance existante d'AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html) des problèmes Internet connus. En résumé, s'il y a un fournisseur d'accès Internet (FAI) qui a un problème de performance ou de disponibilité **et** si votre application a du trafic qui utilise ce FAI pour la communication client/serveur, alors Internet Monitor peut vous informer de manière proactive de cet impact sur votre charge de travail. De plus, il peut vous faire des recommandations basées sur votre région d'hébergement sélectionnée et l'utilisation de [CloudFront](https://aws.amazon.com/cloudfront/) comme réseau de diffusion de contenu[^1].

:::tip
	Internet Monitor n'évalue que le trafic provenant des réseaux que vos charges de travail traversent. Par exemple, si un FAI dans un autre pays est impacté, mais que vos utilisateurs n'utilisent pas ce transporteur, alors vous n'aurez pas de visibilité sur ce problème.
:::

## Créer des moniteurs pour les applications qui traversent Internet

La façon dont Internet Monitor fonctionne est de surveiller le trafic qui arrive soit dans vos distributions CloudFront, soit dans vos VPCs depuis des FAI impactés. Cela vous permet de prendre des décisions concernant le comportement de l'application, le routage ou la notification des utilisateurs qui aide à compenser les problèmes métier résultant de problèmes réseau qui sont hors de votre contrôle.

![Intersection de votre charge de travail et des problèmes de FAI](../images/internet_monitor_2.png)

:::info
	Ne créez des moniteurs que pour surveiller le trafic qui traverse Internet. Le trafic privé, comme entre deux hôtes dans un réseau privé ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) ne peut pas être surveillé avec Internet Monitor.
:::
:::info
	Priorisez le trafic provenant des applications mobiles le cas échéant. Les clients itinérant entre les fournisseurs, ou dans des emplacements géographiques éloignés, peuvent avoir des expériences différentes ou inattendues dont vous devriez être conscient.
:::
## Activer des actions via EventBridge et CloudWatch

Les problèmes observés seront publiés via [EventBridge](https://aws.amazon.com/eventbridge/) en utilisant un [schéma](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) qui contient la source identifiée comme `aws.internetmonitor`. EventBridge peut être utilisé pour créer automatiquement des tickets dans votre système de gestion des incidents, alerter vos équipes de support, ou même déclencher une automatisation qui peut modifier votre charge de travail pour atténuer certains scénarios.

```json
{
  "source": ["aws.internetmonitor"]
}
```

De même, des détails étendus du trafic sont disponibles dans [CloudWatch Logs](./logs/index.md) pour les villes, pays, zones métropolitaines et subdivisions observés. Cela vous permet de créer des actions très ciblées qui peuvent notifier de manière proactive les clients impactés des problèmes locaux les concernant. Voici un exemple d'observation au niveau d'un pays pour un seul fournisseur :

```json
{
    "version": 1,
    "timestamp": 1669659900,
    "clientLocation": {
        "latitude": 0,
        "longitude": 0,
        "country": "United States",
        "subdivision": "",
        "metro": "",
        "city": "",
        "countryCode": "US",
        "subdivisionCode": "",
        "asn": 00000,
        "networkName": "MY-AWESOME-ASN"
    },
    "serviceLocation": "us-east-1",
    "percentageOfTotalTraffic": 0.36,
    "bytesIn": 23,
    "bytesOut": 0,
    "clientConnectionCount": 0,
    "internetHealth": {
        "availability": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0
        },
        "performance": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0,
            "roundTripTime": {
                "p50": 71,
                "p90": 72,
                "p95": 73
            }
        }
    },
    "trafficInsights": {
        "timeToFirstByte": {
            "currentExperience": {
                "serviceName": "VPC",
                "serviceLocation": "us-east-1",
                "value": 48
            },
            "ec2": {
                "serviceName": "EC2",
                "serviceLocation": "us-east-1",
                "value": 48
            }
        }
    }
}
```

:::info
	Des valeurs telles que `percentageOfTotalTraffic` peuvent révéler des informations puissantes sur l'endroit d'où vos clients accèdent à vos charges de travail et peuvent être utilisées pour des analyses avancées.
:::

:::warning
	Notez que les groupes de journaux créés par Internet Monitor auront une période de rétention par défaut définie sur *ne jamais expirer*. AWS ne supprime pas vos données sans votre consentement, alors assurez-vous de définir une période de rétention qui a du sens pour vos besoins.
:::
:::info
	Chaque moniteur créera au moins 10 métriques CloudWatch distinctes. Celles-ci devraient être utilisées pour créer des [alarmes](./alarms.md) comme vous le feriez avec n'importe quelle autre métrique opérationnelle.
:::
## Utiliser les suggestions d'optimisation du trafic

Internet Monitor propose des recommandations d'optimisation du trafic qui peuvent vous conseiller sur le meilleur emplacement pour vos charges de travail afin d'obtenir les meilleures expériences client. Pour les charges de travail globales, ou ayant des clients mondiaux, cette fonctionnalité est particulièrement précieuse.

![Console Internet Monitor](../images/internet_monitor_3.png)

:::info
	Portez une attention particulière aux valeurs actuelles, prédites et les plus basses du temps au premier octet (TTFB) dans la vue des suggestions d'optimisation du trafic car elles peuvent indiquer des expériences utilisateur potentiellement médiocres qui sont autrement difficiles à observer.
:::
[^1]: Voir [https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) pour notre blog de lancement sur cette nouvelle fonctionnalité.
