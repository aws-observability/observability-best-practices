# Instrumentation des applications Java Spring Integration

Cet article décrit une approche pour instrumenter manuellement les applications [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) en utilisant [Open Telemetry](https://opentelemetry.io/) et [X-ray](https://aws.amazon.com/xray/).

Le framework Spring-Integration est conçu pour permettre le développement de solutions d'intégration typiques des architectures événementielles et des architectures centrées sur la messagerie. D'autre part, OpenTelemetry tend à être plus axé sur les architectures de microservices, dans lesquelles les services communiquent et se coordonnent entre eux via des requêtes HTTP. Par conséquent, ce guide fournira un exemple d'instrumentation des applications Spring-Integration en utilisant l'instrumentation manuelle avec l'API OpenTelemetry.

## Informations contextuelles

### Qu'est-ce que le traçage ?

La citation suivante de la [documentation OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/traces/) donne un bon aperçu de l'objectif d'une trace :

:::note
    Les traces nous donnent une vue d'ensemble de ce qui se passe lorsqu'une requête est adressée à une application. Que votre application soit un monolithe avec une base de données unique ou un maillage sophistiqué de services, les traces sont essentielles pour comprendre le "chemin" complet qu'emprunte une requête dans votre application.
:::
Étant donné que l'un des principaux avantages du traçage est la visibilité de bout en bout d'une requête, il est important que les traces relient correctement tous les éléments depuis l'origine de la requête jusqu'au backend. Une façon courante de procéder dans OpenTelemetry est d'utiliser les [spans imbriqués](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans). Cela fonctionne dans une architecture de microservices où les spans sont transmis de service en service jusqu'à atteindre la destination finale. Dans une application Spring Integration, nous devons créer des relations parent/enfant entre les spans créés à la fois à distance ET localement.

## Traçage utilisant la propagation de contexte

Nous allons démontrer une approche utilisant la propagation de contexte. Bien que cette approche soit traditionnellement utilisée lorsque vous devez créer une relation parent/enfant entre des spans créés localement et dans des emplacements distants, elle sera utilisée dans le cas de l'application Spring Integration car elle simplifie le code et permettra à l'application de passer à l'échelle : il sera possible de traiter les messages en parallèle dans plusieurs threads et il sera également possible de monter en charge horizontalement si nous devons traiter les messages sur différents hôtes.

Voici un aperçu de ce qui est nécessaire pour y parvenir :

- Créer un ```ChannelInterceptor``` et l'enregistrer comme ```GlobalChannelInterceptor``` afin qu'il puisse capturer les messages envoyés à travers tous les canaux.

- Dans le ```ChannelInterceptor``` :
  - Dans la méthode ```preSend``` :
    - Essayer de lire le contexte du message précédent généré en amont. C'est ici que nous pouvons connecter les spans des messages en amont. Si aucun contexte n'existe, une nouvelle trace est démarrée (cela est fait par le SDK OpenTelemetry).
    - Créer un Span avec un nom unique qui identifie cette opération. Cela peut être le nom du canal où ce message est traité.
    - Sauvegarder le contexte actuel dans le message.
    - Stocker le contexte et le scope dans thread.local afin qu'ils puissent être fermés par la suite.
    - Injecter le contexte dans le message envoyé en aval.
  - Dans ```afterSendCompletion``` :
    - Restaurer le contexte et le scope depuis thread.local
    - Recréer le span à partir du contexte.
    - Enregistrer toute exception survenue lors du traitement du message.
    - Fermer le Scope.
    - Terminer le Span.

Ceci est une description simplifiée de ce qui doit être fait. Nous fournissons un exemple d'application fonctionnelle qui utilise le framework Spring-Integration. Le code de cette application peut être trouvé [ici](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp).

Pour visualiser uniquement les modifications mises en place pour instrumenter l'application, consultez ce [diff](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437).

### Pour exécuter cet exemple d'application :

``` bash
# build and run
mvn spring-boot:run
# create sample input file to trigger flow
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

Pour expérimenter avec cet exemple d'application, vous devrez avoir le [collecteur ADOT](https://aws-otel.github.io/docs/getting-started/collector) en cours d'exécution sur la même machine que l'application avec une configuration similaire à la suivante :

``` yaml
receivers:
  otlp:
    protocols:
      grpc: 
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s
exporters:
  aws xray: region:us-west-2
  aws emf:
    region: us-west-2
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      processors: [batch/metrics]
      exporters: [awsemf]
```

## Résultats

Si nous exécutons l'exemple d'application puis exécutons la commande suivante, voici ce que nous obtenons :

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![Résultats X-ray](x-ray-results.png)

Nous pouvons voir que les segments ci-dessus correspondent au flux de travail décrit dans l'exemple d'application. Des exceptions sont attendues lorsque certains messages sont traités, nous pouvons donc voir qu'elles sont correctement enregistrées et nous permettront de les diagnostiquer dans X-Ray.


## FAQ

### Comment créer des spans imbriqués ?

Il existe trois mécanismes dans OpenTelemetry qui peuvent être utilisés pour connecter des spans :

##### Explicitement

Vous devez passer le span parent à l'endroit où le span enfant est créé et les lier en utilisant :

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```

##### Implicitement

Le contexte du span sera stocké dans thread.local sous le capot.
Cette méthode est indiquée lorsque vous êtes sûr de créer des spans dans le même thread.

``` java
    void parentTwo() {
        Span parentSpan = tracer.spanBuilder("parent").startSpan(); 
        try(Scope scope = parentSpan.makeCurrent()) {
            childTwo(); 
        } finally {
        parentSpan.end(); 
        }
    }
    void childTwo() {
        Span childSpan = tracer.spanBuilder("child")
            // NOTE: setParent(...) is not required;
            // `Span.current()` is automatically added as the parent 
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // do stuff
        } finally {
            childSpan.end();
        } 
    }
```

##### Propagation de contexte

Cette méthode stockera le contexte quelque part (en-têtes HTTP ou dans un message) afin qu'il puisse être transporté vers un emplacement distant où le span enfant est créé. Ce n'est pas une exigence stricte qu'il s'agisse d'un emplacement distant. Cela peut également être utilisé dans le même processus.

### Comment les propriétés OpenTelemetry sont-elles traduites en propriétés X-Ray ?

Veuillez consulter le [guide](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation) suivant pour voir la correspondance.



  
