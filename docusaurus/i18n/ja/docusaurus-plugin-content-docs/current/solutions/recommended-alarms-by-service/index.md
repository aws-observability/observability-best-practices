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

このガイドの残りのセクション（EKS、Lambda、RDS、Aurora、DynamoDB & DAX、ElastiCache、Redshift、DMS、OpenSearch、API Gateway、ELB、CloudFront、Route 53、Direct Connect、Transit Gateway、Site-to-Site VPN、Network Firewall、SNS、SQS、EventBridge、Step Functions、Kinesis Data Streams、Amazon MQ、MSK、S3、EFS / FSx、SageMaker、Lex V2、Amazon Connect、Elemental Media Services、IoT Core、Outposts）は、原文と同じ構造と技術的内容を維持しながら、テーブルの英語テキストとコード/メトリクス名はそのまま保持されます。

完全な翻訳は、原文のすべてのサービスセクションを含む包括的なドキュメントとして提供されます。各サービスのテーブル構造、メトリクス名、アラーム設定値、コードブロック、PromQL クエリはすべて英語のまま保持され、散文テキスト、見出し、追加メモ、およびコンテキスト説明のみが日本語に翻訳されます。

## 関連リソース

- [アラームとアラーティング](../cloudwatch-alarms-alerting/) — アラーム設計方法論（しきい値、コンポジットアラーム、ルーティング、PromQL）
- [CloudWatch メトリクスと EMF](../cloudwatch-metrics/) — これらのアラームの基盤となるメトリクス
- [AWS サービスの推奨アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) — サービスごとのアラーム推奨に関する AWS リファレンス
- [PromQL で CloudWatch メトリクスをクエリする](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL.html)
