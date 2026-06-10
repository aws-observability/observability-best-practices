# Attribution des couts GPU a l'echelle du cluster EKS

Cet article presente une preuve de concept (PoC) de bout en bout pour l'**allocation des couts par tranche GPU** sur **Amazon EKS**.

---

## Enonce du probleme

Lorsque plusieurs locataires partagent la capacite GPU (par exemple, des **tranches MIG**), vous devez repondre a :

- **Qui a demande quelle part** de GPU (par pod / namespace / BU) ?
- **Qui a reellement utilise le GPU** (et combien) ?
- Etant donne un prix « public » comme **12 $ par GPU-heure**, comment calculer :
  - **Cout alloue** (base sur la part demandee)
  - **Cout effectif** (base sur l'utilisation observee)
  - **Gaspillage** (alloue moins effectif)


---

## Architecture (haut niveau)

	![architecture](eks-cost-gpu.png)

---

## Prerequis

### Prerequis AWS + EKS
- Compte AWS avec les permissions pour creer :
  - Clusters EKS + nodegroups
  - Roles IAM pour les comptes de service (IRSA)
  - Espace de travail AMP
- **Quota et capacite AZ pour executer des instances GPU** dans votre region

---

## Variables utilisees

```bash
export AWS_REGION="us-west-2"
export CLUSTER_NAME="gpu-cost-poc"
export AMP_ALIAS="gpu-cost-poc"

# Public/benchmark price you want to demonstrate (not CUR yet)
export GPU_HOURLY_RATE="12"

# MIG profile for the PoC (eg: A100 40GB commonly supports 1g.5gb with 7 slices/GPU)
export MIG_PROFILE_LABEL="all-1g.5gb"

# IMPORTANT: in this PoC, MIG slices were exposed as nvidia.com/gpu (1 "gpu" == 1 MIG slice)
export MIG_RESOURCE_KEY="nvidia.com/gpu"

# For 1g.5gb on A100: typically 7 slices per physical GPU
export SLICES_PER_GPU="7"

# kube-state-metrics may "sanitize" extended resource names
export KSM_RESOURCE_REGEX='nvidia.*(gpu|mig).*'
```

---

## Instructions etape par etape
---

### Etape 1 — Creer le cluster EKS

Listez les versions supportees par votre `eksctl` :

```bash
eksctl utils describe cluster-versions
```

Creez le cluster (omettez `--version` pour laisser `eksctl` choisir une version par defaut supportee) :

```bash
eksctl create cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --managed
```

---

### Etape 2 — Ajouter un nodegroup « systeme » (recommande)

Cela permet de garder CoreDNS et les operateurs hors des noeuds GPU couteux.

```bash
eksctl create nodegroup \
  --cluster "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --name "system-ng" \
  --node-type "m5.large" \
  --nodes 2 --nodes-min 2 --nodes-max 3
```


---

### Etape 3 — Ajouter un nodegroup GPU



```bash
eksctl create nodegroup \
  --cluster "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --name "gpu-ng-ubuntu" \
  --node-type "p4d.24xlarge" \
  --node-ami-family "Ubuntu2204" \
  --install-nvidia-plugin=false \
  --nodes 1 --nodes-min 1 --nodes-max 1 \
  --node-labels "workload=gpu"
```

Appliquez un taint pour que seules les charges de travail GPU s'y planifient :

```bash
kubectl taint nodes -l workload=gpu nvidia.com/gpu=present:NoSchedule --overwrite
```

---

### Etape 4 — Installer NVIDIA GPU Operator (MIG active)

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

helm upgrade --install gpu-operator nvidia/gpu-operator \
  -n gpu-operator --create-namespace \
  --set mig.strategy=single
```

---

### Etape 5 — Activer le profil MIG sur le(s) noeud(s) GPU

Verifiez les labels MIG actuels :

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.capable}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

Appliquez la geometrie MIG :

```bash
kubectl label nodes -l workload=gpu nvidia.com/mig.config="$MIG_PROFILE_LABEL" --overwrite
```

Attendez le succes :

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

---

### Etape 6 — Creer l'espace de travail AMP

```bash
aws amp create-workspace --alias "$AMP_ALIAS" --region "$AWS_REGION"

export AMP_WORKSPACE_ID="$(aws amp list-workspaces --region "$AWS_REGION" --query "workspaces[?alias=='$AMP_ALIAS'].workspaceId | [0]" --output text)"
export AMP_ENDPOINT="$(aws amp describe-workspace --workspace-id "$AMP_WORKSPACE_ID" --region "$AWS_REGION" --query "workspace.prometheusEndpoint" --output text)"

echo "$AMP_WORKSPACE_ID"
echo "$AMP_ENDPOINT"
```

---

### Etape 7 — IRSA pour l'ingestion et les requetes

```bash
eksctl utils associate-iam-oidc-provider \
  --cluster "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --approve

eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-ingest --namespace observability \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \
  --approve --override-existing-serviceaccounts

eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-query --namespace observability \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \
  --approve --override-existing-serviceaccounts
```


---

### Etape 8 — Installer kube-state-metrics

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-state-metrics prometheus-community/kube-state-metrics \
  -n kube-system
```

---

### Etape 9 — Deployer le collecteur OTel (scrape Prometheus vers AMP remote_write)


```bash
kubectl -n observability patch configmap amp-scraper-otel-env --type merge -p "$(cat <<PATCH
{
  "data": {
    "AWS_REGION": "${AWS_REGION}",
    "AMP_ENDPOINT": "${AMP_ENDPOINT}"
  }
}
PATCH
)"

kubectl -n observability rollout restart deploy/amp-scraper-otel
kubectl -n observability rollout status deploy/amp-scraper-otel
```


---

### Etape 10 — Deployer trois charges de travail BU (3/2/2 tranches)

Appliquez les namespaces BU et les deployments.
**Detail critique :** demandez `nvidia.com/gpu: 1` par pod (car les tranches MIG sont exposees comme `nvidia.com/gpu` ici).

---

## Requetes : allocation, utilisation, cout effectif, gaspillage

### 1) Tranches demandees par namespace (BU)

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

Sortie observee :

```json
{"namespace":"bu-a","value":[...,"3"]}
{"namespace":"bu-b","value":[...,"2"]}
{"namespace":"bu-c","value":[...,"2"]}
```

### 2) Trouver une metrique d'utilisation GPU

Listez les noms de metriques :

```bash
awscurl --service aps --region "$AWS_REGION" \
  "${AMP_ENDPOINT}api/v1/label/__name__/values" \
| python3 -c 'import sys,json; j=json.load(sys.stdin); print("\n".join(j["data"]))' \
| egrep -i "dcgm.*util|DCGM.*UTIL|gr_engine_active|sm_active" \
| head -n 30
```

Nous avons trouve :

```text
DCGM_FI_PROF_GR_ENGINE_ACTIVE
```

### 3) Fraction d'utilisation (scalaire)

```bash
Q='scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

Exemple observe (cas de faible charge) :

```json
{"resultType":"scalar","result":[...,"0.0004539326785714286"]}
```

### 4) Calcul d'allocation (par heure)

$/hr alloue par BU :

```promql
allocated_usd_per_hr =
sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})
* (GPU_HOURLY_RATE / SLICES_PER_GPU)
```

Avec les constantes \(12/7\) :

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

Cela correspond au scenario :
- BU-A : \(3/7 × 12 = 5,142857\) $/hr
- BU-B : \(2/7 × 12 = 3,428571\) $/hr
- BU-C : \(2/7 × 12 = 3,428571\) $/hr

### 5) $/hr effectif et $/hr de gaspillage

Point cle : l'utilisation est un **scalaire** tandis que l'allocation est un **vecteur avec labels de namespace**. Utilisez `scalar(...)` pour que Prometheus le « diffuse ».

$/hr effectif :

```bash
Q='(sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7))
   * scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

