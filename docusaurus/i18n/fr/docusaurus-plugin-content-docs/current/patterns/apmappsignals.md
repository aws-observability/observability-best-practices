# APM avec Application Signals

Dans le monde en constante évolution du développement d'applications modernes, assurer des performances optimales et atteindre les objectifs de niveau de service (SLO) est crucial pour offrir une expérience utilisateur fluide et maintenir la continuité des activités. Amazon CloudWatch Application Signals, une fonctionnalité de surveillance des performances applicatives (APM) compatible OpenTelemetry (OTel), révolutionne la façon dont les organisations surveillent et dépannent leurs applications fonctionnant sur AWS.

CloudWatch Application Signals adopte une approche holistique de la surveillance des performances applicatives en corrélant de manière transparente les données de télémétrie provenant de multiples sources, notamment les métriques, les traces, les logs, la surveillance des utilisateurs réels et la surveillance synthétique. Cette approche intégrée permet aux organisations d'obtenir des informations complètes sur les performances de leurs applications, d'identifier les causes racines des problèmes et de traiter proactivement les perturbations potentielles.

L'un des principaux avantages de CloudWatch Application Signals est ses capacités d'instrumentation et de suivi automatiques. Sans effort manuel ni code personnalisé requis, Application Signals fournit un tableau de bord standardisé préconstruit qui affiche les métriques les plus critiques pour les performances applicatives - volume, disponibilité, latence, défauts et erreurs - pour chaque application fonctionnant sur AWS. Cette approche rationalisée élimine le besoin de tableaux de bord personnalisés, permettant aux opérateurs de service d'évaluer rapidement la santé et les performances des applications par rapport à leurs SLO définis.

![APM](./images/apm.png)
*Figure 1 : Cloudwatch Application Signals envoyant des métriques, des logs et des traces*

CloudWatch Application Signals offre aux organisations les capacités suivantes :

1. **Surveillance complète des performances applicatives** : Application Signals fournit une vue unifiée des performances applicatives, combinant les informations provenant des métriques, des traces, des logs, de la surveillance des utilisateurs réels et de la surveillance synthétique. Cette approche holistique permet aux organisations d'identifier les goulots d'étranglement de performance, d'identifier les causes racines et de prendre des mesures proactives pour assurer des performances applicatives optimales.

2. **Instrumentation et suivi automatiques** : Sans effort manuel ni code personnalisé requis, Application Signals instrumente et suit automatiquement les performances applicatives par rapport aux SLO définis. Cette approche rationalisée réduit la surcharge associée à l'instrumentation et à la configuration manuelles, permettant aux organisations de se concentrer sur le développement et l'optimisation des applications.

3. **Tableau de bord et visualisation standardisés** : Application Signals offre un tableau de bord standardisé préconstruit qui affiche les métriques les plus critiques pour les performances applicatives, notamment le volume, la disponibilité, la latence, les défauts et les erreurs. Cette vue standardisée permet aux opérateurs de service d'évaluer rapidement la santé et les performances des applications, facilitant la prise de décision éclairée et la résolution proactive des problèmes.

4. **Corrélation et dépannage transparents** : En corrélant les données de télémétrie provenant de multiples sources, Application Signals simplifie le processus de dépannage. Les opérateurs de service peuvent explorer de manière transparente les traces, logs et métriques corrélés pour identifier la cause racine des problèmes de performance ou des anomalies, réduisant le temps moyen de résolution (MTTR) et minimisant les perturbations applicatives.

5. **Intégration avec Container Insights** : Pour les applications fonctionnant dans des environnements conteneurisés, CloudWatch Application Signals s'intègre de manière transparente avec Container Insights, permettant aux organisations d'identifier les problèmes liés à l'infrastructure qui peuvent impacter les performances applicatives, tels que les pénuries de mémoire ou l'utilisation élevée du CPU sur les pods de conteneurs.

Pour exploiter CloudWatch Application Signals pour la surveillance des performances applicatives, les organisations peuvent suivre ces étapes générales :

1. **Activer Application Signals** : Activez CloudWatch Application Signals pour vos applications fonctionnant sur AWS, soit via la console de gestion AWS, l'interface en ligne de commande AWS (CLI), ou de manière programmatique à l'aide des SDK AWS.

2. **Définir les objectifs de niveau de service (SLO)** : Établissez et configurez les SLO souhaités pour vos applications, tels que la disponibilité cible, la latence maximale ou les seuils d'erreur, pour s'aligner avec les exigences métier et les attentes des clients.

3. **Surveiller et analyser les performances** : Utilisez le tableau de bord standardisé préconstruit fourni par Application Signals pour surveiller les performances applicatives par rapport aux SLO définis. Analysez les métriques, les traces, les logs, les données de surveillance des utilisateurs réels et de surveillance synthétique pour identifier les problèmes de performance ou les anomalies.

4. **Dépanner et résoudre les problèmes** : Exploitez les capacités de corrélation transparente d'Application Signals pour explorer les traces, logs et métriques corrélés, permettant une identification et une résolution rapides des problèmes de performance ou des causes racines.

5. **Intégrer avec Container Insights (le cas échéant)** : Pour les applications conteneurisées, intégrez CloudWatch Application Signals avec Container Insights pour identifier les problèmes liés à l'infrastructure qui peuvent impacter les performances applicatives.

Bien que CloudWatch Application Signals offre de puissantes capacités de surveillance des performances applicatives, il est important de considérer les défis potentiels tels que la gestion du volume de données et des coûts. À mesure que la complexité et l'échelle des applications augmentent, le volume de données de télémétrie générées peut croître significativement, impactant potentiellement les performances et entraînant des coûts supplémentaires. La mise en oeuvre de stratégies d'échantillonnage des données, de politiques de rétention et de techniques d'optimisation des coûts peut être nécessaire pour assurer une solution de surveillance efficace et rentable.

De plus, assurer un contrôle d'accès approprié et la sécurité des données pour vos données de performance applicative est crucial. CloudWatch Application Signals exploite AWS Identity and Access Management (IAM) pour un contrôle d'accès granulaire, et le chiffrement des données est appliqué aux données de télémétrie au repos et en transit, protégeant la confidentialité et l'intégrité de vos données de performance applicative.

En conclusion, CloudWatch Application Signals révolutionne la surveillance des performances applicatives pour les applications fonctionnant sur AWS. En fournissant une instrumentation automatique, des tableaux de bord standardisés et une corrélation transparente des données de télémétrie, Application Signals permet aux organisations de surveiller proactivement les performances applicatives, d'assurer le respect des SLO, et de dépanner et résoudre rapidement les problèmes de performance. Avec ses capacités d'intégration et sa compatibilité OpenTelemetry, CloudWatch Application Signals offre une solution complète et pérenne pour la surveillance des performances applicatives dans le cloud.
