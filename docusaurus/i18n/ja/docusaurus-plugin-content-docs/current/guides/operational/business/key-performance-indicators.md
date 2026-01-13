## 1.0 KPI の理解 (「ゴールデンシグナル」)
組織は、ビジネスと運用の健全性やリスクに関する洞察を提供する主要業績評価指標 (KPI)、別名「ゴールデンシグナル」を活用しています。組織のさまざまな部門には、それぞれの成果の測定に対応する独自の KPI があります。たとえば、eコマースアプリケーションの製品チームは、カート注文を正常に処理する能力を KPI として追跡します。オンコール運用チームは、インシデントの平均検出時間 (MTTD) を KPI として測定します。財務チームにとっては、予算内でのリソースコストの KPI が重要です。

サービスレベル指標 (SLI)、サービスレベル目標 (SLO)、およびサービスレベル契約 (SLA) は、サービス信頼性管理の重要な要素です。このガイドでは、Amazon CloudWatch とその機能を使用して SLI、SLO、SLA を計算および監視するためのベストプラクティスを、明確で簡潔な例とともに説明します。

- **SLI (Service Level Indicator):** サービスのパフォーマンスを定量的に測定する指標です。
- **SLO (Service Level Objective):** SLI の目標値で、望ましいパフォーマンスレベルを表します。
- **SLA (Service Level Agreement):** サービスプロバイダーとユーザー間の契約で、期待されるサービスレベルを規定します。

一般的な SLI の例:

- 可用性: サービスが稼働している時間の割合
- レイテンシー: リクエストを処理するのにかかる時間
- エラー率: 失敗したリクエストの割合

## 2.0 顧客とステークホルダーの要件を発見する（以下に示すテンプレートを使用）

1. 最上位の質問から始めます。「特定のワークロード (例: 決済ポータル、eコマース注文処理、ユーザー登録、データレポート、サポートポータルなど) のスコープにおけるビジネス価値またはビジネス上の問題は何か」
2. ビジネス価値をユーザーエクスペリエンス (UX)、ビジネスエクスペリエンス (BX)、オペレーショナルエクスペリエンス (OpsX)、セキュリティエクスペリエンス (SecX)、デベロッパーエクスペリエンス (DevX) などのカテゴリに分類します
3. 各カテゴリのコアシグナル、つまり「ゴールデンシグナル」を導き出します。UX と BX に関する主要なシグナルは、通常、ビジネスメトリクスを構成します

| ID	| Initials	| Customer	| Business Needs	| Measurements	| Information Sources	| What does good look like?	| Alerts	| Dashboards	| Reports	|
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| --- |		
|M1	|Example	|External End User	|User Experience	|Response time (Page latency)	|Logs / Traces	|< 5s for 99.9%	|No	|Yes	|No	|
|M2	|Example	|Business	|Availability	|Successful RPS (Requests per second)	|Health Check	|>85% in 5 min window	|Yes	|Yes	|Yes	|
|M3	|Example	|Security	|Compliance	|Critical non-compliant resources	|Config data	|\<10 under 15 days	|No	|Yes	|Yes	|
|M4	|Example	|Developers	|Agility	|Deployment time	|Deployment logs	|Always < 10 min	|Yes	|No	|Yes	|
|M5	|Example	|Operators	|Capacity	|Queue Depth	|App logs/metrics	|Always < 10	|Yes	|Yes	|Yes	|

### 2.1 ゴールデンシグナル

