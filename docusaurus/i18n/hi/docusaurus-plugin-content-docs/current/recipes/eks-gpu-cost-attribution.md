# EKS क्लस्टर-व्यापी GPU लागत एट्रिब्यूशन

यह पोस्ट **Amazon EKS** पर **GPU स्लाइस लागत आवंटन** के लिए एक एंड-टू-एंड प्रूफ़ ऑफ़ कॉन्सेप्ट (PoC) के बारे में बताती है।

---

## समस्या विवरण

जब कई टेनेंट GPU क्षमता (जैसे, **MIG स्लाइसेस**) साझा करते हैं, तो आपको इन प्रश्नों का उत्तर देना होगा:

- **किसने GPU का कौन सा हिस्सा अनुरोध किया** (पॉड / नेमस्पेस / BU के अनुसार)?
- **किसने वास्तव में GPU का उपयोग किया** (और कितना)?
- **$12 प्रति GPU-घंटे** जैसी "सार्वजनिक" कीमत को देखते हुए, हम कैसे गणना करें:
  - **आवंटित लागत** (अनुरोधित शेयर के आधार पर)
  - **प्रभावी लागत** (देखे गए उपयोग के आधार पर)
  - **बर्बादी** (आवंटित माइनस प्रभावी)


---

## आर्किटेक्चर (उच्च स्तर)

	![architecture](eks-cost-gpu.png)

---

## पूर्वापेक्षाएँ

### AWS + EKS पूर्वापेक्षाएँ
- AWS अकाउंट जिसमें बनाने की अनुमति हो:
  - EKS क्लस्टर + नोडग्रुप्स
  - सर्विस अकाउंट के लिए IAM रोल्स (IRSA)
  - AMP वर्कस्पेस
- आपके रीजन में **GPU इंस्टेंस चलाने के लिए कोटा और AZ क्षमता**

---

## उपयोग किए गए वेरिएबल्स

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

## चरण-दर-चरण निर्देश
---

### चरण 1 — EKS क्लस्टर बनाएं

आपका `eksctl` कौन से संस्करण सपोर्ट करता है यह सूचीबद्ध करें:

```bash
eksctl utils describe cluster-versions
```

क्लस्टर बनाएं (`eksctl` को सपोर्टेड डिफ़ॉल्ट चुनने देने के लिए `--version` हटाएं):

```bash
eksctl create cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --managed
```

---

### चरण 2 — "system" नोडग्रुप जोड़ें (अनुशंसित)

यह CoreDNS और ऑपरेटर्स को महंगे GPU नोड्स से दूर रखता है।

```bash
eksctl create nodegroup \
  --cluster "$CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --name "system-ng" \
  --node-type "m5.large" \
  --nodes 2 --nodes-min 2 --nodes-max 3
```


---

### चरण 3 — GPU नोडग्रुप जोड़ें



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

एक taint लागू करें ताकि केवल GPU वर्कलोड वहाँ शेड्यूल हों:

```bash
kubectl taint nodes -l workload=gpu nvidia.com/gpu=present:NoSchedule --overwrite
```

---

### चरण 4 — NVIDIA GPU Operator इंस्टॉल करें (MIG सक्षम)

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

helm upgrade --install gpu-operator nvidia/gpu-operator \
  -n gpu-operator --create-namespace \
  --set mig.strategy=single
```

---

### चरण 5 — GPU नोड(ओं) पर MIG प्रोफ़ाइल सक्षम करें

वर्तमान MIG लेबल जांचें:

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.capable}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

MIG ज्यामिति लागू करें:

```bash
kubectl label nodes -l workload=gpu nvidia.com/mig.config="$MIG_PROFILE_LABEL" --overwrite
```

सफलता की प्रतीक्षा करें:

```bash
kubectl get nodes -l workload=gpu -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.nvidia\.com/mig\.config}{"\t"}{.metadata.labels.nvidia\.com/mig\.config\.state}{"\n"}{end}'
```

---

### चरण 6 — AMP वर्कस्पेस बनाएं

```bash
aws amp create-workspace --alias "$AMP_ALIAS" --region "$AWS_REGION"

