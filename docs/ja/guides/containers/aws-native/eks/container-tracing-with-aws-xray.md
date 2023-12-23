# AWS X-Ray によるコンテナトレーシング

このオブザーバビリティのベストプラクティスガイドのセクションでは、AWS X-Ray によるコンテナトレーシングに関連する次のトピックを深掘りします。

* AWS X-Ray の概要
* AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用したトレース収集
* まとめ

### はじめに

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) は、アプリケーションが処理するリクエストに関するデータを収集し、そのデータを表示、フィルタリング、洞察するためのツールを提供するサービスです。これにより、問題の特定と最適化の機会を見出すことができます。アプリケーションへのトレースされた任意のリクエストについて、リクエストとレスポンスに関する詳細な情報を確認するだけでなく、アプリケーションが下流の AWS リソース、マイクロサービス、データベース、Web API への呼び出しに関する情報も確認できます。

アプリケーションへのインストルメンテーションには、入力および出力リクエストとアプリケーション内のその他のイベントのトレースデータを、各リクエストに関するメタデータとともに送信することが含まれます。多くのインストルメンテーション シナリオでは、構成変更のみが必要です。 たとえば、Java アプリケーションが行う、すべての入力 HTTP リクエストと AWS サービスへのダウンストリーム呼び出しをインストルメントできます。 アプリケーションを X-Ray トレースのためにインストルメントするために使用できるいくつかの SDK、エージェント、ツールがあります。 詳細については、[アプリケーションのインストルメンテーション](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。

AWS Distro for OpenTelemetry 用の Amazon EKS アドオンを使用して Amazon EKS クラスターからトレースを収集することによるコンテナ化されたアプリケーションのトレースについて学習します。

### AWS Distro for OpenTelemetry 用の Amazon EKS アドオンを使用したトレースの収集

[AWS X-Ray](https://aws.amazon.com/xray/) はアプリケーショントレース機能を提供し、デプロイされたすべてのマイクロサービスについて深い洞察を得ることができます。X-Ray を使用すると、関連するマイクロサービスを通過するにつれて、各リクエストをトレースできます。これにより、DevOps チームはサービスがピアとどのように対話するかを理解し、問題をより高速に分析およびデバッグするために必要な洞察を得ることができます。

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、OpenTelemetry プロジェクトのセキュアで AWS サポートのディストリビューションです。ユーザーはアプリケーションに 1 度インスツルメンテーションを適用するだけで、ADOT を使用して相関メトリクスとトレースを複数のモニタリングソリューションに送信できます。Amazon EKS では、クラスターがアップおよび実行された後いつでも、ADOT をアドオンとして有効にできるようになりました。ADOT アドオンには最新のセキュリティパッチとバグ修正が含まれており、Amazon EKS で動作することが AWS によって検証されています。

ADOT アドオンは Kubernetes Operator の実装であり、カスタムリソースを使用してアプリケーションとそのコンポーネントを管理する Kubernetes のソフトウェア拡張機能です。このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された構成設定に基づいて ADOT Collector のライフサイクルを管理します。

ADOT Collector には、レシーバー、プロセッサー、エクスポーターという 3 つの主要なタイプのコンポーネントで構成されるパイプラインの概念があります。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers) は、Collector にデータが入る方法です。特定の形式のデータを受け入れ、内部形式に変換し、パイプラインで定義されている [プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors) と [エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プルベースまたはプッシュベースのいずれかです。プロセッサーは、受信とエクスポートの間でデータに対してバッチ処理、フィルタリング、変換などのタスクを実行するために使用されるオプションのコンポーネントです。エクスポーターは、メトリクス、ログ、またはトレースを送信する宛先を決定するために使用されます。Collector アーキテクチャでは、Kubernetes YAML マニフェストを介してそのようなパイプラインの複数のインスタンスを設定できます。

次の図は、テレメトリデータを AWS X-Ray に送信するトレースパイプラインで構成された ADOT Collector を示しています。トレースパイプラインは、[AWS X-Ray レシーバー](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) と [AWS X-Ray エクスポーター](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) のインスタンスで構成されており、トレースを AWS X-Ray に送信します。

![Tracing-1](../../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*図: AWS Distro for OpenTelemetry 用の Amazon EKS アドオンを使用したトレースの収集。*

EKS クラスターに ADOT アドオンをインストールする詳細と、ワークロードからテレメトリデータを収集する方法を見ていきましょう。ADOT アドオンをインストールする前に必要な前提条件は次のとおりです。

* Kubernetes バージョン 1.19 以降をサポートする EKS クラスター。EKS クラスターは、[こちらで概説されているアプローチ](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)のいずれかを使用して作成できます。
* クラスターにまだインストールされていない場合は [Certificate Manager](https://cert-manager.io/)。[このドキュメント](https://cert-manager.io/docs/installation/) に従ってデフォルトの構成でインストールできます。
* クラスターに ADOT アドオンをインストールするための EKS アドオン用の Kubernetes RBAC アクセス許可。これは、[この YAML](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml) ファイルの設定を kubectl などの CLI ツールを使用してクラスターに適用することによって実行できます。

次のコマンドを使用して、EKS のさまざまなバージョンで有効になっているアドオンのリストを確認できます。

`aws eks describe-addon-versions`

JSON 出力には、以下に示すように、ADOT アドオンなどの他のアドオンがリストされる必要があります。EKS クラスターが作成されると、EKS アドオンはそのクラスターにアドオンをインストールしません。


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

バージョン文字列は、前述の出力の *addonVersion* フィールドの値と一致している必要があります。このコマンドの正常な実行からの出力は、次のようになります。

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

次のステップに進む前に、アドオンのステータスが ACTIVE になるまで待ちます。次のコマンドを使用してアドオンのステータスを確認できます。

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### ADOT Collector のデプロイ

ADOT アドオンは、カスタムリソースを利用してアプリケーションとそのコンポーネントを管理する Kubernetes の拡張機能である Kubernetes Operator の実装です。このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された設定に基づいて ADOT Collector のライフサイクルを管理します。次の図は、これがどのように機能するかを示したものです。

![Tracing-1](../../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*図: ADOT Collector のデプロイ*

次に、ADOT Collector のデプロイ方法を見ていきましょう。[こちらの YAML 設定ファイル](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) は OpenTelemetryCollector カスタムリソースを定義しています。これを EKS クラスターにデプロイすると、上記の最初の図に示すように、トレースとメトリクスのパイプラインで構成される ADOT Collector をプロビジョニングするために ADOT アドオンがトリガーされます。Collector は `aws-otel-eks` 名前空間に Kubernetes デプロイメントとして `${custom-resource-name}-collector` という名前で起動されます。同じ名前の ClusterIP サービスも起動されます。この Collector のパイプラインを構成する個々のコンポーネントを見ていきましょう。

トレースパイプラインの AWS X-Ray Receiver は、[X-Ray セグメントフォーマット](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html)のセグメントまたはスパンを受け入れることができるため、X-Ray SDK で計装されたマイクロサービスによって送信されたセグメントを処理できます。これは UDP ポート 2000 でトラフィックをリッスンするように設定されており、Cluster IP サービスとして公開されています。この設定に従って、トレースデータをこの Receiver に送信したいワークロードは、環境変数 `AWS_XRAY_DAEMON_ADDRESS` を `observability-collector.aws-otel-eks:2000` に設定する必要があります。エクスポーターは、これらのセグメントを [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API を使用して直接 X-Ray に送信します。

ADOT Collector は、`aws-otel-collector` という名前の Kubernetes サービスアカウントの ID で起動するように構成されています。これには、[設定](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) でも示されている ClusterRoleBinding と ClusterRole を使用してこれらのアクセス許可が付与されます。エクスポーターは、X-Ray にデータを送信するための IAM アクセス許可が必要です。これは、EKS でサポートされている [IAM ロール for サービスアカウント](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 機能を使用して、サービスアカウントを IAM ロールに関連付けることによって実現されます。IAM ロールには、AWSXRayDaemonWriteAccess などの AWS マネージドポリシーを関連付ける必要があります。[こちらのヘルパースクリプト](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh) は、CLUSTER_NAME と REGION の変数を設定した後、これらのアクセス許可を付与され、`aws-otel-collector` サービスアカウントに関連付けられた `EKS-ADOT-ServiceAccount-Role` という名前の IAM ロールを作成するために使用できます。

#### トレース収集のエンドツーエンドテスト

ここで、EKS クラスターにデプロイされたワークロードからのトレース収集をテストするために、これらすべてをまとめてみましょう。次のイラストは、このテストに使用されたセットアップを示しています。これは、一連の REST API を公開し、S3 およびデータストアサービスと対話するフロントエンドサービスで構成されています。データストアサービスは、Aurora PostgreSQL データベースのインスタンスと対話します。サービスには X-Ray SDK がインストルーメントされています。ADOT Collector は、前のセクションで説明した YAML マニフェストを使用して OpenTelemetryCollector カスタムリソースをデプロイすることにより、デプロイメントモードで起動されます。Postman クライアントは外部トラフィックジェネレータとして使用され、フロントエンドサービスを対象としています。

![Tracing-3](../../../../../images/Containers/aws-native/eks/tracing-3.jpg)  

*図: トレース収集のエンドツーエンドテスト*

次の画像は、サービスからキャプチャされたセグメントデータを使用して X-Ray によって生成されたサービスグラフを示しています。各セグメントの平均応答待ち時間も示されています。

![Tracing-4](../../../../../images/Containers/aws-native/eks/tracing-4.jpg)  

*図: CloudWatch サービスマップコンソール*

OTLP Receiver および AWS X-Ray Exporter を使用したトレースパイプラインの構成については、[Traces pipeline with OTLP Receiver and AWS X-Ray Exporter sending traces to AWS X-Ray](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) を参照してください。AWS X-Ray と連携して ADOT Collector を使用したいお客様は、これらの構成テンプレートから始め、プレースホルダー変数をターゲット環境に基づいて値に置き換え、ADOT 用 EKS アドオンを使用してコレクターを Amazon EKS クラスターにすばやくデプロイできます。

### EKS Blueprints を使用したコンテナートレースのための AWS X-Ray の設定

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) は、アカウントとリージョン間で一貫性のある、バッテリー同梱の EKS クラスターを構成およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)だけでなく、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD など、さまざまな一般的なオープンソース アドオンを備えた EKS クラスターを簡単にブートストラップできます。 EKS Blueprints は、インフラストラクチャの自動化に役立つ 2 つの一般的な IaC フレームワークである [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) で実装されています。

EKS Blueprints を使用した Amazon EKS クラスターの作成プロセスの一環として、AWS X-Ray を Day 2 の運用ツールとして設定し、コンテナ化されたアプリケーションとマイクロサービスからのメトリクスとログを収集、集約、要約し、Amazon CloudWatch コンソールに送信できます。

## まとめ

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon EKS アドオン for AWS Distro for OpenTelemetry を使用したトレース収集により、Amazon EKS 上のアプリケーションのコンテナートレーシングに AWS X-Ray を使用する方法について学びました。さらに学習するには、[Amazon EKS アドオン for AWS Distro for OpenTelemetry を使用したメトリクスとトレースの収集について、Amazon Managed Service for Prometheus と Amazon CloudWatch へ](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)をご確認ください。 最後に、EKS Blueprints を使用して、Amazon EKS クラスター作成プロセス中に AWS X-Ray を使用したコンテナートレーシングの設定を行う方法について簡単に説明しました。さらに詳細は、AWS の [One Observability ワークショップ](https://catalog.workshops.aws/observability/ja-JP) の **AWS ネイティブ** オブザーバビリティカテゴリー下の X-Ray トレース モジュールを実践することを強くおすすめします。
