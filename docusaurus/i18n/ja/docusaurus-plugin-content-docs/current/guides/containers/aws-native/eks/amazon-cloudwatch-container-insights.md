# Amazon CloudWatch Container Insights

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon CloudWatch Container Insights に関連する以下のトピックについて詳しく説明します。

* Amazon CloudWatch Container Insights の概要
* AWS Distro for Open Telemetry を使用した Amazon CloudWatch Container Insights の使用
* Amazon EKS 向け CloudWatch Container Insights における Fluent Bit 統合
* Amazon EKS における Container Insights によるコスト削減
* EKS Blueprints を使用した Container Insights のセットアップ

### はじめに

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するのに役立ちます。メトリクスデータは、[embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。これらのパフォーマンスログイベントは、高カーディナリティデータを大規模に取り込んで保存できるようにする構造化された JSON スキーマを使用します。このデータから、CloudWatch はクラスター、ノード、ポッド、タスク、サービスレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。Container Insights が収集するメトリクスは、CloudWatch 自動ダッシュボードで利用できます。Container Insights は、セルフマネージドノードグループ、マネージドノードグループ、AWS Fargate プロファイルを使用する Amazon EKS クラスターで利用できます。

コスト最適化の観点から、また Container Insights のコストを管理できるように、CloudWatch はログデータから可能なすべてのメトリクスを自動的に作成するわけではありません。ただし、CloudWatch Logs Insights を使用して生のパフォーマンスログイベントを分析することで、追加のメトリクスやより詳細な粒度を表示できます。Container Insights によって収集されたメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金の詳細については、[Amazon CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。

Amazon EKS では、Container Insights は [CloudWatch エージェント](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent)のコンテナ化されたバージョンを使用します。これは Amazon が Amazon Elastic Container Registry 経由で提供しており、クラスター内で実行されているすべてのコンテナを検出します。その後、パフォーマンススタックのすべての階層でパフォーマンスデータを収集します。Container Insights は、収集するログとメトリクスに対して AWS KMS キーによる暗号化をサポートしています。この暗号化を有効にするには、Container Insights データを受信するロググループに対して AWS KMS 暗号化を手動で有効にする必要があります。これにより、CloudWatch Container Insights は提供された AWS KMS キーを使用してこのデータを暗号化します。対称キーのみがサポートされており、非対称 AWS KMS キーはロググループの暗号化にはサポートされていません。Container Insights は Linux インスタンスでのみサポートされています。Amazon EKS 用の Container Insights は、[これらの](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) AWS リージョンでサポートされています。

### AWS Distro for Open Telemetry で Amazon CloudWatch Container Insights を使用する

ここでは、Amazon EKS ワークロードから Container Insights メトリクスの収集を有効にするオプションの 1 つである [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) について詳しく説明します。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、[OpenTelemetry](https://opentelemetry.io/docs/) プロジェクトの安全な AWS サポート付きディストリビューションです。ADOT を使用すると、ユーザーはアプリケーションを一度インストルメント化するだけで、相関するメトリクスとトレースを複数のモニタリングソリューションに送信できます。CloudWatch Container Insights の ADOT サポートにより、お客様は [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) 上で実行されている Amazon EKS クラスターから、CPU、メモリ、ディスク、ネットワーク使用量などのシステムメトリクスを収集できます。これにより、Amazon CloudWatch エージェントと同じエクスペリエンスが提供されます。ADOT Collector は、Amazon EKS および Amazon EKS 用 AWS Fargate プロファイルの CloudWatch Container Insights サポートとともに利用できるようになりました。お客様は、Amazon EKS クラスターにデプロイされたポッドの CPU やメモリ使用率などのコンテナおよびポッドメトリクスを収集し、既存の CloudWatch Container Insights エクスペリエンスを変更することなく CloudWatch ダッシュボードで表示できるようになりました。これにより、お客様はトラフィックに応じてスケールアップまたはスケールダウンするかどうかを判断し、コストを削減できるようになります。

ADOT Collector には、レシーバー、プロセッサー、エクスポーターという 3 つの主要なコンポーネントタイプで構成される[パイプラインの概念](https://opentelemetry.io/docs/collector/configuration/)があります。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers)は、データがコレクターに取り込まれる方法です。指定された形式でデータを受け取り、内部形式に変換して、パイプラインで定義された[プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors)と[エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters)に渡します。プル型またはプッシュ型のいずれかになります。プロセッサーは、データの受信とエクスポートの間に、バッチ処理、フィルタリング、変換などのタスクを実行するために使用されるオプションのコンポーネントです。エクスポーターは、メトリクス、ログ、またはトレースの送信先を決定するために使用されます。コレクターアーキテクチャでは、YAML 設定を介してこのようなパイプラインの複数のインスタンスを定義できます。次の図は、Amazon EKS および Fargate プロファイルを使用した Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネントを示しています。

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*図: Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、パイプラインで [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) のインスタンスを使用してデプロイし、Kubelet から直接メトリクスを収集しています。AWS Container Insights Receiver (`awscontainerinsightreceiver`) は、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) をサポートする AWS 固有のレシーバーです。CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約します。データは、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)を使用してパフォーマンスログイベントとして収集されます。EMF データから、Amazon CloudWatch はクラスター、ノード、ポッド、タスク、サービスレベルで集約された CloudWatch メトリクスを作成できます。以下は、サンプルの例です `awscontainerinsightreceiver` 設定

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

これには、上記の設定を使用して Amazon EKS にコレクターを DaemonSet としてデプロイすることが含まれます。また、この Receiver によって Kubelet から直接収集される、より完全なメトリクスのセットにアクセスできます。ADOT Collector のインスタンスが複数あれば、クラスター内のすべてのノードからリソースメトリクスを収集するのに十分です。ADOT Collector のインスタンスが 1 つだけの場合、高負荷時に過負荷になる可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*図: Fargate プロファイルを使用して Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、Kubernetes クラスター内のワーカーノード上の kubelet が、*/metrics/cadvisor* エンドポイントで CPU、メモリ、ディスク、ネットワーク使用量などのリソースメトリクスを公開します。ただし、EKS Fargate ネットワークアーキテクチャでは、Pod はそのワーカーノード上の kubelet に直接到達することが許可されていません。そのため、ADOT Collector は Kubernetes API Server を呼び出してワーカーノード上の kubelet への接続をプロキシし、そのノード上のワークロードの kubelet の cAdvisor メトリクスを収集します。これらのメトリクスは Prometheus 形式で利用可能になります。したがって、Collector は Prometheus サーバーの代替として [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) のインスタンスを使用し、Kubernetes API サーバーエンドポイントからこれらのメトリクスをスクレイピングします。Kubernetes サービスディスカバリを使用することで、Receiver は EKS クラスター内のすべてのワーカーノードを検出できます。したがって、クラスター内のすべてのノードからリソースメトリクスを収集するには、複数の ADOT Collector インスタンスで十分です。ADOT Collector のインスタンスが 1 つだけの場合、高負荷時に過負荷になる可能性があるため、常に複数の Collector をデプロイすることをお勧めします。

メトリクスは、フィルタリング、名前変更、データ集約、変換などを実行する一連のプロセッサーを通過します。以下は、上記で示した Amazon EKS 用の ADOT Collector インスタンスのパイプラインで使用されるプロセッサーのリストです。

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) は、AWS OpenTelemetry ディストリビューションの一部であり、メトリクス名に基づいてメトリクスを含めたり除外したりします。メトリクス収集パイプラインの一部として使用して、不要なメトリクスをフィルタリングできます。たとえば、Container Insights でポッドレベルのメトリクス (名前のプレフィックスが `pod_`) ネットワーキング用のものを除き、名前プレフィックス付き `pod_network`.

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

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) は、メトリクスの名前変更、ラベルキーと値の追加、名前変更、削除に使用できます。また、ラベルまたはラベル値全体でメトリクスのスケーリングと集計を実行するためにも使用できます。 

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) は、単調増加の累積合計およびヒストグラムメトリクスを単調増加のデルタメトリクスに変換します。非単調増加の合計および指数ヒストグラムは除外されます。

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) は、デルタ合計メトリクスをレートメトリクスに変換します。このレートはゲージです。

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

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) は、指定されたルールに従って既存のメトリクスを使用して新しいメトリクスを作成するために使用できます。 

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

