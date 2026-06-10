# Tracing

.NET పంపిణీ చేయబడిన వ్యవస్థలలో అభ్యర్థన ప్రవాహాలను పర్యవేక్షించడానికి డెవలపర్లకు శక్తివంతమైన సాధనాలను అందిస్తూ OpenTelemetry tracing కోసం బలమైన మద్దతును అందిస్తుంది. ఈ అమలు అప్లికేషన్ ప్రవర్తన మరియు పనితీరు అడ్డంకులపై ఎండ్-టు-ఎండ్ దృశ్యమానతను అనుమతిస్తుంది.

.NET ఎకోసిస్టమ్‌లో, OpenTelemetry tracing [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) class చుట్టూ నిర్మించబడింది, ఇది W3C Trace Context స్పెసిఫికేషన్ యొక్క .NET అమలు. పరిశ్రమ ప్రమాణాలతో ఈ అనుసరణ ఇతర సేవలు మరియు observability సాధనాలతో పరస్పర చర్యను నిర్ధారిస్తుంది.

## Traces అమలు

.NET అప్లికేషన్‌లో OpenTelemetry tracing ను కాన్ఫిగర్ చేయడం సూటిగా ఉంటుంది:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET యొక్క OpenTelemetry అమలులో ఒక కీలక బలం స్వయంచాలక instrumentation. ASP.NET Core, HttpClient, gRPC మరియు Entity Framework Core తో సహా అనేక సాధారణ లైబ్రరీలు మరియు ఫ్రేమ్‌వర్క్‌లు అదనపు కోడ్ అవసరం లేకుండా traces ను ఉత్పత్తి చేస్తాయి. ఇది బాహ్య కాల్‌లు మరియు database operations పై తక్షణ దృశ్యమానతను అందిస్తుంది.

## Custom Traces

అప్లికేషన్ కోడ్‌లో custom traces సృష్టించడం ActivitySource API ని ఉపయోగిస్తుంది:

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

.NET అప్లికేషన్లలో OpenTelemetry tracing కోసం మీ ActivitySource ను dependency injection లో నమోదు చేయడం ఒక ఉత్తమ పద్ధతిగా పరిగణించబడుతుంది.

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
