# Amazon CloudWatch Container Insights

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon CloudWatch Container Insights に関連する次のトピックを深掘りします。

* Amazon CloudWatch Container Insights の概要
* AWS Distro for OpenTelemetry での Amazon CloudWatch Container Insights の使用  
* Amazon EKS の CloudWatch Container Insights 用 Fluent Bit インテグレーション
* Amazon EKS での Container Insights によるコスト削減
* EKS ブループリントを使用した Container Insights の設定

### はじめに

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するのに役立ちます。メトリクスデータは、[埋め込みメトリックフォーマット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)を使用したパフォーマンスログイベントとして収集されます。これらのパフォーマンスログイベントは、高基数データを大規模に取り込み、保存できるように構造化された JSON スキーマを使用します。このデータから、CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで CloudWatch メトリクスとして集計メトリクスを作成します。Container Insights が収集するメトリクスは、CloudWatch の自動ダッシュボードで利用できます。Container Insights は、セルフマネージドノードグループ、マネージドノードグループ、AWS Fargate プロファイルを持つ Amazon EKS クラスターで利用できます。

コスト最適化の観点から、Container Insights のコストを管理するのに役立つように、CloudWatch はログデータから可能なすべてのメトリクスを自動的に作成しません。ただし、CloudWatch Logs Insights を使用して生のパフォーマンスログイベントを分析することで、追加のメトリクスとより詳細な粒度レベルを表示できます。Container Insights によって収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch 料金](https://aws.amazon.com/cloudwatch/pricing/) を参照してください。

Amazon EKS では、Container Insights は Amazon Elastic Container Registry を介して Amazon が提供するコンテナ化された [CloudWatch エージェント](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) バージョンを使用して、クラスター内のすべての実行中コンテナを検出します。次に、パフォーマンススタックのすべてのレベルでパフォーマンスデータを収集します。Container Insights は、収集するログとメトリクスの AWS KMS キーによる暗号化をサポートしています。この暗号化を有効にするには、Container Insights データを受信するロググループで AWS KMS 暗号化を手動で有効にする必要があります。これにより、CloudWatch Container Insights が提供された AWS KMS キーを使用してこのデータを暗号化します。サポートされているのは対称キーのみであり、非対称 AWS KMS キーによるロググループの暗号化はサポートされていません。Container Insights は Linux インスタンスでのみサポートされています。Amazon EKS 用の Container Insights は、[こちらの](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) AWS リージョンでサポートされています。

### AWS Distro for OpenTelemetry を使用した Amazon CloudWatch Container Insights

次に、Amazon EKS ワークロードからコンテナインサイトメトリクスの収集を有効にするオプションの1つである [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) について詳しく見ていきます。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、[OpenTelemetry](https://opentelemetry.io/docs/) プロジェクトのセキュアで AWS サポートのディストリビューションです。ADOT を使用すると、ユーザーはアプリケーションを 1 回だけ計装して、相関メトリクスとトレースを複数のモニタリングソリューションに送信できます。ADOT が CloudWatch Container Insights をサポートすることで、[Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand≻_channel=PS≻_campaign=acquisition_US≻_publisher=Google≻_category=Cloud%20Computing≻_country=US≻_geo=NAMER≻_outcome=acq≻_detail=amazon%20ec2≻_content=EC2_e≻_matchtype=e≻_segment=467723097970≻_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) 上で実行されている Amazon EKS クラスターから CPU、メモリ、ディスク、ネットワークの使用状況などのシステムメトリクスを収集できるようになり、Amazon CloudWatch エージェントと同じエクスペリエンスが提供されます。ADOT Collector は現在、Amazon EKS および Amazon EKS 用の AWS Fargate プロファイルの CloudWatch Container Insights をサポートしています。お客様は現在、Amazon EKS クラスターにデプロイされた Pod の CPU やメモリの利用率などのコンテナと Pod のメトリクスを収集し、既存の CloudWatch Container Insights エクスペリエンスを変更することなく CloudWatch ダッシュボードでそれらを表示できます。これにより、お客様はトラフィックに対応してスケールアップまたはスケールダウンを決定し、コストを節約することもできます。

ADOT Collector には、[パイプラインの概念](https://opentelemetry.io/docs/collector/configuration/)があり、レシーバー、プロセッサー、エクスポーターの 3 つの主要なコンポーネントタイプで構成されています。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers) は、データがコレクターに入る方法です。指定された形式でデータを受け入れ、内部形式に変換して、パイプラインで定義されている [プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors) と [エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プルベースまたはプッシュベースのいずれかです。プロセッサーは、受信とエクスポートの間のデータに対してバッチ処理、フィルタリング、変換などのタスクを実行するために使用されるオプションのコンポーネントです。エクスポーターは、メトリクス、ログ、トレースを送信する宛先を決定するために使用されます。コレクターアーキテクチャを使用すると、YAML 設定を介してそのようなパイプラインの複数のインスタンスを定義できます。次の図は、Amazon EKS にデプロイされた ADOT Collector インスタンスと Amazon EKS with Fargate プロファイルのパイプラインコンポーネントを示しています。

![CW-ADOT-EKS](../../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*図: Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、パイプラインで [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) のインスタンスをデプロイし、Kubelet から直接メトリクスを収集しています。AWS Container Insights Receiver (`awscontainerinsightreceiver`) は、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) をサポートする AWS 専用のレシーバーです。CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集計、要約します。データは、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)を使用してパフォーマンスログイベントとして収集されます。EMF データから、Amazon CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集計された CloudWatch メトリクスを作成できます。以下は、サンプルの `awscontainerinsightreceiver` 設定の例です。

```
receivers:
  awscontainerinsightreceiver:
    # all parameters are optional
    collection_interval: 60s
    container_orchestrator: eks
    add_service_as_attribute: true 
    prefer_full_pod_name: false 
    add_full_pod_name_metric_label: false 
```

これは、上記の構成を使用してコレクターを Amazon EKS 上に DaemonSet としてデプロイすることを意味します。このレシーバーから直接収集されるより完全なメトリクスセットにもアクセスできます。ADOT Collector のインスタンスが複数あれば、クラスター内のすべてのノードからリソースメトリクスを収集するのに十分です。ADOT コレクターの単一インスタンスでは、高負荷時に圧倒される可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

![CW-ADOT-FARGATE](../../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*図: Amazon EKS with Fargate プロファイルにデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、Kubernetes クラスター内のワーカーノード上の kubelet は、*/metrics/cadvisor* エンドポイントで CPU、メモリ、ディスク、ネットワークの使用状況などのリソースメトリクスを公開します。ただし、EKS Fargate ネットワーキングアーキテクチャでは、Pod が直接そのワーカーノード上の kubelet に到達することはできません。したがって、ADOT Collector は Kubernetes API サーバーを呼び出して、そのノード上のワーカーノードの kubelet への接続をプロキシし、そのノード上のワークロードの kubelet の cAdvisor メトリクスを収集します。これらのメトリクスは Prometheus 形式で利用できるようになっています。したがって、コレクターは Prometheus サーバーのドロップイン置換として [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) のインスタンスを使用し、これらのメトリクスを Kubernetes API サーバーエンドポイントからスクレイピングします。Kubernetes のサービスディスカバリを使用すると、レシーバーは EKS クラスター内のすべてのワーカーノードを検出できます。したがって、ADOT Collector のインスタンスが複数あれば、クラスター内のすべてのノードからリソースメトリクスを収集するのに十分です。ADOT コレクターの単一インスタンスでは、高負荷時に圧倒される可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

メトリクスは、フィルタリング、名前の変更、データ集計と変換などを実行する一連のプロセッサを経由します。以下は、上記の Amazon EKS 用に示されている ADOT Collector インスタンスのパイプラインで使用されるプロセッサのリストです。

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) は AWS OpenTelemetry ディストリビューションの一部で、名前に基づいてメトリクスを含めたり除外したりします。メトリクス収集パイプラインの一部として使用して、不要なメトリクスをフィルタリングできます。たとえば、Container Insights がネットワーク関連のプレフィックス `pod_network` を除く、プレフィックス `pod_` を持つポッドレベルのメトリクスのみを収集する場合を想定します。

```
      # filter out only renamed metrics which we care about
      filter:
        metrics:
          include:
            match_type: regexp
            metric_names:
              - new_container_.*
              - pod_.*
```

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) を使用して、メトリクスの名前を変更したり、ラベルキーと値を追加、名前変更、削除したりできます。また、ラベルやラベル値にわたってメトリクスのスケーリングと集計を実行するためにも使用できます。

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) は、単調増加の累積和とヒストグラムメトリクスを単調増加のデルタメトリクスに変換します。非単調和と指数ヒストグラムは除外されます。

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) は、デルタ和メトリクスをレートメトリクスに変換します。このレートはゲージです。

