---
sidebar_position: 1
---

# Configurer les comptes de surveillance et sources

Dans la majorité des cas, les clients doivent visualiser et corréler les données de télémétrie provenant de plusieurs comptes AWS car leurs services s'exécutent à travers de nombreux comptes, et parfois, de nombreuses régions.

Si vous prévoyez d'exécuter votre observabilité et vos services dans un seul compte, vous pouvez ignorer cette étape.

La première étape consiste à configurer vos comptes de surveillance et sources et à spécifier exactement quelle télémétrie vous souhaitez partager. Vous utiliserez l'observabilité inter-comptes pour ce faire. Veuillez noter que cela fonctionne sur une base par région.

Pour des instructions plus détaillées sur la configuration de l'observabilité inter-comptes, veuillez vous référer au guide [CloudWatch Cross-Account Observability](../cloudwatch_cross_account_observability.md).

## Compte de surveillance

Désignez un compte de surveillance à partir duquel vous souhaitez visualiser les données de télémétrie de manière centralisée.

Ensuite, définissez quels comptes partageront les données avec votre compte de surveillance. Vous pouvez choisir tous les comptes de votre organisation AWS ou sélectionner des comptes sources individuels. Vous spécifierez également quelles données de télémétrie vous souhaitez partager avec le compte de surveillance (par ex., journaux, métriques, traces, Application Signals, etc.).

Vous [lierez ensuite les comptes sources](../cloudwatch_cross_account_observability.md#step-2-link-the-source-accounts) pour compléter la configuration.

La structure typique de votre compte de surveillance ressemblera à ceci :

![Monitoring Account Structure](../../images/GettingStarted/monitoring-acct-struct.png)

Vous [configurerez](../cloudwatch_cross_account_observability.md#step-1-set-up-a-monitoring-account) cela sur une base par région dans les paramètres CloudWatch.

:::info
Avec l'observabilité inter-comptes, les journaux et métriques ne sont PAS copiés depuis les comptes sources, mais les données de traces sont copiées vers le compte de surveillance (la copie de traces vers le 1er compte de surveillance étant incluse sans frais supplémentaires). Vous visualisez simplement les journaux, métriques, traces et autres télémétries de manière centralisée.
:::

## Comptes de surveillance multiples

Chaque compte de surveillance peut être lié à jusqu'à 100 000 comptes sources.

Cependant, il peut y avoir des situations opérationnelles où vous avez besoin de plusieurs comptes de surveillance. Vous pouvez avoir plusieurs comptes de surveillance selon vos propres besoins. Cette configuration pourrait ressembler à ceci :

![Multiple Monitoring Accounts](../../images/GettingStarted/multiple-mon-accts.png)

:::info
Si vous devez partager des données depuis un seul compte source avec plusieurs comptes de surveillance, c'est également configurable car chaque compte source peut partager des données avec jusqu'à 5 comptes de surveillance.
:::

## Contrôle de la télémétrie

Vous avez également le contrôle sur les données de télémétrie que vous partagez, avec la possibilité de spécifier des filtres de métriques et de journaux vous offrant une granularité supplémentaire.

![Telemetry Configuration](../../images/GettingStarted/telemetry-config.png)

Vous pourrez désormais [visualiser et interroger les données inter-comptes](../cloudwatch_cross_account_observability.md#querying-cross-account-telemetry-data) provenant de plusieurs comptes dans un seul compte de surveillance (par région).

## Résumé

En résumé :
1. Désigner et configurer le(s) compte(s) de surveillance
2. Configurer les comptes sources
3. Affiner la télémétrie que vous souhaitez partager
4. Visualiser et interroger toutes les données des comptes sources depuis le compte de surveillance

## Étapes suivantes

Continuez vers [Configurer le magasin de données unifié](./setup-unified-data-store.md)
