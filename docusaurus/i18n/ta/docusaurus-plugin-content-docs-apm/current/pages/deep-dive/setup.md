# Application Signals + Transaction Search அமைத்தல்

## உயர்-நிலை அமைப்பு செயல்முறை

![அமைப்பு கண்ணோட்டம்](/apm-src/assets/images/deep-dive/overview.png)

## முன்நிபந்தனைகள் & அனுமதிகள்

CloudWatch Application Signals-ஐ இயக்குவதற்கு முன், தேவையான IAM அனுமதிகள் மற்றும் உள்கட்டமைப்பு இருப்பதை உறுதிசெய்யவும். விரிவான தேவைகளுக்கு [Application Signals Permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) ஐ பார்க்கவும்.

## ஆதரிக்கப்படும் அமைப்புகள்

Application Signals Amazon EKS, native Kubernetes, Amazon ECS மற்றும் Amazon EC2-ல் ஆதரிக்கப்பட்டு சோதிக்கப்பட்டுள்ளது.

| மொழி | Runtime பதிப்பு |
|---|---|
| **Java** | JVM பதிப்புகள் 8, 11, 17, 21 மற்றும் 23 |
| **Python** | Python பதிப்புகள் 3.9 மற்றும் அதற்கு மேல் |
| **.NET** | Release 1.6.0 மற்றும் கீழ்: .NET 6, 8 மற்றும் .NET Framework 4.6.2 மற்றும் அதற்கு மேல். Release 1.7.0 மற்றும் மேல்: .NET 8, 9 மற்றும் .NET Framework 4.6.2 மற்றும் அதற்கு மேல் |
| **Node.js** | Node.js பதிப்புகள் 14, 16, 18, 20 மற்றும் 22 |
| **PHP** | PHP பதிப்புகள் 8.0 மற்றும் அதற்கு மேல் |
| **Ruby** | CRuby >= 3.1, JRuby >= 9.3.2.0, அல்லது TruffleRuby >= 22.1 |
| **GoLang** | Golang பதிப்புகள் 1.18 மற்றும் அதற்கு மேல் |

முழு ஆதரவு அணியிற்கு, [Application Signals Supported Systems](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html) ஐ பார்க்கவும்.

## படி 1: உங்கள் கணக்கில் Application Signals-ஐ இயக்கவும்

[உங்கள் கணக்கில் Application Signals-ஐ இயக்குதல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html) ஆவணத்தைப் பார்க்கவும்.

## படி 2: Transaction Search-ஐ இயக்கவும்

[Transaction search-ஐ இயக்குதல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) ஆவணத்தைப் பார்க்கவும்.

## படி 3: உங்கள் Instrumentation உத்தியைத் தேர்ந்தெடுக்கவும்

உங்கள் தேவைகளின் அடிப்படையில், instrumentation அணுகுமுறைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும். Application Signals SDK-கள் மற்றும் கலெக்டர்களின் பல சேர்க்கைகளை ஆதரிக்கிறது:

