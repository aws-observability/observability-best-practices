# Logs

Les logs sont une série de messages envoyés par une application ou un appareil, représentés par une ou plusieurs lignes de détails sur un événement, ou parfois sur la santé de cette application. En général, les logs sont livrés dans un fichier, bien que parfois ils soient envoyés à un collecteur qui effectue l'analyse et l'agrégation. Il existe de nombreux agrégateurs de logs, frameworks et produits complets qui visent à simplifier la tâche de génération, d'ingestion et de gestion des données de logs à tout volume - de quelques mégaoctets par jour à plusieurs téraoctets par heure.

Les logs sont émis par une seule application à la fois et concernent généralement le périmètre de cette *seule application* - bien que les développeurs soient libres de rendre les logs aussi complexes et nuancés qu'ils le souhaitent. Pour nos besoins, nous considérons les logs comme un signal fondamentalement différent des [traces](./traces.md), qui sont composées d'événements provenant de plus d'une application ou d'un service, avec un contexte sur la connexion entre les services comme la latence de réponse, les défaillances de service, les paramètres de requête, etc.

Les données dans les logs peuvent également être agrégées sur une période de temps. Par exemple, elles peuvent être statistiques (par exemple, le nombre de requêtes servies au cours de la minute précédente). Elles peuvent être structurées, en format libre, verbeuses et dans n'importe quelle langue écrite.

Les principaux cas d'utilisation de la journalisation sont de décrire :

