# Observability GenAI sur AWS

## Vue d'ensemble

Les charges de travail d'IA générative diffèrent des applications traditionnelles de manière à rendre l'observability essentielle dès le premier jour. Les réponses sont non déterministes, la latence varie considérablement avec la complexité du prompt, les coûts sont directement liés à l'utilisation des tokens, et une seule invocation d'agent peut enchaîner des dizaines d'appels API vers Bedrock, S3, Lambda et KMS en quelques secondes.

Sans une observability appropriée, les équipes font face à des problèmes prévisibles :

- **Dépassements de coûts** — l'utilisation non suivie des tokens entraîne des factures inattendues. Une seule boucle d'agent incontrôlée peut consommer des centaines de dollars en quelques minutes.
- **Dégradation des performances** — les réponses lentes impactent l'expérience utilisateur, et vous ne pouvez pas corriger ce que vous ne pouvez pas voir. Les flux de travail d'agent peuvent échouer silencieusement au niveau de la couche d'orchestration tandis que les appels de modèle réussissent.
- **Lacunes de qualité** — les erreurs, hallucinations et sorties inattendues passent inaperçues jusqu'à ce que les utilisateurs se plaignent.
- **Risque de conformité et d'audit** — aucun enregistrement de ce que le modèle a dit, quels paramètres il a utilisés, ou quel rôle IAM a posé la question.

Ce guide vous accompagne à travers la stratégie, l'implémentation AWS, les modèles d'activation et la conception de tableaux de bord pour la surveillance des charges de travail GenAI sur AWS. Il s'accompagne du guide complémentaire [Création de tableaux de bord personnalisés pour la télémétrie GenAI](../custom-dashboards-for-genai-telemetry), qui montre comment transformer la même télémétrie en tableaux de bord basés sur les personas pour les équipes DevOps, FinOps et autres parties prenantes.

---

## Pourquoi l'Observability GenAI est différente

### Défis uniques

**Comportement non déterministe** — la même entrée peut produire des sorties différentes. Les tests traditionnels « a-t-il retourné la bonne valeur » ne s'appliquent pas. Vous avez besoin de métriques de qualité, pas seulement de succès/échec.

**Latence variable** — les temps de réponse dépendent de la complexité du prompt, de la longueur de la sortie, de la charge du modèle et du routage inter-régions. P50 et P95 divergent beaucoup plus que dans les API traditionnelles.

**Tarification basée sur les tokens** — les coûts évoluent avec les modèles d'utilisation, pas seulement le nombre de requêtes. Une petite augmentation de la longueur moyenne du prompt peut doubler votre facture mensuelle.

**Complexité multi-services** — les agents enchaînent les appels API à travers plusieurs services AWS. Aucune source de logs unique ne raconte l'histoire complète.

**Itération rapide** — les modèles et prompts changent fréquemment. Votre observability doit suivre les versions de modèles, les modèles de prompts et les changements de configuration au fil du temps.

### Impact commercial

Les organisations qui traitent l'observability comme une réflexion après coup découvrent généralement ces schémas après coup :

- Un seul prompt non optimisé consommant 80 % du budget mensuel Bedrock
- Des flux de travail d'agent échouant au niveau de la couche d'outils tandis que les métriques du modèle semblent saines
- Des données personnelles fuyant dans les logs parce que la rédaction n'a pas été configurée dès le départ
- L'attribution des coûts impossible parce qu'aucune balise d'équipe n'a été appliquée

Bien configurer l'observability tôt évite des réaménagements coûteux plus tard.

---

## Piliers fondamentaux pour la GenAI

### Métriques

Télémétrie opérationnelle qui répond à « comment mon IA performe-t-elle ? »

**Métriques essentielles à suivre :**

