# Surveillance des IP libres dans un sous-réseau

Dans cette recette, nous vous montrons comment configurer une pile de surveillance pour surveiller les adresses IP disponibles dans un sous-réseau.

Nous allons mettre en place une pile en utilisant [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) pour créer une Lambda, un tableau de bord CloudWatch et une alarme CloudWatch pour surveiller les IP libres disponibles dans le sous-réseau.

:::note
    Ce guide prendra environ 30 minutes à compléter.
:::
## Infrastructure
Dans la section suivante, nous allons mettre en place l'infrastructure pour cette recette.

La Lambda déployée ici appellera les API EC2 à intervalles réguliers et émettra des métriques d'IP libres vers [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html).

### Prérequis

* L'AWS CLI est [installée](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) et [configurée](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) dans votre environnement.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) est installé dans votre environnement.
* Node.js.
* Le [dépôt](https://github.com/aws-observability/observability-best-practices/) a été cloné sur votre machine locale. Le code de ce projet se trouve sous `/sandbox/grafana_subnet_ip_monitoring`.

### Installer les dépendances

Changez votre répertoire vers grafana_subnet_ip_monitoring via la commande :

```
cd sandbox/grafana_subnet_ip_monitoring
```

Ceci sera désormais considéré comme la racine du dépôt.

Installez les dépendances CDK via la commande suivante :

```
npm install
```

Toutes les dépendances sont maintenant installées.

### Modifier le fichier de configuration

À la racine du dépôt, ouvrez `lib/vpc_monitoring_stack.ts` et modifiez les `subnetIds`, `alarmEmail` et `monitoringFrequencyMinutes` selon vos besoins.

Par exemple, modifiez comme suit :

```
    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs
        'subnet-0713ae10e4a8da850',
        'subnet-00a36dd76f1c51d97'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: 'abc123@email.com', // Replace your email
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
```


### Déployer la pile

Une fois les modifications ci-dessus effectuées, il est temps de déployer la pile vers CloudFormation. Pour déployer la pile CDK, exécutez la commande suivante :

```
cdk bootstrap
cdk deploy --all
```

## Nettoyage

Supprimez la pile CloudFormation :

```
cdk destroy
```
