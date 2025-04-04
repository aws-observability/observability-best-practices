# メトリクス

メトリクスは、システムのパフォーマンスに関するデータです。
システムやリソースに関連するすべてのメトリクスを一元化された場所に集約することで、メトリクスの比較、パフォーマンスの分析、リソースのスケールアップやスケールインなどの戦略的な意思決定を行うことができます。
また、メトリクスはリソースの健全性を把握し、予防措置を講じる上でも重要です。

メトリクスデータは基盤となるもので、[アラーム](../signals/alarms/)、異常検知、[イベント](../signals/events/)、[ダッシュボード](../tools/dashboards) などの機能を実現するために使用されます。



## ベンダーメトリクス

[CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) は、システムのパフォーマンスに関するデータを収集します。デフォルトでは、ほとんどの AWS サービスが、そのリソースのメトリクスを無料で提供しています。これには [Amazon EC2](https://aws.amazon.com/jp/ec2/) インスタンス、[Amazon RDS](https://aws.amazon.com/jp/rds/)、[Amazon S3](https://aws.amazon.com/jp/s3/) バケットなど、多くのサービスが含まれます。

これらのメトリクスを *ベンダーメトリクス* と呼びます。AWS アカウントでのベンダーメトリクスの収集に料金はかかりません。

:::info
CloudWatch にメトリクスを送信する AWS サービスの完全なリストは、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)をご覧ください。
:::



## メトリクスのクエリ

CloudWatch の [metric math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 機能を使用して、複数のメトリクスに対してクエリを実行し、数式を使用してより詳細なメトリクスの分析ができます。
例えば、以下のような Metric Math の式を使用して Lambda のエラー率を調べることができます：

	Errors/Requests

以下は、CloudWatch コンソールでの表示例です：

![Metric math example](../images/metrics1.png)

:::info
	Metric Math を使用してデータから最大限の価値を引き出し、個別のデータソースのパフォーマンスから値を導き出すことができます。
:::
CloudWatch は条件文もサポートしています。
例えば、レイテンシーが特定のしきい値を超えた場合に各時系列に対して `1` を返し、その他のデータポイントに対して `0` を返すクエリは以下のようになります：

	IF(latency>threshold, 1, 0)

CloudWatch コンソールでは、この論理を使用してブール値を作成し、[CloudWatch alarms](../tools/alarms) やその他のアクションをトリガーすることができます。
これにより、導出されたデータポイントから自動アクションを実行できます。
以下は CloudWatch コンソールでの例です：

![Alarm creation from a derived value](../images/metrics2.png)

:::info
	条件文を使用して、導出された値がしきい値を超えた場合にアラームと通知をトリガーすることができます。
:::
また、`SEARCH` 関数を使用して任意のメトリクスの上位 `n` 件を表示することもできます。
多数の時系列（例：数千台のサーバー）にわたるメトリクスのパフォーマンスの最高値または最低値を可視化する場合、このアプローチを使用することで最も重要なデータのみを表示できます。
以下は、過去 5 分間で CPU 使用率が最も高い上位 2 つの EC2 インスタンスを返す検索の例です：
```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```
以下は CloudWatch コンソールでの表示例です：

![Search query in CloudWatch metrics](../images/metrics3.png)

:::info
	`SEARCH` アプローチを使用して、環境内で価値のあるリソースやパフォーマンスの悪いリソースを素早く表示し、それらを [dashboards](../tools/dashboards) に表示することができます。
:::



## メトリクスの収集

EC2 インスタンスのメモリやディスク容量使用率などの追加メトリクスが必要な場合は、[CloudWatch エージェント](../tools/cloudwatch_agent/) を使用して、これらのデータを CloudWatch に送信できます。また、グラフィカルな形式で可視化する必要のあるカスタム処理データがあり、そのデータを CloudWatch メトリクスとして表示したい場合は、[`PutMetricData` API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html) を使用してカスタムメトリクスを CloudWatch に公開できます。

:::info
API を直接使用するのではなく、[AWS SDK](https://aws.amazon.com/jp/developer/tools/) のいずれかを使用して、メトリクスデータを CloudWatch に送信してください。
:::

`PutMetricData` API の呼び出しは、クエリ数に応じて課金されます。`PutMetricData` API を最適に使用するのがベストプラクティスです。この API の Values and Counts メソッドを使用すると、1 回の `PutMetricData` リクエストで 1 つのメトリクスに最大 150 個の値を公開でき、このデータのパーセンタイル統計の取得をサポートします。したがって、データポイントごとに個別の API 呼び出しを行うのではなく、すべてのデータポイントをグループ化して、1 回の `PutMetricData` API 呼び出しで CloudWatch にプッシュする必要があります。このアプローチは、次の 2 つの点でユーザーにメリットがあります：

1. CloudWatch の料金
1. `PutMetricData` API のスロットリングを防止できる

:::info
`PutMetricData` を使用する場合、可能な限りデータを単一の `PUT` 操作にバッチ処理することがベストプラクティスです。
:::

:::info
大量のメトリクスが CloudWatch に送信される場合は、代替アプローチとして [Embedded Metric Format](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) の使用を検討してください。Embedded Metric Format は `PutMetricData` を使用せず、その使用に対する課金もありませんが、[CloudWatch Logs](../tools/logs/) の使用に対する課金は発生します。
:::



## 異常検知

CloudWatch には [異常検知](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) 機能があり、記録されたメトリクスに基づいて *正常* な状態を学習することで、オブザーバビリティ戦略を強化します。
異常検知の使用は、メトリクスシグナル収集システムにおける [ベストプラクティス](../signals/metrics/#use-anomaly-detection-algorithms) です。

異常検知は 2 週間の期間にわたってモデルを構築します。

:::warning
異常検知は、作成時点以降のデータからのみモデルを構築します。過去に遡って異常値を検出することはできません。
:::

:::warning
異常検知は、メトリクスにとって何が *良い* かではなく、標準偏差に基づいて何が *正常* かのみを判断します。
:::

:::info
ベストプラクティスは、正常な動作が予想される時間帯のみを分析するように異常検知モデルを学習させることです。学習から除外する期間（夜間、週末、休日など）を定義することができます。
:::

以下は異常検知バンドの例で、グレーの帯で示されています。

![Anomaly detection band](../images/metrics4.png)

異常検知の除外ウィンドウの設定は、CloudWatch コンソール、[CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html)、または AWS SDK のいずれかを使用して行うことができます。