### கிடைக்கக்கூடிய SDK-கள்

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Application Signals ஆதரவுடன் கூடிய OpenTelemetry-யின் AWS விநியோகம். Java, Python, .NET மற்றும் Node.js-க்கு கிடைக்கும்.
- **[Upstream OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — நிலையான விற்பனையாளர்-நடுநிலை OpenTelemetry SDK. எந்த OTEL-ஆதரிக்கப்படும் மொழியிலும் வேலை செய்யும் (Erlang, Rust, Ruby, Go, PHP போன்றவை).
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — பழைய AWS tracing SDK. ⚠️ [பராமரிப்பு நிலை](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### கிடைக்கக்கூடிய கலெக்டர்கள் / ஏஜெண்ட்கள்

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — உள்ளமைக்கப்பட்ட Application Signals ஆதரவு, Container Insights ஒருங்கிணைப்பு மற்றும் லாக் சேகரிப்புடன் கூடிய நிர்வகிக்கப்பட்ட AWS ஏஜெண்ட்.
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — நிலையான upstream அல்லது தனிப்பயனாக உருவாக்கப்பட்ட கலெக்டர். பல-இலக்கு டெலிமெட்ரி fan-out-ஐ ஆதரிக்கிறது.
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK-க்கான பழைய trace relay. ⚠️ [பராமரிப்பு நிலை](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### முடிவு அணி

| அணுகுமுறை | எதற்கு சிறந்தது | முக்கிய நன்மைகள் |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | AWS-நேட்டிவ் சூழல்கள், ஆழமான சேவை ஒருங்கிணைப்பு | இறுக்கமான AWS ஒருங்கிணைப்பு, Container Insights தொடர்பு, நிர்வகிக்கப்பட்ட அனுபவம் |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | முழு Application Signals ஆதரவுடன் பல-இலக்கு டெலிமெட்ரி | கிளையன்ட்-பக்க RED மெட்ரிக்குகள், App Signals processor, பல-இலக்கு நெகிழ்வுத்தன்மை |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | விற்பனையாளர்-நடுநிலை உத்தி, ADOT அல்லாத மொழிகள், பல-கிளவுட் | முழு விற்பனையாளர் நடுநிலை, எந்த OTEL-ஆதரிக்கப்படும் மொழியும், AWS SDK சார்பு இல்லை |
| [**Direct OTLP Endpoint (கலெக்டர்-இல்லா tracing)**](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) | வள-திறனான பயன்பாடுகள், குறைந்தபட்ச உள்கட்டமைப்பு | குறைந்தபட்ச overhead, எளிமையான கட்டமைப்பு, குறைக்கப்பட்ட உள்கட்டமைப்பு |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | பழைய X-Ray பயனர்கள், படிப்படியான மாற்றம் | ஏற்கனவே உள்ள முதலீட்டு பாதுகாப்பு, குறைந்தபட்ச மாற்ற தேவைகள். ⚠️ பராமரிப்பு நிலை |

### அம்ச ஒப்பீடு

| அம்சம் | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | ADOT SDK-யுடன் கலெக்டர்-இல்லா tracing | X-Ray SDKs |
|---|---|---|---|---|---|
| **AWS ஆதரவு** | ✅ ஆம் | ⚠️ AWS-க்கு அனுப்பப்படும் தரவுக்கு மட்டும் | ⚠️ AWS-க்கு அனுப்பப்படும் தரவுக்கு மட்டும் | ✅ ஆம் | ✅ ஆம் (⚠️ பராமரிப்பு நிலை) |
| **நிலையான அல்லாத மொழி ஆதரவு** | ❌ இல்லை | ❌ இல்லை | ✅ ஆம் | ❌ இல்லை | ❌ இல்லை |
| **Container Insights ஒருங்கிணைப்பு** | ✅ ஆம் | ❌ இல்லை | ❌ இல்லை | ❌ இல்லை | ❌ இல்லை |
| **CloudWatch Logs-உடன் உடனடி லாகிங்** | ✅ ஆம் | ❌ இல்லை | ❌ இல்லை | ✅ ஆம் | ❌ இல்லை |
| **உடனடி runtime மெட்ரிக்குகள்** | ✅ ஆம் | ✅ ஆம் | ✅ ஆம் | ❌ இல்லை | ❌ இல்லை |
| **எப்போதும் 100% போக்குவரத்தில் RED மெட்ரிக்குகள் கிடைக்கும்** | ✅ ஆம் (கிளையன்ட்-பக்கம்) | ✅ ஆம் (கிளையன்ட்-பக்கம்) | ⚠️ 100% sampling-உடன் மட்டும் (சர்வர்-பக்கம்) | ⚠️ 100% sampling-உடன் மட்டும் (சர்வர்-பக்கம்) | ⚠️ 100% sampling-உடன் மட்டும் (சர்வர்-பக்கம்) |
| **பல-இலக்கு டெலிமெட்ரி** | ❌ இல்லை | ✅ ஆம் | ✅ ஆம் | ❌ இல்லை | ❌ இல்லை |

ஒவ்வொரு அணுகுமுறையின் விரிவான செயல்படுத்தலுக்கு, [Instrumentation Setups](../instrumentation-setups) ஐ பார்க்கவும்.

## படி 4: Sampling மற்றும் Trace Indexing-ஐ புரிந்துகொள்ளுதல்

Application Signals **request sampling**-ஐ **trace indexing**-லிருந்து பிரிக்கிறது:
- **Request Sampling**: கோரிக்கைகளின் எத்தனை சதவீதம் sample செய்யப்பட்டு AWS-க்கு அனுப்பப்படுகிறது என்பதை தீர்மானிக்கிறது
- **Selective Trace Indexing**: X-Ray trace summaries-க்காக X-Ray backend-க்கு அனுப்பப்படும் CloudWatch Logs-ல் சேமிக்கப்பட்ட spans-ன் சதவீதம். Trace summaries பரிவர்த்தனைகளை debug செய்வதற்கும், asynchronous செயல்முறைகளுக்கும் மதிப்புள்ளவை. Spans-ன் ஒரு சிறிய பகுதியை மட்டுமே trace summaries-ஆக index செய்ய வேண்டும்.

### Request Sampling

#### 1. X-Ray Centralized Sampling (இயல்புநிலை மற்றும் பரிந்துரைக்கப்படுவது)

ADOT SDK மற்றும் CloudWatch Agent (அல்லது OpenTelemetry Collector)-உடன் Application Signals-ஐ இயக்கும்போது, **X-Ray centralized sampling இயல்பாகவே இயக்கப்படும்** இந்த அமைப்புகளுடன்:

| அமைப்பு | இயல்பு மதிப்பு | விளக்கம் |
|---|---|---|
| **Reservoir** | 1 கோரிக்கை/நொடி | ஒரு நொடிக்கு sample செய்யப்படும் நிலையான கோரிக்கைகளின் எண்ணிக்கை |
| **Fixed Rate** | 5% | reservoir-க்கு அப்பாலான கூடுதல் கோரிக்கைகளின் சதவீதம் |

AWS Distro for OpenTelemetry (ADOT) SDK agent-க்கான environment variables பின்வருமாறு அமைக்கப்படுகின்றன:

| Environment Variable | மதிப்பு | விளக்கம் |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | X-Ray sampling service-ஐ பயன்படுத்துகிறது |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch agent எண்ட்பாயிண்ட் |

உங்கள் பயன்பாட்டை மீண்டும் deploy செய்யாமல் X-Ray console மூலம் இந்த இயல்புநிலைகளை எந்த நேரத்திலும் மாற்றலாம். எடுத்துக்காட்டாக, sampling-ஐ 10% ஆக அதிகரிக்க, sampling rule-ன் fixed rate-ஐ புதுப்பிக்கவும். Rule options, எடுத்துக்காட்டுகள் மற்றும் service-specific rules உருவாக்குவது பற்றிய முழு பட்டியலுக்கு [Configuring sampling rules](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html) ஐ பார்க்கவும்.

:::info X-Ray Remote Sampler எப்போது பொருந்தும்?
`xray` sampler உள்ளூர் proxy மூலம் `http://localhost:2000/GetSamplingRules` மற்றும் `http://localhost:2000/SamplingTargets`-ஐ அழைத்து வேலை செய்கிறது. இதன் பொருள் X-Ray remote sampling **உள்ளூர் proxy இயங்கும்போது மட்டுமே வேலை செய்யும்**:

- **CloudWatch Agent** — இயல்பாக port 2000-ல் sampling proxy-ஐ வெளிப்படுத்துகிறது
- **OpenTelemetry Collector** — [AWS Proxy extension](https://aws-otel.github.io/docs/getting-started/remote-sampling) கட்டமைக்கப்பட்டிருக்கும்போது

உள்ளூர் proxy கிடைக்காவிட்டால் (எ.கா., [கலெக்டர்-இல்லா நிலையில்](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints)), ADOT SDK sampling endpoints-ஐ அணுக முடியாது, அமைதியாக **ParentBased(AlwaysOn) 100%**-க்கு மாறும்.
:::

#### 2. Runtime-க்கு ஏற்ப X-Ray Remote Sampler கட்டமைத்தல்

ஒவ்வொரு ADOT SDK மொழி runtime-க்கும் X-Ray remote sampling rules பயன்படுத்த குறிப்பிட்ட கட்டமைப்பு தேவை. உங்கள் மொழிக்கான வழிகாட்டியைப் பார்க்கவும்:

| Runtime | கட்டமைப்பு வழிகாட்டி |
|---|---|
| **Java** | [ADOT Java-உடன் X-Ray Remote Sampling பயன்படுத்துதல்](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [ADOT Python-உடன் X-Ray Remote Sampling பயன்படுத்துதல்](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [ADOT JavaScript-உடன் X-Ray Remote Sampling பயன்படுத்துதல்](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [ADOT .NET-உடன் X-Ray Remote Sampling பயன்படுத்துதல்](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [ADOT Go-உடன் Sampling கட்டமைத்தல்](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

அனைத்து runtimes-க்கும், முக்கிய environment variables:

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

உங்கள் CloudWatch Agent அல்லது collector proxy முகவரிக்கு ஏற்ப endpoint-ஐ சரிசெய்யவும் (எ.கா., EKS-ல் `http://cloudwatch-agent.amazon-cloudwatch:2000`).

#### 3. Local Sampling

உள்ளூர் proxy கிடைக்காவிட்டால், அல்லது X-Ray service-ஐ சார்ந்திராமல் உள்ளூர் கட்டுப்பாட்டை விரும்பினால், environment variables பயன்படுத்தி ADOT SDK-ல் நேரடியாக sampling-ஐ கட்டமைக்கலாம்:

| Environment Variable | மதிப்பு | விளக்கம் |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | உள்ளூர் ratio-அடிப்படையிலான sampling |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% sampling rate (தேவைக்கேற்ப சரிசெய்யவும்) |

X-Ray remote sampling கிடைக்காத [கலெக்டர்-இல்லா நிலையில்](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) இது குறிப்பாக பயனுள்ளது. இந்த variables இல்லாமல், SDK இயல்பாக `parentbased_always_on` (100% sampling)-க்கு மாறும்.

மேலும் sampler விருப்பங்களுக்கு, [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) ஆவணத்தைப் பார்க்கவும்.

#### 4. X-Ray Adaptive Sampling (செலவு-உகந்த அணுகுமுறை)

:::tip தேவைகள்
- ADOT Java SDK (v2.11.5 அல்லது அதற்கு மேல்)
- CloudWatch Agent அல்லது OpenTelemetry Collector-உடன் இயக்க வேண்டும்
- Amazon EC2, ECS, EKS மற்றும் self-hosted Kubernetes-உடன் இணக்கமானது

விரிவான அமைப்பு வழிமுறைகளுக்கு, [X-Ray Adaptive Sampling](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html) ஆவணத்தைப் பார்க்கவும்.
:::

100% sampling தேவையில்லை ஆனால் சிறந்த anomaly coverage வேண்டும் என்றால், X-Ray adaptive sampling-ஐ பரிசீலிக்கவும். இது error spikes மற்றும் latency outliers-ன் போது தானாகவே sampling-ஐ அதிகரிக்கிறது, அதே நேரத்தில் செலவு-திறனான baseline rates-ஐ பராமரிக்கிறது:

முக்கிய நன்மைகள்:
- **தானியங்கி anomaly கண்டறிதல்**: HTTP 5xx errors அல்லது அதிக latency-யின் போது sampling-ஐ அதிகரிக்கிறது
- **செலவு கட்டுப்பாடு**: சாதாரண செயல்பாடுகளின் போது குறைந்த baseline sampling-ஐ (எ.கா., 5%) பராமரிக்கிறது
- **கட்டமைக்கக்கூடிய boost limits**: அதிகபட்ச sampling rates மற்றும் cooldown periods அமைக்கலாம்
- **முக்கியமான trace capture**: முழு traces sample செய்யப்படாவிட்டாலும் anomaly spans capture செய்யப்படுவதை உறுதிசெய்கிறது
- **மையப்படுத்தப்பட்ட கட்டுப்பாடு**: பயன்பாட்டு குறியீடு மாற்றங்கள் இல்லாமல் X-Ray sampling rules மூலம் கட்டமைக்கலாம்

கட்டமைப்பு எடுத்துக்காட்டு:
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

**1. இயல்பு Indexing Rate:**
- 1% indexing கூடுதல் கட்டணம் இல்லாமல் சேர்க்கப்பட்டுள்ளது
- 1%-க்கு மேல் indexing X-Ray pricing கட்டணங்களை ஏற்படுத்தும்
- தற்போதைய rates-க்கு [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) ஆவணத்தைப் பார்க்கவும்

**2. தனிப்பயன் Indexing Rates:**
```bash
# மேலும் X-Ray analytics தேவைப்படும் பயன்பாடுகளுக்கு அதிக indexing (கட்டணம் உண்டு)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% indexing - X-Ray கட்டணங்கள் பொருந்தும்

# செலவு மேம்படுத்தலுக்கு குறைந்த indexing (இலவச tier-க்குள்)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% indexing - கூடுதல் கட்டணம் இல்லை
```
