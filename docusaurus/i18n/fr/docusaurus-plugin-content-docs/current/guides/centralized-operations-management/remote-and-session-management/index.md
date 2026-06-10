---
sidebar_position: 6
---
# Gestion à distance et des sessions

La gestion à distance et des sessions inclut des fonctionnalités telles que Run Command, Fleet Manager et Session Manager.

## Gestion à distance

En utilisant Run Command, un outil d'AWS Systems Manager, vous pouvez gérer à distance et de manière sécurisée la configuration de vos noeuds gérés. Run Command vous permet d'automatiser les tâches administratives courantes et d'effectuer des changements de configuration ponctuels à grande échelle. Vous pouvez utiliser Run Command depuis la Console de gestion AWS, l'AWS Command Line Interface (AWS CLI), AWS Tools for Windows PowerShell ou les SDK AWS.

![Gestion à distance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "Gestion à distance")

Les cas d'utilisation courants de Run Command incluent :

* **Amorçage de noeuds :** Vous pouvez installer ou amorcer des applications sur tous les noeuds ou des noeuds spécifiques.
* **Gestion de la configuration :** Systems Manager prend en charge divers langages spécifiques au domaine (DSL), incluant [Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/), [Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/) et [PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/).
* **Jonction au domaine :** Joindre des noeuds à un domaine Windows
* **Déploiement d'autres agents Amazon :** Stocker la configuration de l'agent dans Parameter Store

### Documents de commandes composites

Ces documents Systems Manager définissent les actions que vous souhaitez effectuer sur les noeuds gérés. Systems Manager offre une variété de documents publics prédéfinis et permet également de personnaliser les documents. Vous pouvez [exécuter des documents composites](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/) dans le cadre de vos configurations. Les documents composites effectuent la tâche d'exécuter un ou plusieurs documents secondaires.

Les points à garder à l'esprit lors de l'utilisation de documents de commandes composites sont qu'il n'y a que des opérations séquentielles et pas de branchement. Vous pouvez activer cela via AWS-RunDocument pour exécuter des documents stockés dans Systems Manager, GitHub privé ou public, ou Amazon S3. Ceci est réalisé en utilisant les plugins [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) et [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument). Le plugin aws:runDocument exécute des documents qui résident dans Systems Manager ou dans le chemin local. Un exemple de ceci est AWS-RunPatchBaselineWithHooks.

### Restreindre Run Command

Vous pouvez restreindre les commandes qu'un utilisateur peut exécuter dans une session via les utilisateurs/rôles IAM. Dans le document, vous définissez la commande qui s'exécute lorsque l'utilisateur démarre une session et les paramètres que l'utilisateur peut fournir à la commande. Vous pouvez restreindre l'accès en fonction de : ssm:SendCommand, nom ou préfixe de document, tags de ressources et identifiants de ressources. Vous pouvez également appliquer des politiques ABAC en utilisant des tags de session SAML.

![Restreindre Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "Restreindre Run Command")

