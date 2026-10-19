---
title: AWS サービス別推奨アラーム
sidebar_label: 推奨アラーム
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# AWS サービス別推奨アラーム

## 関連イベント

<RelatedEvents topics={["cloudwatch", "metrics"]} />

## 概要

このガイドは、**インシデント検出のための推奨 Amazon CloudWatch アラーム**をサービスごとにまとめたカタログです。各 AWS サービスについて、監視すべき主要メトリクス、シグナルがリアクティブかプロアクティブか、推奨されるアラーム設定（統計、期間、データポイント、および欠落データの処理方法）、および運用上のユースケースをリストしています。さらに、新しい機能（PromQL を使用した OpenTelemetry メトリクス、CloudWatch Database Insights、SageMaker AI Insights、Application Signals SLO）に関する簡潔なメモも含まれています。

このガイドは、アラーム方法論全体（しきい値の種類、コンポジットアラーム、アラーム疲労、ルーティング）をカバーする[アラームとアラーティング](../cloudwatch-alarms-alerting/)ガイドを補完します。このページでは、*サービスごとにどのメトリクスでアラームを設定するか*を説明します。テーブルは AWS の[AWS サービスの推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html)ドキュメントに合わせた出発点です。ワークロードに合わせてしきい値を調整してください。

## 使用するタイミング

- ワークロードをオンボーディングしており、使用する AWS サービスの具体的な初期アラームセットが必要な場合。
- 一般的なアラーム理論ではなく、サービスごとのメトリクス名、統計、しきい値が必要な場合。
- 特定のサービスのアラームを検索している場合（例：「EC2 モニタリング」、「DynamoDB」、「Lambda アラーム」）。
- Database Insights DB Load、SageMaker AI Insights、PromQL でクエリされた OpenTelemetry メトリクスなど、新しいシグナルがどこに適合するかを知りたい場合。

## ガイダンス

以下の各サービスでは、推奨アラームをリストしています。特に記載がない限り、設定は出発点として扱い、自身のトラフィックに対してしきい値のベースラインを設定してください。全体を通して参照されるテクニック（比率、異常検知、コンポジットアラーム）については、[アラームとアラーティング](../cloudwatch-alarms-alerting/)を参照してください。

### コンピューティングとコンテナ

#### EC2

**Amazon EC2** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [EC2 の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EC2)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| 信頼性 | AWS/EC2 | `StatusCheckFailed_Instance` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | 直近 1 分間にインスタンスステータスチェックに合格したかどうかを報告します。値は 0（合格）または 1（不合格）です。追加料金なしで 1 分間隔で利用可能です。 |
| 信頼性 | AWS/EC2 | `StatusCheckFailed_System` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | 直近 1 分間にシステムステータスチェックに合格したかどうかを報告します。値は 0（合格）または 1（不合格）です。追加料金なしで 1 分間隔で利用可能です。EC2 **recover** アクションとペアにしてください。 |
| 信頼性 | AWS/EC2 | `StatusCheckFailed_AttachedEBS` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | 直近 1 分間にアタッチされた EBS ステータスチェックに合格したかどうかを報告します。値は 0（合格）または 1（不合格）です。追加料金なしで 1 分間隔で利用可能です。 |
| 信頼性 | CWAgent | `mem_used_percent` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 使用中のメモリの割合です。CloudWatch エージェントが必要です。100% に近づいた場合にアラームを設定し、OOM キルがインスタンスに影響を与える前にメモリ枯渇を検出します。 |
| 信頼性 | CWAgent | `disk_used_percent` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 使用中のディスクスペースの割合です。CloudWatch エージェントが必要です。アプリケーション障害を引き起こす可能性のあるディスクフル状態を防ぐため、約 85% 以上でアラームを設定します。 |
| 信頼性 | AWS/EBS | `VolumeQueueLength` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | EBS ボリュームの保留中の I/O リクエスト数です。常に高いキュー長は、インスタンスのパフォーマンスを低下させる可能性のあるストレージの飽和を示します。 |
| 信頼性 | AWS/EBS | `BurstBalance` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | gp2/st1/sc1 ボリュームの残りの I/O バーストクレジットの割合です。スループットスロットリングの差し迫った状況を検出するため、約 20% 未満でアラームを設定します。 |

##### 追加メモ

- **自動リカバリ/再起動アクション：** これらのアラームに EC2 アクションをアタッチします — `StatusCheckFailed_System` → **recover**、`StatusCheckFailed_Instance` → **reboot** — 修復が自動化されます。レスポンダーは自動リカバリが失敗した場合に注力できます。
- **OS レベルメトリクス用の CloudWatch エージェント：** `CPUUtilization`、`NetworkIn/Out`、`DiskReadOps` などはネイティブですが、**メモリとディスク使用量はそうではありません** — 上記の `CWAgent` 名前空間メトリクスを公開するために **CloudWatch エージェント**（現在 OpenTelemetry/OTLP パイプラインが組み込まれています）をインストールしてください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** 統合 CloudWatch エージェントは **OTLP** メトリクスとトレースを取り込むことができます。ホスト + アプリケーション計装を OTEL で標準化しながら、CloudWatch でアラームを設定できます。OTEL ソースのホストメトリクスはカスタム名前空間（例：`CWAgent` またはお客様独自の名前空間）に配置されるため、インシデント検出アラームをそこに向けてください。
- **フリート全体のアラーム：** Auto Scaling グループの場合、インスタンスのスケーリングに伴いチャーンするインスタンスごとのアラームではなく、ASG レベルの集約にアラームを設定し、**CloudWatch メトリクス数式/異常検知**を使用してください。


#### ECS

**Amazon ECS**（Container Insights 使用）のインシデント検出用の推奨 CloudWatch アラームです。AWS は [Container Insights を使用した ECS の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ECS-ContainerInsights)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。これらのメトリクスにはクラスターで **Container Insights** が有効になっている必要があります。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| サービスステータス | ECS/ContainerInsights | `RunningTaskCount` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 現在 RUNNING 状態のタスク数です。アプリケーションに必要な最小リソース数を常に下回る場合にアラームを設定します。 |
| サービスステータス | ECS/ContainerInsights | `ServiceCount` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クラスター内のサービス数です。アプリケーションに必要な最小リソース数を常に下回る場合にアラームを設定します。 |
| サービスステータス | ECS/ContainerInsights | `TaskCount` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クラスターで実行中のタスク数です。`TaskCount` が常に `DesiredTaskCount` を下回る場合にアラームを設定します。 |
| サービスステータス | ECS/ContainerInsights | `DesiredTaskCount` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ECS サービスの希望タスク数です。`TaskCount` が常に `DesiredTaskCount` を下回る場合にアラームを設定します。 |
| 飽和 | ECS/ContainerInsights | `CpuUtilized` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービス内のタスクが使用する CPU ユニットです。`CpuReserved` と比較して飽和を検出します — 比率が 100% に近づいた場合にアラームを設定します。 |
| 飽和 | ECS/ContainerInsights | `CpuReserved` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービス内のタスクが予約する CPU ユニットです。CPU 飽和を測定するため、`CpuUtilized` とのメトリクス数式比率で使用します。 |
| 飽和 | ECS/ContainerInsights | `MemoryUtilized` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービス内のタスクが使用するメモリです。`MemoryReserved` と比較してメモリ圧迫を検出します — 比率が 100% に近づいた場合にアラームを設定します。 |
| 飽和 | ECS/ContainerInsights | `MemoryReserved` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービス内のタスクが予約するメモリです。メモリ飽和を測定するため、`MemoryUtilized` とのメトリクス数式比率で使用します。 |
| 飽和 | AWS/ECS | `CPUReservation` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | EC2 起動タイプのクラスターで、実行中タスクが予約した CPU ユニットの合計登録 CPU に対する割合です。タスク配置をブロックするキャパシティ枯渇を検出するため、約 80% 以上でアラームを設定します。 |
| 飽和 | AWS/ECS | `MemoryReservation` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | EC2 起動タイプのクラスターで、実行中タスクが予約したメモリの合計登録メモリに対する割合です。タスク配置をブロックするキャパシティ枯渇を検出するため、約 80% 以上でアラームを設定します。 |
| 信頼性 | ECS/ContainerInsights | `DeploymentCount` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービスのアクティブなデプロイメント数です。異常値や長期間にわたって 1 を超える値にアラームを設定し、スタックまたはロールバックされたデプロイメントをキャッチします。 |

##### 追加メモ

- **実行中 vs 希望をコンポジットとして：** 最もアクション可能なインシデント検出アラームは、スケーリング時に壊れる静的な下限値ではなく、`RunningTaskCount` / `TaskCount` vs `DesiredTaskCount` の**メトリクス数式比較**（希望よりも少ない実行が N 分間続いた場合に発火）です。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** 各タスクのアプリケーションを ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装し、トレース + カスタムメトリクスを CloudWatch（Application Signals）にエクスポートします。これにより、ここにあるインフラレベルのタスクカウントに加えて、リクエストレベルのレイテンシ/エラー SLO が得られます。
- **Fargate vs EC2：** Fargate では監視するホストがないため、タスクカウントとタスクごとの使用率メトリクスが主要なインシデント検出シグナルです。EC2 起動タイプでは、キャパシティ枯渇を検出するために上記の `CPUReservation`/`MemoryReservation` アラームも活用してください。
- **デプロイメント障害シグナル：** `DeploymentCount` アラームを ECS **サービスデプロイメント** CloudWatch Events で補完し、EventBridge ルール経由でスタックまたはロールバックされたデプロイメントを迅速にキャッチしてください。


#### EKS

**Amazon EKS** のインシデント検出用の推奨 CloudWatch アラームです。EKS には複数のモニタリング方法があるため、本記事では **4 つのオプション**を提示します。特に記載がない限り、以下のすべてのアラームは **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = notBreaching** を使用しており、**統計**列と**リアクティブ/プロアクティブ**列のみが異なります。

- **オプション 1 — Container Insights（AWS サービス）。** 名前空間は `ContainerInsights` です。**拡張オブザーバビリティ付き Container Insights**（EC2 のみ。Fargate は非対応）で最良の結果が得られます。*(enhanced)* と記載されたメトリクスには拡張オブザーバビリティが必要です。
- **オプション 1 拡張 — Container Insights + Prometheus 統合。** 名前空間は `ContainerInsights/Prometheus` です。
- **オプション 2 — Prometheus（オープンソースまたは AWS マネージド）。** コントロールプレーンのメトリクスを Prometheus 形式でスクレイプします。CloudWatch に取り込むか、Webhook/SNS 経由でインシデント検出と統合したサードパーティ APM で処理します。名前空間は該当なし（Prometheus）です。
- **顧客管理の Kubernetes。** オープンソースの kube-prometheus アラートを使用します。Webhook/SNS 経由でインシデント検出と統合したサードパーティ APM を利用します。名前空間は該当なし（Prometheus）です。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

##### オプション 1 — Container Insights（名前空間 `ContainerInsights`）

| ビジネス目標 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|
| コンテナステータス | `pod_container_status_waiting_reason_crash_loop_back_off` *(enhanced)* | リアクティブ | Average | CrashLoopBackOff エラー（コンテナの起動が繰り返し失敗する状態）により保留中のコンテナ数です。 |
| コンテナステータス | `pod_container_status_waiting_reason_create_container_config_error` *(enhanced)* | リアクティブ | Average | 理由が CreateContainerConfigError（コンテナ設定の作成エラー）で保留中のコンテナ数です。 |
| コンテナステータス | `pod_container_status_waiting_reason_create_container_error` *(enhanced)* | リアクティブ | Average | 理由が CreateContainerError（コンテナ作成中のエラー）で保留中のコンテナ数です。 |
| コンテナステータス | `pod_container_status_waiting_reason_image_pull_error` *(enhanced)* | リアクティブ | Average | ErrImagePull、ImagePullBackOff、または InvalidImageName（コンテナイメージのプルエラー）により保留中のコンテナ数です。 |
| コンテナステータス | `pod_container_status_waiting_reason_start_error` *(enhanced)* | リアクティブ | Average | 理由が StartError（コンテナ起動中のエラー）で保留中のコンテナ数です。 |
| コンテナステータス | `pod_container_status_terminated` *(enhanced)* | リアクティブ | Average | Terminated 状態のコンテナ数です。 |
| コンテナステータス | `replicas_desired` *(enhanced)* | プロアクティブ | Average | ワークロードで必要とされる Pod 数です（ワークロード仕様に基づく）。`replicas_ready` が常に `replicas_desired` を下回る場合にアラームを設定します。 |
| コンテナステータス | `replicas_ready` *(enhanced)* | プロアクティブ | Average | ワークロードで ready 状態に達した Pod 数です。`replicas_ready` が常に `replicas_desired` を下回る場合にアラームを設定します。 |
| クラスターステータス | `cluster_failed_node_count` | リアクティブ | Average | クラスター内の障害が発生したワーカーノード数です（いずれかのノード条件が失敗しているノード）。 |
| Pod ステータス | `pod_status_failed` *(enhanced)* | リアクティブ | Average | Pod 内のすべてのコンテナが終了し、少なくとも 1 つがゼロ以外のステータスで終了したか、システムによって終了されました。 |
| Pod ステータス | `pod_status_unknown` *(enhanced)* | リアクティブ | Average | Pod のステータスを取得できません。 |
| Pod ステータス | `pod_status_pending` *(enhanced)* | リアクティブ | Sum | スケジュールされているが Running 状態ではない Pod です（容量不足、スケジューリング制約など）。 |
| Pod ステータス | `pod_number_of_container_restarts` | リアクティブ | Sum | コンテナが失敗して繰り返し再起動しています — コンテナ障害を捕捉するために重要です。 |
| ノードステータス | `node_interface_network_rx_dropped` *(enhanced)* | リアクティブ | Sum | ノード上のネットワークインターフェイスで受信された後にドロップされたパケット数です。 |
| ノードステータス | `node_interface_network_tx_dropped` *(enhanced)* | リアクティブ | Sum | ノード上のネットワークインターフェイスで送信予定だったがドロップされたパケット数です。 |
| API サーバーステータス | `apiserver_request_total_5XX` *(enhanced)* | リアクティブ | Sum | Kubernetes API サーバーへのリクエストのうち、5XX HTTP レスポンスコードが返されたものです。 |
| API サーバーステータス | `apiserver_request_duration_seconds` *(enhanced)* | リアクティブ | Average | Kubernetes API サーバーへの API リクエストのレスポンスレイテンシーです。 |
| API サーバーステータス | `apiserver_longrunning_requests` *(enhanced)* | リアクティブ | Average | Kubernetes API サーバーへのアクティブな長時間実行リクエスト数です。 |
| API サーバーステータス | `apiserver_admission_webhook_admission_duration_seconds` *(enhanced)* | リアクティブ | Average | Admission webhook のレイテンシー（秒）です。Admission webhook は admission リクエストを受け取る HTTP コールバックです。 |
| API サーバーステータス | `apiserver_flowcontrol_rejected_requests_total` *(enhanced)* | リアクティブ | Average | API サーバーでのスロットリングの検出に役立ちます。 |
| API サーバーステータス | `etcd_db_total_size_in_bytes`（v1.25 以前）**または** `apiserver_storage_db_total_size_in_bytes`（v1.26/1.27）**または** `apiserver_storage_size_bytes`（v1.28）*(enhanced)* | リアクティブ | Maximum | ETCD DB のサイズをしきい値に対して追跡します（例：8 GB では読み取り専用の API 操作のみが許可され、顧客の操作に悪影響を及ぼします）。 |

##### オプション 1 拡張 — Container Insights + Prometheus（名前空間 `ContainerInsights/Prometheus`）

| ビジネス目標 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|
| アプリケーション統計 | 主要なビジネス運用状況やアプリケーションパフォーマンスを示す、高度にカスタマイズされたビジネスレベルのメトリクス | プロアクティブ | Average or Sum | Prometheus をサポートする CloudWatch エージェントは、サービス/ワークロード（App Mesh、NGINX、Memcached、Java/JMX）からメトリクスを自動収集します。他のアプリケーションやサービスからさらにサービスメトリクスや Prometheus メトリクスを収集するように設定できます。 |

##### オプション 2 — Prometheus のコントロールプレーンメトリクス（名前空間は該当なし — Prometheus）

| ビジネス目標 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|
| API サーバーステータス | `apiserver_admission_controller_admission_duration_seconds` | プロアクティブ | Average | Admission controller のレイテンシーヒストグラム（秒）です。名前別で、操作および API リソース/タイプ（validate または admit）ごとに分類されます。 |
| API サーバーステータス | `apiserver_admission_webhook_admission_duration_seconds` | プロアクティブ | Average | Admission webhook のレイテンシーヒストグラム（秒）です。名前別で、操作および API リソース/タイプごとに分類されます。 |
| API サーバーステータス | `apiserver_longrunning_requests` | プロアクティブ | Average | アクティブな長時間実行 apiserver リクエストのゲージです。verb、group、version、resource、scope、component 別に分類されます。すべてのリクエストがこの方法で追跡されるわけではありません。 |
| API サーバーステータス | `apiserver_authorization_webhook_duration_seconds` | プロアクティブ | Average | リクエストレイテンシー（秒）です。 |
| API サーバーステータス | `apiserver_clusterip_repair_ip_errors_total` | リアクティブ | Sum | 修復ループによって検出された clusterip のエラーです。タイプ別：leak、repair、full、outOfRange、duplicate、unknown、invalid。 |
| API サーバーステータス | `apiserver_nodeport_repair_port_errors_total` | リアクティブ | Sum | 修復ループによって検出されたポートのエラーです。タイプ別：leak、repair、full、outOfRange、duplicate、unknown。 |
| API サーバーステータス | `apiserver_tls_handshake_errors_total` | リアクティブ | Sum | 「TLS handshake error from」エラーでドロップされたリクエスト数です。 |
| クラスターステータス | `kubernetes_healthchecks_total` | リアクティブ | Sum | すべてのヘルスチェックの結果を記録します。 |
| クラスターステータス | `kubelet_runtime_operations_errors_total` | リアクティブ | Sum | 操作タイプ別のランタイム操作エラーの累積数です。 |
| クラスターステータス | `kubelet_started_pods_errors_total` | リアクティブ | Sum | Pod の起動時に発生したエラーの累積数です。 |
| クラスターステータス | `node_collector_zone_health` | リアクティブ | Average | ゾーンごとの正常なノードの割合を測定するゲージです。 |

##### 顧客管理の Kubernetes（名前空間は該当なし — Prometheus / kube-prometheus アラート）

| ビジネス目標 | メトリクス / アラート名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|
| Alertmanager ステータス | `AlertmanagerClusterDown` | リアクティブ | Average | 同一クラスター内の Alertmanager インスタンスの半数以上がダウンしています。 |
| Prometheus ステータス | `PrometheusNotConnectedToAlertmanagers` | リアクティブ | Average | Prometheus がどの Alertmanager にも接続されていません。 |
| Prometheus ステータス | `PrometheusBadConfig` | リアクティブ | Average | 内容が不正なため、Prometheus が設定ファイルをリロードできません。 |
| Kubernetes ステータス | `KubeAPIDown` | リアクティブ | Average | すべての Kubernetes API サーバーにモニタリングシステムから 15 分以上到達できない場合にトリガーされます。 |
| Kubernetes ステータス | `KubeClientErrors` | リアクティブ | Average | 直近 15 分間で Kubernetes API サーバークライアントのエラー率が 1% を超えています。 |
| Kubernetes ステータス | `KubeContainerWaiting` | リアクティブ | Average | Pod 内のコンテナが長時間 Waiting 状態になっています。 |
| Kubernetes ステータス | `KubeControllerManagerDown` | リアクティブ | Average | KubeControllerManager が Prometheus のターゲットディスカバリから消失しました。 |
| Kubernetes ステータス | `KubePodCrashLooping` | リアクティブ | Average | Pod が CrashLoop 状態です — アプリが停止または応答しなくなり、Kubernetes が自動的に再起動を試みています。 |
| Kubernetes ステータス | `KubeNodeNotReady` | リアクティブ | Average | Kubernetes ノードが一定期間 Ready 状態でない場合（新しい Pod をホストできない）、または 15 分以上 Ready でない場合に発火します。 |
| Kubernetes ステータス | `KubeletDown` | リアクティブ | Average | モニタリングシステムがクラスターのいずれの Kubelet にも 15 分以上到達できない場合にトリガーされます。 |
| Kubernetes ステータス | `KubeletTooManyPods` | リアクティブ | Average | ノードが Pod 容量（デフォルトは 110）の 95% を超えて稼働している場合に発火します。 |

##### 追加メモ

- **CloudWatch Observability EKS アドオン + 拡張オブザーバビリティ付き Container Insights** が現在の推奨デフォルトです（オプション 1）。EKS アドオンとして提供され、**CloudWatch エージェント（OTEL/OTLP パイプラインを内蔵）** と Fluent Bit をデプロイし、クラスター→ノード→Pod→コンテナのドリルダウンを可能にします。拡張オブザーバビリティのメトリクス（上記で記載したもの）は、最も実行可能なインシデント検出シグナルです。
- **OpenTelemetry（OTEL）は現在 EKS オブザーバビリティの中心です：** **CloudWatch エージェントの OTLP エンドポイント**（CloudWatch Observability アドオンによってデプロイされます）を使用して、ADOT SDK からアプリケーションのメトリクス、トレース、ログを収集します。アプリケーションメトリクスはカスタム名前空間に格納されるため、インシデント検出アラームをそこに向けてください。**CloudWatch Application Signals** は EKS ワークロードを自動計装し、ゴールデンシグナルの SLO アラームを提供します。
- **Amazon Managed Service for Prometheus（AMP）+ Managed Grafana：** オプション 2 のセルフマネージド Prometheus は、**alertmanager** を備えた **AMP** によって大部分が置き換えられています。AMP はインシデント検出のために SNS にルーティングできます。信頼性の観点から、セルフホストの Prometheus よりも AMP の記録/アラートルールを優先してください。
- **Fargate ノード：** 拡張オブザーバビリティは EC2 のみで利用できます。Fargate の場合は、ノードレベルの Container Insights ではなく、Application Signals / OTEL でエクスポートされた Pod メトリクス（CloudWatch エージェントの OTLP エンドポイント経由）とコントロールプレーンのメトリクスを利用してください。
- **ETCD サイズのメトリクス名はバージョンによって変わります：** 上記のとおり、ETCD サイズのメトリクスは 1.25→1.26/1.27→1.28 で変更されています。現行の EKS バージョン（1.29 以降）では、アラームを設定する前に正確なメトリクス名（`apiserver_storage_size_bytes`）を確認してください。

##### EKS での OpenTelemetry（OTEL）サポート

EKS は OpenTelemetry を第一級でサポートしており、OTEL はベンダーニュートラルな方法でアプリケーションとインフラストラクチャのテレメトリを収集するための推奨手段です。推奨される収集経路では **CloudWatch エージェント**と **Amazon Managed Service for Prometheus（AMP）** を使用します — セルフマネージドのコレクターは不要です：

