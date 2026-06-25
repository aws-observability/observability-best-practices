# Application Signals + Transaction Search सेटअप करना

## उच्च-स्तरीय सेटअप प्रक्रिया

![सेटअप अवलोकन](/apm-src/assets/images/deep-dive/overview.png)

## पूर्वापेक्षाएं और अनुमतियां

CloudWatch Application Signals सक्षम करने से पहले, सुनिश्चित करें कि आपके पास आवश्यक IAM अनुमतियां और इंफ्रास्ट्रक्चर मौजूद है। विस्तृत आवश्यकताओं के लिए [Application Signals Permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) देखें।

## समर्थित सिस्टम

Application Signals Amazon EKS, नेटिव Kubernetes, Amazon ECS, और Amazon EC2 पर समर्थित और परीक्षित है।

| भाषा | रनटाइम संस्करण |
|---|---|
| **Java** | JVM संस्करण 8, 11, 17, 21, और 23 |
| **Python** | Python संस्करण 3.9 और उच्चतर |
| **.NET** | रिलीज़ 1.6.0 और नीचे: .NET 6, 8, और .NET Framework 4.6.2 और उच्चतर। रिलीज़ 1.7.0 और उच्चतर: .NET 8, 9, और .NET Framework 4.6.2 और उच्चतर |
| **Node.js** | Node.js संस्करण 14, 16, 18, 20, और 22 |
| **PHP** | PHP संस्करण 8.0 और उच्चतर |
| **Ruby** | CRuby >= 3.1, JRuby >= 9.3.2.0, या TruffleRuby >= 22.1 |
| **GoLang** | Golang संस्करण 1.18 और उच्चतर |

पूर्ण समर्थन मैट्रिक्स के लिए, [Application Signals Supported Systems](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html) देखें।

## चरण 1: अपने खाते में Application Signals सक्षम करें

[अपने खाते में Application Signals सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html) दस्तावेज़ीकरण देखें।

## चरण 2: Transaction Search सक्षम करें

[Transaction search सक्षम करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) दस्तावेज़ीकरण देखें।

## चरण 3: अपनी Instrumentation रणनीति चुनें

अपनी आवश्यकताओं के अनुसार, instrumentation दृष्टिकोणों में से एक चुनें। Application Signals SDK और collectors के कई संयोजनों का समर्थन करता है:

