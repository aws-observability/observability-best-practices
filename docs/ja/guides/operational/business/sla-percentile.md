# パーセンタイルが重要な理由

パーセンタイルは、平均値だけに依存するのではなく、データ分布のより詳細かつ正確な視点を提供するため、モニタリングとレポートでは重要です。平均値は時に、パフォーマンスやユーザーエクスペリエンスに大きな影響を与える可能性のある、外れ値やデータの変動などの重要な情報を隠してしまうことがあります。一方、パーセンタイルはこれらの隠された詳細を明らかにし、データがどのように分布しているかをよりよく理解するのに役立ちます。 

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) では、パーセンタイルを使用して、アプリケーションやインフラストラクチャ全体のレスポンスタイム、レイテンシー、エラーレートなど、さまざまなメトリクスをモニタリングおよびレポートできます。パーセンタイルにアラームを設定することで、特定のパーセンタイル値がしきい値を超えたときにアラートを取得できるため、より多くの顧客に影響を与える前にアクションを実行できます。

[CloudWatch でパーセンタイルを使用する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles) には、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して **statistic** を **p99** に設定します。その後、p の後の値を編集して目的のパーセンタイルに変更できます。次に、パーセンタイルグラフを表示したり、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) に追加したり、これらのメトリクスにアラームを設定したりできます。たとえば、レスポンスタイムの 95 パーセンタイルが特定のしきい値を超えたときに通知するアラームを設定できます。これは、多数のユーザーが遅いレスポンスタイムを経験していることを示しています。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) で作成されており、[CloudWath Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログからデータを取得しています。使用したクエリは以下のとおりです。

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

ヒストグラムはページロード時間をミリ秒単位でプロットしています。この表示では、外れ値を明確に確認できます。平均を使用すると、このデータは隠されてしまいます。

![ヒストグラム](../../../../images/percentiles-histogram.png)

同じデータを平均値で CloudWatch に表示すると、ページロードに 2 秒未満かかっていることを示しています。上のヒストグラムから、ほとんどのページが実際には 1 秒未満でロードされており、外れ値が存在することがわかります。

![平均](../../../../images/percentiles-average.png)

同じデータをパーセンタイル(p99)で再表示すると、問題があることが示されます。CloudWatch のグラフは現在、ページロードの 99%が 23 秒未満であることを示しています。

![p99](../../../../images/percentiles-p99.png)

これをより視覚的に表すために、以下のグラフは平均値と 99 パーセンタイルを比較したものです。この場合、ターゲットのページロード時間は 2 秒です。代替の [CloudWatch 統計](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean) と [メトリック数式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)を使用して、他の計算を行うことができます。この例では、パーセンタイルランク(PR)を統計量 **PR(:2000)** で使用して、ページロードの 92.7%が 2000ms というターゲット内で発生していることを示しています。

![比較](../../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスをより深く洞察し、早期に問題を検出し、そうでなければ隠されてしまう外れ値を特定することで、顧客のエクスペリエンスを改善できます。
