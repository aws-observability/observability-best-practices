# AWS X-Ray を使用したコンテナトレーシング

このオブザーバビリティのベストプラクティスガイドのセクションでは、AWS X-Ray を使用したコンテナトレーシングに関連する以下のトピックについて詳しく説明します。

* AWS X-Ray の概要
* Amazon EKS add-ons for AWS Distro for OpenTelemetry を使用したトレースの収集
* まとめ

### はじめに

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) は、アプリケーションが処理するリクエストに関するデータを収集し、そのデータを表示、フィルタリング、分析して、問題を特定し最適化の機会を見つけるためのツールを提供するサービスです。アプリケーションへのトレースされたリクエストについて、リクエストとレスポンスに関する詳細情報だけでなく、アプリケーションがダウンストリームの AWS リソース、マイクロサービス、データベース、Web API に対して行う呼び出しに関する情報も確認できます。

アプリケーションのインストルメンテーションには、アプリケーション内の受信リクエストと送信リクエスト、およびその他のイベントのトレースデータを、各リクエストに関するメタデータとともに送信することが含まれます。多くのインストルメンテーションシナリオでは、設定の変更のみが必要です。たとえば、Java アプリケーションが行うすべての受信 HTTP リクエストと AWS サービスへのダウンストリーム呼び出しをインストルメント化できます。X-Ray トレーシング用にアプリケーションをインストルメント化するために使用できる SDK、エージェント、ツールがいくつかあります。詳細については、[アプリケーションのインストルメンテーション](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html)を参照してください。

Amazon EKS クラスター向けの AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用してトレースを収集することで、コンテナ化されたアプリケーションのトレーシングについて学習します。 

### AWS Distro for OpenTelemetry の Amazon EKS アドオンを使用したトレースの収集

