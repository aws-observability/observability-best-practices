# EKS Observability : 重要なメトリクス

# 現状

モニタリングとは、インフラストラクチャとアプリケーションの所有者が、定義されたメトリクスまたはログの収集に焦点を当てて、システムの履歴および現在の状態を確認し理解する方法を提供するソリューションとして定義されます。

モニタリングは長年にわたって進化してきました。デバッグやダンプログを使用して問題をデバッグおよびトラブルシューティングすることから始まり、syslogs、top などのコマンドラインツールを使用した基本的なモニタリングへと進化し、さらにダッシュボードでそれらを可視化できるようになりました。クラウドの出現と規模の拡大により、現在ではこれまで以上に多くのものを追跡しています。業界はオブザーバビリティへとシフトしており、これはインフラストラクチャとアプリケーションの所有者がシステムを積極的にトラブルシューティングおよびデバッグできるようにするソリューションとして定義されています。オブザーバビリティは、メトリクスから導き出されたパターンを見ることに重点を置いています。


# メトリクス、なぜ重要なのか？

メトリクスは、作成された時刻とともに順序付けられた一連の数値です。環境内のサーバー数、ディスク使用量、1 秒あたりに処理するリクエスト数、またはこれらのリクエストの完了にかかるレイテンシーなど、あらゆるものを追跡するために使用されます。メトリクスは、システムのパフォーマンスを示すデータです。小規模または大規模なクラスターを実行している場合でも、システムの健全性とパフォーマンスに関する洞察を得ることで、改善すべき領域を特定し、問題のトラブルシューティングとトレースを行い、ワークロード全体のパフォーマンスと効率を向上させることができます。これらの変更は、クラスターに費やす時間とリソースの量に影響を与える可能性があり、それはコストに直接反映されます。


# メトリクスの収集

EKS クラスターからメトリクスを収集するには、[3 つのコンポーネント](/observability-best-practices/ja/recipes/telemetry/)が必要です。

