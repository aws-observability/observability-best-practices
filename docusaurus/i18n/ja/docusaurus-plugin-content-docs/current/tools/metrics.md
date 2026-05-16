# メトリクス

メトリクスは、システムのパフォーマンスに関するデータです。システムまたはリソースに関連するすべてのメトリクスを一元化された場所に集約することで、メトリクスを比較し、パフォーマンスを分析し、リソースのスケールアップやスケールインなど、より適切な戦略的意思決定を行うことができます。メトリクスは、リソースの健全性を把握し、予防的な対策を講じるためにも重要です。

メトリクスデータは基盤となるもので、[アラーム](../signals/alarms/)、異常検知、[イベント](../signals/events/)、[ダッシュボード](../tools/dashboards)などを駆動するために使用されます。

## Vended メトリクス

[CloudWatch メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)は、システムのパフォーマンスに関するデータを収集します。デフォルトでは、ほとんどの AWS サービスがリソースの無料メトリクスを提供しています。これには、[Amazon EC2](https://aws.amazon.com/ec2/) インスタンス、[Amazon RDS](https://aws.amazon.com/rds/)、[Amazon S3](https://aws.amazon.com/s3/?p=pm&c=s3&z=4) バケットなどが含まれます。

これらのメトリクスを *vended metrics* と呼びます。AWS アカウントでの vended metrics の収集に料金はかかりません。

:::info
	CloudWatch にメトリクスを送信する AWS サービスの完全なリストについては、[このページ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)を参照してください。
:::
## メトリクスのクエリ

CloudWatch の[メトリクス演算](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)機能を利用して、複数のメトリクスをクエリし、数式を使用してメトリクスをより詳細に分析できます。たとえば、次のようなクエリでメトリクス演算式を記述して Lambda のエラー率を求めることができます。

	Errors/Requests

以下は、CloudWatch コンソールでの表示例です。

![Metric math example](../images/metrics1.png)

:::info
	メトリクスの演算を使用して、データから最大限の価値を引き出し、個別のデータソースのパフォーマンスから値を導出します。
:::
CloudWatch は条件文もサポートしています。たとえば、次の値を返すには `1` レイテンシーが特定のしきい値を超える各時系列について、および `0` 他のすべてのデータポイントについては、クエリは次のようになります。

	IF(latency>threshold, 1, 0)

CloudWatch コンソールでは、このロジックを使用してブール値を作成できます。これにより、[CloudWatch アラーム](../tools/alarms)やその他のアクションをトリガーできます。これにより、派生データポイントから自動アクションを有効にできます。CloudWatch コンソールからの例を以下に示します。

![Alarm creation from a derived value](../images/metrics2.png)

:::info
	条件付きステートメントを使用して、派生値のパフォーマンスがしきい値を超えたときにアラームと通知をトリガーします。 
:::
また、次を使用することもできます。 `SEARCH` トップを表示する関数 `n` あらゆるメトリクスに対して使用できます。大量の時系列（例：数千台のサーバー）にわたって最高または最悪のパフォーマンスを示すメトリクスを可視化する場合、このアプローチにより最も重要なデータのみを表示できます。以下は、過去 5 分間の平均で CPU 消費量が最も多い上位 2 つの EC2 インスタンスを返す検索の例です。
```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```
CloudWatch コンソールでの同じビュー:

![Search query in CloudWatch metrics](../images/metrics3.png)

:::info
	を使用します。 `SEARCH` 環境内で価値のあるリソースまたは最もパフォーマンスの悪いリソースを迅速に表示し、これらを[ダッシュボード](../tools/dashboards)に表示するアプローチです。
:::
## メトリクスの収集

EC2 インスタンスのメモリやディスク容量使用率などの追加メトリクスが必要な場合は、[CloudWatch エージェント](../tools/cloudwatch_agent/)を使用して、このデータを代わりに CloudWatch にプッシュします。または、グラフィカルな方法で視覚化する必要があるカスタム処理データがあり、このデータを CloudWatch メトリクスとして表示したい場合は、`PutMetricData` API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html) を使用して、カスタムメトリクスを CloudWatch に発行します。

:::info
	[AWS SDK](https://aws.amazon.com/developer/tools/) のいずれかを使用して、ベア API ではなく CloudWatch にメトリクスデータをプッシュします。
:::
`PutMetricData` API コールはクエリ数に基づいて課金されます。使用するベストプラクティスは `PutMetricData` API を最適に使用できます。この API で Values と Counts メソッドを使用すると、1 回の呼び出しで 1 つのメトリクスあたり最大 150 個の値を発行できます `PutMetricData` リクエストを行い、このデータのパーセンタイル統計の取得をサポートします。したがって、各データポイントに対して個別の API 呼び出しを行う代わりに、すべてのデータポイントをまとめてグループ化し、単一の操作で CloudWatch にプッシュする必要があります。 `PutMetricData` API 呼び出しです。このアプローチは、次の 2 つの点でユーザーにメリットをもたらします。

1. CloudWatch の料金
1. `PutMetricData` API スロットリングを防ぐことができます

:::info
	使用する場合 `PutMetricData`、ベストプラクティスはデータを単一にバッチ処理することです `PUT` 可能な限り操作を実行します。
:::
:::info
	大量のメトリクスが CloudWatch に送信される場合は、代替アプローチとして [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html) の使用を検討してください。Embedded Metric Format は使用せず、料金も発生しないことに注意してください。 `PutMetricData`ただし、[CloudWatch Logs](../tools/logs/) の使用による課金が発生します。
:::
## 異常検出

CloudWatch には[異常検出](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)機能があり、記録されたメトリクスに基づいて*正常*な状態を学習することで、オブザーバビリティ戦略を強化します。異常検出の使用は、あらゆるメトリクスシグナル収集システムにおける[ベストプラクティス](../signals/metrics/#異常検出アルゴリズムを使用する)です。

異常検出は、2 週間の期間にわたってモデルを構築します。 

:::warning
	異常検出は、作成時点から将来に向けてのみモデルを構築します。過去にさかのぼって以前の外れ値を見つけることはありません。
:::

:::warning
	異常検出は、メトリクスにとって何が*良い*かを知ることはできず、標準偏差に基づいて何が*正常*かのみを知ることができます。
:::

:::info
	ベストプラクティスは、通常の動作が予想される時間帯のみを分析するように異常検知モデルをトレーニングすることです。トレーニングから除外する期間（夜間、週末、休日など）を定義できます。 
:::
異常検出バンドの例をここで確認できます。バンドはグレーで表示されています。

![Anomaly detection band](../images/metrics4.png)

異常検出の除外期間の設定は、CloudWatch コンソール、[CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html)、または AWS SDK のいずれかを使用して行うことができます。
