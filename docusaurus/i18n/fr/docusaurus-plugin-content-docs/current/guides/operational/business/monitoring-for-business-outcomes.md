# Pourquoi devriez-vous faire de l'Observability ?

Voir [Developing an Observability Strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ) sur YouTube

## Ce qui compte vraiment

Tout ce que vous faites au travail devrait s'aligner sur la mission de votre organisation. Tous ceux d'entre nous qui sont employés travaillent pour accomplir la mission de leur organisation et vers sa vision. Chez Amazon, notre mission stipule que :

> Amazon strives to be Earth's most customer-centric company, Earth's best employer, and Earth's safest place to work.

— [About Amazon](https://www.aboutamazon.com/about-us)

En informatique, chaque projet, déploiement, mesure de sécurité ou optimisation devrait contribuer à un résultat métier. Cela semble évident, mais vous ne devriez rien faire qui n'ajoute pas de valeur à l'entreprise. Comme le dit ITIL :

> Every change should deliver business value.

— ITIL Service Transition, AXELOS, 2011, page 44.  
— Voir [Change Management in the Cloud AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html)

La mission et la valeur métier sont importantes car elles devraient guider tout ce que vous faites. Les avantages de l'Observability sont nombreux, notamment :

- Meilleure disponibilité
- Plus de fiabilité
- Compréhension de la santé et des performances des applications
- Meilleure collaboration
- Détection proactive des problèmes
- Augmentation de la satisfaction client
- Réduction du délai de mise sur le marché
- Réduction des coûts opérationnels
- Automatisation

Tous ces avantages ont un point commun : ils offrent tous une valeur métier, soit directement au client, soit indirectement à l'organisation. Lorsque vous pensez à l'Observability, tout devrait revenir à se demander si votre application offre ou non une valeur métier.

Cela signifie que l'Observability devrait mesurer des éléments qui contribuent à offrir une valeur métier, en se concentrant sur les résultats métier et quand ils sont menacés : vous devriez réfléchir à ce que vos clients veulent et à ce dont ils ont besoin.

## Par où commencer ?

Maintenant que vous savez ce qui compte, vous devez réfléchir à ce que vous devez mesurer. Chez Amazon, nous partons du client et travaillons à rebours de ses besoins :

> We are internally driven to improve our services, adding benefits and features, before we have to. We lower prices and increase value for customers before we have to. We invent before we have to.

— Jeff Bezos, [2012 Shareholder Letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf)

Prenons un exemple simple, en utilisant un site de commerce en ligne. D'abord, réfléchissez à ce que vous attendez en tant que client lorsque vous achetez des produits en ligne, cela peut ne pas être le même pour tout le monde, mais vous vous souciez probablement de choses comme :

- La livraison
- Le prix
- La sécurité
- La vitesse de la page
- La recherche (pouvez-vous trouver le produit que vous cherchez ?)

Une fois que vous savez ce qui intéresse vos clients, vous pouvez commencer à mesurer ces éléments et comment ils affectent vos résultats métier. La vitesse de la page impacte directement votre taux de conversion et votre classement dans les moteurs de recherche. Une étude de 2017 a montré que plus de la moitié (53%) des utilisateurs mobiles abandonnent une page si elle met plus de 3 secondes à charger. Il existe bien sûr de nombreuses études qui montrent l'importance de la vitesse de la page, et c'est une métrique évidente à mesurer, mais vous devez la mesurer et agir car elle a un impact mesurable sur la conversion et vous pouvez utiliser ces données pour apporter des améliorations.

## Travailler à rebours

On ne peut pas s'attendre à ce que vous sachiez tout ce qui intéresse vos clients. Si vous lisez ceci, vous êtes probablement dans un rôle technique. Vous devez parler aux parties prenantes de votre organisation, ce n'est pas toujours facile, mais c'est essentiel pour vous assurer que vous mesurez ce qui est important.

Continuons avec l'exemple du commerce en ligne. Cette fois, considérons la recherche : il peut sembler évident que les clients doivent pouvoir rechercher un produit pour l'acheter, mais saviez-vous que selon un [rapport Forrester Research](https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561), 43% des visiteurs naviguent immédiatement vers la barre de recherche et les recherches sont 2 à 3 fois plus susceptibles de convertir par rapport aux non-chercheurs. La recherche est vraiment importante, elle doit bien fonctionner et vous devez la surveiller - peut-être découvrirez-vous que certaines recherches ne donnent aucun résultat et que vous devez passer d'une correspondance de motifs naïve au traitement du langage naturel. C'est un exemple de surveillance pour un résultat métier puis d'action pour améliorer l'expérience client.

Chez Amazon :

> We strive to deeply understand customers and work backwards from their pain points to rapidly develop innovations that create meaningful solutions in their lives.

— Daniel Slater - Worldwide Lead, Culture of Innovation, AWS dans [Elements of Amazon's Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)

Nous partons du client et travaillons à rebours de ses besoins. Ce n'est pas la seule approche vers le succès en affaires, mais c'est une bonne approche pour l'Observability. Travaillez avec les parties prenantes pour comprendre ce qui est important pour vos clients puis travaillez à rebours à partir de là.

En prime, si vous collectez des métriques importantes pour vos clients et parties prenantes, vous pouvez les visualiser dans des tableaux de bord en temps quasi réel et éviter d'avoir à créer des rapports ou à répondre à des questions telles que "combien de temps faut-il pour charger la page d'accueil ?" ou "combien coûte le fonctionnement du site web ?" - les parties prenantes et les dirigeants devraient pouvoir accéder à ces informations en libre-service.

Ce sont le type de métriques de haut niveau qui **comptent vraiment** pour votre application et elles sont aussi presque toujours le meilleur indicateur qu'il y a un problème. Par exemple : une alerte indiquant qu'il y a moins de commandes que ce à quoi vous vous attendriez normalement dans une période donnée vous indique qu'il y a probablement un problème qui impacte les clients ; une alerte indiquant qu'un volume sur un serveur est presque plein ou que vous avez un nombre élevé d'erreurs 5xx pour un service particulier peut être quelque chose qui nécessite une correction, mais vous devez encore comprendre l'impact client et ensuite prioriser en conséquence - cela peut prendre du temps.

Les problèmes qui impactent les clients sont faciles à identifier lorsque vous mesurez ces métriques métier de haut niveau. Ces métriques sont le **quoi** se passe-t-il. Les autres métriques et autres formes d'Observability comme le tracing et les logs sont le **pourquoi** cela se passe-t-il, ce qui vous mènera à ce que vous pouvez faire pour corriger ou améliorer.

## Quoi observer

Maintenant que vous avez une idée de ce qui compte pour vos clients, vous pouvez identifier les indicateurs clés de performance (KPIs). Ce sont vos métriques de haut niveau qui vous indiqueront si les résultats métier sont menacés. Vous devez également collecter des informations provenant de nombreuses sources différentes qui pourraient impacter ces KPIs, c'est là que vous devez commencer à réfléchir aux métriques qui pourraient impacter ces KPIs. Comme discuté précédemment, le nombre d'erreurs 5xx n'indique pas un impact, mais il pourrait avoir un effet sur vos KPIs. Remontez à rebours de ce qui impactera les résultats métier vers ce qui pourrait impacter les résultats métier.

Une fois que vous savez ce que vous devez collecter, vous devez identifier les sources d'information qui vous fourniront les métriques que vous pouvez utiliser pour mesurer les KPIs et les métriques connexes qui pourraient impacter ces KPIs. C'est la base de ce que vous observez.

Ces données proviennent probablement des métriques, des logs et des traces. Une fois que vous avez ces données, vous pouvez les utiliser pour alerter lorsque les résultats sont menacés.

Vous pouvez ensuite évaluer l'impact et tenter de rectifier le problème. Presque toujours, ces données vous indiqueront qu'il y a un problème, avant qu'une métrique technique isolée (comme le CPU ou la mémoire) ne le fasse.

Vous pouvez utiliser l'Observability de manière réactive pour corriger un problème impactant les résultats métier ou vous pouvez utiliser les données de manière proactive pour faire quelque chose comme améliorer l'expérience de recherche de vos clients.

## Conclusion

Bien que le CPU, la RAM, l'espace disque et d'autres métriques techniques soient importants pour la mise à l'échelle, les performances, la capacité et les coûts - ils ne vous disent pas vraiment comment se porte votre application et ne donnent aucun aperçu de l'expérience client.

Vos clients sont ce qui est important et c'est leur expérience que vous devriez surveiller.

C'est pourquoi vous devriez travailler à rebours des exigences de vos clients, en collaboration avec vos parties prenantes, et établir des KPIs et des métriques qui comptent.