export AMP_WORKSPACE_ID="$(aws amp list-workspaces --region "$AWS_REGION" --query "workspaces[?alias=='$AMP_ALIAS'].workspaceId | [0]" --output text)"
export AMP_ENDPOINT="$(aws amp describe-workspace --workspace-id "$AMP_WORKSPACE_ID" --region "$AWS_REGION" --query "workspace.prometheusEndpoint" --output text)"

echo "$AMP_WORKSPACE_ID"
echo "$AMP_ENDPOINT"
```

---

### चरण 7 — इंजेस्ट + क्वेरी के लिए IRSA

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

### चरण 8 — kube-state-metrics इंस्टॉल करें

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-state-metrics prometheus-community/kube-state-metrics \
  -n kube-system
```

---

### चरण 9 — OTel collector डिप्लॉय करें (Prometheus scrape → AMP remote_write)


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

### चरण 10 — तीन BU वर्कलोड डिप्लॉय करें (3/2/2 स्लाइस)

BU नेमस्पेसेस + डिप्लॉयमेंट्स लागू करें।
**महत्वपूर्ण विवरण:** प्रति पॉड `nvidia.com/gpu: 1` अनुरोध करें (क्योंकि MIG स्लाइसेस यहाँ `nvidia.com/gpu` के रूप में एक्सपोज़ किए गए हैं)।

---

## क्वेरीज़: आवंटन, उपयोग, प्रभावी लागत, बर्बादी

### 1) नेमस्पेस (BU) के अनुसार अनुरोधित स्लाइसेस

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

देखा गया आउटपुट:

```json
{"namespace":"bu-a","value":[...,"3"]}
{"namespace":"bu-b","value":[...,"2"]}
{"namespace":"bu-c","value":[...,"2"]}
```

### 2) GPU उपयोग मेट्रिक खोजें

मेट्रिक नाम सूचीबद्ध करें:

```bash
awscurl --service aps --region "$AWS_REGION" \
  "${AMP_ENDPOINT}api/v1/label/__name__/values" \
| python3 -c 'import sys,json; j=json.load(sys.stdin); print("\n".join(j["data"]))' \
| egrep -i "dcgm.*util|DCGM.*UTIL|gr_engine_active|sm_active" \
| head -n 30
```

हमने पाया:

```text
DCGM_FI_PROF_GR_ENGINE_ACTIVE
```

### 3) उपयोग अंश (स्केलर)

```bash
Q='scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

उदाहरण देखा गया (कम लोड मामला):

```json
{"resultType":"scalar","result":[...,"0.0004539326785714286"]}
```

### 4) आवंटन गणित (प्रति घंटा)

प्रति BU आवंटित $/hr:

```promql
allocated_usd_per_hr =
sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"})
* (GPU_HOURLY_RATE / SLICES_PER_GPU)
```

स्थिरांक \(12/7\) के साथ:

```bash
Q='sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7)'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

यह कथा से मेल खाता है:
- BU-A: \(3/7 × 12 = 5.142857\) $/hr
- BU-B: \(2/7 × 12 = 3.428571\) $/hr
- BU-C: \(2/7 × 12 = 3.428571\) $/hr

### 5) प्रभावी $/hr और बर्बादी $/hr

मुख्य बिंदु: उपयोग एक **स्केलर** है जबकि आवंटन एक **नेमस्पेस-लेबल्ड वेक्टर** है। `scalar(...)` का उपयोग करें ताकि Prometheus इसे "ब्रॉडकास्ट" करे।

प्रभावी $/hr:

