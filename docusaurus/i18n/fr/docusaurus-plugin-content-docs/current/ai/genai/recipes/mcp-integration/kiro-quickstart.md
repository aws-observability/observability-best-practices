# Kiro IDE - Serveur MCP - Guide de démarrage rapide

## Ce que vous obtiendrez

Posez des questions en langage naturel directement dans Kiro IDE :
- "Which model is consuming the most tokens?"
- "What's the average latency for Claude Haiku?"
- "Estimate my LLM costs for the last hour"

Plus besoin de basculer vers des tableaux de bord ou d'écrire des requêtes complexes !

---

## Étape 1 : Configurer le serveur MCP dans Kiro

### Option A : Utiliser la configuration du workspace (recommandé)

1. **Créez le répertoire de configuration MCP** :
   ```bash
   mkdir -p .kiro/settings
   ```

2. **Copiez la configuration MCP** :
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **Mettez à jour le chemin dans la configuration** (si nécessaire) :
   Ouvrez `.kiro/settings/mcp.json` et vérifiez que le chemin vers `cloudwatch_mcp_server.py` est correct :
   ```json
   {
     "mcpServers": {
       "ai-observability": {
         "command": "python3",
         "args": [
           "/path/to/mcp-server/cloudwatch_mcp_server.py"
         ],
         "env": {
           "AWS_REGION": "your-aws-region"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### Option B : Utiliser la configuration au niveau utilisateur (globale)

1. **Créez le répertoire de configuration utilisateur** :
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **Copiez la configuration** :
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## Étape 2 : Vérifier les identifiants AWS

Le serveur MCP a besoin d'identifiants AWS pour interroger CloudWatch :

```bash
# Vérifiez que vos identifiants AWS sont configurés
aws sts get-caller-identity

# Devrait afficher :
# {
#     "UserId": "...",
#     "Account": "<your-account-id>",
#     "Arn": "arn:aws:iam::<your-account-id>:user/<your-username>"
# }
```

Si ce n'est pas configuré, configurez les identifiants AWS :
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: your-aws-region
# Default output format: json
```

---

## Étape 3 : Tester le serveur MCP (optionnel)

Avant de l'utiliser dans Kiro, vérifiez que le serveur MCP fonctionne :

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

Vous devriez voir une sortie comme :
```
Testing CloudWatch MCP Server
==============================

1. Testing get_token_usage...
✅ Success: {
  "token_type": "input",
  "time_range_hours": 1,
  "models": [...]
}

2. Testing get_model_latency...
✅ Success: {...}
```

---

## Étape 4 : Redémarrer Kiro IDE

Pour que Kiro charge la configuration MCP :

1. **Enregistrez tout votre travail**
2. **Quittez Kiro complètement** (Cmd+Q sur Mac, ou Fichier → Quitter)
3. **Rouvrez Kiro**
4. **Ouvrez votre workspace** (le dossier contenant `.kiro/settings/mcp.json`)

---

## Étape 5 : Vérifier que le serveur MCP est connecté

1. **Ouvrez le panneau des fonctionnalités Kiro** (barre latérale gauche)
2. **Recherchez la section "MCP Servers"**
3. **Vous devriez voir** : `ai-observability` avec un indicateur d'état vert
4. **Si vous voyez un indicateur rouge** : Cliquez dessus pour voir les détails de l'erreur

### Dépannage des problèmes de connexion

Si le serveur s'affiche comme déconnecté :

1. **Vérifiez la vue du serveur MCP** dans le panneau gauche de Kiro
2. **Cliquez sur "Reconnect"** si disponible
3. **Vérifiez les journaux** : Recherchez les messages d'erreur dans la sortie du serveur MCP
4. **Vérifiez le chemin Python** : Assurez-vous que `python3` est dans votre PATH
5. **Vérifiez les permissions de fichier** : Assurez-vous que `cloudwatch_mcp_server.py` est lisible

---

## Étape 6 : Utiliser les requêtes en langage naturel

### Dans le chat Kiro

1. **Ouvrez le chat Kiro** (Cmd+L ou cliquez sur l'icône de chat)
2. **Tapez votre question** en langage naturel :

```
Which model is consuming the most tokens?
```

3. **Kiro va automatiquement** :
   - Reconnaître qu'il s'agit d'une requête d'Observability
   - Appeler l'outil `get_token_usage` du serveur MCP
   - Retourner des résultats structurés

### Exemples de requêtes à essayer

#### 1. Utilisation des tokens
```
Which model is consuming the most tokens?
```

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
    }
  ]
}
```

#### 2. Statistiques de latence
```
What's the average latency for all models?
```

**Réponse attendue** :
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "avg_latency_ms": 2567.89
    },
    {
      "model": "gpt-4o",
      "avg_latency_ms": 2234.12
    }
  ]
}
```

