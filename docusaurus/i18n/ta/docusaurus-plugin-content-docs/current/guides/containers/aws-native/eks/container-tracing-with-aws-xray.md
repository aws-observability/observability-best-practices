# AWS X-Ray மூலம் கண்டெய்னர் ட்ரேசிங்

Observability சிறந்த நடைமுறைகள் வழிகாட்டியின் இந்தப் பிரிவில், AWS X-Ray மூலம் கண்டெய்னர் ட்ரேசிங் தொடர்பான பின்வரும் தலைப்புகளை ஆழமாக ஆராய்வோம்:

* AWS X-Ray அறிமுகம்
* AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி traces சேகரிப்பு
* முடிவுரை

### அறிமுகம்

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) என்பது உங்கள் application சேவை செய்யும் கோரிக்கைகள் பற்றிய தரவுகளைச் சேகரிக்கும் ஒரு சேவையாகும், மேலும் அந்தத் தரவைப் பார்க்கவும், வடிகட்டவும், சிக்கல்களையும் மேம்படுத்தல் வாய்ப்புகளையும் கண்டறிய நுண்ணறிவுகளைப் பெறவும் பயன்படுத்தக்கூடிய கருவிகளை வழங்குகிறது. உங்கள் application க்கு ட்ரேஸ் செய்யப்பட்ட ஏதேனும் கோரிக்கைக்கு, கோரிக்கை மற்றும் பதில் பற்றிய விரிவான தகவல்களை மட்டுமல்லாமல், உங்கள் application downstream AWS resources, microservices, databases மற்றும் web APIs க்கு செய்யும் அழைப்புகள் பற்றிய விரிவான தகவல்களையும் பார்க்கலாம்.

உங்கள் application ஐ instrument செய்வது என்பது, உள்வரும் மற்றும் வெளிச்செல்லும் கோரிக்கைகள் மற்றும் உங்கள் application க்குள் உள்ள பிற நிகழ்வுகளுக்கான trace தரவுகளை, ஒவ்வொரு கோரிக்கைக்கான metadata உடன் அனுப்புவதை உள்ளடக்குகிறது. பல instrumentation சூழ்நிலைகளுக்கு configuration மாற்றங்கள் மட்டுமே தேவை. உதாரணமாக, உங்கள் Java application செய்யும் அனைத்து உள்வரும் HTTP கோரிக்கைகள் மற்றும் AWS services க்கான downstream அழைப்புகளை instrument செய்யலாம். X-Ray tracing க்காக உங்கள் application ஐ instrument செய்ய பல SDKs, agents மற்றும் கருவிகள் பயன்படுத்தப்படலாம். மேலும் தகவலுக்கு [உங்கள் application ஐ instrument செய்தல்](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) பார்க்கவும்.

AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி உங்கள் Amazon EKS cluster இலிருந்து traces சேகரிப்பதன் மூலம் containerized application tracing பற்றி கற்றுக்கொள்வோம்.

### AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி traces சேகரிப்பு

[AWS X-Ray](https://aws.amazon.com/xray/) application-tracing செயல்பாட்டை வழங்குகிறது, deploy செய்யப்பட்ட அனைத்து microservices பற்றிய ஆழமான நுண்ணறிவுகளை அளிக்கிறது. X-Ray மூலம், ஒவ்வொரு கோரிக்கையும் சம்பந்தப்பட்ட microservices வழியாக பாயும்போது ட்ரேஸ் செய்யலாம். இது உங்கள் DevOps குழுக்களுக்கு உங்கள் services எவ்வாறு தங்கள் peer services உடன் தொடர்புகொள்கின்றன என்பதைப் புரிந்துகொள்ளவும், சிக்கல்களை மிக வேகமாக பகுப்பாய்வு செய்து debug செய்யவும் தேவையான நுண்ணறிவுகளை வழங்குகிறது.

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) என்பது OpenTelemetry project இன் பாதுகாப்பான, AWS-ஆதரவு பெற்ற distribution ஆகும். பயனர்கள் தங்கள் applications ஐ ஒரு முறை மட்டும் instrument செய்து, ADOT பயன்படுத்தி, தொடர்புடைய metrics மற்றும் traces ஐ பல monitoring தீர்வுகளுக்கு அனுப்பலாம். Amazon EKS இப்போது cluster இயங்கிய பிறகு எந்த நேரத்திலும் ADOT ஐ add-on ஆக இயக்க அனுமதிக்கிறது. ADOT add-on சமீபத்திய security patches மற்றும் bug fixes ஐ உள்ளடக்கியது மற்றும் Amazon EKS உடன் வேலை செய்ய AWS ஆல் சரிபார்க்கப்பட்டது.

