# AWS X-Ray によるコンテナトレーシング

このオブザーバビリティのベストプラクティスガイドのセクションでは、AWS X-Ray によるコンテナトレーシングに関連する以下のトピックを深掘りします。

* AWS X-Ray の概要
* AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用したトレースの収集
* まとめ

### はじめに

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) は、アプリケーションが処理するリクエストに関するデータを収集し、そのデータを見たり、フィルタリングしたり、洞察を得るためのツールを提供するサービスです。これにより、問題の特定と最適化の機会を見出すことができます。アプリケーションに対するトレースされたリクエストでは、リクエストとレスポンスに関する詳細情報だけでなく、ダウンストリームの AWS リソース、マイクロサービス、データベース、Web API へのアプリケーションの呼び出しについても確認できます。

アプリケーションの計装には、着信および発信リクエストとアプリケーション内の他のイベントのトレースデータを、各リクエストに関するメタデータとともに送信することが含まれます。多くの計装シナリオでは、構成変更のみが必要です。 たとえば、Java アプリケーションが行うすべての着信 HTTP リクエストとダウンストリームの AWS サービス呼び出しを計装できます。 アプリケーションを X-Ray トレースのために計装するために使用できるいくつかの SDK、エージェント、ツールがあります。 詳細については、[アプリケーションの計装](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。

AWS Distro for OpenTelemetry 用の Amazon EKS アドオンを使用して Amazon EKS クラスタからトレースを収集することによるコンテナ化アプリケーションのトレーシングについて学習します。

### Amazon EKS アドオン for AWS Distro for OpenTelemetry を使用したトレースの収集

[AWS X-Ray](https://aws.amazon.com/xray/) は、デプロイされたすべてのマイクロサービスについて深い洞察を提供するアプリケーショントレーシング機能を提供します。X-Ray を使用すると、関連するマイクロサービスを通過するにつれて、すべてのリクエストをトレースできます。これにより、DevOps チームはサービスがピアとどのように対話するかを理解し、問題をはるかに高速に分析およびデバッグできる洞察を得ることができます。

[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/docs/introduction) は、セキュアで AWS サポートの OpenTelemetry プロジェクトのディストリビューションです。ユーザーはアプリケーションに一度インスツルメンテーションを適用するだけで、ADOT を使用して相関メトリクスとトレースを複数のモニタリングソリューションに送信できます。Amazon EKS では、クラスターがアップおよび実行された後いつでも、ADOT をアドオンとして有効にできるようになりました。ADOT アドオンには、最新のセキュリティパッチとバグ修正が含まれており、Amazon EKS で機能することが AWS によって検証されています。

ADOT アドオンは Kubernetes Operator の実装であり、カスタムリソースを使用してアプリケーションとそのコンポーネントを管理するために Kubernetes を拡張するソフトウェア拡張機能です。このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された構成設定に基づいて ADOT Collector のライフサイクルを管理します。

ADOT Collector には、レシーバー、プロセッサー、エクスポーターという 3 つの主要なタイプのコンポーネントで構成されるパイプラインの概念があります。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers) は、データが Collector に入る方法です。特定の形式のデータを受け入れ、内部形式に変換し、パイプラインで定義されている [プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors) および [エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プルベースまたはプッシュベースのいずれかです。プロセッサーは、受信とエクスポートの間のデータに対してバッチ処理、フィルタリング、変換などのタスクを実行するために使用されるオプションのコンポーネントです。エクスポーターは、メトリクス、ログ、またはトレースを送信する宛先を決定するために使用されます。Collector アーキテクチャを使用すると、Kubernetes YAML マニフェストを介してこのようなパイプラインの複数のインスタンスを設定できます。

次の図は、AWS X-Ray にテレメトリデータを送信するトレースパイプラインで構成された ADOT Collector を示しています。トレースパイプラインは、[AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) と [AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) のインスタンスで構成されており、トレースを AWS X-Ray に送信します。

![Tracing-1](../../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*図: Amazon EKS アドオン for AWS Distro for OpenTelemetry を使用したトレースの収集。*

EKS クラスターに ADOT アドオンをインストールし、ワークロードからテレメトリデータを収集する詳細について見ていきましょう。ADOT アドオンをインストールする前に必要な前提条件のリストを以下に示します。

* Kubernetes バージョン 1.19 以降をサポートする EKS クラスター。[こちらで概説されているアプローチ](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)のいずれかを使用して EKS クラスターを作成できます。
* クラスターにまだインストールされていない場合は [Certificate Manager](https://cert-manager.io/)。[このドキュメント](https://cert-manager.io/docs/installation/) に従ってデフォルトの構成でインストールできます。
* クラスターに ADOT アドオンをインストールするための EKS アドオン用の Kubernetes RBAC 権限。これは、[この YAML](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml) ファイルの設定を kubectl などの CLI ツールを使用してクラスターに適用することによって実行できます。

次のコマンドを使用して、さまざまなバージョンの EKS で有効になっているアドオンのリストを確認できます。

`aws eks describe-addon-versions`

JSON 出力には、以下に示すように、ADOT アドオンなどの他のアドオンがリストされている必要があります。EKS クラスターが作成されると、EKS アドオンはそれにアドオンをインストールしないことに注意してください。


```
{
   "addonName":"adot",
   "type":"observability",
   "addonVersions":[
      {
         "addonVersion":"v0.45.0-eksbuild.1",
         "architecture":[
            "amd64"
         ],
         "compatibilities":[
            {
               "clusterVersion":"1.22",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.21",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.20",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.19",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            }
         ]
      }
   ]
}
```

次に、次のコマンドを使用して ADOT アドオンをインストールできます。

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

バージョン文字列は、前述の出力の *addonVersion* フィールドの値と一致している必要があります。このコマンドの正常な実行からの出力は次のようになります。

```
{
    "addon": {
        "addonName": "adot",
        "clusterName": "k8s-production-cluster",
        "status": "ACTIVE",
        "addonVersion": "v0.45.0-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",
        "createdAt": "2022-04-04T10:36:56.966000+05:30",
        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",
        "tags": {}
    }
}
```

次のステップに進む前に、アドオンのステータスが ACTIVE であることを待ちます。次のコマンドを使用してアドオンのステータスを確認できます。

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### ADOT Collector のデプロイ

ADOT アドオンは、Kubernetes Operator の実装であり、カスタムリソースを利用してアプリケーションとそのコンポーネントを管理する Kubernetes のソフトウェア拡張機能です。
このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された設定に基づいて ADOT Collector のライフサイクルを管理します。
次の図は、この動作を示したものです。

![Tracing-1](../../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*図: ADOT Collector のデプロイ*

次に、ADOT Collector のデプロイ方法を見ていきましょう。
[こちらの YAML 設定ファイル](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) は、OpenTelemetryCollector カスタムリソースを定義しています。
EKS クラスターにデプロイすると、上記の最初のイラストで示されているように、トレースとメトリクスのパイプラインとコンポーネントを含む ADOT Collector をプロビジョニングするために、ADOT アドオンがトリガーされます。
Collector は `aws-otel-eks` ネームスペースに Kubernetes Deployment として起動され、名前は `${custom-resource-name}-collector` です。
同じ名前の ClusterIP サービスも起動されます。
この Collector のパイプラインを構成する個々のコンポーネントを見ていきましょう。

トレースパイプラインの AWS X-Ray Receiver は、[X-Ray Segment 形式](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html)のセグメントまたはスパンを受け入れます。これにより、X-Ray SDK で計装されたマイクロサービスから送信されたセグメントを処理できるようになります。
UDP ポート 2000 でのトラフィックをリッスンするように設定されており、Cluster IP サービスとして公開されています。
この設定に従って、トレースデータをこの Receiver に送信したいワークロードは、環境変数 `AWS_XRAY_DAEMON_ADDRESS` を `observability-collector.aws-otel-eks:2000` に設定する必要があります。
エクスポーターは、これらのセグメントを [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API を使用して直接 X-Ray に送信します。

ADOT Collector は、`aws-otel-collector` という名前の Kubernetes サービスアカウントの ID で起動するように設定されています。これには、[設定](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) でも示されている ClusterRoleBinding と ClusterRole を使用してこれらのアクセス許可が付与されます。
エクスポーターは、データを X-Ray に送信するための IAM アクセス許可が必要です。
これは、EKS でサポートされている [IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 機能を使用して、サービスアカウントを IAM ロールに関連付けることによって実現されます。
IAM ロールには、AWSXRayDaemonWriteAccess などの AWS マネージドポリシーを関連付ける必要があります。
[こちらのヘルパースクリプト](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh) は、CLUSTER_NAME と REGION の変数を設定した後、これらのアクセス許可を付与され、`aws-otel-collector` サービスアカウントに関連付けられた `EKS-ADOT-ServiceAccount-Role` という名前の IAM ロールを作成するために使用できます。

#### トレース収集のエンドツーエンドテスト

ここで、すべてをまとめて、EKS クラスターにデプロイされたワークロードからのトレース収集をテストしましょう。次の図は、このテストに使用された設定を示しています。これは、一連の REST API を公開し、S3 およびデータストアサービスと対話するフロントエンドサービスと、Aurora PostgreSQL データベースのインスタンスと対話するデータストアサービスで構成されています。サービスには X-Ray SDK がインストルーメントされています。ADOT Collector は、前のセクションで説明した YAML マニフェストを使用して OpenTelemetryCollector カスタムリソースをデプロイすることにより、デプロイメントモードで起動されます。Postman クライアントは、フロントエンドサービスを対象とした外部トラフィックジェネレータとして使用されます。

![Tracing-3](../../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*図: トレース収集のエンドツーエンドテスト。*

次の画像は、サービスからキャプチャされたセグメントデータを使用して X-Ray によって生成されたサービスグラフで、各セグメントの平均応答待ち時間を示しています。

![Tracing-4](../../../../../images/Containers/aws-native/eks/tracing-4.jpg)  

*図: CloudWatch サービスマップコンソール。*

トレースパイプライン構成に関連する OpenTelemetryCollector カスタムリソース定義については、[OTLP レシーバーと AWS X-Ray エクスポーターを使用したトレースパイプライン、トレースを AWS X-Ray に送信](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) をご確認ください。AWS X-Ray と連携して ADOT Collector を使用したいお客様は、これらの構成テンプレートから始め、プレースホルダ変数をターゲット環境に基づいた値に置き換え、ADOT 用 EKS アドオンを使用してコレクターを Amazon EKS クラスターにすばやくデプロイできます。

### EKS Blueprints を使用したコンテナートレーシングのための AWS X-Ray の設定

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) は、アカウントとリージョン間で一貫性のある、バッテリー同梱の EKS クラスターを構成およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)とともに Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD など、さまざまな一般的なオープンソース アドオンを備えた EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、インフラストラクチャのデプロイメントを自動化するのに役立つ 2 つの一般的な IaC フレームワークである [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) で実装されています。

EKS Blueprints を使用した Amazon EKS クラスターの作成プロセスの一環として、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約し、Amazon CloudWatch コンソールに出力するための Day 2 運用ツールとして AWS X-Ray を設定できます。

## 結論

オブザーバビリティのベストプラクティスガイドのこのセクションでは、AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用したトレース収集により、Amazon EKS 上のアプリケーションのコンテナートレーシングに AWS X-Ray を使用する方法について学びました。さらに学習するには、[AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用したメトリクスとトレースの収集](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/) をご確認ください。 最後に、EKS ブループリントを使用して、Amazon EKS クラスターの作成プロセス中に AWS X-Ray を使用したコンテナートレーシングのセットアップを行う方法について簡単に説明しました。さらに掘り下げるには、AWS の [One Observability ワークショップ](https://catalog.workshops.aws/observability/en-US) の **AWS ネイティブ** オブザーバビリティカテゴリーの X-Ray トレースモジュールを実践することを強くおすすめします。
