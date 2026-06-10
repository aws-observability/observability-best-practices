# Observability serverless basée sur AWS Lambda avec OpenTelemetry

Ce guide couvre les bonnes pratiques pour configurer l'observability des applications serverless basées sur Lambda en utilisant des outils et technologies open source gérés conjointement avec les services de surveillance natifs AWS tels qu'AWS X-Ray et Amazon CloudWatch. Nous couvrirons des outils tels que [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction), [AWS X-Ray](https://aws.amazon.com/xray) et [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) et comment vous pouvez utiliser ces outils pour obtenir des informations exploitables sur vos applications serverless, résoudre des problèmes et optimiser les performances des applications.

## **Sujets clés couverts**

Dans cette section du guide des bonnes pratiques d'observability, nous approfondirons les sujets suivants :

* Introduction à AWS Distro for OpenTelemetry (ADOT) et ADOT Lambda Layer
* Auto-instrumentation de fonctions Lambda avec ADOT Lambda Layer
* Support de configuration personnalisée pour ADOT Collector
* Intégration avec Amazon Managed Service for Prometheus (AMP)
* Avantages et inconvénients de l'utilisation d'ADOT Lambda Layer
* Gestion de la latence de démarrage à froid lors de l'utilisation d'ADOT


## **Introduction à AWS Distro for OpenTelemetry (ADOT)**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) est une distribution sécurisée, prête pour la production et supportée par AWS du projet [OpenTelemetry (OTel)](https://opentelemetry.io/) de la Cloud Native Computing Foundation (CNCF). En utilisant ADOT, vous pouvez instrumenter vos applications une seule fois et envoyer des métriques et des traces corrélées à plusieurs solutions de surveillance.

Le [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) géré par AWS utilise [OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) pour exporter les données de télémétrie. Il offre une expérience utilisateur plug-and-play en enveloppant une fonction AWS Lambda et en empaquetant le SDK OpenTelemetry spécifique au runtime, une version allégée du collecteur ADOT ainsi qu'une configuration prête à l'emploi pour l'auto-instrumentation des fonctions AWS Lambda. Les composants du collecteur ADOT Lambda Layer, tels que les Receivers, les Exporters et les Extensions, prennent en charge l'intégration avec Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus, AWS X-Ray et d'autres. Trouvez la liste complète [ici](https://github.com/aws-observability/aws-otel-lambda). ADOT prend également en charge les intégrations avec les [solutions partenaires](https://aws.amazon.com/otel/partners).

ADOT Lambda Layer prend en charge à la fois l'auto-instrumentation (pour Python, NodeJS et Java) ainsi que l'instrumentation personnalisée pour tout ensemble spécifique de bibliothèques et SDK. Avec l'auto-instrumentation, par défaut, le Lambda Layer est configuré pour exporter les traces vers AWS X-Ray. Pour l'instrumentation personnalisée, vous devrez inclure l'instrumentation de bibliothèque correspondante depuis le [dépôt d'instrumentation OpenTelemetry runtime](https://github.com/open-telemetry) respectif et modifier votre code pour l'initialiser dans votre fonction.

## **Auto-instrumentation avec ADOT Lambda Layer et AWS Lambda**

Vous pouvez facilement activer l'auto-instrumentation d'une fonction Lambda avec ADOT Lambda Layer sans aucune modification de code. Prenons un exemple d'ajout d'ADOT Lambda Layer à votre fonction Lambda existante basée sur Java et visualisons les journaux d'exécution et les traces dans CloudWatch.

1. Choisissez l'ARN du Lambda Layer en fonction du `runtime`, de la `region` et du `type d'architecture` selon la [documentation](https://aws-otel.github.io/docs/getting-started/lambda). Assurez-vous d'utiliser le Lambda Layer dans la même région que votre fonction Lambda. Par exemple, le Lambda Layer pour l'auto-instrumentation Java serait `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1`
2. Ajoutez le Layer à votre fonction Lambda soit via la Console, soit via l'IaC de votre choix.
    * Avec la Console AWS, suivez les [instructions](https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html) pour ajouter un Layer à votre fonction Lambda. Sous Specify an ARN, collez l'ARN du layer sélectionné ci-dessus.
    * Avec l'option IaC, le template SAM pour la fonction Lambda ressemblerait à ceci :
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```
3. Ajoutez une variable d'environnement `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler` pour Node.js ou Java, et `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument` pour Python à votre fonction Lambda.
4. Activez le traçage actif pour votre fonction Lambda. **`Note`** : par défaut, le layer est configuré pour exporter les traces vers AWS X-Ray. Assurez-vous que le rôle d'exécution de votre fonction Lambda dispose des permissions AWS X-Ray requises. Pour en savoir plus sur les permissions AWS X-Ray pour AWS Lambda, consultez la [documentation AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html#services-xray-permissions).
    * `Tracing: Active`
5. Un exemple de template SAM avec la configuration Lambda Layer, la variable d'environnement et le traçage X-Ray ressemblerait à ceci :
```
Resources:
  ListBucketsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: com.example.App::handleRequest
      ...
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 1
      Policies:
        - AWSXrayWriteOnlyAccess
        - AmazonS3ReadOnlyAccess
      Environment:
        Variables:
          AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler
      Tracing: Active
      Layers:
        - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-1:1
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /listBuckets
            Method: get
```
6. Test et visualisation des traces dans AWS X-Ray
Invoquez votre fonction Lambda directement ou via une API (si une API est configurée comme déclencheur). Par exemple, l'invocation d'une fonction Lambda via une API (en utilisant `curl`) générerait les journaux ci-dessous :
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Journaux de la fonction Lambda :
<pre><code>
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
[otel.javaagent 2023-09-24 15:28:16:862 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws
EXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]
START RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3
...
END RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940
REPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms
<b>XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true</b>
</code></pre>

Comme vous pouvez le voir dans les journaux, l'extension OpenTelemetry Lambda commence à écouter et instrumenter les fonctions Lambda en utilisant opentelemetry-javaagent et génère des traces dans AWS X-Ray.

Pour visualiser les traces de l'invocation de la fonction Lambda ci-dessus, naviguez vers la console AWS X-Ray et sélectionnez l'ID de trace sous Traces. Vous devriez voir une carte de traces (Trace Map) ainsi qu'une chronologie des segments (Segments Timeline) comme ci-dessous :
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)


