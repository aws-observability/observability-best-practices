# General - FAQ

## En quoi les logs different-ils des traces ?

Les logs sont limites a une seule application et aux evenements qui s'y rapportent. Par exemple, si un utilisateur se connecte a un site web heberge sur une plateforme de microservices et effectue un achat sur ce site, il peut y avoir des logs lies a cet utilisateur emis par plusieurs applications :

1. Un serveur web frontal
1. Un service d'authentification
1. Le service d'inventaire
1. Un backend de traitement des paiements
1. Un service de messagerie sortante qui envoie un recu a l'utilisateur

Chacune d'entre elles peut enregistrer quelque chose sur cet utilisateur, et ces donnees sont toutes precieuses. Cependant, les traces presenteront une vue unique et coherente de l'ensemble de l'interaction de l'utilisateur a travers cette transaction unique, couvrant tous ces composants discrets.

De cette maniere, une trace est une collection d'evenements provenant de plusieurs services destinee a montrer une vue unique d'une activite, tandis que les logs sont lies au contexte de l'application qui les a crees.

## Quels types de signaux sont immuables ?

Les trois types de signaux de base ([metriques](../signals/metrics.md), [logs](../signals/logs.md) et [traces](../signals/traces.md)) sont immuables, bien que certaines implementations offrent une assurance plus ou moins grande a cet egard. Par exemple, l'immuabilite des logs est une exigence stricte dans de nombreux cadres de gouvernance - et de nombreux outils existent pour l'assurer. Les metriques et les traces devraient egalement *toujours* etre immuables.

Cela amene la question de la gestion des "mauvaises donnees", ou des donnees inexactes. Avec les services d'observability AWS, il n'existe aucune fonctionnalite pour supprimer les metriques ou les traces emises par erreur. CloudWatch Logs permet la suppression d'un flux de logs entier, mais vous ne pouvez pas modifier retroactivement les donnees une fois collectees. C'est par conception, et une fonctionnalite importante pour assurer que les donnees clients sont traitees avec le plus grand soin.

## Pourquoi l'immuabilite est-elle importante pour l'observability ?

L'immuabilite est primordiale pour l'observability ! Si les donnees passees peuvent etre modifiees, vous perdriez des erreurs critiques, ou des valeurs aberrantes dans le comportement, qui informent vos *choix* lors de l'evolution de vos systemes et operations. Par exemple, un point de donnees de metrique montrant un grand ecart dans le temps n'indique pas simplement un manque de collecte de donnees, il peut indiquer un probleme beaucoup plus important dans votre infrastructure. De meme, avec les donnees "nulles" - meme les series temporelles vides sont precieuses.

Du point de vue de la gouvernance, modifier les logs applicatifs ou le tracage apres coup viole le principe de [non-repudiation](https://en.wikipedia.org/wiki/Non-repudiation), ou vous ne pourriez pas faire confiance au fait que les donnees dans votre systeme sont precisement telles qu'elles ont ete prevues par l'application source.

## Qu'est-ce qu'un rayon d'impact ?

Le rayon d'impact d'un changement est le dommage potentiel qu'il peut creer dans votre environnement. Par exemple, si vous effectuez un changement de schema de base de donnees, le risque potentiel pourrait inclure les donnees dans la base de donnees plus toutes les applications qui en dependent.

De maniere generale, travailler a reduire le rayon d'impact d'un changement est une bonne pratique, et decomposer un changement en morceaux plus petits, plus surs et reversibles est toujours recommande dans la mesure du possible.

## Qu'est-ce qu'une approche "cloud first" ?

Les strategies cloud-first sont celles ou les organisations deplacent tout ou la plupart de leur infrastructure vers des plateformes de cloud computing. Au lieu d'utiliser des ressources physiques comme des serveurs, elles hebergent les ressources dans le cloud.

Pour ceux habitues au materiel co-localise, cela peut sembler radical. Cependant, l'inverse est egalement vrai. Les developpeurs qui adoptent une mentalite cloud-first trouvent l'idee de lier leurs serveurs a un emplacement physique impensable. Les equipes cloud-first ne pensent pas a leurs serveurs comme des pieces discretes de materiel ou meme des serveurs virtuels. Au lieu de cela, ils les considerent comme des logiciels destines a remplir une fonction metier.

Le cloud-first est aux annees 2020 ce que le mobile-first etait aux annees 2010, et ce que la virtualisation etait au debut des annees 2000.

## Qu'est-ce que la dette technique ?

Tire de [Wikipedia](https://en.wikipedia.org/wiki/Technical_debt) :

> En developpement logiciel, la dette technique (egalement connue sous le nom de dette de conception ou dette de code) est le cout implicite du retravail supplementaire cause par le choix d'une solution facile (limitee) maintenant au lieu d'utiliser une meilleure approche qui prendrait plus de temps.

Fondamentalement, vous accumulez de la dette au fil du temps a mesure que vous ajoutez davantage a votre charge de travail sans supprimer le code, les applications ou les processus humains existants. La dette technique detourne de votre productivite absolue.

Par exemple, si vous devez passer 10% de votre temps a effectuer la maintenance d'un systeme existant qui fournit peu ou pas de valeur directe a votre entreprise, alors ces 10% representent un *cout* que vous payez. La reduction de la dette technique equivaut a augmenter le temps effectif pour creer de nouveaux produits qui ajoutent de la valeur.

## Qu'est-ce que la separation des responsabilites

Dans le contexte des solutions d'observability, la separation des responsabilites signifie diviser les domaines fonctionnels d'une charge de travail ou d'une application en composants discrets geres independamment. Chaque composant traite une responsabilite distincte (comme la structure des logs et l'*emission* des logs). Controler la configuration d'un composant sans modifier le code sous-jacent signifie que les developpeurs peuvent se concentrer sur leurs responsabilites (fonctionnalite applicative et developpement de fonctionnalites), tandis que les personnes DevOps peuvent se concentrer sur l'optimisation des performances systeme et le depannage.

La separation des responsabilites est un [concept fondamental](https://en.wikipedia.org/wiki/Separation_of_concerns) en informatique.

## Qu'est-ce que l'excellence operationnelle ?

L'excellence operationnelle est la mise en oeuvre des bonnes pratiques qui s'alignent avec l'exploitation des charges de travail. AWS dispose d'un cadre entier dedie au Well-Architected. Consultez [cette page](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html) pour demarrer avec l'excellence operationnelle.
