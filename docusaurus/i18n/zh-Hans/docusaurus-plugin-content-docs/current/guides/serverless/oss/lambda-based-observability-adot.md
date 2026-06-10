# 基于 AWS Lambda 的无服务器 Observability 与 OpenTelemetry

本指南涵盖了使用托管开源工具和技术配合 AWS 原生监控服务（如 AWS X-Ray 和 Amazon CloudWatch）为基于 Lambda 的无服务器应用程序配置 observability 的最佳实践。我们将介绍 [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)、[AWS X-Ray](https://aws.amazon.com/xray) 和 [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) 等工具，以及如何使用这些工具获取无服务器应用程序的可操作洞察、排查问题和优化应用程序性能。

## **涵盖的关键主题**

在 observability 最佳实践指南的这一部分中，我们将深入探讨以下主题：

* AWS Distro for OpenTelemetry (ADOT) 和 ADOT Lambda Layer 简介
* 使用 ADOT Lambda Layer 自动检测 Lambda 函数
* ADOT Collector 的自定义配置支持
* 与 Amazon Managed Service for Prometheus (AMP) 的集成
* 使用 ADOT Lambda Layer 的优缺点
* 使用 ADOT 时管理冷启动延迟


## **AWS Distro for OpenTelemetry (ADOT) 简介**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) 是由 AWS 支持的安全、可用于生产环境的 Cloud Native Computing Foundation (CNCF) [OpenTelemetry (OTel)](https://opentelemetry.io/) 项目发行版。使用 ADOT，您只需对应用程序进行一次检测，即可将关联的 metrics 和 traces 发送到多个监控解决方案。

AWS 托管的 [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) 利用 [OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) 来导出遥测数据。它通过包装 AWS Lambda 函数，并打包 OpenTelemetry 运行时特定的 SDK、精简版 ADOT collector 以及用于自动检测 AWS Lambda 函数的开箱即用配置，提供即插即用的用户体验。ADOT Lambda Layer collector 组件（如 Receivers、Exporters 和 Extensions）支持与 Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、AWS X-Ray 等的集成。完整列表请参见[此处](https://github.com/aws-observability/aws-otel-lambda)。ADOT 还支持与[合作伙伴解决方案](https://aws.amazon.com/otel/partners)的集成。

ADOT Lambda Layer 支持自动检测（适用于 Python、NodeJS 和 Java）以及针对任何特定库和 SDK 集的自定义检测。对于自动检测，默认情况下 Lambda Layer 配置为将 traces 导出到 AWS X-Ray。对于自定义检测，您需要从相应的 [OpenTelemetry 运行时检测仓库](https://github.com/open-telemetry) 中包含对应的库检测，并修改代码以在函数中初始化它。

## **使用 ADOT Lambda Layer 与 AWS Lambda 进行自动检测**

您可以轻松地使用 ADOT Lambda Layer 启用 Lambda 函数的自动检测，无需任何代码更改。让我们以将 ADOT Lambda Layer 添加到现有的基于 Java 的 Lambda 函数并在 CloudWatch 中查看执行日志和 traces 为例。

1. 根据[文档](https://aws-otel.github.io/docs/getting-started/lambda)，基于 `runtime`、`region` 和 `arch type` 选择 Lambda Layer 的 ARN。确保使用与 Lambda 函数相同区域的 Lambda Layer。例如，用于 Java 自动检测的 Lambda Layer 为 `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1`
2. 通过控制台或您选择的 IaC 将 Layer 添加到 Lambda 函数。
    * 使用 AWS 控制台时，按照[说明](https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html)将 Layer 添加到 Lambda 函数。在"指定 ARN"下粘贴上面选择的 Layer ARN。
    * 使用 IaC 选项时，Lambda 函数的 SAM 模板如下所示：
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```
3. 向 Lambda 函数添加环境变量，Node.js 或 Java 使用 `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler`，Python 使用 `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument`。
4. 为 Lambda 函数启用主动追踪。**`注意`** 默认情况下，Layer 配置为将 traces 导出到 AWS X-Ray。确保 Lambda 函数的执行角色具有所需的 AWS X-Ray 权限。有关 AWS Lambda 的 AWS X-Ray 权限的更多信息，请参阅 [AWS Lambda 文档](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html#services-xray-permissions)。
    * `Tracing: Active`
5. 包含 Lambda Layer 配置、环境变量和 X-Ray 追踪的示例 SAM 模板如下所示：
```
Resources:
  ListBucketsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: com.example.App::handleRequest
      ...
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 1
      Policies:
        - AWSXrayWriteOnlyAccess
        - AmazonS3ReadOnlyAccess
      Environment:
        Variables:
          AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler
      Tracing: Active
      Layers:
        - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-1:1
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /listBuckets
            Method: get
```
6. 在 AWS X-Ray 中测试和可视化 traces
直接或通过 API（如果配置了 API 触发器）调用 Lambda 函数。例如，通过 API（使用 `curl`）调用 Lambda 函数将生成如下日志：
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Lambda 函数日志：
<pre><code>
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
[otel.javaagent 2023-09-24 15:28:16:862 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws
EXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]
START RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3
...
END RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940
REPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms
<b>XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true</b>
</code></pre>

从日志中可以看到，OpenTelemetry Lambda 扩展开始使用 opentelemetry-javaagent 监听和检测 Lambda 函数，并在 AWS X-Ray 中生成 traces。

要查看上述 Lambda 函数调用的 traces，请导航到 AWS X-Ray 控制台，并在 Traces 下选择 trace id。您应该会看到如下所示的 Trace Map 和 Segments Timeline：
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)


## **ADOT Collector 的自定义配置支持**

ADOT Lambda Layer 结合了 OpenTelemetry SDK 和 ADOT Collector 组件。ADOT Collector 的配置遵循 OpenTelemetry 标准。默认情况下，ADOT Lambda Layer 使用 [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml) 将遥测数据导出到 AWS X-Ray。但是，ADOT Lambda Layer 也支持其他 exporters，使您能够将 metrics 和 traces 发送到其他目的地。自定义配置支持的可用组件完整列表请参见[此处](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components)。

## **与 Amazon Managed Service for Prometheus (AMP) 的集成**

您可以使用自定义 collector 配置将 Lambda 函数的 metrics 导出到 Amazon Managed Prometheus (AMP)。

1. 按照上面自动检测的步骤，配置 Lambda Layer，设置环境变量 `AWS_LAMBDA_EXEC_WRAPPER`。
2. 按照[说明](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)在您的 AWS 账户中创建 Amazon Managed Prometheus 工作空间，Lambda 函数将向其发送 metrics。记下 AMP 工作空间中的 `Endpoint - remote write URL`。您需要将其配置在 ADOT collector 配置中。
3. 在 Lambda 函数的根目录中创建一个自定义 ADOT collector 配置文件（例如 `collector.yaml`），其中包含上一步中 AMP endpoint remote write URL 的详细信息。您也可以从 S3 存储桶加载配置文件。
示例 ADOT collector 配置文件：
```
#collector.yaml in the root directory
#Set an environemnt variable 'OPENTELEMETRY_COLLECTOR_CONFIG_FILE' to '/var/task/collector.yaml'

extensions:
  sigv4auth:
    service: "aps"
    region: "<workspace_region>"

receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  logging:
  prometheusremotewrite:
    endpoint: "<workspace_remote_write_url>"
    namespace: test
    auth:
      authenticator: sigv4auth

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      exporters: [logging, prometheusremotewrite]
```
Prometheus Remote Write Exporter 还可以配置 retry 和 timeout 设置。更多信息请参阅[文档](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md)。**`注意`** `sigv4auth` 扩展的 Service 值应为 `aps`（Amazon Prometheus Service）。另外，确保 Lambda 函数执行角色具有所需的 AMP 权限。有关 AWS Lambda 所需的 AMP 权限和策略的更多信息，请参阅 Amazon Managed Service for Prometheus [文档](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-and-IAM.html#AMP-IAM-policies-built-in)。

4. 添加环境变量 `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` 并将值设置为配置文件的路径。例如 /var/task/`<path to config file>`.yaml。这将告诉 Lambda Layer 扩展在哪里找到 collector 配置。
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. 更新 Lambda 函数代码，使用 OpenTelemetry Metrics API 添加 metrics。请查看此处的示例。
```
// get meter
Meter meter = GlobalOpenTelemetry.getMeterProvider()
    .meterBuilder("aws-otel")
    .setInstrumentationVersion("1.0")
    .build();

// Build counter e.g. LongCounter
LongCounter counter = meter
    .counterBuilder("processed_jobs")
    .setDescription("Processed jobs")
    .setUnit("1")
    .build();

// It is recommended that the API user keep a reference to Attributes they will record against
Attributes attributes = Attributes.of(stringKey("Key"), "SomeWork");

// Record data
counter.add(123, attributes);
```

## **使用 ADOT Lambda Layer 的优缺点**

如果您打算从 Lambda 函数将 traces 发送到 AWS X-Ray，可以使用 [X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html) 或 [AWS Distro for OpenTelemetry (ADOT) Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)。虽然 X-Ray SDK 支持对各种 AWS 服务进行简单检测，但它只能将 traces 发送到 X-Ray。而 ADOT collector 作为 Lambda Layer 的一部分，支持大量针对各种语言的库检测。您可以使用它来收集和发送 metrics 及 traces 到 AWS X-Ray 和其他监控解决方案，如 Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus 和其他[合作伙伴](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics)解决方案。

然而，由于 ADOT 提供的灵活性，您的 Lambda 函数可能需要额外的内存，并且可能对冷启动延迟产生明显影响。因此，如果您正在优化 Lambda 函数的低延迟且不需要 OpenTelemetry 的高级功能，使用 AWS X-Ray SDK 而不是 ADOT 可能更合适。有关选择正确追踪工具的详细比较和指导，请参阅 AWS 文档中关于[在 ADOT 和 X-Ray SDK 之间选择](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)的内容。


## **使用 ADOT 时管理冷启动延迟**
ADOT Lambda Layer for Java 是基于代理的，这意味着当您启用自动检测时，Java Agent 将尝试检测所有 OTel [支持的](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation)库。这将显著增加 Lambda 函数的冷启动延迟。因此，我们建议您仅为应用程序使用的库/框架启用自动检测。

要仅启用特定的检测，您可以使用以下环境变量：

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`：设置为 false 时，禁用 Layer 中的自动检测，需要单独启用每个检测。
* `OTEL_INSTRUMENTATION_<NAME>_ENABLED`：设置为 true 以启用特定库或框架的自动检测。将"NAME"替换为您要启用的检测。有关可用检测的列表，请参阅"抑制特定代理检测"。

例如，要仅启用 Lambda 和 AWS SDK 的自动检测，您需要设置以下环境变量：
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```

## **其他资源**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)

## **总结**

在本使用开源技术的基于 AWS Lambda 的无服务器应用程序 observability 最佳实践指南中，我们介绍了 AWS Distro for OpenTelemetry (ADOT) 和 Lambda Layer，以及如何使用它来检测您的 AWS Lambda 函数。我们介绍了如何轻松启用自动检测，以及如何通过简单配置自定义 ADOT collector 以将 observability 信号发送到多个目的地。我们强调了使用 ADOT 的优缺点及其对 Lambda 函数冷启动延迟的影响，并推荐了管理冷启动时间的最佳实践。通过采用这些最佳实践，您只需对应用程序进行一次检测，即可以供应商无关的方式将 logs、metrics 和 traces 发送到多个监控解决方案。

如需进一步深入了解，我们强烈建议您练习 [AWS One Observability Workshop](https://catalog.workshops.aws/observability/en-US) 中的 AWS 托管开源 Observability 模块。
