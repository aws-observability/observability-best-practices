# Metrics

Metrics are essential in Observability because they provide quantitative data about system performance and behavior. This enables trend analysis and supports proactive monitoring to detect issues before they impact users.

To learn about Metrics in general and the features of Amazon CloudWatch for Metric collection and analysis visit [**Metrics in Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)

[**While many AWS services have the ability to publish infrastructure metrics out-of-the-box to Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html), this section will focus on capturing custom metrics from .NET applications and transporting them to Amazon CloudWatch metric monitoring systems for analysis.

### Use CloudWatch PutMetricData API call through AWS SDK for .NET

Include the Amazon.CloudWatch and Amazon.CloudWatch.Model NuGet packages in your code.

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

Build the PutMetricDataRequest object that contains the namespace, metric name and value, dimensions and dimension values.

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

Send the metric data to Amazon CloudWatch by using the PutMetricData API call.

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch embedded metric format

The [**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) lets you create custom metrics asynchronously by writing logs to CloudWatch Logs. This approach allows you to:

* Embed custom metrics alongside detailed log event data
* Have CloudWatch automatically extract these metrics for visualization and alarming
* Enable real-time incident detection
* Query the associated detailed log events using CloudWatch Logs Insights
* Gain deep insights into the root causes of operational events

#### Use cases for using EMF

* Generate custom metrics across compute environments

  * Easily generate custom metrics from Lambda functions without requiring custom batching code, making blocking network requests or relying on 3rd party software. Other compute environments (EC2, On-prem, ECS, EKS, and other container environments) are supported by installing the [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html).
    
* Linking metrics to high cardinality context

    * Using the Embedded Metric Format, you will be able to visualize and alarm on custom metrics, but also retain the original, detailed and high-cardinality context which is queryable using [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html). For example, the library automatically injects environment metadata such as Lambda Function version, EC2 instance and image ids into the structured log event data.

The [**aws-embedded-metrics-dotnet opensource repository**](https://github.com/awslabs/aws-embedded-metrics-dotnet) has everything you need to get started. 

#### Installation

Include the Amazon.CloudWatch.EMF NuGet package in your code

```csharp
using Amazon.CloudWatch.EMF
```

You can instantiate a MetricsLogger that implements IDisposable and use it as shown below. The metrics will be flushed to the configured sink when the logger is disposed.

#### Usage

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

We provide a helper package that helps with onboarding and provides default metrics for [**ASP.NET Core applications**](https://github.com/awslabs/aws-embedded-metrics-dotnet).

1. Add the configuration to your Startup file.

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. Add middleware to add default metrics and metadata to each request

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

In any environment, other than AWS Lambda, we recommend running an out-of-process agent (the [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) or FireLens / Fluent-Bit) to collect the EMF events. When using an out-of-process agent, this package will buffer the data asynchronously in process to handle any transient communication issues with the agent. 