1. Par exemple, vous pouvez accorder l'accès à des noeuds gérés spécifiques en fonction du département auquel appartient votre utilisateur [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/).
1. Alice et Bob se fédèrent dans la [Console de gestion AWS](http://aws.amazon.com/console) en utilisant leur fournisseur d'identité externe (IdP). Les deux utilisateurs fédérés DOIVENT accéder à des instances EC2 spécifiques en utilisant Session Manager en fonction de leur appartenance au « département », Amber et Blue respectivement.

### Run Command multi-comptes et multi-régions

* Run Command lui-même est par compte/région
* Utilisez Automation pour invoquer à travers les comptes/régions

Automation, un outil d'AWS Systems Manager, simplifie les tâches courantes de maintenance, de déploiement et de remédiation. Vous pouvez l'utiliser pour cibler plusieurs comptes/régions. Pour l'automatisation multi-comptes/multi-régions, lors du ciblage des comptes enfants, le document de commande doit exister dans le compte/la région cible. Vous pouvez utiliser CloudFormation ou Terraform pour déployer les documents de commande. Les permissions nécessaires doivent être en place pour que le service Systems Manager puisse exécuter les actions d'automatisation. Référez-vous à la section Automation pour plus d'informations.

![Run Command multi-comptes et multi-régions](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "Run Command multi-comptes et multi-régions")

### Planifier Run Command via les associations AWS Systems Manager State Manager

State Manager vous aide à automatiser le processus de maintien de vos noeuds gérés depuis AWS, sur site ou multicloud dans un état désiré. Dans State Manager, une association est une liaison entre votre configuration exprimée dans un document, et un ensemble de cibles, selon une planification spécifique, pour assurer un état cohérent. Vous pouvez démarrer une automatisation en créant une association State Manager avec un runbook. Le document de commande associé aux configurations doit exister dans chaque compte/région cible.

![Planifier Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "Planifier Run Command")

### Gestion des codes d'erreur, de sortie et de redémarrage

Par défaut, le code de sortie de la dernière commande exécutée dans un script est rapporté comme le code de sortie pour l'ensemble du script.

* `Exit 0` résulte en le statut : `Success`
* `Exit 1` ou autre*, résulte en le statut : `Failed`
* Vous pouvez inclure des codes de sortie spécifiques pour identifier plus rapidement les erreurs.
* Codes de redémarrage :
  * Windows : `exit 3010`
  * Linux : `exit 194`

![Planifier Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "Planifier Run Command")

### Surveiller Run Command avec Amazon CloudWatch

AWS Systems Manager publie des métriques sur le statut des commandes Run Command vers CloudWatch, vous permettant de définir des alarmes basées sur ces métriques. Il y a des métriques spécifiques que Systems Manager pousse vers CloudWatch concernant les commandes qui ont eu un ```Delivery Time Out```, combien ont ```Failed``` et combien étaient ```Successful```.

Pour en savoir plus sur la surveillance de Run Command, consultez [Surveiller les métriques Run Command avec Amazon CloudWatch.](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html)

## Gestion des sessions

AWS Session Manager est un outil entièrement géré d'AWS Systems Manager. Vous pouvez utiliser soit un shell interactif basé sur navigateur en un clic, soit l'AWS Command Line Interface (AWS CLI) pour interagir avec le noeud géré. Session Manager fournit une gestion sécurisée des noeuds sans avoir besoin d'ouvrir des ports entrants, de maintenir des hôtes bastion ou de gérer des clés SSH. Vous pouvez vous conformer aux politiques d'entreprise qui exigent un accès contrôlé aux noeuds gérés, des pratiques de sécurité strictes et des journaux avec les détails d'accès aux noeuds, tout en fournissant aux utilisateurs finaux un accès simple en un clic et multiplateforme à vos noeuds gérés.

### Gouvernance

![Gouvernance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "Gouvernance")

* ***Séparer les utilisateurs des données*** : Un principe clé des opérations cloud est de séparer les utilisateurs des données autant que possible. Session Manager ferme les ports réseau entrants qui permettraient à quiconque possédant les identifiants d'accéder et potentiellement modifier la configuration d'un serveur. Session Manager peut aller plus loin en limitant les utilisateurs à l'exécution de commandes individuelles et à la visualisation des résultats sans jamais avoir de session interactive.

* ***Gérer l'accès de manière centralisée*** : Les opérations cloud peuvent résulter en un flux élastique et constant de changements dans un environnement. Plutôt que de maintenir qui peut accéder à chaque serveur sur chaque serveur, Session Manager s'intègre avec Identity Access Management pour permettre la définition centralisée de qui peut accéder à quels noeuds.

* ***Contrôler l'accès aux charges de travail et composants*** : Les organisations peuvent utiliser IAM pour contrôler l'accès aux noeuds selon la charge de travail ou le rôle. Par exemple, un administrateur de base de données pourrait pouvoir accéder à distance à toute instance balisée comme « Component: Database », ou un développeur d'applications pourrait accéder à distance à toute instance balisée avec « Environment: Development ». Ce contrôle d'accès basé sur les attributs permet aux équipes projet de travailler aussi vite qu'elles le doivent pour délivrer de la valeur à l'entreprise, tout en sachant qu'elles opèrent dans des garde-fous définis.

* ***Restreindre les commandes à des rôles spécifiques :*** Comme nous l'avons mentionné dans Séparer les utilisateurs des données, il est possible de permettre à un rôle d'exécuter uniquement l'ensemble spécifique de commandes requises pour ce rôle. Par exemple, un développeur d'applications pourrait « suivre » un fichier journal de son application en production sans avoir ni nécessiter d'accès interactif à l'environnement de production.

* ***Accorder un accès temporaire pour des raisons commerciales*** : Avec des fonctionnalités supplémentaires fournies par des solutions open source et commerciales d'accès temporaire élevé, il est même possible de refuser l'accès à distance à tous les opérateurs jusqu'à ce qu'ils aient une raison commerciale valide d'accéder au serveur. Par exemple, un serveur d'applications de production n'aurait aucun moyen d'être accédé à distance. Cependant, pendant un incident, un opérateur pourrait demander et se voir accorder un accès temporaire au serveur pour investiguer l'incident. Cet accès serait associé à une raison enregistrée, approuvé par un second opérateur et limité dans le temps uniquement au temps nécessaire pour effectuer le travail.

### Observability et conformité

* **Journaliser les activités de sessions VM et conteneurs et surveiller l'accès et l'activité des noeuds gérés :** Lorsqu'une session terminale est démarrée depuis la Console AWS en utilisant Session Manager, toutes les commandes et leurs résultats de la session peuvent être enregistrés dans S3 et les groupes de journaux CloudWatch. Cela peut fournir une piste d'audit de tous les changements effectués pendant une session interactive. Vous pouvez également utiliser les événements CloudTrail pour surveiller (et si nécessaire alerter sur) les sessions à distance réussies et échouées vers les noeuds. Par exemple, une session à distance effectuée en dehors d'une fenêtre de changement définie pourrait être signalée à la personne concernée et à son responsable.

### Simplifier les opérations

* **Accès en un clic depuis la console :** Session Manager est bien intégré avec la console AWS offrant des options « Connect » depuis la console EC2, la console Session Manager et la console Fleet Manager.
* **Pas besoin de gérer SSH :** Avec Session Manager, il n'est pas nécessaire de gérer la création, la distribution et le renouvellement d'une infrastructure PKI pour l'accès SSH à votre troupeau de noeuds élastiques. L'autorisation centralisée via IAM remplace le besoin de stocker, protéger et surveiller les clés privées à travers votre flotte.
* **Permettre l'accès sans ouvrir les groupes de sécurité :** En utilisant la fonctionnalité « Port Forwarding » de Session Manager, vous pouvez permettre un accès autorisé à vos noeuds sans avoir besoin d'ouvrir ou d'élargir l'accès réseau aux ports de session à distance de l'instance. Par exemple, un développeur pourrait avoir un accès sécurisé à l'instance de base de données de l'environnement de test en utilisant un port redirigé depuis sa machine de développement locale via le service Session Manager vers l'instance en question via un pipeline entièrement chiffré et authentifié.
* **Accès centralisé :** L'intégration avec la console et IAM permet à vos opérateurs d'avoir l'accès à distance dont ils ont besoin (et sont autorisés à avoir) depuis où qu'ils aient besoin de cet accès.
* **Réduction du « rayon d'explosion » :** En verrouillant les ports réseau entrants et en restreignant l'accès à distance de manière centralisée aux seuls noeuds que le rôle d'un utilisateur nécessite, nous réduisons le « rayon d'explosion » que toute violation potentielle pourrait créer.

### Optimiser les coûts IT

* **Pas besoin d'hôtes bastion ou de relais :** Session Manager peut supprimer le besoin d'utiliser des hôtes bastion ou de relais de votre environnement — éliminant un coût d'instance 24x7. Cela signifie remplacer des hôtes avec des ports réseau SSH et RDP entrants ouverts, ainsi qu'un accès sortant via SSH et RDP vers d'autres noeuds de votre environnement. Au lieu de cela, l'accès est sécurisé via le même mécanisme que le reste de votre environnement cloud — IAM — offrant une autorisation fine et un accès à des identifiants temporaires sur les noeuds cibles.
* **Pas de frais supplémentaires pour accéder aux instances EC2 :** Au-delà des frais d'instance existants pour EC2, il n'y a pas de frais supplémentaires requis pour utiliser Session Manager pour permettre l'accès à distance à vos noeuds et conteneurs EC2.

### Comment fonctionne Session Manager ?

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. L'agent SSM doit être installé sur le noeud avec une connectivité sur le port 443 sortant vers le service Systems Manager.
2. Cette connexion peut être vers un point de terminaison de service public (c'est-à-dire via Internet) ou elle pourrait se connecter via des points de terminaison privés dans le VPC.
3. Le noeud a besoin d'un profil avec les privilèges corrects pour se connecter via le réseau au service et établir une connexion persistante.

**Note :** Utilisateur local par défaut : `ssm-user.` Pour Linux : /etc/sudoers et Windows : groupe Administrators.

### Établir une connexion avec Session Manager

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. Un utilisateur souhaite se connecter à distance à ce noeud, l'utilisateur doit tenter de « Start Session » avec le noeud.
2. Session Manager vérifiera que l'utilisateur est autorisé à « Start Session » sur cette instance EC2 particulière.
3. IAM vérifiera les privilèges de l'utilisateur/principal.
4. Le noeud est informé de la demande de connexion autorisée via sa connexion persistante à AWS Systems Manager.
5. Le noeud établit alors un tunnel chiffré vers l'utilisateur demandeur via le service AWS Session Manager.

### Préférences de Session Manager

Les préférences de Session Manager offrent un endroit pour configurer les préférences de Session Manager au niveau de la région dans ce compte. Tout changement s'appliquera à toutes les sessions dans ce compte/région à moins que le paramètre ne soit remplacé (par exemple, en passant un paramètre spécifique depuis la ligne de commande.)

* **Durée/timeout de session :** La durée minimale pour une session AWS Session Manager est de 1 minute, et le maximum est de 1 440 minutes (24 heures). En plus de la durée maximale, vous pouvez configurer le timeout de session inactive pour terminer la session après une période d'inactivité définie comme au moins 1 minute et un maximum de 60 minutes.
* **Paramètres de chiffrement de session :** Le chiffrement par clé AWS KMS pour fournir une protection supplémentaire aux données transmises entre les machines clientes et les noeuds gérés. Certaines fonctionnalités de Systems Manager (par exemple, réinitialiser le mot de passe utilisateur du noeud) nécessitent que le chiffrement AWS KMS soit en place.
* **Support Run As pour Linux/MacOS :** La fonctionnalité Run As permet de démarrer des sessions en utilisant les identifiants d'un utilisateur du système d'exploitation spécifié au lieu des identifiants d'un compte ssm-user généré par le système qu'AWS Systems Manager Session Manager peut créer sur un noeud géré (bien que RunAs ne soit disponible que pour les noeuds Linux et MacOS).
* **Journalisation des sessions pour l'audit et le reporting :** Configurez Session Manager pour créer et envoyer les journaux d'historique de session à un bucket Amazon Simple Storage Service (Amazon S3) ou à un groupe de journaux Amazon CloudWatch Logs. Les données de journaux stockées peuvent ensuite être utilisées pour auditer ou rapporter les connexions de session effectuées vers vos noeuds gérés et les commandes exécutées pendant les sessions.
* **Profils/préférences de shell :** Les profils personnalisables vous permettent de définir des préférences au sein des sessions telles que les préférences de shell, les variables d'environnement, les répertoires de travail et l'exécution de plusieurs commandes lorsqu'une session est démarrée.

### Chiffrement de session

* Les sessions sont chiffrées par défaut avec TLS 1.2
  * Vous pouvez activer une couche supplémentaire de chiffrement en utilisant des clés KMS
* Certaines actions Fleet Manager, comme les réinitialisations de mot de passe, nécessitent que le chiffrement KMS soit activé
* Les sessions chiffrées avec KMS afficheront un message une fois la session démarrée

**Note :** Pour ajouter une couche supplémentaire de chiffrement avec KMS, vous devrez ajouter la clé de chiffrement KMS au paramètre de préférence. Des permissions IAM sont requises à la fois par le noeud géré et l'utilisateur pour utiliser Session Manager. L'ajout du chiffrement KMS augmentera les privilèges que vous devez attribuer au noeud et à l'utilisateur.

### Journalisation de session

Dans les paramètres de préférences, vous pouvez activer la journalisation des sessions. Les journaux de session sont un enregistrement de toutes les commandes émises et des résultats affichés pendant une session terminale. Vous pouvez les envoyer à CloudWatch ou S3 ou les deux.

Cela vous permet d'utiliser des groupes de journaux et des buckets S3 chiffrés. Les paramètres de chiffrement réels de ces ressources se font dans CloudWatch et S3. L'accès aux buckets S3 et aux groupes de journaux CW devra être accordé au profil d'instance EC2 ainsi que des privilèges tels que « s3:GetEncryptionConfiguration ». Pour la journalisation CloudWatch, vous pouvez diffuser les journaux au fur et à mesure qu'ils sont saisis (ce qui est l'option recommandée) ou envoyer les journaux à la fin de la session.

**Note :** Si vous avez la politique **PowerShell Transcription** configurée sur vos noeuds gérés Windows Server, vous ne serez ***pas*** en mesure de diffuser les données de session vers CloudWatch ou S3. Et si vous utilisez des noeuds gérés Linux ou macOS, assurez-vous que l'utilitaire screen est installé. S'il ne l'est pas, vos données de journaux pourraient être tronquées.

* La journalisation CloudWatch permettra à Session Manager d'enregistrer chaque commande émise et les résultats affichés à l'utilisateur dans CloudWatch à des fins d'audit. En utilisant ces informations (et aussi les événements Session Manager enregistrés dans CloudTrail), le client peut lier une identité IAM aux commandes exécutées en utilisant l'utilisateur local ssm-user sur un serveur.
  * Les journaux diffusés sont stockés au format json
* L'onglet « Session History » d'AWS Systems Manager Session Manager offre un lien direct depuis une session individuelle de Session Manager vers les journaux CloudWatch ou l'enregistrement S3 de la session.
* Vous devrez vous assurer que le rôle IAM nécessaire avec les permissions requises pour SSM, CloudWatch et S3 est en place pour enregistrer la journalisation de session.

Pour plus d'informations, consultez [Créer un rôle IAM avec des permissions pour Session Manager et Amazon S3 et CloudWatch Logs](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging).

### Comment les préférences de session sont appliquées

* Le document SSM-SessionManagerRunShell est créé avec les paramètres fournis et appliqué au compte dans cette région
* Des préférences personnalisées peuvent être configurées en utilisant SessionManagerRunShell.json puis en créant le document SSM-SessionManagerRunShell en passant le fichier json
* Mettez à jour les préférences en mettant à jour le fichier SessionManagerRunShell.json et en exécutant l'API Update-document pour mettre à jour le document SSM-SessionManagerRunShell

Pour plus d'informations sur les préférences de session, consultez [Configurer les préférences](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html).

### Quelles sont les différentes façons de se connecter à une instance en utilisant Session Manager ?

1. **Session standard :** Connectez-vous depuis la console EC2 (Connect to Instance) ou Fleet Manager (Start terminal Session) ou vous pouvez choisir de vous connecter via RDP pour Windows dans les deux consoles.
    1. Une session standard ouvre une session en ligne de commande terminale. Pour Linux, elle ouvre un shell et pour Windows, elle ouvre une session PowerShell.
    2. ssm-user est créé la première fois qu'une session démarre sur l'instance. Et automatiquement ajouté au groupe Admin sur Windows et sudoers sur Linux.

**Note :** Si un utilisateur est supprimé, l'agent SSM ne le recréera pas et cela causera l'échec de la connexion de Session Manager.

1. **SSH :** Les tunnels SSH vous permettent de rediriger les connexions effectuées vers un port local vers une machine distante via un canal sécurisé.
    1. Uniquement via AWS CLI
    1. Nécessite une clé SSH
        1. Permet la copie de fichiers via SCP
    1. Modifier le fichier de configuration SSH
    1. Journalisation
        1. Pas de journalisation des commandes de session
        1. Limité à : Session History, CloudTrail

Limitations : Les commandes de session ne sont pas journalisées. C'est parce que SSH chiffre toutes les données de session, et Session Manager sert uniquement de tunnel pour les connexions SSH. Vous pouvez utiliser Session History et CloudTrail pour examiner les sessions.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **Redirection de port :**
    1. Uniquement via AWS CLI et le plugin Session Manager
        1. Y compris CloudShell !
    1. Active le cas d'utilisation de tunneling
        1. Tunnel vers EC2, RDS, Fargate, ElastiCache
    1. Active RDP via Fleet Manager
        1. Journalisation
        1. Pas de journalisation des commandes de session
        1. Limité à : Session History et CloudTrail

**Note :** La journalisation n'est pas disponible pour les sessions Session Manager qui se connectent via la redirection de port ou SSH. C'est parce que SSH chiffre toutes les données de session, et Session Manager sert uniquement de tunnel pour les connexions SSH.

La valeur que vous spécifiez pour portNumber représente le port distant sur le noeud géré vers lequel le trafic doit être redirigé, tel que 80. Si ce paramètre n'est pas spécifié, Session Manager suppose 80 comme port distant par défaut.

La valeur que vous spécifiez pour localPortNumber représente le port local sur le client vers lequel le trafic doit être redirigé, tel que 56789. Cette valeur est ce que vous entrez lors de la connexion à un noeud géré en utilisant un client. Par exemple, localhost:56789.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### Restreindre l'accès pour les sessions standard

Il y a deux éléments que vous pouvez contrôler pour l'accès à vos noeuds en utilisant le principe du moindre privilège offert par IAM.
Vous pouvez restreindre ce que le compte utilisateur employé par Session Manager est autorisé à faire sur une instance ou vous pouvez restreindre quelles instances le principal IAM de l'utilisateur est autorisé à démarrer une session avec.

Avec les noeuds gérés Windows, les utilisateurs peuvent se connecter via des sessions RDP en utilisant n'importe quel utilisateur Windows disponible (par exemple, un utilisateur AD si le noeud est connecté au domaine). Cependant, si les utilisateurs se connectent via une session terminale, la seule option est ssm-user. Pour restreindre ce que ssm-user peut faire sur un noeud Windows, l'admin/utilisateur peut changer les groupes dont ssm-user est membre (par défaut, il est membre du groupe Administrators).

Avec les noeuds gérés Linux, un utilisateur peut configurer la préférence « Run As » pour changer l'utilisateur avec lequel une session terminale se connecte. Par défaut c'est ssm-user avec des privilèges sudoer. En utilisant « Run As », l'utilisateur pourrait changer ssm-user pour un autre utilisateur par défaut.

Ou alternativement, vous pouvez spécifier un tag qui est utilisé pour déterminer quel utilisateur peut se connecter en fonction de la valeur de ce tag défini sur un rôle utilisateur IAM.

**Note :** Si vous utilisez IAM Identity Center et des ensembles de permissions pour contrôler l'accès des utilisateurs et qu'un utilisateur IAM Identity Center ne peut pas définir de tag, cela rend Run As moins flexible pour ces utilisateurs.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### Et EC2 Instance Connect ?

Là où Session Manager consiste à sécuriser et simplifier les connexions à distance aux noeuds via un lien sortant authentifié et autorisé vers AWS Session Manager, « EC2 Instance Connect » consiste à simplifier les connexions SSH entrantes vers les hôtes Linux EC2.

EC2 Instance Connect simplifie la gestion SSH en générant et utilisant des clés SSH éphémères partagées via le service de métadonnées EC2 avec l'instance. Il nécessite que l'utilisateur tentant la connexion à distance ait un accès réseau entrant sur le port 22 et enfin EC2 Instance Connect ne s'applique qu'aux hôtes Linux s'exécutant dans EC2 comparé à Session Manager qui fonctionne de manière multiplateforme et multi-cloud.

## Fleet Manager

Fleet Manager fournit une console unifiée pour tous les noeuds dans un compte dans une région (et vous pouvez changer de région pour avoir une vue similaire dans d'autres régions). Vous pouvez voir des métadonnées telles que s'ils sont connectés à Systems Manager, la version de l'agent, etc. Permettre à un opérateur d'effectuer des tâches d'administration courantes à travers les plateformes dans une console unifiée améliore l'efficacité de l'administrateur système.

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Cas d'utilisation de Fleet Manager

* Effectuer une variété de tâches d'administration système courantes sans avoir à vous connecter manuellement à vos noeuds gérés.
* Interface centralisée pour gérer les serveurs à distance : Vous pouvez voir différentes instances de plateformes avec leur état, le statut de l'agent SSM, la plateforme. Vous pouvez télécharger le rapport depuis l'interface à des fins de gestion.
  * Gérer les noeuds s'exécutant sur plusieurs plateformes depuis une seule console unifiée.
  * Gérer les noeuds exécutant différents systèmes d'exploitation depuis une seule console unifiée.
* Améliorer l'efficacité de votre administration système.

### Comment Fleet Manager interagit avec les noeuds ?

Fleet Manager invoque des documents préfixés avec ```AWSFleetManager-*```. Les documents utilisent soit Run Command soit Session Manager pour obtenir les résultats et les afficher dans la console Fleet Manager.
