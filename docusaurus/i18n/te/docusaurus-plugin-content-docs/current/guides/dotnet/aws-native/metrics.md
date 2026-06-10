# Metrics

Metrics Observability లో అత్యవసరం ఎందుకంటే అవి సిస్టమ్ పనితీరు మరియు ప్రవర్తన గురించి పరిమాణాత్మక డేటాను అందిస్తాయి. ఇది ట్రెండ్ విశ్లేషణను సాధ్యం చేస్తుంది మరియు వినియోగదారులపై ప్రభావం చూపడానికి ముందే సమస్యలను గుర్తించడానికి proactive monitoring కు మద్దతు ఇస్తుంది.

Metrics సాధారణంగా మరియు Amazon CloudWatch యొక్క Metric సేకరణ మరియు విశ్లేషణ ఫీచర్ల గురించి తెలుసుకోవడానికి [**Metrics in Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) సందర్శించండి

[**అనేక AWS సేవలు Amazon CloudWatch కు infrastructure metrics ను out-of-the-box గా ప్రచురించే సామర్థ్యం కలిగి ఉన్నప్పటికీ**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html), ఈ విభాగం .NET అప్లికేషన్‌ల నుండి custom metrics ను సంగ్రహించి విశ్లేషణ కోసం Amazon CloudWatch metric monitoring systems కు రవాణా చేయడంపై దృష్టి పెడుతుంది.

### AWS SDK for .NET ద్వారా CloudWatch PutMetricData API call ఉపయోగించండి

మీ కోడ్‌లో Amazon.CloudWatch మరియు Amazon.CloudWatch.Model NuGet packages ను చేర్చండి.

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

namespace, metric name మరియు value, dimensions మరియు dimension values కలిగిన PutMetricDataRequest object ను నిర్మించండి.

```csharp
var request = new PutMetricDataRequest
{
    Namespace = namespaceName,
    MetricData = new List<MetricDatum>
    {
        new MetricDatum
        {
            MetricName = metricName,
            Dimensions = new List<Dimension>
            {
                new Dimension
                {
                    Name = dimensionName,
                    Value = dimensionValue
                }
            },
            Value = metricValue
        }
    }
};
```

PutMetricData API call ఉపయోగించి metric డేటాను Amazon CloudWatch కు పంపండి.

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch embedded metric format

[**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) CloudWatch Logs కు logs వ్రాయడం ద్వారా asynchronously గా custom metrics సృష్టించడానికి అనుమతిస్తుంది. ఈ విధానం మిమ్మల్ని అనుమతిస్తుంది:

* వివరమైన log event డేటాతో పాటు custom metrics ను పొందుపరచడం
* విజువలైజేషన్ మరియు అలారమింగ్ కోసం CloudWatch ఈ metrics ను ఆటోమేటిక్‌గా extract చేయడం
* నిజ-సమయ సంఘటన గుర్తింపును సాధ్యం చేయడం
* CloudWatch Logs Insights ఉపయోగించి సంబంధిత వివరమైన log events ను query చేయడం
* ఆపరేషనల్ సంఘటనల మూల కారణాలపై లోతైన అవగాహనలు పొందడం

#### EMF ఉపయోగించడానికి వినియోగ సందర్భాలు

* కంప్యూట్ environments అంతటా custom metrics ఉత్పత్తి చేయడం

  * Custom batching code అవసరం లేకుండా, blocking network requests చేయకుండా లేదా 3rd party software పై ఆధారపడకుండా Lambda functions నుండి సులభంగా custom metrics ఉత్పత్తి చేయండి. ఇతర compute environments (EC2, On-prem, ECS, EKS మరియు ఇతర container environments) [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) ఇన్‌స్టాల్ చేయడం ద్వారా మద్దతు ఇవ్వబడతాయి.
    
* Metrics ను అధిక cardinality సందర్భంతో అనుసంధానం చేయడం

    * Embedded Metric Format ఉపయోగించి, మీరు custom metrics ను విజువలైజ్ చేయగలరు మరియు అలారమ్ చేయగలరు, అయితే [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) ఉపయోగించి query చేయగల అసలు, వివరమైన మరియు అధిక-cardinality సందర్భాన్ని కూడా నిలుపుకోగలరు. ఉదాహరణకు, లైబ్రరీ Lambda Function version, EC2 instance మరియు image ids వంటి environment metadata ను structured log event డేటాలో ఆటోమేటిక్‌గా inject చేస్తుంది.

[**aws-embedded-metrics-dotnet opensource repository**](https://github.com/awslabs/aws-embedded-metrics-dotnet) లో ప్రారంభించడానికి అవసరమైనవన్నీ ఉన్నాయి.

#### ఇన్‌స్టాలేషన్

మీ కోడ్‌లో Amazon.CloudWatch.EMF NuGet package ను చేర్చండి

```csharp
using Amazon.CloudWatch.EMF
```

IDisposable ను implement చేసే MetricsLogger ను instantiate చేసి క్రింద చూపిన విధంగా ఉపయోగించవచ్చు. Logger dispose అయినప్పుడు metrics configured sink కు flush అవుతాయి.

#### వాడకం

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("Canary");
    var dimensionSet = new DimensionSet();
    dimensionSet.AddDimension("Service", "aggregator");
    logger.SetDimensions(dimensionSet);
    logger.PutMetric("ProcessingLatency", 100, Unit.MILLISECONDS,StorageResolution.STANDARD);
    logger.PutMetric("Memory.HeapUsed", "1600424.0", Unit.BYTES, StorageResolution.HIGH);
    logger.PutProperty("RequestId", "422b1569-16f6-4a03-b8f0-fe3fd9b100f8");
    
}
```
#### ASP.NET Core

[**ASP.NET Core అప్లికేషన్‌ల**](https://github.com/awslabs/aws-embedded-metrics-dotnet) కోసం onboarding లో సహాయపడే మరియు default metrics అందించే helper package ను మేము అందిస్తున్నాము.

1. మీ Startup ఫైల్‌కు configuration ను జోడించండి.

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. ప్రతి అభ్యర్థనకు default metrics మరియు metadata జోడించడానికి middleware జోడించండి

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

AWS Lambda కాకుండా ఏ environment లోనైనా, EMF events సేకరించడానికి out-of-process agent ([**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) లేదా FireLens / Fluent-Bit) ను అమలు చేయమని మేము సిఫారసు చేస్తున్నాము. Out-of-process agent ఉపయోగించినప్పుడు, agent తో ఏవైనా తాత్కాలిక కమ్యూనికేషన్ సమస్యలను నిర్వహించడానికి ఈ package ప్రాసెస్‌లో asynchronously గా డేటాను buffer చేస్తుంది.
