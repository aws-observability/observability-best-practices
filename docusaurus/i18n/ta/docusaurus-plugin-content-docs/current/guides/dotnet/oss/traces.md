# ட்ரேசிங்

.NET OpenTelemetry ட்ரேசிங்கிற்கு வலுவான ஆதரவை வழங்குகிறது, விநியோகிக்கப்பட்ட அமைப்புகளில் கோரிக்கை ஓட்டங்களை கண்காணிக்க டெவலப்பர்களுக்கு சக்திவாய்ந்த கருவிகளை வழங்குகிறது. இந்த செயல்படுத்தல் பயன்பாட்டு நடத்தை மற்றும் செயல்திறன் தடைகள் பற்றிய முழுமையான தெரிவுநிலையை செயல்படுத்துகிறது.

.NET சூழலமைப்பில், OpenTelemetry ட்ரேசிங் [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) வகுப்பை மையமாகக் கொண்டு கட்டமைக்கப்பட்டுள்ளது, இது W3C Trace Context விவரக்குறிப்பின் .NET செயல்படுத்தலாகும். தொழில்துறை தரநிலைகளுடன் இந்த இணக்கம் மற்ற சேவைகள் மற்றும் observability கருவிகளுடன் இயங்குதிறனை உறுதி செய்கிறது.

## ட்ரேஸ்கள் செயல்படுத்தல்

.NET பயன்பாட்டில் OpenTelemetry ட்ரேசிங்கை கட்டமைப்பது எளிமையானது:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET இன் OpenTelemetry செயல்படுத்தலின் முக்கிய வலிமை தானியங்கி இன்ஸ்ட்ருமென்டேஷன் ஆகும். ASP.NET Core, HttpClient, gRPC மற்றும் Entity Framework Core உட்பட பல பொதுவான நூலகங்கள் மற்றும் கட்டமைப்புகள் கூடுதல் குறியீடு தேவைப்படாமல் ட்ரேஸ்களை வெளியிடுகின்றன. இது வெளிப்புற அழைப்புகள் மற்றும் தரவுத்தள செயல்பாடுகளில் உடனடி தெரிவுநிலையை வழங்குகிறது.

## தனிப்பயன் ட்ரேஸ்கள்

பயன்பாட்டு குறியீட்டில் தனிப்பயன் ட்ரேஸ்களை உருவாக்க ActivitySource API பயன்படுத்தப்படுகிறது:

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

.NET பயன்பாடுகளில் OpenTelemetry ட்ரேசிங்கிற்கான சிறந்த நடைமுறையாக dependency injection இல் உங்கள் ActivitySource ஐ பதிவு செய்வது கருதப்படுகிறது.

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