- **Utilisation des tokens** — tokens d'entrée par requête, tokens de sortie par requête, total de tokens par modèle et utilisateur, calculs de coût des tokens
- **Latence** — temps jusqu'au premier token (TTFT), temps de réponse total, percentiles P50/P95/P99, latence par modèle et région
- **Volume de requêtes** — requêtes par seconde/minute/heure, taux de succès vs erreur, requêtes concurrentes
- **Coût** — coût par requête, coût par modèle/utilisateur/équipe, tendances quotidiennes/mensuelles, efficacité des coûts (tokens de sortie par dollar)

### Logs

Contenu et contexte qui répondent à « qu'a dit mon IA, et à qui ? »

**Quoi journaliser :**

- Paires requête/réponse (avec rédaction des données personnelles)
- Modèles de prompts et variables
- Paramètres du modèle (temperature, max_tokens, top_p)
- Messages d'erreur et traces de pile
- Contexte utilisateur et identifiants de session
- Variantes de tests A/B

**Niveaux de log :**

- `DEBUG` — itérations détaillées d'ingénierie de prompts
- `INFO` — requêtes réussies avec métadonnées
- `WARN` — tentatives, replis, limites de débit
- `ERROR` — échecs, délais d'expiration, réponses invalides

### Traces

Flux distribué qui répond à « comment la requête a-t-elle traversé mon système ? »

**Quoi capturer :**

- Flux de requête de bout en bout
- Étapes de prétraitement du prompt
- Spans d'invocation du modèle
- Spans d'appels d'outils et de fonctions
- Post-traitement et validation
- Intégration avec les services en aval
- Flux de travail d'agent multi-sauts

---

## Meilleures pratiques stratégiques

1. **Instrumenter tôt** — ajoutez l'observability quand vous construisez, pas après la mise en production. Utilisez OpenTelemetry pour que votre instrumentation soit neutre vis-à-vis du fournisseur et portable.
2. **Balisage multi-dimensionnel** — balisez chaque métrique avec les dimensions `model`, `environment`, `application`, `team` et `region` pour pouvoir découper les coûts et performances ultérieurement.
3. **Établir des lignes de base avant les alarmes** — exécutez en production pendant au moins une semaine pour établir le comportement normal avant de définir les seuils d'alarme. Les alarmes sans lignes de base créent de la fatigue d'alerte.
4. **Surveiller les métriques métier, pas seulement techniques** — suivez la qualité de sortie, la satisfaction utilisateur (pouces vers le haut/bas) et le coût par fonctionnalité en plus de la latence et des taux d'erreur.
5. **Planifier les données personnelles dès le premier jour** — rédigez les données sensibles dans les logs avant qu'elles n'arrivent. Utilisez les [politiques de protection des données CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html) pour le masquage automatisé.
6. **Définir des politiques de rétention** — le volume de logs croît rapidement. Différenciez la rétention par objectif :
   - Logs opérationnels : 7 jours
   - Invocations de modèles : 30-90 jours
   - Audit/conformité : selon l'exigence réglementaire (souvent 7 ans)
7. **Suivre la version du modèle et le modèle de prompt** — quand quelque chose change, vous devez pouvoir corréler avec ce qui était en production à ce moment-là.

---

## Les deux pipelines de données sur AWS

Amazon CloudWatch fournit une observability de bout en bout pour la GenAI à travers deux pipelines de données complémentaires. Ils servent des objectifs différents, capturent des données différentes et sont activés différemment. La plupart des configurations de production nécessitent les deux.

![Pipelines de télémétrie GenAI](../../../images/GenAI/genai-telemetry-pipelines.png)

### Pipeline 1 : Journalisation des invocations de modèles Bedrock

Une fonctionnalité de journalisation au niveau Bedrock qui capture la requête et la réponse brutes pour chaque invocation de modèle. C'est **spécifique à Bedrock** — elle ne couvre que les appels effectués aux modèles de fondation Amazon Bedrock. Si vous utilisez des modèles non-Bedrock (auto-hébergés sur SageMaker, fournisseurs externes), ce pipeline ne s'applique pas.

**Ce qu'il capture :**

