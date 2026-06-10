# Métriques

Les métriques sont une série de valeurs numériques conservées dans l'ordre chronologique de leur création. Elles sont utilisées pour suivre tout, du nombre de serveurs dans votre environnement, à leur utilisation disque, au nombre de requêtes qu'ils traitent par seconde, ou à la latence pour compléter ces requêtes.

Mais les métriques ne se limitent pas à la surveillance de l'infrastructure ou des applications. Elles peuvent plutôt être utilisées pour tout type d'entreprise ou de charge de travail pour suivre les ventes, les files d'attente d'appels et la satisfaction client. En fait, les métriques sont les plus utiles lorsqu'elles combinent à la fois des données opérationnelles et des métriques métier, offrant une vue complète et un système observable.

Il peut être utile de consulter [la page de documentation OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/metrics/) qui fournit un contexte supplémentaire sur les métriques.

## Connaissez vos indicateurs clés de performance (KPI) et mesurez-les !

La chose *la plus* importante avec les métriques est de *mesurer les bonnes choses*. Et ce que celles-ci sont sera différent pour chacun. Une application e-commerce peut avoir les ventes par heure comme KPI critique, tandis qu'une boulangerie serait probablement plus intéressée par le nombre de croissants fabriqués par jour.

:::warning
	Il n'existe pas de source unique, entièrement complète et exhaustive pour vos KPI métier. Vous devez comprendre votre projet ou application suffisamment bien pour savoir quels sont vos *objectifs de résultat*.
:::
Votre première étape est de nommer vos objectifs de haut niveau, et très probablement ces objectifs ne s'expriment pas comme une seule métrique provenant uniquement de votre infrastructure. Dans l'exemple e-commerce ci-dessus, une fois que vous identifiez l'objectif *méta* qui est de mesurer les *ventes par heure*, vous pouvez ensuite remonter aux métriques détaillées telles que le temps passé à rechercher un produit avant l'achat, le temps nécessaire pour compléter le processus de paiement, la latence des résultats de recherche de produits et ainsi de suite. Cela nous guidera à être intentionnels dans la collecte d'informations pertinentes pour observer le système.

:::info
	Ayant identifié vos KPI, vous pouvez maintenant *travailler à rebours* pour voir quelles métriques dans votre charge de travail les impactent.
:::
## Corrélez avec les données métriques opérationnelles

Si une utilisation élevée du CPU sur votre serveur web cause des temps de réponse lents, ce qui à son tour rend les clients insatisfaits et finalement diminue les revenus, alors mesurer votre utilisation CPU a un impact direct sur vos résultats métier et devrait *absolument* être mesuré !

Ou inversement, si vous avez une application qui effectue du traitement par lots sur des ressources cloud éphémères (comme une flotte Amazon EC2, ou similaire dans d'autres environnements de fournisseurs cloud), alors vous pouvez *vouloir* avoir le CPU aussi utilisé que possible afin d'accomplir le moyen le plus rentable de compléter le lot.

Dans les deux cas, vous devez avoir vos données opérationnelles (par exemple, l'utilisation CPU) dans le même système que vos métriques métier pour pouvoir corréler les deux.

:::info
	Stockez vos métriques métier et métriques opérationnelles dans un système où vous pouvez les corréler ensemble et tirer des conclusions basées sur les impacts observés sur les deux.
:::
## Sachez à quoi ressemble un bon état !

Comprendre ce qu'est une ligne de base saine peut être un défi. Beaucoup de personnes doivent effectuer des tests de charge sur leurs charges de travail pour comprendre à quoi ressemblent des métriques saines. Cependant, selon vos besoins, vous pourriez être en mesure d'observer les métriques opérationnelles existantes pour tirer des conclusions sûres sur les seuils sains.

Une charge de travail saine est celle qui trouve un équilibre entre la satisfaction de vos objectifs KPI tout en restant résiliente, disponible et rentable.

:::info
	Vos KPI *doivent* avoir une plage saine identifiée pour que vous puissiez créer des [alarmes](./alarms.md) lorsque la performance tombe en dessous, ou au-dessus, de ce qui est requis.
:::
## Utilisez les algorithmes de détection d'anomalies

Le défi de [savoir à quoi ressemble un bon état](#sachez-à-quoi-ressemble-un-bon-état-) est qu'il peut être impraticable de connaître les seuils sains pour *chaque* métrique de votre système. Un système de gestion de base de données relationnelle (SGBDR) peut émettre des dizaines de métriques de performance, et lorsqu'il est couplé avec une architecture de microservices, vous pouvez potentiellement avoir des centaines de métriques qui peuvent impacter vos KPI.

Surveiller un si grand nombre de points de données et identifier individuellement leurs seuils supérieurs et inférieurs n'est pas toujours pratique pour les humains. Mais l'apprentissage automatique est *très* bon pour ce type de tâche répétitive. Exploitez l'automatisation et l'apprentissage automatique partout où c'est possible car ils peuvent aider à identifier des problèmes dont vous ne seriez autrement même pas au courant !

:::info
	Utilisez les algorithmes d'apprentissage automatique et les modèles de détection d'anomalies pour calculer automatiquement les seuils de performance de votre charge de travail.
:::
