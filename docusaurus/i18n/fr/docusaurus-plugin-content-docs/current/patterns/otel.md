# Observability avec OpenTelemetry

OpenTelemetry est un framework d'observabilité open source et neutre vis-à-vis des fournisseurs qui offre un moyen standardisé de collecter et d'exporter des données de télémétrie, y compris les logs, les métriques et les traces. En exploitant OpenTelemetry, les organisations peuvent mettre en oeuvre un pipeline d'observabilité complet tout en assurant l'indépendance vis-à-vis des fournisseurs et en pérennisant leur stratégie d'observabilité.

## Collecte de métriques et d'informations avec OpenTelemetry

1. **Instrumentation** : La première étape dans l'utilisation d'OpenTelemetry est d'instrumenter vos applications et services avec les bibliothèques ou SDK OpenTelemetry. Ces bibliothèques capturent et exportent automatiquement les données de télémétrie, telles que les métriques, les traces et les logs, à partir du code de votre application.

2. **Collecte de métriques** : OpenTelemetry fournit un moyen standardisé de collecter et d'exporter des métriques depuis votre application. Ces métriques peuvent inclure des métriques système (CPU, mémoire, utilisation disque), des métriques au niveau applicatif (taux de requêtes, taux d'erreurs, latence) et des métriques métier personnalisées spécifiques à votre application.

3. **Traçage distribué** : OpenTelemetry prend en charge le traçage distribué, vous permettant de tracer les requêtes et les opérations à mesure qu'elles se propagent dans votre système distribué. Cela fournit des informations précieuses sur le flux de bout en bout des requêtes, l'identification des goulots d'étranglement et le dépannage des problèmes de performance.

4. **Journalisation** : Bien que le focus principal d'OpenTelemetry soit sur les métriques et les traces, il fournit également une API de journalisation structurée qui peut être utilisée pour capturer et exporter des données de logs. Cela garantit que les logs sont corrélés avec les autres données de télémétrie, fournissant une vue holistique du comportement de votre système.

5. **Exporters** : OpenTelemetry prend en charge divers exporters qui vous permettent d'envoyer des données de télémétrie vers différents backends ou plateformes d'observabilité. Les exporters populaires incluent Prometheus, Jaeger, Zipkin et les solutions d'observabilité natives du cloud comme AWS CloudWatch, Azure Monitor et Google Cloud Operations.

6. **Traitement et analyse des données** : Une fois les données de télémétrie exportées, vous pouvez exploiter les plateformes d'observabilité, les outils de surveillance ou les pipelines de traitement de données personnalisés pour analyser et visualiser les métriques, traces et logs collectés. Cette analyse peut fournir des informations sur les performances du système, identifier les goulots d'étranglement et aider au dépannage et à l'analyse des causes racines.
![Otel](./images/otel.png)
*Figure 1 : Cluster EKS envoyant des signaux d'observabilité avec ADOT et FluentBit*
<!--Ref: https://aws.amazon.com/blogs/architecture/amazon-cloudwatch-insights-for-amazon-eks-on-ec2-using-aws-distro-for-opentelemetry-helm-charts/-->

## Avantages de l'utilisation d'OpenTelemetry

1. **Neutralité vis-à-vis des fournisseurs** : OpenTelemetry est un projet open source et neutre vis-à-vis des fournisseurs, garantissant que votre stratégie d'observabilité n'est pas liée à un fournisseur ou une plateforme spécifique. Cette flexibilité vous permet de basculer entre les backends d'observabilité ou de combiner plusieurs solutions selon vos besoins.

2. **Standardisation** : OpenTelemetry fournit un moyen standardisé de collecter et d'exporter des données de télémétrie, permettant des formats de données cohérents et l'interopérabilité entre différents composants et systèmes.

3. **Pérennité** : En adoptant OpenTelemetry, vous pouvez pérenniser votre stratégie d'observabilité. À mesure que le projet évolue et que de nouvelles fonctionnalités et intégrations sont ajoutées, votre instrumentation existante peut être facilement mise à jour sans nécessiter de modifications significatives du code.

4. **Observabilité complète** : OpenTelemetry prend en charge plusieurs signaux de télémétrie (métriques, traces et logs), fournissant une vue complète du comportement et des performances de votre système.

5. **Écosystème et support communautaire** : OpenTelemetry dispose d'un écosystème croissant d'intégrations, d'outils et d'une communauté dynamique de contributeurs, assurant un développement et un support continus.

En exploitant OpenTelemetry pour l'observabilité, les organisations peuvent obtenir des informations approfondies sur leurs systèmes, permettant une surveillance proactive, un dépannage efficace et une prise de décision basée sur les données, tout en maintenant la flexibilité et l'indépendance vis-à-vis des fournisseurs dans leur stratégie d'observabilité.
