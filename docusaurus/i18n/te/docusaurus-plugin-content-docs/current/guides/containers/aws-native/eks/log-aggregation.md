# Log Aggregation

Observability best practices guide యొక్క ఈ విభాగంలో, AWS Native services తో Amazon EKS Logging కు సంబంధించిన ఈ క్రింది అంశాలలో లోతుగా అధ్యయనం చేద్దాం:

* AWS EKS logging పరిచయం
* Amazon EKS control plane logging
* Amazon EKS data plane logging
* Amazon EKS application logging
* AWS Native services ఉపయోగించి Amazon EKS మరియు ఇతర compute platforms నుండి Unified log aggregation
* ముగింపు

### పరిచయం

Amazon EKS logging ను control plane logging, node logging, మరియు application logging అనే మూడు types గా విభజించవచ్చు. [Kubernetes control plane](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components) అనేది Kubernetes clusters నిర్వహించే మరియు auditing మరియు diagnostic purposes కోసం ఉపయోగించే logs produce చేసే components set. Amazon EKS తో, మీరు వివిధ control plane components కోసం [logs turn on చేయవచ్చు](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) మరియు వాటిని CloudWatch కు పంపవచ్చు.

Kubernetes మీ pods నడిపే ప్రతి Kubernetes node పై `kubelet` మరియు `kube-proxy` వంటి system components కూడా నడుపుతుంది. ఈ components ప్రతి node లో logs రాస్తాయి మరియు ప్రతి Amazon EKS node కోసం ఈ logs capture చేయడానికి CloudWatch మరియు Container Insights configure చేయవచ్చు.

