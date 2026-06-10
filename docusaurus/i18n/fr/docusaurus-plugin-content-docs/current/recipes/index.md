# Recettes

Vous trouverez ici des conseils organises, des guides pratiques et des liens vers d'autres ressources qui aident a l'application de l'observabilite (o11y) a divers cas d'utilisation. Cela inclut des services geres tels qu'[Amazon Managed Service for Prometheus][amp]
et [Amazon Managed Grafana][amg] ainsi que des agents, par exemple [OpenTelemetry][otel]
et [Fluent Bit][fluentbit]. Le contenu ici ne se limite pas aux outils AWS seuls, et de nombreux projets open source y sont references.

Nous voulons repondre aux besoins des developpeurs et des equipes d'infrastructure de maniere egale, c'est pourquoi beaucoup de recettes "ratissent large". Nous vous encourageons a explorer et a trouver les solutions qui fonctionnent le mieux pour ce que vous cherchez a accomplir.

:::info
    Le contenu ici est derive d'engagements clients reels par nos architectes de solutions, nos services professionnels et les retours d'autres clients. Tout ce que vous trouverez ici a ete implemente par nos clients reels dans leurs propres environnements.
:::

La facon dont nous pensons l'espace o11y est la suivante : nous le decomposons en
[six dimensions][dimensions] que vous pouvez ensuite combiner pour arriver a une solution specifique :

| dimension | exemples |
|---------------|--------------|
| Destinations  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| Agents        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| Langages     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| Infra et bases de donnees  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| Unite de calcul | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| Moteur de calcul | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "Exemple d'exigence de solution"
    J'ai besoin d'une solution de journalisation pour une application Python que j'execute sur EKS sur Fargate
    avec l'objectif de stocker les journaux dans un bucket S3 pour une consommation ulterieure
:::

Une pile qui repondrait a ce besoin est la suivante :

1. *Destination* : Un bucket S3 pour la consommation ulterieure des donnees
1. *Agent* : FluentBit pour emettre les donnees de journal depuis EKS
1. *Langage* : Python
1. *Infra et BD* : N/A
1. *Unite de calcul* : Kubernetes (EKS)
1. *Moteur de calcul* : EC2

Toutes les dimensions n'ont pas besoin d'etre specifiees et parfois il est difficile de
decider par ou commencer. Essayez differents chemins et comparez les avantages et les
inconvenients de certaines recettes.

Pour simplifier la navigation, nous regroupons les six dimensions dans les categories
suivantes :

- **Par Calcul** : couvrant les moteurs et unites de calcul
- **Par Infra et Donnees** : couvrant l'infrastructure et les bases de donnees
- **Par Langage** : couvrant les langages
- **Par Destination** : couvrant la telemetrie et l'analyse
- **Taches** : couvrant la detection d'anomalies, les alertes, le depannage, et plus

[En savoir plus sur les dimensions...](https://aws-observability.github.io/observability-best-practices/recipes/dimensions/)

## Comment utiliser

Vous pouvez soit utiliser le menu de navigation superieur pour acceder a une page d'index specifique,
en commencant par une selection grossiere. Par exemple, `Par Calcul` -> `EKS` ->
`Fargate` -> `Journaux`.

Alternativement, vous pouvez rechercher sur le site en appuyant sur `/` ou la touche `s` :

![espace o11y](images/search.png)

:::info
   "Licence"
  Toutes les recettes publiees sur ce site sont disponibles sous la
	licence [MIT-0][mit0], une modification de la licence MIT habituelle
	qui supprime l'exigence d'attribution.
:::

## Comment contribuer

Lancez une [discussion][discussion] sur ce que vous prevoyez de faire et nous partirons de la.

## En savoir plus

Les recettes de ce site sont une collection de bonnes pratiques. De plus, il existe
un certain nombre d'endroits ou vous pouvez en apprendre davantage sur l'etat des projets
open source que nous utilisons ainsi que sur les services geres des recettes, alors
consultez :

- [observability @ aws][o11yataws], une playlist de collaborateurs AWS parlant de
  leurs projets et services.
- [Ateliers AWS observability](https://aws-observability.github.io/observability-best-practices/recipes/workshops/), pour essayer les offres de maniere
  structuree.
- La [page d'accueil AWS monitoring and observability][o11yhome] avec des liens
  vers des etudes de cas et des partenaires.

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"
