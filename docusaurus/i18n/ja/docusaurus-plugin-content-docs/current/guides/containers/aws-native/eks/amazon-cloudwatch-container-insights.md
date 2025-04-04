# Amazon CloudWatch Container Insights

オブザーバビリティのベストプラクティスガイドのこのセクションでは、Amazon CloudWatch Container Insights に関連する以下のトピックについて詳しく説明します：

* Amazon CloudWatch Container Insights の概要
* AWS Distro for OpenTelemetry を使用した Amazon CloudWatch Container Insights の活用
* Amazon EKS における CloudWatch Container Insights での Fluent Bit の統合
* Amazon EKS での Container Insights によるコスト削減
* EKS Blueprints を使用した Container Insights のセットアップ



### はじめに

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するのに役立ちます。メトリクスデータは、[埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。これらのパフォーマンスログイベントは、高カーディナリティデータをスケールに応じて取り込み、保存できる構造化された JSON スキーマを使用します。このデータから、CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約されたメトリクスを CloudWatch メトリクスとして作成します。Container Insights が収集するメトリクスは、CloudWatch の自動ダッシュボードで利用できます。Container Insights は、セルフマネージドノードグループ、マネージドノードグループ、AWS Fargate プロファイルを持つ Amazon EKS クラスターで利用できます。

コスト最適化の観点から、また Container Insights のコストを管理するために、CloudWatch はログデータから可能なすべてのメトリクスを自動的に作成するわけではありません。ただし、CloudWatch Logs Insights を使用して生のパフォーマンスログイベントを分析することで、追加のメトリクスとより詳細な粒度を表示できます。Container Insights によって収集されるメトリクスはカスタムメトリクスとして課金されます。CloudWatch の料金について詳しくは、[Amazon CloudWatch の料金](https://aws.amazon.com/jp/cloudwatch/pricing/) をご覧ください。

Amazon EKS では、Container Insights は Amazon Elastic Container Registry を通じて Amazon が提供する [CloudWatch エージェント](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) のコンテナ化バージョンを使用して、クラスター内で実行中のすべてのコンテナを検出します。その後、パフォーマンススタックのあらゆる層でパフォーマンスデータを収集します。Container Insights は、収集するログとメトリクスに対して AWS KMS キーによる暗号化をサポートしています。この暗号化を有効にするには、Container Insights データを受け取るロググループに対して AWS KMS 暗号化を手動で有効にする必要があります。これにより、CloudWatch Container Insights は提供された AWS KMS キーを使用してこのデータを暗号化します。対称キーのみがサポートされており、ロググループの暗号化に非対称 AWS KMS キーはサポートされていません。Container Insights は Linux インスタンスでのみサポートされています。Amazon EKS 向け Container Insights は、[これらの](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) AWS リージョンでサポートされています。



### AWS Distro for Open Telemetry を使用した Amazon CloudWatch Container Insights

ここでは、Amazon EKS ワークロードから Container Insights メトリクスの収集を可能にするオプションの 1 つである [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) について詳しく説明します。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、[OpenTelemetry](https://opentelemetry.io/docs/) プロジェクトの AWS がサポートする安全なディストリビューションです。

ADOT を使用すると、アプリケーションを一度だけ計装することで、相関のあるメトリクスとトレースを複数のモニタリングソリューションに送信できます。CloudWatch Container Insights 向けの ADOT サポートにより、お客様は [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) 上で実行されている Amazon EKS クラスターから CPU、メモリ、ディスク、ネットワーク使用量などのシステムメトリクスを収集できます。これは Amazon CloudWatch エージェントと同じ体験を提供します。

ADOT Collector は、Amazon EKS および AWS Fargate プロファイル for Amazon EKS 向けの CloudWatch Container Insights のサポートを提供しています。お客様は、Amazon EKS クラスターにデプロイされた Pod の CPU やメモリ使用率などのコンテナと Pod のメトリクスを収集し、既存の CloudWatch Container Insights の体験を変更することなく CloudWatch ダッシュボードで確認できるようになりました。これにより、お客様はトラフィックに応じてスケールアップまたはダウンを判断し、コストを削減することができます。

ADOT Collector には、Receiver、Processor、Exporter という 3 つの主要なコンポーネントで構成される[パイプラインの概念](https://opentelemetry.io/docs/collector/configuration/)があります。[Receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) は、データがコレクターに取り込まれる方法です。指定された形式でデータを受け取り、内部形式に変換し、パイプラインで定義された [Processors](https://opentelemetry.io/docs/collector/configuration/#processors) と [Exporters](https://opentelemetry.io/docs/collector/configuration/#exporters) に渡します。これはプルまたはプッシュベースで行うことができます。

Processor は、受信されてからエクスポートされるまでの間にデータのバッチ処理、フィルタリング、変換などのタスクを実行するためのオプションのコンポーネントです。Exporter は、メトリクス、ログ、またはトレースを送信する宛先を決定するために使用されます。コレクターのアーキテクチャでは、YAML 設定を通じてこのようなパイプラインの複数のインスタンスを定義できます。以下の図は、Amazon EKS および Fargate プロファイル付きの Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネントを示しています。

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*図：Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、パイプラインで [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) のインスタンスを使用し、Kubelet から直接メトリクスを収集しています。AWS Container Insights Receiver (`awscontainerinsightreceiver`) は、[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) をサポートする AWS 固有の Receiver です。

CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約します。データは [埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用してパフォーマンスログイベントとして収集されます。EMF データから、Amazon CloudWatch はクラスター、ノード、Pod、タスク、サービスレベルで集約された CloudWatch メトリクスを作成できます。以下は `awscontainerinsightreceiver` 設定のサンプル例です：

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

これには、上記の設定を使用して Amazon EKS 上に DaemonSet としてコレクターをデプロイすることが含まれます。また、この Receiver が Kubelet から直接収集する、より完全なメトリクスセットにアクセスできます。クラスター内のすべてのノードからリソースメトリクスを収集するには、ADOT Collector の複数のインスタンスがあれば十分です。ADOT Collector の単一インスタンスは高負荷時に過負荷になる可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*図：Fargate プロファイル付き Amazon EKS にデプロイされた ADOT Collector インスタンスのパイプラインコンポーネント*

上記のアーキテクチャでは、Kubernetes クラスター内のワーカーノード上の Kubelet が、*/metrics/cadvisor* エンドポイントで CPU、メモリ、ディスク、ネットワーク使用量などのリソースメトリクスを公開しています。しかし、EKS Fargate のネットワークアーキテクチャでは、Pod がそのワーカーノード上の Kubelet に直接アクセスすることはできません。

そのため、ADOT Collector は Kubernetes API サーバーを呼び出してワーカーノード上の Kubelet への接続をプロキシし、そのノード上のワークロードの Kubelet の cAdvisor メトリクスを収集します。これらのメトリクスは Prometheus 形式で利用可能です。したがって、コレクターは Prometheus サーバーの代替として [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) のインスタンスを使用し、Kubernetes API サーバーエンドポイントからこれらのメトリクスをスクレイピングします。

Kubernetes サービスディスカバリを使用して、Receiver は EKS クラスター内のすべてのワーカーノードを検出できます。したがって、クラスター内のすべてのノードからリソースメトリクスを収集するには、ADOT Collector の複数のインスタンスがあれば十分です。ADOT Collector の単一インスタンスは高負荷時に過負荷になる可能性があるため、常に複数のコレクターをデプロイすることをお勧めします。

メトリクスは、フィルタリング、名前の変更、データの集約と変換などを実行する一連の Processor を通過します。以下は、上記の Amazon EKS 用の ADOT Collector インスタンスのパイプラインで使用される Processor のリストです。

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) は、名前に基づいてメトリクスを含めるか除外するための AWS OpenTelemetry ディストリビューションの一部です。不要なメトリクスをフィルタリングするために、メトリクス収集パイプラインの一部として使用できます。たとえば、Container Insights でネットワーク関連のメトリクス（名前のプレフィックスが `pod_network` のもの）を除外し、Pod レベルのメトリクス（名前のプレフィックスが `pod_` のもの）のみを収集したい場合があります。

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

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) は、与えられたルールに従って既存のメトリクスを使用して新しいメトリクスを作成するために使用できます。

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

パイプラインの最後のコンポーネントは [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) で、メトリクスを埋め込みメトリクスフォーマット (EMF) に変換し、[PutLogEvents](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_PutLogEvents.html) API を使用して CloudWatch Logs に直接送信します。以下は、Amazon EKS 上で実行されている各ワークロードについて ADOT Collector が CloudWatch に送信するメトリクスのリストです。

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

各メトリクスには以下のディメンションセットが関連付けられ、*ContainerInsights* という CloudWatch 名前空間の下で収集されます。

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

さらに、[ADOT の Container Insights Prometheus サポート](https://aws.amazon.com/jp/blogs/news/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) および [CloudWatch Container Insights を使用して Amazon EKS リソースメトリクスを可視化するための Amazon EKS への ADOT Collector のデプロイ](https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/) について学習し、Amazon EKS クラスターで ADOT Collector パイプラインをセットアップし、CloudWatch Container Insights で Amazon EKS リソースメトリクスを可視化する方法を確認してください。

また、[Amazon CloudWatch Container Insights を使用したコンテナ化アプリケーションの簡単なモニタリング](https://community.aws/tutorials/navigating-amazon-eks/eks-monitor-containerized-applications#step-3-use-cloudwatch-logs-insights-query-to-search-and-analyze-container-logs) を参照してください。これには、Amazon EKS クラスターの設定、コンテナ化アプリケーションのデプロイ、Container Insights を使用したアプリケーションのパフォーマンスモニタリングに関するステップバイステップの手順が含まれています。




### Amazon EKS 向け CloudWatch Container Insights における Fluent Bit の統合

[Fluent Bit](https://fluentbit.io/) は、オープンソースのマルチプラットフォームログプロセッサおよびフォワーダーで、さまざまなソースからデータとログを収集し、それらを統合して CloudWatch Logs を含むさまざまな送信先に送信することができます。また、[Docker](https://www.docker.com/) や [Kubernetes](https://kubernetes.io/) 環境とも完全に互換性があります。新しく導入された Fluent Bit デーモンセットを使用することで、EKS クラスターからコンテナログを CloudWatch Logs に送信し、ログの保存と分析を行うことができます。

軽量な特性を活かし、EKS ワーカーノードの Container Insights でデフォルトのログフォワーダーとして Fluent Bit を使用することで、アプリケーションログを効率的かつ確実に CloudWatch Logs にストリーミングできます。Fluent Bit を使用することで、Container Insights は Pod レベルでの CPU とメモリ使用量の面で特に効率的に、数千の重要なビジネスログを大規模に配信することができます。つまり、以前使用されていたログフォワーダーの FluentD と比較して、Fluent Bit はリソースフットプリントが小さく、結果としてメモリと CPU のリソース効率が向上します。一方、Fluent Bit と関連プラグインを含む [AWS for Fluent Bit イメージ](https://github.com/aws/aws-for-fluent-bit) は、AWS エコシステム内での統一されたエクスペリエンスを提供することを目的としているため、Fluent Bit に新しい AWS 機能をより迅速に採用する柔軟性を追加で提供します。

以下のアーキテクチャは、EKS 向け CloudWatch Container Insights で使用される個々のコンポーネントを示しています：

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*図：EKS 向け CloudWatch Container Insights で使用される個々のコンポーネント*

コンテナを扱う際は、Docker JSON ロギングドライバーを使用して、アプリケーションログを含むすべてのログを可能な限り標準出力 (stdout) と標準エラー出力 (stderr) を通じて出力することが推奨されます。このため、EKS ではロギングドライバーがデフォルトで設定されており、コンテナ化されたアプリケーションが `stdout` または `stderr` に書き込むすべての内容は、ワーカーノードの `"/var/log/containers"` 配下の JSON ファイルにストリーミングされます。Container Insights は、これらのログをデフォルトで 3 つのカテゴリに分類し、Fluent Bit 内に専用の入力ストリームを作成し、CloudWatch Logs 内に独立したロググループを作成します。これらのカテゴリは以下の通りです：

* アプリケーションログ：`"/var/log/containers/*.log"` 配下に保存されるすべてのアプリケーションログは、専用の `/aws/containerinsights/Cluster_Name/application` ロググループにストリーミングされます。kube-proxy や aws-node ログなどの非アプリケーションログは、デフォルトで除外されます。ただし、CoreDNS ログなどの追加の Kubernetes アドオンログも処理され、このロググループにストリーミングされます。

* ホストログ：各 EKS ワーカーノードのシステムログは、`/aws/containerinsights/Cluster_Name/host` ロググループにストリーミングされます。これらのシステムログには、`"/var/log/messages,/var/log/dmesg,/var/log/secure"` ファイルの内容が含まれます。コンテナ化されたワークロードはステートレスで動的な性質を持ち、EKS ワーカーノードはスケーリング活動中に終了されることが多いため、Fluent Bit でこれらのログをリアルタイムにストリーミングし、ノードが終了した後でも CloudWatch Logs でこれらのログを利用できることは、EKS ワーカーノードの可観測性とヘルスモニタリングの観点から重要です。また、多くの場合、ワーカーノードにログインすることなくクラスターの問題をデバッグまたはトラブルシューティングし、これらのログをより体系的に分析することができます。

* データプレーンログ：EKS はすでに[コントロールプレーンログ](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html)を提供しています。Container Insights の Fluent Bit 統合により、各ワーカーノードで実行され、実行中の Pod の維持を担当する EKS データプレーンコンポーネントによって生成されるログは、データプレーンログとして取得されます。これらのログも `'/aws/containerinsights/Cluster_Name/dataplane'` 配下の専用の CloudWatch ロググループにストリーミングされます。kube-proxy、aws-node、Docker ランタイムログがこのロググループに保存されます。コントロールプレーンログに加えて、データプレーンログを CloudWatch Logs に保存することで、EKS クラスターの完全な全体像を提供するのに役立ちます。

さらに、Fluent Bit の設定、Fluent Bit のモニタリング、ログ分析などのトピックについては、[Amazon EKS における Fluent Bit の統合](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) で詳しく学んでください。



### Amazon EKS における Container Insights のコスト削減

デフォルトの設定では、Container Insights レシーバーは [レシーバーのドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes) で定義されている完全なメトリクスセットを収集します。
収集されるメトリクスとディメンションの数は多く、大規模なクラスターでは、メトリクスの取り込みと保存のコストが大幅に増加します。
ここでは、価値のあるメトリクスのみを送信してコストを削減するために、ADOT Collector を設定する 2 つの異なるアプローチを紹介します。



#### プロセッサーの使用

このアプローチでは、上記で説明した OpenTelemetry プロセッサーを導入して、メトリクスや属性をフィルタリングし、[EMF ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) のサイズを削減します。ここでは、*Filter* と *Resource* という 2 つのプロセッサーの基本的な使用方法を説明します。

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

[Resource プロセッサー](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) は AWS OpenTelemetry Distro に組み込まれており、不要なメトリクス属性を削除するために使用できます。たとえば、EMF ログから `Kubernetes` と `Sources` フィールドを削除したい場合は、パイプラインに Resource プロセッサーを追加できます：

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

このアプローチでは、CloudWatch EMF エクスポーターを設定して、CloudWatch Logs に送信したいメトリクスのセットのみを生成します。CloudWatch EMF エクスポーター設定の [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) セクションを使用して、エクスポートしたいメトリクスとディメンションのセットを定義できます。たとえば、デフォルト設定から Pod メトリクスのみを保持できます。この `metric_declaration` セクションは以下のようになります。また、他のディメンションが不要な場合は、ディメンションセットを `[PodName, Namespace, ClusterName]` のみに限定してメトリクス数を削減できます：

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

この設定により、デフォルト設定の複数のディメンションで 55 の異なるメトリクスを生成する代わりに、単一のディメンション `[PodName, Namespace, ClusterName]` で以下の 4 つのメトリクスのみを生成してストリーミングします：

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

この設定により、デフォルトで設定されているすべてのメトリクスではなく、関心のあるメトリクスのみを送信できます。その結果、Container Insights のメトリクス取り込みコストを大幅に削減できます。この柔軟性により、Container Insights のお客様はエクスポートされるメトリクスを高度に制御できます。`awsemf` エクスポーター設定を変更してメトリクスをカスタマイズすることも非常に柔軟で、送信したいメトリクスとそのディメンションの両方をカスタマイズできます。これは CloudWatch に送信されるログにのみ適用されることに注意してください。

上記で説明した 2 つのアプローチは、互いに排他的ではありません。実際、両方を組み合わせることで、監視システムに取り込むメトリクスのカスタマイズに高度な柔軟性を持たせることができます。以下のグラフに示すように、このアプローチを使用してメトリクスの保存と処理に関連するコストを削減します。

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*図：AWS Cost Explorer*

上記の AWS Cost Explorer グラフでは、小規模な EKS クラスター（ワーカーノード 20 個、Pod 220 個）で ADOT Collector の異なる設定を使用した場合の CloudWatch の日次コストを確認できます。*8 月 15 日* は、デフォルト設定の ADOT Collector を使用した CloudWatch の請求額を示しています。*8 月 16 日* には、[EMF エクスポーターのカスタマイズ](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) アプローチを使用し、約 30% のコスト削減が確認できます。*8 月 17 日* には、[Processors](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) アプローチを使用し、約 45% のコスト削減を達成しています。

Container Insights が送信するメトリクスをカスタマイズすることで、監視対象クラスターの可視性を犠牲にしてモニタリングコストを削減できますが、トレードオフを考慮する必要があります。また、ダッシュボードで使用されるメトリクスとディメンションを送信しないように選択できるため、カスタマイズされたメトリクスは AWS コンソール内の Container Insights が提供する組み込みダッシュボードに影響を与える可能性があります。詳細については、[Amazon EKS の Container Insights が送信するメトリクスをカスタマイズすることによるコスト削減](https://aws.amazon.com/jp/blogs/news/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) をご確認ください。



### EKS Blueprints を使用した Container Insights のセットアップ

[EKS Blueprints](https://aws.amazon.com/jp/blogs/news/bootstrapping-clusters-with-eks-blueprints/) は、アカウントやリージョン間で一貫性のある、すぐに使える EKS クラスターを設定およびデプロイするのに役立つ Infrastructure as Code (IaC) モジュールのコレクションです。EKS Blueprints を使用すると、[Amazon EKS アドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html) や、Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD などの広く使用されているオープンソースのアドオンを使用して、EKS クラスターを簡単にブートストラップできます。EKS Blueprints は、インフラストラクチャのデプロイを自動化するのに役立つ 2 つの一般的な IaC フレームワーク、[HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) と [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints) で実装されています。

EKS Blueprints を使用した Amazon EKS クラスターの作成プロセスの一部として、Container Insights を Day One の運用ツールとしてセットアップし、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約して Amazon CloudWatch コンソールに送信できます。



### まとめ

オブザーバビリティのベストプラクティスガイドのこのセクションでは、CloudWatch Container Insights について詳しく説明しました。
これには、Amazon CloudWatch Container Insights の紹介と、Amazon EKS 上のコンテナ化されたワークロードを監視する方法が含まれています。
AWS Distro for Open Telemetry と Amazon CloudWatch Container Insights を使用して、Container Insights メトリクスの収集を有効にし、Amazon CloudWatch コンソールでコンテナ化されたワークロードのメトリクスを可視化する方法について詳しく説明しました。
次に、Amazon EKS 向けの CloudWatch Container Insights における Fluent Bit 統合について詳しく説明し、Fluent Bit 内に専用の入力ストリームを作成し、アプリケーション、ホスト、データプレーンのログ用に CloudWatch Logs 内に独立したロググループを作成する方法を説明しました。
さらに、CloudWatch Container Insights でコスト削減を実現するための、プロセッサーやメトリクスディメンションなど、2 つの異なるアプローチについて説明しました。
最後に、Amazon EKS クラスターの作成プロセス中に Container Insights をセットアップするための手段として EKS Blueprints を使用する方法について簡単に説明しました。
[One Observability Workshop](https://catalog.workshops.aws/observability/en-US) 内の [CloudWatch Container Insights モジュール](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) で実践的な経験を積むことができます。
