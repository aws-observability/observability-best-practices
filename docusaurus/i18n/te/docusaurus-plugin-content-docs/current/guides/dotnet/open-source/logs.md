# Logs

.NET metrics మరియు traces తో పాటు observability triad ను పూర్తి చేసే OpenTelemetry logging కోసం సమగ్ర మద్దతు అందిస్తుంది. ఈ integration ఆధునిక observability platforms లోకి అతుకులు లేకుండా flow అయ్యే structured, contextualized logging ను ఎనేబుల్ చేస్తుంది.

.NET లో OpenTelemetry logging implementation స్థాపిత Microsoft.Extensions.Logging abstractions పై నిర్మించబడింది, developers ఇప్పటికే ఉన్న logging code మార్చకుండా OpenTelemetry adopt చేయడానికి అనుమతిస్తుంది. ఈ backward compatibility కొత్త మరియు ఇప్పటికే ఉన్న applications రెండింటిలోనూ adoption ను సరళం చేస్తుంది.

## Logging Implementation

.NET application లో OpenTelemetry logs సెటప్ చేయడానికి minimal configuration అవసరం:

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

.NET లో OpenTelemetry logs యొక్క అత్యంత powerful features లో ఒకటి automatic context propagation. Active trace లో logging జరిగినప్పుడు Log entries స్వయంచాలకంగా trace మరియు span IDs తో enrich చేయబడతాయి, logs మరియు సంబంధిత distributed traces మధ్య connections సృష్టిస్తాయి.

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

.NET applications లో OpenTelemetry logs implement చేయడం ద్వారా, development teams విస్తృత observability ecosystem తో smoothly integrate అయ్యే logging కోసం standardized approach పొందుతాయి. ఈ integration troubleshooting కోసం critical context అందిస్తుంది, services అంతటా related signals connect చేస్తుంది, మరియు distributed environments లో మరింత effective monitoring మరియు debugging ఎనేబుల్ చేస్తుంది.

## తదుపరి దశలు

మీ application instrument చేయబడిన తర్వాత, మీ ఎంపిక observability backend కు logs route చేయడానికి OpenTelemetry Collector, CloudWatch Agent, లేదా Fluent Bit వంటి collector agent ఉపయోగించండి. వివరాలు మరియు implementation guidance కోసం క్రింది links చూడండి.

- [OpenTelemetry తో Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - AWS services తో full-stack observability సాధించడానికి telemetry data collect, process, మరియు visualize చేయడానికి patterns అందించే, మీ applications అంతటా OpenTelemetry implement చేయడానికి సమగ్ర guide.

- [AWS Distro for OpenTelemetry (ADOT) Collector operate చేయడం](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Configuration best practices మరియు AWS observability services తో integration తో సహా production environments లో ADOT Collector deploy, scale, మరియు manage చేయడానికి practical guidance.

- [CloudWatch agent తో metrics, logs, మరియు traces collect చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - AWS CloudWatch లోకి seamless integration తో మీ applications మరియు infrastructure నుండి telemetry data collect చేయడానికి CloudWatch agent install మరియు configure చేయడానికి step-by-step instructions.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Containerized environments మరియు Kubernetes deployments కోసం optimized, multiple AWS services కు logs, metrics, మరియు traces collect మరియు forward చేయడానికి lightweight మరియు efficient solution.

- [ADOT Collector Amazon CloudWatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - Log groups, streams, మరియు AWS authentication కోసం configuration options తో, Amazon CloudWatch Logs కు నేరుగా logs export చేసే specialized OpenTelemetry Collector component.