#### 3. Estimation des coûts
```
Estimate the cost of LLM usage for the last hour
```

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
    }
  ]
}
```

#### 4. Volume de requêtes
```
How many requests have been made in the last hour?
```

#### 5. Comparaison des modèles
```
Compare all models by latency and token usage
```

---

## Étape 7 : Utilisation avancée

### Plages temporelles personnalisées

Vous pouvez spécifier des plages temporelles personnalisées dans vos requêtes :

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### Requêtes pour un modèle spécifique

Interrogez des modèles spécifiques en utilisant leurs identifiants complets :

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### Requêtes multi-métriques

Demandez une analyse complète :

```
Give me a complete overview of Claude Haiku performance
```

---

## Dépannage

### Réponses "No data"

**Problème** : Le serveur MCP renvoie des résultats vides

**Solutions** :
1. Exécutez la démo pour générer des métriques :
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. Attendez 1 à 2 minutes pour que CloudWatch ingère les métriques
3. Essayez d'augmenter la plage temporelle : "Show me token usage for the last 2 hours"

### Le serveur MCP ne répond pas

**Problème** : Les requêtes expirent ou échouent

**Solutions** :
1. Vérifiez l'état du serveur MCP dans le panneau MCP de Kiro
2. Vérifiez les identifiants AWS : `aws sts get-caller-identity`
3. Vérifiez les permissions CloudWatch
4. Redémarrez Kiro pour recharger la configuration MCP

### Erreurs de permissions

**Problème** : Erreurs "AccessDenied" dans les réponses

**Solutions** :
1. Vérifiez que les permissions IAM incluent :
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. Vérifiez que la région AWS est correctement définie

### Problèmes de chemin Python

**Problème** : "python3: command not found"

**Solutions** :
1. Trouvez votre chemin Python : `which python3`
2. Mettez à jour la configuration MCP avec le chemin complet :
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## Conseils pour de meilleurs résultats

### 1. Générer des données fraîches

Avant d'interroger, exécutez la démo pour vous assurer d'avoir des métriques récentes :
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. Utiliser le langage naturel

Le serveur MCP comprend les questions en langage naturel :
- "Which model costs the most?"
- "Show me latency for all models"
- "How many tokens did Claude use?"

### 3. Être spécifique si nécessaire

Pour des modèles spécifiques, utilisez leurs identifiants complets :
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. Combiner avec le contexte du code

Vous pouvez poser des questions tout en consultant du code :
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## Outils MCP disponibles

Le serveur MCP fournit 5 outils :

| Outil | Description | Exemple de requête |
|-------|-------------|-------------------|
| `get_token_usage` | Consommation de tokens par modèle | "Which model uses the most tokens?" |
| `get_model_latency` | Statistiques de latence | "What's the average latency?" |
| `get_request_count` | Volume de requêtes | "How many requests were made?" |
| `get_cost_estimate` | Estimation des coûts | "Estimate my LLM costs" |
| `compare_models` | Comparaison multi-métriques | "Compare all models" |

---

## Prochaines étapes

### Prendre des captures d'écran pour la démo

1. Exécutez la démo : `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. Attendez 1 à 2 minutes
3. Demandez : "Estimate the cost of LLM usage for the last hour"
4. Prenez une capture d'écran montrant la requête + la réponse

### Personnaliser pour votre cas d'utilisation

Modifiez `mcp-server/cloudwatch_mcp_server.py` pour :
- Ajouter des métriques personnalisées
- Modifier les formules de calcul des coûts
- Ajouter de nouveaux outils de requête
- Intégrer d'autres services AWS

### Partager avec votre équipe

1. Committez le fichier `.kiro/settings/mcp.json` dans votre dépôt
2. Les membres de l'équipe auront automatiquement accès au MCP
3. Tout le monde pourra interroger les données d'Observability depuis son IDE

---

## Ressources

- **Code du serveur MCP** : `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **Script de test** : `AI-OBS_DEMO/test-mcp-server.py`
- **Exemples de requêtes** : `AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **Architecture** : `AI-OBS_DEMO/ARCHITECTURE.md`

---

## Carte de référence rapide

```bash
# Configuration
mkdir -p .kiro/settings
cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json

# Test
python3 AI-OBS_DEMO/test-mcp-server.py

# Générer des données
python3 AI-OBS_DEMO/multi-cloud-demo.py

# Redémarrer Kiro
# Cmd+Q → Rouvrir

# Requête dans le chat
"Which model is consuming the most tokens?"
```

---

**Des questions ?** Consultez `MCP-DEMO-QUERIES.md` pour plus d'exemples ou ouvrez une issue sur GitHub.
