# パーセンタイルの重要性

パーセンタイルは、モニタリングとレポーティングにおいて重要です。これは、平均値だけに頼るのではなく、データ分布のより詳細で正確な視点を提供するためです。
平均値は、パフォーマンスやユーザーエクスペリエンスに大きな影響を与える可能性のある外れ値やデータの変動などの重要な情報を隠してしまうことがあります。
一方、パーセンタイルはこれらの隠れた詳細を明らかにし、データの分布をより良く理解することができます。

[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) では、アプリケーションやインフラストラクチャ全体のレスポンスタイム、レイテンシー、エラー率などのさまざまなメトリクスを監視およびレポートするためにパーセンタイルを使用できます。
パーセンタイルにアラームを設定することで、特定のパーセンタイル値が閾値を超えた場合にアラートを受け取り、より多くの顧客に影響が及ぶ前に対策を講じることができます。

[CloudWatch のパーセンタイル](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) を使用するには、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して **statistic** を **p99** に設定します。p の後の値を任意のパーセンタイルに編集することができます。
その後、パーセンタイルのグラフを表示し、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) に追加し、これらのメトリクスにアラームを設定できます。
たとえば、レスポンスタイムの 95 パーセンタイルが特定の閾値を超えた場合にアラートを通知するように設定し、多くのユーザーが遅いレスポンスタイムを経験していることを示すことができます。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) で [CloudWatch RUM](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログから [CloudWath Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して作成されました。
使用されたクエリは以下の通りです：

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

このヒストグラムは、ページロード時間をミリ秒単位でプロットしています。
この表示では、外れ値を明確に確認することができます。
この情報は平均値を使用すると隠れてしまいます。

![Histogram](../../../images/percentiles-histogram.png)

平均値を使用して CloudWatch で表示された同じデータは、ページの読み込みに 2 秒未満かかっていることを示しています。
上のヒストグラムから、ほとんどのページは 1 秒未満で読み込まれており、外れ値があることがわかります。

![Histogram](../../../images/percentiles-average.png)

同じデータをパーセンタイル (p99) で使用すると、問題があることがわかります。
CloudWatch のグラフは、ページロードの 99% が 23 秒未満であることを示しています。

![Histogram](../../../images/percentiles-p99.png)

これをより視覚化しやすくするために、以下のグラフは平均値と 99 パーセンタイルを比較しています。
この場合、目標のページロード時間は 2 秒です。代替の [CloudWatch 統計](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html) と [Metric Math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用して他の計算を行うことができます。
この場合、パーセンタイルランク (PR) を統計 **PR(:2000)** で使用して、ページロードの 92.7% が目標の 2000ms 以内で発生していることを示しています。

![Histogram](../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスについてより深い洞察を得ることができ、問題を早期に検出し、隠れている可能性のある外れ値を特定することで顧客のエクスペリエンスを向上させることができます。