* un événement, incluant son statut et sa durée, ainsi que d'autres statistiques vitales
* les erreurs ou avertissements liés à cet événement (par exemple, les traces de pile, les délais d'attente)
* les lancements d'applications, les messages de démarrage et d'arrêt

:::note
	Les logs sont destinés à être *immuables*, et de nombreux systèmes de gestion de logs incluent des mécanismes pour protéger contre les tentatives de modification des données de logs, et pour les détecter.
:::
Quelles que soient vos exigences en matière de journalisation, voici les meilleures pratiques que nous avons identifiées.

## La journalisation structurée est la clé du succès

De nombreux systèmes émettent des logs dans un format semi-structuré. Par exemple, un serveur web Apache peut écrire des logs comme ceci, chaque ligne correspondant à une seule requête web :

	192.168.2.20 - - [28/Jul/2006:10:27:10 -0300] "GET /cgi-bin/try/ HTTP/1.0" 200 3395
	127.0.0.1 - - [28/Jul/2006:10:22:04 -0300] "GET / HTTP/1.0" 200 2216

Tandis qu'une trace de pile Java peut être un seul événement qui s'étend sur plusieurs lignes et est moins structuré :

	Exception in thread "main" java.lang.NullPointerException
        at com.example.myproject.Book.getTitle(Book.java:16)
        at com.example.myproject.Author.getBookTitles(Author.java:25)
        at com.example.myproject.Bootstrap.main(Bootstrap.java:14)

Et un événement de log d'erreur Python peut ressembler à ceci :
```
	Traceback (most recent call last):
	  File "e.py", line 7, in <module>
	    raise TypeError("Again !?!")
	TypeError: Again !?!
```
De ces trois exemples, seul le premier est facilement analysable à la fois par les humains *et* par un système d'agrégation de logs. L'utilisation de logs structurés facilite le traitement rapide et efficace des données de logs, donnant aux humains et aux machines les données dont ils ont besoin pour trouver immédiatement ce qu'ils cherchent.

Le format de log le plus couramment compris est JSON, dans lequel chaque composant d'un événement est représenté comme une paire clé/valeur. En JSON, l'exemple Python ci-dessus peut être réécrit comme suit :
```
	{
		"level", "ERROR"
		"file": "e.py",
		"line": 7,
		"error": "TypeError(\"Again !?!\")"
	}
```
L'utilisation de logs structurés rend vos données transportables d'un système de logs à un autre, simplifie le développement et accélère le diagnostic opérationnel (avec moins d'erreurs). De plus, l'utilisation de JSON embarque le schéma du message de log avec les données réelles, ce qui permet aux systèmes d'analyse de logs sophistiqués d'indexer automatiquement vos messages.

## Utilisez les niveaux de log de manière appropriée

Il existe deux types de logs : ceux qui ont un *niveau* et ceux qui sont une série d'événements. Pour ceux qui ont un niveau, celui-ci est un composant critique d'une stratégie de journalisation réussie. Les niveaux de log varient légèrement d'un framework à l'autre, mais en général ils suivent cette structure :

| Niveau | Description |
| ----- | ----------- |
| `DEBUG` | Événements informationnels à grain fin qui sont les plus utiles pour déboguer une application. Ceux-ci sont généralement utiles aux développeurs et sont très verbeux. |
| `INFO` | Messages informationnels qui mettent en évidence la progression de l'application à un niveau grossier. |
| `WARN` | Situations potentiellement nuisibles qui indiquent un risque pour une application. Celles-ci peuvent déclencher une alarme dans une application. |
| `ERROR` | Événements d'erreur qui pourraient encore permettre à l'application de continuer à fonctionner. Ceux-ci sont susceptibles de déclencher une alarme nécessitant une attention. |
| `FATAL` | Événements d'erreur très graves qui vont probablement causer l'arrêt de l'application. |

:::info
	Implicitement, les logs qui n'ont pas de niveau explicite peuvent être considérés comme `INFO`, bien que ce comportement puisse varier entre les applications.
:::
D'autres niveaux de log courants sont `CRITICAL` et `NONE`, selon vos besoins, votre langage de programmation et votre framework. `ALL` et `NONE` sont également courants, bien qu'ils ne soient pas présents dans toutes les piles applicatives.

Les niveaux de log sont cruciaux pour informer votre solution de surveillance et d'observabilité sur la santé de votre environnement, et les données de log doivent facilement exprimer ces données à l'aide d'une valeur logique.

:::tip
	Journaliser trop de données au niveau `WARN` remplira votre système de surveillance avec des données de valeur limitée, et vous pourriez alors perdre des données importantes dans le volume considérable de messages.
:::
![Organigramme des logs](./images/logs1.png)

:::info
	L'utilisation d'une stratégie de niveaux de log standardisée facilite l'automatisation et aide les développeurs à identifier rapidement la cause racine des problèmes.
:::

:::warning
	Sans une approche standard des niveaux de log, [filtrer vos logs](#filtrer-les-logs-au-plus-près-de-la-source) est un défi majeur.
:::
## Filtrer les logs au plus près de la source

Dans la mesure du possible, réduisez le volume de logs au plus près de la source. Il existe de nombreuses raisons de suivre cette meilleure pratique :

* L'ingestion de logs coûte toujours du temps, de l'argent et des ressources.
* Le filtrage des données sensibles (par exemple, les données personnellement identifiables) des systèmes en aval réduit l'exposition au risque de fuite de données.
* Les systèmes en aval peuvent ne pas avoir les mêmes préoccupations opérationnelles que les sources de données. Par exemple, les logs `INFO` d'une application peuvent n'avoir aucun intérêt pour un système de surveillance et d'alerte qui surveille les messages `CRITICAL` ou `FATAL`.
* Les systèmes de logs et les réseaux n'ont pas besoin d'être soumis à un stress et un trafic indus.

:::info
	Filtrez vos logs au plus près de la source pour maintenir vos coûts bas, diminuer le risque d'exposition des données et concentrer chaque composant sur les [choses qui comptent](../guides/index.md#monitor-what-matters).
:::

:::tip
	Selon votre architecture, vous pouvez souhaiter utiliser l'infrastructure as code (IaC) pour déployer les changements de votre application *et* de votre environnement en une seule opération. Cette approche vous permet de déployer vos modèles de filtrage de logs avec les applications, en leur accordant la même rigueur et le même traitement.
:::
## Évitez les anti-patterns de double ingestion

Un pattern courant que les administrateurs poursuivent est de copier toutes leurs données de journalisation dans un système unique dans le but d'interroger tous leurs logs depuis un seul emplacement. Il y a certains avantages de workflow manuel à faire cela, cependant ce pattern introduit des coûts supplémentaires, de la complexité, des points de défaillance et une charge opérationnelle additionnelle.

![Double ingestion de logs](./images/logs2.png)

:::info
	Dans la mesure du possible, utilisez une combinaison de [niveaux de log](#utilisez-les-niveaux-de-log-de-manière-appropriée) et de [filtrage de logs](#filtrer-les-logs-au-plus-près-de-la-source) pour éviter une propagation massive des données de logs depuis vos environnements.
:::

:::info
	Certaines organisations ou charges de travail nécessitent le [log shipping](https://en.wikipedia.org/wiki/Log_shipping) afin de répondre aux exigences réglementaires, stocker les logs dans un emplacement sécurisé, fournir la non-répudiation ou atteindre d'autres objectifs. C'est un cas d'utilisation courant pour la ré-ingestion de données de logs. Notez qu'une application appropriée des [niveaux de log](#utilisez-les-niveaux-de-log-de-manière-appropriée) et du [filtrage de logs](#filtrer-les-logs-au-plus-près-de-la-source) reste appropriée pour réduire le volume de données superflues entrant dans ces archives de logs.
:::
## Collectez des données métriques à partir de vos logs

Vos logs contiennent des [métriques](./metrics.md) qui n'attendent qu'à être collectées ! Même les solutions ISV ou les applications que vous n'avez pas écrites vous-même émettront des données précieuses dans leurs logs à partir desquelles vous pouvez extraire des informations significatives sur la santé globale de la charge de travail. Les exemples courants incluent :

* Le temps de requête lente des bases de données
* Le temps de disponibilité des serveurs web
* Le temps de traitement des transactions
* Le nombre d'événements `ERROR` ou `WARNING` au fil du temps
* Le nombre brut de paquets disponibles pour mise à jour

:::tip
	Ces données sont moins utiles lorsqu'elles sont verrouillées dans un fichier de log statique. La meilleure pratique est d'identifier les données métriques clés puis de les publier dans votre système de métriques où elles peuvent être corrélées avec d'autres signaux.
:::
## Journaliser vers `stdout`

Dans la mesure du possible, les applications devraient journaliser vers `stdout` plutôt que vers un emplacement fixe tel qu'un fichier ou un socket. Cela permet aux agents de logs de collecter et router vos événements de log en fonction de règles qui ont du sens pour votre propre solution d'observabilité. Bien que ce ne soit pas possible pour toutes les applications, c'est la meilleure pratique pour les charges de travail conteneurisées.

:::note
	Bien que les applications doivent être génériques et simples dans leurs pratiques de journalisation, restant faiblement couplées aux solutions de journalisation, la transmission des données de logs nécessite tout de même un [collecteur de logs](../tools/logs/index.md) pour envoyer les données de `stdout` vers un fichier. Le concept important est d'éviter que la logique applicative et métier soit dépendante de votre infrastructure de journalisation - en d'autres termes, vous devez travailler à séparer vos préoccupations.
:::

:::info
	Découpler votre application de votre gestion de logs vous permet d'adapter et de faire évoluer votre solution sans changements de code, minimisant ainsi le rayon d'impact potentiel des changements apportés à votre environnement.
:::
