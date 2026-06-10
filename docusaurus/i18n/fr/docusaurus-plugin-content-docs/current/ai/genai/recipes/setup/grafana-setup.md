# Guide de configuration de Grafana

## Statut actuel
- ✅ Espace de travail Grafana : `<your-amg-workspace-id>` (ACTIF)
- ✅ Point de terminaison : `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- ⚠️ Authentification : AWS SSO requis (pas encore configuré)

## Option 1 : Activer AWS IAM Identity Center (Recommandé)

### Étape 1 : Activer IAM Identity Center
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# Or use AWS CLI
aws sso-admin create-instance --region <your-region>
```

**Dans la Console :**
1. Allez dans IAM Identity Center
2. Cliquez sur "Enable"
3. Choisissez "Enable with AWS Organizations" (ou standalone)
4. Attendez l'activation (prend 1-2 minutes)

### Étape 2 : Créer un utilisateur
1. Dans IAM Identity Center → Users
2. Cliquez sur "Add user"
3. Remplissez :
   - Username : votre-nom-utilisateur
   - Email : votre-email@amazon.com
   - Prénom/Nom
4. Cliquez sur "Next" → "Add user"
5. Vérifiez votre e-mail pour l'invitation

### Étape 3 : Attribuer l'utilisateur à Grafana
Une fois Identity Center activé, exécutez :

```bash
# Get the Identity Store ID
IDENTITY_STORE_ID=$(aws sso-admin list-instances --query 'Instances[0].IdentityStoreId' --output text)

# Get your user ID
USER_ID=$(aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --query "Users[?UserName=='your-username'].UserId" --output text)

# Assign user to Grafana workspace
aws grafana update-permissions \
  --workspace-id <your-amg-workspace-id> \
  --update-instruction-batch '[
    {
      "action": "ADD",
      "role": "ADMIN",
      "users": [
        {
          "id": "'$USER_ID'",
          "type": "SSO_USER"
        }
      ]
    }
  ]' \
  --region <your-region>
```

### Étape 4 : Accéder à Grafana
1. Ouvrez : `https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. Connectez-vous avec vos identifiants IAM Identity Center
3. Vous devriez maintenant avoir un accès administrateur

---

## Option 2 : Utiliser les tableaux de bord CloudWatch (Déjà fonctionnel !)

Si vous préférez éviter la configuration SSO, vous avez déjà un tableau de bord CloudWatch fonctionnel :

**URL du tableau de bord :**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**Avantages :**
- ✅ Aucune configuration SSO requise
- ✅ Déjà créé et fonctionnel
- ✅ Affiche toutes vos métriques
- ✅ Intégré avec CloudWatch Logs

**Pour visualiser :**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## Option 3 : Passer Grafana à l'authentification par clé API

Mettez à jour Grafana pour utiliser l'authentification par clé API au lieu de SSO :

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

Ensuite, configurez SAML avec votre fournisseur d'identité d'entreprise.

---

## Comparaison

| Fonctionnalité | Tableau de bord CloudWatch | Grafana |
|---------|---------------------|---------|
| Temps de configuration | ✅ Immédiat | ⚠️ Nécessite la configuration SSO |
| Authentification | Console AWS | IAM Identity Center |
| Personnalisation | Bonne | Excellente |
| Multi-source | Limitée | Excellente |
| Coût | Inclus | ~9$/mois |
| Statut actuel | ✅ Fonctionnel | ⚠️ Nécessite SSO |

---

## Recommandation

**Pour cette démo :** Utilisez le tableau de bord CloudWatch (Option 2) - il est déjà fonctionnel et affiche toutes vos métriques.

**Pour la production :** Configurez Grafana avec IAM Identity Center (Option 1) pour une meilleure visualisation et un support multi-source.

---

## Démarrage rapide (CloudWatch)

```bash
# View your dashboard
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Run demo to generate data
python3 AI-OBS_DEMO/local-demo.py

# View metrics
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#metricsV2:graph=~();namespace=AIObservability"

# View logs
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#logsV2:log-groups/log-group/$252Fai-observability-demo"
```
