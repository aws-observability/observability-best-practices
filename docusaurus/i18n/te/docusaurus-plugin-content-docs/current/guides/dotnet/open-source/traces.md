# Tracing

.NET distributed systems అంతటా request flows monitor చేయడానికి developers కు powerful tools అందిస్తూ OpenTelemetry tracing కోసం robust support అందిస్తుంది. ఈ implementation application behavior మరియు performance bottlenecks లో end-to-end visibility ఎనేబుల్ చేస్తుంది.

.NET ecosystem లో, OpenTelemetry tracing W3C Trace Context specification యొక్క .NET implementation అయిన [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) class చుట్టూ నిర్మించబడింది. Industry standards తో ఈ alignment ఇతర services మరియు observability tools తో interoperability నిర్ధారిస్తుంది.

## Traces Implementation

.NET application లో OpenTelemetry tracing configure చేయడం సరళమైనది:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET యొక్క OpenTelemetry implementation యొక్క key strength automatic instrumentation. ASP.NET Core, HttpClient, gRPC, మరియు Entity Framework Core తో సహా అనేక common libraries మరియు frameworks -- అదనపు code అవసరం లేకుండా traces emit చేస్తాయి. ఇది external calls మరియు database operations లో immediate visibility అందిస్తుంది.

## Custom Traces

Application code లో custom traces సృష్టించడం ActivitySource API ఉపయోగిస్తుంది:

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

.NET applications లో OpenTelemetry tracing కోసం dependency injection లో మీ ActivitySource register చేయడం best practice గా పరిగణించబడుతుంది.

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

## తదుపరి దశలు

మీ application instrument చేయబడిన తర్వాత, మీ ఎంపిక observability backend కు traces route చేయడానికి OpenTelemetry Collector, CloudWatch Agent, లేదా Fluent Bit వంటి collector agent ఉపయోగించండి. వివరాలు మరియు implementation guidance కోసం క్రింది links చూడండి.

- [OpenTelemetry తో Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - AWS services తో full-stack observability సాధించడానికి telemetry data collect, process, మరియు visualize చేయడానికి patterns అందించే, మీ applications అంతటా OpenTelemetry implement చేయడానికి సమగ్ర guide.

- [AWS Distro for OpenTelemetry (ADOT) Collector operate చేయడం](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Configuration best practices మరియు AWS observability services తో integration తో సహా production environments లో ADOT Collector deploy, scale, మరియు manage చేయడానికి practical guidance.

- [CloudWatch agent తో metrics, logs, మరియు traces collect చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - AWS CloudWatch లోకి seamless integration తో మీ applications మరియు infrastructure నుండి telemetry data collect చేయడానికి CloudWatch agent install మరియు configure చేయడానికి step-by-step instructions.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Containerized environments మరియు Kubernetes deployments కోసం optimized, multiple AWS services కు logs, metrics, మరియు traces collect మరియు forward చేయడానికి lightweight మరియు efficient solution.

- [AWS XRay](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - Trace visualization మరియు analysis tools తో production applications ను scale వద్ద analyze మరియు debug చేయడానికి, distributed tracing కోసం AWS X-Ray ను OpenTelemetry తో integrate చేయడంపై detailed documentation.
