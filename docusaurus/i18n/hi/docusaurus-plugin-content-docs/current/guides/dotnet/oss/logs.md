# लॉग्स

.NET, मेट्रिक्स और ट्रेसेस के साथ ऑब्ज़र्वेबिलिटी triad को पूरा करते हुए, OpenTelemetry लॉगिंग के लिए व्यापक समर्थन प्रदान करता है। यह एकीकरण संरचित, संदर्भयुक्त लॉगिंग को सक्षम बनाता है जो आधुनिक ऑब्ज़र्वेबिलिटी प्लेटफ़ॉर्म में सहज रूप से प्रवाहित होती है।

.NET में OpenTelemetry लॉगिंग कार्यान्वयन स्थापित Microsoft.Extensions.Logging abstractions पर आधारित है, जो डेवलपर्स को मौजूदा लॉगिंग कोड बदले बिना OpenTelemetry अपनाने की अनुमति देता है। यह पश्चगामी संगतता नए और मौजूदा दोनों एप्लिकेशन्स में अपनाने को सरल बनाती है।

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

.NET में OpenTelemetry लॉग्स की सबसे शक्तिशाली विशेषताओं में से एक स्वचालित context propagation है। जब लॉगिंग एक सक्रिय trace के भीतर होती है तो लॉग एंट्रीज़ स्वचालित रूप से trace और span IDs के साथ समृद्ध हो जाती हैं, जो लॉग्स और संबंधित वितरित ट्रेसेस के बीच कनेक्शन बनाती हैं

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

.NET एप्लिकेशन्स में OpenTelemetry लॉग्स लागू करके, विकास टीमें लॉगिंग के लिए एक मानकीकृत दृष्टिकोण प्राप्त करती हैं जो व्यापक ऑब्ज़र्वेबिलिटी ecosystem के साथ सुचारू रूप से एकीकृत होता है। यह एकीकरण समस्या निवारण के लिए महत्वपूर्ण संदर्भ प्रदान करता है, सेवाओं के बीच संबंधित सिग्नल को जोड़ता है, और वितरित एनवायरनमेंट में अधिक प्रभावी मॉनिटरिंग और डिबगिंग को सक्षम बनाता है।