```bash
Q='(sum by (namespace) (kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}) * (12/7))
   * scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))'
ENCODED="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$Q")"

awscurl --service aps --region "$AWS_REGION" \
  -X POST "${AMP_ENDPOINT}api/v1/query" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=${ENCODED}"
```

उदाहरण देखा गया आउटपुट:

```json
{"namespace":"bu-a","value":[...,"0.002325599081632653"]}
{"namespace":"bu-b","value":[...,"0.0015503993877551022"]}
{"namespace":"bu-c","value":[...,"0.0015503993877551022"]}
```

बर्बादी $/hr:

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

उदाहरण देखा गया आउटपुट:

```json
{"namespace":"bu-a","value":[...,"5.14053154377551"]}
{"namespace":"bu-b","value":[...,"3.427021029183673"]}
{"namespace":"bu-c","value":[...,"3.427021029183673"]}
```

---

## Amazon Managed Grafana (AMG): AMP के ऊपर डैशबोर्ड

इस PoC को साझा करना आसान बनाने के लिए, सबसे तेज़ विज़ुअलाइज़ेशन लेयर **Amazon Managed Grafana (AMG)** है।

### 1) AMG वर्कस्पेस बनाएं (CLI)

```bash
aws grafana create-workspace \
  --name "${CLUSTER_NAME}-gpu-cost" \
  --region "${AWS_REGION}" \
  --authentication-providers AWS_SSO \
  --permission-type SERVICE_MANAGED \
  --workspace-data-sources PROMETHEUS
```

वर्कस्पेस URL प्राप्त करें:

```bash
export AMG_WORKSPACE_ID="$(aws grafana list-workspaces --region "${AWS_REGION}" --query "workspaces[?name=='${CLUSTER_NAME}-gpu-cost'].id | [0]" --output text)"
aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" \
  --query "workspace.{status:status,endpoint:endpoint,roleArn:iamRoleArn}" --output yaml
```


### 2) AMG को AMP क्वेरी करने की अनुमति दें

```bash
export AMG_ROLE_ARN="$(aws grafana describe-workspace --region "${AWS_REGION}" --workspace-id "${AMG_WORKSPACE_ID}" --query "workspace.iamRoleArn" --output text)"
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 3) AMP को Prometheus डेटा सोर्स के रूप में जोड़ें (Grafana UI)

AMG UI में:
- **Connections → Data sources → Add data source → Prometheus**
- **URL**: `https://aps-workspaces.${AWS_REGION}.amazonaws.com/workspaces/${AMP_WORKSPACE_ID}`
- **SigV4**: enabled
  - **Region**: `${AWS_REGION}`
  - **Service**: `aps`
- **Save & test**

### 4) स्टार्टर पैनल (PromQL)

