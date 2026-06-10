# Surveillance EKS avec les services open source AWS
<!-- Workloads with Node Exporter, Amazon Managed Prometheus, and Grafana Visualization
-->
Dans le monde des applications conteneurisées et de Kubernetes, la surveillance et l'observabilité sont cruciales pour assurer la fiabilité, les performances et l'efficacité de vos charges de travail. Amazon Elastic Kubernetes Service (EKS) fournit une plateforme puissante et évolutive pour déployer et gérer des applications conteneurisées, et lorsqu'il est combiné avec des outils comme Node Exporter, Amazon Managed Prometheus et Grafana, vous pouvez mettre en place une solution de surveillance complète pour vos charges de travail EKS.

Node Exporter est un exporter Prometheus qui expose un large éventail de métriques matérielles et liées au noyau d'une machine hôte. En déployant Node Exporter en tant que DaemonSet dans votre cluster EKS, vous pouvez collecter des métriques précieuses de chaque noeud worker, y compris l'utilisation du CPU, de la mémoire, du disque et du réseau, ainsi que diverses métriques au niveau système.

Amazon Managed Prometheus est un service entièrement géré fourni par AWS qui simplifie le déploiement, la gestion et la mise à l'échelle de l'infrastructure de surveillance Prometheus. En intégrant Node Exporter avec Amazon Managed Prometheus, vous pouvez collecter et stocker les métriques au niveau des noeuds de manière hautement disponible et évolutive, sans la surcharge de gestion et de mise à l'échelle des instances Prometheus vous-même.

Grafana est un outil puissant open source de visualisation de données et de surveillance qui s'intègre de manière transparente avec Prometheus. En configurant Grafana pour se connecter à votre instance Amazon Managed Prometheus, vous pouvez créer des tableaux de bord riches et personnalisables qui fournissent des informations en temps réel sur la santé et les performances de vos charges de travail EKS et de l'infrastructure sous-jacente.

![EKS AMP AMG](./images/eksnodeexporterampamg.png)
*Figure 1 : Métriques des noeuds EKS envoyées à AMP et visualisées avec AMG*


Le déploiement de cette pile de surveillance dans votre cluster EKS offre plusieurs avantages :

1. Visibilité complète : En collectant les métriques de Node Exporter et en les visualisant dans Grafana, vous obtenez une visibilité de bout en bout sur vos charges de travail EKS, du niveau applicatif jusqu'à l'infrastructure sous-jacente, vous permettant d'identifier et de traiter proactivement les problèmes.

2. Évolutivité et fiabilité : Amazon Managed Prometheus et Grafana sont conçus pour être hautement évolutifs et fiables, garantissant que votre solution de surveillance peut croître de manière transparente à mesure que vos charges de travail EKS évoluent, sans compromettre les performances ou la disponibilité.

3. Surveillance centralisée : Avec Amazon Managed Prometheus agissant comme une plateforme de surveillance centralisée, vous pouvez consolider les métriques de multiples clusters EKS, vous permettant de surveiller et de comparer les charges de travail à travers différents environnements ou régions.

4. Tableaux de bord et alertes personnalisés : Les puissantes capacités de tableau de bord et d'alerte de Grafana vous permettent de créer des visualisations personnalisées adaptées à vos besoins spécifiques de surveillance, vous permettant de mettre en évidence les métriques pertinentes et de configurer des alertes pour les événements critiques ou les seuils.

5. Intégration avec les services AWS : Amazon Managed Prometheus s'intègre de manière transparente avec d'autres services AWS, tels qu'Amazon CloudWatch et AWS X-Ray, vous permettant de corréler et de visualiser les métriques provenant de diverses sources au sein d'une solution de surveillance unifiée.

Pour implémenter cette pile de surveillance dans votre cluster EKS, vous devrez suivre ces étapes générales :

1. Déployez Node Exporter en tant que DaemonSet sur vos noeuds worker EKS pour collecter les métriques au niveau des noeuds.
2. Configurez un workspace Amazon Managed Prometheus et configurez-le pour scraper les métriques de Node Exporter.
3. Installez et configurez Grafana, soit au sein de votre cluster EKS, soit comme service séparé, et connectez-le à votre workspace Amazon Managed Prometheus.
4. Créez des tableaux de bord Grafana personnalisés et configurez des alertes selon vos exigences de surveillance.

Bien que cette solution de surveillance fournisse des capacités puissantes, il est important de considérer la surcharge potentielle et la consommation de ressources introduites par Node Exporter, Prometheus et Grafana. Une planification et une allocation de ressources soigneuses sont nécessaires pour s'assurer que vos composants de surveillance ne concurrencent pas vos charges de travail applicatives pour les ressources.

De plus, vous devez vous assurer que votre solution de surveillance adhère aux meilleures pratiques en matière de sécurité des données, de contrôle d'accès et de politiques de rétention. La mise en oeuvre de canaux de communication sécurisés, de mécanismes d'authentification et de chiffrement des données est cruciale pour maintenir la confidentialité et l'intégrité de vos données de surveillance.

En conclusion, le déploiement de Node Exporter, Amazon Managed Prometheus et Grafana dans votre cluster EKS fournit une solution de surveillance complète pour vos charges de travail conteneurisées. En exploitant ces outils, vous pouvez obtenir des informations approfondies sur les performances et la santé de vos applications, permettant une détection proactive des problèmes, une utilisation efficace des ressources et une prise de décision éclairée. Cependant, il est essentiel de planifier et d'implémenter soigneusement cette pile de surveillance, en tenant compte de la consommation de ressources, de la sécurité et des exigences de conformité pour assurer une solution de surveillance efficace et robuste pour vos charges de travail EKS.
