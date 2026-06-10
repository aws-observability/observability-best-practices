# Amazon Managed Service for Prometheus తో Fargate పై EKS లో AWS Distro for OpenTelemetry ను ఉపయోగించడం

ఈ రెసిపీలో [శాంపిల్ Go అప్లికేషన్](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app) ను ఇన్‌స్ట్రుమెంట్ చేసి, [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) లోకి మెట్రిక్స్‌ను ఇంజెస్ట్ చేయడానికి [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) ను ఎలా ఉపయోగించాలో చూపిస్తాము.
తర్వాత మెట్రిక్స్‌ను విజువలైజ్ చేయడానికి [Amazon Managed Grafana](https://aws.amazon.com/grafana/) ను ఉపయోగిస్తాము.

పూర్తి దృశ్యాన్ని ప్రదర్శించడానికి మేము [AWS Fargate](https://aws.amazon.com/fargate/) పై [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) క్లస్టర్‌ను సెటప్ చేసి [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) రిపాజిటరీని ఉపయోగిస్తాము.

:::note
    ఈ గైడ్ పూర్తి చేయడానికి సుమారు 1 గంట పడుతుంది.
:::
## ఇన్‌ఫ్రాస్ట్రక్చర్
ఈ క్రింది విభాగంలో ఈ రెసిపీ కోసం ఇన్‌ఫ్రాస్ట్రక్చర్‌ను సెటప్ చేస్తాము.

### ఆర్కిటెక్చర్

ADOT పైప్‌లైన్ Prometheus-ఇన్‌స్ట్రుమెంటెడ్ అప్లికేషన్‌ను స్క్రేప్ చేయడానికి మరియు స్క్రేప్ చేసిన మెట్రిక్స్‌ను Amazon Managed Service for Prometheus లోకి ఇంజెస్ట్ చేయడానికి [ADOT Collector](https://github.com/aws-observability/aws-otel-collector) ను ఉపయోగించడానికి అనుమతిస్తుంది.

![ఆర్కిటెక్చర్](../images/adot-metrics-pipeline.png)

ADOT Collector లో Prometheus కు సంబంధించిన రెండు కాంపోనెంట్లు ఉన్నాయి:

* Prometheus Receiver, మరియు
* AWS Prometheus Remote Write Exporter.

:::info
    Prometheus Remote Write Exporter గురించి మరింత సమాచారం కోసం చూడండి:
    [AMP కోసం Prometheus Remote Write Exporter తో ప్రారంభించడం](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter).
:::

### ముందస్తు అవసరాలు

* AWS CLI [ఇన్‌స్టాల్](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) చేయబడి మీ పరిసరంలో [కాన్ఫిగర్](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) చేయబడి ఉండాలి.
* మీ పరిసరంలో [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) ఆదేశాన్ని ఇన్‌స్టాల్ చేయాలి.
* మీ పరిసరంలో [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) ఇన్‌స్టాల్ చేయాలి.
* మీ పరిసరంలో [Docker](https://docs.docker.com/get-docker/) ఇన్‌స్టాల్ చేయబడి ఉండాలి.

### Fargate పై EKS క్లస్టర్ సృష్టించడం

మా డెమో అప్లికేషన్ ఒక Kubernetes యాప్, దీన్ని Fargate పై EKS క్లస్టర్‌లో అమలు చేస్తాము. కాబట్టి, ముందుగా అందించబడిన [cluster-config.yaml](./fargate-eks-metrics-go-adot-ampamg/cluster-config.yaml) టెంప్లేట్ ఫైల్ ఉపయోగించి EKS క్లస్టర్‌ను సృష్టించండి, `<YOUR_REGION>` ను [AMP కోసం మద్దతు ఉన్న రీజియన్లలో](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions) ఒకదానికి మార్చండి.

మీ షెల్ సెషన్‌లో `<YOUR_REGION>` ను సెట్ చేయండి, ఉదాహరణకు Bash లో:

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

ఈ క్రింది ఆదేశం ఉపయోగించి మీ క్లస్టర్‌ను సృష్టించండి:

```
eksctl create cluster -f cluster-config.yaml
```

### ECR రిపాజిటరీ సృష్టించడం

మా అప్లికేషన్‌ను EKS కు డిప్లాయ్ చేయడానికి కంటైనర్ రిపాజిటరీ అవసరం.
మీ ఖాతాలో కొత్త ECR రిపాజిటరీని సృష్టించడానికి ఈ క్రింది ఆదేశాన్ని ఉపయోగించవచ్చు.
`<YOUR_REGION>` ను కూడా సెట్ చేయండి.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### AMP సెటప్ చేయడం

ముందుగా, AWS CLI ఉపయోగించి Amazon Managed Service for Prometheus వర్క్‌స్పేస్‌ను సృష్టించండి:

```
aws amp create-workspace --alias prometheus-sample-app
```

వర్క్‌స్పేస్ సృష్టించబడిందో వెరిఫై చేయండి:

```
aws amp list-workspaces
```

:::info
    మరిన్ని వివరాలకు [AMP Getting started](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) గైడ్ చూడండి.
:::

### ADOT Collector సెటప్ చేయడం

[adot-collector-fargate.yaml](./fargate-eks-metrics-go-adot-ampamg/adot-collector-fargate.yaml) డౌన్‌లోడ్ చేసి, తదుపరి దశలలో వివరించిన పారామీటర్‌లతో ఈ YAML doc ను ఎడిట్ చేయండి.

ఈ ఉదాహరణలో, ADOT Collector కాన్ఫిగరేషన్ ఏ టార్గెట్ ఎండ్‌పాయింట్‌లను స్క్రేప్ చేయాలో చెప్పడానికి annotation `(scrape=true)` ను ఉపయోగిస్తుంది. ఇది ADOT Collector కు మీ క్లస్టర్‌లోని `kube-system` ఎండ్‌పాయింట్‌ల నుండి శాంపిల్ యాప్ ఎండ్‌పాయింట్‌ను వేరు చేయడానికి అనుమతిస్తుంది.
మీరు వేరే శాంపిల్ యాప్‌ను స్క్రేప్ చేయాలనుకుంటే re-label కాన్ఫిగరేషన్ల నుండి దీన్ని తొలగించవచ్చు.

మీ పరిసరం కోసం డౌన్‌లోడ్ చేసిన ఫైల్‌ను ఎడిట్ చేయడానికి ఈ క్రింది దశలను ఉపయోగించండి:

1\. `<YOUR_REGION>` ను మీ ప్రస్తుత రీజియన్‌తో భర్తీ చేయండి.

2\. `<YOUR_ENDPOINT>` ను మీ వర్క్‌స్పేస్ యొక్క remote write URL తో భర్తీ చేయండి.

ఈ క్రింది queries ను అమలు చేయడం ద్వారా మీ AMP remote write URL ఎండ్‌పాయింట్ పొందండి.

ముందుగా, ఈ విధంగా workspace ID పొందండి:

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

ఇప్పుడు మీ వర్క్‌స్పేస్ కోసం remote write URL ఎండ్‌పాయింట్ URL పొందండి:

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    `YOUR_ENDPOINT` నిజంగా remote write URL అని నిర్ధారించుకోండి, అంటే
    URL `/api/v1/remote_write` తో ముగియాలి.
:::
డిప్లాయ్‌మెంట్ ఫైల్ సృష్టించిన తర్వాత ఈ క్రింది ఆదేశం ఉపయోగించి మన క్లస్టర్‌కు apply చేయవచ్చు:

```
kubectl apply -f adot-collector-fargate.yaml
```

:::info
    మరింత సమాచారం కోసం [AWS Distro for OpenTelemetry (ADOT)
    Collector Setup](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup) చూడండి.
:::
### AMG సెటప్ చేయడం

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) గైడ్ ఉపయోగించి కొత్త AMG వర్క్‌స్పేస్ సెటప్ చేయండి.

సృష్టించేటప్పుడు "Amazon Managed Service for Prometheus" ను datasource గా జోడించాలని నిర్ధారించుకోండి.

![సర్వీస్ మేనేజ్డ్ అనుమతి సెట్టింగ్‌లు](../images/amg-console-create-workspace-managed-permissions.jpg)

## అప్లికేషన్

ఈ రెసిపీలో మేము AWS Observability రిపాజిటరీ నుండి
[శాంపిల్ అప్లికేషన్](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app) ను ఉపయోగిస్తాము.

ఈ Prometheus శాంపిల్ యాప్ నాలుగు Prometheus మెట్రిక్ రకాలను (counter, gauge, histogram, summary) జనరేట్ చేసి వాటిని `/metrics` ఎండ్‌పాయింట్ వద్ద బహిర్గతం చేస్తుంది.

### కంటైనర్ ఇమేజ్ బిల్డ్ చేయడం

కంటైనర్ ఇమేజ్‌ను బిల్డ్ చేయడానికి, ముందుగా Git రిపాజిటరీని clone చేసి ఈ క్రింది విధంగా డైరెక్టరీలోకి మారండి:

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

ముందుగా, రీజియన్ సెట్ చేయండి (ఇంతకు ముందు చేయకపోతే) మరియు మీ కేసులో వర్తించే ఖాతా ID.
`<YOUR_REGION>` ను మీ ప్రస్తుత రీజియన్‌తో భర్తీ చేయండి. ఉదాహరణకు, Bash షెల్‌లో ఇలా ఉంటుంది:

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

తర్వాత, కంటైనర్ ఇమేజ్‌ను బిల్డ్ చేయండి:

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    మీ పరిసరంలో proxy.golang.org i/o timeout వల్ల `go mod` విఫలమైతే,
    Dockerfile ను ఎడిట్ చేయడం ద్వారా go mod proxy ను బైపాస్ చేయవచ్చు.

    Docker ఫైల్‌లో ఈ క్రింది లైన్‌ను మార్చండి:
    ```
    RUN GO111MODULE=on go mod download
    ```
    ఇలా మార్చండి:
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::

ఇప్పుడు మీరు ముందుగా సృష్టించిన ECR repo కు కంటైనర్ ఇమేజ్‌ను push చేయవచ్చు.

దాని కోసం, ముందుగా డిఫాల్ట్ ECR రిజిస్ట్రీలో లాగిన్ అవ్వండి:

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

చివరగా, మీరు సృష్టించిన ECR రిపాజిటరీకి కంటైనర్ ఇమేజ్‌ను push చేయండి:

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

### శాంపిల్ యాప్ డిప్లాయ్ చేయడం

మీ ECR ఇమేజ్ పాత్‌ను కలిగి ఉండేలా [prometheus-sample-app.yaml](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) ను ఎడిట్ చేయండి. అంటే, ఫైల్‌లో `ACCOUNTID` మరియు `AWS_DEFAULT_REGION` ను మీ స్వంత విలువలతో భర్తీ చేయండి:

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

ఇప్పుడు మీ క్లస్టర్‌కు శాంపిల్ యాప్‌ను డిప్లాయ్ చేయవచ్చు:

```
kubectl apply -f prometheus-sample-app.yaml
```

## ఎండ్-టు-ఎండ్

ఇప్పుడు ఇన్‌ఫ్రాస్ట్రక్చర్ మరియు అప్లికేషన్ సిద్ధంగా ఉన్నాయి, EKS లో అమలవుతున్న Go యాప్ నుండి AMP కు మెట్రిక్స్ పంపి AMG లో విజువలైజ్ చేయడం ద్వారా సెటప్‌ను టెస్ట్ చేస్తాము.

### మీ పైప్‌లైన్ పనిచేస్తోందో వెరిఫై చేయడం

ADOT collector శాంపిల్ యాప్ పాడ్‌ను స్క్రేప్ చేసి మెట్రిక్స్‌ను AMP లోకి ఇంజెస్ట్ చేస్తోందో వెరిఫై చేయడానికి, collector లాగ్‌లను చూస్తాము.

ADOT collector లాగ్‌లను అనుసరించడానికి ఈ క్రింది ఆదేశం నమోదు చేయండి:

```
kubectl -n adot-col logs adot-collector -f
```

శాంపిల్ యాప్ నుండి స్క్రేప్ చేసిన మెట్రిక్స్ యొక్క లాగ్‌లలో ఒక ఉదాహరణ అవుట్‌పుట్ ఈ క్రింది విధంగా ఉండాలి:

```
...
Resource labels:
     -> service.name: STRING(kubernetes-service-endpoints)
     -> host.name: STRING(192.168.16.238)
     -> port: STRING(8080)
     -> scheme: STRING(http)
InstrumentationLibraryMetrics #0
Metric #0
Descriptor:
     -> Name: test_gauge0
     -> Description: This is my gauge
     -> Unit:
     -> DataType: DoubleGauge
DoubleDataPoints #0
StartTime: 0
Timestamp: 1606511460471000000
Value: 0.000000
...
```

:::tip
    AMP మెట్రిక్స్ అందుకుందో వెరిఫై చేయడానికి, మీరు [awscurl](https://github.com/okigan/awscurl) ఉపయోగించవచ్చు.
    ఈ టూల్ AWS Sigv4 ధృవీకరణతో కమాండ్ లైన్ నుండి HTTP అభ్యర్థనలు పంపడానికి అనుమతిస్తుంది,
    కాబట్టి AMP నుండి query చేయడానికి సరైన అనుమతులతో AWS క్రెడెన్షియల్స్ లోకల్‌గా సెటప్ చేయబడి ఉండాలి.
    ఈ క్రింది ఆదేశంలో `$AMP_ENDPOINT` ను మీ AMP వర్క్‌స్పేస్ ఎండ్‌పాయింట్‌తో భర్తీ చేయండి:

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### Grafana డాష్‌బోర్డ్ సృష్టించడం

మీరు ఈ క్రింది విధంగా కనిపించే శాంపిల్ యాప్ కోసం [prometheus-sample-app-dashboard.json](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) ద్వారా అందుబాటులో ఉన్న ఉదాహరణ డాష్‌బోర్డ్‌ను ఇంపోర్ట్ చేయవచ్చు:

![AMG లో Prometheus శాంపిల్ యాప్ డాష్‌బోర్డ్ యొక్క స్క్రీన్ షాట్](../images/amg-prom-sample-app-dashboard.png)

అదనంగా, Amazon Managed Grafana లో మీ స్వంత డాష్‌బోర్డ్ సృష్టించడానికి ఈ క్రింది గైడ్‌లను ఉపయోగించండి:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [డాష్‌బోర్డ్‌లను సృష్టించడానికి ఉత్తమ పద్ధతులు](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

అంతే, అభినందనలు! మెట్రిక్స్‌ను ఇంజెస్ట్ చేయడానికి Fargate పై EKS లో ADOT ను ఎలా ఉపయోగించాలో మీరు నేర్చుకున్నారు.

## క్లీనప్

ముందుగా Kubernetes రిసోర్సులను తొలగించి EKS క్లస్టర్‌ను డిస్ట్రాయ్ చేయండి:

```
kubectl delete all --all && \
eksctl delete cluster --name amp-eks-fargate
```

Amazon Managed Service for Prometheus వర్క్‌స్పేస్‌ను తొలగించండి:

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

IAM role ను తొలగించండి:

```
aws delete-role --role-name adot-collector-role
```

చివరగా, AWS కన్సోల్ ద్వారా Amazon Managed Grafana వర్క్‌స్పేస్‌ను తొలగించండి.