### उपलब्ध SDKs

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — Application Signals समर्थन के साथ OpenTelemetry का AWS वितरण। Java, Python, .NET, और Node.js के लिए उपलब्ध।
- **[Upstream OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — मानक वेंडर-न्यूट्रल OpenTelemetry SDK। किसी भी OTEL-समर्थित भाषा के साथ काम करता है (Erlang, Rust, Ruby, Go, PHP, आदि)।
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — लेगेसी AWS ट्रेसिंग SDK। ⚠️ [मेंटेनेंस मोड](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### उपलब्ध Collectors / Agents

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — बिल्ट-इन Application Signals समर्थन, Container Insights एकीकरण, और लॉग संग्रह के साथ प्रबंधित AWS agent।
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — मानक upstream या कस्टम-बिल्ट collector। बहु-गंतव्य टेलीमेट्री फैन-आउट का समर्थन करता है।
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK के लिए लेगेसी ट्रेस रिले। ⚠️ [मेंटेनेंस मोड](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### निर्णय मैट्रिक्स

| दृष्टिकोण | सबसे उपयुक्त | प्रमुख लाभ |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | AWS-नेटिव वातावरण, गहरा सर्विस एकीकरण | तंग AWS एकीकरण, Container Insights सहसंबंध, प्रबंधित अनुभव |
| [**ADOT SDK + Custom OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | पूर्ण Application Signals समर्थन के साथ बहु-गंतव्य टेलीमेट्री | क्लाइंट-साइड RED मेट्रिक्स, App Signals processor, बहु-गंतव्य लचीलापन |
| [**Upstream OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | वेंडर-न्यूट्रल रणनीति, गैर-ADOT भाषाएं, मल्टी-क्लाउड | पूर्ण वेंडर न्यूट्रैलिटी, कोई भी OTEL-समर्थित भाषा, कोई AWS SDK निर्भरता नहीं |
| [**Direct OTLP Endpoint (Collector-less tracing)**](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) | संसाधन-कुशल एप्लिकेशन, न्यूनतम इंफ्रास्ट्रक्चर | न्यूनतम ओवरहेड, सरलीकृत आर्किटेक्चर, कम इंफ्रास्ट्रक्चर |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | लेगेसी X-Ray उपयोगकर्ता, क्रमिक माइग्रेशन | मौजूदा निवेश सुरक्षा, न्यूनतम परिवर्तन आवश्यकताएं। ⚠️ मेंटेनेंस मोड |

### सुविधा तुलना

| सुविधा | ADOT SDK + CW Agent | ADOT SDK + Custom OTEL Collector | Upstream OTEL SDK + OTEL Collector | ADOT SDK के साथ Collector-less tracing | X-Ray SDKs |
|---|---|---|---|---|---|
| **AWS समर्थन** | ✅ हां | ⚠️ केवल AWS को भेजे गए डेटा के लिए | ⚠️ केवल AWS को भेजे गए डेटा के लिए | ✅ हां | ✅ हां (⚠️ मेंटेनेंस मोड) |
| **गैर-मानक भाषा समर्थन** | ❌ नहीं | ❌ नहीं | ✅ हां | ❌ नहीं | ❌ नहीं |
| **Container Insights एकीकरण** | ✅ हां | ❌ नहीं | ❌ नहीं | ❌ नहीं | ❌ नहीं |
| **CloudWatch Logs के साथ तत्काल लॉगिंग** | ✅ हां | ❌ नहीं | ❌ नहीं | ✅ हां | ❌ नहीं |
| **तत्काल रनटाइम मेट्रिक्स** | ✅ हां | ✅ हां | ✅ हां | ❌ नहीं | ❌ नहीं |
| **हमेशा 100% ट्रैफिक पर RED मेट्रिक्स** | ✅ हां (क्लाइंट-साइड) | ✅ हां (क्लाइंट-साइड) | ⚠️ केवल 100% सैंपलिंग के साथ (सर्वर-साइड) | ⚠️ केवल 100% सैंपलिंग के साथ (सर्वर-साइड) | ⚠️ केवल 100% सैंपलिंग के साथ (सर्वर-साइड) |
| **बहु-गंतव्य टेलीमेट्री** | ❌ नहीं | ✅ हां | ✅ हां | ❌ नहीं | ❌ नहीं |

प्रत्येक दृष्टिकोण के विस्तृत कार्यान्वयन के लिए, [Instrumentation Setups](../instrumentation-setups) देखें।

## चरण 4: सैंपलिंग और ट्रेस इंडेक्सिंग को समझना

Application Signals **अनुरोध सैंपलिंग** को **ट्रेस इंडेक्सिंग** से अलग करता है:
- **अनुरोध सैंपलिंग**: यह निर्धारित करता है कि अनुरोधों का कितना प्रतिशत सैंपल किया जाता है और AWS को भेजा जाता है
- **चयनात्मक ट्रेस इंडेक्सिंग**: CloudWatch Logs में संग्रहीत spans का वह प्रतिशत जो X-Ray बैकएंड को X-Ray ट्रेस सारांश के लिए भेजा जाता है। ट्रेस सारांश ट्रांजैक्शन डीबगिंग के लिए सहायक हैं और असिंक्रोनस प्रक्रियाओं के लिए मूल्यवान हैं। आपको spans का केवल एक छोटा अंश ट्रेस सारांश के रूप में इंडेक्स करने की आवश्यकता है।

### अनुरोध सैंपलिंग

#### 1. X-Ray केंद्रीकृत सैंपलिंग (डिफ़ॉल्ट और अनुशंसित)

जब आप ADOT SDK और CloudWatch Agent (या OpenTelemetry Collector) के साथ Application Signals सक्षम करते हैं, तो इन सेटिंग्स के साथ **X-Ray केंद्रीकृत सैंपलिंग डिफ़ॉल्ट रूप से सक्षम** होती है:

| सेटिंग | डिफ़ॉल्ट मान | विवरण |
|---|---|---|
| **Reservoir** | 1 अनुरोध/सेकंड | प्रति सेकंड सैंपल किए गए अनुरोधों की निश्चित संख्या |
| **निश्चित दर** | 5% | Reservoir से परे अतिरिक्त अनुरोधों का प्रतिशत |

AWS Distro for OpenTelemetry (ADOT) SDK agent के लिए environment variables इस प्रकार सेट होते हैं:

| Environment Variable | मान | विवरण |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | X-Ray सैंपलिंग सर्विस का उपयोग |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch agent endpoint |

आप इन डिफ़ॉल्ट को अपने एप्लिकेशन को पुनः deploy किए बिना किसी भी समय X-Ray कंसोल के माध्यम से संशोधित कर सकते हैं। उदाहरण के लिए, सैंपलिंग को 10% तक बढ़ाने के लिए, सैंपलिंग नियम की निश्चित दर अपडेट करें। नियम विकल्पों की पूर्ण सूची, उदाहरण, और सर्विस-विशिष्ट नियम बनाने के तरीके के लिए [सैंपलिंग नियम कॉन्फ़िगर करना](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html) देखें।

:::info X-Ray Remote Sampler कब लागू होता है?
`xray` sampler एक लोकल प्रॉक्सी के माध्यम से `http://localhost:2000/GetSamplingRules` और `http://localhost:2000/SamplingTargets` को कॉल करके काम करता है। इसका मतलब है कि X-Ray remote sampling **केवल तभी काम करता है जब लोकल प्रॉक्सी चल रही हो**:

- **CloudWatch Agent** — डिफ़ॉल्ट रूप से पोर्ट 2000 पर सैंपलिंग प्रॉक्सी उजागर करता है
- **OpenTelemetry Collector** — [AWS Proxy extension](https://aws-otel.github.io/docs/getting-started/remote-sampling) कॉन्फ़िगर होने पर

यदि कोई लोकल प्रॉक्सी उपलब्ध नहीं है (जैसे, [collector-less मोड](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) में), ADOT SDK सैंपलिंग endpoints तक नहीं पहुंच सकता और चुपचाप **ParentBased(AlwaysOn) 100%** पर वापस आ जाता है।
:::

#### 2. रनटाइम के अनुसार X-Ray Remote Sampler कॉन्फ़िगरेशन

प्रत्येक ADOT SDK भाषा रनटाइम को X-Ray remote sampling नियमों का उपयोग करने के लिए विशिष्ट कॉन्फ़िगरेशन की आवश्यकता होती है। अपनी भाषा के लिए गाइड देखें:

| रनटाइम | कॉन्फ़िगरेशन गाइड |
|---|---|
| **Java** | [ADOT Java के साथ X-Ray Remote Sampling उपयोग करना](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [ADOT Python के साथ X-Ray Remote Sampling उपयोग करना](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [ADOT JavaScript के साथ X-Ray Remote Sampling उपयोग करना](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [ADOT .NET के साथ X-Ray Remote Sampling उपयोग करना](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [ADOT Go के साथ Sampling कॉन्फ़िगर करना](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

सभी रनटाइम के लिए, प्रमुख environment variables हैं:

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

अपने CloudWatch Agent या collector proxy पते से मिलान करने के लिए endpoint को समायोजित करें (जैसे, EKS पर `http://cloudwatch-agent.amazon-cloudwatch:2000`)।

#### 3. लोकल सैंपलिंग

यदि आपके पास लोकल प्रॉक्सी उपलब्ध नहीं है, या X-Ray सर्विस पर निर्भर हुए बिना लोकल नियंत्रण पसंद करते हैं, तो आप environment variables का उपयोग करके सीधे ADOT SDK में सैंपलिंग कॉन्फ़िगर कर सकते हैं:

| Environment Variable | मान | विवरण |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | लोकल अनुपात-आधारित सैंपलिंग |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% सैंपलिंग दर (आवश्यकतानुसार समायोजित करें) |

यह विशेष रूप से [collector-less मोड](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) में उपयोगी है जहां X-Ray remote sampling अनुपलब्ध है। इन variables के बिना, SDK `parentbased_always_on` (100% सैंपलिंग) पर डिफ़ॉल्ट होता है।

अधिक sampler विकल्पों के लिए, [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) दस्तावेज़ीकरण देखें।

#### 4. X-Ray अनुकूली सैंपलिंग (लागत-अनुकूलित दृष्टिकोण)

:::tip आवश्यकताएं
- ADOT Java SDK (v2.11.5 या उच्चतर)
- CloudWatch Agent या OpenTelemetry Collector के साथ चलना आवश्यक
- Amazon EC2, ECS, EKS, और स्व-होस्टेड Kubernetes के साथ संगत

विस्तृत सेटअप निर्देशों के लिए, [X-Ray Adaptive Sampling](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html) दस्तावेज़ीकरण देखें।
:::

यदि आपको 100% सैंपलिंग की आवश्यकता नहीं है लेकिन बेहतर विसंगति कवरेज चाहते हैं, तो X-Ray अनुकूली सैंपलिंग पर विचार करें जो लागत-प्रभावी बेसलाइन दरें बनाए रखते हुए त्रुटि स्पाइक और लेटेंसी आउटलायर्स के दौरान स्वचालित रूप से सैंपलिंग बढ़ाती है:

प्रमुख लाभ:
- **स्वचालित विसंगति पहचान**: HTTP 5xx त्रुटियों या उच्च लेटेंसी के दौरान सैंपलिंग बढ़ाता है
- **लागत नियंत्रण**: सामान्य संचालन के दौरान कम बेसलाइन सैंपलिंग (जैसे, 5%) बनाए रखता है
- **कॉन्फ़िगर करने योग्य बूस्ट सीमाएं**: अधिकतम सैंपलिंग दरें और कूलडाउन अवधि सेट करें
- **महत्वपूर्ण ट्रेस कैप्चर**: पूर्ण ट्रेस सैंपल न होने पर भी विसंगति spans कैप्चर करना सुनिश्चित करता है
- **केंद्रीकृत नियंत्रण**: एप्लिकेशन कोड परिवर्तन के बिना X-Ray सैंपलिंग नियमों के माध्यम से कॉन्फ़िगर करें

कॉन्फ़िगरेशन उदाहरण:
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

### ट्रेस इंडेक्सिंग

**1. डिफ़ॉल्ट इंडेक्सिंग दर:**
- 1% इंडेक्सिंग बिना अतिरिक्त शुल्क के शामिल है
- 1% से ऊपर इंडेक्सिंग पर X-Ray मूल्य निर्धारण शुल्क लागू होता है
- वर्तमान दरों के लिए [CloudWatch मूल्य निर्धारण](https://aws.amazon.com/cloudwatch/pricing/) दस्तावेज़ीकरण देखें

**2. कस्टम इंडेक्सिंग दरें:**
```bash
# अधिक X-Ray एनालिटिक्स की आवश्यकता वाले एप्लिकेशन के लिए उच्च इंडेक्सिंग (शुल्क लागू)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% इंडेक्सिंग - X-Ray शुल्क लागू

# लागत अनुकूलन के लिए कम इंडेक्सिंग (अभी भी फ्री टियर के भीतर)
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% इंडेक्सिंग - कोई अतिरिक्त शुल्क नहीं
```
