# EKS のオブザーバビリティ: 必須メトリクス

# 現在の状況

モニタリングとは、インフラストラクチャやアプリケーションの所有者が、収集されたメトリクスやログに基づいて、システムの過去と現在の状態を見て理解できるソリューションのことを指します。

これまでにモニタリングは進化してきました。当初はデバッグとダンプログを使用して問題をデバッグおよびトラブルシューティングしていましたが、次第に syslogs、top などのコマンドラインツールを使用した基本的なモニタリングへと移行し、ダッシュボード上で視覚化できるようになりました。クラウドの出現とスケールの拡大に伴い、今日ではこれまでになく多くのものを追跡しています。業界はよりオブザーバビリティに移行しており、これはインフラストラクチャやアプリケーションの所有者が能動的にシステムのトラブルシューティングとデバッグを行えるソリューションと定義されます。オブザーバビリティは、メトリクスから導出されたパターンをより重視しています。


# メトリクスの重要性

メトリクスとは、作成された時間順に並べられた一連の数値です。これらは、環境内のサーバー数、ディスク使用量、1 秒あたりのリクエスト処理数、リクエスト完了までのレイテンシなど、あらゆるものを追跡するために使用されます。メトリクスは、システムのパフォーマンスを示すデータです。小規模でも大規模でも、システムの正常性とパフォーマンスの洞察を得ることで、改善の余地を特定したり、問題のトラブルシューティングとトレースを行ったり、ワークロードのパフォーマンスと効率を全体として向上させたりすることができます。これらの変更は、クラスターに費やす時間とリソースに影響を与え、直接コストにつながります。


# メトリクスの収集

EKS クラスターからのメトリクス収集は、[3 つのコンポーネント](/observability-best-practices/ja/recipes/telemetry/)で構成されます。

1. ソース: このガイドに記載されているものなど、メトリクスの発生源です。 
2. エージェント: EKS 環境で実行されるアプリケーションは、しばしばエージェントと呼ばれ、メトリクス監視データを収集して 2 番目のコンポーネントにプッシュします。このコンポーネントの例としては、[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) と [CloudWatch エージェント](/observability-best-practices/ja/tools/cloudwatch_agent/) があります。
3. デスティネーション: データサービスであることが多く、[時系列形式のデータ](/observability-best-practices/ja/signals/metrics/)に最適化されたモニタリングデータの保存と分析ソリューションです。このコンポーネントの例としては、[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) と [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) があります。

注:このセクションの構成例は、[AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) の関連セクションへのリンクです。これは、EKS メトリクス収集実装に関する最新のガイダンスと例を確実に入手できるようにするためです。

## マネージドオープンソースソリューション

