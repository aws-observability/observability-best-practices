# வெவ்வேறு Instrumentation மற்றும் Collector அமைப்புகள்

விரைவு வழிசெலுத்தல்:

- [Instrumentation அணுகுமுறைகள்](#instrumentation-approaches)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + Custom OTEL Collector](#adot-sdk--custom-otel-collector)
- [Upstream OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [OTLP Endpoints-உடன் கலெக்டர்-இல்லா Tracing](#collector-less-tracing-with-otlp-endpoints)
- [ஏற்கனவே உள்ள X-Ray SDK + X-Ray Daemon (ஆதரவு முடிவு)](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [RED மெட்ரிக்குகள் கணக்கீடு சுருக்கம்](#red-metrics-calculation-summary)

---

## Instrumentation அணுகுமுறைகள்

### Auto-Instrumentation

**எப்போது பயன்படுத்த வேண்டும்:** விரைவாக தொடங்குதல், குறைந்தபட்ச குறியீடு மாற்றங்கள், production rollouts

**யார் பயன்படுத்த வேண்டும்:** DevOps குழுக்கள், platform பொறியாளர்கள், வேகத்திற்கு முன்னுரிமை அளிக்கும் நிறுவனங்கள்

**நன்மைகள்:**
- குறியீடு மாற்றங்கள் தேவையில்லை
- மதிப்பை விரைவாக பெறலாம்
- பொதுவான frameworks-ஐ தானாகவே கவர் செய்கிறது
- தேவைப்பட்டால் எளிதாக திரும்பப் பெறலாம்

**வரம்புகள்:**
- என்ன instrument செய்யப்படுகிறது என்பதில் குறைந்த கட்டுப்பாடு
- தேவைக்கு அதிகமான தரவை capture செய்யலாம்
- தனிப்பயன் வணிக logic-க்கு கூடுதல் manual instrumentation தேவை

### Manual OpenTelemetry Instrumentation

**எப்போது பயன்படுத்த வேண்டும்:** தனிப்பயன் வணிக மெட்ரிக்குகள், vendor portability, நுணுக்கமான கட்டுப்பாடு

**யார் பயன்படுத்த வேண்டும்:** பயன்பாட்டு developers, observability நிபுணத்துவமுள்ள குழுக்கள்

**நன்மைகள்:**
- Telemetry தரவின் மீது முழுமையான கட்டுப்பாடு
- வணிக logic-க்கான தனிப்பயன் spans மற்றும் attributes
- Vendor-நடுநிலை (மற்ற APM கருவிகளுடன் வேலை செய்யும்)
- செயல்திறன் தாக்கத்தின் மீது துல்லியமான கட்டுப்பாடு

**Trade-offs:**
- குறியீடு மாற்றங்கள் தேவை
- செயல்படுத்துவது மிகவும் சிக்கலானது
- குறியீடு வளரும்போது தொடர்ந்து பராமரிப்பு தேவை

---

## Instrumentation + Collector Setup விருப்பங்கள்

## ADOT SDK + CloudWatch Agent

இந்த அணுகுமுறை ஆழமான சேவை ஒருங்கிணைப்பு மற்றும் AWS infrastructure மெட்ரிக்குகளுடன் தானியங்கி தொடர்புடன் மிகவும் ஒருங்கிணைந்த AWS அனுபவத்தை வழங்குகிறது.

### முக்கிய நன்மைகள்
- **அழைப்பு அளவு, கிடைக்கும் தன்மை, latency, faults மற்றும் errors போன்ற மெட்ரிக்குகள்** sampling முடிவிற்கு முன் கிளையன்ட்-பக்கத்தில் 100% கோரிக்கைகளில் கணக்கிடப்படுகின்றன
- **X-Ray Sampling ஒருங்கிணைப்பு** இயல்பாக X-Ray sampling rules-ஐ பயன்படுத்துகிறது (தேவைப்பட்டால் 100%-க்கு கட்டமைக்கவும்)
- **உடனடி CloudWatch Logs ஒருங்கிணைப்பு** seamless log correlation-க்கு
- **முழு AWS ஆதரவு** முழு observability stack-க்கும்
- **தானியங்கி service discovery** மற்றும் golden signals

### கட்டமைப்பு

![ADOT SDK + CloudWatch Agent கட்டமைப்பு](/apm-src/assets/images/deep-dive/adotcw.png)

### ADOT SDK + CloudWatch Agent எவ்வாறு வேலை செய்கிறது

**படி 1: பயன்பாட்டு Instrumentation**

ADOT SDK-ஐ deploy செய்யும்போது, குறியீடு மாற்றங்கள் தேவையின்றி உங்கள் பயன்பாட்டை தானாகவே instrument செய்கிறது. ADOT SDK runtime-ல் ஒரு பயன்பாட்டில் dynamically code-ஐ inject செய்கிறது, manual குறியீடு மாற்றங்கள் தேவையின்றி. இந்த inject செய்யப்பட்ட code ஆதரிக்கப்படும் frameworks-க்கான அழைப்புகளை தானாக கண்டறிந்து, ஒவ்வொரு operation-க்கும் spans-ஐ உருவாக்கி, முழுமையான trace-ஐ உருவாக்க சேவைகள் முழுவதும் context-ஐ propagate செய்கிறது.

**படி 2: Sampling முடிவு**

ஒவ்வொரு கோரிக்கைக்கும், ADOT SDK முழு trace தரவை அனுப்ப வேண்டுமா என்று முடிவெடுக்க உங்கள் X-Ray sampling rules-ஐ சரிபார்க்கிறது. செலவு சேமிப்புக்கு 5% முதல் முழுமையான தெரிவுநிலைக்கு 100% வரை இதை கட்டமைக்கலாம்.

**படி 3: கிளையன்ட்-பக்க மெட்ரிக்குகள் கணக்கீடு**

இதோ முக்கிய நன்மை: sampling நடப்பதற்கு முன், `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` இருக்கும்போது SDK 100% கோரிக்கைகளில் RED (Requests, Errors, Duration) மெட்ரிக்குகளை கணக்கிடுகிறது. இதன் பொருள் குறைந்த sampling rates-உடன் கூட முழுமையான golden signals கிடைக்கும்:
- **Rate**: நேர சாளரத்திற்கான கோரிக்கைகளின் எண்ணிக்கை
- **Errors**: பிழை status codes (4xx/5xx) கொண்ட கோரிக்கைகளின் எண்ணிக்கை
- **Duration**: கோரிக்கை தொடக்கம்/முடிவு நேரங்களிலிருந்து latency அளவீடுகள்

**படி 4: CloudWatch Agent செயலாக்கம்**

ADOT SDK sampled spans மற்றும் முன்-கணக்கிடப்பட்ட மெட்ரிக்குகள் இரண்டையும் CloudWatch Agent-க்கு அனுப்புகிறது, இது ஒரு pipeline மூலம் செயலாக்குகிறது:

![ADOT SDK CloudWatch Agent விரிவான Pipeline](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver**: உங்கள் பயன்பாட்டிலிருந்து traces மற்றும் மெட்ரிக்குகளை ஏற்றுக்கொள்கிறது
- **Resource Detector**: AWS resource info-ஐ (instance IDs, container details) சேர்க்கிறது
- **APM Processor**: Platform-குறிப்பிட்ட metadata-வுடன் spans-ஐ செறிவூட்டுகிறது
- **Exporters**: X-Ray-க்கு (spans) மற்றும் CloudWatch-க்கு (மெட்ரிக்குகள்) தரவை routing செய்கிறது

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**படி 5: தரவு விநியோகம்**

உங்கள் தரவு மூன்று வழிகளில் பிரிகிறது:
- **மெட்ரிக்குகள்** → Application Maps-க்கான `/aws/application-signals/data` log group
- **Spans** → Transaction Search-க்கான `aws/spans` log group
- **Indexed spans** → பாரம்பரிய trace analysis-க்கான X-Ray backend

**படி 6: பகுப்பாய்வு விருப்பங்கள்**

இது உங்கள் தரவை பகுப்பாய்வு செய்ய மூன்று வழிகளை வழங்குகிறது:
- **Application Signals**: முழுமையான மெட்ரிக்குகளிலிருந்து dynamic grouping மற்றும் golden signals-உடன் Application Maps
- **Transaction Search**: மேம்பட்ட filters-உடன் அனைத்து span தரவையும் query செய்யவும்
- **X-Ray Analytics**: indexed spans-ல் பாரம்பரிய trace analysis

### செயல்படுத்தல் வழிகாட்டிகள்

Platform-குறிப்பிட்ட setup வழிகாட்டிகளைப் பின்பற்றவும்:
- [Amazon EKS-ல் Application Signals-ஐ இயக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [Amazon ECS-ல் Application Signals-ஐ இயக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [Amazon EC2-ல் Application Signals-ஐ இயக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [Self hosted Kubernetes-ல் Application Signals-ஐ இயக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals Demo repository](https://github.com/aws-observability/application-signals-demo)

முடிந்ததும், Application Signals console-ல் service discovery மற்றும் golden signals-ஐ சரிபார்க்கவும்.


## ADOT SDK + Custom OTEL Collector

இந்த அணுகுமுறை ADOT SDK-யின் கிளையன்ட்-பக்க RED மெட்ரிக்குகள் கணக்கீட்டை AWS Application Signals Processor-ஐ உள்ளடக்கிய தனிப்பயனாக உருவாக்கப்பட்ட OpenTelemetry Collector-ன் நெகிழ்வுத்தன்மையுடன் இணைக்கிறது. CloudWatch Agent அணுகுமுறையைப் போலவே அதே துல்லியமான 100%-போக்குவரத்து மெட்ரிக்குகள் கிடைக்கும், கூடுதலாக telemetry-ஐ பல இலக்குகளுக்கு fan out செய்யும் திறனும் உண்டு.

### முக்கிய நன்மைகள்
- **ADOT SDK வழியாக 100% கோரிக்கைகளில் கிளையன்ட்-பக்க RED மெட்ரிக்குகள்** (CW Agent அணுகுமுறையைப் போலவே) — மெட்ரிக்குகள் sampling-க்கு முன் கணக்கிடப்படுகின்றன
- **பல-இலக்கு டெலிமெட்ரி** — AWS, Datadog, Prometheus போன்றவற்றுக்கு ஒரே நேரத்தில் fan out செய்யலாம்
- **App Signals Processor** `aws.local.*` / `aws.remote.*` attributes-ஐ normalize செய்கிறது, platform context-ஐ resolve செய்கிறது, cardinality-ஐ கட்டுப்படுத்துகிறது
- **Collector pipeline மீது முழு கட்டுப்பாடு** — தனிப்பயன் processors, filters மற்றும் exporters சேர்க்கலாம்

### கட்டமைப்பு

![ADOT SDK + Custom OTEL Collector கட்டமைப்பு](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### ADOT SDK + Custom OTEL Collector எவ்வாறு வேலை செய்கிறது

**படி 1: பயன்பாட்டு Instrumentation**

உங்கள் பயன்பாடு ADOT SDK-யுடன் instrument செய்யப்படுகிறது, இது runtime மெட்ரிக்குகள், logs மற்றும் traces-ஐ OpenTelemetry format-ல் capture செய்கிறது. ADOT SDK App Signals Processor சார்ந்திருக்கும் AWS-குறிப்பிட்ட span attributes (`aws.local.service`, `aws.local.operation`, `aws.remote.service`, `aws.remote.operation` போன்றவை)-ஐ inject செய்கிறது.

**படி 2: கிளையன்ட்-பக்க RED மெட்ரிக்குகள் கணக்கீடு**

`OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` இருக்கும்போது, ADOT SDK எந்த sampling முடிவிற்கும் **முன்** 100% கோரிக்கைகளில் RED மெட்ரிக்குகளை கணக்கிடுகிறது:
- **Rate**: நேர சாளரத்திற்கான கோரிக்கைகளின் எண்ணிக்கை
- **Errors**: பிழை status codes (4xx/5xx) கொண்ட கோரிக்கைகளின் எண்ணிக்கை
- **Duration**: கோரிக்கை தொடக்கம்/முடிவு நேரங்களிலிருந்து latency அளவீடுகள்

**படி 3: Sampling முடிவு**

ADOT SDK உங்கள் கட்டமைக்கப்பட்ட sampling strategy-ஐ (X-Ray sampling rules அல்லது local sampling) பொருத்துகிறது. Sample செய்யப்பட்ட traces மட்டுமே collector-க்கு அனுப்பப்படும், ஆனால் RED மெட்ரிக்குகள் ஏற்கனவே 100% போக்குவரத்தில் கணக்கிடப்பட்டுள்ளன.


**படி 4: Custom OpenTelemetry Collector Processing Pipeline**

**OTLP Receivers (தரவு உள்ளீடு)**
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

இந்த processor ADOT SDK inject செய்யும் `aws.local.*` / `aws.remote.*` span attributes-உடன் வேலை செய்கிறது. இது செய்வது:
1. **Attribute Resolution**: Platform-குறிப்பிட்ட resolvers பயன்படுத்தி telemetry-ஐ platform context-உடன் செறிவூட்டுகிறது
2. **Attribute Normalization**: ADOT SDK attributes-ஐ CloudWatch metric dimension names-ஆக மறுபெயரிடுகிறது
3. **Cardinality Control**: பயனர்-கட்டமைக்கப்பட்ட `keep`/`drop`/`replace` rules-ஐ பொருத்துகிறது
4. **Application Map Generation**: Dynamic grouping-உடன் topology தரவை உருவாக்குகிறது

**படி 5: Export Processing**

Exporters தரவை SigV4 authentication-உடன் AWS EMF (மெட்ரிக்குகள்), OTLP HTTP (logs) மற்றும் OTLP HTTP (traces) endpoints-க்கு routing செய்கின்றன.

**படி 6: Backend Processing**
1. CloudWatch Logs: EMF logs-லிருந்து மெட்ரிக்குகளை extract செய்கிறது, `aws/spans`-ல் span தரவை சேமிக்கிறது
2. X-Ray Backend: Trace analytics-க்காக spans-ன் configurable சதவீதத்தை index செய்கிறது

**படி 7: பகுப்பாய்வு மற்றும் காட்சிப்படுத்தல்**
- **Application Signals**: Sampling-ஐ பொருட்படுத்தாமல் 100% போக்குவரத்தில் துல்லியமான கிளையன்ட்-பக்க கணக்கிடப்பட்ட RED மெட்ரிக்குகளை பயன்படுத்துகிறது
- **Transaction Search**: CloudWatch Logs-லிருந்து span தரவை queries செய்கிறது
- **X-Ray Analytics**: indexed spans-ல் பாரம்பரிய trace analysis


### awsapplicationsignalsprocessor-உடன் Custom OTEL Collector உருவாக்குதல்

**முன்நிபந்தனைகள்**: Go (பதிப்பு 1.21 அல்லது அதற்கு மேல்) நிறுவவும்.

**படி 1: OpenTelemetry Collector Builder (ocb) நிறுவவும்**

சமீபத்திய binaries-க்கு, [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases) ஐ பார்க்கவும்.

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**படி 2: Builder Manifest File உருவாக்கவும்**

`builder-config.yaml` உருவாக்கவும்:
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


**படி 3: Sample Collector கட்டமைப்பு**

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

**படி 4: Docker Image உருவாக்கவும்**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## Upstream OpenTelemetry SDK + OTEL Collector

இந்த அணுகுமுறை நிலையான upstream OpenTelemetry SDK-ஐ (ADOT அல்ல) OpenTelemetry Collector-உடன் பயன்படுத்துகிறது. இது அதிகபட்ச vendor neutrality-ஐ வழங்குகிறது, ADOT ஆதரிக்காத மொழிகள் உட்பட (Erlang, Rust, Ruby போன்றவை) OpenTelemetry SDK கொண்ட எந்த மொழியையும் ஆதரிக்கிறது. RED மெட்ரிக்குகள் sampled trace தரவிலிருந்து X-Ray backend-ல் சர்வர்-பக்கத்தில் கணக்கிடப்படுகின்றன.

### முக்கிய நன்மைகள்
- **முழு vendor neutrality** — கிளையன்ட் பக்கத்தில் AWS-குறிப்பிட்ட SDK dependency இல்லை
- **எந்த OTEL-ஆதரிக்கப்படும் மொழியும்** — Erlang, Rust, Ruby, PHP மற்றும் அனைத்து upstream OTEL SDK-களுடனும் வேலை செய்யும்
- **Multi-cloud மற்றும் hybrid சூழல்கள்** — AWS, GCP, Azure மற்றும் on-premises முழுவதும் ஒரே SDK வேலை செய்யும்
- **நிலையான upstream OTEL Collector** நிலையான processors மற்றும் exporters-உடன்
- **ஏற்கனவே உள்ள OpenTelemetry முதலீடுகள்** பாதுகாக்கப்படுகின்றன — ADOT-க்கு migration தேவையில்லை
- **பல-இலக்கு டெலிமெட்ரி** — எந்த backend-க்கும் ஒரே நேரத்தில் fan out செய்யலாம்

### கட்டமைப்பு

![Upstream OpenTelemetry SDK + OTEL Collector கட்டமைப்பு](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### Upstream OTEL SDK + Collector எவ்வாறு வேலை செய்கிறது

**படி 1: பயன்பாட்டு Instrumentation**

உங்கள் பயன்பாடு நிலையான upstream OpenTelemetry SDK-யுடன் instrument செய்யப்படுகிறது. இது semantic conventions (`http.method`, `http.route`, `http.status_code` போன்றவை)-உடன் நிலையான OTEL spans-ஐ உருவாக்குகிறது.

**படி 2: கிளையன்ட்-பக்க Sampling**

OTEL SDK உங்கள் கட்டமைக்கப்பட்ட sampling strategy-ஐ பொருத்துகிறது. துல்லியமான RED மெட்ரிக்குகளுக்கு, `always_on` sampling (100%) தேவை, ஏனெனில் மெட்ரிக்குகள் sampled traces-லிருந்து மட்டுமே சர்வர்-பக்கத்தில் கணக்கிடப்படுகின்றன. பகுதி sampling-உடன், உங்கள் RED மெட்ரிக்குகள் sampled subset-ஐ மட்டுமே பிரதிபலிக்கும்.

**படி 3: நிலையான OTEL Collector Processing Pipeline**

Collector நிலையான upstream processors-ஐ பயன்படுத்துகிறது:

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


**படி 4: சர்வர்-பக்க RED மெட்ரிக்குகள் கணக்கீடு**

Upstream OTEL SDK கிளையன்ட்-பக்கத்தில் RED மெட்ரிக்குகளை கணக்கிடாததால், X-Ray frontend அது பெறும் sampled traces-லிருந்து சர்வர்-பக்கத்தில் கணக்கிடுகிறது:
1. **Rate**: sampled span தரவிலிருந்து extract செய்யப்பட்ட கோரிக்கை எண்ணிக்கைகள்
2. **Errors**: sampled span status codes-லிருந்து அடையாளம் காணப்பட்ட பிழை எண்ணிக்கைகள்
3. **Duration**: sampled span தொடக்கம்/முடிவு நேரங்களிலிருந்து கணக்கிடப்பட்ட latency

:::warning
RED மெட்ரிக்குகள் துல்லியம் உங்கள் sampling rate-ஐ முழுமையாக சார்ந்துள்ளது. 5% sampling-உடன், 5% போக்குவரத்தில் மட்டுமே மெட்ரிக்குகள் கிடைக்கும். இந்த அணுகுமுறையுடன் துல்லியமான RED மெட்ரிக்குகளுக்கு, 100% sampling-ஐ கட்டமைக்கவும்.
:::

**படி 5: பகுப்பாய்வு மற்றும் காட்சிப்படுத்தல்**
- **Application Signals**: சர்வர்-கணக்கிடப்பட்ட RED மெட்ரிக்குகளிலிருந்து golden signals-உடன் Application Maps (துல்லியம் sampling rate-ஐ சார்ந்தது)
- **Transaction Search**: CloudWatch Logs-லிருந்து (`aws/spans`) span தரவை query செய்கிறது
- **X-Ray Analytics**: indexed spans-ல் பாரம்பரிய trace analysis

### ADOT SDK அணுகுமுறையிலிருந்து முக்கிய வேறுபாடுகள்

| அம்சம் | ADOT SDK + Custom Collector | Upstream OTEL SDK + Collector |
|---|---|---|
| **RED மெட்ரிக்குகள்** | கிளையன்ட்-பக்கம், 100% போக்குவரத்து | சர்வர்-பக்கம், sampled போக்குவரத்து மட்டும் |
| **`aws.*` span attributes** | ADOT SDK-ஆல் inject செய்யப்படும் | இல்லை |
| **மொழி ஆதரவு** | Java, Python, .NET, Node.js | எந்த OTEL-ஆதரிக்கப்படும் மொழியும் |
| **Collector build** | App Signals Processor-உடன் Custom build | நிலையான upstream collector build |
| **துல்லியமான மெட்ரிக்குகளுக்கு 100% sampling தேவையா** | இல்லை | ஆம் |

### Sample Collector கட்டமைப்பு

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


## OTLP Endpoints-உடன் கலெக்டர்-இல்லா Tracing

இந்த அணுகுமுறை logs மற்றும் traces-ஐ நேரடியாக CloudWatch OTLP endpoints-க்கு அனுப்புவதன் மூலம் குறைந்தபட்ச உள்கட்டமைப்பு சிக்கலான தன்மை மற்றும் குறைக்கப்பட்ட resource overhead-ஐ வழங்குகிறது.

### கலெக்டர்-இல்லா Tracing-ஐ ஏன் தேர்வு செய்ய வேண்டும்

கலெக்டர்-இல்லா tracing நீங்கள் எளிமையான கட்டமைப்பு மற்றும் அதிகபட்ச resource utilization-ஐ விரும்பும்போது சரியானது. AWS endpoints-க்கு நேரடியாக தரவை அனுப்புவதன் மூலம், கூடுதல் உள்கட்டமைப்பு components மற்றும் அவற்றின் தொடர்புடைய management overhead-ஐ நீக்கலாம்.

### கட்டமைப்பு

![கலெக்டர்-இல்லா கட்டமைப்பு](/apm-src/assets/images/deep-dive/collectorless.png)

### கலெக்டர்-இல்லா Tracing எவ்வாறு வேலை செய்கிறது

**படி 1: பயன்பாட்டு Instrumentation**

உங்கள் பயன்பாடு ADOT SDK-யுடன் தானாகவே instrument செய்யப்படுகிறது. எந்த குறியீடு மாற்றங்களும் தேவையின்றி OpenTelemetry format-ல் logs மற்றும் traces-ஐ capture செய்கிறது.

**படி 2: Local SDK Sampling (ParentBased/AlwaysOn 100% இயல்பாக)**

X-Ray remote sampler sampling rules-ஐ fetch செய்ய உள்ளூர் proxy (CloudWatch Agent அல்லது [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling)) தேவைப்படுகிறது. இது கட்டமைக்கப்பட்ட rules-ஐ retrieve செய்ய `http://localhost:2000/GetSamplingRules` மற்றும் `http://localhost:2000/SamplingTargets`-ஐ அழைக்கிறது. கலெக்டர்-இல்லா நிலையில், உள்ளூர் proxy இயங்கவில்லை, எனவே ADOT SDK இந்த endpoints-ஐ அணுக முடியாது. இதன் விளைவாக, SDK அமைதியாக அதன் இயல்பு sampling strategy-க்கு மாறும்: **ParentBased(AlwaysOn) 100%**.

:::tip செலவுகளை நிர்வகிக்க Sampling Rate-ஐ கட்டுப்படுத்தவும்
கலெக்டர்-இல்லா நிலையில் X-Ray remote sampling கிடைக்காததால், trace volume மற்றும் செலவுகளை குறைக்க environment variables பயன்படுத்தி local sampling strategy-ஐ கட்டமைக்கலாம்:

```bash
# 5%-ல் TraceIdRatioBased sampler பயன்படுத்தவும் (ratio-ஐ தேவைக்கேற்ப சரிசெய்யவும்)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# அல்லது incoming trace context-ஐ மதிக்க parentbased_traceidratio பயன்படுத்தவும்
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

இந்த variables இல்லாமல், SDK இயல்பாக `parentbased_always_on` (100% sampling)-க்கு மாறும், இது அனைத்து traces-ஐ அனுப்பும் மற்றும் அதிக throughput பயன்பாடுகளுக்கு CloudWatch மற்றும் X-Ray செலவுகளை அதிகரிக்கலாம்.
:::

**படி 3: நேரடி AWS தொடர்பு**

Collector வழியாக செல்வதற்கு பதிலாக, உங்கள் தரவு SigV4 authentication-உடன் நேரடியாக AWS சேவைகளுக்கு செல்கிறது:
- **Logs** → `https://logs.<region>.amazonaws.com/v1/logs` OTLP HTTP வழியாக
- **Traces** → `https://xray.<region>.amazonaws.com/v1/traces` OTLP HTTP வழியாக

**படி 4: சர்வர்-பக்க RED மெட்ரிக்குகள் கணக்கீடு**

X-Ray frontend பெறப்பட்ட traces-ஐ பகுப்பாய்வு செய்து AWS backend-ல் RED மெட்ரிக்குகளை கணக்கிடுகிறது. கலெக்டர்-இல்லா நிலையில் SDK இயல்பாக 100% sampling-க்கு மாறுவதால், சர்வர்-பக்க RED மெட்ரிக்குகள் அனைத்து போக்குவரத்திலும் கணக்கிடப்படுகின்றன.

**படி 5: பகுப்பாய்வு விருப்பங்கள்**
- **Application Signals**: சர்வர்-கணக்கிடப்பட்ட RED மெட்ரிக்குகளிலிருந்து dynamic grouping மற்றும் golden signals-உடன் Application Maps
- **Transaction Search**: CloudWatch Logs-லிருந்து (`aws/spans`) முழுமையான span தரவை query செய்யவும்
- **X-Ray Analytics**: indexed spans-ல் பாரம்பரிய trace analysis

### முக்கிய கருத்தில் கொள்ள வேண்டியவை
- **Transaction Search அவசியம்** — OTLP endpoints பயன்படுத்தும்போது இதை இயக்க வேண்டும்
- **ADOT SDK அவசியம்** — இந்த அணுகுமுறைக்கு சாதாரண OpenTelemetry SDK வேலை செய்யாது
- **Authentication தானியங்கி** — ADOT SDK AWS SigV4 authentication-ஐ கையாளுகிறது
- **X-Ray remote sampling இல்லை** — உள்ளூர் proxy இல்லாமல், SDK X-Ray sampling rules-ஐ fetch செய்ய முடியாது, இயல்பாக 100% sampling-க்கு மாறும் (ParentBased/AlwaysOn)
- **செலவு தாக்கங்கள்** — அனைத்து traces அனுப்பப்படுவதால் (100% sampling), அதிக throughput சேவைகளுக்கு உங்கள் CloudWatch மற்றும் X-Ray செலவுகளை கண்காணிக்கவும்


## ஏற்கனவே உள்ள X-Ray SDK + X-Ray Daemon (ஆதரவு முடிவு காலவரிசை)

:::danger X-Ray SDK மற்றும் Daemon ஆதரவு முடிவு அறிவிப்பு
**AWS X-Ray SDK-கள் மற்றும் Daemon GA பிப்ரவரி 25, 2026-ல் முடிவடைந்து இப்போது பராமரிப்பு நிலையில் உள்ளன.**

| SDK மற்றும் Daemon கட்டம் | தொடக்க தேதி | முடிவு தேதி | வழங்கப்படும் ஆதரவு |
|---|---|---|---|
| **General Availability** | N/A | பிப்ரவரி 25, 2026 | X-Ray SDK-கள் மற்றும் Daemon முழுமையாக ஆதரிக்கப்படுகின்றன. AWS பிழை மற்றும் பாதுகாப்பு fixes-ஐ உள்ளடக்கிய வழக்கமான SDK மற்றும் daemon releases-ஐ வழங்குகிறது. |
| **Maintenance Mode** | பிப்ரவரி 25, 2026 | N/A | AWS X-Ray SDK மற்றும் Daemon releases-ஐ பாதுகாப்பு சிக்கல்களுக்கு மட்டும் வரம்பிடும். SDK-கள்/Daemon புதிய feature enhancements பெறாது. |

விவரங்களுக்கு [X-Ray End of Support Timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) மற்றும் [X-Ray to OpenTelemetry Migration Guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) ஐ பார்க்கவும்.
:::

![X-Ray கட்டமைப்பு](/apm-src/assets/images/deep-dive/X-ray.png)

இந்த அணுகுமுறை ஏற்கனவே உள்ள X-Ray முதலீடுகளைக் கொண்ட நிறுவனங்களுக்கு பொருத்தமானது, அவை OpenTelemetry-க்கு தங்கள் migration-ஐ திட்டமிடும்போது Application Signals திறன்களை படிப்படியாக ஏற்றுக்கொள்ள விரும்புகின்றன.

### தொடங்குவது எப்படி

1. **Transaction Search-ஐ இயக்கவும்** உங்கள் ஏற்கனவே உள்ள X-Ray தரவுக்கு
2. **100% Sampling-ஐ கட்டமைக்கவும்** அல்லது செலவு-திறனான anomaly detection-க்கு adaptive sampling பயன்படுத்தவும்
3. **உங்கள் Migration-ஐ திட்டமிடுங்கள்** — சேவைகளை படிப்படியாக ADOT instrumentation-க்கு migrate செய்யத் தொடங்குங்கள்

## RED மெட்ரிக்குகள் கணக்கீடு சுருக்கம்

வெவ்வேறு instrumentation setups-ல் RED (Rate, Errors, Duration) மெட்ரிக்குகள் எவ்வாறு கணக்கிடப்படுகின்றன என்பதை புரிந்துகொள்வது சரியான அணுகுமுறையைத் தேர்ந்தெடுப்பதற்கு முக்கியமானது:

| Instrumentation Setup | கணக்கீடு முறை | Environment Variable | தேவைகள் |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | கிளையன்ட்-பக்கம் | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | எதுவும் இல்லை - எந்த sampling-உடனும் வேலை செய்யும் |
| **ADOT SDK + Custom OTEL Collector** | கிளையன்ட்-பக்கம் | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | App Signals Processor-உடன் Custom collector |
| **Upstream OTEL SDK + OTEL Collector** | சர்வர்-பக்கம் | N/A (ADOT SDK இல்லை) | Transaction Search + துல்லியத்திற்கு 100% sampling |
| **கலெக்டர்-இல்லா (ADOT SDK)** | சர்வர்-பக்கம் | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false` (இயல்பு) | Transaction Search. இயல்பாக 100% sampling (உள்ளூர் proxy இல்லாமல் X-Ray remote sampling கிடைக்காது) |
| **X-Ray SDK + X-Ray Daemon** | சர்வர்-பக்கம் (extrapolated) | N/A | sampled தரவின் அடிப்படையில் |

### கிளையன்ட்-பக்க RED மெட்ரிக்குகள் (ADOT SDK — CW Agent மற்றும் Custom Collector இரண்டும்)

```
Application → ADOT SDK → Calculate Metrics → CW Agent or Custom Collector → AWS
                ↓
            (100% of requests)
```

- **கணக்கீடு பயன்பாட்டில்** எந்த sampling முடிவுகளுக்கும் முன் நடக்கிறது
- Trace sampling configuration-ஐ பொருட்படுத்தாமல் **எப்போதும் துல்லியம்**
- `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` இருக்கும்போது **இயல்பு நடத்தை**
- மெட்ரிக்குகள் கணக்கீட்டிற்கு **Transaction Search dependency இல்லை**

### சர்வர்-பக்க RED மெட்ரிக்குகள் (Upstream OTEL SDK, கலெக்டர்-இல்லா, X-Ray)

```
Application → Upstream OTEL SDK/Collector → AWS Backend → Calculate Metrics
                ↓
        (துல்லியத்திற்கு 100% sampling தேவை)
```

- **கணக்கீடு AWS backend-ல்** (X-Ray frontend) பெறப்பட்ட span தரவிலிருந்து நடக்கிறது
- **OTLP-அடிப்படையிலான setups-க்கு Transaction Search** இயக்கப்பட வேண்டும்
- துல்லியமான மெட்ரிக்குகளுக்கு **100% sampling தேவை** (extrapolate செய்யும் X-Ray தவிர)
