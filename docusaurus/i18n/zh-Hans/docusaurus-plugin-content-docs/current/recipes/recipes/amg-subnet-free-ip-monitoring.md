# 监控子网中的可用 IP

本文介绍如何设置监控堆栈来监控子网中的可用 IP 地址。

我们将使用 [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) 搭建一个堆栈，创建 Lambda、CloudWatch dashboard 和 CloudWatch 告警，用于监控子网中的可用空闲 IP。

:::note
    本指南大约需要 30 分钟完成。
:::
## 基础设施
以下部分将设置本方案所需的基础设施。

此处部署的 Lambda 将定期调用 EC2 API，并将可用 IP metrics 发送到 [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)。

### 前提条件

* AWS CLI 已在您的环境中[安装](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)。
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) 已在您的环境中安装。
* Node.js。
* [仓库](https://github.com/aws-observability/observability-best-practices/)已克隆到本地。本项目的代码位于 `/sandbox/grafana_subnet_ip_monitoring`。

### 安装依赖

通过以下命令切换到 grafana_subnet_ip_monitoring 目录：

```
cd sandbox/grafana_subnet_ip_monitoring
```

此目录将被视为仓库的根目录。

通过以下命令安装 CDK 依赖：

```
npm install
```

所有依赖现已安装完毕。

### 修改配置文件

在仓库根目录中，打开 `lib/vpc_monitoring_stack.ts` 并根据您的需求修改 `subnetIds`、`alarmEmail` 和 `monitoringFrequencyMinutes`。

例如，按如下方式修改：

```
    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs
        'subnet-0713ae10e4a8da850',
        'subnet-00a36dd76f1c51d97'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: 'abc123@email.com', // Replace your email
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
```


### 部署堆栈

完成上述更改后，即可将堆栈部署到 CloudFormation。运行以下命令部署 CDK 堆栈：

```
cdk bootstrap
cdk deploy --all
```

## 清理

删除 CloudFormation 堆栈：

```
cdk destroy
```
