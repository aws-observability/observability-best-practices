# CloudWatch Metric Streams-ஐ Firehose மற்றும் AWS Lambda மூலம் Amazon Managed Service for Prometheus-க்கு ஏற்றுமதி செய்தல்

இந்த ரெசிபியில் [CloudWatch Metric Stream](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList)-ஐ instrument செய்து [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/)-க்கு மெட்ரிக்குகளை உட்செலுத்த [Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) மற்றும் [AWS Lambda](https://aws.amazon.com/lambda)-ஐ பயன்படுத்துவது எப்படி என்பதைக் காட்டுகிறோம்.

முழுமையான சூழ்நிலையை நிரூபிக்க Firehose Delivery Stream, Lambda மற்றும் S3 Bucket உருவாக்க [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) பயன்படுத்தி ஒரு ஸ்டாக்கை அமைப்போம்.

:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 30 நிமிடங்கள் ஆகும்.
:::
## உள்கட்டமைப்பு
பின்வரும் பகுதியில் இந்த ரெசிபிக்கான உள்கட்டமைப்பை அமைப்போம்.

CloudWatch Metric Streams streaming metric data-ஐ HTTP endpoint அல்லது [S3 bucket](https://aws.amazon.com/s3)-க்கு forward செய்ய அனுமதிக்கிறது.

### முன்நிபந்தனைகள்

* AWS CLI உங்கள் சூழலில் [நிறுவப்பட்டு](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) [கட்டமைக்கப்பட்டிருக்க](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) வேண்டும்.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) உங்கள் சூழலில் நிறுவப்பட்டிருக்க வேண்டும்.
* Node.js மற்றும் Go.
* [repo](https://github.com/aws-observability/observability-best-practices/) உங்கள் உள்ளூர் கணினியில் clone செய்யப்பட்டிருக்க வேண்டும். இந்த திட்டத்திற்கான code `/sandbox/CWMetricStreamExporter` கீழ் உள்ளது.

### AMP workspace உருவாக்குதல்

இந்த ரெசிபியில் நமது demo பயன்பாடு AMP மீது இயங்கும். பின்வரும் கட்டளை வழியாக உங்கள் AMP Workspace-ஐ உருவாக்கவும்:

```
aws amp create-workspace --alias prometheus-demo-recipe
```

உங்கள் workspace உருவாக்கப்பட்டதை பின்வரும் கட்டளையுடன் உறுதி செய்யவும்:
```
aws amp list-workspaces
```

:::info
    கூடுதல் விவரங்களுக்கு [AMP தொடங்குதல்](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) வழிகாட்டியைப் பார்க்கவும்.
:::
### சார்புகளை நிறுவுதல்

aws-o11y-recipes repository-இன் root-இலிருந்து, CWMetricStreamExporter-க்கு உங்கள் directory-ஐ மாற்றவும்:

```
cd sandbox/CWMetricStreamExporter
```

இனிமேல் இதுவே repo-வின் root ஆக கருதப்படும்.

`/cdk`-க்கு directory மாற்றவும்:

```
cd cdk
```

CDK சார்புகளை நிறுவுங்கள்:

```
npm install
```

repo-வின் root-க்கு திரும்பி, `/lambda`-க்கு directory மாற்றவும்:

```
cd lambda
```

`/lambda` folder-ல் இருக்கும்போது, Go சார்புகளை நிறுவுங்கள்:

```
go get
```

அனைத்து சார்புகளும் இப்போது நிறுவப்பட்டுள்ளன.

### Config file-ஐ மாற்றுதல்

repo-வின் root-ல், `config.yaml`-ஐ திறந்து `{workspace}`-ஐ புதிதாக உருவாக்கிய workspace id-யுடனும், உங்கள் AMP workspace உள்ள region-ஐயும் மாற்றி AMP workspace URL-ஐ புதுப்பிக்கவும்.

உதாரணமாக, பின்வருமாறு மாற்றவும்:

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose Delivery Stream மற்றும் S3 Bucket-இன் பெயர்களை உங்கள் விருப்பத்திற்கு மாற்றவும்.

### ஸ்டாக்கை டிப்ளாய் செய்தல்

`config.yaml` AMP workspace ID-யுடன் மாற்றப்பட்டதும், CloudFormation-க்கு ஸ்டாக்கை டிப்ளாய் செய்ய வேண்டிய நேரம். CDK மற்றும் Lambda code-ஐ build செய்ய, repo-வின் root-ல் பின்வரும் கட்டளையை இயக்கவும்:

```
npm run build
```

இந்த build படி Go Lambda binary build ஆவதையும், CDK CloudFormation-க்கு deploy ஆவதையும் உறுதி செய்கிறது.

ஸ்டாக்கை deploy செய்ய பின்வரும் IAM மாற்றங்களை ஏற்றுக்கொள்ளவும்:

![CDK deploy செய்யும்போது IAM மாற்றங்களின் screenshot](../images/cdk-amp-iam-changes.png)

ஸ்டாக் உருவாக்கப்பட்டதை பின்வரும் கட்டளை இயக்கி சரிபார்க்கவும்:

```
aws cloudformation list-stacks
```

`CDK Stack` என்ற பெயரில் ஒரு stack உருவாக்கப்பட்டிருக்க வேண்டும்.

## CloudWatch stream உருவாக்குதல்

CloudWatch console-க்கு செல்லவும், உதாரணமாக `https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList` மற்றும் "Create metric stream"-ஐ கிளிக் செய்யவும்.

தேவையான metrics-ஐ தேர்ந்தெடுக்கவும், அனைத்து metrics அல்லது தேர்ந்தெடுக்கப்பட்ட namespaces-இலிருந்து.

CDK-யால் உருவாக்கப்பட்ட ஏற்கனவே உள்ள Firehose-ஐ பயன்படுத்தி Metric Stream-ஐ கட்டமைக்கவும். Output format-ஐ OpenTelemetry 0.7-க்கு பதிலாக JSON-க்கு மாற்றவும். Metric Stream பெயரை உங்கள் விருப்பத்திற்கு மாற்றி, "Create metric stream"-ஐ கிளிக் செய்யவும்:

![Cloudwatch Metric Stream Configuration-இன் screenshot](../images/cloudwatch-metric-stream-configuration.png)

Lambda function invocation-ஐ சரிபார்க்க, [Lambda console](https://console.aws.amazon.com/lambda/home)-க்குச் சென்று `KinesisMessageHandler` function-ஐ கிளிக் செய்யவும். `Monitor` tab மற்றும் `Logs` subtab-ஐ கிளிக் செய்யவும், `Recent Invocations`-இன் கீழ் Lambda function trigger ஆனதன் entries இருக்க வேண்டும்.

:::note
    Monitor tab-ல் invocations காட்டப்பட 5 நிமிடங்கள் வரை ஆகலாம்.
:::
அவ்வளவுதான்! வாழ்த்துக்கள், உங்கள் மெட்ரிக்குகள் இப்போது CloudWatch-இலிருந்து Amazon Managed Service for Prometheus-க்கு stream செய்யப்படுகின்றன.

## சுத்தம் செய்தல்

முதலில், CloudFormation stack-ஐ நீக்கவும்:

```
cd cdk
cdk destroy
```

AMP workspace-ஐ நீக்கவும்:

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

இறுதியாக, CloudWatch Metric Stream-ஐ console-இலிருந்து நீக்கவும்.
