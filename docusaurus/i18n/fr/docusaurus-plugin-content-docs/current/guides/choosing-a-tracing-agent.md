# Choisir un agent de traçage

## Choisir le bon agent

AWS prend directement en charge deux ensembles d'outils pour la collecte de [traces](../signals/traces.md) (en plus de notre riche écosystème de [partenaires d'observabilité](https://aws.amazon.com/products/management-and-governance/partners/) :

* L'[AWS Distro for OpenTelemetry](https://aws-otel.github.io/), communément appelé ADOT
* Les [SDKs](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) et le [daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) X-Ray

Le choix de l'outil ou des outils à utiliser est une décision principale que vous devez prendre en faisant évoluer votre solution d'observabilité. Ces outils ne sont pas mutuellement exclusifs, et vous pouvez les combiner selon vos besoins. Et il existe une meilleure pratique pour effectuer cette sélection. Cependant, vous devez d'abord comprendre l'état actuel d'[OpenTelemetry (OTEL)](https://opentelemetry.io/).

OTEL est la spécification standard actuelle de l'industrie pour la signalisation d'observabilité, et contient des définitions pour chacun des trois types de signaux principaux : [métriques](../signals/metrics.md), [traces](../signals/traces.md) et [logs](../signals/logs.md). Cependant, OTEL n'a pas toujours existé et a évolué à partir de spécifications antérieures telles qu'[OpenMetrics](https://openmetrics.io) et [OpenTracing](https://opentracing.io). Les fournisseurs d'observabilité ont commencé à prendre en charge ouvertement le protocole OpenTelemetry Line Protocol (OTLP) ces dernières années.

AWS X-Ray et CloudWatch sont antérieurs à la spécification OTEL, tout comme d'autres solutions d'observabilité leaders. Cependant, le service AWS X-Ray accepte facilement les traces OTEL en utilisant ADOT. ADOT dispose déjà des intégrations nécessaires pour émettre de la télémétrie directement vers X-Ray, ainsi que vers d'autres solutions ISV.

Toute solution de traçage de transactions nécessite un agent et une intégration dans l'application sous-jacente afin de collecter des signaux. Et cela, à son tour, crée une dette technique sous forme de bibliothèques qui doivent être testées, maintenues et mises à jour, ainsi qu'un éventuel changement d'outillage si vous choisissez de modifier votre solution à l'avenir.

Les SDKs inclus avec X-Ray font partie d'une solution d'instrumentation étroitement intégrée offerte par AWS. ADOT fait partie d'une solution industrielle plus large dans laquelle X-Ray n'est qu'une des nombreuses solutions de traçage. Vous pouvez implémenter le traçage de bout en bout dans X-Ray en utilisant l'une ou l'autre approche, mais il est important de comprendre les différences afin de déterminer l'approche la plus utile pour vous.

:::info
	Nous recommandons d'instrumenter votre application avec AWS Distro for OpenTelemetry si vous avez besoin des éléments suivants :

    * La possibilité d'envoyer des traces à plusieurs backends de traçage différents sans avoir à ré-instrumenter votre code. Par exemple, si vous souhaitez passer de l'utilisation de la console X-Ray à [Zipkin](https://zipkin.io), seule la configuration du collecteur changerait, laissant le code de votre application intact.

    * La prise en charge d'un grand nombre d'instrumentations de bibliothèques pour chaque langage, maintenues par la communauté OpenTelemetry.
:::

:::info
	Nous recommandons de choisir un SDK X-Ray pour instrumenter votre application si vous avez besoin des éléments suivants :

    * Une solution mono-fournisseur étroitement intégrée.

    * L'intégration avec les règles d'échantillonnage centralisées de X-Ray, y compris la possibilité de configurer les règles d'échantillonnage depuis la console X-Ray et de les utiliser automatiquement sur plusieurs hôtes, lors de l'utilisation de Node.js, Python, Ruby ou .NET.
:::
