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