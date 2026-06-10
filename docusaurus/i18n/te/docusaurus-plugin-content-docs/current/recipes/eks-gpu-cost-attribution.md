# EKS క్లస్టర్ వ్యాప్త GPU ఖర్చు ఆపాదన

ఈ పోస్ట్ **Amazon EKS** పై **GPU slice cost allocation** కోసం ఎండ్-టు-ఎండ్ proof of concept (PoC) ను వివరిస్తుంది.

---

## సమస్య వివరణ

బహుళ టెనెంట్‌లు GPU సామర్థ్యాన్ని (ఉదా., **MIG slices**) పంచుకున్నప్పుడు, మీరు సమాధానం ఇవ్వాలి:

- **ఎవరు GPU యొక్క ఏ వాటాను అభ్యర్థించారు** (pod / namespace / BU ద్వారా)?
- **ఎవరు GPU ను నిజంగా ఉపయోగించారు** (మరియు ఎంత)?
- **$12 per GPU-hour** వంటి "పబ్లిక్" ధర ఇచ్చినప్పుడు, మేము ఎలా లెక్కిస్తాము:
  - **కేటాయించిన ఖర్చు** (అభ్యర్థించిన వాటా ఆధారంగా)
  - **సమర్థ ఖర్చు** (గమనించిన వినియోగం ఆధారంగా)
  - **వృధా** (కేటాయించిన minus సమర్థ)


---

## ఆర్కిటెక్చర్ (ఉన్నత స్థాయి)

	![architecture](eks-cost-gpu.png)

---

## ముందస్తు అవసరాలు

### AWS + EKS ముందస్తు అవసరాలు
- కింది వాటిని సృష్టించడానికి అనుమతి ఉన్న AWS అకౌంట్:
  - EKS clusters + nodegroups
  - IAM roles for service accounts (IRSA)
  - AMP workspace
- మీ రీజియన్‌లో **GPU instances రన్ చేయడానికి Quota మరియు AZ capacity**

---

## ఉపయోగించిన వేరియబుల్స్

```bash
export AWS_REGION="us-west-2"
export CLUSTER_NAME="gpu-cost-poc"
export AMP_ALIAS="gpu-cost-poc"

# మీరు ప్రదర్శించాలనుకుంటున్న Public/benchmark ధర (ఇంకా CUR కాదు)
export GPU_HOURLY_RATE="12"

# PoC కోసం MIG ప్రొఫైల్ (ఉదా: A100 40GB సాధారణంగా 7 slices/GPU తో 1g.5gb ను మద్దతిస్తుంది)
export MIG_PROFILE_LABEL="all-1g.5gb"

# ముఖ్యం: ఈ PoC లో, MIG slices nvidia.com/gpu గా ఎక్స్‌పోజ్ చేయబడ్డాయి (1 "gpu" == 1 MIG slice)
export MIG_RESOURCE_KEY="nvidia.com/gpu"

# A100 పై 1g.5gb కోసం: సాధారణంగా భౌతిక GPU కి 7 slices
export SLICES_PER_GPU="7"

# kube-state-metrics extended resource names ను "sanitize" చేయవచ్చు
export KSM_RESOURCE_REGEX='nvidia.*(gpu|mig).*'
```

---

## దశల వారీ సూచనలు
---

### దశ 1 — EKS క్లస్టర్ సృష్టించండి

మీ `eksctl` మద్దతిచ్చే వెర్షన్‌లను జాబితా చేయండి:

```bash
eksctl utils describe cluster-versions
```

క్లస్టర్ సృష్టించండి (`eksctl` మద్దతు ఉన్న డిఫాల్ట్‌ను ఎంచుకోనివ్వడానికి `--version` ను తొలగించండి):

```bash
eksctl create cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --managed
```

---

### దశ 2 — "system" nodegroup జోడించండి (సిఫార్సు చేయబడింది)

ఇది CoreDNS మరియు operators ను ఖరీదైన GPU nodes నుండి దూరంగా ఉంచుతుంది.

```bash
eksctl create nodegroup \
  --cluster "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --name "system-ng" \
  --node-type "m5.large" \
  --nodes 2 --nodes-min 2 --nodes-max 3
```


---

### దశ 3 — GPU nodegroup జోడించండి



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

GPU workloads మాత్రమే అక్కడ schedule అయ్యేలా taint వర్తింపజేయండి:

```bash
kubectl taint nodes -l workload=gpu nvidia.com/gpu=present:NoSchedule --overwrite
```

---

### దశ 4 — NVIDIA GPU Operator ఇన్‌స్టాల్ చేయండి (MIG ఎనేబుల్డ్)

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

helm upgrade --install gpu-operator nvidia/gpu-operator \
  -n gpu-operator --create-namespace \
  --set mig.strategy=single
```

---

### దశ 5 — GPU node(s) పై MIG ప్రొఫైల్ ఎనేబుల్ చేయండి

ప్రస్తుత MIG labels తనిఖీ చేయండి:

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.capable}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

MIG geometry వర్తింపజేయండి:

```bash
kubectl label nodes -l workload=gpu nvidia.com/mig.config="$MIG_PROFILE_LABEL" --overwrite
```

విజయం కోసం వేచి ఉండండి:

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

---

### దశ 6 — AMP workspace సృష్టించండి

```bash
aws amp create-workspace --alias "$AMP_ALIAS" --region "$AWS_REGION"

