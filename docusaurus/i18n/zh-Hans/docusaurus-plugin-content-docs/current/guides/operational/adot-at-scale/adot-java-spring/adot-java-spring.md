# Java Spring Integration 应用程序的 Instrument

本文描述了一种使用 [Open Telemetry](https://opentelemetry.io/) 和 [X-ray](https://aws.amazon.com/xray/) 手动对 [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) 应用程序进行 instrument 的方法。

Spring-Integration 框架旨在支持开发适用于事件驱动架构和消息中心架构的集成解决方案。另一方面，OpenTelemetry 更侧重于微服务架构，在该架构中服务之间通过 HTTP 请求进行通信和协调。因此，本指南将提供一个使用 OpenTelemetry API 进行手动 instrument 来对 Spring-Integration 应用程序进行 instrument 的示例。

## 背景信息

### 什么是 tracing？

以下引用自 [OpenTelemetry 文档](https://opentelemetry.io/docs/concepts/signals/traces/)，很好地概述了 trace 的用途：

:::note
    Traces 为我们提供了当请求发送到应用程序时发生了什么的全貌。无论您的应用程序是具有单个数据库的单体应用还是复杂的服务网格，traces 对于理解请求在应用程序中经过的完整"路径"至关重要。
:::
鉴于 tracing 的主要好处之一是请求的端到端可见性，因此 traces 从请求源到后端正确链接非常重要。在 OpenTelemetry 中，一种常见的方法是使用[嵌套 span](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans)。这在微服务架构中有效，其中 span 从一个服务传递到另一个服务直到到达最终目的地。在 Spring Integration 应用程序中，我们需要在远程和本地创建的 span 之间创建父/子关系。

## 使用上下文传播的 Tracing

我们将演示一种使用上下文传播的方法。虽然这种方法传统上用于在本地和远程位置创建的 span 之间创建父/子关系，但它将用于 Spring Integration 应用程序的情况，因为它简化了代码并允许应用程序扩展：可以在多个线程中并行处理消息，也可以在需要在不同主机上处理消息时进行水平扩展。

以下是实现此目标所需的概述：

- 创建一个 ```ChannelInterceptor``` 并将其注册为 ```GlobalChannelInterceptor```，以便它可以捕获跨所有通道发送的消息。

- 在 ```ChannelInterceptor``` 中：
  - 在 ```preSend``` 方法中：
    - 尝试从上游生成的前一条消息中读取上下文。这是我们能够连接上游消息 span 的地方。如果不存在上下文，则启动新的 trace（这由 OpenTelemetry SDK 完成）。
    - 创建一个具有唯一名称的 Span 来标识该操作。这可以是处理此消息的通道名称。
    - 将当前上下文保存在消息中。
    - 将上下文和 scope 存储在 thread.local 中，以便之后可以关闭它们。
    - 将上下文注入到下游发送的消息中。
  - 在 ```afterSendCompletion``` 中：
    - 从 thread.local 恢复上下文和 scope。
    - 从上下文重新创建 span。
    - 注册处理消息时引发的任何异常。
    - 关闭 Scope。
    - 结束 Span。

这是需要做的事情的简化描述。我们提供了一个使用 Spring-Integration 框架的功能示例应用程序。该应用程序的代码可以在[这里](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp)找到。

要仅查看为 instrument 应用程序而进行的更改，请查看此 [diff](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437)。

### 运行此示例应用程序：

``` bash
# build and run
mvn spring-boot:run
# create sample input file to trigger flow
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

要体验此示例应用程序，您需要在与应用程序相同的机器上运行 [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector)，并使用类似以下的配置：

``` yaml
receivers:
  otlp:
    protocols:
      grpc: 
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s
exporters:
  aws xray: region:us-west-2
  aws emf:
    region: us-west-2
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      processors: [batch/metrics]
      exporters: [awsemf]
```

## 结果

如果我们运行示例应用程序然后执行以下命令，这是我们得到的结果：

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![X-ray Results](x-ray-results.png)

我们可以看到上面的 segment 与示例应用程序中描述的工作流相匹配。在处理某些消息时预期会出现异常，因此我们可以看到它们被正确注册，这将使我们能够在 X-Ray 中进行故障排查。


## 常见问题

### 如何创建嵌套 span？

OpenTelemetry 中有三种机制可用于连接 span：

##### 显式方式

您需要将父 span 传递到创建子 span 的位置，并使用以下方式将它们链接起来：

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```

##### 隐式方式

Span 上下文将在底层存储在 thread.local 中。
当您确定在同一线程中创建 span 时，推荐使用此方法。

``` java
    void parentTwo() {
        Span parentSpan = tracer.spanBuilder("parent").startSpan(); 
        try(Scope scope = parentSpan.makeCurrent()) {
            childTwo(); 
        } finally {
        parentSpan.end(); 
        }
    }
    void childTwo() {
        Span childSpan = tracer.spanBuilder("child")
            // NOTE: setParent(...) is not required;
            // `Span.current()` is automatically added as the parent 
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // do stuff
        } finally {
            childSpan.end();
        } 
    }
```

##### 上下文传播

此方法将上下文存储在某处（HTTP headers 或消息中），以便可以传输到创建子 span 的远程位置。严格来说并不要求是远程位置。这也可以在同一进程中使用。

### OpenTelemetry 属性如何转换为 X-Ray 属性？

请参阅以下[指南](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation)查看对应关系。



  
