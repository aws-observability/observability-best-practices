# CloudWatch Embedded Metric Format

## పరిచయం

CloudWatch Embedded Metric Format (EMF) కస్టమర్లు సంక్లిష్ట high-cardinality అప్లికేషన్ డేటాను లాగ్‌ల రూపంలో Amazon CloudWatch కు ingest చేసి, actionable metrics జనరేట్ చేయడానికి అనుమతిస్తుంది. Embedded Metric Format తో కస్టమర్లు తమ environments లో insights పొందడానికి complex architecture పై ఆధారపడాల్సిన అవసరం లేదు లేదా ఏదైనా third party tools ఉపయోగించాల్సిన అవసరం లేదు. ఈ feature అన్ని environments లో ఉపయోగించగలిగినప్పటికీ, AWS Lambda functions లేదా Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS) లేదా EC2 పై Kubernetes లోని containers వంటి ephemeral resources ఉన్న workloads లో ఇది ప్రత్యేకంగా ఉపయోగకరం. Embedded Metric Format కస్టమర్లు ప్రత్యేక code instrument చేయకుండా లేదా maintain చేయకుండా custom metrics సులభంగా సృష్టించడానికి అనుమతిస్తుంది, అదే సమయంలో log data పై శక్తివంతమైన analytical capabilities పొందుతారు.

## Embedded Metric Format (EMF) logs ఎలా పనిచేస్తాయి

Amazon EC2, On-premise Servers, Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS) లేదా EC2 పై Kubernetes లోని containers వంటి Compute environments CloudWatch Agent ద్వారా Amazon CloudWatch కు Embedded Metric Format (EMF) logs generate & send చేయగలవు.

AWS Lambda కస్టమర్లు ఎటువంటి custom code అవసరం లేకుండా, blocking network calls చేయకుండా లేదా Amazon CloudWatch కు Embedded Metric Format (EMF) logs generate చేసి ingest చేయడానికి ఏ third party software పై ఆధారపడకుండా custom metrics సులభంగా generate చేయడానికి అనుమతిస్తుంది.

కస్టమర్లు [EMF specification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) కు అనుగుణంగా structured logs publish చేస్తూ, ప్రత్యేక header declaration అందించాల్సిన అవసరం లేకుండా, detailed log event data తో పాటు custom metrics ను asynchronously embed చేయగలరు. CloudWatch custom metrics ను ఆటోమేటిక్‌గా extract చేస్తుంది, దీని వల్ల కస్టమర్లు real-time incident detection కోసం visualize & alarm సెట్ చేయగలరు. Extracted metrics తో అనుబంధించబడిన detailed log events మరియు high-cardinality context ను CloudWatch Logs Insights ఉపయోగించి query చేయవచ్చు, ఇది operational events యొక్క root causes లో deep insights అందిస్తుంది.

