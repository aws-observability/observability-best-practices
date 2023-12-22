# EKS のオブザーバビリティ: 必須メトリクス

# 現在の状況

モニタリングとは、インフラストラクチャやアプリケーションの所有者が、システムの履歴と現在の状態の両方を確認し理解できるソリューションです。モニタリングは、定義されたメトリクスやログの収集に焦点を当てています。

モニタリングは年々進化してきました。当初はデバッグとダンプログを使用して問題のデバッグとトラブルシューティングを行い、syslogs、top などのコマンドラインツールを使用した基本的なモニタリングへと移行し、ダッシュボードでの可視化が可能になりました。クラウドとスケールの拡大に伴い、今日ではこれまで以上に多くのものを追跡しています。業界はよりオブザーバビリティにシフトしており、インフラストラクチャやアプリケーションの所有者がシステムのアクティブなトラブルシューティングとデバッグを可能にするソリューションと定義されています。オブザーバビリティは、メトリクスから導出されるパターンの確認により焦点を当てています。


# メトリクスとはなぜ重要なのか

メトリクスとは、作成された時間とともに順序付けて保持される数値の系列です。メトリクスは、環境内のサーバー数、ディスク使用量、1 秒あたりの処理リクエスト数、リクエストの完了にかかるレイテンシなど、あらゆるものを追跡するために使用されます。メトリクスは、システムのパフォーマンスを知らせてくれるデータです。小規模でも大規模でも、システムのヘルスとパフォーマンスの洞察を取得することで、改善の余地を特定したり、問題のトラブルシューティングとトレースを行ったり、ワークロードのパフォーマンスと効率を全体として向上させたりすることができます。これらの変更は、クラスタに費やす時間とリソースに影響を与え、それがコストに直接つながります。


# メトリクスの収集

EKS クラスタからのメトリクス収集は、[3 つのコンポーネント](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/)で構成されています。

