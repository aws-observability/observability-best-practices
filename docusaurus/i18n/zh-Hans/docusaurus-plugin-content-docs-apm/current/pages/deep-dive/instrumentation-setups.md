# 不同的插桩与 Collector 配置方案

快速导航：

- [插桩方法](#instrumentation-approaches)
- [ADOT SDK + CloudWatch Agent](#adot-sdk--cloudwatch-agent)
- [ADOT SDK + 自定义 OTEL Collector](#adot-sdk--custom-otel-collector)
- [上游 OpenTelemetry SDK + OTEL Collector](#upstream-opentelemetry-sdk--otel-collector)
- [无 Collector 的 Tracing（OTLP Endpoints）](#collector-less-tracing-with-otlp-endpoints)
- [现有 X-Ray SDK + X-Ray Daemon（终止支持）](#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)
- [RED Metrics 计算总结](#red-metrics-calculation-summary)

---

## 插桩方法

### 自动插桩

**适用场景：** 快速入门、最少代码变更、生产环境部署

**适用人群：** DevOps 团队、平台工程师、优先考虑速度的组织

**优势：**
- 无需任何代码变更
- 快速实现价值
- 自动覆盖常见框架
- 需要时可轻松回滚

**局限性：**
- 对插桩内容的控制较少
- 可能采集超出需要的数据
- 自定义业务逻辑需要额外的手动插桩

### 手动 OpenTelemetry 插桩

**适用场景：** 自定义业务 metrics、供应商可移植性、精细粒度控制

**适用人群：** 应用开发人员、具有可观测性专业知识的团队

**优势：**
- 对遥测数据的完全控制
- 为业务逻辑自定义 spans 和属性
- 供应商中立（适用于其他 APM 工具）
- 精确控制性能影响

**权衡：**
- 需要代码变更
- 实现更复杂
- 代码演进时需要持续维护

---

## 插桩 + Collector 配置选项

## ADOT SDK + CloudWatch Agent

此方案提供最完善的 AWS 集成体验，具有深度服务集成和与 AWS 基础设施 metrics 的自动关联。

### 主要优势
- **调用量、可用性、延迟、故障和错误等 Metrics** 在客户端采样决策之前基于 100% 的请求计算
- **X-Ray Sampling 集成** 默认使用 X-Ray sampling 规则（如需可配置为 100%）
- **开箱即用的 CloudWatch Logs 集成** 实现无缝日志关联
- **完整的 AWS 支持** 覆盖整个可观测性技术栈
- **自动服务发现** 和黄金信号

### 架构

![ADOT SDK + CloudWatch Agent 架构](/apm-src/assets/images/deep-dive/adotcw.png)

### ADOT SDK + CloudWatch Agent 工作原理

**步骤 1：应用插桩**

部署 ADOT SDK 后，它会自动插桩您的应用程序，无需代码变更。ADOT SDK 在运行时动态注入代码到应用中，无需手动代码变更。注入的代码自动插桩对支持框架的调用，为每个操作创建 spans，并跨服务传播上下文以构建完整的 trace。

**步骤 2：采样决策**

对于每个请求，ADOT SDK 检查您的 X-Ray sampling 规则以决定是否发送完整的 trace 数据。您可以将其配置为 5%（节省成本）到 100%（完全可见性）之间的任意值。

**步骤 3：客户端 Metrics 计算**

关键优势在于：在采样之前，当 `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` 时，SDK 基于 100% 的请求计算 RED（Requests、Errors、Duration）metrics。这意味着即使采样率很低，您也能获得完整的黄金信号：
- **Rate**：每个时间窗口的请求计数
- **Errors**：具有错误状态码（4xx/5xx）的请求计数
- **Duration**：从请求开始/结束时间测量的延迟

**步骤 4：CloudWatch Agent 处理**

ADOT SDK 将采样的 spans 和预计算的 metrics 发送到 CloudWatch Agent，后者通过管道进行处理：

![ADOT SDK CloudWatch Agent 详细管道](/apm-src/assets/images/deep-dive/adosdkcwdetailed.jpg)

- **OTLP Receiver**：接收来自应用的 traces 和 metrics
- **Resource Detector**：添加 AWS 资源信息（实例 ID、容器详情）
- **APM Processor**：使用平台特定元数据丰富 spans
- **Exporters**：将数据路由到 X-Ray（spans）和 CloudWatch（metrics）

![APM Processor](/apm-src/assets/images/deep-dive/apmprocessor.png)


**步骤 5：数据分发**

您的数据分为三个路径：
- **Metrics** → `/aws/application-signals/data` 日志组，用于 Application Maps
- **Spans** → `aws/spans` 日志组，用于 Transaction Search
- **索引的 spans** → X-Ray 后端，用于传统 trace 分析

**步骤 6：分析选项**

这为您提供三种数据分析方式：
- **Application Signals**：带有动态分组的 Application Maps 和基于完整 metrics 的黄金信号
- **Transaction Search**：使用高级过滤器查询所有 span 数据
- **X-Ray Analytics**：对索引的 spans 进行传统 trace 分析

### 实施指南

请参考平台特定的设置指南：
- [在 Amazon EKS 上启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS.html)
- [在 Amazon ECS 上启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-ECS.html)
- [在 Amazon EC2 上启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html)
- [在自托管 Kubernetes 上启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-KubernetesMain.html)
- [Application Signals 演示仓库](https://github.com/aws-observability/application-signals-demo)

完成后，在 Application Signals 控制台验证服务发现和黄金信号。


## ADOT SDK + 自定义 OTEL Collector

此方案将 ADOT SDK 的客户端 RED metrics 计算与包含 AWS Application Signals Processor 的自定义 OpenTelemetry Collector 的灵活性相结合。您可以获得与 CloudWatch Agent 方案相同的准确的 100% 流量 metrics，同时具备将遥测数据扇出到多个目的地的能力。

### 主要优势
- **通过 ADOT SDK 对 100% 请求进行客户端 RED metrics 计算**（与 CW Agent 方案相同）— metrics 在采样之前计算
- **多目的地遥测** — 同时扇出到 AWS、Datadog、Prometheus 等
- **App Signals Processor** 规范化 `aws.local.*` / `aws.remote.*` 属性，解析平台上下文，并控制基数
- **完全控制 collector 管道** — 添加自定义 processors、filters 和 exporters

### 架构

![ADOT SDK + 自定义 OTEL Collector 架构](/apm-src/assets/images/deep-dive/adot-sdk-custom-collector.png)

### ADOT SDK + 自定义 OTEL Collector 工作原理

**步骤 1：应用插桩**

您的应用使用 ADOT SDK 进行插桩，以 OpenTelemetry 格式捕获运行时 metrics、logs 和 traces。ADOT SDK 注入 AWS 特定的 span 属性（`aws.local.service`、`aws.local.operation`、`aws.remote.service`、`aws.remote.operation` 等），这些是 App Signals Processor 所依赖的。

**步骤 2：客户端 RED Metrics 计算**

当 `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` 时，ADOT SDK 在任何采样决策**之前**对 100% 的请求计算 RED metrics：
- **Rate**：每个时间窗口的请求计数
- **Errors**：具有错误状态码（4xx/5xx）的请求计数
- **Duration**：从请求开始/结束时间测量的延迟

**步骤 3：采样决策**

ADOT SDK 应用您配置的采样策略（X-Ray sampling 规则或本地采样）。只有被采样的 traces 会发送到 collector，但 RED metrics 已经基于 100% 的流量计算完成。


**步骤 4：自定义 OpenTelemetry Collector 处理管道**

**OTLP Receivers（数据接入）**
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

**Resource Detection Processor**
```yaml
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
```

**Application Signals Processor**
```yaml
processors:
  awsapplicationsignals:
    resolvers:
      - platform: ecs
```

此 processor 处理 ADOT SDK 注入的 `aws.local.*` / `aws.remote.*` span 属性。它执行：
1. **属性解析**：使用平台特定的 resolvers 用平台上下文丰富遥测数据
2. **属性规范化**：将 ADOT SDK 属性重命名为 CloudWatch metric dimension 名称
3. **基数控制**：应用用户配置的 `keep`/`drop`/`replace` 规则
4. **Application Map 生成**：创建带有动态分组的拓扑数据

**步骤 5：导出处理**

Exporters 使用 SigV4 认证将数据路由到 AWS EMF（metrics）、OTLP HTTP（logs）和 OTLP HTTP（traces）endpoints。

**步骤 6：后端处理**
1. CloudWatch Logs：从 EMF logs 中提取 metrics，将 span 数据存储在 `aws/spans` 中
2. X-Ray 后端：索引可配置百分比的 spans 用于 trace 分析

**步骤 7：分析和可视化**
- **Application Signals**：使用客户端计算的 RED metrics — 无论采样率如何，都基于 100% 流量的准确数据
- **Transaction Search**：从 CloudWatch Logs 查询 span 数据
- **X-Ray Analytics**：对索引的 spans 进行传统 trace 分析


### 构建包含 awsapplicationsignalsprocessor 的自定义 OTEL Collector

**前提条件**：安装 Go（版本 1.21 或更高）。

**步骤 1：安装 OpenTelemetry Collector Builder (ocb)**

有关最新二进制文件，请参阅 [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases)。

```bash
# macOS (ARM64)
curl --proto '=https' --tlsv1.2 -fL -o ocb \
https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fbuilder%2Fv0.132.4/ocb_0.132.4_darwin_arm64
chmod +x ocb
```

**步骤 2：创建 Builder Manifest 文件**

创建 `builder-config.yaml`：
```yaml
dist:
  name: otelcol-appsignals
  description: OTel Collector for Application Signals
  output_path: ./otelcol-appsignals
exporters:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - gomod: go.opentelemetry.io/collector/exporter/otlphttpexporter v0.113.0
processors:
  - gomod: github.com/amazon-contributing/opentelemetry-collector-contrib/processor/awsapplicationsignalsprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/resourcedetectionprocessor v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricstransformprocessor v0.113.0
receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.113.0
extensions:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/awsproxy v0.113.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/sigv4authextension v0.113.0
replaces:
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/awsutil v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/internal/aws/cwlogs v0.113.0
  - github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0 => github.com/amazon-contributing/opentelemetry-collector-contrib/exporter/awsemfexporter v0.113.0
  - github.com/openshift/api v3.9.0+incompatible => github.com/openshift/api v0.0.0-20180801171038-322a19404e37
```


**步骤 3：示例 Collector 配置**

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  awsapplicationsignals:
    resolvers:
      - platform: eks
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, awsapplicationsignals]
      exporters: [otlphttp/traces]
```

**步骤 4：构建 Docker 镜像**

```bash
docker buildx build --load \
  -t otelcol-appsignals:latest \
  --platform=linux/amd64 .
```


## 上游 OpenTelemetry SDK + OTEL Collector

此方案使用标准的上游 OpenTelemetry SDK（非 ADOT）配合 OpenTelemetry Collector。它提供最大程度的供应商中立性，并支持任何具有 OpenTelemetry SDK 的语言，包括 ADOT 不支持的语言（Erlang、Rust、Ruby 等）。RED metrics 由 X-Ray 后端从采样的 trace 数据在服务端计算。

### 主要优势
- **完全供应商中立** — 客户端无 AWS 特定 SDK 依赖
- **任何 OTEL 支持的语言** — 适用于 Erlang、Rust、Ruby、PHP 和所有其他上游 OTEL SDK
- **多云和混合环境** — 相同的 SDK 可在 AWS、GCP、Azure 和本地环境中使用
- **标准上游 OTEL Collector** 配合标准 processors 和 exporters
- **保留现有 OpenTelemetry 投资** — 无需迁移到 ADOT
- **多目的地遥测** — 可同时扇出到任何后端

### 架构

![上游 OpenTelemetry SDK + OTEL Collector 架构](/apm-src/assets/images/deep-dive/upstream-otel-sdk-otel-collector.png)

### 上游 OTEL SDK + Collector 工作原理

**步骤 1：应用插桩**

您的应用使用标准的上游 OpenTelemetry SDK 进行插桩。它生成具有语义约定（`http.method`、`http.route`、`http.status_code` 等）的标准 OTEL spans。

**步骤 2：客户端采样**

OTEL SDK 应用您配置的采样策略。要获得准确的 RED metrics，您需要 `always_on` 采样（100%），因为 metrics 仅从采样的 traces 在服务端计算。使用部分采样时，您的 RED metrics 只能反映采样的子集。

**步骤 3：标准 OTEL Collector 处理管道**

Collector 使用标准的上游 processors：

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
```


**步骤 4：服务端 RED Metrics 计算**

由于上游 OTEL SDK 不在客户端计算 RED metrics，X-Ray 前端从接收到的采样 traces 在服务端计算：
1. **Rate**：从采样的 span 数据中提取的请求计数
2. **Errors**：从采样的 span 状态码中识别的错误计数
3. **Duration**：从采样的 span 开始/结束时间计算的延迟

:::warning
RED metrics 的准确性完全取决于您的采样率。使用 5% 采样时，您只能获得 5% 流量的 metrics。要使用此方案获得准确的 RED metrics，请配置 100% 采样。
:::

**步骤 5：分析和可视化**
- **Application Signals**：带有来自服务端计算的 RED metrics 的黄金信号的 Application Maps（准确性取决于采样率）
- **Transaction Search**：从 CloudWatch Logs（`aws/spans`）查询 span 数据
- **X-Ray Analytics**：对索引的 spans 进行传统 trace 分析

### 与 ADOT SDK 方案的关键差异

| 方面 | ADOT SDK + 自定义 Collector | 上游 OTEL SDK + Collector |
|---|---|---|
| **RED Metrics** | 客户端，100% 流量 | 服务端，仅采样流量 |
| **`aws.*` span 属性** | 由 ADOT SDK 注入 | 不存在 |
| **语言支持** | Java、Python、.NET、Node.js | 任何 OTEL 支持的语言 |
| **Collector 构建** | 包含 App Signals Processor 的自定义构建 | 标准上游 collector 构建 |
| **需要 100% 采样以获得准确 metrics** | 否 | 是 |

### 示例 Collector 配置

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  resourcedetection:
    detectors:
      - eks
      - env
      - ec2
  batch:
    send_batch_size: 8192
    timeout: 200ms
exporters:
  otlphttp/logs:
    compression: gzip
    logs_endpoint: https://logs.us-east-1.amazonaws.com/v1/logs
    auth:
      authenticator: sigv4auth/logs
  otlphttp/traces:
    compression: gzip
    traces_endpoint: https://xray.us-east-1.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth/traces
extensions:
  sigv4auth/logs:
    region: "us-east-1"
    service: "logs"
  sigv4auth/traces:
    region: "us-east-1"
    service: "xray"
service:
  extensions: [sigv4auth/logs, sigv4auth/traces]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlphttp/traces]
```


## 无 Collector 的 Tracing（OTLP Endpoints）

此方案通过将 logs 和 traces 直接发送到 CloudWatch OTLP endpoints，提供最简化的基础设施复杂度和最低的资源开销。

### 为什么选择无 Collector 的 Tracing

当您需要最简单的架构和最大化的资源利用时，无 Collector 的 tracing 是完美选择。通过直接向 AWS endpoints 发送数据，您无需额外的基础设施组件及其相关的管理开销。

### 架构

![无 Collector 架构](/apm-src/assets/images/deep-dive/collectorless.png)

### 无 Collector 的 Tracing 工作原理

**步骤 1：应用插桩**

您的应用使用 ADOT SDK 自动插桩。它以 OpenTelemetry 格式捕获 logs 和 traces，无需任何代码变更。

**步骤 2：本地 SDK 采样（默认 ParentBased/AlwaysOn 100%）**

X-Ray 远程采样器需要本地代理（CloudWatch Agent 或 [OpenTelemetry Collector](https://aws-otel.github.io/docs/getting-started/remote-sampling)）来获取采样规则。它调用 `http://localhost:2000/GetSamplingRules` 和 `http://localhost:2000/SamplingTargets` 来检索配置的规则。在无 Collector 模式下，没有本地代理运行，因此 ADOT SDK 无法访问这些 endpoints。结果是，SDK 静默回退到其默认采样策略：**ParentBased(AlwaysOn) 100%**。

:::tip 控制采样率以管理成本
由于 X-Ray 远程采样在无 Collector 模式下不可用，您可以使用环境变量配置本地采样策略来减少 trace 量和成本：

```bash
# Use a TraceIdRatioBased sampler at 5% (adjust ratio as needed)
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05

# Or use parentbased_traceidratio to respect incoming trace context
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

如果不设置这些变量，SDK 默认使用 `parentbased_always_on`（100% 采样），这会发送所有 traces，可能增加高吞吐应用的 CloudWatch 和 X-Ray 成本。
:::

**步骤 3：直接 AWS 通信**

数据不经过 collector，而是使用 SigV4 认证直接发送到 AWS 服务：
- **Logs** → `https://logs.<region>.amazonaws.com/v1/logs`（通过 OTLP HTTP）
- **Traces** → `https://xray.<region>.amazonaws.com/v1/traces`（通过 OTLP HTTP）

**步骤 4：服务端 RED Metrics 计算**

X-Ray 前端分析接收到的 traces，在 AWS 后端计算 RED metrics。由于 SDK 在无 Collector 模式下默认 100% 采样，服务端 RED metrics 基于所有流量计算。

**步骤 5：分析选项**
- **Application Signals**：带有动态分组的 Application Maps 和来自服务端计算的 RED metrics 的黄金信号
- **Transaction Search**：从 CloudWatch Logs（`aws/spans`）查询完整的 span 数据
- **X-Ray Analytics**：对索引的 spans 进行传统 trace 分析

### 重要注意事项
- **Transaction Search 是必需的** — 使用 OTLP endpoints 时必须启用
- **ADOT SDK 是必需的** — 常规 OpenTelemetry SDK 不适用于此方案
- **认证是自动的** — ADOT SDK 处理 AWS SigV4 认证
- **无 X-Ray 远程采样** — 没有本地代理时，SDK 无法获取 X-Ray sampling 规则，默认使用 100% 采样（ParentBased/AlwaysOn）
- **成本影响** — 由于所有 traces 都被发送（100% 采样），请监控高吞吐服务的 CloudWatch 和 X-Ray 成本


## 现有 X-Ray SDK + X-Ray Daemon（终止支持时间表）

:::danger X-Ray SDK 和 Daemon 终止支持通知
**AWS X-Ray SDK 和 Daemon GA 已于 2026 年 2 月 25 日结束，现进入维护模式。**

| SDK 和 Daemon 阶段 | 开始日期 | 结束日期 | 提供的支持 |
|---|---|---|---|
| **正式发布** | 不适用 | 2026 年 2 月 25 日 | X-Ray SDK 和 Daemon 得到完全支持。AWS 提供包含错误和安全修复的定期 SDK 和 daemon 发布。 |
| **维护模式** | 2026 年 2 月 25 日 | 不适用 | AWS 将仅针对安全问题发布 X-Ray SDK 和 Daemon 更新。SDK/Daemon 将不再获得新功能增强。 |

有关详情，请参阅 [X-Ray 终止支持时间表](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) 和 [X-Ray 到 OpenTelemetry 迁移指南](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html)。
:::

![X-Ray 架构](/apm-src/assets/images/deep-dive/X-ray.png)

此方案适用于拥有现有 X-Ray 投资、希望在规划向 OpenTelemetry 迁移的同时逐步采用 Application Signals 功能的组织。

### 如何开始

1. **启用 Transaction Search** 用于您现有的 X-Ray 数据
2. **配置 100% 采样** 或使用自适应采样实现经济高效的异常检测
3. **规划迁移** — 开始逐步将服务迁移到 ADOT 插桩

## RED Metrics 计算总结

了解不同插桩方案中 RED（Rate、Errors、Duration）metrics 的计算方式，对于选择正确的方案至关重要：

| 插桩方案 | 计算方式 | 环境变量 | 要求 |
|---|---|---|---|
| **ADOT SDK + CloudWatch Agent** | 客户端 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | 无 - 适用于任何采样 |
| **ADOT SDK + 自定义 OTEL Collector** | 客户端 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` | 包含 App Signals Processor 的自定义 collector |
| **上游 OTEL SDK + OTEL Collector** | 服务端 | 不适用（无 ADOT SDK） | Transaction Search + 100% 采样以确保准确性 |
| **无 Collector（ADOT SDK）** | 服务端 | `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false`（默认） | Transaction Search。默认 100% 采样（无本地代理时 X-Ray 远程采样不可用） |
| **X-Ray SDK + X-Ray Daemon** | 服务端（推断） | 不适用 | 基于采样数据 |

### 客户端 RED Metrics（ADOT SDK — CW Agent 和自定义 Collector 均适用）

```
Application → ADOT SDK → Calculate Metrics → CW Agent or Custom Collector → AWS
                ↓
            (100% of requests)
```

- **计算在应用中进行**，在任何采样决策之前
- **始终准确**，不受 trace 采样配置影响
- 当 `OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true` 时的**默认行为**
- metrics 计算**不依赖 Transaction Search**

### 服务端 RED Metrics（上游 OTEL SDK、无 Collector、X-Ray）

```
Application → Upstream OTEL SDK/Collector → AWS Backend → Calculate Metrics
                ↓
        (Requires 100% sampling for accuracy)
```

- **计算在 AWS 后端**（X-Ray 前端）从接收的 span 数据进行
- **基于 OTLP 的方案需要启用 Transaction Search**
- **需要 100% 采样**以获得准确的 metrics（X-Ray 除外，它会进行推断）