Exemple de sortie observee :

```json
{"namespace":"bu-a","value":[...,"0.002325599081632653"]}
{"namespace":"bu-b","value":[...,"0.0015503993877551022"]}
{"namespace":"bu-c","value":[...,"0.0015503993877551022"]}
```

$/hr de gaspillage :

```bash
Q='(sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7))
 - (
    (sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7))
    * scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))
   )'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

Exemple de sortie observee :

```json
{"namespace":"bu-a","value":[...,"5.14053154377551"]}
{"namespace":"bu-b","value":[...,"3.427021029183673"]}
{"namespace":"bu-c","value":[...,"3.427021029183673"]}
```

---

## Amazon Managed Grafana (AMG) : tableaux de bord au-dessus d'AMP

Pour faciliter le partage de cette PoC, la couche de visualisation la plus rapide est **Amazon Managed Grafana (AMG)**.

### 1) Creer un espace de travail AMG (CLI)

```bash
aws grafana create-workspace \
  --name "${CLUSTER_NAME}-gpu-cost" \
  --region "${AWS_REGION}" \
  --authentication-providers AWS_SSO \
  --permission-type SERVICE_MANAGED \
  --workspace-data-sources PROMETHEUS
```

Obtenez l'URL de l'espace de travail :

```bash
export AMG_WORKSPACE_ID="$(aws grafana list-workspaces --region "${AWS_REGION}" --query "workspaces[?name=='${CLUSTER_NAME}-gpu-cost'].id | [0]" --output text)"
aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" \
  --query "workspace.{status:status,endpoint:endpoint,roleArn:iamRoleArn}" --output yaml
