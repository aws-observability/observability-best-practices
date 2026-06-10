# CloudWatch Agent


## Déploiement du CloudWatch agent

Le CloudWatch agent peut être déployé en installation unique, en utilisant un fichier de configuration distribué, en superposant plusieurs fichiers de configuration, et entièrement par automatisation. L'approche appropriée pour vous dépend de vos besoins. [^1]

:::info
	Le déploiement sur les hôtes Windows et Linux offre la possibilité de stocker et récupérer leurs configurations dans [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html). Traiter le déploiement de la configuration du CloudWatch agent via ce mécanisme automatisé est une bonne pratique.
:::

:::tip
	Alternativement, les fichiers de configuration du CloudWatch agent peuvent être déployés via l'outil d'automatisation de votre choix ([Ansible](https://www.ansible.com), [Puppet](https://puppet.com), etc.). L'utilisation de Systems Manager Parameter Store n'est pas obligatoire, bien qu'elle simplifie la gestion.
:::
## Déploiement en dehors d'AWS

L'utilisation du CloudWatch agent n'est *pas* limitée à l'intérieur d'AWS, et est prise en charge à la fois sur site et dans d'autres environnements cloud. Il y a deux considérations supplémentaires à respecter lors de l'utilisation du CloudWatch agent en dehors d'AWS :

1. Configuration des identifiants IAM[^2] pour permettre à l'agent d'effectuer les appels API requis. Même dans EC2, il n'y a pas d'accès non authentifié aux API CloudWatch[^5].
1. S'assurer que l'agent dispose d'une connectivité vers CloudWatch, CloudWatch Logs et les autres points de terminaison AWS[^3] en utilisant une route qui répond à vos exigences. Cela peut se faire via Internet, en utilisant [AWS Direct Connect](https://aws.amazon.com/directconnect/), ou via un [point de terminaison privé](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) (généralement appelé *VPC endpoint*).

:::info
	Le transport entre votre ou vos environnements et CloudWatch doit correspondre à vos exigences de gouvernance et de sécurité. De manière générale, l'utilisation de points de terminaison privés pour les charges de travail en dehors d'AWS répond aux besoins des clients même dans les industries les plus strictement réglementées. Cependant, la majorité des clients seront bien servis par nos points de terminaison publics.
:::
## Utilisation des points de terminaison privés

Pour envoyer des métriques et des journaux, le CloudWatch agent doit disposer d'une connectivité vers les points de terminaison *CloudWatch* et *CloudWatch Logs*. Il existe plusieurs façons d'y parvenir selon l'endroit où l'agent est installé.

### Depuis un VPC

a. Vous pouvez utiliser des *VPC Endpoints* (pour CloudWatch et CloudWatch Logs) afin d'établir une connexion entièrement privée et sécurisée entre votre VPC et CloudWatch pour l'agent s'exécutant sur EC2. Avec cette approche, le trafic de l'agent ne traverse jamais Internet.

b. Une autre alternative est d'avoir une [passerelle NAT](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) publique par laquelle les sous-réseaux privés peuvent se connecter à Internet, mais ne peuvent pas recevoir de connexions entrantes non sollicitées depuis Internet.

:::note
	Veuillez noter qu'avec cette approche, le trafic de l'agent sera logiquement acheminé via Internet.
:::
c. Si vous n'avez pas besoin d'établir une connectivité privée ou sécurisée au-delà des mécanismes TLS et [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) existants, l'option la plus simple est d'avoir une [passerelle Internet](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) pour fournir la connectivité à nos points de terminaison.

### Depuis des environnements sur site ou d'autres clouds

a. Les agents s'exécutant en dehors d'AWS peuvent établir une connectivité vers les points de terminaison publics CloudWatch via Internet (via leur propre configuration réseau) ou Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html).

b. Si vous exigez que le trafic de l'agent ne passe pas par Internet, vous pouvez utiliser des [VPC Interface endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html), propulsés par AWS PrivateLink, pour étendre la connectivité privée jusqu'à votre réseau sur site en utilisant Direct Connect Private VIF ou VPN. Votre trafic n'est pas exposé à Internet, éliminant les vecteurs de menace.

:::success
	Vous pouvez ajouter des [jetons d'accès AWS éphémères](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) pour une utilisation par le CloudWatch agent en utilisant des identifiants obtenus depuis l'[agent AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html).
:::

[^1]: Voir [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) pour un blog qui donne des conseils sur l'utilisation et le déploiement du CloudWatch agent.


[^2]: [Guidance on setting credentials for agents running on-premises and in other cloud environments](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [How to verify connectivity to the CloudWatch endpoints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [A blog for on-premises, private connectivity](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: L'utilisation de toutes les API AWS liées à l'observabilité est généralement accomplie par un [profil d'instance](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) - un mécanisme pour accorder des identifiants d'accès temporaires aux instances et conteneurs s'exécutant dans AWS.
