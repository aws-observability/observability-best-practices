# パーセンタイルは重要です

パーセンタイルは、平均値のみに頼るよりも、データ分布のより詳細で正確な視点を提供するため、モニタリングとレポーティングにおいて重要です。平均値では、パフォーマンスやユーザーエクスペリエンスに大きな影響を与える可能性のある外れ値やデータのばらつきなど、重要な情報が隠れてしまうことがあります。一方、パーセンタイルはこれらの隠れた詳細を明らかにし、データの分布状況をよりよく理解することができます。

[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) では、パーセンタイルを使用して、アプリケーションやインフラストラクチャ全体のレスポンス時間、レイテンシ、エラー率などさまざまなメトリクスをモニタリングおよびレポートすることができます。パーセンタイルに対してアラームを設定すると、特定のパーセンタイル値が閾値を超えた場合に通知を受け取れるため、より多くのユーザーに影響が及ぶ前に対処できます。

CloudWatch で[パーセンタイル](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)を使用するには、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して **statistic** を **p99** に設定します。その後、p の後の値を任意のパーセンタイルに編集できます。次に、パーセンタイルのグラフを表示し、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)に追加し、これらのメトリクスに対してアラームを設定できます。たとえば、レスポンス時間の 95 パーセンタイルが特定の閾値を超えた場合に通知を受け取るアラームを設定すれば、ユーザーの大部分が遅いレスポンス時間を体験していることがわかります。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) で [CloudWatch RUM](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログから [CloudWath Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して作成されました。使用したクエリは次のとおりです。

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

このヒストグラムは、ページ読み込み時間をミリ秒単位でプロットしています。この表示では、外れ値を明確に確認できます。この情報は、平均値を使用した場合は隠れてしまいます。

![ヒストグラム](../../../images/percentiles-histogram.png)

同じデータを CloudWatch の平均値で表示すると、ページの読み込みに 2 秒未満しかかかっていないことがわかります。上のヒストグラムを見ると、ほとんどのページは実際に 1 秒未満で読み込まれており、外れ値があることがわかります。

![ヒストグラム](../../../images/percentiles-average.png)

同じデータでパーセンタイル (p99) を使用すると、問題があることがわかります。CloudWatch のグラフでは、ページ読み込みの 99% が 23 秒未満であることが示されています。

![ヒストグラム](../../../images/percentiles-p99.png)

これをより視覚的に理解しやすくするため、以下のグラフでは平均値と 99 パーセンタイルを比較しています。この場合、ターゲットのページ読み込み時間は 2 秒ですが、代替の [CloudWatch 統計値](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html)と [Metric Math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用して他の計算を行うことができます。ここでは、統計値 **PR(:2000)** を使用して、ページ読み込みの 92.7% がターゲットの 2000ms 以内であることを示しています。

![ヒストグラム](../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスについてより深い洞察を得て、問題を早期に検出し、そうでなければ隠れてしまう外れ値を特定することで、お客様のエクスペリエンスを改善できます。
