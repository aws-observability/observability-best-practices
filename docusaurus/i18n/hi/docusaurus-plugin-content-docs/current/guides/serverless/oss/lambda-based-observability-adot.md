# OpenTelemetry के साथ AWS Lambda आधारित Serverless ऑब्ज़र्वेबिलिटी

यह गाइड managed open-source tools और technologies को AWS X-Ray, और Amazon CloudWatch जैसी native AWS monitoring services के साथ उपयोग करके Lambda आधारित serverless applications के लिए ऑब्ज़र्वेबिलिटी configure करने के सर्वोत्तम अभ्यासों को कवर करती है। हम [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction), [AWS X-Ray](https://aws.amazon.com/xray), और [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) जैसे tools को कवर करेंगे और बताएंगे कि आप इन tools का उपयोग करके अपने serverless applications में actionable insights कैसे प्राप्त कर सकते हैं, समस्याओं का निवारण कर सकते हैं, और application प्रदर्शन को अनुकूलित कर सकते हैं।

## **कवर किए गए मुख्य विषय**

ऑब्ज़र्वेबिलिटी सर्वोत्तम अभ्यास गाइड के इस अनुभाग में, हम निम्नलिखित विषयों पर गहराई से जाएंगे:

* AWS Distro for OpenTelemetry (ADOT) और ADOT Lambda Layer का परिचय
* ADOT Lambda Layer का उपयोग करके Lambda function का Auto-instrumentation
* ADOT Collector के लिए Custom configuration support
* Amazon Managed Service for Prometheus (AMP) के साथ Integration
* ADOT Lambda Layer उपयोग करने के फायदे और नुकसान
* ADOT उपयोग करते समय cold start latency का प्रबंधन


## **AWS Distro for OpenTelemetry (ADOT) का परिचय**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) Cloud Native Computing Foundation (CNCF) [OpenTelemetry (OTel)](https://opentelemetry.io/) project का एक सुरक्षित, production-ready, AWS-supported distribution है। ADOT का उपयोग करके, आप अपने applications को केवल एक बार instrument कर सकते हैं और correlated metrics और traces को कई monitoring solutions को भेज सकते हैं।

AWS की managed [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) telemetry data export करने के लिए [OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) का उपयोग करती है। यह AWS Lambda function को wrap करके, और OpenTelemetry runtime specific SDK, ADOT collector का trimmed down version और AWS Lambda functions को auto-instrumenting के लिए out-of-the-box configuration को package करके plug-and-play user experience प्रदान करती है। ADOT Lambda Layer collector components, जैसे Receivers, Exporters, और Extensions Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus, AWS X-Ray, और अन्य के साथ integration support करते हैं। पूरी सूची [यहां](https://github.com/aws-observability/aws-otel-lambda) देखें। ADOT [partner solutions](https://aws.amazon.com/otel/partners) के साथ integrations भी support करता है।

ADOT Lambda Layer ऑटो-इंस्ट्रुमेंटेशन (Python, NodeJS, और Java के लिए) और किसी भी विशिष्ट libraries और SDKs set के लिए custom instrumentation दोनों support करती है। Auto-instrumentation के साथ, डिफ़ॉल्ट रूप से, Lambda Layer AWS X-Ray को traces export करने के लिए configured है। Custom instrumentation के लिए, आपको respective [OpenTelemetry runtime instrumentation repository](https://github.com/open-telemetry) से corresponding library instrumentation शामिल करनी होगी और अपने function में initialize करने के लिए अपना code modify करना होगा।

## **ADOT Lambda Layer के साथ AWS Lambda का Auto-instrumentation**

आप बिना किसी code changes के ADOT Lambda Layer का उपयोग करके Lambda function का ऑटो-इंस्ट्रुमेंटेशन आसानी से enable कर सकते हैं। आइए एक उदाहरण देखें कि आपकी मौजूदा Java आधारित Lambda function में ADOT Lambda layer जोड़ने और CloudWatch में execution logs और traces देखने का।

1. `runtime`, `region` और `arch type` के आधार पर Lambda Layer का ARN चुनें [documentation](https://aws-otel.github.io/docs/getting-started/lambda) के अनुसार। सुनिश्चित करें कि आप Lambda Layer का उपयोग उसी region में करें जहां आपकी Lambda function है। उदाहरण के लिए, java ऑटो-इंस्ट्रुमेंटेशन के लिए Lambda Layer होगी `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1`
2. अपनी Lambda function में Layer जोड़ें Console या अपनी पसंद के IaC के माध्यम से।
    * AWS Console के साथ, अपनी Lambda function में Layer जोड़ने के लिए [instructions](https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html) का पालन करें। Specify an ARN के तहत ऊपर चुने गए layer ARN को paste करें।
    * IaC option के साथ, Lambda function के लिए SAM template ऐसा दिखेगा:
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```
3. अपनी Lambda function में environment variable `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler` Node.js या Java के लिए, और `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument` Python के लिए जोड़ें।
4. अपनी Lambda function के लिए Active Tracing enable करें। **`नोट`** कि डिफ़ॉल्ट रूप से, layer AWS X-Ray को traces export करने के लिए configured है। सुनिश्चित करें कि आपकी Lambda function की execution role में आवश्यक AWS X-Ray permissions हैं। AWS Lambda के लिए AWS X-Ray permissions के बारे में अधिक जानकारी के लिए, [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html#services-xray-permissions) देखें।
    * `Tracing: Active`
5. Lambda Layer configuration, Environment Variable, और X-Ray tracing के साथ उदाहरण SAM template कुछ ऐसा दिखेगा:
```
Resources:
  ListBucketsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: com.example.App::handleRequest
      ...
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 1
      Policies:
        - AWSXrayWriteOnlyAccess
        - AmazonS3ReadOnlyAccess
      Environment:
        Variables:
          AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler
      Tracing: Active
      Layers:
        - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-1:1
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /listBuckets
            Method: get
```
6. AWS X-Ray में traces का Testing और Visualization
अपनी Lambda function को या तो directly या API के माध्यम से invoke करें (यदि API trigger के रूप में configured है)। उदाहरण के लिए, API के माध्यम से Lambda function invoke करना (`curl` का उपयोग करके) नीचे दिखाए अनुसार logs generate करेगा:
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Lambda function logs:
<pre><code>
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
[otel.javaagent 2023-09-24 15:28:16:862 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws
EXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]
START RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3
...
END RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940
REPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms
<b>XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true</b>
</code></pre>

जैसा कि आप logs से देख सकते हैं, OpenTelemetry Lambda extension opentelemetry-javaagent का उपयोग करके Lambda functions को listen और instrument करना शुरू करता है और AWS X-Ray में traces generate करता है।

ऊपर दिए गए Lambda function invocation से traces देखने के लिए, AWS X-Ray console पर navigate करें और Traces के तहत trace id चुनें। आपको नीचे दिखाए अनुसार Trace Map और Segments Timeline दिखाई देगा:
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)


## **ADOT Collector के लिए Custom configuration support**

ADOT Lambda Layer OpenTelemetry SDK और ADOT Collector components दोनों को combine करती है। ADOT Collector का configuration OpenTelemetry standard का पालन करता है। डिफ़ॉल्ट रूप से, ADOT Lambda Layer [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml) का उपयोग करती है, जो telemetry data को AWS X-Ray को export करती है। हालांकि, ADOT Lambda Layer अन्य exporters भी support करती है, जो आपको metrics और traces अन्य destinations को भेजने में सक्षम बनाता है। Custom configuration के लिए support किए गए available components की पूरी सूची [यहां](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components) देखें।

## **Amazon Managed Service for Prometheus (AMP) के साथ Integration**

आप custom collector configuration का उपयोग करके अपनी Lambda function से Amazon Managed Prometheus (AMP) को metrics export कर सकते हैं।

1. Lambda Layer configure करने, Environment variable `AWS_LAMBDA_EXEC_WRAPPER` सेट करने के लिए ऊपर ऑटो-इंस्ट्रुमेंटेशन के steps का पालन करें।
2. अपने AWS account में Amazon Manager Prometheus workspace बनाने के लिए [instructions](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html) का पालन करें, जहां आपकी Lambda function metrics भेजेगी। AMP workspace से `Endpoint - remote write URL` नोट कर लें। ADOT collector configuration पर configure करने के लिए आपको इसकी आवश्यकता होगी।
3. अपनी Lambda function की root directory में पिछले step से AMP endpoint remote write URL के details के साथ एक custom ADOT collector configuration file (मान लें `collector.yaml`) बनाएं। आप S3 bucket से भी configuration file load कर सकते हैं।
सैंपल ADOT collector configuration file:
```
#collector.yaml in the root directory
#Set an environemnt variable 'OPENTELEMETRY_COLLECTOR_CONFIG_FILE' to '/var/task/collector.yaml'

extensions:
  sigv4auth:
    service: "aps"
    region: "<workspace_region>"

receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  logging:
  prometheusremotewrite:
    endpoint: "<workspace_remote_write_url>"
    namespace: test
    auth:
      authenticator: sigv4auth

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      exporters: [logging, prometheusremotewrite]
```
Prometheus Remote Write Exporter को retry, और timeout settings के साथ भी configure किया जा सकता है। अधिक जानकारी के लिए [documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md) देखें। **`नोट`** `sigv4auth` extension के लिए Service value `aps` (amazon prometheus service) होनी चाहिए। साथ ही, सुनिश्चित करें कि आपकी Lambda function execution role में आवश्यक AMP permissions हैं। AWS Lambda के लिए AMP पर आवश्यक permissions और policies के बारे में अधिक जानकारी के लिए, AWS Managed Service for Prometheus [documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-and-IAM.html#AMP-IAM-policies-built-in) देखें।

4. एक environment variable `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` जोड़ें और value को configuration file के path पर सेट करें। जैसे /var/task/`<path to config file>`.yaml। यह Lambda Layer extension को बताएगा कि collector configuration कहां मिलेगा।
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. OpenTelemetry Metrics API का उपयोग करके metrics जोड़ने के लिए अपना Lambda function code update करें। यहां examples देखें।
```
// get meter
Meter meter = GlobalOpenTelemetry.getMeterProvider()
    .meterBuilder("aws-otel")
    .setInstrumentationVersion("1.0")
    .build();

// Build counter e.g. LongCounter
LongCounter counter = meter
    .counterBuilder("processed_jobs")
    .setDescription("Processed jobs")
    .setUnit("1")
    .build();

// It is recommended that the API user keep a reference to Attributes they will record against
Attributes attributes = Attributes.of(stringKey("Key"), "SomeWork");

// Record data
counter.add(123, attributes);
```

## **ADOT Lambda Layer उपयोग करने के फायदे और नुकसान**

यदि आप Lambda function से AWS X-Ray को traces भेजना चाहते हैं, तो आप या तो [X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html) या [AWS Distro for OpenTelemetry (ADOT) Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) का उपयोग कर सकते हैं। जबकि X-Ray SDK विभिन्न AWS services के आसान instrumentation को support करता है, यह केवल X-Ray को traces भेज सकता है। वहीं, ADOT collector, जो Lambda Layer के हिस्से के रूप में शामिल है, प्रत्येक language के लिए बड़ी संख्या में library instrumentations support करता है। आप इसका उपयोग AWS X-Ray और अन्य monitoring solutions, जैसे Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus और अन्य [partner](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics) solutions को metrics और traces collect और भेजने के लिए कर सकते हैं।

हालांकि, ADOT द्वारा प्रदान किए जाने वाले लचीलेपन के कारण, आपकी Lambda function को अतिरिक्त memory की आवश्यकता हो सकती है और cold start latency पर notable प्रभाव अनुभव कर सकती है। इसलिए, यदि आप अपनी Lambda function को low-latency के लिए optimize कर रहे हैं और OpenTelemetry की advanced features की आवश्यकता नहीं है, तो ADOT की बजाय AWS X-Ray SDK का उपयोग करना अधिक उपयुक्त हो सकता है। विस्तृत तुलना और सही tracing tool चुनने पर मार्गदर्शन के लिए, [choosing between ADOT and X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) पर AWS docs देखें।


## **ADOT उपयोग करते समय cold start latency का प्रबंधन**
Java के लिए ADOT Lambda Layer agent-based है, जिसका मतलब है कि जब आप ऑटो-इंस्ट्रुमेंटेशन enable करते हैं, तो Java Agent सभी OTel [supported](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation) libraries को instrument करने का प्रयास करेगा। इससे Lambda function cold start latency काफी बढ़ जाएगी। इसलिए, हम अनुशंसा करते हैं कि आप केवल उन libraries/frameworks के लिए ऑटो-इंस्ट्रुमेंटेशन enable करें जो आपके application द्वारा उपयोग किए जाते हैं।

केवल विशिष्ट instrumentations enable करने के लिए, आप निम्नलिखित environment variables का उपयोग कर सकते हैं:

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: false पर सेट करने पर, Layer में ऑटो-इंस्ट्रुमेंटेशन disable हो जाता है, जिसमें प्रत्येक instrumentation को individually enable करना होता है।
* `OTEL_INSTRUMENTATION_<NAME>_ENABLED`: किसी विशिष्ट library या framework के लिए ऑटो-इंस्ट्रुमेंटेशन enable करने के लिए true पर सेट करें। "NAME" को उस instrumentation से replace करें जिसे आप enable करना चाहते हैं। उपलब्ध instrumentations की सूची के लिए, Suppressing specific agent instrumentation देखें।

उदाहरण के लिए, केवल Lambda और AWS SDK के लिए ऑटो-इंस्ट्रुमेंटेशन enable करने के लिए, आप निम्नलिखित environment variables सेट करेंगे:
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```

## **अतिरिक्त संसाधन**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)

## **सारांश**

Open Source technologies का उपयोग करके AWS Lambda आधारित serverless application के लिए इस ऑब्ज़र्वेबिलिटी सर्वोत्तम अभ्यास गाइड में, हमने AWS Distro for OpenTelemetry (ADOT) और Lambda Layer को कवर किया और बताया कि आप इसका उपयोग अपने AWS Lambda functions को instrument करने के लिए कैसे कर सकते हैं। हमने कवर किया कि आप कैसे आसानी से ऑटो-इंस्ट्रुमेंटेशन enable कर सकते हैं साथ ही कई destinations को ऑब्ज़र्वेबिलिटी signals भेजने के लिए simple configuration के साथ ADOT collector को customize कर सकते हैं। हमने ADOT उपयोग करने के फायदे और नुकसान highlight किए और बताया कि यह आपकी Lambda function के लिए cold start latency को कैसे प्रभावित कर सकता है और cold-start times manage करने के लिए सर्वोत्तम अभ्यासों की भी अनुशंसा की। इन सर्वोत्तम अभ्यासों को अपनाकर, आप अपने applications को vendor agnostic तरीके से कई monitoring solutions को logs, metrics और traces भेजने के लिए केवल एक बार instrument कर सकते हैं।

आगे गहरी जानकारी के लिए, हम आपको [AWS One ऑब्ज़र्वेबिलिटी Workshop](https://catalog.workshops.aws/observability/en-US) के AWS managed open-source ऑब्ज़र्वेबिलिटी module का अभ्यास करने की अत्यधिक अनुशंसा करते हैं।
