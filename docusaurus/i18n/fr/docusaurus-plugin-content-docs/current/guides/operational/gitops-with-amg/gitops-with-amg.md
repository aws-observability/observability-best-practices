# Utilisation de GitOps et Grafana Operator avec Amazon Managed Grafana

## Comment utiliser ce guide

Ce guide de bonnes pratiques Observability est destine aux developpeurs et architectes qui souhaitent comprendre comment utiliser [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) en tant qu'operateur Kubernetes sur votre cluster Amazon EKS pour creer et gerer le cycle de vie des ressources Grafana et des tableaux de bord Grafana dans Amazon Managed Grafana de maniere native Kubernetes.

## Introduction

Les clients utilisent Grafana comme plateforme d'observabilite pour l'analyse et la surveillance open source. Nous avons constate que les clients executant leurs charges de travail dans Amazon EKS souhaitent se concentrer sur la gravite des charges de travail et s'appuyer sur des controleurs natifs Kubernetes pour deployer et gerer le cycle de vie des ressources externes telles que les ressources Cloud. Nous avons observe que les clients installent [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) pour creer, deployer et gerer les services AWS. De nombreux clients choisissent aujourd'hui de deleguer les implementations Prometheus et Grafana a des services geres, et dans le cas d'AWS, ces services sont [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov) et [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov) pour la surveillance de leurs charges de travail.

Un defi courant auquel les clients sont confrontes lors de l'utilisation de Grafana est la creation et la gestion du cycle de vie des ressources Grafana et des tableaux de bord Grafana dans des instances Grafana externes telles qu'Amazon Managed Grafana depuis leur cluster Kubernetes. Les clients rencontrent des difficultes pour trouver des moyens d'automatiser completement et de gerer le deploiement de l'infrastructure et des applications de l'ensemble de leur systeme en utilisant des workflows bases sur Git, ce qui inclut egalement la creation de ressources Grafana dans Amazon Managed Grafana. Dans ce guide de bonnes pratiques Observability, nous nous concentrerons sur les sujets suivants :

* Introduction a Grafana Operator - Un operateur Kubernetes pour gerer des instances Grafana externes depuis votre cluster Kubernetes
* Introduction a GitOps - Des mecanismes automatises pour creer et gerer votre infrastructure en utilisant des workflows bases sur Git
* Utilisation de Grafana Operator sur Amazon EKS pour gerer Amazon Managed Grafana
* Utilisation de GitOps avec Flux sur Amazon EKS pour gerer Amazon Managed Grafana

## Introduction a Grafana Operator

Le [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) est un operateur Kubernetes concu pour vous aider a gerer vos instances Grafana au sein de Kubernetes. Grafana Operator vous permet de gerer et de creer des tableaux de bord Grafana, des sources de donnees, etc. de maniere declarative entre plusieurs instances de facon simple et evolutive. Grafana Operator prend desormais en charge la gestion des ressources telles que les tableaux de bord, les sources de donnees, etc. hebergees dans des environnements externes comme Amazon Managed Grafana. Cela nous permet finalement d'utiliser des mecanismes GitOps utilisant des projets CNCF tels que [Flux](https://fluxcd.io/) pour creer et gerer le cycle de vie des ressources dans Amazon Managed Grafana depuis un cluster Amazon EKS.

## Introduction a GitOps

### Qu'est-ce que GitOps et Flux

GitOps est une methodologie de developpement logiciel et d'operations qui utilise Git comme source de verite pour les configurations de deploiement. Elle consiste a maintenir l'etat souhaite d'une application ou d'une infrastructure dans un depot Git et a utiliser des workflows bases sur Git pour gerer et deployer les changements. GitOps est un moyen de gerer le deploiement d'applications et d'infrastructures de sorte que l'ensemble du systeme soit decrit de maniere declarative dans un depot Git. C'est un modele operationnel qui vous offre la capacite de gerer l'etat de plusieurs clusters Kubernetes en tirant parti des bonnes pratiques de controle de version, d'artefacts immuables et d'automatisation.

