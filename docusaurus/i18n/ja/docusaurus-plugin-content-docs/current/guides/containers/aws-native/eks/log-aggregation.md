# ログ集約

このオブザーバビリティのベストプラクティスガイドのセクションでは、AWS ネイティブサービスを使用した Amazon EKS ロギングに関連する以下のトピックについて詳しく説明します。

* AWS EKS ロギングの概要
* Amazon EKS コントロールプレーンロギング
* Amazon EKS データプレーンロギング
* Amazon EKS アプリケーションロギング
* AWS ネイティブサービスを使用した Amazon EKS およびその他のコンピューティングプラットフォームからの統合ログ集約
* まとめ

### はじめに

Amazon EKS のログは、コントロールプレーンログ、ノードログ、アプリケーションログの 3 つのタイプに分類できます。[Kubernetes コントロールプレーン](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)は、Kubernetes クラスターを管理し、監査および診断目的で使用されるログを生成する一連のコンポーネントです。Amazon EKS では、[さまざまなコントロールプレーンコンポーネントのログを有効にして](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)、CloudWatch に送信できます。

Kubernetes は、次のようなシステムコンポーネントも実行します `kubelet` および `kube-proxy` ポッドを実行する各 Kubernetes ノード上で動作します。これらのコンポーネントは各ノード内にログを書き込み、CloudWatch と Container Insights を設定して各 Amazon EKS ノードのこれらのログをキャプチャできます。