```


### 2) Permettre a AMG d'interroger AMP

```bash
export AMG_ROLE_ARN="$(aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" --query "workspace.iamRoleArn" --output text)"
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 3) Ajouter AMP comme source de donnees Prometheus (interface Grafana)

Dans l'interface AMG :
- **Connections → Data sources → Add data source → Prometheus**
- **URL** : `https://aps-workspaces.${AWS_REGION}.amazonaws.com/workspaces/${AMP_WORKSPACE_ID}`
- **SigV4** : active
  - **Region** : `${AWS_REGION}`
  - **Service** : `aps`
- **Save & test**

### 4) Panneaux de demarrage (PromQL)

**Tranches demandees par BU/namespace**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
)
```

**$/hr alloue par BU/namespace (constantes 12/7)**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7)
```

**Fraction d'utilisation scalaire (proxy au niveau du cluster)**

```promql
scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)
```

**$/hr effectif (proxy)**

```promql
(sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7))
* scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))
```

**$/hr de gaspillage (proxy)**

```promql
(sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7))
-
((sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7))
* scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0)))
```

---

## Enseignements et prochaines ameliorations

### Ce que cette PoC prouve
- **L'allocation est simple** lorsque les requetes sont declarees (tranches par BU) et tarifees avec une constante simple.
- Avec MIG, **les tranches demandees correspondent proprement** aux parts de cout.
- Vous pouvez calculer le **gaspillage** comme « alloue moins effectif » pour montrer un mauvais ROI pour les tranches inactives.

### Ce qui est « approximatif » dans cette PoC
- Avec MIG, **les labels d'utilisation GPU par pod peuvent ne pas etre presents** dans les metriques DCGM, selon les versions/configurations.
- Cette PoC a utilise un **scalaire d'utilisation au niveau du cluster** comme proxy pour l'« utilisation reelle » par BU.

### Prochaines etapes pour la mise en production
- **Attribution reelle par pod** :
  - ajouter un exporteur d'utilisation GPU par pod (lit le dispositif MIG assigne et rapporte l'utilisation avec les labels de pod), ou
  - integrer le mapping scheduler/dispositif depuis le plugin de dispositif NVIDIA / runtime
- **Tarification reelle** :
  - remplacer la constante $/GPU-heure par les API AWS CUR ou de prix a la demande
- **Tableaux de bord** :
  - connecter AMP a Grafana et tracer `allocated`, `effective` et `waste` dans le temps par BU

---

## Nettoyage

Lorsque vous avez termine avec la PoC, supprimez toutes les ressources dans l'ordre inverse des dependances pour eviter les infrastructures orphelines et les frais continus.

### 1) Supprimer les charges de travail BU

```bash
kubectl delete namespace bu-a bu-b bu-c
```

### 2) Supprimer le collecteur OTel

```bash
kubectl delete namespace observability
```

### 3) Desinstaller kube-state-metrics

```bash
helm uninstall kube-state-metrics -n kube-system
```

### 4) Desinstaller NVIDIA GPU Operator

```bash
helm uninstall gpu-operator -n gpu-operator
kubectl delete namespace gpu-operator
```

### 5) Supprimer l'espace de travail Amazon Managed Grafana

```bash
aws grafana delete-workspace \
  --workspace-id "$AMG_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 6) Detacher la politique IAM d'AMG

```bash
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam detach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 7) Supprimer l'espace de travail AMP

```bash
aws amp delete-workspace \
  --workspace-id "$AMP_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 8) Supprimer les comptes de service IRSA

```bash
eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-ingest --namespace observability

eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-query --namespace observability
```

### 9) Supprimer les nodegroups

```bash
eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name gpu-ng-ubuntu

eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name system-ng
```

### 10) Supprimer le cluster EKS

```bash
eksctl delete cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION"
```

:::tip
`eksctl delete cluster` supprime egalement le fournisseur OIDC et tous les nodegroups restants s'ils n'ont pas ete supprimes individuellement. Cependant, supprimer les nodegroups en premier assure un demontage plus propre avec moins de tentatives sur la suppression de la stack CloudFormation.
:::

---
###### @author: Siva Guruvareddiar


