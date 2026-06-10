# 在 Fargate 上的 EKS 中使用 AWS Distro for OpenTelemetry 与 AWS X-Ray

在本方案中，我们将展示如何对示例 Go 应用程序进行插桩，并使用 [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) 将 traces 摄入 [AWS X-Ray](https://aws.amazon.com/xray/)，并在 [Amazon Managed Grafana](https://aws.amazon.com/grafana/) 中可视化 traces。

我们将设置一个运行在 [AWS Fargate](https://aws.amazon.com/fargate/) 上的 [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) 集群，并使用 [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) 仓库来演示完整场景。

:::note
    本指南大约需要 1 小时完成。
:::
## 基础设施
在以下部分中，我们将为此方案设置基础设施。

### 架构

ADOT 流水线使我们能够使用 [ADOT Collector](https://github.com/aws-observability/aws-otel-collector) 从已插桩的应用程序收集 traces 并将其摄入 X-Ray：

![ADOT default pipeline](../images/adot-default-pipeline.png)


### 先决条件

* AWS CLI 已在您的环境中[安装](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)。
* 您需要在环境中安装 [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) 命令。
* 您需要在环境中安装 [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)。
* 您的环境中已安装 [Docker](https://docs.docker.com/get-docker/)。
* 您已将 [aws-observability/aws-o11y-recipes](https://github.com/aws-observability/aws-o11y-recipes/) 仓库克隆到本地环境。

### 创建 Fargate 上的 EKS 集群

我们的演示应用程序是一个 Kubernetes 应用，将在 Fargate 上的 EKS 集群中运行。首先使用提供的 [cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml) 创建一个 EKS 集群。

使用以下命令创建集群：

```
eksctl create cluster -f cluster-config.yaml
```

### 创建 ECR 仓库

为了将应用程序部署到 EKS，我们需要一个容器仓库。我们将使用私有 ECR 注册表，但如果您想共享容器镜像，也可以使用 ECR Public。

首先设置环境变量，如下所示（替换为您的区域）：

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

您可以使用以下命令在账户中创建新的 ECR 仓库：

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```

### 设置 ADOT Collector

下载 [adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) 并使用下一步中描述的参数编辑此 YAML 文件。


```
kubectl apply -f adot-collector-fargate.yaml
```

### 设置 Managed Grafana

使用 [Amazon Managed Grafana - 入门](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/)指南设置新的工作空间，并添加 [X-Ray 作为数据源](https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html)。

## 信号生成器

我们将使用 `ho11y`，一个可通过方案仓库的 [sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y) 获取的合成信号生成器。如果您尚未将仓库克隆到本地环境，请现在执行：

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```

### 构建容器镜像
确保已设置 `ACCOUNTID` 和 `REGION` 环境变量，例如：

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```
要构建 `ho11y` 容器镜像，首先切换到 `./sandbox/ho11y/` 目录并构建容器镜像：

:::note
    以下构建步骤假设 Docker 守护进程或等效的 OCI 镜像构建工具正在运行。
:::

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### 推送容器镜像
接下来，您可以将容器镜像推送到之前创建的 ECR 仓库。为此，首先登录到默认 ECR 注册表：

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

最后，将容器镜像推送到您上面创建的 ECR 仓库：

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### 部署信号生成器

编辑 [x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml) 以包含您的 ECR 镜像路径。即在文件中将 `ACCOUNTID` 和 `REGION` 替换为您自己的值（共三处）：

``` 
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

现在可以使用以下命令将示例应用部署到集群：

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```

## 端到端验证

现在基础设施和应用程序都已就位，我们将测试设置，将 traces 从运行在 EKS 中的 `ho11y` 发送到 X-Ray 并在 AMG 中可视化。

### 验证流水线

要验证 ADOT collector 是否正在从 `ho11y` 摄入 traces，我们将其中一个服务在本地可用并调用它。

首先，按如下方式转发流量：

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

使用上述命令，`frontend` 微服务（一个配置为与另外两个 `ho11y` 实例通信的 `ho11y` 实例）在您的本地环境中可用，您可以按如下方式调用它（触发 traces 的创建）：

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

:::tip
    如果您想自动化调用，可以将 `curl` 调用包装在 `while true` 循环中。
:::
要验证设置，请访问 [CloudWatch 中的 X-Ray 视图](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/)，您应该会看到如下所示的内容：

![Screen shot of the X-Ray console in CW](../images/x-ray-cw-ho11y.png)

现在我们已经设置并激活了信号生成器以及 OpenTelemetry 流水线，让我们看看如何在 Grafana 中使用 traces。

### Grafana dashboard

您可以导入一个示例 dashboard，可通过 [x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json) 获取，外观如下：

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-dashboard.png)

此外，当您点击下方 `downstreams` 面板中的任何 traces 时，可以深入查看并在"Explore"标签页中查看，如下所示：

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-explore.png)

从这里，您可以使用以下指南在 Amazon Managed Grafana 中创建自己的 dashboard：

* [用户指南：Dashboard](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [创建 dashboard 的最佳实践](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

完成了，恭喜您已学会如何在 Fargate 上的 EKS 中使用 ADOT 摄入 traces。

## 清理

首先删除 Kubernetes 资源并销毁 EKS 集群：

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```
最后，通过 AWS 控制台删除 Amazon Managed Grafana 工作空间。