コンテナは Kubernetes クラスター内で [Pod](https://kubernetes.io/docs/concepts/workloads/pods/) としてグループ化され、Kubernetes ノード上で実行されるようにスケジュールされます。ほとんどのコンテナ化されたアプリケーションは標準出力と標準エラーに書き込み、コンテナエンジンはその出力をロギングドライバーにリダイレクトします。Kubernetes では、コンテナログは次の場所にあります。 `/var/log/pods` ノード上のディレクトリ。CloudWatch と Container Insights を設定して、各 Amazon EKS ポッドのこれらのログをキャプチャできます。

Kubernetes でコンテナログを一元化されたログ集約システムに送信するための、3 つの一般的なアプローチがあります。

* [Fluentd daemonset](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) のようなノードレベルのエージェント。これが推奨されるパターンです。
* Fluentd サイドカーコンテナのようなサイドカーコンテナ。
* ログ収集システムへの直接書き込み。このアプローチでは、アプリケーションがログの送信を担当します。これは最も推奨されないオプションです。なぜなら、Fluentd のようなコミュニティで構築されたソリューションを再利用する代わりに、ログ集約システムの SDK をアプリケーションコードに含める必要があるためです。このパターンは、*関心の分離の原則*にも反しています。この原則によれば、ログ実装はアプリケーションから独立している必要があります。そうすることで、アプリケーションに影響を与えたり変更したりすることなく、ログインフラストラクチャを変更できます。

ここからは、Amazon EKS ログ記録の各ログカテゴリについて詳しく説明するとともに、Amazon EKS やその他のコンピューティングプラットフォームからの統合ログ集約についても説明します。

### Amazon EKS コントロールプレーンのログ記録

Amazon EKS クラスターは、Kubernetes クラスター用の高可用性シングルテナントコントロールプレーンと、コンテナを実行する Amazon EKS ノードで構成されます。コントロールプレーンノードは、AWS が管理するアカウントで実行されます。Amazon EKS クラスターのコントロールプレーンノードは CloudWatch と統合されており、特定のコントロールプレーンコンポーネントのログ記録を有効にできます。ログは、各 Kubernetes コントロールプレーンコンポーネントインスタンスに対して提供されます。AWS はコントロールプレーンノードの健全性を管理し、[Kubernetes エンドポイントのサービスレベルアグリーメント (SLA)](http://aws.amazon.com/eks/sla/) を提供します。

[Amazon EKS コントロールプレーンログ](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)は、以下のクラスターコントロールプレーンログタイプで構成されています。各ログタイプは、Kubernetes コントロールプレーンのコンポーネントに対応しています。これらのコンポーネントの詳細については、Kubernetes ドキュメントの[Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)を参照してください。

* **API server (`api`)** – クラスターの API サーバーは、Kubernetes API を公開するコントロールプレーンコンポーネントです。クラスターの起動時、またはその直後に API サーバーログを有効にすると、ログには API サーバーの起動に使用された API サーバーフラグが含まれます。詳細については、[`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) および Kubernetes ドキュメントの[監査ポリシー](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255)を参照してください。
* **監査 (`audit`)** – Kubernetes 監査ログは、クラスターに影響を与えた個々のユーザー、管理者、またはシステムコンポーネントの記録を提供します。詳細については、Kubernetes ドキュメントの [Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) を参照してください。
* **Authenticator (`authenticator`)** – Authenticator ログは Amazon EKS に固有のものです。これらのログは、IAM 認証情報を使用した Kubernetes [ロールベースのアクセス制御](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) 認証のために Amazon EKS が使用するコントロールプレーンコンポーネントを表します。詳細については、[クラスター管理](https://docs.aws.amazon.com/eks/latest/userguide/eks-managing.html)を参照してください。
* **Controller manager (`controllerManager`)** – コントローラーマネージャーは、Kubernetes に同梱されているコア制御ループを管理します。詳細については、Kubernetes ドキュメントの [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) を参照してください。
* **Scheduler (`scheduler`)** – スケジューラーコンポーネントは、クラスター内でポッドをいつどこで実行するかを管理します。詳細については、Kubernetes ドキュメントの [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) を参照してください。

[コントロールプレーンログの有効化と無効化](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#:~:text=the%20Kubernetes%20documentation.-,Enabling%20and%20disabling%20control%20plane%20logs,-By%20default%2C%20cluster)のセクションに従って、AWS コンソールまたは AWS CLI を使用してコントロールプレーンログを有効にしてください。

#### CloudWatch コンソールからコントロールプレーンログをクエリする

Amazon EKS クラスターでコントロールプレーンログを有効にすると、EKS コントロールプレーンログは次の場所で確認できます。 `/aws/eks/cluster-name/cluster` ログループ。詳細については、[クラスターコントロールプレーンログの表示](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#viewing-control-plane-logs)を参照してください。必ず置き換えてください `cluster-name` クラスター名に置き換えてください。

CloudWatch Logs Insights を使用して、EKS コントロールプレーンのログデータを検索できます。詳細については、[CloudWatch Insights によるログデータの分析](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)を参照してください。CloudWatch Logs でログイベントを表示できるのは、クラスターでコントロールプレーンのログ記録を有効にした後のみであることに注意することが重要です。CloudWatch Logs Insights でクエリを実行する時間範囲を選択する前に、コントロールプレーンのログ記録を有効にしたことを確認してください。以下のスクリーンショットは、クエリ出力を含む EKS コントロールプレーンログクエリの例を示しています。

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*図: CloudWatch Logs Insights。*

#### CloudWatch Logs Insights における一般的な EKS ユースケースのサンプルクエリ

クラスターの作成者を見つけるには、**kubernetes-admin** ユーザーにマッピングされている IAM エンティティを検索します。

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

出力例

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

この出力では、IAM ユーザー **arn:aws:iam::[12345678910](tel:12345678910):user/awscli** がユーザー **kubernetes-admin** にマッピングされています。

特定のユーザーが実行したリクエストを検索するには、**kubernetes-admin** ユーザーが実行したオペレーションを検索します。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

出力例

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

特定の userAgent が行った API 呼び出しを検索するには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

短縮された出力例:

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

**aws-auth** ConfigMap に対して行われた変更を検出するには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

短縮された出力例:

```

@logStream,@timestamp,@messagekube-apiserver-audit-f01c77ed8078a670a2eb63af6f127163,2021-10-27 05:43:01.850,{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""RequestResponse"",""auditID"":""8f9a5a16-f115-4bb8-912f-ee2b1d737ff1"",""stage"":""ResponseComplete"",""requestURI"":""/api/v1/namespaces/kube-system/configmaps/aws-auth?timeout=19s"",""verb"":""patch"",""responseStatus"": {""metadata"": {},""code"": 200 },""requestObject"": {""data"": { contents of aws-auth ConfigMap } },""requestReceivedTimestamp"":""2021-10-27T05:43:01.033516Z"",""stageTimestamp"":""2021-10-27T05:43:01.042364Z"" }
```

拒否されたリクエストを見つけるには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

出力例

```

@logStream,@timestamp,@messageauthenticator-8c0c570ea5676c62c44d98da6189a02b,2021-08-08 20:04:46.282,"time=""2021-08-08T20:04:44Z"" level=warning msg=""access denied"" client=""127.0.0.1:52856"" error=""sts getCallerIdentity failed: error from AWS (expected 200, got 403)"" method=POST path=/authenticate"
```

ポッドがスケジュールされたノードを見つけるには、**kube-scheduler** ログをクエリします。

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

出力例

```

@logStream,@timestamp,@messagekube-scheduler-bb3ea89d63fd2b9735ba06b144377db6,2021-08-15 12:19:43.000,"I0915 12:19:43.933124       1 scheduler.go:604] ""Successfully bound pod to node"" pod=""kube-system/aws-6799fc88d8-jqc2r"" node=""ip-192-168-66-187.eu-west-1.compute.internal"" evaluatedNodes=3 feasibleNodes=2"
```

この出力例では、Pod **aws-6799fc88d8-jqc2r** がノード **ip-192-168-66-187.eu-west-1.compute.internal** にスケジュールされました。

Kubernetes API サーバーリクエストの HTTP 5xx サーバーエラーを検索するには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

短縮された出力例:

```

@logStream,@timestamp,responseStatus.code,@messagekube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 07:22:06.518,503,"...""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""system:serviceaccount:kube-system:resourcequota-controller"",""uid"":""36d9c3dd-f1fd-4cae-9266-900d64d6a754"",""groups"":[""system:serviceaccounts"",""system:serviceaccounts:kube-system"",""system:authenticated""]},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kube-controller-manager/v1.21.2 (linux/amd64) kubernetes/d2965f0/system:serviceaccount:kube-system:resourcequota-controller"",""responseStatus"":{""metadata"":{},""code"":503},..."}}"
```

CronJob のアクティベーションをトラブルシューティングするには、**cronjob-controller** が行った API 呼び出しを検索します。

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:cronjob-controller"
| display @logStream, @timestamp, @message, objectRef.namespace, objectRef.name
| sort @timestamp desc
| limit 50
```

短縮された出力例:

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "objectRef": { "resource": "cronjobs", "namespace": "default", "name": "hello", "apiGroup": "batch", "apiVersion": "v1" }, "responseObject": { "kind": "CronJob", "apiVersion": "batch/v1", "spec": { "schedule": "*/1 * * * *" }, "status": { "lastScheduleTime": "2021-08-09T07:19:00Z" } } }
```

この出力例では、**default** namespace の **hello** ジョブが毎分実行され、最後に **2021-08-09T07:19:00Z** にスケジュールされました。

**replicaset-controller** が行った API 呼び出しを見つけるには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:replicaset-controller"
| display @logStream, @timestamp, requestURI, verb, user.username
| sort @timestamp desc
| limit 50
```

