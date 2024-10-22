## 1.0 KPI (「ゴールデンシグナル」) の理解
組織は、ビジネスやオペレーションの健全性やリスクを示す主要業績評価指標 (KPI) 、いわゆる「ゴールデンシグナル」を活用しています。組織の異なる部門では、それぞれの成果を測定するためにユニークな KPI を設定しています。例えば、EC アプリケーションの製品チームは、カート注文を正常に処理できることを KPI として追跡します。オンコール運用チームは、インシデントの平均検知時間 (MTTD) を KPI として測定します。財務チームにとっては、予算内のリソースコストが KPI として重要です。

サービスレベル指標 (SLI)、サービスレベル目標 (SLO)、サービスレベル契約 (SLA) は、サービス信頼性管理の不可欠な要素です。このガイドでは、Amazon CloudWatch とその機能を使用して SLI、SLO、SLA を計算およびモニタリングするためのベストプラクティスを、明確かつ簡潔な例とともに説明します。

- **SLI (Service Level Indicator):** サービスのパフォーマンスを定量的に測定する指標。
- **SLO (Service Level Objective):** 目標とするサービスレベルを表す SLI の目標値。
- **SLA (Service Level Agreement):** サービスプロバイダーとユーザー間で、期待されるサービスレベルを規定する契約。

一般的な SLI の例:

- 可用性: サービスが稼働している時間の割合
- レイテンシー: リクエストを処理するのにかかる時間
- エラー率: 失敗したリクエストの割合

## 2.0 顧客とステークホルダーの要件を発見する (以下のテンプレートを使用することを推奨)

1. 最初の質問から始めます: 「対象のワークロード (支払いポータル、eコマース注文配置、ユーザー登録、データレポート、サポートポータルなど) に対する事業価値または事業上の課題は何ですか?」
2. 事業価値をユーザーエクスペリエンス (UX)、ビジネスエクスペリエンス (BX)、オペレーショナルエクスペリエンス (OpsX)、セキュリティエクスペリエンス (SecX)、開発者エクスペリエンス (DevX) などのカテゴリに分解します。
3. 各カテゴリのコアシグナル、つまり "ゴールデンシグナル" を導出します。UX と BX に関するトップシグナルは、通常、ビジネスメトリクスを構成します。

| ID | 略語 | 顧客 | ビジネスニーズ | 測定項目 | 情報源 | 良い状態とは? | アラート | ダッシュボード | レポート |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | 例 | 外部エンドユーザー | ユーザーエクスペリエンス | レスポンスタイム (ページレイテンシ) | ログ/トレース | 99.9% で 5 秒未満 | いいえ | はい | いいえ |
| M2 | 例 | ビジネス | 可用性 | 成功した RPS (リクエスト/秒) | ヘルスチェック | 5 分間で 85% 以上 | はい | はい | はい |
| M3 | 例 | セキュリティ | コンプライアンス | 重大な非準拠リソース | 構成データ | 15 日以内に 10 未満 | いいえ | はい | はい |
| M4 | 例 | 開発者 | 機敏性 | デプロイ時間 | デプロイログ | 常に 10 分未満 | はい | いいえ | はい |
| M5 | 例 | オペレーター | 容量 | キューの深さ | アプリログ/メトリクス | 常に 10 未満 | はい | はい | はい |

### 2.1 ゴールデンシグナル

