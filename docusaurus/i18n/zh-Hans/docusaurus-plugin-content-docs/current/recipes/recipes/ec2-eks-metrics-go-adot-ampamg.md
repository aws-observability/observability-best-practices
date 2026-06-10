# 在 EC2 上的 EKS 中使用 AWS Distro for OpenTelemetry 配合 Amazon Managed Service for Prometheus

本文介绍如何对[示例 Go 应用程序](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)进行插桩，
并使用 [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) 将 metrics 摄入到
[Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/)。
然后使用 [Amazon Managed Grafana (AMG)](https://aws.amazon.com/grafana/) 可视化这些 metrics。

我们将搭建一个运行在 EC2 上的 [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) 集群和 [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) 仓库来演示完整场景。

:::note
    本指南大约需要 1 小时完成。
:::
## 基础设施
以下部分将设置本方案所需的基础设施。

### 架构


ADOT 管道使我们能够使用
[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) 来
抓取经过 Prometheus 插桩的应用程序，并将抓取的 metrics 摄入到
Amazon Managed Service for Prometheus。

![Architecture](../images/adot-metrics-pipeline.png)

ADOT Collector 包含两个 Prometheus 特定的组件：

* Prometheus Receiver，以及
* AWS Prometheus Remote Write Exporter。

:::info
    有关 Prometheus Remote Write Exporter 的更多信息，请查看：
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)
:::

### 前提条件

* AWS CLI 已在您的环境中[安装](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)。
* 您需要在环境中安装 [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) 命令。
* 您需要在环境中安装 [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)。
* 您的环境中已安装 [docker](https://docs.docker.com/get-docker/)。

### 创建 EC2 上的 EKS 集群

本方案中的演示应用程序将运行在 EKS 之上。
您可以使用现有的 EKS 集群或使用 [cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml) 创建一个。

此模板将创建一个包含两个 EC2 `t2.large` 节点的新集群。

编辑模板文件，将 `<YOUR_REGION>` 设置为
[AMP 支持的区域](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions)之一。

确保在会话中覆盖 `<YOUR_REGION>`，例如在 bash 中：
```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

使用以下命令创建集群：
```
eksctl create cluster -f cluster-config.yaml
```

### 设置 ECR 仓库

为了将应用程序部署到 EKS，我们需要一个容器注册表。
您可以使用以下命令在您的账户中创建一个新的 ECR 注册表。
确保同时设置 `<YOUR_REGION>`。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### 设置 AMP


使用 AWS CLI 创建工作区：
```
aws amp create-workspace --alias prometheus-sample-app
```

验证工作区已创建：
```
aws amp list-workspaces
```

:::info
    更多详情请查看 [AMP 入门](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)指南。
:::

### 设置 ADOT Collector

下载 [adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml)
并按照以下步骤编辑此 YAML 文件中的参数。

在此示例中，ADOT Collector 配置使用注解 `(scrape=true)`
来指定要抓取的目标 endpoint。这允许 ADOT Collector 区分
示例应用 endpoint 和集群中的 `kube-system` endpoint。
如果要抓取不同的示例应用，可以从重新标记配置中移除此设置。

使用以下步骤根据您的环境编辑下载的文件：

1\. 将 `<YOUR_REGION>` 替换为您当前的区域。

2\. 将 `<YOUR_ENDPOINT>` 替换为工作区的 remote write URL。

通过执行以下查询获取您的 AMP remote write URL endpoint。

首先，获取工作区 ID：

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

然后使用以下命令获取工作区的 remote write URL endpoint：

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    确保 `YOUR_ENDPOINT` 确实是 remote write URL，即
    URL 应以 `/api/v1/remote_write` 结尾。
:::
创建部署文件后，现在可以使用以下命令将其应用到集群：

```
kubectl apply -f adot-collector-ec2.yaml
```

:::info
    更多信息请查看 [AWS Distro for OpenTelemetry (ADOT)
    Collector 设置](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup)。
:::

### 设置 AMG

按照 [Amazon Managed Grafana - 入门](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/)指南设置新的 AMG 工作区。

确保在创建过程中将 "Amazon Managed Service for Prometheus" 添加为数据源。

![Service managed permission settings](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)


## 应用程序

在本方案中，我们将使用 AWS Observability 仓库中的
[示例应用程序](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus)。

此 Prometheus 示例应用生成所有四种 Prometheus metric 类型
（counter、gauge、histogram、summary）并在 `/metrics` endpoint 暴露它们。

### 构建容器镜像

要构建容器镜像，首先克隆 Git 仓库并切换到目录：

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

首先，设置区域（如果上面没有设置）和账户 ID 为适用于您的情况的值。
将 `<YOUR_REGION>` 替换为您当前的区域。例如，在 Bash shell 中如下所示：

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

接下来，构建容器镜像：

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    如果 `go mod` 因 proxy.golang.or 的 i/o 超时而在您的环境中失败，
    您可以通过编辑 Dockerfile 来绕过 go mod 代理。

    将 Dockerfile 中的以下行：
    ```
    RUN GO111MODULE=on go mod download
    ```
    修改为：
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::
现在可以将容器镜像推送到之前创建的 ECR 仓库。

首先，登录默认的 ECR 注册表：

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

最后，将容器镜像推送到您创建的 ECR 仓库：

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

### 部署示例应用

编辑 [prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml)
使其包含您的 ECR 镜像路径。即，将文件中的 `ACCOUNTID` 和 `AWS_DEFAULT_REGION`
替换为您自己的值：

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

现在可以使用以下命令将示例应用部署到集群：

```
kubectl apply -f prometheus-sample-app.yaml
```

## 端到端验证

现在基础设施和应用程序都已就位，我们将测试设置，
将 EKS 中运行的 Go 应用的 metrics 发送到 AMP，并在 AMG 中可视化。

### 验证管道是否正常工作

要验证 ADOT collector 是否正在抓取示例应用的 pod 并将 metrics 摄入到 AMP，
我们查看 collector 的 logs。

输入以下命令跟踪 ADOT collector 的 logs：

```
kubectl -n adot-col logs adot-collector -f
```

logs 中从示例应用抓取的 metrics 的输出示例如下：

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
    要验证 AMP 是否收到 metrics，可以使用 [awscurl](https://github.com/okigan/awscurl)。
    此工具允许您从命令行发送带有 AWS Sigv4 身份验证的 HTTP 请求，
    因此您必须在本地设置具有正确权限的 AWS 凭证来查询 AMP。
    在以下命令中，将 `$AMP_ENDPOINT` 替换为您的 AMP 工作区的 endpoint：

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### 创建 Grafana dashboard

您可以导入示例 dashboard，可通过
[prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) 获取，
该示例应用的 dashboard 如下所示：

![Screen shot of the Prometheus sample app dashboard in AMG](../images/amg-prom-sample-app-dashboard.png)

此外，可以使用以下指南在 Amazon Managed Grafana 中创建您自己的 dashboard：

* [用户指南：Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [创建 dashboard 的最佳实践](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上就是全部内容，恭喜您已学会如何在 EC2 上的 EKS 中使用 ADOT 来摄入 metrics。

## 清理

1. 删除资源和集群
```
kubectl delete all --all
eksctl delete cluster --name amp-eks-ec2
```
2. 删除 AMP 工作区
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. 删除 amp-iamproxy-ingest-role IAM 角色
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. 通过控制台删除 AMG 工作区。
