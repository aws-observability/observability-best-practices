# Amazon CloudWatch Container Insights

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon CloudWatch Container Insights に関する以下のトピックについて詳しく説明します。

* Amazon CloudWatch Container Insights の概要
* AWS Distro for Open Telemetry での Amazon CloudWatch Container Insights の使用
* Amazon EKS の CloudWatch Container Insights における Fluent Bit 統合
* Amazon EKS の Container Insights によるコスト削減
* EKS Blueprints を使用した Container Insights のセットアップ

### はじめに

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約するのに役立ちます。メトリクスデータは、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用して、パフォーマンスログイベントとして収集されます。これらのパフォーマンスログイベントは、高い基数のデータを大規模に取り込み、保存できる構造化された JSON スキーマを使用しています。このデータから、CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。Container Insights が収集するメトリクスは、CloudWatch の自動ダッシュボードで利用できます。Container Insights は、セルフマネージドノードグループ、マネージドノードグループ、AWS Fargate プロファイルを持つ Amazon EKS クラスターで利用できます。

コスト最適化の観点から、また Container Insights のコストを管理するのに役立てるため、CloudWatch はログデータからすべての可能なメトリクスを自動的に作成するわけではありません。ただし、CloudWatch Logs Insights を使用して生のパフォーマンスログイベントを分析することで、追加のメトリクスとより詳細なレベルの粒度を確認できます。Container Insights によって収集されたメトリクスはカスタムメトリクスとして課金されます。CloudWatch の価格に関する詳細は、[Amazon CloudWatch 価格](https://aws.amazon.com/jp/cloudwatch/pricing/) を参照してください。

Amazon EKS では、Container Insights は Amazon が Amazon Elastic Container Registry 経由で提供する [CloudWatch エージェント](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) のコンテナ化されたバージョンを使用して、クラスター内のすべての実行中のコンテナを検出します。次に、パフォーマンススタックのすべての階層でパフォーマンスデータを収集します。Container Insights は、収集するログとメトリクスの AWS KMS キーによる暗号化をサポートしています。この暗号化を有効にするには、Container Insights データを受け取るロググループに対して AWS KMS 暗号化を手動で有効にする必要があります。これにより、CloudWatch Container Insights がその AWS KMS キーを使用してデータを暗号化します。対称キーのみがサポートされており、ロググループの暗号化に非対称 AWS KMS キーは使用できません。Container Insights は Linux インスタンスのみでサポートされています。Amazon EKS の Container Insights は、[これらの](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) AWS リージョンでサポートされています。

### Amazon EKS ワークロードから Container Insights メトリクスを収集するための AWS Distro for OpenTelemetry の利用

ここでは、Amazon EKS ワークロードから Container Insights メトリクスを収集するオプションの 1 つである [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) について詳しく見ていきます。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、[OpenTelemetry](https://opentelemetry.io/docs/) プロジェクトの安全で AWS がサポートする配布版です。ADOT を使えば、アプリケーションを 1 回インストルメント化するだけで、関連するメトリクスとトレースを複数のモニタリングソリューションに送信できます。ADOT の CloudWatch Container Insights サポートにより、お客様は [Amazon Elastic Cloud Compute](https://aws.amazon.com/jp/pm/ec2/≻_channel=PS≻_campaign=acquisition_US≻_publisher=Google≻_category=Cloud%20Computing≻_country=US≻_geo=NAMER≻_outcome=acq≻_detail=amazon%20ec2≻_content=EC2_e≻_matchtype=e≻_segment=467723097970≻_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) 上で実行されている Amazon EKS クラスターから、CPU、メモリ、ディスク、ネットワーク使用率などのシステムメトリクスを収集できます。これは Amazon CloudWatch エージェントと同じ体験を提供します。ADOT Collector は、Amazon EKS と AWS Fargate プロファイル for Amazon EKS 向けの CloudWatch Container Insights サポートで利用できるようになりました。お客様は、Amazon EKS クラスターにデプロイされた Pod の CPU やメモリ使用率などの Container メトリクスと Pod メトリクスを収集し、既存の CloudWatch Container Insights 体験を変更することなく CloudWatch ダッシュボードで確認できるようになりました。これにより、トラフィックに応じてスケールアップまたはダウンすべきかを判断し、コストを節約することができます。

ADOT Collector には [パイプラインの概念](https://opentelemetry.io/docs/collector/configuration/) があり、レシーバー、プロセッサー、エクスポーターという 3 つの主要なコンポーネントで構成されています。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers) はデータを Collector に取り込む役割を担います。指定された形式のデータを受け取り、内部形式に変換し、パイプラインで定義された [プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors) と [エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プル型またはプッシュ型のどちらかになります。プロセッサーは、データを受信してからエクスポートするまでの間に、バッチ処理、フィルタリング、変換などのタスクを実行するオプションのコンポーネントです。エクスポーターは、メトリクス、ログ、トレースの送信先を決定するために使用されます。Collector のアーキテクチャでは、YAML 構成を使って複数のパイプラインインスタンスを定義できます。次の図は、Amazon EKS と Fargate プロファイル付き Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネントを示しています。

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*図: Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、パイプラインに [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) のインスタンスを使用し、Kubelet から直接メトリクスを収集しています。AWS Container Insights Receiver (`awscontainerinsightreceiver`) は、[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) をサポートする AWS 固有のレシーバーです。CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約します。データは [埋め込みメトリクス形式](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。EMF データから、Amazon CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約された CloudWatch メトリクスを作成できます。以下は `awscontainerinsightreceiver` の構成例です。

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

これは、上記の構成を使って Amazon EKS に Collector をデーモンセットとしてデプロイすることを意味します。また、このレシーバーから直接 Kubelet によって収集された、より多くのメトリクスセットにアクセスできます。ADOT Collector のインスタンスを複数持つことで、クラスター内のすべてのノードからリソースメトリクスを収集できます。ADOT Collector のインスタンスを 1 つだけ持つと、高負荷時に圧倒されてしまうため、常に複数のコレクターをデプロイすることをお勧めします。

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*図: Fargate プロファイル付き Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、Kubernetes クラスターのワーカーノード上の kubelet が、*/metrics/cadvisor* エンドポイントで CPU、メモリ、ディスク、ネットワーク使用率などのリソースメトリクスを公開しています。しかし、EKS Fargate のネットワーキングアーキテクチャでは、Pod がそのワーカーノードの kubelet に直接到達することはできません。そのため、ADOT Collector は Kubernetes API サーバーを呼び出して、ワーカーノードの kubelet への接続をプロキシし、そのノード上のワークロードの kubelet の cAdvisor メトリクスを収集します。これらのメトリクスは Prometheus 形式で提供されます。そのため、Collector は [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) のインスタンスを Prometheus サーバーの代替として使用し、Kubernetes API サーバーエンドポイントからこれらのメトリクスをスクレイピングします。Kubernetes のサービスディスカバリを使用すると、レシーバーは EKS クラスター内のすべてのワーカーノードを検出できます。したがって、ADOT Collector のインスタンスを複数持つことで、クラスター内のすべてのノードからリソースメトリクスを収集できます。ADOT Collector のインスタンスを 1 つだけ持つと、高負荷時に圧倒されてしまうため、常に複数のコレクターをデプロイすることをお勧めします。

メトリクスはその後、フィルタリング、名前変更、データ集約と変換などを行うプロセッサーのシリーズを通過します。上記の Amazon EKS 向け ADOT Collector インスタンスのパイプラインで使用されているプロセッサーのリストは次のとおりです。

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) は、AWS OpenTelemetry 配布版の一部で、メトリクス名に基づいてメトリクスを含めるか除外するためのものです。不要なメトリクスをフィルタリングするために、メトリクス収集パイプラインの一部として使用できます。たとえば、Container Insights が `pod_network` という名前の接頭辞を持つネットワーク関連のメトリクスを除外し、`pod_` という名前の接頭辞を持つ Pod レベルのメトリクスのみを収集したい場合などです。

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

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) は、メトリクスの名前変更、ラベルキーの追加、名前変更、削除、メトリクスのスケーリングやラベルまたはラベル値に対する集約に使用できます。

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) は、単調増加の累積合計メトリクスとヒストグラムメトリクスを、単調増加のデルタメトリクスに変換します。非単調増加の合計とエクスポネンシャルヒストグラムは除外されます。

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

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) は、指定されたルールに従って既存のメトリクスから新しいメトリクスを作成するために使用できます。

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

