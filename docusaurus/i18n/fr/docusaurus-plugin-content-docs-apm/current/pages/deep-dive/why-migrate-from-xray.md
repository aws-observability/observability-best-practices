# Pourquoi les clients X-Ray devraient adopter Application Signals + Transaction Search

## L'évolution des besoins en Observability

À mesure que les applications ont gagné en complexité et en échelle, les exigences des clients en matière d'observabilité ont considérablement évolué. Bien qu'[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) ait servi de solution fiable de traçage distribué, le paysage applicatif moderne exige une visibilité plus complète.

## Différences d'architecture technique

**Approche traditionnelle X-Ray :**

![Architecture X-Ray](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search :**

![Architecture Application Signals + Transaction Search](/apm-src/assets/images/deep-dive/ap%20ts.png)

## Principaux avantages de la migration

| Capacité | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **Ingestion des données** | 100 % des transactions (lorsque configuré) | 100 % des transactions (lorsque configuré) |
| **Limites de débit** | Soumis aux quotas de service X-Ray à fort volume | Capacité de débit plus élevée avec CloudWatch Logs |
| **Modèle de coût** | Tarification par trace (coûteux à 100 %) | Tarification groupée Application Signals |
| **Format de stockage** | Format propriétaire X-Ray | Format standard OpenTelemetry |
| **Backend de stockage** | Stockage optimisé X-Ray | CloudWatch Logs avec indexation sélective |
| **Analytique** | Console X-Ray uniquement | Transaction Search + analytique de traces X-Ray |
| **Capacités de requête** | Console et APIs X-Ray | Analytique visuelle Transaction Search + X-Ray |
| **Indexation** | Toutes les traces indexées | Indexation sélective (% configurable) |
| **Contexte métier** | Attributs personnalisés limités | Attributs de span OTEL enrichis + contexte métier |

## Propositions de valeur principales

### 1. Débit plus élevé et scalabilité

- **CloudWatch Logs gère un débit plus élevé que X-Ray**, permettant aux clients de suivre tous les événements applicatifs sans atteindre les limites de service
- **Les logs comme stockage pour les données de traces** supprime les contraintes de débit de X-Ray pour les applications à fort volume
- **Infrastructure évolutive** conçue pour des volumes massifs d'ingestion de logs

### 2. Capacités d'analytique et d'intégration améliorées

- **Fonctionnalités natives de CloudWatch Logs** disponibles pour l'analyse des données de span :
  - **Metrics Filters** : Créez des métriques personnalisées à partir des attributs et patterns de span
  - **Subscription Filters** : Diffusez les données de span vers d'autres services AWS (Lambda, Kinesis, etc.)
  - **Log Insights** : Capacités de requête avancées au-delà de l'analyse de traces traditionnelle
- **Transaction Search fournit une interface de requête visuelle avancée** pour l'analytique au niveau des spans
- **Le format OTEL permet un contexte métier plus riche** dans les spans avec des attributs personnalisés

### 3. Échantillonnage à 100 % rentable

- **La tarification groupée** rend la visibilité complète rentable par rapport à la tarification par trace de X-Ray. Veuillez consulter l'**Exemple 13** sur la [page de tarification CloudWatch](https://aws.amazon.com/cloudwatch/pricing/)
- **Coûts prévisibles** basés sur le volume de données, pas sur le nombre de traces
- **L'indexation sélective** optimise les coûts de stockage tout en maintenant un accès complet aux données

## Exploiter les fonctionnalités de CloudWatch Logs avec les données de span

Puisque Transaction Search stocke les données de span dans CloudWatch Logs (groupe de logs `aws/spans`), vous pouvez exploiter toutes les capacités natives de CloudWatch Logs :

**Metrics Filters :**
```bash
# Create custom metrics from span attributes
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**Subscription Filters :**
```bash
# Stream span data to Lambda for real-time processing
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Requêtes Log Insights :**
```sql
-- Find all spans with specific business attributes
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**Opportunités d'intégration :**
- **Alertes en temps réel** : Utilisez les subscription filters pour déclencher des fonctions Lambda pour une réponse immédiate aux incidents
- **Intelligence métier** : Exportez les données de span vers des plateformes d'analytique via Kinesis Data Streams
- **Tableaux de bord personnalisés** : Créez des tableaux de bord CloudWatch à partir de métriques dérivées des attributs de span
- **Audit de conformité** : Utilisez Log Insights pour interroger les spans à des fins de rapports de conformité réglementaire
