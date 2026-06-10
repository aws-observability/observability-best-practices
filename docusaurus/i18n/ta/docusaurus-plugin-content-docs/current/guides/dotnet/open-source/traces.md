# ட்ரேஸிங்

.NET விநியோகிக்கப்பட்ட அமைப்புகளில் கோரிக்கை ஓட்டங்களை கண்காணிக்க சக்திவாய்ந்த கருவிகளை வழங்கும் OpenTelemetry ட்ரேஸிங்கிற்கு வலுவான ஆதரவை வழங்குகிறது. இந்த செயல்படுத்தல் பயன்பாட்டு நடத்தை மற்றும் செயல்திறன் தடைகளில் முழுமையான தெரிவுநிலையை செயல்படுத்துகிறது.

.NET சூழலமைப்பில், OpenTelemetry ட்ரேஸிங் [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) class ஐ மையமாகக் கொண்டு கட்டமைக்கப்பட்டுள்ளது, இது W3C Trace Context specification இன் .NET செயல்படுத்தலாகும். தொழில்துறை தரநிலைகளுடனான இந்த ஒருங்கிணைப்பு மற்ற சேவைகள் மற்றும் observability கருவிகளுடன் இயங்குதிறனை உறுதி செய்கிறது.

## ட்ரேஸ்கள் செயல்படுத்தல்

.NET பயன்பாட்டில் OpenTelemetry ட்ரேஸிங்கை கட்டமைப்பது நேரடியானது:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET இன் OpenTelemetry செயல்படுத்தலின் முக்கிய வலிமை தானியங்கி instrumentation ஆகும். பல பொதுவான லைப்ரரிகள் மற்றும் framework கள்—ASP.NET Core, HttpClient, gRPC மற்றும் Entity Framework Core உட்பட—கூடுதல் குறியீடு தேவையின்றி ட்ரேஸ்களை வெளியிடுகின்றன. இது வெளிப்புற அழைப்புகள் மற்றும் தரவுத்தள செயல்பாடுகளில் உடனடி தெரிவுநிலையை வழங்குகிறது.

## தனிப்பயன் ட்ரேஸ்கள்

பயன்பாட்டு குறியீட்டில் தனிப்பயன் ட்ரேஸ்களை உருவாக்குவது ActivitySource API ஐ பயன்படுத்துகிறது:

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

dependency injection இல் உங்கள் ActivitySource ஐ பதிவு செய்வது .NET பயன்பாடுகளில் OpenTelemetry ட்ரேஸிங்கிற்கான சிறந்த நடைமுறையாக கருதப்படுகிறது.

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

## அடுத்த படிகள்

உங்கள் பயன்பாடு instrumented செய்யப்பட்டவுடன், ட்ரேஸ்களை நீங்கள் விரும்பும் observability backend க்கு அனுப்ப OpenTelemetry Collector, CloudWatch Agent, அல்லது Fluent Bit போன்ற collector agent ஐ பயன்படுத்தவும். விவரங்கள் மற்றும் செயல்படுத்தல் வழிகாட்டுதலுக்கு கீழே உள்ள இணைப்புகளைப் பார்க்கவும்.

- [OpenTelemetry உடன் Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - உங்கள் பயன்பாடுகளில் OpenTelemetry ஐ செயல்படுத்துவதற்கான விரிவான வழிகாட்டி, முழு-ஸ்டாக் observability ஐ அடைய AWS சேவைகளுடன் டெலிமெட்ரி தரவை சேகரிப்பதற்கும், செயலாக்குவதற்கும், காட்சிப்படுத்துவதற்கும் பேட்டர்ன்களை வழங்குகிறது.

- [AWS Distro for OpenTelemetry (ADOT) Collector ஐ இயக்குதல்](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - உற்பத்தி சூழல்களில் ADOT Collector ஐ டிப்ளாய் செய்வதற்கும், அளவிடுவதற்கும், நிர்வகிப்பதற்கும் நடைமுறை வழிகாட்டுதல், கட்டமைப்பு சிறந்த நடைமுறைகள் மற்றும் AWS observability சேவைகளுடன் ஒருங்கிணைப்பு உட்பட.

- [CloudWatch agent மூலம் மெட்ரிக்குகள், லாக்குகள் மற்றும் ட்ரேஸ்களை சேகரிக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - உங்கள் பயன்பாடுகள் மற்றும் உள்கட்டமைப்பிலிருந்து டெலிமெட்ரி தரவை சேகரிக்க CloudWatch agent ஐ நிறுவுவதற்கும் கட்டமைப்பதற்கும் படிப்படியான வழிமுறைகள், AWS CloudWatch உடன் தடையற்ற ஒருங்கிணைப்பு.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - பல AWS சேவைகளுக்கு லாக்குகள், மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களை சேகரிப்பதற்கும் அனுப்புவதற்கும் இலகுரக மற்றும் திறமையான தீர்வு, கண்டெய்னர்மயமாக்கப்பட்ட சூழல்கள் மற்றும் Kubernetes டிப்ளாய்மென்ட்களுக்கு உகந்ததாக்கப்பட்டது.

- [AWS XRay](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - விநியோகிக்கப்பட்ட ட்ரேஸிங்கிற்காக AWS X-Ray ஐ OpenTelemetry உடன் ஒருங்கிணைப்பது குறித்த விரிவான ஆவணம், ட்ரேஸ் காட்சிப்படுத்தல் மற்றும் பகுப்பாய்வு கருவிகளுடன் உற்பத்தி பயன்பாடுகளை பெரிய அளவில் பகுப்பாய்வு செய்வதற்கும் பிழைத்திருத்தம் செய்வதற்கும் உதவுகிறது.
