# 设置 Application Signals 和 Transaction Search

## 高层设置流程

![Setup Overview](/apm-src/assets/images/deep-dive/overview.png)

## 前提条件和权限

在启用 CloudWatch Application Signals 之前，请确保您具有必要的 IAM 权限和基础设施。有关详细要求，请参阅 [Application Signals 权限](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html)。

## 支持的系统

Application Signals 在 Amazon EKS、原生 Kubernetes、Amazon ECS 和 Amazon EC2 上经过支持和测试。

| 语言 | 运行时版本 |
|---|---|
| **Java** | JVM 版本 8、11、17、21 和 23 |
| **Python** | Python 版本 3.9 及更高 |
| **.NET** | Release 1.6.0 及以下：.NET 6、8 和 .NET Framework 4.6.2 及更高。Release 1.7.0 及以上：.NET 8、9 和 .NET Framework 4.6.2 及更高 |
| **Node.js** | Node.js 版本 14、16、18、20 和 22 |
| **PHP** | PHP 版本 8.0 及更高 |
| **Ruby** | CRuby >= 3.1、JRuby >= 9.3.2.0 或 TruffleRuby >= 22.1 |
| **GoLang** | Golang 版本 1.18 及更高 |

有关完整的支持矩阵，请参阅 [Application Signals 支持的系统](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-supportmatrix.html)。

## 步骤 1：在您的账户中启用 Application Signals

请参阅[在您的账户中启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html) 文档。

## 步骤 2：启用 Transaction Search

请参阅[启用 Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) 文档。

## 步骤 3：选择您的检测策略

根据您的需求，选择以下检测方法之一。Application Signals 支持 SDK 和 collector 的多种组合：

### 可用的 SDK

