# ट्रेसिंग

.NET, OpenTelemetry ट्रेसिंग के लिए मजबूत समर्थन प्रदान करता है, डेवलपर्स को वितरित प्रणालियों में अनुरोध प्रवाह की निगरानी के लिए शक्तिशाली उपकरण देता है। यह कार्यान्वयन एप्लिकेशन व्यवहार और प्रदर्शन बॉटलनेक में एंड-टू-एंड दृश्यता प्रदान करता है।

.NET इकोसिस्टम में, OpenTelemetry ट्रेसिंग [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) class के आसपास बनाया गया है, जो W3C Trace Context विशिष्टता का .NET कार्यान्वयन है। उद्योग मानकों के साथ यह संरेखण अन्य सेवाओं और observability उपकरणों के साथ इंटरऑपरेबिलिटी सुनिश्चित करता है।

## ट्रेसेस कार्यान्वयन

.NET एप्लिकेशन में OpenTelemetry ट्रेसिंग कॉन्फ़िगर करना सरल है:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET के OpenTelemetry कार्यान्वयन की एक प्रमुख ताकत स्वचालित इंस्ट्रूमेंटेशन है। कई सामान्य लाइब्रेरीज़ और फ्रेमवर्क—जिनमें ASP.NET Core, HttpClient, gRPC, और Entity Framework Core शामिल हैं—अतिरिक्त कोड की आवश्यकता के बिना ट्रेसेस उत्सर्जित करते हैं। यह बाहरी कॉल और डेटाबेस ऑपरेशन में तत्काल दृश्यता प्रदान करता है।

## कस्टम ट्रेसेस

एप्लिकेशन कोड में कस्टम ट्रेसेस बनाने के लिए ActivitySource API का उपयोग करें:

```c#
// Create a source once and reuse it
private static readonly ActivitySource MyActivitySource = 
    new("MyApplication.Tracing");

// Create spans for important operations
using var activity = MyActivitySource.StartActivity("ProcessOrder");
activity?.SetTag("orderId", orderId);

// Child operations create nested spans
using var childActivity = MyActivitySource.StartActivity("ValidatePayment");
```

.NET अनुप्रयोगों में OpenTelemetry ट्रेसिंग के लिए सर्वोत्तम प्रथा के रूप में अपने ActivitySource को dependency injection में रजिस्टर करना माना जाता है।

```c#
// During service configuration
services.AddSingleton(sp => new ActivitySource("MyCompany.MyApplication", "1.0.0"));

// Or create a wrapper service if you need more functionality
services.AddSingleton<TracingService>();

// Then inject it where needed
public class OrderProcessor
{
    private readonly ActivitySource _activitySource;
    
    public OrderProcessor(ActivitySource activitySource)
    {
        _activitySource = activitySource;
    }
    
    public void ProcessOrder(Order order)
    {
        using var activity = _activitySource.StartActivity("ProcessOrder");
        activity?.SetTag("orderId", order.Id);
        
        // Processing logic
    }
}
```

## अगले कदम

अब जब आपका एप्लिकेशन इंस्ट्रूमेंट हो गया है, तो एक collector agent का उपयोग करें—जैसे OpenTelemetry Collector, CloudWatch Agent, या Fluent Bit—अपनी पसंद के observability backend पर ट्रेसेस रूट करने के लिए। विवरण और कार्यान्वयन मार्गदर्शन के लिए नीचे दिए गए लिंक देखें।

- [OpenTelemetry के साथ Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - अपने अनुप्रयोगों में OpenTelemetry लागू करने के लिए व्यापक गाइड, AWS सेवाओं के साथ टेलीमेट्री डेटा एकत्र करने, प्रसंस्करण करने और विज़ुअलाइज़ करने के पैटर्न प्रदान करता है ताकि फुल-स्टैक observability प्राप्त हो सके।

- [AWS Distro for OpenTelemetry (ADOT) Collector का संचालन](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - प्रोडक्शन वातावरण में ADOT Collector को डिप्लॉय, स्केल और प्रबंधित करने के लिए व्यावहारिक मार्गदर्शन, जिसमें कॉन्फ़िगरेशन सर्वोत्तम प्रथाएं और AWS observability सेवाओं के साथ एकीकरण शामिल है।

- [CloudWatch agent के साथ मेट्रिक्स, लॉग्स और ट्रेसेस एकत्र करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - आपके अनुप्रयोगों और इंफ्रास्ट्रक्चर से टेलीमेट्री डेटा एकत्र करने के लिए CloudWatch agent को इंस्टॉल और कॉन्फ़िगर करने के चरण-दर-चरण निर्देश, AWS CloudWatch में सहज एकीकरण के साथ।

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - कई AWS सेवाओं को लॉग्स, मेट्रिक्स और ट्रेसेस एकत्र करने और अग्रेषित करने के लिए हल्का और कुशल समाधान, कंटेनरीकृत वातावरण और Kubernetes डिप्लॉयमेंट के लिए अनुकूलित।

- [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - वितरित ट्रेसिंग के लिए AWS X-Ray को OpenTelemetry के साथ एकीकृत करने पर विस्तृत डॉक्यूमेंटेशन, जो आपको ट्रेस विज़ुअलाइज़ेशन और विश्लेषण उपकरणों के साथ बड़े पैमाने पर प्रोडक्शन अनुप्रयोगों का विश्लेषण और डिबग करने की अनुमति देता है।