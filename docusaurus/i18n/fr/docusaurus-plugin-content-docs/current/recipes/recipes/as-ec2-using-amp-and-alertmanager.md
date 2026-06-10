# Auto-scaling Amazon EC2 avec Amazon Managed Service for Prometheus et alert manager

Les clients souhaitent migrer leurs charges de travail Prometheus existantes vers le cloud et tirer parti de tout ce que le cloud offre. AWS dispose de services comme Amazon [EC2 Auto Scaling](https://aws.amazon.com/ec2/autoscaling/), qui vous permet de mettre a l'echelle les instances [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/pm/ec2/) en fonction de metriques comme l'utilisation du CPU ou de la memoire. Les applications qui utilisent des metriques Prometheus peuvent facilement s'integrer a EC2 Auto Scaling sans avoir besoin de remplacer leur pile de surveillance. Dans cet article, je vous guide a travers la configuration d'Amazon EC2 Auto Scaling pour fonctionner avec [Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/prometheus/). Cette approche vous permet de migrer une charge de travail basee sur Prometheus vers le cloud tout en tirant parti de services comme l'auto-scaling.

Amazon Managed Service for Prometheus prend en charge les [regles d'alerte](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) qui utilisent [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/). La [documentation des regles d'alerte Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) fournit la syntaxe et des exemples de regles d'alerte valides. De meme, la documentation de l'alert manager Prometheus reference a la fois la [syntaxe](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/) et les [exemples](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/) de configurations d'alert manager valides.

## Apercu de la solution

Tout d'abord, passons brievement en revue le concept d'[Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) d'Amazon EC2 Auto Scaling, qui est une collection logique d'instances Amazon EC2. Un Auto Scaling group peut lancer des instances EC2 en se basant sur un modele de lancement predefini. Le [modele de lancement](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html) contient les informations utilisees pour lancer l'instance Amazon EC2, y compris l'AMI ID, le type d'instance, les parametres reseau et le profil d'instance [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/).

Les Amazon EC2 Auto Scaling groups ont les concepts de [taille minimale, taille maximale et capacite desiree](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html). Lorsqu'Amazon EC2 Auto Scaling detecte que la capacite d'execution actuelle de l'Auto Scaling group est superieure ou inferieure a la capacite desiree, il effectuera automatiquement un scale out ou un scale in selon les besoins. Cette approche de mise a l'echelle vous permet d'utiliser l'elasticite au sein de votre charge de travail tout en maintenant des limites sur la capacite et les couts.

Pour demontrer cette solution, j'ai cree un Amazon EC2 Auto Scaling group qui contient deux instances Amazon EC2. Ces instances [ecrivent a distance les metriques d'instance](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html) vers un espace de travail Amazon Managed Service for Prometheus. J'ai defini la taille minimale de l'Auto Scaling group a deux (pour maintenir la haute disponibilite), et j'ai defini la taille maximale du groupe a 10 (pour aider a controler les couts). A mesure que le trafic augmente vers la solution, des instances Amazon EC2 supplementaires sont automatiquement ajoutees pour supporter la charge, jusqu'a la taille maximale de l'Amazon EC2 Auto Scaling group. A mesure que la charge diminue, ces instances Amazon EC2 sont terminees jusqu'a ce que l'Amazon EC2 Auto Scaling group atteigne la taille minimale du groupe. Cette approche vous permet d'avoir une application performante en utilisant l'elasticite du cloud.

Notez qu'a mesure que vous scrapez de plus en plus de ressources, vous pourriez rapidement depasser les capacites d'un seul serveur Prometheus. Vous pouvez eviter cette situation en mettant a l'echelle les serveurs Prometheus lineairement avec la charge de travail. Cette approche garantit que vous pouvez collecter des donnees de metriques a la granularite que vous souhaitez.

Pour supporter l'Auto Scaling d'une charge de travail Prometheus, j'ai cree un espace de travail Amazon Managed Service for Prometheus avec les regles suivantes :

