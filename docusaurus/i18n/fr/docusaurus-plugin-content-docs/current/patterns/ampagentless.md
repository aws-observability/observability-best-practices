# Envoi de metriques depuis EKS vers Prometheus

Lors de l'execution de charges de travail conteneurisees sur Amazon Elastic Kubernetes Service (EKS), vous pouvez exploiter AWS Managed Prometheus (AMP) pour collecter et analyser les metriques de vos applications et de votre infrastructure. AMP simplifie le deploiement et la gestion de la surveillance compatible Prometheus en fournissant une solution de surveillance entierement geree et compatible Prometheus.

Pour envoyer les metriques de vos charges de travail conteneurisees EKS vers AMP, vous pouvez utiliser la configuration du Managed Prometheus Collector. Le Managed Prometheus Collector est un composant d'AMP qui scrape les metriques de vos applications et services et les envoie a l'espace de travail AMP pour le stockage et l'analyse.

![EKS AMP](./images/eksamp.png)
*Figure 1 : Envoi de metriques depuis EKS vers AMP*

## Configuration du Managed Prometheus Collector

1. **Activer l'espace de travail AMP** : Tout d'abord, assurez-vous d'avoir un espace de travail AMP cree dans votre compte AWS. Si vous n'avez pas encore configure un espace de travail AMP, suivez la documentation AWS pour en creer un.

2. **Configurer le Managed Prometheus Collector** : Dans votre espace de travail AMP, naviguez vers la section "Managed Prometheus Collectors" et creez une nouvelle configuration de collecteur.

3. **Definir la configuration de scraping** : Dans la configuration du collecteur, specifiez les cibles depuis lesquelles le collecteur doit scraper les metriques. Pour les charges de travail EKS, vous pouvez definir une configuration de decouverte de services Kubernetes qui permet au collecteur de decouvrir et scraper dynamiquement les metriques de vos Pods et Services Kubernetes.

  Exemple de configuration de decouverte de services Kubernetes :

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
Cette configuration indique au collecteur de scraper les metriques des Pods s'executant dans les espaces de noms Kubernetes namespace1 et namespace2.

4. **Configurer les annotations Prometheus** : Pour activer la collecte de metriques depuis vos charges de travail conteneurisees, vous devez annoter vos Pods ou Services Kubernetes avec les annotations Prometheus appropriees. Ces annotations fournissent des informations sur le endpoint de metriques et d'autres parametres de configuration.
Exemple d'annotations Prometheus :
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
Ces annotations indiquent que le collecteur Prometheus doit scraper les metriques depuis le endpoint /metrics sur le port 8080 du Pod ou Service.

5. **Deployer les charges de travail avec instrumentation** : Deployez vos charges de travail conteneurisees sur EKS, en vous assurant qu'elles exposent les endpoints de metriques appropriees et incluent les annotations Prometheus necessaires. Vous pouvez utiliser des outils comme Minikube, Helm ou AWS Cloud Development Kit (CDK) pour deployer et gerer vos charges de travail EKS.

6. **Verifier la collecte de metriques** : Une fois le Managed Prometheus Collector configure et vos charges de travail deployees, vous devriez voir les metriques collectees apparaitre dans l'espace de travail AMP. Vous pouvez utiliser l'editeur de requetes AMP pour explorer et visualiser les metriques de vos charges de travail EKS.

## Considerations supplementaires

- Authentification et autorisation : AMP prend en charge divers mecanismes d'authentification et d'autorisation, y compris les roles IAM et les comptes de service, pour securiser l'acces a vos donnees de surveillance.

- Integration avec les services d'Observability AWS : Vous pouvez integrer AMP avec d'autres services d'observability AWS, tels qu'AWS CloudWatch et AWS X-Ray, pour une observability complete a travers votre environnement AWS.

En exploitant le Managed Prometheus Collector dans AMP, vous pouvez collecter et analyser efficacement les metriques de vos charges de travail conteneurisees EKS sans avoir besoin de gerer et de mettre a l'echelle l'infrastructure Prometheus sous-jacente. AMP fournit une solution entierement geree et evolutive pour la surveillance de vos applications et de votre infrastructure EKS.
