# Amazon CloudWatch Container Insights

Observability のベストプラクティスガイドのこのセクションでは、Amazon CloudWatch Container Insights に関連する以下のトピックについて詳しく説明します：

* Amazon CloudWatch Container Insights の概要
* AWS Distro for OpenTelemetry を使用した Amazon CloudWatch Container Insights の活用
* Amazon EKS 向け CloudWatch Container Insights における Fluent Bit の統合
* Amazon EKS 上の Container Insights によるコスト削減
* EKS Blueprints を使用した Container Insights のセットアップ



### はじめに

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約するのに役立ちます。メトリクスデータは、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。これらのパフォーマンスログイベントは、構造化された JSON スキーマを使用しており、高カーディナリティデータを大規模に取り込み、保存することができます。このデータから、CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。Container Insights が収集するメトリクスは、CloudWatch の自動ダッシュボードで利用できます。Container Insights は、セルフマネージドノードグループ、マネージドノードグループ、AWS Fargate プロファイルを持つ Amazon EKS クラスターで利用可能です。

コスト最適化の観点から、また Container Insights のコスト管理を支援するために、CloudWatch はログデータからすべての可能なメトリクスを自動的に作成するわけではありません。ただし、CloudWatch Logs Insights を使用して生のパフォーマンスログイベントを分析することで、追加のメトリクスやより詳細な粒度を表示できます。Container Insights によって収集されるメトリクスは、カスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch の料金](https://aws.amazon.com/jp/cloudwatch/pricing/) をご覧ください。

Amazon EKS では、Container Insights は Amazon が Amazon Elastic Container Registry を通じて提供する [CloudWatch エージェント](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) のコンテナ化バージョンを使用して、クラスター内で実行中のすべてのコンテナを検出します。その後、パフォーマンススタックのあらゆる層でパフォーマンスデータを収集します。Container Insights は、収集するログとメトリクスに対して AWS KMS キーによる暗号化をサポートしています。この暗号化を有効にするには、Container Insights データを受け取るロググループに対して AWS KMS 暗号化を手動で有効にする必要があります。これにより、CloudWatch Container Insights は提供された AWS KMS キーを使用してこのデータを暗号化します。対称キーのみがサポートされており、ロググループの暗号化に非対称 AWS KMS キーはサポートされていません。Container Insights は Linux インスタンスでのみサポートされています。Amazon EKS 用の Container Insights は、[これらの](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) AWS リージョンでサポートされています。



### AWS Distro for Open Telemetry を使用した Amazon CloudWatch Container Insights

ここでは、Amazon EKS ワークロードから Container Insights メトリクスの収集を可能にするオプションの 1 つである [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) について詳しく見ていきます。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、[OpenTelemetry](https://opentelemetry.io/docs/) プロジェクトの安全で AWS がサポートする配布版です。ADOT を使用すると、ユーザーは一度アプリケーションを計装するだけで、相関のあるメトリクスとトレースを複数の監視ソリューションに送信できます。CloudWatch Container Insights 向けの ADOT サポートにより、お客様は [Amazon Elastic Cloud Compute](https://aws.amazon.com/jp/pm/ec2/|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) 上で実行されている Amazon EKS クラスターから CPU、メモリ、ディスク、ネットワーク使用量などのシステムメトリクスを収集でき、Amazon CloudWatch エージェントと同じ体験を提供します。ADOT Collector は現在、Amazon EKS 向けの CloudWatch Container Insights と Amazon EKS 向けの AWS Fargate プロファイルをサポートしています。お客様は、Amazon EKS クラスターにデプロイされた Pod の CPU やメモリ使用率などのコンテナと Pod のメトリクスを収集し、既存の CloudWatch Container Insights の体験を変更することなく CloudWatch ダッシュボードで表示できるようになりました。これにより、お客様はトラフィックに応じてスケールアップまたはダウンするかどうかを判断し、コストを節約することができます。

ADOT Collector には、レシーバー、プロセッサー、エクスポーターという 3 つの主要なコンポーネントタイプで構成される [パイプラインの概念](https://opentelemetry.io/docs/collector/configuration/) があります。[レシーバー](https://opentelemetry.io/docs/collector/configuration/#receivers) は、データがコレクターに入る方法です。指定された形式でデータを受け取り、内部形式に変換し、パイプラインで定義された [プロセッサー](https://opentelemetry.io/docs/collector/configuration/#processors) と [エクスポーター](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。プル型またはプッシュ型があります。プロセッサーはオプションのコンポーネントで、受信されてからエクスポートされるまでの間にデータのバッチ処理、フィルタリング、変換などのタスクを実行するために使用されます。エクスポーターは、メトリクス、ログ、またはトレースを送信する宛先を決定するために使用されます。コレクターのアーキテクチャでは、YAML 設定を通じてこのようなパイプラインの複数のインスタンスを定義できます。以下の図は、Amazon EKS および Fargate プロファイル付きの Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネントを示しています。

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*図: Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、パイプラインで [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) のインスタンスを使用し、Kubelet から直接メトリクスを収集しています。AWS Container Insights Receiver (`awscontainerinsightreceiver`) は、[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) をサポートする AWS 固有のレシーバーです。CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約します。データは [埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。EMF データから、Amazon CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約された CloudWatch メトリクスを作成できます。以下は `awscontainerinsightreceiver` 設定のサンプル例です：

```
receivers:
  awscontainerinsightreceiver:
    # すべてのパラメータはオプションです
    collection_interval: 60s
    container_orchestrator: eks
    add_service_as_attribute: true 
    prefer_full_pod_name: false 
    add_full_pod_name_metric_label: false 
```

これは、上記の設定を使用して Amazon EKS 上にコレクターを DaemonSet としてデプロイすることを意味します。また、このレシーバーが Kubelet から直接収集するより完全なメトリクスセットにアクセスできます。ADOT Collector の複数のインスタンスがあれば、クラスター内のすべてのノードからリソースメトリクスを収集するのに十分です。ADOT コレクターの単一インスタンスは負荷が高い場合に圧倒される可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*図: Fargate プロファイル付きの Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、Kubernetes クラスター内のワーカーノード上の kubelet が、*/metrics/cadvisor* エンドポイントで CPU、メモリ、ディスク、ネットワーク使用量などのリソースメトリクスを公開しています。しかし、EKS Fargate のネットワークアーキテクチャでは、Pod がそのワーカーノード上の kubelet に直接到達することは許可されていません。そのため、ADOT Collector は Kubernetes API サーバーを呼び出してワーカーノード上の kubelet への接続をプロキシし、そのノード上のワークロードの kubelet の cAdvisor メトリクスを収集します。これらのメトリクスは Prometheus 形式で利用可能です。したがって、コレクターは [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) のインスタンスを Prometheus サーバーの代替として使用し、Kubernetes API サーバーエンドポイントからこれらのメトリクスをスクレイピングします。Kubernetes サービスディスカバリを使用して、レシーバーは EKS クラスター内のすべてのワーカーノードを発見できます。したがって、ADOT Collector の複数のインスタンスがあれば、クラスター内のすべてのノードからリソースメトリクスを収集するのに十分です。ADOT コレクターの単一インスタンスは負荷が高い場合に圧倒される可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

メトリクスは、フィルタリング、名前変更、データ集約、変換などを行う一連のプロセッサーを通過します。以下は、上図の Amazon EKS 用 ADOT Collector インスタンスのパイプラインで使用されるプロセッサーのリストです。

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) は、名前に基づいてメトリクスを含めたり除外したりするための AWS OpenTelemetry ディストリビューションの一部です。メトリクス収集パイプラインの一部として使用して、不要なメトリクスをフィルタリングできます。例えば、Container Insights が Pod レベルのメトリクス（名前のプレフィックスが `pod_`）のみを収集し、ネットワーキング用のメトリクス（名前のプレフィックスが `pod_network`）を除外したい場合は以下のようになります。

```
      # 関心のある名前変更されたメトリクスのみをフィルタリング
      filter:
        metrics:
          include:
            match_type: regexp
            metric_names:
              - new_container_.*
              - pod_.*
```

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) は、メトリクスの名前変更、ラベルキーと値の追加、名前変更、削除に使用できます。また、ラベルまたはラベル値全体でメトリクスのスケーリングと集約を実行するためにも使用できます。

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) は、単調増加の累積和とヒストグラムメトリクスを単調増加のデルタメトリクスに変換します。非単調増加の和と指数ヒストグラムは除外されます。

```
` # 累積和データポイントをデルタに変換
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) は、デルタ和メトリクスをレートメトリクスに変換します。このレートはゲージです。