```
` # convert delta to rate
    deltatorate:
        metrics:
            - pod_memory_hierarchical_pgfault 
            - pod_memory_hierarchical_pgmajfault 
            - pod_network_rx_bytes 
            - pod_network_rx_dropped 
            - pod_network_rx_errors 
            - pod_network_tx_errors 
            - pod_network_tx_packets 
            - new_container_memory_pgfault 
            - new_container_memory_pgmajfault 
            - new_container_memory_hierarchical_pgfault 
            - new_container_memory_hierarchical_pgmajfault`
```

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) を使用すると、既存のメトリクスに従って指定されたルールを使用して新しいメトリクスを作成できます。

```
      experimental_metricsgeneration/1:
        rules:
          - name: pod_memory_utilization_over_pod_limit
            unit: Percent
            type: calculate
            metric1: pod_memory_working_set
            metric2: pod_memory_limit
            operation: percent
```

パイプラインの最終コンポーネントは、[AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) で、メトリクスを埋め込みメトリクス形式 (EMF) に変換してから [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API を使用して直接 CloudWatch Logs に送信します。ADOT Collector によって Amazon EKS 上で実行されている各ワークロードの CloudWatch に送信されるメトリクスのリストを以下に示します。

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

各メトリクスは、次のディメンションセットに関連付けられ、*ContainerInsights* という名前の CloudWatch ネームスペースで収集されます。

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

さらに、[ADOT の Container Insights Prometheus サポート](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) と [CloudWatch Container Insights を使用した Amazon EKS リソースメトリクスの視覚化のための Amazon EKS への ADOT コレクターのデプロイ](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/) について学習してください。これにより、Amazon EKS クラスターに ADOT コレクターパイプラインを設定し、CloudWatch Container Insights で Amazon EKS リソースメトリクスを視覚化する方法がわかります。

### Amazon EKS の CloudWatch Container Insights との Fluent Bit インテグレーション

[Fluent Bit](https://fluentbit.io/) は、オープンソースのマルチプラットフォームなログ処理および転送ツールで、さまざまなソースからデータとログを収集し、CloudWatch Logs を含むさまざまなデスティネーションに統合して送信できます。また、[Docker](https://www.docker.com/) および [Kubernetes](https://kubernetes.io/) 環境と完全に互換性があります。新しくリリースされた Fluent Bit デーモンセットを使用することで、EKS クラスターからのコンテナーログを CloudWatch Logs に送信し、ログの保存と分析ができます。

軽量な性質のため、EKS ワーカーノードの Container Insights でデフォルトのログ転送として Fluent Bit を使用することで、アプリケーションログを効率的かつ信頼性高く CloudWatch Logs にストリーミングできます。Fluent Bit を使うことで、Container Insights は Pod レベルの CPU やメモリ利用効率の点でリソース効率的な方法で、大規模にビジネスクリティカルなログを数千件提供できます。つまり、以前使用されていたログ転送ツールである FluentD と比較して、Fluent Bit はリソースフットプリントが小さく、結果としてメモリや CPU の点でよりリソース効率的です。一方、Fluent Bit と関連プラグインを含む [AWS for Fluent Bit イメージ](https://github.com/aws/aws-for-fluent-bit) は、イメージが AWS エコシステム内で統一されたエクスペリエンスを提供することを目的としているため、Fluent Bit に新しい AWS 機能をより迅速に採用する柔軟性を追加します。

以下のアーキテクチャは、EKS 用の CloudWatch Container Insights で使用される個々のコンポーネントを示しています。

![CW-COMPONENTS](../../../../../images/Containers/aws-native/eks/cw-components.jpg)  

*図: EKS 用の CloudWatch Container Insights で使用される個々のコンポーネント*

コンテナーを操作する際には、可能な限り Docker JSON ロギングドライバーを使用して、アプリケーションログを含むすべてのログを標準出力(stdout)と標準エラー出力(stderr)を介してプッシュすることをお勧めします。このため、EKS ではロギングドライバーがデフォルトで構成されており、コンテナ化されたアプリケーションが `stdout` または `stderr` に書き込むすべてが JSON ファイルにストリーミングされ、ワーカーノードの `“/var/log/containers"` の下に保存されます。Container Insights はこれらのログをデフォルトで 3 つのカテゴリに分類し、Fluent Bit 内と CloudWatch Logs 内のそれぞれのカテゴリ用に専用の入力ストリームと独立したロググループを作成します。これらのカテゴリは以下のとおりです。

* アプリケーションログ: `“/var/log/containers/*.log"` の下に保存されているすべてのアプリケーションログは、専用の `/aws/containerinsights/Cluster_Name/application` ロググループにストリーミングされます。kube-proxy や aws-node ログなどのアプリケーション以外のログはデフォルトで除外されます。ただし、CoreDNS ログなどの追加の Kubernetes アドオンログも処理され、このロググループにストリーミングされます。  
* ホストログ: 各 EKS ワーカーノードのシステムログが `/aws/containerinsights/Cluster_Name/host` ロググループにストリーミングされます。これらのシステムログには、`“/var/log/messages,/var/log/dmesg,/var/log/secure”` ファイルの内容が含まれます。コンテナ化されたワークロードのステートレスで動的な性質を考えると、EKS ワーカーノードはスケーリングアクティビティ中に頻繁に終了されるため、Fluent Bit でこれらのログをリアルタイムにストリーミングし、ノードが終了した後も CloudWatch Logs でこれらのログを利用できるようにすることが、EKS ワーカーノードの正常性とヘルスモニタリングの観点から重要です。また、多くの場合ワーカーノードにログインすることなくクラスターの問題をデバッグまたはトラブルシューティングできるようになり、これらのログをより体系的な方法で分析できます。
* データプレーンログ: EKS はすでに [コントロールプレーンログ](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) を提供しています。Container Insights との Fluent Bit インテグレーションにより、実行中の Pod を維持管理する責任があるすべてのワーカーノード上で実行される EKS データプレーンコンポーネントによって生成されるログがデータプレーンログとしてキャプチャされます。これらのログも `‘/aws/containerinsights/Cluster_Name/dataplane` の下に専用の CloudWatch ロググループにストリーミングされます。kube-proxy、aws-node、Docker ランタイムのログがこのロググループに保存されます。コントロールプレーンログに加えて、データプレーンログを CloudWatch Logs に保存することで、EKS クラスターの完全な画像を提供できます。

さらに、Fluent Bit 構成、Fluent Bit モニタリング、ログ分析などのトピックについては、[Amazon EKS との Fluent Bit インテグレーション](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) を参照してください。

### Amazon EKS でのコンテナインサイトによるコスト削減

デフォルトの構成では、Container Insights レシーバーは [レシーバーのドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes) で定義されているメトリクスの完全なセットを収集します。収集されるメトリクスとディメンションの数は多く、大規模なクラスタの場合、メトリクスの取り込みとストレージのコストが大幅に増加します。 ここでは、ADOT Collector を構成して価値のあるメトリクスのみを送信し、コストを節約する2つの異なるアプローチを示します。

#### プロセッサの使用

前述のように OpenTelemetry プロセッサを導入して、[EMF ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) のサイズを減らすためにメトリクスや属性をフィルタリングするアプローチです。 *Filter* と *Resource* という 2 つのプロセッサの基本的な使用法をデモンストレーションします。

[Filter プロセッサ](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md) は、`otel-agent-conf` という名前の `ConfigMap` に含めることができます。

```
processors:
  # filter processors example
  filter/include:
    # any names NOT matching filters are excluded from remainder of pipeline
    metrics:
      include:
        match_type: regexp
        metric_names:
          # re2 regexp patterns
          - ^pod_.*
  filter/exclude:
    # any names matching filters are excluded from remainder of pipeline
    metrics:
      exclude:
        match_type: regexp
        metric_names:
          - ^pod_network.*
```

[Resource プロセッサ](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) も AWS OpenTelemetry Distro に組み込まれており、不要なメトリクス属性を削除するために使用できます。 たとえば、EMF ログから `Kubernetes` と `Sources` フィールドを削除したい場合は、次のようにリソースプロセッサをパイプラインに追加できます。

```
  # resource processors example
  resource:
    attributes:
    - key: Sources
      action: delete
    - key: kubernetes
      action: delete
```

#### メトリクスとディメンションのカスタマイズ

このアプローチでは、CloudWatch EMF エクスポーターを設定して、CloudWatch Logs に送信したいメトリクスのセットのみを生成するようにします。CloudWatch EMF エクスポーターの構成の [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) セクションを使用して、エクスポートしたいメトリクスとディメンションのセットを定義できます。 たとえば、デフォルトの構成から Pod のメトリクスのみを保持できます。 この `metric_declaration` セクションは次のようになり、メトリクス数を減らすには、他のディメンションを気にしない場合はディメンションセットを `[PodName, Namespace, ClusterName]` のみにすることができます。

```
  awsemf:
    namespace: ContainerInsights
    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
    log_stream_name: '{NodeName}'
    resource_to_telemetry_conversion:
      enabled: true
    dimension_rollup_option: NoDimensionRollup
    parse_json_encoded_attr_values: [Sources, kubernetes]
    # Customized metric declaration section
    metric_declarations:
      # pod metrics
      - dimensions: [[PodName, Namespace, ClusterName]]
        metric_name_selectors:
          - pod_cpu_utilization
          - pod_memory_utilization
          - pod_cpu_utilization_over_pod_limit
          - pod_memory_utilization_over_pod_limit
```

この構成では、デフォルトの構成である複数のディメンションに対して 55 種類の異なるメトリクスを生成・ストリーミングするのではなく、単一のディメンション `[PodName, Namespace, ClusterName]` 内の以下の 4 つのメトリクスが生成されます。

* pod_cpu_utilization
* pod_memory_utilization 
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

この構成では、デフォルトで構成されているすべてのメトリクスではなく、関心のあるメトリクスのみを送信します。 その結果、Container Insights のメトリクス取り込みコストを大幅に削減できます。 この柔軟性により、Container Insights のコストマーはエクスポートされるメトリクスを高度に制御できるようになります。 `awsemf` エクスポーター構成を変更してメトリクスをカスタマイズすることは非常に柔軟であり、送信したいメトリクスとそのディメンションの両方をカスタマイズできます。 これは、CloudWatch に送信されるログにのみ適用できることに注意してください。

上記で説明した 2 つのアプローチは相互に排他的ではありません。 実際、モニタリングシステムに取り込みたいメトリクスをカスタマイズするための高い柔軟性を実現するために、両方を組み合わせることができます。 以下のグラフに示すように、このアプローチを使用して、メトリクスの保存と処理に関連するコストを削減します。

![CW-COST-EXPLORER](../../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*図: AWS Cost Explorer*

前の AWS Cost Explorer グラフでは、小規模な EKS クラスター(20 個のワーカーノード、220 個の Pod)で異なる構成の ADOT Collector を使用した場合の CloudWatch 関連の日次コストを確認できます。 *Aug 15th* は、デフォルトの構成で ADOT Collector を使用した場合の CloudWatch の請求を示しています。 *Aug 16th* では、[Customize EMF exporter](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter) アプローチを使用し、約 30% のコスト削減が見られます。 *Aug 17th* では、[Processors](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors) アプローチを使用し、約 45% のコスト削減を実現しています。

Container Insights によって送信されるメトリクスをカスタマイズすることのトレードオフを考慮する必要があります。メトリクスの可視性を犠牲にすることでモニタリングコストを削減できますが、AWS コンソール内の Container Insights によって提供される組み込みダッシュボードも、ダッシュボードで使用されているメトリクスやディメンションの送信を選択しない場合に影響を受ける可能性があります。 さらに学習するには、 [Amazon EKS の Container Insights によって送信されるメトリクスをカスタマイズすることによるコスト削減](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) をご確認ください。

### EKS Blueprints を使用した Container Insights の設定

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) は、アカウントとリージョン間で一貫性のある、バッテリー同梱の EKS クラスターを構成およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)と Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD など、さまざまな一般的なオープンソース アドオンを備えた EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、インフラストラクチャの自動化に役立つ 2 つの一般的な IaC フレームワークである [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) で実装されています。

EKS Blueprints を使用した Amazon EKS クラスターの作成プロセスの一環として、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約する Day 2 運用ツールとして Container Insights を設定できます。これにより、Amazon CloudWatch コンソールに出力できます。

### まとめ

オブザーバビリティのベストプラクティスガイドのこのセクションでは、Amazon EKS 上のコンテナ化ワークロードを観察するのに役立つ、CloudWatch Container Insights のより深い詳細を多数カバーしました。Amazon CloudWatch Container Insights と AWS Distro for Open Telemetry を使用して、コンテナ化されたワークロードのメトリクスを Amazon CloudWatch コンソール上で視覚化するために、Container Insight メトリクスの収集を有効にするより深い内容をカバーしました。次に、Amazon EKS の CloudWatch Container Insights での Fluent Bit インテグレーションについて、アプリケーション、ホスト、データプレーンログのために CloudWatch Logs 内に専用の入力ストリームと独立したロググループを作成する深さを多数カバーしました。次に、プロセッサやメトリクスディメンションなどの 2 つの異なるアプローチで、CloudWatch Container Insights とコスト削減を達成する方法について説明しました。最後に、Amazon EKS クラスター作成プロセス中に Container Insights を設定するための車両として EKS ブループリントを使用する方法について簡単に説明しました。[ワンオブザーバビリティワークショップ](https://catalog.workshops.aws/observability/ja-JP) 内の [CloudWatch Container Insights モジュール](https://catalog.workshops.aws/observability/ja-JP/aws-native/insights/containerinsights) で、これらをハンズオンで体験できます。
