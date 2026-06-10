# Differentes configurations d'instrumentation et de collecteur

Navigation rapide :

- [Approches d'instrumentation](#approches-dinstrumentation)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + Custom OTEL Collector](#adot-sdk--custom-otel-collector)
- [Upstream OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [Tracing sans collecteur avec les endpoints OTLP](#collector-less-tracing-with-otlp-endpoints)
- [X-Ray SDK existant + X-Ray Daemon (fin de support)](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [Resume du calcul des metriques RED](#red-metrics-calculation-summary)

---

## Approches d'instrumentation

### Auto-instrumentation

**Quand l'utiliser :** Demarrage rapide, changements de code minimaux, deploiements en production

**Qui devrait l'utiliser :** Equipes DevOps, ingenieurs de plateforme, organisations privilegiant la rapidite

**Avantages :**
- Aucune modification de code requise
- Valeur ajoutee rapide
- Couvre automatiquement les frameworks courants
- Facile a annuler si necessaire

**Limitations :**
- Moins de controle sur ce qui est instrumente
- Peut capturer plus de donnees que necessaire
- La logique metier personnalisee necessite une instrumentation manuelle supplementaire

### Instrumentation manuelle OpenTelemetry

**Quand l'utiliser :** Metriques metier personnalisees, portabilite entre fournisseurs, controle precis

**Qui devrait l'utiliser :** Developpeurs d'applications, equipes avec une expertise en Observability

**Avantages :**
- Controle complet sur les donnees de telemetrie
- Spans et attributs personnalises pour la logique metier
- Neutre vis-a-vis des fournisseurs (fonctionne avec d'autres outils APM)
- Controle precis de l'impact sur les performances

**Compromis :**
- Necessite des modifications de code
- Plus complexe a implementer
- Maintenance continue a mesure que le code evolue

---

## Options de configuration instrumentation + collecteur

## ADOT SDK + CloudWatch Agent

Cette approche fournit l'experience AWS la plus integree avec une integration profonde des services et une correlation automatique avec les metriques d'infrastructure AWS.

### Avantages cles
- **Les metriques telles que le volume d'appels, la disponibilite, la latence, les fautes et les erreurs** sont calculees sur 100 % des requetes cote client avant la decision d'echantillonnage
- **Integration de l'echantillonnage X-Ray** utilise les regles d'echantillonnage X-Ray par defaut (configurer a 100 % si necessaire)
- **Integration CloudWatch Logs prete a l'emploi** pour une correlation transparente des journaux
- **Support AWS complet** pour l'ensemble de la pile d'Observability
- **Decouverte automatique des services** et signaux dores

### Architecture

![ADOT SDK + CloudWatch Agent Architecture](/apm-src/assets/images/deep-dive/adotcw.png)

### Comment fonctionne ADOT SDK + CloudWatch Agent

**Etape 1 : Instrumentation de l'application**

Lorsque vous deployez le SDK ADOT, il instrumente automatiquement votre application sans necessiter de modifications de code. Le SDK ADOT injecte dynamiquement du code dans une application au moment de l'execution, sans necessiter de modifications manuelles du code. Ce code injecte detecte automatiquement les appels aux frameworks supportes, cree des spans pour chaque operation et propage le contexte entre les services pour construire une trace complete.

**Etape 2 : Decision d'echantillonnage**

Pour chaque requete, le SDK ADOT verifie vos regles d'echantillonnage X-Ray pour decider s'il faut envoyer les donnees de trace completes. Vous pouvez configurer cela de 5 % pour des economies de cout jusqu'a 100 % pour une visibilite complete.

**Etape 3 : Calcul des metriques cote client**

Voici l'avantage cle : avant que l'echantillonnage n'ait lieu, le SDK calcule les metriques RED (Requests, Errors, Duration) sur 100 % des requetes lorsque `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`. Cela signifie que vous obtenez des signaux dores complets meme avec des taux d'echantillonnage faibles :
- **Rate** : Nombre de requetes par fenetre temporelle
- **Errors** : Nombre de requetes avec des codes de statut d'erreur (4xx/5xx)
- **Duration** : Mesures de latence a partir des heures de debut/fin des requetes

**Etape 4 : Traitement par le CloudWatch Agent**

Le SDK ADOT envoie a la fois les spans echantillonnes et les metriques pre-calculees au CloudWatch Agent, qui les traite via un pipeline :

![ADOT SDK CloudWatch Agent Detailed Pipeline](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver** : Accepte les traces et metriques de votre application
- **Resource Detector** : Ajoute les informations de ressources AWS (ID d'instance, details des conteneurs)
- **APM Processor** : Enrichit les spans avec des metadonnees specifiques a la plateforme
- **Exporters** : Achemine les donnees vers X-Ray (spans) et CloudWatch (metriques)

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**Etape 5 : Distribution des donnees**

Vos donnees se divisent en trois chemins :
- **Metriques** → groupe de journaux `/aws/application-signals/data` pour les Application Maps
- **Spans** → groupe de journaux `aws/spans` pour Transaction Search
- **Spans indexes** → backend X-Ray pour l'analyse de traces traditionnelle

**Etape 6 : Options d'analyse**

Cela vous donne trois facons d'analyser vos donnees :
- **Application Signals** : Application Maps avec regroupement dynamique et signaux dores a partir de metriques completes
- **Transaction Search** : Interroger toutes les donnees de spans avec des filtres avances
- **X-Ray Analytics** : Analyse de traces traditionnelle sur les spans indexes

### Guides d'implementation

Suivez les guides de configuration specifiques a la plateforme :
- [Enable Application Signals on Amazon EKS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [Enable Application Signals on Amazon ECS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [Enable Application Signals on Amazon EC2](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [Enable Application Signals on Self hosted Kubernetes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals Demo repository](https://github.com/aws-observability/application-signals-demo)

Une fois termine, verifiez la decouverte des services et les signaux dores dans la console Application Signals.


## ADOT SDK + Custom OTEL Collector

Cette approche combine le calcul des metriques RED cote client du SDK ADOT avec la flexibilite d'un OpenTelemetry Collector personnalise qui inclut le processeur AWS Application Signals. Vous obtenez les memes metriques precises sur 100 % du trafic que l'approche CloudWatch Agent, plus la possibilite de distribuer la telemetrie vers plusieurs destinations.

### Avantages cles
- **Metriques RED cote client sur 100 % des requetes** via le SDK ADOT (meme chose que l'approche CW Agent) — les metriques sont calculees avant l'echantillonnage
- **Telemetrie multi-destinations** — distribution vers AWS, Datadog, Prometheus, etc. simultanement
- **Processeur App Signals** normalise les attributs `aws.local.*` / `aws.remote.*`, resout le contexte de plateforme et controle la cardinalite
- **Controle complet du pipeline du collecteur** — ajoutez des processeurs, filtres et exporteurs personnalises

### Architecture

![ADOT SDK + Custom OTEL Collector Architecture](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### Comment fonctionne ADOT SDK + Custom OTEL Collector

**Etape 1 : Instrumentation de l'application**

Votre application est instrumentee avec le SDK ADOT, qui capture les metriques runtime, les journaux et les traces au format OpenTelemetry. Le SDK ADOT injecte des attributs de span specifiques a AWS (`aws.local.service`, `aws.local.operation`, `aws.remote.service`, `aws.remote.operation`, etc.) dont le processeur App Signals depend.

**Etape 2 : Calcul des metriques RED cote client**

Lorsque `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`, le SDK ADOT calcule les metriques RED sur 100 % des requetes **avant** toute decision d'echantillonnage :
- **Rate** : Nombre de requetes par fenetre temporelle
- **Errors** : Nombre de requetes avec des codes de statut d'erreur (4xx/5xx)
- **Duration** : Mesures de latence a partir des heures de debut/fin des requetes

**Etape 3 : Decision d'echantillonnage**

Le SDK ADOT applique votre strategie d'echantillonnage configuree (regles d'echantillonnage X-Ray ou echantillonnage local). Seules les traces echantillonnees sont envoyees au collecteur, mais les metriques RED sont deja calculees sur 100 % du trafic.


**Etape 4 : Pipeline de traitement du Custom OpenTelemetry Collector**

**OTLP Receivers (Ingestion des donnees)**
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

**Processeur de detection des ressources**
```yaml
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
```

**Processeur Application Signals**
```yaml
processors:
  awsapplicationsignals:
    resolvers:
      - platform: ecs
```

Ce processeur fonctionne avec les attributs de span `aws.local.*` / `aws.remote.*` que le SDK ADOT injecte. Il effectue :
1. **Resolution d'attributs** : Utilise des resolveurs specifiques a la plateforme pour enrichir la telemetrie avec le contexte de plateforme
2. **Normalisation d'attributs** : Renomme les attributs du SDK ADOT en noms de dimensions de metriques CloudWatch
3. **Controle de cardinalite** : Applique les regles `keep`/`drop`/`replace` configurees par l'utilisateur
4. **Generation de la carte applicative** : Cree les donnees de topologie avec regroupement dynamique

**Etape 5 : Traitement d'export**

Les exporteurs acheminent les donnees vers AWS EMF (metriques), OTLP HTTP (journaux) et OTLP HTTP (traces) avec authentification SigV4.

**Etape 6 : Traitement backend**
1. CloudWatch Logs : Extrait les metriques des journaux EMF, stocke les donnees de span dans `aws/spans`
2. Backend X-Ray : Indexe un pourcentage configurable de spans pour l'analyse de traces

**Etape 7 : Analyse et visualisation**
- **Application Signals** : Utilise les metriques RED calculees cote client — precises sur 100 % du trafic independamment de l'echantillonnage
- **Transaction Search** : Interroge les donnees de span depuis CloudWatch Logs
- **X-Ray Analytics** : Analyse de traces traditionnelle sur les spans indexes


### Construction d'un Custom OTEL Collector avec awsapplicationsignalsprocessor

**Prerequis** : Installez Go (version 1.21 ou ulterieure).

**Etape 1 : Installer le OpenTelemetry Collector Builder (ocb)**

Pour les derniers binaires, consultez [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases).

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**Etape 2 : Creer le fichier manifeste du builder**

Creez `builder-config.yaml` :
```yaml
dist:
  name: otelcol-appsignals
  description: OTel Collector for Application Signals
  output_path: ./otelcol-appsignals
exporters:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - gomod: go.opentelemetry.io/collector/exporter/otlphttpexporter v0.113.0
processors:
  - gomod: github.com/amazon-contributing/opentelemetry-collector-contrib/processor/awsapplicationsignalsprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/resourcedetectionprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricstransformprocessor v0.113.0
receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.113.0
extensions:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/awsproxy v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/sigv4authextension v0.113.0
replaces:
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - github.com/openshift/api v3.9.0+incompatible => github.com/openshift/api v0.0.0-20180801171038-322a19404e37
```


**Etape 3 : Exemple de configuration du collecteur**

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  awsapplicationsignals:
    resolvers:
      - platform: eks
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, awsapplicationsignals]
      exporters: [otlphttp/traces]
```

**Etape 4 : Construire l'image Docker**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## Upstream OpenTelemetry SDK + OTEL Collector

Cette approche utilise le SDK OpenTelemetry upstream standard (pas ADOT) avec un OpenTelemetry Collector. Elle offre une neutralite maximale vis-a-vis des fournisseurs et prend en charge tout langage disposant d'un SDK OpenTelemetry, y compris ceux non supportes par ADOT (Erlang, Rust, Ruby, etc.). Les metriques RED sont calculees cote serveur par le backend X-Ray a partir des donnees de traces echantillonnees.

### Avantages cles
- **Neutralite complete vis-a-vis des fournisseurs** — pas de dependance SDK specifique a AWS cote client
- **Tout langage supporte par OTEL** — fonctionne avec Erlang, Rust, Ruby, PHP et tous les autres SDK OTEL upstream
- **Environnements multi-cloud et hybrides** — le meme SDK fonctionne sur AWS, GCP, Azure et on-premises
- **Collecteur OTEL upstream standard** avec processeurs et exporteurs standards
- **Investissements OpenTelemetry existants preserves** — pas de migration vers ADOT necessaire
- **Telemetrie multi-destinations** — distribution vers n'importe quel backend simultanement

### Architecture

![Upstream OpenTelemetry SDK + OTEL Collector Architecture](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### Comment fonctionne Upstream OTEL SDK + Collector

**Etape 1 : Instrumentation de l'application**

Votre application est instrumentee avec le SDK OpenTelemetry upstream standard. Cela produit des spans OTEL standard avec les conventions semantiques (`http.method`, `http.route`, `http.status_code`, etc.).

**Etape 2 : Echantillonnage cote client**

Le SDK OTEL applique votre strategie d'echantillonnage configuree. Pour des metriques RED precises, vous avez besoin d'un echantillonnage `always_on` (100 %) car les metriques sont calculees cote serveur a partir des traces echantillonnees uniquement. Avec un echantillonnage partiel, vos metriques RED ne refleteront que le sous-ensemble echantillonne.

**Etape 3 : Pipeline de traitement du collecteur OTEL standard**

Le collecteur utilise des processeurs upstream standards :

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
```


**Etape 4 : Calcul des metriques RED cote serveur**

Puisque le SDK OTEL upstream ne calcule pas les metriques RED cote client, le frontend X-Ray les calcule cote serveur a partir des traces echantillonnees recues :
1. **Rate** : Nombre de requetes extraits des donnees de spans echantillonnes
2. **Errors** : Nombre d'erreurs identifies a partir des codes de statut des spans echantillonnes
3. **Duration** : Latence calculee a partir des heures de debut/fin des spans echantillonnes

:::warning
La precision des metriques RED depend entierement de votre taux d'echantillonnage. Avec un echantillonnage a 5 %, vous n'obtenez des metriques que sur 5 % du trafic. Pour des metriques RED precises avec cette approche, configurez un echantillonnage a 100 %.
:::

**Etape 5 : Analyse et visualisation**
- **Application Signals** : Application Maps avec signaux dores a partir des metriques RED calculees cote serveur (la precision depend du taux d'echantillonnage)
- **Transaction Search** : Interroger les donnees de span depuis CloudWatch Logs (`aws/spans`)
- **X-Ray Analytics** : Analyse de traces traditionnelle sur les spans indexes

### Differences cles avec l'approche SDK ADOT

| Aspect | ADOT SDK + Custom Collector | Upstream OTEL SDK + Collector |
|---|---|---|
| **Metriques RED** | Cote client, 100 % du trafic | Cote serveur, uniquement le trafic echantillonne |
| **Attributs de span `aws.*`** | Injectes par le SDK ADOT | Non presents |
| **Support de langages** | Java, Python, .NET, Node.js | Tout langage supporte par OTEL |
| **Build du collecteur** | Build personnalise avec App Signals Processor | Build collecteur upstream standard |
| **Echantillonnage a 100 % necessaire pour des metriques precises** | Non | Oui |

### Exemple de configuration du collecteur

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/traces]
```


## Tracing sans collecteur avec les endpoints OTLP

Cette approche offre une complexite d'infrastructure minimale et un overhead de ressources reduit en envoyant les journaux et traces directement aux endpoints OTLP de CloudWatch.

### Pourquoi choisir le tracing sans collecteur

Le tracing sans collecteur est parfait lorsque vous souhaitez l'architecture la plus simple possible avec une utilisation maximale des ressources. En envoyant les donnees directement aux endpoints AWS, vous eliminez le besoin de composants d'infrastructure supplementaires et leur overhead de gestion associe.

### Architecture

![Collector-less Architecture](/apm-src/assets/images/deep-dive/collectorless.png)

### Comment fonctionne le tracing sans collecteur

**Etape 1 : Instrumentation de l'application**

Votre application est automatiquement instrumentee avec le SDK ADOT. Il capture les journaux et traces au format OpenTelemetry sans necessiter de modifications de code.

**Etape 2 : Echantillonnage local du SDK (ParentBased/AlwaysOn a 100 % par defaut)**

Le X-Ray remote sampler necessite un proxy local (CloudWatch Agent ou [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling)) pour recuperer les regles d'echantillonnage. Il appelle `http://localhost:2000/GetSamplingRules` et `http://localhost:2000/SamplingTargets` pour recuperer les regles configurees. En mode sans collecteur, il n'y a pas de proxy local en cours d'execution, donc le SDK ADOT ne peut pas atteindre ces endpoints. En consequence, le SDK bascule silencieusement vers sa strategie d'echantillonnage par defaut : **ParentBased(AlwaysOn) a 100 %**.

:::tip Controler le taux d'echantillonnage pour gerer les couts
Puisque l'echantillonnage a distance X-Ray n'est pas disponible en mode sans collecteur, vous pouvez configurer une strategie d'echantillonnage locale en utilisant des variables d'environnement pour reduire le volume de traces et les couts :

```bash
# Utiliser un sampler TraceIdRatioBased a 5 % (ajustez le ratio selon les besoins)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# Ou utiliser parentbased_traceidratio pour respecter le contexte de trace entrant
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

Sans ces variables, le SDK utilise par defaut `parentbased_always_on` (echantillonnage a 100 %), ce qui envoie toutes les traces et peut augmenter les couts CloudWatch et X-Ray pour les applications a haut debit.
:::

**Etape 3 : Communication directe avec AWS**

Au lieu de passer par un collecteur, vos donnees vont directement aux services AWS avec authentification SigV4 :
- **Journaux** → `https://logs.<region>.amazonaws.com/v1/logs` via OTLP HTTP
- **Traces** → `https://xray.<region>.amazonaws.com/v1/traces` via OTLP HTTP

**Etape 4 : Calcul des metriques RED cote serveur**

Le frontend X-Ray analyse les traces recues pour calculer les metriques RED sur le backend AWS. Puisque le SDK utilise par defaut un echantillonnage a 100 % en mode sans collecteur, les metriques RED cote serveur sont calculees sur tout le trafic.

**Etape 5 : Options d'analyse**
- **Application Signals** : Application Maps avec regroupement dynamique et signaux dores a partir des metriques RED calculees cote serveur
- **Transaction Search** : Interroger les donnees completes de span depuis CloudWatch Logs (`aws/spans`)
- **X-Ray Analytics** : Analyse de traces traditionnelle sur les spans indexes

### Considerations importantes
- **Transaction Search est requis** — vous devez l'activer lors de l'utilisation des endpoints OTLP
- **Le SDK ADOT est requis** — le SDK OpenTelemetry standard ne fonctionnera pas pour cette approche
- **L'authentification est automatique** — le SDK ADOT gere l'authentification AWS SigV4
- **Pas d'echantillonnage a distance X-Ray** — sans proxy local, le SDK ne peut pas recuperer les regles d'echantillonnage X-Ray et utilise par defaut un echantillonnage a 100 % (ParentBased/AlwaysOn)
- **Implications de cout** — puisque toutes les traces sont envoyees (echantillonnage a 100 %), surveillez vos couts CloudWatch et X-Ray pour les services a haut debit


## X-Ray SDK existant + X-Ray Daemon (calendrier de fin de support)

:::danger Avis de fin de support du SDK et Daemon X-Ray
**La disponibilite generale des SDK et du Daemon AWS X-Ray a pris fin le 25 fevrier 2026 et ils sont maintenant en mode maintenance.**

| Phase du SDK et Daemon | Date de debut | Date de fin | Support fourni |
|---|---|---|---|
| **Disponibilite generale** | N/A | 25 fevrier 2026 | Les SDK et le Daemon X-Ray sont entierement supportes. AWS fournit des versions regulieres du SDK et du daemon incluant des corrections de bugs et de securite. |
| **Mode maintenance** | 25 fevrier 2026 | N/A | AWS limitera les versions du SDK et du Daemon X-Ray aux problemes de securite uniquement. Les SDK/Daemon ne recevront pas de nouvelles ameliorations fonctionnelles. |

Consultez [X-Ray End of Support Timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) et [X-Ray to OpenTelemetry Migration Guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) pour les details.
:::

![X-Ray Architecture](/apm-src/assets/images/deep-dive/X-ray.png)

Cette approche convient aux organisations avec des investissements X-Ray existants qui souhaitent adopter progressivement les capacites d'Application Signals tout en planifiant leur migration vers OpenTelemetry.

### Comment commencer

1. **Activez Transaction Search** pour vos donnees X-Ray existantes
2. **Configurez un echantillonnage a 100 %** ou utilisez l'echantillonnage adaptatif pour une detection d'anomalies economique
3. **Planifiez votre migration** — commencez a migrer progressivement les services vers l'instrumentation ADOT

## Resume du calcul des metriques RED

Comprendre comment les metriques RED (Rate, Errors, Duration) sont calculees a travers les differentes configurations d'instrumentation est crucial pour choisir la bonne approche :

| Configuration d'instrumentation | Methode de calcul | Variable d'environnement | Prerequis |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | Cote client | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | Aucun - fonctionne avec tout echantillonnage |
| **ADOT SDK + Custom OTEL Collector** | Cote client | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | Collecteur personnalise avec App Signals Processor |
| **Upstream OTEL SDK + OTEL Collector** | Cote serveur | N/A (pas de SDK ADOT) | Transaction Search + echantillonnage a 100 % pour la precision |
| **Sans collecteur (ADOT SDK)** | Cote serveur | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false` (par defaut) | Transaction Search. Echantillonnage par defaut a 100 % (echantillonnage a distance X-Ray non disponible sans proxy local) |
| **X-Ray SDK + X-Ray Daemon** | Cote serveur (extrapole) | N/A | Base sur les donnees echantillonnees |

### Metriques RED cote client (SDK ADOT — CW Agent et Custom Collector)

```
Application → ADOT SDK → Calculate Metrics → CW Agent or Custom Collector → AWS
                ↓
            (100% of requests)
```

- **Le calcul se fait dans l'application** avant toute decision d'echantillonnage
- **Toujours precis** independamment de la configuration d'echantillonnage des traces
- **Comportement par defaut** lorsque `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`
- **Pas de dependance a Transaction Search** pour le calcul des metriques

### Metriques RED cote serveur (Upstream OTEL SDK, sans collecteur, X-Ray)

```
Application → Upstream OTEL SDK/Collector → AWS Backend → Calculate Metrics
                ↓
        (Requires 100% sampling for accuracy)
```

- **Le calcul se fait sur le backend AWS** (frontend X-Ray) a partir des donnees de span recues
- **Les configurations basees sur OTLP necessitent que Transaction Search** soit active
- **Necessite un echantillonnage a 100 %** pour des metriques precises (sauf X-Ray qui extrapole)
