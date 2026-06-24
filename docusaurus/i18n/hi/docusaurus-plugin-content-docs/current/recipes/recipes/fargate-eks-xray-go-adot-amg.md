# Fargate पर EKS में AWS X-Ray के साथ AWS Distro for OpenTelemetry का उपयोग

इस रेसिपी में हम आपको दिखाते हैं कि कैसे instrument a sample Go application
and use [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) to 
ingest traces into [AWS X-Ray](https://aws.amazon.com/xray/) and visualize
the traces in [Amazon Managed Grafana](https://aws.amazon.com/grafana/).

We will be setting up an [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)
on [AWS Fargate](https://aws.amazon.com/fargate/) cluster and use an
[Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) repository
to demonstrate a complete scenario.

:::note
    इस गाइड को पूरा करने में लगभग 1 hour लगेंगे।
:::
## इंफ्रास्ट्रक्चर
निम्नलिखित अनुभाग में हम इस रेसिपी के लिए इंफ्रास्ट्रक्चर सेट करेंगे। 

### आर्किटेक्चर

The ADOT pipeline enables us to use the 
[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) to 
collect traces from an instrumented app and ingest them into X-Ray:

![ADOT default pipeline](../images/adot-default-pipeline.png)


### पूर्वापेक्षाएँ

* The AWS CLI is [installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) in your environment.
* You need to install the [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) command in your environment.
* You need to install [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) in your environment. 
* You have [Docker](https://docs.docker.com/get-docker/) installed into your environment.
* You have the [aws-ऑब्ज़र्वेबिलिटी/aws-o11y-recipes](https://github.com/aws-observability/aws-o11y-recipes/)
  repo cloned into your local environment.

### Fargate पर EKS क्लस्टर बनाएं

Our demo application is a Kubernetes app that we will run in an EKS on Fargate
cluster. So, first create an EKS cluster using the
provided [cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml).

निम्नलिखित कमांड का उपयोग करके अपना क्लस्टर बनाएं:

```
eksctl create cluster -f cluster-config.yaml
```

### ECR रिपॉजिटरी बनाएं

EKS पर हमारे एप्लिकेशन को डिप्लॉय करने के लिए हमें एक कंटेनर repository. We
will use the private ECR registry, but you can also use ECR Public, if you
want to share the container image.

First, set the environment variables, such as shown here (substitute for your
region):

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

You can use the following command to create a new ECR repository in your account: 

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```

### ADOT Collector सेट करें

Download [adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) 
and edit this YAML doc with the parameters described in the next steps.


```
kubectl apply -f adot-collector-fargate.yaml
```

### Managed Grafana सेट करें

Set up a new workspace using the 
[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) guide
and add [X-Ray as a data source](https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html).

## सिग्नल जनरेटर

We will be using `ho11y`, a synthetic signal generator available
via the [sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y)
of the recipes repository. So, if you haven't cloned the repo into your local
environment, do now:

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```

### कंटेनर इमेज बिल्ड करें
Make sure that your `ACCOUNTID` and `REGION` environment variables are set, 
for example:

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```
To build the `ho11y` container image, first change into the `./sandbox/ho11y/`
directory and build the container image :

:::note
    The following build step assumes that the Docker daemon or an equivalent OCI image 
    build tool is running.
:::

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### कंटेनर इमेज पुश करें
Next, you can push the container image to the ECR repo you created earlier on.
उसके लिए, पहले डिफ़ॉल्ट ECR रजिस्ट्री में लॉग इन करें:

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

और अंत में, ऊपर बनाई गई ECR रिपॉजिटरी में कंटेनर इमेज पुश करें:

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### सिग्नल जनरेटर डिप्लॉय करें

Edit [x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml)
to contain your ECR image path. That is, replace `ACCOUNTID` and `REGION` in the
file with your own values (overall, in three locations):

``` 
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

अब आप निम्नलिखित का उपयोग करके अपने क्लस्टर में सैंपल ऐप डिप्लॉय कर सकते हैं:

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```

## एंड-टू-एंड

अब जब आपके पास इंफ्रास्ट्रक्चर और एप्लिकेशन तैयार हैं, हम
सेटअप का परीक्षण करेंगे, sending traces from `ho11y` running in EKS to X-Ray and
visualize it in AMG.

### पाइपलाइन सत्यापित करें

To verify if the ADOT collector is ingesting traces from `ho11y`, we make
one of the services available locally and invoke it.

First, let's forward traffic as so:

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

With above command, the `frontend` microservice (a `ho11y` instance configured
to talk to two other `ho11y` instances) is available in your local environment
and you can invoke it as follows (triggering the creation of traces):

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

:::tip
    If you want to automate the invocation, you can wrap the `curl` call into
    a `while true` loop.
:::
To verify our setup, visit the [X-Ray view in CloudWatch](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/)
where you should see something like shown below:

![Screen shot of the X-Ray console in CW](../images/x-ray-cw-ho11y.png)

Now that we have the signal generator set up and active and the OpenTelemetry
pipeline set up, let's see how to consume the traces in Grafana.

### Grafana डैशबोर्ड

आप एक उदाहरण डैशबोर्ड आयात कर सकते हैं, जो उपलब्ध है
[x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json)
जो इस प्रकार दिखता है:

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-dashboard.png)

Further, when you click on any of the traces in the lower `downstreams` panel,
you can dive into it and view it in the "Explore" tab like so:

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-explore.png)

यहाँ से, आप निम्नलिखित गाइड का उपयोग करके अपना डैशबोर्ड बना सकते हैं
Amazon Managed Grafana में:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [बेस्ट प्रैक्टिसेज़ for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

बस इतना ही, बधाई हो आपने सीख लिया कि कैसे उपयोग करें ADOT in EKS on Fargate to 
ingest traces.

## सफाई

पहले Kubernetes संसाधन हटाएं और EKS क्लस्टर को नष्ट करें:

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```
अंत में, AWS कंसोल के माध्यम से Amazon Managed Grafana वर्कस्पेस हटाएं। 
