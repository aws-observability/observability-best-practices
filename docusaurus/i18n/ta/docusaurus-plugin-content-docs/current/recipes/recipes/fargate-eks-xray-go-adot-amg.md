# Fargate இல் EKS உடன் AWS Distro for OpenTelemetry ஐ AWS X-Ray உடன் பயன்படுத்துதல்

இந்த செய்முறையில், ஒரு மாதிரி Go அப்ளிகேஷனை கருவியாக்கம் செய்வது மற்றும் [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) ஐ பயன்படுத்தி [AWS X-Ray](https://aws.amazon.com/xray/) க்கு ட்ரேஸ்களை உள்ளெடுப்பது மற்றும் [Amazon Managed Grafana](https://aws.amazon.com/grafana/) இல் ட்ரேஸ்களை காட்சிப்படுத்துவது எப்படி என்று காட்டுவோம்.

[AWS Fargate](https://aws.amazon.com/fargate/) கிளஸ்டரில் [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) ஐ அமைப்போம் மற்றும் முழுமையான சூழ்நிலையை நிரூபிக்க [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) repository ஐ பயன்படுத்துவோம்.

:::note
    இந்த வழிகாட்டியை முடிக்க தோராயமாக 1 மணி நேரம் ஆகும்.
:::
## உள்கட்டமைப்பு
பின்வரும் பிரிவில் இந்த செய்முறைக்கான உள்கட்டமைப்பை அமைப்போம்.

### கட்டமைப்பு

ADOT pipeline [ADOT Collector](https://github.com/aws-observability/aws-otel-collector) ஐ பயன்படுத்தி கருவியாக்கப்பட்ட அப்ளிகேஷனிலிருந்து ட்ரேஸ்களை சேகரித்து X-Ray க்கு உள்ளெடுக்க உதவுகிறது:

![ADOT default pipeline](../images/adot-default-pipeline.png)


### முன்நிபந்தனைகள்

* AWS CLI உங்கள் சூழலில் [நிறுவப்பட்டு](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) [கட்டமைக்கப்பட்டிருக்கிறது](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
* உங்கள் சூழலில் [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) கட்டளையை நிறுவ வேண்டும்.
* உங்கள் சூழலில் [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) ஐ நிறுவ வேண்டும்.
* உங்கள் சூழலில் [Docker](https://docs.docker.com/get-docker/) நிறுவப்பட்டிருக்கிறது.
* [aws-observability/aws-o11y-recipes](https://github.com/aws-observability/aws-o11y-recipes/) repo உங்கள் உள்ளூர் சூழலில் குளோன் செய்யப்பட்டுள்ளது.

### Fargate இல் EKS கிளஸ்டரை உருவாக்குதல்

எங்கள் demo அப்ளிகேஷன் ஒரு Kubernetes app ஆகும், இதை Fargate இல் EKS கிளஸ்டரில் இயக்குவோம். வழங்கப்பட்ட [cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml) ஐ பயன்படுத்தி முதலில் EKS கிளஸ்டரை உருவாக்கவும்.

பின்வரும் கட்டளையைப் பயன்படுத்தி உங்கள் கிளஸ்டரை உருவாக்கவும்:

```
eksctl create cluster -f cluster-config.yaml
```

### ECR repository ஐ உருவாக்குதல்

எங்கள் அப்ளிகேஷனை EKS க்கு டிப்ளாய் செய்ய ஒரு கண்டெய்னர் repository தேவை. நாம் private ECR registry ஐ பயன்படுத்துவோம்.

முதலில், சூழல் மாறிகளை அமைக்கவும்:

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

உங்கள் கணக்கில் புதிய ECR repository ஐ உருவாக்க பின்வரும் கட்டளையைப் பயன்படுத்தலாம்:

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```

### ADOT Collector ஐ அமைத்தல்

[adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) ஐ பதிவிறக்கி, அடுத்த படிகளில் விவரிக்கப்பட்டுள்ள அளவுருக்களுடன் இந்த YAML doc ஐ திருத்தவும்.

```
kubectl apply -f adot-collector-fargate.yaml
```

### Managed Grafana ஐ அமைத்தல்

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) வழிகாட்டியைப் பயன்படுத்தி புதிய workspace ஐ அமைத்து [X-Ray ஐ data source ஆக](https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html) சேர்க்கவும்.

## சிக்னல் ஜெனரேட்டர்

`ho11y` ஐ பயன்படுத்துவோம், இது recipes repository இன் [sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y) வழியாக கிடைக்கும் ஒரு செயற்கை சிக்னல் ஜெனரேட்டர்.

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```

### கண்டெய்னர் இமேஜை உருவாக்குதல்

உங்கள் `ACCOUNTID` மற்றும் `REGION` சூழல் மாறிகள் அமைக்கப்பட்டிருப்பதை உறுதிப்படுத்தவும்:

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

`ho11y` கண்டெய்னர் இமேஜை உருவாக்க, முதலில் `./sandbox/ho11y/` கோப்பகத்திற்கு மாறி கண்டெய்னர் இமேஜை உருவாக்கவும்:

:::note
    பின்வரும் build படி Docker daemon அல்லது சமமான OCI image build கருவி இயங்குவதாக கருதுகிறது.
:::

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### கண்டெய்னர் இமேஜை push செய்தல்

அடுத்து, நீங்கள் முன்னர் உருவாக்கிய ECR repo க்கு கண்டெய்னர் இமேஜை push செய்யலாம். இதற்கு, முதலில் இயல்புநிலை ECR registry க்கு உள்நுழையவும்:

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

இறுதியாக, நீங்கள் உருவாக்கிய ECR repository க்கு கண்டெய்னர் இமேஜை push செய்யவும்:

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### சிக்னல் ஜெனரேட்டரை டிப்ளாய் செய்தல்

[x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml) ஐ உங்கள் ECR image path ஐ கொண்டிருக்கும்படி திருத்தவும். அதாவது, கோப்பில் `ACCOUNTID` மற்றும் `REGION` ஐ உங்கள் சொந்த மதிப்புகளுடன் மாற்றவும்:

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

இப்போது உங்கள் கிளஸ்டருக்கு sample app ஐ டிப்ளாய் செய்யலாம்:

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```

## முழுமையான பரிசோதனை

இப்போது உள்கட்டமைப்பு மற்றும் அப்ளிகேஷன் இடத்தில் இருக்கும்போது, EKS இல் இயங்கும் `ho11y` இலிருந்து X-Ray க்கு ட்ரேஸ்களை அனுப்பி AMG இல் காட்சிப்படுத்துவதை சோதிப்போம்.

### Pipeline ஐ சரிபார்த்தல்

ADOT collector `ho11y` இலிருந்து ட்ரேஸ்களை உள்ளெடுக்கிறதா என சரிபார்க்க, சேவைகளில் ஒன்றை உள்ளூரில் கிடைக்கச் செய்து அழைப்போம்.

முதலில், ட்ராஃபிக்கை forward செய்யவும்:

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

மேலே உள்ள கட்டளையுடன், `frontend` மைக்ரோசர்வீஸ் உங்கள் உள்ளூர் சூழலில் கிடைக்கிறது மற்றும் பின்வருமாறு அழைக்கலாம் (ட்ரேஸ்கள் உருவாக்கப்படுவதை தூண்டுகிறது):

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

:::tip
    அழைப்பை தானியங்கு செய்ய விரும்பினால், `curl` அழைப்பை `while true` loop இல் wrap செய்யலாம்.
:::

எங்கள் அமைப்பை சரிபார்க்க, [CloudWatch இல் X-Ray பார்வையை](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/) பார்க்கவும்:

![X-Ray console in CW இன் screen shot](../images/x-ray-cw-ho11y.png)

இப்போது சிக்னல் ஜெனரேட்டர் அமைக்கப்பட்டு செயலில் உள்ளது மற்றும் OpenTelemetry pipeline அமைக்கப்பட்டுள்ளது, Grafana இல் ட்ரேஸ்களை எவ்வாறு பயன்படுத்துவது என்று பார்ப்போம்.

### Grafana டாஷ்போர்டு

நீங்கள் ஒரு உதாரண டாஷ்போர்டை import செய்யலாம், இது [x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json) வழியாக கிடைக்கிறது:

![AMG இல் X-Ray dashboard இன் screen shot](../images/x-ray-amg-ho11y-dashboard.png)

மேலும், கீழே உள்ள `downstreams` panel இல் ஏதேனும் ட்ரேஸ்களை கிளிக் செய்யும்போது, "Explore" tab இல் பார்க்கலாம்:

![AMG இல் X-Ray dashboard இன் screen shot](../images/x-ray-amg-ho11y-explore.png)

இங்கிருந்து, Amazon Managed Grafana இல் உங்கள் சொந்த டாஷ்போர்டை உருவாக்க பின்வரும் வழிகாட்டிகளைப் பயன்படுத்தலாம்:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Best practices for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

அவ்வளவுதான், Fargate இல் EKS இல் ADOT ஐ பயன்படுத்தி ட்ரேஸ்களை உள்ளெடுப்பது எப்படி என்று கற்றுக்கொண்டீர்கள்.

## சுத்தப்படுத்துதல்

முதலில் Kubernetes ஆதாரங்களை அகற்றி EKS கிளஸ்டரை அழிக்கவும்:

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```
இறுதியாக, AWS கன்சோல் வழியாக Amazon Managed Grafana workspace ஐ அகற்றவும்.