Containers Kubernetes cluster లో [pods](https://kubernetes.io/docs/concepts/workloads/pods/) గా group చేయబడతాయి మరియు మీ Kubernetes nodes పై run అయ్యేలా schedule చేయబడతాయి. చాలా containerized applications standard output మరియు standard error కు రాస్తాయి, మరియు container engine output ను logging driver కు redirect చేస్తుంది. Kubernetes లో, container logs node పై `/var/log/pods` directory లో కనుగొనవచ్చు. మీ ప్రతి Amazon EKS pods కోసం ఈ logs capture చేయడానికి CloudWatch మరియు Container Insights configure చేయవచ్చు.

Kubernetes లో centralized log aggregation system కు container logs ship చేయడానికి మూడు సాధారణ approaches ఉన్నాయి:

* Node level agent, [Fluentd daemonset](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) వంటిది. ఇది సిఫార్సు చేయబడిన pattern.
* Sidecar container, Fluentd sidecar container వంటిది.
* Log collection system కు నేరుగా రాయడం. ఈ approach లో, logs ship చేయడానికి application బాధ్యత వహిస్తుంది. ఇది అత్యంత తక్కువ సిఫార్సు చేయబడే option ఎందుకంటే Fluentd వంటి community build solutions reuse చేయడం బదులు మీ application code లో log aggregation system SDK include చేయాలి. ఈ pattern *principle of separation of concerns* ను కూడా ఉల్లంఘిస్తుంది, దీని ప్రకారం logging implementation application నుండి independent గా ఉండాలి. ఇలా చేయడం వల్ల మీ application మార్చకుండా logging infrastructure మార్చవచ్చు.

ఇప్పుడు Amazon EKS logging కోసం ఈ ప్రతి logging categories లో లోతుగా చూద్దాం, Amazon EKS మరియు ఇతర compute platforms నుండి unified log aggregation గురించి కూడా మాట్లాడుతాం.

### Amazon EKS control plane logging

Amazon EKS cluster మీ Kubernetes cluster కోసం high availability, single-tenant control plane మరియు మీ containers నడిపే Amazon EKS nodes కలిగి ఉంటుంది. Control plane nodes AWS నిర్వహించే account లో నడుస్తాయి. Amazon EKS cluster control plane nodes CloudWatch తో integrated చేయబడ్డాయి మరియు మీరు specific control plane components కోసం logging turn on చేయవచ్చు. Logs ప్రతి Kubernetes control plane component instance కోసం అందించబడతాయి. AWS మీ control plane nodes health నిర్వహిస్తుంది మరియు Kubernetes endpoint కోసం [service-level agreement (SLA)](http://aws.amazon.com/eks/sla/) అందిస్తుంది.

[Amazon EKS control plane logging](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) ఈ క్రింది cluster control plane log types కలిగి ఉంటుంది. ప్రతి log type Kubernetes control plane component కు correspond అవుతుంది. ఈ components గురించి మరింత తెలుసుకోవడానికి, Kubernetes documentation లో [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/) చూడండి.

* **API server (`api`)** – మీ cluster API server Kubernetes API expose చేసే control plane component. మీరు cluster launch చేసేటప్పుడు లేదా కొద్దిసేపు తర్వాత API server logs enable చేస్తే, API server start చేయడానికి ఉపయోగించిన API server flags logs లో ఉంటాయి. మరింత సమాచారం కోసం, Kubernetes documentation లో [`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) మరియు [audit policy](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255) చూడండి.
* **Audit (`audit`)** – Kubernetes audit logs మీ cluster ను ప్రభావితం చేసిన individual users, administrators, లేదా system components record అందిస్తాయి. మరింత సమాచారం కోసం, Kubernetes documentation లో [Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) చూడండి.
* **Authenticator (`authenticator`)** – Authenticator logs Amazon EKS కు unique. ఈ logs IAM credentials ఉపయోగించి Kubernetes [Role Based Access Control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) authentication కోసం Amazon EKS ఉపయోగించే control plane component ను represent చేస్తాయి. మరింత సమాచారం కోసం, [Cluster management](https://docs.aws.amazon.com/eks/latest/userguide/eks-managing.html) చూడండి.
* **Controller manager (`controllerManager`)** – Controller manager Kubernetes తో ship చేయబడే core control loops నిర్వహిస్తుంది. మరింత సమాచారం కోసం, Kubernetes documentation లో [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) చూడండి.
* **Scheduler (`scheduler`)** – Scheduler component మీ cluster లో pods ఎప్పుడు మరియు ఎక్కడ run చేయాలో manage చేస్తుంది. మరింత సమాచారం కోసం, Kubernetes documentation లో [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) చూడండి.

దయచేసి [enabling and disabling control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#:~:text=the%20Kubernetes%20documentation.-,Enabling%20and%20disabling%20control%20plane%20logs,-By%20default%2C%20cluster) section follow చేసి AWS console లేదా AWS CLI ద్వారా control plane logs enable చేయండి.

#### CloudWatch console నుండి control plane logs query చేయడం

మీ Amazon EKS cluster పై control plane logging enable చేసిన తర్వాత, `/aws/eks/cluster-name/cluster` log group లో EKS control plane logs కనుగొనవచ్చు. మరింత సమాచారం కోసం, [Viewing cluster control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#viewing-control-plane-logs) చూడండి. దయచేసి `cluster-name` ను మీ cluster name తో replace చేయండి.

EKS control plane log data search చేయడానికి CloudWatch Logs Insights ఉపయోగించవచ్చు. మరింత సమాచారం కోసం, [Analyzing log data with CloudWatch Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) చూడండి. Cluster లో control plane logging turn on చేసిన తర్వాత మాత్రమే CloudWatch Logs లో log events చూడవచ్చని గమనించడం ముఖ్యం. CloudWatch Logs Insights లో queries run చేయడానికి time range select చేయడానికి ముందు, cluster లో control plane logging turn on చేశారని verify చేయండి. EKS control plane log query యొక్క ఉదాహరణ query output తో క్రింద screenshot చూడండి.

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*Figure: CloudWatch Logs Insights.*

#### CloudWatch Logs Insights పై సాధారణ EKS use cases కోసం Sample queries

Cluster creator కనుగొనడానికి, **kubernetes-admin** user కు map చేయబడిన IAM entity కోసం search చేయండి.

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

ఉదాహరణ output:

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

ఈ output లో, IAM user **arn:aws:iam::[12345678910](tel:12345678910):user/awscli** user **kubernetes-admin** కు map చేయబడింది.

Specific user perform చేసిన requests కనుగొనడానికి, **kubernetes-admin** user perform చేసిన operations కోసం search చేయండి.

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

ఉదాహరణ output:

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

Specific userAgent చేసిన API calls కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

సంక్షిప్త ఉదాహరణ output:

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

**aws-auth** ConfigMap కు చేసిన mutating changes కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

సంక్షిప్త ఉదాహరణ output:

```

@logStream,@timestamp,@messagekube-apiserver-audit-f01c77ed8078a670a2eb63af6f127163,2021-10-27 05:43:01.850,{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""RequestResponse"",""auditID"":""8f9a5a16-f115-4bb8-912f-ee2b1d737ff1"",""stage"":""ResponseComplete"",""requestURI"":""/api/v1/namespaces/kube-system/configmaps/aws-auth?timeout=19s"",""verb"":""patch"",""responseStatus"": {""metadata"": {},""code"": 200 },""requestObject"": {""data"": { contents of aws-auth ConfigMap } },""requestReceivedTimestamp"":""2021-10-27T05:43:01.033516Z"",""stageTimestamp"":""2021-10-27T05:43:01.042364Z"" }
```

Denied requests కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

ఉదాహరణ output:

```

@logStream,@timestamp,@messageauthenticator-8c0c570ea5676c62c44d98da6189a02b,2021-08-08 20:04:46.282,"time=""2021-08-08T20:04:44Z"" level=warning msg=""access denied"" client=""127.0.0.1:52856"" error=""sts getCallerIdentity failed: error from AWS (expected 200, got 403)"" method=POST path=/authenticate"
```

Pod ఏ node పై schedule చేయబడిందో కనుగొనడానికి, **kube-scheduler** logs query చేయండి.

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

ఉదాహరణ output:

```

@logStream,@timestamp,@messagekube-scheduler-bb3ea89d63fd2b9735ba06b144377db6,2021-08-15 12:19:43.000,"I0915 12:19:43.933124       1 scheduler.go:604] ""Successfully bound pod to node"" pod=""kube-system/aws-6799fc88d8-jqc2r"" node=""ip-192-168-66-187.eu-west-1.compute.internal"" evaluatedNodes=3 feasibleNodes=2"
```

ఈ ఉదాహరణ output లో, pod **aws-6799fc88d8-jqc2r** node **ip-192-168-66-187.eu-west-1.compute.internal** పై schedule చేయబడింది.

Kubernetes API server requests కోసం HTTP 5xx server errors కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

సంక్షిప్త ఉదాహరణ output:

```

@logStream,@timestamp,responseStatus.code,@messagekube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 07:22:06.518,503,"...""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""system:serviceaccount:kube-system:resourcequota-controller"",""uid"":""36d9c3dd-f1fd-4cae-9266-900d64d6a754"",""groups"":[""system:serviceaccounts"",""system:serviceaccounts:kube-system"",""system:authenticated""]},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kube-controller-manager/v1.21.2 (linux/amd64) kubernetes/d2965f0/system:serviceaccount:kube-system:resourcequota-controller"",""responseStatus"":{""metadata"":{},""code"":503},..."}}"
```

CronJob activation troubleshoot చేయడానికి, **cronjob-controller** చేసిన API calls కోసం search చేయండి.

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:cronjob-controller"
| display @logStream, @timestamp, @message, objectRef.namespace, objectRef.name
| sort @timestamp desc
| limit 50
```

సంక్షిప్త ఉదాహరణ output:

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "objectRef": { "resource": "cronjobs", "namespace": "default", "name": "hello", "apiGroup": "batch", "apiVersion": "v1" }, "responseObject": { "kind": "CronJob", "apiVersion": "batch/v1", "spec": { "schedule": "*/1 * * * *" }, "status": { "lastScheduleTime": "2021-08-09T07:19:00Z" } } }
```

ఈ ఉదాహరణ output లో, **default** namespace లోని **hello** job ప్రతి నిమిషం run అవుతుంది మరియు చివరిగా **2021-08-09T07:19:00Z** వద్ద schedule చేయబడింది.

**replicaset-controller** చేసిన API calls కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:replicaset-controller"
| display @logStream, @timestamp, requestURI, verb, user.username
| sort @timestamp desc
| limit 50
```

