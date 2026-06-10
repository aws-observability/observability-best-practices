# CloudWatch Container Insights

## Introduction

Amazon CloudWatch Container Insights est un outil puissant pour collecter, agreger et resumer les metriques et logs des applications conteneurisees et des microservices. Ce document fournit un apercu de l'integration entre ADOT et CloudWatch Container Insights pour les charges de travail EKS Fargate, y compris sa conception, son processus de deploiement et ses avantages.

## Conception du collecteur ADOT pour EKS Fargate

Le collecteur ADOT utilise une architecture en pipeline composee de trois composants principaux :

1. Receiver : Accepte les donnees dans un format specifie et les traduit dans un format interne.
2. Processor : Effectue des taches telles que le regroupement par lots, le filtrage et les transformations sur les donnees.
3. Exporter : Determine la destination pour l'envoi des metriques, logs ou traces.

Pour EKS Fargate, le collecteur ADOT utilise un Prometheus Receiver pour scraper les metriques depuis le serveur API Kubernetes, qui agit comme un proxy pour le kubelet sur les noeuds de travail. Cette approche est necessaire en raison des limitations reseau dans EKS Fargate qui empechent l'acces direct au kubelet. Les metriques collectees passent par une serie de processeurs pour le filtrage, le renommage, l'agregation de donnees et la conversion. Finalement, l'AWS CloudWatch EMF Exporter convertit les metriques au format de metrique integre (EMF) et les envoie a CloudWatch Logs.

![CI EKS fargate with ADOT](./images/cieksfargateadot.png)
*Figure 1 : Container Insights avec ADOT sur EKS Fargate*
<!--https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/
-->
## Processus de deploiement

Pour deployer le collecteur ADOT sur un cluster EKS Fargate :

1. Creer un cluster EKS avec Kubernetes
2. Configurer un role d'execution de pod Fargate.
3. Definir les profils Fargate pour les espaces de noms necessaires.
4. Creer un role IAM pour le collecteur ADOT avec les permissions requises.
5. Deployer le collecteur ADOT en tant que StatefulSet Kubernetes en utilisant le manifeste fourni.
6. Deployer des charges de travail exemples pour tester la collecte de metriques.


## Avantages et inconvenients

### Avantages :

1. Surveillance unifiee : Fournit une experience de surveillance coherente a travers les charges de travail EKS EC2 et Fargate.
2. Evolutivite : Une seule instance du collecteur ADOT peut decouvrir et collecter les metriques de tous les noeuds de travail dans un cluster EKS.
3. Metriques riches : Collecte un ensemble complet de metriques systeme, y compris l'utilisation du CPU, de la memoire, du disque et du reseau.
4. Integration facile : S'integre de maniere transparente avec les tableaux de bord et alarmes CloudWatch existants.
5. Rentable : Permet la surveillance des charges de travail Fargate sans besoin d'infrastructure de surveillance supplementaire.

### Inconvenients :

1. Complexite de configuration : La mise en place du collecteur ADOT necessite une configuration soignee des roles IAM, des profils Fargate et des ressources Kubernetes.
2. Surcharge de ressources : Le collecteur ADOT lui-meme consomme des ressources sur le cluster Fargate, ce qui doit etre pris en compte dans la planification de capacite.


L'integration d'AWS Distro for OpenTelemetry avec CloudWatch Container Insights pour les charges de travail EKS Fargate fournit une solution puissante pour la surveillance des applications conteneurisees. Elle offre une experience de surveillance unifiee a travers differentes options de deploiement EKS et exploite l'evolutivite et la flexibilite du framework OpenTelemetry. En permettant la collecte de metriques systeme depuis les charges de travail Fargate, cette integration permet aux clients d'obtenir des informations plus approfondies sur les performances de leurs applications, de prendre des decisions de mise a l'echelle eclairees et d'optimiser l'utilisation des ressources.
