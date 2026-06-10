# Requêtes de démonstration du serveur MCP

Ce guide fournit des exemples de requêtes en langage naturel que vous pouvez utiliser pour tester l'intégration du serveur MCP avec Kiro IDE.

## Prérequis

1. Assurez-vous d'avoir configuré le serveur MCP dans Kiro (voir `SETUP-MCP-KIRO.md`)
2. Exécutez la démo multi-cloud pour générer de la télémétrie : `python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. Attendez 1 à 2 minutes pour que les métriques apparaissent dans CloudWatch

## Exemples de requêtes pour les captures d'écran

### 1. Analyse de l'utilisation des tokens

**Requête** : "Which model is consuming the most tokens?"

**Réponse attendue** :
```json
{
  "token_type": "input",
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_tokens": 475
    },
    {
      "model": "gpt-4o",
      "total_tokens": 312
    },
    {
      "model": "gemini-1.5-pro",
      "total_tokens": 289
    }
  ]
}
```

**Requêtes alternatives** :
- "Show me input token usage for the last hour"
- "How many output tokens has Claude Haiku used?"
- "Compare token consumption across all models"

---

### 2. Statistiques de latence

**Requête** : "What is the average latency for Claude Haiku?"

**Réponse attendue** :
```json
{
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "avg_latency_ms": 1234.56,
  "max_latency_ms": 1876.23,
  "min_latency_ms": 892.45,
  "time_range_hours": 1,
  "datapoints": 31
}
```

**Requêtes alternatives** :
- "Show me latency statistics for all models"
- "Which model has the highest latency?"
- "What's the fastest model in terms of response time?"

---

### 3. Volume de requêtes

**Requête** : "How many requests have been made in the last hour?"

**Réponse attendue** :
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "total_requests": 81
    },
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_requests": 31
    },
    {
      "model": "gpt-4o",
      "total_requests": 21
    }
  ]
}
```

**Requêtes alternatives** :
- "Show me request counts by model"
- "Which model is being used the most?"
- "How many times was GPT-4o invoked?"

---

### 4. Estimation des coûts

**Requête** : "Estimate the cost of LLM usage for the last hour"

**Réponse attendue** :
```json
{
  "time_range_hours": 1,
  "total_estimated_cost_usd": 0.0142,
  "cost_breakdown": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "input_tokens": 475,
      "output_tokens": 8084,
      "estimated_cost_usd": 0.0102
    },
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "input_tokens": 312,
      "output_tokens": 2456,
      "estimated_cost_usd": 0.0031
    }
  ],
  "note": "Costs are estimates based on Claude 3 Haiku pricing ($0.25/$1.25 per 1M tokens)"
}
```

**Requêtes alternatives** :
- "What's my estimated LLM cost today?"
- "How much am I spending on Claude models?"
- "Calculate the cost per request"

---

### 5. Comparaison des modèles

**Requête** : "Compare all models by latency and token usage"

**Réponse attendue** :
```json
{
  "time_range_hours": 1,
  "latency": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "avg_latency_ms": 2567.89
      },
      {
        "model": "gpt-4o",
        "avg_latency_ms": 2234.12
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "avg_latency_ms": 1234.56
      }
    ]
  },
  "input_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 475
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 312
      }
    ]
  },
  "output_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 8084
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 2456
      }
    ]
  },
  "requests": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_requests": 81
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_requests": 31
      }
    ]
  }
}
```

**Requêtes alternatives** :
- "Show me a comparison of all active models"
- "Which model offers the best performance?"
- "Compare Claude Haiku vs Claude Sonnet"

---

## Requêtes avancées

### Requêtes avec plage temporelle

**Requête** : "Show me token usage for the last 2 hours"

Le serveur MCP prend en charge des plages temporelles personnalisées en utilisant le paramètre `hours`.

### Requêtes pour un modèle spécifique

**Requête** : "What's the latency for anthropic.claude-3-haiku-20240307-v1:0?"

Vous pouvez interroger des modèles spécifiques en utilisant leurs identifiants complets.

