# Application Signals + Transaction Search సెటప్ చేయడం

## ఉన్నత-స్థాయి సెటప్ ప్రక్రియ

![సెటప్ అవలోకనం](/apm-src/assets/images/deep-dive/overview.png)

## ముందస్తు అవసరాలు & అనుమతులు

CloudWatch Application Signals ను ఎనేబుల్ చేయడానికి ముందు, మీకు అవసరమైన IAM అనుమతులు మరియు infrastructure ఉన్నాయని నిర్ధారించుకోండి. వివరమైన అవసరాల కోసం [Application Signals Permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) చూడండి.

## మద్దతు ఉన్న సిస్టమ్‌లు

Application Signals Amazon EKS, native Kubernetes, Amazon ECS మరియు Amazon EC2 లో మద్దతు ఇవ్వబడింది మరియు పరీక్షించబడింది.

| భాష | Runtime వెర్షన్ |
|---|---|
| **Java** | JVM వెర్షన్లు 8, 11, 17, 21 మరియు 23 |
| **Python** | Python వెర్షన్లు 3.9 మరియు అంతకంటే ఎక్కువ |
| **.NET** | Release 1.6.0 మరియు అంతకు ముందు: .NET 6, 8 మరియు .NET Framework 4.6.2 మరియు అంతకంటే ఎక్కువ. Release 1.7.0 మరియు అంతకంటే ఎక్కువ: .NET 8, 9 మరియు .NET Framework 4.6.2 మరియు అంతకంటే ఎక్కువ |
| **Node.js** | Node.js వెర్షన్లు 14, 16, 18, 20 మరియు 22 |
| **PHP** | PHP వెర్షన్లు 8.0 మరియు అంతకంటే ఎక్కువ |
| **Ruby** | CRuby >= 3.1, JRuby >= 9.3.2.0, లేదా TruffleRuby >= 22.1 |
| **GoLang** | Golang వెర్షన్లు 1.18 మరియు అంతకంటే ఎక్కువ |

పూర్తి మద్దతు మ్యాట్రిక్స్ కోసం, [Application Signals Supported Systems](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html) చూడండి.

## దశ 1: మీ ఖాతాలో Application Signals ఎనేబుల్ చేయండి

[మీ ఖాతాలో Application Signals ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html) డాక్యుమెంటేషన్ చూడండి.

## దశ 2: Transaction Search ఎనేబుల్ చేయండి

[Transaction search ఎనేబుల్ చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) డాక్యుమెంటేషన్ చూడండి.

## దశ 3: మీ Instrumentation వ్యూహాన్ని ఎంచుకోండి

మీ అవసరాల ఆధారంగా, instrumentation విధానాలలో ఒకదాన్ని ఎంచుకోండి. Application Signals SDKs మరియు collectors యొక్క బహుళ కలయికలకు మద్దతు ఇస్తుంది:

