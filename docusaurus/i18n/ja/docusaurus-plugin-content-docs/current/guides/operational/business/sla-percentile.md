# パーセンタイルが重要な理由

パーセンタイルは、平均値だけに依存する場合と比較して、データ分布のより詳細で正確なビューを提供するため、モニタリングとレポート作成において重要です。平均値は、パフォーマンスとユーザーエクスペリエンスに大きな影響を与える可能性のある外れ値やデータのばらつきなど、重要な情報を隠してしまうことがあります。一方、パーセンタイルは、これらの隠れた詳細を明らかにし、データがどのように分布しているかをより深く理解することができます。

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) では、パーセンタイルを使用して、アプリケーションとインフラストラクチャ全体のレスポンス時間、レイテンシー、エラー率などのさまざまなメトリクスを監視およびレポートできます。パーセンタイルにアラームを設定することで、特定のパーセンタイル値がしきい値を超えたときにアラートを受け取ることができ、より多くの顧客に影響が及ぶ前に対処できます。

[CloudWatch でパーセンタイルを使用する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles)には、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して **statistic** を **p99** に設定します。その後、p の後の値を編集して、必要なパーセンタイルに変更できます。パーセンタイルグラフを表示し、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)に追加し、これらのメトリクスにアラームを設定できます。たとえば、レスポンスタイムの 95 パーセンタイルが特定のしきい値を超えたときに通知するアラームを設定することで、かなりの割合のユーザーが遅いレスポンスタイムを経験していることを示すことができます。

以下のヒストグラムは、[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログからの [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) で作成されました。使用されたクエリは次のとおりです。

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

ヒストグラムは、ページの読み込み時間をミリ秒単位でプロットします。このビューでは、外れ値を明確に確認できます。平均値を使用すると、このデータは隠れてしまいます。

![Histogram](../../../images/percentiles-histogram.png)

CloudWatch で平均値を使用して表示された同じデータは、ページの読み込みに 2 秒未満かかっていることを示しています。上記のヒストグラムから、ほとんどのページは実際には 1 秒未満で読み込まれており、外れ値があることがわかります。

![Histogram](../../../images/percentiles-average.png)

同じデータをパーセンタイル (p99) で再度使用すると、問題があることが示され、CloudWatch グラフには、ページ読み込みの 99 パーセントが 23 秒未満で完了していることが表示されます。

![Histogram](../../../images/percentiles-p99.png)

これをより視覚化しやすくするために、以下のグラフは平均値と 99 パーセンタイルを比較しています。この場合、ターゲットのページ読み込み時間は 2 秒です。代替の [CloudWatch 統計](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean)と[メトリクス計算](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)を使用して、他の計算を行うことができます。この場合、パーセンタイルランク (PR) が統計 **PR(:2000)** とともに使用され、ページ読み込みの 92.7% がターゲットの 2000ms 以内で発生していることを示しています。

![Histogram](../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスに関するより深い洞察を得て、問題を早期に検出し、他の方法では隠れてしまう外れ値を特定することで顧客体験を向上させることができます。



