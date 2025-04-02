# EKS オブザーバビリティ : 重要なメトリクス




# 現状の概要

モニタリングとは、インフラストラクチャとアプリケーションの所有者が、システムの過去と現在の状態を把握し理解するための手段として定義されます。これは、定義されたメトリクスやログの収集に重点を置いています。

モニタリングは長年にわたって進化してきました。
最初は、デバッグとトラブルシューティングのためのデバッグログやダンプログから始まり、syslog や top などのコマンドラインツールを使用した基本的なモニタリングへと進化し、さらにダッシュボードでの可視化が可能になりました。
クラウドの出現と規模の拡大により、現在では過去に比べてより多くの要素を追跡しています。
業界はオブザーバビリティへとシフトしており、これはインフラストラクチャとアプリケーションの所有者が積極的にシステムのトラブルシューティングとデバッグを行うためのソリューションとして定義されています。
オブザーバビリティは、メトリクスから導き出されるパターンの分析により重点を置いています。




# メトリクス、なぜ重要なのか？

メトリクスは、作成された時間順に保持される一連の数値データです。
環境内のサーバー数、ディスク使用量、1 秒あたりの処理リクエスト数、リクエストの完了までの遅延時間など、あらゆるものを追跡するために使用されます。
メトリクスは、システムのパフォーマンスを示すデータです。
小規模なクラスターでも大規模なクラスターでも、システムの健全性とパフォーマンスに関する洞察を得ることで、改善が必要な領域の特定、問題のトラブルシューティングとトレース、そしてワークロード全体のパフォーマンスと効率性の向上が可能になります。
これらの変更は、クラスターに費やす時間とリソースに影響を与え、それは直接コストに反映されます。



# メトリクス収集

EKS クラスターからのメトリクス収集は、[3 つのコンポーネント](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/)で構成されています：

