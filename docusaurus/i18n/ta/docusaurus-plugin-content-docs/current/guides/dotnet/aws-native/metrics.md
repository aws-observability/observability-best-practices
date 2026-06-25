# மெட்ரிக்குகள்

மெட்ரிக்குகள் Observability இல் அவசியமானவை, ஏனெனில் அவை அமைப்பு செயல்திறன் மற்றும் நடத்தை பற்றிய அளவு தரவை வழங்குகின்றன. இது போக்கு பகுப்பாய்வை செயல்படுத்துகிறது மற்றும் சிக்கல்கள் பயனர்களை பாதிக்கும் முன் கண்டறிய செயல்படு கண்காணிப்பை ஆதரிக்கிறது.

பொதுவாக மெட்ரிக்குகள் பற்றியும் மெட்ரிக் சேகரிப்பு மற்றும் பகுப்பாய்விற்கான Amazon CloudWatch இன் அம்சங்கள் பற்றியும் அறிய [**Amazon CloudWatch இல் மெட்ரிக்குகள்**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) ஐப் பார்வையிடுங்கள்.

[**பல AWS சேவைகள் Amazon CloudWatch க்கு உள்கட்டமைப்பு மெட்ரிக்குகளை out-of-the-box வெளியிடும் திறனைக் கொண்டிருக்கும்**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html) அதே நேரத்தில், இந்த பிரிவு .NET பயன்பாடுகளிலிருந்து தனிப்பயன் மெட்ரிக்குகளைப் பிடித்து பகுப்பாய்விற்காக Amazon CloudWatch மெட்ரிக் கண்காணிப்பு அமைப்புகளுக்கு அவற்றை அனுப்புவதில் கவனம் செலுத்தும்.

### AWS SDK for .NET வழியாக CloudWatch PutMetricData API அழைப்பைப் பயன்படுத்துதல்

உங்கள் குறியீட்டில் Amazon.CloudWatch மற்றும் Amazon.CloudWatch.Model NuGet தொகுப்புகளை உள்ளடக்கவும்.

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

namespace, metric name மற்றும் value, dimensions மற்றும் dimension values ஐ உள்ளடக்கிய PutMetricDataRequest object ஐ உருவாக்கவும்.

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

PutMetricData API அழைப்பைப் பயன்படுத்தி மெட்ரிக் தரவை Amazon CloudWatch க்கு அனுப்புங்கள்.

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch embedded metric format

[**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) CloudWatch Logs க்கு லாக்குகளை எழுதுவதன் மூலம் ஒத்திசைவற்ற முறையில் தனிப்பயன் மெட்ரிக்குகளை உருவாக்க உங்களை அனுமதிக்கிறது. இந்த அணுகுமுறை உங்களை:

* விரிவான லாக் நிகழ்வு தரவுடன் தனிப்பயன் மெட்ரிக்குகளை உட்பொதிக்க
* காட்சிப்படுத்தல் மற்றும் அலாரத்திற்காக CloudWatch தானாகவே இந்த மெட்ரிக்குகளை பிரித்தெடுக்க
* நிகழ்நேர சம்பவ கண்டறிதலை செயல்படுத்த
* CloudWatch Logs Insights ஐப் பயன்படுத்தி தொடர்புடைய விரிவான லாக் நிகழ்வுகளை வினவ
* செயல்பாட்டு நிகழ்வுகளின் மூல காரணங்கள் பற்றிய ஆழமான நுண்ணறிவுகளைப் பெற

அனுமதிக்கிறது.

#### EMF ஐப் பயன்படுத்துவதற்கான பயன்பாட்டு வழக்குகள்

* கணக்கீட்டு சூழல்கள் முழுவதும் தனிப்பயன் மெட்ரிக்குகளை உருவாக்குதல்

  * தனிப்பயன் batching குறியீடு, blocking network requests அல்லது 3rd party software தேவையின்றி Lambda functions இலிருந்து தனிப்பயன் மெட்ரிக்குகளை எளிதாக உருவாக்கலாம். மற்ற கணக்கீட்டு சூழல்கள் (EC2, On-prem, ECS, EKS மற்றும் பிற container சூழல்கள்) [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) ஐ நிறுவுவதன் மூலம் ஆதரிக்கப்படுகின்றன.
    
* மெட்ரிக்குகளை உயர் cardinality சூழலுடன் இணைத்தல்

    * Embedded Metric Format ஐப் பயன்படுத்தி, தனிப்பயன் மெட்ரிக்குகளை காட்சிப்படுத்தவும் அலாரம் செய்யவும் முடியும், ஆனால் [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) ஐப் பயன்படுத்தி வினவக்கூடிய அசல், விரிவான மற்றும் உயர்-cardinality சூழலையும் தக்கவைக்க முடியும். எடுத்துக்காட்டாக, நூலகம் Lambda Function version, EC2 instance மற்றும் image ids போன்ற சூழல் மெட்டாடேட்டாவை கட்டமைக்கப்பட்ட லாக் நிகழ்வு தரவில் தானாகவே செலுத்துகிறது.

[**aws-embedded-metrics-dotnet ஓப்பன் சோர்ஸ் களஞ்சியம்**](https://github.com/awslabs/aws-embedded-metrics-dotnet) தொடங்குவதற்கு தேவையான அனைத்தையும் கொண்டுள்ளது.

#### நிறுவல்

உங்கள் குறியீட்டில் Amazon.CloudWatch.EMF NuGet தொகுப்பை உள்ளடக்கவும்

```csharp
using Amazon.CloudWatch.EMF
```

IDisposable ஐ செயல்படுத்தும் MetricsLogger ஐ இன்ஸ்டன்ஷியேட் செய்து கீழே காட்டப்பட்டுள்ளபடி பயன்படுத்தலாம். logger dispose செய்யப்படும் போது மெட்ரிக்குகள் கட்டமைக்கப்பட்ட sink க்கு flush செய்யப்படும்.

#### பயன்பாடு

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

[**ASP.NET Core பயன்பாடுகளுக்கு**](https://github.com/awslabs/aws-embedded-metrics-dotnet) onboarding மற்றும் இயல்புநிலை மெட்ரிக்குகளை வழங்கும் உதவி தொகுப்பை நாங்கள் வழங்குகிறோம்.

1. உங்கள் Startup கோப்பில் கட்டமைப்பைச் சேர்க்கவும்.

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. ஒவ்வொரு கோரிக்கைக்கும் இயல்புநிலை மெட்ரிக்குகள் மற்றும் மெட்டாடேட்டாவைச் சேர்க்க middleware ஐச் சேர்க்கவும்

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

AWS Lambda தவிர வேறு எந்த சூழலிலும், EMF நிகழ்வுகளை சேகரிக்க out-of-process agent ஐ ([**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) அல்லது FireLens / Fluent-Bit) இயக்க பரிந்துரைக்கிறோம். Out-of-process agent ஐப் பயன்படுத்தும் போது, agent உடனான எந்த தற்காலிக தொடர்பு சிக்கல்களையும் கையாள இந்த தொகுப்பு process இல் ஒத்திசைவற்ற முறையில் தரவை buffer செய்யும்.
