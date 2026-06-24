# विभिन्न Instrumentation और Collector सेटअप

त्वरित नेविगेशन:

- [Instrumentation दृष्टिकोण](#instrumentation-approaches)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + Custom OTEL Collector](#adot-sdk--custom-otel-collector)
- [Upstream OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [OTLP Endpoints के साथ Collector-less Tracing](#collector-less-tracing-with-otlp-endpoints)
- [मौजूदा X-Ray SDK + X-Ray Daemon (सपोर्ट समाप्ति)](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [RED मेट्रिक्स गणना सारांश](#red-metrics-calculation-summary)

---

## Instrumentation दृष्टिकोण

### Auto-Instrumentation

**कब उपयोग करें:** जल्दी शुरू करना, न्यूनतम कोड परिवर्तन, प्रोडक्शन रोलआउट

**किसे उपयोग करना चाहिए:** DevOps टीमें, प्लेटफॉर्म इंजीनियर, गति को प्राथमिकता देने वाले ऑर्गनाइज़ेशन

**लाभ:**
- कोई कोड परिवर्तन आवश्यक नहीं
- तेज़ मूल्य प्राप्ति
- सामान्य फ्रेमवर्क को स्वचालित रूप से कवर करता है
- आवश्यकता पड़ने पर आसानी से रोलबैक

**सीमाएं:**
- क्या instrument होता है इस पर कम नियंत्रण
- आवश्यकता से अधिक डेटा कैप्चर कर सकता है
- कस्टम बिज़नेस लॉजिक के लिए अतिरिक्त manual instrumentation आवश्यक

### Manual OpenTelemetry Instrumentation

**कब उपयोग करें:** कस्टम बिज़नेस मेट्रिक्स, वेंडर पोर्टेबिलिटी, सूक्ष्म नियंत्रण

**किसे उपयोग करना चाहिए:** एप्लिकेशन डेवलपर, Observability विशेषज्ञता वाली टीमें

**लाभ:**
- टेलीमेट्री डेटा पर पूर्ण नियंत्रण
- बिज़नेस लॉजिक के लिए कस्टम spans और attributes
- वेंडर-न्यूट्रल (अन्य APM टूल्स के साथ काम करता है)
- प्रदर्शन प्रभाव पर सटीक नियंत्रण

**ट्रेड-ऑफ:**
- कोड परिवर्तन आवश्यक
- कार्यान्वयन अधिक जटिल
- कोड विकसित होने पर निरंतर रखरखाव

---

## Instrumentation + Collector सेटअप विकल्प

## ADOT SDK + CloudWatch Agent

यह दृष्टिकोण गहरे सर्विस एकीकरण और AWS इंफ्रास्ट्रक्चर मेट्रिक्स के साथ स्वचालित सहसंबंध के साथ सबसे एकीकृत AWS अनुभव प्रदान करता है।

### प्रमुख लाभ
- **कॉल वॉल्यूम, उपलब्धता, लेटेंसी, फॉल्ट, और त्रुटियां जैसी मेट्रिक्स** सैंपलिंग निर्णय से पहले क्लाइंट-साइड पर 100% अनुरोधों पर गणना की जाती हैं
- **X-Ray Sampling एकीकरण** डिफ़ॉल्ट रूप से X-Ray सैंपलिंग नियमों का उपयोग करता है (आवश्यकता होने पर 100% के लिए कॉन्फ़िगर करें)
- **बिल्ट-इन CloudWatch Logs एकीकरण** सहज लॉग सहसंबंध के लिए
- **पूर्ण AWS सपोर्ट** संपूर्ण Observability स्टैक के लिए
- **स्वचालित service discovery** और golden signals

### आर्किटेक्चर

![ADOT SDK + CloudWatch Agent आर्किटेक्चर](/apm-src/assets/images/deep-dive/adotcw.png)

### ADOT SDK + CloudWatch Agent कैसे काम करता है

**चरण 1: एप्लिकेशन Instrumentation**

जब आप ADOT SDK deploy करते हैं, तो यह कोड परिवर्तन की आवश्यकता के बिना स्वचालित रूप से आपके एप्लिकेशन को instrument करता है। ADOT SDK रनटाइम पर एप्लिकेशन में गतिशील रूप से कोड इंजेक्ट करता है, बिना manual कोड परिवर्तन की आवश्यकता के। यह इंजेक्ट किया गया कोड स्वचालित रूप से समर्थित फ्रेमवर्क के कॉल्स का पता लगाता है, प्रत्येक ऑपरेशन के लिए spans बनाता है, और एक पूर्ण ट्रेस बनाने के लिए सर्विसेज में context propagate करता है।

**चरण 2: सैंपलिंग निर्णय**

प्रत्येक अनुरोध के लिए, ADOT SDK आपके X-Ray सैंपलिंग नियमों की जांच करता है कि पूर्ण ट्रेस डेटा भेजना है या नहीं। लागत बचत के लिए 5% से लेकर पूर्ण दृश्यता के लिए 100% तक कॉन्फ़िगर कर सकते हैं।

**चरण 3: क्लाइंट-साइड मेट्रिक्स गणना**

यहां मुख्य लाभ है: सैंपलिंग होने से पहले, `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` होने पर SDK 100% अनुरोधों पर RED (Requests, Errors, Duration) मेट्रिक्स की गणना करता है। इसका मतलब है कि आपको कम सैंपलिंग दरों के साथ भी पूर्ण golden signals मिलते हैं:
- **Rate**: प्रति समय विंडो अनुरोधों की संख्या
- **Errors**: त्रुटि स्थिति कोड (4xx/5xx) वाले अनुरोधों की संख्या
- **Duration**: अनुरोध शुरू/समाप्त समय से लेटेंसी माप

**चरण 4: CloudWatch Agent प्रोसेसिंग**

ADOT SDK सैंपल किए गए spans और पूर्व-गणना की गई मेट्रिक्स दोनों को CloudWatch Agent को भेजता है, जो उन्हें एक pipeline के माध्यम से प्रोसेस करता है:

![ADOT SDK CloudWatch Agent विस्तृत Pipeline](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver**: आपके एप्लिकेशन से traces और metrics स्वीकार करता है
- **Resource Detector**: AWS resource जानकारी जोड़ता है (instance IDs, container details)
- **APM Processor**: प्लेटफॉर्म-विशिष्ट metadata के साथ spans को समृद्ध करता है
- **Exporters**: डेटा को X-Ray (spans) और CloudWatch (metrics) में route करता है

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**चरण 5: डेटा वितरण**

आपका डेटा तीन पथों में विभाजित होता है:
- **Metrics** → Application Maps के लिए `/aws/application-signals/data` लॉग ग्रुप
- **Spans** → Transaction Search के लिए `aws/spans` लॉग ग्रुप
- **इंडेक्स किए गए spans** → पारंपरिक ट्रेस विश्लेषण के लिए X-Ray backend

**चरण 6: एनालिटिक्स विकल्प**

यह आपको अपने डेटा का विश्लेषण करने के तीन तरीके देता है:
- **Application Signals**: डायनामिक ग्रुपिंग और पूर्ण मेट्रिक्स से golden signals के साथ Application Maps
- **Transaction Search**: उन्नत फ़िल्टर के साथ सभी span डेटा क्वेरी करें
- **X-Ray Analytics**: इंडेक्स किए गए spans पर पारंपरिक ट्रेस विश्लेषण

### कार्यान्वयन गाइड

प्लेटफॉर्म-विशिष्ट सेटअप गाइड का पालन करें:
- [Amazon EKS पर Application Signals सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [Amazon ECS पर Application Signals सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [Amazon EC2 पर Application Signals सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [स्व-होस्टेड Kubernetes पर Application Signals सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals डेमो रिपॉजिटरी](https://github.com/aws-observability/application-signals-demo)

पूर्ण होने पर, Application Signals कंसोल में service discovery और golden signals सत्यापित करें।


## ADOT SDK + Custom OTEL Collector

यह दृष्टिकोण ADOT SDK की क्लाइंट-साइड RED मेट्रिक्स गणना को AWS Application Signals Processor शामिल करने वाले कस्टम-बिल्ट OpenTelemetry Collector की लचीलापन के साथ जोड़ता है। आपको CloudWatch Agent दृष्टिकोण के समान सटीक 100%-ट्रैफिक मेट्रिक्स मिलते हैं, साथ ही टेलीमेट्री को कई गंतव्यों तक फैन-आउट करने की क्षमता।

### प्रमुख लाभ
- **ADOT SDK के माध्यम से 100% अनुरोधों पर क्लाइंट-साइड RED मेट्रिक्स** (CW Agent दृष्टिकोण के समान) — मेट्रिक्स सैंपलिंग से पहले गणना की जाती हैं
- **बहु-गंतव्य टेलीमेट्री** — AWS, Datadog, Prometheus, आदि को एक साथ फैन-आउट
- **App Signals Processor** `aws.local.*` / `aws.remote.*` attributes को सामान्यीकृत करता है, प्लेटफॉर्म context को resolve करता है, और cardinality नियंत्रित करता है
- **Collector pipeline पर पूर्ण नियंत्रण** — कस्टम processors, filters, और exporters जोड़ें

### आर्किटेक्चर

![ADOT SDK + Custom OTEL Collector आर्किटेक्चर](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### ADOT SDK + Custom OTEL Collector कैसे काम करता है

**चरण 1: एप्लिकेशन Instrumentation**

ADOT SDK के साथ आपका एप्लिकेशन instrument होता है, जो OpenTelemetry फॉर्मेट में runtime metrics, logs, और traces कैप्चर करता है। ADOT SDK AWS-विशिष्ट span attributes (`aws.local.service`, `aws.local.operation`, `aws.remote.service`, `aws.remote.operation`, आदि) इंजेक्ट करता है जिन पर App Signals Processor निर्भर करता है।

**चरण 2: क्लाइंट-साइड RED मेट्रिक्स गणना**

जब `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` होता है, तो ADOT SDK किसी भी सैंपलिंग निर्णय **से पहले** 100% अनुरोधों पर RED मेट्रिक्स की गणना करता है:
- **Rate**: प्रति समय विंडो अनुरोधों की संख्या
- **Errors**: त्रुटि स्थिति कोड (4xx/5xx) वाले अनुरोधों की संख्या
- **Duration**: अनुरोध शुरू/समाप्त समय से लेटेंसी माप

**चरण 3: सैंपलिंग निर्णय**

ADOT SDK आपकी कॉन्फ़िगर की गई सैंपलिंग रणनीति (X-Ray सैंपलिंग नियम या लोकल सैंपलिंग) लागू करता है। केवल सैंपल किए गए traces collector को भेजे जाते हैं, लेकिन RED मेट्रिक्स पहले से 100% ट्रैफिक पर गणना की जा चुकी हैं।


**चरण 4: Custom OpenTelemetry Collector प्रोसेसिंग Pipeline**

**OTLP Receivers (डेटा इंजेशन)**
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

**Resource Detection Processor**
```yaml
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
```

**Application Signals Processor**
```yaml
processors:
  awsapplicationsignals:
    resolvers:
      - platform: ecs
```

यह processor ADOT SDK द्वारा इंजेक्ट किए गए `aws.local.*` / `aws.remote.*` span attributes के साथ काम करता है। यह करता है:
1. **Attribute Resolution**: प्लेटफॉर्म context के साथ टेलीमेट्री को समृद्ध करने के लिए प्लेटफॉर्म-विशिष्ट resolvers का उपयोग
2. **Attribute Normalization**: ADOT SDK attributes को CloudWatch metric dimension names में बदलना
3. **Cardinality Control**: उपयोगकर्ता-कॉन्फ़िगर किए गए `keep`/`drop`/`replace` नियम लागू करना
4. **Application Map Generation**: डायनामिक ग्रुपिंग के साथ topology डेटा बनाना

**चरण 5: Export प्रोसेसिंग**

Exporters SigV4 प्रमाणीकरण के साथ AWS EMF (metrics), OTLP HTTP (logs), और OTLP HTTP (traces) endpoints पर डेटा route करते हैं।

**चरण 6: Backend प्रोसेसिंग**
1. CloudWatch Logs: EMF logs से metrics निकालता है, `aws/spans` में span डेटा स्टोर करता है
2. X-Ray Backend: ट्रेस एनालिटिक्स के लिए कॉन्फ़िगर करने योग्य प्रतिशत spans को इंडेक्स करता है

**चरण 7: एनालिटिक्स और विज़ुअलाइज़ेशन**
- **Application Signals**: क्लाइंट-साइड गणना किए गए RED मेट्रिक्स का उपयोग — सैंपलिंग के बावजूद 100% ट्रैफिक पर सटीक
- **Transaction Search**: CloudWatch Logs से span डेटा क्वेरी
- **X-Ray Analytics**: इंडेक्स किए गए spans पर पारंपरिक ट्रेस विश्लेषण


### awsapplicationsignalsprocessor के साथ Custom OTEL Collector बनाना

**पूर्वापेक्षाएं**: Go (संस्करण 1.21 या बाद का) इंस्टॉल करें।

**चरण 1: OpenTelemetry Collector Builder (ocb) इंस्टॉल करें**

नवीनतम बाइनरी के लिए, [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases) देखें।

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**चरण 2: Builder Manifest फ़ाइल बनाएं**

`builder-config.yaml` बनाएं:
```yaml
dist:
  name: otelcol-appsignals
  description: OTel Collector for Application Signals
  output_path: ./otelcol-appsignals
exporters:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - gomod: go.opentelemetry.io/collector/exporter/otlphttpexporter v0.113.0
processors:
  - gomod: github.com/amazon-contributing/opentelemetry-collector-contrib/processor/awsapplicationsignalsprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/resourcedetectionprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricstransformprocessor v0.113.0
receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.113.0
extensions:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/awsproxy v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/sigv4authextension v0.113.0
replaces:
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - github.com/openshift/api v3.9.0+incompatible => github.com/openshift/api v0.0.0-20180801171038-322a19404e37
```


**चरण 3: Collector कॉन्फ़िगरेशन उदाहरण**

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  awsapplicationsignals:
    resolvers:
      - platform: eks
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, awsapplicationsignals]
      exporters: [otlphttp/traces]
```

**चरण 4: Docker Image बनाएं**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## Upstream OpenTelemetry SDK + OTEL Collector

यह दृष्टिकोण मानक upstream OpenTelemetry SDK (ADOT नहीं) को OpenTelemetry Collector के साथ उपयोग करता है। यह अधिकतम वेंडर न्यूट्रैलिटी प्रदान करता है और ADOT द्वारा समर्थित नहीं भाषाओं (Erlang, Rust, Ruby, आदि) सहित किसी भी OpenTelemetry SDK वाली भाषा का समर्थन करता है। RED मेट्रिक्स सैंपल किए गए ट्रेस डेटा से X-Ray backend द्वारा सर्वर-साइड पर गणना की जाती हैं।

### प्रमुख लाभ
- **पूर्ण वेंडर न्यूट्रैलिटी** — क्लाइंट साइड पर कोई AWS-विशिष्ट SDK निर्भरता नहीं
- **कोई भी OTEL-समर्थित भाषा** — Erlang, Rust, Ruby, PHP, और अन्य सभी upstream OTEL SDKs के साथ काम करता है
- **मल्टी-क्लाउड और हाइब्रिड वातावरण** — एक ही SDK AWS, GCP, Azure, और ऑन-प्रिमाइसेस में काम करता है
- **मानक upstream OTEL Collector** मानक processors और exporters के साथ
- **मौजूदा OpenTelemetry निवेश** सुरक्षित — ADOT में माइग्रेशन की आवश्यकता नहीं
- **बहु-गंतव्य टेलीमेट्री** — किसी भी backend को एक साथ फैन-आउट

### आर्किटेक्चर

![Upstream OpenTelemetry SDK + OTEL Collector आर्किटेक्चर](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### Upstream OTEL SDK + Collector कैसे काम करता है

**चरण 1: एप्लिकेशन Instrumentation**

मानक upstream OpenTelemetry SDK के साथ आपका एप्लिकेशन instrument होता है। यह semantic conventions (`http.method`, `http.route`, `http.status_code`, आदि) के साथ मानक OTEL spans उत्पन्न करता है।

**चरण 2: क्लाइंट-साइड सैंपलिंग**

OTEL SDK आपकी कॉन्फ़िगर की गई सैंपलिंग रणनीति लागू करता है। सटीक RED मेट्रिक्स के लिए, आपको `always_on` सैंपलिंग (100%) की आवश्यकता है क्योंकि मेट्रिक्स केवल सैंपल किए गए traces से सर्वर-साइड पर गणना की जाती हैं। आंशिक सैंपलिंग के साथ, आपकी RED मेट्रिक्स केवल सैंपल किए गए उपसमूह को दर्शाएंगी।

**चरण 3: मानक OTEL Collector प्रोसेसिंग Pipeline**

Collector मानक upstream processors का उपयोग करता है:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
```


**चरण 4: सर्वर-साइड RED मेट्रिक्स गणना**

चूंकि upstream OTEL SDK क्लाइंट-साइड पर RED मेट्रिक्स की गणना नहीं करता, X-Ray frontend प्राप्त सैंपल किए गए traces से उन्हें सर्वर-साइड पर गणना करता है:
1. **Rate**: सैंपल किए गए span डेटा से निकाली गई अनुरोध संख्या
2. **Errors**: सैंपल किए गए span status codes से पहचानी गई त्रुटि संख्या
3. **Duration**: सैंपल किए गए span शुरू/समाप्त समय से गणना की गई लेटेंसी

:::warning
RED मेट्रिक्स की सटीकता पूरी तरह आपकी सैंपलिंग दर पर निर्भर करती है। 5% सैंपलिंग के साथ, आपको केवल 5% ट्रैफिक की मेट्रिक्स मिलती हैं। इस दृष्टिकोण के साथ सटीक RED मेट्रिक्स के लिए, 100% सैंपलिंग कॉन्फ़िगर करें।
:::

**चरण 5: एनालिटिक्स और विज़ुअलाइज़ेशन**
- **Application Signals**: सर्वर-गणना RED मेट्रिक्स से golden signals के साथ Application Maps (सटीकता सैंपलिंग दर पर निर्भर)
- **Transaction Search**: CloudWatch Logs (`aws/spans`) से span डेटा क्वेरी
- **X-Ray Analytics**: इंडेक्स किए गए spans पर पारंपरिक ट्रेस विश्लेषण

### ADOT SDK दृष्टिकोण से प्रमुख अंतर

| पहलू | ADOT SDK + Custom Collector | Upstream OTEL SDK + Collector |
|---|---|---|
| **RED मेट्रिक्स** | क्लाइंट-साइड, 100% ट्रैफिक | सर्वर-साइड, केवल सैंपल किया गया ट्रैफिक |
| **`aws.*` span attributes** | ADOT SDK द्वारा इंजेक्ट | मौजूद नहीं |
| **भाषा समर्थन** | Java, Python, .NET, Node.js | कोई भी OTEL-समर्थित भाषा |
| **Collector बिल्ड** | App Signals Processor के साथ कस्टम बिल्ड | मानक upstream collector बिल्ड |
| **सटीक मेट्रिक्स के लिए 100% सैंपलिंग आवश्यक** | नहीं | हां |

### Collector कॉन्फ़िगरेशन उदाहरण

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/traces]
```


## Collector-less Tracing with OTLP Endpoints

यह दृष्टिकोण logs और traces को सीधे CloudWatch OTLP endpoints पर भेजकर न्यूनतम इंफ्रास्ट्रक्चर जटिलता और कम resource overhead प्रदान करता है।

### Collector-less Tracing क्यों चुनें

Collector-less tracing तब आदर्श है जब आप अधिकतम resource उपयोग के साथ सबसे सरल संभव आर्किटेक्चर चाहते हैं। AWS endpoints पर सीधे डेटा भेजकर, आप अतिरिक्त इंफ्रास्ट्रक्चर घटकों और उनके संबंधित प्रबंधन overhead को समाप्त कर देते हैं।

### आर्किटेक्चर

![Collector-less आर्किटेक्चर](/apm-src/assets/images/deep-dive/collectorless.png)

### Collector-less Tracing कैसे काम करता है

**चरण 1: एप्लिकेशन Instrumentation**

आपका एप्लिकेशन ADOT SDK के साथ स्वचालित रूप से instrument होता है। यह कोड परिवर्तन की आवश्यकता के बिना OpenTelemetry फॉर्मेट में logs और traces कैप्चर करता है।

**चरण 2: लोकल SDK सैंपलिंग (डिफ़ॉल्ट ParentBased/AlwaysOn 100%)**

X-Ray remote sampler को सैंपलिंग नियम लाने के लिए एक लोकल proxy (CloudWatch Agent या [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling)) की आवश्यकता होती है। यह `http://localhost:2000/GetSamplingRules` और `http://localhost:2000/SamplingTargets` को कॉल करके कॉन्फ़िगर किए गए नियम लाता है। Collector-less मोड में, कोई लोकल proxy नहीं चल रही होती, इसलिए ADOT SDK इन endpoints तक नहीं पहुंच सकता। परिणामस्वरूप, SDK चुपचाप अपनी डिफ़ॉल्ट सैंपलिंग रणनीति पर वापस आ जाता है: **ParentBased(AlwaysOn) 100%**।

:::tip लागत प्रबंधन के लिए सैंपलिंग दर नियंत्रित करें
चूंकि collector-less मोड में X-Ray remote sampling अनुपलब्ध है, आप ट्रेस वॉल्यूम और लागत कम करने के लिए environment variables का उपयोग करके लोकल सैंपलिंग रणनीति कॉन्फ़िगर कर सकते हैं:

```bash
# TraceIdRatioBased sampler को 5% पर उपयोग करें (आवश्यकतानुसार अनुपात समायोजित करें)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# या आने वाले trace context का सम्मान करने के लिए parentbased_traceidratio उपयोग करें
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

इन variables के बिना, SDK `parentbased_always_on` (100% सैंपलिंग) पर डिफ़ॉल्ट होता है, जो सभी traces भेजता है और उच्च-थ्रूपुट एप्लिकेशन के लिए CloudWatch और X-Ray लागत बढ़ा सकता है।
:::

**चरण 3: AWS से सीधा संचार**

Collector के बजाय, आपका डेटा SigV4 प्रमाणीकरण के साथ सीधे AWS सर्विसेज को जाता है:
- **Logs** → OTLP HTTP के माध्यम से `https://logs.<region>.amazonaws.com/v1/logs`
- **Traces** → OTLP HTTP के माध्यम से `https://xray.<region>.amazonaws.com/v1/traces`

**चरण 4: सर्वर-साइड RED मेट्रिक्स गणना**

X-Ray frontend प्राप्त traces का विश्लेषण करके AWS backend पर RED मेट्रिक्स की गणना करता है। चूंकि collector-less मोड में SDK डिफ़ॉल्ट रूप से 100% सैंपलिंग करता है, सर्वर-साइड RED मेट्रिक्स सभी ट्रैफिक पर गणना की जाती हैं।

**चरण 5: एनालिटिक्स विकल्प**
- **Application Signals**: सर्वर-गणना RED मेट्रिक्स से golden signals और डायनामिक ग्रुपिंग के साथ Application Maps
- **Transaction Search**: CloudWatch Logs (`aws/spans`) से पूर्ण span डेटा क्वेरी
- **X-Ray Analytics**: इंडेक्स किए गए spans पर पारंपरिक ट्रेस विश्लेषण

### महत्वपूर्ण विचार
- **Transaction Search आवश्यक है** — OTLP endpoints उपयोग करते समय आपको इसे सक्षम करना होगा
- **ADOT SDK आवश्यक है** — सामान्य OpenTelemetry SDK इस दृष्टिकोण के लिए काम नहीं करेगा
- **प्रमाणीकरण स्वचालित है** — ADOT SDK AWS SigV4 प्रमाणीकरण संभालता है
- **X-Ray remote sampling नहीं** — लोकल proxy के बिना, SDK X-Ray सैंपलिंग नियम नहीं ला सकता और 100% सैंपलिंग (ParentBased/AlwaysOn) पर डिफ़ॉल्ट होता है
- **लागत प्रभाव** — चूंकि सभी traces भेजे जाते हैं (100% सैंपलिंग), उच्च-थ्रूपुट सर्विसेज के लिए अपनी CloudWatch और X-Ray लागत की निगरानी करें


## Existing X-Ray SDK + X-Ray Daemon (End of Support Timeline)

:::danger X-Ray SDK और Daemon सपोर्ट समाप्ति सूचना
**AWS X-Ray SDKs और Daemon का GA 25 फरवरी, 2026 को समाप्त हो गया और अब maintenance mode में है।**

| SDK और Daemon चरण | प्रारंभ तिथि | समाप्ति तिथि | प्रदान किया गया समर्थन |
|---|---|---|---|
| **General Availability** | लागू नहीं | 25 फरवरी, 2026 | X-Ray SDKs और Daemon पूरी तरह समर्थित हैं। AWS बग और सुरक्षा सुधारों सहित नियमित SDK और Daemon रिलीज़ प्रदान करता है। |
| **Maintenance Mode** | 25 फरवरी, 2026 | लागू नहीं | AWS केवल सुरक्षा मुद्दों को संबोधित करने के लिए X-Ray SDK और Daemon रिलीज़ प्रदान करेगा। SDKs/Daemon को नई सुविधा संवर्धन प्राप्त नहीं होंगे। |

विवरण के लिए [X-Ray सपोर्ट समाप्ति टाइमलाइन](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) और [X-Ray से OpenTelemetry माइग्रेशन गाइड](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) देखें।
:::

![X-Ray आर्किटेक्चर](/apm-src/assets/images/deep-dive/X-ray.png)

यह दृष्टिकोण उन ऑर्गनाइज़ेशन्स के लिए उपयुक्त है जिनके पास मौजूदा X-Ray निवेश है और जो OpenTelemetry में अपने माइग्रेशन की योजना बनाते हुए धीरे-धीरे Application Signals क्षमताओं को अपनाना चाहते हैं।

### शुरुआत कैसे करें

1. अपने मौजूदा X-Ray डेटा के लिए **Transaction Search सक्षम करें**
2. लागत-प्रभावी विसंगति पहचान के लिए **100% सैंपलिंग कॉन्फ़िगर करें** या adaptive sampling उपयोग करें
3. **अपने माइग्रेशन की योजना बनाएं** — सर्विसेज को ADOT instrumentation में धीरे-धीरे माइग्रेट करना शुरू करें

## RED मेट्रिक्स गणना सारांश

विभिन्न instrumentation setups में RED (Rate, Errors, Duration) मेट्रिक्स कैसे गणना की जाती हैं, यह समझना सही दृष्टिकोण चुनने के लिए महत्वपूर्ण है:

| Instrumentation Setup | गणना विधि | Environment Variable | आवश्यकताएं |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | क्लाइंट-साइड | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | कोई नहीं - किसी भी सैंपलिंग के साथ काम करता है |
| **ADOT SDK + Custom OTEL Collector** | क्लाइंट-साइड | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | App Signals Processor के साथ Custom Collector |
| **Upstream OTEL SDK + OTEL Collector** | सर्वर-साइड | लागू नहीं (ADOT SDK नहीं) | Transaction Search + सटीकता के लिए 100% सैंपलिंग |
| **Collector-less (ADOT SDK)** | सर्वर-साइड | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false` (डिफ़ॉल्ट) | Transaction Search। डिफ़ॉल्ट 100% सैंपलिंग (लोकल proxy के बिना X-Ray remote sampling अनुपलब्ध) |
| **X-Ray SDK + X-Ray Daemon** | सर्वर-साइड (अनुमानित) | लागू नहीं | सैंपल किए गए डेटा पर आधारित |

### क्लाइंट-साइड RED मेट्रिक्स (ADOT SDK — CW Agent और Custom Collector दोनों)

```
Application → ADOT SDK → मेट्रिक्स गणना → CW Agent या Custom Collector → AWS
                ↓
            (100% अनुरोध)
```

- **गणना एप्लिकेशन में** किसी भी सैंपलिंग निर्णय से पहले होती है
- ट्रेस सैंपलिंग कॉन्फ़िगरेशन के बावजूद **हमेशा सटीक**
- `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` होने पर **डिफ़ॉल्ट व्यवहार**
- मेट्रिक्स गणना के लिए **Transaction Search निर्भरता नहीं**

### सर्वर-साइड RED मेट्रिक्स (Upstream OTEL SDK, Collector-less, X-Ray)

```
Application → Upstream OTEL SDK/Collector → AWS Backend → मेट्रिक्स गणना
                ↓
        (सटीकता के लिए 100% सैंपलिंग आवश्यक)
```

- **गणना AWS backend** (X-Ray frontend) पर प्राप्त span डेटा से होती है
- **OTLP-आधारित setups के लिए Transaction Search** सक्षम होना आवश्यक
- सटीक मेट्रिक्स के लिए **100% सैंपलिंग आवश्यक** (अनुमान लगाने वाले X-Ray को छोड़कर)