Flux est un outil GitOps qui automatise le deploiement d'applications sur Kubernetes. Il fonctionne en surveillant continuellement l'etat d'un depot Git et en appliquant tout changement a un cluster. Flux s'integre a divers fournisseurs Git tels que GitHub, [GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd/) et Bitbucket. Lorsque des modifications sont apportees au depot, Flux les detecte automatiquement et met a jour le cluster en consequence.

### Avantages de l'utilisation de Flux

* **Deploiements automatises** : Flux automatise le processus de deploiement, reduisant les erreurs manuelles et liberant les developpeurs pour qu'ils se concentrent sur d'autres taches.
* **Workflow base sur Git** : Flux exploite Git comme source de verite, ce qui facilite le suivi et l'annulation des changements.
* **Configuration declarative** : Flux utilise des manifestes [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co/) pour definir l'etat souhaite d'un cluster, facilitant la gestion et le suivi des changements.

### Defis lies a l'adoption de Flux

* **Personnalisation limitee** : Flux ne prend en charge qu'un ensemble limite de personnalisations, ce qui peut ne pas convenir a tous les cas d'utilisation.
* **Courbe d'apprentissage abrupte** : Flux a une courbe d'apprentissage abrupte pour les nouveaux utilisateurs et necessite une comprehension approfondie de Kubernetes et de Git.

## Utilisation de Grafana Operator sur Amazon EKS pour gerer les ressources dans Amazon Managed Grafana

Comme discute dans la section precedente, Grafana Operator nous permet d'utiliser notre cluster Kubernetes pour creer et gerer le cycle de vie des ressources dans Amazon Managed Grafana de maniere native Kubernetes. Le diagramme d'architecture ci-dessous montre la demonstration du cluster Kubernetes comme plan de controle avec l'utilisation de Grafana Operator pour configurer une identite avec AMG, ajouter Amazon Managed Service for Prometheus comme source de donnees et creer des tableaux de bord sur Amazon Managed Grafana depuis un cluster Amazon EKS de maniere native Kubernetes.

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

Veuillez vous referer a notre article sur [Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) pour une demonstration detaillee de la facon de deployer la solution ci-dessus sur votre cluster Amazon EKS.

## Utilisation de GitOps avec Flux sur Amazon EKS pour gerer les ressources dans Amazon Managed Grafana

Comme discute ci-dessus, Flux automatise le deploiement d'applications sur Kubernetes. Il fonctionne en surveillant continuellement l'etat d'un depot Git tel que GitHub et lorsque des modifications sont apportees au depot, Flux les detecte automatiquement et met a jour le cluster en consequence. Veuillez vous referer a l'architecture ci-dessous ou nous demontrerons comment utiliser Grafana Operator depuis votre cluster Kubernetes et les mecanismes GitOps utilisant Flux pour ajouter Amazon Managed Service for Prometheus comme source de donnees et creer des tableaux de bord dans Amazon Managed Grafana de maniere native Kubernetes.

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

Veuillez vous referer a notre module One Observability Workshop - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg). Ce module configure les outils operationnels "Day 2" necessaires tels que les suivants sur votre cluster EKS :

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) est installe avec succes pour lire les secrets Amazon Managed Grafana depuis AWS Secret Manager
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) pour mesurer diverses ressources machine telles que la memoire, le disque et l'utilisation du CPU
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) pour utiliser notre cluster Kubernetes afin de creer et gerer le cycle de vie des ressources dans Amazon Managed Grafana de maniere native Kubernetes.
* [Flux](https://fluxcd.io/) pour automatiser le deploiement d'applications sur Kubernetes en utilisant des mecanismes GitOps.

## Conclusion

Dans cette section du guide de bonnes pratiques Observability, nous avons appris a utiliser Grafana Operator et GitOps avec Amazon Managed Grafana. Nous avons commence par decouvrir GitOps et Grafana Operator. Ensuite, nous nous sommes concentres sur la facon d'utiliser Grafana Operator sur Amazon EKS pour gerer les ressources dans Amazon Managed Grafana et sur la facon d'utiliser GitOps avec Flux sur Amazon EKS pour gerer les ressources dans Amazon Managed Grafana afin de configurer une identite avec AMG, d'ajouter des sources de donnees AWS sur Amazon Managed Grafana depuis un cluster Amazon EKS de maniere native Kubernetes.