export AMP_WORKSPACE_ID="$(aws amp list-workspaces --region "$AWS_REGION" --query "workspaces[?alias=='$AMP_ALIAS'].workspaceId | [0]" --output text)"
export AMP_ENDPOINT="$(aws amp describe-workspace --workspace-id "$AMP_WORKSPACE_ID" --region "$AWS_REGION" --query "workspace.prometheusEndpoint" --output text)"

echo "$AMP_WORKSPACE_ID"
echo "$AMP_ENDPOINT"
```

---

### దశ 7 — ingest + query కోసం IRSA

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

### దశ 8 — kube-state-metrics ఇన్‌స్టాల్ చేయండి

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-state-metrics prometheus-community/kube-state-metrics \
  -n kube-system
```

---

### దశ 9 — OTel collector డిప్లాయ్ చేయండి (Prometheus scrape → AMP remote_write)


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

### దశ 10 — మూడు BU workloads డిప్లాయ్ చేయండి (3/2/2 slices)

BU namespaces + deployments వర్తింపజేయండి.
**కీలక వివరం:** pod కి `nvidia.com/gpu: 1` అభ్యర్థించండి (ఎందుకంటే MIG slices ఇక్కడ `nvidia.com/gpu` గా ఎక్స్‌పోజ్ చేయబడ్డాయి).

---

## క్వెరీలు: allocation, utilization, effective cost, waste

### 1) namespace (BU) కి అభ్యర్థించిన slices

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

గమనించిన అవుట్‌పుట్:

```json
{"namespace":"bu-a","value":[...,"3"]}
{"namespace":"bu-b","value":[...,"2"]}
{"namespace":"bu-c","value":[...,"2"]}
```

### 2) GPU utilization మెట్రిక్ కనుగొనండి

మెట్రిక్ పేర్లు జాబితా చేయండి:

```bash
awscurl --service aps --region "$AWS_REGION" \
  "${AMP_ENDPOINT}api/v1/label/__name__/values" \
| python3 -c 'import sys,json; j=json.load(sys.stdin); print("\n".join(j["data"]))' \
| egrep -i "dcgm.*util|DCGM.*UTIL|gr_engine_active|sm_active" \
| head -n 30
```

మేము కనుగొన్నాము:

```text
DCGM_FI_PROF_GR_ENGINE_ACTIVE
```

### 3) Utilization fraction (scalar)

```bash
Q='scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

ఉదాహరణ గమనించిన (తక్కువ load కేస్):

```json
{"resultType":"scalar","result":[...,"0.0004539326785714286"]}
```

### 4) Allocation math (per hour)

BU కి కేటాయించిన $/hr:

```promql
allocated_usd_per_hr =
sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})
* (GPU_HOURLY_RATE / SLICES_PER_GPU)
```

\(12/7\) constants తో:

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

ఇది కథను సరిపోతుంది:
- BU-A: \(3/7 × 12 = 5.142857\) $/hr
- BU-B: \(2/7 × 12 = 3.428571\) $/hr
- BU-C: \(2/7 × 12 = 3.428571\) $/hr

### 5) సమర్థ $/hr మరియు వృధా $/hr

కీలక పాయింట్: utilization ఒక **scalar** అయితే allocation ఒక **namespace-labeled vector**. Prometheus "broadcasts" చేయడానికి `scalar(...)` ఉపయోగించండి.

సమర్థ $/hr:

```bash
Q='(sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7))
   * scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

మేము చూసిన ఉదాహరణ అవుట్‌పుట్:

```json
{"namespace":"bu-a","value":[...,"0.002325599081632653"]}
{"namespace":"bu-b","value":[...,"0.0015503993877551022"]}
{"namespace":"bu-c","value":[...,"0.0015503993877551022"]}
```

వృధా $/hr:

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

మేము చూసిన ఉదాహరణ అవుట్‌పుట్:

```json
{"namespace":"bu-a","value":[...,"5.14053154377551"]}
{"namespace":"bu-b","value":[...,"3.427021029183673"]}
{"namespace":"bu-c","value":[...,"3.427021029183673"]}
```

---

## Amazon Managed Grafana (AMG): AMP పై డాష్‌బోర్డ్‌లు

ఈ PoC ను సులభంగా పంచుకోవడానికి, వేగవంతమైన విజువలైజేషన్ లేయర్ **Amazon Managed Grafana (AMG)**.

### 1) AMG workspace సృష్టించండి (CLI)

```bash
aws grafana create-workspace \
  --name "${CLUSTER_NAME}-gpu-cost" \
  --region "${AWS_REGION}" \
  --authentication-providers AWS_SSO \
  --permission-type SERVICE_MANAGED \
  --workspace-data-sources PROMETHEUS
```

Workspace URL పొందండి:

