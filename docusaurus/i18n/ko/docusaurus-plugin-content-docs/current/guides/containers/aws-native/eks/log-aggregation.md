# 로그 집계

Observability 모범 사례 가이드의 이 섹션에서는 AWS 네이티브 서비스를 사용한 Amazon EKS 로깅과 관련된 다음 주제를 심층적으로 다룹니다:

* AWS EKS 로깅 소개
* Amazon EKS 컨트롤 플레인 로깅
* Amazon EKS 데이터 플레인 로깅
* Amazon EKS 애플리케이션 로깅
* AWS 네이티브 서비스를 사용한 Amazon EKS 및 기타 컴퓨팅 플랫폼의 통합 로그 집계
* 결론

### 소개

Amazon EKS 로깅은 컨트롤 플레인 로깅, 노드 로깅, 애플리케이션 로깅의 세 가지 유형으로 나눌 수 있습니다. [Kubernetes 컨트롤 플레인](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)은 Kubernetes 클러스터를 관리하고 감사 및 진단 목적으로 사용되는 로그를 생성하는 컴포넌트 세트입니다. Amazon EKS를 사용하면 [다양한 컨트롤 플레인 컴포넌트에 대한 로그를 활성화](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)하고 CloudWatch로 전송할 수 있습니다.

Kubernetes는 또한 파드를 실행하는 각 Kubernetes 노드에서 `kubelet`과 `kube-proxy`와 같은 시스템 컴포넌트를 실행합니다. 이러한 컴포넌트는 각 노드 내에서 로그를 기록하며, CloudWatch와 Container Insights를 구성하여 각 Amazon EKS 노드에 대한 이러한 로그를 캡처할 수 있습니다.

