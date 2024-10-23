# ログ集約

AWS Observability のベストプラクティスガイドのこのセクションでは、AWS ネイティブサービスを使用した Amazon EKS ロギングに関連する以下のトピックについて詳しく説明します：

* Amazon EKS ロギングの概要
* Amazon EKS コントロールプレーンのロギング
* Amazon EKS データプレーンのロギング
* Amazon EKS アプリケーションのロギング
* AWS ネイティブサービスを使用した Amazon EKS および他のコンピューティングプラットフォームからの統合ログ集約
* 結論



### はじめに

Amazon EKS のログは、コントロールプレーンのログ、ノードのログ、アプリケーションのログの 3 種類に分けることができます。[Kubernetes コントロールプレーン](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components) は、Kubernetes クラスターを管理し、監査や診断目的で使用されるログを生成するコンポーネントのセットです。Amazon EKS では、[さまざまなコントロールプレーンコンポーネントのログを有効にして](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html)、CloudWatch に送信することができます。

Kubernetes は、Pod を実行する各 Kubernetes ノード上で `kubelet` や `kube-proxy` などのシステムコンポーネントも実行します。これらのコンポーネントは各ノード内にログを書き込み、CloudWatch と Container Insights を設定して各 Amazon EKS ノードのこれらのログを取得することができます。

