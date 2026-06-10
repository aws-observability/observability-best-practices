# लॉग्स

.NET, मेट्रिक्स और ट्रेसेस के साथ observability triad को पूरा करते हुए, OpenTelemetry लॉगिंग के लिए व्यापक समर्थन प्रदान करता है। यह एकीकरण संरचित, संदर्भयुक्त लॉगिंग को सक्षम बनाता है जो आधुनिक observability प्लेटफ़ॉर्म में सहज रूप से प्रवाहित होती है।

.NET में OpenTelemetry लॉगिंग कार्यान्वयन स्थापित Microsoft.Extensions.Logging abstractions पर आधारित है, जो डेवलपर्स को मौजूदा लॉगिंग कोड बदले बिना OpenTelemetry अपनाने की अनुमति देता है। यह पश्चगामी संगतता नए और मौजूदा दोनों अनुप्रयोगों में अपनाने को सरल बनाती है।

## लॉगिंग कार्यान्वयन

.NET एप्लिकेशन में OpenTelemetry लॉग्स सेट करने के लिए न्यूनतम कॉन्फ़िगरेशन की आवश्यकता होती है:

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

.NET में OpenTelemetry लॉग्स की सबसे शक्तिशाली विशेषताओं में से एक स्वचालित context propagation है। जब लॉगिंग एक सक्रिय trace के भीतर होती है तो लॉग एंट्रीज़ स्वचालित रूप से trace और span IDs के साथ समृद्ध हो जाती हैं, जो लॉग्स और संबंधित वितरित ट्रेसेस के बीच कनेक्शन बनाती हैं।

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

.NET अनुप्रयोगों में OpenTelemetry लॉग्स लागू करके, विकास टीमें लॉगिंग के लिए एक मानकीकृत दृष्टिकोण प्राप्त करती हैं जो व्यापक observability ecosystem के साथ सुचारू रूप से एकीकृत होता है। यह एकीकरण समस्या निवारण के लिए महत्वपूर्ण संदर्भ प्रदान करता है, सेवाओं के बीच संबंधित सिग्नल को जोड़ता है, और वितरित वातावरण में अधिक प्रभावी मॉनिटरिंग और डिबगिंग को सक्षम बनाता है।

## अगले कदम

अब जब आपका एप्लिकेशन इंस्ट्रूमेंट हो गया है, तो एक collector agent का उपयोग करें—जैसे OpenTelemetry Collector, CloudWatch Agent, या Fluent Bit—अपनी पसंद के observability backend पर लॉग्स रूट करने के लिए। विवरण और कार्यान्वयन मार्गदर्शन के लिए नीचे दिए गए लिंक देखें।

- [OpenTelemetry के साथ Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - अपने अनुप्रयोगों में OpenTelemetry लागू करने के लिए व्यापक गाइड, AWS सेवाओं के साथ टेलीमेट्री डेटा एकत्र करने, प्रसंस्करण करने और विज़ुअलाइज़ करने के पैटर्न प्रदान करता है ताकि फुल-स्टैक observability प्राप्त हो सके।

- [AWS Distro for OpenTelemetry (ADOT) Collector का संचालन](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - प्रोडक्शन वातावरण में ADOT Collector को डिप्लॉय, स्केल और प्रबंधित करने के लिए व्यावहारिक मार्गदर्शन, जिसमें कॉन्फ़िगरेशन सर्वोत्तम प्रथाएं और AWS observability सेवाओं के साथ एकीकरण शामिल है।

- [CloudWatch agent के साथ मेट्रिक्स, लॉग्स और ट्रेसेस एकत्र करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - आपके अनुप्रयोगों और इंफ्रास्ट्रक्चर से टेलीमेट्री डेटा एकत्र करने के लिए CloudWatch agent को इंस्टॉल और कॉन्फ़िगर करने के चरण-दर-चरण निर्देश, AWS CloudWatch में सहज एकीकरण के साथ।

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - कई AWS सेवाओं को लॉग्स, मेट्रिक्स और ट्रेसेस एकत्र करने और अग्रेषित करने के लिए हल्का और कुशल समाधान, कंटेनरीकृत वातावरण और Kubernetes डिप्लॉयमेंट के लिए अनुकूलित।

- [ADOT Collector Amazon CloudWatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - विशेष OpenTelemetry Collector कंपोनेंट जो लॉग्स को सीधे Amazon CloudWatch Logs में निर्यात करता है, लॉग groups, streams और AWS प्रमाणीकरण के लिए कॉन्फ़िगरेशन विकल्पों के साथ।