出力例

```

@logStream,@timestamp,requestURI,verb,user.usernamekube-apiserver-audit-8c0c570ea5676c62c44d98da6189a02b,2021-08-10 17:13:53.281,/api/v1/namespaces/kube-system/pods,create,system:serviceaccount:kube-system:replicaset-controller
kube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 0718:44.561,/apis/apps/v1/namespaces/kube-system/replicasets/coredns-6496b6c8b9/status,update,system:serviceaccount:kube-system:replicaset-controller
```

Kubernetes リソースに対して実行された操作を見つけるには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/namespaces/default/pods/my-app"
| sort @timestamp desc
| limit 10
```

前述のクエリ例では、**default** 名前空間のポッド **my-app** に対する **delete** API 呼び出しをフィルタリングしています。
出力例の短縮版:

```

@logStream,@timestamp,@messagekube-apiserver-audit-e7b3cb08c0296daf439493a6fc9aff8c,2021-08-11 14:09:47.813,"...""requestURI"":""/api/v1/namespaces/default/pods/my-app"",""verb"":""delete"",""user"":{""username""""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""pods"",""namespace"":""default"",""name"":""my-app"",""apiVersion"":""v1""},""responseStatus"":{""metadata"":{},""code"":200},""requestObject"":{""kind"":""DeleteOptions"",""apiVersion"":""v1"",""propagationPolicy"":""Background""},
..."
```

Kubernetes API サーバーへの呼び出しに対する HTTP レスポンスコードの数を取得するには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

出力例

```

responseStatus.code,count200,35066
201,525
403,125
404,116
101,2
```

**kube-system** 名前空間の DaemonSets/Addons に加えられた変更を見つけるには、次のクエリ例を使用できます。

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestamp desc
| limit 50
```

出力例

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "level": "RequestResponse", "auditID": "93e24148-0aa6-4166-8086-a689b0031612", "stage": "ResponseComplete", "requestURI": "/apis/apps/v1/namespaces/kube-system/daemonsets/aws-node?fieldManager=kubectl-set", "verb": "patch", "user": { "username": "kubernetes-admin", "groups": [ "system:masters", "system:authenticated" ] }, "userAgent": "kubectl/v1.22.2 (darwin/amd64) kubernetes/8b5a191", "objectRef": { "resource": "daemonsets", "namespace": "kube-system", "name": "aws-node", "apiGroup": "apps", "apiVersion": "v1" }, "requestObject": { "REDACTED": "REDACTED" }, "requestReceivedTimestamp": "2021-08-09T08:07:21.868376Z", "stageTimestamp": "2021-08-09T08:07:21.883489Z", "annotations": { "authorization.k8s.io/decision": "allow", "authorization.k8s.io/reason": "" } }
```

この出力例では、**kubernetes-admin** ユーザーが **kubectl** v1.22.2 を使用して **aws-node** DaemonSet にパッチを適用しました。

ノードを削除したユーザーを見つけるには、次のクエリ例を使用できます。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/nodes"
| sort @timestamp desc
| limit 10
```

短縮された出力例:

```

@logStream,@timestamp,@messagekube-apiserver-audit-e503271cd443efdbd2050ae8ca0794eb,2022-03-25 07:26:55.661,"{"kind":"Event","
```

最後に、コントロールプレーンログ記録機能の使用を開始した場合は、[Amazon EKS コントロールプレーンログの理解とコスト最適化](https://aws.amazon.com/blogs/containers/understanding-and-cost-optimizing-amazon-eks-control-plane-logs/)について詳しく学ぶことを強くお勧めします。

### Amazon EKS データプレーンログ記録

Amazon EKS のログとメトリクスをキャプチャするには、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) を使用することをお勧めします。[Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、CloudWatch エージェントを使用してクラスター、ノード、ポッドレベルのメトリクスを実装し、CloudWatch へのログキャプチャには [Fluent Bit](https://fluentbit.io/) または [Fluentd](https://www.fluentd.org/) を使用します。Container Insights は、キャプチャされた CloudWatch メトリクスのレイヤービューを持つ自動ダッシュボードも提供します。Container Insights は、すべての Amazon EKS ノードで実行される CloudWatch DaemonSet と Fluent Bit DaemonSet としてデプロイされます。Fargate ノードは AWS によって管理されており、DaemonSet をサポートしていないため、Container Insights ではサポートされていません。Amazon EKS の Fargate ロギングについては、このガイドで別途説明します。

次の表は、Amazon EKS の[デフォルトの Fluentd または Fluent Bit ログキャプチャ設定](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html)によってキャプチャされる CloudWatch ロググループとログを示しています。

|`/aws/containerinsights/Cluster_Name/host`	|Logs from `/var/log/dmesg`, `/var/log/secure`, and `/var/log/messages`.	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|The logs in `/var/log/journal` for `kubelet.service`, `kubeproxy.service`, and `docker.service`.	|

ログ記録に Container Insights と Fluent Bit または Fluentd を使用したくない場合は、Amazon EKS ノードにインストールされた CloudWatch エージェントを使用してノードとコンテナのログをキャプチャできます。Amazon EKS ノードは EC2 インスタンスであるため、Amazon EC2 の標準的なシステムレベルのログ記録アプローチに含める必要があります。Distributor と State Manager を使用して CloudWatch エージェントをインストールする場合、Amazon EKS ノードも CloudWatch エージェントのインストール、設定、更新に含まれます。次の表は、Kubernetes に固有のログを示しており、ログ記録に Container Insights と Fluent Bit または Fluentd を使用していない場合にキャプチャする必要があります。


|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|The logs for the L-IPAM daemon can be found here	|
|---	|---	|

データプレーンログ記録の詳細については、[Amazon EKS ノードログ記録の規範的ガイダンス](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html)を参照してください。

### Amazon EKS アプリケーションログ

Amazon EKS アプリケーションログは、Kubernetes 環境で大規模にアプリケーションを実行する際に不可欠になります。アプリケーションログを収集するには、[Fluent Bit](https://fluentbit.io/)、[Fluentd](https://www.fluentd.org/)、または [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) などのログアグリゲーターを Amazon EKS クラスターにインストールする必要があります。

[Fluent Bit](https://fluentbit.io/) は C++ で記述されたオープンソースのログプロセッサおよびフォワーダーです。これにより、さまざまなソースからデータを収集し、フィルターでデータを強化して、複数の送信先に送信できます。このガイドのソリューションを使用することで、次のことが可能になります `aws-for-fluent-bit` または `fargate-fluentbit` ログ記録に使用します。[Fluentd](https://www.fluentd.org/) は、統合ログ記録レイヤー用のオープンソースデータコレクターで、Ruby で記述されています。Fluentd は、複数のソースからデータを集約し、異なる形式のデータを JSON 形式のオブジェクトに統一し、さまざまな出力先にルーティングできる統合ログ記録レイヤーとして機能します。数千台のサーバーを監視する場合、CPU とメモリの使用率を考慮すると、ログコレクターの選択は重要です。複数の Amazon EKS クラスターがある場合、Fluent Bit を軽量なシッパーとして使用して、クラスター内のさまざまなノードからデータを収集し、Fluentd に転送して集約、処理、およびサポートされている出力先へのルーティングを行うことができます。

ログコレクターおよびフォワーダーとして Fluent Bit を使用し、アプリケーションログとクラスターログを CloudWatch に送信することをお勧めします。その後、CloudWatch のサブスクリプションフィルターを使用して、ログを Amazon OpenSearch Service にストリーミングできます。このオプションは、このセクションのアーキテクチャ図に示されています。

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*図: Amazon EKS アプリケーションログアーキテクチャ。*

この図は、Amazon EKS クラスターからのアプリケーションログが Amazon OpenSearch Service にストリーミングされる際の次のワークフローを示しています。Amazon EKS クラスター内の Fluent Bit サービスがログを CloudWatch にプッシュします。AWS Lambda 関数は、サブスクリプションフィルターを使用してログを Amazon OpenSearch Service にストリーミングします。その後、Kibana を使用して、設定されたインデックス内のログを可視化できます。また、Amazon Kinesis Data Firehose を使用してログをストリーミングし、S3 バケットに保存して、[Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) で分析とクエリを実行することもできます。

ほとんどのクラスターでは、ログ集約に Fluentd または Fluent Bit を使用する場合、最適化はほとんど必要ありません。これは、数千のポッドとノードを持つ大規模なクラスターを扱う場合に変わります。私たちは、[数千のポッドを持つクラスターにおける Fluentd と Fluent Bit の影響](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/)を調査した結果を公開しています。さらに学習するには、*Use_Kubelet* オプションを使用して Kubernetes API サーバーへの API 呼び出しの量を削減するように設計された [Fluent Bit の機能強化](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/)を確認することをお勧めします。この Fluent Bit の `Use_Kubelet` この機能により、ホスト上の kubelet から Pod メタデータを取得できます。Amazon EKS のお客様は、この機能を有効にすることで、数万の Pod を実行するクラスターでログをキャプチャする際に、Kubernetes API サーバーに過負荷をかけることなく Fluent Bit を使用できます。大規模な Kubernetes クラスターを実行していない場合でも、この機能を有効にすることをお勧めします。

#### Amazon EKS on Fargate のログ記録

Amazon EKS on Fargate を使用すると、Kubernetes ノードを割り当てたり管理したりすることなく、ポッドをデプロイできます。これにより、Kubernetes ノードのシステムレベルのログをキャプチャする必要がなくなります。Fargate ポッドからログをキャプチャするには、Fluent Bit を使用してログを CloudWatch に直接転送できます。これにより、Amazon EKS on Fargate のポッドに対して、追加の設定やサイドカーコンテナなしで、ログを CloudWatch に自動的にルーティングできます。詳細については、Amazon EKS ドキュメントの[Fargate ロギング](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)、および AWS ブログの[Fluent Bit for Amazon EKS](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/) を参照してください。このソリューションは `STDOUT` および `STDERR` コンテナからの入出力 (I/O) ストリームを取得し、Fargate 上の Amazon EKS クラスター用に確立された Fluent Bit 設定に基づいて、Fluent Bit を通じて CloudWatch に送信します。

Amazon EKS の Fluent Bit サポートにより、Fargate 上で実行されている Amazon EKS ポッドからコンテナログをルーティングするためにサイドカーを実行する必要がなくなりました。新しい組み込みログサポートにより、レコードの送信先を任意に選択できます。Fargate 上の Amazon EKS は、AWS が管理する Fluent Bit の上流準拠ディストリビューションである Fluent Bit for AWS のバージョンを使用します。

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*図: Amazon EKS on Fargate のログ記録。*

Amazon EKS の Fluent Bit サポートの詳細については、Amazon EKS ドキュメントの[Fargate ロギング](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)を参照してください。

何らかの理由で、AWS Fargate 上で実行されている Pod でサイドカーパターンを使用する必要がある場合があります。Fluentd (または [Fluent Bit](http://fluentbit.io/)) サイドカーコンテナを実行して、アプリケーションが生成するログをキャプチャできます。このオプションでは、アプリケーションがログをファイルシステムに書き込む必要があります。 `stdout` または `stderr`この方法の結果として、使用できなくなります `kubectl` ログを表示してコンテナログを確認します。ログを表示するには `kubectl logs`、アプリケーションログを両方に書き込むことができます `stdout` とファイルシステムを同時に使用します。

[Fargate 上の Pod は 20GB のエフェメラルストレージを取得します](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html)。これは Pod に属するすべてのコンテナで利用できます。アプリケーションをローカルファイルシステムにログを書き込むように設定し、Fluentd にログディレクトリ（またはファイル）を監視するように指示できます。Fluentd はログファイルの末尾からイベントを読み取り、保存のために CloudWatch などの送信先にイベントを送信します。ログがボリューム全体を占有しないように、定期的にログをローテーションするようにしてください。

AWS Fargate 上で Amazon EKS を使用する際にアプリケーションログをキャプチャする方法については、[AWS Fargate 上で Amazon EKS を使用する際にアプリケーションログをキャプチャする方法](https://aws.amazon.com/blogs/containers/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/)を参照して、AWS Fargate 上で Kubernetes アプリケーションを大規模に運用および監視する方法を学習してください。また、 `tee` ファイルに書き込み、 `stdout` ログが次の場所に表示されます `kubectl logs` このアプローチでは。

### AWS ネイティブサービスを使用した Amazon EKS およびその他のコンピューティングプラットフォームからの統合ログ集約

最近のお客様は、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS)、[Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/)、[AWS Lambda](https://aws.amazon.com/lambda/) などのさまざまなコンピューティングプラットフォーム全体で、エージェント、ログルーター、拡張機能を使用してログを統合および一元化したいと考えています。その後、[Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) と OpenSearch Dashboards を使用して、さまざまなコンピューティングプラットフォーム全体で収集されたログを可視化および分析し、アプリケーションのインサイトを取得できます。

統合された集約ログシステムは、以下のメリットを提供します。

* さまざまなコンピューティングプラットフォーム全体のすべてのログへの単一のアクセスポイント
* ログがダウンストリームシステム ([Amazon Simple Storage Service](http://aws.amazon.com/s3) (Amazon S3)、Amazon OpenSearch Service、[Amazon Redshift](https://aws.amazon.com/redshift)、その他のサービス) に配信される前に、ログの変換を定義および標準化するのに役立ちます
* Amazon OpenSearch Service を使用してすばやくインデックスを作成し、OpenSearch Dashboards を使用してルーター、アプリケーション、その他のデバイスからのログを検索および視覚化する機能

次の図は、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS)、[AWS Lambda](https://aws.amazon.com/lambda/) などのさまざまなコンピューティングプラットフォーム全体でログ集約を実行するアーキテクチャを示しています。

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*図: さまざまなコンピューティングプラットフォーム全体でのログ集約。*

このアーキテクチャは、ログエージェント、ログルーター、Lambda 拡張機能などのさまざまなログ集約ツールを使用して、複数のコンピューティングプラットフォームからログを収集し、Kinesis Data Firehose に配信します。Kinesis Data Firehose は、ログを Amazon OpenSearch Service にストリーミングします。Amazon OpenSearch Service への永続化に失敗したログレコードは、AWS S3 に書き込まれます。このアーキテクチャをスケールするために、これらの各コンピューティングプラットフォームは、ログを異なる Firehose 配信ストリームにストリーミングし、個別のインデックスとして追加され、24 時間ごとにローテーションされます。

さらに学習するには、Kinesis Data Firehose と Amazon OpenSearch Service を使用して、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS)、[AWS Lambda](https://aws.amazon.com/lambda/) などの[さまざまなコンピューティングプラットフォーム間でログを統合および一元化する方法](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/)を確認してください。このアプローチにより、サービスごとに異なるプラットフォームを使用するのではなく、単一のプラットフォームを使用して、ログを迅速に分析し、障害の根本原因を特定できます。 

## まとめ

このオブザーバビリティベストプラクティスガイドのセクションでは、コントロールプレーンログ、ノードログ、アプリケーションログという 3 種類の Kubernetes ログについて詳しく説明しました。さらに、Kinesis Data Firehose や Amazon OpenSearch Service などの AWS ネイティブサービスを使用して、Amazon EKS やその他のコンピューティングプラットフォームから統合ログ集約を行う方法を学びました。さらに詳しく学習するには、AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS ネイティブオブザーバビリティカテゴリにある Logs and Insights モジュールを実践することを強くお勧めします。
