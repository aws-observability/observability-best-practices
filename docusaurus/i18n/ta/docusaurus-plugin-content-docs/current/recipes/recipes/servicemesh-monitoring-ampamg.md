# EKS-ல் கட்டமைக்கப்பட்ட App Mesh சூழலை கண்காணிக்க Amazon Managed Service for Prometheus பயன்படுத்துதல்

இந்த ரெசிபியில் [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS) கிளஸ்டரில் [App Mesh](https://docs.aws.amazon.com/app-mesh/) Envoy மெட்ரிக்குகளை [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP)-க்கு உட்செலுத்தி, microservices-இன் ஆரோக்கியம் மற்றும் செயல்திறனை கண்காணிக்க [Amazon Managed Grafana](https://aws.amazon.com/grafana/) (AMG)-வில் custom டாஷ்போர்டு உருவாக்குவது எப்படி என்பதைக் காட்டுகிறோம்.

செயல்படுத்தலின் ஒரு பகுதியாக, AMP workspace உருவாக்கி, App Mesh Controller for Kubernetes நிறுவி, pods-ல் Envoy container-ஐ inject செய்வோம். EKS கிளஸ்டரில் கட்டமைக்கப்பட்ட [Grafana Agent](https://github.com/grafana/agent) பயன்படுத்தி Envoy மெட்ரிக்குகளை சேகரித்து AMP-க்கு எழுதுவோம். இறுதியாக, AMG workspace உருவாக்கி AMP-ஐ datasource ஆக கட்டமைத்து custom டாஷ்போர்டு உருவாக்குவோம்.

:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 45 நிமிடங்கள் ஆகும்.
:::
## உள்கட்டமைப்பு
பின்வரும் பகுதியில் இந்த ரெசிபிக்கான உள்கட்டமைப்பை அமைப்போம்.

### கட்டமைப்பு


![Architecture](../images/monitoring-appmesh-environment.png)

Grafana agent Envoy மெட்ரிக்குகளை scrape செய்து AMP remote write endpoint மூலம் AMP-க்கு உட்செலுத்த கட்டமைக்கப்பட்டுள்ளது

:::info 
    Prometheus Remote Write Exporter பற்றிய கூடுதல் தகவலுக்கு
    [AMP-க்கான Prometheus Remote Write Exporter-உடன் தொடங்குதல்](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)-ஐ பார்க்கவும்.
:::

### முன்நிபந்தனைகள்

* AWS CLI உங்கள் சூழலில் [நிறுவப்பட்டு](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) [கட்டமைக்கப்பட்டிருக்க](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) வேண்டும்.
* உங்கள் சூழலில் [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) கட்டளையை நிறுவ வேண்டும்.
* உங்கள் சூழலில் [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)-ஐ நிறுவ வேண்டும்.
* உங்கள் சூழலில் [Docker](https://docs.docker.com/get-docker/) நிறுவப்பட்டிருக்க வேண்டும்.
* உங்கள் AWS கணக்கில் AMP workspace கட்டமைக்கப்பட்டிருக்க வேண்டும்.
* [Helm](https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html) நிறுவ வேண்டும்.
* [AWS-SSO](https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html)-ஐ இயக்க வேண்டும்.

### EKS கிளஸ்டர் அமைத்தல்

முதலில், sample application இயக்க App Mesh இயக்கப்பட்ட EKS கிளஸ்டரை உருவாக்கவும். கிளஸ்டரை deploy செய்ய [eks-cluster-config.yaml](./servicemesh-monitoring-ampamg/eks-cluster-config.yaml) பயன்படுத்தி `eksctl` CLI பயன்படுத்தப்படும். இந்த template EKS-உடன் புதிய கிளஸ்டரை உருவாக்கும்.

Template கோப்பை திருத்தி AMP-க்கு கிடைக்கும் regions-ல் ஒன்றை உங்கள் region ஆக அமைக்கவும்:

* `us-east-1`
* `us-east-2`
* `us-west-2`
* `eu-central-1`
* `eu-west-1`

உங்கள் session-ல் இந்த region-ஐ மேலெழுதவும், உதாரணமாக Bash shell-ல்:

```
export AWS_REGION=eu-west-1
```

பின்வரும் கட்டளையைப் பயன்படுத்தி உங்கள் கிளஸ்டரை உருவாக்கவும்:

```
eksctl create cluster -f eks-cluster-config.yaml
```
இது `AMP-EKS-CLUSTER` என்ற EKS கிளஸ்டரையும் App Mesh controller for EKS பயன்படுத்தும் `appmesh-controller` என்ற service account-ஐயும் உருவாக்கும்.

### App Mesh Controller நிறுவுதல்

அடுத்து, [App Mesh Controller](https://docs.aws.amazon.com/app-mesh/latest/userguide/getting-started-kubernetes.html) நிறுவி Custom Resource Definitions (CRDs) கட்டமைக்க கீழே உள்ள கட்டளைகளை இயக்குவோம்:

```
helm repo add eks https://aws.github.io/eks-charts
```

```
helm upgrade -i appmesh-controller eks/appmesh-controller \
     --namespace appmesh-system \
     --set region=${AWS_REGION} \
     --set serviceAccount.create=false \
     --set serviceAccount.name=appmesh-controller
```

### AMP அமைத்தல்
Envoy-யிலிருந்து சேகரிக்கப்பட்ட Prometheus மெட்ரிக்குகளை உட்செலுத்த AMP workspace பயன்படுத்தப்படுகிறது.

AWS CLI பயன்படுத்தி workspace உருவாக்கவும்:

```
aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION
```

தேவையான Helm repositories-ஐ சேர்க்கவும்:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics 
```

AMP பற்றிய கூடுதல் விவரங்களுக்கு [AMP தொடங்குதல்](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) வழிகாட்டியைப் பார்க்கவும்.

### மெட்ரிக்குகளை Scrape செய்தல் & உட்செலுத்துதல்

AMP Kubernetes கிளஸ்டரில் உள்ள containerized workloads-இலிருந்து நேரடியாக operational மெட்ரிக்குகளை scrape செய்யாது. இந்த பணியைச் செய்ய Prometheus server அல்லது [AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector) அல்லது Grafana Agent போன்ற OpenTelemetry agent-ஐ deploy செய்து நிர்வகிக்க வேண்டும். இந்த ரெசிபியில், Envoy மெட்ரிக்குகளை scrape செய்து AMP மற்றும் AMG பயன்படுத்தி பகுப்பாய்வு செய்ய Grafana Agent-ஐ கட்டமைக்கும் செயல்முறையை விளக்குகிறோம்.

#### Grafana Agent கட்டமைத்தல்

Grafana Agent முழு Prometheus server இயக்குவதற்கு ஒரு lightweight alternative ஆகும். AMP-க்கு மெட்ரிக்குகளை அனுப்ப AWS Signature Version 4 (Sigv4) native support-ஐயும் உள்ளடக்கியது.

IAM role கட்டமைத்து, EKS கிளஸ்டரில் Grafana Agent நிறுவி, AMP-க்கு மெட்ரிக்குகளை forward செய்யும் படிகளை விளக்குகிறோம்.

#### அனுமதிகளை கட்டமைத்தல்

IRSA setup-ஐ பின்வருமாறு தயார் செய்யவும்:

```
kubectl create namespace grafana-agent

export WORKSPACE=$(aws amp list-workspaces | jq -r '.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId')
export ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)
export NAMESPACE="grafana-agent"
export REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"
```

பின்வரும் படிகளை தானியங்குமாக்க [gca-permissions.sh](./servicemesh-monitoring-ampamg/gca-permissions.sh) shell script-ஐ பயன்படுத்தலாம் (`YOUR_EKS_CLUSTER_NAME` placeholder variable-ஐ உங்கள் EKS கிளஸ்டர் பெயருடன் மாற்றவும்):

* AMP workspace-க்கு remote-write செய்ய அனுமதியுள்ள IAM policy-உடன் `EKS-GrafanaAgent-AMP-ServiceAccount-Role` என்ற IAM role உருவாக்கும்.
* IAM role-உடன் தொடர்புடைய `grafana-agent` namespace-இன் கீழ் `grafana-agent` என்ற Kubernetes service account உருவாக்கும்.
* IAM role மற்றும் உங்கள் Amazon EKS கிளஸ்டரில் host செய்யப்படும் OIDC provider இடையே trust relationship உருவாக்கும்.

இப்போது scrape configuration-உடன் manifest file [grafana-agent.yaml](./servicemesh-monitoring-ampamg/grafana-agent.yaml) உருவாக்கி Grafana Agent-ஐ deploy செய்யவும்.

:::note
    எழுதும் நேரத்தில், Fargate மீதான EKS-க்கு daemon sets ஆதரவு இல்லாததால் இந்த தீர்வு வேலை செய்யாது.
:::

```
kubectl apply -f grafana-agent.yaml
```
`grafana-agent` deploy ஆன பிறகு, மெட்ரிக்குகளை சேகரித்து குறிப்பிட்ட AMP workspace-க்கு உட்செலுத்தும்.

## Sample application

Application நிறுவி Envoy container inject செய்ய AppMesh controller for Kubernetes பயன்படுத்துகிறோம்.

முதலில், examples repo clone செய்து base application நிறுவுங்கள்:

```
git clone https://github.com/aws/aws-app-mesh-examples.git
```

உங்கள் கிளஸ்டருக்கு resources apply செய்யவும்:

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/1_base_application
```

அடுத்து, App Mesh controller நிறுவி deployment-ஐ meshify செய்யவும்:

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/
kubectl rollout restart deployment -n prod dj jazz-v1 metal-v1
```

5 நிமிடங்களுக்கு traffic உருவாக்கவும்:

```
dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`

loop_counter=0
while [ $loop_counter -le 300 ] ; do \
kubectl exec -n prod -it $dj_pod  -c dj \
-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \
done
```

### AMG workspace உருவாக்குதல்

AMG workspace உருவாக்க [AMG-உடன் தொடங்குதல்](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) வலைப்பதிவு இடுகையின் படிகளைப் பின்பற்றவும். AMP workspace-ஐ data source ஆக சேர்த்து டாஷ்போர்டு உருவாக்கத் தொடங்கவும்.

![AMP Workspace உருவாக்குதல்](../images/workspace-creation.png)

### AMG datasource கட்டமைத்தல்

AMG-யில் AMP-ஐ data source ஆக கட்டமைக்க, `Data sources` பிரிவில் `Configure in Grafana`-ஐ தேர்வு செய்யவும்.

![Datasource கட்டமைத்தல்](../images/configuring-amp-datasource.png)

### AMG dashboard கட்டமைத்தல்

Data source கட்டமைக்கப்பட்ட பிறகு, Envoy மெட்ரிக்குகளை பகுப்பாய்வு செய்ய custom dashboard இறக்குமதி செய்யவும். `Import` தேர்வு செய்து ID `11022` உள்ளிடவும்.

![Custom Dashboard](../images/import-dashboard.png)

### AMG-யில் alerts கட்டமைத்தல்

Grafana alerts கட்டமைக்கலாம். Amazon SNS-ஐ notification channel ஆக கட்டமைக்கவும்.

```
aws sns create-topic --name grafana-notification
```

```
aws sns subscribe \
    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \
	--protocol email \
	--notification-endpoint <email-id>
```

![Alert Configuration](../images/downstream-latency.png)

## சுத்தம் செய்தல்

1. Resources மற்றும் கிளஸ்டரை நீக்கவும்:
```
kubectl delete all --all
eksctl delete cluster --name AMP-EKS-CLUSTER
```
2. AMP workspace-ஐ நீக்கவும்:
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM role-ஐ நீக்கவும்:
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. AMG workspace-ஐ console-இலிருந்து நீக்கவும்.