ADOT add-on என்பது Kubernetes Operator இன் ஒரு செயல்படுத்தலாகும், இது custom resources பயன்படுத்தி applications மற்றும் அவற்றின் components ஐ நிர்வகிக்கும் Kubernetes இன் ஒரு software extension ஆகும். இந்த add-on OpenTelemetryCollector என்ற custom resource ஐ கண்காணிக்கிறது மற்றும் custom resource இல் குறிப்பிடப்பட்ட configuration settings அடிப்படையில் ADOT Collector இன் lifecycle ஐ நிர்வகிக்கிறது.

ADOT Collector இல் receiver, processor மற்றும் exporter ஆகிய மூன்று முக்கிய வகை components ஐ உள்ளடக்கிய pipeline என்ற கருத்துரு உள்ளது. [receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) என்பது collector க்கு தரவு எவ்வாறு வருகிறது என்பதாகும். இது ஒரு குறிப்பிட்ட வடிவத்தில் தரவை ஏற்றுக்கொண்டு, அதை internal வடிவத்திற்கு மாற்றி, pipeline இல் வரையறுக்கப்பட்ட [processors](https://opentelemetry.io/docs/collector/configuration/#processors) மற்றும் [exporters](https://opentelemetry.io/docs/collector/configuration/#exporters) க்கு அனுப்புகிறது. இது pull அல்லது push அடிப்படையிலானதாக இருக்கலாம். processor என்பது பெறுதலுக்கும் export செய்வதற்கும் இடையில் batching, filtering மற்றும் transformations போன்ற பணிகளைச் செய்ய பயன்படுத்தப்படும் ஒரு விருப்பத் தேர்வு component ஆகும். exporter என்பது metrics, logs அல்லது traces ஐ எந்த இடத்திற்கு அனுப்ப வேண்டும் என்பதை தீர்மானிக்கப் பயன்படுகிறது. collector architecture Kubernetes YAML manifest மூலம் இத்தகைய pipelines இன் பல instances ஐ அமைக்க அனுமதிக்கிறது.

பின்வரும் வரைபடம் AWS X-Ray க்கு telemetry தரவை அனுப்பும் traces pipeline உடன் கட்டமைக்கப்பட்ட ADOT Collector ஐ விளக்குகிறது. traces pipeline [AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) மற்றும் [AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) இன் ஒரு instance ஐ உள்ளடக்கியது மற்றும் AWS X-Ray க்கு traces ஐ அனுப்புகிறது.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*படம்: AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி traces சேகரிப்பு.*

EKS cluster இல் ADOT add-on ஐ நிறுவுதல் மற்றும் workloads இலிருந்து telemetry தரவை சேகரிப்பது பற்றிய விவரங்களை ஆராய்வோம். ADOT add-on ஐ நிறுவுவதற்கு முன் தேவையான முன்நிபந்தனைகளின் பட்டியல் கீழே உள்ளது.

* Kubernetes version 1.19 அல்லது அதற்கு மேல் ஆதரிக்கும் EKS cluster. [இங்கு விவரிக்கப்பட்ட அணுகுமுறைகளில்](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) ஒன்றைப் பயன்படுத்தி EKS cluster ஐ உருவாக்கலாம்.
* cluster இல் ஏற்கனவே நிறுவப்படவில்லை எனில் [Certificate Manager](https://cert-manager.io/). [இந்த ஆவணத்தின்](https://cert-manager.io/docs/installation/) படி default configuration உடன் நிறுவலாம்.
* உங்கள் cluster இல் ADOT add-on ஐ நிறுவ EKS add-ons க்கான Kubernetes RBAC அனுமதிகள். kubectl போன்ற CLI கருவியைப் பயன்படுத்தி [இந்த YAML இல் உள்ள settings](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml) ஐ cluster க்கு apply செய்வதன் மூலம் இதைச் செய்யலாம்.

பின்வரும் command ஐப் பயன்படுத்தி பல்வேறு EKS versions க்கு இயக்கப்பட்ட add-ons பட்டியலைச் சரிபார்க்கலாம்:

`aws eks describe-addon-versions`

JSON output கீழே காட்டப்பட்டுள்ளபடி மற்ற add-ons உடன் ADOT add-on ஐ பட்டியலிட வேண்டும். EKS cluster உருவாக்கப்படும்போது, EKS add-ons எந்த add-on ஐயும் தானாக நிறுவாது என்பதைக் கவனிக்கவும்.


```
{
   "addonName":"adot",
   "type":"observability",
   "addonVersions":[
      {
         "addonVersion":"v0.45.0-eksbuild.1",
         "architecture":[
            "amd64"
         ],
         "compatibilities":[
            {
               "clusterVersion":"1.22",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.21",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.20",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.19",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            }
         ]
      }
   ]
}
```

அடுத்து, பின்வரும் command ஐப் பயன்படுத்தி ADOT add-on ஐ நிறுவலாம்:

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

version string முன்னர் காட்டப்பட்ட output இல் உள்ள *addonVersion* field இன் மதிப்புடன் பொருந்த வேண்டும். இந்த command வெற்றிகரமாக இயக்கப்பட்டதன் output பின்வருமாறு:

```
{
    "addon": {
        "addonName": "adot",
        "clusterName": "k8s-production-cluster",
        "status": "ACTIVE",
        "addonVersion": "v0.45.0-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",
        "createdAt": "2022-04-04T10:36:56.966000+05:30",
        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",
        "tags": {}
    }
}
```

அடுத்த படிக்கு செல்வதற்கு முன் add-on ACTIVE நிலையில் இருக்கும் வரை காத்திருக்கவும். add-on இன் நிலையை பின்வரும் command ஐப் பயன்படுத்தி சரிபார்க்கலாம்:

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### ADOT Collector ஐ deploy செய்தல்

ADOT add-on என்பது Kubernetes Operator இன் ஒரு செயல்படுத்தலாகும், இது custom resources பயன்படுத்தி applications மற்றும் அவற்றின் components ஐ நிர்வகிக்கும் Kubernetes இன் ஒரு software extension ஆகும். இந்த add-on OpenTelemetryCollector என்ற custom resource ஐ கண்காணிக்கிறது மற்றும் custom resource இல் குறிப்பிடப்பட்ட configuration settings அடிப்படையில் ADOT Collector இன் lifecycle ஐ நிர்வகிக்கிறது. பின்வரும் படம் இது எவ்வாறு செயல்படுகிறது என்பதை விளக்குகிறது.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*படம்: ADOT Collector ஐ deploy செய்தல்.*

அடுத்து, ADOT Collector ஐ எவ்வாறு deploy செய்வது என்பதைப் பார்ப்போம். [இங்குள்ள YAML configuration file](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) ஒரு OpenTelemetryCollector custom resource ஐ வரையறுக்கிறது. EKS cluster க்கு deploy செய்யப்படும்போது, இது ADOT add-on ஐ தூண்டி, மேலே உள்ள முதல் விளக்கப்படத்தில் காட்டப்பட்டுள்ள components உடன் traces மற்றும் metrics pipelines ஐ உள்ளடக்கிய ADOT Collector ஐ provision செய்யும். collector `aws-otel-eks` namespace இல் `${custom-resource-name}-collector` என்ற பெயருடன் Kubernetes Deployment ஆக launch ஆகும். அதே பெயரில் ஒரு ClusterIP service யும் launch ஆகும். இந்த collector இன் pipelines ஐ உருவாக்கும் தனிப்பட்ட components ஐ ஆராய்வோம்.

traces pipeline இல் உள்ள AWS X-Ray Receiver [X-Ray Segment format](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html) இல் segments அல்லது spans ஐ ஏற்றுக்கொள்கிறது, இது X-Ray SDK மூலம் instrument செய்யப்பட்ட microservices அனுப்பிய segments ஐ செயலாக்க உதவுகிறது. இது UDP port 2000 இல் traffic ஐ listen செய்ய கட்டமைக்கப்பட்டுள்ளது மற்றும் Cluster IP service ஆக expose செய்யப்பட்டுள்ளது. இந்த configuration படி, இந்த receiver க்கு trace தரவை அனுப்ப விரும்பும் workloads `AWS_XRAY_DAEMON_ADDRESS` environment variable ஐ `observability-collector.aws-otel-eks:2000` ஆக அமைக்க வேண்டும். exporter [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API பயன்படுத்தி இந்த segments ஐ நேரடியாக X-Ray க்கு அனுப்புகிறது.

ADOT Collector `aws-otel-collector` என்ற Kubernetes service account இன் identity கீழ் launch ஆகும்படி கட்டமைக்கப்பட்டுள்ளது, இதற்கு ClusterRoleBinding மற்றும் ClusterRole மூலம் அனுமதிகள் வழங்கப்படுகின்றன, இது [configuration](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) இலும் காட்டப்பட்டுள்ளது. exporters X-Ray க்கு தரவை அனுப்ப IAM அனுமதிகள் தேவை. EKS ஆதரிக்கும் [service accounts க்கான IAM roles](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) அம்சத்தைப் பயன்படுத்தி service account ஐ IAM role உடன் இணைப்பதன் மூலம் இது செய்யப்படுகிறது. IAM role AWSXRayDaemonWriteAccess போன்ற AWS-managed policies உடன் இணைக்கப்பட வேண்டும். CLUSTER_NAME மற்றும் REGION variables ஐ அமைத்த பிறகு, [இங்குள்ள helper script](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh) ஐப் பயன்படுத்தி இந்த அனுமதிகள் வழங்கப்பட்ட மற்றும் `aws-otel-collector` service account உடன் இணைக்கப்பட்ட `EKS-ADOT-ServiceAccount-Role` என்ற IAM role ஐ உருவாக்கலாம்.

#### Traces சேகரிப்பின் end-to-end test

இப்போது இவை அனைத்தையும் ஒன்றாக இணைத்து EKS cluster இல் deploy செய்யப்பட்ட workloads இலிருந்து traces சேகரிப்பை test செய்வோம். பின்வரும் விளக்கப்படம் இந்த test க்குப் பயன்படுத்தப்பட்ட அமைப்பைக் காட்டுகிறது. இது REST APIs தொகுப்பை expose செய்து S3 உடன் தொடர்புகொள்ளும் front-end service மற்றும் Aurora PostgreSQL database instance உடன் தொடர்புகொள்ளும் datastore service ஐ உள்ளடக்கியது. services X-Ray SDK மூலம் instrument செய்யப்பட்டுள்ளன. ADOT Collector கடந்த பிரிவில் விவாதிக்கப்பட்ட YAML manifest ஐப் பயன்படுத்தி OpenTelemetryCollector custom resource ஐ deploy செய்வதன் மூலம் Deployment mode இல் launch செய்யப்படுகிறது. Postman client front-end service ஐ இலக்காகக் கொண்ட வெளிப்புற traffic generator ஆகப் பயன்படுத்தப்படுகிறது.

![Tracing-3](../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*படம்: Traces சேகரிப்பின் end-to-end test.*

பின்வரும் படம் services இலிருந்து capture செய்யப்பட்ட segment தரவைப் பயன்படுத்தி X-Ray உருவாக்கிய service graph ஐக் காட்டுகிறது, ஒவ்வொரு segment க்கான சராசரி response latency உடன்.

![Tracing-4](../../../../images/Containers/aws-native/eks/tracing-4.jpg)

*படம்: CloudWatch Service Map console.*

AWS X-Ray க்கு traces அனுப்பும் OTLP Receiver மற்றும் AWS X-Ray Exporter உடன் கூடிய [Traces pipeline](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) க்கான OpenTelemetryCollector custom resource definitions ஐ சரிபார்க்கவும். AWS X-Ray உடன் ADOT Collector ஐப் பயன்படுத்த விரும்பும் வாடிக்கையாளர்கள் இந்த configuration templates உடன் தொடங்கி, placeholder variables ஐ தங்கள் இலக்கு சூழல்களின் அடிப்படையில் மதிப்புகளால் மாற்றி, ADOT க்கான EKS add-on பயன்படுத்தி தங்கள் Amazon EKS clusters க்கு collector ஐ விரைவாக deploy செய்யலாம்.


### EKS Blueprints பயன்படுத்தி AWS X-Ray மூலம் கண்டெய்னர் ட்ரேசிங் அமைத்தல்

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) என்பது accounts மற்றும் regions முழுவதும் நிலையான, முழுமையான EKS clusters ஐ configure செய்து deploy செய்ய உதவும் Infrastructure as Code (IaC) modules தொகுப்பாகும். EKS Blueprints பயன்படுத்தி [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) மற்றும் Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD போன்ற பிரபலமான open-source add-ons உடன் EKS cluster ஐ எளிதாக bootstrap செய்யலாம். EKS Blueprints இரண்டு பிரபலமான IaC frameworks இல் செயல்படுத்தப்பட்டுள்ளது - [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) மற்றும் [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints), இவை infrastructure deployments ஐ automate செய்ய உதவுகின்றன.

EKS Blueprints பயன்படுத்தி உங்கள் Amazon EKS Cluster உருவாக்கும் செயல்முறையின் ஒரு பகுதியாக, containerized applications மற்றும் micro-services இலிருந்து metrics மற்றும் logs ஐ சேகரிக்க, தொகுக்க மற்றும் சுருக்கமாகக் காட்ட Day 2 operational கருவியாக AWS X-Ray ஐ Amazon CloudWatch console க்கு அமைக்கலாம்.

## முடிவுரை

Observability சிறந்த நடைமுறைகள் வழிகாட்டியின் இந்தப் பிரிவில், AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி traces சேகரிப்பதன் மூலம் Amazon EKS இல் உங்கள் applications க்கான கண்டெய்னர் tracing க்கு AWS X-Ray ஐப் பயன்படுத்துவது பற்றி கற்றுக்கொண்டோம். மேலும் கற்றுக்கொள்ள, [AWS Distro for OpenTelemetry க்கான Amazon EKS add-ons பயன்படுத்தி Amazon Managed Service for Prometheus மற்றும் Amazon CloudWatch க்கு metrics மற்றும் traces சேகரிப்பு](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/) ஐ சரிபார்க்கவும். இறுதியாக, Amazon EKS cluster உருவாக்கும் செயல்முறையின் போது AWS X-Ray பயன்படுத்தி கண்டெய்னர் tracing ஐ அமைப்பதற்கான ஒரு வழிமுறையாக EKS Blueprints ஐப் பயன்படுத்துவது பற்றி சுருக்கமாகப் பேசினோம். மேலும் ஆழமாகக் கற்றுக்கொள்ள, AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) இன் **AWS native** Observability வகையின் கீழ் உள்ள X-Ray Traces module ஐ பயிற்சி செய்ய கடுமையாக பரிந்துரைக்கிறோம்.