| Champ | Pourquoi c'est important |
| --- | --- |
| Payload complet de la requête | Voir exactement ce qui a été envoyé au modèle, y compris le prompt système et l'historique des messages |
| Payload complet de la réponse | Voir exactement ce que le modèle a retourné, mot pour mot |
| Paramètres d'inférence (`temperature`, `max_tokens`, `top_p`) | Déboguer un comportement inattendu du modèle — a-t-il été appelé avec temp 0.7 ou 0.0 ? |
| Identité IAM de l'appelant (ARN du rôle) | Audit de sécurité, attribution des coûts par équipe/rôle |
| Type d'opération Bedrock | `InvokeModel`, `Converse`, `ConverseStream` |
| Version du modèle | ID exact du modèle incluant le suffixe (par ex., `cohere.command-r-plus-v1:0`) |
| Comptages de tokens | Comptages de tokens d'entrée et de sortie liés directement au contenu |

**Ce qu'il ne capture PAS :**

- Flux d'orchestration d'agent (quels outils ont été appelés, comportement de la boucle d'agent)
- Latence côté client
- Corrélation de traces distribuées (pas de traceId/spanId — uniquement requestId)
- Détails des appels d'outils
- Contexte d'infrastructure
- Appels de modèles non-Bedrock

**Exemple d'entrée de log :**

```json
{
  "timestamp": "2026-04-17T14:21:50Z",
  "accountId": "123456789012",
  "region": "us-east-1",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "operation": "InvokeModel",
  "modelId": "cohere.command-r-plus-v1:0",
  "input": {
    "inputBodyJson": {
      "message": "Write a short joke about software engineers.",
      "max_tokens": 256,
      "temperature": 0.7
    },
    "inputTokenCount": 8
  },
  "output": {
    "outputBodyJson": {
      "text": "Why did the engineer break up? Because they couldn't commit.",
      "finish_reason": "COMPLETE"
    },
    "outputTokenCount": 20
  },
  "identity": {
    "arn": "arn:aws:sts::123456789012:assumed-role/my-bedrock-role/my-session"
  },
  "schemaType": "ModelInvocationLog"
}
```

**Comment activer :**

Activation manuelle via la console Amazon Bedrock (ou l'API). C'est la même étape que le modèle soit invoqué par un agent, un appel API direct, un SDK ou autre chose. Elle s'applique à l'ensemble du compte pour toutes les invocations de modèle Bedrock une fois activée.

1. Ouvrez la [console Amazon Bedrock](https://console.aws.amazon.com/bedrock/)
2. Choisissez **Settings**
3. Sous **Model invocation logging**, sélectionnez **Model invocation logging**
4. Choisissez les types de données requis à inclure dans les logs. Choisissez d'envoyer les logs uniquement à CloudWatch Logs, ou à la fois à Amazon S3 et CloudWatch Logs.
5. Sous les configurations CloudWatch Logs, créez un nom de groupe de logs et sélectionnez les rôles de service appropriés
6. Choisissez **Save settings**

Pour plus d'informations, consultez [Model Invocations](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html) et [Set up a CloudWatch Logs destination](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination).

**Tableaux de bord préconfigurés :**

Après avoir activé la journalisation des invocations de modèles, CloudWatch fournit automatiquement des tableaux de bord montrant :

- **Nombre d'invocations** — Nombre de requêtes réussies vers les API Converse, ConverseStream, InvokeModel et InvokeModelWithResponseStream
- **Latence d'invocation** — Latence des invocations
- **Comptage de tokens par modèle** — Comptages de tokens d'entrée et de sortie par modèle
- **Comptage quotidien de tokens par ModelID** — Total quotidien des comptages de tokens par ID de modèle
- **Requêtes regroupées par tokens d'entrée** — Nombre de requêtes regroupées par plages de tokens
- **Limitations d'invocation** — Nombre d'invocations limitées
- **Nombre d'erreurs d'invocation** — Comptage des invocations ayant abouti à des erreurs

### Pipeline 2 : Télémétrie d'agent (via ADOT SDK)

Traces, spans et logs basés sur OpenTelemetry capturés par le SDK [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction). Contrairement à la journalisation des invocations de modèles, la télémétrie d'agent fonctionne avec n'importe quel fournisseur de modèles (Bedrock, SageMaker, externe), pas seulement Bedrock.

**Ce qu'elle capture :**

- **Flux d'orchestration d'agent** — quels outils ont été appelés, dans quel ordre, itérations de la boucle d'agent
- **Métadonnées d'appels de modèle** — ID du modèle, comptages de tokens (entrée/sortie), latence, codes de statut, raisons de fin
- **Détails d'exécution des outils** — nom de l'outil, durée, succès/échec pour chaque appel d'outil
- **Corrélation de traces distribuées** — traceId, spanId, parentSpanId pour le traçage complet des requêtes de bout en bout
- **Suivi de session** — session.id lie plusieurs invocations à une seule session utilisateur
- **Contexte de plateforme et d'environnement** — cloud.platform, deployment.environment, métadonnées de service

**Ce qu'elle ne capture PAS :**

- Paramètres d'inférence (temperature, max_tokens, top_p)
- Identité IAM de l'appelant
- Contenu complet du prompt/réponse par défaut (dépend du framework — Strands, LangChain, CrewAI etc. sont supportés ; d'autres varient)

**Exemple de span d'appel de modèle** (`aws/spans`) :

```json
{
  "resource": {
    "attributes": {
      "deployment.environment.name": "bedrock-agentcore:default",
      "service.name": "MyAgent.DEFAULT",
      "cloud.platform": "aws_bedrock_agentcore",
      "telemetry.sdk.version": "1.40.0"
    }
  },
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "1a2b3c4d5e6f7a8b",
  "parentSpanId": "9c8d7e6f5a4b3c2d",
  "name": "chat us.anthropic.claude-sonnet-4-6",
  "durationNano": 2644916837,
  "attributes": {
    "gen_ai.request.model": "us.anthropic.claude-sonnet-4-6",
    "gen_ai.usage.input_tokens": 1980,
    "gen_ai.usage.output_tokens": 119,
    "gen_ai.response.finish_reasons": ["tool_use"],
    "http.response.status_code": 200,
    "session.id": "session-a1b2c3d4-e5f6-7890"
  }
}
```

**Exemple de span d'exécution d'outil** (`aws/spans`) :

```json
{
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "2b3c4d5e6f7a8b9c",
  "parentSpanId": "d4e5f6a7b8c9d0e1",
  "name": "execute_tool http_request",
  "durationNano": 37505594,
  "attributes": {
    "gen_ai.tool.name": "http_request",
    "gen_ai.tool.status": "success",
    "gen_ai.system": "strands-agents"
  }
}
```

**Où les données arrivent :**

| Groupe de logs | Ce qu'il contient |
| --- | --- |
| `aws/spans` | Spans de trace OTel — appels de modèle, exécutions d'outils, itérations de boucle d'agent |
| `/aws/bedrock-agentcore/runtimes/<agent>` (runtime-logs) | stdout/stderr de l'application — logs de démarrage, erreurs, journalisation applicative personnalisée |
| `/aws/bedrock-agentcore/runtimes/<agent>` (otel-rt-logs) | Enregistrements de log OTel du framework d'agent (contenu prompt/réponse pour les frameworks supportés) |

**Ce que cela alimente dans CloudWatch :**

- **Tableaux de bord Application Signals** — percentiles de latence, taux d'erreur, débit
- **Application Maps** — visualiser les chaînes agent → modèle → appel d'outil
- **Traçage distribué** — traçage des requêtes de bout en bout à travers les services
- **Surveillance SLO**
- **Analyse des traces** — explorer les requêtes individuelles de bout en bout
- **Corrélation avec les métriques d'infrastructure**

**Comment activer :**

| Modèle de déploiement | Ce que vous faites |
| --- | --- |
| Bedrock AgentCore | Rien — le SDK ADOT est intégré au runtime. La télémétrie circule automatiquement. |
| Non-AgentCore (EKS/ECS/auto-hébergé) | Attachez l'agent d'auto-instrumentation ADOT. Aucun changement de code nécessaire. |

---

## Comparaison côte à côte

| Ce que vous voulez savoir | Journalisation des invocations de modèles (Bedrock uniquement) | Télémétrie d'agent (ADOT) |
| --- | --- | --- |
| Quel modèle a été appelé ? | ✅ | ✅ |
| Latence / durée ? | ❌ | ✅ (côté client) |
| Comptage de tokens ? | ✅ | ✅ |
| Taux d'erreur / statut ? | ✅ | ✅ |
| Flux d'orchestration d'agent ? | ❌ | ✅ |
| Détails des appels d'outils ? | ❌ | ✅ |
| Texte complet du prompt ? | ✅ | Dépend du framework |
| Réponse complète du modèle ? | ✅ | Dépend du framework |
| Paramètres d'inférence ? | ✅ | ❌ |
| Identité IAM de l'appelant ? | ✅ | ❌ |
| Corrélation de traces distribuées ? | ❌ | ✅ |
| Fonctionne pour les appels Bedrock sans agent ? | ✅ | ❌ |
| Fonctionne pour les modèles non-Bedrock ? | ❌ (Bedrock uniquement) | ✅ |
| Application Signals / Application Maps ? | ❌ | ✅ |

La capture du contenu prompt/réponse dans le Pipeline 2 dépend de l'instrumentation OTel du framework d'agent. Strands, LangChain et CrewAI sont supportés ; d'autres frameworks peuvent varier.

**En résumé :** La télémétrie d'agent vous dit *comment votre agent performe*. La journalisation des invocations de modèles vous dit *ce que votre modèle dit et qui demande*. Pour une observability complète, activez les deux.

---

## Activation de l'Observability pour les charges de travail agentiques

Avant de commencer, activez [CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) pour débloquer l'expérience complète d'observability GenAI.

### Agents hébergés sur AgentCore Runtime

AgentCore Runtime est un runtime serverless sécurisé conçu spécifiquement pour le déploiement et la mise à l'échelle d'agents et d'outils IA dynamiques. Il supporte tout framework open-source incluant LangGraph, CrewAI, Strands Agents, tout protocole et tout modèle.

L'observability est intégrée — le SDK ADOT est incorporé dans le runtime AgentCore. Les métriques sont automatiquement générées et les traces circulent sans aucun changement de code.

- [Configurer l'observability personnalisée](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [Tutoriel étape par étape : Activation de l'observability pour les agents hébergés sur AgentCore Runtime](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-agentcore-runtime-hosted-agents)

### Agents non hébergés sur AgentCore (EKS, ECS, auto-hébergés)

Vous pouvez héberger vos agents en dehors d'AgentCore et apporter vos données d'observability dans CloudWatch pour une surveillance de bout en bout en un seul endroit. Attachez l'agent d'auto-instrumentation ADOT à votre charge de travail — aucun changement de code nécessaire.

- [Configurer l'observability tierce](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [Tutoriel étape par étape : Activation de l'observability pour les agents non hébergés sur AgentCore](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-non-agentcore-hosted-agents)

### Ressources AgentCore memory, gateway et outils intégrés

Obtenez une visibilité sur les métriques et les traces des services modulaires AgentCore. Consultez [Configurer l'observability CloudWatch](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-cloudwatch).

### Évaluations AgentCore

Les évaluations AgentCore fournissent des capacités pour surveiller et évaluer les performances, la qualité et la fiabilité de vos agents IA. Consultez [Évaluations AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html).

### Résumé de l'activation

| Composant | AgentCore | Non-AgentCore (EKS/ECS) |
| --- | --- | --- |
| Métriques | Automatique | Agent d'auto-instrumentation ADOT |
| Traces et spans d'agent | Automatique (ADOT intégré) | Agent d'auto-instrumentation ADOT |
| Journalisation des invocations de modèles | Activation manuelle via la console Bedrock | Activation manuelle via la console Bedrock |

La seule chose qui nécessite véritablement une activation manuelle dans les deux parcours est la journalisation des invocations de modèles. Tout le reste est soit automatique, soit géré en attachant l'agent d'auto-instrumentation ADOT.

---

## Protection des données sensibles

Lors de la journalisation des invocations de modèles, les prompts et réponses peuvent contenir des données personnelles ou des informations sensibles. Amazon CloudWatch Logs fournit des politiques de protection des données pour identifier et masquer les données sensibles à l'aide de l'apprentissage automatique et de la reconnaissance de motifs.

Vous pouvez configurer la protection des données à deux niveaux :

### Protection des données au niveau du compte

1. Ouvrez la console Amazon CloudWatch
2. Dans le volet de navigation, choisissez **Settings**
3. Choisissez l'onglet **Logs**
4. Choisissez **Configure the Data protection account policy**
5. Spécifiez les identifiants de données pertinents pour vos données (gérés ou personnalisés)
6. (Optionnel) Choisissez une destination pour les résultats d'audit (CloudWatch Logs, Firehose ou S3)
7. Choisissez **Activate data protection**

### Protection des données au niveau du groupe de logs

1. Ouvrez la console Amazon CloudWatch
2. Dans le volet de navigation, choisissez **Logs**, **Log Management**
3. Choisissez l'onglet **Log groups**, sélectionnez le groupe de logs (par ex., `aws/bedrock/modelinvocations`), et choisissez **Create data protection policy**
4. Spécifiez les identifiants de données pertinents pour vos données
5. (Optionnel) Choisissez une destination pour les résultats d'audit
6. Choisissez **Activate data protection**

Pour plus d'informations, consultez [Protéger les données de logs sensibles avec le masquage](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html) et [Protéger les données sensibles](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html).

---

## Quand activer quoi

| Scénario | Journalisation des invocations de modèles | Télémétrie d'agent (ADOT) |
| --- | --- | --- |
| Utilisation de Bedrock sans agents (API directe) | ✅ Seule option | ❌ Non applicable |
| Piste d'audit de conformité de toutes les interactions LLM | ✅ Requis | Bon à avoir |
| Débogage de la qualité des prompts ou sorties inattendues du modèle | ✅ Requis (paramètres d'inférence + contenu) | Utile pour le contexte |
| Attribution des coûts par équipe/rôle | ✅ Requis (identité IAM) | ❌ Ne peut pas le faire |
| Construction de pipelines d'évaluation/affinage | ✅ Requis (contenu structuré) | Dépend du framework |
| Exécution d'agents, veut des tableaux de bord opérationnels | Bon à avoir | ✅ Requis |
| Surveillance de la latence/erreurs uniquement | Non nécessaire | ✅ Suffisant |

---

## Construction de tableaux de bord

Une fois que les deux pipelines sont en flux, vous pouvez construire des tableaux de bord pour différents publics. Pour des requêtes prêtes à l'emploi, consultez le guide [Création de tableaux de bord personnalisés pour la télémétrie GenAI](../custom-dashboards-for-genai-telemetry).

### Niveaux de tableaux de bord par audience

**Tableau de bord exécutif** — KPI de haut niveau :

- Coût quotidien total
- Tendances du volume de requêtes
- Taux d'erreur
- Principaux modèles par utilisation

**Tableau de bord DevOps** — surveillance en temps réel :

- Répartition des raisons d'arrêt (end_turn vs tool_use vs max_tokens)
- Tendance du taux de complétion vs troncation
- Traces d'agent vs erreurs (horaire)
- Exploration détaillée des erreurs de span
- Répartition des performances par composant (P50/P95/P99)
- Latence d'inférence inter-régions

**Tableau de bord FinOps** — gestion des coûts :

- Dépense totale (horaire, quotidienne, mensuelle)
- Distribution des coûts par modèle
- Top 10 des dépenseurs par rôle/utilisateur
- Répartition des coûts entrée vs sortie
- Opportunités de mise en cache des prompts
- Tendance quotidienne des coûts avec détection d'anomalies

**Tableau de bord développeur** — débogage et optimisation :

- Traces de requêtes
- Utilisation des tokens par fonctionnalité
- Décomposition de la latence
- Détails des erreurs avec traces de pile
- Efficacité des tokens (détection de gaspillage : entrée élevée, sortie faible)

### Exemple de requête DevOps : Taux de complétion

Suit le ratio horaire de complétions réussies vs réponses tronquées. Cible : 95 %+ de taux de complétion.

```text
fields @timestamp, modelId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
| stats sum(stop_reason = "end_turn" or stop_reason = "tool_use") as ok,
        sum(stop_reason = "max_tokens") as truncated
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

### Exemple de requête FinOps : Principaux dépenseurs par rôle

```text
SOURCE "bedrock-model-invocation-logging"
| filter @logStream = 'aws/bedrock/modelinvocations'
| fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| stats sum(totalCostUSD) as spend, count(*) as invocations
  by userRole
| sort spend desc
| limit 10
```

Consultez le [guide des requêtes de tableaux de bord](../custom-dashboards-for-genai-telemetry) pour le calcul complet des coûts et plus d'exemples.

---

## Stratégie d'alerte

Configurez les alertes par niveaux correspondant à l'urgence et l'impact.

### Alertes critiques (intervention immédiate)

- Taux d'erreur supérieur à 5 %
- P95 de latence supérieur à 10 secondes
- Coût quotidien supérieur à 150 % de la ligne de base
- Indisponibilité du modèle
- Taux d'erreur d'agent supérieur à 10 % pendant 15 minutes

### Alertes d'avertissement (investiguer pendant les heures ouvrables)

- Utilisation de tokens en hausse de 20 % semaine après semaine
- Dégradation de la latence sur 7 jours
- Baisse du taux de cache hit
- Modèles de requêtes inhabituels
- Taux de complétion inférieur à 95 % pendant 2 heures
- P95 d'un composant supérieur à 5000ms

### Alertes informationnelles (résumé quotidien)

- Résumés de coûts quotidiens
- Rapports d'utilisation hebdomadaires
- Comparaisons de performances des modèles
- Rapport des principaux dépenseurs

### Exemple de routage des alertes

```yaml
route:
  group_by: ['alertname', 'cloud_provider']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-ops'
    - match:
        alertname: MonthlyBudgetExceeded
      receiver: 'slack-finops'
```

---

## Modèle de maturité de l'Observability

**Niveau 1 : Surveillance de base**

- Suivre les comptages de requêtes et erreurs
- Métriques de latence de base
- Suivi manuel des coûts

**Niveau 2 : Métriques complètes**

- Suivi au niveau des tokens
- Métriques multi-dimensionnelles (modèle, équipe, environnement)
- Tableaux de bord automatisés
- Alertes de base avec lignes de base

**Niveau 3 : Analyses avancées**

- Traçage distribué à travers les flux de travail d'agent
- Attribution des coûts par équipe/fonctionnalité
- Scoring de qualité et intégration des retours utilisateurs
- Alertes prédictives basées sur les tendances

**Niveau 4 : Observability propulsée par l'IA**

- Détection d'anomalies sur les coûts et le comportement
- Analyse automatisée des causes profondes
- Systèmes auto-réparateurs (repli automatique vers des modèles moins chers)
- Boucles d'optimisation continues

---

## Intégration avec le MLOps

L'observability devrait s'étendre à l'ensemble du cycle de vie ML, pas seulement la production :

**Phase d'entraînement :**

- Suivre les coûts et la durée d'entraînement
- Surveiller les métriques de qualité du modèle
- Contrôle de version pour les modèles et prompts

**Phase de déploiement :**

- Déploiements canary avec comparaison de métriques
- Surveillance des déploiements blue-green
- Déclencheurs de rollback basés sur les signaux d'observability

**Phase de production :**

- Surveillance continue
- Déclencheurs de réentraînement automatisé basés sur la détection de dérive
- Détection de dégradation des performances

**Phase d'optimisation :**

- Frameworks de tests A/B pour les prompts et modèles
- Analyse des compromis coût-performance
- Boucles de rétroaction d'ingénierie de prompts

---

## Anti-patterns courants à éviter

1. **Journaliser les prompts et réponses complets sans rédaction des données personnelles** — violations de conformité, risque de fuite de données. Configurez les politiques de protection des données *avant* d'activer la journalisation des invocations de modèles.
2. **Ne suivre que les métriques agrégées** — vous ne pouvez pas déboguer les problèmes individuels ou attribuer les coûts sans détail par requête.
3. **Définir des alarmes sans lignes de base** — fatigue d'alerte due aux faux positifs. Établissez toujours le comportement normal d'abord.
4. **Ignorer l'utilisation des tokens jusqu'à l'arrivée de la facture** — au moment où vous voyez la facture, le mal est fait. Surveillez quotidiennement.
5. **Utiliser des noms de métriques différents par fournisseur** — vous ne pouvez pas comparer les performances entre modèles. Standardisez sur les conventions sémantiques GenAI d'OpenTelemetry.
6. **Stocker les données de télémétrie indéfiniment** — problèmes de conformité et coûts de stockage inutiles. Définissez des politiques de rétention par classe de données.
7. **Création manuelle de tableaux de bord** — incohérence et charge de maintenance. Utilisez l'Infrastructure as Code pour les tableaux de bord.
8. **Ne surveiller que les métriques techniques** — vous manquez les problèmes de qualité et d'impact métier. Suivez la satisfaction utilisateur en plus de la latence.

---

## Checklist de démarrage

### Pré-production

- [ ] Activer CloudWatch Transaction Search
- [ ] Pour AgentCore : déployez votre agent — la télémétrie circule automatiquement
- [ ] Pour non-AgentCore : attachez l'agent d'auto-instrumentation ADOT
- [ ] Activer la journalisation des invocations de modèles Bedrock via la console Bedrock
- [ ] Configurer les politiques de protection des données pour la rédaction des données personnelles
- [ ] Définir les politiques de rétention des logs pour chaque groupe de logs
- [ ] Construire les tableaux de bord initiaux en utilisant le [guide des requêtes de tableaux de bord](../custom-dashboards-for-genai-telemetry)
- [ ] Documenter les métriques de référence (latence, utilisation des tokens, coût)
- [ ] Configurer les alarmes avec des seuils appropriés
- [ ] Créer des runbooks pour les problèmes courants

### Production

- [ ] Surveillance activée en production
- [ ] Alertes routées vers les canaux corrects (PagerDuty, Slack)
- [ ] Accès d'équipe configuré (tableaux de bord en lecture seule pour les parties prenantes)
- [ ] Sauvegarde et reprise après sinistre testées
- [ ] Calendrier de révision régulier établi (révision hebdomadaire des coûts, révision mensuelle des performances)

---

## Ressources supplémentaires

### Guides complémentaires

- [Création de tableaux de bord personnalisés pour la télémétrie GenAI](../custom-dashboards-for-genai-telemetry) — Transformez la télémétrie en tableaux de bord basés sur les personas pour les équipes DevOps, FinOps et autres parties prenantes

### Documentation AWS

- [Model Invocations — CloudWatch GenAI Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [Getting Started with AgentCore Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
- [Set up Bedrock Model Invocation Logging](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination)
- [Protect Sensitive Data in CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)
- [Configure Custom Observability for AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [Configure Third-Party Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [AgentCore Evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html)

### Standards et outils

- [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/)

---

**Contributeurs :** AWS Observability Team
**Dernière mise à jour :** 2026-04-21
