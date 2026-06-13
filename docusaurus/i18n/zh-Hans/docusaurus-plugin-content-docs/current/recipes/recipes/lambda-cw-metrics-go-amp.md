# 通过 Firehose 和 AWS Lambda 将 CloudWatch Metric Streams 导出到 Amazon Managed Service for Prometheus

在本方案中，我们将展示如何配置 [CloudWatch Metric Stream](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList)，并使用 [Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) 和 [AWS Lambda](https://aws.amazon.com/lambda) 将 metrics 导入 [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/)。

我们将使用 [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) 创建一个包含 Firehose Delivery Stream、Lambda 和 S3 Bucket 的堆栈来演示完整的场景。

:::note
    本指南大约需要 30 分钟完成。
:::
## 基础设施
在以下章节中，我们将搭建本方案所需的基础设施。

CloudWatch Metric Streams 允许将流式 metric 数据转发到
HTTP endpoint 或 [S3 bucket](https://aws.amazon.com/s3)。

### 前提条件

* 在您的环境中已[安装](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)了 AWS CLI。
* 在您的环境中已安装 [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html)。
* Node.js 和 Go。
* 已将[仓库](https://github.com/aws-observability/aws-observability/)克隆到本地机器。此项目的代码位于 `/sandbox/CWMetricStreamExporter` 下。

### 创建 AMP 工作区

本方案中的演示应用程序将运行在 AMP 之上。
通过以下命令创建 AMP 工作区：

```
aws amp create-workspace --alias prometheus-demo-recipe
```

使用以下命令确认工作区已创建：
```
aws amp list-workspaces
```

:::info
    更多详情请查看 [AMP 入门指南](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)。
:::
### 安装依赖

从 aws-o11y-recipes 仓库的根目录，通过以下命令切换到 CWMetricStreamExporter 目录：

```
cd sandbox/CWMetricStreamExporter
```

此后将以此目录作为仓库的根目录。

通过以下命令切换到 `/cdk` 目录：

```
cd cdk
```

通过以下命令安装 CDK 依赖：

```
npm install
```

切换回仓库根目录，然后使用以下命令切换到 `/lambda` 目录：

```
cd lambda
```

进入 `/lambda` 文件夹后，使用以下命令安装 Go 依赖：

```
go get
```

所有依赖现已安装完毕。

### 修改配置文件

在仓库根目录中，打开 `config.yaml` 并修改 AMP 工作区 URL，
将 `{workspace}` 替换为新创建的工作区 ID，以及
AMP 工作区所在的区域。

例如，按如下方式修改：

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

根据您的需要更改 Firehose Delivery Stream 和 S3 Bucket 的名称。

### 部署堆栈

修改 `config.yaml` 中的 AMP 工作区 ID 后，就可以
将堆栈部署到 CloudFormation。要构建 CDK 和 Lambda 代码，
在仓库根目录运行以下命令：

```
npm run build
```

此构建步骤确保编译 Go Lambda 二进制文件，并将 CDK
部署到 CloudFormation。

接受以下 IAM 更改以部署堆栈：

![Screen shot of the IAM Changes when deploying the CDK](../images/cdk-amp-iam-changes.png)

通过运行以下命令验证堆栈已创建：

```
aws cloudformation list-stacks
```

应该已创建一个名为 `CDK Stack` 的堆栈。

## 创建 CloudWatch stream

导航到 CloudWatch 控制台，例如
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList`
并点击"Create metric stream"。

选择需要的 metrics，可以是所有 metrics 或仅从选定的命名空间。

使用 CDK 创建的现有 Firehose 来配置 Metric Stream。
将输出格式从 OpenTelemetry 0.7 更改为 JSON。
根据需要修改 Metric Stream 名称，然后点击"Create metric stream"：

![Screen shot of the Cloudwatch Metric Stream Configuration](../images/cloudwatch-metric-stream-configuration.png)

要验证 Lambda 函数的调用，导航到 [Lambda 控制台](https://console.aws.amazon.com/lambda/home)
并点击函数 `KinesisMessageHandler`。点击 `Monitor` 选项卡和 `Logs` 子选项卡，在 `Recent Invocations` 下应该有 Lambda 函数被触发的条目。

:::note
    调用记录可能需要最多 5 分钟才能显示在 Monitor 选项卡中。
:::
完成！恭喜，您的 metrics 现在正在从 CloudWatch 流式传输到 Amazon Managed Service for Prometheus。

## 清理

首先，删除 CloudFormation 堆栈：

```
cd cdk
cdk destroy
```

删除 AMP 工作区：

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

最后，通过控制台删除 CloudWatch Metric Stream。
