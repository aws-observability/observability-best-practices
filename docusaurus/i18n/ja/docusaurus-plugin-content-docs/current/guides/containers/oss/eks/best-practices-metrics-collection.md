# EKS オブザーバビリティ：重要なメトリクス




# 現在の状況

モニタリングは、インフラストラクチャとアプリケーションの所有者が、システムの過去と現在の状態を確認し理解するための解決策として定義されます。
これは、定義されたメトリクスやログの収集に焦点を当てています。

モニタリングは長年にわたって進化してきました。
最初は、問題のデバッグやトラブルシューティングのためにデバッグログやダンプログを使用することから始まりました。
その後、syslog や top などのコマンドラインツールを使用した基本的なモニタリングへと進化し、さらにダッシュボードでの可視化が可能になりました。
クラウドの出現と規模の拡大に伴い、現在では過去に比べてより多くのものを追跡しています。

業界はオブザーバビリティへとシフトしており、これはインフラストラクチャとアプリケーションの所有者がシステムを積極的にトラブルシューティングおよびデバッグできるようにする解決策として定義されています。
オブザーバビリティは、メトリクスから導き出されたパターンの観察により重点を置いています。



# メトリクス、なぜ重要なのか？

メトリクスは、作成された時間順に保持される一連の数値データです。
環境内のサーバー数、ディスク使用量、1 秒あたりの処理リクエスト数、またはこれらのリクエストの完了にかかる遅延時間など、あらゆるものを追跡するために使用されます。
メトリクスは、システムのパフォーマンスを示すデータです。

小規模なクラスターであれ大規模なクラスターであれ、システムの健全性とパフォーマンスに関する洞察を得ることで、改善が必要な領域を特定し、問題のトラブルシューティングとトレースを行い、ワークロード全体のパフォーマンスと効率を向上させることができます。
これらの変更は、クラスターにかける時間とリソースに影響を与え、直接コストに反映されます。



# メトリクス収集

EKS クラスターからメトリクスを収集するには、[3つのコンポーネント](/observability-best-practices/ja/recipes/telemetry/)が必要です：