|カテゴリ	|シグナル	|備考	|参考資料	|
|---	|---	|---	|---	|
|UX	|パフォーマンス (レイテンシ)	|テンプレートの M1 を参照	|ホワイトペーパー: [可用性を超えて (レイテンシの測定)](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)	|
|BX	|可用性	|テンプレートの M2 を参照	|ホワイトペーパー: [可用性を超えて (可用性の測定)](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)	|
|BX	|ビジネス継続計画 (BCP)	|定義された RTO/RPO に対する Amazon Resilience Hub (ARH) のレジリエンススコア	|ドキュメント: [ARH ユーザーガイド (レジリエンススコアの理解)](https://docs.aws.amazon.com/ja_jp/resilience-hub/latest/userguide/resil-score.html)	|
|SecX	|(非) コンプライアンス	|テンプレートの M3 を参照	|ドキュメント: [AWS Control Tower ユーザーガイド (コンソールでのコンプライアンスステータス)](https://docs.aws.amazon.com/ja_jp/controltower/latest/userguide/compliance-statuses.html)	|
|DevX	|アジリティ	|テンプレートの M4 を参照	|ドキュメント: [AWS でのDevOps モニタリングダッシュボード (DevOps メトリクスリスト)](https://docs.aws.amazon.com/ja_jp/solutions/latest/devops-monitoring-dashboard-on-aws/devops-metrics-list.html)	|
|OpsX	|キャパシティ (クォータ)	|テンプレートの M5 を参照	|ドキュメント: [Amazon CloudWatch ユーザーガイド (サービスクォータの可視化とアラームの設定)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Quotas-Visualize-Alarms.html)	|
|OpsX	|予算の異常	|	|ドキュメント:<br/> 1. [AWS Billing and Cost Management (AWS コスト異常検出)](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/getting-started-ad.html) <br/> 2. [AWS Budgets](https://aws.amazon.com/jp/aws-cost-management/aws-budgets/)	|

## 3.0 トップレベルガイダンス 'TLG'

### 3.1 TLG 全般

1. ビジネス、アーキテクチャ、セキュリティチームと協力し、ビジネス、コンプライアンス、ガバナンスの要件を洗練させ、ビジネスニーズを正確に反映させることを支援します。これには[リカバリ時間とリカバリポイントの目標を設定する](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/)ことが含まれます (RTO、RPO)。可用性の[測定](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)やレイテンシ (例: 5分間の許容ウィンドウで一定割合の障害を許容するアップタイム) など、要件を測定する方法を策定します。

2. さまざまなビジネス機能の成果に合わせた、目的に応じたスキーマを持つ効果的な[タグ付け戦略](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)を構築します。これは特に[運用の監視可能性](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/tagging-best-practices/operational-observability.html)と[インシデント管理](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/tagging-best-practices/incident-management.html)をカバーする必要があります。

3. 可能な限り、ベースラインKPIがない指標については、ベースラインを確立するための機械学習アルゴリズムを提供する[CloudWatch異常検知](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)を使用して、アラームの動的しきい値を活用します。CWメトリクス (またはPrometheusメトリクスなどの他のソース) を公開する利用可能なAWSサービスを使用する場合、アラームノイズを減らすために[複合アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)の作成を検討します。例: 可用性を示すビジネスメトリクス (正常なリクエストで追跡) とレイテンシで構成され、デプロイ中にその両方が重要なしきい値を下回るとアラームが発報する複合アラームは、デプロイバグの決定的な指標となる可能性があります。

4. (注: AWS Business サポートまたはそれ以上が必要) AWS は、Personal Health Dashboard でリソースに関連する関心のあるイベントを AWS Health サービスで公開しています。AWS Health Aware (AHA) フレームワーク (AWS Healthを使用) を活用して、AWS Organizationから集約されたプロアクティブかつリアルタイムのアラートを中央アカウント (管理アカウントなど) から取り込みます。これらのアラートは、Slackなどの優先通信プラットフォームに送信でき、ServiceNowやJiraなどのITSMツールと統合できます。
![Image: AWS Health Aware 'AHA'](../../../images/AHA-Integration.jpg)

5. Amazon CloudWatch [Application Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) を活用して、リソースの最適なモニターを設定し、アプリケーションの問題の兆候を継続的にデータ分析します。また、監視対象のアプリケーションの潜在的な問題を示す自動ダッシュボードを提供し、アプリケーション/インフラストラクチャの問題を迅速に特定/トラブルシューティングできます。[Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を活用して、コンテナからメトリクスとログを集約し、CloudWatch Application Insightsとシームレスに統合できます。
![Image: CW Application Insights](../../../images/CW-ApplicationInsights.jpg)

6. [AWS Resilience Hub](https://aws.amazon.com/jp/resilience-hub/) を活用して、定義されたRTOとRPOに対してアプリケーションを分析します。[AWS Fault Injection Simulator](https://aws.amazon.com/jp/fis/) などのツールを使用した制御された実験により、可用性、レイテンシ、ビジネス継続性の要件が満たされているかを検証します。AWS のベストプラクティスに従ってビジネス要件を満たすようにワークロードが設計されていることを確認するため、さらにWell-Architectedレビューとサービス固有の深掘りを行います。

7. 詳細については、[AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/) ガイダンスの他のセクション、AWS Cloud Adoption Framework: [Operations Perspective](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-caf-operations-perspective/observability.html) ホワイトペーパー、およびAWS Well-Architected Framework Operational Excellence Pillarホワイトペーパーの「[ワークロードの健全性の理解](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/operational-excellence-pillar/understanding-workload-health.html)」のコンテンツを参照してください。

### 3.2 ドメイン別の TLG (UX、BX などのビジネスメトリクスに重点)

CloudWatch (CW) などのサービスを使用した適切な例を以下に示します ([CloudWatch メトリクスのドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) を参照)。

#### 3.2.1 Canary (別名: 合成トランザクション) と Real-User Monitoring (RUM)

* TLG: クライアント/顧客の体験を理解する最も簡単で効果的な方法の1つは、Canary (合成トランザクション) を使用してサービスを定期的にプローブし、メトリクスを記録することです。

|AWS サービス	|機能	|測定項目	|メトリクス	|例	|備考	|
|---	|---	|---	|---	|---	|---	|
|CW	|Synthetics	|可用性	|**SuccessPercent**	|(例: SuccessPercent > 90 または 1分間隔の CW 異常検出)<br/>**[平日の 7 時から 8 時に Canary が実行される場合の SuccessPercent の Metric Math (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)&lt;6) AND (HOUR(m1)>7 AND HOUR(m1)&lt;8)),m1)]`	|	|
|	|	|	|	|	|	|
|CW	|Synthetics	|可用性	|VisualMonitoringSuccessPercent	|(例: UI スクリーンショットの比較のために、5分間隔で VisualMonitoringSuccessPercent > 90)<br/>**[平日の 7 時から 8 時に Canary が実行される場合の SuccessPercent の Metric Math (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)&lt;6) AND (HOUR(m1)>7 AND HOUR(m1)&lt;8)),m1)`	|顧客が Canary が予め決められた UI スクリーンショットと一致することを期待する場合	|
|	|	|	|	|	|	|
|CW	|RUM	|レスポンスタイム	|Apdex スコア	|(例: Apdex スコア: <br/> NavigationFrustratedCount &lt; '期待値 N')	|	|
|	|	|	|	|	|	|

#### 3.2.2 API フロントエンド

|AWS サービス	|機能	|測定項目	|メトリクス	|例	|備考	|
|---	|---	|---	|---	|---	|---	|
|CloudFront	|	|可用性	|合計エラー率	|(例: [合計エラー率] &lt; 10 または 1 分間の CW 異常検出)	|エラー率を可用性の指標とする	|
|	|	|	|	|	|	|
|CloudFront	|(追加メトリクスを有効にする必要あり)	|パフォーマンス	|キャッシュヒット率	|(例: キャッシュヒット率 &lt; 10 の 1 分間の CW 異常検出)	|	|
|	|	|	|	|	|	|
|Route53	|ヘルスチェック	|(クロスリージョン) 可用性	|HealthCheckPercentageHealthy	|(例: [HealthCheckPercentageHealthy の最小値] > 90 または 1 分間の CW 異常検出)	|	|
|	|	|	|	|	|	|
|Route53	|ヘルスチェック	|レイテンシー	|TimeToFirstByte	|(例: [p99 TimeToFirstByte] &lt; 100 ms または 1 分間の CW 異常検出)	|	|
|	|	|	|	|	|	|
|API Gateway	|	|可用性	|カウント	|(例: [(4XXError + 5XXError) / カウント) * 100] &lt; 10 または 1 分間の CW 異常検出)	|「中止された」リクエストを可用性の指標とする	|
|	|	|	|	|	|	|
|API Gateway	|	|レイテンシー	|レイテンシー (または IntegrationLatency つまりバックエンドのレイテンシー)	|(例: p99 レイテンシー &lt; 1 秒 または 1 分間の CW 異常検出)	|p99 は p90 のような低い百分位数よりも許容範囲が大きい (p50 は平均と同じ)	|
|	|	|	|	|	|	|
|API Gateway	|	|パフォーマンス	|CacheHitCount (および Misses)	|(例: [CacheMissCount / (CacheHitCount + CacheMissCount) * 100] &lt; 10 または 1 分間の CW 異常検出)	|キャッシュミスをパフォーマンスの指標とする	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|可用性	|RejectedConnectionCount	|(例: [RejectedConnectionCount / (RejectedConnectionCount + RequestCount) * 100] &lt; 10 の 1 分間の CW 異常検出)	|最大接続数を超えたため拒否されたリクエストを可用性の指標とする	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|レイテンシー	|TargetResponseTime	|(例: p99 TargetResponseTime &lt; 1 秒 または 1 分間の CW 異常検出)	|p99 は p90 のような低い百分位数よりも許容範囲が大きい (p50 は平均と同じ)	|
|	|	|	|	|	|	|

#### 3.2.3 サーバーレス

|AWS サービス	|機能	|測定項目	|メトリクス	|例	|備考	|
|---	|---	|---	|---	|---	|---	|
|S3	|リクエストメトリクス	|可用性	|AllRequests	|(例: [(4XXErrors + 5XXErrors) / AllRequests) * 100] &lt; 10 または 1 分間の期間で CW Anomaly Detection)	|「中止された」リクエストの可用性の指標	|
|	|	|	|	|	|	|
|S3	|リクエストメトリクス	|(全体の) レイテンシ	|TotalRequestLatency	|(例: [p99 TotalRequestLatency] &lt; 100 ms または 1 分間の期間で CW Anomaly Detection)	|	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|可用性	|ThrottledRequests	|(例: [ThrottledRequests] &lt; 100 または 1 分間の期間で CW Anomaly Detection)	|「スロットリングされた」リクエストの可用性の指標	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|レイテンシ	|SuccessfulRequestLatency	|(例: [p99 SuccessfulRequestLatency] &lt; 100 ms または 1 分間の期間で CW Anomaly Detection)	|	|
|	|	|	|	|	|	|
|Step Functions	|	|可用性	|ExecutionsFailed	|(例: ExecutionsFailed = 0)<br/>**[例: メトリックマス m1 は ExecutionsFailed (Step Function の実行) UTC 時間: `IF(((DAY(m1)&lt;6 OR ** ** DAY(m1)==7) AND (HOUR(m1)>21 AND HOUR(m1)&lt;7)),m1)]`	|平日の 21 時から 7 時まで (営業開始時間) の間に Step Functions の完了を要求するビジネスフローを想定	|
|	|	|	|	|	|	|

#### 3.2.4 コンピューティングとコンテナ

|AWS サービス	|機能	|測定対象	|メトリクス	|例	|注記	|
|---	|---	|---	|---	|---	|---	|
|EKS	|Prometheus メトリクス	|可用性	|APIServer Request Success Ratio	|(例: [APIServer Request Success Ratio](https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/service/cwagent-prometheus/sample_cloudwatch_dashboards/kubernetes_api_server/cw_dashboard_kubernetes_api_server.json) のような Prometheus メトリクス)	|詳細は [EKS コントロールプレーンメトリクスの監視のベストプラクティス](https://aws.github.io/aws-eks-best-practices/reliability/docs/controlplane/#monitor-control-plane-metrics) と [EKS オブザーバビリティ](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-observe.html) を参照してください。	|
|	|	|	|	|	|	|
|EKS	|Prometheus メトリクス	|パフォーマンス	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|	|
|	|	|	|	|	|	|
|ECS	|	|可用性	|Service RUNNING task count	|Service RUNNING task count	|ECS CW メトリクスの [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/cloudwatch-metrics.html) を参照してください。	|
|	|	|	|	|	|	|
|ECS	|	|パフォーマンス	|TargetResponseTime	|(例: [p99 TargetResponseTime] &lt; 100 ms または 1 分間の期間に対する CW Anomaly Detection)	|ECS CW メトリクスの [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/cloudwatch-metrics.html) を参照してください。	|
|	|	|	|	|	|	|
|EC2 (.NET Core)	|CW エージェントのパフォーマンスカウンター	|可用性	|(例: [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html) &lt; 'N')	|(例: [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html) &lt; 'N')	|EC2 CW Application Insights の[ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html) を参照してください。	|
|	|	|	|	|	|	|

#### 3.2.5 データベース (RDS)

|AWS サービス	|機能	|測定項目	|メトリクス	|例	|備考	|
|---	|---	|---	|---	|---	|---	|
|RDS Aurora	|Performance Insights (PI)	|可用性	|平均アクティブセッション数	|(例: 1 分間の期間で CloudWatch の異常検出を使った平均アクティブセッション数)	|RDS Aurora の CloudWatch PI [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html) を参照	|
|	|	|	|	|	|	|
|RDS Aurora	|	|ディザスタリカバリ (DR)	|AuroraGlobalDBRPOLag	|(例: 1 分間の期間で AuroraGlobalDBRPOLag &lt; 30000 ms)	|RDS Aurora の CloudWatch [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMonitoring.Metrics.html) を参照	|
|	|	|	|	|	|	|
|RDS Aurora	|	|パフォーマンス	|コミット遅延、バッファキャッシュヒット率、DDL 遅延、DML 遅延	|(例: 1 分間の期間で CloudWatch の異常検出を使ったコミット遅延)	|RDS Aurora の CloudWatch PI [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html) を参照	|
|	|	|	|	|	|	|
|RDS (MSSQL)	|PI	|パフォーマンス	|SQL コンパイル	|(例: <br/>5 分間の期間で SQL コンパイル > 'M')	|RDS の CloudWatch PI [ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PerfInsights_Counters.html) を参照	|
|	|	|	|	|	|	|

## 4.0 SLI、SLO、SLA の計算に Amazon CloudWatch と Metric Math を使用する

### 4.1 Amazon CloudWatch と Metric Math

Amazon CloudWatch は、AWS リソースのモニタリングとオブザーバビリティサービスを提供します。Metric Math を使用すると、CloudWatch のメトリクスデータを使って計算を実行できるため、SLI、SLO、SLA を計算するのに最適なツールです。

#### 4.1.1 詳細モニタリングの有効化

AWS リソースの詳細モニタリングを有効にすると、1 分間隔のデータ粒度が得られるため、より正確な SLI 計算が可能になります。

#### 4.1.2 名前空間とディメンションを使ってメトリクスを整理する

名前空間とディメンションを使って、メトリクスをカテゴリ分けしてフィルタリングすれば、分析がより簡単になります。たとえば、名前空間を使って特定のサービスに関連するメトリクスをグループ化し、ディメンションを使ってそのサービスの様々なインスタンスを区別します。

### 4.2 Metric Math を使用した SLI の計算

#### 4.2.1 可用性

可用性を計算するには、成功したリクエスト数を総リクエスト数で割ります。

```
availability = 100 * (successful_requests / total_requests)
```

**例:**

次のメトリクスを持つ API Gateway があるとします。
- `4XXError`: 4xx クライアントエラーの数
- `5XXError`: 5xx サーバーエラーの数
- `Count`: 総リクエスト数

Metric Math を使って可用性を計算します。

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```

#### 4.2.2 レイテンシー

平均レイテンシーを計算するには、CloudWatch が提供する `SampleCount` と `Sum` の統計情報を使用します。

```
average_latency = Sum / SampleCount
```

**例:**

次のメトリクスを持つ Lambda 関数があるとします。
- `Duration`: 関数の実行にかかった時間

Metric Math を使って平均レイテンシーを計算します。

```
average_latency = Duration.Sum / Duration.SampleCount
```

#### 4.2.3 エラー率

エラー率を計算するには、失敗したリクエスト数を総リクエスト数で割ります。

```
error_rate = 100 * (failed_requests / total_requests)
```

**例:**

前の API Gateway の例を使用すると:

```
error_rate = 100 * ((4XXError + 5XXError) / Count)
```

### 4.4 SLO の定義とモニタリング

#### 4.4.1 現実的な目標設定

ユーザーの期待と過去のパフォーマンスデータに基づいて SLO 目標を定義します。サービスの信頼性とリソース活用のバランスを確保するために、達成可能な目標を設定します。

#### 4.4.2 CloudWatch を使った SLO のモニタリング

SLI をモニタリングし、SLO ターゲットに近づいたり超えたりした場合に通知するための CloudWatch アラームを作成します。これにより、問題に積極的に対処し、サービスの信頼性を維持できます。

#### 4.4.3 SLO のレビューと調整

サービスが進化するにつれて、SLO が適切であり続けるよう、定期的にレビューしてください。必要に応じてターゲットを調整し、変更点をステークホルダーに伝えてください。

### 4.5 SLA の定義と測定

#### 4.5.1 現実的な目標設定

過去のパフォーマンスデータとユーザーの期待に基づいて SLA の目標を定義します。
サービスの信頼性とリソース活用のバランスを保つため、達成可能な目標を設定します。

#### 4.5.2 モニタリングとアラート

CloudWatch Alarms を設定して、SLI を監視し、SLA ターゲットに近づいたり、超えたりした場合に通知を受け取ります。これにより、問題に積極的に対処し、サービスの信頼性を維持できます。

#### 4.5.3 SLA の定期的なレビュー

サービスが進化するにつれて、SLA が関連性を維持しているかを定期的にレビューしてください。必要に応じてターゲットを調整し、変更点をステークホルダーに伝えてください。

### 4.6 一定期間の SLA または SLO のパフォーマンス測定

一定期間 (例: 1 カ月) の SLA または SLO のパフォーマンスを測定するには、CloudWatch のメトリクスデータをカスタム時間範囲で使用します。

**例:**

API Gateway の SLO ターゲットが 99.9% の可用性だとします。4 月の可用性を測定するには、次の Metric Math 式を使用します。

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```

次に、CloudWatch のメトリクスデータクエリをカスタム時間範囲で設定します。

- **開始時刻:** `2023-04-01T00:00:00Z`
- **終了時刻:** `2023-04-30T23:59:59Z`
- **期間:** `2592000` (30 日を秒で表した値)

最後に、`AVG` 統計情報を使って月間の平均可用性を計算します。平均可用性が SLO ターゲット以上であれば、目標を達成したことになります。

## 5.0 まとめ

主要業績評価指標 (KPI) または「ゴールデンシグナル」は、ビジネスと利害関係者の要件に合わせる必要があります。Amazon CloudWatch と Metric Math を使用して SLI、SLO、SLA を計算することは、サービス信頼性を管理する上で重要です。このガイドで概説したベストプラクティスに従い、AWS リソースのパフォーマンスを効果的に監視し、維持してください。詳細モニタリングを有効にし、名前空間とディメンションでメトリクスを整理し、SLI 計算に Metric Math を使用し、現実的な SLO と SLA ターゲットを設定し、CloudWatch Alarms で監視とアラートシステムを確立することを忘れないでください。これらのベストプラクティスを適用することで、最適なサービス信頼性、リソース活用の改善、顧客満足度の向上を実現できます。
