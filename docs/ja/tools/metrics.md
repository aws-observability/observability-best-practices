# メトリクス

メトリクスとは、システムのパフォーマンスに関するデータです。 
システムやリソースに関連するすべてのメトリクスを集中管理することで、メトリクスを比較したりパフォーマンスを分析したり、リソースのスケールアップやスケールインなどの戦略的な意思決定を行うことができます。 
メトリクスは、リソースの健全性を知り、予防措置を取るうえでも重要です。

メトリクスデータは基礎的なものであり、[アラーム](../../signals/alarms/)、異常検知、[イベント](../../signals/events/)、[ダッシュボード](../../tools/dashboards)などを駆動するために使用されます。

## 販売メトリクス

[CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) は、システムのパフォーマンスに関するデータを収集します。デフォルトでは、ほとんどの AWS サービスがそれぞれのリソースの無料のメトリクスを提供します。これには [Amazon EC2](https://aws.amazon.com/jp/ec2/) インスタンス、[Amazon RDS](https://aws.amazon.com/jp/rds/)、[Amazon S3](https://aws.amazon.com/jp/s3/?p=pm&c=s3&z=4) バケットなどが含まれます。

これらのメトリクスを *販売メトリクス* と呼びます。AWS アカウントでの販売メトリクスの収集には料金がかかりません。  

!!! info
	CloudWatch にメトリクスを送信する AWS サービスの完全なリストは、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)を参照してください。

## メトリクスのクエリ

CloudWatch の [メトリクス数式](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 機能を利用して、複数のメトリクスをクエリし、メトリクスをより詳細に分析するために数式を使用できます。 たとえば、次のようにクエリを書いて Lambda のエラーレートを調べることができます。

	Errors/Requests

以下は、これが CloudWatch コンソールにどのように表示されるかの例です。

![メトリクス数式の例](../images/metrics1.png)

!!! success
	メトリクス数式を使用して、データから最大限の価値を引き出し、個別のデータソースのパフォーマンスから値を導出してください。

CloudWatch は条件文もサポートしています。 たとえば、レイテンシが特定のしきい値を超える各タイムシリーズの値を `1` にし、その他のすべてのデータポイントを `0` にするには、次のようなクエリになります。

	IF(latency>threshold, 1, 0)

CloudWatch コンソールでは、このロジックを使用してブール値を作成できます。これにより、[CloudWatch アラーム](../../tools/alarms) やその他のアクションをトリガーできます。 これにより、導出されたデータポイントからの自動アクションが可能になります。 CloudWatch コンソールからの例を以下に示します。

![導出値からのアラーム作成](../images/metrics2.png)

!!! success
	条件文を使用して、導出値のパフォーマンスがしきい値を超えたときに、アラームと通知をトリガーしてください。

`SEARCH` 関数を使用して、メトリクスの上位 `n` 件を表示することもできます。 大量のタイムシリーズ (何千ものサーバーなど) 全体で最もパフォーマンスの良い、または最も悪いメトリクスを可視化する場合、このアプローチにより、最も重要なデータのみを表示できます。 以下は、過去 5 分間の平均で、CPU 使用量が最も高い上位 2 つの EC2 インスタンスを返す検索の例です。

	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)

CloudWatch メトリクスのコンソールでの同じ検索クエリの表示は次のとおりです。

![CloudWatch メトリクスでの検索クエリ](../images/metrics3.png)

!!! success
	`SEARCH` を使用して、環境内の価値の高い、または最もパフォーマンスが低いリソースをすばやく表示し、[ダッシュボード](../../tools/dashboards) に表示してください。

## メトリクスの収集

EC2 インスタンスのメモリやディスクスペースの利用率など、追加のメトリクスが必要な場合は、[CloudWatch エージェント](../../tools/cloudwatch_agent/) を使用して、このデータを代わりに CloudWatch にプッシュできます。または、グラフィカルな方法で視覚化する必要があるカスタム処理データがあり、このデータを CloudWatch メトリクスとして存在させたい場合は、[`PutMetricData` API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html) を使用して、カスタムメトリクスを CloudWatch に公開できます。

!!! success
	素の API ではなく、[AWS SDK](https://aws.amazon.com/developer/tools/) の 1 つを使用して、メトリクスデータを CloudWatch にプッシュすることをお勧めします。

`PutMetricData` API 呼び出しはクエリの数に基づいて課金されます。この API を最適に使用するにはベストプラクティスに従うことが大切です。この API の Values and Counts メソッドを使用すると、1 つの `PutMetricData` リクエストで最大 150 個の値を 1 つのメトリクスに公開でき、このデータのパーセンタイル統計を取得できます。したがって、各データポイントごとに個別の API 呼び出しを行う代わりに、すべてのデータポイントをグループ化してから、単一の `PutMetricData` API 呼び出しで CloudWatch にプッシュする必要があります。このアプローチは、次の 2 つの点でユーザーに利点をもたらします。

1. CloudWatch の料金
2. `PutMetricData` API のスロットリングを防ぐことができる

!!! success
	`PutMetricData` を使用する場合、可能な限りデータを単一の `PUT` 操作にバッチ処理するのがベストプラクティスです。
	
!!! success
	大量のメトリクスが CloudWatch に発行される場合は、[Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) を代替アプローチとして検討してください。Embedded Metric Format は `PutMetricData` を使用せず、使用料も課金されませんが、[CloudWatch Logs](../../tools/logs/) の使用からの課金は発生します。

## 異常検知

CloudWatch には、記録されたメトリクスに基づいて「通常」が何であるかを学習することによってオブザーバビリティ戦略を拡張する[異常検知](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)機能があります。異常検知の利用は、メトリクス シグナル収集システムにおける[ベスト プラクティス](../../signals/metrics/#use-anomaly-detection-algorithms)です。

異常検知は、2 週間の期間にわたってモデルを構築します。

!!! warning
	異常検知は、作成時から先の期間についてのみそのモデルを構築します。過去に遡って以前の外れ値を見つけることはありません。
	
!!! warning 
	異常検知は、メトリクスについて「適切な状態」が何であるかは知りません。標準偏差に基づいて「通常の状態」が何であるかのみを知っています。
	
!!! success
	ベスト プラクティスは、異常検知モデルを通常の動作が期待される一日のうちの時間帯のみを分析するように訓練することです。 訓練から除外する時間帯 (夜間、週末、休日など) を定義できます。

異常検知帯の例をここに示します。帯はグレーで表示されています。

![Anomaly detection band](../images/metrics4.png)

異常検知の除外ウィンドウの設定は、CloudWatch コンソール、 [CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html)、または AWS SDK のいずれかを使用して行うことができます。
