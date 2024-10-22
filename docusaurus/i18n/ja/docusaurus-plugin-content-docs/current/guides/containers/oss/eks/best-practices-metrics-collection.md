# EKS Observability: 必須メトリクス

# 現在の状況

モニタリングとは、インフラストラクチャとアプリケーションの所有者が、システムの過去と現在の状態を把握し理解できるようにする解決策であり、定義されたメトリクスやログの収集に焦点を当てています。

モニタリングは長年にわたって進化してきました。当初はデバッグやダンプログを使ってデバッグやトラブルシューティングを行っていましたが、syslog、top などのコマンドラインツールを使った基本的なモニタリングに進み、さらにダッシュボードで可視化できるようになりました。クラウドの登場とスケールの増大に伴い、今日ではこれまでになく多くのものを追跡しています。業界ではオブザーバビリティへとシフトしており、これはインフラストラクチャとアプリケーションの所有者がシステムをアクティブにトラブルシューティングおよびデバッグできるようにする解決策と定義されています。オブザーバビリティではメトリクスから導き出されたパターンを見ることに重点が置かれています。

# メトリクスが重要な理由

メトリクスは、作成された時間順に並べられた一連の数値です。環境内のサーバー数、ディスク使用量、1 秒あたりの処理リクエスト数、リクエスト完了の待ち時間など、あらゆるものを追跡するために使用されます。メトリクスは、システムのパフォーマンスを示すデータです。小規模または大規模なクラスターを実行していても、システムの正常性とパフォーマンスに関する洞察を得ることで、改善の余地を特定し、問題のトラブルシューティングとトレースを行い、全体としてワークロードのパフォーマンスと効率を向上させることができます。これらの変更は、クラスターに費やす時間とリソースに影響を与え、それが直接コストに反映されます。

# メトリクスの収集

EKS クラスターからメトリクスを収集するには、[3 つのコンポーネント](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/)が必要です。

