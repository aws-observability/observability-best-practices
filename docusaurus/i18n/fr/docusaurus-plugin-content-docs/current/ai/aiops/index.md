---
sidebar_position: 2
---

# AIOps

Utilisation de l'IA et de l'apprentissage automatique pour ameliorer les operations cloud - detection d'anomalies, analyse automatisee des causes profondes, alertes predictives et remediation intelligente.

## Services AWS pour l'AIOps

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** - Informations alimentees par le ML pour detecter les comportements anormaux des applications et recommander des remediations
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** - Applique des algorithmes de ML pour analyser en continu les metriques et identifier les anomalies
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** - Decouvre et surveille automatiquement les services applicatifs et leurs dependances
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** - Investigation assistee par l'IA des problemes operationnels

## Meilleures pratiques

- Commencez par la detection d'anomalies sur les metriques commerciales cles avant de l'etendre a l'infrastructure
- Utilisez des alarmes composites pour reduire le bruit des detecteurs individuels bases sur le ML
- Combinez les signaux AIOps avec le jugement humain - utilisez le ML pour faire remonter les problemes, pas pour remedier automatiquement aux systemes critiques sans verification
- Alimentez les runbooks operationnels et les donnees d'incidents passes pour ameliorer les investigations assistees par l'IA
