# Kotlin 服务的 Application Signals

## 简介

由于不同组件之间的复杂交互，监控 Kotlin Web 应用的性能和健康状况可能具有挑战性。[Kotlin](https://kotlinlang.org/) Web 服务通常构建为 Java Archive (jar) 文件，可以部署在任何运行 Java 的平台上。这些应用通常在分布式环境中运行，涉及多个互连组件，如数据库、外部 API 和缓存层。这种复杂性可能会显著增加您的平均恢复时间（MTTR）。

在本指南中，我们将演示如何对运行在 Linux EC2 服务器上的 Kotlin Web 服务进行自动插桩。启用 [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) 后，可以使用 [AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) Java 自动插桩代理从您的应用中收集 metrics 和 traces，无需进行任何代码变更。您可以利用调用量、可用性、延迟、故障和错误等关键 metrics，快速查看和分类应用服务的当前运行状况，并验证它们是否满足长期性能和业务目标。

## 前提条件

- 一个具有适当 [IAM 权限](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) 的 Linux EC2 实例，以与 CloudWatch Application Signals 交互。本指南使用 [Amazon Linux](https://aws.amazon.com/linux/amazon-linux-2023/) 实例，如果您使用的是其他系统，命令可能略有不同。
- 能够通过 [SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html) 连接到实例。

## 解决方案概述

概括来说，我们将执行以下步骤：

- 启用 CloudWatch Application Signals。
- 以 fat jar 形式部署 [ktor Web 服务](https://ktor.io/)。
- 安装配置为从 Web 服务接收 Application Signals 的 CloudWatch agent。
- 下载 [ADOT](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#introduction) 自动插桩代理。
- 将 kotlin 服务 jar 与 java agent 一起运行以自动插桩服务。
- 运行一些测试以生成遥测数据。

### 架构图

![架构](./images/kotlin-arch.png)

### 启用 CloudWatch Application Signals

按照步骤 1 的说明操作：在您的账户中[启用 Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html#CloudWatch-Application-Signals-EC2-Grant)。

### 部署 Ktor Web 服务
[Ktor](https://ktor.io/) 是一个流行的 Kotlin 框架，用于创建 Web 服务。它允许您快速开始使用异步服务端应用。

创建工作目录
```
mkdir kotlin-signals && cd kotlin-signals
```

克隆 Ktor 示例仓库
```
git clone https://github.com/ktorio/ktor-samples.git && cd ktor-samples/structured-logging
```

构建应用
```
./gradlew build && cd build/libs
```

测试应用是否正常运行
```
java -jar structured-logging-all.jar
```

假设服务构建并运行正常，我们现在可以使用 `ctrl + c` 停止它

### 配置 CloudWatch Agent
Amazon Linux 实例默认安装了 CloudWatch agent。如果您的实例没有，则需要[安装](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)它。

安装完成后，我们现在可以创建配置文件。
```
sudo nano /opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

将以下配置复制粘贴到文件中
```
{
    "traces": {
        "traces_collected": {
            "app_signals": {}
        }
    },
    "logs": {
        "metrics_collected": {
            "app_signals": {}
        }
    }
}
```

保存文件，然后使用我们刚创建的配置启动 CloudWatch agent
```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

### 下载 ADOT 自动插桩代理

导航到包含 jar 文件的目录，为了演示方便我们将代理放在这里。在实际场景中，它可能位于单独的文件夹中。

```
cd kotlin-signals/ktor-samples/structured-logging/build/libs
```

下载自动插桩代理
```
wget https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar
```

### 使用 ADOT agent 运行 Ktor 服务
```
OTEL_RESOURCE_ATTRIBUTES=service.name=KotlinApp,service.namespace=MyKotlinService,aws.hostedin.environment=EC2 \
OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true \
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT=http://localhost:4316/v1/metrics \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4316/v1/traces \
OTEL_METRICS_EXPORTER=none \
OTEL_LOGS_EXPORT=none \
java -javaagent:aws-opentelemetry-agent.jar -jar structured-logging-all.jar
```

### 生成流量以创建遥测数据
```
for i in {1..1800}; do curl http://localhost:8080 && sleep 2; done
```

## 查看遥测数据

您现在应该能够在 CloudWatch 的"Services"部分看到 Kotlin 服务

![kotlin-service](./images/kotlin-services.png)

您也可以在"Service Map"中看到我们的服务

![kotlin-service-map](./images/kotlin-service-map.png)

插桩提供了有价值的 metrics，如延迟：

![kotlin-metrics](./images/kotlin-metrics.png)

### 后续步骤

接下来，您可以进一步探索 [Application Signals 体验](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)，包括为您的服务创建 [SLO](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html)。另一个好的后续步骤是在 Ktor 中创建更多 Kotlin 微服务，以便开始构建更复杂的后端。分布式、复杂的环境是您从 Application Signals 这类工具中获得最大收益的地方。

### 清理

终止您的 EC2 实例并删除 `/aws/appsignals/generic` 日志组。
