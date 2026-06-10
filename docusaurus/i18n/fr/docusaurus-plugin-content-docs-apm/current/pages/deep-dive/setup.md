# Configuration d'Application Signals + Transaction Search

## Processus de configuration de haut niveau

![Setup Overview](/apm-src/assets/images/deep-dive/overview.png)

## Prerequis et permissions

Avant d'activer CloudWatch Application Signals, assurez-vous de disposer des permissions IAM necessaires et de l'infrastructure en place. Consultez [Application Signals Permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) pour les exigences detaillees.

## Systemes pris en charge

Application Signals est pris en charge et teste sur Amazon EKS, Kubernetes natif, Amazon ECS et Amazon EC2.

| Langage | Version du runtime |
|---|---|
| **Java** | JVM versions 8, 11, 17, 21, et 23 |
| **Python** | Python versions 3.9 et superieures |
| **.NET** | Release 1.6.0 et inferieure : .NET 6, 8, et .NET Framework 4.6.2 et superieur. Release 1.7.0 et superieure : .NET 8, 9, et .NET Framework 4.6.2 et superieur |
| **Node.js** | Node.js versions 14, 16, 18, 20, et 22 |
| **PHP** | PHP versions 8.0 et superieures |
| **Ruby** | CRuby >= 3.1, JRuby >= 9.3.2.0, ou TruffleRuby >= 22.1 |
| **GoLang** | Golang versions 1.18 et superieures |

Pour la matrice de support complete, consultez [Application Signals Supported Systems](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html).

## Etape 1 : Activer Application Signals dans votre compte

Consultez la documentation [Enable Application Signals in your account](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html).

## Etape 2 : Activer Transaction Search

Consultez la documentation [Enable transaction search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html).

## Etape 3 : Choisir votre strategie d'instrumentation

En fonction de vos exigences, selectionnez l'une des approches d'instrumentation. Application Signals prend en charge plusieurs combinaisons de SDK et de collecteurs :