### అందుబాటులో ఉన్న SDKs

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Application Signals మద్దతుతో OpenTelemetry యొక్క AWS పంపిణీ. Java, Python, .NET మరియు Node.js కోసం అందుబాటులో ఉంది.
- **[Upstream OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — ప్రామాణిక vendor-neutral OpenTelemetry SDK. ఏదైనా OTEL-మద్దతు ఉన్న భాషతో (Erlang, Rust, Ruby, Go, PHP మొదలైనవి) పనిచేస్తుంది.
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — లెగసీ AWS tracing SDK. ⚠️ [నిర్వహణ మోడ్](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### అందుబాటులో ఉన్న Collectors / Agents

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — అంతర్నిర్మిత Application Signals మద్దతు, Container Insights ఇంటిగ్రేషన్ మరియు log సేకరణతో నిర్వహించబడే AWS agent.
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — ప్రామాణిక upstream లేదా కస్టమ్-నిర్మిత collector. బహుళ-గమ్యస్థాన టెలిమెట్రీ fan-out కు మద్దతు ఇస్తుంది.
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK కోసం లెగసీ trace relay. ⚠️ [నిర్వహణ మోడ్](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### నిర్ణయ మ్యాట్రిక్స్

| విధానం | దీని కోసం ఉత్తమం | ప్రధాన ప్రయోజనాలు |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | AWS-native వాతావరణాలు, లోతైన సేవా ఏకీకరణ | గట్టి AWS ఇంటిగ్రేషన్, Container Insights సహసంబంధం, నిర్వహించబడే అనుభవం |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | పూర్తి Application Signals మద్దతుతో బహుళ-గమ్యస్థాన టెలిమెట్రీ | Client-side RED metrics, App Signals processor, బహుళ-గమ్యస్థాన అనువైనత |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | Vendor-neutral వ్యూహం, non-ADOT భాషలు, multi-cloud | పూర్తి vendor తటస్థత, ఏదైనా OTEL-మద్దతు ఉన్న భాష, AWS SDK ఆధారపడటం లేదు |
| [**Direct OTLP Endpoint (Collector-less tracing)**](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) | వనరుల-సమర్థ అప్లికేషన్లు, కనీస infrastructure | కనీస overhead, సరళీకృత ఆర్కిటెక్చర్, తగ్గించిన infrastructure |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | లెగసీ X-Ray వినియోగదారులు, క్రమంగా migration | ఇప్పటికే ఉన్న పెట్టుబడి రక్షణ, కనీస మార్పు అవసరాలు. ⚠️ నిర్వహణ మోడ్ |

### ఫీచర్ పోలిక

| ఫీచర్ | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | Collector-less tracing with ADOT SDK | X-Ray SDKs |
|---|---|---|---|---|---|
| **AWS Support** | ✅ అవును | ⚠️ AWS కు పంపబడిన డేటా కోసం మాత్రమే | ⚠️ AWS కు పంపబడిన డేటా కోసం మాత్రమే | ✅ అవును | ✅ అవును (⚠️ నిర్వహణ మోడ్) |
| **Nonstandard language support** | ❌ లేదు | ❌ లేదు | ✅ అవును | ❌ లేదు | ❌ లేదు |
| **Container Insights integration** | ✅ అవును | ❌ లేదు | ❌ లేదు | ❌ లేదు | ❌ లేదు |
| **Out of the box logging with CloudWatch Logs** | ✅ అవును | ❌ లేదు | ❌ లేదు | ✅ అవును | ❌ లేదు |
| **Out of the box runtime metrics** | ✅ అవును | ✅ అవును | ✅ అవును | ❌ లేదు | ❌ లేదు |
| **Always gets RED metrics on 100% of traffic** | ✅ అవును (client-side) | ✅ అవును (client-side) | ⚠️ 100% sampling తో మాత్రమే (server-side) | ⚠️ 100% sampling తో మాత్రమే (server-side) | ⚠️ 100% sampling తో మాత్రమే (server-side) |
| **Multi-destination telemetry** | ❌ లేదు | ✅ అవును | ✅ అవును | ❌ లేదు | ❌ లేదు |

ప్రతి విధానం యొక్క వివరమైన అమలు కోసం, [Instrumentation Setups](../instrumentation-setups) చూడండి.

## దశ 4: Sampling మరియు Trace Indexing అర్థం చేసుకోవడం

Application Signals **request sampling** ను **trace indexing** నుండి వేరు చేస్తుంది:
- **Request Sampling**: ఏ శాతం అభ్యర్థనలు sample చేయబడి AWS కు పంపబడతాయో నిర్ణయిస్తుంది
- **Selective Trace Indexing**: CloudWatch Logs లో నిల్వ చేయబడిన spans యొక్క శాతం X-Ray backend కు X-Ray trace summaries కోసం పంపబడుతుంది. Trace summaries లావాదేవీలను debug చేయడానికి సహాయకరం మరియు asynchronous ప్రక్రియలకు విలువైనవి. మీరు spans లో చిన్న భాగాన్ని మాత్రమే trace summaries గా index చేయాల్సి ఉంటుంది.

### Request Sampling

#### 1. X-Ray Centralized Sampling (డిఫాల్ట్ మరియు సిఫార్సు చేయబడింది)

మీరు ADOT SDK మరియు CloudWatch Agent (లేదా OpenTelemetry Collector) తో Application Signals ఎనేబుల్ చేసినప్పుడు, **X-Ray centralized sampling డిఫాల్ట్‌గా ఎనేబుల్ అవుతుంది** ఈ సెట్టింగ్‌లతో:

| సెట్టింగ్ | డిఫాల్ట్ విలువ | వివరణ |
|---|---|---|
| **Reservoir** | సెకనుకు 1 అభ్యర్థన | సెకనుకు sample చేయబడిన అభ్యర్థనల స్థిర సంఖ్య |
| **Fixed Rate** | 5% | reservoir దాటిన అదనపు అభ్యర్థనల శాతం |

AWS Distro for OpenTelemetry (ADOT) SDK agent కోసం environment variables ఈ విధంగా సెట్ చేయబడతాయి:

| Environment Variable | విలువ | వివరణ |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | X-Ray sampling సేవను ఉపయోగిస్తుంది |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch agent endpoint |

మీరు ఈ defaults ను మీ అప్లికేషన్‌ను తిరిగి deploy చేయకుండా X-Ray console ద్వారా ఎప్పుడైనా మార్చవచ్చు. ఉదాహరణకు, sampling ను 10% కు పెంచడానికి, sampling rule యొక్క fixed rate ని అప్‌డేట్ చేయండి. [Configuring sampling rules](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html) rule ఆప్షన్ల పూర్తి జాబితా, ఉదాహరణలు మరియు service-specific rules ఎలా సృష్టించాలో చూడండి.

:::info X-Ray Remote Sampler ఎప్పుడు వర్తిస్తుంది?
`xray` sampler స్థానిక proxy ద్వారా `http://localhost:2000/GetSamplingRules` మరియు `http://localhost:2000/SamplingTargets` ను కాల్ చేయడం ద్వారా పనిచేస్తుంది. అంటే X-Ray remote sampling **స్థానిక proxy నడుస్తున్నప్పుడు మాత్రమే పనిచేస్తుంది**:

- **CloudWatch Agent** — డిఫాల్ట్‌గా port 2000 లో sampling proxy ను బహిర్గతం చేస్తుంది
- **OpenTelemetry Collector** — [AWS Proxy extension](https://aws-otel.github.io/docs/getting-started/remote-sampling) కాన్ఫిగర్ చేయబడింది

స్థానిక proxy అందుబాటులో లేకపోతే (ఉదా., [collector-less mode](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) లో), ADOT SDK sampling endpoints ను చేరుకోలేదు మరియు నిశ్శబ్దంగా **ParentBased(AlwaysOn) at 100%** కు తిరిగి వెళ్తుంది.
:::

#### 2. Runtime ప్రతి X-Ray Remote Sampler కాన్ఫిగర్ చేయడం

ప్రతి ADOT SDK భాష runtime X-Ray remote sampling rules ఉపయోగించడానికి నిర్దిష్ట configuration అవసరం. మీ భాష కోసం గైడ్ చూడండి:

| Runtime | Configuration Guide |
|---|---|
| **Java** | [Using X-Ray Remote Sampling with ADOT Java](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [Using X-Ray Remote Sampling with ADOT Python](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [Using X-Ray Remote Sampling with ADOT JavaScript](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [Using X-Ray Remote Sampling with ADOT .NET](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [Configuring Sampling with ADOT Go](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

అన్ని runtimes కోసం, ముఖ్యమైన environment variables:

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

మీ CloudWatch Agent లేదా collector proxy చిరునామాకు సరిపోయేలా endpoint ను సర్దుబాటు చేయండి (ఉదా., EKS లో `http://cloudwatch-agent.amazon-cloudwatch:2000`).

#### 3. Local Sampling

మీ వద్ద స్థానిక proxy అందుబాటులో లేకపోతే, లేదా X-Ray service పై ఆధారపడకుండా స్థానిక నియంత్రణను ఇష్టపడితే, environment variables ఉపయోగించి ADOT SDK లో నేరుగా sampling కాన్ఫిగర్ చేయవచ్చు:

| Environment Variable | విలువ | వివరణ |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | Local ratio-based sampling |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% sampling rate (అవసరమైన విధంగా సర్దుబాటు చేయండి) |

ఇది ముఖ్యంగా [collector-less mode](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) లో ఉపయోగపడుతుంది, X-Ray remote sampling అందుబాటులో లేని చోట. ఈ variables లేకుండా, SDK `parentbased_always_on` (100% sampling) కు defaults అవుతుంది.

మరిన్ని sampler ఆప్షన్ల కోసం, [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) డాక్యుమెంటేషన్ చూడండి.

#### 4. X-Ray Adaptive Sampling (ఖర్చు-ఆప్టిమైజ్డ్ విధానం)

:::tip అవసరాలు
- ADOT Java SDK (v2.11.5 లేదా అంతకంటే ఎక్కువ)
- CloudWatch Agent లేదా OpenTelemetry Collector తో నడపాలి
- Amazon EC2, ECS, EKS మరియు self-hosted Kubernetes తో అనుకూలం

వివరమైన సెటప్ సూచనల కోసం, [X-Ray Adaptive Sampling](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html) డాక్యుమెంటేషన్ చూడండి.
:::

మీకు 100% sampling అవసరం లేకపోతే కానీ మెరుగైన anomaly కవరేజ్ కావాలంటే, X-Ray adaptive sampling ను పరిగణించండి, ఇది error spikes మరియు latency outliers సమయంలో sampling ను స్వయంచాలకంగా పెంచుతుంది, అదే సమయంలో ఖర్చు-సమర్థవంతమైన baseline rates ను నిర్వహిస్తుంది:

ముఖ్య ప్రయోజనాలు:
- **స్వయంచాలక anomaly detection**: HTTP 5xx errors లేదా అధిక latency సమయంలో sampling ను పెంచుతుంది
- **ఖర్చు నియంత్రణ**: సాధారణ కార్యకలాపాల సమయంలో తక్కువ baseline sampling (ఉదా., 5%) నిర్వహిస్తుంది
- **కాన్ఫిగర్ చేయగల boost limits**: గరిష్ట sampling rates మరియు cooldown periods సెట్ చేయండి
- **క్లిష్టమైన trace capture**: పూర్తి traces sample చేయబడనప్పుడు కూడా anomaly spans క్యాప్చర్ అయ్యేలా నిర్ధారిస్తుంది
- **కేంద్రీకృత నియంత్రణ**: అప్లికేషన్ కోడ్ మార్పులు లేకుండా X-Ray sampling rules ద్వారా కాన్ఫిగర్ చేయండి

Configuration ఉదాహరణ:
```json
{
  "RuleName": "AdaptiveProductionRule",
  "Priority": 1,
  "ReservoirSize": 1,
  "FixedRate": 0.05,
  "ServiceName": "*",
  "ServiceType": "*",
  "Host": "*",
  "HTTPMethod": "*",
  "URLPath": "*",
  "SamplingRateBoost": {
    "MaxRate": 0.25,
    "CooldownWindowMinutes": 10
  }
}
```

### Trace Indexing

**1. డిఫాల్ట్ Indexing Rate:**
- 1% indexing అదనపు ఖర్చు లేకుండా చేర్చబడింది
- 1% indexing పైన X-Ray pricing ఛార్జీలు వర్తిస్తాయి
- ప్రస్తుత rates కోసం [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) డాక్యుమెంటేషన్ చూడండి

**2. కస్టమ్ Indexing Rates:**
```bash
# మరిన్ని X-Ray analytics అవసరమైన అప్లికేషన్ల కోసం అధిక indexing (ఛార్జీలు వర్తిస్తాయి)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% indexing - X-Ray ఛార్జీలు వర్తిస్తాయి

# ఖర్చు ఆప్టిమైజేషన్ కోసం తక్కువ indexing (ఇంకా ఉచిత tier లో)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% indexing - అదనపు ఛార్జీలు లేవు
```
