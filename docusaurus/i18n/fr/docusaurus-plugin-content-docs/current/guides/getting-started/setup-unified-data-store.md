---
sidebar_position: 2
---

# Configurer le magasin de données unifié

En plus de l'observabilité inter-comptes, vous pouvez également centraliser (copier) les journaux vers une région et un compte centraux.

Le CloudWatch Unified Data Store vous aide à construire un référentiel unifié à grande échelle pour votre organisation. Vous pouvez collecter, structurer et analyser votre télémétrie depuis cet emplacement.

## Vue d'ensemble

CloudWatch Unified Data Store vous permet de centraliser vos données applicatives, opérationnelles, de sécurité et de conformité en un seul endroit. Cela signifie que vous pouvez centraliser vos données de journaux provenant de plusieurs comptes/régions AWS, ainsi que d'outils tiers, dans un seul compte et une seule région pour une interrogation et une analyse centralisées.

![Unified Data Store](../../images/GettingStarted/UDS.png)

Vous pouvez utiliser le Unified Data Store en conjonction avec l'observabilité inter-comptes ou de manière indépendante.

## Avantages clés

- **Centraliser toutes les données d'observabilité** – Consolider les données opérationnelles, de sécurité et de conformité provenant des services AWS et de sources tierces dans un magasin unifié unique à travers plusieurs comptes et régions

- **Eliminer les silos de données et la duplication** – Supprimer les pipelines ETL inutiles, réduire les coûts de stockage et simplifier la gestion en stockant les données une seule fois dans un emplacement unique

- **Accélérer le dépannage et réduire le MTTR** – Obtenir des informations plus rapidement grâce à des requêtes à facettes intuitives, à la recherche en langage naturel et à des visualisations avancées via CloudWatch Logs Insights et Amazon OpenSearch Service

- **Débloquer l'intelligence métier avec des analyses flexibles** – Analyser les données unifiées en utilisant les outils de votre choix, notamment Amazon Athena, QuickSight, SageMaker, Apache Spark et les plateformes tierces compatibles Iceberg, sans duplication de données

## Étapes de configuration

La configuration se fait au niveau de l'organisation :

### Étape 1 : Configurer le compte racine

Dans votre compte racine :
1. Activer l'accès approuvé
2. Identifier un compte délégué pour le magasin de données centralisé

### Étape 2 : Configurer le compte centralisé

Dans votre compte centralisé, créez des règles de centralisation incluant :
- L'identifiant de l'organisation ou les comptes sources
- Les régions sources

## Règles de centralisation

Vous pouvez décider et configurer :

1. **Comptes sources** – Choisir quels comptes sources vous souhaitez copier les données et filtrer ceux-ci par organisation, unité d'organisation ou identifiant de compte
2. **Régions sources** – Sélectionner quelles régions sources copier les données
3. **Compte et région de destination** - Spécifier le compte AWS et la région où vous souhaitez stocker vos données de télémétrie centralisées
4. **Région de sauvegarde** – Configurer une région de sauvegarde pour une seconde copie des données (optionnel)
5. **Filtres de groupes de journaux** – Filtrer les groupes de journaux par nom, préfixe ou mot-clé en utilisant un certain nombre d'opérateurs
6. **Règles multiples** – Configurer plusieurs règles de centralisation selon vos besoins
7. **Options de groupes de journaux chiffrés KMS** - Choisir le comportement de centralisation pour les groupes de journaux chiffrés avec KMS.

La structure de votre compte pour la journalisation centralisée pourrait ressembler à ceci :

![Centralized Logs](../../images/GettingStarted/centralised-logs.png)

## Résumé

En résumé :
1. Activer l'accès approuvé dans le compte racine et identifier le compte délégué
2. Créer des règles de centralisation dans le compte centralisé
3. Configurer les comptes sources, les régions et les filtres de groupes de journaux
4. Optionnellement configurer des régions de sauvegarde pour la redondance

## Étapes suivantes

Continuez vers [Configurer les agents/collecteurs](./configure-agents-collectors.md)