パイプラインの最終コンポーネントは [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) です。これはメトリクスを埋め込みメトリクス形式 (EMF) に変換し、[PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API を使用して CloudWatch Logs に直接送信します。以下のメトリクスのリストは、Amazon EKS 上で実行されている各ワークロードについて、ADOT Collector によって CloudWatch に送信されます。

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

各メトリクスは、以下のディメンションセットに関連付けられ、*ContainerInsights* という名前の CloudWatch 名前空間の下で収集されます。

* ClusterName、LaunchType
* ClusterName、Namespace、LaunchType
* ClusterName、Namespace、PodName、LaunchType

さらに、[ADOT の Container Insights Prometheus サポート](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/)と、[Amazon EKS に ADOT コレクターをデプロイして CloudWatch Container Insights を使用して Amazon EKS リソースメトリクスを可視化する方法](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)について学習し、Amazon EKS クラスターで ADOT コレクターパイプラインをセットアップする方法と、CloudWatch Container Insights で Amazon EKS リソースメトリクスを可視化する方法を確認してください。さらに、[Amazon CloudWatch Container Insights でコンテナ化されたアプリケーションを簡単に監視する](https://community.aws/tutorials/navigating-amazon-eks/eks-monitor-containerized-applications#step-3-use-cloudwatch-logs-insights-query-to-search-and-analyze-container-logs)を参照してください。これには、Amazon EKS クラスターの設定、コンテナ化されたアプリケーションのデプロイ、Container Insights を使用したアプリケーションのパフォーマンス監視に関する手順が含まれています。

### Amazon EKS 用 CloudWatch Container Insights における Fluent Bit 統合

[Fluent Bit](https://fluentbit.io/) は、オープンソースでマルチプラットフォームのログプロセッサおよびフォワーダーであり、さまざまなソースからデータとログを収集し、CloudWatch Logs を含むさまざまな送信先に統合して送信できます。また、[Docker](https://www.docker.com/) および [Kubernetes](https://kubernetes.io/) 環境と完全に互換性があります。新しくリリースされた Fluent Bit daemonset を使用すると、EKS クラスターからコンテナログを CloudWatch Logs に送信して、ログのストレージと分析を行うことができます。

その軽量な性質により、EKS ワーカーノードの Container Insights でデフォルトのログフォワーダーとして Fluent Bit を使用することで、アプリケーションログを CloudWatch Logs に効率的かつ確実にストリーミングできます。Fluent Bit により、Container Insights は、特にポッドレベルでの CPU とメモリ使用率の観点から、リソース効率の高い方法で、数千のビジネスクリティカルなログを大規模に配信できます。つまり、以前使用されていたログフォワーダーである FluentD と比較して、Fluent Bit はリソースフットプリントが小さく、その結果、メモリと CPU に対してよりリソース効率が高くなります。一方、Fluent Bit と関連プラグインを含む [AWS for Fluent Bit イメージ](https://github.com/aws/aws-for-fluent-bit)は、AWS エコシステム内で統一されたエクスペリエンスを提供することを目的としているため、Fluent Bit に新しい AWS 機能をより迅速に採用できる柔軟性を追加します。

以下のアーキテクチャは、EKS 用の CloudWatch Container Insights で使用される個々のコンポーネントを示しています。

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*図: EKS 用 CloudWatch Container Insights で使用される個々のコンポーネント。*

コンテナを使用する場合は、可能な限り Docker JSON ロギングドライバーを使用して、アプリケーションログを含むすべてのログを標準出力 (stdout) および標準エラー出力 (stderr) メソッドを通じてプッシュすることをお勧めします。このため、EKS では、ロギングドライバーがデフォルトで設定されており、コンテナ化されたアプリケーションが書き込むすべての内容が `stdout` または `stderr` JSON ファイルにストリーミングされます `“/var/log/containers"` ワーカーノード上で実行されます。Container Insights は、デフォルトでこれらのログを 3 つの異なるカテゴリに分類し、Fluent Bit 内に各カテゴリ専用の入力ストリームを作成し、CloudWatch Logs 内に独立したロググループを作成します。これらのカテゴリは次のとおりです。

* アプリケーションログ: 以下に保存されているすべてのアプリケーションログ `“/var/log/containers/*.log"` 専用の `/aws/containerinsights/Cluster_Name/application` ログループ。kube-proxy や aws-node ログなどのすべての非アプリケーションログは、デフォルトで除外されます。ただし、CoreDNS ログなどの追加の Kubernetes アドオンログも処理され、このログループにストリーミングされます。
* ホストログ: 各 EKS ワーカーノードのシステムログは、次の場所にストリーミングされます `/aws/containerinsights/Cluster_Name/host` ログループ。これらのシステムログには、次の内容が含まれます `“/var/log/messages,/var/log/dmesg,/var/log/secure”` ファイル。コンテナ化されたワークロードのステートレスで動的な性質を考慮すると、スケーリングアクティビティ中に EKS ワーカーノードが頻繁に終了される場合、Fluent Bit でこれらのログをリアルタイムでストリーミングし、ノードが終了した後でも CloudWatch logs でこれらのログを利用できるようにすることは、EKS ワーカーノードのオブザーバビリティと健全性の監視において重要です。また、多くの場合、ワーカーノードにログインすることなくクラスターの問題をデバッグまたはトラブルシューティングし、これらのログをより体系的な方法で分析できるようになります。
* データプレーンログ: EKS はすでに[コントロールプレーンログ](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)を提供しています。Container Insights の Fluent Bit 統合により、すべてのワーカーノードで実行され、実行中のポッドの維持を担当する EKS データプレーンコンポーネントによって生成されたログが、データプレーンログとしてキャプチャされます。これらのログも、専用の CloudWatch ロググループにストリーミングされます。 `‘ /aws/containerinsights/Cluster_Name/dataplane`kube-proxy、aws-node、および Docker ランタイムログは、このロググループに保存されます。コントロールプレーンログに加えて、データプレーンログを CloudWatch Logs に保存することで、EKS クラスターの全体像を把握できます。

さらに、Fluent Bit の設定、Fluent Bit の監視、ログ分析などのトピックについては、[Fluent Bit Integration with Amazon EKS](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) を参照してください。

### Amazon EKS における Container Insights のコスト削減

デフォルト設定では、Container Insights レシーバーは[レシーバードキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes)で定義されている完全なメトリクスセットを収集します。収集されるメトリクスとディメンションの数は多く、大規模なクラスターの場合、メトリクスの取り込みとストレージのコストが大幅に増加します。ここでは、価値をもたらすメトリクスのみを送信し、コストを節約するように ADOT Collector を設定するために使用できる 2 つの異なるアプローチを紹介します。

#### プロセッサーの使用

このアプローチでは、上記で説明した OpenTelemetry プロセッサーを導入して、メトリクスまたは属性をフィルタリングし、[EMF ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)のサイズを削減します。ここでは、*Filter* と *Resource* という 2 つのプロセッサーの基本的な使用方法を説明します。

[フィルタープロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md)は次に含めることができます `ConfigMap` 名前付き `otel-agent-conf`:

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

[リソースプロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md)も AWS OpenTelemetry Distro に組み込まれており、不要なメトリクス属性を削除するために使用できます。たとえば、 `Kubernetes` および `Sources` EMF ログからフィールドを取得するには、リソースプロセッサをパイプラインに追加します。

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

このアプローチでは、CloudWatch EMF エクスポーターを設定して、CloudWatch Logs に送信したいメトリクスのセットのみを生成します。CloudWatch EMF エクスポーター設定の [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) セクションを使用して、エクスポートしたいメトリクスとディメンションのセットを定義できます。たとえば、デフォルト設定からポッドメトリクスのみを保持できます。これは `metric_declaration` セクションは次のようになります。メトリクスの数を減らすには、ディメンションセットのみを保持できます `[PodName, Namespace, ClusterName]` 他のものを気にしない場合は、次のようにします。

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

この設定により、単一のディメンション内で以下の 4 つのメトリクスが生成およびストリーミングされます。 `[PodName, Namespace, ClusterName]` デフォルト設定では複数のディメンションに対して 55 個の異なるメトリクスではなく、次のようになります。

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

この設定により、デフォルトで設定されているすべてのメトリクスではなく、関心のあるメトリクスのみを送信できます。その結果、Container Insights のメトリクス取り込みコストを大幅に削減できます。この柔軟性により、Container Insights のお客様は、エクスポートされるメトリクスを高いレベルで制御できるようになります。メトリクスをカスタマイズするには、 `awsemf` エクスポーター設定も非常に柔軟性が高く、送信するメトリクスとそのディメンションの両方をカスタマイズできます。これは CloudWatch に送信されるログにのみ適用されることに注意してください。

上記で説明した 2 つのアプローチは、互いに排他的ではありません。実際、両方を組み合わせることで、監視システムに取り込むメトリクスのカスタマイズにおいて高い柔軟性を実現できます。このアプローチを使用して、次のグラフに示すように、メトリクスのストレージと処理に関連するコストを削減します。

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*図: AWS Cost Explorer*

前述の AWS Cost Explorer グラフでは、小規模な EKS クラスター（20 ワーカーノード、220 ポッド）で ADOT Collector のさまざまな設定を使用した場合の CloudWatch に関連する日次コストを確認できます。*8 月 15 日*は、デフォルト設定の ADOT Collector を使用した CloudWatch の請求額を示しています。*8 月 16 日*には、[EMF エクスポーターのカスタマイズ](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter)アプローチを使用し、約 30% のコスト削減が確認できます。*8 月 17 日*には、[プロセッサー](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors)アプローチを使用し、約 45% のコスト削減を達成しています。
Container Insights によって送信されるメトリクスをカスタマイズする際のトレードオフを考慮する必要があります。監視対象クラスターの可視性を犠牲にすることで、監視コストを削減できます。ただし、AWS コンソール内で Container Insights が提供する組み込みダッシュボードも、カスタマイズされたメトリクスの影響を受ける可能性があります。ダッシュボードで使用されるメトリクスやディメンションを送信しないように選択できるためです。詳細については、[Amazon EKS の Container Insights によって送信されるメトリクスをカスタマイズしてコストを削減する](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/)を参照してください。

### EKS Blueprints を使用した Container Insights のセットアップ

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) は、アカウントやリージョン全体で一貫性のある、すぐに使える EKS クラスターを設定およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)や、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD など、幅広い人気のオープンソースアドオンを使用して、EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、[HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) という 2 つの人気のある IaC フレームワークで実装されており、インフラストラクチャのデプロイを自動化するのに役立ちます。

EKS Blueprints を使用した Amazon EKS クラスター作成プロセスの一環として、Container Insights を Day 2 運用ツールとして設定し、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約して Amazon CloudWatch コンソールに送信できます。

### まとめ

Observability ベストプラクティスガイドのこのセクションでは、CloudWatch Container Insights に関する多くの詳細を取り上げました。Amazon CloudWatch Container Insights の概要と、Amazon EKS 上のコンテナ化されたワークロードの監視にどのように役立つかを説明しました。AWS Distro for Open Telemetry を使用した Amazon CloudWatch Container Insights の詳細を取り上げ、Container Insights メトリクスの収集を有効にして、Amazon CloudWatch コンソールでコンテナ化されたワークロードのメトリクスを可視化する方法を説明しました。次に、Amazon EKS 向け CloudWatch Container Insights における Fluent Bit 統合について詳しく説明し、Fluent Bit 内に専用の入力ストリームを作成し、CloudWatch Logs 内にアプリケーション、ホスト、データプレーンログ用の独立したロググループを作成する方法を取り上げました。次に、プロセッサやメトリクスディメンションなどの 2 つの異なるアプローチを使用して、CloudWatch Container Insights でコスト削減を実現する方法について説明しました。最後に、Amazon EKS クラスターの作成プロセス中に Container Insights をセットアップする手段として EKS Blueprints を使用する方法について簡単に説明しました。[One Observability Workshop](https://catalog.workshops.aws/observability/en-US) 内の[CloudWatch Container Insights モジュール](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights)で実践的な経験を積むことができます。
