# Amazon Managed Service for Prometheus டிப்ளாய் செய்து Alert manager கட்டமைக்க Infrastructure as Code ஆக Terraform

இந்த ரெசிபியில், [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)-ஐ provision செய்து, ஒரு குறிப்பிட்ட நிபந்தனை பூர்த்தியானால் [SNS](https://docs.aws.amazon.com/sns/) topic-க்கு அறிவிப்பு அனுப்ப rules management மற்றும் alert manager-ஐ கட்டமைக்க [Terraform](https://www.terraform.io/)-ஐ எவ்வாறு பயன்படுத்துவது என்பதை நிரூபிப்போம்.


:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 30 நிமிடங்கள் ஆகும்.
:::
## முன்நிபந்தனைகள்

அமைப்பை முடிக்க பின்வருபவை தேவை:

* [Amazon EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

இந்த ரெசிபியில், ADOT பயன்படுத்தி metric scraping-ஐ நிரூபிக்கவும் Amazon Managed Service for Prometheus workspace-க்கு மெட்ரிக்குகளை remote write செய்யவும் ஒரு sample application பயன்படுத்துவோம். [aws-otel-community](https://github.com/aws-observability/aws-otel-community) repository-இலிருந்து sample app-ஐ fork மற்றும் clone செய்யவும்.

இந்த Prometheus sample app அனைத்து 4 Prometheus metric வகைகளையும் (counter, gauge, histogram, summary) உருவாக்கி /metrics endpoint-ல் வெளிப்படுத்துகிறது

/-ல் health check endpoint-ம் உள்ளது

கட்டமைப்பிற்கான விருப்ப command line flags பட்டியல் பின்வருமாறு:

listen_address: (default = 0.0.0.0:8080) sample app வெளிப்படுத்தப்படும் address மற்றும் port-ஐ வரையறுக்கிறது. இது முதன்மையாக test framework தேவைகளுக்கு இணங்க.

metric_count: (default=1) உருவாக்கப்பட வேண்டிய ஒவ்வொரு வகை metric-இன் எண்ணிக்கை. ஒவ்வொரு metric வகைக்கும் எப்போதும் ஒரே அளவு metrics உருவாக்கப்படும்.

label_count: (default=1) ஒவ்வொரு metric-க்கும் உருவாக்கப்பட வேண்டிய labels எண்ணிக்கை.


datapoint_count: (default=1) ஒவ்வொரு metric-க்கும் உருவாக்கப்பட வேண்டிய data-points எண்ணிக்கை.

### AWS Distro for OpenTelemetry பயன்படுத்தி Metric collection இயக்குதல்
1. aws-otel-community repository-இலிருந்து sample app-ஐ fork மற்றும் clone செய்யவும்.
பின்னர் பின்வரும் கட்டளைகளை இயக்கவும்.

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. இந்த image-ஐ Amazon ECR போன்ற registry-க்கு push செய்யவும். உங்கள் கணக்கில் புதிய ECR repository உருவாக்க பின்வரும் கட்டளையைப் பயன்படுத்தலாம். "YOUR_REGION"-ஐயும் அமைக்கவும்.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. இந்த Kubernetes configuration-ஐ copy செய்து apply செய்வதன் மூலம் sample app-ஐ கிளஸ்டரில் deploy செய்யவும். prometheus-sample-app.yaml கோப்பில் `PUBLIC_SAMPLE_APP_IMAGE`-ஐ நீங்கள் push செய்த image-உடன் மாற்றவும்.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector-இன் default instance-ஐ தொடங்கவும். அவ்வாறு செய்ய, முதலில் ADOT Collector-க்கான Kubernetes configuration-ஐ pull செய்ய பின்வரும் கட்டளையை உள்ளிடவும்.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
பின்னர் template கோப்பை திருத்தி, உங்கள் Amazon Managed Service for Prometheus workspace-க்கான remote_write endpoint-ஐ `YOUR_ENDPOINT`-க்கும், உங்கள் Region-ஐ `YOUR_REGION`-க்கும் மாற்றவும்.
Amazon Managed Service for Prometheus console-ல் உங்கள் workspace details-ஐ பார்க்கும்போது காட்டப்படும் remote_write endpoint-ஐ பயன்படுத்தவும்.
Kubernetes configuration-இன் service account பிரிவில் `YOUR_ACCOUNT_ID`-ஐ உங்கள் AWS account ID-க்கு மாற்ற வேண்டும்.

இந்த ரெசிபியில், ADOT Collector configuration annotation `(scrape=true)` பயன்படுத்தி எந்த target endpoints-ஐ scrape செய்ய வேண்டும் என்பதைக் குறிக்கிறது. இது ADOT Collector-க்கு sample app endpoint-ஐ உங்கள் கிளஸ்டரில் உள்ள kube-system endpoints-இலிருந்து வேறுபடுத்த உதவுகிறது. வேறு sample app-ஐ scrape செய்ய விரும்பினால் re-label configurations-இலிருந்து இதை நீக்கலாம்.
5. ADOT collector-ஐ deploy செய்ய பின்வரும் கட்டளையை உள்ளிடவும்.
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform மூலம் workspace கட்டமைத்தல்

இப்போது, Amazon Managed Service for Prometheus workspace-ஐ provision செய்து, ஒரு குறிப்பிட்ட நிபந்தனை (```expr```-ல் வரையறுக்கப்பட்ட) குறிப்பிட்ட கால அவகாசத்திற்கு (```for```) உண்மையாக இருந்தால் Alert Manager அறிவிப்பு அனுப்பும் alerting rule-ஐ வரையறுப்போம். Terraform language-ல் உள்ள code .tf file extension-உடன் plain text files-ல் சேமிக்கப்படுகிறது. .tf.json file extension-உடன் பெயரிடப்பட்ட JSON-based variant-ம் உள்ளது.

Terraform பயன்படுத்தி resources-ஐ deploy செய்ய [main.tf](./amp-alertmanager-terraform/main.tf)-ஐ பயன்படுத்துவோம். Terraform command இயக்குவதற்கு முன், `region` மற்றும் `sns_topic` variable-ஐ export செய்வோம்.

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

இப்போது, workspace-ஐ provision செய்ய கீழே உள்ள கட்டளைகளை இயக்குவோம்:

```
terraform init
terraform plan
terraform apply
```

மேலே உள்ள படிகள் முடிந்ததும், awscurl பயன்படுத்தி endpoint-ஐ query செய்து end-to-end அமைப்பை சரிபார்க்கவும். `WORKSPACE_ID` variable பொருத்தமான Amazon Managed Service for Prometheus workspace id-உடன் மாற்றப்பட்டிருப்பதை உறுதி செய்யவும்.

கீழே உள்ள கட்டளையை இயக்கும்போது, "metric:recording_rule" metric-ஐ தேடவும், வெற்றிகரமாக கண்டால் recording rule-ஐ வெற்றிகரமாக உருவாக்கியுள்ளீர்கள்:

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
Sample Output:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) > 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

alertmanager endpoint-ஐயும் query செய்து உறுதி செய்யலாம்
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
Sample Output:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5&g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
இது alert தூண்டப்பட்டு SNS receiver வழியாக SNS-க்கு அனுப்பப்பட்டதை உறுதிப்படுத்துகிறது

## சுத்தம் செய்தல்

Amazon Managed Service for Prometheus workspace-ஐ terminate செய்ய பின்வரும் கட்டளையை இயக்கவும். உருவாக்கிய EKS Cluster-ஐயும் நீக்குவதை உறுதி செய்யவும்:


```
terraform destroy
```

