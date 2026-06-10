# Qu'est-ce que l'observability

## Ce que c'est

L'observability est la capacite a generer et decouvrir en continu des informations exploitables basees sur les signaux du systeme observe. En d'autres termes, l'observability permet aux utilisateurs de comprendre l'etat d'un systeme a partir de ses sorties externes et de prendre des mesures (correctives).

## Le probleme qu'elle resout

Les systemes informatiques sont mesures en observant des signaux de bas niveau tels que le temps CPU, la memoire, l'espace disque, ainsi que des signaux de plus haut niveau et metier, notamment les temps de reponse des API, les erreurs, les transactions par seconde, etc.

L'observability d'un systeme a un impact significatif sur ses couts d'exploitation et de developpement. Les systemes observables fournissent des donnees significatives et exploitables a leurs operateurs, leur permettant d'obtenir des resultats favorables (reponse plus rapide aux incidents, productivite accrue des developpeurs) avec moins de travail repetitif et de temps d'arret.

## Comment elle aide

Comprendre que plus d'informations ne se traduit pas necessairement par un systeme plus observable est essentiel. En fait, parfois, la quantite d'informations generees par un systeme peut rendre plus difficile l'identification de signaux de sante precieux parmi le bruit genere par l'application. L'observability necessite les bonnes donnees au bon moment pour le bon consommateur (humain ou logiciel) afin de prendre les bonnes decisions.

## Ce que vous trouverez ici

Ce site contient nos meilleures pratiques pour l'observability : ce qu'il faut faire, ce qu'il ne faut *pas* faire, et une collection de recettes expliquant comment les mettre en oeuvre. La majeure partie du contenu ici est agnostique en termes de fournisseur et represente ce que toute bonne solution d'observability devrait offrir.

Il est important que vous consideriez l'observability comme une *solution* et non comme un *produit*. L'observability decoule de vos pratiques et fait partie integrante d'un leadership solide en developpement et DevOps. Une application bien observee est une application qui place l'observability comme un principe d'exploitation, de maniere similaire a la securite qui doit etre au premier plan de l'organisation d'un projet. Tenter d'ajouter l'observability apres coup est un anti-pattern et rencontre moins de succes.

Ce site est organise en quatre categories :

1. [Meilleures pratiques par solution, comme pour les tableaux de bord, la surveillance des performances applicatives ou les conteneurs](https://aws-observability.github.io/observability-best-practices/guides/)
1. [Meilleures pratiques pour l'utilisation de differents types de donnees, comme pour les logs ou les traces](https://aws-observability.github.io/observability-best-practices/signals/logs/)
1. [Meilleures pratiques pour des outils AWS specifiques (bien que celles-ci soient largement applicables aux produits d'autres fournisseurs egalement)](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
1. [Recettes selectionnees pour l'observability avec AWS](https://aws-observability.github.io/observability-best-practices/recipes/)

:::info
	Ce site est base sur des cas d'utilisation reels qu'AWS et nos clients ont resolus.

	L'observability est au coeur du developpement d'applications modernes et une consideration essentielle lors de l'exploitation de systemes distribues, tels que les microservices, ou d'applications complexes avec de nombreuses integrations externes. Nous la considerons comme un indicateur avance d'une charge de travail saine, et nous sommes heureux de partager nos experiences avec vous ici !
:::
