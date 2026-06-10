# AWS X-Ray - FAQ

## AWS Distro for Open Telemetry (ADOT) prend-il en charge la propagation des traces à travers les services AWS tels qu'Event Bridge ou SQS ?

Techniquement, ce n'est pas ADOT mais AWS X-Ray. Nous travaillons à l'expansion du nombre et des types de services AWS qui propagent et/ou génèrent des spans. Si vous avez un cas d'utilisation qui en dépend, veuillez nous contacter.

## Pourrai-je utiliser l'en-tête de trace W3C pour ingérer des spans dans AWS X-Ray en utilisant ADOT ?

Oui. L'[en-tête de trace W3C](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) a été publié le 27 octobre 2023.

## Puis-je tracer des requêtes à travers des fonctions Lambda lorsque SQS est impliqué au milieu ?

Oui. X-Ray prend désormais en charge le traçage à travers des fonctions Lambda lorsque SQS est impliqué au milieu. Les traces des producteurs de messages en amont sont [automatiquement liées aux traces](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html) des nœuds consommateurs Lambda en aval, créant une vue de bout en bout de l'application.

## Devrais-je utiliser le SDK X-Ray ou le SDK OTel pour instrumenter mon application ?

OTel offre plus de fonctionnalités que le SDK X-Ray, mais pour choisir celui qui convient à votre cas d'utilisation, consultez [Choosing between ADOT and X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)

## Les [span events](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) sont-ils pris en charge dans AWS X-Ray ?

Les span events ne correspondent pas au modèle X-Ray et sont donc ignorés.

## Comment puis-je extraire des données d'AWS X-Ray ?

Vous pouvez récupérer les données de Service Graph, Traces et Root cause analytics [en utilisant les API X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html).

## Puis-je atteindre un échantillonnage à 100 % ? C'est-à-dire, je veux que toutes les traces soient enregistrées sans aucun échantillonnage.

Vous pouvez ajuster les règles d'échantillonnage pour capturer une quantité significativement accrue de données de traces. Tant que le total des segments envoyés ne dépasse pas les [limites de quota de service mentionnées ici](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray), X-Ray fera un effort pour collecter les données comme configuré. Il n'y a cependant aucune garantie que cela résultera en une capture de données de traces à 100 %.

## Puis-je augmenter ou diminuer dynamiquement les règles d'échantillonnage via des API ?

Oui, vous pouvez utiliser les [API d'échantillonnage X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) pour effectuer des ajustements dynamiquement selon vos besoins. Consultez ce [blog pour une explication basée sur des cas d'utilisation](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/).

**FAQ produit :** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)
