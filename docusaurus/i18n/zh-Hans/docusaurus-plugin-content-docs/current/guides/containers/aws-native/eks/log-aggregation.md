# 日志聚合

在可观测性最佳实践指南的这一部分中，我们将深入探讨以下与使用 AWS 原生服务进行 Amazon EKS 日志记录相关的主题：

* AWS EKS 日志记录简介
* Amazon EKS 控制平面日志记录
* Amazon EKS 数据平面日志记录
* Amazon EKS 应用程序日志记录
* 使用 AWS 原生服务从 Amazon EKS 和其他计算平台进行统一日志聚合
* 结论

### 简介

Amazon EKS 日志记录可分为三种类型：控制平面日志记录、节点日志记录和应用程序日志记录。[Kubernetes 控制平面](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)是一组管理 Kubernetes 集群并生成用于审计和诊断目的的日志的组件。使用 Amazon EKS，您可以[开启不同控制平面组件的日志](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)并将它们发送到 CloudWatch。

Kubernetes 还在运行 pod 的每个 Kubernetes 节点上运行系统组件，如 `kubelet` 和 `kube-proxy`。这些组件在每个节点内写入日志，您可以配置 CloudWatch 和 Container Insights 来捕获每个 Amazon EKS 节点的这些日志。

容器被分组为 Kubernetes 集群中的 [pod](https://kubernetes.io/docs/concepts/workloads/pods/)，并被调度在 Kubernetes 节点上运行。大多数容器化应用程序写入标准输出和标准错误，容器引擎将输出重定向到日志驱动程序。在 Kubernetes 中，容器日志位于节点上的 `/var/log/pods` 目录中。您可以配置 CloudWatch 和 Container Insights 来捕获每个 Amazon EKS pod 的这些日志。

在 Kubernetes 中，有三种常见的方法来捕获容器日志并将其发送到集中式日志聚合系统：

* 节点级别 agent，如 [Fluentd daemonset](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html)。这是推荐的模式。
* Sidecar 容器，如 Fluentd sidecar 容器。
* 直接写入日志收集系统。在这种方法中，应用程序负责传送日志。这是最不推荐的选项，因为您必须在应用程序代码中包含日志聚合系统的 SDK，而不是重用社区构建的解决方案（如 Fluentd）。这种模式也违反了*关注点分离原则*，根据该原则，日志实现应独立于应用程序。这样做可以让您更改日志基础设施而不影响或更改应用程序。

我们现在将深入了解 Amazon EKS 日志记录的每个类别，并讨论从 Amazon EKS 和其他计算平台进行统一日志聚合。

### Amazon EKS 控制平面日志记录

Amazon EKS 集群由 Kubernetes 集群的高可用性、单租户控制平面和运行容器的 Amazon EKS 节点组成。控制平面节点运行在 AWS 管理的账户中。Amazon EKS 集群控制平面节点与 CloudWatch 集成，您可以开启特定控制平面组件的日志记录。日志为每个 Kubernetes 控制平面组件实例提供。AWS 管理控制平面节点的健康状况，并为 Kubernetes endpoint 提供[服务级别协议 (SLA)](http://aws.amazon.com/eks/sla/)。

[Amazon EKS 控制平面日志记录](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)包含以下集群控制平面日志类型。每种日志类型对应 Kubernetes 控制平面的一个组件。要了解更多关于这些组件的信息，请参阅 Kubernetes 文档中的 [Kubernetes 组件](https://kubernetes.io/docs/concepts/overview/components/)。

* **API server (`api`)** - 集群的 API server 是公开 Kubernetes API 的控制平面组件。如果您在启动集群时或之后不久启用 API server 日志，这些日志将包含用于启动 API server 的标志。有关更多信息，请参阅 Kubernetes 文档中的 [`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) 和[审计策略](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255)。
* **Audit (`audit`)** - Kubernetes 审计日志提供了影响集群的个人用户、管理员或系统组件的记录。有关更多信息，请参阅 Kubernetes 文档中的[审计](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)。
* **Authenticator (`authenticator`)** - Authenticator 日志是 Amazon EKS 独有的。这些日志代表 Amazon EKS 用于使用 IAM 凭证进行 Kubernetes [基于角色的访问控制](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) 身份验证的控制平面组件。有关更多信息，请参阅[集群管理](https://docs.aws.amazon.com/eks/latest/userguide/eks-managing.html)。
* **Controller manager (`controllerManager`)** - Controller manager 管理 Kubernetes 附带的核心控制循环。有关更多信息，请参阅 Kubernetes 文档中的 [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)。
* **Scheduler (`scheduler`)** - Scheduler 组件管理何时何地在集群中运行 pod。有关更多信息，请参阅 Kubernetes 文档中的 [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)。

请按照[启用和禁用控制平面日志](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#:~:text=the%20Kubernetes%20documentation.-,Enabling%20and%20disabling%20control%20plane%20logs,-By%20default%2C%20cluster)部分通过 AWS 控制台或 AWS CLI 启用控制平面日志。

#### 从 CloudWatch 控制台查询控制平面日志

在 Amazon EKS 集群上启用控制平面日志记录后，您可以在 `/aws/eks/cluster-name/cluster` 日志组中找到 EKS 控制平面日志。有关更多信息，请参阅[查看集群控制平面日志](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#viewing-control-plane-logs)。请确保将 `cluster-name` 替换为您集群的名称。

您可以使用 CloudWatch Logs Insights 搜索 EKS 控制平面日志数据。有关更多信息，请参阅[使用 CloudWatch Insights 分析日志数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)。需要注意的是，只有在集群中开启控制平面日志记录后，才能在 CloudWatch Logs 中查看日志事件。在选择时间范围以在 CloudWatch Logs Insights 中运行查询之前，请验证您已开启控制平面日志记录。请查看下面的截图，显示 EKS 控制平面日志查询及查询输出的示例。

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*图：CloudWatch Logs Insights。*

#### CloudWatch Logs Insights 上常见 EKS 用例的示例查询

要查找集群创建者，请搜索映射到 **kubernetes-admin** 用户的 IAM 实体。

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

示例输出：

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

在此输出中，IAM 用户 **arn:aws:iam::[12345678910](tel:12345678910):user/awscli** 映射到用户 **kubernetes-admin**。

要查找特定用户执行的请求，搜索 **kubernetes-admin** 用户执行的操作。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

示例输出：

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

要查找特定 userAgent 发起的 API 调用，可以使用此示例查询：

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

简化的示例输出：

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

要查找对 **aws-auth** ConfigMap 的变更操作，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

简化的示例输出：

```

@logStream,@timestamp,@messagekube-apiserver-audit-f01c77ed8078a670a2eb63af6f127163,2021-10-27 05:43:01.850,{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""RequestResponse"",""auditID"":""8f9a5a16-f115-4bb8-912f-ee2b1d737ff1"",""stage"":""ResponseComplete"",""requestURI"":""/api/v1/namespaces/kube-system/configmaps/aws-auth?timeout=19s"",""verb"":""patch"",""responseStatus"": {""metadata"": {},""code"": 200 },""requestObject"": {""data"": { contents of aws-auth ConfigMap } },""requestReceivedTimestamp"":""2021-10-27T05:43:01.033516Z"",""stageTimestamp"":""2021-10-27T05:43:01.042364Z"" }
```

要查找被拒绝的请求，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

示例输出：

```

@logStream,@timestamp,@messageauthenticator-8c0c570ea5676c62c44d98da6189a02b,2021-08-08 20:04:46.282,"time=""2021-08-08T20:04:44Z"" level=warning msg=""access denied"" client=""127.0.0.1:52856"" error=""sts getCallerIdentity failed: error from AWS (expected 200, got 403)"" method=POST path=/authenticate"
```

要查找 pod 被调度到的节点，查询 **kube-scheduler** 日志。

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

示例输出：

```

@logStream,@timestamp,@messagekube-scheduler-bb3ea89d63fd2b9735ba06b144377db6,2021-08-15 12:19:43.000,"I0915 12:19:43.933124       1 scheduler.go:604] ""Successfully bound pod to node"" pod=""kube-system/aws-6799fc88d8-jqc2r"" node=""ip-192-168-66-187.eu-west-1.compute.internal"" evaluatedNodes=3 feasibleNodes=2"
```

在此示例输出中，pod **aws-6799fc88d8-jqc2r** 被调度到节点 **ip-192-168-66-187.eu-west-1.compute.internal**。

要查找 Kubernetes API server 请求的 HTTP 5xx 服务器错误，可以使用此示例查询：

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

简化的示例输出：

```

@logStream,@timestamp,responseStatus.code,@messagekube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 07:22:06.518,503,"...""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""system:serviceaccount:kube-system:resourcequota-controller"",""uid"":""36d9c3dd-f1fd-4cae-9266-900d64d6a754"",""groups"":[""system:serviceaccounts"",""system:serviceaccounts:kube-system"",""system:authenticated""]},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kube-controller-manager/v1.21.2 (linux/amd64) kubernetes/d2965f0/system:serviceaccount:kube-system:resourcequota-controller"",""responseStatus"":{""metadata"":{},""code"":503},..."}}"
```

要排查 CronJob 激活问题，搜索 **cronjob-controller** 执行的 API 调用。

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:cronjob-controller"
| display @logStream, @timestamp, @message, objectRef.namespace, objectRef.name
| sort @timestamp desc
| limit 50
```

简化的示例输出：

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "objectRef": { "resource": "cronjobs", "namespace": "default", "name": "hello", "apiGroup": "batch", "apiVersion": "v1" }, "responseObject": { "kind": "CronJob", "apiVersion": "batch/v1", "spec": { "schedule": "*/1 * * * *" }, "status": { "lastScheduleTime": "2021-08-09T07:19:00Z" } } }
```

在此示例输出中，**default** namespace 中的 **hello** 作业每分钟运行一次，上次调度时间为 **2021-08-09T07:19:00Z**。

要查找 **replicaset-controller** 执行的 API 调用，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:replicaset-controller"
| display @logStream, @timestamp, requestURI, verb, user.username
| sort @timestamp desc
| limit 50
```

示例输出：

```

@logStream,@timestamp,requestURI,verb,user.usernamekube-apiserver-audit-8c0c570ea5676c62c44d98da6189a02b,2021-08-10 17:13:53.281,/api/v1/namespaces/kube-system/pods,create,system:serviceaccount:kube-system:replicaset-controller
kube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 0718:44.561,/apis/apps/v1/namespaces/kube-system/replicasets/coredns-6496b6c8b9/status,update,system:serviceaccount:kube-system:replicaset-controller
```

要查找对 Kubernetes 资源执行的操作，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/namespaces/default/pods/my-app"
| sort @timestamp desc
| limit 10
```

上述示例查询过滤了 **default** namespace 中 pod **my-app** 的 **delete** API 调用。
简化的示例输出：

```

@logStream,@timestamp,@messagekube-apiserver-audit-e7b3cb08c0296daf439493a6fc9aff8c,2021-08-11 14:09:47.813,"...""requestURI"":""/api/v1/namespaces/default/pods/my-app"",""verb"":""delete"",""user"":{""username""""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""pods"",""namespace"":""default"",""name"":""my-app"",""apiVersion"":""v1""},""responseStatus"":{""metadata"":{},""code"":200},""requestObject"":{""kind"":""DeleteOptions"",""apiVersion"":""v1"",""propagationPolicy"":""Background""},
..."
```

要检索 Kubernetes API server 调用的 HTTP 响应代码计数，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

示例输出：

```

responseStatus.code,count200,35066
201,525
403,125
404,116
101,2
```

要查找 **kube-system** namespace 中对 DaemonSet/附加组件所做的更改，可以使用此示例查询：

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestamp desc
| limit 50
```

示例输出：

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "level": "RequestResponse", "auditID": "93e24148-0aa6-4166-8086-a689b0031612", "stage": "ResponseComplete", "requestURI": "/apis/apps/v1/namespaces/kube-system/daemonsets/aws-node?fieldManager=kubectl-set", "verb": "patch", "user": { "username": "kubernetes-admin", "groups": [ "system:masters", "system:authenticated" ] }, "userAgent": "kubectl/v1.22.2 (darwin/amd64) kubernetes/8b5a191", "objectRef": { "resource": "daemonsets", "namespace": "kube-system", "name": "aws-node", "apiGroup": "apps", "apiVersion": "v1" }, "requestObject": { "REDACTED": "REDACTED" }, "requestReceivedTimestamp": "2021-08-09T08:07:21.868376Z", "stageTimestamp": "2021-08-09T08:07:21.883489Z", "annotations": { "authorization.k8s.io/decision": "allow", "authorization.k8s.io/reason": "" } }
```

在此示例输出中，**kubernetes-admin** 用户使用 **kubectl** v1.22.2 对 **aws-node** DaemonSet 进行了 patch 操作。

要查找删除节点的用户，可以使用此示例查询：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/nodes"
| sort @timestamp desc
| limit 10
```

简化的示例输出：

```

@logStream,@timestamp,@messagekube-apiserver-audit-e503271cd443efdbd2050ae8ca0794eb,2022-03-25 07:26:55.661,"{"kind":"Event","
```

最后，如果您已开始使用控制平面日志记录功能，我们强烈建议您了解更多关于[理解和优化 Amazon EKS 控制平面日志成本](https://aws.amazon.com/blogs/containers/understanding-and-cost-optimizing-amazon-eks-control-plane-logs/)的内容。

### Amazon EKS 数据平面日志记录

我们建议您使用 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) 来捕获 Amazon EKS 的 logs 和 metrics。[Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) 使用 CloudWatch agent 实现 cluster、node 和 pod 级别的 metrics，并使用 [Fluent Bit](https://fluentbit.io/) 或 [Fluentd](https://www.fluentd.org/) 将日志捕获到 CloudWatch。Container Insights 还提供自动 dashboard，展示捕获的 CloudWatch metrics 的分层视图。Container Insights 部署为 CloudWatch DaemonSet 和 Fluent Bit DaemonSet，在每个 Amazon EKS 节点上运行。Fargate 节点不受 Container Insights 支持，因为这些节点由 AWS 管理且不支持 DaemonSet。Amazon EKS 的 Fargate 日志记录在本指南中单独介绍。

下表显示了 Amazon EKS 的[默认 Fluentd 或 Fluent Bit 日志捕获配置](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html)捕获的 CloudWatch 日志组和日志。

|`/aws/containerinsights/Cluster_Name/host`	|来自 `/var/log/dmesg`、`/var/log/secure` 和 `/var/log/messages` 的日志。	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|`/var/log/journal` 中 `kubelet.service`、`kubeproxy.service` 和 `docker.service` 的日志。	|

如果您不想使用 Container Insights 与 Fluent Bit 或 Fluentd 进行日志记录，可以使用安装在 Amazon EKS 节点上的 CloudWatch agent 捕获节点和容器日志。Amazon EKS 节点是 EC2 实例，这意味着您应将它们纳入 Amazon EC2 的标准系统级日志记录方案。如果您使用 Distributor 和 State Manager 安装 CloudWatch agent，则 Amazon EKS 节点也将包含在 CloudWatch agent 的安装、配置和更新中。下表显示了如果不使用 Container Insights 与 Fluent Bit 或 Fluentd 进行日志记录时必须捕获的 Kubernetes 特定日志。


|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|L-IPAM daemon 的日志可在此处找到	|
|---	|---	|

请参考 [Amazon EKS 节点日志记录规范性指南](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html)了解更多关于数据平面日志记录的信息。

### Amazon EKS 应用程序日志记录

在 Kubernetes 环境中大规模运行应用程序时，Amazon EKS 应用程序日志记录变得不可或缺。要收集应用程序日志，您必须在 Amazon EKS 集群中安装日志聚合器，如 [Fluent Bit](https://fluentbit.io/)、[Fluentd](https://www.fluentd.org/) 或 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)。

[Fluent Bit](https://fluentbit.io/) 是一个用 C++ 编写的开源日志处理器和转发器，这意味着您可以从不同来源收集数据，通过过滤器进行丰富，并将它们发送到多个目标（包括 CloudWatch Logs）。通过使用本指南的解决方案，您可以启用 `aws-for-fluent-bit` 或 `fargate-fluentbit` 进行日志记录。[Fluentd](https://www.fluentd.org/) 是一个用 Ruby 编写的开源数据收集器，用于统一日志层。Fluentd 作为统一日志层，可以聚合来自多个来源的数据，将不同格式的数据统一为 JSON 格式的对象，并将它们路由到不同的输出目标。选择日志收集器对于监控数千台服务器时的 CPU 和内存利用率非常重要。如果您有多个 Amazon EKS 集群，可以使用 Fluent Bit 作为轻量级传送器从集群中的不同节点收集数据，并将其转发到 Fluentd 进行聚合、处理和路由到支持的输出目标。

我们建议使用 Fluent Bit 作为日志收集器和转发器，将应用程序和集群日志发送到 CloudWatch。然后，您可以使用 CloudWatch 中的订阅过滤器将日志流式传输到 Amazon OpenSearch Service。此选项在本节的架构图中展示。

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*图：Amazon EKS 应用程序日志记录架构。*

该图展示了当来自 Amazon EKS 集群的应用程序日志流式传输到 Amazon OpenSearch Service 时的工作流程。Amazon EKS 集群中的 Fluent Bit 服务将日志推送到 CloudWatch。AWS Lambda 函数使用订阅过滤器将日志流式传输到 Amazon OpenSearch Service。然后您可以使用 Kibana 在配置的索引中可视化日志。您还可以使用 Amazon Kinesis Data Firehose 流式传输日志，并将它们存储在 S3 存储桶中，以便使用 [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) 进行分析和查询。

在大多数集群中，使用 Fluentd 或 Fluent Bit 进行日志聚合几乎不需要优化。当您处理拥有数千个 pod 和节点的大型集群时，情况会有所不同。我们已发布了关于[在拥有数千个 pod 的集群中 Fluentd 和 Fluent Bit 影响](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/)的研究结果。如需进一步了解，我们建议您查看[Fluent Bit 的增强功能，旨在减少](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/)其对 Kubernetes API server 的 API 调用量，该功能使用 *Use_Kubelet* 选项。Fluent Bit 的 `Use_Kubelet` 功能允许它从主机上的 kubelet 检索 pod 元数据。Amazon EKS 客户可以使用 Fluent Bit 在启用此功能的情况下捕获运行数万个 pod 的集群中的日志，而不会过载 Kubernetes API server。即使您没有运行大型 Kubernetes 集群，我们也建议启用此功能。

#### Amazon EKS on Fargate 的日志记录

使用 Amazon EKS on Fargate，您可以在不分配或管理 Kubernetes 节点的情况下部署 pod。这消除了为 Kubernetes 节点捕获系统级日志的需要。要捕获 Fargate pod 的日志，您可以使用 Fluent Bit 将日志直接转发到 CloudWatch。这使您能够自动将日志路由到 CloudWatch，而无需进一步配置或为 Fargate 上的 Amazon EKS pod 使用 sidecar 容器。有关此的更多信息，请参阅 Amazon EKS 文档中的 [Fargate 日志记录](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)和 AWS 博客上的 [Fluent Bit for Amazon EKS](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/)。此解决方案从容器捕获 `STDOUT` 和 `STDERR` 输入/输出 (I/O) 流，并根据为 Fargate 上的 Amazon EKS 集群建立的 Fluent Bit 配置通过 Fluent Bit 将它们发送到 CloudWatch。

借助 Fluent Bit 对 Amazon EKS 的支持，您不再需要运行 sidecar 来从运行在 Fargate 上的 Amazon EKS pod 路由容器日志。使用新的内置日志支持，您可以选择目标来发送记录。Amazon EKS on Fargate 使用 AWS 版本的 Fluent Bit，这是由 AWS 管理的上游一致性 Fluent Bit 发行版。

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*图：Amazon EKS on Fargate 的日志记录。*

请参阅 Amazon EKS 文档中的 [Fargate 日志记录](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)了解更多关于 Fluent Bit 对 Amazon EKS 支持的信息。

在某些情况下，对于在 AWS Fargate 上运行的 pod，您需要使用 sidecar 模式。您可以运行 Fluentd（或 [Fluent Bit](http://fluentbit.io/)）sidecar 容器来捕获应用程序产生的日志。此选项要求应用程序将日志写入文件系统而不是 `stdout` 或 `stderr`。这种方法的结果是您将无法使用 `kubectl` logs 查看容器日志。要使日志出现在 `kubectl logs` 中，您可以同时将应用程序日志写入 `stdout` 和文件系统。

[Fargate 上的 Pod 获得 20GB 的临时存储](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html)，可供属于某个 pod 的所有容器使用。您可以配置应用程序将日志写入本地文件系统，并指示 Fluentd 监视日志目录（或文件）。Fluentd 将从日志文件尾部读取事件，并将事件发送到目标（如 CloudWatch）进行存储。确保定期轮换日志以防止日志占用整个卷。

请了解更多关于[在 AWS Fargate 上使用 Amazon EKS 时如何捕获应用程序日志](https://aws.amazon.com/blogs/containers/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/)的信息，以在 AWS Fargate 上大规模操作和观察 Kubernetes 应用程序。在这种方法中，我们还将使用 `tee` 同时写入文件和 `stdout`，以便在 `kubectl logs` 中看到日志。

### 使用 AWS 原生服务从 Amazon EKS 和其他计算平台进行统一日志聚合

如今，客户希望使用 agent、日志路由器和扩展来统一和集中来自不同计算平台的日志，这些平台包括 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS)、[Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) 和 [AWS Lambda](https://aws.amazon.com/lambda/)。然后我们可以使用 [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) 与 OpenSearch Dashboards 来可视化和分析从不同计算平台收集的日志，以获取应用程序洞察。

统一聚合日志系统提供以下优势：

* 跨不同计算平台的所有日志的单一访问点
* 帮助定义和标准化日志在传递到下游系统（如 [Amazon Simple Storage Service](http://aws.amazon.com/s3) (Amazon S3)、Amazon OpenSearch Service、[Amazon Redshift](https://aws.amazon.com/redshift/) 等服务）之前的转换
* 能够使用 Amazon OpenSearch Service 快速索引，并使用 OpenSearch Dashboards 搜索和可视化来自路由器、应用程序和其他设备的日志

下图展示了跨不同计算平台（如 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS) 和 [AWS Lambda](https://aws.amazon.com/lambda/)）执行日志聚合的架构。

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*图：跨不同计算平台的日志聚合。*

该架构使用各种日志聚合工具（如日志 agent、日志路由器和 Lambda 扩展）从多个计算平台收集日志并将它们传递到 Kinesis Data Firehose。Kinesis Data Firehose 将日志流式传输到 Amazon OpenSearch Service。未能持久化到 Amazon OpenSearch Service 的日志记录将被写入 AWS S3。为了扩展此架构，每个计算平台将日志流式传输到不同的 Firehose 传输流，作为单独的索引添加，每 24 小时轮换一次。

如需进一步了解，请查看[如何跨不同计算平台统一和集中日志](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/)，这些平台包括 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS) 和 [AWS Lambda](https://aws.amazon.com/lambda/)，使用 Kinesis Data Firehose 和 Amazon OpenSearch Service。这种方法允许您快速分析日志和故障根因，使用单一平台而不是针对不同服务使用不同平台。

## 结论

在可观测性最佳实践指南的这一部分中，我们首先深入了解了 Kubernetes 日志记录的三种类型：控制平面日志记录、节点日志记录和应用程序日志记录。此外，我们还了解了如何使用 AWS 原生服务（如 Kinesis Data Firehose 和 Amazon OpenSearch Service）从 Amazon EKS 和其他计算平台进行统一日志聚合。如需进一步深入了解，我们强烈建议您在 AWS [https://catalog.workshops.aws/observability/en-US](https://catalog.workshops.aws/observability/en-US) 的 AWS 原生可观测性类别下练习 Logs 和 Insights 模块。
