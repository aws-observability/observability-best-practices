# メトリクス

メトリクスとは、システムのパフォーマンスに関するデータです。 
システムやリソースに関連するすべてのメトリクスを集中管理することで、メトリクスを比較したり、パフォーマンスを分析したり、リソースのスケールアップやスケールインなどの戦略的な意思決定を行うことができます。
メトリクスは、リソースの健全性を知り、予防措置を取るうえでも重要です。

メトリクスデータは基礎的なものであり、アラーム 、アノマリ検知、イベント 、ダッシュボード などを駆動するために使用されます。

## ベンダーメトリクス

[CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) は、システムのパフォーマンスに関するデータを収集します。デフォルトでは、ほとんどの AWS サービスがそれぞれのリソースの無料のメトリクスを提供します。これには、[Amazon EC2](https://aws.amazon.com/jp/ec2/) インスタンス、[Amazon RDS](https://aws.amazon.com/jp/rds/)、[Amazon S3](https://aws.amazon.com/jp/s3/?p=pm&c=s3&z=4) バケットなどが含まれます。

これらのメトリクスを *ベンダーメトリクス* と呼びます。ベンダーメトリクスの収集には料金がかかりません。

!!! info
	CloudWatch にメトリクスを送信する AWS サービスの完全なリストは、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)を参照してください。

## メトリクスのクエリ

CloudWatch の [metric math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 機能を利用して、複数のメトリクスをクエリし、式を使用してメトリクスを解析することで、より詳細な情報を取得できます。 例えば、次のような metric math 式を書くことで、Lambda のエラーレートをクエリできます。

	Errors/Requests

以下は、これが CloudWatch コンソールでどのように表示されるかの例です。

!Metric math の例 

!!! success
	metric math を使用して、データから最大限の価値を引き出し、個別のデータソースのパフォーマンスから値を導出してください。

CloudWatch は条件文もサポートしています。 たとえば、レイテンシが特定のしきい値を超えている各時系列に対して `1` の値を返し、その他のすべてのデータポイントに `0` を返すには、次のようなクエリになります。

	IF(latency>threshold, 1, 0)

CloudWatch コンソールでは、このロジックを使用してブール値を作成できます。これにより、CloudWatch アラーム やその他のアクションをトリガーできます。 これにより、導出されたデータポイントからの自動アクションが可能になります。 CloudWatch コンソールからの例を以下に示します。

!導出値からのアラーム作成] 

!!! success
	条件文を使用して、パフォーマンスが導出値のしきい値を超えたときに、アラームと通知をトリガーしてください。

`SEARCH` 関数を使用して、任意のメトリクスの上位 `n` 件を表示することもできます。 多数の時系列 (例: サーバーが数千台) にわたる最もパフォーマンスの良い、または最も悪いメトリクスを可視化する場合、このアプローチにより、最も重要なデータのみを表示できます。 過去 5 分間の平均値で、CPU 使用率が最も高い上位 2 つの EC2 インスタンスを返す search の例を以下に示します。
```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```
CloudWatch メトリクスのコンソールでの同じ表示は以下のとおりです。

!CloudWatch メトリクスの search クエリ 

!!! success
	`SEARCH` アプローチを使用して、環境内の最も価値のある、または最もパフォーマンスの低いリソースをすばやく表示し、ダッシュボード に表示してください。

## メトリクスの収集

EC2 インスタンスのメモリやディスク空き容量など、追加のメトリクスが必要な場合は、CloudWatch エージェントを使用して、このデータを CloudWatch にプッシュできます。または、グラフィカルに視覚化する必要があるカスタム処理データがあり、このデータを CloudWatch メトリクスとして存在させたい場合は、`PutMetricData` API  を使用して、カスタムメトリクスを CloudWatch に公開できます。

!!! success
	裸の API ではなく、[AWS SDK](https://aws.amazon.com/developer/tools/) のいずれかを使用して、メトリクスデータを CloudWatch にプッシュすることをお勧めします。

`PutMetricData` API 呼び出しは、クエリの数に基づいて課金されます。この API を最適に使用するにはベストプラクティスに従うことが大切です。この API の Values and Counts メソッドを使用すると、1 つの `PutMetricData` リクエストでメトリクスごとに最大 150 個の値を公開でき、このデータのパーセンタイル統計を取得できます。したがって、各データポイントごとに個別の API 呼び出しを行う代わりに、すべてのデータポイントをグループ化してから、単一の `PutMetricData` API 呼び出しで CloudWatch にプッシュする必要があります。このアプローチは、次の 2 つの方法でユーザーに利益をもたらします。

1. CloudWatch の料金
2. `PutMetricData` API のスロットリングを防ぐ

!!! success
	`PutMetricData` を使用する場合、可能な限りバッチデータを単一の `PUT` 操作にまとめることがベストプラクティスです。
	
!!! success
	大量のメトリクスが CloudWatch に発行される場合は、[Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) を代替アプローチとして検討してください。Embedded Metric Format は `PutMetricData` を使用せず、使用料も課金されませんが、CloudWatch Logs  の使用による課金は発生します。

## 異常検知

CloudWatch には、記録されたメトリクスに基づいて「通常」が何であるかを学習する[異常検知](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)機能があり、これによりオブザーバビリティ戦略が強化されます。 異常検知の利用は、あらゆるメトリクス シグナル収集システムの ベストプラクティス です。

異常検知は 2 週間の期間にわたってモデルを構築します。

!!! warning
	異常検知は、作成時から先の時間についてのみモデルを構築します。過去に遡って以前の外れ値を見つけることはありません。
	
!!! warning
	異常検知は、メトリクスの「適正」が何であるかは知りません。標準偏差に基づいて「通常」が何であるかのみを知っています。
	
!!! success
	ベストプラクティスは、異常検知モデルを通常の動作が期待される時間帯のみを分析するようにトレーニングすることです。 トレーニングから除外する時間帯(夜間、週末、休日など)を定義できます。

ここでは、グレーの帯が異常検知帯の例を示しています。

!Anomaly detection band

異常検知の除外ウィンドウの設定は、CloudWatch コンソール、 [CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html)、または AWS SDK のいずれかを使用して行うことができます。