パイプラインの最後のコンポーネントは [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) で、メトリクスを埋め込みメトリクス形式 (EMF) に変換し、[PutLogEvents](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API を使って直接 CloudWatch Logs に送信します。ADOT Collector が Amazon EKS 上で実行されているワークロードごとに CloudWatch に送信するメトリクスのリストは次のとおりです。

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

各メトリクスには、次のディメンションセットが関連付けられ、CloudWatch 名前空間 *ContainerInsights* の下で収集されます。

* ClusterName、LaunchType
* ClusterName、Namespace、LaunchType
* ClusterName、Namespace、PodName、LaunchType

さらに、[Container Insights Prometheus support for ADOT](https://aws.amazon.com/jp/blogs/news/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) と [Amazon EKS リソースメト

### Amazon EKS の CloudWatch Container Insights における Fluent Bit 統合

[Fluent Bit](https://fluentbit.io/) は、オープンソースでマルチプラットフォームのログプロセッサーおよびフォワーダーで、さまざまなソースからデータとログを収集し、それらを統合して CloudWatch Logs などの様々な宛先に送信することができます。また、[Docker](https://www.docker.com/) および [Kubernetes](https://kubernetes.io/) 環境とも完全に互換性があります。新しくリリースされた Fluent Bit daemonset を使用すると、EKS クラスターからコンテナログを CloudWatch Logs に送信して、ログの保存と分析を行うことができます。

軽量な性質のため、EKS ワーカーノードの Container Insights でデフォルトのログフォワーダーとして Fluent Bit を使用すると、アプリケーションログを効率的かつ確実に CloudWatch Logs にストリーミングできます。Fluent Bit を使えば、Container Insights は、特に Pod レベルの CPU およびメモリ使用率の面で、リソース効率の良い方法で大量のビジネス上重要なログを配信できます。つまり、以前使用されていた FluentD と比較して、Fluent Bit はリソースフットプリントが小さく、メモリと CPU に対してより効率的です。一方、Fluent Bit と関連プラグインを含む [AWS for Fluent Bit イメージ](https://github.com/aws/aws-for-fluent-bit) は、AWS エコシステム内で統一された体験を提供することを目的としているため、Fluent Bit に新しい AWS 機能をより早く採用する柔軟性を与えます。

以下の図は、Amazon EKS の CloudWatch Container Insights で使用される個々のコンポーネントを示しています。

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*図: Amazon EKS の CloudWatch Container Insights で使用される個々のコンポーネント。*

コンテナを扱う際は、可能な限り、Docker JSON ロギングドライバーを使用して、アプリケーションログを含むすべてのログを標準出力 (stdout) および標準エラー出力 (stderr) 経由で出力することが推奨されます。このため、EKS ではロギングドライバーがデフォルトで設定されており、コンテナ化されたアプリケーションから `stdout` または `stderr` に書き込まれたすべてのものが、ワーカーノードの `/var/log/containers` 配下の JSON ファイルにストリーミングされます。Container Insights は、これらのログをデフォルトで 3 つのカテゴリに分類し、Fluent Bit 内で専用の入力ストリームを、CloudWatch Logs 内で独立したロググループを作成します。これらのカテゴリは次のとおりです。

* アプリケーションログ: `/var/log/containers/*.log` 配下のすべてのアプリケーションログが、専用の `/aws/containerinsights/Cluster_Name/application` ロググループにストリーミングされます。kube-proxy や aws-node などの非アプリケーションログはデフォルトで除外されますが、CoreDNS ログなどの追加の Kubernetes アドオンログもこのロググループに処理およびストリーミングされます。
* ホストログ: 各 EKS ワーカーノードのシステムログは、`/aws/containerinsights/Cluster_Name/host` ロググループにストリーミングされます。これらのシステムログには、`/var/log/messages`、`/var/log/dmesg`、`/var/log/secure` ファイルの内容が含まれます。コンテナ化されたワークロードは無状態でダイナミックな性質があり、スケーリング時にはしばしば EKS ワーカーノードが終了されるため、Fluent Bit を使ってこれらのログをリアルタイムでストリーミングし、ノードが終了した後も CloudWatch Logs でログを利用できることは、EKS ワーカーノードの健全性を監視し、可観測性を確保する上で重要です。また、多くの場合、ワーカーノードにログインせずにクラスターの問題をデバッグまたはトラブルシューティングでき、これらのログをより体系的に分析できるようになります。
* データプレーンログ: EKS は既に [コントロールプレーンログ](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html) を提供しています。Container Insights の Fluent Bit 統合により、実行中の Pod を維持する責任を持つ EKS データプレーンコンポーネントによって生成されたログがデータプレーンログとしてキャプチャされます。これらのログも、`/aws/containerinsights/Cluster_Name/dataplane` 配下の専用の CloudWatch ロググループにストリーミングされます。kube-proxy、aws-node、および Docker ランタイムログがこのロググループに保存されます。コントロールプレーンログに加えて、データプレーンログを CloudWatch Logs に保存することで、EKS クラスターの全体像を把握できます。

さらに、[Amazon EKS との Fluent Bit 統合](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) から、Fluent Bit 設定、Fluent Bit 監視、ログ分析などのトピックについて学ぶことができます。

### Amazon EKS の Container Insights によるコスト削減

デフォルト設定では、Container Insights の Receiver は [Receiver のドキュメンテーション](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes)で定義されている完全なメトリクスセットを収集します。収集されるメトリクスとディメンションの数が多く、大規模なクラスターではメトリクスの取り込みとストレージのコストが大幅に増加します。今回は、ADOT Collector を設定して価値のあるメトリクスのみを送信し、コストを削減する 2 つのアプローチを紹介します。

#### プロセッサーの使用

このアプローチでは、上で説明した OpenTelemetry プロセッサーを導入し、メトリクスや属性をフィルタリングして [EMF ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) のサイズを削減します。ここでは、*Filter* と *Resource* という 2 つのプロセッサーの基本的な使用方法を示します。

[Filter プロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md) は、`otel-agent-conf` という名前の `ConfigMap` に含めることができます。

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

[Resource プロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) も AWS OpenTelemetry Distro に組み込まれており、不要なメトリクス属性を削除するために使用できます。たとえば、EMF ログから `Kubernetes` と `Sources` フィールドを削除したい場合は、リソースプロセッサーをパイプラインに追加できます。

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

このアプローチでは、CloudWatch EMF エクスポーターを設定して、CloudWatch Logs に送信したいメトリクスのセットのみを生成するようにします。CloudWatch EMF エクスポーター設定の [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) セクションを使用して、エクスポートするメトリクスとディメンションのセットを定義できます。たとえば、デフォルト設定からPodメトリクスのみを残すことができます。この `metric_declaration` セクションは次のようになり、メトリクス数を減らすために、他のディメンションを気にしない場合は、ディメンションセットを `[PodName、Namespace、ClusterName]` のみに保つことができます。

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

この設定では、デフォルト設定の複数のディメンションの 55 種類のメトリクスではなく、単一のディメンション `[PodName、Namespace、ClusterName]` 内で次の 4 つのメトリクスを生成してストリーミングします。

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

この設定では、デフォルトで設定されているすべてのメトリクスではなく、関心のあるメトリクスのみを送信します。その結果、Container Insights のメトリクス取り込みコストを大幅に削減できます。この柔軟性により、Container Insights の顧客はエクスポートされるメトリクスを高度に制御できます。`awsemf` エクスポーター設定を変更してメトリクスをカスタマイズすることも非常に柔軟で、送信するメトリクスとそのディメンションの両方をカスタマイズできます。これは CloudWatch に送信されるログにのみ適用されることに注意してください。

上記で説明した 2 つのアプローチは相互に排他的ではありません。実際、両方を組み合わせることで、モニタリングシステムに取り込まれるメトリクスをカスタマイズする際の柔軟性が高まります。このアプローチを使用して、次の図に示すようにメトリクスの保存と処理に関連するコストを削減しています。

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*図: AWS Cost Explorer*

上記の AWS Cost Explorer グラフでは、小規模の EKS クラスター (Worker ノード 20 台、Pod 220 個) で、ADOT コレクターの異なる設定を使用した CloudWatch の日次コストを確認できます。*8月15日* は、デフォルト設定の ADOT コレクターを使用した CloudWatch の請求額を示しています。*8月16日* には、[EMF エクスポーターのカスタマイズ](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/)アプローチを使用し、約 30% のコスト削減が見られます。*8月17日* には、[Processors](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) アプローチを使用し、約 45% のコスト削減が達成されています。
Container Insights から送信されるメトリクスをカスタマイズすることで、監視対象のクラスターの可視性を犠牲にしてモニタリングコストを削減できますが、トレードオフを考慮する必要があります。また、AWS コンソール内の Container Insights によって提供される組み込みダッシュボードは、メトリクスとディメンションの選択によって影響を受ける可能性があります。詳細については、[Cost savings by customizing metrics sent by Container Insights in Amazon EKS](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) をご覧ください。

### EKS Blueprints を使用して Container Insights をセットアップする

[EKS Blueprints](https://aws.amazon.com/jp/blogs/news/bootstrapping-clusters-with-eks-blueprints/) は、アカウントやリージョンを超えて一貫性のある、バッテリー内蔵の EKS クラスターを構成およびデプロイするための Infrastructure as Code (IaC) モジュールのコレクションです。
EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html)だけでなく、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD などの幅広いオープンソースアドオンを簡単に EKS クラスターに組み込むことができます。
EKS Blueprints は、[HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) の 2 つの人気の IaC フレームワークで実装されており、インフラストラクチャのデプロイを自動化できます。

EKS Blueprints を使用した Amazon EKS クラスターの作成プロセスの一部として、Day 2 の運用ツールとして Container Insights をセットアップし、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約して Amazon CloudWatch コンソールに表示できます。

### 結論

このオブザーバビリティのベストプラクティスガイドのセクションでは、CloudWatch Container Insights の詳細を詳しく説明しました。Amazon CloudWatch Container Insights の紹介と、Amazon EKS 上のコンテナ化されたワークロードを観察する方法を説明しました。AWS Distro for OpenTelemetry と Amazon CloudWatch Container Insights を使用して、コンテナ化されたワークロードのメトリクスを収集し、Amazon CloudWatch コンソールで可視化する方法について詳しく説明しました。次に、Amazon EKS の CloudWatch Container Insights における Fluent Bit 統合について詳しく説明し、Fluent Bit 内に専用の入力ストリームを作成し、CloudWatch Logs 内にアプリケーション、ホスト、データプレーンのログ用の独立したロググループを作成する方法を説明しました。次に、CloudWatch Container Insights でコスト削減を実現するための 2 つのアプローチ、プロセッサとメトリクスディメンションについて説明しました。最後に、Amazon EKS クラスター作成プロセス中に Container Insights をセットアップするための手段として EKS Blueprints を使用する方法を簡単に説明しました。[One Observability Workshop](https://catalog.workshops.aws/observability/en-US) 内の [CloudWatch Container Insights モジュール](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) で実践的な経験を積むことができます。
