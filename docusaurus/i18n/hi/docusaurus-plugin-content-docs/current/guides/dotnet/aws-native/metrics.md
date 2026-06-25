# मेट्रिक्स

मेट्रिक्स ऑब्ज़र्वेबिलिटी में आवश्यक हैं क्योंकि वे सिस्टम प्रदर्शन और व्यवहार के बारे में मात्रात्मक डेटा प्रदान करते हैं। यह ट्रेंड एनालिसिस को सक्षम बनाता है और उपयोगकर्ताओं को प्रभावित करने से पहले समस्याओं का पता लगाने के लिए सक्रिय निगरानी का समर्थन करता है।

मेट्रिक्स के बारे में सामान्य जानकारी और मेट्रिक संग्रह एवं एनालिसिस के लिए Amazon CloudWatch की सुविधाओं के बारे में जानने के लिए [**Amazon CloudWatch में मेट्रिक्स**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) पर जाएं।

[**जबकि कई AWS सेवाओं में Amazon CloudWatch पर इंफ्रास्ट्रक्चर मेट्रिक्स को आउट-ऑफ-द-बॉक्स प्रकाशित करने की क्षमता है**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html), यह अनुभाग .NET एप्लिकेशन्स से कस्टम मेट्रिक्स कैप्चर करने और उन्हें एनालिसिस के लिए Amazon CloudWatch मेट्रिक मॉनिटरिंग सिस्टम में भेजने पर केंद्रित होगा।

### AWS SDK for .NET के माध्यम से CloudWatch PutMetricData API कॉल का उपयोग करें

अपने कोड में Amazon.CloudWatch और Amazon.CloudWatch.Model NuGet पैकेज शामिल करें।

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

PutMetricDataRequest ऑब्जेक्ट बनाएं जिसमें namespace, मेट्रिक नाम और मान, dimensions और dimension values शामिल हों।

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

PutMetricData API कॉल का उपयोग करके मेट्रिक डेटा Amazon CloudWatch को भेजें।

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch embedded metric format

[**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) आपको CloudWatch Logs में लॉग लिखकर असिंक्रोनस रूप से कस्टम मेट्रिक्स बनाने की अनुमति देता है। यह दृष्टिकोण आपको निम्नलिखित करने की अनुमति देता है:

* विस्तृत लॉग इवेंट डेटा के साथ कस्टम मेट्रिक्स एम्बेड करें
* CloudWatch इन मेट्रिक्स को विज़ुअलाइज़ेशन और अलार्मिंग के लिए स्वचालित रूप से निकालता है
* रियल-टाइम इंसिडेंट डिटेक्शन सक्षम करें
* CloudWatch Logs Insights का उपयोग करके संबंधित विस्तृत लॉग इवेंट की क्वेरी करें
* परिचालन घटनाओं के मूल कारणों में गहन अंतर्दृष्टि प्राप्त करें

#### EMF के उपयोग के मामले

* विभिन्न कंप्यूट एनवायरनमेंट्स में कस्टम मेट्रिक्स जनरेट करें

  * कस्टम बैचिंग कोड, ब्लॉकिंग नेटवर्क अनुरोध या तृतीय पक्ष सॉफ़्टवेयर पर निर्भर हुए बिना Lambda फ़ंक्शंस से आसानी से कस्टम मेट्रिक्स जनरेट करें। अन्य कंप्यूट एनवायरनमेंट (EC2, ऑन-प्रेमिस, ECS, EKS, और अन्य कंटेनर एनवायरनमेंट) [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) इंस्टॉल करके समर्थित हैं।
    
* मेट्रिक्स को उच्च कार्डिनैलिटी संदर्भ से जोड़ना

    * Embedded Metric Format का उपयोग करके, आप कस्टम मेट्रिक्स को विज़ुअलाइज़ और अलार्म कर सकेंगे, लेकिन मूल, विस्तृत और उच्च-कार्डिनैलिटी संदर्भ को भी बनाए रख सकेंगे जो [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) का उपयोग करके क्वेरी करने योग्य है। उदाहरण के लिए, लाइब्रेरी स्वचालित रूप से Lambda Function version, EC2 instance और image ids जैसे एनवायरनमेंट मेटाडेटा को संरचित लॉग इवेंट डेटा में इंजेक्ट करती है।

[**aws-embedded-metrics-dotnet ओपन सोर्स रिपॉज़िटरी**](https://github.com/awslabs/aws-embedded-metrics-dotnet) में शुरू करने के लिए आवश्यक सब कुछ है।

#### इंस्टॉलेशन

अपने कोड में Amazon.CloudWatch.EMF NuGet पैकेज शामिल करें

```csharp
using Amazon.CloudWatch.EMF
```

आप IDisposable को लागू करने वाले MetricsLogger को इंस्टेंशिएट कर सकते हैं और नीचे दिखाए अनुसार उपयोग कर सकते हैं। जब logger को dispose किया जाएगा तो मेट्रिक्स कॉन्फ़िगर किए गए sink पर flush हो जाएंगे।

#### उपयोग

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

हम एक सहायक पैकेज प्रदान करते हैं जो ऑनबोर्डिंग में मदद करता है और [**ASP.NET Core एप्लिकेशन्स**](https://github.com/awslabs/aws-embedded-metrics-dotnet) के लिए डिफ़ॉल्ट मेट्रिक्स प्रदान करता है।

1. अपनी Startup फ़ाइल में कॉन्फ़िगरेशन जोड़ें।

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. प्रत्येक अनुरोध में डिफ़ॉल्ट मेट्रिक्स और मेटाडेटा जोड़ने के लिए middleware जोड़ें

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

AWS Lambda के अलावा किसी भी एनवायरनमेंट में, हम EMF इवेंट एकत्र करने के लिए एक आउट-ऑफ-प्रोसेस एजेंट ([**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) या FireLens / Fluent-Bit) चलाने की सिफारिश करते हैं। आउट-ऑफ-प्रोसेस एजेंट का उपयोग करते समय, यह पैकेज एजेंट के साथ किसी भी अस्थायी संचार समस्याओं को संभालने के लिए प्रोसेस में डेटा को असिंक्रोनस रूप से बफ़र करेगा।