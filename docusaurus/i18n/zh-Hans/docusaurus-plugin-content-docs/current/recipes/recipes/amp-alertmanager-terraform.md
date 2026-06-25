# 使用 Terraform 作为基础设施即代码部署 Amazon Managed Service for Prometheus 并配置 Alert Manager

本文将演示如何使用 [Terraform](https://www.terraform.io/) 来配置 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)，并配置规则管理和告警管理器，以便在满足特定条件时向 [SNS](https://docs.aws.amazon.com/sns/) 主题发送通知。


:::note
    本指南大约需要 30 分钟完成。
:::
## 前提条件

完成设置需要以下工具：

* [Amazon EKS 集群](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS 主题](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

在本方案中，我们将使用示例应用程序来演示使用 ADOT 进行 metric 抓取并将 metrics 远程写入 Amazon Managed Service for Prometheus 工作区。从 [aws-otel-community](https://github.com/aws-observability/aws-otel-community) 仓库 Fork 并克隆示例应用。

此 Prometheus 示例应用生成所有 4 种 Prometheus metric 类型（counter、gauge、histogram、summary）并在 /metrics endpoint 暴露它们。

健康检查 endpoint 也存在于 /

以下是可选的命令行配置参数列表：

listen_address：（默认 = 0.0.0.0:8080）定义示例应用暴露的地址和端口。这主要是为了符合测试框架的要求。

metric_count：（默认=1）每种 metric 类型要生成的数量。每种 metric 类型始终生成相同数量的 metrics。

label_count：（默认=1）每个 metric 要生成的标签数量。


datapoint_count：（默认=1）每个 metric 要生成的数据点数量。

### 使用 AWS Distro for OpenTelemetry 启用 Metric 收集
1. 从 aws-otel-community 仓库 Fork 并克隆示例应用。然后运行以下命令：

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. 将此镜像推送到注册表（如 Amazon ECR）。您可以使用以下命令在账户中创建新的 ECR 仓库。确保设置 "YOUR_REGION"。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. 通过复制此 Kubernetes 配置并应用来在集群中部署示例应用。在 prometheus-sample-app.yaml 文件中将 `PUBLIC_SAMPLE_APP_IMAGE` 替换为您刚推送的镜像来更改镜像。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. 启动 ADOT Collector 的默认实例。首先输入以下命令拉取 ADOT Collector 的 Kubernetes 配置。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
然后编辑模板文件，将 `YOUR_ENDPOINT` 替换为您的 Amazon Managed Service for Prometheus 工作区的 remote_write endpoint，将 `YOUR_REGION` 替换为您的区域。
使用在 Amazon Managed Service for Prometheus 控制台中查看工作区详情时显示的 remote_write endpoint。
您还需要将 Kubernetes 配置中 service account 部分的 `YOUR_ACCOUNT_ID` 更改为您的 AWS 账户 ID。

在本方案中，ADOT Collector 配置使用注解 `(scrape=true)` 来指定要抓取的目标 endpoint。这允许 ADOT Collector 区分示例应用 endpoint 和集群中的 kube-system endpoint。如果要抓取不同的示例应用，可以从重新标记配置中移除此设置。
5. 输入以下命令部署 ADOT collector：
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### 使用 Terraform 配置工作区

现在，我们将配置一个 Amazon Managed Service for Prometheus 工作区，并定义一个告警规则，当某个条件（在 ```expr``` 中定义）在指定时间段（```for```）内持续为真时，Alert Manager 会发送通知。Terraform 语言的代码存储在扩展名为 .tf 的纯文本文件中。还有一种基于 JSON 的语言变体，使用 .tf.json 扩展名。

现在我们将使用 [main.tf](./amp-alertmanager-terraform/main.tf) 通过 terraform 部署资源。在运行 terraform 命令之前，我们将导出 `region` 和 `sns_topic` 变量。

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

现在，执行以下命令来配置工作区：

```
terraform init
terraform plan
terraform apply
```

上述步骤完成后，使用 awscurl 查询 endpoint 来端到端验证设置。确保将 `WORKSPACE_ID` 变量替换为相应的 Amazon Managed Service for Prometheus 工作区 ID。

运行以下命令时，查找 metric "metric:recording_rule"，如果您成功找到该 metric，则说明您已成功创建了记录规则：

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
示例输出：
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) > 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

我们可以进一步查询 alertmanager endpoint 来确认：
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
示例输出：
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5&g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
这确认告警已触发并通过 SNS receiver 发送到 SNS。

## 清理

运行以下命令终止 Amazon Managed Service for Prometheus 工作区。确保同时删除创建的 EKS 集群：


```
terraform destroy
```

