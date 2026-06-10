# Événements

## Que voulons-nous dire par événements ?
De nombreuses architectures sont pilotées par les événements de nos jours. Dans les architectures pilotées par les événements, les événements sont des signaux provenant de différents systèmes que nous capturons et transmettons à d'autres systèmes. Un événement est généralement un changement d'état ou une mise à jour.

Par exemple, dans un système e-commerce, vous pouvez avoir un événement lorsqu'un article est ajouté au panier. Cet événement pourrait être capturé et transmis à la partie panier d'achat du système pour mettre à jour le nombre d'articles et le coût du panier, ainsi que les détails de l'article.

:::info
	Pour certains clients, un événement peut être un *jalon*, comme l'achèvement d'un achat. Il y a un argument pour traiter le moment agrégé d'une conclusion de workflow comme un événement, mais pour nos besoins, nous ne considérons pas un jalon en soi comme un événement.
:::
## Pourquoi les événements sont-ils utiles ?
Il y a deux façons principales dont les événements peuvent être utiles dans votre solution d'Observability. L'une est de visualiser les événements dans le contexte d'autres données, et l'autre est de vous permettre d'agir en fonction d'un événement.

:::info
	Les événements sont destinés à donner des informations précieuses, soit aux personnes soit aux machines, sur les changements et les actions dans votre charge de travail.
:::

## Visualiser les événements
Il existe de nombreux signaux d'événements qui ne proviennent pas directement de votre application, mais qui peuvent avoir un impact sur la performance de votre application, ou fournir un aperçu supplémentaire de la cause racine. Les tableaux de bord sont le mécanisme le plus courant pour visualiser vos événements, bien que certains outils d'analytique ou de business intelligence fonctionnent également dans ce contexte. Même les applications de messagerie ou de messagerie instantanée peuvent recevoir facilement des visualisations.


Considérez un graphique temporel de la performance de l'application, comme le temps pour passer une commande sur votre front-end web. Le graphique temporel vous permet de voir qu'il y a eu un changement brusque dans le temps de réponse il y a quelques jours. Il pourrait être utile de savoir s'il y a eu des déploiements récents. Imaginez pouvoir voir un graphique temporel des déploiements récents à côté, ou superposé sur le même graphique ?

![Visualiser les événements](images/visualizing_events.png)

:::tip
	Considérez quels événements pourraient être utiles pour comprendre le contexte plus large. Les événements importants pour vous pourraient être les déploiements de code, les événements de changement d'infrastructure, l'ajout de nouvelles données (comme la publication de nouveaux articles à vendre, ou l'ajout en masse de nouveaux utilisateurs), ou la modification ou l'ajout de fonctionnalités (comme changer la façon dont les gens ajoutent des articles à leur panier).
:::

:::info
	Visualisez les événements avec d'autres données métriques importantes afin de pouvoir [corréler les événements](./metrics.md#correlate-with-operational-metric-data).
:::

## Agir sur les événements
Dans le monde de l'Observability, une alarme déclenchée est un événement courant. Cet événement contiendrait probablement un identifiant pour l'alarme, l'état de l'alarme (comme `IN ALARM`, ou `OK`), et les détails de ce qui l'a déclenchée. Dans de nombreux cas, cet événement d'alarme sera détecté et une notification par e-mail sera envoyée. C'est un exemple d'action sur une alarme.

La notification d'alarme est critique dans l'observabilité. C'est ainsi que nous informons les bonnes personnes qu'il y a un problème. Cependant, lorsque l'action sur les événements mûrit dans votre solution d'observabilité, elle peut automatiquement remédier au problème sans intervention humaine.


### Mais quelle action prendre ?
Nous ne pouvons pas automatiser l'action sans d'abord comprendre quelle action atténuera le problème détecté. Au début de votre parcours d'Observability, cela peut souvent ne pas être évident. Cependant, plus vous avez d'expérience dans la remédiation des problèmes, plus vous pouvez affiner vos alarmes pour capturer les domaines où il existe une action connue. Il peut y avoir des actions intégrées dans le service d'alarme que vous utilisez, ou vous devrez peut-être capturer l'événement d'alarme vous-même et scripter la résolution.

:::info
	Les systèmes d'auto-scaling, tels que l'[auto-scaling horizontal de pods](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) ne sont qu'une implémentation de ce principe. Kubernetes abstrait simplement cette automatisation pour vous.
:::
Avoir accès aux données sur la fréquence et la résolution des alarmes vous aidera à décider s'il y a une possibilité d'automatisation. Bien que des alarmes à portée plus large basées sur les symptômes des problèmes soient excellentes pour capturer les problèmes, vous pourriez constater que vous avez besoin de critères plus spécifiques pour lier à la remédiation automatique.

Au fur et à mesure que vous faites cela, envisagez d'intégrer cela avec votre outil de gestion des incidents/tickets/ITSM. De nombreuses organisations suivent les incidents, ainsi que les résolutions et métriques associées comme le temps moyen de résolution (MTTR). Si vous faites cela, envisagez également de capturer vos résolutions *automatisées* de manière similaire. Cela vous permet de comprendre le type et la proportion de problèmes qui sont automatiquement remédiés, mais vous permet également de rechercher des patterns et problèmes sous-jacents.

:::tip
	Ce n'est pas parce que personne n'a eu à corriger manuellement un problème que vous ne devriez pas examiner la cause sous-jacente.
:::
Par exemple, considérez un redémarrage de serveur chaque fois qu'il devient non réactif. Le redémarrage permet au système de continuer à fonctionner, mais qu'est-ce qui cause la non-réactivité ? La fréquence à laquelle cela se produit, et s'il y a un pattern (par exemple qui correspond à la génération de rapports, ou à un nombre élevé d'utilisateurs, ou aux sauvegardes système), déterminera la priorité et les ressources que vous consacrez à comprendre et corriger la cause racine.
:::info
	Envisagez la livraison de *chaque* événement lié à vos [indicateurs clés de performance](./metrics.md#know-your-key-performance-indicatorskpis-and-measure-them) dans un bus de messages pour consommation. Et notez que certaines solutions d'observabilité font cela de manière transparente sans exigences de configuration explicites.
:::
## Intégrer vos événements dans votre plateforme d'Observability
Une fois que vous avez identifié les événements qui sont importants pour vous, vous devrez réfléchir à la meilleure façon de les intégrer dans votre plateforme d'Observability.
Votre plateforme peut avoir un moyen spécifique de capturer les événements, ou vous devrez peut-être les intégrer en tant que logs ou données métriques.

:::note
	Un moyen simple d'obtenir les informations est d'écrire les événements dans un fichier de log et de les ingérer de la même manière que vos autres événements de log.
:::

Explorez comment votre système vous permettra de les visualiser. Pouvez-vous identifier les événements qui sont liés à votre application ? Pouvez-vous combiner les données sur un seul graphique ? Même s'il n'y a rien de spécifique, vous devriez au moins pouvoir créer un graphique temporel à côté de vos autres données pour corréler visuellement. Gardez le même axe temporel et envisagez de les empiler verticalement pour une comparaison facile.

![Visualiser les événements en graphiques empilés](images/visualizing_events_stacked.png)