ఉదాహరణ output:

```

@logStream,@timestamp,requestURI,verb,user.usernamekube-apiserver-audit-8c0c570ea5676c62c44d98da6189a02b,2021-08-10 17:13:53.281,/api/v1/namespaces/kube-system/pods,create,system:serviceaccount:kube-system:replicaset-controller
kube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 0718:44.561,/apis/apps/v1/namespaces/kube-system/replicasets/coredns-6496b6c8b9/status,update,system:serviceaccount:kube-system:replicaset-controller
```

Kubernetes resource పై చేసిన operations కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/namespaces/default/pods/my-app"
| sort @timestamp desc
| limit 10
```

పై ఉదాహరణ query pod **my-app** కోసం **default** namespace పై **delete** API calls కోసం filter చేస్తుంది.
సంక్షిప్త ఉదాహరణ output:

```

@logStream,@timestamp,@messagekube-apiserver-audit-e7b3cb08c0296daf439493a6fc9aff8c,2021-08-11 14:09:47.813,"...""requestURI"":""/api/v1/namespaces/default/pods/my-app"",""verb"":""delete"",""user"":{""username""""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""pods"",""namespace"":""default"",""name"":""my-app"",""apiVersion"":""v1""},""responseStatus"":{""metadata"":{},""code"":200},""requestObject"":{""kind"":""DeleteOptions"",""apiVersion"":""v1"",""propagationPolicy"":""Background""},
..."
```

Kubernetes API server కు చేసిన calls కోసం HTTP response codes count retrieve చేయడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

ఉదాహరణ output:

```

responseStatus.code,count200,35066
201,525
403,125
404,116
101,2
```

**kube-system** namespace లో DaemonSets/Addons కు చేసిన changes కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestamp desc
| limit 50
```

ఉదాహరణ output:

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "level": "RequestResponse", "auditID": "93e24148-0aa6-4166-8086-a689b0031612", "stage": "ResponseComplete", "requestURI": "/apis/apps/v1/namespaces/kube-system/daemonsets/aws-node?fieldManager=kubectl-set", "verb": "patch", "user": { "username": "kubernetes-admin", "groups": [ "system:masters", "system:authenticated" ] }, "userAgent": "kubectl/v1.22.2 (darwin/amd64) kubernetes/8b5a191", "objectRef": { "resource": "daemonsets", "namespace": "kube-system", "name": "aws-node", "apiGroup": "apps", "apiVersion": "v1" }, "requestObject": { "REDACTED": "REDACTED" }, "requestReceivedTimestamp": "2021-08-09T08:07:21.868376Z", "stageTimestamp": "2021-08-09T08:07:21.883489Z", "annotations": { "authorization.k8s.io/decision": "allow", "authorization.k8s.io/reason": "" } }
```

ఈ ఉదాహరణ output లో, **kubernetes-admin** user **kubectl** v1.22.2 ఉపయోగించి **aws-node** DaemonSet ను patch చేశారు.

Node delete చేసిన user కనుగొనడానికి, ఈ ఉదాహరణ query ఉపయోగించవచ్చు:

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/nodes"
| sort @timestamp desc
| limit 10
```

సంక్షిప్త ఉదాహరణ output:

```

@logStream,@timestamp,@messagekube-apiserver-audit-e503271cd443efdbd2050ae8ca0794eb,2022-03-25 07:26:55.661,"{"kind":"Event","
```

చివరగా, మీరు control plane logging feature ఉపయోగించడం ప్రారంభించి ఉంటే, [Understanding and Cost Optimizing Amazon EKS Control Plane Logs](https://aws.amazon.com/blogs/containers/understanding-and-cost-optimizing-amazon-eks-control-plane-logs/) గురించి మరింత తెలుసుకోవాలని బాగా సిఫార్సు చేస్తాము.

### Amazon EKS data plane logging

Amazon EKS కోసం logs మరియు metrics capture చేయడానికి [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) ఉపయోగించమని సిఫార్సు చేస్తాము. [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) CloudWatch agent తో cluster, node, మరియు pod-level metrics implement చేస్తుంది, మరియు CloudWatch కు log capture కోసం [Fluent Bit](https://fluentbit.io/) లేదా [Fluentd](https://www.fluentd.org/) ఉపయోగిస్తుంది. Container Insights మీ captured CloudWatch metrics యొక్క layered views తో automatic dashboards కూడా అందిస్తుంది. Container Insights CloudWatch DaemonSet మరియు Fluent Bit DaemonSet గా deploy చేయబడుతుంది, ఇది ప్రతి Amazon EKS node పై నడుస్తుంది. Fargate nodes Container Insights ద్వారా support చేయబడవు ఎందుకంటే nodes AWS ద్వారా manage చేయబడతాయి మరియు DaemonSets support చేయవు. Amazon EKS కోసం Fargate logging ఈ guide లో వేరుగా cover చేయబడింది.

ఈ క్రింది table Amazon EKS కోసం [default Fluentd లేదా Fluent Bit log capture configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html) ద్వారా capture చేయబడే CloudWatch log groups మరియు logs చూపిస్తుంది.

|`/aws/containerinsights/Cluster_Name/host`	|Logs from `/var/log/dmesg`, `/var/log/secure`, and `/var/log/messages`.	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|The logs in `/var/log/journal` for `kubelet.service`, `kubeproxy.service`, and `docker.service`.	|

Logging కోసం Fluent Bit లేదా Fluentd తో Container Insights ఉపయోగించకూడదనుకుంటే, Amazon EKS nodes పై install చేసిన CloudWatch agent తో node మరియు container logs capture చేయవచ్చు. Amazon EKS nodes EC2 instances, అంటే Amazon EC2 కోసం మీ standard system-level logging approach లో వాటిని include చేయాలి. Distributor మరియు State Manager ఉపయోగించి CloudWatch agent install చేస్తే, Amazon EKS nodes కూడా CloudWatch agent installation, configuration, మరియు update లో include చేయబడతాయి. Logging కోసం Fluent Bit లేదా Fluentd తో Container Insights ఉపయోగించకపోతే capture చేయవలసిన Kubernetes specific logs క్రింది table చూపిస్తుంది.


|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|The logs for the L-IPAM daemon can be found here	|
|---	|---	|

Data plane logging గురించి మరింత తెలుసుకోవడానికి [Amazon EKS node logging prescriptive guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html) reference చేయండి.

### Amazon EKS application logging

Kubernetes environment లో scale వద్ద applications నడిపేటప్పుడు Amazon EKS application logging అనివార్యం అవుతుంది. Application logs సేకరించడానికి మీ Amazon EKS cluster లో [Fluent Bit](https://fluentbit.io/), [Fluentd](https://www.fluentd.org/), లేదా [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) వంటి log aggregator install చేయాలి.

[Fluent Bit](https://fluentbit.io/) అనేది C++ లో రాయబడిన open-source log processor మరియు forwarder, ఇది వివిధ sources నుండి data collect చేయడానికి, filters తో enrich చేయడానికి, మరియు multiple destinations కు పంపడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ guide solution ఉపయోగించి logging కోసం `aws-for-fluent-bit` లేదా `fargate-fluentbit` enable చేయవచ్చు. [Fluentd](https://www.fluentd.org/) అనేది unified logging layer కోసం open-source data collector, Ruby లో రాయబడింది. Fluentd multiple sources నుండి data aggregate చేయగల, వివిధ formats తో data ను JSON-formatted objects లోకి unify చేయగల, మరియు వివిధ output destinations కు route చేయగల unified logging layer గా పనిచేస్తుంది. వేలాది servers monitor చేసేటప్పుడు CPU మరియు memory utilization కోసం log collector ఎంచుకోవడం ముఖ్యం. మీకు multiple Amazon EKS clusters ఉంటే, cluster లోని వివిధ nodes నుండి data collect చేయడానికి Fluent Bit ను lightweight shipper గా ఉపయోగించి aggregation, processing మరియు supported output destination కు routing కోసం Fluentd కు forward చేయవచ్చు.

Application మరియు cluster logs CloudWatch కు పంపడానికి log collector మరియు forwarder గా Fluent Bit ఉపయోగించమని సిఫార్సు చేస్తాము. తర్వాత CloudWatch లో subscription filter ఉపయోగించి logs ను Amazon OpenSearch Service కు stream చేయవచ్చు. ఈ option ఈ section యొక్క architecture diagram లో చూపబడింది.

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*Figure: Amazon EKS application logging architecture.*

Amazon EKS clusters నుండి application logs Amazon OpenSearch Service కు stream చేయబడినప్పుడు ఈ diagram ఈ క్రింది workflow చూపిస్తుంది. Amazon EKS cluster లోని Fluent Bit service logs ను CloudWatch కు push చేస్తుంది. AWS Lambda function subscription filter ఉపయోగించి logs ను Amazon OpenSearch Service కు stream చేస్తుంది. configured indexes లో logs visualize చేయడానికి Kibana ఉపయోగించవచ్చు. Amazon Kinesis Data Firehose ఉపయోగించి logs stream చేసి [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) తో analysis మరియు querying కోసం S3 bucket లో store చేయవచ్చు.

చాలా clusters లో, log aggregation కోసం Fluentd లేదా Fluent Bit ఉపయోగించడానికి తక్కువ optimization అవసరం. వేలాది pods మరియు nodes ఉన్న పెద్ద clusters తో deal చేసేటప్పుడు ఇది మారుతుంది. [వేలాది pods ఉన్న clusters లో Fluentd మరియు Fluent Bit impact](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/) అధ్యయనం చేసిన మా findings publish చేశాము. మరింత నేర్చుకోవడానికి, *Use_Kubelet* option ఉపయోగించి Kubernetes API servers కు చేసే [API calls volume తగ్గించడానికి designed Fluent Bit enhancement](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/) check చేయమని recommend చేస్తాము. ఈ Fluent Bit `Use_Kubelet` feature host పై kubelet నుండి pod metadata retrieve చేయడానికి అనుమతిస్తుంది. Amazon EKS customers Kubernetes API server ను overload చేయకుండా ఈ feature enable చేసి వేల tens of thousands pods నడిచే clusters లో logs capture చేయడానికి Fluent Bit ఉపయోగించవచ్చు. మీరు పెద్ద Kubernetes cluster నడపకపోయినా ఈ feature enable చేయమని recommend చేస్తాము.

#### Amazon EKS on Fargate కోసం Logging

Amazon EKS on Fargate తో, మీ Kubernetes nodes allocate లేదా manage చేయకుండా pods deploy చేయవచ్చు. ఇది మీ Kubernetes nodes కోసం system-level logs capture చేయవలసిన అవసరాన్ని తొలగిస్తుంది. మీ Fargate pods నుండి logs capture చేయడానికి, logs నేరుగా CloudWatch కు forward చేయడానికి Fluent Bit ఉపయోగించవచ్చు. ఇది మరింత configuration లేదా Fargate పై మీ Amazon EKS pods కోసం sidecar container అవసరం లేకుండా స్వయంచాలకంగా logs CloudWatch కు route చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ విషయం గురించి మరింత సమాచారం కోసం, Amazon EKS documentation లో [Fargate logging](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html) మరియు AWS Blog లో [Fluent Bit for Amazon EKS](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/) చూడండి. ఈ solution మీ container నుండి `STDOUT` మరియు `STDERR` input/output (I/O) streams capture చేసి Fargate పై Amazon EKS cluster కోసం establish చేసిన Fluent Bit configuration ఆధారంగా Fluent Bit ద్వారా CloudWatch కు పంపుతుంది.

Amazon EKS కోసం Fluent Bit support తో, Fargate పై నడుస్తున్న Amazon EKS pods నుండి container logs route చేయడానికి ఇకపై sidecar run చేయవలసిన అవసరం లేదు. కొత్త built-in logging support తో, records పంపడానికి మీ ఎంపిక destination select చేయవచ్చు. Amazon EKS on Fargate AWS ద్వారా manage చేయబడే Fluent Bit for AWS version ఉపయోగిస్తుంది, ఇది Fluent Bit upstream conformant distribution.

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*Figure: Amazon EKS on Fargate కోసం Logging.*

Amazon EKS కోసం Fluent Bit support గురించి మరింత తెలుసుకోవడానికి Amazon EKS documentation లో [Fargate logging](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html) చూడండి.

కొన్ని కారణాల వల్ల, AWS Fargate పై నడుస్తున్న pods కోసం sidecar pattern ఉపయోగించవలసి వస్తే. మీ applications produce చేసే logs capture చేయడానికి Fluentd (లేదా [Fluent Bit](http://fluentbit.io/)) sidecar container run చేయవచ్చు. ఈ option application logs ను `stdout` లేదా `stderr` బదులు filesystem కు write చేయడం అవసరం. ఈ approach యొక్క consequence ఏమిటంటే container logs view చేయడానికి `kubectl` logs ఉపయోగించలేరు. `kubectl logs` లో logs appear అయ్యేలా చేయడానికి, application logs ను `stdout` మరియు filesystem రెండింటికీ ఏకకాలంలో write చేయవచ్చు.

[Fargate పై Pods 20GB ephemeral storage పొందుతాయి](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html), ఇది pod కు belong అయ్యే అన్ని containers కు అందుబాటులో ఉంటుంది. మీ application local filesystem కు logs write చేయడానికి configure చేసి log directory (లేదా file) watch చేయమని Fluentd ను instruct చేయవచ్చు. Fluentd log files tail నుండి events read చేసి storage కోసం CloudWatch వంటి destination కు events పంపుతుంది. Logs మొత్తం volume usurp చేయకుండా నివారించడానికి logs regularly rotate చేయండి.

AWS Fargate పై మీ kubernetes applications scale వద్ద operate మరియు observe చేయడానికి [How to capture application logs when using Amazon EKS on AWS Fargate](https://aws.amazon.com/blogs/containers/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/) గురించి మరింత తెలుసుకోండి. ఈ approach లో `kubectl logs` లో logs చూడడానికి file మరియు `stdout` రెండింటికీ `tee` write చేస్తాము.

### AWS Native services ఉపయోగించి Amazon EKS మరియు ఇతర compute platforms నుండి Unified log aggregation

ఈ రోజు customers [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS), [Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/), మరియు [AWS Lambda](https://aws.amazon.com/lambda/) వంటి వివిధ computing platforms అంతటా agents, log routers, మరియు extensions ఉపయోగించి logs unify మరియు centralize చేయాలనుకుంటున్నారు. తర్వాత application insights పొందడానికి వివిధ computing platforms అంతటా సేకరించిన logs visualize మరియు analyze చేయడానికి OpenSearch Dashboards తో [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) ఉపయోగించవచ్చు.

Unified aggregated log system ఈ క్రింది benefits అందిస్తుంది:

* వివిధ computing platforms అంతటా అన్ని logs కోసం single point of access
* [Amazon Simple Storage Service](http://aws.amazon.com/s3) (Amazon S3), Amazon OpenSearch Service, [Amazon Redshift](https://aws.amazon.com/redshift/), మరియు ఇతర services వంటి downstream systems కు deliver చేయడానికి ముందు logs transformations define మరియు standardize చేయడంలో సహాయం
* Amazon OpenSearch Service ఉపయోగించి logs త్వరగా index చేయడం, మరియు OpenSearch Dashboards దాని routers, applications, మరియు ఇతర devices నుండి logs search మరియు visualize చేయడం

[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS), మరియు [AWS Lambda](https://aws.amazon.com/lambda/) వంటి వివిధ compute platforms అంతటా log aggregation perform చేసే architecture ను ఈ క్రింది diagram చూపిస్తుంది.

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*Figure: వివిధ compute platforms అంతటా Log aggregation.*

ఈ architecture multiple compute platforms నుండి logs collect చేసి Kinesis Data Firehose కు deliver చేయడానికి log agents, log routers, మరియు Lambda extensions వంటి వివిధ log aggregation tools ఉపయోగిస్తుంది. Kinesis Data Firehose logs ను Amazon OpenSearch Service కు stream చేస్తుంది. Amazon OpenSearch Service లో persist కావడానికి fail అయిన log records AWS S3 కు write చేయబడతాయి. ఈ architecture scale చేయడానికి, ప్రతి compute platform logs ను different Firehose delivery stream కు stream చేస్తుంది, separate index గా add చేయబడుతుంది, మరియు ప్రతి 24 గంటలకు rotate చేయబడుతుంది.

[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS), మరియు [AWS Lambda](https://aws.amazon.com/lambda/) వంటి వివిధ compute platforms అంతటా Kinesis Data Firehose మరియు Amazon OpenSearch Service ఉపయోగించి [logs unify మరియు centralize చేయడం ఎలాగో](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/) మరింత నేర్చుకోవడానికి check చేయండి. ఈ approach వివిధ services కోసం వివిధ platforms కాకుండా single platform ఉపయోగించి logs త్వరగా analyze చేయడానికి మరియు failures root cause గుర్తించడానికి మిమ్మల్ని అనుమతిస్తుంది.

## ముగింపు

Observability best practices guide యొక్క ఈ విభాగంలో, control plane logging, node logging, మరియు application logging అనే మూడు types of Kubernetes logging లో లోతుగా dive చేయడంతో ప్రారంభించాము. తదుపరి Kinesis Data Firehose మరియు Amazon OpenSearch Service వంటి AWS Native services ఉపయోగించి Amazon EKS మరియు ఇతర compute platforms నుండి unified log aggregation గురించి తెలుసుకున్నాము. మరింత లోతుగా dive చేయడానికి, AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) యొక్క AWS native Observability category కింద Logs మరియు Insights modules practice చేయమని బాగా recommend చేస్తాము.