1. ソース: このガイドに記載されているようなメトリクスの発生源。
2. エージェント: EKS 環境内で実行されるアプリケーション。エージェントと呼ばれることが多く、監視データを収集し、そのデータを 2 番目のコンポーネントにプッシュします。このコンポーネントの例として、[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) と [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/) があります。
3. 宛先: 監視データの保存と分析ソリューション。このコンポーネントは通常、[時系列データ形式](https://aws-observability.github.io/observability-best-practices/signals/metrics/)に最適化されたデータサービスです。このコンポーネントの例として、[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) と [AWS Cloudwatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注: このセクションでは、設定例は [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクになっています。これにより、EKS メトリクス収集の実装に関する最新のガイダンスと例を入手できます。

## マネージドオープンソースソリューション

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポート対象バージョンで、[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) や [AWS Cloudwatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などのさまざまなモニタリングデータ収集ソリューションに相関メトリクスとトレースを送信できるようにします。ADOT は [EKS Managed Add-ons](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-add-ons.html) を通じて EKS クラスターにインストールでき、メトリクス (このページにリストされているものなど) とワークロードトレースを収集するように構成できます。AWS は ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチで定期的に更新されています。[ADOT のベストプラクティスと詳細情報](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)

## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT)、Amazon Managed Service for Prometheus (AMP)、Amazon Managed Service for Grafana (AMG) を最速で起動させる方法は、AWS Observability Accelerator の [インフラストラクチャモニタリングの例](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) を活用することです。アクセラレータの例では、ツールとサービスをメトリクス収集、アラートルール、Grafana ダッシュボードを含む状態で環境にデプロイします。

ADOT の EKS Managed Add-on のインストール、設定、運用に関する詳細は、AWS ドキュメントを参照してください。[EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/opentelemetry.html)

### ソース

EKS のメトリクスは、全体的なソリューションの異なる層から複数の場所から作成されます。この表は、必須メトリクスセクションで呼び出されているメトリクスソースをまとめたものです。

|層	|ソース	|ツール	|インストールと詳細情報	|Helm Chart	|
|---	|---	|---	|---	|---	|
|コントロールプレーン	|*api server endpoint*/metrics	|N/A - api サーバーは Prometheus 形式でメトリクスを直接公開します。	|https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/prometheus.html	|N/A	|
|クラスター状態	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy は Prometheus 形式でメトリクスを直接公開します。	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - Core DNS は Prometheus 形式でメトリクスを直接公開します。	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|ノード	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet または API サーバーを介してプロキシされます。	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### エージェント: AWS Distro for OpenTelemetry

AWS は、EKS クラスターへの ADOT のインストール、構成、運用を、AWS EKS ADOT 管理アドオンを通して行うことをお勧めします。このアドオンは、ADOT オペレーター/コレクターのカスタムリソースモデルを利用し、クラスター上に複数の ADOT コレクターをデプロイ、構成、管理できるようになっています。このアドオンのインストール、高度な構成、運用の詳細については、この[ドキュメンテーション](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)を参照してください。

注: AWS EKS ADOT 管理アドオンの Web コンソールを使用して、[ADOT アドオンの高度な構成](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/deploy-collector-advanced-configuration.html)を行うことができます。

ADOT コレクターの構成には 2 つの要素があります。

1. コレクターのデプロイモード (デプロイメント、DaemonSet など) を含む[コレクター構成](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)。
2. メトリクス収集に必要な受信側、プロセッサ、エクスポーターを含む[OpenTelemetry パイプライン構成](https://opentelemetry.io/docs/collector/configuration/)。構成例の抜粋:

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

ベストプラクティスに基づくコレクター構成、ADOT パイプライン構成、Prometheus スクレイプ構成の完全な例は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) で確認できます。
</your_aws_region></your></your_aws_region>

### 宛先: Amazon Managed Service for Prometheus

ADOT コレクタパイプラインは、Prometheus Remote Write 機能を利用してメトリクスを AMP インスタンスにエクスポートします。以下は設定例の一部で、AMP WRITE エンドポイント URL に注目してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

ベストプラクティスのコレクタ設定、ADOT パイプライン設定、Prometheus スクレイプ設定は、[Observability Accelerator の Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) で確認できます。

AMP の設定と使用に関するベストプラクティスは[こちら](https://aws-observability.github.io/observability-best-practices/recipes/amp/)を参照してください。
</your>

# 関連するメトリクスとは何ですか?

かつては利用可能なメトリクスが少なかった時代がありましたが、今日ではその逆で、数百ものメトリクスが利用可能です。関連するメトリクスを特定できることは、オブザーバビリティを最優先に考えたシステムを構築する上で重要です。

このガイドでは、利用可能な様々なメトリクスのグループ分けを概説し、インフラストラクチャとアプリケーションにオブザーバビリティを組み込む際に注目すべきメトリクスを説明します。以下に示すメトリクスは、ベストプラクティスに基づいてモニタリングすることをお勧めするメトリクスのリストです。

次のセクションに記載されているメトリクスは、[AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) と [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/) で強調表示されているメトリクスに加えてのものです。

## コントロールプレーンのメトリクス

Amazon EKS コントロールプレーンは AWS によって管理されており、AWS が管理するアカウントで実行されます。コントロールプレーンは、etcd や Kubernetes API サーバーなどの Kubernetes コンポーネントを実行するコントロールプレーンノードで構成されています。Kubernetes は、Pod の起動と終了、デプロイメント、ネームスペースなど、クラスター内のアクティビティをユーザーに通知するさまざまなイベントを公開します。Amazon EKS コントロールプレーンは、コアコンポーネントが適切に機能し、クラスターに必要な基本的なアクティビティを実行できるようにするために追跡する必要がある重要なコンポーネントです。

コントロールプレーン API サーバーは数千のメトリクスを公開しています。以下の表は、監視することをお勧めする重要なコントロールプレーンメトリクスを示しています。

|名前|メトリクス|説明|理由|
|---|---|---|---|
|API サーバー総リクエスト数|apiserver_request_total|動詞、ドライラン値、グループ、バージョン、リソース、スコープ、コンポーネント、HTTP レスポンスコードごとに分割された API サーバーリクエストのカウンター。||
|API サーバーレイテンシ|apiserver_request_duration_seconds|動詞、ドライラン値、グループ、バージョン、リソース、サブリソース、スコープ、コンポーネントごとの応答レイテンシ分布 (秒単位)。||
|リクエストレイテンシ|rest_client_request_duration_seconds|リクエストレイテンシ (秒単位)。動詞と URL ごとに分割されています。||
|総リクエスト数|rest_client_requests_total|HTTP リクエスト数。ステータスコード、メソッド、ホストごとに分割されています。||
|API サーバーリクエスト時間|apiserver_request_duration_seconds_bucket|Kubernetes API サーバーへの各リクエストのレイテンシを秒単位で測定します。||
|API サーバーリクエストレイテンシ合計|apiserver_request_latencies_sum|K8 API サーバーがリクエストを処理するのにかかった合計時間を追跡する累積カウンター。||
|API サーバー登録ウォッチャー|apiserver_registered_watchers|特定のリソースに対して現在登録されているウォッチャーの数。||
|API サーバーオブジェクト数|apiserver_storage_object|最終チェック時点での種類ごとの格納オブジェクト数。||
|Admission コントローラーレイテンシ|apiserver_admission_controller_admission_duration_seconds|名前で識別され、各操作と API リソースおよびタイプ (検証または承認) ごとに分割された Admission コントローラーレイテンシヒストグラム (秒単位)。||
|Etcd レイテンシ|etcd_request_duration_seconds|各操作とオブジェクトタイプごとの Etcd リクエストレイテンシ (秒単位)。||
|Etcd DB サイズ|apiserver_storage_db_total_size_in_bytes|Etcd データベースサイズ。|これにより、Etcd データベースの使用状況をプロアクティブに監視し、制限を超えるのを避けることができます。|

## クラスター状態メトリクス

クラスター状態メトリクスは `kube-state-metrics` (KSM) によって生成されます。KSM は、クラスター内で Pod として実行されるユーティリティで、Kubernetes API サーバーを監視し、クラスター状態とクラスター内の Kubernetes オブジェクトについて Prometheus メトリクスとしてインサイトを提供します。これらのメトリクスを利用するには、KSM を [インストール](https://github.com/kubernetes/kube-state-metrics) する必要があります。これらのメトリクスは、Kubernetes がポッドのスケジューリングを効果的に行うために使用され、デプロイメント、レプリカセット、ノード、ポッドなどのクラスター内のさまざまなオブジェクトの正常性に焦点を当てています。クラスター状態メトリクスは、ステータス、容量、可用性に関するポッド情報を公開します。クラスターのタスクスケジューリングのパフォーマンスを追跡し、パフォーマンスを監視、問題を先取りし、クラスターの正常性を監視することが重要です。クラスター状態メトリクスには約 X 個の公開メトリクスがあり、以下の表に重要なメトリクスを示します。

|名前	|メトリクス	|説明	|
|---	|---	|---	|
|ノードステータス	|kube_node_status_condition	|ノードの現在の正常性ステータス。ノードの状態セットと、各状態に対する `true`、`false`、`unknown` を返す	|
|目的のポッド数	|kube_deployment_spec_replicas または kube_daemonset_status_desired_number_scheduled	|デプロイメントまたは DaemonSet で指定されたポッド数	|
|現在のポッド数	|kube_deployment_status_replicas または kube_daemonset_status_current_number_scheduled	|デプロイメントまたは DaemonSet で現在実行中のポッド数	|
|ポッド容量	|kube_node_status_capacity_pods	|ノードで許可される最大ポッド数	|
|利用可能なポッド数	|kube_deployment_status_replicas_available または kube_daemonset_status_number_available	|デプロイメントまたは DaemonSet で現在利用可能なポッド数	|
|利用不可能なポッド数	|kube_deployment_status_replicas_unavailable または kube_daemonset_status_number_unavailable	|デプロイメントまたは DaemonSet で現在利用できないポッド数	|
|ポッドの準備状況	|kube_pod_status_ready	|ポッドがクライアントリクエストに応答できるかどうか	|
|ポッドステータス	|kube_pod_status_phase	|ポッドの現在のステータス。値は pending/running/succeeded/failed/unknown のいずれか	|
|ポッド待機理由	|kube_pod_container_status_waiting_reason	|コンテナが待機状態にある理由	|
|ポッド終了ステータス	|kube_pod_container_status_terminated	|コンテナが現在終了状態にあるかどうか	|
|スケジューリング待ちのポッド数	|pending_pods	|ノード割り当てを待っているポッド数	|
|ポッドスケジューリング試行回数	|pod_scheduling_attempts	|ポッドのスケジューリングを試行した回数	|

## クラスターアドオンのメトリクス

クラスターアドオンは、Kubernetes アプリケーションに運用機能を提供するソフトウェアです。これには、オブザーバビリティエージェントや、ネットワーキング、コンピューティング、ストレージのための基盤となる AWS リソースとクラスターが対話できるようにする Kubernetes ドライバなどのソフトウェアが含まれます。アドオンソフトウェアは通常、Kubernetes コミュニティ、AWS などのクラウドプロバイダー、またはサードパーティベンダーによって構築および保守されています。Amazon EKS は、Amazon VPC CNI プラグイン for Kubernetes、`kube-proxy`、CoreDNS などの自己管理アドオンを自動的にすべてのクラスターにインストールします。

これらのクラスターアドオンは、ネットワーキング、ドメイン名解決などの異なる領域で運用サポートを提供します。重要なサポートインフラストラクチャとコンポーネントの動作状況についての洞察を提供します。アドオンのメトリクスを追跡することは、クラスターの運用状態を把握するために重要です。

以下は、監視を検討すべき重要なアドオンと、その重要なメトリクスです。

## Amazon VPC CNI プラグイン

Amazon EKS は、Amazon VPC Container Network Interface (VPC CNI) プラグインを通してクラスターネットワーキングを実装しています。CNI プラグインにより、Kubernetes の Pod は VPC ネットワーク上と同じ IP アドレスを持つことができます。より具体的には、Pod 内のすべてのコンテナは同じネットワーク名前空間を共有し、ローカルポートを使って相互に通信できます。VPC CNI アドオンにより、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、設定、更新に必要な作業を減らすことができます。

VPC CNI アドオンのメトリクスは CNI Metrics Helper によって公開されています。IP アドレスの割り当て状況を監視することは、クラスターの健全性を確保し、IP 枯渇の問題を回避するために不可欠です。[ここに、ネットワーキングのベストプラクティスと収集・監視すべき VPC CNI メトリクスの最新情報があります](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)。

## CoreDNS メトリクス

CoreDNS は柔軟で拡張可能な DNS サーバーで、Kubernetes クラスターの DNS として機能します。CoreDNS Pod は、クラスター内のすべての Pod の名前解決を行います。DNS 集約的なワークロードを実行すると、DNS スロットリングのために CoreDNS に一時的な障害が発生することがあり、これがアプリケーションに影響を与える可能性があります。

主要な [CoreDNS パフォーマンスメトリクスの追跡に関する最新のベストプラクティス](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) と [DNS スロットリング問題のための CoreDNS トラフィックの監視](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) をご確認ください。

## Pod/コンテナメトリクス

アプリケーションのすべての層にわたる使用状況を追跡することは重要です。これには、クラスター内で実行されているノードと Pod を詳しく見ることが含まれます。Pod ディメンションで利用可能なメトリクスの中で、クラスター上で実行されているワークロードの状態を把握するために実用的なメトリクスのリストは次のとおりです。CPU、メモリー、ネットワーク使用量を追跡することで、アプリケーション関連の問題の診断とトラブルシューティングが可能になります。ワークロードメトリクスを追跡することで、EKS 上で実行されているワークロードのリソース使用状況を把握し、適切なサイズに調整できます。

|メトリクス|例の PromQL クエリ|ディメンション|
|---|---|---|
|名前空間ごとの実行中の Pod 数|count by(namespace) (kube_pod_info)|クラスター単位、名前空間単位|
|Pod ごと、コンテナごとの CPU 使用量|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)|クラスター単位、名前空間単位、Pod 単位|
|Pod ごとのメモリ使用量|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)|クラスター単位、名前空間単位、Pod 単位|
|Pod ごとの受信バイト数|sum by(pod) (rate(container_network_receive_bytes_total[5m]))|クラスター単位、名前空間単位、Pod 単位|
|Pod ごとの送信バイト数|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))|クラスター単位、名前空間単位、Pod 単位|
|コンテナごとの再起動回数|increase(kube_pod_container_status_restarts_total[15m]) > 3|クラスター単位、名前空間単位、Pod 単位|

