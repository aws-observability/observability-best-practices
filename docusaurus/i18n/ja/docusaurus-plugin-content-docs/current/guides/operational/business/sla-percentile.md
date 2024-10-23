# パーセンタイルの重要性

パーセンタイルは、モニタリングとレポーティングにおいて重要です。平均値だけに頼るよりも、データ分布のより詳細で正確な見方を提供するからです。平均値は、パフォーマンスやユーザー体験に大きな影響を与える可能性のある外れ値やデータの変動など、重要な情報を隠してしまうことがあります。一方、パーセンタイルはこれらの隠れた詳細を明らかにし、データの分布をより良く理解することができます。

[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) では、アプリケーションやインフラストラクチャ全体のレスポンスタイム、レイテンシー、エラー率などのさまざまなメトリクスを監視し、報告するためにパーセンタイルを使用できます。パーセンタイルにアラームを設定することで、特定のパーセンタイル値がしきい値を超えたときにアラートを受け取り、より多くの顧客に影響が及ぶ前に対策を講じることができます。

[CloudWatch でパーセンタイルを使用する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)には、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して **statistic** を **p99** に設定します。その後、p の後の値を希望のパーセンタイルに編集できます。パーセンタイルのグラフを表示し、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)に追加し、これらのメトリクスにアラームを設定できます。例えば、レスポンスタイムの 95 パーセンタイルが特定のしきい値を超えたときに通知するアラームを設定し、かなりの割合のユーザーが遅いレスポンスタイムを経験していることを示すことができます。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) で [CloudWatch RUM](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログから [CloudWath Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して作成されました。使用されたクエリは次の通りです：

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

このヒストグラムは、ページロード時間をミリ秒単位でプロットしています。この表示では、外れ値を明確に見ることができます。平均値を使用すると、このデータは隠れてしまいます。

![Histogram](../../../images/percentiles-histogram.png)

CloudWatch で平均値を使用して同じデータを表示すると、ページの読み込みに 2 秒未満かかっていることが示されます。上のヒストグラムから、ほとんどのページが実際には 1 秒未満で読み込まれており、外れ値があることがわかります。

![Histogram](../../../images/percentiles-average.png)

同じデータをパーセンタイル（p99）で再度使用すると、問題があることがわかります。CloudWatch のグラフは、ページロードの 99% が 23 秒未満であることを示しています。

![Histogram](../../../images/percentiles-p99.png)

これをより視覚化しやすくするために、以下のグラフは平均値と 99 パーセンタイルを比較しています。この場合、目標のページロード時間は 2 秒です。代替の [CloudWatch 統計](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html) と [メトリクス数学](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用して他の計算を行うことができます。この場合、パーセンタイルランク（PR）が統計 **PR(:2000)** で使用され、ページロードの 92.7% が目標の 2000ms 以内で行われていることを示しています。

![Histogram](../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスについてより深い洞察を得ることができ、問題を早期に検出し、そうでなければ隠れてしまう外れ値を特定することで顧客の体験を向上させることができます。
