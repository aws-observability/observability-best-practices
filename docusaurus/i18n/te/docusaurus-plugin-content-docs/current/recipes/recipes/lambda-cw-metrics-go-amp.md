# CloudWatch Metric Streams ను Firehose మరియు AWS Lambda ద్వారా Amazon Managed Service for Prometheus కు ఎక్స్‌పోర్ట్ చేయడం

ఈ రెసిపీలో [CloudWatch Metric Stream](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList) ను ఇన్‌స్ట్రుమెంట్ చేసి, [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) లోకి మెట్రిక్స్‌ను ఇంజెస్ట్ చేయడానికి [Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) మరియు [AWS Lambda](https://aws.amazon.com/lambda) ను ఎలా ఉపయోగించాలో చూపిస్తాము.

పూర్తి దృశ్యాన్ని ప్రదర్శించడానికి Firehose Delivery Stream, Lambda, మరియు S3 Bucket సృష్టించడానికి [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) ఉపయోగించి స్టాక్‌ను సెటప్ చేస్తాము.

:::note
    ఈ గైడ్ పూర్తి చేయడానికి సుమారు 30 నిమిషాలు పడుతుంది.
:::
## ఇన్‌ఫ్రాస్ట్రక్చర్
ఈ క్రింది విభాగంలో ఈ రెసిపీ కోసం ఇన్‌ఫ్రాస్ట్రక్చర్‌ను సెటప్ చేస్తాము.

CloudWatch Metric Streams HTTP ఎండ్‌పాయింట్ లేదా [S3 bucket](https://aws.amazon.com/s3) కు స్ట్రీమింగ్ మెట్రిక్ డేటాను ఫార్వర్డ్ చేయడానికి అనుమతిస్తాయి.

### ముందస్తు అవసరాలు

* AWS CLI [ఇన్‌స్టాల్](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) చేయబడి మీ పరిసరంలో [కాన్ఫిగర్](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) చేయబడి ఉండాలి.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) మీ పరిసరంలో ఇన్‌స్టాల్ చేయబడి ఉండాలి.
* Node.js మరియు Go.
* [repo](https://github.com/aws-observability/observability-best-practices/) మీ లోకల్ మెషీన్‌కు clone చేయబడి ఉండాలి. ఈ ప్రాజెక్ట్ కోడ్ `/sandbox/CWMetricStreamExporter` కింద ఉంది.

### AMP వర్క్‌స్పేస్ సృష్టించడం

ఈ రెసిపీలో మా డెమో అప్లికేషన్ AMP పై అమలవుతుంది.
ఈ క్రింది ఆదేశం ద్వారా మీ AMP Workspace ను సృష్టించండి:

```
aws amp create-workspace --alias prometheus-demo-recipe
```

ఈ క్రింది ఆదేశంతో మీ వర్క్‌స్పేస్ సృష్టించబడిందని నిర్ధారించండి:
```
aws amp list-workspaces
```

:::info
    మరిన్ని వివరాలకు [AMP Getting started](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) గైడ్ చూడండి.
:::
### డిపెండెన్సీలను ఇన్‌స్టాల్ చేయడం

aws-o11y-recipes రిపాజిటరీ రూట్ నుండి, ఈ ఆదేశం ద్వారా మీ డైరెక్టరీని CWMetricStreamExporter కు మార్చండి:

```
cd sandbox/CWMetricStreamExporter
```

ఇప్పటి నుండి ఇది repo యొక్క రూట్‌గా పరిగణించబడుతుంది.

ఈ క్రింది ఆదేశం ద్వారా `/cdk` డైరెక్టరీకి మారండి:

```
cd cdk
```

ఈ క్రింది ఆదేశం ద్వారా CDK డిపెండెన్సీలను ఇన్‌స్టాల్ చేయండి:

```
npm install
```

repo రూట్‌కు తిరిగి వెళ్ళి, ఈ క్రింది ఆదేశం ఉపయోగించి `/lambda` డైరెక్టరీకి మారండి:

```
cd lambda
```

`/lambda` ఫోల్డర్‌లో ఉన్నప్పుడు, ఈ క్రింది ఉపయోగించి Go డిపెండెన్సీలను ఇన్‌స్టాల్ చేయండి:

```
go get
```

అన్ని డిపెండెన్సీలు ఇప్పుడు ఇన్‌స్టాల్ అయ్యాయి.

### కాన్ఫిగ్ ఫైల్‌ను సవరించడం

repo రూట్‌లో, `config.yaml` తెరిచి, కొత్తగా సృష్టించిన workspace id తో `{workspace}` ను భర్తీ చేయడం ద్వారా AMP workspace URL ను మార్పు చేయండి, మరియు మీ AMP workspace ఉన్న రీజియన్.

ఉదాహరణకు, ఈ క్రింది విధంగా సవరించండి:

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose Delivery Stream మరియు S3 Bucket పేర్లను మీ ఇష్టానుసారం మార్చండి.

### స్టాక్ డిప్లాయ్ చేయడం

`config.yaml` AMP workspace ID తో సవరించబడిన తర్వాత, CloudFormation కు స్టాక్ డిప్లాయ్ చేయడానికి సమయం. CDK మరియు Lambda కోడ్‌ను బిల్డ్ చేయడానికి, repo రూట్‌లో ఈ క్రింది ఆదేశం అమలు చేయండి:

```
npm run build
```

ఈ బిల్డ్ దశ Go Lambda binary బిల్డ్ అవుతుందని మరియు CDK ని CloudFormation కు డిప్లాయ్ చేస్తుందని నిర్ధారిస్తుంది.

స్టాక్ డిప్లాయ్ చేయడానికి ఈ క్రింది IAM మార్పులను ఆమోదించండి:

![CDK డిప్లాయ్ చేసేటప్పుడు IAM మార్పుల స్క్రీన్ షాట్](../images/cdk-amp-iam-changes.png)

ఈ క్రింది ఆదేశం అమలు చేయడం ద్వారా స్టాక్ సృష్టించబడిందో వెరిఫై చేయండి:

```
aws cloudformation list-stacks
```

`CDK Stack` పేరుతో ఒక స్టాక్ సృష్టించబడి ఉండాలి.

## CloudWatch stream సృష్టించడం

CloudWatch కన్సోల్‌కు నావిగేట్ చేయండి, ఉదాహరణకు
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList`
మరియు "Create metric stream" క్లిక్ చేయండి.

అవసరమైన మెట్రిక్స్‌ను ఎంచుకోండి, అన్ని మెట్రిక్స్ లేదా ఎంపిక చేసిన namespaces నుండి మాత్రమే.

CDK ద్వారా సృష్టించబడిన ఉన్న Firehose ఉపయోగించి Metric Stream ను కాన్ఫిగర్ చేయండి.
అవుట్‌పుట్ ఫార్మాట్‌ను OpenTelemetry 0.7 బదులుగా JSON కు మార్చండి.
Metric Stream పేరును మీ ఇష్టానుసారం మార్చండి, మరియు "Create metric stream" క్లిక్ చేయండి:

![CloudWatch Metric Stream కాన్ఫిగరేషన్ యొక్క స్క్రీన్ షాట్](../images/cloudwatch-metric-stream-configuration.png)

Lambda ఫంక్షన్ ఇన్వొకేషన్‌ను వెరిఫై చేయడానికి, [Lambda కన్సోల్](https://console.aws.amazon.com/lambda/home) కు నావిగేట్ చేసి `KinesisMessageHandler` ఫంక్షన్‌ను క్లిక్ చేయండి. `Monitor` ట్యాబ్ మరియు `Logs` సబ్‌ట్యాబ్ క్లిక్ చేయండి, మరియు `Recent Invocations` కింద Lambda ఫంక్షన్ ట్రిగ్గర్ అవుతున్న entries ఉండాలి.

:::note
    Monitor ట్యాబ్‌లో invocations కనిపించడానికి 5 నిమిషాల వరకు పట్టవచ్చు.
:::
అంతే! అభినందనలు, మీ మెట్రిక్స్ ఇప్పుడు CloudWatch నుండి Amazon Managed Service for Prometheus కు స్ట్రీమ్ అవుతున్నాయి.

## క్లీనప్

ముందుగా, CloudFormation స్టాక్‌ను తొలగించండి:

```
cd cdk
cdk destroy
```

AMP వర్క్‌స్పేస్‌ను తొలగించండి:

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

చివరగా, CloudWatch Metric Stream ను కన్సోల్ నుండి తొలగించండి.