[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトのサポートされたバージョンで、[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) や [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) などの様々なモニタリングデータ収集ソリューションに相関メトリクスとトレースを送信できます。ADOT は [EKS マネージドアドオン](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) を通じて EKS クラスタにインストールでき、このページにリストされているメトリクス(負荷トレースなど)を収集するように構成できます。AWS は、ADOT アドオンが Amazon EKS と互換性があることを検証しており、最新のバグ修正とセキュリティパッチが定期的に適用されます。 [ADOT のベストプラクティスと詳細情報。](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector/)

## ADOT + AMP

AWS Distro for OpenTelemetry(ADOT)、Amazon Managed Service for Prometheus(AMP)、Amazon Managed Grafana(AMG)を使ってすぐに始めるには、[AWS Observability Accelerator のインフラストラクチャモニタリングのサンプル](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/)を利用するのが一番です。アクセラレータのサンプルは、アウトオブザボックスのメトリクス収集、アラートルール、Grafana ダッシュボードを備えたツールとサービスを環境にデプロイします。

インストール、構成、運用に関する詳細情報は、[EKS 用 ADOT マネージドアドオン](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/opentelemetry.html) の AWS ドキュメントを参照してください。

### ソース

EKS のメトリクスは、全体的なソリューションのさまざまなレイヤーで作成されます。これは、必須のメトリクスのセクションで言及されているメトリクスソースを要約した表です。


| レイヤー             | ソース                                             | ツール                                                           | インストールと詳細情報                                                                                             | Helm チャート                                                                                 |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| コントロールプレーン | *api サーバーエンドポイント*/メトリクス            | 該当なし - API サーバーはメトリクスをプロメテウス形式で直接公開  | https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/prometheus.html                                             | 該当なし                                                                                      |
| クラスター状態       | *kube-state-metrics-http-endpoint*:8080/メトリクス | kube-state-metrics                                               | https://github.com/kubernetes/kube-state-metrics#overview                                                          | https://github.com/kubernetes/kube-state-metrics#helm-chart                                   |
| Kube プロキシ        | *kube-proxy-http*:10249/メトリクス                 | 該当なし - kube プロキシはメトリクスをプロメテウス形式で直接公開 | https://kubernetes.io/ja/docs/reference/command-line-tools-reference/kube-proxy/                                   | 該当なし                                                                                      |
| VPC CNI              | *vpc-cni-metrics-helper*/メトリクス                | cni-metrics-helper                                               | https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md                             | https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper               |
| CoreDNS              | *core-dns*:9153/メトリクス                         | 該当なし - CoreDNS はメトリクスをプロメテウス形式で直接公開      | https://github.com/coredns/coredns/tree/master/plugin/metrics                                                      | 該当なし                                                                                      |
| ノード               | *prom-node-exporter-http*:9100/メトリクス          | prom-node-exporter                                               | https://github.com/prometheus/node_exporter https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics | https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter |
| Kubelet/Pod          | *kubelet*/メトリクス/cadvisor                      | kubelet または API サーバーを介してプロキシ                      | https://kubernetes.io/ja/docs/concepts/cluster-administration/system-metrics/                                      | 該当なし                                                                                      |

### エージェント: AWS Distro for OpenTelemetry

AWS は、EKS クラスター上での ADOT のインストール、構成、運用を AWS EKS ADOT マネージドアドオンを通じて推奨しています。 このアドオンは、クラスター上に複数の ADOT コレクターをデプロイ、構成、管理できる ADOT オペレーター/コレクターのカスタムリソースモデルを利用しています。 インストール、高度な構成、このアドオンの運用の詳細については、この[ドキュメント](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)をご覧ください。

注意: AWS EKS ADOT マネージドアドオンのウェブコンソールを使用して、[ADOT アドオンの高度な構成](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html)を行うことができます。

ADOT コレクターの構成には 2 つのコンポーネントがあります。

1. コレクターのデプロイメントモード(デプロイメント、デーモンセットなど)を含む[コレクター構成](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)
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

ベストプラクティスのコレクター構成、ADOT パイプライン構成、Prometheus スクレイプ構成の完全な例は、[Observability Accelerator の Helm チャート](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml)にあります。


</your_aws_region></your></your_aws_region>

### 送信先: Amazon Managed Service for Prometheus

ADOT コレクターパイプラインは、Prometheus Remote Write 機能を利用して、メトリクスを AMP インスタンスにエクスポートします。構成スニペットの例を次に示します。AMP WRITE エンドポイント URL に注意してください。

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

ベストプラクティスのコレクター構成、ADOT パイプライン構成、Prometheus スクレイプ構成の完全な例は、[Observability Accelerator の Helm チャート](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) で確認できます。

AMP の構成と使用法のベストプラクティスは、[こちら](/observability-best-practices/ja/recipes/amp/) で確認できます。

# 関連するメトリクスとは?

利用可能なメトリクスがほとんどない時代は過ぎ去り、今日では逆に数百ものメトリクスが利用可能です。インフラストラクチャとアプリケーションにオブザーバビリティを組み込む際に、どのメトリクスに注目すべきかを判断できることが重要です。

このガイドでは、利用可能なさまざまなメトリクス グループについて説明し、ベスト プラクティスに基づいて監視することをおすすめするメトリクスを示します。

以下のセクションでリストされているメトリクスは、[AWS Observability Accelerator Grafana ダッシュボード](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) と [Kube Prometheus Stack ダッシュボード](https://monitoring.mixins.dev/) で強調表示されているメトリクスに追加されます。

</your>

## コントロールプレーンメトリクス

Amazon EKS のコントロールプレーンは、AWS によって管理されており、AWS が管理するアカウントで実行されます。etcd や Kubernetes API サーバなどの Kubernetes コンポーネントを実行するコントロールプレーン ノードで構成されます。Kubernetes は、Pod の起動と停止、デプロイメント、名前空間などのクラスタで必要な基本的なアクティビティを通知するために、さまざまなイベントを公開しています。Amazon EKS のコントロールプレーンは、コアコンポーネントが適切に機能し、クラスタに必要な基本的なアクティビティを実行できることを確認するために追跡する必要がある重要なコンポーネントです。

コントロールプレーン API サーバは数千ものメトリクスを公開していますが、以下の表は、監視することをおすすめする基本的なコントロールプレーン メトリクスを示しています。

| 名前                                 | メトリクス                                                | 説明                                                                                                                                               | 理由                                                                                          |
| ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| API サーバの要求の合計               | apiserver_request_total                                   | 各動詞、ドライラン値、グループ、バージョン、リソース、スコープ、コンポーネント、HTTP レスポンスコードごとに分割された apiserver 要求のカウンター。 |                                                                                               |
| API サーバのレイテンシ               | apiserver_request_duration_seconds                        | 各動詞、ドライラン値、グループ、バージョン、リソース、サブリソース、スコープ、コンポーネントごとの応答待ち時間分布(秒)。                           |                                                                                               |
| 要求待ち時間                         | rest_client_request_duration_seconds                      | 動詞と URL ごとに分割された要求待ち時間(秒)。                                                                                                      |                                                                                               |
| 要求の合計                           | rest_client_requests_total                                | ステータスコード、メソッド、ホストごとに分割された HTTP 要求の数。                                                                                 |                                                                                               |
| API サーバの要求期間                 | apiserver_request_duration_seconds_bucket                 | Kubernetes API サーバへの各要求の待ち時間を秒単位で測定                                                                                            |                                                                                               |
| API サーバ要求待ち時間の合計         | apiserver_request_latencies_sum                           | K8 API サーバが要求を処理するのにかかった合計時間を追跡する累積カウンタ                                                                            |                                                                                               |
| API サーバに登録されたウォッチャー   | apiserver_registered_watchers                             | 特定のリソースに対して現在登録されているウォッチャーの数                                                                                           |                                                                                               |
| API サーバのオブジェクト数           | apiserver_storage_object                                  | 最後のチェック時の保存されたオブジェクトの数を種類ごとに分割。                                                                                     |                                                                                               |
| アドミッションコントローラの待ち時間 | apiserver_admission_controller_admission_duration_seconds | 名前ごとに識別されたアドミッションコントローラの待ち時間ヒストグラム(秒)。操作、API リソース、タイプ(検証または許可)ごとに分割。                   |                                                                                               |
| Etcd の待ち時間                      | etcd_request_duration_seconds                             | 操作とオブジェクトタイプごとの etcd 要求の待ち時間(秒)。                                                                                           |                                                                                               |
| Etcd DB サイズ                       | apiserver_storage_db_total_size_in_bytes                  | Etcd データベースのサイズ。                                                                                                                        | これにより、etcd データベースの使用状況を事前に監視し、制限を超えるのを避けることができます。 |

## クラスター状態のメトリクス

クラスター状態のメトリクスは、`kube-state-metrics` (KSM) によって生成されます。 KSM はクラスター内で Pod として実行されるユーティリティで、Kubernetes API サーバーをリッスンし、クラスター状態とクラスター内の Kubernetes オブジェクトの洞察を Prometheus メトリクスとして提供します。 これらのメトリクスを利用できるようにするには、事前に KSM を [インストール](https://github.com/kubernetes/kube-state-metrics) する必要があります。 これらのメトリクスは、Kubernetes が効果的な Pod スケジューリングを行うために使用されており、デプロイメント、レプリカセット、ノード、Pod などのさまざまなオブジェクトの健全性に焦点を当てています。  クラスター状態のメトリクスは、Pod のステータス、容量、可用性に関する情報を公開します。  クラスターのスケジューリングタスクのパフォーマンスを追跡し、パフォーマンスを把握し、問題に先立って対処し、クラスターの健全性を監視することが不可欠です。 公開されているクラスター状態メトリクスは約 X 個あり、以下の表は追跡すべき主要なメトリクスをリストしています。

| 名前                         | メトリクス                                                                                  | 説明                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ノードステータス             | kube_node_status_condition                                                                  | ノードの現在の健康ステータス。ノード条件のセットと、条件ごとに `true`、`false`、`unknown` のいずれかを返します。 |
| 目標 Pod 数                  | kube_deployment_spec_replicas または kube_daemonset_status_desired_number_scheduled         | Deployment または DaemonSet に指定された Pod 数                                                                  |
| 現在の Pod 数                | kube_deployment_status_replicas または kube_daemonset_status_current_number_scheduled       | Deployment または DaemonSet で現在実行中の Pod 数                                                                |
| Pod 容量                     | kube_node_status_capacity_pods                                                              | ノードで許可されている最大 Pod 数                                                                                |
| 利用可能な Pod 数            | kube_deployment_status_replicas_available または kube_daemonset_status_number_available     | Deployment または DaemonSet で現在利用可能な Pod 数                                                              |
| 利用不可能な Pod 数          | kube_deployment_status_replicas_unavailable または kube_daemonset_status_number_unavailable | Deployment または DaemonSet で現在利用できない Pod 数                                                            |
| Pod のレディネス             | kube_pod_status_ready                                                                       | Pod がクライアントリクエストに対応できるかどうか                                                                 |
| Pod のステータス             | kube_pod_status_phase                                                                       | Pod の現在のステータス。pending/running/succeeded/failed/unknown のいずれか                                      |
| Pod の待機理由               | kube_pod_container_status_waiting_reason                                                    | コンテナが待機状態にある理由                                                                                     |
| Pod の終了ステータス         | kube_pod_container_status_terminated                                                        | コンテナが現在終了状態かどうか                                                                                   |
| スケジューリング待ちの Pod   | pending_pods                                                                                | ノード割り当てを待っている Pod 数                                                                                |
| Pod スケジューリング試行回数 | pod_scheduling_attempts                                                                     | Pod スケジューリングの試行回数                                                                                   |

## クラスター追加機能のメトリクス

クラスター追加機能は、Kubernetes アプリケーションに運用上の機能を提供するソフトウェアです。これには、観測可能性エージェントや、ネットワーク、コンピューティング、ストレージの基礎となる AWS リソースと対話できるようにクラスターを可能にする Kubernetes ドライバなどのソフトウェアが含まれます。追加機能ソフトウェアは、通常、Kubernetes コミュニティ、AWS のようなクラウドプロバイダー、またはサードパーティベンダーによって構築およびメンテナンスされます。Amazon EKS は、すべてのクラスターに対して、Amazon VPC CNI プラグイン for Kubernetes、`kube-proxy`、CoreDNS などのセルフマネージドアドオンを自動的にインストールします。

これらのクラスター追加機能は、ネットワーキング、ドメイン名解決など、さまざまな領域で運用上のサポートを提供します。重要なサポートインフラストラクチャとコンポーネントの動作についての洞察を提供します。追加機能のメトリクスを追跡することは、クラスターの運用上の健全性を理解するうえで重要です。

以下は、監視する必要がある主要な追加機能と、その主要なメトリクスを示しています。

## Amazon VPC CNI プラグイン

Amazon EKS は、Amazon VPC コンテナネットワークインターフェイス (VPC CNI) プラグインを介してクラスターネットワーキングを実装しています。CNI プラグインにより、Kubernetes Pod が VPC ネットワーク上と同じ IP アドレスを取得できます。具体的には、Pod 内のすべてのコンテナはネットワーク名前空間を共有し、ローカルポートを使用して相互に通信できます。VPC CNI アドオンを使用すると、Amazon EKS クラスターのセキュリティと安定性を継続的に確保し、アドオンのインストール、構成、更新に必要な作業を減らすことができます。

CNI メトリクス ヘルパーによって VPC CNI アドオンのメトリクスが公開されます。IP アドレスの割り当てを監視することは、正常なクラスターを確保し、IP 枯渇の問題を回避する上で基本的です。[こちらから最新のネットワーキングのベストプラクティスと収集および監視する必要がある VPC CNI メトリクスをご覧いただけます。](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)

## CoreDNS メトリクス

CoreDNS は柔軟で拡張性のある DNS サーバーで、Kubernetes クラスターの DNS として機能できます。CoreDNS Pod は、クラスター内のすべての Pod の名前解決を提供します。DNS 集中型のワークロードを実行すると、DNS スロットリングのために CoreDNS の障害が断続的に発生することがあり、これがアプリケーションに影響を与える可能性があります。

[こちら](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) で主要な [CoreDNS パフォーマンス メトリクスの最良のプラクティスを確認](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) し、[DNS スロットリングの問題のための CoreDNS トラフィックの監視](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) してください。

## Pod/コンテナーメトリクス

アプリケーションのすべてのレイヤーにわたる使用状況を追跡することが重要です。これには、クラスター内で実行されているノードと Pod をより詳細に調べることが含まれます。Pod ディメンションで利用できるすべてのメトリクスの中で、このメトリクスリストは、クラスター上で実行されているワークロードの状態を理解するのに実際に役立ちます。CPU、メモリ、ネットワークの使用状況を追跡することで、アプリケーション関連の問題の診断とトラブルシューティングが可能になります。ワークロードメトリクスを追跡することで、EKS 上で実行されているワークロードの適切なサイズ変更のためのリソース利用状況の洞察が得られます。

| メトリクス                            | PromQL クエリの例                                                                   | ディメンション                    |
| ------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| 名前空間ごとの実行中の Pod 数         | count by(namespace) (kube_pod_info)                                                 | クラスターごとの名前空間別        |
| Pod ごとのコンテナーごとの CPU 使用率 | sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (namespace, pod) | クラスターごとの名前空間別 Pod 別 |
| Pod ごとのメモリ利用量                | sum(container_memory_usage_bytes{container!=""}) by (namespace, pod)                | クラスターごとの名前空間別 Pod 別 |
| Pod ごとの受信ネットワーク バイト数   | sum by(pod) (rate(container_network_receive_bytes_total[5m]))                       | クラスターごとの名前空間別 Pod 別 |
| Pod ごとの送信ネットワーク バイト数   | sum by(pod) (rate(container_network_transmit_bytes_total[5m]))                      | クラスターごとの名前空間別 Pod 別 |
| コンテナーごとのコンテナー再起動数    | increase(kube_pod_container_status_restarts_total[15m]) > 3                         | クラスターごとの名前空間別 Pod 別 |

## ノードメトリクス

Kube State Metrics と Prometheus ノードエクスポーターは、クラスター内のノードのメトリクス統計を収集します。 ノードのステータス、CPU 使用率、メモリ、ファイルシステム、トラフィックを追跡することは、ノードの利用状況を理解する上で重要です。 ノードリソースの利用状況を理解することは、実行を予定しているワークロードの種類に効果的なインスタンスタイプとストレージを適切に選択する上で重要です。 以下のメトリクスは、追跡すべき基本的なメトリクスの一部です。


|メトリクス	|PromQL クエリの例	|ディメンション	|
|---	|---	|---	|
|ノード CPU 使用率	|sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (node)	|クラスターごとのノード	|
|ノードメモリ使用率	|sum(container_memory_usage_bytes{container!=""}) by (node)	|クラスターごとのノード	|
|ノードネットワーク総バイト数	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|クラスターごとのノード	|
|ノード CPU 予約容量	|sum(kube_node_status_capacity{cluster!=""}) by (node)	|クラスターごとのノード	|
|ノードごとの実行中の Pod 数	|sum(kubelet_running_pods) by (instance)	|クラスターごとのノード	|  
|ノードファイルシステムの使用状況	|rate(container_fs_reads_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}[$__rate_interval]) + rate(container_fs_writes_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}	|クラスターごとのノード	|
|クラスター CPU 使用率	|sum(rate(node_cpu_seconds_total{mode!="idle",mode!="iowait",mode!="steal"}[5m]))	|クラスターごと	|  
|クラスターメモリ使用率	|1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=""}) / sum(node_memory_MemTotal_bytes{job="node-exporter",cluster=""})	|クラスターごと	|
|クラスターネットワーク総バイト数	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|クラスターごと	|
|実行中の Pod 数	|sum(kubelet_running_pod_count{cluster=""})	|クラスターごと	|
|実行中のコンテナー数	|sum(kubelet_running_container_count{cluster=""})	|クラスターごと	|  
|クラスター CPU 制限	|sum(kube_node_status_allocatable{resource="cpu"})	|クラスターごと	|
|クラスターメモリ制限	|sum(kube_node_status_allocatable{resource="memory"})	|クラスターごと	|
|クラスターノード数	|count(kube_node_info) OR sum(kubelet_node_name{cluster=""})	|クラスターごと	|

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

## インフラストラクチャアズコードリソース

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
