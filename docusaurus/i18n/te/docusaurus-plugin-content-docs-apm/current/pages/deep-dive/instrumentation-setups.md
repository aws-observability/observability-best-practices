# విభిన్న Instrumentation మరియు Collector సెటప్‌లు

త్వరిత నావిగేషన్:

- [Instrumentation విధానాలు](#instrumentation-approaches)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + Custom OTEL Collector](#adot-sdk--custom-otel-collector)
- [Upstream OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [Collector-less Tracing with OTLP Endpoints](#collector-less-tracing-with-otlp-endpoints)
- [Existing X-Ray SDK + X-Ray Daemon (End of Support)](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [RED Metrics Calculation Summary](#red-metrics-calculation-summary)

---

## Instrumentation విధానాలు

### Auto-Instrumentation

**ఎప్పుడు ఉపయోగించాలి:** త్వరగా ప్రారంభించడం, కనీస కోడ్ మార్పులు, production rollouts

**ఎవరు ఉపయోగించాలి:** DevOps teams, platform engineers, వేగానికి ప్రాధాన్యత ఇచ్చే సంస్థలు

**ప్రయోజనాలు:**
- జీరో కోడ్ మార్పులు అవసరం
- విలువకు వేగవంతమైన సమయం
- సాధారణ frameworks ను స్వయంచాలకంగా కవర్ చేస్తుంది
- అవసరమైతే తిరిగి మార్చడం సులభం

**పరిమితులు:**
- ఏమి instrument అవుతుందో దానిపై తక్కువ నియంత్రణ
- అవసరమైన దాని కంటే ఎక్కువ డేటాను క్యాప్చర్ చేయవచ్చు
- కస్టమ్ వ్యాపార తర్కానికి అదనపు manual instrumentation అవసరం

### Manual OpenTelemetry Instrumentation

**ఎప్పుడు ఉపయోగించాలి:** కస్టమ్ business metrics, vendor portability, fine-grained నియంత్రణ

**ఎవరు ఉపయోగించాలి:** Application developers, observability నైపుణ్యం ఉన్న teams

**ప్రయోజనాలు:**
- టెలిమెట్రీ డేటాపై పూర్తి నియంత్రణ
- వ్యాపార తర్కం కోసం కస్టమ్ spans మరియు attributes
- Vendor-neutral (ఇతర APM tools తో పనిచేస్తుంది)
- Performance ప్రభావంపై ఖచ్చితమైన నియంత్రణ

**Trade-offs:**
- కోడ్ మార్పులు అవసరం
- అమలు చేయడం మరింత సంక్లిష్టం
- కోడ్ అభివృద్ధి చెందుతున్నప్పుడు నిరంతర నిర్వహణ

---

## Instrumentation + Collector సెటప్ ఆప్షన్లు

## ADOT SDK + CloudWatch Agent

ఈ విధానం లోతైన సేవా ఏకీకరణ మరియు AWS infrastructure metrics తో స్వయంచాలక సహసంబంధంతో అత్యంత ఏకీకృత AWS అనుభవాన్ని అందిస్తుంది.

### ముఖ్య ప్రయోజనాలు
- **Call volume, availability, latency, faults మరియు errors వంటి Metrics** sampling నిర్ణయానికి ముందు 100% అభ్యర్థనలపై client-side లో లెక్కించబడతాయి
- **X-Ray Sampling Integration** డిఫాల్ట్‌గా X-Ray sampling rules ఉపయోగిస్తుంది (అవసరమైతే 100% కోసం కాన్ఫిగర్ చేయండి)
- **Out-of-the-box CloudWatch Logs integration** సహజ log సహసంబంధం కోసం
- **పూర్తి AWS Support** మొత్తం observability stack కోసం
- **స్వయంచాలక service discovery** మరియు golden signals

### ఆర్కిటెక్చర్

![ADOT SDK + CloudWatch Agent Architecture](/apm-src/assets/images/deep-dive/adotcw.png)

### ADOT SDK + CloudWatch Agent ఎలా పనిచేస్తుంది

**దశ 1: Application Instrumentation**

మీరు ADOT SDK ని deploy చేసినప్పుడు, ఇది కోడ్ మార్పులు అవసరం లేకుండా మీ అప్లికేషన్‌ను స్వయంచాలకంగా instrument చేస్తుంది. ADOT SDK runtime లో అప్లికేషన్‌లోకి డైనమిక్‌గా కోడ్‌ను inject చేస్తుంది. ఈ inject చేయబడిన కోడ్ మద్దతు ఉన్న frameworks కు కాల్‌లను స్వయంచాలకంగా గుర్తిస్తుంది, ప్రతి operation కోసం spans సృష్టిస్తుంది, మరియు పూర్తి trace నిర్మించడానికి services అంతటా context ను ప్రచారం చేస్తుంది.

**దశ 2: Sampling నిర్ణయం**

ప్రతి అభ్యర్థన కోసం, ADOT SDK పూర్తి trace డేటాను పంపాలా వద్దా అని నిర్ణయించడానికి మీ X-Ray sampling rules ను తనిఖీ చేస్తుంది. ఖర్చు ఆదా కోసం 5% నుండి పూర్తి దృశ్యమానత కోసం 100% వరకు కాన్ఫిగర్ చేయవచ్చు.

**దశ 3: Client-Side Metrics లెక్కింపు**

ఇక్కడ ముఖ్య ప్రయోజనం: sampling జరగడానికి ముందు, `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` అయినప్పుడు SDK 100% అభ్యర్థనలపై RED (Requests, Errors, Duration) metrics ను లెక్కిస్తుంది. అంటే తక్కువ sampling rates తో కూడా మీకు పూర్తి golden signals లభిస్తాయి:
- **Rate**: సమయ విండో ప్రతి అభ్యర్థనల సంఖ్య
- **Errors**: error status codes (4xx/5xx) ఉన్న అభ్యర్థనల సంఖ్య
- **Duration**: అభ్యర్థన start/end times నుండి Latency కొలతలు

**దశ 4: CloudWatch Agent Processing**

ADOT SDK sampled spans మరియు ముందుగా లెక్కించిన metrics రెండింటినీ CloudWatch Agent కు పంపుతుంది, ఇది వాటిని pipeline ద్వారా ప్రాసెస్ చేస్తుంది:

![ADOT SDK CloudWatch Agent వివరమైన Pipeline](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver**: మీ అప్లికేషన్ నుండి traces మరియు metrics ను అంగీకరిస్తుంది
- **Resource Detector**: AWS resource సమాచారాన్ని (instance IDs, container వివరాలు) జోడిస్తుంది
- **APM Processor**: platform-specific metadata తో spans ను సుసంపన్నం చేస్తుంది
- **Exporters**: X-Ray (spans) మరియు CloudWatch (metrics) కు డేటాను route చేస్తుంది

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**దశ 5: డేటా పంపిణీ**

మీ డేటా మూడు మార్గాలుగా విభజిస్తుంది:
- **Metrics** → Application Maps కోసం `/aws/application-signals/data` log group
- **Spans** → Transaction Search కోసం `aws/spans` log group
- **Indexed spans** → సాంప్రదాయ trace analysis కోసం X-Ray backend

**దశ 6: Analytics ఆప్షన్లు**

ఇది మీ డేటాను విశ్లేషించడానికి మూడు మార్గాలను ఇస్తుంది:
- **Application Signals**: పూర్తి metrics నుండి dynamic grouping మరియు golden signals తో Application Maps
- **Transaction Search**: అధునాతన filters తో అన్ని span డేటాను query చేయండి
- **X-Ray Analytics**: indexed spans పై సాంప్రదాయ trace analysis

### Implementation Guides

Platform-specific సెటప్ guides ను అనుసరించండి:
- [Amazon EKS లో Application Signals ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [Amazon ECS లో Application Signals ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [Amazon EC2 లో Application Signals ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [Self hosted Kubernetes లో Application Signals ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals Demo repository](https://github.com/aws-observability/application-signals-demo)

పూర్తయిన తర్వాత, Application Signals console లో service discovery మరియు golden signals ను ధృవీకరించండి.

## ADOT SDK + Custom OTEL Collector

This approach combines the ADOT SDK's client-side RED metrics calculation with the flexibility of a custom-built OpenTelemetry Collector that includes the AWS Application Signals Processor. You get the same accurate 100%-of-traffic metrics as the CloudWatch Agent approach, plus the ability to fan out telemetry to multiple destinations.

### Key Benefits
- **Client-side RED metrics on 100% of requests** via ADOT SDK (same as CW Agent approach) — metrics are calculated before sampling
- **Multi-destination telemetry** — fan out to AWS, Datadog, Prometheus, etc. simultaneously
- **App Signals Processor** normalizes `aws.local.*` / `aws.remote.*` attributes, resolves platform context, and controls cardinality
- **Full control over collector pipeline** — add custom processors, filters, and exporters

### Architecture

![ADOT SDK + Custom OTEL Collector Architecture](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### How ADOT SDK + Custom OTEL Collector Works

**Step 1: Application Instrumentation**

Your application gets instrumented with the ADOT SDK, which captures runtime metrics, logs, and traces in OpenTelemetry format. The ADOT SDK injects AWS-specific span attributes (`aws.local.service`, `aws.local.operation`, `aws.remote.service`, `aws.remote.operation`, etc.) that the App Signals Processor depends on.

**Step 2: Client-Side RED Metrics Calculation**

When `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`, the ADOT SDK calculates RED metrics on 100% of requests **before** any sampling decision:
- **Rate**: Count of requests per time window
- **Errors**: Count of requests with error status codes (4xx/5xx)
- **Duration**: Latency measurements from request start/end times

**Step 3: Sampling Decision**

The ADOT SDK applies your configured sampling strategy (X-Ray sampling rules or local sampling). Only sampled traces get sent to the collector, but RED metrics are already calculated on 100% of traffic.


**Step 4: Custom OpenTelemetry Collector Processing Pipeline**

**OTLP Receivers (Data Ingestion)**
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

This processor works with the `aws.local.*` / `aws.remote.*` span attributes that the ADOT SDK injects. It performs:
1. **Attribute Resolution**: Uses platform-specific resolvers to enrich telemetry with platform context
2. **Attribute Normalization**: Renames ADOT SDK attributes to CloudWatch metric dimension names
3. **Cardinality Control**: Applies user-configured `keep`/`drop`/`replace` rules
4. **Application Map Generation**: Creates topology data with dynamic grouping

**Step 5: Export Processing**

Exporters route data to AWS EMF (metrics), OTLP HTTP (logs), and OTLP HTTP (traces) endpoints with SigV4 authentication.

**Step 6: Backend Processing**
1. CloudWatch Logs: Extracts metrics from EMF logs, stores span data in `aws/spans`
2. X-Ray Backend: Indexes configurable percentage of spans for trace analytics

**Step 7: Analytics and Visualization**
- **Application Signals**: Uses client-side calculated RED metrics — accurate on 100% of traffic regardless of sampling
- **Transaction Search**: Queries span data from CloudWatch Logs
- **X-Ray Analytics**: Traditional trace analysis on indexed spans


### Building Custom OTEL Collector with awsapplicationsignalsprocessor

**Prerequisites**: Install Go (version 1.21 or later).

**Step 1: Install the OpenTelemetry Collector Builder (ocb)**

For latest binaries, see [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases).

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**Step 2: Create Builder Manifest File**

Create `builder-config.yaml`:
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


**Step 3: Sample Collector Configuration**

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

**Step 4: Build Docker Image**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## Upstream OpenTelemetry SDK + OTEL Collector

This approach uses the standard upstream OpenTelemetry SDK (not ADOT) with an OpenTelemetry Collector. It provides maximum vendor neutrality and supports any language with an OpenTelemetry SDK, including those not supported by ADOT (Erlang, Rust, Ruby, etc.). RED metrics are calculated server-side by the X-Ray backend from sampled trace data.

### Key Benefits
- **Full vendor neutrality** — no AWS-specific SDK dependency on the client side
- **Any OTEL-supported language** — works with Erlang, Rust, Ruby, PHP, and all other upstream OTEL SDKs
- **Multi-cloud and hybrid environments** — same SDK works across AWS, GCP, Azure, and on-premises
- **Standard upstream OTEL Collector** with standard processors and exporters
- **Existing OpenTelemetry investments** preserved — no migration to ADOT needed
- **Multi-destination telemetry** — fan out to any backend simultaneously

### Architecture

![Upstream OpenTelemetry SDK + OTEL Collector Architecture](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### How Upstream OTEL SDK + Collector Works

**Step 1: Application Instrumentation**

Your application gets instrumented with the standard upstream OpenTelemetry SDK. This produces standard OTEL spans with semantic conventions (`http.method`, `http.route`, `http.status_code`, etc.).

**Step 2: Client-Side Sampling**

The OTEL SDK applies your configured sampling strategy. For accurate RED metrics, you need `always_on` sampling (100%) since metrics are calculated server-side from sampled traces only. With partial sampling, your RED metrics will only reflect the sampled subset.

**Step 3: Standard OTEL Collector Processing Pipeline**

The collector uses standard upstream processors:

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


**Step 4: Server-Side RED Metrics Calculation**

Since the upstream OTEL SDK does not calculate RED metrics client-side, the X-Ray frontend calculates them server-side from the sampled traces it receives:
1. **Rate**: Request counts extracted from sampled span data
2. **Errors**: Error counts identified from sampled span status codes
3. **Duration**: Latency calculated from sampled span start/end times

:::warning
RED metrics accuracy depends entirely on your sampling rate. With 5% sampling, you only get metrics on 5% of traffic. For accurate RED metrics with this approach, configure 100% sampling.
:::

**Step 5: Analytics and Visualization**
- **Application Signals**: Application Maps with golden signals from server-calculated RED metrics (accuracy depends on sampling rate)
- **Transaction Search**: Query span data from CloudWatch Logs (`aws/spans`)
- **X-Ray Analytics**: Traditional trace analysis on indexed spans

### Key Differences from ADOT SDK Approach

| Aspect | ADOT SDK + Custom Collector | Upstream OTEL SDK + Collector |
|---|---|---|
| **RED Metrics** | Client-side, 100% of traffic | Server-side, only sampled traffic |
| **`aws.*` span attributes** | Injected by ADOT SDK | Not present |
| **Language support** | Java, Python, .NET, Node.js | Any OTEL-supported language |
| **Collector build** | Custom build with App Signals Processor | Standard upstream collector build |
| **100% sampling needed for accurate metrics** | No | Yes |

### Sample Collector Configuration

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

This approach provides minimal infrastructure complexity and reduced resource overhead by sending logs and traces directly to CloudWatch OTLP endpoints.

### Why Choose Collector-less Tracing

Collector-less tracing is perfect when you want the simplest possible architecture with maximum resource utilization. By sending data directly to AWS endpoints, you eliminate the need for additional infrastructure components and their associated management overhead.

### Architecture

![Collector-less Architecture](/apm-src/assets/images/deep-dive/collectorless.png)

### How Collector-less Tracing Works

**Step 1: Application Instrumentation**

Your application gets automatically instrumented with the ADOT SDK. It captures logs and traces in OpenTelemetry format without requiring any code changes.

**Step 2: Local SDK Sampling (ParentBased/AlwaysOn at 100% by default)**

The X-Ray remote sampler requires a local proxy (CloudWatch Agent or [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling)) to fetch sampling rules. It calls `http://localhost:2000/GetSamplingRules` and `http://localhost:2000/SamplingTargets` to retrieve the configured rules. In collector-less mode, there is no local proxy running, so the ADOT SDK cannot reach these endpoints. As a result, the SDK silently falls back to its default sampling strategy: **ParentBased(AlwaysOn) at 100%**.

:::tip Control Sampling Rate to Manage Costs
Since X-Ray remote sampling is unavailable in collector-less mode, you can configure a local sampling strategy using environment variables to reduce trace volume and costs:

```bash
# Use a TraceIdRatioBased sampler at 5% (adjust ratio as needed)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# Or use parentbased_traceidratio to respect incoming trace context
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

Without these variables, the SDK defaults to `parentbased_always_on` (100% sampling), which sends all traces and may increase CloudWatch and X-Ray costs for high-throughput applications.
:::

**Step 3: Direct AWS Communication**

Instead of going through a collector, your data goes directly to AWS services with SigV4 authentication:
- **Logs** → `https://logs.<region>.amazonaws.com/v1/logs` via OTLP HTTP
- **Traces** → `https://xray.<region>.amazonaws.com/v1/traces` via OTLP HTTP

**Step 4: Server-Side RED Metrics Calculation**

The X-Ray frontend analyzes the received traces to calculate RED metrics on the AWS backend. Since the SDK defaults to 100% sampling in collector-less mode, the server-side RED metrics are calculated on all traffic.

**Step 5: Analytics Options**
- **Application Signals**: Application Maps with dynamic grouping and golden signals from server-calculated RED metrics
- **Transaction Search**: Query complete span data from CloudWatch Logs (`aws/spans`)
- **X-Ray Analytics**: Traditional trace analysis on indexed spans

### Important Considerations
- **Transaction Search is required** — you must enable it when using OTLP endpoints
- **ADOT SDK is required** — regular OpenTelemetry SDK won't work for this approach
- **Authentication is automatic** — ADOT SDK handles AWS SigV4 authentication
- **No X-Ray remote sampling** — without a local proxy, the SDK cannot fetch X-Ray sampling rules and defaults to 100% sampling (ParentBased/AlwaysOn)
- **Cost implications** — since all traces are sent (100% sampling), monitor your CloudWatch and X-Ray costs for high-throughput services


## Existing X-Ray SDK + X-Ray Daemon (End of Support Timeline)

:::danger X-Ray SDK and Daemon End of Support Notice
**AWS X-Ray SDKs and Daemon GA ended on February 25, 2026 and are now in maintenance mode.**

| SDK and Daemon Phase | Start Date | End Date | Support Provided |
|---|---|---|---|
| **General Availability** | N/A | February 25, 2026 | X-Ray SDKs and Daemon are fully supported. AWS provides regular SDK and daemon releases that include bug and security fixes. |
| **Maintenance Mode** | February 25, 2026 | N/A | AWS will limit X-Ray SDK and Daemon releases to address security issues only. The SDKs/Daemon will not receive new feature enhancements. |

See [X-Ray End of Support Timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) and [X-Ray to OpenTelemetry Migration Guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) for details.
:::

![X-Ray Architecture](/apm-src/assets/images/deep-dive/X-ray.png)

This approach is suitable for organizations with existing X-Ray investments who want to gradually adopt Application Signals capabilities while planning their migration to OpenTelemetry.

### How to Get Started

1. **Enable Transaction Search** for your existing X-Ray data
2. **Configure 100% Sampling** or use adaptive sampling for cost-effective anomaly detection
3. **Plan Your Migration** — start gradually migrating services to ADOT instrumentation

## RED Metrics Calculation Summary

Understanding how RED (Rate, Errors, Duration) metrics are calculated across different instrumentation setups is crucial for choosing the right approach:

| Instrumentation Setup | Calculation Method | Environment Variable | Requirements |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | Client-side | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | None - works with any sampling |
| **ADOT SDK + Custom OTEL Collector** | Client-side | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | Custom collector with App Signals Processor |
| **Upstream OTEL SDK + OTEL Collector** | Server-side | N/A (no ADOT SDK) | Transaction Search + 100% sampling for accuracy |
| **Collector-less (ADOT SDK)** | Server-side | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false` (default) | Transaction Search. Defaults to 100% sampling (X-Ray remote sampling unavailable without local proxy) |
| **X-Ray SDK + X-Ray Daemon** | Server-side (extrapolated) | N/A | Based on sampled data |

### Client-side RED Metrics (ADOT SDK — both CW Agent and Custom Collector)

```
Application → ADOT SDK → Calculate Metrics → CW Agent or Custom Collector → AWS
                ↓
            (100% of requests)
```

- **Calculation happens in the application** before any sampling decisions
- **Always accurate** regardless of trace sampling configuration
- **Default behavior** when `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true`
- **No Transaction Search dependency** for metrics calculation

### Server-side RED Metrics (Upstream OTEL SDK, Collector-less, X-Ray)

```
Application → Upstream OTEL SDK/Collector → AWS Backend → Calculate Metrics
                ↓
        (Requires 100% sampling for accuracy)
```

- **Calculation happens at AWS backend** (X-Ray frontend) from received span data
- **OTLP-based setups require Transaction Search** to be enabled
- **Needs 100% sampling** for accurate metrics (except X-Ray which extrapolates)