` YAML `
```
groups:
- name: example
  rules:
  - alert: HostHighCpuLoad
    expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 60
    for: 5m
    labels:
      severity: warning
      event_type: scale_up
    annotations:
      summary: Host high CPU load (instance {{ $labels.instance }})
      description: "CPU load is > 60%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
  - alert: HostLowCpuLoad
    expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) < 30
    for: 5m
    labels:
      severity: warning
      event_type: scale_down
    annotations:
      summary: Host low CPU load (instance {{ $labels.instance }})
      description: "CPU load is < 30%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

```

Cet ensemble de regles cree une regle `HostHighCpuLoad` et une regle `HostLowCpuLoad`. Ces alertes se declenchent lorsque le CPU est superieur a 60 % ou inferieur a 30 % d'utilisation sur une periode de cinq minutes.

Apres avoir leve une alerte, l'alert manager transmettra le message dans un sujet Amazon SNS, en passant un `alert_type` (le nom de l'alerte) et un `event_type` (scale_down ou scale_up).

` YAML `
```
alertmanager_config: |
  route: 
    receiver: default_receiver
    repeat_interval: 5m
        
  receivers:
    - name: default_receiver
      sns_configs:
        - topic_arn: <ARN OF SNS TOPIC GOES HERE>
          send_resolved: false
          sigv4:
            region: us-east-1
          message: |
            alert_type: {{ .CommonLabels.alertname }}
            event_type: {{ .CommonLabels.event_type }}

```