コンテナは Kubernetes クラスター内で [Pod](https://kubernetes.io/docs/concepts/workloads/pods/) としてグループ化され、Kubernetes ノード上で実行されるようにスケジュールされます。ほとんどのコンテナ化されたアプリケーションは標準出力と標準エラーに書き込み、コンテナエンジンはその出力をログドライバーにリダイレクトします。Kubernetes では、コンテナログはノード上の `/var/log/pods` ディレクトリにあります。CloudWatch と Container Insights を設定して、Amazon EKS の各 Pod のこれらのログを取得することができます。

Kubernetes でコンテナログを集中型ログ集約システムに送信する一般的なアプローチには、次の 3 つがあります：

* [Fluentd DaemonSet](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) のようなノードレベルのエージェント。これが推奨されるパターンです。
* Fluentd サイドカーコンテナのようなサイドカーコンテナ。
* ログ収集システムに直接書き込む。このアプローチでは、アプリケーションがログの送信を担当します。これは最も推奨されないオプションです。なぜなら、Fluentd のようなコミュニティビルドソリューションを再利用する代わりに、アプリケーションコードにログ集約システムの SDK を含める必要があるからです。このパターンは、ログ実装がアプリケーションから独立しているべきという *関心の分離の原則* にも反します。これにより、アプリケーションに影響を与えたり変更したりすることなく、ログインフラストラクチャを変更することができます。

これから、Amazon EKS ログの各カテゴリについて詳しく見ていくとともに、Amazon EKS と他のコンピューティングプラットフォームからの統合ログ集約について説明します。



### Amazon EKS コントロールプレーンのロギング

Amazon EKS クラスターは、Kubernetes クラスター用の高可用性でシングルテナントのコントロールプレーンと、コンテナを実行する Amazon EKS ノードで構成されています。コントロールプレーンノードは AWS が管理するアカウントで実行されます。Amazon EKS クラスターのコントロールプレーンノードは CloudWatch と統合されており、特定のコントロールプレーンコンポーネントのロギングを有効にすることができます。各 Kubernetes コントロールプレーンコンポーネントインスタンスのログが提供されます。AWS はコントロールプレーンノードの健全性を管理し、[Kubernetes エンドポイントのサービスレベルアグリーメント (SLA)](https://aws.amazon.com/jp/eks/sla/) を提供しています。

[Amazon EKS コントロールプレーンのロギング](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html) は、以下のクラスターコントロールプレーンログタイプで構成されています。各ログタイプは Kubernetes コントロールプレーンのコンポーネントに対応しています。これらのコンポーネントの詳細については、Kubernetes ドキュメントの [Kubernetes コンポーネント](https://kubernetes.io/docs/concepts/overview/components/) を参照してください。

* **API サーバー (`api`)** – クラスターの API サーバーは、Kubernetes API を公開するコントロールプレーンコンポーネントです。クラスター起動時またはその直後に API サーバーログを有効にすると、ログには API サーバーの起動に使用されたフラグが含まれます。詳細については、Kubernetes ドキュメントの [`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) と [監査ポリシー](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255) を参照してください。
* **監査 (`audit`)** – Kubernetes 監査ログは、クラスターに影響を与えた個々のユーザー、管理者、またはシステムコンポーネントの記録を提供します。詳細については、Kubernetes ドキュメントの [監査](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) を参照してください。
* **認証機 (`authenticator`)** – 認証機ログは Amazon EKS 固有のものです。これらのログは、Amazon EKS が IAM 認証情報を使用して Kubernetes の [ロールベースアクセス制御](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) 認証に使用するコントロールプレーンコンポーネントを表します。詳細については、[クラスター管理](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-managing.html) を参照してください。
* **コントローラーマネージャー (`controllerManager`)** – コントローラーマネージャーは、Kubernetes に付属する主要な制御ループを管理します。詳細については、Kubernetes ドキュメントの [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) を参照してください。
* **スケジューラー (`scheduler`)** – スケジューラーコンポーネントは、クラスター内でポッドをいつどこで実行するかを管理します。詳細については、Kubernetes ドキュメントの [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) を参照してください。

[コントロールプレーンログの有効化と無効化](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html#enabling-control-plane-log-export) セクションに従って、AWS コンソールまたは AWS CLI を通じてコントロールプレーンログを有効にしてください。



#### CloudWatch コンソールからコントロールプレーンログをクエリする

Amazon EKS クラスターでコントロールプレーンログを有効にすると、`/aws/eks/cluster-name/cluster` ロググループで EKS コントロールプレーンログを確認できます。詳細については、[クラスターコントロールプレーンログの表示](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html)を参照してください。`cluster-name` をクラスターの名前に置き換えてください。

CloudWatch Logs Insights を使用して、EKS コントロールプレーンのログデータを検索できます。詳細については、[CloudWatch Insights を使用したログデータの分析](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)を参照してください。重要な点として、クラスターでコントロールプレーンログを有効にした後でのみ、CloudWatch Logs でログイベントを表示できます。CloudWatch Logs Insights でクエリを実行する時間範囲を選択する前に、コントロールプレーンログを有効にしたことを確認してください。以下のスクリーンショットは、クエリ出力を含む EKS コントロールプレーンログクエリの例を示しています。

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*図：CloudWatch Logs Insights*



#### CloudWatch Logs Insights での一般的な EKS ユースケースのサンプルクエリ

クラスター作成者を見つけるには、**kubernetes-admin** ユーザーにマッピングされている IAM エンティティを検索します。

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

出力例：

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

この出力では、IAM ユーザー **arn:aws:iam::[12345678910](tel:12345678910):user/awscli** が **kubernetes-admin** ユーザーにマッピングされています。

特定のユーザーが実行したリクエストを見つけるには、**kubernetes-admin** ユーザーが実行した操作を検索します。

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

出力例：

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

特定の userAgent が行った API コールを見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

短縮された出力例：

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

**aws-auth** ConfigMap に対する変更を見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

短縮された出力例：

```

@logStream,@timestamp,@messagekube-apiserver-audit-f01c77ed8078a670a2eb63af6f127163,2021-10-27 05:43:01.850,{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""RequestResponse"",""auditID"":""8f9a5a16-f115-4bb8-912f-ee2b1d737ff1"",""stage"":""ResponseComplete"",""requestURI"":""/api/v1/namespaces/kube-system/configmaps/aws-auth?timeout=19s"",""verb"":""patch"",""responseStatus"": {""metadata"": {},""code"": 200 },""requestObject"": {""data"": { contents of aws-auth ConfigMap } },""requestReceivedTimestamp"":""2021-10-27T05:43:01.033516Z"",""stageTimestamp"":""2021-10-27T05:43:01.042364Z"" }
```

拒否されたリクエストを見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

出力例：

```

@logStream,@timestamp,@messageauthenticator-8c0c570ea5676c62c44d98da6189a02b,2021-08-08 20:04:46.282,"time=""2021-08-08T20:04:44Z"" level=warning msg=""access denied"" client=""127.0.0.1:52856"" error=""sts getCallerIdentity failed: error from AWS (expected 200, got 403)"" method=POST path=/authenticate"
```

Pod がスケジュールされたノードを見つけるには、**kube-scheduler** ログをクエリします。

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

出力例：

```

@logStream,@timestamp,@messagekube-scheduler-bb3ea89d63fd2b9735ba06b144377db6,2021-08-15 12:19:43.000,"I0915 12:19:43.933124       1 scheduler.go:604] ""Successfully bound pod to node"" pod=""kube-system/aws-6799fc88d8-jqc2r"" node=""ip-192-168-66-187.eu-west-1.compute.internal"" evaluatedNodes=3 feasibleNodes=2"
```

この出力例では、Pod **aws-6799fc88d8-jqc2r** がノード **ip-192-168-66-187.eu-west-1.compute.internal** にスケジュールされました。

Kubernetes API サーバーリクエストの HTTP 5xx サーバーエラーを見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

短縮された出力例：

```

@logStream,@timestamp,responseStatus.code,@messagekube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 07:22:06.518,503,"...""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""system:serviceaccount:kube-system:resourcequota-controller"",""uid"":""36d9c3dd-f1fd-4cae-9266-900d64d6a754"",""groups"":[""system:serviceaccounts"",""system:serviceaccounts:kube-system"",""system:authenticated""]},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kube-controller-manager/v1.21.2 (linux/amd64) kubernetes/d2965f0/system:serviceaccount:kube-system:resourcequota-controller"",""responseStatus"":{""metadata"":{},""code"":503},..."}}"
```

CronJob のアクティベーションをトラブルシューティングするには、**cronjob-controller** が行った API コールを検索します。

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:cronjob-controller"
| display @logStream, @timestamp, @message, objectRef.namespace, objectRef.name
| sort @timestamp desc
| limit 50
```

短縮された出力例：

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "objectRef": { "resource": "cronjobs", "namespace": "default", "name": "hello", "apiGroup": "batch", "apiVersion": "v1" }, "responseObject": { "kind": "CronJob", "apiVersion": "batch/v1", "spec": { "schedule": "*/1 * * * *" }, "status": { "lastScheduleTime": "2021-08-09T07:19:00Z" } } }
```

この出力例では、**default** 名前空間の **hello** ジョブが毎分実行され、最後にスケジュールされたのは **2021-08-09T07:19:00Z** でした。

**replicaset-controller** が行った API コールを見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:replicaset-controller"
| display @logStream, @timestamp, requestURI, verb, user.username
| sort @timestamp desc
| limit 50
```

出力例：

```

@logStream,@timestamp,requestURI,verb,user.usernamekube-apiserver-audit-8c0c570ea5676c62c44d98da6189a02b,2021-08-10 17:13:53.281,/api/v1/namespaces/kube-system/pods,create,system:serviceaccount:kube-system:replicaset-controller
kube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 0718:44.561,/apis/apps/v1/namespaces/kube-system/replicasets/coredns-6496b6c8b9/status,update,system:serviceaccount:kube-system:replicaset-controller
```

Kubernetes リソースに対して行われた操作を見つけるには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/namespaces/default/pods/my-app"
| sort @timestamp desc
| limit 10
```

この例のクエリは、**default** 名前空間の Pod **my-app** に対する **delete** API コールをフィルタリングします。
短縮された出力例：

```

@logStream,@timestamp,@messagekube-apiserver-audit-e7b3cb08c0296daf439493a6fc9aff8c,2021-08-11 14:09:47.813,"...""requestURI"":""/api/v1/namespaces/default/pods/my-app"",""verb"":""delete"",""user"":{""username""""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""pods"",""namespace"":""default"",""name"":""my-app"",""apiVersion"":""v1""},""responseStatus"":{""metadata"":{},""code"":200},""requestObject"":{""kind"":""DeleteOptions"",""apiVersion"":""v1"",""propagationPolicy"":""Background""},
..."
```

Kubernetes API サーバーに対して行われたコールの HTTP レスポンスコードの数を取得するには、次のようなクエリ例を使用できます：

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

出力例：

```

responseStatus.code,count200,35066
201,525
403,125
404,116
101,2
```

**kube-system** 名前空間の DaemonSets/Addons に対して行われた変更を見つけるには、次のようなクエリ例を使用できます：

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestam


### Amazon EKS データプレーンのロギング

Amazon EKS のログとメトリクスを取得するには、[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) の使用をお勧めします。[Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、CloudWatch エージェントを使用してクラスター、ノード、Pod レベルのメトリクスを実装し、[Fluent Bit](https://fluentbit.io/) または [Fluentd](https://www.fluentd.org/) を使用して CloudWatch にログを取り込みます。Container Insights は、取得した CloudWatch メトリクスの階層化されたビューを持つ自動ダッシュボードも提供します。Container Insights は、すべての Amazon EKS ノードで実行される CloudWatch DaemonSet と Fluent Bit DaemonSet としてデプロイされます。Fargate ノードは AWS によって管理され、DaemonSet をサポートしていないため、Container Insights ではサポートされていません。Amazon EKS の Fargate ロギングについては、このガイドで別途説明します。

以下の表は、Amazon EKS の [デフォルトの Fluentd または Fluent Bit ログ取得設定](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html) によって取得される CloudWatch ロググループとログを示しています。

|`/aws/containerinsights/Cluster_Name/host`	|`/var/log/dmesg`、`/var/log/secure`、および `/var/log/messages` からのログ。	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|`/var/log/journal` 内の `kubelet.service`、`kubeproxy.service`、および `docker.service` のログ。	|

ロギングに Container Insights と Fluent Bit または Fluentd を使用したくない場合は、Amazon EKS ノードにインストールされた CloudWatch エージェントを使用してノードとコンテナのログを取得できます。Amazon EKS ノードは EC2 インスタンスであるため、Amazon EC2 の標準的なシステムレベルのロギングアプローチに含める必要があります。Distributor と State Manager を使用して CloudWatch エージェントをインストールする場合、Amazon EKS ノードも CloudWatch エージェントのインストール、設定、更新に含まれます。以下の表は、ロギングに Container Insights と Fluent Bit または Fluentd を使用していない場合に取得する必要がある Kubernetes 固有のログを示しています。

|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|L-IPAM デーモンのログはここにあります	|
|---	|---	|

データプレーンのロギングについて詳しく学ぶには、[Amazon EKS ノードロギングの推奨ガイダンス](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html) を参照してください。



### Amazon EKS アプリケーションログ

Kubernetes 環境でアプリケーションを大規模に実行する際、Amazon EKS アプリケーションログの収集は不可欠です。アプリケーションログを収集するには、[Fluent Bit](https://fluentbit.io/)、[Fluentd](https://www.fluentd.org/)、または [CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) などのログアグリゲータを Amazon EKS クラスターにインストールする必要があります。

[Fluent Bit](https://fluentbit.io/) は C++ で書かれたオープンソースのログプロセッサおよびフォワーダーで、さまざまなソースからデータを収集し、フィルターで強化し、複数の宛先に送信できます。このガイドのソリューションを使用すると、ログ収集のために `aws-for-fluent-bit` または `fargate-fluentbit` を有効にできます。[Fluentd](https://www.fluentd.org/) は、統合ログ層用のオープンソースデータコレクターで、Ruby で書かれています。Fluentd は統合ログ層として機能し、複数のソースからデータを集約し、異なる形式のデータを JSON 形式のオブジェクトに統合し、さまざまな出力先にルーティングできます。何千台ものサーバーを監視する場合、ログコレクターの選択は CPU とメモリの使用率に重要です。複数の Amazon EKS クラスターがある場合、Fluent Bit を軽量シッパーとして使用してクラスター内の異なるノードからデータを収集し、Fluentd に転送して集約、処理、サポートされている出力先へのルーティングを行うことができます。

アプリケーションおよびクラスターログを CloudWatch に送信するログコレクターおよびフォワーダーとして Fluent Bit を使用することをお勧めします。その後、CloudWatch のサブスクリプションフィルターを使用してログを Amazon OpenSearch Service にストリーミングできます。このオプションは、このセクションのアーキテクチャ図に示されています。

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*図：Amazon EKS アプリケーションログのアーキテクチャ*

この図は、Amazon EKS クラスターからのアプリケーションログが Amazon OpenSearch Service にストリーミングされる際のワークフローを示しています。Amazon EKS クラスター内の Fluent Bit サービスがログを CloudWatch にプッシュします。AWS Lambda 関数がサブスクリプションフィルターを使用してログを Amazon OpenSearch Service にストリーミングします。その後、Kibana を使用して設定されたインデックスでログを可視化できます。また、Amazon Kinesis Data Firehose を使用してログをストリーミングし、[Amazon Athena](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/what-is.html) で分析およびクエリを行うために S3 バケットに保存することもできます。

ほとんどのクラスターでは、ログ集約に Fluentd または Fluent Bit を使用する場合、最適化はほとんど必要ありません。しかし、何千もの Pod とノードを持つ大規模なクラスターを扱う場合は状況が変わります。[何千もの Pod を持つクラスターでの Fluentd と Fluent Bit の影響に関する調査結果](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/) を公開しています。さらに学習を深めるために、[Kubernetes API サーバーへの API コール量を削減するように設計された Fluent Bit の拡張機能](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/) について確認することをお勧めします。これは *Use_Kubelet* オプションを使用します。この Fluent Bit の `Use_Kubelet` 機能により、ホスト上の kubelet から Pod メタデータを取得できます。Amazon EKS のお客様は、この機能を有効にすることで、何万もの Pod を実行するクラスターでも Kubernetes API サーバーに過負荷をかけることなく、Fluent Bit を使用してログをキャプチャできます。大規模な Kubernetes クラスターを実行していない場合でも、この機能を有効にすることをお勧めします。



#### Amazon EKS on Fargate のロギング

Amazon EKS on Fargate を使用すると、Kubernetes ノードを割り当てたり管理したりすることなく Pod をデプロイできます。これにより、Kubernetes ノードのシステムレベルのログをキャプチャする必要がなくなります。Fargate Pod からログをキャプチャするには、Fluent Bit を使用してログを直接 CloudWatch に転送できます。これにより、Amazon EKS on Fargate の Pod に対して追加の設定やサイドカーコンテナを使用することなく、自動的にログを CloudWatch にルーティングできます。詳細については、Amazon EKS ドキュメントの [Fargate ロギング](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/fargate-logging.html) と AWS ブログの [Amazon EKS 用 Fluent Bit](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/) を参照してください。このソリューションは、コンテナの `STDOUT` と `STDERR` の入出力 (I/O) ストリームをキャプチャし、Amazon EKS on Fargate クラスター用に確立された Fluent Bit 設定に基づいて CloudWatch に送信します。

Amazon EKS 用の Fluent Bit サポートにより、Fargate 上で実行されている Amazon EKS Pod からコンテナログをルーティングするためのサイドカーを実行する必要がなくなりました。新しい組み込みのロギングサポートにより、レコードを送信する宛先を選択できます。Amazon EKS on Fargate は、AWS が管理する Fluent Bit の上流に準拠したディストリビューションである AWS 用 Fluent Bit のバージョンを使用します。

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*図: Amazon EKS on Fargate のロギング*

Amazon EKS 用の Fluent Bit サポートの詳細については、Amazon EKS ドキュメントの [Fargate ロギング](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/fargate-logging.html) を参照してください。

いくつかの理由により、AWS Fargate 上で実行される Pod でサイドカーパターンを使用する必要がある場合があります。アプリケーションが生成するログをキャプチャするために、Fluentd（または [Fluent Bit](http://fluentbit.io/)）サイドカーコンテナを実行できます。このオプションでは、アプリケーションが `stdout` や `stderr` ではなくファイルシステムにログを書き込む必要があります。このアプローチの結果として、`kubectl` logs を使用してコンテナログを表示することはできなくなります。`kubectl logs` でログを表示できるようにするには、アプリケーションログを `stdout` とファイルシステムの両方に同時に書き込むことができます。

[Fargate 上の Pod には 20GB の一時ストレージ](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/fargate-pod-configuration.html)が提供され、Pod に属するすべてのコンテナで利用可能です。アプリケーションをローカルファイルシステムにログを書き込むように設定し、Fluentd にログディレクトリ（またはファイル）を監視するよう指示できます。Fluentd はログファイルの末尾からイベントを読み取り、CloudWatch などの保存先にイベントを送信します。ログが全ボリュームを占有しないように、定期的にログをローテーションすることを確認してください。

AWS Fargate 上で Kubernetes アプリケーションを大規模に運用および監視する方法については、[Amazon EKS on AWS Fargate 使用時にアプリケーションログをキャプチャする方法](https://aws.amazon.com/jp/blogs/news/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/) をご覧ください。このアプローチでは、`tee` を使用してファイルと `stdout` の両方に書き込むことで、`kubectl logs` でログを確認することもできます。



### AWS ネイティブサービスを使用した Amazon EKS および他のコンピューティングプラットフォームからの統合ログ集約

最近の顧客は、エージェント、ログルーター、拡張機能を使用して、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/jp/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/jp/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) (Amazon ECS)、[Amazon Kinesis Data Firehose](https://aws.amazon.com/jp/kinesis/data-firehose/)、[AWS Lambda](https://aws.amazon.com/jp/lambda/) などの異なるコンピューティングプラットフォーム全体でログを統合し、一元化することを望んでいます。そして、[Amazon OpenSearch Service](https://aws.amazon.com/jp/opensearch-service/) と OpenSearch Dashboards を使用して、異なるコンピューティングプラットフォーム全体で収集されたログを視覚化および分析し、アプリケーションの洞察を得ることができます。

統合されたログ集約システムは以下の利点を提供します：

* 異なるコンピューティングプラットフォーム全体のすべてのログへの単一のアクセスポイント
* [Amazon Simple Storage Service](https://aws.amazon.com/jp/s3) (Amazon S3)、Amazon OpenSearch Service、[Amazon Redshift](https://aws.amazon.com/jp/redshift) などのダウンストリームシステムに配信される前のログの変換を定義および標準化するのに役立つ
* Amazon OpenSearch Service を使用して素早くインデックスを作成し、OpenSearch Dashboards を使用してルーター、アプリケーション、その他のデバイスからのログを検索および視覚化する能力

以下の図は、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/jp/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/jp/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) (Amazon ECS)、[AWS Lambda](https://aws.amazon.com/jp/lambda/) などの異なるコンピューティングプラットフォーム全体でログ集約を実行するアーキテクチャを示しています。

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*図：異なるコンピューティングプラットフォーム全体でのログ集約。*

このアーキテクチャは、ログエージェント、ログルーター、Lambda 拡張機能などの様々なログ集約ツールを使用して、複数のコンピューティングプラットフォームからログを収集し、Kinesis Data Firehose に配信します。Kinesis Data Firehose は、ログを Amazon OpenSearch Service にストリーミングします。Amazon OpenSearch Service への永続化に失敗したログレコードは AWS S3 に書き込まれます。このアーキテクチャをスケールするために、これらのコンピューティングプラットフォームそれぞれが異なる Firehose 配信ストリームにログをストリーミングし、別のインデックスとして追加され、24 時間ごとにローテーションされます。

さらに学習するには、Kinesis Data Firehose と Amazon OpenSearch Service を使用して、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/jp/eks/) (Amazon EKS)、[Amazon Elastic Compute Cloud](https://aws.amazon.com/jp/ec2/) (Amazon EC2)、[Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) (Amazon ECS)、[AWS Lambda](https://aws.amazon.com/jp/lambda/) などの[異なるコンピューティングプラットフォーム全体でログを統合および一元化する方法](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/)をチェックしてください。このアプローチにより、異なるサービスに異なるプラットフォームを使用するのではなく、単一のプラットフォームを使用してログを迅速に分析し、障害の根本原因を特定することができます。



## まとめ

オブザーバビリティのベストプラクティスガイドのこのセクションでは、コントロールプレーンのロギング、ノードのロギング、アプリケーションのロギングという 3 種類の Kubernetes ロギングについて詳しく説明しました。さらに、Kinesis Data Firehose や Amazon OpenSearch Service などの AWS ネイティブサービスを使用して、Amazon EKS や他のコンピューティングプラットフォームからの統合ログ集約について学びました。より深く掘り下げるには、AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS ネイティブオブザーバビリティカテゴリにある Logs and Insights モジュールを実践することを強くおすすめします。
