# 在 EKS on Fargate 中使用 AWS Distro for OpenTelemetry 配合 Amazon Managed Service for Prometheus

在本方案中，我们将展示如何为一个[示例 Go 应用程序](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)添加检测工具，
并使用 [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) 将 metrics 导入
[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)。
然后我们使用 [Amazon Managed Grafana](https://aws.amazon.com/grafana/) 来可视化这些 metrics。

我们将搭建一个 [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)
on [AWS Fargate](https://aws.amazon.com/fargate/) 集群，并使用
[Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) 仓库
来演示完整的场景。

:::note
    本指南大约需要 1 小时完成。
:::
## 基础设施
在以下章节中，我们将搭建本方案所需的基础设施。

### 架构

ADOT 管道使我们能够使用
[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) 来
抓取经 Prometheus 检测的应用程序，并将抓取的 metrics 导入到
Amazon Managed Service for Prometheus。

![Architecture](../images/adot-metrics-pipeline.png)

ADOT Collector 包含两个与 Prometheus 相关的组件：

* Prometheus Receiver，以及
* AWS Prometheus Remote Write Exporter。

:::info
    有关 Prometheus Remote Write Exporter 的更多信息，请查看：
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)。
:::

### 前提条件

* 在您的环境中已[安装](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)了 AWS CLI。
* 您需要在环境中安装 [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) 命令。
* 您需要在环境中安装 [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)。
* 您的环境中已安装 [Docker](https://docs.docker.com/get-docker/)。

### 创建 EKS on Fargate 集群

我们的演示应用程序是一个 Kubernetes 应用，将在 EKS on Fargate 集群中运行。
首先，使用提供的 [cluster-config.yaml](./fargate-eks-metrics-go-adot-ampamg/cluster-config.yaml)
模板文件创建 EKS 集群，将 `<YOUR_REGION>` 替换为
[AMP 支持的区域](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions)之一。

确保在 shell 会话中设置 `<YOUR_REGION>`，例如在 Bash 中：

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

使用以下命令创建集群：

```
eksctl create cluster -f cluster-config.yaml
```

### 创建 ECR 仓库

要将应用程序部署到 EKS，我们需要一个容器仓库。
您可以使用以下命令在您的账户中创建新的 ECR 仓库。
同样请确保设置 `<YOUR_REGION>`。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### 设置 AMP

首先，使用 AWS CLI 创建 Amazon Managed Service for Prometheus 工作区：

```
aws amp create-workspace --alias prometheus-sample-app
```

使用以下命令验证工作区是否已创建：

```
aws amp list-workspaces
```

:::info
    更多详情请查看 [AMP 入门指南](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)。
:::

### 设置 ADOT Collector

下载 [adot-collector-fargate.yaml](./fargate-eks-metrics-go-adot-ampamg/adot-collector-fargate.yaml)
并按以下步骤中描述的参数编辑此 YAML 文件。

在本示例中，ADOT Collector 配置使用注解 `(scrape=true)`
来指定要抓取的目标 endpoint。这使得 ADOT Collector 能够区分
示例应用 endpoint 和集群中 `kube-system` 的 endpoint。
如果您想抓取其他示例应用，可以从 re-label 配置中移除此设置。

按以下步骤编辑下载的文件以适应您的环境：

1\. 将 `<YOUR_REGION>` 替换为您当前的区域。

2\. 将 `<YOUR_ENDPOINT>` 替换为您工作区的 remote write URL。

执行以下查询获取您的 AMP remote write URL endpoint。

首先，获取工作区 ID：

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

然后使用以下命令获取您工作区的 remote write URL endpoint：

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    请确保 `YOUR_ENDPOINT` 确实是 remote write URL，即
    URL 应以 `/api/v1/remote_write` 结尾。
:::
创建部署文件后，我们可以使用以下命令将其应用到集群：

```
kubectl apply -f adot-collector-fargate.yaml
```

:::info
    更多信息请查看 [AWS Distro for OpenTelemetry (ADOT)
    Collector 设置](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup)。
:::
### 设置 AMG

按照 [Amazon Managed Grafana - 入门指南](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/)设置新的 AMG 工作区。

确保在创建过程中将"Amazon Managed Service for Prometheus"添加为数据源。

![Service managed permission settings](../images/amg-console-create-workspace-managed-permissions.jpg)

## 应用程序

在本方案中，我们将使用 AWS Observability 仓库中的一个
[示例应用程序](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)。

这个 Prometheus 示例应用生成所有四种 Prometheus metric 类型
（counter、gauge、histogram、summary）并在 `/metrics` endpoint 上公开它们。

### 构建容器镜像

要构建容器镜像，首先克隆 Git 仓库并切换到目录：

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

首先，设置区域（如果之前未设置）和账户 ID。
将 `<YOUR_REGION>` 替换为您当前的区域。例如，
在 Bash shell 中如下所示：

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

接下来，构建容器镜像：

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    如果您的环境中 `go mod` 由于 proxy.golang.or i/o 超时而失败，
    您可以通过编辑 Dockerfile 绕过 go mod proxy。

    将 Docker 文件中的以下行：
    ```
    RUN GO111MODULE=on go mod download
    ```
    更改为：
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::

现在您可以将容器镜像推送到之前创建的 ECR 仓库。

首先，登录默认 ECR registry：

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

最后，将容器镜像推送到您之前创建的 ECR 仓库：

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

### 部署示例应用

编辑 [prometheus-sample-app.yaml](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml)
以包含您的 ECR 镜像路径。即，将文件中的 `ACCOUNTID` 和 `AWS_DEFAULT_REGION`
替换为您自己的值：

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

现在您可以使用以下命令将示例应用部署到集群：

```
kubectl apply -f prometheus-sample-app.yaml
```

## 端到端验证

现在基础设施和应用程序都已就位，我们将测试整个设置，
将 Go 应用在 EKS 中运行产生的 metrics 发送到 AMP，
并在 AMG 中进行可视化。

### 验证管道是否正常工作

要验证 ADOT collector 是否正在抓取示例应用的 pod 并将
metrics 导入到 AMP，我们查看 collector 的 logs。

输入以下命令以跟踪 ADOT collector 的 logs：

```
kubectl -n adot-col logs adot-collector -f
```

从示例应用抓取的 metrics 在 logs 中的输出示例如下：

```
...
Resource labels:
     -> service.name: STRING(kubernetes-service-endpoints)
     -> host.name: STRING(192.168.16.238)
     -> port: STRING(8080)
     -> scheme: STRING(http)
InstrumentationLibraryMetrics #0
Metric #0
Descriptor:
     -> Name: test_gauge0
     -> Description: This is my gauge
     -> Unit:
     -> DataType: DoubleGauge
DoubleDataPoints #0
StartTime: 0
Timestamp: 1606511460471000000
Value: 0.000000
...
```

:::tip
    要验证 AMP 是否已接收 metrics，您可以使用 [awscurl](https://github.com/okigan/awscurl)。
    此工具允许您从命令行发送带有 AWS Sigv4 认证的 HTTP 请求，
    因此您必须在本地设置具有正确权限的 AWS 凭证才能从 AMP 查询。
    在以下命令中，将 `$AMP_ENDPOINT` 替换为您 AMP 工作区的 endpoint：

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### 创建 Grafana dashboard

您可以导入一个示例 dashboard，可通过
[prometheus-sample-app-dashboard.json](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) 获取，
示例应用的 dashboard 如下所示：

![Screen shot of the Prometheus sample app dashboard in AMG](../images/amg-prom-sample-app-dashboard.png)

此外，使用以下指南在 Amazon Managed Grafana 中创建您自己的 dashboard：

* [用户指南：Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [创建 dashboards 的最佳实践](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

完成！恭喜您已经学会了如何在 EKS on Fargate 中使用 ADOT 导入 metrics。

## 清理

首先删除 Kubernetes 资源并销毁 EKS 集群：

```
kubectl delete all --all && \
eksctl delete cluster --name amp-eks-fargate
```

删除 Amazon Managed Service for Prometheus 工作区：

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

删除 IAM 角色：

```
aws delete-role --role-name adot-collector-role
```

最后，通过 AWS 控制台删除 Amazon Managed Grafana 工作区。
