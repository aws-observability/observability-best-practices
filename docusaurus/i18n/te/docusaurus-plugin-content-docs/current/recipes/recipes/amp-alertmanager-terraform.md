# Amazon Managed Service for Prometheus ని డిప్లాయ్ చేయడానికి మరియు Alert Manager ను కాన్ఫిగర్ చేయడానికి Infrastructure as Code గా Terraform

ఈ రెసిపీలో, [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) ని ప్రొవిజన్ చేయడానికి మరియు ఒక నిర్దిష్ట షరతు నెరవేరినప్పుడు [SNS](https://docs.aws.amazon.com/sns/) టాపిక్‌కు నోటిఫికేషన్ పంపడానికి rules management మరియు alert manager ను కాన్ఫిగర్ చేయడానికి [Terraform](https://www.terraform.io/) ను ఎలా ఉపయోగించవచ్చో చూపిస్తాము.


:::note
    ఈ గైడ్ పూర్తి చేయడానికి సుమారు 30 నిమిషాలు పడుతుంది.
:::
## ముందస్తు అవసరాలు

సెటప్ పూర్తి చేయడానికి మీకు ఈ క్రింది అవసరాలు ఉండాలి:

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

ఈ రెసిపీలో, ADOT ఉపయోగించి మెట్రిక్ స్క్రేపింగ్‌ను ప్రదర్శించడానికి మరియు Amazon Managed Service for Prometheus వర్క్‌స్పేస్‌కు మెట్రిక్స్‌ను remote write చేయడానికి మేము ఒక శాంపిల్ అప్లికేషన్‌ను ఉపయోగిస్తాము. [aws-otel-community](https://github.com/aws-observability/aws-otel-community) రిపాజిటరీ నుండి శాంపిల్ యాప్‌ను fork చేసి clone చేయండి.

ఈ Prometheus శాంపిల్ యాప్ అన్ని 4 Prometheus మెట్రిక్ రకాలను (counter, gauge, histogram, summary) జనరేట్ చేసి వాటిని /metrics ఎండ్‌పాయింట్ వద్ద బహిర్గతం చేస్తుంది

/ వద్ద ఒక health check ఎండ్‌పాయింట్ కూడా ఉంది

కాన్ఫిగరేషన్ కోసం ఐచ్ఛిక కమాండ్ లైన్ ఫ్లాగ్‌ల జాబితా ఈ క్రింది విధంగా ఉంది:

listen_address: (default = 0.0.0.0:8080) శాంపిల్ యాప్ ఏ అడ్రస్ మరియు పోర్ట్ వద్ద బహిర్గతం అవుతుందో నిర్వచిస్తుంది. ఇది ప్రధానంగా టెస్ట్ ఫ్రేమ్‌వర్క్ అవసరాలకు అనుగుణంగా ఉంటుంది.

metric_count: (default=1) ప్రతి రకం మెట్రిక్ జనరేట్ చేయడానికి మొత్తం. ప్రతి మెట్రిక్ రకానికి ఎల్లప్పుడూ ఒకే సంఖ్యలో మెట్రిక్స్ జనరేట్ అవుతాయి.

label_count: (default=1) ప్రతి మెట్రిక్‌కు జనరేట్ చేయడానికి లేబుల్‌ల సంఖ్య.


datapoint_count: (default=1) ప్రతి మెట్రిక్‌కు జనరేట్ చేయడానికి డేటా-పాయింట్‌ల సంఖ్య.

### AWS Distro for Opentelemetry ఉపయోగించి మెట్రిక్ సేకరణను ఎనేబుల్ చేయడం
1. aws-otel-community రిపాజిటరీ నుండి శాంపిల్ యాప్‌ను fork చేసి clone చేయండి.
ఆపై ఈ క్రింది ఆదేశాలను అమలు చేయండి.

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. ఈ ఇమేజ్‌ను Amazon ECR వంటి రిజిస్ట్రీకి push చేయండి. మీ ఖాతాలో కొత్త ECR రిపాజిటరీని సృష్టించడానికి ఈ క్రింది ఆదేశాన్ని ఉపయోగించవచ్చు. "YOUR_REGION" ను కూడా సెట్ చేయండి.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. ఈ Kubernetes కాన్ఫిగరేషన్‌ను కాపీ చేసి apply చేయడం ద్వారా క్లస్టర్‌లో శాంపిల్ యాప్‌ను డిప్లాయ్ చేయండి. prometheus-sample-app.yaml ఫైల్‌లో `PUBLIC_SAMPLE_APP_IMAGE` ను మీరు ఇప్పుడే push చేసిన ఇమేజ్‌తో భర్తీ చేయండి.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector యొక్క డిఫాల్ట్ ఇన్‌స్టెన్స్‌ను ప్రారంభించండి. అలా చేయడానికి, ముందుగా ADOT Collector కోసం Kubernetes కాన్ఫిగరేషన్‌ను pull చేయడానికి ఈ క్రింది ఆదేశాన్ని నమోదు చేయండి.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
ఆపై టెంప్లేట్ ఫైల్‌ను ఎడిట్ చేయండి, మీ Amazon Managed Service for Prometheus వర్క్‌స్పేస్ కోసం remote_write ఎండ్‌పాయింట్‌ను `YOUR_ENDPOINT` కు మరియు మీ రీజియన్‌ను `YOUR_REGION` కు ప్రతిక్షేపించండి.
Amazon Managed Service for Prometheus కన్సోల్‌లో మీ వర్క్‌స్పేస్ వివరాలను చూసినప్పుడు ప్రదర్శించబడే remote_write ఎండ్‌పాయింట్‌ను ఉపయోగించండి.
Kubernetes కాన్ఫిగరేషన్ యొక్క service account విభాగంలో `YOUR_ACCOUNT_ID` ను మీ AWS ఖాతా ID తో మార్చాలి.

ఈ రెసిపీలో, ADOT Collector కాన్ఫిగరేషన్ ఏ టార్గెట్ ఎండ్‌పాయింట్‌లను స్క్రేప్ చేయాలో చెప్పడానికి annotation `(scrape=true)` ను ఉపయోగిస్తుంది. ఇది ADOT Collector కు మీ క్లస్టర్‌లోని kube-system ఎండ్‌పాయింట్‌ల నుండి శాంపిల్ యాప్ ఎండ్‌పాయింట్‌ను వేరు చేయడానికి అనుమతిస్తుంది. మీరు వేరే శాంపిల్ యాప్‌ను స్క్రేప్ చేయాలనుకుంటే re-label కాన్ఫిగరేషన్ల నుండి దీన్ని తొలగించవచ్చు.
5. ADOT collector ను డిప్లాయ్ చేయడానికి ఈ క్రింది ఆదేశాన్ని నమోదు చేయండి.
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform తో వర్క్‌స్పేస్‌ను కాన్ఫిగర్ చేయడం

ఇప్పుడు, మేము Amazon Managed Service for Prometheus వర్క్‌స్పేస్‌ను ప్రొవిజన్ చేసి, ఒక నిర్దిష్ట షరతు (```expr``` లో నిర్వచించబడిన) నిర్దిష్ట సమయ వ్యవధి (```for```) పాటు నిజమైతే Alert Manager నోటిఫికేషన్ పంపేలా చేసే alerting rule ను నిర్వచిస్తాము. Terraform భాషలోని కోడ్ .tf ఫైల్ ఎక్స్‌టెన్షన్‌తో ప్లెయిన్ టెక్స్ట్ ఫైల్‌లలో నిల్వ చేయబడుతుంది. .tf.json ఫైల్ ఎక్స్‌టెన్షన్‌తో పేరు పెట్టబడిన భాష యొక్క JSON-ఆధారిత వేరియంట్ కూడా ఉంది.

మేము ఇప్పుడు terraform ఉపయోగించి రిసోర్సులను డిప్లాయ్ చేయడానికి [main.tf](./amp-alertmanager-terraform/main.tf) ను ఉపయోగిస్తాము. terraform ఆదేశాన్ని అమలు చేయడానికి ముందు, మేము `region` మరియు `sns_topic` వేరియబుల్‌ను ఎక్స్‌పోర్ట్ చేస్తాము.

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

ఇప్పుడు, వర్క్‌స్పేస్‌ను ప్రొవిజన్ చేయడానికి క్రింది ఆదేశాలను అమలు చేస్తాము:

```
terraform init
terraform plan
terraform apply
```

పై దశలు పూర్తయిన తర్వాత, awscurl ఉపయోగించి ఎండ్‌పాయింట్‌ను query చేయడం ద్వారా సెటప్‌ను ఎండ్-టు-ఎండ్ వెరిఫై చేయండి. `WORKSPACE_ID` వేరియబుల్‌ను తగిన Amazon Managed Service for Prometheus వర్క్‌స్పేస్ id తో భర్తీ చేయండి.

క్రింది ఆదేశాన్ని అమలు చేసినప్పుడు, "metric:recording_rule" మెట్రిక్ కోసం చూడండి, మరియు మీరు మెట్రిక్‌ను విజయవంతంగా కనుగొంటే, మీరు recording rule ను విజయవంతంగా సృష్టించారు:

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
శాంపిల్ అవుట్‌పుట్:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) > 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

అదే నిర్ధారించడానికి alertmanager ఎండ్‌పాయింట్‌ను మరింత query చేయవచ్చు
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
శాంపిల్ అవుట్‌పుట్:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5&g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
ఇది అలర్ట్ ట్రిగ్గర్ అయి SNS receiver ద్వారా SNS కు పంపబడినట్లు నిర్ధారిస్తుంది

## క్లీన్ అప్

Amazon Managed Service for Prometheus వర్క్‌స్పేస్‌ను ముగించడానికి ఈ క్రింది ఆదేశాన్ని అమలు చేయండి. సృష్టించబడిన EKS Cluster ను కూడా తొలగించాలని నిర్ధారించుకోండి:


```
terraform destroy
```