1. ソース: このガイドに記載されているようなメトリクスの送信元です。
2. エージェント: EKS 環境で実行されるアプリケーションで、多くの場合エージェントと呼ばれ、メトリクス監視データを収集し、このデータを 2 番目のコンポーネントにプッシュします。このコンポーネントの例としては、[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) や [CloudWatch Agent](/observability-best-practices/ja/tools/cloudwatch_agent/) があります。
3. 送信先: 監視データのストレージおよび分析ソリューションで、このコンポーネントは通常、[時系列形式のデータ](/observability-best-practices/ja/signals/metrics/)に最適化されたデータサービスです。このコンポーネントの例としては、[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) や [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注意: このセクションでは、設定例は [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクです。これは、EKS メトリクス収集の実装に関する最新のガイダンスと例を確実に入手できるようにするためです。

## マネージド型オープンソースソリューション

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポート対象バージョンであり、ユーザーが相関するメトリクスとトレースを [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) や [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などのさまざまな監視データ収集ソリューションに送信できるようにします。ADOT は、[EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) を通じて EKS クラスターにインストールし、メトリクス (このページに記載されているものなど) とワークロードトレースを収集するように設定できます。AWS は、ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチで定期的に更新されています。[ADOT のベストプラクティスと詳細情報。](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT)、Amazon Managed Service for Prometheus (AMP)、Amazon Managed Service for Grafana (AMG) を最も迅速に起動して実行する方法は、AWS Observability Accelerator の[インフラストラクチャモニタリングの例](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/)を利用することです。このアクセラレータの例では、すぐに使えるメトリクス収集、アラートルール、Grafana ダッシュボードを備えたツールとサービスを環境にデプロイします。

インストール、設定、および [EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html) の操作に関する追加情報については、AWS ドキュメントを参照してください。

### ソース

EKS メトリクスは、ソリューション全体のさまざまなレイヤーの複数の場所から作成されます。これは、必須メトリクスセクションで示されているメトリクスソースをまとめた表です。


|Layer	|Source	|Tool	|Installation and More info	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Control Plane	|*api server endpoint*/metrics	|N/A - api server exposes metrics in prometheus format directly 	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|Cluster State	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy exposes metrics in prometheus format directly	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - core DNS exposes metrics in prometheus format directly	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|Node	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet or proxied through api server 	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### エージェント：AWS Distro for OpenTelemetry

AWS では、EKS クラスター上での ADOT のインストール、設定、運用には、AWS EKS ADOT マネージド型アドオンの使用を推奨しています。このアドオンは、ADOT オペレーター/コレクターのカスタムリソースモデルを利用しており、クラスター上で複数の ADOT コレクターをデプロイ、設定、管理できます。このアドオンのインストール、高度な設定、運用に関する詳細情報については、この[ドキュメント](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)を参照してください。

注意: AWS EKS ADOT マネージド型アドオン Web コンソールは、[ADOT アドオンの高度な設定](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html)に使用できます。

ADOT コレクター設定には 2 つのコンポーネントがあります。

1. [コレクター設定](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)。コレクターのデプロイモード (deployment、daemonset など) が含まれます。
2. [OpenTelemetry パイプライン設定](https://opentelemetry.io/docs/collector/configuration/)。メトリクス収集に必要なレシーバー、プロセッサー、エクスポーターが含まれます。設定スニペットの例:

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Scrape configuration for the Prometheus Receiver
      # This is the same configuration used when Prometheus is installed using the community Helm chart
      #  
      prometheus:
        config:
          global:
            scrape_interval: 60s
            scrape_timeout: 10s

          scrape_configs:
          - job_name: kubernetes-apiservers
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - action: keep
              regex: default;kubernetes;https
              source_labels:
              - __meta_kubernetes_namespace
              - __meta_kubernetes_service_name
              - __meta_kubernetes_endpoint_port_name
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
              insecure_skip_verify: true

              ...
              ...

    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: aps
      health_check:
      pprof:
        endpoint: :1888
      zpages:
        endpoint: :55679
    processors:
      batch/metrics:
        timeout: 30s
        send_batch_size: 500
    service:
      extensions: [pprof, zpages, health_check, sigv4auth]
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: [batch/metrics]
          exporters: [logging, prometheusremotewrite]
```

ベストプラクティスのコレクター設定、ADOT パイプライン設定、Prometheus スクレイプ設定の完全な例は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) として提供されています。


### 送信先: Amazon Managed Service for Prometheus

ADOT コレクターパイプラインは、Prometheus Remote Write 機能を利用して AMP インスタンスにメトリクスをエクスポートします。設定例のスニペットです。AMP WRITE ENDPOINT URL に注意してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

ベストプラクティスのコレクター設定、ADOT パイプライン設定、Prometheus スクレイプ設定の完全な例は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) として提供されています。

AMP の設定と使用に関するベストプラクティスは[こちら](/observability-best-practices/ja/recipes/amp/)をご覧ください。

# 関連するメトリクスは何ですか？

利用可能なメトリクスがほとんどなかった時代は終わり、今日ではその逆で、何百ものメトリクスが利用可能です。関連性のあるメトリクスを判断できることは、オブザーバビリティファーストの考え方でシステムを構築する上で重要です。

このガイドでは、利用可能なメトリクスのさまざまなグループについて概説し、インフラストラクチャとアプリケーションにオブザーバビリティを構築する際に注目すべきメトリクスについて説明します。以下のメトリクスのリストは、ベストプラクティスに基づいて監視することを推奨するメトリクスのリストです。

以下のセクションに記載されているメトリクスは、[AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) および [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/) で強調表示されているメトリクスに加えて提供されるものです。

## コントロールプレーンメトリクス

Amazon EKS コントロールプレーンは AWS によって管理され、AWS が管理するアカウントで実行されます。これは、etcd や Kubernetes API サーバーなどの Kubernetes コンポーネントを実行するコントロールプレーンノードで構成されています。Kubernetes は、Pod、デプロイメント、名前空間などのスピンアップやティアダウンなど、クラスター内のアクティビティをユーザーに通知するために、さまざまなイベントを発行します。Amazon EKS コントロールプレーンは、コアコンポーネントが適切に機能し、クラスターに必要な基本的なアクティビティを実行できるようにするために追跡する必要がある重要なコンポーネントです。

Control Plane API Server は数千のメトリクスを公開しますが、以下の表は監視を推奨する重要な Control Plane メトリクスを示しています。

|Name	|Metric	|Description	|Reason	|
|---	|---	|---	|---	|
|API Server total requests	|apiserver_request_total	|Counter of apiserver requests broken out for each verb, dry run value, group, version, resource, scope, component, and HTTP response code.	|	|
|API Server latency	|apiserver_request_duration_seconds	|Response latency distribution in seconds for each verb, dry  run value, group, version, resource, subresource, scope, and component.	|	|
|Request latency	|rest_client_request_duration_seconds	|Request latency in seconds. Broken down by verb and URL.	|	|
|Total requests	|rest_client_requests_total	|Number of HTTP requests, partitioned by status code, method,  and host.	|	|
|API Server request duration	|apiserver_request_duration_seconds_bucket	|Measures the latency for each request to the Kubernetes API server in seconds	|	|
|API server request latency sum	|apiserver_request_latencies_sum	|Cumulative Counter which tracks total time taken by the K8 API server to process requests	|	|
|API server registered watchers	|apiserver_registered_watchers	|The number of currently registered watchers for a given resource	|	|
|API server number of objects	|apiserver_storage_object	|Number of stored objects at the time of last check split by kind.	|	|
|Admission controller latency	|apiserver_admission_controller_admission_duration_seconds	|Admission controller latency histogram in seconds, identified  by name and broken out for each operation and API resource and type (validate  or admit).	|	|
|Etcd latency	|etcd_request_duration_seconds	|Etcd request latency in seconds for each operation and object  type.	|	|
|Etcd DB size	|apiserver_storage_db_total_size_in_bytes	|Etcd database size.	|This helps you proactively monitor etcd database usage, and avoid overrunning the limit.	|

## Cluster State メトリクス

Cluster State Metrics は次によって生成されます `kube-state-metrics` (KSM)。KSM はクラスター内のポッドとして実行されるユーティリティで、Kubernetes API Server をリッスンし、クラスターの状態とクラスター内の Kubernetes オブジェクトに関する洞察を Prometheus メトリクスとして提供します。これらのメトリクスを利用できるようにするには、KSM を[インストール](https://github.com/kubernetes/kube-state-metrics)する必要があります。これらのメトリクスは、Kubernetes がポッドのスケジューリングを効果的に行うために使用され、デプロイメント、レプリカセット、ノード、ポッドなど、内部のさまざまなオブジェクトの健全性に焦点を当てています。クラスター状態メトリクスは、ステータス、容量、可用性に関するポッド情報を公開します。クラスターがスケジューリングタスクをどのように実行しているかを追跡することは、パフォーマンスを把握し、問題を未然に防ぎ、クラスターの健全性を監視するために不可欠です。公開されているクラスター状態メトリクスは約 X 個あり、以下の表は追跡すべき重要なメトリクスを示しています。

|Name	|Metric	|Description	|
|---	|---	|---	|
|Node status	|kube_node_status_condition	|Current health status of the node. Returns a set of node conditions and `true`, `false`, or `unknown` for each	|
|Desired pods	|kube_deployment_spec_replicas or kube_daemonset_status_desired_number_scheduled	|Number of pods specified for a Deployment or DaemonSet	|
|Current pods	|kube_deployment_status_replicas or kube_daemonset_status_current_number_scheduled	|Number of pods currently running in a Deployment or DaemonSet	|
|Pod capacity	|kube_node_status_capacity_pods	|Maximum pods allowed on the node	|
|Available pods	|kube_deployment_status_replicas_available or kube_daemonset_status_number_available	|Number of pods currently available for a Deployment or DaemonSet	|
|Unavailable pods	|kube_deployment_status_replicas_unavailable or kube_daemonset_status_number_unavailable	|Number of pods currently not available for a Deployment or DaemonSet	|
|Pod readiness	|kube_pod_status_ready	|If a pod is ready to serve client requests	|
|Pod status	|kube_pod_status_phase	|Current status of the pod; value would be pending/running/succeeded/failed/unknown	|
|Pod waiting reason	|kube_pod_container_status_waiting_reason	|Reason a container is in a waiting state	|
|Pod termination status	|kube_pod_container_status_terminated	|Whether the container is currently in a terminated state or not	|
|Pods pending scheduling	|pending_pods	|Number of pods awaiting node assignment	|
|Pod scheduling attempts	|pod_scheduling_attempts	|Number of attempts made to schedule pods	|

## クラスターアドオンメトリクス

クラスターアドオンは、Kubernetes アプリケーションに運用サポート機能を提供するソフトウェアです。これには、オブザーバビリティエージェントや、クラスターがネットワーキング、コンピューティング、ストレージのために基盤となる AWS リソースと対話できるようにする Kubernetes ドライバーなどのソフトウェアが含まれます。アドオンソフトウェアは通常、Kubernetes コミュニティ、AWS などのクラウドプロバイダー、またはサードパーティベンダーによって構築および保守されています。Amazon EKS は、Amazon VPC CNI plugin for Kubernetes などの自己管理型アドオンを自動的にインストールします。 `kube-proxy`、および各クラスターの CoreDNS が含まれます。

これらの Cluster アドオンは、ネットワーキング、ドメイン名解決など、さまざまな領域で運用サポートを提供します。重要なサポートインフラストラクチャとコンポーネントがどのように動作しているかについての洞察を提供します。アドオンメトリクスを追跡することは、クラスターの運用状態を理解するために重要です。

以下は、重要なメトリクスとともに監視を検討すべき必須のアドオンです。

## Amazon VPC CNI プラグイン

Amazon EKS は、Amazon VPC Container Network Interface (VPC CNI) プラグインを通じてクラスターネットワーキングを実装します。CNI プラグインにより、Kubernetes Pod は VPC ネットワーク上と同じ IP アドレスを持つことができます。より具体的には、Pod 内のすべてのコンテナはネットワーク名前空間を共有し、ローカルポートを使用して相互に通信できます。VPC CNI アドオンを使用すると、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、設定、更新に必要な労力を削減できます。

VPC CNI アドオンメトリクスは、CNI Metrics Helper によって公開されます。IP アドレス割り当てを監視することは、クラスターの健全性を確保し、IP 枯渇の問題を回避するために不可欠です。[収集および監視すべき最新のネットワーキングベストプラクティスと VPC CNI メトリクスについては、こちらを参照してください](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)。

## CoreDNS メトリクス

CoreDNS は、Kubernetes クラスター DNS として機能できる柔軟で拡張可能な DNS サーバーです。CoreDNS Pod は、クラスター内のすべての Pod に名前解決を提供します。DNS 集約型ワークロードを実行すると、DNS スロットリングにより断続的な CoreDNS 障害が発生することがあり、これがアプリケーションに影響を与える可能性があります。

主要な [CoreDNS パフォーマンスメトリクスの追跡に関する最新のベストプラクティスはこちら](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)と [DNS スロットリング問題に関する CoreDNS トラフィックの監視](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)をご確認ください。


## Pod/Container メトリクス

アプリケーションのすべてのレイヤーにわたる使用状況を追跡することは重要です。これには、クラスター内で実行されているノードと Pod を詳しく調べることが含まれます。Pod ディメンションで利用可能なすべてのメトリクスの中で、このメトリクスのリストは、クラスター上で実行されているワークロードの状態を理解するために実用的です。CPU、メモリ、ネットワークの使用状況を追跡することで、アプリケーション関連の問題を診断およびトラブルシューティングできます。ワークロードメトリクスを追跡することで、リソース使用率に関する洞察が得られ、EKS 上で実行されているワークロードを適切なサイズに調整できます。

|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Number of running pods per namspace	|count by(namespace) (kube_pod_info)	|Per Cluster by Namespace	|
|CPU usage per container per pod	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Memory utilization per pod	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Network Received Bytes per pod	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|Network Transmitted Bytes per pod	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|The number of container restarts per container	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Per Cluster by Namespace by Pod	|

## ノードメトリクス

Kube State Metrics と Prometheus node exporter は、クラスター内のノードに関するメトリクス統計を収集します。ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの使用率を理解する上で重要です。ノードリソースがどのように使用されているかを理解することは、クラスターで実行する予定のワークロードのタイプに効果的に対応するために、インスタンスタイプとストレージを適切に選択する上で重要です。以下のメトリクスは、追跡すべき重要なメトリクスの一部です。


|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Node CPU Utilization	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|Per Cluster by Node	|
|Node Memory Utilization	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|Per Cluster by Node	|
|Node Network Total Bytes	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Per Cluster by Node	|
|Node CPU Reserved Capacity	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|Per Cluster by Node	|
|Number of Running Pods per Node	|sum(kubelet_running_pods) by (instance)	|Per Cluster by Node	||Node Filesystem Usage	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|Per Cluster by Node	|
|Cluster CPU Utilization	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|Per Cluster	|
|Cluster Memory Utilization	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|Per Cluster	|
|Cluster Network Total Bytes	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Per Cluster	|
|Number of Running Pods	|sum(kubelet_running_pod_count\{cluster=""\})	|Per Cluster	|
|Number of Running Containers	|sum(kubelet_running_container_count\{cluster=""\})	|Per Cluster	|
|Cluster CPU Limit	|sum(kube_node_status_allocatable\{resource="cpu"\})	|Per Cluster	|
|Cluster Memory Limit	|sum(kube_node_status_allocatable\{resource="memory"\})	|Per Cluster	|
|Cluster Node Count	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|Per Cluster	|

# その他のリソース

## AWS サービス

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## ブログ

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Infrastructure as Code リソース

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