[AWS X-Ray](https://aws.amazon.com/xray/) はアプリケーショントレーシング機能を提供し、デプロイされたすべてのマイクロサービスに関する深い洞察を提供します。X-Ray を使用すると、すべてのリクエストが関連するマイクロサービスを通過する際にトレースできます。これにより、DevOps チームはサービスが相互にどのように連携しているかを理解するために必要な洞察を得ることができ、問題の分析とデバッグをはるかに高速に行うことができます。

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、OpenTelemetry プロジェクトの安全な AWS サポート版ディストリビューションです。ユーザーはアプリケーションを一度だけ計装し、ADOT を使用して、相関するメトリクスとトレースを複数のモニタリングソリューションに送信できます。Amazon EKS では、クラスターが起動して実行された後、いつでも ADOT をアドオンとして有効にできるようになりました。ADOT アドオンには最新のセキュリティパッチとバグ修正が含まれており、Amazon EKS で動作することが AWS によって検証されています。

ADOT アドオンは Kubernetes Operator の実装であり、カスタムリソースを使用してアプリケーションとそのコンポーネントを管理する Kubernetes のソフトウェア拡張機能です。このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された設定に基づいて ADOT Collector のライフサイクルを管理します。

ADOT Collector には、receiver、processor、exporter という 3 つの主要なコンポーネントタイプで構成されるパイプラインの概念があります。[receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) は、データがコレクターに取り込まれる方法です。特定の形式でデータを受け入れ、内部形式に変換し、パイプラインで定義された [processor](https://opentelemetry.io/docs/collector/configuration/#processors) と [exporter](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プルベースまたはプッシュベースのいずれかになります。processor は、受信されてからエクスポートされるまでの間に、データに対してバッチ処理、フィルタリング、変換などのタスクを実行するために使用されるオプションのコンポーネントです。exporter は、メトリクス、ログ、またはトレースの送信先を決定するために使用されます。コレクターアーキテクチャでは、Kubernetes YAML マニフェストを介して、このようなパイプラインの複数のインスタンスをセットアップできます。

次の図は、トレースパイプラインで構成された ADOT Collector を示しており、テレメトリデータを AWS X-Ray に送信します。トレースパイプラインは、[AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) と [AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) のインスタンスで構成され、トレースを AWS X-Ray に送信します。 

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*図: AWS Distro for OpenTelemetry 用の Amazon EKS アドオンを使用したトレースの収集。*

EKS クラスタに ADOT アドオンをインストールし、ワークロードからテレメトリデータを収集する詳細について見ていきましょう。以下は、ADOT アドオンをインストールする前に必要な前提条件のリストです。

* Kubernetes バージョン 1.19 以上をサポートする EKS クラスター。EKS クラスターは、[こちらで説明されているアプローチ](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)のいずれかを使用して作成できます。
* [Certificate Manager](https://cert-manager.io/)（クラスターにまだインストールされていない場合）。[このドキュメント](https://cert-manager.io/docs/installation/)に従ってデフォルト設定でインストールできます。
* クラスターに ADOT アドオンをインストールするための EKS アドオン専用の Kubernetes RBAC 権限。これは、kubectl などの CLI ツールを使用して、[この YAML の設定](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml)ファイルをクラスターに適用することで実行できます。

次のコマンドを使用して、EKS のさまざまなバージョンで有効になっているアドオンのリストを確認できます。

`aws eks describe-addon-versions`

JSON 出力には、以下に示すように、ADOT アドオンが他のアドオンとともにリストされます。EKS クラスターが作成されると、EKS アドオンはその上にアドオンをインストールしないことに注意してください。


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

次に、以下のコマンドを使用して ADOT アドオンをインストールできます。

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

バージョン文字列は、前述の出力の *addonVersion* フィールドの値と一致する必要があります。このコマンドの正常な実行による出力は次のようになります。

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

次のステップに進む前に、アドオンが ACTIVE ステータスになるまで待ちます。アドオンのステータスは、次のコマンドを使用して確認できます。

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### ADOT Collector のデプロイ

ADOT アドオンは Kubernetes Operator の実装であり、カスタムリソースを使用してアプリケーションとそのコンポーネントを管理する Kubernetes のソフトウェア拡張機能です。このアドオンは OpenTelemetryCollector という名前のカスタムリソースを監視し、カスタムリソースで指定された設定に基づいて ADOT Collector のライフサイクルを管理します。次の図は、これがどのように機能するかを示しています。

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*図: ADOT Collector のデプロイ。*

次に、ADOT Collector のデプロイ方法を見ていきましょう。[こちらの YAML 設定ファイル](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)は、OpenTelemetryCollector カスタムリソースを定義しています。EKS クラスターにデプロイすると、ADOT アドオンがトリガーされ、上記の最初の図に示されているように、コンポーネントを含むトレースとメトリクスのパイプラインを備えた ADOT Collector がプロビジョニングされます。Collector は次の場所に起動されます `aws-otel-eks` namespace に Kubernetes Deployment として作成されます。名前は `${custom-resource-name}-collector`同じ名前の ClusterIP サービスも起動されます。このコレクターのパイプラインを構成する個々のコンポーネントを見ていきましょう。

トレースパイプラインの AWS X-Ray Receiver は、[X-Ray セグメント形式](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html)のセグメントまたはスパンを受け入れます。これにより、X-Ray SDK でインストルメント化されたマイクロサービスから送信されたセグメントを処理できます。UDP ポート 2000 でトラフィックをリッスンするように設定されており、Cluster IP サービスとして公開されています。この設定に従い、このレシーバーにトレースデータを送信するワークロードは、環境変数を使用して設定する必要があります。 `AWS_XRAY_DAEMON_ADDRESS` に設定 `observability-collector.aws-otel-eks:2000`エクスポーターは、[PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API を使用して、これらのセグメントを X-Ray に直接送信します。

ADOT Collector は、次の名前の Kubernetes サービスアカウントの ID で起動されるように設定されています `aws-otel-collector`ClusterRoleBinding と ClusterRole を使用してこれらの権限が付与されます。これらも[設定](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)に示されています。エクスポーターが X-Ray にデータを送信するには、IAM 権限が必要です。これは、EKS でサポートされている [IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 機能を使用して、サービスアカウントを IAM ロールに関連付けることで実現されます。IAM ロールは、AWSXRayDaemonWriteAccess などの AWS マネージド型ポリシーに関連付ける必要があります。CLUSTER_NAME と REGION 変数を設定した後、[こちらのヘルパースクリプト](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh)を使用して、次の名前の IAM ロールを作成できます `EKS-ADOT-ServiceAccount-Role` これらの権限が付与され、関連付けられている `aws-otel-collector` サービスアカウント。

#### トレース収集のエンドツーエンドテスト

それでは、これらすべてをまとめて、EKS クラスターにデプロイされたワークロードからのトレース収集をテストしてみましょう。次の図は、このテストで使用されるセットアップを示しています。これは、一連の REST API を公開し、S3 と対話するフロントエンドサービスと、Aurora PostgreSQL データベースのインスタンスと対話するデータストアサービスで構成されています。サービスは X-Ray SDK でインストルメント化されています。ADOT Collector は、前のセクションで説明した YAML マニフェストを使用して OpenTelemetryCollector カスタムリソースをデプロイすることにより、Deployment モードで起動されます。Postman クライアントは、フロントエンドサービスをターゲットとする外部トラフィックジェネレーターとして使用されます。

![Tracing-3](../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*図: トレース収集のエンドツーエンドテスト。*

次の画像は、サービスから取得したセグメントデータを使用して X-Ray が生成したサービスグラフを示しており、各セグメントの平均応答レイテンシーが表示されています。

![Tracing-4](../../../../images/Containers/aws-native/eks/tracing-4.jpg)

図: CloudWatch Service Map コンソール。*

トレースパイプラインの設定に関連する OpenTelemetryCollector カスタムリソース定義については、[OTLP Receiver と AWS X-Ray Exporter を使用して AWS X-Ray にトレースを送信するトレースパイプライン](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml)を確認してください。AWS X-Ray と組み合わせて ADOT Collector を使用したいお客様は、これらの設定テンプレートから始めて、プレースホルダー変数をターゲット環境に基づいた値に置き換え、ADOT 用 EKS アドオンを使用して Amazon EKS クラスターにコレクターを迅速にデプロイできます。


### EKS Blueprints を使用した AWS X-Ray によるコンテナトレーシングのセットアップ

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) は、アカウントやリージョン全体で一貫性のある、すぐに使える EKS クラスターを設定およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)や、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD など、幅広い人気のオープンソースアドオンを使用して、EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、[HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) という 2 つの人気のある IaC フレームワークで実装されており、インフラストラクチャのデプロイを自動化するのに役立ちます。

EKS Blueprints を使用した Amazon EKS クラスター作成プロセスの一環として、AWS X-Ray を Day 2 運用ツールとしてセットアップし、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約して Amazon CloudWatch コンソールに送信できます。

## まとめ

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon EKS add-ons for AWS Distro for OpenTelemetry を使用したトレース収集により、Amazon EKS 上のアプリケーションのコンテナトレーシングに AWS X-Ray を使用する方法について学びました。さらに学習するには、[Amazon EKS add-ons for AWS Distro for OpenTelemetry を使用した Amazon Managed Service for Prometheus と Amazon CloudWatch へのメトリクスとトレースの収集](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)をご確認ください。最後に、Amazon EKS クラスター作成プロセス中に AWS X-Ray を使用したコンテナトレーシングをセットアップする手段として EKS Blueprints を使用する方法について簡単に説明しました。さらに深く学習するには、AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の **AWS native** オブザーバビリティカテゴリにある X-Ray Traces モジュールを実践することを強くお勧めします。