**BU/नेमस्पेस के अनुसार अनुरोधित स्लाइसेस**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
)
```

**BU/नेमस्पेस के अनुसार आवंटित $/hr (12/7 स्थिरांक)**

```promql
sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7)
```

**उपयोग अंश स्केलर (क्लस्टर-स्तरीय प्रॉक्सी)**

```promql
scalar(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100)
```

**प्रभावी $/hr (प्रॉक्सी)**

```promql
(sum by (namespace) (
  kube_pod_container_resource_requests{resource=~"nvidia.*(gpu|mig).*",unit="integer"}
) * (12/7))
* scalar(clamp_min(clamp_max(avg(DCGM_FI_PROF_GR_ENGINE_ACTIVE)/100, 1), 0))
```

**बर्बादी $/hr (प्रॉक्सी)**

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

## सीखें और अगले सुधार

### यह PoC क्या साबित करता है
- जब अनुरोध घोषित किए जाते हैं (प्रति BU स्लाइसेस) और एक सरल स्थिरांक के साथ कीमत तय की जाती है तो **आवंटन सीधा** है।
- MIG के साथ, **अनुरोधित स्लाइसेस सफ़ाई से** लागत शेयर्स में मैप होते हैं।
- आप निष्क्रिय स्लाइसेस के खराब ROI दिखाने के लिए **बर्बादी** को "आवंटित माइनस प्रभावी" के रूप में गणना कर सकते हैं।

### इस PoC में क्या "अनुमानित" है
- MIG के साथ, संस्करण/कॉन्फ़िगरेशन के आधार पर **प्रति-पॉड GPU उपयोग लेबल** DCGM मेट्रिक्स में मौजूद नहीं हो सकते।
- इस PoC ने प्रति BU "वास्तविक उपयोग" के प्रॉक्सी के रूप में एक **क्लस्टर-स्तरीय उपयोग स्केलर** का उपयोग किया।

### प्रोडक्शन-ग्रेड बनाने के अगले कदम
- **सच्चा प्रति-पॉड एट्रिब्यूशन**:
  - एक प्रति-पॉड GPU उपयोग एक्सपोर्टर जोड़ें (असाइन किया गया MIG डिवाइस पढ़ता है और पॉड लेबल के साथ उपयोग रिपोर्ट करता है), या
  - NVIDIA device plugin / runtime से शेड्यूलर/डिवाइस मैपिंग एकीकृत करें
- **वास्तविक मूल्य निर्धारण**:
  - स्थिरांक $/GPU-hour को AWS CUR या ऑन-डिमांड प्राइस API से बदलें
- **डैशबोर्ड**:
  - AMP को Grafana में प्लग करें और प्रति BU `allocated`, `effective`, और `waste` को समय के साथ चार्ट करें

---

## क्लीनअप

जब आप PoC के साथ काम पूरा कर लें, तो अनाथ इन्फ्रास्ट्रक्चर और चल रहे शुल्कों से बचने के लिए सभी रिसोर्सेज को रिवर्स डिपेंडेंसी क्रम में हटाएं।

### 1) BU वर्कलोड हटाएं

```bash
kubectl delete namespace bu-a bu-b bu-c
```

### 2) OTel collector हटाएं

```bash
kubectl delete namespace observability
```

### 3) kube-state-metrics अनइंस्टॉल करें

```bash
helm uninstall kube-state-metrics -n kube-system
```

### 4) NVIDIA GPU Operator अनइंस्टॉल करें

```bash
helm uninstall gpu-operator -n gpu-operator
kubectl delete namespace gpu-operator
```

### 5) Amazon Managed Grafana वर्कस्पेस हटाएं

```bash
aws grafana delete-workspace \
  --workspace-id "$AMG_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 6) AMG IAM पॉलिसी डिटैच करें

```bash
ROLE_NAME="$(basename "$AMG_ROLE_ARN")"
aws iam detach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
```

### 7) AMP वर्कस्पेस हटाएं

```bash
aws amp delete-workspace \
  --workspace-id "$AMP_WORKSPACE_ID" \
  --region "$AWS_REGION"
```

### 8) IRSA सर्विस अकाउंट हटाएं

```bash
eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-ingest --namespace observability

eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name amp-query --namespace observability
```

### 9) नोडग्रुप्स हटाएं

```bash
eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name gpu-ng-ubuntu

eksctl delete nodegroup \
  --cluster "$CLUSTER_NAME" --region "$AWS_REGION" \
  --name system-ng
```

### 10) EKS क्लस्टर हटाएं

```bash
eksctl delete cluster \
  --name "$CLUSTER_NAME" \
  --region "$AWS_REGION"
```

:::tip
`eksctl delete cluster` OIDC प्रोवाइडर और शेष नोडग्रुप्स (यदि अलग से नहीं हटाए गए) को भी हटा देता है। हालाँकि, पहले नोडग्रुप्स हटाने से CloudFormation स्टैक डिलीशन पर कम रिट्राई के साथ एक क्लीनर टियरडाउन सुनिश्चित होता है।
:::

---
###### @author: Siva Guruvareddiar