```
` # デルタをレートに変換
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

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) は、既存のメトリクスを使用して、与えられたルールに従って新しいメトリクスを作成するために使用できます。

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

パイプラインの最後のコンポーネントは [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) で、メトリクスを埋め込みメトリクスフォーマット (EMF) に変換し、[PutLogEvents](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API を使用して直接 CloudWatch Logs に送信します。以下のメトリクスリストは、Amazon EKS 上で実行されている各ワークロードに対して ADOT Collector によって CloudWatch に送信されます。

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

各メトリクスは以下のディメンションセットに関連付けられ、*ContainerInsights* という名前の CloudWatch 名前空間の下で収集されます。

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

さらに、[ADOT 向け Container Insight


### Amazon EKS 向け CloudWatch Container Insights における Fluent Bit の統合

[Fluent Bit](https://fluentbit.io/) は、オープンソースのマルチプラットフォームログプロセッサおよびフォワーダーです。さまざまなソースからデータとログを収集し、統合して CloudWatch Logs を含む異なる送信先に送信することができます。また、[Docker](https://www.docker.com/) や [Kubernetes](https://kubernetes.io/) 環境とも完全に互換性があります。新しく導入された Fluent Bit デーモンセットを使用することで、EKS クラスターからコンテナログを CloudWatch Logs に送信し、ログの保存と分析を行うことができます。

軽量な特性により、EKS ワーカーノードの Container Insights でデフォルトのログフォワーダーとして Fluent Bit を使用することで、アプリケーションログを効率的かつ確実に CloudWatch Logs にストリーミングできます。Fluent Bit を使用することで、Container Insights は数千の重要なビジネスログをスケーラブルかつリソース効率の高い方法で配信できます。特に Pod レベルでの CPU とメモリ使用量の面で効率的です。言い換えれば、以前使用されていたログフォワーダーである FluentD と比較して、Fluent Bit はリソースフットプリントが小さく、結果としてメモリと CPU のリソース効率が高くなります。一方、Fluent Bit と関連プラグインを含む [AWS for Fluent Bit イメージ](https://github.com/aws/aws-for-fluent-bit) は、AWS エコシステム内で統一されたエクスペリエンスを提供することを目的としているため、Fluent Bit に新しい AWS 機能をより迅速に採用する柔軟性を与えています。

以下のアーキテクチャは、EKS 向け CloudWatch Container Insights で使用される個々のコンポーネントを示しています：

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*図：EKS 向け CloudWatch Container Insights で使用される個々のコンポーネント*

コンテナを扱う際は、可能な限りアプリケーションログを含むすべてのログを、Docker JSON ロギングドライバーを使用して標準出力 (stdout) と標準エラー出力 (stderr) を通じてプッシュすることが推奨されます。このため、EKS ではロギングドライバーがデフォルトで設定されており、コンテナ化されたアプリケーションが `stdout` または `stderr` に書き込むすべてのものが、ワーカーノードの `"/var/log/containers"` 下の JSON ファイルにストリーミングされます。Container Insights は、これらのログをデフォルトで 3 つの異なるカテゴリに分類し、Fluent Bit 内に各カテゴリ専用の入力ストリームを作成し、CloudWatch Logs 内に独立したロググループを作成します。これらのカテゴリは以下の通りです：

* アプリケーションログ：`"/var/log/containers/*.log"` 下に保存されるすべてのアプリケーションログは、専用の `/aws/containerinsights/Cluster_Name/application` ロググループにストリーミングされます。kube-proxy や aws-node ログなどの非アプリケーションログはデフォルトで除外されます。ただし、CoreDNS ログなどの追加の Kubernetes アドオンログも処理され、このロググループにストリーミングされます。
* ホストログ：各 EKS ワーカーノードのシステムログは、`/aws/containerinsights/Cluster_Name/host` ロググループにストリーミングされます。これらのシステムログには、`"/var/log/messages,/var/log/dmesg,/var/log/secure"` ファイルの内容が含まれます。コンテナ化されたワークロードのステートレスで動的な性質を考慮すると、EKS ワーカーノードがスケーリング活動中に頻繁に終了されるため、これらのログをリアルタイムで Fluent Bit でストリーミングし、ノードが終了した後でも CloudWatch Logs で利用可能にすることは、EKS ワーカーノードの可観測性とヘルスモニタリングの観点から重要です。また、多くの場合、ワーカーノードにログインせずにクラスターの問題をデバッグまたはトラブルシューティングし、これらのログをより体系的に分析することができます。
* データプレーンログ：EKS はすでに [コントロールプレーンログ](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html) を提供しています。Container Insights における Fluent Bit 統合により、すべてのワーカーノードで実行され、実行中の Pod の維持を担当する EKS データプレーンコンポーネントによって生成されるログがデータプレーンログとしてキャプチャされます。これらのログも `'/aws/containerinsights/Cluster_Name/dataplane'` 下の専用の CloudWatch ロググループにストリーミングされます。kube-proxy、aws-node、Docker ランタイムログがこのロググループに保存されます。コントロールプレーンログに加えて、データプレーンログを CloudWatch Logs に保存することで、EKS クラスターの完全な全体像を提供するのに役立ちます。

さらに、Fluent Bit の設定、Fluent Bit のモニタリング、ログ分析などのトピックについては、[Amazon EKS における Fluent Bit の統合](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) で詳しく学んでください。



### Amazon EKS における Container Insights のコスト削減

デフォルト設定では、Container Insights レシーバーは [レシーバーのドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes) で定義されている完全なメトリクスセットを収集します。収集されるメトリクスとディメンションの数は多く、大規模なクラスターでは、メトリクスの取り込みと保存のコストが大幅に増加します。ここでは、価値のあるメトリクスのみを送信してコストを削減するために、ADOT Collector を設定する 2 つの異なるアプローチを紹介します。




#### プロセッサーの使用

このアプローチでは、上記で説明した OpenTelemetry プロセッサーを導入して、メトリクスや属性をフィルタリングし、[EMF ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) のサイズを削減します。ここでは、*Filter* と *Resource* という 2 つのプロセッサーの基本的な使用方法を示します。

[Filter プロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md) は、`otel-agent-conf` という名前の `ConfigMap` に含めることができます：

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

[Resource プロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) も AWS OpenTelemetry Distro に組み込まれており、不要なメトリクス属性を削除するために使用できます。例えば、EMF ログから `Kubernetes` と `Sources` フィールドを削除したい場合、以下のようにリソースプロセッサーをパイプラインに追加できます：

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

このアプローチでは、CloudWatch EMF エクスポーターを設定して、CloudWatch Logs に送信したいメトリクスのセットのみを生成するようにします。CloudWatch EMF エクスポーター設定の [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) セクションを使用して、エクスポートしたいメトリクスとディメンションのセットを定義できます。例えば、デフォルト設定から Pod メトリクスのみを保持することができます。この `metric_declaration` セクションは以下のようになり、メトリクス数を減らすために、他のものを気にしない場合はディメンションセットを `[PodName, Namespace, ClusterName]` のみに保持できます：

```
  awsemf:
    namespace: ContainerInsights
    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
    log_stream_name: '{NodeName}'
    resource_to_telemetry_conversion:
      enabled: true
    dimension_rollup_option: NoDimensionRollup
    parse_json_encoded_attr_values: [Sources, kubernetes]
    # カスタマイズされたメトリクス宣言セクション
    metric_declarations:
      # Pod メトリクス
      - dimensions: [[PodName, Namespace, ClusterName]]
        metric_name_selectors:
          - pod_cpu_utilization
          - pod_memory_utilization
          - pod_cpu_utilization_over_pod_limit
          - pod_memory_utilization_over_pod_limit
```

この設定により、デフォルト設定の複数のディメンションに対する 55 の異なるメトリクスではなく、単一のディメンション `[PodName, Namespace, ClusterName]` 内で以下の 4 つのメトリクスが生成されストリーミングされます：

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

この設定により、デフォルトで設定されているすべてのメトリクスではなく、興味のあるメトリクスのみを送信することができます。結果として、Container Insights のメトリクス取り込みコストを大幅に削減できます。この柔軟性により、Container Insights の顧客はエクスポートされるメトリクスを高度に制御できます。`awsemf` エクスポーター設定を変更してメトリクスをカスタマイズすることも非常に柔軟で、送信したいメトリクスとそのディメンションの両方をカスタマイズできます。これは CloudWatch に送信されるログにのみ適用されることに注意してください。

上記で説明した 2 つのアプローチは互いに排他的ではありません。実際、両方を組み合わせることで、監視システムに取り込みたいメトリクスをカスタマイズする際に高度な柔軟性を得ることができます。このアプローチを使用して、以下のグラフに示すように、メトリクスの保存と処理に関連するコストを削減します。

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*図：AWS コストエクスプローラー*

上記の AWS コストエクスプローラーのグラフでは、小規模な EKS クラスター（ワーカーノード 20 台、Pod 220 個）で ADOT Collector の異なる設定を使用した場合の CloudWatch に関連する日々のコストを確認できます。*8 月 15 日* は、デフォルト設定の ADOT Collector を使用した CloudWatch の請求を示しています。*8 月 16 日* には、[EMF エクスポーターのカスタマイズ](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) アプローチを使用し、約 30% のコスト削減が見られます。*8 月 17 日* には、[プロセッサー](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) アプローチを使用し、約 45% のコスト削減を達成しています。

Container Insights によって送信されるメトリクスをカスタマイズすることのトレードオフを考慮する必要があります。監視コストを削減できますが、監視対象クラスターの可視性を犠牲にすることになります。また、ダッシュボードで使用されているメトリクスとディメンションを送信しないように選択できるため、AWS コンソール内の Container Insights が提供するビルトインダッシュボードに影響を与える可能性があります。さらに学習を深めるには、[Amazon EKS の Container Insights によって送信されるメトリクスをカスタマイズすることによるコスト削減](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) をご覧ください。



### EKS Blueprints を使用した Container Insights のセットアップ

[EKS Blueprints](https://aws.amazon.com/jp/blogs/news/bootstrapping-clusters-with-eks-blueprints/) は、アカウントやリージョン間で一貫性のある、すぐに使用可能な EKS クラスターを構成およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html) や、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD などの幅広い人気のオープンソースアドオンを含む EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、インフラストラクチャのデプロイメントを自動化するのに役立つ 2 つの人気のある IaC フレームワーク、[HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) で実装されています。

EKS Blueprints を使用した Amazon EKS クラスター作成プロセスの一部として、Container Insights を Day One の運用ツールとしてセットアップし、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約して Amazon CloudWatch コンソールに表示することができます。



### 結論

オブザーバビリティのベストプラクティスガイドのこのセクションでは、CloudWatch Container Insights に関する多くの詳細な内容を扱いました。これには Amazon CloudWatch Container Insights の紹介と、Amazon EKS 上のコンテナ化されたワークロードを観察するのにどのように役立つかが含まれています。AWS Distro for Open Telemetry と Amazon CloudWatch Container Insights を使用して、Container Insights メトリクスの収集を有効にし、Amazon CloudWatch コンソールでコンテナ化されたワークロードのメトリクスを可視化する方法について、より深く掘り下げました。

次に、Amazon EKS 向けの CloudWatch Container Insights における Fluent Bit 統合について詳しく説明しました。これにより、Fluent Bit 内に専用の入力ストリームを作成し、アプリケーション、ホスト、データプレーンログ用に CloudWatch Logs 内に独立したロググループを作成できます。

さらに、CloudWatch Container Insights でコスト削減を実現するための 2 つの異なるアプローチ（プロセッサーとメトリクスディメンション）について説明しました。最後に、Amazon EKS クラスター作成プロセス中に Container Insights をセットアップするための手段として EKS Blueprints を使用する方法について簡単に説明しました。

[One Observability Workshop](https://catalog.workshops.aws/observability/en-US) 内の [CloudWatch Container Insights モジュール](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) で実践的な経験を積むことができます。
