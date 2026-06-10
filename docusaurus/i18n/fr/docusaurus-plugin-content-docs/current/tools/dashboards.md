# Tableaux de bord

Les tableaux de bord sont une partie importante de votre solution d'Observability. Ils vous permettent de produire une visualisation organisée de vos données. Ils vous permettent de voir un historique de vos données et de les voir aux côtés d'autres données connexes. Ils vous permettent également de fournir du contexte. Ils vous aident à comprendre la vue d'ensemble.

Souvent, les gens collectent leurs données et créent des alarmes, puis s'arrêtent là. Cependant, les alarmes ne montrent qu'un instant donné, et généralement pour une seule métrique ou un petit ensemble de données. Les tableaux de bord vous aident à voir le comportement au fil du temps.

![Exemple de tableau de bord](../images/dashboard1.png)

## Un exemple pratique : considérez une alarme pour un CPU élevé
Vous savez que la machine fonctionne avec un CPU plus élevé que souhaité. Devez-vous agir, et à quelle vitesse ? Qu'est-ce qui pourrait vous aider à décider ?

* À quoi ressemble un CPU normal pour cette instance/application ?
* Est-ce un pic ou une tendance de CPU croissant ?
* Est-ce que cela impacte les performances ? Si non, combien de temps avant que cela ne se produise ?
* Est-ce un événement régulier ? Et est-ce que cela se rétablit habituellement tout seul ?

### Voir l'historique des données

Considérez maintenant un tableau de bord, avec un graphique temporel historique du CPU. Même avec cette seule métrique, vous pouvez voir s'il s'agit d'un pic ou d'une tendance à la hausse. Vous pouvez également voir à quelle vitesse la tendance augmente, et ainsi prendre des décisions sur la priorité d'action.

### Voir l'impact sur le flux de travail

Mais que fait cette machine ? Quelle est son importance dans notre contexte global ? Imaginez que nous ajoutons maintenant une visualisation de la performance du flux de travail, que ce soit le temps de réponse, le débit, les erreurs ou une autre mesure. Nous pouvons maintenant voir si le CPU élevé a un impact sur le flux de travail ou les utilisateurs que cette instance supporte.

### Voir l'historique de l'alarme

Considérez l'ajout d'une visualisation qui montre à quelle fréquence l'alarme s'est déclenchée au cours du dernier mois, et combinez cela en regardant plus loin en arrière pour voir si c'est un événement régulier. Par exemple, une tâche de sauvegarde déclenche-t-elle le pic ? Connaître le schéma de récurrence peut vous aider à comprendre le problème sous-jacent et à prendre des décisions à long terme sur la manière d'empêcher l'alarme de se reproduire.

### Ajouter du contexte

Enfin, ajoutez du contexte au tableau de bord. Incluez une brève description de la raison pour laquelle ce tableau de bord existe, le flux de travail auquel il se rapporte, ce qu'il faut faire en cas de problème, des liens vers la documentation, et qui contacter.

:::info
    Nous avons maintenant une *histoire*, qui aide l'utilisateur du tableau de bord à voir ce qui se passe, comprendre l'impact, et prendre des décisions appropriées basées sur les données concernant l'action à entreprendre et son urgence.
:::
### Ne pas essayer de tout visualiser en même temps

On parle souvent de la fatigue des alarmes. Trop d'alarmes, sans actions et priorités identifiables, peuvent surcharger votre équipe et mener à des inefficacités. Les alarmes devraient concerner des choses qui sont importantes pour vous et sur lesquelles vous pouvez agir.

Les tableaux de bord sont plus flexibles ici. Ils n'exigent pas votre attention de la même manière, vous avez donc plus de liberté pour visualiser des choses dont vous n'êtes pas encore certain de l'importance, ou qui soutiennent votre exploration. Néanmoins, n'en faites pas trop ! Tout peut souffrir d'un excès.

Les tableaux de bord devraient fournir une image de quelque chose qui est important pour vous. De la même manière que pour décider quelles données ingérer, vous devez réfléchir à ce qui compte pour vous concernant les tableaux de bord.
Pour vos tableaux de bord, réfléchissez à :

* Qui les consultera ?
    * Quel est leur contexte et leurs connaissances ?
	* De combien de contexte ont-ils besoin ?
* Quelles questions essaient-ils de résoudre ?
* Quelles actions entreprendront-ils en conséquence de la visualisation de ces données ?

:::tip
    Parfois il peut être difficile de savoir quelle devrait être l'histoire de votre tableau de bord, et combien inclure. Alors par où pourriez-vous commencer à concevoir votre tableau de bord ? Examinons deux approches : *pilotée par les KPI* ou *pilotée par les incidents*.
:::

#### Concevoir votre tableau de bord : approche pilotée par les KPI