### Requêtes multi-métriques

**Requête** : "Give me a complete overview of Claude Haiku performance"

Cela déclenchera l'outil `compare_models` pour afficher toutes les métriques du modèle spécifié.

---

## Conseils pour les captures d'écran

### Meilleures requêtes pour les captures d'écran de démonstration

1. **Analyse des coûts** (la plus impressionnante) :
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   Montre une valeur métier réelle avec des montants en dollars.

2. **Comparaison des modèles** (la plus complète) :
   ```
   "Compare all models by latency and token usage"
   ```
   Montre la puissance de l'Observability unifiée entre les fournisseurs.

3. **Requête simple** (la plus accessible) :
   ```
   "Which model is consuming the most tokens?"
   ```
   Facile à comprendre, démontre la capacité de requête en langage naturel.

### Conseils de composition des captures d'écran

1. **Montrer la requête** : Assurez-vous que la requête en langage naturel est visible
2. **Montrer la réponse** : Incluez la réponse JSON complète avec les données
3. **Montrer le contexte** : Incluez le contexte de l'IDE (explorateur de fichiers, terminal) si possible
4. **Mettre en évidence les données clés** : Soulignez les informations intéressantes dans la réponse

### Flux d'exemple pour les captures d'écran

1. Ouvrez Kiro IDE
2. Ouvrez le panneau de chat
3. Tapez : "Estimate the cost of LLM usage for the last hour"
4. Attendez la réponse du serveur MCP
5. Prenez une capture d'écran montrant :
   - Votre requête en langage naturel
   - La réponse JSON structurée
   - La ventilation des coûts par modèle
   - Le coût total estimé

---

## Dépannage

### Réponse "No data"

**Problème** : Le serveur MCP renvoie des résultats vides

**Solutions** :
1. Exécutez la démo pour générer des métriques : `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. Attendez 1 à 2 minutes pour que CloudWatch ingère les métriques
3. Essayez d'augmenter la plage temporelle : "Show me token usage for the last 2 hours"

### Le serveur MCP ne répond pas

**Problème** : Les requêtes expirent ou échouent

**Solutions** :
1. Vérifiez que le serveur MCP est en cours d'exécution : Recherchez "ai-observability" dans le panneau MCP de Kiro
2. Vérifiez les identifiants AWS : `aws sts get-caller-identity`
3. Vérifiez les permissions CloudWatch : Assurez-vous d'avoir un accès en lecture aux métriques CloudWatch
4. Redémarrez Kiro pour recharger la configuration MCP

### Erreurs de permissions

**Problème** : Erreurs "AccessDenied" dans les réponses

**Solutions** :
1. Vérifiez que les permissions IAM incluent `cloudwatch:GetMetricStatistics`
2. Vérifiez que les permissions IAM incluent `cloudwatch:ListMetrics`
3. Vérifiez que la région AWS est définie sur `us-east-1` dans la configuration MCP

---

## Tester le serveur MCP directement

Vous pouvez également tester le serveur MCP directement sans Kiro :

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

Cela exécutera les 5 outils MCP et affichera les résultats, utile pour :
- Vérifier que le serveur MCP fonctionne
- Déboguer les problèmes
- Comprendre le format de réponse
- Générer des données d'exemple pour la documentation

---

## Prochaines étapes

Après avoir pris les captures d'écran :

1. **Ajouter à l'article de blog** : Incluez les captures d'écran dans la section "Résultats de la démo"
2. **Créer un tutoriel** : Utilisez les captures d'écran pour créer un guide étape par étape
3. **Partager avec l'équipe** : Démontrez la capacité de requête en langage naturel
4. **Recueillir des retours** : Demandez aux développeurs quelles autres requêtes seraient utiles

---

## Ressources supplémentaires

- **Code du serveur MCP** : `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **Guide de configuration** : `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **Script de test** : `AI-OBS_DEMO/test-mcp-server.py`
- **Configuration Kiro** : `AI-OBS_DEMO/kiro-mcp-config.json`