1. ソース：このガイドに記載されているようなメトリクスの発生源。
2. エージェント：EKS 環境で実行されるアプリケーションで、多くの場合エージェントと呼ばれます。メトリクスの監視データを収集し、2番目のコンポーネントにこのデータをプッシュします。このコンポーネントの例として、[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) や [CloudWatch エージェント](/observability-best-practices/ja/tools/cloudwatch_agent/)があります。
3. 送信先：監視データの保存と分析ソリューションで、このコンポーネントは通常、[時系列形式のデータ](/observability-best-practices/ja/signals/metrics/)に最適化されたデータサービスです。このコンポーネントの例として、[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) や [AWS CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注：このセクションでは、設定例は [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクになっています。これは、EKS メトリクス収集の実装に関する最新のガイダンスと例を確実に得られるようにするためです。



## マネージドオープンソースソリューション

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポートされているバージョンで、ユーザーが相関のあるメトリクスとトレースを [Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) や [AWS CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などの様々なモニタリングデータ収集ソリューションに送信できるようにします。

ADOT は [EKS マネージドアドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html) を通じて EKS クラスターにインストールでき、(このページに記載されているような) メトリクスやワークロードトレースを収集するように設定できます。

AWS は ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチで定期的に更新されています。

[ADOT のベストプラクティスと詳細情報はこちら。](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector/)



## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT)、Amazon Managed Service for Prometheus (AMP)、および Amazon Managed Grafana (AMG) を迅速に導入して稼働させる最も簡単な方法は、AWS Observability Accelerator の [インフラストラクチャモニタリングの例](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) を利用することです。アクセラレータの例では、すぐに使えるメトリクス収集、アラートルール、Grafana ダッシュボードを備えたツールとサービスを環境にデプロイします。

[ADOT 用 EKS マネージドアドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/opentelemetry.html) のインストール、設定、運用に関する追加情報については、AWS のドキュメントを参照してください。



### ソース

EKS メトリクスは、全体的なソリューションの異なるレイヤーの複数の場所から作成されます。以下の表は、重要なメトリクスセクションで言及されているメトリクスソースをまとめたものです。

|レイヤー	|ソース	|ツール	|インストールと詳細情報	|Helm チャート	|
|---	|---	|---	|---	|---	|
|コントロールプレーン	|*api server endpoint*/metrics	|N/A - API サーバーが直接 Prometheus 形式でメトリクスを公開	|https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/prometheus.html	|N/A	|
|クラスターの状態	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy が直接 Prometheus 形式でメトリクスを公開	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - Core DNS が直接 Prometheus 形式でメトリクスを公開	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|ノード	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet または API サーバーを介してプロキシ	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|



### エージェント: AWS Distro for OpenTelemetry

AWS は、AWS EKS ADOT マネージドアドオンを通じて、EKS クラスター上での ADOT のインストール、設定、運用を推奨しています。このアドオンは ADOT オペレーター/コレクターのカスタムリソースモデルを利用し、クラスター上で複数の ADOT コレクターのデプロイ、設定、管理を可能にします。このアドオンのインストール、高度な設定、運用に関する詳細情報は、この[ドキュメント](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)をご覧ください。

注意: AWS EKS ADOT マネージドアドオンの Web コンソールは、[ADOT アドオンの高度な設定](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/deploy-collector-advanced-configuration.html)に使用できます。

ADOT コレクターの設定には 2 つのコンポーネントがあります。

1. コレクターのデプロイメントモード（デプロイメント、デーモンセットなど）を含む[コレクター設定](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)。
2. メトリクス収集に必要なレシーバー、プロセッサー、エクスポーターを含む[OpenTelemetry パイプライン設定](https://opentelemetry.io/docs/collector/configuration/)。設定スニペットの例:

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Prometheus レシーバーのスクレイプ設定
      # これは、コミュニティの Helm チャートを使用して Prometheus をインストールする際に使用される設定と同じです
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

完全なベストプラクティスのコレクター設定、ADOT パイプライン設定、Prometheus スクレイプ設定は、[Observability Accelerator の Helm チャート](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml)として見つけることができます。



### 送信先: Amazon Managed Service for Prometheus

ADOT コレクターパイプラインは、Prometheus Remote Write 機能を利用してメトリクスを AMP インスタンスにエクスポートします。以下は設定スニペットの例です。AMP WRITE ENDPOINT URL に注目してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

完全なベストプラクティスのコレクター設定、ADOT パイプライン設定、および Prometheus スクレイプ設定は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) として見つけることができます。

AMP の設定と使用に関するベストプラクティスは[こちら](/observability-best-practices/ja/recipes/amp/)にあります。



# 関連するメトリクスとは何か？

以前はほとんどメトリクスが利用できなかった時代は過ぎ去り、現在では逆に何百ものメトリクスが利用可能です。
関連するメトリクスを特定できることは、オブザーバビリティを重視したシステムを構築する上で重要です。

このガイドでは、利用可能なメトリクスの異なるグループを概説し、インフラストラクチャとアプリケーションにオブザーバビリティを組み込む際に注目すべきメトリクスを説明します。
以下のメトリクスリストは、ベストプラクティスに基づいて監視することをおすすめするメトリクスのリストです。

以下のセクションに記載されているメトリクスは、[AWS Observability Accelerator Grafana ダッシュボード](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) と [Kube Prometheus Stack ダッシュボード](https://monitoring.mixins.dev/) で強調されているメトリクスに加えて推奨されるものです。



## コントロールプレーンのメトリクス

Amazon EKS コントロールプレーンは AWS によって管理され、AWS が管理するアカウントで実行されます。
これは、etcd や Kubernetes API サーバーなどの Kubernetes コンポーネントを実行するコントロールプレーンノードで構成されています。
Kubernetes は、Pod、デプロイメント、名前空間などの起動や終了といったクラスター内のアクティビティをユーザーに通知するために、さまざまなイベントを発行します。
Amazon EKS コントロールプレーンは、コアコンポーネントが適切に機能し、クラスターに必要な基本的なアクティビティを実行できることを確認するために追跡する必要がある重要なコンポーネントです。

コントロールプレーン API サーバーは数千のメトリクスを公開しています。
以下の表は、監視することをお勧めする重要なコントロールプレーンメトリクスを示しています。

|名前	|メトリクス	|説明	|理由	|
|---	|---	|---	|---	|
|API サーバーの総リクエスト数	|apiserver_request_total	|各動詞、ドライラン値、グループ、バージョン、リソース、スコープ、コンポーネント、HTTP レスポンスコードごとに分類された API サーバーリクエストのカウンター。	|	|
|API サーバーのレイテンシー	|apiserver_request_duration_seconds	|各動詞、ドライラン値、グループ、バージョン、リソース、サブリソース、スコープ、コンポーネントごとの秒単位のレスポンスレイテンシー分布。	|	|
|リクエストレイテンシー	|rest_client_request_duration_seconds	|秒単位のリクエストレイテンシー。動詞と URL ごとに分類。	|	|
|総リクエスト数	|rest_client_requests_total	|ステータスコード、メソッド、ホストごとに分類された HTTP リクエスト数。	|	|
|API サーバーリクエスト時間	|apiserver_request_duration_seconds_bucket	|Kubernetes API サーバーへの各リクエストのレイテンシーを秒単位で測定。	|	|
|API サーバーリクエストレイテンシー合計	|apiserver_request_latencies_sum	|K8s API サーバーがリクエストを処理するのに要した総時間を追跡する累積カウンター。	|	|
|API サーバーに登録されたウォッチャー	|apiserver_registered_watchers	|特定のリソースに対して現在登録されているウォッチャーの数。	|	|
|API サーバーのオブジェクト数	|apiserver_storage_object	|最後のチェック時に種類ごとに分類された保存オブジェクトの数。	|	|
|アドミッションコントローラーのレイテンシー	|apiserver_admission_controller_admission_duration_seconds	|名前で識別され、各操作と API リソース、タイプ（検証または許可）ごとに分類されたアドミッションコントローラーのレイテンシーヒストグラム（秒単位）。	|	|
|etcd のレイテンシー	|etcd_request_duration_seconds	|各操作とオブジェクトタイプの etcd リクエストレイテンシー（秒単位）。	|	|
|etcd の DB サイズ	|apiserver_storage_db_total_size_in_bytes	|etcd データベースのサイズ。	|これにより、etcd データベースの使用状況を事前に監視し、制限を超えることを回避できます。	|



## クラスターステートメトリクス

クラスターステートメトリクスは `kube-state-metrics` (KSM) によって生成されます。KSM はクラスター内でポッドとして実行されるユーティリティで、Kubernetes API サーバーをリッスンし、クラスターの状態と Kubernetes オブジェクトに関する洞察を Prometheus メトリクスとして提供します。これらのメトリクスを利用可能にするには、KSM を[インストール](https://github.com/kubernetes/kube-state-metrics)する必要があります。これらのメトリクスは、Kubernetes がポッドのスケジューリングを効果的に行うために使用され、デプロイメント、レプリカセット、ノード、ポッドなどの様々なオブジェクトの健全性に焦点を当てています。クラスターステートメトリクスは、ステータス、キャパシティ、可用性に関するポッド情報を公開します。クラスターのパフォーマンスを追跡し、問題を先取りし、クラスターの健全性を監視できるよう、クラスターのタスクスケジューリングのパフォーマンスを把握することが不可欠です。約 X 個のクラスターステートメトリクスが公開されていますが、以下の表は追跡すべき重要なメトリクスを示しています。

|名前	|メトリクス	|説明	|
|---	|---	|---	|
|ノードステータス	|kube_node_status_condition	|ノードの現在の健全性状態。ノードの状態のセットと、各状態に対する `true`、`false`、または `unknown` を返します	|
|希望するポッド数	|kube_deployment_spec_replicas または kube_daemonset_status_desired_number_scheduled	|デプロイメントまたは DaemonSet に指定されたポッドの数	|
|現在のポッド数	|kube_deployment_status_replicas または kube_daemonset_status_current_number_scheduled	|デプロイメントまたは DaemonSet で現在実行中のポッドの数	|
|ポッドキャパシティ	|kube_node_status_capacity_pods	|ノードで許可される最大ポッド数	|
|利用可能なポッド数	|kube_deployment_status_replicas_available または kube_daemonset_status_number_available	|デプロイメントまたは DaemonSet で現在利用可能なポッドの数	|
|利用不可能なポッド数	|kube_deployment_status_replicas_unavailable または kube_daemonset_status_number_unavailable	|デプロイメントまたは DaemonSet で現在利用不可能なポッドの数	|
|ポッドの準備状態	|kube_pod_status_ready	|ポッドがクライアントリクエストに応答する準備ができているかどうか	|
|ポッドステータス	|kube_pod_status_phase	|ポッドの現在のステータス。値は pending/running/succeeded/failed/unknown のいずれか	|
|ポッド待機理由	|kube_pod_container_status_waiting_reason	|コンテナが待機状態にある理由	|
|ポッド終了ステータス	|kube_pod_container_status_terminated	|コンテナが現在終了状態にあるかどうか	|
|スケジューリング待ちのポッド数	|pending_pods	|ノード割り当てを待機しているポッドの数	|
|ポッドスケジューリング試行回数	|pod_scheduling_attempts	|ポッドのスケジューリングを試みた回数	|




## クラスターアドオンのメトリクス

クラスターアドオンは、Kubernetes アプリケーションに対して運用上のサポート機能を提供するソフトウェアです。これには、オブザーバビリティエージェントや、クラスターがネットワーキング、コンピューティング、ストレージのための基盤となる AWS リソースと相互作用できるようにする Kubernetes ドライバーなどのソフトウェアが含まれます。アドオンソフトウェアは通常、Kubernetes コミュニティ、AWS のようなクラウドプロバイダー、またはサードパーティベンダーによって構築・維持されています。Amazon EKS は、Amazon VPC CNI プラグイン for Kubernetes、`kube-proxy`、CoreDNS などのセルフマネージドアドオンを各クラスターに自動的にインストールします。

これらのクラスターアドオンは、ネットワーキングやドメイン名解決などの異なる領域で運用サポートを提供します。重要なサポートインフラストラクチャやコンポーネントがどのように動作しているかについての洞察を提供します。アドオンメトリクスを追跡することは、クラスターの運用状態を理解する上で重要です。

以下は、監視を検討すべき重要なアドオンとそれらの重要なメトリクスです。



## Amazon VPC CNI プラグイン

Amazon EKS は、Amazon VPC Container Network Interface (VPC CNI) プラグインを通じてクラスターネットワーキングを実装しています。CNI プラグインにより、Kubernetes Pod は VPC ネットワーク上と同じ IP アドレスを持つことができます。具体的には、Pod 内のすべてのコンテナはネットワーク名前空間を共有し、ローカルポートを使用して相互に通信できます。VPC CNI アドオンを使用することで、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、設定、更新に必要な労力を削減できます。

VPC CNI アドオンのメトリクスは、CNI Metrics Helper によって公開されます。IP アドレスの割り当てをモニタリングすることは、健全なクラスターを維持し、IP アドレスの枯渇問題を回避するために不可欠です。[最新のネットワーキングのベストプラクティスと収集・モニタリングすべき VPC CNI メトリクスはこちらです](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)。



## CoreDNS メトリクス

CoreDNS は柔軟で拡張可能な DNS サーバーで、Kubernetes クラスターの DNS として機能します。CoreDNS の Pod は、クラスター内のすべての Pod の名前解決を提供します。DNS 負荷の高いワークロードを実行すると、DNS スロットリングにより断続的に CoreDNS の障害が発生することがあり、これがアプリケーションに影響を与える可能性があります。

[CoreDNS のパフォーマンスメトリクスを追跡するための最新のベストプラクティスはこちら](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)と、[DNS スロットリングの問題に関する CoreDNS トラフィックのモニタリング](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)をご確認ください。



## Pod/コンテナメトリクス

アプリケーションのすべての層にわたる使用状況を追跡することは重要です。これには、クラスター内で実行されているノードと Pod を詳しく見ることも含まれます。Pod のディメンションで利用可能なすべてのメトリクスの中で、以下のメトリクスリストは、クラスター上で実行されているワークロードの状態を理解するのに実用的です。CPU、メモリ、ネットワークの使用状況を追跡することで、アプリケーション関連の問題の診断とトラブルシューティングが可能になります。ワークロードのメトリクスを追跡することで、EKS 上で実行されているワークロードの適切なサイジングのためのリソース使用状況に関する洞察が得られます。

|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|名前空間ごとの実行中の Pod 数	|count by(namespace) (kube_pod_info)	|クラスター単位、名前空間別	|
|Pod ごとのコンテナごとの CPU 使用量	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|クラスター単位、名前空間別、Pod 別	|
|Pod ごとのメモリ使用率	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|クラスター単位、名前空間別、Pod 別	|
|Pod ごとのネットワーク受信バイト数	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|クラスター単位、名前空間別、Pod 別	|
|Pod ごとのネットワーク送信バイト数	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|クラスター単位、名前空間別、Pod 別	|
|コンテナごとのコンテナ再起動回数	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|クラスター単位、名前空間別、Pod 別	|



## ノードメトリクス

Kube State Metrics と Prometheus ノードエクスポーターは、クラスター内のノードに関するメトリクス統計を収集します。ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの使用状況を理解する上で重要です。ノードのリソースがどのように使用されているかを理解することは、クラスターで実行することが予想されるワークロードの種類に応じて、インスタンスタイプとストレージを適切に選択するために重要です。以下のメトリクスは、追跡すべき重要なメトリクスの一部です。

|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|ノード CPU 使用率	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|クラスター別、ノード別	|
|ノードメモリ使用率	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|クラスター別、ノード別	|
|ノードネットワーク総バイト数	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|クラスター別、ノード別	|
|ノード CPU 予約容量	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|クラスター別、ノード別	|
|ノードごとの実行中 Pod 数	|sum(kubelet_running_pods) by (instance)	|クラスター別、ノード別	|
|ノードファイルシステム使用量	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|クラスター別、ノード別	|
|クラスター CPU 使用率	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|クラスター別	|
|クラスターメモリ使用率	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|クラスター別	|
|クラスターネットワーク総バイト数	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|クラスター別	|
|実行中の Pod 数	|sum(kubelet_running_pod_count\{cluster=""\})	|クラスター別	|
|実行中のコンテナ数	|sum(kubelet_running_container_count\{cluster=""\})	|クラスター別	|
|クラスター CPU 制限	|sum(kube_node_status_allocatable\{resource="cpu"\})	|クラスター別	|
|クラスターメモリ制限	|sum(kube_node_status_allocatable\{resource="memory"\})	|クラスター別	|
|クラスターノード数	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|クラスター別	|



# 追加リソース




## AWS サービス

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/jp/prometheus](https://aws.amazon.com/jp/prometheus)

[https://aws.amazon.com/jp/cloudwatch/features/](https://aws.amazon.com/jp/cloudwatch/features/)



## ブログ

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/jp/blogs/news/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/jp/blogs/news/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)



## Infrastructure as Code (IaC) リソース

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