## **Support de configuration personnalisée pour ADOT Collector**

ADOT Lambda Layer combine à la fois le SDK OpenTelemetry et les composants du collecteur ADOT. La configuration du collecteur ADOT suit la norme OpenTelemetry. Par défaut, ADOT Lambda Layer utilise [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml), qui exporte les données de télémétrie vers AWS X-Ray. Cependant, ADOT Lambda Layer prend également en charge d'autres exporters, ce qui vous permet d'envoyer des métriques et des traces vers d'autres destinations. Trouvez la liste complète des composants disponibles pour la configuration personnalisée [ici](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components).

## **Intégration avec Amazon Managed Service for Prometheus (AMP)**

Vous pouvez utiliser une configuration de collecteur personnalisée pour exporter les métriques de votre fonction Lambda vers Amazon Managed Prometheus (AMP).

1. Suivez les étapes de l'auto-instrumentation ci-dessus pour configurer le Lambda Layer et définir la variable d'environnement `AWS_LAMBDA_EXEC_WRAPPER`.
2. Suivez les [instructions](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html) pour créer un espace de travail Amazon Managed Prometheus dans votre compte AWS, où votre fonction Lambda enverra les métriques. Notez l'`Endpoint - remote write URL` de l'espace de travail AMP. Vous en aurez besoin pour la configuration du collecteur ADOT.
3. Créez un fichier de configuration de collecteur ADOT personnalisé (par exemple `collector.yaml`) dans le répertoire racine de votre fonction Lambda avec les détails de l'URL d'écriture distante de l'endpoint AMP de l'étape précédente. Vous pouvez également charger le fichier de configuration depuis un bucket S3.
Exemple de fichier de configuration de collecteur ADOT :
```
#collector.yaml in the root directory
#Set an environemnt variable 'OPENTELEMETRY_COLLECTOR_CONFIG_FILE' to '/var/task/collector.yaml'

extensions:
  sigv4auth:
    service: "aps"
    region: "<workspace_region>"

receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  logging:
  prometheusremotewrite:
    endpoint: "<workspace_remote_write_url>"
    namespace: test
    auth:
      authenticator: sigv4auth

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      exporters: [logging, prometheusremotewrite]
```
Le Prometheus Remote Write Exporter peut également être configuré avec des paramètres de retry et de timeout. Pour plus d'informations, consultez la [documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md). **`Note`** : La valeur du service pour l'extension `sigv4auth` doit être `aps` (amazon prometheus service). Assurez-vous également que le rôle d'exécution de votre fonction Lambda dispose des permissions AMP requises. Pour plus d'informations sur les permissions et politiques requises pour AMP avec AWS Lambda, consultez la [documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-and-IAM.html#AMP-IAM-policies-built-in) Amazon Managed Service for Prometheus.

4. Ajoutez une variable d'environnement `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` et définissez la valeur sur le chemin du fichier de configuration. Par ex. /var/task/`<path to config file>`.yaml. Cela indiquera à l'extension Lambda Layer où trouver la configuration du collecteur.
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. Mettez à jour le code de votre fonction Lambda pour ajouter des métriques en utilisant l'API OpenTelemetry Metrics. Consultez les exemples ici.
```
// get meter
Meter meter = GlobalOpenTelemetry.getMeterProvider()
    .meterBuilder("aws-otel")
    .setInstrumentationVersion("1.0")
    .build();

// Build counter e.g. LongCounter
LongCounter counter = meter
    .counterBuilder("processed_jobs")
    .setDescription("Processed jobs")
    .setUnit("1")
    .build();

// It is recommended that the API user keep a reference to Attributes they will record against
Attributes attributes = Attributes.of(stringKey("Key"), "SomeWork");

// Record data
counter.add(123, attributes);
```

## **Avantages et inconvénients de l'utilisation d'ADOT Lambda Layer**

Si vous avez l'intention d'envoyer des traces vers AWS X-Ray depuis une fonction Lambda, vous pouvez utiliser soit le [SDK X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html), soit le [AWS Distro for OpenTelemetry (ADOT) Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda). Bien que le SDK X-Ray prenne en charge l'instrumentation facile de divers services AWS, il ne peut envoyer des traces qu'à X-Ray. En revanche, le collecteur ADOT, qui est inclus dans le Lambda Layer, prend en charge un grand nombre d'instrumentations de bibliothèques pour chaque langage. Vous pouvez l'utiliser pour collecter et envoyer des métriques et des traces vers AWS X-Ray et d'autres solutions de surveillance, telles qu'Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus et d'autres solutions [partenaires](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics).

Cependant, en raison de la flexibilité qu'offre ADOT, votre fonction Lambda peut nécessiter de la mémoire supplémentaire et peut subir un impact notable sur la latence de démarrage à froid. Donc, si vous optimisez votre fonction Lambda pour une faible latence et n'avez pas besoin des fonctionnalités avancées d'OpenTelemetry, l'utilisation du SDK AWS X-Ray plutôt qu'ADOT pourrait être plus appropriée. Pour une comparaison détaillée et des conseils sur le choix du bon outil de traçage, consultez la documentation AWS sur le [choix entre ADOT et le SDK X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing).


## **Gestion de la latence de démarrage à froid lors de l'utilisation d'ADOT**
ADOT Lambda Layer pour Java est basé sur un agent, ce qui signifie que lorsque vous activez l'auto-instrumentation, Java Agent essaiera d'instrumenter toutes les bibliothèques [supportées](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation) par OTel. Cela augmentera significativement la latence de démarrage à froid de la fonction Lambda. Nous recommandons donc de n'activer l'auto-instrumentation que pour les bibliothèques/frameworks utilisés par votre application.

Pour n'activer que des instrumentations spécifiques, vous pouvez utiliser les variables d'environnement suivantes :

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED` : lorsque défini à false, désactive l'auto-instrumentation dans le Layer, nécessitant que chaque instrumentation soit activée individuellement.
* `OTEL_INSTRUMENTATION_<NAME>_ENABLED` : défini à true pour activer l'auto-instrumentation pour une bibliothèque ou un framework spécifique. Remplacez "NAME" par l'instrumentation que vous souhaitez activer. Pour la liste des instrumentations disponibles, consultez Suppressing specific agent instrumentation.

Par exemple, pour n'activer l'auto-instrumentation que pour Lambda et le SDK AWS, vous définiriez les variables d'environnement suivantes :
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```

## **Ressources supplémentaires**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)

## **Résumé**

Dans ce guide de bonnes pratiques d'observability pour les applications serverless basées sur AWS Lambda utilisant des technologies Open Source, nous avons couvert AWS Distro for OpenTelemetry (ADOT) et Lambda Layer et comment vous pouvez l'utiliser pour instrumenter vos fonctions AWS Lambda. Nous avons expliqué comment vous pouvez facilement activer l'auto-instrumentation et personnaliser le collecteur ADOT avec une configuration simple pour envoyer les signaux d'observability vers plusieurs destinations. Nous avons mis en évidence les avantages et inconvénients de l'utilisation d'ADOT et comment cela peut impacter la latence de démarrage à froid de votre fonction Lambda, et nous avons également recommandé des bonnes pratiques pour gérer les temps de démarrage à froid. En adoptant ces bonnes pratiques, vous pouvez instrumenter vos applications une seule fois pour envoyer des journaux, métriques et traces à plusieurs solutions de surveillance de manière indépendante du fournisseur.

Pour approfondir davantage, nous vous recommandons vivement de pratiquer le module Observability open source géré par AWS de l'[AWS One Observability Workshop](https://catalog.workshops.aws/observability/en-US).