- **[AWS Distro for OpenTelemetry (ADOT) SDK](https://aws-otel.github.io/docs/introduction)** — AWS 发行的 OpenTelemetry，支持 Application Signals。适用于 Java、Python、.NET 和 Node.js。
- **[上游 OpenTelemetry SDK](https://opentelemetry.io/docs/languages/)** — 标准的供应商中立 OpenTelemetry SDK。适用于任何 OTEL 支持的语言（Erlang、Rust、Ruby、Go、PHP 等）。
- **[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)** — 旧版 AWS 追踪 SDK。⚠️ [维护模式](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### 可用的 Collectors / Agents

- **[CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)** — 托管的 AWS agent，内置 Application Signals 支持、Container Insights 集成和日志收集。
- **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** — 标准上游或自定义构建的 collector。支持多目标遥测数据分发。
- **[X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)** — X-Ray SDK 的旧版 trace 转发器。⚠️ [维护模式](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline)

### 决策矩阵

| 方法 | 最适合 | 主要优势 |
|---|---|---|
| [**ADOT SDK + CloudWatch Agent**](../instrumentation-setups#adot-sdk--cloudwatch-agent) | AWS 原生环境，深度服务集成 | 紧密的 AWS 集成，Container Insights 关联，托管体验 |
| [**ADOT SDK + 自定义 OTEL Collector**](../instrumentation-setups#adot-sdk--custom-otel-collector) | 具有完整 Application Signals 支持的多目标遥测 | 客户端 RED metrics，App Signals 处理器，多目标灵活性 |
| [**上游 OTEL SDK + OTEL Collector**](../instrumentation-setups#upstream-opentelemetry-sdk--otel-collector) | 供应商中立策略，非 ADOT 语言，多云 | 完全供应商中立，任何 OTEL 支持的语言，无 AWS SDK 依赖 |
| [**直接 OTLP Endpoint（无 Collector 追踪）**](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints) | 资源高效的应用程序，最小化基础设施 | 最小开销，简化架构，减少基础设施 |
| [**X-Ray SDKs**](../instrumentation-setups#existing-x-ray-sdk--x-ray-daemon-end-of-support-timeline) | 旧版 X-Ray 用户，渐进式迁移 | 保护现有投资，最小变更要求。⚠️ 维护模式 |

### 功能对比

| 功能 | ADOT SDK + CW Agent | ADOT SDK + 自定义 OTEL Collector | 上游 OTEL SDK + OTEL Collector | 无 Collector 追踪（ADOT SDK） | X-Ray SDKs |
|---|---|---|---|---|---|
| **AWS 支持** | ✅ 是 | ⚠️ 仅限发送到 AWS 的数据 | ⚠️ 仅限发送到 AWS 的数据 | ✅ 是 | ✅ 是（⚠️ 维护模式） |
| **非标准语言支持** | ❌ 否 | ❌ 否 | ✅ 是 | ❌ 否 | ❌ 否 |
| **Container Insights 集成** | ✅ 是 | ❌ 否 | ❌ 否 | ❌ 否 | ❌ 否 |
| **开箱即用的 CloudWatch Logs 日志记录** | ✅ 是 | ❌ 否 | ❌ 否 | ✅ 是 | ❌ 否 |
| **开箱即用的运行时 metrics** | ✅ 是 | ✅ 是 | ✅ 是 | ❌ 否 | ❌ 否 |
| **始终获取 100% 流量的 RED metrics** | ✅ 是（客户端） | ✅ 是（客户端） | ⚠️ 仅 100% 采样时（服务端） | ⚠️ 仅 100% 采样时（服务端） | ⚠️ 仅 100% 采样时（服务端） |
| **多目标遥测** | ❌ 否 | ✅ 是 | ✅ 是 | ❌ 否 | ❌ 否 |

有关每种方法的详细实现，请参阅[检测设置](../instrumentation-setups)。

## 步骤 4：了解采样和 Trace 索引

Application Signals 将**请求采样**与 **trace 索引**分离：
- **请求采样**：确定采样并发送到 AWS 的请求百分比
- **选择性 Trace 索引**：存储在 CloudWatch Logs 中的 spans 发送到 X-Ray 后端作为 X-Ray trace summaries 的百分比。Trace summaries 有助于调试事务，对异步流程很有价值。您只需索引少量 spans 作为 trace summaries。

### 请求采样

#### 1. X-Ray 集中采样（默认且推荐）

当您使用 ADOT SDK 和 CloudWatch Agent（或 OpenTelemetry Collector）启用 Application Signals 时，**X-Ray 集中采样默认启用**，设置如下：

| 设置 | 默认值 | 描述 |
|---|---|---|
| **Reservoir** | 1 请求/秒 | 每秒采样的固定请求数 |
| **Fixed Rate** | 5% | 超出 reservoir 的额外请求百分比 |

AWS Distro for OpenTelemetry (ADOT) SDK agent 的环境变量设置如下：

| 环境变量 | 值 | 描述 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `xray` | 使用 X-Ray 采样服务 |
| **OTEL_TRACES_SAMPLER_ARG** | `endpoint=http://localhost:2000` | CloudWatch agent endpoint |

您可以随时通过 X-Ray 控制台修改这些默认值，无需重新部署应用程序。例如，要将采样率增加到 10%，请更新采样规则的固定比率。有关规则选项、示例和如何创建特定于服务的规则的完整列表，请参阅[配置采样规则](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html)。

:::info X-Ray 远程采样器何时适用？
`xray` 采样器通过本地代理调用 `http://localhost:2000/GetSamplingRules` 和 `http://localhost:2000/SamplingTargets`。这意味着 X-Ray 远程采样**仅在本地代理运行时有效**：

- **CloudWatch Agent** — 默认在端口 2000 上公开采样代理
- **OpenTelemetry Collector** — 配置了 [AWS Proxy 扩展](https://aws-otel.github.io/docs/getting-started/remote-sampling)

如果没有可用的本地代理（例如在[无 Collector 模式](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints)下），ADOT SDK 无法到达采样 endpoint，会静默回退到 **ParentBased(AlwaysOn) 100%**。
:::

#### 2. 按运行时配置 X-Ray 远程采样器

每个 ADOT SDK 语言运行时需要特定配置才能使用 X-Ray 远程采样规则。请参阅您语言的指南：

| 运行时 | 配置指南 |
|---|---|
| **Java** | [在 ADOT Java 中使用 X-Ray 远程采样](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Python** | [在 ADOT Python 中使用 X-Ray 远程采样](https://aws-otel.github.io/docs/getting-started/python-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Node.js** | [在 ADOT JavaScript 中使用 X-Ray 远程采样](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-metric-auto-instr#using-x-ray-remote-sampling) |
| **.NET** | [在 ADOT .NET 中使用 X-Ray 远程采样](https://aws-otel.github.io/docs/getting-started/dotnet-sdk/auto-instr#using-x-ray-remote-sampling) |
| **Go** | [使用 ADOT Go 配置采样](https://aws-otel.github.io/docs/getting-started/go-sdk/manual-instr#configuring-sampling) |

对于所有运行时，关键环境变量为：

```bash
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
```

调整 endpoint 以匹配您的 CloudWatch Agent 或 collector 代理地址（例如，在 EKS 上为 `http://cloudwatch-agent.amazon-cloudwatch:2000`）。

#### 3. 本地采样

如果您没有可用的本地代理，或者希望在不依赖 X-Ray 服务的情况下进行本地控制，您可以使用环境变量直接在 ADOT SDK 中配置采样：

| 环境变量 | 值 | 描述 |
|---|---|---|
| **OTEL_TRACES_SAMPLER** | `parentbased_traceidratio` | 本地基于比率的采样 |
| **OTEL_TRACES_SAMPLER_ARG** | `0.10` | 10% 采样率（根据需要调整） |

这在 X-Ray 远程采样不可用的[无 Collector 模式](../instrumentation-setups#collector-less-tracing-with-otlp-endpoints)中特别有用。如果没有设置这些变量，SDK 默认为 `parentbased_always_on`（100% 采样）。

有关更多采样器选项，请参阅 [OTEL_TRACES_SAMPLER](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/#otel_traces_sampler) 文档。

#### 4. X-Ray 自适应采样（成本优化方法）

:::tip 要求
- ADOT Java SDK（v2.11.5 或更高版本）
- 必须与 CloudWatch Agent 或 OpenTelemetry Collector 一起运行
- 兼容 Amazon EC2、ECS、EKS 和自托管 Kubernetes

有关详细设置说明，请参阅 [X-Ray 自适应采样](https://docs.aws.amazon.com/xray/latest/devguide/xray-adaptive-sampling.html)文档。
:::

如果您不需要 100% 采样但希望更好地覆盖异常情况，可以考虑 X-Ray 自适应采样，它会在错误峰值和延迟异常值期间自动增加采样，同时保持经济高效的基线速率：

主要优势：
- **自动异常检测**：在 HTTP 5xx 错误或高延迟期间增加采样
- **成本控制**：在正常操作期间维持低基线采样（例如 5%）
- **可配置的提升限制**：设置最大采样率和冷却期
- **关键 trace 捕获**：即使未采样完整 trace，也确保捕获异常 spans
- **集中控制**：通过 X-Ray 采样规则配置，无需更改应用程序代码

配置示例：
```json
{
  "RuleName": "AdaptiveProductionRule",
  "Priority": 1,
  "ReservoirSize": 1,
  "FixedRate": 0.05,
  "ServiceName": "*",
  "ServiceType": "*",
  "Host": "*",
  "HTTPMethod": "*",
  "URLPath": "*",
  "SamplingRateBoost": {
    "MaxRate": 0.25,
    "CooldownWindowMinutes": 10
  }
}
```

### Trace 索引

**1. 默认索引率：**
- 1% 索引免费包含
- 超过 1% 索引将产生 X-Ray 定价费用
- 请参阅 [CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)文档了解当前费率

**2. 自定义索引率：**
```bash
# 需要更多 X-Ray 分析的应用程序的更高索引（产生费用）
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.10  # 10% 索引 - 产生 X-Ray 费用

# 成本优化的较低索引（仍在免费层内）
aws cloudwatch put-transaction-search-configuration \
  --span-indexing-rate 0.005  # 0.5% 索引 - 无额外费用
```
