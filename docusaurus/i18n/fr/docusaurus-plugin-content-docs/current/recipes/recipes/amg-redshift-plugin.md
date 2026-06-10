# Utiliser Redshift dans Amazon Managed Grafana

Dans cette recette, nous vous montrons comment utiliser [Amazon Redshift][redshift] -- un service d'entrepôt de données à l'échelle du pétaoctet utilisant du SQL standard -- dans [Amazon Managed Grafana][amg]. Cette intégration est rendue possible par la [source de données Redshift pour Grafana][redshift-ds], un plugin open source disponible pour toute instance Grafana DIY ainsi que pré-installé dans Amazon Managed Grafana.

:::note
    Ce guide prendra environ 10 minutes à compléter.
:::
## Prérequis

1. Vous avez un accès administrateur à Amazon Redshift depuis votre compte.
1. Étiquetez votre cluster Amazon Redshift avec `GrafanaDataSource: true`.
1. Pour bénéficier des politiques gérées par le service, créez les identifiants de base de données de l'une des manières suivantes :
    1. Si vous souhaitez utiliser le mécanisme par défaut, c'est-à-dire l'option d'identifiants temporaires, pour vous authentifier auprès de la base de données Redshift, vous devez créer un utilisateur de base de données nommé `redshift_data_api_user`.
    1. Si vous souhaitez utiliser les identifiants de Secrets Manager, vous devez étiqueter le secret avec `RedshiftQueryOwner: true`.

:::tip
    Pour plus d'informations sur la façon de travailler avec les politiques gérées par le service ou personnalisées,
    consultez les [exemples dans la documentation Amazon Managed Grafana][svpolicies].
:::

## Infrastructure
Nous avons besoin d'une instance Grafana, alors créez un nouvel [espace de travail Amazon Managed Grafana][amg-workspace], par exemple en utilisant le guide [Getting Started][amg-getting-started], ou utilisez-en un existant.

:::note
    Pour utiliser la configuration de source de données AWS, allez d'abord dans la
    console Amazon Managed Grafana pour activer les rôles IAM gérés par le service qui accordent à l'espace de travail les
    politiques IAM nécessaires pour lire les ressources Athena.
:::

Pour configurer la source de données Athena, utilisez la barre d'outils de gauche et choisissez l'icône AWS inférieure puis choisissez "Redshift". Sélectionnez votre région par défaut pour que le plugin découvre la source de données Redshift à utiliser, puis sélectionnez les comptes que vous souhaitez, et enfin choisissez "Add data source".

Alternativement, vous pouvez ajouter et configurer manuellement la source de données Redshift en suivant ces étapes :

1. Cliquez sur l'icône "Configurations" dans la barre d'outils de gauche puis sur "Add data source".
1. Recherchez "Redshift".
1. [OPTIONNEL] Configurez le fournisseur d'authentification (recommandé : rôle IAM de l'espace de travail).
1. Fournissez les valeurs "Cluster Identifier", "Database" et "Database User".
1. Cliquez sur "Save & test".

Vous devriez voir quelque chose comme ceci :

![Capture d'écran de la configuration de la source de données Redshift](../images/amg-plugin-redshift-ds.png)

## Utilisation
Nous utiliserons la configuration [Redshift Advance Monitoring][redshift-mon].
Comme tout est disponible nativement, il n'y a rien d'autre à configurer à ce stade.

Vous pouvez importer le tableau de bord de surveillance Redshift, inclus dans le plugin Redshift. Une fois importé, vous devriez voir quelque chose comme ceci :

![Capture d'écran du tableau de bord Redshift dans AMG](../images/amg-redshift-mon-dashboard.png)

À partir de là, vous pouvez utiliser les guides suivants pour créer votre propre tableau de bord dans Amazon Managed Grafana :

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Best practices for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

Voilà, félicitations, vous avez appris à utiliser Redshift depuis Grafana !

## Nettoyage

Supprimez la base de données Redshift que vous avez utilisée puis l'espace de travail Amazon Managed Grafana en le supprimant depuis la console.

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
