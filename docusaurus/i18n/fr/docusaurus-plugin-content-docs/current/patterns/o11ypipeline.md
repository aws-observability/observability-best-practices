# Pipeline d'Observability ADOT

Le pipeline d'observability se compose de plusieurs composants qui travaillent ensemble pour collecter, gerer et analyser les donnees d'observability provenant de diverses sources.

## Cluster EKS

Le cluster EKS (Elastic Kubernetes Service) heberge les composants principaux du pipeline d'observability.

### Installation du Helm Chart de l'operateur ADOT

L'operateur ADOT (AWS Distro for OpenTelemetry) est installe en utilisant un Helm chart. Il gere le deploiement et la configuration des composants du pipeline d'observability.

### Collecteur configure par l'utilisateur

Le collecteur configure par l'utilisateur est gere par l'operateur et se compose des composants suivants :

- Collecteur en tant que Deployment : Le collecteur est deploye comme un Deployment Kubernetes, ce qui assure la haute disponibilite et l'evolutivite.
- Collector-0, Collector-1, Collector-2 : Plusieurs instances de collecteur sont deployees pour gerer les donnees d'observability entrantes. Elles travaillent ensemble pour distribuer la charge de travail et assurer une collecte de donnees fiable.

![OTEL pipeline](./images/otelpipeline.png)
*Figure 1 : Pipeline OpenTelemetry*

### Volume persistant

Le volume persistant est utilise pour stocker les donnees d'observability collectees. Il assure la durabilite des donnees et permet un stockage et une analyse a long terme.

### Noeud Kubernetes

Le noeud Kubernetes heberge les pods d'application et le collecteur en tant que sidecar.

- Conteneur d'application : Le conteneur d'application execute le code applicatif reel et genere des donnees d'observability.
- Collecteur en tant que sidecar : Le collecteur s'execute comme un conteneur sidecar aux cotes du conteneur d'application. Il collecte les donnees d'observability generees par l'application.

## Cibles de scraping

Le pipeline d'observability collecte des donnees depuis diverses cibles de scraping, telles que :

- Scraping de traces/metriques : Le pipeline effectue le scraping des traces et metriques depuis l'application et les composants d'infrastructure.

## AWS Prometheus Remote Write Exporter

L'AWS Prometheus Remote Write Exporter est utilise pour exporter les donnees d'observability collectees vers les services AWS.

## AWS CloudWatch EMF Exporter

L'AWS CloudWatch EMF (Embedded Metric Format) Exporter est utilise pour exporter les metriques vers AWS CloudWatch.

## AWS X-Ray Tracing Exporter

L'AWS X-Ray Tracing Exporter est utilise pour exporter les donnees de tracage vers AWS X-Ray pour le tracage distribue et l'analyse des performances.

Le pipeline d'observability collecte les donnees depuis les cibles de scraping, les traite en utilisant les collecteurs, et les exporte vers divers services AWS pour une analyse et une visualisation ulterieures.


## Collecte de metriques et informations avec ADOT

1. **Instrumentation** : Similaire a OpenTelemetry, ADOT fournit des bibliotheques et des SDK pour instrumenter vos applications et services, capturant les donnees de telemetrie telles que les metriques, les traces et les logs.

2. **Collecte de metriques** : ADOT prend en charge la collecte et l'exportation de metriques au niveau systeme et applicatif, y compris les metriques des services AWS, fournissant des informations sur l'utilisation des ressources et les performances applicatives.

3. **Tracage distribue** : ADOT permet le tracage distribue a travers les services AWS, les conteneurs et les environnements sur site, vous permettant de tracer les requetes et operations de bout en bout.

4. **Journalisation** : ADOT inclut la prise en charge de la journalisation structuree, correlant les donnees de logs avec d'autres signaux de telemetrie pour une observability complete.

5. **Integrations avec les services AWS** : ADOT fournit des integrations etroites avec les services AWS comme AWS X-Ray, AWS CloudWatch, Amazon Managed Service for Prometheus et AWS Distro for OpenTelemetry Operator, permettant une collecte et une analyse transparentes de la telemetrie au sein de l'ecosysteme AWS.

6. **Instrumentation automatique** : ADOT offre des capacites d'instrumentation automatique pour les frameworks et bibliotheques populaires, simplifiant le processus d'instrumentation des applications existantes.

7. **Traitement et analyse des donnees** : Les donnees de telemetrie collectees par ADOT peuvent etre exportees vers les services d'observability AWS comme AWS X-Ray, Amazon Managed Service for Prometheus et AWS CloudWatch, exploitant les outils natifs AWS d'analyse et de visualisation.

## Avantages de l'utilisation d'ADOT

1. **Integration native AWS** : ADOT est concu pour s'integrer de maniere transparente avec les services et l'infrastructure AWS, fournissant une experience d'observability coherente au sein de l'ecosysteme AWS.

2. **Performance et evolutivite** : ADOT est optimise pour la performance et l'evolutivite, permettant une collecte et une analyse efficaces de la telemetrie dans les environnements AWS a grande echelle.

3. **Securite et conformite** : ADOT adhere aux bonnes pratiques de securite AWS et est conforme a divers standards de l'industrie, assurant des pratiques d'observability securisees et conformes.

4. **Support AWS** : En tant que distribution supportee par AWS, ADOT beneficie de la documentation extensive d'AWS, des canaux de support et de l'engagement a long terme envers le projet OpenTelemetry.

## Difference entre OpenTelemetry et ADOT

Bien qu'ADOT et OpenTelemetry partagent de nombreuses capacites fondamentales, il existe quelques differences cles :

1. **Integration AWS** : ADOT est concu specifiquement pour les environnements AWS et fournit des integrations etroites avec les services AWS, tandis qu'OpenTelemetry est un projet neutre vis-a-vis des fournisseurs.

2. **Optimisation AWS** : ADOT est optimise pour la performance, l'evolutivite et la securite au sein des environnements AWS, exploitant les services et bonnes pratiques natives AWS.

3. **Support AWS** : ADOT beneficie du support officiel AWS, de la documentation et de l'engagement a long terme, tandis qu'OpenTelemetry repose sur le support de la communaute.

4. **Fonctionnalites specifiques AWS** : ADOT inclut des fonctionnalites specifiques a AWS et l'instrumentation automatique pour les services AWS, tandis qu'OpenTelemetry se concentre sur l'observability a usage general.

5. **Neutralite fournisseur** : OpenTelemetry est un projet neutre vis-a-vis des fournisseurs, permettant l'integration avec diverses plateformes d'observability, tandis qu'ADOT est principalement axe sur les services d'observability AWS.

En exploitant ADOT, les organisations peuvent atteindre une observability complete au sein de l'ecosysteme AWS, beneficiant des integrations natives AWS, de performances optimisees et du support AWS, tout en maintenant la flexibilite d'exploiter les capacites et contributions de la communaute OpenTelemetry.