## ノードメトリクス

Kube State Metrics と Prometheus ノードエクスポーターは、クラスター内のノードの統計メトリクスを収集します。ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの利用状況を把握するために重要です。ノードのリソースがどのように利用されているかを理解することは、クラスターで実行する予定のワークロードの種類に対して、適切なインスタンスタイプとストレージを選択するために重要です。以下のメトリクスは、追跡すべき重要なメトリクスの一部です。

|メトリクス|例の PromQL クエリ|ディメンション|
|---|---|---|
|ノード CPU 使用率|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)|クラスター単位でノード別|
|ノードメモリ使用率|sum(container_memory_usage_bytes\{container!=""\}) by (node)|クラスター単位でノード別|
|ノードネットワーク合計バイト数|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))|クラスター単位でノード別|
|ノード CPU 予約容量|sum(kube_node_status_capacity\{cluster!=""\}) by (node)|クラスター単位でノード別|
|ノードごとの実行中の Pod 数|sum(kubelet_running_pods) by (instance)|クラスター単位でノード別|
|ノードファイルシステム使用量|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}|クラスター単位でノード別|
|クラスター CPU 使用率|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))|クラスター単位|
|クラスターメモリ使用率|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})|クラスター単位|
|クラスターネットワーク合計バイト数|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))|クラスター単位|
|実行中の Pod 数|sum(kubelet_running_pod_count\{cluster=""\})|クラスター単位|
|実行中のコンテナ数|sum(kubelet_running_container_count\{cluster=""\})|クラスター単位|
|クラスター CPU 制限|sum(kube_node_status_allocatable\{resource="cpu"\})|クラスター単位|
|クラスターメモリ制限|sum(kube_node_status_allocatable\{resource="memory"\})|クラスター単位|
|クラスターノード数|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})|クラスター単位|

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