|Category	|Signal	|Notes	|References	|
|---	|---	|---	|---	|
|UX	|Performance (Latency)	|See M1 in template	|Whitepaper: [Availability and Beyond (Measuring latency)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html#latency)	|
|BX	|Availability	|See M2 in template	|Whitepaper: [Avaiability and Beyond (Measuring availability)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)	|
|BX	|Business Continuity Plan (BCP)	|Amazon Resilience Hub (ARH) resilience score against defined RTO/RPO	|Docs: [ARH user guide (Understanding resilience scores)](https://docs.aws.amazon.com/resilience-hub/latest/userguide/resil-score.html)	|
|SecX	|(Non)-Compliance	|See M3 in template	|Docs: [AWS Control Tower user guide (Compliance status in the console)](https://docs.aws.amazon.com/controltower/latest/userguide/compliance-statuses.html)	|
|DevX	|Agility	|See M4 in template	|Docs: [DevOps Monitoring Dashboard on AWS (DevOps metrics list)](https://docs.aws.amazon.com/solutions/latest/devops-monitoring-dashboard-on-aws/devops-metrics-list.html)	|
|OpsX	|Capacity (Quotas)	|See M5 in template	|Docs: [Amazon CloudWatch user guide (Visualizing your service quotas and setting alarms)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Quotas-Visualize-Alarms.html)	|
|OpsX	|Budget Anomalies	|	|Docs:<br/> 1. [AWS Billing and Cost Management (AWS Cost Anomaly Detection)](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) <br/> 2. [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/)	|



## 3.0 トップレベルガイダンス 'TLG'


### 3.1 TLG 全般

1. ビジネス、アーキテクチャ、セキュリティの各チームと協力して、ビジネス、コンプライアンス、ガバナンスの要件を洗練させ、ビジネスニーズを正確に反映していることを確認します。これには、[目標復旧時間と目標復旧時点の設定](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/) (RTO、RPO) が含まれます。[可用性の測定](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)やレイテンシーなど、要件を測定する方法を策定します (例: アップタイムは 5 分間のウィンドウで小さな割合の障害を許容できます)。

2. さまざまなビジネス機能の成果に合わせた専用スキーマを使用して、効果的な[タグ付け戦略](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)を構築します。これは特に[運用オブザーバビリティ](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/operational-observability.html)と[インシデント管理](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/incident-management.html)をカバーする必要があります。

3. 可能な限り、[CloudWatch 異常検出](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)を使用してアラームの動的しきい値を活用します（特にベースライン KPI がないメトリクスの場合）。これは機械学習アルゴリズムを提供してベースラインを確立します。CW メトリクス（または prometheus メトリクスなどの他のソース）を発行する AWS の利用可能なサービスを使用してアラームを設定する場合は、[複合アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)を作成してアラームノイズを削減することを検討してください。例：可用性を示すビジネスメトリクス（成功したリクエストによって追跡）とレイテンシーで構成される複合アラームは、デプロイ中に両方が重要なしきい値を下回ったときにアラームを発するように設定すると、デプロイのバグを示す決定的な指標となる可能性があります。

4. (注: AWS Business サポート以上が必要) AWS は、Personal Health Dashboard でリソースに関連する重要なイベントを AWS Health サービスを使用して公開します。[AWS Health Aware (AHA)](https://aws.amazon.com/blogs/mt/aws-health-aware-customize-aws-health-alerts-for-organizational-and-personal-aws-accounts/) フレームワーク (AWS Health を使用) を活用して、中央アカウント (管理アカウントなど) から AWS Organization 全体で集約されたプロアクティブかつリアルタイムのアラートを取り込みます。これらのアラートは、Slack などの優先する通信プラットフォームに送信でき、ServiceNow や Jira などの ITSM ツールと統合できます。
![Image: AWS Health Aware 'AHA'](../../../images/AHA-Integration.jpg)

5. Amazon CloudWatch [Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) を活用して、リソースに最適なモニターを設定し、アプリケーションの問題の兆候がないかデータを継続的に分析します。また、監視対象のアプリケーションの潜在的な問題を示す自動化されたダッシュボードを提供し、アプリケーション/インフラストラクチャの問題を迅速に分離/トラブルシューティングできます。[Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を活用してコンテナからメトリクスとログを集約し、CloudWatch Application Insights とシームレスに統合できます。
![Image: CW Application Insights](../../../images/CW-ApplicationInsights.jpg)

6. [AWS Resilience Hub](https://aws.amazon.com/resilience-hub/) を活用して、定義された RTO と RPO に対してアプリケーションを分析します。[AWS Fault Injection Simulator](https://aws.amazon.com/fis/) などのツールを使用した制御された実験により、可用性、レイテンシー、事業継続性の要件が満たされているかを検証します。追加の Well-Architected レビューとサービス固有の詳細な調査を実施し、AWS のベストプラクティスに従ってワークロードがビジネス要件を満たすように設計されていることを確認します。

7. 詳細については、[AWS Observability Best Practices](/observability-best-practices/ja/) ガイダンスの他のセクション、AWS Cloud Adoption Framework: [Operations Perspective](https://docs.aws.amazon.com/whitepapers/latest/aws-caf-operations-perspective/observability.html) ホワイトペーパー、および AWS Well-Architected Framework Operational Excellence Pillar ホワイトペーパーの「[Understading workload health](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/understanding-workload-health.html)」のコンテンツを参照してください。
    

### 3.2 ドメイン別の TLG (ビジネスメトリクス、すなわち UX、BX を重視)

CloudWatch (CW) などのサービスを使用した適切な例を以下に示します（参照：[CloudWatch メトリクスを発行する AWS サービスのドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)）

#### 3.2.1 Canary (別名 Synthetic トランザクション) と Real-User Monitoring (RUM)

* TLG: クライアント/カスタマーエクスペリエンスを理解するための最も簡単で効果的な方法の 1 つは、Canaries (合成トランザクション) を使用してカスタマートラフィックをシミュレートすることです。これにより、サービスを定期的にプローブし、メトリクスを記録します。

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CW	|Synthetics	|Availability	|**SuccessPercent**	|(Ex. SuccessPercent > 90 or CW Anomaly Detection for 1min Period)<br/>**[Metric Math where m1 is SuccessPercent if Canaries run each weekday 7a-8a (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)]`	|	|
|	|	|	|	|	|	|
|CW	|Synthetics	|Availability	|VisualMonitoringSuccessPercent	|(Ex. VisualMonitoringSuccessPercent > 90 for 5 min Period for UI screenshot comparisons)<br/>**[Metric Math where m1 is SuccessPercent if Canaries run each weekday 7a-8a (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)`	|If customer expects canary to match predetermined UI screenshot	|
|	|	|	|	|	|	|
|CW	|RUM	|Response Time	|Apdex Score	|(Ex. Apdex score: <br/> NavigationFrustratedCount < ‘N’ expected value)	|	|
|	|	|	|	|	|	|


#### 3.2.2 API フロントエンド


|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CloudFront	|	|Availability	|Total error rate	|(Ex. [Total error rate] < 10 or CW Anomaly Detection for 1min Period)	|Availability as a measure of error rate	|
|	|	|	|	|	|	|
|CloudFront	|(Requires turning on additional metrics)	|Peformance	|Cache hit rate	|(Ex.Cache hit rate < 10 CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|(Cross region) Availability	|HealthCheckPercentageHealthy	|(Ex. [Minimum of HealthCheckPercentageHealthy] > 90 or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|Latency	|TimeToFirstByte	|(Ex. [p99 TimeToFirstByte] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|API Gateway	|	|Availability	|Count	|(Ex. [(4XXError + 5XXError) / Count) * 100] < 10 or CW Anomaly Detection for 1min Period)	|Availability as a measure of "abandoned" requests	|
|	|	|	|	|	|	|
|API Gateway	|	|Latency	|Latency (or IntegrationLatency i.e. backend latency)	|(Ex. p99 Latency < 1 sec or CW Anomaly Detection for 1min Period)	|p99 will have greater tolerance than lower percentile like p90. (p50 is same as average)	|
|	|	|	|	|	|	|
|API Gateway	|	|Performance	|CacheHitCount (and Misses)	|(Ex. [CacheMissCount / (CacheHitCount + CacheMissCount)  * 100] < 10 or CW Anomaly Detection for 1min Period)	|Performance as a measure of Cache (Misses)	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Availability	|RejectedConnectionCount	|(Ex.[RejectedConnectionCount/(RejectedConnectionCount + RequestCount) * 100] < 10 CW Anomaly Detection for 1min Period)	|Availability as a measure of rejected requests due to max connections breached	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Latency	|TargetResponseTime	|(Ex. p99 TargetResponseTime < 1 sec or CW Anomaly Detection for 1min Period)	|p99 will have greater tolerance than lower percentile like p90. (p50 is same as average)	|
|	|	|	|	|	|	|


#### 3.2.3 Serverless

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|S3	|Request metrics	|Availability	|AllRequests	|(Ex. [(4XXErrors + 5XXErrors) / AllRequests) * 100] < 10 or CW Anomaly Detection for 1min Period)	|Availability as a measure of "abandoned" requests	|
|	|	|	|	|	|	|
|S3	|Request metrics	|(Overall) Latency	|TotalRequestLatency	|(Ex. [p99 TotalRequestLatency] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Availability	|ThrottledRequests	|(Ex. [ThrottledRequests] < 100 or CW Anomaly Detection for 1min Period)	|Availability as a measure of "throttled" requests	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Latency	|SuccessfulRequestLatency	|(Ex. [p99 SuccessfulRequestLatency] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Step Functions	|	|Availability	|ExecutionsFailed	|(Ex. ExecutionsFailed = 0)<br/>**[ex. Metric Math where m1 is ExecutionsFailed (Step function Execution) UTC time: `IF(((DAY(m1)<6 OR ** ** DAY(m1)==7) AND (HOUR(m1)>21 AND HOUR(m1)<7)),m1)]`	|Assuming business flow that requests completion of step functions as a daily operation 9p-7a during weekdays (start of day business operations)	|
|	|	|	|	|	|	|


#### 3.2.4 コンピューティングとコンテナ

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|EKS	|Prometheus metrics	|Availability	|APIServer Request Success Ratio	|(ex. Prometheus metric like  [APIServer Request Success Ratio](https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/service/cwagent-prometheus/sample_cloudwatch_dashboards/kubernetes_api_server/cw_dashboard_kubernetes_api_server.json))	|See [best practices for monitoring EKS control plane metrics](https://aws.github.io/aws-eks-best-practices/reliability/docs/controlplane/#monitor-control-plane-metrics) and [EKS observability](https://docs.aws.amazon.com/eks/latest/userguide/eks-observe.html) for details.	|
|	|	|	|	|	|	|
|EKS	|Prometheus metrics	|Performance	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|	|
|	|	|	|	|	|	|
|ECS	|	|Availability	|Service RUNNING task count	|Service RUNNING task count	|See ECS CW metrics [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count)	|
|	|	|	|	|	|	|
|ECS	|	|Performance	|TargetResponseTime	|(ex.  [p99 TargetResponseTime] < 100 ms or CW Anomaly Detection for 1min Period)	|See ECS CW metrics [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count)	|
|	|	|	|	|	|	|
|EC2 (.NET Core)	|CW Agent Performance Counters	|Availability	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|See EC2 CW Application Insights [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in)	|
|	|	|	|	|	|	|


#### 3.2.5 データベース (RDS)

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|RDS Aurora	|Performance Insights (PI)	|Availability	|Average active sessions	|(Ex. Average active serssions with CW Anomaly Detection for 1min Period)	|See RDS Aurora CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS)	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Disaster Recovery (DR)	|AuroraGlobalDBRPOLag	|(Ex. AuroraGlobalDBRPOLag < 30000 ms for 1min Period)	|See RDS Aurora CW [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMonitoring.Metrics.html)	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Performance	|Commit Latency, Buffer Cache Hit Ratio, DDL Latency, DML Latency	|(Ex. Commit Latency with CW Anomaly Detection for 1min Period)	|See RDS Aurora CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS)	|
|	|	|	|	|	|	|
|RDS (MSSQL)	|PI	|Performance	|SQL Compilations	|(Ex. <br/>SQL Compliations > 'M' for 5 min Period)	|See RDS CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights_Counters.html#USER_PerfInsights_Counters.SQLServer)	|
|	|	|	|	|	|	|


## 4.0 Amazon CloudWatch と Metric Math を使用した SLI、SLO、SLA の計算

### 4.1 Amazon CloudWatch と Metric Math

Amazon CloudWatch は、AWS リソースの監視とオブザーバビリティサービスを提供します。Metric Math を使用すると、CloudWatch メトリクスデータを使用して計算を実行できるため、SLI、SLO、SLA を計算するための理想的なツールとなります。

#### 4.1.1 詳細モニタリングの有効化

AWS リソースの詳細モニタリングを有効にして、1 分間隔のデータ粒度を取得し、より正確な SLI 計算を可能にします。

#### 4.1.2 名前空間とディメンションを使用したメトリクスの整理

Namespace と Dimension を使用してメトリクスを分類およびフィルタリングし、分析を容易にします。たとえば、Namespace を使用して特定のサービスに関連するメトリクスをグループ化し、Dimension を使用してそのサービスのさまざまなインスタンスを区別します。

### 4.2 Metric Math を使用した SLI の計算

#### 4.2.1 可用性

可用性を計算するには、成功したリクエストの数を総リクエスト数で割ります。

```
availability = 100 * (successful_requests / total_requests)
```


**例：**

次のメトリクスを持つ API Gateway があるとします。
- `4XXError`: 4xx クライアントエラーの数
- `5XXError`: 5xx サーバーエラーの数
- `Count`: リクエストの総数

Metric Math を使用してアベイラビリティを計算します。

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


#### 4.2.2 レイテンシー

平均レイテンシーを計算するには、 `SampleCount` および `Sum` CloudWatch が提供する統計情報。

```
average_latency = Sum / SampleCount
```


**例：**

次のメトリクスを持つ Lambda 関数があるとします。
- `Duration`: 関数の実行にかかった時間

Metric Math を使用して平均レイテンシーを計算します。

```
average_latency = Duration.Sum / Duration.SampleCount
```


#### 4.2.3 エラー率

エラー率を計算するには、失敗したリクエストの数を総リクエスト数で割ります。

```
error_rate = 100 * (failed_requests / total_requests)
```


**例：**

前述の API Gateway の例を使用します。

```
error_rate = 100 * ((4XXError + 5XXError) / Count)
```


### 4.4 SLO の定義と監視

#### 4.4.1 現実的な目標の設定

ユーザーの期待値と過去のパフォーマンスデータに基づいて SLO ターゲットを定義します。サービスの信頼性とリソース使用率のバランスを確保するために、達成可能なターゲットを設定します。

#### 4.4.2 CloudWatch による SLO のモニタリング

CloudWatch アラームを作成して SLI を監視し、SLO ターゲットに近づいたり違反したりした場合に通知を受け取ります。これにより、問題に積極的に対処し、サービスの信頼性を維持できます。

#### 4.4.3 SLO のレビューと調整

サービスの進化に合わせて SLO が引き続き適切であることを確認するため、定期的に見直しを行います。必要に応じて目標を調整し、変更内容をステークホルダーに伝えます。

### 4.5 SLA の定義と測定

#### 4.5.1 現実的な目標の設定

過去のパフォーマンスデータとユーザーの期待に基づいて SLA ターゲットを定義します。サービスの信頼性とリソース使用率のバランスを確保するために、達成可能なターゲットを設定します。

#### 4.5.2 モニタリングとアラート

CloudWatch アラームを設定して SLI を監視し、SLA ターゲットに近づいたり違反したりした場合に通知を受け取ります。これにより、問題に積極的に対処し、サービスの信頼性を維持できます。

#### 4.5.3 SLA の定期的なレビュー

サービスの進化に合わせて SLA が適切であり続けるよう、定期的に見直しを行います。必要に応じて目標を調整し、変更内容をステークホルダーに伝達します。

### 4.6 設定期間における SLA または SLO パフォーマンスの測定

カレンダー月などの設定された期間における SLA または SLO のパフォーマンスを測定するには、カスタム時間範囲を使用して CloudWatch メトリクスデータを使用します。

**例：**

99.9% の可用性を SLO ターゲットとする API Gateway があるとします。4 月の可用性を測定するには、次の Metric Math 式を使用します。

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


次に、カスタム時間範囲を使用して CloudWatch メトリクスデータクエリを設定します。

- **開始時刻:** `2023-04-01T00:00:00Z`
- **終了時刻:** `2023-04-30T23:59:59Z`
- **期間:** `2592000` (30 日間を秒単位で表示)

最後に、 `AVG` 統計を使用して、月間の平均可用性を計算します。平均可用性が SLO ターゲット以上である場合、目標を達成したことになります。

## 5.0 まとめ

主要業績評価指標 (KPI)、別名「ゴールデンシグナル」は、ビジネスおよび利害関係者の要件に合致している必要があります。Amazon CloudWatch と Metric Math を使用して SLI、SLO、SLA を計算することは、サービスの信頼性を管理する上で非常に重要です。このガイドで概説されているベストプラクティスに従って、AWS リソースのパフォーマンスを効果的に監視および維持してください。詳細モニタリングを有効にし、名前空間とディメンションでメトリクスを整理し、SLI 計算に Metric Math を使用し、現実的な SLO および SLA ターゲットを設定し、CloudWatch Alarms で監視およびアラートシステムを確立することを忘れないでください。これらのベストプラクティスを適用することで、最適なサービスの信頼性、より良いリソース使用率、および顧客満足度の向上を確保できます。




