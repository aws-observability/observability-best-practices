# Surveillance des charges de travail ECS
<!--with ADOT, AWS X-Ray, and Amazon Managed Service for Prometheus-->

## Introduction

Dans le monde des applications conteneurisees, une surveillance efficace est cruciale pour maintenir la fiabilite et les performances. Ce document presente une solution de surveillance avancee pour les charges de travail Amazon Elastic Container Service (ECS), exploitant AWS Distro for OpenTelemetry (ADOT), AWS X-Ray et Amazon Managed Service for Prometheus.

## Vue d'ensemble de l'architecture

L'architecture de surveillance est centree autour d'une tache ECS qui heberge a la fois l'application et un collecteur ADOT. Cette configuration permet une collecte complete de donnees directement depuis l'environnement applicatif.

![ECS AMP](./images/ecs.png)
*Figure 1 : Envoi de metriques depuis ECS vers AMP et X-Ray*

## Composants cles

### Tache ECS
La tache ECS sert d'unite fondamentale, encapsulant l'application et les composants de surveillance.

### Application exemple
Une application conteneurisee s'execute dans la tache ECS, representant la charge de travail a surveiller.

### Collecteur AWS Distro for OpenTelemetry (ADOT)
Le collecteur ADOT, deploye aux cotes de l'application, agit comme un point d'agregation central pour les donnees de telemetrie. Il collecte a la fois les metriques et les traces de l'application.

### AWS X-Ray
X-Ray recoit les donnees de trace du collecteur ADOT, fournissant des informations detaillees sur les flux de requetes et les dependances entre services.

### Amazon Managed Service for Prometheus
Ce service stocke et gere les metriques collectees par le collecteur ADOT, offrant une solution evolutive pour le stockage et le requetage de metriques.

## Flux de donnees

1. L'application exemple genere des donnees de telemetrie pendant son fonctionnement.
2. Le collecteur ADOT, s'executant dans la meme tache ECS, collecte ces donnees depuis l'application.
3. Les donnees de trace sont transmises a AWS X-Ray pour l'analyse du tracage distribue.
4. Les metriques sont envoyees a Amazon Managed Service for Prometheus pour le stockage et l'analyse ulterieure.

## Avantages

- **Surveillance complete** : Capture a la fois les metriques et les traces, fournissant une vue holistique des performances applicatives.
- **Evolutivite** : Exploite les services geres pour gerer de grands volumes de donnees de telemetrie.
- **Integration** : Fonctionne de maniere transparente avec ECS et d'autres services AWS.
- **Charge operationnelle reduite** : Utilise des services geres, minimisant le besoin de gestion d'infrastructure.

## Considerations d'implementation

- Des roles et permissions IAM appropriees doivent etre configures pour la tache ECS afin de permettre la transmission de donnees vers X-Ray et Prometheus.
- L'allocation de ressources au sein de la tache ECS doit tenir compte a la fois de l'application et du collecteur ADOT.
- Envisagez d'implementer la collecte de logs en complement des metriques et traces pour une solution d'observability complete.

## Conclusion

Cette architecture fournit une solution de surveillance robuste pour les charges de travail ECS, combinant la puissance d'OpenTelemetry avec les services geres AWS. Elle permet des informations approfondies sur les performances et le comportement des applications, facilitant la resolution rapide des problemes et la prise de decisions eclairees pour les environnements conteneurises.
