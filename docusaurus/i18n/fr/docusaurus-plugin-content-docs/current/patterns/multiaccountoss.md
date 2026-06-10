# Surveillance multi-comptes avec les services open source AWS

## Introduction

Les environnements cloud modernes s'etendent souvent sur plusieurs comptes et incluent une infrastructure sur site, creant des defis de surveillance complexes. Pour relever ces defis, une architecture de surveillance sophistiquee peut etre implementee en utilisant les services AWS et des outils standards de l'industrie. Cette architecture permet une visibilite complete a travers des environnements divers, facilitant une gestion efficace et une resolution rapide des problemes.

## Composants principaux

Au coeur de cette solution de surveillance se trouve AWS Distro for OpenTelemetry (ADOT), qui sert de point de collecte centralise pour les metriques provenant de diverses sources. ADOT est deploye dans un compte AWS central dedie, formant le hub de l'infrastructure de surveillance. Ce deploiement central permet une agregation et un traitement rationalises des donnees.

Amazon Managed Service for Prometheus est un autre composant crucial, fournissant une base de donnees de series temporelles evolutive et geree pour stocker les metriques collectees. Ce service elimine le besoin d'instances Prometheus auto-gerees, reduisant la charge operationnelle et assurant une haute disponibilite des donnees de metriques.

Pour la visualisation et l'analyse, Grafana est integre dans l'architecture. Grafana se connecte a Amazon Managed Service for Prometheus, offrant de puissantes capacites de requetage et des tableaux de bord personnalisables. Cela permet aux equipes de creer des visualisations pertinentes et de configurer des alertes basees sur les metriques collectees.

![multiaccount AMP](./images/multiaccountoss.png)
*Figure 1 : Surveillance multi-comptes avec les services open source AWS*

## Collecte et flux de donnees

L'architecture prend en charge la collecte de donnees depuis plusieurs comptes AWS, appeles comptes surveilles. Ces comptes utilisent le protocole OpenTelemetry (OTLP) pour exporter leurs metriques vers l'instance ADOT centrale. Cette approche standardisee assure la coherence du format des donnees et facilite l'integration facile de nouveaux comptes dans la configuration de surveillance.

L'infrastructure sur site est egalement incorporee dans cette solution de surveillance. Ces systemes envoient leurs donnees de metriques a l'instance ADOT centrale en utilisant des requetes HTTPS POST securisees. Cette methode permet l'inclusion de systemes existants ou non-cloud dans la strategie de surveillance globale, fournissant une vue veritablement complete de l'ensemble de l'environnement IT.

Une fois que les donnees atteignent l'instance ADOT centrale, elles sont traitees et transmises a Amazon Managed Service for Prometheus en utilisant le protocole Prometheus remote write. Cette etape assure que toutes les metriques collectees sont stockees dans un format optimise pour les donnees de series temporelles, permettant un requetage et une analyse efficaces.

## Avantages et considerations

Cette architecture offre plusieurs avantages cles. Elle fournit une vue centralisee des metriques provenant de sources diverses, permettant une surveillance holistique d'environnements complexes. L'utilisation de services geres reduit la charge operationnelle sur les equipes, leur permettant de se concentrer sur l'analyse plutot que sur la maintenance de l'infrastructure. De plus, l'architecture est hautement evolutive, capable de s'adapter a la croissance tant en nombre de systemes surveilles qu'en volume de metriques collectees.

Cependant, l'implementation de cette architecture comporte egalement des considerations. La nature centralisee de la solution signifie que l'infrastructure de surveillance dans le compte central devient critique, necessitant une planification soignee pour la haute disponibilite et la reprise apres sinistre. Il peut egalement y avoir des implications de cout associees au transfert de donnees entre comptes et a l'utilisation de services geres, qui doivent etre pris en compte dans les decisions budgetaires.

La securite est un autre aspect important a considerer. Des roles et permissions IAM appropriees doivent etre configures pour permettre la collecte securisee de metriques entre comptes. Pour les systemes sur site, assurer des connexions HTTPS securisees et authentifiees est crucial pour maintenir l'integrite et la confidentialite des donnees de surveillance.

## Conclusion

Cette architecture avancee de surveillance cloud AWS fournit une solution robuste pour les organisations avec des environnements d'infrastructure complexes, multi-comptes et hybrides. En exploitant les services geres AWS et les outils standards de l'industrie comme OpenTelemetry et Grafana, elle offre une solution de surveillance evolutive et puissante. Bien qu'elle necessite une planification et une gestion soignees pour etre implementee efficacement, les avantages d'une visibilite complete et d'une surveillance centralisee en font une approche precieuse pour les environnements modernes cloud-natifs et hybrides.

La flexibilite de cette architecture lui permet de s'adapter aux divers besoins organisationnels et peut evoluer au fur et a mesure que les exigences de surveillance changent. A mesure que les environnements cloud continuent de croitre en complexite, disposer d'une telle solution de surveillance centralisee et complete devient de plus en plus critique pour maintenir l'excellence operationnelle et assurer des performances optimales a travers tous les composants d'infrastructure.
