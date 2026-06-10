# Metrics

Metrics 在 Observability 中至关重要，因为它们提供有关系统性能和行为的量化数据。这使得趋势分析成为可能，并支持主动监控以在问题影响用户之前发现问题。

要了解 Metrics 的一般概念以及 Amazon CloudWatch 在 Metric 收集和分析方面的功能，请访问 [**Amazon CloudWatch 中的 Metrics**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)

[**虽然许多 AWS 服务能够开箱即用地将基础设施 metrics 发布到 Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html)，但本节将重点介绍从 .NET 应用程序捕获自定义 metrics 并将其传输到 Amazon CloudWatch metric 监控系统进行分析。

### 通过 AWS SDK for .NET 使用 CloudWatch PutMetricData API 调用

在代码中包含 Amazon.CloudWatch 和 Amazon.CloudWatch.Model NuGet 包。

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

构建包含命名空间、metric 名称和值、维度和维度值的 PutMetricDataRequest 对象。

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

使用 PutMetricData API 调用将 metric 数据发送到 Amazon CloudWatch。

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch 嵌入式 metric 格式

[**CloudWatch 嵌入式 metric 格式 (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) 允许您通过将 logs 写入 CloudWatch Logs 来异步创建自定义 metrics。这种方法允许您：

* 将自定义 metrics 与详细的日志事件数据一起嵌入
* 让 CloudWatch 自动提取这些 metrics 用于可视化和告警
* 实现实时事件检测
* 使用 CloudWatch Logs Insights 查询相关的详细日志事件
* 深入了解运营事件的根本原因

#### EMF 的使用场景

* 跨计算环境生成自定义 metrics

  * 轻松从 Lambda 函数生成自定义 metrics，无需自定义批处理代码、阻塞网络请求或依赖第三方软件。其他计算环境（EC2、本地、ECS、EKS 和其他容器环境）通过安装 [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) 获得支持。
    
* 将 metrics 链接到高基数上下文

    * 使用嵌入式 Metric 格式，您将能够可视化和告警自定义 metrics，同时保留原始的、详细的高基数上下文，可使用 [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 进行查询。例如，该库自动将环境元数据（如 Lambda 函数版本、EC2 实例和镜像 ID）注入到结构化日志事件数据中。

[**aws-embedded-metrics-dotnet 开源仓库**](https://github.com/awslabs/aws-embedded-metrics-dotnet)包含您入门所需的一切。

#### 安装

在代码中包含 Amazon.CloudWatch.EMF NuGet 包

```csharp
using Amazon.CloudWatch.EMF
```

您可以实例化一个实现 IDisposable 的 MetricsLogger 并按如下所示使用它。当 logger 被释放时，metrics 将被刷新到配置的接收器。

#### 用法

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

我们提供了一个辅助包，帮助接入并为 [**ASP.NET Core 应用程序**](https://github.com/awslabs/aws-embedded-metrics-dotnet)提供默认 metrics。

1. 将配置添加到您的 Startup 文件。

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. 添加中间件以为每个请求添加默认 metrics 和元数据

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

在 AWS Lambda 之外的任何环境中，我们建议运行进程外 agent（[**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) 或 FireLens / Fluent-Bit）来收集 EMF 事件。使用进程外 agent 时，此包将在进程内异步缓冲数据，以处理与 agent 之间的任何暂时性通信问题。
