# Metrics

.NET traces మరియు logs తో పాటు metrics ను key pillar గా, application observability కోసం standard గా OpenTelemetry ను adopt చేసింది. ఈ integration developers ను minimal overhead తో application performance monitor చేయడానికి ఎనేబుల్ చేస్తుంది.

.NET ecosystem లో, OpenTelemetry metrics application metrics measure మరియు expose చేయడానికి standardized approach అందిస్తుంది. .NET 6 తో ప్రారంభించి .NET 8 లో గణనీయంగా enhance చేయబడిన, framework metric data collect మరియు export చేయడానికి built-in support అందిస్తుంది.

Framework ASP.NET Core, HTTP clients, మరియు Entity Framework వంటి common components కోసం automatic instrumentation అందిస్తుంది, అదనపు code లేకుండా విలువైన metrics collect చేస్తుంది.

.NET లో OpenTelemetry Prometheus metrics కోసం ముఖ్యంగా popular అయిన multiple export formats కు మద్దతు ఇస్తుంది. ఈ flexibility teams ను consistent collection approach maintain చేస్తూ తమ preferred observability platforms తో integrate చేయడానికి అనుమతిస్తుంది.

OpenTelemetry metrics adopt చేయడం ద్వారా, .NET applications development environments నుండి complex production deployments వరకు scale అయ్యే vendor-neutral, standardized monitoring approach నుండి ప్రయోజనం పొందుతాయి, application health మరియు performance లో crucial visibility అందిస్తాయి.

## Metrics Implementation

.NET 8 applications లో OpenTelemetry metrics implement చేయడం చాలా straightforward గా మారింది. Configuration process ఆధునిక .NET applications కు central అయిన dependency injection system leverage చేస్తుంది. Developers intent clear మరియు configuration options discoverable చేసే fluent API ఉపయోగించి application bootstrap process సమయంలో metrics collection configure చేయవచ్చు:

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

## Custom Metrics

Developers System.Diagnostics.Metrics namespace ఉపయోగించి custom metrics సృష్టించవచ్చు:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## తదుపరి దశలు

మీ application instrument చేయబడిన తర్వాత, మీ ఎంపిక observability backend కు metrics route చేయడానికి OpenTelemetry Collector, CloudWatch Agent, లేదా Fluent Bit వంటి collector agent ఉపయోగించండి. వివరాలు మరియు implementation guidance కోసం క్రింది links చూడండి.

- [OpenTelemetry తో Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - AWS services తో full-stack observability సాధించడానికి telemetry data collect, process, మరియు visualize చేయడానికి patterns అందించే, మీ applications అంతటా OpenTelemetry implement చేయడానికి సమగ్ర guide.

- [AWS Distro for OpenTelemetry (ADOT) Collector operate చేయడం](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Configuration best practices మరియు AWS observability services తో integration తో సహా production environments లో ADOT Collector deploy, scale, మరియు manage చేయడానికి practical guidance.

- [CloudWatch agent తో metrics, logs, మరియు traces collect చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - AWS CloudWatch లోకి seamless integration తో మీ applications మరియు infrastructure నుండి telemetry data collect చేయడానికి CloudWatch agent install మరియు configure చేయడానికి step-by-step instructions.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Containerized environments మరియు Kubernetes deployments కోసం optimized, multiple AWS services కు logs, metrics, మరియు traces collect మరియు forward చేయడానికి lightweight మరియు efficient solution.

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - Separate metrics pipeline అవసరం లేకుండా application logs నుండి metrics extract మరియు visualize చేయడానికి, serverless మరియు containerized applications కోసం ideal అయిన, log events లో metric data embed చేయడానికి Specification.

- [Amazon Managed Grafana -- Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - Data sources configure చేయడం, dashboards create చేయడం, మరియు alerts implement చేయడానికి step-by-step instructions తో మీ metrics data యొక్క powerful visualizations create చేయడానికి Amazon Managed Grafana సెటప్ చేయడానికి Tutorial.