1. ソース: このガイドにリストされているもののようなメトリクスの発生源です。
2. エージェント: EKS 環境で実行されるアプリケーションは、しばしばエージェントと呼ばれ、メトリクスモニタリングデータを収集し、2 番目のコンポーネントにプッシュします。このコンポーネントの例として、[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/) と [CloudWatch エージェント](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)があります。
3. デスティネーション: モニタリングデータのストレージと分析ソリューションです。このコンポーネントは通常、[時系列形式のデータ](https://aws-observability.github.io/observability-best-practices/signals/metrics/)に最適化されたデータサービスです。このコンポーネントの例として、[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) と [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注: このセクションでは、構成の例が EKS メトリクス収集実装の最新のガイダンスと例を確実に入手できるように、[AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクです。

## マネージドオープンソースソリューション

[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポートされたバージョンであり、ユーザーが [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) や [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などの様々なモニタリングデータ収集ソリューションに相関するメトリクスとトレースを送信できるようにします。ADOT は EKS クラスターにインストールされた [EKS マネージドアドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) を介してインストールでき、このページにリストされているメトリクス(やワークロードトレース)を収集するように構成できます。AWS は、ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチで定期的に更新されます。[ADOT のベストプラクティスとその他の情報。](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)

## ADOT + AMP

AWS Distro for OpenTelemetry(ADOT)、Amazon Managed Service for Prometheus(AMP)、Amazon Managed Grafana(AMG)をすぐに利用できるようにする最も簡単な方法は、[AWS Observability Accelerator のインフラストラクチャーモニタリングの例](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) を利用することです。
このアクセラレーターの例では、あらかじめ用意されたメトリクス収集、アラートルール、Grafana ダッシュボードを備えたツールとサービスを環境にデプロイします。

ADOT の EKS マネージドアドオンのインストール、構成、運用の詳細については、[EKS ユーザーガイド](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/opentelemetry.html) を参照してください。

### ソース

EKS のメトリクスは、全体的なソリューションのさまざまなレイヤーで作成されます。 これは、主要なメトリクスのセクションで参照されているメトリクス ソースを要約した表です。


|レイヤー |ソース |ツール |インストールと詳細情報 |Helm チャート |
|--- |--- |--- |--- |--- |
|コントロールプレーン |*api サーバーエンドポイント*/メトリクス |該当なし - api サーバーがメトリクスをプロメテウス形式で直接公開 |https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/prometheus.html |該当なし |
|クラスター状態 |*kube-state-metrics-http-endpoint*:8080/メトリクス |kube-state-metrics |https://github.com/kubernetes/kube-state-metrics#overview |https://github.com/kubernetes/kube-state-metrics#helm-chart |
|Kube Proxy |*kube-proxy-http*:10249/メトリクス |該当なし - kube proxy がメトリクスをプロメテウス形式で直接公開 |https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/ |該当なし |  
|VPC CNI |*vpc-cni-metrics-helper*/メトリクス |cni-metrics-helper |https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md |https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper |
|Core DNS |*core-dns*:9153/メトリクス |該当なし - Core DNS がメトリクスをプロメテウス形式で直接公開 |https://github.com/coredns/coredns/tree/master/plugin/metrics |該当なし |
|ノード |*prom-node-exporter-http*:9100/メトリクス |prom-node-exporter |https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics |https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter |
|Kubelet/Pod |*kubelet*/メトリクス/cadvisor |kubelet または api サーバーを介してプロキシ |https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/ |該当なし |

### エージェント: AWS Distro for OpenTelemetry

EKS クラスターでの ADOT のインストール、構成、運用について AWS では、AWS EKS ADOT マネージドアドオンを使用することをおすすめします。このアドオンは、クラスター上に複数の ADOT コレクターをデプロイ、構成、管理できる ADOT オペレーター/コレクターのカスタムリソースモデルを利用しています。このアドオンのインストール、高度な構成、運用の詳細については、[このドキュメント](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on) をご確認ください。 

注: AWS EKS ADOT マネージドアドオンのウェブコンソールを使用して、[ADOT アドオンの高度な構成](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html) を行うことができます。

ADOT コレクターの構成には 2 つのコンポーネントがあります。

1. コレクターのデプロイメントモード (デプロイメント、デーモンセットなど) を含む[コレクター構成](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)
2. メトリクス収集に必要なレシーバー、プロセッサー、エクスポーターを含む [OpenTelemetry パイプライン構成](https://opentelemetry.io/docs/collector/configuration/)。構成スニペットの例:

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

ベストプラクティスのコレクター構成、ADOT パイプライン構成、Prometheus スクレイプ構成の完全な例は、[Observability Accelerator の Helm チャート](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) としてこちらにあります。

</your_aws_region></your></your_aws_region>

### 送信先: Amazon Managed Service for Prometheus

ADOT コレクターパイプラインは、メトリクスを AMP インスタンスにエクスポートするために、Prometheus リモートライト機能を利用します。構成スニペットの例を次に示します。AMP WRITE ENDPOINT URL に注意してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

完全なベストプラクティスコレクター構成、ADOT パイプライン構成、Prometheus スクレイプ構成は、[Observability Accelerator の Helm チャートとしてここで見つけることができます](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml)。

AMP 構成と使用法のベストプラクティスは[こちら](https://aws-observability.github.io/observability-best-practices/recipes/amp/)にあります。

# 関連するメトリクスとは何ですか?

利用可能なメトリクスがほとんどない時代は過ぎ去り、今日では逆に、数百ものメトリクスが利用可能です。 関連するメトリクスを特定できることは、オブザーバビリティファーストのマインドセットでシステムを構築するうえで重要です。

このガイドでは、利用可能なメトリクスの異なるグループ化について説明し、インフラストラクチャとアプリケーションにオブザーバビリティを構築する際に注目すべきメトリクスを説明します。以下のセクションにリストされているメトリクスは、ベストプラクティスに基づいて監視することをお勧めするメトリクスのリストです。

以下のセクションにリストされているメトリクスは、[AWS Observability Accelerator Grafana ダッシュボード](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring)と[Kube Prometheus Stack ダッシュボード](https://monitoring.mixins.dev/)で強調表示されているメトリクスに追加されます。

</your>

## コントロールプレーンメトリクス

Amazon EKS のコントロールプレーンは、AWS によって管理されており、AWS が管理するアカウントで実行されます。etcdやKubernetes APIサーバなどのKubernetesコンポーネントを実行するコントロールプレーンノードで構成されます。Kubernetes は、Podのスピンアップとティアダウン、デプロイメント、名前空間など、クラスター内のアクティビティについてユーザーに通知するために、さまざまなイベントを公開しています。 Amazon EKS のコントロールプレーンは、コアコンポーネントが適切に機能し、クラスターに必要な基本的なアクティビティを実行できるようにするために追跡する必要がある重要なコンポーネントです。

コントロールプレーン API サーバーは何千ものメトリクスを公開していますが、以下の表は、監視することをおすすめする基本的なコントロールプレーンメトリクスを示しています。

|名前 |メトリクス |説明 |理由 |
|--- |--- |--- |--- |
|API サーバーの総リクエスト数 |apiserver_request_total |動詞、ドライラン値、グループ、バージョン、リソース、スコープ、コンポーネント、HTTP レスポンスコードごとに分割された apiserver リクエストのカウンター。 | |
|API サーバーのレイテンシー |apiserver_request_duration_seconds |動詞、ドライラン値、グループ、バージョン、リソース、サブリソース、スコープ、コンポーネントごとの秒単位のレスポンスレイテンシー分布。 | |  
|リクエストレイテンシー |rest_client_request_duration_seconds |秒単位のリクエストレイテンシー。動詞と URL で分割されます。 | |
|総リクエスト数 |rest_client_requests_total |HTTP リクエストの数。ステータスコード、メソッド、ホストで分割されます。 | |
|API サーバーのリクエスト期間 |apiserver_request_duration_seconds_bucket |Kubernetes API サーバーへの各リクエストのレイテンシーを秒単位で測定 | |
|API サーバーのリクエストレイテンシーの合計 |apiserver_request_latencies_sum |K8 API サーバーがリクエストを処理するのにかかった総時間を追跡する累積カウンター | |  
|API サーバーの登録されたウォッチャー |apiserver_registered_watchers |特定のリソースに対して現在登録されているウォッチャーの数 | |
|API サーバーのオブジェクト数 |apiserver_storage_object |最後のチェック時の種類ごとに分割された保存されたオブジェクトの数。 | |
|アドミッションコントローラーのレイテンシー |apiserver_admission_controller_admission_duration_seconds |操作および API リソースとタイプ(検証または承認)ごとに分割された秒単位のアドミッションコントローラーレイテンシーヒストグラム。 | | 
|Etcd のレイテンシー |etcd_request_duration_seconds |操作とオブジェクトタイプごとの秒単位の etcd リクエストレイテンシー。 | |
|Etcd DB サイズ |apiserver_storage_db_total_size_in_bytes |Etcd データベースのサイズ。 |これにより、etcd データベースの使用状況を事前に監視し、制限を超えるのを避けることができます。 |

## クラスター状態のメトリクス

クラスター状態のメトリクスは、`kube-state-metrics` (KSM) によって生成されます。KSM はクラスター内でポッドとして実行されるユーティリティで、Kubernetes API サーバーをリッスンにし、Prometheus メトリクスとしてクラスター状態とクラスター内の Kubernetes オブジェクトの洞察を提供します。これらのメトリクスが利用できるようになる前に、KSM を [インストール](https://github.com/kubernetes/kube-state-metrics) する必要があります。これらのメトリクスは、Kubernetes がポッドのスケジューリングを効果的に行うために使用されており、デプロイメント、レプリカセット、ノード、ポッドなど、内部のさまざまなオブジェクトの健全性に焦点を当てています。クラスター状態のメトリクスは、ポッドのステータス、容量、可用性に関する情報を公開します。クラスターのスケジューリングタスクのパフォーマンスを追跡できるようにしておくことは、パフォーマンスを把握し、問題に先立って対処し、クラスターの健全性を監視するために不可欠です。公開されているクラスター状態のメトリクスは約 X 種類ありますが、以下の表は追跡すべき主要なメトリクスをリストしています。

|名前	|メトリクス	|説明	|
|---	|---	|---	|
|ノードステータス	|kube_node_status_condition	|ノードの現在の健全性ステータス。ノード条件のセットと、それぞれに対する `true`、`false`、`unknown` を返します。	|
|必要なポッド数	|kube_deployment_spec_replicas または kube_daemonset_status_desired_number_scheduled	|デプロイメントまたはデーモンセットに指定されたポッド数	|  
|現在のポッド数	|kube_deployment_status_replicas または kube_daemonset_status_current_number_scheduled	|デプロイメントまたはデーモンセットで現在実行されているポッド数	|
|ポッド容量	|kube_node_status_capacity_pods	|ノードで許可されている最大ポッド数	|
|利用可能なポッド	|kube_deployment_status_replicas_available または kube_daemonset_status_number_available	|デプロイメントまたはデーモンセットで現在利用可能なポッド数	|  
|利用不可のポッド	|kube_deployment_status_replicas_unavailable または kube_daemonset_status_number_unavailable	|デプロイメントまたはデーモンセットで現在利用できないポッド数	|
|ポッドの準備状態	|kube_pod_status_ready	|ポッドがクライアントリクエストに対応できる準備ができているかどうか	|
|ポッドのステータス	|kube_pod_status_phase	|ポッドの現在のステータス。値は pending/running/succeeded/failed/unknown のいずれか。	|  
|ポッドの待機理由	|kube_pod_container_status_waiting_reason	|コンテナが待機状態にある理由	|
|ポッドの終了ステータス	|kube_pod_container_status_terminated	|コンテナが現在終了状態にあるかどうか	|
|スケジューリング待ちのポッド	|pending_pods	|ノード割り当てを待っているポッド数	|
|ポッドスケジューリングの試行回数	|pod_scheduling_attempts	|ポッドスケジューリングの試行回数	|

## クラスター追加機能のメトリクス

クラスター追加機能は、Kubernetes アプリケーションの運用機能をサポートするソフトウェアです。これには、観測可能性エージェントや、ネットワーク、コンピュート、ストレージの基礎となる AWS リソースと対話できるようにする Kubernetes ドライバなどのソフトウェアが含まれます。追加のソフトウェアは、通常、Kubernetes コミュニティ、AWS のようなクラウド プロバイダー、またはサードパーティ ベンダーによって構築およびメンテナンスされます。Amazon EKS は、すべてのクラスターに対して、Amazon VPC CNI プラグイン for Kubernetes、`kube-proxy`、CoreDNS などのセルフマネージド アドオンを自動的にインストールします。

これらのクラスター アドオンは、ネットワーキング、ドメイン名解決など、さまざまな分野で運用サポートを提供します。 これらは、重要なサポート インフラストラクチャとコンポーネントの動作についての洞察を提供します。 アドオン メトリクスの追跡は、クラスターの運用状態を理解するうえで重要です。

以下は、監視する必要がある基本的なアドオンと、その基本的なメトリクスを示しています。

## Amazon VPC CNI プラグイン

Amazon EKS は、Amazon VPC コンテナネットワークインターフェイス(VPC CNI)プラグインを介してクラスターネットワーキングを実装しています。CNI プラグインにより、Kubernetes Pod が VPC ネットワーク上と同じ IP アドレスを取得できます。より具体的には、Pod 内のすべてのコンテナはネットワーク名前空間を共有し、ローカルポートを使用して相互に通信できます。VPC CNI アドオンを使用すると、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、構成、更新に必要な作業量を減らすことができます。

VPC CNI アドオンのメトリクスは、CNI メトリクスヘルパーによって公開されます。IP アドレスの割り当てを監視することは、健全なクラスターを確保し、IP 枯渇の問題を回避するための基本です。[こちらから最新のネットワーキングのベストプラクティスと収集・監視する必要のある VPC CNI メトリクスをご覧いただけます。](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)

## CoreDNS メトリクス

CoreDNS は、Kubernetes クラスターの DNS として機能できる柔軟で拡張性のある DNS サーバーです。 CoreDNS ポッドは、クラスター内のすべてのポッドの名前解決を提供します。 DNS 集中型のワークロードを実行すると、DNS スロットリングのために CoreDNS の障害が断続的に発生することがあり、これがアプリケーションに影響を与える可能性があります。

[CoreDNS パフォーマンスメトリクスを追跡するための最新のベストプラクティスはこちら](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)、[DNS スロットリングの問題のために CoreDNS トラフィックを監視する方法はこちら](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) をご覧ください。

## Pod/コンテナーメトリクス

アプリケーションのすべてのレイヤーにわたる使用状況を追跡することが重要です。これには、クラスター内で実行されているノードとポッドのより詳細な調査が含まれます。 ポッド次元で利用できるすべてのメトリクスの中で、このメトリクスのリストは、クラスター上で実行されているワークロードの状態を理解するのに実際に役立ちます。 CPU、メモリ、ネットワークの使用状況を追跡することで、アプリケーション関連の問題の診断とトラブルシューティングが可能になります。 ワークロードメトリクスを追跡することで、EKS 上で実行されているワークロードの右サイズを判断するためのリソース利用状況の洞察が得られます。

|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|名前空間ごとの実行中のポッド数	|count by(namespace) (kube_pod_info)	|クラスターごとの名前空間別	|
|ポッドごとのコンテナーごとの CPU 使用率	|sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (namespace, pod)	|クラスターごとの名前空間ごとのポッドごと	|
|ポッドごとのメモリ利用量	|sum(container_memory_usage_bytes{container!=""}) by (namespace, pod)	|クラスターごとの名前空間ごとのポッドごと	|
|ポッドごとの受信ネットワークバイト	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|クラスターごとの名前空間ごとのポッドごと	|
|ポッドごとの送信ネットワークバイト	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|クラスターごとの名前空間ごとのポッドごと	|
|コンテナーごとのコンテナー再起動数	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|クラスターごとの名前空間ごとのポッドごと	|

## ノードメトリクス

Kube State Metrics と Prometheus ノードエクスポーターは、クラスタ内のノードのメトリック統計を収集します。 ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの利用状況を理解するうえで重要です。 ノードのリソースがどのように利用されているかを理解することは、クラスターで実行することを期待しているワークロードの種類に効果的に対処するために、インスタンスタイプとストレージを適切に選択するうえで重要です。 以下のメトリクスは、追跡する必要がある基本的なメトリクスの一部です。


|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|ノード CPU 利用率	|sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (node)	|クラスターごとのノード	|
|ノードメモリ利用率	|sum(container_memory_usage_bytes{container!=""}) by (node)	|クラスターごとのノード	|
|ノードネットワーク総バイト数	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|クラスターごとのノード	|
|ノード CPU 予約容量	|sum(kube_node_status_capacity{cluster!=""}) by (node)	|クラスターごとのノード	|
|ノードごとの実行中の Pod 数	|sum(kubelet_running_pods) by (instance)	|クラスターごとのノード	|
|ノードファイルシステムの使用状況	|rate(container_fs_reads_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}[$__rate_interval]) + rate(container_fs_writes_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}	|クラスターごとのノード	|
|クラスター CPU 利用率	|sum(rate(node_cpu_seconds_total{mode!="idle",mode!="iowait",mode!="steal"}[5m]))	|クラスターごと	|
|クラスターメモリ利用率	|1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=""}) / sum(node_memory_MemTotal_bytes{job="node-exporter",cluster=""})	|クラスターごと	|
|クラスターネットワーク総バイト数	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|クラスターごと	|
|実行中の Pod 数	|sum(kubelet_running_pod_count{cluster=""})	|クラスターごと	|
|実行中のコンテナー数	|sum(kubelet_running_container_count{cluster=""})	|クラスターごと	|
|クラスター CPU 制限	|sum(kube_node_status_allocatable{resource="cpu"})	|クラスターごと	|
|クラスターメモリ制限	|sum(kube_node_status_allocatable{resource="memory"})	|クラスターごと	|
|クラスターノード数	|count(kube_node_info) OR sum(kubelet_node_name{cluster=""})	|クラスターごと	|

# 追加リソース

## AWS サービス

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## ブログ

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## インフラストラクチャアズコードリソース

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