1. ソース：このガイドに記載されているようなメトリクスの発生源。
2. エージェント：EKS 環境で実行されるアプリケーションで、一般的にエージェントと呼ばれ、メトリクスの監視データを収集し、2 番目のコンポーネントにプッシュします。このコンポーネントの例として、[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) や [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/) があります。
3. 送信先：監視データの保存と分析ソリューションで、このコンポーネントは通常、[時系列形式のデータ](https://aws-observability.github.io/observability-best-practices/signals/metrics/)に最適化されたデータサービスです。このコンポーネントの例として、[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) や [AWS CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注：このセクションでは、設定例は [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクとなっています。これは、EKS メトリクス収集の実装に関する最新のガイダンスと例を確実に入手できるようにするためです。



## マネージド型オープンソースソリューション

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポート対象バージョンです。これにより、ユーザーは相関のあるメトリクスとトレースを [Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) や [AWS Cloudwatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などの様々なモニタリングデータ収集ソリューションに送信できます。

ADOT は [EKS Managed Add-ons](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html) を通じて EKS クラスターにインストールでき、メトリクス (このページに記載されているものなど) やワークロードのトレースを収集するように設定できます。

AWS は、ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチで定期的に更新されています。

[ADOT のベストプラクティスと詳細情報はこちら。](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)



## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT)、Amazon Managed Service for Prometheus (AMP)、Amazon Managed Service for Grafana (AMG) を素早く導入して実行するには、AWS Observability Accelerator の[インフラストラクチャモニタリングの例](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/)を活用するのが最も簡単です。
Accelerator の例では、すぐに使えるメトリクス収集、アラートルール、Grafana ダッシュボードと共に、ツールとサービスを環境にデプロイします。

[EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/opentelemetry.html) のインストール、設定、運用に関する追加情報については、AWS ドキュメントを参照してください。



### ソース

EKS メトリクスは、全体的なソリューションの異なるレイヤーにおいて、複数の場所から作成されます。以下の表は、重要なメトリクスのセクションで説明されているメトリクスソースをまとめたものです。

|レイヤー	|ソース	|ツール	|インストールと詳細情報	|Helm チャート	|
|---	|---	|---	|---	|---	|
|コントロールプレーン	|*api server endpoint*/metrics	|N/A - API サーバーは Prometheus 形式で直接メトリクスを公開	|https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/prometheus.html	|N/A	|
|クラスターの状態	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy は Prometheus 形式で直接メトリクスを公開	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - Core DNS は Prometheus 形式で直接メトリクスを公開	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|ノード	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet または API サーバーを介してプロキシ	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|



### エージェント: AWS Distro for OpenTelemetry

AWS は、AWS EKS ADOT マネージドアドオンを通じて、EKS クラスターでの ADOT のインストール、設定、運用を推奨しています。このアドオンは ADOT オペレーター/コレクターのカスタムリソースモデルを利用し、クラスター上で複数の ADOT コレクターのデプロイ、設定、管理を可能にします。このアドオンのインストール、高度な設定、運用に関する詳細な情報は、この[ドキュメント](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)をご確認ください。

注意: AWS EKS ADOT マネージドアドオンのウェブコンソールは、[ADOT アドオンの高度な設定](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/deploy-collector-advanced-configuration.html)に使用できます。

ADOT コレクターの設定には 2 つのコンポーネントがあります。

1. コレクターのデプロイメントモード（deployment、daemonset など）を含む[コレクター設定](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)。
2. メトリクス収集に必要な Receivers、Processors、Exporters を含む [OpenTelemetry パイプライン設定](https://opentelemetry.io/docs/collector/configuration/)。設定スニペットの例:

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

完全なベストプラクティスのコレクター設定、ADOT パイプライン設定、Prometheus スクレイプ設定は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) で確認できます。



### 出力先: Amazon Managed Service for Prometheus

ADOT コレクターパイプラインは、Prometheus Remote Write 機能を使用して AMP インスタンスにメトリクスをエクスポートします。以下は設定スニペットの例で、AMP WRITE ENDPOINT URL に注目してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

完全なベストプラクティスのコレクター設定、ADOT パイプライン設定、Prometheus スクレイプ設定は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) で確認できます。

AMP の設定と使用に関するベストプラクティスは[こちら](https://aws-observability.github.io/observability-best-practices/recipes/amp/)をご覧ください。



# 関連するメトリクスとは？

メトリクスが少なかった時代は過ぎ去り、現在では逆に数百のメトリクスが利用可能です。
オブザーバビリティを重視したシステムを構築するためには、関連するメトリクスを見極めることが重要です。

このガイドでは、利用可能なメトリクスの異なるグループを概説し、インフラストラクチャとアプリケーションにオブザーバビリティを組み込む際に注目すべきメトリクスを説明します。
以下のメトリクスのリストは、ベストプラクティスに基づいて監視することをお勧めするメトリクスです。

以下のセクションに記載されているメトリクスは、[AWS Observability Accelerator Grafana ダッシュボード](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) と [Kube Prometheus Stack ダッシュボード](https://monitoring.mixins.dev/) で強調されているメトリクスに追加されるものです。



## コントロールプレーンのメトリクス

Amazon EKS コントロールプレーンは AWS によって管理され、AWS が管理するアカウントで実行されます。
etcd や Kubernetes API サーバーなどの Kubernetes コンポーネントを実行するコントロールプレーンノードで構成されています。
Kubernetes は、Pod、デプロイメント、名前空間などの起動や終了といったクラスター内のアクティビティをユーザーに通知するために、さまざまなイベントを発行します。
Amazon EKS コントロールプレーンは重要なコンポーネントであり、コアコンポーネントが適切に機能し、クラスターに必要な基本的なアクティビティを実行できることを確認するために追跡する必要があります。

コントロールプレーン API サーバーは数千のメトリクスを公開しています。以下の表は、監視することをお勧めする重要なコントロールプレーンメトリクスを示しています。

|名前	|メトリクス	|説明	|理由	|
|---	|---	|---	|---	|
|API サーバーの総リクエスト数	|apiserver_request_total	|各動詞、ドライラン値、グループ、バージョン、リソース、スコープ、コンポーネント、HTTP レスポンスコードごとに分類された API サーバーリクエストのカウンター	|	|
|API サーバーのレイテンシー	|apiserver_request_duration_seconds	|各動詞、ドライラン値、グループ、バージョン、リソース、サブリソース、スコープ、コンポーネントごとのレスポンスレイテンシー分布（秒単位）	|	|
|リクエストレイテンシー	|rest_client_request_duration_seconds	|リクエストレイテンシー（秒単位）。動詞と URL ごとに分類	|	|
|総リクエスト数	|rest_client_requests_total	|ステータスコード、メソッド、ホストごとに分類された HTTP リクエスト数	|	|
|API サーバーリクエスト時間	|apiserver_request_duration_seconds_bucket	|Kubernetes API サーバーへの各リクエストのレイテンシーを秒単位で測定	|	|
|API サーバーリクエストレイテンシー合計	|apiserver_request_latencies_sum	|K8s API サーバーがリクエストを処理するのに要した総時間を追跡する累積カウンター	|	|
|API サーバーの登録済みウォッチャー	|apiserver_registered_watchers	|特定のリソースに対して現在登録されているウォッチャーの数	|	|
|API サーバーのオブジェクト数	|apiserver_storage_object	|最後のチェック時点で種類ごとに分類された保存オブジェクトの数	|	|
|アドミッションコントローラーのレイテンシー	|apiserver_admission_controller_admission_duration_seconds	|名前で識別され、各操作と API リソース、タイプ（検証または許可）ごとに分類されたアドミッションコントローラーのレイテンシーヒストグラム（秒単位）	|	|
|etcd のレイテンシー	|etcd_request_duration_seconds	|各操作とオブジェクトタイプごとの etcd リクエストレイテンシー（秒単位）	|	|
|etcd DB サイズ	|apiserver_storage_db_total_size_in_bytes	|etcd データベースのサイズ	|etcd データベースの使用状況を事前に監視し、制限を超過することを防ぐのに役立ちます	|




## クラスターの状態メトリクス

クラスターの状態メトリクスは `kube-state-metrics` (KSM) によって生成されます。
KSM はクラスター内で Pod として実行され、Kubernetes API サーバーをリッスンし、クラスターの状態と Kubernetes オブジェクトの情報を Prometheus メトリクスとして提供するユーティリティです。
これらのメトリクスを利用するには、KSM を[インストール](https://github.com/kubernetes/kube-state-metrics)する必要があります。
これらのメトリクスは、Kubernetes が効果的に Pod のスケジューリングを行うために使用され、デプロイメント、レプリカセット、ノード、Pod などの様々なオブジェクトの健全性に焦点を当てています。
クラスターの状態メトリクスは、Pod のステータス、キャパシティ、可用性に関する情報を公開します。
クラスターのパフォーマンスを追跡し、問題を事前に把握し、クラスターの健全性を監視できるように、クラスターのスケジューリングタスクのパフォーマンスを把握することが重要です。
クラスターの状態メトリクスは約 X 個公開されており、以下の表は追跡すべき重要なメトリクスを示しています。

|名前	|メトリクス	|説明	|
|---	|---	|---	|
|ノードステータス	|kube_node_status_condition	|ノードの現在の健全性状態。ノードの状態のセットと、各状態に対する `true`、`false`、または `unknown` を返します	|
|要求 Pod 数	|kube_deployment_spec_replicas または kube_daemonset_status_desired_number_scheduled	|Deployment または DaemonSet に指定された Pod 数	|
|現在の Pod 数	|kube_deployment_status_replicas または kube_daemonset_status_current_number_scheduled	|Deployment または DaemonSet で現在実行中の Pod 数	|
|Pod キャパシティ	|kube_node_status_capacity_pods	|ノードで許可される最大 Pod 数	|
|利用可能な Pod 数	|kube_deployment_status_replicas_available または kube_daemonset_status_number_available	|Deployment または DaemonSet で現在利用可能な Pod 数	|
|利用不可能な Pod 数	|kube_deployment_status_replicas_unavailable または kube_daemonset_status_number_unavailable	|Deployment または DaemonSet で現在利用不可能な Pod 数	|
|Pod の準備状態	|kube_pod_status_ready	|Pod がクライアントリクエストを処理する準備ができているかどうか	|
|Pod のステータス	|kube_pod_status_phase	|Pod の現在のステータス。値は pending/running/succeeded/failed/unknown のいずれか	|
|Pod の待機理由	|kube_pod_container_status_waiting_reason	|コンテナが待機状態にある理由	|
|Pod の終了ステータス	|kube_pod_container_status_terminated	|コンテナが現在終了状態にあるかどうか	|
|スケジューリング待ちの Pod 数	|pending_pods	|ノード割り当てを待機している Pod 数	|
|Pod スケジューリング試行回数	|pod_scheduling_attempts	|Pod のスケジューリングを試行した回数	|




## クラスターアドオンのメトリクス

クラスターアドオンは、Kubernetes アプリケーションに運用上のサポート機能を提供するソフトウェアです。
これには、オブザーバビリティエージェントや、クラスターがネットワーク、コンピューティング、ストレージの AWS リソースと連携するための Kubernetes ドライバーなどのソフトウェアが含まれます。
アドオンソフトウェアは通常、Kubernetes コミュニティ、AWS などのクラウドプロバイダー、またはサードパーティベンダーによって構築・維持されています。
Amazon EKS は、Amazon VPC CNI プラグイン for Kubernetes、`kube-proxy`、CoreDNS などのセルフマネージド型アドオンを各クラスターに自動的にインストールします。

これらのクラスターアドオンは、ネットワーキングやドメイン名解決など、さまざまな分野で運用サポートを提供します。
重要なインフラストラクチャやコンポーネントがどのように動作しているかについての洞察を提供します。
クラスターの運用状態を理解するためには、アドオンのメトリクスを追跡することが重要です。

以下は、監視を検討すべき重要なアドオンとそれらの重要なメトリクスです。



## Amazon VPC CNI Plugin

Amazon EKS は、Amazon VPC Container Network Interface (VPC CNI) プラグインを通じてクラスターのネットワーキングを実装します。
CNI プラグインにより、Kubernetes Pod は VPC ネットワーク上と同じ IP アドレスを持つことができます。
具体的には、Pod 内のすべてのコンテナはネットワーク名前空間を共有し、ローカルポートを使用して相互に通信できます。
VPC CNI アドオンを使用することで、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、設定、更新に必要な作業を削減できます。

VPC CNI アドオンのメトリクスは、CNI Metrics Helper によって公開されます。
IP アドレスの割り当てを監視することは、クラスターの健全性を確保し、IP アドレスの枯渇問題を回避するために重要です。
[最新のネットワーキングのベストプラクティスと収集・監視すべき VPC CNI メトリクスはこちら](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)をご覧ください。



## CoreDNS メトリクス

CoreDNS は柔軟で拡張可能な DNS サーバーで、Kubernetes クラスターの DNS として機能します。CoreDNS Pod は、クラスター内のすべての Pod の名前解決を提供します。DNS を集中的に使用するワークロードを実行すると、DNS スロットリングにより断続的な CoreDNS の障害が発生することがあり、これがアプリケーションに影響を与える可能性があります。

[CoreDNS パフォーマンスメトリクスの最新のベストプラクティスはこちら](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)と [DNS スロットリングの問題に関する CoreDNS トラフィックのモニタリング](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)をご確認ください。



## Pod/Container メトリクス

アプリケーションのすべてのレイヤーにわたる使用状況を追跡することは重要です。これには、クラスター内で実行されているノードと Pod を詳しく確認することが含まれます。Pod のディメンションで利用可能なすべてのメトリクスの中で、このメトリクスのリストは、クラスター上で実行されているワークロードの状態を理解するために実用的です。CPU、メモリ、ネットワークの使用状況を追跡することで、アプリケーション関連の問題の診断とトラブルシューティングが可能になります。ワークロードのメトリクスを追跡することで、EKS で実行されているワークロードの適切なサイジングのためのリソース使用状況の洞察が得られます。

|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|名前空間ごとの実行中の Pod 数	|count by(namespace) (kube_pod_info)	|クラスターごとの名前空間	|
|Pod ごとのコンテナごとの CPU 使用量	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|クラスターごとの名前空間ごとの Pod	|
|Pod ごとのメモリ使用率	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|クラスターごとの名前空間ごとの Pod	|
|Pod ごとのネットワーク受信バイト数	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|クラスターごとの名前空間ごとの Pod	|
|Pod ごとのネットワーク送信バイト数	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|クラスターごとの名前空間ごとの Pod	|
|コンテナごとのコンテナ再起動回数	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|クラスターごとの名前空間ごとの Pod	|



## ノードメトリクス

Kube State Metrics と Prometheus ノードエクスポーターは、クラスター内のノードに関するメトリクス統計を収集します。
ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの使用状況を理解する上で重要です。
ノードリソースの使用状況を理解することは、クラスターで実行することが想定されるワークロードの種類に応じて、インスタンスタイプとストレージを適切に選択するために重要です。
以下のメトリクスは、追跡すべき重要なメトリクスの一部です。

|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|ノード CPU 使用率	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|クラスター毎のノード別	|
|ノードメモリ使用率	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|クラスター毎のノード別	|
|ノードネットワーク総バイト数	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|クラスター毎のノード別	|
|ノード CPU 予約容量	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|クラスター毎のノード別	|
|ノード毎の実行中 Pod 数	|sum(kubelet_running_pods) by (instance)	|クラスター毎のノード別	||ノードファイルシステム使用量	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|クラスター毎のノード別	|
|クラスター CPU 使用率	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|クラスター毎	|
|クラスターメモリ使用率	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|クラスター毎	|
|クラスターネットワーク総バイト数	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|クラスター毎	|
|実行中の Pod 数	|sum(kubelet_running_pod_count\{cluster=""\})	|クラスター毎	|
|実行中のコンテナ数	|sum(kubelet_running_container_count\{cluster=""\})	|クラスター毎	|
|クラスター CPU 制限	|sum(kube_node_status_allocatable\{resource="cpu"\})	|クラスター毎	|
|クラスターメモリ制限	|sum(kube_node_status_allocatable\{resource="memory"\})	|クラスター毎	|
|クラスターノード数	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|クラスター毎	|



# 追加リソース




## AWS のサービス

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/jp/prometheus](https://aws.amazon.com/jp/prometheus)

[https://aws.amazon.com/jp/cloudwatch/features/](https://aws.amazon.com/jp/cloudwatch/features/)



## ブログ

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/jp/blogs/news/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/jp/blogs/news/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)



## Infrastructure as Code (IaC) のリソース

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
