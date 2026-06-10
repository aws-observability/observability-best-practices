---
sidebar_position: 6
---

# Gestion centralisee des operations

## Qu'est-ce que la gestion centralisee des operations ?

AWS propose une solution de [gestion centralisee des operations](https://aws.amazon.com/cloudops/centralized-operations-management/) que vous pouvez utiliser pour gerer et exploiter vos applications sur AWS, sur site, dans des environnements hybrides et en peripherie. Exploitez vos applications depuis un emplacement central avec l'automatisation, les integrations, les meilleures pratiques integrees et les capacites hybrides. Si vous cherchez a ameliorer vos outils de gestion des services informatiques (ITSM) pour ameliorer l'efficacite et la coherence, vous pouvez utiliser AWS pour automatiser vos integrations et investissements actuels tout en utilisant un outil tout-en-un pour les operations.

Les clients utilisent [AWS Systems Manager](https://aws.amazon.com/systems-manager/) pour gerer et exploiter leurs ressources a grande echelle pour les environnements sur site, hybrides et AWS. Systems Manager facilite les taches operationnelles sur les noeuds (par exemple, les instances Amazon EC2, les noeuds sur d'autres clouds et les noeuds sur site) telles que l'application de correctifs avec des mises a jour liees a la securite, la connexion aux noeuds sans gerer les cles SSH ni maintenir des bastions, et l'automatisation des commandes operationnelles a grande echelle. Dans AWS, un noeud est considere comme gere lorsqu'il dispose d'un SSM Agent pleinement fonctionnel travaillant sur site, en mode hybride et sur AWS.

La fonctionnalite principale de Systems Manager est axee sur les cas d'utilisation. L'agent etant le composant principal pour tirer parti des fonctionnalites d'AWS Systems Manager. Une fois qu'un noeud est gere par Systems Manager, vous pouvez debloquer d'autres fonctionnalites comme la gestion a distance, la gestion des correctifs et la gestion des sessions tout en automatisant les taches operationnelles.

![AWS Systems Manager](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager")