컨테이너는 Kubernetes 클러스터 내에서 [파드](https://kubernetes.io/docs/concepts/workloads/pods/)로 그룹화되며 Kubernetes 노드에서 실행되도록 예약됩니다. 대부분의 컨테이너화된 애플리케이션은 표준 출력과 표준 에러에 기록하며, 컨테이너 엔진은 출력을 로깅 드라이버로 리디렉션합니다. Kubernetes에서 컨테이너 로그는 노드의 `/var/log/pods` 디렉토리에서 찾을 수 있습니다. CloudWatch와 Container Insights를 구성하여 각 Amazon EKS 파드에 대한 이러한 로그를 캡처할 수 있습니다.

Kubernetes에서 컨테이너 로그를 중앙 집중식 로그 집계 시스템으로 보내는 세 가지 일반적인 접근 방식이 있습니다:

* [Fluentd 데몬셋](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html)과 같은 노드 수준 에이전트. 이것이 권장되는 패턴입니다.
* Fluentd 사이드카 컨테이너와 같은 사이드카 컨테이너.
* 로그 수집 시스템에 직접 쓰기. 이 접근 방식에서는 애플리케이션이 로그 전송을 담당합니다. 로그 집계 시스템의 SDK를 애플리케이션 코드에 포함해야 하므로 Fluentd와 같은 커뮤니티 구축 솔루션을 재사용하는 대신 가장 권장되지 않는 옵션입니다. 이 패턴은 또한 로깅 구현이 애플리케이션과 독립적이어야 한다는 *관심사 분리 원칙*을 위반합니다. 이렇게 하면 애플리케이션을 영향 주거나 변경하지 않고 로깅 인프라를 변경할 수 있습니다.

이제 통합 로그 집계에 대해 이야기하면서 Amazon EKS 로깅의 각 카테고리를 살펴보겠습니다.

### Amazon EKS 컨트롤 플레인 로깅

Amazon EKS 클러스터는 Kubernetes 클러스터를 위한 고가용성 단일 테넌트 컨트롤 플레인과 컨테이너를 실행하는 Amazon EKS 노드로 구성됩니다. 컨트롤 플레인 노드는 AWS에서 관리하는 계정에서 실행됩니다. Amazon EKS 클러스터 컨트롤 플레인 노드는 CloudWatch와 통합되어 있으며 특정 컨트롤 플레인 컴포넌트에 대한 로깅을 켤 수 있습니다. 로그는 각 Kubernetes 컨트롤 플레인 컴포넌트 인스턴스에 대해 제공됩니다. AWS가 컨트롤 플레인 노드의 상태를 관리하고 Kubernetes 엔드포인트에 대한 [서비스 수준 계약(SLA)](http://aws.amazon.com/eks/sla/)을 제공합니다.

[Amazon EKS 컨트롤 플레인 로깅](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)은 다음 클러스터 컨트롤 플레인 로그 유형으로 구성됩니다. 각 로그 유형은 Kubernetes 컨트롤 플레인의 컴포넌트에 해당합니다. 이러한 컴포넌트에 대해 자세히 알아보려면 Kubernetes 문서의 [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)를 참조하세요.

* **API server(`api`)** – 클러스터의 API 서버는 Kubernetes API를 노출하는 컨트롤 플레인 컴포넌트입니다. 클러스터를 시작할 때 또는 그 직후에 API 서버 로그를 활성화하면, 로그에는 API 서버를 시작하는 데 사용된 API 서버 플래그가 포함됩니다. 자세한 내용은 Kubernetes 문서의 [`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)와 [audit policy](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255)를 참조하세요.
* **Audit(`audit`)** – Kubernetes 감사 로그는 클러스터에 영향을 미친 개별 사용자, 관리자 또는 시스템 컴포넌트의 기록을 제공합니다. 자세한 내용은 Kubernetes 문서의 [Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)을 참조하세요.
* **Authenticator(`authenticator`)** – Authenticator 로그는 Amazon EKS에 고유합니다. 이러한 로그는 Amazon EKS가 IAM 자격 증명을 사용하여 Kubernetes [역할 기반 접근 제어](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)(RBAC) 인증에 사용하는 컨트롤 플레인 컴포넌트를 나타냅니다. 자세한 내용은 [클러스터 관리](https://docs.aws.amazon.com/eks/latest/userguide/eks-managing.html)를 참조하세요.
* **Controller manager(`controllerManager`)** – 컨트롤러 관리자는 Kubernetes와 함께 제공되는 핵심 컨트롤 루프를 관리합니다. 자세한 내용은 Kubernetes 문서의 [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)를 참조하세요.
* **Scheduler(`scheduler`)** – 스케줄러 컴포넌트는 클러스터에서 파드를 언제, 어디서 실행할지 관리합니다. 자세한 내용은 Kubernetes 문서의 [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)를 참조하세요.

[컨트롤 플레인 로그 활성화 및 비활성화](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#:~:text=the%20Kubernetes%20documentation.-,Enabling%20and%20disabling%20control%20plane%20logs,-By%20default%2C%20cluster) 섹션을 따라 AWS 콘솔 또는 AWS CLI를 통해 컨트롤 플레인 로그를 활성화하세요.

#### CloudWatch 콘솔에서 컨트롤 플레인 로그 쿼리

Amazon EKS 클러스터에서 컨트롤 플레인 로깅을 활성화하면 `/aws/eks/cluster-name/cluster` 로그 그룹에서 EKS 컨트롤 플레인 로그를 찾을 수 있습니다. 자세한 내용은 [클러스터 컨트롤 플레인 로그 보기](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#viewing-control-plane-logs)를 참조하세요. `cluster-name`을 클러스터 이름으로 바꾸세요.

CloudWatch Logs Insights를 사용하여 EKS 컨트롤 플레인 로그 데이터를 검색할 수 있습니다. 자세한 내용은 [CloudWatch Insights로 로그 데이터 분석](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)을 참조하세요. CloudWatch Logs에서 로그 이벤트를 확인하려면 먼저 클러스터에서 컨트롤 플레인 로깅을 켜야 합니다. CloudWatch Logs Insights에서 쿼리를 실행할 시간 범위를 선택하기 전에 컨트롤 플레인 로깅을 활성화했는지 확인하세요. 아래 스크린샷은 EKS 컨트롤 플레인 로그 쿼리와 쿼리 출력의 예시를 보여줍니다.

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*그림: CloudWatch Logs Insights.*

#### CloudWatch Logs Insights의 일반적인 EKS 사용 사례를 위한 샘플 쿼리

클러스터 생성자를 찾으려면 **kubernetes-admin** 사용자에 매핑된 IAM 엔터티를 검색합니다.

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

출력 예시:

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

이 출력에서 IAM 사용자 **arn:aws:iam::[12345678910](tel:12345678910):user/awscli**가 사용자 **kubernetes-admin**에 매핑되어 있습니다.

특정 사용자가 수행한 요청을 찾으려면 **kubernetes-admin** 사용자가 수행한 작업을 검색합니다.

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

출력 예시:

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500"";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

특정 userAgent가 만든 API 호출을 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

축약된 출력 예시:

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

**aws-auth** ConfigMap에 대한 변경 사항을 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

거부된 요청을 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

파드가 예약된 노드를 찾으려면 **kube-scheduler** 로그를 쿼리합니다.

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

HTTP 5xx 서버 오류를 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

Kubernetes API 서버에 대한 호출의 HTTP 응답 코드 수를 검색하려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

**kube-system** 네임스페이스에서 DaemonSets/애드온에 대한 변경 사항을 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestamp desc
| limit 50
```

노드를 삭제한 사용자를 찾으려면 다음 예시 쿼리를 사용할 수 있습니다:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/nodes"
| sort @timestamp desc
| limit 10
```

마지막으로, 컨트롤 플레인 로깅 기능을 사용하기 시작했다면 [Amazon EKS 컨트롤 플레인 로그 이해 및 비용 최적화](https://aws.amazon.com/blogs/containers/understanding-and-cost-optimizing-amazon-eks-control-plane-logs/)에 대해 더 자세히 알아보시기를 적극 권장합니다.

### Amazon EKS 데이터 플레인 로깅

Amazon EKS의 로그 및 메트릭을 캡처하려면 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html)를 사용하는 것이 좋습니다. [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)는 CloudWatch 에이전트로 클러스터, 노드, 파드 수준 메트릭을 구현하고, [Fluent Bit](https://fluentbit.io/) 또는 [Fluentd](https://www.fluentd.org/)로 CloudWatch에 로그 캡처를 수행합니다. Container Insights는 또한 캡처된 CloudWatch 메트릭의 계층화된 뷰를 제공하는 자동 대시보드를 제공합니다. Container Insights는 모든 Amazon EKS 노드에서 실행되는 CloudWatch DaemonSet과 Fluent Bit DaemonSet으로 배포됩니다. Fargate 노드는 AWS에서 관리하고 DaemonSet을 지원하지 않기 때문에 Container Insights에서 지원되지 않습니다. Amazon EKS용 Fargate 로깅은 이 가이드에서 별도로 다룹니다.

다음 표는 Amazon EKS용 [기본 Fluentd 또는 Fluent Bit 로그 캡처 구성](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html)에 의해 캡처되는 CloudWatch 로그 그룹과 로그를 보여줍니다.

|`/aws/containerinsights/Cluster_Name/host`	|`/var/log/dmesg`, `/var/log/secure`, `/var/log/messages`의 로그.	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|`kubelet.service`, `kubeproxy.service`, `docker.service`에 대한 `/var/log/journal`의 로그.	|

로깅을 위해 Fluent Bit 또는 Fluentd가 포함된 Container Insights를 사용하지 않으려면 Amazon EKS 노드에 설치된 CloudWatch 에이전트로 노드 및 컨테이너 로그를 캡처할 수 있습니다. Amazon EKS 노드는 EC2 인스턴스이므로 Amazon EC2에 대한 표준 시스템 수준 로깅 접근 방식에 포함해야 합니다.

|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|L-IPAM 데몬의 로그가 여기에 있습니다	|
|---	|---	|

데이터 플레인 로깅에 대해 자세히 알아보려면 [Amazon EKS 노드 로깅 규범적 지침](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html)을 참조하세요.

### Amazon EKS 애플리케이션 로깅

Kubernetes 환경에서 대규모로 애플리케이션을 실행할 때 Amazon EKS 애플리케이션 로깅은 필수적입니다. 애플리케이션 로그를 수집하려면 Amazon EKS 클러스터에 [Fluent Bit](https://fluentbit.io/), [Fluentd](https://www.fluentd.org/) 또는 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)와 같은 로그 수집기를 설치해야 합니다.

[Fluent Bit](https://fluentbit.io/)는 C++로 작성된 오픈 소스 로그 프로세서 및 포워더로, 다양한 소스에서 데이터를 수집하고 필터로 보강한 후 CloudWatch를 포함한 여러 대상으로 전송할 수 있습니다. [Fluentd](https://www.fluentd.org/)는 Ruby로 작성된 통합 로깅 계층을 위한 오픈 소스 데이터 수집기입니다. 수천 대의 서버를 모니터링할 때 CPU 및 메모리 사용률 측면에서 로그 수집기를 선택하는 것이 중요합니다. 여러 Amazon EKS 클러스터가 있는 경우 Fluent Bit를 경량 전송자로 사용하여 클러스터의 다양한 노드에서 데이터를 수집하고 Fluentd로 전달하여 집계, 처리 및 지원되는 출력 대상으로 라우팅할 수 있습니다.

애플리케이션 및 클러스터 로그를 CloudWatch로 전송하는 로그 수집기 및 포워더로 Fluent Bit를 사용하는 것이 좋습니다. 그런 다음 CloudWatch의 구독 필터를 사용하여 로그를 Amazon OpenSearch Service로 스트리밍할 수 있습니다. 이 옵션은 이 섹션의 아키텍처 다이어그램에 표시되어 있습니다.

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*그림: Amazon EKS 애플리케이션 로깅 아키텍처.*

이 다이어그램은 Amazon EKS 클러스터의 애플리케이션 로그가 Amazon OpenSearch Service로 스트리밍될 때의 워크플로를 보여줍니다. Amazon EKS 클러스터의 Fluent Bit 서비스가 로그를 CloudWatch로 푸시합니다. AWS Lambda 함수가 구독 필터를 사용하여 로그를 Amazon OpenSearch Service로 스트리밍합니다. 그런 다음 Kibana를 사용하여 구성된 인덱스의 로그를 시각화할 수 있습니다. Amazon Kinesis Data Firehose를 사용하여 로그를 스트리밍하고 [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)로 분석 및 쿼리하기 위해 S3 버킷에 저장할 수도 있습니다.

대부분의 클러스터에서 로그 집계를 위한 Fluentd 또는 Fluent Bit 사용은 최적화가 거의 필요 없습니다. 수천 개의 파드와 노드가 있는 대규모 클러스터를 다룰 때는 상황이 달라집니다. [수천 개의 파드가 있는 클러스터에서 Fluentd와 Fluent Bit의 영향](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/)을 연구한 결과를 공개했습니다. 추가 학습을 위해 *Use_Kubelet* 옵션을 사용하여 Kubernetes API 서버에 대한 [API 호출 볼륨을 줄이도록 설계된 Fluent Bit 개선 사항](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/)을 확인하시는 것이 좋습니다. Fluent Bit의 `Use_Kubelet` 기능은 호스트의 kubelet에서 파드 메타데이터를 검색할 수 있게 합니다. Amazon EKS 고객은 이 기능을 활성화하여 Kubernetes API 서버를 과부하시키지 않으면서 수만 개의 파드를 실행하는 클러스터에서 로그를 캡처할 수 있습니다. 대규모 Kubernetes 클러스터를 실행하지 않더라도 이 기능을 활성화하는 것이 좋습니다.

#### Amazon EKS on Fargate 로깅

Amazon EKS on Fargate를 사용하면 Kubernetes 노드를 할당하거나 관리하지 않고도 파드를 배포할 수 있습니다. 이를 통해 Kubernetes 노드에 대한 시스템 수준 로그를 캡처할 필요가 없어집니다. Fargate 파드에서 로그를 캡처하려면 Fluent Bit를 사용하여 로그를 CloudWatch로 직접 전달할 수 있습니다. 이를 통해 추가 구성이나 사이드카 컨테이너 없이도 Fargate의 Amazon EKS 파드에 대한 로그를 자동으로 라우팅할 수 있습니다. 자세한 내용은 Amazon EKS 문서의 [Fargate 로깅](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)과 AWS 블로그의 [Amazon EKS용 Fluent Bit](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/)를 참조하세요.

Amazon EKS on Fargate의 Fluent Bit 지원을 통해 Fargate에서 실행되는 Amazon EKS 파드의 컨테이너 로그를 라우팅하기 위해 더 이상 사이드카를 실행할 필요가 없습니다. 새로운 내장 로깅 지원을 통해 레코드를 전송할 대상을 선택할 수 있습니다. Amazon EKS on Fargate는 AWS에서 관리하는 업스트림 호환 Fluent Bit 배포판인 AWS용 Fluent Bit 버전을 사용합니다.

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*그림: Amazon EKS on Fargate 로깅.*

Amazon EKS on Fargate의 Fluent Bit 지원에 대해 자세히 알아보려면 Amazon EKS 문서의 [Fargate 로깅](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)을 참조하세요.

일부 경우 AWS Fargate에서 실행되는 파드에 사이드카 패턴을 사용해야 할 때가 있습니다. Fluentd(또는 [Fluent Bit](http://fluentbit.io/)) 사이드카 컨테이너를 실행하여 애플리케이션에서 생성되는 로그를 캡처할 수 있습니다. 이 옵션은 애플리케이션이 `stdout`이나 `stderr` 대신 파일 시스템에 로그를 기록해야 합니다. 이 접근 방식의 결과로 `kubectl` logs를 사용하여 컨테이너 로그를 볼 수 없게 됩니다. `kubectl logs`에 로그가 표시되도록 하려면 애플리케이션 로그를 `stdout`과 파일 시스템 모두에 동시에 기록할 수 있습니다.

[Fargate의 파드는 20GB의 임시 스토리지를 받으며](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html), 이는 파드에 속한 모든 컨테이너에서 사용할 수 있습니다. 애플리케이션이 로컬 파일 시스템에 로그를 기록하도록 구성하고 Fluentd에 로그 디렉토리(또는 파일)를 감시하도록 지시할 수 있습니다. Fluentd는 로그 파일의 끝에서 이벤트를 읽고 CloudWatch와 같은 대상으로 이벤트를 전송합니다. 로그가 전체 볼륨을 차지하는 것을 방지하기 위해 정기적으로 로그를 순환하도록 해야 합니다.

AWS Fargate에서 Kubernetes 애플리케이션을 대규모로 운영하고 관찰하기 위해 [Amazon EKS on AWS Fargate를 사용할 때 애플리케이션 로그를 캡처하는 방법](https://aws.amazon.com/blogs/containers/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/)에 대해 자세히 알아보세요.

### AWS 네이티브 서비스를 사용한 Amazon EKS 및 기타 컴퓨팅 플랫폼의 통합 로그 집계

오늘날 고객들은 에이전트, 로그 라우터, 확장을 사용하여 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/)(Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/)(Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/)(Amazon ECS), [Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/), [AWS Lambda](https://aws.amazon.com/lambda/)와 같은 서로 다른 컴퓨팅 플랫폼에서 로그를 통합하고 중앙화하고자 합니다. 그런 다음 [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/)와 OpenSearch 대시보드를 사용하여 다양한 컴퓨팅 플랫폼에서 수집된 로그를 시각화하고 분석하여 애플리케이션 인사이트를 얻을 수 있습니다.

통합 집계 로그 시스템은 다음과 같은 이점을 제공합니다:

* 다양한 컴퓨팅 플랫폼의 모든 로그에 대한 단일 접근 지점
* [Amazon Simple Storage Service](http://aws.amazon.com/s3)(Amazon S3), Amazon OpenSearch Service, [Amazon Redshift](https://aws.amazon.com/redshift/) 및 기타 서비스와 같은 다운스트림 시스템에 전달되기 전에 로그의 변환을 정의하고 표준화하는 데 도움
* Amazon OpenSearch Service를 사용하여 로그를 빠르게 인덱싱하고 OpenSearch 대시보드를 사용하여 라우터, 애플리케이션 및 기타 장치의 로그를 검색하고 시각화하는 기능

다음 다이어그램은 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/)(Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/)(Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/)(Amazon ECS), [AWS Lambda](https://aws.amazon.com/lambda/)와 같은 다양한 컴퓨팅 플랫폼에서 로그 집계를 수행하는 아키텍처를 보여줍니다.

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*그림: 다양한 컴퓨팅 플랫폼에서의 로그 집계.*

이 아키텍처는 로그 에이전트, 로그 라우터, Lambda 확장과 같은 다양한 로그 집계 도구를 사용하여 여러 컴퓨팅 플랫폼에서 로그를 수집하고 Kinesis Data Firehose로 전달합니다. Kinesis Data Firehose는 로그를 Amazon OpenSearch Service로 스트리밍합니다. Amazon OpenSearch Service에 유지되지 못한 로그 레코드는 AWS S3에 기록됩니다. 이 아키텍처를 확장하기 위해 각 컴퓨팅 플랫폼은 서로 다른 Firehose 전송 스트림으로 로그를 스트리밍하며, 별도의 인덱스로 추가되고 24시간마다 순환됩니다.

추가 학습을 위해 Kinesis Data Firehose와 Amazon OpenSearch Service를 사용하여 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/)(Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/)(Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/)(Amazon ECS), [AWS Lambda](https://aws.amazon.com/lambda/)와 같은 다양한 컴퓨팅 플랫폼에서 [로그를 통합하고 중앙화하는 방법](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/)을 확인하세요. 이 접근 방식을 통해 서로 다른 서비스에 대해 서로 다른 플랫폼을 사용하는 대신 단일 플랫폼을 사용하여 로그를 빠르게 분석하고 실패의 근본 원인을 파악할 수 있습니다.

## 결론

Observability 모범 사례 가이드의 이 섹션에서는 컨트롤 플레인 로깅, 노드 로깅, 애플리케이션 로깅의 세 가지 유형의 Kubernetes 로깅에 대해 심층적으로 다루었습니다. 또한 Kinesis Data Firehose와 Amazon OpenSearch Service와 같은 AWS 네이티브 서비스를 사용한 Amazon EKS 및 기타 컴퓨팅 플랫폼의 통합 로그 집계에 대해 배웠습니다. 추가적인 심층 학습을 위해 AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US)의 AWS native Observability 카테고리에 있는 Logs and Insights 모듈을 실습하시는 것을 적극 권장합니다.
