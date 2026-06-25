# EC2 పై EKS లో AWS Distro for OpenTelemetry ను Amazon Managed Service for Prometheus తో ఉపయోగించడం

ఈ recipe లో [sample Go application](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app) ను instrument చేయడం మరియు [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) లోకి metrics ingest చేయడానికి [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) ఎలా ఉపయోగించాలో చూపిస్తాము. ఆపై metrics visualize చేయడానికి [Amazon Managed Grafana (AMG)](https://aws.amazon.com/grafana/) ఉపయోగిస్తాము.

Complete scenario demonstrate చేయడానికి EC2 పై [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) cluster మరియు [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) repository set up చేస్తాము.

:::note
    ఈ గైడ్ complete చేయడానికి సుమారు 1 గంట పడుతుంది.
:::
## Infrastructure
ఈ section లో ఈ recipe కోసం infrastructure set up చేస్తాము.

### Architecture


ADOT pipeline [ADOT Collector](https://github.com/aws-observability/aws-otel-collector) ను Prometheus-instrumented application scrape చేయడానికి మరియు scraped metrics ను Amazon Managed Service for Prometheus లోకి ingest చేయడానికి enable చేస్తుంది.

![Architecture](../images/adot-metrics-pipeline.png)

ADOT Collector Prometheus specific రెండు components include చేస్తుంది:

* Prometheus Receiver, మరియు
* AWS Prometheus Remote Write Exporter.

:::info
    Prometheus Remote Write Exporter గురించి మరింత సమాచారం కోసం check చేయండి: [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)
:::

### Prerequisites

* AWS CLI మీ environment లో [installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) మరియు [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) అయి ఉండాలి.
* మీ environment లో [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) command install చేయాలి.
* మీ environment లో [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) install చేయాలి.
* మీ environment లో [docker](https://docs.docker.com/get-docker/) installed ఉండాలి.

### EC2 పై EKS cluster Create చేయండి

ఈ recipe లో మన demo application EKS పై run అవుతుంది. Existing EKS cluster ఉపయోగించవచ్చు లేదా [cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml) ఉపయోగించి create చేయవచ్చు.

ఈ template రెండు EC2 `t2.large` nodes తో new cluster create చేస్తుంది.

Template file edit చేసి `<YOUR_REGION>` ను [AMP కోసం supported regions](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions) లో ఒకదానికి set చేయండి.

మీ session లో `<YOUR_REGION>` overwrite చేయండి, ఉదాహరణకు bash లో:
```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

ఈ command ఉపయోగించి మీ cluster create చేయండి.
```
eksctl create cluster -f cluster-config.yaml
```

### ECR repository Set up చేయండి

మన application EKS కు deploy చేయడానికి container registry అవసరం. మీ account లో new ECR registry create చేయడానికి ఈ command ఉపయోగించవచ్చు. `<YOUR_REGION>` కూడా set చేయండి.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### AMP Set up చేయండి


AWS CLI ఉపయోగించి workspace create చేయండి
```
aws amp create-workspace --alias prometheus-sample-app
```

Workspace created అయిందో verify చేయండి:
```
aws amp list-workspaces
```

:::info
    మరింత details కోసం [AMP Getting started](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) guide check చేయండి.
:::

### ADOT Collector Set up చేయండి

[adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml) download చేసి తదుపరి steps లో describe చేసిన parameters తో ఈ YAML doc edit చేయండి.

ఈ example లో, ADOT Collector configuration ఏ target endpoints scrape చేయాలో చెప్పడానికి annotation `(scrape=true)` ఉపయోగిస్తుంది. ఇది ADOT Collector మీ cluster లో `kube-system` endpoints నుండి sample app endpoint distinguish చేయడానికి allow చేస్తుంది. Different sample app scrape చేయాలనుకుంటే re-label configurations నుండి ఇది remove చేయవచ్చు.

మీ environment కోసం downloaded file edit చేయడానికి ఈ steps ఉపయోగించండి:

1\. `<YOUR_REGION>` ను మీ current region తో replace చేయండి.

2\. `<YOUR_ENDPOINT>` ను మీ workspace యొక్క remote write URL తో replace చేయండి.

ఈ queries execute చేయడం ద్వారా మీ AMP remote write URL endpoint get చేయండి.

మొదట, workspace ID get చేయండి:

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

ఇప్పుడు మీ workspace కోసం remote write URL endpoint URL get చేయండి:

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    `YOUR_ENDPOINT` actually remote write URL అని నిర్ధారించుకోండి, అంటే URL `/api/v1/remote_write` తో end కావాలి.
:::
Deployment file create చేసిన తర్వాత ఈ command ఉపయోగించి ఇది మన cluster కు apply చేయవచ్చు:

```
kubectl apply -f adot-collector-ec2.yaml
```

:::info
    మరింత సమాచారం కోసం [AWS Distro for OpenTelemetry (ADOT) Collector Setup](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup) check చేయండి.
:::

### AMG Set up చేయండి

[Amazon Managed Grafana - Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) guide ఉపయోగించి new AMG workspace setup చేయండి.

Creation సమయంలో "Amazon Managed Service for Prometheus" ను datasource గా add చేయండి.

![Service managed permission settings](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)


## Application

ఈ recipe లో AWS Observability repository నుండి [sample application](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus) ఉపయోగిస్తాము.

ఈ Prometheus sample app అన్ని నాలుగు Prometheus metric types (counter, gauge, histogram, summary) generate చేస్తుంది మరియు `/metrics` endpoint వద్ద expose చేస్తుంది.

### Container image Build చేయండి

Container image build చేయడానికి, మొదట Git repository clone చేసి ఈ విధంగా directory change చేయండి:

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

మొదట, region (above already done కాకపోతే) మరియు account ID మీ case లో applicable అయినదానికి set చేయండి. `<YOUR_REGION>` ను మీ current region తో replace చేయండి. ఉదాహరణకు, Bash shell లో:

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

తర్వాత, container image build చేయండి:

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    Proxy.golang.org i/o timeout వల్ల మీ environment లో `go mod` fail అయితే, Dockerfile edit చేయడం ద్వారా go mod proxy bypass చేయవచ్చు.

    Docker file లో ఈ line change చేయండి:
    ```
    RUN GO111MODULE=on go mod download
    ```
    ఇలా:
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::
ఇప్పుడు container image ను earlier create చేసిన ECR repo కు push చేయవచ్చు.

దాని కోసం, మొదట default ECR registry లోకి log in చేయండి:

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

చివరగా, container image ను మీరు create చేసిన ECR repository కు push చేయండి:

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

### Sample app Deploy చేయండి

మీ ECR image path contain చేయడానికి [prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) edit చేయండి. అంటే, file లో `ACCOUNTID` మరియు `AWS_DEFAULT_REGION` ను మీ own values తో replace చేయండి:

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

ఇప్పుడు sample app ను మీ cluster కు deploy చేయవచ్చు:

```
kubectl apply -f prometheus-sample-app.yaml
```

## End-to-end

ఇప్పుడు infrastructure మరియు application place లో ఉన్నాయి, EKS లో run అవుతున్న Go app నుండి AMP కు metrics send చేయడం మరియు AMG లో visualize చేయడం test చేద్దాం.

### మీ pipeline work అవుతుందో verify చేయండి

ADOT collector sample app pod scrape చేస్తుందో మరియు metrics AMP లోకి ingest చేస్తుందో verify చేయడానికి, collector logs చూద్దాం.

ADOT collector logs follow చేయడానికి ఈ command enter చేయండి:

```
kubectl -n adot-col logs adot-collector -f
```

Sample app నుండి scraped metrics యొక్క logs లో ఒక example output ఇలా కనిపించాలి:

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
    AMP metrics receive చేసిందో verify చేయడానికి, [awscurl](https://github.com/okigan/awscurl) ఉపయోగించవచ్చు. ఈ tool command line నుండి AWS Sigv4 authentication తో HTTP requests send చేయడానికి enable చేస్తుంది, కాబట్టి AMP నుండి query చేయడానికి correct permissions తో locally AWS credentials set up చేసి ఉండాలి. ఈ command లో `$AMP_ENDPOINT` ను మీ AMP workspace endpoint తో replace చేయండి:

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### Grafana dashboard Create చేయండి

Sample app కోసం [prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) ద్వారా available example dashboard import చేయవచ్చు ఇది ఈ విధంగా కనిపిస్తుంది:

![AMG లో Prometheus sample app dashboard యొక్క Screen shot](../images/amg-prom-sample-app-dashboard.png)

ఇంకా, Amazon Managed Grafana లో మీ own dashboard create చేయడానికి ఈ guides ఉపయోగించండి:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Dashboards create చేయడానికి ఉత్తమ పద్ధతులు](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

అంతే, అభినందనలు metrics ingest చేయడానికి EC2 పై EKS లో ADOT ఎలా ఉపయోగించాలో నేర్చుకున్నారు.

## Cleanup

1. Resources మరియు cluster remove చేయండి
```
kubectl delete all --all
eksctl delete cluster --name amp-eks-ec2
```
2. AMP workspace remove చేయండి
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM role remove చేయండి
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. Console నుండి remove చేయడం ద్వారా AMG workspace remove చేయండి.
