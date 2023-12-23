# パーセンタイルの重要性

パーセンタイルは、平均値だけに依存するのではなく、データ分布のより詳細で正確な見方を提供するため、モニタリングとレポートでは重要です。平均値は時には、パフォーマンスやユーザーエクスペリエンスに大きな影響を与える可能性のある、外れ値やデータの変動などの重要な情報を隠してしまうことがあります。一方、パーセンタイルはこれらの隠された詳細を明らかにし、データがどのように分布しているかをよりよく理解するのに役立ちます。 

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) では、アプリケーションとインフラストラクチャ全体のレスポンスタイム、レイテンシー、エラーレートなど、さまざまなメトリクスのモニタリングとレポートにパーセンタイルを使用できます。パーセンタイルに対するアラームを設定することで、特定のパーセンタイル値がしきい値を超えたときにアラートを受け取り、より多くの顧客に影響を与える前にアクションを実行できます。

CloudWatch で[パーセンタイルを使用する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles)には、CloudWatch コンソールの **All metrics** でメトリクスを選択し、既存のメトリクスを使用して**統計**を **p99** に設定します。p の後の値を希望のパーセンタイルに編集できます。次に、パーセンタイルグラフを表示したり、[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) に追加したり、これらのメトリクスに対するアラームを設定できます。 たとえば、レスポンスタイムの 95 パーセンタイルが特定のしきい値を超えたときに通知するアラームを設定できます。これは、多数のユーザーが遅いレスポンスタイムを経験していることを示しています。

以下のヒストグラムは、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) で作成されており、[CloudWath Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) クエリを使用して [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) ログからデータを取得しています。使用したクエリは以下のとおりです。

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

このヒストグラムは、ページの読み込み時間をミリ秒単位でプロットしています。この表示では、外れ値を明確に確認できます。平均を使用すると、このデータは隠されてしまいます。

![ヒストグラム](../../../../images/percentiles-histogram.png)

CloudWatch で平均値を使用して同じデータを表示すると、ページの読み込みに 2 秒未満かかっていることが示されます。上記のヒストグラムから、ほとんどのページが実際には 1 秒未満で読み込まれており、外れ値が存在することがわかります。

![平均](../../../../images/percentiles-average.png)

同じデータを再びパーセンタイル(p99)を使用して表示すると、問題があることが示されます。CloudWatch のグラフは現在、99%のページ読み込みが 23 秒未満であることを示しています。

![p99](../../../../images/percentiles-p99.png)

これをより視覚的に表すために、以下のグラフは平均値と 99 パーセンタイルを比較しています。この場合、目標のページ読み込み時間は 2 秒であり、代替の [CloudWatch 統計](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean) と [メトリック数式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用して他の計算を行うことができます。 この場合、パーセントランク(PR)を統計 **PR(:2000)** とともに使用して、ページ読み込みの 92.7%が 2000ms という目標内で発生していることを示しています。

![比較](../../../../images/percentiles-comparison.png)

CloudWatch でパーセンタイルを使用することで、システムのパフォーマンスをより深く洞察し、早期に問題を検出し、そうでなければ隠されてしまう外れ値を特定することで顧客のエクスペリエンスを改善できます。
