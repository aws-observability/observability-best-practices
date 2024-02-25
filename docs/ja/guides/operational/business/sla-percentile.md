# パーセンタイルの重要性

パーセンタイルは、平均値だけに依存するのではなく、データ分布のより詳細で正確な見方を提供するため、モニタリングとレポートでは重要です。平均値は時には、パフォーマンスやユーザーエクスペリエンスに大きな影響を与える可能性のある、外れ値やデータの変動などの重要な情報を隠してしまうことがあります。一方、パーセンタイルはこれらの隠された詳細を明らかにし、データがどのように分布しているかをよりよく理解するのに役立ちます。 

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) では、アプリケーションとインフラストラクチャ全体のレスポンスタイム、レイテンシー、エラーレートなど、さまざまなメトリクスのモニタリングとレポートにパーセンタイルを使用できます。パーセンタイルに対するアラームを設定することで、特定のパーセンタイル値がしきい値を超えたときにアラートを受け取り、より多くの顧客に影響を与える前にアクションを実行できます。

CloudWatch で[パーセンタイルを使用する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles)には、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して**統計** を **p99** に設定します。p の後の値を希望のパーセンタイルに編集できます。次に、パーセンタイルグラフを表示したり、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) に追加したり、これらのメトリクスに対するアラームを設定できます。 たとえば、レスポンスタイムの 95 パーセンタイルが特定のしきい値を超えたときに通知するアラームを設定できます。これは、多数のユーザーが遅いレスポンスタイムを経験していることを示しています。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) で作成されており、[CloudWath Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) からのクエリを使用しています。[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログです。 使用したクエリは次のとおりです。

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

このヒストグラムは、ページの読み込み時間をミリ秒単位でプロットしています。 このビューを使用すると、外れ値を明確に確認できます。 平均を使用すると、このデータは非表示になります。

![ヒストグラム](../../../../images/percentiles-histogram.png)


平均値を使用してCloudWatchに表示されている同じデータは、ページの読み込みに2秒未満かかっていることを示しています。 上記のヒストグラムから、ほとんどのページが実際には1秒未満で読み込まれており、外れ値があることがわかります。

![ヒストグラム](../../../../images/percentiles-average.png)


同じデータを再びパーセンタイル(p99)で使用すると、問題があることが示されます。CloudWatch のグラフは現在、99%のページ読み込みが 23 秒未満であることを示しています。

![ヒストグラム](../../../../images/percentiles-p99.png)


これをより視覚化しやすくするために、以下のグラフは平均値と 99 パーセンタイルを比較しています。 この場合、ターゲットのページ読み込み時間は 2 秒であり、代替の [CloudWatch 統計](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean) と [メトリック数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用して他の計算を行うことができます。 この場合、パーセンタイルランク(PR) が統計 **PR(:2000)** とともに使用されており、ページ読み込みの 92.7%が 2000ms というターゲット内で発生していることを示しています。

![ヒストグラム](../../../../images/percentiles-comparison.png)


CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスをより深く洞察し、問題を早期に検出し、そうでなければ隠されてしまう外れ値を特定することで、顧客のエクスペリエンスを改善できます。