Une fonction AWS [Lambda](https://aws.amazon.com/lambda/) est abonnee au sujet Amazon SNS. J'ai ecrit une logique dans la fonction Lambda pour inspecter le message Amazon SNS et determiner si un evenement `scale_up` ou `scale_down` doit se produire. Ensuite, la fonction Lambda incremente ou decremente la capacite desiree de l'Amazon EC2 Auto Scaling group. L'Amazon EC2 Auto Scaling group detecte un changement de capacite demande, puis lance ou desalloue des instances Amazon EC2.

Le code Lambda pour supporter l'Auto Scaling est le suivant :

` Python `
```
import json
import boto3
import os

def lambda_handler(event, context):
    print(event)
    msg = event['Records'][0]['Sns']['Message']
    
    scale_type = ''
    if msg.find('scale_up') > -1:
        scale_type = 'scale_up'
    else:
        scale_type = 'scale_down'
    
    get_desired_instance_count(scale_type)
    
def get_desired_instance_count(scale_type):
    
    client = boto3.client('autoscaling')
    asg_name = os.environ['ASG_NAME']
    response = client.describe_auto_scaling_groups(AutoScalingGroupNames=[ asg_name])

    minSize = response['AutoScalingGroups'][0]['MinSize']
    maxSize = response['AutoScalingGroups'][0]['MaxSize']
    desiredCapacity = response['AutoScalingGroups'][0]['DesiredCapacity']
    
    if scale_type == "scale_up":
        desiredCapacity = min(desiredCapacity+1, maxSize)
    if scale_type == "scale_down":
        desiredCapacity = max(desiredCapacity - 1, minSize)
    
    print('Scale type: {}; new capacity: {}'.format(scale_type, desiredCapacity))
    response = client.set_desired_capacity(AutoScalingGroupName=asg_name, DesiredCapacity=desiredCapacity, HonorCooldown=False)

```

L'architecture complete peut etre consultee dans la figure suivante.

![Architecture](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)

## Tester la solution

Vous pouvez lancer un modele AWS CloudFormation pour provisionner automatiquement cette solution.

Prerequis de la pile :

* Un [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/vpc/)
* Un AWS Security Group qui autorise le trafic sortant

Selectionnez le lien Telecharger le modele Launch Stack pour telecharger et configurer le modele dans votre compte. Dans le cadre du processus de configuration, vous devez specifier les sous-reseaux et les groupes de securite que vous souhaitez associer aux instances Amazon EC2. Consultez la figure suivante pour les details.

[## Telecharger le modele Launch Stack ](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

Voici l'ecran de details de la pile CloudFormation, ou le nom de la pile a ete defini comme prometheus-autoscale. Les parametres de la pile incluent une URL de l'installateur Linux pour Prometheus, l'URL du Linux Node Exporter pour Prometheus, les sous-reseaux et groupes de securite utilises dans la solution, l'AMI et le type d'instance a utiliser, et la capacite maximale de l'Amazon EC2 Auto Scaling group.

La pile prendra environ huit minutes a deployer. Une fois terminee, vous trouverez deux instances Amazon EC2 qui ont ete deployees et sont en cours d'execution dans l'Amazon EC2 Auto Scaling group qui a ete cree pour vous. Pour valider que cette solution effectue l'auto-scaling via Amazon Managed Service for Prometheus Alert Manager, vous appliquez une charge aux instances Amazon EC2 en utilisant [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html) et le [document d'automatisation AWSFIS-Run-CPU-Stress](https://docs.aws.amazon.com/fis/latest/userguide/actions-ssm-agent.html#awsfis-run-cpu-stress).

A mesure que le stress est applique aux CPUs dans l'Amazon EC2 Auto Scaling group, l'alert manager publie ces alertes, auxquelles la fonction Lambda repond en augmentant l'Auto Scaling group. A mesure que la consommation CPU diminue, l'alerte CPU basse dans l'espace de travail Amazon Managed Service for Prometheus se declenche, l'alert manager publie l'alerte vers le sujet Amazon SNS, et la fonction Lambda repond en reduisant l'Auto Scaling group, comme montre dans la figure suivante.

![Tableau de bord](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Le tableau de bord Grafana affiche une ligne montrant que le CPU a atteint un pic a 100 %. Bien que le CPU soit eleve, une autre ligne montre que le nombre d'instances est passe de 2 a 10. Une fois que le CPU a diminue, le nombre d'instances redescend progressivement a 2.

## Couts

Amazon Managed Service for Prometheus est tarife en fonction des metriques ingerees, des metriques stockees et des metriques interrogees. Visitez la [page de tarification d'Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/pricing/) pour les derniers tarifs et exemples de tarification.

Amazon SNS est tarife en fonction du nombre de requetes API mensuelles effectuees. La livraison de messages entre Amazon SNS et Lambda est gratuite, mais des frais s'appliquent pour la quantite de donnees transferees entre Amazon SNS et Lambda. Consultez les [derniers details de tarification Amazon SNS](https://aws.amazon.com/sns/pricing/).

Lambda est tarife en fonction de la duree d'execution de votre fonction et du nombre de requetes effectuees vers la fonction. Consultez les derniers [details de tarification AWS Lambda](https://aws.amazon.com/lambda/pricing/).

Il n'y a [pas de frais supplementaires pour l'utilisation](https://aws.amazon.com/ec2/autoscaling/pricing/) d'Amazon EC2 Auto Scaling.

## Conclusion

En utilisant Amazon Managed Service for Prometheus, l'alert manager, Amazon SNS et Lambda, vous pouvez controler les activites de mise a l'echelle d'un Amazon EC2 Auto Scaling group. La solution presentee dans cet article demontre comment vous pouvez migrer des charges de travail Prometheus existantes vers AWS, tout en utilisant egalement Amazon EC2 Auto Scaling. A mesure que la charge augmente vers l'application, elle se met a l'echelle de maniere transparente pour repondre a la demande.

Dans cet exemple, l'Amazon EC2 Auto Scaling group a effectue la mise a l'echelle basee sur le CPU, mais vous pouvez suivre une approche similaire pour toute metrique Prometheus de votre charge de travail. Cette approche fournit un controle detaille sur les actions de mise a l'echelle, garantissant ainsi que vous pouvez mettre a l'echelle votre charge de travail sur la metrique qui offre le plus de valeur commerciale.

Dans de precedents billets de blog, nous avons egalement demontre comment vous pouvez utiliser [Amazon Managed Service for Prometheus Alert Manager pour recevoir des alertes avec PagerDuty](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) et [comment integrer Amazon Managed Service for Prometheus avec Slack](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/). Ces solutions montrent comment vous pouvez recevoir des alertes depuis votre espace de travail de la maniere la plus utile pour vous.

Pour les prochaines etapes, consultez comment [creer votre propre fichier de configuration de regles](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-rules-upload.html) pour Amazon Managed Service for Prometheus, et configurez votre propre [recepteur d'alertes](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver.html).