- **CloudWatch Observability EKS アドオン**（`amazon-cloudwatch-observability`）— **CloudWatch エージェント**（OTEL/OTLP パイプラインを内蔵）と Fluent Bit をデプロイします。拡張オブザーバビリティ付き Container Insights を実現し、**Prometheus** メトリクスを CloudWatch にスクレイプします（Embedded Metric Format として、`AWS/*` ではなく**自分で定義したカスタム名前空間**に格納されます。他の CloudWatch メトリクスと同様にアラームを設定できます）。また、ゴールデンシグナルの SLO アラーム用に **Application Signals** の自動計装（Java、Python、Node.js、.NET）を有効化します。
- **CloudWatch エージェントの OTLP エンドポイント** — ADOT SDK を CloudWatch エージェントの OTLP エンドポイントに向けて、アプリケーションのメトリクスとトレースを送信します。メトリクスは自分で定義したカスタム名前空間に格納され、トレースは Application Signals / X-Ray で確認できます。
- **Amazon Managed Service for Prometheus（AMP）** — PromQL を標準とするチームの場合、AMP の**フルマネージド（エージェントレス）スクレイパー**を使用して、クラスター、コントロールプレーン、ワークロードの `/metrics` エンドポイントを検出し、AMP にスクレイプします。PromQL でクエリを実行し、AMP の alert manager → SNS 経由でアラートを送信できます — 独自のコレクターを実行または運用する必要はありません。

**アラームの配置先：** CloudWatch に送信されたメトリクス（EMF/OTLP）は CloudWatch アラームでアラームを設定します（上記の Container Insights のテーブルを参照）。AMP に送信されたメトリクスは、PromQL で評価され SNS にルーティングされる **AMP の記録/アラートルール**でアラームを設定します。信頼性の観点から、セルフマネージドの Prometheus よりも AMP + Managed Grafana を優先してください。

###### PromQL クエリの例

以下のクエリは、AMP のマネージド（エージェントレス）スクレイパーによって AMP に収集されたメトリクス、またはセルフマネージドの Prometheus に収集されたメトリクスに対して機能します。上記のテーブルのアラームの意図を反映しています。標準のエクスポーター（`kube-state-metrics`、`node-exporter`、cAdvisor（kubelet））と EKS コントロールプレーンの `/metrics` エンドポイントが必要です。

**コントロールプレーン / API サーバー**

```promql
# API server 5xx error rate (requests/sec)
sum(rate(apiserver_request_total{code=~"5.."}[5m]))

# API server error ratio (5xx as a fraction of all requests) — alert above ~0.01
sum(rate(apiserver_request_total{code=~"5.."}[5m]))
  / sum(rate(apiserver_request_total[5m]))

# API server p99 request latency (seconds), excluding long-poll WATCH verbs
histogram_quantile(0.99,
  sum(rate(apiserver_request_duration_seconds_bucket{verb!~"WATCH|CONNECT"}[5m])) by (le))

# etcd database size as a fraction of its backend quota — alert above ~0.8
max(etcd_db_total_size_in_bytes) / max(etcd_server_quota_backend_bytes)

# API Priority & Fairness: rejected (throttled) requests per second
sum(rate(apiserver_flowcontrol_rejected_requests_total[5m]))
```

**ノード**

```promql
# Count of nodes NOT in Ready state — alert when > 0
count(kube_node_status_condition{condition="Ready",status="true"} == 0)

# Per-node CPU utilization (0-1)
1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))

# Per-node available memory ratio — alert when below ~0.1
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Root filesystem usage ratio — alert above ~0.85
1 - (node_filesystem_avail_bytes{mountpoint="/"}
     / node_filesystem_size_bytes{mountpoint="/"})

# Dropped packets per second per node (rx + tx)
sum by (instance) (
  rate(node_network_receive_drop_total[5m])
  + rate(node_network_transmit_drop_total[5m]))
```

**ワークロード / Pod**

```promql
# Pods not in Running/Succeeded state, by namespace
sum by (namespace) (kube_pod_status_phase{phase=~"Pending|Unknown|Failed"})

# Containers in CrashLoopBackOff, by pod
sum by (namespace, pod) (
  kube_pod_container_status_waiting_reason{reason="CrashLoopBackOff"})

# Container restarts in the last 15 minutes, by pod
sum by (namespace, pod) (
  increase(kube_pod_container_status_restarts_total[15m]))

# Deployments where ready replicas are fewer than desired — alert when > 0
sum by (namespace, deployment) (
  kube_deployment_spec_replicas - kube_deployment_status_replicas_available) > 0

# Pod CPU throttling ratio — high values mean CPU limits are too low
sum by (namespace, pod) (rate(container_cpu_cfs_throttled_periods_total[5m]))
  / sum by (namespace, pod) (rate(container_cpu_cfs_periods_total[5m]))

# Pod memory working set as a fraction of its limit — alert near 1.0 (OOM risk)
sum by (namespace, pod) (container_memory_working_set_bytes)
  / sum by (namespace, pod) (
      kube_pod_container_resource_limits{resource="memory"})
```

:::tip
AMP では、これらの式を**アラートルール**にラップし、AMP の alert manager 経由で発火したアラートを Amazon SNS にルーティングしてください。あるいは、Amazon Managed Grafana でより安価かつ高速なダッシュボードを実現するために、**記録ルール**として評価してください。メトリクス名とラベル名はエクスポーターのバージョンによって異なります — ご自身の環境で名前を確認してください（たとえば、一部の kubelet cAdvisor メトリクスには `container=""` という空ラベルの系列が含まれており、`{container!=""}` でフィルタリングする必要がある場合があります）。
:::


#### Lambda

AWS Lambda は、イベントに応じてコードを実行し、基盤となるコンピューティングリソースを自動的に管理するサーバーレスコンピューティングサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | Lambda | `AWS/Lambda` | (m1/m2)*100 m1 = Errors m2 = Invocations | リアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、成功した Lambda 呼び出しに対するエラーの比率をモニタリングします。Lambda 関数のエラーには、ユーザーコードがスローした例外だけでなく、タイムアウトや設定の問題などに起因して Lambda ランタイム環境がスローした例外も含まれます。相対的なメトリクスであるため、この指標は変動的で予測困難なワークロードにもよく適応します。 |
| 信頼性、レイテンシー | Lambda | `AWS/Lambda` | `Throttles` | リアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | この CloudWatch メトリクスは、呼び出しリクエストのスループットをモニタリングし、スロットリングが発生した時点を測定します。Lambda 関数がすべてのプロビジョニング済みインスタンスで最大同時実行数に達して稼働している場合、リソース制限に達すると追加の受信リクエストは TooManyRequestsException で拒否されます。スロットリングされたリクエストは、他の呼び出しエラーと同様に、Invocations メトリクスや Errors メトリクスにはカウントされません。 |
| 信頼性 | Lambda | `AWS/Lambda` | `DeadLetterErrors` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、メッセージが DLQ に到達できなかった場合のモニタリングとアラートに役立ちます。イベントを期待どおりに処理できていない Lambda 関数の問題、特に同じイベントの処理が繰り返し失敗するケースを特定するうえで重要です。 |
| 信頼性 | Lambda | `AWS/Lambda` | `ConcurrentExecutions` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、同時に実行される関数インスタンスの数を追跡します。これをモニタリングすることで、使用パターンを把握し、スケーリング設定や、関数が設定済みの制限に継続的に達している場合に同時実行数の上限引き上げを申請すべきタイミングについて、十分な情報に基づいた判断を下せます。 |
| 信頼性 | Lambda | `LambdaInsights` | `memory_utilization` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 使用中の割り当てメモリの割合です。Lambda Insights レイヤーが必要です。関数の障害が発生する前に OOM リスクをプロアクティブに捕捉するため、100% に近づいた時点でアラームを設定します。 |
| 信頼性 | Lambda | `AWS/Lambda` | `RecursiveInvocationsDropped` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lambda の再帰ループ検出（Lambda ↔ SQS/SNS の連鎖）によって停止された呼び出しをカウントします。ゼロ以外の値は暴走した再帰ループが停止されたことを示します — 原因となった関数を直ちに調査してください。 |
| 信頼性、レイテンシー | Lambda | `AWS/Lambda` | `ProvisionedConcurrencySpilloverInvocations` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | プロビジョニングされた同時実行数を超え、コールドスタートが発生する可能性のあるオンデマンドスケーリングにフォールバックした呼び出しの数です。継続的にゼロ以外になる場合にアラームを設定し、プロビジョニング済み容量が不足しているタイミングを特定します。 |

##### 追加メモ

- **Lambda での OpenTelemetry（OTEL）：** Lambda では CloudWatch エージェントを実行できないため、**ADOT Lambda レイヤー**（OTEL SDK ディストリビューション）または **CloudWatch Application Signals for Lambda**（OTEL ベースの自動計装）で関数を計装し、OTLP のメトリクス/トレースを CloudWatch にエクスポートします。カスタム OTEL メトリクスは自分で定義した名前空間（`AWS/Lambda` ではありません）に格納されるため、ネイティブの Lambda メトリクスと並べてビジネスメトリクスを相関付けられます。
- **CloudWatch Application Signals：** Lambda 関数がアプリケーションエンドポイントとして機能する場合、Application Signals は `ApplicationSignals` 名前空間で SLO バーンレートアラームを自動的に提供します — しきい値アラームを手動で定義することなく、レイテンシーと可用性の SLO を追跡するのに役立ちます。
- **異常検知バンド：** 静的なしきい値ではなく、`ConcurrentExecutions` と `Duration` に CloudWatch 異常検知を使用することを検討してください — これにより時間帯ごとのトラフィックパターンに適応し、想定されるピーク時のノイズの多いアラートを回避できます。
- **Lambda Insights の有効化：** Lambda Insights は Lambda レイヤーによって有効化され、拡張メトリクス（CPU 時間、初期化時間、メモリ使用率など）を `LambdaInsights` 名前空間に発行します。モニタリングしたい各関数にレイヤーを追加する必要があります。


### データベースと分析

#### RDS

Amazon RDS は、複数のエンジン（MySQL、PostgreSQL、MariaDB、Oracle、SQL Server、Aurora）をサポートし、プロビジョニング、パッチ適用、バックアップ、フェイルオーバーを処理するマネージドリレーショナルデータベースサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性、レイテンシー | Amazon RDS | `AWS/RDS` | `DiskQueueDepth` | リアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | DiskQueueDepth メトリクスの監視は、RDS インスタンスのパフォーマンスボトルネックを特定するために不可欠です。このメトリクスは、ストレージレイヤーで処理待ちになっている未処理の IO（読み取り/書き込みリクエスト）の数を測定し、データベースが受信クエリとトランザクションをどれだけ迅速に処理できるかについての洞察を提供します。DiskQueueDepth を経時的に追跡することで、RDS インスタンスのコンピューティングまたはストレージリソースが飽和したタイミングが明らかになり、速度低下を防ぐためにインスタンスキャパシティをスケールアップする必要があることを示します。 |
| 信頼性 | Amazon RDS | `AWS/RDS` | `FreeStorageSpace` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | RDS インスタンスで利用可能なストレージキャパシティをプロアクティブに監視することは、ディスクスペース不足に起因する潜在的なデータベース停止を防ぐために極めて重要です。使用率のしきい値にアラートを設定することで、キャパシティ上限に到達することを回避するプロアクティブな姿勢が可能になります。 |
| カスタマーエクスペリエンス、信頼性 | Amazon RDS | `AWS/RDS` | `ReplicaLag` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | RDS リードレプリカで検出されたレプリケーションラグ時間の増加は、データが過度に古くなり、アプリケーションのパフォーマンスに悪影響を与える可能性があります。ニアリアルタイムの読み取り整合性に依存するアプリケーションワークロードをサポートするうえで、レプリカのデータ鮮度とその適合性を評価するため、ラグ増大の根本原因をさらに調査することが推奨されます。レプリケーションラグを要となるメトリクスとしてプロアクティブに監視することで、劣化の早期検出と修復が可能になり、レプリカの可用性を最適化してエンドユーザーエクスペリエンスを保護できます。 |
| カスタマーエクスペリエンス、レイテンシー | Amazon RDS | `AWS/RDS` | `ReadLatency` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ReadLatency は、データベースストレージからデータを読み取るのにかかる平均時間（ミリ秒）を測定します。読み取りレイテンシーが高い場合、低速なクエリ、非効率なインデックス作成、リソース競合などのパフォーマンス問題を示している可能性があり、アプリケーション全体のパフォーマンスと応答性に影響を与えます。 |
| カスタマーエクスペリエンス、レイテンシー | Amazon RDS | `AWS/RDS` | `WriteLatency` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | WriteLatency は、データベースストレージにデータを書き込むのにかかる平均時間（ミリ秒）を測定します。書き込みレイテンシーが高い場合、低速な挿入、更新、非効率なインデックス作成などの書き込み操作のパフォーマンス問題を示している可能性があり、アプリケーション全体のパフォーマンスに影響を与えます。また、書き込みワークロードを処理するためにデータベースインスタンスがより多くのリソース（CPU、メモリ、ストレージ）を必要としていることを示している場合もあります。 |

##### CloudWatch Database Insights

[Amazon CloudWatch Database Insights](/solutions/rds-aurora-monitoring/) は、Amazon RDS と Aurora のための統合されたデータベース中心のオブザーバビリティエクスペリエンスです。Performance Insights と Enhanced Monitoring を基盤とし、**DB Load** — データベース内のアクティブセッションの平均数（AAS）— を中心に据えています。これを SQL、待機イベント、ホスト、ユーザー、アプリケーションでスライスして、パフォーマンスインシデントの根本原因を見つけることができます。これは、スタンドアロンの Performance Insights コンソールエクスペリエンスの後継です。

インシデント検出において、Database Insights は上記の基本的な `AWS/RDS` インフラストラクチャメトリクスでは捉えられないシグナルを追加します — 最も重要なものとして**コンピューティングキャパシティに対するデータベースの飽和**と**その負荷がどこで待機しているか**（CPU vs. I/O vs. ロック）です。

###### 推奨：有効にする

- **標準モードは追加料金なしでデフォルトで有効です** — 有効になっていること（CloudWatch → Database Insights）を確認し、7 日間の保持期間で DB Load 分析に使用してください。
- **本番データベースでは Advanced モードを有効にしてください。** Advanced モードでは、フリートヘルスビュー、15 か月の保持期間、OS プロセス分析、ロックおよび実行計画の分析、スロー SQL 分析、Application Signals の「呼び出し元サービス」の相関付け、そして — アラーム設定の要として — **Performance Insights カウンターメトリクスの CloudWatch への自動インポート**が追加され、エンジンレベルのカウンターにアラームを設定できます。Advanced モードには 15 か月（≥ 465 日）の保持期間を設定した Performance Insights が必要で、vCPU 時間（プロビジョンド）または ACU 時間（サーバーレス）単位で課金されます。Enhanced Monitoring と CloudWatch Logs の取り込みは別途課金されます。
- 既存のインスタンスで Advanced モードを有効にしても、**ダウンタイムは発生しません**。Aurora/マルチ AZ クラスターの場合はクラスター全体に適用されます（すべてのインスタンスが同じ Performance Insights と Enhanced Monitoring の設定を共有する必要があります）。

```bash
# Enable Advanced mode of Database Insights on an existing RDS instance (no downtime)
aws rds modify-db-instance \
    --db-instance-identifier <your-db-instance> \
    --database-insights-mode advanced \
    --enable-performance-insights \
    --performance-insights-retention-period 465
```

Database Insights のセットアップについては [RDS & Aurora モニタリング](/solutions/rds-aurora-monitoring/) を、モード、制限事項、フリートまたはクロスアカウント構成については [AWS ドキュメント](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Monitoring.html) を参照してください。

###### アラームを設定すべき推奨 Database Insights メトリクス

これらは、Performance Insights / Database Insights を有効にすると `AWS/RDS` 名前空間に公開されます。`DBLoad*` メトリクスは平均アクティブセッション数（AAS）で表されます。アクション可能なしきい値は**インスタンスの vCPU 数に対する相対値**です。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| パフォーマンス、信頼性 | `AWS/RDS` | `DBLoad` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; Threshold ≈ number of vCPUs on the instance (or metric math `DBLoad / vCPUs ≥ 1`); TreatMissingData = notBreaching | Database Insights の中核シグナル — 平均アクティブセッション数です。`DBLoad` がインスタンスの vCPU 数以上で持続している場合、セッションがキューイングされてデータベースが過負荷になっていることを意味します。顧客が気づく前にアラームを設定してください。 |
| パフォーマンス | `AWS/RDS` | `DBLoadCPU` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU 上でアクティブに実行されているセッションによる DB Load の割合です。`DBLoadCPU` が vCPU 数に向かって推移している場合、CPU の飽和を示します（スケールアップまたはクエリチューニングの候補）。 |
| パフォーマンス、レイテンシー | `AWS/RDS` | `DBLoadNonCPU` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU 以外のリソース（I/O、ロック、バッファ）を待機している DB Load の割合です。`DBLoadNonCPU` の上昇は I/O ボトルネックまたはロック競合を示します — Database Insights の待機イベントビューと（Aurora/RDS PostgreSQL の）ロック分析ビューを詳しく調べてください。 |