### SDK disponibles

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Distribution AWS d'OpenTelemetry avec support d'Application Signals. Disponible pour Java, Python, .NET et Node.js.
- **[Upstream OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — SDK OpenTelemetry standard neutre vis-a-vis des fournisseurs. Fonctionne avec tout langage supporte par OTEL (Erlang, Rust, Ruby, Go, PHP, etc.).
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — SDK de tracing AWS historique. ⚠️ [Mode maintenance](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### Collecteurs / Agents disponibles

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — Agent AWS gere avec support integre d'Application Signals, integration Container Insights et collecte de journaux.
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — Collecteur standard upstream ou personnalise. Prend en charge le fan-out de telemetrie multi-destinations.
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — Relais de traces historique pour le SDK X-Ray. ⚠️ [Mode maintenance](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### Matrice de decision

| Approche | Ideal pour | Avantages cles |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | Environnements AWS natifs, integration profonde des services | Integration AWS etroite, correlation Container Insights, experience geree |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | Telemetrie multi-destinations avec support complet d'Application Signals | Metriques RED cote client, processeur App Signals, flexibilite multi-destinations |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | Strategie neutre vis-a-vis des fournisseurs, langages non-ADOT, multi-cloud | Neutralite complete, tout langage supporte par OTEL, pas de dependance SDK AWS |
| [**Direct OTLP Endpoint (Tracing sans collecteur)**](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) | Applications economes en ressources, infrastructure minimale | Overhead minimal, architecture simplifiee, infrastructure reduite |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | Utilisateurs X-Ray existants, migration progressive | Protection de l'investissement existant, changements minimaux requis. ⚠️ Mode maintenance |

### Comparaison des fonctionnalites

| Fonctionnalite | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | Tracing sans collecteur avec ADOT SDK | X-Ray SDKs |
|---|---|---|---|---|---|
| **Support AWS** | ✅ Oui | ⚠️ Uniquement pour les donnees envoyees a AWS | ⚠️ Uniquement pour les donnees envoyees a AWS | ✅ Oui | ✅ Oui (⚠️ Mode maintenance) |
| **Support de langages non standard** | ❌ Non | ❌ Non | ✅ Oui | ❌ Non | ❌ Non |
| **Integration Container Insights** | ✅ Oui | ❌ Non | ❌ Non | ❌ Non | ❌ Non |
| **Journalisation prete a l'emploi avec CloudWatch Logs** | ✅ Oui | ❌ Non | ❌ Non | ✅ Oui | ❌ Non |
| **Metriques runtime prete a l'emploi** | ✅ Oui | ✅ Oui | ✅ Oui | ❌ Non | ❌ Non |
| **Obtient toujours les metriques RED sur 100 % du trafic** | ✅ Oui (cote client) | ✅ Oui (cote client) | ⚠️ Uniquement avec echantillonnage a 100 % (cote serveur) | ⚠️ Uniquement avec echantillonnage a 100 % (cote serveur) | ⚠️ Uniquement avec echantillonnage a 100 % (cote serveur) |
| **Telemetrie multi-destinations** | ❌ Non | ✅ Oui | ✅ Oui | ❌ Non | ❌ Non |

Pour l'implementation detaillee de chaque approche, consultez [Instrumentation Setups](../instrumentation-setups).

## Etape 4 : Comprendre l'echantillonnage et l'indexation des traces

Application Signals separe l'**echantillonnage des requetes** de l'**indexation des traces** :
- **Echantillonnage des requetes** : Determine quel pourcentage de requetes est echantillonne et envoye a AWS
- **Indexation selective des traces** : Pourcentage de spans stockes dans CloudWatch Logs qui sont envoyes au backend X-Ray pour les resumes de traces X-Ray. Les resumes de traces sont utiles pour deboguer les transactions et sont precieux pour les processus asynchrones. Vous n'avez besoin d'indexer qu'une petite fraction de spans comme resumes de traces.

### Echantillonnage des requetes

#### 1. Echantillonnage centralise X-Ray (par defaut et recommande)

Lorsque vous activez Application Signals avec le SDK ADOT et un CloudWatch Agent (ou OpenTelemetry Collector), **l'echantillonnage centralise X-Ray est active par defaut** avec ces parametres :

| Parametre | Valeur par defaut | Description |
|---|---|---|
| **Reservoir** | 1 requete/seconde | Nombre fixe de requetes echantillonnees par seconde |
| **Fixed Rate** | 5% | Pourcentage de requetes supplementaires au-dela du reservoir |

Les variables d'environnement pour le SDK AWS Distro for OpenTelemetry (ADOT) sont definies comme suit :

| Variable d'environnement | Valeur | Description |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | Utilise le service d'echantillonnage X-Ray |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | Endpoint du CloudWatch Agent |

Vous pouvez modifier ces valeurs par defaut a tout moment via la console X-Ray sans redeployer votre application. Par exemple, pour augmenter l'echantillonnage a 10 %, mettez a jour le taux fixe de la regle d'echantillonnage. Consultez [Configuring sampling rules](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html) pour la liste complete des options de regles, exemples et comment creer des regles specifiques aux services.

:::info Quand le X-Ray Remote Sampler s'applique-t-il ?
Le sampler `xray` fonctionne en appelant `http://localhost:2000/GetSamplingRules` et `http://localhost:2000/SamplingTargets` via un proxy local. Cela signifie que l'echantillonnage a distance X-Ray **ne fonctionne que lorsqu'un proxy local est en cours d'execution** :

- **CloudWatch Agent** — expose le proxy d'echantillonnage sur le port 2000 par defaut
- **OpenTelemetry Collector** — avec l'[extension AWS Proxy](https://aws-otel.github.io/docs/getting-started/remote-sampling) configuree

Si aucun proxy local n'est disponible (par exemple, en [mode sans collecteur](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints)), le SDK ADOT ne peut pas atteindre les endpoints d'echantillonnage et bascule silencieusement vers **ParentBased(AlwaysOn) a 100 %**.
:::

#### 2. Configuration du X-Ray Remote Sampler par runtime

Chaque runtime de SDK ADOT necessite une configuration specifique pour utiliser les regles d'echantillonnage a distance X-Ray. Consultez le guide pour votre langage :

| Runtime | Guide de configuration |
|---|---|
| **Java** | [Using X-Ray Remote Sampling with ADOT Java](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [Using X-Ray Remote Sampling with ADOT Python](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [Using X-Ray Remote Sampling with ADOT JavaScript](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [Using X-Ray Remote Sampling with ADOT .NET](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [Configuring Sampling with ADOT Go](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

Pour tous les runtimes, les variables d'environnement cles sont :

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

Ajustez l'endpoint pour correspondre a l'adresse de votre CloudWatch Agent ou proxy collecteur (par exemple, `http://cloudwatch-agent.amazon-cloudwatch:2000` sur EKS).

#### 3. Echantillonnage local

Si vous n'avez pas de proxy local disponible, ou si vous preferez un controle local sans dependre du service X-Ray, vous pouvez configurer l'echantillonnage directement dans le SDK ADOT en utilisant des variables d'environnement :

| Variable d'environnement | Valeur | Description |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | Echantillonnage local base sur un ratio |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | Taux d'echantillonnage de 10 % (ajuster selon les besoins) |

Ceci est particulierement utile en [mode sans collecteur](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) ou l'echantillonnage a distance X-Ray n'est pas disponible. Sans ces variables, le SDK utilise par defaut `parentbased_always_on` (echantillonnage a 100 %).

Pour plus d'options de sampler, consultez la documentation [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler).

#### 4. Echantillonnage adaptatif X-Ray (approche optimisee pour les couts)

:::tip Prerequis
- ADOT Java SDK (v2.11.5 ou superieur)
- Doit fonctionner avec CloudWatch Agent ou OpenTelemetry Collector
- Compatible avec Amazon EC2, ECS, EKS et Kubernetes auto-heberge

Pour les instructions de configuration detaillees, consultez la documentation [X-Ray Adaptive Sampling](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html).
:::

Si vous n'avez pas besoin d'un echantillonnage a 100 % mais souhaitez une meilleure couverture des anomalies, envisagez l'echantillonnage adaptatif X-Ray qui augmente automatiquement l'echantillonnage lors des pics d'erreurs et des valeurs aberrantes de latence tout en maintenant des taux de base economiques :

Avantages cles :
- **Detection automatique des anomalies** : Augmente l'echantillonnage lors des erreurs HTTP 5xx ou de latence elevee
- **Controle des couts** : Maintient un echantillonnage de base faible (par exemple, 5 %) pendant les operations normales
- **Limites de boost configurables** : Definissez les taux d'echantillonnage maximum et les periodes de refroidissement
- **Capture des traces critiques** : Assure que les spans d'anomalie sont captures meme lorsque les traces completes ne sont pas echantillonnees
- **Controle centralise** : Configurez via les regles d'echantillonnage X-Ray sans modifications du code applicatif

Exemple de configuration :
```json
{
  "RuleName": "AdaptiveProductionRule",
  "Priority": 1,
  "ReservoirSize": 1,
  "FixedRate": 0.05,
  "ServiceName": "*",
  "ServiceType": "*",
  "Host": "*",
  "HTTPMethod": "*",
  "URLPath": "*",
  "SamplingRateBoost": {
    "MaxRate": 0.25,
    "CooldownWindowMinutes": 10
  }
}
```

### Indexation des traces

**1. Taux d'indexation par defaut :**
- L'indexation a 1 % est incluse sans frais supplementaires
- Au-dessus de 1 % d'indexation, des frais X-Ray s'appliquent
- Consultez la documentation [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) pour les tarifs actuels

**2. Taux d'indexation personnalises :**
```bash
# Indexation plus elevee pour les applications necessitant plus d'analyses X-Ray (frais applicables)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% indexation - frais X-Ray applicables

# Indexation plus basse pour l'optimisation des couts (toujours dans le forfait gratuit)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% indexation - pas de frais supplementaires
```