[Fluent Bit](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) కోసం Amazon CloudWatch output plugin కస్టమర్లు [Embedded Metric Format](https://github.com/aws/aws-for-fluent-bit) (EMF) కు support తో సహా Amazon CloudWatch service లో metrics & logs data ingest చేయడానికి అనుమతిస్తుంది.

![CloudWatch EMF Architecture](../../images/EMF-Arch.png)

## Embedded Metric Format (EMF) logs ఎప్పుడు ఉపయోగించాలి

సాంప్రదాయకంగా, monitoring మూడు categories లో structured చేయబడింది. మొదటి category అప్లికేషన్ యొక్క classic health check. రెండవ category 'metrics', దీని ద్వారా కస్టమర్లు counters, timers మరియు gauges వంటి models ఉపయోగించి తమ application ను instrument చేస్తారు. మూడవ category 'logs', ఇవి application యొక్క overall observability కోసం అమూల్యమైనవి. Logs కస్టమర్లకు వారి application ఎలా behave అవుతుందో నిరంతర సమాచారం అందిస్తాయి. ఇప్పుడు, Embedded Metric Format (EMF) logs ద్వారా data granularity లేదా richness లో sacrifices చేయకుండా, తమ application యొక్క మొత్తం instrumentation ను unify చేసి simplify చేస్తూ, అద్భుతమైన analytical capabilities పొందడం ద్వారా కస్టమర్లు తమ application ను observe చేసే విధానాన్ని గణనీయంగా మెరుగుపరచగలరు.

[Embedded Metric Format (EMF) logs](https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/) high cardinality application data generate చేసే environments కోసం ఆదర్శం, ఇది metric dimensions పెంచకుండా EMF logs లో భాగం కావచ్చు. ఇది ఇప్పటికీ కస్టమర్లు ప్రతి attribute ను metric dimension గా పెట్టకుండా CloudWatch Logs Insights మరియు CloudWatch Metrics Insights ద్వారా EMF logs query చేయడం ద్వారా application data ను slice and dice చేయడానికి అనుమతిస్తుంది.

[Telco లేదా IoT devices మిలియన్ల నుండి telemetry data](https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/) aggregate చేసే కస్టమర్లకు వారి devices performance లో insights మరియు devices report చేసే unique telemetry లో త్వరగా deep dive చేసే సామర్థ్యం అవసరం. నాణ్యమైన service అందించడానికి భారీ data ద్వారా dig చేయకుండా సమస్యలను సులభంగా & వేగంగా troubleshoot చేయాలి. Embedded Metric Format (EMF) logs ఉపయోగించడం ద్వారా కస్టమర్లు metrics మరియు logs ను single entity గా combine చేయడం ద్వారా cost efficiency మరియు మెరుగైన performance తో large scale observability సాధించగలరు మరియు troubleshooting మెరుగుపరచగలరు.

## Embedded Metric Format (EMF) logs Generate చేయడం

Embedded metric format logs generate చేయడానికి క్రింది methods ఉపయోగించవచ్చు

1. Open-sourced client libraries ఉపయోగించి agent ([CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) లేదా Fluent-Bit లేదా Firelens) ద్వారా EMF logs generate చేసి send చేయడం.

   - EMF logs సృష్టించడానికి ఉపయోగించగల open-sourced client libraries క్రింది భాషలలో అందుబాటులో ఉన్నాయి
     - [Node.Js](https://github.com/awslabs/aws-embedded-metrics-node)
     - [Python](https://github.com/awslabs/aws-embedded-metrics-python)
     - [Java](https://github.com/awslabs/aws-embedded-metrics-java)
     - [C#](https://github.com/awslabs/aws-embedded-metrics-dotnet)
   - AWS Distro for OpenTelemetry (ADOT) ఉపయోగించి EMF logs generate చేయవచ్చు. ADOT అనేది Cloud Native Computing Foundation (CNCF) లో భాగమైన OpenTelemetry project యొక్క secure, production-ready, AWS-supported distribution. OpenTelemetry అనేది application monitoring కోసం distributed traces, logs మరియు metrics సేకరించడానికి APIs, libraries మరియు agents అందించే open-source initiative మరియు vendor-specific formats మధ్య boundaries మరియు restrictions తొలగిస్తుంది. దీని కోసం రెండు components అవసరం, OpenTelemetry compliant data source మరియు [CloudWatch EMF](https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf) logs తో ఉపయోగించడానికి enabled చేయబడిన [ADOT Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter).

2. [JSON format లో defined specification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) కు అనుగుణంగా manually constructed logs ను [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) లేదా [PutLogEvents API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) ద్వారా CloudWatch కు పంపవచ్చు.

## CloudWatch console లో Embedded Metric Format logs చూడడం

Metrics extract చేసే Embedded Metric Format (EMF) logs generate చేసిన తర్వాత కస్టమర్లు వాటిని CloudWatch console లో Metrics కింద [చూడవచ్చు](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html). Embedded metrics logs generate చేసేటప్పుడు specify చేసిన dimensions కలిగి ఉంటాయి. Client libraries ఉపయోగించి generate చేసిన Embedded metrics ServiceType, ServiceName, LogGroup default dimensions గా కలిగి ఉంటాయి.

- **ServiceName**: Service name override చేయబడుతుంది, అయితే name infer చేయలేని services కోసం (ఉదా. EC2 పై నడుస్తున్న Java process) explicitly set చేయకపోతే Unknown default value ఉపయోగించబడుతుంది.
- **ServiceType**: Service type override చేయబడుతుంది, అయితే type infer చేయలేని services కోసం (ఉదా. EC2 పై నడుస్తున్న Java process) explicitly set చేయకపోతే Unknown default value ఉపయోగించబడుతుంది.
- **LogGroupName**: కస్టమర్లు agent-based platforms కోసం metrics deliver చేయాల్సిన destination log group ను optionally configure చేయవచ్చు. ఈ value library నుండి agent కు Embedded Metric payload లో pass చేయబడుతుంది. LogGroup provide చేయకపోతే, default value service name నుండి derive అవుతుంది: -metrics
- **LogStreamName**: కస్టమర్లు agent-based platforms కోసం metrics deliver చేయాల్సిన destination log stream ను optionally configure చేయవచ్చు. ఈ value library నుండి agent కు Embedded Metric payload లో pass చేయబడుతుంది. LogStreamName provide చేయకపోతే, default value agent ద్వారా derive అవుతుంది (ఇది hostname అయ్యే అవకాశం ఉంది).
- **NameSpace**: CloudWatch namespace ను override చేస్తుంది. Set చేయకపోతే, aws-embedded-metrics default value ఉపయోగించబడుతుంది.

CloudWatch Console logs లో sample EMF logs ఇలా కనిపిస్తాయి

```json
2023-05-19T15:20:39.391Z 238196b6-c8da-4341-a4b7-0c322e0ef5bb INFO
{
    "LogGroup": "emfTestFunction",
    "ServiceName": "emfTestFunction",
    "ServiceType": "AWS::Lambda::Function",
    "Service": "Aggregator",
    "AccountId": "XXXXXXXXXXXX",
    "RequestId": "422b1569-16f6-4a03-b8f0-fe3fd9b100f8",
    "DeviceId": "61270781-c6ac-46f1-baf7-22c808af8162",
    "Payload": {
        "sampleTime": 123456789,
        "temperature": 273,
        "pressure": 101.3
    },
    "executionEnvironment": "AWS_Lambda_nodejs18.x",
    "memorySize": "256",
    "functionVersion": "$LATEST",
    "logStreamId": "2023/05/19/[$LATEST]f3377848231140c185570caa9f97abc8",
    "_aws": {
        "Timestamp": 1684509639390,
        "CloudWatchMetrics": [
            {
                "Dimensions": [
                    [
                        "LogGroup",
                        "ServiceName",
                        "ServiceType",
                        "Service"
                    ]
                ],
                "Metrics": [
                    {
                        "Name": "ProcessingLatency",
                        "Unit": "Milliseconds"
                    }
                ],
                "Namespace": "aws-embedded-metrics"
            }
        ]
    },
    "ProcessingLatency": 100
}
```

అదే EMF log కోసం, extracted metrics ఇలా కనిపిస్తాయి, వీటిని **CloudWatch Metrics** లో query చేయవచ్చు.

![CloudWatch EMF Metrics](../../images/emf_extracted_metrics.png)

కస్టమర్లు extracted metrics తో అనుబంధించబడిన detailed log events ను **CloudWatch Logs Insights** ఉపయోగించి query చేయవచ్చు, ఇది operational events యొక్క root causes లో deep insights పొందడానికి. EMF logs నుండి metrics extract చేయడం యొక్క ప్రయోజనాలలో ఒకటి ఏమిటంటే, కస్టమర్లు unique metric (metric name plus unique dimension set) మరియు metric values ద్వారా logs ను filter చేయవచ్చు, aggregated metric value కు contribute చేసిన events పై context పొందవచ్చు.

పైన చర్చించిన అదే EMF logs కోసం, impacted request id లేదా device id పొందడానికి ProcessingLatency metric గా మరియు Service dimension గా ఉన్న ఒక example query CloudWatch Logs Insights లో sample query గా క్రింద చూపబడింది.

```json
filter ProcessingLatency < 200 and Service = "Aggregator"
| fields @requestId, @ingestionTime, @DeviceId
```

![CloudWatch EMF Logs](../../images/emf_extracted_CWLogs.png)

## EMF logs తో సృష్టించిన metrics పై Alarms

[EMF ద్వారా generate చేయబడిన metrics పై alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html) సృష్టించడం ఏదైనా ఇతర metrics పై alarms సృష్టించడం వలె ఉంటుంది. ఇక్కడ గమనించాల్సిన ముఖ్య విషయం ఏమిటంటే, EMF metric generation log publishing flow పై ఆధారపడుతుంది, ఎందుకంటే CloudWatch Logs EMF logs ను process చేసి metrics ను transform చేస్తుంది. కాబట్టి alarms evaluate చేయబడే time period లో metric datapoints సృష్టించబడేలా సకాలంలో logs publish చేయడం ముఖ్యం.

పైన చర్చించిన అదే EMF logs కోసం, threshold తో ProcessingLatency metric datapoint గా ఉపయోగించి ఒక example alarm సృష్టించబడింది మరియు క్రింద చూపబడింది.

![CloudWatch EMF Alarm](../../images/EMF-Alarm.png)

## EMF Logs యొక్క తాజా features

కస్టమర్లు [PutLogEvents API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) ఉపయోగించి CloudWatch Logs కు EMF logs పంపవచ్చు మరియు metrics extract చేయాలని CloudWatch Logs కు indicate చేయడానికి HTTP header `x-amzn-logs-format: json/emf` optionally include చేయవచ్చు, ఇది ఇకపై అవసరం లేదు.

Amazon CloudWatch Embedded Metric Format (EMF) ఉపయోగించి structured logs నుండి 1 second granularity వరకు [high resolution metric extraction](https://aws.amazon.com/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/) కు మద్దతు ఇస్తుంది. కస్టమర్లు desired resolution (seconds లో) indicate చేయడానికి 1 లేదా 60 (default) value తో EMF specification logs లో optional [StorageResolution](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Resolution_definition) parameter provide చేయవచ్చు. కస్టమర్లు EMF ద్వారా standard resolution (60 seconds) మరియు high resolution (1 second) metrics రెండూ publish చేయవచ్చు, వారి applications health మరియు performance లో granular visibility ఎనేబుల్ చేయవచ్చు.

Amazon CloudWatch Embedded Metric Format (EMF) లో రెండు error metrics ([EMFValidationErrors & EMFParsingErrors](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)) తో [errors లో enhanced visibility](https://aws.amazon.com/about-aws/whats-new/2023/01/amazon-cloudwatch-enhanced-error-visibility-embedded-metric-format-emf/) అందిస్తుంది. ఈ enhanced visibility EMF ఉపయోగించేటప్పుడు కస్టమర్లు errors ను త్వరగా identify చేసి remediate చేయడంలో సహాయపడుతుంది, తద్వారా instrumentation process ను simplify చేస్తుంది.

ఆధునిక applications నిర్వహించడం యొక్క పెరిగిన complexity తో, కస్టమర్లకు custom metrics define చేసి analyze చేసేటప్పుడు ఎక్కువ flexibility అవసరం. అందువల్ల maximum metric dimensions 10 నుండి 30 కు పెంచబడ్డాయి. కస్టమర్లు [30 dimensions వరకు EMF logs ఉపయోగించి](https://aws.amazon.com/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/) custom metrics సృష్టించవచ్చు.

## అదనపు References:

- [AWS Lambda function తో Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary) పై One Observability Workshop, NodeJS Library ఉపయోగించి sample.
- [Async metrics using Embedded Metrics Format](https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html) (EMF) పై Serverless Observability Workshop
- CloudWatch Logs కు EMF logs పంపడానికి [PutLogEvents API ఉపయోగించి Java code sample](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents)
- Blog article: [Lowering costs and focusing on our customers with Amazon CloudWatch embedded custom metrics](https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/)