> **Advanced モードのみ：** Advanced モードを有効にすると、Performance Insights の**カウンターメトリクス**（デッドロック、バッファキャッシュヒット率、トランザクションログ使用量などのエンジン `db.*` カウンターと、OS の `os.*` メトリクス）が CloudWatch に自動インポートされ、以前は Performance Insights コンソールでのみ確認できたエンジン内部のカウンターにアラームを構築できるようになります。スロー SQL 分析には、さらにデータベースログの CloudWatch Logs へのエクスポートが必要です。

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** CloudWatch エージェントの OTLP エンドポイントを使用して、アプリケーションレベルのデータベースメトリクス（コネクションプール使用率、タイプ別のクエリ所要時間）をカスタム名前空間に出力します。これらは、アプリケーション視点のレイテンシー内訳を提供することで `AWS/RDS` ネイティブメトリクスを補完します。OTEL メトリクスは `AWS/RDS` ではなく、お客様が定義するカスタム名前空間に配置されます。
- **CloudWatch Application Signals：** アプリケーションがバックエンドの依存関係として RDS に接続している場合、Application Signals はデータベースの依存関係を自動検出し、`ApplicationSignals` 名前空間で SLO バーンレートアラームを提供できます — データベース応答時間を含むエンドツーエンドのレイテンシー SLO を追跡するのに有用です。
- **異常検知バンド：** 静的なしきい値の代わりに、`ReadLatency`、`WriteLatency`、`DiskQueueDepth` に CloudWatch 異常検知を使用することを検討してください。データベースワークロードは時間帯や曜日による強いパターンを示すことが多く、固定しきい値よりも異常検知の方が適切に処理できます。
- **CloudWatch Database Insights（PI コンソールの統合された後継）：** Database Insights は、Performance Insights、Enhanced Monitoring、CloudWatch メトリクス/ログ、RDS イベントを 1 つのエクスペリエンスに統合し、現在は RDS/Aurora のデータベース健全性を監視する推奨手段となっています。Enhanced Monitoring は引き続き OS レベルのメトリクス（プロセスごとの CPU、メモリ内訳、ファイルシステム使用率）を最大 1 秒の粒度で提供し、Database Insights の OS プロセスビューに表示されます。主要な飽和指標として、vCPU 数に対する `DBLoad` へのアラーム設定を優先してください（上記の [CloudWatch Database Insights](#cloudwatch-database-insights) セクションを参照）。
- **Aurora 固有のメトリクス：** Aurora を使用している場合、基本的な RDS メトリクスよりも詳細なスケーリングとパフォーマンスのシグナルを提供する `AuroraReplicaLagMaximum`、`BufferCacheHitRatio`、`DatabaseConnections`、`ServerlessDatabaseCapacity`（Aurora Serverless v2 の場合）の監視を検討してください。
- **Storage Auto Scaling への配慮：** RDS Storage Auto Scaling が有効な場合、`FreeStorageSpace` アラームは構成された最大ストレージしきい値を考慮する必要があります — 自動スケーリングイベント中の誤検知を避けるため、現在の割り当てだけでなく最大割り当てに対して空き容量が少ない場合にアラームを設定してください。


#### Aurora

**Amazon Aurora** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [RDS/Aurora の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS)も公開しています。すべてのアラームは **Period = 60s, DatapointsToAlarm = 5** を使用します。`TreatMissingData` は注記のとおり（`missing` または `breaching`）異なります。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | TreatMissingData | ユースケース |
|---|---|---|---|---|---|---|
| 可用性 | AWS/RDS | `DatabaseConnections` | リアクティブ | Sum | missing | アクティブな DB セッションを追跡し、接続上限に達していないことを確認します。アプリケーションが新しいデータベース接続を確立できない状態です。 |
| データ鮮度 | AWS/RDS | `AuroraReplicaLag` | リアクティブ | Max | breaching | データ整合性の監視のため、プライマリインスタンスとレプリカインスタンス間のレプリケーション遅延を追跡します。 |
| 信頼性、レイテンシー | AWS/RDS | `ReplicaLag` | リアクティブ | Average | breaching | データ同期を確保するため、リードレプリカのレプリケーションレイテンシーを測定します。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `ReadIOPS`, `WriteIOPS` | リアクティブ | Average | missing | 1 秒あたりのディスク I/O 操作数です。持続的に高い値はボトルネック（バッファキャッシュ不足、非効率なクエリ、大量の書き込み）を示します。突発的なスパイクは、レイテンシーを増加させパフォーマンスを低下させる可能性のある異常なアプリケーション動作やクエリパターンを明らかにします。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `ReadLatency`, `WriteLatency` | リアクティブ | Average | missing | 読み取り/書き込みディスク I/O の平均時間です。レイテンシーの増加は、ストレージのパフォーマンス問題、リソース競合、または非効率なクエリを示します — 応答時間に直接影響し、タイムアウトエラーのリスクを招きます。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `DBLoad`, `DBLoadCPU`, `DBLoadNonCPU` | プロアクティブ | Average | missing | 低速なクエリを特定するため、特定の SQL 操作の応答時間を追跡します。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `DMLLatency`, `SelectLatency`, `InsertLatency`, `DeleteLatency`, `UpdateLatency` | プロアクティブ | Average | missing | 特定の SQL 操作の応答時間を追跡します。特定の SQL 操作のパフォーマンスを監視するうえで極めて重要です — レイテンシーが高い場合、問題のあるクエリタイプを特定できます。 |
| パフォーマンス | AWS/RDS | `CPUUtilization` | プロアクティブ | Average | breaching | ボトルネックを特定するため、DB インスタンスの処理能力の使用量を監視します。使用率が高い → アプリケーションの応答時間が遅くなり、タイムアウトが発生します。 |
| パフォーマンス | AWS/RDS | `FreeableMemory` | プロアクティブ | Average | breaching | DB インスタンスで利用可能な RAM です。値が低いと過度なディスク I/O（メモリキャッシュではなくディスクからの読み取り）が発生し、レイテンシーが増加して不安定になるリスクがあります。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `FreeLocalStorage` | プロアクティブ | Average | breaching | インスタンスローカルストレージに保存される一時テーブル、ソート操作、トランザクションログに影響します。枯渇すると、Aurora クラスターボリュームに空きがあってもクエリの失敗とパフォーマンス低下を引き起こします。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `VolumeBytesUsed` | プロアクティブ | Average | breaching | Aurora クラスターボリュームは（バージョン固有の上限まで）自動的に拡大・縮小します。利用可能な空き容量が少なくなると、データベースは新しいデータを書き込めなくなります。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `BufferCacheHitRatio` | プロアクティブ | Average | missing | データがバッファキャッシュで見つかる頻度とディスク読み取りの頻度を監視して、メモリ効率を評価します。 |
| カスタマーエクスペリエンス、パフォーマンス | AWS/RDS | `RollbackSegmentHistoryListLength` | リアクティブ | Average | missing | トランザクションのロールバックに必要な UNDO レコードの長さです。値が高い場合、長時間実行トランザクションや大きなバックログを示唆し、パフォーマンスに影響してストレージを消費し、ピーク時のロールバック失敗のリスクを招きます。 |
| パフォーマンス、可用性 | AWS/RDS | `ServerlessDatabaseCapacity` | プロアクティブ | Average | missing | Aurora Serverless v2 クラスターの現在の ACU 使用量です。スロットリングが発生する前にスケーリングの上限を検出するため、最大 ACU 割り当てに近づいた場合にアラームを設定します。 |
| パフォーマンス、可用性 | AWS/RDS | `ACUUtilization` | プロアクティブ | Average | missing | Aurora Serverless v2 で使用中のプロビジョンド ACU キャパシティの割合です。使用率が高い場合、クラスターがスケーリングの上限に近づいていることを示します。 |
| データ鮮度、信頼性 | AWS/RDS | `AuroraGlobalDBReplicationLag` | リアクティブ | Max | breaching | Aurora Global Database のクロスリージョンレプリケーション遅延です。ラグの増加は、ディザスタリカバリの RPO/RTO 目標を脅かします。 |
| データ鮮度、信頼性 | AWS/RDS | `AuroraGlobalDBRPOLag` | リアクティブ | Max | breaching | Aurora Global Database のセカンダリリージョンにおける推定 RPO ギャップ（損失のリスクがあるデータ）です。DR 目標が達成可能な状態を維持するためにアラームを設定します。 |

##### CloudWatch Database Insights

[Amazon CloudWatch Database Insights](/solutions/rds-aurora-monitoring/) は、Amazon Aurora と RDS のための統合されたデータベース中心のオブザーバビリティエクスペリエンスです。Performance Insights と Enhanced Monitoring を基盤とし、**DB Load** — データベース内のアクティブセッションの平均数（AAS）— を中心に据え、SQL、待機イベント、ホスト、ユーザー、アプリケーションでスライスします。Aurora ではクラスター全体のフリートヘルスビューが追加され、Aurora PostgreSQL では計画のリグレッションを検出するための**ロック分析**（ブロッキングセッションツリー）と**実行計画分析**が追加されます。

インシデント検出において、Database Insights は上記の基本的な `AWS/RDS` メトリクスでは得られない 2 つのシグナルを可視化します。**コンピューティングキャパシティに対するデータベースの飽和**（`DBLoad` vs. vCPU、Serverless v2 の場合は ACU）と、**負荷がどこで待機しているか**（CPU vs. I/O vs. ロック競合）です。

###### 推奨：有効にする

- **標準モードは追加料金なしでデフォルトで有効です** — 7 日間の保持期間での DB Load 分析のため、有効になっていること（CloudWatch → Database Insights）を確認してください。
- **本番クラスターでは Advanced モードを有効にしてください。** Advanced モードでは、クロスアカウント/クロスリージョンのフリートヘルスビュー、15 か月の保持期間、OS プロセス分析、**ロック分析と実行計画分析（Aurora PostgreSQL）**、スロー SQL 分析、Application Signals の「呼び出し元サービス」の相関付け、そしてエンジンレベルのアラーム設定のための **Performance Insights カウンターメトリクスの CloudWatch への自動インポート**が追加されます。15 か月（≥ 465 日）の保持期間を設定した Performance Insights が必要で、vCPU 時間（プロビジョンド）または **ACU 時間（Aurora Serverless v2）**単位で課金されます。Enhanced Monitoring と CloudWatch Logs は別途課金されます。
- Advanced モードを有効にしても、**ダウンタイムは発生しません**。Aurora では**クラスターレベル**で設定されます — RDS はクラスター内のすべてのインスタンスで Database Insights を有効にし、すべてのインスタンスが同じ Performance Insights と Enhanced Monitoring の設定を共有する必要があります。

```bash
# Enable Advanced mode of Database Insights on an existing Aurora cluster (no downtime)
aws rds modify-db-cluster \
    --db-cluster-identifier <your-aurora-cluster> \
    --database-insights-mode advanced \
    --enable-performance-insights \
    --performance-insights-retention-period 465
```

Database Insights のセットアップについては [RDS & Aurora モニタリング](/solutions/rds-aurora-monitoring/) を、モード、Aurora エンジンのサポート、制限事項、フリートまたはクロスアカウント構成については [AWS ドキュメント](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Monitoring.html) を参照してください。

###### アラームを設定すべき推奨 Database Insights メトリクス

Performance Insights / Database Insights を有効にすると `AWS/RDS` 名前空間に公開されます。`DBLoad*` メトリクスは平均アクティブセッション数（AAS）で表されます。アクション可能なしきい値は**インスタンスの vCPU 数に対する相対値**（Serverless v2 の場合はプロビジョンド ACU）です。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| パフォーマンス、信頼性 | `AWS/RDS` | `DBLoad` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; Threshold ≈ number of vCPUs (or metric math `DBLoad / vCPUs ≥ 1`; for Serverless v2 compare against max ACUs); TreatMissingData = notBreaching | Database Insights の中核シグナル — 平均アクティブセッション数です。`DBLoad` が vCPU/ACU キャパシティ以上で持続している場合、セッションがキューイングされてデータベースが過負荷になっていることを意味します。 |
| パフォーマンス | `AWS/RDS` | `DBLoadCPU` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU 上で実行されているセッションによる DB Load の割合です。vCPU/ACU 数に向かって推移している場合、CPU の飽和を示します（スケールアップまたはクエリのチューニング）。 |
| パフォーマンス、レイテンシー | `AWS/RDS` | `DBLoadNonCPU` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU 以外のリソース（I/O、バッファ、**ロック**）を待機している DB Load の割合です。Aurora PostgreSQL で `DBLoadNonCPU` が上昇している場合、I/O またはロック競合を示します — Database Insights の待機イベントビューとロック分析ビューを詳しく調べてください。 |

> **Advanced モードのみ：** Advanced モードを有効にすると、Performance Insights の**カウンターメトリクス**（エンジン `db.*` カウンターと OS の `os.*` メトリクス）が CloudWatch に自動インポートされ、エンジン内部にアラームを設定できるようになります。ロック/実行計画の分析には Aurora PostgreSQL が必要です（計画には `aurora_compute_plan_id = on` が必要）。スロー SQL 分析にはデータベースログの CloudWatch Logs へのエクスポートが必要です。

##### 追加メモ

- **Aurora Serverless v2 と I/O-Optimized：** **Serverless v2** では、ホストの `CPUUtilization`/`FreeableMemory` は `ServerlessDatabaseCapacity` や `ACUUtilization`（上記のテーブルに記載）よりも意味が薄くなります。**Aurora I/O-Optimized** クラスターでは `ReadIOPS`/`WriteIOPS` のコストと挙動が異なるため、レイテンシーと `DBLoad` に注目してください。
- **CloudWatch Database Insights + `DBLoad` が現代のゴールデンシグナル：** `DBLoad`（平均アクティブセッション数）は、最もアクション可能なプロアクティブな DB 健全性メトリクスです。vCPU/ACU 数に対する `DBLoad` にアラームを設定し、[CloudWatch Database Insights](#cloudwatch-database-insights)（Performance Insights コンソールの統合された後継）を使用して上位の SQL、待機イベント、そして — Aurora PostgreSQL では — ブロッキングロックと計画のリグレッションを見つけてください。
- **Blue/Green とフェイルオーバー：** トポロジー変更をより早くインシデント検出で把握するため、`FailoverState`/ライターロールの変更と Blue/Green スイッチオーバーイベントにアラームを設定してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Aurora のメトリクスはネイティブの `AWS/RDS` です。アプリケーションの DB クライアントを ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装し、`SelectLatency`/`DBLoad` のスパイクをアプリケーションスパンやコネクションプールの枯渇と相関付けてください。


#### DynamoDB & DAX

**Amazon DynamoDB** と **DynamoDB Accelerator (DAX)** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [DynamoDB の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#DynamoDB)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | AWS/DynamoDB | `SystemErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 対象期間中に DynamoDB または DynamoDB Streams から返された HTTP 500 レスポンスです。500 は通常、内部サーバーエラーを意味します。発生状況を分析することで、システムの安定性とリクエスト処理を改善する機会が明らかになります。 |
| 信頼性、レイテンシー | AWS/DynamoDB | `ReadThrottleEvents` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | テーブルまたは GSI のプロビジョンド読み取りキャパシティを超えたリクエストを示します。しきい値の超過は、ワークロードに対するプロビジョニング不足やクライアントリクエストの異常なスパイクを意味する可能性があります。キャパシティのスケーリングやパターンの最適化によってスロットリングを削減できます。スロットリングが継続すると、レイテンシーやユーザーに見えるエラーが増加する可能性があります。 |
| 信頼性、レイテンシー | AWS/DynamoDB | `WriteThrottleEvents` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | テーブルまたは GSI のプロビジョンド書き込みキャパシティを超えたリクエストを示します。トラフィックや書き込みパターンに対するプロビジョニング不足を意味します。書き込みキャパシティのスケーリングやパターンの最適化で修復し、クライアント側の異常な急増を調査してください。プロアクティブな監視により、スロットリングエラーとパフォーマンス低下を回避できます。 |
| 信頼性、レイテンシー | AWS/DynamoDB | `SuccessfulRequestLatency` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | DynamoDB/DynamoDB Streams への成功したリクエストのレイテンシーです。レイテンシーが高い場合、プロビジョンドスループットの不足、非効率なクエリ、または対処すべきアプリケーションレベルの問題を示している可能性があります。 |
| 信頼性、レイテンシー | AWS/DynamoDB | `ReplicationLatency` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | （グローバルテーブル）更新された項目がソースレプリカのストリームに現れてから別のレプリカに現れるまでの経過時間です。レイテンシーが高い場合、ネットワーク輻輳、クロスリージョン接続の問題、またはレプリケーション遅延を引き起こす過大な書き込み/更新ワークロードを示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DAX | `FaultRequestCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ノードまたはクラスターから報告された HTTP 500（サーバーエラー）となったリクエストです。ゼロ以外の値は通常、DAX クラスターの健全性/運用に潜在的な問題があることを示します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DAX | `ErrorRequestCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | スロットリングされたリクエストを含む、HTTP 400（クライアントエラー）となったリクエストです。カウントが高い場合、アプリケーションとのやり取りの問題、権限の誤設定、または DAX クラスター内の問題を示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DAX | `FailedRequestCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ノードまたはクラスターから報告されたエラーとなったリクエストです。カウントが高い場合、アプリケーションロジックの問題、権限の誤設定、または DynamoDB テーブルやサービスの問題を示している可能性があります。 |
| 信頼性、レイテンシー | AWS/DAX | `ThrottledRequestCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | プロビジョンドスループットの上限に達したことにより、ノードまたはクラスターでスロットリングされたリクエストです。カウントが高い場合、ワークロードがプロビジョンドキャパシティを超過し、パフォーマンスの低下や中断を引き起こす可能性があることを示します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DynamoDB | `ThrottledRequests` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | DynamoDB によってスロットリングされたリクエストの総数です。すべての操作にわたるスロットリングをリクエストレベルで把握できます — オンデマンドモードとプロビジョンドモードのどちらでも有用です。 |
| 信頼性 | AWS/DynamoDB | `AccountMaxTableLevelReads` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 消費されたテーブルレベルの読み取りスループット上限の割合です。個々のテーブルメトリクスでは表面化しないアカウントレベルのスロットリングを捉えるためにアラームを設定します。 |
| 信頼性 | AWS/DynamoDB | `AccountMaxTableLevelWrites` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 消費されたテーブルレベルの書き込みスループット上限の割合です。個々のテーブルメトリクスでは表面化しないアカウントレベルのスロットリングを捉えるためにアラームを設定します。 |
| 信頼性 | AWS/DynamoDB | `AccountProvisionedReadCapacityUtilization` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 消費されたアカウントレベルのプロビジョンド読み取りキャパシティの割合です。アカウント全体のプロビジョンドキャパシティ上限への接近を検出するためにアラームを設定します。 |
| 信頼性 | AWS/DynamoDB | `OnlineIndexThrottleEvents` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | GSI バックフィル中のスロットルイベントです。カウントが高い場合、インデックス構築が本番トラフィックとキャパシティを競合していることを示します。 |

##### 追加メモ

- **オンデマンドキャパシティによってスロットリングの事情が変わります：** 現在、多くのテーブルは**オンデマンド**モードで稼働しており、スロットリングはプロビジョンド RCU/WCU ではなく、テーブルレベルの 1 秒あたりの上限とウォームスループット設定によって制御されます。オンデマンドテーブルでは、プロビジョンドの上限を前提とするのではなく、`ThrottledRequests`/`ReadThrottleEvents`/`WriteThrottleEvents` に加えて `AccountMaxTableLevelReads/Writes` と `OnlineIndexThrottleEvents`（上記のテーブルに記載）にアラームを設定してください。
- **`ThrottledRequests` と `*ThrottleEvents` の違い：** `ThrottledRequests`（Sum）はリクエストレベルのビューを提供します。`ReadThrottleEvents`/`WriteThrottleEvents` はイベントごとにスロットルをカウントします。動的なしきい値には、`ConsumedReadCapacityUnits`/消費された書き込みに対する比率を使用してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** `AWS/DynamoDB`/`AWS/DAX` のメトリクスはネイティブのままです。アプリケーションの DynamoDB SDK 呼び出しを ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装し、`SuccessfulRequestLatency` のスパイクをクライアント側のスパン、リトライ、ホットパーティションのパターンと CloudWatch で相関付けてください。
- **Contributor Insights：** スロットリングの背後にあるホットキー/パーティションを特定するため、**DynamoDB 用 CloudWatch Contributor Insights** を有効にしてください — 集約されたスロットル数よりもはるかにアクション可能なインシデント検出シグナルです。


#### ElastiCache

**Amazon ElastiCache** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [ElastiCache の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | ElastiCache | AWS/ElastiCache | `FreeableMemory` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 解放可能メモリの低下を監視するのに役立ちます。これはデータベース接続の急増や、インスタンスが高いメモリ圧迫を受けていることを意味する可能性があります。 |
| 信頼性 | ElastiCache | AWS/ElastiCache | `DatabaseMemoryUsagePercentage` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クラスターのメモリ使用率です。Redis OSS のみに適用されます（Memcached には適用されません）。 |
| 信頼性 | ElastiCache | AWS/ElastiCache | `CurrConnections` | プロアクティブ | Statistic = Max; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | リードレプリカからの接続を除いたクライアント接続数です。Redis OSS のみに適用されます（Memcached には適用されません）。 |
| 信頼性 | ElastiCache | AWS/ElastiCache | `EngineCPUUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Redis エンジンスレッドの CPU 使用率です。Redis はシングルスレッドであるため — 4 つ以上の vCPU を持つノードでは `EngineCPUUtilization` を監視するのがベストプラクティスです。 |
| 信頼性 | ElastiCache | AWS/ElastiCache | `CPUUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ホストの CPU 使用率です。vCPU が 2 つ以下の小さなノードでは、クラスターのワークロードを監視するために `CPUUtilization` を使用してください。 |
| 信頼性、パフォーマンス | ElastiCache | AWS/ElastiCache | `Evictions` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | メモリ圧迫により、有効期限切れでない項目がエビクションされた数です。エビクションの増加は、ワーキングセットに対してキャッシュが小さすぎることを示し、キャッシュミスとバックエンド負荷の増加を引き起こします。 |
| 信頼性、データ鮮度 | ElastiCache | AWS/ElastiCache | `ReplicationLag` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | プライマリノードとリードレプリカ間の遅延（秒）です。ラグの増加はレプリカの遅れを示し、古い読み取りとフェイルオーバー時のデータ損失のリスクを招きます。 |
| カスタマーエクスペリエンス、パフォーマンス | ElastiCache | AWS/ElastiCache | `CacheHitRate` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | キー参照が成功した割合です。ヒット率の低下はワーキングセットの変化やエビクション圧迫を示し、バックエンドのレイテンシーを増加させます。 |
| カスタマーエクスペリエンス、パフォーマンス | ElastiCache | AWS/ElastiCache | `CacheMisses` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | キー参照が失敗した数です。ミスが持続的に高い状態は、バッキングデータストアに過剰な負荷をかけ、応答時間を増加させます。 |
| 信頼性 | ElastiCache | AWS/ElastiCache | `SwapUsage` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 使用中のスワップ領域の量です。キャッシュノードでスワップがゼロ以外の場合、パフォーマンスを低下させる深刻なメモリ圧迫を示します。 |
| 信頼性 | ElastiCache Serverless | AWS/ElastiCache | `ElastiCacheProcessingUnits` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ElastiCache Serverless キャッシュの ECPU 消費量です。サーバーレスモードでキャパシティやコストのしきい値への接近を検出するためにアラームを設定します。 |

##### 追加メモ

- **Valkey とサーバーレス：** ElastiCache は現在、（Redis OSS と Memcached に加えて）**Valkey** と**サーバーレス**の提供をサポートしています。**ElastiCache Serverless** ではキャパシティが自動管理されます — ホストの `CPUUtilization`/`FreeableMemory` ではなく `ElastiCacheProcessingUnits`（上記のテーブルに記載）と `DataStored` にアラームを設定してください。
- **`FreeableMemory` の統計：** ノードベースのクラスターでは、`FreeableMemory` は絶対バイト数のしきい値に対して **Minimum** または **Average**（Sum ではなく）でアラームを設定するのが最適です。エビクションや OOM を先回りして防ぐため、`SwapUsage` と `DatabaseMemoryUsagePercentage` と併せてゼロに向かう推移を監視してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** ElastiCache のエンジンメトリクスはネイティブの `AWS/ElastiCache` のままです。接続や CPU のスパイクを呼び出し元サービスと相関付けるため、クライアントアプリケーションを ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装してください。
- **異常検知：** 日次のトラフィックサイクルを持つワークロードでは、接続数と CPU は異常検知バンドに適しています。


#### Redshift

Amazon Redshift は、大規模なデータ分析とビジネスインテリジェンスのワークロードに使用される、フルマネージドでペタバイト規模のクラウドデータウェアハウスサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | Redshift | `AWS/Redshift` | `DatabaseConnections` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | このメトリクスは、クラスターへのデータベース接続数を監視します。 |
| 信頼性、レイテンシー | Redshift | `AWS/Redshift` | `HealthStatus` | プロアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | クラスターの健全性を示します。クラスターは 1 分ごとに自身のデータベースに接続し、単純なクエリを実行します。この操作が正常に実行できる場合、クラスターは健全とみなされます。そうでない場合、クラスターは不健全です。クラスターのデータベースに極端に高い負荷がかかっている場合や、クラスター上のデータベースに構成上の問題がある場合に不健全な状態が発生することがあります。これは問題を迅速に特定して対応するために極めて重要であり、ダウンタイムの最小化に役立ちます。1 は健全を示し、0 は不健全を示します。 |
| 信頼性、レイテンシー | Redshift | `AWS/Redshift` | `PercentageDiskSpaceUsed` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | 使用中のディスクスペースの割合です。しきい値は最大ストレージ容量の約 95% に設定することを検討してください。 |
| レイテンシー | Redshift | `AWS/Redshift` | `ReadLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ディスク読み取り I/O 操作にかかった平均時間です。読み取りレイテンシーが高い場合、低速なクエリやリソース競合などのパフォーマンス問題を示している可能性があり、アプリケーション全体のパフォーマンスと応答性に影響を与えます。 |
| レイテンシー | Redshift | `AWS/Redshift` | `WriteLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ディスク書き込み I/O 操作にかかった平均時間です。書き込みレイテンシーが高い場合、低速なクエリやリソース競合などのパフォーマンス問題を示している可能性があり、アプリケーション全体のパフォーマンスと応答性に影響を与えます。 |
| レイテンシー、パフォーマンス | Redshift | `AWS/Redshift` | `QueryDuration` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クエリ完了までの平均時間です。持続的に高い値は、複雑なクエリ、リソース競合、またはユーザーに見えるレイテンシーに影響するクラスターキャパシティの不足を示します。 |
| レイテンシー、パフォーマンス | Redshift | `AWS/Redshift` | `QueryRuntimeBreakdown` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 計画、待機、実行の各ステージにわたるクエリ実行時間の内訳です。レイテンシーの原因がキューイング、コンパイル、実際のデータ処理のいずれにあるのかを特定するのに役立ちます。 |
| レイテンシー、パフォーマンス | Redshift | `AWS/Redshift` | `WLMQueueWaitTime` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 実行前にクエリが WLM キューで待機する時間です。待機時間が長い場合、キューの競合と、同時実行数または WLM 構成を調整する必要性を示します。 |
| 信頼性、パフォーマンス | Redshift | `AWS/Redshift` | `ConcurrencyScalingSeconds` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Concurrency Scaling によって消費されたバーストキャパシティの秒数です。スケーリング活動が持続している場合、プライマリクラスターのサイズが不足している可能性を示し、バースト使用のコストを追跡できます。 |
| 信頼性、パフォーマンス | Redshift Serverless | `AWS/Redshift-Serverless` | `ComputeSeconds` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Redshift Serverless のワークロードが消費したコンピューティングキャパシティです。キャパシティのスパイクや予期しないコスト増加を検出するためにアラームを設定します。 |
| レイテンシー、パフォーマンス | Redshift Serverless | `AWS/Redshift-Serverless` | `QueriesCompletedPerSecond` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Redshift Serverless で完了したクエリのレートです。低下した場合、キューイング、スロットリング、またはパフォーマンス低下を示している可能性があります。 |

##### 追加メモ

- **レイテンシーメトリクスの異常検知：** 静的なしきい値ではなく、`ReadLatency` と `WriteLatency` に CloudWatch 異常検知バンドを使用することを検討してください — クエリパターンは時間帯やバッチスケジュールのサイクルに従うことが多く、固定しきい値ではノイズが多すぎるか緩すぎるかのいずれかになります。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Redshift にクエリを実行するアプリケーションは、CloudWatch エージェント経由でクライアント側のクエリレイテンシーとコネクションプールのメトリクスをカスタム CloudWatch 名前空間（例：`MyApp/Redshift`）にエクスポートでき、サーバー側の `AWS/Redshift` メトリクスを補完する呼び出し元側の可視性を提供します。
- **CloudWatch Application Signals：** Redshift に依存する ETL または分析サービスでは、`ApplicationSignals` 名前空間の Application Signals SLO バーンレートアラームが、データパイプライン全体にわたる持続的な劣化パターンを検出できます。


#### DMS

**AWS Database Migration Service (DMS)** のインシデント検出用の推奨 CloudWatch アラームです。すべてのアラームは **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = Breaching** を使用します。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CPUUtilization` | プロアクティブ | Maximum | CPU が高い場合、インスタンスのサイズ不足またはタスク構成の問題を示します。CPU 使用量は、変換の処理、ソースからの読み取り、ターゲットへの書き込みを行うレプリケーションインスタンスの能力に直接影響します — リソース枯渇によるパフォーマンス低下とタスク障害を防ぎます。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `FreeStorageSpace` | プロアクティブ | Sum | レプリケーションインスタンスのストレージがキャパシティの 90% に達すると、CDC の継続的な変更が一時停止され、レプリケーションタスクが完全に停止する可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CDCLatencySource` | プロアクティブ | Maximum | ソースレイテンシーが高い場合、DMS の変更読み取りが遅れていることを示し、データの不整合につながる可能性があります。また、DMS が処理する前にソースログがパージされると、データ損失のリスクが高まります。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CDCLatencyTarget` | プロアクティブ | Maximum | ターゲットレイテンシーが高い場合、適用プロセスのボトルネック（インデックスの欠落、データベースロック、ターゲットリソースの不足）を示します。ニアリアルタイムのレプリケーションとデータ整合性を確保するために極めて重要です。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CDCIncomingChanges` | プロアクティブ | Sum | ターゲットへの適用を待っている変更イベントの数です。バックログの増加は、ターゲットがソースの変更に追いつけていないことを示し、レプリケーションのドリフトのリスクを招きます。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CDCChangesMemorySource` | リアクティブ | Maximum | ソースから読み取った変更をバッファリングするために消費されたメモリです。値が高い場合、大きなトランザクション量や、レプリケーションインスタンスに対する LOB 処理の圧迫を示します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/DMS | `CDCChangesMemoryTarget` | リアクティブ | Maximum | ターゲットへの適用を待っている変更をバッファリングするために消費されたメモリです。値の上昇は、ターゲット側のボトルネックや適用スループットの低下を示します。 |
| パフォーマンス、信頼性 | AWS/DMS | `FullLoadThroughputRowsSource` | プロアクティブ | Average | フルロード移行中にソースから読み取られた 1 秒あたりの行数です。移行の進捗を追跡し、カットオーバーウィンドウ中のソース読み取りのボトルネックを検出するために監視します。 |
| パフォーマンス、信頼性 | AWS/DMS | `FullLoadThroughputRowsTarget` | プロアクティブ | Average | フルロード移行中にターゲットへ書き込まれた 1 秒あたりの行数です。移行の進捗を追跡し、カットオーバーウィンドウ中のターゲット書き込みのボトルネックを検出するために監視します。 |
| 信頼性 | AWS/DMS | `CapacityUtilization` | プロアクティブ | Average | 使用中のサーバーレスレプリケーションキャパシティの割合です（DMS Serverless のみ）。インスタンスレベルのメトリクスが適用できない場合に、キャパシティ上限への接近を検出するためにアラームを設定します。 |

##### 追加メモ

- **DMS Serverless：** **DMS Serverless** ではキャパシティが DCU 単位で自動管理されます — サーバーレスレプリケーションには適用されないインスタンスの `CPUUtilization`/`FreeStorageSpace` ではなく、`CapacityUtilization`（上記のテーブルに記載）にアラームを設定してください。
- **タスクレベルの障害シグナル：** テーブルのメトリクスに加えて、DMS のタスク状態 CloudWatch Events（タスクの失敗/停止）を構成し、リソース圧迫だけでなく実際のタスク障害についてもレスポンダーに通知されるようにしてください。
- **CDC レイテンシーが中核の SLO であり続けます：** `CDCLatencySource`/`CDCLatencyTarget` が適切な主要シグナルです。ソースログのパージリスクを伴うソースレイテンシーの増加は、最も重大度の高い DMS のインシデントパターンです。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** DMS はネイティブの `AWS/DMS` メトリクスを出力します。レイテンシーのスパイクをソースの負荷やターゲットのロックと相関付けるため、ソース/ターゲットのデータベースクライアントとオーケストレーション用の Lambda で ADOT SDK（CloudWatch エージェントに OTLP を送信）を使用してください。
- **`TreatMissingData = Breaching`：** メトリクスが欠落している場合は通常レプリケーションインスタンス/タスクがダウンしていることを意味するため、ここでは適切です — まさにインシデント検出が捉えなければならない状態です。


#### OpenSearch

Amazon OpenSearch Service は、ログ分析、全文検索、アプリケーション監視に使用されるマネージド検索・分析エンジンです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `ClusterStatus.red` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ClusterStatus.red メトリクスは、OpenSearch クラスターの健全性を監視します。値が 1 の場合、少なくとも 1 つのプライマリシャードとそのすべてのレプリカシャードがデータ操作に利用できないことを示します。このステータスは、一部のデータにアクセスできないという重大な状態を表します。 |
| カスタマーエクスペリエンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `FreeStorageSpace` | プロアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | FreeStorageSpace メトリクスは、OpenSearch クラスターのノード全体で利用可能なディスクスペースを監視します。しきい値はノードの総ストレージ容量の約 25% に設定することが推奨されます。 |
| カスタマーエクスペリエンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `ClusterIndexWritesBlocked` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ClusterIndexWritesBlocked メトリクスは、OpenSearch クラスターが書き込み操作を処理する能力を監視します。値が 0 の場合、クラスターがリクエストを受け付けていることを意味します。値が 1 の場合、リクエストをブロックしていることを意味します。これは、データの変更がクラスターによって拒否されるという運用上の影響を表します。 |
| カスタマーエクスペリエンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `ClusterStatus.yellow` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 値が 1 の場合、少なくとも 1 つのレプリカシャードが未割り当てであることを示します。クラスターは引き続き機能していますが、冗長性が低下しています — 続いてノード障害が発生するとデータ損失につながる可能性があります。 |
| パフォーマンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `CPUUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | データノード全体で使用中の CPU リソースの割合です。使用率が持続的に高い状態は、検索とインデックス作成のパフォーマンスを低下させます。 |
| パフォーマンス、信頼性 | OpenSearch | `ES/OpenSearchService` | `JVMMemoryPressure` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | データノード全体で使用中の Java ヒープの割合です。80% を超えると長い GC 停止のリスクがあり、92% を超えるとメモリ不足によるノード障害を引き起こす可能性があります。 |
| 信頼性 | OpenSearch | `ES/OpenSearchService` | `AutomatedSnapshotFailure` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 値が 1 の場合、自動スナップショットが失敗したことを示します。バックアップの欠落は、障害発生時のデータ損失リスクを高めます。 |
| 信頼性、セキュリティ | OpenSearch | `ES/OpenSearchService` | `KMSKeyError` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 値が 1 の場合、保管中のデータを暗号化するために使用されている KMS 暗号化キーが無効になっていることを示します。通常の運用を復旧するには、キーを再度有効にしてください。 |
| 信頼性、セキュリティ | OpenSearch | `ES/OpenSearchService` | `KMSKeyInaccessible` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 値が 1 の場合、KMS キーにアクセスできない（削除された、または許可が取り消された）ことを示します。7 日以内に解決しないと、ドメインが恒久的にロックされるリスクがあります。 |
| 信頼性 | OpenSearch | `ES/OpenSearchService` | `WarmFreeStorageSpace` | プロアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | UltraWarm ノードの空きストレージ容量です。値が低いと、ホットストレージからの移行がブロックされ、ウォーム階層のクエリが低下する可能性があります。 |
| 信頼性 | OpenSearch | `ES/OpenSearchService` | `WarmToColdMigrationFailureCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | UltraWarm からコールドストレージへの移行が失敗した回数です。失敗すると、ウォームノードでストレージが積み上がり、ライフサイクルポリシーが破綻する可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | OpenSearch Serverless | `AWS/AOSS` | `SearchRequestErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | OpenSearch Serverless コレクションに対する検索リクエストのエラーです。ゼロ以外の値は、ユーザーに影響するクエリ障害を示します。 |
| カスタマーエクスペリエンス、信頼性 | OpenSearch Serverless | `AWS/AOSS` | `IndexingRequestErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | OpenSearch Serverless コレクションに対するインデックス作成リクエストのエラーです。ゼロ以外の値は、データ取り込みの障害を示します。 |

##### 追加メモ

- **静的なしきい値より異常検知：** 固定しきい値ではなく、`FreeStorageSpace` と `JVMMemoryPressure` に CloudWatch 異常検知バンドを使用することを検討してください — ベースラインのストレージ消費量は、インデックスのライフサイクルポリシーや取り込みパターンによって変動します。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** OpenSearch にクエリを実行するアプリケーションを計装している場合、CloudWatch エージェントはクライアント側のレイテンシーとエラーのメトリクスを、カスタム名前空間（例：`MyApp/OpenSearch`）配下の CloudWatch にエクスポートできます。これらは、サーバー側の `ES/OpenSearchService` メトリクスを呼び出し元視点のオブザーバビリティで補完します。
- **CloudWatch Application Signals：** OpenSearch のフロントに立つサービス（例：検索 API）では、Application Signals が `ApplicationSignals` 名前空間で SLO バーンレートアラームを提供でき、個々のメトリクスのしきい値が発火する前に持続的な劣化を検出できます。
- **OpenSearch Serverless：** OpenSearch Serverless コレクションを使用する場合、名前空間は `AWS/AOSS` に変わります — サーバーレスメトリクス（上記のテーブルに記載）はマネージドドメインのメトリクスとは別物です。


### ネットワーキングとコンテンツ配信

#### API Gateway

チームがインシデント検出に適したアラームを作成する際の出発点として使用できる、**Amazon API Gateway** の推奨 CloudWatch アラームです。AWS は [API Gateway の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ApiGateway)も公開しています。

> 一般的なガイドラインです。最終的なアラームの選択、しきい値、設定は、ご自身の環境、ワークロード、運用上のニーズに合わせて調整してください。すべての問題の検出を保証するものではありません。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | AWS/ApiGateway | `5XXError` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | HTTP 5xx サーバーエラーの異常な発生を検出して、API リクエストのエラー率を監視します。一貫したトラフィックを持つ定常状態の API 向けに設定されており、バグや問題を示す予期しないスパイクにアラートを発し、原因の特定や検証の調査を支援します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/ApiGateway | `(m1/m2)*100`（`m1 = 5XXError`、`m2 = Count`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 5xx エラーの総リクエスト数に対する比率を計算するメトリクス数式です。比率を使用することで、静的なしきい値ではなく実際のトラフィックに基づく動的なしきい値設定が可能になります — 変動する、または予測できないリクエスト量に推奨されます。 |
| カスタマーエクスペリエンス、レイテンシー | AWS/ApiGateway | `Latency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | レスポンスタイムの監視により、エンドユーザーエクスペリエンスとダウンストリームサービスのパフォーマンスに関する洞察が得られます。基盤となるインフラストラクチャとアプリケーションアーキテクチャにおけるレイテンシーの問題をプロアクティブに特定できます。 |
| カスタマーエクスペリエンス、信頼性 | AWS/ApiGateway | `ClientError` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 統合が呼び出される前に API Gateway（WebSocket プロトコル）から 4XX レスポンスが返されたリクエスト数を監視します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/ApiGateway | `IntegrationError` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 統合（WebSocket プロトコル）から 4XX/5XX レスポンスが返されるリクエスト数を監視します。 |
| カスタマーエクスペリエンス、信頼性 | AWS/ApiGateway | `ExecutionError` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 統合（WebSocket プロトコル）を呼び出す際に発生したエラーを監視します。 |
| カスタマーエクスペリエンス、レイテンシー | AWS/ApiGateway | `IntegrationLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | API Gateway がバックエンドにリクエストを転送してからレスポンスを受信するまでの時間を測定します。バックエンド統合のパフォーマンスを把握し、潜在的なボトルネックを調査するのに役立ちます。 |

> **メトリクス `4XXError` / `Count` に関する注意：** WebSocket の `ClientError`/`IntegrationError` に相当する REST/HTTP API のメトリクスは `4XXError` と `Count` です。上記の `5XXError` 比率と同じ方法で `4XXError` の比率アラームを検討してください。

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** API Gateway 自体は上記の `AWS/ApiGateway` メトリクスを引き続きネイティブに発行するため、それらにアラームを設定するために OTEL の変更は必要ありません。ただし、**バックエンド統合**（Lambda、コンテナ、EC2）を CloudWatch エージェント（OTLP エンドポイント）で計装すれば、`IntegrationLatency` のスパイクを CloudWatch のバックエンドのスパン/トレースと相関付けられるようになります。OTEL メトリクスは**お客様が定義するカスタム名前空間**（`AWS/*` ではない）に配置されるため、それらに対するインシデント検出アラームはその名前空間とそのディメンションを対象にする必要があります。
- **CloudWatch Application Signals（2024 年 GA）：** アプリケーションのフロントとなる API では、Application Signals を有効にすることで、標準化されたゴールデンシグナルメトリクス（レイテンシー、エラー率、リクエスト量、障害）と `ApplicationSignals` 名前空間の **SLO バーンレートアラーム**が得られます。バーンレートアラームは顧客向けの目標に直接結び付いているため、生の `5XXError` カウントよりもインシデント検出においてアクション可能な場合が多くあります。
- **異常検知：** トラフィックが変動する API では、静的なしきい値ではなく `Latency`/`Count`（または `5XXError` 比率）に対する **CloudWatch 異常検知バンド**を優先してください — これにより、実際のリグレッションを捕捉しつつ、トラフィック変動時の誤ったページングを削減できます。
- **拡張/高解像度メトリクス：** 1 秒の高解像度アラームは、レイテンシーに非常に敏感な API に限って検討してください。本記事の `DatapointsToAlarm = 5` を伴う 60 秒の期間（約 5 分間のしきい値超過）は、フラッピングを避けつつインシデント検出を行うための適切なバランスを維持しています。


#### Elastic Load Balancing (ALB/NLB)

顧客に影響するインシデントを検出するための、**Application Load Balancer (ALB)** と **Network Load Balancer (NLB)** の推奨 CloudWatch アラームです。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。`m*` はメトリクス数式のソースメトリクスを指します。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `HTTPCode_ELB_5XX_Count` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ロードバランサー自体が返した 5xx サーバーエラーコードの数です。増加はロードバランサーまたはバックエンドインスタンスの問題を示す可能性があり、理想的な値は低い状態です。上昇傾向にプロアクティブに対処することで可用性の維持に役立ちます。 |
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `HTTPCode_Target_5XX_Count` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | バックエンドターゲットが返した HTTP 5xx ステータスコードの数です。総リクエスト量の文脈で評価してください。バックエンドのアプリケーションスタックの健全性を評価するには、傾向分析とトラフィックに対する 5xx の**率**のほうがより有意義です。 |
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `((m1+m2)/m3)*100`（`m1 = HTTPCode_Target_5XX_Count`、`m2 = HTTPCode_Target_4XX_Count`、`m3 = RequestCount`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サーバー（5XX）エラーとクライアント（4XX）エラーの総リクエストに対する比率です。総リクエストで正規化することで、メトリクスがトラフィックの変動に対して堅牢になります。HTTP エラー率が 5% を超えたときにアラームを発火させるには、低いしきい値（例：5）を設定してください。 |
| 信頼性 | Application Load Balancer | AWS/ApplicationELB | `HealthyHostCount` | プロアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | SLO を満たすには、十分な数の正常なバックエンドインスタンスを確保することが不可欠です。健全性のしきい値を超えた際にプロアクティブなアラートを受けることで、迅速な修復が可能になり、パフォーマンス低下のリスクを軽減できます。 |
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `RejectedConnectionCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ロードバランサーが最大キャパシティに達したために拒否された接続数です。値が高い場合、受信リクエストに対応するためにリソースをスケールするか、ロードバランシングを最適化する必要があることを示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `TargetResponseTime` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | リクエストがロードバランサーを離れてからターゲットがレスポンスヘッダーの送信を開始するまでの経過時間（秒）です（アクセスログの `target_processing_time` に相当）。レポート基準：ゼロ以外の値があること。 |
| カスタマーエクスペリエンス、信頼性 | Application Load Balancer | AWS/ApplicationELB | `((m1+m2)/(m1+m2+m3+m4))*100`（`m1 = HTTPCode_Target_5XX_Count`、`m2 = HTTPCode_Target_4XX_Count`、`m3 = HTTPCode_Target_3XX_Count`、`m4 = HTTPCode_Target_2XX_Count`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | すべてのレスポンスクラス（2XX/3XX/4XX/5XX）にわたるターゲットグループの正規化されたエラー率です。ターゲットグループごとの挙動を反映しないロードバランサーレベルのエラー率を補完し、ALB 全体のメトリクスが正常に見える場合でもバックエンドの問題を検出するのに役立ちます。 |
| 信頼性 | Network Load Balancer | AWS/NetworkELB | `HealthyHostCount` | プロアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | SLO を維持するには、十分な数の正常なホストが不可欠です。健全性のしきい値違反に対するプロアクティブなアラートにより、パフォーマンス低下リスクを迅速に修復できます。 |
| 信頼性、セキュリティ、規制コンプライアンス | Network Load Balancer | AWS/NetworkELB | `TargetTLSNegotiationErrorCount` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 暗号化トランスポートのセキュリティとコンプライアンスを維持するための TLS プロトコル異常のオブザーバビリティです。TLS のエラーと警告を可視化して解決することで、セキュアな接続におけるインフラストラクチャまたはアプリケーションの問題を適時に修復できます。 |
| 信頼性 | Network Load Balancer | AWS/NetworkELB | `UnHealthyHostCount` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | NLB が異常と判断したターゲット数です。カウントの増加は、キャパシティを低下させ顧客への影響リスクをもたらすバックエンド障害やヘルスチェックの設定ミスを示します。 |
| 信頼性 | Network Load Balancer | AWS/NetworkELB | `ActiveFlowCount` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | NLB でアクティブな同時 TCP フロー（接続）の総数です。継続的なスパイクは、キャパシティを枯渇させる可能性のあるトラフィックの急増や接続リークの問題を示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | Network Load Balancer | AWS/NetworkELB | `TCP_Target_Reset_Count` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ターゲットからクライアントに送信された TCP RST パケット数です。スパイクはターゲットが接続を強制的に閉じていることを示し、アプリケーションのクラッシュ、リソース枯渇、または keep-alive 設定の誤りを示唆します。 |

##### 追加メモ

- **生のカウントよりもエラー率の比率：** 本記事ではすでにメトリクス数式によるエラー率アラームをモデル化しています — これらを主要なインシデント検出シグナルとして維持してください。平均値はテールレイテンシーのインシデントを隠してしまうため、Average ではなく `TargetResponseTime` の p90/p99 に対する異常検知バンドを検討してください。
- **パーセンタイル統計：** カスタマーエクスペリエンスを正確に反映したレイテンシーシグナルを得るため、`TargetResponseTime` の **p99**（拡張統計）にアラームを設定してください。テールが悪化していても Average は正常に見えることがあります。
- **CloudWatch Application Signals（2024 年 GA）：** ALB をフロントに置くアプリケーションでは、Application Signals が `ApplicationSignals` 名前空間で顧客影響に直接対応する SLO バーンレートアラーム（可用性 + レイテンシー）を提供します — 生の ELB カウントよりも優れたインシデント検出トリガーとなることが多くあります。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** ELB メトリクスはネイティブです。ターゲットを ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装することで、`HTTPCode_Target_5XX` のスパイクを CloudWatch/X-Ray 上で障害が発生しているサービス/依存関係まで追跡できます。


#### CloudFront

**Amazon CloudFront** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [CloudFront の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#CloudFront)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値と設定を調整してください。注意：CloudFront メトリクスは、エッジロケーションに関係なく **米国東部（バージニア北部）`us-east-1`** リージョンに発行されます。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | AWS/CloudFront | `5xxErrorRate` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CloudFront が処理した総リクエストに対する HTTP 5xx サーバーエラーレスポンスの割合です。割合を追跡することで、変動が大きく予測できないトラフィックの中でサーバー側エラーを引き起こすパフォーマンス異常を特定でき、変化する負荷のもとで可用性を維持するためのプロアクティブな診断と修復が可能になります。 |
| カスタマーエクスペリエンス、信頼性 | AWS/CloudFront | `TotalErrorRate` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 総リクエストに対するすべての HTTP エラーレスポンス（4xx + 5xx）の割合です。`5xxErrorRate` 単独よりもクライアントに影響する障害を広範に把握できます。トラフィックが変動する場合は異常検知のアプローチを使用してください。 |
| カスタマーエクスペリエンス、信頼性 | AWS/CloudFront | `4xxErrorRate` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 総リクエストに対する HTTP 4xx クライアントエラーレスポンスの割合です。スパイクは、オリジンの設定ミス、期限切れのコンテンツ、またはエンドユーザーに影響するアクセス制御の問題を示している可能性があります。 |
| カスタマーエクスペリエンス、レイテンシー | AWS/CloudFront | `OriginLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CloudFront がオリジンにリクエストを転送してから、オリジンがレスポンスヘッダーを返し始めるまでの時間（ミリ秒）です。エラー率が上昇する前にバックエンドの劣化を捉える強力なプロアクティブシグナルです。CloudFront の追加メトリクスを有効にする必要があります。 |
| パフォーマンス、信頼性 | AWS/CloudFront | `CacheHitRate` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CloudFront エッジキャッシュから提供されたリクエストの割合です。キャッシュヒット率の低下はオリジンの負荷とレイテンシーを増加させます。劣化を早期に検出することで、顧客に影響が及ぶ前に調査できます。CloudFront の追加メトリクスを有効にする必要があります。 |

##### 追加メモ

- **CloudFront の追加メトリクス（オプトイン）：** `OriginLatency`、`CacheHitRate`、およびステータスコード別のエラー率（`401`/`403`/`404`/`502`/`503`/`504`ErrorRate）にアクセスするには、CloudFront コンソールで **CloudFront の追加メトリクス**を有効にしてください。ステータスコード別の率は、表にある集約メトリクスを超えたきめ細かい可視性を提供します。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** CloudFront のエッジメトリクスはネイティブに発行されます（OTEL は不要）が、**オリジン**（ALB/API Gateway/EC2/コンテナ）を ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装することで、`5xxErrorRate` のスパイクを CloudWatch/X-Ray 上で発生元のティアまで追跡できます。
- **異常検知：** スパイクの多い CDN トラフィックでは、誤ったページングを減らすためにエラー率に対する CloudWatch 異常検知バンドを優先してください。
- **リアルタイムログ / CloudFront Functions：** レイテンシーに敏感なワークロードでは、診断時間を短縮するためにアラームと CloudFront のリアルタイムログを組み合わせてください。


#### Route 53

Amazon Route 53 は、ドメイン登録、DNS ルーティング、ヘルスチェックを実行する、高可用性かつスケーラブルな DNS ウェブサービスです。DNS 解決の信頼性、リゾルバーエンドポイントのキャパシティ、DNSSEC の整合性を確保するため、インシデント検出において Route 53 メトリクスの監視は不可欠です。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | Route 53 | `AWS/Route53` | `HealthCheckStatus` | リアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | HealthCheckStatus により、アプリケーションまたはサービスの健全性をリアルタイムで監視できます。これは問題を迅速に特定して対応するために極めて重要であり、ダウンタイムの最小化に役立ちます。1 は正常、0 は異常を示します。 |
| 信頼性 | Route 53 | `AWS/Route53Resolver` | `EndpointUnhealthyENICount` | リアクティブ | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | AUTO_RECOVERING 状態にある Elastic Network Interface の数です。これは、リゾルバーがエンドポイント（EndpointId で指定）に関連付けられた 1 つ以上の Amazon VPC ネットワークインターフェイスの復旧を試みていることを意味します。復旧プロセス中、エンドポイントは限られたキャパシティで動作し、完全に復旧するまで DNS クエリを処理できません。 |
| 信頼性 | Route 53 | `AWS/Route53` | `DNSSECInternalFailure` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ホストゾーン内のいずれかのオブジェクトが INTERNAL_FAILURE 状態の場合、値は 1 になります。それ以外の場合、値は 0 です。ボリューム：ホストゾーンごとに 4 時間あたり 1 件。リージョン：Route 53 はグローバルサービスです。ホストゾーンのメトリクスを取得するには、リージョンに米国東部（バージニア北部）を指定する必要があります。 |
| 信頼性 | Route 53 | `AWS/Route53Resolver` | `ResolverEndpointCapacityStatus` | リアクティブ | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | リゾルバーエンドポイントのキャパシティステータスです。0 = OK（通常の動作キャパシティ）、1 = Warning（少なくとも 1 つの Elastic Network Interface がキャパシティ使用率 50% を超過）、2 = Critical（少なくとも 1 つの Elastic Network Interface がキャパシティ使用率 75% を超過）。 |
| 信頼性 | Route 53 | `AWS/Route53` | `HealthCheckPercentageHealthy` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | エンドポイントを正常と判断した Route 53 ヘルスチェッカーの割合です。低下時（例：70% 未満）にアラームを設定すると、二値の `HealthCheckStatus` よりも日々のパターンに適応し、想定されるトラフィック変動時の誤報を削減できます。 |
| セキュリティ、信頼性 | Route 53 | `AWS/Route53Resolver` | `FirewallRuleGroupQueryVolume` | プロアクティブ | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Route 53 Resolver DNS Firewall ルールグループが評価した DNS クエリの総数です。急激なスパイクは、設定ミスや調査に値する不審な DNS アクティビティの増加を示している可能性があります。 |
| セキュリティ、信頼性 | Route 53 | `AWS/Route53Resolver` | `BlockedQueries` | リアクティブ | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Route 53 Resolver DNS Firewall ルールによってブロックされた DNS クエリです。ブロックされたクエリのスパイクは、DNS による情報流出の試みや、侵害されたワークロードが悪意のあるルックアップを行っている可能性を示します。 |
| 信頼性 | Route 53 | `AWS/InternetMonitor` | `AvailabilityScore` | プロアクティブ | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | 地域ごとの CloudWatch Internet Monitor の可用性スコアです。スコアが SLO のしきい値を下回った際にアラームを設定することで、リアクティブなヘルスチェックアラームをプロアクティブに補完し、完全な停止に至る前にインターネット経路の問題を検出できます。 |
| 信頼性 | Route 53 | `AWS/Route53` | `DNSSECKeySigningKeysNeedingAction` | リアクティブ | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 1; TreatMissingData = notBreaching | アクション（ローテーションなど）が必要な DNSSEC キー署名キー（KSK）の数です。キーローテーションの期限を逃す前にアラームを設定することで、DNS 解決を妨げる可能性のある DNSSEC 検証の失敗を防げます。 |

##### 追加メモ

- **ヘルスチェックの異常検知**：純粋に静的なしきい値ではなく、`HealthCheckPercentageHealthy` に対する CloudWatch 異常検知バンドの使用を検討してください — これにより通常の日々のパターンに適応し、想定されるトラフィック変動時の誤報を削減できます。
- **Route 53 Resolver クエリログ + CloudWatch Contributor Insights**：クエリログは、トップトーカー分析のために CloudWatch Logs Insights と Contributor Insights に供給できます — これをホストゾーンごとの異常なクエリ量に対するアラームと組み合わせてください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）**：アプリケーションがエンドツーエンドで追跡したい DNS ルックアップを行う場合、CloudWatch エージェントは OTLP エンドポイント経由でカスタムの解決レイテンシーメトリクスを CloudWatch にエクスポートできます。これらはお客様が定義するカスタム名前空間（`AWS/Route53` ではない）に配置され、サーバー側の Route 53 メトリクスと並べてクライアント側の DNS 解決の可視性が得られます。


#### Direct Connect

**AWS Direct Connect** のインシデント検出用の推奨 CloudWatch アラームです。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。`BpsEgress`/`BpsIngress` のしきい値は、通常のベースライントラフィックを基準に設定する必要があります。「低い」しきい値は停止やブラックホールを検出します。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| 信頼性 | AWS/DX | `ConnectionState` | リアクティブ | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | 接続の状態です。1 = up、0 = down。専用接続とホスト型接続で利用できます。 |
| 信頼性 | AWS/DX | `ConnectionErrorCount` | リアクティブ | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | AWS デバイス上のすべての MAC レベルエラー（CRC エラーを含む）の合計エラー数です。最後に報告されたデータポイント以降のエラーをカウントし、インターフェイスエラーがある場合にゼロ以外の値を報告します。 |
| 信頼性 | AWS/DX | `ConnectionBpsEgress` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | 接続の AWS 側からのアウトバウンドデータのビットレート（ビット/秒）です。ネットワークトラフィックの停止を反映するため、しきい値を異常に低い値（例：100 bps）に設定してください。 |
| 信頼性 | AWS/DX | `ConnectionBpsIngress` | リアクティブ | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | 接続の AWS 側からのインバウンドデータのビットレート（ビット/秒）です。ネットワークトラフィックの停止を反映するため、しきい値を異常に低い値（例：100 bps）に設定してください。 |
| 信頼性 | AWS/DX | `VirtualInterfaceBpsEgress` | リアクティブ | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | 仮想インターフェイスの AWS 側からのアウトバウンドデータのビットレート（ビット/秒）です。ネットワークトラフィックの停止を反映するため、しきい値を異常に低い値（例：100 bps）に設定してください。 |
| 信頼性 | AWS/DX | `VirtualInterfaceBpsIngress` | リアクティブ | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | 仮想インターフェイスの AWS 側からのインバウンドデータのビットレート（ビット/秒）です。ネットワークトラフィックの停止を反映するため、しきい値を異常に低い値（例：100 bps）に設定してください。 |
| 信頼性 | AWS/DX | `ConnectionLightLevelTx` | プロアクティブ | Statistic = Minimum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | 接続の AWS 側の光送信レベル（dBm）です。完全なダウンに至る前に物理層の劣化をプロアクティブに検出するため、光レベルが許容しきい値を下回った場合にアラームを設定してください。 |
| 信頼性 | AWS/DX | `ConnectionLightLevelRx` | プロアクティブ | Statistic = Minimum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | 接続の AWS 側の光受信レベル（dBm）です。完全なダウンに至る前に物理層の劣化をプロアクティブに検出するため、光レベルが許容しきい値を下回った場合にアラームを設定してください。 |

##### 追加メモ

- **冗長性を考慮したアラーム：** 耐障害性のある設計（2 本の DX 接続、または DX + Site-to-Site VPN バックアップ）では、*すべての*冗長な `ConnectionState` メトリクスがダウンした場合にのみ発火する**コンポジットアラーム**を構築してください。これにより、単一リンクのメンテナンスイベントではなく、真の接続喪失時にレスポンダーにページングされます。
- **ビットレートの異常検知：** 固定の「100 bps」の下限値の代わりに、`*BpsIngress/Egress` に対する異常検知バンドを使用すると、日内のトラフィックパターンに適応し、完全な停止だけでなく部分的な性能低下も捕捉できます。
- **OpenTelemetry：** DX メトリクスは AWS ネットワークデバイスから取得されるため、`AWS/DX`（OTEL ではない）のままです。アプリケーションへの影響を DX イベントと相関付けるには、リンクを*利用している*ワークロードで ADOT SDK（CloudWatch エージェント経由）を使用してください。
- **クロスアカウントオブザーバビリティ：** CloudWatch クロスアカウントオブザーバビリティを使用して、ネットワーク/トランジットアカウントの DX メトリクスをモニタリングアカウントに集約し、レスポンダーがワークロードメトリクスと並べて確認できるようにしてください。


#### Transit Gateway

AWS Transit Gateway は、VPC、VPN 接続、Direct Connect ゲートウェイ、および他の Transit Gateway を相互接続するリージョナルなネットワークハブとして機能し、大規模なネットワークアーキテクチャを簡素化します。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `BytesDropCountBlackhole` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | ブラックホールルートに一致したためにドロップされたバイト数です。このメトリクスはゲートウェイレベルとアタッチメントレベルの両方で利用できます。 |
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `BytesDropCountNoRoute` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | ルートに一致しなかったためにドロップされたバイト数です。このメトリクスはゲートウェイレベルとアタッチメントレベルの両方で利用できます。 |
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `BytesIn` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Transit Gateway が受信したバイト数です。このメトリクスはゲートウェイレベルとアタッチメントレベルの両方で利用できます。 |
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `BytesOut` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Transit Gateway から送信されたバイト数です。このメトリクスはゲートウェイレベルとアタッチメントレベルの両方で利用できます。 |
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `PacketsDropCountBlackhole` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | ブラックホールルートに一致したためにドロップされたパケット数です。バイト数は低いままでもパケット数が急増する小パケットフラッドのシナリオでのアラートに有用です。 |
| 信頼性 | VPC Transit Gateway | `AWS/TransitGateway` | `PacketsDropCountNoRoute` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | ルートに一致しなかったためにドロップされたパケット数です。バイト数は低いままでもパケット数が急増する小パケットフラッドのシナリオでのアラートに有用です。 |

##### 追加メモ

- **静的なしきい値よりも異常検知：** `BytesIn` と `BytesOut` については、静的なしきい値ではなく CloudWatch 異常検知バンドの使用を検討してください。Transit Gateway のトラフィックパターンは時間帯や曜日によって変動するため、予期しない低下やスパイクの検出には、固定の Sum しきい値よりも異常検知が適しています。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** TGW を通過するワークロードからカスタムのネットワークテレメトリ（フローレベルのレイテンシーなど）を発行する場合、CloudWatch エージェントはお客様が定義するカスタム名前空間（`AWS/TransitGateway` ではない）で OTEL メトリクスを CloudWatch に転送できます。これはネイティブの VPC レベルメトリクスを補完します。
- **Transit Gateway フローログ：** 2023 年以降、Transit Gateway は CloudWatch Logs に発行できるフローログをサポートしています。組み込みの CloudWatch メトリクスでは得られないきめ細かいトラフィック分析のため、フローログデータに対するメトリクスフィルターの作成を検討してください。
- **Network Manager との統合：** AWS Network Manager は Transit Gateway のグローバルビューを提供し、ルートやトポロジーの変更を可視化できます。包括的なインシデント検出体制のため、CloudWatch アラームと並行して Network Manager のイベントの使用を検討してください。
- **マルチアカウントオブザーバビリティ：** CloudWatch クロスアカウントオブザーバビリティにより、スポークアカウントの Transit Gateway メトリクスを中央のモニタリングアカウントに集約でき、ハブアンドスポーク型 TGW アーキテクチャのアラーム管理が簡素化されます。


#### Site-to-Site VPN

AWS Site-to-Site VPN は、オンプレミスネットワークと AWS VPC の間に暗号化された IPsec トンネルを作成します。トンネル状態の監視は、インシデント発生時に接続喪失を検出するための最も重要なアラームです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | AWS VPN | `AWS/VPN` | `TunnelState` | リアクティブ | Statistic = Minimum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | このアラームは、このトンネルの状態が DOWN かどうかを把握するのに役立ちます。静的 VPN では、0 は DOWN、1 は UP を示します。BGP VPN では、1 は ESTABLISHED を示し、0 はその他すべての状態に使用されます。どちらのタイプの VPN でも、0 と 1 の間の値は少なくとも 1 つのトンネルが UP でないことを示します。単位：0 から 1 の間の小数値。 |
| 信頼性 | AWS VPN | `AWS/VPN` | `TunnelDataIn` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | トンネルの AWS 側で受信したバイト数です。通常トラフィックが流れているトンネルで急にゼロに低下した場合、`TunnelState` が UP を報告していても、ルーティングや接続の問題を示す先行指標となります。 |
| 信頼性 | AWS VPN | `AWS/VPN` | `TunnelDataOut` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | トンネルの AWS 側から送信したバイト数です。通常トラフィックが流れているトンネルで急にゼロに低下した場合、`TunnelState` が UP を報告していても、ルーティングや接続の問題を示す先行指標となります。 |

##### 追加メモ

- **TreatMissingData = Breaching とする理由：** `TunnelState` では、データの欠落はトンネルがダウンしているか、VPN 接続自体に到達できないことを意味する可能性が高いです — データの欠落を breaching として扱うことで、メトリクスのレポートが完全に停止した場合でもアラートを受け取れます。
- **冗長トンネルの監視：** AWS Site-to-Site VPN は、高可用性のために接続ごとに 2 本のトンネルを提供します。トンネルごとに個別のアラーム（`TunnelIpAddress` ディメンションを使用）を作成し、1 本でもトンネルがダウンした際にアラートを受け取れるようにしてください — 単一トンネルでの稼働は冗長性が失われていることを意味します。
- **CloudWatch 異常検知：** トラフィックパターンが予測可能な環境では、`TunnelDataIn`/`TunnelDataOut` に対する異常検知バンドにより、二値の UP/DOWN アラームでは見逃してしまう微細な劣化（部分的なパケットロス、非対称ルーティング）を検出できます。
- **VPN 高速化接続：** Site-to-Site VPN で Global Accelerator を使用している場合、トンネル障害とエッジネットワークの問題を区別するため、VPN トンネル状態と並行してアクセラレーターの健全性メトリクスを監視してください。
- **Network Manager との統合：** 複数の接続にわたる VPN トンネルの健全性を統合的に把握するため、AWS Network Manager を CloudWatch と併用することを検討してください — Network Manager はトポロジー変更イベントを発行し、マルチサイト展開におけるトンネルごとの CloudWatch アラームを補完できます。


#### Network Firewall

AWS Network Firewall は、VPC 保護のためにステートレスおよびステートフルなルールグループを使用して、ネットワークトラフィックをきめ細かく制御できるマネージドネットワークファイアウォールサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性、セキュリティ | AWS Network Firewall | `AWS/NetworkFirewall` | `TLSErrors` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Network Firewall が SSL/TLS パケットを検査する際に観測されたエラー数です。レポート基準：ゼロ以外の値があること。 |
| 信頼性、セキュリティ | AWS Network Firewall | `AWS/NetworkFirewall` | `DroppedPackets` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ファイアウォールルールによってドロップされたパケット数です。ルールでブロックされたトラフィックや潜在的な設定ミスを示します。 |
| セキュリティ | AWS Network Firewall | `AWS/NetworkFirewall` | `InvalidDroppedPackets` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ドロップされた不正なパケット数です。スパイクは攻撃や上流ネットワークの問題を示している可能性があります。 |
| 信頼性 | AWS Network Firewall | `AWS/NetworkFirewall` | `StreamExceptionPolicyPackets` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 検査キャパシティを超えた際にストリーム例外ポリシーで処理されたパケット数です。ファイアウォールがキャパシティを超過している可能性を示します。 |
| 信頼性 | AWS Network Firewall | `AWS/NetworkFirewall` | `FirewallEndpointCount` | プロアクティブ | Statistic = Minimum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | 正常なファイアウォールエンドポイントの数です。エンドポイント数の減少は、トラフィック検査のカバレッジに影響する AZ レベルの問題を示している可能性があります。 |

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Network Firewall はネイティブに OTEL メトリクスを発行しませんが、ファイアウォールの背後にあるワークロードで CloudWatch エージェントのサイドカーを使用して、ファイアウォールルールのアクションと相関するカスタム名前空間メトリクス（アプリケーションレベルの接続失敗率など）を発行できます。OTEL メトリクスは `AWS/NetworkFirewall` ではなく、お客様が定義するカスタム名前空間に配置されます。
- **トラフィックメトリクスの異常検知：** 静的なしきい値ではなく、`DroppedPackets` と `PassedPackets` メトリクスに対する CloudWatch 異常検知バンドの使用を検討してください — トラフィックパターンは大きく変動し、異常検知はベースラインのトラフィック量に適応します。
- **Network Firewall フローログの統合：** CloudWatch アラームを、CloudWatch Logs に送信される VPC フローログおよび Network Firewall アラートログと組み合わせてください。より深いセキュリティ可視性を得るため、CloudWatch Logs Insights のメトリクスフィルターを使用して、特定の Suricata ルールのヒットやブロックされたトラフィックのカテゴリに対するアラームを作成してください。


### Application Integration

#### SNS

Amazon SNS は、疎結合のマイクロサービス、分散システム、サーバーレスアプリケーション間の通信を可能にするフルマネージドの pub/sub メッセージングサービスです。インシデント検出においては、メッセージが意図したサブスクライバーに確実に届くようにするため、SNS の配信失敗、フィルタリングで除外された通知、DLQ へのリダイレクトを監視することが重要です。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFailed` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | SNS メッセージ処理が最適でないことが検出された場合、根本原因を特定するためにさらなる分析が推奨されます。考えられる要因としては、アクセス許可の不足、スロットリング制限、またはコンシューマー側サービスのリソース制約などが挙げられます。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-InvalidAttributes` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、Amazon SNS を使用するアプリケーション、特にカスタム属性を多用する場合において、メッセージ配信の信頼性と有効性を維持するために重要です。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-NoMessageAttributes` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、メッセージ属性が一切含まれていないためにフィルタリングで除外された通知の数を具体的に測定します。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-InvalidMessageBody` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、無効なメッセージ本文が原因でフィルタリングで除外された SNS 通知の数を追跡します。これを監視することで、メッセージのフォーマットの問題や、期待される基準を満たさないコンテンツを特定するのに役立ちます。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsRedrivenToDlq` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、デッドレターキュー（DLQ）にリダイレクトされた Amazon SNS 通知の数を追跡します。これを監視することで、ターゲットのサブスクライバーによる処理が正常に完了しなかった通知の量を把握できます。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `SMSMonthToDateSpentUSD` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスにアラームを設定すると、月初からの累計料金がアカウントの月間 SMS 支出クォータに近づいたことを把握できます。Amazon SNS は、SMS メッセージの送信によってこのクォータを超えるコストが発生すると判断した場合、数分以内に SMS メッセージの発行を停止します。 |
| 信頼性 | Amazon SNS | `AWS/SNS` | `(m1/m2)*100`（m1 = `SMSSuccessRate`、m2 = `NumberOfMessagesPublished`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、送信されたメッセージに対する SMS メッセージ配信成功率をパーセンテージで測定します。 |

##### 追加メモ

- **SNS 配信ステータスログ + CloudWatch Metrics**：SNS は、プロトコル（HTTP、SQS、Lambda など）ごとの配信ステータスを CloudWatch Logs に記録できます。これらを Metric Filters と組み合わせて、特定の配信失敗理由（エンドポイントのスロットリングとアクセス許可エラーなど）に関するカスタムメトリクスを作成することで、`NumberOfNotificationsFailed` 単独よりもきめ細かいアラームを設定できます。
- **`NumberOfNotificationsFailed` の異常検知**：静的なしきい値は、予期されたトラフィックの急増時に誤報を引き起こす可能性があります。CloudWatch 異常検知は発行パターンに適応します — 失敗数に異常検知バンドを使用することで、固定しきい値をチューニングすることなく真の劣化を検出できます。
- **SNS FIFO トピックのメトリクス**：FIFO トピック（2020 年に導入され、その後成熟）を使用している場合は、重複排除メトリクスと併せて `NumberOfMessagesPublished` を監視してください。順序性が重要なワークフローがある場合は、メッセージグループレベルのバックログにアラームを設定することを検討してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL） — 発行側のレイテンシー**：ADOT SDK の自動計装は、プロデューサー側で SNS の `Publish` API 呼び出しのレイテンシーとエラーを取得します。これらのメトリクスは CloudWatch OTLP エンドポイント経由でカスタム名前空間に格納され、サーバー側の `AWS/SNS` メトリクスを補完する発行者側から見たレイテンシーを提供します。
- **CloudWatch Application Signals**：SNS がアプリケーションの中核的なメッセージング層である場合、Application Signals は発行パスの成功率とレイテンシーに関する SLO バーンレートアラーム（`ApplicationSignals` 名前空間）を導出できます — トピックごとのメトリクスがしきい値を超える前に、アプリケーション層での劣化を検出します。
- **SMS 送信元メトリクス**：2023 年頃から、SNS は送信元 ID ごとのメトリクス（送信元番号/送信者 ID ごとに分類された `SMSSuccessRate`）を提供しています。キャリア固有の配信問題を切り分けるため、アカウントレベルのみでなく送信元 ID ごとにアラームを設定することを検討してください。


#### SQS

Amazon SQS は、マイクロサービス、分散システム、サーバーレスアプリケーションを疎結合にするフルマネージドのメッセージキューイングサービスです。インシデント発生時にコンシューマーの遅延や処理のボトルネックを検出するには、キューの深さとメッセージの経過時間を監視することが重要です。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性、レイテンシー | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesVisible` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、処理待ちの状態で SQS キュー内に表示されているメッセージの数を測定します。この数が増加している場合、キューからメッセージを消費するダウンストリームサービスのパフォーマンス劣化を示している可能性があります。処理の遅延を防ぐため、深さが通常のレベルを超えて増加した場合はさらなる調査が推奨されます。 |
| 信頼性、レイテンシー | Amazon SQS | `AWS/SQS` | `ApproximateAgeOfOldestMessage` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | このメトリクスは、最も古いメッセージが処理されずにキュー内に留まっている時間（秒）を測定します。値が高い場合、メッセージが生成される速度に対して消費が追いついていないことを示しており、バックログや処理の遅延が示唆されます。 |
| 信頼性 | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesVisible`（DLQ） | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 1; TreatMissingData = notBreaching | デッドレターキューに対してしきい値 >= 1 でアラームを設定します。DLQ に到達したメッセージはいずれも、調査が必要な処理失敗を示しています。 |
| 信頼性 | Amazon SQS | `AWS/SQS` | `NumberOfMessagesReceived` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | コンシューマーのアクティビティの急激な低下を検出します — ダウンストリーム障害の先行指標です。トラフィックが変動するワークロードには異常検知バンドを検討してください。 |
| 信頼性 | Amazon SQS | `AWS/SQS` | `NumberOfMessagesSent` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | プロデューサーのアクティビティの急激な低下を検出します — アップストリーム障害の先行指標です。トラフィックが変動するワークロードには異常検知バンドを検討してください。 |
| 信頼性、レイテンシー | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesDelayed` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | FIFO キューの場合、集約されたキューの深さでは見えないグループごとの停滞を検出するために、遅延メッセージを監視します。 |

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** CloudWatch エージェント（OTLP エンドポイント）は、カスタムメトリクス（コンシューマーの処理時間、バッチサイズなど）を OTLP エンドポイント経由で CloudWatch に送信できます。これらは自分で定義したカスタム名前空間（`AWS/SQS` ではありません）に格納され、ネイティブのキューレベルメトリクスをアプリケーションレベルの可視性で補完します。
- **CloudWatch 異常検知：** 静的なしきい値の代わりに、`ApproximateNumberOfMessagesVisible` に異常検知バンドを使用することを検討してください — トラフィックパターンが変動するキューは、時刻や曜日の季節性に適応する動的なベースラインの恩恵を受けます。
- **CloudWatch Application Signals：** SQS のコンシューマーがアプリケーションのフロントに立つ計装済みサービスである場合、`ApplicationSignals` 名前空間の SLO バーンレートアラームにより、キューの深さが増加する前にレイテンシーやエラー率の劣化を捕捉できます。
- **FIFO キューのメッセージグループレベルのバックログ：** 複数のメッセージグループを持つ FIFO キューでは、集約されたキュー深さメトリクスが隠してしまう停滞を検出するために、グループごとのバックログを監視してください。


#### EventBridge

**Amazon EventBridge** のインシデント検出用の推奨 CloudWatch アラームです。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| 信頼性 | AWS/Events | `FailedInvocations` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サーバー側の問題（タイムアウト、リソース制限、内部エラー）による API 呼び出しの失敗数をカウントします。API 処理のどこで、いつ問題が発生したかを特定するのに役立ちます。**注：** EventBridge は、このメトリクスがゼロでない場合にのみ CloudWatch に送信します。 |
| 信頼性 | AWS/Events | `InvocationsFailedToBeSentToDlq` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | デッドレターキューに移動できなかった呼び出しの数です。DLQ エラーは、アクセス許可エラー、リソースの利用不可、サイズ制限が原因で発生します。**注：** EventBridge は、このメトリクスがゼロでない場合にのみ CloudWatch に送信します。 |
| 信頼性 | AWS/Events | `ThrottledRules` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ルールの実行がスロットリングされた回数です。それらのルールの呼び出しが遅延する可能性があります。 |
| 信頼性 | AWS/EventBridge Pipes | `ExecutionFailed` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 失敗した EventBridge Pipes の実行数です。パイプ内のターゲットまたはエンリッチメントのエラーを示します。 |
| 信頼性 | AWS/EventBridge Pipes | `ExecutionThrottled` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | サービス制限によりスロットリングされた EventBridge Pipes の実行数です。 |
| 信頼性 | AWS/Scheduler | `InvocationAttemptCount` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | EventBridge Scheduler の呼び出し試行を追跡します。急激な低下はスケジューリングの失敗を示している可能性があります。 |
| 信頼性 | AWS/Scheduler | `InvocationDroppedCount` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 失敗または制限により EventBridge Scheduler がドロップしたスケジュール済み呼び出しの数です。 |
| 信頼性 | AWS/Events | `InvocationsSentToDlq` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | API Destinations やその他のターゲットを対象とするルールで、デッドレターキューに送信された呼び出しの数です。配信失敗の繰り返しを示します。 |
| 信頼性 | AWS/Events | `MatchedEvents` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ルールに一致したイベントの数です。急激な低下は、エラーメトリクスでは現れないアップストリームプロデューサーの障害を示している可能性があります。 |
| 信頼性 | AWS/Events | `TriggeredRules` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 受信イベントによってトリガーされたルールの数です。プロアクティブなベースラインとして有用で、逸脱はイベントフローの異常を示します。 |

##### 追加メモ

- **`TreatMissingData` と「ゼロでない場合のみ送信される」という特性：** `FailedInvocations`/`InvocationsFailedToBeSentToDlq` はゼロでない場合にのみ発行されるため、これらに対するアラームは欠落データを **notBreaching** として扱い（表に示すとおり）、低いしきい値（>0）を使用する必要があります — ここでは異常検知バンドは適切ではありません。
- **EventBridge Pipes と Scheduler（新しいサービス）：** EventBridge Pipes と Scheduler は `AWS/Events` とは別の名前空間を使用します。表に示したもの以外にも、Pipes の `Invocations` とターゲットエラーメトリクス、および Scheduler のターゲット失敗にもアラームを設定してください。
- **API Destinations：** API Destinations を対象とするルールでは、ダウンストリームの HTTP エンドポイントの障害を検出するために `Invocation4xx`/`5xxErrorCount` も検討してください（注：これらのメトリクス名は設定によって異なる場合があります）。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** EventBridge のメトリクスはネイティブの `AWS/Events` です。イベントをエンドツーエンドでトレースし、`FailedInvocations` を障害が発生しているターゲットと関連付けるには、プロデューサー/コンシューマー（Lambda、ECS）を ADOT SDK で計装してください（OTLP を CloudWatch エージェントに送信）。


#### Step Functions

AWS Step Functions は、ビジュアルワークフロー（ステートマシン）を使用して分散アプリケーションのコンポーネントを連携させるサーバーレスのオーケストレーションサービスです。インシデント発生時に壊れたワークフローやキャパシティの問題を検出するには、実行の失敗、スロットリング、タイムアウトを監視することが不可欠です。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| レイテンシー | Step Functions | `AWS/States` | `ExecutionTime` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 実行時間の急激な増加は、ステップ自体または連携するリソースに問題があることを示している可能性があります。このメトリクスは、他のメトリクスからはすぐには明らかにならない問題を早期に検出するための有用なツールになります。 |
| レイテンシー | Step Functions | `AWS/States` | `ExecutionThrottled` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、AWS のサービス制限を超えたことによりステートマシンの実行がスロットリングされた回数を追跡します。これを監視することで、これらの制限に達したタイミングを特定でき、プロセス設計またはサービス制限自体の調整が必要であることを示唆します。 |
| 信頼性 | Step Functions | `AWS/States` | `ExecutionsFailed` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | AWS Step Functions で失敗した実行の数を追跡するのに役立ちます。これは、期待どおりに動作しておらず対応が必要なワークフローを特定するために重要です。失敗を監視することで、開発者はビジネス運用に影響が及ぶ前に問題をプロアクティブに特定して解決できます。これによりダウンタイムが削減され、アプリケーション全体の安定性が向上します。 |
| 信頼性 | Step Functions | `AWS/States` | `ExecutionsTimedOut` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ステートマシンの実行におけるタイムアウトを特定するのに役立ちます。これは、不適切な設定、不十分なリソース割り当て、または対応が必要な呼び出し先サービスの問題などを示している可能性があります。 |
| 信頼性 | Step Functions | `AWS/States` | `ExecutionsAborted` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 中止された実行は、外部からのキャンセル、または調査が必要なアップストリームの問題を示しています。 |
| パフォーマンス | Step Functions | `AWS/States` | `ExecutionsStarted` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 実行のスループットを監視します。Express ワークフローでは、個々の実行がコンソールで個別に追跡されないため、異常検知バンドを使用してスループットの異常を検出してください。 |
| 信頼性 | Step Functions | `AWS/States` | `MapRunsFailed` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Distributed Map ステートの場合、個々の Map Run の反復処理内での失敗を検出します。MapRunArn ディメンションと併用してください。 |
| 信頼性 | Step Functions | `AWS/States` | `MapRunsAborted` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Distributed Map ステートの場合、アップストリームのキャンセルやリソースの問題を示す中止された Map Run を検出します。MapRunArn ディメンションと併用してください。 |

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Step Functions は AWS X-Ray トレースをネイティブにサポートしています。CloudWatch エージェントは、これらのトレースをカスタムメトリクス（ステップごとの所要時間、再試行回数など）と併せて OTLP エンドポイント経由で CloudWatch にエクスポートできます。カスタムメトリクスは自分で定義した名前空間（`AWS/States` ではありません）に格納され、組み込みの実行レベルメトリクスを超えたステップレベルの粒度を提供します。
- **CloudWatch 異常検知：** `ExecutionTime` は異常検知アラームの優れた候補です — 安定したパフォーマンスプロファイルを持つワークフローは、予期された負荷の急増時に誤検知を引き起こしかねない静的なしきい値よりも、動的なバンドの恩恵を受けます。
- **CloudWatch Application Signals：** ステートマシンが計装済みサービスをオーケストレーションしている場合、`ApplicationSignals` 名前空間の SLO バーンレートアラームにより、ワークフローを構成するサービス全体のエンドツーエンドのレイテンシーやエラー率の劣化を捕捉できます。
- **Express ワークフローの期間：** Express ワークフロー（大量・短時間）では、個々の実行がコンソールで個別に追跡されないため、より短いアラーム期間（30 秒など）を検討してください。


#### Kinesis Data Streams

**Amazon Kinesis Data Streams** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [Kinesis Data Streams の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Kinesis)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|
| レイテンシー | AWS/Kinesis | `ReadProvisionedThroughputExceeded` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 読み取りオペレーションがプロビジョニングされた読み取りスループットを超えた回数です。監視することで、トラフィックの多い時間帯にスループット制限によってデータへのアクセスが失われていないことを確認できます。 |
| 信頼性 | AWS/Kinesis | `WriteProvisionedThroughputExceeded` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 書き込みキャパシティの制限に達し、取り込みの遅延や失敗を引き起こしたタイミングを特定します。プロビジョニングされたスループットを実際のデータフローのニーズに合わせて調整することで最適化します。 |
| 信頼性 | AWS/Kinesis | `GetRecords.IteratorAgeMilliseconds` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | レコードが処理される前にストリーム内に存在していた時間です。イテレーターの経過時間が長い場合、データが生成される速度に対して消費が追いついていないことを示し、リアルタイム処理の問題につながる可能性があります。 |
| 信頼性 | AWS/Kinesis | `PutRecords.FailedRecords` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 処理に失敗したレコードの数です。データ整合性のために重要であり、急増はストリームまたはプロデューサーアプリケーションのパフォーマンス問題を示している可能性があります。 |
| 信頼性 | AWS/Kinesis | `PutRecords.ThrottledRecords` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | PutRecords の使用時にスロットリングされたレコードの数です。シャードの書き込みキャパシティを超えたことによる取り込みのスロットリングを示します。シャード数または入力レートを調整してください。 |
| レイテンシー | AWS/Kinesis | `SubscribeToShardEvent.MillisBehindLatest` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 拡張ファンアウトのコンシューマーの場合、コンシューマーがどれだけ遅れているかを測定します。共有スループットの `IteratorAge` メトリクスでは、ファンアウトモードにおけるコンシューマーごとの遅延を捕捉できません。 |

##### 追加メモ

- **オンデマンドキャパシティモード：** スループット超過のメトリクスは **プロビジョンド** シャードを前提としています。**オンデマンド** モードでは Kinesis がシャードを自動スケーリングするため、`Read/WriteProvisionedThroughputExceeded` はほぼゼロになり、超過が発生した場合はオンデマンドの倍増制限に達したことを示します — 固定のシャード数をプロビジョニングするのではなく、このメトリクスとアカウントレベルのシャードクォータにアラームを設定してください。
- **`IteratorAge` が主要なコンシューマー遅延 SLO：** `GetRecords.IteratorAgeMilliseconds` を主要な **プロアクティブ** なインシデント検出シグナルとして維持してください。イテレーターの経過時間の増加は、停滞または低速なコンシューマーの最も早い指標です。異常検知バンドと組み合わせてください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Kinesis のメトリクスはネイティブの `AWS/Kinesis` です。`PutRecords.FailedRecords` やイテレーター経過時間の急増を障害が発生しているコンポーネントまでトレースできるように、プロデューサーとコンシューマーのアプリケーション（Lambda/KCL/Flink）を ADOT SDK で計装してください（OTLP を CloudWatch エージェントに送信）。
- **ダウンストリーム（Firehose/Managed Flink）：** エンドツーエンドのストリーミングでは、Data Firehose（`DeliveryToS3.Success`、`ThrottledRecords`）および Managed Service for Apache Flink（`fullRestarts`、`downtime`）にもアラームを拡張してください。


#### Amazon MQ

**Amazon MQ**（ActiveMQ および RabbitMQ ブローカー）のインシデント検出用の推奨 CloudWatch アラームです。すべてのアラームは **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = notBreaching** を使用します。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | ブローカー | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 統計 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | ActiveMQ | AWS/AmazonMQ | `CurrentConnectionsCount` | リアクティブ | Average | 接続クォータへの接近や突然の接続喪失を特定するため、ブローカーのライブ接続を監視します。 |
| カスタマーエクスペリエンス、信頼性 | ActiveMQ | AWS/AmazonMQ | `CpuUtilization` | プロアクティブ | Maximum | ActiveMQ ブローカーが消費する、割り当てられた EC2 コンピューティングの割合です。しきい値を超えた場合、メッセージ処理のボトルネックの可能性を示します。 |
| カスタマーエクスペリエンス、信頼性 | ActiveMQ | AWS/AmazonMQ | `StorePercentUsage` | プロアクティブ | Maximum | 利用可能なストレージキャパシティの使用量（パーセンテージ）です。100% になるとブローカーは新しいメッセージの受け付けを停止します。 |
| カスタマーエクスペリエンス、信頼性 | ActiveMQ | AWS/AmazonMQ | `InflightCount` | プロアクティブ | Maximum | コンシューマーへの転送中で未確認のメッセージです。処理のボトルネックの検出に役立ちます。 |
| カスタマーエクスペリエンス、信頼性 | ActiveMQ | AWS/AmazonMQ | `HeapUsage` | プロアクティブ | Maximum | 現在使用されている ActiveMQ JVM メモリ制限の割合です。割合が高い → ブローカーが大量のリソースを使用しており、OOM アラームにつながる可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `MessageUnacknowledgedCount` | リアクティブ | Maximum | キュー内で確認されていないメッセージの数です。数が増加している場合、メッセージ処理の問題を示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `AckRate` | プロアクティブ | Average | コンシューマーによってメッセージが確認される速度です（サンプリング時点でのメッセージ数/秒）。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `SystemCpuUtilization` | プロアクティブ | Maximum | ブローカーによる割り当て済み EC2 コンピューティングの現在の使用率（パーセンテージ）です。増加は処理に影響するリソース制約を示します。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `RabbitMQMemUsed` | プロアクティブ | Maximum | RabbitMQ ブローカーが使用する RAM の量です。`RabbitMQMemUsed` が `RabbitMQMemLimit` の 85% に達した場合、制限に達する前にブローカーのアップグレードを開始するためプロアクティブにアラームを設定します（メモリアラーム）。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `RabbitMQDiskFree` | プロアクティブ | Maximum | RabbitMQ ブローカーの空きディスク容量の合計です。ディスク使用量が制限を超えると、クラスターはすべてのプロデューサー接続をブロックします。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `RabbitMQQueueMessages` | プロアクティブ | Maximum | キューごとのメッセージ数です。ブローカーレベルのメトリクスでは個別に停滞しているキューを把握できません。キューごとのアラームにより、クォーラムキュー内の局所的なバックログを捕捉できます。 |
| カスタマーエクスペリエンス、信頼性 | RabbitMQ | AWS/AmazonMQ | `ConsumerCount` | リアクティブ | Minimum | キューにアタッチされているコンシューマーの数です。ゼロまで低下した場合、すべてのコンシューマーが切断され、メッセージが蓄積することを示します。 |

##### 追加メモ

- **RabbitMQ クォーラムキュー：** Amazon MQ 上の新しい RabbitMQ では、耐久性のためにクォーラムキューが推奨されます。表に示したキューごとのメトリクスに加えて、クォーラムメンバーの健全性を監視してください — ブローカーレベルのメトリクスだけでは、単一のキュー内のレプリケーションの問題を把握できません。
- **クラスター/HA の考慮：** クラスター化された（マルチ AZ）デプロイでは、ブローカーインスタンス全体にまたがる **複合アラーム** を構築し、メンテナンス中の単一ノードの再起動ではなく、真のクォーラム喪失時に対応担当者が呼び出されるようにしてください。
- **メモリ/ディスクの予防的アラームは依然として重要：** `RabbitMQMemUsed` の 85% および `RabbitMQDiskFree` のガイダンスはまさに適切です — これらはプロデューサーをブロックする 2 つの条件であり、優先度の高いプロアクティブアラームとして維持してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Amazon MQ はネイティブの `AWS/AmazonMQ` メトリクスを出力します。`InflightCount`/`MessageUnacknowledgedCount` の増加を低速またはクラッシュしたコンシューマーと関連付けるには、プロデューサー/コンシューマーのアプリケーションを ADOT SDK で計装してください（OTLP を CloudWatch エージェントに送信）。
- **異常検知：** 接続数と確認レートは、日次サイクルを持つワークロードにおいて異常検知バンドに適しています。


#### MSK

Amazon Managed Streaming for Apache Kafka（MSK）は、Apache Kafka を使用してストリーミングデータを処理するアプリケーションを構築および実行するためのフルマネージドサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| パフォーマンス | Amazon MSK | `AWS/Kafka` | `(m1 + m2) m1 = CpuUser m2 = CpuSystem` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = missing | このメトリクスは、ブローカー上の CPU 使用率の合計（user + system）を測定します。CPU 使用率が高い場合、ブローカーが高負荷状態にあり、メッセージを効率的に処理できなくなる可能性があることを示します。プロアクティブな監視により、ブローカーのスケーリングが必要なタイミング、またはパフォーマンスを維持しスロットリングを防ぐためにクライアントのオペレーションを最適化する必要があるタイミングを特定できます。 |
| 信頼性 | Amazon MSK | `AWS/Kafka` | `HeapMemoryAfterGC` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = missing | このメトリクスは、ガベージコレクション発生後の Java ヒープメモリ使用量を示します。GC 後の値が高い場合、メモリリークの可能性やヒープ割り当ての不足を示します。監視することで、ブローカーをクラッシュさせサービスを中断させる可能性のあるメモリ不足エラーを防止できます。 |
| 信頼性 | Amazon MSK | `AWS/Kafka` | `UnderMinIsrPartitionCount` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、必要最小数を下回る同期レプリカ（ISR）しか持たないパーティションの数をカウントします。数が多い場合、データ損失や利用不可につながる可能性のあるレプリケーションの問題を示します。監視することでデータの耐久性が確保され、クラスターのフォールトトレランスの維持に役立ちます。 |
| 信頼性 | Amazon MSK | `AWS/Kafka` | `OfflinePartitionsCount` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、アクティブなリーダーが存在しないパーティションの数を示します。オフラインパーティションは読み取りと書き込みが利用できないため、アプリケーションの可用性に直接影響します。監視することで、サービス中断を引き起こす可能性のあるパーティションリーダーシップの問題を迅速に特定し解決できます。 |
| パフォーマンス | Amazon MSK | `AWS/Kafka` | `MessagesInPerSec` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = breaching | このメトリクスは、ブローカーへの受信メッセージの速度を測定します。プロデューサーのトラフィックパターンとクラスターの負荷を監視するのに役立ちます。急激な増加や低下は、プロデューサーの問題やアプリケーションの異常な動作を示している可能性があります。キャパシティプランニングと、クラスターがピーク時のスループットを処理できることを確認するために不可欠です。 |
| レイテンシー | Amazon MSK | `AWS/Kafka` | `OffsetLag` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、コンシューマーが最新の生成済みメッセージからどれだけ遅れているかを測定することで、プロデューサーとコンシューマーのオペレーション間の遅延を示します。遅延が大きい場合、コンシューマーがプロデューサーに追いついていないことを示し、データ処理の遅延につながる可能性があります。コンシューマーの健全性の監視と潜在的なボトルネックの特定に不可欠です。 |
| カスタマーエクスペリエンス | Amazon MSK | `AWS/Kafka` | `TcpConnections` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = breaching | このメトリクスは、ブローカーへのアクティブな TCP 接続数を追跡します。クライアントの接続パターンを監視し、接続リークの可能性を特定するのに役立ちます。異常に高い数値はクライアントが接続を適切にクローズしていないことを示す可能性があり、一方で急激な低下はクライアントの接続性の問題を示唆します。 |
| 信頼性 | Amazon MSK | `AWS/Kafka` | `IAMTooManyConnections` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、クライアントが IAM 認証の接続制限を超えたことを示します。値が高い場合、セキュリティ上の問題の可能性、または同時認証を過度に試行する設定ミスのあるクライアントを示唆します。安全なアクセスの維持と、認証に関連するパフォーマンスへの影響の防止に重要です。 |
| 可用性 | Amazon MSK | `AWS/Kafka` | `ActiveControllerCount` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、ブローカーが使用している CPU リソースの割合を示します。使用率が高い場合、スケーリングやクライアントオペレーションの最適化が必要であることを示している可能性があります。キャパシティプランニングと、ブローカーがワークロードを処理するのに十分なリソースを持っていることを確認するために不可欠です。 |
| カスタマーエクスペリエンス | Amazon MSK | `AWS/Kafka` | `ConnectionCreationRate` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、新しい接続が確立される頻度を測定します。異常に高い割合は、パフォーマンスに影響を与える可能性のある接続チャーン（頻繁な接続/切断サイクル）を示している可能性があります。クライアントの接続管理の問題や DDoS 攻撃の試行の可能性を特定するのに役立ちます。 |
| レイテンシー | Amazon MSK | `AWS/Kafka` | `EstimatedMaxTimeLag` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 拡張モニタリング（PER_TOPIC_PER_BROKER レベル）で利用できます。基本的な `OffsetLag` よりも実用的な、時間ベースのコンシューマー遅延シグナルを提供します。 |
| レイテンシー | Amazon MSK | `AWS/Kafka` | `MaxOffsetLag` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 拡張モニタリング（PER_TOPIC_PER_BROKER レベル）で利用できます。パーティション全体における最大のオフセットベースのコンシューマー遅延です — 基本的な `OffsetLag` メトリクスよりもきめ細かい情報です。 |

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** MSK クラスターは、サイドカーとして、または専用のモニタリングインスタンス上で、CloudWatch エージェント（OTLP エンドポイント）経由で JMX メトリクスとノードメトリクスをエクスポートできます。OTEL メトリクスは自分で定義したカスタム名前空間（`AWS/Kafka` ではありません）に格納され、デフォルトの `AWS/Kafka` 名前空間が提供する範囲を超えた、よりきめ細かいディメンション（トピックごと、コンシューマーグループごとなど）を提供します。
- **CloudWatch 異常検知バンド：** `MessagesInPerSec`、`OffsetLag`、`TcpConnections` のように自然な日次/週次のパターンを持つメトリクスでは、静的なしきい値の代わりに CloudWatch 異常検知バンドを使用することを検討してください。真の逸脱を捕捉しつつ、誤検知を削減できます。
- **MSK Express Brokers：** Express Brokers（2024 年に提供開始）を使用している場合、公開されるメトリクスが異なります — ストレージ関連のメトリクスは存在せず、スループットのスケーリングは自動です。Express 固有のメトリクスのドキュメントを確認し、それに応じてアラームのセットを調整してください。
- **CloudWatch Application Signals：** Kafka を消費するアプリケーションが Application Signals で計装されている場合、ブローカー側の `OffsetLag` を補完するものとして、生成から消費までのエンドツーエンドのレイテンシーに関する `ApplicationSignals` 名前空間の SLO バーンレートアラームを検討してください。
- **KRaft モードの考慮事項：** KRaft モード（ZooKeeper に代わるもの）で実行されるクラスターでは、`ActiveControllerCount` のセマンティクスが変わります — 複数のコントローラーが参加するものの、アクティブなリーダーは 1 つだけという新しいコントローラークォーラムモデルを、アラームのロジックで考慮するようにしてください。


### ストレージ

#### S3

Amazon S3 は、業界最高レベルのスケーラビリティ、データ可用性、セキュリティ、パフォーマンスを提供するオブジェクトストレージサービスです。インシデント検出においては、S3 のエラー率、レプリケーション遅延、リクエストレイテンシーを監視することで、データ耐久性 SLA が満たされていることを確認し、クライアント側の劣化を早期に検出できます。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | S3 | `AWS/S3` | `5xxErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、Amazon S3 が返すサーバー側エラー（5xx HTTP ステータスコード）の数を追跡します。これらのエラーは通常、Amazon S3 自体の問題、またはデータの取得、保存、処理の能力に影響を与えるサーバー側の問題を示します。 |
| 信頼性 | S3 | `AWS/S3` | `ReplicationLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 多くの組織では、災害復旧やデータの局所性などの理由から、一定の時間枠内にデータをレプリケートすることを求めるサービスレベルアグリーメント（SLA）があります。ReplicationLatency メトリクスを追跡することで、これらの SLA への準拠を確保し、合意されたタイムライン内でデータがレプリケートされていることの証跡が得られます。 |
| カスタマーエクスペリエンス、信頼性 | S3 | `AWS/S3` | `TotalRequestLatency` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、S3 バケットへのリクエストの処理に要した合計時間を、リクエストの受信からレスポンスの送信までで測定します。このレイテンシーを監視することで、S3 がどれだけ迅速にリクエストを処理しているかを把握でき、パフォーマンスに敏感なアプリケーションにとって極めて重要です。レイテンシー値が高い場合、S3 サービス自体の問題、またはリクエストの管理方法（例：ネットワークの問題、非効率なリクエスト処理）に潜在的な問題があることを示す可能性があります。このメトリクスは、そのような問題の特定と診断に役立ちます。 |
| カスタマーエクスペリエンス、信頼性 | S3 | `AWS/S3` | `4xxErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クライアント側エラー（4xx HTTP ステータスコード）を追跡します。急増は、アクセス制御の設定ミス、オブジェクトの欠落、またはコンシューマーに影響するクライアント側のリクエストの問題を示します。バケット/プレフィックスでリクエストレベルメトリクスを有効にする必要があります。 |
| 信頼性 | S3 | `AWS/S3` | `OperationsPendingReplication` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | レプリケーション保留中のオブジェクト数です。S3 Replication Time Control（RTC）で RPO SLA が必要な場合、リカバリポイント目標に違反する前にレプリケーションのバックログを検出するため、このメトリクスがしきい値を超えた場合にアラームを設定します。 |

##### 追加メモ

- **CloudWatch の S3 Storage Lens メトリクス**：S3 Storage Lens（アドバンストティア）は、組織全体のメトリクスを `AWS/S3/Storage-Lens` 名前空間で CloudWatch に公開できます。コストの異常や孤立したアップロードをプロアクティブにキャッチするため、`NonCurrentVersionStorageBytes` の増加や `IncompleteMultipartUploadStorageBytes` にアラームを設定することを検討してください。
- **S3 リクエストレベルメトリクスの有効化：** デフォルトの日次ストレージメトリクスに加えて、バケット/プレフィックスレベルでリクエストメトリクスを有効にすると、`4xxErrors`、`FirstByteLatency`、`AllRequests`、`GetRequests` を 1 分間隔で利用できるようになります。
- **`TotalRequestLatency` の異常検知**：静的なしきい値ではなく、CloudWatch 異常検知はワークロードのパターン（例：夜間のバッチジョブ）に適応します。誤検知を減らすため、レイテンシーとエラー数のメトリクスに異常検知バンドを使用してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL） — クライアント側の S3 レイテンシー**：AWS SDK（v2 Java、JS v3 など）は HTTP レベルのメトリクスを出力し、CloudWatch エージェント経由でキャプチャして、お客様独自の名前空間のカスタムメトリクスとして CloudWatch にエクスポートできます。これにより、サーバー側の `TotalRequestLatency` を補完する、クライアントで観測されたレイテンシーとリトライ数が得られます。
- **CloudWatch Application Signals**：アプリケーションが API の背後で S3 をバッキングストアとして使用している場合、Application Signals はその API のエラー率とレイテンシーに対して SLO バーンレートアラーム（`ApplicationSignals` 名前空間）を導出できます — バケットレベルのメトリクスがしきい値を超える前に、アプリケーション層での劣化をキャッチします。


#### EFS / FSx

**Amazon EFS** と **Amazon FSx for Windows File Server** のインシデント検出用の推奨 CloudWatch アラームです。AWS は [EFS の推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EFS)も公開しています。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性、レイテンシー | Amazon EFS | AWS/EFS | `PercentIOLimit` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | ファイルシステムが **General Purpose** パフォーマンスモードの I/O 制限にどれだけ近づいているかを示します。 |
| 信頼性、レイテンシー | Amazon EFS | AWS/EFS | `PermittedThroughput` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | ファイルシステムが実現できる最大スループットです。Elastic では最大書き込みスループットを反映し、Provisioned ではプロビジョニングされた値と Standard ストレージが許容する値のうち大きい方を反映し、Bursting ではファイルシステムのサイズと `BurstCreditBalance` の関数になります。Min/Max/Average 統計により、1 分あたりの最小/最大/平均の許容スループットが得られます。 |
| 信頼性、レイテンシー | Amazon FSx for Windows File Server | AWS/FSx | `NetworkThroughputUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | ファイルシステムにアクセスするクライアントのネットワークスループットを、プロビジョニングされた制限に対する割合で示します。 |
| 信頼性、レイテンシー | Amazon FSx for Windows File Server | AWS/FSx | `FileServerDiskThroughputUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | ファイルサーバーとそのストレージボリューム間のディスクスループットを、スループットキャパシティによって決まるプロビジョニングされた制限に対する割合で示します。 |
| 信頼性、レイテンシー | Amazon FSx for Windows File Server | AWS/FSx | `FileServerDiskIopsUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | ファイルサーバーとストレージボリューム間のディスク IOPS を、スループットキャパシティによって決まるプロビジョニングされた制限に対する割合で示します。 |
| 信頼性、レイテンシー | Amazon FSx for Windows File Server | AWS/FSx | `StorageCapacityUtilization` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | 使用中の物理ストレージキャパシティを、合計ストレージキャパシティに対する割合で示します。 |
| 信頼性 | Amazon EFS | AWS/EFS | `BurstCreditBalance` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Bursting モードのファイルシステムでは、スループットスロットリングを防ぐため、クレジットがゼロに向かう傾向にある場合にアラームを設定します。Elastic スループットのファイルシステムには該当しません。 |
| 信頼性 | Amazon EFS | AWS/EFS | `StorageBytes` | プロアクティブ | Statistic = Average; Period = 300s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | ファイルシステムに保存されている合計バイト数です。キャパシティ起因のコスト超過をプロアクティブに防ぐため、増加にアラームを設定します。 |
| 信頼性 | Amazon FSx for Windows File Server | AWS/FSx | `FreeStorageCapacity` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | 残りの空きストレージキャパシティ（バイト単位）です。書き込みをブロックするキャパシティフルのインシデントを防ぐため、低下した場合にアラームを設定します。 |

##### 追加メモ

- **Elastic スループットが現在の EFS のデフォルト：** 新しい EFS ファイルシステムはデフォルトで **Elastic スループット**になり、`PermittedThroughput` が自動的にスケールします — そのため、従来の Bursting の `BurstCreditBalance` 枯渇アラームはもはや該当しないことが多くなっています。Bursting モードのファイルシステムでは、引き続き `BurstCreditBalance` にアラームを設定してください（表を参照）。
- **Windows 以外の FSx ファミリー：** この表は FSx for Windows を対象としています。**FSx for NetApp ONTAP、OpenZFS、Lustre** を運用している場合は、同等のメトリクス（例：`StorageCapacityUtilization`、`FileServerDiskIopsUtilization`、Lustre の `FreeDataStorageCapacity`）を追加してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** ストレージメトリクスはネイティブの `AWS/EFS`/`AWS/FSx` のままです。`PercentIOLimit`/使用率の急増を、それを引き起こしているワークロードと相関付けるため、*クライアント*（EC2/EKS/ECS）を ADOT SDK（CloudWatch エージェントに OTLP を送信）で計装してください。
- **異常検知：** 使用率のパーセンテージは、日次/季節的なパターンを持つワークロードにおいて異常検知バンドに適しています。


### AI/ML とコンタクトセンター

#### SageMaker

Amazon SageMaker は、開発者やデータサイエンティストが大規模に ML モデルを構築、トレーニング、デプロイできるようにするフルマネージドの機械学習サービスであり、リアルタイム推論エンドポイントは重要な本番コンポーネントです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `InvocationsPerInstance` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 各エンドポイントインスタンスが処理した推論リクエスト数を追跡します。異常なトラフィックパターン、ワークロードの急増、またはアップストリームサービスの障害を示す可能性のある予期しないトラフィックの低下を検出するのに役立ちます。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker` | `ModelLatency` | リアクティブ | Statistic = p99; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | モデルコンテナが推論リクエストを処理するのにかかった時間（マイクロ秒）を測定します。p99 レイテンシーが高い場合は、モデルのパフォーマンス低下、コンピューティングリソースの飽和、またはコンテナの健全性の問題を示します。しきい値はお客様のエンドポイントごとにベースライン化する必要があります。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker` | `Invocation5XXErrors` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | エンドポイントの障害、コンテナのクラッシュ、または内部サービスの問題によって発生したサーバー側エラーを追跡します。これは実際のカスタマーインシデントに対して最もシグナル性の高いアラームです。トラフィックの少ないエンドポイントでの誤検知を避けるため、レートベースのアラートには CloudWatch メトリクス数式（5XXErrors / Invocations * 100）の使用を検討してください。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker` | `OverheadLatency` | リアクティブ | Statistic = p99; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | モデル実行の前後におけるリクエストのルーティング、シリアル化、インフラストラクチャのオーバーヘッドなど、モデルコンテナの外で費やされた追加時間を測定します。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker` | `Invocations` | リアクティブ | Statistic = Sum; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | エンドポイントに送信された InvokeEndpoint リクエストの総数を追跡します。ゼロまで低下した場合、エンドポイントがトラフィックを受信または処理していないことを示し、エンドポイントの障害、ルーティングの問題、またはアップストリームサービスの停止を示唆する可能性があります。アクティブなエンドポイントからのデータ欠損自体がインシデントのシグナルであるため、TreatMissingData は breaching に設定されています。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker` | `Invocation4XXErrors` | プロアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | クライアント側エラー（4xx）を追跡します。継続的な増加は、5XX 障害に発展する前に、ペイロードスキーマのドリフト、認証の問題、または設定ミスのあるアップストリーム呼び出し元を示している可能性があります。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `CPUUtilization` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | エンドポイントインスタンスの CPU 使用率です。レイテンシーのスパイクと相関させてリソースの飽和を特定し、Auto Scaling ポリシーを検証してください。拡張インスタンスメトリクスが必要です。 |
| カスタマーエクスペリエンス、信頼性 | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `MemoryUtilization` | プロアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | エンドポイントインスタンスのメモリ使用率です。メモリ圧迫が高いとコンテナの OOM や推論の失敗を引き起こす可能性があります。拡張インスタンスメトリクスが必要です。 |

##### SageMaker AI Insights（推論エンドポイントに推奨）

リアルタイム推論では、**Amazon SageMaker AI Insights**（SageMaker AI の*詳細なオブザーバビリティ*）を有効にしてください — これはエンドポイント向けに推奨される、より深いオブザーバビリティレイヤーです。これは **OpenTelemetry（OTel）上に構築**されています。SageMaker は、エンドポイントを支える**すべてのインスタンス上で AWS マネージドの OTel Collector を実行**します（お客様がデプロイまたは運用するエージェントはありません）。そのコレクターは次のものを収集します。

- NVIDIA **DCGM** エクスポーターからの **GPU アクセラレーターメトリクス**、
- node exporter からの**ホスト/ノードメトリクス**（CPU、メモリ、ディスク）、および
- モデルコンテナ（**vLLM / SGLang**）からスクレイプされた**推論フレームワークメトリクス**、

そして、豊富なラベル（エンドポイント名、推論コンポーネント、インスタンス ID、アベイラビリティーゾーン、インスタンスタイプ）を付けて、**OTLP 経由で OTel メトリクスとして CloudWatch に**公開します。これらは CloudWatch に OTel メトリクスデータとしてネイティブに保存され、**PromQL でクエリ可能**です — CloudWatch の **SageMaker AI Insights ダッシュボード**、**CloudWatch Query Studio**、またはリージョナルな **PromQL エンドポイント**（SigV4 認証）経由で **Amazon Managed Grafana / セルフホスト Grafana** から利用できます。

###### 推奨事項：有効にする

- **本番の推論エンドポイントで詳細なオブザーバビリティを有効にしてください**（SageMaker AI コンソール → エンドポイント → *Observability*、または API 経由）。**管理するコレクターはありません** — サービスによって提供されます。
- 上記の従来の `AWS/SageMaker` メトリクスでは表現できない **GPU 対応および LLM 対応のインシデント検出**（GPU の飽和/温度、KV キャッシュの圧迫、トークンスループット、time-to-first-token）に使用してください。
- **PromQL**（CloudWatch のアラーム内 PromQL）でクエリとアラームを設定し、リージョナルな PromQL エンドポイントに対して Grafana ダッシュボードを構築してください。

###### 監視すべき主要な OTel メトリクス

| レイヤー | メトリクス | 何がわかるか |
|---|---|---|
| GPU (DCGM) | `DCGM_FI_DEV_GPU_UTIL` | GPU 使用率（%）。継続的に約 100% の場合はコンピューティングバウンド、負荷がかかっているのに 0% 近辺の場合はモデルが停止または誤配置されています。 |
| GPU (DCGM) | `DCGM_FI_DEV_FB_USED` / `DCGM_FI_DEV_FB_FREE` | GPU フレームバッファメモリの使用量/空き容量（バイト）。メモリがほぼ満杯の場合、OOM やロード失敗のリスクがあります。 |
| GPU (DCGM) | `DCGM_FI_DEV_GPU_TEMP` | GPU 温度（°C） — サーマルスロットリングのリスクです。 |
| GPU (DCGM) | `DCGM_FI_DEV_SM_ACTIVE` | ストリーミングマルチプロセッサのアクティブ率（%） — 実際のコンピューティング稼働とアイドル状態の比較です。 |
| Inference (vLLM/SGLang) | `TTFT` | Time to First Token（ヒストグラム） — ユーザーが体感する主要な LLM レイテンシーです。p99 にアラームを設定してください。 |
| Inference (vLLM/SGLang) | `InterTokenLatency` | トークン間レイテンシー（ヒストグラム） — ストリーミングの滑らかさを示します。 |
| Inference (vLLM/SGLang) | `TotalTPS` / `OutputTokensPerSecond` / `TPSUtilization` | トークンスループットと、キャパシティにどれだけ近づいているかを示します。 |
| Inference (vLLM/SGLang) | `KVCacheUtilization` | KV キャッシュの使用率（%）。値が高いとリクエストのキューイングや拒否が発生します。 |
| Inference (vLLM/SGLang) | `QueueDepth` / `BatchSize` | 待機中のリクエストと処理中のリクエストの比較 — 飽和とバッチ処理の健全性を示します。 |
| Inference (per IC) | `5XXErrorRatePerIC` / `4XXErrorRatePerIC` | 推論コンポーネントごとのサーバー/クライアントエラー率です。 |
| Endpoint | `ICECount` | Insufficient Capacity Errors — キャパシティによってスケーリングがブロックされています。 |
| Endpoint | `InstanceCountPerEndpoint` / `ScalingAction` / `E2EScalingLatency` | フリートサイズ、スケーリングイベント、スケーリングにかかる時間を示します。 |
| Node | `node_memory_MemAvailable_bytes` / `node_cpu_seconds_total` / `node_filesystem_avail_bytes` | インスタンスレベルの CPU / メモリ / ディスクの余裕を示します。 |
| Lifecycle | `ColdStartDuration` / `ModelDownloadTime` / `GPULoadTime` | 新しいインスタンスのコールドスタートとモデルロードのレイテンシーです。 |

> 注：`ModelLatencyPerIC` / `InvocationsPerIC` は CloudWatch の従来のメトリクスとしてのみ利用可能です。OTel ネイティブのレイテンシーシグナルには、フレームワークメトリクスの `vllm:e2e_request_latency_seconds` を使用してください。

###### PromQL クエリの例

CloudWatch は、これらの OTel メトリクスに対して **PromQL**（Prometheus 3.0 仕様）をサポートしています — Query Studio および PromQL ベースのアラームで利用できます。正確なラベルキーは、お使いのアカウントでラベルディスカバリ（`/api/v1/labels`）を使用して確認してください。また、クエリの制限（1 クエリあたり最大 7 日間の範囲）にも注意してください。

```promql
# Average GPU utilization (%) per endpoint
avg by (EndpointName) (DCGM_FI_DEV_GPU_UTIL)

# GPU framebuffer memory used ratio per instance — alert near 1.0 (OOM risk)
sum by (InstanceId) (DCGM_FI_DEV_FB_USED)
  / sum by (InstanceId) (DCGM_FI_DEV_FB_USED + DCGM_FI_DEV_FB_FREE)

# p99 Time-To-First-Token (seconds) per endpoint (vLLM/SGLang)
histogram_quantile(0.99, sum by (le, EndpointName) (rate(TTFT[5m])))

# Total output tokens/sec per endpoint
sum by (EndpointName) (OutputTokensPerSecond)

# KV-cache utilization (%) — high values cause request queuing
max by (EndpointName) (KVCacheUtilization)

# Server-side error rate per inference component
sum by (InferenceComponentName) (5XXErrorRatePerIC)

# Insufficient Capacity Errors (auto-scaling is blocked)
sum by (EndpointName) (ICECount)

# GPU thermal throttling risk — endpoints with any GPU above 85°C
max by (EndpointName) (DCGM_FI_DEV_GPU_TEMP) > 85
```

##### 追加メモ

- **CloudWatch エージェント経由の OpenTelemetry（OTEL） — カスタム推論メトリクス：** ADOT SDK でモデルコンテナを計装し、CloudWatch エージェントの OTLP エンドポイント経由でカスタム OTEL メトリクス（モデルバージョンごとのレイテンシー、バッチサイズの分布など）をカスタム CloudWatch 名前空間に送信してください。これにより、組み込みの `AWS/SageMaker` 名前空間を、ネイティブには利用できないアプリケーションレベルのシグナルで補完できます。
- **CloudWatch Application Signals：** SageMaker エンドポイントが顧客向けアプリケーションのフロントにある場合は、Application Signals を有効にして `ApplicationSignals` 名前空間で SLO バーンレートアラームを取得してください。これにより、手動のメトリクス数式なしで自動的にレイテンシー/エラーの SLO が提供されます。
- **`ModelLatency` と `InvocationsPerInstance` の異常検知：** エンドポイントごとのベースライン化が必要な静的な p99 しきい値ではなく、各エンドポイントのトラフィックパターンに適応する CloudWatch 異常検知バンドの使用を検討してください — 負荷プロファイルが変動するエンドポイントで特に有用です。
- **SageMaker Inference Components（マルチモデルエンドポイント）：** 新しいマルチモデルまたは推論コンポーネントのデプロイでは、メトリクスが推論コンポーネントごとにもスコープされます。エンドポイントの集約メトリクスの背後でモデルごとのパフォーマンス低下が隠れないように、コンポーネントレベル（ディメンション `InferenceComponentName`）でアラームを設定してください。


#### Lex V2

Amazon Lex V2 は、アプリケーション、コンタクトセンター、IVR システムに会話型インターフェイス（チャットボットおよびボイスボット）を構築するためのフルマネージドな AI サービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimeSystemErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lex からの 5xx サーバー側エラーをカウントします。ボットの設定が原因ではなく — Lex サービスの問題を示します。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimeThrottledEvents` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | TPS 制限の超過により Lex によってスロットリングされたリクエストをカウントします。顧客が実際に IVR から拒否されています。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimeConcurrency` | プロアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 同時アクティブ会話数を測定します。デフォルト値：50（テキスト）、125（音声 RecognizeUtterance）、200（音声 StartConversation）。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimeLambdaErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lambda のフルフィルメント/検証エラーです。ボットがデータディップを完了できない、またはインテントをフルフィルできません。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimeInvalidLambdaResponses` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lex が解析できなかった Lambda レスポンスです。Lambda レスポンス形式のコードバグを示します。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Lex V2 | `AWS/Lex` | `RuntimePollyErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Polly TTS のエラーです。ボットが音声発信者に応答を話せず — 無音が聞こえます。 |
| カスタマーエクスペリエンス | Amazon Lex V2 | `AWS/Lex` | `MissedUtteranceCount` | プロアクティブ | Statistic = Sum; Period = 300s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | ボットがどのインテントにもマッチできなかった発話をカウントします。継続的な増加は、ボットの品質低下、またはまだモデル化されていない新しいユーザーインテントを示します。リージョンでの利用可否を確認してください。 |

##### 追加メモ

- **スロットリングの異常検知：** 静的なしきい値ではなく、`RuntimeThrottledEvents` と `RuntimeConcurrency` に CloudWatch 異常検知を使用することを検討してください — 会話トラフィックは季節性が非常に強い場合があります（コンタクトセンターの通話量が休日やマーケティングイベントの前後に急増するなど）。
- **フルフィルメント Lambda の OpenTelemetry（OTEL）：** **ADOT SDK**（Lambda レイヤー）または **CloudWatch Application Signals** で Lex のフルフィルメント Lambda 関数を計装し、レイテンシー、エラー率、コールドスタートのメトリクスを取得してください。これにより、Lex → Lambda → ダウンストリームサービスのエンドツーエンドトレースが提供され、`RuntimeLambdaErrors` メトリクスを根本原因のコンテキストで補完できます。
- **CloudWatch Application Signals：** Lex が顧客向けアプリケーション（コンタクトセンターや Web チャットボットなど）のフロントにある場合、Application Signals は `ApplicationSignals` 名前空間で SLO バーンレートアラームを提供し、継続的な会話品質の低下を捕捉できます。
- **Lex V2 の会話分析：** 2023 年頃以降、Lex V2 はインテント認識の信頼度、スロット収集の成功率、会話パス分析などのメトリクスを備えた組み込み分析機能を提供しています。これらを CloudWatch アラームと組み合わせて、プロアクティブなボット品質の監視を行ってください。
- **マルチチャネルとストリーミングの考慮事項：** ストリーミング `StartConversation` API を使用するボイスボットの場合、アカウントのストリーミング同時実行制限に対する `RuntimeConcurrency` と、アップストリームの Amazon Connect またはテレフォニー統合の健全性の両方を監視してください。音声チャネルでの Lex のスロットリングイベントは、発信者に即座に影響します（通話の切断または無音）。
- **Lambda レスポンスの検証：** `RuntimeInvalidLambdaResponses` については、Lambda レスポンスのスキーマを Lex V2 が期待する形式に対して検証するデプロイ前のコントラクトテストステップの追加を検討してください — 形式のバグが本番環境に到達する前に捕捉することで、この種のランタイムエラーを完全に排除できます。


#### Amazon Connect

Amazon Connect は、組織が音声、チャット、タスクの各チャネルで大規模にカスタマーサービスを提供できるようにするクラウドベースのコンタクトセンターサービスです。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentCalls` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、インスタンス内の同時アクティブ音声通話数を測定します。インスタンス内の最大 ConcurrentCalls の約 80%～85% でアラームをトリガーするようしきい値を設定できるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentCallsPercentage` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、インスタンスで使用されている同時アクティブ音声通話のサービスクォータの割合を測定します。監視するのに適したメトリクスですが、出力は小数形式で提供されます。この点を踏まえ、インスタンス内の最大 ConcurrentCalls の 80%～85% にあたる約 0.8～0.85 でアラームをトリガーするようしきい値を設定できます。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentActiveChats` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、インスタンス内の同時アクティブチャット数を測定します。インスタンス内の最大 ConcurrentActiveChats の約 80%～85% でアラームをトリガーするようしきい値を設定できるため、監視するのに適したメトリクスです。2018 年 10 月以前に作成されたインスタンスでは、チャットメトリクスを CloudWatch に公開するために追加の IAM アクセス許可が必要です。必要な IAM アクセス許可。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentActiveChatsPercentage` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、インスタンスで使用されている同時アクティブチャットのサービスクォータの割合を測定します。出力は整数形式で提供されます。たとえば、チャットの 1% は 0.01 ではなく 1 として表示されます。インスタンス内の最大 ConcurrentActiveChatsPercentage の約 80%～85% でアラームをトリガーするようしきい値を設定できるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentTasks` | プロアクティブ | Statistic = Maximum; Period = 300 seconds; DatapointsToAlarm = 2; TreatMissingData = notBreaching | このメトリクスは、インスタンス内の同時アクティブタスク数を測定します。インスタンス内の最大 ConcurrentTasks の約 80%～85% でアラームをトリガーするようしきい値を設定できるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentTasksPercentage` | プロアクティブ | Statistic = Maximum; Period = 300 seconds; DatapointsToAlarm = 2; TreatMissingData = notBreaching | このメトリクスは、インスタンスで使用されている同時アクティブタスクのサービスクォータの割合を測定します。出力は整数形式で提供されます。たとえば、タスクの 1% は 0.01 ではなく 1 として表示されます。インスタンス内の最大 ConcurrentTasks の約 80%～85% でアラームをトリガーするようしきい値を設定できるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `CallRecordingUploadError` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、インスタンス用に設定された Amazon S3 バケットへのアップロードに失敗した通話録音の数を測定します。これは、インスタンスの Data Storage > Call Recordings 設定で指定されたバケットです。通話録音が Amazon S3 にアップロードできない問題を通知できるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ContactFlowFatalErrors` | リアクティブ | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | このメトリクスは、システムエラーによりフローの実行が失敗した回数を測定します。コンタクトフローの失敗を引き起こすシステムエラーを通知し、それが Amazon Connect のサービス問題を示している可能性があるため、監視するのに適したメトリクスです。 |
| カスタマーエクスペリエンス、信頼性 | Amazon Connect | `AWS/Connect` | `ConcurrentWebRTCConnections` | プロアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Connect エージェントワークスペースにおける同時 WebRTC ソフトフォン接続を追跡します。PSTN の同時通話とは独立してソフトフォンのキャパシティ枯渇を検出するため、インスタンス制限の 80～85% でアラームを設定してください。お使いのインスタンスでの利用可否を確認してください。 |

##### 追加メモ

- **CloudWatch Application Signals：** Amazon Connect が顧客向けアプリケーション（カスタムエージェントワークスペースや Web アプリに埋め込まれた CCP など）のフロントにある場合、`ApplicationSignals` 名前空間で SLO バーンレートアラームを取得してエージェントが体験するエンドツーエンドのレイテンシーとエラー率を追跡するために、CloudWatch Application Signals の有効化を検討してください。
- **同時実行メトリクスの異常検知：** `ConcurrentCalls` と `ConcurrentActiveChats` に静的な 80～85% のしきい値を設定するのではなく、インスタンスの時間帯や曜日のパターンに適応する CloudWatch 異常検知バンドの使用を検討してください — 季節ごとに需要が変動するコンタクトセンターで特に有用です。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL） — カスタムエージェントテレメトリ：** カスタムのエージェントデスクトップアプリケーションや Lambda ベースの統合を計装している場合、CloudWatch エージェントは OTEL メトリクス（エージェントのログインレイテンシー、カスタム統合のエラー率など）を、お客様が定義したカスタム名前空間で CloudWatch に転送でき、ネイティブの `AWS/Connect` メトリクスを補完します。
- **Contact Lens の分析メトリクス：** Amazon Connect Contact Lens はリアルタイム分析を公開します。感情関連のメトリクスの監視と、キャパシティのしきい値（ConcurrentCalls）と品質シグナル（ContactFlowFatalErrors）を組み合わせた Composite Alarms の作成を検討し、よりきめ細かいアラート体制を構築してください。
- **Service Quotas 統合によるサービスクォータアラーム：** AWS Service Quotas は CloudWatch と統合されました。パーセンテージを手動で計算することなくクォータ使用率のアラームを取得するため、Amazon Connect 向けに `AWS/Usage` 名前空間と `ServiceQuota` メトリクスの使用を検討してください。


### メディア

#### Elemental Media Services

**AWS Elemental Media Services**（MediaLive、MediaPackage、MediaConvert）のインシデント検出用の推奨 CloudWatch アラームです。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| カスタマーエクスペリエンス | AWS Elemental MediaLive | AWS/MediaLive | `SvqTime` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | MediaLive がリアルタイムで出力を送出するために品質の最適化を低下させた時間の割合です。SVQ は speed vs quality（速度対品質）を意味します。エンコーディングはリアルタイム出力と可能な限り最高の品質とのバランスを取ります — MediaLive が追いつくために品質を低下させなければならない場合があります。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaLive | AWS/MediaLive | `Output5xxErrors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 出力の配信中に宛先から受信した 5xx HTTP エラーの数です。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaPackage | AWS/MediaPackage | `EgressResponseTime` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | MediaPackage が各出力リクエストの処理に要する時間です。その間隔で MediaPackage が出力リクエストを受信しない場合、データはありません。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaPackage | AWS/MediaPackage | `IngressResponseTime` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | MediaPackage が各入力リクエストの処理に要する時間です。その間隔で MediaPackage が入力リクエストを受信しない場合、データはありません。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaPackage | AWS/MediaPackage | `StatusCodeRange` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 指定されたステータスコード範囲について表示されるメトリクスです。値：2xx、3xx、4xx、または 5xx。 |
| 信頼性 | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsCanceledCount` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | キュー内でキャンセルされたジョブの数です。急激な増加は、ジョブの送信または基盤となるインフラストラクチャに問題があることを示している可能性があります。 |
| 信頼性 | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsCompletedCount` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | キュー内で完了したジョブの数です。データが欠損している場合、ジョブ処理に問題がある可能性を示していることがあります。 |
| 信頼性 | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsErroredCount` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | 無効な入力（例：指定された入力バケットに存在しないファイルのトランスコード）が原因で失敗したジョブの数です。動画ワークフローの問題に対処するため、エラーが発生したジョブについてアラートを発生させます。 |
| 信頼性、レイテンシー | AWS Elemental MediaConvert | AWS/MediaConvert | `StandbyTime` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = notBreaching | ジョブが MediaConvert によって処理されるまでの待機時間（ミリ秒）です。待機時間が長い場合、適時の完了を確保するために調査が必要なインフラストラクチャ/アプリケーションの問題を示している可能性があります。 |
| 信頼性、レイテンシー | AWS Elemental MediaConvert | AWS/MediaConvert | `TranscodingTime` | プロアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | MediaConvert がトランスコードを完了するまでの時間（ミリ秒）です。急激または継続的な増加は、エンコードジョブに影響を与えるパフォーマンスのボトルネックを示唆している可能性があります。 |
| 信頼性 | AWS Elemental MediaConvert | AWS/MediaConvert | `Errors` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = notBreaching | 特定の API 呼び出しの実行中に発生したエラーです。対象の操作には CreateJob、GetJob、ListJobs、ListPresets、ListQueues、ListTagsForResource、Subscribe が含まれます。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaLive | AWS/MediaLive | `InputVideoFrameRate` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 現在の入力ビデオフレームレートです。ゼロへの低下または想定レートからの大幅な逸脱は、ライブチャネルでの入力喪失を示します。 |
| 信頼性 | AWS Elemental MediaLive | AWS/MediaLive | `PrimaryInputActive` | リアクティブ | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | プライマリ入力パイプラインがアクティブ（1）かフェイルオーバー済み（0）かを示します。冗長チャネルでの入力フェイルオーバーイベントを検出するため、値が 0 に低下した場合にアラームを設定します。 |
| カスタマーエクスペリエンス、信頼性 | AWS Elemental MediaLive | AWS/MediaLive | `FillMsec` | リアクティブ | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 挿入された入力バッファのフィル/ギャップコンテンツの時間（ミリ秒）です。値が高い場合は入力の枯渇を示します — ソースの配信が十分に速くないため、チャネルがフィルフレームを生成しています。ライブチャネルにとって重要です。 |

##### 追加メモ

- **Media Services Workflow Monitor：** AWS は現在、メディアパイプライン（MediaLive → MediaPackage → CloudFront など）を自動検出し、シグナルマップを構築して、チェーン全体にわたる推奨 CloudWatch アラームとイベントを作成する **Media Services Workflow Monitor** を提供しています。顧客に影響を与えるインシデントを検出するための出発点として、手作業で構築したサービスごとのアラームよりもこれを優先してください。
- **MediaPackage v2（ライブ）：** **MediaPackage v2** を使用している場合は、現在の名前空間/メトリクス名を確認してください（従来の `AWS/MediaPackage` とは異なります）。エグレスリクエストエラーとオリジネーションレイテンシーにアラームを設定します。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** Media Services はネイティブの `AWS/Media*` メトリクスを出力します。`JobsErroredCount` のスパイクを送信元のワークフローと相関付けるため、カスタムのコントロールプレーン/オーケストレーションコンポーネント（例：MediaConvert ジョブを送信する Lambda）で ADOT SDK（CloudWatch エージェントに OTLP を送信）を使用してください。
- **異常検知：** `SvqTime`、レスポンスタイム、`TranscodingTime` は、静的なしきい値なしで品質/レイテンシーの劣化を捉えるための異常検知バンドに適しています。


### IoT & Edge

#### IoT Core

**AWS IoT Core** のインシデント検出用の推奨 CloudWatch アラームです。いくつかのメトリクスは、成功/失敗の割合を表現するために**メトリクス数式の比率**（`m*`）を使用します。

> 一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | リアクティブ/プロアクティブ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | IoT Core | AWS/IoT | `(m1/(m1+m2))*100`（`m1 = Failure`、`m2 = Success`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | IoT デバイスオペレーション全体の成功率を監視し、IoT システムの信頼性とパフォーマンスに関する洞察を提供します。 |
| 信頼性 | IoT Core | AWS/IoT | `(m1/(m1+m2))*100`（`m1 = Connect.ServerError`、`m2 = Connect.Success`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | IoT デバイスとクラウドサービス間の接続の問題を特定してトラブルシューティングし、信頼性の高い通信を確保するのに役立ちます。 |
| 信頼性 | IoT Core | AWS/IoT | `(m1/(m1+m2))*100`（`m1 = PublishIn.ServerError`、`m2 = PublishIn.Success`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | `PublishIn.ServerError` メトリクスは、IoT デバイスがクラウドサービスまたは IoT プラットフォームにデータ/メッセージを発行しようとした際のサーバーエラー数を追跡します。 |
| 信頼性 | IoT Core | AWS/IoT | `Connect.Throttle` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 接続スロットリングイベントの数を監視します。これは、過剰な接続試行や IoT インフラストラクチャの潜在的な問題を示す可能性があります。 |
| 信頼性 | IoT Core | AWS/IoT | `Ping.Success` | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | IoT デバイスとクラウドサービス間の接続性/到達性の成功率を測定し、信頼性の高い通信を確保してネットワークの問題を特定するのに役立ちます。 |
| 信頼性 | IoT Core | AWS/IoT | `(m1/(m1+m2))*100`（`m1 = Subscribe.ServerError`、`m2 = Subscribe.Success`） | リアクティブ | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | サブスクライブオペレーションのサーバーエラー率を監視します。率の上昇は、デバイスがトピックにサブスクライブできず、ダウンストリームのメッセージ配信が機能しなくなっていることを示します。 |
| 信頼性 | IoT Core | AWS/IoT | `RuleMessageThrottled` | リアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Rules Engine によってスロットリングされたメッセージ数です。ルール評価のキャパシティを超過しており、アクション（DynamoDB、Kinesis、Lambda など）へのダウンストリーム配信が失敗していることを示します。 |
| 信頼性 | IoT Core | AWS/IoT | `RulesExecuted` | プロアクティブ | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | 実行されたルールの総数です。異常検知またはゼロへの低下アラームを使用して、ルール評価の失敗やトラフィックの喪失を検出してください。 |

##### 追加メモ

- **比率アラームは引き続きベストプラクティス：** `(error/(error+success))*100` のパターンは、変動するデバイスフリートに対するまさに正しい最新のアプローチです。pub/sub を完全にカバーするために、`PublishOut.ServerError`/`PublishOut.Success` の比率を追加することを検討してください。
- **デバイス側のフリートヘルス：** セキュリティ/動作の異常（予期しない切断、メッセージレートのスパイク）を捉えるために、**AWS IoT Device Defender** の検出メトリクスと**フリートインデックス**のシグナルを追加してください — これは接続性に焦点を当てたこの表ではカバーされていない観点です。
- **Rules Engine のアクションごとのエラー：** `RuleMessageThrottled` に加えて、アクションごとのエラーメトリクス（`ErrorActionExecution`、`TopicMatch`）にアラームを設定し、特定のターゲット（DynamoDB/Kinesis/Lambda）へのダウンストリーム配信の失敗を捕捉してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL）：** IoT Core のメトリクスはネイティブの `AWS/IoT` です。デバイスデータを消費するバックエンド（Lambda/Kinesis/コンテナ）では、ADOT SDK と CloudWatch エージェントを使用してメッセージをエンドツーエンドでトレースし、`PublishIn.ServerError` をダウンストリームの飽和と関連付けてください。
- **`TreatMissingData = Breaching` の注意点：** いくつかの行では欠損データを breaching として扱っています — これはデータの欠如が接続障害を意味する常時接続のフリートには適していますが、断続的に接続するデバイスでは誤報となります。フリートごとに調整してください。


#### Outposts

AWS Outposts は、AWS のインフラストラクチャ、サービス、ツールをオンプレミス施設に拡張し、ローカルシステムへの低レイテンシーアクセスやローカルでのデータ処理を必要とするワークロードに一貫したハイブリッド体験を提供します。一般的なガイドラインです — ご自身の環境に合わせてしきい値を調整してください。

| ビジネス目標 | AWS サービス | 名前空間 | メトリクス名 | アラームタイプ | 推奨アラーム設定 | ユースケース |
|---|---|---|---|---|---|---|
| 信頼性 | AWS Outposts | `AWS/Outposts` | `ConnectedStatus` | リアクティブ | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | ConnectedStatus メトリクスは、Outpost とその関連サービス間のネットワーク接続のステータスを監視します。接続が正常な場合は 1、障害がある場合は 0 の値を発行します。Average 集約を適用することで、持続的な接続障害を検出するために < 1 のアラームしきい値を設定できます。 |
| 信頼性 | AWS Outposts | `AWS/Outposts` | `VifConnectionStatus` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | このメトリクスは、仮想インターフェイス（VIF）がトラフィックを転送する準備ができているかどうかを示します。単位：1 または 0。1 – Outpost の VIF がオンプレミスデバイスに正常に接続され、設定が完了し、トラフィックを転送する準備ができていることを示します。0 – Outpost の VIF がトラフィックを転送する準備ができていないことを示します。 |
| 信頼性 | AWS Outposts | `AWS/Outposts` | `VifBgpSessionState` | リアクティブ | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | このメトリクスは、AWS Outposts の仮想インターフェイス（VIF）とオンプレミスデバイス間の Border Gateway Protocol（BGP）セッションの状態を監視します。単位：1 から 6 の値。1 – Idle。Outposts ラックが開始イベントを待機している初期状態です。2 – Connect。Outposts ラックが TCP 接続の完了を待機しています。3 – Active。Outposts ラックが TCP 接続の確立を試みています。4 – OpenSent。ルーターが OPEN メッセージを送信し、応答を待機しています。5 – OpenConfirm。ルーターが OPEN メッセージを受信し、KEEPALIVE メッセージを待機しています。6 – Established。BGP 接続が完全に確立され、Outposts ラックとオンプレミスデバイスがルーティング情報を交換できます。状態が確立されるのは値が 6 の場合のみであるため、状態が 6 未満の場合にアラームを設定するしきい値を推奨します。 |
| 信頼性 | AWS Outposts | `AWS/Outposts` | `AvailableInstanceCapacity` | プロアクティブ | Statistic = Average; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | Outpost 上の残りのインスタンスキャパシティです。残量が少ない場合にアラームを設定して、ワークロードの起動に失敗する前にコンピューティングの枯渇をプロアクティブに検出します。ご自身の Outpost 構成での利用可否を確認してください。 |
| 信頼性 | AWS Outposts | `AWS/Outposts` | `UsedInstanceCapacity` | プロアクティブ | Statistic = Average; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | 現在使用中のインスタンスキャパシティです。使用率が高い場合（例：80–90%）にアラームを設定して、キャパシティが完全に枯渇する前にプロアクティブなスケーリングやワークロードの再配分をトリガーします。ご自身の Outpost 構成での利用可否を確認してください。 |

##### 追加メモ

- **ConnectedStatus の異常検知：** `ConnectedStatus` には 1 未満という静的しきい値が機能しますが、期間全体で平均化した際にバイナリのしきい値では見逃す可能性のある微妙な断続的な接続品質の低下パターン（例：短時間のフラッピング）を捕捉するために、Average 統計に対する CloudWatch 異常検知の使用を検討してください。
- **CloudWatch エージェント経由の OpenTelemetry（OTEL） — オンプレミスワークロード：** Outposts 上で実行されるワークロードは、CloudWatch エージェントとその OTLP エンドポイントを使用して、ご自身が定義した名前空間の下にカスタム OTEL メトリクスを CloudWatch に送信できます。これは、Outpost ラック自体にデプロイされたサービスのアプリケーション層のヘルスを監視するのに特に有用で、インフラストラクチャレベルの `AWS/Outposts` メトリクスを補完します。
- **接続性の状態に対する複合アラーム：** `ConnectedStatus`、`VifConnectionStatus`、`VifBgpSessionState` を CloudWatch 複合アラームに組み合わせて、複数の接続性シグナルが同時に低下した場合にのみ発報させることで、一時的な単一メトリクスの変動によるアラートノイズを削減します。
- **TreatMissingData = Breaching の根拠：** 出典ではすべての Outposts メトリクスに対して正しく `Breaching` を使用しています。Outpost がリージョンへの接続を失うと、CloudWatch はデータポイントの受信を停止します — 欠損データを breaching として扱うことで、アラームが検出するように設計されたまさにその障害シナリオの間にアラームが発報されることが保証されます。
- **ローカルの CloudWatch エージェントのバッファリング：** Outposts はリージョンへの接続が中断されることがあるため、一時的な切断中にメトリクスが失われないよう、ローカルインスタンス上の CloudWatch エージェントに永続的なディスクベースのバッファリングを設定してください。


## 関連リソース

- [アラームとアラーティング](../cloudwatch-alarms-alerting/) — アラーム設計方法論（しきい値、コンポジットアラーム、ルーティング、PromQL）
- [CloudWatch メトリクスと EMF](../cloudwatch-metrics/) — これらのアラームの基盤となるメトリクス
- [AWS サービスの推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) — サービスごとのアラーム推奨に関する AWS リファレンス
- [PromQL で CloudWatch メトリクスをクエリする](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL.html)