```bash
export AMG_WORKSPACE_ID="$(aws grafana list-workspaces --region "${AWS_REGION}" --query "workspaces[?name=='${CLUSTER_NAME}-gpu-cost'].id | [0]" --output text)"
aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" \
  --query "workspace.{status:status,endpoint:endpoint,roleArn:iamRoleArn}" --output yaml
```


### 2) AMG ను AMP క్వెరీ చేయడానికి అనుమతించండి

```bash
export AMG_ROLE_ARN="$(aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" --query "workspace.iamRoleArn" --output text)"
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 3) AMP ను Prometheus data source గా జోడించండి (Grafana UI)

AMG UI లో:
- **Connections → Data sources → Add data source → Prometheus**
- **URL**: `https://aps-workspaces.${AWS_REGION}.amazonaws.com/workspaces/${AMP_WORKSPACE_ID}`
- **SigV4**: enabled
  - **Region**: `${AWS_REGION}`
  - **Service**: `aps`
- **Save & test**

### 4) స్టార్టర్ panels (PromQL)

**BU/namespace ద్వారా అభ్యర్థించిన slices**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
)
```

**BU/namespace ద్వారా కేటాయించిన $/hr (12/7 constants)**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7)
```

**Utilization fraction scalar (cluster-level proxy)**

```promql
scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)
```

**సమర్థ $/hr (proxy)**

```promql
(sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7))
* scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))
```

**వృధా $/hr (proxy)**

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

## నేర్చుకున్న విషయాలు మరియు తదుపరి మెరుగుదలలు

### ఈ PoC నిరూపించేది
- requests declare చేయబడినప్పుడు (BU కి slices) మరియు సాధారణ constant తో ధర నిర్ణయించినప్పుడు **Allocation సూటి**.
- MIG తో, **అభ్యర్థించిన slices cost shares కు స్పష్టంగా map అవుతాయి**.
- నిష్క్రియ slices కోసం పేలవమైన ROI చూపించడానికి **వృధా** ను "కేటాయించిన minus సమర్థ" గా లెక్కించవచ్చు.

### ఈ PoC లో "అంచనా" ఏమిటి
- MIG తో, versions/config ఆధారంగా DCGM మెట్రిక్స్‌లో **per-pod GPU utilization labels ఉండకపోవచ్చు**.
- ఈ PoC BU కి "actual usage" కోసం proxy గా **cluster-level utilization scalar** ను ఉపయోగించింది.

### production-grade చేయడానికి తదుపరి దశలు
- **నిజమైన per-pod attribution**:
  - per-pod GPU usage exporter జోడించండి (కేటాయించిన MIG device ను చదివి pod labels తో utilization రిపోర్ట్ చేస్తుంది), లేదా
  - NVIDIA device plugin / runtime నుండి scheduler/device mapping ఇంటిగ్రేట్ చేయండి
- **నిజమైన pricing**:
  - constant $/GPU-hour ను AWS CUR లేదా on-demand price APIs తో భర్తీ చేయండి
- **డాష్‌బోర్డ్‌లు**:
  - AMP ను Grafana లోకి ప్లగ్ చేసి BU కి `allocated`, `effective`, మరియు `waste` ను కాలక్రమేణా చార్ట్ చేయండి

---

## క్లీనప్

మీరు PoC తో పూర్తి చేసిన తర్వాత, orphaned infrastructure మరియు కొనసాగుతున్న చార్జీలను నివారించడానికి రివర్స్ dependency ఆర్డర్‌లో అన్ని రిసోర్స్‌లను తొలగించండి.

### 1) BU workloads తొలగించండి

```bash
kubectl delete namespace bu-a bu-b bu-c
```

### 2) OTel collector తొలగించండి

```bash
kubectl delete namespace observability
```

### 3) kube-state-metrics అన్‌ఇన్‌స్టాల్ చేయండి

```bash
helm uninstall kube-state-metrics -n kube-system
```

### 4) NVIDIA GPU Operator అన్‌ఇన్‌స్టాల్ చేయండి

```bash
helm uninstall gpu-operator -n gpu-operator
kubectl delete namespace gpu-operator
```

### 5) Amazon Managed Grafana workspace తొలగించండి

```bash
aws grafana delete-workspace \
  --workspace-id "$AMG_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 6) AMG IAM policy డీటాచ్ చేయండి

```bash
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam detach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 7) AMP workspace తొలగించండి

```bash
aws amp delete-workspace \
  --workspace-id "$AMP_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 8) IRSA service accounts తొలగించండి

```bash
eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-ingest --namespace observability

eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-query --namespace observability
```

### 9) Nodegroups తొలగించండి

```bash
eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name gpu-ng-ubuntu

eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name system-ng
```

### 10) EKS క్లస్టర్ తొలగించండి

```bash
eksctl delete cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION"
```

:::tip
`eksctl delete cluster` OIDC provider ను మరియు వ్యక్తిగతంగా తొలగించబడకపోతే మిగిలిన nodegroups ను కూడా తొలగిస్తుంది. అయితే, nodegroups ను మొదట తొలగించడం CloudFormation stack deletion పై తక్కువ retries తో క్లీనర్ teardown ను నిర్ధారిస్తుంది.
:::

---
###### @author: Siva Guruvareddiar
