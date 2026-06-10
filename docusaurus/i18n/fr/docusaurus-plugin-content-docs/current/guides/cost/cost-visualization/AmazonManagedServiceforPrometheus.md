# Surveillance des coûts en temps réel

Amazon Managed Service for Prometheus est un service de surveillance compatible Prometheus sans serveur pour les métriques de conteneurs qui facilite la surveillance sécurisée des environnements de conteneurs à grande échelle. Le modèle de tarification d'Amazon Managed Service for Prometheus est basé sur les échantillons de métriques ingérés, les échantillons de requêtes traités et les métriques stockées. Vous pouvez trouver les derniers détails de tarification [ici][pricing].

En tant que service géré, Amazon Managed Service for Prometheus met automatiquement à l'échelle l'ingestion, le stockage et l'interrogation des métriques opérationnelles au fur et à mesure que les charges de travail augmentent et diminuent. Certains de nos clients nous ont demandé des conseils sur la façon de suivre le `taux d'ingestion d'échantillons de métriques` et son coût en temps réel. Voyons comment vous pouvez y parvenir.

### Solution
Amazon Managed Service for Prometheus [publie des métriques d'utilisation][vendedmetrics] vers Amazon CloudWatch. Ces métriques peuvent être utilisées pour vous aider à obtenir une meilleure visibilité sur votre espace de travail Amazon Managed Service for Prometheus. Les métriques publiées se trouvent dans les espaces de noms `AWS/Usage` et `AWS/Prometheus` dans CloudWatch et ces [métriques][AMPMetrics] sont disponibles dans CloudWatch sans frais supplémentaires. Vous pouvez toujours créer un tableau de bord CloudWatch pour explorer et visualiser davantage ces métriques.

Aujourd'hui, vous utiliserez Amazon CloudWatch comme source de données pour Amazon Managed Grafana et créerez des tableaux de bord dans Grafana pour visualiser ces métriques. Le diagramme d'architecture illustre ce qui suit.

- Amazon Managed Service for Prometheus publiant des métriques d'utilisation vers Amazon CloudWatch

- Amazon CloudWatch comme source de données pour Amazon Managed Grafana

- Les utilisateurs accédant aux tableaux de bord créés dans Amazon Managed Grafana

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Tableaux de bord Amazon Managed Grafana

Le tableau de bord créé dans Amazon Managed Grafana vous permettra de visualiser :

1. Le taux d'ingestion Prometheus par espace de travail
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. Le taux d'ingestion Prometheus et le coût en temps réel par espace de travail
   Pour le suivi des coûts en temps réel, vous utiliserez une `expression mathématique` basée sur la tarification du `Metrics Ingested Tier` pour les `2 premiers milliards d'échantillons` mentionnée dans le [document de tarification AWS][pricing] officiel. Les opérations mathématiques prennent des nombres et des séries temporelles en entrée et les transforment en différents nombres et séries temporelles. Consultez ce [document][mathexpression] pour une personnalisation supplémentaire adaptée à vos besoins métier.
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. Les séries actives Prometheus par espace de travail
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)


Un tableau de bord dans Grafana est représenté par un objet JSON qui stocke les métadonnées du tableau de bord. Les métadonnées incluent les propriétés du tableau de bord, les métadonnées des panneaux, les variables de modèle, les requêtes de panneau, etc.

Vous pouvez accéder au **modèle JSON** du tableau de bord ci-dessus <mark>[ici](AmazonPrometheusMetrics.json).</mark>

Avec le tableau de bord précédent, vous pouvez maintenant identifier le taux d'ingestion par espace de travail et surveiller le coût en temps réel par espace de travail basé sur le taux d'ingestion de métriques pour Amazon Managed Service for Prometheus. Vous pouvez utiliser d'autres [panneaux de tableau de bord][panels] Grafana pour créer des visuels adaptés à vos besoins.

[pricing]: https://aws.amazon.com/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