Une façon de comprendre cela est de remonter à partir de vos KPI. C'est généralement une approche très orientée utilisateur.
Pour la [mise en page](#mise-en-page), nous travaillons typiquement de haut en bas, entrant dans plus de détails à mesure que nous descendons dans un tableau de bord, ou que nous naviguons vers des tableaux de bord de niveau inférieur.

Premièrement, **comprenez vos KPI**. Ce qu'ils signifient. Cela vous aidera à décider comment vous voulez les visualiser.
De nombreux KPI sont présentés sous forme d'un nombre unique. Par exemple, quel pourcentage de clients complètent avec succès un flux de travail spécifique, et en combien de temps ? Mais sur quelle période ? Vous pourriez bien atteindre votre KPI si vous faites la moyenne sur une semaine, mais avoir quand même de plus petites périodes à l'intérieur qui dépassent vos standards. Ces dépassements sont-ils importants pour vous ? Impactent-ils l'expérience de vos clients ? Si oui, vous pourriez envisager différentes périodes et graphiques temporels pour voir vos KPI. Et peut-être que tout le monde n'a pas besoin de voir le détail, alors peut-être que vous déplacez la décomposition des KPI vers un tableau de bord séparé, pour un public différent.

Ensuite, **qu'est-ce qui contribue à ces KPI ?** Quels flux de travail doivent fonctionner pour que ces actions se produisent ? Pouvez-vous les mesurer ?

Identifiez les composants principaux et ajoutez des visualisations de leurs performances. Lorsqu'un KPI est dépassé, vous devriez pouvoir rapidement regarder et voir où dans le flux de travail se situe l'impact principal.

Et vous pouvez continuer à descendre - qu'est-ce qui impacte la performance de ces flux de travail ? Rappelez-vous votre audience lorsque vous décidez du niveau de profondeur.

Considérez l'exemple d'un système e-commerce avec un KPI pour le nombre de commandes passées.
Pour qu'une commande soit passée, les utilisateurs doivent pouvoir effectuer les actions suivantes : rechercher des produits, les ajouter à leur panier, ajouter leurs informations de livraison, et payer la commande.
Pour chacun de ces flux de travail, vous pourriez envisager de vérifier que les composants clés fonctionnent. Par exemple en utilisant RUM ou Synthetics pour obtenir des données sur le succès des actions et voir si l'utilisateur est impacté par un problème. Vous pourriez envisager une mesure du débit, de la latence, des pourcentages d'actions échouées pour voir si la performance de chaque action est conforme aux attentes. Vous pourriez envisager des mesures de l'infrastructure sous-jacente pour voir ce qui pourrait impacter les performances.

Cependant, ne mettez pas toutes vos informations sur le même tableau de bord. Encore une fois, considérez votre audience utilisateur.

:::info
    Créez des couches de tableaux de bord qui permettent l'exploration en profondeur et fournissent le bon contexte pour les bons utilisateurs.
:::
#### Concevoir votre tableau de bord : approche pilotée par les incidents

Pour beaucoup de gens, la résolution des incidents est un moteur clé de l'observabilité. Vous avez été alerté d'un problème, par un utilisateur ou par une alarme d'Observability, et vous devez rapidement trouver une solution et potentiellement la cause racine du problème.

:::info
    Commencez par examiner vos incidents récents. Y a-t-il des schémas communs ? Lesquels ont été les plus impactants pour votre entreprise ? Lesquels se répètent ?
:::
Dans ce cas, nous concevons un tableau de bord pour ceux qui essaient de comprendre la gravité, d'identifier la cause racine et de résoudre l'incident.

Repensez à l'incident spécifique.

* Comment avez-vous vérifié que l'incident était tel que rapporté ?
    * Qu'avez-vous vérifié ? Les endpoints ? Les erreurs ?
* Comment avez-vous compris l'impact, et donc la priorité du problème ?
* Qu'avez-vous examiné comme cause du problème ?

L'Application Performance Monitoring (APM) peut aider ici, avec [Synthetics](./synthetics.md) pour une baseline régulière et le test des endpoints et des flux de travail, et [RUM](./rum.md) pour l'expérience client réelle. Vous pouvez utiliser ces données pour visualiser rapidement quels flux de travail sont impactés, et dans quelle mesure.

Les visualisations qui montrent le nombre d'erreurs au fil du temps, et les N erreurs les plus fréquentes, peuvent vous aider à vous concentrer sur la bonne zone et vous montrer les détails spécifiques des erreurs. C'est là que nous utilisons souvent les données de logs et les visualisations dynamiques des codes d'erreur et des raisons.

Il peut être très utile ici d'avoir une sorte de filtrage ou d'exploration en profondeur, pour arriver aux détails aussi rapidement que possible. Pensez aux moyens de mettre cela en oeuvre sans trop de surcharge. Par exemple, avoir un seul tableau de bord que vous pouvez filtrer pour vous rapprocher des détails.
 
### Mise en page

La mise en page de votre tableau de bord est également importante.

:::info
    Typiquement, les visualisations les plus significatives pour votre utilisateur doivent être en haut à gauche, ou autrement alignées avec un *début* naturel de navigation de page.
:::

Vous pouvez utiliser la mise en page pour aider à raconter l'histoire. Par exemple, vous pouvez utiliser une mise en page de haut en bas, où plus vous descendez, plus vous voyez de détails. Ou peut-être qu'un affichage de gauche à droite serait utile avec les services de niveau supérieur à gauche et leurs dépendances à mesure que vous vous déplacez vers la droite.

### Créer du contenu dynamique

Beaucoup de vos charges de travail seront conçues pour augmenter ou diminuer selon la demande, et vos tableaux de bord doivent en tenir compte. Par exemple, vous pouvez avoir vos instances dans un groupe d'auto-scaling, et lorsque vous atteignez une certaine charge, des instances supplémentaires sont ajoutées.

:::info
    Un tableau de bord montrant des données d'instances spécifiques, identifiées par un type d'ID, ne permettra pas de voir les données de ces nouvelles instances. Ajoutez des métadonnées à vos ressources et données, afin de pouvoir créer vos visualisations pour capturer toutes les instances avec une valeur de métadonnée spécifique. De cette façon, elles refléteront l'état réel.
:::
Un autre exemple de visualisations dynamiques pourrait être de pouvoir trouver les 10 erreurs les plus fréquentes en ce moment, et comment elles se sont comportées dans l'historique récent. Vous voulez pouvoir voir un tableau ou un graphique sans connaissance préalable des erreurs qui pourraient survenir.

### Penser aux symptômes avant les causes

Lorsque vous observez des symptômes, vous considérez l'impact que cela a sur vos utilisateurs et systèmes. De nombreuses causes sous-jacentes peuvent produire les mêmes symptômes. Cela vous permet de capturer plus de problèmes, y compris des problèmes inconnus. À mesure que vous comprenez les causes, vos tableaux de bord de niveau inférieur peuvent être plus spécifiques pour vous aider à diagnostiquer et résoudre rapidement les problèmes.

:::tip 
    Ne capturez pas l'erreur JavaScript spécifique qui a impacté les utilisateurs la semaine dernière. Capturez l'*impact* sur le flux de travail qu'elle a perturbé, puis montrez le nombre le plus élevé d'erreurs JavaScript sur l'historique récent, ou celles qui ont augmenté dramatiquement dans l'historique récent.
:::
### Utiliser le top/bottom N

La plupart du temps, il n'est pas nécessaire de visualiser *toutes* vos métriques opérationnelles en même temps. Un grand parc d'instances EC2 est un bon exemple : il n'y a pas besoin ni de valeur à afficher simultanément les IOPS disque ou l'utilisation CPU pour un parc entier de centaines de serveurs. Cela crée un anti-pattern où vous pouvez passer plus de temps à fouiller dans vos métriques qu'à voir les ressources les meilleures (ou les pires).

:::info
    Utilisez vos tableaux de bord pour montrer les dix ou vingt de n'importe quelle métrique donnée, puis concentrez-vous sur les [symptômes](#penser-aux-symptômes-avant-les-causes) que cela révèle.
:::
[CloudWatch metrics](./metrics.md) vous permet de rechercher le top N pour n'importe quelle série temporelle. Par exemple, cette requête retournera les 20 instances EC2 les plus occupées par utilisation CPU :

```
SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), SUM, DESC, 10)
```

Utilisez cette approche, ou une approche similaire avec [CloudWatch Metric Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/query_with_cloudwatch-metrics-insights.html) pour identifier les métriques les meilleures ou les pires dans vos tableaux de bord.

### Afficher les KPI avec des seuils visuels

Vos KPI devraient avoir un seuil d'avertissement ou d'erreur, et les tableaux de bord peuvent le montrer à l'aide d'une annotation horizontale. Celle-ci apparaîtra comme un repère de niveau haut sur un widget. L'afficher visuellement peut donner aux opérateurs humains un avertissement préalable si les résultats commerciaux ou l'infrastructure sont en danger.

![Image d'une annotation horizontale](../images/horizontal-annotation.png)

:::info
    Les annotations horizontales sont une partie essentielle d'un tableau de bord bien développé.
:::
### L'importance du contexte

Les gens peuvent facilement mal interpréter les données. Leur contexte et leur situation actuelle colorent la façon dont ils voient les données.

Assurez-vous donc d'inclure du *texte* dans votre tableau de bord. À quoi servent ces données, et pour qui ? Qu'est-ce que cela signifie ? Ajoutez des liens vers la documentation sur l'application, qui la supporte, les documents de dépannage. Vous pouvez également utiliser des affichages de texte pour diviser l'affichage de votre tableau de bord. Utilisez-les à gauche pour définir un contexte gauche-droite. Utilisez-les comme des affichages horizontaux complets pour diviser votre tableau de bord verticalement.

:::info
    Avoir des liens vers le support informatique, les astreintes opérationnelles, ou les propriétaires métier peut donner aux équipes un chemin rapide pour contacter les personnes qui peuvent aider lorsque des problèmes surviennent.
:::
:::tip
    Les hyperliens vers les systèmes de ticketing sont également un ajout très utile pour les tableaux de bord.
:::
