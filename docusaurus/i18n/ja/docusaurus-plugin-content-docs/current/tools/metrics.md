# メトリクス

メトリクスは、システムのパフォーマンスに関するデータです。システムやリソースに関連するすべてのメトリクスを一元化された場所に集めることで、メトリクスを比較し、パフォーマンスを分析し、リソースのスケールアップやスケールインなどのより良い戦略的決定を行う能力が得られます。メトリクスは、リソースの健全性を把握し、事前対策を講じる上でも重要です。

メトリクスデータは基礎となるもので、[アラーム](../signals/alarms/)、異常検出、[イベント](../signals/events/)、[ダッシュボード](../tools/dashboards)などを駆動するために使用されます。



## ベンダーメトリクス

[CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) は、システムのパフォーマンスに関するデータを収集します。デフォルトでは、ほとんどの AWS サービスが無料でリソースのメトリクスを提供しています。これには [Amazon EC2](https://aws.amazon.com/jp/ec2/) インスタンス、[Amazon RDS](https://aws.amazon.com/jp/rds/)、[Amazon S3](https://aws.amazon.com/jp/s3/) バケットなどが含まれます。

これらのメトリクスを *ベンダーメトリクス* と呼びます。AWS アカウントでのベンダーメトリクスの収集に料金はかかりません。

:::info
CloudWatch にメトリクスを送信する AWS サービスの完全なリストは、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) をご覧ください。
:::



## メトリクスのクエリ

CloudWatch の [Metric Math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 機能を利用して、複数のメトリクスにクエリを実行し、数式を使用してより詳細にメトリクスを分析できます。例えば、Lambda のエラー率を調べるために、次のような Metric Math 式を書くことができます：

	Errors/Requests

以下は、CloudWatch コンソールでの表示例です：

![Metric math example](../images/metrics1.png)

:::info
	Metric Math を使用してデータから最大限の価値を引き出し、個別のデータソースのパフォーマンスから値を導き出します。
:::

CloudWatch は条件文もサポートしています。例えば、レイテンシーが特定のしきい値を超えた各時系列に対して `1` を、その他のすべてのデータポイントに対して `0` を返すには、次のようなクエリを使用します：

	IF(latency>threshold, 1, 0)

CloudWatch コンソールでは、この論理を使用してブール値を作成し、それによって [CloudWatch アラーム](../tools/alarms) やその他のアクションをトリガーできます。これにより、導出されたデータポイントから自動アクションを実行できます。以下は CloudWatch コンソールでの例です：

![Alarm creation from a derived value](../images/metrics2.png)

:::info
	条件文を使用して、導出された値のパフォーマンスがしきい値を超えたときにアラームや通知をトリガーします。
:::

また、`SEARCH` 関数を使用して任意のメトリクスの上位 `n` 個を表示することもできます。多数の時系列（例：数千台のサーバー）にわたって最高または最悪のパフォーマンスを示すメトリクスを可視化する場合、このアプローチを使用すると最も重要なデータのみを表示できます。以下は、過去 5 分間の平均で CPU 使用率が最も高い上位 2 つの EC2 インスタンスを返す検索の例です：

```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```

CloudWatch コンソールでの同じ表示例：

![Search query in CloudWatch metrics](../images/metrics3.png)

:::info
	`SEARCH` アプローチを使用して、環境内で価値のあるリソースや最悪のパフォーマンスを示すリソースを素早く表示し、それらを [ダッシュボード](../tools/dashboards) に表示します。
:::



## メトリクスの収集

EC2 インスタンスのメモリやディスク容量使用率などの追加メトリクスが必要な場合は、[CloudWatch エージェント](../tools/cloudwatch_agent/)を使用してこのデータを CloudWatch にプッシュできます。また、グラフィカルな方法で可視化する必要があるカスタム処理データがあり、このデータを CloudWatch メトリクスとして表示したい場合は、[`PutMetricData` API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html) を使用してカスタムメトリクスを CloudWatch に公開できます。

:::info
	生の API ではなく、[AWS SDK](https://aws.amazon.com/jp/developer/tools/) のいずれかを使用して CloudWatch にメトリクスデータをプッシュしてください。
:::

`PutMetricData` API 呼び出しはクエリ数に応じて課金されます。`PutMetricData` API を最適に使用するのがベストプラクティスです。この API の Values and Counts メソッドを使用すると、1 回の `PutMetricData` リクエストで最大 150 個の値をメトリクスごとに公開でき、このデータのパーセンタイル統計の取得をサポートします。したがって、各データポイントに対して個別の API 呼び出しを行うのではなく、すべてのデータポイントをグループ化してから、1 回の `PutMetricData` API 呼び出しで CloudWatch にプッシュする必要があります。このアプローチは、ユーザーに次の 2 つの利点をもたらします：

1. CloudWatch の料金
1. `PutMetricData` API のスロットリングを防止できる

:::info
	`PutMetricData` を使用する場合、可能な限りデータを単一の `PUT` 操作にバッチ処理することがベストプラクティスです。
:::

:::info
	大量のメトリクスが CloudWatch に送信される場合は、代替アプローチとして [Embedded Metric Format](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) の使用を検討してください。Embedded Metric Format は `PutMetricData` を使用せず、その使用に対して課金されませんが、[CloudWatch Logs](../tools/logs/) の使用による課金が発生することに注意してください。
:::



## 異常検知

CloudWatch には[異常検知](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)機能があり、記録されたメトリクスに基づいて*正常*な状態を学習することで、オブザーバビリティ戦略を強化します。異常検知の使用は、あらゆるメトリクスシグナル収集システムにおける[ベストプラクティス](../signals/metrics/#use-anomaly-detection-algorithms)です。

異常検知は 2 週間の期間にわたってモデルを構築します。

:::warning
異常検知は作成時点以降のデータからのみモデルを構築します。過去に遡って外れ値を見つけることはありません。
:::

:::warning
異常検知は、メトリクスにとって何が*良い*かを知るのではなく、標準偏差に基づいて何が*正常*かを知るだけです。
:::

:::info
ベストプラクティスは、正常な動作が予想される時間帯のみを分析するように異常検知モデルをトレーニングすることです。トレーニングから除外する期間（夜間、週末、休日など）を定義できます。
:::

異常検知バンドの例を以下に示します。グレーの部分がバンドです。

![異常検知バンド](../images/metrics4.png)

異常検知の除外ウィンドウの設定は、CloudWatch コンソール、[CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html)、または AWS SDK のいずれかを使用して行うことができます。
