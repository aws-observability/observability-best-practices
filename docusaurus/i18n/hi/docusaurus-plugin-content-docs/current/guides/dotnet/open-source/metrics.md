# मेट्रिक्स

.NET ने ट्रेसेस और लॉग्स के साथ एप्लिकेशन observability के मानक के रूप में OpenTelemetry को अपनाया है, जिसमें मेट्रिक्स एक प्रमुख स्तंभ है। यह एकीकरण डेवलपर्स को न्यूनतम ओवरहेड के साथ एप्लिकेशन प्रदर्शन की निगरानी करने में सक्षम बनाता है।

.NET इकोसिस्टम में, OpenTelemetry मेट्रिक्स एप्लिकेशन मेट्रिक्स को मापने और प्रदर्शित करने के लिए एक मानकीकृत दृष्टिकोण प्रदान करते हैं। .NET 6 से शुरू होकर और .NET 8 में महत्वपूर्ण रूप से बढ़ाया गया, फ्रेमवर्क मेट्रिक डेटा एकत्र करने और निर्यात करने के लिए बिल्ट-इन समर्थन प्रदान करता है।

फ्रेमवर्क ASP.NET Core, HTTP clients और Entity Framework जैसे सामान्य कंपोनेंट्स के लिए स्वचालित इंस्ट्रूमेंटेशन प्रदान करता है, बिना अतिरिक्त कोड के मूल्यवान मेट्रिक्स एकत्र करता है।

.NET में OpenTelemetry कई निर्यात प्रारूपों का समर्थन करता है, जिसमें Prometheus मेट्रिक्स के लिए विशेष रूप से लोकप्रिय है। यह लचीलापन टीमों को एक सुसंगत संग्रह दृष्टिकोण बनाए रखते हुए अपने पसंदीदा observability प्लेटफ़ॉर्म के साथ एकीकृत करने की अनुमति देता है।

OpenTelemetry मेट्रिक्स को अपनाकर, .NET अनुप्रयोगों को निगरानी के लिए एक वेंडर-न्यूट्रल, मानकीकृत दृष्टिकोण का लाभ मिलता है जो विकास वातावरण से लेकर जटिल प्रोडक्शन डिप्लॉयमेंट तक स्केल करता है, एप्लिकेशन स्वास्थ्य और प्रदर्शन में महत्वपूर्ण दृश्यता प्रदान करता है।

## मेट्रिक्स कार्यान्वयन

.NET 8 अनुप्रयोगों में OpenTelemetry मेट्रिक्स लागू करना अत्यंत सरल हो गया है। कॉन्फ़िगरेशन प्रक्रिया dependency injection सिस्टम का लाभ उठाती है जो आधुनिक .NET अनुप्रयोगों के केंद्र में है। डेवलपर एप्लिकेशन बूटस्ट्रैप प्रक्रिया के दौरान एक fluent API का उपयोग करके मेट्रिक्स संग्रह कॉन्फ़िगर कर सकते हैं जो इरादे को स्पष्ट और कॉन्फ़िगरेशन विकल्पों को खोजने योग्य बनाता है:

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## कस्टम मेट्रिक्स

डेवलपर System.Diagnostics.Metrics namespace का उपयोग करके कस्टम मेट्रिक्स बना सकते हैं:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## अगले कदम

अब जब आपका एप्लिकेशन इंस्ट्रूमेंट हो गया है, तो एक collector agent का उपयोग करें—जैसे OpenTelemetry Collector, CloudWatch Agent, या Fluent Bit—अपनी पसंद के observability backend पर मेट्रिक्स रूट करने के लिए। विवरण और कार्यान्वयन मार्गदर्शन के लिए नीचे दिए गए लिंक देखें।

- [OpenTelemetry के साथ Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - अपने अनुप्रयोगों में OpenTelemetry लागू करने के लिए व्यापक गाइड, AWS सेवाओं के साथ टेलीमेट्री डेटा एकत्र करने, प्रसंस्करण करने और विज़ुअलाइज़ करने के पैटर्न प्रदान करता है ताकि फुल-स्टैक observability प्राप्त हो सके।

- [AWS Distro for OpenTelemetry (ADOT) Collector का संचालन](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - प्रोडक्शन वातावरण में ADOT Collector को डिप्लॉय, स्केल और प्रबंधित करने के लिए व्यावहारिक मार्गदर्शन, जिसमें कॉन्फ़िगरेशन सर्वोत्तम प्रथाएं और AWS observability सेवाओं के साथ एकीकरण शामिल है।

- [CloudWatch agent के साथ मेट्रिक्स, लॉग्स और ट्रेसेस एकत्र करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - आपके अनुप्रयोगों और इंफ्रास्ट्रक्चर से टेलीमेट्री डेटा एकत्र करने के लिए CloudWatch agent को इंस्टॉल और कॉन्फ़िगर करने के चरण-दर-चरण निर्देश, AWS CloudWatch में सहज एकीकरण के साथ।

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - कई AWS सेवाओं को लॉग्स, मेट्रिक्स और ट्रेसेस एकत्र करने और अग्रेषित करने के लिए हल्का और कुशल समाधान, कंटेनरीकृत वातावरण और Kubernetes डिप्लॉयमेंट के लिए अनुकूलित।

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - लॉग इवेंट में मेट्रिक डेटा एम्बेड करने के लिए विशिष्टता, जो आपको एक अलग मेट्रिक्स पाइपलाइन की आवश्यकता के बिना एप्लिकेशन लॉग्स से मेट्रिक्स निकालने और विज़ुअलाइज़ करने की अनुमति देता है, सर्वरलेस और कंटेनरीकृत अनुप्रयोगों के लिए आदर्श।

- [Amazon Managed Grafana - शुरुआत करना](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - अपने मेट्रिक्स डेटा के शक्तिशाली विज़ुअलाइज़ेशन बनाने के लिए Amazon Managed Grafana सेट करने का ट्यूटोरियल, डेटा स्रोत कॉन्फ़िगर करने, डैशबोर्ड बनाने और अलर्ट लागू करने के चरण-दर-चरण निर्देशों के साथ।